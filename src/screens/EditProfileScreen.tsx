import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Image, 
  ActivityIndicator, 
  ScrollView 
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import { db } from '@/config/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfileScreen() {
  const { user, theme, isDarkMode } = useAppContext();
  const navigation = useNavigation();
  
  const [name, setName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "https://i.pravatar.cc/150");
  const [birthday, setBirthday] = useState((user as any)?.birthday || "");
  const [gender, setGender] = useState((user as any)?.gender || "Nam");
  const [job, setJob] = useState((user as any)?.job || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert("Lỗi", "Tên không được để trống");
    if (!user?.uid) return;

    const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/]\d{4}$/;
    if (birthday && !dateRegex.test(birthday)) {
        return Alert.alert("Lỗi định dạng", "Vui lòng nhập ngày sinh theo định dạng Ngày/Tháng/Năm (VD: 20/10/2004)");
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
      Alert.alert("Thành công", "Đã cập nhật hồ sơ!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Lỗi", "Cập nhật thất bại.");
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
      contentContainerStyle={{ paddingTop: 30, paddingBottom: 60 }} // KHẮC PHỤC LỖI CHE ẢNH
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.avatarSection}>
        <TouchableOpacity onPress={async () => {
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
          Chạm để đổi ảnh đại diện
        </Text>
      </View>

      {renderInput("Họ và tên", name, setName, "Nhập tên của bạn")}
      {renderInput("Ngày sinh", birthday, setBirthday, "DD/MM/YYYY")}

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: theme.text }]}>Giới tính</Text>
        <View style={styles.genderRow}>
          {['Nam', 'Nữ', 'Khác'].map((item) => (
            <TouchableOpacity 
              key={item}
              style={[
                  styles.genderBtn, 
                  { backgroundColor: isDarkMode ? "#333" : "#f5f5f5" },
                  gender === item && { backgroundColor: '#e74c3c' }
              ]}
              onPress={() => setGender(item)}
            >
              <Text style={[
                  styles.genderText,
                  { color: theme.text },
                  gender === item && { color: '#fff' }
              ]}>
                  {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {renderInput("Nghề nghiệp", job, setJob, "VD: Sinh viên EPU, Developer...")}

      <TouchableOpacity 
        style={[styles.saveButton, { opacity: loading ? 0.7 : 1 }]} 
        onPress={handleSave} 
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>Lưu tất cả thay đổi</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  avatarSection: { alignItems: 'center', marginTop: 30, marginBottom: 20 },
  avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: '#e74c3c' },
  cameraIcon: { 
    position: 'absolute', 
    bottom: 5, 
    right: 5, 
    backgroundColor: '#e74c3c', 
    padding: 8, 
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff'
  },
  subText: { fontSize: 12, marginTop: 10, fontWeight: '500' },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  input: { 
    height: 52, 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    borderWidth: 1,
    fontSize: 16 
  },
  genderRow: { flexDirection: 'row', gap: 10 },
  genderBtn: { 
    flex: 1, 
    height: 48, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent' 
  },
  genderText: { fontWeight: '600', fontSize: 15 },
  saveButton: { 
    backgroundColor: '#e74c3c', 
    height: 56, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 15,
    shadowColor: "#e74c3c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6
  },
  saveText: { color: '#fff', fontSize: 17, fontWeight: 'bold' }
});