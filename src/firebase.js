import { getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "checkscroe.firebaseapp.com",
  projectId: "checkscroe",
  storageBucket: "checkscroe.firebasestorage.app",
  messagingSenderId: "335127948693",
  appId: "1:335127948693:web:cc1a0384f9b5ca6757da9c",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = firebase.firestore();
export default firebase;
export { db };
export const storage = getStorage(app);
