import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import NavBar from "../../../Components/NavBar";

type DataArry = {
  id: string;
  category: string;
  title: string;
  description: string;
};

const resourcesData: DataArry[] = [
  {
    id: "1",
    category: "Health & Wellness",
    title: "Mindfulness Basics",
    description:
      "Mindfulness is the practice of purposely bringing one's attention to the present moment without judgment, a skill one develops through meditation or other training. Mindfulness derives from sati, a significant element of Buddhist traditions, and based on Zen, Vipassanā, and Tibetan meditation techniques. \n\nIn mindfulness, one becomes aware of thoughts, feelings, and sensations in a way that suspends judgment and self-criticism. It allows for greater emotional awareness and understanding. Mindfulness can be developed through specific meditation practices that include breathing exercises, body scans, and focused attention.\n\nStudies have shown that practicing mindfulness helps in reducing stress, anxiety, and depression. This guide covers the basic principles of mindfulness and offers beginner techniques to incorporate into daily life.",
  },
  {
    id: "2",
    category: "Productivity",
    title: "Time Management Techniques",
    description:
      "Effective time management is crucial for achieving both personal and professional goals. \n\nTime management strategies include prioritizing tasks, breaking tasks into smaller, manageable parts, and setting achievable deadlines. One of the most popular techniques is the Pomodoro Technique, where work is divided into 25-minute focused sessions followed by a 5-minute break. This method helps in maintaining focus and reducing burnout.\n\nAdditionally, the Eisenhower Matrix helps to prioritize tasks based on urgency and importance, while tools like calendars and to-do lists keep track of tasks and deadlines. Learning to say no and setting boundaries are also essential aspects of managing time effectively. In this guide, you will find an in-depth explanation of various techniques along with examples to implement in your routine.",
  },
  {
    id: "3",
    category: "Fitness",
    title: "Home Workout Routine",
    description:
      "This home workout routine is designed for individuals who may not have access to a gym but still want to stay fit and active. It includes a variety of exercises targeting different muscle groups to ensure a balanced workout. \n\nBegin with a warm-up that includes dynamic stretching exercises to prepare your muscles and joints. Then, move on to strength training exercises such as push-ups, squats, and lunges, which are effective and require no equipment.\n\nCardio exercises like jumping jacks, high knees, and burpees will raise your heart rate and help in burning calories. Finally, cool down with stretching exercises to relax your muscles. Regularly following this routine will improve cardiovascular health, strength, and endurance. For best results, repeat this routine 3-4 times a week.",
  },
  {
    id: "4",
    category: "Career Development",
    title: "Resume Building Tips",
    description:
      "A well-crafted resume is essential for job seekers as it is the first impression you make on potential employers. \n\nTo create an effective resume, start with a strong summary or objective that highlights your skills and experience relevant to the position. Make sure to list your achievements rather than just job duties, as employers are interested in what you accomplished. Use action verbs and quantify your achievements to make them impactful.\n\nKeep the design simple and professional, with easy-to-read fonts and clear headings. Tailor your resume for each job application by emphasizing different skills and experiences based on the job description. This guide provides detailed examples and templates to help you create a resume that stands out.",
  },
  {
    id: "5",
    category: "Health & Wellness",
    title: "Healthy Eating Habits",
    description:
      "Healthy eating is about more than just dieting or avoiding unhealthy foods. It involves creating a balanced diet that includes all the nutrients your body needs to function optimally.\n\nA balanced diet typically includes vegetables, fruits, lean proteins, whole grains, and healthy fats. Consuming a variety of foods ensures that you get a wide range of nutrients. Avoid processed foods, sugary drinks, and excessive salt, as these can negatively impact your health.\n\nMeal planning and mindful eating are essential practices to develop healthy eating habits. Planning your meals in advance reduces the chances of unhealthy snacking, and being mindful while eating improves digestion and satisfaction. This guide provides recipes, meal plans, and strategies for maintaining healthy eating habits.",
  },
];

const categories = [
  "All",
  "Health & Wellness",
  "Productivity",
  "Fitness",
  "Career Development",
];

const Learn = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedResource, setSelectedResource] = useState<DataArry | null>(
    null
  );

  const filteredResources =
    selectedCategory === "All"
      ? resourcesData
      : resourcesData.filter(
          (resource) => resource.category === selectedCategory
        );

  const handleResourcePress = (resource: DataArry) => {
    setSelectedResource(resource);
  };

  const handleBackToList = () => {
    setSelectedResource(null);
  };

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <NavBar color="#f9fafc" />
        <View style={styles.container}>
          {selectedResource ? (
            <ScrollView contentContainerStyle={styles.detailContainer}>
              <TouchableOpacity onPress={handleBackToList}>
                <Text style={styles.backButton}>← Back to Resources</Text>
              </TouchableOpacity>
              <Text style={styles.title}>{selectedResource.title}</Text>
              <Text style={styles.description}>
                {selectedResource.description}
              </Text>
            </ScrollView>
          ) : (
            <>
              <Text style={styles.header}>Learning Resources</Text>
              <View style={styles.categoryContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category &&
                        styles.selectedCategoryButton,
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        selectedCategory === category &&
                          styles.selectedCategoryText,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <FlatList
                data={filteredResources}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.resourceItem}
                    onPress={() => handleResourcePress(item)}
                  >
                    <Text style={styles.resourceTitle}>{item.title}</Text>
                    <Text style={styles.resourceDescription}>
                      {item.description.slice(0, 100)}...
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </>
          )}
        </View>
      </SafeAreaView>
    </>
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
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: "#EEE",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    margin: 5,
  },
  selectedCategoryButton: {
    backgroundColor: "#FF5722",
  },
  categoryText: {
    color: "#333",
    fontSize: 14,
  },
  selectedCategoryText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  resourceItem: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  resourceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  resourceDescription: {
    fontSize: 14,
    color: "#666",
  },
  detailContainer: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  backButton: {
    color: "#FF5722",
    fontSize: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    textAlign: "justify",
  },
});

export default Learn;
