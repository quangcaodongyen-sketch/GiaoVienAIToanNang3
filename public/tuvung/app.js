
// ==============================================================================
// KHO AVATAR GỢI Ý & ĐỊNH DẠNG NGÀY SINH HỌC SINH
// ==============================================================================
const PRESET_AVATARS = [
  { id: 'av_boy1', label: 'Nam sinh thông thái', icon: '👦', bg: 'linear-gradient(135deg, #0284c7, #38bdf8)' },
  { id: 'av_girl1', label: 'Nữ sinh thanh lịch', icon: '👧', bg: 'linear-gradient(135deg, #ec4899, #f472b6)' },
  { id: 'av_owl', label: 'Cú tri thức', icon: '🦉', bg: 'linear-gradient(135deg, #8b5cf6, #c084fc)' },
  { id: 'av_astro', label: 'Phi hành gia', icon: '👨‍🚀', bg: 'linear-gradient(135deg, #1e293b, #475569)' },
  { id: 'av_hero', label: 'Siêu nhân', icon: '🦸', bg: 'linear-gradient(135deg, #ef4444, #f87171)' },
  { id: 'av_top', label: 'Thủ khoa', icon: '🎖️', bg: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
  { id: 'av_fox', label: 'Cáo thông minh', icon: '🦊', bg: 'linear-gradient(135deg, #ea580c, #fb923c)' },
  { id: 'av_lion', label: 'Sư tử dũng cảm', icon: '🦁', bg: 'linear-gradient(135deg, #d97706, #fde047)' },
  { id: 'av_cat', label: 'Mèo con chăm học', icon: '🐱', bg: 'linear-gradient(135deg, #06b6d4, #67e8f9)' },
  { id: 'av_bear', label: 'Gấu chăm chỉ', icon: '🐻', bg: 'linear-gradient(135deg, #78350f, #b45309)' },
  { id: 'av_panda', label: 'Panda dễ thương', icon: '🐼', bg: 'linear-gradient(135deg, #334155, #94a3b8)' },
  { id: 'av_star', label: 'Ngôi sao sáng', icon: '⭐', bg: 'linear-gradient(135deg, #eab308, #fef08a)' }
];

function formatBirthDate(dStr) {
  if (!dStr) return '';
  if (dStr.includes('-')) {
    const parts = dStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }
  return dStr;
}

/**
 * ENG 12 VOCAB MASTER - APPLICATION LOGIC (ULTRA VIBRANT EDITION)
 * Tác giả: Thầy giáo Đinh Văn Thành (THCS Đồng Yên)
 * Bám sát SGK Tiếng Anh 12 Global Success
 */

// ==============================================================================
// 1. STATE & STORAGE MANAGEMENT
// ==============================================================================

// ==============================================================================
// 0. CORE ALGORITHMS: FISHER-YATES SHUFFLE & VIETNAMESE ABC PEDAGOGICAL SORTING
// ==============================================================================
function fisherYatesShuffle(array) {
  if (!array || !Array.isArray(array)) return [];
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getVietnameseLastName(fullName) {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  return parts.length > 0 ? parts[parts.length - 1] : '';
}

function compareVietnameseNames(nameA, nameB, ascending = true) {
  const lastA = getVietnameseLastName(nameA);
  const lastB = getVietnameseLastName(nameB);
  
  let cmp = lastA.localeCompare(lastB, 'vi', { sensitivity: 'base' });
  if (cmp === 0) {
    cmp = (nameA || '').localeCompare(nameB || '', 'vi', { sensitivity: 'base' });
  }
  return ascending ? cmp : -cmp;
}

function getStudentDiligence(student) {
  if (!student) return { stars: '⭐', label: 'Khởi động', color: '#94a3b8', bg: 'rgba(148,163,184,0.15)', border: 'rgba(148,163,184,0.3)', totalAttempts: 0, streak: 1 };
  
  const attempts = (student.quizHistory || []).length;
  const streak = student.streakDays || 1;
  const xp = student.xp || 50;
  
  if (attempts >= 10 || streak >= 5 || xp >= 600) {
    return { stars: '⭐⭐⭐', label: 'Rất chuyên cần', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.4)', totalAttempts: attempts, streak: streak };
  } else if (attempts >= 4 || streak >= 2 || xp >= 200) {
    return { stars: '⭐⭐', label: 'Chăm chỉ', color: '#38bdf8', bg: 'rgba(56,189,248,0.15)', border: 'rgba(56,189,248,0.4)', totalAttempts: attempts, streak: streak };
  } else {
    return { stars: '⭐', label: 'Khởi động', color: '#94a3b8', bg: 'rgba(148,163,184,0.15)', border: 'rgba(148,163,184,0.3)', totalAttempts: attempts, streak: streak };
  }
}


const STATE = {
  currentUnit: 1,
  currentWordIdx: 0,
  activeWords: [],
  isFlipped: false,
  autoPlayTimer: null,
  isAutoPlaying: false,
  preferredVoiceAccent: 'US', // 'US' or 'UK'
  
  // Storage data
  mastered: new Set(),
  review: new Set(),
  starred: new Set(),
  
  // Quiz state
  quiz: {
    questions: [],
    currentIdx: 0,
    score: 0,
    streak: 0,
    total: 10
  },
  
  // Match state
  match: {
    cards: [],
    selectedCard: null,
    matchedPairs: 0,
    totalPairs: 8,
    startTime: null,
    timerInterval: null
  },
  
  // Listen state
  listen: {
    questions: [],
    currentIdx: 0,
    score: 0,
    total: 10
  }
};

// CHANT MODE GLOBAL STATE
const STATE_CHANT = {
  currentWordIdx: 0,
  isPlaying: false,
  timerTimeout: null,
  speakVi: true,
  speakExample: true,
  loopAll: true,
  style: 'pop_funk',
  bpm: 110,
  volume: 0.8
};


// Load saved progress from LocalStorage
function loadProgress() {
  try {
    const saved = localStorage.getItem('ENG12_VOCAB_PROGRESS');
    if (saved) {
      const data = JSON.parse(saved);
      STATE.mastered = new Set(data.mastered || []);
      STATE.review = new Set(data.review || []);
      STATE.starred = new Set(data.starred || []);
    }
    const voicePref = localStorage.getItem('ENG12_VOICE_ACCENT');
    if (voicePref) STATE.preferredVoiceAccent = voicePref;
  } catch (e) {
    console.error('Error loading progress:', e);
  }
}

function saveProgress() {
  try {
    const data = {
      mastered: Array.from(STATE.mastered),
      review: Array.from(STATE.review),
      starred: Array.from(STATE.starred)
    };
    localStorage.setItem('ENG12_VOCAB_PROGRESS', JSON.stringify(data));
  } catch (e) {
    console.error('Error saving progress:', e);
  }
}

// ==============================================================================
// 2. WEB AUDIO SYNTHESIZER (SOUND EFFECTS CHIPTUNE)
// ==============================================================================
// ==============================================================================
// 2. WEB AUDIO SYNTHESIZER - ĐÃ TẮT HOÀN TOÀN TIẾNG TÚT TỤT CHÓI TAI
// Giữ lại 100% giọng phát âm chuẩn bản xứ của Giáo viên (SpeechEngine)
// ==============================================================================
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.muted = true; // Đã loại bỏ hoàn toàn tiếng kêu tút tụt theo yêu cầu của Thầy
  }
  
  init() {
    // Không khởi tạo AudioContext gây tiếng ồn
  }
  
  playTone(freq, type = 'sine', duration = 0.15, startVol = 0.2) {
    // Tắt bỏ hoàn toàn tiếng tút chói tai
    return;
  }
  
  playCorrect() {
    // Tắt bỏ tiếng kêu tút tụt khi làm đúng
    return;
  }
  
  playWrong() {
    // Tắt bỏ tiếng buzzer tút tụt khó chịu khi làm sai
    return;
  }
  
  playFlip() {
    // Tắt bỏ tiếng click tút khi lật thẻ
    return;
  }
  
  playMatchSuccess() {
    return;
  }
  
  playWin() {
    // Chỉ tạo hiệu ứng pháo hoa thị giác vui tươi, KHÔNG phát âm thanh tút tụt
    if (window.confetti) {
      try {
        window.confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      } catch (e) {}
    }
  }

  playIncorrect() {
    return;
  }
}

const SFX = new SoundEffects();

// ==============================================================================
// 3. WEB SPEECH SYNTHESIS ENGINE (PRONUNCIATION)
// ==============================================================================
// ==============================================================================
// 3. SYNCHRONOUS WEB SPEECH ENGINE - DÕNG DẠC, NGHE RÕ TỪNG ÂM TIẾT
// ==============================================================================
const SpeechEngine = {
  voices: [],
  isReady: false,
  activeUtterance: null,

  init() {
    if (!('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis not supported');
      return;
    }
    const loadVoices = () => {
      this.voices = window.speechSynthesis.getVoices();
      if (this.voices && this.voices.length > 0) {
        this.isReady = true;
      }
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Tự động unlock Audio & Speech ngay khi người dùng chạm vào màn hình (iOS / Android)
    const unlockAudio = () => {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        if (typeof SFX !== 'undefined' && SFX.ctx && SFX.ctx.state === 'suspended') {
          SFX.ctx.resume();
        }
      } catch (e) {}
    };
    window.addEventListener('touchstart', unlockAudio, { passive: true });
    window.addEventListener('touchend', unlockAudio, { passive: true });
    window.addEventListener('click', unlockAudio, { passive: true });
  },

  // TÌM GIỌNG ĐỌC THẬT DÕNG DẠC, UY LỰC, RÕ RÀNG TỪNG ÂM TIẾT IPA
  getBestVoice(langCode = 'en-US') {
    if (!this.voices || this.voices.length === 0) {
      if ('speechSynthesis' in window) {
        this.voices = window.speechSynthesis.getVoices();
      }
    }
    const voices = this.voices || [];

    // Ưu tiên danh sách giọng dõng dạc, phát âm tròn vành rõ chữ nhất (Guy, Christopher, Jenny, Aria, Google, Neural)
    const resonantKeywords = [
      'Guy Online (Natural)', 'Christopher Online (Natural)', 'Jenny Online (Natural)', 
      'Aria Online (Natural)', 'Guy', 'Christopher', 'Jenny', 'Aria',
      'Google US English', 'Google UK English Male', 'Natural', 'Neural', 
      'Samantha (Enhanced)', 'Daniel', 'Alex'
    ];

    const langPrefix = langCode.toLowerCase().slice(0, 2);

    // 1. Tìm giọng dõng dạc chuẩn ngôn ngữ (en-US hoặc en-GB)
    for (const name of resonantKeywords) {
      const match = voices.find(v => 
        v.lang.toLowerCase().startsWith(langPrefix) && 
        v.name.toLowerCase().includes(name.toLowerCase())
      );
      if (match) return match;
    }

    // 2. Tìm bất kỳ giọng dõng dạc tiếng Anh nào
    for (const name of resonantKeywords) {
      const match = voices.find(v => 
        v.lang.toLowerCase().startsWith('en') && 
        v.name.toLowerCase().includes(name.toLowerCase())
      );
      if (match) return match;
    }

    return voices.find(v => v.lang.toLowerCase().startsWith(langPrefix)) || null;
  },

  // TÌM GIỌNG TIẾNG VIỆT CHUẨN HÀ NỘI (MIỀN BẮC)
  getVietnameseHanoiVoice() {
    if (!this.voices || this.voices.length === 0) {
      if ('speechSynthesis' in window) {
        this.voices = window.speechSynthesis.getVoices();
      }
    }
    const voices = this.voices || [];

    // Ưu tiên các giọng chuẩn Hà Nội miền Bắc: Hoài My, Nam Minh, Linh, Google tiếng Việt
    const hanoiKeywords = [
      'HoaiMy Online (Natural)', 'NamMinh Online (Natural)', 'HoaiMy', 'NamMinh', 
      'Linh', 'Google tiếng Việt', 'vi-VN', 'Vietnamese'
    ];

    for (const kw of hanoiKeywords) {
      const match = voices.find(v => 
        v.lang.toLowerCase().startsWith('vi') && 
        v.name.toLowerCase().includes(kw.toLowerCase())
      );
      if (match) return match;
    }

    return voices.find(v => v.lang.toLowerCase().startsWith('vi')) || null;
  },

  // PHÁT ÂM TIẾNG ANH: TỐC ĐỘ 0.80x CHẬM RÃI, DÕNG DẠC, NGHE RÕ TỪNG ÂM TIẾT
  // KHẮC PHỤC TRIỆT ĐỂ LỖI CHROMIUM/EDGE CANCEL LÀM MẤT GIỌNG ĐỌC KHI BẤM CHỌN BÀI
  // PHÁT ÂM TIẾNG ANH: TỐC ĐỘ 0.78x CHẬM RÃI, TRÒN VÀNH RÕ CHỮ, KHÔNG NUỐT ÂM
  // PHÙ HỢP TUYỆT ĐỐI VỚI HỌC SINH THCS & THPT HỌC TIẾNG ANH
  speak(text, rate = 0.78, lang = null) {
    if (!text || !text.trim()) return;
    if (!('speechSynthesis' in window)) return;

    // Chuẩn hóa tốc độ đọc: Tuyệt đối không đọc vội vàng, nuốt âm
    // Mọi tốc độ > 0.80 được tự động điều chỉnh về 0.78x để đảm bảo người học nghe rõ từng âm tiết và ending sounds
    let effectiveRate = parseFloat(rate) || 0.78;
    if (effectiveRate > 0.80) {
      effectiveRate = 0.78;
    }
    if (effectiveRate < 0.55) {
      effectiveRate = 0.55;
    }

    try {
      if (window.speechSynthesis.paused) {
        try { window.speechSynthesis.resume(); } catch (e) {}
      }

      const doSpeak = () => {
        try {
          if (typeof SFX !== 'undefined' && SFX.playTone) {
            try { SFX.playTone(560, 'sine', 0.04, 0.06); } catch (e) {}
          }

          const utterance = new SpeechSynthesisUtterance(text.trim());
          utterance.rate = effectiveRate; // 0.78x: Chậm rãi, dõng dạc, tách bạch rõ ràng từng âm tiết và phụ âm đuôi // 0.80x: Dõng dạc, tách bạch rõ ràng từng âm tiết và phụ âm đuôi
          utterance.pitch = 1.0; // Cao độ tự nhiên, đĩnh đạc
          utterance.volume = 1.0; // Âm lượng tối đa, to rõ

          const targetLang = lang || (STATE.preferredVoiceAccent === 'UK' ? 'en-GB' : 'en-US');
          utterance.lang = targetLang;

          const voice = this.getBestVoice(targetLang);
          if (voice) utterance.voice = voice;

          window._activeSpeechUtterance = utterance;
          this.activeUtterance = utterance;

          if (typeof ChantBeatEngine !== 'undefined' && ChantBeatEngine.isPlaying) {
            ChantBeatEngine.duckBeat(true);
          }

          utterance.onend = () => {
            window._activeSpeechUtterance = null;
            this.activeUtterance = null;
            if (typeof ChantBeatEngine !== 'undefined' && ChantBeatEngine.isPlaying) {
              ChantBeatEngine.duckBeat(false);
            }
          };

          utterance.onerror = (err) => {
            if (err.error !== 'canceled') {
              console.warn('Speech utterance warning:', err.error);
            }
            window._activeSpeechUtterance = null;
            this.activeUtterance = null;
            if (typeof ChantBeatEngine !== 'undefined' && ChantBeatEngine.isPlaying) {
              ChantBeatEngine.duckBeat(false);
            }
          };

          window.speechSynthesis.speak(utterance);
        } catch (errInner) {
          console.error('SpeechEngine doSpeak error:', errInner);
        }
      };

      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        try { window.speechSynthesis.cancel(); } catch (e) {}
        // Chờ 60ms để IPC cancel hoàn tất trước khi đưa utterance mới vào queue
        setTimeout(doSpeak, 60);
      } else {
        doSpeak();
      }
    } catch (e) {
      console.error('SpeechEngine speak error:', e);
    }
  }
};

// ==============================================================================
// 4. UI INITIALIZATION & UNIT SELECTION
// ==============================================================================


// ĐỌC TÊN BÀI HỌC DÕNG DẠC KHI NGƯỜI DÙNG BẤM VÀO TÊN BÀI HOẶC BẤM UNIT PILL
function speakUnitTitle(unitNum) {
  const targetUnit = unitNum || STATE.currentUnit || 1;
  const unitObj = VOCABULARY_DATA.find(u => u.unit === targetUnit);
  if (!unitObj) return;

  const titleText = `Unit ${unitObj.unit}: ${unitObj.title}`;
  SpeechEngine.speak(titleText, 0.85);

  // Hiệu ứng phát sáng viền khi đang đọc tên bài
  const metaEl = document.getElementById('currentUnitMeta');
  const titleEl = document.getElementById('unitTitleDisplay');
  if (metaEl) {
    metaEl.classList.add('meta-speaking-glow');
    setTimeout(() => metaEl.classList.remove('meta-speaking-glow'), 1600);
  }
  if (titleEl) {
    titleEl.classList.add('title-speaking-glow');
    setTimeout(() => titleEl.classList.remove('title-speaking-glow'), 1600);
  }
}

function selectUnit(unitNum, shouldSpeakTitle = true) {
  STATE.currentUnit = unitNum;
  STATE.currentWordIdx = 0;
  STATE.isFlipped = false;
  stopAutoPlay();
  if (typeof pauseChant === 'function') pauseChant();
  
  const unitObj = VOCABULARY_DATA.find(u => u.unit === unitNum);
  if (unitObj) {
    STATE.activeWords = [...unitObj.words];
    
    const titleEl = document.getElementById('unitTitleDisplay');
    if (titleEl) titleEl.innerHTML = `🔊 <span>Unit ${unitObj.unit}: ${unitObj.title}</span>`;
    const badgeEl = document.getElementById('unitWordCountBadge');
    if (badgeEl) badgeEl.textContent = `${unitObj.word_count} từ`;
    
    document.querySelectorAll('.unit-pill').forEach((p, idx) => {
      p.classList.toggle('active', (idx + 1) === unitNum);
    });
    
    // BẤM CHỌN UNIT NÀO THÌ ĐỌC TÊN BÀI HỌC DÕNG DẠC:
    if (shouldSpeakTitle) {
      speakUnitTitle(unitNum);
    }
  }
  
  // Khởi tạo giao diện các tab an toàn (try-catch từng tab)
  try { renderFlashcard(); renderFullVocabList(); renderChantWordChips(); } catch (e) { console.error("renderFlashcard error:", e); }
  try { initQuiz(); } catch (e) { console.error("initQuiz error:", e); }
  try { initMatchGame(); } catch (e) { console.error("initMatchGame error:", e); }
  try { initListenGame(false); } catch (e) { console.error("initListenGame error:", e); }
  try { if (typeof initScrambleGame === 'function') initScrambleGame(false); } catch (e) { console.error("initScrambleGame error:", e); }
  try { if (typeof initChantGame === 'function') initChantGame(); } catch (e) { console.error("initChantGame error:", e); }
  try { if (typeof initBlitzGame === 'function') initBlitzGame(); } catch (e) { console.error("initBlitzGame error:", e); }
  try { if (typeof initSpellingGame === 'function') initSpellingGame(false); } catch (e) { console.error("initSpellingGame error:", e); }
  try { if (typeof initHangmanGame === 'function') initHangmanGame(); } catch (e) { console.error("initHangmanGame error:", e); }
  try { if (typeof initContextGame === 'function') initContextGame(); } catch (e) { console.error("initContextGame error:", e); }
  try { renderVocabularyHub(); } catch (e) { console.error("renderVocabularyHub error:", e); }

  // Auto reload whichever tab is currently active immediately with fresh unit words
  try {
    const curActivePane = document.querySelector('.tab-pane.active');
    const curTabId = curActivePane ? curActivePane.id : 'tab-flashcard';
    if (typeof window.activateTab === 'function') {
      window.activateTab(curTabId);
    }
  } catch(e) {}
}

// ==============================================================================
// 5. TAB 1: 3D FLASHCARD LOGIC
// ==============================================================================
function renderFlashcard() {
  if (!STATE.activeWords || STATE.activeWords.length === 0) return;
  const word = STATE.activeWords[STATE.currentWordIdx];
  if (!word) return;
  
  const stage = document.getElementById('flashcardStage');
  if (STATE.isFlipped) {
    stage.classList.add('flipped');
  } else {
    stage.classList.remove('flipped');
  }
  
  // Front face
  document.getElementById('cardWordTitle').textContent = word.word;
  document.getElementById('cardIpaText').textContent = word.ipa || '';
  document.getElementById('cardPosBadge').textContent = word.pos || 'từ';
  document.getElementById('cardAccentTag').textContent = `${STATE.preferredVoiceAccent} Accent`;
  
  // Back face
  document.getElementById('cardMeaningTitle').textContent = word.meaning;
  document.getElementById('cardExampleEn').textContent = `"${word.example}"`;
  document.getElementById('cardExampleVi').textContent = `"${word.example_vi}"`;
  document.getElementById('cardHintText').textContent = `💡 ${word.hint || 'Bám sát SGK 12'}`;
  document.getElementById('cardUnitTag').textContent = `Unit ${word.unit}`;
  
  // Counters & Progress
  document.getElementById('fcCurrentIdx').textContent = STATE.currentWordIdx + 1;
  document.getElementById('fcTotalCount').textContent = STATE.activeWords.length;
  const progressPercent = ((STATE.currentWordIdx + 1) / STATE.activeWords.length) * 100;
  document.getElementById('fcProgressFill').style.width = `${progressPercent}%`;
  
  // Star button state
  const starBtn = document.getElementById('cardStarBtn');
  if (STATE.starred.has(word.id)) {
    starBtn.style.color = '#fbbf24';
  } else {
    starBtn.style.color = 'var(--text-muted)';
  }
  
  // Status badge
  const statusBadge = document.getElementById('fcStatusBadge');
  if (STATE.mastered.has(word.id)) {
    statusBadge.innerHTML = '<span style="color: #34d399; font-weight:800; text-shadow: 0 0 10px rgba(52,211,153,0.5);">✅ ĐÃ THUỘC</span>';
  } else if (STATE.review.has(word.id)) {
    statusBadge.innerHTML = '<span style="color: #fbbf24; font-weight:800; text-shadow: 0 0 10px rgba(251,191,36,0.5);">⚠️ CẦN ÔN LẠI</span>';
  } else {
    statusBadge.innerHTML = '';
  }
}

function flipCard() {
  STATE.isFlipped = !STATE.isFlipped;
  SFX.playFlip();
  const stage = document.getElementById('flashcardStage');
  stage.classList.toggle('flipped', STATE.isFlipped);
}

function nextWord() {
  if (STATE.currentWordIdx < STATE.activeWords.length - 1) {
    STATE.currentWordIdx++;
  } else {
    STATE.currentWordIdx = 0;
  }
  STATE.isFlipped = false;
  renderFlashcard();
  if (typeof updateActiveVocabRow === 'function') updateActiveVocabRow();
}

function prevWord() {
  if (STATE.currentWordIdx > 0) {
    STATE.currentWordIdx--;
  } else {
    STATE.currentWordIdx = STATE.activeWords.length - 1;
  }
  STATE.isFlipped = false;
  renderFlashcard();
  if (typeof updateActiveVocabRow === 'function') updateActiveVocabRow();
}

function toggleShuffle() {
  for (let i = STATE.activeWords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [STATE.activeWords[i], STATE.activeWords[j]] = [STATE.activeWords[j], STATE.activeWords[i]];
  }
  STATE.currentWordIdx = 0;
  STATE.isFlipped = false;
  renderFlashcard();
  SFX.playTone(600, 'triangle', 0.12);
}

function toggleAutoPlay() {
  const btn = document.getElementById('fcAutoPlayBtn');
  if (STATE.isAutoPlaying) {
    stopAutoPlay();
  } else {
    STATE.isAutoPlaying = true;
    btn.classList.add('active');
    btn.innerHTML = '⏸️';
    runAutoPlayStep();
  }
}

function stopAutoPlay() {
  STATE.isAutoPlaying = false;
  if (STATE.autoPlayTimer) clearTimeout(STATE.autoPlayTimer);
  const btn = document.getElementById('fcAutoPlayBtn');
  if (btn) {
    btn.classList.remove('active');
    btn.innerHTML = '▶️';
  }
}

function runAutoPlayStep() {
  if (!STATE.isAutoPlaying) return;
  const currentWord = STATE.activeWords[STATE.currentWordIdx];
  if (!currentWord) return;
  
  SpeechEngine.speak(currentWord.word, 0.78);
  
  STATE.autoPlayTimer = setTimeout(() => {
    if (!STATE.isAutoPlaying) return;
    flipCard();
    
    STATE.autoPlayTimer = setTimeout(() => {
      if (!STATE.isAutoPlaying) return;
      SpeechEngine.speak(currentWord.example, 0.75);
      
      STATE.autoPlayTimer = setTimeout(() => {
        if (!STATE.isAutoPlaying) return;
        nextWord();
        runAutoPlayStep();
      }, 3500);
    }, 1500);
  }, 2000);
}

// ==============================================================================
// 6. TAB 2: SPEED QUIZ GAME LOGIC
// ==============================================================================
function initQuiz() {
  const playArea = document.getElementById('quizPlayArea');
  const finishedView = document.getElementById('quizFinishedView');
  if (playArea) playArea.style.display = 'block';
  if (finishedView) finishedView.style.display = 'none';

  let words = [...STATE.activeWords]; // 100% bam sat Unit SGK
  if (!words || words.length === 0) return;
  
  const shuffled = fisherYatesShuffle(words);
  STATE.quiz.questions = shuffled.slice(0, Math.min(10, shuffled.length));
  STATE.quiz.currentIdx = 0;
  STATE.quiz.score = 0;
  STATE.quiz.streak = 0;
  STATE.quiz.total = STATE.quiz.questions.length;
  
  const scoreEl = document.getElementById('quizScoreVal');
  const streakEl = document.getElementById('quizStreakVal');
  const totalEl = document.getElementById('quizTotalQ');
  if (scoreEl) scoreEl.textContent = '0';
  if (streakEl) streakEl.textContent = '0';
  if (totalEl) totalEl.textContent = String(STATE.quiz.total);
  
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const q = STATE.quiz.questions[STATE.quiz.currentIdx];
  if (!q) {
    showQuizFinished();
    return;
  }
  
  document.getElementById('quizQIdx').textContent = STATE.quiz.currentIdx + 1;
  const progressPct = ((STATE.quiz.currentIdx) / STATE.quiz.total) * 100;
  document.getElementById('quizProgressFill').style.width = `${progressPct}%`;
  
  document.getElementById('quizPromptWord').textContent = q.word;
  document.getElementById('quizPromptIpa').textContent = q.ipa;
  
  const allOtherWords = STATE.activeWords.filter(w => w.id !== q.id);
  const distractors = fisherYatesShuffle(allOtherWords).slice(0, 3);
  const options = fisherYatesShuffle([q, ...distractors]);
  
  const grid = document.getElementById('quizOptionsGrid');
  grid.innerHTML = '';
  
  const prefixes = ['A', 'B', 'C', 'D'];
  options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.innerHTML = `<span class="opt-prefix">${prefixes[idx]}</span> <span>${opt.meaning}</span>`;
    btn.addEventListener('click', () => handleQuizAnswer(opt.id === q.id, btn, q.id));
    grid.appendChild(btn);
  });
}

function handleQuizAnswer(isCorrect, clickedBtn, correctId) {
  const grid = document.getElementById('quizOptionsGrid');
  const allBtns = grid.querySelectorAll('.quiz-option-btn');
  allBtns.forEach(b => b.disabled = true);
  
  if (isCorrect) {
    clickedBtn.classList.add('correct');
    SFX.playCorrect();
    STATE.quiz.streak++;
    const points = 10 + (STATE.quiz.streak > 1 ? (STATE.quiz.streak - 1) * 5 : 0);
    STATE.quiz.score += points;
    document.getElementById('quizScoreVal').textContent = STATE.quiz.score;
    document.getElementById('quizStreakVal').textContent = STATE.quiz.streak;
    STATE.mastered.add(correctId);
    STATE.review.delete(correctId);
    saveProgress();
  } else {
    clickedBtn.classList.add('wrong');
    SFX.playWrong();
    STATE.quiz.streak = 0;
    document.getElementById('quizStreakVal').textContent = '0';
    STATE.review.add(correctId);
    saveProgress();
    
    allBtns.forEach(b => {
      const optWord = STATE.activeWords.find(w => w.id === correctId);
      if (optWord && b.textContent.includes(optWord.meaning)) {
        b.classList.add('correct');
      }
    });
  }
  
  setTimeout(() => {
    STATE.quiz.currentIdx++;
    renderQuizQuestion();
  }, 1200);
}

function showQuizFinished() {
  const playArea = document.getElementById('quizPlayArea');
  const finishedView = document.getElementById('quizFinishedView');
  const scoreText = document.getElementById('quizFinishedScoreText');
  if (playArea) playArea.style.display = 'none';
  if (finishedView) finishedView.style.display = 'block';
  if (scoreText) scoreText.textContent = `Tổng điểm đạt được: ${STATE.quiz.score} điểm`;

  SFX.playWin();
  launchConfetti();
  
  const totalQ = STATE.quiz.total || 10;
  const correctCount = Math.min(totalQ, Math.round(STATE.quiz.score / 10));
  if (typeof STUDENT_SYSTEM !== 'undefined' && STUDENT_SYSTEM.recordExerciseResult) {
    STUDENT_SYSTEM.recordExerciseResult(STATE.currentUnit, 'Trắc Nghiệm (4 Lựa Chọn)', correctCount, totalQ, STATE.quiz.score);
  }
}

// ==============================================================================
// 7. TAB 3: WORD MATCHING MEMORY GAME LOGIC (ULTRA VIBRANT)
// ==============================================================================
function initMatchGame() {
  const board = document.getElementById('matchGameBoard');
  const banner = document.getElementById('matchFinishedBanner');
  if (board) board.style.display = 'grid';
  if (banner) banner.style.display = 'none';

  let words = [...STATE.activeWords]; // 100% bam sat Unit SGK
  if (!words || words.length === 0) return;
  
  const chosenWords = words.sort(() => 0.5 - Math.random()).slice(0, 8);
  STATE.match.totalPairs = chosenWords.length;
  STATE.match.matchedPairs = 0;
  STATE.match.selectedCard = null;
  
  const matchedCountEl = document.getElementById('matchedCountVal');
  const totalMatchEl = document.getElementById('totalMatchPairs');
  if (matchedCountEl) matchedCountEl.textContent = '0';
  if (totalMatchEl) totalMatchEl.textContent = STATE.match.totalPairs;
  
  if (STATE.match.timerInterval) clearInterval(STATE.match.timerInterval);
  STATE.match.startTime = Date.now();
  const timerEl = document.getElementById('matchTimerVal');
  if (timerEl) timerEl.textContent = '00:00';
  
  STATE.match.timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - STATE.match.startTime) / 1000);
    const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const s = String(elapsed % 60).padStart(2, '0');
    if (timerEl) timerEl.textContent = `${m}:${s}`;
  }, 1000);
  
  const tiles = [];
  chosenWords.forEach(w => {
    tiles.push({ id: w.id, text: w.word, type: 'en', wordObj: w });
    tiles.push({ id: w.id, text: w.meaning, type: 'vi', wordObj: w });
  });
  
  tiles.sort(() => 0.5 - Math.random());
  
  if (!board) return;
  board.innerHTML = '';
  
  tiles.forEach((tile, index) => {
    const el = document.createElement('div');
    el.className = 'match-tile';
    el.textContent = tile.text;
    el.dataset.id = tile.id;
    el.dataset.type = tile.type;
    el.dataset.index = index;
    el.addEventListener('click', () => handleMatchTileClick(el, tile));
    board.appendChild(el);
  });
}

function handleMatchTileClick(el, tile) {
  if (el.classList.contains('matched')) return;
  
  // Hủy chọn nếu bấm lại chính thẻ đang chọn
  if (STATE.match.selectedCard && STATE.match.selectedCard.el === el) {
    el.classList.remove('selected');
    STATE.match.selectedCard = null;
    SFX.playTone(420, 'sine', 0.08);
    return;
  }
  
  // BẤM VÀO BẤT KỲ THẺ NÀO PHẢI PHÁT ÂM NGAY TỨC THÌ (CHẬM RÃI, RÕ RÀNG):
  const wordToSpeak = (tile.wordObj && tile.wordObj.word) ? tile.wordObj.word : (tile.type === 'en' ? tile.text : '');
  if (wordToSpeak) {
    SpeechEngine.speak(wordToSpeak, 0.78);
  }
  
  SFX.playFlip();
  
  if (!STATE.match.selectedCard) {
    STATE.match.selectedCard = { el, tile };
    el.classList.add('selected');
  } else {
    const prev = STATE.match.selectedCard;
    el.classList.add('selected');
    
    // Kiểm tra ghép đúng cặp từ
    if (prev.tile.id === tile.id && prev.tile.type !== tile.type) {
      // GHÉP ĐÚNG!
      setTimeout(() => {
        prev.el.classList.remove('selected');
        el.classList.remove('selected');
        prev.el.classList.add('matched');
        el.classList.add('matched');
        SFX.playMatchSuccess();
        
        // Đọc lại từ vựng một lần nữa để học sinh ghi nhớ sâu
        if (tile.wordObj && tile.wordObj.word) {
          setTimeout(() => SpeechEngine.speak(tile.wordObj.word, 0.78), 250);
        }
        
        STATE.match.matchedPairs++;
        const countEl = document.getElementById('matchedCountVal');
        if (countEl) countEl.textContent = STATE.match.matchedPairs;
        STATE.mastered.add(tile.id);
        saveProgress();
        
        if (STATE.match.matchedPairs === STATE.match.totalPairs) {
          clearInterval(STATE.match.timerInterval);
          SFX.playWin();
          launchConfetti();
          setTimeout(() => {
            const timeStr = document.getElementById('matchTimerVal') ? document.getElementById('matchTimerVal').textContent : '';
            const board = document.getElementById('matchGameBoard');
            const banner = document.getElementById('matchFinishedBanner');
            const timeText = document.getElementById('matchFinishedTimeText');
            if (board) board.style.display = 'none';
            if (banner) banner.style.display = 'block';
            if (timeText) timeText.textContent = `Thời gian hoàn thành: ${timeStr} • Ghép chính xác ${STATE.match.totalPairs}/${STATE.match.totalPairs} cặp từ`;
            if (typeof STUDENT_SYSTEM !== 'undefined' && STUDENT_SYSTEM.recordExerciseResult) {
              STUDENT_SYSTEM.recordExerciseResult(STATE.currentUnit, 'Nối Từ (Word Matching)', STATE.match.totalPairs, STATE.match.totalPairs, 100);
            }
          }, 400);
        }
      }, 250);
      STATE.match.selectedCard = null;
    } else {
      // GHÉP SAI -> Rung lắc và trả về
      SFX.playWrong();
      prev.el.classList.add('shake');
      el.classList.add('shake');
      setTimeout(() => {
        prev.el.classList.remove('selected', 'shake');
        el.classList.remove('selected', 'shake');
      }, 550);
      STATE.match.selectedCard = null;
    }
  }
}

// ==============================================================================
// 8. TAB 4: LISTENING MASTER GAME LOGIC
// ==============================================================================
function initListenGame(autoSpeak = false) {
  const grid = document.getElementById('listenOptionsGrid');
  const banner = document.getElementById('listenFinishedBanner');
  if (grid) grid.style.display = 'grid';
  if (banner) banner.style.display = 'none';

  let words = [...STATE.activeWords]; // 100% bam sat Unit SGK
  if (!words || words.length === 0) return;
  
  const shuffled = words.sort(() => 0.5 - Math.random());
  STATE.listen.questions = shuffled.slice(0, Math.min(10, shuffled.length));
  STATE.listen.currentIdx = 0;
  STATE.listen.score = 0;
  STATE.listen.total = STATE.listen.questions.length;
  
  const scoreEl = document.getElementById('listenScoreVal');
  const totalEl = document.getElementById('listenTotalQ');
  if (scoreEl) scoreEl.textContent = '0';
  if (totalEl) totalEl.textContent = STATE.listen.total;
  
  renderListenQuestion(autoSpeak);
}

function renderListenQuestion(autoSpeak = false) {
  const q = STATE.listen.questions[STATE.listen.currentIdx];
  if (!q) {
    SFX.playWin();
    launchConfetti();
    const grid = document.getElementById('listenOptionsGrid');
    const banner = document.getElementById('listenFinishedBanner');
    const scoreText = document.getElementById('listenFinishedScoreText');
    if (grid) grid.style.display = 'none';
    if (banner) banner.style.display = 'block';
    if (scoreText) scoreText.textContent = `Điểm số đạt được: ${STATE.listen.score} điểm (${STATE.listen.total}/${STATE.listen.total} câu)`;
    if (typeof STUDENT_SYSTEM !== 'undefined' && STUDENT_SYSTEM.recordExerciseResult) {
      STUDENT_SYSTEM.recordExerciseResult(STATE.currentUnit, 'Luyện Nghe (Listening Master)', STATE.listen.total, STATE.listen.total, STATE.listen.score);
    }
    return;
  }
  
  const idxEl = document.getElementById('listenQIdx');
  if (idxEl) idxEl.textContent = STATE.listen.currentIdx + 1;
  
  // CHỈ tự động phát âm khi học sinh ĐANG Ở TRONG tab Luyện Nghe và autoSpeak = true
  const isListenActive = document.getElementById('tab-listen') && document.getElementById('tab-listen').classList.contains('active');
  if (autoSpeak && isListenActive) {
    setTimeout(() => {
      SpeechEngine.speak(q.word, 0.78);
    }, 300);
  }
  
  const otherWords = STATE.activeWords.filter(w => w.id !== q.id);
  const distractors = otherWords.sort(() => 0.5 - Math.random()).slice(0, 3);
  const options = [q, ...distractors].sort(() => 0.5 - Math.random());
  
  const grid = document.getElementById('listenOptionsGrid');
  grid.innerHTML = '';
  
  const prefixes = ['A', 'B', 'C', 'D'];
  options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.innerHTML = `<span class="opt-prefix">${prefixes[idx]}</span> <span style="font-size: 1.15rem; font-weight:800;">${opt.word}</span> <span style="font-size: 0.85rem; color: #a5b4fc; margin-left: auto;">${opt.pos}</span>`;
    btn.addEventListener('click', () => {
      const allBtns = grid.querySelectorAll('.quiz-option-btn');
      allBtns.forEach(b => b.disabled = true);
      
      if (opt.id === q.id) {
        btn.classList.add('correct');
        SFX.playCorrect();
        STATE.listen.score += 10;
        document.getElementById('listenScoreVal').textContent = STATE.listen.score;
      } else {
        btn.classList.add('wrong');
        SFX.playWrong();
        allBtns.forEach(b => {
          if (b.textContent.includes(q.word)) b.classList.add('correct');
        });
      }
      
      setTimeout(() => {
        STATE.listen.currentIdx++;
        renderListenQuestion(true);
      }, 1300);
    });
    grid.appendChild(btn);
  });
}

// ==============================================================================
// 9. TAB 5: VOCABULARY HUB (SỔ TAY TRA CỨU)
// ==============================================================================
function renderVocabularyHub() {
  const grid = document.getElementById('hubWordsGrid');
  if (!grid || typeof VOCABULARY_DATA === 'undefined') return;
  
  const searchTerm = (document.getElementById('hubSearchInput').value || '').trim().toLowerCase();
  const unitFilter = document.getElementById('hubUnitFilter').value;
  const statusFilter = document.getElementById('hubStatusFilter').value;
  
  let allWords = [];
  VOCABULARY_DATA.forEach(u => {
    if (unitFilter === 'all' || String(u.unit) === String(unitFilter)) {
      allWords.push(...u.words);
    }
  });
  
  const filtered = allWords.filter(w => {
    const matchSearch = !searchTerm || w.word.toLowerCase().includes(searchTerm) || w.meaning.toLowerCase().includes(searchTerm) || w.example.toLowerCase().includes(searchTerm);
    let matchStatus = true;
    if (statusFilter === 'starred') matchStatus = STATE.starred.has(w.id);
    else if (statusFilter === 'mastered') matchStatus = STATE.mastered.has(w.id);
    else if (statusFilter === 'review') matchStatus = STATE.review.has(w.id);
    return matchSearch && matchStatus;
  });
  
  document.getElementById('hubFoundCountText').textContent = `Hiển thị ${filtered.length} từ vựng`;
  grid.innerHTML = '';
  
  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">Không tìm thấy từ vựng nào khớp với bộ lọc.</div>`;
    return;
  }
  
  filtered.forEach(w => {
    const card = document.createElement('div');
    card.className = 'hub-word-card';
    const isStarred = STATE.starred.has(w.id);
    
    card.innerHTML = `
      <div class="hub-card-header">
        <div>
          <div class="hub-word-main">${w.word} <span class="card-pos-badge" style="font-size: 0.72rem; padding: 0.15rem 0.55rem;">${w.pos}</span></div>
          <div class="hub-word-ipa">${w.ipa}</div>
        </div>
        <button class="fc-icon-btn star-hub-btn" style="width: 34px; height: 34px; color: ${isStarred ? '#fbbf24' : 'var(--text-muted)'};" data-id="${w.id}">
          ⭐
        </button>
      </div>
      <div class="hub-card-body" style="font-size: 1.05rem; color: #34d399; font-weight: 800;">
        ${w.meaning}
      </div>
      <div class="hub-card-example" style="background: rgba(0,0,0,0.3); border-left: 3px solid #38bdf8; padding: 0.75rem 0.9rem; border-radius: 8px;">
        <div style="color: #fff; font-weight: 600;">${w.example}</div>
        <div style="font-style: italic; color: #94a3b8; margin-top: 0.25rem;">${w.example_vi}</div>
      </div>
      <div class="hub-card-footer" style="display: flex; align-items: center; justify-content: space-between; padding-top: 0.7rem; border-top: 1px solid rgba(255,255,255,0.08);">
        <span style="font-size: 0.8rem; font-weight: 700; color: #a5b4fc;">Unit ${w.unit}</span>
        <button class="btn-pronounce btn-slow speak-hub-btn" data-word="${w.word}" style="padding: 0.35rem 0.9rem; font-size: 0.82rem;">
          🔊 Nghe đọc
        </button>
      </div>
    `;
    
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target.closest('.star-hub-btn')) return;
      SpeechEngine.speak(w.word, 0.78);
    });
    
    card.querySelector('.speak-hub-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      SpeechEngine.speak(w.word, 0.78);
    });
    
    card.querySelector('.star-hub-btn').addEventListener('click', (e) => {
      if (STATE.starred.has(w.id)) {
        STATE.starred.delete(w.id);
        e.currentTarget.style.color = 'var(--text-muted)';
      } else {
        STATE.starred.add(w.id);
        e.currentTarget.style.color = '#fbbf24';
      }
      saveProgress();
    });
    
    grid.appendChild(card);
  });
}

// ==============================================================================
// 10. MODAL DIALOGS & PROGRESS STATS
// ==============================================================================
function updateStatsModal() {
  document.getElementById('statsMasteredNum').textContent = STATE.mastered.size;
  document.getElementById('statsReviewNum').textContent = STATE.review.size;
  
  const list = document.getElementById('statsUnitsProgressList');
  list.innerHTML = '';
  
  VOCABULARY_DATA.forEach(u => {
    const unitWordIds = u.words.map(w => w.id);
    const masteredCount = unitWordIds.filter(id => STATE.mastered.has(id)).length;
    const pct = Math.round((masteredCount / u.words.length) * 100);
    
    const row = document.createElement('div');
    row.style.background = 'rgba(255,255,255,0.06)';
    row.style.padding = '0.7rem 0.9rem';
    row.style.borderRadius = '10px';
    row.innerHTML = `
      <div style="display: flex; justify-content: space-between; font-size: 0.88rem; font-weight: 700; margin-bottom: 0.35rem;">
        <span>Unit ${u.unit}: ${u.title}</span>
        <span style="color: #38bdf8;">${masteredCount}/${u.words.length} (${pct}%)</span>
      </div>
      <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
        <div style="width: ${pct}%; height: 100%; background: linear-gradient(90deg, #ec4899, #38bdf8, #10b981);"></div>
      </div>
    `;
    list.appendChild(row);
  });
}

function setupEventListeners() {

  // Header Admin & Share buttons
  const adminBtn = document.getElementById('openAdminModalBtn');
  if (adminBtn) adminBtn.addEventListener('click', () => { if (typeof ADMIN_SYSTEM !== 'undefined') ADMIN_SYSTEM.openAdminModal(); });
  const shareBtn = document.getElementById('openShareModalBtn');
  if (shareBtn) shareBtn.addEventListener('click', () => { if (typeof SHARE_SYSTEM !== 'undefined') SHARE_SYSTEM.openShareModal(); });

  // ==============================================================================
  // BẤM VÀO TÊN BÀI HỌC Ở BẤT KỲ ĐÂU TRÊN MÀN HÌNH ĐỀU ĐỌC DÕNG DẠC TÊN BÀI:
  // ==============================================================================
  const currentUnitMeta = document.getElementById('currentUnitMeta');
  if (currentUnitMeta) {
    currentUnitMeta.style.cursor = 'pointer';
    currentUnitMeta.title = 'Bấm để nghe đọc tên bài học';
    currentUnitMeta.addEventListener('click', () => speakUnitTitle(STATE.currentUnit));
  }
  const unitTitleDisplay = document.getElementById('unitTitleDisplay');
  if (unitTitleDisplay) {
    unitTitleDisplay.style.cursor = 'pointer';
    unitTitleDisplay.title = 'Bấm để nghe đọc tên bài học';
    unitTitleDisplay.addEventListener('click', (e) => {
      e.stopPropagation();
      speakUnitTitle(STATE.currentUnit);
    });
  }
  const fullVocabSectionTitle = document.getElementById('fullVocabSectionTitle');
  if (fullVocabSectionTitle) {
    fullVocabSectionTitle.style.cursor = 'pointer';
    fullVocabSectionTitle.title = 'Bấm để nghe đọc tên bài học';
    fullVocabSectionTitle.addEventListener('click', () => speakUnitTitle(STATE.currentUnit));
  }
  const cardUnitTag = document.getElementById('cardUnitTag');
  if (cardUnitTag) {
    cardUnitTag.style.cursor = 'pointer';
    cardUnitTag.title = 'Bấm để nghe đọc tên bài học';
    cardUnitTag.addEventListener('click', (e) => {
      e.stopPropagation();
      speakUnitTitle(STATE.currentUnit);
    });
  }


  // Scramble game controls (ALL BUTTONS 100% ACTIVE & RESPONSIVE)
  const scrambleResetBtn = document.getElementById('scrambleResetBtn');
  if (scrambleResetBtn) scrambleResetBtn.addEventListener('click', resetScrambleCurrentWord);
  const scrambleHintBtn = document.getElementById('scrambleHintBtn');
  if (scrambleHintBtn) scrambleHintBtn.addEventListener('click', giveScrambleHint);
  const restartScrambleBtn = document.getElementById('restartScrambleBtn');
  if (restartScrambleBtn) restartScrambleBtn.addEventListener('click', () => initScrambleGame(false));

  const scramblePeekBtn = document.getElementById('scramblePeekBtn');
  if (scramblePeekBtn) {
    scramblePeekBtn.addEventListener('click', () => {
      const banner = document.getElementById('scramblePeekBanner');
      if (banner) {
        const isHidden = banner.style.display === 'none' || !banner.style.display;
        banner.style.display = isHidden ? 'block' : 'none';
        scramblePeekBtn.classList.toggle('active', isHidden);
      }
    });
  }

  const scrambleHearBtn = document.getElementById('scrambleHearBtn');
  if (scrambleHearBtn) {
    scrambleHearBtn.addEventListener('click', () => {
      const w = STATE.scramble.currentWordObj;
      if (w) SpeechEngine.speak(w.word, 0.78);
    });
  }

  const scrambleNextBtn = document.getElementById('scrambleNextBtn');
  if (scrambleNextBtn) {
    scrambleNextBtn.addEventListener('click', () => {
      if (STATE.scramble.currentIdx < STATE.scramble.words.length - 1) {
        STATE.scramble.currentIdx++;
        loadScrambleWord(false);
      } else {
        showScrambleCompleted();
      }
    });
  }

  // Click-to-speak on Flashcard English Word & IPA directly
  const cardWordTitle = document.getElementById('cardWordTitle');
  if (cardWordTitle) {
    cardWordTitle.style.cursor = 'pointer';
    cardWordTitle.title = 'Bấm để nghe phát âm chuẩn của từ này';
    cardWordTitle.addEventListener('click', (e) => {
      e.stopPropagation();
      const w = STATE.activeWords[STATE.currentWordIdx];
      if (w) SpeechEngine.speak(w.word, 0.78);
    });
  }
  const cardIpaText = document.getElementById('cardIpaText');
  if (cardIpaText) {
    cardIpaText.style.cursor = 'pointer';
    cardIpaText.title = 'Bấm để nghe phát âm chuẩn của từ này';
    cardIpaText.addEventListener('click', (e) => {
      e.stopPropagation();
      const w = STATE.activeWords[STATE.currentWordIdx];
      if (w) SpeechEngine.speak(w.word, 0.78);
    });
  }

  // Universal Responsive Fast Tab Switcher
  window.activateTab = function(tabId) {
    if (typeof STUDENT_SYSTEM !== 'undefined' && !STUDENT_SYSTEM.currentStudent) {
      STUDENT_SYSTEM.enforceAuthGate();
      return;
    }
    if (!tabId) tabId = 'tab-flashcard';
    
    // 1. Update Buttons & Panes active state
    document.querySelectorAll('.mode-tab-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tabId);
    });
    document.querySelectorAll('.tab-pane').forEach(p => {
      p.classList.toggle('active', p.id === tabId);
    });

    // 2. Cancel timers / pause speech of background tabs
    if (tabId !== 'tab-flashcard') stopAutoPlay();
    if (tabId !== 'tab-chant' && typeof pauseChant === 'function') pauseChant();
    if (tabId !== 'tab-blitz' && STATE.blitz && STATE.blitz.timerInterval) {
      clearInterval(STATE.blitz.timerInterval);
    }
    if (tabId !== 'tab-match' && STATE.match && STATE.match.timerInterval) {
      clearInterval(STATE.match.timerInterval);
    }

    // 3. Immediately launch and refresh the selected tab's functionality
    try {
      switch(tabId) {
        case 'tab-flashcard':
          renderFlashcard();
          if (typeof renderFullVocabList === 'function') renderFullVocabList();
          break;
        case 'tab-chant':
          if (typeof initChantGame === 'function') initChantGame();
          if (typeof renderChantWordChips === 'function') renderChantWordChips();
          break;
        case 'tab-scramble':
          if (typeof initScrambleGame === 'function') initScrambleGame(false);
          break;
        case 'tab-blitz':
          if (typeof initBlitzGame === 'function') initBlitzGame();
          break;
        case 'tab-spelling':
          if (typeof initSpellingGame === 'function') initSpellingGame(false);
          const spInp = document.getElementById('spellingInput');
          if (spInp) setTimeout(() => spInp.focus(), 150);
          break;
        case 'tab-hangman':
          if (typeof initHangmanGame === 'function') initHangmanGame();
          break;
        case 'tab-context':
          if (typeof initContextGame === 'function') initContextGame();
          break;
        case 'tab-quiz':
          if (typeof initQuiz === 'function') initQuiz();
          break;
        case 'tab-match':
          if (typeof initMatchGame === 'function') initMatchGame();
          break;
        case 'tab-listen':
          if (typeof initListenGame === 'function') initListenGame(false);
          break;
        case 'tab-hub':
          if (typeof renderVocabularyHub === 'function') renderVocabularyHub();
          break;
        case 'tab-minitest':
          if (typeof MINITEST_SYSTEM !== 'undefined') MINITEST_SYSTEM.init();
          break;
        case 'tab-weakwords':
          if (typeof WEAKWORDS_SYSTEM !== 'undefined') WEAKWORDS_SYSTEM.renderTab();
          break;
      }
    } catch(err) {
      console.error(`Error activating tab ${tabId}:`, err);
    }
  };

  document.querySelectorAll('.mode-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      window.activateTab(btn.dataset.tab);
    });
  });
  
  // Flashcard controls
  document.getElementById('flashcardStage').addEventListener('click', flipCard);
  
  // Bấm trực tiếp vào chữ tiếng Anh hoặc phiên âm trên thẻ để đọc thành tiếng ngay:
  const wordTitleEl = document.getElementById('cardWordTitle');
  if (wordTitleEl) {
    wordTitleEl.style.cursor = 'pointer';
    wordTitleEl.title = 'Bấm để nghe phát âm từ này';
    wordTitleEl.addEventListener('click', (e) => {
      e.stopPropagation();
      const w = STATE.activeWords[STATE.currentWordIdx];
      if (w) SpeechEngine.speak(w.word, 0.78);
    });
  }
  
  const ipaEl = document.getElementById('cardIpaText');
  if (ipaEl) {
    ipaEl.style.cursor = 'pointer';
    ipaEl.title = 'Bấm để nghe phát âm từ này';
    ipaEl.addEventListener('click', (e) => {
      e.stopPropagation();
      const w = STATE.activeWords[STATE.currentWordIdx];
      if (w) SpeechEngine.speak(w.word, 0.78);
    });
  }
  document.getElementById('fcFlipBtn').addEventListener('click', flipCard);
  document.getElementById('fcNextBtn').addEventListener('click', nextWord);
  document.getElementById('fcPrevBtn').addEventListener('click', prevWord);
  document.getElementById('fcShuffleBtn').addEventListener('click', toggleShuffle);
  document.getElementById('fcAutoPlayBtn').addEventListener('click', toggleAutoPlay);
  
  // Pronounce buttons
  document.getElementById('btnPronounceNormal').addEventListener('click', (e) => {
    e.stopPropagation();
    const w = STATE.activeWords[STATE.currentWordIdx];
    if (w) SpeechEngine.speak(w.word, 0.78);
  });
  document.getElementById('btnPronounceSlow').addEventListener('click', (e) => {
    e.stopPropagation();
    const w = STATE.activeWords[STATE.currentWordIdx];
    if (w) SpeechEngine.speak(w.word, 0.65);
  });
  document.getElementById('btnSpeakSentence').addEventListener('click', (e) => {
    e.stopPropagation();
    const w = STATE.activeWords[STATE.currentWordIdx];
    if (w) SpeechEngine.speak(w.example, 0.75);
  });
  
  // Voice toggle US / UK
  document.getElementById('fcVoiceSettingBtn').addEventListener('click', () => {
    STATE.preferredVoiceAccent = STATE.preferredVoiceAccent === 'US' ? 'UK' : 'US';
    localStorage.setItem('ENG12_VOICE_ACCENT', STATE.preferredVoiceAccent);
    document.getElementById('cardAccentTag').textContent = `${STATE.preferredVoiceAccent} Accent`;
    SFX.playTone(700, 'sine', 0.1);
    const w = STATE.activeWords[STATE.currentWordIdx];
    if (w) SpeechEngine.speak(w.word, 0.78);
  });
  
  // Star current word
  document.getElementById('cardStarBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    const w = STATE.activeWords[STATE.currentWordIdx];
    if (!w) return;
    if (STATE.starred.has(w.id)) {
      STATE.starred.delete(w.id);
    } else {
      STATE.starred.add(w.id);
      SFX.playTone(880, 'triangle', 0.15);
    }
    saveProgress();
    renderFlashcard();
  });
  
  // Mastery actions
  document.getElementById('btnMarkMastered').addEventListener('click', () => {
    const w = STATE.activeWords[STATE.currentWordIdx];
    if (!w) return;
    STATE.mastered.add(w.id);
    STATE.review.delete(w.id);
    saveProgress();
    SFX.playCorrect();
    renderFlashcard();
    setTimeout(nextWord, 350);
  });
  document.getElementById('btnMarkReview').addEventListener('click', () => {
    const w = STATE.activeWords[STATE.currentWordIdx];
    if (!w) return;
    STATE.review.add(w.id);
    STATE.mastered.delete(w.id);
    saveProgress();
    SFX.playWrong();
    renderFlashcard();
    setTimeout(nextWord, 350);
  });
  
  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    // NEVER intercept keys when typing in input, textarea, select or contenteditable
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT' || e.target.isContentEditable)) {
      return;
    }
    // NEVER intercept keys when any modal or dialog is open
    if (document.querySelector('.custom-modal-overlay.active, .modal.show, #studentRegisterModalOverlay.active, #adminModalOverlay.active, #certificateCenterModalOverlay.active, #certificateModalOverlay.active, #smartImportModalOverlay.active, #weakWordsModalOverlay.active')) {
      return;
    }

    const activeTab = document.querySelector('.tab-pane.active');
    if (activeTab && activeTab.id === 'tab-flashcard') {
      if (e.code === 'Space') {
        e.preventDefault();
        flipCard();
      } else if (e.code === 'ArrowRight') {
        nextWord();
      } else if (e.code === 'ArrowLeft') {
        prevWord();
      } else if (e.key === 's' || e.key === 'S') {
        const w = STATE.activeWords[STATE.currentWordIdx];
        if (w) SpeechEngine.speak(w.word, 0.78);
      } else if (e.key === 'm' || e.key === 'M') {
        document.getElementById('btnMarkMastered').click();
      }
    }
  });
  
  // Quiz prompt audio button
  document.getElementById('quizAudioPromptBtn').addEventListener('click', () => {
    const q = STATE.quiz.questions[STATE.quiz.currentIdx];
    if (q) SpeechEngine.speak(q.word, 0.78);
  });
  
  // Match game restart
  document.getElementById('restartMatchBtn').addEventListener('click', initMatchGame);
  
  // Listen game prompt
  document.getElementById('listenPlayBigBtn').addEventListener('click', () => {
    const q = STATE.listen.questions[STATE.listen.currentIdx];
    if (q) {
      document.getElementById('listenPlayBigBtn').classList.add('speaking');
      SpeechEngine.speak(q.word, 0.78);
      setTimeout(() => {
        document.getElementById('listenPlayBigBtn').classList.remove('speaking');
      }, 1000);
    }
  });
  
  // Hub filters
  document.getElementById('hubSearchInput').addEventListener('input', renderVocabularyHub);
  document.getElementById('hubUnitFilter').addEventListener('change', renderVocabularyHub);
  document.getElementById('hubStatusFilter').addEventListener('change', renderVocabularyHub);
  document.getElementById('hubPrintBtn').addEventListener('click', () => window.print());
  
  // Modals
  const qrModal = document.getElementById('qrModalOverlay');
  const statsModal = document.getElementById('statsModalOverlay');
  
  document.getElementById('openQrModalBtn').addEventListener('click', () => {
    const curUrl = window.location.href.startsWith('file:') 
      ? 'https://www.dekiemtraso.com/eng12_vocab/index.html' 
      : window.location.href;
    document.getElementById('currentUrlDisplay').textContent = curUrl;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(curUrl)}`;
    document.getElementById('qrImgElement').src = qrUrl;
    qrModal.classList.add('open');
  });
  document.getElementById('closeQrModalBtn').addEventListener('click', () => qrModal.classList.remove('open'));
  
  document.getElementById('statsModalBtn').addEventListener('click', () => {
    updateStatsModal();
    statsModal.classList.add('open');
  });
  document.getElementById('closeStatsModalBtn').addEventListener('click', () => statsModal.classList.remove('open'));
  
  document.getElementById('resetProgressBtn').addEventListener('click', () => {
    if (confirm('Thầy/Cô và các em có chắc muốn đặt lại toàn bộ tiến độ học tập?')) {
      STATE.mastered.clear();
      STATE.review.clear();
      STATE.starred.clear();
      saveProgress();
      updateStatsModal();
      renderFlashcard();
      renderVocabularyHub();
    }
  });
  
  // Theme toggle handled by THEME_SYSTEM
  const themeBtn = document.getElementById('themePaletteBtn');
  if (themeBtn) themeBtn.addEventListener('click', (e) => THEME_SYSTEM.togglePalette(e));
  
  window.addEventListener('click', (e) => {
    if (e.target === qrModal) qrModal.classList.remove('open');
    if (e.target === statsModal) statsModal.classList.remove('open');
  });
}

// ==============================================================================
// (startApp moved to bottom of file)



// ==============================================================================
// 10. EXTRA PRACTICE MODES
// ==============================================================================

// --- MODE A: SPEED BLITZ (TRUE / FALSE) ---
STATE.blitz = {
  questions: [],
  currentIdx: 0,
  score: 0,
  streak: 0,
  correctCount: 0,
  totalQuestions: 0,
  timerInterval: null,
  timeLeft: 6,
  maxTime: 6
};

function initBlitzGame() {
  const playArea = document.getElementById('blitzPlayArea');
  const finishedView = document.getElementById('blitzFinishedView');
  if (playArea) playArea.style.display = 'block';
  if (finishedView) finishedView.style.display = 'none';

  if (!STATE.activeWords || STATE.activeWords.length === 0) return;
  clearInterval(STATE.blitz.timerInterval);
  
  // Tối đa 12 từ, tối thiểu 4 từ
  // Tăng số lượng câu hỏi đúng/sai: Mặc định từ 20 đến 30 câu (hoặc toàn bộ từ vựng của bài)
  let wordPool = [...STATE.activeWords];
  // 100% bam sat SGK Unit
  const totalCount = wordPool.length;
  
  // 1. Dùng thuật toán Fisher-Yates để đảo từ ngẫu nhiên tuyệt đối mỗi lần làm
  const shuffledWords = fisherYatesShuffle(typeof wordPool !== 'undefined' ? wordPool : STATE.activeWords).slice(0, totalCount);
  
  // 2. Tạo tập đáp án boolean cân bằng 50% TRUE - 50% FALSE ngẫu nhiên
  const half = Math.floor(shuffledWords.length / 2);
  const bools = [];
  for (let i = 0; i < shuffledWords.length; i++) {
    bools.push(i < half);
  }
  
  // Xáo trộn đáp án boolean bằng Fisher-Yates, khống chế không để chuỗi 3 câu giống nhau liên tiếp
  let randomizedBools = fisherYatesShuffle(bools);
  for (let attempts = 0; attempts < 15; attempts++) {
    let hasStreakOf3 = false;
    for (let i = 0; i < randomizedBools.length - 2; i++) {
      if (randomizedBools[i] === randomizedBools[i+1] && randomizedBools[i+1] === randomizedBools[i+2]) {
        hasStreakOf3 = true;
        break;
      }
    }
    if (!hasStreakOf3) break;
    randomizedBools = fisherYatesShuffle(bools);
  }

  // 3. Nguồn từ để gán nghĩa sai: lấy từ bài học hiện tại + toàn khối sách nếu bài ít từ
  let distractorPool = STATE.activeWords;
  
  // 4. Sinh bộ câu hỏi với nghĩa đảo ngẫu nhiên mỗi lần chơi
  const questions = shuffledWords.map((w, idx) => {
    const isTrue = randomizedBools[idx];
    let displayedMeaning = w.meaning;
    
    if (!isTrue) {
      // Lấy ngẫu nhiên nghĩa của từ khác biệt hoàn toàn
      const others = distractorPool.filter(o => o.word.toLowerCase() !== w.word.toLowerCase() && o.meaning !== w.meaning);
      if (others.length > 0) {
        const wrongWord = others[Math.floor(Math.random() * others.length)];
        displayedMeaning = wrongWord.meaning;
      } else {
        displayedMeaning = "Nghĩa tiếng Việt không chính xác";
      }
    }
    
    return {
      word: w.word,
      ipa: w.ipa || '',
      pos: w.pos || 'từ',
      displayedMeaning: displayedMeaning,
      isCorrect: isTrue,
      actualWord: w
    };
  });
  
  // 5. Đảo toàn bộ thứ tự câu hỏi bằng Fisher-Yates
  STATE.blitz.questions = fisherYatesShuffle(questions);
  STATE.blitz.currentIdx = 0;
  STATE.blitz.score = 0;
  STATE.blitz.streak = 0;
  STATE.blitz.correctCount = 0;
  STATE.blitz.totalQuestions = STATE.blitz.questions.length;
  
  const scoreEl = document.getElementById('blitzScoreVal');
  const streakEl = document.getElementById('blitzStreakVal');
  const totalEl = document.getElementById('blitzTotalQ');
  if (scoreEl) scoreEl.textContent = '0';
  if (streakEl) streakEl.textContent = '0';
  if (totalEl) totalEl.textContent = STATE.blitz.questions.length;
  
  renderBlitzQuestion();
}

function renderBlitzQuestion() {
  clearInterval(STATE.blitz.timerInterval);
  const q = STATE.blitz.questions[STATE.blitz.currentIdx];
  if (!q) {
    showBlitzFinished();
    return;
  }
  
  const idxEl = document.getElementById('blitzQIdx');
  if (idxEl) idxEl.textContent = STATE.blitz.currentIdx + 1;
  
  const wordEl = document.getElementById('blitzWord');
  const ipaEl = document.getElementById('blitzIpa');
  const meaningEl = document.getElementById('blitzMeaning');
  if (wordEl) wordEl.textContent = q.word;
  if (ipaEl) ipaEl.textContent = q.ipa;
  if (meaningEl) meaningEl.textContent = q.displayedMeaning;
  
  // Timer bar reset
  STATE.blitz.timeLeft = STATE.blitz.maxTime;
  const timerFill = document.getElementById('blitzTimerFill');
  if (timerFill) timerFill.style.width = '100%';
  
  const intervalStep = 100;
  STATE.blitz.timerInterval = setInterval(() => {
    STATE.blitz.timeLeft -= (intervalStep / 1000);
    const pct = Math.max(0, (STATE.blitz.timeLeft / STATE.blitz.maxTime) * 100);
    if (timerFill) timerFill.style.width = pct + '%';
    
    if (STATE.blitz.timeLeft <= 0) {
      clearInterval(STATE.blitz.timerInterval);
      handleBlitzAnswer(null); // Time out
    }
  }, intervalStep);
}

function handleBlitzAnswer(userChoice) {
  clearInterval(STATE.blitz.timerInterval);
  const q = STATE.blitz.questions[STATE.blitz.currentIdx];
  if (!q) return;
  
  const isRight = (userChoice === q.isCorrect);
  const card = document.getElementById('blitzCard');
  
  if (isRight) {
    if (typeof SFX !== 'undefined') SFX.playCorrect();
    STATE.blitz.streak++;
    STATE.blitz.correctCount++;
    const bonus = STATE.blitz.streak > 1 ? (STATE.blitz.streak - 1) * 5 : 0;
    STATE.blitz.score += (10 + bonus);
    if (card) {
      card.style.borderColor = '#10b981';
      card.style.boxShadow = '0 0 35px rgba(16, 185, 129, 0.45)';
    }
    STATE.mastered.add(q.actualWord.id);
  } else {
    if (typeof SFX !== 'undefined') SFX.playWrong();
    STATE.blitz.streak = 0;
    if (card) {
      card.style.borderColor = '#ef4444';
      card.style.boxShadow = '0 0 35px rgba(239, 68, 68, 0.45)';
    }
  }
  
  const scoreEl = document.getElementById('blitzScoreVal');
  const streakEl = document.getElementById('blitzStreakVal');
  if (scoreEl) scoreEl.textContent = STATE.blitz.score;
  if (streakEl) streakEl.textContent = STATE.blitz.streak;
  
  setTimeout(() => {
    if (card) {
      card.style.borderColor = 'rgba(255, 255, 255, 0.12)';
      card.style.boxShadow = 'none';
    }
    STATE.blitz.currentIdx++;
    renderBlitzQuestion();
  }, 700);
}

function showBlitzFinished() {
  const playArea = document.getElementById('blitzPlayArea');
  const finishedView = document.getElementById('blitzFinishedView');
  const scoreText = document.getElementById('blitzFinishedScoreText');
  
  const totalQ = STATE.blitz.totalQuestions || 20;
  const correctCount = STATE.blitz.correctCount || 0;
  const pct = Math.round((correctCount / totalQ) * 100);

  if (playArea) playArea.style.display = 'none';
  if (finishedView) finishedView.style.display = 'block';
  if (scoreText) scoreText.textContent = `Đạt ${STATE.blitz.score} điểm (${correctCount}/${totalQ} câu đúng • ${pct}%)`;

  SFX.playWin();
  launchConfetti();

  if (typeof STUDENT_SYSTEM !== 'undefined' && STUDENT_SYSTEM.recordExerciseResult) {
    STUDENT_SYSTEM.recordExerciseResult(STATE.currentUnit, 'Đúng/Sai (Speed Blitz)', correctCount, totalQ, STATE.blitz.score);
  }
}

// --- MODE B: SPELLING & DICTATION ---
STATE.spelling = {
  questions: [],
  currentIdx: 0,
  score: 0
};

function initSpellingGame(autoSpeak = false) {
  const playArea = document.getElementById('spellingPlayArea');
  const finishedView = document.getElementById('spellingFinishedView');
  if (playArea) playArea.style.display = 'block';
  if (finishedView) finishedView.style.display = 'none';

  if (!STATE.activeWords || STATE.activeWords.length === 0) return;
  STATE.spelling.questions = [...STATE.activeWords].sort(() => 0.5 - Math.random()).slice(0, 15);
  STATE.spelling.currentIdx = 0;
  STATE.spelling.score = 0;
  
  const scoreEl = document.getElementById('spellingScoreVal');
  const totalEl = document.getElementById('spellingTotalQ');
  if (scoreEl) scoreEl.textContent = '0';
  if (totalEl) totalEl.textContent = STATE.spelling.questions.length;
  
  renderSpellingQuestion(autoSpeak);
}

function renderSpellingQuestion(autoSpeak = false) {
  const q = STATE.spelling.questions[STATE.spelling.currentIdx];
  if (!q) {
    showSpellingFinished();
    return;
  }
  
  const idxEl = document.getElementById('spellingQIdx');
  if (idxEl) idxEl.textContent = STATE.spelling.currentIdx + 1;
  
  const meaningEl = document.getElementById('spellingMeaning');
  const posEl = document.getElementById('spellingPos');
  const ipaEl = document.getElementById('spellingIpa');
  if (meaningEl) meaningEl.textContent = q.meaning;
  if (posEl) posEl.textContent = q.pos || 'từ';
  if (ipaEl) ipaEl.textContent = q.ipa || '';
  
  // Format context sentence with gap
  const sentence = q.example || '';
  const escapedWord = q.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp('\\b' + escapedWord + '\\b', 'gi');
  let sentenceWithGap = sentence.replace(regex, '<span class="spelling-gap-highlight">__________</span>');
  if (!sentenceWithGap.includes('spelling-gap-highlight')) {
    sentenceWithGap = `"... <span class="spelling-gap-highlight">__________</span> ..."`
  }
  
  const sentEl = document.getElementById('spellingSentence');
  const sentViEl = document.getElementById('spellingSentenceVi');
  if (sentEl) sentEl.innerHTML = sentenceWithGap;
  if (sentViEl) sentViEl.textContent = q.example_vi ? `Dịch: ${q.example_vi}` : '';
  
  const input = document.getElementById('spellingInput');
  if (input) {
    input.value = '';
    input.className = 'spelling-input';
    input.placeholder = 'Gõ từ tiếng Anh vào đây...';
    setTimeout(() => input.focus(), 150);
  }
  
  // CHỈ phát âm khi học sinh ĐANG Ở tab Luyện Gõ và autoSpeak = true
  const isSpellingActive = document.getElementById('tab-spelling') && document.getElementById('tab-spelling').classList.contains('active');
  if (autoSpeak && isSpellingActive) {
    SpeechEngine.speak(q.word, 0.78);
  }
}

function checkSpellingAnswer() {
  const q = STATE.spelling.questions[STATE.spelling.currentIdx];
  if (!q) return;
  
  const input = document.getElementById('spellingInput');
  if (!input) return;
  const userVal = input.value.trim().toLowerCase();
  const targetVal = q.word.trim().toLowerCase();
  
  if (userVal === targetVal) {
    input.className = 'spelling-input correct';
    SFX.playCorrect();
    STATE.spelling.score += 10;
    const scoreEl = document.getElementById('spellingScoreVal');
    if (scoreEl) scoreEl.textContent = STATE.spelling.score;
    STATE.mastered.add(q.id);
    saveProgress();
    
    setTimeout(() => {
      STATE.spelling.currentIdx++;
      renderSpellingQuestion(true);
    }, 1000);
  } else {
    input.className = 'spelling-input wrong';
    SFX.playWrong();
    STATE.review.add(q.id);
    saveProgress();
    setTimeout(() => {
      input.className = 'spelling-input';
    }, 800);
  }
}

function giveSpellingHint() {
  const q = STATE.spelling.questions[STATE.spelling.currentIdx];
  if (!q) return;
  const input = document.getElementById('spellingInput');
  if (!input) return;
  const hintLength = Math.max(1, Math.floor(q.word.length * 0.45));
  input.value = q.word.slice(0, hintLength);
  input.focus();
}

function revealSpellingAnswer() {
  const q = STATE.spelling.questions[STATE.spelling.currentIdx];
  if (!q) return;
  const input = document.getElementById('spellingInput');
  if (input) input.value = q.word;
  SpeechEngine.speak(q.word, 0.78);
}

function showSpellingFinished() {
  const playArea = document.getElementById('spellingPlayArea');
  const finishedView = document.getElementById('spellingFinishedView');
  const scoreText = document.getElementById('spellingFinishedScoreText');
  if (playArea) playArea.style.display = 'none';
  if (finishedView) finishedView.style.display = 'block';
  if (scoreText) scoreText.textContent = `Điểm số đạt được: ${STATE.spelling.score} điểm`;

  SFX.playWin();
  launchConfetti();

  const totalQ = (STATE.spelling.questions && STATE.spelling.questions.length) || 15;
  const correctCount = Math.min(totalQ, Math.round(STATE.spelling.score / 10));
  if (typeof STUDENT_SYSTEM !== 'undefined' && STUDENT_SYSTEM.recordExerciseResult) {
    STUDENT_SYSTEM.recordExerciseResult(STATE.currentUnit, 'Luyện Gõ Từ (Spelling)', correctCount, totalQ, STATE.spelling.score);
  }
}


// --- MODE C: HANGMAN / WORD DETECTIVE ---
STATE.hangman = {
  questions: [],
  currentIdx: 0,
  targetWord: '',
  guessedLetters: new Set(),
  lives: 5,
  maxLives: 5,
  score: 0
};

function initHangmanGame() {
  const playArea = document.getElementById('hangmanPlayArea');
  const finishedView = document.getElementById('hangmanFinishedView');
  if (playArea) playArea.style.display = 'block';
  if (finishedView) finishedView.style.display = 'none';

  if (!STATE.activeWords || STATE.activeWords.length === 0) return;
  STATE.hangman.questions = [...STATE.activeWords].sort(() => 0.5 - Math.random());
  STATE.hangman.currentIdx = 0;
  STATE.hangman.score = 0;
  
  const scoreEl = document.getElementById('hangmanScoreVal');
  if (scoreEl) scoreEl.textContent = '0';
  
  loadHangmanWord();
}

function loadHangmanWord() {
  const q = STATE.hangman.questions[STATE.hangman.currentIdx];
  if (!q) {
    showHangmanFinished();
    return;
  }
  
  STATE.hangman.targetWord = q.word.toUpperCase();
  STATE.hangman.guessedLetters = new Set();
  STATE.hangman.lives = STATE.hangman.maxLives;
  
  const idxEl = document.getElementById('hangmanWordIdx');
  const totalEl = document.getElementById('hangmanTotalWords');
  const meaningEl = document.getElementById('hangmanMeaning');
  const posEl = document.getElementById('hangmanPos');
  if (idxEl) idxEl.textContent = STATE.hangman.currentIdx + 1;
  if (totalEl) totalEl.textContent = STATE.hangman.questions.length;
  if (meaningEl) meaningEl.textContent = q.meaning;
  if (posEl) posEl.textContent = q.pos || 'từ';
  
  renderHangmanHearts();
  renderHangmanSlots();
  renderHangmanKeyboard();
}

function renderHangmanHearts() {
  const container = document.getElementById('hangmanHearts');
  if (!container) return;
  let html = '';
  for (let i = 0; i < STATE.hangman.maxLives; i++) {
    html += (i < STATE.hangman.lives) ? '❤️ ' : '🖤 ';
  }
  container.textContent = html.trim();
}

function renderHangmanSlots() {
  const row = document.getElementById('hangmanSlots');
  if (!row) return;
  row.innerHTML = '';
  
  const word = STATE.hangman.targetWord;
  let allRevealed = true;
  
  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    const slot = document.createElement('div');
    if (ch === ' ' || ch === '-') {
      slot.className = 'hangman-slot space';
      slot.textContent = ch;
    } else if (STATE.hangman.guessedLetters.has(ch)) {
      slot.className = 'hangman-slot revealed';
      slot.textContent = ch;
    } else {
      slot.className = 'hangman-slot';
      slot.textContent = '_';
      allRevealed = false;
    }
    row.appendChild(slot);
  }
  
  if (allRevealed) {
    handleHangmanWin();
  }
}

function renderHangmanKeyboard() {
  const kb = document.getElementById('hangmanKeyboard');
  if (!kb) return;
  kb.innerHTML = '';
  
  const rows = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Z','X','C','V','B','N','M']
  ];
  
  rows.forEach(r => {
    const rowEl = document.createElement('div');
    rowEl.className = 'hangman-key-row';
    r.forEach(ch => {
      const keyBtn = document.createElement('button');
      keyBtn.className = 'hangman-key';
      keyBtn.textContent = ch;
      if (STATE.hangman.guessedLetters.has(ch)) {
        keyBtn.disabled = true;
        if (STATE.hangman.targetWord.includes(ch)) {
          keyBtn.classList.add('hit');
        } else {
          keyBtn.classList.add('miss');
        }
      }
      keyBtn.addEventListener('click', () => guessHangmanLetter(ch));
      rowEl.appendChild(keyBtn);
    });
    kb.appendChild(rowEl);
  });
}

function guessHangmanLetter(ch) {
  if (STATE.hangman.lives <= 0) return;
  if (STATE.hangman.guessedLetters.has(ch)) return;
  
  STATE.hangman.guessedLetters.add(ch);
  
  if (STATE.hangman.targetWord.includes(ch)) {
    SFX.playTone(660, 'sine', 0.12);
  } else {
    STATE.hangman.lives--;
    SFX.playTone(220, 'sawtooth', 0.15);
    renderHangmanHearts();
    
    if (STATE.hangman.lives <= 0) {
      handleHangmanLose();
      return;
    }
  }
  
  renderHangmanSlots();
  renderHangmanKeyboard();
}

function handleHangmanWin() {
  SFX.playWin();
  launchConfetti();
  STATE.hangman.score += 20;
  const scoreEl = document.getElementById('hangmanScoreVal');
  if (scoreEl) scoreEl.textContent = STATE.hangman.score;
  const q = STATE.hangman.questions[STATE.hangman.currentIdx];
  if (q) {
    STATE.mastered.add(q.id);
    SpeechEngine.speak(q.word, 0.78);
  }
  saveProgress();
  
  setTimeout(() => {
    STATE.hangman.currentIdx++;
    loadHangmanWord();
  }, 1900);
}

function handleHangmanLose() {
  SFX.playWrong();
  const q = STATE.hangman.questions[STATE.hangman.currentIdx];
  if (q) {
    STATE.review.add(q.id);
    SpeechEngine.speak(q.word, 0.78);
  }
  saveProgress();
  
  // Reveal word
  const row = document.getElementById('hangmanSlots');
  if (row) {
    row.innerHTML = '';
    for (let i = 0; i < STATE.hangman.targetWord.length; i++) {
      const slot = document.createElement('div');
      slot.className = 'hangman-slot revealed';
      slot.style.color = '#f87171';
      slot.textContent = STATE.hangman.targetWord[i];
      row.appendChild(slot);
    }
  }
  
  setTimeout(() => {
    STATE.hangman.currentIdx++;
    loadHangmanWord();
  }, 2200);
}

function giveHangmanHint() {
  const word = STATE.hangman.targetWord;
  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    if (ch >= 'A' && ch <= 'Z' && !STATE.hangman.guessedLetters.has(ch)) {
      guessHangmanLetter(ch);
      break;
    }
  }
}

function showHangmanFinished() {
  const playArea = document.getElementById('hangmanPlayArea');
  const finishedView = document.getElementById('hangmanFinishedView');
  const scoreText = document.getElementById('hangmanFinishedScoreText');
  if (playArea) playArea.style.display = 'none';
  if (finishedView) finishedView.style.display = 'block';
  if (scoreText) scoreText.textContent = `Điểm phá án đạt được: ${STATE.hangman.score} điểm`;

  SFX.playWin();
  launchConfetti();

  const totalQ = (STATE.hangman.questions && STATE.hangman.questions.length) || 10;
  const correctCount = Math.min(totalQ, Math.round(STATE.hangman.score / 15));
  if (typeof STUDENT_SYSTEM !== 'undefined' && STUDENT_SYSTEM.recordExerciseResult) {
    STUDENT_SYSTEM.recordExerciseResult(STATE.currentUnit, 'Đoán Chữ (Hangman)', correctCount, totalQ, STATE.hangman.score);
  }
}


// --- MODE D: CONTEXT SENTENCE COMPLETION (THPT FORMAT) ---
STATE.context = {
  questions: [],
  currentIdx: 0,
  score: 0,
  streak: 0
};

function initContextGame() {
  const playArea = document.getElementById('contextPlayArea');
  const finishedView = document.getElementById('contextFinishedView');
  if (playArea) playArea.style.display = 'block';
  if (finishedView) finishedView.style.display = 'none';

  if (!STATE.activeWords || STATE.activeWords.length === 0) return;
  
  const eligible = STATE.activeWords.filter(w => w.example && w.example.toLowerCase().includes(w.word.toLowerCase()));
  const pool = eligible.length >= 4 ? eligible : STATE.activeWords;
  
  STATE.context.questions = [...pool].sort(() => 0.5 - Math.random()).slice(0, 15);
  STATE.context.currentIdx = 0;
  STATE.context.score = 0;
  STATE.context.streak = 0;
  
  const scoreEl = document.getElementById('contextScoreVal');
  const streakEl = document.getElementById('contextStreakVal');
  const totalEl = document.getElementById('contextTotalQ');
  if (scoreEl) scoreEl.textContent = '0';
  if (streakEl) streakEl.textContent = '0';
  if (totalEl) totalEl.textContent = STATE.context.questions.length;
  
  renderContextQuestion();
}

function renderContextQuestion() {
  const q = STATE.context.questions[STATE.context.currentIdx];
  if (!q) {
    showContextFinished();
    return;
  }
  
  const idxEl = document.getElementById('contextQIdx');
  if (idxEl) idxEl.textContent = STATE.context.currentIdx + 1;
  
  const escapedWord = q.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp('\\b' + escapedWord + '\\b', 'gi');
  let blankSentence = q.example ? q.example.replace(regex, '<span class="context-blank-token">__________</span>') : `______ (${q.meaning})`;
  if (!blankSentence.includes('context-blank-token')) {
    blankSentence = `"... <span class="context-blank-token">__________</span> ..."`
  }
  
  const sentEl = document.getElementById('contextSentenceText');
  const sentViEl = document.getElementById('contextSentenceVi');
  if (sentEl) sentEl.innerHTML = blankSentence;
  if (sentViEl) sentViEl.textContent = q.example_vi ? `Dịch: ${q.example_vi}` : '';
  
  const others = STATE.activeWords.filter(w => w.id !== q.id).sort(() => 0.5 - Math.random()).slice(0, 3);
  const options = [q, ...others].sort(() => 0.5 - Math.random());
  
  const grid = document.getElementById('contextOptionsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const prefixes = ['A', 'B', 'C', 'D'];
  
  options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.innerHTML = `<span class="opt-prefix">${prefixes[idx]}</span> <span><strong>${opt.word}</strong> <em style="font-size:0.85em; opacity:0.8;">(${opt.pos || ''})</em> - ${opt.meaning}</span>`;
    btn.addEventListener('click', () => handleContextAnswer(opt.id === q.id, btn, q.id));
    grid.appendChild(btn);
  });
}

function handleContextAnswer(isCorrect, clickedBtn, correctId) {
  const grid = document.getElementById('contextOptionsGrid');
  if (!grid) return;
  const allBtns = grid.querySelectorAll('.quiz-option-btn');
  allBtns.forEach(b => b.disabled = true);
  
  if (isCorrect) {
    clickedBtn.classList.add('correct');
    SFX.playCorrect();
    STATE.context.streak++;
    const bonus = STATE.context.streak > 1 ? (STATE.context.streak - 1) * 5 : 0;
    STATE.context.score += (10 + bonus);
    document.getElementById('contextScoreVal').textContent = STATE.context.score;
    document.getElementById('contextStreakVal').textContent = STATE.context.streak;
    STATE.mastered.add(correctId);
    saveProgress();
  } else {
    clickedBtn.classList.add('wrong');
    SFX.playWrong();
    STATE.context.streak = 0;
    document.getElementById('contextStreakVal').textContent = '0';
    STATE.review.add(correctId);
    saveProgress();
    
    allBtns.forEach(b => {
      const optWord = STATE.activeWords.find(w => w.id === correctId);
      if (optWord && b.textContent.includes(optWord.word)) {
        b.classList.add('correct');
      }
    });
  }
  
  setTimeout(() => {
    STATE.context.currentIdx++;
    renderContextQuestion();
  }, 1300);
}

function showContextFinished() {
  const playArea = document.getElementById('contextPlayArea');
  const finishedView = document.getElementById('contextFinishedView');
  const scoreText = document.getElementById('contextFinishedScoreText');
  if (playArea) playArea.style.display = 'none';
  if (finishedView) finishedView.style.display = 'block';
  if (scoreText) scoreText.textContent = `Điểm số đạt được: ${STATE.context.score} điểm`;

  SFX.playWin();
  launchConfetti();

  const totalQ = (STATE.context.questions && STATE.context.questions.length) || 15;
  const correctCount = Math.min(totalQ, Math.round(STATE.context.score / 10));
  if (typeof STUDENT_SYSTEM !== 'undefined' && STUDENT_SYSTEM.recordExerciseResult) {
    STUDENT_SYSTEM.recordExerciseResult(STATE.currentUnit, 'Ngữ Cảnh (Context Sentence)', correctCount, totalQ, STATE.context.score);
  }
}



// Wire up new event listeners on load
document.addEventListener('DOMContentLoaded', () => {
  
  // Blitz Controls
  const blitzFalseBtn = document.getElementById('blitzFalseBtn');
  const blitzTrueBtn = document.getElementById('blitzTrueBtn');
  const blitzAudioBtn = document.getElementById('blitzAudioBtn');
  if (blitzFalseBtn) blitzFalseBtn.addEventListener('click', () => handleBlitzAnswer(false));
  if (blitzTrueBtn) blitzTrueBtn.addEventListener('click', () => handleBlitzAnswer(true));
  if (blitzAudioBtn) blitzAudioBtn.addEventListener('click', () => {
    const q = STATE.blitz.questions[STATE.blitz.currentIdx];
    if (q) SpeechEngine.speak(q.word, 0.78);
  });

  // Spelling Controls
  const spellingSubmitBtn = document.getElementById('spellingSubmitBtn');
  const spellingInput = document.getElementById('spellingInput');
  const spellingHintBtn = document.getElementById('spellingHintBtn');
  const spellingRevealBtn = document.getElementById('spellingRevealBtn');
  const spellingAudioBigBtn = document.getElementById('spellingAudioBigBtn');
  const spellingAudioSlowBtn = document.getElementById('spellingAudioSlowBtn');
  if (spellingSubmitBtn) spellingSubmitBtn.addEventListener('click', checkSpellingAnswer);
  if (spellingInput) {
    spellingInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') checkSpellingAnswer();
    });
  }
  if (spellingHintBtn) spellingHintBtn.addEventListener('click', giveSpellingHint);
  if (spellingRevealBtn) spellingRevealBtn.addEventListener('click', revealSpellingAnswer);
  if (spellingAudioBigBtn) spellingAudioBigBtn.addEventListener('click', () => {
    const q = STATE.spelling.questions[STATE.spelling.currentIdx];
    if (q) SpeechEngine.speak(q.word, 0.78);
  });
  if (spellingAudioSlowBtn) spellingAudioSlowBtn.addEventListener('click', () => {
    const q = STATE.spelling.questions[STATE.spelling.currentIdx];
    if (q) SpeechEngine.speak(q.word, 0.65);
  });

  // Hangman Controls
  const hangmanHintBtn = document.getElementById('hangmanHintBtn');
  const hangmanAudioBtn = document.getElementById('hangmanAudioBtn');
  if (hangmanHintBtn) hangmanHintBtn.addEventListener('click', giveHangmanHint);
  if (hangmanAudioBtn) hangmanAudioBtn.addEventListener('click', () => {
    const q = STATE.hangman.questions[STATE.hangman.currentIdx];
    if (q) SpeechEngine.speak(q.word, 0.78);
  });

  
  // Global keyboard shortcuts for extra modes
  window.addEventListener('keydown', (e) => {
    // NEVER intercept keys when typing in input, textarea, select or contenteditable
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT' || e.target.isContentEditable)) {
      return;
    }
    // NEVER intercept keys when any modal or dialog is open
    if (document.querySelector('.custom-modal-overlay.active, .modal.show, #studentRegisterModalOverlay.active, #adminModalOverlay.active, #certificateCenterModalOverlay.active, #certificateModalOverlay.active, #smartImportModalOverlay.active, #weakWordsModalOverlay.active')) {
      return;
    }
    
    // Extra keyboard shortcuts
    const activeBlitz = document.getElementById('tab-blitz');
    if (activeBlitz && activeBlitz.classList.contains('active')) {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A' || e.key === 'f' || e.key === 'F') {
        handleBlitzAnswer(false);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D' || e.key === 'j' || e.key === 'J') {
        handleBlitzAnswer(true);
      }
    }
    
    const activeHangman = document.getElementById('tab-hangman');
    if (activeHangman && activeHangman.classList.contains('active')) {
      if (e.key >= 'a' && e.key <= 'z') {
        guessHangmanLetter(e.key.toUpperCase());
      } else if (e.key >= 'A' && e.key <= 'Z') {
        guessHangmanLetter(e.key);
      }
    }

  });
});



// ==============================================================================
// 11. VOCABULARY CHANT & KARAOKE PLAYER ENGINE (CALL & RESPONSE WITH MUSIC BEATS)
// ==============================================================================

const ChantBeatEngine = {
  ctx: null,
  masterGain: null,
  beatGain: null,
  noiseBuffer: null,
  isPlaying: false,
  bpm: 112,
  style: 'popfunk',
  currentStep: 0,
  timerId: null,
  volume: 0.92, // Mặc định âm lượng 0.60x to rõ, sôi động, bùng nổ năng lượng
  isDucked: false,
  
  initContext() {
    if (!this.ctx) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
          this.masterGain = this.ctx.createGain();
          this.beatGain = this.ctx.createGain();
          this.beatGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
          this.beatGain.connect(this.masterGain);
          this.masterGain.connect(this.ctx.destination);
          this.initNoiseBuffer();
        }
      } catch (e) {
        console.warn("AudioContext init error:", e);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      try { this.ctx.resume(); } catch(e){}
    }
  },

  initNoiseBuffer() {
    if (!this.ctx || this.noiseBuffer) return;
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.5);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      this.noiseBuffer = buffer;
    } catch(e) {}
  },
  
  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, parseFloat(val) || 0));
    if (this.beatGain && this.ctx) {
      try {
        const target = this.isDucked ? (this.volume * 0.80) : this.volume;
        this.beatGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.beatGain.gain.setValueAtTime(target, this.ctx.currentTime);
      } catch(e){}
    }
  },
  
  duckBeat(duck = true) {
    this.isDucked = duck;
    if (!this.ctx || !this.beatGain) return;
    try {
      const now = this.ctx.currentTime;
      // Khi phát âm tiếng Anh: Giảm nhạc nền xuống 20% để giọng đọc cực kỳ tròn vành rõ chữ
      // Khi đọc xong: Lập tức trả về âm lượng sôi động 100% trong 120ms
      const target = this.isDucked ? (this.volume * 0.80) : this.volume;
      this.beatGain.gain.cancelScheduledValues(now);
      this.beatGain.gain.linearRampToValueAtTime(target, now + 0.12);
    } catch(e){}
  },
  
  setBpm(newBpm) {
    this.bpm = parseInt(newBpm) || 112;
  },
  
  setStyle(newStyle) {
    this.style = newStyle || 'popfunk';
    if (this.style === 'edm') this.bpm = 128;
    else if (this.style === 'lofi') this.bpm = 82;
    else if (this.style === 'trap') this.bpm = 96;
    else if (this.style === 'tropical') this.bpm = 114;
    else this.bpm = 112; // Mặc định Pop Funk sôi động

    const bpmSelect = document.getElementById('chantBpmSelect');
    if (bpmSelect) {
      bpmSelect.value = String(this.bpm);
    }

    const genreTag = document.getElementById('chantGenreTag');
    if (genreTag) {
      const names = {
        popfunk: '🕺 Dance / Pop Funk (112 BPM)',
        edm: '⚡ TikTok Trend EDM (128 BPM)',
        trap: '🎤 Hip-Hop Trap (96 BPM)',
        tropical: '🌴 Tropical Summer (114 BPM)',
        lofi: '🎧 Lo-fi Chill Học Bài (82 BPM)'
      };
      genreTag.textContent = names[this.style] || names.popfunk;
    }

    this.updateVisualizerTheme();
  },

  updateVisualizerTheme() {
    const gradients = {
      popfunk: 'linear-gradient(180deg, #ec4899, #8b5cf6, #38bdf8)',
      edm: 'linear-gradient(180deg, #10b981, #06b6d4, #6366f1)',
      trap: 'linear-gradient(180deg, #e11d48, #9333ea, #3b82f6)',
      tropical: 'linear-gradient(180deg, #14b8a6, #f59e0b, #ef4444)',
      lofi: 'linear-gradient(180deg, #f97316, #fb923c, #a855f7)'
    };
    const grad = gradients[this.style] || gradients.popfunk;
    const bars = document.querySelectorAll('.visualizer-bar');
    bars.forEach(bar => {
      bar.style.background = grad;
    });
  },

  // --- STUDIO QUALITY SYNTHESIZERS & ENERGETIC RHYTHMS ---
  play808Kick(time, gain) {
    if (!this.ctx || !this.beatGain || this.volume <= 0) return;
    try {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, time);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, time);
      osc.frequency.exponentialRampToValueAtTime(38, time + 0.45);

      const peak = Math.max(0.001, (gain || this.volume) * 1.05);
      g.gain.setValueAtTime(peak, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.50);

      osc.connect(filter);
      filter.connect(g);
      g.connect(this.beatGain);

      osc.start(time);
      osc.stop(time + 0.52);
    } catch(e) {}
  },

  playPunchyKick(time, gain) {
    if (!this.ctx || !this.beatGain || this.volume <= 0) return;
    try {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, time);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, time);
      osc.frequency.exponentialRampToValueAtTime(48, time + 0.14);

      const peak = Math.max(0.001, (gain || this.volume) * 1.0);
      g.gain.setValueAtTime(peak, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

      osc.connect(filter);
      filter.connect(g);
      g.connect(this.beatGain);

      osc.start(time);
      osc.stop(time + 0.20);

      // Transient click for extra punch in speakers & headphones
      this.initNoiseBuffer();
      if (this.noiseBuffer) {
        const nSrc = this.ctx.createBufferSource();
        nSrc.buffer = this.noiseBuffer;
        const nFilter = this.ctx.createBiquadFilter();
        nFilter.type = 'bandpass';
        nFilter.frequency.setValueAtTime(1800, time);
        const nGain = this.ctx.createGain();
        nGain.gain.setValueAtTime(peak * 0.35, time);
        nGain.gain.exponentialRampToValueAtTime(0.001, time + 0.025);
        nSrc.connect(nFilter);
        nFilter.connect(nGain);
        nGain.connect(this.beatGain);
        nSrc.start(time);
        nSrc.stop(time + 0.03);
      }
    } catch(e) {}
  },

  playSnare(time, gain, type = 'clap') {
    if (!this.ctx || !this.beatGain || this.volume <= 0) return;
    try {
      this.initNoiseBuffer();
      if (!this.noiseBuffer) return;

      const peak = Math.max(0.001, (gain || this.volume) * 0.7);

      if (type === 'clap') {
        // Double burst clap (authentic handclap)
        [0, 0.014].forEach((delay, idx) => {
          const src = this.ctx.createBufferSource();
          src.buffer = this.noiseBuffer;
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1400, time + delay);
          filter.Q.setValueAtTime(1.2, time + delay);
          const g = this.ctx.createGain();
          const p = idx === 0 ? peak * 0.4 : peak * 0.85;
          g.gain.setValueAtTime(p, time + delay);
          g.gain.exponentialRampToValueAtTime(0.001, time + delay + (idx === 0 ? 0.03 : 0.18));
          src.connect(filter);
          filter.connect(g);
          g.connect(this.beatGain);
          src.start(time + delay);
          src.stop(time + delay + 0.20);
        });
      } else if (type === 'rimshot') {
        const src = this.ctx.createBufferSource();
        src.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2200, time);
        filter.Q.setValueAtTime(3.5, time);
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(peak * 0.6, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
        src.connect(filter);
        filter.connect(g);
        g.connect(this.beatGain);
        src.start(time);
        src.stop(time + 0.07);
      } else {
        const src = this.ctx.createBufferSource();
        src.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1800, time);
        filter.Q.setValueAtTime(1.4, time);
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(peak * 0.75, time);
        g.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
        src.connect(filter);
        filter.connect(g);
        g.connect(this.beatGain);
        src.start(time);
        src.stop(time + 0.16);
      }
    } catch(e) {}
  },

  playHiHat(time, gain, isOpen = false) {
    if (!this.ctx || !this.beatGain || this.volume <= 0) return;
    try {
      this.initNoiseBuffer();
      if (!this.noiseBuffer) return;

      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(8000, time);

      const g = this.ctx.createGain();
      const dur = isOpen ? 0.14 : 0.04;
      const peak = Math.max(0.001, (gain || this.volume) * (isOpen ? 0.35 : 0.25));

      g.gain.setValueAtTime(peak, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + dur);

      src.connect(filter);
      filter.connect(g);
      g.connect(this.beatGain);

      src.start(time);
      src.stop(time + dur + 0.01);
    } catch(e) {}
  },

  playSynthBass(time, freq, duration = 0.18, wave = 'sawtooth') {
    if (!this.ctx || !this.beatGain || this.volume <= 0 || !freq) return;
    try {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = wave;
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(950, time);
      filter.frequency.exponentialRampToValueAtTime(180, time + duration);
      filter.Q.setValueAtTime(3.5, time);

      const peak = Math.max(0.001, this.volume * 0.45);
      g.gain.setValueAtTime(0.001, time);
      g.gain.linearRampToValueAtTime(peak, time + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(filter);
      filter.connect(g);
      g.connect(this.beatGain);

      osc.start(time);
      osc.stop(time + duration + 0.02);
    } catch(e) {}
  },

  playPluckMelody(time, freqs, duration = 0.16, gainVal = 0.3) {
    if (!this.ctx || !this.beatGain || !freqs || this.volume <= 0) return;
    try {
      freqs.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, time);
        filter.frequency.exponentialRampToValueAtTime(450, time + duration);

        const peak = Math.max(0.001, (gainVal || this.volume) * 0.28);
        g.gain.setValueAtTime(0.001, time);
        g.gain.linearRampToValueAtTime(peak, time + 0.015);
        g.gain.exponentialRampToValueAtTime(0.001, time + duration);

        osc.connect(filter);
        filter.connect(g);
        g.connect(this.beatGain);

        osc.start(time);
        osc.stop(time + duration + 0.02);
      });
    } catch(e) {}
  },

  playWarmChord(time, freqs, duration = 0.35, gainVal = 0.25) {
    if (!this.ctx || !this.beatGain || !freqs || this.volume <= 0) return;
    try {
      freqs.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(750, time);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        const peak = Math.max(0.001, (gainVal || this.volume) * 0.26);
        g.gain.setValueAtTime(0.001, time);
        g.gain.linearRampToValueAtTime(peak, time + 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, time + duration);

        osc.connect(filter);
        filter.connect(g);
        g.connect(this.beatGain);

        osc.start(time);
        osc.stop(time + duration + 0.02);
      });
    } catch(e) {}
  },

  triggerStepAudio(step) {
    if (!this.ctx || this.volume <= 0) return;
    const time = this.ctx.currentTime;
    const vol = this.volume;

    switch(this.style) {
      case 'edm':
        // TikTok EDM: Huge 4-on-the-floor kick, massive clap, offbeat pumping bass, arpeggio plucks
        if (step === 0 || step === 4 || step === 8 || step === 12) this.playPunchyKick(time, vol * 1.2);
        if (step === 4 || step === 12) this.playSnare(time, vol * 1.1, 'clap');
        if (step === 2 || step === 6 || step === 10 || step === 14) this.playHiHat(time, vol * 1.1, true);

        // Offbeat Sidechain Pumping Synth Bass (The iconic EDM groove)
        if (step === 2 || step === 6 || step === 10 || step === 14) {
          this.playSynthBass(time, 130.81, 0.22, 'sawtooth');
        }

        // Fast Arp Plucks
        if (step % 3 === 0) {
          const notes = [523.25, 659.25, 783.99, 1046.50];
          const note = notes[(step / 3) % notes.length];
          this.playPluckMelody(time, [note], 0.12, vol * 0.9);
        }
        break;

      case 'trap':
        // Hip-hop Trap: 808 kick, claps, triplet hat rolls, heavy sub
        if (step === 0 || step === 5 || step === 8) this.play808Kick(time, vol * 1.2);
        if (step === 4 || step === 12) this.playSnare(time, vol * 1.1, 'clap');
        if ([0, 2, 4, 6, 8, 9, 10, 11, 12, 14, 15].includes(step)) this.playHiHat(time, vol * 0.85, false);

        if (step === 0 || step === 5 || step === 8 || step === 12) {
          this.playSynthBass(time, 49.00, 0.38, 'sawtooth');
        }
        break;

      case 'tropical':
        // Tropical Summer: Upbeat kicks, marimba offbeat plucks, lively shaker
        if (step === 0 || step === 4 || step === 8 || step === 12) this.playPunchyKick(time, vol);
        if (step === 4 || step === 12) this.playSnare(time, vol, 'rimshot');
        if (step === 2 || step === 6 || step === 10 || step === 14) this.playHiHat(time, vol * 0.8, true);
        if (step === 3 || step === 7 || step === 11 || step === 15) {
          this.playPluckMelody(time, [523.25, 659.25, 783.99], 0.18, vol * 0.9);
        }
        if (step % 4 === 0) {
          this.playSynthBass(time, 65.41, 0.22, 'triangle');
        }
        break;

      case 'lofi':
        // Lo-Fi Chill: Soft kicks, rimshots, lush vintage chords
        if (step === 0 || step === 7) this.playPunchyKick(time, vol * 0.75);
        if (step === 4 || step === 12) this.playSnare(time, vol * 0.75, 'rimshot');
        if (step % 2 === 0) this.playHiHat(time, vol * 0.45, false);
        if (step === 0) this.playWarmChord(time, [146.83, 220.00, 261.63, 329.63], 0.8, vol * 0.85);
        else if (step === 8) this.playWarmChord(time, [196.00, 246.94, 293.66, 349.23], 0.8, vol * 0.85);
        break;

      default: // popfunk - Mặc định cực kỳ sôi động, vui tươi, rộn rã
        // Pop Funk: Punchy kicks, funky claps, slap bass, bouncy horn stabs
        if (step === 0 || step === 6 || step === 10) this.playPunchyKick(time, vol * 1.15);
        if (step === 4 || step === 12) this.playSnare(time, vol * 1.1, 'clap');
        if (step % 2 === 0) this.playHiHat(time, vol * 0.8, false);
        if (step === 14) this.playHiHat(time, vol * 0.9, true); // Open hat at end of bar

        // Slap Bass Groove (Super catchy & funky)
        if (step === 0 || step === 2) this.playSynthBass(time, 55.00, 0.20, 'sawtooth'); // A1
        else if (step === 6) this.playSynthBass(time, 65.41, 0.20, 'sawtooth'); // C2
        else if (step === 8) this.playSynthBass(time, 73.42, 0.20, 'sawtooth'); // D2
        else if (step === 10) this.playSynthBass(time, 82.41, 0.20, 'sawtooth'); // E2
        else if (step === 14) this.playSynthBass(time, 98.00, 0.20, 'sawtooth'); // G2

        // Funky Horn / Guitar Pluck Stabs
        if (step === 0 || step === 3 || step === 6 || step === 8 || step === 11 || step === 14) {
          this.playPluckMelody(time, [440.00, 554.37, 659.25], 0.16, vol * 0.9);
        }
        break;
    }
  },
  
  start() {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.currentStep = 0;
    this.runBeatLoop();
  },
  
  runBeatLoop() {
    if (!this.isPlaying) return;
    try {
      this.triggerStepAudio(this.currentStep);
      pulseVisualizer(this.currentStep);
    } catch(e){}
    this.currentStep = (this.currentStep + 1) % 16;
    const intervalMs = Math.max(30, Math.round((60000 / this.bpm) / 4));
    this.timerId = setTimeout(() => this.runBeatLoop(), intervalMs);
  },
  
  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.ctx && this.beatGain) {
      try {
        this.beatGain.gain.setValueAtTime(0, this.ctx.currentTime);
      } catch(e){}
    }
  }
};

// --- CHANT VOCABULARY CONTROLLER & SEQUENCER ---

function initChantGame() {
  if (!STATE.activeWords || STATE.activeWords.length === 0) return;
  STATE_CHANT.currentWordIdx = 0;
  STATE_CHANT.isPlaying = false;
  STATE_CHANT.currentPhase = 'idle';
  clearTimeout(STATE_CHANT.timerTimeout);
  ChantBeatEngine.stop();
  
  const playBtn = document.getElementById('chantPlayBtn');
  if (playBtn) {
    playBtn.innerHTML = '<span>▶️ BẮT ĐẦU CHANT</span>';
    playBtn.classList.remove('playing');
  }
  
  renderChantWord();
  initVisualizerBars();
  ChantBeatEngine.updateVisualizerTheme();
  ChantBeatEngine.setStyle(document.getElementById('chantStyleSelect')?.value || 'popfunk');

}

function renderChantWord() {
  if (!STATE.activeWords || STATE.activeWords.length === 0) return;
  const w = STATE.activeWords[STATE_CHANT.currentWordIdx];
  if (!w) return;
  
  const wordEl = document.getElementById('chantWordMain');
  const ipaEl = document.getElementById('chantIpa');
  const posEl = document.getElementById('chantPos');
  const meaningEl = document.getElementById('chantMeaningMain');
  const exEnEl = document.getElementById('chantExampleEn');
  const exViEl = document.getElementById('chantExampleVi');
  const counterEl = document.getElementById('chantCounter');
  const badgeEl = document.getElementById('chantCallBadge');
  
  if (counterEl) counterEl.textContent = `Từ ${STATE_CHANT.currentWordIdx + 1}/${STATE.activeWords.length}`;
  if (wordEl) wordEl.textContent = w.word;
  if (ipaEl) ipaEl.textContent = w.ipa || '';
  if (posEl) posEl.textContent = w.pos || 'từ';
  if (meaningEl) meaningEl.textContent = w.meaning;
  if (exEnEl) exEnEl.textContent = w.example ? `"${w.example}"` : '';
  if (exViEl) exViEl.textContent = w.example_vi ? `Dịch: ${w.example_vi}` : '';
  
  if (badgeEl) {
    badgeEl.className = 'chant-call-badge';
    badgeEl.textContent = '🎵 CHUẨN BỊ CHANT';
  }
}

function toggleChantPlayback() {
  if (STATE_CHANT.isPlaying) {
    pauseChant();
  } else {
    startChant();
  }
}

function startChant() {
  ChantBeatEngine.start();
  STATE_CHANT.isPlaying = true;
  
  const playBtn = document.getElementById('chantPlayBtn');
  if (playBtn) {
    playBtn.innerHTML = '<span>⏸️ TẠM DỪNG</span>';
    playBtn.classList.add('playing');
  }
  
  runChantSequenceForCurrentWord();
}

function pauseChant() {
  if (typeof STATE_CHANT === 'undefined') return;
  STATE_CHANT.isPlaying = false;
  clearTimeout(STATE_CHANT.timerTimeout);
  window.speechSynthesis.cancel();
  ChantBeatEngine.stop();
  
  const playBtn = document.getElementById('chantPlayBtn');
  if (playBtn) {
    playBtn.innerHTML = '<span>▶️ TIẾP TỤC CHANT</span>';
    playBtn.classList.remove('playing');
  }
  
  const badgeEl = document.getElementById('chantCallBadge');
  if (badgeEl) {
    badgeEl.className = 'chant-call-badge';
    badgeEl.textContent = '⏸️ ĐANG TẠM DỪNG';
  }
}

function runChantSequenceForCurrentWord() {
  if (!STATE_CHANT.isPlaying) return;
  const w = STATE.activeWords[STATE_CHANT.currentWordIdx];
  if (!w) {
    // Unit finished
    if (STATE_CHANT.loopUnit) {
      STATE_CHANT.currentWordIdx = 0;
      renderChantWord();
      runChantSequenceForCurrentWord();
    } else {
      pauseChant();
      SFX.playWin();
      launchConfetti();
    }
    return;
  }
  
  renderChantWord();
  
  const card = document.getElementById('chantCard');
  const badgeEl = document.getElementById('chantCallBadge');
  const wordEl = document.getElementById('chantWordMain');
  const meaningEl = document.getElementById('chantMeaningMain');
  
  // Phase 1: CALL (Xướng từ tiếng Anh dứt khoát)
  STATE_CHANT.currentPhase = 'call';
  if (badgeEl) {
    badgeEl.className = 'chant-call-badge call';
    badgeEl.textContent = '📣 LƯỢT 1: CALL (XƯỚNG TỪ)';
  }
  if (card) {
    card.className = 'chant-card call-active';
  }
  if (wordEl) wordEl.classList.add('highlight');
  if (meaningEl) meaningEl.classList.remove('highlight');
  
  // Speak Call (English)
  SpeechEngine.speak(w.word, 0.78);
  
  // Phase 2: RESPONSE (Sau 1.6s - Đối đáp nghĩa Tiếng Việt)
  STATE_CHANT.timerTimeout = setTimeout(() => {
    if (!STATE_CHANT.isPlaying) return;
    STATE_CHANT.currentPhase = 'response';
    
    if (badgeEl) {
      badgeEl.className = 'chant-call-badge response';
      badgeEl.textContent = '🤝 LƯỢT 2: RESPONSE (ĐỐI ĐÁP NGHĨA)';
    }
    if (card) {
      card.className = 'chant-card response-active';
    }
    if (wordEl) wordEl.classList.remove('highlight');
    if (meaningEl) meaningEl.classList.add('highlight');
    
    // Speak meaning or word + meaning
    if (STATE_CHANT.speakVi) {
      speakVietnameseResponse(w.word, w.meaning);
    } else {
      SpeechEngine.speak(w.word, 0.78);
    }
    
    // Phase 3: CHEER (Sau 2.5s - Nhắc lại hoặc đọc ví dụ)
    STATE_CHANT.timerTimeout = setTimeout(() => {
      if (!STATE_CHANT.isPlaying) return;
      STATE_CHANT.currentPhase = 'cheer';
      
      if (badgeEl) {
        badgeEl.className = 'chant-call-badge cheer';
        badgeEl.textContent = '🌟 LƯỢT 3: CHEER (GHI NHỚ SÂU)';
      }
      if (card) {
        card.className = 'chant-card beat-pulse';
      }
      if (wordEl) wordEl.classList.add('highlight');
      if (meaningEl) meaningEl.classList.add('highlight');
      
      if (STATE_CHANT.speakExample && w.example) {
        SpeechEngine.speak(w.example, 0.75);
      } else {
        SpeechEngine.speak(w.word, 0.78);
      }
      
      // Step to next word after groove delay (2.4s)
      STATE_CHANT.timerTimeout = setTimeout(() => {
        if (!STATE_CHANT.isPlaying) return;
        STATE_CHANT.currentWordIdx++;
        runChantSequenceForCurrentWord();
      }, 2800);
      
    }, 2800);
    
  }, 1900);
}

function speakVietnameseResponse(wordEn, meaningVi) {
  if (!('speechSynthesis' in window)) return;
  
  // Tìm giọng chuẩn Hà Nội miền Bắc
  const viVoice = SpeechEngine.getVietnameseHanoiVoice();
  
  if (viVoice) {
    // Có giọng tiếng Việt chuẩn Hà Nội -> Đọc nghĩa tiếng Việt truyền cảm, rõ ràng
    const utt = new SpeechSynthesisUtterance(meaningVi);
    utt.rate = 0.90; // Nhịp điệu vừa vặn, phát âm tròn vành rõ chữ chuẩn Hà Nội
    utt.pitch = 1.0;
    utt.lang = 'vi-VN';
    utt.voice = viVoice;
    
    window._activeSpeechUtterance = utt;
    if (typeof ChantBeatEngine !== 'undefined' && ChantBeatEngine.isPlaying) {
      ChantBeatEngine.duckBeat(true);
    }
    utt.onend = () => {
      window._activeSpeechUtterance = null;
      if (typeof ChantBeatEngine !== 'undefined' && ChantBeatEngine.isPlaying) {
        ChantBeatEngine.duckBeat(false);
      }
    };
    utt.onerror = () => {
      window._activeSpeechUtterance = null;
      if (typeof ChantBeatEngine !== 'undefined' && ChantBeatEngine.isPlaying) {
        ChantBeatEngine.duckBeat(false);
      }
    };
    
    window.speechSynthesis.speak(utt);
  } else {
    // Nếu máy tính/điện thoại không có giọng tiếng Việt:
    // TUYỆT ĐỐI KHÔNG DÙNG GIỌNG TIẾNG ANH ĐỂ ĐỌC TIẾNG VIỆT (tránh đọc méo, đọc sai)!
    // Thay vào đó: Phát âm lặp lại từ tiếng Anh theo phong cách Call & Response của Chant!
    SpeechEngine.speak(wordEn, 0.78);
  }
}

function nextChantWord() {
  clearTimeout(STATE_CHANT.timerTimeout);
  window.speechSynthesis.cancel();
  if (STATE.activeWords && STATE_CHANT.currentWordIdx < STATE.activeWords.length - 1) {
    STATE_CHANT.currentWordIdx++;
  } else {
    STATE_CHANT.currentWordIdx = 0;
  }
  renderChantWord();
  if (STATE_CHANT.isPlaying) {
    runChantSequenceForCurrentWord();
  }
}

function prevChantWord() {
  clearTimeout(STATE_CHANT.timerTimeout);
  window.speechSynthesis.cancel();
  if (STATE_CHANT.currentWordIdx > 0) {
    STATE_CHANT.currentWordIdx--;
  } else if (STATE.activeWords) {
    STATE_CHANT.currentWordIdx = STATE.activeWords.length - 1;
  }
  renderChantWord();
  if (STATE_CHANT.isPlaying) {
    runChantSequenceForCurrentWord();
  }
}

// Visualizer Bars Animation
function initVisualizerBars() {
  const container = document.getElementById('chantVisualizer');
  if (!container) return;
  container.innerHTML = '';
  const numBars = 20;
  for (let i = 0; i < numBars; i++) {
    const bar = document.createElement('div');
    bar.className = 'visualizer-bar';
    bar.style.height = `${8 + Math.random() * 8}px`;
    container.appendChild(bar);
  }
}

function pulseVisualizer(step) {
  const bars = document.querySelectorAll('.visualizer-bar');
  if (!bars || bars.length === 0) return;
  
  const isKickStep = (step % 4 === 0);
  const card = document.getElementById('chantCard');
  if (isKickStep && card && STATE_CHANT.isPlaying) {
    card.classList.add('beat-pulse');
    setTimeout(() => card.classList.remove('beat-pulse'), 120);
  }
  
  bars.forEach((bar, idx) => {
    let height = 8;
    if (STATE_CHANT.isPlaying) {
      if (isKickStep) {
        height = Math.min(48, 16 + Math.random() * 32);
      } else {
        height = Math.min(32, 8 + Math.random() * 20);
      }
    }
    bar.style.height = `${height}px`;
  });
}

// Wire up chant event listeners on load
document.addEventListener('DOMContentLoaded', () => {
  
  // Chant Controls
  const chantPlayBtn = document.getElementById('chantPlayBtn');
  const chantPrevBtn = document.getElementById('chantPrevBtn');
  const chantNextBtn = document.getElementById('chantNextBtn');
  const chantStyleSelect = document.getElementById('chantStyleSelect');
  const chantBpmSelect = document.getElementById('chantBpmSelect');
  const chantVolSlider = document.getElementById('chantVolSlider');
  const chantToggleVi = document.getElementById('chantToggleVi');
  const chantToggleEx = document.getElementById('chantToggleEx');
  const chantToggleLoop = document.getElementById('chantToggleLoop');
  
  if (chantPlayBtn) chantPlayBtn.addEventListener('click', toggleChantPlayback);
  if (chantPrevBtn) chantPrevBtn.addEventListener('click', prevChantWord);
  if (chantNextBtn) chantNextBtn.addEventListener('click', nextChantWord);
  if (chantStyleSelect) chantStyleSelect.addEventListener('change', (e) => ChantBeatEngine.setStyle(e.target.value));
  if (chantBpmSelect) chantBpmSelect.addEventListener('change', (e) => ChantBeatEngine.setBpm(parseInt(e.target.value)));
  if (chantVolSlider) chantVolSlider.addEventListener('input', (e) => ChantBeatEngine.setVolume(parseFloat(e.target.value)));
  
  if (chantToggleVi) {
    chantToggleVi.addEventListener('click', () => {
      STATE_CHANT.speakVi = !STATE_CHANT.speakVi;
      chantToggleVi.classList.toggle('active', STATE_CHANT.speakVi);
    });
  }
  if (chantToggleEx) {
    chantToggleEx.addEventListener('click', () => {
      STATE_CHANT.speakExample = !STATE_CHANT.speakExample;
      chantToggleEx.classList.toggle('active', STATE_CHANT.speakExample);
    });
  }
  if (chantToggleLoop) {
    chantToggleLoop.addEventListener('click', () => {
      STATE_CHANT.loopUnit = !STATE_CHANT.loopUnit;
      chantToggleLoop.classList.toggle('active', STATE_CHANT.loopUnit);
    });
  }

});



// ==============================================================================
// SCRAMBLE LETTERS GAME LOGIC (LUYỆN TỪ THEO UNIT - XẾP CHỮ TỰ DO)
// ==============================================================================
STATE.scramble = {
  words: [],
  currentIdx: 0,
  currentWordObj: null,
  targetLetters: [],
  slots: [],
  tiles: [],
  score: 0,
  peekTimer: null
};

function initScrambleGame(autoSpeak = false) {
  const playArea = document.getElementById('scramblePlayArea');
  const finishedView = document.getElementById('scrambleFinishedView');
  if (playArea) playArea.style.display = 'block';
  if (finishedView) finishedView.style.display = 'none';

  const words = [...STATE.activeWords];
  if (!words || words.length === 0) return;
  
  STATE.scramble.words = words;
  STATE.scramble.currentIdx = 0;
  STATE.scramble.score = 0;
  
  const scoreEl = document.getElementById('scrambleScoreVal');
  const totalEl = document.getElementById('scrambleTotalWords');
  if (scoreEl) scoreEl.textContent = '0';
  if (totalEl) totalEl.textContent = words.length;
  
  loadScrambleWord(autoSpeak);
}

function loadScrambleWord(autoSpeak = false) {
  if (STATE.scramble.currentIdx >= STATE.scramble.words.length) {
    showScrambleCompleted();
    return;
  }
  
  const wordObj = STATE.scramble.words[STATE.scramble.currentIdx];
  STATE.scramble.currentWordObj = wordObj;
  
  // Progress
  const idxEl = document.getElementById('scrambleWordIdx');
  if (idxEl) idxEl.textContent = STATE.scramble.currentIdx + 1;
  const pct = ((STATE.scramble.currentIdx) / STATE.scramble.words.length) * 100;
  const fillEl = document.getElementById('scrambleProgressFill');
  if (fillEl) fillEl.style.width = `${pct}%`;
  
  // Info
  const meanEl = document.getElementById('scrambleMeaning');
  if (meanEl) {
    meanEl.textContent = wordObj.meaning;
    meanEl.style.cursor = 'pointer';
    meanEl.title = 'Bấm để nghe phát âm từ này';
    meanEl.onclick = () => SpeechEngine.speak(wordObj.word, 0.85);
  }
  const posEl = document.getElementById('scramblePosBadge');
  if (posEl) posEl.textContent = wordObj.pos || 'từ';
  const ipaEl = document.getElementById('scrambleIpaSub');
  if (ipaEl) {
    ipaEl.textContent = wordObj.ipa || '';
    ipaEl.style.cursor = 'pointer';
    ipaEl.title = 'Bấm để nghe phát âm từ này';
    ipaEl.onclick = () => SpeechEngine.speak(wordObj.word, 0.85);
  }
  
  // Hide success banner
  const banner = document.getElementById('scrambleSuccessBanner');
  if (banner) banner.style.display = 'none';
  
  // Setup peek word
  const cleanWord = wordObj.word.trim();
  const peekWordEl = document.getElementById('scramblePeekWord');
  if (peekWordEl) {
    peekWordEl.textContent = cleanWord;
    peekWordEl.style.cursor = 'pointer';
    peekWordEl.title = 'Bấm để nghe phát âm từ này';
    peekWordEl.onclick = () => SpeechEngine.speak(wordObj.word, 0.85);
  }
  const peekIpaEl = document.getElementById('scramblePeekIpa');
  if (peekIpaEl) peekIpaEl.textContent = wordObj.ipa || '';
  
  // Setup Target Slots
  const chars = cleanWord.split('');
  STATE.scramble.targetLetters = chars;
  STATE.scramble.slots = chars.map((c, i) => ({
    idx: i,
    expectedChar: c,
    char: (c === ' ' || c === '-') ? c : '',
    isSpace: (c === ' ' || c === '-'),
    filledTileIdx: null
  }));
  
  // Setup Scrambled Tiles
  const usableChars = chars.filter(c => c !== ' ' && c !== '-');
  let shuffled = usableChars.map((c, idx) => ({ id: idx, char: c, isUsed: false }));
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  if (shuffled.map(t => t.char).join('') === usableChars.join('') && shuffled.length > 2) {
    shuffled.reverse();
  }
  STATE.scramble.tiles = shuffled;
  
  renderScrambleUI();
  showPeekBanner(2500, autoSpeak);
}

function showPeekBanner(durationMs = 2500, autoSpeak = false) {
  const peek = document.getElementById('scramblePeekBanner');
  const info = document.getElementById('scrambleInfoArea');
  if (peek) peek.style.display = 'block';
  if (info) info.style.display = 'none';
  
  // CHỈ PHÁT ÂM KHI autoSpeak == true, KHÔNG TỰ ĐỌC KHI CHUYỂN UNIT!
  if (autoSpeak && STATE.scramble.currentWordObj) {
    SpeechEngine.speak(STATE.scramble.currentWordObj.word, 0.85);
  }
  
  if (STATE.scramble.peekTimer) clearTimeout(STATE.scramble.peekTimer);
  STATE.scramble.peekTimer = setTimeout(() => {
    if (peek) peek.style.display = 'none';
    if (info) info.style.display = 'block';
  }, durationMs);
}

function renderScrambleUI() {
  const slotsRow = document.getElementById('scrambleAnswerSlots');
  if (slotsRow) {
    slotsRow.innerHTML = '';
    STATE.scramble.slots.forEach((slot, sIdx) => {
      const box = document.createElement('div');
      if (slot.isSpace) {
        box.className = 'slot-box space-slot';
        box.textContent = slot.char;
      } else {
        box.className = `slot-box ${slot.char ? 'filled' : ''}`;
        box.textContent = slot.char ? slot.char.toUpperCase() : '';
        box.addEventListener('click', () => handleSlotClick(sIdx));
      }
      slotsRow.appendChild(box);
    });
  }
  
  const pool = document.getElementById('scrambleLettersPool');
  if (pool) {
    pool.innerHTML = '';
    STATE.scramble.tiles.forEach((tile, tIdx) => {
      const tileEl = document.createElement('div');
      tileEl.className = `letter-tile ${tile.isUsed ? 'used' : ''}`;
      tileEl.textContent = tile.char.toUpperCase();
      tileEl.addEventListener('click', () => handleTileClick(tIdx));
      pool.appendChild(tileEl);
    });
  }
}

function handleTileClick(tileIdx) {
  const tile = STATE.scramble.tiles[tileIdx];
  if (!tile || tile.isUsed) return;
  
  const emptySlot = STATE.scramble.slots.find(s => !s.isSpace && !s.char);
  if (!emptySlot) return;
  
  emptySlot.char = tile.char;
  emptySlot.filledTileIdx = tileIdx;
  tile.isUsed = true;
  
  if (typeof SFX !== 'undefined') SFX.playTone(550, 'sine', 0.08, 0.15);
  renderScrambleUI();
  checkScrambleAnswer();
}

function handleSlotClick(slotIdx) {
  const slot = STATE.scramble.slots[slotIdx];
  if (!slot || slot.isSpace || !slot.char) return;
  
  if (slot.filledTileIdx !== null) {
    const tile = STATE.scramble.tiles[slot.filledTileIdx];
    if (tile) tile.isUsed = false;
  }
  
  slot.char = '';
  slot.filledTileIdx = null;
  
  if (typeof SFX !== 'undefined') SFX.playTone(380, 'sine', 0.08, 0.12);
  renderScrambleUI();
}

function resetScrambleCurrentWord() {
  STATE.scramble.slots.forEach(s => {
    if (!s.isSpace) {
      s.char = '';
      s.filledTileIdx = null;
    }
  });
  STATE.scramble.tiles.forEach(t => t.isUsed = false);
  renderScrambleUI();
  if (typeof SFX !== 'undefined') SFX.playTone(400, 'sawtooth', 0.1);
}

function giveScrambleHint() {
  const slot = STATE.scramble.slots.find(s => !s.isSpace && s.char.toLowerCase() !== s.expectedChar.toLowerCase());
  if (!slot) return;
  
  if (slot.filledTileIdx !== null) {
    const prevTile = STATE.scramble.tiles[slot.filledTileIdx];
    if (prevTile) prevTile.isUsed = false;
  }
  
  const matchingTileIdx = STATE.scramble.tiles.findIndex(t => !t.isUsed && t.char.toLowerCase() === slot.expectedChar.toLowerCase());
  if (matchingTileIdx !== -1) {
    slot.char = STATE.scramble.tiles[matchingTileIdx].char;
    slot.filledTileIdx = matchingTileIdx;
    STATE.scramble.tiles[matchingTileIdx].isUsed = true;
    if (typeof SFX !== 'undefined') SFX.playCorrect();
    renderScrambleUI();
    checkScrambleAnswer();
  }
}

function checkScrambleAnswer() {
  const allFilled = STATE.scramble.slots.every(s => s.char);
  if (!allFilled) return;
  
  const formedWord = STATE.scramble.slots.map(s => s.char).join('').toLowerCase();
  const targetWord = STATE.scramble.targetLetters.join('').toLowerCase();
  
  if (formedWord === targetWord) {
    if (typeof SFX !== 'undefined') {
      SFX.playCorrect();
      SFX.playWin();
    }
    
    document.querySelectorAll('.slot-box').forEach(b => b.classList.add('correct'));
    
    STATE.scramble.score += 15;
    const scoreEl = document.getElementById('scrambleScoreVal');
    if (scoreEl) scoreEl.textContent = STATE.scramble.score;
    
    if (STATE.scramble.currentWordObj) {
      STATE.mastered.add(STATE.scramble.currentWordObj.id);
      saveProgress();
      SpeechEngine.speak(STATE.scramble.currentWordObj.word, 0.85);
    }
    
    const banner = document.getElementById('scrambleSuccessBanner');
    const exEl = document.getElementById('scrambleSuccessExample');
    if (exEl && STATE.scramble.currentWordObj) {
      exEl.textContent = `"${STATE.scramble.currentWordObj.example}"\n(${STATE.scramble.currentWordObj.example_vi})`;
    }
    if (banner) banner.style.display = 'block';
    
    setTimeout(() => {
      STATE.scramble.currentIdx++;
      loadScrambleWord();
    }, 2800);
  } else {
    if (typeof SFX !== 'undefined') SFX.playWrong();
    document.querySelectorAll('.slot-box').forEach(b => b.classList.add('shake'));
    setTimeout(() => {
      document.querySelectorAll('.slot-box').forEach(b => b.classList.remove('shake'));
    }, 500);
  }
}

function showScrambleCompleted() {
  const playArea = document.getElementById('scramblePlayArea');
  const finishedView = document.getElementById('scrambleFinishedView');
  const scoreText = document.getElementById('scrambleFinishedScoreText');
  if (playArea) playArea.style.display = 'none';
  if (finishedView) finishedView.style.display = 'block';
  if (scoreText) scoreText.textContent = `Tổng điểm xếp chữ: ${STATE.scramble.score} điểm`;

  if (typeof SFX !== 'undefined') SFX.playWin();
  if (typeof launchConfetti === 'function') launchConfetti();

  const totalQ = (STATE.scramble.words && STATE.scramble.words.length) || 10;
  const correctCount = Math.min(totalQ, Math.round(STATE.scramble.score / 10));
  if (typeof STUDENT_SYSTEM !== 'undefined' && STUDENT_SYSTEM.recordExerciseResult) {
    STUDENT_SYSTEM.recordExerciseResult(STATE.currentUnit, 'Xếp Chữ (Word Scramble)', correctCount, totalQ, STATE.scramble.score);
  }
}


// ==============================================================================
// RENDER FULL VOCABULARY LIST (HIỂN THỊ ĐỦ TOÀN BỘ TỪ VỰNG TRÊN GIAO DIỆN)
// ==============================================================================
function renderFullVocabList() {
  const container = document.getElementById('fullVocabGrid');
  const titleText = document.getElementById('fullVocabSectionTitle');
  if (!container || !STATE.activeWords) return;
  
  const curUnit = VOCABULARY_DATA.find(u => u.unit === STATE.currentUnit);
  const unitTitle = curUnit ? curUnit.title : '';
  if (titleText) {
    titleText.textContent = `Toàn bộ ${STATE.activeWords.length} từ vựng Unit ${STATE.currentUnit}: ${unitTitle}`;
  }
  
  container.innerHTML = '';
  STATE.activeWords.forEach((w, idx) => {
    const item = document.createElement('div');
    item.className = `full-vocab-row ${idx === STATE.currentWordIdx ? 'active-row' : ''}`;
    item.dataset.index = idx;
    
    item.innerHTML = `
      <div class="fvr-num">${idx + 1}</div>
      <div class="fvr-word-box">
        <div class="fvr-word">${w.word}</div>
        <div class="fvr-ipa">${w.ipa || ''} <span class="fvr-pos">${w.pos || 'từ'}</span></div>
      </div>
      <div class="fvr-meaning-box">
        <div class="fvr-meaning">${w.meaning}</div>
        <div class="fvr-example">"${w.example}"</div>
      </div>
      <div class="fvr-actions">
        <button class="fvr-audio-btn" title="Nghe phát âm dõng dạc">🔊</button>
      </div>
    `;
    
    // Bấm vào từ nào: Nhảy thẻ Flashcard tới từ đó và phát âm dõng dạc ngay
    item.addEventListener('click', (e) => {
      STATE.currentWordIdx = idx;
      STATE.isFlipped = false;
      renderFlashcard();
      SpeechEngine.speak(w.word, 0.80);
      
      document.querySelectorAll('.full-vocab-row').forEach(r => r.classList.remove('active-row'));
      item.classList.add('active-row');
      
      // Cuộn mượt thẻ Flashcard vào tầm mắt nếu đang ở xa
      const fcStage = document.getElementById('flashcardStage');
      if (fcStage && window.scrollY > 400) {
        fcStage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    
    container.appendChild(item);
  });
}

function updateActiveVocabRow() {
  document.querySelectorAll('.full-vocab-row').forEach((r, idx) => {
    r.classList.toggle('active-row', idx === STATE.currentWordIdx);
  });
}

function renderChantWordChips() {
  const container = document.getElementById('chantWordChips');
  const countEl = document.getElementById('chantPlaylistCount');
  if (!container || !STATE.activeWords) return;
  
  if (countEl) countEl.textContent = `${STATE.activeWords.length} từ`;
  container.innerHTML = '';
  
  STATE.activeWords.forEach((w, idx) => {
    const chip = document.createElement('div');
    chip.className = `chant-chip ${idx === STATE_CHANT.currentWordIdx ? 'playing' : ''}`;
    chip.textContent = `${idx + 1}. ${w.word}`;
    chip.title = `${w.meaning} (Bấm để nhảy tới từ này trong điệu chant)`;
    
    chip.addEventListener('click', () => {
      STATE_CHANT.currentWordIdx = idx;
      renderChantWord();
      SpeechEngine.speak(w.word, 0.80);
      updateChantChips();
    });
    
    container.appendChild(chip);
  });
}

function updateChantChips() {
  document.querySelectorAll('.chant-chip').forEach((c, idx) => {
    c.classList.toggle('playing', idx === STATE_CHANT.currentWordIdx);
  });
}


// ==============================================================================
// 12. FINAL ENTRY POINT - EXECUTES AFTER ALL FUNCTIONS & STATES ARE LOADED
// ==============================================================================

function loadCustomVocab() {
  try {
    const custom = localStorage.getItem('ENG_CUSTOM_DATABASE');
    if (custom) {
      const parsed = JSON.parse(custom);
      Object.keys(parsed).forEach(g => {
        if (Array.isArray(parsed[g])) {
          ALL_VOCABULARY_DATA[g] = parsed[g];
        }
      });
      console.log("Custom vocabulary database loaded!");
    }
  } catch (e) {
    console.error("Error loading custom database:", e);
  }
}

/**
 * ==============================================================================
 * ENG 6 - 12 VOCAB MASTER - ENHANCEMENT ENGINE (MULTI-GRADE, REGISTRATION, ADMIN)
 * Tác giả: Thầy giáo Đinh Văn Thành (THCS Đồng Yên)
 * Bám sát chương trình GDPT 2018 Bộ Giáo Dục & Đào Tạo (Global Success 6 - 12)
 * ==============================================================================
 */

// ==========================================
// 1. MULTI-GRADE MANAGEMENT
// ==========================================
// ==============================================================================
// 1. SCIENTIFIC GRADE & UNIT SYSTEM (CHUẨN BỘ GD&ĐT: THCS & THPT)
// ==============================================================================
let CURRENT_SEMESTER_FILTER = 'all';

function initGradePills() {
  const container = document.getElementById('gradePillsContainer');
  if (!container) return;

  container.innerHTML = '';

  // Nhóm 1: CẤP THCS (Lớp 6, 7, 8, 9)
  const thcsWrapper = document.createElement('div');
  thcsWrapper.className = 'grade-group-block';
  thcsWrapper.innerHTML = '<span class="grade-group-label">🏫 THCS:</span>';

  const thcsGrades = ["6", "7", "8", "9"];
  thcsGrades.forEach(g => {
    const meta = (typeof GRADE_METADATA !== 'undefined' && GRADE_METADATA[g]) || { name: `Lớp ${g}`, icon: "📘" };
    const btn = document.createElement('button');
    btn.className = `grade-pill ${g === CURRENT_GRADE ? 'active' : ''}`;
    btn.dataset.grade = g;
    btn.innerHTML = `<span>${meta.name}</span>`;
    btn.title = `Chương trình Tiếng Anh ${meta.name} - Sách Kết nối tri thức & Global Success`;
    btn.addEventListener('click', () => switchGrade(g, true));
    thcsWrapper.appendChild(btn);
  });
  container.appendChild(thcsWrapper);

  // Divider
  const divider = document.createElement('div');
  divider.className = 'grade-group-divider';
  container.appendChild(divider);

  // Nhóm 2: CẤP THPT (Lớp 10, 11, 12)
  const thptWrapper = document.createElement('div');
  thptWrapper.className = 'grade-group-block';
  thptWrapper.innerHTML = '<span class="grade-group-label">🎓 THPT:</span>';

  const thptGrades = ["10", "11", "12"];
  thptGrades.forEach(g => {
    const meta = (typeof GRADE_METADATA !== 'undefined' && GRADE_METADATA[g]) || { name: `Lớp ${g}`, icon: "🎓" };
    const btn = document.createElement('button');
    btn.className = `grade-pill ${g === CURRENT_GRADE ? 'active' : ''}`;
    btn.dataset.grade = g;
    btn.innerHTML = `<span>${meta.name}</span>`;
    btn.title = `Chương trình Tiếng Anh ${meta.name} - Sách Global Success`;
    btn.addEventListener('click', () => switchGrade(g, true));
    thptWrapper.appendChild(btn);
  });
  container.appendChild(thptWrapper);

  updateGradeUI();
}

function filterUnitsBySemester(sem) {
  CURRENT_SEMESTER_FILTER = sem;
  document.querySelectorAll('.sem-btn').forEach(btn => {
    btn.classList.toggle('active', btn.id === `semBtn-${sem}`);
  });
  initUnitPills();
}

function initUnitPills() {
  const container = document.getElementById('unitPillsContainer');
  if (!container || typeof VOCABULARY_DATA === 'undefined') return;
  
  container.innerHTML = '';
  
  // Filter units based on semester
  let unitsToRender = [...VOCABULARY_DATA];
  if (typeof CURRENT_SEMESTER_FILTER !== 'undefined') {
    if (CURRENT_SEMESTER_FILTER === '1') {
      unitsToRender = unitsToRender.filter(u => u.unit <= 5);
    } else if (CURRENT_SEMESTER_FILTER === '2') {
      unitsToRender = unitsToRender.filter(u => u.unit > 5);
    }
  }

  if (unitsToRender.length === 0) {
    unitsToRender = [...VOCABULARY_DATA];
  }

  unitsToRender.forEach(u => {
    const pill = document.createElement('button');
    pill.className = `unit-pill ${u.unit === STATE.currentUnit ? 'active' : ''}`;
    pill.dataset.unit = u.unit;
    pill.innerHTML = `
      <div class="unit-pill-top">
        <span class="pill-u-num">${u.icon || '📖'} Unit ${u.unit}</span>
        <span class="pill-word-badge">${u.word_count || (u.words ? u.words.length : 0)} từ</span>
      </div>
      <div class="unit-pill-title-en" title="${u.title}">${u.title}</div>
      <div class="unit-pill-title-vi" title="${u.title_vi || ''}">${u.title_vi || ''}</div>
    `;
    pill.title = `Unit ${u.unit}: ${u.title} - ${u.title_vi || ''} (${u.word_count || (u.words ? u.words.length : 0)} từ vựng)`;
    pill.addEventListener('click', () => selectUnit(u.unit, true));
    container.appendChild(pill);
  });
}



function openAllUnitsCatalogModal() {
  const overlay = document.getElementById('allUnitsCatalogModalOverlay');
  const body = document.getElementById('catalogModalBody');
  const title = document.getElementById('catalogModalTitle');
  if (!overlay || !body) return;

  const meta = (typeof GRADE_METADATA !== 'undefined' && GRADE_METADATA[CURRENT_GRADE]) || { name: `Lớp ${CURRENT_GRADE}` };
  if (title) title.innerHTML = `📑 Mục Lục Toàn Bộ Bài Học - Tiếng Anh ${meta.name}`;

  const allUnits = typeof VOCABULARY_DATA !== 'undefined' ? VOCABULARY_DATA : [];
  const sem1 = allUnits.filter(u => u.unit <= 5);
  const sem2 = allUnits.filter(u => u.unit > 5);

  let html = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
      <!-- HỌC KỲ I -->
      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(56,189,248,0.25); border-radius: 16px; padding: 1.25rem;">
        <h3 style="color: #38bdf8; font-size: 1.05rem; font-weight: 800; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
          📘 HỌC KỲ I (Unit 1 → Unit 5)
        </h3>
        <div style="display: flex; flex-direction: column; gap: 0.65rem;">
  `;

  sem1.forEach(u => {
    const isAct = u.unit === STATE.currentUnit;
    html += `
      <div onclick="selectUnitAndCloseCatalog(${u.unit})" style="cursor: pointer; padding: 0.75rem 1rem; border-radius: 12px; background: ${isAct ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.04)'}; border: 1px solid ${isAct ? '#38bdf8' : 'rgba(255,255,255,0.08)'}; display: flex; align-items: center; justify-content: space-between; transition: all 0.2s;" onmouseover="this.style.background='rgba(56,189,248,0.15)'" onmouseout="this.style.background='${isAct ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.04)'}'">
        <div>
          <div style="font-weight: 800; font-size: 0.88rem; color: #fff;">${u.icon || '📖'} Unit ${u.unit}: ${u.title}</div>
          <div style="font-size: 0.76rem; color: #94a3b8; margin-top: 2px;">${u.title_vi || ''}</div>
        </div>
        <span style="font-size: 0.75rem; font-weight: 700; color: #38bdf8; background: rgba(56,189,248,0.1); padding: 3px 8px; border-radius: 8px;">${u.word_count || 0} từ</span>
      </div>
    `;
  });

  html += `
        </div>
      </div>

      <!-- HỌC KỲ II -->
      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(245,158,11,0.25); border-radius: 16px; padding: 1.25rem;">
        <h3 style="color: #fbbf24; font-size: 1.05rem; font-weight: 800; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
          📙 HỌC KỲ II (Unit 6 → Unit 10+)
        </h3>
        <div style="display: flex; flex-direction: column; gap: 0.65rem;">
  `;

  sem2.forEach(u => {
    const isAct = u.unit === STATE.currentUnit;
    html += `
      <div onclick="selectUnitAndCloseCatalog(${u.unit})" style="cursor: pointer; padding: 0.75rem 1rem; border-radius: 12px; background: ${isAct ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.04)'}; border: 1px solid ${isAct ? '#f59e0b' : 'rgba(255,255,255,0.08)'}; display: flex; align-items: center; justify-content: space-between; transition: all 0.2s;" onmouseover="this.style.background='rgba(245,158,11,0.15)'" onmouseout="this.style.background='${isAct ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.04)'}'">
        <div>
          <div style="font-weight: 800; font-size: 0.88rem; color: #fff;">${u.icon || '📖'} Unit ${u.unit}: ${u.title}</div>
          <div style="font-size: 0.76rem; color: #94a3b8; margin-top: 2px;">${u.title_vi || ''}</div>
        </div>
        <span style="font-size: 0.75rem; font-weight: 700; color: #fbbf24; background: rgba(245,158,11,0.1); padding: 3px 8px; border-radius: 8px;">${u.word_count || 0} từ</span>
      </div>
    `;
  });

  html += `
        </div>
      </div>
    </div>
  `;

  body.innerHTML = html;
  overlay.classList.add('active');
}

function closeAllUnitsCatalogModal() {
  const overlay = document.getElementById('allUnitsCatalogModalOverlay');
  if (overlay) overlay.classList.remove('active');
}

function selectUnitAndCloseCatalog(unitNum) {
  closeAllUnitsCatalogModal();
  selectUnit(unitNum, true);
}


function updateGradeUI() {
  // Update Grade pills active class
  document.querySelectorAll('.grade-pill').forEach(btn => {
    if (btn.dataset.grade === CURRENT_GRADE) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update Brand Badge
  const badge = document.getElementById('currentGradeBadge');
  if (badge) {
    const meta = GRADE_METADATA[CURRENT_GRADE];
    badge.textContent = `${meta ? meta.fullName : 'Tiếng Anh ' + CURRENT_GRADE}`;
  }

  // Update App Title
  const brandTitle = document.getElementById('brandTitleText');
  if (brandTitle) {
    brandTitle.textContent = `VOCAB MASTER (LỚP ${CURRENT_GRADE})`;
  }
}

function switchGrade(gradeStr, shouldSpeak = false) {
  if (!ALL_VOCABULARY_DATA[gradeStr]) {
    console.warn("Khối lớp không hợp lệ:", gradeStr);
    return;
  }

  CURRENT_GRADE = String(gradeStr);
  VOCABULARY_DATA = ALL_VOCABULARY_DATA[CURRENT_GRADE] || [];
  
  try {
    localStorage.setItem('ENG_SELECTED_GRADE', CURRENT_GRADE);
  } catch (e) {}

  updateGradeUI();
  initUnitPills();
  
  // Reset to Unit 1 of selected grade
  STATE.currentUnit = 1;
  STATE.currentWordIdx = 0;
  STATE.isFlipped = false;
  STATE.mastered = new Set();
  STATE.review = new Set();
  STATE.starred = new Set();
  
  loadProgress(); // Reload progress for this specific grade
  selectUnit(1, false);

  if (shouldSpeak && typeof SpeechEngine !== 'undefined') {
    const meta = GRADE_METADATA[CURRENT_GRADE];
    SpeechEngine.speak(`English Grade ${CURRENT_GRADE}`, 0.9);
  }
}

// ==========================================
// 2. STUDENT REGISTRATION & PROGRESS SYSTEM
// ==========================================

// ==============================================================================
// 12. TEACHER CHATBOX SYSTEM (THẦY GIÁO ĐINH VĂN THÀNH & HỌC SINH 6 - 12)
// ==============================================================================
const TEACHER_CHAT = {
  isOpen: false,
  messages: [],

  init() {
    this.loadMessages();
    this.renderMessages();
    this.updateUnreadBadge();

    // Default welcoming message if first time
    if (this.messages.length === 0) {
      const studentName = STUDENT_SYSTEM.currentStudent?.fullName || 'em';
      const className = STUDENT_SYSTEM.currentStudent?.className ? 
        (STUDENT_SYSTEM.currentStudent.className.toLowerCase().includes('lớp') ? STUDENT_SYSTEM.currentStudent.className : `Lớp ${STUDENT_SYSTEM.currentStudent.className}`) : 
        (CURRENT_GRADE ? `Lớp ${CURRENT_GRADE}` : '');
      this.messages.push({
        id: 'MSG_INIT_' + Date.now(),
        sender: 'teacher',
        teacherName: 'Thầy Đinh Văn Thành',
        text: `Chào em ${studentName} (${className})! Thầy Thành rất vui được đồng hành cùng em trong hành trình Luyện Siêu Trí Nhớ Từ Vựng Tiếng Anh. Em có thắc mắc gì về bài học, cách phát âm, hay bài tập cần giải đáp, hãy nhắn ngay cho thầy ở đây hoặc bấm nút Zalo phía trên nhé! Chúc em luôn học thật tốt! 🌟`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
        read: true
      });
      this.saveMessages();
      this.renderMessages();
    }
  },

  loadMessages() {
    try {
      const studentId = STUDENT_SYSTEM.currentStudent?.id || 'DEFAULT_STUDENT';
      const saved = localStorage.getItem(`ENG_CHAT_${studentId}`);
      if (saved) {
        this.messages = JSON.parse(saved);
      } else {
        this.messages = [];
      }
    } catch (e) {
      this.messages = [];
    }
  },

  saveMessages() {
    try {
      const studentId = STUDENT_SYSTEM.currentStudent?.id || 'DEFAULT_STUDENT';
      localStorage.setItem(`ENG_CHAT_${studentId}`, JSON.stringify(this.messages));
      this.syncToGlobalInbox();
    } catch (e) {}
  },

  syncToGlobalInbox() {
    try {
      const student = STUDENT_SYSTEM.currentStudent || {
        id: 'DEFAULT_STUDENT',
        fullName: 'Học Sinh',
        className: '8A1',
        grade: CURRENT_GRADE,
        school: 'THCS Đồng Yên',
        phone: '0915213717'
      };

      let allInbox = {};
      const saved = localStorage.getItem('ENG_GLOBAL_CHAT_INBOX');
      if (saved) allInbox = JSON.parse(saved);

      allInbox[student.id] = {
        student: student,
        messages: this.messages,
        lastUpdated: new Date().toLocaleString('vi-VN'),
        unreadForAdmin: this.messages.filter(m => m.sender === 'student' && !m.readByAdmin).length
      };

      localStorage.setItem('ENG_GLOBAL_CHAT_INBOX', JSON.stringify(allInbox));
    } catch (e) {}
  },

  toggleChat() {
    const win = document.getElementById('teacherChatWindow');
    if (!win) return;
    this.isOpen = !this.isOpen;
    win.style.display = this.isOpen ? 'flex' : 'none';

    if (this.isOpen) {
      this.messages.forEach(m => {
        if (m.sender === 'teacher') m.read = true;
      });
      this.saveMessages();
      this.updateUnreadBadge();
      this.renderMessages();

      const input = document.getElementById('chatStudentInput');
      if (input) setTimeout(() => input.focus(), 200);
    }
  },

  updateUnreadBadge() {
    const badge = document.getElementById('studentChatUnreadCount');
    if (!badge) return;
    const unread = this.messages.filter(m => m.sender === 'teacher' && !m.read).length;
    if (unread > 0) {
      badge.style.display = 'inline-block';
      badge.textContent = unread;
    } else {
      badge.style.display = 'none';
    }
  },

  renderMessages() {
    const stream = document.getElementById('chatMessagesStream');
    if (!stream) return;

    if (this.messages.length === 0) {
      stream.innerHTML = `<div style="text-align: center; color: #94a3b8; font-size: 0.85rem; padding: 2rem 1rem;">Chưa có tin nhắn nào. Hãy gửi lời chào đến Thầy Thành!</div>`;
      return;
    }

    const student = STUDENT_SYSTEM.currentStudent || {};
    stream.innerHTML = this.messages.map(m => {
      const isTeacher = (m.sender === 'teacher');
      return `
        <div class="chat-bubble ${isTeacher ? 'teacher' : 'student'}">
          <div class="bubble-author">
            ${isTeacher ? '👑 Thầy giáo Đinh Văn Thành' : `👤 ${student.fullName || 'Em'}`}
          </div>
          <div>${this.escapeHtml(m.text)}</div>
          <div class="bubble-time">${m.timestamp || ''}</div>
        </div>
      `;
    }).join('');

    stream.scrollTop = stream.scrollHeight;
  },

  sendMessage() {
    const input = document.getElementById('chatStudentInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    const student = STUDENT_SYSTEM.currentStudent;
    if (!student) {
      alert('Vui lòng đăng ký họ tên trước khi gửi tin nhắn cho Thầy Thành nhé!');
      STUDENT_SYSTEM.openRegisterModal(false);
      return;
    }

    const newMsg = {
      id: 'MSG_' + Date.now(),
      sender: 'student',
      text: text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
      readByAdmin: false
    };

    this.messages.push(newMsg);
    input.value = '';
    this.saveMessages();
    this.renderMessages();

    if (typeof SFX !== 'undefined') SFX.playCorrect();

    this.handleAutoResponse(text);
  },

  sendQuickText(text) {
    const input = document.getElementById('chatStudentInput');
    if (input) {
      input.value = text;
      this.sendMessage();
    }
  },

  handleAutoResponse(userText) {
    setTimeout(() => {
      const student = STUDENT_SYSTEM.currentStudent;
      const lower = userText.toLowerCase();
      let reply = '';

      if (lower.includes('chào') || lower.includes('hello') || lower.includes('hi')) {
        reply = `Thầy Thành chào em ${student?.fullName || ''}! Chúc em một ngày học tập tràn đầy năng lượng và tiếp thu bài thật tốt nhé! 🌟`;
      } else if (lower.includes('nhớ') || lower.includes('thuộc') || lower.includes('mẹo')) {
        reply = `Để nhớ từ vựng siêu nhanh và không bị quên, em hãy kết hợp: 1. Nghe nhạc Chant sôi động theo nhịp beat; 2. Làm bài tập phản xạ Đúng/Sai ⚡; 3. Lật thẻ Flashcard 3D ngắt quãng mỗi ngày. Thầy tin chắc em sẽ thuộc làu làu chỉ sau 10 phút! 💪`;
      } else if (lower.includes('giấy khen') || lower.includes('chứng chỉ') || lower.includes('điểm 10')) {
        reply = `Để nhận Giấy Khen vinh danh của Thầy, em chỉ cần hoàn thành bài Test 15 phút đạt từ 8.0 điểm trở lên hoặc duy trì chuỗi học tập 3 ngày liên tục. Cố gắng lên em nhé! 🏆`;
      } else if (lower.includes('bài tập') || lower.includes('unit') || lower.includes('khó')) {
        reply = `Thầy đã nhận được câu hỏi của em về bài học Unit ${STATE.currentUnit}. Thầy sẽ trực tiếp xem lại bài tập của em trong hệ thống và phản hồi chi tiết cho em. Em có thể bấm nút Zalo phía trên để trao đổi thêm với Thầy nhé! 📘`;
      } else {
        reply = `Thầy Thành đã nhận được tin nhắn của em ${student?.fullName || ''}. Thầy sẽ phản hồi sớm nhất cho em. Chúc em tiếp tục kiên trì rèn luyện từ vựng mỗi ngày thật tốt! 🚀`;
      }

      this.messages.push({
        id: 'MSG_REPLY_' + Date.now(),
        sender: 'teacher',
        teacherName: 'Thầy Đinh Văn Thành',
        text: reply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
        read: this.isOpen
      });

      this.saveMessages();
      this.renderMessages();
      this.updateUnreadBadge();
      if (typeof SFX !== 'undefined') SFX.playWin();
    }, 1200);
  },

  escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
};


// ==============================================================================
// THEME_SYSTEM - QUẢN LÝ 5 GIAO DIỆN HỌC TẬP CHUẨN SƯ PHẠM & TƯƠNG PHẢN CAO
// ==============================================================================
const THEME_SYSTEM = {
  themes: {
    ocean: { key: 'ocean', name: 'Xanh Dương Tri Thức', icon: '🌊', label: '🌊 Xanh Dương' },
    pink: { key: 'pink', name: 'Hồng Anh Đào Ngọt Ngào', icon: '🌸', label: '🌸 Màu Hồng' },
    purple: { key: 'purple', name: 'Tím Hoàng Gia Sáng Tạo', icon: '🔮', label: '🔮 Màu Tím' },
    emerald: { key: 'emerald', name: 'Xanh Ngọc Dịu Mắt', icon: '🍃', label: '🍃 Xanh Ngọc' },
    amber: { key: 'amber', name: 'Cam Hổ Phách Năng Lượng', icon: '🌅', label: '🌅 Màu Cam' }
  },
  currentTheme: 'ocean',

  init() {
    let saved = 'ocean';
    try {
      saved = localStorage.getItem('ENG_CHOSEN_THEME') || 'ocean';
    } catch(e){}
    this.setTheme(saved, false);

    // Click outside to dismiss palette dropdown
    document.addEventListener('click', (e) => {
      const wrapper = document.querySelector('.theme-dropdown-wrapper');
      const menu = document.getElementById('themePaletteMenu');
      if (menu && menu.classList.contains('show')) {
        if (!wrapper || !wrapper.contains(e.target)) {
          menu.classList.remove('show');
        }
      }
    });

    // Also close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const menu = document.getElementById('themePaletteMenu');
        if (menu) menu.classList.remove('show');
      }
    });
  },

  togglePalette(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const menu = document.getElementById('themePaletteMenu');
    if (menu) {
      menu.classList.toggle('show');
    }
  },

  setTheme(themeKey, notify = true) {
    if (!this.themes[themeKey]) themeKey = 'ocean';
    this.currentTheme = themeKey;

    // Apply attribute to html and body
    document.documentElement.setAttribute('data-theme', themeKey);
    document.body.setAttribute('data-theme', themeKey);

    // Save to localStorage
    try {
      localStorage.setItem('ENG_CHOSEN_THEME', themeKey);
    } catch(e){}

    // Update header button label
    const labelSpan = document.getElementById('currentThemeLabel');
    if (labelSpan) {
      labelSpan.textContent = this.themes[themeKey].label;
    }

    // Update active highlight in menu
    document.querySelectorAll('.theme-option-item').forEach(item => {
      item.classList.remove('active');
    });
    const activeItem = document.getElementById(`themeOpt-${themeKey}`);
    if (activeItem) activeItem.classList.add('active');

    // Close menu
    const menu = document.getElementById('themePaletteMenu');
    if (menu) menu.classList.remove('show');

    // Update theme-color meta tag for mobile browsers (Chrome / Safari status bar)
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      const colors = {
        ocean: '#071326',
        pink: '#190a16',
        purple: '#0f0a21',
        emerald: '#051812',
        amber: '#190f05'
      };
      metaTheme.setAttribute('content', colors[themeKey] || '#071326');
    }

    // Fun confetti burst for Sakura Pink
    if (notify && typeof confetti === 'function' && themeKey === 'pink') {
      try { confetti({ particleCount: 30, spread: 50, origin: { y: 0.1, x: 0.85 } }); } catch(e){}
    }
  },

  cycleNext() {
    const keys = Object.keys(this.themes);
    const curIdx = keys.indexOf(this.currentTheme);
    const nextKey = keys[(curIdx + 1) % keys.length];
    this.setTheme(nextKey, true);
  }
};

const STUDENT_SYSTEM = {

  enforceAuthGate() {
    if (this.currentStudent) {
      document.body.classList.remove('auth-locked-mode');
      return;
    }
    document.body.classList.add('auth-locked-mode');
    this.openRegisterModal(false, 'login');
  },

  openProfileModal() {
    if (!this.currentStudent) {
      this.openRegisterModal(false, 'login');
      return;
    }

    const overlay = document.getElementById('studentProfileModalOverlay');
    if (!overlay) return;

    // Fill fields
    const nameInput = document.getElementById('profileFullName');
    const bDateInput = document.getElementById('profileBirthDate');
    const classInput = document.getElementById('profileClassName');
    const gradeSelect = document.getElementById('profileGrade');
    const schoolInput = document.getElementById('profileSchool');
    const phoneInput = document.getElementById('profilePhone');
    const userInput = document.getElementById('profileUsername');
    const passInput = document.getElementById('profilePassword');

    if (nameInput) nameInput.value = this.currentStudent.fullName || '';
    if (bDateInput) bDateInput.value = this.currentStudent.birthDate || '';
    if (classInput) classInput.value = this.currentStudent.className || '';
    if (gradeSelect) gradeSelect.value = this.currentStudent.grade || CURRENT_GRADE;
    if (schoolInput) schoolInput.value = this.currentStudent.school || '';
    if (phoneInput) phoneInput.value = this.currentStudent.phone || '';
    if (userInput) userInput.value = this.currentStudent.username || this.currentStudent.phone || '';
    if (passInput) passInput.value = this.currentStudent.password || '';

    // KPI
    const xpVal = document.getElementById('profileKpiXP');
    const streakVal = document.getElementById('profileKpiStreak');
    const miniVal = document.getElementById('profileKpiMinitest');
    const certVal = document.getElementById('profileKpiCert');

    if (xpVal) xpVal.textContent = this.currentStudent.xp || 50;
    if (streakVal) streakVal.textContent = (this.currentStudent.streakDays || 1) + ' ngày';
    const mCount = (this.currentStudent.minitestHistory || []).length || (this.currentStudent.minitestCount || 0);
    if (miniVal) miniVal.textContent = mCount;
    if (certVal) certVal.textContent = (this.currentStudent.certificates || []).length || mCount;

    // Render Avatar Preview
    this.updateProfileAvatarPreview();
    this.renderPresetAvatars();

    overlay.classList.add('active');
  },

  closeProfileModal() {
    const overlay = document.getElementById('studentProfileModalOverlay');
    if (overlay) overlay.classList.remove('active');
  },

  updateProfileAvatarPreview() {
    const preview = document.getElementById('profileAvatarPreview');
    if (!preview || !this.currentStudent) return;

    const av = this.currentStudent.avatar;
    if (av && av.startsWith('data:image')) {
      preview.innerHTML = `<img src="${av}" style="width: 100%; height: 100%; object-fit: cover;">`;
    } else {
      const preset = PRESET_AVATARS.find(a => a.id === av);
      const icon = preset ? preset.icon : '👦';
      preview.innerHTML = `<span style="font-size: 2.8rem;">${icon}</span>`;
    }
  },

  renderPresetAvatars() {
    const grid = document.getElementById('presetAvatarsGrid');
    if (!grid) return;

    const curAv = this.currentStudent?.avatar || 'av_boy1';
    grid.innerHTML = PRESET_AVATARS.map(a => `
      <button type="button" class="preset-av-btn ${curAv === a.id ? 'active' : ''}" 
              title="${a.label}" 
              onclick="STUDENT_SYSTEM.selectPresetAvatar('${a.id}')">
        ${a.icon}
      </button>
    `).join('');
  },

  selectPresetAvatar(avatarId) {
    if (!this.currentStudent) return;
    this.currentStudent.avatar = avatarId;
    this.saveStudent();
    this.updateProfileAvatarPreview();
    this.renderPresetAvatars();
    this.renderHeaderBadge();
    if (typeof CERTIFICATE_CENTER !== 'undefined') {
      CERTIFICATE_CENTER.avatarImgCache = null;
    }
  },

  onAvatarFileSelected(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, WebP)!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const img = new Image();
      img.onload = () => {
        // Resize and compress via offscreen canvas to 300x300
        const cvs = document.createElement('canvas');
        cvs.width = 300;
        cvs.height = 300;
        const ctx = cvs.getContext('2d');
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, 300, 300);
        const compressed = cvs.toDataURL('image/jpeg', 0.85);

        this.setCustomAvatar(compressed);
      };
      img.src = loadEvt.target.result;
    };
    reader.readAsDataURL(file);
  },

  setCustomAvatar(dataUrl) {
    if (!this.currentStudent) return;
    this.currentStudent.avatar = dataUrl;
    this.saveStudent();
    this.updateProfileAvatarPreview();
    this.renderPresetAvatars();
    this.renderHeaderBadge();
    if (typeof CERTIFICATE_CENTER !== 'undefined') {
      CERTIFICATE_CENTER.avatarImgCache = null;
    }
    alert('✓ Cập nhật ảnh đại diện thành công! Ảnh này sẽ được xuất hiện trang trọng trên Giấy Khen của em.');
  },

  onProfileClassInput(val) {
    if (!val) return;
    const match = val.match(/(?:lớp\s*)?(6|7|8|9|10|11|12)/i);
    if (match) {
      const g = match[1];
      const gradeSel = document.getElementById('profileGrade');
      if (gradeSel && gradeSel.value !== g) {
        gradeSel.value = g;
      }
    }
  },

  saveProfileChanges(e) {
    if (e) e.preventDefault();
    if (!this.currentStudent) return;

    const nameInput = document.getElementById('profileFullName');
    const bDateInput = document.getElementById('profileBirthDate');
    const classInput = document.getElementById('profileClassName');
    const gradeSelect = document.getElementById('profileGrade');
    const schoolInput = document.getElementById('profileSchool');
    const phoneInput = document.getElementById('profilePhone');
    const userInput = document.getElementById('profileUsername');
    const passInput = document.getElementById('profilePassword');

    const fullName = (nameInput?.value || '').trim();
    const birthDate = (bDateInput?.value || '').trim();
    const className = (classInput?.value || '').trim();
    const grade = gradeSelect?.value || this.currentStudent.grade || '12';
    const school = (schoolInput?.value || '').trim();
    const phone = (phoneInput?.value || '').trim();
    let username = (userInput?.value || '').trim().toLowerCase();
    const password = (passInput?.value || '').trim();

    if (!fullName || fullName.length < 2) {
      alert('Vui lòng nhập đầy đủ Họ và tên học sinh!');
      nameInput?.focus();
      return;
    }

    if (!className || className.length < 2) {
      alert('Vui lòng nhập Lớp học cụ thể!');
      classInput?.focus();
      return;
    }

    if (!school || school.length < 2) {
      alert('Vui lòng nhập tên Trường đang học!');
      schoolInput?.focus();
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      alert('Vui lòng nhập Số điện thoại hợp lệ!');
      phoneInput?.focus();
      return;
    }

    if (!username) username = cleanPhone;
    username = username.replace(/[^a-z0-9_]/g, '');

    // Check duplicate username with other students
    const allStudents = ADMIN_SYSTEM.getAllStudents();
    const duplicate = allStudents.find(s => (s.username || '').toLowerCase() === username && s.id !== this.currentStudent.id);
    if (duplicate) {
      alert(`⚠️ Tên đăng nhập "${username}" đã có bạn khác dùng rồi. Em vui lòng chọn tên đăng nhập khác nhé!`);
      userInput?.focus();
      return;
    }

    // Apply updates
    this.currentStudent.fullName = fullName;
    this.currentStudent.birthDate = birthDate;
    this.currentStudent.className = className;
    this.currentStudent.grade = grade;
    this.currentStudent.school = school;
    this.currentStudent.phone = cleanPhone;
    this.currentStudent.username = username;
    this.currentStudent.password = password || '123';
    this.currentStudent.lastActiveAt = new Date().toLocaleString('vi-VN');

    this.saveStudent();
    this.closeProfileModal();

    if (grade !== CURRENT_GRADE) {
      switchGrade(grade, true);
    }

    alert('🎉 Hồ sơ và Ảnh đại diện của em đã được cập nhật thành công!');
  },

  currentStudent: null,

  purgeOldDataCutoff() {
    // Thời điểm mốc: 12h00 trưa ngày 15/10/2026
    // Mọi tài khoản cũ tạo trước 12h trưa nay đều bị thanh lọc xóa sạch theo lệnh của Thầy Thành.
    const PURGE_MARKER = 'ENG_PURGE_EPOCH_2026_10_20_CLEAN_DEMO_V2';
    if (!localStorage.getItem(PURGE_MARKER)) {
      console.log('🔄 Đang thanh lọc dữ liệu: Xóa sạch toàn bộ tài khoản cũ trước 12h trưa 15/10/2026...');
      localStorage.removeItem('ALL_STUDENTS_LIST');
      localStorage.removeItem('ENG_STUDENT_PROFILE');
      localStorage.removeItem('ENG_GLOBAL_CHAT_INBOX');
      this.currentStudent = null;
      localStorage.setItem(PURGE_MARKER, 'CLEARED_AT_12H_' + new Date().toISOString());
    }
  },

  init() {
    THEME_SYSTEM.init();
    this.purgeOldDataCutoff();
    this.loadStudent();
    this.renderHeaderBadge();
    
    // Wire edit button
    const editBtn = document.getElementById('editStudentInfoBtn');
    if (editBtn) {
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openRegisterModal(true, 'register');
      });
    }

    // YÊU CẦU BẮT BUỘC: Học sinh phải đăng ký và đăng nhập mới học được!
    if (!this.currentStudent) {
      setTimeout(() => this.enforceAuthGate(), 250);
    } else {
      document.body.classList.remove('auth-locked-mode');
    }
  },

  loadStudent() {
    try {
      const saved = localStorage.getItem('ENG_STUDENT_PROFILE');
      if (saved) {
        this.currentStudent = JSON.parse(saved);
        if (this.currentStudent.grade && this.currentStudent.grade !== CURRENT_GRADE) {
          switchGrade(this.currentStudent.grade, false);
        }
      }
    } catch (e) {
      console.error('Error loading student profile:', e);
    }
  },

  saveStudent() {
    if (!this.currentStudent) return;
    try {
      this.currentStudent.lastActiveAt = new Date().toLocaleString('vi-VN');
      localStorage.setItem('ENG_STUDENT_PROFILE', JSON.stringify(this.currentStudent));

      // Also sync to ALL_STUDENTS_LIST
      let allList = [];
      const savedList = localStorage.getItem('ALL_STUDENTS_LIST');
      if (savedList) allList = JSON.parse(savedList);

      const existingIdx = allList.findIndex(s => s.id === this.currentStudent.id || (s.username && s.username === this.currentStudent.username) || (s.phone && s.phone === this.currentStudent.phone));
      if (existingIdx !== -1) {
        allList[existingIdx] = this.currentStudent;
      } else {
        allList.push(this.currentStudent);
      }
      localStorage.setItem('ALL_STUDENTS_LIST', JSON.stringify(allList));

      this.renderHeaderBadge();
    } catch (e) {
      console.error('Error saving student profile:', e);
    }
  },

  onClassInput(val) {
    if (!val) return;
    const match = val.match(/(?:lớp\s*)?(6|7|8|9|10|11|12)/i);
    if (match) {
      const g = match[1];
      const gradeSel = document.getElementById('regGrade');
      if (gradeSel && gradeSel.value !== g) {
        gradeSel.value = g;
      }
    }
  },

  openRegisterModal(canClose = true, defaultTab = 'login') {
    const overlay = document.getElementById('studentRegisterModalOverlay');
    if (!overlay) return;

    this.canCloseModal = (this.currentStudent !== null) || canClose;

    const closeBtn = overlay.querySelector('.custom-modal-close');
    if (closeBtn) {
      if (this.currentStudent) {
        closeBtn.style.display = 'flex';
      } else {
        // Học sinh chưa đăng nhập -> Ẩn nút tắt để bắt buộc đăng nhập/đăng ký
        closeBtn.style.display = 'none';
      }
    }

    this.switchAuthTab(defaultTab);

    if (this.currentStudent) {
      const nameInput = document.getElementById('regFullName');
      const classInput = document.getElementById('regClassName');
      const gradeSelect = document.getElementById('regGrade');
      const schoolInput = document.getElementById('regSchool');
      const phoneInput = document.getElementById('regPhone');
      const userInput = document.getElementById('regUsername');
      const passInput = document.getElementById('regPassword');

      if (nameInput) nameInput.value = this.currentStudent.fullName || '';
      if (classInput) classInput.value = this.currentStudent.className || '';
      if (gradeSelect) gradeSelect.value = this.currentStudent.grade || CURRENT_GRADE;
      if (schoolInput) schoolInput.value = this.currentStudent.school || '';
      if (phoneInput) phoneInput.value = this.currentStudent.phone || '';
      if (userInput) userInput.value = this.currentStudent.username || this.currentStudent.phone || '';
      if (passInput) passInput.value = this.currentStudent.password || '';
    }

    overlay.classList.add('active');
  },

  closeRegisterModal() {
    if (!this.currentStudent && !this.canCloseModal) {
      alert('⚠️ Em vui lòng Đăng ký tài khoản hoặc Đăng nhập để bắt đầu học tập và tham gia các trò chơi nhé!');
      return;
    }
    const overlay = document.getElementById('studentRegisterModalOverlay');
    if (overlay) overlay.classList.remove('active');
    if (this.currentStudent) {
      document.body.classList.remove('auth-locked-mode');
    }
  },

  switchAuthTab(tab) {
    const loginForm = document.getElementById('authLoginForm');
    const registerForm = document.getElementById('authRegisterForm');
    const tabLoginBtn = document.getElementById('tabAuthLoginBtn');
    const tabRegBtn = document.getElementById('tabAuthRegBtn');
    const modalTitle = document.getElementById('authModalTitle');

    if (tab === 'login') {
      if (loginForm) loginForm.style.display = 'block';
      if (registerForm) registerForm.style.display = 'none';
      if (tabLoginBtn) {
        tabLoginBtn.style.background = '#6366f1';
        tabLoginBtn.style.color = '#ffffff';
        tabLoginBtn.style.fontWeight = '800';
      }
      if (tabRegBtn) {
        tabRegBtn.style.background = 'rgba(255,255,255,0.06)';
        tabRegBtn.style.color = '#94a3b8';
        tabRegBtn.style.fontWeight = '600';
      }
      if (modalTitle) modalTitle.textContent = '🔑 Đăng Nhập Tài Khoản Học Sinh';
    } else {
      if (loginForm) loginForm.style.display = 'none';
      if (registerForm) registerForm.style.display = 'block';
      if (tabRegBtn) {
        tabRegBtn.style.background = '#10b981';
        tabRegBtn.style.color = '#ffffff';
        tabRegBtn.style.fontWeight = '800';
      }
      if (tabLoginBtn) {
        tabLoginBtn.style.background = 'rgba(255,255,255,0.06)';
        tabLoginBtn.style.color = '#94a3b8';
        tabLoginBtn.style.fontWeight = '600';
      }
      if (modalTitle) modalTitle.textContent = '📝 Đăng Ký Tài Khoản Học Sinh Mới';
    }
  },

  submitLogin(e) {
    if (e) e.preventDefault();
    const loginUser = (document.getElementById('loginUsername')?.value || '').trim().toLowerCase();
    const loginPass = (document.getElementById('loginPassword')?.value || '').trim();

    // Check Admin login (Username: Admin, Password: 123)
    if (loginUser === 'admin' && (loginPass === '123' || loginPass === '6868')) {
      this.currentStudent = {
        id: 'ADMIN_DVT',
        username: 'Admin',
        fullName: 'Thầy Đinh Văn Thành',
        role: 'admin',
        className: 'Quản Trị Viên',
        grade: CURRENT_GRADE || '12',
        school: 'Trường THCS Đồng Yên',
        phone: '0915213717',
        avatar: 'av_top',
        xp: 9999,
        streakDays: 365,
        registeredAt: 'Chính thức',
        lastActiveAt: new Date().toLocaleString('vi-VN')
      };
      this.saveStudent();
      this.closeRegisterModal();
      this.renderHeaderBadge();
      alert('👑 Kính chào Thầy giáo Đinh Văn Thành (Admin)!\nĐăng nhập quyền Quản trị viên thành công.');
      ADMIN_SYSTEM.openAdminModalDirect();
      return;
    }

    if (!loginUser) {
      alert('Vui lòng nhập Tên đăng nhập hoặc Số điện thoại!');
      document.getElementById('loginUsername')?.focus();
      return;
    }
    if (!loginPass) {
      alert('Vui lòng nhập Mật khẩu!');
      document.getElementById('loginPassword')?.focus();
      return;
    }

    const students = ADMIN_SYSTEM.getAllStudents();
    const cleanLogin = loginUser.replace(/[^0-9]/g, '');

    // Search by username or phone
    const found = students.find(s => {
      const u = (s.username || '').trim().toLowerCase();
      const p = (s.phone || '').trim();
      return u === loginUser || (cleanLogin.length >= 9 && p === cleanLogin);
    });

    if (!found) {
      alert(`❌ Không tìm thấy tài khoản "${loginUser}"!\nVui lòng kiểm tra lại Tên đăng nhập / Số điện thoại hoặc bấm sang tab "ĐĂNG KÝ MỚI" để tạo tài khoản.`);
      return;
    }

    // Verify password (support universal teacher override PIN 123 / 6868)
    if (found.password && found.password !== loginPass && loginPass !== '123' && loginPass !== '6868') {
      alert('❌ Mật khẩu chưa chính xác! Vui lòng thử lại hoặc liên hệ Thầy Đinh Thành để được cấp lại mật khẩu.');
      document.getElementById('loginPassword')?.focus();
      return;
    }

    // Login successful
    this.currentStudent = found;
    this.currentStudent.lastActiveAt = new Date().toLocaleString('vi-VN');
    this.saveStudent();
    this.closeRegisterModal();

    if (this.currentStudent.grade && this.currentStudent.grade !== CURRENT_GRADE) {
      switchGrade(this.currentStudent.grade, true);
    }

    const classStr = this.currentStudent.className ? 
      (this.currentStudent.className.toLowerCase().includes('lớp') ? this.currentStudent.className : `Lớp ${this.currentStudent.className}`) : 
      `Lớp ${this.currentStudent.grade || CURRENT_GRADE}`;

    alert(`🎉 Chúc mừng ${this.currentStudent.fullName} (${classStr}) đã đăng nhập thành công!\nChào mừng em quay trở lại học tập!`);
  },

  submitRegistration(e) {
    if (e) e.preventDefault();

    const nameInput = document.getElementById('regFullName');
    const classInput = document.getElementById('regClassName');
    const gradeSelect = document.getElementById('regGrade');
    const schoolInput = document.getElementById('regSchool');
    const phoneInput = document.getElementById('regPhone');
    const usernameInput = document.getElementById('regUsername');
    const passwordInput = document.getElementById('regPassword');

    const fullName = (nameInput?.value || '').trim();
    const birthDate = (document.getElementById('regBirthDate')?.value || '').trim();
    let className = (classInput?.value || '').trim();
    let grade = gradeSelect?.value || '12';
    const school = (schoolInput?.value || '').trim();
    const phone = (phoneInput?.value || '').trim();
    let username = (usernameInput?.value || '').trim().toLowerCase();
    let password = (passwordInput?.value || '').trim();

    if (!fullName || fullName.length < 2) {
      alert('Vui lòng nhập đầy đủ Họ và tên học sinh (ví dụ: Đinh Văn Thành)!');
      nameInput?.focus();
      return;
    }

    if (!className || className.length < 2) {
      alert('Vui lòng nhập Lớp học của em (ví dụ: 8A1 hoặc Lớp 8A1)!');
      classInput?.focus();
      return;
    }

    const gradeMatch = className.match(/(?:lớp\s*)?(6|7|8|9|10|11|12)/i);
    if (gradeMatch) {
      grade = gradeMatch[1];
      if (gradeSelect) gradeSelect.value = grade;
    }

    if (!school || school.length < 2) {
      alert('Vui lòng nhập tên Trường đang theo học (ví dụ: Trường THCS Đồng Yên)!');
      schoolInput?.focus();
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 9 || cleanPhone.length > 11) {
      alert('Vui lòng nhập Số điện thoại hợp lệ (ví dụ: 0915213717)!');
      phoneInput?.focus();
      return;
    }

    if (!username) {
      username = cleanPhone;
    }
    username = username.replace(/[^a-z0-9_]/g, '');
    if (username.length < 3) {
      username = cleanPhone;
    }

    if (!password) {
      password = '123';
    }

    // Check duplicate username
    const allStudents = ADMIN_SYSTEM.getAllStudents();
    const existing = allStudents.find(s => (s.username || '').toLowerCase() === username && s.id !== this.currentStudent?.id);
    if (existing) {
      alert(`⚠️ Tên đăng nhập "${username}" đã có bạn đăng ký rồi!\nEm vui lòng chọn tên đăng nhập khác (ví dụ: ${username + '1'}, ${cleanPhone}) hoặc chuyển sang tab "ĐĂNG NHẬP" nhé!`);
      usernameInput?.focus();
      return;
    }

    const studentId = this.currentStudent?.id || ('STD_' + Date.now() + '_' + Math.floor(Math.random() * 1000));
    
    this.currentStudent = {
      id: studentId,
      username: username,
      password: password,
      fullName: fullName,
      birthDate: birthDate,
      avatar: this.currentStudent?.avatar || 'av_boy1',
      className: className,
      grade: grade,
      school: school,
      phone: cleanPhone,
      registeredAt: this.currentStudent?.registeredAt || new Date().toLocaleString('vi-VN'),
      registeredTimestamp: Date.now(),
      lastActiveAt: new Date().toLocaleString('vi-VN'),
      minitestHistory: this.currentStudent?.minitestHistory || [],
      minitestCount: this.currentStudent?.minitestCount || 0,
      minitestBestScore: this.currentStudent?.minitestBestScore || 0,
      certificates: this.currentStudent?.certificates || [],
      practiceCount: this.currentStudent?.practiceCount || 0,
      masteredCount: this.currentStudent?.masteredCount || 0,
      xp: this.currentStudent?.xp || 50,
      streakDays: this.currentStudent?.streakDays || 1,
      quizHistory: this.currentStudent?.quizHistory || []
    };

    this.saveStudent();
    document.body.classList.remove('auth-locked-mode');
    this.closeRegisterModal();
    if (typeof SFX !== 'undefined') SFX.playWin();
    if (typeof launchConfetti === 'function') launchConfetti();

    if (grade !== CURRENT_GRADE) {
      switchGrade(grade, true);
    }

    if (typeof confetti === 'function') {
      try { confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } }); } catch(e){}
    }

    const displayClass = className.toLowerCase().includes('lớp') ? className : `Lớp ${className}`;
    alert(`🎉 Chúc mừng em ${fullName} (${displayClass} - ${school})!\nĐăng ký tài khoản thành công!\n🔑 Tên đăng nhập: ${username}\n🔒 Mật khẩu: ${password}\n(Em nhớ lưu lại Tên đăng nhập & Mật khẩu để đăng nhập lần sau nhé!)`);
  },

  logout() {
    if (!confirm('Em có chắc chắn muốn đăng xuất tài khoản hiện tại để chuyển sang tài khoản khác không?')) return;
    this.currentStudent = null;
    localStorage.removeItem('ENG_STUDENT_PROFILE');
    this.renderHeaderBadge();
    this.enforceAuthGate();
  },

  renderHeaderBadge() {
    const badge = document.getElementById('studentHeaderTag');
    const nameSpan = document.getElementById('studentHeaderName');
    const loginBtn = document.getElementById('headerLoginBtn');
    if (!badge || !nameSpan) return;

    if (this.currentStudent) {
      badge.style.display = 'inline-flex';
      badge.style.cursor = 'pointer';
      if (loginBtn) loginBtn.style.display = 'none';

      const isAdmin = this.currentStudent.role === 'admin' || (this.currentStudent.username || '').toLowerCase() === 'admin';
      const classStr = this.currentStudent.className ? 
        (this.currentStudent.className.toLowerCase().includes('lớp') ? this.currentStudent.className : `Lớp ${this.currentStudent.className}`) : 
        `Lớp ${this.currentStudent.grade || CURRENT_GRADE}`;
      
      if (isAdmin) {
        nameSpan.innerHTML = `👑 <strong style="color: #facc15;">Thầy Đinh Văn Thành (Admin)</strong>`;
        badge.style.borderColor = '#facc15';
        badge.style.boxShadow = '0 0 12px rgba(250, 204, 21, 0.5)';
      } else {
        nameSpan.textContent = `${this.currentStudent.fullName} (${classStr})`;
      }
      badge.title = `${this.currentStudent.fullName} • ${classStr} • User: ${this.currentStudent.username || this.currentStudent.phone} • Bấm để xem Hồ sơ & Đổi Avatar`;

      // Update avatar circle in header
      const avCircle = document.getElementById('studentHeaderAvatarCircle');
      if (avCircle) {
        const av = this.currentStudent.avatar;
        if (av && av.startsWith('data:image')) {
          avCircle.innerHTML = `<img src="${av}" alt="Avatar">`;
        } else {
          const preset = PRESET_AVATARS.find(a => a.id === av);
          const icon = preset ? preset.icon : '👦';
          avCircle.innerHTML = `<span>${icon}</span>`;
        }
      }

      badge.onclick = (e) => {
        if (e.target && e.target.id === 'logoutStudentBtn') return;
        this.openProfileModal();
      };
    } else {
      badge.style.display = 'none';
      if (loginBtn) loginBtn.style.display = 'inline-flex';
    }
  },

  addXP(amount = 10) {
    if (!this.currentStudent) return;
    this.currentStudent.xp = (this.currentStudent.xp || 0) + amount;
    this.saveStudent();
  },

    recordMinitestResult(unit, score, total, finalScore) {
    if (!this.currentStudent) return;
    if (!this.currentStudent.minitestHistory) this.currentStudent.minitestHistory = [];
    if (!this.currentStudent.certificates) this.currentStudent.certificates = [];

    const numScore = parseFloat(finalScore);
    const certCode = 'DVT-' + (new Date().getFullYear()) + '-' + Math.floor(Math.random() * 89999 + 10000);
    let rank = "XUẤT SẮC";
    if (numScore < 5.0) rank = "HOÀN THÀNH";
    else if (numScore < 6.5) rank = "TRUNG BÌNH KHÁ";
    else if (numScore < 8.0) rank = "KHÁ";
    else if (numScore < 9.0) rank = "GIỎI";
    else rank = "XUẤT SẮC";

    const attemptDate = new Date().toLocaleString('vi-VN');

    const testItem = {
      id: 'TEST15_' + Date.now(),
      date: attemptDate,
      grade: CURRENT_GRADE,
      unit: unit,
      score: finalScore,
      rawScore: score,
      total: total,
      rank: rank,
      certId: certCode,
      teacherName: 'Thầy giáo Đinh Văn Thành',
      school: this.currentStudent.school || 'Trường THCS Đồng Yên'
    };

    this.currentStudent.minitestHistory.unshift(testItem);
    this.currentStudent.minitestCount = (this.currentStudent.minitestCount || 0) + 1;
    this.currentStudent.minitestBestScore = Math.max(this.currentStudent.minitestBestScore || 0, numScore);

    // Cấp Giấy Khen Điện Tử
    this.currentStudent.certificates.unshift({
      id: certCode,
      date: attemptDate,
      type: 'exam',
      title: 'GIẤY KHEN BÀI KIỂM TRA 15 PHÚT',
      score: finalScore,
      unit: unit,
      rank: rank,
      grade: CURRENT_GRADE
    });

    // Thưởng 100 XP cho bài kiểm tra 15 phút
    this.recordExerciseResult(unit, 'MiniTest 15p', score, total, 100);
  },

  recordExerciseResult(unit, exerciseType, score, total, xp = 10) {
    if (!this.currentStudent) return;
    if (!this.currentStudent.quizHistory) this.currentStudent.quizHistory = [];
    if (!this.currentStudent.exerciseStats) this.currentStudent.exerciseStats = {};

    // Ghi nhận lượt ôn tập nếu không phải bài 15 phút
    if (exerciseType !== 'MiniTest 15p') {
      this.currentStudent.practiceCount = (this.currentStudent.practiceCount || 0) + 1;
    }

    const attemptDate = new Date().toLocaleString('vi-VN');
    const exerciseKey = `Unit ${unit} - ${exerciseType}`;

    // 1. Thêm vào nhật ký bài tập
    this.currentStudent.quizHistory.unshift({
      id: 'EX_' + Date.now(),
      date: attemptDate,
      grade: CURRENT_GRADE,
      unit: unit,
      mode: exerciseType,
      score: score,
      total: total,
      scoreDisplay: total > 0 ? `${score}/${total} câu (${Math.round((score/total)*100)}%)` : `${score}đ`,
      xp: xp
    });

    if (this.currentStudent.quizHistory.length > 80) {
      this.currentStudent.quizHistory = this.currentStudent.quizHistory.slice(0, 80);
    }

    // 2. Thống kê số lần tham gia cho từng bài tập
    if (!this.currentStudent.exerciseStats[exerciseKey]) {
      this.currentStudent.exerciseStats[exerciseKey] = {
        name: exerciseKey,
        unit: unit,
        type: exerciseType,
        attempts: 0,
        bestScore: 0,
        bestTotal: total,
        lastScore: score,
        lastDate: attemptDate
      };
    }

    const stat = this.currentStudent.exerciseStats[exerciseKey];
    stat.attempts = (stat.attempts || 0) + 1;
    stat.lastScore = score;
    stat.lastDate = attemptDate;
    if (score > stat.bestScore) {
      stat.bestScore = score;
      stat.bestTotal = total;
    }

    // 3. Tăng điểm XP và lưu
    this.addXP(xp);
    this.saveStudent();
  },

  recordQuizResult(unit, mode, score, total) {
    this.recordExerciseResult(unit, mode, score, total, (score/total >= 0.8) ? 50 : 25);
  }
};

// ==========================================
// 3. ADMIN MANAGEMENT & LEARNING TRACKER
// ==========================================
const ADMIN_SYSTEM = {
  adminPin: '123', // Mật khẩu quản trị mặc định

    openAdminModal() {
    if (STUDENT_SYSTEM.currentStudent?.role === 'admin' || (STUDENT_SYSTEM.currentStudent?.username || '').toLowerCase() === 'admin') {
      this.openAdminModalDirect();
      return;
    }
    const modal = document.getElementById('adminLoginModalOverlay');
    if (modal) {
      modal.classList.add('active');
      const uInput = document.getElementById('adminAuthUsername');
      if (uInput) {
        uInput.value = 'Admin';
        setTimeout(() => document.getElementById('adminAuthPassword')?.focus(), 150);
      }
    } else {
      this.openAdminModalDirect();
    }
  },

  closeAdminLoginModal() {
    const modal = document.getElementById('adminLoginModalOverlay');
    if (modal) modal.classList.remove('active');
  },

  submitAdminLogin(e) {
    if (e) e.preventDefault();
    const u = (document.getElementById('adminAuthUsername')?.value || '').trim().toLowerCase();
    const p = (document.getElementById('adminAuthPassword')?.value || '').trim();

    if (u === 'admin' && (p === '123' || p === '6868')) {
      STUDENT_SYSTEM.currentStudent = {
        id: 'ADMIN_DVT',
        username: 'Admin',
        fullName: 'Thầy Đinh Văn Thành',
        role: 'admin',
        className: 'Quản Trị Viên',
        grade: CURRENT_GRADE || '12',
        school: 'Trường THCS Đồng Yên',
        phone: '0915213717',
        avatar: 'av_top',
        xp: 9999,
        streakDays: 365,
        registeredAt: 'Chính thức',
        lastActiveAt: new Date().toLocaleString('vi-VN')
      };
      STUDENT_SYSTEM.saveStudent();
      STUDENT_SYSTEM.renderHeaderBadge();
      this.closeAdminLoginModal();
      this.openAdminModalDirect();
      showAppToast('👑 Kính chào Thầy giáo Đinh Văn Thành (Admin)! Đăng nhập thành công.', 'success');
    } else {
      showAppToast('❌ Tên đăng nhập hoặc Mật khẩu Quản trị viên chưa chính xác!', 'error');
      document.getElementById('adminAuthPassword')?.focus();
    }
  },

  openAdminModalDirect() {
    const overlay = document.getElementById('adminModalOverlay');
    if (!overlay) return;

    overlay.classList.add('active');
    this.switchTab('students');
    this.populateFilterDropdowns();
    this.renderAdminView();
    this.updateAdminChatBadge();
  },

  togglePasswordVisibility(spanId, passVal) {
    const el = document.getElementById(spanId);
    if (!el) return;
    if (el.textContent === '••••••') {
      el.textContent = passVal;
      el.style.color = '#34d399';
    } else {
      el.textContent = '••••••';
      el.style.color = '#facc15';
    }
  },


  switchTab(tabName) {
    const secStudents = document.getElementById('adminSectionStudents');
    const secImporter = document.getElementById('adminSectionImporter');
    const secChat = document.getElementById('adminSectionChat');
    const btnStudents = document.getElementById('adminTabStudentsBtn');
    const btnImporter = document.getElementById('adminTabImporterBtn');
    const btnChat = document.getElementById('adminTabChatBtn');

    if (secStudents) secStudents.style.display = (tabName === 'students') ? 'block' : 'none';
    if (secImporter) secImporter.style.display = (tabName === 'importer') ? 'block' : 'none';
    if (secChat) secChat.style.display = (tabName === 'chat') ? 'block' : 'none';

    if (btnStudents) btnStudents.style.background = (tabName === 'students') ? '#6366f1' : 'rgba(255,255,255,0.06)';
    if (btnImporter) btnImporter.style.background = (tabName === 'importer') ? '#6366f1' : 'rgba(255,255,255,0.06)';
    if (btnChat) btnChat.style.background = (tabName === 'chat') ? '#6366f1' : 'rgba(255,255,255,0.06)';

    if (tabName === 'chat') {
      this.renderAdminChatInbox();
    }
  },

  updateAdminChatBadge() {
    const badge = document.getElementById('adminChatUnreadBadge');
    if (!badge) return;
    
    let totalUnread = 0;
    try {
      const saved = localStorage.getItem('ENG_GLOBAL_CHAT_INBOX');
      if (saved) {
        const inbox = JSON.parse(saved);
        Object.values(inbox).forEach(item => {
          totalUnread += (item.unreadForAdmin || 0);
        });
      }
    } catch (e) {}

    if (totalUnread > 0) {
      badge.style.display = 'inline-block';
      badge.textContent = totalUnread;
    } else {
      badge.style.display = 'none';
    }
  },

  selectedChatStudentId: null,

  renderAdminChatInbox() {
    const container = document.getElementById('adminChatInboxContainer');
    if (!container) return;

    let inbox = {};
    try {
      const saved = localStorage.getItem('ENG_GLOBAL_CHAT_INBOX');
      if (saved) inbox = JSON.parse(saved);
    } catch (e) {}

    const students = this.getAllStudents();
    students.forEach(s => {
      if (!inbox[s.id]) {
        let msgs = [];
        try {
          const sSaved = localStorage.getItem(`ENG_CHAT_${s.id}`);
          if (sSaved) msgs = JSON.parse(sSaved);
        } catch (e) {}
        inbox[s.id] = {
          student: s,
          messages: msgs,
          lastUpdated: s.lastActiveAt || 'Hôm nay',
          unreadForAdmin: msgs.filter(m => m.sender === 'student' && !m.readByAdmin).length
        };
      }
    });

    const studentIds = Object.keys(inbox);

    if (studentIds.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: #94a3b8; padding: 3rem;">Chưa có dữ liệu học sinh nào để trò chuyện.</div>`;
      return;
    }

    if (!this.selectedChatStudentId || !inbox[this.selectedChatStudentId]) {
      this.selectedChatStudentId = studentIds[0];
    }

    const currentChat = inbox[this.selectedChatStudentId];
    const curStudent = currentChat.student || {};
    const curMsgs = currentChat.messages || [];

    // Mark messages from this student as read by Admin
    let needSave = false;
    curMsgs.forEach(m => {
      if (m.sender === 'student' && !m.readByAdmin) {
        m.readByAdmin = true;
        needSave = true;
      }
    });
    if (needSave) {
      currentChat.unreadForAdmin = 0;
      localStorage.setItem('ENG_GLOBAL_CHAT_INBOX', JSON.stringify(inbox));
      localStorage.setItem(`ENG_CHAT_${this.selectedChatStudentId}`, JSON.stringify(curMsgs));
      this.updateAdminChatBadge();
    }

    const classStr = curStudent.className ? 
      (curStudent.className.toLowerCase().includes('lớp') ? curStudent.className : `Lớp ${curStudent.className}`) : 
      `Lớp ${curStudent.grade || '12'}`;

    container.innerHTML = `
      <div style="display: grid; grid-template-columns: 280px 1fr; gap: 1rem; min-height: 480px; background: rgba(15,23,42,0.85); border-radius: 14px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden;">
        <!-- Left: Student Conversations List -->
        <div style="border-right: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column;">
          <div style="padding: 10px 12px; background: rgba(30,41,59,0.8); border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 700; font-size: 0.88rem; color: #ffffff;">👥 Học Sinh (${studentIds.length})</span>
            <button onclick="ADMIN_SYSTEM.broadcastAnnouncement()" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none; font-size: 0.75rem; padding: 4px 8px; border-radius: 6px; cursor: pointer; font-weight: 700;">
              📢 Gửi Chung
            </button>
          </div>
          <div style="flex: 1; overflow-y: auto; max-height: 440px;">
            ${studentIds.map(sid => {
              const item = inbox[sid];
              const st = item.student || {};
              const unread = item.unreadForAdmin || 0;
              const isSelected = (sid === this.selectedChatStudentId);
              const sClass = st.className ? (st.className.toLowerCase().includes('lớp') ? st.className : `Lớp ${st.className}`) : `Lớp ${st.grade || '12'}`;
              const lastMsg = (item.messages && item.messages.length > 0) ? item.messages[item.messages.length - 1].text : 'Chưa có tin nhắn';

              return `
                <div onclick="ADMIN_SYSTEM.selectChatStudent('${sid}')" style="padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; background: ${isSelected ? 'rgba(99,102,241,0.25)' : 'transparent'}; transition: background 0.2s;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong style="color: ${isSelected ? '#38bdf8' : '#ffffff'}; font-size: 0.9rem;">${st.fullName || 'Học sinh'}</strong>
                    ${unread > 0 ? `<span style="background: #ef4444; color: white; border-radius: 9999px; font-size: 0.7rem; padding: 1px 6px; font-weight: 800;">${unread}</span>` : ''}
                  </div>
                  <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">${sClass} • ${st.school || 'THCS'}</div>
                  <div style="font-size: 0.73rem; color: #cbd5e1; margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 240px; opacity: 0.85;">
                    ${lastMsg}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Right: Chat Messages Stream & Teacher Reply Box -->
        <div style="display: flex; flex-direction: column; background: #0f172a;">
          <!-- Chat Header -->
          <div style="padding: 10px 16px; background: rgba(30,41,59,0.9); border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 1.05rem; font-weight: 800; color: #ffffff;">👤 ${curStudent.fullName || 'Học sinh'} (${classStr})</div>
              <div style="font-size: 0.78rem; color: #94a3b8; margin-top: 2px;">
                Trường: ${curStudent.school || 'THCS/THPT'} • SĐT: <strong style="color: #38bdf8;">${curStudent.phone}</strong>
              </div>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <a href="tel:${curStudent.phone}" style="background: rgba(56,189,248,0.15); color: #38bdf8; border: 1px solid rgba(56,189,248,0.3); padding: 4px 10px; border-radius: 6px; text-decoration: none; font-size: 0.8rem; font-weight: 700;">📞 Gọi</a>
              <a href="https://zalo.me/${curStudent.phone}" target="_blank" style="background: #0068ff; color: white; padding: 4px 10px; border-radius: 6px; text-decoration: none; font-size: 0.8rem; font-weight: 700;">💬 Zalo</a>
            </div>
          </div>

          <!-- Message Stream -->
          <div id="adminChatMessagesStream" style="flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px; max-height: 320px; background: rgba(15,23,42,0.95);">
            ${curMsgs.length === 0 ? `
              <div style="text-align: center; color: #94a3b8; font-size: 0.85rem; padding: 3rem 1rem;">
                Chưa có tin nhắn nào trong hội thoại này. Thầy Thành hãy gửi lời động viên đầu tiên đến em!
              </div>
            ` : curMsgs.map(m => {
              const isTeacher = (m.sender === 'teacher');
              return `
                <div style="max-width: 80%; padding: 8px 12px; border-radius: 12px; font-size: 0.88rem; line-height: 1.45; ${isTeacher ? 'align-self: flex-end; background: linear-gradient(135deg, #1e1b4b, #312e81); border: 1px solid rgba(234,179,8,0.3); color: #ffffff;' : 'align-self: flex-start; background: #1e293b; color: #f1f5f9; border: 1px solid rgba(255,255,255,0.08);'}">
                  <div style="font-size: 0.72rem; font-weight: 800; color: ${isTeacher ? '#fbbf24' : '#38bdf8'}; margin-bottom: 2px;">
                    ${isTeacher ? '👑 Thầy giáo Đinh Văn Thành' : `👤 ${curStudent.fullName || 'Học sinh'}`}
                  </div>
                  <div>${m.text}</div>
                  <div style="font-size: 0.68rem; color: rgba(255,255,255,0.5); margin-top: 3px; text-align: right;">${m.timestamp || ''}</div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Teacher Quick Chips -->
          <div style="padding: 6px 12px; background: rgba(30,41,59,0.5); display: flex; gap: 6px; overflow-x: auto; border-top: 1px solid rgba(255,255,255,0.05);">
            <button onclick="ADMIN_SYSTEM.insertTeacherChip('Thầy khen ngợi em đã học rất chuyên cần! Hãy tiếp tục phát huy nhé! 🌟')" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; padding: 3px 8px; border-radius: 9999px; font-size: 0.72rem; cursor: pointer; white-space: nowrap;">
              🌟 Khen chuyên cần
            </button>
            <button onclick="ADMIN_SYSTEM.insertTeacherChip('Em nhớ làm bài Test 15 phút để lấy Giấy khen vinh danh của Thầy nhé! 🏆')" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; padding: 3px 8px; border-radius: 9999px; font-size: 0.72rem; cursor: pointer; white-space: nowrap;">
              🏆 Nhắc làm Test 15p
            </button>
            <button onclick="ADMIN_SYSTEM.insertTeacherChip('Từ vựng này em hãy bật phát âm nghe lại và đọc theo nhịp điệu nhé! 🎧')" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #cbd5e1; padding: 3px 8px; border-radius: 9999px; font-size: 0.72rem; cursor: pointer; white-space: nowrap;">
              🎧 Hướng dẫn phát âm
            </button>
          </div>

          <!-- Teacher Input Box -->
          <div style="padding: 10px 14px; background: #1e293b; border-top: 1px solid rgba(255,255,255,0.1); display: flex; gap: 8px;">
            <input type="text" id="adminTeacherReplyInput" placeholder="Thầy Thành nhập lời dặn dò, giải đáp gửi em ${curStudent.fullName || 'học sinh'}..." style="flex: 1; background: #0f172a; border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; padding: 9px 12px; color: white; font-size: 0.88rem; outline: none;" onkeydown="if(event.key==='Enter') ADMIN_SYSTEM.submitTeacherReply(); event.stopPropagation();">
            <button onclick="ADMIN_SYSTEM.submitTeacherReply()" style="background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; border: none; padding: 0 16px; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 0.88rem; display: flex; align-items: center; gap: 4px;">
              🚀 Gửi
            </button>
          </div>
        </div>
      </div>
    `;

    const st = document.getElementById('adminChatMessagesStream');
    if (st) st.scrollTop = st.scrollHeight;
  },

  selectChatStudent(studentId) {
    this.selectedChatStudentId = studentId;
    this.renderAdminChatInbox();
  },

  insertTeacherChip(text) {
    const input = document.getElementById('adminTeacherReplyInput');
    if (input) {
      input.value = text;
      input.focus();
    }
  },

  submitTeacherReply() {
    const input = document.getElementById('adminTeacherReplyInput');
    if (!input || !this.selectedChatStudentId) return;
    const text = input.value.trim();
    if (!text) return;

    this.sendTeacherReply(this.selectedChatStudentId, text);
    input.value = '';
  },

  sendTeacherReply(studentId, text) {
    let msgs = [];
    try {
      const saved = localStorage.getItem(`ENG_CHAT_${studentId}`);
      if (saved) msgs = JSON.parse(saved);
    } catch (e) {}

    const replyMsg = {
      id: 'MSG_TEACHER_' + Date.now(),
      sender: 'teacher',
      teacherName: 'Thầy Đinh Văn Thành',
      text: text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
      read: false
    };

    msgs.push(replyMsg);
    localStorage.setItem(`ENG_CHAT_${studentId}`, JSON.stringify(msgs));

    let inbox = {};
    try {
      const savedInbox = localStorage.getItem('ENG_GLOBAL_CHAT_INBOX');
      if (savedInbox) inbox = JSON.parse(savedInbox);
    } catch (e) {}

    if (inbox[studentId]) {
      inbox[studentId].messages = msgs;
      inbox[studentId].lastUpdated = new Date().toLocaleString('vi-VN');
      localStorage.setItem('ENG_GLOBAL_CHAT_INBOX', JSON.stringify(inbox));
    }

    if (STUDENT_SYSTEM.currentStudent?.id === studentId) {
      TEACHER_CHAT.loadMessages();
      TEACHER_CHAT.renderMessages();
      TEACHER_CHAT.updateUnreadBadge();
    }

    this.renderAdminChatInbox();
  },

  broadcastAnnouncement() {
    const text = prompt('📢 Nhập thông báo hoặc lời dặn dò của Thầy Thành gửi đến TOÀN BỘ học sinh:');
    if (!text || !text.trim()) return;

    const students = this.getAllStudents();
    if (students.length === 0) {
      alert('Chưa có học sinh nào trong hệ thống!');
      return;
    }

    const broadcastMsg = {
      id: 'MSG_BROADCAST_' + Date.now(),
      sender: 'teacher',
      teacherName: 'Thầy Đinh Văn Thành',
      text: `📢 [THÔNG BÁO TỪ THẦY THÀNH]: ${text.trim()}`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
      read: false
    };

    students.forEach(s => {
      let sMsgs = [];
      try {
        const saved = localStorage.getItem(`ENG_CHAT_${s.id}`);
        if (saved) sMsgs = JSON.parse(saved);
      } catch (e) {}
      sMsgs.push(broadcastMsg);
      localStorage.setItem(`ENG_CHAT_${s.id}`, JSON.stringify(sMsgs));
    });

    let inbox = {};
    try {
      const savedInbox = localStorage.getItem('ENG_GLOBAL_CHAT_INBOX');
      if (savedInbox) inbox = JSON.parse(savedInbox);
    } catch (e) {}

    students.forEach(s => {
      if (inbox[s.id]) {
        inbox[s.id].messages.push(broadcastMsg);
      }
    });
    localStorage.setItem('ENG_GLOBAL_CHAT_INBOX', JSON.stringify(inbox));

    if (STUDENT_SYSTEM.currentStudent) {
      TEACHER_CHAT.loadMessages();
      TEACHER_CHAT.renderMessages();
      TEACHER_CHAT.updateUnreadBadge();
    }

    alert(`🎉 Đã gửi thông báo thành công đến toàn bộ ${students.length} học sinh!`);
    this.renderAdminChatInbox();
  },

  closeAdminModal() {
    const overlay = document.getElementById('adminModalOverlay');
    if (overlay) overlay.classList.remove('active');
  },

  getAllStudents() {
    try {
      const saved = localStorage.getItem('ALL_STUDENTS_LIST');
      if (saved) {
        let list = JSON.parse(saved);
        // Loc sach 100% cac tai khoan demo/thu nghiem rac
        const DEMO_NAMES = ['hoc sinh', 'demo', 'test', 'nguyen van an', 'hoc sinh demo', 'default_student'];
        list = list.filter(s => {
          if (!s || !s.fullName) return false;
          const fn = s.fullName.toLowerCase().trim();
          const un = (s.username || '').toLowerCase().trim();
          const ph = (s.phone || '').trim();
          if (DEMO_NAMES.some(d => fn.includes(d) || un.includes(d))) return false;
          if (s.id === 'DEFAULT_STUDENT' || s.id === 'DEMO_1' || s.id === 'DEMO_2') return false;
          if (ph === '0123456789' || ph === '0900000000' || ph === '0999999999') return false;
          return true;
        });
        localStorage.setItem('ALL_STUDENTS_LIST', JSON.stringify(list));
        return list;
      }
    } catch (e) {}
    if (STUDENT_SYSTEM.currentStudent) {
      return [STUDENT_SYSTEM.currentStudent];
    }
    return [];
  },

  populateFilterDropdowns() {
    const students = this.getAllStudents();
    
    // 1. Trường học filter
    const schoolSel = document.getElementById('adminSchoolFilter');
    if (schoolSel) {
      const currentVal = schoolSel.value || 'all';
      const uniqueSchools = [...new Set(students.map(s => (s.school || '').trim()).filter(Boolean))].sort((a,b) => a.localeCompare(b, 'vi'));
      schoolSel.innerHTML = '<option value="all">🏫 Tất cả các trường</option>' + 
        uniqueSchools.map(sch => `<option value="${sch}">${sch}</option>`).join('');
      schoolSel.value = currentVal;
    }

    // 2. Lớp học filter
    const classSel = document.getElementById('adminClassFilter');
    if (classSel) {
      const currentVal = classSel.value || 'all';
      const uniqueClasses = [...new Set(students.map(s => {
        let c = (s.className || '').trim();
        return c;
      }).filter(Boolean))].sort((a,b) => a.localeCompare(b, 'vi', { numeric: true }));
      classSel.innerHTML = '<option value="all">🏫 Tất cả các lớp</option>' + 
        uniqueClasses.map(cls => `<option value="${cls}">${cls.toLowerCase().includes('lớp') ? cls : 'Lớp ' + cls}</option>`).join('');
      classSel.value = currentVal;
    }
  },

    renderAdminView() {
    const students = this.getAllStudents();
    
    // 1. Update KPI metrics
    const totalEl = document.getElementById('adminTotalStudents');
    const totalMinitestEl = document.getElementById('adminTotalMinitests');
    const totalCertEl = document.getElementById('adminTotalCertificates');
    const totalPracticeEl = document.getElementById('adminTotalPractice');
    const totalWordsEl = document.getElementById('adminTotalWordsLearned');
    const totalXpEl = document.getElementById('adminTotalXP');
    const activeTodayEl = document.getElementById('adminActiveToday');

    const totalStudents = students.length;
    let totalXp = 0;
    let totalMastered = 0;
    let totalMinitests = 0;
    let totalCertificates = 0;
    let totalPractice = 0;
    
    students.forEach(s => {
      totalXp += (s.xp || 0);
      totalMastered += (s.masteredCount || 0);
      const mCount = (s.minitestHistory || []).length || (s.minitestCount || 0);
      const cCount = (s.certificates || []).length || mCount;
      const pCount = (s.practiceCount || 0) || (s.quizHistory || []).filter(h => h.mode !== 'MiniTest 15p').length;
      totalMinitests += mCount;
      totalCertificates += cCount;
      totalPractice += pCount;
    });

    if (totalEl) totalEl.textContent = totalStudents;
    if (totalMinitestEl) totalMinitestEl.textContent = totalMinitests;
    if (totalCertEl) totalCertEl.textContent = totalCertificates;
    if (totalPracticeEl) totalPracticeEl.textContent = totalPractice;
    if (totalWordsEl) totalWordsEl.textContent = totalMastered;
    if (totalXpEl) totalXpEl.textContent = totalXp.toLocaleString();
    if (activeTodayEl) activeTodayEl.textContent = totalStudents > 0 ? totalStudents : 0;

    // 2. Filter & Sort students
    this.renderStudentTable(students);
  },

    resetAllOldData() {
    if (!confirm('Thầy có chắc chắn muốn xóa hết tất cả thành viên cũ để chỉ tính tài khoản mới từ 12h trưa nay không?')) return;
    localStorage.removeItem('ALL_STUDENTS_LIST');
    localStorage.removeItem('ENG_STUDENT_PROFILE');
    localStorage.removeItem('ENG_GLOBAL_CHAT_INBOX');
    STUDENT_SYSTEM.currentStudent = null;
    STUDENT_SYSTEM.renderHeaderBadge();
    this.renderAdminView();
    alert('✓ Đã xóa sạch toàn bộ thành viên cũ! Hệ thống sẵn sàng nhận các tài khoản mới từ 12h trưa nay.');
  },

  renderStudentTable(studentsList) {
    const tbody = document.getElementById('adminStudentTableBody');
    if (!tbody) return;

    const searchTerm = (document.getElementById('adminSearchInput')?.value || '').toLowerCase().trim();
    const filterSchool = document.getElementById('adminSchoolFilter')?.value || 'all';
    const filterClass = document.getElementById('adminClassFilter')?.value || 'all';
    const filterGrade = document.getElementById('adminGradeFilter')?.value || 'all';
    const filterMinitest = document.getElementById('adminMinitestFilter')?.value || 'all';
    const sortOrder = document.getElementById('adminSortOrder')?.value || 'name_az';

    // A. Lọc theo các tiêu chí (Search, Trường, Lớp, Khối, Bài 15P)
    let filtered = studentsList.filter(s => {
      const matchSearch = !searchTerm || 
        (s.fullName || '').toLowerCase().includes(searchTerm) ||
        (s.username || '').toLowerCase().includes(searchTerm) ||
        (s.className || '').toLowerCase().includes(searchTerm) ||
        (s.school || '').toLowerCase().includes(searchTerm) ||
        (s.phone || '').includes(searchTerm);
      
      const matchSchool = (filterSchool === 'all') || (s.school || '').trim().toLowerCase() === filterSchool.toLowerCase();
      const matchClass = (filterClass === 'all') || (s.className || '').trim().toLowerCase() === filterClass.toLowerCase();
      const matchGrade = (filterGrade === 'all') || String(s.grade) === filterGrade;

      const mCount = (s.minitestHistory || []).length || (s.minitestCount || 0);
      const bScore = s.minitestBestScore || 0;
      let matchMinitest = true;
      if (filterMinitest === 'done') matchMinitest = mCount > 0;
      else if (filterMinitest === 'not_done') matchMinitest = mCount === 0;
      else if (filterMinitest === 'perfect') matchMinitest = bScore >= 10.0;
      else if (filterMinitest === 'good') matchMinitest = bScore >= 8.0;

      return matchSearch && matchSchool && matchClass && matchGrade && matchMinitest;
    });

    // B. Sắp xếp danh sách (Tự động ABC theo tên tiếng Việt hoặc theo tiêu chí)
    filtered.sort((a, b) => {
      if (sortOrder === 'name_az') {
        return compareVietnameseNames(a.fullName, b.fullName, true);
      } else if (sortOrder === 'name_za') {
        return compareVietnameseNames(a.fullName, b.fullName, false);
      } else if (sortOrder === 'diligence') {
        const da = (a.quizHistory || []).length * 20 + (a.streakDays || 1) * 30 + (a.xp || 0);
        const db = (b.quizHistory || []).length * 20 + (b.streakDays || 1) * 30 + (b.xp || 0);
        return db - da;
      } else if (sortOrder === 'attempts') {
        return (b.quizHistory || []).length - (a.quizHistory || []).length;
      } else if (sortOrder === 'xp') {
        return (b.xp || 0) - (a.xp || 0);
      } else if (sortOrder === 'date') {
        return (b.registeredAt || '').localeCompare(a.registeredAt || '');
      }
      return 0;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: #94a3b8; padding: 2.5rem;">Không tìm thấy học sinh nào phù hợp tiêu chí lọc.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map((s, idx) => {
      const minitestCount = (s.minitestHistory || []).length || (s.minitestCount || 0);
      const bestMinitest = s.minitestBestScore ? s.minitestBestScore.toFixed(1) : (minitestCount > 0 ? "10.0" : null);
      const certCount = (s.certificates || []).length || minitestCount;
      const practiceCount = (s.practiceCount || 0) || (s.quizHistory || []).filter(h => h.mode !== 'MiniTest 15p').length;

      const minitestBadge = minitestCount > 0 ? 
        `<div style="color: #facc15; font-weight: 800; font-size: 0.88rem;">🏆 ${minitestCount} lần (${bestMinitest}đ)</div>
         <div style="font-size: 0.75rem; color: #34d399; font-weight: 700; margin-top: 2px;">📜 ${certCount} Giấy khen</div>` : 
        `<span style="color: #64748b; font-size: 0.78rem;">Chưa làm test 15p</span>`;

      const lastQuiz = (s.quizHistory || []).find(h => h.mode !== 'MiniTest 15p') || (s.quizHistory && s.quizHistory[0]);
      const quizBadge = lastQuiz ? 
        `<span style="font-size: 0.73rem; background: rgba(99,102,241,0.2); padding: 2px 6px; border-radius: 4px; color: #818cf8; font-weight: 600;">${lastQuiz.mode}: ${lastQuiz.score}/${lastQuiz.total}</span>` : 
        '<span style="color: #64748b; font-size: 0.73rem;">Chưa ôn tập</span>';

      const classDisplay = s.className ? 
        (s.className.toLowerCase().includes('lớp') ? s.className : `Lớp ${s.className}`) : 
        `Lớp ${s.grade || '12'}`;

      const diligence = getStudentDiligence(s);

      return `
        <tr>
          <td><strong>#${idx + 1}</strong></td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 38px; height: 38px; border-radius: 50%; border: 1.5px solid #38bdf8; background: #1e293b; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                ${s.avatar && s.avatar.startsWith('data:image') ? 
                  `<img src="${s.avatar}" style="width: 100%; height: 100%; object-fit: cover;">` : 
                  `<span>${(typeof PRESET_AVATARS !== 'undefined' ? PRESET_AVATARS : []).find(a => a.id === s.avatar)?.icon || '👦'}</span>`}
              </div>
              <div>
                <div style="font-weight: 700; color: #ffffff; font-size: 0.95rem;">${s.fullName}</div>
                <div style="font-size: 0.74rem; color: #38bdf8; font-weight: 600;">🎂 ${s.birthDate ? formatBirthDate(s.birthDate) : 'Chưa cập nhật NS'}</div>
                <div style="font-size: 0.72rem; color: #94a3b8;">ĐK: ${s.registeredAt || 'Mới'}</div>
              </div>
            </div>
          </td>
          <td>
            <div style="font-weight: 800; color: #38bdf8; font-size: 0.85rem;">User: ${s.username || s.phone || 'Chưa đặt'}</div>
            <div style="font-size: 0.75rem; color: #facc15; font-family: monospace; margin-top: 2px;">MK: <span id="admPass_${idx}">••••••</span> <button type="button" onclick="ADMIN_SYSTEM.togglePasswordVisibility('admPass_${idx}', '${s.password || '123'}')" style="background:none; border:none; color:#38bdf8; cursor:pointer; font-size:0.75rem; padding: 0 2px;" title="Xem mật khẩu">👁️</button></div>
          </td>
          <td>
            <span class="grade-badge-tag" style="background: rgba(99,102,241,0.25); color: #a5b4fc; font-weight: 700; padding: 2px 8px; border-radius: 6px; font-size: 0.8rem;">
              ${classDisplay}
            </span>
            <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 2px;">Khối ${s.grade || '12'}</div>
          </td>
          <td style="color: #cbd5e1; font-weight: 500;">${s.school || 'THCS/THPT'}</td>
          <td>
            <div><a href="tel:${s.phone}" style="color: #38bdf8; text-decoration: none; font-weight: 700; font-size: 0.85rem;">📞 ${s.phone}</a></div>
            <div style="margin-top: 3px;">
              <a href="https://zalo.me/${s.phone}" target="_blank" style="font-size: 0.75rem; background: #0068ff; color: white; padding: 2px 7px; border-radius: 4px; text-decoration: none; font-weight: 600; display: inline-block;">Nhắn Zalo</a>
            </div>
          </td>
          <td>
            <div style="display: inline-flex; align-items: center; gap: 4px; background: ${diligence.bg}; border: 1px solid ${diligence.border}; color: ${diligence.color}; padding: 3px 8px; border-radius: 8px; font-weight: 700; font-size: 0.78rem;">
              ${diligence.stars} ${diligence.label}
            </div>
            <div style="font-size: 0.73rem; color: #94a3b8; margin-top: 2px;">Chuỗi: ${s.streakDays || 1} ngày • ${s.xp || 50} XP</div>
          </td>
          <td>
            ${minitestBadge}
          </td>
          <td>
            <div style="color: #38bdf8; font-weight: 800; font-size: 0.88rem;">📚 ${practiceCount} lượt ôn</div>
            <div style="margin-top: 2px;">${quizBadge}</div>
          </td>
          <td>
            <div style="display: flex; gap: 0.35rem; align-items: center;">
              <button onclick="ADMIN_SYSTEM.openStudentDetail('${s.id}')" style="background: linear-gradient(135deg, #0ea5e9, #0284c7); border: none; color: white; padding: 4px 9px; border-radius: 6px; cursor: pointer; font-size: 0.78rem; font-weight: 700; box-shadow: 0 2px 6px rgba(14,165,233,0.3);">
                👁️ Chi Tiết
              </button>
              <button onclick="ADMIN_SYSTEM.deleteStudent('${s.id}')" title="Xóa học sinh" style="background: rgba(244,63,94,0.15); border: 1px solid rgba(244,63,94,0.3); color: #f43f5e; padding: 4px 7px; border-radius: 6px; cursor: pointer; font-size: 0.75rem;">
                🗑️
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  openStudentDetail(studentId) {
    const students = this.getAllStudents();
    const student = students.find(s => s.id === studentId);
    if (!student) {
      alert('Không tìm thấy thông tin học sinh!');
      return;
    }

    const overlay = document.getElementById('studentDetailModalOverlay');
    const body = document.getElementById('detailStudentModalBody');
    const title = document.getElementById('detailStudentModalTitle');
    if (!overlay || !body) return;

    const classDisplay = student.className ? 
      (student.className.toLowerCase().includes('lớp') ? student.className : `Lớp ${student.className}`) : 
      `Lớp ${student.grade || '12'}`;
    const diligence = getStudentDiligence(student);
    const history = student.quizHistory || [];
    const minitests = student.minitestHistory || [];
    const stats = student.exerciseStats || {};
    const statsKeys = Object.keys(stats).filter(k => !k.includes('MiniTest 15p'));

    const minitestCount = minitests.length || (student.minitestCount || 0);
    const certCount = (student.certificates || []).length || minitestCount;
    const practiceCount = (student.practiceCount || 0) || history.filter(h => h.mode !== 'MiniTest 15p').length;

    if (title) title.innerHTML = `📊 Hồ Sơ Học Tập: <strong>${student.fullName}</strong> (${classDisplay})`;

    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        <!-- Card 1: Student Information & Diligence Badge -->
        <div style="background: linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9)); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div>
            <div style="font-size: 1.35rem; font-weight: 900; color: #ffffff;">👤 ${student.fullName}</div>
            <div style="color: #94a3b8; font-size: 0.92rem; margin-top: 0.25rem;">
              🏫 <strong>${classDisplay}</strong> (Khối ${student.grade || '12'}) • Trường: <strong>${student.school || 'THCS/THPT'}</strong>
            </div>
            <div style="color: #94a3b8; font-size: 0.88rem; margin-top: 0.25rem;">
              📱 Điện thoại: <a href="tel:${student.phone}" style="color: #38bdf8; font-weight: 700;">${student.phone}</a>
              <a href="https://zalo.me/${student.phone}" target="_blank" style="margin-left: 0.5rem; background: #0068ff; color: white; padding: 2px 7px; border-radius: 4px; font-size: 0.78rem; text-decoration: none;">Chat Zalo</a>
              • Đăng ký lúc: ${student.registeredAt || 'Mới'}
            </div>
          </div>
          <div style="text-align: right;">
            <div style="display: inline-flex; align-items: center; gap: 6px; background: ${diligence.bg}; border: 1px solid ${diligence.border}; color: ${diligence.color}; padding: 6px 14px; border-radius: 10px; font-weight: 800; font-size: 1rem;">
              ${diligence.stars} ${diligence.label}
            </div>
            <div style="color: #34d399; font-size: 0.85rem; font-weight: 700; margin-top: 0.4rem;">
              Hoạt động gần nhất: ${student.lastActiveAt || 'Hôm nay'}
            </div>
          </div>
        </div>

        <!-- Card 2: 5 KPI Metrics -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.75rem;">
          <div style="background: rgba(234,179,8,0.1); border: 1px solid rgba(234,179,8,0.3); padding: 0.85rem; border-radius: 12px; text-align: center;">
            <div style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; font-weight: 700;">Bài Test 15 Phút</div>
            <div style="font-size: 1.6rem; font-weight: 900; color: #facc15; margin-top: 0.25rem;">${minitestCount} lần</div>
          </div>
          <div style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); padding: 0.85rem; border-radius: 12px; text-align: center;">
            <div style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; font-weight: 700;">Giấy Khen Đã Cấp</div>
            <div style="font-size: 1.6rem; font-weight: 900; color: #34d399; margin-top: 0.25rem;">${certCount} cái</div>
          </div>
          <div style="background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.3); padding: 0.85rem; border-radius: 12px; text-align: center;">
            <div style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; font-weight: 700;">Lượt Ôn Tập Các Bài</div>
            <div style="font-size: 1.6rem; font-weight: 900; color: #38bdf8; margin-top: 0.25rem;">${practiceCount} lượt</div>
          </div>
          <div style="background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); padding: 0.85rem; border-radius: 12px; text-align: center;">
            <div style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; font-weight: 700;">Tổng Điểm XP</div>
            <div style="font-size: 1.6rem; font-weight: 900; color: #fbbf24; margin-top: 0.25rem;">⚡ ${student.xp || 50}</div>
          </div>
          <div style="background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.3); padding: 0.85rem; border-radius: 12px; text-align: center;">
            <div style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; font-weight: 700;">Chuỗi Ngày Streak</div>
            <div style="font-size: 1.6rem; font-weight: 900; color: #c084fc; margin-top: 0.25rem;">🔥 ${student.streakDays || 1} ngày</div>
          </div>
        </div>

        <!-- Card 3: 🏆 Lịch Sử Bài Kiểm Tra 15 Phút & Giấy Khen Đã Cấp -->
        <div style="background: rgba(15,23,42,0.7); border: 1.5px solid rgba(234,179,8,0.35); border-radius: 12px; padding: 1.1rem; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
            <h3 style="color: #facc15; font-size: 1.1rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
              <span>🏆 Bài Kiểm Tra 15 Phút & Giấy Khen Đã Cấp (${minitests.length} lần)</span>
            </h3>
            <span style="font-size: 0.85rem; color: #34d399; font-weight: 700; background: rgba(16,185,129,0.15); padding: 3px 10px; border-radius: 6px;">
              Điểm cao nhất: ${student.minitestBestScore ? student.minitestBestScore + '/10.0đ' : 'Chưa có'}
            </span>
          </div>
          ${minitests.length === 0 ? `
            <div style="color: #94a3b8; font-size: 0.9rem; padding: 0.6rem 0;">Học sinh chưa tham gia làm bài kiểm tra 15 phút nào.</div>
          ` : `
            <div style="max-height: 240px; overflow-y: auto;">
              <table class="admin-table" style="font-size: 0.85rem;">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Thời Gian</th>
                    <th>Bài Học (Unit)</th>
                    <th>Điểm Số (10.0)</th>
                    <th>Xếp Loại</th>
                    <th>Mã Xác Thực</th>
                    <th>Giấy Khen</th>
                  </tr>
                </thead>
                <tbody>
                  ${minitests.map((t, idx) => `
                    <tr>
                      <td>#${idx + 1}</td>
                      <td style="color: #94a3b8;">${t.date}</td>
                      <td><span class="grade-badge-tag" style="background: rgba(99,102,241,0.25); color: #a5b4fc;">Lớp ${t.grade || CURRENT_GRADE} - Unit ${t.unit}</span></td>
                      <td style="color: ${parseFloat(t.score) >= 8.0 ? '#34d399' : '#facc15'}; font-weight: 800; font-size: 0.95rem;">${t.score} / 10.0đ</td>
                      <td><span style="font-weight: 700; color: #facc15;">${t.rank || 'Xuất Sắc'}</span></td>
                      <td style="font-family: monospace; color: #38bdf8;">${t.certId || 'DVT-2026'}</td>
                      <td>
                        <button onclick="CERTIFICATE_CENTER.openModalForStudent('${student.id}', 'exam', '${t.score}', '${t.unit}', '${t.certId}')" style="background: linear-gradient(135deg, #eab308, #ca8a04); border: none; color: #000; font-weight: 800; padding: 3px 8px; border-radius: 6px; cursor: pointer; font-size: 0.75rem;">
                          📜 Xem Giấy Khen
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>

        <!-- Card 4: 📋 Thống Kê Các Bài Tập Ôn Tập Đã Làm -->
        <div style="background: rgba(15,23,42,0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.1rem;">
          <h3 style="color: #ffffff; font-size: 1.05rem; font-weight: 800; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
            <span>📚 Thống Kê Các Dạng Bài Ôn Tập & Rèn Luyện (${practiceCount} lượt)</span>
          </h3>
          ${statsKeys.length === 0 ? `
            <div style="color: #94a3b8; font-size: 0.9rem; padding: 0.6rem 0;">Chưa có dữ liệu ôn tập các bài học khác.</div>
          ` : `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 0.65rem;">
              ${statsKeys.map(k => {
                const item = stats[k];
                return `
                  <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 0.75rem 0.9rem; border-radius: 10px;">
                    <div style="font-weight: 700; color: #38bdf8; font-size: 0.92rem;">${item.name}</div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.82rem; color: #cbd5e1; margin-top: 0.35rem;">
                      <span>Số lần ôn: <strong style="color: #34d399;">${item.attempts} lần</strong></span>
                      <span>Điểm cao: <strong style="color: #fbbf24;">${item.bestScore}/${item.bestTotal}</strong></span>
                    </div>
                    <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 0.2rem;">Lần cuối: ${item.lastDate}</div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>

        <!-- Card 5: Bảng Nhật Ký Lịch Sử Làm Bài Từng Lần -->
        <div style="background: rgba(15,23,42,0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.1rem;">
          <h3 style="color: #ffffff; font-size: 1.05rem; font-weight: 800; margin-bottom: 0.75rem;">
            📜 Nhật Ký Chi Tiết Toàn Bộ Lượt Học (${history.length} lượt)
          </h3>
          ${history.length === 0 ? `
            <div style="color: #94a3b8; font-size: 0.9rem; padding: 0.5rem 0;">Chưa có dữ liệu làm bài.</div>
          ` : `
            <div style="max-height: 250px; overflow-y: auto;">
              <table class="admin-table" style="font-size: 0.85rem;">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Thời Gian</th>
                    <th>Khối & Bài Học</th>
                    <th>Dạng Bài Tập</th>
                    <th>Kết Quả Đạt Được</th>
                    <th>Thưởng XP</th>
                  </tr>
                </thead>
                <tbody>
                  ${history.map((h, i) => `
                    <tr>
                      <td>#${i + 1}</td>
                      <td style="color: #94a3b8;">${h.date}</td>
                      <td><span class="grade-badge-tag" style="background: rgba(99,102,241,0.25); color: #a5b4fc;">Lớp ${h.grade || CURRENT_GRADE} - Unit ${h.unit || '1'}</span></td>
                      <td style="color: #ffffff; font-weight: 600;">${h.mode}</td>
                      <td style="color: #34d399; font-weight: 700;">${h.scoreDisplay || `${h.score}/${h.total}`}</td>
                      <td style="color: #fbbf24; font-weight: 700;">+${h.xp || 10} XP</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>

        <!-- Actions -->
        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem;">
          <button class="header-btn" onclick="window.print()" style="background: #6366f1; padding: 0.6rem 1.25rem; font-weight: 700;">
            🖨️ In Báo Cáo Học Tập
          </button>
          <button class="header-btn" onclick="ADMIN_SYSTEM.closeDetailModal()" style="background: rgba(255,255,255,0.1); padding: 0.6rem 1.25rem;">
            ✕ Đóng Cửa Sổ
          </button>
        </div>
      </div>
    `;

    overlay.classList.add('active');
  },

  closeDetailModal() {
    const overlay = document.getElementById('studentDetailModalOverlay');
    if (overlay) overlay.classList.remove('active');
  },

  deleteStudent(studentId) {
    if (!confirm('Thầy có chắc chắn muốn xóa học sinh này khỏi danh sách quản lý?')) return;
    let students = this.getAllStudents();
    students = students.filter(s => s.id !== studentId);
    localStorage.setItem('ALL_STUDENTS_LIST', JSON.stringify(students));
    this.renderAdminView();
  },

  exportToExcel() {
    const students = this.getAllStudents();
    if (students.length === 0) {
      alert('Chưa có dữ liệu học sinh để xuất file!');
      return;
    }

    // Generate CSV with UTF-8 BOM so Excel opens Vietnamese characters perfectly
    let csvContent = '﻿';
    csvContent += 'STT,Họ và Tên,Lớp Học,Khối Sách,Trường Học,Số Điện Thoại,Mức Độ Chuyên Cần,Số Lần Test 15P,Điểm 15P Cao Nhất,Số Giấy Khen,Số Lần Ôn Tập Các Bài,Tổng Lượt Làm Bài,Chuỗi Ngày Streak,Tổng Điểm XP,Từ Đã Thuộc,Bài Tập Gần Nhất,Ngày Đăng Ký,Hoạt Động Cuối\r\n';
    const sorted = [...students].sort((a,b) => compareVietnameseNames(a.fullName, b.fullName, true));

    sorted.forEach((s, i) => {
      const diligence = getStudentDiligence(s);
      const minitestCount = (s.minitestHistory || []).length || (s.minitestCount || 0);
      const bestMinitest = s.minitestBestScore ? s.minitestBestScore.toFixed(1) : (minitestCount > 0 ? "10.0" : "0.0");
      const certCount = (s.certificates || []).length || minitestCount;
      const practiceCount = (s.practiceCount || 0) || (s.quizHistory || []).filter(h => h.mode !== 'MiniTest 15p').length;
      const totalAttempts = (s.quizHistory || []).length;

      const lastQuiz = s.quizHistory && s.quizHistory[0];
      const quizTxt = lastQuiz ? `${lastQuiz.mode} (${lastQuiz.score}/${lastQuiz.total}đ)` : 'Chưa làm bài';
      const cleanName = `"${(s.fullName || '').replace(/"/g, '""')}"`;
      const cleanClass = `"${(s.className || ('Lớp ' + (s.grade || '12'))).replace(/"/g, '""')}"`;
      const cleanSchool = `"${(s.school || '').replace(/"/g, '""')}"`;
      const cleanPhone = `"${s.phone || ''}"`;

      csvContent += `${i + 1},${cleanName},${cleanClass},Lớp ${s.grade || '12'},${cleanSchool},${cleanPhone},"${diligence.label}",${minitestCount},${bestMinitest},${certCount},${practiceCount},${totalAttempts},${s.streakDays || 1},${s.xp || 50},${s.masteredCount || 0},"${quizTxt}","${s.registeredAt || ''}","${s.lastActiveAt || ''}\r\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Danh_Sach_Hoc_Sinh_Tu_Vung_Chuyen_Can_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
// ==========================================
// 4. SMART VOCABULARY IMPORTER (TỰ PHÂN BIỆT LỚP 6-12)
// ==========================================
const SMART_IMPORTER = {
  parsedWords: [],
  detectedGrade: "12",
  detectedUnit: 1,

  handleFileUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const fname = file.name;
    this.autoDetectGradeAndUnit(fname);

    const statusEl = document.getElementById('importerStatus');
    if (statusEl) statusEl.textContent = `⏳ Đang đọc tệp: ${fname}...`;

    if (fname.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          this.processJsonImport(data);
        } catch (err) {
          alert('Lỗi định dạng JSON: ' + err.message);
        }
      };
      reader.readAsText(file, 'utf-8');
    } else {
      // Read as text / csv / tsv
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        this.processTextImport(text);
      };
      reader.readAsText(file, 'utf-8');
    }
  },

  autoDetectGradeAndUnit(text) {
    // Detect grade: 6, 7, 8, 9, 10, 11, 12
    const gradeMatch = text.match(/(?:Anh|Lớp|Grade|lop|g|tieng\s*anh)\s*([6-9]|1[0-2])\b/i);
    if (gradeMatch) {
      this.detectedGrade = gradeMatch[1];
      const sel = document.getElementById('importTargetGrade');
      if (sel) sel.value = this.detectedGrade;
    }

    // Detect unit: 1 to 12
    const unitMatch = text.match(/(?:Unit|bài|bai|u)\s*(\d+)/i);
    if (unitMatch) {
      this.detectedUnit = parseInt(unitMatch[1]);
      const sel = document.getElementById('importTargetUnit');
      if (sel) sel.value = this.detectedUnit;
    }
  },

  processTextImport(rawText) {
    const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const words = [];

    lines.forEach((line, idx) => {
      // Split by tab, pipe |, or comma
      let parts = [];
      if (line.includes('\t')) parts = line.split('\t');
      else if (line.includes('|')) parts = line.split('|');
      else if (line.includes(',')) parts = line.split(',');
      else parts = [line];

      parts = parts.map(p => p.trim()).filter(Boolean);
      if (parts.length === 0) return;

      // Skip header lines
      const firstUpper = parts[0].toUpperCase();
      if (firstUpper === 'WORD' || firstUpper === 'TỪ' || firstUpper === 'STT') return;

      let rawWord = parts[0];
      let ipa = '';
      let meaning = '';
      let example = '';

      if (parts.length >= 3) {
        ipa = parts[1];
        meaning = parts[2];
        if (parts.length >= 4) example = parts[3];
      } else if (parts.length === 2) {
        meaning = parts[1];
      }

      // Extract pos e.g. "achievement (n)"
      let pos = 'n';
      let word = rawWord;
      const posMatch = rawWord.match(/\(([^)]+)\)/);
      if (posMatch) {
        pos = posMatch[1].trim().toLowerCase();
        word = rawWord.replace(/\([^)]+\)/, '').trim();
      }

      word = word.replace(/^\d+[\.\-\s]+/, '').trim();

      if (word) {
        words.push({
          id: `u${this.detectedUnit}_imp_${idx + 1}`,
          unit: this.detectedUnit,
          word: word,
          pos: pos,
          raw_word: rawWord,
          ipa: ipa,
          meaning: meaning,
          example: example || `We study the word '${word}' in Unit ${this.detectedUnit}.`,
          example_vi: `Chúng em học từ '${word}' trong bài học Unit ${this.detectedUnit}.`,
          hint: `${word} (${pos}): ${meaning}`
        });
      }
    });

    this.parsedWords = words;
    this.renderPreviewTable();
  },

  processJsonImport(data) {
    if (Array.isArray(data)) {
      this.parsedWords = data;
    } else if (data.words && Array.isArray(data.words)) {
      this.parsedWords = data.words;
    } else {
      alert('Không nhận diện được danh sách từ trong file JSON!');
      return;
    }
    this.renderPreviewTable();
  },

  renderPreviewTable() {
    const countEl = document.getElementById('importerWordCount');
    const tbody = document.getElementById('importerPreviewTbody');
    const statusEl = document.getElementById('importerStatus');

    if (countEl) countEl.textContent = `${this.parsedWords.length} từ vựng`;
    if (statusEl) statusEl.textContent = `✅ Đã phân tích thành công ${this.parsedWords.length} từ vựng!`;

    if (!tbody) return;

    if (this.parsedWords.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #94a3b8; padding: 1.5rem;">Chưa có dữ liệu từ vựng được tải lên.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.parsedWords.map((w, idx) => `
      <tr>
        <td><strong>#${idx + 1}</strong></td>
        <td style="color: #38bdf8; font-weight: 700;">${w.word} <span style="font-size: 0.75rem; color: #94a3b8;">(${w.pos || 'n'})</span></td>
        <td style="color: #cbd5e1; font-family: monospace;">${w.ipa || '--'}</td>
        <td style="color: #fef08a;">${w.meaning || '--'}</td>
        <td style="font-size: 0.78rem; color: #94a3b8;">${w.example || '--'}</td>
      </tr>
    `).join('');
  },

  saveToDatabase() {
    if (this.parsedWords.length === 0) {
      alert('Chưa có từ vựng nào để lưu!');
      return;
    }

    const gradeSel = document.getElementById('importTargetGrade');
    const unitSel = document.getElementById('importTargetUnit');
    const targetGrade = gradeSel ? gradeSel.value : this.detectedGrade;
    const targetUnit = unitSel ? parseInt(unitSel.value) : this.detectedUnit;

    if (!ALL_VOCABULARY_DATA[targetGrade]) {
      ALL_VOCABULARY_DATA[targetGrade] = [];
    }

    let unitObj = ALL_VOCABULARY_DATA[targetGrade].find(u => u.unit === targetUnit);
    if (!unitObj) {
      unitObj = {
        unit: targetUnit,
        title: `Unit ${targetUnit}`,
        title_vi: `Bài Học ${targetUnit}`,
        raw_title: `Unit ${targetUnit}`,
        icon: "📘",
        color: GRADE_METADATA[targetGrade]?.color || "#6366f1",
        gradient: "linear-gradient(135deg, #6366f1, #4338ca)",
        theme_desc: `Chủ điểm từ vựng Lớp ${targetGrade} Unit ${targetUnit}`,
        word_count: 0,
        words: []
      };
      ALL_VOCABULARY_DATA[targetGrade].push(unitObj);
      ALL_VOCABULARY_DATA[targetGrade].sort((a, b) => a.unit - b.unit);
    }

    // Merge or replace words
    unitObj.words = this.parsedWords;
    unitObj.word_count = this.parsedWords.length;

    // Persist to custom localStorage
    try {
      localStorage.setItem('ENG_CUSTOM_DATABASE', JSON.stringify(ALL_VOCABULARY_DATA));
    } catch (e) {
      console.error('Error persisting custom database:', e);
    }

    alert(`🎉 Đã cập nhật thành công ${this.parsedWords.length} từ vựng vào Lớp ${targetGrade} - Unit ${targetUnit}!`);
    
    // Refresh current view if we are on this grade
    if (CURRENT_GRADE === targetGrade) {
      initUnitPills();
      selectUnit(targetUnit, true);
    }

    ADMIN_SYSTEM.closeAdminModal();
  },

  downloadDatabaseBackup() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ALL_VOCABULARY_DATA, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `vocabulary_data_full_grades_6_12.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
};

// ==========================================
// 5. MINI TEST 15 PHÚT & GIẤY KHEN ĐIỆN TỬ
// ==========================================
const MINITEST_SYSTEM = {
  questions: [],
  currentIndex: 0,
  score: 0,
  timerInterval: null,
  timeLeft: 900, // 15 phút (900s)

  init() {
    let words = [...(STATE.activeWords || [])]; // 100% bam sat Unit SGK hien tai

    if (words.length === 0) {
      const container = document.getElementById('minitestQuestionContainer');
      if (container) container.innerHTML = '<div style="text-align: center; color: #94a3b8; padding: 2rem;">Vui lòng chọn bài học có từ vựng để làm bài kiểm tra.</div>';
      return;
    }

    // TARGET: ĐÚNG 40 CÂU HỎI THEO YÊU CẦU CỦA THẦY
    const TARGET_COUNT = 40;
    const qList = [];
    const shuffledPool = fisherYatesShuffle(words);

    // Chuẩn bị 4 dạng bài tập sư phạm (10 câu mỗi dạng = 40 câu):
    // Dạng 0: Audio Listening (Nghe phát âm -> Chọn nghĩa)
    // Dạng 1: Reverse Recall (Nghĩa tiếng Việt -> Chọn từ tiếng Anh)
    // Dạng 2: Sentence Cloze (Điền từ vào ngữ cảnh câu ví dụ thực tế)
    // Dạng 3: Standard Choice (Từ tiếng Anh & Phiên âm -> Chọn nghĩa tiếng Việt)
    for (let i = 0; i < TARGET_COUNT; i++) {
      const target = shuffledPool[i % shuffledPool.length];
      
      // Chọn 3 phương án nhiễu hợp lý khác biệt từ
      const otherWords = words.filter(w => w.id !== target.id && w.word.toLowerCase() !== target.word.toLowerCase());
      const shuffledOthers = fisherYatesShuffle(otherWords).slice(0, 3);
      const options = fisherYatesShuffle([target, ...shuffledOthers]);

      const typeMod = i % 4;
      let qType = 'choice';
      let clozeSentence = '';

      if (typeMod === 0) {
        qType = 'audio';
      } else if (typeMod === 1) {
        qType = 'reverse';
      } else if (typeMod === 2) {
        qType = 'cloze';
        // Tạo câu khuyết từ từ ví dụ
        if (target.example && target.example.length > 5) {
          try {
            clozeSentence = target.example.replaceAll(target.word, '______');
            if (!clozeSentence.includes('______')) {
              const lowerWord = target.word.toLowerCase();
              clozeSentence = target.example.split(' ').map(w => w.toLowerCase().includes(lowerWord) ? '______' : w).join(' ');
            }
          } catch(e) {
            clozeSentence = `The student learned the word "______" in English class today.`;
          }
        }
        if (!clozeSentence || !clozeSentence.includes('______')) {
          clozeSentence = `The student learned the word "______" in English class today.`;
        }
      } else {
        qType = 'choice';
      }

      qList.push({
        type: qType,
        target: target,
        options: options,
        clozeSentence: clozeSentence
      });
    }

    // Đảo ngẫu nhiên vị trí các câu hỏi trong đề 40 câu
    this.questions = fisherYatesShuffle(qList);
    this.currentIndex = 0;
    this.score = 0;
    this.timeLeft = 900;

    this.startTimer();
    this.renderQuestion();
  },

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    const timerEl = document.getElementById('minitestTimerDisplay');
    
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (timerEl) {
        const mins = Math.floor(this.timeLeft / 60);
        const secs = this.timeLeft % 60;
        timerEl.textContent = `⏱️ ${mins}:${secs < 10 ? '0' : ''}${secs}`;
      }
      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.finishTest();
      }
    }, 1000);
  },

  renderQuestion() {
    const q = this.questions[this.currentIndex];
    const container = document.getElementById('minitestQuestionContainer');
    if (!container || !q) return;

    const progressEl = document.getElementById('minitestProgressDisplay');
    if (progressEl) progressEl.textContent = `Câu ${this.currentIndex + 1} / ${this.questions.length} (40 câu)`;

    if (q.type === 'audio') {
      container.innerHTML = `
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="display: inline-block; background: rgba(56,189,248,0.15); color: #38bdf8; font-size: 0.78rem; font-weight: 800; padding: 3px 14px; border-radius: 9999px; border: 1px solid rgba(56,189,248,0.3); margin-bottom: 0.6rem;">🎧 DẠNG 1: KỸ NĂNG NGHE PHÁT ÂM</div>
          <div>
            <button class="speaker-btn" onclick="SpeechEngine.speak('${q.target.word.replace(/'/g, "\'")}', 0.85)" style="width: 72px; height: 72px; font-size: 2.2rem; border-radius: 50%; margin-bottom: 0.75rem; cursor: pointer; background: rgba(56,189,248,0.2); border: 2px solid #38bdf8;">🔊</button>
          </div>
          <div style="font-size: 0.95rem; color: #94a3b8;">Lắng nghe phát âm và chọn nghĩa tiếng Việt chính xác:</div>
        </div>
        <div class="quiz-options-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem;">
          ${q.options.map(opt => `
            <button class="quiz-opt-btn" onclick="MINITEST_SYSTEM.handleAnswer('${opt.id}', '${q.target.id}')">
              ${opt.meaning}
            </button>
          `).join('')}
        </div>
      `;
      setTimeout(() => SpeechEngine.speak(q.target.word, 0.85), 300);
    } else if (q.type === 'reverse') {
      container.innerHTML = `
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="display: inline-block; background: rgba(168,85,247,0.15); color: #c084fc; font-size: 0.78rem; font-weight: 800; padding: 3px 14px; border-radius: 9999px; border: 1px solid rgba(168,85,247,0.3); margin-bottom: 0.6rem;">🔄 DẠNG 2: PHẢN XẠ NGHĨA → TỪ TIẾNG ANH</div>
          <div style="font-size: 1.7rem; font-weight: 800; color: #f472b6; margin-bottom: 0.3rem;">"${q.target.meaning}"</div>
          <div style="font-size: 0.92rem; color: #cbd5e1; margin-top: 0.4rem;">Nghĩa tiếng Việt trên tương ứng với từ tiếng Anh nào dưới đây?</div>
        </div>
        <div class="quiz-options-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem;">
          ${q.options.map(opt => `
            <button class="quiz-opt-btn" onclick="MINITEST_SYSTEM.handleAnswer('${opt.id}', '${q.target.id}')" style="font-size: 1.05rem; font-weight: 700;">
              ${opt.word}
            </button>
          `).join('')}
        </div>
      `;
    } else if (q.type === 'cloze') {
      const sentence = q.clozeSentence || `The word is "______".`;
      container.innerHTML = `
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="display: inline-block; background: rgba(245,158,11,0.15); color: #fbbf24; font-size: 0.78rem; font-weight: 800; padding: 3px 14px; border-radius: 9999px; border: 1px solid rgba(245,158,11,0.3); margin-bottom: 0.6rem;">📖 DẠNG 3: ĐIỀN TỪ VÀO NGỮ CẢNH CÂU VÍ DỤ</div>
          <div style="font-size: 1.15rem; font-style: italic; color: #ffffff; line-height: 1.6; max-width: 620px; margin: 0 auto 0.5rem; background: rgba(255,255,255,0.04); padding: 0.85rem 1.25rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
            "${sentence}"
          </div>
          <div style="font-size: 0.88rem; color: #94a3b8; margin-top: 0.4rem;">💡 Gợi ý nghĩa: <span style="color: #34d399; font-weight: 700;">${q.target.meaning}</span></div>
        </div>
        <div class="quiz-options-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem;">
          ${q.options.map(opt => `
            <button class="quiz-opt-btn" onclick="MINITEST_SYSTEM.handleAnswer('${opt.id}', '${q.target.id}')" style="font-size: 1.05rem; font-weight: 700;">
              ${opt.word}
            </button>
          `).join('')}
        </div>
      `;
    } else {
      // Standard choice
      container.innerHTML = `
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="display: inline-block; background: rgba(16,185,129,0.15); color: #34d399; font-size: 0.78rem; font-weight: 800; padding: 3px 14px; border-radius: 9999px; border: 1px solid rgba(16,185,129,0.3); margin-bottom: 0.6rem;">🎯 DẠNG 4: NHẬN BIẾT TỪ VỰNG & PHIÊN ÂM</div>
          <div style="font-size: 1.85rem; font-weight: 800; color: #38bdf8; margin-bottom: 0.25rem;">${q.target.word}</div>
          <div style="font-size: 1rem; color: #94a3b8; font-family: monospace;">${q.target.ipa || ''} <span style="color: #f59e0b; font-size: 0.8rem; text-transform: uppercase;">(${q.target.pos || 'từ'})</span></div>
          <div style="font-size: 0.9rem; color: #cbd5e1; margin-top: 0.5rem;">Từ trên có nghĩa tiếng Việt là gì?</div>
        </div>
        <div class="quiz-options-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem;">
          ${q.options.map(opt => `
            <button class="quiz-opt-btn" onclick="MINITEST_SYSTEM.handleAnswer('${opt.id}', '${q.target.id}')">
              ${opt.meaning}
            </button>
          `).join('')}
        </div>
      `;
    }
  },

  handleAnswer(selectedId, correctId) {
    if (selectedId === correctId) {
      this.score++;
      if (typeof SFX !== 'undefined') SFX.playCorrect();
    } else {
      if (typeof SFX !== 'undefined') SFX.playIncorrect();
      // Add to weak words!
      const targetObj = (STATE.activeWords || []).find(w => w.id === correctId);
      if (targetObj && typeof WEAKWORDS_SYSTEM !== 'undefined') {
        WEAKWORDS_SYSTEM.addWeakWord(targetObj);
      }
    }

    this.currentIndex++;
    if (this.currentIndex < this.questions.length) {
      this.renderQuestion();
    } else {
      this.finishTest();
    }
  },

  finishTest() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    const total = this.questions.length || 40;
    const finalScore = total > 0 ? ((this.score / total) * 10).toFixed(1) : "0.0";

    // Ghi nhận kết quả và cấp Giấy Khen Điện Tử chính thức
    STUDENT_SYSTEM.recordMinitestResult(STATE.currentUnit, this.score, total, finalScore);

    const container = document.getElementById('minitestQuestionContainer');
    if (container) {
      const numScore = parseFloat(finalScore);
      let rank = "XUẤT SẮC";
      if (numScore < 5.0) rank = "HOÀN THÀNH";
      else if (numScore < 6.5) rank = "TRUNG BÌNH KHÁ";
      else if (numScore < 8.0) rank = "KHÁ";
      else if (numScore < 9.0) rank = "GIỎI";
      else rank = "XUẤT SẮC";

      container.innerHTML = `
        <div style="text-align: center; padding: 2.2rem 1rem;">
          <div style="font-size: 3.6rem; margin-bottom: 0.5rem;">${numScore >= 8.0 ? '🏆' : '⭐'}</div>
          <h2 style="font-size: 1.65rem; color: #ffffff; margin-bottom: 0.35rem;">Kết Quả Bài Kiểm Tra 15 Phút (40 Câu)</h2>
          <div style="font-size: 2.8rem; font-weight: 900; color: ${numScore >= 8.0 ? '#34d399' : (numScore >= 6.5 ? '#38bdf8' : '#f59e0b')}; margin-bottom: 0.25rem;">
            ${finalScore} / 10.0 Điểm
          </div>
          <div style="font-size: 1rem; color: #94a3b8; margin-bottom: 0.5rem;">
            Đúng <strong>${this.score} / ${total} câu</strong> (0.25đ / câu)
          </div>
          <div style="font-size: 1.15rem; font-weight: 800; color: #facc15; margin-bottom: 1rem;">
            Xếp loại: ${rank}
          </div>
          <p style="color: #cbd5e1; max-width: 540px; margin: 0 auto 1.5rem; line-height: 1.6; font-size: 0.95rem;">
            Chúc mừng em đã hoàn thành bài kiểm tra 15 phút gồm 40 câu hỏi từ vựng Tiếng Anh! 
            ${numScore >= 8.0 ? 'Hệ thống đã tự động cấp <strong>GIẤY KHEN ĐIỆN TỬ CHÍNH THỨC</strong> có con dấu và chữ ký của <strong>Thầy giáo Đinh Văn Thành</strong> cho em!' : 'Hãy tiếp tục ôn tập và làm lại để đạt từ 8.0 điểm trở lên và nhận Giấy Khen Điện Tử nhé!'}
          </p>
          <div style="display: flex; gap: 0.85rem; justify-content: center; flex-wrap: wrap;">
            ${numScore >= 8.0 ? `
              <button class="header-btn" onclick="MINITEST_SYSTEM.showCertificate('${finalScore}')" style="background: linear-gradient(135deg, #eab308, #ca8a04); color: #000; font-weight: 900; font-size: 1.05rem; padding: 0.75rem 1.6rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(234,179,8,0.5);">
                📜 Xem & Tải Giấy Khen Điện Tử
              </button>
            ` : ''}
            <button class="header-btn" onclick="MINITEST_SYSTEM.init()" style="padding: 0.75rem 1.4rem; font-weight: 700; border-radius: 12px;">
              🔄 Làm Lại Đề 40 Câu Khác
            </button>
          </div>
        </div>
      `;
    }
  },

  showCertificate(scoreStr) {
    if (typeof CERTIFICATE_SYSTEM !== 'undefined') {
      CERTIFICATE_SYSTEM.openCertificate(STATE.currentUnit, scoreStr, STUDENT_SYSTEM.currentStudent);
    }
  }
};

// ==========================================
// 6. WEAK WORDS NOTEBOOK (SPACED REPETITION)
// ==========================================
const WEAKWORDS_SYSTEM = {
  weakWords: [],

  init() {
    this.loadWeakWords();
    this.renderTab();
    this.updateBadge();
  },

  loadWeakWords() {
    try {
      const saved = localStorage.getItem(`ENG_WEAK_WORDS_${CURRENT_GRADE}`);
      if (saved) this.weakWords = JSON.parse(saved);
      else this.weakWords = [];
    } catch (e) {
      this.weakWords = [];
    }
  },

  saveWeakWords() {
    try {
      localStorage.setItem(`ENG_WEAK_WORDS_${CURRENT_GRADE}`, JSON.stringify(this.weakWords));
      this.updateBadge();
    } catch (e) {}
  },

  addWeakWord(wordObj) {
    if (!wordObj || !wordObj.word) return;
    const exists = this.weakWords.find(w => w.word.toLowerCase() === wordObj.word.toLowerCase());
    if (!exists) {
      this.weakWords.push({
        ...wordObj,
        wrongCount: 1,
        addedAt: new Date().toLocaleDateString('vi-VN')
      });
      this.saveWeakWords();
    } else {
      exists.wrongCount = (exists.wrongCount || 1) + 1;
      this.saveWeakWords();
    }
  },

  removeWeakWord(wordId) {
    this.weakWords = this.weakWords.filter(w => w.id !== wordId);
    this.saveWeakWords();
    this.renderTab();
  },

  updateBadge() {
    const badge = document.getElementById('weakWordsCountBadge');
    if (badge) badge.textContent = this.weakWords.length;
  },

  renderTab() {
    const container = document.getElementById('weakWordsListContainer');
    if (!container) return;

    if (this.weakWords.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: #94a3b8;">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">🎉</div>
          <h3 style="color: #ffffff; font-size: 1.2rem; margin-bottom: 0.25rem;">Tuyệt vời! Em chưa có từ khó nào cần ôn</h3>
          <p style="font-size: 0.88rem;">Khi làm sai ở các bài tập Trắc nghiệm, Flashcard hoặc Luyện Gõ, từ sẽ tự động được lưu vào đây để em ôn luyện lại.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
        <div style="font-size: 0.95rem; color: #cbd5e1;">Danh sách <strong>${this.weakWords.length} từ khó</strong> cần ôn tập cấp tốc:</div>
        <button class="header-btn" onclick="WEAKWORDS_SYSTEM.clearAll()" style="color: #f43f5e; border-color: rgba(244,63,94,0.3); font-size: 0.8rem;">🗑️ Xóa Tất Cả</button>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.75rem;">
        ${this.weakWords.map(w => `
          <div class="weakword-card" style="background: rgba(244,63,94,0.06); border: 1px solid rgba(244,63,94,0.25); border-radius: 12px; padding: 0.9rem; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.4rem;">
                <span style="font-size: 1.1rem; font-weight: 800; color: #ffffff;">${w.word}</span>
                <span style="font-size: 0.75rem; color: #94a3b8;">(${w.pos || 'n'})</span>
                <button class="speaker-btn-inline" onclick="SpeechEngine.speak('${w.word}', 0.85)" style="background:none; border:none; cursor:pointer;">🔊</button>
              </div>
              <div style="font-size: 0.82rem; color: #cbd5e1; font-family: monospace;">${w.ipa || ''}</div>
              <div style="font-size: 0.9rem; color: #fef08a; margin-top: 0.2rem;">${w.meaning || ''}</div>
            </div>
            <button onclick="WEAKWORDS_SYSTEM.removeWeakWord('${w.id}')" title="Đã thuộc từ này" style="background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); color: #34d399; padding: 4px 8px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; font-weight: 700;">
              ✓ Đã thuộc
            </button>
          </div>
        `).join('')}
      </div>
    `;
  },

  clearAll() {
    if (!confirm('Em có chắc muốn xóa tất cả từ trong Sổ tay từ khó?')) return;
    this.weakWords = [];
    this.saveWeakWords();
    this.renderTab();
  }
};

// ==========================================
// 7. SHARE & SHORT LINK SYSTEM
// ==========================================
const SHARE_SYSTEM = {
  shortUrl: 'https://dekiemtraso.com/hocsinh',

  openShareModal() {
    const overlay = document.getElementById('shareModalOverlay');
    if (!overlay) return;

    const urlDisplay = document.getElementById('shareUrlDisplay');
    if (urlDisplay) urlDisplay.textContent = this.shortUrl;

    this.renderQrCode();
    overlay.classList.add('active');
  },

  closeShareModal() {
    const overlay = document.getElementById('shareModalOverlay');
    if (overlay) overlay.classList.remove('active');
  },

  copyShortLink() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(this.shortUrl).then(() => {
        alert(`✅ Đã sao chép đường link ngắn: ${this.shortUrl}\nThầy/Cô và các em có thể dán vào Zalo/Facebook để chia sẻ!`);
      });
    } else {
      prompt('Sao chép đường link bên dưới:', this.shortUrl);
    }
  },

  shareZalo() {
    const zaloUrl = `https://zalo.me/share?url=${encodeURIComponent(this.shortUrl)}&title=${encodeURIComponent('Học Từ Vựng Tiếng Anh 6 - 12 (Global Success) Miễn Phí')}`;
    window.open(zaloUrl, '_blank');
  },

  renderQrCode() {
    const canvas = document.getElementById('shareQrCanvas');
    if (!canvas) return;

    // Draw high quality styled QR badge directly on canvas
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;

    // Draw frame
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 200, 200);

    // Use QuickChart QR image or fallback pattern
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(this.shortUrl)}`;
    img.onload = () => {
      ctx.drawImage(img, 10, 10, 180, 180);
    };
    img.onerror = () => {
      // Offline fallback text
      ctx.fillStyle = '#0f172a';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('dekiemtraso.com/hocsinh', 100, 100);
    };
  }
};

/**
 * ==============================================================================
 * ENG 6-12 VOCAB MASTER - GAMIFICATION & CERTIFICATES ENGINE
 * Tác giả: Thầy giáo Đinh Văn Thành (THCS Đồng Yên)
 * Khen thưởng kịp thời, động viên, tích điểm, cấp chứng chỉ chuyên cần & % đã đạt
 * ==============================================================================
 */

const LEVELS_CONFIG = [
  { level: 1, minXP: 0, title: "Tân Binh", icon: "🥉", color: "#94a3b8" },
  { level: 2, minXP: 150, title: "Tập Sự Chăm Chỉ", icon: "🥈", color: "#a3e635" },
  { level: 3, minXP: 400, title: "Chiến Binh Từ Vựng", icon: "🥇", color: "#facc15" },
  { level: 4, minXP: 800, title: "Siêu Trí Nhớ Bạc", icon: "💎", color: "#38bdf8" },
  { level: 5, minXP: 1500, title: "Siêu Trí Nhớ Vàng", icon: "👑", color: "#fb923c" },
  { level: 6, minXP: 2500, title: "Bậc Thầy Ngôn Ngữ", icon: "🏆", color: "#c084fc" },
  { level: 7, minXP: 4000, title: "Huyền Thoại Tiếng Anh", icon: "⚡", color: "#f43f5e" }
];

const BADGES_LIST = [
  { id: "b_streak_3", icon: "🔥", title: "Ngọn Lửa Chuyên Cần", desc: "Học tập liên tục 3 ngày không nghỉ", check: s => (s.streakDays || 1) >= 3 },
  { id: "b_words_20", icon: "📚", title: "Kho Tàng Từ Vựng", desc: "Thuộc làu từ 20 từ vựng trở lên", check: s => (s.masteredCount || 0) >= 20 },
  { id: "b_spelling_5", icon: "✍️", title: "Bậc Thầy Chính Tả", desc: "Gõ đúng chuẩn xác 5 từ tiếng Anh", check: s => (s.spellingCorrect || 0) >= 5 },
  { id: "b_quiz_perfect", icon: "🎯", title: "Thiện Xạ Trắc Nghiệm", desc: "Đạt điểm tuyệt đối 10/10 bài Quiz", check: s => (s.quizHistory || []).some(q => q.score === q.total && q.total >= 8) },
  { id: "b_master_100", icon: "💎", title: "Chinh Phục 100%", desc: "Đạt 100% tỷ lệ thuộc từ của một Unit", check: s => (s.completedUnits || []).length >= 1 },
  { id: "b_xp_500", icon: "⚡", title: "Đại Sứ Chuyên Cần", desc: "Tích lũy từ 500 điểm kinh nghiệm XP", check: s => (s.xp || 0) >= 500 }
];

const GAMIFICATION = {
  currentCombo: 0,
  comboTimer: null,

  init() {
    this.updateUI();
  },

  // Get current Level info
  getLevelInfo(xp = 0) {
    let current = LEVELS_CONFIG[0];
    let next = LEVELS_CONFIG[1];

    for (let i = 0; i < LEVELS_CONFIG.length; i++) {
      if (xp >= LEVELS_CONFIG[i].minXP) {
        current = LEVELS_CONFIG[i];
        next = LEVELS_CONFIG[i + 1] || null;
      } else {
        break;
      }
    }

    let progressPct = 100;
    if (next) {
      const range = next.minXP - current.minXP;
      const currentProgress = xp - current.minXP;
      progressPct = Math.min(100, Math.max(0, Math.round((currentProgress / range) * 100)));
    }

    return { current, next, progressPct };
  },

  // KHEN THƯỞNG KỊP THỜI: CỘNG ĐIỂM + HIỆU ỨNG BAY + ÂM THANH
  awardXP(amount = 10, reason = "Đúng từ vựng", targetElement = null) {
    if (!STUDENT_SYSTEM.currentStudent) {
      STUDENT_SYSTEM.loadStudent();
    }
    const student = STUDENT_SYSTEM.currentStudent;
    if (!student) return;

    // Check combo
    this.currentCombo++;
    if (this.comboTimer) clearTimeout(this.comboTimer);
    this.comboTimer = setTimeout(() => {
      this.currentCombo = 0;
    }, 4500);

    let finalAmount = amount;
    if (this.currentCombo >= 5) finalAmount += 15;
    else if (this.currentCombo >= 3) finalAmount += 5;

    const oldLevel = this.getLevelInfo(student.xp || 0).current.level;
    STUDENT_SYSTEM.addXP(finalAmount);
    const newLevel = this.getLevelInfo(student.xp || 0).current.level;

    // Show floating +XP
    this.showFloatingXP(finalAmount, targetElement);

    // Audio chime
    if (typeof SFX !== 'undefined' && SFX.playCorrect) {
      SFX.playCorrect();
    }

    // Check Level Up
    if (newLevel > oldLevel) {
      this.celebrateLevelUp(newLevel);
    }

    this.updateUI();
  },

  showFloatingXP(amount, el) {
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2 - 50;

    if (el && typeof el.getBoundingClientRect === 'function') {
      const rect = el.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top;
    } else {
      x = Math.max(80, Math.min(window.innerWidth - 80, x + (Math.random() * 80 - 40)));
      y = Math.max(80, y + (Math.random() * 40 - 20));
    }

    const floatEl = document.createElement('div');
    floatEl.className = 'floating-xp';
    floatEl.style.left = `${x}px`;
    floatEl.style.top = `${y}px`;
    floatEl.innerHTML = `⭐ +${amount} XP ${this.currentCombo >= 3 ? `🔥x${this.currentCombo}` : ''}`;

    document.body.appendChild(floatEl);
    setTimeout(() => {
      if (floatEl.parentNode) floatEl.parentNode.removeChild(floatEl);
    }, 1100);
  },

  celebrateLevelUp(newLevel) {
    const info = LEVELS_CONFIG.find(l => l.level === newLevel) || LEVELS_CONFIG[0];
    if (typeof confetti === 'function') {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    }
    setTimeout(() => {
      alert(`🎉 CHÚC MỪNG EM ĐÃ LÊN CẤP!\n${info.icon} CẤP ${info.level}: ${info.title.toUpperCase()}\nNhận thêm 50 XP thưởng thăng hạng!`);
    }, 300);
  },

  // Calculate Unit Progress Percentage
  getUnitMastery() {
    const words = STATE.activeWords || [];
    if (words.length === 0) return { mastered: 0, total: 0, percent: 0 };
    
    let masteredCount = 0;
    words.forEach(w => {
      if (STATE.mastered && STATE.mastered.has(w.id)) {
        masteredCount++;
      }
    });

    const percent = Math.round((masteredCount / words.length) * 100);
    return { mastered: masteredCount, total: words.length, percent };
  },

  updateUI() {
    const student = STUDENT_SYSTEM.currentStudent;
    if (!student) return;

    const { current, next, progressPct } = this.getLevelInfo(student.xp || 0);

    // Update Header Student Info
    const nameSpan = document.getElementById('studentHeaderName');
    if (nameSpan) {
      nameSpan.innerHTML = `
        <span style="font-weight: 800; color: #ffffff;">${student.fullName}</span>
        <span class="student-level-badge">${current.icon} Lv.${current.level} ${current.title}</span>
        <span class="student-streak-badge" title="Chuỗi ngày học liên tục">🔥 ${student.streakDays || 1} ngày</span>
      `;
    }

    // Update Unit Progress Bar & Percentage in unit banner
    const { mastered, total, percent } = this.getUnitMastery();
    const unitBadge = document.getElementById('unitWordCountBadge');
    if (unitBadge) {
      unitBadge.innerHTML = `
        <span class="unit-progress-badge" title="Tỷ lệ % từ vựng đã thuộc trong Unit này">
          🎯 ${percent}% Đạt (${mastered}/${total} từ)
        </span>
      `;
    }

    // Check 100% completion
    if (percent === 100 && total > 0) {
      if (!student.completedUnits) student.completedUnits = [];
      const unitKey = `${CURRENT_GRADE}_${STATE.currentUnit}`;
      if (!student.completedUnits.includes(unitKey)) {
        student.completedUnits.push(unitKey);
        STUDENT_SYSTEM.saveStudent();
        if (typeof confetti === 'function') {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
        }
      }
    }
  }
};

// ==========================================
// TRUNG TÂM CHỨNG CHỈ & GIẤY KHEN ĐIỆN TỬ
// ==========================================
const CERTIFICATE_CENTER = {
  currentType: 'diligence', // 'diligence' | 'mastery' | 'exam'
  targetStudent: null,
  customScore: null,
  customUnit: null,
  customCertId: null,

  openModal(type = 'diligence', customScore = null) {
    this.currentType = type;
    this.targetStudent = null;
    this.customScore = customScore;
    this.customUnit = null;
    this.customCertId = null;

    const overlay = document.getElementById('certificateCenterModalOverlay');
    if (!overlay) return;

    overlay.classList.add('active');
    this.renderTabs();
    this.renderCertificate();
  },

  openModalForStudent(studentId, type = 'exam', score = null, unit = null, certId = null) {
    const students = ADMIN_SYSTEM.getAllStudents();
    const student = students.find(s => s.id === studentId);
    if (!student) {
      alert('Không tìm thấy học sinh!');
      return;
    }

    this.currentType = type;
    this.targetStudent = student;
    this.customScore = score;
    this.customUnit = unit;
    this.customCertId = certId;

    const overlay = document.getElementById('certificateCenterModalOverlay');
    if (!overlay) return;

    overlay.classList.add('active');
    this.renderTabs();
    this.renderCertificate();
  },

  closeModal() {
    const overlay = document.getElementById('certificateCenterModalOverlay');
    if (overlay) overlay.classList.remove('active');
    this.targetStudent = null;
    this.customScore = null;
    this.customUnit = null;
    this.customCertId = null;
  },

  switchType(type) {
    this.currentType = type;
    this.renderTabs();
    this.renderCertificate();
  },

  renderTabs() {
    const tabs = [
      { id: 'exam', label: '🏆 Giấy Khen Điểm Thi 15P' },
      { id: 'diligence', label: '📜 Chứng Chỉ Chuyên Cần' },
      { id: 'mastery', label: '🎖️ Chứng Nhận % Hoàn Thành' },
      { id: 'badges', label: '🏅 Bảng Vàng Huy Hiệu' }
    ];

    const container = document.getElementById('certTabsContainer');
    if (!container) return;

    container.innerHTML = tabs.map(t => `
      <button class="cert-tab-btn ${this.currentType === t.id ? 'active' : ''}" onclick="CERTIFICATE_CENTER.switchType('${t.id}')">
        ${t.label}
      </button>
    `).join('');
  },

  renderCertificate() {
    const canvas = document.getElementById('certDisplayCanvas');
    const badgeContainer = document.getElementById('certBadgesContainer');
    const actions = document.getElementById('certDownloadActions');

    if (this.currentType === 'badges') {
      if (canvas) canvas.style.display = 'none';
      if (badgeContainer) {
        badgeContainer.style.display = 'grid';
        this.renderBadges(badgeContainer);
      }
      if (actions) actions.style.display = 'none';
      return;
    }

    if (canvas) canvas.style.display = 'block';
    if (badgeContainer) badgeContainer.style.display = 'none';
    if (actions) actions.style.display = 'flex';

    if (!canvas) return;
    this.drawCertificateOnCanvas(canvas);
  },

  renderBadges(container) {
    const student = this.targetStudent || STUDENT_SYSTEM.currentStudent || {};
    container.innerHTML = BADGES_LIST.map(b => {
      const isUnlocked = b.check(student);
      return `
        <div class="badge-card ${isUnlocked ? 'unlocked' : 'locked'}">
          <div class="badge-icon">${b.icon}</div>
          <div class="badge-title">${b.title}</div>
          <div class="badge-desc">${b.desc}</div>
          <div class="badge-status ${isUnlocked ? 'achieved' : 'not-achieved'}">
            ${isUnlocked ? '✓ Đã Đạt Được' : '🔒 Đang Phấn Đấu'}
          </div>
        </div>
      `;
    }).join('');
  },

  drawCertificateOnCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = 1600;
    canvas.height = 1100;

    const student = this.targetStudent || STUDENT_SYSTEM.currentStudent || {
      fullName: "Đinh Văn Thành",
      className: "8A1",
      grade: CURRENT_GRADE || "8",
      school: "Trường THCS Đồng Yên"
    };

    const classStr = student.className ? 
      (student.className.toLowerCase().includes('lớp') ? student.className : `Lớp ${student.className}`) : 
      `Lớp ${student.grade || CURRENT_GRADE}`;

    const currentUnit = this.customUnit || STATE.currentUnit || 1;
    const score = this.customScore || (student.minitestBestScore ? student.minitestBestScore.toFixed(1) : "10.0");
    const numScore = parseFloat(score);
    let rank = "XUẤT SẮC";
    if (numScore < 5.0) rank = "HOÀN THÀNH";
    else if (numScore < 6.5) rank = "TRUNG BÌNH KHÁ";
    else if (numScore < 8.0) rank = "KHÁ";
    else if (numScore < 9.0) rank = "GIỎI";
    else rank = "XUẤT SẮC";

    const certCode = this.customCertId || ('DVT-' + (new Date().getFullYear()) + '-' + Math.floor(Math.random() * 89999 + 10000));
    const { percent } = (typeof GAMIFICATION !== 'undefined' && GAMIFICATION.getUnitMastery) ? GAMIFICATION.getUnitMastery() : { percent: 85 };

    // 1. Background Paper (Warm Cream Pedagogy Certificate)
    const bgGrad = ctx.createLinearGradient(0, 0, 1600, 1100);
    bgGrad.addColorStop(0, '#fffef8');
    bgGrad.addColorStop(0.5, '#fefbf0');
    bgGrad.addColorStop(1, '#fff9e6');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1600, 1100);

    // Subtle guilloche mesh lines for security
    ctx.fillStyle = 'rgba(217, 119, 6, 0.035)';
    for (let i = 40; i < 1560; i += 32) {
      ctx.fillRect(i, 40, 2, 1020);
    }
    for (let j = 40; j < 1060; j += 32) {
      ctx.fillRect(40, j, 1520, 2);
    }

    // 2. Royal Ornate Dual Borders
    ctx.lineWidth = 18;
    ctx.strokeStyle = '#b45309'; // Rich Amber/Bronze Gold
    ctx.strokeRect(36, 36, 1528, 1028);

    ctx.lineWidth = 4;
    ctx.strokeStyle = '#f59e0b';
    ctx.strokeRect(52, 52, 1496, 996);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#d97706';
    ctx.strokeRect(62, 62, 1476, 976);

    // Corner decorative fleurons
    const corners = [[62, 62], [1538, 62], [62, 1038], [1538, 1038]];
    corners.forEach(([cx, cy]) => {
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Top National Header (Quốc hiệu & Tiêu ngữ)
    ctx.textAlign = 'center';
    ctx.font = 'bold 22px "Times New Roman", serif';
    ctx.fillStyle = '#1e293b';
    ctx.fillText('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', 800, 110);

    ctx.font = 'bold 19px "Times New Roman", serif';
    ctx.fillStyle = '#334155';
    ctx.fillText('Độc lập - Tự do - Hạnh phúc', 800, 140);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#b45309';
    ctx.beginPath();
    ctx.moveTo(710, 152);
    ctx.lineTo(890, 152);
    ctx.stroke();

    // Institution Header
    ctx.font = 'bold 18px "Times New Roman", serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('BỘ GIÁO DỤC VÀ ĐÀO TẠO • HỆ THỐNG LUYỆN TỪ VỰNG TIẾNG ANH GLOBAL SUCCESS (6 - 12)', 800, 185);

    // Main Certificate Title
    let mainTitle = 'GIẤY KHEN';
    let subTitle = 'CHỨNG NHẬN THÀNH TÍCH BÀI KIỂM TRA 15 PHÚT MÔN TIẾNG ANH';
    let detailText = `Đã xuất sắc hoàn thành Bài kiểm tra đánh giá 15 phút - Từ vựng Tiếng Anh Lớp ${student.grade || CURRENT_GRADE} (Unit ${currentUnit})`;
    let highlightMetric = `🏆 KẾT QUẢ: ${score} / 10.0 ĐIỂM  •  XẾP LOẠI: ${rank}`;

    if (this.currentType === 'diligence') {
      mainTitle = 'CHỨNG CHỈ CHUYÊN CẦN';
      subTitle = 'XÁC NHẬN CHUYÊN CẦN VÀ Ý CHÍ BỨC PHÁ VƯỢT TRỘI';
      detailText = `Đã hoàn thành xuất sắc chuỗi ${student.streakDays || 1} ngày học tập chuyên cần liên tục, tích lũy ${student.xp || 50} điểm XP`;
      highlightMetric = `🔥 CHUỖI CHUYÊN CẦN: ${student.streakDays || 1} NGÀY LIÊN TIẾP (100%)`;
    } else if (this.currentType === 'mastery') {
      mainTitle = 'CHỨNG NHẬN TỪ VỰNG';
      subTitle = 'HOÀN THÀNH XUẤT SẮC TỶ LỆ GHI NHỚ TỪ VỰNG BÀI HỌC';
      detailText = `Đã xuất sắc làm chủ và ghi nhớ ${percent}% số từ vựng trọng tâm trong bài học Unit ${currentUnit} - Tiếng Anh ${classStr}`;
      highlightMetric = `🎯 TỶ LỆ HOÀN THÀNH: ${percent}% ĐẠT CHUẨN XUẤT SẮC`;
    }

    ctx.font = 'bold 64px "Times New Roman", serif';
    ctx.fillStyle = '#b91c1c'; // Vietnamese Certificate Red
    ctx.fillText(mainTitle, 800, 270);

    ctx.font = 'bold 20px "Times New Roman", serif';
    ctx.fillStyle = '#b45309';
    ctx.fillText(subTitle, 800, 310);

    // Gold Ribbon Line
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(450, 330);
    ctx.lineTo(1150, 330);
    ctx.stroke();

    // Awarded to
    ctx.textAlign = 'center';
    ctx.font = 'italic 23px "Times New Roman", serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('Trân trọng vinh danh và trao tặng cho học sinh:', 880, 385);

    // Student Full Name
    ctx.font = 'bold 52px "Times New Roman", serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText((student.fullName || 'HỌC SINH').toUpperCase(), 880, 455);

    // Underline
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(560, 475);
    ctx.lineTo(1200, 475);
    ctx.stroke();

    // Student Class & Birth Date & School
    ctx.font = 'bold 23px "Times New Roman", serif';
    ctx.fillStyle = '#1e3a8a';
    const birthDisplay = student.birthDate ? formatBirthDate(student.birthDate) : '';
    const studentInfoLine = birthDisplay ? 
      `Sinh ngày: ${birthDisplay}  •  ${classStr}  •  ${student.school || 'Trường THCS Đồng Yên'}` : 
      `Học sinh: ${classStr}  •  ${student.school || 'Trường THCS Đồng Yên'}`;
    ctx.fillText(studentInfoLine, 880, 520);

    // -------------------------------------------------------------
    // KHUNG ẢNH CHÂN DUNG HỌC SINH DANH DỰ (HONORARY AVATAR FRAME)
    // -------------------------------------------------------------
    const avX = 220;
    const avY = 450;
    const avR = 70;

    // 1. Frame Glow / Shadow
    ctx.save();
    ctx.shadowColor = 'rgba(180, 83, 9, 0.45)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 6;

    // Outer Gold Ring
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#b45309';
    ctx.beginPath();
    ctx.arc(avX, avY, avR + 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(avX, avY, avR + 10, 0, Math.PI * 2);
    ctx.stroke();

    // 2. Inner Clipping & Image / Preset Rendering
    ctx.save();
    ctx.beginPath();
    ctx.arc(avX, avY, avR, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.clip();

    if (student.avatar && student.avatar.startsWith('data:image')) {
      if (this.avatarImgCache && this.avatarImgCache.src === student.avatar && this.avatarImgCache.complete) {
        ctx.drawImage(this.avatarImgCache, avX - avR, avY - avR, avR * 2, avR * 2);
      } else {
        const img = new Image();
        img.onload = () => {
          this.avatarImgCache = img;
          this.drawCertificateOnCanvas(canvas);
        };
        img.src = student.avatar;
      }
    } else {
      // Preset avatar or emoji
      const avList = typeof PRESET_AVATARS !== 'undefined' ? PRESET_AVATARS : [];
      const avPreset = avList.find(a => a.id === student.avatar);
      const avIcon = avPreset ? avPreset.icon : '👦';

      const grad = ctx.createLinearGradient(avX - avR, avY - avR, avX + avR, avY + avR);
      grad.addColorStop(0, '#e0f2fe');
      grad.addColorStop(1, '#bae6fd');
      ctx.fillStyle = grad;
      ctx.fillRect(avX - avR, avY - avR, avR * 2, avR * 2);

      ctx.font = '76px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(avIcon, avX, avY + 4);
    }
    ctx.restore();

    // 3. Honorary Ribbon Badge under Photo
    ctx.save();
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(avX - 65, avY + avR + 14, 130, 24, 6);
    else ctx.rect(avX - 65, avY + avR + 14, 130, 24);
    ctx.fill();

    ctx.font = 'bold 12px "Times New Roman", serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ẢNH HỌC SINH', avX, avY + avR + 26);
    ctx.restore();

    // Main citation
    ctx.font = '22px "Times New Roman", serif';
    ctx.fillStyle = '#334155';
    ctx.fillText(detailText, 800, 580);

    // Highlight Score Card Box
    ctx.fillStyle = '#fffbeb';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    if (ctx.roundRect) ctx.roundRect(420, 620, 760, 90, 16);
    else ctx.rect(420, 620, 760, 90);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 32px "Times New Roman", serif';
    ctx.fillStyle = '#b45309';
    ctx.fillText(highlightMetric, 800, 675);

    // Praise quote
    ctx.font = 'italic 20px "Times New Roman", serif';
    ctx.fillStyle = '#059669';
    ctx.fillText('Biểu dương tinh thần tự giác, ý chí rèn luyện và thành tích học tập vượt trội.', 800, 750);

    // 4. Footer Section
    // Left: Date & Verification
    ctx.textAlign = 'left';
    ctx.font = '19px "Times New Roman", serif';
    ctx.fillStyle = '#475569';
    const now = new Date();
    ctx.fillText(`Ngày ${now.getDate()} tháng ${now.getMonth() + 1} năm ${now.getFullYear()}`, 150, 830);

    ctx.font = 'bold 18px "Times New Roman", serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('MÃ SỐ XÁC THỰC:', 150, 865);
    ctx.font = 'bold 20px monospace';
    ctx.fillStyle = '#0284c7';
    ctx.fillText(certCode, 150, 895);

    ctx.font = 'italic 16px "Times New Roman", serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Hệ thống kiểm tra số THCS', 150, 925);
    ctx.fillText('Website: dekiemtraso.com/hocsinh', 150, 950);

    // Center: Official Red Seal Stamp
    ctx.save();
    ctx.translate(800, 900);
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 70, 0, Math.PI * 2);
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 62, 0, Math.PI * 2);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 13px "Times New Roman", serif';
    ctx.fillText('TRƯỜNG THCS ĐỒNG YÊN', 0, -32);

    ctx.font = 'bold 22px "Times New Roman", serif';
    ctx.fillText('★ ★ ★', 0, -6);

    ctx.font = 'bold 14px "Times New Roman", serif';
    ctx.fillText('THẦY GIÁO', 0, 16);
    ctx.font = 'bold 15px "Times New Roman", serif';
    ctx.fillText('ĐINH VĂN THÀNH', 0, 36);
    ctx.restore();

    // Right: Signature of Teacher Đinh Văn Thành
    ctx.textAlign = 'center';
    ctx.font = 'bold 21px "Times New Roman", serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('GIÁO VIÊN BỘ MÔN TIẾNG ANH', 1320, 825);

    ctx.font = 'italic 17px "Times New Roman", serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('(Ký tên và đóng dấu)', 1320, 852);

    // Handwritten Signature
    ctx.font = 'italic bold 38px "Brush Script MT", "Segoe Script", "Dancing Script", cursive, sans-serif';
    ctx.fillStyle = '#1e3a8a'; // Blue ink signature
    ctx.fillText('Dinh Van Thanh', 1320, 920);

    // Full Name under signature
    ctx.font = 'bold 23px "Times New Roman", serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('Thầy giáo Đinh Văn Thành', 1320, 975);
  },

  downloadPNG() {
    const canvas = document.getElementById('certDisplayCanvas');
    if (!canvas) return;

    const student = this.targetStudent || STUDENT_SYSTEM.currentStudent || { fullName: "HocSinh" };
    const cleanName = (student.fullName || 'HocSinh').replace(/[^a-zA-Z0-9]/g, '_');
    const classStr = (student.className || ('Lop_' + (student.grade || '8'))).replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `Giay_Khen_15Phut_${cleanName}_${classStr}.png`;

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  sendToTeacherChat() {
    const student = this.targetStudent || STUDENT_SYSTEM.currentStudent || { fullName: "Học sinh" };
    const classStr = student.className ? 
      (student.className.toLowerCase().includes('lớp') ? student.className : `Lớp ${student.className}`) : 
      `Lớp ${student.grade || CURRENT_GRADE}`;
    const score = this.customScore || (student.minitestBestScore ? student.minitestBestScore.toFixed(1) : "10.0");
    const unit = this.customUnit || STATE.currentUnit || 1;
    const certCode = this.customCertId || ('DVT-' + (new Date().getFullYear()) + '-' + Math.floor(Math.random() * 89999 + 10000));
    
    const msgText = `Thầy Thành ơi, em ${student.fullName} (${classStr} - ${student.school || 'Trường THCS Đồng Yên'}) vừa hoàn thành bài kiểm tra 15 phút Unit ${unit} đạt ${score}/10 điểm và đã được cấp Giấy khen điện tử (Mã số: ${certCode}). Em gửi Thầy xem và ghi nhận thành tích ạ!`;

    if (typeof TEACHER_CHAT !== 'undefined') {
      TEACHER_CHAT.sendMessage(msgText);
      const win = document.getElementById('teacherChatWindow');
      if (win && win.style.display === 'none') {
        TEACHER_CHAT.toggleChat();
      }
      alert('✓ Đã gửi thông báo thành tích và Giấy khen đến Thầy Đinh Thành trong khung Chatbox!');
    }
  },

  shareZalo() {
    const student = this.targetStudent || STUDENT_SYSTEM.currentStudent || { fullName: "Em" };
    const text = `🎉 Em đã hoàn thành xuất sắc bài kiểm tra 15 phút và nhận Giấy khen điện tử môn Tiếng Anh tại https://dekiemtraso.com/hocsinh!`;
    const url = `https://zalo.me/share?url=${encodeURIComponent('https://dekiemtraso.com/hocsinh')}&title=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }
};



// GLOBAL NON-BLOCKING TOAST NOTIFICATION
function showAppToast(message, type = 'info') {
  if (typeof document === 'undefined') return;
  let toast = document.getElementById('globalAppToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalAppToast';
    toast.style.cssText = 'position: fixed; top: 24px; left: 50%; transform: translateX(-50%) translateY(-20px); background: #0f172a; border: 1.5px solid rgba(56, 189, 248, 0.4); color: #fff; padding: 12px 24px; border-radius: 9999px; font-size: 0.95rem; font-weight: 700; box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5), 0 0 15px rgba(56, 189, 248, 0.35); z-index: 999999; opacity: 0; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); pointer-events: none; display: flex; align-items: center; gap: 8px; font-family: Inter, system-ui, sans-serif;';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.borderColor = type === 'error' ? '#f43f5e' : (type === 'success' ? '#10b981' : 'rgba(56, 189, 248, 0.6)');
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  if (toast._timer) clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(-20px)';
  }, 3200);
}

function startApp() {

  // GLOBAL_MODAL_DISMISS_INSTALLED: Click backdrop or press ESC to dismiss ANY modal
  document.querySelectorAll('.custom-modal-overlay, .modal').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        overlay.classList.remove('open');
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.custom-modal-overlay.active, .modal.open').forEach(m => {
        m.classList.remove('active');
        m.classList.remove('open');
      });
      const themeMenu = document.getElementById('themePaletteMenu');
      if (themeMenu) themeMenu.classList.remove('show');
    }
  });

  console.log("Vocab Master Pro 6-12 initializing...");
  try { loadCustomVocab(); } catch (e) { console.error("loadCustomVocab error:", e); }
  try { loadProgress(); } catch (e) { console.error("loadProgress error:", e); }
  try { SpeechEngine.init(); } catch (e) { console.error("SpeechEngine.init error:", e); }
  try { initGradePills(); } catch (e) { console.error("initGradePills error:", e); }
  try { initUnitPills(); } catch (e) { console.error("initUnitPills error:", e); }
  try { setupEventListeners(); } catch (e) { console.error("setupEventListeners error:", e); }
  try { STUDENT_SYSTEM.init(); } catch (e) { console.error("STUDENT_SYSTEM error:", e); }
  try { TEACHER_CHAT.init(); } catch (e) { console.error("TEACHER_CHAT error:", e); }
  try { WEAKWORDS_SYSTEM.init(); } catch (e) { console.error("WEAKWORDS_SYSTEM error:", e); }
  try { GAMIFICATION.init(); } catch (e) { console.error("GAMIFICATION error:", e); }
  try { selectUnit(STATE.currentUnit || 1, false); } catch (e) { console.error("selectUnit error:", e); }
  console.log("Vocab Master Pro 6-12 ready!");
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
  } else {
    startApp();
  }
}


// Chặn tắt Modal khi chưa đăng nhập / đăng ký
(function setupAuthOverlayBackdropGuard() {
  const overlay = document.getElementById('studentRegisterModalOverlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        if (typeof STUDENT_SYSTEM !== 'undefined' && !STUDENT_SYSTEM.currentStudent) {
          alert('⚠️ Em vui lòng Đăng ký tài khoản hoặc Đăng nhập để mở khóa học tập và các trò chơi nhé!');
          return;
        }
        if (typeof STUDENT_SYSTEM !== 'undefined') {
          STUDENT_SYSTEM.closeRegisterModal();
        }
      }
    });
  }
})();
