// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbZgYCUT3mOHY7DnFJJrODCZYnsnQdoFA",
  authDomain: "swiftprosyshrms.firebaseapp.com",
  projectId: "swiftprosyshrms",
  storageBucket: "swiftprosyshrms.firebasestorage.app",
  messagingSenderId: "570342230026",
  appId: "1:570342230026:web:e424ae6d210af995f7f7f3",
  measurementId: "G-P2QR7NCJK7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);