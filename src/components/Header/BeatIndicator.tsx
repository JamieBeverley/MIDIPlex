import React from 'react';
import {Text} from 'react-native';
import {View, StyleSheet} from 'react-native';
import {useStateSelector} from '../../hooks/state';
import {Indicator} from '../Sequencer/Indicator';

const styles = StyleSheet.create({
  beatIndicator: {
    width: 80,
    height: '100%',
    // borderWidth: 1,
    // borderColor: 'grey',
  },
  text: {
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    width: '50%',
  },
  textContainer: {
    // borderBottomWidth: 1,
    borderColor: 'grey',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
});

export const BeatIndicator = () => {
  // const beat = useStateSelector(x => x.clock.beat);
  const beat = 0;

  return (
    <View style={styles.beatIndicator}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{beat % 16}</Text>
        <Text style={styles.text}>{beat % 4096}</Text>
      </View>
      <Indicator length={16} style={{width: `${100 / 16}%`}} />
    </View>
  );
};
