import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  RotateCw, 
  ArrowLeft, 
  ArrowRight,
  HelpCircle, 
  Sparkles, 
  Trophy, 
  ChevronRight,
  GraduationCap,
  Layers,
  FileCheck2,
  Check,
  Copy,
  FolderOpen,
  Compass,
  Volume2,
  BookMarked
} from 'lucide-react';
import { 
  TEXTBOOK_UNITS_DATA, 
  SGKUnit, 
  SGKSection, 
  SGKExerciseQuestion, 
  getSGKUnitsByGrade, 
  getSGKUnit 
} from '../data/textbookExercisesData';

export const TextbookExercisePortal: React.FC = () => {
  // Navigation State
  const [selectedGrade, setSelectedGrade] = useState<number>(6);
  const [selectedUnitNum, setSelectedUnitNum] = useState<number>(1);
  const [activeSectionId, setActiveSectionId] = useState<string>('getting_started');
  const [isFullUnitMode, setIsFullUnitMode] = useState<boolean>(false);

  // Exercise Session State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [scoreResult, setScoreResult] = useState<{
    score: number;
    correctCount: number;
    totalQuestions: number;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

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
      // Go to next unit
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

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-700/40">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold mb-3 uppercase tracking-wider">
            <BookMarked className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
            <span>Chương Trình Chuẩn Sách Giáo Khoa Global Success</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            BÀI TẬP SGK THEO TỪNG LỚP & TỪNG PHẦN BÀI HỌC
          </h2>
          <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed">
            Học sinh tự luyện tập tất cả các bài tập bám sát từng trang sách giáo khoa: Getting Started, A Closer Look 1 & 2, Communication, Skills 1 & 2, Looking Back & Project. Chấm điểm ngay lập tức và xem lời giải thích chi tiết!
          </p>
        </div>

        {/* BỘ LỌC CHỌN KHỐI LỚP 6 - 12 */}
        <div className="relative z-10 mt-6 pt-5 border-t border-emerald-700/40">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-200 mb-2.5">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>Chọn Khối Lớp Học Tập:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[6, 7, 8, 9, 10, 11, 12].map(g => (
              <button
                key={g}
                type="button"
                onClick={() => {
                  setSelectedGrade(g);
                  setSelectedUnitNum(1);
                  handleSelectSection('getting_started');
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center gap-1.5 ${
                  selectedGrade === g
                    ? 'bg-emerald-400 text-slate-950 shadow-md font-black scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <span>Lớp {g}</span>
                {g <= 9 ? (
                  <span className="text-[10px] opacity-75 hidden sm:inline">THCS</span>
                ) : (
                  <span className="text-[10px] opacity-75 hidden sm:inline">THPT</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CHỌN UNIT THEO LỚP */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Danh Sách Unit Sách Giáo Khoa Lớp {selectedGrade}
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            {gradeUnits.length} Units theo chuẩn NXB Giáo Dục
          </span>
        </div>

        {/* Thanh cuộn ngang các Unit */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
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
                className={`shrink-0 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer text-left flex flex-col gap-0.5 border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-102'
                    : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className="text-[11px] font-black uppercase">
                  Unit {unit.unitNumber}
                </span>
                <span className="text-xs truncate max-w-[170px] font-medium">
                  {unit.title.replace(/^Unit\s*\d+:\s*/i, '')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* THÔNG TIN UNIT & ĐIỀU HƯỚNG 7 PHẦN SGK */}
      {currentUnit && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          {/* Thông tin bài học */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[11px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                Lớp {selectedGrade} • Sách Giáo Khoa Global Success
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                {currentUnit.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                💬 {currentUnit.theme} • 💡 <span className="font-semibold text-slate-700 dark:text-slate-300">{currentUnit.grammarSummary}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={handleSelectFullUnit}
              className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-sm ${
                isFullUnitMode
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Làm Toàn Bộ Unit (35 câu)</span>
            </button>
          </div>

          {/* 7 PHẦN CỦA SGK */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-500" />
                <span>Chọn Phần Bài Học Để Luyện Tập:</span>
              </span>
              <span className="text-[11px] text-slate-400">
                7 phần chuẩn SGK
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {currentUnit.sections.map((sec, idx) => {
                const isCurrent = !isFullUnitMode && activeSectionId === sec.sectionId;
                const completedScore = completedSections[`g${selectedGrade}_u${selectedUnitNum}_${sec.sectionId}`];
                
                return (
                  <button
                    key={sec.sectionId}
                    type="button"
                    onClick={() => handleSelectSection(sec.sectionId)}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer gap-2 ${
                      isCurrent
                        ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 shadow-sm ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                        isCurrent
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        Phần {idx + 1}
                      </span>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white mt-1.5 leading-tight">
                        {sec.sectionName.replace(/^\d+\.\s*/, '').replace(/\s*\(.*?\)/, '')}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-100 dark:border-slate-800/80">
                      <span className="text-slate-400 font-medium">5 câu</span>
                      {completedScore !== undefined ? (
                        <span className="font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> {completedScore}đ
                        </span>
                      ) : (
                        <span className="text-slate-400">Chưa làm</span>
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
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Tiêu đề phần đang làm */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {isFullUnitMode ? 'TOÀN BỘ UNIT' : 'THEO TIẾT HỌC'}
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {isFullUnitMode ? `Toàn bộ bài tập Unit ${selectedUnitNum}: ${currentUnit?.title}` : currentSectionObj?.sectionName}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isFullUnitMode 
                ? 'Tổng hợp toàn diện 7 phần bài học chuẩn SGK (Tổng cộng 35 câu)'
                : currentSectionObj?.lessonFocus}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmitExercises}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Nộp bài & Chấm điểm</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Làm lại phần này</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextSection}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <span>Phần tiếp theo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* BẢNG KẾT QUẢ KHI ĐÃ NỘP BÀI */}
        {isSubmitted && scoreResult && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white shadow-xl flex flex-wrap items-center justify-between gap-4 border border-emerald-500/40 animate-fadeIn">
            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase text-emerald-300 tracking-wider">
                Kết Quả Chấm Điểm Tự Động
              </span>
              <h4 className="text-2xl sm:text-3xl font-black">
                Điểm số: <span className="text-amber-300">{scoreResult.score}</span> / 10 điểm
              </h4>
              <p className="text-xs text-slate-300">
                Bạn đã làm đúng <strong className="text-white font-bold">{scoreResult.correctCount}</strong> / {scoreResult.totalQuestions} câu hỏi. Xem đáp án chuẩn và lời giải thích bên dưới!
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-center px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                <span className="text-[10px] text-slate-300 uppercase block font-bold">Xếp loại</span>
                <span className="text-sm font-black text-emerald-300">
                  {scoreResult.score >= 9 ? 'Xuất Sắc' : scoreResult.score >= 8 ? 'Giỏi' : scoreResult.score >= 6.5 ? 'Khá' : 'Cần Cố Gắng'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* BẢNG ĐIỀU HƯỚNG CÂU HỎI (PALETTE) */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 mr-2">
            Danh sách câu ({activeQuestions.length}):
          </span>
          {activeQuestions.map((q, idx) => {
            const hasAnswer = selectedAnswers[q.id] !== undefined;
            const isCorrect = isSubmitted && selectedAnswers[q.id] === q.correctAnswer;
            const isWrong = isSubmitted && hasAnswer && selectedAnswers[q.id] !== q.correctAnswer;
            
            let btnBg = 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
            if (isSubmitted) {
              if (isCorrect) {
                btnBg = 'bg-emerald-600 text-white border-emerald-600 font-black';
              } else if (isWrong) {
                btnBg = 'bg-red-600 text-white border-red-600 font-black';
              } else {
                btnBg = 'bg-amber-100 text-amber-800 border-amber-300';
              }
            } else if (hasAnswer) {
              btnBg = 'bg-emerald-600 text-white border-emerald-600 font-bold';
            }

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => scrollToQuestion(q.id)}
                className={`w-7 h-7 rounded-lg text-xs font-bold border transition cursor-pointer flex items-center justify-center ${btnBg}`}
                title={`Câu ${idx + 1}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* DANH SÁCH CÂU HỎI */}
        <div className="space-y-4">
          {activeQuestions.map((q, idx) => {
            const selectedOpt = selectedAnswers[q.id];
            const isCorrect = isSubmitted && selectedOpt === q.correctAnswer;
            const isWrong = isSubmitted && selectedOpt !== undefined && selectedOpt !== q.correctAnswer;

            return (
              <div
                key={q.id}
                ref={el => { questionRefs.current[q.id] = el; }}
                className={`p-5 rounded-2xl border transition ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20'
                      : isWrong
                        ? 'border-red-500 bg-red-50/20 dark:bg-red-950/20'
                        : 'border-slate-200 dark:border-slate-800'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                        Câu {idx + 1}
                      </span>
                      {q.section && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {q.section}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                      {q.question}
                    </p>
                  </div>

                  {isSubmitted && (
                    <span className="shrink-0">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </span>
                  )}
                </div>

                {/* 4 LỰA CHỌN A, B, C, D */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  {q.options.map((opt, optIdx) => {
                    const isOptionSelected = selectedOpt === optIdx;
                    const isOptionCorrect = q.correctAnswer === optIdx;

                    let btnStyle = 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300';
                    if (isOptionSelected && !isSubmitted) {
                      btnStyle = 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold ring-2 ring-emerald-500/20';
                    } else if (isSubmitted) {
                      if (isOptionCorrect) {
                        btnStyle = 'border-emerald-500 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-black';
                      } else if (isOptionSelected && !isOptionCorrect) {
                        btnStyle = 'border-red-500 bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 line-through';
                      }
                    }

                    const OPT_LABELS = ['A', 'B', 'C', 'D'];

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-slate-400">
                            {OPT_LABELS[optIdx]}.
                          </span>
                          <span>{opt}</span>
                        </div>

                        {isSubmitted && isOptionCorrect && (
                          <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-200 dark:bg-emerald-900 px-1.5 py-0.5 rounded shrink-0">
                            Đáp án đúng
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* LỜI GIẢI THÍCH CHI TIẾT SƯ PHẠM */}
                {isSubmitted && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 space-y-1">
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Lời giải thích sư phạm:</span>
                    </p>
                    <p className="leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* NÚT NỘP BÀI CUỐI TRANG */}
        {!isSubmitted && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={handleSubmitExercises}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-md transition cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Nộp bài & Chấm điểm ngay</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
