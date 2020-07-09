const expect = require('chai').expect;
const easymidi = require('../index.js');

const input = new easymidi.Input('test input', true);
const output = new easymidi.Output('test output', true);

// route send to input
output.send = (type, args) => {
  input._input.emit('message', -1, output.parseMessage(type, args));
};

it('receives a noteon message', (done) => {
  input.once('noteon', (data) => {
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

it('receives a noteoff message', (done) => {
  input.once('noteoff', (data) => {
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

it('receives a cc message', (done) => {
  input.once('cc', (data) => {
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

it('receives a program message', (done) => {
  input.once('program', (data) => {
    expect(data.number).to.equal(100);
    expect(data.channel).to.equal(10);
    done();
  });
  output.send('program', {
    number: 100,
    channel: 10
  });
});

it('receives a channel aftertouch message', (done) => {
  input.once('channel aftertouch', (data) => {
    expect(data.pressure).to.equal(100);
    expect(data.channel).to.equal(10);
    done();
  });
  output.send('channel aftertouch', {
    pressure: 100,
    channel: 10
  });
});

it('receives a pitch message', (done) => {
  input.once('pitch', (data) => {
    expect(data.value).to.equal(66);
    expect(data.channel).to.equal(5);
    done();
  });
  output.send('pitch', {
    value: 66,
    channel: 5
  });
});

it('receives a position message', (done) => {
  input.once('position', (data) => {
    expect(data.value).to.equal(255);
    done();
  });
  output.send('position', {
    value: 255
  });
});

it('receives a mtc message', (done) => {
  input.once('mtc', (data) => {
    expect(data.type).to.equal(7);
    expect(data.value).to.equal(15);
    done();
  });
  output.send('mtc', {
    type: 7,
    value: 15
  });
});

it('receives a select message', (done) => {
  input.once('select', (data) => {
    expect(data.song).to.equal(127);
    done();
  });
  output.send('select', {
    song: 127
  });
});

it('receives a clock message', (done) => {
  input.once('clock', () => {
    done();
  });
  output.send('clock');
});

it('receives a start message', (done) => {
  input.once('start', () => {
    done();
  });
  output.send('start');
});

it('receives a continue message', (done) => {
  input.once('continue', () => {
    done();
  });
  output.send('continue');
});

it('receives a stop message', (done) => {
  input.once('stop', () => {
    done();
  });
  output.send('stop');
});

it('receives a reset message', (done) => {
  input.once('reset', () => {
    done();
  });
  output.send('reset');
});

input.close();
output.close();
