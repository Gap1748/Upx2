window.onload = function() {

    RandomBackgroundDesu();

    renderCalendario();

    document.getElementById('toggleThumb')
        .style.transform = 'translateX(26px)';

    document.getElementById('toggleTrack')
        .style.background = 'rgba(148, 0, 126, 0.6)';
};


document.addEventListener('click', function(e) {

    if (e.target.classList.contains('periodo-btn')) {

        document.querySelectorAll('.periodo-btn')
            .forEach(b => b.classList.remove('active'));

        e.target.classList.add('active');
    }
});