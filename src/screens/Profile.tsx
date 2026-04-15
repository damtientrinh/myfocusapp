import React from "react";
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient'; 
import { useTranslation } from "react-i18next";
import { useAppContext } from "../context/AppContext";
import { styles } from "../styles/ProfileStyles";
import { useNavigation } from "@react-navigation/native";

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
        <Text style={{ fontSize: 15, color: theme.text, fontWeight: '600' }}>{value || "---"}</Text>
      </View>
    </View>
  );

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
            {user?.displayName || "Đàm Tiến Trình"}
          </Text>
          <Text style={styles.plan}>
            {user?.isPro ? t('profile.plan_pro') : "Free Member"}
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.editButton} 
              activeOpacity={0.7}
              onPress={() => navigation.navigate('EditProfile')} 
            >
              <Ionicons name="create-outline" size={16} color="#fff" />
              <Text style={styles.editButtonText}>{t('profile.edit')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* THÔNG TIN CHI TIẾT (MỚI THÊM) */}
        <View style={[styles.card, { backgroundColor: theme.card, marginTop: 15 }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Thông tin cá nhân</Text>
          </View>
          <View style={{ paddingVertical: 10 }}>
            {renderInfoItem("calendar-outline", "Ngày sinh", (user as any)?.birthday)}
            {renderInfoItem("male-female-outline", "Giới tính", (user as any)?.gender)}
            {renderInfoItem("briefcase-outline", "Nghề nghiệp", (user as any)?.job)}
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
                {user?.totalMinutes?.toLocaleString() || 0}
              </Text>
              <Text style={styles.statsLabel}>{t('profile.stats.minutes')}</Text>
            </View>

            <View style={styles.statBox}>
              <Ionicons name="checkmark-done-outline" size={20} color="#e74c3c" />
              <Text style={[styles.statsNumber, { color: theme.text }]}>
                {user?.totalSessions || 0}
              </Text>
              <Text style={styles.statsLabel}>{t('profile.stats.sessions')}</Text>
            </View>
            
            <View style={styles.statBox}>
              <Ionicons name="flame-outline" size={20} color="#e74c3c" />
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