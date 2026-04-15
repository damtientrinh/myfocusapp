import { initializeApp, getApp, getApps } from "firebase/app";
import { 
  getFirestore, 
  initializeFirestore, 
  memoryLocalCache, 
  persistentLocalCache 
} from "firebase/firestore";
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyB4s6PiT4jTAQRxNblA3zFZPufuVEbyzzA",
  authDomain: "focusapp-7f2a0.firebaseapp.com",
  projectId: "focusapp-7f2a0",
  storageBucket: "focusapp-7f2a0.firebasestorage.app",
  messagingSenderId: "858637487518",
  appId: "1:858637487518:web:bb9b99890bb5697ead9a8f",
  measurementId: "G-76XG9J63T8"
};

// 1. Khởi tạo Firebase App an toàn
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 2. Khởi tạo Auth với Persistence (Lưu trạng thái đăng nhập)
// Trong React Native, ta nên check kỹ để tránh lỗi "Auth has already been initialized"
let firebaseAuth;
try {
  firebaseAuth = getAuth(app);
} catch (e) {
  firebaseAuth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
}

// 3. Khởi tạo Firestore với cấu hình phù hợp cho Mobile
// Dùng cấu hình này để tránh lỗi "IndexedDB" thường gặp trên môi trường Web-polyfilled của React Native
let firestoreDb;
if (getApps().length > 0) {
    try {
        firestoreDb = initializeFirestore(app, {
            localCache: persistentLocalCache({}) // Tự động quản lý offline cache cho Mobile
        });
    } catch (e) {
        firestoreDb = getFirestore(app);
    }
} else {
    firestoreDb = getFirestore(app);
}

export const db = firestoreDb;
export const auth = firebaseAuth;
export default app;