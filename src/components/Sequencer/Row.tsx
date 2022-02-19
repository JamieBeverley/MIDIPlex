import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {RowT} from './dataTypes';
import {Cell} from './Cell';
import {useStateDispatch} from '../../hooks/state';
import {toggleCell} from '../../store';
import {Indicator} from './Indicator';

const styles = StyleSheet.create({
  text: {
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    width: 30,
  },
  buttons: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
  },
  row: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
  },
});

export interface PropType extends RowT {
  index: number;
}

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
  return (
    <View style={styles.row}>
      <Text style={styles.text}>{props.note}</Text>
      <View style={{position: 'relative', width: '100%', flex: 1}}>
        <View style={styles.buttons}>
          {props.cells.map(({active}, index) => (
            <Cell key={index} index={index} setActive={cb} active={active} />
          ))}
        </View>
        <Indicator length={props.cells.length} />
      </View>
    </View>
  );
};
