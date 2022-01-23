import React from 'react';
import {View, StyleSheet} from 'react-native';
import {repeatItem} from '../../util';

const styles = StyleSheet.create({
  beat: {
    borderColor: 'white',
    borderWidth: 1,
    width: '100%',
  },
  container: {
    width: 10,
    height: '10%',
    flexDirection: 'row',
  },
  active: {
    backgroundColor: 'teal',
  },
});

export type PropType = {
  beat: number;
  length: number;
};

export const BeatIndicator = (props: PropType) => {
  const {beat, length} = props;
  return (
    <View style={styles.container}>
      {repeatItem(null, props.length).map((_, index) => {
        return (
          <View
            key={index}
            style={{
              ...styles.beat,
              ...(beat % length === index ? styles.active : {}),
            }}
          />
        );
      })}
    </View>
  );
};
