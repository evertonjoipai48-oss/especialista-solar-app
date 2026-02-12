// ===== CONFIGURE AQUI SUA CONTA FIREBASE =====
const firebaseConfig = {
  apiKey: "COLE_SUA_API_KEY_AQUI",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO"
};

// Carrega Firebase CDN
const s1=document.createElement('script');
s1.src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js";
document.head.appendChild(s1);

const s2=document.createElement('script');
s2.src="https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js";
document.head.appendChild(s2);

s2.onload=()=>{

 firebase.initializeApp(firebaseConfig);
 const db=firebase.firestore();

 const lista=document.getElementById("lista");

 window.addCliente=()=>{
  db.collection("clientes").add({
    nome:nome.value,
    telefone:telefone.value,
    consumo:consumo.value,
    status:status.value,
    criado:Date.now()
  });
 };

 db.collection("clientes").orderBy("criado","desc")
 .onSnapshot(snapshot=>{
   lista.innerHTML="";
   snapshot.forEach(doc=>{
     const c=doc.data();
     const li=document.createElement("li");
     li.innerText=c.nome+" - "+c.status;
     lista.appendChild(li);
   });
 });

};

// PWA install
let promptEvent;
window.addEventListener("beforeinstallprompt",(e)=>{
 e.preventDefault();
 promptEvent=e;
 document.getElementById("installBtn").onclick=()=>promptEvent.prompt();
});

if("serviceWorker" in navigator){
 navigator.serviceWorker.register("sw.js");
}
