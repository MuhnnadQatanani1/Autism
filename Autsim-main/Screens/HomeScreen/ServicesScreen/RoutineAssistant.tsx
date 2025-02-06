import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Audio } from "expo-av";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NavBar from "../../../Components/NavBar";

const Daily = () => {
  const insets = useSafeAreaInsets();
  const [activities, setActivities] = useState([
    {
      id: "1",
      title: "Morning Exercise",
      time: "08:00 AM",
      completed: false,
      icon: "🏃‍♂️",
    },
    {
      id: "2",
      title: "Breakfast",
      time: "09:00 AM",
      completed: false,
      icon: "🍽️",
    },
    {
      id: "3",
      title: "Reading Time",
      time: "10:00 AM",
      completed: false,
      icon: "📖",
    },
    {
      id: "4",
      title: "Team Meeting",
      time: "11:00 AM",
      completed: false,
      icon: "👥",
    },
    {
      id: "5",
      title: "Lunch Break",
      time: "01:00 PM",
      completed: false,
      icon: "🍲",
    },
    {
      id: "6",
      title: "Project Work",
      time: "02:00 PM",
      completed: false,
      icon: "💻",
    },
    {
      id: "7",
      title: "Coffee Break",
      time: "04:00 PM",
      completed: false,
      icon: "☕",
    },
    {
      id: "8",
      title: "Evening Walk",
      time: "06:00 PM",
      completed: false,
      icon: "🚶‍♂️",
    },
    {
      id: "9",
      title: "Dinner",
      time: "07:30 PM",
      completed: false,
      icon: "🍽️",
    },
    {
      id: "10",
      title: "Planning for Tomorrow",
      time: "09:00 PM",
      completed: false,
      icon: "📝",
    },
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("");

  const playSystemSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../../../assets/y2mate.com - Success Sound Effect.mp3")
      );
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const toggleComplete = (id: string) => {
    setActivities((prevActivities) =>
      prevActivities.map((activity) =>
        activity.id === id
          ? { ...activity, completed: !activity.completed }
          : activity
      )
    );
    playSystemSound();
  };

  const addActivity = () => {
    if (!newTitle.trim() || !newTime.trim()) {
      Alert.alert("Error", "Please enter both title and time.");
      return;
    }
    const newActivity = {
      id: (activities.length + 1).toString(),
      title: newTitle,
      time: newTime,
      completed: false,
      icon: "📝",
    };
    setActivities([...activities, newActivity]);
    setNewTitle("");
    setNewTime("");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <NavBar color="#eef5ff" />
      <Text style={styles.title}>Daily Program</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New activity title"
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Time (e.g., 10:00 AM)"
          value={newTime}
          onChangeText={setNewTime}
        />
        <TouchableOpacity style={styles.addButton} onPress={addActivity}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.activityRow,
              item.completed && styles.completedActivity,
            ]}
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>{item.title}</Text>
              <Text style={styles.activityTime}>{item.time}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleComplete(item.id)}>
              <Text style={styles.completeButton}>
                {item.completed ? "Undo" : "Complete"}
              </Text>
            </TouchableOpacity>
            {item.completed && <Text style={styles.checkMark}>✅</Text>}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#eef5ff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2b2b52",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 5,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  completedActivity: {
    backgroundColor: "#d1ffd6",
    borderColor: "#b2fab4",
  },
  icon: {
    fontSize: 26,
    marginRight: 15,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3a3a3a",
  },
  activityTime: {
    fontSize: 16,
    color: "#666",
  },
  completeButton: {
    fontSize: 16,
    color: "#28a745",
    fontWeight: "bold",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  checkMark: {
    fontSize: 24,
    color: "#28a745",
    marginLeft: 10,
  },
});

export default Daily;
