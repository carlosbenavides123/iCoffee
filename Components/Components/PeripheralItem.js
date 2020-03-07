import React from 'react';

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

const styles = StyleSheet.create({
    card: {
      width: '96%',
      marginBottom: '1%',
      marginLeft: '2%'
    },
  });


export function PeripheralItem({bluetoothItem}) {
  console.log(bluetoothItem, "yahoooooooooooooooooooooooooooooooooooooooooo")
	return(
        <Card style={styles.card}>
            <Text >{bluetoothItem[1]["name"]}</Text>
            <Text >RSSI: {bluetoothItem[1]["rssi"]}</Text>
            <Text >{bluetoothItem[1]["id"]}</Text>
        </Card>
	)
}