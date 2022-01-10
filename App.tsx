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
import {Characteristic} from 'react-native-ble-plx';

import {
  scanAndConnect,
  requestLocationPermission,
  manager,
  sendMidiNote,
} from './src/ble';

// import {Colors} from 'react-native/Libraries/NewAppScreen';

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

const App = () => {
  const [device, setDevice] = useState(null);
  const [characteristic, setCharacteristic] = useState(null);
  const [number, onChangeNumber] = React.useState(null);
  const connectFn = () => {
    connect().then(({device, characteristic}) => {
      setDevice(device);
      setCharacteristic(characteristic);
    });
  };
  const disconnectFn = () => {
    console.log('disconnect being called');
    if (device) {
      manager.cancelDeviceConnection(device.id);
      setDevice(null);
      setCharacteristic(null);
      console.log('disconnected');
    }
  };
  const dur = 0.1;
  console.log(dur);

  React.useEffect(() => {
    connectFn();
    // return disconnectFn();
  });

  return (
    <View>
      <Button
        title="connect"
        onPress={() => {
          connectFn();
        }}
      />
      <Button
        title="disconnect"
        onPress={() => {
          disconnectFn();
        }}
      />
      <Text>{device ? device.name : ''} </Text>
      <TextInput
        style={styles.input}
        onChangeText={x => {
          onChangeNumber(parseInt(x));
        }}
        value={number || ''}
        placeholder="useless placeholder"
        keyboardType="numeric"
      />
      <Button
        title="send"
        onPress={() => {
          if (characteristic) {
            const note = number || 69;
            sendMidiNote(characteristic, note || 69, 69);
            setTimeout(() => {
              sendMidiNote(characteristic, note || 69, 0);
            }, dur);
          } else {
            console.warn('characteristic not set');
          }
        }}
      />

      <ScrollView>
        {[60, 64, 67, 72].map(midinote => (
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <TouchableOpacity
              style={{
                width: '50%',
                height: 100,
                backgroundColor: 'lightblue',
                padding: 10,
                borderColor: 'grey',
              }}
              onPress={() => {
                if (characteristic) {
                  sendMidiNote(characteristic, midinote, 69);
                  setTimeout(() => {
                    sendMidiNote(characteristic, midinote, 0);
                  }, dur);
                }
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
                if (characteristic) {
                  sendMidiNote(characteristic, midinote, 0);
                }
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
            Array.from(Array(126).keys()).forEach(x => {
              if (characteristic) {
                sendMidiNote(characteristic, x, 0);
              }
            });
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
