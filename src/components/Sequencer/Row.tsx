import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {RowT} from './dataTypes';
import {Cell} from './Cell';
import {useStateDispatch, useStateSelector} from '../../hooks/state';
import {toggleCell} from '../../store';

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
    flex: 1,
    flexDirection: 'row',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    width: 1,
    height: '50%',
  },
});

export interface PropType extends RowT {
  index: number;
}

const Indicator = (props: {length: number}) => {
  const beat = useStateSelector(x => x.clock.beat);
  let pct;
  if (beat < 0) {
    pct = ((props.length + (beat % props.length)) * 100) / props.length;
  } else {
    pct = ((beat % props.length) * 100) / props.length;
  }
  return (
    <View
      style={{
        ...styles.indicator,
        left: `${pct}%`,
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
  return (
    <View style={styles.row}>
      <Text style={styles.text}>{props.note}</Text>
      <View style={{position: 'relative', width: '100%'}}>
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
