import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { BottomNavigation, BottomNavigationTab } from '@ui-kitten/components'

import { MenuNavigation, StatusNavigation, HistoryNavigation } from '../components/Navigation'

const { Navigator, Screen } = createBottomTabNavigator()

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
    </Navigator>
  </NavigationContainer>
)

export default MainTabScreen