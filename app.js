let dados = JSON.parse(localStorage.getItem("solarDados") || "{}");
let chart;

function salvar(){
  localStorage.setItem("solarDados", JSON.stringify(dados));
}

function addCliente(){
  const nome = clienteNome.value.trim();
  if(!nome) return;
  if(!dados[nome]) dados[nome] = [];
  clienteNome.value="";
  atualizarClientes();
  salvar();
}

function atualizarClientes(){
  clienteSelect.innerHTML="";
  Object.keys(dados).forEach(c=>{
    let o=document.createElement("option");
    o.textContent=c;
    clienteSelect.appendChild(o);
  });
  atualizarGrafico();
}

function addRegistro(){
  const c = clienteSelect.value;
  if(!c) return;
  const m = mes.value;
  const k = Number(kwh.value);

  dados[c].push({mes:m,kwh:k});
  salvar();
  atualizarGrafico();
}

function atualizarGrafico(){
  const c = clienteSelect.value;
  if(!c) return;

  const labels = dados[c].map(x=>x.mes);
  const valores = dados[c].map(x=>x.kwh);

  const ctx = document.getElementById("grafico");

  if(chart) chart.destroy();

  chart = new Chart(ctx, {
    type:'bar',
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
  const c = clienteSelect.value;
  if(!c) return;

  let csv = "Mes,kWh\n";
  dados[c].forEach(r=> csv+=`${r.mes},${r.kwh}\n`);

  const blob = new Blob([csv]);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = c+".csv";
  a.click();
}

atualizarClientes();
