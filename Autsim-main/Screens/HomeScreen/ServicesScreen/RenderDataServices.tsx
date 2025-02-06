import React from "react";

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface Props {
  Icon: string;
  name: string;
  onPress: (screen: string) => void;
}

const RenderDataServices = ({ Icon, name, onPress }: Props) => {
  return (
    <View style={styles.Box}>
      <TouchableOpacity onPress={() => onPress(name)}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{Icon}</Text>
          <Text style={styles.label}>{name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 40,
    marginBottom: 10,
    color: "#4CAF50",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  Box: {
    margin: 5,
    width: "45%",
    padding: 10,
    justifyContent: "center",
    backgroundColor: "#FFF5E1",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
});

export default RenderDataServices;
