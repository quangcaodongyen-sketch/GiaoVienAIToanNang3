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

export const UnifiedVocabPortal: React.FC<UnifiedVocabPortalProps> = ({
  currentStudent,
  onRewardMerit,
  onOpenIpaModal
}) => {
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

  const handleQuizAnswer = (selectedMeaning: string) => {
    if (quizSelectedOption !== null) return; // Đã chọn rồi
    setQuizSelectedOption(selectedMeaning);
    const isCorrect = selectedMeaning === currentQuizWord.meaning;
    if (isCorrect) {
      setQuizScore(s => s + 1);
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

  const handleListenAnswer = (selectedWord: string) => {
    if (listenSelectedOption !== null) return;
    setListenSelectedOption(selectedWord);
    if (selectedWord === currentListenWord.word) {
      setListenScore(s => s + 1);
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

  const handleCardClick = (card: MatchCard) => {
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
      // Đúng!
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
      // Sai: Báo đỏ tạm thời trong 800ms
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
    } else {
      setSpellFeedback('wrong');
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

        {/* 12 Tabs Button Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {/* 1. Flashcard */}
          <button
            type="button"
            onClick={() => setCurrentMode('flashcard')}
            className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              currentMode === 'flashcard'
                ? 'bg-blue-600 text-white shadow-sm font-black'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <span>🃏 1. Thẻ 3D</span>{missionState?.mission1.units[selectedUnit]?.modes['flashcard']?.qualityPassed && <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1 rounded-sm">✓</span>}
          </button>

          {/* 2. Bài Chant */}
          <button
            type="button"
            onClick={() => setCurrentMode('chant')}
            className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              currentMode === 'chant'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md font-black ring-2 ring-pink-400 animate-pulse'
                : 'bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 hover:bg-pink-100 border border-pink-200 dark:border-pink-900'
            }`}
            title="Bài Chant Nhạc Beat Điệu Call & Response"
          >
            <span>🎵 2. Bài Chant &amp; Beat</span>{missionState?.mission1.units[selectedUnit]?.modes['chant']?.qualityPassed && <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1 rounded-sm">✓</span>}
          </button>

          {/* 3. Ghép Cặp Từ */}
          <button
            type="button"
            onClick={() => setCurrentMode('match')}
            className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              currentMode === 'match'
                ? 'bg-emerald-600 text-white shadow-sm font-black'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Puzzle className="w-3.5 h-3.5" />
            <span>3. Ghép Cặp Từ</span>{missionState?.mission1.units[selectedUnit]?.modes['match']?.qualityPassed && <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1 rounded-sm">✓</span>}
          </button>

          {/* 4. Xếp Chữ / Ghép Chữ */}
          <button
            type="button"
            onClick={() => setCurrentMode('scramble')}
            className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              currentMode === 'scramble'
                ? 'bg-indigo-600 text-white shadow-sm font-black'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <span>🔤 4. Ghép Chữ</span>{missionState?.mission1.units[selectedUnit]?.modes['scramble']?.qualityPassed && <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1 rounded-sm">✓</span>}
          </button>

          {/* 5. Phản Xạ Nhanh */}
          <button
            type="button"
            onClick={() => setCurrentMode('blitz')}
            className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              currentMode === 'blitz'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <span>⚡ 5. Phản Xạ 5s</span>{missionState?.mission1.units[selectedUnit]?.modes['blitz']?.qualityPassed && <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1 rounded-sm">✓</span>}
          </button>

          {/* 6. Trắc Nghiệm */}
          <button
            type="button"
            onClick={() => setCurrentMode('quiz')}
            className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              currentMode === 'quiz'
                ? 'bg-blue-600 text-white shadow-sm font-black'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>6. Trắc Nghiệm</span>{missionState?.mission1.units[selectedUnit]?.modes['quiz']?.qualityPassed && <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1 rounded-sm">✓</span>}
          </button>

          {/* 7. Luyện Nghe */}
          <button
            type="button"
            onClick={() => setCurrentMode('listen')}
            className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              currentMode === 'listen'
                ? 'bg-blue-600 text-white shadow-sm font-black'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>7. Luyện Nghe</span>{missionState?.mission1.units[selectedUnit]?.modes['listen']?.qualityPassed && <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1 rounded-sm">✓</span>}
          </button>

          {/* 8. Luyện Gõ Từ */}
          <button
            type="button"
            onClick={() => setCurrentMode('spelling')}
            className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              currentMode === 'spelling'
                ? 'bg-blue-600 text-white shadow-sm font-black'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>8. Luyện Gõ</span>{missionState?.mission1.units[selectedUnit]?.modes['spelling']?.qualityPassed && <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1 rounded-sm">✓</span>}
          </button>

          {/* 9. Thám Tử Ô Chữ */}
          <button
            type="button"
            onClick={() => setCurrentMode('hangman')}
            className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              currentMode === 'hangman'
                ? 'bg-purple-600 text-white shadow-sm font-black'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <span>🕵️ 9. Ô Chữ Bí Mật</span>{missionState?.mission1.units[selectedUnit]?.modes['hangman']?.qualityPassed && <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1 rounded-sm">✓</span>}
          </button>

          {/* 10. Ngữ Cảnh */}
          <button
            type="button"
            onClick={() => setCurrentMode('context')}
            className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              currentMode === 'context'
                ? 'bg-teal-600 text-white shadow-sm font-black'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <span>📝 10. Ngữ Cảnh</span>{missionState?.mission1.units[selectedUnit]?.modes['context']?.qualityPassed && <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1 rounded-sm">✓</span>}
          </button>

          {/* 11. Đánh Giá 15 Phút */}
          <button
            type="button"
            onClick={() => setCurrentMode('minitest')}
            className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
              currentMode === 'minitest'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 dark:border-amber-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>11. Kiểm Tra 15P</span>{missionState?.mission1.units[selectedUnit]?.modes['minitest']?.qualityPassed && <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1 rounded-sm">✓</span>}
          </button>

          {/* 12. Tra Cứu */}
          <button
            type="button"
            onClick={() => setCurrentMode('list')}
            className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ml-auto ${
              currentMode === 'list'
                ? 'bg-slate-800 text-white shadow-sm font-black'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
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
      {currentMode === 'quiz' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto">
          {!quizFinished ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-black">
                  Câu hỏi {quizIndex + 1} / {filteredVocab.length}
                </span>
                <span className="text-emerald-600 font-black">
                  Đúng: {quizScore} / {quizIndex + (quizSelectedOption ? 1 : 0)} câu
                </span>
              </div>

              {currentQuizWord && (
                <div className="text-center py-4 space-y-2">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                      {currentQuizWord.word}
                    </span>
                    <button
                      type="button"
                      onClick={() => speakWord(currentQuizWord.word)}
                      className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-sm font-mono text-slate-400">/{currentQuizWord.phonetic}/</div>
                  <p className="text-xs text-slate-500 font-medium pt-1">
                    Chọn nghĩa tiếng Việt chính xác nhất của từ trên:
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                {quizOptions.map((opt, i) => {
                  const isSelected = quizSelectedOption === opt;
                  const isCorrect = opt === currentQuizWord?.meaning;
                  let btnStyle = 'bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';

                  if (quizSelectedOption !== null) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-500 text-white border-emerald-600 font-black shadow-md';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-500 text-white border-rose-600 font-black';
                    } else {
                      btnStyle = 'opacity-40 bg-slate-100 border-slate-200 text-slate-400';
                    }
                  }

                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={quizSelectedOption !== null}
                      onClick={() => handleQuizAnswer(opt)}
                      className={`p-4 rounded-2xl border-2 text-left text-sm sm:text-base font-bold transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center font-black text-xs shrink-0">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {quizSelectedOption !== null && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                      )}
                      {quizSelectedOption !== null && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-white shrink-0" />
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
      {currentMode === 'listen' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto">
          {!listenFinished ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-black">
                  Câu nghe {listenIndex + 1} / {filteredVocab.length}
                </span>
                <span className="text-emerald-600 font-black">
                  Đúng: {listenScore} / {listenIndex + (listenSelectedOption ? 1 : 0)} câu
                </span>
              </div>

              {currentListenWord && (
                <div className="text-center py-4 space-y-3">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-purple-500/20">
                    <Headphones className="w-10 h-10 animate-pulse" />
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => speakWord(currentListenWord.word)}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Bấm Để Nghe Lại</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => speakWord(currentListenWord.word, 0.65)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>🐢 Nghe Chậm</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Em hãy lắng nghe và chọn từ tiếng Anh được phát âm:
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {listenOptions.map((optWord, i) => {
                  const isSelected = listenSelectedOption === optWord;
                  const isCorrect = optWord === currentListenWord?.word;
                  let btnStyle = 'bg-slate-50 dark:bg-slate-800/80 hover:bg-purple-50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';

                  if (listenSelectedOption !== null) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-500 text-white border-emerald-600 font-black shadow-md';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-500 text-white border-rose-600 font-black';
                    } else {
                      btnStyle = 'opacity-40 bg-slate-100 border-slate-200 text-slate-400';
                    }
                  }

                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={listenSelectedOption !== null}
                      onClick={() => handleListenAnswer(optWord)}
                      className={`p-4 rounded-2xl border-2 text-center text-base font-black transition cursor-pointer ${btnStyle}`}
                    >
                      {optWord}
                    </button>
                  );
                })}
              </div>

              {listenSelectedOption !== null && (
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center space-y-1">
                  <div className="text-xs font-mono text-blue-600 dark:text-blue-400">/{currentListenWord?.phonetic}/</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">Nghĩa: {currentListenWord?.meaning}</div>
                </div>
              )}

              {listenSelectedOption !== null && (
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextListen}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
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

      {/* DẠNG 4: NỐI CẶP TỪ (MATCHING) */}
      {currentMode === 'match' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-3xl mx-auto space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Puzzle className="w-5 h-5 text-indigo-500" />
                <span>Nối Cặp Từ Tiếng Anh Với Nghĩa Tiếng Việt</span>
              </h4>
              <p className="text-xs text-slate-500">
                Nhấp vào 1 từ tiếng Anh và 1 nghĩa tiếng Việt tương ứng để ghép cặp
              </p>
            </div>
            <button
              type="button"
              onClick={initMatchGame}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Đổi Ván Mới</span>
            </button>
          </div>

          {!matchFinished ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {matchCards.map(card => {
                const isSelected = selectedFirstCard?.id === card.id;
                const isWrong = matchWrongId === card.id;

                let cardStyle = 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-400';

                if (card.isMatched) {
                  cardStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 opacity-60 cursor-default';
                } else if (isSelected) {
                  cardStyle = 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300 scale-102';
                } else if (isWrong) {
                  cardStyle = 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-300 animate-shake';
                }

                return (
                  <button
                    key={card.id}
                    type="button"
                    disabled={card.isMatched}
                    onClick={() => handleCardClick(card)}
                    className={`min-h-[90px] sm:min-h-[105px] p-3 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition cursor-pointer select-none font-bold text-xs sm:text-sm ${cardStyle}`}
                  >
                    <span className="text-[10px] font-mono uppercase tracking-wider mb-1 opacity-70">
                      {card.type === 'word' ? '🇬🇧 English' : '🇻🇳 Tiếng Việt'}
                    </span>
                    <span className="line-clamp-2">{card.text}</span>
                    {card.isMatched && (
                      <Check className="w-4 h-4 text-emerald-600 mt-1" />
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

      {/* DẠNG 5: LUYỆN GÕ CHÍNH TẢ (SPELLING) */}
      {currentMode === 'spelling' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto">
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
    </div>
  );
};
