const easymidi = require('../index.js');

const INPUT_NAME = 'YOUR_INPUT_NAME';

const input = new easymidi.Input(INPUT_NAME);

input.on('noteoff', msg => console.log('noteoff', msg.note, msg.velocity, msg.channel));

input.on('noteon', msg => console.log('noteon', msg.note, msg.velocity, msg.channel));

input.on('poly aftertouch', msg => console.log('poly aftertouch', msg.note, msg.pressure, msg.channel));

input.on('cc', msg => console.log('cc', msg.controller, msg.value, msg.channel));

input.on('program', msg => console.log('program', msg.number, msg.channel));

input.on('channel aftertouch', msg => console.log('channel aftertouch', msg.pressure, msg.channel));

input.on('pitch', msg => console.log('pitch', msg.value, msg.channel));

input.on('position', msg => console.log('position', msg.value));

input.on('select', msg => console.log('select', msg.song));

input.on('clock', () => console.log('clock'));

input.on('start', () => console.log('start'))

input.on('continue', () => console.log('continue'));

input.on('stop', () => console.log('stop'));

input.on('reset', () => console.log('reset'));
