
const kits = [
 {kwh:350, preco:10350},
 {kwh:450, preco:12000},
 {kwh:550, preco:13000},
 {kwh:600, preco:16990},
 {kwh:700, preco:18990},
 {kwh:800, preco:21990},
 {kwh:1000, preco:26990},
 {kwh:1200, preco:29990}
];

let dados = JSON.parse(localStorage.getItem("solar12")||"[]");
let selecionado = null;
let chart;

function salvar(){localStorage.setItem("solar12",JSON.stringify(dados));}

function addCliente(){
 dados.push({
  nome:nome.value,
  telefone:telefone.value,
  consumo:Number(consumo.value),
  status:status.value
 });
 salvar();
 atualizarLista();
}

function atualizarLista(){
 lista.innerHTML="";
 dados.forEach((c,i)=>{
  let o=document.createElement("option");
  o.textContent=c.nome+" | "+c.status;
  o.value=i;
  lista.appendChild(o);
 });
 atualizarDashboard();
}

function selecionar(){
 selecionado = lista.value;
 const c = dados[selecionado];

 const kit = kits.find(k=>c.consumo<=k.kwh) || kits[kits.length-1];

 kitInfo.innerText = "Kit sugerido: "+kit.kwh+" kWh - R$ "+kit.preco;
}

function mudarStatus(){
 dados[selecionado].status = prompt("Novo status:");
 salvar();
 atualizarLista();
}

function excluir(){
 dados.splice(selecionado,1);
 salvar();
 atualizarLista();
}

function gerarProposta(){
 const c=dados[selecionado];
 const kit = kits.find(k=>c.consumo<=k.kwh) || kits[kits.length-1];

 const economiaMensal = (c.consumo*0.9)*0.95;
 const payback = kit.preco/economiaMensal;

 const { jsPDF } = window.jspdf;
 const doc = new jsPDF();

 doc.text("PROPOSTA ESPECIALISTA SOLAR",20,20);
 doc.text("Cliente: "+c.nome,20,40);
 doc.text("Consumo: "+c.consumo+" kWh",20,50);
 doc.text("Kit: "+kit.kwh+" kWh - R$ "+kit.preco,20,60);
 doc.text("Parcelas: "+parcelas.value,20,70);
 doc.text("Economia mensal: R$ "+economiaMensal.toFixed(2),20,80);
 doc.text("Payback: "+payback.toFixed(1)+" meses",20,90);

 doc.save(c.nome+"_proposta.pdf");
}

function atualizarDashboard(){
 const total=dados.length;
 const fechados=dados.filter(c=>c.status=="Fechado").length;

 resumo.innerText = "Total clientes: "+total+" | Fechados: "+fechados;

 const ctx=document.getElementById("grafico");

 if(chart) chart.destroy();

 chart=new Chart(ctx,{
  type:'bar',
  data:{
   labels:["Leads","Fechados"],
   datasets:[{data:[total,fechados]}]
  }
 });
}

atualizarLista();
