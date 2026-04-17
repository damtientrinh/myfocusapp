import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList
} from "react-native";
import {
    leaveRoom,
    sendMessage,
    listenMessages,
    listenRoomMembers
} from "../api/rooms";
import { useAppContext } from "../context/AppContext";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function RoomDetailScreen() {
    const { user } = useAppContext();
    const route = useRoute();
    const navigation = useNavigation();

    const { room } = route.params as any;

    const [messages, setMessages] = useState<any[]>([]);
    const [members, setMembers] = useState<any[]>([]);
    const [text, setText] = useState("");

    useEffect(() => {
        const unsub1 = listenMessages(room.id, setMessages);
        const unsub2 = listenRoomMembers(room.id, setMembers);

        return () => {
            unsub1();
            unsub2();
        };
    }, []);

    const handleSend = async () => {
        if (!text.trim()) return;

        await sendMessage(room.id, user.uid, user.name || "User", text);
        setText("");
    };

    const handleLeave = async () => {
        await leaveRoom(room.id, user.uid);
        navigation.goBack();
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#f5f6fa" }}>

            {/* HEADER */}
            <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    {room.name}
                </Text>
                <Text style={{ color: "#666" }}>{room.topic}</Text>
                <Text style={{ marginTop: 4 }}>🔑 {room.code}</Text>
            </View>

            {/* 🔥 NÚT FOCUS (FIX NAVIGATE) */}
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate("Focus" as never, {
                        roomId: room.id
                    } as never)
                }
                style={{
                    backgroundColor: "#4CAF50",
                    marginHorizontal: 16,
                    padding: 12,
                    borderRadius: 12,
                    alignItems: "center",
                    marginBottom: 10
                }}
            >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Bắt đầu Focus
                </Text>
            </TouchableOpacity>

            {/* MEMBERS */}
            <View style={{ paddingHorizontal: 16 }}>
                <Text style={{ fontWeight: "bold", marginBottom: 6 }}>
                    Thành viên
                </Text>

                {members.map(m => (
                    <View
                        key={m.id}
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginBottom: 4
                        }}
                    >
                        <Text>{m.name}</Text>
                        <Text>
                            {m.status === "studying"
                                ? "📚 Đang học"
                                : m.status === "idle"
                                    ? "🟡 Nghỉ"
                                    : "🟢 Online"}
                        </Text>
                    </View>
                ))}
            </View>

            {/* CHAT */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                style={{ flex: 1, padding: 10 }}
                renderItem={({ item }) => {
                    const isMe = item.userId === user.uid;

                    return (
                        <View
                            style={{
                                alignSelf: isMe ? "flex-end" : "flex-start",
                                backgroundColor: isMe ? "#4CAF50" : "#fff",
                                padding: 10,
                                borderRadius: 12,
                                marginBottom: 6,
                                maxWidth: "70%"
                            }}
                        >
                            <Text
                                style={{
                                    fontWeight: "bold",
                                    color: isMe ? "#fff" : "#000"
                                }}
                            >
                                {item.userName}
                            </Text>

                            <Text style={{ color: isMe ? "#fff" : "#000" }}>
                                {item.text}
                            </Text>
                        </View>
                    );
                }}
            />

            {/* INPUT */}
            <View
                style={{
                    flexDirection: "row",
                    padding: 10,
                    backgroundColor: "#fff"
                }}
            >
                <TextInput
                    value={text}
                    onChangeText={setText}
                    placeholder="Nhắn tin..."
                    style={{
                        flex: 1,
                        backgroundColor: "#f1f1f1",
                        borderRadius: 20,
                        paddingHorizontal: 12
                    }}
                />
                <TouchableOpacity onPress={handleSend}>
                    <Text style={{ marginLeft: 10, color: "#4CAF50" }}>
                        Gửi
                    </Text>
                </TouchableOpacity>
            </View>

            {/* RỜI */}
            <TouchableOpacity onPress={handleLeave}>
                <Text
                    style={{
                        textAlign: "center",
                        color: "red",
                        marginBottom: 10
                    }}
                >
                    Rời phòng
                </Text>
            </TouchableOpacity>
        </View>
    );
}