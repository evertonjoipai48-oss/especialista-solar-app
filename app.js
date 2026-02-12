
const kits=[{kwh:350,preco:10350},{kwh:450,preco:12000},{kwh:550,preco:13000},{kwh:600,preco:16990},{kwh:700,preco:18990},{kwh:800,preco:21990},{kwh:1000,preco:26990},{kwh:1200,preco:29990}];
let dados=JSON.parse(localStorage.getItem("solar122")||"[]");
let selecionado=null;

function salvar(){localStorage.setItem("solar122",JSON.stringify(dados));}

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

function selecionar(){
selecionado=lista.value;
const c=dados[selecionado];
const kit=kits.find(k=>c.consumo<=k.kwh)||kits[kits.length-1];
kitInfo.innerText="Kit sugerido: "+kit.kwh+" kWh - R$ "+kit.preco;
}

function mudarStatus(){dados[selecionado].status=prompt("Novo status:");salvar();atualizarLista();}
function excluir(){dados.splice(selecionado,1);salvar();atualizarLista();}

function gerarProposta(){
const c=dados[selecionado];
const kit=kits.find(k=>c.consumo<=k.kwh)||kits[kits.length-1];
const {jsPDF}=window.jspdf;const doc=new jsPDF();
doc.text("PROPOSTA ESPECIALISTA SOLAR",20,20);
doc.text("Cliente: "+c.nome,20,40);
doc.text("Kit: "+kit.kwh+" kWh - R$ "+kit.preco,20,50);
doc.save(c.nome+"_proposta.pdf");
}

atualizarLista();

let deferredPrompt;
window.addEventListener('beforeinstallprompt',(e)=>{
e.preventDefault();
deferredPrompt=e;
const btn=document.getElementById('installBtn');
btn.style.display='block';
btn.addEventListener('click',async()=>{btn.style.display='none';deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;});
});
