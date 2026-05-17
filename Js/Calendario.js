// ============================================================
//  Calendario.js — Integração com backend
//  Corrigido: suporta múltiplas corridas no mesmo dia
// ============================================================

const CAL_API = "http://localhost:8080";

const DIA_SEMANA_MAP = { 0:"DOM", 1:"SEG", 2:"TER", 3:"QUA", 4:"QUI", 5:"SEX", 6:"SAB" };

function chaveDataCal(ano, mes, dia) {
  return `${ano}-${String(mes+1).padStart(2,"0")}-${String(dia).padStart(2,"0")}`;
}

// Guarda listas de corridas por dia — chave é "YYYY-MM-DD", valor é array
// Ex: { "2026-05-16": [ corrida1, corrida2 ] }
let _corridasPorDia = {};

// ── Motorista: disponibilidades recorrentes por dia da semana ──
async function carregarEventosMotorista(usuario, ano, mes) {
  try {
    const res = await fetch(`${CAL_API}/disponibilidades/motorista/${usuario.id}`);
    if (!res.ok) return;

    const disponibilidades = await res.json();
    const totalDias = new Date(ano, mes + 1, 0).getDate();

    // Limpa eventos do mês atual antes de preencher
    Object.keys(eventosMotorista).forEach(k => {
      if (k.startsWith(`${ano}-${String(mes+1).padStart(2,"0")}`)) {
        delete eventosMotorista[k];
      }
    });

    disponibilidades
      .filter(d => d.ativa)
      .forEach(disp => {
        if (!disp.diasSemana) return;
        const dias = disp.diasSemana.split(",").map(d => d.trim());

        for (let d = 1; d <= totalDias; d++) {
          const diaSemana = new Date(ano, mes, d).getDay();
          if (dias.includes(DIA_SEMANA_MAP[diaSemana])) {
            const chave = chaveDataCal(ano, mes, d);
            eventosMotorista[chave] = {
              tipo: "disponivel",
              texto: `Saída ${disp.horarioIda} · ${disp.pontoPartida} · ${disp.vagasDisponiveis} vaga${disp.vagasDisponiveis > 1 ? "s" : ""}`
            };
          }
        }
      });

  } catch (e) {
    console.warn("Erro ao carregar disponibilidades:", e);
  }
}

// ── Passageiro: agrupa corridas por dia ──
async function carregarEventosPassageiro(usuario, ano, mes) {
  try {
    const res = await fetch(`${CAL_API}/corridas/passageiro/${usuario.id}`);
    if (!res.ok) return;

    const corridas = await res.json();

    // Limpa eventos do mês atual
    Object.keys(eventosPassageiro).forEach(k => {
      if (k.startsWith(`${ano}-${String(mes+1).padStart(2,"0")}`)) {
        delete eventosPassageiro[k];
      }
    });
    _corridasPorDia = {};

    corridas.forEach(corrida => {
      if (!corrida.dataHora) return;
      const dt = new Date(corrida.dataHora);
      if (dt.getMonth() !== mes || dt.getFullYear() !== ano) return;

      const chave = chaveDataCal(ano, mes, dt.getDate());
      const horario = dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

      // Acumula no array do dia
      if (!_corridasPorDia[chave]) _corridasPorDia[chave] = [];
      _corridasPorDia[chave].push({
        motorista: corrida.motorista?.nomeCompleto ?? "Motorista",
        horario,
        origem: corrida.origem ?? ""
      });
    });

    // Monta eventosPassageiro a partir do agrupamento
    Object.entries(_corridasPorDia).forEach(([chave, lista]) => {
      if (lista.length === 1) {
        eventosPassageiro[chave] = {
          tipo: "carona",
          texto: `Carona com ${lista[0].motorista} · ${lista[0].horario} · ${lista[0].origem}`
        };
      } else {
        // Mais de uma corrida no dia → resumo + lista no modal
        const detalhes = lista
          .map(c => `• ${c.motorista} · ${c.horario} · ${c.origem}`)
          .join("<br>");
        eventosPassageiro[chave] = {
          tipo: "carona",
          texto: `${lista.length} corridas neste dia:<br>${detalhes}`
        };
      }
    });

  } catch (e) {
    console.warn("Erro ao carregar corridas do passageiro:", e);
  }
}

// ── Função principal chamada pelo HTML ──
async function carregarDadosCalendario() {
  const usuario = window.usuarioLogado;
  if (!usuario) {
    renderCalendario();
    return;
  }

  if (modoMotorista) {
    await carregarEventosMotorista(usuario, anoAtual, mesAtual);
  } else {
    await carregarEventosPassageiro(usuario, anoAtual, mesAtual);
  }

  renderCalendario();
}

document.addEventListener("DOMContentLoaded", () => {
  carregarDadosCalendario();
});