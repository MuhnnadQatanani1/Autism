import React, { useState } from 'react';
import {
  View, Text, SafeAreaView, StyleSheet, Platform,
  StatusBar, TouchableOpacity, Image, ActivityIndicator,
  Alert, TextInput
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from "lucide-react-native";

interface ImageData {
  uri: string;
  type: string;
  name: string;
}

const AddPecs = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const goBack = () => navigation.goBack();

  const checkPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('صلاحيات مطلوبة', 'نحتاج إلى إذن الوصول إلى معرض الصور');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    try {
      if (!await checkPermissions()) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets?.[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('خطأ في اختيار الصورة:', error);
      Alert.alert('خطأ', 'حدث خطأ في اختيار الصورة');
    }
  };

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('تنبيه', 'الرجاء إدخال الاسم');
      return false;
    }
    if (!image) {
      Alert.alert('تنبيه', 'الرجاء اختيار صورة');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
  
    try {
      const requestFormData = new FormData();
      requestFormData.append('Name', name.trim());
      
      if (image) {
        const fileName = image.split('/').pop() || `image_${Date.now()}.jpg`;
        requestFormData.append('Images', {
          uri: image,
          name: fileName,
          type: 'image/jpeg',
        } as any);
      }
  
      const response = await fetch('https://autsim-qwrf.onrender.com/api/PecsCard/AddPecs', {
        method: 'POST',
        body: requestFormData,
      });
  
      if (response.ok) {
        Alert.alert('نجاح', 'تم إضافة البطاقة بنجاح', [
          { text: 'حسناً', onPress: () => {
            setImage(null);
            setName('');
            navigation.goBack();
          }}
        ]);
      }
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ في إرسال البيانات');
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBack}
          >
            <ArrowLeft color="#FF5722" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>إضافة بطاقة جديدة</Text>
          <View style={styles.placeholder} />
        </View>

        <TextInput
          style={styles.input}
          placeholder="أدخل الاسم"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#666"
        />
        
        <TouchableOpacity 
          style={[styles.button, loading && styles.disabledButton]} 
          onPress={pickImage}
          disabled={loading}
        >
          <Text style={styles.buttonText}>اختيار صورة</Text>
        </TouchableOpacity>

        {image && (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: image }} 
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF5722" />
            <Text style={styles.loadingText}>جاري الرفع...</Text>
          </View>
        )}

        {(image && !loading) && (
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>إضافة البطاقة</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#f9fafc",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF5722",
    textAlign: "center",
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#FF5722',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: 'white',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#FF5722',
    fontSize: 16,
  },
});

export default AddPecs;