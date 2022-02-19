import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity,
  Button,
} from 'react-native';
import {RowT} from './dataTypes';
import {Cell} from './Cell';
import {useStateDispatch} from '../../hooks/state';
import {setRowLength, toggleCell} from '../../store';
import {Indicator} from './Indicator';
import TextInput from '../TextInput';

const styles = StyleSheet.create({
  controls: {
    width: 50,
    display: 'flex',
    flexDirection: 'row',
  },
  text: {
    color: '#57acdc',
    textAlign: 'center',
    textAlignVertical: 'center',
    // margin: 5,
    width: '100%',
    flex: 1,
  },
  buttons: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    padding: 5,
  },
  row: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
  },
  modal: {
    left: '25%',
    top: '25%',
    // textAlign: 'center',
    backgroundColor: 'black',
    color: 'white',
    borderWidth: 1,
    borderColor: 'white',
    height: '50%',
    width: '50%',
  },
});

export interface PropType extends RowT {
  index: number;
}

export const Row = (props: PropType) => {
  const dispatch = useStateDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const cb = React.useCallback(
    (index, active) => {
      dispatch(
        toggleCell({
          rowIndex: props.index,
          cellIndex: index,
          active,
        }),
      );
    },
    [dispatch, props.index],
  );
  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.controls}
        onPress={() => {
          setModalVisible(!modalVisible);
        }}>
        <Text style={{...styles.text, fontSize: 18}}>
          {props.note}
          <Text style={{...styles.text, fontSize: 10, paddingLeft: 5}}>
            {` (${props.cells.length})`}
          </Text>
        </Text>
      </TouchableOpacity>

      <Modal transparent visible={modalVisible}>
        <View style={styles.modal}>
          <Text
            style={{
              ...styles.text,
              textAlign: 'left',
              fontSize: 24,
              paddingLeft: 15,
              width: '100%',
              backgroundColor: 'white',
            }}>
            {props.note}
          </Text>
          <View
            style={{
              width: '100%',
              height: 40,
              display: 'flex',
              flexDirection: 'row',
              // backgroundColor: 'red',
            }}>
            <Text style={styles.text}>Sequence Length</Text>
            <TextInput
              style={{
                ...styles.text,
                borderBottomWidth: 1,
                borderColor: styles.text.color,
                marginBottom: 5,
                marginLeft: 5,
                marginRight: 5,
              }}
              onEntered={text => {
                const length = parseInt(text, 10);
                console.log(length);
                if (!isNaN(length)) {
                  dispatch(setRowLength({rowIndex: props.index, length}));
                }
              }}
              storeValue={props.cells.length.toString()}
              keyboardType="number-pad"
            />
          </View>
          <Button
            title="x2"
            color="black"
            onPress={() => {
              dispatch(
                setRowLength({
                  rowIndex: props.index,
                  length: props.cells.length * 2,
                }),
              );
            }}
          />
          <Button
            title="/2"
            color="black"
            onPress={() => {
              dispatch(
                setRowLength({
                  rowIndex: props.index,
                  length: Math.max(1, Math.floor(props.cells.length / 2)),
                }),
              );
            }}
          />

          <Button
            title="close"
            color={'#57acdc'}
            onPress={() => setModalVisible(false)}
          />
        </View>
      </Modal>

      <View style={{position: 'relative', width: '100%', flex: 1}}>
        <View style={styles.buttons}>
          {props.cells.map(({active}, index) => (
            <Cell key={index} index={index} setActive={cb} active={active} />
          ))}
        </View>
        <Indicator length={props.cells.length} style={{bottom: 8}} />
      </View>
    </View>
  );
};
