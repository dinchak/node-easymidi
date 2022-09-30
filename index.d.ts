import { EventEmitter } from "events";

export type Channel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export interface Note {
  note: number;
  velocity: number;
  channel: Channel;
}

export interface PolyAfterTouch {
  note: number;
  pressure: number;
  channel: Channel;
}

export interface ControlChange {
  controller: number;
  value: number;
  channel: Channel;
}

export interface Program {
  number: number;
  channel: Channel;
}

export interface ChannelAfterTouch {
  pressure: number;
  channel: Channel;
}

export interface Pitch {
  value: number;
  channel: Channel;
}

export interface Position {
  value: number;
}

export interface Mtc {
  type: number;
  value: number;
}

export interface Select {
  song: number;
}

export interface Sysex {
  bytes: number[];
}

export declare class Input extends EventEmitter {
  constructor(name: string, virtual?: boolean);
  name: string;
  on(evt: "noteon" | "noteoff", handler: (param: Note) => void): this;
  on(evt: "poly aftertouch", handler: (param: PolyAfterTouch) => void): this;
  on(evt: "cc", handler: (param: ControlChange) => void): this;
  on(evt: "program", handler: (param: Program) => void): this;
  on(evt: "channel aftertouch", handler: (param: ChannelAfterTouch) => void): this;
  on(evt: "pitch", handler: (param: Pitch) => void): this;
  on(evt: "position", handler: (param: Position) => void): this;
  on(evt: "mtc", handler: (param: Mtc) => void): this;
  on(evt: "select", handler: (param: Select) => void): this;
  on(evt: "clock", handler: () => void): this;
  on(evt: "start", handler: () => void): this;
  on(evt: "continue", handler: () => void): this;
  on(evt: "stop", handler: () => void): this;
  on(evt: "activesense", handler: () => void): this;
  on(evt: "reset", handler: () => void): this;
  on(evt: "sysex", handler: (param: Sysex) => void): this;
  close(): void;
  isPortOpen(): boolean;
}

export declare class Output {
  constructor(name: string, virtual?: boolean);
  name: string;
  send(evt: "noteon", param: Note): void;
  send(evt: "noteoff", param: Note): void;
  send(evt: "poly aftertouch", param: PolyAfterTouch): void;
  send(evt: "cc", param: ControlChange): void;
  send(evt: "program", param: Program): void;
  send(evt: "channel aftertouch", param: ChannelAfterTouch): void;
  send(evt: "pitch", param: Pitch): void;
  send(evt: "position", param: Position): void;
  send(evt: "mtc", param: Mtc): void;
  send(evt: "select", param: Select): void;
  send(evt: "clock"): void;
  send(evt: "start"): void;
  send(evt: "continue"): void;
  send(evt: "stop"): void;
  send(evt: "activesense"): void;
  send(evt: "reset"): void;
  send(evt: "sysex", param: Array<number>): void;
  close(): void;
  isPortOpen(): boolean;
}

export declare function getInputs(): string[];
export declare function getOutputs(): string[];
