import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Row} from './Row';
import {Header} from '../Header';
import {useStateSelector} from '../../hooks/state';

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
    height: 200,
    flex: 1,
    alignSelf: 'stretch',
  },
  header: {
    height: 80,
  },
});

export const Sequencer = () => {
  const state = useStateSelector(x => x.sequencer);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header beat={0} />
      </View>
      <View style={styles.sequencer}>
        {state.rows.map(({note, cells}, index) => (
          <Row key={index} note={note} cells={cells} index={index} />
        ))}
      </View>
      {/* <FlatList<RowT>
        style={styles.sequencer}
        data={state.rows}
        contentContainerStyle={{flexGrow: 1}}
        renderItem={({item, index}) => (
          <Row note={item.note} cells={item.cells} index={index} />
        )}
      /> */}
    </View>
  );
};
