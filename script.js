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
const REBIRTH_THRESHOLD = 10_000_000;
const DARK_MATTER_FORMAT_THRESHOLD = 10000;
const BASE_CLICK_XP = 10;
const LEVELUP_CARD_LOCK_MS = 1200;
const GROWTH_LIGHT_MAX_TARGET_RARITY = "epic";
const AUDIO_PREF_KEY = "stardust-clicker-muted";
const MUSIC_PLAYLIST_MODE = "sequential";
const MUSIC_STEPS_PER_TRACK = 64;
const BASE_PRESERVATION_SLOTS = 1;
const MAX_PRESERVATION_SLOT_UPGRADES = 10;
const MAX_EVOLUTION_LOGS = 14;
const baseStats = {
  clickStardust: 1,
  feverClicks: FEVER_TRIGGER_CLICKS,
  xpGain: BASE_CLICK_XP,
  critChance: BASE_CRITICAL_CHANCE,
  critMultiplier: BASE_CRITICAL_MULTIPLIER,
  feverDuration: BASE_FEVER_DURATION_MS / 1000,
  feverMultiplier: FEVER_MULTIPLIER
};
const CLICK_UPGRADE_FLAT_PER_LEVEL = 2;
const XP_UPGRADE_FLAT_PER_LEVEL = 10;
const GENERAL_UPGRADE_COST = {
  clickUpgrade: { base: 30, growth: 1.72 },
  xpDrive: { base: 45, growth: 1.68 }
};

const RARITY_COLORS = {
  common: "#888888",
  rare: "#007bff",
  epic: "#a335ee",
  legendary: "#ff8000",
  mythic: "#ff47cf"
};

function buildFormatNumberUnits() {
  const units = ["K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  for (let first = 0; first < alphabet.length; first += 1) {
    for (let second = 0; second < alphabet.length; second += 1) {
      units.push(alphabet[first] + alphabet[second]);
    }
  }
  return units;
}

const FORMAT_NUMBER_UNITS = buildFormatNumberUnits();

const MUSIC_PLAYLISTS = {
  normal: [
    {
      id: "lunar-echo",
      chordMap: [196, 220, 247, 262, 294, 262, 247, 220, 196, 175, 196, 220, 247, 294, 330, 294],
      leadPattern: [2, 2.5, 3, 2.5, 2, 1.5, 2, 2.5, 2, 1.5, 2, 2.5, 3, 2.5, 2, 1.5],
      tempo: 74,
      bassType: "triangle"
    },
    {
      id: "void-harmony",
      chordMap: [165, 196, 220, 247, 220, 196, 165, 147, 165, 196, 220, 262, 247, 220, 196, 165],
      leadPattern: [2, 1.5, 2, 2.5, 2, 1.5, 2, 1, 2, 1.5, 2, 2.5, 3, 2.5, 2, 1.5],
      tempo: 68,
      bassType: "triangle"
    },
    {
      id: "nebula-drift",
      chordMap: [220, 247, 262, 294, 262, 247, 220, 196, 220, 247, 294, 330, 294, 262, 247, 220],
      leadPattern: [2, 2.5, 2, 1.5, 2, 2.5, 3, 2.5, 2, 2.5, 2, 1.5, 2, 2.5, 2, 1.5],
      tempo: 80,
      bassType: "sine"
    },
    {
      id: "stardust-echo",
      chordMap: [174, 196, 220, 247, 262, 247, 220, 196, 174, 196, 220, 247, 262, 294, 262, 247],
      leadPattern: [2, 1.5, 2, 2.5, 3, 2.5, 2, 1.5, 2, 1.5, 2, 2.5, 2, 1.5, 2, 2.5],
      tempo: 76,
      bassType: "sine"
    }
  ],
  fever: [
    {
      id: "supernova-rush",
      chordMap: [220, 262, 294, 330, 349, 330, 294, 262, 220, 247, 294, 349, 392, 349, 294, 262],
      leadPattern: [2, 2.5, 3, 2.5, 2, 2.5, 3, 2.5, 2, 2.5, 3, 3.5, 3, 2.5, 2, 2.5],
      tempo: 118,
      bassType: "sawtooth"
    },
    {
      id: "plasma-surge",
      chordMap: [247, 294, 330, 349, 392, 349, 330, 294, 247, 294, 349, 392, 440, 392, 349, 294],
      leadPattern: [2, 2.5, 3, 2.5, 2, 2.5, 3, 2.5, 2, 2.5, 3, 3.5, 3, 2.5, 2, 2.5],
      tempo: 124,
      bassType: "sawtooth"
    },
    {
      id: "cosmic-overdrive",
      chordMap: [196, 247, 294, 349, 392, 349, 294, 247, 196, 247, 294, 349, 392, 440, 392, 349],
      leadPattern: [2, 2.5, 2, 2.5, 3, 2.5, 2, 2.5, 2, 2.5, 3, 3.5, 3, 2.5, 2, 2.5],
      tempo: 120,
      bassType: "square"
    },
    {
      id: "fever-prism",
      chordMap: [262, 311, 349, 392, 440, 392, 349, 311, 262, 311, 349, 392, 440, 494, 440, 392],
      leadPattern: [2, 2.5, 3, 2.5, 2, 2.5, 3, 2.5, 2, 2.5, 3, 3.5, 3, 2.5, 2, 2.5],
      tempo: 128,
      bassType: "sawtooth"
    }
  ]
};

const ACHIEVEMENTS = [
  { id: "cosmicPioneer", name: "우주 개척자" },
  { id: "stardustTycoon", name: "스타더스트 재벌" },
  { id: "satelliteCollector", name: "위성 컬렉터" },
  { id: "luckyAstronomer", name: "황금 유성 추적자" }
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
const MERGE_REQUIREMENTS = {
  common: 2,
  rare: 3,
  epic: 4,
  legendary: 5
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
    describe: (value) => `즉시 현재 클릭 획득량의 ${value}회 분량 획득`
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
      singularity: { price: 3, level: 0 },
      preservationSlots: { price: 10, level: 0 },
      wormholeEngine: { price: 5, level: 0 },
      stardustGravity: { price: 7, level: 0 },
      feverHighway: { price: 9, level: 0 }
    },
    cardBuffs: createEmptyCardBuffs(),
    cardInventory: [],
    preservedCardUids: [],
    evolutionLogs: [],
    nextCardUid: 1,
    stats: {
      totalClicks: 0,
      meteorClicks: 0
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
  clickPower: document.getElementById("click-power"),
  feverStatus: document.getElementById("fever-status"),
  rebirthButton: document.getElementById("rebirth-button"),
  rebirthHint: document.getElementById("rebirth-hint"),
  statsToggle: document.getElementById("stats-toggle"),
  codexToggle: document.getElementById("codex-toggle"),
  inventoryToggle: document.getElementById("inventory-toggle"),
  codexPanel: document.getElementById("codex-panel"),
  inventoryPanel: document.getElementById("inventory-panel"),
  inventoryCardsView: document.getElementById("inventory-cards-view"),
  inventoryMergeView: document.getElementById("inventory-merge-view"),
  dmLabToggle: document.getElementById("dm-lab-toggle"),
  resetProgressButton: document.getElementById("reset-progress-button"),
  resetConfirmOverlay: document.getElementById("reset-confirm-overlay"),
  resetConfirmCancel: document.getElementById("reset-confirm-cancel"),
  resetConfirmAccept: document.getElementById("reset-confirm-accept"),
  rebirthConfirmOverlay: document.getElementById("rebirth-confirm-overlay"),
  rebirthConfirmCancel: document.getElementById("rebirth-confirm-cancel"),
  rebirthConfirmAccept: document.getElementById("rebirth-confirm-accept"),
  levelValue: document.getElementById("level-value"),
  xpCurrent: document.getElementById("xp-current"),
  xpRequired: document.getElementById("xp-required"),
  xpFill: document.getElementById("xp-fill"),
  statCriticalChance: document.getElementById("stat-critical-chance"),
  statCriticalMultiplier: document.getElementById("stat-critical-multiplier"),
  statMeteorChance: document.getElementById("stat-meteor-chance"),
  statFeverDuration: document.getElementById("stat-fever-duration"),
  statClickMultiplier: document.getElementById("stat-click-multiplier"),
  statCardClickMultiplier: document.getElementById("stat-card-click-multiplier"),
  statXpGain: document.getElementById("stat-xp-gain"),
  statXpMultiplier: document.getElementById("stat-xp-multiplier"),
  statPanel: document.getElementById("stat-panel"),
  codexList: document.getElementById("codex-list"),
  growthLightHelpToggle: document.getElementById("growth-light-help-toggle"),
  growthLightHelpText: document.getElementById("growth-light-help-text"),
  growthLightHelpInventory: document.getElementById("growth-light-help-inventory"),
  growthLightHelpInventoryText: document.getElementById("growth-light-help-inventory-text"),
  preservationTitle: document.getElementById("preservation-title"),
  preservationSlots: document.getElementById("preservation-slots"),
  inventoryTabCards: document.getElementById("inventory-tab-cards"),
  inventoryTabMerge: document.getElementById("inventory-tab-merge"),
  inventorySummary: document.getElementById("inventory-summary"),
  inventoryGrid: document.getElementById("inventory-grid"),
  mergeList: document.getElementById("merge-list"),
  bulkMergeButton: document.getElementById("bulk-merge-button"),
  evolutionLog: document.getElementById("evolution-log"),
  levelupOverlay: document.getElementById("levelup-overlay"),
  levelupCards: document.getElementById("levelup-cards"),
  levelupPreview: document.getElementById("levelup-preview"),
  planetButton: document.getElementById("planet-button"),
  planetSection: document.querySelector(".planet-section"),
  satelliteLayer: document.getElementById("satellite-layer"),
  clickUpgradeCost: document.getElementById("click-upgrade-cost"),
  clickUpgradeLevel: document.getElementById("click-upgrade-level"),
  clickUpgradeBulkCost: document.getElementById("click-upgrade-bulk-cost"),
  xpDriveCost: document.getElementById("xp-drive-cost"),
  xpDriveLevel: document.getElementById("xp-drive-level"),
  xpDriveBulkCost: document.getElementById("xp-drive-bulk-cost"),
  buyClickUpgrade: document.getElementById("buy-click-upgrade"),
  buyXpDrive: document.getElementById("buy-xp-drive"),
  bulkUpgradeControls: document.getElementById("bulk-upgrade-controls"),
  criticalChanceShopCost: document.getElementById("critical-chance-shop-cost"),
  criticalChanceShopLevel: document.getElementById("critical-chance-shop-level"),
  criticalMultiplierShopCost: document.getElementById("critical-multiplier-shop-cost"),
  criticalMultiplierShopLevel: document.getElementById("critical-multiplier-shop-level"),
  criticalChanceBulkCost: document.getElementById("critical-chance-bulk-cost"),
  criticalMultiplierBulkCost: document.getElementById("critical-multiplier-bulk-cost"),
  buyCriticalChanceShop: document.getElementById("buy-critical-chance-shop"),
  buyCriticalMultiplierShop: document.getElementById("buy-critical-multiplier-shop"),
  singularityCost: document.getElementById("singularity-cost"),
  singularityLevel: document.getElementById("singularity-level"),
  preservationSlotUpgradeCost: document.getElementById("preservation-slot-upgrade-cost"),
  preservationSlotUpgradeLevel: document.getElementById("preservation-slot-upgrade-level"),
  wormholeEngineCost: document.getElementById("wormhole-engine-cost"),
  wormholeEngineLevel: document.getElementById("wormhole-engine-level"),
  stardustGravityCost: document.getElementById("stardust-gravity-cost"),
  stardustGravityLevel: document.getElementById("stardust-gravity-level"),
  feverHighwayCost: document.getElementById("fever-highway-cost"),
  feverHighwayLevel: document.getElementById("fever-highway-level"),
  buySingularity: document.getElementById("buy-singularity"),
  buyPreservationSlotUpgrade: document.getElementById("buy-preservation-slot-upgrade"),
  buyWormholeEngine: document.getElementById("buy-wormhole-engine"),
  buyStardustGravity: document.getElementById("buy-stardust-gravity"),
  buyFeverHighway: document.getElementById("buy-fever-highway"),
  achievementsToggle: document.getElementById("achievements-toggle"),
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
let rebirthConfirmResolver = null;
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
  stepsInCurrentTrack: 0,
  activeNormalTrackIndex: 0,
  activeFeverTrackIndex: 0,
  currentPlaylistMode: MUSIC_PLAYLIST_MODE,
  activeTrack: null,
  lastFeverMode: false,
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
  let scaled = abs;
  let unitIndex = -1;
  while (scaled >= 1000 && unitIndex < FORMAT_NUMBER_UNITS.length - 1) {
    scaled /= 1000;
    unitIndex += 1;
  }
  const unit = FORMAT_NUMBER_UNITS[unitIndex] ?? "??";
  return `${sign}${formatRounded(scaled, digits)}${unit}`;
}

function formatStardust(value) {
  return formatNumber(value, 2);
}

function formatDarkMatter(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return "0";
  }
  if (Math.abs(numeric) < DARK_MATTER_FORMAT_THRESHOLD) {
    return formatNumber(numeric, 0);
  }
  return formatNumber(numeric, 2);
}

function formatRate(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return "0.0";
  }
  if (Math.abs(numeric) < 100) {
    const digits = Math.abs(numeric) < 10 ? 2 : 1;
    return formatRounded(numeric, digits).toFixed(digits);
  }
  return formatNumber(numeric, 1);
}

function formatPercent(value, digits = 1) {
  return `${formatNumber(value * 100, digits)}%`;
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

function pickPlaylistTrackIndex(mode, playlist) {
  if (playlist.length <= 1) {
    return 0;
  }
  if (audioState.currentPlaylistMode === "random") {
    return Math.floor(Math.random() * playlist.length);
  }
  const indexKey = mode === "fever" ? "activeFeverTrackIndex" : "activeNormalTrackIndex";
  const trackIndex = audioState[indexKey] % playlist.length;
  audioState[indexKey] = (trackIndex + 1) % playlist.length;
  return trackIndex;
}

function getActiveMusicTrack(feverMode, forceNew = false) {
  const mode = feverMode ? "fever" : "normal";
  const playlist = MUSIC_PLAYLISTS[mode];
  if (!playlist || playlist.length === 0) {
    return null;
  }
  const modeChanged = audioState.lastFeverMode !== feverMode;
  if (forceNew || modeChanged || !audioState.activeTrack || audioState.activeTrack.mode !== mode) {
    const trackIndex = pickPlaylistTrackIndex(mode, playlist);
    audioState.activeTrack = { mode, ...playlist[trackIndex] };
    audioState.stepsInCurrentTrack = 0;
    audioState.lastFeverMode = feverMode;
    return audioState.activeTrack;
  }
  if (audioState.stepsInCurrentTrack >= MUSIC_STEPS_PER_TRACK) {
    const trackIndex = pickPlaylistTrackIndex(mode, playlist);
    audioState.activeTrack = { mode, ...playlist[trackIndex] };
    audioState.stepsInCurrentTrack = 0;
  }
  return audioState.activeTrack;
}

function scheduleBgmStep(stepTime, feverMode) {
  const context = ensureAudioContext();
  const track = getActiveMusicTrack(feverMode);
  if (!track) {
    return;
  }
  const chordMap = track.chordMap;
  const stepIndex = audioState.step % chordMap.length;
  const bassRoot = chordMap[stepIndex];
  const leadPattern = track.leadPattern || [2, 2.5, 2, 1.5];
  const leadRatio = leadPattern[stepIndex % leadPattern.length];
  const feverLayer = feverMode;
  const isAccentStep = stepIndex % 4 === 0;

  const bassOsc = context.createOscillator();
  const bassGain = context.createGain();
  bassOsc.type = track.bassType;
  bassOsc.frequency.setValueAtTime(bassRoot / 2, stepTime);
  bassGain.gain.setValueAtTime(0.0001, stepTime);
  bassGain.gain.exponentialRampToValueAtTime(feverLayer ? 0.048 : isAccentStep ? 0.04 : 0.032, stepTime + 0.03);
  bassGain.gain.exponentialRampToValueAtTime(0.0001, stepTime + 0.42);
  bassOsc.connect(bassGain);
  bassGain.connect(audioState.bgmGain);
  bassOsc.start(stepTime);
  bassOsc.stop(stepTime + 0.44);

  if (stepIndex % 2 === 1 || feverLayer) {
    const leadFreq = (bassRoot / 2) * leadRatio;
    const leadOsc = context.createOscillator();
    const leadGain = context.createGain();
    leadOsc.type = feverLayer ? "triangle" : "sine";
    leadOsc.frequency.setValueAtTime(leadFreq, stepTime);
    leadGain.gain.setValueAtTime(0.0001, stepTime);
    leadGain.gain.exponentialRampToValueAtTime(feverLayer ? 0.028 : 0.018, stepTime + 0.02);
    leadGain.gain.exponentialRampToValueAtTime(0.0001, stepTime + 0.24);
    leadOsc.connect(leadGain);
    leadGain.connect(audioState.bgmGain);
    leadOsc.start(stepTime);
    leadOsc.stop(stepTime + 0.26);
  }

  if (isAccentStep) {
    const padOsc = context.createOscillator();
    const padGain = context.createGain();
    padOsc.type = "sine";
    padOsc.frequency.setValueAtTime(bassRoot, stepTime);
    padGain.gain.setValueAtTime(0.0001, stepTime);
    padGain.gain.exponentialRampToValueAtTime(feverLayer ? 0.014 : 0.01, stepTime + 0.08);
    padGain.gain.exponentialRampToValueAtTime(0.0001, stepTime + 0.55);
    padOsc.connect(padGain);
    padGain.connect(audioState.bgmGain);
    padOsc.start(stepTime);
    padOsc.stop(stepTime + 0.57);
  }

  audioState.stepsInCurrentTrack += 1;
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
    const track = getActiveMusicTrack(feverMode);
    const tempo = track?.tempo ?? (feverMode ? 124 : 86);
    const stepDuration = 60 / tempo / 2;
    while (audioState.nextNoteTime < context.currentTime + 0.18) {
      scheduleBgmStep(audioState.nextNoteTime, feverMode);
      audioState.nextNoteTime += stepDuration;
      audioState.step = (audioState.step + 1) % (track?.chordMap?.length ?? 16);
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

function showImpactToast(text, { html = false } = {}) {
  if (!elements.impactToast) {
    return;
  }
  if (html) {
    elements.impactToast.innerHTML = text;
  } else {
    elements.impactToast.textContent = text;
  }
  elements.impactToast.classList.remove("show");
  void elements.impactToast.offsetWidth;
  elements.impactToast.classList.add("show");
}

function renderCardCodex() {
  elements.codexList.innerHTML = CARD_LIBRARY.map((card) => {
    const rarityRows = RARITIES.map((rarity) => {
      const text = card.describe(card.values[rarity.key]);
      return `<li>${formatRarityHtml(rarity.key)} ${escapeHtml(text)}</li>`;
    }).join("");
    return `<article class="codex-item"><h3>${escapeHtml(card.name)}</h3><ul>${rarityRows}</ul></article>`;
  }).join("");
}

function getRarityLabel(rarityKey) {
  return RARITIES.find((rarity) => rarity.key === rarityKey)?.label ?? rarityKey;
}

function normalizeRarityKey(rarityKey) {
  return RARITY_ORDER.includes(rarityKey) ? rarityKey : "common";
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatRarityHtml(rarityKey, text) {
  const safeKey = normalizeRarityKey(rarityKey);
  const label = text ?? getRarityLabel(safeKey);
  return `<span class="rarity-label rarity-${safeKey}">${escapeHtml(label)}</span>`;
}

function formatRarityBracket(rarityKey) {
  return formatRarityHtml(rarityKey, `[${getRarityLabel(normalizeRarityKey(rarityKey))}]`);
}

function formatRarityTransitionHtml(fromRarity, toRarity, separator = " ➔ ") {
  return `${formatRarityHtml(fromRarity)}${separator}${formatRarityHtml(toRarity)}`;
}

function formatCardEvolutionHtml(cardName, fromRarity, toRarity) {
  const safeName = escapeHtml(cardName);
  return `${safeName}(${formatRarityHtml(fromRarity)}) ➔ ${safeName}(${formatRarityHtml(toRarity)})`;
}

function formatCardEvolutionColoredHtml(cardName, fromRarity, toRarity) {
  const safeName = escapeHtml(cardName);
  const fromKey = normalizeRarityKey(fromRarity);
  const toKey = normalizeRarityKey(toRarity);
  const fromLabel = escapeHtml(getRarityLabel(fromKey));
  const toLabel = escapeHtml(getRarityLabel(toKey));
  const fromColor = RARITY_COLORS[fromKey] ?? RARITY_COLORS.common;
  const toColor = RARITY_COLORS[toKey] ?? RARITY_COLORS.rare;
  return `<span class="evolution-log-entry" style="color:${fromColor}">${safeName}(${fromLabel})</span> ➔ <span class="evolution-log-entry" style="color:${toColor}">${safeName}(${toLabel})</span>`;
}

function canReceiveGrowthLight(card) {
  const rarityIndex = RARITY_ORDER.indexOf(card.rarity);
  const maxIndex = RARITY_ORDER.indexOf(GROWTH_LIGHT_MAX_TARGET_RARITY);
  return rarityIndex >= 0 && rarityIndex <= maxIndex && Boolean(getNextRarity(card.rarity));
}

function getPreservationCardKey(cardId, rarity) {
  return `${cardId}:${rarity}`;
}

function toggleGrowthLightHelp(button, textNode) {
  if (!button || !textNode) {
    return;
  }
  const willOpen = textNode.classList.contains("hidden");
  textNode.classList.toggle("hidden", !willOpen);
  button.setAttribute("aria-expanded", String(willOpen));
}

function formatRarityCountsSummary(countMap) {
  return RARITIES.map((rarity, index) => {
    const countHtml = formatRarityHtml(rarity.key, String(countMap[rarity.key] ?? 0));
    return index === 0 ? countHtml : `<span class="rarity-count-sep">/</span>${countHtml}`;
  }).join("");
}

function setLevelupPreview(content, { html = false } = {}) {
  if (!elements.levelupPreview) {
    return;
  }
  if (html) {
    elements.levelupPreview.innerHTML = content;
    return;
  }
  elements.levelupPreview.textContent = content;
}

function getPreservationSlotLimit() {
  return BASE_PRESERVATION_SLOTS + Math.min(MAX_PRESERVATION_SLOT_UPGRADES, state.darkMatterShop.preservationSlots.level);
}

function getCriticalChanceMaxLevel() {
  return Math.floor((MAX_BASE_CRITICAL_CHANCE - BASE_CRITICAL_CHANCE) / 0.005);
}

function getCriticalChanceIncreasePerLevel() {
  return 0.005;
}

function getStardustGravityMultiplier() {
  return Math.pow(1.1, state.darkMatterShop.stardustGravity.level);
}

function getWormholeClickMultiplier() {
  return Math.pow(1.15, state.darkMatterShop.wormholeEngine.level);
}

function getFeverHighwayGainMultiplier() {
  return Math.pow(1.2, state.darkMatterShop.feverHighway.level);
}

function getFeverHighwayDurationBonusMs() {
  return state.darkMatterShop.feverHighway.level * 1000;
}

function pushEvolutionLog(cardId, fromRarity, toRarity) {
  const base = CARD_LIBRARY_BY_ID[cardId];
  const name = base?.name ?? cardId;
  state.evolutionLogs.unshift({ cardId, name, fromRarity, toRarity, at: Date.now() });
  state.evolutionLogs = state.evolutionLogs.slice(0, MAX_EVOLUTION_LOGS);
}

function renderEvolutionLogs() {
  if (!elements.evolutionLog) {
    return;
  }
  if (state.evolutionLogs.length === 0) {
    elements.evolutionLog.innerHTML = '<p class="inventory-empty">최근 진화 로그가 없습니다.</p>';
    return;
  }
  elements.evolutionLog.innerHTML = state.evolutionLogs
    .map((log) => {
      const rarityClass = normalizeRarityKey(log.toRarity);
      return `<article class="merge-item merge-rarity-${rarityClass}"><p>${formatCardEvolutionColoredHtml(
        log.name,
        log.fromRarity,
        log.toRarity
      )}</p></article>`;
    })
    .join("");
}

function getCardValue(cardId, rarity) {
  const card = CARD_LIBRARY_BY_ID[cardId];
  if (!card) {
    return null;
  }
  return card.values?.[rarity] ?? null;
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

function getNextRarity(rarity) {
  const currentIndex = RARITY_ORDER.indexOf(rarity);
  if (currentIndex < 0 || currentIndex >= RARITY_ORDER.length - 1) {
    return null;
  }
  return RARITY_ORDER[currentIndex + 1];
}

function cleanupPreservedCardUids() {
  const uidToCard = new Map(state.cardInventory.map((card) => [card.uid, card]));
  const slotLimit = getPreservationSlotLimit();
  const seenKeys = new Set();
  state.preservedCardUids = state.preservedCardUids
    .filter((uid, index, arr) => {
      if (!Number.isInteger(uid) || !uidToCard.has(uid) || arr.indexOf(uid) !== index) {
        return false;
      }
      const card = uidToCard.get(uid);
      if (!card) {
        return false;
      }
      const key = getPreservationCardKey(card.cardId, card.rarity);
      if (seenKeys.has(key)) {
        return false;
      }
      seenKeys.add(key);
      return true;
    })
    .slice(0, slotLimit);
}

function renderPreservationSlots() {
  const slotLimit = getPreservationSlotLimit();
  const preservedMap = new Map(state.cardInventory.map((card) => [card.uid, card]));
  const slots = Array.from({ length: slotLimit }, (_, index) => {
    const uid = state.preservedCardUids[index];
    const card = uid ? preservedMap.get(uid) : null;
    if (!card) {
      return `<article class="preservation-slot empty"><strong>SLOT ${index + 1}</strong><span class="empty-slot-check" aria-hidden="true">✔</span><span>비어 있음</span></article>`;
    }
    const base = CARD_LIBRARY_BY_ID[card.cardId];
    const rarityClass = normalizeRarityKey(card.rarity);
    return `<article class="preservation-slot filled ${rarityClass}" data-preserve-uid="${card.uid}" role="button" tabindex="0" title="클릭하여 보존 해제"><strong>SLOT ${index + 1}</strong><span class="card-rarity-line">${formatRarityBracket(
      card.rarity
    )}</span>${escapeHtml(base?.name ?? card.cardId)}</article>`;
  });
  if (elements.preservationTitle) {
    elements.preservationTitle.textContent = `우주 보존 저장소 (환생 보존 ${slotLimit}슬롯)`;
  }
  elements.preservationSlots.innerHTML = slots.join("");
}

function setInventoryTabUi(tab) {
  activeInventoryTab = tab;
  elements.inventoryTabCards?.classList.toggle("active", tab === "cards");
  elements.inventoryTabMerge?.classList.toggle("active", tab === "merge");
  elements.inventoryCardsView?.classList.toggle("hidden", tab !== "cards");
  elements.inventoryMergeView?.classList.toggle("hidden", tab !== "merge");
  if (tab === "merge") {
    renderMergeUi();
    renderEvolutionLogs();
  }
  if (tab === "cards") {
    renderInventoryUi();
  }
}

function setPanelOpen(panel, toggleButton, open) {
  if (!panel || !toggleButton) {
    return;
  }
  panel.classList.toggle("open", open);
  toggleButton.setAttribute("aria-expanded", String(open));
}

function togglePanel(panel, toggleButton) {
  const willOpen = !panel.classList.contains("open");
  setPanelOpen(panel, toggleButton, willOpen);
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
  if (elements.bulkMergeButton) {
    elements.bulkMergeButton.disabled = candidates.every((candidate) => candidate.cards.length < candidate.required);
  }
  if (candidates.length === 0) {
    elements.mergeList.innerHTML = '<p class="inventory-empty">합성 가능한 카드가 없습니다.</p>';
    return;
  }
  elements.mergeList.innerHTML = candidates
    .map((candidate) => {
      const base = CARD_LIBRARY_BY_ID[candidate.cardId];
      const available = candidate.cards.length;
      const canMerge = available >= candidate.required;
      const rarityClass = normalizeRarityKey(candidate.rarity);
      return `<article class="merge-item merge-rarity-${rarityClass}">
        <p>${escapeHtml(base?.name ?? candidate.cardId)} | ${formatRarityHtml(candidate.rarity)} ${available}장 ➔ ${formatRarityHtml(
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
  const targetCard = state.cardInventory.find((card) => card.uid === uid);
  if (!targetCard) {
    return { ok: false, message: "카드를 찾을 수 없습니다." };
  }
  const index = state.preservedCardUids.indexOf(uid);
  if (index >= 0) {
    state.preservedCardUids.splice(index, 1);
    return { ok: true, action: "removed" };
  }
  const hasDuplicate = state.preservedCardUids.some((preservedUid) => {
    const preservedCard = state.cardInventory.find((card) => card.uid === preservedUid);
    return (
      preservedCard?.cardId === targetCard.cardId &&
      preservedCard?.rarity === targetCard.rarity &&
      preservedUid !== uid
    );
  });
  if (hasDuplicate) {
    return { ok: false, message: "이미 장착된 중복 카드입니다." };
  }
  if (state.preservedCardUids.length >= getPreservationSlotLimit()) {
    return { ok: false, message: "보존 슬롯이 가득 찼습니다." };
  }
  state.preservedCardUids.push(uid);
  return { ok: true, action: "added" };
}

function refreshPreservationUi() {
  cleanupPreservedCardUids();
  renderPreservationSlots();
  if (!elements.inventoryGrid) {
    return;
  }
  const cardNodes = elements.inventoryGrid.querySelectorAll(".inventory-card");
  if (cardNodes.length === 0) {
    return;
  }
  cardNodes.forEach((cardNode) => {
    const uid = Number(cardNode.getAttribute("data-card-uid"));
    const isPreserved = state.preservedCardUids.includes(uid);
    cardNode.classList.toggle("selected-preserve", isPreserved);
    const countNode = cardNode.querySelector(".inventory-count");
    if (countNode) {
      countNode.textContent = isPreserved ? "보존 지정됨 (클릭하여 해제)" : "클릭하여 보존 지정";
    }
  });
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
    <article class="summary-tile"><strong>등급별 보유</strong>${formatRarityCountsSummary(rarityCountMap)}</article>
    <article class="summary-tile"><strong>일시 효과 카드</strong>${burstTotal}장</article>
  `;

  renderPreservationSlots();
  renderMergeUi();
  renderEvolutionLogs();
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
    cardNode.innerHTML = `<h4>${escapeHtml(cardBase.name)}</h4>
      <p class="card-rarity-line">${formatRarityHtml(cardInstance.rarity)} | #${cardInstance.uid}</p>
      <p>${cardBase.kind === "passive" ? "영구 패시브" : "일시 효과"}</p>
      <p>${cardBase.describe(value)}</p>
      <p class="inventory-count">${state.preservedCardUids.includes(cardInstance.uid) ? "보존 지정됨 (클릭하여 해제)" : "클릭하여 보존 지정"}</p>`;
    cardNode.setAttribute("data-card-uid", String(cardInstance.uid));
    cardNode.addEventListener("click", (event) => {
      event.stopPropagation();
      const result = toggleCardPreservation(cardInstance.uid);
      if (!result.ok && result.message) {
        showImpactToast(result.message);
        return;
      }
      refreshPreservationUi();
      saveState();
    });
    elements.inventoryGrid.appendChild(cardNode);
  });
}

function getClickFlatBonus() {
  return baseStats.clickStardust + state.clickUpgrade.level * CLICK_UPGRADE_FLAT_PER_LEVEL;
}

function getRawClickMultiplier(customBuffs = state.cardBuffs) {
  return (
    customBuffs.clickPercentFactor *
    getFeverMultiplier() *
    getWormholeClickMultiplier() *
    getStardustGravityMultiplier()
  );
}

function buildStatSnapshot(customBuffs = state.cardBuffs) {
  const flat = getClickFlatBonus();
  const rawMult =
    customBuffs.clickPercentFactor *
    getFeverMultiplier() *
    getWormholeClickMultiplier() *
    getStardustGravityMultiplier();
  return {
    clickGain: flat * rawMult,
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
    const burstGain = getBurstGainFromClicks(value);
    return `획득량 미리보기: 스타더스트 +${formatRate(burstGain)} (${formatRounded(value, 0)}회 클릭 분량, 즉시 지급)${evolutionSuffix}`;
  }
  const virtualBuffs = { ...state.cardBuffs };
  applyPassiveCardToBuffs(card.baseId, card.rarityClass, virtualBuffs);
  const after = buildStatSnapshot(virtualBuffs);
  if (card.baseId === "overloadClick") {
    return `클릭 생산량: ${formatDelta(before.clickGain, after.clickGain, 1)}${evolutionSuffix}`;
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
  return `클릭 생산량: ${formatDelta(before.clickGain, after.clickGain, 1)}${evolutionSuffix}`;
}

function getXpRequiredForLevel(level) {
  return Math.floor(400 + 100 * Math.pow(1.2, Math.max(1, level)));
}

function getClickXpGain() {
  const baseXp = baseStats.xpGain + state.xpDrive.level * XP_UPGRADE_FLAT_PER_LEVEL;
  return baseXp * state.cardBuffs.xpFactor;
}

function getClickCardBonus() {
  return state.cardBuffs.clickPercentFactor;
}

function getFeverTriggerClicksRequired(customBuffs = state.cardBuffs) {
  return Math.max(5, Math.ceil(FEVER_TRIGGER_CLICKS / customBuffs.feverChargeFactor));
}

function getMeteorCooldownMs() {
  return Math.max(METEOR_MIN_COOLDOWN_MS, METEOR_BASE_COOLDOWN_MS);
}

function getBaseCriticalChance() {
  return Math.min(MAX_BASE_CRITICAL_CHANCE, BASE_CRITICAL_CHANCE + state.criticalShop.chance.level * getCriticalChanceIncreasePerLevel());
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
  return BASE_CRITICAL_MULTIPLIER + state.criticalShop.multiplier.level * 0.1;
}

function getCriticalChance() {
  return getCriticalChanceWithBuffs(state.cardBuffs);
}

function getCriticalMultiplier() {
  const baseMultiplier = Math.max(1, getBaseCriticalMultiplier() * state.cardBuffs.criticalMultiplierFactor);
  return baseMultiplier * getCriticalOverflowMultiplierWithBuffs(state.cardBuffs);
}

function getFeverDurationMs() {
  return Math.min(
    MAX_FEVER_DURATION_MS,
    BASE_FEVER_DURATION_MS * state.cardBuffs.feverDurationFactor + getFeverHighwayDurationBonusMs()
  );
}

function isFeverActive() {
  return Date.now() < state.feverUntil;
}

function getFeverBonus() {
  if (!isFeverActive()) {
    return 0;
  }
  return FEVER_MULTIPLIER * state.cardBuffs.feverMultiplierFactor * getFeverHighwayGainMultiplier() - 1;
}

function getFeverMultiplier() {
  return 1 + getFeverBonus();
}

function getClickGain(extraDamageMultiplier = 1) {
  const flat = getClickFlatBonus();
  const rawMult = getRawClickMultiplier() * Math.max(1, Number(extraDamageMultiplier) || 1);
  return flat * rawMult;
}

function getBurstGainFromClicks(clickCount) {
  const burstClicks = Math.max(0, Number(clickCount) || 0);
  if (burstClicks <= 0) {
    return 0;
  }
  return getClickGain() * burstClicks;
}

function getRebirthDarkMatterGain() {
  if (state.stardust < REBIRTH_THRESHOLD) {
    return 0;
  }
  const logBase = Math.log10(Math.max(1, state.stardust));
  const rebirthBonus = 1 + state.darkMatterShop.singularity.level * 0.5;
  return Math.floor(Math.pow(logBase, 2) * rebirthBonus);
}

function saveState() {
  const saveData = {
    stardust: state.stardust,
    darkMatter: state.darkMatter,
    clickPower: state.clickPower,
    level: state.level,
    xp: state.xp,
    clicksTowardFever: state.clicksTowardFever,
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
      singularity: { price: state.darkMatterShop.singularity.price, level: state.darkMatterShop.singularity.level },
      preservationSlots: {
        price: state.darkMatterShop.preservationSlots.price,
        level: state.darkMatterShop.preservationSlots.level
      },
      wormholeEngine: { price: state.darkMatterShop.wormholeEngine.price, level: state.darkMatterShop.wormholeEngine.level },
      stardustGravity: {
        price: state.darkMatterShop.stardustGravity.price,
        level: state.darkMatterShop.stardustGravity.level
      },
      feverHighway: { price: state.darkMatterShop.feverHighway.price, level: state.darkMatterShop.feverHighway.level }
    },
    cardInventory: state.cardInventory.map((card) => ({
      uid: card.uid,
      cardId: card.cardId,
      rarity: card.rarity
    })),
    preservedCardUids: state.preservedCardUids.slice(0, getPreservationSlotLimit()),
    evolutionLogs: state.evolutionLogs.slice(0, MAX_EVOLUTION_LOGS),
    nextCardUid: state.nextCardUid,
    stats: {
      totalClicks: state.stats.totalClicks,
      meteorClicks: state.stats.meteorClicks,
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

    const legacyClickLevel = Math.max(0, Number(parsed.milkyDrive?.amount) || 0);
    const legacyAutoMinerLevel = Math.max(0, Number(parsed.autoMiner?.amount) || 0);
    state.clickUpgrade.price = Math.max(
      GENERAL_UPGRADE_COST.clickUpgrade.base,
      Number(parsed.clickUpgrade?.price) || GENERAL_UPGRADE_COST.clickUpgrade.base
    );
    state.clickUpgrade.level = Math.max(legacyClickLevel, legacyAutoMinerLevel, Number(parsed.clickUpgrade?.level) || 0);
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

    state.darkMatterShop.singularity.price = Math.max(3, Number(parsed.darkMatterShop?.singularity?.price) || 3);
    state.darkMatterShop.singularity.level = Math.max(0, Number(parsed.darkMatterShop?.singularity?.level) || 0);
    state.darkMatterShop.preservationSlots.level = Math.min(
      MAX_PRESERVATION_SLOT_UPGRADES,
      Math.max(0, Number(parsed.darkMatterShop?.preservationSlots?.level) || 0)
    );
    state.darkMatterShop.preservationSlots.price = Math.max(
      10,
      Number(parsed.darkMatterShop?.preservationSlots?.price) ||
        getPreservationSlotUpgradePrice(state.darkMatterShop.preservationSlots.level)
    );
    state.darkMatterShop.wormholeEngine.level = Math.max(0, Number(parsed.darkMatterShop?.wormholeEngine?.level) || 0);
    state.darkMatterShop.wormholeEngine.price = Math.max(
      5,
      Number(parsed.darkMatterShop?.wormholeEngine?.price) || 5
    );
    state.darkMatterShop.stardustGravity.level = Math.max(
      0,
      Number(parsed.darkMatterShop?.stardustGravity?.level) || 0
    );
    state.darkMatterShop.stardustGravity.price = Math.max(
      7,
      Number(parsed.darkMatterShop?.stardustGravity?.price) || 7
    );
    state.darkMatterShop.feverHighway.level = Math.max(0, Number(parsed.darkMatterShop?.feverHighway?.level) || 0);
    state.darkMatterShop.feverHighway.price = Math.max(9, Number(parsed.darkMatterShop?.feverHighway?.price) || 9);
    state.darkMatterShop.preservationSlots.price = getPreservationSlotUpgradePrice(state.darkMatterShop.preservationSlots.level);

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
              card.cardId !== "spaceAcceleration" &&
              RARITY_ORDER.includes(card.rarity) &&
              isPersistentInventoryCard(card.cardId)
          )
      : [];
    state.preservedCardUids = Array.isArray(parsed.preservedCardUids)
      ? parsed.preservedCardUids
          .map((uid) => Math.floor(Number(uid)))
          .filter((uid) => Number.isInteger(uid))
          .slice(0, getPreservationSlotLimit())
      : [];
    state.evolutionLogs = Array.isArray(parsed.evolutionLogs)
      ? parsed.evolutionLogs
          .map((log) => ({
            cardId: String(log?.cardId || ""),
            name: String(log?.name || ""),
            fromRarity: String(log?.fromRarity || "common"),
            toRarity: String(log?.toRarity || "rare"),
            at: Number(log?.at) || Date.now()
          }))
          .filter(
            (log) =>
              CARD_LIBRARY_BY_ID[log.cardId] && RARITY_ORDER.includes(log.fromRarity) && RARITY_ORDER.includes(log.toRarity)
          )
          .slice(0, MAX_EVOLUTION_LOGS)
      : [];
    const parsedNextUid = Math.floor(Number(parsed.nextCardUid) || 0);
    const maxUid = state.cardInventory.reduce((max, card) => Math.max(max, card.uid), 0);
    state.nextCardUid = Math.max(1, parsedNextUid || maxUid + 1);
    cleanupPreservedCardUids();
    recalculateCardBuffs();
    state.clickPower = baseStats.clickStardust + state.clickUpgrade.level * CLICK_UPGRADE_FLAT_PER_LEVEL;
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
  const displayCount = Math.min(state.clickUpgrade.level, 16);
  elements.satelliteLayer.innerHTML = "";

  if (displayCount <= 0) {
    elements.satelliteLayer.classList.remove("rotating");
    return;
  }

  elements.satelliteLayer.classList.add("rotating");
  const distance = 95;

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
  if (state.clickUpgrade.level >= 10) {
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

function isRebirthConfirmOpen() {
  return elements.rebirthConfirmOverlay.classList.contains("show");
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

function closeRebirthConfirmModal(confirmed) {
  if (!isRebirthConfirmOpen()) {
    return;
  }
  document.body.classList.remove("reset-confirm-open");
  elements.rebirthConfirmOverlay.classList.remove("show");
  elements.rebirthConfirmOverlay.setAttribute("aria-hidden", "true");

  if (rebirthConfirmResolver) {
    const resolver = rebirthConfirmResolver;
    rebirthConfirmResolver = null;
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

function openRebirthConfirmModal(gain) {
  if (isRebirthConfirmOpen()) {
    return Promise.resolve(false);
  }
  const gainText = formatDarkMatter(gain);
  const desc = document.getElementById("rebirth-confirm-description");
  if (desc) {
    desc.innerHTML =
      `레벨/XP/보유 카드가 초기화됩니다.<br /><strong class="rebirth-card-warning">현재 카드 저장소에 있는 카드를 제외하고 모든 카드가 삭제됩니다.</strong><br />` +
      `환생 시 Dark Matter <strong>${gainText}</strong>개를 획득합니다.`;
  }
  document.body.classList.add("reset-confirm-open");
  elements.rebirthConfirmOverlay.classList.add("show");
  elements.rebirthConfirmOverlay.setAttribute("aria-hidden", "false");
  elements.rebirthConfirmAccept.focus();
  return new Promise((resolve) => {
    rebirthConfirmResolver = resolve;
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
  const upgradable = state.cardInventory.filter((card) => canReceiveGrowthLight(card));
  if (upgradable.length === 0) {
    return null;
  }
  const target = upgradable[Math.floor(Math.random() * upgradable.length)];
  const fromRarity = target.rarity;
  const currentIndex = RARITY_ORDER.indexOf(fromRarity);
  const toRarity = RARITY_ORDER[currentIndex + 1];
  target.rarity = toRarity;
  pushEvolutionLog(target.cardId, fromRarity, toRarity);
  recalculateCardBuffs();
  return { ...target, fromRarity, toRarity };
}

function performCardMerge(cardId, rarity, mergeItemNode = null) {
  const required = MERGE_REQUIREMENTS[rarity];
  const nextRarity = getNextRarity(rarity);
  if (!required || !nextRarity) {
    return false;
  }
  const refreshedCandidates = state.cardInventory.filter((card) => card.cardId === cardId && card.rarity === rarity);
  if (refreshedCandidates.length < required) {
    return false;
  }
  const toConsume = refreshedCandidates.slice(0, required);
  const consumeUidSet = new Set(toConsume.map((card) => card.uid));
  state.cardInventory = state.cardInventory.filter((card) => !consumeUidSet.has(card.uid));
  state.preservedCardUids = state.preservedCardUids.filter((uid) => !consumeUidSet.has(uid));
  addCardToInventory(cardId, nextRarity);
  pushEvolutionLog(cardId, rarity, nextRarity);
  cleanupPreservedCardUids();
  recalculateCardBuffs();
  playMergeImpactSound();
  spawnCosmicSelectionBurst(nextRarity);
  showImpactToast(`합성 성공! ${formatRarityBracket(nextRarity)} 등급 획득!`, { html: true });
  return true;
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
    performCardMerge(cardId, rarity, mergeItemNode);
    mergeInProgress = false;
    updateView();
    saveState();
  }, 500);
}

function runBulkCardMerge() {
  if (mergeInProgress) {
    return;
  }
  mergeInProgress = true;
  let mergedCount = 0;
  let safety = 0;
  while (safety < 200) {
    safety += 1;
    const candidates = buildMergeCandidates();
    let mergedInPass = false;
    candidates.forEach((candidate) => {
      const mergeTimes = Math.floor(candidate.cards.length / candidate.required);
      for (let i = 0; i < mergeTimes; i += 1) {
        if (performCardMerge(candidate.cardId, candidate.rarity)) {
          mergedCount += 1;
          mergedInPass = true;
        }
      }
    });
    if (!mergedInPass) {
      break;
    }
  }
  mergeInProgress = false;
  if (mergedCount > 0) {
    showImpactToast(`일괄 합성 완료! 총 ${formatNumber(mergedCount, 0)}회 진화`);
    playMergeChargeSound();
    updateView();
    saveState();
  } else {
    showImpactToast("일괄 합성 가능한 카드가 없습니다.");
    updateView();
  }
}

function applyLevelupCardSelection(card) {
  const baseCard = CARD_LIBRARY_BY_ID[card.baseId];
  if (!baseCard) {
    return "카드 정보를 찾지 못했습니다.";
  }

  const rarityNotice = `${formatRarityBracket(card.rarityClass)} 등급`;
  let notice = `${rarityNotice} 카드 저장소에 추가됨`;
  const shouldPersistInInventory = isPersistentInventoryCard(card.baseId);
  if (shouldPersistInInventory) {
    addCardToInventory(card.baseId, card.rarityClass);
  }
  if (baseCard?.kind === "burst") {
    const burstValue = getCardValue(card.baseId, card.rarityClass);
    state.stardust += getBurstGainFromClicks(burstValue);
    notice = `${rarityNotice} 즉시 ${formatRounded(burstValue, 0)}회 클릭 분량 보너스 지급 (소모형)`;
  }

  if (baseCard.kind === "passive") {
    recalculateCardBuffs();
    notice = `${rarityNotice} 카드 저장소에 추가됨 (영구 패시브 즉시 적용)`;
  }

  if (card.hasEmbeddedEvolution) {
    const evolved = tryEvolveRandomOwnedCard();
    if (!evolved) {
      return `${notice} + ${escapeHtml("성장의 빛 발동 실패(진화 가능한 카드 없음)")}`;
    }
    const evolvedBase = CARD_LIBRARY_BY_ID[evolved.cardId];
    renderEvolutionLogs();
    return `${notice} + 성장의 빛 발동! ${formatCardEvolutionColoredHtml(
      evolvedBase?.name ?? evolved.cardId,
      evolved.fromRarity,
      evolved.toRarity
    )}`;
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
  setLevelupPreview("카드에 마우스를 올리면 선택 후 스탯 변화를 확인할 수 있습니다.");
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
    button.innerHTML = `<span class="rarity-chip rarity-${card.rarityClass}">${escapeHtml(card.rarityLabel)}</span><h3>${escapeHtml(
      card.name
    )}</h3><p>${escapeHtml(card.description)}</p>`;
    if (card.rarityClass === "legendary" || card.rarityClass === "mythic") {
      attachLegendaryDust(button);
    }
    const previewText = previewCardText(card);
    const previewHtml = `${formatRarityBracket(card.rarityClass)} · ${escapeHtml(previewText)}`;
    button.addEventListener("mouseenter", () => {
      setLevelupPreview(previewHtml, { html: true });
    });
    button.addEventListener("focus", () => {
      setLevelupPreview(previewHtml, { html: true });
    });
    button.addEventListener("mouseleave", () => {
      setLevelupPreview("카드에 마우스를 올리면 선택 후 스탯 변화를 확인할 수 있습니다.");
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
        showImpactToast(`${formatRarityHtml(card.rarityClass, card.rarityLabel)} 카드 획득!`, { html: true });
      }
      const selectionNotice = applyLevelupCardSelection(card);
      setLevelupPreview(selectionNotice, { html: true });
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
  const clickMultiplier =
    getClickCardBonus() * getWormholeClickMultiplier() * getFeverMultiplier() * getStardustGravityMultiplier();

  elements.stardust.textContent = formatStardust(state.stardust);
  elements.darkMatter.textContent = formatDarkMatter(state.darkMatter);
  elements.clickPower.textContent = formatRate(getClickGain());
  if (elements.rebirthHint) {
    elements.rebirthHint.textContent = `조건: Stardust ${formatNumber(REBIRTH_THRESHOLD, 0)} 이상`;
  }

  elements.clickUpgradeCost.textContent = formatNumber(state.clickUpgrade.price, 0);
  if (elements.clickUpgradeLevel) {
    elements.clickUpgradeLevel.textContent = formatNumber(state.clickUpgrade.level, 0);
  }
  elements.xpDriveCost.textContent = formatNumber(state.xpDrive.price, 0);
  if (elements.xpDriveLevel) {
    elements.xpDriveLevel.textContent = formatNumber(state.xpDrive.level, 0);
  }
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
  const chancePlus5 = calculateEscalatingPurchasePlan({
    startPrice: state.criticalShop.chance.price,
    budget: Number.POSITIVE_INFINITY,
    targetCount: 5,
    maxPurchases: Math.max(0, getCriticalChanceMaxLevel() - state.criticalShop.chance.level)
  });
  const chancePlus10 = calculateEscalatingPurchasePlan({
    startPrice: state.criticalShop.chance.price,
    budget: Number.POSITIVE_INFINITY,
    targetCount: 10,
    maxPurchases: Math.max(0, getCriticalChanceMaxLevel() - state.criticalShop.chance.level)
  });
  const chanceMax = calculateEscalatingPurchasePlan({
    startPrice: state.criticalShop.chance.price,
    budget: state.stardust,
    targetCount: Number.POSITIVE_INFINITY,
    maxPurchases: Math.max(0, getCriticalChanceMaxLevel() - state.criticalShop.chance.level)
  });
  const multiplierPlus5 = calculateEscalatingPurchasePlan({
    startPrice: state.criticalShop.multiplier.price,
    budget: Number.POSITIVE_INFINITY,
    targetCount: 5
  });
  const multiplierPlus10 = calculateEscalatingPurchasePlan({
    startPrice: state.criticalShop.multiplier.price,
    budget: Number.POSITIVE_INFINITY,
    targetCount: 10
  });
  const multiplierMax = calculateEscalatingPurchasePlan({
    startPrice: state.criticalShop.multiplier.price,
    budget: state.stardust,
    targetCount: Number.POSITIVE_INFINITY
  });
  if (elements.criticalChanceBulkCost) {
    elements.criticalChanceBulkCost.textContent = `+5 비용 ${formatNumber(chancePlus5.totalCost, 0)} | +10 비용 ${formatNumber(
      chancePlus10.totalCost,
      0
    )} | 최대 비용 ${formatNumber(chanceMax.totalCost, 0)} (${formatNumber(chanceMax.count, 0)}강)`;
  }
  if (elements.criticalMultiplierBulkCost) {
    elements.criticalMultiplierBulkCost.textContent = `+5 비용 ${formatNumber(
      multiplierPlus5.totalCost,
      0
    )} | +10 비용 ${formatNumber(multiplierPlus10.totalCost, 0)} | 최대 비용 ${formatNumber(
      multiplierMax.totalCost,
      0
    )} (${formatNumber(multiplierMax.count, 0)}강)`;
  }

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
  elements.buyCriticalChanceShop.disabled = !canPurchaseCriticalBulk("chance");
  elements.buyCriticalMultiplierShop.disabled = !canPurchaseCriticalBulk("multiplier");

  elements.singularityCost.textContent = formatDarkMatter(state.darkMatterShop.singularity.price);
  elements.singularityLevel.textContent = formatNumber(state.darkMatterShop.singularity.level, 0);
  elements.preservationSlotUpgradeCost.textContent = formatDarkMatter(state.darkMatterShop.preservationSlots.price);
  elements.preservationSlotUpgradeLevel.textContent = formatNumber(state.darkMatterShop.preservationSlots.level, 0);
  elements.wormholeEngineCost.textContent = formatDarkMatter(state.darkMatterShop.wormholeEngine.price);
  elements.wormholeEngineLevel.textContent = formatNumber(state.darkMatterShop.wormholeEngine.level, 0);
  elements.stardustGravityCost.textContent = formatDarkMatter(state.darkMatterShop.stardustGravity.price);
  elements.stardustGravityLevel.textContent = formatNumber(state.darkMatterShop.stardustGravity.level, 0);
  elements.feverHighwayCost.textContent = formatDarkMatter(state.darkMatterShop.feverHighway.price);
  elements.feverHighwayLevel.textContent = formatNumber(state.darkMatterShop.feverHighway.level, 0);

  elements.buySingularity.disabled = state.darkMatter < state.darkMatterShop.singularity.price;
  elements.buyPreservationSlotUpgrade.disabled =
    state.darkMatter < state.darkMatterShop.preservationSlots.price ||
    state.darkMatterShop.preservationSlots.level >= MAX_PRESERVATION_SLOT_UPGRADES;
  elements.buyWormholeEngine.disabled = state.darkMatter < state.darkMatterShop.wormholeEngine.price;
  elements.buyStardustGravity.disabled = state.darkMatter < state.darkMatterShop.stardustGravity.price;
  elements.buyFeverHighway.disabled = state.darkMatter < state.darkMatterShop.feverHighway.price;

  elements.rebirthButton.disabled = state.stardust < REBIRTH_THRESHOLD || rebirthGain <= 0;
  elements.rebirthButton.textContent = `블랙홀 개방 (환생 +${formatDarkMatter(rebirthGain)} DM)`;
  elements.statCriticalChance.textContent = formatPercent(criticalChance, 2);
  elements.statCriticalMultiplier.textContent = `x${formatRate(criticalMultiplier)}`;
  elements.statMeteorChance.textContent = `${clicksUntilFever}회 (${formatPercent(feverProgress, 1)})`;
  elements.statFeverDuration.textContent = `${Math.round(getFeverDurationMs() / 1000)}초 (+${formatNumber(
    (state.cardBuffs.feverDurationFactor - 1) * 100,
    0
  )}%)`;
  elements.statClickMultiplier.textContent = `x${formatRate(clickMultiplier)}`;
  elements.statCardClickMultiplier.textContent = `x${formatRate(state.cardBuffs.clickPercentFactor)}`;
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

function getPreservationSlotUpgradePrice(level) {
  return 10 * Math.pow(10, Math.max(0, level));
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
  const bulkControls = document.getElementById("bulk-upgrade-controls");
  if (!bulkControls) {
    return;
  }
  bulkControls.querySelectorAll("[data-bulk]").forEach((button) => {
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

function calculateEscalatingPurchasePlan({ startPrice, budget, targetCount, maxPurchases = Number.POSITIVE_INFINITY }) {
  const cap = targetCount === Number.POSITIVE_INFINITY ? Number.POSITIVE_INFINITY : Math.max(0, targetCount);
  const purchaseCap = Number.isFinite(maxPurchases) ? Math.max(0, maxPurchases) : Number.POSITIVE_INFINITY;
  let remainingBudget = Math.max(0, Number(budget) || 0);
  let nextPrice = Math.max(1, Math.floor(Number(startPrice) || 1));
  let totalCost = 0;
  let count = 0;

  while (count < cap && count < purchaseCap) {
    if (nextPrice > remainingBudget) {
      break;
    }
    remainingBudget -= nextPrice;
    totalCost += nextPrice;
    count += 1;
    nextPrice = raisePrice(nextPrice);
  }

  return { count, totalCost, nextPrice };
}

function canPurchaseCriticalBulk(type) {
  const shopEntry = state.criticalShop[type];
  if (!shopEntry) {
    return false;
  }
  const requestedCount = selectedBulkPurchase === Number.POSITIVE_INFINITY ? Number.POSITIVE_INFINITY : selectedBulkPurchase;
  const maxPurchases =
    type === "chance" ? Math.max(0, getCriticalChanceMaxLevel() - state.criticalShop.chance.level) : Number.POSITIVE_INFINITY;
  const plan = calculateEscalatingPurchasePlan({
    startPrice: shopEntry.price,
    budget: state.stardust,
    targetCount: requestedCount,
    maxPurchases
  });
  if (requestedCount !== Number.POSITIVE_INFINITY && plan.count < requestedCount) {
    return false;
  }
  return plan.count > 0 && plan.totalCost > 0;
}

function purchaseCriticalBulk(type) {
  if (!canPurchaseCriticalBulk(type)) {
    return false;
  }
  const requestedCount = selectedBulkPurchase === Number.POSITIVE_INFINITY ? Number.POSITIVE_INFINITY : selectedBulkPurchase;
  const maxPurchases =
    type === "chance" ? Math.max(0, getCriticalChanceMaxLevel() - state.criticalShop.chance.level) : Number.POSITIVE_INFINITY;
  const plan = calculateEscalatingPurchasePlan({
    startPrice: state.criticalShop[type].price,
    budget: state.stardust,
    targetCount: requestedCount,
    maxPurchases
  });
  if (!spendStardust(plan.totalCost)) {
    return false;
  }
  state.criticalShop[type].level += plan.count;
  state.criticalShop[type].price = plan.nextPrice;
  return plan.count > 0;
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

async function runRebirth() {
  const gain = getRebirthDarkMatterGain();
  if (state.stardust < REBIRTH_THRESHOLD || gain <= 0) {
    return;
  }

  const confirmed = await openRebirthConfirmModal(gain);
  if (!confirmed) {
    return;
  }

  cleanupPreservedCardUids();
  const slotLimit = getPreservationSlotLimit();
  const preservedCards = state.cardInventory
    .filter((card) => state.preservedCardUids.includes(card.uid))
    .slice(0, slotLimit)
    .map((card) => ({ ...card }));

  state.darkMatter += gain;

  state.stardust = 0;
  state.clickPower = baseStats.clickStardust;
  state.level = 1;
  state.xp = 0;
  state.clicksTowardFever = 0;
  state.pendingLevelUps = 0;
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

  const criticalHit = Math.random() < getCriticalChance();
  const clickGain = getClickGain(criticalHit ? getCriticalMultiplier() : 1);
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

document.getElementById("bulk-upgrade-controls")?.querySelectorAll("[data-bulk]").forEach((button) => {
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

elements.bulkMergeButton?.addEventListener("click", () => {
  runBulkCardMerge();
});

elements.buyCriticalChanceShop.addEventListener("click", () => {
  if (!purchaseCriticalBulk("chance")) {
    return;
  }
  playUpgradeSound();
  updateView();
  saveState();
});

elements.buyCriticalMultiplierShop.addEventListener("click", () => {
  if (!purchaseCriticalBulk("multiplier")) {
    return;
  }
  playUpgradeSound();
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

elements.buyPreservationSlotUpgrade.addEventListener("click", () => {
  const upgrade = state.darkMatterShop.preservationSlots;
  if (upgrade.level >= MAX_PRESERVATION_SLOT_UPGRADES) {
    return;
  }
  if (!spendDarkMatter(upgrade.price)) {
    return;
  }
  playUpgradeSound();
  upgrade.level += 1;
  upgrade.price = getPreservationSlotUpgradePrice(upgrade.level);
  cleanupPreservedCardUids();
  updateView();
  saveState();
});

elements.buyWormholeEngine.addEventListener("click", () => {
  const upgrade = state.darkMatterShop.wormholeEngine;
  if (!spendDarkMatter(upgrade.price)) {
    return;
  }
  playUpgradeSound();
  upgrade.level += 1;
  upgrade.price = raiseDarkMatterPrice(upgrade.price);
  updateView();
  saveState();
});

elements.buyStardustGravity.addEventListener("click", () => {
  const upgrade = state.darkMatterShop.stardustGravity;
  if (!spendDarkMatter(upgrade.price)) {
    return;
  }
  playUpgradeSound();
  upgrade.level += 1;
  upgrade.price = raiseDarkMatterPrice(upgrade.price);
  updateView();
  saveState();
});

elements.buyFeverHighway.addEventListener("click", () => {
  const upgrade = state.darkMatterShop.feverHighway;
  if (!spendDarkMatter(upgrade.price)) {
    return;
  }
  playUpgradeSound();
  upgrade.level += 1;
  upgrade.price = raiseDarkMatterPrice(upgrade.price);
  updateView();
  saveState();
});

elements.achievementsToggle?.addEventListener("click", (event) => {
  event.stopPropagation();
  togglePanel(elements.achievementPanel, elements.achievementsToggle);
});

elements.dmLabToggle?.addEventListener("click", (event) => {
  event.stopPropagation();
  togglePanel(elements.darkMatterLab, elements.dmLabToggle);
});

elements.statsToggle?.addEventListener("click", (event) => {
  event.stopPropagation();
  togglePanel(elements.statPanel, elements.statsToggle);
});

elements.codexToggle?.addEventListener("click", (event) => {
  event.stopPropagation();
  togglePanel(elements.codexPanel, elements.codexToggle);
});

elements.inventoryToggle?.addEventListener("click", (event) => {
  event.stopPropagation();
  togglePanel(elements.inventoryPanel, elements.inventoryToggle);
});

elements.inventoryTabCards?.addEventListener("click", () => {
  setInventoryTabUi("cards");
});

elements.inventoryTabMerge?.addEventListener("click", () => {
  setInventoryTabUi("merge");
});

elements.preservationSlots?.addEventListener("click", (event) => {
  event.stopPropagation();
  const slotNode = event.target.closest(".preservation-slot.filled");
  if (!slotNode) {
    return;
  }
  const uid = Number(slotNode.getAttribute("data-preserve-uid"));
  if (!Number.isInteger(uid)) {
    return;
  }
  const result = toggleCardPreservation(uid);
  if (!result.ok && result.message) {
    showImpactToast(result.message);
    return;
  }
  refreshPreservationUi();
  saveState();
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Node)) {
    return;
  }

  const clickedAchievementUi =
    elements.achievementPanel?.contains(target) || elements.achievementsToggle?.contains(target);
  const clickedDmUi = elements.darkMatterLab?.contains(target) || elements.dmLabToggle?.contains(target);
  const clickedStatUi = elements.statPanel?.contains(target) || elements.statsToggle?.contains(target);
  const clickedCodexUi = elements.codexPanel?.contains(target) || elements.codexToggle?.contains(target);
  const clickedInventoryUi =
    elements.inventoryPanel?.contains(target) || elements.inventoryToggle?.contains(target);

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
    if (isRebirthConfirmOpen()) {
      closeRebirthConfirmModal(false);
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
elements.rebirthConfirmCancel.addEventListener("click", () => closeRebirthConfirmModal(false));
elements.rebirthConfirmAccept.addEventListener("click", () => closeRebirthConfirmModal(true));
elements.rebirthConfirmOverlay.addEventListener("click", (event) => {
  if (event.target === elements.rebirthConfirmOverlay) {
    closeRebirthConfirmModal(false);
  }
});

setInterval(() => {
  const feverActive = isFeverActive();
  wasFeverActiveLastTick = feverActive;
  checkAchievements();
  updateFeverLabel();
  updateLevelPanel();
}, 1000);

elements.growthLightHelpToggle?.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleGrowthLightHelp(elements.growthLightHelpToggle, elements.growthLightHelpText);
});

elements.growthLightHelpInventory?.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleGrowthLightHelp(elements.growthLightHelpInventory, elements.growthLightHelpInventoryText);
});

loadState();
wasFeverActiveLastTick = isFeverActive();
checkAchievements();
renderCardCodex();
updateAudioToggleUi();
setInventoryTabUi("cards");
updateBulkUpgradeUi();
updateView();
