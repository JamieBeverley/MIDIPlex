/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState} from 'react';
import {
  Button,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  scanAndConnect,
  requestLocationPermission,
  manager,
  sendMidiNote,
} from './src/ble';
import {useMidiBleClient} from './src/hooks/useMidiClient';

const connect = () => {
  return new Promise((res, rej) => {
    requestLocationPermission()
      .then(() => {
        scanAndConnect().then(({device, characteristic}) => {
          res({device, characteristic});
        });
      })
      .catch(e => {
        throw e;
      });
  });
};

const midiChannel = 2;
const App = () => {
  const [number, setNumber] = React.useState<number>(48);
  const {client, device} = useMidiBleClient('MIDIPlex');

  if (client === null) {
    return <Text>Connecting...</Text>;
  }

  return (
    <View>
      <Text>{device ? device.name : ''} </Text>
      <TextInput
        style={styles.input}
        onChangeText={x => {
          setNumber(parseInt(x, 10));
        }}
        value={number.toString()}
        keyboardType="numeric"
      />
      <Button
        title="send"
        onPress={() => {
          client.playNote(midiChannel, number, 100, 2);
        }}
      />

      <ScrollView>
        {[60, 64, 67, 72].map(midinote => (
          <View key={midinote} style={{display: 'flex', flexDirection: 'row'}}>
            <TouchableOpacity
              style={{
                width: '50%',
                height: 100,
                backgroundColor: 'lightblue',
                padding: 10,
                borderColor: 'grey',
              }}
              onPress={() => {
                client?.playNote(midiChannel, midinote, 100, 2);
              }}>
              <Text style={{position: 'absolute', left: '50%', top: '50%'}}>
                {midinote.toString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: '50%',
                height: 100,
                backgroundColor: 'lightblue',
                padding: 10,
                borderColor: 'grey',
              }}
              onPress={() => {
                client?.noteOff(midiChannel, midinote);
              }}>
              <Text style={{position: 'absolute', left: '50%', top: '50%'}}>
                off
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <Button
          title="kill all"
          onPress={() => {
            client?.noteOffAll(midiChannel);
          }}
        />
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

// const Section: React.FC<{
//   title: string;
// }> = ({children, title}) => {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// };

// const App = () => {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   return (
//     <SafeAreaView style={backgroundStyle}>
//       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
//       <ScrollView
//         contentInsetAdjustmentBehavior="automatic"
//         style={backgroundStyle}>
//         <Header />
//         <View
//           style={{
//             backgroundColor: isDarkMode ? Colors.black : Colors.white,
//           }}>
//           <Section title="Step One">
//             Edit <Text style={styles.highlight}>App.tsx</Text> to change this
//             screen and then come back to see your edits.
//           </Section>
//           <Section title="See Your Changes">
//             <ReloadInstructions />
//           </Section>
//           <Section title="Debug">
//             <DebugInstructions />
//           </Section>
//           <Section title="Learn More">
//             Read the docs to discover what to do next:
//           </Section>
//           <LearnMoreLinks />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

export default App;
