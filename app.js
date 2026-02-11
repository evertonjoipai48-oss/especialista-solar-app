
let dados = JSON.parse(localStorage.getItem("solarDados") || "[]");
let chart = null;

async function lerPDF(){
  const file = document.getElementById("pdfInput").files[0];
  if(!file) return alert("Selecione o PDF");

  const reader = new FileReader();

  reader.onload = async function(){
    const typedarray = new Uint8Array(this.result);
    const pdf = await pdfjsLib.getDocument(typedarray).promise;

    let textoCompleto = "";

    for(let i=1;i<=pdf.numPages;i++){
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map(i=>i.str);
      textoCompleto += strings.join(" ");
    }

    autoPreencher(textoCompleto);
  };

  reader.readAsArrayBuffer(file);
}

function autoPreencher(texto){

  // tenta capturar números grandes típicos da Energisa
  let nums = texto.match(/\d{3,5}[\.,]?\d*/g);

  if(!nums) return alert("Não consegui detectar números automaticamente. Preencha manual.");

  // heurística simples
  document.getElementById("consumo").value = nums[0];
  document.getElementById("producao").value = nums[1];
}

function salvar(){
  let mes = document.getElementById("mes").value;
  let p = Number(document.getElementById("producao").value);
  let c = Number(document.getElementById("consumo").value);
  let t = Number(document.getElementById("tarifa").value);

  let eco = (p*t).toFixed(2);

  dados.push({mes,p,c,eco});
  localStorage.setItem("solarDados", JSON.stringify(dados));

  atualizar();
}

function atualizar(){
  let tabela = document.getElementById("tabela");
  tabela.innerHTML = "<tr><th>Mês</th><th>Produção</th><th>Consumo</th><th>Economia</th></tr>";

  let labels=[], prod=[], cons=[];
  let total = 0;

  dados.forEach(d=>{
    tabela.innerHTML += `<tr><td>${d.mes}</td><td>${d.p}</td><td>${d.c}</td><td>${d.eco}</td></tr>`;
    labels.push(d.mes);
    prod.push(d.p);
    cons.push(d.c);
    total += Number(d.eco);
  });

  document.getElementById("resumo").innerText = "Economia acumulada: R$ " + total.toFixed(2);

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
  let msg = document.getElementById("resumo").innerText;
  window.open("https://wa.me/5566992545753?text="+encodeURIComponent(msg));
}

atualizar();
