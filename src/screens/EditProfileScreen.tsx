import { db } from '@/config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert, Image,
  Keyboard // Thêm Keyboard
  ,

  ScrollView,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import { styles } from '../styles/EditProfileStyles';


export default function EditProfileScreen() {
  const { user, theme, isDarkMode } = useAppContext();
  const { t } = useTranslation(); // 2. Khai báo hook
  const navigation = useNavigation();
  
  const [name, setName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "https://i.pravatar.cc/150");
  const [birthday, setBirthday] = useState((user as any)?.birthday || "");
  const [gender, setGender] = useState((user as any)?.gender || "Nam");
  const [job, setJob] = useState((user as any)?.job || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    Keyboard.dismiss(); // ✅ Cải thiện: Tự đóng bàn phím khi bấm Lưu
    
    if (!name.trim()) return Alert.alert(t('common.error'), t('edit_profile.error_name'));
    if (!user?.uid) return;

    const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/]\d{4}$/;
    if (birthday && !dateRegex.test(birthday)) {
      return Alert.alert(t('common.error'), t('edit_profile.error_date'));
    }

    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { 
        displayName: name,
        photoURL: photoURL,
        birthday: birthday,
        gender: gender,
        job: job
      });
      Alert.alert(t('common.success'), t('edit_profile.success'));
      navigation.goBack();
    } catch (error) {
      Alert.alert(t('common.error'), t('edit_profile.fail'));
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label: string, value: string, onChange: (t: string) => void, placeholder: string = "") => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <TextInput 
        style={[
          styles.input, 
          { 
            color: theme.text, 
            backgroundColor: theme.card, 
            borderColor: isDarkMode ? '#444' : '#ddd' 
          }
        ]} 
        value={value} 
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={isDarkMode ? "#666" : "#999"}
      />
    </View>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingTop: 30, paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled" 
    >
      <View style={styles.avatarSection}>
        <TouchableOpacity onPress={async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert("Quyền truy cập", "App cần quyền truy cập ảnh để đổi avatar nhé!");
            return;
          }

          let result = await ImagePicker.launchImageLibraryAsync({ 
            allowsEditing: true, 
            aspect: [1, 1],
            quality: 0.5 
          });
          if (!result.canceled) setPhotoURL(result.assets[0].uri);
        }}>
          <Image source={{ uri: photoURL }} style={styles.avatar} />
          <View style={styles.cameraIcon}>
            <Ionicons name="camera" size={18} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={[styles.subText, { color: theme.text, opacity: 0.6 }]}>
          {t('edit_profile.change_avatar')}
        </Text>
      </View>

      {renderInput(t('edit_profile.full_name'), name, setName, t('edit_profile.name_placeholder'))}
      {renderInput(t('edit_profile.birthday'), birthday, setBirthday, "DD/MM/YYYY")}

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.text }]}>{t('edit_profile.gender')}</Text>
        <View style={styles.genderRow}>
          {[
            { id: 'Nam', key: 'male' },
            { id: 'Nữ', key: 'female' },
            { id: 'Khác', key: 'other' }
          ].map((item) => (
            <TouchableOpacity 
              key={item.id}
              style={[
                  styles.genderBtn, 
                  { backgroundColor: isDarkMode ? "#333" : "#f5f5f5" },
                  gender === item.id && { backgroundColor: '#e74c3c' }
              ]}
              onPress={() => setGender(item.id)}
            >
              <Text style={[
                  styles.genderText,
                  { color: theme.text },
                  gender === item.id && { color: '#fff' }
              ]}>
                  {t(`edit_profile.${item.key}`)} 
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {renderInput(t('edit_profile.job'), job, setJob, t('edit_profile.job_placeholder'))}

      <TouchableOpacity 
        style={[styles.saveButton, { opacity: loading ? 0.7 : 1 }]} 
        onPress={handleSave} 
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>{t('edit_profile.save_button')}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}