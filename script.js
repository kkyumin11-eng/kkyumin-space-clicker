const SAVE_KEY = "stardust-clicker-save-v2";
const FEVER_MULTIPLIER = 2;
const BASE_FEVER_DURATION_MS = 10000;
const METEOR_BASE_COOLDOWN_MS = 45000;
const METEOR_MIN_COOLDOWN_MS = 10000;
const METEOR_SPAWN_CHANCE_AFTER_COOLDOWN = 0.05;
const MAX_FEVER_DURATION_MS = 90000;
const BASE_CRITICAL_CHANCE = 0.05;
const MAX_BASE_CRITICAL_CHANCE = 0.5;
const BASE_CRITICAL_MULTIPLIER = 2;
const MAX_BASE_CRITICAL_MULTIPLIER = 20;
const REBIRTH_THRESHOLD = 100000;
const BASE_CLICK_XP = 2;
const LEVELUP_CARD_LOCK_MS = 1200;
const AUDIO_PREF_KEY = "stardust-clicker-muted";

const ACHIEVEMENTS = [
  { id: "cosmicPioneer", name: "우주 개척자" },
  { id: "stardustTycoon", name: "스타더스트 재벌" },
  { id: "satelliteCollector", name: "위성 컬렉터" },
  { id: "luckyAstronomer", name: "행운의 천문학자" }
];

const RARITIES = [
  { key: "common", label: "일반", chance: 0.6 },
  { key: "rare", label: "희귀", chance: 0.25 },
  { key: "epic", label: "영웅", chance: 0.1 },
  { key: "legendary", label: "전설", chance: 0.05 }
];
const RARITY_ORDER = ["common", "rare", "epic", "legendary"];

const CARD_LIBRARY = [
  {
    id: "overloadClick",
    name: "과부하 클릭",
    kind: "passive",
    values: {
      common: { type: "flat", value: 15 },
      rare: { type: "flat", value: 50 },
      epic: { type: "percent", value: 40 },
      legendary: { type: "percent", value: 100 }
    },
    describe: (value) =>
      value.type === "flat"
        ? `클릭당 스타더스트 기본 획득량 +${value.value}`
        : `클릭당 스타더스트 전체 획득량 +${value.value}%`
  },
  {
    id: "spaceAcceleration",
    name: "우주 가속도",
    kind: "passive",
    values: { common: 10, rare: 25, epic: 40, legendary: 100 },
    describe: (value) => `모든 자동 생산 효율 +${value}%`
  },
  {
    id: "meteorMagnet",
    name: "운석 자석",
    kind: "passive",
    values: { common: 3, rare: 6, epic: 12, legendary: 25 },
    describe: (value) => `운석 기본 쿨타임 -${value}초`
  },
  {
    id: "starBreak",
    name: "스타 브레이크",
    kind: "burst",
    values: { common: 100, rare: 300, epic: 1000, legendary: 5000 },
    describe: (value) => `즉시 현재 초당 획득량의 ${value}초 분량 획득`
  },
  {
    id: "xpAmplify",
    name: "경험치 증폭",
    kind: "passive",
    values: { common: 20, rare: 50, epic: 100, legendary: 300 },
    describe: (value) => `클릭 시 XP 획득량 +${value}%`
  },
  {
    id: "criticalStrike",
    name: "치명적 타격",
    kind: "passive",
    values: {
      common: { chance: 2, multiplier: 0.5 },
      rare: { chance: 4, multiplier: 1 },
      epic: { chance: 7, multiplier: 2 },
      legendary: { chance: 12, multiplier: 5 }
    },
    describe: (value) => `크리티컬 확률 +${value.chance}%, 배율 +${value.multiplier}x`
  },
  {
    id: "feverExtend",
    name: "피버 연장",
    kind: "passive",
    values: { common: 5, rare: 12, epic: 25, legendary: 60 },
    describe: (value) => `황금 운석 피버 타임 +${value}초`
  },
  {
    id: "meteorEffectBoost",
    name: "운석 효과 증가",
    kind: "passive",
    values: { common: 50, rare: 75, epic: 125, legendary: 200 },
    describe: (value) => `피버 타임 배율 +${value}%`
  },
  {
    id: "growthLight",
    name: "성장의 빛 (진화)",
    kind: "evolution",
    values: { common: true, rare: true, epic: true, legendary: true },
    describe: () => "보유 카드 중 가장 낮은 등급 1장을 한 단계 진화"
  }
];
const CARD_LIBRARY_BY_ID = Object.fromEntries(CARD_LIBRARY.map((card) => [card.id, card]));

function createInitialState() {
  return {
    stardust: 0,
    darkMatter: 0,
    clickPower: 1,
    level: 1,
    xp: 0,
    pendingLevelUps: 0,
    isLevelupOpen: false,
    autoMiner: { price: 50, amount: 0, perSecond: 1 },
    quantumProbe: { price: 500, amount: 0, perSecond: 10 },
    milkyDrive: { price: 200, amount: 0, clickBoost: 2 },
    criticalShop: {
      chance: { price: 2000, level: 0 },
      multiplier: { price: 3000, level: 0 }
    },
    feverUntil: 0,
    meteorVisible: false,
    meteorCooldownUntil: 0,
    darkMatterShop: {
      distortion: { price: 1, level: 0 },
      singularity: { price: 3, level: 0 }
    },
    cardBuffs: createEmptyCardBuffs(),
    cardInventory: [],
    nextCardUid: 1,
    stats: {
      totalClicks: 0,
      meteorClicks: 0,
      autoMinersPurchased: 0
    },
    achievements: {
      cosmicPioneer: false,
      stardustTycoon: false,
      satelliteCollector: false,
      luckyAstronomer: false
    }
  };
}

function createEmptyCardBuffs() {
  return {
    clickFlatBonus: 0,
    clickPercentBonus: 0,
    autoPercentBonus: 0,
    meteorCooldownReductionSec: 0,
    xpBonus: 0,
    criticalChanceBonus: 0,
    criticalMultiplierBonus: 0,
    feverDurationBonusSec: 0,
    feverMultiplierBonus: 0
  };
}

const state = createInitialState();

const elements = {
  stardust: document.getElementById("stardust-count"),
  darkMatter: document.getElementById("dark-matter-count"),
  perSecond: document.getElementById("per-second"),
  clickPower: document.getElementById("click-power"),
  feverStatus: document.getElementById("fever-status"),
  rebirthButton: document.getElementById("rebirth-button"),
  statsToggle: document.getElementById("stats-toggle"),
  codexToggle: document.getElementById("codex-toggle"),
  resetProgressButton: document.getElementById("reset-progress-button"),
  resetConfirmOverlay: document.getElementById("reset-confirm-overlay"),
  resetConfirmCancel: document.getElementById("reset-confirm-cancel"),
  resetConfirmAccept: document.getElementById("reset-confirm-accept"),
  levelValue: document.getElementById("level-value"),
  xpCurrent: document.getElementById("xp-current"),
  xpRequired: document.getElementById("xp-required"),
  xpFill: document.getElementById("xp-fill"),
  statCriticalChance: document.getElementById("stat-critical-chance"),
  statCriticalMultiplier: document.getElementById("stat-critical-multiplier"),
  statMeteorChance: document.getElementById("stat-meteor-chance"),
  statFeverDuration: document.getElementById("stat-fever-duration"),
  statPerSecondMultiplier: document.getElementById("stat-per-second-multiplier"),
  statClickMultiplier: document.getElementById("stat-click-multiplier"),
  statCardClickFlat: document.getElementById("stat-card-click-flat"),
  statCardAutoMultiplier: document.getElementById("stat-card-auto-multiplier"),
  statXpGain: document.getElementById("stat-xp-gain"),
  statXpMultiplier: document.getElementById("stat-xp-multiplier"),
  statPanel: document.getElementById("stat-panel"),
  codexPanel: document.getElementById("codex-panel"),
  codexList: document.getElementById("codex-list"),
  inventoryToggle: document.getElementById("inventory-toggle"),
  inventoryPanel: document.getElementById("inventory-panel"),
  inventorySummary: document.getElementById("inventory-summary"),
  inventoryGrid: document.getElementById("inventory-grid"),
  levelupOverlay: document.getElementById("levelup-overlay"),
  levelupCards: document.getElementById("levelup-cards"),
  levelupPreview: document.getElementById("levelup-preview"),
  planetButton: document.getElementById("planet-button"),
  planetSection: document.querySelector(".planet-section"),
  satelliteLayer: document.getElementById("satellite-layer"),
  autoMinerTitle: document.getElementById("auto-miner-title"),
  autoMinerCost: document.getElementById("auto-miner-cost"),
  quantumProbeTitle: document.getElementById("quantum-probe-title"),
  quantumProbeCost: document.getElementById("quantum-probe-cost"),
  milkyDriveTitle: document.getElementById("milky-drive-title"),
  milkyDriveCost: document.getElementById("milky-drive-cost"),
  buyAutoMiner: document.getElementById("buy-auto-miner"),
  buyQuantumProbe: document.getElementById("buy-quantum-probe"),
  buyMilkyDrive: document.getElementById("buy-milky-drive"),
  criticalChanceShopCost: document.getElementById("critical-chance-shop-cost"),
  criticalChanceShopLevel: document.getElementById("critical-chance-shop-level"),
  criticalMultiplierShopCost: document.getElementById("critical-multiplier-shop-cost"),
  criticalMultiplierShopLevel: document.getElementById("critical-multiplier-shop-level"),
  buyCriticalChanceShop: document.getElementById("buy-critical-chance-shop"),
  buyCriticalMultiplierShop: document.getElementById("buy-critical-multiplier-shop"),
  distortionCost: document.getElementById("distortion-cost"),
  distortionLevel: document.getElementById("distortion-level"),
  singularityCost: document.getElementById("singularity-cost"),
  singularityLevel: document.getElementById("singularity-level"),
  buyDistortion: document.getElementById("buy-distortion"),
  buySingularity: document.getElementById("buy-singularity"),
  achievementsToggle: document.getElementById("achievements-toggle"),
  dmLabToggle: document.getElementById("dm-lab-toggle"),
  audioToggle: document.getElementById("audio-toggle"),
  achievementPanel: document.getElementById("achievement-panel"),
  darkMatterLab: document.getElementById("dark-matter-lab"),
  achievementToast: document.getElementById("achievement-toast"),
  achievementNodes: {
    cosmicPioneer: document.getElementById("achievement-cosmic-pioneer"),
    stardustTycoon: document.getElementById("achievement-stardust-tycoon"),
    satelliteCollector: document.getElementById("achievement-satellite-collector"),
    luckyAstronomer: document.getElementById("achievement-lucky-astronomer")
  }
};

let achievementToastTimeoutId;
let resetConfirmResolver = null;
let levelupCardUnlockAt = 0;
let wasFeverActiveLastTick = false;
const audioState = {
  context: null,
  masterGain: null,
  sfxGain: null,
  bgmGain: null,
  schedulerId: null,
  nextNoteTime: 0,
  step: 0,
  muted: localStorage.getItem(AUDIO_PREF_KEY) === "true",
  userActivated: false
};

function formatRounded(value, digits) {
  const factor = 10 ** digits;
  const rounded = Math.round(Number(value) * factor) / factor;
  return rounded.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits
  });
}

function formatStardust(value) {
  return formatRounded(value, 1);
}

function formatRate(value) {
  return formatRounded(value, 3);
}

function formatPercent(value, digits = 1) {
  return `${formatRounded(value * 100, digits)}%`;
}

function updateAudioToggleUi() {
  elements.audioToggle.textContent = audioState.muted ? "🔇" : "🔊";
  elements.audioToggle.setAttribute("aria-pressed", String(audioState.muted));
  elements.audioToggle.setAttribute("aria-label", audioState.muted ? "오디오 켜기" : "오디오 끄기");
}

function ensureAudioContext() {
  if (audioState.context) {
    return audioState.context;
  }
  const context = new window.AudioContext();
  const masterGain = context.createGain();
  const sfxGain = context.createGain();
  const bgmGain = context.createGain();
  const compressor = context.createDynamicsCompressor();

  masterGain.gain.value = audioState.muted ? 0 : 0.75;
  sfxGain.gain.value = 1;
  bgmGain.gain.value = 0.5;
  compressor.threshold.value = -20;
  compressor.knee.value = 8;
  compressor.ratio.value = 2.5;

  sfxGain.connect(masterGain);
  bgmGain.connect(masterGain);
  masterGain.connect(compressor);
  compressor.connect(context.destination);

  audioState.context = context;
  audioState.masterGain = masterGain;
  audioState.sfxGain = sfxGain;
  audioState.bgmGain = bgmGain;
  startBgmScheduler();
  return context;
}

function setMuted(muted) {
  audioState.muted = muted;
  localStorage.setItem(AUDIO_PREF_KEY, String(muted));
  updateAudioToggleUi();
  if (audioState.masterGain) {
    const now = audioState.context.currentTime;
    audioState.masterGain.gain.cancelScheduledValues(now);
    audioState.masterGain.gain.linearRampToValueAtTime(muted ? 0 : 0.75, now + 0.06);
  }
}

function unlockAudioContext() {
  const context = ensureAudioContext();
  if (context.state === "suspended") {
    context.resume().catch(() => {
      // ignore resume failures from transient browser states
    });
  }
}

function activateAudioFromUserAction() {
  audioState.userActivated = true;
  unlockAudioContext();
}

function createPulseSound({
  frequency = 440,
  duration = 0.12,
  type = "sine",
  gain = 0.1,
  sweep = 1
}) {
  const context = ensureAudioContext();
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const amp = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, frequency * sweep), now + duration);
  amp.gain.setValueAtTime(0.0001, now);
  amp.gain.exponentialRampToValueAtTime(gain, now + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(amp);
  amp.connect(audioState.sfxGain);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

function createNoiseBurst(duration = 0.14, gain = 0.06, highpass = 600) {
  const context = ensureAudioContext();
  const now = context.currentTime;
  const bufferSize = Math.max(1, Math.floor(context.sampleRate * duration));
  const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i += 1) {
    output[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const source = context.createBufferSource();
  source.buffer = noiseBuffer;
  const filter = context.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.setValueAtTime(highpass, now);

  const amp = context.createGain();
  amp.gain.setValueAtTime(gain, now);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  source.connect(filter);
  filter.connect(amp);
  amp.connect(audioState.sfxGain);
  source.start(now);
  source.stop(now + duration + 0.01);
}

function playClickSound(isCritical) {
  if (!audioState.userActivated) {
    return;
  }
  if (isCritical) {
    createPulseSound({ frequency: 760, duration: 0.12, type: "triangle", gain: 0.17, sweep: 1.4 });
    createPulseSound({ frequency: 1180, duration: 0.1, type: "sine", gain: 0.12, sweep: 1.2 });
    return;
  }
  createPulseSound({ frequency: 380, duration: 0.1, type: "triangle", gain: 0.09, sweep: 1.08 });
}

function playMeteorSpawnSound() {
  if (!audioState.userActivated) {
    return;
  }
  createPulseSound({ frequency: 880, duration: 0.22, type: "sine", gain: 0.12, sweep: 1.01 });
}

function playFeverStartSound() {
  if (!audioState.userActivated) {
    return;
  }
  const context = ensureAudioContext();
  const now = context.currentTime;
  [420, 560, 760, 980, 1260].forEach((freq, index) => {
    const startAt = now + index * 0.05;
    const oscillator = context.createOscillator();
    const amp = context.createGain();
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(freq, startAt);
    oscillator.frequency.exponentialRampToValueAtTime(freq * 1.08, startAt + 0.09);
    amp.gain.setValueAtTime(0.0001, startAt);
    amp.gain.exponentialRampToValueAtTime(0.08, startAt + 0.012);
    amp.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.1);
    oscillator.connect(amp);
    amp.connect(audioState.sfxGain);
    oscillator.start(startAt);
    oscillator.stop(startAt + 0.11);
  });
  createNoiseBurst(0.24, 0.05, 1200);
}

function playLevelupSound() {
  if (!audioState.userActivated) {
    return;
  }
  createPulseSound({ frequency: 320, duration: 0.3, type: "triangle", gain: 0.1, sweep: 1.03 });
  createPulseSound({ frequency: 480, duration: 0.32, type: "sine", gain: 0.1, sweep: 1.04 });
  createPulseSound({ frequency: 640, duration: 0.34, type: "sine", gain: 0.08, sweep: 1.05 });
}

function playCardPickSound() {
  if (!audioState.userActivated) {
    return;
  }
  createNoiseBurst(0.1, 0.05, 700);
  createPulseSound({ frequency: 460, duration: 0.11, type: "triangle", gain: 0.08, sweep: 0.88 });
}

function scheduleBgmStep(stepTime, feverMode) {
  const context = ensureAudioContext();
  const chordMap = feverMode
    ? [220, 262, 294, 262, 220, 330, 294, 262]
    : [196, 220, 247, 220, 196, 247, 220, 196];
  const bassRoot = chordMap[audioState.step % chordMap.length];

  const bassOsc = context.createOscillator();
  const bassGain = context.createGain();
  bassOsc.type = feverMode ? "sawtooth" : "triangle";
  bassOsc.frequency.setValueAtTime(bassRoot / 2, stepTime);
  bassGain.gain.setValueAtTime(0.0001, stepTime);
  bassGain.gain.exponentialRampToValueAtTime(feverMode ? 0.05 : 0.035, stepTime + 0.03);
  bassGain.gain.exponentialRampToValueAtTime(0.0001, stepTime + 0.36);
  bassOsc.connect(bassGain);
  bassGain.connect(audioState.bgmGain);
  bassOsc.start(stepTime);
  bassOsc.stop(stepTime + 0.38);

  const leadFreq = bassRoot * (feverMode ? 2.05 : 1.98);
  const leadOsc = context.createOscillator();
  const leadGain = context.createGain();
  leadOsc.type = "sine";
  leadOsc.frequency.setValueAtTime(leadFreq, stepTime);
  leadGain.gain.setValueAtTime(0.0001, stepTime);
  leadGain.gain.exponentialRampToValueAtTime(feverMode ? 0.03 : 0.02, stepTime + 0.02);
  leadGain.gain.exponentialRampToValueAtTime(0.0001, stepTime + 0.2);
  leadOsc.connect(leadGain);
  leadGain.connect(audioState.bgmGain);
  leadOsc.start(stepTime);
  leadOsc.stop(stepTime + 0.21);

}

function startBgmScheduler() {
  if (audioState.schedulerId) {
    return;
  }
  audioState.nextNoteTime = ensureAudioContext().currentTime;
  audioState.step = 0;
  audioState.schedulerId = window.setInterval(() => {
    if (!audioState.context) {
      return;
    }
    const context = audioState.context;
    const feverMode = isFeverActive();
    const tempo = feverMode ? 124 : 86;
    const stepDuration = 60 / tempo / 2;
    while (audioState.nextNoteTime < context.currentTime + 0.18) {
      scheduleBgmStep(audioState.nextNoteTime, feverMode);
      audioState.nextNoteTime += stepDuration;
      audioState.step = (audioState.step + 1) % 64;
    }
  }, 90);
}

function createClickParticles(x, y, isCritical = false) {
  const count = isCritical ? 7 : 6;
  for (let i = 0; i < count; i += 1) {
    const particle = document.createElement("span");
    const useStar = Math.random() > 0.45;
    particle.className = useStar ? "click-particle star" : "click-particle";
    elements.planetButton.appendChild(particle);

    let posX = x;
    let posY = y;
    let velocityX = (Math.random() - 0.5) * 5.2;
    let velocityY = -2 - Math.random() * 3.2;
    const gravity = 0.16 + Math.random() * 0.06;
    let alpha = 1;

    const tick = () => {
      posX += velocityX;
      posY += velocityY;
      velocityY += gravity;
      alpha -= 0.03;
      particle.style.left = `${posX}px`;
      particle.style.top = `${posY}px`;
      particle.style.opacity = `${Math.max(0, alpha)}`;

      if (alpha > 0) {
        requestAnimationFrame(tick);
      } else {
        particle.remove();
      }
    };

    requestAnimationFrame(tick);
  }
}

function attachLegendaryDust(cardNode) {
  const dustLayer = document.createElement("div");
  dustLayer.className = "legendary-dust";
  for (let i = 0; i < 10; i += 1) {
    const dust = document.createElement("span");
    dust.className = "dust";
    dust.style.setProperty("--x", `${8 + Math.random() * 84}%`);
    dust.style.setProperty("--drift", `${-18 + Math.random() * 36}px`);
    dust.style.setProperty("--delay", `${Math.random() * 1.6}s`);
    dust.style.setProperty("--duration", `${1.25 + Math.random() * 1.2}s`);
    dustLayer.appendChild(dust);
  }
  cardNode.appendChild(dustLayer);
}

function triggerLegendaryBurst(text) {
  const burst = document.createElement("div");
  burst.className = "legendary-burst";
  burst.innerHTML = `<span>${text}</span>`;
  document.body.appendChild(burst);
  burst.addEventListener("animationend", () => burst.remove());
}

function renderCardCodex() {
  elements.codexList.innerHTML = CARD_LIBRARY.map((card) => {
    if (card.kind === "evolution") {
      return `<article class="codex-item"><h3>${card.name}</h3><ul><li><span class="codex-rarity legendary">특수</span> ${card.describe()}</li></ul></article>`;
    }
    const rarityRows = RARITIES.map((rarity) => {
      const text = card.describe(card.values[rarity.key]);
      return `<li><span class="codex-rarity ${rarity.key}">${rarity.label}</span> ${text}</li>`;
    }).join("");
    return `<article class="codex-item"><h3>${card.name}</h3><ul>${rarityRows}</ul></article>`;
  }).join("");
}

function getRarityLabel(rarityKey) {
  return RARITIES.find((rarity) => rarity.key === rarityKey)?.label ?? rarityKey;
}

function getCardValue(cardId, rarity) {
  const card = CARD_LIBRARY_BY_ID[cardId];
  if (!card) {
    return null;
  }
  return card.values?.[rarity] ?? null;
}

function applyPassiveCardToBuffs(cardId, rarity, buffs) {
  const value = getCardValue(cardId, rarity);
  if (value === null || value === undefined) {
    return;
  }
  if (cardId === "overloadClick") {
    if (value.type === "flat") {
      buffs.clickFlatBonus += value.value;
    } else {
      buffs.clickPercentBonus += value.value / 100;
    }
    return;
  }
  if (cardId === "spaceAcceleration") {
    buffs.autoPercentBonus += value / 100;
    return;
  }
  if (cardId === "meteorMagnet") {
    buffs.meteorCooldownReductionSec += value;
    return;
  }
  if (cardId === "xpAmplify") {
    buffs.xpBonus += value / 100;
    return;
  }
  if (cardId === "criticalStrike") {
    buffs.criticalChanceBonus += value.chance / 100;
    buffs.criticalMultiplierBonus += value.multiplier;
    return;
  }
  if (cardId === "feverExtend") {
    buffs.feverDurationBonusSec += value;
    return;
  }
  if (cardId === "meteorEffectBoost") {
    buffs.feverMultiplierBonus += value / 100;
  }
}

function recalculateCardBuffs() {
  const buffs = createEmptyCardBuffs();
  state.cardInventory.forEach((cardInstance) => {
    const cardBase = CARD_LIBRARY_BY_ID[cardInstance.cardId];
    if (!cardBase || cardBase.kind !== "passive") {
      return;
    }
    applyPassiveCardToBuffs(cardInstance.cardId, cardInstance.rarity, buffs);
  });
  state.cardBuffs = buffs;
}

function renderInventoryUi() {
  const typeCountMap = {};
  const rarityCountMap = { common: 0, rare: 0, epic: 0, legendary: 0 };
  let passiveTotal = 0;
  let burstTotal = 0;
  let evolutionTotal = 0;

  state.cardInventory.forEach((cardInstance) => {
    const cardBase = CARD_LIBRARY_BY_ID[cardInstance.cardId];
    if (!cardBase) {
      return;
    }
    if (cardBase.kind === "passive") {
      passiveTotal += 1;
    } else if (cardBase.kind === "burst") {
      burstTotal += 1;
    } else if (cardBase.kind === "evolution") {
      evolutionTotal += 1;
    }
    rarityCountMap[cardInstance.rarity] = (rarityCountMap[cardInstance.rarity] ?? 0) + 1;
    if (!typeCountMap[cardInstance.cardId]) {
      typeCountMap[cardInstance.cardId] = { cardBase, total: 0, rarities: { common: 0, rare: 0, epic: 0, legendary: 0 } };
    }
    typeCountMap[cardInstance.cardId].total += 1;
    typeCountMap[cardInstance.cardId].rarities[cardInstance.rarity] += 1;
  });

  elements.inventorySummary.innerHTML = `
    <article class="summary-tile"><strong>총 보유 카드</strong>${state.cardInventory.length.toLocaleString()}장</article>
    <article class="summary-tile"><strong>영구 패시브 카드</strong>${passiveTotal.toLocaleString()}장</article>
    <article class="summary-tile"><strong>일반/희귀/영웅/전설</strong>${rarityCountMap.common}/${rarityCountMap.rare}/${rarityCountMap.epic}/${rarityCountMap.legendary}</article>
    <article class="summary-tile"><strong>일시 효과/진화 카드</strong>${burstTotal}/${evolutionTotal}</article>
  `;

  elements.inventoryGrid.innerHTML = "";
  if (state.cardInventory.length === 0) {
    elements.inventoryGrid.innerHTML = '<p class="inventory-empty">아직 보유한 카드가 없습니다.</p>';
    return;
  }
  const grouped = Object.values(typeCountMap).sort((a, b) => b.total - a.total || a.cardBase.name.localeCompare(b.cardBase.name));
  grouped.forEach(({ cardBase, total, rarities }) => {
    const highestRarity = [...RARITY_ORDER].reverse().find((rarityKey) => rarities[rarityKey] > 0) ?? "common";
    const cardNode = document.createElement("article");
    cardNode.className = `inventory-card ${highestRarity}`;
    const rarityLine = RARITIES.map((rarity) => `${rarity.label} ${rarities[rarity.key]}`).join(" | ");
    const highestValue = getCardValue(cardBase.id, highestRarity);
    cardNode.innerHTML = `<h4>${cardBase.name}</h4>
      <p>${cardBase.kind === "passive" ? "영구 패시브" : cardBase.kind === "burst" ? "일시 효과" : "진화 효과"}</p>
      <p>${rarityLine}</p>
      <p>${cardBase.describe(highestValue)}</p>
      <p class="inventory-count">총 ${total.toLocaleString()}장 보유</p>`;
    elements.inventoryGrid.appendChild(cardNode);
  });
}

function buildStatSnapshot(customBuffs = state.cardBuffs) {
  const shopLayer = 1 + getShopPercentBonus();
  const clickLayer = 1 + customBuffs.clickPercentBonus;
  const autoLayer = 1 + customBuffs.autoPercentBonus;
  return {
    clickGain: (state.clickPower + customBuffs.clickFlatBonus) * shopLayer * clickLayer * getFeverMultiplier(),
    perSecond: getBasePerSecondRate() * shopLayer * autoLayer * getFeverMultiplier(),
    criticalChance: Math.min(0.95, Math.max(0, getBaseCriticalChance() + customBuffs.criticalChanceBonus))
  };
}

function formatDelta(beforeValue, afterValue, digits = 1) {
  const diff = afterValue - beforeValue;
  return `${formatRounded(beforeValue, digits)} ➜ ${formatRounded(afterValue, digits)} (${diff >= 0 ? "+" : ""}${formatRounded(
    diff,
    digits
  )})`;
}

function previewCardText(card) {
  const before = buildStatSnapshot();
  if (card.baseId === "starBreak") {
    const value = getCardValue(card.baseId, card.rarityClass);
    const burstGain = getPerSecondRate() * value;
    return `획득량 미리보기: 스타더스트 +${formatRate(burstGain)} (즉시 지급)`;
  }
  if (card.baseId === "growthLight") {
    return "성장의 빛: 가장 낮은 등급 카드 1장을 한 단계 진화합니다.";
  }
  const virtualBuffs = { ...state.cardBuffs };
  applyPassiveCardToBuffs(card.baseId, card.rarityClass, virtualBuffs);
  const after = buildStatSnapshot(virtualBuffs);
  if (card.baseId === "overloadClick") {
    return `클릭 생산량: ${formatDelta(before.clickGain, after.clickGain, 1)}`;
  }
  if (card.baseId === "spaceAcceleration") {
    return `자동 생산량/초: ${formatDelta(before.perSecond, after.perSecond, 1)}`;
  }
  if (card.baseId === "xpAmplify") {
    const beforeXp = getClickXpGain();
    const afterXp = BASE_CLICK_XP * (1 + virtualBuffs.xpBonus);
    return `클릭 XP 획득량: ${formatDelta(beforeXp, afterXp, 2)}`;
  }
  if (card.baseId === "criticalStrike") {
    const beforeCrit = getCriticalChance();
    const afterCrit = Math.min(0.95, Math.max(0, getBaseCriticalChance() + virtualBuffs.criticalChanceBonus));
    return `크리티컬 확률: ${formatPercent(beforeCrit, 2)} ➜ ${formatPercent(afterCrit, 2)} (+${formatPercent(
      afterCrit - beforeCrit,
      2
    )})`;
  }
  if (card.baseId === "meteorMagnet") {
    const beforeCooldown = getMeteorCooldownMs();
    const afterCooldown = Math.max(
      METEOR_MIN_COOLDOWN_MS,
      METEOR_BASE_COOLDOWN_MS - virtualBuffs.meteorCooldownReductionSec * 1000
    );
    return `운석 쿨타임: ${Math.round(beforeCooldown / 1000)}초 ➜ ${Math.round(afterCooldown / 1000)}초`;
  }
  if (card.baseId === "feverExtend") {
    return `피버 시간: ${Math.round(getFeverDurationMs() / 1000)}초 ➜ ${Math.round(
      Math.min(MAX_FEVER_DURATION_MS, BASE_FEVER_DURATION_MS + virtualBuffs.feverDurationBonusSec * 1000) / 1000
    )}초`;
  }
  if (card.baseId === "meteorEffectBoost") {
    const beforeFever = FEVER_MULTIPLIER * (1 + state.cardBuffs.feverMultiplierBonus);
    const afterFever = FEVER_MULTIPLIER * (1 + virtualBuffs.feverMultiplierBonus);
    return `피버 배율: x${formatRate(beforeFever)} ➜ x${formatRate(afterFever)}`;
  }
  return `클릭 생산량: ${formatDelta(before.clickGain, after.clickGain, 1)} / 자동 생산량: ${formatDelta(before.perSecond, after.perSecond, 1)}`;
}

function getXpRequiredForLevel(level) {
  return Math.floor(100 * Math.pow(1.15, level));
}

function getClickXpGain() {
  return BASE_CLICK_XP * (1 + state.cardBuffs.xpBonus);
}

function getPermanentGainBonus() {
  return state.darkMatterShop.distortion.level * 0.5;
}

function getClickCardBonus() {
  return state.cardBuffs.clickPercentBonus;
}

function getAutoCardBonus() {
  return state.cardBuffs.autoPercentBonus;
}

function getMeteorCooldownMs() {
  const reduced = METEOR_BASE_COOLDOWN_MS - state.cardBuffs.meteorCooldownReductionSec * 1000;
  return Math.max(METEOR_MIN_COOLDOWN_MS, reduced);
}

function getBaseCriticalChance() {
  return Math.min(MAX_BASE_CRITICAL_CHANCE, BASE_CRITICAL_CHANCE + state.criticalShop.chance.level * 0.01);
}

function getBaseCriticalMultiplier() {
  return Math.min(
    MAX_BASE_CRITICAL_MULTIPLIER,
    BASE_CRITICAL_MULTIPLIER + state.criticalShop.multiplier.level * 0.1
  );
}

function getCriticalChance() {
  return Math.min(0.95, Math.max(0, getBaseCriticalChance() + state.cardBuffs.criticalChanceBonus));
}

function getCriticalMultiplier() {
  return Math.max(1, getBaseCriticalMultiplier() + state.cardBuffs.criticalMultiplierBonus);
}

function getFeverDurationMs() {
  return Math.min(MAX_FEVER_DURATION_MS, BASE_FEVER_DURATION_MS + state.cardBuffs.feverDurationBonusSec * 1000);
}

function getBasePerSecondRate() {
  return (
    state.autoMiner.amount * state.autoMiner.perSecond +
    state.quantumProbe.amount * state.quantumProbe.perSecond
  );
}

function isFeverActive() {
  return Date.now() < state.feverUntil;
}

function getFeverBonus() {
  if (!isFeverActive()) {
    return 0;
  }
  return FEVER_MULTIPLIER * (1 + state.cardBuffs.feverMultiplierBonus) - 1;
}

function getShopPercentBonus() {
  return getPermanentGainBonus();
}

function getFeverMultiplier() {
  return 1 + getFeverBonus();
}

function getPerSecondRate() {
  const shopLayer = 1 + getShopPercentBonus();
  const cardLayer = 1 + getAutoCardBonus();
  return getBasePerSecondRate() * shopLayer * cardLayer * getFeverMultiplier();
}

function getClickGain() {
  const baseClick = state.clickPower + state.cardBuffs.clickFlatBonus;
  const shopLayer = 1 + getShopPercentBonus();
  const cardLayer = 1 + getClickCardBonus();
  return baseClick * shopLayer * cardLayer * getFeverMultiplier();
}

function getRebirthDarkMatterGain() {
  if (state.stardust < REBIRTH_THRESHOLD) {
    return 0;
  }
  const baseGain = Math.floor(state.stardust / REBIRTH_THRESHOLD);
  const rebirthBonus = 1 + state.darkMatterShop.singularity.level * 0.5;
  return Math.floor(baseGain * rebirthBonus);
}

function saveState() {
  const saveData = {
    stardust: state.stardust,
    darkMatter: state.darkMatter,
    clickPower: state.clickPower,
    level: state.level,
    xp: state.xp,
    autoMiner: {
      price: state.autoMiner.price,
      amount: state.autoMiner.amount
    },
    quantumProbe: {
      price: state.quantumProbe.price,
      amount: state.quantumProbe.amount
    },
    milkyDrive: {
      price: state.milkyDrive.price,
      amount: state.milkyDrive.amount
    },
    criticalShop: {
      chance: {
        price: state.criticalShop.chance.price,
        level: state.criticalShop.chance.level
      },
      multiplier: {
        price: state.criticalShop.multiplier.price,
        level: state.criticalShop.multiplier.level
      }
    },
    darkMatterShop: {
      distortion: { price: state.darkMatterShop.distortion.price, level: state.darkMatterShop.distortion.level },
      singularity: { price: state.darkMatterShop.singularity.price, level: state.darkMatterShop.singularity.level }
    },
    cardInventory: state.cardInventory.map((card) => ({
      uid: card.uid,
      cardId: card.cardId,
      rarity: card.rarity
    })),
    nextCardUid: state.nextCardUid,
    stats: {
      totalClicks: state.stats.totalClicks,
      meteorClicks: state.stats.meteorClicks,
      autoMinersPurchased: state.stats.autoMinersPurchased
    },
    achievements: {
      cosmicPioneer: state.achievements.cosmicPioneer,
      stardustTycoon: state.achievements.stardustTycoon,
      satelliteCollector: state.achievements.satelliteCollector,
      luckyAstronomer: state.achievements.luckyAstronomer
    },
    feverUntil: state.feverUntil,
    meteorCooldownUntil: state.meteorCooldownUntil
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
}

function loadState() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) {
    return;
  }

  try {
    const parsed = JSON.parse(raw);

    state.stardust = Math.max(0, Number(parsed.stardust) || 0);
    state.darkMatter = Math.max(0, Math.floor(Number(parsed.darkMatter) || 0));
    state.clickPower = Math.max(1, Number(parsed.clickPower) || 1);
    state.level = Math.max(1, Math.floor(Number(parsed.level) || 1));
    state.xp = Math.max(0, Number(parsed.xp) || 0);

    state.autoMiner.price = Math.max(50, Number(parsed.autoMiner?.price) || 50);
    state.autoMiner.amount = Math.max(0, Number(parsed.autoMiner?.amount) || 0);

    state.quantumProbe.price = Math.max(500, Number(parsed.quantumProbe?.price) || 500);
    state.quantumProbe.amount = Math.max(0, Number(parsed.quantumProbe?.amount) || 0);

    state.milkyDrive.price = Math.max(200, Number(parsed.milkyDrive?.price) || 200);
    state.milkyDrive.amount = Math.max(0, Number(parsed.milkyDrive?.amount) || 0);

    state.criticalShop.chance.price = Math.max(2000, Number(parsed.criticalShop?.chance?.price) || 2000);
    state.criticalShop.chance.level = Math.max(0, Number(parsed.criticalShop?.chance?.level) || 0);
    state.criticalShop.multiplier.price = Math.max(
      3000,
      Number(parsed.criticalShop?.multiplier?.price) || 3000
    );
    state.criticalShop.multiplier.level = Math.max(0, Number(parsed.criticalShop?.multiplier?.level) || 0);

    state.darkMatterShop.distortion.price = Math.max(1, Number(parsed.darkMatterShop?.distortion?.price) || 1);
    state.darkMatterShop.distortion.level = Math.max(0, Number(parsed.darkMatterShop?.distortion?.level) || 0);

    state.darkMatterShop.singularity.price = Math.max(3, Number(parsed.darkMatterShop?.singularity?.price) || 3);
    state.darkMatterShop.singularity.level = Math.max(0, Number(parsed.darkMatterShop?.singularity?.level) || 0);

    state.cardBuffs = createEmptyCardBuffs();

    state.cardInventory = Array.isArray(parsed.cardInventory)
      ? parsed.cardInventory
          .map((card, index) => ({
            uid: Math.max(1, Math.floor(Number(card?.uid) || index + 1)),
            cardId: String(card?.cardId || ""),
            rarity: String(card?.rarity || "common")
          }))
          .filter((card) => CARD_LIBRARY_BY_ID[card.cardId] && RARITY_ORDER.includes(card.rarity))
      : [];
    const parsedNextUid = Math.floor(Number(parsed.nextCardUid) || 0);
    const maxUid = state.cardInventory.reduce((max, card) => Math.max(max, card.uid), 0);
    state.nextCardUid = Math.max(1, parsedNextUid || maxUid + 1);
    recalculateCardBuffs();

    state.stats.totalClicks = Math.max(0, Number(parsed.stats?.totalClicks) || 0);
    state.stats.meteorClicks = Math.max(0, Number(parsed.stats?.meteorClicks) || 0);
    state.stats.autoMinersPurchased = Math.max(0, Number(parsed.stats?.autoMinersPurchased) || 0);

    state.achievements.cosmicPioneer = Boolean(parsed.achievements?.cosmicPioneer);
    state.achievements.stardustTycoon = Boolean(parsed.achievements?.stardustTycoon);
    state.achievements.satelliteCollector = Boolean(parsed.achievements?.satelliteCollector);
    state.achievements.luckyAstronomer = Boolean(parsed.achievements?.luckyAstronomer);

    const feverUntil = Number(parsed.feverUntil) || 0;
    state.feverUntil = feverUntil > Date.now() ? feverUntil : 0;
    const meteorCooldownUntil = Number(parsed.meteorCooldownUntil) || 0;
    state.meteorCooldownUntil = meteorCooldownUntil > Date.now() ? meteorCooldownUntil : 0;
  } catch (error) {
    console.error("저장 데이터 파싱 실패:", error);
    localStorage.removeItem(SAVE_KEY);
  }
}

function updateFeverLabel() {
  if (isFeverActive()) {
    const remainSec = Math.ceil((state.feverUntil - Date.now()) / 1000);
    const feverMultiplier = FEVER_MULTIPLIER * (1 + state.cardBuffs.feverMultiplierBonus);
    elements.feverStatus.textContent = `피버 타임 x${formatRate(feverMultiplier)} (${remainSec}초 남음)`;
    return;
  }
  elements.feverStatus.textContent = `피버 타임 비활성 (지속 ${Math.round(getFeverDurationMs() / 1000)}초)`;
}

function updateSatellites() {
  const displayCount = Math.min(state.autoMiner.amount, 16);
  elements.satelliteLayer.innerHTML = "";

  if (displayCount <= 0) {
    elements.satelliteLayer.classList.remove("rotating");
    return;
  }

  elements.satelliteLayer.classList.add("rotating");
  const distance = 155;

  for (let i = 0; i < displayCount; i += 1) {
    const satellite = document.createElement("span");
    satellite.className = "satellite";
    satellite.style.setProperty("--angle", `${(360 / displayCount) * i}deg`);
    satellite.style.setProperty("--distance", `${distance}px`);
    elements.satelliteLayer.appendChild(satellite);
  }
}

function showAchievementToast(name) {
  if (achievementToastTimeoutId) {
    clearTimeout(achievementToastTimeoutId);
  }
  elements.achievementToast.textContent = `🏆 업적 달성: ${name}!`;
  elements.achievementToast.classList.add("show");
  achievementToastTimeoutId = setTimeout(() => {
    elements.achievementToast.classList.remove("show");
  }, 3000);
}

function unlockAchievement(id) {
  if (state.achievements[id]) {
    return;
  }
  state.achievements[id] = true;
  const found = ACHIEVEMENTS.find((item) => item.id === id);
  if (found) {
    showAchievementToast(found.name);
  }
  saveState();
}

function checkAchievements() {
  if (state.stats.totalClicks >= 100) {
    unlockAchievement("cosmicPioneer");
  }
  if (state.stardust >= 1000000) {
    unlockAchievement("stardustTycoon");
  }
  if (state.stats.autoMinersPurchased >= 10) {
    unlockAchievement("satelliteCollector");
  }
  if (state.stats.meteorClicks >= 5) {
    unlockAchievement("luckyAstronomer");
  }
}

function updateAchievementList() {
  Object.entries(elements.achievementNodes).forEach(([id, node]) => {
    node.classList.toggle("unlocked", Boolean(state.achievements[id]));
  });
}

function setPanelOpen(panel, toggleButton, open) {
  panel.classList.toggle("open", open);
  toggleButton.setAttribute("aria-expanded", String(open));
}

function togglePanel(panel, toggleButton) {
  const willOpen = !panel.classList.contains("open");
  setPanelOpen(panel, toggleButton, willOpen);
}

function closePanels() {
  setPanelOpen(elements.achievementPanel, elements.achievementsToggle, false);
  setPanelOpen(elements.darkMatterLab, elements.dmLabToggle, false);
  setPanelOpen(elements.statPanel, elements.statsToggle, false);
  setPanelOpen(elements.codexPanel, elements.codexToggle, false);
  setPanelOpen(elements.inventoryPanel, elements.inventoryToggle, false);
}

function rollCardRarity() {
  const rolled = Math.random();
  let cumulative = 0;
  for (const rarity of RARITIES) {
    cumulative += rarity.chance;
    if (rolled <= cumulative) {
      return rarity;
    }
  }
  return RARITIES[RARITIES.length - 1];
}

function buildLevelupCard(baseCard, rarity) {
  const value = baseCard.values?.[rarity.key];
  return {
    id: `${baseCard.id}-${rarity.key}`,
    baseId: baseCard.id,
    name: baseCard.name,
    rarityLabel: rarity.label,
    rarityClass: rarity.key,
    kind: baseCard.kind,
    description: baseCard.describe(value)
  };
}

function getRandomLevelupCards(count) {
  const rarity = rollCardRarity();
  const pool = [...CARD_LIBRARY];
  const selected = [];
  while (selected.length < count && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    const pickedCard = pool.splice(idx, 1)[0];
    selected.push(buildLevelupCard(pickedCard, rarity));
  }
  return selected;
}

function closeLevelupModal() {
  state.isLevelupOpen = false;
  document.body.classList.remove("levelup-open");
}

function isResetConfirmOpen() {
  return elements.resetConfirmOverlay.classList.contains("show");
}

function closeResetConfirmModal(confirmed) {
  if (!isResetConfirmOpen()) {
    return;
  }
  document.body.classList.remove("reset-confirm-open");
  elements.resetConfirmOverlay.classList.remove("show");
  elements.resetConfirmOverlay.setAttribute("aria-hidden", "true");

  if (resetConfirmResolver) {
    const resolver = resetConfirmResolver;
    resetConfirmResolver = null;
    resolver(confirmed);
  }
}

function openResetConfirmModal() {
  if (isResetConfirmOpen()) {
    return Promise.resolve(false);
  }
  document.body.classList.add("reset-confirm-open");
  elements.resetConfirmOverlay.classList.add("show");
  elements.resetConfirmOverlay.setAttribute("aria-hidden", "false");
  elements.resetConfirmAccept.focus();
  return new Promise((resolve) => {
    resetConfirmResolver = resolve;
  });
}

function addCardToInventory(cardId, rarity) {
  const newCard = {
    uid: state.nextCardUid,
    cardId,
    rarity
  };
  state.nextCardUid += 1;
  state.cardInventory.push(newCard);
  return newCard;
}

function tryEvolveOwnedCard() {
  const upgradable = state.cardInventory.filter(
    (card) => RARITY_ORDER.includes(card.rarity) && card.rarity !== "legendary"
  );
  if (upgradable.length === 0) {
    return null;
  }
  const sorted = [...upgradable].sort((a, b) => RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity));
  const target = sorted[0];
  const currentIndex = RARITY_ORDER.indexOf(target.rarity);
  target.rarity = RARITY_ORDER[currentIndex + 1];
  recalculateCardBuffs();
  return target;
}

function applyLevelupCardSelection(card) {
  if (card.baseId === "growthLight") {
    const evolved = tryEvolveOwnedCard();
    if (!evolved) {
      return "진화할 카드가 없어 성장 효과가 발동하지 않았습니다.";
    }
    const evolvedCardBase = CARD_LIBRARY_BY_ID[evolved.cardId];
    return `${evolvedCardBase?.name ?? evolved.cardId} 카드가 ${getRarityLabel(evolved.rarity)} 등급으로 진화했습니다!`;
  }

  addCardToInventory(card.baseId, card.rarityClass);
  const baseCard = CARD_LIBRARY_BY_ID[card.baseId];
  if (baseCard?.kind === "burst") {
    const burstValue = getCardValue(card.baseId, card.rarityClass);
    state.stardust += getPerSecondRate() * burstValue;
    return `저장소에 추가됨 + 즉시 ${formatRounded(burstValue, 0)}초 분량 보너스 지급`;
  }

  if (baseCard?.kind === "passive") {
    recalculateCardBuffs();
    return "저장소에 추가됨 (영구 패시브 즉시 적용)";
  }
  return "저장소에 추가됨";
}

function openLevelupModal() {
  if (state.pendingLevelUps <= 0) {
    closeLevelupModal();
    return;
  }

  state.isLevelupOpen = true;
  document.body.classList.add("levelup-open");
  elements.levelupCards.innerHTML = "";
  elements.levelupCards.classList.add("locked");
  elements.levelupPreview.textContent = "카드에 마우스를 올리면 선택 후 스탯 변화를 확인할 수 있습니다.";
  levelupCardUnlockAt = Date.now() + LEVELUP_CARD_LOCK_MS;

  const expectedUnlockAt = levelupCardUnlockAt;
  setTimeout(() => {
    if (levelupCardUnlockAt === expectedUnlockAt) {
      elements.levelupCards.classList.remove("locked");
    }
  }, LEVELUP_CARD_LOCK_MS);
  playLevelupSound();

  const cards = getRandomLevelupCards(3);
  cards.forEach((card) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `levelup-card ${card.rarityClass}`;
    button.innerHTML = `<span class="rarity-chip">${card.rarityLabel}</span><h3>${card.name}</h3><p>${card.description}</p>`;
    if (card.rarityClass === "legendary") {
      attachLegendaryDust(button);
    }
    const previewText = previewCardText(card);
    button.addEventListener("mouseenter", () => {
      elements.levelupPreview.textContent = previewText;
    });
    button.addEventListener("focus", () => {
      elements.levelupPreview.textContent = previewText;
    });
    button.addEventListener("mouseleave", () => {
      elements.levelupPreview.textContent = "카드에 마우스를 올리면 선택 후 스탯 변화를 확인할 수 있습니다.";
    });
    button.addEventListener("click", () => {
      if (Date.now() < levelupCardUnlockAt) {
        return;
      }
      playCardPickSound();
      if (card.rarityClass === "legendary" && card.baseId === "starBreak") {
        triggerLegendaryBurst("STAR BREAK JACKPOT!");
      }
      if (card.rarityClass === "legendary" && card.baseId === "meteorEffectBoost") {
        triggerLegendaryBurst("FEVER OVERDRIVE!");
      }
      const selectionNotice = applyLevelupCardSelection(card);
      elements.levelupPreview.textContent = selectionNotice;
      state.pendingLevelUps = Math.max(0, state.pendingLevelUps - 1);
      checkAchievements();
      updateView();
      saveState();
      if (state.pendingLevelUps > 0) {
        openLevelupModal();
      } else {
        closeLevelupModal();
      }
    });
    elements.levelupCards.appendChild(button);
  });
}

function gainXp(amount) {
  state.xp += amount;
  let leveled = false;

  while (state.xp >= getXpRequiredForLevel(state.level)) {
    state.xp -= getXpRequiredForLevel(state.level);
    state.level += 1;
    state.pendingLevelUps += 1;
    leveled = true;
  }

  if (leveled && !state.isLevelupOpen) {
    openLevelupModal();
  }
}

function updateLevelPanel() {
  const requiredXp = getXpRequiredForLevel(state.level);
  const percent = Math.max(0, Math.min(100, (state.xp / requiredXp) * 100));
  elements.levelValue.textContent = state.level.toLocaleString();
  elements.xpCurrent.textContent = formatStardust(state.xp);
  elements.xpRequired.textContent = requiredXp.toLocaleString();
  elements.xpFill.style.width = `${percent}%`;
}

function updateView() {
  const rebirthGain = getRebirthDarkMatterGain();
  const meteorChance = Date.now() >= state.meteorCooldownUntil ? METEOR_SPAWN_CHANCE_AFTER_COOLDOWN : 0;
  const criticalChance = getCriticalChance();
  const criticalMultiplier = getCriticalMultiplier();
  const clickXpGain = getClickXpGain();
  const perSecondMultiplier = (1 + getShopPercentBonus()) * (1 + getAutoCardBonus()) * getFeverMultiplier();
  const clickMultiplier = (1 + getShopPercentBonus()) * (1 + getClickCardBonus()) * getFeverMultiplier();

  elements.stardust.textContent = formatStardust(state.stardust);
  elements.darkMatter.textContent = state.darkMatter.toLocaleString();
  elements.perSecond.textContent = formatRate(getPerSecondRate());
  elements.clickPower.textContent = formatRate(getClickGain());

  elements.autoMinerTitle.textContent = `자동 채굴기 | +${state.autoMiner.amount.toLocaleString()}`;
  elements.autoMinerCost.textContent = state.autoMiner.price.toLocaleString();
  elements.quantumProbeTitle.textContent = `양자 탐사선 | +${state.quantumProbe.amount.toLocaleString()}`;
  elements.quantumProbeCost.textContent = state.quantumProbe.price.toLocaleString();
  elements.milkyDriveTitle.textContent = `은하수 드라이브 | +${state.milkyDrive.amount.toLocaleString()}`;
  elements.milkyDriveCost.textContent = state.milkyDrive.price.toLocaleString();
  elements.criticalChanceShopCost.textContent = state.criticalShop.chance.price.toLocaleString();
  elements.criticalChanceShopLevel.textContent = state.criticalShop.chance.level.toLocaleString();
  elements.criticalMultiplierShopCost.textContent = state.criticalShop.multiplier.price.toLocaleString();
  elements.criticalMultiplierShopLevel.textContent = state.criticalShop.multiplier.level.toLocaleString();

  elements.buyAutoMiner.disabled = state.stardust < state.autoMiner.price;
  elements.buyQuantumProbe.disabled = state.stardust < state.quantumProbe.price;
  elements.buyMilkyDrive.disabled = state.stardust < state.milkyDrive.price;
  elements.buyCriticalChanceShop.disabled =
    state.stardust < state.criticalShop.chance.price || getBaseCriticalChance() >= MAX_BASE_CRITICAL_CHANCE;
  elements.buyCriticalMultiplierShop.disabled =
    state.stardust < state.criticalShop.multiplier.price ||
    getBaseCriticalMultiplier() >= MAX_BASE_CRITICAL_MULTIPLIER;

  elements.distortionCost.textContent = state.darkMatterShop.distortion.price.toLocaleString();
  elements.distortionLevel.textContent = state.darkMatterShop.distortion.level.toLocaleString();
  elements.singularityCost.textContent = state.darkMatterShop.singularity.price.toLocaleString();
  elements.singularityLevel.textContent = state.darkMatterShop.singularity.level.toLocaleString();

  elements.buyDistortion.disabled = state.darkMatter < state.darkMatterShop.distortion.price;
  elements.buySingularity.disabled = state.darkMatter < state.darkMatterShop.singularity.price;

  elements.rebirthButton.disabled = state.stardust < REBIRTH_THRESHOLD || rebirthGain <= 0;
  elements.rebirthButton.textContent = `블랙홀 개방 (환생 +${rebirthGain} DM)`;
  elements.statCriticalChance.textContent = formatPercent(criticalChance, 2);
  elements.statCriticalMultiplier.textContent = `x${formatRate(criticalMultiplier)}`;
  elements.statMeteorChance.textContent = formatPercent(meteorChance, 2);
  elements.statFeverDuration.textContent = `${Math.round(getFeverDurationMs() / 1000)}초`;
  elements.statPerSecondMultiplier.textContent = `x${formatRate(perSecondMultiplier)}`;
  elements.statClickMultiplier.textContent = `x${formatRate(clickMultiplier)}`;
  elements.statCardClickFlat.textContent = `+${formatRate(state.cardBuffs.clickFlatBonus)}`;
  elements.statCardAutoMultiplier.textContent = `x${formatRate(1 + state.cardBuffs.autoPercentBonus)}`;
  elements.statXpGain.textContent = formatRate(clickXpGain);
  elements.statXpMultiplier.textContent = `x${formatRate(1 + state.cardBuffs.xpBonus)}`;

  updateLevelPanel();
  updateFeverLabel();
  updateSatellites();
  updateAchievementList();
  renderInventoryUi();
}

function raisePrice(currentPrice) {
  return Math.ceil(currentPrice * 1.5);
}

function raiseDarkMatterPrice(currentPrice) {
  return Math.ceil(currentPrice * 1.8);
}

function spendStardust(cost) {
  if (state.stardust < cost) {
    return false;
  }
  state.stardust -= cost;
  return true;
}

function spendDarkMatter(cost) {
  if (state.darkMatter < cost) {
    return false;
  }
  state.darkMatter -= cost;
  return true;
}

function createFloatingPlus(x, y, amount, isCritical = false) {
  const plus = document.createElement("span");
  plus.className = isCritical ? "floating-plus critical" : "floating-plus";
  plus.textContent = isCritical ? `CRIT +${formatRate(amount)}` : `+${formatRate(amount)}`;
  plus.style.left = `${x}px`;
  plus.style.top = `${y}px`;
  elements.planetButton.appendChild(plus);
  plus.addEventListener("animationend", () => plus.remove());
}

function scheduleMeteorCooldown(fromTime = Date.now()) {
  state.meteorCooldownUntil = fromTime + getMeteorCooldownMs();
}

function removeMeteor(startCooldown = true) {
  const meteor = document.getElementById("golden-meteor");
  if (meteor) {
    meteor.remove();
  }
  state.meteorVisible = false;
  if (startCooldown) {
    scheduleMeteorCooldown();
  }
}

function startFever() {
  playFeverStartSound();
  state.stats.meteorClicks += 1;
  state.feverUntil = Date.now() + getFeverDurationMs();
  removeMeteor(false);
  checkAchievements();
  updateView();
  saveState();
}

function spawnGoldenMeteor() {
  if (state.meteorVisible || isFeverActive()) {
    return;
  }

  const meteor = document.createElement("button");
  meteor.id = "golden-meteor";
  meteor.className = "golden-meteor";
  meteor.type = "button";
  meteor.title = "황금 운석!";
  meteor.setAttribute("aria-label", "황금 운석");

  const sectionRect = elements.planetSection.getBoundingClientRect();
  const maxX = Math.max(20, sectionRect.width - 70);
  const startX = Math.floor(Math.random() * maxX) + 10;
  meteor.style.left = `${startX}px`;
  meteor.style.top = "0px";

  meteor.addEventListener("click", startFever);
  meteor.addEventListener("animationend", () => removeMeteor(true));

  elements.planetSection.appendChild(meteor);
  state.meteorVisible = true;
  playMeteorSpawnSound();
}

function runRebirth() {
  const gain = getRebirthDarkMatterGain();
  if (state.stardust < REBIRTH_THRESHOLD || gain <= 0) {
    return;
  }

  const confirmed = window.confirm(
    `블랙홀 환생을 진행할까요?\n현재 스타더스트와 일반 업그레이드가 초기화되고 Dark Matter ${gain}개를 얻습니다.`
  );
  if (!confirmed) {
    return;
  }

  state.darkMatter += gain;

  state.stardust = 0;
  state.clickPower = 1;
  state.autoMiner.amount = 0;
  state.autoMiner.price = 50;
  state.quantumProbe.amount = 0;
  state.quantumProbe.price = 500;
  state.milkyDrive.amount = 0;
  state.milkyDrive.price = 200;
  state.feverUntil = 0;
  removeMeteor();

  if (state.pendingLevelUps > 0) {
    openLevelupModal();
  }

  updateView();
  saveState();
}

async function resetAllProgress() {
  const confirmed = await openResetConfirmModal();
  if (!confirmed) {
    return;
  }

  const freshState = createInitialState();
  Object.assign(state, freshState);
  closePanels();
  closeLevelupModal();
  removeMeteor();

  if (achievementToastTimeoutId) {
    clearTimeout(achievementToastTimeoutId);
  }
  elements.achievementToast.classList.remove("show");
  localStorage.removeItem(SAVE_KEY);
  updateView();
  saveState();
}

elements.planetButton.addEventListener("click", (event) => {
  activateAudioFromUserAction();
  if (state.isLevelupOpen) {
    return;
  }

  const baseClickGain = getClickGain();
  const criticalHit = Math.random() < getCriticalChance();
  const clickGain = criticalHit ? baseClickGain * getCriticalMultiplier() : baseClickGain;
  state.stardust += clickGain;
  playClickSound(criticalHit);
  state.stats.totalClicks += 1;
  gainXp(getClickXpGain());

  const rect = elements.planetButton.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  createFloatingPlus(x, y, clickGain, criticalHit);
  createClickParticles(x, y, criticalHit);

  checkAchievements();
  updateView();
  saveState();
});

elements.buyAutoMiner.addEventListener("click", () => {
  if (!spendStardust(state.autoMiner.price)) {
    return;
  }
  state.autoMiner.amount += 1;
  state.stats.autoMinersPurchased += 1;
  state.autoMiner.price = raisePrice(state.autoMiner.price);
  checkAchievements();
  updateView();
  saveState();
});

elements.buyQuantumProbe.addEventListener("click", () => {
  if (!spendStardust(state.quantumProbe.price)) {
    return;
  }
  state.quantumProbe.amount += 1;
  state.quantumProbe.price = raisePrice(state.quantumProbe.price);
  updateView();
  saveState();
});

elements.buyMilkyDrive.addEventListener("click", () => {
  if (!spendStardust(state.milkyDrive.price)) {
    return;
  }
  state.milkyDrive.amount += 1;
  state.clickPower += state.milkyDrive.clickBoost;
  state.milkyDrive.price = raisePrice(state.milkyDrive.price);
  updateView();
  saveState();
});

elements.buyCriticalChanceShop.addEventListener("click", () => {
  if (getBaseCriticalChance() >= MAX_BASE_CRITICAL_CHANCE) {
    return;
  }
  if (!spendStardust(state.criticalShop.chance.price)) {
    return;
  }
  state.criticalShop.chance.level += 1;
  state.criticalShop.chance.price = raisePrice(state.criticalShop.chance.price);
  updateView();
  saveState();
});

elements.buyCriticalMultiplierShop.addEventListener("click", () => {
  if (getBaseCriticalMultiplier() >= MAX_BASE_CRITICAL_MULTIPLIER) {
    return;
  }
  if (!spendStardust(state.criticalShop.multiplier.price)) {
    return;
  }
  state.criticalShop.multiplier.level += 1;
  state.criticalShop.multiplier.price = raisePrice(state.criticalShop.multiplier.price);
  updateView();
  saveState();
});

elements.buyDistortion.addEventListener("click", () => {
  const upgrade = state.darkMatterShop.distortion;
  if (!spendDarkMatter(upgrade.price)) {
    return;
  }
  upgrade.level += 1;
  upgrade.price = raiseDarkMatterPrice(upgrade.price);
  updateView();
  saveState();
});

elements.buySingularity.addEventListener("click", () => {
  const upgrade = state.darkMatterShop.singularity;
  if (!spendDarkMatter(upgrade.price)) {
    return;
  }
  upgrade.level += 1;
  upgrade.price = raiseDarkMatterPrice(upgrade.price);
  updateView();
  saveState();
});

elements.achievementsToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  togglePanel(elements.achievementPanel, elements.achievementsToggle);
});

elements.dmLabToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  togglePanel(elements.darkMatterLab, elements.dmLabToggle);
});

elements.statsToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  togglePanel(elements.statPanel, elements.statsToggle);
});

elements.codexToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  togglePanel(elements.codexPanel, elements.codexToggle);
});

elements.inventoryToggle.addEventListener("click", (event) => {
  event.stopPropagation();
  togglePanel(elements.inventoryPanel, elements.inventoryToggle);
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Node)) {
    return;
  }

  const clickedAchievementUi =
    elements.achievementPanel.contains(target) || elements.achievementsToggle.contains(target);
  const clickedDmUi = elements.darkMatterLab.contains(target) || elements.dmLabToggle.contains(target);
  const clickedStatUi = elements.statPanel.contains(target) || elements.statsToggle.contains(target);
  const clickedCodexUi = elements.codexPanel.contains(target) || elements.codexToggle.contains(target);
  const clickedInventoryUi = elements.inventoryPanel.contains(target) || elements.inventoryToggle.contains(target);

  if (!clickedAchievementUi) {
    setPanelOpen(elements.achievementPanel, elements.achievementsToggle, false);
  }
  if (!clickedDmUi) {
    setPanelOpen(elements.darkMatterLab, elements.dmLabToggle, false);
  }
  if (!clickedStatUi) {
    setPanelOpen(elements.statPanel, elements.statsToggle, false);
  }
  if (!clickedCodexUi) {
    setPanelOpen(elements.codexPanel, elements.codexToggle, false);
  }
  if (!clickedInventoryUi) {
    setPanelOpen(elements.inventoryPanel, elements.inventoryToggle, false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (isResetConfirmOpen()) {
      closeResetConfirmModal(false);
      return;
    }
    closePanels();
  }
});

document.addEventListener(
  "pointerdown",
  () => {
    activateAudioFromUserAction();
  },
  { once: true }
);

elements.rebirthButton.addEventListener("click", runRebirth);
elements.resetProgressButton.addEventListener("click", resetAllProgress);
elements.audioToggle.addEventListener("click", () => {
  activateAudioFromUserAction();
  setMuted(!audioState.muted);
});
elements.resetConfirmCancel.addEventListener("click", () => closeResetConfirmModal(false));
elements.resetConfirmAccept.addEventListener("click", () => closeResetConfirmModal(true));
elements.resetConfirmOverlay.addEventListener("click", (event) => {
  if (event.target === elements.resetConfirmOverlay) {
    closeResetConfirmModal(false);
  }
});

setInterval(() => {
  const feverActive = isFeverActive();
  if (wasFeverActiveLastTick && !feverActive) {
    scheduleMeteorCooldown();
  }
  wasFeverActiveLastTick = feverActive;

  if (!state.isLevelupOpen) {
    const gain = getPerSecondRate();
    if (gain > 0) {
      state.stardust += gain;
    }

    const cooldownReady = Date.now() >= state.meteorCooldownUntil;
    if (cooldownReady && !state.meteorVisible && !feverActive && Math.random() < METEOR_SPAWN_CHANCE_AFTER_COOLDOWN) {
      spawnGoldenMeteor();
    }
  }

  checkAchievements();
  updateView();
  saveState();
}, 1000);

loadState();
if (!state.meteorVisible && state.meteorCooldownUntil <= 0) {
  scheduleMeteorCooldown();
}
wasFeverActiveLastTick = isFeverActive();
checkAchievements();
renderCardCodex();
updateAudioToggleUi();
updateView();
