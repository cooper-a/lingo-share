// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFx_-31EoGSolWhmwWaTYXyMHEkc8SnAM",
  authDomain: "auth-crud-1da7a.firebaseapp.com",
  projectId: "auth-crud-1da7a",
  storageBucket: "auth-crud-1da7a.appspot.com",
  messagingSenderId: "435547833299",
  appId: "1:435547833299:web:b82ef1852ca341d227e526",
  measurementId: "G-TYPS66XQG7"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const functions = getFunctions(app);
connectFunctionsEmulator(functions, "localhost", 5001);

// Export
export const get_token = httpsCallable(functions, 'get_token');
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const auth = getAuth(app);
