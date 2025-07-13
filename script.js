
let deckId = "";
let playerScore = 0;
let computerScore = 0;
let dotInterval;

fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
  .then((res) => res.json())
  .then((data) => {
    deckId = data.deck_id;
  });

const valueMap = {
  ACE: 14,
  KING: 13,
  QUEEN: 12,
  JACK: 11,
};

function getCardValue(value) {
  return valueMap[value] || parseInt(value);
}

function startDotAnimation(button) {
  let dotCount = 0;
  dotInterval = setInterval(() => {
    dotCount = (dotCount + 1) % 4;
    button.textContent = "Drawing" + ".".repeat(dotCount);
  }, 400);
}

function stopDotAnimation(button) {
  clearInterval(dotInterval);
  button.textContent = "Draw Cards";
}

function drawCards() {
  const loader = document.getElementById("loader");
  const drawBtn = document.getElementById("drawCards");

  loader.style.display = "block";
  drawBtn.disabled = true;
  startDotAnimation(drawBtn);

  fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
    .then((res) => res.json())
    .then((data) => {
      const playerCard = data.cards[0];
      const computerCard = data.cards[1];

      const playerImg = document.getElementById("player-card");
      const computerImg = document.getElementById("computer-card");

      playerImg.src = playerCard.image;
      computerImg.src = computerCard.image;

      Promise.all([
        new Promise((resolve) => (playerImg.onload = resolve)),
        new Promise((resolve) => (computerImg.onload = resolve)),
      ]).then(() => {
        const playerVal = getCardValue(playerCard.value);
        const computerVal = getCardValue(computerCard.value);
        const resultText = document.getElementById("result-text");

        if (playerVal > computerVal) {
          playerScore++;
          resultText.textContent = "You Win!";
        } else if (playerVal < computerVal) {
          computerScore++;
          resultText.textContent = "Computer Wins!";
        } else {
          resultText.textContent = "It's a tie!";
        }

        document.getElementById("player-score").textContent = playerScore;
        document.getElementById("computer-score").textContent = computerScore;

        loader.style.display = "none";
        drawBtn.disabled = false;
        stopDotAnimation(drawBtn);
      });
    });
}
