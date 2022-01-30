import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {CellT} from './dataTypes';

const styles = StyleSheet.create({
  innerActive: {backgroundColor: 'teal'},
  inner: {
    width: '100%',
    height: '100%',
    backgroundColor: 'blue',
  },
  outerActive: {
    backgroundColor: '#EEFFFF',
  },
  outer: {
    width: '100%',
    height: '100%',
    borderColor: '#5a5a5a',
    borderWidth: 1,
    flex: 1,
    padding: 5,
  },
});

export interface PropType extends CellT {
  index: number;
  setActive: (index: number, value: boolean) => void;
}

export const Cell = React.memo((props: PropType) => {
  const outerStyle = {
    ...styles.outer,
    ...(props.active ? styles.outerActive : {}),
  };
  return (
    <TouchableOpacity
      style={outerStyle}
      onPress={() => {
        props.setActive(props.index, !props.active);
      }}
      delayPressIn={0}
      delayPressOut={0}
    />
  );
});
