import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { format } from "date-fns";
import NavBar from "../../../Components/NavBar";

interface Note {
  id: string;
  date: Date;
  content: string;
}

const initialNotes = [
  {
    id: "1",
    date: new Date(),
    content: "Patient showed improvement in social interactions.",
  },
  {
    id: "2",
    date: new Date(),
    content: "Patient responded positively to sensory exercises.",
  },
];

const Doctor = ({ content, date, id }: Note) => {
  const [notes, setNotes] = useState(initialNotes);
  const [newNote, setNewNote] = useState("");
  const [appointments, setAppointments] = useState([
    { id: "1", date: "2023-11-10", time: "10:00 AM" },
    { id: "2", date: "2023-11-15", time: "02:00 PM" },
  ]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([
        ...notes,
        { id: Date.now().toString(), date: new Date(), content: newNote },
      ]);
      setNewNote("");
    } else {
      Alert.alert("Please enter a note.");
    }
  };

  const openEditModal = (note: Note) => {
    setCurrentNote(note);
    setIsEditModalVisible(true);
  };

  const saveEditedNote = () => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === currentNote?.id ? currentNote : note
      )
    );
    setIsEditModalVisible(false);
    setCurrentNote(null);
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <NavBar color="#f9fafc" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={styles.header}>Patient Dashboard</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          <FlatList
            data={appointments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.appointmentItem}>
                <Text style={styles.appointmentText}>
                  {format(new Date(item.date), "MMMM d, yyyy")} at {item.time}
                </Text>
              </View>
            )}
          />
        </View>

        <View style={[styles.section, { flex: 1 }]}>
          <Text style={styles.sectionTitle}>Progress Notes</Text>
          <ScrollView style={styles.scrollView}>
            <FlatList
              data={notes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.noteItem}>
                  <TouchableOpacity
                    onPress={() => openEditModal(item)}
                    style={styles.noteContentContainer}
                  >
                    <Text style={styles.noteDate}>
                      {format(new Date(item.date), "MMMM d, yyyy")}
                    </Text>
                    <Text style={styles.noteContent}>{item.content}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => deleteNote(item.id)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </ScrollView>

          <TextInput
            style={styles.input}
            placeholder="Enter new note"
            value={newNote}
            onChangeText={setNewNote}
          />
          <TouchableOpacity style={styles.addButton} onPress={addNote}>
            <Text style={styles.addButtonText}>Add Note</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isEditModalVisible}
          onRequestClose={() => setIsEditModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Note</Text>
              <TextInput
                style={styles.modalInput}
                value={currentNote?.content || ""}
                onChangeText={(text) =>
                  setCurrentNote((prev) => ({
                    ...(prev ?? { id: "", date: new Date(), content: "" }),
                    content: text,
                  }))
                }
                multiline
              />
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveEditedNote}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafc",
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    backgroundColor: "#FFF5E1",
    borderRadius: 10,
    padding: 16,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF5722",
    marginBottom: 10,
  },
  appointmentItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  appointmentText: {
    fontSize: 16,
    color: "#333",
  },
  noteItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  noteContentContainer: {
    flex: 1,
  },
  noteDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  noteContent: {
    fontSize: 16,
    color: "#333",
  },
  deleteButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    fontSize: 16,
    color: "#333",
    borderColor: "#ddd",
    borderWidth: 1,
  },
  addButton: {
    backgroundColor: "#FF5722",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  scrollView: {
    maxHeight: "65%",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  modalInput: {
    backgroundColor: "#f9fafc",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
    borderColor: "#ddd",
    borderWidth: 1,
    minHeight: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#FF5722",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Doctor;
