import {useEffect, useState} from 'react';
import {PermissionsAndroid} from 'react-native';
import {Device, BleManager} from 'react-native-ble-plx';
import {MidiClient} from '../midiClient';
import {setMidiDevice, setMidiState} from '../store';

export const manager = new BleManager();

async function requestLocationPermission() {
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

const getDevice = (deviceName: string): Promise<Device> => {
  return new Promise((res, rej) => {
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        manager.stopDeviceScan();
        rej(error);
      }
      if (
        device !== null &&
        device.name !== null &&
        device.name === deviceName
      ) {
        manager.stopDeviceScan();
        res(device);
      }
    });
  });
};

type UseMidiBleT = {
  client: MidiClient | null;
  device: Device | null;
};

export const useMidiBleClient = function (deviceName: string): UseMidiBleT {
  const [device, setStateDevice] = useState<Device | null>(null);
  const [client, setClient] = useState<MidiClient | null>(null);
  const [connected, setConected] = useState<boolean>(false);

  // Find device
  useEffect(() => {
    const f = async () => {
      setMidiState('scanning');
      await requestLocationPermission();
      const pulledDevice = await getDevice(deviceName);
      manager.stopDeviceScan();
      setStateDevice(pulledDevice);
      setMidiDevice(pulledDevice);
    };
    f();
    return () => {
      manager.stopDeviceScan();
      setMidiDevice(null);
      setStateDevice(null);
    };
  }, [deviceName]);

  // Connect To device
  useEffect(() => {
    setMidiState('connecting');
    const f = async () => {
      if (!device) {
        return;
      }
      const isConnected = await device.isConnected();
      if (!isConnected) {
        await device.connect();
      }
      setConected(true);
    };
    f();
    return () => {
      if (device) {
        manager.cancelDeviceConnection(device.id);
      }
      setConected(false);
    };
  }, [device]);

  // Pull characteristic and set midiclient
  useEffect(() => {
    setMidiState('observing');

    const f = async () => {
      if (!device || !connected) {
        return;
      }
      await device.discoverAllServicesAndCharacteristics();
      const services = await device.services();
      const uartService = services.find(
        service => service.uuid === '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
      );
      if (!uartService) {
        return;
      }
      const characteristics = await uartService.characteristics();
      const txCharacteristic = characteristics.find(
        x => x.uuid === '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
      );
      if (!txCharacteristic) {
        return;
      }
      setClient(new MidiClient(txCharacteristic));
      setMidiState('initialized');
    };
    f();
    return () => {
      setClient(null);
    };
  }, [device, connected]);

  return {client, device};
};
