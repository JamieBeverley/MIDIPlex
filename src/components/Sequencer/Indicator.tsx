import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {StyleSheet, View} from 'react-native';
import {useStateSelector} from '../../hooks/state';

const styles = StyleSheet.create({
  indicator: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#60c689',
    width: 1,
    height: '50%',
  },
});

export const Indicator = (props: {
  length: number;
  style?: StyleProp<ViewStyle>;
}) => {
  // const beat = useStateSelector(x => x.clock.beat);
  const beat = 0;
  let pct;
  if (beat < 0) {
    pct = ((props.length + (beat % props.length)) * 100) / props.length;
  } else {
    pct = ((beat % props.length) * 100) / props.length;
  }
  return (
    <View
      style={StyleSheet.compose(
        {
          ...styles.indicator,
          left: `${pct}%`,
        },
        props.style || {},
      )}
    />
  );
};
