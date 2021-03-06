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
  Picker,
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
  Popover,
  Modal,
  Select,
} from '@ui-kitten/components';
import {Dropdown} from 'react-native-material-dropdown';

import {CoffeeStart} from '../Components/svg/CoffeeStart/CoffeeStart';
import {useCoffee} from '../Hooks/useCoffee';
import {useWs} from '../Hooks/useWs';
import {useRNStorage} from '../Hooks/useRNStorage';

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
const Header = () => <CardHeader title="Customize to your liking." />;

const typeOfCoffee = [{text: 'Regular Coffee'}, {text: 'Strong Coffee'}];

const ounce = [{text: '4oz'}, {text: '8oz'}, {text: '12oz'}];

const PopoverContent = () => (
  <Layout style={styles.popoverContent}>
    <Text>Hi!</Text>
  </Layout>
);
export function iCoffeeScreen() {
  const coffeeState = useCoffee();
  const ws = useWs();
  const state = useRNStorage();

  const [visibleModal, setVisibleModal] = useState(false);
  const [oz, setOz] = useState(ounce[0]);
  const [coffeeType, setCoffeeType] = useState(typeOfCoffee[0]);
  // const [placement, setPlacement] = React.useState(PLACEMENTS[0]);
  const [visible, setVisible] = React.useState(false);

  const togglePopover = () => {
    setVisible(!visible);
  };
  const Footer = () => (
    <View style={styles.footerContainer}>
      <Button onPress={submitToWS}>Start iCoffee! :)</Button>
    </View>
  );

  function submitToWS() {
    console.log(oz);
    console.log(coffeeType);
    ws.ws.send(JSON.stringify({Message: 'hello', Data: {"Oz": oz['text'], "Type": coffeeType['text']}}));
    coffeeState.setCountDown(true)
    turnOffModal()
  }

  function handleCoffeePress() {
    if (state.iCoffeeIP == '') {
      return;
    }
    setVisibleModal(true);
    var wsIp = 'ws://' + state.iCoffeeIP.toString() + ':12345';
    if (ws.ws === null) {
      ws.setWs(new WebSocket(wsIp));
      console.log('uh oh');
    }
  }

  var buttonText = coffeeState.countDown
    ? 'Est. Time Left: ' + coffeeState.countDownTimer + '\n'
    : 'Start iCoffee :)';
  var buttonTextExtra = coffeeState.countDown ? `iCoffee is currently ${ws.coffeeState}` : '';

  return (
    <>
      <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {coffeeState.nightTime === true && (
          <>
            <Text>It is night time.</Text>
            <Text>Are you sure you want to drink coffee?</Text>
          </>
        )}
        {coffeeState.nightTime === false && (
          <>
            <Text>Drink some coffee :)</Text>
          </>
        )}
        <CoffeeStart />

        <Button
          onPress={handleCoffeePress}
          style={styles.button}
          size="large"
          disabled={coffeeState.countDown}>
          {buttonText}
          {buttonTextExtra}
        </Button>

        <Modal
          visible={visibleModal}
          onBackdropPress={turnOffModal}
          backdropStyle={styles.backdrop}>
          <Layout level="3" style={styles.modalContainer}>
            <Card header={Header} style={styles.cardContainer} footer={Footer}>
              <Select
                data={typeOfCoffee}
                selectedOption={coffeeType}
                onSelect={setCoffeeType}
                label={'How do you like your Coffee?'}
              />
              <Select
                data={ounce}
                selectedOption={oz}
                onSelect={setOz}
                label={'Coffee Size?'}
              />
            </Card>
          </Layout>
        </Modal>
      </Layout>
    </>
  );

  function turnOnModal() {
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
    turnOffModal();
    setWifi();
    setSsid('');
    setWifiPass('');
  }
}
