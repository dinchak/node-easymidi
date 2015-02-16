var easymidi = require('../index.js');

// create virtual midi input named 'input test'
var input = new easymidi.Input('input test', true);

input.on('noteoff', function (msg) {
  console.log('noteoff', msg.note, msg.velocity, msg.channel);
});

input.on('noteon', function (msg) {
  console.log('noteon', msg.note, msg.velocity, msg.channel);
});

input.on('poly aftertouch', function (msg) {
  console.log('poly aftertouch', msg.note, msg.pressure, msg.channel);
});

input.on('cc', function (msg) {
  console.log('cc', msg.controller, msg.value, msg.channel);
});

input.on('program', function (msg) {
  console.log('program', msg.number, msg.channel);
});

input.on('channel aftertouch', function (msg) {
  console.log('channel aftertouch', msg.pressure, msg.channel);
});

input.on('pitch', function (msg) {
  console.log('pitch', msg.value, msg.channel);
});

input.on('position', function (msg) {
  console.log('position', msg.value);
});

input.on('select', function (msg) {
  console.log('select', msg.song);
});

input.on('clock', function () {
  console.log('clock');
});

input.on('start', function () {
  console.log('start');
});

input.on('continue', function () {
  console.log('continue');
});

input.on('stop', function () {
  console.log('stop');
});

input.on('reset', function () {
  console.log('reset');
});
