const easymidi = require('../index.js');

// Monitor all MIDI inputs with a single "message" listener
easymidi.getInputs().forEach((inputName) => {
  const input = new easymidi.Input(inputName);
  input.on('message', (msg) => {
    const vals = Object.keys(msg).map((key) => `${key}: ${msg[key]}`);
    console.log(`${inputName}: ${vals.join(', ')}`);
  });
});
