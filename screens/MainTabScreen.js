import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from './HomeScreen';
import OrderStatusScreen from './OrderStatusScreen';
import OrderHistoryScreen from './OrderHistoryScreen';

const homeName = "Home";
const orderStatus = "Status";
const orderHistory = "History";

const Tab = createBottomTabNavigator();

function MainTabScreen() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === homeName) {
              iconName = focused ? 'list' : 'list-outline';

            } else if (rn === orderStatus) {
              iconName = focused ? 'list' : 'list-outline';

            } else if (rn === orderHistory) {
              iconName = focused ? 'list' : 'list-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'grey',
          labelStyle: { paddingBottom: 10, fontSize: 10 },
          style: { padding: 10, height: 70}
        }}>

        <Tab.Screen name={homeName} component={HomeScreen} />
        <Tab.Screen name={orderStatus} component={OrderStatusScreen} />
        <Tab.Screen name={orderHistory} component={OrderHistoryScreen} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MainTabScreen;