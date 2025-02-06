import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  SafeAreaViewBase,
  StatusBar,
  Platform,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ConfettiCannon from "react-native-confetti-cannon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NavBar from "../../../Components/NavBar";

const Gaming = () => {
  const SYMBOLS = ["🐶", "🐱", "🦊", "🐸", "🐼", "🦁", "🐷", "🐰", " "];
  const insets = useSafeAreaInsets();

  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [tiles, setTiles] = useState(shuffleArray(SYMBOLS));
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const confettiRef = useRef<ConfettiCannon | null>(null);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      Alert.alert("Time's up!", "Try again!");
    }
  }, [timeLeft]);

  const isSolved = () => tiles.join("") === SYMBOLS.join("");

  const handleTilePress = (index: number) => {
    const emptyIndex = tiles.indexOf(" ");
    const validMoves = [
      emptyIndex - 1,
      emptyIndex + 1,
      emptyIndex - 3,
      emptyIndex + 3,
    ];

    if (validMoves.includes(index)) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [
        newTiles[emptyIndex],
        newTiles[index],
      ];
      setTiles(newTiles);

      if (isSolved()) {
        setIsCelebrating(true);
        if (confettiRef.current) {
          confettiRef.current.start();
        }
        Alert.alert("Congratulations!", "You solved the puzzle!");
      }
    }
  };

  const resetPuzzle = () => {
    setTiles(shuffleArray(SYMBOLS));
    setIsCelebrating(false);
    setTimeLeft(60);
  };

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <NavBar color="#f0f0f0" />

        <View style={[styles.container]}>
          <Text style={styles.title}>Sliding Puzzle Game 🧩</Text>
          <View style={styles.preview}>
            <Text style={styles.previewTitle}>Correct Order:</Text>
            <View style={styles.smallGrid}>
              {SYMBOLS.map((symbol, index) => (
                <View key={index} style={styles.smallTile}>
                  <Text style={styles.smallTileText}>{symbol}</Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={styles.timer}>Time Left: {timeLeft}s</Text>

          <View style={styles.grid}>
            {tiles.map((symbol, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tile}
                onPress={() => handleTilePress(index)}
              >
                <Text style={styles.tileText}>{symbol}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.resetButton} onPress={resetPuzzle}>
            <Text style={styles.resetButtonText}>Restart 🔄</Text>
          </TouchableOpacity>

          {isCelebrating && (
            <ConfettiCannon
              ref={confettiRef}
              count={100}
              origin={{ x: -10, y: 0 }}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  title: {
    fontSize: 30,
    marginBottom: 10,
  },
  preview: {
    position: "absolute",
    top: 10,
    right: 10,
    alignItems: "center",
  },
  previewTitle: {
    fontSize: 14,
    marginBottom: 5,
  },
  smallGrid: {
    width: 75,
    height: 75,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  smallTile: {
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#333",
    backgroundColor: "#eee",
  },
  smallTileText: {
    fontSize: 14,
  },
  timer: {
    fontSize: 20,
    marginBottom: 20,
    color: "#333",
  },
  grid: {
    width: 300,
    height: 300,
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: 2,
    borderColor: "#333",
    marginBottom: 20,
  },
  tile: {
    width: "33.33%",
    height: "33.33%",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#4CAF50",
  },
  tileText: {
    fontSize: 40,
    color: "#fff",
  },
  resetButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
  },
  resetButtonText: {
    fontSize: 20,
    color: "#fff",
  },
});

export default Gaming;
