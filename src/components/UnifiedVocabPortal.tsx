import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Volume2, 
  RotateCw, 
  ArrowLeft, 
  ArrowRight, 
  Shuffle, 
  Search, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Award, 
  Headphones, 
  Target, 
  Edit3, 
  Puzzle, 
  Check, 
  Eye, 
  Lightbulb, 
  Trophy,
  Gamepad2,
  Lock
} from 'lucide-react';
import { vocabularyService, VocabItem, UnitInfo } from '../services/vocabularyService';
import { audioPronunciationService, VoiceAccent } from '../services/audioPronunciationService';
import { studentGradebookService, StudentProfile } from '../services/studentGradebookService';
import { midtermMissionService, MidtermMissionState } from '../services/midtermMissionService';

interface UnifiedVocabPortalProps {
  currentStudent: StudentProfile | null;
  onRewardMerit?: (reason: string, points: number) => void;
  onOpenIpaModal?: () => void;
}

type PracticeMode = 
  | 'flashcard' 
  | 'chant' 
  | 'match' 
  | 'scramble' 
  | 'blitz' 
  | 'quiz' 
  | 'listen' 
  | 'spelling' 
  | 'hangman' 
  | 'context' 
  | 'minitest' 
  | 'list';


// ==================== HỆ THỐNG ÂM THANH SƯ PHẠM & HIỆU ỨNG ĐIỂM THƯỞNG BAY LÊN ====================
const playCorrectSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;

    // Hợp âm 4 nốt arpeggio thánh thót ngân vang: C5 (523Hz) -> E5 (659Hz) -> G5 (784Hz) -> C6 (1046Hz)
    const freqs = [523.25, 659.25, 783.99, 1046.50];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle'; // Âm sắc chuông ấm áp trong trẻo
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0, now + idx * 0.07);
      gain.gain.linearRampToValueAtTime(0.28, now + idx * 0.07 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.48);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.52);
    });

    // Nốt chuông ngân cao tinh tế C7 (2093Hz)
    const chime = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    chime.type = 'sine';
    chime.frequency.setValueAtTime(2093, now + 0.22);
    chimeGain.gain.setValueAtTime(0, now + 0.22);
    chimeGain.gain.linearRampToValueAtTime(0.12, now + 0.24);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    chime.connect(chimeGain);
    chimeGain.connect(ctx.destination);
    chime.start(now + 0.22);
    chime.stop(now + 0.7);
  } catch (err) {
    console.warn('Audio play error:', err);
  }
};

const playWrongSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.22);

    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.23);
  } catch (e) {
    // ignore
  }
};

interface FloatingScore {
  id: number;
  text: string;
  x: number;
  y: number;
}

export const UnifiedVocabPortal: React.FC<UnifiedVocabPortalProps> = ({
  currentStudent,
  onRewardMerit,
  onOpenIpaModal
}) => {
  // State hiệu ứng +10 điểm bay lên
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);

  const triggerScorePopup = (
    e?: React.MouseEvent | { clientX?: number; clientY?: number } | null,
    text: string = '+10 Điểm! ⭐'
  ) => {
    playCorrectSound();

    let posX = window.innerWidth / 2;
    let posY = window.innerHeight / 2;

    if (e && typeof e.clientX === 'number' && typeof e.clientY === 'number' && e.clientX > 0 && e.clientY > 0) {
      posX = e.clientX;
      posY = e.clientY;
    }

    posX = Math.max(90, Math.min(window.innerWidth - 90, posX));
    posY = Math.max(60, Math.min(window.innerHeight - 60, posY));

    const newScore: FloatingScore = {
      id: Date.now() + Math.random(),
      text,
      x: posX,
      y: posY
    };

    setFloatingScores(prev => [...prev, newScore]);

    setTimeout(() => {
      setFloatingScores(prev => prev.filter(item => item.id !== newScore.id));
    }, 1300);

    if (currentStudent) {
      studentGradebookService.recordPracticeMerit(
        currentStudent.id,
        `Đúng từ vựng Unit ${selectedUnit}`,
        10
      );
      if (onRewardMerit) {
        onRewardMerit(`Đúng từ vựng Unit ${selectedUnit}`, 10);
      }
    }
  };

  // TỰ ĐỘNG KHÓA KHỐI LỚP CHUẨN XÁC THEO LỚP CỦA HỌC SINH (VD: 8A1 -> LỚP 8, 6A2 -> LỚP 6)
  const deduceStudentGrade = (): number => {
    if (currentStudent?.grade && typeof currentStudent.grade === 'number' && currentStudent.grade >= 6 && currentStudent.grade <= 12) {
      return currentStudent.grade;
    }
    if (currentStudent?.className) {
      const m = String(currentStudent.className).match(/^(\d{1,2})/);
      if (m && m[1]) {
        const g = parseInt(m[1], 10);
        if (g >= 6 && g <= 12) return g;
      }
    }
    return 8;
  };

  const studentGrade = deduceStudentGrade();
  const [selectedGrade, setSelectedGrade] = useState<number>(studentGrade);
  const [allowGradeSwitch, setAllowGradeSwitch] = useState<boolean>(false);

  // Đồng bộ lại khối lớp khi học sinh đăng nhập hoặc đổi học sinh
  useEffect(() => {
    if (currentStudent) {
      const g = deduceStudentGrade();
      setSelectedGrade(g);
    }
  }, [currentStudent?.grade, currentStudent?.className, currentStudent?.id]);

  // Danh sách Unit theo khối lớp
  const availableUnits: UnitInfo[] = useMemo(() => {
    return vocabularyService.getUnitsByGrade(selectedGrade);
  }, [selectedGrade]);

  const [selectedUnit, setSelectedUnit] = useState<number>(1);
  const [vocabSearch, setVocabSearch] = useState<string>('');
  const [currentMode, setCurrentMode] = useState<PracticeMode>('flashcard');

  // Trạng thái Nhiệm Vụ Giữa Kỳ 1 của Thầy Thành (Theo dõi độ chính xác chống học chống đối)
  const [missionUpdateTrigger, setMissionUpdateTrigger] = useState<number>(0);
  const missionState = useMemo<MidtermMissionState | null>(() => {
    if (!currentStudent) return null;
    return midtermMissionService.getMissionState(
      currentStudent.id,
      currentStudent.name,
      currentStudent.className,
      currentStudent.grade || selectedGrade
    );
  }, [currentStudent, selectedGrade, missionUpdateTrigger]);

  // Danh sách từ vựng của Unit đang chọn
  const filteredVocab: VocabItem[] = useMemo(() => {
    return vocabularyService.getVocabulary(selectedGrade, selectedUnit, vocabSearch);
  }, [selectedGrade, selectedUnit, vocabSearch]);

  // Cấu hình âm thanh & giọng đọc
  const [voiceAccent, setVoiceAccent] = useState<VoiceAccent>(() => audioPronunciationService.getAccent());
  const [speechRate, setSpeechRate] = useState<number>(() => audioPronunciationService.getRate());

  const handleToggleAccent = (newAccent: VoiceAccent) => {
    setVoiceAccent(newAccent);
    audioPronunciationService.setAccent(newAccent);
  };

  const speakWord = (text: string, customRate?: number) => {
    audioPronunciationService.speak(text, {
      accent: voiceAccent,
      rate: customRate || speechRate
    });
  };

  // State Mini-game 3D & Chant iframe
  const [show3dMiniGames, setShow3dMiniGames] = useState<boolean>(false);
  const [stageViewType, setStageViewType] = useState<'standard' | '3d'>('standard');

  // Helper sinh URL đồng bộ cho mọi dạng bài tập trong hệ thống 3D & Chant
  const getGameUrl = (tabId: string) => {
    const params = new URLSearchParams();
    params.set('grade', String(selectedGrade));
    params.set('unit', String(selectedUnit));
    params.set('tab', tabId.startsWith('tab-') ? tabId : 'tab-' + tabId);
    params.set('embedded', '1');
    if (currentStudent) {
      params.set('name', currentStudent.name);
      params.set('class', currentStudent.className);
    }
    return `/tuvung/index.html?${params.toString()}`;
  };
  const [iframeKey, setIframeKey] = useState<number>(0);

  // ==================== STATE DẠNG 1: THẺ FLASHCARD 3D ====================
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const currentWord = filteredVocab[cardIndex] || filteredVocab[0];

  // ==================== STATE DẠNG 2: TRẮC NGHIỆM NGHĨA TỪ ====================
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // Sinh 4 lựa chọn cho câu trắc nghiệm hiện tại
  const currentQuizWord = filteredVocab[quizIndex];
  const quizOptions = useMemo(() => {
    if (!currentQuizWord || filteredVocab.length === 0) return [];
    const correct = currentQuizWord.meaning;
    const others = filteredVocab
      .filter(w => w.meaning !== correct)
      .map(w => w.meaning);
    // Xáo trộn distractor
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
    const all = [correct, ...shuffledOthers];
    return all.sort(() => 0.5 - Math.random());
  }, [currentQuizWord, filteredVocab]);

  const handleQuizAnswer = (selectedMeaning: string, e?: React.MouseEvent) => {
    if (quizSelectedOption !== null) return; // Đã chọn rồi
    setQuizSelectedOption(selectedMeaning);
    const isCorrect = selectedMeaning === currentQuizWord.meaning;
    if (isCorrect) {
      setQuizScore(s => s + 1);
      triggerScorePopup(e, '+10 Điểm! ⭐');
    } else {
      playWrongSound();
    }
  };

  const handleNextQuiz = () => {
    if (quizIndex < filteredVocab.length - 1) {
      setQuizIndex(i => i + 1);
      setQuizSelectedOption(null);
    } else {
      setQuizFinished(true);
      if (currentStudent) {
        const finalScore = quizScore;
        const totalQ = filteredVocab.length;
        const acc = Math.round((finalScore / totalQ) * 100);

        // Ghi nhận chất lượng vào Nhiệm Vụ GK1 (Chống học chống đối: Yêu cầu >= 60%)
        const qRes = midtermMissionService.recordVocabPracticeQuality(
          currentStudent.id,
          currentStudent.name,
          currentStudent.className,
          selectedGrade,
          selectedUnit,
          'quiz',
          acc,
          { score: finalScore, totalQuestions: totalQ }
        );
        setMissionUpdateTrigger(t => t + 1);

        studentGradebookService.recordPracticeMerit(currentStudent.id, `Trắc nghiệm từ vựng Unit ${selectedUnit} (${finalScore}/${totalQ})`, 10);
        if (onRewardMerit) onRewardMerit(`Trắc nghiệm từ vựng Unit ${selectedUnit}`, 10);

        if ([1, 2, 3].includes(selectedUnit)) {
          setTimeout(() => alert(qRes.message), 200);
        }
      }
    }
  };

  const handleRestartQuiz = () => {
    setQuizIndex(0);
    setQuizSelectedOption(null);
    setQuizScore(0);
    setQuizFinished(false);
  };

  // ==================== STATE DẠNG 3: LUYỆN NGHE CHỌN TỪ ====================
  const [listenIndex, setListenIndex] = useState<number>(0);
  const [listenSelectedOption, setListenSelectedOption] = useState<string | null>(null);
  const [listenScore, setListenScore] = useState<number>(0);
  const [listenFinished, setListenFinished] = useState<boolean>(false);

  const currentListenWord = filteredVocab[listenIndex];
  const listenOptions = useMemo(() => {
    if (!currentListenWord || filteredVocab.length === 0) return [];
    const correct = currentListenWord.word;
    const others = filteredVocab
      .filter(w => w.word !== correct)
      .map(w => w.word);
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
    const all = [correct, ...shuffledOthers];
    return all.sort(() => 0.5 - Math.random());
  }, [currentListenWord, filteredVocab]);

  // Tự động phát âm khi chuyển sang câu nghe mới
  useEffect(() => {
    if (currentMode === 'listen' && currentListenWord && !listenFinished) {
      const timer = setTimeout(() => {
        speakWord(currentListenWord.word);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentMode, listenIndex, currentListenWord, listenFinished]);

  const handleListenAnswer = (selectedWord: string, e?: React.MouseEvent) => {
    if (listenSelectedOption !== null) return;
    setListenSelectedOption(selectedWord);
    if (selectedWord === currentListenWord.word) {
      setListenScore(s => s + 1);
      triggerScorePopup(e, '+10 Điểm! ⭐');
    } else {
      playWrongSound();
    }
  };

  const handleNextListen = () => {
    if (listenIndex < filteredVocab.length - 1) {
      setListenIndex(i => i + 1);
      setListenSelectedOption(null);
    } else {
      setListenFinished(true);
      if (currentStudent) {
        const finalScore = listenScore;
        const totalQ = filteredVocab.length;
        const acc = Math.round((finalScore / totalQ) * 100);

        // Ghi nhận chất lượng vào Nhiệm Vụ GK1 (Chống học chống đối: Yêu cầu >= 60%)
        const lRes = midtermMissionService.recordVocabPracticeQuality(
          currentStudent.id,
          currentStudent.name,
          currentStudent.className,
          selectedGrade,
          selectedUnit,
          'listen',
          acc,
          { score: finalScore, totalQuestions: totalQ }
        );
        setMissionUpdateTrigger(t => t + 1);

        studentGradebookService.recordPracticeMerit(currentStudent.id, `Luyện nghe từ vựng Unit ${selectedUnit}`, 10);
        if (onRewardMerit) onRewardMerit(`Luyện nghe từ vựng Unit ${selectedUnit}`, 10);

        if ([1, 2, 3].includes(selectedUnit)) {
          setTimeout(() => alert(lRes.message), 200);
        }
      }
    }
  };

  const handleRestartListen = () => {
    setListenIndex(0);
    setListenSelectedOption(null);
    setListenScore(0);
    setListenFinished(false);
  };

  // ==================== STATE DẠNG 4: NỐI CẶP TỪ (MATCHING) ====================
  interface MatchCard {
    id: string;
    text: string;
    wordId: string;
    type: 'word' | 'meaning';
    isMatched: boolean;
  }

  const [matchCards, setMatchCards] = useState<MatchCard[]>([]);
  const [selectedFirstCard, setSelectedFirstCard] = useState<MatchCard | null>(null);
  const [matchWrongId, setMatchWrongId] = useState<string | null>(null);
  const [matchCount, setMatchCount] = useState<number>(0);
  const [matchFinished, setMatchFinished] = useState<boolean>(false);

  const initMatchGame = () => {
    if (filteredVocab.length === 0) return;
    // Chọn 5 từ ngẫu nhiên để nối
    const sampleWords = [...filteredVocab].sort(() => 0.5 - Math.random()).slice(0, 6);
    const cards: MatchCard[] = [];
    sampleWords.forEach(w => {
      cards.push({
        id: `word-${w.id}`,
        text: w.word,
        wordId: w.id,
        type: 'word',
        isMatched: false
      });
      cards.push({
        id: `meaning-${w.id}`,
        text: w.meaning,
        wordId: w.id,
        type: 'meaning',
        isMatched: false
      });
    });
    // Xáo trộn toàn bộ thẻ
    setMatchCards(cards.sort(() => 0.5 - Math.random()));
    setSelectedFirstCard(null);
    setMatchWrongId(null);
    setMatchCount(0);
    setMatchFinished(false);
  };

  useEffect(() => {
    if (currentMode === 'match') {
      initMatchGame();
    }
  }, [currentMode, selectedUnit, selectedGrade]);

  const handleCardClick = (card: MatchCard, e?: React.MouseEvent) => {
    if (card.isMatched) return;
    if (matchWrongId) return;

    // Phát âm nếu bấm vào từ tiếng Anh
    if (card.type === 'word') {
      speakWord(card.text);
    }

    if (!selectedFirstCard) {
      setSelectedFirstCard(card);
      return;
    }

    // Nếu bấm lại chính thẻ đó
    if (selectedFirstCard.id === card.id) {
      setSelectedFirstCard(null);
      return;
    }

    // Nếu bấm vào cùng loại (cùng là từ hoặc cùng là nghĩa)
    if (selectedFirstCard.type === card.type) {
      setSelectedFirstCard(card);
      return;
    }

    // Kiểm tra khớp
    if (selectedFirstCard.wordId === card.wordId) {
      // Ghép chuẩn: Nổi âm thanh báo đúng và +10 điểm bay lên
      triggerScorePopup(e, '+10 Điểm! ⭐');

      const newCards = matchCards.map(c => {
        if (c.wordId === card.wordId) {
          return { ...c, isMatched: true };
        }
        return c;
      });
      setMatchCards(newCards);
      setSelectedFirstCard(null);
      const newCount = matchCount + 1;
      setMatchCount(newCount);

      // Nếu đã ghép hết
      if (newCards.every(c => c.isMatched)) {
        setMatchFinished(true);
        if (currentStudent) {
          const mRes = midtermMissionService.recordVocabPracticeQuality(
            currentStudent.id,
            currentStudent.name,
            currentStudent.className,
            selectedGrade,
            selectedUnit,
            'match',
            100,
            { note: 'Hoàn thành ghép nối toàn bộ từ vựng' }
          );
          setMissionUpdateTrigger(t => t + 1);

          studentGradebookService.recordPracticeMerit(currentStudent.id, `Nối cặp từ vựng Unit ${selectedUnit}`, 10);
          if (onRewardMerit) onRewardMerit(`Nối cặp từ vựng Unit ${selectedUnit}`, 10);

          if ([1, 2, 3].includes(selectedUnit)) {
            setTimeout(() => alert(mRes.message), 200);
          }
        }
      }
    } else {
      // Ghép sai: Âm thanh báo sai nhẹ nhàng + Báo đỏ tạm thời trong 700ms
      playWrongSound();
      setMatchWrongId(card.id);
      setTimeout(() => {
        setMatchWrongId(null);
        setSelectedFirstCard(null);
      }, 700);
    }
  };

  // ==================== STATE DẠNG 5: LUYỆN GÕ CHÍNH TẢ (SPELLING) ====================
  const [spellIndex, setSpellIndex] = useState<number>(0);
  const [spellInput, setSpellInput] = useState<string>('');
  const [spellFeedback, setSpellFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [spellHintCount, setSpellHintCount] = useState<number>(0);
  const [spellShowAnswer, setSpellShowAnswer] = useState<boolean>(false);
  const [spellScore, setSpellScore] = useState<number>(0);
  const [spellFinished, setSpellFinished] = useState<boolean>(false);
  const spellInputRef = useRef<HTMLInputElement>(null);

  const currentSpellWord = filteredVocab[spellIndex];

  const handleSpellCheck = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentSpellWord) return;
    const cleanInput = spellInput.trim().toLowerCase();
    const cleanTarget = currentSpellWord.word.trim().toLowerCase();

    if (cleanInput === cleanTarget) {
      setSpellFeedback('correct');
      speakWord(currentSpellWord.word);
      setSpellScore(s => s + 1);
      triggerScorePopup(null, '+10 Điểm! ⭐');
    } else {
      setSpellFeedback('wrong');
      playWrongSound();
    }
  };

  const handleSpellNext = () => {
    if (spellIndex < filteredVocab.length - 1) {
      setSpellIndex(i => i + 1);
      setSpellInput('');
      setSpellFeedback(null);
      setSpellHintCount(0);
      setSpellShowAnswer(false);
      setTimeout(() => spellInputRef.current?.focus(), 100);
    } else {
      setSpellFinished(true);
      if (currentStudent) {
        const finalScore = spellScore;
        const totalQ = filteredVocab.length;
        const acc = Math.round((finalScore / totalQ) * 100);

        const sRes = midtermMissionService.recordVocabPracticeQuality(
          currentStudent.id,
          currentStudent.name,
          currentStudent.className,
          selectedGrade,
          selectedUnit,
          'spelling',
          acc,
          { score: finalScore, totalQuestions: totalQ }
        );
        setMissionUpdateTrigger(t => t + 1);

        studentGradebookService.recordPracticeMerit(currentStudent.id, `Luyện gõ từ vựng Unit ${selectedUnit}`, 10);
        if (onRewardMerit) onRewardMerit(`Luyện gõ từ vựng Unit ${selectedUnit}`, 10);

        if ([1, 2, 3].includes(selectedUnit)) {
          setTimeout(() => alert(sRes.message), 200);
        }
      }
    }
  };

  const handleSpellHint = () => {
    if (!currentSpellWord) return;
    const target = currentSpellWord.word;
    const nextCount = Math.min(spellHintCount + 1, target.length);
    setSpellHintCount(nextCount);
    setSpellInput(target.substring(0, nextCount));
  };

  const handleSpellRestart = () => {
    setSpellIndex(0);
    setSpellInput('');
    setSpellFeedback(null);
    setSpellHintCount(0);
    setSpellShowAnswer(false);
    setSpellScore(0);
    setSpellFinished(false);
  };

  // Nút thưởng điểm hoàn thành bài & ghi nhận chất lượng dạng bài
  const handleRewardUnitCompletion = () => {
    if (currentStudent) {
      // Ghi nhận chất lượng cho dạng bài hiện tại vào Nhiệm Vụ GK1
      const acc = currentMode === 'minitest' ? 80 : 100;
      const res = midtermMissionService.recordVocabPracticeQuality(
        currentStudent.id,
        currentStudent.name,
        currentStudent.className,
        selectedGrade,
        selectedUnit,
        currentMode,
        acc,
        { note: `Hoàn thành dạng bài ${currentMode}` }
      );
      setMissionUpdateTrigger(t => t + 1);

      const newTotal = studentGradebookService.recordVocabUnitCompleted(currentStudent.id, selectedUnit, selectedGrade);
      if (onRewardMerit) onRewardMerit(`Học từ vựng Unit ${selectedUnit}`, 10);
      alert(`🎉 Chúc mừng em ${currentStudent.name} đã hoàn thành bài tập từ vựng Unit ${selectedUnit} (Tiếng Anh ${selectedGrade})!\n⭐ Em được cộng +10 điểm chuyên cần vào tổng điểm thi đua (Tổng điểm hiện tại: ${newTotal}đ)!\n\n${res.message}`);
    } else {
      alert('Em hãy nhập Tên và Lớp ở trên để được ghi nhận điểm chuyên cần nhé!');
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* ==================== 1. THANH TIÊU ĐỀ & KHÓA KHỐI LỚP ==================== */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md font-black text-xl flex items-center justify-center shrink-0">
            🧠
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Học & Luyện Tập Từ Vựng Tiếng Anh
              </h3>

              {/* HUY HIỆU KHÓA ĐÚNG KHỐI LỚP CỦA HỌC SINH */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 font-black text-xs border border-blue-500/20">
                <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Tiếng Anh Lớp {selectedGrade} ({currentStudent?.className || 'Chương Trình Chuẩn'})</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tự động hiển thị đúng chương trình của lớp em để tránh nhầm lẫn • Tích hợp đầy đủ các dạng luyện tập
            </p>
          </div>
        </div>

        {/* NÚT HOÀN THÀNH BÀI (+10Đ) & NÚT MỞ MINI-GAME */}
        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          <button
            type="button"
            onClick={handleRewardUnitCompletion}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5 cursor-pointer"
            title="Bấm để nhận 10 điểm chuyên cần sau khi hoàn thành bài"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>🎉 Đã Thuộc Bài Này (+10đ)</span>
          </button>

          <button
            type="button"
            onClick={() => setShow3dMiniGames(!show3dMiniGames)}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
            title="Mở 11 Mini-game 3D và nhạc Chant ôn luyện"
          >
            <Gamepad2 className="w-4 h-4 text-indigo-500" />
            <span>{show3dMiniGames ? '✕ Đóng Mini-Game' : '🎮 Mini-Game & Chant'}</span>
          </button>
        </div>
      </div>

      {/* ==================== 2. THANH CHỌN BÀI (UNIT) & CÔNG CỤ ÂM THANH ==================== */}
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        {/* Hàng trên: Chọn Unit & Tùy chọn xem khối khác */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs w-full sm:w-auto">
            <span className="font-bold text-slate-500 dark:text-slate-400 shrink-0">Chọn Bài:</span>
            {(availableUnits.length > 0 ? availableUnits : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => ({ unitNumber: n, title: `Unit ${n}`, wordCount: 20 }))).map(u => {
              const uMission = missionState?.mission1.units[u.unitNumber];
              const isGK1Target = [1, 2, 3].includes(u.unitNumber);
              return (
                <button
                  key={u.unitNumber}
                  type="button"
                  onClick={() => {
                    setSelectedUnit(u.unitNumber);
                    setCardIndex(0);
                    setIsFlipped(false);
                    handleRestartQuiz();
                    handleRestartListen();
                    handleSpellRestart();
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    selectedUnit === u.unitNumber
                      ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  <span>Unit {u.unitNumber}</span>
                  {isGK1Target && uMission !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-black ${
                      uMission.unitPercent >= 100
                        ? 'bg-emerald-500 text-slate-950'
                        : (uMission.unitPercent > 0 ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300')
                    }`}>
                      {uMission.unitPercent}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Tùy chọn mở xem khối khác (chỉ dành cho khách/giáo viên chưa đăng nhập tài khoản học sinh) */}
            {!currentStudent && (
              <button
                type="button"
                onClick={() => setAllowGradeSwitch(!allowGradeSwitch)}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                {allowGradeSwitch ? '✕ Đóng chọn khối' : '🔄 Xem khối lớp khác'}
              </button>
            )}

            {onOpenIpaModal && (
              <button
                type="button"
                onClick={onOpenIpaModal}
                className="px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <span>🔤 IPA</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleToggleAccent(voiceAccent === 'US' ? 'UK' : 'US')}
              className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer border border-slate-200 dark:border-slate-700"
              title="Đổi giọng phát âm Anh - Mỹ hoặc Anh - Anh"
            >
              <span>{voiceAccent === 'US' ? '🇺🇸 Giọng Mỹ' : '🇬🇧 Giọng Anh'}</span>
            </button>
          </div>
        </div>

        {/* Banner tiến độ nhiệm vụ GK1 cho Unit 1 - 3 */}
        {[1, 2, 3].includes(selectedUnit) && (
          <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950/40 border border-blue-200 dark:border-indigo-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-600 text-white font-black text-xs shrink-0">🎯 Nhiệm Vụ GK1</span>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Unit {selectedUnit}: Đã đạt {missionState?.mission1.units[selectedUnit]?.qualityPassedCount || 0}/11 dạng bài ({missionState?.mission1.units[selectedUnit]?.unitPercent || 0}% hoàn thành).
                </span>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">
                  🛡️ Chống học chống đối: Chỉ tính % khi em làm đúng từ (đạt độ chính xác từ 60% trở lên).
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 font-black text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-slate-600 shrink-0 self-start sm:self-auto text-[11px]">
              {missionState?.mission1.units[selectedUnit]?.statusNote}
            </span>
          </div>
        )}

        {/* Khung chuyển khối lớp mở rộng khi cần (chỉ hiện khi chưa đăng nhập học sinh) */}
        {!currentStudent && allowGradeSwitch && (
          <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-slate-800/60 border border-blue-200 dark:border-slate-700 flex items-center gap-2 flex-wrap text-xs animate-in fade-in">
            <span className="font-bold text-slate-600 dark:text-slate-300">Khối lớp:</span>
            {[6, 7, 8, 9, 10, 11, 12].map(g => (
              <button
                key={g}
                type="button"
                onClick={() => {
                  setSelectedGrade(g);
                  setSelectedUnit(1);
                  setCardIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-2.5 py-1 rounded-lg font-black transition cursor-pointer ${
                  selectedGrade === g
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-blue-100'
                }`}
              >
                Lớp {g}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ==================== 3. THANH CHỌN ĐẦY ĐỦ 12 DẠNG BÀI TẬP TỪ VỰNG ==================== */}
      <div className="bg-white dark:bg-slate-900 p-2 sm:p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 flex-wrap">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Đầy Đủ 12 Dạng Bài Tập Luyện Từ Vựng Toàn Diện:</span>
          </span>
          <span className="text-[11px] text-blue-600 dark:text-blue-400">
            Khối Lớp {selectedGrade} • Unit {selectedUnit} ({filteredVocab.length} từ)
          </span>
        </div>

        {/* 12 Tabs Button Row - 3D TRANSLUCENT GLASS PILLS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 text-xs no-scrollbar">
          {/* 1. Flashcard */}
          <button
            type="button"
            onClick={() => setCurrentMode('flashcard')}
            className={`px-3.5 py-2 rounded-xl font-black transition-all duration-200 flex items-center gap-1.5 shrink-0 cursor-pointer select-none ${
              currentMode === 'flashcard'
                ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-[0_4px_0_#1d4ed8,0_0_15px_rgba(59,130,246,0.5),inset_0_1px_0_rgba(255,255,255,0.6)] -translate-y-0.5 border border-blue-400'
                : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-[0_2.5px_0_#cbd5e1] dark:shadow-[0_2.5px_0_#334155] hover:-translate-y-0.5 hover:shadow-[0_3.5px_0_#94a3b8] active:translate-y-0.5 active:shadow-[0_1px_0_#cbd5e1]'
            }`}
          >
            <span>🃏 1. Thẻ 3D</span>{missionState?.mission1.units[selectedUnit]?.modes['flashcard']?.qualityPassed && <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-1 rounded-sm shadow-xs">✓</span>}
          </button>

          {/* 2. Bài Chant */}
          <button
            type="button"
            onClick={() => setCurrentMode('chant')}
            className={`px-3.5 py-2 rounded-xl font-black transition-all duration-200 flex items-center gap-1.5 shrink-0 cursor-pointer select-none ${
              currentMode === 'chant'
                ? 'bg-gradient-to-b from-pink-500 to-rose-600 text-white shadow-[0_4px_0_#be123c,0_0_18px_rgba(244,63,94,0.6),inset_0_1px_0_rgba(255,255,255,0.6)] -translate-y-0.5 border border-pink-300 ring-2 ring-pink-400/50'
                : 'bg-pink-500/10 dark:bg-pink-950/40 backdrop-blur-md text-pink-700 dark:text-pink-300 border border-pink-300/60 dark:border-pink-800/60 shadow-[0_2.5px_0_#f472b6] dark:shadow-[0_2.5px_0_#831843] hover:-translate-y-0.5 hover:shadow-[0_3.5px_0_#ec4899] active:translate-y-0.5'
            }`}
            title="Bài Chant Nhạc Beat Điệu Call & Response"
          >
            <span>🎵 2. Bài Chant &amp; Beat</span>{missionState?.mission1.units[selectedUnit]?.modes['chant']?.qualityPassed && <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-1 rounded-sm shadow-xs">✓</span>}
          </button>

          {/* 3. Ghép Cặp Từ */}
          <button
            type="button"
            onClick={() => setCurrentMode('match')}
            className={`px-3.5 py-2 rounded-xl font-black transition-all duration-200 flex items-center gap-1.5 shrink-0 cursor-pointer select-none ${
              currentMode === 'match'
                ? 'bg-gradient-to-b from-emerald-500 to-teal-600 text-white shadow-[0_4px_0_#047857,0_0_15px_rgba(16,185,129,0.5),inset_0_1px_0_rgba(255,255,255,0.6)] -translate-y-0.5 border border-emerald-400'
                : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-[0_2.5px_0_#cbd5e1] dark:shadow-[0_2.5px_0_#334155] hover:-translate-y-0.5 hover:shadow-[0_3.5px_0_#94a3b8] active:translate-y-0.5'
            }`}
          >
            <Puzzle className="w-3.5 h-3.5" />
            <span>3. Ghép Cặp Từ</span>{missionState?.mission1.units[selectedUnit]?.modes['match']?.qualityPassed && <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-1 rounded-sm shadow-xs">✓</span>}
          </button>

          {/* 4. Xếp Chữ / Ghép Chữ */}
          <button
            type="button"
            onClick={() => setCurrentMode('scramble')}
            className={`px-3.5 py-2 rounded-xl font-black transition-all duration-200 flex items-center gap-1.5 shrink-0 cursor-pointer select-none ${
              currentMode === 'scramble'
                ? 'bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-[0_4px_0_#3730a3,0_0_15px_rgba(99,102,241,0.5),inset_0_1px_0_rgba(255,255,255,0.6)] -translate-y-0.5 border border-indigo-400'
                : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-[0_2.5px_0_#cbd5e1] dark:shadow-[0_2.5px_0_#334155] hover:-translate-y-0.5 hover:shadow-[0_3.5px_0_#94a3b8] active:translate-y-0.5'
            }`}
          >
            <span>🔤 4. Ghép Chữ</span>{missionState?.mission1.units[selectedUnit]?.modes['scramble']?.qualityPassed && <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-1 rounded-sm shadow-xs">✓</span>}
          </button>

          {/* 5. Phản Xạ Nhanh */}
          <button
            type="button"
            onClick={() => setCurrentMode('blitz')}
            className={`px-3.5 py-2 rounded-xl font-black transition-all duration-200 flex items-center gap-1.5 shrink-0 cursor-pointer select-none ${
              currentMode === 'blitz'
                ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 shadow-[0_4px_0_#b45309,0_0_15px_rgba(245,158,11,0.5),inset_0_1px_0_rgba(255,255,255,0.7)] -translate-y-0.5 border border-amber-300'
                : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-[0_2.5px_0_#cbd5e1] dark:shadow-[0_2.5px_0_#334155] hover:-translate-y-0.5 hover:shadow-[0_3.5px_0_#94a3b8] active:translate-y-0.5'
            }`}
          >
            <span>⚡ 5. Phản Xạ 5s</span>{missionState?.mission1.units[selectedUnit]?.modes['blitz']?.qualityPassed && <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-1 rounded-sm shadow-xs">✓</span>}
          </button>

          {/* 6. Trắc Nghiệm */}
          <button
            type="button"
            onClick={() => setCurrentMode('quiz')}
            className={`px-3.5 py-2 rounded-xl font-black transition-all duration-200 flex items-center gap-1.5 shrink-0 cursor-pointer select-none ${
              currentMode === 'quiz'
                ? 'bg-gradient-to-b from-indigo-500 to-blue-600 text-white shadow-[0_4px_0_#3730a3,0_0_15px_rgba(99,102,241,0.5),inset_0_1px_0_rgba(255,255,255,0.6)] -translate-y-0.5 border border-indigo-400'
                : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-[0_2.5px_0_#cbd5e1] dark:shadow-[0_2.5px_0_#334155] hover:-translate-y-0.5 hover:shadow-[0_3.5px_0_#94a3b8] active:translate-y-0.5'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>6. Trắc Nghiệm</span>{missionState?.mission1.units[selectedUnit]?.modes['quiz']?.qualityPassed && <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-1 rounded-sm shadow-xs">✓</span>}
          </button>

          {/* 7. Luyện Nghe */}
          <button
            type="button"
            onClick={() => setCurrentMode('listen')}
            className={`px-3.5 py-2 rounded-xl font-black transition-all duration-200 flex items-center gap-1.5 shrink-0 cursor-pointer select-none ${
              currentMode === 'listen'
                ? 'bg-gradient-to-b from-purple-500 to-indigo-600 text-white shadow-[0_4px_0_#6b21a8,0_0_18px_rgba(168,85,247,0.5),inset_0_1px_0_rgba(255,255,255,0.6)] -translate-y-0.5 border border-purple-300 ring-2 ring-purple-400/40'
                : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-[0_2.5px_0_#cbd5e1] dark:shadow-[0_2.5px_0_#334155] hover:-translate-y-0.5 hover:shadow-[0_3.5px_0_#94a3b8] active:translate-y-0.5'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>7. Luyện Nghe</span>{missionState?.mission1.units[selectedUnit]?.modes['listen']?.qualityPassed && <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-1 rounded-sm shadow-xs">✓</span>}
          </button>

          {/* 8. Luyện Gõ Từ */}
          <button
            type="button"
            onClick={() => setCurrentMode('spelling')}
            className={`px-3.5 py-2 rounded-xl font-black transition-all duration-200 flex items-center gap-1.5 shrink-0 cursor-pointer select-none ${
              currentMode === 'spelling'
                ? 'bg-gradient-to-b from-sky-500 to-blue-600 text-white shadow-[0_4px_0_#0369a1,0_0_15px_rgba(14,165,233,0.5),inset_0_1px_0_rgba(255,255,255,0.6)] -translate-y-0.5 border border-sky-400'
                : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-[0_2.5px_0_#cbd5e1] dark:shadow-[0_2.5px_0_#334155] hover:-translate-y-0.5 hover:shadow-[0_3.5px_0_#94a3b8] active:translate-y-0.5'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>8. Luyện Gõ</span>{missionState?.mission1.units[selectedUnit]?.modes['spelling']?.qualityPassed && <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-1 rounded-sm shadow-xs">✓</span>}
          </button>

          {/* 9. Thám Tử Ô Chữ */}
          <button
            type="button"
            onClick={() => setCurrentMode('hangman')}
            className={`px-3.5 py-2 rounded-xl font-black transition-all duration-200 flex items-center gap-1.5 shrink-0 cursor-pointer select-none ${
              currentMode === 'hangman'
                ? 'bg-gradient-to-b from-purple-500 to-violet-600 text-white shadow-[0_4px_0_#581c87,0_0_15px_rgba(147,51,234,0.5),inset_0_1px_0_rgba(255,255,255,0.6)] -translate-y-0.5 border border-purple-400'
                : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-[0_2.5px_0_#cbd5e1] dark:shadow-[0_2.5px_0_#334155] hover:-translate-y-0.5 hover:shadow-[0_3.5px_0_#94a3b8] active:translate-y-0.5'
            }`}
          >
            <span>🕵️ 9. Ô Chữ Bí Mật</span>{missionState?.mission1.units[selectedUnit]?.modes['hangman']?.qualityPassed && <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-1 rounded-sm shadow-xs">✓</span>}
          </button>

          {/* 10. Ngữ Cảnh */}
          <button
            type="button"
            onClick={() => setCurrentMode('context')}
            className={`px-3.5 py-2 rounded-xl font-black transition-all duration-200 flex items-center gap-1.5 shrink-0 cursor-pointer select-none ${
              currentMode === 'context'
                ? 'bg-gradient-to-b from-teal-500 to-emerald-600 text-white shadow-[0_4px_0_#0f766e,0_0_15px_rgba(20,184,166,0.5),inset_0_1px_0_rgba(255,255,255,0.6)] -translate-y-0.5 border border-teal-400'
                : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-[0_2.5px_0_#cbd5e1] dark:shadow-[0_2.5px_0_#334155] hover:-translate-y-0.5 hover:shadow-[0_3.5px_0_#94a3b8] active:translate-y-0.5'
            }`}
          >
            <span>📝 10. Ngữ Cảnh</span>{missionState?.mission1.units[selectedUnit]?.modes['context']?.qualityPassed && <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-1 rounded-sm shadow-xs">✓</span>}
          </button>

          {/* 11. Đánh Giá 15 Phút */}
          <button
            type="button"
            onClick={() => setCurrentMode('minitest')}
            className={`px-3.5 py-2 rounded-xl font-black transition-all duration-200 flex items-center gap-1.5 shrink-0 cursor-pointer select-none ${
              currentMode === 'minitest'
                ? 'bg-gradient-to-b from-amber-400 to-orange-500 text-slate-950 shadow-[0_4px_0_#c2410c,0_0_18px_rgba(249,115,22,0.6),inset_0_1px_0_rgba(255,255,255,0.7)] -translate-y-0.5 border border-amber-300 ring-2 ring-amber-400/50'
                : 'bg-amber-500/10 dark:bg-amber-950/40 backdrop-blur-md text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800/60 shadow-[0_2.5px_0_#fbbf24] dark:shadow-[0_2.5px_0_#78350f] hover:-translate-y-0.5 hover:shadow-[0_3.5px_0_#f59e0b] active:translate-y-0.5'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>11. Kiểm Tra 15P</span>{missionState?.mission1.units[selectedUnit]?.modes['minitest']?.qualityPassed && <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-1 rounded-sm shadow-xs">✓</span>}
          </button>

          {/* 12. Tra Cứu */}
          <button
            type="button"
            onClick={() => setCurrentMode('list')}
            className={`px-3.5 py-2 rounded-xl font-black transition-all duration-200 flex items-center gap-1.5 shrink-0 cursor-pointer select-none ml-auto ${
              currentMode === 'list'
                ? 'bg-gradient-to-b from-slate-700 to-slate-800 text-white shadow-[0_4px_0_#1e293b,0_0_15px_rgba(51,65,85,0.5),inset_0_1px_0_rgba(255,255,255,0.4)] -translate-y-0.5 border border-slate-600'
                : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-[0_2.5px_0_#cbd5e1] dark:shadow-[0_2.5px_0_#334155] hover:-translate-y-0.5 hover:shadow-[0_3.5px_0_#94a3b8] active:translate-y-0.5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>12. Tra Cứu ({filteredVocab.length})</span>
          </button>
        </div>
      </div>

      {/* ==================== 4. NỘI DUNG TỪNG DẠNG BÀI TẬP ==================== */}

      {/* DẠNG 1: THẺ FLASHCARD 3D */}
      {currentMode === 'flashcard' && currentWord && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-3">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full min-h-[320px] sm:min-h-[360px] rounded-3xl p-6 sm:p-8 border-2 border-blue-500/30 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white shadow-xl flex flex-col justify-between cursor-pointer select-none transition-all hover:border-blue-400 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    Lớp {selectedGrade} • Unit {selectedUnit}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    {currentWord.type || 'v'}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400 font-bold">
                  {cardIndex + 1} / {filteredVocab.length}
                </span>
              </div>

              {!isFlipped ? (
                <div className="text-center py-6 sm:py-8 space-y-3">
                  <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white flex items-center justify-center gap-3">
                    <span>{currentWord.word}</span>
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-base sm:text-xl font-mono text-sky-300">
                    <span>/{currentWord.phonetic}/</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakWord(currentWord.word);
                      }}
                      className="p-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white shadow-md transition hover:scale-110 active:scale-95 cursor-pointer ml-1"
                      title="Nghe phát âm chuẩn"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 italic pt-2">
                    💡 Nhấp vào thẻ bất kỳ đâu để lật xem nghĩa & câu ví dụ
                  </p>
                </div>
              ) : (
                <div className="text-center py-4 sm:py-6 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Nghĩa Tiếng Việt</span>
                  <h3 className="text-2xl sm:text-4xl font-black text-amber-300">
                    {currentWord.meaning}
                  </h3>
                  {currentWord.example && (
                    <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-left space-y-1.5 max-w-xl mx-auto">
                      <p className="text-xs sm:text-sm font-semibold text-sky-200">
                        💬 "{currentWord.example}"
                      </p>
                      {currentWord.exampleMeaning && (
                        <p className="text-xs text-slate-300 italic">
                          👉 {currentWord.exampleMeaning}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/10 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCardIndex(idx => (idx > 0 ? idx - 1 : filteredVocab.length - 1));
                    setIsFlipped(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Từ Trước
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(!isFlipped);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-black text-xs shadow-md flex items-center gap-2 transition hover:scale-105 cursor-pointer"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>{isFlipped ? 'Xem Từ Tiếng Anh' : 'Lật Xem Nghĩa'}</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCardIndex(idx => (idx < filteredVocab.length - 1 ? idx + 1 : 0));
                    setIsFlipped(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  Từ Tiếp <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => speakWord(currentWord.word, 0.65)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                  title="Phát âm tốc độ chậm cho người mới bắt đầu"
                >
                  <span>🐢 Đọc Chậm (0.65x)</span>
                </button>
                <button
                  type="button"
                  onClick={() => speakWord(currentWord.word, 0.85)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                  title="Phát âm tốc độ chuẩn bản ngữ"
                >
                  <span>⚡ Đọc Chuẩn (0.85x)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  const randIdx = Math.floor(Math.random() * filteredVocab.length);
                  setCardIndex(randIdx);
                  setIsFlipped(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5" /> Xáo Trộn Ngẫu Nhiên
              </button>
            </div>
          </div>

          {/* CỘT PHẢI: BẢNG TỪ GỘP CHUNG RÚT GỌN */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col h-[420px] sm:h-[460px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>📋 Danh Sách Từ ({filteredVocab.length})</span>
              </h4>
              <div className="relative w-36 sm:w-44">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={vocabSearch}
                  onChange={(e) => {
                    setVocabSearch(e.target.value);
                    setCardIndex(0);
                  }}
                  placeholder="Tìm từ / nghĩa..."
                  className="w-full pl-8 pr-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800 pr-1 space-y-1 mt-1">
              {filteredVocab.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setCardIndex(idx);
                    setIsFlipped(false);
                  }}
                  className={`p-2.5 rounded-xl transition flex items-center justify-between gap-2 cursor-pointer ${
                    cardIndex === idx
                      ? 'bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono text-slate-400">{idx + 1}.</span>
                      <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                        {item.word}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                        {item.type || 'v'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">
                      {item.meaning}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakWord(item.word);
                    }}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-600 dark:text-slate-300 transition cursor-pointer shrink-0"
                    title="Nghe phát âm"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DẠNG 2: TRẮC NGHIỆM 4 LỰA CHỌN */}
      {/* DẠNG 6: TRẮC NGHIỆM (QUIZ) - 4 PHƯƠNG ÁN 3D NỔI TRONG SUỐT */}
      {currentMode === 'quiz' && (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl max-w-2xl mx-auto space-y-6">
          {!quizFinished ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-700 dark:text-blue-300 font-black border border-blue-400/40 shadow-xs">
                  🎯 Câu hỏi {quizIndex + 1} / {filteredVocab.length}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-black flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  Đúng: {quizScore} / {quizIndex + (quizSelectedOption ? 1 : 0)} câu
                </span>
              </div>

              {currentQuizWord && (
                <div className="text-center py-4 px-4 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-sky-500/15 backdrop-blur-md border border-indigo-200/80 dark:border-indigo-800/80 shadow-[0_4px_15px_rgba(99,102,241,0.1),inset_0_1px_0_rgba(255,255,255,0.7)] space-y-2">
                  <div className="inline-flex items-center gap-2.5">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight drop-shadow-xs">
                      {currentQuizWord.word}
                    </span>
                    <button
                      type="button"
                      onClick={() => speakWord(currentQuizWord.word)}
                      className="p-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-[0_3px_0_#1d4ed8,0_4px_10px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 active:translate-y-0.5 transition cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm font-mono font-bold text-sky-600 dark:text-sky-300">/{currentQuizWord.phonetic}/</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold pt-1">
                    Chọn nghĩa tiếng Việt chính xác nhất của từ trên:
                  </p>
                </div>
              )}

              {/* 4 PHƯƠNG ÁN TRẮC NGHIỆM 3D NỔI TRONG SUỐT */}
              <div className="grid grid-cols-1 gap-3.5">
                {quizOptions.map((opt, i) => {
                  const isSelected = quizSelectedOption === opt;
                  const isCorrect = opt === currentQuizWord?.meaning;

                  let optClasses = '';

                  if (quizSelectedOption !== null) {
                    if (isCorrect) {
                      optClasses = `
                        bg-gradient-to-r from-emerald-500 to-teal-600 text-white
                        border-2 border-emerald-300
                        shadow-[0_5px_0_#059669,0_0_25px_rgba(16,185,129,0.7),inset_0_2px_0_rgba(255,255,255,0.7)]
                        font-black scale-[1.01]
                      `;
                    } else if (isSelected) {
                      optClasses = `
                        bg-gradient-to-r from-rose-500 to-red-600 text-white
                        border-2 border-rose-300
                        shadow-[0_5px_0_#9f1239,0_0_25px_rgba(244,63,94,0.7),inset_0_2px_0_rgba(255,255,255,0.7)]
                        font-black animate-shake
                      `;
                    } else {
                      optClasses = `
                        opacity-35 bg-slate-100/60 dark:bg-slate-800/40 border-2 border-slate-200 dark:border-slate-700
                        text-slate-400 dark:text-slate-500 shadow-none scale-95
                      `;
                    }
                  } else {
                    // Trạng thái chờ: KHỐI PHÍM 3D NỔI TRONG SUỐT (AMBER/INDIGO 3D GLASS)
                    optClasses = `
                      bg-gradient-to-r from-amber-400/15 via-orange-500/10 to-amber-500/20
                      dark:from-amber-500/20 dark:via-orange-600/15 dark:to-amber-700/30
                      backdrop-blur-md border-2 border-amber-300/80 dark:border-amber-400/50
                      text-amber-950 dark:text-amber-100
                      shadow-[0_5px_0_#d97706,0_8px_18px_-3px_rgba(217,119,6,0.25),inset_0_1.5px_0_rgba(255,255,255,0.7)]
                      dark:shadow-[0_5px_0_#b45309,0_8px_18px_-3px_rgba(217,119,6,0.35),inset_0_1.5px_0_rgba(255,255,255,0.25)]
                      hover:-translate-y-0.5 hover:shadow-[0_7px_0_#d97706,0_12px_22px_-2px_rgba(217,119,6,0.35),inset_0_1.5px_0_rgba(255,255,255,0.85)]
                      hover:border-amber-400
                      active:translate-y-0.5 active:shadow-[0_2px_0_#d97706]
                    `;
                  }

                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={quizSelectedOption !== null}
                      onClick={(e) => handleQuizAnswer(opt, e)}
                      className={`p-4 rounded-2xl flex items-center justify-between text-left text-sm sm:text-base font-bold transition-all duration-200 cursor-pointer select-none ${optClasses}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-gradient-to-b from-amber-500 to-orange-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-[0_2px_0_#c2410c,inset_0_1px_0_rgba(255,255,255,0.5)]">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </div>
                      {quizSelectedOption !== null && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-white shrink-0 drop-shadow-md" />
                      )}
                      {quizSelectedOption !== null && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-white shrink-0 drop-shadow-md" />
                      )}
                    </button>
                  );
                })}
              </div>

              {quizSelectedOption !== null && (
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextQuiz}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>{quizIndex < filteredVocab.length - 1 ? 'Câu Tiếp Theo' : 'Xem Kết Quả'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-3xl font-black shadow-inner">
                🏆
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Hoàn Thành Trắc Nghiệm Unit {selectedUnit}!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Em đã trả lời đúng <strong className="text-emerald-600">{quizScore} / {filteredVocab.length} câu</strong> ({Math.round((quizScore / filteredVocab.length) * 100)}%).
              </p>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border border-amber-200 text-xs font-bold inline-block">
                ⭐ Em được cộng +10 điểm chuyên cần vào tổng điểm thi đua!
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleRestartQuiz}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
                >
                  Luyện Lại Ván Này
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentMode('match')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>Chuyển Sang Nối Từ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DẠNG 3: LUYỆN NGHE CHỌN TỪ */}
      {/* DẠNG 7: LUYỆN NGHE (LISTEN) - KHỐI 3D NỔI TRONG SUỐT (3D TRANSLUCENT GLASS) */}
      {currentMode === 'listen' && (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl max-w-2xl mx-auto space-y-6">
          {!listenFinished ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-700 dark:text-purple-300 font-black border border-purple-400/40 shadow-xs">
                  🎧 Câu nghe {listenIndex + 1} / {filteredVocab.length}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-black flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  Đúng: {listenScore} / {listenIndex + (listenSelectedOption ? 1 : 0)} câu
                </span>
              </div>

              {currentListenWord && (
                <div className="text-center py-2 space-y-3">
                  {/* Khối biểu tượng tai nghe 3D trong suốt phát quang */}
                  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 opacity-35 blur-xl animate-pulse"></div>
                    <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500/25 via-indigo-600/25 to-purple-700/35 backdrop-blur-md border-2 border-purple-300/60 dark:border-purple-400/50 text-white flex items-center justify-center shadow-[0_8px_20px_rgba(147,51,234,0.35),inset_0_2px_0_rgba(255,255,255,0.7)]">
                      <Headphones className="w-10 h-10 text-white drop-shadow-md animate-bounce" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => speakWord(currentListenWord.word)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-b from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-black text-xs shadow-[0_4px_0_#6b21a8,0_6px_15px_rgba(168,85,247,0.35),inset_0_1.5px_0_rgba(255,255,255,0.6)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_0_#6b21a8] transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Bấm Để Nghe Lại</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => speakWord(currentListenWord.word, 0.65)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-b from-amber-400/20 to-amber-500/30 hover:bg-amber-500/30 backdrop-blur-md border border-amber-400/50 text-amber-900 dark:text-amber-200 font-bold text-xs shadow-[0_3px_0_#d97706,0_4px_10px_rgba(245,158,11,0.2),inset_0_1px_0_rgba(255,255,255,0.6)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_0_#d97706] transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>🐢 Nghe Chậm</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Em hãy lắng nghe và chọn từ tiếng Anh được phát âm:
                  </p>
                </div>
              )}

              {/* 4 Nút Lựa Chọn 3D NỔI TRONG SUỐT (3D SAPPHIRE GLASS BUTTONS) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {listenOptions.map((optWord, i) => {
                  const isSelected = listenSelectedOption === optWord;
                  const isCorrect = optWord === currentListenWord?.word;

                  let optClasses = '';

                  if (listenSelectedOption !== null) {
                    if (isCorrect) {
                      optClasses = `
                        bg-gradient-to-b from-emerald-500 to-emerald-600 text-white
                        border-2 border-emerald-300
                        shadow-[0_6px_0_#047857,0_0_25px_rgba(16,185,129,0.7),inset_0_2px_0_rgba(255,255,255,0.7)]
                        scale-[1.02] font-black
                      `;
                    } else if (isSelected) {
                      optClasses = `
                        bg-gradient-to-b from-rose-500 to-red-600 text-white
                        border-2 border-rose-300
                        shadow-[0_6px_0_#9f1239,0_0_25px_rgba(244,63,94,0.7),inset_0_2px_0_rgba(255,255,255,0.7)]
                        animate-shake font-black
                      `;
                    } else {
                      optClasses = `
                        opacity-35 bg-slate-100/60 dark:bg-slate-800/40 border-2 border-slate-200 dark:border-slate-700
                        text-slate-400 dark:text-slate-500 shadow-none scale-95
                      `;
                    }
                  } else {
                    // Trạng thái chờ: KHỐI PHÍM 3D NỔI TRONG SUỐT (SAPPHIRE GLASS 3D)
                    optClasses = `
                      bg-gradient-to-b from-sky-400/15 via-blue-500/10 to-indigo-600/20
                      dark:from-sky-500/20 dark:via-blue-600/15 dark:to-indigo-700/30
                      backdrop-blur-md border-2 border-sky-300/80 dark:border-sky-400/50
                      text-sky-950 dark:text-sky-100
                      shadow-[0_6px_0_#0284c7,0_10px_20px_-3px_rgba(2,132,199,0.25),inset_0_1.5px_0_rgba(255,255,255,0.7)]
                      dark:shadow-[0_6px_0_#0369a1,0_10px_20px_-3px_rgba(2,132,199,0.35),inset_0_1.5px_0_rgba(255,255,255,0.25)]
                      hover:-translate-y-1 hover:shadow-[0_8px_0_#0284c7,0_14px_24px_-2px_rgba(2,132,199,0.35),inset_0_1.5px_0_rgba(255,255,255,0.85)]
                      hover:border-sky-400
                      active:translate-y-1 active:shadow-[0_2px_0_#0284c7,0_4px_8px_rgba(2,132,199,0.2)]
                    `;
                  }

                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={listenSelectedOption !== null}
                      onClick={(e) => handleListenAnswer(optWord, e)}
                      className={`p-4 sm:p-5 rounded-2xl flex items-center justify-center text-center text-base sm:text-lg font-black tracking-wide transition-all duration-200 cursor-pointer select-none ${optClasses}`}
                    >
                      <span>{optWord}</span>
                    </button>
                  );
                })}
              </div>

              {listenSelectedOption !== null && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/15 to-indigo-500/15 backdrop-blur-md border border-sky-300/50 text-center space-y-1 shadow-sm animate-in fade-in">
                  <div className="text-xs font-mono font-bold text-sky-700 dark:text-sky-300">/{currentListenWord?.phonetic}/</div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">Nghĩa: {currentListenWord?.meaning}</div>
                </div>
              )}

              {listenSelectedOption !== null && (
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextListen}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm shadow-[0_4px_0_#4338ca,0_8px_20px_rgba(99,102,241,0.4),inset_0_1px_0_rgba(255,255,255,0.5)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_0_#4338ca] transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>{listenIndex < filteredVocab.length - 1 ? 'Câu Tiếp Theo' : 'Xem Kết Quả'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto text-3xl font-black">
                🎧
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Hoàn Thành Luyện Nghe Unit {selectedUnit}!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Em đã nghe đúng <strong className="text-purple-600">{listenScore} / {filteredVocab.length} từ</strong>.
              </p>
              <div className="p-3 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold inline-block">
                ⭐ Em được cộng +10 điểm chuyên cần vào tổng điểm thi đua!
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleRestartListen}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
                >
                  Luyện Lại Ván Này
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DẠNG 4: NỐI CẶP TỪ (MATCHING) - 2 LOẠI MÀU SẮC 3D NỔI TRONG SUỐT (ENGLISH & TIẾNG VIỆT) */}
      {currentMode === 'match' && (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-xs">
                  <Puzzle className="w-5 h-5" />
                </span>
                <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Nối Cặp Từ Tiếng Anh Với Nghĩa Tiếng Việt
                </h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                <span>Nhấp vào 1 từ tiếng Anh và 1 nghĩa tiếng Việt tương ứng để ghép cặp</span>
                <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                <span className="inline-flex items-center gap-1.5 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-[0_0_8px_#38bdf8]"></span>
                  <span className="text-sky-600 dark:text-sky-400">Tiếng Anh (Xanh Lam 3D)</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_#fbbf24] ml-1"></span>
                  <span className="text-amber-600 dark:text-amber-400">Tiếng Việt (Cam Hổ Phách 3D)</span>
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Tiến độ ghép */}
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-2 shadow-xs">
                <span>🧩 Đã ghép:</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-black">
                  {matchCards.filter(c => c.isMatched).length / 2} / {matchCards.length > 0 ? matchCards.length / 2 : 6}
                </span>
              </div>

              <button
                type="button"
                onClick={initMatchGame}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-xs font-black shadow-[0_3px_0_#3730a3,0_4px_10px_rgba(79,70,229,0.3)] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_0_#3730a3] transition cursor-pointer flex items-center gap-1.5"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Đổi Ván Mới</span>
              </button>
            </div>
          </div>

          {!matchFinished ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4">
              {matchCards.map(card => {
                const isSelected = selectedFirstCard?.id === card.id;
                const isWrong = matchWrongId === card.id;
                const isWord = card.type === 'word';

                let cardClasses = '';
                let badgeClasses = '';

                if (card.isMatched) {
                  // Đã ghép đúng: Xanh ngọc lục bảo trong suốt hoàn thành
                  cardClasses = `
                    bg-emerald-500/10 dark:bg-emerald-950/20
                    border-2 border-emerald-400/40 dark:border-emerald-500/30
                    text-emerald-800 dark:text-emerald-300
                    shadow-[0_2px_0_#059669,inset_0_1px_0_rgba(255,255,255,0.4)]
                    opacity-40 cursor-default scale-[0.98]
                  `;
                  badgeClasses = 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-400/40';
                } else if (isWrong) {
                  // Ghép sai: Đỏ Ruby phát sáng rung lắc
                  cardClasses = `
                    bg-gradient-to-b from-rose-500 to-red-600 text-white
                    border-2 border-rose-300
                    shadow-[0_6px_0_#9f1239,0_0_25px_rgba(244,63,94,0.7),inset_0_2px_0_rgba(255,255,255,0.7)]
                    ring-4 ring-rose-400/70 animate-shake scale-[1.03] z-10
                  `;
                  badgeClasses = 'bg-rose-700/60 text-white border-rose-300/50';
                } else if (isSelected) {
                  // Đang chọn: Phát hào quang 3D nổi bật
                  if (isWord) {
                    cardClasses = `
                      bg-gradient-to-b from-sky-500 to-blue-600 text-white
                      border-2 border-sky-200
                      shadow-[0_7px_0_#0369a1,0_0_30px_rgba(56,189,248,0.8),inset_0_2px_0_rgba(255,255,255,0.8)]
                      ring-4 ring-sky-300/80 -translate-y-1.5 scale-[1.04] z-10
                    `;
                    badgeClasses = 'bg-white/25 text-white border-white/40';
                  } else {
                    cardClasses = `
                      bg-gradient-to-b from-amber-500 to-orange-600 text-white
                      border-2 border-amber-200
                      shadow-[0_7px_0_#c2410c,0_0_30px_rgba(249,115,22,0.8),inset_0_2px_0_rgba(255,255,255,0.8)]
                      ring-4 ring-amber-300/80 -translate-y-1.5 scale-[1.04] z-10
                    `;
                    badgeClasses = 'bg-white/25 text-white border-white/40';
                  }
                } else {
                  // Trạng thái bình thường: 2 LOẠI MÀU SẮC 3D NỔI TRONG SUỐT
                  if (isWord) {
                    // MÀU 1: TIẾNG ANH (Xanh Dương Tri Thức 3D Glass)
                    cardClasses = `
                      bg-gradient-to-b from-sky-400/20 via-blue-500/15 to-indigo-600/25
                      dark:from-sky-500/25 dark:via-blue-600/20 dark:to-indigo-700/35
                      backdrop-blur-md border-2 border-sky-300/80 dark:border-sky-400/50
                      text-sky-950 dark:text-sky-100
                      shadow-[0_6px_0_#0284c7,0_10px_20px_-3px_rgba(2,132,199,0.25),inset_0_1.5px_0_rgba(255,255,255,0.7)]
                      dark:shadow-[0_6px_0_#0369a1,0_10px_20px_-3px_rgba(2,132,199,0.35),inset_0_1.5px_0_rgba(255,255,255,0.25)]
                      hover:-translate-y-1 hover:shadow-[0_8px_0_#0284c7,0_14px_24px_-2px_rgba(2,132,199,0.35),inset_0_1.5px_0_rgba(255,255,255,0.85)]
                      hover:border-sky-400
                      active:translate-y-1 active:shadow-[0_2px_0_#0284c7,0_4px_8px_rgba(2,132,199,0.2)]
                    `;
                    badgeClasses = 'bg-sky-500/20 text-sky-800 dark:text-sky-200 border-sky-400/50';
                  } else {
                    // MÀU 2: TIẾNG VIỆT (Cam Hổ Phách Rực Rỡ 3D Glass)
                    cardClasses = `
                      bg-gradient-to-b from-amber-400/20 via-orange-500/15 to-rose-500/25
                      dark:from-amber-500/25 dark:via-orange-600/20 dark:to-rose-700/35
                      backdrop-blur-md border-2 border-amber-300/80 dark:border-amber-400/50
                      text-amber-950 dark:text-amber-100
                      shadow-[0_6px_0_#d97706,0_10px_20px_-3px_rgba(217,119,6,0.25),inset_0_1.5px_0_rgba(255,255,255,0.7)]
                      dark:shadow-[0_6px_0_#b45309,0_10px_20px_-3px_rgba(217,119,6,0.35),inset_0_1.5px_0_rgba(255,255,255,0.25)]
                      hover:-translate-y-1 hover:shadow-[0_8px_0_#d97706,0_14px_24px_-2px_rgba(217,119,6,0.35),inset_0_1.5px_0_rgba(255,255,255,0.85)]
                      hover:border-amber-400
                      active:translate-y-1 active:shadow-[0_2px_0_#d97706,0_4px_8px_rgba(217,119,6,0.2)]
                    `;
                    badgeClasses = 'bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-400/50';
                  }
                }

                return (
                  <button
                    key={card.id}
                    type="button"
                    disabled={card.isMatched}
                    onClick={(e) => handleCardClick(card, e)}
                    className={`min-h-[100px] sm:min-h-[115px] p-3 rounded-2xl flex flex-col items-center justify-between text-center transition-all duration-200 cursor-pointer select-none font-bold ${cardClasses}`}
                  >
                    <span className={`text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1 ${badgeClasses}`}>
                      {isWord ? '🇬🇧 English' : '🇻🇳 Tiếng Việt'}
                    </span>
                    <span className={`line-clamp-2 my-auto px-1 ${isWord ? 'font-black text-sm sm:text-base tracking-wide' : 'font-bold text-xs sm:text-sm leading-snug'}`}>
                      {card.text}
                    </span>
                    {card.isMatched ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                        <Check className="w-3.5 h-3.5" /> Đã khớp
                      </span>
                    ) : (
                      <span className="h-3.5"></span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl font-black">
                🎉
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Tuyệt Vời! Đã Nối Đúng Tất Cả Các Cặp Từ!
              </h3>
              <p className="text-xs text-slate-500">
                Phản xạ từ vựng của em rất nhanh nhạy!
              </p>
              <div className="p-3 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold inline-block">
                ⭐ Em được cộng +10 điểm chuyên cần vào tổng điểm thi đua!
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={initMatchGame}
                  className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-md transition cursor-pointer flex items-center gap-2 mx-auto"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Chơi Thêm Ván Mới</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DẠNG 8: LUYỆN GÕ CHÍNH TẢ (SPELLING) - 3D TRANSLUCENT GLASS */}
      {currentMode === 'spelling' && (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl max-w-2xl mx-auto space-y-6">
          {!spellFinished ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 font-black">
                  Luyện gõ từ {spellIndex + 1} / {filteredVocab.length}
                </span>
                <span className="text-emerald-600 font-black">
                  Đúng: {spellScore} từ
                </span>
              </div>

              {currentSpellWord && (
                <div className="text-center py-4 space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Nghĩa Tiếng Việt:
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {currentSpellWord.meaning}
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-sm font-mono text-sky-600 dark:text-sky-400">
                    <span>/{currentSpellWord.phonetic}/</span>
                    <button
                      type="button"
                      onClick={() => speakWord(currentSpellWord.word)}
                      className="p-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono inline-block">
                    Từ loại: {currentSpellWord.type || 'v'}
                  </span>
                </div>
              )}

              {/* Ô gõ từ */}
              <form onSubmit={handleSpellCheck} className="space-y-3">
                <div className="relative">
                  <input
                    ref={spellInputRef}
                    type="text"
                    value={spellInput}
                    onChange={(e) => {
                      setSpellInput(e.target.value);
                      setSpellFeedback(null);
                    }}
                    placeholder="Gõ từ tiếng Anh vào đây..."
                    autoFocus
                    className={`w-full px-5 py-4 rounded-2xl border-2 text-center text-lg sm:text-xl font-black tracking-wide transition focus:outline-hidden ${
                      spellFeedback === 'correct'
                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 ring-2 ring-emerald-300'
                        : spellFeedback === 'wrong'
                        ? 'border-rose-500 bg-rose-50/50 text-rose-900 ring-2 ring-rose-300'
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-600'
                    }`}
                  />
                </div>

                {spellFeedback === 'correct' && (
                  <div className="p-3 rounded-xl bg-emerald-500 text-white font-black text-xs text-center flex items-center justify-center gap-2 shadow-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Chính xác 100%! Rất giỏi!</span>
                  </div>
                )}

                {spellFeedback === 'wrong' && (
                  <div className="p-3 rounded-xl bg-rose-500 text-white font-black text-xs text-center flex items-center justify-center gap-2 shadow-sm">
                    <XCircle className="w-4 h-4" />
                    <span>Chưa đúng, em hãy thử lại hoặc bấm xem gợi ý nhé!</span>
                  </div>
                )}

                {spellShowAnswer && currentSpellWord && (
                  <div className="p-3 rounded-xl bg-amber-100 text-amber-900 font-black text-xs text-center">
                    Đáp án đúng: <span className="text-sm underline">{currentSpellWord.word}</span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 pt-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSpellHint}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <span>Gợi Ý Chữ Cái</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpellShowAnswer(true)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-slate-500" />
                      <span>Xem Đáp Án</span>
                    </button>
                  </div>

                  {spellFeedback === 'correct' ? (
                    <button
                      type="button"
                      onClick={handleSpellNext}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer ml-auto"
                    >
                      <span>Từ Tiếp Theo</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md transition cursor-pointer ml-auto"
                    >
                      Kiểm Tra (Enter)
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto text-3xl font-black">
                ✍️
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Hoàn Thành Luyện Gõ Unit {selectedUnit}!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Em đã gõ đúng chính tả <strong className="text-indigo-600">{spellScore} / {filteredVocab.length} từ</strong>.
              </p>
              <div className="p-3 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold inline-block">
                ⭐ Em được cộng +10 điểm chuyên cần vào tổng điểm thi đua!
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSpellRestart}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
                >
                  Luyện Lại Ván Này
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DẠNG 6: DANH MỤC TRA CỨU TOÀN BỘ TỪ */}
      {/* DẠNG 2: BÀI CHANT & KARAOKE PLAYER (NHẠC BEAT CALL & RESPONSE) */}
      {currentMode === 'chant' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-pink-200 dark:border-pink-900/50 shadow-lg overflow-hidden space-y-3">
          <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 px-5 py-3 text-white flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🎙️</span>
              <div>
                <h4 className="font-black text-sm sm:text-base">
                  Bài Chant &amp; Karaoke Nhịp Điệu (Call &amp; Response) • Tiếng Anh Lớp {selectedGrade}
                </h4>
                <p className="text-xs text-pink-100">
                  Unit {selectedUnit} • Nhạc beat sôi động, visualizer nhảy theo nhạc, học sinh đọc theo nhịp điệu
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRewardUnitCompletion}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+10đ Chuyên Cần</span>
              </button>
            </div>
          </div>

          <div className="h-[750px] w-full">
            <iframe
              key={`chant_${selectedGrade}_${selectedUnit}_${iframeKey}`}
              src={getGameUrl('tab-chant')}
              title="Bài Chant Tiếng Anh"
              className="w-full h-full border-0"
              allow="autoplay; microphone; clipboard-write"
            />
          </div>
        </div>
      )}

      {/* DẠNG 4: XẾP CHỮ / GHÉP CHỮ (WORD SCRAMBLE) */}
      {currentMode === 'scramble' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-indigo-200 dark:border-indigo-900/50 shadow-lg overflow-hidden space-y-3">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-3 text-white flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🔤</span>
              <div>
                <h4 className="font-black text-sm sm:text-base">
                  Xếp Chữ / Ghép Chữ (Word Scramble) • Tiếng Anh Lớp {selectedGrade}
                </h4>
                <p className="text-xs text-indigo-100">
                  Unit {selectedUnit} • Ghép các chữ cái nhảy lung tung thành từ vựng tiếng Anh chuẩn xác
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRewardUnitCompletion}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+10đ Chuyên Cần</span>
              </button>
            </div>
          </div>

          <div className="h-[750px] w-full">
            <iframe
              key={`scramble_${selectedGrade}_${selectedUnit}_${iframeKey}`}
              src={getGameUrl('tab-scramble')}
              title="Word Scramble Game"
              className="w-full h-full border-0"
              allow="autoplay; microphone; clipboard-write"
            />
          </div>
        </div>
      )}

      {/* DẠNG 5: PHẢN XẠ NHANH ĐÚNG/SAI (SPEED BLITZ) */}
      {currentMode === 'blitz' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-amber-200 dark:border-amber-900/50 shadow-lg overflow-hidden space-y-3">
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-5 py-3 text-slate-950 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">⚡</span>
              <div>
                <h4 className="font-black text-sm sm:text-base">
                  Phản Xạ Nhanh 5 Giây (Speed Blitz Đúng / Sai) • Tiếng Anh Lớp {selectedGrade}
                </h4>
                <p className="text-xs font-semibold text-amber-950">
                  Unit {selectedUnit} • Nhìn từ và nghĩa, phản xạ bấm Đúng hoặc Sai trong 5 giây đếm ngược
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRewardUnitCompletion}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-amber-300 font-black text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+10đ Chuyên Cần</span>
              </button>
            </div>
          </div>

          <div className="h-[750px] w-full">
            <iframe
              key={`blitz_${selectedGrade}_${selectedUnit}_${iframeKey}`}
              src={getGameUrl('tab-blitz')}
              title="Speed Blitz Game"
              className="w-full h-full border-0"
              allow="autoplay; microphone; clipboard-write"
            />
          </div>
        </div>
      )}

      {/* DẠNG 9: THÁM TỬ Ô CHỮ BÍ MẬT (HANGMAN) */}
      {currentMode === 'hangman' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-200 dark:border-purple-900/50 shadow-lg overflow-hidden space-y-3">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3 text-white flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🕵️</span>
              <div>
                <h4 className="font-black text-sm sm:text-base">
                  Thám Tử Ô Chữ Bí Mật (Hangman) • Tiếng Anh Lớp {selectedGrade}
                </h4>
                <p className="text-xs text-purple-100">
                  Unit {selectedUnit} • Đoán từng chữ cái tiếng Anh dựa trên gợi ý nghĩa và phát âm
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRewardUnitCompletion}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+10đ Chuyên Cần</span>
              </button>
            </div>
          </div>

          <div className="h-[750px] w-full">
            <iframe
              key={`hangman_${selectedGrade}_${selectedUnit}_${iframeKey}`}
              src={getGameUrl('tab-hangman')}
              title="Hangman Word Detective Game"
              className="w-full h-full border-0"
              allow="autoplay; microphone; clipboard-write"
            />
          </div>
        </div>
      )}

      {/* DẠNG 10: BÀI TẬP NGỮ CẢNH (CONTEXT SENTENCES) */}
      {currentMode === 'context' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-teal-200 dark:border-teal-900/50 shadow-lg overflow-hidden space-y-3">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-3 text-white flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">📝</span>
              <div>
                <h4 className="font-black text-sm sm:text-base">
                  Bài Tập Điền Từ Vào Ngữ Cảnh (Context Sentences) • Tiếng Anh Lớp {selectedGrade}
                </h4>
                <p className="text-xs text-teal-100">
                  Unit {selectedUnit} • Đọc câu văn hoàn chỉnh và điền từ vựng chuẩn ngữ pháp vào chỗ trống
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRewardUnitCompletion}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+10đ Chuyên Cần</span>
              </button>
            </div>
          </div>

          <div className="h-[750px] w-full">
            <iframe
              key={`context_${selectedGrade}_${selectedUnit}_${iframeKey}`}
              src={getGameUrl('tab-context')}
              title="Context Sentences Game"
              className="w-full h-full border-0"
              allow="autoplay; microphone; clipboard-write"
            />
          </div>
        </div>
      )}

      {/* DẠNG 11: ĐÁNH GIÁ 15 PHÚT & GIẤY KHEN (MINI TEST) */}
      {currentMode === 'minitest' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-amber-300 dark:border-amber-900/60 shadow-lg overflow-hidden space-y-3">
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-5 py-3 text-slate-950 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🏆</span>
              <div>
                <h4 className="font-black text-sm sm:text-base">
                  Kiểm Tra Đánh Giá Nhanh 15 Phút &amp; Cấp Giấy Khen • Tiếng Anh Lớp {selectedGrade}
                </h4>
                <p className="text-xs font-semibold text-amber-950">
                  Unit {selectedUnit} • 10-15 câu trắc nghiệm tốc độ, chấm điểm tức thì và xuất giấy khen danh dự
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRewardUnitCompletion}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-amber-300 font-black text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+10đ Chuyên Cần</span>
              </button>
            </div>
          </div>

          <div className="h-[750px] w-full">
            <iframe
              key={`minitest_${selectedGrade}_${selectedUnit}_${iframeKey}`}
              src={getGameUrl('tab-minitest')}
              title="Mini Test 15 Phút & Giấy Khen"
              className="w-full h-full border-0"
              allow="autoplay; microphone; clipboard-write"
            />
          </div>
        </div>
      )}

      {currentMode === 'list' && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" />
                <span>Bảng Tra Cứu Toàn Bộ Từ Vựng Unit {selectedUnit} (Tiếng Anh {selectedGrade})</span>
              </h4>
              <p className="text-xs text-slate-500">
                Tổng cộng {filteredVocab.length} từ vựng chuẩn SGK Global Success
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={vocabSearch}
                onChange={(e) => setVocabSearch(e.target.value)}
                placeholder="Tìm từ vựng hoặc nghĩa..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800 dark:text-slate-200">
              <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase text-[11px] font-black tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-3 w-12 text-center">STT</th>
                  <th className="py-3 px-4">Từ Tiếng Anh</th>
                  <th className="py-3 px-3 text-center">Phát Âm</th>
                  <th className="py-3 px-3 text-center">Từ Loại</th>
                  <th className="py-3 px-4">Nghĩa Tiếng Việt</th>
                  <th className="py-3 px-4">Câu Ví Dụ Minh Họa</th>
                  <th className="py-3 px-3 text-center">Học</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredVocab.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 text-center font-mono text-slate-400 font-bold">{idx + 1}</td>
                    <td className="py-3 px-4 font-black text-sm text-slate-900 dark:text-white">{item.word}</td>
                    <td className="py-3 px-3 text-center font-mono text-blue-600 dark:text-blue-400">/{item.phonetic}/</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[10px]">
                        {item.type || 'v'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">{item.meaning}</td>
                    <td className="py-3 px-4 text-slate-500 italic text-[11px] max-w-xs">
                      <div>"{item.example}"</div>
                      {item.exampleMeaning && <div className="text-slate-400 text-[10px]">👉 {item.exampleMeaning}</div>}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => speakWord(item.word)}
                          className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                          title="Nghe phát âm"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCardIndex(idx);
                            setCurrentMode('flashcard');
                            setIsFlipped(false);
                          }}
                          className="px-2 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold text-[10px] hover:bg-amber-200 transition cursor-pointer"
                          title="Học từ này trên Thẻ 3D"
                        >
                          Thẻ 3D
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== 5. KHU VỰC 11 MINI-GAME 3D & NHẠC CHANT (MỞ RỘNG KHI CẦN) ==================== */}
      {show3dMiniGames && (
        <div className="w-full rounded-3xl overflow-hidden border-2 border-indigo-400/50 shadow-2xl bg-slate-950 mt-4 animate-in fade-in">
          <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800 text-white shrink-0">
            <span className="text-xs sm:text-sm font-bold flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-indigo-400" />
              <span>🎮 11 Mini-Games 3D & Nhạc Chant Ôn Luyện Từ Vựng Toàn Diện</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIframeKey(k => k + 1)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1"
              >
                <RotateCw className="w-3 h-3" /> Làm Mới
              </button>
              <button
                onClick={() => setShow3dMiniGames(false)}
                className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition cursor-pointer"
              >
                ✕ Đóng Mini-Game
              </button>
            </div>
          </div>
          <div className="h-[750px] sm:h-[880px] w-full">
            <iframe
              key={iframeKey}
              src={`/tuvung/index.html?grade=${selectedGrade || currentStudent?.grade || 8}&class=${encodeURIComponent(currentStudent?.className || '')}&name=${encodeURIComponent(currentStudent?.name || '')}&embedded=1&v=${Date.now()}`}
              title="App Học Từ Vựng Tiếng Anh (Global Success)"
              className="w-full h-full border-0"
              allow="autoplay; microphone; clipboard-write"
            />
          </div>
        </div>
      )}

      {/* HIỆU ỨNG +10 ĐIỂM BAY LÊN KHI GHÉP CHUẨN HOẶC CHỌN ĐÁP ÁN ĐÚNG */}
      {floatingScores.map(score => (
        <div
          key={score.id}
          style={{
            left: `${score.x}px`,
            top: `${score.y}px`,
            animation: 'floatUpScore 1.25s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards'
          }}
          className="fixed pointer-events-none z-[9999] select-none -translate-x-1/2 -translate-y-1/2"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 border-2 border-white text-slate-950 font-black text-base sm:text-xl shadow-[0_10px_25px_rgba(245,158,11,0.65),0_4px_0_#b45309,inset_0_2px_0_rgba(255,255,255,0.85)]">
            <Sparkles className="w-5 h-5 text-slate-950 animate-spin" />
            <span className="tracking-wider drop-shadow-xs">{score.text}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
