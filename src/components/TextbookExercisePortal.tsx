import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  RotateCw, 
  ArrowRight,
  HelpCircle, 
  Sparkles, 
  Trophy, 
  GraduationCap,
  Layers,
  FileCheck2,
  Check,
  FolderOpen,
  Compass,
  Volume2,
  BookMarked,
  MessageSquare,
  Type,
  Lightbulb
} from 'lucide-react';
import { studentGradebookService, StudentProfile } from '../services/studentGradebookService';
import { 
  TEXTBOOK_UNITS_DATA, 
  SGKUnit, 
  SGKSection, 
  SGKExerciseQuestion, 
  getSGKUnitsByGrade 
} from '../data/textbookExercisesData';

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


// Phân loại dạng bài tập bám sát SGK Global Success
const getQuestionTypeMeta = (q: SGKExerciseQuestion) => {
  const text = (q.question || '').toLowerCase();
  const exp = (q.explanation || '').toLowerCase();
  if (text.includes('pronounced') || text.includes('underlined') || exp.includes('phát âm') || exp.includes('ngữ âm')) {
    return { label: 'Phát Âm & Ngữ Âm', color: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30', icon: '🎵' };
  }
  if (text.includes('stress') || exp.includes('trọng âm')) {
    return { label: 'Trọng Âm Từ Vựng', color: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30', icon: '⚡' };
  }
  if (text.includes('read') || text.includes('passage') || exp.includes('đọc hiểu') || exp.includes('đoạn văn')) {
    return { label: 'Đọc Hiểu Đoạn Văn', color: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30', icon: '📑' };
  }
  if (text.includes('mistake') || text.includes('error') || text.includes('needs correction') || exp.includes('lỗi sai')) {
    return { label: 'Tìm Lỗi Sai', color: 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30', icon: '🔍' };
  }
  if (text.includes('closest') || text.includes('opposite') || text.includes('means') || exp.includes('từ đồng nghĩa') || exp.includes('trái nghĩa')) {
    return { label: 'Từ Đồng Nghĩa / Trái Nghĩa', color: 'bg-teal-500/15 text-teal-800 dark:text-teal-300 border-teal-500/30', icon: '📚' };
  }
  if (text.includes('lan:') || text.includes('nam:') || text.includes('mai:') || text.includes('peter:') || text.includes(' - ')) {
    return { label: 'Giao Tiếp Everyday English', color: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30', icon: '💬' };
  }
  if (exp.includes('thì ') || exp.includes('hiện tại') || exp.includes('quá khứ') || exp.includes('câu điều kiện') || exp.includes('bị động') || exp.includes('ngữ pháp')) {
    return { label: 'Ngữ Pháp & Cấu Trúc', color: 'bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 border-cyan-500/30', icon: '📐' };
  }
  return { label: 'Từ Vựng Chuyên Đề SGK', color: 'bg-indigo-500/15 text-indigo-800 dark:text-indigo-300 border-indigo-500/30', icon: '📖' };
};

export const TextbookExercisePortal: React.FC = () => {
  // Navigation State
  const [selectedGrade, setSelectedGrade] = useState<number>(6);
  const [selectedUnitNum, setSelectedUnitNum] = useState<number>(1);
  const [activeSectionId, setActiveSectionId] = useState<string>('getting_started');
  // Lấy thông tin học sinh đang làm bài
  const [activeStudent, setActiveStudent] = useState<StudentProfile | null>(() => studentGradebookService.getActiveStudent());
  const [shuffleSeed, setShuffleSeed] = useState<number>(0);
  const [toastNotify, setToastNotify] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastNotify(msg);
    setTimeout(() => setToastNotify(null), 3000);
  };

  const handleShuffleNewQuestions = () => {
    setShuffleSeed(prev => prev + 1);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScoreResult(null);
    showToast('Đã xáo trộn đề thành công! Bạn có bộ câu hỏi và đáp án tươi mới.');
  };

  const [isFullUnitMode, setIsFullUnitMode] = useState<boolean>(false);

  // Font size setting (defaults to 'large' for large, clear readability)
  const [fontSizeMode, setFontSizeMode] = useState<FontSizeMode>(() => {
    try {
      const saved = localStorage.getItem('sgk_font_size_mode');
      return (saved as FontSizeMode) || 'large';
    } catch {
      return 'large';
    }
  });

  // Exercise Session State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [scoreResult, setScoreResult] = useState<{
    score: number;
    correctCount: number;
    totalQuestions: number;
  } | null>(null);

  // Section completion memory (stored in localStorage)
  const [completedSections, setCompletedSections] = useState<Record<string, number>>(() => {
    try {
      const raw = localStorage.getItem('sgk_completed_sections');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Get units for current grade
  const gradeUnits = getSGKUnitsByGrade(selectedGrade);
  const currentUnit: SGKUnit = 
    gradeUnits.find(u => u.unitNumber === selectedUnitNum) || gradeUnits[0] || TEXTBOOK_UNITS_DATA[0];

  // Auto reset unit to 1 when changing grade if unit out of bounds
  useEffect(() => {
    if (!gradeUnits.some(u => u.unitNumber === selectedUnitNum)) {
      setSelectedUnitNum(1);
    }
  }, [selectedGrade]);

  const handleSetFontSize = (mode: FontSizeMode) => {
    setFontSizeMode(mode);
    try {
      localStorage.setItem('sgk_font_size_mode', mode);
    } catch {}
  };

  // Text to speech for authentic English pronunciation
  const speakSentence = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/_{2,}/g, 'blank').replace(/\[.*?\]/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Current active questions
  const activeQuestions: SGKExerciseQuestion[] = React.useMemo(() => {
    if (!currentUnit || !currentUnit.sections) return [];
    if (isFullUnitMode) {
      return currentUnit.sections.flatMap(s => s.questions);
    }
    const sec = currentUnit.sections.find(s => s.sectionId === activeSectionId);
    return sec ? sec.questions : currentUnit.sections[0]?.questions || [];
  }, [currentUnit, activeSectionId, isFullUnitMode]);

  // Reset exercise when changing section or unit
  const handleSelectSection = (sectionId: string) => {
    setIsFullUnitMode(false);
    setActiveSectionId(sectionId);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScoreResult(null);
  };

  const handleSelectFullUnit = () => {
    setIsFullUnitMode(true);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScoreResult(null);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  // Submit and grade instantly
  const handleSubmitExercises = () => {
    if (activeQuestions.length === 0) return;
    let correct = 0;
    activeQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const score = Number(((correct / activeQuestions.length) * 10).toFixed(1));
    const result = {
      score,
      correctCount: correct,
      totalQuestions: activeQuestions.length
    };

    setIsSubmitted(true);
    setScoreResult(result);

    // Save section completion
    const key = `g${selectedGrade}_u${selectedUnitNum}_${isFullUnitMode ? 'full' : activeSectionId}`;
    const updated = { ...completedSections, [key]: score };
    setCompletedSections(updated);
    try {
      localStorage.setItem('sgk_completed_sections', JSON.stringify(updated));
    } catch {}

        // Lưu vào Sổ Điểm Trực Tuyến Toàn Diện
    const curStudent = studentGradebookService.getActiveStudent();
    if (curStudent) {
      const sectionName = isFullUnitMode 
        ? 'Toàn bộ 7 phần SGK' 
        : (currentUnit.sections.find(s => s.sectionId === activeSectionId)?.sectionName || 'Bài tập SGK');

      studentGradebookService.recordSubmission({
        studentId: curStudent.id,
        studentCode: curStudent.studentCode,
        studentName: curStudent.name,
        classId: curStudent.classId,
        className: curStudent.className,
        grade: selectedGrade,
        testType: 'sgk_exercise',
        unitNumber: selectedUnitNum,
        unitTitle: currentUnit.title,
        testTitle: `${currentUnit.title}: ${sectionName}`,
        score: score,
        correctCount: correct,
        totalQuestions: activeQuestions.length,
        timeSpentSeconds: 300,
      });
      showToast(`Đã tự động ghi nhận điểm ${score} vào Sổ Điểm Lớp ${curStudent.className}!`);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScoreResult(null);
  };

  const handleNextSection = () => {
    if (!currentUnit || !currentUnit.sections) return;
    const currentIdx = currentUnit.sections.findIndex(s => s.sectionId === activeSectionId);
    if (currentIdx !== -1 && currentIdx < currentUnit.sections.length - 1) {
      const nextSec = currentUnit.sections[currentIdx + 1];
      handleSelectSection(nextSec.sectionId);
    } else {
      if (selectedUnitNum < gradeUnits.length) {
        setSelectedUnitNum(selectedUnitNum + 1);
        handleSelectSection('getting_started');
      }
    }
  };

  const scrollToQuestion = (id: string) => {
    const el = questionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const currentSectionObj = currentUnit?.sections.find(s => s.sectionId === activeSectionId);

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

  const SECTION_ICONS = [
    Sparkles,       // 1. Getting Started
    BookOpen,       // 2. Closer Look 1
    Layers,         // 3. Closer Look 2
    MessageSquare,  // 4. Communication
    Compass,        // 5. Skills 1
    FileCheck2,     // 6. Skills 2
    Trophy          // 7. Looking Back
  ];

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="space-y-6">
      {toastNotify && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400/50 animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-bold text-sm">{toastNotify}</span>
        </div>
      )}
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 border-2 border-blue-400/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden border-2 border-blue-400/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-xs sm:text-sm font-black mb-3 uppercase tracking-wider backdrop-blur-md">
            <BookMarked className="w-4 h-4 text-emerald-300 animate-pulse" />
            <span>Chương Trình Chuẩn 100% Sách Giáo Khoa Global Success (6 - 12)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-3">
            BÀI TẬP SGK THEO TỪNG LỚP & TỪNG PHẦN BÀI HỌC
          </h2>
          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed font-medium">
            Luyện tập toàn bộ 7 phần bài học bám sát 100% từng trang sách giáo khoa: Getting Started, A Closer Look 1 & 2, Communication, Skills 1 & 2, Looking Back & Project. Chấm điểm tức thì, phát âm giọng chuẩn bản xứ và xem lời giải thích chi tiết!
          </p>
        </div>

        {/* BỘ LỌC CHỌN KHỐI LỚP 6 - 12 */}
        <div className="relative z-10 mt-6 pt-5 border-t border-emerald-700/50">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-200 mb-3">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>Chọn Khối Lớp Học Tập:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {[6, 7, 8, 9, 10, 11, 12].map(g => (
              <button
                key={g}
                type="button"
                onClick={() => {
                  setSelectedGrade(g);
                  setSelectedUnitNum(1);
                  handleSelectSection('getting_started');
                }}
                className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
                  selectedGrade === g
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 shadow-lg font-black scale-105 ring-2 ring-white/50'
                    : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs'
                }`}
              >
                <span>Lớp {g}</span>
                {g <= 9 ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-950/40 text-emerald-200">THCS</span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-cyan-950/40 text-cyan-200">THPT</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CHỌN UNIT THEO LỚP */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Danh Sách Unit Sách Giáo Khoa Lớp {selectedGrade}
            </h3>
          </div>
          <span className="text-xs sm:text-sm text-slate-500 font-semibold">
            {gradeUnits.length} Units bám sát SGK Global Success
          </span>
        </div>

        {/* Thanh cuộn ngang các Unit */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
          {gradeUnits.map(unit => {
            const isSelected = unit.unitNumber === selectedUnitNum;
            return (
              <button
                key={unit.unitNumber}
                type="button"
                onClick={() => {
                  setSelectedUnitNum(unit.unitNumber);
                  handleSelectSection('getting_started');
                }}
                className={`shrink-0 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-left flex flex-col gap-1 border-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500 shadow-md scale-102 ring-2 ring-emerald-400/30'
                    : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className={`text-[11px] font-black uppercase ${isSelected ? 'text-emerald-200' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  Unit {unit.unitNumber}
                </span>
                <span className="truncate max-w-[200px] font-bold">
                  {unit.title.replace(/^Unit\s*\d+:\s*/i, '')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* THÔNG TIN UNIT & ĐIỀU HƯỚNG 7 PHẦN SGK */}
      {currentUnit && (
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          {/* Thông tin bài học */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                Lớp {selectedGrade} • Sách Giáo Khoa Global Success
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                {currentUnit.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
                💬 {currentUnit.theme} • 💡 <span className="font-bold text-slate-800 dark:text-slate-100">{currentUnit.grammarSummary}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={handleSelectFullUnit}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 shadow-sm ${
                isFullUnitMode
                  ? 'bg-amber-500 text-slate-950 font-black ring-4 ring-amber-400/30'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-md'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Làm Toàn Bộ Unit (35 câu)</span>
            </button>
          </div>

          {/* 7 PHẦN CỦA SGK */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-500" />
                <span>Chọn Phần Bài Học Để Luyện Tập (7 Phần Chuẩn SGK):</span>
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                7 phần chuẩn SGK
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {currentUnit.sections.map((sec, idx) => {
                const isCurrent = !isFullUnitMode && activeSectionId === sec.sectionId;
                const completedScore = completedSections[`g${selectedGrade}_u${selectedUnitNum}_${sec.sectionId}`];
                const IconComponent = SECTION_ICONS[idx % SECTION_ICONS.length];
                
                return (
                  <button
                    key={sec.sectionId}
                    type="button"
                    onClick={() => handleSelectSection(sec.sectionId)}
                    className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer gap-2.5 ${
                      isCurrent
                        ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 shadow-md ring-4 ring-emerald-500/20 scale-102'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                          isCurrent
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          Phần {idx + 1}
                        </span>
                        <IconComponent className={`w-3.5 h-3.5 ${isCurrent ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                      </div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-snug">
                        {sec.sectionName.replace(/^\d+\.\s*/, '').replace(/\s*\(.*?\)/, '')}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 font-semibold">5 câu</span>
                      {completedScore !== undefined ? (
                        <span className="font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                          <Check className="w-3 h-3" /> {completedScore}đ
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">Chưa làm</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* KHU VỰC BÀI TẬP (EXERCISE ARENA) */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-7 rounded-3xl border-2 border-blue-200 shadow-md space-y-6">
        {/* THANH ĐIỀU HƯỚNG VÀ BỘ CHỈNH CỠ CHỮ */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase tracking-wide">
                {isFullUnitMode ? 'TOÀN BỘ UNIT' : 'THEO TIẾT HỌC'}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {isFullUnitMode ? `Toàn bộ bài tập Unit ${selectedUnitNum}: ${currentUnit?.title}` : currentSectionObj?.sectionName}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {isFullUnitMode 
                ? 'Tổng hợp toàn diện 7 phần bài học chuẩn SGK (Tổng cộng 35 câu)'
                : currentSectionObj?.lessonFocus}
            </p>
          </div>

          {/* CỠ CHỮ + NỘP BÀI */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Bộ điều khiển cỡ chữ - Trực quan, dễ dùng cho học sinh & thầy cô */}
            <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-2 flex items-center gap-1">
                <Type className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cỡ chữ:</span>
              </span>
              <button
                type="button"
                onClick={() => handleSetFontSize('normal')}
                className={`px-2.5 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                  fontSizeMode === 'normal'
                    ? 'bg-emerald-600 text-white shadow-xs'
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
                    ? 'bg-emerald-600 text-white shadow-xs'
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
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                title="Cỡ chữ Cực To (23px)"
              >
                A+
              </button>
            </div>

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmitExercises}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Nộp bài & Chấm điểm ({answeredCount}/{activeQuestions.length})</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Làm lại phần này</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextSection}
                  className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm transition cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <span>Phần tiếp theo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* BẢNG KẾT QUẢ KHI ĐÃ NỘP BÀI */}
        {isSubmitted && scoreResult && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white shadow-2xl flex flex-wrap items-center justify-between gap-4 border-2 border-emerald-500/50 animate-fadeIn">
            <div className="space-y-1.5">
              <span className="text-xs font-black uppercase text-emerald-300 tracking-wider">
                Kết Quả Chấm Điểm Tự Động • Chuẩn SGK 100%
              </span>
              <h4 className="text-3xl sm:text-4xl font-black">
                Điểm số: <span className="text-amber-300 font-mono">{scoreResult.score}</span> / 10 điểm
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 font-medium">
                Em đã trả lời đúng <strong className="text-white font-black text-base">{scoreResult.correctCount}</strong> / {scoreResult.totalQuestions} câu hỏi. Xem lời giải thích chi tiết và phát âm câu hỏi bên dưới!
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-center px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                <span className="text-[11px] text-slate-300 uppercase block font-bold">Đánh Giá</span>
                <span className="text-base sm:text-lg font-black text-emerald-300">
                  {scoreResult.score >= 9 ? '🌟 Xuất Sắc' : scoreResult.score >= 8 ? '🥇 Giỏi' : scoreResult.score >= 6.5 ? '🥈 Khá' : '💪 Cần Cố Gắng'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* BẢNG ĐIỀU HƯỚNG CÂU HỎI (PALETTE) */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mr-2 flex items-center gap-1">
            <span>Danh sách câu hỏi:</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">({answeredCount}/{activeQuestions.length} đã chọn)</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {activeQuestions.map((q, idx) => {
              const hasAnswer = selectedAnswers[q.id] !== undefined;
              const isCorrect = isSubmitted && selectedAnswers[q.id] === q.correctAnswer;
              const isWrong = isSubmitted && hasAnswer && selectedAnswers[q.id] !== q.correctAnswer;
              
              let btnBg = 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400';
              if (isSubmitted) {
                if (isCorrect) {
                  btnBg = 'bg-emerald-600 text-white border-emerald-600 font-black shadow-xs';
                } else if (isWrong) {
                  btnBg = 'bg-red-600 text-white border-red-600 font-black shadow-xs';
                } else {
                  btnBg = 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
                }
              } else if (hasAnswer) {
                btnBg = 'bg-emerald-600 text-white border-emerald-600 font-black shadow-xs scale-105';
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => scrollToQuestion(q.id)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all cursor-pointer flex items-center justify-center ${btnBg}`}
                  title={`Câu ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* DANH SÁCH CÂU HỎI */}
        <div className="space-y-7">
          {activeQuestions.map((q, idx) => {
            const selectedOpt = selectedAnswers[q.id];
            const isCorrect = isSubmitted && selectedOpt === q.correctAnswer;
            const isWrong = isSubmitted && selectedOpt !== undefined && selectedOpt !== q.correctAnswer;

            return (
              <div
                key={q.id}
                ref={el => { questionRefs.current[q.id] = el; }}
                className={`p-5 sm:p-7 rounded-3xl border-2 transition-all duration-200 shadow-sm hover:shadow-md space-y-4 ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20'
                      : isWrong
                        ? 'border-red-500 bg-red-50/20 dark:bg-red-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                {/* ========================================================
                    THANH 3D CÂU HỎI MÀU SẮC ĐẸP (3D PODIUM BANNER)
                   ======================================================== */}
                <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white shadow-xl border-t-2 border-white/30 border-b-[6px] border-blue-950 overflow-hidden group">
                  {/* Hiệu ứng ánh sáng 3D bóng bẩy phía trên */}
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                  <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

                  {/* Header trong thanh 3D: Số câu, Chuyên mục, Phát âm & Đánh giá */}
                  <div className="flex items-center justify-between gap-3 mb-3 relative z-10 flex-wrap">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3.5 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-md border-b-2 border-orange-700">
                        CÂU {idx + 1}
                      </span>
                      {q.section && (
                        <span className="text-xs px-3 py-1 rounded-xl bg-white/15 text-cyan-200 font-bold border border-white/20 backdrop-blur-xs">
                          {q.section}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Nút phát âm âm thanh bản xứ */}
                      <button
                        type="button"
                        onClick={() => speakSentence(q.question)}
                        title="Nghe phát âm chuẩn bản ngữ câu hỏi này"
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
                              <span>CHÍNH XÁC (+1đ)</span>
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

                  {/* Nội dung câu hỏi - Chữ to, nổi bật trên nền Thanh 3D */}
                  <div className="relative z-10 pt-1">
                    <h3 className={`${getQuestionSizeClass()} text-white font-black tracking-tight leading-relaxed drop-shadow-sm`}>
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
                    const isOptionSelected = selectedOpt === optIdx;
                    const isOptionCorrect = q.correctAnswer === optIdx;

                    let btnContainerStyle = theme.unselected;
                    let badgeStyle = theme.badge;

                    if (!isSubmitted) {
                      if (isOptionSelected) {
                        btnContainerStyle = theme.selected;
                        badgeStyle = theme.badgeActive;
                      }
                    } else {
                      // Đã nộp bài
                      if (isOptionCorrect) {
                        btnContainerStyle = 'border-2 border-b-[5px] border-emerald-600 bg-emerald-100/90 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-100 ring-4 ring-emerald-500/30 shadow-md translate-y-0.5';
                        badgeStyle = 'bg-gradient-to-b from-emerald-500 to-green-600 text-white border-b-4 border-emerald-800 shadow-md scale-105';
                      } else if (isOptionSelected && !isOptionCorrect) {
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
                        className={`w-full text-left p-4 sm:p-5 rounded-2xl sm:rounded-3xl transition-all duration-150 cursor-pointer flex items-center justify-between gap-3.5 group active:border-b-2 active:translate-y-1 ${btnContainerStyle}`}
                      >
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          {/* Badge chữ cái A, B, C, D 3D nổi khối */}
                          <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-black text-base sm:text-lg shrink-0 transition-transform ${badgeStyle}`}>
                            {theme.label}
                          </div>
                          {/* Nội dung phương án - Chữ to, đậm, rõ nét */}
                          <span className={`flex-1 text-left ${getOptionSizeClass()} leading-snug break-words`}>
                            {opt}
                          </span>
                        </div>

                        {/* Nhãn đáp án khi đã nộp bài */}
                        {isSubmitted && isOptionCorrect && (
                          <span className="text-xs font-black uppercase text-white bg-emerald-600 px-2.5 py-1 rounded-xl shrink-0 flex items-center gap-1 shadow-md border-b-2 border-emerald-800">
                            <Check className="w-3.5 h-3.5" />
                            <span>ĐÚNG</span>
                          </span>
                        )}
                        {isSubmitted && isOptionSelected && !isOptionCorrect && (
                          <span className="text-xs font-black uppercase text-white bg-rose-600 px-2.5 py-1 rounded-xl shrink-0 flex items-center gap-1 shadow-md border-b-2 border-rose-800">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>SAI</span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* LỜI GIẢI THÍCH CHI TIẾT SƯ PHẠM */}
                {isSubmitted && (
                  <div className="mt-4 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-amber-50/90 dark:bg-amber-950/30 border-2 border-b-[5px] border-amber-300 dark:border-amber-800 text-slate-800 dark:text-slate-200 space-y-1.5 animate-fadeIn">
                    <p className="font-black text-amber-800 dark:text-amber-300 flex items-center gap-2 text-xs sm:text-sm uppercase tracking-wide">
                      <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Lời giải thích sư phạm chi tiết:</span>
                    </p>
                    <p className={`${getExplanationSizeClass()} leading-relaxed text-slate-800 dark:text-slate-200 font-medium pl-6`}>
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* NÚT NỘP BÀI CUỐI TRANG */}
        {!isSubmitted && (
          <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-bold text-slate-500">
              Đã hoàn thành <strong className="text-emerald-600">{answeredCount}</strong> / {activeQuestions.length} câu hỏi
            </span>
            <button
              type="button"
              onClick={handleSubmitExercises}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-lg transition cursor-pointer flex items-center gap-2 scale-102 border-b-4 border-emerald-800 active:border-b-2 active:translate-y-0.5"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Nộp bài & Chấm điểm ngay</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
