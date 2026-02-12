
// ======= COLE AQUI SUAS CHAVES FIREBASE =======
const firebaseConfig = {
  apiKey: "AIzaSyXXXXX",
  authDomain: "especialista-solar.firebaseapp.com",
  projectId: "especialista-solar",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

// =============================================

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let user;

// PWA instalar
let deferredPrompt;
window.addEventListener("beforeinstallprompt",(e)=>{
  e.preventDefault();
  deferredPrompt=e;
  installBtn.style.display="block";
});
installBtn.onclick=()=>deferredPrompt.prompt();

// LOGIN
function login(){
 auth.signInWithEmailAndPassword(email.value,senha.value)
 .catch(()=>auth.createUserWithEmailAndPassword(email.value,senha.value));
}

function logout(){auth.signOut();}

auth.onAuthStateChanged(async u=>{
 if(!u) return;
 user=u;
 loginBox.classList.add("hidden");
 app.classList.remove("hidden");
 userName.innerText="👤 "+u.email;
 carregar();
});

// SALVAR LEAD
async function salvarLead(){
 await db.collection("vendas").add({
  vendedor:user.email,
  nome:nome.value,
  valor:Number(valor.value),
  data:new Date()
 });
 nome.value="";
 valor.value="";
 carregar();
}

// META
async function salvarMeta(){
 await db.collection("config").doc(user.email).set({
  meta:Number(metaValor.value)
 });
 carregar();
}

// COMISSÃO
async function salvarComissao(){
 await db.collection("config").doc(user.email).set({
  perc:Number(perc.value)
 },{merge:true});
 carregar();
}

// DASHBOARD
async function carregar(){

 const vendas = await db.collection("vendas").where("vendedor","==",user.email).get();

 let total=0;
 vendas.forEach(v=> total+=v.data().valor);

 const conf = await db.collection("config").doc(user.email).get();

 const meta = conf.data()?.meta||0;
 const perc = conf.data()?.perc||5;

 const comissao = total*(perc/100);

 resumo.innerText=
  "Vendas: R$ "+total.toFixed(2)+" | Comissão: R$ "+comissao.toFixed(2);

 metaInfo.innerText="Meta: R$ "+meta;
 comissaoInfo.innerText="Comissão: "+perc+"%";

 // ADMIN
 if(user.email.includes("admin")){
  adminBox.style.display="block";
  const all = await db.collection("vendas").get();
  let empresa=0;
  all.forEach(v=>empresa+=v.data().valor);
  totalEmpresa.innerText="R$ "+empresa.toFixed(2);
 }else{
  adminBox.style.display="none";
 }
}const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "..."
}

