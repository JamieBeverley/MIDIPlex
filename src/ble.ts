import {BleManager, Characteristic, Device} from 'react-native-ble-plx';
import {PermissionsAndroid} from 'react-native';
import {encode} from 'js-base64';

export const manager = new BleManager();

export async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        title: 'Location permission for bluetooth scanning',
        message: '',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Location permission for bluetooth scanning granted');
      return true;
    } else {
      console.log('Location permission for bluetooth scanning revoked');
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}

const encodeMidiNote = function (
  channel: number,
  note: number,
  velocity: number,
  on: boolean,
) {
  velocity = on ? velocity : 0;
  return encode(`${channel}-${note}-${velocity}|`);
};

export function sendMidiNote(
  txCharacteristic: Characteristic,
  midinote: number,
  velocity: number,
) {
  console.log(`${midinote} ${velocity !== 0 ? 'on' : 'off'}`);
  return txCharacteristic.writeWithoutResponse(
    encodeMidiNote(2, midinote, velocity, true),
  );
}

type ReturnT = {
  device: Device;
  characteristic: Characteristic;
};
type PromiseFunc = (res: (x: ReturnT) => any, rej: (x: any) => any) => any;

export function scanAndConnect(): Promise<ReturnT> {
  const f: PromiseFunc = (res, rej) => {
    manager.startDeviceScan(null, null, (error, device) => {
      if (error !== null) {
        console.warn(error);
        return;
      }
      if (device !== null && device.name !== null) {
        console.log(device.name);
      }
      if (
        device !== null &&
        device.name !== null &&
        device.name &&
        device.name === 'MIDIPlex'
      ) {
        manager.stopDeviceScan();
        device
          .connect()
          .then(async x => {
            await device.discoverAllServicesAndCharacteristics();
            const services = await device.services();
            const uartService = services.find(
              service =>
                service.uuid === '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
            );
            if (uartService) {
              return uartService.characteristics();
            }
            throw 'Uart service not found';
          })
          .then(characteristics => {
            const txCharacteristic = characteristics.find(
              x => x.uuid === '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
            );
            if (txCharacteristic) {
              res({device, characteristic: txCharacteristic});
            } else {
              throw 'Could not connect';
            }
          })
          .catch(e => {
            rej(e);
          });
      }
    });
  };
  return new Promise(f);
}
