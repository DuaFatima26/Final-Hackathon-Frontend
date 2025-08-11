// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQW4P4CNWWSNnqZr33puVNeKaFHg3XjZs",
  authDomain: "final-hackathon-auth.firebaseapp.com",
  projectId: "final-hackathon-auth",
  storageBucket: "final-hackathon-auth.firebasestorage.app",
  messagingSenderId: "33427579200",
  appId: "1:33427579200:web:a9fc7f8ce66b7618ee5aa5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and export it
export const auth = getAuth(app);