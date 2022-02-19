import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useStateDispatch, useStateSelector} from '../../hooks/state';
import {setScale} from '../../store';
import {ScaleName, Scales} from '../../scale';

export const style = StyleSheet.create({
  picker: {
    color: 'white',
    width: 120,
    height: 4,
    fontSize: 4,
    padding: 0,
    margin: 0,
  },
  scaleSelector: {
    borderColor: 'grey',
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
});

export default function ScaleSelector() {
  const dispatch = useStateDispatch();
  const scale = useStateSelector(x => x.scale);

  return (
    <View style={style.scaleSelector}>
      <Picker
        selectedValue={scale}
        style={style.picker}
        onValueChange={(scaleName: ScaleName) => {
          dispatch(setScale(scaleName));
        }}>
        {Object.keys(Scales).map(scaleName => (
          <Picker.Item key={scaleName} label={scaleName} value={scaleName} />
        ))}
      </Picker>
    </View>
  );
}
