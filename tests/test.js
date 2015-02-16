var expect = require('chai').expect;
var easymidi = require('../index.js');

var input = new easymidi.Input('test input', true);
var output = new easymidi.Output('test output', true);

// route send to input
output.send = function (type, args) {
  input._input.emit('message', -1, output.parseMessage(type, args));
};

it('receives a noteon message', function (done) {
  input.once('noteon', function (data) {
    expect(data.note).to.equal(30);
    expect(data.velocity).to.equal(11);
    expect(data.channel).to.equal(10);
    done();
  });
  output.send('noteon', {
    note: 30,
    velocity: 11,
    channel: 10
  });
});

it('receives a noteoff message', function (done) {
  input.once('noteoff', function (data) {
    expect(data.note).to.equal(10);
    expect(data.velocity).to.equal(0);
    expect(data.channel).to.equal(0);
    done();
  });
  output.send('noteoff', {
    note: 10,
    velocity: 0,
    channel: 0
  });
});

it('receives a cc message', function (done) {
  input.once('cc', function (data) {
    expect(data.controller).to.equal(100);
    expect(data.value).to.equal(127);
    expect(data.channel).to.equal(10);
    done();
  });
  output.send('cc', {
    controller: 100,
    value: 127,
    channel: 10
  });
});

it('receives a program message', function (done) {
  input.once('program', function (data) {
    expect(data.number).to.equal(100);
    expect(data.channel).to.equal(10);
    done();
  });
  output.send('program', {
    number: 100,
    channel: 10
  });
});

it('receives a channel aftertouch message', function (done) {
  input.once('channel aftertouch', function (data) {
    expect(data.pressure).to.equal(100);
    expect(data.channel).to.equal(10);
    done();
  });
  output.send('channel aftertouch', {
    pressure: 100,
    channel: 10
  });
});

it('receives a pitch message', function (done) {
  input.once('pitch', function (data) {
    expect(data.value).to.equal(66);
    expect(data.channel).to.equal(5);
    done();
  });
  output.send('pitch', {
    value: 66,
    channel: 5
  });
});

it('receives a position message', function (done) {
  input.once('position', function (data) {
    expect(data.value).to.equal(255);
    done();
  });
  output.send('position', {
    value: 255
  });
});

it('receives a mtc message', function (done) {
  input.once('mtc', function (data) {
    expect(data.type).to.equal(7);
    expect(data.value).to.equal(15);
    done();
  });
  output.send('mtc', {
    type: 7,
    value: 15
  });
});

it('receives a select message', function (done) {
  input.once('select', function (data) {
    expect(data.song).to.equal(127);
    done();
  });
  output.send('select', {
    song: 127
  });
});

it('receives a clock message', function (done) {
  input.once('clock', function (data) {
    done();
  });
  output.send('clock');
});

it('receives a start message', function (done) {
  input.once('start', function (data) {
    done();
  });
  output.send('start');
});

it('receives a continue message', function (done) {
  input.once('continue', function (data) {
    done();
  });
  output.send('continue');
});

it('receives a stop message', function (done) {
  input.once('stop', function (data) {
    done();
  });
  output.send('stop');
});

it('receives a reset message', function (done) {
  input.once('reset', function (data) {
    done();
  });
  output.send('reset');
});

input.close();
output.close();
