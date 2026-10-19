// home.js — página inicial: pede a info do ginásio à API e preenche a página.

async function carregarGinasio() {
  try {
    const info = await apiFetch("/ginasio");

    document.getElementById("nome-ginasio").textContent = info.nome;
    document.getElementById("info-morada").textContent = info.morada;
    document.getElementById("info-horarios").textContent = info.horarios;
    document.getElementById("info-contacto").textContent = info.contacto;

    const lista = document.getElementById("info-modalidades");
    lista.innerHTML = "";
    info.modalidades.forEach((m) => {
      const li = document.createElement("li");
      li.textContent = m;
      lista.appendChild(li);
    });
  } catch (erro) {
    console.error("Não foi possível ligar ao backend:", erro);
  }
}

document.addEventListener("DOMContentLoaded", carregarGinasio);
