// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvBWrDfsZJ6WjiBYfHgEhzTSn3JqnzIw8",
  authDomain: "swiftprosyshrm.firebaseapp.com",
  projectId: "swiftprosyshrm",
  storageBucket: "swiftprosyshrm.firebasestorage.app",
  messagingSenderId: "1022656849039",
  appId: "1:1022656849039:web:27fc38f9c296850f877cfa",
  measurementId: "G-9XQS6020ZN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);