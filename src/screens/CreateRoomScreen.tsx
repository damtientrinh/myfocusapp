import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert
} from "react-native";
import { createRoom } from "../api/rooms";
import { useNavigation } from "@react-navigation/native";
import { useAppContext } from "@/context/AppContext";

export default function CreateRoomScreen() {
    const [name, setName] = useState("");
    const [topic, setTopic] = useState("");

    const navigation = useNavigation();
    const { user } = useAppContext();

    const handleCreate = async () => {
        if (!name) {
            Alert.alert("Lỗi", "Nhập tên phòng");
            return;
        }

        const room = await createRoom(name, topic, user);
        navigation.replace("RoomDetail", { room });
    };

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: "#f5f6fa" }}>
            <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 20 }}>
                Tạo phòng mới
            </Text>

            <Text style={{ marginBottom: 6 }}>Tên phòng</Text>
            <TextInput
                placeholder="VD: Học nhóm React"
                value={name}
                onChangeText={setName}
                style={{
                    backgroundColor: "#fff",
                    padding: 14,
                    borderRadius: 12,
                    marginBottom: 16
                }}
            />

            <Text style={{ marginBottom: 6 }}>Chủ đề</Text>
            <TextInput
                placeholder="VD: Frontend"
                value={topic}
                onChangeText={setTopic}
                style={{
                    backgroundColor: "#fff",
                    padding: 14,
                    borderRadius: 12
                }}
            />

            <TouchableOpacity
                onPress={handleCreate}
                style={{
                    marginTop: 30,
                    backgroundColor: "#4CAF50",
                    padding: 16,
                    borderRadius: 14,
                    alignItems: "center"
                }}
            >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Tạo phòng 🚀
                </Text>
            </TouchableOpacity>
        </View>
    );
}