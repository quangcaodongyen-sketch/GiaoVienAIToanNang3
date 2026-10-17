import audioPronunciationService, { VoiceAccent } from '../services/audioPronunciationService';
import { IpaChartPronunciationModal } from './IpaChartPronunciationModal';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCw, 
  ArrowLeft, 
  HelpCircle, 
  BookOpen, 
  Sparkles, 
  AlertCircle, 
  Trophy, 
  Star,
  ChevronRight,
  GraduationCap,
  Layers,
  FileCheck2,
  Check,
  Volume2,
  Type,
  Lightbulb
} from 'lucide-react';
import { studentGradebookService, StudentProfile } from '../services/studentGradebookService';
import { 
  GRADES_QUIZ_DATA, 
  GradeQuizInfo, 
  UnitQuizInfo, 
  UnitQuizTest, 
  QuizAttemptResult, 
  saveQuizAttempt, 
  getQuizAttempt 
} from '../data/onlineQuizData';

export type FontSizeMode = 'normal' | 'large' | 'xlarge';

// CẤU HÌNH 4 MÀU 3D ĐỘC LẬP CHO 4 ĐÁP ÁN A, B, C, D (KAHOOT / QUIZ SHOW STYLE)
const OPTION_THEMES = [
  // A: Đỏ / Ruby / Coral (Nổi bật rực rỡ)
  {
    label: 'A',
    badge: 'bg-gradient-to-b from-rose-500 to-red-600 text-white border-b-4 border-red-800 shadow-md',
    badgeActive: 'bg-gradient-to-b from-red-600 to-rose-700 text-white border-b-2 border-red-900 shadow-lg scale-105',
    unselected: 'border-2 border-b-[5px] border-rose-300 dark:border-rose-900/60 bg-gradient-to-r from-rose-50/80 to-pink-50/50 hover:from-rose-100 hover:to-pink-100 dark:from-rose-950/25 dark:to-pink-950/15 text-slate-800 dark:text-slate-100 hover:border-rose-400',
    selected: 'border-2 border-b-[5px] border-rose-600 bg-rose-100 dark:bg-rose-900/60 text-rose-950 dark:text-rose-100 ring-4 ring-rose-400/40 shadow-md translate-y-0.5',
    accentText: 'text-rose-700 dark:text-rose-300'
  },
  // B: Xanh Dương / Ocean / Sky (Tươi mát, hiện đại)
  {
    label: 'B',
    badge: 'bg-gradient-to-b from-blue-500 to-indigo-600 text-white border-b-4 border-blue-800 shadow-md',
    badgeActive: 'bg-gradient-to-b from-blue-600 to-indigo-700 text-white border-b-2 border-blue-900 shadow-lg scale-105',
    unselected: 'border-2 border-b-[5px] border-blue-300 dark:border-blue-900/60 bg-gradient-to-r from-blue-50/80 to-sky-50/50 hover:from-blue-100 hover:to-sky-100 dark:from-blue-950/25 dark:to-sky-950/15 text-slate-800 dark:text-slate-100 hover:border-blue-400',
    selected: 'border-2 border-b-[5px] border-blue-600 bg-blue-100 dark:bg-blue-900/60 text-blue-950 dark:text-blue-100 ring-4 ring-blue-400/40 shadow-md translate-y-0.5',
    accentText: 'text-blue-700 dark:text-blue-300'
  },
  // C: Vàng Cam / Amber / Honey (Ấm áp, sắc nét)
  {
    label: 'C',
    badge: 'bg-gradient-to-b from-amber-500 to-orange-600 text-white border-b-4 border-amber-800 shadow-md',
    badgeActive: 'bg-gradient-to-b from-amber-600 to-orange-700 text-white border-b-2 border-amber-900 shadow-lg scale-105',
    unselected: 'border-2 border-b-[5px] border-amber-300 dark:border-amber-900/60 bg-gradient-to-r from-amber-50/80 to-yellow-50/50 hover:from-amber-100 hover:to-yellow-100 dark:from-amber-950/25 dark:to-yellow-950/15 text-slate-800 dark:text-slate-100 hover:border-amber-400',
    selected: 'border-2 border-b-[5px] border-amber-600 bg-amber-100 dark:bg-amber-900/60 text-amber-950 dark:text-amber-100 ring-4 ring-amber-400/40 shadow-md translate-y-0.5',
    accentText: 'text-amber-700 dark:text-amber-300'
  },
  // D: Xanh Lá / Emerald / Mint (Tươi tắn, tự tin)
  {
    label: 'D',
    badge: 'bg-gradient-to-b from-emerald-500 to-teal-600 text-white border-b-4 border-emerald-800 shadow-md',
    badgeActive: 'bg-gradient-to-b from-emerald-600 to-teal-700 text-white border-b-2 border-emerald-900 shadow-lg scale-105',
    unselected: 'border-2 border-b-[5px] border-emerald-300 dark:border-emerald-900/60 bg-gradient-to-r from-emerald-50/80 to-teal-50/50 hover:from-emerald-100 hover:to-teal-100 dark:from-emerald-950/25 dark:to-teal-950/15 text-slate-800 dark:text-slate-100 hover:border-emerald-400',
    selected: 'border-2 border-b-[5px] border-emerald-600 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-100 ring-4 ring-emerald-400/40 shadow-md translate-y-0.5',
    accentText: 'text-emerald-700 dark:text-emerald-300'
  }
];

export const OnlineQuizPortal: React.FC = () => {
  // Navigation State
  const [selectedGradeNum, setSelectedGradeNum] = useState<number>(6);
  const [selectedUnitNum, setSelectedUnitNum] = useState<number>(1);
  const [activeTest, setActiveTest] = useState<UnitQuizTest | null>(null);

  // Font size setting (defaults to 'large' for large, clear readability)
  const [fontSizeMode, setFontSizeMode] = useState<FontSizeMode>(() => {
    try {
      const saved = localStorage.getItem('quiz_font_size_mode');
      return (saved as FontSizeMode) || 'large';
    } catch {
      return 'large';
    }
  });

  // Active Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(1200); // 20 minutes (1200s)
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState<boolean>(false);
  const [submittedResult, setSubmittedResult] = useState<QuizAttemptResult | null>(null);

  // Question element refs for smooth scrolling
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Get current grade and unit objects
  const currentGrade: GradeQuizInfo = 
    GRADES_QUIZ_DATA.find(g => g.grade === selectedGradeNum) || GRADES_QUIZ_DATA[0];

  const currentUnit: UnitQuizInfo = 
    currentGrade.units.find(u => u.unitNumber === selectedUnitNum) || currentGrade.units[0];

  // Auto reset unit to 1 when changing grade if unit out of bounds
  useEffect(() => {
    if (!currentGrade.units.some(u => u.unitNumber === selectedUnitNum)) {
      setSelectedUnitNum(1);
    }
  }, [selectedGradeNum]);

  const handleSetFontSize = (mode: FontSizeMode) => {
    setFontSizeMode(mode);
    try {
      localStorage.setItem('quiz_font_size_mode', mode);
    } catch {}
  };

  // Audio Pronunciation Service State & Controls chuẩn tuyệt đối
  const [isIpaModalOpen, setIsIpaModalOpen] = useState(false);
  const [voiceAccent, setVoiceAccent] = useState<VoiceAccent>(() => audioPronunciationService.getAccent());
  const [speechRate, setSpeechRate] = useState<number>(() => audioPronunciationService.getRate());

  const handleToggleAccent = (newAccent: VoiceAccent) => {
    setVoiceAccent(newAccent);
    audioPronunciationService.setAccent(newAccent);
  };

  const handleToggleRate = (newRate: number) => {
    setSpeechRate(newRate);
    audioPronunciationService.setRate(newRate);
  };

  // Text to speech for authentic English pronunciation chuẩn tuyệt đối
  const speakSentence = (text: string, customRate?: number) => {
    const clean = text.replace(/_{2,}/g, 'blank').replace(/\[.*?\]/g, '');
    audioPronunciationService.speak(clean, {
      accent: voiceAccent,
      rate: customRate || speechRate
    });
  };

  const speakOption = (optText: string, customRate?: number) => {
    audioPronunciationService.speak(optText, {
      accent: voiceAccent,
      rate: customRate || speechRate
    });
  };

  // Timer countdown
  useEffect(() => {
    let timer: any = null;
    if (isTimerRunning && timeLeft > 0 && !isSubmitted) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft, isSubmitted]);

  // Start a test
  const handleStartTest = (test: UnitQuizTest) => {
    setActiveTest(test);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setTimeLeft(test.timeMinutes * 60);
    setIsTimerRunning(true);
    setSubmittedResult(null);
    setShowConfirmSubmit(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Exit current test back to test selection
  const handleExitTest = () => {
    if (activeTest && !isSubmitted && Object.keys(selectedAnswers).length > 0) {
      if (window.confirm('Bạn đang làm dở bài thi. Bạn có chắc chắn muốn thoát về danh sách bài không?')) {
        setActiveTest(null);
        setIsTimerRunning(false);
      }
    } else {
      setActiveTest(null);
      setIsTimerRunning(false);
    }
  };

  // Option selection
  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  // Auto submit when time runs out
  const handleAutoSubmit = () => {
    finishQuizSubmission();
  };

  // Submit test
  const handlePromptSubmit = () => {
    if (!activeTest) return;
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < activeTest.questions.length) {
      setShowConfirmSubmit(true);
    } else {
      finishQuizSubmission();
    }
  };

  const finishQuizSubmission = () => {
    if (!activeTest) return;
    setIsSubmitted(true);
    setIsTimerRunning(false);
    setShowConfirmSubmit(false);

    // Calculate score
    let correct = 0;
    activeTest.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const score = Number(((correct / activeTest.questions.length) * 10).toFixed(1));
    const timeSpent = (activeTest.timeMinutes * 60) - timeLeft;

    const result: QuizAttemptResult = {
      grade: selectedGradeNum,
      unitNumber: selectedUnitNum,
      testNumber: activeTest.testNumber,
      score,
      correctCount: correct,
      totalQuestions: activeTest.questions.length,
      timeSpentSeconds: timeSpent,
      completedAt: new Date().toISOString(),
      selectedAnswers
    };

    saveQuizAttempt(result);
    setSubmittedResult(result);
    // Lưu kết quả vào Sổ Điểm Lớp Online
    const curStudent = studentGradebookService.getActiveStudent();
    if (curStudent) {
      studentGradebookService.recordSubmission({
        studentId: curStudent.id,
        studentCode: curStudent.studentCode,
        studentName: curStudent.name,
        classId: curStudent.classId,
        className: curStudent.className,
        grade: selectedGradeNum,
        testType: 'online_quiz',
        unitNumber: selectedUnitNum,
        unitTitle: currentUnit.unitTitle || currentUnit.title,
        testTitle: activeTest.title,
        score: score,
        correctCount: correct,
        totalQuestions: activeTest.questions.length,
        timeSpentSeconds: timeSpent
      });
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset test to retake
  const handleRetakeTest = () => {
    if (!activeTest) return;
    setSelectedAnswers({});
    setIsSubmitted(false);
    setTimeLeft(activeTest.timeMinutes * 60);
    setIsTimerRunning(true);
    setSubmittedResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format time (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Scroll to question
  const scrollToQuestion = (qId: number) => {
    const element = questionRefs.current[qId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Typography helpers based on user preference
  const getQuestionSizeClass = () => {
    switch (fontSizeMode) {
      case 'normal': return 'text-base sm:text-lg lg:text-xl font-bold';
      case 'xlarge': return 'text-xl sm:text-2xl lg:text-3xl font-black';
      case 'large':
      default: return 'text-lg sm:text-xl lg:text-2xl font-bold';
    }
  };

  const getOptionSizeClass = () => {
    switch (fontSizeMode) {
      case 'normal': return 'text-sm sm:text-base font-semibold';
      case 'xlarge': return 'text-lg sm:text-xl font-bold';
      case 'large':
      default: return 'text-base sm:text-lg font-bold';
    }
  };

  const getExplanationSizeClass = () => {
    switch (fontSizeMode) {
      case 'normal': return 'text-xs sm:text-sm font-medium';
      case 'xlarge': return 'text-base sm:text-lg font-medium';
      case 'large':
      default: return 'text-sm sm:text-base font-medium';
    }
  };

  return (
    <div className="space-y-6">
      {/* ========================================================
          TRƯỜNG HỢP 1: ĐANG LÀM BÀI HOẶC XEM KẾT QUẢ PHÒNG THI
         ======================================================== */}
      {activeTest ? (
        <div className="space-y-6 animate-fadeIn">
          {/* THANH ĐIỀU HƯỚNG PHÒNG THI */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4 sticky top-16 z-30 backdrop-blur-md bg-white/95 dark:bg-slate-900/95">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleExitTest}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer shadow-xs border border-slate-200 dark:border-slate-700"
                title="Quay lại danh sách bài kiểm tra"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Thoát</span>
              </button>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-lg bg-blue-600 text-white font-black text-xs">
                    Lớp {selectedGradeNum}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs">
                    {currentUnit.unitTitle}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-black text-xs">
                    Bài {activeTest.testNumber} / 5
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                  {activeTest.title} (20 Câu • 20 Phút)
                </h3>
              </div>
            </div>

            {/* Bộ chỉnh cỡ chữ + Đồng hồ + Nút nộp bài */}
            <div className="flex flex-wrap items-center gap-3 ml-auto">
              {/* Bộ điều khiển cỡ chữ trực quan */}
              <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-2 flex items-center gap-1">
                  <Type className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Cỡ chữ:</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleSetFontSize('normal')}
                  className={`px-2 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                    fontSizeMode === 'normal'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title="Cỡ chữ Nhỏ (16px)"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => handleSetFontSize('large')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                    fontSizeMode === 'large'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title="Cỡ chữ Chuẩn To Rõ (19px - Khuyên dùng)"
                >
                  A (Chuẩn)
                </button>
                <button
                  type="button"
                  onClick={() => handleSetFontSize('xlarge')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                    fontSizeMode === 'xlarge'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title="Cỡ chữ Cực To (23px)"
                >
                  A+
                </button>
              </div>

              {/* Đồng hồ đếm ngược 3D */}
              <div className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-mono text-sm sm:text-base font-black border-2 border-b-4 transition shadow-xs ${
                isSubmitted 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                  : timeLeft <= 180 
                    ? 'bg-red-50 text-red-600 border-red-300 border-b-red-600 animate-pulse' 
                    : 'bg-blue-50 text-blue-700 border-blue-300 border-b-blue-600 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
              }`}>
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>

              {!isSubmitted ? (
                <button
                  type="button"
                  onClick={handlePromptSubmit}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer border-b-4 border-emerald-800 active:border-b-2 active:translate-y-0.5"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Nộp bài ({Object.keys(selectedAnswers).length}/20)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRetakeTest}
                  className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm transition flex items-center gap-2 shadow-md cursor-pointer border-b-4 border-blue-800 active:border-b-2 active:translate-y-0.5"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Làm lại bài này</span>
                </button>
              )}
            </div>
          </div>

          {/* PALETTE 20 CÂU HỎI */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center gap-3">
            <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <span>Bảng câu hỏi:</span>
              <span className="font-mono text-blue-600 dark:text-blue-400">({Object.keys(selectedAnswers).length}/20 đã làm)</span>
            </span>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {activeTest.questions.map((q, idx) => {
                const isAnswered = selectedAnswers[q.id] !== undefined;
                const isCorrect = isSubmitted && selectedAnswers[q.id] === q.correctAnswer;
                const isWrong = isSubmitted && isAnswered && selectedAnswers[q.id] !== q.correctAnswer;

                let pillColor = 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400';
                if (isSubmitted) {
                  if (isCorrect) {
                    pillColor = 'bg-emerald-600 text-white border-emerald-600 font-black shadow-xs';
                  } else if (isWrong) {
                    pillColor = 'bg-red-600 text-white border-red-600 font-black shadow-xs';
                  } else {
                    pillColor = 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
                  }
                } else {
                  if (isAnswered) {
                    pillColor = 'bg-blue-600 text-white border-blue-600 font-black shadow-xs scale-105';
                  }
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => scrollToQuestion(q.id)}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center border-2 cursor-pointer ${pillColor}`}
                    title={`Câu ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* BẢNG BÁO CÁO KẾT QUẢ VINH DANH KHI ĐÃ NỘP BÀI */}
          {isSubmitted && submittedResult && (
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 text-white shadow-2xl border-2 border-blue-400 animate-fadeIn relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="space-y-2 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-xs sm:text-sm font-black uppercase tracking-wider">
                    <Trophy className="w-4 h-4 text-amber-300" />
                    <span>Kết Quả Đánh Giá Tức Thì • 20 Câu Trắc Nghiệm</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                    {submittedResult.score >= 9.0 ? '🌟 XUẤT SẮC TUYỆT VỜI!' :
                     submittedResult.score >= 8.0 ? '🥇 THÀNH TÍCH RẤT GIỎI!' :
                     submittedResult.score >= 6.5 ? '🥈 KẾT QUẢ KHÁ TỐT!' :
                     submittedResult.score >= 5.0 ? '🥉 ĐẠT MỨC TRUNG BÌNH!' : '💪 HÃY CỐ GẮNG HƠN Ở LẦN SAU!'}
                  </h2>
                  <p className="text-slate-200 text-sm sm:text-base max-w-xl leading-relaxed font-medium">
                    Em đã hoàn thành bài kiểm tra <strong>{activeTest.title}</strong> thuộc <strong>{currentUnit.unitTitle}</strong> (Lớp {selectedGradeNum}). Xem toàn bộ giải thích chi tiết và phát âm từng câu bên dưới!
                  </p>
                </div>

                <div className="flex items-center gap-6 shrink-0 bg-white/10 p-5 sm:p-6 rounded-3xl border border-white/20 backdrop-blur-md">
                  <div className="text-center">
                    <span className="text-xs font-bold text-slate-300 uppercase block">Điểm số đạt</span>
                    <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-amber-300 font-mono tracking-tight">
                      {submittedResult.score}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-300 block font-bold">/ 10 điểm</span>
                  </div>

                  <div className="w-px h-16 bg-white/20" />

                  <div className="text-left space-y-1.5 text-xs sm:text-sm font-semibold">
                    <div className="text-emerald-300 font-black flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Đúng: {submittedResult.correctCount} / 20 câu</span>
                    </div>
                    <div className="text-rose-300 font-bold flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" />
                      <span>Sai: {20 - submittedResult.correctCount} câu</span>
                    </div>
                    <div className="text-cyan-300 font-mono">
                      ⏱ {formatTime(submittedResult.timeSpentSeconds)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Nút thao tác sau khi nộp */}
              <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-white/15 relative z-10">
                <button
                  type="button"
                  onClick={handleRetakeTest}
                  className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm transition flex items-center gap-2 shadow-md cursor-pointer border-b-4 border-blue-800 active:border-b-2 active:translate-y-0.5"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Làm lại bài này (Luyện điểm 10)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTest(null)}
                  className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 border border-white/25 cursor-pointer"
                >
                  <span>Chọn bài kiểm tra khác</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* THANH ĐIỀU KHIỂN PHÁT ÂM CHUẨN TUYỆT ĐỐI */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 dark:from-slate-800 dark:via-blue-950/40 dark:to-slate-800 border-2 border-blue-200 dark:border-blue-800 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                <Volume2 className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <span className="font-black text-blue-950 dark:text-blue-100 flex items-center gap-1.5">
                  <span>Phát Âm Chuẩn Bản Xứ:</span>
                  <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.2 rounded-full uppercase font-black">
                    Chuẩn 100%
                  </span>
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Bấm vào biểu tượng 🔊 bên cạnh mỗi từ hoặc phương án để nghe phát âm chuẩn tuyệt đối
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* TOGGLE US / UK */}
              <div className="inline-flex rounded-xl p-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-xs font-bold shadow-xs">
                <button
                  type="button"
                  onClick={() => handleToggleAccent('US')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    voiceAccent === 'US' ? 'bg-blue-600 text-white font-black shadow-sm' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  🇺🇸 US (Mỹ)
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleAccent('UK')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    voiceAccent === 'UK' ? 'bg-blue-600 text-white font-black shadow-sm' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  🇬🇧 UK (Anh)
                </button>
              </div>

              {/* TOGGLE SPEED */}
              <div className="inline-flex rounded-xl p-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-xs font-bold shadow-xs">
                <button
                  type="button"
                  onClick={() => handleToggleRate(0.85)}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    speechRate >= 0.8 ? 'bg-indigo-600 text-white font-black shadow-sm' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  1.0x Chuẩn
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleRate(0.68)}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    speechRate < 0.8 ? 'bg-indigo-600 text-white font-black shadow-sm' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  🐢 0.7x Chậm rõ âm
                </button>
              </div>

              {/* NÚT MỞ BẢNG 44 ÂM IPA */}
              <button
                type="button"
                onClick={() => setIsIpaModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-sm border border-amber-300 flex items-center gap-1.5 transition cursor-pointer hover:scale-105"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>🗣️ Tra Bảng 44 Âm IPA</span>
              </button>
            </div>
          </div>

          {/* DANH SÁCH 20 CÂU HỎI TRẮC NGHIỆM */}
          <div className="space-y-7">
            {activeTest.questions.map((q, idx) => {
              const selected = selectedAnswers[q.id];
              const isOptionAnswered = selected !== undefined;
              const isCorrect = selected === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  ref={el => (questionRefs.current[q.id] = el)}
                  className={`p-5 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border-2 transition-all duration-200 shadow-sm hover:shadow-md space-y-4 ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20'
                        : 'border-red-500 bg-red-50/20 dark:bg-red-950/20'
                      : isOptionAnswered
                        ? 'border-blue-500/80 shadow-md ring-2 ring-blue-500/10'
                        : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {/* ========================================================
                      THANH 3D CÂU HỎI MÀU SẮC ĐẸP (3D PODIUM BANNER)
                     ======================================================== */}
                  <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white shadow-xl border-t-2 border-white/30 border-b-[6px] border-blue-950 overflow-hidden group">
                    {/* Hiệu ứng ánh sáng 3D bóng bẩy phía trên */}
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                    <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

                    {/* Header trong thanh 3D */}
                    <div className="flex items-center justify-between gap-3 mb-3 relative z-10 flex-wrap">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3.5 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-md border-b-2 border-orange-700">
                          CÂU {idx + 1} / 20
                        </span>
                        {q.level && (
                          <span className="text-xs px-3 py-1 rounded-xl bg-white/15 text-cyan-200 font-bold border border-white/20 backdrop-blur-xs">
                            Cấp độ: {q.level}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => speakSentence(q.question)}
                          title="Nghe phát âm chuẩn câu hỏi này"
                          className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-cyan-200 font-bold text-xs sm:text-sm transition cursor-pointer flex items-center gap-1.5 border border-white/20 shadow-xs"
                        >
                          <Volume2 className="w-4 h-4 text-cyan-300" />
                          <span className="hidden sm:inline">Nghe đọc</span>
                        </button>

                        {/* Trạng thái đúng sai sau khi nộp */}
                        {isSubmitted && (
                          <span className="shrink-0">
                            {isCorrect ? (
                              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-md border-b-2 border-emerald-700">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>ĐÚNG (+0.5đ)</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500 text-white font-black text-xs sm:text-sm shadow-md border-b-2 border-rose-700">
                                <XCircle className="w-4 h-4" />
                                <span>CHƯA ĐÚNG</span>
                              </div>
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Câu hỏi chữ to nổi bật trên nền Thanh 3D */}
                    <div className="relative z-10 pt-1">
                      <h3 className={`${getQuestionSizeClass()} text-white font-black tracking-tight leading-relaxed drop-shadow-sm whitespace-pre-line`}>
                        {q.question}
                      </h3>
                    </div>
                  </div>

                  {/* ========================================================
                      4 LỰA CHỌN A, B, C, D - MỖI ĐÁP ÁN 1 MÀU 3D NỔI BẬT
                     ======================================================== */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const theme = OPTION_THEMES[optIdx % OPTION_THEMES.length];
                      const isSelected = selected === optIdx;
                      const isTargetCorrect = q.correctAnswer === optIdx;

                      let btnContainerStyle = theme.unselected;
                      let badgeStyle = theme.badge;

                      if (!isSubmitted) {
                        if (isSelected) {
                          btnContainerStyle = theme.selected;
                          badgeStyle = theme.badgeActive;
                        }
                      } else {
                        // After submission:
                        if (isTargetCorrect) {
                          btnContainerStyle = 'border-2 border-b-[5px] border-emerald-600 bg-emerald-100/90 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-100 ring-4 ring-emerald-500/30 shadow-md translate-y-0.5';
                          badgeStyle = 'bg-gradient-to-b from-emerald-500 to-green-600 text-white border-b-4 border-emerald-800 shadow-md scale-105';
                        } else if (isSelected && !isTargetCorrect) {
                          btnContainerStyle = 'border-2 border-b-[5px] border-rose-500 bg-rose-100/90 dark:bg-rose-950 text-rose-950 dark:text-rose-100 line-through opacity-85';
                          badgeStyle = 'bg-gradient-to-b from-rose-500 to-red-600 text-white border-b-4 border-rose-800 shadow-md';
                        } else {
                          btnContainerStyle = 'opacity-50 border-2 border-b-[5px] border-slate-200 dark:border-slate-800 text-slate-500 bg-slate-50/50 dark:bg-slate-800/20';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={isSubmitted}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full text-left p-4 sm:p-5 rounded-2xl sm:rounded-3xl transition-all duration-150 flex items-center justify-between gap-3.5 cursor-pointer group active:border-b-2 active:translate-y-1 ${btnContainerStyle}`}
                        >
                          <div className="flex items-center gap-3.5 flex-1 min-w-0">
                            {/* Badge chữ cái A, B, C, D 3D nổi khối */}
                            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-black text-base sm:text-lg shrink-0 transition-transform ${badgeStyle}`}>
                              {theme.label}
                            </div>
                            {/* Nội dung lựa chọn: hỗ trợ gạch chân thẻ <u> */}
                            <span
                              className={`flex-1 text-left ${getOptionSizeClass()} leading-snug break-words`}
                              dangerouslySetInnerHTML={{ __html: opt }}
                            />
                            {/* Nút phát âm trực tiếp từng từ / phương án */}
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation();
                                speakOption(opt);
                              }}
                              title="Bấm để nghe phát âm chuẩn bản xứ"
                              className="p-1.5 sm:p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white text-blue-600 dark:text-blue-400 hover:text-blue-700 shadow-sm border border-blue-200 dark:border-blue-800 shrink-0 transition hover:scale-110 active:scale-95 cursor-pointer flex items-center gap-1"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              <span className="text-[11px] font-bold hidden sm:inline">Phát âm</span>
                            </span>
                          </div>

                          {isSubmitted && isTargetCorrect && (
                            <span className="text-xs font-black uppercase text-white bg-emerald-600 px-2.5 py-1 rounded-xl shrink-0 flex items-center gap-1 shadow-md border-b-2 border-emerald-800">
                              <Check className="w-3.5 h-3.5" />
                              <span>ĐÁP ÁN ĐÚNG</span>
                            </span>
                          )}
                          {isSubmitted && isSelected && !isTargetCorrect && (
                            <span className="text-xs font-black uppercase text-white bg-rose-600 px-2.5 py-1 rounded-xl shrink-0 flex items-center gap-1 shadow-md border-b-2 border-rose-800">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>CHƯA ĐÚNG</span>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* LỜI GIẢI THÍCH CHI TIẾT SƯ PHẠM */}
                  {isSubmitted && (
                    <div className="mt-4 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-amber-50/90 dark:bg-amber-950/30 border-2 border-b-[5px] border-amber-300 dark:border-amber-800 text-slate-800 dark:text-slate-200 space-y-1.5 animate-fadeIn">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="font-black text-amber-800 dark:text-amber-300 flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wide">
                          <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span>Lời giải thích chi tiết & Nội dung kiến thức cần nhớ:</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => speakOption(q.options[q.correctAnswer])}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                          title="Nghe phát âm chuẩn từ đáp án đúng"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Nghe đáp án đúng ({voiceAccent})</span>
                        </button>
                      </div>
                      <p className={`${getExplanationSizeClass()} leading-relaxed text-slate-800 dark:text-slate-200 font-medium pl-6`}>
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Nút Nộp Bài Cuối Trang */}
          {!isSubmitted && (
            <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                Đã hoàn thành <strong className="text-blue-600">{Object.keys(selectedAnswers).length}</strong> trên tổng số 20 câu hỏi.
              </span>
              <button
                type="button"
                onClick={handlePromptSubmit}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-lg transition flex items-center gap-2 cursor-pointer border-b-4 border-emerald-800 active:border-b-2 active:translate-y-0.5"
              >
                <FileCheck2 className="w-5 h-5" />
                <span>Nộp bài & Chấm điểm ngay</span>
              </button>
            </div>
          )}

          {/* MODAL CẢNH BÁO NẾU CÒN CÂU CHƯA LÀM */}
          {showConfirmSubmit && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-400/50 space-y-4 animate-scaleUp">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="text-center space-y-1">
                  <h4 className="text-lg font-black text-slate-900 dark:text-white">
                    Còn câu hỏi chưa trả lời!
                  </h4>
                  <p className="text-xs text-slate-500">
                    Em mới hoàn thành <strong>{Object.keys(selectedAnswers).length}</strong> / {activeTest.questions.length} câu. Em có muốn nộp bài luôn không?
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowConfirmSubmit(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                  >
                    Làm tiếp
                  </button>
                  <button
                    type="button"
                    onClick={finishQuizSubmission}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition cursor-pointer"
                  >
                    Nộp bài luôn
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ========================================================
            TRƯỜNG HỢP 2: DASHBOARD CHỌN LỚP, CHỌN UNIT & 5 BÀI THI
           ======================================================== */
        <div className="space-y-6 animate-fadeIn">
          {/* BANNER GIỚI THIỆU PHÂN HỆ KIỂM TRA ONLINE */}
          <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden border-2 border-blue-600/40">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 text-xs sm:text-sm font-black uppercase tracking-wider mb-3">
                <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
                <span>Hệ Thống Kiểm Tra Trắc Nghiệm Online Chuẩn Bộ GD&ĐT</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-3">
                KIỂM TRA ONLINE THEO TỪNG LỚP &amp; TỪNG UNIT
              </h2>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-medium">
                Đầy đủ 7 khối lớp (Lớp 6 đến Lớp 12). Mỗi Unit gồm <strong>đúng 5 bài kiểm tra chuyên sâu</strong>, mỗi bài <strong>20 câu trắc nghiệm</strong> (20 phút). Chữ to rõ ràng, âm thanh chuẩn bản ngữ, chấm điểm tức thì và giải thích chi tiết sư phạm.
              </p>
            </div>

            {/* BẢNG CHỌN KHỐI LỚP (LỚP 6 - 12) */}
            <div className="relative z-10 mt-6 pt-5 border-t border-white/15">
              <span className="text-xs sm:text-sm font-bold text-cyan-200 block mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <span>BƯỚC 1: CHỌN KHỐI LỚP BẠN ĐANG HỌC:</span>
              </span>
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                {[6, 7, 8, 9, 10, 11, 12].map(gNum => {
                  const isSelected = selectedGradeNum === gNum;
                  const isTHPT = gNum >= 10;
                  return (
                    <button
                      key={gNum}
                      type="button"
                      onClick={() => {
                        setSelectedGradeNum(gNum);
                        setSelectedUnitNum(1);
                      }}
                      className={`px-4 sm:px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-400 to-blue-300 text-slate-950 shadow-lg scale-105 ring-2 ring-white/50'
                          : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs'
                      }`}
                    >
                      <span>Lớp {gNum}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                        isSelected ? 'bg-slate-900 text-cyan-300' : 'bg-white/15 text-white/80'
                      }`}>
                        {isTHPT ? 'THPT' : 'THCS'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* BƯỚC 2: CHỌN UNIT THEO KHỐI LỚP */}
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>BƯỚC 2: CHỌN UNIT BÀI HỌC (LỚP {selectedGradeNum} - GLOBAL SUCCESS):</span>
              </span>
              <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">
                Tổng số {currentGrade.units.length} Units
              </span>
            </div>

            {/* Danh sách các Unit dạng lưới */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {currentGrade.units.map(u => {
                const isSelected = selectedUnitNum === u.unitNumber;
                return (
                  <button
                    key={u.unitNumber}
                    type="button"
                    onClick={() => setSelectedUnitNum(u.unitNumber)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 shadow-md ring-4 ring-blue-500/20 scale-102'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md inline-block mb-1.5 uppercase ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        Unit {u.unitNumber}
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white line-clamp-1">
                        {u.unitTitle.replace(/^Unit\s*\d+:\s*/i, '')}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-1 font-medium">
                      {u.unitTopic}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* BƯỚC 3: DANH SÁCH ĐÚNG 5 BÀI KIỂM TRA CỦA UNIT ĐANG CHỌN */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white font-black text-xs">
                    Lớp {selectedGradeNum}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs">
                    {currentUnit.unitTitle}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
                  5 Bài Kiểm Tra Trắc Nghiệm Chuyên Sâu • Mỗi Bài 20 Câu (Chấm Điểm Ngay)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5 font-medium">
                  Chủ đề: {currentUnit.unitTopic} • Ngữ pháp: {currentUnit.grammarFocus}
                </p>
              </div>

              <span className="text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-300/60 shadow-xs">
                🎯 Thang điểm 10 • Chấm điểm tức thì
              </span>
            </div>

            {/* 5 Card tương ứng với 5 Bài kiểm tra */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentUnit.tests.map(test => {
                const pastAttempt = getQuizAttempt(selectedGradeNum, selectedUnitNum, test.testNumber);

                return (
                  <div
                    key={test.testId}
                    className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group hover:border-blue-500/50"
                  >
                    <div>
                      {/* Badge bài thi & Điểm số đã đạt */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs shadow-xs">
                          BÀI {test.testNumber} / 5
                        </span>
                        
                        {pastAttempt ? (
                          <span className={`px-2.5 py-1 rounded-xl text-xs font-black border flex items-center gap-1 ${
                            pastAttempt.score >= 8.0 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300' 
                              : 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span>Điểm cao nhất: {pastAttempt.score}/10</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold text-xs">
                            Chưa làm
                          </span>
                        )}
                      </div>

                      {/* Tiêu đề bài thi */}
                      <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                        {test.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed font-medium">
                        {test.focus}
                      </p>

                      <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 font-bold">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>20 câu hỏi</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span>20 phút</span>
                        </span>
                        <span>•</span>
                        <span className="text-cyan-600">A, B, C, D</span>
                      </div>
                    </div>

                    {/* Nút bắt đầu làm bài */}
                    <div className="mt-5">
                      <button
                        type="button"
                        onClick={() => handleStartTest(test)}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 border-b-4 border-blue-800 active:border-b-2 active:translate-y-0.5"
                      >
                        <Award className="w-4 h-4 text-amber-300" />
                        <span>{pastAttempt ? 'Làm lại để nâng điểm' : 'Bắt đầu làm bài thi ngay'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {/* MODAL BẢNG 44 ÂM IPA CHUẨN TUYỆT ĐỐI */}
      <IpaChartPronunciationModal
        isOpen={isIpaModalOpen}
        onClose={() => setIsIpaModalOpen(false)}
      />
    </div>
  );
};
