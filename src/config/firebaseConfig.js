import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// ================= 🔵 FIREBASE 1 (ENV) =================
const config1 = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};


// ================= 🔴 FIREBASE 2 (CỐ ĐỊNH) =================
const config2 = {
    apiKey: "AIzaSyCxeXrS-rVgJsUJlV7Nk-GGzCUWFwjemNA",
    authDomain: "myfocusapp-821f2.firebaseapp.com",
    projectId: "myfocusapp-821f2",
    storageBucket: "myfocusapp-821f2.firebasestorage.app",
    messagingSenderId: "90776487230",
    appId: "1:90776487230:web:793b7fd1d688b7387f186f",
};


// ================= 🚀 INIT APPS =================
const app1 = getApps().find(app => app.name === "app1")
    || initializeApp(config1, "app1");

const app2 = getApps().find(app => app.name === "app2")
    || initializeApp(config2, "app2");


// ================= 🔐 AUTH =================
export const auth1 = initializeAuth(app1, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const auth2 = initializeAuth(app2, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});


// ================= 🗄️ FIRESTORE =================
export const db1 = getFirestore(app1); // Firebase ENV
export const db2 = getFirestore(app2); // Firebase myfocusapp


// ================= 🎯 DEFAULT (QUAN TRỌNG) =================
// 👉 CHỌN FIREBASE BẠN MUỐN DÙNG CHÍNH
export const db = db1;     // 🔥 ĐỔI CHỖ NÀY nếu cần
export const auth = auth1; // 🔥 ĐỔI CHỖ NÀY nếu cần