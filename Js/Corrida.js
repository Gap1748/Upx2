document.querySelector(".btn-salvar")
.addEventListener("click", async function () {

    const motoristaId =
        localStorage.getItem("motoristaId");

    const pontoPartida =
        document.querySelector('input[placeholder*="Av."]').value;

    const horarios =
        document.querySelectorAll('input[type="time"]');

    const horarioIda = horarios[0].value;

    const horarioVolta = horarios[1].value;

    const vagas =
        document.querySelector("select").value;

    const vagasNumero = parseInt(vagas);

    const corrida = {

        motoristaId: motoristaId,

        pontoPartida: pontoPartida,

        horarioIda: horarioIda,

        horarioVolta: horarioVolta,

        vagasDisponiveis: vagasNumero
    };

    // Recupera o usuário logado ao carregar a página
const _dadosSalvos = localStorage.getItem("usuarioLogado");
if (_dadosSalvos) {
window.usuarioLogado = JSON.parse(_dadosSalvos);
}

    try {

        const response = await fetch(
            "http://localhost:8080/corridas",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(corrida)
            }
        );

        if (response.ok) {

            alert("Corrida cadastrada!");

        } else {

            const erro = await response.text();

            alert("Erro: " + erro);
        }

    } catch (error) {

        console.error(error);

        alert("Erro ao conectar com servidor");
    }
});