export const x = 2;
// import {BleManager, Characteristic, Device} from 'react-native-ble-plx';
// import {PermissionsAndroid} from 'react-native';
// import {useState} from 'react';
// import {useEffect} from 'react';
// import {MidiClient} from './midiClient';

// export function sendMidiNote(
//   txCharacteristic: Characteristic,
//   midinote: number,
//   velocity: number,
// ) {
//   console.log(`${midinote} ${velocity !== 0 ? 'on' : 'off'}`);
//   return txCharacteristic.writeWithoutResponse(
//     encodeMidiNote(2, midinote, velocity, true),
//   );
// }

// export class BLEMIDIClient {
//   _manager: BleManager;
//   device: Device | null;
//   loadState: 'unconnected' | 'connected' | 'failed';
//   deviceName: string;

//   constructor(deviceName = 'MIDIPlex') {
//     this._manager = manager;
//     this.device = null;
//     this.loadState = 'unconnected';
//     this.deviceName = deviceName;
//   }

//   init() {
//     return new Promise((res, rej) => {
//       this._manager.startDeviceScan(null, null, (error, device) => {
//         if (error) {
//           rej(error);
//         }
//         if (
//           device !== null &&
//           device.name !== null &&
//           device.name === this.deviceName
//         ) {
//           this._manager.stopDeviceScan();
//         }
//       });
//     });
//   }
// }

// type ReturnT = {
//   device: Device;
//   characteristic: Characteristic;
// };
// type PromiseFunc = (res: (x: ReturnT) => any, rej: (x: any) => any) => any;

// export function scanAndConnect(): Promise<ReturnT> {
//   const f: PromiseFunc = (res, rej) => {
//     manager.startDeviceScan(null, null, (error, device) => {
//       if (error !== null) {
//         console.warn(error);
//         return;
//       }
//       if (device !== null && device.name !== null) {
//         console.log(device.name);
//       }
//       if (
//         device !== null &&
//         device.name !== null &&
//         device.name &&
//         device.name === 'MIDIPlex'
//       ) {
//         manager.stopDeviceScan();
//         device
//           .connect()
//           .then(async x => {
//             await device.discoverAllServicesAndCharacteristics();
//             const services = await device.services();
//             const uartService = services.find(
//               service =>
//                 service.uuid === '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
//             );
//             if (uartService) {
//               return uartService.characteristics();
//             }
//             throw 'Uart service not found';
//           })
//           .then(characteristics => {
//             const txCharacteristic = characteristics.find(
//               x => x.uuid === '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
//             );
//             if (txCharacteristic) {
//               res({device, characteristic: txCharacteristic});
//             } else {
//               throw 'Could not connect';
//             }
//           })
//           .catch(e => {
//             rej(e);
//           });
//       }
//     });
//   };
//   return new Promise(f);
// }
