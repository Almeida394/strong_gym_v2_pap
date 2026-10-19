// admin.js — lista de aulas no painel de administrador, com editar/apagar/ver inscritos.

async function carregarAulasAdmin() {
  if (!getToken() || !isAdmin()) {
    window.location.href = "index.html";
    return;
  }

  try {
    const aulas = await apiFetch("/admin/aulas");
    const corpo = document.getElementById("tabela-aulas");

    corpo.innerHTML = aulas.map((a) => `
      <tr>
        <td>${a.nome}</td>
        <td>${a.tipo}</td>
        <td>${a.dia_semana}</td>
        <td>${a.horario}</td>
        <td>${a.vagas_disponiveis} / ${a.vagas_totais}</td>
        <td class="admin-acoes">
          <a href="admin-inscritos.html?id=${a.id}">Inscritos</a>
          <a href="admin-form.html?id=${a.id}">Editar</a>
          <button type="button" class="btn-cancelar" data-id="${a.id}">Apagar</button>
        </td>
      </tr>
    `).join("");

    corpo.querySelectorAll("button[data-id]").forEach((btn) => {
      btn.addEventListener("click", () => apagarAula(btn.dataset.id));
    });
  } catch (erro) {
    document.getElementById("tabela-aulas").innerHTML =
      `<tr><td colspan="6">Erro: ${erro.message}</td></tr>`;
  }
}

async function apagarAula(id) {
  if (!confirm(traduzir("Apagar esta aula?"))) return;
  try {
    await apiFetch(`/admin/aulas/${id}`, { method: "DELETE" });
    carregarAulasAdmin();
  } catch (erro) {
    mostrarMensagem(erro.message, "erro");
  }
}

document.addEventListener("DOMContentLoaded", carregarAulasAdmin);
