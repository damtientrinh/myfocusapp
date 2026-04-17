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
    orderBy,
    writeBatch // Sử dụng Batch để xóa nhanh hơn
} from "firebase/firestore";

import { db } from "@/config/firebaseConfig";

const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const getRooms = async () => {
    // Sắp xếp phòng mới nhất lên đầu
    const q = query(collection(db, "rooms"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

export const createRoom = async (name: string, topic: string, user: any) => {
    const code = generateCode();
    const roomRef = await addDoc(collection(db, "rooms"), {
        name,
        topic,
        code,
        owner: user.uid,
        createdAt: serverTimestamp() 
    });

    // Tạo member đầu tiên chính là chủ phòng
    await addDoc(collection(db, "room_members"), {
        roomId: roomRef.id,
        userId: user.uid,
        name: user.name || user.email,
        status: "idle",
        remainingTime: 0,
        lastActive: serverTimestamp() 
    });

    return { id: roomRef.id, name, topic, code, owner: user.uid };
};

// Tối ưu xóa phòng bằng WriteBatch (Xóa hàng loạt tin nhắn/thành viên)
export const deleteRoom = async (roomId: string) => {
    const batch = writeBatch(db);
    
    // 1. Xóa document phòng
    batch.delete(doc(db, "rooms", roomId));

    // 2. Xóa tất cả thành viên
    const members = await getDocs(query(collection(db, "room_members"), where("roomId", "==", roomId)));
    members.forEach((d) => batch.delete(doc(db, "room_members", d.id)));

    // 3. Xóa tất cả tin nhắn
    const messages = await getDocs(query(collection(db, "room_messages"), where("roomId", "==", roomId)));
    messages.forEach((d) => batch.delete(doc(db, "room_messages", d.id)));

    await batch.commit();
};

export const joinRoomByCode = async (code: string, user: any) => {
    const q = query(collection(db, "rooms"), where("code", "==", code));
    const snapshot = await getDocs(q);

    if (snapshot.empty) throw new Error("Không tìm thấy phòng");
    const roomDoc = snapshot.docs[0];

    // Kiểm tra xem user đã ở trong phòng chưa để tránh trùng lặp
    const memberQ = query(
        collection(db, "room_members"), 
        where("roomId", "==", roomDoc.id), 
        where("userId", "==", user.uid)
    );
    const memberSnapshot = await getDocs(memberQ);

    if (memberSnapshot.empty) {
        await addDoc(collection(db, "room_members"), {
            roomId: roomDoc.id,
            userId: user.uid,
            name: user.name || user.email,
            status: "idle",
            remainingTime: 0,
            lastActive: serverTimestamp()
        });
    }

    return { id: roomDoc.id, ...roomDoc.data() };
};

export const leaveRoom = async (roomId: string, userId: string) => {
    const q = query(
        collection(db, "room_members"),
        where("roomId", "==", roomId),
        where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    snapshot.forEach((d) => batch.delete(doc(db, "room_members", d.id)));
    await batch.commit();
};

export const updateUserStatus = async (roomId: string, userId: string, status: string, remainingTime: number) => {
    const q = query(
        collection(db, "room_members"),
        where("roomId", "==", roomId),
        where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
        await updateDoc(doc(db, "room_members", snapshot.docs[0].id), {
            status,
            remainingTime,
            lastActive: serverTimestamp()
        });
    }
};

export const listenRoomMembers = (roomId: string, callback: (data: any[]) => void) => {
    const q = query(collection(db, "room_members"), where("roomId", "==", roomId));
    return onSnapshot(q, (snapshot) => {
        callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
};

export const listenRoomCount = (roomId: string, callback: (count: number) => void) => {
    const q = query(collection(db, "room_members"), where("roomId", "==", roomId));
    return onSnapshot(q, (snapshot) => callback(snapshot.size));
};

export const sendMessage = async (roomId: string, userId: string, userName: string, text: string) => {
    await addDoc(collection(db, "room_messages"), {
        roomId,
        userId,
        userName,
        text,
        createdAt: serverTimestamp()
    });
};

export const listenMessages = (roomId: string, callback: (data: any[]) => void) => {
    const q = query(
        collection(db, "room_messages"),
        where("roomId", "==", roomId),
        orderBy("createdAt", "asc")
    );

    return onSnapshot(q, (snapshot) => {
        // Tránh lỗi khi serverTimestamp chưa kịp phản hồi (vẫn là null)
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(messages);
    }, (error) => {
        console.error("Listen Messages Error:", error);
    });
};