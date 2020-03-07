import * as React from 'react'
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ApplicationProvider} from '@ui-kitten/components';
import { mapping, light as lightTheme } from '@eva-design/eva';

import Icon from 'react-native-ionicons'
import {Platform} from 'react-native';

import { BluetoothScreen } from './Components/Screens/BluetoothScreen'

import {iCoffeeScreen} from './Components/Screens/iCoffeeScreen'

const Tab = createBottomTabNavigator();
export default function App() {
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

