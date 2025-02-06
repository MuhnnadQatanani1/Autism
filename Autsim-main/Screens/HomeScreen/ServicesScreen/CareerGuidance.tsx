import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import NavBar from "../../../Components/NavBar";

type DataArray = {
  id: string;
  title: string;
  description: string;
};

const careerResources: DataArray[] = [
  {
    id: "1",
    title: "Resume Building Tips",
    description:
      "Learn how to create a standout resume that captures your skills and experience effectively.",
  },
  {
    id: "2",
    title: "Interview Preparation Guide",
    description:
      "Prepare for interviews with sample questions, answers, and tips to make a great impression.",
  },
  {
    id: "3",
    title: "Online Courses for Skill Development",
    description:
      "A list of recommended online courses to enhance your skills in various fields.",
  },
  {
    id: "4",
    title: "Networking Strategies",
    description:
      "Strategies to build a strong professional network that can help you in your career.",
  },
  {
    id: "5",
    title: "Job Search Tips",
    description:
      "Effective job search techniques to help you land your desired role.",
  },
];

const Career = () => {
  const [selectedResource, setSelectedResource] = useState<DataArray | null>(
    null
  );
  const [feedback, setFeedback] = useState("");
  const [isHelpful, setIsHelpful] = useState(false);

  const handleResourcePress = (resource: DataArray) => {
    setSelectedResource(resource);
    setIsHelpful(false);
    setFeedback("");
  };

  const handleHelpfulPress = () => {
    setIsHelpful(!isHelpful);
    Alert.alert(
      "Thank you!",
      isHelpful ? "Marked as not helpful" : "Marked as helpful"
    );
  };

  const handleFeedbackSubmit = () => {
    if (feedback.trim()) {
      Alert.alert("Feedback Received", "Thank you for your feedback!");
      setFeedback("");
    } else {
      Alert.alert("Please enter some feedback before submitting.");
    }
  };

  const handleBackToList = () => {
    setSelectedResource(null);
  };

  return (
    <View style={styles.container}>
      {selectedResource ? (
        <ScrollView contentContainerStyle={styles.detailContainer}>
          <TouchableOpacity onPress={handleBackToList}>
            <Text style={styles.backButton}>← Back to Resources</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{selectedResource.title}</Text>
          <Text style={styles.description}>{selectedResource.description}</Text>

          <View style={styles.feedbackContainer}>
            <TouchableOpacity
              style={[
                styles.helpfulButton,
                isHelpful && styles.helpfulButtonSelected,
              ]}
              onPress={handleHelpfulPress}
            >
              <Text style={styles.helpfulButtonText}>
                {isHelpful ? "Helpful ✔" : "Mark as Helpful"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.feedbackLabel}>Leave Feedback:</Text>
            <TextInput
              style={styles.feedbackInput}
              placeholder="Type your feedback here"
              value={feedback}
              onChangeText={setFeedback}
              multiline
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleFeedbackSubmit}
            >
              <Text style={styles.submitButtonText}>Submit Feedback</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <>
          <SafeAreaView
            style={{
              flex: 1,
              paddingTop:
                Platform.OS === "android" ? StatusBar.currentHeight : 0,
            }}
          >
            <NavBar color="#f0f0f5" />
            <Text style={styles.header}>Career Guidance</Text>
            <Text style={styles.subHeader}>
              Explore resources to help you grow your career.
            </Text>

            <FlatList
              data={careerResources}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resourceCard}
                  onPress={() => handleResourcePress(item)}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.resourceTitle}>{item.title}</Text>
                  </View>
                  <Text style={styles.resourceDescription}>
                    {item.description}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </SafeAreaView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f5",
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2a2a72",
    textAlign: "center",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  resourceCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderLeftWidth: 6,
    borderColor: "#2a2a72",
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
    marginBottom: 10,
  },
  resourceTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2a2a72",
  },
  resourceDescription: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
  },
  detailContainer: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  backButton: {
    color: "#2a2a72",
    fontSize: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2a2a72",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    marginBottom: 20,
    textAlign: "justify",
  },
  feedbackContainer: {
    marginTop: 20,
  },
  helpfulButton: {
    backgroundColor: "#ededed",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  helpfulButtonSelected: {
    backgroundColor: "#2a2a72",
  },
  helpfulButtonText: {
    color: "#2a2a72",
    fontSize: 16,
    fontWeight: "bold",
  },
  feedbackLabel: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  feedbackInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderColor: "#ddd",
    borderWidth: 1,
    fontSize: 16,
    color: "#333",
    minHeight: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#2a2a72",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Career;
