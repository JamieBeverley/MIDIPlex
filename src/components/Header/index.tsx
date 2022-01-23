import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BeatIndicator} from './BeatIndicator';

const style = StyleSheet.create({
  header: {
    width: '100%',
    height: 50,
  },
  text: {
    color: 'white',
  },
});

/*

- beat grid

- scale
- tempo
- speed
- mod
- direction

*/

type PropType = {
  beat: number;
};

export const Header = (props: PropType) => {
  return (
    <View style={style.header}>
      <BeatIndicator beat={props.beat} length={16} />

      <Text style={style.text}>test!</Text>
    </View>
  );
};
