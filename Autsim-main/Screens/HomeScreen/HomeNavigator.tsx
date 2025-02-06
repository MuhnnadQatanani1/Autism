
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "../../RootStackParamList";  // تصحيح المسار ليصبح خارج مجلد Screens

// Screens
import HomeScreen from "./HomeScreen";
import SupportServices from "./Communication";
import ServicesNavigation from "./ServicesScreen/ServicesNavigation";
import Events from "./Events";

const Stack = createStackNavigator<RootStackParamList>();

const HomeNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="HomeNav"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' }
      }}
    >
      <Stack.Screen 
        name="HomeNav" 
        component={HomeScreen} 
      />
      <Stack.Screen 
        name="Communication" 
        component={SupportServices} 
      />
      <Stack.Screen 
        name="Services" 
        component={ServicesNavigation} 
      />
      <Stack.Screen 
        name="Events" 
        component={Events} 
      />
    </Stack.Navigator>
  );
};

export default HomeNavigator;

