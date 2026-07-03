const elMensagens = document.getElementById("chat-mensagens");
const elInput = document.getElementById("chat-input");
const btnEnviar = document.getElementById("btn-enviar");

const historico = [];
const historicoLimite = 10

function historicoDentroDoLimite() {
  return historico.slice(-historicoLimite);
}
function horaAtual() {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function scrollParaBaixo() {
  elMensagens.scrollTop = elMensagens.scrollHeight;
}

function adicionarMensagem(texto, tipo) {
  const balao = document.createElement("div");
  balao.classList.add("balao", `balao-${tipo}`);

  const conteudo = document.createElement("div");
  conteudo.classList.add("balao-texto");
  conteudo.textContent = texto;

  const hora = document.createElement("span");
  hora.classList.add("balao-hora");
  hora.textContent = horaAtual();

  balao.appendChild(conteudo);
  balao.appendChild(hora);
  elMensagens.appendChild(balao);
  scrollParaBaixo();
}

function adicionarMensagemHTML(html, tipo) {
  const balao = document.createElement("div");
  balao.classList.add("balao", `balao-${tipo}`);

  const conteudo = document.createElement("div");
  conteudo.classList.add("balao-texto");
  conteudo.innerHTML = html;

  const hora = document.createElement("span");
  hora.classList.add("balao-hora");
  hora.textContent = horaAtual();

  balao.appendChild(conteudo);
  balao.appendChild(hora);
  elMensagens.appendChild(balao);
  scrollParaBaixo();
}

function mostrarDigitando() {
  const balao = document.createElement("div");
  balao.classList.add("balao", "balao-assistente", "balao-digitando");
  balao.id = "balao-digitando";

  const conteudo = document.createElement("div");
  conteudo.classList.add("balao-texto");
  conteudo.innerHTML = `
    <div class="ponto"></div>
    <div class="ponto"></div>
    <div class="ponto"></div>
  `;

  balao.appendChild(conteudo);
  elMensagens.appendChild(balao);
  scrollParaBaixo();
}

function removerDigitando() {
  const balao = document.getElementById("balao-digitando");
  if (balao) balao.remove();
}

function bloquearInput(bloquear) {
  elInput.disabled = bloquear;
  btnEnviar.disabled = bloquear;
}

function renderizarTreino(dados) {
  const exercicios = dados.exercicios
    .map((ex, i) => {
      const erros = ex.erros_comuns.map((erro) => `<li>${erro}</li>`).join("");
      return (
        '<div class="exercicio-card">' +
        `<div class="exercicio-numero">Exercício ${String(i + 1).padStart(2, "0")}</div>` +
        `<div class="exercicio-nome">${ex.nome}</div>` +
        '<div class="exercicio-secao">' +
        '<span class="exercicio-label">🎯 Objetivo</span>' +
        `<p class="exercicio-texto">${ex.objetivo}</p>` +
        "</div>" +
        '<div class="exercicio-secao">' +
        '<span class="exercicio-label">📊 Volume</span>' +
        `<p class="exercicio-texto">${ex.volume}</p>` +
        "</div>" +
        '<div class="exercicio-secao">' +
        '<span class="exercicio-label">📋 Como executar</span>' +
        `<p class="exercicio-texto exercicio-execucao">${ex.execucao}</p>` +
        "</div>" +
        '<div class="exercicio-secao">' +
        '<span class="exercicio-label">⚠️ Erros comuns</span>' +
        `<ul class="exercicio-erros">${erros}</ul>` +
        "</div>" +
        `<div class="exercicio-dica">💡 ${ex.dica}</div>` +
        "</div>"
      );
    })
    .join("");

  return (
    '<div class="treino-render">' +
    `<div class="treino-intro">${dados.mensagem}</div>` +
    `<div class="treino-duracao">⏱ ${dados.duracao_minutos} min</div>` +
    exercicios +
    "</div>"
  );
}

function renderizarResposta(dados) {
  if (dados.tipo === "treino") {
    return {
      html: true,
      conteudo: renderizarTreino(dados),
    };
  }

  return {
    html: false,
    conteudo: dados.mensagem,
  };
}

async function enviarMensagem() {
  const texto = elInput.value.trim();

  if (!texto) return;

  elInput.value = "";
  elInput.style.height = "auto";

  adicionarMensagem(texto, "usuario");

  historico.push({
    role: "user",
    content: texto,
  });

  bloquearInput(true);
  mostrarDigitando();

  try {
    const response = await fetch("/api/llm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({historico: historicoDentroDoLimite()}),
    });

    const data = await response.json();

    removerDigitando();

    if (!response.ok) {
      adicionarMensagem(
        data.erro || "Erro ao conectar com o servidor.",
        "assistente"
      );
      return;
    }

    const { html, conteudo } = renderizarResposta(data.resposta);

    if (html) {
      adicionarMensagemHTML(conteudo, "assistente");
    } else {
      adicionarMensagem(conteudo, "assistente");
    }

    historico.push({
      role: "assistant",
      content: JSON.stringify(data.resposta),
    });

  } catch {
    removerDigitando();

    adicionarMensagem(
      "Não foi possível conectar ao servidor. Tente novamente.",
      "assistente"
    );
  } finally {
    bloquearInput(false);
    elInput.focus();
  }
}

function ajustarAlturaInput() {
  elInput.style.height = "auto";
  elInput.style.height = elInput.scrollHeight + "px";
}

document.getElementById("hora-inicial").textContent = horaAtual();

elInput.addEventListener("input", ajustarAlturaInput);

elInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    enviarMensagem();
  }
});

btnEnviar.addEventListener("click", enviarMensagem);