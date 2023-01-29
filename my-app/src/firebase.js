// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6AwwL9Xb2XmZr9ZaT5iHf6-F7R45WGLo",
  authDomain: "lingoshare-local.firebaseapp.com",
  databaseURL: "https://lingoshare-local-default-rtdb.firebaseio.com",
  projectId: "lingoshare-local",
  storageBucket: "lingoshare-local.appspot.com",
  messagingSenderId: "270821606445",
  appId: "1:270821606445:web:ee8cac07d7631b82e064a4",
  measurementId: "G-4PXSDQM6MP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const auth = getAuth(app);