import {encode} from 'js-base64';
import {Characteristic} from 'react-native-ble-plx';
import {RowT} from './components/Sequencer/dataTypes';

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

  playState(beat: number, rows: RowT[]) {
    rows.forEach(({note, cells}) => {
      if (cells[beat % cells.length].active) {
        this.playNote(2, note + 48, 100, 1);
      }
    });
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
