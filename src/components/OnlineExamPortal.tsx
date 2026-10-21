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
  UploadCloud
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
    total: number;
    rankLevel: string;
    scaledScore: number;
  } | null>(null);

  const [isPlayingMainAudio, setIsPlayingMainAudio] = useState<boolean>(false);
  const [showAudioScript, setShowAudioScript] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const student = studentGradebookService.getActiveStudent();
    setActiveStudent(student);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingMainAudio(false);
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    buildExam(selectedGrade, examType, selectedExamIndex);
  }, [selectedGrade, examType, selectedExamIndex]);

  // Hủy âm thanh khi unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  };

  const toggleMainAudio = (url?: string, scriptText?: string) => {
    if (isPlayingMainAudio) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingMainAudio(false);
      return;
    }

    if (url) {
      if (!audioRef.current) {
        audioRef.current = new Audio(url);
        audioRef.current.onended = () => setIsPlayingMainAudio(false);
        audioRef.current.onerror = () => {
          if (scriptText) speakText(scriptText);
        };
      } else {
        audioRef.current.src = url;
      }
      audioRef.current.play().then(() => {
        setIsPlayingMainAudio(true);
      }).catch(() => {
        if (scriptText) speakText(scriptText);
        setIsPlayingMainAudio(true);
      });
    } else if (scriptText) {
      speakText(scriptText);
      setIsPlayingMainAudio(true);
    }
  };

  // NẠP ĐỀ KIỂM TRA CHÍNH THỨC - ĐÃ GỠ BỎ TOÀN BỘ ĐỀ TỰ SINH
  const buildExam = (grade: number, type: string, examIdx: number) => {
    setIsSubmitted(false);
    setUserAnswers({});
    setScoreResult(null);
    setShowAudioScript(false);

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
            typeTitle: 'BÀI KIỂM TRA ĐÁNH GIÁ GIỮA HỌC KỲ I (CHÍNH THỨC)',
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

    // NẾU CHƯA CÓ ĐỀ CHÍNH THỨC CHO MỤC NÀY: XÓA ĐỀ TỰ ĐỘNG, CHỜ THẦY CUNG CẤP ĐỀ
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

    currentExam.questions.forEach(q => {
      const userAns = (userAnswers[q.id] || '').trim().toLowerCase();
      const rightAns = (q.correct || '').trim().toLowerCase();

      if (q.type === 'essay') {
        const words = (userAnswers[q.id] || '').trim().match(/\S+/g) || [];
        if (words.length >= 15) {
          correctCount++;
        }
      } else if (userAns === rightAns) {
        correctCount++;
      } else if (q.options) {
        const userIdx = q.options.findIndex(o => o.trim().toLowerCase() === userAns);
        const rightIdx = q.options.findIndex(o => o.trim().toLowerCase() === rightAns);
        if (userIdx !== -1 && userIdx === rightIdx) {
          correctCount++;
        } else if (q.correctLetter && userAns === q.correctLetter.toLowerCase()) {
          correctCount++;
        }
      }
    });

    const scaledScore = Math.round((correctCount / currentExam.questions.length) * 100) / 10;
    let rankLevel = 'DAT';
    if (scaledScore >= 8.0) rankLevel = 'GIOI';
    else if (scaledScore >= 6.5) rankLevel = 'KHA';

    setScoreResult({
      score: scaledScore,
      correctCount,
      total: currentExam.questions.length,
      rankLevel,
      scaledScore
    });
    setIsSubmitted(true);

    if (activeStudent) {
      studentGradebookService.saveExamResult(activeStudent.id, {
        examTitle: `${currentExam.typeTitle} - Lớp ${currentExam.grade} (${currentExam.examCode})`,
        score: scaledScore,
        correctCount,
        totalQuestions: currentExam.questions.length,
        durationMinutes: currentExam.durationMinutes,
        rankLevel
      });
    }

    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleResetExam = () => {
    buildExam(selectedGrade, examType, selectedExamIndex);
  };

  // Kiểm tra khối lớp & đợt thi hiện tại có đề chính thức không
  const hasOfficialForCurrent = examType === 'giua-ky-1' && (selectedGrade === 6 || selectedGrade === 8);
  const currentAvailableCodes = hasOfficialForCurrent 
    ? (selectedGrade === 6 ? ['601', '602', '603', '604', '605', '606'] : ['801', '802', '803', '804', '805', '806'])
    : [];

  return (
    <div className="space-y-6">
      {/* BANNER ĐIỀU KHIỂN & CHỌN ĐỀ CHÍNH THỨC */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-amber-400 text-blue-950 text-xs font-black tracking-wide uppercase shadow-xs">
                CHUẨN BỘ GD&ĐT (CV 7991)
              </span>
              <h2 className="text-lg md:text-xl font-black tracking-tight">
                ĐỀ KIỂM TRA GIỮA KỲ & CUỐI KỲ ONLINE
              </h2>
            </div>
            <div className="text-xs text-sky-200">
              Đầy đủ 4 kỹ năng: Nghe (1 nam, 1 nữ), Phát âm, Ngữ pháp, Đọc hiểu & Viết.
            </div>
          </div>

          {/* DÒNG 1: CHỌN KHỐI LỚP */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-sky-200 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Khối lớp:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { grade: 6, label: 'Lớp 6', count: '6 đề' },
                { grade: 7, label: 'Lớp 7', count: 'Chờ đề' },
                { grade: 8, label: 'Lớp 8', count: '6 đề' },
                { grade: 9, label: 'Lớp 9', count: 'Chờ đề' },
                { grade: 10, label: 'Lớp 10', count: 'Chờ đề' },
                { grade: 11, label: 'Lớp 11', count: 'Chờ đề' },
                { grade: 12, label: 'Lớp 12', count: 'Chờ đề' }
              ].map(({ grade, label, count }) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => {
                    setSelectedGrade(grade);
                    setSelectedExamIndex(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                    selectedGrade === grade
                      ? 'bg-amber-400 text-blue-950 shadow-md ring-2 ring-white/50 scale-105'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <span>{label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    grade === 6 || grade === 8
                      ? (selectedGrade === grade ? 'bg-blue-950 text-amber-300' : 'bg-emerald-500/80 text-white')
                      : 'bg-white/10 text-slate-300'
                  }`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* DÒNG 2: CHỌN ĐỢT THI & MÃ ĐỀ */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-white/10">
            {/* Đợt thi */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-sky-200">Đợt thi:</span>
              <div className="flex items-center gap-1">
                {[
                  { id: 'giua-ky-1', label: 'Giữa HK1' },
                  { id: 'cuoi-ky-1', label: 'Cuối HK1' },
                  { id: 'giua-ky-2', label: 'Giữa HK2' },
                  { id: 'cuoi-ky-2', label: 'Cuối HK2' }
                ].map(term => (
                  <button
                    key={term.id}
                    type="button"
                    onClick={() => {
                      setExamType(term.id as any);
                      setSelectedExamIndex(0);
                    }}
                    className={`px-2.5 py-1 rounded-md text-xs font-black transition cursor-pointer ${
                      examType === term.id
                        ? 'bg-sky-500 text-white shadow-xs'
                        : 'bg-black/20 text-sky-100 hover:bg-black/40'
                    }`}
                  >
                    {term.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chọn Mã Đề */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-emerald-300">
                {hasOfficialForCurrent 
                  ? `Chọn 1 trong 6 mã đề chuẩn (Khối ${selectedGrade}):`
                  : 'Mã đề thi:'}
              </span>
              <div className="flex items-center gap-1 flex-wrap">
                {hasOfficialForCurrent ? (
                  currentAvailableCodes.map((codeStr, idx) => (
                    <button
                      key={codeStr}
                      type="button"
                      onClick={() => setSelectedExamIndex(idx)}
                      className={`px-2.5 h-7 rounded-lg text-xs font-black transition cursor-pointer flex items-center justify-center ${
                        selectedExamIndex === idx
                          ? 'bg-emerald-400 text-blue-950 ring-2 ring-white shadow-sm'
                          : 'bg-white/15 text-white hover:bg-white/25'
                      }`}
                    >
                      Mã {codeStr}
                    </button>
                  ))
                ) : (
                  <span className="text-xs text-amber-200 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/30">
                    Chờ Thầy cung cấp đề thi mới
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NỘI DUNG CHÍNH: NẾU CHƯA CÓ ĐỀ CHÍNH THỨC THÌ HIỂN THỊ KHUNG THÔNG BÁO CHỜ TIẾP NHẬN */}
      {!currentExam ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border-2 border-dashed border-sky-300 shadow-sm space-y-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-inner">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div className="max-w-xl mx-auto space-y-2">
            <h3 className="text-xl font-black text-slate-800">
              Đang Chờ Cập Nhật Đề Kiểm Tra Chính Thức
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Các bài kiểm tra do hệ thống tự sinh trước đây đã được <strong>gỡ bỏ hoàn toàn</strong> theo yêu cầu. Hiện tại hệ thống đang chạy <strong>12 bộ đề kiểm tra chính thức Giữa Học Kỳ 1</strong> chuẩn Công văn 7991 (Khối 6: Mã 601 - 606 & Khối 8: Mã 801 - 806).
            </p>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium">
              💡 Thầy có thể cung cấp các file đề thi Word (.docx) mới cho Khối {selectedGrade} để đưa trực tiếp lên hệ thống bất kỳ lúc nào!
            </div>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => { setSelectedGrade(8); setExamType('giua-ky-1'); setSelectedExamIndex(0); }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-bold text-sm shadow-md transition cursor-pointer flex items-center gap-2"
            >
              <span>👉 Làm Đề Chính Thức Lớp 8 (Mã 801 - 806)</span>
            </button>
            <button
              type="button"
              onClick={() => { setSelectedGrade(6); setExamType('giua-ky-1'); setSelectedExamIndex(0); }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm shadow-md transition cursor-pointer flex items-center gap-2"
            >
              <span>👉 Làm Đề Chính Thức Lớp 6 (Mã 601 - 606)</span>
            </button>
          </div>
        </div>
      ) : (
        /* GIAO DIỆN LÀM BÀI THI CHÍNH THỨC */
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* HEADER BÀI KIỂM TRA */}
          <div className="p-5 md:p-6 bg-slate-50 border-b border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    TRƯỜNG THCS ĐỒNG YÊN — NĂM HỌC 2026 - 2027
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                    ĐỀ CHÍNH THỨC (CV 7991)
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-black text-slate-800 mt-1 uppercase">
                  {currentExam.typeTitle} — TIẾNG ANH LỚP {currentExam.grade}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                  <span>Thời gian làm bài: <strong>{currentExam.durationMinutes} phút</strong></span>
                  <span>•</span>
                  <span>Số lượng: <strong>{currentExam.totalQuestions} câu trắc nghiệm & tự luận + 1 bài viết</strong></span>
                  <span>•</span>
                  <span>Giáo viên ra đề: <strong>Thầy Đinh Văn Thành</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-sky-700">MÃ ĐỀ THI</div>
                  <div className="text-sm font-black">{currentExam.examCode}</div>
                </div>

                <button
                  type="button"
                  onClick={handleResetExam}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                  title="Làm lại đề này"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Làm Lại</span>
                </button>
              </div>
            </div>
          </div>

          {/* KHUNG THÔNG BÁO KẾT QUẢ SAU KHI NỘP BÀI */}
          {isSubmitted && scoreResult && (
            <div className={`p-5 m-5 md:m-6 rounded-2xl border text-white ${
              scoreResult.score >= 8.0 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 border-emerald-400' 
                : scoreResult.score >= 6.5
                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 border-blue-400'
                : 'bg-gradient-to-r from-amber-600 to-orange-700 border-amber-400'
            }`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                    <Trophy className="w-8 h-8 text-amber-300" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-white/80">KẾT QUẢ BÀI THI</div>
                    <div className="text-2xl font-black">
                      {scoreResult.score} / 10.0 Điểm
                    </div>
                    <div className="text-xs text-white/90">
                      Đúng {scoreResult.correctCount}/{scoreResult.total} câu ({Math.round((scoreResult.correctCount / scoreResult.total) * 100)}%) — Xếp loại: <strong className="underline">{scoreResult.rankLevel === 'GIOI' ? 'Giỏi' : scoreResult.rankLevel === 'KHA' ? 'Khá' : 'Đạt'}</strong>
                    </div>
                  </div>
                </div>

                {onGoToLeaderboard && (
                  <button
                    type="button"
                    onClick={onGoToLeaderboard}
                    className="px-4 py-2 rounded-xl bg-white text-slate-900 font-black text-xs hover:bg-amber-300 transition cursor-pointer shadow-md shrink-0 flex items-center gap-1.5"
                  >
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Xem Bảng Vàng Lớp</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* KHUNG PHÁT AUDIO BÀI NGHE MULTI-VOICE (1 NAM, 1 NỮ) */}
          {currentExam.audioUrl && (
            <div className="mx-5 md:mx-6 mt-5 p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border border-sky-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-sky-950 flex items-center gap-1.5">
                      <span>AUDIO BÀI NGHE CHÍNH THỨC (1 GIỌNG NAM, 1 GIỌNG NỮ)</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-sky-200 text-sky-800 font-bold">Chuẩn bản ngữ</span>
                    </div>
                    <div className="text-xs text-sky-700">
                      Hội thoại giữa {currentExam.grade === 6 ? 'Linda (Nữ) & Peter (Nam)' : 'Jason (Nam) & Hannah (Nữ)'} • Có chuông báo & đọc lại 2 lần
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleMainAudio(currentExam.audioUrl, currentExam.audioScript)}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {isPlayingMainAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlayingMainAudio ? 'Tạm Dừng Audio' : 'Bắt Đầu Nghe Audio'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAudioScript(!showAudioScript)}
                    className="px-3 py-2 rounded-xl bg-white border border-sky-300 text-sky-800 hover:bg-sky-100 font-bold text-xs transition cursor-pointer"
                  >
                    {showAudioScript ? 'Ẩn Lời Băng' : 'Xem Lời Băng Nghe'}
                  </button>
                </div>
              </div>

              {/* Lời băng nghe Script */}
              {showAudioScript && currentExam.audioScript && (
                <div className="mt-3 pt-3 border-t border-sky-200 text-xs text-slate-700 bg-white p-3.5 rounded-xl whitespace-pre-line font-mono leading-relaxed shadow-inner">
                  {currentExam.audioScript}
                </div>
              )}
            </div>
          )}

          {/* DANH SÁCH CÂU HỎI THEO TỪNG PART */}
          <div className="p-5 md:p-6 space-y-6">
            {['A', 'B', 'C', 'D'].map((partKey) => {
              const partQuestions = currentExam.questions.filter(q => q.part === partKey);
              if (partQuestions.length === 0) return null;

              const firstQ = partQuestions[0];

              return (
                <div key={partKey} className="space-y-4">
                  {/* Tiêu đề Part */}
                  <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 tracking-tight">
                        {firstQ.partTitle}
                      </h4>
                      <div className="text-xs text-slate-600 italic mt-0.5">
                        {firstQ.partInstruction}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-white text-slate-700 font-bold text-xs border border-slate-200 shadow-2xs">
                      {partQuestions.length} câu
                    </span>
                  </div>

                  {/* Đoạn văn đọc hiểu nếu có ở Part C */}
                  {partKey === 'C' && currentExam.passageText && (
                    <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs leading-relaxed text-slate-800">
                      <div className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                        <span>ĐOẠN VĂN ĐỌC HIỂU (READING PASSAGE):</span>
                      </div>
                      <div className="whitespace-pre-line font-medium text-slate-700 mt-2">
                        {currentExam.passageText}
                      </div>
                    </div>
                  )}

                  {/* Danh sách các câu hỏi trong Part */}
                  <div className="space-y-3">
                    {partQuestions.map((q) => {
                      const userAns = (userAnswers[q.id] || '').trim().toLowerCase();
                      const rightAns = (q.correct || '').trim().toLowerCase();
                      const isCorrect = userAns === rightAns || (q.correctLetter && userAns === q.correctLetter.toLowerCase());

                      return (
                        <div
                          key={q.id}
                          className={`p-4 rounded-xl border transition ${
                            isSubmitted
                              ? isCorrect
                                ? 'bg-emerald-50/60 border-emerald-300'
                                : 'bg-red-50/60 border-red-300'
                              : 'bg-white hover:border-sky-300 border-slate-200 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2 text-sm text-slate-900 font-medium">
                              <span className="font-black text-sky-800 shrink-0">
                                Câu {q.qNumber}:
                              </span>
                              <span className="leading-relaxed">{q.text}</span>
                            </div>

                            {isSubmitted && (
                              <span className={`px-2 py-0.5 rounded text-xs font-black shrink-0 ${
                                isCorrect ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                              }`}>
                                {isCorrect ? 'Đúng' : 'Sai'}
                              </span>
                            )}
                          </div>

                          {/* Các lựa chọn Trắc nghiệm */}
                          {q.options && q.options.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                              {q.options.map((opt, optIdx) => {
                                const letters = ['A', 'B', 'C', 'D'];
                                const letter = letters[optIdx] || 'A';
                                const isOptSelected = userAns === opt.trim().toLowerCase() || userAns === letter.toLowerCase();
                                const isOptRight = isSubmitted && (opt.trim().toLowerCase() === q.correct.toLowerCase() || (q.correctLetter && letter === q.correctLetter));

                                return (
                                  <button
                                    key={optIdx}
                                    type="button"
                                    disabled={isSubmitted}
                                    onClick={() => handleSelectAnswer(q.id, letter.toLowerCase())}
                                    className={`p-2.5 rounded-lg text-left text-xs font-medium border transition flex items-center gap-2 cursor-pointer ${
                                      isOptSelected
                                        ? isSubmitted
                                          ? isOptRight
                                            ? 'bg-emerald-500 text-white border-emerald-600 font-bold'
                                            : 'bg-red-500 text-white border-red-600 font-bold'
                                          : 'bg-sky-600 text-white border-sky-700 font-bold shadow-xs'
                                        : isOptRight
                                        ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold'
                                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                                    }`}
                                  >
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                                      isOptSelected ? 'bg-white text-slate-900' : 'bg-slate-200 text-slate-700'
                                    }`}>
                                      {letter}
                                    </span>
                                    <span className="flex-1">{opt}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* Nhập từ cho bài viết lại câu / tự luận ngắn */}
                          {(!q.options || q.options.length === 0) && (
                            <div className="mt-3">
                              <input
                                type="text"
                                disabled={isSubmitted}
                                value={userAnswers[q.id] || ''}
                                onChange={(e) => handleSelectAnswer(q.id, e.target.value)}
                                placeholder="Nhập câu trả lời của em vào đây..."
                                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                              />
                            </div>
                          )}

                          {/* Lời giải thích khi đã nộp bài */}
                          {isSubmitted && q.explanation && (
                            <div className="mt-2.5 pt-2 border-t border-slate-200 text-xs text-slate-600 flex items-start gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                              <span>{q.explanation}</span>
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
                <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 tracking-tight">
                      Part 8. Writing Production (Viết đoạn văn theo chủ đề - 1.0 điểm)
                    </h4>
                    <div className="text-xs text-slate-600 italic mt-0.5">
                      Write a paragraph of about 50 - 60 words about your school or your favorite hobby.
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-white text-slate-700 font-bold text-xs border border-slate-200">
                    1.0 điểm
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <textarea
                    rows={4}
                    disabled={isSubmitted}
                    value={userAnswers['writing_essay'] || ''}
                    onChange={(e) => handleSelectAnswer('writing_essay', e.target.value)}
                    placeholder="Em hãy nhập bài viết đoạn văn tiếng Anh của mình vào đây (khoảng 50 - 60 từ)..."
                    className="w-full p-3 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 leading-relaxed font-sans"
                  />

                  {currentExam.writingRubric && (
                    <div className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <strong>Tiêu chí chấm điểm:</strong> {currentExam.writingRubric}
                    </div>
                  )}

                  {isSubmitted && (
                    <div className="mt-3 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs leading-relaxed text-slate-800">
                      <span className="font-bold text-blue-900 block mb-1">
                        🌟 Đoạn văn mẫu tham khảo đạt điểm tối đa:
                      </span>
                      {currentExam.sampleWriting}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* CHÂN TRANG: NÚT NỘP BÀI HOẶC LÀM LẠI */}
          <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-wrap gap-3">
            <div className="text-xs text-slate-500">
              Đã làm: <strong>{Object.keys(userAnswers).length}</strong> / {currentExam.totalQuestions} câu hỏi
            </div>

            <div className="flex items-center gap-2">
              {!isSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitExam}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  <span>Nộp Bài & Chấm Điểm Ngay</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleResetExam}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white font-black text-sm shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  <RotateCw className="w-4 h-4" />
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
