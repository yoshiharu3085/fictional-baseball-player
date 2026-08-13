// ========================================
// 架空野球選手メーカー V0.3
// 通算成績・キャリアハイ・グラフ対応
// ========================================


const STORAGE_KEY =
  "fictionalBaseballPlayers";


let currentPlayerId = null;


// Chart.jsのグラフを保持
let avgChart = null;
let hrChart = null;
let opsChart = null;


// ========================================
// HTML要素
// ========================================

const playerListSection =
  document.getElementById(
    "playerListSection"
  );

const playerList =
  document.getElementById(
    "playerList"
  );

const editorSection =
  document.getElementById(
    "editorSection"
  );

const seasonInputSection =
  document.getElementById(
    "seasonInputSection"
  );

const careerSection =
  document.getElementById(
    "careerSection"
  );

const error =
  document.getElementById(
    "error"
  );


// ========================================
// LocalStorage
// ========================================

function getPlayers() {

  const data =
    localStorage.getItem(
      STORAGE_KEY
    );

  if (!data) {
    return [];
  }

  return JSON.parse(data);

}


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
    Math.random()
      .toString(16)
      .slice(2)
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
// 成績表示用フォーマット
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
  // 入力チェック
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


  if (
    strikeouts >
    plateAppearances
  ) {

    showError(
      "三振数が打席数を超えています。"
    );

    return null;

  }


  if (
    plateAppearances <
    atBats
  ) {

    showError(
      "打席数が打数より少なくなっています。"
    );

    return null;

  }


  // ========================================
  // 打率
  // ========================================

  const avg =
    atBats > 0
      ? hits / atBats
      : 0;


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

  const slg =
    atBats > 0
      ? totalBases / atBats
      : 0;


  // ========================================
  // 出塁率
  // ========================================

  const denominator =
    atBats +
    walks +
    hbp +
    sacrificeFlies;


  const obp =
    denominator > 0
      ? (
          hits +
          walks +
          hbp
        ) / denominator
      : 0;


  // ========================================
  // OPS
  // ========================================

  const ops =
    obp + slg;


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
// エラー
// ========================================

function showError(message) {

  error.textContent =
    message;

  error.classList.remove(
    "hidden"
  );

}


function clearError() {

  error.classList.add(
    "hidden"
  );

}


// ========================================
// 選手一覧
// ========================================

function renderPlayerList() {

  const players =
    getPlayers();


  playerList.innerHTML =
    "";


  if (
    players.length === 0
  ) {

    const message =
      document.createElement(
        "p"
      );

    message.textContent =
      "まだ選手が登録されていません。";

    message.style.color =
      "#6b7280";

    playerList.appendChild(
      message
    );

    return;

  }


  players.forEach(
    function(player) {

      const item =
        document.createElement(
          "div"
        );

      item.className =
        "player-item";


      const name =
        document.createElement(
          "div"
        );

      name.className =
        "player-item-name";

      name.textContent =
        player.name;


      const info =
        document.createElement(
          "div"
        );

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
// 新しい選手
// ========================================

function startNewPlayer() {

  currentPlayerId =
    null;


  document.getElementById(
    "playerName"
  ).value =
    "";


  document.getElementById(
    "team"
  ).value =
    "";


  document.getElementById(
    "position"
  ).value =
    "遊撃手";


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
// 選手保存
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

          return (
            p.id ===
            currentPlayerId
          );

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


  document.getElementById(
    "editorTitle"
  ).textContent =
    `${name} の選手情報`;


  document.getElementById(
    "savePlayerButton"
  ).textContent =
    "選手情報を更新";


  seasonInputSection.classList.remove(
    "hidden"
  );


  renderCareer(
    currentPlayerId
  );


  clearError();

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

        return (
          p.id ===
          playerId
        );

      }
    );


  if (!player) {
    return;
  }


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
// 年度成績保存
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

        return (
          p.id ===
          currentPlayerId
        );

      }
    );


  if (!player) {
    return;
  }

  // 古いデータとの互換性
if (!Array.isArray(player.seasons)) {
  player.seasons = [];
}


  const existingIndex =
    player.seasons.findIndex(
      function(s) {

        return (
          s.year ===
          season.year
        );

      }
    );


  if (
    existingIndex !== -1
  ) {

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


  player.seasons.sort(
    function(a, b) {

      return (
        a.year -
        b.year
      );

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
// 通算成績を計算
// ========================================

function calculateCareerTotals(
  seasons
) {

  const total = {

    games: 0,

    plateAppearances: 0,

    atBats: 0,

    hits: 0,

    doubles: 0,

    triples: 0,

    homeRuns: 0,

    rbi: 0,

    walks: 0,

    hbp: 0,

    sacrificeFlies: 0,

    strikeouts: 0,

    stolenBases: 0,

    caughtStealing: 0

  };


  // 各年度を合計

  seasons.forEach(
    function(season) {

      total.games +=
        season.games || 0;

      total.plateAppearances +=
        season.plateAppearances || 0;

      total.atBats +=
        season.atBats || 0;

      total.hits +=
        season.hits || 0;

      total.doubles +=
        season.doubles || 0;

      total.triples +=
        season.triples || 0;

      total.homeRuns +=
        season.homeRuns || 0;

      total.rbi +=
        season.rbi || 0;

      total.walks +=
        season.walks || 0;

      total.hbp +=
        season.hbp || 0;

      total.sacrificeFlies +=
        season.sacrificeFlies || 0;

      total.strikeouts +=
        season.strikeouts || 0;

      total.stolenBases +=
        season.stolenBases || 0;

      total.caughtStealing +=
        season.caughtStealing || 0;

    }
  );


  // 通算打率

  total.avg =
    total.atBats > 0
      ? total.hits /
        total.atBats
      : 0;


  // 通算単打

  const singles =
    total.hits -
    total.doubles -
    total.triples -
    total.homeRuns;


  // 通算塁打

  const totalBases =
    singles +
    total.doubles * 2 +
    total.triples * 3 +
    total.homeRuns * 4;


  // 通算長打率

  total.slg =
    total.atBats > 0
      ? totalBases /
        total.atBats
      : 0;


  // 通算出塁率

  const obpDenominator =
    total.atBats +
    total.walks +
    total.hbp +
    total.sacrificeFlies;


  total.obp =
    obpDenominator > 0
      ? (
          total.hits +
          total.walks +
          total.hbp
        ) /
        obpDenominator
      : 0;


  // 通算OPS

  total.ops =
    total.obp +
    total.slg;


  return total;

}


// ========================================
// キャリアハイ
// ========================================

function calculateCareerHigh(
  seasons
) {

  if (
    seasons.length === 0
  ) {

    return null;

  }


  return {

    avg:
      seasons.reduce(
        function(best, season) {

          return (
            season.avg >
            best.avg
          )
            ? season
            : best;

        },
        seasons[0]
      ),

    homeRuns:
      seasons.reduce(
        function(best, season) {

          return (
            season.homeRuns >
            best.homeRuns
          )
            ? season
            : best;

        },
        seasons[0]
      ),

    rbi:
      seasons.reduce(
        function(best, season) {

          return (
            season.rbi >
            best.rbi
          )
            ? season
            : best;

        },
        seasons[0]
      ),

    stolenBases:
      seasons.reduce(
        function(best, season) {

          return (
            season.stolenBases >
            best.stolenBases
          )
            ? season
            : best;

        },
        seasons[0]
      ),

    ops:
      seasons.reduce(
        function(best, season) {

          return (
            season.ops >
            best.ops
          )
            ? season
            : best;

        },
        seasons[0]
      )

  };

}


// ========================================
// 通算成績を画面に表示
// ========================================

function renderCareerTotals(
  totals
) {

  document.getElementById(
    "totalGames"
  ).textContent =
    totals.games;


  document.getElementById(
    "totalAtBats"
  ).textContent =
    totals.atBats;


  document.getElementById(
    "totalHits"
  ).textContent =
    totals.hits;


  document.getElementById(
    "totalHomeRuns"
  ).textContent =
    totals.homeRuns;


  document.getElementById(
    "totalRBI"
  ).textContent =
    totals.rbi;


  document.getElementById(
    "totalStolenBases"
  ).textContent =
    totals.stolenBases;


  document.getElementById(
    "totalAVG"
  ).textContent =
    formatRate(
      totals.avg
    );


  document.getElementById(
    "totalOBP"
  ).textContent =
    formatRate(
      totals.obp
    );


  document.getElementById(
    "totalSLG"
  ).textContent =
    formatRate(
      totals.slg
    );


  document.getElementById(
    "totalOPS"
  ).textContent =
    formatRate(
      totals.ops
    );

}


// ========================================
// キャリアハイ表示
// ========================================

function renderCareerHigh(
  high
) {

  if (!high) {
    return;
  }


  document.getElementById(
    "careerHighAVG"
  ).textContent =
    formatRate(
      high.avg.avg
    );


  document.getElementById(
    "careerHighAVGYear"
  ).textContent =
    `${high.avg.year}年`;


  document.getElementById(
    "careerHighHR"
  ).textContent =
    high.homeRuns.homeRuns;


  document.getElementById(
    "careerHighHRYear"
  ).textContent =
    `${high.homeRuns.year}年`;


  document.getElementById(
    "careerHighRBI"
  ).textContent =
    high.rbi.rbi;


  document.getElementById(
    "careerHighRBIYear"
  ).textContent =
    `${high.rbi.year}年`;


  document.getElementById(
    "careerHighSB"
  ).textContent =
    high.stolenBases.stolenBases;


  document.getElementById(
    "careerHighSBYear"
  ).textContent =
    `${high.stolenBases.year}年`;


  document.getElementById(
    "careerHighOPS"
  ).textContent =
    formatRate(
      high.ops.ops
    );


  document.getElementById(
    "careerHighOPSYear"
  ).textContent =
    `${high.ops.year}年`;

}


// ========================================
// グラフ作成
// ========================================

function renderCharts(
  seasons
) {

  const labels =
    seasons.map(
      function(season) {

        return season.year;

      }
    );


  const avgData =
    seasons.map(
      function(season) {

        return season.avg;

      }
    );


  const hrData =
    seasons.map(
      function(season) {

        return season.homeRuns;

      }
    );


  const opsData =
    seasons.map(
      function(season) {

        return season.ops;

      }
    );


  // ========================================
  // 既存グラフを破棄
  // ========================================

  if (avgChart) {

    avgChart.destroy();

  }


  if (hrChart) {

    hrChart.destroy();

  }


  if (opsChart) {

    opsChart.destroy();

  }


  // ========================================
  // 打率
  // ========================================

  avgChart =
    new Chart(
      document.getElementById(
        "avgChart"
      ),
      {

        type: "line",

        data: {

          labels,

          datasets: [

            {

              label: "打率",

              data: avgData,

              tension: 0.3

            }

          ]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          scales: {

            y: {

              min: 0,

              max: 0.4,

              ticks: {

                callback:
                  function(value) {

                    return Number(
                      value
                    ).toFixed(3);

                  }

              }

            }

          }

        }

      }
    );


  // ========================================
  // 本塁打
  // ========================================

  hrChart =
    new Chart(
      document.getElementById(
        "hrChart"
      ),
      {

        type: "bar",

        data: {

          labels,

          datasets: [

            {

              label: "本塁打",

              data: hrData

            }

          ]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          scales: {

            y: {

              beginAtZero: true

            }

          }

        }

      }
    );


  // ========================================
  // OPS
  // ========================================

  opsChart =
    new Chart(
      document.getElementById(
        "opsChart"
      ),
      {

        type: "line",

        data: {

          labels,

          datasets: [

            {

              label: "OPS",

              data: opsData,

              tension: 0.3

            }

          ]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          scales: {

            y: {

              min: 0,

              max: 1.2,

              ticks: {

                callback:
                  function(value) {

                    return Number(
                      value
                    ).toFixed(3);

                  }

              }

            }

          }

        }

      }
    );

}


// ========================================
// キャリア全体を表示
// ========================================

function renderCareer(
  playerId
) {

  const players =
    getPlayers();


  const player =
    players.find(
      function(p) {

        return (
          p.id ===
          playerId
        );

      }
    );


  if (!player) {
    return;
  }


const seasons =
  Array.isArray(player.seasons)
    ? player.seasons
    : [];


  document.getElementById(
    "careerName"
  ).textContent =
    player.name;


  document.getElementById(
    "careerInfo"
  ).textContent =
    `${player.team || "所属なし"}　${player.position}`;


  // ========================================
  // 通算成績
  // ========================================

  const totals =
    calculateCareerTotals(
      seasons
    );


  renderCareerTotals(
    totals
  );


  // ========================================
  // キャリアハイ
  // ========================================

  const high =
    calculateCareerHigh(
      seasons
    );


  renderCareerHigh(
    high
  );


  // ========================================
  // 年度別表
  // ========================================

  const tbody =
    document.getElementById(
      "careerTableBody"
    );


  tbody.innerHTML =
    "";


  if (
    seasons.length === 0
  ) {

    const row =
      document.createElement(
        "tr"
      );


    row.innerHTML =
      `
        <td colspan="7">
          まだ年度成績がありません
        </td>
      `;


    tbody.appendChild(
      row
    );

  }

  else {

    seasons.forEach(
      function(season) {

        const row =
          document.createElement(
            "tr"
          );


        row.innerHTML =
          `
            <td>${season.year}</td>
        
            <td>${season.games}</td>
        
            <td>${season.atBats}</td>
        
            <td>${season.hits}</td>
        
            <td>${season.doubles}</td>
        
            <td>${season.triples}</td>
        
            <td>${season.walks}</td>
        
            <td>${season.hbp}</td>
        
            <td>${season.sacrificeFlies}</td>
        
            <td>
              ${formatRate(
                season.avg
              )}
            </td>
        
            <td>${season.homeRuns}</td>
        
            <td>${season.rbi}</td>
        
            <td>${season.stolenBases}</td>
        
            <td>
              ${formatRate(
                season.ops
              )}
            </td>
          `;


        tbody.appendChild(
          row
        );

      }
    );

  }


  // ========================================
  // グラフ
  // ========================================

  if (
    seasons.length > 0
  ) {

    renderCharts(
      seasons
    );

  }


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


  // グラフを破棄

  if (avgChart) {

    avgChart.destroy();

    avgChart = null;

  }


  if (hrChart) {

    hrChart.destroy();

    hrChart = null;

  }


  if (opsChart) {

    opsChart.destroy();

    opsChart = null;

  }


  clearError();


  renderPlayerList();


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


// ========================================
// 年度入力欄を表示
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
// イベント
// ========================================

document.getElementById(
  "newPlayerButton"
).addEventListener(
  "click",
  startNewPlayer
);


document.getElementById(
  "savePlayerButton"
).addEventListener(
  "click",
  savePlayer
);


document.getElementById(
  "saveSeasonButton"
).addEventListener(
  "click",
  saveSeason
);


document.getElementById(
  "addSeasonButton"
).addEventListener(
  "click",
  showSeasonInput
);


document.getElementById(
  "backToPlayersButton"
).addEventListener(
  "click",
  backToPlayers
);


document.getElementById(
  "cancelEditButton"
).addEventListener(
  "click",
  backToPlayers
);


// ========================================
// 起動
// ========================================

renderPlayerList();
