import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomNavigation, BottomNavigationTab } from "@ui-kitten/components";

import {
  MenuNavigation,
  StatusNavigation,
  HistoryNavigation,
} from "../components/Navigation";
import ProfileScreen from "./ProfileScreen";

const { Navigator, Screen } = createBottomTabNavigator();

const CustomBottomTabBar = ({ navigation, state }) => {
  return (
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={(index) => {
        navigation.navigate(state.routeNames[index]);
      }}
    >
      <BottomNavigationTab title="Menu" />
      <BottomNavigationTab title="Status" />
      <BottomNavigationTab title="History" />
      <BottomNavigationTab title="Profile" />
    </BottomNavigation>
  );
};

const MainTabScreen = () => (
  <NavigationContainer>
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomBottomTabBar {...props} />}
    >
      <Screen name="H" component={MenuNavigation} />
      <Screen name="S" component={StatusNavigation} />
      <Screen name="Hi" component={HistoryNavigation} />
      <Screen name="Profile" component={ProfileScreen} />
    </Navigator>
  </NavigationContainer>
);

export default MainTabScreen;
