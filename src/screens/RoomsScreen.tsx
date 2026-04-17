import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { Plus, Trophy } from "lucide-react-native";
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // Import i18n
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import { deleteRoom, getRooms, joinRoomByCode, listenRoomCount } from "../components/room/rooms";
import { useAppContext } from "../context/AppContext";
import { RootStackParamList } from "../navigation/RootNavigator";
import { styles } from "../styles/RoomStyles";

export default function RoomsScreen() {
    const [rooms, setRooms] = useState<any[]>([]);
    const [counts, setCounts] = useState<{ [key: string]: number }>({});
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [joinCode, setJoinCode] = useState("");

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { user, theme } = useAppContext(); // Lấy theme từ Context
    const { t } = useTranslation(); // Lấy hàm dịch

    const fetchRooms = async () => {
        try {
            const data = await getRooms();
            setRooms(data);
        } catch (e) {
            console.error("Fetch Rooms Error:", e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchRooms();
        }, [])
    );

    useEffect(() => {
        const unsubs: (() => void)[] = [];
        rooms.forEach(room => {
            const unsub = listenRoomCount(room.id, (count: number) => {
                setCounts(prev => ({ ...prev, [room.id]: count }));
            });
            unsubs.push(unsub);
        });
        return () => unsubs.forEach(u => u?.());
    }, [rooms]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: t('tabs.rooms'), // Sử dụng đa ngôn ngữ cho tiêu đề
            headerStyle: { backgroundColor: theme.card },
            headerTintColor: theme.text,
            headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate("Leaderboard")}
                        style={{ marginRight: 18 }}
                    >
                        <Trophy size={24} color="#FFD700" /> 
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate("CreateRoom")}>
                        <Plus size={26} color={theme.primary} />
                    </TouchableOpacity>
                </View>
            )
        });
    }, [navigation, theme]);

    const handleJoin = async () => {
        if (!joinCode.trim()) return;
        try {
            const room = await joinRoomByCode(joinCode, user);
            setJoinCode("");
            navigation.navigate("RoomDetail", { room });
        } catch {
            Alert.alert(t('common.error'), t('rooms.join_error'));
        }
    };

    if (loading) return <ActivityIndicator size="large" color={theme.primary} style={{ flex: 1, backgroundColor: theme.background }} />;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* JOIN BOX */}
            <View style={[styles.joinSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <TextInput
                    placeholder={t('rooms.input_placeholder')}
                    value={joinCode}
                    onChangeText={setJoinCode}
                    style={[styles.input, { color: theme.text }]}
                    placeholderTextColor={theme.subText}
                />
                <TouchableOpacity onPress={handleJoin} style={{ backgroundColor: theme.primary, padding: 8, borderRadius: 8 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>{t('rooms.join_btn')}</Text>
                </TouchableOpacity>
            </View>

            {/* LIST ROOMS */}
            <FlatList
                data={rooms}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text style={[styles.emptyText, { color: theme.subText }]}>{t('rooms.empty')}</Text>}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchRooms(); }} tintColor={theme.primary} />
                }
                renderItem={({ item }) => {
                    const isOwner = item.owner === user?.uid;
                    return (
                        <View style={[styles.roomCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                            <TouchableOpacity 
                                onPress={() => navigation.navigate("RoomDetail", { room: item })}
                                activeOpacity={0.7}
                            >
                                <View style={styles.roomHeader}>
                                    <View>
                                        <Text style={[styles.roomName, { color: theme.text }]}>{item.name}</Text>
                                        <Text style={[styles.roomTopic, { color: theme.subText }]}>📌 {item.topic}</Text>
                                    </View>
                                    <Text style={[styles.memberCount, { color: theme.primary }]}>👥 {counts[item.id] || 0}</Text>
                                </View>
                            </TouchableOpacity>

                            <View style={[styles.roomFooter, { borderTopColor: theme.border }]}>
                                <Text style={{ fontSize: 12, color: theme.subText }}>ID: {item.code || '---'}</Text>
                                {isOwner && (
                                    <TouchableOpacity 
                                        style={styles.deleteBtn}
                                        onPress={() => Alert.alert(t('rooms.delete_confirm_title'), t('rooms.delete_confirm_msg'), [
                                            { text: t('common.cancel') },
                                            { text: t('common.delete'), onPress: async () => { await deleteRoom(item.id); fetchRooms(); }, style: 'destructive' }
                                        ])}
                                    >
                                        <Text style={[styles.deleteText, { color: '#e74c3c' }]}>{t('rooms.delete_btn')}</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    );
                }}
            />
        </View>
    );
}