const symbols = ['../images/bar.png', '../images/bell.png', '../images/cherry.png', '../images/grape.png', '../images/lemon.png', '../images/orange.png', '../images/plum.png', '../images/sevens.png', '../images/watermelon.png'];
const reels = [document.getElementById('reel1'), document.getElementById('reel2'), document.getElementById('reel3'), document.getElementById('reel4'), document.getElementById('reel5'), document.getElementById('reel6'), document.getElementById('reel7'), document.getElementById('reel8'), document.getElementById('reel9')];
const spinDuration = 1000; // milliseconds
let coins = 100000; // Starting score for the user
let stars = 0; // Starting stars for the user
let autoSpinInterval;

// Check if there's a previous score saved in sessionStorage
const savedCoins = sessionStorage.getItem('coins');
const savedStars = sessionStorage.getItem('stars');
if (savedCoins) {
    coins = parseInt(savedCoins);
    updateScoreDisplay();
}
if (savedStars) {
    stars = parseInt(savedStars);
    updateScoreDisplay();
}

function getRandomSymbol() {
    const randomIndex = Math.floor(Math.random() * symbols.length);
    return `url(${symbols[randomIndex]})`;
}

function spin() {
    const betInput = parseInt(document.getElementById('bet-q').textContent)
    if (betInput > coins) {
        return alert("You don't have enough coins to spin. Place a bet first.");
    } else {
        coins -= betInput;
        stars += 100;
        updateScoreDisplay();
    }

    document.getElementById('spinButton').disabled = true;
    document.getElementById('decreaseBet').disabled = true;
    document.getElementById('increaseBet').disabled = true;

    let spinsCompleted = 0;
    reels.forEach((reel) => {
        let startTime = Date.now();
        const interval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime >= spinDuration) {
                clearInterval(interval);
                const result = getRandomSymbol();
                reel.style.backgroundImage = result;
                spinsCompleted++;

                if (spinsCompleted === reels.length) {
                    // All reels have stopped spinning, now check for a win
                    checkWin();
                    document.getElementById('spinButton').disabled = false;
                }
            } else {
                reel.style.backgroundImage = getRandomSymbol();
            }
        }, 100);
    });
}

function autoSpin() {
    if (autoSpinInterval) {
        clearInterval(autoSpinInterval);
        autoSpinInterval = null;
        document.getElementById('spinButton').disabled = false;
        document.getElementById('autoButton').value = 'AUTO';
    } else {
        // Start auto-spinning
        const bet = parseInt(document.getElementById('bet-q').textContent);
        if (bet <= coins) {
            autoSpinInterval = setInterval(() => {
                if (bet <= coins) { // Check if there are enough coins for the current spin
                    spin();
                } else {
                    clearInterval(autoSpinInterval); // Stop the auto-spinning if there are not enough coins
                    autoSpinInterval = null;
                    alert("You don't have enough coins to continue auto-spinning.");
                    document.getElementById('autoButton').value = 'AUTO';
                    document.getElementById('autoButton').disabled = true;
                    document.getElementById('spinButton').disabled = false;
                }
            }, spinDuration + 300);
            document.getElementById('spinButton').disabled = true;
            document.getElementById('autoButton').value = 'STOP';
        } else {
            alert("You don't have enough coins to continue auto-spinning.");
            document.getElementById('autoButton').value = 'AUTO';
            document.getElementById('autoButton').disabled = true;
        }
    }
}

function checkWin() {
    const symbolsDisplayed = reels.map((reel) => reel.style.backgroundImage);
    if (symbolsDisplayed[3] === symbolsDisplayed[4] && symbolsDisplayed[4] === symbolsDisplayed[5]) {
        // User wins! Increment the score based on the bet.
        const bet = parseInt(document.getElementById('bet-q').textContent);
        const winHTML = "<div id=\"win\"><p class=\"win-txt\">WIN</p><p id=\"win-q\">" + (bet * 5) + "</p></div>"
        showWinMsg(winHTML);
        coins += bet * 5;
        updateScoreDisplay();
    }

    saveScoreInSession();

    document.getElementById('spinButton').disabled = false;
    document.getElementById('decreaseBet').disabled = false;
    document.getElementById('increaseBet').disabled = false;
}

function showWinMsg(html) {
    const messageElement = document.getElementById('win-msg');
    messageElement.innerHTML = html;
    messageElement.classList.add('show');

    setTimeout(() => {
        messageElement.classList.remove('show');
    }, 2000);
}

function decreaseBet() {
    const betInput = document.getElementById('bet-q');
    if ((parseInt(betInput.textContent) - 1000) >= 1000) {
        betInput.textContent = parseInt(betInput.textContent) - 1000;
    } else {
        alert("Bet cannot be 0 or negative");
        return;
    }
}

function increaseBet() {
    const betInput = document.getElementById('bet-q');
    if ((parseInt(betInput.textContent) + 1000) <= coins) {
        betInput.textContent = parseInt(betInput.textContent) + 1000;
    } else {
        alert("You don't have so much coins");
        return;
    }
}

function updateScoreDisplay() {
    const coinsDisplay = document.getElementById('coins-q');
    coinsDisplay.textContent = `${coins}`;
    const starsDisplay = document.getElementById('stars-q');
    starsDisplay.textContent = `${stars}`;
}

function saveScoreInSession() {
    sessionStorage.setItem('coins', coins.toString());
    sessionStorage.setItem('stars', stars.toString());
}

reels.forEach((reel) => {
        reel.style.backgroundImage = getRandomSymbol();
    }
)