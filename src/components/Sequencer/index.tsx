import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Row} from './Row';
import {Sequencer as SequencerT} from './dataTypes';
import {repeatItem} from '../../util';
import {useClock} from '../../hooks/useClock';
import {Header} from '../Header';
const Scales = {
  major: [0, 2, 4, 5, 7, 9, 11, 12],
  minor: [0, 2, 3, 5, 7, 8, 10, 12],
  x: [],
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'column',
  },
  sequencer: {
    backgroundColor: 'black',
    color: 'white',
    width: '100%',
    flex: 1,
    alignSelf: 'stretch',
    padding: 5,
  },
  header: {
    height: 80,
  },
});

const initialState: SequencerT = {
  rows: Scales.x.map(note => ({
    note,
    cells: repeatItem(false, Math.floor(Math.random() * 0) + 16).map(
      active => ({
        active,
      }),
    ),
  })),
};

export const Sequencer = () => {
  const [state, setState] = useState<SequencerT>(initialState);
  // const state = initialState;
  // const setState = (_: any) => {};
  const [beat, setBeat] = useState<number>(0);
  // const [beatSpeed, setBeatSpeed] = useState<number>(initialBeatSpeed || -1);
  // const [tempo, setTempo] = useState<number>(initialTempo || 1);
  console.log('?');
  const tempo = 120 / 60;
  useEffect(() => {
    const int = setTimeout(() => {
      console.log(new Date().getTime());
      setBeat(beat + 1);
    }, 1000 / tempo);

    return () => {
      console.log('cleanup');
      clearTimeout(int);
    };
  });
  // const {beat} = useClock(0, 1, (120 * 1) / 60);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header beat={beat} />
      </View>
      <View style={styles.sequencer}>
        {state.rows.map(({note, cells}, index) => {
          return (
            <Row
              key={index}
              note={note}
              cells={cells}
              beat={beat}
              setCellActive={(cellIndex, value) => {
                return;
                // const newCells = [...cells];
                // newCells[cellIndex] = {active: value};
                // const newRow = {
                //   note,
                //   cells: newCells,
                // };
                // const newRows = [...state.rows];
                // newRows[index] = newRow;
                // setState({rows: newRows});
              }}
            />
          );
        })}
      </View>
    </View>
  );
};
