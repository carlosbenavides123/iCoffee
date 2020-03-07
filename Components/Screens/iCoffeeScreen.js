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

    function handleCoffeePress() {
        coffeeState.setCountDown(true)
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
