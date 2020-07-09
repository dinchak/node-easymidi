const easymidi = require('../index');

const OUTPUT_NAME = 'YOUR_OUTPUT_NAME';

const output = new easymidi.Output(OUTPUT_NAME);

output.send('noteoff', {
  note: 64,
  velocity: 0,
  channel: 0
});

output.send('noteon', {
  note: 64,
  velocity: 127,
  channel: 0
});

output.send('cc', {
  controller: 64,
  value: 127,
  channel: 0
});

output.send('poly aftertouch', {
  note: 64,
  pressure: 127,
  channel: 0
});

output.send('channel aftertouch', {
  pressure: 127,
  channel: 0
});

output.send('program', {
  number: 2,
  channel: 0
});

output.send('pitch', {
  value: 12345,
  channel: 0
});

output.send('position', {
  value: 12345
});

output.send('select', {
  song: 10
});

output.send('clock');

output.send('start');

output.send('continue');

output.send('stop');

output.send('reset');
