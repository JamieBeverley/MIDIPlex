import {
  createSlice,
  configureStore,
  PayloadAction,
  Middleware,
} from '@reduxjs/toolkit';
import {Characteristic, Device} from 'react-native-ble-plx';
import {clock, ClockT} from './Clock';
import {CellT, RowT, Sequencer} from './components/Sequencer/dataTypes';
import {MidiClient} from './midiClient';
import {repeatItem} from './util';
import {ScaleName, Scales} from './scale';

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
  scale: ScaleName;
  sequencer: Sequencer;
  clock: ClockT;
  midi: MIDI;
};

const initialScaleName: ScaleName = 'major';

const initialSequencer: Sequencer = {
  rows: Scales[initialScaleName].map(note => ({
    note,
    cells: repeatItem(false, Math.floor(Math.random() * 8) + 8).map(active => ({
      active,
    })),
  })),
};

const initialMidi: MIDI = {
  state: 'dormant',
  device: '',
  characteristic: '',
};

const initialClock: ClockT = {
  beat: clock.beat,
  beatSpeed: clock.beatSpeed,
  absBeat: clock.absBeat,
  tempo: clock.tempo,
  lastBeats: [new Date().getTime()],
};

export const stateSlice = createSlice({
  name: 'state',
  initialState: {
    scale: initialScaleName,
    sequencer: initialSequencer,
    clock: initialClock,
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
    setScale: (state: State, action: PayloadAction<ScaleName>) => {
      const scale = Scales[action.payload];
      let newRows: RowT[] = [];
      for (let i = 0; i < scale.length; i++) {
        const cells: CellT[] = state.sequencer.rows[i]
          ? state.sequencer.rows[i].cells
          : repeatItem({active: false}, 8);

        newRows.push({
          note: scale[i],
          cells,
        });
      }
      state.scale = action.payload;
      state.sequencer.rows = newRows;
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
  setScale,
} = stateSlice.actions;

// Middleware
let client: MidiClient | null = null;
const midiMiddleware: Middleware = store => next => action => {
  if (action.type === 'state/setCharacteristic') {
    if (action.payload === null) {
      // TODO probaby a memory leak.
      client = null;
    } else {
      client = new MidiClient(action.payload);
    }
  } else if (action.type === 'state/setBeat' && client !== null) {
    const state = store.getState();
    client.playState(state.clock.beat, store.getState().sequencer.rows);
  } else if (action.type === 'state/setBeatSpeed') {
    clock.setBeatSpeed(action.payload);
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
