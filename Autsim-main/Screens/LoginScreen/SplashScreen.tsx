import {
  View,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import React from "react";
import LogoSvg from "../../Icons/LogoSvg";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../RootStackParamList";

const SplashScreen = () => {
  const Navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <LogoSvg />
      <View
        style={{
          flex: 1,
          alignSelf: "center",
          flexDirection: "column-reverse",
          marginBottom: hp("10%"),
        }}
      >
        <TouchableOpacity onPress={() => Navigation.navigate("Login")}>
          <View
            style={{
              marginTop: "4%",
              backgroundColor: "#449E8B",
              padding: wp("3%"),
              borderRadius: 16,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontSize: hp("1.8"),
              }}
            >
              Get Started
            </Text>
          </View>
        </TouchableOpacity>
        <Text
          style={{
            textAlign: "center",
            fontSize: hp("1.8"),
            fontWeight: "bold",
          }}
        >
          Welcome To Autson أنيس
        </Text>
        <View
          style={{ alignSelf: "center", flex: 1, justifyContent: "center" }}
        >
          <Text style={{ fontSize: hp("5%"), fontFamily: "Cj.ttf" }}>أنيس</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;
