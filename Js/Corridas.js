
const API = "http://localhost:8080";

const _dadosSalvos = localStorage.getItem("usuarioLogado");
if (_dadosSalvos) {
  window.usuarioLogado = JSON.parse(_dadosSalvos);
} else {
  window.location.href = "login.html";
}

// Toast de feedback 
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

//  salvar a disponibilidade

function salvarDisponibilidade() {
  const usuario = window.usuarioLogado;
  if (!usuario) { mostrarFeedback("Você precisa estar logado.", "erro"); return; }

  // Dias da semana marcados
  const checkboxesDias = document.querySelectorAll(
    "#painelMotorista .dias-semana-check input[type=checkbox]"
  );
  const nomesDias = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"];
  const diasSelecionados = [];
  checkboxesDias.forEach((cb, i) => { if (cb.checked) diasSelecionados.push(nomesDias[i]); });

  // Datas de início e fim
  const dataInicio = document.getElementById("dataInicio").value; // "YYYY-MM-DD"
  const dataFim    = document.getElementById("dataFim").value;

  if (!dataInicio || !dataFim) {
    mostrarFeedback("Informe a data de início e fim.", "erro");
    return;
  }

  if (dataFim < dataInicio) {
    mostrarFeedback("Data de fim não pode ser anterior à data de início.", "erro");
    return;
  }

  // Se dataInicio == dataFim é disponibilidade de um único dia
  // Nesse caso diasSemana pode ficar vazio — o backend aceita null
  const umDiaSo = dataInicio === dataFim;
  if (!umDiaSo && diasSelecionados.length === 0) {
    mostrarFeedback("Selecione ao menos um dia da semana.", "erro");
    return;
  }

  // Campos do formulário (ordem no HTML: texto, time, time, select)
  const inputs = document.querySelectorAll("#painelMotorista .form-input");
  const pontoPartida = inputs[0].value.trim();
  const horarioIda   = inputs[1].value;
  const horarioVolta = inputs[2].value;
  const vagas        = parseInt(inputs[3].value);

  if (!pontoPartida) { mostrarFeedback("Informe o ponto de partida.", "erro"); return; }
  if (!horarioIda)   { mostrarFeedback("Informe o horário de saída.", "erro"); return; }

  const payload = {
    motorista:        { id: usuario.id },
    diasSemana:       umDiaSo ? "" : diasSelecionados.join(","),
    pontoPartida,
    horarioIda,
    horarioVolta,
    vagasDisponiveis: vagas,
    dataInicio,   // "YYYY-MM-DD" — Spring converte automaticamente para LocalDate
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

//listar as disponibilidades para os passageiros

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
    // Formata dias da semana para exibição
    const diasFormatados = disp.diasSemana
      ? disp.diasSemana.split(",").map(d => d.charAt(0) + d.slice(1).toLowerCase()).join(", ")
      : "Dia único";

    // Formata período
    const periodoTexto = disp.dataInicio === disp.dataFim
      ? `📆 ${formatarData(disp.dataInicio)}`
      : `📆 ${formatarData(disp.dataInicio)} até ${formatarData(disp.dataFim)}`;

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
        <span>${periodoTexto}</span>
        <span class="vagas-badge">${disp.vagasDisponiveis} vaga${disp.vagasDisponiveis > 1 ? "s" : ""}</span>
      </div>
      <button class="btn-agendar" onclick="solicitarCarona(${disp.id}, ${disp.motorista?.id}, '${disp.pontoPartida}', '${disp.horarioIda}', ${disp.vagasDisponiveis})">
        Agendar
      </button>
    `;
    container.appendChild(card);
  });
}

// Formata "YYYY-MM-DD" → "DD/MM/YYYY"
function formatarData(dataISO) {
  if (!dataISO) return "—";
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

//agendar corrida do passageiro
async function solicitarCarona(dispId, motoristaId, pontoPartida, horarioIda, vagas) {
  const usuario = window.usuarioLogado;
  if (!usuario) { mostrarFeedback("Você precisa estar logado para agendar.", "erro"); return; }

  const hoje = new Date();
  const dataHoje    = `${hoje.getFullYear()}-${String(hoje.getMonth()+1).padStart(2,"0")}-${String(hoje.getDate()).padStart(2,"0")}`;
  const dataHoraISO = `${dataHoje}T${horarioIda}:00`;

  try {
    const resExistente = await fetch(`${API}/corridas/motorista/${motoristaId}/data/${dataHoje}`);

    let corridaId;

    if (resExistente.ok) {
      corridaId = (await resExistente.json()).id;
    } else {
      const resNova = await fetch(`${API}/corridas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motorista:        { id: motoristaId },
          origem:           pontoPartida,
          destino:          "Instituição",
          dataHora:         dataHoraISO,
          vagasDisponiveis: vagas
        })
      });
      if (!resNova.ok) throw new Error("Erro ao criar corrida");
      corridaId = (await resNova.json()).id;
    }

    const resEntrar = await fetch(`${API}/corridas/${corridaId}/entrar/${usuario.id}`, { method: "POST" });
    if (!resEntrar.ok) throw new Error(await resEntrar.text());

    mostrarFeedback("Carona agendada com sucesso! 🚗");
    carregarDisponibilidades();
    if (typeof carregarDadosCalendario === "function") carregarDadosCalendario();

  } catch (err) {
    let msg = "Erro ao agendar carona.";
    try { const p = JSON.parse(err.message); if (p?.message) msg = p.message; }
    catch { if (err.message) msg = err.message; }
    mostrarFeedback(msg, "erro");
  }
}

//Inicialização
document.addEventListener("DOMContentLoaded", () => {
  const btnSalvar = document.querySelector("#painelMotorista .btn-salvar");
  if (btnSalvar) btnSalvar.addEventListener("click", salvarDisponibilidade);

  const btnBuscar = document.querySelector("#painelPassageiro .btn-buscar");
  if (btnBuscar) btnBuscar.addEventListener("click", carregarDisponibilidades);

  const painelPassageiro = document.getElementById("painelPassageiro");
  if (painelPassageiro && painelPassageiro.style.display !== "none") {
    carregarDisponibilidades();
  }

  // Define data mínima dos campos de data como hoje
  const hoje = new Date().toISOString().split("T")[0];
  const dataInicioEl = document.getElementById("dataInicio");
  const dataFimEl    = document.getElementById("dataFim");
  if (dataInicioEl) {
    dataInicioEl.min   = hoje;
    dataInicioEl.value = hoje;
  }
  if (dataFimEl) {
    dataFimEl.min = hoje;
    // Padrão: 1 mês a partir de hoje
    const umMes = new Date();
    umMes.setMonth(umMes.getMonth() + 1);
    dataFimEl.value = umMes.toISOString().split("T")[0];
  }

  // Quando dataInicio muda, garante que dataFim não seja anterior
  if (dataInicioEl && dataFimEl) {
    dataInicioEl.addEventListener("change", () => {
      if (dataFimEl.value < dataInicioEl.value) {
        dataFimEl.value = dataInicioEl.value;
      }
      dataFimEl.min = dataInicioEl.value;
    });
  }
});