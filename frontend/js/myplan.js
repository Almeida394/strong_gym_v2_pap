const formMyplan = document.getElementById("form-myplan");

function desenharResultadoMyplan(plano) {
  const listaTreino = document.getElementById("plano-treino");
  listaTreino.replaceChildren();

  plano.treino.forEach((dia) => {
    const item = document.createElement("li");
    const nomeDia = document.createElement("strong");
    const tipoTreino = document.createElement("span");
    nomeDia.textContent = dia.dia;
    tipoTreino.textContent = dia.tipo;
    item.append(nomeDia, tipoTreino);
    listaTreino.appendChild(item);
  });

  document.getElementById("calorias-diarias").textContent =
    plano.nutricao.calorias_diarias.toLocaleString("pt-PT") + " kcal";
  document.getElementById("proteina-diaria").textContent =
    plano.nutricao.proteina_diaria_g + " g";
  document.getElementById("nota-nutricao").textContent = plano.nota;
  document.getElementById("resultado-myplan").hidden = false;
}

if (!getToken()) {
  window.location.replace("login.html");
} else {
  formMyplan.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    if (!formMyplan.reportValidity()) return;

    const botao = formMyplan.querySelector('button[type="submit"]');
    botao.disabled = true;
    botao.textContent = "A calcular...";

    try {
      const resultado = await apiFetch("/myplan", {
        method: "POST",
        body: JSON.stringify({
          altura: Number(formMyplan.elements.altura.value),
          peso: Number(formMyplan.elements.peso.value),
          objetivo: formMyplan.elements.objetivo.value,
          dias: Number(formMyplan.elements.dias.value),
        }),
      });
      document.getElementById("mensagem").style.display = "none";
      desenharResultadoMyplan(resultado);
    } catch (erro) {
      mostrarMensagem(erro.message, "erro");
    } finally {
      botao.disabled = false;
      botao.textContent = "Gerar o meu plano";
    }
  });
}
