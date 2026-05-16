const API = "http://localhost:8080";

// Recupera o usuário logado do localStorage
const _dadosSalvos = localStorage.getItem("usuarioLogado");
if (_dadosSalvos) {
  window.usuarioLogado = JSON.parse(_dadosSalvos);
} else {
  window.location.href = "login.html";
}

// ── Toast de feedback ────────────────────────────────────────
function mostrarFeedback(mensagem, tipo = "sucesso") {
  const toast = document.createElement("div");
  toast.textContent = mensagem;
  toast.style.cssText = `
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    background: ${tipo === "sucesso" ? "#7c3aed" : "#dc2626"};
    color: #fff; padding: 12px 24px; border-radius: 8px;
    font-size: 14px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    transition: opacity 0.4s;
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

//============================================================
//motorista ,  salvar as disponibilidades
function salvarDisponibilidade() {
  const usuario = window.usuarioLogado;
  if (!usuario) {
    mostrarFeedback("Você precisa estar logado.", "erro");
    return;
  }

  const checkboxesDias = document.querySelectorAll(
    "#painelMotorista .dias-semana-check input[type=checkbox]"
  );
  const nomesDias = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"];
  const diasSelecionados = [];
  checkboxesDias.forEach((cb, i) => {
    if (cb.checked) diasSelecionados.push(nomesDias[i]);
  });

  if (diasSelecionados.length === 0) {
    mostrarFeedback("Selecione ao menos um dia.", "erro");
    return;
  }

  const inputs = document.querySelectorAll("#painelMotorista .form-input");
  const pontoPartida = inputs[0].value.trim();
  const horarioIda   = inputs[1].value;
  const horarioVolta = inputs[2].value;
  const vagas        = parseInt(inputs[3].value);

  if (!pontoPartida) { mostrarFeedback("Informe o ponto de partida.", "erro"); return; }
  if (!horarioIda)   { mostrarFeedback("Informe o horário de saída.", "erro"); return; }

  const payload = {
    motorista: { id: usuario.id },
    diasSemana: diasSelecionados.join(","),
    pontoPartida,
    horarioIda,
    horarioVolta,
    vagasDisponiveis: vagas
  };

  fetch(`${API}/disponibilidades`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => { if (!res.ok) throw new Error(); return res.json(); })
    .then(() => mostrarFeedback("Disponibilidade salva com sucesso! ✓"))
    .catch(() => mostrarFeedback("Erro ao salvar disponibilidade.", "erro"));
}

// ============================================================
// passageiro , quase tudo que vai fazer ta aqui
function carregarDisponibilidades() {
  fetch(`${API}/disponibilidades`)
    .then(res => { if (!res.ok) throw new Error(); return res.json(); })
    .then(lista => renderizarCards(lista))
    .catch(() => mostrarFeedback("Erro ao carregar caronas.", "erro"));
}

function renderizarCards(lista) {
  const container = document.querySelector("#painelPassageiro .resultados-carona");
  if (!container) return;

  const h3 = container.querySelector("h3");
  container.innerHTML = "";
  if (h3) container.appendChild(h3);

  if (lista.length === 0) {
    container.insertAdjacentHTML("beforeend",
      '<p style="color:#aaa;margin-top:12px;">Nenhuma carona disponível no momento.</p>');
    return;
  }

  lista.forEach(disp => {
    const diasFormatados = disp.diasSemana
      ? disp.diasSemana.split(",").map(d => d.charAt(0) + d.slice(1).toLowerCase()).join(", ")
      : "—";

    const card = document.createElement("div");
    card.className = "carona-card";
    card.dataset.dispId = disp.id;
    card.innerHTML = `
      <div class="carona-motorista">
        <div class="carona-avatar">🚗</div>
        <div><strong>${disp.motorista?.nomeCompleto ?? "Motorista"}</strong></div>
      </div>
      <div class="carona-detalhes">
        <span>📍 ${disp.pontoPartida ?? "—"}</span>
        <span>🕖 Ida: ${disp.horarioIda ?? "—"} · Volta: ${disp.horarioVolta ?? "—"}</span>
        <span>📅 ${diasFormatados}</span>
        <span class="vagas-badge">${disp.vagasDisponiveis} vaga${disp.vagasDisponiveis > 1 ? "s" : ""}</span>
      </div>
      <button class="btn-agendar" onclick="solicitarCarona(${disp.id}, ${disp.motorista?.id}, '${disp.pontoPartida}', '${disp.horarioIda}', ${disp.vagasDisponiveis})">
        Agendar
      </button>
    `;
    container.appendChild(card);
  });
}



async function solicitarCarona(dispId, motoristaId, pontoPartida, horarioIda, vagas) {
  const usuario = window.usuarioLogado;
  if (!usuario) {
    mostrarFeedback("Você precisa estar logado para agendar.", "erro");
    return;
  }

  // Monta a data de hoje no formato "YYYY-MM-DD"
  const hoje = new Date();
  const dataHoje = `${hoje.getFullYear()}-${String(hoje.getMonth()+1).padStart(2,"0")}-${String(hoje.getDate()).padStart(2,"0")}`;
  const dataHoraISO = `${dataHoje}T${horarioIda}:00`;

  try {
    // Passo 1: verifica se já existe corrida desse motorista hoje
    const resExistente = await fetch(`${API}/corridas/motorista/${motoristaId}/data/${dataHoje}`);

    let corridaId;

    if (resExistente.ok) {
      // Corrida já existe → só entra nela
      const corridaExistente = await resExistente.json();
      corridaId = corridaExistente.id;
    } else {
      // Corrida não existe → cria uma nova
      const resNova = await fetch(`${API}/corridas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motorista: { id: motoristaId },
          origem: pontoPartida,
          destino: "Instituição",
          dataHora: dataHoraISO,
          vagasDisponiveis: vagas
        })
      });

      if (!resNova.ok) throw new Error("Erro ao criar corrida");
      const novaCorrida = await resNova.json();
      corridaId = novaCorrida.id;
    }

    // Passo 2: entra na corrida (nova ou existente)
    const resEntrar = await fetch(`${API}/corridas/${corridaId}/entrar/${usuario.id}`, {
      method: "POST"
    });

    if (!resEntrar.ok) {
      const txt = await resEntrar.text();
      throw new Error(txt);
    }

    mostrarFeedback("Carona agendada com sucesso! 🚗");
    carregarDisponibilidades();

    // Atualiza o calendário se disponível
    if (typeof carregarDadosCalendario === "function") {
      carregarDadosCalendario();
    }

  } catch (err) {
    let msg = "Erro ao agendar carona.";
    try {
      const parsed = JSON.parse(err.message);
      if (parsed?.message) msg = parsed.message;
    } catch {
      if (err.message) msg = err.message;
    }
    mostrarFeedback(msg, "erro");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btnSalvar = document.querySelector("#painelMotorista .btn-salvar");
  if (btnSalvar) btnSalvar.addEventListener("click", salvarDisponibilidade);

  const btnBuscar = document.querySelector("#painelPassageiro .btn-buscar");
  if (btnBuscar) btnBuscar.addEventListener("click", carregarDisponibilidades);

  const painelPassageiro = document.getElementById("painelPassageiro");
  if (painelPassageiro && painelPassageiro.style.display !== "none") {
    carregarDisponibilidades();
  }
});