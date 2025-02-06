import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Text,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";
import { Card, ResponseData } from "../../Modals/Interface";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Mic01Icon from "../../Icons/MicIcon";
import { Audio } from "expo-av";
import base64 from "react-native-base64";
import LoadingIndicator from "../../Components/LoadingIndecator";
import NavBar from "../../Components/NavBar";

const SupportServices = () => {
  const pageSize = 20;
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Card[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState<Card[]>([]);
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCardId, setSelectedCardId] = useState<number | undefined>(undefined);

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
      setLoading(false);

      const totalCards = response.data.totalCount || 0;
      const newCards = response.data.cards || [];

      setTotalCount(totalCards);
      setData(prevData => {
        if (pageNum === 1) {
          return newCards;
        }
        return [...prevData, ...newCards];
      });

      setPage(pageNum);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedCardId) {
      fetchCards(page);
    }
  }, [page, selectedCardId]);

  const handlePressImage = (image: Card) => {
    setSelectedImage((prevSelected) => {
      const newSelection = prevSelected.some((item) => item.id === image.id)
        ? prevSelected
        : [...prevSelected, image];
      
      setSelectedCardId(image.id);
      fetchCards(1, image.id);
      
      return newSelection;
    });
  };

  const handleLongPress = (image: Card) => {
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

  const fetchAudio = async () => {
    if (selectedImage && selectedImage.length > 0) {
      const selectedPecsCardIds = selectedImage.map((image) => image.id);

      try {
        setLoading(true);

        const params: Record<string, string> = selectedPecsCardIds.reduce(
          (acc, id, index) => {
            (acc as Record<string, string>)[`selectedPecsCardIds[${index}]`] =
              id.toString();
            return acc;
          },
          {}
        );

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
      }
    }
  };

  useEffect(() => {
    fetchAudio();
  }, [selectedImage]);

  const loadMoreData = () => {
    if (!loading && data.length < totalCount) {
      if (selectedCardId) {
        fetchCards(page + 1, selectedCardId);
      } else {
        fetchCards(page + 1);
      }
      setPage(prevPage => prevPage + 1);
    }
  };

  const renderItem = ({ item, index }: { item: Card, index: number }) => {
    return (
      <TouchableOpacity 
        onPress={() => handlePressImage(item)}
        onLongPress={() => handleLongPress(item)}
        delayLongPress={500}
        key={`${item.id}-${index}`}
      >
        <View style={styles.cardContainer}>
          <Image
            source={{ uri: `data:image/png;base64,${item.iFormFile}` }}
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.imageName}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const RenderData = ({ item, index }: { item: Card, index: number }) => {
    return (
      <View key={`selected-${item.id}-${index}`}>
        <Image
          source={{ uri: `data:image/png;base64,${item.iFormFile}` }}
          style={styles.imageSec}
        />
        <Text style={styles.selectedImageName}>{item.name}</Text>
      </View>
    );
  };

  return (
    <>
      {loading && <LoadingIndicator />}
      <SafeAreaView
        style={{
          backgroundColor: "#FFFFFF",
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <NavBar />
        <View style={styles.topContainer}>
          <TouchableOpacity onPress={clearSelection} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>مسح</Text>
          </TouchableOpacity>

          <View style={styles.selectedImagesContainer}>
            <FlatList
              horizontal
              data={selectedImage}
              keyExtractor={(item, index) => `selected-${item.id}-${index}`}
              renderItem={RenderData}
              contentContainerStyle={{ gap: 10, paddingHorizontal: 12 }}
            />
          </View>
          
          <TouchableOpacity onPress={playAudio}>
            <View style={styles.micButton}>
              <Mic01Icon />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      
      <FlatList
        style={styles.mainList}
        columnWrapperStyle={styles.columnWrapper}
        data={data}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={renderItem}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.1}
        numColumns={3}
        contentContainerStyle={styles.listContainer}
      />
    </>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 10,
    padding: 10,
  },
  clearButton: {
    backgroundColor: "#FF5252",
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  selectedImagesContainer: {
    backgroundColor: "#f2f2f2",
    width: "60%",
    borderRadius: 10,
    height: hp("10.2%"),
  },
  micButton: {
    backgroundColor: "#4CAF50",
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    justifyContent: "center",
  },
  mainList: {
    backgroundColor: "#ffffff",
  },
  columnWrapper: {
    gap: 15,
  },
  listContainer: {
    alignSelf: "center",
    padding: 10,
  },
  cardContainer: {
    alignItems: "center",
    marginVertical: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  imageSec: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  imageName: {
    marginTop: 5,
    fontSize: 14,
    color: "#333333",
    textAlign: "center",
  },
  selectedImageName: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
    marginTop: 2,
  },
});

export default SupportServices;