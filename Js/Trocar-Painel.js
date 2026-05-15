
const API_URL = "http://localhost:8080";

// Troca para o painel motorista
// Se o usuário ainda não tiver cadastro de motorista → redireciona para motor1.html
// Se já tiver → mostra o painel motorista normalmente
async function trocarParaMotorista() {
    const usuario = window.usuarioLogado;
    if (!usuario) {
        alert("Você precisa estar logado.");
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch(`${API_URL}/motoristas/verificar/${usuario.id}`);

        if (res.status === 404) {
            // Não tem cadastro → manda para o cadastro
            window.location.href = "motor1.html";
            return;
        }

        if (!res.ok) {
            alert("Erro ao verificar cadastro. Tente novamente.");
            return;
        }

        // Tem cadastro → mostra o painel motorista
        mostrarPainel("motorista");

    } catch (error) {
        console.error(error);
        alert("Erro na conexão com o servidor.");
    }
}

// Troca para o painel passageiro e já carrega as caronas disponíveis
function trocarParaPassageiro() {
    mostrarPainel("passageiro");
    // carregarDisponibilidades() está definida no corridas.js
    if (typeof carregarDisponibilidades === "function") {
        carregarDisponibilidades();
    }
}

// Alterna a visibilidade dos painéis
function mostrarPainel(modo) {
    const painelMotorista  = document.getElementById("painelMotorista");
    const painelPassageiro = document.getElementById("painelPassageiro");

    if (!painelMotorista || !painelPassageiro) {
        console.warn("Painéis não encontrados no HTML.");
        return;
    }

    if (modo === "motorista") {
        painelMotorista.style.display  = "block";
        painelPassageiro.style.display = "none";
    } else {
        painelMotorista.style.display  = "none";
        painelPassageiro.style.display = "block";
    }
}