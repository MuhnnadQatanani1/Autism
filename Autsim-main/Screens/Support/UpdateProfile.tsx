import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { RootStackParamList } from '../../RootStackParamList';

type UpdateProfileRouteProp = RouteProp<RootStackParamList, 'UpdateProfile'>;

const UpdateProfile = () => {
  const route = useRoute<UpdateProfileRouteProp>();
  const navigation = useNavigation();
  const { userId } = route.params;

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
  
    if (!currentPassword || !newPassword) {
      Alert.alert('Error', 'Please fill all password fields');
      return;
    }
  
    try {
      setIsLoading(true);
      const response = await axios.put(
        'https://autsim-qwrf.onrender.com/api/Auth/update-password',
        {
          userId,
          currentPassword,
          newPassword,
        }
      );
  
      if (response.data.message === "Password updated successfully.") {
        Alert.alert('Success', response.data.message);
        // مسح الحقول بعد النجاح
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error: any) {
      if (error.response) {
        // التعامل مع أخطاء API المختلفة
        if (error.response.status === 404) {
          Alert.alert('Error', 'User not found');
        } else if (error.response.status === 400) {
          // إذا كان هناك أخطاء محددة من API
          const errorMessage = error.response.data.errors ? 
            Object.values(error.response.data.errors).flat().join('\n') :
            'Invalid current password or new password requirements not met';
          Alert.alert('Error', errorMessage);
        } else {
          Alert.alert('Error', 'Failed to update password');
        }
      } else {
        Alert.alert('Error', 'Network error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleUpdateEmail = async () => {
    if (!newEmail) {
      Alert.alert('Error', 'Please enter a new email address');
      return;
    }
  
    // التحقق البسيط من صيغة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
  
    try {
      setIsLoading(true);
      const response = await axios.put(
        'https://autsim-qwrf.onrender.com/api/Auth/update-email',
        {
          userId,
          newEmail,
        }
      );
  
      if (response.data.message === "Email updated successfully.") {
        Alert.alert('Success', response.data.message);
        setNewEmail('');
      }
    } catch (error: any) {
      console.log('API Error:', error.response?.data);
  
      if (error.response) {
        if (error.response.status === 404) {
          Alert.alert('Error', 'User not found');
        } else if (error.response.status === 400) {
          let errorMessage = 'Failed to update email';
          
          // معالجة الخطأ عندما يكون البريد الإلكتروني مستخدم بالفعل
          if (error.response.data && error.response.data.Email) {
            errorMessage = error.response.data.Email[0];
          } else if (error.response.data && typeof error.response.data === 'object') {
            errorMessage = error.response.data.message || Object.values(error.response.data).join('\n');
          }
          
          Alert.alert('Error', errorMessage);
        } else {
          Alert.alert('Error', 'An unexpected error occurred');
        }
      } else {
        Alert.alert('Error', 'Network error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Update Profile</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Update Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleUpdatePassword}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Update Password</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Update Email</Text>
        <TextInput
          style={styles.input}
          placeholder="New Email"
          keyboardType="email-address"
          value={newEmail}
          onChangeText={setNewEmail}
        />
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleUpdateEmail}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Update Email</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    fontSize: hp('2%'),
    color: '#449E8B',
    marginRight: 15,
  },
  title: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: hp('1.8%'),
  },
  button: {
    backgroundColor: '#449E8B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: hp('1.8%'),
    fontWeight: 'bold',
  },
});

export default UpdateProfile;