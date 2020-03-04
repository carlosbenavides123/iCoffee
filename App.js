import React, { Component } from 'react';
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

import { ApplicationProvider, Layout, Text, Button, Card} from '@ui-kitten/components';
import { mapping, light as lightTheme } from '@eva-design/eva';

import { usePeripheral } from './Components/Hooks/usePeripheral'


import BleManager from 'react-native-ble-manager';
import bytesCounter from 'bytes-counter'; // for getting the number of bytes in a string

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

import { stringToBytes } from 'convert-string';

// export default class App extends Component {
//   constructor(){
//     super()

//     this.state = {
//       scanning:false,
//       peripherals: new Map(),
//       appState: ''
//     }

//     this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
//     this.handleStopScan = this.handleStopScan.bind(this);
//     this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
//     this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this);
//     this.handleAppStateChange = this.handleAppStateChange.bind(this);
//   }

//   componentDidMount() {
//     AppState.addEventListener('change', this.handleAppStateChange);

//     BleManager.start({showAlert: false});

//     this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral );
//     this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan );
//     this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral );
//     this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic );



//     if (Platform.OS === 'android' && Platform.Version >= 23) {
//         PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
//             if (result) {
//               console.log("Permission is OK");
//             } else {
//               PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
//                 if (result) {
//                   console.log("User accept");
//                 } else {
//                   console.log("User refuse");
//                 }
//               });
//             }
//       });
//     }

//   }

//   handleAppStateChange(nextAppState) {
//     if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
//       console.log('App has come to the foreground!')
//       BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
//         console.log('Connected peripherals: ' + peripheralsArray.length);
//       });
//     }
//     this.setState({appState: nextAppState});
//   }

//   componentWillUnmount() {
//     this.handlerDiscover.remove();
//     this.handlerStop.remove();
//     this.handlerDisconnect.remove();
//     this.handlerUpdate.remove();
//   }

//   handleDisconnectedPeripheral(data) {
//     let peripherals = this.state.peripherals;
//     let peripheral = peripherals.get(data.peripheral);
//     if (peripheral) {
//       peripheral.connected = false;
//       peripherals.set(peripheral.id, peripheral);
//       this.setState({peripherals});
//     }
//     console.log('Disconnected from ' + data.peripheral);
//   }

//   handleUpdateValueForCharacteristic(data) {
//     console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
//   }

//   handleStopScan() {
//     console.log('Scan is stopped');
//     this.setState({ scanning: false });
//   }

//   startScan() {
//     if (!this.state.scanning) {
//       //this.setState({peripherals: new Map()});
//       BleManager.scan([], 3, true).then((results) => {
//         console.log('Scanning...');
//         this.setState({scanning:true});
//       });
//     }
//   }

//   retrieveConnected(){
//     BleManager.getConnectedPeripherals([]).then((results) => {
//       if (results.length == 0) {
//         console.log('No connected peripherals')
//       }
//       console.log(results);
//       var peripherals = this.state.peripherals;
//       for (var i = 0; i < results.length; i++) {
//         var peripheral = results[i];
//         peripheral.connected = true;
//         peripherals.set(peripheral.id, peripheral);
//         this.setState({ peripherals });
//       }
//     });
//   }

//   handleDiscoverPeripheral(peripheral){
//     var peripherals = this.state.peripherals;
//     console.log('Got ble peripheral', peripheral);
//     if (!peripheral.name) {
//       peripheral.name = 'NO NAME';
//     }
//     peripherals.set(peripheral.id, peripheral);
//     this.setState({ peripherals });
//   }

//   test(peripheral) {
//     if (peripheral){
//       if (peripheral.connected){
//         BleManager.disconnect(peripheral.id);
//       }else{
//         BleManager.connect(peripheral.id).then(() => {
//           let peripherals = this.state.peripherals;
//           let p = peripherals.get(peripheral.id);
//           if (p) {
//             p.connected = true;
//             peripherals.set(peripheral.id, p);
//             this.setState({peripherals});
//           }
//           console.log('Connected to ' + peripheral.id);

//           BleManager.retrieveServices(peripheral.id).then((info)=>{
//             console.log(info)
//           })
//         });
//       }
//     }
//   }

//   renderItem(item) {
//     const color = item.connected ? 'green' : '#fff';
//     return (
//       <TouchableHighlight onPress={() => this.test(item) }>
//         <View style={[styles.row, {backgroundColor: color}]}>
//           <Text style={{fontSize: 12, textAlign: 'center', color: '#333333', padding: 10}}>{item.name}</Text>
//           <Text style={{fontSize: 10, textAlign: 'center', color: '#333333', padding: 2}}>RSSI: {item.rssi}</Text>
//           <Text style={{fontSize: 8, textAlign: 'center', color: '#333333', padding: 2, paddingBottom: 20}}>{item.id}</Text>
//         </View>
//       </TouchableHighlight>
//     );
//   }

//   handleSend() {
//     BleManager.getConnectedPeripherals([]).then((results) => {
//         if (results.length == 0) {
//           console.log('No connected peripherals')
//         }
//         var peripherals = this.state.peripherals;
//         for (var i = 0; i < results.length; i++) {
//           var peripheral = results[i];
//           peripheral.connected = true;
//           peripherals.set(peripheral.id, peripheral);
//           this.setState({ peripherals });
//         }
//         console.log(results)
//         var iCoffee_id = results[0].id

//         let network = {
//           ssid: "2.4 Ben ",
//           password: "Benavides1993180",
//           key_mgmt: "WPA-PSK"
//         }; 

//         let str = JSON.stringify(network); // convert the object to a string
//         let bytes = bytesCounter.count(str); // count the number of bytes
//         let data = stringToBytes(str); // convert the string to a byte array

//         BleManager.write(iCoffee_id, "938e46ca-5b8a-11ea-bc55-0242ac130003" ,   "967e46ca-5b8b-12ea-ac55-0232ac131003" , data, bytes)
//         .then(() => {
//           // Success code
//           console.log('Write: ' + data);
//         })
//         .catch((error) => {
//           // Failure code
//           console.log("FAIL")
//           console.log(error);
//         });
//       });
//   }


//   render() {
//     const list = Array.from(this.state.peripherals.values());
//     const btnScanTitle = 'Scan Bluetooth (' + (this.state.scanning ? 'on' : 'off') + ')';
    
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.container}>
//           <View style={{margin: 10}}>
//             <Button title={btnScanTitle} onPress={() => this.startScan() } />        
//           </View>

//           <View style={{margin: 10}}>
//             <Button title="Retrieve connected peripherals" onPress={() => this.retrieveConnected() } />        
//           </View>          
                    
//           <ScrollView style={styles.scroll}>
//             {(list.length == 0) &&
//               <View style={{flex:1, margin: 20}}>
//                 <Text style={{textAlign: 'center'}}>No peripherals</Text>
//               </View>
//             }
//             <View>
//             <FlatList
//               data={list}
//               renderItem={({ item }) => this.renderItem(item) }
//               keyExtractor={item => item.id}
//             />
//             </View>
//           </ScrollView>
//         </View>

//         <View>
//           <Button title="LInk me up" onPress={() => this.handleSend()} />
//         </View>
//       </SafeAreaView>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFF',
//     width: window.width,
//     height: window.height
//   },
//   scroll: {
//     flex: 1,
//     backgroundColor: '#f0f0f0',
//     margin: 10,
//   },
//   row: {
//     margin: 10
//   },
// });

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    margin: 8,
  },
});

function App(){

  const peripheral_devices = usePeripheral();

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


  // render data
  const list = Array.from(peripheral_devices.scannedDevices);
  const btnScanTitle = peripheral_devices.scanning === false ? 'Scan for iCoffee! :)' : 'Scanning for iCoffee!'

  console.log(list, "###############################")

  return(
    
    <ApplicationProvider mapping={mapping} theme={lightTheme}>
        <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

          {/* for scanning */}
          <Layout style={styles.container}>
            <Button style={styles.button} onPress={handleButtonScan} disabled={peripheral_devices.scanning}>{btnScanTitle}</Button>
          </Layout>
          {/* end scanning */}

          {/* Get current peripheral */}
          <View style={{margin: 10}}>
            <Button  onPress={() => retrieveConnected() } > Retrieve connected peripherals</Button>    
          </View>
          {/* End getting current peripheral */}


          {/* List of cards of retrieved peripherals */}
          <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {(list.length == 0) &&
                  <View style={{flex:1, margin: 20}}>
                    <Text style={{textAlign: 'center'}}>No peripherals</Text>
                  </View>
            }
            {(list.length) > 0 &&
              list.map(data => (
                <TouchableHighlight key={data.id} onPress={() => this.test(item) }>
                  <Card>
                      <Text >{data[1]["name"]}</Text>
                      <Text >RSSI: {data[1]["rssi"]}</Text>
                      <Text >{data[1]["id"]}</Text>
                  </Card>
                </TouchableHighlight>
                )
              )
            }

          </Layout>
          {/* End List of cards of retrieved peripherals */}

        </Layout>
    </ApplicationProvider>
    )
};

export default App;

// npx react-native start
// npx react-native run-android --port=8081 --deviceId=988bdc313553543548 --no-jetifier

