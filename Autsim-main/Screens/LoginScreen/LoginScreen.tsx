import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SafeAreaView,
  View,
  Text,
  StatusBar,
  Platform,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import axios from "axios";
import { useState } from "react";
import LoadingIndicator from "../../Components/LoadingIndecator";
import useUser from "../../hooks/User";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../RootStackParamList";
import Octicons from "@expo/vector-icons/Octicons";
import React from "react";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type FormSchemaType = z.infer<typeof schema>;

const LoginScreen = () => {
  const Navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { setUser } = useUser();
  const [openEye, setOpenEye] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
  });

  const toggleEye = () => {
    setOpenEye(!openEye);
  };

  const handleLogin = async (data: FormSchemaType) => {
    try {
      Keyboard.dismiss();
      setIsLoading(true);
      
      const response = await axios.post(
        "https://autsim-qwrf.onrender.com/api/Auth/LOGIN", 
        {
          email: data.email,
          password: data.password,
        }
      );
  
      if (response.status === 200) {
        // تحديث كائن المستخدم مع UserId
        const userData = {
          ...response.data,
          UserId: response.data.userId// حفظ UserId من الاستجابة
        };
        setUser(userData);
        
        // التوجيه بناءً على الدور
        if (response.data.roles?.includes("Support")) {
          Navigation.reset({
            index: 0,
            routes: [{ name: "SupportDashboard" }]
          });
        } else if(response.data.roles?.includes("Autism")) {
          Navigation.reset({
            index: 0,
            routes: [{ name: "Home" }]
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      // معالجة الخطأ هنا
    } finally {
      setIsLoading(false);
    }
  };
  
  
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        justifyContent: "center",
      }}
    >
      {isLoading && <LoadingIndicator />}
      <View
        style={{ alignSelf: "center", width: "100%", justifyContent: "center" }}
      >
        <Text
          style={{
            textAlign: "center",
            marginBottom: "5%",
            fontSize: hp("10%"),
          }}
        >
          🔒
        </Text>
      </View>

      <Controller
        name="email"
        control={control}
        render={({ field: { onChange, value, onBlur } }) => (
          <View
            style={{
              width: "90%",
              flexDirection: "row",
              borderColor: "#5D9C8C",
              borderWidth: 2,
              alignSelf: "center",
              borderRadius: 16,
              padding: 10,
            }}
          >
            <View style={{ justifyContent: "center" }}>
              <Text>👤</Text>
            </View>
            <View style={{ width: "80%" }}>
              <TextInput
                multiline
                placeholder="Enter Your Email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            </View>
          </View>
        )}
      />
      <View>
        <Text>{errors.email ? errors.email.message : ""}</Text>
      </View>

      <Controller
        name="password"
        control={control}
        render={({ field: { onChange, value, onBlur } }) => (
          <View
            style={{
              width: "90%",
              flexDirection: "row",
              borderColor: "#5D9C8C",
              borderWidth: 2,
              alignSelf: "center",
              borderRadius: 16,
              padding: 10,
            }}
          >
            <View style={{ justifyContent: "center" }}>
              <Text>🔒</Text>
            </View>

            <TextInput
              style={{ width: "85%" }}
              placeholder="Enter Your Password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry={openEye}
            />
            <TouchableOpacity
              style={{ alignSelf: "center" }}
              onPress={toggleEye}
            >
              <Octicons
                name={openEye ? "eye-closed" : "eye"}
                size={24}
                color="black"
                style={{ alignSelf: "center", justifyContent: "center" }}
              />
            </TouchableOpacity>
          </View>
        )}
      />
      <View>
        <Text>{errors.password ? errors.password.message : ""}</Text>
      </View>
      <TouchableOpacity
        style={{ width: "50%", alignSelf: "center" }}
        onPress={handleSubmit(handleLogin)}
      >
        <View
          style={{
            alignSelf: "center",
            backgroundColor: "#4CAF50",
            padding: wp("3%"),
            marginTop: hp("1%"),
            width: "100%",
            borderRadius: 16,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontSize: hp("1.8%"),
            }}
          >
            Login
          </Text>
        </View>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

export default LoginScreen;
