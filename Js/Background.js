function RandomBackgroundDesu() {

    const Rando = Math.random();

    let ImagicusChoosen = "";

    if (Rando < 0.40) {
        ImagicusChoosen = 'DaBackground.webp';
    } else if (Rando < 0.80) {
        ImagicusChoosen = 'daBackGround.webp';
    } else if (Rando < 0.99) {
        ImagicusChoosen = 'DaBackGround.webp';
    } else {
        ImagicusChoosen = 'DaBackDaGround.webp';
    }

    const AllTheWay = `Keks_Und_Lols/${ImagicusChoosen}`;

    document.body.style.backgroundImage = `url('${AllTheWay}')`;
}