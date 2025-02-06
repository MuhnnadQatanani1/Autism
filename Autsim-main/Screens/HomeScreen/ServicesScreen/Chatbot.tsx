import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NavBar from "../../../Components/NavBar";

const chatResponses: Record<string, string> = {
  Hello: "Hello! How can I assist you today?",
  Hi: "Hi there! How are you doing?",
  "Good morning": "Good morning! Hope you have a wonderful day ahead!",
  "Good afternoon": "Good afternoon! How can I help you?",
  "Good evening": "Good evening! How’s your evening going?",
  "How are you?": "I'm just a program, but I'm ready to assist you!",
  "What's up?": "Not much, just here to help you out! How about you?",
  Hey: "Hey! How can I assist you today?",
  Greetings: "Greetings! What would you like to know?",
  Welcome: "Welcome! Feel free to ask me anything.",

  "What are the symptoms of diabetes?":
    "Common symptoms of diabetes include increased thirst, frequent urination, hunger, fatigue, and blurred vision.",
  "What is high blood pressure?":
    "High blood pressure, or hypertension, is when the force of your blood against your artery walls is too high.",
  "How do I prevent heart disease?":
    "To prevent heart disease, maintain a healthy diet, exercise regularly, avoid smoking, and manage your stress levels.",
  "What is a stroke?":
    "A stroke happens when blood supply to part of your brain is interrupted, leading to potential brain damage. Symptoms include sudden numbness or confusion.",
  "What causes migraines?":
    "Migraines can be triggered by stress, certain foods, lack of sleep, or hormonal changes. Symptoms often include intense headaches, nausea, and sensitivity to light.",
  "How can I boost my energy?":
    "To boost your energy, stay hydrated, eat a balanced diet, get regular exercise, and ensure you're getting enough sleep.",
  "What are the benefits of a healthy diet?":
    "A healthy diet helps maintain weight, boosts immune function, supports mental health, and reduces the risk of chronic diseases.",
  "How can I improve my sleep?":
    "To improve sleep, try maintaining a consistent schedule, avoiding caffeine before bedtime, and creating a comfortable sleeping environment.",
  "What is depression?":
    "Depression is a mood disorder characterized by persistent feelings of sadness, loss of interest, and can interfere with daily activities.",
  "How can I reduce anxiety?":
    "To reduce anxiety, try breathing exercises, meditation, staying physically active, and seeking professional help if needed.",
  "What is arthritis?":
    "Arthritis is inflammation of the joints, causing pain and stiffness. Common types include osteoarthritis and rheumatoid arthritis.",
  "What is heart failure?":
    "Heart failure occurs when the heart is unable to pump blood efficiently, leading to fatigue, shortness of breath, and swelling.",
  "What is liver disease?":
    "Liver disease can range from mild conditions like fatty liver to more severe issues like cirrhosis or liver cancer.",
  "What are the benefits of yoga?":
    "Yoga improves flexibility, strengthens muscles, promotes relaxation, and can reduce stress and anxiety.",
  "What is gout?":
    "Gout is a form of arthritis caused by excess uric acid in the blood, leading to painful swelling in the joints.",
  "How do I treat a cold?":
    "To treat a cold, stay hydrated, rest, and use over-the-counter remedies like decongestants and pain relievers.",
  "What are the symptoms of kidney disease?":
    "Kidney disease symptoms include fatigue, swelling in the legs, high blood pressure, and changes in urination patterns.",
  "What is anemia?":
    "Anemia occurs when you don’t have enough red blood cells to carry oxygen to your body, leading to fatigue, weakness, and pale skin.",
  "How can I quit smoking?":
    "To quit smoking, use nicotine replacement therapies, join a support group, avoid triggers, and consider consulting a healthcare professional.",
  "What is Alzheimer's disease?":
    "Alzheimer's disease is a progressive neurological disorder that leads to memory loss and cognitive decline, affecting daily life.",
  "What are the symptoms of dehydration?":
    "Dehydration can cause dry mouth, dizziness, fatigue, confusion, and dark-colored urine.",
  "What are the benefits of walking?":
    "Walking helps improve cardiovascular health, boosts mood, strengthens muscles, and can help with weight loss.",
  "What is bronchitis?":
    "Bronchitis is the inflammation of the bronchial tubes in your lungs, often causing coughing, mucus production, and shortness of breath.",
  "What is insomnia?":
    "Insomnia is a sleep disorder that makes it hard to fall asleep, stay asleep, or both, leading to daytime fatigue.",
  "What is lupus?":
    "Lupus is an autoimmune disease where the body's immune system attacks its own tissues, causing inflammation, pain, and damage to organs.",
  "How do I lower my blood sugar?":
    "To lower blood sugar, manage your diet, exercise regularly, stay hydrated, and monitor blood glucose levels.",
  "What is a vegan diet?":
    "A vegan diet excludes all animal products, including meat, dairy, and eggs, focusing on plant-based foods like fruits, vegetables, and grains.",
  "How can I improve my digestive health?":
    "Improve digestive health by eating more fiber, staying hydrated, reducing stress, and consuming probiotics.",
  "What are the signs of a heart attack?":
    "Signs of a heart attack include chest pain, shortness of breath, nausea, and pain in the arms, back, or jaw.",
  "What is the common cold?":
    "The common cold is a viral infection that affects the nose and throat, causing symptoms like runny nose, sneezing, and a sore throat.",
  "What are the benefits of swimming?":
    "Swimming improves cardiovascular health, strengthens muscles, enhances flexibility, and is a low-impact exercise suitable for all ages.",

  // أسئلة لمرضى التوحد
  "I need to go to the bathroom":
    "Let’s find the nearest bathroom! Do you need help getting there?",
  "I want to eat":
    "Great! What would you like to eat? I can help you choose something healthy and tasty.",
  "I want to play":
    "Let’s play! What kind of game would you like to play today?",
  "I want to go outside":
    "Going outside sounds fun! Would you like to go for a walk or play in the park?",
  "I don’t feel well":
    "I’m sorry to hear that. Can you tell me how you’re feeling so I can help?",
  "I’m tired":
    "It’s important to rest when you’re tired. Would you like to relax or maybe take a nap?",
  "I want to watch a movie":
    "Watching a movie sounds like a great idea! Do you have a favorite one in mind?",
  "I need help": "I'm here to help! What do you need assistance with?",
  "I want to draw":
    "Drawing is so much fun! What would you like to draw today?",
  "I want to listen to music":
    "Music can be very relaxing. What type of music would you like to listen to?",
  "I feel angry":
    "It’s okay to feel angry sometimes. Would you like to talk about it or maybe take deep breaths to calm down?",
  "I feel happy":
    "I’m glad you’re feeling happy! What would you like to do to keep the good mood going?",
  "I want to play with my toys":
    "Playing with toys is always fun! Which toy do you want to play with?",
  "I’m bored":
    "Let’s find something fun to do! How about drawing, reading, or going outside?",
  "I want to build something":
    "Building is a great way to be creative! Do you want to use blocks or maybe do a craft?",
  "I’m scared":
    "It’s okay to feel scared. Can you tell me what’s making you feel that way so I can help?",
  "I need quiet time":
    "Taking some quiet time can help you feel better. Would you like to sit somewhere peaceful?",
  "I want to read a book":
    "Reading a book is a great idea! Do you have a favorite book, or would you like help choosing one?",
};

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { id: "1", sender: "bot", text: "Hello! How can I help you today? 😊" },
  ]);
  const [inputText, setInputText] = useState("");

  const sendMessage = () => {
    if (inputText.trim() === "") return;

    const newMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: inputText.trim(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    const botResponse =
      chatResponses[inputText.trim()] ||
      "I'm sorry, I don't have an answer for that.";
    const botMessage = {
      id: Date.now().toString() + "-bot",
      sender: "bot",
      text: botResponse,
    };

    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 1000);

    setInputText("");
  };

  const renderItem = ({ item }: { item: any }) => (
    <View
      style={[
        styles.messageBox,
        item.sender === "user" ? styles.userMessage : styles.botMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <NavBar color="#f5f5f5" />
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.messageList}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask me anything..."
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  messageList: {
    flex: 1,
  },
  messageBox: {
    maxWidth: "80%",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  userMessage: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  botMessage: {
    backgroundColor: "#EAEAEA",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  textInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ChatbotPage;
