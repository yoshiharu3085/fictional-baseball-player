// ========================================
// 架空野球選手メーカー
// 成績計算プログラム
// ========================================

// ----------------------------------------
// HTML要素を取得
// ----------------------------------------

const createButton = document.getElementById("createButton");

const result = document.getElementById("result");
const error = document.getElementById("error");

// ----------------------------------------
// 数値を取得する関数
// ----------------------------------------

function getNumber(id) {
return Number(document.getElementById(id).value) || 0;
}

// ----------------------------------------
// 小数点以下3桁で表示
// ----------------------------------------

function formatRate(value) {

return value.toFixed(3).replace(/^0/, "");

}

// ----------------------------------------
// 成績計算
// ----------------------------------------

function calculateStats() {

// 基本成績
const games = getNumber("games");
const plateAppearances = getNumber("plateAppearances");
const atBats = getNumber("atBats");

const hits = getNumber("hits");
const doubles = getNumber("doubles");
const triples = getNumber("triples");
const homeRuns = getNumber("homeRuns");

const walks = getNumber("walks");
const hbp = getNumber("hbp");
const sacrificeFlies = getNumber("sacrificeFlies");

const rbi = getNumber("rbi");
const strikeouts = getNumber("strikeouts");
const stolenBases = getNumber("stolenBases");
const caughtStealing = getNumber("caughtStealing");

// ----------------------------------------
// 入力値チェック
// ----------------------------------------

if (hits > atBats) {
showError("安打数が打数を超えています。");
return;
}

if (doubles + triples + homeRuns > hits) {
showError(
"二塁打・三塁打・本塁打の合計が安打数を超えています。"
);
return;
}

if (strikeouts > plateAppearances) {
showError("三振数が打席数を超えています。");
return;
}

if (plateAppearances < atBats) {
showError("打席数が打数より少なくなっています。");
return;
}

// ----------------------------------------
// 打率 AVG
// ----------------------------------------

let avg = 0;

if (atBats > 0) {
avg = hits / atBats;
}

// ----------------------------------------
// 単打
// ----------------------------------------

const singles =
hits -
doubles -
triples -
homeRuns;

// ----------------------------------------
// 塁打
// ----------------------------------------

const totalBases =
singles +
doubles * 2 +
triples * 3 +
homeRuns * 4;

// ----------------------------------------
// 長打率 SLG
// ----------------------------------------

let slg = 0;

if (atBats > 0) {
slg = totalBases / atBats;
}

// ----------------------------------------
// 出塁率 OBP
// ----------------------------------------

let obp = 0;

const obpDenominator =
atBats +
walks +
hbp +
sacrificeFlies;

if (obpDenominator > 0) {

obp =
  (hits + walks + hbp) /
  obpDenominator;

}

// ----------------------------------------
// OPS
// ----------------------------------------

const ops = obp + slg;

// ----------------------------------------
// 画面に表示
// ----------------------------------------

displayResult({
games,
hits,
homeRuns,
rbi,
stolenBases,
avg,
obp,
slg,
ops
});

}

// ----------------------------------------
// 成績表を表示
// ----------------------------------------

function displayResult(stats) {

const playerName =
document.getElementById("playerName").value
|| "名無しの選手";

const year =
document.getElementById("year").value
|| "----";

const team =
document.getElementById("team").value
|| "所属なし";

const position =
document.getElementById("position").value;

// 選手情報

document.getElementById("resultName").textContent =
playerName;

document.getElementById("resultInfo").textContent =
"${year}年　${team}　${position}";

// 指標

document.getElementById("resultAVG").textContent =
formatRate(stats.avg);

document.getElementById("resultOBP").textContent =
formatRate(stats.obp);

document.getElementById("resultSLG").textContent =
formatRate(stats.slg);

document.getElementById("resultOPS").textContent =
formatRate(stats.ops);

// 基本成績

document.getElementById("resultGames").textContent =
stats.games;

document.getElementById("resultHits").textContent =
stats.hits;

document.getElementById("resultHR").textContent =
stats.homeRuns;

document.getElementById("resultRBI").textContent =
stats.rbi;

document.getElementById("resultSB").textContent =
stats.stolenBases;

// 成績表を表示

result.classList.remove("hidden");

error.classList.add("hidden");

// スマホで結果まで自動スクロール

result.scrollIntoView({
behavior: "smooth"
});

}

// ----------------------------------------
// エラー表示
// ----------------------------------------

function showError(message) {

error.textContent = message;

error.classList.remove("hidden");

result.classList.add("hidden");

error.scrollIntoView({
behavior: "smooth"
});

}

// ----------------------------------------
// ボタンを押したときに計算
// ----------------------------------------

createButton.addEventListener(
"click",
calculateStats
);
