import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Animated,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { format, isBefore, addHours, parseISO, isEqual } from "date-fns";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import NavBar from "../../Components/NavBar";

type DataArray = {
  id: string;
  title: string;
  time: string;
  icon: string;
};

const eventsData: DataArray[] = [
  { id: "1", title: "Morning Yoga", time: "2023-11-04T08:00:00", icon: "🧘‍♀️" },
  {
    id: "2",
    title: "Business Meeting",
    time: "2023-11-04T10:00:00",
    icon: "📅",
  },
  {
    id: "3",
    title: "Lunch with Friends",
    time: "2023-11-04T13:00:00",
    icon: "🍲",
  },
  {
    id: "4",
    title: "Afternoon Workshop",
    time: "2023-11-04T15:00:00",
    icon: "💼",
  },
  {
    id: "5",
    title: "Evening Concert",
    time: "2023-11-04T19:00:00",
    icon: "🎸",
  },
  {
    id: "6",
    title: "Networking Event",
    time: "2023-11-05T10:00:00",
    icon: "🤝",
  },
  {
    id: "7",
    title: "Project Presentation",
    time: "2023-11-05T14:00:00",
    icon: "📊",
  },
  { id: "8", title: "Dinner Party", time: "2023-11-05T18:00:00", icon: "🍷" },
  { id: "9", title: "Night Hike", time: "2023-11-05T20:00:00", icon: "🌙" },
];

const Events = () => {
  const [selectedEvents, setSelectedEvents] = useState<DataArray[]>([]);
  const [animation] = useState(new Animated.Value(1));

  useEffect(() => {
    const setupNotifications = async () => {
      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          Alert.alert(
            "Permission Required",
            "You need to enable notifications to receive reminders."
          );
          return;
        }
      } else {
        Alert.alert("Error", "Must use a physical device for notifications.");
      }
    };

    setupNotifications();
  }, []);

  useEffect(() => {
    selectedEvents.forEach((event) => scheduleNotification(event));
  }, [selectedEvents]);

  const scheduleNotification = async (event: DataArray) => {
    const eventDate = parseISO(event.time);
    const notificationTime = addHours(eventDate, -1);

    if (isBefore(new Date(), notificationTime)) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Upcoming Event Reminder",
          body: `Your event "${event.title}" is starting in an hour.`,
        },
        trigger: notificationTime,
      });
    }
  };

  const toggleEventSelection = (event: DataArray) => {
    const isSelected = selectedEvents.find(
      (selectedEvent) => selectedEvent.id === event.id
    );

    if (isSelected) {
      // Deselect event
      setSelectedEvents(
        selectedEvents.filter((selectedEvent) => selectedEvent.id !== event.id)
      );
      Alert.alert(
        "Event Canceled",
        `Your reservation for "${event.title}" has been canceled.`
      );
    } else {
      // Check for time conflict
      const hasConflict = selectedEvents.some((selectedEvent) =>
        isEqual(parseISO(selectedEvent.time), parseISO(event.time))
      );

      if (hasConflict) {
        Alert.alert(
          "Schedule Conflict",
          `You already have an event at ${format(
            parseISO(event.time),
            "h:mm a"
          )}`
        );
        return;
      }

      // Select event
      setSelectedEvents((prevEvents) => [...prevEvents, event]);
      Alert.alert(
        "Event Selected",
        `You will be reminded an hour before "${event.title}".`
      );
      startAnimation();
    }
  };

  const startAnimation = () => {
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <NavBar color="#f9fafc" />
      <View style={styles.container}>
        <Text style={styles.title}>Events</Text>
        <FlatList
          data={eventsData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.eventItem,
                selectedEvents.find((e) => e.id === item.id) &&
                  styles.selectedEvent,
              ]}
              onPress={() => toggleEventSelection(item)}
            >
              <Animated.View style={{ transform: [{ scale: animation }] }}>
                <Text style={styles.icon}>{item.icon}</Text>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <Text style={styles.eventTime}>
                    {format(parseISO(item.time), "MMMM d, yyyy h:mm a")}
                  </Text>
                </View>
              </Animated.View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9fafc",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FF5722",
    textAlign: "center",
    marginBottom: 20,
  },
  eventItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 25,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedEvent: {
    borderColor: "#FF5722",
    backgroundColor: "#FFF1E1",
    borderWidth: 2,
  },
  icon: {
    fontSize: 40,
    marginRight: 20,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  eventTime: {
    fontSize: 18,
    color: "#777",
  },
});

export default Events;
