

// ======== CONFIGURE AQUI COM SEU FIREBASE ========
const firebaseConfig = {
  apiKey: "COLOQUE_SUA_APIKEY",
  authDomain: "SEU_DOMINIO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
};
// ================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let usuario = null;
let dados = {};
let chart = null;

// login
document.getElementById("btnLogin").onclick = async ()=>{
  const email = emailInput.value;
  const senha = senhaInput.value;

  try{
    await signInWithEmailAndPassword(auth,email,senha);
  }catch{
    await createUserWithEmailAndPassword(auth,email,senha);
  }
};

document.getElementById("logout").onclick = ()=>signOut(auth);

const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");

onAuthStateChanged(auth, async (user)=>{
  if(user){
    usuario = user.uid;
    loginBox.style.display="none";
    appBox.style.display="block";
    await carregar();
  }else{
    loginBox.style.display="block";
    appBox.style.display="none";
  }
});

async function carregar(){
  const ref = doc(db,"usuarios",usuario);
  const snap = await getDoc(ref);
  dados = snap.exists() ? snap.data() : {};
  atualizarClientes();
}

async function salvarNuvem(){
  await setDoc(doc(db,"usuarios",usuario),dados);
}

// clientes
addCliente.onclick = ()=>{
  const nome = clienteNome.value;
  if(!dados[nome]) dados[nome]=[];
  atualizarClientes();
  salvarNuvem();
};

function atualizarClientes(){
  clientesSelect.innerHTML="";
  Object.keys(dados).forEach(c=>{
    const o=document.createElement("option");
    o.text=c;
    clientesSelect.appendChild(o);
  });
}

salvar.onclick = ()=>{
  const c = clientesSelect.value;
  const mes = mesInput.value;
  const prod = Number(producao.value);
  const tarifa = Number(tarifaInput.value);

  const receita = (prod*tarifa).toFixed(2);

  dados[c].push({mes,prod,receita});
  salvarNuvem();
  atualizarPainel();
};

const mesInput = document.getElementById("mes");
const producao = document.getElementById("producao");
const tarifaInput = document.getElementById("tarifa");

function atualizarPainel(){

  const c = clientesSelect.value;
  const lista = dados[c] || [];

  let total=0;
  let labels=[], valores=[];

  tabela.innerHTML="<tr><th>Mês</th><th>Receita</th></tr>";

  lista.forEach(l=>{
    tabela.innerHTML+=`<tr><td>${l.mes}</td><td>${l.receita}</td></tr>`;
    total+=Number(l.receita);
    labels.push(l.mes);
    valores.push(l.receita);
  });

  totalReceita.innerText="Receita total: R$ "+total.toFixed(2);

  if(chart) chart.destroy();

  chart=new Chart(graficoFinanceiro,{
    type:'line',
    data:{labels,datasets:[{label:'Receita',data:valores}]}
  });
}

clientesSelect.onchange = atualizarPainel;

