import React, { useEffect } from 'react';
import * as NavigationBar from "expo-navigation-bar";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./Navigation/RootNavigator"; // New import
import { PaperProvider } from "react-native-paper";
import { useFonts } from "expo-font";
import { View } from 'react-native';

export default function App() {
  useEffect(() => {
    const setupNavigationBar = async () => {
      await NavigationBar.setBackgroundColorAsync("white");
    };
    setupNavigationBar();
  }, []);

  // Load custom fonts
  let [fontsLoaded] = useFonts({
    "Cj.ttf": require("./assets/Cj.ttf"),
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: 'white' }} />;
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}