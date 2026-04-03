import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function Profile() {
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: "https://i.pravatar.cc/150" }}
                style={styles.avatar}
            />

            <Text style={styles.name}>Mạnh</Text>

            <Text style={styles.info}>Tổng thời gian: 120 phút</Text>
            <Text style={styles.info}>Pomo hoàn thành: 6</Text>
            <Text style={styles.info}>Huy hiệu: 🔥 Focus Master</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5"
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20
    },
    name: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10
    },
    info: {
        fontSize: 16,
        marginBottom: 5
    }
});