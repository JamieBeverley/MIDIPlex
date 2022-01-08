import {BleManager} from 'react-native-ble-plx';

export const bleManager = new BleManager();

export function scanAndConnect() {
  bleManager.startDeviceScan(null, null, (error, device) => {
    if (error) {
      console.warn(error);
      return;
    }
    if (device) {
      console.log(device.name);
    }
  });
}
