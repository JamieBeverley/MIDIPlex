import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {repeatItem} from '../../util';

const styles = StyleSheet.create({
  beat: {
    borderColor: 'darkgrey',
    borderWidth: 1,
    width: 10,
  },
  container: {
    width: 160,
    height: '50%',
    // flexDirection: 'row',
  },
  active: {
    backgroundColor: 'white',
  },
});

export type PropType = {
  beat: number;
  length: number;
};

const data = repeatItem(null, 16);

export const BeatIndicator = (props: PropType) => {
  return null;
  const {beat, length} = props;
  return (
    <FlatList
      style={styles.container}
      data={data}
      horizontal
      renderItem={({index}) => (
        <View
          style={{
            ...styles.beat,
            ...(beat % length === index ? styles.active : {}),
          }}
        />
      )}
    />
  );
};
