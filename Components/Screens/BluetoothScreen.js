import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  NativeModules,
  NativeEventEmitter,
  ScrollView,
  View,
  FlatList,
  AppState,
  Platform,
  StatusBar,
  Permission,
  PermissionsAndroid,
  TouchableHighlight,
} from 'react-native';

import { ApplicationProvider, Layout, Text, Button, Card, CardHeader, Input} from '@ui-kitten/components';
import { usePeripheral } from '../Hooks/usePeripheral'

import BleManager from 'react-native-ble-manager';
import { stringToBytes } from 'convert-string';

import { PeripheralItem}from '../Components/PeripheralItem'
import Modal from "react-native-modal";


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    margin: 8,
  },
});
const Header = () => (
  <CardHeader
    title='Please give iCoffee some internet!'
  />
);
export function BluetoothScreen() {
    const peripheral_devices = usePeripheral();
    const [visibleModal, setVisibleModal] = useState(false)
    const [ssid, setSsid] = useState('');
    const [wifiPass, setWifiPass] = useState('');


    const BleManagerModule = NativeModules.BleManager;
    const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
    console.log(peripheral_devices)

    AppState.addEventListener('change', handleAppStateChange);
  
    function handleAppStateChange(nextAppState) {
      if (peripheral_devices.appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!')
        BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
          console.log('Connected peripherals: ' + peripheralsArray.length);
        });
      }
      peripheral_devices.setAppState(nextAppState)
    }
  
    if (Platform.OS === 'android' && Platform.Version >= 23) {
          PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
              if (result) {
                console.log("Permission is OK");
              } else {
                PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                  if (result) {
                    console.log("User accept");
                  } else {
                    console.log("User refuse");
                  }
                });
              }
        });
      }
    
  
    BleManager.start({showAlert: false});
  
     bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral );
     bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan );
     bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral );
     bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic );
  
    function handleDiscoverPeripheral(peripheral){
      var peripherals = peripheral_devices.scannedDevices;
      console.log('Got ble peripheral', peripheral);
      if (!peripheral.name) {
        peripheral.name = 'NO NAME';
      }
      peripherals.set(peripheral.id, peripheral);
      peripheral_devices.setScannedDevices(peripherals)
    }
  
    function handleStopScan() {
      console.log('Scan is stopped');
      peripheral_devices.setScanning(false)
    }
  
    function handleDisconnectedPeripheral(data) {
      let peripherals = peripheral_devices.scannedDevices
      let peripheral = peripherals.get(data.peripheral);
      if (peripheral) {
        peripheral.connected = false;
        peripherals.set(peripheral.id, peripheral);
        peripheral_devices.setScannedDevices(peripherals)
      }
      console.log('Disconnected from ' + data.peripheral);
    }
  
    function handleUpdateValueForCharacteristic(data) {
      console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
    }
  
    function retrieveConnected() {
      BleManager.getConnectedPeripherals([]).then((results) => {
        if (results.length == 0) {
          console.log('No connected peripherals')
        }
        console.log(results);
        var peripherals = peripheral_devices.scannedDevices
        for (var i = 0; i < results.length; i++) {
          var peripheral = results[i];
          peripheral.connected = true;
          peripherals.set(peripheral.id, peripheral);
          peripheral_devices.setScannedDevices(peripherals)
        }
      });
    }
  
    function handleButtonScan() {
      console.log("Pressed handle button")
      if (!peripheral_devices.scanning) {
        //this.setState({peripherals: new Map()});
        BleManager.scan([], 3, true).then((results) => {
          console.log("lllll")
          peripheral_devices.setScanning(true)
        });
      }
    }

    const btnScanTitle = peripheral_devices.scanning === false ? 'Scan for iCoffee! :)' : 'Scanning for iCoffee!'

    const list = Array.from(peripheral_devices.scannedDevices);
    return (
        <>
        <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

        <ScrollView style={{width: '100%'}}>

        {/* for scanning */}
        {/* <Layout style={styles.container}> */}
          <Button style={styles.button} onPress={handleButtonScan} disabled={peripheral_devices.scanning}>{btnScanTitle}</Button>
        {/* </Layout> */}
        {/* end scanning */}

        {/* Get current peripheral */}
        {/* <View style={{margin: 10}}>
          <Button  onPress={() => retrieveConnected() } > Retrieve connected peripherals</Button>    
        </View> */}
        {/* End getting current peripheral */}

           {(list.length == 0) &&
            <Text style={{textAlign: 'center'}}>No peripherals</Text>
            }

            {(list.length) > 0 &&
            list.map(data => (
                <PeripheralItem onPress={turnOnModal} key={data.id} bluetoothItem={data}/>
                )
            )
            }

            <Button onPress={turnOnModal}>YOOOO</Button>
            <Modal
              onBackdropPress={turnOffModal}
              onSwipeComplete={turnOffModal}
              swipeDirection="left"
              isVisible={visibleModal}
            >
              <Card header={Header}>
                  <Input
                    placeholder="Your wifi name!"
                    value={ssid}
                    onChangeText={setSsid}
                  />
                  <Input
                    placeholder="Your wifi's password!"
                    secureTextEntry={true}
                    value={wifiPass}
                    onChangeText={setWifiPass}
                  />
                  <Button onPress={handleWifiDetails}>Submit</Button>
                </Card>
              </Modal>
            </ScrollView>
        </Layout>
      </>
    )
    
    function turnOnModal() {
      setVisibleModal(true)
    }
    function turnOffModal() {
      setVisibleModal(false)
    }
    function setWifi(){
      console.log(ssid)
      console.log(wifiPass)
    }
    function handleWifiDetails() {
      turnOffModal()
      setWifi()
      setSsid('')
      setWifiPass('')
    }
}
