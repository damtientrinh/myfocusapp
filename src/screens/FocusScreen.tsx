import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity
} from "react-native";
import * as Haptics from "expo-haptics";
import { useRoute } from "@react-navigation/native";

// Firebase
import { db } from "@/config/firebaseConfig";
import { addDoc, collection, doc, increment, serverTimestamp, updateDoc } from "firebase/firestore";

// Realtime
import { updateUserStatus } from "@/api/rooms";

// Context + Hooks
import { useAppContext } from "@/context/AppContext";
import { usePomodoro } from "../hooks/usePomodoro";
import { useTaskLogic } from "../hooks/useTaskLogic";

export default function FocusScreen() {
    const route = useRoute();
    const roomId = route?.params?.roomId || null;

    const { user, incrementTaskPomodoro } = useAppContext();
    const { taskList } = useTaskLogic();

    const {
        time,
        isActive,
        mode,
        setIsActive,
        changeMode,
        formatTime,
        totalSeconds
    } = usePomodoro();

    const [activeTask] = useState(taskList[0]);
    const [pomodoroCount, setPomodoroCount] = useState(0);

    // 🔥 SAVE SESSION
    const saveSession = async () => {
        if (!user || mode !== "WORK") return;

        await addDoc(collection(db, "sessions"), {
            userId: user.uid,
            userName: user.name || "User",
            duration: Math.floor(totalSeconds / 60),
            createdAt: serverTimestamp()
        });

        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            totalMinutes: increment(Math.floor(totalSeconds / 60))
        });

        setPomodoroCount(p => p + 1);
    };

    // 🔥 TIMER END
    useEffect(() => {
        if (time === 0 && isActive) {
            setIsActive(false);
            saveSession();

            if (roomId && user) {
                updateUserStatus(roomId, user.uid, "idle", 0);
            }

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    }, [time]);

    // 🔥 realtime
    useEffect(() => {
        if (!roomId || !user) return;

        if (isActive) {
            updateUserStatus(
                roomId,
                user.uid,
                mode === "WORK" ? "studying" : "break",
                time
            );
        } else {
            updateUserStatus(roomId, user.uid, "idle", 0);
        }
    }, [isActive, time, mode]);

    return (
        <View style={{
            flex: 1,
            backgroundColor: "#f76c6c",
            alignItems: "center",
            paddingTop: 60
        }}>

            {/* QUOTE */}
            <Text style={{
                color: "#fff",
                opacity: 0.8,
                fontStyle: "italic",
                marginBottom: 20
            }}>
                “Một Pomodoro mỗi ngày, Bug tự khắc bay xa 🐞”
            </Text>

            {/* MODE */}
            <View style={{
                flexDirection: "row",
                backgroundColor: "#f4a3a3",
                borderRadius: 25,
                padding: 4,
                marginBottom: 25
            }}>
                {["WORK", "SHORT_BREAK", "LONG_BREAK"].map(m => (
                    <TouchableOpacity
                        key={m}
                        onPress={() => changeMode(m as any)}
                        style={{
                            paddingHorizontal: 18,
                            paddingVertical: 8,
                            borderRadius: 20,
                            backgroundColor: mode === m ? "#ffb347" : "transparent"
                        }}
                    >
                        <Text style={{ color: "#fff", fontWeight: "600" }}>
                            {m === "WORK" ? "Tập trung" :
                                m === "SHORT_BREAK" ? "Nghỉ ngắn" : "Nghỉ dài"}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* TIMER CIRCLE */}
            <View style={{
                width: 260,
                height: 260,
                borderRadius: 130,
                backgroundColor: "#d97b5f",
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOpacity: 0.3,
                shadowRadius: 12,
                marginBottom: 25
            }}>
                <Text style={{
                    fontSize: 55,
                    color: "#fff",
                    fontWeight: "bold"
                }}>
                    {formatTime(time)}
                </Text>

                <Text style={{
                    color: "#fff",
                    opacity: 0.7,
                    marginTop: 5
                }}>
                    {mode === "WORK" ? "FOCUS" : "REST"}
                </Text>
            </View>

            {/* BUTTONS */}
            <View style={{
                flexDirection: "row",
                marginBottom: 15
            }}>
                <TouchableOpacity
                    style={{
                        backgroundColor: "#fff",
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderRadius: 25,
                        marginRight: 10
                    }}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        setIsActive(!isActive);
                    }}
                >
                    <Text style={{
                        color: "#f76c6c",
                        fontWeight: "bold"
                    }}>
                        {isActive ? "DỪNG" : "BẮT ĐẦU"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        backgroundColor: "#e57373",
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderRadius: 25
                    }}
                    onPress={() => {
                        setIsActive(false);
                        changeMode(mode);
                    }}
                >
                    <Text style={{ color: "#fff" }}>
                        LÀM MỚI
                    </Text>
                </TouchableOpacity>
            </View>

            {/* TASK */}
            <View style={{
                backgroundColor: "#ff8a80",
                padding: 10,
                borderRadius: 20,
                marginTop: 10
            }}>
                <Text style={{ color: "#fff" }}>
                    🚀 Đang làm: {activeTask?.text || "Học Spanish"}
                </Text>
            </View>

            {/* DONE BUTTON */}
            <TouchableOpacity
                style={{
                    backgroundColor: "#d66",
                    padding: 12,
                    borderRadius: 20,
                    marginTop: 10
                }}
            >
                <Text style={{ color: "#fff" }}>
                    ✔ Xong việc này
                </Text>
            </TouchableOpacity>

            {/* MUSIC */}
            <View style={{
                marginTop: 20,
                backgroundColor: "#333",
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 20
            }}>
                <Text style={{ color: "#fff" }}>
                    🎵 Morning Chill
                </Text>
            </View>

            {/* STATS */}
            <View style={{
                marginTop: 20,
                backgroundColor: "#ff9a9a",
                paddingHorizontal: 20,
                paddingVertical: 8,
                borderRadius: 20
            }}>
                <Text style={{ color: "#fff" }}>
                    Số phiên: {pomodoroCount}
                </Text>
            </View>

        </View>
    );
}