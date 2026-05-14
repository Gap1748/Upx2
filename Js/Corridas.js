
const API = "http://localhost:8080";

// ── Toast de feedback (sucesso / erro) ──────────────────────
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

// Recupera o usuário logado do localStorage
const _dadosSalvos = localStorage.getItem("usuarioLogado");
if (_dadosSalvos) {
  window.usuarioLogado = JSON.parse(_dadosSalvos);
} else {
  // Se não tiver ninguém logado, manda de volta pro login
  // Comente essa linha se quiser testar sem login por enquanto
  window.location.href = "Login.html"; // troca pelo nome da sua página de login
}

// ============================================================
//  1. MOTORISTA — Salvar disponibilidade
//  POST /disponibilidades
// ============================================================

function salvarDisponibilidade() {
  const usuario = window.usuarioLogado;
  if (!usuario) {
    mostrarFeedback("Você precisa estar logado... como esta nessa sem sem estar logado?", "erro");
    return;
  }

  // Dias marcados
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

  // Campos do formulário (ordem no HTML: texto, time, time, select)
  const inputs = document.querySelectorAll("#painelMotorista .form-input");
  const pontoPartida  = inputs[0].value.trim();
  const horarioIda    = inputs[1].value;
  const horarioVolta  = inputs[2].value;
  const vagas         = parseInt(inputs[3].value);

  if (!pontoPartida) {
    mostrarFeedback("Informe o ponto de partida.", "erro");
    return;
  }
  if (!horarioIda) {
    mostrarFeedback("Informe o horário de saída.", "erro");
    return;
  }

  const payload = {
    motorista: { id: usuario.id },
    diasSemana: diasSelecionados.join(","),  // "SEG,TER,QUA,QUI,SEX"
    pontoPartida: pontoPartida,
    horarioIda: horarioIda,                  // "19:00"
    horarioVolta: horarioVolta,              // "23:00"
    vagasDisponiveis: vagas
  };

  fetch(`${API}/disponibilidades`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao salvar");
      return res.json();
    })
    .then(() => mostrarFeedback("Disponibilidade salva com sucesso! ✓"))
    .catch(() => mostrarFeedback("Erro ao salvar disponibilidade.", "erro"));
}

// ============================================================
//  2. PASSAGEIRO — Listar disponibilidades ativas
//  GET /disponibilidades
// ============================================================

function carregarDisponibilidades() {
  fetch(`${API}/disponibilidades`)
    .then(res => {
      if (!res.ok) throw new Error("Erro na requisição");
      return res.json();
    })
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
    container.insertAdjacentHTML(
      "beforeend",
      '<p style="color:#aaa;margin-top:12px;">Nenhuma carona disponível no momento.</p>'
    );
    return;
  }

  lista.forEach(disp => {
    // Formata os dias para exibição  "SEG,TER,QUA" → "Seg, Ter, Qua"
    const diasFormatados = disp.diasSemana
      ? disp.diasSemana.split(",").map(d => d.charAt(0) + d.slice(1).toLowerCase()).join(", ")
      : "—";

    const card = document.createElement("div");
    card.className = "carona-card";
    card.dataset.dispId = disp.id;

    card.innerHTML = `
      <div class="carona-motorista">
        <div class="carona-avatar">🚗</div>
        <div>
          <strong>${disp.motorista?.nomeCompleto ?? "Motorista"}</strong>
        </div>
      </div>
      <div class="carona-detalhes">
        <span>📍 ${disp.pontoPartida ?? "—"}</span>
        <span>🕖 Ida: ${disp.horarioIda ?? "—"} · Volta: ${disp.horarioVolta ?? "—"}</span>
        <span>📅 ${diasFormatados}</span>
        <span class="vagas-badge">${disp.vagasDisponiveis} vaga${disp.vagasDisponiveis > 1 ? "s" : ""}</span>
      </div>
      <button class="btn-agendar" onclick="solicitarCarona(${disp.id})">
        Agendar
      </button>
    `;

    container.appendChild(card);
  });
}

// ============================================================
//  3. PASSAGEIRO — Solicitar entrada em uma corrida
//  POST /corridas  (cria uma Corrida a partir da disponibilidade)
// ============================================================
//
//  Por enquanto, agendar significa criar uma Corrida nova
//  com os dados da disponibilidade + passageiro já incluído.
//  penso em no futuro adicionar uma funcionalidade para confirmação
//  por parte do motoristas, ai essa parte seria um repositorio de corridas 
// esperando ser confirmadas
// ============================================================

function solicitarCarona(dispId) {
  const usuario = window.usuarioLogado;
  if (!usuario) {
    mostrarFeedback("Você precisa estar logado para agendar.", "erro");
    return;
  }

  // Primeiro busca os detalhes da disponibilidade
  fetch(`${API}/disponibilidades`)
    .then(res => res.json())
    .then(lista => {
      const disp = lista.find(d => d.id === dispId);
      if (!disp) throw new Error("Disponibilidade não encontrada");

      // Monta uma Corrida com os dados da disponibilidade
      // dataHora = hoje + horário de ida
      const hoje = new Date();
      const dataHoraISO = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}T${disp.horarioIda}:00`;

      const payload = {
        motorista: { id: disp.motorista.id },
        origem: disp.pontoPartida,
        destino: "Instituição",
        dataHora: dataHoraISO,
        vagasDisponiveis: disp.vagasDisponiveis
      };

      return fetch(`${API}/corridas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao criar corrida");
      return res.json();
    })
    .then(corrida => {
      // Agora entra na corrida recém-criada como passageiro
      return fetch(`${API}/corridas/${corrida.id}/entrar/${usuario.id}`, {
        method: "POST"
      });
    })
    .then(res => {
      if (!res.ok) return res.text().then(t => { throw new Error(t); });
      return res.json();
    })
    .then(() => {
      mostrarFeedback("Carona agendada com sucesso! 🚗");
      carregarDisponibilidades();
    })
    .catch(err => {
      let msg = "Erro ao agendar carona.";
      try {
        const parsed = JSON.parse(err.message);
        if (parsed?.message) msg = parsed.message;
      } catch {
        if (err.message) msg = err.message;
      }
      mostrarFeedback(msg, "erro");
    });
}

// ============================================================
//  Inicialização
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  // Botão "Salvar Disponibilidade"
  const btnSalvar = document.querySelector("#painelMotorista .btn-salvar");
  if (btnSalvar) {
    btnSalvar.addEventListener("click", salvarDisponibilidade);
  }

  // Botão "Buscar Caronas"
  const btnBuscar = document.querySelector("#painelPassageiro .btn-buscar");
  if (btnBuscar) {
    btnBuscar.addEventListener("click", carregarDisponibilidades);
  }

  // Se o painel passageiro já estiver visível ao carregar
  const painelPassageiro = document.getElementById("painelPassageiro");
  if (painelPassageiro && painelPassageiro.style.display !== "none") {
    carregarDisponibilidades();
  }
});

// Talvez ainda tenha mais coisa para adicionar  no futuro, mas por enquanto é isso.