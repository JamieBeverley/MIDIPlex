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
import {View, StyleSheet, StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {store} from './src/store';

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
    <Provider store={store}>
      <View style={style.container}>
        <StatusBar hidden />
        <Sequencer />
      </View>
    </Provider>
  );
};

export default App;
