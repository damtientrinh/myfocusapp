import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Xóa dòng import { getAuth } thừa ở đây
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
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

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export default app;