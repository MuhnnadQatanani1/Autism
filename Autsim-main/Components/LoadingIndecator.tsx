import React from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { BlurView } from "expo-blur";


const LoadingIndicator = () => {
  return (
    <BlurView experimentalBlurMethod="dimezisBlurView" intensity={100} style={styles.blurView}>
        <ActivityIndicator size={'large'} color={'#4CAF50'}/>
    </BlurView>
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

export default LoadingIndicator;
