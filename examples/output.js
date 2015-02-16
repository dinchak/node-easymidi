var easymidi = require('../index');

// create virtual midi output named 'test output'
var output = new easymidi.Output('test output', true);

output.send({
  type: 'noteoff',
  note: 64,
  velocity: 0,
  channel: 0
});

output.send({
  type: 'noteon',
  note: 64,
  velocity: 127,
  channel: 0
});

output.send({
  type: 'cc',
  controller: 64,
  value: 127,
  channel: 0
});

output.send({
  type: 'poly aftertouch',
  note: 64,
  pressure: 127,
  channel: 0
});

output.send({
  type: 'channel aftertouch',
  pressure: 127,
  channel: 0
});

output.send({
  type: 'program',
  number: 2,
  channel: 0
});

output.send({
  type: 'pitch',
  msb: 10,
  lsb: 64,
  channel: 0
});

output.send({
  type: 'position',
  msb: 10,
  lsb: 64
});

output.send({
  type: 'select',
  song: 10
});

output.send('clock');

output.send('start');

output.send('continue');

output.send('stop');

output.send('reset');
