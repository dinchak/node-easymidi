type SimpleEvents =
  | 'noteoff'
  | 'noteon'
  | 'poly aftertouch'
  | 'cc'
  | 'program'
  | 'channel aftertouch'
  | 'pitch'
;

type ExtendedEvents = 
  | 'sysex'
  | 'mtc'
  | 'position'
  | 'select'
  | 'tune'
  | 'sysex end'
  | 'clock'
  | 'start'
  | 'continue'
  | 'stop'
  | 'activesense'
  | 'reset'
;

type MidiEvent = SimpleEvents | ExtendedEvents | 'message';

type Message = {
  note?: number,
  velocity?: number,
  channel?: number,
  controller?: number,
  pressure?: number,
  value?: number,
  song?: number,
};

declare class Input {
  constructor(name: string, virtual?: boolean);
  name: string;
  on(event: MidiEvent, cb: (data: Message & { _type: MidiEvent }) => void): void;
};

declare class Output {
  constructor(name: string, virtual?: boolean);
  send(event: MidiEvent, data: Message): void;
};

const getInputs = ():string[] => {};
const getOutputs = ():string[] => {};

export = { Input, Output, getInputs, getOutputs };