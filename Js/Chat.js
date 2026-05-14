function abrirChat(contato) {

    document.querySelectorAll('.contact-item')
        .forEach(c => c.classList.remove('active'));

    event.currentTarget.classList.add('active');
}

function enviarMsg(e) {

    if (e.key === 'Enter') {
        enviarMsgBotao();
    }
}

function enviarMsgBotao() {

    const input = document.getElementById('chatInput');

    const texto = input.value.trim();

    if (!texto) return;

    const msgs = document.getElementById('chatMessages');

    const div = document.createElement('div');

    div.className = 'msg-sent';

    div.innerHTML = `<span>${texto}</span>`;

    msgs.appendChild(div);

    input.value = '';

    msgs.scrollTop = msgs.scrollHeight;
}