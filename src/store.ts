import {createSlice, configureStore, PayloadAction} from '@reduxjs/toolkit';
import {clock, ClockT} from './Clock';
import {Sequencer} from './components/Sequencer/dataTypes';
import {repeatItem} from './util';

export type State = {
  sequencer: Sequencer;
  clock: ClockT;
};

const Scales = {
  major: [0, 2, 4, 5, 7, 9, 11, 12],
  minor: [0, 2, 3, 5, 7, 8, 10, 12],
  x: [],
};

const sequencer: Sequencer = {
  rows: Scales.major.map(note => ({
    note,
    cells: repeatItem(false, Math.floor(Math.random() * 0) + 16).map(
      active => ({
        active,
      }),
    ),
  })),
};

export const stateSlice = createSlice({
  name: 'state',
  initialState: {
    sequencer,
    clock: {
      beat: clock.beat,
      beatSpeed: clock.beatSpeed,
      tempo: clock.tempo,
      lastBeats: [new Date().getTime()],
    },
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
        console.log('toggle');

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
  },
});

export const {toggleCell, setBeat, setTempo, setBeatSpeed} = stateSlice.actions;

export const store = configureStore({
  reducer: stateSlice.reducer,
});

export type StateDispatch = typeof store.dispatch;

clock.setBeatCallback(beat => {
  store.dispatch(setBeat(beat));
});
clock.init();
