import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { BottomNavigation, BottomNavigationTab } from '@ui-kitten/components'

<<<<<<< HEAD
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
=======
import { MenuNavigation, StatusNavigation, HistoryNavigation } from '../components/Navigation'

const { Navigator, Screen } = createBottomTabNavigator()
>>>>>>> dev

const CustomBottomTabBar = ({ navigation, state }) => {
  return (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={index => {navigation.navigate(state.routeNames[index])}} >
      <BottomNavigationTab title="Home" />
      <BottomNavigationTab title="Status" />
      <BottomNavigationTab title="History" />
    </BottomNavigation>
)}

const MainTabScreen = () => (
<<<<<<< HEAD
    <Navigator tabBar = {props => <CustomBottomTabBar {...props} />}>
      <Screen name={homeName} component={HomeScreen}/>
      <Screen name={orderStatus} component={OrderStatusScreen}/>
      <Screen name={orderHistory} component={OrderHistoryScreen}/>
      <Screen name={menuScreen} component={MenuScreen}/>
      <Screen name={cartScreen} component={CartScreen}/>
=======
  <NavigationContainer>
    <Navigator 
      screenOptions={{
        headerShown: false
      }} 
      tabBar = {props => <CustomBottomTabBar {...props} />} 
    >
      <Screen name="H" component={MenuNavigation}/>
      <Screen name="S" component={StatusNavigation}/>
      <Screen name="Hi" component={HistoryNavigation}/>
>>>>>>> dev
    </Navigator>
  </NavigationContainer>
)

export default MainTabScreen