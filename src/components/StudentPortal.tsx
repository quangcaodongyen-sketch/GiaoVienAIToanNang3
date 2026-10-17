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

const SAMPLE_VOCABULARY: VocabItem[] = [
  // LỚP 6
  {
    id: 'v6-1',
    grade: 6,
    unit: 'Unit 1: My New School',
    word: 'uniform',
    phonetic: '/ˈjuːnɪfɔːm/',
    type: 'noun',
    meaning: 'đồng phục',
    example: 'We wear our uniform to school on Mondays.',
    exampleMeaning: 'Chúng tôi mặc đồng phục đến trường vào các ngày thứ Hai.'
  },
  {
    id: 'v6-2',
    grade: 6,
    unit: 'Unit 1: My New School',
    word: 'calculator',
    phonetic: '/ˈkælkjuleɪtə(r)/',
    type: 'noun',
    meaning: 'máy tính cầm tay',
    example: 'You can use a calculator in maths lessons.',
    exampleMeaning: 'Bạn có thể sử dụng máy tính cầm tay trong giờ học Toán.'
  },
  {
    id: 'v6-3',
    grade: 6,
    unit: 'Unit 1: My New School',
    word: 'compass',
    phonetic: '/ˈkʌmpəs/',
    type: 'noun',
    meaning: 'com-pa / la bàn',
    example: 'I need a compass to draw a perfect circle.',
    exampleMeaning: 'Tôi cần một chiếc com-pa để vẽ một hình tròn hoàn hảo.'
  },
  // LỚP 7
  {
    id: 'v7-1',
    grade: 7,
    unit: 'Unit 1: Hobbies',
    word: 'community',
    phonetic: '/kəˈmjuːnəti/',
    type: 'noun',
    meaning: 'cộng đồng',
    example: 'She is very active in the local community.',
    exampleMeaning: 'Cô ấy rất tích cực tham gia các hoạt động trong cộng đồng địa phương.'
  },
  {
    id: 'v7-2',
    grade: 7,
    unit: 'Unit 2: Healthy Living',
    word: 'allergy',
    phonetic: '/ˈælədʒi/',
    type: 'noun',
    meaning: 'dị ứng',
    example: 'He has an allergy to seafood.',
    exampleMeaning: 'Anh ấy bị dị ứng với đồ hải sản.'
  },
  // LỚP 8
  {
    id: 'v8-1',
    grade: 8,
    unit: 'Unit 1: Leisure Time',
    word: 'origami',
    phonetic: '/ˌɒrɪˈɡɑːmi/',
    type: 'noun',
    meaning: 'nghệ thuật gấp giấy Nhật Bản',
    example: 'My sister enjoys folding paper into origami animals.',
    exampleMeaning: 'Chị tôi thích gấp giấy thành các con vật origami.'
  },
  {
    id: 'v8-2',
    grade: 8,
    unit: 'Unit 2: Life in the Countryside',
    word: 'harvest',
    phonetic: '/ˈhɑːvɪst/',
    type: 'noun / verb',
    meaning: 'vụ thu hoạch / thu hoạch mùa màng',
    example: 'Farmers are busy harvesting rice in the autumn.',
    exampleMeaning: 'Người nông dân bận rộn thu hoạch lúa vào mùa thu.'
  },
  // LỚP 9
  {
    id: 'v9-1',
    grade: 9,
    unit: 'Unit 1: Local Community',
    word: 'artisan',
    phonetic: '/ˌɑːtɪˈzæn/',
    type: 'noun',
    meaning: 'nghệ nhân / thợ thủ công lành nghề',
    example: 'Bat Trang pottery village has many skilled artisans.',
    exampleMeaning: 'Làng gốm Bát Tràng có rất nhiều nghệ nhân lành nghề.'
  },
  {
    id: 'v9-2',
    grade: 9,
    unit: 'Unit 2: City Life',
    word: 'cosmopolitan',
    phonetic: '/ˌkɒzməˈpɒlɪtən/',
    type: 'adjective',
    meaning: 'mang tính quốc tế / đa văn hóa',
    example: 'Hanoi is becoming a modern, cosmopolitan city.',
    exampleMeaning: 'Hà Nội đang dần trở thành một thành phố hiện đại, đa văn hóa.'
  },
  // LỚP 10
  {
    id: 'v10-1',
    grade: 10,
    unit: 'Unit 1: Family Life',
    word: 'breadwinner',
    phonetic: '/ˈbredwɪnə(r)/',
    type: 'noun',
    meaning: 'trụ cột gia đình (người kiếm tiền chính)',
    example: 'In many families, both parents are now the breadwinners.',
    exampleMeaning: 'Trong nhiều gia đình hiện nay, cả bố và mẹ đều là trụ cột kinh tế.'
  },
  // LỚP 11
  {
    id: 'v11-1',
    grade: 11,
    unit: 'Unit 1: A Long and Healthy Life',
    word: 'longevity',
    phonetic: '/lɒnˈdʒevəti/',
    type: 'noun',
    meaning: 'tuổi thọ / sự sống lâu',
    example: 'A balanced diet and regular exercise contribute to longevity.',
    exampleMeaning: 'Chế độ ăn cân đối và tập thể dục thường xuyên giúp tăng tuổi thọ.'
  },
  // LỚP 12
  {
    id: 'v12-1',
    grade: 12,
    unit: 'Unit 1: Life Stories We Admire',
    word: 'perseverance',
    phonetic: '/ˌpɜːsɪˈvɪərəns/',
    type: 'noun',
    meaning: 'sự kiên trì, bền bỉ',
    example: 'Success requires both talent and great perseverance.',
    exampleMeaning: 'Thành công đòi hỏi cả tài năng lẫn sự kiên trì to lớn.'
  }
];

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
  const [currentVocabIndex, setCurrentVocabIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [vocabSearch, setVocabSearch] = useState<string>('');

  // Lọc từ vựng theo khối lớp và tìm kiếm
  const filteredVocab = SAMPLE_VOCABULARY.filter(item => {
    const matchGrade = selectedGrade === 0 || item.grade === selectedGrade;
    const matchSearch = vocabSearch.trim() === '' || 
      item.word.toLowerCase().includes(vocabSearch.toLowerCase()) ||
      item.meaning.toLowerCase().includes(vocabSearch.toLowerCase());
    return matchGrade && matchSearch;
  });

  const currentWord = filteredVocab[currentVocabIndex] || filteredVocab[0];

  // Phát âm từ tiếng Anh bằng Web Speech API giọng chuẩn bản xứ
  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9; // Tốc độ vừa phải cho học sinh
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Trình duyệt của bạn chưa hỗ trợ phát âm tự động.');
    }
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
              {/* Nút Chuyển chế độ: App Đầy Đủ vs Thẻ Nhanh */}
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setVocabViewMode('full-app')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    vocabViewMode === 'full-app'
                      ? 'bg-blue-600 text-white shadow-xs font-black'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  ⚡ App Đầy Đủ (11 Chế Độ)
                </button>
                <button
                  type="button"
                  onClick={() => setVocabViewMode('quick-cards')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                    vocabViewMode === 'quick-cards'
                      ? 'bg-blue-600 text-white shadow-xs font-black'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  🃏 Thẻ Học Nhanh
                </button>
              </div>

              {/* Nút Mở Tab Riêng Song Song */}
              <a
                href="/tuvung/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                title="Mở ứng dụng học từ vựng trong tab trình duyệt riêng để chạy song song"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Mở Tab Riêng Song Song</span>
              </a>

              {/* Nút Làm Mới App */}
              {vocabViewMode === 'full-app' && (
                <>
                  <button
                    type="button"
                    onClick={() => setIframeKey(k => k + 1)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer"
                    title="Tải lại ứng dụng từ vựng"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsFullscreenIframe(!isFullscreenIframe)}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-bold text-xs transition cursor-pointer"
                    title={isFullscreenIframe ? "Thu nhỏ giao diện" : "Phóng to toàn màn hình"}
                  >
                    {isFullscreenIframe ? "✕ Thu Nhỏ" : "⛶ Toàn Màn Hình"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* CHẾ ĐỘ 1: APP HỌC TỪ VỰNG HOÀN CHỈNH (NHÚNG TRỰC TIẾP CHẠY TRONG TAB) */}
          {vocabViewMode === 'full-app' ? (
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
          ) : (
            /* CHẾ ĐỘ 2: THẺ FLASHCARD NHANH */
            <div className="space-y-6">
              {/* Thanh lọc theo khối lớp */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5 text-blue-600" />
                    <span>Chọn khối lớp:</span>
                  </span>
                  {[6, 7, 8, 9, 10, 11, 12].map(grade => (
                    <button
                      key={grade}
                      onClick={() => {
                        setSelectedGrade(grade);
                        setCurrentVocabIndex(0);
                        setIsFlipped(false);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        selectedGrade === grade
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      Lớp {grade}
                    </button>
                  ))}
                </div>

                {/* Ô tìm kiếm từ */}
                <div className="relative min-w-[220px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm từ vựng hoặc nghĩa..."
                    value={vocabSearch}
                    onChange={e => {
                      setVocabSearch(e.target.value);
                      setCurrentVocabIndex(0);
                      setIsFlipped(false);
                    }}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* KHUNG FLASHCARD 3D TƯƠNG TÁC */}
              {currentWord ? (
                <div className="max-w-2xl mx-auto space-y-4">
                  <div 
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="min-h-[320px] sm:min-h-[360px] bg-white dark:bg-slate-900 rounded-3xl border-2 border-blue-500/30 hover:border-blue-500 p-8 flex flex-col justify-between items-center text-center shadow-xl cursor-pointer transition-all duration-300 hover:shadow-2xl relative select-none"
                  >
                    <div className="w-full flex items-center justify-between text-xs text-slate-400">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 font-bold border border-blue-200 dark:border-blue-800">
                        Lớp {currentWord.grade} • {currentWord.unit}
                      </span>
                      <span className="font-semibold text-slate-500">
                        Từ {currentVocabIndex + 1} / {filteredVocab.length}
                      </span>
                    </div>

                    {!isFlipped ? (
                      <div className="my-auto space-y-3">
                        <h3 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                          {currentWord.word}
                        </h3>
                        <p className="text-lg text-blue-600 dark:text-blue-400 font-mono font-medium">
                          {currentWord.phonetic}
                        </p>
                        <span className="inline-block px-3 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                          ({currentWord.type})
                        </span>
                        <div className="pt-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              speakWord(currentWord.word);
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
                            title="Bấm để nghe phát âm chuẩn bản xứ"
                          >
                            <Volume2 className="w-4 h-4 animate-bounce" />
                            <span>Nghe phát âm chuẩn</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="my-auto space-y-4 animate-fadeIn">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                          Ý Nghĩa Tiếng Việt
                        </span>
                        <h3 className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
                          {currentWord.meaning}
                        </h3>
                        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-left border border-slate-200 dark:border-slate-700 text-xs sm:text-sm">
                          <p className="font-medium text-slate-900 dark:text-white mb-1">
                            💬 <span className="italic">{currentWord.example}</span>
                          </p>
                          <p className="text-slate-500 dark:text-slate-400">
                            👉 {currentWord.exampleMeaning}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="w-full flex items-center justify-center text-xs text-slate-400 gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <RotateCw className="w-3.5 h-3.5 text-blue-500" />
                      <span>Bấm vào thẻ để lật xem {isFlipped ? 'Mặt trước (Tiếng Anh)' : 'Mặt sau (Tiếng Việt)'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <button
                      disabled={currentVocabIndex === 0}
                      onClick={() => {
                        setCurrentVocabIndex(prev => Math.max(0, prev - 1));
                        setIsFlipped(false);
                      }}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Từ trước</span>
                    </button>

                    <button
                      onClick={() => {
                        const randomIndex = Math.floor(Math.random() * filteredVocab.length);
                        setCurrentVocabIndex(randomIndex);
                        setIsFlipped(false);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      title="Xáo trộn ngẫu nhiên để luyện phản xạ"
                    >
                      <Shuffle className="w-4 h-4 text-purple-600" />
                      <span>Xáo trộn</span>
                    </button>

                    <button
                      disabled={currentVocabIndex === filteredVocab.length - 1}
                      onClick={() => {
                        setCurrentVocabIndex(prev => Math.min(filteredVocab.length - 1, prev + 1));
                        setIsFlipped(false);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <span>Từ tiếp theo</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-slate-500">Không tìm thấy từ vựng phù hợp với từ khóa "{vocabSearch}"</p>
                </div>
              )}
            </div>
          )}
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
    </div>
  );
};
