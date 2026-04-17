import React, { useState, useRef } from "react"; // Thêm useRef
import { 
  ActivityIndicator, Alert, Text, TextInput, 
  TouchableOpacity, View, KeyboardAvoidingView, 
  Platform, ScrollView 
} from "react-native";
import { authStyles as styles } from "../styles/authStyles";
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from "react-i18next"; // Import đa ngôn ngữ

// Firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";

interface LoginProps {
  navigation: any;
  setUser: (user: any) => void;
}

export default function Login({ navigation, setUser }: LoginProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Cải thiện: Ref để chuyển focus mượt mà
  const passwordRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      Alert.alert(t('common.notice'), t('auth.empty_alert'));
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      if (setUser) setUser(userCredential.user);
    } catch (error: any) {
      let errorMessage = t('auth.error_default');
      
      if (error.code === 'auth/invalid-credential') {
        errorMessage = t('auth.error_invalid');
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = t('auth.error_too_many');
      }

      Alert.alert(t('auth.fail_title'), errorMessage);
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
            <Text style={styles.title}>{t('auth.login_title')}</Text>
            <Text style={styles.subtitle}>{t('auth.login_subtitle')}</Text>

            {/* Input Email */}
            <TextInput
              placeholder={t('auth.email_placeholder')}
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
              returnKeyType="next" // Cải thiện: Hiển thị nút "Tiếp"
              onSubmitEditing={() => passwordRef.current?.focus()} // Cải thiện: Tự nhảy xuống ô pass
              blurOnSubmit={false}
            />

            {/* Input Mật khẩu */}
            <View style={{ position: 'relative' }}>
              <TextInput
                ref={passwordRef} // Gắn ref ở đây
                placeholder={t('auth.password_placeholder')}
                style={[styles.input, { paddingRight: 50 }]}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!loading}
                autoCorrect={false}
                spellCheck={false}
                autoCapitalize="none"
                importantForAutofill="no" 
                keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'default'}
                textContentType="oneTimeCode" 
                returnKeyType="done" // Cải thiện: Hiển thị nút "Xong"
                onSubmitEditing={handleLogin} // Cải thiện: Nhấn Enter là đăng nhập luôn
              />

              <TouchableOpacity 
                style={{ position: 'absolute', right: 15, top: 15 }} 
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
                <Text style={styles.buttonText}>{t('auth.login_button')}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => navigation.navigate("Register")} 
              style={styles.footerLink}
              disabled={loading}
            >
              <Text style={styles.linkText}>
                {t('auth.no_account')}{" "}
                <Text style={styles.linkHighlight}>{t('auth.register_now')}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}