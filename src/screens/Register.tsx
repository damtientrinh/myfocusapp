import React, { useState } from "react";
import { 
  ActivityIndicator, Alert, KeyboardAvoidingView, 
  Platform, ScrollView, Text, TextInput, 
  TouchableOpacity, View 
} from "react-native";
import { authStyles as styles } from "../styles/authStyles";
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from "react-i18next"; // 1. Thêm đa ngôn ngữ

// Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";

export default function Register({ navigation }: any) {
  const { t } = useTranslation(); // 2. Khai báo hook t
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const handleRegister = async () => {
    const cleanEmail = email.trim();

    // 3. Sử dụng t() cho các thông báo lỗi
    if (!cleanEmail.includes('@')) {
      Alert.alert(t('common.notice'), t('auth.error_email_format'));
      return;
    }
    if (password.length < 6) {
      Alert.alert(t('common.notice'), t('auth.error_password_length'));
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(t('common.error'), t('auth.error_password_mismatch'));
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;

      // Lưu thông tin user vào Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date().toISOString(),
        totalPomodoro: 0,
        displayName: t('auth.new_member'),
        photoURL: null // Thêm sẵn để sau này làm Profile
      });

      setLoading(false);
      Alert.alert(
        t('auth.success_title'), 
        t('auth.success_msg'),
        [{ text: t('auth.login_now'), onPress: () => navigation.navigate("Login") }]
      );

    } catch (error: any) {
      setLoading(false);
      let errorMessage = t('auth.error_default');
      if (error.code === 'auth/email-already-in-use') errorMessage = t('auth.error_email_exists');
      Alert.alert(t('common.error'), errorMessage);
    }
  };

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
        // Cải thiện bảo mật cho Android
        importantForAutofill="no"
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
          <Text style={styles.title}>{t('auth.register_title')}</Text>
          <Text style={styles.subtitle}>{t('auth.register_subtitle')}</Text>
          
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

          {renderPasswordInput(t('auth.password_placeholder'), password, setPassword, showPwd, () => setShowPwd(!showPwd))}
          
          {renderPasswordInput(t('auth.confirm_password'), confirmPassword, setConfirmPassword, showConfirmPwd, () => setShowConfirmPwd(!showConfirmPwd))}

          <TouchableOpacity 
            style={[styles.button, loading && { backgroundColor: '#ccc' }]} 
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{t('auth.register_button')}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.footerLink} disabled={loading}>
            <Text style={styles.linkText}>
              {t('auth.have_account')}{" "}
              <Text style={styles.linkHighlight}>{t('auth.login_now')}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}