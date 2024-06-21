// выбор игры
const computerGame = document.querySelector('#computer-game');
const eachOtherGame = document.querySelector('#each-other-game');
const choosePlayer = document.querySelector('#choose-player');

const game = document.querySelector('#game-section');

// игра
const player = document.querySelector('#player2');
const comp = document.querySelector('#player-comp');

const playerName1 = document.querySelector('#player-name1');
const playerName2 = document.querySelector('#player-name2');

const nameInput1 = document.querySelector('#name1-input');
const nameInput2 = document.querySelector('#name2-input');

const compCity = document.querySelector('#computer-city');
const player1 = document.querySelector('#field1');
const player2 = document.querySelector('#field2');
const btn = document.querySelectorAll('#play');

const restartBtn = document.querySelector('#restart');
const returnBtn = document.querySelector('#return');

// подсказки
const letter = document.querySelector('#letter');
const message = document.querySelector('#message');
const mist = document.querySelector('#mistake');

let move = 0;
let lastLetter = '';
let rememberCityes = [];
let notLetters = 'ьъы';
let mistake = 0;
let typeGame;

async function getCities () {
    let url = 'assets/cities.json';
    let response = await fetch (url);
    let cities = await response.json();
    return await cities.city.map(element => element.name.toLowerCase())
}

function returnGame(){
    btn.forEach(item => {
        item.addEventListener('click', playCityGame);
    });
    player1.addEventListener('keyup', pressEnter);
    player2.addEventListener('keyup', pressEnter);
    move = 0;
    lastLetter = '';
    rememberCityes = [];
    mistake = 0;
    player1.value = '';
    player2.value = '';
    message.innerText = '';
    letter.innerText = 'Введите город';
    mist.innerText = '';
    compCity.innerHTML = '';
    player1.removeAttribute('disabled');
    game.classList.add('hidd');
    choosePlayer.classList.remove('hidd');
    restartBtn.classList.add('hidd');
    returnBtn.classList.add('hidd');
}

function restartGame(){
    btn.forEach(item => {
        item.addEventListener('click', playCityGame);
    });
    player1.addEventListener('keyup', pressEnter);
    player2.addEventListener('keyup', pressEnter);
    move = 0;
    lastLetter = '';
    rememberCityes = [];
    mistake = 0;
    player1.value = '';
    player2.value = '';
    message.innerText = '';
    letter.innerText = 'Введите город';
    mist.innerText = '';
    compCity.innerHTML = '';
    player1.removeAttribute('disabled');
    restartBtn.classList.add('hidd');
    returnBtn.classList.add('hidd');
}

function playComputer (){
    choosePlayer.classList.add('hidd');
    game.classList.remove('hidd');
    player.classList.add('hidd');
    comp.classList.remove('hidd');
    typeGame = 1;
}

function playFriend (){
    choosePlayer.classList.add('hidd');
    game.classList.remove('hidd');
    player.classList.remove('hidd');
    comp.classList.add('hidd');
    typeGame = 2;
}

function countMistakes(mis, mov){
    if (mis >= 3){
        restartBtn.classList.remove('hidd');
        returnBtn.classList.remove('hidd');
        btn.forEach(item => {
            item.removeEventListener('click', playCityGame);
        });
        player1.removeEventListener('keyup', pressEnter);
        player2.removeEventListener('keyup', pressEnter);
        if (typeGame === 1) {
            message.innerText = `Вы проиграли`;
        } else {
            message.innerText = (mov%2 == 0) ? `Победил ${playerName2.innerText}` : `Победил ${playerName1.innerText}`;
        }
    }
}

async function moveComputer(){
    let cities = await getCities();
    let compWord = cities.find((item) => item[0] === lastLetter && !rememberCityes.includes(item));
    if (compWord){
        rememberCityes.push(compWord);
        lastLetter = notLetters.includes(compWord[compWord.length-1]) ? compWord[compWord.length-2] : compWord[compWord.length-1];
        letter.innerHTML = 'Введите город на букву:  ' + `<b>${lastLetter.toUpperCase()}</b>`;
        let colorIndex = compWord.lastIndexOf(lastLetter);
        console.log(colorIndex);
        console.log(compCity.innerText[colorIndex]);
        compCity.innerHTML = `${compWord[0].toUpperCase()}` + `${compWord.slice(1, colorIndex)}` + `<b>${compWord[colorIndex]}</b>`
        player1.value = '';
        player1.focus();
    } else {
        message.innerText = `Вы победили`
    };
}

async function playCityGame(){
    let cities = await getCities();
    let player;
    let rival;
    console.log(rememberCityes)
    if (typeGame === 1){
         player = player1;
    } else {
        player = (move%2 == 0) ? player1 : player2;
        rival = (move%2 == 0) ? player2 : player1;
    }
    if (player.value){
        console.log(player.value);
        message.innerText = '';
        let cityName = player.value.toLowerCase();
        if (cities.includes(cityName)){
            if (rememberCityes.includes(cityName)){
                console.log(rememberCityes)
                message.innerText = 'Уже называли';
                mistake++;
                mist.innerText = `${mistake} ошибка`;
                player.value = '';
                player.focus();
                countMistakes(mistake, move);
                return
            } else {
                let firstLetter = cityName[0];
                if (lastLetter === '' || firstLetter === lastLetter){
                    lastLetter = notLetters.includes(cityName[cityName.length-1]) ? cityName[cityName.length-2] : cityName[cityName.length-1];
                } else {
                    message.innerText = `Введите город на букву ${lastLetter.toUpperCase()}`
                    player.value = '';
                    player.focus();
                    mistake++;
                    mist.innerText = `${mistake} ошибка`;
                    countMistakes(mistake, move);
                    return
                }
                rememberCityes.push(cityName);
                
                if (typeGame === 1){
                    mistake = 0;
                    mist.innerText = '';
                    moveComputer();
                } else {
                    letter.innerHTML = 'Введите город на букву:  ' + `<b>${lastLetter.toUpperCase()}</b>`;
                    player.setAttribute('disabled', '');
                    rival.removeAttribute('disabled');
                    rival.value = '';
                    mistake = 0;
                    mist.innerText = '';
                    rival.focus();
                }
            }
        } else {
            message.innerText = 'Неверный город';
            mistake++;
            mist.innerText = `${mistake} ошибка`;
            countMistakes(mistake, move);
            return
        }
    } else {
        message.innerText = 'Введите город';
        mistake++;
        mist.innerText = `${mistake} ошибка`;
        countMistakes(mistake, move)
        return
    }
    move++;
}

computerGame.addEventListener('click', playComputer);
eachOtherGame.addEventListener('click', playFriend);

playerName1.addEventListener('click', () => {
    playerName1.classList.add('hidd');
    nameInput1.classList.remove('hidd');
    nameInput1.focus();
});

playerName2.addEventListener('click', () => {
    playerName2.classList.add('hidd');
    nameInput2.classList.remove('hidd');
    nameInput2.focus();
});

nameInput1.addEventListener('blur', () => {
    if (nameInput1.value){
        playerName1.innerText = nameInput1.value;
    } else playerName1.innerText = 'Игрок 1';
    playerName1.classList.remove('hidd');
    nameInput1.classList.add('hidd');
});

nameInput2.addEventListener('blur', () => {
    if (nameInput2.value){
        playerName2.innerText = nameInput2.value;
    } else playerName2.innerText = 'Игрок 2';
    playerName2.classList.remove('hidd');
    nameInput2.classList.add('hidd'); 
});

const pressEnter = (event) => {
    if (event.code === 'Enter') {
        console.log('press enter');
        playCityGame();
    }
}

player1.addEventListener('keyup', pressEnter);
player2.addEventListener('keyup', pressEnter);

btn.forEach(item => {
    item.addEventListener('click', playCityGame);
});

restartBtn.addEventListener('click', restartGame)
returnBtn.addEventListener('click', returnGame);