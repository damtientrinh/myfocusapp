import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    query,
    where,
    updateDoc,
    serverTimestamp,
    onSnapshot,
    orderBy
} from "firebase/firestore";

// 🔥 QUAN TRỌNG: dùng db2 (Firebase myfocusapp)
import { db2 } from "@/config/firebaseConfig";

// 🔑 random code
const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// 📄 get rooms
export const getRooms = async () => {
    const snapshot = await getDocs(collection(db2, "rooms"));
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

// ➕ create room
export const createRoom = async (name: string, topic: string, user: any) => {
    const code = generateCode();

    const roomRef = await addDoc(collection(db2, "rooms"), {
        name,
        topic,
        code,
        owner: user.uid,
        createdAt: serverTimestamp() // 🔥 fix
    });

    await addDoc(collection(db2, "room_members"), {
        roomId: roomRef.id,
        userId: user.uid,
        name: user.name || user.email,
        status: "idle",
        remainingTime: 0,
        lastActive: serverTimestamp() // 🔥 fix
    });

    return {
        id: roomRef.id,
        name,
        topic,
        code,
        owner: user.uid
    };
};

// ❌ delete room
export const deleteRoom = async (roomId: string) => {
    await deleteDoc(doc(db2, "rooms", roomId));

    const members = await getDocs(
        query(collection(db2, "room_members"), where("roomId", "==", roomId))
    );

    members.forEach(async (d) => {
        await deleteDoc(doc(db2, "room_members", d.id));
    });

    const messages = await getDocs(
        query(collection(db2, "room_messages"), where("roomId", "==", roomId))
    );

    messages.forEach(async (d) => {
        await deleteDoc(doc(db2, "room_messages", d.id));
    });
};

// 🔑 join room
export const joinRoomByCode = async (code: string, user: any) => {
    const q = query(collection(db2, "rooms"), where("code", "==", code));
    const snapshot = await getDocs(q);

    if (snapshot.empty) throw new Error("Không tìm thấy phòng");

    const roomDoc = snapshot.docs[0];

    await addDoc(collection(db2, "room_members"), {
        roomId: roomDoc.id,
        userId: user.uid,
        name: user.name || user.email,
        status: "idle",
        remainingTime: 0,
        lastActive: serverTimestamp() // 🔥 fix
    });

    return {
        id: roomDoc.id,
        ...roomDoc.data()
    };
};

// 🚪 leave room
export const leaveRoom = async (roomId: string, userId: string) => {
    const q = query(
        collection(db2, "room_members"),
        where("roomId", "==", roomId),
        where("userId", "==", userId)
    );

    const snapshot = await getDocs(q);

    snapshot.forEach(async (d) => {
        await deleteDoc(doc(db2, "room_members", d.id));
    });
};

// 🔥 update status
export const updateUserStatus = async (
    roomId: string,
    userId: string,
    status: string,
    remainingTime: number
) => {
    const q = query(
        collection(db2, "room_members"),
        where("roomId", "==", roomId),
        where("userId", "==", userId)
    );

    const snapshot = await getDocs(q);

    snapshot.forEach(async (d) => {
        await updateDoc(doc(db2, "room_members", d.id), {
            status,
            remainingTime,
            lastActive: serverTimestamp() // 🔥 fix
        });
    });
};

// 👥 realtime members
export const listenRoomMembers = (roomId: string, callback: any) => {
    const q = query(
        collection(db2, "room_members"),
        where("roomId", "==", roomId)
    );

    return onSnapshot(q, (snapshot) => {
        const members = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(members);
    });
};

// 🔥 realtime COUNT
export const listenRoomCount = (roomId: string, callback: any) => {
    const q = query(
        collection(db2, "room_members"),
        where("roomId", "==", roomId)
    );

    return onSnapshot(q, (snapshot) => {
        callback(snapshot.size);
    });
};

// 💬 send message
export const sendMessage = async (
    roomId: string,
    userId: string,
    userName: string,
    text: string
) => {
    await addDoc(collection(db2, "room_messages"), {
        roomId,
        userId,
        userName,
        text,
        createdAt: serverTimestamp()
    });
};

// 💬 realtime messages
export const listenMessages = (roomId: string, callback: any) => {
    const q = query(
        collection(db2, "room_messages"),
        where("roomId", "==", roomId),
        orderBy("createdAt", "asc")
    );

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(messages);
    });
};