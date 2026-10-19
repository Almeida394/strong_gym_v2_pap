// Dicionário central: as chaves são os textos originais em português.
// O tradutor percorre também conteúdo inserido depois do carregamento, incluindo
// mensagens e cartões criados pelos restantes ficheiros JavaScript.
const traducoes = {
  "Strong Gym": "Strong Gym",
  "Entrar - Strong Gym": "Log in - Strong Gym",
  "Registar - Strong Gym": "Sign up - Strong Gym",
  "Planos - Strong Gym": "Memberships - Strong Gym",
  "O meu perfil - Strong Gym": "My profile - Strong Gym",
  "MyPlan - Strong Gym": "MyPlan - Strong Gym",
  "Admin - Strong Gym": "Admin - Strong Gym",
  "Aula - Strong Gym": "Class - Strong Gym",
  "Inscritos - Strong Gym": "Attendees - Strong Gym",
  "Aulas - Strong Gym": "Classes - Strong Gym",
  "Início": "Home",
  "Aulas": "Classes",
  "Planos": "Memberships",
  "Perfil": "Profile",
  "Sair": "Log out",
  "Entrar": "Log in",
  "Registar": "Sign up",
  "O teu próximo nível começa aqui": "Your next level starts here",
  "Mais forte. Todos os dias.": "Stronger. Every day.",
  "Treino com propósito, energia e uma comunidade que te ajuda a superar os teus limites.": "Purposeful training, energy, and a community that helps you push your limits.",
  "Explorar aulas": "Explore classes",
  "Ver planos": "View memberships",
  "Tudo para chegares mais longe": "Everything you need to go further",
  "Morada": "Address",
  "Horários": "Opening hours",
  "Contacto": "Contact",
  "Modalidades": "Activities",
  "Rua das Oliveiras, 123, Lisboa": "123 Oliveiras Street, Lisbon",
  "A carregar...": "Loading...",
  "Strong Gym — projeto de aprendizagem (PAP)": "Strong Gym — learning project",
  "Palavra-passe": "Password",
  "Ainda não tens conta?": "Don't have an account yet?",
  "Regista-te": "Sign up",
  "Conta de admin de exemplo: admin@stronggym.pt / admin123": "Example admin account: admin@stronggym.pt / admin123",
  "Criar conta": "Create account",
  "Nome": "Name",
  "Nome:": "Name:",
  "Email:": "Email:",
  "Plano:": "Membership:",
  "Plano (opcional)": "Membership (optional)",
  "Escolher mais tarde": "Choose later",
  "Já tens conta?": "Already have an account?",
  "Inicia sessão": "Log in",
  "Planos e mensalidades": "Memberships and fees",
  "Erro a carregar planos.": "Error loading memberships.",
  "O meu perfil": "My profile",
  "Histórico de aulas marcadas": "Class booking history",
  "Nenhum plano escolhido": "No membership selected",
  "Ainda não marcaste nenhuma aula.": "You haven't booked any classes yet.",
  "Um plano à tua medida": "A plan tailored to you",
  "Partilha os teus dados e recebe uma sugestão inicial de treino e nutrição.": "Share your details to get an initial training and nutrition suggestion.",
  "Os teus dados": "Your details",
  "Altura (cm)": "Height (cm)",
  "Peso (kg)": "Weight (kg)",
  "Objetivo": "Goal",
  "Perder peso": "Lose weight",
  "Manter forma": "Maintain fitness",
  "Ganhar massa muscular": "Build muscle",
  "Dias de treino por semana": "Training days per week",
  "1 dia": "1 day",
  "2 dias": "2 days",
  "3 dias": "3 days",
  "4 dias": "4 days",
  "5 dias": "5 days",
  "6 dias": "6 days",
  "Gerar o meu plano": "Generate my plan",
  "As sugestões são estimativas gerais e não substituem aconselhamento profissional.": "These suggestions are general estimates and are not a substitute for professional advice.",
  "Treino": "Training",
  "Nutrição": "Nutrition",
  "calorias estimadas / dia": "estimated calories / day",
  "proteína estimada / dia": "estimated protein / day",
  "Painel de administrador": "Admin dashboard",
  "+ Nova aula": "+ New class",
  "Tipo": "Type",
  "Dia": "Day",
  "Horário": "Time",
  "Vagas": "Places",
  "Ações": "Actions",
  "Nova aula": "New class",
  "Nome da aula": "Class name",
  "Instrutor": "Instructor",
  "Sala": "Room",
  "Dia da semana": "Day of the week",
  "Vagas totais": "Total places",
  "Guardar": "Save",
  "Inscritos": "Attendees",
  "Data da marcação": "Booking date",
  "Ainda ninguém se inscreveu.": "No one has signed up yet.",
  "Voltar ao painel": "Back to dashboard",
  "Todos os tipos": "All types",
  "Qualquer dia": "Any day",
  "Todos os instrutores": "All instructors",
  "Filtrar": "Filter",
  "A carregar aulas...": "Loading classes...",
  "A carregar aulas": "Loading classes",
  "Não há aulas com esses filtros.": "No classes match these filters.",
  "Esgotado": "Full",
  "Entrar para marcar": "Log in to book",
  "Cancelar": "Cancel",
  "Marcar": "Book",
  "vagas": "places",
  "Inscritos em": "Attendees for",
  "Editar": "Edit",
  "Apagar": "Delete",
  "Apagar esta aula?": "Delete this class?",
  "Editar aula": "Edit class",
  "A calcular...": "Calculating...",
  "Erro:": "Error:",
  "· marcado em": "· booked on",
  "marcado em": "booked on",
  "Erro a carregar aulas:": "Error loading classes:",
  "Ocorreu um erro.": "An error occurred.",
  "A carregar planos...": "Loading memberships...",
  "Email": "Email",
  "ex: Cardio, Funcional, Musculação": "e.g. Cardio, Functional, Strength",
  "ex: 18:30": "e.g. 18:30",
  "Mensal": "Monthly",
  "Anual": "Annual",
  "Só Musculação": "Strength only",
  "Musculação Livre": "Open strength training",
  "Acesso total, renovação mensal": "Full access, monthly renewal",
  "Acesso total, 2 meses grátis": "Full access, 2 months free",
  "Apenas sala de musculação livre": "Open-access strength room only",
  "Musculação": "Strength training",
  "Treino Funcional": "Functional training",
  "Funcional": "Functional",
  "Bem-estar": "Wellness",
  "Spinning": "Spin",
  "Crossfit": "CrossFit",
  "Yoga": "Yoga",
  "Cardio": "Cardio",
  "Sem instrutor fixo": "No regular instructor",
  "Sala Principal": "Main room",
  "Segunda": "Monday",
  "Todos os dias": "Every day",
  "Terça": "Tuesday",
  "Quarta": "Wednesday",
  "Quinta": "Thursday",
  "Sexta": "Friday",
  "Sábado": "Saturday",
  "Domingo": "Sunday",
  "Seg a Sex: 07:00 - 22:00 · Sáb: 09:00 - 14:00 · Dom: Fechado": "Mon–Fri: 07:00–22:00 · Sat: 09:00–14:00 · Sun: Closed",
  "Ocorreu um erro.": "An error occurred.",
  "Precisas de iniciar sessão.": "You need to log in.",
  "Só administradores podem fazer isto.": "Only administrators can do this.",
  "Essa aula não existe.": "That class does not exist.",
  "Já estás inscrito nessa aula.": "You are already signed up for this class.",
  "Essa aula já não tem vagas.": "This class has no places left.",
  "Não tens essa aula marcada.": "You haven't booked this class.",
  "Marcação cancelada.": "Booking cancelled.",
  "Preenche todos os campos.": "Please fill in all fields.",
  "Já existe uma conta com esse email.": "An account with this email already exists.",
  "Conta criada com sucesso.": "Account created successfully.",
  "Email ou palavra-passe incorretos.": "Incorrect email or password.",
  "Sessão terminada.": "You have been logged out.",
  "Envia os dados do plano em formato JSON.": "Submit the plan details in JSON format.",
  "A altura deve estar entre 100 e 250 cm.": "Height must be between 100 and 250 cm.",
  "O peso deve estar entre 30 e 300 kg.": "Weight must be between 30 and 300 kg.",
  "Escolhe entre 1 e 6 dias de treino por semana.": "Choose between 1 and 6 training days per week.",
  "Escolhe um objetivo válido.": "Choose a valid goal.",
  "Estimativa simplificada; as necessidades individuais podem variar.": "Simplified estimate; individual needs may vary.",
  "Aula criada.": "Class created.",
  "Aula não encontrada.": "Class not found.",
  "Aula atualizada.": "Class updated.",
  "Aula apagada.": "Class deleted.",
  "Corpo inteiro + cardio": "Full body + cardio",
  "Força total + intervalos": "Full-body strength + intervals",
  "Corpo inteiro + cardio leve": "Full body + light cardio",
  "Inferiores + core": "Lower body + core",
  "Superiores + cardio": "Upper body + cardio",
  "Circuito de corpo inteiro": "Full-body circuit",
  "Corpo inteiro": "Full body",
  "Superiores": "Upper body",
  "Inferiores": "Lower body",
  "Corpo inteiro + core": "Full body + core",
  "Superiores + condicionamento": "Upper body + conditioning",
  "Inferiores + mobilidade": "Lower body + mobility",
  "Peito e tríceps": "Chest and triceps",
  "Costas e bíceps": "Back and biceps",
  "Pernas e ombros": "Legs and shoulders",
  "Peito e costas": "Chest and back",
  "Braços e ombros": "Arms and shoulders",
  "Pernas e core": "Legs and core",
};

const traducoesInversas = Object.fromEntries(
  Object.entries(traducoes).map(([portugues, ingles]) => [ingles, portugues])
);
const textosOriginais = new WeakMap();
const atributosOriginais = new WeakMap();

function idiomaAtual() {
  return localStorage.getItem("idioma") || "pt";
}

function traduzir(texto, idioma = idiomaAtual()) {
  if (!texto) return texto;
  const limpo = texto.trim();
  if (limpo.startsWith("Inscritos em ") || limpo.startsWith("Attendees for ")) {
    const ingles = limpo.startsWith("Inscritos em ");
    const resto = limpo.slice(ingles ? "Inscritos em ".length : "Attendees for ".length);
    const prefixo = idioma === "en" ? "Attendees for " : "Inscritos em ";
    return texto.replace(limpo, prefixo + resto);
  }
  if ((limpo.startsWith("Inscrição confirmada em '") || limpo.startsWith("Booking confirmed for '"))
      && limpo.endsWith("'.")) {
    const portugues = limpo.startsWith("Inscrição confirmada em '");
    const aula = limpo.slice(portugues
      ? "Inscrição confirmada em '".length
      : "Booking confirmed for '".length, -2);
    const prefixo = idioma === "en" ? "Booking confirmed for '" : "Inscrição confirmada em '";
    return texto.replace(limpo, prefixo + aula + "'.");
  }
  if (limpo.startsWith("Erro: ") || limpo.startsWith("Error: ")) {
    const ingles = limpo.startsWith("Error: ");
    const prefixo = idioma === "en" ? "Error: " : "Erro: ";
    return texto.replace(limpo, prefixo + limpo.slice(ingles ? "Error: ".length : "Erro: ".length));
  }
  const sala = limpo.match(/^Sala (\d+)$/);
  if (sala) return texto.replace(limpo, `${idioma === "en" ? "Room" : "Sala"} ${sala[1]}`);
  if (limpo.startsWith("Erro a carregar aulas: ") || limpo.startsWith("Error loading classes: ")) {
    const ingles = limpo.startsWith("Error loading classes: ");
    const prefixo = idioma === "en" ? "Error loading classes: " : "Erro a carregar aulas: ";
    return texto.replace(limpo, prefixo + limpo.slice(ingles
      ? "Error loading classes: ".length
      : "Erro a carregar aulas: ".length));
  }
  const vagas = limpo.match(/^(\d+) (vagas|places)$/);
  if (vagas) {
    return texto.replace(limpo, `${vagas[1]} ${idioma === "en" ? "places" : "vagas"}`);
  }
  const traducao = idioma === "en"
    ? (traducoes[limpo] || limpo)
    : (traducoesInversas[limpo] || limpo);
  return texto.replace(limpo, traducao);
}

function traduzirTextoOriginal(texto, idioma) {
  return idioma === "en" ? traduzir(texto, "en") : texto;
}

function traduzirNo(no, idioma) {
  if (!textosOriginais.has(no)) textosOriginais.set(no, no.nodeValue);
  no.nodeValue = traduzirTextoOriginal(textosOriginais.get(no), idioma);
}

function traduzirAtributo(elemento, atributo, idioma) {
  let originais = atributosOriginais.get(elemento);
  if (!originais) {
    originais = {};
    atributosOriginais.set(elemento, originais);
  }
  if (!(atributo in originais)) originais[atributo] = elemento.getAttribute(atributo);
  elemento.setAttribute(atributo, traduzirTextoOriginal(originais[atributo], idioma));
}

function traduzirPagina() {
  const idioma = idiomaAtual();
  document.documentElement.lang = idioma;

  const titulo = document.querySelector("title");
  if (titulo && titulo.firstChild) traduzirNo(titulo.firstChild, idioma);

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    traduzirNo(node, idioma);
  }

  document.querySelectorAll("[placeholder], [title], [aria-label]").forEach((elemento) => {
    ["placeholder", "title", "aria-label"].forEach((atributo) => {
      if (elemento.hasAttribute(atributo)) {
        traduzirAtributo(elemento, atributo, idioma);
      }
    });
  });
  atualizarControlosIdioma();
}

function atualizarControlosIdioma() {
  const idioma = idiomaAtual();
  const botaoTema = document.getElementById("alternar-tema");
  if (botaoTema) {
    const claro = document.documentElement.dataset.theme === "light";
    const texto = idioma === "en"
      ? (claro ? "Enable dark mode" : "Enable light mode")
      : (claro ? "Ativar modo escuro" : "Ativar modo claro");
    botaoTema.textContent = claro ? "🌙" : "☀️";
    botaoTema.setAttribute("aria-label", texto);
    botaoTema.title = texto;
  }
  document.querySelectorAll("[data-idioma]").forEach((botao) => {
    const selecionado = botao.dataset.idioma === idioma;
    botao.setAttribute("aria-pressed", String(selecionado));
  });
}

function definirIdioma(idioma) {
  localStorage.setItem("idioma", idioma);
  traduzirPagina();
}

function alternarTema() {
  const tema = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  localStorage.setItem("tema", tema);
  document.documentElement.dataset.theme = tema;
  document.documentElement.classList.toggle("light-theme", tema === "light");
  document.body.classList.toggle("light-theme", tema === "light");
  atualizarControlosIdioma();
}

// Aplica a preferência antes do primeiro desenho e evita um clarão no tema escuro.
const temaGuardado = localStorage.getItem("tema") || "dark";
document.documentElement.dataset.theme = temaGuardado;
if (temaGuardado === "light") document.documentElement.classList.add("light-theme");

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.toggle("light-theme", document.documentElement.dataset.theme === "light");
  traduzirPagina();

  // Textos criados por scripts após o carregamento também passam pelo dicionário.
  const observadorTraducoes = new MutationObserver((alteracoes) => {
    alteracoes.forEach((alteracao) => {
      alteracao.addedNodes.forEach((adicionado) => {
        if (adicionado.nodeType === Node.TEXT_NODE) {
          traduzirNo(adicionado, idiomaAtual());
        } else if (adicionado.nodeType === Node.ELEMENT_NODE) {
          const walker = document.createTreeWalker(adicionado, NodeFilter.SHOW_TEXT);
          let texto;
          while ((texto = walker.nextNode())) traduzirNo(texto, idiomaAtual());
          adicionado.querySelectorAll("[placeholder], [title], [aria-label]").forEach((elemento) => {
            ["placeholder", "title", "aria-label"].forEach((atributo) => {
              if (elemento.hasAttribute(atributo)) {
                traduzirAtributo(elemento, atributo, idiomaAtual());
              }
            });
          });
        }
      });
    });
  });
  observadorTraducoes.observe(document.body, { childList: true, subtree: true });
});
