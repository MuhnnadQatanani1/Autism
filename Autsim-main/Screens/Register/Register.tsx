import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInputRegister from "./TextInputRegister";
import LogoSvg from "../../Icons/LogoSvg";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";

const Schema = z.object({
  firstname: z.string().min(2, "First name must be at least 2 characters"),
  lastname: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  coPassword: z.string()
}).refine((data) => data.password === data.coPassword, {
  message: "Passwords don't match",
  path: ["coPassword"],
});

export type FormSchemaType = z.infer<typeof Schema>;

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(Schema),
  });

  const handleRegister = async (data: FormSchemaType) => {
    try {
      setIsLoading(true);
      
      const response = await axios.post(
        "https://autsim-qwrf.onrender.com/api/Auth/register",
        {
          firstname: data.firstname,
          lastname: data.lastname,
          phone: data.phone,
          email: data.email,
          password: data.password,
          coPassword: data.coPassword,
          role: "Autism" // Always set to Autism
        }
      );

      if (response.data.status === 200) {
        Alert.alert(
          "Success",
          "Registration successful!",
          [{ text: "OK" }]
        );
        // Add navigation logic here if needed
      }
    } catch (error: any) {
      if (error.response) {
        // Handle specific API errors
        const errorData = error.response.data;
        
        if (errorData.errors) {
          // Handle validation errors
          Object.keys(errorData.errors).forEach((key) => {
            setError(key as keyof FormSchemaType, {
              message: errorData.errors[key][0]
            });
          });
        } else if (errorData.message) {
          Alert.alert("Error", errorData.message);
        }
      } else {
        // Handle network or other errors
        Alert.alert(
          "Error",
          "An error occurred during registration. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
      <ScrollView contentContainerStyle={{ gap: 10 }}>
        <LogoSvg />
        
        <TextInputRegister
          name="firstname"
          control={control}
          placholder="Enter Your First Name"
          emoji="👤"
          error={errors.firstname?.message}
        />
        
        <TextInputRegister
          name="lastname"
          control={control}
          placholder="Enter Your Last Name"
          emoji="👴🏻"
          error={errors.lastname?.message}
        />

        <TextInputRegister
          name="phone"
          control={control}
          placholder="Enter Your Phone No."
          emoji="☎️"
          error={errors.phone?.message}
        />

        <TextInputRegister
          name="email"
          control={control}
          placholder="Enter Your Email"
          emoji="＠"
          error={errors.email?.message}
        />

        <TextInputRegister
          name="password"
          control={control}
          placholder="Enter Your password"
          emoji="🔒"
          error={errors.password?.message}
          secureTextEntry={true}
        />
        
        <TextInputRegister
          name="coPassword"
          control={control}
          placholder="Confirm Your password"
          emoji="🔒"
          error={errors.coPassword?.message}
          secureTextEntry={true}
        />

        <TouchableOpacity 
          onPress={handleSubmit(handleRegister)}
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.7 : 1 }}
        >
          <View
            style={{
              marginTop: "1%",
              alignSelf: "center",
              backgroundColor: "#5D9C8C",
              padding: 8,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 100,
            }}
          >
            {isLoading ? (
              <ActivityIndicator color="white" style={{ marginRight: 8 }} />
            ) : null}
            <Text style={{ color: "white" }}>
              {isLoading ? "Registering..." : "Register"}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;