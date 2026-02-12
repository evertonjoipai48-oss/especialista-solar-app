
// ================= FIREBASE CDN =================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// SUA CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCS9EtEe8ejzX3JecaXPGpzBdYE7mxzc3c",
  authDomain: "especialista-solar.firebaseapp.com",
  projectId: "especialista-solar",
  storageBucket: "especialista-solar.firebasestorage.app",
  messagingSenderId: "877584326662",
  appId: "1:877584326662:web:09d38d85139957bb70a387"
};


// inicia UMA VEZ só
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
