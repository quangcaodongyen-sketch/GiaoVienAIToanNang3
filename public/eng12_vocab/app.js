/**
 * ENG 12 VOCAB MASTER - APPLICATION LOGIC (ULTRA VIBRANT EDITION)
 * Tác giả: Thầy giáo Đinh Văn Thành (THCS Đồng Yên)
 * Bám sát SGK Tiếng Anh 12 Global Success
 */

// ==============================================================================
// 1. STATE & STORAGE MANAGEMENT
// ==============================================================================
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
class SoundEffects {
  constructor() {
    this.ctx = null;
  }
  
  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
  
  playTone(freq, type = 'sine', duration = 0.15, startVol = 0.2) {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(startVol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }
  
  playCorrect() {
    this.init();
    if (!this.ctx) return;
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.18, 0.25), idx * 70);
    });
  }
  
  playWrong() {
    this.init();
    if (!this.ctx) return;
    [220, 180].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sawtooth', 0.2, 0.18), idx * 120);
    });
  }
  
  playFlip() {
    this.playTone(420, 'sine', 0.08, 0.12);
  }
  
  playMatchSuccess() {
    this.init();
    if (!this.ctx) return;
    [440, 554.37, 659.25, 880].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.25, 0.25), idx * 80);
    });
  }
  
  playWin() {
    if (window.confetti) {
      window.confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    }
    this.init();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'triangle', 0.35, 0.3), i * 110);
    });
  }
}

const SFX = new SoundEffects();

// ==============================================================================
// 3. WEB SPEECH SYNTHESIS ENGINE (PRONUNCIATION)
// ==============================================================================
// ==============================================================================
// 3. SYNCHRONOUS WEB SPEECH SYNTHESIS ENGINE (MOBILE & PC OPTIMIZED)
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

    // Tự động unlock Audio & Speech ngay khi người dùng chạm vào màn hình (iOS / Android policy)
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

  getBestVoice(langCode = 'en-US') {
    if (!this.voices || this.voices.length === 0) {
      if ('speechSynthesis' in window) {
        this.voices = window.speechSynthesis.getVoices();
      }
    }
    const voices = this.voices || [];

    // Ưu tiên danh sách giọng nữ trong trẻo, tự nhiên, ngọt ngào nhất (Edge Neural, Google, Apple, Windows)
    const femaleKeywords = [
      'Jenny', 'Aria', 'Ana', 'Michelle', 'Sonia', 'Libby', 
      'Emma', 'Clara', 'Samantha', 'Victoria', 'Karen', 'Zira', 
      'Google US English', 'Google UK English Female', 'Natural', 'Female', 'Nữ'
    ];

    const langPrefix = langCode.toLowerCase().slice(0, 2);

    // 1. Tìm giọng nữ đúng chuẩn mã ngôn ngữ (en-US hoặc en-GB)
    for (const name of femaleKeywords) {
      const match = voices.find(v => 
        v.lang.toLowerCase().startsWith(langPrefix) && 
        v.name.toLowerCase().includes(name.toLowerCase())
      );
      if (match) return match;
    }

    // 2. Tìm bất kỳ giọng nữ tiếng Anh nào
    for (const name of femaleKeywords) {
      const match = voices.find(v => 
        v.lang.toLowerCase().startsWith('en') && 
        v.name.toLowerCase().includes(name.toLowerCase())
      );
      if (match) return match;
    }

    // 3. Fallback: Chọn giọng tiếng Anh không chứa từ khóa giọng nam (loại trừ David, Guy, Male, George, Mark)
    const nonMaleVoice = voices.find(v => 
      v.lang.toLowerCase().startsWith(langPrefix) && 
      !v.name.toLowerCase().includes('david') && 
      !v.name.toLowerCase().includes('guy') && 
      !v.name.toLowerCase().includes('male') && 
      !v.name.toLowerCase().includes('george') &&
      !v.name.toLowerCase().includes('mark')
    );
    if (nonMaleVoice) return nonMaleVoice;

    return voices.find(v => v.lang.toLowerCase().startsWith(langPrefix)) || null;
  },

  // PHÁT ÂM ĐỒNG BỘ (SYNCHRONOUS - KHÔNG DÙNG SETTIMEOUT) ĐỂ HOẠT ĐỘNG 100% TRÊN ĐIỆN THOẠI & MÁY TÍNH
  speak(text, rate = 0.85, lang = null) {
    if (!text || !text.trim()) return;
    if (!('speechSynthesis' in window)) return;

    try {
      // Đảm bảo không bị pause bởi hệ điều hành
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      // Hủy âm thanh trước đó
      window.speechSynthesis.cancel();

      // Âm thanh Click feedback siêu nhẹ tức thì để người học cảm nhận được ngay
      if (typeof SFX !== 'undefined' && SFX.playTone) {
        SFX.playTone(560, 'sine', 0.04, 0.08);
      }

      const utterance = new SpeechSynthesisUtterance(text.trim());
      utterance.rate = rate; // 0.85x: Chậm rãi, phát âm tròn vành rõ chữ, chuẩn sư phạm
      utterance.pitch = 1.05; // Cao độ trong trẻo, tự nhiên

      const targetLang = lang || (STATE.preferredVoiceAccent === 'UK' ? 'en-GB' : 'en-US');
      utterance.lang = targetLang;

      const voice = this.getBestVoice(targetLang);
      if (voice) utterance.voice = voice;

      // Lưu tham chiếu toàn cục (chống V8 & iOS Garbage Collector dọn dẹp làm mất tiếng giữa chừng)
      window._activeSpeechUtterance = utterance;
      this.activeUtterance = utterance;

      utterance.onend = () => {
        window._activeSpeechUtterance = null;
        this.activeUtterance = null;
      };

      utterance.onerror = (err) => {
        window._activeSpeechUtterance = null;
        this.activeUtterance = null;
      };

      // GỌI TRỰC TIẾP ĐỒNG BỘ TRONG GESTURE CỦA NGƯỜI DÙNG
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('SpeechEngine error:', e);
    }
  }
};

// ==============================================================================
// 4. UI INITIALIZATION & UNIT SELECTION
// ==============================================================================
function initUnitPills() {
  const container = document.getElementById('unitPillsContainer');
  if (!container || typeof VOCABULARY_DATA === 'undefined') return;
  
  container.innerHTML = '';
  VOCABULARY_DATA.forEach(u => {
    const pill = document.createElement('button');
    pill.className = `unit-pill ${u.unit === STATE.currentUnit ? 'active' : ''}`;
    pill.innerHTML = `<span class="pill-num">${u.icon} U${u.unit}</span> <span>${u.title}</span>`;
    pill.title = `${u.title_vi} (${u.word_count} từ)`;
    pill.addEventListener('click', () => selectUnit(u.unit, true));
    container.appendChild(pill);
  });
}

function selectUnit(unitNum, shouldSpeakTitle = true) {
  STATE.currentUnit = unitNum;
  STATE.currentWordIdx = 0;
  STATE.isFlipped = false;
  stopAutoPlay();
  if (typeof pauseChant === 'function') pauseChant();
  
  // Hủy ngay toàn bộ phát âm trước đó
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  
  const unitObj = VOCABULARY_DATA.find(u => u.unit === unitNum);
  if (unitObj) {
    STATE.activeWords = [...unitObj.words];
    
    document.getElementById('unitTitleDisplay').textContent = `Unit ${unitObj.unit}: ${unitObj.title}`;
    document.getElementById('unitWordCountBadge').textContent = `${unitObj.word_count} từ`;
    
    document.querySelectorAll('.unit-pill').forEach((p, idx) => {
      p.classList.toggle('active', (idx + 1) === unitNum);
    });
    
    // BẤM CHỌN UNIT NÀO THÌ CHỈ ĐỌC TÊN UNIT ĐÓ RỒI DỪNG, KHÔNG TỰ Ý ĐỌC VÀO TỪ BÊN DƯỚI:
    if (shouldSpeakTitle) {
      SpeechEngine.speak(`Unit ${unitObj.unit}: ${unitObj.title}`, 0.9);
    }
  }
  
  renderFlashcard();
  initQuiz();
  initMatchGame();
  initListenGame(false);
  if (typeof initScrambleGame === 'function') initScrambleGame();
  if (typeof initChantGame === 'function') initChantGame();
  if (typeof initBlitzGame === 'function') initBlitzGame();
  if (typeof initSpellingGame === 'function') initSpellingGame(false);
  if (typeof initHangmanGame === 'function') initHangmanGame();
  if (typeof initContextGame === 'function') initContextGame();
  renderVocabularyHub();
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
}

function prevWord() {
  if (STATE.currentWordIdx > 0) {
    STATE.currentWordIdx--;
  } else {
    STATE.currentWordIdx = STATE.activeWords.length - 1;
  }
  STATE.isFlipped = false;
  renderFlashcard();
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
  
  SpeechEngine.speak(currentWord.word, 1.0);
  
  STATE.autoPlayTimer = setTimeout(() => {
    if (!STATE.isAutoPlaying) return;
    flipCard();
    
    STATE.autoPlayTimer = setTimeout(() => {
      if (!STATE.isAutoPlaying) return;
      SpeechEngine.speak(currentWord.example, 1.0);
      
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
  const words = [...STATE.activeWords];
  if (words.length < 4) return;
  
  const shuffled = words.sort(() => 0.5 - Math.random());
  STATE.quiz.questions = shuffled.slice(0, Math.min(10, shuffled.length));
  STATE.quiz.currentIdx = 0;
  STATE.quiz.score = 0;
  STATE.quiz.streak = 0;
  STATE.quiz.total = STATE.quiz.questions.length;
  
  document.getElementById('quizScoreVal').textContent = '0';
  document.getElementById('quizStreakVal').textContent = '0';
  document.getElementById('quizTotalQ').textContent = STATE.quiz.total;
  
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
  const distractors = allOtherWords.sort(() => 0.5 - Math.random()).slice(0, 3);
  const options = [q, ...distractors].sort(() => 0.5 - Math.random());
  
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
  const container = document.getElementById('quizContainer');
  SFX.playWin();
  container.innerHTML = `
    <div style="text-align: center; padding: 2.5rem 1rem; display: flex; flex-direction: column; align-items: center; gap: 1rem;">
      <div style="font-size: 4rem;">🎉</div>
      <h2 style="font-size: 2rem; font-weight: 900; color: #fff; text-shadow: 0 0 20px rgba(56,189,248,0.5);">XUẤT SẮC HOÀN THÀNH BÀI QUIZ!</h2>
      <p style="font-size: 1.3rem; color: #fbbf24; font-weight: 800;">
        Tổng điểm đạt được: ${STATE.quiz.score} điểm
      </p>
      <p style="color: var(--text-muted); font-size: 1rem; max-width: 440px;">
        Các em học sinh đã ghi nhớ xuất sắc các từ vựng của bài học này!
      </p>
      <div style="display: flex; gap: 1rem; margin-top: 1.2rem;">
        <button class="fc-nav-btn btn-next" onclick="initQuiz()" style="max-width: none; padding: 0.9rem 2rem; font-size: 1.05rem;">
          🔄 Luyện tập ván mới
        </button>
      </div>
    </div>
  `;
}

// ==============================================================================
// 7. TAB 3: WORD MATCHING MEMORY GAME LOGIC (ULTRA VIBRANT)
// ==============================================================================
function initMatchGame() {
  const words = [...STATE.activeWords];
  if (words.length < 8) return;
  
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
  
  const board = document.getElementById('matchGameBoard');
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
    SpeechEngine.speak(wordToSpeak, 0.85);
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
          setTimeout(() => SpeechEngine.speak(tile.wordObj.word, 0.85), 250);
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
            alert(`🎉 XUẤT SẮC! BẠN ĐÃ GHÉP HẾT ${STATE.match.totalPairs} CẶP TỪ TRONG ${timeStr}!`);
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
  const words = [...STATE.activeWords];
  if (words.length < 4) return;
  
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
    alert(`🎉 Bạn đã hoàn thành bài luyện nghe với ${STATE.listen.score} điểm!`);
    initListenGame(false);
    return;
  }
  
  const idxEl = document.getElementById('listenQIdx');
  if (idxEl) idxEl.textContent = STATE.listen.currentIdx + 1;
  
  // CHỈ tự động phát âm khi học sinh ĐANG Ở TRONG tab Luyện Nghe và autoSpeak = true
  const isListenActive = document.getElementById('tab-listen') && document.getElementById('tab-listen').classList.contains('active');
  if (autoSpeak && isListenActive) {
    setTimeout(() => {
      SpeechEngine.speak(q.word, 0.95);
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
      SpeechEngine.speak(w.word, 0.85);
    });
    
    card.querySelector('.speak-hub-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      SpeechEngine.speak(w.word, 0.85);
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

  // Scramble game controls
  const scrambleResetBtn = document.getElementById('scrambleResetBtn');
  if (scrambleResetBtn) scrambleResetBtn.addEventListener('click', resetScrambleCurrentWord);
  const scrambleHintBtn = document.getElementById('scrambleHintBtn');
  if (scrambleHintBtn) scrambleHintBtn.addEventListener('click', giveScrambleHint);
  const restartScrambleBtn = document.getElementById('restartScrambleBtn');
  if (restartScrambleBtn) restartScrambleBtn.addEventListener('click', initScrambleGame);

  // Click-to-speak on Flashcard English Word & IPA directly
  const cardWordTitle = document.getElementById('cardWordTitle');
  if (cardWordTitle) {
    cardWordTitle.style.cursor = 'pointer';
    cardWordTitle.title = 'Bấm để nghe phát âm chuẩn của từ này';
    cardWordTitle.addEventListener('click', (e) => {
      e.stopPropagation();
      const w = STATE.activeWords[STATE.currentWordIdx];
      if (w) SpeechEngine.speak(w.word, 0.85);
    });
  }
  const cardIpaText = document.getElementById('cardIpaText');
  if (cardIpaText) {
    cardIpaText.style.cursor = 'pointer';
    cardIpaText.title = 'Bấm để nghe phát âm chuẩn của từ này';
    cardIpaText.addEventListener('click', (e) => {
      e.stopPropagation();
      const w = STATE.activeWords[STATE.currentWordIdx];
      if (w) SpeechEngine.speak(w.word, 0.85);
    });
  }

  // Tabs switching
  document.querySelectorAll('.mode-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const targetPane = document.getElementById(btn.dataset.tab);
      if (targetPane) targetPane.classList.add('active');
      if (btn.dataset.tab !== 'tab-flashcard') stopAutoPlay();
      if (btn.dataset.tab !== 'tab-chant' && typeof pauseChant === 'function') {
        pauseChant();
      }
      if (btn.dataset.tab === 'tab-chant' && typeof initChantGame === 'function') {
        initChantGame();
      }
      if (btn.dataset.tab !== 'tab-blitz' && STATE.blitz && STATE.blitz.timerInterval) {
        clearInterval(STATE.blitz.timerInterval);
      }
      if (btn.dataset.tab === 'tab-blitz') {
        initBlitzGame();
      }
      if (btn.dataset.tab === 'tab-spelling') {
        const inp = document.getElementById('spellingInput');
        if (inp) setTimeout(() => inp.focus(), 200);
      }
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
      if (w) SpeechEngine.speak(w.word, 0.85);
    });
  }
  
  const ipaEl = document.getElementById('cardIpaText');
  if (ipaEl) {
    ipaEl.style.cursor = 'pointer';
    ipaEl.title = 'Bấm để nghe phát âm từ này';
    ipaEl.addEventListener('click', (e) => {
      e.stopPropagation();
      const w = STATE.activeWords[STATE.currentWordIdx];
      if (w) SpeechEngine.speak(w.word, 0.85);
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
    if (w) SpeechEngine.speak(w.word, 1.0);
  });
  document.getElementById('btnPronounceSlow').addEventListener('click', (e) => {
    e.stopPropagation();
    const w = STATE.activeWords[STATE.currentWordIdx];
    if (w) SpeechEngine.speak(w.word, 0.8);
  });
  document.getElementById('btnSpeakSentence').addEventListener('click', (e) => {
    e.stopPropagation();
    const w = STATE.activeWords[STATE.currentWordIdx];
    if (w) SpeechEngine.speak(w.example, 0.95);
  });
  
  // Voice toggle US / UK
  document.getElementById('fcVoiceSettingBtn').addEventListener('click', () => {
    STATE.preferredVoiceAccent = STATE.preferredVoiceAccent === 'US' ? 'UK' : 'US';
    localStorage.setItem('ENG12_VOICE_ACCENT', STATE.preferredVoiceAccent);
    document.getElementById('cardAccentTag').textContent = `${STATE.preferredVoiceAccent} Accent`;
    SFX.playTone(700, 'sine', 0.1);
    const w = STATE.activeWords[STATE.currentWordIdx];
    if (w) SpeechEngine.speak(w.word, 1.0);
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
        if (w) SpeechEngine.speak(w.word, 1.0);
      } else if (e.key === 'm' || e.key === 'M') {
        document.getElementById('btnMarkMastered').click();
      }
    }
  });
  
  // Quiz prompt audio button
  document.getElementById('quizAudioPromptBtn').addEventListener('click', () => {
    const q = STATE.quiz.questions[STATE.quiz.currentIdx];
    if (q) SpeechEngine.speak(q.word, 1.0);
  });
  
  // Match game restart
  document.getElementById('restartMatchBtn').addEventListener('click', initMatchGame);
  
  // Listen game prompt
  document.getElementById('listenPlayBigBtn').addEventListener('click', () => {
    const q = STATE.listen.questions[STATE.listen.currentIdx];
    if (q) {
      document.getElementById('listenPlayBigBtn').classList.add('speaking');
      SpeechEngine.speak(q.word, 1.0);
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
  
  // Theme toggle
  document.getElementById('themeToggleBtn').addEventListener('click', () => {
    document.body.classList.toggle('theme-light');
    const isLight = document.body.classList.contains('theme-light');
    document.getElementById('themeToggleBtn').textContent = isLight ? '☀️' : '🌙';
  });
  
  window.addEventListener('click', (e) => {
    if (e.target === qrModal) qrModal.classList.remove('open');
    if (e.target === statsModal) statsModal.classList.remove('open');
  });
}

// ==============================================================================
// 11. ENTRY POINT
// ==============================================================================
window.addEventListener('DOMContentLoaded', () => {
  loadProgress();
  SpeechEngine.init();
  initUnitPills();
  selectUnit(1, false);
  setupEventListeners();
  
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});



// ==============================================================================
// 10. EXTRA PRACTICE MODES
// ==============================================================================

// --- MODE A: SPEED BLITZ (TRUE / FALSE) ---
STATE.blitz = {
  questions: [],
  currentIdx: 0,
  score: 0,
  streak: 0,
  timerInterval: null,
  timeLeft: 6,
  maxTime: 6
};

function initBlitzGame() {
  if (!STATE.activeWords || STATE.activeWords.length === 0) return;
  clearInterval(STATE.blitz.timerInterval);
  
  const shuffled = [...STATE.activeWords].sort(() => 0.5 - Math.random());
  STATE.blitz.questions = shuffled.slice(0, 15).map(w => {
    const isTrue = Math.random() >= 0.45;
    let displayedMeaning = w.meaning;
    if (!isTrue) {
      const others = STATE.activeWords.filter(o => o.id !== w.id);
      if (others.length > 0) {
        displayedMeaning = others[Math.floor(Math.random() * others.length)].meaning;
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
  
  STATE.blitz.currentIdx = 0;
  STATE.blitz.score = 0;
  STATE.blitz.streak = 0;
  
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
    SFX.playCorrect();
    STATE.blitz.streak++;
    const bonus = STATE.blitz.streak > 1 ? (STATE.blitz.streak - 1) * 5 : 0;
    STATE.blitz.score += (10 + bonus);
    if (card) {
      card.style.borderColor = '#10b981';
      card.style.boxShadow = '0 0 30px rgba(16, 185, 129, 0.4)';
    }
    STATE.mastered.add(q.actualWord.id);
  } else {
    SFX.playWrong();
    STATE.blitz.streak = 0;
    if (card) {
      card.style.borderColor = '#ef4444';
      card.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.4)';
    }
    STATE.review.add(q.actualWord.id);
  }
  
  const scoreEl = document.getElementById('blitzScoreVal');
  const streakEl = document.getElementById('blitzStreakVal');
  if (scoreEl) scoreEl.textContent = STATE.blitz.score;
  if (streakEl) streakEl.textContent = STATE.blitz.streak;
  saveProgress();
  
  setTimeout(() => {
    if (card) {
      card.style.borderColor = '';
      card.style.boxShadow = '';
    }
    STATE.blitz.currentIdx++;
    renderBlitzQuestion();
  }, 600);
}

function showBlitzFinished() {
  const container = document.getElementById('blitzCard');
  if (!container) return;
  SFX.playWin();
  launchConfetti();
  
  container.innerHTML = `
    <div style="padding: 1.5rem 0; text-align: center;">
      <div style="font-size: 3.5rem;">⚡</div>
      <h2 style="font-size: 2rem; font-weight: 900; color: #fff; margin: 0.5rem 0;">HOÀN THÀNH PHẢN XẠ NHANH!</h2>
      <div style="font-size: 1.4rem; color: #fbbf24; font-weight: 800; margin-bottom: 1.5rem;">
        Điểm số: ${STATE.blitz.score} điểm
      </div>
      <button class="header-btn" onclick="initBlitzGame()" style="margin: 0 auto; padding: 0.85rem 1.8rem; font-size: 1.05rem; background: linear-gradient(135deg, #10b981, #06b6d4); color: #fff; border: none; cursor: pointer;">
        🔄 Chơi Lại Ván Mới
      </button>
    </div>
  `;
}


// --- MODE B: SPELLING & DICTATION ---
STATE.spelling = {
  questions: [],
  currentIdx: 0,
  score: 0
};

function initSpellingGame(autoSpeak = false) {
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
    SpeechEngine.speak(q.word, 0.95);
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
  SpeechEngine.speak(q.word, 0.9);
}

function showSpellingFinished() {
  const container = document.getElementById('spellingCard');
  if (!container) return;
  SFX.playWin();
  launchConfetti();
  
  container.innerHTML = `
    <div style="padding: 1.5rem 0; text-align: center;">
      <div style="font-size: 3.5rem;">🏆</div>
      <h2 style="font-size: 2rem; font-weight: 900; color: #fff; margin: 0.5rem 0;">XUẤT SẮC! HOÀN THÀNH BÀI GÕ TỪ!</h2>
      <div style="font-size: 1.4rem; color: #34d399; font-weight: 800; margin-bottom: 1.5rem;">
        Điểm số: ${STATE.spelling.score} điểm
      </div>
      <button class="header-btn" onclick="initSpellingGame()" style="margin: 0 auto; padding: 0.85rem 1.8rem; font-size: 1.05rem; background: linear-gradient(135deg, #38bdf8, #8b5cf6); color: #fff; border: none; cursor: pointer;">
        🔄 Luyện Tập Tiếp
      </button>
    </div>
  `;
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
    SpeechEngine.speak(q.word, 1.0);
  }
  saveProgress();
  
  setTimeout(() => {
    STATE.hangman.currentIdx++;
    loadHangmanWord();
  }, 1600);
}

function handleHangmanLose() {
  SFX.playWrong();
  const q = STATE.hangman.questions[STATE.hangman.currentIdx];
  if (q) {
    STATE.review.add(q.id);
    SpeechEngine.speak(q.word, 1.0);
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
  const container = document.getElementById('hangmanContainer');
  if (!container) return;
  SFX.playWin();
  launchConfetti();
  
  container.innerHTML = `
    <div style="padding: 2rem 0; text-align: center;">
      <div style="font-size: 3.5rem;">🕵️‍♂️</div>
      <h2 style="font-size: 2rem; font-weight: 900; color: #fff; margin: 0.5rem 0;">BẠN LÀ THÁM TỬ TỪ VỰNG TÀI BA!</h2>
      <div style="font-size: 1.4rem; color: #38bdf8; font-weight: 800; margin-bottom: 1.5rem;">
        Điểm phá án: ${STATE.hangman.score} điểm
      </div>
      <button class="header-btn" onclick="initHangmanGame()" style="margin: 0 auto; padding: 0.85rem 1.8rem; font-size: 1.05rem; background: linear-gradient(135deg, #06b6d4, #ec4899); color: #fff; border: none; cursor: pointer;">
        🔄 Phá Án Tiếp
      </button>
    </div>
  `;
}


// --- MODE D: CONTEXT SENTENCE COMPLETION (THPT FORMAT) ---
STATE.context = {
  questions: [],
  currentIdx: 0,
  score: 0,
  streak: 0
};

function initContextGame() {
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
  const container = document.getElementById('contextContainer');
  if (!container) return;
  SFX.playWin();
  launchConfetti();
  
  container.innerHTML = `
    <div style="padding: 2rem 0; text-align: center;">
      <div style="font-size: 3.5rem;">🎯</div>
      <h2 style="font-size: 2rem; font-weight: 900; color: #fff; margin: 0.5rem 0;">HOÀN THÀNH BÀI TẬP NGỮ CẢNH THPT!</h2>
      <div style="font-size: 1.4rem; color: #fbbf24; font-weight: 800; margin-bottom: 1.5rem;">
        Điểm số: ${STATE.context.score} điểm
      </div>
      <button class="header-btn" onclick="initContextGame()" style="margin: 0 auto; padding: 0.85rem 1.8rem; font-size: 1.05rem; background: linear-gradient(135deg, #f59e0b, #ec4899); color: #fff; border: none; cursor: pointer;">
        🔄 Làm Thêm Bài Khác
      </button>
    </div>
  `;
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
    if (q) SpeechEngine.speak(q.word, 1.0);
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
    if (q) SpeechEngine.speak(q.word, 1.0);
  });
  if (spellingAudioSlowBtn) spellingAudioSlowBtn.addEventListener('click', () => {
    const q = STATE.spelling.questions[STATE.spelling.currentIdx];
    if (q) SpeechEngine.speak(q.word, 0.8);
  });

  // Hangman Controls
  const hangmanHintBtn = document.getElementById('hangmanHintBtn');
  const hangmanAudioBtn = document.getElementById('hangmanAudioBtn');
  if (hangmanHintBtn) hangmanHintBtn.addEventListener('click', giveHangmanHint);
  if (hangmanAudioBtn) hangmanAudioBtn.addEventListener('click', () => {
    const q = STATE.hangman.questions[STATE.hangman.currentIdx];
    if (q) SpeechEngine.speak(q.word, 1.0);
  });

  
  // Global keyboard shortcuts for extra modes
  window.addEventListener('keydown', (e) => {
    
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
  isPlaying: false,
  bpm: 112,
  style: 'popfunk', // popfunk, edm, lofi, trap, tropical
  currentStep: 0,
  nextNoteTime: 0.0,
  scheduleAheadTime: 0.1,
  lookahead: 25.0, // ms
  timerId: null,
  volume: 0.4,
  
  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.beatGain = this.ctx.createGain();
      this.beatGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.beatGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },
  
  setVolume(val) {
    this.volume = val;
    if (this.beatGain && this.ctx) {
      this.beatGain.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  },
  
  setBpm(newBpm) {
    this.bpm = newBpm;
  },
  
  setStyle(newStyle) {
    this.style = newStyle;
    if (newStyle === 'edm') this.bpm = 126;
    else if (newStyle === 'lofi') this.bpm = 85;
    else if (newStyle === 'trap') this.bpm = 96;
    else if (newStyle === 'tropical') this.bpm = 115;
    else this.bpm = 112; // popfunk
  },
  
  // Instrument synthesizers
  playKick(time) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.beatGain);
    
    const startFreq = this.style === 'trap' ? 180 : 150;
    const endFreq = this.style === 'trap' ? 32 : 42;
    const decay = this.style === 'trap' ? 0.45 : (this.style === 'lofi' ? 0.2 : 0.28);
    
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + 0.12);
    
    gain.gain.setValueAtTime(0.9, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + decay);
    
    osc.start(time);
    osc.stop(time + decay);
  },
  
  playSnare(time) {
    if (!this.ctx) return;
    // Noise
    const bufSize = this.ctx.sampleRate * 0.18;
    const noiseBuffer = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = this.style === 'trap' ? 'bandpass' : 'highpass';
    filter.frequency.setValueAtTime(this.style === 'lofi' ? 800 : 1100, time);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(this.style === 'lofi' ? 0.4 : 0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.18);
    
    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.beatGain);
    
    whiteNoise.start(time);
    whiteNoise.stop(time + 0.18);
    
    // Thump
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.frequency.setValueAtTime(170, time);
    osc.frequency.exponentialRampToValueAtTime(80, time + 0.08);
    oscGain.gain.setValueAtTime(0.4, time);
    oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.08);
    osc.connect(oscGain);
    oscGain.connect(this.beatGain);
    osc.start(time);
    osc.stop(time + 0.08);
  },
  
  playHiHat(time, isOpen = false) {
    if (!this.ctx) return;
    const duration = isOpen ? 0.25 : 0.04;
    const bufSize = Math.floor(this.ctx.sampleRate * duration);
    const noiseBuffer = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(this.style === 'lofi' ? 5000 : 7500, time);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(isOpen ? 0.35 : 0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.005, time + duration);
    
    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.beatGain);
    
    whiteNoise.start(time);
    whiteNoise.stop(time + duration);
  },
  
  playBass(time, freq, dur = 0.22) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    
    osc.type = this.style === 'lofi' ? 'sine' : 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(this.style === 'edm' ? 1200 : 700, time);
    filter.frequency.exponentialRampToValueAtTime(140, time + dur);
    
    gain.gain.setValueAtTime(0.45, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.beatGain);
    
    osc.start(time);
    osc.stop(time + dur);
  },
  
  // Lookahead scheduler
  nextNote() {
    const secondsPerBeat = 60.0 / this.bpm;
    const secondsPer16th = secondsPerBeat / 4;
    this.nextNoteTime += secondsPer16th;
    this.currentStep = (this.currentStep + 1) % 16;
  },
  
  scheduleNote(stepNumber, time) {
    // Visualizer pulse trigger
    setTimeout(() => {
      pulseVisualizer(stepNumber);
    }, Math.max(0, (time - this.ctx.currentTime) * 1000));
    
    // Drum patterns (16 steps = 1 bar of 4/4)
    if (this.style === 'popfunk') {
      // Funk beat: Kick on 0, 6, 10; Snare on 4, 12; Hihats on all evens
      if (stepNumber === 0 || stepNumber === 6 || stepNumber === 10) this.playKick(time);
      if (stepNumber === 4 || stepNumber === 12) this.playSnare(time);
      if (stepNumber % 2 === 0) this.playHiHat(time, stepNumber === 14);
      
      // Funky bassline: C2 (65.41Hz), Eb2 (77.78Hz), F2 (87.31Hz), G2 (98.00Hz)
      if (stepNumber === 0) this.playBass(time, 65.41, 0.2);
      if (stepNumber === 3) this.playBass(time, 77.78, 0.15);
      if (stepNumber === 6) this.playBass(time, 87.31, 0.2);
      if (stepNumber === 10) this.playBass(time, 98.00, 0.25);
    } 
    else if (this.style === 'edm') {
      // Four on the floor EDM: Kick on 0, 4, 8, 12
      if (stepNumber % 4 === 0) this.playKick(time);
      if (stepNumber === 4 || stepNumber === 12) this.playSnare(time);
      if (stepNumber % 2 === 1) this.playHiHat(time, true); // Offbeat open hi-hat
      
      if (stepNumber % 2 === 0) {
        const bassNotes = [65.41, 65.41, 77.78, 87.31];
        this.playBass(time, bassNotes[Math.floor(stepNumber / 4)], 0.18);
      }
    }
    else if (this.style === 'lofi') {
      // Chill Lofi: Kick on 0, 7; Snare on 4, 12; gentle hihats
      if (stepNumber === 0 || stepNumber === 7) this.playKick(time);
      if (stepNumber === 4 || stepNumber === 12) this.playSnare(time);
      if (stepNumber % 2 === 0) this.playHiHat(time, false);
      if (stepNumber === 0) this.playBass(time, 58.27, 0.35); // Bb1
      if (stepNumber === 8) this.playBass(time, 65.41, 0.35); // C2
    }
    else if (this.style === 'trap') {
      // Trap: 808 Kick on 0, 10; Clap on 8; rapid hihats
      if (stepNumber === 0 || stepNumber === 10) this.playKick(time);
      if (stepNumber === 8) this.playSnare(time);
      this.playHiHat(time, stepNumber % 4 === 2);
      if (stepNumber === 0) this.playBass(time, 43.65, 0.4); // F1 808
      if (stepNumber === 10) this.playBass(time, 49.00, 0.35); // G1 808
    }
    else { // tropical
      if (stepNumber === 0 || stepNumber === 6 || stepNumber === 10) this.playKick(time);
      if (stepNumber === 4 || stepNumber === 12) this.playSnare(time);
      if (stepNumber % 2 === 0) this.playHiHat(time, stepNumber === 6);
      if (stepNumber === 0) this.playBass(time, 73.42, 0.2); // D2
      if (stepNumber === 6) this.playBass(time, 87.31, 0.2); // F2
      if (stepNumber === 10) this.playBass(time, 98.00, 0.2); // G2
    }
  },
  
  scheduler() {
    while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.currentStep, this.nextNoteTime);
      this.nextNote();
    }
    if (this.isPlaying) {
      this.timerId = setTimeout(() => this.scheduler(), this.lookahead);
    }
  },
  
  start() {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.currentStep = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.05;
    this.scheduler();
  },
  
  stop() {
    this.isPlaying = false;
    clearTimeout(this.timerId);
  }
};

// --- CHANT VOCABULARY CONTROLLER & SEQUENCER ---
const STATE_CHANT = {
  currentWordIdx: 0,
  isPlaying: false,
  timerTimeout: null,
  speakVi: true,
  speakExample: true,
  loopUnit: true,
  currentPhase: 'idle' // 'idle', 'call', 'response', 'cheer'
};

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
  SpeechEngine.speak(w.word, 1.15);
  
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
      SpeechEngine.speak(w.word, 1.05);
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
        SpeechEngine.speak(w.example, 1.05);
      } else {
        SpeechEngine.speak(w.word, 1.2);
      }
      
      // Step to next word after groove delay (2.4s)
      STATE_CHANT.timerTimeout = setTimeout(() => {
        if (!STATE_CHANT.isPlaying) return;
        STATE_CHANT.currentWordIdx++;
        runChantSequenceForCurrentWord();
      }, 2400);
      
    }, 2500);
    
  }, 1600);
}

function speakVietnameseResponse(wordEn, meaningVi) {
  if (!('speechSynthesis' in window)) return;
  // Speak Vietnamese text with Vietnamese voice if present
  const utt = new SpeechSynthesisUtterance(meaningVi);
  utt.rate = 1.05;
  utt.pitch = 1.1;
  utt.lang = 'vi-VN';
  
  const voices = window.speechSynthesis.getVoices();
  const viVoice = voices.find(v => v.lang.startsWith('vi') || v.name.includes('Vietnamese') || v.name.includes('HoaiMy') || v.name.includes('NamMinh') || v.name.includes('Linh') || v.name.includes('An'));
  if (viVoice) utt.voice = viVoice;
  
  window.speechSynthesis.speak(utt);
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

function initScrambleGame() {
  const words = [...STATE.activeWords];
  if (!words || words.length === 0) return;
  
  STATE.scramble.words = words;
  STATE.scramble.currentIdx = 0;
  STATE.scramble.score = 0;
  
  const scoreEl = document.getElementById('scrambleScoreVal');
  const totalEl = document.getElementById('scrambleTotalWords');
  if (scoreEl) scoreEl.textContent = '0';
  if (totalEl) totalEl.textContent = words.length;
  
  loadScrambleWord();
}

function loadScrambleWord() {
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
  showPeekBanner(2500);
}

function showPeekBanner(durationMs = 2500) {
  const peek = document.getElementById('scramblePeekBanner');
  const info = document.getElementById('scrambleInfoArea');
  if (peek) peek.style.display = 'block';
  if (info) info.style.display = 'none';
  
  if (STATE.scramble.currentWordObj) {
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
  const container = document.querySelector('#tab-scramble .game-container');
  if (typeof SFX !== 'undefined') SFX.playWin();
  if (typeof launchConfetti === 'function') launchConfetti();
  if (container) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 1.5rem;">
        <div style="font-size: 4rem; margin-bottom: 1rem;">🏆</div>
        <h2 style="font-size: 2rem; font-weight: 900; color: #fff; margin-bottom: 0.8rem;">XUẤT SẮC HOÀN THÀNH TOÀN BỘ UNIT!</h2>
        <p style="font-size: 1.3rem; color: #fbbf24; font-weight: 800; margin-bottom: 1rem;">
          Tổng điểm xếp chữ đạt được: ${STATE.scramble.score} điểm
        </p>
        <p style="color: var(--text-muted); font-size: 1rem; max-width: 440px; margin: 0 auto 1.5rem;">
          Các em học sinh đã xuất sắc ghi nhớ và sắp xếp chính xác toàn bộ từ vựng của bài học này!
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
          <button class="fc-nav-btn btn-next" onclick="initScrambleGame()" style="max-width: none; padding: 0.9rem 2rem; font-size: 1.05rem;">
            🔄 Luyện tập ván mới
          </button>
        </div>
      </div>
    `;
  }
}
