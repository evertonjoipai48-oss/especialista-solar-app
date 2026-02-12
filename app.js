
const kits=[{kwh:350,preco:10350},{kwh:450,preco:12000},{kwh:550,preco:13000},{kwh:600,preco:16990}];
let dados=JSON.parse(localStorage.getItem("solar123")||"[]");
let selecionado=null;

function salvar(){localStorage.setItem("solar123",JSON.stringify(dados));}

function addCliente(){
dados.push({nome:nome.value,telefone:telefone.value,consumo:Number(consumo.value),status:status.value});
salvar();atualizarLista();
}

function atualizarLista(){
lista.innerHTML="";
dados.forEach((c,i)=>{
let o=document.createElement("option");
o.textContent=c.nome+" | "+c.status;o.value=i;lista.appendChild(o);
});
}

function selecionar(){selecionado=lista.value;}

function gerarProposta(){
const c=dados[selecionado];
const {jsPDF}=window.jspdf;
const doc=new jsPDF();
doc.text("PROPOSTA ESPECIALISTA SOLAR",20,20);
doc.text("Cliente: "+c.nome,20,40);
doc.save(c.nome+"_proposta.pdf");
}

atualizarLista();

let deferredPrompt;

window.addEventListener('beforeinstallprompt',(e)=>{
e.preventDefault();
deferredPrompt=e;
});

document.getElementById("installBtn").addEventListener("click",async()=>{
if(!deferredPrompt){alert("App já instalado ou navegador não suportado");return;}
deferredPrompt.prompt();
await deferredPrompt.userChoice;
deferredPrompt=null;
});
