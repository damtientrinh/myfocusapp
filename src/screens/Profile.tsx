import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useAppContext } from "../context/AppContext";
import { styles } from "../styles/ProfileStyles";

export default function ProfileScreen() {
  const { user, theme } = useAppContext();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  // Hàm render dòng thông tin chi tiết
  const renderInfoItem = (icon: any, label: string, value: string | undefined) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
        <Ionicons name={icon} size={20} color="#e74c3c" />
      </View>
      <View>
        <Text style={{ fontSize: 12, color: theme.text, opacity: 0.6 }}>{label}</Text>
        {/* ✅ Fix: Bọc giá trị trong Template String để tránh lỗi dữ liệu null/undefined */}
        <Text style={{ fontSize: 15, color: theme.text, fontWeight: '600' }}>
          {`${value || "---"}`}
        </Text>
      </View>
    </View>
  );

  const getLevel = (minutes: number = 0) => {
    if (minutes < 100) return t('profile.levels.beginner');
    if (minutes < 500) return t('profile.levels.warrior');
    return t('profile.levels.master');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* HEADER */}
        <LinearGradient colors={["#e74c3c", "#c0392b"]} style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>{t('profile.header')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
              <Ionicons name="settings-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* PROFILE CARD */}
        <View style={[styles.profileCard, { backgroundColor: theme.card || '#fff'}]}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user?.photoURL || "https://i.pravatar.cc/150" }}
              style={styles.avatar}
            />
            {user?.isPro && (
              <View style={styles.badgeContainer}>
                <Ionicons name="checkmark-circle" size={20} color="#2ecc71" />
              </View>
            )}
          </View>

          <Text style={[styles.name, { color: theme.text }]}>
            {`${user?.displayName || t('auth.new_member')}`}
          </Text>
          
          {/* ✅ Hiển thị Level (Nếu Trình muốn mở lại) */}
          <Text style={{ color: '#e74c3c', fontWeight: '700', fontSize: 13, marginTop: 2 }}>
            {getLevel(user?.totalMinutes)}
          </Text>

          <Text style={styles.plan}>
            {user?.isPro ? t('profile.plan_pro') : t('profile.plan_free')}
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => navigation.navigate('EditProfile')} 
            >
              <Ionicons name="create-outline" size={16} color="#fff" />
              <Text style={styles.editButtonText}>{t('profile.edit')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* THÔNG TIN CHI TIẾT */}
        <View style={[styles.card, { backgroundColor: theme.card, marginTop: 15 }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              {t('profile.personal_info')}
            </Text>
          </View>
          <View style={{ paddingVertical: 10 }}>
            {renderInfoItem("mail-outline", t('profile.email'), user?.email)}
            {renderInfoItem("calendar-outline", t('profile.birthday'), (user as any)?.birthday)}
            {renderInfoItem("male-female-outline", t('profile.gender'), (user as any)?.gender)}
            {renderInfoItem("briefcase-outline", t('profile.job'), (user as any)?.job)}
          </View>
        </View>

        {/* THỐNG KÊ */}
        <View style={[styles.card, { backgroundColor: theme.card, marginTop: 15 }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>{t('profile.monthly_stats')}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Ionicons name="time-outline" size={20} color="#e74c3c" />
              <Text style={[styles.statsNumber, { color: theme.text }]}>
                {user?.totalMinutes || 0}
              </Text>
              <Text style={styles.statsLabel}>{t('profile.stats.minutes')}</Text>
            </View>

            <View style={styles.statBox}>
              <Ionicons name="trophy-outline" size={20} color="#f1c40f" /> 
              <Text style={[styles.statsNumber, { color: theme.text }]}>
                {user?.completedSessions || 0} 
              </Text>
              <Text style={styles.statsLabel}>{t('profile.stats.sessions')}</Text>
            </View>
            
            <View style={styles.statBox}>
              <Ionicons name="flame-outline" size={20} color="#e67e22" />
              <Text style={[styles.statsNumber, { color: theme.text }]}>
                {user?.currentStreak || 0}
              </Text>
              <Text style={styles.statsLabel}>{t('profile.stats.streak')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}