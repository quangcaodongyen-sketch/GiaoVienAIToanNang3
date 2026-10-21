import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, 
  RotateCw, 
  Volume2, 
  Sparkles, 
  BookOpen, 
  Trophy, 
  Play, 
  Pause, 
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Check,
  ChevronDown,
  ChevronUp,
  Headphones
} from 'lucide-react';
import { studentGradebookService, StudentProfile } from '../services/studentGradebookService';
import { OFFICIAL_MIDTERM_EXAMS_DATA } from '../data/officialMidtermExams';

export interface ExamQuestion {
  part: 'A' | 'B' | 'C' | 'D' | 'E';
  partTitle: string;
  partInstruction: string;
  qNumber: number;
  id: string;
  type: 'choice' | 'fill' | 'rewrite' | 'essay';
  text: string;
  audioText?: string;
  options?: string[];
  correct: string;
  correctLetter?: string;
  explanation?: string;
  passage?: string;
}

export interface GeneratedExam {
  grade: number;
  examType: 'giua-ky-1' | 'cuoi-ky-1' | 'giua-ky-2' | 'cuoi-ky-2';
  typeTitle: string;
  examCode: string;
  durationMinutes: number;
  totalQuestions: number;
  passageText: string;
  audioUrl?: string;
  audioScript?: string;
  sampleWriting?: string;
  writingRubric?: string;
  questions: ExamQuestion[];
}

interface OnlineExamPortalProps {
  onGoToLeaderboard?: () => void;
}

export const OnlineExamPortal: React.FC<OnlineExamPortalProps> = ({ onGoToLeaderboard }) => {
  const [selectedGrade, setSelectedGrade] = useState<number>(8);
  const [examType, setExamType] = useState<'giua-ky-1' | 'cuoi-ky-1' | 'giua-ky-2' | 'cuoi-ky-2'>('giua-ky-1');
  const [selectedExamIndex, setSelectedExamIndex] = useState<number>(0);
  const [currentExam, setCurrentExam] = useState<GeneratedExam | null>(null);
  
  const [activeStudent, setActiveStudent] = useState<StudentProfile | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [scoreResult, setScoreResult] = useState<{
    score: number;
    correctCount: number;
    wrongCount: number;
    skippedCount: number;
    total: number;
    rankLevel: string;
    scaledScore: number;
  } | null>(null);

  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [showAudioScript, setShowAudioScript] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const student = studentGradebookService.getActiveStudent();
    setActiveStudent(student);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
    buildExam(selectedGrade, examType, selectedExamIndex);
  }, [selectedGrade, examType, selectedExamIndex]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleTogglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch(err => {
        console.warn('Audio play error:', err);
      });
    }
  };

  const handleChangePlaybackRate = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  // NẠP ĐỀ CHÍNH THỨC TỪ KHO DỮ LIỆU ĐƯỢC XUẤT TỪ APP TẠO ĐỀ TIẾNG ANH THCS
  const buildExam = (grade: number, type: string, examIdx: number) => {
    setIsSubmitted(false);
    setUserAnswers({});
    setScoreResult(null);
    setShowAudioScript(false);
    setIsPlayingAudio(false);

    const gradeExams = OFFICIAL_MIDTERM_EXAMS_DATA[grade];
    if (gradeExams && type === 'giua-ky-1') {
      const availableCodes = Object.keys(gradeExams).sort();
      if (availableCodes.length > 0) {
        const targetCode = availableCodes[examIdx % availableCodes.length];
        const offExam = gradeExams[targetCode];

        if (offExam) {
          const convertedQuestions: ExamQuestion[] = offExam.questions.map(q => ({
            part: q.part,
            partTitle: q.partTitle,
            partInstruction: q.partInstruction,
            qNumber: q.qNumber,
            id: q.id,
            type: q.type,
            text: q.text,
            options: q.options,
            correct: q.correct,
            correctLetter: q.correctLetter,
            explanation: q.explanation,
            passage: q.passage
          }));

          setCurrentExam({
            grade,
            examType: type as any,
            typeTitle: `BÀI KIỂM TRA ĐÁNH GIÁ GIỮA HỌC KỲ I — LỚP ${grade}`,
            examCode: `MÃ ĐỀ ${targetCode}`,
            durationMinutes: offExam.durationMinutes || 60,
            totalQuestions: convertedQuestions.length,
            passageText: offExam.passageText,
            audioUrl: offExam.audioUrl,
            audioScript: offExam.audioScript,
            writingRubric: offExam.writingRubric,
            sampleWriting: offExam.sampleWritingText,
            questions: convertedQuestions
          });
          return;
        }
      }
    }

    setCurrentExam(null);
  };

  const handleSelectAnswer = (qId: string, value: string) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [qId]: value
    }));
  };

  const handleSubmitExam = () => {
    if (!currentExam) return;
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    currentExam.questions.forEach(q => {
      const userAns = (userAnswers[q.id] || '').trim().toLowerCase();
      const rightAns = (q.correct || '').trim().toLowerCase();

      if (!userAns) {
        skippedCount++;
        return;
      }

      let isQCorrect = false;
      if (q.type === 'essay') {
        const words = userAns.match(/\S+/g) || [];
        if (words.length >= 15) {
          isQCorrect = true;
        }
      } else if (userAns === rightAns) {
        isQCorrect = true;
      } else if (q.options) {
        const userIdx = q.options.findIndex(o => o.trim().toLowerCase() === userAns);
        const rightIdx = q.options.findIndex(o => o.trim().toLowerCase() === rightAns);
        if (userIdx !== -1 && userIdx === rightIdx) {
          isQCorrect = true;
        } else if (q.correctLetter && userAns === q.correctLetter.toLowerCase()) {
          isQCorrect = true;
        }
      }

      if (isQCorrect) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    const scaledScore = Math.round((correctCount / currentExam.questions.length) * 100) / 10;
    let rankLevel = 'DAT';
    if (scaledScore >= 8.0) rankLevel = 'GIOI';
    else if (scaledScore >= 6.5) rankLevel = 'KHA';

    setScoreResult({
      score: scaledScore,
      correctCount,
      wrongCount,
      skippedCount,
      total: currentExam.questions.length,
      rankLevel,
      scaledScore
    });
    setIsSubmitted(true);

    if (activeStudent) {
      studentGradebookService.saveExamResult(activeStudent.id, {
        examTitle: `${currentExam.typeTitle} (${currentExam.examCode})`,
        score: scaledScore,
        correctCount,
        totalQuestions: currentExam.questions.length,
        durationMinutes: currentExam.durationMinutes,
        rankLevel
      });
    }

    // Scroll lên kết quả
    const resEl = document.getElementById('exam-result-banner');
    if (resEl) {
      resEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const handleResetExam = () => {
    buildExam(selectedGrade, examType, selectedExamIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Lấy danh sách mã đề hiện có cho khối lớp và đợt thi được chọn
  const gradeExams = OFFICIAL_MIDTERM_EXAMS_DATA[selectedGrade];
  const currentAvailableCodes = (gradeExams && examType === 'giua-ky-1') 
    ? Object.keys(gradeExams).sort() 
    : [];
  const hasOfficialForCurrent = currentAvailableCodes.length > 0;

  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto pb-24">
      {/* BANNER ĐIỀU KHIỂN & CHỌN ĐỀ CHÍNH THỨC - MOBILE OPTIMIZED */}
      <div className="bg-gradient-to-br from-blue-950 via-indigo-900 to-sky-950 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-xl relative overflow-hidden border border-sky-800/40">
        <div className="absolute right-0 top-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-md bg-amber-400 text-blue-950 text-xs sm:text-sm font-black tracking-wide uppercase shadow-xs">
                CHUẨN BGD&ĐT (CV 7991)
              </span>
              <h2 className="text-base sm:text-xl font-black tracking-tight text-white">
                ĐỀ KIỂM TRA GIỮA KỲ & CUỐI KỲ ONLINE
              </h2>
            </div>
            <div className="text-xs sm:text-sm text-sky-200">
              Audio 2 giọng Nam & Nữ • Chấm điểm & Giải thích chi tiết
            </div>
          </div>

          {/* DÒNG 1: CHỌN KHỐI LỚP (6, 7, 8, 9 ĐẦY ĐỦ 20 ĐỀ) */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <div className="text-xs sm:text-sm font-bold text-sky-200 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-300" /> 
              <span>1. Chọn khối lớp làm bài:</span>
            </div>
            <div className="grid grid-cols-4 sm:flex sm:items-center gap-1.5 sm:gap-2">
              {[
                { grade: 6, label: 'Lớp 6', count: '20 đề' },
                { grade: 7, label: 'Lớp 7', count: '20 đề' },
                { grade: 8, label: 'Lớp 8', count: '20 đề' },
                { grade: 9, label: 'Lớp 9', count: '20 đề' },
              ].map(({ grade, label, count }) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => {
                    setSelectedGrade(grade);
                    setSelectedExamIndex(0);
                  }}
                  className={`py-2 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 active:scale-95 ${
                    selectedGrade === grade
                      ? 'bg-amber-400 text-blue-950 shadow-md ring-2 ring-white/80 scale-102'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <span>{label}</span>
                  <span className={`text-[10px] sm:text-xs px-1.5 py-0.2 rounded-full font-bold ${
                    selectedGrade === grade ? 'bg-blue-950 text-amber-300' : 'bg-emerald-500 text-white'
                  }`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* DÒNG 2: CHỌN ĐỢT THI */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <div className="text-xs sm:text-sm font-bold text-sky-200">
              2. Đợt kiểm tra:
            </div>
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 sm:gap-2">
              {[
                { id: 'giua-ky-1', label: 'Giữa HK1 (80 Mã Đề Có Sẵn)', active: true },
                { id: 'cuoi-ky-1', label: 'Cuối HK1 (Chờ đề)', active: false },
                { id: 'giua-ky-2', label: 'Giữa HK2 (Chờ đề)', active: false },
                { id: 'cuoi-ky-2', label: 'Cuối HK2 (Chờ đề)', active: false }
              ].map(term => (
                <button
                  key={term.id}
                  type="button"
                  onClick={() => {
                    setExamType(term.id as any);
                    setSelectedExamIndex(0);
                  }}
                  className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer text-center active:scale-95 ${
                    examType === term.id
                      ? 'bg-sky-500 text-white shadow-xs ring-2 ring-white/60'
                      : 'bg-black/30 text-sky-200 hover:bg-black/50'
                  }`}
                >
                  {term.label}
                </button>
              ))}
            </div>
          </div>

          {/* DÒNG 3: BẢNG 20 MÃ ĐỀ THI - MOBILE FIRST 5 CỘT GỌN GÀNG DỄ CHẠM */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <span className="text-xs sm:text-sm font-black text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {hasOfficialForCurrent 
                  ? `3. Chọn 1 trong 20 mã đề ôn luyện (Khối ${selectedGrade}):`
                  : 'Mã đề thi:'}
              </span>
              <span className="text-xs sm:text-sm text-amber-300 font-bold">
                {hasOfficialForCurrent ? `Đang làm: Mã ${currentAvailableCodes[selectedExamIndex % currentAvailableCodes.length]}` : ''}
              </span>
            </div>

            {hasOfficialForCurrent ? (
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2">
                {currentAvailableCodes.map((codeStr, idx) => {
                  const isSelected = selectedExamIndex === idx;
                  return (
                    <button
                      key={codeStr}
                      type="button"
                      onClick={() => setSelectedExamIndex(idx)}
                      className={`h-9 sm:h-10 rounded-lg sm:rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center active:scale-90 ${
                        isSelected
                          ? 'bg-emerald-400 text-blue-950 ring-2 sm:ring-4 ring-white shadow-lg font-black scale-105'
                          : 'bg-white/15 text-white hover:bg-white/25 hover:scale-102'
                      }`}
                      title={`Làm bài Mã đề ${codeStr}`}
                    >
                      {codeStr}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs sm:text-sm text-amber-200 bg-amber-500/20 p-3 rounded-xl border border-amber-400/30">
                Chưa có đề thi cho mục này — Hệ thống sẵn sàng tiếp nhận thêm file Word mới!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* THANH TRẠNG THÁI & TIẾN ĐỘ THỜI GIAN THỰC (STICKY MOBILE ACCESSIBLE) */}
      {currentExam && (
        <div className="sticky top-2 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-md border border-slate-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 text-xs sm:text-sm font-black shrink-0">
              Lớp {currentExam.grade} • {currentExam.examCode}
            </span>
            <div className="text-xs sm:text-sm text-slate-700 truncate">
              Đã làm: <strong className="text-blue-700 font-black">{answeredCount}</strong> / {currentExam.totalQuestions} câu
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {currentExam.audioUrl && (
              <button
                type="button"
                onClick={handleTogglePlayAudio}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer transition shadow-xs ${
                  isPlayingAudio
                    ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                    : 'bg-sky-600 hover:bg-sky-700 text-white'
                }`}
                title={isPlayingAudio ? "Tạm dừng bài nghe" : "Bật bài nghe"}
              >
                {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden xs:inline">{isPlayingAudio ? "Dừng nghe" : "Bật nghe"}</span>
              </button>
            )}

            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmitExam}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-black text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center gap-1 active:scale-95"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Nộp bài</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleResetExam}
                className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition cursor-pointer flex items-center gap-1"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Làm lại</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* NỘI DUNG CHÍNH: NẾU CHƯA CÓ ĐỀ THÌ HIỂN THỊ KHUNG CHỜ */}
      {!currentExam ? (
        <div className="bg-white rounded-3xl p-6 sm:p-12 text-center border-2 border-dashed border-sky-300 shadow-sm space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-inner">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div className="max-w-xl mx-auto space-y-2">
            <h3 className="text-lg sm:text-xl font-black text-slate-800">
              Đang Chờ Cập Nhật Đề Kiểm Tra Cho Mục Này
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Toàn bộ 80 mã đề chính thức Giữa Học Kỳ 1 (Lớp 6, 7, 8, 9) đã sẵn sàng để học sinh luyện làm bài và chấm điểm tự động.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
            {[6, 7, 8, 9].map(g => (
              <button
                key={g}
                type="button"
                onClick={() => { setSelectedGrade(g); setExamType('giua-ky-1'); setSelectedExamIndex(0); }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
              >
                👉 Làm Đề Lớp {g} (20 Mã Đề)
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* GIAO DIỆN LÀM BÀI THI CHÍNH THỨC - MOBILE FIRST */
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* HEADER BÀI KIỂM TRA */}
          <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">
                    TRƯỜNG THCS ĐỒNG YÊN — NĂM HỌC 2026 - 2027
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] sm:text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                    CHUẨN BGD&ĐT (CV 7991)
                  </span>
                </div>
                <h3 className="text-lg sm:text-2xl font-black text-slate-800 mt-1 uppercase leading-tight">
                  {currentExam.typeTitle}
                </h3>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600 mt-1 flex-wrap">
                  <span>Thời gian: <strong>{currentExam.durationMinutes} phút</strong></span>
                  <span>•</span>
                  <span>Tổng: <strong>{currentExam.totalQuestions} câu</strong></span>
                  <span>•</span>
                  <span>Tác giả: <strong>Thầy Đinh Văn Thành</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-3.5 py-1.5 sm:py-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-center shadow-2xs">
                  <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-sky-700">MÃ ĐỀ THI</div>
                  <div className="text-base sm:text-lg font-black text-sky-900">{currentExam.examCode}</div>
                </div>

                <button
                  type="button"
                  onClick={handleResetExam}
                  className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition flex items-center gap-1 cursor-pointer"
                  title="Làm lại đề này từ đầu"
                >
                  <RotateCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Làm Lại</span>
                </button>
              </div>
            </div>
          </div>

          {/* KHUNG THÔNG BÁO KẾT QUẢ & CÔNG BỐ ĐIỂM SAU KHI NỘP BÀI */}
          {isSubmitted && scoreResult && (
            <div id="exam-result-banner" className={`p-4 sm:p-6 m-3 sm:m-6 rounded-2xl sm:rounded-3xl border text-white shadow-xl ${
              scoreResult.score >= 8.0 
                ? 'bg-gradient-to-br from-emerald-600 via-teal-700 to-green-800 border-emerald-400' 
                : scoreResult.score >= 6.5
                ? 'bg-gradient-to-br from-blue-600 via-indigo-700 to-sky-800 border-blue-400'
                : 'bg-gradient-to-br from-amber-600 via-orange-700 to-red-800 border-amber-400'
            }`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 w-full sm:w-auto">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
                    <Trophy className="w-9 h-9 text-amber-300" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white/90">
                      KẾT QUẢ ĐÃ ĐƯỢC VÀO SỔ ĐIỂM
                    </div>
                    <div className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                      {scoreResult.score} / 10.0 Điểm
                    </div>
                    <div className="text-xs sm:text-sm text-white/95 flex items-center gap-2 flex-wrap">
                      <span>✓ Đúng: <strong>{scoreResult.correctCount}</strong> câu</span>
                      <span>•</span>
                      <span>✗ Sai: <strong>{scoreResult.wrongCount}</strong> câu</span>
                      {scoreResult.skippedCount > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-amber-200 font-bold">⚠️ Bỏ qua: {scoreResult.skippedCount} câu</span>
                        </>
                      )}
                      <span>•</span>
                      <span>Xếp loại: <strong className="underline text-amber-200 font-extrabold">{scoreResult.rankLevel === 'GIOI' ? 'Giỏi 🌟' : scoreResult.rankLevel === 'KHA' ? 'Khá 👍' : 'Đạt'}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {onGoToLeaderboard && (
                    <button
                      type="button"
                      onClick={onGoToLeaderboard}
                      className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white text-slate-900 font-black text-xs sm:text-sm hover:bg-amber-300 transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>Xem Sổ Điểm Lớp</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleResetExam}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-black/20 hover:bg-black/30 text-white font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>Làm Lại Đề Này</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* KHUNG PHÁT AUDIO BÀI NGHE CHUẨN ĐÃ LỌC SẠCH KHÔNG TẠP ÂM - MOBILE OPTIMIZED */}
          {currentExam.audioUrl && (
            <div className="mx-3 sm:mx-6 mt-4 p-4 rounded-2xl bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 border border-sky-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-700 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Headphones className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-black text-sky-950 flex items-center gap-2 flex-wrap">
                      <span>AUDIO BÀI NGHE CHÍNH THỨC</span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold">
                        1 Giọng Nam + 1 Giọng Nữ
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-sky-800 leading-snug mt-0.5">
                      Giọng bản ngữ đọc chậm, phát âm từng từ rõ ràng • Lặp lại 2 lần có khoảng nghỉ
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center bg-white rounded-xl border border-sky-200 p-0.5 text-xs font-bold">
                    <span className="px-2 text-slate-500">Tốc độ:</span>
                    <button
                      type="button"
                      onClick={() => handleChangePlaybackRate(0.85)}
                      className={`px-2.5 py-1 rounded-lg transition ${playbackSpeed === 0.85 ? 'bg-sky-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                    >
                      0.85x Chậm
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChangePlaybackRate(1.0)}
                      className={`px-2.5 py-1 rounded-lg transition ${playbackSpeed === 1.0 ? 'bg-sky-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                    >
                      1.0x Chuẩn
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAudioScript(!showAudioScript)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-sky-300 text-sky-800 hover:bg-sky-100 font-bold text-xs sm:text-sm transition cursor-pointer flex items-center gap-1"
                  >
                    <span>{showAudioScript ? 'Ẩn lời băng' : 'Xem lời băng'}</span>
                    {showAudioScript ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* TRÌNH PHÁT AUDIO NATIVE HTML5 - TƯƠNG THÍCH 100% ĐIỆN THOẠI & IPHONE */}
              <div className="pt-1">
                <audio 
                  ref={audioRef}
                  controls 
                  preload="metadata"
                  src={currentExam.audioUrl} 
                  onPlay={() => setIsPlayingAudio(true)}
                  onPause={() => setIsPlayingAudio(false)}
                  onEnded={() => setIsPlayingAudio(false)}
                  className="w-full h-11 rounded-xl shadow-xs"
                />
              </div>

              {/* Lời băng nghe Script */}
              {showAudioScript && currentExam.audioScript && (
                <div className="mt-2 pt-3 border-t border-sky-200 text-xs sm:text-sm text-slate-700 bg-white p-4 rounded-xl whitespace-pre-line font-mono leading-relaxed shadow-inner">
                  {currentExam.audioScript}
                </div>
              )}
            </div>
          )}

          {/* DANH SÁCH CÂU HỎI THEO TỪNG PHẦN - CHỮ TO RÕ RÀNG */}
          <div className="p-3.5 sm:p-6 space-y-6 sm:space-y-8">
            {['A', 'B', 'C', 'D'].map((partKey) => {
              const partQuestions = currentExam.questions.filter(q => q.part === partKey);
              if (partQuestions.length === 0) return null;

              const firstQ = partQuestions[0];

              return (
                <div key={partKey} className="space-y-3 sm:space-y-4">
                  {/* Tiêu đề Part */}
                  <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between gap-2">
                    <div>
                      <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                        {firstQ.partTitle}
                      </h4>
                      <div className="text-xs sm:text-sm text-slate-600 italic mt-0.5">
                        {firstQ.partInstruction}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-white text-slate-800 font-extrabold text-xs sm:text-sm border border-slate-200 shadow-2xs shrink-0">
                      {partQuestions.length} câu
                    </span>
                  </div>

                  {/* Đoạn văn đọc hiểu nếu có ở Part C */}
                  {partKey === 'C' && currentExam.passageText && (
                    <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-amber-50/80 border border-amber-200 text-xs sm:text-base leading-relaxed text-slate-800 shadow-2xs">
                      <div className="font-black text-amber-900 mb-1.5 flex items-center gap-1.5 text-sm sm:text-base">
                        <BookOpen className="w-4 h-4 text-amber-700" />
                        <span>VĂN BẢN ĐỌC HIỂU (READING PASSAGE & CLOZE TEXT):</span>
                      </div>
                      <div className="whitespace-pre-line font-medium text-slate-700 mt-2 font-sans leading-relaxed">
                        {currentExam.passageText}
                      </div>
                    </div>
                  )}

                  {/* Danh sách các câu hỏi trong Part */}
                  <div className="space-y-3 sm:space-y-4">
                    {partQuestions.map((q) => {
                      const userAns = (userAnswers[q.id] || '').trim().toLowerCase();
                      const rightAns = (q.correct || '').trim().toLowerCase();
                      const isAnswered = Boolean(userAns && userAns.length > 0);

                      let isCorrect = false;
                      if (isAnswered) {
                        if (userAns === rightAns) {
                          isCorrect = true;
                        } else if (q.options) {
                          const userIdx = q.options.findIndex(o => o.trim().toLowerCase() === userAns);
                          const rightIdx = q.options.findIndex(o => o.trim().toLowerCase() === rightAns);
                          if (userIdx !== -1 && userIdx === rightIdx) {
                            isCorrect = true;
                          } else if (q.correctLetter && userAns === q.correctLetter.toLowerCase()) {
                            isCorrect = true;
                          }
                        }
                      }

                      // Trạng thái câu hỏi: Correct, Wrong, hoặc Skipped
                      const isSkipped = isSubmitted && !isAnswered;
                      const isWrong = isSubmitted && isAnswered && !isCorrect;

                      return (
                        <div
                          key={q.id}
                          className={`p-3.5 sm:p-5 rounded-2xl border transition-all ${
                            isSubmitted
                              ? isCorrect
                                ? 'bg-emerald-50/70 border-emerald-400 shadow-xs'
                                : isSkipped
                                ? 'bg-amber-50/70 border-amber-400 shadow-xs'
                                : 'bg-red-50/70 border-red-400 shadow-xs'
                              : 'bg-white hover:border-sky-300 border-slate-200 shadow-2xs'
                          }`}
                        >
                          {/* DÒNG CÂU HỎI & HUY HIỆU TRẠNG THÁI */}
                          <div className="flex items-start justify-between gap-2.5">
                            <div className="flex items-start gap-2.5 text-base sm:text-lg text-slate-900 font-semibold">
                              <span className="font-black text-sky-800 shrink-0">
                                Câu {q.qNumber}:
                              </span>
                              <span className="leading-snug">{q.text}</span>
                            </div>

                            {/* HUY HIỆU ĐÁNH GIÁ ĐÚNG / SAI / BỎ QUA RÕ RÀNG */}
                            {isSubmitted && (
                              <div className="shrink-0">
                                {isCorrect && (
                                  <span className="px-2.5 py-1 rounded-lg text-xs sm:text-sm font-black bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
                                    <Check className="w-4 h-4" />
                                    <span>ĐÚNG (+0.25đ)</span>
                                  </span>
                                )}
                                {isWrong && (
                                  <span className="px-2.5 py-1 rounded-lg text-xs sm:text-sm font-black bg-red-600 text-white flex items-center gap-1 shadow-xs">
                                    <XCircle className="w-4 h-4" />
                                    <span>SAI (0đ)</span>
                                  </span>
                                )}
                                {isSkipped && (
                                  <span className="px-2.5 py-1 rounded-lg text-xs sm:text-sm font-black bg-amber-500 text-white flex items-center gap-1 shadow-xs">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>BỎ QUA (0đ)</span>
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* THÔNG BÁO CHO CÂU BỎ QUA */}
                          {isSkipped && (
                            <div className="mt-2.5 p-2.5 rounded-xl bg-amber-100/90 border border-amber-300 text-xs sm:text-sm text-amber-900 font-bold flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                              <span>Em chưa làm câu này (0 điểm). Hãy xem đáp án đúng và lời giải chi tiết bên dưới:</span>
                            </div>
                          )}

                          {/* CÁC LỰA CHỌN TRẮC NGHIỆM - NÚT TO RÕ CHUẨN ĐIỆN THOẠI (min-h-[50px]) */}
                          {q.options && q.options.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 mt-3 sm:mt-4">
                              {q.options.map((opt, optIdx) => {
                                const letters = ['A', 'B', 'C', 'D'];
                                const letter = letters[optIdx] || 'A';
                                
                                const isOptSelected = userAns === opt.trim().toLowerCase() || userAns === letter.toLowerCase();
                                const isOptRight = isSubmitted && (
                                  opt.trim().toLowerCase() === q.correct.toLowerCase() || 
                                  (q.correctLetter && letter.toLowerCase() === q.correctLetter.toLowerCase())
                                );

                                return (
                                  <button
                                    key={optIdx}
                                    type="button"
                                    disabled={isSubmitted}
                                    onClick={() => handleSelectAnswer(q.id, letter.toLowerCase())}
                                    className={`p-3 sm:p-3.5 rounded-xl text-left text-sm sm:text-base font-semibold border transition flex items-center gap-3 cursor-pointer min-h-[50px] sm:min-h-[54px] active:scale-[0.99] ${
                                      isOptSelected
                                        ? isSubmitted
                                          ? isOptRight
                                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-md font-bold'
                                            : 'bg-red-600 text-white border-red-700 shadow-md font-bold'
                                          : 'bg-sky-600 text-white border-sky-700 font-bold shadow-md ring-2 ring-sky-300'
                                        : isOptRight
                                        ? 'bg-emerald-100 text-emerald-950 border-2 border-emerald-500 font-extrabold shadow-sm'
                                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                                    }`}
                                  >
                                    <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-black shrink-0 ${
                                      isOptSelected 
                                        ? 'bg-white text-slate-900 shadow-xs' 
                                        : isOptRight 
                                        ? 'bg-emerald-600 text-white shadow-xs' 
                                        : 'bg-slate-200 text-slate-700'
                                    }`}>
                                      {letter}
                                    </span>
                                    <span className="flex-1 leading-snug">
                                      {opt}
                                      {isOptRight && (
                                        <strong className="block text-xs font-black text-emerald-700 sm:inline sm:ml-1.5">
                                          (✓ Đáp án đúng)
                                        </strong>
                                      )}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* LỜI GIẢI & CHỮA BÀI CHI TIẾT TỪNG CÂU 1 (HIỂN THỊ CHO TẤT CẢ CÂU: ĐÚNG, SAI VÀ BỎ QUA!) */}
                          {isSubmitted && (
                            <div className="mt-3.5 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-50 border border-amber-300/80 text-xs sm:text-base text-amber-950 flex items-start gap-2.5 shadow-2xs">
                              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                              <div className="leading-relaxed flex-1">
                                <span className="font-extrabold text-amber-900 block mb-1 text-sm sm:text-base">
                                  📖 Lời giải & Chữa bài chi tiết:
                                </span>
                                <div className="text-slate-800">
                                  {q.explanation ? (
                                    <span>{q.explanation}</span>
                                  ) : (
                                    <span>
                                      Đáp án đúng chính xác là <strong>{q.correctLetter || q.correct}</strong>. Căn cứ vào quy tắc ngữ pháp và từ vựng trọng tâm trong chương trình GDPT 2018.
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* PHẦN E: VIẾT ĐOẠN VĂN (WRITING PRODUCTION) */}
            {currentExam.sampleWriting && (
              <div className="space-y-3 pt-2">
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      Part 8. Writing Production: Viết đoạn văn tiếng Anh (1.0 điểm)
                    </h4>
                    <div className="text-xs sm:text-sm text-slate-600 italic mt-0.5">
                      Write a short paragraph of about 60 - 80 words about the topic.
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-white text-slate-800 font-extrabold text-xs sm:text-sm border border-slate-200">
                    1.0 điểm
                  </span>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                  <textarea
                    rows={5}
                    disabled={isSubmitted}
                    value={userAnswers['writing_essay'] || ''}
                    onChange={(e) => handleSelectAnswer('writing_essay', e.target.value)}
                    placeholder="Em hãy nhập bài viết đoạn văn tiếng Anh của mình vào đây (khoảng 60 - 80 từ)..."
                    className="w-full p-3.5 sm:p-4 rounded-xl border border-slate-300 text-sm sm:text-base text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 leading-relaxed font-sans"
                  />

                  {currentExam.writingRubric && (
                    <div className="text-xs sm:text-sm text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <strong>Tiêu chí chấm điểm:</strong> {currentExam.writingRubric}
                    </div>
                  )}

                  {isSubmitted && (
                    <div className="mt-3 p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs sm:text-base leading-relaxed text-slate-800">
                      <span className="font-black text-blue-900 block mb-1.5 text-sm sm:text-base">
                        🌟 Đoạn văn mẫu tham khảo đạt điểm tối đa (1.0đ):
                      </span>
                      {currentExam.sampleWriting}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* CHÂN TRANG: NÚT NỘP BÀI HOẶC LÀM LẠI - TO RÕ DỄ BẤM */}
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-slate-600">
              Đã làm: <strong className="text-blue-700 text-base">{answeredCount}</strong> / {currentExam.totalQuestions} câu hỏi
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {!isSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitExam}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-base shadow-lg transition cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <Award className="w-5 h-5" />
                  <span>Nộp Bài & Chấm Điểm Ngay</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleResetExam}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white font-black text-base shadow-lg transition cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <RotateCw className="w-5 h-5" />
                  <span>Làm Lại Đề Này</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
