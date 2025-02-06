import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../RootStackParamList";

interface Props {
  color?: string;
}

const NavBar = ({ color = "#FFFFFF" }: Props) => {
  const Navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <View
      style={{
        width: "100%",
        backgroundColor: color,
        flexDirection: "row",
        padding: 10,
      }}
    >
      <TouchableOpacity onPress={() => Navigation.goBack()}>
        <MaterialCommunityIcons
          name="keyboard-backspace"
          size={35}
          color="black"
        />
      </TouchableOpacity>
    </View>
  );
};

export default NavBar;
