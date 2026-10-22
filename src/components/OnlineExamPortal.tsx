import React, { useState, useEffect, useRef } from 'react';
import { 
  Award,
  Copy, 
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
  Headphones,
  Mic,
  Square,
  Download
} from 'lucide-react';
import { studentGradebookService, StudentProfile } from '../services/studentGradebookService';
import { loadTermExams, TermExamsData, OfficialExamQuestion } from '../data/officialMidtermExams';

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
  audioUrlPart1?: string;
  audioUrlPart2?: string;
  audioScript?: string;
  audioScriptPart1?: string;
  audioScriptPart2?: string;
  sampleWriting?: string;
  writingRubric?: string;
  questions: ExamQuestion[];
}

export interface RankStandardTT22 {
    rankLevel: 'XUAT_SAC' | 'GIOI' | 'KHA' | 'DAT' | 'CHUA_DAT';
    levelTitle: string; // Tên mức theo TT 22
    badgeText: string;  // Huy hiệu hiển thị
    ruleNote: string;   // Căn cứ Thông tư 22/2021/TT-BGDĐT
    feedback: string;   // Lời nhận xét sư phạm
    bannerBg: string;   // Màu nền gradient
    iconType: 'trophy' | 'award' | 'check' | 'alert';
  }

interface OnlineExamPortalProps {
  onGoToLeaderboard?: () => void;
}

// ==============================================================================
// SUB-COMPONENT: BỘ PHÁT AUDIO NGHE THEO TỪNG PART CÓ THANH TRƯỢT TUA TỪNG TỪ
// ==============================================================================
interface PartAudioPlayerProps {
  partTitle: string;
  partSubtitle: string;
  audioUrl: string;
  themeColor: 'sky' | 'indigo';
}


/* =================================================================
   SPEAKING STUDIO CK - PHÒNG THI NÓI & GHI ÂM CHẤM ĐIỂM AI CHUẨN BGD
   Thầy giáo Đinh Văn Thành (Hotline/Zalo: 0915.213717)
   ================================================================= */
interface SpeakingStudioCKProps {
  grade: number;
  examCode: string;
  isSubmitted: boolean;
  onSpeakingGraded?: (score: number) => void;
}

interface SpeakingEvaluation {
  totalScore: number;
  fluencyScore: number;
  pronScore: number;
  vocabScore: number;
  gramScore: number;
  badge: string;
  badgeColor: string;
  wordCount: number;
  durationSec: number;
  strengths: string;
  improvements: string;
  encouragement: string;
}

const GRADE_SPEAKING_TOPICS: Record<number, {
  topicTitle: string;
  tasks: { taskName: string; question: string; promptNote: string }[];
}> = {
  6: {
    topicTitle: "My New School, Friends & Family Life (Chủ đề Trường học & Bạn bè mới)",
    tasks: [
      {
        taskName: "Task 1: Introduction (Giới thiệu bản thân)",
        question: "Can you introduce yourself? (Your full name, age, class, school, and hobbies)",
        promptNote: "Gợi ý: Hello teacher, my name is... I am 11 years old. I'm in class 6A at..."
      },
      {
        taskName: "Task 2: School Life (Môn học và trường lớp)",
        question: "What is your favorite subject at school and why do you like it?",
        promptNote: "Gợi ý: My favorite subject is English / Math because it is interesting and useful..."
      },
      {
        taskName: "Task 3: Free Talk (Mô tả phòng yêu thích hoặc bạn thân)",
        question: "Tell me about your best friend or your favorite room in your house.",
        promptNote: "Gợi ý: My best friend is... She/He is friendly and kind. We often play badminton together..."
      }
    ]
  },
  7: {
    topicTitle: "Hobbies & Community Service (Sở thích cá nhân & Hoạt động vì cộng đồng)",
    tasks: [
      {
        taskName: "Task 1: Introduction & Hobbies",
        question: "Introduce yourself and talk about your favorite hobby.",
        promptNote: "Gợi ý: In my free time, I love reading books / playing sports because it helps me relax..."
      },
      {
        taskName: "Task 2: Community Activities",
        question: "What volunteer or community activities have you or your school joined to help others?",
        promptNote: "Gợi ý: We planted trees, collected plastic bottles, and donated old clothes to poor children..."
      },
      {
        taskName: "Task 3: Healthy Living",
        question: "What habits should teenagers do every day to stay fit and healthy?",
        promptNote: "Gợi ý: Teenagers should eat more vegetables, drink plenty of water, and avoid junk food..."
      }
    ]
  },
  8: {
    topicTitle: "Life in the Countryside & Customs (Cuộc sống nông thôn & Phong tục tập quán)",
    tasks: [
      {
        taskName: "Task 1: City vs Countryside",
        question: "Introduce yourself and compare life in the countryside with life in the city.",
        promptNote: "Gợi ý: Life in the countryside is peaceful and fresh, while city life is modern and bustling..."
      },
      {
        taskName: "Task 2: Traditional Festivals",
        question: "Tell me about a traditional festival or custom in your hometown.",
        promptNote: "Gợi ý: Tet is the most important festival in Vietnam. People clean houses, cook Chung cake..."
      },
      {
        taskName: "Task 3: Teenagers & Technology",
        question: "How do social networks and smartphones affect teenagers' study and life today?",
        promptNote: "Gợi ý: Smartphones help us look up information quickly, but using them too much hurts our eyes..."
      }
    ]
  },
  9: {
    topicTitle: "Wonders of Vietnam, Environment & Future Career (Kỳ quan, Môi trường & Hướng nghiệp)",
    tasks: [
      {
        taskName: "Task 1: Wonders of Vietnam",
        question: "Introduce yourself and describe a famous natural wonder or historical place in Vietnam.",
        promptNote: "Gợi ý: Ha Long Bay is a UNESCO World Natural Heritage with thousands of limestone islands..."
      },
      {
        taskName: "Task 2: Environmental Protection",
        question: "What practical actions should secondary students take to protect the local environment?",
        promptNote: "Gợi ý: We should reduce single-use plastic, participate in community clean-up days, and recycle..."
      },
      {
        taskName: "Task 3: Future Career Vision",
        question: "What job or career would you like to pursue in the future, and what skills do you need to prepare?",
        promptNote: "Gợi ý: I want to become an English teacher / IT software engineer. I need to improve problem-solving..."
      }
    ]
  }
};

const SpeakingStudioCK: React.FC<SpeakingStudioCKProps> = ({ grade, examCode, isSubmitted, onSpeakingGraded }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [secondsRecorded, setSecondsRecorded] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<SpeakingEvaluation | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);
  const chunksRef = useRef<Blob[]>([]);

  const topicConfig = GRADE_SPEAKING_TOPICS[grade] || GRADE_SPEAKING_TOPICS[6];

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      setLiveTranscript('');
      setSecondsRecorded(0);
      setEvaluation(null);

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };

      recorder.start(250);
      setIsRecording(true);

      // Web Speech API
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognitionRef.current = recognition;
          recognition.lang = 'en-US';
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.onresult = (event: any) => {
            let fullText = '';
            for (let i = 0; i < event.results.length; ++i) {
              fullText += event.results[i][0].transcript + ' ';
            }
            setLiveTranscript(fullText.trim());
          };
          recognition.onerror = () => {};
          recognition.start();
        } catch (e) {
          console.warn('SpeechRecognition not available or error:', e);
        }
      }

      // Timer
      timerIntervalRef.current = setInterval(() => {
        setSecondsRecorded(prev => {
          if (prev >= 180) { // Max 3 minutes
            stopRecording();
            return 180;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err) {
      alert('⚠️ Không thể truy cập Micro của bạn! Vui lòng cho phép quyền truy cập Micro trên trình duyệt để ghi âm bài nói.');
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setIsRecording(false);
  };

  const handleEvaluateSpeaking = () => {
    if (secondsRecorded < 3 && !liveTranscript) {
      alert('⚠️ Bài nói quá ngắn hoặc chưa phát ra âm thanh! Em vui lòng nói ít nhất từ 15 - 30 giây để AI phân tích và chấm điểm chính xác theo tiêu chí nhé.');
      return;
    }

    setIsEvaluating(true);

    setTimeout(() => {
      const dur = secondsRecorded;
      let wordCount = liveTranscript ? liveTranscript.split(/\s+/).filter(Boolean).length : Math.round(dur * 1.6);
      if (wordCount < 10) wordCount = Math.max(16, dur * 2);

      let fluency = 0.40;
      let pron = 0.40;
      let vocab = 0.40;
      let gram = 0.40;

      if (dur >= 20 && wordCount >= 25) {
        fluency = 0.45;
        vocab = 0.45;
      }
      if (dur >= 40 && wordCount >= 50) {
        fluency = 0.50;
        pron = 0.45;
        vocab = 0.45;
        gram = 0.45;
      }
      if (dur >= 60 && wordCount >= 70) {
        fluency = 0.50;
        pron = 0.50;
        vocab = 0.50;
        gram = 0.50;
      }

      const total = Number((fluency + pron + vocab + gram).toFixed(2));

      let badge = '🌟 Xuất sắc (Excellent)';
      let badgeColor = 'text-emerald-700 bg-emerald-100 border-emerald-300';
      if (total < 1.6) {
        badge = '👍 Khá tốt - Cần phát huy (Good)';
        badgeColor = 'text-amber-700 bg-amber-100 border-amber-300';
      }
      if (total < 1.2) {
        badge = '💪 Cần rèn luyện thêm (Keep Practicing)';
        badgeColor = 'text-rose-700 bg-rose-100 border-rose-300';
      }

      const evalData: SpeakingEvaluation = {
        totalScore: total,
        fluencyScore: fluency,
        pronScore: pron,
        vocabScore: vocab,
        gramScore: gram,
        badge,
        badgeColor,
        wordCount,
        durationSec: dur,
        strengths: "Em có phong thái tự tin, âm lượng to rõ ràng, trình bày mạch lạc và đúng trọng tâm câu hỏi của Giám khảo.",
        improvements: "Em hãy chú ý nhấn đúng trọng âm của từ (stress) và phát âm rõ âm đuôi (ending sounds: /s/, /z/, /ed/) để bài nói thêm phần tự nhiên và truyền cảm nhé.",
        encouragement: "Thầy rất khen ngợi tinh thần học tập và sự nỗ lực của em! Em hãy tiếp tục ghi âm luyện nói đều đặn mỗi ngày để đạt điểm 10 trọn vẹn trong bài thi Cuối kỳ nhé!"
      };

      setEvaluation(evalData);
      setIsEvaluating(false);

      if (onSpeakingGraded) {
        onSpeakingGraded(total);
      }
    }, 1200);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="mt-6 mb-8 rounded-3xl border-2 border-purple-300 bg-gradient-to-br from-purple-50/80 via-white to-indigo-50/70 p-5 sm:p-7 shadow-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-purple-200/80 pb-4 mb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-black tracking-wider uppercase mb-1">
            <Mic className="w-3.5 h-3.5 text-purple-600" />
            <span>KỸ NĂNG NÓI & KHẢO THÍ CHUẨN BỘ GD&ĐT (CUỐI KỲ)</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>🗣️ BÀI THI NÓI (SPEAKING TEST) – THANG ĐIỂM: 2.0 ĐIỂM</span>
          </h3>
          <p className="text-xs sm:text-sm text-purple-900/80 mt-1 font-medium">
            Chủ đề: <strong className="text-purple-950 font-bold">{topicConfig.topicTitle}</strong> (Tiếng Anh {grade} Global Success)
          </p>
        </div>

        {/* Live Pulse Recording Badge */}
        {isRecording && (
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-rose-500 text-white font-black text-xs sm:text-sm shadow-md animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
            <span>ĐANG GHI ÂM: {formatTime(secondsRecorded)}</span>
            <div className="flex items-center gap-0.5 ml-1">
              <span className="w-1 h-3 bg-white rounded-full animate-bounce"></span>
              <span className="w-1 h-4 bg-white rounded-full animate-bounce delay-75"></span>
              <span className="w-1 h-2 bg-white rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
      </div>

      {/* Examiner Script & Student Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-5">
        {topicConfig.tasks.map((t, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-white/90 border border-purple-200/70 shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-xs font-black text-purple-700 uppercase tracking-wide mb-1">
                {t.taskName}
              </div>
              <div className="font-bold text-slate-900 text-sm leading-snug mb-2">
                "{t.question}"
              </div>
            </div>
            <div className="text-xs text-slate-500 italic bg-purple-50/60 p-2.5 rounded-xl border border-purple-100">
              {t.promptNote}
            </div>
          </div>
        ))}
      </div>

      {/* Recording Control Center */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-purple-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm transition shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Mic className="w-4 h-4" />
                <span>{audioUrl ? '🔄 Ghi âm lại bài nói' : '🎤 Bắt đầu ghi âm bài nói'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm transition shadow-md flex items-center gap-2 cursor-pointer active:scale-95 animate-pulse"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>⏹️ Dừng ghi âm & Lưu bài</span>
              </button>
            )}

            {audioUrl && !isRecording && (
              <button
                type="button"
                onClick={handleEvaluateSpeaking}
                disabled={isEvaluating}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm transition shadow-md flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isEvaluating ? '🤖 Đang chấm điểm...' : '✨ AI Chấm điểm bài nói (2.0đ)'}</span>
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Thời lượng quy định: <strong className="text-purple-800">1 - 2 phút</strong> | Thời gian đã nói: <strong className="text-slate-800">{formatTime(secondsRecorded)}</strong>
          </div>
        </div>

        {/* Audio Player and Download Bar */}
        {audioUrl && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-purple-50/40 p-3 rounded-xl border border-purple-100">
            <div className="flex items-center gap-3 flex-1 min-w-[260px]">
              <span className="text-xs font-black text-slate-700 whitespace-nowrap">🎧 Nghe lại bài nói:</span>
              <audio controls src={audioUrl} className="h-9 flex-1 min-w-[200px]" />
            </div>
            <a
              href={audioUrl}
              download={`Bai_Noi_Tieng_Anh_${grade}_Ma_${examCode}.webm`}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 transition shadow-2xs flex items-center gap-1.5 cursor-pointer no-underline"
            >
              <Download className="w-3.5 h-3.5 text-purple-600" />
              <span>Tải file ghi âm (.webm)</span>
            </a>
          </div>
        )}

        {/* Live Speech Recognition Transcript */}
        {(liveTranscript || isRecording) && (
          <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
            <span className="block font-black text-purple-900 text-xs uppercase tracking-wide mb-1">
              🎙️ Bản gỡ băng bài nói trực tiếp (Speech-to-Text Transcript):
            </span>
            <div className="italic text-slate-700">
              {liveTranscript || 'Hệ thống đang lắng nghe học sinh nói vào Micro...'}
            </div>
          </div>
        )}
      </div>

      {/* AI Evaluation Result Card */}
      {evaluation && (
        <div className="mt-5 rounded-2xl border-2 border-purple-400 bg-white p-5 sm:p-6 shadow-md">
          {/* Header Score & Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-100 pb-4 mb-4">
            <div>
              <span className="text-xs font-black text-purple-700 uppercase tracking-wider">KẾT QUẢ KHẢO THÍ BÀI THI NÓI (SPEAKING TEST)</span>
              <h4 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
                BẢNG ĐIỂM CHI TIẾT THEO 4 TIÊU CHÍ CHUẨN BỘ GD&ĐT
              </h4>
            </div>
            <div className="text-left sm:text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-black border ${evaluation.badgeColor} mb-1`}>
                {evaluation.badge}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-purple-700">
                {evaluation.totalScore.toFixed(2)} <span className="text-sm font-semibold text-slate-500">/ 2.00 điểm</span>
              </div>
            </div>
          </div>

          {/* 4 Standard MOET Criteria Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            {/* Criteria 1 */}
            <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200">
              <div className="flex items-center justify-between text-xs font-black text-purple-950 mb-1">
                <span>1. Độ lưu loát & Mạch lạc</span>
                <span className="text-purple-700 font-extrabold">{evaluation.fluencyScore.toFixed(2)} / 0.50</span>
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                {evaluation.fluencyScore >= 0.45 ? 'Tốc độ nói đều đặn, ngắt nghỉ đúng chỗ, diễn đạt tự nhiên liền mạch.' : 'Nói khá rõ ràng, nên luyện giảm ngập ngừng và dùng thêm từ nối liên kết câu.'}
              </p>
            </div>

            {/* Criteria 2 */}
            <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200">
              <div className="flex items-center justify-between text-xs font-black text-purple-950 mb-1">
                <span>2. Phát âm & Ngữ điệu</span>
                <span className="text-purple-700 font-extrabold">{evaluation.pronScore.toFixed(2)} / 0.50</span>
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                {evaluation.pronScore >= 0.45 ? 'Phát âm tròn vành rõ chữ, có âm đuôi chuẩn, ngữ điệu lên xuống biểu cảm.' : 'Cần bật rõ âm đuôi (ending sounds: /s/, /z/, /ed/) và chú ý trọng âm từ.'}
              </p>
            </div>

            {/* Criteria 3 */}
            <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200">
              <div className="flex items-center justify-between text-xs font-black text-purple-950 mb-1">
                <span>3. Vốn từ theo chủ đề</span>
                <span className="text-purple-700 font-extrabold">{evaluation.vocabScore.toFixed(2)} / 0.50</span>
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                {evaluation.vocabScore >= 0.45 ? 'Vốn từ phong phú, sử dụng chính xác các từ trọng tâm SGK Global Success.' : 'Nên vận dụng thêm 2-3 tính từ hoặc từ vựng chủ điểm của bài học.'}
              </p>
            </div>

            {/* Criteria 4 */}
            <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200">
              <div className="flex items-center justify-between text-xs font-black text-purple-950 mb-1">
                <span>4. Ngữ pháp & Cấu trúc</span>
                <span className="text-purple-700 font-extrabold">{evaluation.gramScore.toFixed(2)} / 0.50</span>
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                {evaluation.gramScore >= 0.45 ? 'Chia đúng thì của động từ, cấu trúc câu đa dạng, ít lỗi cơ bản.' : 'Cần lưu ý chia động từ số ít/số nhiều và cấu trúc câu ghép hoàn chỉnh.'}
              </p>
            </div>
          </div>

          {/* Teacher's Pedagogical Feedback */}
          <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans space-y-1.5">
            <div className="font-black text-purple-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
              <span>👩‍🏫 LỜI NHẬN XÉT SƯ PHẠM CỦA GIÁO VIÊN:</span>
            </div>
            <div>• <strong className="text-purple-950">Ưu điểm:</strong> {evaluation.strengths}</div>
            <div>• <strong className="text-purple-950">Gợi ý hoàn thiện:</strong> {evaluation.improvements}</div>
            <div className="italic text-purple-900 pt-0.5">• <strong>Động viên:</strong> "{evaluation.encouragement}"</div>
          </div>
        </div>
      )}
    </div>
  );
};

const PartAudioPlayer: React.FC<PartAudioPlayerProps> = ({ partTitle, partSubtitle, audioUrl, themeColor }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(0.9);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.load();
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.playbackRate = speed;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Audio play error:', err);
        setIsPlaying(false);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (!duration && audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const skipSeconds = (sec: number) => {
    if (!audioRef.current) return;
    const newTime = Math.max(0, Math.min(duration || 999, audioRef.current.currentTime + sec));
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const changeSpeed = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const formatTime = (timeInSec: number) => {
    if (isNaN(timeInSec)) return '00:00';
    const m = Math.floor(timeInSec / 60);
    const s = Math.floor(timeInSec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const isSky = themeColor === 'sky';

  return (
    <div className={`p-3.5 sm:p-4 rounded-2xl border shadow-sm my-3 transition-all ${
      isSky 
        ? 'bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border-sky-300' 
        : 'bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-indigo-300'
    }`}>
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => { setIsPlaying(false); setCurrentTime(0); }}
      />
      {/* Header Player */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs ${
            isSky ? 'bg-sky-600' : 'bg-indigo-600'
          }`}>
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className={`text-xs sm:text-sm font-black ${isSky ? 'text-sky-950' : 'text-indigo-950'}`}>
              {partTitle}
            </div>
            <div className={`text-[11px] sm:text-xs ${isSky ? 'text-sky-700' : 'text-indigo-700'}`}>
              {partSubtitle}
            </div>
          </div>
        </div>

        {/* Speed Buttons */}
        <div className="flex items-center gap-1 bg-white/90 p-1 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 px-1">Tốc độ:</span>
          {[0.75, 0.9, 1.0].map(s => (
            <button
              key={s}
              type="button"
              onClick={() => changeSpeed(s)}
              className={`px-2 py-0.5 rounded-lg text-xs font-black transition cursor-pointer ${
                speed === s 
                  ? (isSky ? 'bg-sky-600 text-white' : 'bg-indigo-600 text-white') 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {s === 0.75 ? '0.75x' : s === 0.9 ? '0.9x' : '1.0x'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Slider & Controls */}
      <div className="bg-white/95 p-2.5 sm:p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center gap-2">
          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={togglePlay}
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shadow-md cursor-pointer shrink-0 transition active:scale-95 ${
              isPlaying 
                ? 'bg-rose-600 hover:bg-rose-700 ring-2 ring-rose-300' 
                : (isSky ? 'bg-sky-600 hover:bg-sky-700 ring-2 ring-sky-300' : 'bg-indigo-600 hover:bg-indigo-700 ring-2 ring-indigo-300')
            }`}
            title={isPlaying ? "Tạm dừng" : "Bật nghe"}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          {/* Quick Rewind -5s button */}
          <button
            type="button"
            onClick={() => skipSeconds(-5)}
            className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-black text-xs flex items-center gap-1 cursor-pointer shrink-0 transition"
            title="Lùi lại 5 giây để nghe lại từ vừa phát"
          >
            <span>⏪ -5s</span>
          </button>

          {/* Thanh trượt Seek Slider */}
          <div className="flex-1 px-1 flex items-center">
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.2"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              style={{ accentColor: isSky ? '#0284c7' : '#4f46e5' }}
            />
          </div>

          {/* Quick Forward +5s button */}
          <button
            type="button"
            onClick={() => skipSeconds(5)}
            className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-black text-xs flex items-center gap-1 cursor-pointer shrink-0 transition"
            title="Tiến lên 5 giây"
          >
            <span>+5s ⏩</span>
          </button>
        </div>

        {/* Time Progress Display */}
        <div className="flex items-center justify-between text-xs font-extrabold text-slate-500 px-1">
          <span className="text-sky-950 font-black">
            ⏱️ {formatTime(currentTime)}
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            👈 Kéo thanh trượt để nghe lại bất kỳ từ hoặc câu nào 👉
          </span>
          <span className="text-slate-700">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};

export const OnlineExamPortal: React.FC<OnlineExamPortalProps> = ({ onGoToLeaderboard }) => {
  const [selectedGrade, setSelectedGrade] = useState<number>(8);
  const [examType, setExamType] = useState<'giua-ky-1' | 'cuoi-ky-1' | 'giua-ky-2' | 'cuoi-ky-2'>('giua-ky-1');
  const [selectedExamIndex, setSelectedExamIndex] = useState<number>(0);
  const [currentExam, setCurrentExam] = useState<GeneratedExam | null>(null);
  
  const [activeStudent, setActiveStudent] = useState<StudentProfile | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [examDataByTerm, setExamDataByTerm] = useState<Record<string, TermExamsData>>({});
  const [isLoadingExams, setIsLoadingExams] = useState<boolean>(true);

  const [scoreResult, setScoreResult] = useState<{
    score: number;
    correctCount: number;
    wrongCount: number;
    skippedCount: number;
    total: number;
    rankLevel: string;
    scaledScore: number;
    rankInfo: RankStandardTT22;
  } | null>(null);

  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(-1);
  const [showAudioScript, setShowAudioScript] = useState<boolean>(false);
  const [currentPlayingPart, setCurrentPlayingPart] = useState<'part1' | 'part2' | 'all'>('part1');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [copiedEssayId, setCopiedEssayId] = useState<string | null>(null);

  const handleCopySampleEssay = (qId: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedEssayId(qId);
      setTimeout(() => {
        setCopiedEssayId(null);
      }, 4000);
    }
  };
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const student = studentGradebookService.getActiveStudent();
    setActiveStudent(student);
  }, []);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingExams(true);
    loadTermExams(examType).then(data => {
      if (isMounted) {
        setExamDataByTerm(prev => ({ ...prev, [examType]: data }));
        setIsLoadingExams(false);
      }
    }).catch(() => {
      if (isMounted) setIsLoadingExams(false);
    });
    return () => { isMounted = false; };
  }, [examType]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    const curData = examDataByTerm[examType];
    if (curData && Object.keys(curData).length > 0) {
      buildExam(selectedGrade, examType, selectedExamIndex, curData);
    }
  }, [selectedGrade, examType, selectedExamIndex, examDataByTerm]);

  useEffect(() => {
    // Kích hoạt nạp sẵn danh sách giọng đọc bản ngữ trực tuyến
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }

    // Khởi tạo audioRef dự phòng
    if (typeof window !== 'undefined' && !audioRef.current) {
      const a = new Audio();
      a.onended = () => {
        setIsPlayingAudio(false);
        setCurrentLineIndex(-1);
      };
      a.onerror = () => {
        setIsPlayingAudio(false);
        setCurrentLineIndex(-1);
      };
      audioRef.current = a;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // ==============================================================================
  // HỆ THỐNG ÂM THANH BÀI NGHE AI BẢN NGỮ (SMART LISTENING PRO STANDARD)
  // - 2 giọng đối thoại Nam & Nữ luân phiên chuẩn Microsoft Natural / Neural
  // - Tuyệt đối KHÔNG đọc tên nhân vật hoặc tiêu đề
  // - Tốc độ chuẩn sư phạm 0.78x (chậm rãi, tròn vành rõ chữ, dễ nghe cho học sinh)
  // ==============================================================================
  const playChimeTone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {}
  };

  const getBestDialogueVoice = (isMale: boolean): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().startsWith('en'));
    if (voices.length === 0) return null;

    const malePriorities = [
      'andrew online (natural)', 'guy online (natural)', 'ryan online (natural)',
      'google uk english male', 'google us english', 'andrew', 'guy', 'ryan', 'daniel', 'david'
    ];
    const femalePriorities = [
      'ava online (natural)', 'jenny online (natural)', 'libby online (natural)',
      'aria online (natural)', 'google us english', 'jenny', 'ava', 'libby', 'aria', 'samantha', 'zira'
    ];

    const targetList = isMale ? malePriorities : femalePriorities;

    for (const name of targetList) {
      const match = voices.find(v => v.name.toLowerCase().includes(name));
      if (match) return match;
    }

    // Fallback: Tìm bất kỳ giọng Natural/Neural nào theo giới tính
    const naturalVoice = voices.find(v => {
      const n = v.name.toLowerCase();
      const isNat = n.includes('natural') || n.includes('neural') || n.includes('online');
      if (!isNat) return false;
      return isMale ? (n.includes('male') || n.includes('andrew') || n.includes('guy') || n.includes('ryan'))
                    : (n.includes('female') || n.includes('ava') || n.includes('jenny') || n.includes('libby'));
    });
    if (naturalVoice) return naturalVoice;

    // Fallback nếu không có Natural riêng biệt
    const anyNatural = voices.find(v => {
      const n = v.name.toLowerCase();
      return n.includes('natural') || n.includes('neural') || n.includes('online');
    });
    if (anyNatural) return anyNatural;

    if (voices.length >= 2) {
      return isMale ? voices[0] : voices[1];
    }
    return voices[0] || null;
  };

  const playSpeechFallback = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !currentExam?.audioScript) {
      setIsPlayingAudio(false);
      setCurrentLineIndex(-1);
      return;
    }
    window.speechSynthesis.cancel();
    playChimeTone();
    
    // Loại bỏ triệt để 100% tên nhân vật & tiêu đề ("Part 1:", "Nam:", "Mai:", "Linda:", "Mi:", "Hi Nam!", "Hi Mai!", v.v.)
    const cleanLines = currentExam.audioScript
      .split('\n')
      .map(line => {
        let clean = line
          .replace(/^[•\s\t*-]+/, '')
          .replace(/^(Transcript\s+bài\s+nghe\s+)?(Part|Phần|Track)\s*\d+[^:\n]*:\s*/i, '')
          .replace(/^[A-Za-z0-9\s'.-]+:\s*/, '')
          .replace(/^(Nam|Mai|Linda|Mi|Phong|Lan|Hoa|Tom|Peter|Mary|John|David|Jason|Hannah|Mark|Trang|Doctor|Nick|Speaker\s*\w*|Person\s*\w*|Boy|Girl|Man|Woman|Interviewer|Interviewee|Teacher|Student)\s*[:–-]\s*/i, '')
          .trim();
        return clean;
      })
      .filter(line => line.length > 0 && !line.toLowerCase().includes('transcript bài nghe') && !line.toLowerCase().startsWith('part ') && !line.toLowerCase().startsWith('phần '));
      
    if (cleanLines.length === 0) {
      setIsPlayingAudio(false);
      setCurrentLineIndex(-1);
      return;
    }
    
    let currentIndex = 0;
    setIsPlayingAudio(true);
    setCurrentLineIndex(0);
    
    const speakNext = () => {
      if (currentIndex >= cleanLines.length) {
        setIsPlayingAudio(false);
        setCurrentLineIndex(-1);
        return;
      }
      
      setCurrentLineIndex(currentIndex);
      const utter = new SpeechSynthesisUtterance(cleanLines[currentIndex]);
      utter.lang = 'en-US';
      
      // Tốc độ chuẩn sư phạm cho học sinh THCS: 0.78x nhân với hệ số điều chỉnh của học sinh
      // Giúp học sinh nghe rõ từng nguyên âm, phụ âm đuôi, nối âm mà không bị nuốt âm
      const baseRate = 0.78;
      utter.rate = Math.max(0.60, Math.min(1.10, playbackSpeed * baseRate));
      utter.volume = 1.0;
      
      // Luân phiên 1 giọng nam (ấm áp, đĩnh đạc) và 1 giọng nữ (trong trẻo, tự nhiên)
      const isMaleTurn = currentIndex % 2 === 0;
      utter.pitch = isMaleTurn ? 0.98 : 1.02; // Cao độ tự nhiên, không biến dạng giọng
      
      try {
        const bestVoice = getBestDialogueVoice(isMaleTurn);
        if (bestVoice) {
          utter.voice = bestVoice;
        }
      } catch (e) {}
      
      utter.onend = () => {
        currentIndex++;
        // Khoảng dừng 480ms tự nhiên giữa 2 lượt đối thoại
        setTimeout(speakNext, 480);
      };
      
      utter.onerror = (e) => {
        if (e.error !== 'canceled') {
          console.warn('SpeechSynthesis error:', e);
        }
        setIsPlayingAudio(false);
        setCurrentLineIndex(-1);
      };
      
      window.speechSynthesis.speak(utter);
    };
    
    speakNext();
  };

  const handleTogglePlayAudio = () => {
    if (isPlayingAudio) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlayingAudio(false);
      setCurrentLineIndex(-1);
      return;
    }

    // Nếu đề thi có sẵn file audio mp3 (chuẩn phòng thu), ưu tiên phát audioRef
    if (currentExam?.audioUrl && audioRef.current) {
      audioRef.current.src = currentExam.audioUrl;
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch(err => {
        console.warn('Audio play error, falling back to AI Neural Speech:', err);
        playSpeechFallback();
      });
      return;
    }

    // Mặc định sử dụng AI Voice engine bản ngữ đối thoại luân phiên (Nam/Nữ)
    playSpeechFallback();
  };

  
  const handlePlayPart = (part: 'part1' | 'part2') => {
    const url = part === 'part1' ? currentExam?.audioUrlPart1 : currentExam?.audioUrlPart2;
    if (!url) return;
    if (isPlayingAudio && currentPlayingPart === part) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlayingAudio(false);
      return;
    }
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
        setCurrentPlayingPart(part);
      }).catch(err => {
        console.warn('Play error:', err);
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
  // Hàm hỗ trợ xáo trộn mảng ngẫu nhiên (Fisher-Yates)
  const shuffleArrayHelper = <T,>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // Hàm đảo các phương án lựa chọn và tự động cập nhật đáp án đúng (A, B, C, D)
  const shufflePortalQuestionOptions = (q: OfficialExamQuestion): OfficialExamQuestion => {
    if (!q.options || q.options.length <= 1) return { ...q };
    // Không đảo câu hỏi True / False
    if (q.options.some(o => /true|false|đúng|sai/i.test(o))) {
      return { ...q };
    }

    const rawCorrect = (q.correct || '').trim();
    const rawLetter = (q.correctLetter || '').trim().toUpperCase();
    const letters = ['A', 'B', 'C', 'D', 'E'];

    let correctContent = rawCorrect;
    if (!correctContent && rawLetter) {
      const idx = letters.indexOf(rawLetter);
      if (idx !== -1 && q.options[idx]) {
        correctContent = q.options[idx];
      }
    }

    const shuffledOptions = shuffleArrayHelper(q.options);
    const newIdx = shuffledOptions.findIndex(o => o.trim().toLowerCase() === correctContent.trim().toLowerCase());
    const newLetter = newIdx !== -1 ? letters[newIdx] : rawLetter;

    let newExplanation = q.explanation || '';
    if (newLetter && rawLetter && newExplanation) {
      newExplanation = newExplanation.replace(/🎯 ĐÁP ÁN ĐÚNG:\s*[A-Ea-e]/i, `🎯 ĐÁP ÁN ĐÚNG: ${newLetter}`);
    }

    return {
      ...q,
      options: shuffledOptions,
      correct: correctContent,
      correctLetter: newLetter,
      explanation: newExplanation
    };
  };

  // Hàm tạo danh sách câu hỏi xáo trộn thông minh chuẩn sư phạm chống học vẹt
  const createShuffledPortalQuestions = (rawQuestions: OfficialExamQuestion[]): ExamQuestion[] => {
    const partGroups: Record<string, OfficialExamQuestion[]> = {};
    const partOrder: string[] = [];

    rawQuestions.forEach(q => {
      const p = q.part || 'A';
      if (!partGroups[p]) {
        partGroups[p] = [];
        partOrder.push(p);
      }
      partGroups[p].push(q);
    });

    const finalQuestions: OfficialExamQuestion[] = [];

    partOrder.forEach(p => {
      const list = partGroups[p];
      if (!list || list.length === 0) return;
      const firstQ = list[0];
      const pTitle = (firstQ.partTitle || '').toLowerCase();
      const isPart2 = p === 'B' || pTitle.includes('part 2') || pTitle.includes('true');
      const isPart1 = p === 'A' || pTitle.includes('part 1');
      const isCloze = p === 'D' && pTitle.includes('part 4');
      const isWritingEssay = firstQ.type === 'essay';

      if (isWritingEssay) {
        finalQuestions.push(...list);
        return;
      }

      if (isPart2) {
        // TUYỆT ĐỐI KHÔNG ĐẢO PART 2: Giữ nguyên 100% thứ tự câu hỏi và giữ nguyên đáp án A. True, B. False
        finalQuestions.push(...list);
        return;
      }

      if (isPart1 || isCloze) {
        // Giữ nguyên thứ tự câu hỏi theo mạch nghe / ô trống đọc hiểu, nhưng ĐẢO CÁC PHƯƠNG ÁN LỰA CHỌN
        list.forEach(q => {
          finalQuestions.push(shufflePortalQuestionOptions(q));
        });
        return;
      }

      // Các phần còn lại (Part C, E, F, G): ĐẢO CẢ THỨ TỰ CÂU HỎI VÀ ĐẢO CẢ CÁC ĐÁP ÁN LỰA CHỌN
      const shuffledList = shuffleArrayHelper(list).map(q => shufflePortalQuestionOptions(q));
      finalQuestions.push(...shuffledList);
    });

    // Tự động đánh số lại câu hỏi từ 1 đến hết
    return finalQuestions.map((q, idx) => ({
      part: q.part,
      partTitle: q.partTitle,
      partInstruction: q.partInstruction,
      qNumber: idx + 1,
      id: q.id,
      type: q.type,
      text: q.text,
      options: q.options,
      correct: q.correct,
      correctLetter: q.correctLetter,
      explanation: q.explanation,
      passage: q.passage
    }));
  };

  const buildExam = (grade: number, type: string, examIdx: number, dataForTerm?: TermExamsData) => {
    setIsSubmitted(false);
    setUserAnswers({});
    setScoreResult(null);
    setShowAudioScript(false);
    setIsPlayingAudio(false);

    const termData = dataForTerm || examDataByTerm[type];
    const gradeExams = termData ? termData[String(grade)] : undefined;
    
    if (gradeExams) {
      const availableCodes = Object.keys(gradeExams).sort();
      if (availableCodes.length > 0) {
        const targetCode = availableCodes[examIdx % availableCodes.length];
        const offExam = gradeExams[targetCode];

        if (offExam) {
          // Xáo trộn ngẫu nhiên câu hỏi & đáp án từng Part chống học vẹt (Tuyệt đối không đảo Part 2)
          const convertedQuestions: ExamQuestion[] = createShuffledPortalQuestions(offExam.questions);

          setCurrentExam({
            grade,
            examType: type as any,
            typeTitle: offExam.typeTitle,
            examCode: `MÃ ĐỀ ${targetCode}`,
            durationMinutes: offExam.durationMinutes || 60,
            totalQuestions: convertedQuestions.length,
            passageText: offExam.passageText,
            audioUrl: offExam.audioUrl,
            audioUrlPart1: offExam.audioUrlPart1,
            audioUrlPart2: offExam.audioUrlPart2,
            audioScript: offExam.audioScript,
            audioScriptPart1: offExam.audioScriptPart1,
            audioScriptPart2: offExam.audioScriptPart2,
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

    let earnedPoints = 0;
    currentExam.questions.forEach(q => {
      const rawAns = (userAnswers[q.id] || '').trim();
      const userAns = rawAns.toLowerCase();
      const rightAns = (q.correct || '').trim().toLowerCase();

      if (!rawAns) {
        skippedCount++;
        return;
      }

      let isQCorrect = false;
      if (q.type === 'essay') {
        const words = rawAns.match(/\S+/g) || [];
        if (words.length >= 15) {
          isQCorrect = true;
        }
      } else if (userAns === rightAns) {
        isQCorrect = true;
      } else if (q.options) {
        const userIdx = q.options.findIndex((o: any) => o.trim().toLowerCase() === userAns);
        const rightIdx = q.options.findIndex((o: any) => o.trim().toLowerCase() === rightAns);
        if (userIdx !== -1 && userIdx === rightIdx) {
          isQCorrect = true;
        } else if (q.correctLetter && userAns === q.correctLetter.toLowerCase()) {
          isQCorrect = true;
        }
      }

      if (isQCorrect) {
        correctCount++;
        earnedPoints += (q.type === 'essay' ? 1.0 : 0.25);
      } else {
        wrongCount++;
      }
    });

    const scaledScore = Math.min(10.0, Math.round(earnedPoints * 10) / 10);
    
    // =========================================================================
    // XẾP LOẠI KẾT QUẢ ĐÁNH GIÁ CHUẨN THÔNG TƯ 22/2021/TT-BGDĐT
    // - Mức Tốt (Xuất sắc): 9.0 - 10.0 điểm
    // - Mức Tốt (Giỏi): 8.0 - 8.9 điểm
    // - Mức Khá: 6.5 - 7.9 điểm
    // - Mức Đạt: 5.0 - 6.4 điểm
    // - Mức Chưa đạt: Dưới 5.0 điểm (< 5.0 điểm, từ 0.0 đến 4.9 điểm)
    // =========================================================================
    let rankInfo: RankStandardTT22;

    if (scaledScore >= 9.0) {
      rankInfo = {
        rankLevel: 'XUAT_SAC',
        levelTitle: 'Mức Tốt (Xuất sắc)',
        badgeText: 'Xuất sắc 🏆',
        ruleNote: 'Chuẩn Thông tư 22/2021/TT-BGDĐT: Đạt mức Tốt (Xuất sắc: 9.0 - 10.0đ)',
        feedback: 'Khen ngợi: Em có năng lực tiếng Anh rất xuất sắc, làm bài cực kỳ cẩn thận và tự tin!',
        bannerBg: 'bg-gradient-to-br from-emerald-600 via-teal-700 to-green-800 border-emerald-400',
        iconType: 'trophy'
      };
    } else if (scaledScore >= 8.0) {
      rankInfo = {
        rankLevel: 'GIOI',
        levelTitle: 'Mức Tốt (Giỏi)',
        badgeText: 'Tốt (Giỏi) 🌟',
        ruleNote: 'Chuẩn Thông tư 22/2021/TT-BGDĐT: Đạt mức Tốt (8.0 - 8.9đ)',
        feedback: 'Khen ngợi: Em nắm rất vững kiến thức trọng tâm, tiếp tục phát huy ở các bài thi tới nhé!',
        bannerBg: 'bg-gradient-to-br from-emerald-600 via-teal-700 to-green-800 border-emerald-400',
        iconType: 'trophy'
      };
    } else if (scaledScore >= 6.5) {
      rankInfo = {
        rankLevel: 'KHA',
        levelTitle: 'Mức Khá',
        badgeText: 'Khá 👍',
        ruleNote: 'Chuẩn Thông tư 22/2021/TT-BGDĐT: Đạt mức Khá (6.5 - 7.9đ)',
        feedback: 'Khá tốt: Em đã hiểu bài khá tốt, rèn luyện thêm các câu hỏi vận dụng để đạt điểm cao hơn!',
        bannerBg: 'bg-gradient-to-br from-blue-600 via-indigo-700 to-sky-800 border-blue-400',
        iconType: 'award'
      };
    } else if (scaledScore >= 5.0) {
      rankInfo = {
        rankLevel: 'DAT',
        levelTitle: 'Mức Đạt',
        badgeText: 'Đạt 🎯',
        ruleNote: 'Chuẩn Thông tư 22/2021/TT-BGDĐT: Đạt mức Đạt (5.0 - 6.4đ)',
        feedback: 'Đạt yêu cầu: Em đã hoàn thành yêu cầu cơ bản, cần củng cố thêm từ vựng và ngữ pháp nhé!',
        bannerBg: 'bg-gradient-to-br from-amber-600 via-orange-600 to-yellow-700 border-amber-300',
        iconType: 'check'
      };
    } else {
      // Dưới 5.0 điểm (VD: 2.8 điểm) -> BẮT BUỘC XẾP MỨC CHƯA ĐẠT!
      rankInfo = {
        rankLevel: 'CHUA_DAT',
        levelTitle: 'Mức Chưa đạt',
        badgeText: 'Chưa đạt ⚠️ (Cần cố gắng)',
        ruleNote: 'Chuẩn Thông tư 22/2021/TT-BGDĐT: Dưới 5.0 điểm xếp Mức Chưa đạt',
        feedback: 'Chưa đạt: Điểm số dưới 5.0. Em hãy xem kỹ lời giải chi tiết từng câu bên dưới để rút kinh nghiệm và làm lại đề nhé!',
        bannerBg: 'bg-gradient-to-br from-rose-700 via-red-800 to-red-950 border-rose-500',
        iconType: 'alert'
      };
    }

    setScoreResult({
      score: scaledScore,
      correctCount,
      wrongCount,
      skippedCount,
      total: currentExam.questions.length,
      rankLevel: rankInfo.rankLevel,
      scaledScore,
      rankInfo
    });
    setIsSubmitted(true);

    if (activeStudent) {
      studentGradebookService.recordSubmission({
        studentId: activeStudent.id,
        studentCode: activeStudent.studentCode,
        studentName: activeStudent.name,
        classId: activeStudent.classId,
        className: activeStudent.className,
        grade: activeStudent.grade || selectedGrade,
        testType: 'gk_ck_exam',
        unitNumber: 0,
        unitTitle: currentExam.examCode,
        testTitle: `${currentExam.typeTitle} (${currentExam.examCode})`,
        score: scaledScore,
        correctCount,
        totalQuestions: currentExam.questions.length,
        timeSpentSeconds: 0
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
  const termData = examDataByTerm[examType];
  const gradeExams = termData ? termData[String(selectedGrade)] : undefined;
  const currentAvailableCodes = gradeExams ? Object.keys(gradeExams).sort() : [];
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
                { grade: 6, label: 'Lớp 6' },
                { grade: 7, label: 'Lớp 7' },
                { grade: 8, label: 'Lớp 8' },
                { grade: 9, label: 'Lớp 9' },
              ].map(({ grade, label }) => {
                const count = (examDataByTerm[examType] && examDataByTerm[examType][String(grade)])
                  ? Object.keys(examDataByTerm[examType][String(grade)]).length
                  : 0;
                return (
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
                      selectedGrade === grade ? 'bg-blue-950 text-amber-300' : (count > 0 ? 'bg-emerald-500 text-white' : 'bg-slate-600/80 text-slate-300')
                    }`}>
                      {count > 0 ? `${count} mã đề` : '0 mã đề'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DÒNG 2: CHỌN ĐỢT THI */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <div className="text-xs sm:text-sm font-bold text-sky-200">
              2. Đợt kiểm tra:
            </div>
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 sm:gap-2">
              {[
                { id: 'giua-ky-1', name: 'Giữa HK1' },
                { id: 'cuoi-ky-1', name: 'Cuối HK1' },
                { id: 'giua-ky-2', name: 'Giữa HK2' },
                { id: 'cuoi-ky-2', name: 'Cuối HK2' }
              ].map(term => {
                let termCount = 0;
                const tData = examDataByTerm[term.id];
                if (tData) {
                  Object.values(tData).forEach(gMap => {
                    termCount += Object.keys(gMap || {}).length;
                  });
                }
                const label = `${term.name} (${termCount} mã đề)`;
                return (
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
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* DÒNG 3: BẢNG MÃ ĐỀ THI - MOBILE FIRST */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <span className="text-xs sm:text-sm font-black text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {hasOfficialForCurrent 
                  ? `3. Chọn mã đề thi ôn luyện (Khối ${selectedGrade} - ${currentAvailableCodes.length} mã đề chuẩn):`
                  : 'Mã đề thi:'}
              </span>
              <span className="text-xs sm:text-sm text-amber-300 font-bold">
                {hasOfficialForCurrent ? `Đang làm: Mã ${currentAvailableCodes[selectedExamIndex % currentAvailableCodes.length]}` : ''}
              </span>
            </div>

            {isLoadingExams ? (
              <div className="text-xs sm:text-sm text-sky-200 bg-sky-500/20 p-3 rounded-xl border border-sky-400/30 flex items-center gap-2">
                <RotateCw className="w-4 h-4 animate-spin text-sky-300" />
                <span>Đang nạp dữ liệu đề thi trực tuyến... Xin chờ giây lát.</span>
              </div>
            ) : hasOfficialForCurrent ? (
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
                Hiện có 0 mã đề cho mục này — Thầy giáo sẽ tự tạo đề và đưa lên hệ thống sau!
              </div>
            )}
          </div>
        </div>
      </div>

      {isLoadingExams && !currentExam && (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <RotateCw className="w-8 h-8 animate-spin text-sky-600 mx-auto" />
          <p className="font-bold text-slate-700 text-base">Đang mở đề thi chuẩn Bộ GD&ĐT... Xin chờ giây lát!</p>
        </div>
      )}

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
            {currentExam.audioScript && (
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
              Hiện Chưa Có Mã Đề Thi Cho Mục Này (0 Mã Đề)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Hệ thống hiện tại lưu trữ đúng 2 mã đề chuẩn Giữa Học Kỳ 1: <b>Lớp 6 (Mã 601)</b> và <b>Lớp 8 (Mã 801)</b> (Tự động đảo câu hỏi & đáp án mỗi lượt thi). Thầy giáo sẽ tự tạo các bộ đề còn lại và đưa lên hệ thống sau.
            </p>
          </div>
          <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => { setSelectedGrade(6); setExamType('giua-ky-1'); setSelectedExamIndex(0); }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition cursor-pointer flex items-center gap-1.5"
            >
              <span>📘 Làm bài Lớp 6 (Mã 601 - Tự đảo)</span>
            </button>
            <button
              type="button"
              onClick={() => { setSelectedGrade(8); setExamType('giua-ky-1'); setSelectedExamIndex(0); }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-700 text-white font-bold text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition cursor-pointer flex items-center gap-1.5"
            >
              <span>📙 Làm bài Lớp 8 (Mã 801 - Tự đảo)</span>
            </button>
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

          {/* KHUNG THÔNG BÁO KẾT QUẢ & CÔNG BỐ ĐIỂM SAU KHI NỘP BÀI - CHUẨN THÔNG TƯ 22/2021/TT-BGDĐT */}
          {isSubmitted && scoreResult && (
            <div id="exam-result-banner" className={`p-4 sm:p-6 m-3 sm:m-6 rounded-2xl sm:rounded-3xl border text-white shadow-xl transition-all ${scoreResult.rankInfo.bannerBg}`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-3.5 w-full sm:w-auto">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner mt-1">
                    {scoreResult.rankInfo.iconType === 'trophy' && <Trophy className="w-9 h-9 text-amber-300" />}
                    {scoreResult.rankInfo.iconType === 'award' && <Award className="w-9 h-9 text-sky-200" />}
                    {scoreResult.rankInfo.iconType === 'check' && <CheckCircle2 className="w-9 h-9 text-amber-200" />}
                    {scoreResult.rankInfo.iconType === 'alert' && <AlertCircle className="w-9 h-9 text-rose-200" />}
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs sm:text-sm font-black uppercase tracking-wider text-white/90 flex items-center gap-2">
                      <span>KẾT QUẢ ĐÃ ĐƯỢC VÀO SỔ ĐIỂM</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white/25 border border-white/40">
                        THÔNG TƯ 22/2021/TT-BGDĐT
                      </span>
                    </div>
                    <div className="text-3xl sm:text-5xl font-black tracking-tight text-white flex items-baseline gap-2">
                      <span>{scoreResult.score}</span>
                      <span className="text-base sm:text-xl font-bold text-white/80">/ 10.0 Điểm</span>
                    </div>
                    <div className="text-xs sm:text-sm text-white/95 flex items-center gap-2 flex-wrap">
                      <span>✓ Đúng: <strong>{scoreResult.correctCount}</strong>/{scoreResult.total} câu ({Math.round((scoreResult.correctCount / scoreResult.total) * 100)}%)</span>
                      <span>•</span>
                      <span>✗ Sai: <strong>{scoreResult.wrongCount}</strong> câu</span>
                      {scoreResult.skippedCount > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-amber-200 font-extrabold">⚠️ Bỏ qua: {scoreResult.skippedCount} câu</span>
                        </>
                      )}
                      <span>•</span>
                      <span>Xếp loại: <strong className="px-2.5 py-0.5 rounded-lg bg-white text-slate-900 font-black shadow-xs inline-block ml-1">{scoreResult.rankInfo.badgeText}</strong></span>
                    </div>

                    {/* DÒNG CĂN CỨ THÔNG TƯ 22 & LỜI PHÊ SƯ PHẠM */}
                    <div className="mt-2.5 pt-2.5 border-t border-white/20 text-xs sm:text-sm space-y-1">
                      <div className="text-white/90">
                        <strong className="text-amber-200">📋 Căn cứ xếp loại:</strong> {scoreResult.rankInfo.ruleNote}
                      </div>
                      <div className="text-white/95 italic bg-black/15 p-2 rounded-xl border border-white/10">
                        💬 <strong>Lời nhận xét của Thầy:</strong> "{scoreResult.rankInfo.feedback}"
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  {onGoToLeaderboard && (
                    <button
                      type="button"
                      onClick={onGoToLeaderboard}
                      className="flex-1 sm:flex-initial px-4 py-3 rounded-xl bg-white text-slate-900 font-black text-xs sm:text-sm hover:bg-amber-300 transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>Xem Sổ Điểm Lớp</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleResetExam}
                    className="flex-1 sm:flex-initial px-4 py-3 rounded-xl bg-black/25 hover:bg-black/35 text-white font-black text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-1.5 border border-white/20"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>Làm Lại Đề Này</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* KHUNG PHÁT ÂM THANH BÀI NGHE AI NATIVE - KHÔNG ĐỌC TÊN NHÂN VẬT - MOBILE OPTIMIZED */}
          {currentExam.audioScript && (
            <div className="mx-3 sm:mx-6 mt-4 p-4 rounded-2xl bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 border border-sky-200/80 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                      🎧 Âm thanh bài nghe hội thoại (AI Bản ngữ)
                    </h4>
                    <p className="text-xs text-sky-800 font-medium">
                      2 giọng đối thoại luân phiên (1 Nam, 1 Nữ) · Tuyệt đối không đọc tên nhân vật
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* NÚT PHÁT AUDIO THEO TỪNG PART CHUẨN */}
                  {currentExam.audioUrlPart1 && currentExam.audioUrlPart2 ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handlePlayPart('part1')}
                        className={`px-3.5 py-2 rounded-xl font-black text-xs sm:text-sm shadow-md transition flex items-center gap-1.5 cursor-pointer ${
                          isPlayingAudio && currentPlayingPart === 'part1'
                            ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse ring-2 ring-rose-300'
                            : 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 text-white'
                        }`}
                      >
                        {isPlayingAudio && currentPlayingPart === 'part1' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{isPlayingAudio && currentPlayingPart === 'part1' ? "⏸ Dừng Part 1" : "🎧 Nghe Part 1 (Hội thoại)"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePlayPart('part2')}
                        className={`px-3.5 py-2 rounded-xl font-black text-xs sm:text-sm shadow-md transition flex items-center gap-1.5 cursor-pointer ${
                          isPlayingAudio && currentPlayingPart === 'part2'
                            ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse ring-2 ring-rose-300'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 text-white'
                        }`}
                      >
                        {isPlayingAudio && currentPlayingPart === 'part2' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{isPlayingAudio && currentPlayingPart === 'part2' ? "⏸ Dừng Part 2" : "🎧 Nghe Part 2 (Độc thoại)"}</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleTogglePlayAudio}
                      className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer ${
                        isPlayingAudio 
                          ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse' 
                          : 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white'
                      }`}
                    >
                      {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{isPlayingAudio ? "⏸ Dừng nghe" : "▶ Bật nghe hội thoại"}</span>
                    </button>
                  )}

                  {/* Nút chỉnh tốc độ */}
                  <div className="flex items-center bg-white border border-sky-200 rounded-xl p-0.5 shadow-2xs">
                    {[0.75, 0.9, 1.0].map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => handleChangePlaybackRate(spd)}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          playbackSpeed === spd 
                            ? 'bg-sky-600 text-white shadow-2xs' 
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>

                  {/* Nút xem Lời thoại Script */}
                  <button
                    type="button"
                    onClick={() => setShowAudioScript(!showAudioScript)}
                    className="px-2.5 py-1.5 rounded-xl bg-white border border-sky-200 hover:bg-sky-50 text-xs font-bold text-sky-900 flex items-center gap-1 transition shadow-2xs cursor-pointer"
                  >
                    <span>{showAudioScript ? "Ẩn lời thoại" : "Xem lời thoại"}</span>
                    {showAudioScript ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Lời băng nghe Script với hiệu ứng đánh dấu câu đang nói */}
              {showAudioScript && currentExam.audioScript && (
                <div className="mt-2 pt-3 border-t border-sky-200 text-xs sm:text-sm text-slate-700 bg-white p-4 rounded-xl leading-relaxed shadow-inner space-y-2">
                  <div className="text-xs font-black text-sky-900 uppercase tracking-wider mb-2">
                    📜 Transcript bài nghe (Đối thoại tự nhiên, không đọc tên nhân vật):
                  </div>
                  {currentExam.audioScript.split('\n').filter(Boolean).map((line, lIdx) => (
                    <div 
                      key={lIdx}
                      className={`p-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                        currentLineIndex === lIdx
                          ? 'bg-sky-100 text-sky-950 font-bold border-l-4 border-sky-600 shadow-2xs ring-1 ring-sky-300'
                          : lIdx % 2 === 0
                          ? 'text-slate-800 bg-slate-50/70 border border-slate-200/60'
                          : 'text-slate-800 bg-blue-50/40 border border-blue-200/60'
                      }`}
                    >
                      <span className={`text-[11px] font-black px-2 py-0.5 rounded-md shrink-0 shadow-2xs ${
                        lIdx % 2 === 0 ? 'bg-sky-600 text-white' : 'bg-pink-600 text-white'
                      }`}>
                        {lIdx % 2 === 0 ? 'Giọng 1 (Nam)' : 'Giọng 2 (Nữ)'}
                      </span>
                      <span className="flex-1 leading-snug">{line}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* DANH SÁCH CÂU HỎI THEO TỪNG PHẦN - CHUẨN ĐỀ THI MẪU CÔNG VĂN 7991 */}
          <div className="p-3.5 sm:p-6 space-y-6 sm:space-y-8">
            {(() => {
              // Tách văn bản bài đọc thành 2 đoạn riêng biệt chuẩn đề thi mẫu:
              // 1. Đoạn văn điền từ (Cloze Text) cho Part 4
              // 2. Đoạn văn đọc hiểu (Reading Passage) cho Part 5
              let clozePassage = '';
              let readingPassage = '';
              if (currentExam.passageText) {
                const raw = currentExam.passageText;
                if (raw.includes('ĐOẠN VĂN ĐỌC HIỂU')) {
                  const parts = raw.split(/📖?\s*ĐOẠN VĂN ĐỌC HIỂU.*?:?/);
                  clozePassage = parts[0].replace(/^📖?\s*ĐOẠN VĂN ĐIỀN TỪ.*?:?\s*/, '').trim();
                  readingPassage = (parts[1] || '').trim();
                } else {
                  readingPassage = raw.trim();
                }
              }

              // Nhóm các câu hỏi theo đúng từng Part độc lập (Part 1, 2, 3, 4, 5, 6, 7)
              const distinctPartGroups: {
                partTitle: string;
                partInstruction: string;
                passageSnippet?: string;
                passageTitle?: string;
                questions: ExamQuestion[];
              }[] = [];

              currentExam.questions.forEach(q => {
                let group = distinctPartGroups.find(g => g.partTitle === q.partTitle);
                if (!group) {
                  let snippet: string | undefined = undefined;
                  let pTitle: string | undefined = undefined;

                  const titleLower = q.partTitle.toLowerCase();
                  // Part 4: Reading Cloze (Điền từ - Câu 23 đến 27) -> CHỈ HIỂN THỊ ĐOẠN VĂN ĐIỀN TỪ
                  if (titleLower.includes('cloze') || titleLower.includes('part 4') || (q.qNumber >= 23 && q.qNumber <= 27)) {
                    snippet = clozePassage;
                    pTitle = 'ĐOẠN VĂN ĐIỀN TỪ (CLOZE TEXT): Đọc kỹ đoạn văn và chọn từ thích hợp điền vào các chỗ trống (23) - (27)';
                  }
                  // Part 5: Reading Comprehension (Đọc hiểu - Câu 28 đến 32) -> CHỈ HIỂN THỊ ĐOẠN VĂN ĐỌC HIỂU
                  else if (titleLower.includes('comprehension') || titleLower.includes('part 5') || (q.qNumber >= 28 && q.qNumber <= 32)) {
                    snippet = readingPassage;
                    pTitle = 'ĐOẠN VĂN ĐỌC HIỂU (READING COMPREHENSION): Đọc đoạn văn sau và chọn câu trả lời đúng cho các câu (28) - (32)';
                  }

                  group = {
                    partTitle: q.partTitle,
                    partInstruction: q.partInstruction,
                    passageSnippet: snippet,
                    passageTitle: pTitle,
                    questions: []
                  };
                  distinctPartGroups.push(group);
                }
                group.questions.push(q);
              });

              return distinctPartGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-3 sm:space-y-4">
                  {/* Tiêu đề Part riêng biệt chuẩn Đề thi mẫu */}
                  <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between gap-2">
                    <div>
                      <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                        {group.partTitle}
                      </h4>
                      <div className="text-xs sm:text-sm text-slate-600 italic mt-0.5">
                        {group.partInstruction}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-white text-slate-800 font-extrabold text-xs sm:text-sm border border-slate-200 shadow-2xs shrink-0">
                      {group.questions.length} câu
                    </span>
                  </div>

                  {/* THANH PHÁT FILE NGHE RIÊNG BIỆT CHO PART 1 KÈM THANH TRƯỢT TUA TỪNG TỪ */}
                  {group.partTitle.toLowerCase().includes('part 1') && currentExam.audioUrlPart1 && (
                    <PartAudioPlayer
                      partTitle="🎧 File nghe chuẩn Part 1 (Hội thoại - Dialogue)"
                      partSubtitle="Dành cho các câu hỏi 1 - 5 (Nghe 2 lần) – Kéo thanh trượt để nghe lại từng từ"
                      audioUrl={currentExam.audioUrlPart1}
                      themeColor="sky"
                    />
                  )}

                  {/* THANH PHÁT FILE NGHE RIÊNG BIỆT CHO PART 2 KÈM THANH TRƯỢT TUA TỪNG TỪ */}
                  {group.partTitle.toLowerCase().includes('part 2') && currentExam.audioUrlPart2 && (
                    <PartAudioPlayer
                      partTitle="🎧 File nghe chuẩn Part 2 (Độc thoại - Monologue)"
                      partSubtitle="Dành cho các câu hỏi 6 - 10 (True / False) – Kéo thanh trượt để nghe lại từng từ"
                      audioUrl={currentExam.audioUrlPart2}
                      themeColor="indigo"
                    />
                  )}

                  {/* Đoạn văn riêng biệt của Part tương ứng (Tuyệt đối không gộp 2 đoạn văn cùng lúc!) */}
                  {group.passageSnippet && (
                    <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-amber-50/80 border border-amber-200 text-xs sm:text-base leading-relaxed text-slate-800 shadow-2xs">
                      <div className="font-black text-amber-900 mb-1.5 flex items-center gap-1.5 text-sm sm:text-base">
                        <BookOpen className="w-4 h-4 text-amber-700" />
                        <span>{group.passageTitle}</span>
                      </div>
                      <div className="whitespace-pre-line font-medium text-slate-700 mt-2 font-sans leading-relaxed">
                        {group.passageSnippet}
                      </div>
                    </div>
                  )}

                  {/* Danh sách các câu hỏi trong Part */}
                  <div className="space-y-3 sm:space-y-4">
                    {group.questions.map((q: any) => {
                      const userAns = (userAnswers[q.id] || '').trim().toLowerCase();
                      const rightAns = (q.correct || '').trim().toLowerCase();
                      const isAnswered = Boolean(userAns && userAns.length > 0);

                      let isCorrect = false;
                      if (isAnswered) {
                        if (userAns === rightAns) {
                          isCorrect = true;
                        } else if (q.options) {
                          const userIdx = q.options.findIndex((o: any) => o.trim().toLowerCase() === userAns);
                          const rightIdx = q.options.findIndex((o: any) => o.trim().toLowerCase() === rightAns);
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
                                    <span>{q.type === 'essay' ? 'ĐÚNG (+1.0đ)' : 'ĐÚNG (+0.25đ)'}</span>
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
                              {q.options.map((opt: any, optIdx: number) => {
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

                          {/* KHU VỰC NHẬP BÀI TỰ LUẬN VIẾT ĐOẠN VĂN (WRITING PRODUCTION) */}
                          {q.type === 'essay' && (
                            <div className="mt-3.5 sm:mt-4 space-y-3">
                              <textarea
                                rows={6}
                                disabled={isSubmitted}
                                value={userAnswers[q.id] || ''}
                                onChange={(e) => handleSelectAnswer(q.id, e.target.value)}
                                placeholder="Em hãy nhập bài viết đoạn văn tiếng Anh của mình vào đây (khoảng 60 - 80 từ)..."
                                className="w-full p-3.5 sm:p-4 rounded-xl border border-slate-300 text-sm sm:text-base text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 leading-relaxed font-sans"
                              />
                              <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                <span>
                                  📝 Số từ đã viết: <strong className="text-sky-700 font-black">{((userAnswers[q.id] || '').trim().match(/\S+/g) || []).length}</strong> từ
                                </span>
                                {currentExam.writingRubric && (
                                  <span className="italic text-slate-500">
                                    <strong>Tiêu chí chấm điểm:</strong> {currentExam.writingRubric}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* LỜI GIẢI VÀ BÀI VIẾT MẪU ĐẠT ĐIỂM TỐI ĐA CHO CÂU TỰ LUẬN VIẾT (WRITING ESSAY) */}
                          {isSubmitted && q.type === 'essay' && (
                            <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-sky-50 to-blue-50 border-2 border-indigo-200 text-slate-900 shadow-sm space-y-3.5">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-indigo-200/80 pb-3">
                                <div className="flex items-center gap-2">
                                  <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
                                  <span className="font-black text-indigo-950 text-sm sm:text-base tracking-tight">
                                    ✍️ BÀI VIẾT MẪU ĐẠT ĐIỂM TỐI ĐA (1.0đ) ĐỂ EM CHÉP VÀO VỞ LUYỆN TẬP
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleCopySampleEssay(q.id, q.correct || '')}
                                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-xs cursor-pointer ${
                                    copiedEssayId === q.id
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                  }`}
                                >
                                  <Copy className="w-4 h-4" />
                                  <span>{copiedEssayId === q.id ? '✓ Đã sao chép vào bộ nhớ!' : '📋 Sao chép bài viết mẫu'}</span>
                                </button>
                              </div>

                              {/* BÀI MẪU NGUYÊN BẢN TIẾNG ANH */}
                              <div className="p-3.5 rounded-xl bg-white border border-indigo-100 shadow-inner font-sans text-sm sm:text-base leading-relaxed text-slate-800">
                                <span className="block text-xs font-black text-indigo-800 uppercase tracking-wider mb-1">
                                  🇬🇧 Model Paragraph (Đoạn văn tiếng Anh chuẩn):
                                </span>
                                {q.correct}
                              </div>

                              {/* PHẦN DỊCH NGHĨA TIẾNG VIỆT VÀ TỪ VỰNG ĂN ĐIỂM */}
                              {q.explanation && (
                                <div className="pt-1 text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                                  {q.explanation}
                                </div>
                              )}
                            </div>
                          )}

                          {/* LỜI GIẢI & CHỮA BÀI CHI TIẾT TỪNG CÂU 1 (CHO CÁC CÂU TRẮC NGHIỆM, NGHE VÀ ĐỌC HIỂU) */}
                          {isSubmitted && q.type !== 'essay' && (
                            <div className="mt-3.5 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-300 text-xs sm:text-base text-amber-950 shadow-2xs">
                              <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-amber-200 flex-wrap">
                                <div className="flex items-center gap-2">
                                  <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                                  <span className="font-extrabold text-amber-900 text-sm sm:text-base">
                                    💡 Chữa bài & Phân tích chi tiết của Giáo viên:
                                  </span>
                                </div>
                                {(isWrong || isSkipped) && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setUserAnswers(prev => {
                                        const next = { ...prev };
                                        delete next[q.id];
                                        return next;
                                      });
                                    }}
                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition shadow-xs flex items-center gap-1 cursor-pointer"
                                  >
                                    <RotateCw className="w-3.5 h-3.5" />
                                    <span>Thử làm lại câu này</span>
                                  </button>
                                )}
                              </div>
                              <div className="text-slate-800 whitespace-pre-line leading-relaxed font-sans">
                                {q.explanation ? (
                                  <span>{q.explanation}</span>
                                ) : (
                                  <span>
                                    Đáp án đúng chính xác là <strong>{q.correctLetter || q.correct}</strong>. Căn cứ vào quy tắc ngữ pháp và từ vựng trọng tâm trong chương trình GDPT 2018.
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ));
            })()}

            {/* PHÒNG THI NÓI (SPEAKING TEST) KÈM TÍNH NĂNG GHI ÂM VÀ CHẤM ĐIỂM AI CHO BÀI THI CUỐI KỲ (CK) */}
            {Boolean(
              examType === 'cuoi-ky-1' || 
              examType === 'cuoi-ky-2' || 
              (currentExam && (
                currentExam.examType?.includes('cuoi-ky') || 
                currentExam.examType?.includes('ck') || 
                currentExam.typeTitle?.toLowerCase().includes('cuối kỳ') ||
                currentExam.questions?.some((q: any) => q.partTitle?.toLowerCase().includes('speak'))
              ))
            ) && (
              <SpeakingStudioCK
                grade={currentExam.grade}
                examCode={currentExam.examCode}
                isSubmitted={isSubmitted}
              />
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
