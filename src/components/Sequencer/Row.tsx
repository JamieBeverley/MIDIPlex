import React from 'react';
import {View, StyleSheet, Text, FlatList} from 'react-native';
import {RowT} from './dataTypes';
import {Cell} from './Cell';
import {CellT} from './dataTypes';
import {useStateDispatch, useStateSelector} from '../../hooks/state';
import {toggleCell} from '../../store';

const styles = StyleSheet.create({
  text: {
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    width: 30,
  },
  flatList: {
    width: '100%',
  },
  row: {
    width: '100%',
    height: '100%',
    flex: 1,
    borderWidth: 1,
    borderColor: 'red',
    // flexDirection: 'row',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    width: 1,
    height: 2,
  },
});

export interface PropType extends RowT {
  index: number;
}

const Indicator = (props: {length: number}) => {
  const beat = useStateSelector(x => x.clock.beat);
  return (
    <View
      style={{
        ...styles.indicator,
        left: `${((beat % props.length) * 100) / props.length}%`,
      }}
    />
  );
};

export const Row = (props: PropType) => {
  const dispatch = useStateDispatch();
  const cb = React.useCallback(
    (index, active) => {
      dispatch(
        toggleCell({
          rowIndex: props.index,
          cellIndex: index,
          active,
        }),
      );
    },
    [dispatch, props.index],
  );
  console.log(props.cells.map(x => x.active));
  return (
    <View style={styles.row}>
      <Text style={styles.text}>{props.note}</Text>
      <View style={{flex: 1}}>
        <FlatList<CellT>
          contentContainerStyle={{
            flexGrow: 1,
            borderWidth: 1,
            borderColor: 'blue',
          }}
          style={styles.flatList}
          data={props.cells}
          horizontal
          renderItem={({item, index}) => (
            <Cell index={index} setActive={cb} active={item.active} />
          )}
        />
        <Indicator length={props.cells.length} />
      </View>
    </View>
  );
};
