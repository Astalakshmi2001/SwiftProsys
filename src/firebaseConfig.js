// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2yM8_sZFGu-R1Nfk3UGiQgDLsnbYgexM",
  authDomain: "swiftprosyshrms-4ed2d.firebaseapp.com",
  projectId: "swiftprosyshrms-4ed2d",
  storageBucket: "swiftprosyshrms-4ed2d.firebasestorage.app",
  messagingSenderId: "582845964031",
  appId: "1:582845964031:web:ba5f277d5639764bd176ca",
  measurementId: "G-5HB53553J4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);