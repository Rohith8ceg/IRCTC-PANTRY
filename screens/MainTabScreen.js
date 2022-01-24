import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BottomNavigation, BottomNavigationTab } from '@ui-kitten/components';

import HomeScreen from './HomeScreen';
import OrderStatusScreen from './OrderStatusScreen';
import OrderHistoryScreen from './OrderHistoryScreen';
import MenuScreen from './MenuScreen';

const homeName = "Home";
const orderStatus = "Status";
const orderHistory = "History";

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
      <Screen name={"Menu"} component={MenuScreen}/>
    </Navigator>
)

export default MainTabScreen;