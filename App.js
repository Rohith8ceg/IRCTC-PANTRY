import * as React from 'react'
import { LogBox } from 'react-native'

import * as eva from '@eva-design/eva'
import { ApplicationProvider, Menu } from '@ui-kitten/components'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import MainTabScreen from './screens/MainTabScreen';
import HomeScreen from './screens/HomeScreen'
import MenuScreen from './screens/MenuScreen'

const Stack = createNativeStackNavigator();

export default function App() {
  LogBox.ignoreLogs(['Setting a timer',"It looks like you're using the development build of the Firebase JS SDK."]);
  return (
    <ApplicationProvider { ...eva } theme={eva.light}>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </ApplicationProvider>
    );
}


