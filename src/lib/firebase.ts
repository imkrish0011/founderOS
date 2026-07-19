import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRaJ7NrhqJCWKc6E8S_1oStNpu4-M5OL4",
  authDomain: "founderos-208e7.firebaseapp.com",
  projectId: "founderos-208e7",
  storageBucket: "founderos-208e7.firebasestorage.app",
  messagingSenderId: "636806653730",
  appId: "1:636806653730:web:d8d6ade2e450c168c3677b",
  measurementId: "G-FN7H16Z9PD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// The hidden email used for authenticating the owner
export const OWNER_EMAIL = "krish@founderos.local";

export { auth, db, signInWithEmailAndPassword, onAuthStateChanged, signOut };
