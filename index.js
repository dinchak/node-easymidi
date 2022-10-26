const midi = require('@julusian/midi');
const EventEmitter = require('events').EventEmitter;

const swap = (obj) => Object.entries(obj).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});

const INPUT_TYPES = {
  0x08: 'noteoff',
  0x09: 'noteon',
  0x0A: 'poly aftertouch',
  0x0B: 'cc',
  0x0C: 'program',
  0x0D: 'channel aftertouch',
  0x0E: 'pitch',
};
const INPUT_EXTENDED_TYPES = {
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
  0xFE: 'activesense',
  0xFF: 'reset'
};
const OUTPUT_TYPES = swap(INPUT_TYPES);
const OUTPUT_EXTENDED_TYPES = swap(INPUT_EXTENDED_TYPES);

class Input extends EventEmitter {
  constructor(name, virtual) {
    super();
    this._input = new midi.input();
    this._input.ignoreTypes(false, false, false);
    this._pendingSysex = false;
    this._sysex = [];
    this.name = name;

    if (virtual) {
      this._input.openVirtualPort(name);
    } else {
      const numInputs = this._input.getPortCount();
      let found = false;
      for (let i = 0; i < numInputs; i++) {
        if (name === this._input.getPortName(i)) {
          found = true;
          this._input.openPort(i);
        }
      }
      if (!found) {
        throw new Error('No MIDI input found with name: ' + name);
      }
    }

    this._input.on('message', (deltaTime, bytes) => {
      // a long sysex can be sent in multiple chunks, depending on the RtMidi buffer size
      let proceed = true;
      if (this._pendingSysex && (bytes.length > 0)) {
        if (bytes[0] < 0x80) {
          this._sysex = this._sysex.concat(bytes);
          if (bytes[bytes.length - 1] === 0xf7) {
            const msg = { _type: 'sysex', bytes: this._sysex };
            this.emit('sysex', msg);
            this.emit('message', msg);
            sysex = [];
            this._pendingSysex = false;
          }
          proceed = false;
        }
        else {
          // ignore invalid sysex messages   
          this._sysex = [];
          this._pendingSysex = false;
        }
      }
      if (proceed) {
        const data = this.parseMessage(bytes);
        if ((data.type === 'sysex') && (bytes[bytes.length - 1] !== 0xf7)) {
          this._sysex = [...bytes];
          this._pendingSysex = true;
        }
        else {
          data.msg._type = data.type; // easy access to message type
          this.emit(data.type, data.msg);
          // also emit "message" event, to allow easy monitoring of all messages
          this.emit('message', data.msg);
          if (data.type === 'mtc') {
            this.parseMtc(data.msg);
          }
        }
      }
    });
  }

  close() {
    this._input.closePort();
  }

  isPortOpen() {
    return this._input.isPortOpen();
  }

  parseMtc(data) {
    const byteNumber = data.type;
    const smpte = [];
    let value = data.value;
    let smpteMessageCounter = 0;
    let smpteType;

    if (byteNumber === 7) {
      const bits = [];
      for (let i = 3; i >= 0; i--) {
        const bit = value & (1 << i) ? 1 : 0;
        bits.push(bit);
      }
      value = bits[3];
      smpteType = (bits[1] * 2) + bits[2];
    }
    smpte[byteNumber] = value;
    if (smpteMessageCounter !== 7) {
      smpteMessageCounter++;
      return;
    }
    if (byteNumber === 7) {
      const smpteFormatted =
        (smpte[7] * 16 + smpte[6]).toString().padStart(2, '0')
        + ':'
        + (smpte[5] * 16 + smpte[4]).toString().padStart(2, '0')
        + ':'
        + (smpte[3] * 16 + smpte[2]).toString().padStart(2, '0')
        + ':'
        + (smpte[1] * 16 + smpte[0]).toString().padStart(2, '0');

      this.emit('smpte', {
        smpte: smpteFormatted,
        smpteType,
      });
    }
  }

  parseMessage(bytes) {
    const msg = {};
    let type = 'unknown';

    if (bytes[0] >= 0xF0) {
      type = INPUT_EXTENDED_TYPES[bytes[0]];
    } else {
      type = INPUT_TYPES[bytes[0] >> 4];
      msg.channel = bytes[0] & 0xF;
    }
    if (type === 'noteoff' || type === 'noteon') {
      msg.note = bytes[1];
      msg.velocity = bytes[2];
    }
    if (type === 'cc') {
      msg.controller = bytes[1];
      msg.value = bytes[2];
    }
    if (type === 'poly aftertouch') {
      msg.note = bytes[1];
      msg.pressure = bytes[2];
    }
    if (type === 'channel aftertouch') {
      msg.pressure = bytes[1];
    }
    if (type === 'program') {
      msg.number = bytes[1];
    }
    if (type === 'pitch' || type === 'position') {
      msg.value = bytes[1] + (bytes[2] * 128);
    }
    if (type === 'sysex') {
      msg.bytes = bytes;
    }
    if (type === 'select') {
      msg.song = bytes[1];
    }
    if (type === 'mtc') {
      msg.type = (bytes[1] >> 4) & 0x07;
      msg.value = bytes[1] & 0x0F;
    }
    return {
      type,
      msg,
    };
  }
}


class Output {
  constructor(name, virtual) {
    this._output = new midi.output();
    this.name = name;

    if (virtual) {
      this._output.openVirtualPort(name);
    } else {
      const numOutputs = this._output.getPortCount();
      let found = false;
      for (let i = 0; i < numOutputs; i++) {
        if (name === this._output.getPortName(i)) {
          found = true;
          this._output.openPort(i);
        }
      }
      if (!found) {
        throw new Error('No MIDI output found with name: ' + name);
      }
    }
  }

  close() {
    this._output.closePort();
  }

  isPortOpen() {
    return this._output.isPortOpen();
  }

  send(type, args) {
    this._output.sendMessage(this.parseMessage(type, args));
  }

  parseMessage(type, args) {
    const bytes = [];

    if (OUTPUT_TYPES[type]) {
      args.channel = args.channel || 0;
      bytes.push((OUTPUT_TYPES[type] << 4) + args.channel);
    } else if (OUTPUT_EXTENDED_TYPES[type]) {
      bytes.push(OUTPUT_EXTENDED_TYPES[type]);
    } else {
      throw new Error('Unknown midi message type: ' + type);
    }

    if (type === 'noteoff' || type === 'noteon') {
      bytes.push(args.note);
      bytes.push(args.velocity);
    }
    if (type === 'cc') {
      bytes.push(args.controller);
      bytes.push(args.value);
    }
    if (type === 'poly aftertouch') {
      bytes.push(args.note);
      bytes.push(args.pressure);
    }
    if (type === 'channel aftertouch') {
      bytes.push(args.pressure);
    }
    if (type === 'program') {
      bytes.push(args.number);
    }
    if (type === 'pitch' || type === 'position') {
      bytes.push(args.value & 0x7F); // lsb
      bytes.push((args.value & 0x3F80) >> 7); // msb
    }
    if (type === 'mtc') {
      bytes.push((args.type << 4) + args.value);
    }
    if (type === 'select') {
      bytes.push(args.song);
    }
    if (type === 'sysex') {
      // sysex commands should start with 0xf0 and end with 0xf7. Throw an error if it doesn't.
      if (args.length <= 3 || args[0] !== 0xf0 || args[args.length - 1] !== 0xf7) { //
        throw new Error("sysex commands should be an array that starts with 0xf0 and end with 0xf7");
      }
      args.slice(1).forEach((arg) => bytes.push(arg)); // 0xf0 was already added at the beginning of parseMessage.
    }
    return bytes;
  }
};

// utilities
const getInputs = () => {
  const input = new midi.input();
  const inputs = [];
  for (let i = 0; i < input.getPortCount(); i++) {
    inputs.push(input.getPortName(i));
  }
  input.closePort();
  return inputs;
}

const getOutputs = () => {
  const output = new midi.output();
  const outputs = [];
  for (let i = 0; i < output.getPortCount(); i++) {
    outputs.push(output.getPortName(i));
  }
  output.closePort();
  return outputs;
}

module.exports = {
  Input,
  getInputs,
  Output,
  getOutputs,
};
