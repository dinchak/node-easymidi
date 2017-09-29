var midi = require('midi');
var EventEmitter = require('events').EventEmitter;

var Input = function (name, virtual) {
  this._input = new midi.input();
  this._input.ignoreTypes(false, false, false);
  if (virtual) {
    this._input.openVirtualPort(name);
  } else {
    var numInputs = this._input.getPortCount();
    var found = false;
    for (var i = 0; i < numInputs; i++) {
      if (name == this._input.getPortName(i)) {
        found = true;
        this._input.openPort(i);
      }
    }
    if (!found) {
      throw new Error('No MIDI input found with name: ' + name);
    }
  }
  var self = this;
  this._input.on('message', function (deltaTime, bytes) {
    var data = self.parseMessage(bytes);
    data.msg._type = data.type; // easy access to message type
    self.emit(data.type, data.msg);
    // also emit "message" event, to allow easy monitoring of all messages
    self.emit("message", data.msg);
  });
};

Input.prototype = Object.create(EventEmitter.prototype);

Input.prototype.close = function () {
  this._input.closePort();
};

Input.prototype.parseMessage = function (bytes) {
  var types = {
    0x08: 'noteoff',
    0x09: 'noteon',
    0x0A: 'poly aftertouch',
    0x0B: 'cc',
    0x0C: 'program',
    0x0D: 'channel aftertouch',
    0x0E: 'pitch',
  };
  var extendedTypes = {
    0xF0: 'sysex',
    0xF1: 'mtc',
    0xF2: 'position',
    0xF3: 'select',
    0xF6: 'tune',
    0xF7: 'sysex end',
    0xF8: 'clock',
    0xFA: 'start',
    0xFB: 'continue',
    0xFC: 'stop',
    0xFF: 'reset'
  };
  var type = 'unknown';
  var msg = {};
  if (bytes[0] >= 0xF0) {
    type = extendedTypes[bytes[0]];
  } else {
    type = types[bytes[0] >> 4];
    msg.channel = bytes[0] & 0xF;
  }
  if (type == 'noteoff' || type == 'noteon') {
    msg.note = bytes[1];
    msg.velocity = bytes[2];
  }
  if (type == 'cc') {
    msg.controller = bytes[1];
    msg.value = bytes[2];
  }
  if (type == 'poly aftertouch') {
    msg.note = bytes[1];
    msg.pressure = bytes[2];
  }
  if (type == 'channel aftertouch') {
    msg.pressure = bytes[1];
  }
  if (type == 'program') {
    msg.number = bytes[1];
  }
  if (type == 'pitch' || type == 'position') {
    msg.value = bytes[1] + (bytes[2] * 128);
  }
  if (type == 'sysex') {
    msg.bytes = bytes;
  }
  if (type == 'select') {
    msg.song = bytes[1];
  }
  if (type == 'mtc') {
    msg.type = (bytes[1] >> 4) & 0x07;
    msg.value = bytes[1] & 0x0F;
  }
  return {
    type: type,
    msg: msg
  };
};

function getInputs() {
  var input = new midi.input();
  var inputs = [];
  for (var i = 0; i < input.getPortCount(); i++) {
    inputs.push(input.getPortName(i));
  }
  input.closePort();
  return inputs;
}

var Output = function (name, virtual) {
  this._output = new midi.output();
  if (virtual) {
    this._output.openVirtualPort(name);
  } else {
    var numOutputs = this._output.getPortCount();
    var found = false;
    for (var i = 0; i < numOutputs; i++) {
      if (name == this._output.getPortName(i)) {
        found = true;
        this._output.openPort(i);
      }
    }
    if (!found) {
      throw new Error('No MIDI output found with name: ' + name);
    }
  }
};

Output.prototype.close = function () {
  this._output.closePort();
};

Output.prototype.send = function (type, args) {
  this._output.sendMessage(this.parseMessage(type, args));
};

Output.prototype.parseMessage = function (type, args) {
  var types = {
    'noteoff': 0x08,
    'noteon': 0x09,
    'poly aftertouch': 0x0A,
    'cc': 0x0B,
    'program': 0x0C,
    'channel aftertouch': 0x0D,
    'pitch': 0x0E
  };
  var extendedTypes = {
    'sysex': 0xF0,
    'mtc': 0xF1,
    'position': 0xF2,
    'select': 0xF3,
    'tune': 0xF6,
    'sysex end': 0xF7,
    'clock': 0xF8,
    'start': 0xFA,
    'continue': 0xFB,
    'stop': 0xFC,
    'reset': 0xFF
  };

  var bytes = [];
  if (types[type]) {
    args.channel = args.channel || 0;
    bytes.push((types[type] << 4) + args.channel);
  } else if (extendedTypes[type]) {
    bytes.push(extendedTypes[type]);
  } else {
    throw new Error('Unknown midi message type: ' + type);
  }

  if (type == 'noteoff' || type == 'noteon') {
    bytes.push(args.note);
    bytes.push(args.velocity);
  }
  if (type == 'cc') {
    bytes.push(args.controller);
    bytes.push(args.value);
  }
  if (type == 'poly aftertouch') {
    bytes.push(args.note);
    bytes.push(args.pressure);
  }
  if (type == 'channel aftertouch') {
    bytes.push(args.pressure);
  }
  if (type == 'program') {
    bytes.push(args.number);
  }
  if (type == 'pitch' || type == 'position') {
    bytes.push(args.value & 0x7F); // lsb
    bytes.push((args.value & 0x3F80) >> 7); // msb
  }
  if (type == 'mtc') {
    bytes.push((args.type << 4) + args.value);
  }
  if (type == 'select') {
    bytes.push(args.song);
  }
  if (type == 'sysex') {  
    // sysex commands should start with 0xf0 and end with 0xf7. Throw an error if it doesn't.
    if (args.length<=3 || args[0]!=0xf0 || args[args.length-1]!=0xf7) { //
      throw new Error("sysex commands should be an array that starts with 0xf0 and end with 0xf7");
    }
    args.slice(1).forEach(function(arg){bytes.push(arg);}); // 0xf0 was already added at the beginning of parseMessage.
  }
  return bytes;
};

function getOutputs() {
  var output = new midi.output();
  var outputs = [];
  for (var i = 0; i < output.getPortCount(); i++) {
    outputs.push(output.getPortName(i));
  }
  output.closePort();
  return outputs;
}

module.exports = {
  Input: Input,
  getInputs: getInputs,
  Output: Output,
  getOutputs: getOutputs
};
