import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hồ sơ</Text>
        <Ionicons name="settings-outline" size={24} color="#fff" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 10 }}
      >
        {/* PROFILE */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150" }}
            style={styles.avatar}
          />

          <Text style={styles.name}>Mai Nguyễn</Text>
          <Text style={styles.plan}>Tài khoản miễn phí</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button}>
              <Ionicons name="create-outline" size={16} color="#e74c3c" />
              <Text style={styles.buttonText}>Chỉnh sửa hồ sơ</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <Ionicons name="rocket-outline" size={16} color="#e74c3c" />
              <Text style={styles.buttonText}>Nâng cấp gói</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* THÀNH TÍCH */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thành tích</Text>

          <View style={styles.achievementRow}>
            <View style={styles.achievementItem}>
              <Text style={styles.achievementIcon}>🏆</Text>
              <Text style={styles.achievementText}>Chuỗi 5 ngày</Text>
            </View>

            <View style={styles.achievementItem}>
              <Text style={styles.achievementIcon}>🥇</Text>
              <Text style={styles.achievementText}>100 phiên</Text>
            </View>

            <View style={styles.achievementItem}>
              <Text style={styles.achievementIcon}>⏰</Text>
              <Text style={styles.achievementText}>2000 phút</Text>
            </View>

            <View style={styles.achievementItem}>
              <Text style={styles.achievementIcon}>🍅</Text>
              <Text style={styles.achievementText}>Phiên tốt</Text>
            </View>
          </View>
        </View>

        {/* THỐNG KÊ */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thống kê</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statsNumber}>145</Text>
              <Text style={styles.statsLabel}>Số phiên</Text>
            </View>

            <View style={styles.statBox}>
              <Text style={styles.statsNumber}>4800</Text>
              <Text style={styles.statsLabel}>Phút tập trung</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4"
  },

  header: {
    backgroundColor: "#e74c3c",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold"
  },

  profileCard: {
    backgroundColor: "#fff",
    margin: 15,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    elevation: 3
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: "#fff",
    marginBottom: 10
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5
  },

  plan: {
    color: "gray",
    marginBottom: 15
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fdecea",
    padding: 10,
    borderRadius: 10
  },

  buttonText: {
    marginLeft: 5,
    color: "#e74c3c",
    fontWeight: "600"
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 15,
    padding: 15,
    elevation: 3
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10
  },

  achievementRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  achievementItem: {
    alignItems: "center"
  },

  achievementIcon: {
    fontSize: 24
  },

  achievementText: {
    fontSize: 12,
    marginTop: 5,
    textAlign: "center"
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10
  },

  statBox: {
    alignItems: "center",
    backgroundColor: "#fdecea",
    padding: 15,
    borderRadius: 12,
    width: "40%"
  },

  statsNumber: {
    fontSize: 20,
    fontWeight: "bold"
  },

  statsLabel: {
    color: "gray",
    marginTop: 5
  }
});