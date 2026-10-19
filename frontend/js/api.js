// api.js
// Funções partilhadas por todas as páginas, para falar com o backend (Flask).
// Guardamos o "token" de login no localStorage do browser, para a pessoa
// continuar com sessão iniciada mesmo depois de recarregar a página.

const API_URL = "http://127.0.0.1:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

function getNome() {
  return localStorage.getItem("nome");
}

function isAdmin() {
  return localStorage.getItem("is_admin") === "true";
}

function guardarSessao(token, nome, isAdminFlag) {
  localStorage.setItem("token", token);
  localStorage.setItem("nome", nome);
  localStorage.setItem("is_admin", isAdminFlag ? "true" : "false");
}

function limparSessao() {
  localStorage.removeItem("token");
  localStorage.removeItem("nome");
  localStorage.removeItem("is_admin");
}

/**
 * Função central para chamar a API.
 * Junta sempre o token de autenticação (se existir) e trata o JSON.
 */
async function apiFetch(caminho, opcoes = {}) {
  const headers = { "Content-Type": "application/json", ...(opcoes.headers || {}) };
  const token = getToken();
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  const resposta = await fetch(API_URL + caminho, { ...opcoes, headers });
  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new Error(dados.erro || "Ocorreu um erro.");
  }
  return dados;
}

// Preenche o cabeçalho (navbar) de cada página, consoante o utilizador
// tem ou não sessão iniciada. Chamado no fim de cada página HTML.
function montarNavbar() {
  const area = document.getElementById("navbar-sessao");
  if (!area) return;

  if (getToken()) {
    area.innerHTML = `
      <a href="perfil.html">Perfil</a>
      <a href="myplan.html">MyPlan</a>
      ${isAdmin() ? '<a href="admin.html">Admin</a>' : ""}
      <a href="#" id="link-sair">Sair</a>
    `;
    document.getElementById("link-sair").addEventListener("click", (e) => {
      e.preventDefault();
      apiFetch("/logout", { method: "POST" }).catch(() => {});
      limparSessao();
      window.location.href = "index.html";
    });
  } else {
    area.innerHTML = `
      <a href="login.html">Entrar</a>
      <a href="registo.html" class="btn-nav">Registar</a>
    `;
  }
}

function mostrarMensagem(texto, tipo = "sucesso") {
  const area = document.getElementById("mensagem");
  if (!area) {
    alert(texto);
    return;
  }
  area.textContent = texto;
  area.className = "flash flash-" + tipo;
  area.style.display = "block";
}

document.addEventListener("DOMContentLoaded", montarNavbar);
