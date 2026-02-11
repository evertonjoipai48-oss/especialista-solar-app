
let dados = JSON.parse(localStorage.getItem("solarDados") || "[]");

function salvar(){
  let mes = document.getElementById("mes").value;
  let p = Number(document.getElementById("producao").value);
  let c = Number(document.getElementById("consumo").value);
  let t = Number(document.getElementById("tarifa").value);

  let economia = (p*t).toFixed(2);

  dados.push({mes,p,c,t,economia});
  localStorage.setItem("solarDados", JSON.stringify(dados));

  atualizar();
}

function atualizar(){
  let tabela = document.getElementById("tabela");
  tabela.innerHTML = "<tr><th>Mês</th><th>Prod</th><th>Cons</th><th>Eco R$</th></tr>";

  let labels=[], prod=[], cons=[];
  let totalEco = 0;

  dados.forEach(d=>{
    tabela.innerHTML += `<tr><td>${d.mes}</td><td>${d.p}</td><td>${d.c}</td><td>${d.economia}</td></tr>`;
    labels.push(d.mes);
    prod.push(d.p);
    cons.push(d.c);
    totalEco += Number(d.economia);
  });

  document.getElementById("resumo").innerText = "Economia total: R$ "+totalEco.toFixed(2);

  new Chart(document.getElementById("grafico"), {
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
  let texto = document.getElementById("resumo").innerText;
  window.open("https://wa.me/5566992545753?text="+encodeURIComponent(texto));
}

atualizar();
