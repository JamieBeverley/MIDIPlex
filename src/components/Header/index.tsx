import React from 'react';
import {StyleSheet, View} from 'react-native';
import {BeatIndicator} from './BeatIndicator';
import ScaleSelector from './ScaleSelector';
import SequenceControls from './SequenceControls';

export const style = StyleSheet.create({
  header: {
    width: '100%',
    height: 40,
    borderBottomWidth: 1,
    borderColor: 'grey',
    display: 'flex',
    flexDirection: 'row',
  },
  text: {
    color: 'white',
  },
  picker: {
    color: 'white',
    width: 120,
    height: 4,
    // backgroundColor: 'blue',
    fontSize: 4,
    padding: 0,
    margin: 0,
  },
  scaleSelector: {
    borderColor: 'grey',
    borderWidth: 1,
  },
});

export const Header = () => {
  return (
    <View style={style.header}>
      <BeatIndicator />
      <ScaleSelector />
      <SequenceControls />
    </View>
  );
};
