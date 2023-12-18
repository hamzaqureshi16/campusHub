// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeYVOwdjpis-qq-mtxFkKINMD5tKUmA1k",
  authDomain: "campushub-4e727.firebaseapp.com",
  projectId: "campushub-4e727",
  storageBucket: "campushub-4e727.appspot.com",
  messagingSenderId: "885001720422",
  appId: "1:885001720422:web:bc7c5d4255c669f08d53a7",
};

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);

export const auth = getAuth(firebase);
