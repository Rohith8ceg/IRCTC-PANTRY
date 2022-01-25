import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BottomNavigation, BottomNavigationTab } from '@ui-kitten/components';

import HomeScreen from './HomeScreen';
import OrderStatusScreen from './OrderStatusScreen';
import OrderHistoryScreen from './OrderHistoryScreen';
import MenuScreen from './MenuScreen';
import CartScreen from './CartScreen';

const homeName = "Home";
const orderStatus = "Status";
const orderHistory = "History";
const menuScreen = "Menu";
const cartScreen = "Cart";

const { Navigator, Screen } = createBottomTabNavigator();

const CustomBottomTabBar = ({ navigation, state }) => {
  return (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={index => {navigation.navigate(state.routeNames[index])}} >
      <BottomNavigationTab title={homeName} />
      <BottomNavigationTab title={orderStatus} />
      <BottomNavigationTab title={orderHistory} />
    </BottomNavigation>
)}

const MainTabScreen = () => (
    <Navigator tabBar = {props => <CustomBottomTabBar {...props} />}>
      <Screen name={homeName} component={HomeScreen}/>
      <Screen name={orderStatus} component={OrderStatusScreen}/>
      <Screen name={orderHistory} component={OrderHistoryScreen}/>
      <Screen name={menuScreen} component={MenuScreen}/>
      <Screen name={cartScreen} component={CartScreen}/>
    </Navigator>
)

export default MainTabScreen;