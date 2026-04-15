import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Platform, Alert, Image, ScrollView, Switch, 
  Text, TouchableOpacity, View, StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAppContext } from '@/context/AppContext';
import { styles } from '@/styles/SettingsStyles';

export default function SettingScreen() {
  const navigation = useNavigation<any>();
  const { 
    isDarkMode, setIsDarkMode, theme, customWorkTime, setCustomWorkTime,
    language, setLanguage, resetSettings,
    user, logout 
  } = useAppContext();

  const { t } = useTranslation();

  const handlePressProfile = () => {
    Haptics.selectionAsync(); 
    navigation.navigate('Profile');
  };

  // Rung khi đổi ngôn ngữ
  const toggleLanguage = () => {
    const newLang = language === 'vi' ? 'en' : 'vi';
    setLanguage(newLang);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); 
  };

  // Thêm Alert xác nhận cho Reset Settings (UX tốt hơn)
  const handleResetConfirm = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      t('settings.reset_settings'),
      t('settings.reset_confirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('common.confirm'), 
          onPress: () => {
            resetSettings();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); 
    Alert.alert(
      t('settings.logout_title'),
      t('settings.logout_confirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('common.confirm'), 
          style: 'destructive',
          onPress: async () => {
            await logout();
            // AppContext.logout đã có sẵn Haptics.Success
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
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* --- PROFILE HEADER --- */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionHeaderText, { color: theme.subText }]}>
          {t('settings.sections.profile')}
        </Text>
      </View>

        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={handlePressProfile} 
          style={[styles.profileCard, { backgroundColor: theme.card, padding: 20, borderRadius: 24, marginBottom: 10 }]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={{ width: 64, height: 64, borderRadius: 32 }} />
            ) : (
              <View style={[styles.iconCircle, { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FF525215' }]}>
                <Ionicons name="person" size={32} color="#FF5252" />
              </View>
            )}
            <View style={{ marginLeft: 16, flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800' }}>
                {user?.displayName || 'Đàm Tiến Trình'}
              </Text>
              <Text style={{ color: theme.subText, fontSize: 14, marginTop: 2 }}>
                {user?.email || 'dtt@epu.edu.vn'}
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color={theme.subText} />
          </View>

          {/* Nút Xem chi tiết hồ sơ */}
          <View 
            style={{ 
              marginTop: 15, 
              paddingVertical: 8, 
              borderTopWidth: 1, 
              borderTopColor: theme.border + '50',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Ionicons name="eye-outline" size={16} color={theme.subText} />
            <Text style={{ color: theme.subText, marginLeft: 6, fontSize: 13 }}>
              {t('settings.view_profile')}
            </Text>
          </View>
        </TouchableOpacity>

      {/* --- NHÓM 1: POMODORO --- */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionHeaderText, { color: theme.subText }]}>{t('settings.sections.pomodoro')}</Text>
      </View>
      
      <View style={[styles.section, dynamicSectionStyle]}>
        <View style={styles.row}>
          <View style={[styles.iconCircle, { backgroundColor: '#FF525215' }]}>
            <Ionicons name="timer-outline" size={22} color="#FF5252" />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>{t('settings.work_time')}</Text>
          <Text style={[styles.valueText, { color: '#FF5252', fontWeight: '900' }]}>
            {customWorkTime} {t('settings.minutes')}
          </Text>
        </View>
        
        <Slider
          style={{ width: '100%', height: 45 }}
          minimumValue={15}
          maximumValue={60}
          step={5}
          value={customWorkTime}
          onSlidingComplete={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          onValueChange={(val) => {
            setCustomWorkTime(val);
            // Rung nhẹ khi trượt qua các mốc step
            if (Platform.OS === 'ios') Haptics.selectionAsync();
          }}
          minimumTrackTintColor="#FF5252"
          maximumTrackTintColor={theme.border}
          thumbTintColor="#FF5252"
        />
      </View>

      {/* --- NHÓM 2: GIAO DIỆN --- */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionHeaderText, { color: theme.subText }]}>{t('settings.sections.appearance')}</Text>
      </View>
      
      <View style={[styles.section, dynamicSectionStyle]}>
        <View style={styles.row}>
          <View style={[styles.iconCircle, { backgroundColor: isDarkMode ? '#333' : '#eee'}]}>
            <Ionicons 
              name={isDarkMode ? "moon" : "sunny"} 
              size={22} 
              color={isDarkMode ? "#FFD700" : "#FF5252"} 
            />
          </View>
          <Text style={[styles.title, { color: theme.text, flex: 1 }]}>{t('settings.dark_mode')}</Text>
          <Switch
            value={isDarkMode}
            onValueChange={(val) => {
              setIsDarkMode(val);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
            trackColor={{ false: "#767577", true: "#FF5252" }}
            thumbColor={Platform.OS === 'android' ? '#fff' : ''}
          />
        </View>

        <TouchableOpacity 
          onPress={toggleLanguage} 
          style={[styles.row, { borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 12, marginTop: 12 }]}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#FF525210' }]}>
            <Ionicons name="globe-outline" size={22} color="#FF5252" />
          </View>
          <Text style={[styles.title, { color: theme.text, flex: 1 }]}>{t('settings.language')}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: theme.subText, marginRight: 8, fontSize: 15 }}>
              {language === 'vi' ? 'Tiếng Việt' : 'English'}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={theme.subText} />
          </View>
        </TouchableOpacity>
      </View>

      {/* --- NHÓM 3: HỆ THỐNG --- */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionHeaderText, { color: theme.subText }]}>{t('settings.sections.system')}</Text>
      </View>

      <View style={[styles.section, dynamicSectionStyle]}>
        <TouchableOpacity onPress={handleResetConfirm} style={styles.row}>
          <View style={[styles.iconCircle, { backgroundColor: '#eee' }]}>
            <Ionicons name="refresh-outline" size={22} color="#666" />
          </View>
          <Text style={[styles.title, { color: theme.text, flex: 1 }]}>{t('settings.reset_settings')}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleLogout} 
          style={[styles.row, { borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 12, marginTop: 12 }]}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#FF525210' }]}>
            <Ionicons name="log-out-outline" size={22} color="#FF5252" />
          </View>
          <Text style={{ color: '#FF5252', fontSize: 16, fontWeight: 'bold', flex: 1 }}>
            {t('settings.logout_title')}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.footerText, { color: theme.subText, textAlign: 'center' }]}>
        {t('settings.version')}
      </Text>
    </ScrollView>
  );
}