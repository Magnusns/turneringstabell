// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDUxsHrubxBcZZ0KV1ua5qcHPSohHTElo",
  authDomain: "golf-scoreboard-tabell.firebaseapp.com",
  projectId: "golf-scoreboard-tabell",
  storageBucket: "golf-scoreboard-tabell.firebasestorage.app",
  messagingSenderId: "707399688092",
  appId: "1:707399688092:web:54d83b9af44e350f1cf259",
  measurementId: "G-NZ6EX1EX2W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };