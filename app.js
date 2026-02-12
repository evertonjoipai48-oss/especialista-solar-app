// 🔥 FIREBASE 10 (CDN)
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


// ===== CONFIG DO SEU PROJETO =====
const firebaseConfig = {
  apiKey: "AIzaSyCS9EtEe8ejzX3JecaXPGpzBdYE7mxzc3c",
  authDomain: "especialista-solar.firebaseapp.com",
  projectId: "especialista-solar",
  storageBucket: "especialista-solar.firebasestorage.app",
  messagingSenderId: "877584326662",
  appId: "1:877584326662:web:09d38d85139957bb70a387"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// ===== LOGIN =====
const email = document.getElementById("email");
const senha = document.getElementById("senha");
const btnLogin = document.getElementById("btnLogin");
const logout = document.getElementById("logout");

if(btnLogin){
  btnLogin.onclick = async ()=>{
    try{
      await signInWithEmailAndPassword(auth,email.value,senha.value);
    }catch{
      await createUserWithEmailAndPassword(auth,email.value,senha.value);
    }
  };
}

if(logout){
  logout.onclick = ()=>signOut(auth);
}


// ===== REDIRECIONA =====
onAuthStateChanged(auth,(user)=>{
  if(user){
    if(location.pathname.includes("index.html") || location.pathname.endsWith("/")){
      window.location.href="painel.html";
    }
  }else{
    if(location.pathname.includes("painel.html")){
      window.location.href="index.html";
    }
  }
});


// ===== PAINEL =====
let dados = {};
let usuario = null;

const clienteNome = document.getElementById("clienteNome");
const addCliente = document.getElementById("addCliente");
const clientesSelect = document.getElementById("clientesSelect");
const mes = document.getElementById("mes");
const producao = document.getElementById("producao");
const tarifa = document.getElementById("tarifa");
const salvarMes = document.getElementById("salvarMes");
const tabela = document.getElementById("tabela");
const totalReceita = document.getElementById("totalReceita");
const grafico = document.getElementById("grafico");

let chart=null;


onAuthStateChanged(auth, async(user)=>{
  if(!user || !clientesSelect) return;

  usuario = user.uid;

  const snap = await getDoc(doc(db,"usuarios",usuario));
  dados = snap.exists()? snap.data():{};
  atualizarClientes();
});


async function salvarNuvem(){
  await setDoc(doc(db,"usuarios",usuario),dados);
}


// adicionar cliente
if(addCliente){
  addCliente.onclick = ()=>{
    if(!dados[clienteNome.value])
      dados[clienteNome.value]=[];

    atualizarClientes();
    salvarNuvem();
  };
}


function atualizarClientes(){
  if(!clientesSelect) return;

  clientesSelect.innerHTML="";
  Object.keys(dados).forEach(c=>{
    const o=document.createElement("option");
    o.text=c;
    clientesSelect.appendChild(o);
  });

  atualizarPainel();
}


// salvar mês
if(salvarMes){
  salvarMes.onclick = ()=>{
    const c = clientesSelect.value;

    const receita=(producao.value*tarifa.value).toFixed(2);

    dados[c].push({
      mes:mes.value,
      receita
    });

    salvarNuvem();
    atualizarPainel();
  };
}


function atualizarPainel(){
  if(!clientesSelect) return;

  const lista=dados[clientesSelect.value]||[];

  let total=0;
  let labels=[];
  let valores=[];

  tabela.innerHTML="<tr><th>Mês</th><th>Receita</th></tr>";

  lista.forEach(l=>{
    tabela.innerHTML+=`<tr><td>${l.mes}</td><td>R$ ${l.receita}</td></tr>`;
    total+=Number(l.receita);
    labels.push(l.mes);
    valores.push(l.receita);
  });

  totalReceita.innerText="Receita total: R$ "+total.toFixed(2);

  if(chart) chart.destroy();

  chart=new Chart(grafico,{
    type:"line",
    data:{labels,datasets:[{label:"Receita",data:valores}]}
  });
}

