import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  FlatList,
  ImageBackground,
} from "react-native";
import { BackHandler } from 'react-native';
import useUser from "../../hooks/User";
import HomeLogo from "../../Icons/HomeLogo";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { NavigationProp, useNavigation, useFocusEffect } from "@react-navigation/native";
import LogoutSquare01Icon from "../../Icons/Logout";
import { RootStackParamList } from "../../RootStackParamList";

const SupportDashboard = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user, setUser } = useUser();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Login');
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => 
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  const handleLogout = () => {
    setUser(null);
    navigation.navigate('Login');
  };

  const handleProfilePress = () => {
    if (user?.UserId) { 
      navigation.navigate('UpdateProfile', { userId: user.UserId });
    }
  };

  const NavigationScreen = (screenName: string) => {
    if (screenName === "Pecs Cards Updates" || screenName === "Register") {
      navigation.navigate(screenName === "Pecs Cards Updates" ? "PecsCard" : "Register");
    }
  };

  const data = [
    {
      id: 1,
      name: "Register",
      Icon: require("../../assets/89696861ccb444fdc97b7286b9915c39.jpeg"),
    },
    {
      id: 2,
      name: "Pecs Cards Updates",
      Icon: require("../../assets/f20368c0a017098de95142df2d20f19d.jpeg"),
    },
  ];

  const renderItem = ({ item }: { item: { id: number; name: string; Icon: any } }) => (
    <TouchableOpacity onPress={() => NavigationScreen(item.name)}>
      <View style={styles.cardContainer}>
        <ImageBackground style={styles.backgroundImage} source={item.Icon}>
          <View style={styles.contentContainer}>
            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText}>{item.name}</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <HomeLogo />
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>
            {`Welcome Back ${user?.firstname || ""}`}
          </Text>
          <TouchableOpacity
            style={styles.updateProfileButton}
            onPress={handleProfilePress}
          >
            <Text style={styles.updateProfileText}>Update Profile</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
        >
          <LogoutSquare01Icon />
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>
          Birmingham and Solihull {"\n"} All Age Autism Support Services
        </Text>
      </View>

      <FlatList
        data={data}
        style={styles.list}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  headerContent: {
    flex: 1,
    marginLeft: 10,
  },
  welcomeText: {
    fontSize: hp("1.5%"),
    marginBottom: 4,
    color: "#333",
  },
  updateProfileButton: {
    backgroundColor: "#449E8B",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  updateProfileText: {
    color: "white",
    fontSize: hp("1.4%"),
    fontWeight: "500",
  },
  logoutButton: {
    padding: 8,
    marginLeft: 10,
  },
  titleContainer: {
    padding: 15,
  },
  titleText: {
    fontSize: hp("1.8%"),
    color: "#333",
    fontWeight: "500",
  },
  list: {
    flexGrow: 1,
  },
  cardContainer: {
    overflow: "hidden",
    margin: 10,
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backgroundImage: {
    height: hp("20%"),
  },
  contentContainer: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  buttonContainer: {
    backgroundColor: "#449E8B",
    padding: 10,
    width: "60%",
    alignItems: "center",
    borderRadius: 16,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: hp("1.8%"),
  },
});

export default SupportDashboard;