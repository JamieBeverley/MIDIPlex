import {encode} from 'js-base64';

export class MidiClient {
  _characteristic: Characteristic;

  constructor(characteristic: Characteristic) {
    this._characteristic = characteristic;
  }

  encodeMidiNote(channel: number, midinote: number, velocity: number) {
    return encode(`${channel}-${midinote}-${velocity}|`);
  }

  playNote(
    channel: number,
    midinote: number,
    velocity: number,
    seconds: number,
  ) {
    this.noteOn(channel, midinote, velocity);
    setTimeout(() => {
      this.noteOff(channel, midinote);
    }, seconds * 1000);
  }

  noteOn(channel: number, midinote: number, velocity: number) {
    return this._characteristic.writeWithoutResponse(
      this.encodeMidiNote(channel, midinote, velocity),
    );
  }

  noteOff(channel: number, midinote: number) {
    return this._characteristic.writeWithoutResponse(
      this.encodeMidiNote(channel, midinote, 0),
    );
  }

  noteOffAll(channel: number) {
    // TODO is a buffer needed?
    for (let i = 0; i < 128; i++) {
      this.noteOff(channel, i);
    }
  }
}
