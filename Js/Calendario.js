const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

let mesAtual = new Date().getMonth();

let anoAtual = new Date().getFullYear();

const hoje = new Date();


// Eventos de exemplo

const eventosMotorista = {

'2026-05-06': { tipo: 'disponivel', texto: 'Saída 19h · 2 passageiros' },

'2026-05-07': { tipo: 'disponivel', texto: 'Saída 19h · 1 passageiro' },

'2026-05-08': { tipo: 'disponivel', texto: 'Saída 19h · 3 passageiros' },

'2026-05-09': { tipo: 'disponivel', texto: 'Saída 19h · 2 passageiros' },

'2026-05-12': { tipo: 'disponivel', texto: 'Saída 19h · 2 passageiros' },

'2026-05-13': { tipo: 'disponivel', texto: 'Saída 19h · 0 passageiros' },

'2026-05-14': { tipo: 'disponivel', texto: 'Saída 19h · 1 passageiro' },

'2026-05-15': { tipo: 'folga', texto: 'Dia sem carona marcado' },

'2026-05-19': { tipo: 'disponivel', texto: 'Saída 19h · 3 passageiros' },

'2026-05-20': { tipo: 'disponivel', texto: 'Saída 19h · 2 passageiros' },

};


const eventosPassageiro = {

'2026-05-06': { tipo: 'carona', texto: 'Carona com Lucas F. · 19h00 · Av. Dr. Afonso Vergueiro, 1300' },

'2026-05-07': { tipo: 'carona', texto: 'Carona com Lucas F. · 19h00 · Av. Dr. Afonso Vergueiro, 1300' },

'2026-05-08': { tipo: 'carona', texto: 'Carona com Lucas F. · 19h00 · Av. Dr. Afonso Vergueiro, 1300' },

'2026-05-09': { tipo: 'carona', texto: 'Carona com Lucas F. · 19h00 · Av. Dr. Afonso Vergueiro, 1300' },

'2026-05-13': { tipo: 'carona', texto: 'Carona com Rafael M. · 19h00 · R. das Flores, 88' },

'2026-05-14': { tipo: 'carona', texto: 'Carona com Rafael M. · 19h00 · R. das Flores, 88' },

'2026-05-15': { tipo: 'aviso', texto: 'Sem carona agendada' },

'2026-05-20': { tipo: 'carona', texto: 'Carona com Lucas F. · 19h00 · Av. Dr. Afonso Vergueiro, 1300' },

};


function chaveData(ano, mes, dia) {

return `${ano}-${String(mes+1).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;

}


function renderCalendario() {

const titulo = document.getElementById('calTitulo');

titulo.textContent = `${meses[mesAtual]} ${anoAtual}`;


const grid = document.querySelector('.calendario-grid');

// Remover dias antigos (manter os 7 weekdays)

const cells = grid.querySelectorAll('.cal-day, .cal-empty');

cells.forEach(c => c.remove());


const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();

const totalDias = new Date(anoAtual, mesAtual + 1, 0).getDate();

const eventos = modoMotorista ? eventosMotorista : eventosPassageiro;


for (let i = 0; i < primeiroDia; i++) {

const empty = document.createElement('div');

empty.className = 'cal-empty';

grid.appendChild(empty);

}


for (let d = 1; d <= totalDias; d++) {

const cell = document.createElement('div');

cell.className = 'cal-day';

const chave = chaveData(anoAtual, mesAtual, d);

const evento = eventos[chave];


if (d === hoje.getDate() && mesAtual === hoje.getMonth() && anoAtual === hoje.getFullYear()) {

cell.classList.add('hoje');

}


if (evento) {

cell.classList.add('tem-evento', `evento-${evento.tipo}`);

cell.onclick = () => abrirModal(d, evento);

}


cell.innerHTML = `<span class="cal-num">${d}</span>${evento ? '<span class="cal-dot"></span>' : ''}`;

grid.appendChild(cell);

}

}


function mudarMes(direcao) {

mesAtual += direcao;

if (mesAtual > 11) { mesAtual = 0; anoAtual++; }

if (mesAtual < 0) { mesAtual = 11; anoAtual--; }

renderCalendario();

}
