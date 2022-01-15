// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
// import React, { useState } from "react";
import * as React from 'react';
// import AppStack from "./navigation";
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import MainTabScreen from './screens/MainTabScreen';
import { LogBox } from 'react-native';

export default function App() {
  LogBox.ignoreLogs(['Setting a timer']);
  return (
    <ApplicationProvider { ...eva } theme={eva.light}>
      <MainTabScreen/>
    </ApplicationProvider>
    );
}


