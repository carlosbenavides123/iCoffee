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

import  {CoffeeStart}  from '../Components/svg/CoffeeStart/CoffeeStart'
import {useCoffee} from '../Hooks/useCoffee';
import {useWs} from '../Hooks/useWs'
import io from "socket.io-client";

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    margin: 8,
  },
});

export function iCoffeeScreen() {
    const coffeeState = useCoffee()
    const ws = useWs();

    function handleCoffeePress() {
      console.log(ws.socket)
        // if(ws.socket.connected){
          // attempt again
          ws.ws.send(JSON.stringify({"Message": "hello"}))
          console.log(ws.socket)
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
                <Text>It is night time, are you sure you want to drink coffee?</Text>
            }
            { coffeeState.nightTime === false && 
                <Text>Drink some coffee :)</Text>
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
            
        </Layout>
      </>
    )
}
