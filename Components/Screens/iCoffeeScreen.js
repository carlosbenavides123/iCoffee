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
  Picker,
  TouchableHighlight,
} from 'react-native';

import { ApplicationProvider, Layout, Text, Button, Card, CardHeader, Input,   Popover, Modal,
  Select} from '@ui-kitten/components';
// import Modal from "react-native-modal";
import { Dropdown } from 'react-native-material-dropdown';

import  {CoffeeStart}  from '../Components/svg/CoffeeStart/CoffeeStart'
import {useCoffee} from '../Hooks/useCoffee';
import {useWs} from '../Hooks/useWs'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    margin: 8,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    // padding: 16,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cardContainer: {
    // justifyContent: 'center',
    // alignItems: 'center',
    width: '100%',
    padding: 16,
  },
  footerContainer: {
    width: '100%',
  },
  footerControl: {
    marginHorizontal: 4,
  },
});
const Header = () => (
  <CardHeader
    title='Customize to your liking.'
  />
);

// const ounce = [{
//   value: '4oz',
// }, {
//   value: '8oz',
// }, {
//   value: '12oz',
// }, {
//   value: '16oz'
// }];

const typeOfCoffee = [
  { text: 'Regular Coffee' },
  { text: 'Strong Coffee' }
];

const ounce = [
  { text: '4oz' },
  { text: '8oz' },
  { text: '12oz'}
];

const PopoverContent = () => (
  <Layout style={styles.popoverContent}>
    <Text>Hi!</Text>
  </Layout>
);
export function iCoffeeScreen() {
    const coffeeState = useCoffee()
    const ws = useWs();

    const [visibleModal, setVisibleModal] = useState(false)
    const [oz, setOz] = useState(ounce[0]);
    const [coffeeType, setCoffeeType] = useState(typeOfCoffee[0]);
    // const [placement, setPlacement] = React.useState(PLACEMENTS[0]);
    const [visible, setVisible] = React.useState(false);

    const togglePopover = () => {
      setVisible(!visible);
    };
    const Footer = () => (
      <View style={styles.footerContainer}>
        <Button onPress={lol}>
          Start iCoffee! :)
        </Button>
      </View>
    );

    function lol(){
      console.log(oz)
      console.log(coffeeType)
    }

    function handleCoffeePress() {

      setVisibleModal(true)

      console.log(ws.socket)
        // if(ws.socket.connected){
          // attempt again
          // ws.ws.send(JSON.stringify({"Message": "hello"}))
          // console.log(ws.socket)
          // ws.socket.send(JSON.stringify({"Message":"Hello"}))

          console.log("yeet")
        // } else {
        //   ws.socket(new WebSocket('ws://192.168.0.100:12345'));
        // }
        // if(ws.socket) {
        //   console.log("yee")
        //   console.log(ws.socket)
        //   ws.socket.send(JSON.stringify({"Message":"Hello!"}))
        // }
        // coffeeState.setCountDown(true)
    }

    var buttonText = coffeeState.countDown ?  "Est. Time Left: " + coffeeState.countDownTimer + "\n": "Start iCoffee :)"
    var buttonTextExtra = coffeeState.countDown ?  "iCoffee is currently " : ""

    return (
        <>
        <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            { coffeeState.nightTime === true &&
                <>
                  <Text>It is night time.</Text>
                  <Text>Are you sure you want to drink coffee?</Text>
                </>
            }
            { coffeeState.nightTime === false &&
                <>
                  <Text>Drink some coffee :)</Text>
                </>
            }
            <CoffeeStart />

            <Button 
                onPress={handleCoffeePress} 
                style={styles.button} 
                size='large' 
                disabled={coffeeState.countDown}
            >
                {buttonText}
                {buttonTextExtra}
            </Button>



            <Modal 
            visible={visibleModal}         
            onBackdropPress={turnOffModal}         
            backdropStyle={styles.backdrop}
            >
              <Layout
                level='3'
                style={styles.modalContainer}
                >
                <Card header={Header} style={styles.cardContainer} footer={Footer}>
                  <Select
                    data={typeOfCoffee}
                    selectedOption={coffeeType}
                    onSelect={setCoffeeType}
                    label={"How do you like your Coffee?"}
                  />
                  <Select
                    data={ounce}
                    selectedOption={oz}
                    onSelect={setOz}
                    label={"Coffee Size?"}
                  />
                  </Card>
              </Layout>

            </Modal>

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
