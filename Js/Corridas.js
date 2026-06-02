const API = "http://localhost:8080";

const _dadosSalvos = localStorage.getItem("usuarioLogado");
if (_dadosSalvos) {
  window.usuarioLogado = JSON.parse(_dadosSalvos);
} else {
  window.location.href = "login.html";
}

const DIAS_MAP = { DOM:0, SEG:1, TER:2, QUA:3, QUI:4, SEX:5, SAB:6 };

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

// Converte "2026-05-22" → "22/05/2026"
function formatarData(dataISO) {
  if (!dataISO) return "—";
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

// ── MOTORISTA: Salvar disponibilidade ────────────────────────
function salvarDisponibilidade() {
  const usuario = window.usuarioLogado;
  if (!usuario) { mostrarFeedback("Você precisa estar logado.", "erro"); return; }

  const checkboxesDias = document.querySelectorAll(
    "#painelMotorista .dias-semana-check input[type=checkbox]"
  );
  const nomesDias = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"];
  const diasSelecionados = [];
  checkboxesDias.forEach((cb, i) => { if (cb.checked) diasSelecionados.push(nomesDias[i]); });

  const dataInicio = document.getElementById("dataInicio").value;
  const dataFim    = document.getElementById("dataFim").value;

  if (!dataInicio || !dataFim) { mostrarFeedback("Informe a data de início e fim.", "erro"); return; }
  if (dataFim < dataInicio)    { mostrarFeedback("Data de fim não pode ser anterior à data de início.", "erro"); return; }

  const umDiaSo = dataInicio === dataFim;
  if (!umDiaSo && diasSelecionados.length === 0) {
    mostrarFeedback("Selecione ao menos um dia da semana.", "erro"); return;
  }

  const inputs = document.querySelectorAll("#painelMotorista .form-input");
  const pontoPartida = inputs[0].value.trim();
  const horarioIda   = inputs[1].value;
  const horarioVolta = inputs[2].value;
  const vagas        = parseInt(inputs[3].value);

  if (!pontoPartida) { mostrarFeedback("Informe o ponto de partida.", "erro"); return; }
  if (!horarioIda)   { mostrarFeedback("Informe o horário de saída.", "erro"); return; }

  const payload = {
    motorista:        { id: usuario.id },
    diasSemana:       umDiaSo ? "DIA_UNICO" : diasSelecionados.join(","),
    pontoPartida,
    horarioIda,
    horarioVolta,
    vagasDisponiveis: vagas,
    dataInicio,
    dataFim
  };

  fetch(`${API}/disponibilidades`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => { if (!res.ok) return res.text().then(t => { throw new Error(t); }); return res.json(); })
    .then(() => mostrarFeedback("Disponibilidade salva com sucesso! ✓"))
    .catch(err => mostrarFeedback(err.message || "Erro ao salvar disponibilidade.", "erro"));
}

// ── PASSAGEIRO: Carregar disponibilidades ────────────────────
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
    const diasFormatados = (disp.diasSemana && disp.diasSemana !== "DIA_UNICO")
      ? disp.diasSemana.split(",").map(d => d.charAt(0) + d.slice(1).toLowerCase()).join(", ")
      : "Dia único";

    const periodoTexto = disp.dataInicio === disp.dataFim
      ? `📆 ${formatarData(disp.dataInicio)}`
      : `📆 ${formatarData(disp.dataInicio)} até ${formatarData(disp.dataFim)}`;

    const card = document.createElement("div");
    card.className = "carona-card";
    card.dataset.dispId = disp.id;
    card.dataset.dispJson = JSON.stringify({
      id:              disp.id,
      motoristaId:     disp.motorista?.id,
      motoristaNome:   disp.motorista?.nomeCompleto ?? "Motorista",
      pontoPartida:    disp.pontoPartida,
      horarioIda:      disp.horarioIda,
      vagasDisponiveis:disp.vagasDisponiveis,
      diasSemana:      disp.diasSemana ?? "",
      dataInicio:      disp.dataInicio,
      dataFim:         disp.dataFim
    });

    card.innerHTML = `
      <div class="carona-motorista">
        <div class="carona-avatar">🚗</div>
        <div><strong>${disp.motorista?.nomeCompleto ?? "Motorista"}</strong></div>
      </div>
      <div class="carona-detalhes">
        <span>📍 ${disp.pontoPartida ?? "—"}</span>
        <span>🕖 Ida: ${disp.horarioIda ?? "—"} · Volta: ${disp.horarioVolta ?? "—"}</span>
        <span>📅 ${diasFormatados}</span>
        <span>${periodoTexto}</span>
        <span class="vagas-badge">${disp.vagasDisponiveis} vaga${disp.vagasDisponiveis > 1 ? "s" : ""}</span>
      </div>
      <button class="btn-agendar" onclick="abrirModalAgendamento(this)">Agendar</button>
    `;
    container.appendChild(card);
  });
}

// ── MODAL: Abrir ─────────────────────────────────────────────
function abrirModalAgendamento(botao) {
  const card = botao.closest(".carona-card");
  const disp = JSON.parse(card.dataset.dispJson);

  document.getElementById("modalAgendamento")?.remove();

  const hoje = new Date().toISOString().split("T")[0];

  // Monta os checkboxes de dias — mostra só os dias do motorista (ou todos se DIA_UNICO)
  const diasParaMostrar = (disp.diasSemana && disp.diasSemana !== "DIA_UNICO")
    ? disp.diasSemana.split(",").map(d => d.trim())
    : ["SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"];

  const checkboxesDias = diasParaMostrar.map(d => `
    <label style="display:flex;align-items:center;gap:4px;font-size:12px;color:#fff;cursor:pointer;">
      <input type="checkbox" data-dia="${d}" checked style="cursor:pointer;">
      ${d.charAt(0) + d.slice(1).toLowerCase()}
    </label>
  `).join("");

  const modal = document.createElement("div");
  modal.id = "modalAgendamento";
  modal.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
    display: flex; align-items: center; justify-content: center;
    z-index: 9998;
  `;

  modal.innerHTML = `
    <div style="
      background: #131314; border: 1px solid #ede6f8; border-radius: 12px;
      padding: 24px; width: 340px; color: #fff; position: relative;
    ">
      <button id="btnFecharModal"
        style="position:absolute;top:12px;right:12px;background:none;border:none;
               color:#fff;font-size:18px;cursor:pointer;">✕</button>

      <h3 style="margin:0 0 8px;color:#e040fb;">Agendar Carona</h3>
      <p style="margin:0 0 16px;font-size:13px;color:#aaa;">
        ${disp.motoristaNome} · ${disp.pontoPartida} · ${disp.horarioIda}
      </p>

      <div style="display:flex;gap:8px;margin-bottom:16px;" id="modoAgendamento" data-modo-ativo="hoje">
        <button class="modo-btn" data-modo="hoje" id="btnModoHoje"
          style="flex:1;padding:8px;border-radius:8px;border:2px solid #5f1eda;
                 background:#7c3aed;color:#fff;cursor:pointer;font-size:12px;">
          Só hoje
        </button>
        <button class="modo-btn" data-modo="data" id="btnModoData"
          style="flex:1;padding:8px;border-radius:8px;border:2px solid #444;
                 background:transparent;color:#fff;cursor:pointer;font-size:12px;">
          Uma data
        </button>
        <button class="modo-btn" data-modo="periodo" id="btnModoPeriodo"
          style="flex:1;padding:8px;border-radius:8px;border:2px solid #444;
                 background:transparent;color:#fff;cursor:pointer;font-size:12px;">
          Período
        </button>
      </div>

      <div id="painelHoje" style="margin-bottom:16px;">
        <p style="color:#aaa;font-size:13px;margin:0;">
          Agendará para <strong style="color:#fff;">${formatarData(hoje)}</strong>.
        </p>
      </div>

      <div id="painelData" style="display:none;margin-bottom:16px;">
        <label style="font-size:13px;color:#aaa;">Escolha o dia:</label>
        <input type="date" id="dataEscolhida"
          min="${disp.dataInicio}" max="${disp.dataFim}" value="${hoje}"
          style="width:100%;margin-top:6px;padding:8px;border-radius:6px;
                 border:1px solid #444;background:#111;color:#fff;box-sizing:border-box;">
        <p id="avisoData" style="color:#f87171;font-size:12px;margin:6px 0 0;display:none;"></p>
      </div>

      <div id="painelPeriodo" style="display:none;margin-bottom:16px;">
        <label style="font-size:13px;color:#aaa;">De:</label>
        <input type="date" id="periodoInicio"
          min="${disp.dataInicio}" max="${disp.dataFim}" value="${hoje}"
          style="width:100%;margin-top:4px;margin-bottom:10px;padding:8px;border-radius:6px;
                 border:1px solid #444;background:#111;color:#fff;box-sizing:border-box;">
        <label style="font-size:13px;color:#aaa;">Até:</label>
        <input type="date" id="periodoFim"
          min="${disp.dataInicio}" max="${disp.dataFim}" value="${disp.dataFim}"
          style="width:100%;margin-top:4px;margin-bottom:10px;padding:8px;border-radius:6px;
                 border:1px solid #444;background:#111;color:#fff;box-sizing:border-box;">
        <label style="font-size:13px;color:#aaa;display:block;margin-bottom:6px;">Dias da semana:</label>
        <div id="diasPeriodo" style="display:flex;flex-wrap:wrap;gap:6px;">
          ${checkboxesDias}
        </div>
      </div>

      <button id="btnConfirmarAgendamento"
        style="width:100%;padding:10px;border-radius:8px;border:none;
               background:#7c3aed;color:#fff;font-size:14px;cursor:pointer;font-weight:bold;">
        Confirmar
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("btnFecharModal").addEventListener("click", () => modal.remove());
  document.getElementById("btnModoHoje").addEventListener("click", () => trocarModo("hoje"));
  document.getElementById("btnModoData").addEventListener("click", () => trocarModo("data"));
  document.getElementById("btnModoPeriodo").addEventListener("click", () => trocarModo("periodo"));
  document.getElementById("dataEscolhida").addEventListener("change", function() {
    validarDataEscolhida(this, disp.diasSemana, disp.dataInicio, disp.dataFim);
  });
  document.getElementById("btnConfirmarAgendamento").addEventListener("click", () => confirmarAgendamento(disp));
  modal.addEventListener("click", e => { if (e.target === modal) modal.remove(); });
}

// ── MODAL: Trocar modo ───────────────────────────────────────
function trocarModo(modo) {
  document.querySelectorAll(".modo-btn").forEach(btn => {
    const ativo = btn.dataset.modo === modo;
    btn.style.background  = ativo ? "#7c3aed" : "transparent";
    btn.style.borderColor = ativo ? "#5f1eda" : "#444";
  });
  document.getElementById("painelHoje").style.display    = modo === "hoje"    ? "block" : "none";
  document.getElementById("painelData").style.display    = modo === "data"    ? "block" : "none";
  document.getElementById("painelPeriodo").style.display = modo === "periodo" ? "block" : "none";
  document.getElementById("modoAgendamento").dataset.modoAtivo = modo;
}

// ── MODAL: Validar data escolhida ────────────────────────────
function validarDataEscolhida(input, diasSemana, dataInicio, dataFim) {
  const aviso = document.getElementById("avisoData");
  if (!diasSemana || diasSemana === "DIA_UNICO") { aviso.style.display = "none"; return; }

  const data = new Date(input.value + "T12:00:00");
  const diaSemana = data.getDay();
  const diasValidos = diasSemana.split(",").map(d => DIAS_MAP[d.trim()]);

  if (!diasValidos.includes(diaSemana)) {
    aviso.style.display = "block";
    aviso.textContent = `O motorista não atende neste dia. Disponível: ${
      diasSemana.split(",").map(d => d.trim().charAt(0) + d.trim().slice(1).toLowerCase()).join(", ")
    }`;
  } else {
    aviso.style.display = "none";
  }
}

// ── MODAL: Confirmar agendamento ─────────────────────────────
async function confirmarAgendamento(disp) {
  const usuario = window.usuarioLogado;
  if (!usuario) { mostrarFeedback("Você precisa estar logado.", "erro"); return; }

  const modoAtivo = document.getElementById("modoAgendamento")?.dataset.modoAtivo ?? "hoje";
  let datas = [];

  if (modoAtivo === "hoje") {
    const hoje = new Date().toISOString().split("T")[0];

    if (hoje < disp.dataInicio || hoje > disp.dataFim) {
      mostrarFeedback("Esta carona não está disponível hoje.", "erro");
      return;
    }

    if (disp.diasSemana && disp.diasSemana !== "DIA_UNICO") {
      const diaSemanaHoje = new Date(hoje + "T12:00:00").getDay();
      const diasValidos = disp.diasSemana.split(",").map(d => DIAS_MAP[d.trim()]);
      if (!diasValidos.includes(diaSemanaHoje)) {
        const nomeDias = disp.diasSemana.split(",")
          .map(d => d.trim().charAt(0) + d.trim().slice(1).toLowerCase()).join(", ");
        mostrarFeedback(`O motorista não atende hoje. Dias disponíveis: ${nomeDias}`, "erro");
        return;
      }
    }
    datas = [hoje];

  } else if (modoAtivo === "data") {
    const dataEscolhida = document.getElementById("dataEscolhida").value;
    if (!dataEscolhida) { mostrarFeedback("Escolha uma data.", "erro"); return; }
    if (document.getElementById("avisoData").style.display !== "none") {
      mostrarFeedback("Escolha um dia em que o motorista está disponível.", "erro");
      return;
    }
    datas = [dataEscolhida];

  } else {
    // Modo período — lê os checkboxes marcados pelo passageiro
    const inicio = new Date(document.getElementById("periodoInicio").value + "T12:00:00");
    const fim    = new Date(document.getElementById("periodoFim").value + "T12:00:00");

    if (fim < inicio) {
      mostrarFeedback("A data de fim deve ser após a data de início.", "erro");
      return;
    }

    const checkboxesMarcados = document.querySelectorAll("#diasPeriodo input[type=checkbox]:checked");
    if (checkboxesMarcados.length === 0) {
      mostrarFeedback("Selecione ao menos um dia da semana.", "erro");
      return;
    }
    const diasValidos = Array.from(checkboxesMarcados).map(cb => DIAS_MAP[cb.dataset.dia.trim()]);

    const cursor = new Date(inicio);
    while (cursor <= fim) {
      if (diasValidos.includes(cursor.getDay())) {
        datas.push(cursor.toISOString().split("T")[0]);
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    if (datas.length === 0) {
      mostrarFeedback("Nenhum dia disponível neste período.", "erro");
      return;
    }
  }

  document.getElementById("modalAgendamento")?.remove();

  let sucessos = 0;
  const erros = [];

  for (const data of datas) {
    try {
      await agendarParaData(disp, data, usuario.id);
      sucessos++;
    } catch (err) {
      erros.push(`${formatarData(data)}: ${err.message}`);
    }
  }

  if (sucessos > 0) {
    mostrarFeedback(`${sucessos} corrida${sucessos > 1 ? "s" : ""} agendada${sucessos > 1 ? "s" : ""} com sucesso! 🚗`);
    carregarDisponibilidades();
    if (typeof carregarDadosCalendario === "function") carregarDadosCalendario();
  }
  if (erros.length > 0) {
    setTimeout(() => mostrarFeedback(erros[0], "erro"), 500);
  }
}

// ── Agendar para uma data específica ─────────────────────────
async function agendarParaData(disp, data, usuarioId) {
  const dataHoraISO = `${data}T${disp.horarioIda}:00`;

  const resExistente = await fetch(`${API}/corridas/motorista/${disp.motoristaId}/data/${data}`);

  let corridaId;
  if (resExistente.ok) {
    corridaId = (await resExistente.json()).id;
  } else {
    const resNova = await fetch(`${API}/corridas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        motorista:        { id: disp.motoristaId },
        origem:           disp.pontoPartida,
        destino:          "Instituição",
        dataHora:         dataHoraISO,
        vagasDisponiveis: disp.vagasDisponiveis
      })
    });
    if (!resNova.ok) throw new Error("Erro ao criar corrida");
    corridaId = (await resNova.json()).id;
  }

  const resEntrar = await fetch(`${API}/corridas/${corridaId}/entrar/${usuarioId}`, { method: "POST" });
  if (!resEntrar.ok) {
    const txt = await resEntrar.text();
    let msg = txt;
    try { const p = JSON.parse(txt); if (p?.message) msg = p.message; } catch {}
    throw new Error(msg);
  }
}

// ── Inicialização ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const btnSalvar = document.querySelector("#painelMotorista .btn-salvar");
  if (btnSalvar) btnSalvar.addEventListener("click", salvarDisponibilidade);

  const btnBuscar = document.querySelector("#painelPassageiro .btn-buscar");
  if (btnBuscar) btnBuscar.addEventListener("click", carregarDisponibilidades);

  const painelPassageiro = document.getElementById("painelPassageiro");
  if (painelPassageiro && painelPassageiro.style.display !== "none") {
    carregarDisponibilidades();
  }

  const hoje = new Date().toISOString().split("T")[0];
  const dataInicioEl = document.getElementById("dataInicio");
  const dataFimEl    = document.getElementById("dataFim");

  if (dataInicioEl) { dataInicioEl.min = hoje; dataInicioEl.value = hoje; }
  if (dataFimEl) {
    dataFimEl.min = hoje;
    const umMes = new Date();
    umMes.setMonth(umMes.getMonth() + 1);
    dataFimEl.value = umMes.toISOString().split("T")[0];
  }

  if (dataInicioEl && dataFimEl) {
    dataInicioEl.addEventListener("change", () => {
      if (dataFimEl.value < dataInicioEl.value) dataFimEl.value = dataInicioEl.value;
      dataFimEl.min = dataInicioEl.value;
    });
  }
});