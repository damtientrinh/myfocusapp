import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';

import { auth } from '../api/firebaseConfig';
import { signOut } from 'firebase/auth';

import { styles } from '@/styles/SettingsStyles'; 
import { useAppContext } from '@/context/AppContext';

export default function SettingScreen() {
  const { 
    isDarkMode, setIsDarkMode, theme, customWorkTime, setCustomWorkTime,
    language, setLanguage, resetSettings,
    setUser, user
  } = useAppContext();

  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = language === 'vi' ? 'en' : 'vi';
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleReset = () => {
    Alert.alert(
      t('settings.reset_settings', 'Đặt lại cài đặt'),
      t('settings.reset_confirm', 'Bạn có chắc chắn muốn đưa tất cả cài đặt về mặc định?'),
      [
        { text: t('common.cancel', 'Hủy'), style: 'cancel' },
        { 
          text: t('common.confirm', 'Xác nhận'), 
          onPress: resetSettings,
          style: 'destructive' 
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      t('settings.logout_title', 'Đăng xuất'),
      t('settings.logout_confirm', 'Bạn có chắc chắn muốn đăng xuất không?'),
      [
        { text: t('common.cancel', 'Hủy'), style: 'cancel' },
        { 
          text: t('common.confirm', 'Xác nhận'), 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth); // Đăng xuất khỏi Firebase
              setUser(null); 
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
              console.error("Logout error:", error);
            }
          }
        }
      ]
    );
  };

  const dynamicSectionStyle = {
    backgroundColor: theme.card,
    borderColor: theme.border,
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>
        {t('settings.header', 'Cài đặt')}
      </Text>

      {/* NHÓM 1: CẤU HÌNH POMODORO */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionHeaderText, { color: theme.subText }]}>POMODORO</Text>
      </View>
      
      <View style={[styles.section, dynamicSectionStyle]}>
        <View style={styles.row}>
          <View style={styles.iconCircle}>
            <Ionicons name="time" size={20} color="#FF5252" />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>
            {t('settings.work_time', 'Thời gian làm việc')}
          </Text>
          <Text style={[styles.valueText, { color: '#FF5252', fontWeight: 'bold' }]}>
            {customWorkTime} {t('settings.minutes', 'phút')}
          </Text>
        </View>
        
        <Slider
          style={styles.slider}
          minimumValue={5}
          maximumValue={60}
          step={5}
          value={customWorkTime}
          onValueChange={setCustomWorkTime}
          minimumTrackTintColor="#FF5252"
          maximumTrackTintColor={theme.border}
          thumbTintColor="#FF5252"
        />
      </View>

      {/* NHÓM 2: GIAO DIỆN */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionHeaderText, { color: theme.subText }]}>
          {t('settings.sections.appearance', 'GIAO DIỆN')}
        </Text>
      </View>
      
      <View style={[styles.section, dynamicSectionStyle]}>
        {/* Dark Mode */}
        <View style={styles.row}>
          <View style={[styles.iconCircle, { backgroundColor: isDarkMode ? '#333' : '#eee'}]}>
            <Ionicons 
              name={isDarkMode ? "moon" : "sunny"} 
              size={20} 
              color={isDarkMode ? "#FFD700" : "#FF5252"} 
            />
          </View>
          <Text style={[styles.title, { color: theme.text, flex: 1 }]}>
            {isDarkMode ? t('settings.dark_mode', 'Chế độ tối') : t('settings.light_mode', 'Chế độ sáng')}
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            trackColor={{ false: "#767577", true: "#FF5252" }}
          />
        </View>

        {/* Ngôn ngữ */}
        <TouchableOpacity 
          onPress={toggleLanguage} 
          style={[styles.row, { borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 15, marginTop: 10 }]}
        >
          <View style={[styles.iconCircle, { backgroundColor: isDarkMode ? '#333' : '#f0f0f0'}]}>
            <Ionicons name="language" size={20} color="#FF5252" />
          </View>
          <Text style={[styles.title, { color: theme.text, flex: 1 }]}>
            {t('settings.language', 'Ngôn ngữ')}
          </Text>
          <Text style={{ color: theme.subText, marginRight: 5 }}>
            {language === 'vi' ? 'Tiếng Việt' : 'English'}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={theme.subText} />
        </TouchableOpacity>
      </View>

      {/* NHÓM 3: TÀI KHOẢN & HỆ THỐNG */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionHeaderText, { color: theme.subText }]}>HỆ THỐNG</Text>
      </View>

      <View style={[styles.section, dynamicSectionStyle]}>
        {/* Reset */}
        <TouchableOpacity onPress={handleReset} style={styles.row}>
          <Ionicons name="reload" size={20} color="#FF5252" style={{ marginRight: 15 }} />
          <Text style={{ color: theme.text, fontSize: 16 }}>{t('settings.reset_settings')}</Text>
        </TouchableOpacity>

        {/* Đăng xuất */}
        <TouchableOpacity 
          onPress={handleLogout} 
          style={[styles.row, { borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 15, marginTop: 10 }]}
        >
          <Ionicons name="log-out" size={20} color="#FF5252" style={{ marginRight: 15 }} />
          <Text style={{ color: '#FF5252', fontSize: 16, fontWeight: 'bold' }}>
            {t('settings.logout_title', 'Đăng xuất')}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.footerText, { color: theme.subText, marginBottom: 40 }]}>
        {t('settings.version', 'Phiên bản 1.0.0 • Made with ❤️ by DTT')}
      </Text>
    </ScrollView>
  );
}