import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ServicesPage from "./Services";
import RoutineAssistant from "./RoutineAssistant";
import Gaming from "./Gaming";
import Chatbot from "./Chatbot";
import DoctorsDashBoard from "./DoctorsDashBoard";
import LearningResources from "./LearningResources";
import CareerGuidance from "./CareerGuidance";

const Stack = createStackNavigator();
const ServicesNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="ServicesMain">
      <Stack.Screen
        name="ServicesMain"
        component={ServicesPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Routine Assistant"
        component={RoutineAssistant}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Gaming"
        component={Gaming}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chatbot"
        component={Chatbot}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Doctor's Dashboard"
        component={Chatbot}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Learning Resources"
        component={LearningResources}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Career Guidance"
        component={CareerGuidance}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ServicesNavigation;
