// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "voice-of-gaza.firebaseapp.com",
  projectId: "voice-of-gaza",
  storageBucket: "voice-of-gaza.firebasestorage.app",
  messagingSenderId: "665565943678",
  appId: "1:665565943678:web:cfcd4817d2e088fcadc52f",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
