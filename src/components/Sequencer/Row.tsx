import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {RowT} from './dataTypes';
import {Cell} from './Cell';

const styles = StyleSheet.create({
  text: {
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    width: 30,
  },
  row: {
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'row',
  },
});

export interface PropType extends RowT {
  setCellActive: (cellIndex: number, value: boolean) => void;
  beat: number;
}

export const Row = (props: PropType) => {
  return (
    <View style={styles.row}>
      <Text style={styles.text}>{props.note}</Text>
      {props.cells.map(({...cellProp}, index) => (
        <Cell
          key={index}
          {...cellProp}
          setActive={active => {
            props.setCellActive(index, active);
          }}
          beatActive={props.beat % props.cells.length === index}
        />
      ))}
    </View>
  );
};
