// admin-form.js — mesmo formulário serve para criar uma aula nova (sem "id" no URL)
// e para editar uma existente (com "id" no URL, ex: admin-form.html?id=3).

const params = new URLSearchParams(window.location.search);
const aulaId = params.get("id"); // null quando é uma aula nova

async function carregarDadosSeEdicao() {
  if (!getToken() || !isAdmin()) {
    window.location.href = "index.html";
    return;
  }
  if (!aulaId) return; // criar aula nova: formulário fica vazio

  document.getElementById("titulo-form").textContent = "Editar aula";
  try {
    const aula = await apiFetch(`/admin/aulas/${aulaId}`);
    document.getElementById("nome").value = aula.nome;
    document.getElementById("tipo").value = aula.tipo;
    document.getElementById("instrutor").value = aula.instrutor;
    document.getElementById("sala").value = aula.sala;
    document.getElementById("dia_semana").value = aula.dia_semana;
    document.getElementById("horario").value = aula.horario;
    document.getElementById("vagas_totais").value = aula.vagas_totais;
  } catch (erro) {
    mostrarMensagem(erro.message, "erro");
  }
}

document.getElementById("form-aula").addEventListener("submit", async (e) => {
  e.preventDefault();

  const corpo = {
    nome: document.getElementById("nome").value,
    tipo: document.getElementById("tipo").value,
    instrutor: document.getElementById("instrutor").value,
    sala: document.getElementById("sala").value,
    dia_semana: document.getElementById("dia_semana").value,
    horario: document.getElementById("horario").value,
    vagas_totais: document.getElementById("vagas_totais").value,
  };

  try {
    if (aulaId) {
      await apiFetch(`/admin/aulas/${aulaId}`, { method: "PUT", body: JSON.stringify(corpo) });
    } else {
      await apiFetch("/admin/aulas", { method: "POST", body: JSON.stringify(corpo) });
    }
    window.location.href = "admin.html";
  } catch (erro) {
    mostrarMensagem(erro.message, "erro");
  }
});

document.addEventListener("DOMContentLoaded", carregarDadosSeEdicao);
