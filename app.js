

// 🔥 FIREBASE CDN
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


// ===============================
// CONFIG (SÓ AQUI NO TOPO)
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyCS9EtEe8ejzX3JecaXPGpzBdYE7mxzc3c",
  authDomain: "especialista-solar.firebaseapp.com",
  projectId: "especialista-solar",
  storageBucket: "especialista-solar.firebasestorage.app",
  messagingSenderId: "877584326662",
  appId: "1:877584326662:web:09d38d85139957bb70a387"
};


// ===============================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// ===============================



// ===== ELEMENTOS =====
const email = document.getElementById("email");
const senha = document.getElementById("senha");
const btnLogin = document.getElementById("btnLogin");
const logoutBtn = document.getElementById("logout");

const loginBox = document.getElementById("loginBox");
const appBox = document.getElementById("appBox");


// ===============================
// LOGIN
// ===============================
if(btnLogin){
  btnLogin.onclick = async () => {
    try{
      await signInWithEmailAndPassword(auth,email.value,senha.value);
    }catch{
      await createUserWithEmailAndPassword(auth,email.value,senha.value);
    }
  };
}


// ===============================
// LOGOUT
// ===============================
if(logoutBtn){
  logoutBtn.onclick = () => signOut(auth);
}


// ===============================
// REDIRECIONAMENTO AUTOMÁTICO
// ===============================
onAuthStateChanged(auth,(user)=>{

  if(user){
    console.log("Logado");

    if(loginBox) loginBox.style.display="none";
    if(appBox) appBox.style.display="block";

  }else{
    console.log("Deslogado");

    if(loginBox) loginBox.style.display="block";
    if(appBox) appBox.style.display="none";
  }

});
