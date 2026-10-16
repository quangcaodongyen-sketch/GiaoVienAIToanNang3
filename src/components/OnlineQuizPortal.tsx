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
  Copy
} from 'lucide-react';
import { 
  GRADES_QUIZ_DATA, 
  GradeQuizInfo, 
  UnitQuizInfo, 
  UnitQuizTest, 
  QuizAttemptResult, 
  saveQuizAttempt, 
  getQuizAttempt 
} from '../data/onlineQuizData';

export const OnlineQuizPortal: React.FC = () => {
  // Navigation State
  const [selectedGradeNum, setSelectedGradeNum] = useState<number>(6);
  const [selectedUnitNum, setSelectedUnitNum] = useState<number>(1);
  const [activeTest, setActiveTest] = useState<UnitQuizTest | null>(null);

  // Active Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(1200); // 20 minutes (1200s)
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState<boolean>(false);
  const [submittedResult, setSubmittedResult] = useState<QuizAttemptResult | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

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

  return (
    <div className="space-y-6">
      {/* ========================================================
          TRƯỜNG HỢP 1: ĐANG LÀM BÀI HOẶC XEM KẾT QUẢ PHÒNG THI
         ======================================================== */}
      {activeTest ? (
        <div className="space-y-6 animate-fadeIn">
          {/* THANH ĐIỀU HƯỚNG PHÒNG THI */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-wrap items-center justify-between gap-4 sticky top-16 z-30 backdrop-blur-md bg-white/95 dark:bg-slate-900/95">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleExitTest}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="Quay lại danh sách bài kiểm tra"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Quay lại</span>
              </button>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-black text-[11px]">
                    Lớp {selectedGradeNum}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-[11px]">
                    {currentUnit.unitTitle}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[11px]">
                    Bài {activeTest.testNumber} / 5
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-1">
                  {activeTest.title} (20 Câu • 20 Phút)
                </h3>
              </div>
            </div>

            {/* Đồng hồ & Nút nộp bài */}
            <div className="flex items-center gap-3 ml-auto">
              {/* Đồng hồ đếm ngược */}
              <div className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-mono text-sm font-black border transition ${
                isSubmitted 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                  : timeLeft <= 180 
                    ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' 
                    : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
              }`}>
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>

              {!isSubmitted ? (
                <button
                  type="button"
                  onClick={handlePromptSubmit}
                  className="px-5 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Nộp bài & Chấm điểm</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRetakeTest}
                  className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Làm lại bài thi</span>
                </button>
              )}
            </div>
          </div>

          {/* BẢNG ĐIỀU HƯỚNG 20 CÂU HỎI NHANH (QUESTION PALETTE) */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Bảng điều hướng 20 câu:</span>
                <span className="text-blue-600 dark:text-blue-400 font-black">
                  Đã làm {Object.keys(selectedAnswers).length} / {activeTest.questions.length} câu
                </span>
              </span>

              {isSubmitted && submittedResult && (
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                  Đúng {submittedResult.correctCount} / 20 câu • {submittedResult.score} điểm
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {activeTest.questions.map((q, idx) => {
                const isAnswered = selectedAnswers[q.id] !== undefined;
                const isCorrect = isSubmitted && selectedAnswers[q.id] === q.correctAnswer;
                const isWrong = isSubmitted && isAnswered && selectedAnswers[q.id] !== q.correctAnswer;

                let pillColor = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 border-slate-200 dark:border-slate-700';
                if (!isSubmitted && isAnswered) {
                  pillColor = 'bg-blue-600 text-white font-black shadow-xs border-blue-600';
                } else if (isSubmitted) {
                  if (isCorrect) {
                    pillColor = 'bg-emerald-600 text-white font-black border-emerald-600';
                  } else if (isWrong) {
                    pillColor = 'bg-red-600 text-white font-black border-red-600';
                  } else {
                    pillColor = 'bg-slate-200 dark:bg-slate-700 text-slate-400 border-slate-300 dark:border-slate-600';
                  }
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => scrollToQuestion(q.id)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-xs font-bold transition flex items-center justify-center border cursor-pointer ${pillColor}`}
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
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 text-white shadow-2xl border border-blue-500/40 animate-fadeIn relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="space-y-2 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-xs font-black uppercase tracking-wider">
                    <Trophy className="w-3.5 h-3.5 text-amber-300" />
                    <span>Kết Quả Đánh Giá Tức Thì • 20 Câu Trắc Nghiệm</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                    {submittedResult.score >= 9.0 ? '🌟 XUẤT SẮC TUYỆT VỜI!' :
                     submittedResult.score >= 8.0 ? '🥇 THÀNH TÍCH RẤT GIỎI!' :
                     submittedResult.score >= 6.5 ? '🥈 KẾT QUẢ KHÁ TỐT!' :
                     submittedResult.score >= 5.0 ? '🥉 ĐẠT MỨC TRUNG BÌNH!' : '💪 HÃY CỐ GẮNG HƠN Ở LẦN SAU!'}
                  </h2>
                  <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                    Em đã hoàn thành bài kiểm tra <strong>{activeTest.title}</strong> thuộc <strong>{currentUnit.unitTitle}</strong> (Lớp {selectedGradeNum}). Xem toàn bộ giải thích chi tiết từng câu bên dưới để ghi nhớ bài học!
                  </p>
                </div>

                <div className="flex items-center gap-6 shrink-0 bg-white/10 p-5 rounded-3xl border border-white/20 backdrop-blur-md">
                  <div className="text-center">
                    <span className="text-[11px] font-bold text-slate-300 uppercase block">Điểm số đạt</span>
                    <span className="text-4xl sm:text-5xl font-black text-amber-300 font-mono tracking-tight">
                      {submittedResult.score}
                    </span>
                    <span className="text-xs text-slate-400 block font-bold">/ 10 điểm</span>
                  </div>

                  <div className="w-px h-16 bg-white/20" />

                  <div className="text-left space-y-1 text-xs">
                    <div className="text-emerald-300 font-black flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Đúng: {submittedResult.correctCount} / 20 câu</span>
                    </div>
                    <div className="text-red-300 font-bold flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5" />
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
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Làm lại bài này (Luyện điểm 10)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTest(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition flex items-center gap-1.5 border border-white/25 cursor-pointer"
                >
                  <span>Chọn bài kiểm tra khác</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* DANH SÁCH 20 CÂU HỎI TRẮC NGHIỆM */}
          <div className="space-y-4">
            {activeTest.questions.map((q, idx) => {
              const selected = selectedAnswers[q.id];
              const isOptionAnswered = selected !== undefined;
              const isCorrect = selected === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  ref={el => (questionRefs.current[q.id] = el)}
                  className={`p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all ${
                    isSubmitted
                      ? isCorrect
                        ? 'border-emerald-500 bg-emerald-50/15 dark:bg-emerald-950/20 shadow-xs'
                        : 'border-red-500 bg-red-50/15 dark:bg-red-950/20 shadow-xs'
                      : isOptionAnswered
                        ? 'border-blue-400/80 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {/* Tiêu đề câu hỏi */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-blue-600 text-white font-black text-xs">
                          Câu {idx + 1} / 20
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold uppercase">
                          Cấp độ: {q.level}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed mt-2 whitespace-pre-line">
                        {q.question}
                      </p>
                    </div>

                    {/* Trạng thái đúng sai sau khi nộp */}
                    {isSubmitted && (
                      <span className="shrink-0 mt-1">
                        {isCorrect ? (
                          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-black text-xs px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>ĐÚNG (+0.5đ)</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-600 dark:text-red-400 font-black text-xs px-2 py-1 rounded-lg bg-red-100 dark:bg-red-950">
                            <XCircle className="w-4 h-4" />
                            <span>CHƯA ĐÚNG</span>
                          </div>
                        )}
                      </span>
                    )}
                  </div>

                  {/* 4 Lựa chọn A, B, C, D */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selected === optIdx;
                      const isTargetCorrect = q.correctAnswer === optIdx;

                      let btnStyle = 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50/40 text-slate-800 dark:text-slate-200';
                      
                      if (!isSubmitted) {
                        if (isSelected) {
                          btnStyle = 'border-blue-600 bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-black shadow-xs ring-2 ring-blue-500/30';
                        }
                      } else {
                        // After submission:
                        if (isTargetCorrect) {
                          btnStyle = 'border-emerald-500 bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-black ring-2 ring-emerald-500/40';
                        } else if (isSelected && !isTargetCorrect) {
                          btnStyle = 'border-red-500 bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-200 line-through opacity-80';
                        } else {
                          btnStyle = 'opacity-60 border-slate-200 dark:border-slate-800 text-slate-500';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={isSubmitted}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full text-left px-4 py-3 rounded-2xl border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                        >
                          <span className="leading-snug">{opt}</span>
                          {isSubmitted && isTargetCorrect && (
                            <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-300 bg-emerald-200 dark:bg-emerald-900 px-2 py-0.5 rounded-md shrink-0 ml-2">
                              Đáp án chuẩn
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* LỜI GIẢI THÍCH CHI TIẾT SƯ PHẠM */}
                  {isSubmitted && (
                    <div className="mt-4 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 animate-fadeIn">
                      <div className="font-black text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4" />
                        <span>Lời giải thích chi tiết & Nội dung kiến thức cần nhớ:</span>
                      </div>
                      <p className="leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Nút Nộp Bài Cuối Trang */}
          {!isSubmitted && (
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                Đã hoàn thành {Object.keys(selectedAnswers).length} trên tổng số 20 câu hỏi.
              </span>
              <button
                type="button"
                onClick={handlePromptSubmit}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <FileCheck2 className="w-5 h-5" />
                <span>Nộp bài & Chấm điểm luôn</span>
              </button>
            </div>
          )}

          {/* MODAL CẢNH BÁO NẾU CÒN CÂU CHƯA LÀM */}
          {showConfirmSubmit && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-400/50 space-y-4 animate-scaleUp">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Bạn còn {activeTest.questions.length - Object.keys(selectedAnswers).length} câu chưa làm!
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Bạn có chắc chắn muốn nộp bài chấm điểm luôn bây giờ không? Các câu chưa làm sẽ không được tính điểm.
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowConfirmSubmit(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    Tiếp tục làm bài
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
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-blue-700/40">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 text-xs font-black uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                <span>Hệ Thống Kiểm Tra Trắc Nghiệm Online Chuẩn Bộ GD&ĐT</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
                KIỂM TRA ONLINE THEO TỪNG LỚP &amp; TỪNG UNIT
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Đầy đủ 7 khối lớp (Lớp 6 đến Lớp 12). Mỗi Unit gồm <strong>đúng 5 bài kiểm tra chuyên sâu</strong>, mỗi bài <strong>20 câu trắc nghiệm</strong> (20 phút). Hệ thống chấm điểm tự động ngay lập tức và giải thích chi tiết sư phạm từng câu.
              </p>
            </div>

            {/* BẢNG CHỌN KHỐI LỚP (LỚP 6 - 12) */}
            <div className="relative z-10 mt-6 pt-5 border-t border-white/15">
              <span className="text-xs font-bold text-cyan-200 block mb-2.5 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <span>BƯỚC 1: CHỌN KHỐI LỚP BẠN ĐANG HỌC:</span>
              </span>
              <div className="flex flex-wrap items-center gap-2">
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
                      className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-400 text-slate-950 shadow-lg scale-105'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      <span>Lớp {gNum}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
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
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-black text-slate-900 dark:text-white uppercase flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>BƯỚC 2: CHỌN UNIT BÀI HỌC (LỚP {selectedGradeNum} - GLOBAL SUCCESS):</span>
              </span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                Tổng số {currentGrade.units.length} Units
              </span>
            </div>

            {/* Danh sách các Unit dạng lưới / cuộn mượt */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {currentGrade.units.map(u => {
                const isSelected = selectedUnitNum === u.unitNumber;
                return (
                  <button
                    key={u.unitNumber}
                    type="button"
                    onClick={() => setSelectedUnitNum(u.unitNumber)}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 shadow-xs ring-2 ring-blue-500/30'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md inline-block mb-1 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        Unit {u.unitNumber}
                      </span>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white line-clamp-1">
                        {u.unitTitle.replace(/^Unit\s*\d+:\s*/i, '')}
                      </h4>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-1">
                      {u.unitTopic}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* BƯỚC 3: DANH SÁCH ĐÚNG 5 BÀI KIỂM TRA CỦA UNIT ĐANG CHỌN */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white font-black text-xs">
                    Lớp {selectedGradeNum}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs">
                    {currentUnit.unitTitle}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                  5 Bài Kiểm Tra Trắc Nghiệm Chuyên Sâu • Mỗi Bài 20 Câu (Chấm Điểm Ngay)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chủ đề: {currentUnit.unitTopic} • Ngữ pháp: {currentUnit.grammarFocus}
                </p>
              </div>

              <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-300/60">
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
                    className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-lg transition flex flex-col justify-between group"
                  >
                    <div>
                      {/* Badge bài thi & Điểm số đã đạt */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-xl bg-blue-600 text-white font-black text-xs shadow-2xs">
                          BÀI {test.testNumber} / 5
                        </span>
                        
                        {pastAttempt ? (
                          <span className={`px-2.5 py-1 rounded-xl text-xs font-black border flex items-center gap-1 ${
                            pastAttempt.score >= 8.0 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300' 
                              : 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span>Điểm cao nhất: {pastAttempt.score}/10</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold text-[11px]">
                            Chưa làm
                          </span>
                        )}
                      </div>

                      {/* Tiêu đề bài thi */}
                      <h4 className="text-base font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                        {test.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {test.focus}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 font-bold">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>20 câu hỏi</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
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
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
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
    </div>
  );
};
