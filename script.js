// ========================================
// 架空野球選手メーカー V0.2
// ========================================


// ========================================
// データ保存先
// ========================================

const STORAGE_KEY = "fictionalBaseballPlayers";


// ========================================
// 現在選択している選手
// ========================================

let currentPlayerId = null;


// ========================================
// HTML要素
// ========================================

const playerListSection =
  document.getElementById("playerListSection");

const playerList =
  document.getElementById("playerList");

const editorSection =
  document.getElementById("editorSection");

const seasonInputSection =
  document.getElementById("seasonInputSection");

const careerSection =
  document.getElementById("careerSection");

const error =
  document.getElementById("error");


// ========================================
// LocalStorageから選手データを取得
// ========================================

function getPlayers() {

  const data =
    localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return [];
  }

  return JSON.parse(data);
}


// ========================================
// 選手データを保存
// ========================================

function savePlayers(players) {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(players)
  );

}


// ========================================
// ID生成
// ========================================

function generateId() {

  return (
    Date.now().toString() +
    Math.random().toString(16).slice(2)
  );

}


// ========================================
// 数値取得
// ========================================

function getNumber(id) {

  return (
    Number(
      document.getElementById(id).value
    ) || 0
  );

}


// ========================================
// 打率などを小数3桁にする
// ========================================

function formatRate(value) {

  return value
    .toFixed(3)
    .replace(/^0/, "");

}


// ========================================
// 年度成績を計算
// ========================================

function calculateSeason() {

  const games =
    getNumber("games");

  const plateAppearances =
    getNumber("plateAppearances");

  const atBats =
    getNumber("atBats");

  const hits =
    getNumber("hits");

  const doubles =
    getNumber("doubles");

  const triples =
    getNumber("triples");

  const homeRuns =
    getNumber("homeRuns");

  const rbi =
    getNumber("rbi");

  const walks =
    getNumber("walks");

  const hbp =
    getNumber("hbp");

  const sacrificeFlies =
    getNumber("sacrificeFlies");

  const strikeouts =
    getNumber("strikeouts");

  const stolenBases =
    getNumber("stolenBases");

  const caughtStealing =
    getNumber("caughtStealing");


  // ========================================
  // 入力値チェック
  // ========================================

  if (hits > atBats) {

    showError(
      "安打数が打数を超えています。"
    );

    return null;

  }


  if (
    doubles +
    triples +
    homeRuns >
    hits
  ) {

    showError(
      "二塁打・三塁打・本塁打の合計が安打数を超えています。"
    );

    return null;

  }


  if (strikeouts > plateAppearances) {

    showError(
      "三振数が打席数を超えています。"
    );

    return null;

  }


  if (plateAppearances < atBats) {

    showError(
      "打席数が打数より少なくなっています。"
    );

    return null;

  }


  // ========================================
  // 打率
  // ========================================

  let avg = 0;

  if (atBats > 0) {

    avg =
      hits / atBats;

  }


  // ========================================
  // 単打
  // ========================================

  const singles =
    hits -
    doubles -
    triples -
    homeRuns;


  // ========================================
  // 塁打
  // ========================================

  const totalBases =
    singles +
    doubles * 2 +
    triples * 3 +
    homeRuns * 4;


  // ========================================
  // 長打率
  // ========================================

  let slg = 0;

  if (atBats > 0) {

    slg =
      totalBases / atBats;

  }


  // ========================================
  // 出塁率
  // ========================================

  let obp = 0;

  const denominator =
    atBats +
    walks +
    hbp +
    sacrificeFlies;

  if (denominator > 0) {

    obp =
      (
        hits +
        walks +
        hbp
      ) /
      denominator;

  }


  // ========================================
  // OPS
  // ========================================

  const ops =
    obp + slg;


  // ========================================
  // 年度データとして返す
  // ========================================

  return {

    year:
      getNumber("year"),

    games,

    plateAppearances,

    atBats,

    hits,

    doubles,

    triples,

    homeRuns,

    rbi,

    walks,

    hbp,

    sacrificeFlies,

    strikeouts,

    stolenBases,

    caughtStealing,

    avg,

    obp,

    slg,

    ops

  };

}


// ========================================
// エラー表示
// ========================================

function showError(message) {

  error.textContent =
    message;

  error.classList.remove(
    "hidden"
  );

}


// ========================================
// エラーを消す
// ========================================

function clearError() {

  error.classList.add(
    "hidden"
  );

}


// ========================================
// 選手一覧を表示
// ========================================

function renderPlayerList() {

  const players =
    getPlayers();


  playerList.innerHTML = "";


  // 選手がいない場合

  if (players.length === 0) {

    const message =
      document.createElement("p");

    message.textContent =
      "まだ選手が登録されていません。";

    message.style.color =
      "#6b7280";

    playerList.appendChild(
      message
    );

    return;

  }


  // 選手を表示

  players.forEach(
    function(player) {

      const item =
        document.createElement("div");

      item.className =
        "player-item";


      const name =
        document.createElement("div");

      name.className =
        "player-item-name";

      name.textContent =
        player.name;


      const info =
        document.createElement("div");

      info.className =
        "player-item-info";


      const seasons =
        player.seasons || [];


      info.textContent =
        `${player.position}　${seasons.length}シーズン`;


      item.appendChild(name);

      item.appendChild(info);


      item.addEventListener(
        "click",
        function() {

          openPlayer(
            player.id
          );

        }
      );


      playerList.appendChild(
        item
      );

    }
  );

}


// ========================================
// 新しい選手を作る
// ========================================

function startNewPlayer() {

  currentPlayerId =
    null;


  document.getElementById(
    "playerName"
  ).value = "";


  document.getElementById(
    "team"
  ).value = "";


  document.getElementById(
    "position"
  ).value = "遊撃手";


  document.getElementById(
    "editorTitle"
  ).textContent =
    "新しい選手を作る";


  document.getElementById(
    "savePlayerButton"
  ).textContent =
    "選手を保存";


  playerListSection.classList.add(
    "hidden"
  );


  careerSection.classList.add(
    "hidden"
  );


  seasonInputSection.classList.add(
    "hidden"
  );


  editorSection.classList.remove(
    "hidden"
  );


  clearError();


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


// ========================================
// 選手を保存
// ========================================

function savePlayer() {

  const name =
    document.getElementById(
      "playerName"
    ).value.trim();


  const team =
    document.getElementById(
      "team"
    ).value.trim();


  const position =
    document.getElementById(
      "position"
    ).value;


  if (!name) {

    showError(
      "選手名を入力してください。"
    );

    return;

  }


  const players =
    getPlayers();


  // 新規選手

  if (!currentPlayerId) {

    const newPlayer = {

      id:
        generateId(),

      name,

      team,

      position,

      seasons: []

    };


    players.push(
      newPlayer
    );


    currentPlayerId =
      newPlayer.id;


  }

  // 既存選手

  else {

    const player =
      players.find(
        function(p) {

          return p.id ===
            currentPlayerId;

        }
      );


    if (player) {

      player.name =
        name;

      player.team =
        team;

      player.position =
        position;

    }

  }


  savePlayers(
    players
  );


  clearError();


  // 編集画面を更新

  document.getElementById(
    "editorTitle"
  ).textContent =
    `${name} の選手情報`;


  document.getElementById(
    "savePlayerButton"
  ).textContent =
    "選手情報を更新";


  // 年度成績入力を表示

  seasonInputSection.classList.remove(
    "hidden"
  );


  renderCareer(
    currentPlayerId
  );

}


// ========================================
// 選手を開く
// ========================================

function openPlayer(playerId) {

  currentPlayerId =
    playerId;


  const players =
    getPlayers();


  const player =
    players.find(
      function(p) {

        return p.id ===
          playerId;

      }
    );


  if (!player) {
    return;
  }


  // 選手情報を入力欄にセット

  document.getElementById(
    "playerName"
  ).value =
    player.name;


  document.getElementById(
    "team"
  ).value =
    player.team;


  document.getElementById(
    "position"
  ).value =
    player.position;


  document.getElementById(
    "editorTitle"
  ).textContent =
    `${player.name} を編集`;


  document.getElementById(
    "savePlayerButton"
  ).textContent =
    "選手情報を更新";


  playerListSection.classList.add(
    "hidden"
  );


  editorSection.classList.remove(
    "hidden"
  );


  seasonInputSection.classList.remove(
    "hidden"
  );


  careerSection.classList.remove(
    "hidden"
  );


  renderCareer(
    playerId
  );


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


// ========================================
// 年度成績を保存
// ========================================

function saveSeason() {

  if (!currentPlayerId) {

    showError(
      "先に選手を保存してください。"
    );

    return;

  }


  const season =
    calculateSeason();


  if (!season) {
    return;
  }


  if (!season.year) {

    showError(
      "年度を入力してください。"
    );

    return;

  }


  const players =
    getPlayers();


  const player =
    players.find(
      function(p) {

        return p.id ===
          currentPlayerId;

      }
    );


  if (!player) {
    return;
  }


  // ========================================
  // 同じ年度が存在するかチェック
  // ========================================

  const existingIndex =
    player.seasons.findIndex(
      function(s) {

        return s.year ===
          season.year;

      }
    );


  if (existingIndex !== -1) {

    const overwrite =
      confirm(
        `${season.year}年の成績はすでに登録されています。\n上書きしますか？`
      );


    if (!overwrite) {
      return;
    }


    player.seasons[
      existingIndex
    ] = season;

  }

  else {

    player.seasons.push(
      season
    );

  }


  // 年度順に並べる

  player.seasons.sort(
    function(a, b) {

      return a.year -
        b.year;

    }
  );


  savePlayers(
    players
  );


  renderCareer(
    currentPlayerId
  );


  clearError();


  alert(
    `${season.year}年の成績を登録しました！`
  );

}


// ========================================
// キャリア表示
// ========================================

function renderCareer(playerId) {

  const players =
    getPlayers();


  const player =
    players.find(
      function(p) {

        return p.id ===
          playerId;

      }
    );


  if (!player) {
    return;
  }


  document.getElementById(
    "careerName"
  ).textContent =
    player.name;


  document.getElementById(
    "careerInfo"
  ).textContent =
    `${player.team || "所属なし"}　${player.position}`;


  const tbody =
    document.getElementById(
      "careerTableBody"
    );


  tbody.innerHTML = "";


  const seasons =
    player.seasons || [];


  // 年度がない場合

  if (seasons.length === 0) {

    const row =
      document.createElement("tr");


    row.innerHTML =
      `
        <td colspan="7">
          まだ年度成績がありません
        </td>
      `;


    tbody.appendChild(
      row
    );


    careerSection.classList.remove(
      "hidden"
    );

    return;

  }


  // 年度別成績

  seasons.forEach(
    function(season) {

      const row =
        document.createElement("tr");


      row.innerHTML =
        `
          <td>${season.year}</td>

          <td>${season.games}</td>

          <td>${formatRate(season.avg)}</td>

          <td>${season.homeRuns}</td>

          <td>${season.rbi}</td>

          <td>${season.stolenBases}</td>

          <td>${formatRate(season.ops)}</td>
        `;


      tbody.appendChild(
        row
      );

    }
  );


  careerSection.classList.remove(
    "hidden"
  );

}


// ========================================
// 選手一覧へ戻る
// ========================================

function backToPlayers() {

  currentPlayerId =
    null;


  editorSection.classList.add(
    "hidden"
  );


  playerListSection.classList.remove(
    "hidden"
  );


  careerSection.classList.add(
    "hidden"
  );


  seasonInputSection.classList.add(
    "hidden"
  );


  clearError();


  renderPlayerList();


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


// ========================================
// 年度追加ボタン
// ========================================

function showSeasonInput() {

  seasonInputSection.classList.remove(
    "hidden"
  );


  seasonInputSection.scrollIntoView({
    behavior: "smooth"
  });

}


// ========================================
// イベント設定
// ========================================


// 新しい選手

document.getElementById(
  "newPlayerButton"
).addEventListener(
  "click",
  startNewPlayer
);


// 選手保存

document.getElementById(
  "savePlayerButton"
).addEventListener(
  "click",
  savePlayer
);


// 年度成績保存

document.getElementById(
  "saveSeasonButton"
).addEventListener(
  "click",
  saveSeason
);


// 年度追加

document.getElementById(
  "addSeasonButton"
).addEventListener(
  "click",
  showSeasonInput
);


// 選手一覧へ戻る

document.getElementById(
  "backToPlayersButton"
).addEventListener(
  "click",
  backToPlayers
);


// キャンセル

document.getElementById(
  "cancelEditButton"
).addEventListener(
  "click",
  backToPlayers
);


// ========================================
// アプリ起動時
// ========================================

renderPlayerList();function calculateStats() {

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
