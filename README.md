# node-easymidi
node-easymidi is a simple event-based MIDI messaging wrapper for [node-midi](https://github.com/justinlatimer/node-midi).

# Installation
Install with NPM:

```
npm install easymidi
```

# Usage Overview
The module can interface with existing MIDI inputs/outputs or create virtual inputs/outputs.  Here's a simple example to listen for note on events from an existing MIDI input:

```javascript
var easymidi = require('easymidi');
var input = new easymidi.Input('MIDI Input Name');
input.on('noteon', function (msg) {
  // do something with msg
});
```

Here's an example of sending a note on message to an existing MIDI output:

```javascript
var easymidi = require('easymidi');
var output = new easymidi.Output('MIDI Output Name');
output.send('noteon', {
  note: 64,
  velocity: 127,
  channel: 3
});
```

The Input and Output objects are [EventEmitters](http://nodejs.org/api/events.html#events_class_events_eventemitter) and you can use the EventEmitter functions such as `once()`, `removeListener()`, and `removeAllListeners()` as well.

# Virtual Devices
Virtual devices can be created by passing a `true` argument to the Input or Output constructors:

```javascript
var virtualInput = new easymidi.Input('Virtual input name', true);
var virtualOutput = new easymidi.Output('Virtual output name', true);
```

# Device Lists
You can get an array of existing MIDI input or output names using the `getInputs()` and `getOutputs` functions:

```javascript
var inputs = easymidi.getInputs();
var outputs = easymidi.getOutputs();
```

# Closing Devices
When you're finished with a MIDI device you can `close()` it:

```javascript
var input = new easymidi.Input('My input', true);
input.close();

var output = new easymidi.Output('My output', true);
output.close();
```

# Message Reference
The following table describes the MIDI message types that are supported and the parameters of each:

| Type               | Parameter          | Parameter        | Parameter      |
|--------------------|--------------------|------------------|----------------|
| noteon             | note [0-127]       | velocity [0-127] | channel [0-15] |
| noteoff            | note [0-127]       | velocity [0-127] | channel [0-15] |
| poly aftertouch    | note [0-127]       | velocity [0-127] | channel [0-15] |
| cc                 | controller [0-127] | value [0-127]    | channel [0-15] |
| program            | number [0-127]     |                  | channel [0-15] |
| channel aftertouch | pressure [0-127]   |                  | channel [0-15] |
| pitch              | value [0-16384]    |                  | channel [0-15] |
| position           | value [0-16384]    |                  |                |
| mtc                | type [0-7]         | value [0-15]     |                |
| select             | song [0-127]       |                  |                |
| clock              |                    |                  |                |
| start              |                    |                  |                |
| continue           |                    |                  |                |
| stop               |                    |                  |                |
| activesense        |                    |                  |                |
| reset              |                    |                  |                |
| sysex              | bytes (variable length array) |             |                | 

# Examples

Receive a noteon message:

```javascript
input.on('noteon', function (params) {
  // params = {note: ..., velocity: ..., channel: ...}
});
```

Send a control change message:

```javascript
output.send('cc', {
  controller: 37,
  value: 80,
  channel: 0
})
```

Listen for midi clock messages:

```javascript
input.on('clock', function () {
  // do something on every clock tick
});
```

Send a sysex message.  
Throws an error if array does not start with 0xf0 (240) and end with 0xf7 (247).
```javascript
output.send('sysex',[240, 126, 1, 6, 1, 247]);
```

See the [example programs](https://github.com/dinchak/node-easymidi/tree/master/examples) for more examples.
