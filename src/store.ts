import {
  createSlice,
  configureStore,
  PayloadAction,
  applyMiddleware,
  Middleware,
} from '@reduxjs/toolkit';
import {Characteristic, Device} from 'react-native-ble-plx';
import {clock, ClockT} from './Clock';
import {Sequencer} from './components/Sequencer/dataTypes';
import {MidiClient} from './midiClient';
import {repeatItem} from './util';

type MIDIState =
  | 'dormant'
  | 'scanning'
  | 'connecting'
  | 'observing'
  | 'initialized'
  | 'failed';

type MIDI = {
  state: MIDIState;
  device: string;
  characteristic: string;
};

export type State = {
  sequencer: Sequencer;
  clock: ClockT;
  midi: MIDI;
};

const Scales = {
  major: [0, 2, 4, 5, 7, 9, 11, 12],
  minor: [0, 2, 3, 5, 7, 8, 10, 12],
  x: [],
};

const initialSequencer: Sequencer = {
  rows: Scales.major.map(note => ({
    note,
    cells: repeatItem(false, Math.floor(Math.random() * 0) + 16).map(
      active => ({
        active,
      }),
    ),
  })),
};

const initialMidi: MIDI = {
  state: 'dormant',
  device: '',
  characteristic: '',
};

export const stateSlice = createSlice({
  name: 'state',
  initialState: {
    sequencer: initialSequencer,
    clock: {
      beat: clock.beat,
      beatSpeed: clock.beatSpeed,
      absBeat: clock.absBeat,
      tempo: clock.tempo,
      lastBeats: [new Date().getTime()],
    },
    midi: initialMidi,
  },
  reducers: {
    toggleCell: (
      state: State,
      action: PayloadAction<{
        rowIndex: number;
        cellIndex: number;
        active: boolean;
      }>,
    ) => {
      const {rowIndex, cellIndex, active} = action.payload;
      if (
        state.sequencer.rows[rowIndex] &&
        state.sequencer.rows[rowIndex].cells[cellIndex]
      ) {
        state.sequencer.rows[rowIndex].cells[cellIndex].active = active;
      }
    },
    setBeat: (state: State, action: PayloadAction<number>) => {
      const now = new Date().getTime();
      state.clock.lastBeats = [now, ...state.clock.lastBeats.slice(0, 50)];
      // TODO Crude profiling, low-pass-filtered bpm. Move to middleware
      // const lb = state.clock.lastBeats;
      // const diffs = [];
      // for (let i = 0; i < state.clock.lastBeats.length - 1; i++) {
      //   diffs.push(lb[i] - lb[i + 1]);
      // }
      // const bpm =
      //   (1000 * 60) / (diffs.reduce((a, b) => a + b, 0) / diffs.length) / 4;
      // console.log(bpm);
      state.clock.beat = action.payload;
    },
    setTempo: (state: State, action: PayloadAction<number>) => {
      state.clock.tempo = action.payload;
    },
    setBeatSpeed: (state: State, action: PayloadAction<number>) => {
      state.clock.beatSpeed = action.payload;
    },
    setMidiState: (state: State, action: PayloadAction<MIDIState>) => {
      state.midi.state = action.payload;
    },
    setMidiDevice: (state: State, action: PayloadAction<Device | null>) => {
      if (action.payload !== null) {
        state.midi.device = action.payload.name || '';
      }
      state.midi.device = '';
    },
    setCharacteristic: (
      state: State,
      action: PayloadAction<Characteristic | null>,
    ) => {
      if (action.payload !== null) {
        state.midi.characteristic = action.payload.serviceUUID || '';
      }
      state.midi.characteristic = '';
    },
  },
});

export const {
  toggleCell,
  setBeat,
  setTempo,
  setBeatSpeed,
  setMidiState,
  setMidiDevice,
} = stateSlice.actions;

// Middleware
let client: MidiClient | null = null;
const midiMiddleware: Middleware = store => next => action => {
  if (action.type === 'setCharacteristic') {
    if (action.payload === null) {
      // TODO probaby a memory leak.
      client = null;
    } else {
      client = new MidiClient(action.payload);
    }
  } else if (action.type === 'setBeat' && client !== null) {
    const state = store.getState();
    client.playState(state.clock.beat, store.getState().sequencer.rows);
  }
  return next(action);
};

export const store = configureStore({
  reducer: stateSlice.reducer,
  middleware: [midiMiddleware],
});

export type StateDispatch = typeof store.dispatch;
clock.setBeatCallback(beat => {
  store.dispatch(setBeat(beat));
});
clock.init();
