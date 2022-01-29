import React from 'react';
import {TouchableOpacity, StyleSheet, View} from 'react-native';
import {CellT} from './dataTypes';

const styles = StyleSheet.create({
  innerActive: {backgroundColor: 'teal'},
  innerBeatActive: {},
  inner: {
    width: '100%',
    height: '100%',
  },
  outerActive: {},
  outerBeatActive: {
    borderColor: 'white',
    borderWidth: 1,
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
  beatActive: boolean;
}

export const Cell = React.memo((props: PropType) => {
  const outerStyle = {
    ...styles.outer,
    ...(props.active ? styles.outerActive : {}),
    ...(props.beatActive ? styles.outerBeatActive : {}),
  };
  const innerStyle = {
    ...styles.inner,
    ...(props.active ? styles.innerActive : {}),
    ...(props.beatActive ? styles.innerBeatActive : {}),
  };
  return (
    <TouchableOpacity
      style={outerStyle}
      onPress={() => {
        props.setActive(props.index, !props.active);
      }}>
      <View style={innerStyle} />
    </TouchableOpacity>
  );
});
