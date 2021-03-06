import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import MenuScreen from "../screens/MenuScreen";
import OrderStatusScreen from "../screens/OrderStatusScreen";
import OrderHistoryScreen from "../screens/OrderHistoryScreen";
import CartScreen from "../screens/CartScreen";
import OrderViewScreen from "../screens/OrderViewScreen";

const Stack = createNativeStackNavigator();

const MenuNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
    </Stack.Navigator>
  );
};

const StatusNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Status" component={OrderStatusScreen} />
      <Stack.Screen name="Order Details" component={OrderViewScreen} />
    </Stack.Navigator>
  );
};

const HistoryNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="History" component={OrderHistoryScreen} />
      <Stack.Screen name="Order Details" component={OrderViewScreen} />
    </Stack.Navigator>
  );
};

export { MenuNavigation, StatusNavigation, HistoryNavigation };
