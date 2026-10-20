import vocabularyService, { VocabItem, UnitInfo } from '../services/vocabularyService';
import audioPronunciationService, { VoiceAccent } from '../services/audioPronunciationService';
import { IpaChartPronunciationModal } from './IpaChartPronunciationModal';
import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  RotateCw, 
  Download, 
  Clock, 
  Award, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft, 
  Shuffle, 
  Filter, 
  Search,
  ExternalLink,
  BookMarked,
  Sparkles,
  FileText,
  Copy,
  Check
} from 'lucide-react';
import { BRAND } from '../config/brand';
import { OnlineQuizPortal } from './OnlineQuizPortal';
import { TextbookExercisePortal } from './TextbookExercisePortal';
import { StudentClassComparison } from './StudentClassComparison';
import { Trophy, Target } from 'lucide-react';

// Bộ dữ liệu từ vựng mẫu chuẩn Global Success
interface VocabItem {
  id: string;
  grade: number;
  unit: string;
  word: string;
  phonetic: string;
  type: string;
  meaning: string;
  example: string;
  exampleMeaning: string;
}


// Danh mục tài liệu đề thi tải về cho học sinh
interface StudentDownloadFile {
  id: string;
  title: string;
  subject: string;
  grade: string;
  format: string;
  size: string;
  url: string;
  description: string;
}

const DOWNLOADABLE_MATERIALS: StudentDownloadFile[] = [
  {
    id: 'mat-1',
    title: 'Đề kiểm tra Tiếng Anh 6 - Global Success (Chuẩn CV 7991)',
    subject: 'Tiếng Anh',
    grade: 'Lớp 6',
    format: 'DOC',
    size: '6 KB',
    url: '/De_Kiem_Tra_Tieng_Anh_6_Global_Success_CV7991.doc',
    description: 'Đề kiểm tra 4 kỹ năng bám sát ma trận, bản đặc tả và có đáp án chi tiết.'
  },
  {
    id: 'mat-2',
    title: 'Tài liệu hướng dẫn giải bài tập và ôn thi 8 môn THCS',
    subject: 'Tổng hợp',
    grade: 'Lớp 6, 7, 8, 9',
    format: 'DOCX',
    size: '25 KB',
    url: '/HUONG_DAN_TAO_DE_THCS_8_MON.docx',
    description: 'Phương pháp ôn tập và dạng bài trọng tâm môn Toán, Văn, Anh, KHTN...'
  },
  {
    id: 'mat-3',
    title: 'Đề cương ôn tập & Khung kiến thức Tiếng Anh THCS',
    subject: 'Tiếng Anh',
    grade: 'Lớp 9',
    format: 'DOCX',
    size: '38 KB',
    url: '/HUONG_DAN_SU_DUNG.docx',
    description: 'Tổng hợp từ vựng và chủ điểm ngữ pháp trọng tâm thi vào 10.'
  }
];

export const StudentPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'vocab' | 'sgk' | 'quiz' | 'downloads' | 'leaderboard'>('vocab');
  const [copiedLink, setCopiedLink] = useState(false);

  // State Học Từ Vựng
  const [vocabViewMode, setVocabViewMode] = useState<'full-app' | 'quick-cards'>('full-app');
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isFullscreenIframe, setIsFullscreenIframe] = useState<boolean>(false);
  const [selectedGrade, setSelectedGrade] = useState<number>(6);
  const [selectedUnit, setSelectedUnit] = useState<number>(1); // Mặc định Unit 1 bám sát SGK
  const [currentVocabIndex, setCurrentVocabIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [vocabSearch, setVocabSearch] = useState<string>('');

  // Danh sách các Unit chính thức theo SGK Global Success
  const availableUnits: UnitInfo[] = React.useMemo(() => {
    return vocabularyService.getUnitsByGrade(selectedGrade);
  }, [selectedGrade]);

  // Toàn bộ từ vựng đầy đủ 100% bám sát Unit và khối lớp
  const filteredVocab: VocabItem[] = React.useMemo(() => {
    return vocabularyService.getVocabulary(selectedGrade, selectedUnit, vocabSearch);
  }, [selectedGrade, selectedUnit, vocabSearch]);
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



  const currentWord = filteredVocab[currentVocabIndex] || filteredVocab[0];

  // Phát âm từ tiếng Anh bằng Audio Pronunciation Service chuẩn tuyệt đối (Microsoft Natural / Google US-UK)
  const speakWord = (text: string, customRate?: number) => {
    audioPronunciationService.speak(text, {
      accent: voiceAccent,
      rate: customRate || speechRate
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* HEADER GÓC HỌC SINH */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 border-2 border-blue-400/40 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-6 relative overflow-hidden border border-blue-700/40">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold mb-3 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            <span>Cổng Học Tập Dành Cho Học Sinh Toàn Quốc</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            GÓC HỌC TẬP & ÔN LUYỆN TRỰC TUYẾN
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Học từ vựng Tiếng Anh Global Success, làm đầy đủ Bài tập SGK theo từng phần (Getting Started, Closer Look, Skills...), Kiểm tra Online (5 bài/Unit, 20 câu/bài) chấm điểm ngay, và tải đề miễn phí.
          </p>
        </div>

        {/* Nút Chuyển Nhanh 4 Tính Năng Của Học Sinh */}
        <div className="relative z-10 flex flex-wrap items-center gap-2 mt-6">
          <button
            onClick={() => setActiveTab('vocab')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'vocab'
                ? 'bg-white text-blue-950 shadow-md font-black border-2 border-white'
                : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Học Từ Vựng 6 - 12</span>
          </button>

          <button
            onClick={() => setActiveTab('sgk')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'sgk'
                ? 'bg-white text-blue-950 shadow-md font-black border-2 border-white'
                : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>2. Bài Tập SGK Từng Phần</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-white text-blue-950 shadow-md font-black border-2 border-white'
                : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>3. Kiểm tra Online</span>
          </button>

          <button
            type="button"
            onClick={() => setIsIpaModalOpen(true)}
            className="px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-md border border-amber-300 hover:scale-105"
            title="Mở Bảng 44 Âm Chuẩn Quốc Tế IPA bám sát SGK Global Success"
          >
            <Sparkles className="w-4 h-4 text-slate-950 animate-bounce" />
            <span>🗣️ Bảng 44 Âm IPA Chuẩn</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                : 'bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>5. Thi Đua & Sổ Điểm Lớp</span>
          </button>

          <button
            onClick={() => setActiveTab('downloads')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'downloads'
                ? 'bg-white text-blue-950 shadow-md font-black border-2 border-white'
                : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>4. Tải Đề Kiểm Tra & Tài Liệu</span>
          </button>

          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText('https://dekiemtraso.com/hocsinh');
              setCopiedLink(true);
              setTimeout(() => setCopiedLink(false), 2500);
            }}
            title="Bấm để sao chép đường link gửi cho học sinh"
            className="ml-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-200 border border-cyan-400/40 text-xs font-bold transition cursor-pointer"
          >
            <span>🎓 dekiemtraso.com/hocsinh</span>
            {copiedLink ? (
              <span className="flex items-center gap-1 text-emerald-300 font-extrabold text-[11px]">
                <Check className="w-3.5 h-3.5" /> Đã chép
              </span>
            ) : (
              <span className="flex items-center gap-1 text-cyan-300 hover:text-white text-[11px]">
                <Copy className="w-3 h-3" /> Chép link
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ==================== PHÂN HỆ 1: HỌC TỪ VỰNG ==================== */}
      {activeTab === 'vocab' && (
        <div className="space-y-4">
          {/* Thanh Công Cụ Điều Khiển Chạy Song Song & Chọn Chế Độ */}
          <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-sm font-black text-xs flex items-center gap-1.5">
                <span>🎙️</span>
                <span className="hidden sm:inline">Nhạc Chant</span>
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    Siêu Trí Nhớ Từ Vựng 6 - 12 (Global Success)
                  </h3>
                  <span className="hidden md:inline-flex text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                    Chạy Trực Tiếp Trong Tab
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  Nhạc Chant Call & Response sôi động, 11 game ghi nhớ, phát âm chuẩn & thi 15 phút.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap ml-auto">
              {/* Nút Làm Mới App & Toàn Màn Hình */}
              <button
                type="button"
                onClick={() => setIframeKey(k => k + 1)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                title="Tải lại ứng dụng từ vựng"
              >
                <RotateCw className="w-4 h-4" />
                <span className="hidden sm:inline">Làm Mới</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFullscreenIframe(!isFullscreenIframe)}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition cursor-pointer flex items-center gap-1.5"
                title={isFullscreenIframe ? "Thu nhỏ giao diện" : "Phóng to toàn màn hình"}
              >
                <span>{isFullscreenIframe ? "✕ Thu Nhỏ" : "⛶ Toàn Màn Hình"}</span>
              </button>
            </div>
          </div>

          {/* APP HỌC TỪ VỰNG HOÀN CHỈNH TÍCH HỢP TRỰC TIẾP */}
          <div className={`w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-950 transition-all ${
            isFullscreenIframe 
              ? 'fixed inset-0 z-50 rounded-none h-screen flex flex-col' 
              : 'h-[880px] sm:h-[960px] lg:h-[1050px]'
          }`}>
            {isFullscreenIframe && (
              <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800 text-white shrink-0">
                <span className="text-xs font-bold flex items-center gap-2">
                  <span>🎓 Siêu Trí Nhớ Từ Vựng 6 - 12 (Chế độ Toàn Màn Hình)</span>
                </span>
                <button
                  onClick={() => setIsFullscreenIframe(false)}
                  className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  ✕ Đóng Toàn Màn Hình
                </button>
              </div>
            )}
            <iframe
              key={iframeKey}
              src="/tuvung/index.html"
              title="App Học Từ Vựng Tiếng Anh Lớp 6 - 12 (Global Success)"
              className="w-full h-full border-0 flex-1"
              allow="autoplay; microphone; clipboard-write"
            />
          </div>
        </div>
      )}

      {/* ==================== PHÂN HỆ 2: BÀI TẬP SGK TỪNG PHẦN ==================== */}
      {activeTab === 'sgk' && (
        <TextbookExercisePortal />
      )}

      {/* ==================== PHÂN HỆ 3: KIỂM TRA ONLINE ==================== */}
      {activeTab === 'quiz' && (
        <OnlineQuizPortal />
      )}

      {/* ==================== PHÂN HỆ 5: BẢNG THI ĐUA & SO SÁNH BẠN CÙNG LỚP ==================== */}
      {activeTab === 'leaderboard' && (
        <StudentClassComparison 
          onStartExercise={() => setActiveTab('sgk')}
          onStartQuiz={() => setActiveTab('quiz')}
        />
      )}

      {/* ==================== PHÂN HỆ 4: TẢI ĐỀ KIỂM TRA & TÀI LIỆU ==================== */}
      {activeTab === 'downloads' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-blue-600" />
                <span>Kho Đề Thi & Đề Cương Ôn Tập Tải Về Miễn Phí</span>
              </h3>
              <p className="text-xs text-slate-500">Các tệp tài liệu định dạng Word (.doc/.docx) và PDF có kèm đáp án để tự ôn ở nhà</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DOWNLOADABLE_MATERIALS.map(item => (
              <div 
                key={item.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold border border-blue-200 dark:border-blue-800">
                      {item.grade}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-400 font-bold">
                      {item.format} • {item.size}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                    {item.description}
                  </p>
                </div>

                <a
                  href={item.url}
                  download
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải tài liệu về máy</span>
                </a>
              </div>
            ))}
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
