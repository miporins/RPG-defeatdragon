let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["graveto"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: 'graveto', power: 5 },
  { name: 'adaga', power: 30 },
  { name: 'martelo', power: 50 },
  { name: 'espada', power: 100 }
];
const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15
  },
  {
    name: "besta com garras",
    level: 8,
    health: 60
  },
  {
    name: "dragão",
    level: 20,
    health: 300
  }
]
const locations = [
  {
    name: "praça da vila",
    "button text": ["Loja", "Ir para uma caverna", "Lutar contra o dragão"],
    "button functions": [goStore, goCave, fightDragon],
    text: "Você está na praça da vila. Você avista uma placa que diz \"Loja\", uma caverna no pé de uma montanha e a trilha que leva ao dragão."
  },
  {
    name: "loja",
    "button text": ["Comprar 10 antídotos de cura (10 ouros)", "Comprar arma (30 ouros)", "Ir para a praça da vila"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "Você entrou na loja."
  },
  {
    name: "caverna",
    "button text": ["Lutar contra slime", "Lutar contra besta com garras", "Ir para a praça da vila"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "Você entra na caverna e avista alguns monstros."
  },
  {
    name: "lutar",
    "button text": ["Atacar", "Desviar", "Fugir"],
    "button functions": [attack, dodge, goTown],
    text: "Você está lutando contra um monstro"
  },
  {
    name: "derrotar monstro",
    "button text": ["Ir para a praça da vila", "Ir para a praça da vila", "Ir para a praça da vila"],
    "button functions": [goTown, goTown, goTown],
    text: 'O monstro grita "Arg!" quando é derrotado. Você ganhou pontos de experiência e também encontrou ouro.'
  },
  {
    name: "perdeu",
    "button text": ["Jogar novamente?", "Jogar novamente?", "Jogar novamente?"],
    "button functions": [restart, restart, restart],
    text: "Você morreu... &#x2620;"
  },
  { 
    name: "ganhou", 
    "button text": ["Jogar novamente?", "Jogar novamente?", "Jogar novamente?"], 
    "button functions": [restart, restart, restart], 
    text: "Você derrotou o dragão! GANHOU O JOGO! &#x1F389;" 
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Ir para a praça da vila?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "Você encontrou um jogo secreto. Escolha um número. Dez números vão ser escolhidos aleatoriamente entre 0 e 10. Se o número que você escolher corresponder ao um dos números escolhidos, você ganha!"
  }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "Você não tem ouro suficiente para comprar antídotos.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "Agora você tem: " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " Em sua bolsa, você leva: " + inventory;
    } else {
      text.innerText = "Você não tem ouro suficiente para comprar uma arma.";
    }
  } else {
    text.innerText = "Você já possui a arma mais poderosa da loja!";
    button2.innerText = "Vender arma por 15 ouros";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "Você vendeu " + currentWeapon + ".";
    text.innerText += " Em sua bolsa, você leva: " + inventory;
  } else {
    text.innerText = "Não venda sua única arma!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "O monstro " + monsters[fighting].name + " ataca.";
  text.innerText += " Você ataca com " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " Você errou.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Sua arma " + inventory.pop() + " quebrou.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "Você desvia o ataque do monstro " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["Graveto"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Wrong! You lose 10 health!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}