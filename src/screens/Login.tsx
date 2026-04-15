import React, { useState } from "react";
import { 
  ActivityIndicator, Alert, Text, TextInput, 
  TouchableOpacity, View, KeyboardAvoidingView, 
  Platform, ScrollView 
} from "react-native";
import { authStyles as styles } from "../styles/authStyles";
import { Ionicons } from '@expo/vector-icons'; // Sử dụng thư viện icon có sẵn

// Firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

interface LoginProps {
  navigation: any;
  setUser: (user: any) => void;
}

export default function Login({ navigation, setUser }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Trạng thái ẩn/hiện mật khẩu

  const handleLogin = async () => {
    // Xử lý email: xóa khoảng trắng dư thừa
    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      Alert.alert("Thông báo", "Bạn vui lòng điền đầy đủ Email và Mật khẩu nhé!");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;

      if (setUser) {
        setUser(user);
      }
      
    } catch (error: any) {
      let errorMessage = "Đã có lỗi xảy ra. Bạn vui lòng thử lại sau nhé!";
      
      if (error.code === 'auth/invalid-credential') {
        errorMessage = "Email hoặc mật khẩu không chính xác. Bạn kiểm tra lại nha!";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Thử lại quá nhiều lần. Bạn hãy đợi một lát nhé!";
      }

      Alert.alert("Đăng nhập thất bại", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.logo}>🍅</Text>
          <Text style={styles.appName}>Pomodo</Text>
          
          <View style={styles.card}>
            <Text style={styles.title}>Chào mừng trở lại</Text>
            <Text style={styles.subtitle}>Hãy đăng nhập để tiếp tục các phiên làm việc còn dang dở.</Text>

            {/* Input Email */}
            <TextInput
              placeholder="Email của bạn"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />

            {/* Input Mật khẩu với chức năng ẩn/hiện */}
            <View style={{ position: 'relative' }}>
              <TextInput
                placeholder="Mật khẩu"
                style={[styles.input, { paddingRight: 50 }]}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!loading}

                // Cấu hình CỰC MẠNH để ép ẩn:
                autoCorrect={false}
                spellCheck={false}
                autoCapitalize="none"
                
                // Dòng này cực kỳ quan trọng trên Android để tránh lộ mật khẩu:
                importantForAutofill="no" 
                
                // Ép máy hiểu đây là dữ liệu thô, không cho bộ gõ Tiếng Việt can thiệp soạn thảo:
                keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'default'}
                
                // Cố định kiểu dữ liệu là mật khẩu ở mức hệ thống
                textContentType="oneTimeCode" 
              />

              <TouchableOpacity 
                style={{ 
                  position: 'absolute', 
                  right: 15, 
                  top: 15 // Căn chỉnh theo style input của bạn
                }} 
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={24} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>

            {/* Nút Đăng nhập */}
            <TouchableOpacity 
              style={[styles.button, loading && { backgroundColor: '#ccc' }]} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Đăng nhập</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => navigation.navigate("Register")} 
              style={styles.footerLink}
              disabled={loading}
            >
              <Text style={styles.linkText}>
                Chưa có tài khoản? <Text style={styles.linkHighlight}>Đăng ký ngay</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}