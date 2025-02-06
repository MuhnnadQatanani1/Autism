import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../RootStackParamList";
import { FlatList } from "react-native-gesture-handler";
import { dataServices } from "./InterfacceDataServices";
import RenderDataServices from "./RenderDataServices";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import NavBar from "../../../Components/NavBar";

const ServicesPage = () => {
  const navigation = useNavigation<NavigationProp<string>>();

  const NavigationScreen = (screen: string) => {
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#FFF5E1",
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <NavBar color="#FFF5E1" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Our Services</Text>
        </View>
      </View>
      <FlatList
        style={{
          alignSelf: "center",
          marginTop: hp("1%"),
        }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        data={dataServices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <RenderDataServices
            onPress={NavigationScreen}
            name={item.name}
            Icon={item.Icon}
          />
        )}
        numColumns={2}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FFF5E1",
  },
  header: {
    height: hp("15%"),
    backgroundColor: "#FFE4C4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 20,
    elevation: 8,
  },
  headerText: {
    fontSize: 32,
    color: "#333",
    fontWeight: "bold",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
});

export default ServicesPage;
