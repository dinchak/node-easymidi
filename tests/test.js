const { describe, it } = require('node:test');
const assert = require('node:assert');
const easymidi = require('../index.js');

describe('easymidi', () => {
  const input = new easymidi.Input('test input', true);
  const output = new easymidi.Output('test output', true);

  // route send to input
  output.send = (type, args) => {
    input._input.emit('message', -1, output.parseMessage(type, args));
  };

  it('receives a noteon message', (_, done) => {
    input.once('noteon', (data) => {
      assert.strictEqual(data.note, 30);
      assert.strictEqual(data.velocity, 11);
      assert.strictEqual(data.channel, 10);
      done();
    });
    output.send('noteon', {
      note: 30,
      velocity: 11,
      channel: 10
    });
  });

  it('receives a noteoff message', (_, done) => {
    input.once('noteoff', (data) => {
      assert.strictEqual(data.note, 10);
      assert.strictEqual(data.velocity, 0);
      assert.strictEqual(data.channel, 0);
      done();
    });
    output.send('noteoff', {
      note: 10,
      velocity: 0,
      channel: 0
    });
  });

  it('receives a cc message', (_, done) => {
    input.once('cc', (data) => {
      assert.strictEqual(data.controller, 100);
      assert.strictEqual(data.value, 127);
      assert.strictEqual(data.channel, 10);
      done();
    });
    output.send('cc', {
      controller: 100,
      value: 127,
      channel: 10
    });
  });

  it('receives a program message', (_, done) => {
    input.once('program', (data) => {
      assert.strictEqual(data.number, 100);
      assert.strictEqual(data.channel, 10);
      done();
    });
    output.send('program', {
      number: 100,
      channel: 10
    });
  });

  it('receives a channel aftertouch message', (_, done) => {
    input.once('channel aftertouch', (data) => {
      assert.strictEqual(data.pressure, 100);
      assert.strictEqual(data.channel, 10);
      done();
    });
    output.send('channel aftertouch', {
      pressure: 100,
      channel: 10
    });
  });

  it('receives a pitch message', (_, done) => {
    input.once('pitch', (data) => {
      assert.strictEqual(data.value, 66);
      assert.strictEqual(data.channel, 5);
      done();
    });
    output.send('pitch', {
      value: 66,
      channel: 5
    });
  });

  it('receives a position message', (_, done) => {
    input.once('position', (data) => {
      assert.strictEqual(data.value, 255);
      done();
    });
    output.send('position', {
      value: 255
    });
  });

  it('receives a mtc message', (_, done) => {
    input.once('mtc', (data) => {
      assert.strictEqual(data.type, 7);
      assert.strictEqual(data.value, 15);
      done();
    });
    output.send('mtc', {
      type: 7,
      value: 15
    });
  });

  it('receives a select message', (_, done) => {
    input.once('select', (data) => {
      assert.strictEqual(data.song, 127);
      done();
    });
    output.send('select', {
      song: 127
    });
  });

  it('receives a clock message', (_, done) => {
    input.once('clock', () => {
      done();
    });
    output.send('clock');
  });

  it('receives a start message', (_, done) => {
    input.once('start', () => {
      done();
    });
    output.send('start');
  });

  it('receives a continue message', (_, done) => {
    input.once('continue', () => {
      done();
    });
    output.send('continue');
  });

  it('receives a stop message', (_, done) => {
    input.once('stop', () => {
      done();
    });
    output.send('stop');
  });

  it('receives a reset message', (_, done) => {
    input.once('reset', () => {
      done();
    });
    output.send('reset');
  });

  input.close();
  output.close();
});
