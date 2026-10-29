import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';

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

import { studentGradebookService, StudentProfile, getDailyLoginRewardInfo } from '../services/studentGradebookService';

import { midtermMissionService, MidtermMissionState } from '../services/midtermMissionService';



interface UnifiedVocabPortalProps {

  currentStudent: StudentProfile | null;

  onRewardMerit?: (reason: string, points: number) => void;

  onOpenIpaModal?: () => void;

}



type PracticeMode = 

  | 'flashcard' 

  | 'match' 

  | 'quiz' 

  | 'listen' 

  | 'spelling' 

  | 'chant' 

  | 'scramble' 

  | 'blitz';





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

  // State hiệu ứng điểm bay lên & Chính sách khuyến mại
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);
  const loginReward = useMemo(() => getDailyLoginRewardInfo(), []);

  // ==================== BẢO VỆ QUYỀN LỢI HỌC SINH: ĐỒNG BỘ ĐIỂM THỜI GIAN THỰC ====================
  const [liveStudent, setLiveStudent] = useState<StudentProfile | null>(() => {
    if (currentStudent?.id) {
      const fresh = studentGradebookService.getStudents().find(s => s.id === currentStudent.id);
      return fresh || currentStudent;
    }
    return currentStudent || studentGradebookService.getActiveStudent();
  });

  useEffect(() => {
    if (currentStudent?.id) {
      const fresh = studentGradebookService.getStudents().find(s => s.id === currentStudent.id);
      setLiveStudent(fresh || currentStudent);
    }
  }, [currentStudent]);

  useEffect(() => {
    const handleGradebookUpdate = () => {
      const targetId = currentStudent?.id || liveStudent?.id;
      if (targetId) {
        const fresh = studentGradebookService.getStudents().find(s => s.id === targetId);
        if (fresh) setLiveStudent({ ...fresh });
      }
    };
    window.addEventListener('gvai_gradebook_updated', handleGradebookUpdate);
    return () => window.removeEventListener('gvai_gradebook_updated', handleGradebookUpdate);
  }, [currentStudent?.id, liveStudent?.id]);

  const refreshStudentScore = useCallback(() => {
    const targetId = currentStudent?.id || liveStudent?.id;
    if (targetId) {
      const fresh = studentGradebookService.getStudents().find(s => s.id === targetId);
      if (fresh) setLiveStudent({ ...fresh });
    }
  }, [currentStudent?.id, liveStudent?.id]);

  const studentRank = useMemo(() => {
    const target = liveStudent || currentStudent;
    if (!target) return 1;
    const all = studentGradebookService.getStudents();
    const sorted = [...all].sort((a, b) => (b.totalMeritPoints || 0) - (a.totalMeritPoints || 0));
    const idx = sorted.findIndex(s => s.id === target.id || (s.name === target.name && s.className === target.className));
    return idx >= 0 ? idx + 1 : 1;
  }, [liveStudent?.id, liveStudent?.totalMeritPoints, currentStudent?.id]);



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

      refreshStudentScore();

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



  // Bộ từ vựng sinh luyện tập chuẩn 20 từ (bảo đảm luôn đủ 20 câu để học sinh rèn luyện nhớ sâu)

  const [practiceSeed, setPracticeSeed] = useState<number>(0);

  const practiceVocabList: VocabItem[] = useMemo(() => {

    return vocabularyService.getPracticeVocabulary(selectedGrade, selectedUnit, 20);

  }, [selectedGrade, selectedUnit, practiceSeed]);



  // Ref cho bộ đếm thời gian tự động chuyển câu (Auto-advance mượt mà 1.2s - 1.4s)

  const autoNextQuizTimerRef = useRef<NodeJS.Timeout | null>(null);

  const autoNextListenTimerRef = useRef<NodeJS.Timeout | null>(null);

  const autoNextSpellTimerRef = useRef<NodeJS.Timeout | null>(null);



  // Tự động dọn dẹp timer khi chuyển bài, chuyển chế độ hoặc unmount

  useEffect(() => {

    return () => {

      if (autoNextQuizTimerRef.current) clearTimeout(autoNextQuizTimerRef.current);

      if (autoNextListenTimerRef.current) clearTimeout(autoNextListenTimerRef.current);

      if (autoNextSpellTimerRef.current) clearTimeout(autoNextSpellTimerRef.current);

    };

  }, [currentMode, selectedUnit, selectedGrade]);



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



  // Lắng nghe kết quả làm bài & học từ vựng từ iframe (Chant, Speed Blitz, Word Scramble...)

  useEffect(() => {

    const handleVocabMessage = (event: MessageEvent) => {

      try {

        const data = event.data;

        if (!data || !currentStudent) return;

        if (data.type === 'GVAI_VOCAB_PROGRESS' || data.type === 'GVAI_EXERCISE_COMPLETED') {

          const u = Number(data.unit) || selectedUnit;

          const g = Number(data.grade) || selectedGrade;

          const pts = data.xp || data.score || 10;

          studentGradebookService.recordVocabUnitCompleted(currentStudent.id, u, g);

          studentGradebookService.recordPracticeMerit(

            currentStudent.id,

            `${data.exerciseType || 'Bài tập từ vựng'} Unit ${u}`,

            pts

          );

          refreshStudentScore();

          if (onRewardMerit) {

            onRewardMerit(`Hoàn thành ${data.exerciseType || 'bài tập từ vựng'} Unit ${u}`, pts);

          }

        }

      } catch (err) {

        console.warn('Lỗi xử lý message từ iframe:', err);

      }

    };

    window.addEventListener('message', handleVocabMessage);

    return () => window.removeEventListener('message', handleVocabMessage);

  }, [currentStudent, selectedUnit, selectedGrade, onRewardMerit]);



  // ==================== STATE DẠNG 1: THẺ FLASHCARD 3D ====================

  const [cardIndex, setCardIndex] = useState<number>(0);

  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const [studiedWordsInUnit, setStudiedWordsInUnit] = useState<Set<number>>(new Set([0]));

  const [hasAwardedFlashcardUnit, setHasAwardedFlashcardUnit] = useState<Record<string, boolean>>({});



  // Tự động cộng điểm từ vựng khi học sinh lật xem hoặc duyệt từ vựng Flashcard

  const checkAndAwardFlashcardProgress = (newCardIdx: number) => {

    if (!currentStudent) return;

    const unitKey = `${selectedGrade}_${selectedUnit}`;

    setStudiedWordsInUnit(prev => {

      const next = new Set(prev);

      next.add(newCardIdx);

      if (!hasAwardedFlashcardUnit[unitKey] && (next.size >= Math.min(3, filteredVocab.length) || newCardIdx >= filteredVocab.length - 1)) {

        setHasAwardedFlashcardUnit(aw => ({ ...aw, [unitKey]: true }));

        studentGradebookService.recordVocabUnitCompleted(currentStudent.id, selectedUnit, selectedGrade);

        studentGradebookService.recordPracticeMerit(currentStudent.id, `Học từ vựng Flashcard Unit ${selectedUnit}`, 10);

        if (onRewardMerit) onRewardMerit(`Học từ vựng Flashcard Unit ${selectedUnit}`, 10);

        playCorrectSound();

      }

      return next;

    });

  };



  const currentWord = filteredVocab[cardIndex] || filteredVocab[0];



  // ==================== STATE DẠNG 2: TRẮC NGHIỆM NGHĨA TỪ (20 CÂU TỰ CHUYỂN) ====================

  const [quizIndex, setQuizIndex] = useState<number>(0);

  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);

  const [quizScore, setQuizScore] = useState<number>(0);

  const [quizFinished, setQuizFinished] = useState<boolean>(false);



  // Sinh 4 lựa chọn cho câu trắc nghiệm hiện tại từ bộ 20 từ

  const currentQuizWord = practiceVocabList[quizIndex] || practiceVocabList[0];

  const quizOptions = useMemo(() => {

    if (!currentQuizWord || practiceVocabList.length === 0) return [];

    const correct = currentQuizWord.meaning;

    // Lấy distractor từ toàn bộ kho từ vựng cùng khối lớp để phương án phong phú, không trùng lặp

    const allGradeVocab = vocabularyService.getVocabulary(selectedGrade, 0);

    const others = allGradeVocab

      .filter(w => w.meaning !== correct && w.word !== currentQuizWord.word)

      .map(w => w.meaning);

    const uniqueOthers = Array.from(new Set(others));

    // Xáo trộn distractor

    const shuffledOthers = [...uniqueOthers].sort(() => 0.5 - Math.random()).slice(0, 3);

    const all = [correct, ...shuffledOthers];

    return all.sort(() => 0.5 - Math.random());

  }, [currentQuizWord, practiceVocabList, selectedGrade]);



  const handleQuizAnswer = (selectedMeaning: string, e?: React.MouseEvent) => {

    if (quizSelectedOption !== null) return; // Đã chọn rồi

    setQuizSelectedOption(selectedMeaning);

    const isCorrect = selectedMeaning === currentQuizWord?.meaning;

    if (isCorrect) {

      setQuizScore(s => s + 1);

      triggerScorePopup(e, '+10 Điểm! ⭐');

    } else {

      playWrongSound();

    }



    // TỰ ĐỘNG CHUYỂN SANG CÂU TIẾP THEO SAU 1.3 GIÂY

    if (autoNextQuizTimerRef.current) clearTimeout(autoNextQuizTimerRef.current);

    autoNextQuizTimerRef.current = setTimeout(() => {

      handleNextQuiz();

    }, 1300);

  };



  const handleNextQuiz = () => {

    if (autoNextQuizTimerRef.current) {

      clearTimeout(autoNextQuizTimerRef.current);

      autoNextQuizTimerRef.current = null;

    }

    if (quizIndex < practiceVocabList.length - 1) {

      setQuizIndex(i => i + 1);

      setQuizSelectedOption(null);

    } else {

      setQuizFinished(true);

      if (currentStudent) {

        const finalScore = quizScore;

        const totalQ = practiceVocabList.length;

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

        studentGradebookService.recordVocabUnitCompleted(currentStudent.id, selectedUnit, selectedGrade);

        if (onRewardMerit) onRewardMerit(`Trắc nghiệm từ vựng Unit ${selectedUnit}`, 10);



        if ([1, 2, 3].includes(selectedUnit)) {

          setTimeout(() => alert(qRes.message), 200);

        }

      }

    }

  };



  const handleRestartQuiz = () => {

    if (autoNextQuizTimerRef.current) {

      clearTimeout(autoNextQuizTimerRef.current);

      autoNextQuizTimerRef.current = null;

    }

    setPracticeSeed(s => s + 1);

    setQuizIndex(0);

    setQuizSelectedOption(null);

    setQuizScore(0);

    setQuizFinished(false);

  };



  // ==================== STATE DẠNG 3: LUYỆN NGHE CHỌN TỪ (20 CÂU TỰ CHUYỂN) ====================

  const [listenIndex, setListenIndex] = useState<number>(0);

  const [listenSelectedOption, setListenSelectedOption] = useState<string | null>(null);

  const [listenScore, setListenScore] = useState<number>(0);

  const [listenFinished, setListenFinished] = useState<boolean>(false);



  const currentListenWord = practiceVocabList[listenIndex] || practiceVocabList[0];

  const listenOptions = useMemo(() => {

    if (!currentListenWord || practiceVocabList.length === 0) return [];

    const correct = currentListenWord.word;

    const allGradeVocab = vocabularyService.getVocabulary(selectedGrade, 0);

    const others = allGradeVocab

      .filter(w => w.word !== correct)

      .map(w => w.word);

    const uniqueOthers = Array.from(new Set(others));

    const shuffledOthers = [...uniqueOthers].sort(() => 0.5 - Math.random()).slice(0, 3);

    const all = [correct, ...shuffledOthers];

    return all.sort(() => 0.5 - Math.random());

  }, [currentListenWord, practiceVocabList, selectedGrade]);



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

    const isCorrect = selectedWord === currentListenWord?.word;

    if (isCorrect) {

      setListenScore(s => s + 1);

      triggerScorePopup(e, '+10 Điểm! ⭐');

    } else {

      playWrongSound();

    }



    // TỰ ĐỘNG CHUYỂN SANG CÂU TIẾP THEO SAU 1.4 GIÂY

    if (autoNextListenTimerRef.current) clearTimeout(autoNextListenTimerRef.current);

    autoNextListenTimerRef.current = setTimeout(() => {

      handleNextListen();

    }, 1400);

  };



  const handleNextListen = () => {

    if (autoNextListenTimerRef.current) {

      clearTimeout(autoNextListenTimerRef.current);

      autoNextListenTimerRef.current = null;

    }

    if (listenIndex < practiceVocabList.length - 1) {

      setListenIndex(i => i + 1);

      setListenSelectedOption(null);

    } else {

      setListenFinished(true);

      if (currentStudent) {

        const finalScore = listenScore;

        const totalQ = practiceVocabList.length;

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



        studentGradebookService.recordPracticeMerit(currentStudent.id, `Luyện nghe từ vựng Unit ${selectedUnit} (${finalScore}/${totalQ})`, 10);

        studentGradebookService.recordVocabUnitCompleted(currentStudent.id, selectedUnit, selectedGrade);

        if (onRewardMerit) onRewardMerit(`Luyện nghe từ vựng Unit ${selectedUnit}`, 10);



        if ([1, 2, 3].includes(selectedUnit)) {

          setTimeout(() => alert(lRes.message), 200);

        }

      }

    }

  };



  const handleRestartListen = () => {

    if (autoNextListenTimerRef.current) {

      clearTimeout(autoNextListenTimerRef.current);

      autoNextListenTimerRef.current = null;

    }

    setPracticeSeed(s => s + 1);

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

    const sourceVocab = practiceVocabList.length > 0 ? practiceVocabList : filteredVocab;

    if (sourceVocab.length === 0) return;

    // Chọn 6 từ ngẫu nhiên để nối

    const sampleWords = [...sourceVocab].sort(() => 0.5 - Math.random()).slice(0, 6);

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

          studentGradebookService.recordVocabUnitCompleted(currentStudent.id, selectedUnit, selectedGrade);

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



  // ==================== STATE DẠNG 5: LUYỆN GÕ CHÍNH TẢ (SPELLING - 20 TỪ) ====================

  const [spellIndex, setSpellIndex] = useState<number>(0);

  const [spellInput, setSpellInput] = useState<string>('');

  const [spellFeedback, setSpellFeedback] = useState<'correct' | 'wrong' | null>(null);

  const [spellHintCount, setSpellHintCount] = useState<number>(0);

  const [spellShowAnswer, setSpellShowAnswer] = useState<boolean>(false);

  const [spellScore, setSpellScore] = useState<number>(0);

  const [spellFinished, setSpellFinished] = useState<boolean>(false);

  const spellInputRef = useRef<HTMLInputElement>(null);



  const currentSpellWord = practiceVocabList[spellIndex] || practiceVocabList[0];



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



      // TỰ ĐỘNG CHUYỂN SANG TỪ TIẾP THEO SAU 1.3 GIÂY

      if (autoNextSpellTimerRef.current) clearTimeout(autoNextSpellTimerRef.current);

      autoNextSpellTimerRef.current = setTimeout(() => {

        handleSpellNext();

      }, 1300);

    } else {

      setSpellFeedback('wrong');

      playWrongSound();

    }

  };



  const handleSpellNext = () => {

    if (autoNextSpellTimerRef.current) {

      clearTimeout(autoNextSpellTimerRef.current);

      autoNextSpellTimerRef.current = null;

    }

    if (spellIndex < practiceVocabList.length - 1) {

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

        const totalQ = practiceVocabList.length;

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



        studentGradebookService.recordPracticeMerit(currentStudent.id, `Luyện gõ từ vựng Unit ${selectedUnit} (${finalScore}/${totalQ})`, 10);

        studentGradebookService.recordVocabUnitCompleted(currentStudent.id, selectedUnit, selectedGrade);

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

    if (autoNextSpellTimerRef.current) {

      clearTimeout(autoNextSpellTimerRef.current);

      autoNextSpellTimerRef.current = null;

    }

    setPracticeSeed(s => s + 1);

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

      const acc = (currentMode as any) === 'minitest' ? 80 : 100;

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



      const vRes = studentGradebookService.recordVocabUnitCompleted(currentStudent.id, selectedUnit, selectedGrade);
      refreshStudentScore();

      if (onRewardMerit) onRewardMerit(`Học từ vựng Unit ${selectedUnit}`, vRes.awardedPoints);



      alert(

        `🎉 CHÚC MỪNG EM ${currentStudent.name}!\n` +

        `✅ Em đã hoàn thành xuất sắc bài học từ vựng Unit ${selectedUnit} (Tiếng Anh ${selectedGrade})!\n` +

        `⭐ Thưởng: +${vRes.awardedPoints} điểm thi đua ${vRes.isDoubleReward ? '(ĐÃ NHÂN ĐÔI KHUYẾN MẠI 🔥)' : ''} (Tổng hiện tại: ${vRes.totalMeritPoints}đ)!\n` +

        `📈 TIẾN ĐỘ HỌC TẬP TĂNG VỌT: Đạt ${vRes.progressPercent}% (${vRes.vocabUnitsCount} bài đã hoàn thành)!\n\n` +

        `${res.message}`

      );

    } else {

      alert('Em hãy nhập Tên và Lớp ở trên để được ghi nhận điểm chuyên cần nhé!');

    }

  };



  return (

    <div className="space-y-4 animate-in fade-in">

      {/* BANNER CHÍNH SÁCH KHUYẾN MẠI THI ĐUA & BẬT MÍ NGÀY MAI */}

      <div className="p-3.5 sm:p-4 rounded-3xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-indigo-500/15 border-2 border-amber-400/40 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">

        <div className="flex items-start gap-2.5">

          <span className="text-2xl shrink-0">🎁</span>

          <div>

            <div className="font-black text-sm text-amber-900 dark:text-amber-200 flex items-center gap-1.5 flex-wrap">

              <span>{loginReward.title}</span>

              {loginReward.vocabMultiplier > 1 && (

                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black animate-pulse">

                  🔥 NHÂN ĐÔI ĐIỂM

                </span>

              )}

            </div>

            <p className="text-slate-600 dark:text-slate-300 mt-0.5 font-medium">

              {loginReward.bannerText}

            </p>

            {loginReward.nextDayPromoPreview && (

              <p className="text-rose-600 dark:text-rose-400 font-black mt-1 flex items-center gap-1">

                <span>🔔</span>

                <span>{loginReward.nextDayPromoPreview}</span>

              </p>

            )}

          </div>

        </div>

        <div className="shrink-0 flex items-center gap-2 self-start md:self-auto">

          <span className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-xs">

            +{loginReward.vocabPointsPerUnit || 10}đ / Bài Học

          </span>

          <span className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-xs">

            1 Bài ➔ Tăng 35%

          </span>

        </div>

      </div>

      {/* THÔNG BÁO NHẮC NHỞ HỌC SINH MANG THẺ DỤNG CỤ: BÚT CHÌ & HÒN TẨY */}
      <div className="p-3.5 sm:p-4 rounded-3xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 border-2 border-amber-400/80 shadow-lg flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-900 dark:text-white backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl shrink-0 p-1.5 bg-amber-400 text-slate-950 rounded-2xl shadow-md">✏️</span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-amber-800 dark:text-amber-300 font-black uppercase tracking-wider text-xs">
                LỜI NHẮC CỦA THẦY ĐINH THÀNH:
              </span>
              <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wide">
                BẮT BUỘC KHI KIỂM TRA
              </span>
            </div>
            <p className="text-slate-800 dark:text-slate-100 font-extrabold leading-relaxed mt-0.5">
              Khi đi làm bài kiểm tra trắc nghiệm chính thức trên lớp, các em <strong className="text-rose-600 dark:text-rose-400 underline font-black">BẮT BUỘC MANG THẺ DỤNG CỤ</strong>: gồm <strong>ít nhất 2 bút chì (2B hoặc 3B gọt sẵn)</strong> và <strong>hòn tẩy (gôm mềm sạch)</strong> để làm bài kiểm tra trắc nghiệm!
            </p>
          </div>
        </div>
        <span className="hidden md:inline-flex px-3.5 py-1.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs shrink-0 shadow-md">
          🎒 Thẻ Dụng Cụ
        </span>
      </div>



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



        {/* NÚT HOÀN THÀNH BÀI (+10Đ/20Đ) & NÚT MỞ MINI-GAME */}

        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">

          <button

            type="button"

            onClick={handleRewardUnitCompletion}

            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5 cursor-pointer"

            title="Bấm để nhận điểm chuyên cần sau khi hoàn thành bài"

          >

            <Sparkles className="w-4 h-4 text-amber-200" />

            <span>🎉 Đã Thuộc Bài Này (+{loginReward.vocabPointsPerUnit || 10}đ)</span>

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



      {/* =========================================================================
          BẢNG TÍCH ĐIỂM SƯ PHẠM THỜI GIAN THỰC (BẢO VỆ QUYỀN LỢI HỌC SINH)
          Hiển thị đầy đủ, minh bạch 100% điểm thi đua, điểm từ vựng, điểm luyện tập
          ========================================================================= */}
      {(liveStudent || currentStudent) && (
        <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-indigo-500/10 dark:from-amber-950/30 dark:via-emerald-950/30 dark:to-indigo-950/30 p-4 sm:p-5 rounded-3xl border-2 border-amber-400/40 dark:border-amber-500/30 shadow-md space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Cột trái: Thông tin học sinh & Cam kết bảo toàn điểm */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg ring-2 ring-amber-300 shrink-0 animate-bounce">
                ⭐
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] uppercase font-black text-amber-600 dark:text-amber-400 tracking-wider">
                    Bảng Điểm Học Tập Của Em:
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {(liveStudent || currentStudent)?.name}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 text-xs font-black border border-indigo-400/30">
                    Lớp {(liveStudent || currentStudent)?.className}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[11px] font-black border border-emerald-400/30">
                    Trường THCS Đồng Yên
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 flex items-center gap-1.5 flex-wrap">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                    ✓ Bảo Toàn Tối Cao:
                  </span>
                  <span>Mọi điểm số khi em làm bài, học từ vựng đều được tự động cộng dồn và bảo toàn vĩnh viễn trên hệ thống.</span>
                </p>
              </div>
            </div>

            {/* Cột phải: 4 Thẻ điểm số chi tiết 3D Glassmorphism - Tương phản cực cao */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
              {/* Thẻ 1: Tổng điểm thi đua */}
              <div className="p-3 rounded-2xl bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-xl border-2 border-amber-400 shadow-md text-center">
                <span className="text-[10px] uppercase font-black text-amber-300 block tracking-wider">
                  Tổng Điểm Thi Đua
                </span>
                <div className="text-2xl sm:text-3xl font-black text-amber-400 flex items-center justify-center gap-1 my-0.5">
                  <span>{(liveStudent || currentStudent)?.totalMeritPoints || 0}</span>
                  <span className="text-xs font-bold text-amber-300">đ</span>
                </div>
                <span className="text-[10px] text-slate-200 block font-bold">Bảo toàn vĩnh viễn</span>
              </div>

              {/* Thẻ 2: Điểm từ vựng */}
              <div className="p-3 rounded-2xl bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-xl border border-emerald-400/80 shadow-md text-center">
                <span className="text-[10px] uppercase font-black text-emerald-300 block">
                  Điểm Từ Vựng
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 flex items-center justify-center gap-1 my-0.5">
                  <span>{(liveStudent || currentStudent)?.vocabPoints || 0}</span>
                  <span className="text-xs font-bold text-emerald-300">đ</span>
                </div>
                <span className="text-[10px] text-slate-200 block font-bold">Flashcard &amp; Bài tập</span>
              </div>

              {/* Thẻ 3: Điểm luyện tập & Chuyên cần */}
              <div className="p-3 rounded-2xl bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-xl border border-blue-400/80 shadow-md text-center">
                <span className="text-[10px] uppercase font-black text-cyan-300 block">
                  Luyện Tập &amp; Chuyên Cần
                </span>
                <div className="text-2xl sm:text-3xl font-black text-cyan-400 flex items-center justify-center gap-1 my-0.5">
                  <span>{((liveStudent || currentStudent)?.practicePoints || 0) + ((liveStudent || currentStudent)?.attendancePoints || 0)}</span>
                  <span className="text-xs font-bold text-cyan-300">đ</span>
                </div>
                <span className="text-[10px] text-slate-200 block font-bold">Đăng nhập &amp; Trắc nghiệm</span>
              </div>

              {/* Thẻ 4: Thứ hạng thi đua toàn trường */}
              <div className="p-3 rounded-2xl bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-xl border border-purple-400/80 shadow-md text-center">
                <span className="text-[10px] uppercase font-black text-purple-300 block">
                  Hạng Toàn Trường
                </span>
                <div className="text-2xl sm:text-3xl font-black text-purple-300 flex items-center justify-center gap-0.5 my-0.5">
                  <span className="text-sm font-bold text-purple-400">Top</span>
                  <span>{studentRank}</span>
                </div>
                <span className="text-[10px] text-slate-200 block font-bold">Bảng Vàng Thi Đua</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 2. THANH CHỌN BÀI (UNIT) 3D TRONG SUỐT GLASSMORPHISM & TỐI ƯU DI ĐỘNG ==================== */}
      <div className="bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-2xl p-3.5 sm:p-4 rounded-3xl border border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] space-y-3">
        {/* Hàng trên: Chọn Unit & Công cụ âm thanh */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          
          {/* TIÊU ĐỀ THANH BÀI HỌC VỚI CHỮ TƯƠNG PHẢN CAO */}
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center font-bold text-base shadow-xs">
              📖
            </span>
            <div>
              <span className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider block">
                Chọn Bài Học (Unit 1 - 12):
              </span>
              <span className="text-[11px] text-slate-200 font-bold block sm:hidden">
                Đang học: Unit {selectedUnit} ({filteredVocab.length} từ)
              </span>
            </div>
          </div>

          {/* GIAO DIỆN DI ĐỘNG: BỘ CHỌN NHANH UNIT CHO ĐIỆN THOẠI (SELECT DROPDOWN + CHIPS TRỌNG TÂM GK1) */}
          <div className="sm:hidden w-full space-y-2 pt-1">
            <div className="relative">
              <select
                value={selectedUnit}
                onChange={(e) => {
                  const uNum = Number(e.target.value);
                  setSelectedUnit(uNum);
                  setCardIndex(0);
                  setIsFlipped(false);
                  handleRestartQuiz();
                  handleRestartListen();
                  handleSpellRestart();
                }}
                className="w-full py-2.5 px-3 rounded-2xl bg-slate-950 text-amber-300 font-black text-xs border-2 border-amber-400/70 shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
              >
                {(availableUnits.length > 0 ? availableUnits : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => ({ unitNumber: n, title: `Unit ${n}`, wordCount: 20 }))).map(u => (
                  <option key={u.unitNumber} value={u.unitNumber} className="bg-slate-900 text-white font-bold">
                    Unit {u.unitNumber}: {u.title} ({u.wordCount} từ){[1, 2, 3].includes(u.unitNumber) ? ' ★ TRỌNG TÂM GK1' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* 3 Nút Bấm Chạm Nhanh GK1 Dành Cho Học Sinh Dùng Điện Thoại */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[10px] text-amber-300 font-black uppercase tracking-wider shrink-0">GK1:</span>
              {[1, 2, 3].map(n => {
                const isAct = selectedUnit === n;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => {
                      setSelectedUnit(n);
                      setCardIndex(0);
                      setIsFlipped(false);
                      handleRestartQuiz();
                      handleRestartListen();
                      handleSpellRestart();
                    }}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 ${
                      isAct
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md border border-amber-200'
                        : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <span>Unit {n}</span>
                    <span className="text-[9px] px-1 rounded-sm bg-rose-600 text-white font-bold">GK1</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* GIAO DIỆN MÁY TÍNH & MÀN LỚN: THANH CUỘN TAB 3D TRONG SUỐT */}
          <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto pb-1 text-xs max-w-full lg:max-w-3xl">
            {(availableUnits.length > 0 ? availableUnits : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => ({ unitNumber: n, title: `Unit ${n}`, wordCount: 20 }))).map(u => {
              const uMission = missionState?.mission1.units[u.unitNumber];
              const isGK1Target = [1, 2, 3].includes(u.unitNumber);
              const isAct = selectedUnit === u.unitNumber;

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
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 duration-200 ${
                    isAct
                      ? 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black shadow-[0_4px_16px_rgba(245,158,11,0.6),inset_0_1px_0_rgba(255,255,255,0.8)] border border-amber-200 -translate-y-0.5 scale-105'
                      : 'bg-white/10 hover:bg-white/20 text-white font-extrabold border border-white/15 backdrop-blur-md hover:text-amber-300 shadow-sm'
                  }`}
                  title={`${u.title} (${u.wordCount} từ)`}
                >
                  <span>Unit {u.unitNumber}</span>
                  {isGK1Target && (
                    <span className="text-[9px] px-1 rounded-sm font-black bg-rose-600 text-white shadow-xs">
                      GK1
                    </span>
                  )}
                  {uMission !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-black ${
                      uMission.unitPercent >= 100
                        ? 'bg-emerald-500 text-slate-950'
                        : (uMission.unitPercent > 0 ? 'bg-blue-600 text-white' : 'bg-white/20 text-white')
                    }`}>
                      {uMission.unitPercent}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* CỘT CÔNG CỤ ÂM THANH & IPA 3D TRONG SUỐT */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            {!currentStudent && (
              <button
                type="button"
                onClick={() => setAllowGradeSwitch(!allowGradeSwitch)}
                className="text-xs font-bold text-cyan-300 hover:text-white underline cursor-pointer"
              >
                {allowGradeSwitch ? '✕ Đóng chọn khối' : '🔄 Xem khối khác'}
              </button>
            )}

            {onOpenIpaModal && (
              <button
                type="button"
                onClick={onOpenIpaModal}
                className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-400/40 text-xs font-black transition flex items-center gap-1 cursor-pointer shadow-xs"
                title="Bảng Phiên Âm Quốc Tế IPA"
              >
                <span>🔤 IPA</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleToggleAccent(voiceAccent === 'US' ? 'UK' : 'US')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 cursor-pointer border border-white/20 shadow-xs"
              title="Đổi giọng phát âm Anh - Mỹ hoặc Anh - Anh"
            >
              <span>{voiceAccent === 'US' ? '🇺🇸 Giọng Mỹ' : '🇬🇧 Giọng Anh'}</span>
            </button>
          </div>
        </div>

        {/* Banner tiến độ nhiệm vụ GK1 cho Unit 1 - 3 */}
        {[1, 2, 3].includes(selectedUnit) && (
          <div className="p-3 rounded-2xl bg-blue-950/70 border border-cyan-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-600 text-white font-black text-xs shrink-0 shadow-xs">🎯 Nhiệm Vụ GK1</span>
              <div>
                <span className="font-extrabold text-white">
                  Unit {selectedUnit}: Đã đạt {missionState?.mission1.units[selectedUnit]?.qualityPassedCount || 0}/{missionState?.mission1.units[selectedUnit]?.totalRequiredModes || 8} dạng bài ({missionState?.mission1.units[selectedUnit]?.unitPercent || 0}% hoàn thành).
                </span>
                <span className="text-cyan-200 block text-[11px] font-medium mt-0.5">
                  🛡️ Tiêu chuẩn chất lượng: Đạt độ chính xác từ 60% trở lên để được tính hoàn thành bài học.
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-cyan-400/20 text-cyan-200 border border-cyan-400/40 font-black shrink-0 self-start sm:self-auto text-[11px]">
              {missionState?.mission1.units[selectedUnit]?.statusNote}
            </span>
          </div>
        )}

        {/* Khung chuyển khối lớp mở rộng khi cần */}
        {!currentStudent && allowGradeSwitch && (
          <div className="p-2.5 rounded-2xl bg-white/10 border border-white/20 flex items-center gap-2 flex-wrap text-xs animate-in fade-in">
            <span className="font-black text-amber-300">Khối lớp:</span>
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
                className={`px-3 py-1 rounded-xl font-black transition cursor-pointer ${
                  selectedGrade === g
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md border border-blue-300'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
                }`}
              >
                Lớp {g}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ==================== 3. THANH CHỌN 8 DẠNG BÀI TẬP TỪ VỰNG 3D TRONG SUỐT GLASSMORPHISM ==================== */}
      <div className="bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-2xl p-3.5 sm:p-4 rounded-3xl border border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] space-y-3">
        <div className="flex items-center justify-between gap-2 text-xs font-bold text-white flex-wrap">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span className="text-amber-300 font-black uppercase tracking-wider text-xs">
              Các Dạng Luyện Từ Vựng 3D Trong Suốt (Chữ Tương Phản Rõ Nét):
            </span>
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-400/30 font-bold text-[11px]">
            Khối {selectedGrade} • Unit {selectedUnit} ({filteredVocab.length} từ)
          </span>
        </div>

        {/* LƯỚI 8 NÚT TAB 3D TRONG SUỐT - TƯƠNG PHẢN CAO - PHÙ HỢP HOÀN HẢO VỚI ĐIỆN THOẠI */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-1 text-xs">
          
          {/* 1. Flashcard */}
          <button
            type="button"
            onClick={() => setCurrentMode('flashcard')}
            className={`px-2 py-2.5 rounded-2xl font-black transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer select-none text-center active:scale-95 ${
              currentMode === 'flashcard'
                ? 'bg-gradient-to-b from-blue-500 via-indigo-600 to-blue-700 text-white shadow-[0_6px_20px_rgba(37,99,235,0.65),inset_0_1px_0_rgba(255,255,255,0.8)] border border-blue-200 -translate-y-1 scale-[1.03]'
                : 'bg-white/10 hover:bg-white/20 text-white font-black border border-white/20 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] hover:border-cyan-300 hover:text-cyan-200 hover:-translate-y-0.5'
            }`}
          >
            <span>🃏 1. Thẻ Nhớ</span>
            {missionState?.mission1.units[selectedUnit]?.modes['flashcard']?.qualityPassed && <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-1 rounded-sm shadow-xs">✓</span>}
          </button>

          {/* 2. Ghép Cặp */}
          <button
            type="button"
            onClick={() => setCurrentMode('match')}
            className={`px-2 py-2.5 rounded-2xl font-black transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer select-none text-center active:scale-95 ${
              currentMode === 'match'
                ? 'bg-gradient-to-b from-indigo-500 via-purple-600 to-indigo-700 text-white shadow-[0_6px_20px_rgba(99,102,241,0.65),inset_0_1px_0_rgba(255,255,255,0.8)] border border-indigo-200 -translate-y-1 scale-[1.03]'
                : 'bg-white/10 hover:bg-white/20 text-white font-black border border-white/20 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] hover:border-cyan-300 hover:text-cyan-200 hover:-translate-y-0.5'
            }`}
          >
            <span>🧩 2. Ghép Cặp</span>
            {missionState?.mission1.units[selectedUnit]?.modes['match']?.qualityPassed && <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-1 rounded-sm shadow-xs">✓</span>}
          </button>

          {/* 3. Trắc Nghiệm */}
          <button
            type="button"
            onClick={() => setCurrentMode('quiz')}
            className={`px-2 py-2.5 rounded-2xl font-black transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer select-none text-center active:scale-95 ${
              currentMode === 'quiz'
                ? 'bg-gradient-to-b from-emerald-500 via-teal-600 to-emerald-700 text-white shadow-[0_6px_20px_rgba(16,185,129,0.65),inset_0_1px_0_rgba(255,255,255,0.8)] border border-emerald-200 -translate-y-1 scale-[1.03]'
                : 'bg-white/10 hover:bg-white/20 text-white font-black border border-white/20 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] hover:border-cyan-300 hover:text-cyan-200 hover:-translate-y-0.5'
            }`}
          >
            <span>🎯 3. Trắc Nghiệm</span>
            {missionState?.mission1.units[selectedUnit]?.modes['quiz']?.qualityPassed && <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-1 rounded-sm shadow-xs">✓</span>}
          </button>

          {/* 4. Luyện Nghe */}
          <button
            type="button"
            onClick={() => setCurrentMode('listen')}
            className={`px-2 py-2.5 rounded-2xl font-black transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer select-none text-center active:scale-95 ${
              currentMode === 'listen'
                ? 'bg-gradient-to-b from-purple-500 via-fuchsia-600 to-purple-700 text-white shadow-[0_6px_20px_rgba(168,85,247,0.65),inset_0_1px_0_rgba(255,255,255,0.8)] border border-purple-200 -translate-y-1 scale-[1.03]'
                : 'bg-white/10 hover:bg-white/20 text-white font-black border border-white/20 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] hover:border-cyan-300 hover:text-cyan-200 hover:-translate-y-0.5'
            }`}
          >
            <span>🎧 4. Luyện Nghe</span>
            {missionState?.mission1.units[selectedUnit]?.modes['listen']?.qualityPassed && <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-1 rounded-sm shadow-xs">✓</span>}
          </button>

          {/* 5. Luyện Gõ */}
          <button
            type="button"
            onClick={() => setCurrentMode('spelling')}
            className={`px-2 py-2.5 rounded-2xl font-black transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer select-none text-center active:scale-95 ${
              currentMode === 'spelling'
                ? 'bg-gradient-to-b from-sky-500 via-blue-600 to-sky-700 text-white shadow-[0_6px_20px_rgba(14,165,233,0.65),inset_0_1px_0_rgba(255,255,255,0.8)] border border-sky-200 -translate-y-1 scale-[1.03]'
                : 'bg-white/10 hover:bg-white/20 text-white font-black border border-white/20 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] hover:border-cyan-300 hover:text-cyan-200 hover:-translate-y-0.5'
            }`}
          >
            <span>✍️ 5. Luyện Gõ</span>
            {missionState?.mission1.units[selectedUnit]?.modes['spelling']?.qualityPassed && <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-1 rounded-sm shadow-xs">✓</span>}
          </button>

          {/* 6. Bài Chant */}
          <button
            type="button"
            onClick={() => setCurrentMode('chant')}
            className={`px-2 py-2.5 rounded-2xl font-black transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer select-none text-center active:scale-95 ${
              currentMode === 'chant'
                ? 'bg-gradient-to-b from-pink-500 via-rose-600 to-pink-700 text-white shadow-[0_6px_20px_rgba(244,63,94,0.65),inset_0_1px_0_rgba(255,255,255,0.8)] border border-pink-200 -translate-y-1 scale-[1.03]'
                : 'bg-white/10 hover:bg-white/20 text-white font-black border border-white/20 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] hover:border-cyan-300 hover:text-cyan-200 hover:-translate-y-0.5'
            }`}
            title="Bài Chant Nhạc Beat Điệu Call & Response"
          >
            <span>🎵 6. Bài Chant</span>
            {missionState?.mission1.units[selectedUnit]?.modes['chant']?.qualityPassed && <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-1 rounded-sm shadow-xs">✓</span>}
          </button>

          {/* 7. Xếp Chữ */}
          <button
            type="button"
            onClick={() => setCurrentMode('scramble')}
            className={`px-2 py-2.5 rounded-2xl font-black transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer select-none text-center active:scale-95 ${
              currentMode === 'scramble'
                ? 'bg-gradient-to-b from-violet-600 via-indigo-700 to-violet-800 text-white shadow-[0_6px_20px_rgba(124,58,237,0.65),inset_0_1px_0_rgba(255,255,255,0.8)] border border-violet-200 -translate-y-1 scale-[1.03]'
                : 'bg-white/10 hover:bg-white/20 text-white font-black border border-white/20 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] hover:border-cyan-300 hover:text-cyan-200 hover:-translate-y-0.5'
            }`}
          >
            <span>🔤 7. Xếp Chữ</span>
            {missionState?.mission1.units[selectedUnit]?.modes['scramble']?.qualityPassed && <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-1 rounded-sm shadow-xs">✓</span>}
          </button>

          {/* 8. Phản Xạ */}
          <button
            type="button"
            onClick={() => setCurrentMode('blitz')}
            className={`px-2 py-2.5 rounded-2xl font-black transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer select-none text-center active:scale-95 ${
              currentMode === 'blitz'
                ? 'bg-gradient-to-b from-amber-400 via-orange-500 to-amber-600 text-slate-950 shadow-[0_6px_20px_rgba(245,158,11,0.65),inset_0_1px_0_rgba(255,255,255,0.8)] border border-amber-200 -translate-y-1 scale-[1.03]'
                : 'bg-white/10 hover:bg-white/20 text-white font-black border border-white/20 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] hover:border-cyan-300 hover:text-cyan-200 hover:-translate-y-0.5'
            }`}
          >
            <span>⚡ 8. Phản Xạ</span>
            {missionState?.mission1.units[selectedUnit]?.modes['blitz']?.qualityPassed && <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-1 rounded-sm shadow-xs">✓</span>}
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

                  <p className="text-xs sm:text-sm font-bold text-amber-300 pt-2 flex items-center justify-center gap-1.5">

                    💡 Chạm vào thẻ bất kỳ đâu để lật xem nghĩa & ví dụ

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

                        <p className="text-xs sm:text-sm font-bold text-amber-200">

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

                    checkAndAwardFlashcardProgress(cardIndex);

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

                    const nextIdx = cardIndex < filteredVocab.length - 1 ? cardIndex + 1 : 0;

                    setCardIndex(nextIdx);

                    setIsFlipped(false);

                    checkAndAwardFlashcardProgress(nextIdx);

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

                      <span className="text-[11px] font-mono text-slate-700 dark:text-slate-300 font-bold">{idx + 1}.</span>

                      <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">

                        {item.word}

                      </span>

                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">

                        {item.type || 'v'}

                      </span>

                    </div>

                    <p className="text-xs text-slate-800 dark:text-slate-100 font-semibold line-clamp-1 mt-0.5">

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



      {/* ==================== DẠNG 3: TRẮC NGHIỆM (QUIZ) - 20 CÂU TỰ CHUYỂN, GỌN GÀNG KHÔNG TRƯỢT CUỘN ==================== */}

      <style>{`

        @keyframes autoAdvanceTimerQuiz {

          from { width: 0%; }

          to { width: 100%; }

        }

        @keyframes autoAdvanceTimerListen {

          from { width: 0%; }

          to { width: 100%; }

        }

      `}</style>



      {currentMode === 'quiz' && (

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-3.5 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl max-w-2xl mx-auto space-y-3 sm:space-y-3.5">

          {!quizFinished ? (

            <div className="space-y-3 sm:space-y-3.5">

              {/* THANH TIẾN TRÌNH MINI TÍCH HỢP ĐIỂM SỐ GỌN 1 HÀNG */}

              <div className="flex items-center justify-between text-xs font-black gap-2">

                <span className="px-2.5 py-1 rounded-xl bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 shrink-0">

                  🎯 Câu {quizIndex + 1} / {practiceVocabList.length}

                </span>



                {/* Thanh progress bar mỏng 6px bo tròn */}

                <div className="flex-1 mx-2 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">

                  <div

                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-300"

                    style={{ width: `${Math.min(100, Math.max(5, ((quizIndex + 1) / practiceVocabList.length) * 100))}%` }}

                  />

                </div>



                <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 shrink-0 flex items-center gap-1">

                  <span>⭐ Đúng:</span>

                  <span className="text-emerald-600 dark:text-emerald-400 font-black">{quizScore}/{quizIndex + (quizSelectedOption ? 1 : 0)}</span>

                </span>

              </div>



              {/* KHUNG CÂU HỎI TỪ VỰNG - RÕ NÉT & GỌN GÀNG KHÔNG TỐN CHIỀU CAO */}

              {currentQuizWord && (

                <div className="text-center py-2.5 px-3.5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-sky-500/15 border border-indigo-200/70 dark:border-indigo-800/60 shadow-xs relative">

                  <div className="inline-flex items-center justify-center gap-2 flex-wrap">

                    <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">

                      {currentQuizWord.word}

                    </span>

                    <button

                      type="button"

                      onClick={() => speakWord(currentQuizWord.word)}

                      className="p-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition hover:scale-105 active:scale-95 cursor-pointer"

                      title="Nghe phát âm chuẩn"

                    >

                      <Volume2 className="w-4 h-4" />

                    </button>

                  </div>

                  <div className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 mt-0.5">

                    /{currentQuizWord.phonetic}/ • <span className="italic font-sans text-slate-500">{currentQuizWord.type || 'v'}</span>

                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">

                    Chọn nghĩa tiếng Việt chính xác nhất:

                  </p>

                </div>

              )}



              {/* LƯỚI 4 ĐÁP ÁN TRẮC NGHIỆM: 2 CỘT x 2 HÀNG KHÔNG TRƯỢT CUỘN */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">

                {quizOptions.map((opt, i) => {

                  const isSelected = quizSelectedOption === opt;

                  const isCorrect = opt === currentQuizWord?.meaning;



                  let optClasses = '';



                  if (quizSelectedOption !== null) {

                    if (isCorrect) {

                      optClasses = `

                        bg-gradient-to-r from-emerald-500 to-teal-600 text-white

                        border-2 border-emerald-300

                        shadow-[0_4px_12px_rgba(16,185,129,0.45)]

                        font-black scale-[1.01]

                      `;

                    } else if (isSelected) {

                      optClasses = `

                        bg-gradient-to-r from-rose-500 to-red-600 text-white

                        border-2 border-rose-300

                        shadow-[0_4px_12px_rgba(244,63,94,0.45)]

                        font-black animate-shake

                      `;

                    } else {

                      optClasses = `

                        opacity-35 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700

                        text-slate-400 dark:text-slate-500 shadow-none scale-98

                      `;

                    }

                  } else {

                    optClasses = `

                      bg-white dark:bg-slate-800

                      border-2 border-slate-200 dark:border-slate-700

                      hover:border-blue-500 dark:hover:border-blue-400

                      text-slate-800 dark:text-slate-100

                      shadow-xs hover:shadow-md

                      hover:-translate-y-0.5 active:translate-y-0.5

                    `;

                  }



                  return (

                    <button

                      key={i}

                      type="button"

                      disabled={quizSelectedOption !== null}

                      onClick={(e) => handleQuizAnswer(opt, e)}

                      className={`p-2.5 sm:p-3 rounded-xl flex items-center justify-between text-left text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer select-none min-h-[46px] sm:min-h-[50px] ${optClasses}`}

                    >

                      <div className="flex items-center gap-2 min-w-0 pr-1">

                        <span className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300 font-black text-xs flex items-center justify-center shrink-0 border border-blue-500/20">

                          {String.fromCharCode(65 + i)}

                        </span>

                        <span className="leading-snug line-clamp-2">{opt}</span>

                      </div>

                      {quizSelectedOption !== null && isCorrect && (

                        <CheckCircle2 className="w-4 h-4 text-white shrink-0 drop-shadow-sm ml-1" />

                      )}

                      {quizSelectedOption !== null && isSelected && !isCorrect && (

                        <XCircle className="w-4 h-4 text-white shrink-0 drop-shadow-sm ml-1" />

                      )}

                    </button>

                  );

                })}

              </div>



              {/* THANH CÔNG BỐ KẾT QUẢ TỨC THÌ & TỰ ĐỘNG CHUYỂN SANG CÂU TIẾP THEO */}

              {quizSelectedOption !== null && (

                <div className="relative overflow-hidden rounded-xl shadow-md animate-in fade-in">

                  <div className={`p-2.5 px-3.5 flex items-center justify-between gap-2 text-xs font-bold text-white ${

                    quizSelectedOption === currentQuizWord?.meaning

                      ? 'bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600'

                      : 'bg-gradient-to-r from-rose-500 via-red-600 to-rose-600'

                  }`}>

                    <div className="flex items-center gap-2 min-w-0">

                      {quizSelectedOption === currentQuizWord?.meaning ? (

                        <>

                          <CheckCircle2 className="w-4 h-4 text-white shrink-0" />

                          <span className="font-black text-xs sm:text-sm">🎉 CHÍNH XÁC! (+10đ ⭐)</span>

                        </>

                      ) : (

                        <>

                          <XCircle className="w-4 h-4 text-white shrink-0" />

                          <span className="truncate text-xs sm:text-sm">

                            Chưa đúng! Đáp án: <strong className="underline underline-offset-2">{currentQuizWord?.meaning}</strong>

                          </span>

                        </>

                      )}

                    </div>



                    <button

                      type="button"

                      onClick={handleNextQuiz}

                      className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-black shrink-0 flex items-center gap-1 transition cursor-pointer"

                      title="Bấm để chuyển ngay không cần chờ"

                    >

                      <span>{quizIndex < practiceVocabList.length - 1 ? 'Tiếp' : 'Xem Kết Quả'}</span>

                      <ArrowRight className="w-3 h-3" />

                    </button>

                  </div>



                  {/* Thanh đếm ngược tự động chuyển 1.3s */}

                  <div className="h-1.5 w-full bg-black/25">

                    <div

                      className="h-full bg-white/90"

                      style={{ animation: 'autoAdvanceTimerQuiz 1.3s linear forwards' }}

                    />

                  </div>

                </div>

              )}

            </div>

          ) : (

            <div className="text-center py-6 space-y-4">

              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-3xl font-black shadow-inner">

                🏆

              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">

                Hoàn Thành 20 Câu Trắc Nghiệm Unit {selectedUnit}!

              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-300">

                Em đã trả lời đúng <strong className="text-emerald-600">{quizScore} / {practiceVocabList.length} câu</strong> ({Math.round((quizScore / practiceVocabList.length) * 100)}%).

              </p>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border border-amber-200 text-xs font-bold inline-block">

                ⭐ Em được cộng +10 điểm chuyên cần vào tổng điểm thi đua!

              </div>

              <div className="pt-2 flex justify-center gap-3">

                <button

                  type="button"

                  onClick={handleRestartQuiz}

                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"

                >

                  <RotateCw className="w-3.5 h-3.5" />

                  <span>Luyện 20 Câu Mới</span>

                </button>

                <button

                  type="button"

                  onClick={() => setCurrentMode('listen')}

                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"

                >

                  <span>Chuyển Sang Luyện Nghe</span>

                  <ArrowRight className="w-3.5 h-3.5" />

                </button>

              </div>

            </div>

          )}

        </div>

      )}



      {/* ==================== DẠNG 4: LUYỆN NGHE (LISTEN) - 20 CÂU TỰ CHUYỂN, GỌN GÀNG KHÔNG TRƯỢT CUỘN ==================== */}

      {currentMode === 'listen' && (

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-3.5 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl max-w-2xl mx-auto space-y-3 sm:space-y-3.5">

          {!listenFinished ? (

            <div className="space-y-3 sm:space-y-3.5">

              {/* THANH TIẾN TRÌNH MINI TÍCH HỢP ĐIỂM SỐ GỌN 1 HÀNG */}

              <div className="flex items-center justify-between text-xs font-black gap-2">

                <span className="px-2.5 py-1 rounded-xl bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 shrink-0">

                  🎧 Câu nghe {listenIndex + 1} / {practiceVocabList.length}

                </span>



                {/* Thanh progress bar mỏng 6px */}

                <div className="flex-1 mx-2 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">

                  <div

                    className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-sky-500 rounded-full transition-all duration-300"

                    style={{ width: `${Math.min(100, Math.max(5, ((listenIndex + 1) / practiceVocabList.length) * 100))}%` }}

                  />

                </div>



                <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 shrink-0 flex items-center gap-1">

                  <span>⭐ Đúng:</span>

                  <span className="text-emerald-600 dark:text-emerald-400 font-black">{listenScore}/{listenIndex + (listenSelectedOption ? 1 : 0)}</span>

                </span>

              </div>



              {/* KHUNG PHÁT ÂM TỪ VỰNG - SIÊU GỌN VỚI TAI NGHE & 2 NÚT PHÁT ÂM */}

              {currentListenWord && (

                <div className="text-center py-2.5 px-3 rounded-2xl bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-sky-500/15 border border-purple-200/70 dark:border-purple-800/60 shadow-xs space-y-2">

                  <div className="flex items-center justify-center gap-2.5 flex-wrap">

                    <button

                      type="button"

                      onClick={() => speakWord(currentListenWord.word)}

                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"

                    >

                      <Volume2 className="w-4 h-4" />

                      <span>Bấm Để Nghe Lại</span>

                    </button>

                    <button

                      type="button"

                      onClick={() => speakWord(currentListenWord.word, 0.65)}

                      className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-900 dark:text-amber-200 font-bold text-xs transition flex items-center gap-1 cursor-pointer"

                    >

                      <span>🐢 Nghe Chậm</span>

                    </button>

                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">

                    Lắng nghe kỹ và chọn từ tiếng Anh tương ứng:

                  </p>

                </div>

              )}



              {/* LƯỚI 4 NÚT CHỌN TỪ TIẾNG ANH: 2 CỘT CÂN ĐỐI KHÔNG TRƯỢT CUỘN */}

              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">

                {listenOptions.map((optWord, i) => {

                  const isSelected = listenSelectedOption === optWord;

                  const isCorrect = optWord === currentListenWord?.word;



                  let optClasses = '';



                  if (listenSelectedOption !== null) {

                    if (isCorrect) {

                      optClasses = `

                        bg-gradient-to-r from-emerald-500 to-teal-600 text-white

                        border-2 border-emerald-300

                        shadow-[0_4px_12px_rgba(16,185,129,0.45)]

                        scale-[1.01] font-black

                      `;

                    } else if (isSelected) {

                      optClasses = `

                        bg-gradient-to-r from-rose-500 to-red-600 text-white

                        border-2 border-rose-300

                        shadow-[0_4px_12px_rgba(244,63,94,0.45)]

                        animate-shake font-black

                      `;

                    } else {

                      optClasses = `

                        opacity-35 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700

                        text-slate-400 dark:text-slate-500 shadow-none scale-98

                      `;

                    }

                  } else {

                    optClasses = `

                      bg-white dark:bg-slate-800

                      border-2 border-slate-200 dark:border-slate-700

                      hover:border-purple-500 dark:hover:border-purple-400

                      text-slate-800 dark:text-slate-100

                      shadow-xs hover:shadow-md

                      hover:-translate-y-0.5 active:translate-y-0.5

                    `;

                  }



                  return (

                    <button

                      key={i}

                      type="button"

                      disabled={listenSelectedOption !== null}

                      onClick={(e) => handleListenAnswer(optWord, e)}

                      className={`p-3 sm:p-4 rounded-xl flex items-center justify-center text-center text-sm sm:text-base font-black tracking-wide transition-all duration-150 cursor-pointer select-none min-h-[48px] sm:min-h-[52px] ${optClasses}`}

                    >

                      <span>{optWord}</span>

                    </button>

                  );

                })}

              </div>



              {/* THANH CÔNG BỐ KẾT QUẢ TỨC THÌ & TỰ ĐỘNG CHUYỂN SANG CÂU TIẾP THEO */}

              {listenSelectedOption !== null && (

                <div className="relative overflow-hidden rounded-xl shadow-md animate-in fade-in">

                  <div className={`p-2.5 px-3.5 flex items-center justify-between gap-2 text-xs font-bold text-white ${

                    listenSelectedOption === currentListenWord?.word

                      ? 'bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600'

                      : 'bg-gradient-to-r from-rose-500 via-red-600 to-rose-600'

                  }`}>

                    <div className="flex items-center gap-2 min-w-0">

                      {listenSelectedOption === currentListenWord?.word ? (

                        <>

                          <CheckCircle2 className="w-4 h-4 text-white shrink-0" />

                          <span className="font-black text-xs sm:text-sm truncate">

                            🎉 ĐÚNG! "{currentListenWord?.word}": {currentListenWord?.meaning}

                          </span>

                        </>

                      ) : (

                        <>

                          <XCircle className="w-4 h-4 text-white shrink-0" />

                          <span className="truncate text-xs sm:text-sm">

                            Chưa đúng! Từ đúng: <strong className="underline underline-offset-2">{currentListenWord?.word}</strong> ({currentListenWord?.meaning})

                          </span>

                        </>

                      )}

                    </div>



                    <button

                      type="button"

                      onClick={handleNextListen}

                      className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[11px] font-black shrink-0 flex items-center gap-1 transition cursor-pointer"

                      title="Bấm để chuyển ngay không cần chờ"

                    >

                      <span>{listenIndex < practiceVocabList.length - 1 ? 'Tiếp' : 'Xem Kết Quả'}</span>

                      <ArrowRight className="w-3 h-3" />

                    </button>

                  </div>



                  {/* Thanh đếm ngược tự động chuyển 1.4s */}

                  <div className="h-1.5 w-full bg-black/25">

                    <div

                      className="h-full bg-white/90"

                      style={{ animation: 'autoAdvanceTimerListen 1.4s linear forwards' }}

                    />

                  </div>

                </div>

              )}

            </div>

          ) : (

            <div className="text-center py-6 space-y-4">

              <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto text-3xl font-black">

                🎧

              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">

                Hoàn Thành 20 Câu Luyện Nghe Unit {selectedUnit}!

              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-300">

                Em đã nghe đúng <strong className="text-purple-600">{listenScore} / {practiceVocabList.length} từ</strong> ({Math.round((listenScore / practiceVocabList.length) * 100)}%).

              </p>

              <div className="p-3 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold inline-block">

                ⭐ Em được cộng +10 điểm chuyên cần vào tổng điểm thi đua!

              </div>

              <div className="pt-2 flex justify-center gap-3">

                <button

                  type="button"

                  onClick={handleRestartListen}

                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"

                >

                  <RotateCw className="w-3.5 h-3.5" />

                  <span>Luyện 20 Câu Mới</span>

                </button>

                <button

                  type="button"

                  onClick={() => setCurrentMode('spelling')}

                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"

                >

                  <span>Chuyển Sang Luyện Gõ</span>

                  <ArrowRight className="w-3.5 h-3.5" />

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

      {/* ==================== DẠNG 5: LUYỆN GÕ CHÍNH TẢ (SPELLING) - 20 TỪ, TỰ CHUYỂN KHI ĐÚNG ==================== */}

      <style>{`

        @keyframes autoAdvanceTimerSpell {

          from { width: 0%; }

          to { width: 100%; }

        }

      `}</style>



      {currentMode === 'spelling' && (

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-3.5 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl max-w-2xl mx-auto space-y-3 sm:space-y-3.5">

          {!spellFinished ? (

            <div className="space-y-3 sm:space-y-3.5">

              {/* THANH TIẾN TRÌNH MINI TÍCH HỢP ĐIỂM SỐ GỌN 1 HÀNG */}

              <div className="flex items-center justify-between text-xs font-black gap-2">

                <span className="px-2.5 py-1 rounded-xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 shrink-0">

                  ✍️ Luyện gõ {spellIndex + 1} / {practiceVocabList.length}

                </span>



                {/* Thanh progress bar mỏng 6px */}

                <div className="flex-1 mx-2 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">

                  <div

                    className="h-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 rounded-full transition-all duration-300"

                    style={{ width: `${Math.min(100, Math.max(5, ((spellIndex + 1) / practiceVocabList.length) * 100))}%` }}

                  />

                </div>



                <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 shrink-0 flex items-center gap-1">

                  <span>⭐ Đúng:</span>

                  <span className="text-emerald-600 dark:text-emerald-400 font-black">{spellScore}/{spellIndex + (spellFeedback === 'correct' ? 1 : 0)}</span>

                </span>

              </div>



              {/* KHUNG NGHĨA TỪ CẦN GÕ - GỌN GÀNG RÕ NÉT */}

              {currentSpellWord && (

                <div className="text-center py-2.5 px-3.5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-sky-500/15 border border-indigo-200/70 dark:border-indigo-800/60 shadow-xs space-y-1">

                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">

                    Nghĩa Tiếng Việt:

                  </span>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">

                    {currentSpellWord.meaning}

                  </h3>

                  <div className="flex items-center justify-center gap-2 text-xs font-mono text-sky-600 dark:text-sky-400">

                    <span>/{currentSpellWord.phonetic}/</span>

                    <button

                      type="button"

                      onClick={() => speakWord(currentSpellWord.word)}

                      className="p-1 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition cursor-pointer"

                      title="Nghe phát âm"

                    >

                      <Volume2 className="w-3.5 h-3.5" />

                    </button>

                    <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">

                      {currentSpellWord.type || 'v'}

                    </span>

                  </div>

                </div>

              )}



              {/* Ô GÕ TỪ */}

              <form onSubmit={handleSpellCheck} className="space-y-2.5">

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

                    className={`w-full px-4 py-3 rounded-2xl border-2 text-center text-base sm:text-lg font-black tracking-wide transition focus:outline-hidden ${

                      spellFeedback === 'correct'

                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 ring-2 ring-emerald-300'

                        : spellFeedback === 'wrong'

                        ? 'border-rose-500 bg-rose-50/50 text-rose-900 ring-2 ring-rose-300'

                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-600'

                    }`}

                  />

                </div>



                {/* THÔNG BÁO ĐÚNG & ĐẾM NGƯỢC TỰ CHUYỂN */}

                {spellFeedback === 'correct' && (

                  <div className="relative overflow-hidden rounded-xl shadow-md animate-in fade-in">

                    <div className="p-2.5 px-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs flex items-center justify-between">

                      <div className="flex items-center gap-1.5">

                        <CheckCircle2 className="w-4 h-4 shrink-0" />

                        <span>Chính xác 100%! (+10đ ⭐) - Tự chuyển sang từ tiếp theo...</span>

                      </div>

                      <button

                        type="button"

                        onClick={handleSpellNext}

                        className="px-2 py-0.5 rounded-md bg-white/20 hover:bg-white/30 text-[11px] font-black shrink-0 flex items-center gap-1 cursor-pointer"

                      >

                        <span>Tiếp</span> <ArrowRight className="w-3 h-3" />

                      </button>

                    </div>

                    <div className="h-1.5 w-full bg-black/25">

                      <div

                        className="h-full bg-white/90"

                        style={{ animation: 'autoAdvanceTimerSpell 1.3s linear forwards' }}

                      />

                    </div>

                  </div>

                )}



                {spellFeedback === 'wrong' && (

                  <div className="p-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs text-center flex items-center justify-center gap-2 shadow-xs animate-in fade-in">

                    <XCircle className="w-4 h-4 shrink-0" />

                    <span>Chưa đúng, em hãy thử lại hoặc bấm xem gợi ý nhé!</span>

                  </div>

                )}



                {spellShowAnswer && currentSpellWord && (

                  <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-black text-xs text-center border border-amber-300 dark:border-amber-800">

                    Đáp án đúng: <span className="text-sm underline tracking-wide font-mono">{currentSpellWord.word}</span>

                  </div>

                )}



                <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">

                  <div className="flex items-center gap-1.5">

                    <button

                      type="button"

                      onClick={handleSpellHint}

                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer border border-slate-200 dark:border-slate-700"

                    >

                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />

                      <span>Gợi Ý</span>

                    </button>

                    <button

                      type="button"

                      onClick={() => setSpellShowAnswer(true)}

                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer border border-slate-200 dark:border-slate-700"

                    >

                      <Eye className="w-3.5 h-3.5 text-slate-500" />

                      <span>Xem Đáp Án</span>

                    </button>

                  </div>



                  {spellFeedback === 'correct' ? (

                    <button

                      type="button"

                      onClick={handleSpellNext}

                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer ml-auto"

                    >

                      <span>Từ Tiếp Theo</span>

                      <ArrowRight className="w-3.5 h-3.5" />

                    </button>

                  ) : (

                    <button

                      type="submit"

                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md transition cursor-pointer ml-auto"

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

                Hoàn Thành 20 Từ Luyện Gõ Unit {selectedUnit}!

              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-300">

                Em đã gõ đúng chính tả <strong className="text-indigo-600">{spellScore} / {practiceVocabList.length} từ</strong> ({Math.round((spellScore / practiceVocabList.length) * 100)}%).

              </p>

              <div className="p-3 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold inline-block">

                ⭐ Em được cộng +10 điểm chuyên cần vào tổng điểm thi đua!

              </div>

              <div className="pt-2 flex justify-center gap-3">

                <button

                  type="button"

                  onClick={handleSpellRestart}

                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"

                >

                  <RotateCw className="w-3.5 h-3.5" />

                  <span>Luyện 20 Từ Mới</span>

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

              src={`/tuvung/index.html?grade=${selectedGrade || currentStudent?.grade || 8}&class=${encodeURIComponent(currentStudent?.className || '')}&name=${encodeURIComponent(currentStudent?.name || '')}&studentId=${encodeURIComponent(liveStudent?.id || currentStudent?.id || '')}&embedded=1&v=${Date.now()}`}

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

