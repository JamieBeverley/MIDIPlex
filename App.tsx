/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {Sequencer} from './src/components/Sequencer';
import {useMidiBleClient} from './src/hooks/useMidiClient';
import {View, StyleSheet} from 'react-native';

const style = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
});

const App = () => {
  // const {client, device} = useMidiBleClient('MIDIPlex');
  return (
    <View style={style.container}>
      <Sequencer />
    </View>
  );
};

export default App;
