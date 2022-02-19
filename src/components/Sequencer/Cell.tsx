import React from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {CellT} from './dataTypes';

const styles = StyleSheet.create({
  cellActive: {
    backgroundColor: '#e91e63',
  },
  cell: {
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 20,
    width: '100%',
    height: '100%',
    borderColor: '#5a5a5a',
    borderWidth: 1,
    flexGrow: 1,
    flex: 1,
  },
});

export interface PropType extends CellT {
  index: number;
  setActive: (index: number, value: boolean) => void;
}

export const Cell = React.memo((props: PropType) => {
  const cellStyle = {
    ...styles.cell,
    ...(props.active ? styles.cellActive : {}),
  };
  return (
    <TouchableWithoutFeedback
      style={cellStyle}
      onPressIn={() => {
        props.setActive(props.index, !props.active);
      }}
      delayPressIn={0}
      delayPressOut={0}>
      <View style={cellStyle} />
    </TouchableWithoutFeedback>
  );
});
