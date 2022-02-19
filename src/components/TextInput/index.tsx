import React, {useEffect, useState} from 'react';
import {TextInput as RTextInput, TextInputProps} from 'react-native';

export interface PropType extends TextInputProps {
  onEntered: (s: string) => void;
  storeValue: string;
}

export default function TextInput(props: PropType) {
  const [local, setLocal] = useState(props.storeValue);
  useEffect(() => {
    setLocal(props.storeValue);
  }, [props.storeValue]);
  return (
    <RTextInput
      {...props}
      onChangeText={t => setLocal(t)}
      onSubmitEditing={e => {
        props.onEntered(e.nativeEvent.text);
      }}
      value={local}
    />
  );
}
