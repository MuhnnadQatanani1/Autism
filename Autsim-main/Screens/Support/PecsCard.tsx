import {
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Text,
  Alert,
  Modal,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";
import { Card, ResponseData } from "../../Modals/Interface";
import Mic01Icon from "../../Icons/MicIcon";
import { Audio } from "expo-av";
import base64 from "react-native-base64";
import LoadingIndicator from "../../Components/LoadingIndecator";
import NavBar from "../../Components/NavBar";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../RootStackParamList";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

// Add axios interceptor for global error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      Alert.alert("Session Expired", "Please log in again");
    }
    return Promise.reject(error);
  }
);

const PecsCardScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const pageSize = 20;
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Card[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState<Card[]>([]);
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCardId, setSelectedCardId] = useState<number | undefined>(undefined);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const [currentLongPressedCard, setCurrentLongPressedCard] = useState<Card | null>(null);

  const fetchCards = async (pageNum: number, selectedPecsCardId?: number) => {
    setLoading(true);
    try {
      const response = await axios.get<ResponseData>(
        "https://autsim-qwrf.onrender.com/api/PecsCard/getAll",
        {
          params: {
            pageNumber: pageNum,
            pageSize: pageSize,
            ...(selectedPecsCardId && { pecsCardId: selectedPecsCardId }),
          },
        }
      );

      const totalCards = response.data.totalCount || 0;
      const newCards = response.data.cards || [];

      setTotalCount(totalCards);
      setData(prevData => {
        if (pageNum === 1) return newCards;
        return [...prevData, ...newCards];
      });

      setPage(pageNum);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch cards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedCardId) {
      fetchCards(page);
    }
  }, [page, selectedCardId]);

  const handlePressImage = (image: Card) => {
    fetchSingleCardAudio(image.id);
  };

  const fetchSingleCardAudio = async (cardId: number) => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://autsim-qwrf.onrender.com/api/PecsCard/pecs/read-names?",
        {
          responseType: "arraybuffer",
          params: { 'selectedPecsCardIds[0]': cardId.toString() },
        }
      );

      const audioData = new Uint8Array(response.data);
      await playSingleCardAudio(audioData);
    } catch (error) {
      console.error("Error fetching single card audio:", error);
      Alert.alert("Error", "Failed to fetch audio");
    } finally {
      setLoading(false);
    }
  };

  const playSingleCardAudio = async (audioData: Uint8Array) => {
    if (audioData) {
      try {
        if (sound) {
          await sound.stopAsync();
          await sound.unloadAsync();
        }

        const base64Audio = base64.encode(String.fromCharCode(...audioData));
        const audioUri = `data:audio/wav;base64,${base64Audio}`;
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { shouldPlay: true }
        );
        setSound(newSound);
        await newSound.playAsync();
      } catch (error) {
        console.error("Error playing single card audio:", error);
        Alert.alert("Error", "Failed to play audio");
      }
    }
  };

  const handleLongPress = (image: Card) => {
    setCurrentLongPressedCard(image);
    setShowDeleteConfirmation(true);
  };

  const confirmDeletePecsCard = () => {
    setShowDeleteConfirmation(true);
  };

  const deletePecsCard = async () => {
    if (!currentLongPressedCard) return;

    try {
      setLoading(true);
      const response = await axios.delete(
        `https://autsim-qwrf.onrender.com/api/PecsCard/delete/${currentLongPressedCard.id}`
      );
      
      if (response.status === 200 || response.status === 204) {
        setData((prevData) => prevData.filter((card) => card.id !== currentLongPressedCard.id));
        setSelectedImage((prevSelected) =>
          prevSelected.filter((card) => card.id !== currentLongPressedCard.id)
        );
        
        setShowDeleteConfirmation(false);
        setShowModal(false);
        
        Alert.alert(
          "Success", 
          "Card deleted successfully",
          [{ text: "OK" }]
        );
      }
    } catch (error: any) {
      console.error("Error deleting Pecs card:", error);
      
      let errorMessage = "Failed to delete the card";
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Card not found";
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection";
      }
      
      Alert.alert(
        "Error",
        errorMessage,
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
      setCurrentLongPressedCard(null);
    }
  };



  const handleAddPecs = () => {
    navigation.navigate('AddPecsCard');
  };

  const fetchAudio = async () => {
    if (selectedImage.length > 0) {
      try {
        setLoading(true);
        const params = selectedImage.reduce((acc, image, index) => {
          acc[`selectedPecsCardIds[${index}]`] = image.id.toString();
          return acc;
        }, {} as Record<string, string>);

        const response = await axios.get(
          "https://autsim-qwrf.onrender.com/api/PecsCard/pecs/read-names?",
          {
            responseType: "arraybuffer",
            params: params,
          }
        );

        setAudioData(new Uint8Array(response.data));
      } catch (error) {
        console.error("Error fetching audio:", error);
        Alert.alert("Error", "Failed to fetch audio");
      } finally {
        setLoading(false);
      }
    }
  };

  const playAudio = async () => {
    if (audioData) {
      try {
        const base64Audio = base64.encode(String.fromCharCode(...audioData));
        const audioUri = `data:audio/wav;base64,${base64Audio}`;
        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { shouldPlay: true }
        );
        setSound(sound);
        await sound.playAsync();
      } catch (error) {
        console.error("Error playing audio:", error);
        Alert.alert("Error", "Failed to play audio");
      }
    }
  };

  const clearSelection = () => {
    setSelectedImage([]);
    setAudioData(null);
    setSelectedCardId(undefined);
    setPage(1);
    setData([]);
    fetchCards(1);
  };

  useEffect(() => {
    fetchAudio();
  }, [selectedImage]);

  const loadMoreData = () => {
    if (!loading && data.length < totalCount) {
      fetchCards(selectedCardId ? page + 1 : page + 1, selectedCardId);
    }
  };

  const renderItem = ({ item, index }: { item: Card; index: number }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => handlePressImage(item)}
      onLongPress={() => handleLongPress(item)}
      delayLongPress={500}
    >
      <Image
        source={{ uri: `data:image/png;base64,${item.iFormFile}` }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderSelectedItem = ({ item, index }: { item: Card; index: number }) => (
    <View style={styles.selectedCardContainer}>
      <Image
        source={{ uri: `data:image/png;base64,${item.iFormFile}` }}
        style={styles.selectedCardImage}
      />
      <Text style={styles.selectedCardText}>{item.name}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <NavBar />
      <View style={styles.topBar}>
        

     
        
       
      </View>

      <FlatList
        data={data}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.1}
        numColumns={3}
        contentContainerStyle={styles.mainContent}
        columnWrapperStyle={styles.columnWrapper}
      />
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddPecs}
      >
        <Text style={styles.addButtonText}>Add Pecs</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={confirmDeletePecsCard}
            >
              <Text style={[styles.modalOptionText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
          
            <TouchableOpacity 
              style={[styles.modalOption, styles.modalCancelOption]}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showDeleteConfirmation}
        onRequestClose={() => setShowDeleteConfirmation(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.deleteConfirmHeader}>
              <Text style={styles.deleteConfirmTitle}>Confirm Deletion</Text>
              <Text style={styles.deleteConfirmText}>
                Are you sure you want to delete this PECS card?
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.modalOption}
              onPress={deletePecsCard}
            >
              <Text style={[styles.modalOptionText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalOption, styles.modalCancelOption]}
              onPress={() => setShowDeleteConfirmation(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp('4%'),
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E9F0",
    elevation: 2,
  },
  clearButton: {
    backgroundColor: "#FF5252",
    paddingVertical: wp('2%'),
    paddingHorizontal: wp('4%'),
    borderRadius: wp('4%'),
    elevation: 2,
  },
  clearButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: wp('3.5%'),
  },
  selectedCardsContainer: {
    flex: 1,
    marginHorizontal: wp('3%'),
    backgroundColor: "#F8FAFC",
    borderRadius: wp('3%'),
    padding: wp('2%'),
  },
  selectedCardsList: {
    gap: wp('2%'),
  },
  micButton: {
    backgroundColor: "#4CAF50",
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  mainContent: {
    padding: wp('3%'),
    paddingBottom: hp('12%'),
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: wp('3%'),
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: wp('3%'),
    padding: wp('2%'),
    width: wp('30%'),
    elevation: 2,
    alignItems: 'center',
  },
  cardImage: {
    width: wp('25%'),
    height: wp('25%'),
    borderRadius: wp('2%'),
    marginBottom: wp('2%'),
  },
  cardText: {
    fontSize: wp('3.5%'),
    color: "#2C3E50",
    textAlign: "center",
    fontWeight: "500",
  },
  selectedCardContainer: {
    alignItems: 'center',
    width: wp('20%'),
  },
  selectedCardImage: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('2%'),
  },
  selectedCardText: {
    fontSize: wp('3%'),
    color: "#34495E",
    textAlign: "center",
    marginTop: wp('1%'),
  },
  addButton: {
    position: 'absolute',
    bottom: hp('3%'),
    alignSelf: 'center',
    backgroundColor: "#4CAF50",
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('8%'),
    borderRadius: wp('8%'),
    elevation: 4,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: wp('4%'),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    paddingTop: hp('2%'),
    paddingBottom: Platform.OS === 'ios' ? hp('4%') : hp('2%'),
  },
  modalOption: {
    paddingVertical: hp('2%'),
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E9F0',
  },
  modalOptionText: {
    fontSize: wp('4%'),
    color: '#2C3E50',
    fontWeight: '500',
  },
  modalCancelOption: {
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 0,
    marginTop: hp('1%'),
  },
  modalCancelText: {
    color: '#64748B',
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  deleteText: {
    color: '#FF5252',
  },
  deleteConfirmHeader: {
    padding: wp('4%'),
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E9F0',
  },
  deleteConfirmTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: hp('1%'),
  },
  deleteConfirmText: {
    fontSize: wp('4%'),
    color: '#64748B',
    textAlign: 'center',
  },
});

export default PecsCardScreen;