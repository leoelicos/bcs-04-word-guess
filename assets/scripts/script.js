const words = ["able","acid","aged","also","area","army","away","baby","back","ball","band","bank","base","bath","bear","beat","been","beer","bell","belt","best","bill","bird","blow","blue","boat","body","bomb","bond","bone","book","boom","born","boss","both","bowl","bulk","burn","bush","busy","call","calm","came","camp","card","care","case","cash","cast","cell","chat","chip","city","club","coal","coat","code","cold","come","cook","cool","cope","copy","cost","crew","crop","dark","data","date","dawn","days","dead","deal","dear","debt","deep","deny","desk","dial","diet","disc","disk","does","done","door","dose","down","draw","drew","drop","drug","dual","dust","duty","each","earn","ease","east","easy","edge","else","even","ever","evil","exit","face","fact","fail","fair","fall","farm","fast","fate","fear","feed","feel","feet","fell","felt","file","fill","film","find","fine","fire","firm","fish","five","flat","flow","food","foot","ford","form","fort","four","free","from","fuel","full","fund","gain","game","gate","gave","gear","gene","gift","girl","give","glad","goal","goes","gold","gone","good","gray","grew","grey","grow","gulf","hair","half","hall","hand","hang","hard","harm","hate","have","head","hear","heat","held","help","here","hero","high","hill","hire","hold","hole","holy","home","hope","host","hour","huge","hung","hunt","hurt","idea","inch","into","iron","item","jack","jump","jury","just","keen","keep","kept","kick","kill","kind","king","knee","knew","know","lack","lady","laid","lake","land","lane","last","late","lead","left","less","life","lift","like","line","link","list","live","load","loan","lock","logo","long","look","lose","loss","love","luck","made","mail","main","make","male","many","mark","mass","mate","math","meal","mean","meat","meet","menu","mere","mess","mile","milk","mill","mind","mine","miss","mode","mood","moon","more","most","move","much","must","name","navy","near","neck","need","news","next","nice","nine","none","nose","note","okay","once","only","onto","open","oral","over","pace","pack","page","paid","pain","pair","palm","park","part","pass","past","path","peak","pick","pile","pink","plan","play","plot","plug","plus","poll","pool","poor","port","pose","post","pull","pure","push","race","rail","rain","rank","rare","rate","read","real","rear","rely","rent","rest","rice","rich","ride","ring","rise","risk","road","rock","role","roll","roof","room","root","rose","rule","rush","safe","said","sake","sale","salt","same","sand","save","seat","seed","seek","seem","seen","self","sell","send","sent","ship","shop","shot","show","shut","sick","side","sign","site","size","skin","slip","slow","snap","snow","soft","soil","sold","sole","some","song","soon","sort","soul","spot","star","stay","step","stop","such","suit","sure","take","tale","talk","tall","tank","tape","task","team","tell","tend","term","test","text","than","that","them","then","they","thin","this","thus","time","tiny","told","toll","tone","took","tool","tops","tour","town","tree","trip","true","tune","turn","twin","type","unit","upon","used","user","vary","vast","very","vice","view","vote","wage","wait","wake","walk","wall","want","ward","warm","warn","wash","wave","ways","weak","wear","week","well","went","were","west","what","when","whom","wide","wife","wild","will","wind","wine","wing","wire","wise","wish","with","wood","word","wore","work","yard","yeah","year","your","zero","zone"];

let solution = "";
let found = [];
let timeLeft = 10;
let timerId = null;
let playing = false;
let wins = Number(localStorage.getItem("kiddle-wins") || 0);
let losses = Number(localStorage.getItem("kiddle-losses") || 0);
const usedLetters = new Set();

const tilesEl = document.getElementById("tiles");
const timerEl = document.getElementById("timer");
const statusEl = document.getElementById("status");
const startBtn = document.getElementById("startBtn");
const keyboardEl = document.getElementById("keyboard");
const winsEl = document.getElementById("wins");
const lossesEl = document.getElementById("losses");
const modal = document.getElementById("modal");

function updateStats() {
  winsEl.textContent = wins;
  lossesEl.textContent = losses;
}

function saveStats() {
  localStorage.setItem("kiddle-wins", wins);
  localStorage.setItem("kiddle-losses", losses);
}

function buildTiles() {
  tilesEl.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.id = "tile" + i;
    tile.textContent = "_";
    tilesEl.appendChild(tile);
  }
}

function buildKeyboard() {
  const rows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
  keyboardEl.innerHTML = "";
  rows.forEach(row => {
    const rowEl = document.createElement("div");
    rowEl.className = "key-row";
    row.split("").forEach(letter => {
      const key = document.createElement("button");
      key.className = "key";
      key.textContent = letter;
      key.dataset.letter = letter;
      key.addEventListener("click", () => handleLetter(letter));
      rowEl.appendChild(key);
    });
    keyboardEl.appendChild(rowEl);
  });
}

function chooseWord() {
  solution = words[Math.floor(Math.random() * words.length)];
  found = Array(4).fill(false);
  usedLetters.clear();
  document.querySelectorAll(".key").forEach(k => k.classList.remove("used", "correct"));
  for (let i = 0; i < 4; i++) {
    const tile = document.getElementById("tile" + i);
    tile.textContent = "_";
    tile.classList.remove("filled");
  }
}

function startGame() {
  if (playing) return;
  playing = true;
  timeLeft = 10;
  timerEl.textContent = timeLeft;
  timerEl.classList.remove("low");
  statusEl.textContent = "Guess the letters!";
  startBtn.textContent = "Playing...";
  chooseWord();
  startTimer();
}

function endGame(win) {
  playing = false;
  clearInterval(timerId);
  if (win) {
    wins++;
    statusEl.textContent = "You win!";
    startBtn.textContent = "Play again";
    if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
  } else {
    losses++;
    statusEl.textContent = "Time up! It was \"" + solution + "\"";
    startBtn.textContent = "Try again";
    if (navigator.vibrate) navigator.vibrate(100);
  }
  saveStats();
  updateStats();
}

function startTimer() {
  clearInterval(timerId);
  timerId = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 3) timerEl.classList.add("low");
    if (timeLeft <= 0) endGame(false);
  }, 1000);
}

function handleLetter(letter) {
  if (!playing) return;
  letter = letter.toLowerCase();
  if (usedLetters.has(letter)) return;
  usedLetters.add(letter);

  const keyEl = document.querySelector(".key[data-letter=\"" + letter + "\"]");
  if (keyEl) keyEl.classList.add("used");

  let hit = false;
  for (let i = 0; i < solution.length; i++) {
    if (solution[i] === letter) {
      found[i] = true;
      const tile = document.getElementById("tile" + i);
      tile.textContent = letter;
      tile.classList.add("filled");
      hit = true;
    }
  }

  if (hit && keyEl) keyEl.classList.add("correct");
  if (navigator.vibrate) navigator.vibrate(hit ? 30 : 10);

  if (found.every(Boolean)) endGame(true);
}

document.addEventListener("keydown", (e) => {
  if (!playing) return;
  const key = e.key.toLowerCase();
  if (/^[a-z]$/.test(key)) handleLetter(key);
});

startBtn.addEventListener("click", startGame);

document.getElementById("resetBtn").addEventListener("click", () => {
  wins = 0;
  losses = 0;
  saveStats();
  updateStats();
});

document.getElementById("helpBtn").addEventListener("click", () => modal.classList.add("show"));
document.getElementById("closeModal").addEventListener("click", () => modal.classList.remove("show"));

buildTiles();
buildKeyboard();
updateStats();
statusEl.textContent = "Tap Start to play";
