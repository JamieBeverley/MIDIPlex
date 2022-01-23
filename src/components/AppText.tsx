import React from 'react';
import {StyleSheet, Text, TextProps} from 'react-native';

const style = StyleSheet.create({
  text: {
    color: 'white',
  },
});

export const AppText = (props: TextProps) => {
  return (
    <Text
      style={{...style.text, ...((props.style as Object) || {})}}
      {...props}
    />
  );
};
