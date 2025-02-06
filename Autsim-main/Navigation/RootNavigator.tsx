import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../Screens/LoginScreen/SplashScreen";
import LoginScreen from "../Screens/LoginScreen/LoginScreen";
import Register from "../Screens/Register/Register";
import HomeNavigator from "../Screens/HomeScreen/HomeNavigator";
import SupportDashboard from "../Screens/Support/SupportDashboard";
import { RootStackParamList } from "../RootStackParamList";
import PecsCard from "../Screens/Support/PecsCard";
import AddPecsCardScreen from "../Screens/Support/AddPecs";
import UpdateProfile from "../Screens/Support/UpdateProfile";

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName="SplashScreen"
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Home" component={HomeNavigator} />
      <Stack.Screen name="SupportDashboard" component={SupportDashboard} />
      <Stack.Screen name="PecsCard" component={PecsCard} />
      <Stack.Screen name="AddPecsCard" component={AddPecsCardScreen} />
      <Stack.Screen name="UpdateProfile" component={UpdateProfile} />

    </Stack.Navigator>
  );
};

export default RootNavigator;