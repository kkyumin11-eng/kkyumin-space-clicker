const SAVE_KEY = "stardust-clicker-save-v2";
const FEVER_MULTIPLIER = 3;
const BASE_FEVER_DURATION_MS = 10000;
const FEVER_TRIGGER_CLICKS = 100;
const DOUBLE_CRIT_OVERFLOW_SCALE = 0.5;
const METEOR_BASE_COOLDOWN_MS = 45000;
const METEOR_MIN_COOLDOWN_MS = 10000;
const METEOR_SPAWN_CHANCE_AFTER_COOLDOWN = 0.05;
const MAX_FEVER_DURATION_MS = 90000;
const BASE_CRITICAL_CHANCE = 0.05;
const MAX_BASE_CRITICAL_CHANCE = 0.5;
const BASE_CRITICAL_MULTIPLIER = 2;
const MAX_BASE_CRITICAL_MULTIPLIER = 20;
const REBIRTH_THRESHOLD = 100000;
const BASE_CLICK_XP = 10;
const SOFTCAP_MIN_FLOOR = 0.15;
const LEVELUP_CARD_LOCK_MS = 1200;
const AUDIO_PREF_KEY = "stardust-clicker-muted";
const baseStats = {
  clickStardust: 10,
  autoProduction: 0,
  feverClicks: FEVER_TRIGGER_CLICKS,
  xpGain: BASE_CLICK_XP,
  critChance: BASE_CRITICAL_CHANCE,
  critMultiplier: BASE_CRITICAL_MULTIPLIER,
  feverDuration: BASE_FEVER_DURATION_MS / 1000,
  feverMultiplier: FEVER_MULTIPLIER
};
const CLICK_UPGRADE_FLAT_PER_LEVEL = 2;
const AUTO_MINER_FLAT_PER_LEVEL = 1;
const XP_UPGRADE_FLAT_PER_LEVEL = 10;
const GENERAL_UPGRADE_COST = {
  autoMiner: { base: 20, growth: 1.62 },
  clickUpgrade: { base: 30, growth: 1.72 },
  xpDrive: { base: 45, growth: 1.68 }
};

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
  { key: "legendary", label: "전설", chance: 0.045 },
  { key: "mythic", label: "신화", chance: 0.005 }
];
const RARITY_ORDER = ["common", "rare", "epic", "legendary", "mythic"];
const EMBEDDED_EVOLUTION_CHANCE = 0.12;
const PRESERVATION_SLOT_LIMIT = 5;
const MERGE_REQUIREMENTS = {
  common: 2,
  rare: 2,
  epic: 3,
  legendary: 3
};

const CARD_LIBRARY = [
  {
    id: "overloadClick",
    name: "과부하 클릭",
    kind: "passive",
    values: { common: 15, rare: 50, epic: 100, legendary: 200, mythic: 400 },
    describe: (value) => `클릭당 스타더스트 전체 획득량 +${value}%`
  },
  {
    id: "spaceAcceleration",
    name: "우주 가속도",
    kind: "passive",
    values: { common: 10, rare: 25, epic: 50, legendary: 100, mythic: 200 },
    describe: (value) => `모든 자동 생산 효율 +${value}%`
  },
  {
    id: "feverChargeReducer",
    name: "피버 타임 쿨타임 감소",
    kind: "passive",
    values: { common: 10, rare: 20, epic: 35, legendary: 50, mythic: 70 },
    describe: (value) => `피버 발동 필요 클릭 수 -${value}%`
  },
  {
    id: "starBreak",
    name: "스타 브레이크",
    kind: "burst",
    values: { common: 60, rare: 300, epic: 1200, legendary: 3600, mythic: 14400 },
    describe: (value) => `즉시 현재 초당 획득량의 ${value}초 분량 획득`
  },
  {
    id: "xpAmplify",
    name: "경험치 증폭",
    kind: "passive",
    values: { common: 20, rare: 50, epic: 90, legendary: 150, mythic: 250 },
    describe: (value) => `클릭 시 XP 획득량 +${value}%`
  },
  {
    id: "criticalStrike",
    name: "치명적 타격",
    kind: "passive",
    values: {
      common: { chance: 15, multiplier: 10 },
      rare: { chance: 40, multiplier: 30 },
      epic: { chance: 80, multiplier: 60 },
      legendary: { chance: 150, multiplier: 120 },
      mythic: { chance: 300, multiplier: 250 }
    },
    describe: (value) => `크리티컬 확률 +${value.chance}%, 배율 +${value.multiplier}%`
  },
  {
    id: "feverExtend",
    name: "피버 연장",
    kind: "passive",
    values: { common: 20, rare: 40, epic: 70, legendary: 120, mythic: 200 },
    describe: (value) => `피버 지속 시간 +${value}%`
  },
  {
    id: "meteorEffectBoost",
    name: "피버 공명 증폭",
    kind: "passive",
    values: { common: 30, rare: 60, epic: 100, legendary: 180, mythic: 300 },
    describe: (value) => `피버 타임 배율 +${value}%`
  }
];
const CARD_LIBRARY_BY_ID = Object.fromEntries(CARD_LIBRARY.map((card) => [card.id, card]));

function createInitialState() {
  return {
    stardust: 0,
    darkMatter: 0,
    clickPower: baseStats.clickStardust,
    level: 1,
    xp: 0,
    pendingLevelUps: 0,
    isLevelupOpen: false,
    autoMiner: { price: GENERAL_UPGRADE_COST.autoMiner.base, amount: 0, perSecond: AUTO_MINER_FLAT_PER_LEVEL },
    clickUpgrade: { price: GENERAL_UPGRADE_COST.clickUpgrade.base, level: 0, clickBoost: CLICK_UPGRADE_FLAT_PER_LEVEL },
    xpDrive: { price: GENERAL_UPGRADE_COST.xpDrive.base, level: 0 },
    criticalShop: {
      chance: { price: 2000, level: 0 },
      multiplier: { price: 3000, level: 0 }
    },
    feverUntil: 0,
    clicksTowardFever: 0,
    meteorVisible: false,
    meteorCooldownUntil: 0,
    darkMatterShop: {
      distortion: { price: 1, level: 0 },
      singularity: { price: 3, level: 0 }
    },
    cardBuffs: createEmptyCardBuffs(),
    cardInventory: [],
    preservedCardUids: [],
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
    clickPercentFactor: 1,
    autoPercentFactor: 1,
    feverChargeFactor: 1,
    xpFactor: 1,
    criticalChanceFactor: 1,
    criticalMultiplierFactor: 1,
    feverDurationFactor: 1,
    feverMultiplierFactor: 1
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
  statCardClickMultiplier: document.getElementById("stat-card-click-multiplier"),
  statCardAutoMultiplier: document.getElementById("stat-card-auto-multiplier"),
  statXpGain: document.getElementById("stat-xp-gain"),
  statXpMultiplier: document.getElementById("stat-xp-multiplier"),
  statPanel: document.getElementById("stat-panel"),
  codexPanel: document.getElementById("codex-panel"),
  codexList: document.getElementById("codex-list"),
  inventoryToggle: document.getElementById("inventory-toggle"),
  inventoryPanel: document.getElementById("inventory-panel"),
  preservationSlots: document.getElementById("preservation-slots"),
  inventoryTabCards: document.getElementById("inventory-tab-cards"),
  inventoryTabMerge: document.getElementById("inventory-tab-merge"),
  inventoryCardsView: document.getElementById("inventory-cards-view"),
  inventoryMergeView: document.getElementById("inventory-merge-view"),
  inventorySummary: document.getElementById("inventory-summary"),
  inventoryGrid: document.getElementById("inventory-grid"),
  mergeList: document.getElementById("merge-list"),
  levelupOverlay: document.getElementById("levelup-overlay"),
  levelupCards: document.getElementById("levelup-cards"),
  levelupPreview: document.getElementById("levelup-preview"),
  planetButton: document.getElementById("planet-button"),
  planetSection: document.querySelector(".planet-section"),
  satelliteLayer: document.getElementById("satellite-layer"),
  autoMinerTitle: document.getElementById("auto-miner-title"),
  autoMinerCost: document.getElementById("auto-miner-cost"),
  autoMinerBulkCost: document.getElementById("auto-miner-bulk-cost"),
  clickUpgradeTitle: document.getElementById("click-upgrade-title"),
  clickUpgradeCost: document.getElementById("click-upgrade-cost"),
  clickUpgradeBulkCost: document.getElementById("click-upgrade-bulk-cost"),
  xpDriveTitle: document.getElementById("xp-drive-title"),
  xpDriveCost: document.getElementById("xp-drive-cost"),
  xpDriveBulkCost: document.getElementById("xp-drive-bulk-cost"),
  buyAutoMiner: document.getElementById("buy-auto-miner"),
  buyClickUpgrade: document.getElementById("buy-click-upgrade"),
  buyXpDrive: document.getElementById("buy-xp-drive"),
  bulkUpgradeControls: document.getElementById("bulk-upgrade-controls"),
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
  fxOverlay: document.getElementById("fx-overlay"),
  impactToast: document.getElementById("impact-toast"),
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
let activeInventoryTab = "cards";
let mergeInProgress = false;
let selectedBulkPurchase = 1;
const audioState = {
  context: null,
  masterGain: null,
  sfxGain: null,
  bgmGain: null,
  sfxVoices: [],
  sfxVoiceCursor: 0,
  bgmStarted: false,
  schedulerId: null,
  nextNoteTime: 0,
  step: 0,
  muted: localStorage.getItem(AUDIO_PREF_KEY) === "true",
  userActivated: false
};

function formatRounded(value, digits) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return "0";
  }
  const factor = 10 ** digits;
  return Math.round(numeric * factor) / factor;
}

function formatNumber(value, digits = 2) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return "0";
  }
  const sign = numeric < 0 ? "-" : "";
  const abs = Math.abs(numeric);
  if (abs < 1000) {
    return `${sign}${formatRounded(abs, digits)}`;
  }
  const units = ["K", "M", "B", "T", "Qa", "Qi", "Sx"];
  let scaled = abs;
  let unitIndex = -1;
  while (scaled >= 1000 && unitIndex < units.length - 1) {
    scaled /= 1000;
    unitIndex += 1;
  }
  return `${sign}${formatRounded(scaled, digits)}${units[unitIndex]}`;
}

function formatStardust(value) {
  return formatNumber(value, 2);
}

function formatRate(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return "0.0";
  }
  if (Math.abs(numeric) < 100) {
    return numeric.toFixed(1);
  }
  return formatNumber(numeric, 1);
}

function formatPercent(value, digits = 1) {
  return `${formatNumber(value * 100, digits)}%`;
}

function getSoftcappedAmount(rawAmount) {
  const numeric = Math.max(0, Number(rawAmount) || 0);
  if (numeric <= 0) {
    return 0;
  }
  return Math.max(SOFTCAP_MIN_FLOOR, Math.log10(numeric + 1));
}

function getGeneralUpgradeCost(baseCost, growthRate, level) {
  return Math.max(1, Math.ceil(baseCost * Math.pow(growthRate, Math.max(0, level))));
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

  masterGain.gain.value = audioState.muted ? 0 : 0.9;
  sfxGain.gain.value = 1;
  bgmGain.gain.value = 0.0001;
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
  initializeSfxVoicePool(context);
  startBgmScheduler();
  return context;
}

function initializeSfxVoicePool(context) {
  if (audioState.sfxVoices.length > 0) {
    return;
  }
  const voiceCount = 14;
  for (let i = 0; i < voiceCount; i += 1) {
    const gainNode = context.createGain();
    gainNode.gain.value = 0.0001;
    gainNode.connect(audioState.sfxGain);
    audioState.sfxVoices.push(gainNode);
  }
}

function reserveSfxVoice() {
  const context = ensureAudioContext();
  if (audioState.sfxVoices.length === 0) {
    initializeSfxVoicePool(context);
  }
  const voice = audioState.sfxVoices[audioState.sfxVoiceCursor % audioState.sfxVoices.length];
  audioState.sfxVoiceCursor = (audioState.sfxVoiceCursor + 1) % audioState.sfxVoices.length;
  const now = context.currentTime;
  voice.gain.cancelScheduledValues(now);
  voice.gain.setValueAtTime(0.0001, now);
  return { context, voice, now };
}

function setMuted(muted) {
  audioState.muted = muted;
  localStorage.setItem(AUDIO_PREF_KEY, String(muted));
  updateAudioToggleUi();
  if (audioState.masterGain) {
    const now = audioState.context.currentTime;
    audioState.masterGain.gain.cancelScheduledValues(now);
    audioState.masterGain.gain.linearRampToValueAtTime(muted ? 0 : 0.9, now + 0.06);
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
  startBgmWithFadeIn();
}

function startBgmWithFadeIn() {
  const context = ensureAudioContext();
  if (audioState.bgmStarted) {
    return;
  }
  audioState.bgmStarted = true;
  const now = context.currentTime;
  audioState.bgmGain.gain.cancelScheduledValues(now);
  audioState.bgmGain.gain.setValueAtTime(0.0001, now);
  audioState.bgmGain.gain.exponentialRampToValueAtTime(0.62, now + 1.8);
}

function createPulseSound({
  frequency = 440,
  duration = 0.12,
  type = "sine",
  gain = 0.1,
  sweep = 1
}) {
  const { context, voice, now } = reserveSfxVoice();
  const oscillator = context.createOscillator();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, frequency * sweep), now + duration);
  voice.gain.setValueAtTime(0.0001, now);
  voice.gain.exponentialRampToValueAtTime(gain, now + 0.01);
  voice.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(voice);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

function createNoiseBurst(duration = 0.14, gain = 0.06, highpass = 600) {
  const { context, voice, now } = reserveSfxVoice();
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
  voice.gain.setValueAtTime(gain, now);
  voice.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  source.connect(filter);
  filter.connect(voice);
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

function playCardPickSound(rarity = "common") {
  if (!audioState.userActivated) {
    return;
  }
  const highRarity = rarity === "legendary" || rarity === "mythic";
  if (!highRarity) {
    createPulseSound({ frequency: 420, duration: 0.11, type: "triangle", gain: 0.1, sweep: 1.03 });
    createPulseSound({ frequency: 560, duration: 0.13, type: "sine", gain: 0.095, sweep: 1.06 });
    createPulseSound({ frequency: 710, duration: 0.12, type: "sine", gain: 0.08, sweep: 1.08 });
    createNoiseBurst(0.08, 0.04, 900);
    return;
  }
  createNoiseBurst(0.22, 0.08, 480);
  createPulseSound({ frequency: 180, duration: 0.45, type: "sawtooth", gain: 0.09, sweep: 1.18 });
  createPulseSound({ frequency: 280, duration: 0.42, type: "triangle", gain: 0.1, sweep: 1.21 });
  createPulseSound({ frequency: 520, duration: 0.38, type: "sine", gain: 0.09, sweep: 1.14 });
}

function playMergeChargeSound() {
  if (!audioState.userActivated) {
    return;
  }
  createPulseSound({ frequency: 240, duration: 0.28, type: "triangle", gain: 0.08, sweep: 0.88 });
  createPulseSound({ frequency: 190, duration: 0.35, type: "sawtooth", gain: 0.08, sweep: 0.82 });
}

function playMergeImpactSound() {
  if (!audioState.userActivated) {
    return;
  }
  createNoiseBurst(0.26, 0.14, 220);
  createPulseSound({ frequency: 96, duration: 0.32, type: "square", gain: 0.13, sweep: 0.74 });
  createPulseSound({ frequency: 220, duration: 0.22, type: "triangle", gain: 0.1, sweep: 0.82 });
  createPulseSound({ frequency: 480, duration: 0.18, type: "sine", gain: 0.085, sweep: 0.92 });
}

function playUpgradeSound() {
  if (!audioState.userActivated) {
    return;
  }
  createPulseSound({ frequency: 330, duration: 0.11, type: "triangle", gain: 0.09, sweep: 1.06 });
  createPulseSound({ frequency: 520, duration: 0.1, type: "sine", gain: 0.075, sweep: 1.08 });
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

function spawnCosmicSelectionBurst(rarity = "common") {
  const highRarity = rarity === "legendary" || rarity === "mythic";
  const particleCount = highRarity ? 52 : 28;
  const rayCount = highRarity ? 14 : 8;
  const colorSet = highRarity
    ? ["#ffd4f1", "#ff89da", "#ff5ca4", "#ffe8a8"]
    : ["#bdefff", "#8bd4ff", "#cdb7ff", "#fff0b9"];
  const layer = elements.fxOverlay;
  if (!layer) {
    return;
  }
  for (let i = 0; i < particleCount; i += 1) {
    const node = document.createElement("span");
    node.className = "cosmic-particle";
    const angle = Math.random() * Math.PI * 2;
    const distance = (highRarity ? 280 : 180) * (0.5 + Math.random());
    node.style.setProperty("--x", `${40 + Math.random() * 20}%`);
    node.style.setProperty("--y", `${38 + Math.random() * 24}%`);
    node.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    node.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    node.style.setProperty("--size", `${5 + Math.random() * (highRarity ? 10 : 7)}px`);
    node.style.setProperty("--duration", `${0.65 + Math.random() * (highRarity ? 0.7 : 0.45)}s`);
    const color = colorSet[Math.floor(Math.random() * colorSet.length)];
    node.style.setProperty("--color", color);
    node.style.setProperty("--glow", color);
    layer.appendChild(node);
    setTimeout(() => node.remove(), 1300);
  }

  for (let i = 0; i < rayCount; i += 1) {
    const ray = document.createElement("span");
    ray.className = "cosmic-ray";
    ray.style.setProperty("--angle", `${(360 / rayCount) * i}deg`);
    ray.style.setProperty("--ray-height", `${highRarity ? 320 : 230}px`);
    layer.appendChild(ray);
    setTimeout(() => ray.remove(), 900);
  }
}

function showImpactToast(text) {
  if (!elements.impactToast) {
    return;
  }
  elements.impactToast.textContent = text;
  elements.impactToast.classList.remove("show");
  void elements.impactToast.offsetWidth;
  elements.impactToast.classList.add("show");
}

function renderCardCodex() {
  elements.codexList.innerHTML = CARD_LIBRARY.map((card) => {
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

function toEquippedCardEffect(cardInstance) {
  const value = getCardValue(cardInstance.cardId, cardInstance.rarity);
  if (value === null || value === undefined) {
    return null;
  }
  if (cardInstance.cardId === "overloadClick") {
    return { type: "overload_click", effect: value / 100 };
  }
  if (cardInstance.cardId === "spaceAcceleration") {
    return { type: "space_acceleration", effect: value / 100 };
  }
  if (cardInstance.cardId === "feverChargeReducer") {
    return { type: "fever_cooldown", effect: Math.min(0.95, Math.max(0, value / 100)) };
  }
  if (cardInstance.cardId === "xpAmplify") {
    return { type: "xp_boost", effect: value / 100 };
  }
  if (cardInstance.cardId === "criticalStrike") {
    return {
      type: "critical_strike",
      critChanceEffect: value.chance / 100,
      critMultEffect: value.multiplier / 100
    };
  }
  if (cardInstance.cardId === "feverExtend") {
    return { type: "fever_extension", effect: value / 100 };
  }
  if (cardInstance.cardId === "meteorEffectBoost") {
    return { type: "fever_amplification", effect: value / 100 };
  }
  return null;
}

function calculateFinalStats(equippedCards) {
  const stats = equippedCards.reduce(
    (acc, card) => {
    if (card.type === "overload_click") {
        acc.clickStardust *= 1 + card.effect;
      }
      if (card.type === "space_acceleration") {
        acc.autoProduction *= 1 + card.effect;
      }
      if (card.type === "fever_cooldown") {
        acc.feverClicks *= 1 - card.effect;
      }
      if (card.type === "xp_boost") {
        acc.xpGain *= 1 + card.effect;
      }
      if (card.type === "critical_strike") {
        acc.critChance *= 1 + card.critChanceEffect;
        acc.critMultiplier *= 1 + card.critMultEffect;
      }
      if (card.type === "fever_extension") {
        acc.feverDuration *= 1 + card.effect;
      }
      if (card.type === "fever_amplification") {
        acc.feverMultiplier *= 1 + card.effect;
      }
      return acc;
    },
    { ...baseStats }
  );

  stats.feverClicks = Math.max(5, Math.round(stats.feverClicks));
  return stats;
}

function isPersistentInventoryCard(cardId) {
  return cardId !== "starBreak";
}

function applyPassiveCardToBuffs(cardId, rarity, buffs) {
  const value = getCardValue(cardId, rarity);
  if (value === null || value === undefined) {
    return;
  }
  if (cardId === "overloadClick") {
    buffs.clickPercentFactor *= 1 + value / 100;
    return;
  }
  if (cardId === "spaceAcceleration") {
    buffs.autoPercentFactor *= 1 + value / 100;
    return;
  }
  if (cardId === "feverChargeReducer") {
    buffs.feverChargeFactor *= 1 / Math.max(0.05, 1 - value / 100);
    return;
  }
  if (cardId === "xpAmplify") {
    buffs.xpFactor *= 1 + value / 100;
    return;
  }
  if (cardId === "criticalStrike") {
    buffs.criticalChanceFactor *= 1 + value.chance / 100;
    buffs.criticalMultiplierFactor *= 1 + value.multiplier / 100;
    return;
  }
  if (cardId === "feverExtend") {
    buffs.feverDurationFactor *= 1 + value / 100;
    return;
  }
  if (cardId === "meteorEffectBoost") {
    buffs.feverMultiplierFactor *= 1 + value / 100;
  }
}

function recalculateCardBuffs() {
  state.cardInventory = state.cardInventory.filter((card) => isPersistentInventoryCard(card.cardId));
  cleanupPreservedCardUids();
  const equippedCards = state.cardInventory.reduce((acc, cardInstance) => {
    const cardBase = CARD_LIBRARY_BY_ID[cardInstance.cardId];
    if (!cardBase || cardBase.kind !== "passive") {
      return acc;
    }
    const effect = toEquippedCardEffect(cardInstance);
    if (effect) {
      acc.push(effect);
    }
    return acc;
  }, []);

  const finalStats = calculateFinalStats(equippedCards);
  state.cardBuffs = {
    clickPercentFactor: finalStats.clickStardust / baseStats.clickStardust,
    autoPercentFactor: finalStats.autoProduction / baseStats.autoProduction,
    feverChargeFactor: baseStats.feverClicks / finalStats.feverClicks,
    xpFactor: finalStats.xpGain / baseStats.xpGain,
    criticalChanceFactor: finalStats.critChance / baseStats.critChance,
    criticalMultiplierFactor: finalStats.critMultiplier / baseStats.critMultiplier,
    feverDurationFactor: finalStats.feverDuration / baseStats.feverDuration,
    feverMultiplierFactor: finalStats.feverMultiplier / baseStats.feverMultiplier
  };
}

function getNextRarity(rarity) {
  const currentIndex = RARITY_ORDER.indexOf(rarity);
  if (currentIndex < 0 || currentIndex >= RARITY_ORDER.length - 1) {
    return null;
  }
  return RARITY_ORDER[currentIndex + 1];
}

function cleanupPreservedCardUids() {
  const available = new Set(state.cardInventory.map((card) => card.uid));
  state.preservedCardUids = state.preservedCardUids
    .filter((uid, index, arr) => Number.isInteger(uid) && available.has(uid) && arr.indexOf(uid) === index)
    .slice(0, PRESERVATION_SLOT_LIMIT);
}

function renderPreservationSlots() {
  const preservedMap = new Map(state.cardInventory.map((card) => [card.uid, card]));
  const slots = Array.from({ length: PRESERVATION_SLOT_LIMIT }, (_, index) => {
    const uid = state.preservedCardUids[index];
    const card = uid ? preservedMap.get(uid) : null;
    if (!card) {
      return `<article class="preservation-slot"><strong>SLOT ${index + 1}</strong>비어 있음</article>`;
    }
    const base = CARD_LIBRARY_BY_ID[card.cardId];
    return `<article class="preservation-slot"><strong>SLOT ${index + 1}</strong>[${getRarityLabel(card.rarity)}] ${base?.name ?? card.cardId}</article>`;
  });
  elements.preservationSlots.innerHTML = slots.join("");
}

function setInventoryTabUi(tab) {
  activeInventoryTab = tab;
  elements.inventoryTabCards.classList.toggle("active", tab === "cards");
  elements.inventoryTabMerge.classList.toggle("active", tab === "merge");
  elements.inventoryCardsView.classList.toggle("hidden", tab !== "cards");
  elements.inventoryMergeView.classList.toggle("hidden", tab !== "merge");
}

function buildMergeCandidates() {
  const groupMap = {};
  state.cardInventory.forEach((card) => {
    if (!MERGE_REQUIREMENTS[card.rarity]) {
      return;
    }
    const key = `${card.cardId}:${card.rarity}`;
    if (!groupMap[key]) {
      groupMap[key] = [];
    }
    groupMap[key].push(card);
  });
  return Object.entries(groupMap)
    .map(([key, cards]) => {
      const [cardId, rarity] = key.split(":");
      const required = MERGE_REQUIREMENTS[rarity];
      const nextRarity = getNextRarity(rarity);
      return { cardId, rarity, cards, required, nextRarity };
    })
    .filter((entry) => entry.nextRarity)
    .sort((a, b) => cardsSortKey(a.cardId, b.cardId) || RARITY_ORDER.indexOf(b.rarity) - RARITY_ORDER.indexOf(a.rarity));
}

function cardsSortKey(cardIdA, cardIdB) {
  const nameA = CARD_LIBRARY_BY_ID[cardIdA]?.name ?? cardIdA;
  const nameB = CARD_LIBRARY_BY_ID[cardIdB]?.name ?? cardIdB;
  return nameA.localeCompare(nameB);
}

function renderMergeUi() {
  const candidates = buildMergeCandidates();
  if (candidates.length === 0) {
    elements.mergeList.innerHTML = '<p class="inventory-empty">합성 가능한 카드가 없습니다.</p>';
    return;
  }
  elements.mergeList.innerHTML = candidates
    .map((candidate) => {
      const base = CARD_LIBRARY_BY_ID[candidate.cardId];
      const available = candidate.cards.length;
      const canMerge = available >= candidate.required;
      return `<article class="merge-item">
        <p>${base?.name ?? candidate.cardId} | ${getRarityLabel(candidate.rarity)} ${available}장 ➜ ${getRarityLabel(
        candidate.nextRarity
      )} (${candidate.required}장 필요)</p>
        <button class="merge-button" data-card-id="${candidate.cardId}" data-rarity="${candidate.rarity}" ${
        canMerge ? "" : "disabled"
      }>합성</button>
      </article>`;
    })
    .join("");

  elements.mergeList.querySelectorAll(".merge-button").forEach((button) => {
    button.addEventListener("click", () => {
      const cardId = button.getAttribute("data-card-id");
      const rarity = button.getAttribute("data-rarity");
      if (!cardId || !rarity) {
        return;
      }
      const mergeItem = button.closest(".merge-item");
      runCardMerge(cardId, rarity, mergeItem);
    });
  });
}

function toggleCardPreservation(uid) {
  cleanupPreservedCardUids();
  const index = state.preservedCardUids.indexOf(uid);
  if (index >= 0) {
    state.preservedCardUids.splice(index, 1);
    return;
  }
  if (state.preservedCardUids.length >= PRESERVATION_SLOT_LIMIT) {
    return;
  }
  state.preservedCardUids.push(uid);
}

function renderInventoryUi() {
  cleanupPreservedCardUids();
  const rarityCountMap = { common: 0, rare: 0, epic: 0, legendary: 0, mythic: 0 };
  let passiveTotal = 0;
  let burstTotal = 0;

  state.cardInventory.forEach((cardInstance) => {
    const cardBase = CARD_LIBRARY_BY_ID[cardInstance.cardId];
    if (!cardBase) {
      return;
    }
    if (cardBase.kind === "passive") {
      passiveTotal += 1;
    } else if (cardBase.kind === "burst") {
      burstTotal += 1;
    }
    rarityCountMap[cardInstance.rarity] = (rarityCountMap[cardInstance.rarity] ?? 0) + 1;
  });

  elements.inventorySummary.innerHTML = `
    <article class="summary-tile"><strong>총 보유 카드</strong>${formatNumber(state.cardInventory.length, 0)}장</article>
    <article class="summary-tile"><strong>영구 패시브 카드</strong>${formatNumber(passiveTotal, 0)}장</article>
    <article class="summary-tile"><strong>일반/희귀/영웅/전설/신화</strong>${rarityCountMap.common}/${rarityCountMap.rare}/${rarityCountMap.epic}/${rarityCountMap.legendary}/${rarityCountMap.mythic}</article>
    <article class="summary-tile"><strong>일시 효과 카드</strong>${burstTotal}장</article>
  `;

  renderPreservationSlots();
  renderMergeUi();
  elements.inventoryGrid.innerHTML = "";
  if (state.cardInventory.length === 0) {
    elements.inventoryGrid.innerHTML = '<p class="inventory-empty">아직 보유한 카드가 없습니다.</p>';
    return;
  }

  const sortedCards = [...state.cardInventory].sort(
    (a, b) =>
      RARITY_ORDER.indexOf(b.rarity) - RARITY_ORDER.indexOf(a.rarity) ||
      cardsSortKey(a.cardId, b.cardId) ||
      a.uid - b.uid
  );

  sortedCards.forEach((cardInstance) => {
    const cardBase = CARD_LIBRARY_BY_ID[cardInstance.cardId];
    if (!cardBase) {
      return;
    }
    const cardNode = document.createElement("article");
    cardNode.className = `inventory-card ${cardInstance.rarity} selectable`;
    if (state.preservedCardUids.includes(cardInstance.uid)) {
      cardNode.classList.add("selected-preserve");
    }
    const value = getCardValue(cardBase.id, cardInstance.rarity);
    cardNode.innerHTML = `<h4>${cardBase.name}</h4>
      <p>${getRarityLabel(cardInstance.rarity)} | #${cardInstance.uid}</p>
      <p>${cardBase.kind === "passive" ? "영구 패시브" : "일시 효과"}</p>
      <p>${cardBase.describe(value)}</p>
      <p class="inventory-count">${state.preservedCardUids.includes(cardInstance.uid) ? "보존 지정됨" : "클릭하여 보존 지정"}</p>`;
    cardNode.addEventListener("click", () => {
      toggleCardPreservation(cardInstance.uid);
      renderInventoryUi();
      saveState();
    });
    elements.inventoryGrid.appendChild(cardNode);
  });
}

function buildStatSnapshot(customBuffs = state.cardBuffs) {
  const shopLayer = getShopMultiplier();
  const clickLayer = customBuffs.clickPercentFactor;
  const autoLayer = customBuffs.autoPercentFactor;
  const clickCore = getSoftcappedAmount(baseStats.clickStardust * shopLayer * clickLayer);
  const autoCore = getSoftcappedAmount(baseStats.autoProduction * shopLayer * autoLayer);
  const feverLayer = getFeverMultiplier();
  return {
    clickGain: (clickCore + state.clickUpgrade.level * CLICK_UPGRADE_FLAT_PER_LEVEL) * feverLayer,
    perSecond: (autoCore + state.autoMiner.amount * AUTO_MINER_FLAT_PER_LEVEL) * feverLayer,
    criticalChance: getCriticalChanceWithBuffs(customBuffs)
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
  const evolutionSuffix = card.hasEmbeddedEvolution ? " + 성장의 빛 내장" : "";
  const before = buildStatSnapshot();
  if (card.baseId === "starBreak") {
    const value = getCardValue(card.baseId, card.rarityClass);
    const burstGain = getBurstGainFromSeconds(value);
    return `획득량 미리보기: 스타더스트 +${formatRate(burstGain)} (즉시 지급)${evolutionSuffix}`;
  }
  const virtualBuffs = { ...state.cardBuffs };
  applyPassiveCardToBuffs(card.baseId, card.rarityClass, virtualBuffs);
  const after = buildStatSnapshot(virtualBuffs);
  if (card.baseId === "overloadClick") {
    return `클릭 생산량: ${formatDelta(before.clickGain, after.clickGain, 1)}${evolutionSuffix}`;
  }
  if (card.baseId === "spaceAcceleration") {
    return `자동 생산량/초: ${formatDelta(before.perSecond, after.perSecond, 1)}${evolutionSuffix}`;
  }
  if (card.baseId === "xpAmplify") {
    const beforeXp = getClickXpGain();
    const baseXp = baseStats.xpGain + state.xpDrive.level * XP_UPGRADE_FLAT_PER_LEVEL;
    const afterXp = baseXp * virtualBuffs.xpFactor;
    return `클릭 XP 획득량: ${formatDelta(beforeXp, afterXp, 2)}${evolutionSuffix}`;
  }
  if (card.baseId === "criticalStrike") {
    const beforeCrit = getCriticalChance();
    const afterCrit = getCriticalChanceWithBuffs(virtualBuffs);
    const beforeRawCrit = getRawCriticalChanceWithBuffs(state.cardBuffs);
    const afterRawCrit = getRawCriticalChanceWithBuffs(virtualBuffs);
    const beforeOverflow = getCriticalOverflowMultiplierWithBuffs(state.cardBuffs);
    const afterOverflow = getCriticalOverflowMultiplierWithBuffs(virtualBuffs);
    const beforeMultiplier = getCriticalMultiplier();
    const baseAfterMultiplier = Math.max(1, getBaseCriticalMultiplier() * virtualBuffs.criticalMultiplierFactor);
    const afterMultiplier = baseAfterMultiplier * afterOverflow;
    return `크리티컬 확률: ${formatPercent(beforeCrit, 2)} ➜ ${formatPercent(afterCrit, 2)} (+${formatPercent(
      afterCrit - beforeCrit,
      2
    )}) | 오버확률: ${formatPercent(beforeRawCrit, 2)} ➜ ${formatPercent(afterRawCrit, 2)} | 배율: x${formatRate(
      beforeMultiplier
    )} ➜ x${formatRate(afterMultiplier)} (오버확률 보정 x${formatRate(beforeOverflow)} ➜ x${formatRate(
      afterOverflow
    )})${evolutionSuffix}`;
  }
  if (card.baseId === "feverChargeReducer") {
    const beforeClicks = getFeverTriggerClicksRequired(state.cardBuffs);
    const afterClicks = getFeverTriggerClicksRequired(virtualBuffs);
    return `피버 필요 클릭: ${beforeClicks}회 ➜ ${afterClicks}회${evolutionSuffix}`;
  }
  if (card.baseId === "feverExtend") {
    const beforeDuration = Math.round(getFeverDurationMs() / 1000);
    const afterDuration = Math.round(Math.min(MAX_FEVER_DURATION_MS, BASE_FEVER_DURATION_MS * virtualBuffs.feverDurationFactor) / 1000);
    const beforePercent = formatNumber((state.cardBuffs.feverDurationFactor - 1) * 100, 0);
    const afterPercent = formatNumber((virtualBuffs.feverDurationFactor - 1) * 100, 0);
    return `피버 시간: ${beforeDuration}초(+${beforePercent}%) ➜ ${afterDuration}초(+${afterPercent}%)${evolutionSuffix}`;
  }
  if (card.baseId === "meteorEffectBoost") {
    const beforeFever = FEVER_MULTIPLIER * state.cardBuffs.feverMultiplierFactor;
    const afterFever = FEVER_MULTIPLIER * virtualBuffs.feverMultiplierFactor;
    return `피버 배율: x${formatRate(beforeFever)} ➜ x${formatRate(afterFever)}${evolutionSuffix}`;
  }
  return `클릭 생산량: ${formatDelta(before.clickGain, after.clickGain, 1)} / 자동 생산량: ${formatDelta(
    before.perSecond,
    after.perSecond,
    1
  )}${evolutionSuffix}`;
}

function getXpRequiredForLevel(level) {
  return Math.max(100, Math.floor(100 * Math.pow(Math.max(1, level), 2.5)));
}

function getClickXpGain() {
  const baseXp = baseStats.xpGain + state.xpDrive.level * XP_UPGRADE_FLAT_PER_LEVEL;
  return baseXp * state.cardBuffs.xpFactor;
}

function getPermanentGainMultiplier() {
  return Math.pow(1.5, state.darkMatterShop.distortion.level);
}

function getClickCardBonus() {
  return state.cardBuffs.clickPercentFactor;
}

function getAutoCardBonus() {
  return state.cardBuffs.autoPercentFactor;
}

function getFeverTriggerClicksRequired(customBuffs = state.cardBuffs) {
  return Math.max(5, Math.ceil(FEVER_TRIGGER_CLICKS / customBuffs.feverChargeFactor));
}

function getMeteorCooldownMs() {
  return Math.max(METEOR_MIN_COOLDOWN_MS, METEOR_BASE_COOLDOWN_MS);
}

function getBaseCriticalChance() {
  return Math.min(MAX_BASE_CRITICAL_CHANCE, BASE_CRITICAL_CHANCE + state.criticalShop.chance.level * 0.01);
}

function getRawCriticalChanceWithBuffs(customBuffs = state.cardBuffs) {
  const baseChance = getBaseCriticalChance();
  return Math.max(0, baseChance * Math.max(1, customBuffs.criticalChanceFactor || 1));
}

function getCriticalChanceWithBuffs(customBuffs = state.cardBuffs) {
  return Math.min(1, getRawCriticalChanceWithBuffs(customBuffs));
}

function getCriticalOverflowMultiplierWithBuffs(customBuffs = state.cardBuffs) {
  const rawCriticalChance = getRawCriticalChanceWithBuffs(customBuffs);
  if (rawCriticalChance <= 1) {
    return 1;
  }
  return 1 + (rawCriticalChance - 1) * DOUBLE_CRIT_OVERFLOW_SCALE;
}

function getBaseCriticalMultiplier() {
  return Math.min(
    MAX_BASE_CRITICAL_MULTIPLIER,
    BASE_CRITICAL_MULTIPLIER + state.criticalShop.multiplier.level * 0.1
  );
}

function getCriticalChance() {
  return getCriticalChanceWithBuffs(state.cardBuffs);
}

function getCriticalMultiplier() {
  const baseMultiplier = Math.max(1, getBaseCriticalMultiplier() * state.cardBuffs.criticalMultiplierFactor);
  return baseMultiplier * getCriticalOverflowMultiplierWithBuffs(state.cardBuffs);
}

function getFeverDurationMs() {
  return Math.min(MAX_FEVER_DURATION_MS, BASE_FEVER_DURATION_MS * state.cardBuffs.feverDurationFactor);
}

function getBasePerSecondRate() {
  return baseStats.autoProduction;
}

function isFeverActive() {
  return Date.now() < state.feverUntil;
}

function getFeverBonus() {
  if (!isFeverActive()) {
    return 0;
  }
  return FEVER_MULTIPLIER * state.cardBuffs.feverMultiplierFactor - 1;
}

function getShopMultiplier() {
  return getPermanentGainMultiplier();
}

function getFeverMultiplier() {
  return 1 + getFeverBonus();
}

function getPerSecondRate() {
  const shopLayer = getShopMultiplier();
  const cardLayer = getAutoCardBonus();
  const rawGain = getBasePerSecondRate() * shopLayer * cardLayer;
  const compressedGain = getSoftcappedAmount(rawGain);
  return (compressedGain + state.autoMiner.amount * AUTO_MINER_FLAT_PER_LEVEL) * getFeverMultiplier();
}

function getClickGain() {
  const baseClick = baseStats.clickStardust;
  const shopLayer = getShopMultiplier();
  const cardLayer = getClickCardBonus();
  const rawGain = baseClick * shopLayer * cardLayer;
  const compressedGain = getSoftcappedAmount(rawGain);
  return (compressedGain + state.clickUpgrade.level * CLICK_UPGRADE_FLAT_PER_LEVEL) * getFeverMultiplier();
}

function getBurstGainFromSeconds(seconds) {
  const burstSeconds = Math.max(0, Number(seconds) || 0);
  if (burstSeconds <= 0) {
    return 0;
  }
  const rawGain = getPerSecondRate() * burstSeconds;
  return getSoftcappedAmount(rawGain);
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
    clicksTowardFever: state.clicksTowardFever,
    autoMiner: {
      price: state.autoMiner.price,
      amount: state.autoMiner.amount
    },
    clickUpgrade: {
      price: state.clickUpgrade.price,
      level: state.clickUpgrade.level
    },
    xpDrive: {
      price: state.xpDrive.price,
      level: state.xpDrive.level
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
    preservedCardUids: state.preservedCardUids.slice(0, PRESERVATION_SLOT_LIMIT),
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
    state.clickPower = Math.max(baseStats.clickStardust, Number(parsed.clickPower) || baseStats.clickStardust);
    state.level = Math.max(1, Math.floor(Number(parsed.level) || 1));
    state.xp = Math.max(0, Number(parsed.xp) || 0);
    state.clicksTowardFever = Math.max(0, Math.floor(Number(parsed.clicksTowardFever) || 0));

    state.autoMiner.price = Math.max(
      GENERAL_UPGRADE_COST.autoMiner.base,
      Number(parsed.autoMiner?.price) || GENERAL_UPGRADE_COST.autoMiner.base
    );
    state.autoMiner.amount = Math.max(0, Number(parsed.autoMiner?.amount) || 0);

    const legacyClickLevel = Math.max(0, Number(parsed.milkyDrive?.amount) || 0);
    state.clickUpgrade.price = Math.max(
      GENERAL_UPGRADE_COST.clickUpgrade.base,
      Number(parsed.clickUpgrade?.price) || GENERAL_UPGRADE_COST.clickUpgrade.base
    );
    state.clickUpgrade.level = Math.max(legacyClickLevel, Number(parsed.clickUpgrade?.level) || 0);
    state.xpDrive.price = Math.max(
      GENERAL_UPGRADE_COST.xpDrive.base,
      Number(parsed.xpDrive?.price) || GENERAL_UPGRADE_COST.xpDrive.base
    );
    state.xpDrive.level = Math.max(0, Number(parsed.xpDrive?.level) || 0);

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
          .filter(
            (card) =>
              CARD_LIBRARY_BY_ID[card.cardId] &&
              RARITY_ORDER.includes(card.rarity) &&
              isPersistentInventoryCard(card.cardId)
          )
      : [];
    state.preservedCardUids = Array.isArray(parsed.preservedCardUids)
      ? parsed.preservedCardUids
          .map((uid) => Math.floor(Number(uid)))
          .filter((uid) => Number.isInteger(uid))
          .slice(0, PRESERVATION_SLOT_LIMIT)
      : [];
    const parsedNextUid = Math.floor(Number(parsed.nextCardUid) || 0);
    const maxUid = state.cardInventory.reduce((max, card) => Math.max(max, card.uid), 0);
    state.nextCardUid = Math.max(1, parsedNextUid || maxUid + 1);
    cleanupPreservedCardUids();
    recalculateCardBuffs();
    state.clickPower = baseStats.clickStardust + state.clickUpgrade.level * CLICK_UPGRADE_FLAT_PER_LEVEL;
    state.autoMiner.price = getGeneralUpgradeCost(
      GENERAL_UPGRADE_COST.autoMiner.base,
      GENERAL_UPGRADE_COST.autoMiner.growth,
      state.autoMiner.amount
    );
    state.clickUpgrade.price = getGeneralUpgradeCost(
      GENERAL_UPGRADE_COST.clickUpgrade.base,
      GENERAL_UPGRADE_COST.clickUpgrade.growth,
      state.clickUpgrade.level
    );
    state.xpDrive.price = getGeneralUpgradeCost(
      GENERAL_UPGRADE_COST.xpDrive.base,
      GENERAL_UPGRADE_COST.xpDrive.growth,
      state.xpDrive.level
    );
    state.clicksTowardFever = Math.min(state.clicksTowardFever, getFeverTriggerClicksRequired());

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
    const feverMultiplier = FEVER_MULTIPLIER * state.cardBuffs.feverMultiplierFactor;
    elements.feverStatus.textContent = `피버 타임 x${formatRate(feverMultiplier)} (${remainSec}초 남음)`;
    return;
  }
  const requiredClicks = getFeverTriggerClicksRequired();
  const remainingClicks = Math.max(0, requiredClicks - state.clicksTowardFever);
  elements.feverStatus.textContent = `피버 충전 중 (${remainingClicks}회 남음, 지속 ${Math.round(getFeverDurationMs() / 1000)}초)`;
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

function buildLevelupCard(baseCard, rarity, hasEmbeddedEvolution = false) {
  const value = baseCard.values?.[rarity.key];
  return {
    id: `${baseCard.id}-${rarity.key}`,
    baseId: baseCard.id,
    name: baseCard.name,
    rarityLabel: rarity.label,
    rarityClass: rarity.key,
    kind: baseCard.kind,
    description: `${baseCard.describe(value)}${hasEmbeddedEvolution ? " + 성장의 빛 내장" : ""}`,
    hasEmbeddedEvolution
  };
}

function getRandomLevelupCards(count) {
  const rarity = rollCardRarity();
  const feverClicksAtFloor = getFeverTriggerClicksRequired() <= 5;
  const pool = CARD_LIBRARY.filter((card) => !(feverClicksAtFloor && card.id === "feverChargeReducer"));
  const selected = [];
  while (selected.length < count && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    const pickedCard = pool.splice(idx, 1)[0];
    const embeddedEvolution = Math.random() < EMBEDDED_EVOLUTION_CHANCE;
    selected.push(buildLevelupCard(pickedCard, rarity, embeddedEvolution));
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

function tryEvolveRandomOwnedCard() {
  const upgradable = state.cardInventory.filter(
    (card) => RARITY_ORDER.includes(card.rarity) && card.rarity !== "mythic"
  );
  if (upgradable.length === 0) {
    return null;
  }
  const target = upgradable[Math.floor(Math.random() * upgradable.length)];
  const currentIndex = RARITY_ORDER.indexOf(target.rarity);
  target.rarity = RARITY_ORDER[currentIndex + 1];
  recalculateCardBuffs();
  return target;
}

function runCardMerge(cardId, rarity, mergeItemNode = null) {
  if (mergeInProgress) {
    return;
  }
  const required = MERGE_REQUIREMENTS[rarity];
  const nextRarity = getNextRarity(rarity);
  if (!required || !nextRarity) {
    return;
  }
  const candidates = state.cardInventory.filter((card) => card.cardId === cardId && card.rarity === rarity);
  if (candidates.length < required) {
    return;
  }
  mergeInProgress = true;
  if (mergeItemNode) {
    mergeItemNode.classList.add("merging");
  }
  playMergeChargeSound();
  spawnCosmicSelectionBurst(nextRarity);

  setTimeout(() => {
    const refreshedCandidates = state.cardInventory.filter((card) => card.cardId === cardId && card.rarity === rarity);
    if (refreshedCandidates.length < required) {
      mergeInProgress = false;
      updateView();
      return;
    }
    const toConsume = refreshedCandidates.slice(0, required);
    const consumeUidSet = new Set(toConsume.map((card) => card.uid));
    state.cardInventory = state.cardInventory.filter((card) => !consumeUidSet.has(card.uid));
    state.preservedCardUids = state.preservedCardUids.filter((uid) => !consumeUidSet.has(uid));
    addCardToInventory(cardId, nextRarity);
    cleanupPreservedCardUids();
    recalculateCardBuffs();
    playMergeImpactSound();
    spawnCosmicSelectionBurst(nextRarity);
    showImpactToast(`합성 성공! [${getRarityLabel(nextRarity)}] 등급 획득!`);
    mergeInProgress = false;
    updateView();
    saveState();
  }, 500);
}

function applyLevelupCardSelection(card) {
  const baseCard = CARD_LIBRARY_BY_ID[card.baseId];
  if (!baseCard) {
    return "카드 정보를 찾지 못했습니다.";
  }

  let notice = "저장소에 추가됨";
  const shouldPersistInInventory = isPersistentInventoryCard(card.baseId);
  if (shouldPersistInInventory) {
    addCardToInventory(card.baseId, card.rarityClass);
  }
  if (baseCard?.kind === "burst") {
    const burstValue = getCardValue(card.baseId, card.rarityClass);
    state.stardust += getBurstGainFromSeconds(burstValue);
    notice = `즉시 ${formatRounded(burstValue, 0)}초 분량 보너스 지급 (소모형 카드)`;
  }

  if (baseCard.kind === "passive") {
    recalculateCardBuffs();
    notice = "저장소에 추가됨 (영구 패시브 즉시 적용)";
  }

  if (card.hasEmbeddedEvolution) {
    const evolved = tryEvolveRandomOwnedCard();
    if (!evolved) {
      return `${notice} + 성장의 빛 발동 실패(진화 가능한 카드 없음)`;
    }
    const evolvedBase = CARD_LIBRARY_BY_ID[evolved.cardId];
    return `${notice} + 성장의 빛 발동! ${evolvedBase?.name ?? evolved.cardId} ➜ ${getRarityLabel(evolved.rarity)}`;
  }
  return notice;
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
  spawnCosmicSelectionBurst("rare");

  const cards = getRandomLevelupCards(3);
  cards.forEach((card) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `levelup-card ${card.rarityClass}`;
    button.innerHTML = `<span class="rarity-chip">${card.rarityLabel}</span><h3>${card.name}</h3><p>${card.description}</p>`;
    if (card.rarityClass === "legendary" || card.rarityClass === "mythic") {
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
      playCardPickSound(card.rarityClass);
      spawnCosmicSelectionBurst(card.rarityClass);
      button.classList.add("radiant-pick");
      if (card.rarityClass === "legendary" && card.baseId === "starBreak") {
        triggerLegendaryBurst("STAR BREAK JACKPOT!");
      }
      if (card.rarityClass === "legendary" && card.baseId === "meteorEffectBoost") {
        triggerLegendaryBurst("FEVER OVERDRIVE!");
      }
      if (card.rarityClass === "mythic") {
        triggerLegendaryBurst("MYTHIC COSMIC ASCENSION!");
      }
      if (card.rarityClass === "legendary" || card.rarityClass === "mythic") {
        showImpactToast(`${card.rarityLabel} 카드 획득!`);
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
  elements.levelValue.textContent = formatNumber(state.level, 0);
  elements.xpCurrent.textContent = formatStardust(state.xp);
  elements.xpRequired.textContent = formatNumber(requiredXp, 0);
  elements.xpFill.style.width = `${percent}%`;
}

function updateView() {
  const rebirthGain = getRebirthDarkMatterGain();
  const requiredClicksForFever = getFeverTriggerClicksRequired();
  const feverProgress = Math.min(1, state.clicksTowardFever / requiredClicksForFever);
  const clicksUntilFever = Math.max(0, requiredClicksForFever - state.clicksTowardFever);
  const criticalChance = getCriticalChance();
  const criticalMultiplier = getCriticalMultiplier();
  const clickXpGain = getClickXpGain();
  const perSecondMultiplier = getShopMultiplier() * getAutoCardBonus() * getFeverMultiplier();
  const clickMultiplier = getShopMultiplier() * getClickCardBonus() * getFeverMultiplier();

  elements.stardust.textContent = formatStardust(state.stardust);
  elements.darkMatter.textContent = formatNumber(state.darkMatter, 0);
  elements.perSecond.textContent = formatRate(getPerSecondRate());
  elements.clickPower.textContent = formatRate(getClickGain());

  elements.autoMinerTitle.textContent = `자동 생산 강화 | Lv.${formatNumber(state.autoMiner.amount, 0)}`;
  elements.autoMinerCost.textContent = formatNumber(state.autoMiner.price, 0);
  elements.clickUpgradeTitle.textContent = `클릭 강화 | Lv.${formatNumber(state.clickUpgrade.level, 0)}`;
  elements.clickUpgradeCost.textContent = formatNumber(state.clickUpgrade.price, 0);
  elements.xpDriveTitle.textContent = `XP 부스터 강화 | Lv.${formatNumber(state.xpDrive.level, 0)}`;
  elements.xpDriveCost.textContent = formatNumber(state.xpDrive.price, 0);
  const autoPlus5 = getUpgradeTotalCost(
    GENERAL_UPGRADE_COST.autoMiner.base,
    GENERAL_UPGRADE_COST.autoMiner.growth,
    state.autoMiner.amount,
    5
  );
  const autoPlus10 = getUpgradeTotalCost(
    GENERAL_UPGRADE_COST.autoMiner.base,
    GENERAL_UPGRADE_COST.autoMiner.growth,
    state.autoMiner.amount,
    10
  );
  const autoMaxPlan = calculateUpgradePurchasePlan({
    baseCost: GENERAL_UPGRADE_COST.autoMiner.base,
    growthRate: GENERAL_UPGRADE_COST.autoMiner.growth,
    currentLevel: state.autoMiner.amount,
    budget: state.stardust,
    targetCount: Number.POSITIVE_INFINITY
  });
  elements.autoMinerBulkCost.textContent = `+5 비용 ${formatNumber(autoPlus5, 0)} | +10 비용 ${formatNumber(
    autoPlus10,
    0
  )} | 최대 비용 ${formatNumber(autoMaxPlan.totalCost, 0)} (${formatNumber(autoMaxPlan.count, 0)}강)`;
  const clickPlus5 = getUpgradeTotalCost(
    GENERAL_UPGRADE_COST.clickUpgrade.base,
    GENERAL_UPGRADE_COST.clickUpgrade.growth,
    state.clickUpgrade.level,
    5
  );
  const clickPlus10 = getUpgradeTotalCost(
    GENERAL_UPGRADE_COST.clickUpgrade.base,
    GENERAL_UPGRADE_COST.clickUpgrade.growth,
    state.clickUpgrade.level,
    10
  );
  const clickMaxPlan = calculateUpgradePurchasePlan({
    baseCost: GENERAL_UPGRADE_COST.clickUpgrade.base,
    growthRate: GENERAL_UPGRADE_COST.clickUpgrade.growth,
    currentLevel: state.clickUpgrade.level,
    budget: state.stardust,
    targetCount: Number.POSITIVE_INFINITY
  });
  elements.clickUpgradeBulkCost.textContent = `+5 비용 ${formatNumber(clickPlus5, 0)} | +10 비용 ${formatNumber(
    clickPlus10,
    0
  )} | 최대 비용 ${formatNumber(clickMaxPlan.totalCost, 0)} (${formatNumber(clickMaxPlan.count, 0)}강)`;
  const xpPlus5 = getUpgradeTotalCost(
    GENERAL_UPGRADE_COST.xpDrive.base,
    GENERAL_UPGRADE_COST.xpDrive.growth,
    state.xpDrive.level,
    5
  );
  const xpPlus10 = getUpgradeTotalCost(
    GENERAL_UPGRADE_COST.xpDrive.base,
    GENERAL_UPGRADE_COST.xpDrive.growth,
    state.xpDrive.level,
    10
  );
  const xpMaxPlan = calculateUpgradePurchasePlan({
    baseCost: GENERAL_UPGRADE_COST.xpDrive.base,
    growthRate: GENERAL_UPGRADE_COST.xpDrive.growth,
    currentLevel: state.xpDrive.level,
    budget: state.stardust,
    targetCount: Number.POSITIVE_INFINITY
  });
  elements.xpDriveBulkCost.textContent = `+5 비용 ${formatNumber(xpPlus5, 0)} | +10 비용 ${formatNumber(
    xpPlus10,
    0
  )} | 최대 비용 ${formatNumber(xpMaxPlan.totalCost, 0)} (${formatNumber(xpMaxPlan.count, 0)}강)`;
  elements.criticalChanceShopCost.textContent = formatNumber(state.criticalShop.chance.price, 0);
  elements.criticalChanceShopLevel.textContent = formatNumber(state.criticalShop.chance.level, 0);
  elements.criticalMultiplierShopCost.textContent = formatNumber(state.criticalShop.multiplier.price, 0);
  elements.criticalMultiplierShopLevel.textContent = formatNumber(state.criticalShop.multiplier.level, 0);

  elements.buyAutoMiner.disabled = !canPurchaseUpgradeBulk({
    baseCost: GENERAL_UPGRADE_COST.autoMiner.base,
    growthRate: GENERAL_UPGRADE_COST.autoMiner.growth,
    currentLevel: state.autoMiner.amount
  });
  elements.buyClickUpgrade.disabled = !canPurchaseUpgradeBulk({
    baseCost: GENERAL_UPGRADE_COST.clickUpgrade.base,
    growthRate: GENERAL_UPGRADE_COST.clickUpgrade.growth,
    currentLevel: state.clickUpgrade.level
  });
  elements.buyXpDrive.disabled = !canPurchaseUpgradeBulk({
    baseCost: GENERAL_UPGRADE_COST.xpDrive.base,
    growthRate: GENERAL_UPGRADE_COST.xpDrive.growth,
    currentLevel: state.xpDrive.level
  });
  elements.buyCriticalChanceShop.disabled =
    state.stardust < state.criticalShop.chance.price || getBaseCriticalChance() >= MAX_BASE_CRITICAL_CHANCE;
  elements.buyCriticalMultiplierShop.disabled =
    state.stardust < state.criticalShop.multiplier.price ||
    getBaseCriticalMultiplier() >= MAX_BASE_CRITICAL_MULTIPLIER;

  elements.distortionCost.textContent = formatNumber(state.darkMatterShop.distortion.price, 0);
  elements.distortionLevel.textContent = formatNumber(state.darkMatterShop.distortion.level, 0);
  elements.singularityCost.textContent = formatNumber(state.darkMatterShop.singularity.price, 0);
  elements.singularityLevel.textContent = formatNumber(state.darkMatterShop.singularity.level, 0);

  elements.buyDistortion.disabled = state.darkMatter < state.darkMatterShop.distortion.price;
  elements.buySingularity.disabled = state.darkMatter < state.darkMatterShop.singularity.price;

  elements.rebirthButton.disabled = state.stardust < REBIRTH_THRESHOLD || rebirthGain <= 0;
  elements.rebirthButton.textContent = `블랙홀 개방 (환생 +${rebirthGain} DM)`;
  elements.statCriticalChance.textContent = formatPercent(criticalChance, 2);
  elements.statCriticalMultiplier.textContent = `x${formatRate(criticalMultiplier)}`;
  elements.statMeteorChance.textContent = `${clicksUntilFever}회 (${formatPercent(feverProgress, 1)})`;
  elements.statFeverDuration.textContent = `${Math.round(getFeverDurationMs() / 1000)}초 (+${formatNumber(
    (state.cardBuffs.feverDurationFactor - 1) * 100,
    0
  )}%)`;
  elements.statPerSecondMultiplier.textContent = `x${formatRate(perSecondMultiplier)}`;
  elements.statClickMultiplier.textContent = `x${formatRate(clickMultiplier)}`;
  elements.statCardClickMultiplier.textContent = `x${formatRate(state.cardBuffs.clickPercentFactor)}`;
  elements.statCardAutoMultiplier.textContent = `x${formatRate(state.cardBuffs.autoPercentFactor)}`;
  elements.statXpGain.textContent = formatRate(clickXpGain);
  elements.statXpMultiplier.textContent = `x${formatRate(state.cardBuffs.xpFactor)}`;

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

function updateBulkUpgradeUi() {
  if (!elements.bulkUpgradeControls) {
    return;
  }
  elements.bulkUpgradeControls.querySelectorAll("[data-bulk]").forEach((button) => {
    const value = button.getAttribute("data-bulk");
    const isMax = selectedBulkPurchase === Number.POSITIVE_INFINITY;
    const isActive = value === "max" ? isMax : String(selectedBulkPurchase) === value;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function calculateUpgradePurchasePlan({ baseCost, growthRate, currentLevel, budget, targetCount }) {
  const safeBudget = Math.max(0, Number(budget) || 0);
  const cap = targetCount === Number.POSITIVE_INFINITY ? Number.POSITIVE_INFINITY : Math.max(0, targetCount);
  let remainingBudget = safeBudget;
  let totalCost = 0;
  let count = 0;

  while (count < cap) {
    const stepCost = getGeneralUpgradeCost(baseCost, growthRate, currentLevel + count);
    if (stepCost > remainingBudget) {
      break;
    }
    remainingBudget -= stepCost;
    totalCost += stepCost;
    count += 1;
  }

  return { count, totalCost };
}

function getUpgradeTotalCost(baseCost, growthRate, currentLevel, levels) {
  const plan = calculateUpgradePurchasePlan({
    baseCost,
    growthRate,
    currentLevel,
    budget: Number.POSITIVE_INFINITY,
    targetCount: levels
  });
  return plan.totalCost;
}

function canPurchaseUpgradeBulk({ baseCost, growthRate, currentLevel }) {
  const isMaxPurchase = selectedBulkPurchase === Number.POSITIVE_INFINITY;
  const requestedCount = isMaxPurchase ? Number.POSITIVE_INFINITY : selectedBulkPurchase;
  const { count, totalCost } = calculateUpgradePurchasePlan({
    baseCost,
    growthRate,
    currentLevel,
    budget: state.stardust,
    targetCount: requestedCount
  });
  if (!isMaxPurchase && count < requestedCount) {
    return false;
  }
  if (count <= 0 || totalCost <= 0) {
    return false;
  }
  return state.stardust >= totalCost;
}

function purchaseUpgradeBulk({ baseCost, growthRate, currentLevel }, applyLevels) {
  if (!canPurchaseUpgradeBulk({ baseCost, growthRate, currentLevel })) {
    return false;
  }
  const isMaxPurchase = selectedBulkPurchase === Number.POSITIVE_INFINITY;
  const requestedCount = isMaxPurchase ? Number.POSITIVE_INFINITY : selectedBulkPurchase;
  const { count, totalCost } = calculateUpgradePurchasePlan({
    baseCost,
    growthRate,
    currentLevel,
    budget: state.stardust,
    targetCount: requestedCount
  });
  if (!spendStardust(totalCost)) {
    return false;
  }
  applyLevels(count);
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
  state.clicksTowardFever = 0;
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
    `블랙홀 환생을 진행할까요?\n레벨/XP/보유 카드가 초기화되며, 보존 저장소 지정 카드만 유지됩니다.\nDark Matter ${gain}개를 획득합니다.`
  );
  if (!confirmed) {
    return;
  }

  cleanupPreservedCardUids();
  const preservedCards = state.cardInventory
    .filter((card) => state.preservedCardUids.includes(card.uid))
    .slice(0, PRESERVATION_SLOT_LIMIT)
    .map((card) => ({ ...card }));

  state.darkMatter += gain;

  state.stardust = 0;
  state.clickPower = baseStats.clickStardust;
  state.level = 1;
  state.xp = 0;
  state.clicksTowardFever = 0;
  state.pendingLevelUps = 0;
  state.autoMiner.amount = 0;
  state.autoMiner.price = GENERAL_UPGRADE_COST.autoMiner.base;
  state.clickUpgrade.level = 0;
  state.clickUpgrade.price = GENERAL_UPGRADE_COST.clickUpgrade.base;
  state.xpDrive.level = 0;
  state.xpDrive.price = GENERAL_UPGRADE_COST.xpDrive.base;
  state.criticalShop.chance.level = 0;
  state.criticalShop.chance.price = 2000;
  state.criticalShop.multiplier.level = 0;
  state.criticalShop.multiplier.price = 3000;
  state.feverUntil = 0;
  state.cardInventory = preservedCards;
  state.preservedCardUids = preservedCards.map((card) => card.uid);
  recalculateCardBuffs();
  removeMeteor();
  closeLevelupModal();

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
  if (!isFeverActive()) {
    state.clicksTowardFever += 1;
    if (state.clicksTowardFever >= getFeverTriggerClicksRequired()) {
      startFever();
    }
  }
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
  const purchased = purchaseUpgradeBulk(
    {
      baseCost: GENERAL_UPGRADE_COST.autoMiner.base,
      growthRate: GENERAL_UPGRADE_COST.autoMiner.growth,
      currentLevel: state.autoMiner.amount
    },
    (count) => {
    state.autoMiner.amount += count;
    state.stats.autoMinersPurchased += count;
    state.autoMiner.price = getGeneralUpgradeCost(
      GENERAL_UPGRADE_COST.autoMiner.base,
      GENERAL_UPGRADE_COST.autoMiner.growth,
      state.autoMiner.amount
    );
    }
  );
  if (!purchased) {
    return;
  }
  playUpgradeSound();
  checkAchievements();
  updateView();
  saveState();
});

elements.buyClickUpgrade.addEventListener("click", () => {
  const purchased = purchaseUpgradeBulk(
    {
      baseCost: GENERAL_UPGRADE_COST.clickUpgrade.base,
      growthRate: GENERAL_UPGRADE_COST.clickUpgrade.growth,
      currentLevel: state.clickUpgrade.level
    },
    (count) => {
    state.clickUpgrade.level += count;
    state.clickPower = baseStats.clickStardust + state.clickUpgrade.level * CLICK_UPGRADE_FLAT_PER_LEVEL;
    state.clickUpgrade.price = getGeneralUpgradeCost(
      GENERAL_UPGRADE_COST.clickUpgrade.base,
      GENERAL_UPGRADE_COST.clickUpgrade.growth,
      state.clickUpgrade.level
    );
    }
  );
  if (!purchased) {
    return;
  }
  playUpgradeSound();
  updateView();
  saveState();
});

elements.buyXpDrive.addEventListener("click", () => {
  const purchased = purchaseUpgradeBulk(
    {
      baseCost: GENERAL_UPGRADE_COST.xpDrive.base,
      growthRate: GENERAL_UPGRADE_COST.xpDrive.growth,
      currentLevel: state.xpDrive.level
    },
    (count) => {
    state.xpDrive.level += count;
    state.xpDrive.price = getGeneralUpgradeCost(
      GENERAL_UPGRADE_COST.xpDrive.base,
      GENERAL_UPGRADE_COST.xpDrive.growth,
      state.xpDrive.level
    );
    }
  );
  if (!purchased) {
    return;
  }
  playUpgradeSound();
  updateView();
  saveState();
});

elements.bulkUpgradeControls?.querySelectorAll("[data-bulk]").forEach((button) => {
  button.addEventListener("click", () => {
    const bulkValue = button.getAttribute("data-bulk");
    if (bulkValue === "max") {
      selectedBulkPurchase = Number.POSITIVE_INFINITY;
    } else {
      selectedBulkPurchase = Math.max(1, Number(bulkValue) || 1);
    }
    updateBulkUpgradeUi();
    updateView();
  });
});

elements.buyCriticalChanceShop.addEventListener("click", () => {
  if (getBaseCriticalChance() >= MAX_BASE_CRITICAL_CHANCE) {
    return;
  }
  if (!spendStardust(state.criticalShop.chance.price)) {
    return;
  }
  playUpgradeSound();
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
  playUpgradeSound();
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
  playUpgradeSound();
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
  playUpgradeSound();
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

elements.inventoryTabCards.addEventListener("click", () => {
  setInventoryTabUi("cards");
});

elements.inventoryTabMerge.addEventListener("click", () => {
  setInventoryTabUi("merge");
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
  wasFeverActiveLastTick = feverActive;

  if (!state.isLevelupOpen) {
    const gain = getPerSecondRate();
    if (gain > 0) {
      state.stardust += gain;
    }
  }

  checkAchievements();
  updateView();
  saveState();
}, 1000);

loadState();
wasFeverActiveLastTick = isFeverActive();
checkAchievements();
renderCardCodex();
updateAudioToggleUi();
setInventoryTabUi("cards");
updateBulkUpgradeUi();
updateView();
