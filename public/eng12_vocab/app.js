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
const SpeechEngine = {
  voices: [],
  
  init() {
    if ('speechSynthesis' in window) {
      const updateVoices = () => {
        this.voices = window.speechSynthesis.getVoices();
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  },
  
  speak(text, rate = 1.0) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1.0;
    
    const langCode = STATE.preferredVoiceAccent === 'UK' ? 'en-GB' : 'en-US';
    utterance.lang = langCode;
    
    if (this.voices.length > 0) {
      const voice = this.voices.find(v => v.lang.startsWith(langCode) && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David') || v.name.includes('Jenny')))
        || this.voices.find(v => v.lang.startsWith(langCode))
        || this.voices.find(v => v.lang.startsWith('en'));
      if (voice) utterance.voice = voice;
    }
    
    window.speechSynthesis.speak(utterance);
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
    pill.addEventListener('click', () => selectUnit(u.unit));
    container.appendChild(pill);
  });
}

function selectUnit(unitNum) {
  STATE.currentUnit = unitNum;
  STATE.currentWordIdx = 0;
  STATE.isFlipped = false;
  stopAutoPlay();
  
  const unitObj = VOCABULARY_DATA.find(u => u.unit === unitNum);
  if (unitObj) {
    STATE.activeWords = [...unitObj.words];
    
    document.getElementById('unitTitleDisplay').textContent = `Unit ${unitObj.unit}: ${unitObj.title}`;
    document.getElementById('unitWordCountBadge').textContent = `${unitObj.word_count} từ`;
    
    document.querySelectorAll('.unit-pill').forEach((p, idx) => {
      p.classList.toggle('active', (idx + 1) === unitNum);
    });
  }
  
  renderFlashcard();
  initQuiz();
  initMatchGame();
  initListenGame();
  initScrambleGame();
  initBlitzGame();
  initSpellingGame();
  initHangmanGame();
  initContextGame();
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
  
  document.getElementById('matchedCountVal').textContent = '0';
  document.getElementById('totalMatchPairs').textContent = STATE.match.totalPairs;
  
  if (STATE.match.timerInterval) clearInterval(STATE.match.timerInterval);
  STATE.match.startTime = Date.now();
  document.getElementById('matchTimerVal').textContent = '00:00';
  STATE.match.timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - STATE.match.startTime) / 1000);
    const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const s = String(elapsed % 60).padStart(2, '0');
    document.getElementById('matchTimerVal').textContent = `${m}:${s}`;
  }, 1000);
  
  const tiles = [];
  chosenWords.forEach(w => {
    tiles.push({ id: w.id, text: w.word, type: 'en', wordObj: w });
    tiles.push({ id: w.id, text: w.meaning, type: 'vi', wordObj: w });
  });
  
  tiles.sort(() => 0.5 - Math.random());
  
  const board = document.getElementById('matchGameBoard');
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
  if (el.classList.contains('matched') || el.classList.contains('selected')) return;
  
  SFX.playFlip();
  if (tile.type === 'en') {
    SpeechEngine.speak(tile.text, 1.0);
  }
  
  if (!STATE.match.selectedCard) {
    STATE.match.selectedCard = { el, tile };
    el.classList.add('selected');
  } else {
    const prev = STATE.match.selectedCard;
    if (prev.tile.index === tile.index) return;
    
    el.classList.add('selected');
    
    if (prev.tile.id === tile.id && prev.tile.type !== tile.type) {
      // MATCH!
      setTimeout(() => {
        prev.el.classList.remove('selected');
        el.classList.remove('selected');
        prev.el.classList.add('matched');
        el.classList.add('matched');
        SFX.playMatchSuccess();
        
        STATE.match.matchedPairs++;
        document.getElementById('matchedCountVal').textContent = STATE.match.matchedPairs;
        STATE.mastered.add(tile.id);
        saveProgress();
        
        if (STATE.match.matchedPairs === STATE.match.totalPairs) {
          clearInterval(STATE.match.timerInterval);
          SFX.playWin();
          setTimeout(() => {
            alert(`🎉 CHÚC MỪNG BẠN ĐÃ GHÉP HẾT 8 CẶP TỪ TRONG ${document.getElementById('matchTimerVal').textContent}!`);
          }, 300);
        }
      }, 350);
      STATE.match.selectedCard = null;
    } else {
      // NO MATCH - Shake effect
      SFX.playWrong();
      prev.el.classList.add('shake');
      el.classList.add('shake');
      setTimeout(() => {
        prev.el.classList.remove('selected', 'shake');
        el.classList.remove('selected', 'shake');
      }, 600);
      STATE.match.selectedCard = null;
    }
  }
}

// ==============================================================================
// 8. TAB 4: LISTENING MASTER GAME LOGIC
// ==============================================================================
function initListenGame() {
  const words = [...STATE.activeWords];
  if (words.length < 4) return;
  
  const shuffled = words.sort(() => 0.5 - Math.random());
  STATE.listen.questions = shuffled.slice(0, Math.min(10, shuffled.length));
  STATE.listen.currentIdx = 0;
  STATE.listen.score = 0;
  STATE.listen.total = STATE.listen.questions.length;
  
  document.getElementById('listenScoreVal').textContent = '0';
  document.getElementById('listenTotalQ').textContent = STATE.listen.total;
  
  renderListenQuestion();
}

function renderListenQuestion() {
  const q = STATE.listen.questions[STATE.listen.currentIdx];
  if (!q) {
    SFX.playWin();
    alert(`🎉 Bạn đã hoàn thành bài luyện nghe với ${STATE.listen.score} điểm!`);
    initListenGame();
    return;
  }
  
  document.getElementById('listenQIdx').textContent = STATE.listen.currentIdx + 1;
  
  setTimeout(() => {
    SpeechEngine.speak(q.word, 0.95);
  }, 400);
  
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
        renderListenQuestion();
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
    
    card.querySelector('.speak-hub-btn').addEventListener('click', () => {
      SpeechEngine.speak(w.word, 1.0);
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
  // Tabs switching
  document.querySelectorAll('.mode-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const targetPane = document.getElementById(btn.dataset.tab);
      if (targetPane) targetPane.classList.add('active');
      if (btn.dataset.tab !== 'tab-flashcard') stopAutoPlay();
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
  selectUnit(1);
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

function initSpellingGame() {
  if (!STATE.activeWords || STATE.activeWords.length === 0) return;
  STATE.spelling.questions = [...STATE.activeWords].sort(() => 0.5 - Math.random()).slice(0, 15);
  STATE.spelling.currentIdx = 0;
  STATE.spelling.score = 0;
  
  const scoreEl = document.getElementById('spellingScoreVal');
  const totalEl = document.getElementById('spellingTotalQ');
  if (scoreEl) scoreEl.textContent = '0';
  if (totalEl) totalEl.textContent = STATE.spelling.questions.length;
  
  renderSpellingQuestion();
}

function renderSpellingQuestion() {
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
  
  // Speak word
  SpeechEngine.speak(q.word, 0.95);
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
      renderSpellingQuestion();
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
