import React, {useState} from 'react';
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

import {
  ApplicationProvider,
  Layout,
  Text,
  Button,
  Card,
  CardHeader,
  Input,
} from '@ui-kitten/components';
import {usePeripheral} from '../Hooks/usePeripheral';

import BleManager from 'react-native-ble-manager';
import {stringToBytes} from 'convert-string';

import {PeripheralItem} from '../Components/PeripheralItem';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';

import bytesCounter from 'bytes-counter'; // for getting the number of bytes in a string

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    margin: 8,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerTextStyle: {
    color: 'white'
  },
});
const Header = () => <CardHeader title="Please give iCoffee some internet!" />;
export function BluetoothScreen() {
  const peripheral_devices = usePeripheral();
  const [visibleModal, setVisibleModal] = useState(false);
  const [ssid, setSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [selected, setSelected] = useState('');
  const [bluetoothConnecting, setBluetoothConnecting] = useState(false)

  const BleManagerModule = NativeModules.BleManager;
  const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
  console.log(peripheral_devices);

  AppState.addEventListener('change', handleAppStateChange);

  function handleAppStateChange(nextAppState) {
    if (
      peripheral_devices.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      BleManager.getConnectedPeripherals([]).then(peripheralsArray => {
        console.log('Connected peripherals: ' + peripheralsArray.length);
      });
    }
    peripheral_devices.setAppState(nextAppState);
  }

  if (Platform.OS === 'android' && Platform.Version >= 23) {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ).then(result => {
      if (result) {
        console.log('Permission is OK');
      } else {
        PermissionsAndroid.requestPermission(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ).then(result => {
          if (result) {
            console.log('User accept');
          } else {
            console.log('User refuse');
          }
        });
      }
    });
  }

  BleManager.start({showAlert: false});

  bleManagerEmitter.addListener(
    'BleManagerDiscoverPeripheral',
    handleDiscoverPeripheral,
  );
  bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
  bleManagerEmitter.addListener(
    'BleManagerDisconnectPeripheral',
    handleDisconnectedPeripheral,
  );
  bleManagerEmitter.addListener(
    'BleManagerDidUpdateValueForCharacteristic',
    handleUpdateValueForCharacteristic,
  );

  function handleDiscoverPeripheral(peripheral) {
    var peripherals = peripheral_devices.scannedDevices;
    console.log('Got ble peripheral', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    if(peripheral.name == "iCoffee") {
      peripherals.set(peripheral.id, peripheral);
      console.log(peripheral.id, 'looool');
      peripheral_devices.setScannedDevices(peripherals);
    }
  }

  function handleStopScan() {
    console.log('Scan is stopped');
    peripheral_devices.setScanning(false);
  }

  function handleDisconnectedPeripheral(data) {
    let peripherals = peripheral_devices.scannedDevices;
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      peripheral_devices.setScannedDevices(peripherals);
    }
    console.log('Disconnected from ' + data.peripheral);
  }

  function handleUpdateValueForCharacteristic(data) {
    console.log(
      'Received data from ' +
        data.peripheral +
        ' characteristic ' +
        data.characteristic,
      data.value,
    );
  }

  function retrieveConnected() {
    BleManager.getConnectedPeripherals([]).then(results => {
      if (results.length == 0) {
        console.log('No connected peripherals');
      }
      // console.log(results);
      var peripherals = peripheral_devices.scannedDevices;
      for (var i = 0; i < results.length; i++) {
        var peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        peripheral_devices.setScannedDevices(peripherals);
      }
    });
  }

  function handleButtonScan() {
    console.log('Pressed handle button');
    if (!peripheral_devices.scanning) {
      //this.setState({peripherals: new Map()});
      BleManager.scan([], 3, true).then(results => {
        console.log('lllll');
        peripheral_devices.setScanning(true);
      });
    }
    retrieveConnected()
  }

  function test(peripheral) {
    setBluetoothConnecting(true)
    let id = peripheral[0];
    if (peripheral) {
      if (peripheral_devices.device.size != 0) {
        BleManager.disconnect(id);
        setSelected(0)
        setBluetoothConnecting(false)
        peripheral_devices.setDevice(new Map());
      } else {
        BleManager.connect(id).then(() => {
          setBluetoothConnecting(false)
          peripheral_devices.setDevice(peripheral);

          BleManager.retrieveServices(id).then(info => {
            setSelected(id)
            setVisibleModal(true)
          });
        });
      }
    }
  }

  const btnScanTitle =
    peripheral_devices.scanning === false
      ? 'Scan for iCoffee! :)'
      : 'Scanning for iCoffee!';

  const list = Array.from(peripheral_devices.scannedDevices);
  return (
    <>
        <Spinner
          visible={bluetoothConnecting}
          textContent={'Connecting to iCoffee! :)'}
          textStyle={styles.spinnerTextStyle}
        />
      <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ScrollView style={{width: '100%'}}>
          <Button
            style={styles.button}
            onPress={handleButtonScan}
            disabled={peripheral_devices.scanning}>
            {btnScanTitle}
          </Button>

          {list.length == 0 && (
            <Text style={{textAlign: 'center'}}>No peripherals</Text>
          )}

          {list.length > 0 &&
            list.map(data => (
              <PeripheralItem test={test} key={data[0]} bluetoothItem={data} active={selected !== data[0]} />
            ))}

          <Modal
            onBackdropPress={turnOffModal}
            onSwipeComplete={turnOffModal}
            swipeDirection="left"
            isVisible={visibleModal}>
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
  );

  function turnOnModal() {
    console.log('YEET');
    setVisibleModal(true);
  }
  function turnOffModal() {
    setVisibleModal(false);
  }
  function setWifi() {
    console.log(ssid);
    console.log(wifiPass);
  }
  function handleWifiDetails() {

    let network = {
      ssid: ssid,
      password: wifiPass,
      key_mgmt: "WPA-PSK"
    }

    let str = JSON.stringify(network); // convert the object to a string
    let bytes = bytesCounter.count(str); // count the number of bytes
    let data = stringToBytes(str); // convert the string to a byte array


    BleManager.write(selected, "938e46ca-5b8a-11ea-bc55-0242ac130003" ,   "967e46ca-5b8b-12ea-ac55-0232ac131003" , data, bytes)
        .then(() => {
          // Success code
          console.log('Write: ' + data);
          setWifi();
          setSsid('');
          setWifiPass('');
          turnOffModal();
        })
        .catch((error) => {
          // Failure code
          console.log("FAIL")
          console.log(error);
          turnOffModal();
        });
      }

}
