
let dados = JSON.parse(localStorage.getItem("solar11") || "{}");
let chart;

function salvar(){
 localStorage.setItem("solar11", JSON.stringify(dados));
}

function salvarCliente(){
 const nome = cliente.value;
 dados[nome] = {
  consumo:Number(consumo.value),
  conta:Number(conta.value)
 };
 salvar();
 atualizarLista();
}

function atualizarLista(){
 lista.innerHTML="";
 Object.keys(dados).forEach(c=>{
  let o=document.createElement("option");
  o.textContent=c;
  lista.appendChild(o);
 });
}

function carregar(){
 const c=lista.value;
 const d=dados[c];

 const economiaMensal = d.conta * 0.9;
 const economiaAno = economiaMensal * 12;

 economia.innerText = "Economia anual estimada: R$ "+economiaAno.toFixed(2);
}

function gerarProposta(){
 const c=lista.value;
 const d=dados[c];
 const kit=Number(precoKit.value);
 const parc=Number(parcelas.value);

 const economiaMensal = d.conta * 0.9;
 const payback = kit / economiaMensal;

 roi.innerText = "Payback aproximado: "+payback.toFixed(1)+" meses";

 gerarGrafico(economiaMensal);

 const { jsPDF } = window.jspdf;
 const doc = new jsPDF();

 doc.text("PROPOSTA COMERCIAL - ESPECIALISTA SOLAR",20,20);
 doc.text("Cliente: "+c,20,40);
 doc.text("Consumo: "+d.consumo+" kWh",20,50);
 doc.text("Conta atual: R$ "+d.conta,20,60);
 doc.text("Kit: R$ "+kit,20,70);
 doc.text("Parcelas: "+parc,20,80);
 doc.text("Economia mensal: R$ "+economiaMensal.toFixed(2),20,90);
 doc.text("Payback: "+payback.toFixed(1)+" meses",20,100);

 doc.save(c+"_proposta.pdf");
}

function gerarGrafico(valor){
 const ctx=document.getElementById("grafico");
 if(chart) chart.destroy();

 chart=new Chart(ctx,{
  type:'bar',
  data:{
   labels:['Economia Mensal'],
   datasets:[{data:[valor]}]
  }
 });
}

atualizarLista();
