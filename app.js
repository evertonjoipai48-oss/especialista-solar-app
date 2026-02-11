
let db = JSON.parse(localStorage.getItem("solarClientes") || "{}");
let clienteAtual = null;
let chart = null;

function salvarDB(){
  localStorage.setItem("solarClientes", JSON.stringify(db));
}

function criarCliente(){
  const nome = document.getElementById("clienteNome").value;
  if(!nome) return;

  if(!db[nome]) db[nome] = [];

  clienteAtual = nome;
  atualizarClientes();
  atualizarTela();
  salvarDB();
}

function atualizarClientes(){
  const sel = document.getElementById("clientesSelect");
  sel.innerHTML = "";

  Object.keys(db).forEach(c=>{
    let opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    sel.appendChild(opt);
  });

  sel.value = clienteAtual;
}

function trocarCliente(){
  clienteAtual = document.getElementById("clientesSelect").value;
  atualizarTela();
}

async function lerPDF(){
  const file = document.getElementById("pdfInput").files[0];
  if(!file) return;

  const reader = new FileReader();

  reader.onload = async function(){
    const typedarray = new Uint8Array(this.result);
    const pdf = await pdfjsLib.getDocument(typedarray).promise;

    let texto="";

    for(let i=1;i<=pdf.numPages;i++){
      let page = await pdf.getPage(i);
      let content = await page.getTextContent();
      texto += content.items.map(i=>i.str).join(" ");
    }

    let nums = texto.match(/\d{3,5}[\.,]?\d*/g);
    if(nums){
      document.getElementById("consumo").value = nums[0];
      document.getElementById("producao").value = nums[1];
    }
  };

  reader.readAsArrayBuffer(file);
}

function salvarMes(){
  if(!clienteAtual) return alert("Crie um cliente primeiro");

  let mes = document.getElementById("mes").value;
  let p = Number(document.getElementById("producao").value);
  let c = Number(document.getElementById("consumo").value);
  let t = Number(document.getElementById("tarifa").value);

  let eco = (p*t).toFixed(2);

  db[clienteAtual].push({mes,p,c,eco});

  salvarDB();
  atualizarTela();
}

function atualizarTela(){

  if(!clienteAtual) return;

  const dados = db[clienteAtual];

  let tabela = document.getElementById("tabela");
  tabela.innerHTML = "<tr><th>Mês</th><th>Prod</th><th>Cons</th><th>Eco R$</th></tr>";

  let labels=[], prod=[], cons=[];
  let total=0;

  dados.forEach(d=>{
    tabela.innerHTML += `<tr><td>${d.mes}</td><td>${d.p}</td><td>${d.c}</td><td>${d.eco}</td></tr>`;
    labels.push(d.mes);
    prod.push(d.p);
    cons.push(d.c);
    total+=Number(d.eco);
  });

  document.getElementById("resumo").innerText="Economia acumulada: R$ "+total.toFixed(2);

  if(chart) chart.destroy();

  chart = new Chart(document.getElementById("grafico"), {
    type:'bar',
    data:{
      labels:labels,
      datasets:[
        {label:'Produção', data:prod},
        {label:'Consumo', data:cons}
      ]
    }
  });
}

function enviarWhats(){
  let msg = document.getElementById("resumo").innerText + " - Cliente: " + clienteAtual;
  window.open("https://wa.me/5566992545753?text="+encodeURIComponent(msg));
}

atualizarClientes();
