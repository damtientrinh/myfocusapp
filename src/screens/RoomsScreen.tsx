import React, {
    useEffect,
    useState,
    useLayoutEffect,
    useCallback
} from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
    TextInput,
    Alert
} from "react-native";

import {
    getRooms,
    joinRoomByCode,
    deleteRoom,
    listenRoomCount
} from "../api/rooms";

import {
    useNavigation,
    useFocusEffect
} from "@react-navigation/native";

import { useAppContext } from "../context/AppContext";

export default function RoomsScreen() {
    const [rooms, setRooms] = useState<any[]>([]);
    const [counts, setCounts] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [joinCode, setJoinCode] = useState("");

    const navigation = useNavigation();
    const { user } = useAppContext();

    const fetchRooms = async () => {
        try {
            const data = await getRooms();
            setRooms(data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchRooms();
        }, [])
    );

    // 🔥 realtime count
    useEffect(() => {
        const unsubs: any[] = [];

        rooms.forEach(room => {
            const unsub = listenRoomCount(room.id, (count: number) => {
                setCounts(prev => ({
                    ...prev,
                    [room.id]: count
                }));
            });

            unsubs.push(unsub);
        });

        return () => {
            unsubs.forEach(u => u && u());
        };
    }, [rooms]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: "Phòng",
            headerRight: () => (
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("CreateRoom" as never)
                    }
                >
                    <Text style={{ fontSize: 26, marginRight: 16 }}>
                        ＋
                    </Text>
                </TouchableOpacity>
            )
        });
    }, [navigation]);

    const handleJoin = async () => {
        if (!joinCode.trim()) return;

        try {
            const room = await joinRoomByCode(joinCode, user);

            setJoinCode("");

            navigation.navigate(
                "RoomDetail" as never,
                { room } as never
            );
        } catch {
            Alert.alert("Lỗi", "Code không hợp lệ");
        }
    };

    if (loading) {
        return <ActivityIndicator style={{ flex: 1 }} />;
    }

    return (
        <View style={{
            flex: 1,
            padding: 16,
            backgroundColor: "#f5f6fa"
        }}>

            {/* JOIN */}
            <View style={{
                flexDirection: "row",
                marginBottom: 16,
                backgroundColor: "#fff",
                borderRadius: 12,
                paddingHorizontal: 12,
                alignItems: "center",
                height: 45
            }}>
                <TextInput
                    placeholder="Nhập code phòng..."
                    value={joinCode}
                    onChangeText={setJoinCode}
                    style={{ flex: 1 }}
                />
                <TouchableOpacity onPress={handleJoin}>
                    <Text style={{
                        color: "#4CAF50",
                        fontWeight: "bold"
                    }}>
                        Vào
                    </Text>
                </TouchableOpacity>
            </View>

            {/* LIST */}
            <FlatList
                data={rooms}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            fetchRooms();
                        }}
                    />
                }
                renderItem={({ item }) => {
                    const isOwner = item.owner === user?.uid;

                    const handleDelete = () => {
                        Alert.alert("Xóa phòng?", "Không thể hoàn tác", [
                            { text: "Hủy" },
                            {
                                text: "Xóa",
                                onPress: async () => {
                                    await deleteRoom(item.id);
                                    fetchRooms();
                                }
                            }
                        ]);
                    };

                    return (
                        <View style={{
                            backgroundColor: "#fff",
                            padding: 18,
                            borderRadius: 16,
                            marginBottom: 12,
                            elevation: 3
                        }}>
                            <TouchableOpacity
                                onPress={() =>
                                    navigation.navigate(
                                        "RoomDetail" as never,
                                        { room: item } as never
                                    )
                                }
                            >
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: "bold"
                                }}>
                                    {item.name}
                                </Text>

                                <Text style={{ color: "#666" }}>
                                    {item.topic}
                                </Text>

                                <Text>
                                    👥 {counts[item.id] || 0} người
                                </Text>
                            </TouchableOpacity>

                            {isOwner && (
                                <TouchableOpacity
                                    onPress={handleDelete}
                                    style={{ marginTop: 10 }}
                                >
                                    <Text style={{
                                        color: "red",
                                        fontWeight: "bold"
                                    }}>
                                        Xóa phòng
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                }}
            />
        </View>
    );
}