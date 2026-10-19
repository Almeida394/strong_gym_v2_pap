// aulas.js — lista de aulas, filtros, marcar e cancelar presença.

function preencherSelect(select, valores, valorAtual) {
  valores.forEach((v) => {
    const option = document.createElement("option");
    option.value = v;
    option.textContent = v;
    if (v === valorAtual) option.selected = true;
    select.appendChild(option);
  });
}

function badgeVagas(aula) {
  if (aula.vagas_disponiveis <= 0) {
    return '<span class="badge badge-esgotado">Esgotado</span>';
  }
  if (aula.vagas_disponiveis <= 3) {
    return `<span class="badge badge-aviso">${aula.vagas_disponiveis} vagas</span>`;
  }
  return `<span class="badge badge-livre">${aula.vagas_disponiveis} vagas</span>`;
}

function botaoAcao(aula) {
  if (!getToken()) {
    return '<a href="login.html" class="btn-primary">Entrar para marcar</a>';
  }
  if (aula.marcada) {
    return `<button class="btn-cancelar" data-id="${aula.id}" data-acao="cancelar">Cancelar</button>`;
  }
  const disabled = aula.vagas_disponiveis <= 0 ? "disabled" : "";
  return `<button class="btn-primary" data-id="${aula.id}" data-acao="marcar" ${disabled}>Marcar</button>`;
}

function iconeModalidade(tipo) {
  const icones = {
    "Musculação": "🏋️",
    "Funcional": "⚡",
    "Cardio": "🚴",
    "Bem-estar": "🧘",
  };
  return icones[tipo] || "✦";
}

function desenharAulas(aulas) {
  const lista = document.getElementById("lista-aulas");

  if (aulas.length === 0) {
    lista.innerHTML = "<p>Não há aulas com esses filtros.</p>";
    return;
  }

  lista.innerHTML = aulas.map((aula) => `
    <div class="card aula-card">
      <div class="aula-info">
        <span class="modalidade-icon" aria-hidden="true">${iconeModalidade(aula.tipo)}</span>
        <div>
        <h3>${aula.nome}</h3>
        <p class="meta">${aula.dia_semana} · ${aula.horario} · ${aula.sala} · ${aula.instrutor}</p>
        </div>
      </div>
      <div class="aula-acao">
        ${badgeVagas(aula)}
        ${botaoAcao(aula)}
      </div>
    </div>
  `).join("");

  // Liga os botões "Marcar" / "Cancelar" depois de os desenhar na página
  lista.querySelectorAll("button[data-acao]").forEach((btn) => {
    btn.addEventListener("click", () => tratarAcao(btn.dataset.id, btn.dataset.acao));
  });
}

async function tratarAcao(aulaId, acao) {
  try {
    const resultado = await apiFetch(`/aulas/${aulaId}/${acao}`, { method: "POST" });
    mostrarMensagem(resultado.mensagem, "sucesso");
    carregarAulas();
  } catch (erro) {
    mostrarMensagem(erro.message, "erro");
  }
}

async function carregarAulas() {
  const params = new URLSearchParams(new FormData(document.getElementById("form-filtros")));
  // Remove parâmetros vazios para o URL ficar limpo
  for (const [chave, valor] of [...params.entries()]) {
    if (!valor) params.delete(chave);
  }

  try {
    const dados = await apiFetch("/aulas?" + params.toString());
    desenharAulas(dados.aulas);

    const selTipo = document.getElementById("filtro-tipo");
    const selDia = document.getElementById("filtro-dia");
    const selInstrutor = document.getElementById("filtro-instrutor");

    // Só preenche as opções uma vez, para não duplicar ao voltar a filtrar
    if (selTipo.options.length === 1) {
      preencherSelect(selTipo, dados.filtros.tipos, params.get("tipo"));
      preencherSelect(selDia, dados.filtros.dias, params.get("dia"));
      preencherSelect(selInstrutor, dados.filtros.instrutores, params.get("instrutor"));
    }
  } catch (erro) {
    document.getElementById("lista-aulas").innerHTML = `<p>Erro a carregar aulas: ${erro.message}</p>`;
  }
}

document.getElementById("form-filtros").addEventListener("submit", (e) => {
  e.preventDefault();
  carregarAulas();
});

document.addEventListener("DOMContentLoaded", carregarAulas);
