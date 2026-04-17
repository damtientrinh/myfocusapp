import { NavigationProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // 1. Import i18n
import {
    Alert,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { leaveRoom, listenMessages, listenRoomMembers, sendMessage } from "../components/room/rooms";
import { useAppContext } from "../context/AppContext";
import { RootStackParamList } from "../navigation/RootNavigator";
import { styles } from "../styles/RoomDetailStyles";

export default function RoomDetailScreen() {
    const { user, theme } = useAppContext(); 
    const { t } = useTranslation(); 
    const route = useRoute();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const { room } = route.params as { room: any };
    const [messages, setMessages] = useState<any[]>([]);
    const [members, setMembers] = useState<any[]>([]);
    const [text, setText] = useState("");

    useEffect(() => {
        const unsubMessages = listenMessages(room.id, setMessages);
        const unsubMembers = listenRoomMembers(room.id, setMembers);
        return () => {
            unsubMessages();
            unsubMembers();
        };
    }, [room.id]);

    if (!user) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <Text style={{ color: theme.text }}>{t('common.loading')}...</Text>
            </View>
        );
    }

    const handleSend = async () => {
        if (!text.trim()) return;
        try {
            await sendMessage(room.id, user.uid, user.name || "User", text);
            setText("");
        } catch (e) {
            Alert.alert(t('common.error'), t('room_detail.send_error'));
        }
    };

    const handleLeave = async () => {
        Alert.alert(t('room_detail.leave_title'), t('room_detail.leave_msg'), [
            { text: t('common.stay') },
            { 
                text: t('common.leave'), 
                style: 'destructive',
                onPress: async () => {
                    await leaveRoom(room.id, user.uid);
                    navigation.goBack();
                } 
            }
        ]);
    };

    const flatListRef = React.useRef<FlatList>(null);
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100); 
        }
    }, [messages]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                // Cuộn xuống cuối ngay khi bàn phím hiện lên
                flatListRef.current?.scrollToEnd({ animated: true });
            }
        );

        return () => {
            keyboardDidShowListener.remove();
        };
    }, []);


    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[styles.container, { backgroundColor: theme.background }]}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 60}
        >
             {/* CHAT SECTION */}
            <FlatList
                ref={flatListRef} 
                data={messages}
                keyExtractor={(item) => item.id}
                style={styles.chatList}
                contentContainerStyle={{ 
                    paddingHorizontal: 16, paddingBottom: 20, 
                    flexGrow: 1, justifyContent: "flex-end"
                }}
                showsVerticalScrollIndicator={false}

                ListHeaderComponent={() => (
                    <View>
                        {/* HEADER */}
                        <View style={[styles.header, { borderBottomColor: theme.border }]}>
                            <Text style={[styles.roomName, { color: theme.text }]}>{room.name}</Text>
                            <Text style={[styles.roomTopic, { color: theme.subText }]}>{t('create_room.topic_label')}: {room.topic}</Text>
                            <Text style={[styles.roomCode, { color: theme.primary }]}>{t('room_detail.room_code')}: {room.code}</Text>
                        </View>

                        {/* FOCUS BUTTON */}
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Focus", { roomId: room.id })}
                            style={[styles.focusBtn, { backgroundColor: theme.primary }]}
                        >
                            <Text style={styles.focusBtnText}>🚀 {t('room_detail.start_focus')}</Text>
                        </TouchableOpacity>

                        {/* MEMBERS LIST */}
                        <View style={{ paddingVertical: 10 }}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>
                                {t('room_detail.online_members')} ({members.length})
                            </Text>
                            <FlatList 
                                data={members}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <View style={[styles.memberBadge, { backgroundColor: theme.card, borderColor: theme.border }]}>
                                        <Text style={{ color: item.id === user.uid ? theme.primary : theme.text, fontWeight: 'bold' }}>
                                            {item.name}
                                        </Text>
                                    </View>
                                )}
                            />
                        </View>
                    </View>
                )}
                
                renderItem={({ item }) => {
                    const isMe = item.userId === user.uid;
                    return (
                        <View style={{
                            alignSelf: isMe ? "flex-end" : "flex-start",
                            backgroundColor: isMe ? theme.primary : theme.card,
                            padding: 12,
                            borderRadius: 18,
                            borderBottomRightRadius: isMe ? 2 : 18,
                            borderBottomLeftRadius: isMe ? 18 : 2,
                            marginBottom: 8,
                            maxWidth: "80%",
                            elevation: 1,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.1,
                        }}>
                            {/* 1. Tên người gửi (Chỉ hiện nếu không phải là mình) */}
                            {!isMe && (
                                <Text style={{ fontSize: 10, fontWeight: 'bold', color: theme.subText, marginBottom: 2 }}>
                                    {item.userName}
                                </Text>
                            )}

                            {/* 2. Nội dung tin nhắn */}
                            <Text style={{ color: isMe ? "#fff" : theme.text }}>{item.text}</Text>

                            {/* 3. Thời gian gửi */}
                            <Text style={{ 
                                fontSize: 8, 
                                alignSelf: 'flex-end', 
                                color: isMe ? '#e0e0e0' : theme.subText,
                                marginTop: 2 
                            }}>
                                {item.createdAt?.toDate ? 
                                    `${item.createdAt.toDate().getHours()}:${item.createdAt.toDate().getMinutes().toString().padStart(2, '0')}` 
                                    : ""}
                            </Text>
                        </View>
                    );
                }}
            />
            
         


            {/* INPUT BOX */}
            <View style={[styles.inputContainer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
                <TextInput
                    value={text}
                    onChangeText={setText}
                    placeholder={t('room_detail.chat_placeholder')}
                    style={[styles.input, { color: theme.text }]}
                    placeholderTextColor={theme.subText}
                />
                <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
                    <Text style={[styles.sendText, { color: theme.primary }]}>{t('room_detail.send_btn')}</Text>
                </TouchableOpacity>
            </View>

            {/* LEAVE BUTTON */}
            <TouchableOpacity onPress={handleLeave} style={styles.leaveBtn}>
                <Text style={[styles.leaveText, { color: '#e74c3c' }]}>{t('room_detail.leave_action')}</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}