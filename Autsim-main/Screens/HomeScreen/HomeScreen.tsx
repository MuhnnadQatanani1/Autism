import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import useUser from "../../hooks/User";
import HomeLogo from "../../Icons/HomeLogo";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { FlatList } from "react-native-gesture-handler";
import { data } from "./InterfaceDataHome";
import RenderDataHome from "./RenderDataHome";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import LogoutSquare01Icon from "../../Icons/Logout";
import JockerModal from "../../Components/JockerModal";
import { BlurView } from "expo-blur";
import BackArrowAndroid from "../../Components/BackAndroid";

const HomeScreen = () => {
  const [isOpen, setIsOpen] = useState(false);
  const Navigation = useNavigation<NavigationProp<any>>();
  const NavigationScreen = (screen: string) => {
    Navigation.navigate(screen);
  };
  const { user, setUser } = useUser();

  const handleLogout = () => {
    setUser(null);
    Navigation.navigate('Login');
  };


  const toggleModdal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <BackArrowAndroid />
      <SafeAreaView
        style={{
          backgroundColor: "#FFFFFF",
          flex: 1,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            padding: 10,
          }}
        >
          <HomeLogo />
          <Text
            style={{ fontSize: hp("1.5%") }}
          >{`Welcome Back ${user?.firstname}`}</Text>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setIsOpen(true)}>
            <View style={{ flexDirection: "row-reverse", marginRight: "1%" }}>
              <LogoutSquare01Icon />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ padding: 10 }}>
          <Text style={{ marginTop: hp("2%"), fontSize: hp("1.8%") }}>
            {" "}
            Birmingham and Solihull {"\n"} All Age Autism Support Services
          </Text>
        </View>
        <FlatList
          data={data}
          style={{ flexGrow: 1 }}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <RenderDataHome
              onPressItem={NavigationScreen}
              name={item.name}
              Icon={item.Icon}
            />
          )}
        />
      </SafeAreaView>
      {isOpen && <BlurView intensity={100} style={styles.blurView} />}
      <JockerModal
        onPress={handleLogout}
        isDissmiss={false}
        title="Logout"
        isVisable={isOpen}
        onClose={toggleModdal}
      />
    </>
  );
};

const styles = StyleSheet.create({
  blurView: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});

export default HomeScreen;
