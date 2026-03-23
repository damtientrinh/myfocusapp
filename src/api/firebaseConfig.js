// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4s6PiT4jTAQRxNblA3zFZPufuVEbyzzA",
  authDomain: "focusapp-7f2a0.firebaseapp.com",
  projectId: "focusapp-7f2a0",
  storageBucket: "focusapp-7f2a0.firebasestorage.app",
  messagingSenderId: "858637487518",
  appId: "1:858637487518:web:bb9b99890bb5697ead9a8f",
  measurementId: "G-76XG9J63T8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);