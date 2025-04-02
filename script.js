let inMenu = true;
let currentIndex = 0;
const totalCards = 11;
let hovering = false;
let down = true;
let up = false;
let left = false;
let right = true;
let deactivate = true;

let launcherKey = "launcherSHO";
let musicKey = "musicOnOff";
let soundKey = "soundOnOff";

let launcherSHO = localStorage.getItem(launcherKey);
let playMusic = localStorage.getItem(musicKey);
let playSound = localStorage.getItem(soundKey);

const select = new Audio('sounds/blip.wav');
const error = new Audio('sounds/error.wav');
const bm = new Audio('sounds/background.wav');
const back = new Audio('sounds/back.wav');

bm.volume = 0.75;
bm.loop = true;

const cardSelector = document.querySelectorAll('.game-card');
const cardSelectorSource = document.querySelectorAll('.game-card a');
const menu = document.getElementById("menu");
const selection = document.getElementById("selection");
const options = document.querySelector('.launcher-options');
const musicIcon = document.querySelector('.music');
const soundIcon = document.querySelector('.sound');
const steamlinks = [
    'steam://run/319510',
    'steam://run/332800',
    'steam://run/354140',
    'steam://run/388090',
    "javascript:alert('Sorry! We have not added a way to launch FNAF World yet...');",
    'steam://run/506610',
    'steam://run/738060',
    'steam://run/871720',
    'steam://run/732690',
    'steam://run/747660',
    'steam://run/2287520'
]
const htmllinks = [
    'https://irv77.github.io/hd_fnaf/1/',
    'https://irv77.github.io/hd_fnaf/2/',
    'https://irv77.github.io/hd_fnaf/3/',
    'https://irv77.github.io/hd_fnaf/4/',
    'https://irv77.github.io/hd_fnaf/w/',
    "javascript:alert('Sorry! We have not added Sister Location to web browser yet...');",
    'https://irv77.github.io/hd_fnaf/ps/',
    'https://irv77.github.io/hd_fnaf/ucn/',
    "javascript:alert('Sorry! There is not Help Wanted 1 in web browser...');",
    "javascript:alert('Sorry! There is not Security Breach in web browser...');",
    "javascript:alert('Sorry! There is not Help Wanted 2 in web browser...');"
]

if (!launcherSHO) { launcherSHO = 'steam'; localStorage.setItem(launcherKey, launcherSHO); }
if (!playMusic) { playMusic = 'true'; localStorage.setItem(musicKey, playMusic); }
if (!playSound) { playSound = 'true'; localStorage.setItem(soundKey, playSound); }

if (launcherSHO === 'off') { options.src = 'images/icons/launcher-off.svg'; }
if (launcherSHO === 'html') { options.src = 'images/icons/launcher-html.svg'; }
if (launcherSHO === 'steam') { options.src = 'images/icons/launcher-steam.svg'; }
if (playMusic === 'true') { musicIcon.src = 'images/icons/music.svg'; }
if (playMusic === 'false') { musicIcon.src = 'images/icons/music-off.svg'; }
if (playSound === 'true') { soundIcon.src = 'images/icons/sound.svg'; }
if (playSound === 'false') { soundIcon.src = 'images/icons/sound-off.svg'; }

function activator() {
    if (playSound === 'true') { back.currentTime = 0; back.play(); }
    menu.style.display = "none";
    selection.style.display = "flex";
    inMenu = false;
    setTimeout(function () {
        updateCarousel();
    }, 100);
    if (playMusic === 'true') {
        bm.play();
    }
}

function deactivator() {
    if (deactivate === true) {
        if (playSound === 'true') { back.currentTime = 0; back.play(); }
        setTimeout(function () {
            bm.pause();
            error.currentTime = 0;
        }, 10);

        menu.style.display = "flex";
        selection.style.display = "none";
        inMenu = true;
        hovering = false;
        down = true;
        up = false;
        left = false;
        right = true;
        if (launcherSHO === 'html') { deactivate = false; }
        else if (launcherSHO === 'off') { deactivate = false; }
    }
    if (deactivate === false) { if (playSound === 'true') { back.currentTime = 0; back.play(); } }
}

document.addEventListener('keydown', function (event) {
    if (inMenu === false && event.keyCode == 37) { if (left === true) { gameSelection('left') } if (left === false) { if (playSound === 'true') { error.currentTime = 0; error.play(); } } if (currentIndex - 1 < 0) { left = false; } right = true }
    if (inMenu === false && event.keyCode == 39) { if (right === true) { gameSelection('right') } if (right === false) { if (playSound === 'true') { error.currentTime = 0; error.play(); } } if (currentIndex + 1 > 10) { right = false; } left = true }
    if (inMenu === false && event.keyCode == 40) { if (down === true) { playButtonHover(true); } if (down === false) { if (playSound === 'true') { error.currentTime = 0; error.play(); } } down = false; up = true }
    if (inMenu === false && event.keyCode == 38) { if (up === true) { playButtonHover(); } if (up === false) { if (playSound === 'true') { error.currentTime = 0; error.play(); } } up = false; down = true }
    if (event.keyCode == 13) { if (inMenu === true) { activator(); } if (inMenu === false && hovering === true) { if (launcherSHO === 'steam') { window.open(steamlinks[currentIndex], "_self"); } if (launcherSHO === 'html') { window.open(htmllinks[currentIndex], "_self"); } if (launcherSHO === 'off') { } deactivator() } }
    if (inMenu === false && event.keyCode == 32) { if (hovering === true) { if (launcherSHO === 'steam') { window.open(steamlinks[currentIndex], "_self"); } if (launcherSHO === 'html') { window.open(htmllinks[currentIndex], "_self"); } if (launcherSHO === 'off') { } deactivator() } }
    if (inMenu === false && event.keyCode == 27) { deactivate = true; deactivator(); }
})

function gameSelection(direction) {
    if (direction === "left" && currentIndex - 1 > -1) { changeGameSelected(currentIndex - 1); }
    if (direction === "right" && currentIndex + 1 < 11) { changeGameSelected(currentIndex + 1); }
}

function playButtonHover(cancel) {
    cardSelector.forEach(card => card.classList.remove('hover'));
    hovering = false;
    if (playSound === 'true') {
        select.currentTime = 0;
        select.play();
    }
    if (cancel === true) { cardSelector[currentIndex].classList.add('hover'); hovering = true; }
}

function launcherOptions() {
    if (launcherSHO === 'steam') { launcherSHO = 'off'; options.src = 'images/icons/launcher-off.svg'; }
    else if (launcherSHO === 'off') { launcherSHO = 'html'; options.src = 'images/icons/launcher-html.svg'; }
    else if (launcherSHO === 'html') { launcherSHO = 'steam'; options.src = 'images/icons/launcher-steam.svg'; }
    localStorage.setItem(launcherKey, launcherSHO)
    changeGameSelected(currentIndex);
}

function musicOption() {
    if (playMusic === 'true') { playMusic = 'false'; bm.pause(); musicIcon.src = 'images/icons/music-off.svg'; localStorage.setItem(musicKey, playMusic) }
    else if (playMusic === 'false') { playMusic = 'true'; bm.play(); musicIcon.src = 'images/icons/music.svg'; localStorage.setItem(musicKey, playMusic) }
}

function soundOption() {
    if (playSound === 'true') { playSound = 'false'; soundIcon.src = 'images/icons/sound-off.svg'; localStorage.setItem(soundKey, playSound) }
    else if (playSound === 'false') { playSound = 'true'; soundIcon.src = 'images/icons/sound.svg'; localStorage.setItem(soundKey, playSound) }
}

function updateCarousel() {
    const slider = document.querySelector('.cards-section');
    const cardWidth = document.querySelector('.game-card').offsetWidth;
    const newPosition = -currentIndex * (cardWidth / 2 + 5);
    slider.style.transform = `translateX(${newPosition}px)`;
    changeGameSelected(currentIndex);
}

function changeGameSelected(index) {
    if (index > 0) { left = true; }
    changeIndex = index - currentIndex

    if (changeIndex < 0) {
        currentIndex = (currentIndex + changeIndex + totalCards) % totalCards;
        updateCarousel();
    }

    if (changeIndex > 0) {
        currentIndex = (currentIndex + changeIndex) % totalCards;
        updateCarousel();
    }
    if (playSound === 'true') {
        select.currentTime = 0;
        select.play();
    }
    cardSelector.forEach(card => card.classList.remove('scale1', 'scale2', 'scale3', 'scale4', 'scale5', 'scale6', 'scale7', 'scale8', 'scale9', 'scale10'));

    if (index - 1 > -1) { cardSelector[index - 1].classList.add('scale1'); }
    if (index + 1 < 11) { cardSelector[index + 1].classList.add('scale1'); }
    if (index - 2 > -1) { cardSelector[index - 2].classList.add('scale2'); }
    if (index + 2 < 11) { cardSelector[index + 2].classList.add('scale2'); }
    if (index - 3 > -1) { cardSelector[index - 3].classList.add('scale3'); }
    if (index + 3 < 11) { cardSelector[index + 3].classList.add('scale3'); }
    if (index - 4 > -1) { cardSelector[index - 4].classList.add('scale4'); }
    if (index + 4 < 11) { cardSelector[index + 4].classList.add('scale4'); }
    if (index - 5 > -1) { cardSelector[index - 5].classList.add('scale5'); }
    if (index + 5 < 11) { cardSelector[index + 5].classList.add('scale5'); }
    if (index - 6 > -1) { cardSelector[index - 6].classList.add('scale6'); }
    if (index + 6 < 11) { cardSelector[index + 6].classList.add('scale6'); }
    if (index - 7 > -1) { cardSelector[index - 7].classList.add('scale7'); }
    if (index + 7 < 11) { cardSelector[index + 7].classList.add('scale7'); }
    if (index - 8 > -1) { cardSelector[index - 8].classList.add('scale8'); }
    if (index + 8 < 11) { cardSelector[index + 8].classList.add('scale8'); }
    if (index - 9 > -1) { cardSelector[index - 9].classList.add('scale9'); }
    if (index + 9 < 11) { cardSelector[index + 9].classList.add('scale9'); }
    if (index - 10 > -1) { cardSelector[index - 10].classList.add('scale10'); }
    if (index + 10 < 11) { cardSelector[index + 10].classList.add('scale10'); }

    if (launcherSHO === 'off') { cardSelectorSource.forEach(card => card.href = 'javascript:void(0)'); deactivate = false; }
    if (launcherSHO === 'html') { cardSelectorSource[index].href = htmllinks[index]; deactivate = false; }
    if (launcherSHO === 'steam') { cardSelectorSource[index].href = steamlinks[index]; deactivate = true; }

    const cardsSection = document.querySelector('.cards-section');
    const selectedCard = cardsSection.children[index];

    selectedCard.style.order = '0';

    cardSelector.forEach(card => card.classList.remove('selected'));

    cardSelector[index].classList.add('selected');

    cardSelector.forEach(card => card.classList.remove('hover'));
    if (hovering === true) {
        cardSelector[currentIndex].classList.add('hover');
    }
    else { hovering = false; }
}

function loaded() {
    setTimeout(function () {
        console.clear();
    }, 10);
    updateCarousel();
}

document.addEventListener('DOMContentLoaded', loaded);