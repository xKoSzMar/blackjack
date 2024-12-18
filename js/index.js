// Main data object
const data = {
  mainDisplay: document.querySelector("#display"),
  otherDisplays: document.querySelectorAll(".inGameDisplay"),
  croupier: document.querySelector("#croupier"),
  cardsDisp: document.querySelector("#cards"),
  sumDisp: document.querySelector("#sum"),
  betDisp: document.querySelector("#bet"),
  input: document.querySelector("#input"),
  ngButton: document.querySelector("#new_game"),
  dcButton: document.querySelector("#draw_card"),
  sButton: document.querySelector("#stand"),
  cards: ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
  cardColors: ["♠️", "♣️", "♥️", "♦️"],
  cardsUsed: [],
  currentCards: [],
  croupierSum: 0,
  playerSum: 0,
  sum: 0,
  balance: 0,
  croupier3rdCard: false,
  player3rdCard: false,
};

// Event listeners for buttons
data.ngButton.addEventListener("click", check);
data.dcButton.addEventListener("click", draw);
data.sButton.addEventListener("click", stand);

// Check function
function check() {
  if (parseInt(data.input.value) === 0) {
    data.mainDisplay.textContent = "The stake must be greater than 0!";
  } else if (isNaN(data.input.value) || data.input.value[0] == 0) {
    data.mainDisplay.textContent = "Enter the correct stake!";
  } else if (data.input.value === "") {
    data.mainDisplay.textContent = "This field cannot be empty!";
  } else if (parseInt(data.input.value) < 0) {
    data.mainDisplay.textContent = "The stake cannot be negative!";
  } else {
    blackJack();
  }
}

// Game function
function blackJack() {
  // Card picking function for croupier
  drawCard();
  drawCard();

  // Parse and sum function for croupier
  parseAndSum();
  data.croupierSum = data.sum;
  data.sum = 0;

  // Card picking function for player
  drawCard();
  drawCard();

  // Parse and sum function for player
  parseAndSum();
  data.playerSum = data.sum;
  data.sum = 0;

  // Change in display
  data.input.style.display = "none";
  data.ngButton.style.display = "none";
  data.dcButton.style.display = "block";
  data.sButton.style.display = "block";
  for (let i = 0; i < data.otherDisplays.length; i++) {
    data.otherDisplays[i].style.display = "block";
  }
  data.mainDisplay.textContent = "Do you want to draw a card or stand?";
  data.croupier.textContent = `Croupier cards: ${data.cardsUsed[0]}, ?`;
  data.cardsDisp.textContent = `Cards: ${data.cardsUsed[2]}, ${data.cardsUsed[3]}`;
  data.sumDisp.textContent = `Sum: ${String(data.playerSum)}`;
  data.balance = parseInt(data.input.value);
  data.betDisp.textContent = `Bet: $${data.input.value}`;

  // Point checker
  if (data.playerSum > 21 || data.croupierSum > 21) {
    pointChecker();
  }
}

// Draw card function
function drawCard() {
  let card =
    data.cards[Math.floor(Math.random() * data.cards.length)] +
    data.cardColors[Math.floor(Math.random() * data.cardColors.length)];
  while (data.cardsUsed.includes(card)) {
    card =
      data.cards[Math.floor(Math.random() * data.cards.length)] +
      data.cardColors[Math.floor(Math.random() * data.cardColors.length)];
  }
  data.cardsUsed.push(card);
  data.currentCards.push(card);
}

// Parse and sum score function
function parseAndSum() {
  // Parser
  for (let i = 0; i < data.currentCards.length; i++) {
    if (data.currentCards[i][0] === "A") {
      data.sum += 11;
    } else if (
      (data.currentCards[i][0] === "1" && data.currentCards[i][1] === "0") ||
      data.currentCards[i][0] === "J" ||
      data.currentCards[i][0] === "Q" ||
      data.currentCards[i][0] === "K"
    ) {
      data.sum += 10;
    } else {
      data.sum += parseInt(data.currentCards[i][0]);
    }
  }
  data.currentCards = [];
}

// Point checker function
function pointChecker() {
  if (data.playerSum > 21) {
    data.mainDisplay.textContent = `You lost $${String(data.balance)}`;
    startDisplay();
  } else if (data.croupierSum > 21) {
    data.balance *= 1.5;
    data.mainDisplay.textContent = `You have won $${String(data.balance)}!`;
    startDisplay();
  } else if (data.playerSum === 21 && data.croupierSum === 21) {
    data.mainDisplay.textContent = `Tie! Your bet $${String(
      data.balance
    )} has been returned`;
    startDisplay();
  } else if (data.croupierSum === 21 && data.playerSum != 21) {
    data.mainDisplay.textContent = `You lost $${String(data.balance)}`;
    startDisplay();
  } else if (data.playerSum === 21 && data.croupierSum != 21) {
    data.balance *= 2;
    data.mainDisplay.textContent = `Blackjack! You have won $${String(
      data.balance
    )}!`;
    startDisplay();
  } else {
    if (data.playerSum > data.croupierSum) {
      data.balance *= 1.5;
      data.mainDisplay.textContent = `You have won $${String(data.balance)}!`;
      startDisplay();
    } else if (data.playerSum === data.croupierSum) {
      data.mainDisplay.textContent = `Tie! Your bet $${String(
        data.balance
      )} has been returned`;
      startDisplay();
    } else {
      data.mainDisplay.textContent = `You lost $${String(data.balance)}`;
      startDisplay();
    }
  }
}

// Start display function
function startDisplay() {
  data.input.style.display = "block";
  data.ngButton.style.display = "block";
  data.dcButton.style.display = "none";
  data.sButton.style.display = "none";
  data.otherDisplays[3].style.display = "none";
  if (data.croupier3rdCard === false) {
    data.croupier.textContent = `Croupier cards: ${data.cardsUsed[0]}, ${data.cardsUsed[1]}`;
  } else {
    data.croupier.textContent = `Croupier cards: ${data.cardsUsed[0]}, ${data.cardsUsed[1]}, ${data.cardsUsed[4]}`;
  }
  if (data.player3rdCard === true && data.croupier3rdCard === true) {
    data.cardsDisp.textContent = `Cards: ${data.cardsUsed[2]}, ${data.cardsUsed[3]}, ${data.cardsUsed[5]}`;
    data.sumDisp.textContent = `Sum: ${String(data.playerSum)}`;
  } else if (data.player3rdCard === true && data.croupier3rdCard === false) {
    data.cardsDisp.textContent = `Cards: ${data.cardsUsed[2]}, ${data.cardsUsed[3]}, ${data.cardsUsed[4]}`;
    data.sumDisp.textContent = `Sum: ${String(data.playerSum)}`;
  }
  data.cardsUsed = [];
  data.croupierSum = 0;
  data.playerSum = 0;
  data.croupier3rdCard = false;
  data.player3rdCard = false;
}

// Draw one more card function
function draw() {
  if (data.croupierSum < 17) {
    drawCard();
    parseAndSum();
    data.croupierSum += data.sum;
    data.sum = 0;
    data.croupier3rdCard = true;
  }
  drawCard();
  parseAndSum();
  data.playerSum += data.sum;
  data.sum = 0;
  data.player3rdCard = true;
  pointChecker();
}

// Stand function
function stand() {
  if (data.croupierSum < 17) {
    drawCard();
    parseAndSum();
    data.croupierSum += data.sum;
    data.sum = 0;
    data.croupier3rdCard = true;
  }
  pointChecker();
}
