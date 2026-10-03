// =================================
// MEMORY MATCH
// =================================


// ---------- CARD COLLECTION ----------

const symbols = [
    "🍓",
    "🌸",
    "🍒",
    "🦋",
    "🌙",
    "⭐",
    "🍄",
    "🐚",
    "🌈",
    "💎",
    "🪐",
    "🌻"
];


// ---------- DIFFICULTIES ----------

const levels = {

    easy: 6,

    medium: 8,

    hard: 10

};


// ---------- GAME STATE ----------

let currentLevel = "easy";

let firstCard = null;
let secondCard = null;

let boardLocked = false;

let moves = 0;
let matches = 0;

let totalPairs = levels[currentLevel];

let seconds = 0;

let timer = null;

let gameStarted = false;


// ---------- ELEMENTS ----------

const board =
    document.getElementById("game-board");

const movesDisplay =
    document.getElementById("moves");

const pairsDisplay =
    document.getElementById("pairs");

const timerDisplay =
    document.getElementById("timer");

const restartButton =
    document.getElementById("restart");

const difficultyButtons =
    document.querySelectorAll(".difficulty-btn");

const winScreen =
    document.getElementById("win-screen");

const finalMoves =
    document.getElementById("final-moves");

const finalTime =
    document.getElementById("final-time");

const playAgain =
    document.getElementById("play-again");

const bestScoreDisplay =
    document.getElementById("best-score");


// =================================
// SHUFFLE
// =================================

function shuffle(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const randomIndex =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            array[i],
            array[randomIndex]
        ] =
        [
            array[randomIndex],
            array[i]
        ];

    }

    return array;
}


// =================================
// TIMER
// =================================

function startTimer() {

    timer =
        setInterval(function () {

            seconds++;

            timerDisplay.textContent =
                seconds + "s";

        }, 1000);

}


function stopTimer() {

    clearInterval(timer);

}


// =================================
// START GAME
// =================================

function startGame() {

    stopTimer();

    board.innerHTML = "";

    firstCard = null;
    secondCard = null;

    boardLocked = false;

    moves = 0;
    matches = 0;

    seconds = 0;

    gameStarted = false;

    totalPairs =
        levels[currentLevel];


    movesDisplay.textContent = "0";

    pairsDisplay.textContent =
        "0/" + totalPairs;

    timerDisplay.textContent = "0s";


    winScreen.classList.add("hidden");


    // Select symbols for difficulty

    const selectedSymbols =
        symbols.slice(0, totalPairs);


    // Duplicate them

    let cards = [
        ...selectedSymbols,
        ...selectedSymbols
    ];


    // Shuffle

    cards = shuffle(cards);


    // Change grid for difficulty

    if (currentLevel === "easy") {

        board.style.gridTemplateColumns =
            "repeat(4, 100px)";

    }

    else if (currentLevel === "medium") {

        board.style.gridTemplateColumns =
            "repeat(4, 100px)";

    }

    else {

        board.style.gridTemplateColumns =
            "repeat(5, 100px)";

    }


    // Create cards

    cards.forEach(function (symbol) {

        const card =
            document.createElement("button");


        card.classList.add("card");


        card.dataset.symbol =
            symbol;


        card.textContent = "?";


        card.addEventListener(
            "click",
            function () {

                flipCard(card);

            }
        );


        board.appendChild(card);

    });


    showBestScore();

}


// =================================
// FLIP CARD
// =================================

function flipCard(card) {

    if (boardLocked) {
        return;
    }


    if (
        card === firstCard ||
        card.classList.contains("matched")
    ) {

        return;

    }


    // Start timer with first move

    if (!gameStarted) {

        gameStarted = true;

        startTimer();

    }


    card.textContent =
        card.dataset.symbol;

    card.classList.add("flipped");


    // FIRST CARD

    if (!firstCard) {

        firstCard = card;

        return;

    }


    // SECOND CARD

    secondCard = card;

    moves++;

    movesDisplay.textContent =
        moves;

    boardLocked = true;


    checkCards();

}


// =================================
// CHECK MATCH
// =================================

function checkCards() {

    const isMatch =

        firstCard.dataset.symbol ===
        secondCard.dataset.symbol;


    if (isMatch) {

        matchedCards();

    }

    else {

        unmatchedCards();

    }

}


// =================================
// MATCHED
// =================================

function matchedCards() {

    firstCard.classList.add("matched");

    secondCard.classList.add("matched");


    matches++;


    pairsDisplay.textContent =
        matches +
        "/" +
        totalPairs;


    resetCards();


    if (matches === totalPairs) {

        setTimeout(
            finishGame,
            500
        );

    }

}


// =================================
// NOT MATCHED
// =================================

function unmatchedCards() {

    setTimeout(function () {

        firstCard.textContent = "?";

        secondCard.textContent = "?";


        firstCard.classList.remove(
            "flipped"
        );

        secondCard.classList.remove(
            "flipped"
        );


        resetCards();

    }, 800);

}


// =================================
// RESET SELECTION
// =================================

function resetCards() {

    firstCard = null;

    secondCard = null;

    boardLocked = false;

}


// =================================
// WIN GAME
// =================================

function finishGame() {

    stopTimer();


    finalMoves.textContent =
        moves;


    finalTime.textContent =
        seconds + "s";


    saveBestScore();


    winScreen.classList.remove(
        "hidden"
    );

}


// =================================
// BEST SCORE
// =================================

function saveBestScore() {

    const scoreKey =
        "memoryBest_" +
        currentLevel;


    const currentScore = {
        moves: moves,
        time: seconds
    };


    const savedScore =
        JSON.parse(
            localStorage.getItem(
                scoreKey
            )
        );


    if (
        !savedScore ||
        moves < savedScore.moves ||
        (
            moves === savedScore.moves &&
            seconds < savedScore.time
        )
    ) {

        localStorage.setItem(
            scoreKey,
            JSON.stringify(
                currentScore
            )
        );

    }

}


function showBestScore() {

    const scoreKey =
        "memoryBest_" +
        currentLevel;


    const savedScore =
        JSON.parse(
            localStorage.getItem(
                scoreKey
            )
        );


    if (savedScore) {

        bestScoreDisplay.textContent =
            "🏆 Best: " +
            savedScore.moves +
            " moves • " +
            savedScore.time +
            "s";

    }

    else {

        bestScoreDisplay.textContent =
            "🏆 No best score yet";

    }

}


// =================================
// DIFFICULTY
// =================================

difficultyButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                currentLevel =
                    button.dataset.level;


                difficultyButtons.forEach(
                    function (btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                startGame();

            }
        );

    }
);


// =================================
// RESTART
// =================================

restartButton.addEventListener(
    "click",
    startGame
);


// =================================
// PLAY AGAIN
// =================================

playAgain.addEventListener(
    "click",
    startGame
);


// =================================
// INITIALIZE
// =================================

startGame();