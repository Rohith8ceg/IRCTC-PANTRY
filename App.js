import * as React from 'react'
import { LogBox } from 'react-native'

import * as eva from '@eva-design/eva'
import { ApplicationProvider, Menu } from '@ui-kitten/components'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import GlobalState from './contexts/GlobalState'

import MainTabScreen from './screens/MainTabScreen';
import HomeScreen from './screens/HomeScreen'
import MenuScreen from './screens/MenuScreen'
import CartScreen from './screens/CartScreen'

const Stack = createNativeStackNavigator();

export default function App() {
  LogBox.ignoreLogs(['Setting a timer',"It looks like you're using the development build of the Firebase JS SDK."]);
  const [cartlist, setCartlist] = React.useState({});
  return (
    <GlobalState.Provider value={[cartlist, setCartlist]}>
      <ApplicationProvider { ...eva } theme={eva.light}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Menu" component={MenuScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </GlobalState.Provider>
    
    );
}




