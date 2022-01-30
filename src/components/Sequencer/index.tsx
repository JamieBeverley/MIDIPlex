import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {Row} from './Row';
import {RowT} from './dataTypes';
import {useClock} from '../../hooks/useClock';
import {Header} from '../Header';
import {useStateSelector, useStateDispatch} from '../../hooks/state';

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
export const Sequencer = () => {
  const state = useStateSelector(x => x.sequencer);
  const dispatch = useStateDispatch();
  // const {beat} = useClock();

  // const [state, setState] = useState<SequencerT>(initialState);

  // const setCellActive = React.useCallback(
  //   (note, cellIndex, value) => {
  //     const rowIndex = state.rows.findIndex(x => x.note === note);
  //     if (rowIndex < 0) {
  //       return;
  //     }
  //     const row = state.rows[rowIndex];
  //     const newCells = [...row.cells];
  //     newCells[cellIndex] = {active: value};
  //     const newRow = {
  //       note,
  //       cells: newCells,
  //     };
  //     const newRows = [...state.rows];
  //     newRows[rowIndex] = newRow;

  //     setState({rows: newRows});
  //   },
  //   [state],
  // );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header beat={0} />
      </View>
      <FlatList<RowT>
        style={styles.sequencer}
        data={state.rows}
        renderItem={({item, index}) => (
          <Row note={item.note} cells={item.cells} index={index} />
        )}
      />
      {/* <View style={styles.sequencer}>
        {state.rows.map(({note, cells}, index) => {
          return (
            <Row
              key={index}
              note={note}
              cells={cells}
              beat={beat}
              setCellActive={setCellActive}
            />
          );
        })}
      </View> */}
    </View>
  );
};
