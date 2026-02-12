
let dados = JSON.parse(localStorage.getItem("solarDados10") || "{}");
let chart;

const SENHA_PADRAO = "1234";

function login(){
  if(senha.value === SENHA_PADRAO){
    document.getElementById("app").style.display="block";
    senha.parentElement.style.display="none";
    atualizarClientes();
  } else {
    alert("Senha incorreta");
  }
}

function salvar(){
  localStorage.setItem("solarDados10", JSON.stringify(dados));
}

function addCliente(){
  const nome = clienteNome.value.trim();
  if(!nome) return;

  if(!dados[nome]) dados[nome] = [];

  clienteNome.value="";
  salvar();
  atualizarClientes();
}

function atualizarClientes(){
  clienteSelect.innerHTML="";
  Object.keys(dados).forEach(c=>{
    let o=document.createElement("option");
    o.textContent=c;
    clienteSelect.appendChild(o);
  });
}

function addRegistro(){
  const c = clienteSelect.value;
  if(!c) return;

  dados[c].push({
    mes:mes.value,
    kwh:Number(kwh.value),
    valor:Number(valor.value)
  });

  mes.value=""; kwh.value=""; valor.value="";

  salvar();
  atualizarGrafico();
}

function atualizarGrafico(){
  const c = clienteSelect.value;
  if(!c) return;

  const labels = dados[c].map(r=>r.mes);
  const valores = dados[c].map(r=>r.kwh);

  const ctx=document.getElementById("grafico");

  if(chart) chart.destroy();

  chart=new Chart(ctx,{
    type:'line',
    data:{
      labels:labels,
      datasets:[{
        label:'Produção kWh',
        data:valores
      }]
    }
  });
}

function exportarCSV(){
  const c=clienteSelect.value;
  if(!c) return;

  let csv="Mes,kWh,Valor(R$)\n";
  dados[c].forEach(r=> csv+=`${r.mes},${r.kwh},${r.valor}\n`);

  const blob=new Blob([csv]);
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download=c+".csv";
  a.click();
}

function gerarPDF(){
  const c=clienteSelect.value;
  if(!c) return;

  const { jsPDF } = window.jspdf;
  const doc=new jsPDF();

  doc.text("Relatório Solar - "+c,20,20);

  let y=40;
  dados[c].forEach(r=>{
    doc.text(`${r.mes} - ${r.kwh} kWh - R$ ${r.valor}`,20,y);
    y+=10;
  });

  doc.save(c+"_relatorio.pdf");
}

function limparDados(){
  const c=clienteSelect.value;
  if(!c) return;

  if(confirm("Excluir cliente?")){
    delete dados[c];
    salvar();
    atualizarClientes();
    if(chart) chart.destroy();
  }
}
