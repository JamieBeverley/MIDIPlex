import React, {useState} from 'react';
import {
  TouchableOpacity,
  Image,
  View,
  StyleSheet,
  TextInput,
} from 'react-native';
import {useStateDispatch, useStateSelector} from '../../hooks/state';
import {setBeat, setBeatSpeed} from '../../store';

const styles = StyleSheet.create({
  sequenceControls: {
    // width: 100,
    height: '100%',
    // backgroundColor: 'red',
    paddingLeft: 5,
    paddingRight: 5,
    display: 'flex',
    flexDirection: 'row',
  },
  img: {
    width: 18,
    height: 18,
    padding: 5,
    // backgroundColor: 'black',
  },
  buttonWrapper: {
    height: '100%',
    // width: '50%',
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 10,
    paddingRight: 10,
    // backgroundColor: 'blue',
    justifyContent: 'center',
  },
});

export default function SequenceControls() {
  const dispatch = useStateDispatch();
  const beatSpeed = useStateSelector(x => x.clock.beatSpeed);
  const [text, setText] = useState(Math.abs(beatSpeed).toString());

  return (
    <View style={styles.sequenceControls}>
      <TouchableOpacity
        style={styles.buttonWrapper}
        onPress={() => {
          console.log('???');
          dispatch(setBeatSpeed(0));
        }}>
        <Image style={styles.img} source={require('./icons/pause.png')} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonWrapper}
        onPress={() => {
          dispatch(setBeatSpeed(1));
        }}>
        <Image style={styles.img} source={require('./icons/play.png')} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonWrapper}
        onPress={() => {
          dispatch(setBeat(0));
        }}>
        <Image
          style={{...styles.img, width: 21}}
          source={require('./icons/reset.png')}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonWrapper}
        onPress={() => {
          dispatch(setBeatSpeed(beatSpeed * -1));
        }}>
        <Image
          style={{
            ...styles.img,
            width: 21,
            transform: [
              {rotate: `${Math.sign(beatSpeed) === -1 ? 180 : 0}deg`},
            ],
          }}
          source={require('./icons/arrow.png')}
        />
      </TouchableOpacity>

      <TextInput
        onChangeText={t => setText(t)}
        onSubmitEditing={e => {
          const value = parseFloat(e.nativeEvent.text);
          if (!isNaN(value)) {
            dispatch(setBeatSpeed(value * Math.sign(beatSpeed)));
          }
        }}
        style={{
          color: 'red',
          backgroundColor: 'black',
        }}
        value={text}
        keyboardType="decimal-pad"
      />
    </View>
  );
}
