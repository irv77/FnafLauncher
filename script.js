let currentIndex = 0;
const totalCards = 8;
let hovering = false;
let music = true;
let down = true;
let up = false;
let left = false;
let right = true;
let playMusic = true;
let playSound = true;

const select = new Audio('sounds/blip.wav');
const error = new Audio('sounds/error.wav');
const bm = new Audio('sounds/background.wav');

bm.volume = 0.75;
bm.loop = true;

const cardSelector = document.querySelectorAll('.game-card');
const gamelinks = [
    'fnaf1/',
    'fnaf2/',
    'fnaf3/',
    'fnaf4/',
    'fnafsl/',
    'fnafps/',
    'fnafw/',
    'fnafucn/'
]

document.onclick = function (e) { if (playMusic === true && music === true) { bm.play(); music = false } }
document.addEventListener('keydown', function (event) {
    if (playMusic === true && music === true) { bm.play(); music = false }
    if (event.keyCode == 37) { if (left === true) { gameSelection('left') } if (left === false) { if (playSound === true) { error.currentTime = 0; error.play(); } } if (currentIndex - 1 < 0) { left = false; } right = true }
    if (event.keyCode == 39) { if (right === true) { gameSelection('right') } if (right === false) { if (playSound === true) { error.currentTime = 0; error.play(); } } if (currentIndex + 1 > 7) { right = false; } left = true }
    if (event.keyCode == 40) { if (down === true) { playButtonHover(true); } if (down === false) { if (playSound === true) { error.currentTime = 0; error.play(); } } down = false; up = true }
    if (event.keyCode == 38) { if (up === true) { playButtonHover(); } if (up === false) { if (playSound === true) { error.currentTime = 0; error.play(); } } up = false; down = true }
    if (event.keyCode == 13) { if (hovering === true) { window.open(gamelinks[currentIndex], "_self") } }
})

function gameSelection(direction) {
    if (direction === "left" && currentIndex - 1 > -1) { changeGameSelected(currentIndex - 1); }
    if (direction === "right" && currentIndex + 1 < 8) { changeGameSelected(currentIndex + 1); }
}

function playButtonHover(cancel) {
    cardSelector.forEach(card => card.classList.remove('hover'));
    hovering = false;
    if (playSound === true) {
        select.currentTime = 0;
        select.play();
    }
    if (cancel === true) { cardSelector[currentIndex].classList.add('hover'); hovering = true; }
}

function musicOption() {
    let musicIcon = document.querySelector('.music');

    if (playMusic === true) { playMusic = false; bm.pause(); musicIcon.src = 'images/icons/music-off.svg'; }
    else if (playMusic === false) { playMusic = true; bm.play(); musicIcon.src = 'images/icons/music.svg'; }
}

function soundOption() {
    let soundIcon = document.querySelector('.sound');

    if (playSound === true) { playSound = false; soundIcon.src = 'images/icons/sound-off.svg'; }
    else if (playSound === false) { playSound = true; soundIcon.src = 'images/icons/sound.svg'; }
}

function updateCarousel() {
    const slider = document.querySelector('.cards-section');
    const cardWidth = document.querySelector('.game-card').offsetWidth;
    const newPosition = -currentIndex * (cardWidth / 2 + 5);
    slider.style.transform = `translateX(${newPosition}px)`;
    changeGameSelected(currentIndex);
}

function changeGameSelected(index) {
    changeIndex = index - currentIndex

    if (changeIndex < 0) {
        currentIndex = (currentIndex + changeIndex + totalCards) % totalCards;
        updateCarousel();
    }

    if (changeIndex > 0) {
        currentIndex = (currentIndex + changeIndex) % totalCards;
        updateCarousel();
    }
    if (playSound === true) {
        select.currentTime = 0;
        select.play();
    }
    cardSelector.forEach(card => card.classList.remove('scale1', 'scale2', 'scale3', 'scale4', 'scale5', 'scale6', 'scale7'));

    if (index - 1 > -1) { cardSelector[index - 1].classList.add('scale1'); }
    if (index + 1 < 8) { cardSelector[index + 1].classList.add('scale1'); }
    if (index - 2 > -1) { cardSelector[index - 2].classList.add('scale2'); }
    if (index + 2 < 8) { cardSelector[index + 2].classList.add('scale2'); }
    if (index - 3 > -1) { cardSelector[index - 3].classList.add('scale3'); }
    if (index + 3 < 8) { cardSelector[index + 3].classList.add('scale3'); }
    if (index - 4 > -1) { cardSelector[index - 4].classList.add('scale4'); }
    if (index + 4 < 8) { cardSelector[index + 4].classList.add('scale4'); }
    if (index - 5 > -1) { cardSelector[index - 5].classList.add('scale5'); }
    if (index + 5 < 8) { cardSelector[index + 5].classList.add('scale5'); }
    if (index - 6 > -1) { cardSelector[index - 6].classList.add('scale6'); }
    if (index + 6 < 8) { cardSelector[index + 6].classList.add('scale6'); }
    if (index - 7 > -1) { cardSelector[index - 7].classList.add('scale7'); }
    if (index + 7 < 8) { cardSelector[index + 7].classList.add('scale7'); }


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