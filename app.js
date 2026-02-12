
const kits=[
 {kwh:350,preco:10350},
 {kwh:450,preco:12000},
 {kwh:550,preco:13000},
 {kwh:600,preco:16990},
 {kwh:700,preco:18990}
];

let dados=JSON.parse(localStorage.getItem("solar13")||"[]");
let vendedorNome=localStorage.getItem("vendedor")||"";
let selecionado=null;

function salvar(){localStorage.setItem("solar13",JSON.stringify(dados));}

function salvarVendedor(){
 vendedorNome=vendedor.value;
 localStorage.setItem("vendedor",vendedorNome);
 usuarioAtual.innerText="Vendedor: "+vendedorNome;
 atualizarResumo();
}

function addCliente(){
 const kit=kits.find(k=>consumo.value<=k.kwh)||kits[kits.length-1];
 dados.push({
  vendedor:vendedorNome,
  nome:nome.value,
  telefone:telefone.value,
  consumo:Number(consumo.value),
  kit:kit.preco,
  status:status.value
 });
 salvar(); atualizarLista(); atualizarResumo();
}

function atualizarLista(){
 lista.innerHTML="";
 dados.forEach((c,i)=>{
  let o=document.createElement("option");
  o.textContent=c.nome+" | "+c.status+" | R$ "+c.kit;
  o.value=i;
  lista.appendChild(o);
 });
}

function selecionar(){selecionado=lista.value;}

function gerarProposta(){
 const c=dados[selecionado];
 const {jsPDF}=window.jspdf;
 const doc=new jsPDF();
 doc.text("PROPOSTA SOLAR",20,20);
 doc.text("Cliente: "+c.nome,20,40);
 doc.text("Valor kit: R$ "+c.kit,20,50);
 doc.save(c.nome+".pdf");
}

function exportarCSV(){
 let csv="Nome,Telefone,Consumo,Status,Valor\n";
 dados.forEach(c=>{
  csv+=`${c.nome},${c.telefone},${c.consumo},${c.status},${c.kit}\n`;
 });
 const blob=new Blob([csv]);
 const a=document.createElement("a");
 a.href=URL.createObjectURL(blob);
 a.download="clientes.csv";
 a.click();
}

function backup(){
 const blob=new Blob([JSON.stringify(dados)]);
 const a=document.createElement("a");
 a.href=URL.createObjectURL(blob);
 a.download="backup.json";
 a.click();
}

function atualizarResumo(){
 const fechados=dados.filter(c=>c.status=="Fechado" && c.vendedor==vendedorNome);
 const total=fechados.reduce((s,c)=>s+c.kit,0);
 const comissao=total*0.05;
 resumo.innerText="Vendas fechadas: R$ "+total+" | Comissão (5%): R$ "+comissao.toFixed(2);
}

atualizarLista();
if(vendedorNome) usuarioAtual.innerText="Vendedor: "+vendedorNome;

let deferredPrompt;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;});
installBtn.onclick=async()=>{
 if(!deferredPrompt) return alert("Já instalado!");
 deferredPrompt.prompt();
 await deferredPrompt.userChoice;
};
