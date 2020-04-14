import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ApplicationProvider} from '@ui-kitten/components';
import { mapping, light as lightTheme } from '@eva-design/eva';

import Icon from 'react-native-ionicons'
import {Platform} from 'react-native';
import { Alert } from 'react-native';

import { BluetoothScreen } from './Components/Screens/BluetoothScreen'

import {iCoffeeScreen} from './Components/Screens/iCoffeeScreen'
import { Notifications } from 'react-native-notifications'
import {useEffect} from 'react'
import firebase from "@react-native-firebase/app";
import messaging from '@react-native-firebase/messaging';

var PushNotification = require("react-native-push-notification");

const Tab = createBottomTabNavigator();
export default function App() {
  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function(token) {
      console.log("TOKEN:", token);
    },
   
    // (required) Called when a remote or local notification is opened or received
    onNotification: function(notification) {
      console.log("NOTIFICATION:", notification);
      const date = new Date(Date.now());
      PushNotification.localNotification({
        /* Android Only Properties */
        id: '0', // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
        ticker: "My Notification Ticker", // (optional)
        autoCancel: true, // (optional) default: true
        largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
        smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
        // bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
        // subText: "This is a subText", // (optional) default: none
        color: "red", // (optional) default: system default
        vibrate: true, // (optional) default: true
        vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        tag: 'some_tag', // (optional) add tag to message
        group: "group", // (optional) add group to message
        ongoing: false, // (optional) set whether this is an "ongoing" notification
        priority: "high", // (optional) set notification priority, default: high
        visibility: "private", // (optional) set notification visibility, default: private
        importance: "high", // (optional) set notification importance, default: high
    
        /* iOS only properties */
        alertAction: 'view', // (optional) default: view
        category: '', // (optional) default: empty string
        userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
    
        /* iOS and Android properties */
        title: notification["title"], // (optional)
        message: notification["body"], // (required)
        playSound: false, // (optional) default: true
        // soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
        // number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
        // repeatType: 'day', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
        actions: '["OK"]',  // (Android only) See the doc for notification actions to know more
    });
      // process the notification
   
      // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
      // notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
   
    // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
    senderID: "8532134228",
   
    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true
    },
  
    popInitialNotification: true,
  
    requestPermissions: true
  });

  return (
        <ApplicationProvider mapping={mapping} theme={lightTheme}>
        <NavigationContainer>
          <Tab.Navigator
              screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconNameAndroid;
                let iconNameIOS;
                if (route.name == 'iCoffee') {
                  iconNameAndroid = focused ? 'ios-cafe' : 'ios-cafe';
                  iconNameIOS = focused ? 'radio' : 'radio-outline'
                } else if (route.name == 'Bluetooth') {
                  iconNameAndroid = focused ? 'md-bluetooth' : 'md-bluetooth'
                }

                // You can return any component that you like here!
                return <Icon android={iconNameAndroid} ios={iconNameIOS} size={size} color={color} />;
              },
            })}
            tabBarOptions={{
              activeTintColor: 'blue',
              inactiveTintColor: 'gray',
            }}
          >
            <Tab.Screen name="iCoffee" component={iCoffeeScreen} />
            <Tab.Screen name="Bluetooth" component={BluetoothScreen} />
          </Tab.Navigator>
        </NavigationContainer>
    </ApplicationProvider>
  );
}

// export default function App(){

//   return(
//     <NavigationContainer>
//       <Tab.Navigator>
//         <Tab.Screen name="Home" component={HomeScreen} />
//         <Tab.Screen name="Settings" component={SettingsScreen} />
//       </Tab.Navigator>
//     </NavigationContainer>    
    // <ApplicationProvider mapping={mapping} theme={lightTheme}>
    //     <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

    //       {/* for scanning */}
    //       <Layout style={styles.container}>
    //         <Button style={styles.button} onPress={handleButtonScan} disabled={peripheral_devices.scanning}>{btnScanTitle}</Button>
    //       </Layout>
    //       {/* end scanning */}

    //       {/* Get current peripheral */}
    //       <View style={{margin: 10}}>
    //         <Button  onPress={() => retrieveConnected() } > Retrieve connected peripherals</Button>    
    //       </View>
    //       {/* End getting current peripheral */}


    //     </Layout>
    //     <BottomNav BluetoothScreen={BluetoothScreen}/>
    // </ApplicationProvider>
    // )
// };

// const AppContainer = createAppContainer(App);

// export default App;

// npx react-native start
// npx react-native run-android --port=8081 --deviceId=988bdc313553543548 --no-jetifier

