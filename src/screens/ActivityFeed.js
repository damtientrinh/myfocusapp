import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const today = [
  {
    id: "1",
    title: "Phiên Pomodoro mới hoàn thành!",
    desc: "Bạn đã hoàn thành 1 phiên Pomodoro.",
    time: "2 giờ trước",
    icon: "checkmark-circle",
  },
  {
    id: "2",
    title: "Chúc mừng! Thành tựu mở khóa!",
    desc: "Bạn đã hoàn thành 3 phiên tập trung liên tiếp!",
    time: "3 giờ trước",
    icon: "trophy",
  },
];

const yesterday = [
  {
    id: "3",
    title: "Báo cáo pomodoro đã sẵn sàng",
    desc: "Nhấp vào đây để coi báo cáo hiệu suất tập trung.",
    time: "20 giờ trước",
    icon: "document-text",
  },
];

export default function ActivityFeed() {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Ionicons name={item.icon} size={24} color="#e74c3c" />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.titleItem}>{item.title}</Text>
        <Text style={styles.desc}>{item.desc}</Text>
      </View>
      <Text style={styles.time}>{item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Hoạt Động</Text>
        <Ionicons name="notifications-outline" size={24} color="white" />
      </View>

      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.section}>Hôm nay</Text>
            {today.map((i) => renderItem({ item: i }))}

            <Text style={styles.section}>Hôm qua</Text>
            {yesterday.map((i) => renderItem({ item: i }))}
          </>
        }
        data={[]}
        renderItem={null}
      />

      {/* BOTTOM TAB */}
      <View style={styles.bottomTab}>
        <Tab icon="home-outline" label="Trang Chủ" />
        <Tab icon="checkmark-done-outline" label="Nhiệm Vụ" />

        <View style={styles.centerBtn}>
          <Text style={{ fontSize: 22, color: "white" }}>🍅</Text>
        </View>

        <Tab icon="notifications-outline" label="Hoạt Động" active />
        <Tab icon="person-outline" label="Hồ Sơ" />
      </View>
    </View>
  );
}

const Tab = ({ icon, label, active }) => (
  <View style={styles.tabItem}>
    <Ionicons
      name={icon}
      size={22}
      color={active ? "#e74c3c" : "#777"}
    />
    <Text style={{ color: active ? "#e74c3c" : "#777", fontSize: 12 }}>
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },

  header: {
    backgroundColor: "#e74c3c",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  section: {
    marginTop: 20,
    marginLeft: 20,
    fontWeight: "bold",
    fontSize: 16,
    color: "#555",
  },

  item: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: 12,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  titleItem: { fontWeight: "bold", fontSize: 14 },

  desc: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },

  time: {
    fontSize: 11,
    color: "#999",
  },

  bottomTab: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderColor: "#ddd",
  },

  tabItem: {
    alignItems: "center",
  },

  centerBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -30,
  },
});