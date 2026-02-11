
function calcular(){
  let p = Number(document.getElementById("producao").value);
  let c = Number(document.getElementById("consumo").value);
  let t = Number(document.getElementById("tarifa").value);

  let economia = p*t;
  let excedente = p-c;

  let texto = `Produção: ${p} kWh
Consumo: ${c} kWh
Excedente: ${excedente} kWh
Economia estimada: R$ ${economia.toFixed(2)}`;

  document.getElementById("resumo").innerText = texto;
  document.getElementById("resultado").style.display="block";
}

function whatsapp(){
  let msg = document.getElementById("resumo").innerText;
  window.open("https://wa.me/5566992545753?text="+encodeURIComponent(msg));
}

function baixarPDF(){
  window.print();
}
