function abrirModal(dia, evento) {

    document.getElementById('modalTitulo').textContent =
        `${dia}/${mesAtual+1}/${anoAtual}`;

    document.getElementById('modalConteudo').innerHTML =
        `<p>${evento.texto}</p>`;

    document.getElementById('modalOverlay')
        .classList.add('ativo');
}

function fecharModal() {

    document.getElementById('modalOverlay')
        .classList.remove('ativo');
}