let modoMotorista = true;

function alternarModo() {

    modoMotorista = !modoMotorista;

    const thumb = document.getElementById('toggleThumb');
    const track = document.getElementById('toggleTrack');
    const roleTag = document.getElementById('profileRoleTag');

    if (modoMotorista) {

        thumb.style.transform = 'translateX(26px)';
        track.style.background = 'rgba(148, 0, 126, 0.6)';

        roleTag.textContent = 'Motorista';

        roleTag.style.background = 'rgba(148,0,126,0.4)';

        document.getElementById('painelMotorista').style.display = 'block';

        document.getElementById('painelPassageiro').style.display = 'none';

    } else {

        thumb.style.transform = 'translateX(0px)';

        track.style.background = 'rgba(255, 0, 55, 0.4)';

        roleTag.textContent = 'Passageiro';

        roleTag.style.background = 'rgba(255,0,55,0.25)';

        document.getElementById('painelMotorista').style.display = 'none';

        document.getElementById('painelPassageiro').style.display = 'block';
    }

    renderCalendario();
}