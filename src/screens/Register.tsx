import React, { useState } from "react";
import { 
  ActivityIndicator, Alert, KeyboardAvoidingView, 
  Platform, ScrollView, Text, TextInput, 
  TouchableOpacity, View 
} from "react-native";
import { authStyles as styles } from "../styles/authStyles";
import { Ionicons } from '@expo/vector-icons';

// Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";

export default function Register({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Trạng thái ẩn hiện mật khẩu
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const handleRegister = async () => {
    const cleanEmail = email.trim();

    if (!cleanEmail.includes('@')) {
      Alert.alert("Thông báo", "Vui lòng nhập đúng định dạng email nhé.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Lưu ý", "Mật khẩu cần ít nhất 6 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu nhập lại không khớp.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date().toISOString(),
        totalPomodoro: 0,
        displayName: "Thành viên mới",
      });

      setLoading(false);
      Alert.alert(
        "Thành công", 
        "Tài khoản đã sẵn sàng! 🍅",
        [{ text: "Đăng nhập ngay", onPress: () => navigation.navigate("Login") }]
      );

    } catch (error: any) {
      setLoading(false);
      let errorMessage = "Đã có lỗi xảy ra.";
      if (error.code === 'auth/email-already-in-use') errorMessage = "Email này đã được sử dụng.";
      Alert.alert("Lỗi", errorMessage);
    }
  };

  // Hàm render ô Input mật khẩu để code gọn hơn
  const renderPasswordInput = (
    placeholder: string, 
    value: string, 
    setter: (t: string) => void, 
    isShown: boolean, 
    toggle: () => void
  ) => (
    <View style={{ position: 'relative', marginBottom: 15 }}>
      <TextInput 
        placeholder={placeholder} 
        style={[styles.input, { paddingRight: 50, marginBottom: 0 }]} 
        secureTextEntry={!isShown} 
        value={value} 
        onChangeText={setter} 
        editable={!loading}
        autoCorrect={false}
        spellCheck={false}
        autoCapitalize="none"
        keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'default'}
        textContentType="oneTimeCode"
      />
      <TouchableOpacity 
        style={{ position: 'absolute', right: 15, top: 15 }} 
        onPress={toggle}
      >
        <Ionicons 
          name={isShown ? "eye-off-outline" : "eye-outline"} 
          size={22} 
          color="#666" 
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={[styles.scrollContainer, { paddingVertical: 40 }]} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.logo}>🍅</Text>
        <Text style={styles.appName}>Pomodo</Text>
        
        <View style={styles.card}>
          <Text style={styles.title}>Tạo tài khoản</Text>
          <Text style={styles.subtitle}>Lưu trữ quá trình tập trung trên Cloud.</Text>
          
          <TextInput 
            placeholder="Email" 
            style={styles.input} 
            value={email} 
            onChangeText={setEmail} 
            keyboardType="email-address" 
            autoCapitalize="none" 
            autoCorrect={false}
            editable={!loading}
          />

          {renderPasswordInput("Mật khẩu", password, setPassword, showPwd, () => setShowPwd(!showPwd))}
          
          {renderPasswordInput("Xác nhận mật khẩu", confirmPassword, setConfirmPassword, showConfirmPwd, () => setShowConfirmPwd(!showConfirmPwd))}

          <TouchableOpacity 
            style={[styles.button, loading && { backgroundColor: '#ccc' }]} 
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Đăng ký</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.footerLink} disabled={loading}>
            <Text style={styles.linkText}>Đã có tài khoản? <Text style={styles.linkHighlight}>Đăng nhập</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}