import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const data = [
    { id: "1", text: "Minh vừa hoàn thành 1 Pomo" },
    { id: "2", text: "An bắt đầu phiên học mới" },
    { id: "3", text: "Huy hoàn thành 3 Pomo" }
];

export default function ActivityFeed() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Activity Feed</Text>

            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Text style={styles.item}>{item.text}</Text>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "flex-start",
        paddingTop: 80,
        backgroundColor: "#f5f5f5"
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center"
    },
    item: {
        padding: 15,
        backgroundColor: "#ffffff",
        marginBottom: 12,
        borderRadius: 10,
        fontSize: 16,
        elevation: 2
    }
});