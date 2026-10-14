/**
 * ENG 12 VOCABULARY MASTER - APPLICATION LOGIC
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
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.18, 0.2), idx * 70);
    });
  }
  
  playWrong() {
    this.init();
    if (!this.ctx) return;
    [220, 180].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sawtooth', 0.2, 0.15), idx * 120);
    });
  }
  
  playFlip() {
    this.playTone(420, 'sine', 0.08, 0.1);
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
      window.confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
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
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt không hỗ trợ Web Speech Synthesis API');
      return;
    }
    window.speechSynthesis.cancel(); // Stop current speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1.0;
    
    // Select best English voice
    const langCode = STATE.preferredVoiceAccent === 'UK' ? 'en-GB' : 'en-US';
    utterance.lang = langCode;
    
    if (this.voices.length > 0) {
      // Find natural or google voice first
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
    
    // Update meta titles
    document.getElementById('unitTitleDisplay').textContent = `Unit ${unitObj.unit}: ${unitObj.title}`;
    document.getElementById('unitWordCountBadge').textContent = `${unitObj.word_count} từ`;
    
    // Update active pill
    document.querySelectorAll('.unit-pill').forEach((p, idx) => {
      p.classList.toggle('active', (idx + 1) === unitNum);
    });
  }
  
  // Render views
  renderFlashcard();
  initQuiz();
  initMatchGame();
  initListenGame();
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
    statusBadge.innerHTML = '<span style="color: #34d399; font-weight:700;">✅ Đã thuộc</span>';
  } else if (STATE.review.has(word.id)) {
    statusBadge.innerHTML = '<span style="color: #fbbf24; font-weight:700;">⚠️ Cần ôn lại</span>';
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
    STATE.currentWordIdx = 0; // Loop back
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
  
  // Step 1: Speak word
  SpeechEngine.speak(currentWord.word, 1.0);
  
  // Step 2: Flip after 2 seconds
  STATE.autoPlayTimer = setTimeout(() => {
    if (!STATE.isAutoPlaying) return;
    flipCard();
    
    // Step 3: Speak example after 1.5 seconds
    STATE.autoPlayTimer = setTimeout(() => {
      if (!STATE.isAutoPlaying) return;
      SpeechEngine.speak(currentWord.example, 1.0);
      
      // Step 4: Next card after 3.5 seconds
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
  
  // Shuffle words to make questions
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
    // Quiz finished!
    showQuizFinished();
    return;
  }
  
  document.getElementById('quizQIdx').textContent = STATE.quiz.currentIdx + 1;
  const progressPct = ((STATE.quiz.currentIdx) / STATE.quiz.total) * 100;
  document.getElementById('quizProgressFill').style.width = `${progressPct}%`;
  
  document.getElementById('quizPromptWord').textContent = q.word;
  document.getElementById('quizPromptIpa').textContent = q.ipa;
  
  // Generate 4 options (1 correct, 3 distractors)
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
    
    // Highlight correct button
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
    <div style="text-align: center; padding: 2rem 1rem; display: flex; flex-direction: column; align-items: center; gap: 1rem;">
      <div style="font-size: 3.5rem;">🎉</div>
      <h2 style="font-size: 1.8rem; font-weight: 800; color: #fff;">XUẤT SẮC HOÀN THÀNH BÀI QUIZ!</h2>
      <p style="font-size: 1.1rem; color: #fbbf24; font-weight: 700;">
        Tổng điểm đạt được: ${STATE.quiz.score} điểm
      </p>
      <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 400px;">
        Thầy/Cô và các em học sinh có thể tiếp tục với ván mới hoặc chuyển sang các chế độ Nối từ và Luyện nghe!
      </p>
      <div style="display: flex; gap: 1rem; margin-top: 1rem;">
        <button class="fc-nav-btn btn-next" onclick="initQuiz()" style="max-width: none; padding: 0.8rem 1.8rem;">
          🔄 Luyện tập lại
        </button>
      </div>
    </div>
  `;
}

// ==============================================================================
// 7. TAB 3: WORD MATCHING MEMORY GAME LOGIC
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
  
  // Timer setup
  if (STATE.match.timerInterval) clearInterval(STATE.match.timerInterval);
  STATE.match.startTime = Date.now();
  document.getElementById('matchTimerVal').textContent = '00:00';
  STATE.match.timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - STATE.match.startTime) / 1000);
    const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const s = String(elapsed % 60).padStart(2, '0');
    document.getElementById('matchTimerVal').textContent = `${m}:${s}`;
  }, 1000);
  
  // Generate 16 tiles (8 English, 8 Vietnamese)
  const tiles = [];
  chosenWords.forEach(w => {
    tiles.push({ id: w.id, text: w.word, type: 'en', wordObj: w });
    tiles.push({ id: w.id, text: w.meaning, type: 'vi', wordObj: w });
  });
  
  // Shuffle tiles
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
    // First card selected
    STATE.match.selectedCard = { el, tile };
    el.classList.add('selected');
  } else {
    // Second card selected
    const prev = STATE.match.selectedCard;
    if (prev.tile.index === tile.index) return; // Clicked same tile
    
    el.classList.add('selected');
    
    // Check if match
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
      // NO MATCH
      SFX.playWrong();
      setTimeout(() => {
        prev.el.classList.remove('selected');
        el.classList.remove('selected');
      }, 700);
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
  
  // Play sound after small delay
  setTimeout(() => {
    SpeechEngine.speak(q.word, 0.95);
  }, 400);
  
  // Distractors
  const otherWords = STATE.activeWords.filter(w => w.id !== q.id);
  const distractors = otherWords.sort(() => 0.5 - Math.random()).slice(0, 3);
  const options = [q, ...distractors].sort(() => 0.5 - Math.random());
  
  const grid = document.getElementById('listenOptionsGrid');
  grid.innerHTML = '';
  
  const prefixes = ['A', 'B', 'C', 'D'];
  options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.innerHTML = `<span class="opt-prefix">${prefixes[idx]}</span> <span style="font-size: 1.1rem; font-weight:700;">${opt.word}</span> <span style="font-size: 0.85rem; color: var(--text-muted); margin-left: auto;">${opt.pos}</span>`;
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
  
  // Filter by search & status
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
    const isMastered = STATE.mastered.has(w.id);
    
    card.innerHTML = `
      <div class="hub-card-header">
        <div>
          <div class="hub-word-main">${w.word} <span class="card-pos-badge" style="font-size: 0.7rem; padding: 0.15rem 0.5rem;">${w.pos}</span></div>
          <div class="hub-word-ipa">${w.ipa}</div>
        </div>
        <button class="fc-icon-btn star-hub-btn" style="width: 32px; height: 32px; color: ${isStarred ? '#fbbf24' : 'var(--text-muted)'};" data-id="${w.id}">
          ⭐
        </button>
      </div>
      <div class="hub-card-body">
        ${w.meaning}
      </div>
      <div class="hub-card-example">
        <div>${w.example}</div>
        <div style="font-style: italic; color: var(--text-sub); margin-top: 0.2rem;">${w.example_vi}</div>
      </div>
      <div class="hub-card-footer">
        <span style="font-size: 0.75rem; color: var(--text-sub);">Unit ${w.unit}</span>
        <button class="btn-pronounce btn-slow speak-hub-btn" data-word="${w.word}" style="padding: 0.3rem 0.8rem; font-size: 0.8rem;">
          🔊 Nghe
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
    row.style.background = 'rgba(255,255,255,0.04)';
    row.style.padding = '0.6rem 0.8rem';
    row.style.borderRadius = '8px';
    row.innerHTML = `
      <div style="display: flex; justify-content: space-between; font-size: 0.86rem; font-weight: 600; margin-bottom: 0.3rem;">
        <span>Unit ${u.unit}: ${u.title}</span>
        <span style="color: var(--accent-cyan);">${masteredCount}/${u.words.length} (${pct}%)</span>
      </div>
      <div style="width: 100%; height: 5px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden;">
        <div style="width: ${pct}%; height: 100%; background: linear-gradient(90deg, #6366f1, #10b981);"></div>
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
      
      // Stop autoplay if leaving flashcard tab
      if (btn.dataset.tab !== 'tab-flashcard') stopAutoPlay();
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
    const curUrl = window.location.href;
    document.getElementById('currentUrlDisplay').textContent = curUrl;
    // Generate QR using public free QR API
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
  
  // Close modals when clicking outside
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
  
  // Register Service Worker for PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});
