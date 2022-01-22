import {useEffect, useState} from 'react';
import {PermissionsAndroid} from 'react-native';
import {Device, BleManager} from 'react-native-ble-plx';
import {MidiClient} from '../midiClient';

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

type MidiBleState =
  | 'unconnected'
  | 'scanning'
  | 'connected'
  | 'ready'
  | 'failed';

type UseMidiBleT = {
  client: MidiClient | null;
  device: Device | null;
  state: MidiBleState;
};

export const useMidiBleClient3 = function (
  deviceName: string,
): MidiClient | null {
  const [client, setClient] = useState<MidiClient | null>(null);

  useEffect(() => {
    const cleanup = () => {
      console.log('Cleanup called where client is:', client);
      if (client) {
        client.disconnect();
      }
    };
    const f = async () => {
      await requestLocationPermission();
      const device = await getDevice(deviceName);
      await device.connect();
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
      const midiClient = new MidiClient(device, txCharacteristic);
      setClient(midiClient);
      console.log('wtf?');
    };
    f();
    return cleanup;
  }, [deviceName, client]);
  return client;
};

export const useMidiBleClient2 = function (deviceName: string): UseMidiBleT {
  console.log('calling  useMDIBleClient');
  const [device, setDevice] = useState<Device | null>(null);
  const [state, setState] = useState<MidiBleState>('unconnected');
  const [client, setClient] = useState<MidiClient | null>(null);

  useEffect(() => {
    const cleanup = () => {
      manager.stopDeviceScan();
      if (device) {
        console.log('@@@@@@disconnecting');
        manager.cancelDeviceConnection(device.id);
      }
      setDevice(null);
      setState('unconnected');
      console.log('cleanup called');
    };

    const f = async () => {
      await requestLocationPermission();
      setState('scanning');
      const pulledDevice = device || (await getDevice(deviceName));
      setDevice(pulledDevice);
      const connected = await pulledDevice.isConnected();
      if (!connected) {
        await pulledDevice.connect();
      }
      setState('connected');
      await pulledDevice.discoverAllServicesAndCharacteristics();
      const services = await pulledDevice.services();
      const uartService = services.find(
        service => service.uuid === '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
      );
      if (!uartService) {
        cleanup();
        setState('failed');
        return;
      }
      const characteristics = await uartService.characteristics();
      const txCharacteristic = characteristics.find(
        x => x.uuid === '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
      );
      if (!txCharacteristic) {
        cleanup();
        setState('failed');
        return;
      }
      setClient(new MidiClient(txCharacteristic));
      setState('ready');
    };

    f();

    return cleanup;
  }, [deviceName]);

  return {client, state, device};
};

type ConnectionState = 'none' | 'scanning' | 'found device' | 'connected' | '';

export const useMidiBleClient = function (deviceName: string): UseMidiBleT {
  console.log('calling  useMDIBleClient');
  const [device, setDevice] = useState<Device | null>(null);
  const [state, setState] = useState<MidiBleState>('unconnected');
  const [client, setClient] = useState<MidiClient | null>(null);
  const [connected, setConected] = useState<boolean>(false);

  // Find device
  useEffect(() => {
    const f = async () => {
      await requestLocationPermission();
      setState('scanning');
      const pulledDevice = await getDevice(deviceName);
      manager.stopDeviceScan();
      setDevice(pulledDevice);
    };
    f();
    return () => {
      manager.stopDeviceScan();
      setDevice(null);
    };
  }, [deviceName]);

  // Connect To device
  useEffect(() => {
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
    };
    f();
    return () => {
      setClient(null);
    };
  }, [device, connected]);

  return {client, state, device};
};
