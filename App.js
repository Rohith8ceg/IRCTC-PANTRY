import * as React from "react";
import { LogBox } from "react-native";

import * as eva from "@eva-design/eva";
import { ApplicationProvider, Menu } from "@ui-kitten/components";
import GlobalState from "./components/GlobalState";
import UserContext from "./components/UserContext";

import MainTabScreen from "./screens/MainTabScreen";

export default function App() {
  const [user, setUser] = React.useState({
    name: "",
    phone: null,
    error: false,
  });
  LogBox.ignoreLogs([
    "Setting a timer",
    "It looks like you're using the development build of the Firebase JS SDK.",
  ]);
  LogBox.ignoreAllLogs();
  const [cartlist, setCartlist] = React.useState({});
  return (
    <GlobalState.Provider value={[cartlist, setCartlist]}>
      <ApplicationProvider {...eva} theme={eva.light}>
        <UserContext.Provider value={[user, setUser]}>
          <MainTabScreen />
        </UserContext.Provider>
      </ApplicationProvider>
    </GlobalState.Provider>
  );
}
