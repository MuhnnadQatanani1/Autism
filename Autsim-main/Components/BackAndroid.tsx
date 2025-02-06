import { View, Text, Alert, BackHandler } from "react-native";
import React, { useEffect } from "react";

const BackArrowAndroid = () => {
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Exit",
        "Are You Sure You Want To Exit ?",
        [
          {
            text: "No",
            onPress: () => null,
          },
          {
            text: "Yes",
            onPress: () => BackHandler.exitApp(),
          },
        ],
        { cancelable: false }
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return <View />;
};

export default BackArrowAndroid;
