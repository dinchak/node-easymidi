const easymidi = require('../index.js');

// Connect to first available midi port
const inputs = easymidi.getInputs();
if (inputs.length <= 0) {
  console.log('No midi device found');
  process.exit(1);
}
console.log('Connecting to: ' + inputs[0]);
const input = new easymidi.Input(inputs[0]);

// SMPTE Types
// 0 = 24 fps
// 1 = 25 fps
// 2 = 30 fps (Drop-Frame)
// 3 = 30 fps
input.on('smpte', (smpte) => {
  console.log(`smpte: ${smpte.smpte} – smpteType: ${smpte.smpteType}`);
});
