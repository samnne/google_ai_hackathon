// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCuDytcMDU1z65484rEU-y076yWT6i9jf4",
  authDomain: "hackathongai.firebaseapp.com",
  databaseURL: "https://hackathongai-default-rtdb.firebaseio.com",
  projectId: "hackathongai",
  storageBucket: "hackathongai.firebasestorage.app",
  messagingSenderId: "530117119713",
  appId: "1:530117119713:web:322716170bf666f1e771a0",
  measurementId: "G-D2VXSFCJZK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
