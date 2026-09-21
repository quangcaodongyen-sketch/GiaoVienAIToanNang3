import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Download,
  Copy,
  Check,
  Crown,
  FileText,
  Play,
  CheckCircle2,
  AlertTriangle,
  FolderDown,
  Layers,
  FileCheck2,
  Headphones,
  Award,
  Volume2,
  Square
} from 'lucide-react';
import { BRAND, EXAM_RESOURCES } from '../config/brand';
import {
  getOrCreateExamHardwareCode,
  verifyExamLicenseKey,
  getSecureExamTrialRemaining,
  consumeSecureExamTrial,
  ExamVerifyResult
} from '../services/taodeKeyService';
import {
  generateExamSuite,
  exportToWordHtml,
  ExamSuiteData
} from '../services/examGeneratorEngine';

interface TaoDeTiengAnhModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

export const TaoDeTiengAnhModal: React.FC<TaoDeTiengAnhModalProps> = ({ isOpen, onClose, onOpenAdmin }) => {
  // Navigation tabs: 'experience' | 'download' | 'register'
  const [activeTab, setActiveTab] = useState<'experience' | 'download' | 'register'>('experience');

  // Trial limit system: 5 uses per computer
  const [trialRemaining, setTrialRemaining] = useState<number>(5);
  const [detectedMid, setDetectedMid] = useState<string>('');
  const [isProActive, setIsProActive] = useState<boolean>(false);
  const [verifyResult, setVerifyResult] = useState<ExamVerifyResult | null>(null);

  // Form State (Mặc định trung tính, không chứa địa danh riêng, bất kỳ giáo viên nào cũng dùng được ngay)
  const [selectedGrade, setSelectedGrade] = useState<string>('6');
  const [selectedTerm, setSelectedTerm] = useState<string>('GK1');
  const [numVariants, setNumVariants] = useState<number>(2);
  const [schoolName, setSchoolName] = useState<string>('TRƯỜNG THCS ........................................');
  const [parentAgency, setParentAgency] = useState<string>('PHÒNG GIÁO DỤC VÀ ĐÀO TẠO');
  const [schoolYear, setSchoolYear] = useState<string>('2026 - 2027');
  const [examDuration, setExamDuration] = useState<string>('60');

  // Preview sub-tab
  const [previewSubTab, setPreviewSubTab] = useState<'de1' | 'de2' | 'dapan' | 'matran' | 'audio'>('de1');

  // Generation state - Khởi tạo rỗng, khách hàng KHÔNG THỂ xem đề mẫu trước khi bấm Tạo đề!
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [examSuite, setExamSuite] = useState<ExamSuiteData | null>(null);

  // Audio Speech state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Pro registration form
  const [inputKey, setInputKey] = useState<string>('');
  const [teacherName, setTeacherName] = useState<string>('');
  const [teacherPhone, setTeacherPhone] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<'1year' | '2year' | 'lifetime'>('lifetime');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Initialize Hardware Code & Multi-Layer Anti-Tamper Trial Limit on open
  useEffect(() => {
    if (isOpen) {
      const code = getOrCreateExamHardwareCode();
      setDetectedMid(code);

      // Đọc số lượt dùng thử được ký số mật mã SHA-256 an toàn (Chống can thiệp F12)
      getSecureExamTrialRemaining(code).then(trials => {
        setTrialRemaining(trials);
      });

      // Kiểm tra License Key Pro đã lưu trước đó
      const savedKey = localStorage.getItem('gvai_taode_active_key');
      if (savedKey) {
        setInputKey(savedKey);
        verifyExamLicenseKey(savedKey, code).then(res => {
          if (res.isValid) {
            setIsProActive(true);
            setVerifyResult(res);
          }
        });
      }

      // Khách hàng KHÔNG THỂ xem trước đề mẫu tiếng anh. Chỉ có thể tạo đề mới!
      // Không tự động sinh đề tại đây.
    }
  }, [isOpen]);

  // Sinh đề kiểm tra mới & tính lượt dùng thử 5 đề/máy
  const handleGenerateExam = async () => {
    if (!isProActive) {
      const currentTrials = await getSecureExamTrialRemaining(detectedMid);
      if (currentTrials <= 0) {
        alert('⚠️ Thầy/Cô đã sử dụng hết 5 lượt dùng thử tạo đề tiếng Anh miễn phí trên máy tính này!\n\nVui lòng kích hoạt bản quyền Pro (hoặc liên hệ Thầy Thành: 0915.213717) để mở khóa tạo đề không giới hạn.');
        setActiveTab('register');
        return;
      }
      // Trừ 1 lượt an toàn kèm chữ ký số SHA-256 chống can thiệp F12 DevTools
      const nextRemaining = await consumeSecureExamTrial(detectedMid);
      setTrialRemaining(nextRemaining);
    }

    setIsGenerating(true);

    setTimeout(() => {
      const suite = generateExamSuite({
        grade: selectedGrade,
        term: selectedTerm,
        parentAgency,
        schoolName,
        schoolYear,
        timeMinutes: Number(examDuration) || 60
      });

      setExamSuite(suite);
      setIsGenerating(false);
    }, 1000);
  };

  // Kích hoạt License Key Pro
  const handleActivatePro = async () => {
    if (!inputKey.trim()) {
      alert('Vui lòng nhập License Key kích hoạt!');
      return;
    }

    const res = await verifyExamLicenseKey(inputKey, detectedMid);
    setVerifyResult(res);

    if (res.isValid) {
      setIsProActive(true);
      localStorage.setItem('gvai_taode_active_key', inputKey.trim().toUpperCase());
      alert(`🎉 KÍCH HOẠT BẢN QUYỀN PRO THÀNH CÔNG!\n\n${res.packageName}\nThời hạn: ${res.expiryDateStr}\nThầy/Cô đã có thể tạo đề không giới hạn.`);
      setActiveTab('experience');
    } else {
      alert(`❌ Kích hoạt thất bại: ${res.message}`);
    }
  };

  // Tải file Word (.doc) đúng 100% chuẩn văn bản desktop & add-in
  const handleDownloadDoc = () => {
    if (!examSuite) {
      alert('Vui lòng tạo đề trước khi tải về!');
      return;
    }
    const htmlContent = exportToWordHtml(examSuite);
    const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `De_Kiem_Tra_Tieng_Anh_${selectedGrade}_${selectedTerm}_CV7991.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Phát âm thanh tiếng Anh mô phỏng bài thi nghe
  const handleToggleAudio = () => {
    if (!examSuite) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của Thầy/Cô không hỗ trợ SpeechSynthesis.');
      return;
    }

    window.speechSynthesis.cancel();

    const dialogueText = examSuite.audioDialogue.map(([spk, txt]) => `${spk} ${txt}`).join('. ');
    const fullSpeech = `Part 1. Listen and circle the best answer A, B, or C. ${dialogueText}. Part 2. Listen and circle the best answer A or B. ${examSuite.audioMonologue}`;

    const utterance = new SpeechSynthesisUtterance(fullSpeech);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  // Sao chép nội dung
  const handleCopyText = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[920px] flex flex-col rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
        
        {/* HEADER MODAL */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <FileCheck2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-white tracking-wide">
                  TẠO ĐỀ KIỂM TRA TIẾNG ANH GLOBAL SUCCESS (CV 7991)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  CV 7991 CHUẨN 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Tác giả: Thầy giáo Đinh Văn Thành – ĐT/Zalo: <strong>{BRAND.phone}</strong> – Trường THCS Đồng Yên
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (isPlayingAudio) window.speechSynthesis.cancel();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 TABS NAVIGATION BAR */}
        <div className="px-4 sm:px-6 py-2 bg-slate-950 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('experience')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'experience'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Tab 1: Trải Nghiệm Trực Tuyến
          </button>

          <button
            onClick={() => setActiveTab('download')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'download'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Download className="w-4 h-4" />
            Tab 2: Tải Về & Hướng Dẫn
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            Tab 3: Bản Quyền & Kích Hoạt
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* ========================================================================= */}
          {/* TAB 1: TRẢI NGHIỆM TRỰC TUYẾN                                             */}
          {/* ========================================================================= */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              
              {/* TRIAL OR PRO STATUS BANNER */}
              {isProActive ? (
                <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-blue-950/80 border border-emerald-500/40 flex items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                      <Crown className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                        👑 BẢN QUYỀN PRO: ĐÃ KÍCH HOẠT CHÍNH THỨC
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Mã máy: <b className="text-cyan-300 font-mono">{detectedMid}</b> – Không giới hạn số lần tạo đề kiểm tra & đề cương ôn tập.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.removeItem('gvai_taode_active_key');
                      setIsProActive(false);
                      setVerifyResult(null);
                    }}
                    className="text-[10px] text-slate-500 hover:text-rose-400 underline cursor-pointer"
                  >
                    Đổi key
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-blue-500/40 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🎁</span>
                      <span className="font-bold text-xs sm:text-sm text-white">
                        DÙNG THỬ TẠO ĐỀ MIỄN PHÍ TRÊN MÁY TÍNH NÀY:
                      </span>
                      <span className="text-[11px] text-slate-300">
                        Đã sử dụng {5 - trialRemaining}/5 lượt
                      </span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                      trialRemaining > 2 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {trialRemaining > 0 ? `👉 Còn lại: ${trialRemaining} lượt` : 'Đã hết lượt dùng thử'}
                    </span>
                  </div>

                  {/* 5 Dấu Chấm Tiến Trình [ ● ● ● ○ ○ ] */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-slate-400 font-mono text-[11px]">Tiến trình:</span>
                    <div className="flex items-center gap-1.5 font-mono">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                            i < (5 - trialRemaining)
                              ? 'bg-cyan-500 text-slate-950 shadow-xs shadow-cyan-500/50'
                              : 'bg-slate-800 text-slate-500 border border-slate-700'
                          }`}
                        >
                          {i < (5 - trialRemaining) ? '●' : '○'}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 italic ml-auto hidden sm:inline">
                      (Mỗi máy tính được tạo 5 đề kiểm tra miễn phí)
                    </span>
                  </div>
                </div>
              )}

              {/* BỘ LỌC CẤU HÌNH SINH ĐỀ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                {/* 1. Chọn Lớp */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1 text-xs">
                    1. Khối lớp
                  </label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="6">Lớp 6 (Global Success)</option>
                    <option value="7">Lớp 7 (Global Success)</option>
                    <option value="8">Lớp 8 (Global Success)</option>
                    <option value="9">Lớp 9 (Global Success)</option>
                  </select>
                </div>

                {/* 2. Chọn Kỳ kiểm tra */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1 text-xs">
                    2. Kỳ kiểm tra
                  </label>
                  <select
                    value={selectedTerm}
                    onChange={(e) => setSelectedTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="GK1">Giữa Học Kì I (GK1)</option>
                    <option value="CK1">Cuối Học Kì I (CK1 - Kèm Nói)</option>
                    <option value="GK2">Giữa Học Kì II (GK2)</option>
                    <option value="CK2">Cuối Học Kì II (CK2 - Kèm Nói)</option>
                    <option value="KSCL">Khảo Sát Đầu Năm (KSCL)</option>
                  </select>
                </div>

                {/* 3. Số mã đề hoán vị */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1 text-xs">
                    3. Số mã đề
                  </label>
                  <select
                    value={numVariants}
                    onChange={(e) => setNumVariants(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value={2}>2 Mã đề (Hoán vị A/B)</option>
                    <option value={4}>4 Mã đề (Hoán vị toàn diện)</option>
                  </select>
                </div>

                {/* 4. Thời gian làm bài */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1 text-xs">
                    4. Thời gian
                  </label>
                  <select
                    value={examDuration}
                    onChange={(e) => setExamDuration(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="45">45 Phút</option>
                    <option value="60">60 Phút (Chuẩn CV 7991)</option>
                    <option value="90">90 Phút</option>
                  </select>
                </div>

                {/* Thông tin đơn vị (Tự do tùy chỉnh theo trường của giáo viên) */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold mb-1 text-xs">
                    Tên trường THCS (Giáo viên tự nhập trường của mình)
                  </label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                    placeholder="Ví dụ: TRƯỜNG THCS NGUYỄN DU"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold mb-1 text-xs">
                    Đơn vị chủ quản
                  </label>
                  <input
                    type="text"
                    value={parentAgency}
                    onChange={(e) => setParentAgency(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
                    placeholder="Ví dụ: PHÒNG GIÁO DỤC VÀ ĐÀO TẠO"
                  />
                </div>
              </div>

              {/* NÚT THAO TÁC SINH ĐỀ */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={handleGenerateExam}
                  disabled={isGenerating || (!isProActive && trialRemaining <= 0)}
                  className={`py-3 px-6 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all ${
                    !isProActive && trialRemaining <= 0
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-cyan-600/30 hover:scale-105 cursor-pointer'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  {isGenerating
                    ? 'AI Đang Biên Soạn Đề Chuẩn 100% CV 7991...'
                    : !isProActive && trialRemaining <= 0
                    ? 'Đã Hết Lượt Tạo Thử (0/5) - Nâng Cấp Pro'
                    : isProActive
                    ? '⚡ TẠO ĐỀ KIỂM TRA MỚI (CV 7991) - PRO'
                    : `⚡ TẠO ĐỀ KIỂM TRA MỚI (Còn ${trialRemaining}/5 đề thử)`}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadDoc}
                    disabled={!examSuite}
                    className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all ${
                      !examSuite
                        ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 hover:scale-105 cursor-pointer'
                    }`}
                    title={!examSuite ? 'Vui lòng bấm Tạo Đề trước khi tải file Word' : 'Tải file Word (.doc)'}
                  >
                    <Download className="w-4 h-4" />
                    Tải File Word (.doc) Chuẩn 100%
                  </button>
                </div>
              </div>

              {/* KHUNG XEM TRƯỚC 5 TAB CON (PREVIEW TABS) */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                {/* Sub-tabs header */}
                <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto">
                  <button
                    onClick={() => setPreviewSubTab('de1')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                      previewSubTab === 'de1'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    📄 1. Đề thi Mã {examSuite ? examSuite.code1 : `${selectedGrade}01`}
                  </button>
                  <button
                    onClick={() => setPreviewSubTab('de2')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                      previewSubTab === 'de2'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    📄 2. Đề thi Mã {examSuite ? examSuite.code2 : `${selectedGrade}02`} (Hoán vị)
                  </button>
                  <button
                    onClick={() => setPreviewSubTab('dapan')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                      previewSubTab === 'dapan'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    ✅ 3. Đáp án & Biểu điểm
                  </button>
                  <button
                    onClick={() => setPreviewSubTab('matran')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                      previewSubTab === 'matran'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    📊 4. Ma trận & Đặc tả (CV 7991)
                  </button>
                  <button
                    onClick={() => setPreviewSubTab('audio')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                      previewSubTab === 'audio'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    🎧 5. File Nghe Audio Scripts
                  </button>
                </div>

                {/* Sub-tab content */}
                <div className="p-4 relative">
                  {examSuite ? (
                    <>
                      {/* SUB-TAB 1 & 2: ĐỀ THI MÃ 1 HOẶC MÃ 2 (ĐÚNG NGUYÊN VĂN BẢN VÀ BẢNG ĐIỂM 100%) */}
                      {(previewSubTab === 'de1' || previewSubTab === 'de2') && (() => {
                        const currentExam = previewSubTab === 'de1' ? examSuite.examCode1 : examSuite.examCode2;
                        return (
                          <div className="p-6 rounded-xl bg-white text-slate-900 font-serif leading-relaxed text-[13pt] max-h-[500px] overflow-y-auto selection:bg-cyan-100 shadow-inner">
                            {/* KHUNG TIÊU ĐỀ 2 CỘT */}
                            <div className="grid grid-cols-2 gap-4 pb-2 text-center text-[11.5pt]">
                              <div>
                                <div className="font-bold uppercase">{examSuite.parentAgency}</div>
                                <div className="font-bold uppercase underline">{examSuite.schoolName}</div>
                              </div>
                              <div>
                                <div className="font-bold text-[12.5pt] uppercase">BÀI KIỂM TRA ĐÁNH GIÁ {examSuite.termTitle}</div>
                                <div className="font-bold">NĂM HỌC: {examSuite.schoolYear}</div>
                                <div className="font-bold">Môn: Tiếng Anh {examSuite.grade}</div>
                                <div className="italic text-[11pt]">Thời gian: {examSuite.timeMinutes} phút</div>
                              </div>
                            </div>

                            {/* DÒNG HỌ VÀ TÊN HỌC SINH */}
                            <div className="py-2 text-[13pt] flex items-center justify-between border-t border-slate-300">
                              <span>Full name: __________________________,</span>
                              <span>Class: {examSuite.grade}A___</span>
                              <span className="font-bold">Mã đề {currentExam.code}</span>
                            </div>

                            {/* BẢNG ĐIỂM (MARKS TABLE 3 HÀNG X 4 CỘT) ĐÚNG MẪU 100% */}
                            <table className="w-full border-collapse border border-black text-center text-[11.5pt] my-3">
                              <thead>
                                <tr>
                                  <th colSpan={2} className="border border-black p-1.5 w-1/4 font-bold">Marks</th>
                                  <th rowSpan={2} className="border border-black p-1.5 w-1/6 font-bold">Total</th>
                                  <th rowSpan={2} className="border border-black p-1.5 font-bold">Teacher’s remarks</th>
                                </tr>
                                <tr>
                                  <th className="border border-black p-1 w-1/8 font-bold">Speak</th>
                                  <th className="border border-black p-1 w-1/8 font-bold">Write</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="h-14">
                                  <td className="border border-black p-1"></td>
                                  <td className="border border-black p-1"></td>
                                  <td className="border border-black p-1"></td>
                                  <td className="border border-black p-2 text-left align-top text-[10pt] leading-loose">
                                    <div>___________________________________________________________</div>
                                    <div>___________________________________________________________</div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>

                            {/* CÁC PHẦN THI PART 1 ĐẾN PART 8 */}
                            {currentExam.parts.map((part, pIdx) => (
                              <div key={pIdx} className="mt-4">
                                <div className="font-bold text-[13pt] mb-1">{part.title} ({part.points})</div>
                                {part.passage && (
                                  <div className="text-justify indent-8 mb-2 leading-relaxed text-[13pt]">
                                    {part.passage}
                                  </div>
                                )}
                                <div className="space-y-1.5 pl-1">
                                  {part.questions.map((q, qIdx) => (
                                    <div key={qIdx} className="mb-2">
                                      <div className="text-[13pt]">
                                        <span className="font-bold mr-1">{q.num}</span> {q.stem}
                                      </div>
                                      {q.options && q.options.length > 0 && (
                                        <div className="pl-5 flex flex-wrap gap-x-6 gap-y-1 text-[13pt] mt-0.5">
                                          {q.options.map((opt, oIdx) => {
                                            const letter = String.fromCharCode(65 + oIdx);
                                            return (
                                              <span key={oIdx}>
                                                <strong className="mr-1">{opt.startsWith(letter + '.') ? '' : `${letter}.`}</strong>
                                                {opt}
                                              </span>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}

                            {/* PART 8: WRITING */}
                            <div className="mt-4">
                              <div className="font-bold text-[13pt] mb-1">
                                Part 8. Writing ({examSuite.hasSpeaking ? '0.8 pt' : '1.5 pts'}) {currentExam.writingPrompt}
                              </div>
                              <div className="italic pl-2 whitespace-pre-line text-[13pt] text-slate-800">
                                {currentExam.writingCues}
                              </div>
                            </div>

                            {/* CHÂN TRANG */}
                            <div className="text-center font-bold my-6 text-[12pt]">
                              ------The end------
                            </div>
                            <div className="text-right italic font-bold text-[11pt]">
                              Mã đề: {currentExam.code}
                            </div>
                          </div>
                        );
                      })()}

                      {/* SUB-TAB 3: ĐÁP ÁN & BIỂU ĐIỂM (BẢNG 4 CỘT 19 HÀNG) */}
                      {previewSubTab === 'dapan' && (
                        <div className="p-6 rounded-xl bg-white text-slate-900 font-serif leading-relaxed text-[13pt] max-h-[500px] overflow-y-auto selection:bg-cyan-100 shadow-inner">
                          <div className="text-left font-bold text-[11.5pt] mb-2">
                            <div>{examSuite.parentAgency}</div>
                            <div>{examSuite.schoolName}</div>
                          </div>
                          <div className="text-center font-bold mb-4">
                            <div className="text-[13.5pt]">HƯỚNG DẪN ĐÁP ÁN VÀ BIỂU ĐIỂM</div>
                            <div className="text-[13.5pt]">KIỂM TRA ĐÁNH GIÁ {examSuite.termTitle}</div>
                            <div className="text-[12.5pt]">NĂM HỌC: {examSuite.schoolYear} - MÔN: TIẾNG ANH {examSuite.grade} (MÃ ĐỀ {examSuite.code1} & {examSuite.code2})</div>
                          </div>

                          {/* NỘI DUNG BÀI NGHE */}
                          <div className="font-bold text-[13pt] mt-3 mb-1">
                            NỘI DUNG BÀI NGHE (AUDIO SCRIPTS - DÙNG CHO CẢ 2 MÃ ĐỀ)
                          </div>
                          <div className="font-bold text-[12pt] mt-2 mb-1">Part 1. Listen and circle the best answer A, B, or C. (1.0 pt)</div>
                          <div className="pl-4 space-y-1 mb-3 text-[12pt]">
                            {examSuite.audioDialogue.map(([spk, txt], idx) => (
                              <div key={idx}>
                                <strong>{spk}</strong> {txt}
                              </div>
                            ))}
                          </div>
                          <div className="font-bold text-[12pt] mt-2 mb-1">Part 2. Listen and circle the best answer A or B. (1.0 pt)</div>
                          <div className="text-justify indent-8 text-[12pt] mb-4">
                            {examSuite.audioMonologue}
                          </div>

                          {/* BẢNG ĐÁP ÁN TRẮC NGHIỆM 4 CỘT */}
                          <div className="font-bold text-[13pt] mt-3 mb-2">
                            I. PHẦN TRẮC NGHIỆM KHÁCH QUAN (36 CÂU = {examSuite.mcqTotalPts} ĐIỂM TRÊN ĐỀ VIẾT)
                          </div>
                          <table className="w-full border-collapse border border-black text-center text-[11pt] mb-4">
                            <thead>
                              <tr className="bg-slate-100">
                                <th className="border border-black p-2 w-[12%] font-bold">Câu</th>
                                <th className="border border-black p-2 w-[38%] font-bold">Đáp án MÃ ĐỀ {examSuite.code1}</th>
                                <th className="border border-black p-2 w-[12%] font-bold">Câu</th>
                                <th className="border border-black p-2 w-[38%] font-bold">Đáp án MÃ ĐỀ {examSuite.code2}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {examSuite.answerRows.map((row, idx) => (
                                <tr key={idx} className={idx % 2 === 1 ? 'bg-slate-50' : ''}>
                                  <td className="border border-black p-1">{row.col1Num}</td>
                                  <td className="border border-black p-1">{row.col1Ans}</td>
                                  <td className="border border-black p-1">{row.col2Num}</td>
                                  <td className="border border-black p-1">{row.col2Ans}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          {/* TỰ LUẬN VIẾT */}
                          <div className="font-bold text-[13pt] mt-4 mb-1">
                            II. PHẦN TỰ LUẬN VIẾT (PART 8: {examSuite.hasSpeaking ? '0.8 pt' : '1.5 pts'})
                          </div>
                          <div className="text-[12pt] space-y-1 mb-2">
                            {examSuite.writingRubric.map((r, idx) => (
                              <div key={idx}>{r}</div>
                            ))}
                          </div>
                          <div className="font-bold italic text-[12.5pt] mt-3 mb-1">
                            * Đoạn văn mẫu tham khảo (Sample writing):
                          </div>
                          <div className="text-justify indent-8 text-[12.5pt] mb-4 text-slate-800">
                            {examSuite.sampleWriting}
                          </div>

                          {/* PHẦN THI NÓI (SPEAKING) NẾU CÓ */}
                          {examSuite.hasSpeaking && (
                            <>
                              <div className="font-bold text-[13pt] mt-4 mb-2">
                                III. PHẦN THI NÓI (SPEAKING TEST: 2.0 ĐIỂM)
                              </div>
                              <table className="w-full border-collapse border border-black text-left text-[10pt] mb-4">
                                <thead>
                                  <tr className="bg-slate-100 text-center">
                                    <th className="border border-black p-2 w-[15%] font-bold">To do</th>
                                    <th className="border border-black p-2 w-[32%] font-bold">To say (Examiner)</th>
                                    <th className="border border-black p-2 w-[28%] font-bold">Response (Students)</th>
                                    <th className="border border-black p-2 w-[25%] font-bold">Back-up</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {examSuite.speakingRows.map(([todo, say, res, backup], idx) => (
                                    <tr key={idx}>
                                      <td className="border border-black p-2 text-center font-bold whitespace-pre-line">{todo}</td>
                                      <td className="border border-black p-2 whitespace-pre-line">{say}</td>
                                      <td className="border border-black p-2 whitespace-pre-line">{res}</td>
                                      <td className="border border-black p-2 whitespace-pre-line">{backup}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </>
                          )}

                          {/* TỔNG ĐIỂM */}
                          <div className="font-bold text-[12.5pt] mt-4 whitespace-pre-line border-t border-slate-300 pt-2">
                            {examSuite.scoreSummary}
                          </div>
                        </div>
                      )}

                      {/* SUB-TAB 4: MA TRẬN 15 CỘT & ĐẶC TẢ 7 CỘT CHUẨN CV 7991 */}
                      {previewSubTab === 'matran' && (
                        <div className="p-6 rounded-xl bg-white text-slate-900 font-serif leading-relaxed text-[11pt] max-h-[500px] overflow-y-auto selection:bg-cyan-100 shadow-inner">
                          {/* TIÊU ĐỀ MA TRẬN */}
                          <div className="text-center font-bold mb-3">
                            <div className="text-[11.5pt]">{examSuite.parentAgency} - {examSuite.schoolName}</div>
                            <div className="text-[12pt]">MA TRẬN ĐỀ KIỂM TRA ĐÁNH GIÁ {examSuite.termTitle} - NĂM HỌC {examSuite.schoolYear}</div>
                            <div className="text-[11pt]">MÔN: TIẾNG ANH {examSuite.grade} (GLOBAL SUCCESS) - THỜI GIAN LÀM BÀI: {examSuite.timeMinutes} PHÚT</div>
                            <div className="italic text-[9.5pt] font-normal">{examSuite.matrixSubtitle}</div>
                          </div>

                          {/* BẢNG MA TRẬN 15 CỘT */}
                          <div className="overflow-x-auto mb-6">
                            <table className="w-full border-collapse border border-black text-center text-[8pt]">
                              <thead>
                                <tr className="bg-[#E8EEF5]">
                                  {examSuite.matrixHeaders.map((h, idx) => (
                                    <th key={idx} className="border border-black p-1 font-bold">{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {examSuite.matrixRows.map((row, rIdx) => {
                                  const isTotal = row[0].startsWith("TỔNG");
                                  return (
                                    <tr key={rIdx} className={isTotal ? 'bg-[#F4F6F9] font-bold' : ''}>
                                      {row.map((val, cIdx) => (
                                        <td
                                          key={cIdx}
                                          className={`border border-black p-1 ${cIdx === 1 || cIdx === 2 ? 'text-left' : 'text-center'}`}
                                        >
                                          {val}
                                        </td>
                                      ))}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>

                          {/* TIÊU ĐỀ BẢN ĐẶC TẢ */}
                          <div className="text-center font-bold mb-3 border-t border-slate-300 pt-4">
                            <div className="text-[11.5pt]">BẢN ĐẶC TẢ KỸ THUẬT ĐỀ KIỂM TRA {examSuite.termTitle} - TIẾNG ANH {examSuite.grade}</div>
                            <div className="italic text-[9.5pt] font-normal">{examSuite.specSubtitle}</div>
                          </div>

                          {/* BẢNG ĐẶC TẢ 7 CỘT */}
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-black text-left text-[8pt]">
                              <thead>
                                <tr className="bg-[#E8EEF5] text-center">
                                  {examSuite.specHeaders.map((h, idx) => (
                                    <th key={idx} className="border border-black p-1.5 font-bold">{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {examSuite.specRows.map((row, rIdx) => (
                                  <tr key={rIdx}>
                                    {row.map((val, cIdx) => (
                                      <td
                                        key={cIdx}
                                        className={`border border-black p-1.5 whitespace-pre-line ${
                                          [0, 4, 5, 6].includes(cIdx) ? 'text-center' : 'text-left'
                                        }`}
                                      >
                                        {val}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* SUB-TAB 5: FILE NGHE AUDIO VỚI TRÌNH PHÁT MÔ PHỎNG GIỌNG BẢN XỨ */}
                      {previewSubTab === 'audio' && (
                        <div className="p-6 rounded-xl bg-white text-slate-900 font-serif leading-relaxed text-[13pt] max-h-[500px] overflow-y-auto selection:bg-cyan-100 shadow-inner space-y-4">
                          <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center">
                                <Headphones className="w-5 h-5" />
                              </div>
                              <div>
                                <h5 className="font-bold text-slate-900 text-sm">
                                  Phát âm thanh mô phỏng tiếng Anh (AI Voice English)
                                </h5>
                                <p className="text-xs text-slate-600">
                                  Giọng đọc chuẩn tiếng Anh Mỹ / Anh bám sát Audio Script đề thi.
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={handleToggleAudio}
                              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                                isPlayingAudio
                                  ? 'bg-rose-600 text-white animate-pulse'
                                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20'
                              }`}
                            >
                              {isPlayingAudio ? (
                                <>
                                  <Square className="w-4 h-4 fill-white" />
                                  Dừng Phát
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 fill-white" />
                                  Phát File Nghe
                                </>
                              )}
                            </button>
                          </div>

                          <div>
                            <div className="font-bold text-[13pt] mb-2 text-cyan-900">
                              Part 1. Dialogue Audio Script (Nghe hội thoại giữa Nam & Mai):
                            </div>
                            <div className="space-y-2 pl-4 text-[13pt]">
                              {examSuite.audioDialogue.map(([spk, txt], idx) => (
                                <div key={idx}>
                                  <strong className="text-slate-900">{spk}</strong> {txt}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-slate-200 pt-3">
                            <div className="font-bold text-[13pt] mb-2 text-cyan-900">
                              Part 2. Monologue Audio Script (Đoạn thông báo cộng đồng):
                            </div>
                            <div className="text-justify indent-8 text-[13pt] leading-relaxed">
                              {examSuite.audioMonologue}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    /* TRẠNG THÁI CHƯA BẤM TẠO ĐỀ: KHÁCH HÀNG KHÔNG THỂ XEM TRƯỚC ĐỀ MẪU */
                    <div className="py-12 px-4 text-center flex flex-col items-center justify-center space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <FileText className="w-7 h-7" />
                      </div>
                      <div className="max-w-md space-y-2">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                          Chưa Có Đề Kiểm Tra Nào Được Tạo
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Theo quy định bảo mật hệ thống, khách hàng không thể xem trước đề mẫu. Thầy/Cô hãy thiết lập Khối lớp, Kì kiểm tra và bấm nút <span className="text-cyan-400 font-bold">"TẠO ĐỀ KIỂM TRA MỚI (CV 7991)"</span> ở trên để khởi tạo bộ đề hoàn chỉnh.
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-medium text-amber-300">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>
                          {isProActive 
                            ? "Bản quyền Pro vĩnh viễn: Tạo đề không giới hạn" 
                            : `Hạn mức dùng thử: Còn ${trialRemaining}/5 đề trên máy tính này`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: TẢI BỘ CÀI DESKTOP, VIDEO HD & WORD ADD-IN                        */}
          {/* ========================================================================= */}
          {activeTab === 'download' && (
            <div className="space-y-4">
              
              {/* 1. TRÌNH PHÁT VIDEO FULL HD */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    Video hướng dẫn thao tác tạo đề kiểm tra & xuất ma trận CV 7991:
                  </span>
                  <span className="text-[11px] text-cyan-400 font-mono">Full HD 1080p</span>
                </div>

                <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
                  <video 
                    controls 
                    playsInline
                    preload="metadata"
                    poster="/Taodektcv7991.jpg"
                    className="w-full aspect-video max-h-[320px] object-contain bg-black"
                  >
                    <source src={EXAM_RESOURCES.videoDirectUrl} type="video/mp4" />
                    Trình duyệt không hỗ trợ thẻ video.
                  </video>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 px-1 gap-2">
                  <span>💡 Video hướng dẫn chi tiết từng bước tạo đề thi hoán vị và xuất ra Microsoft Word.</span>
                  <div className="flex items-center gap-3 shrink-0">
                    <a
                      href={EXAM_RESOURCES.videoWatchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      ▶ Mở tab mới
                    </a>
                  </div>
                </div>
              </div>

              {/* 2. BANNER TẢI TRỌN BỘ CÀI ĐẶT */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-blue-950/70 border border-cyan-500/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-cyan-200 flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-cyan-400" />
                      Trọn Bộ Cài Đặt Desktop & Word Add-in Tạo Đề Tiếng Anh THCS
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Bao gồm bộ cài tự động 1-click chạy trên Microsoft Word, bản Desktop độc lập và trọn bộ 20 đề mẫu kèm ma trận đặc tả chuẩn CV 7991.
                    </p>
                  </div>

                  <a
                    href={EXAM_RESOURCES.fullZipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 shrink-0 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Tải Trọn Bộ (Pass: 123)
                  </a>
                </div>
              </div>

              {/* 3. 4 LỰA CHỌN TẢI TỪNG PHẦN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. Bản Cài Đặt Chạy Trên Word */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                      .EXE
                    </div>
                    <h5 className="font-bold text-slate-200 text-xs">
                      Cài Đặt Chạy Trên Word
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      File: <code>Cai_Dat_Chay_Tren_Word.exe</code> (74 MB). Tự động gắn tab Tạo đề lên thanh Ribbon Word.
                    </p>
                  </div>
                  <a
                    href={EXAM_RESOURCES.fullZipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Tải Bộ Cài Word (.exe)
                  </a>
                </div>

                {/* 2. Bản Desktop Độc Lập */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                      .EXE
                    </div>
                    <h5 className="font-bold text-slate-200 text-xs">
                      Bản Chạy Trực Tiếp Desktop
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      File: <code>Tao_De_Tieng_Anh_Desktop.exe</code> (41 MB). Chạy ngay không cần cài đặt.
                    </p>
                  </div>
                  <a
                    href={EXAM_RESOURCES.fullZipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Tải Bản Desktop (.exe)
                  </a>
                </div>

                {/* 3. Đề Cương & Ma Trận Mẫu */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                      .DOCX
                    </div>
                    <h5 className="font-bold text-slate-200 text-xs">
                      Bộ Đề Mẫu & Ma Trận Đặc Tả
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Trọn bộ 20 đề thi Lớp 6, 7, 8, 9 kèm file Excel Ma trận & Bản đặc tả chuẩn CV 7991.
                    </p>
                  </div>
                  <a
                    href={EXAM_RESOURCES.fullZipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Tải Đề Mẫu (.docx)
                  </a>
                </div>

                {/* 4. Hướng Dẫn Sử Dụng */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      .TXT
                    </div>
                    <h5 className="font-bold text-slate-200 text-xs">
                      Hướng Dẫn Nhanh & Kích Hoạt
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Tài liệu chỉ dẫn chi tiết từng bước sử dụng phần mềm và kích hoạt bản quyền.
                    </p>
                  </div>
                  <a
                    href={EXAM_RESOURCES.fullZipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Tải Hướng Dẫn (.txt)
                  </a>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: BẢN QUYỀN & KÍCH HOẠT                                             */}
          {/* ========================================================================= */}
          {activeTab === 'register' && (
            <div className="space-y-4">
              
              {/* HARDWARE CODE & LICENSE KEY INPUT */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-400" />
                    <h4 className="text-sm font-bold text-white">
                      KÍCH HOẠT BẢN QUYỀN PRO CÔNG CỤ TẠO ĐỀ TIẾNG ANH
                    </h4>
                  </div>
                  {isProActive && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      ✓ Đã kích hoạt
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Mã Máy Hardware Code */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <label className="block text-xs font-bold text-slate-300">
                      MÃ MÁY TÍNH CỦA BẠN (HARDWARE CODE):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={detectedMid}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-cyan-300 font-mono text-sm font-bold select-all focus:outline-none"
                      />
                      <button
                        onClick={() => handleCopyText(detectedMid, 'mid')}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedSection === 'mid' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        Copy
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 italic">
                      * Hãy gửi mã máy này qua Zalo <strong>{BRAND.phone}</strong> (Thầy Thành) để nhận License Key Pro kích hoạt ngay.
                    </p>
                  </div>

                  {/* Ô Nhập License Key Pro */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <label className="block text-xs font-bold text-slate-300">
                      NHẬP LICENSE KEY KÍCH HOẠT:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={inputKey}
                        onChange={(e) => setInputKey(e.target.value.toUpperCase())}
                        placeholder="VD: DVT-EXAM-PRO-..."
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-mono text-sm font-bold uppercase focus:outline-none focus:border-amber-500"
                      />
                      <button
                        onClick={handleActivatePro}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold shadow-md shadow-amber-600/20 cursor-pointer"
                      >
                        Kích Hoạt
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 italic">
                      * Key Pro mở khóa tạo đề không giới hạn, đầy đủ đề thi và ma trận đặc tả chuẩn CV 7991.
                    </p>
                  </div>
                </div>
              </div>

              {/* BẢNG GIÁ CÁC GÓI BẢN QUYỀN */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Gói 1 Năm */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      GÓI 1 NĂM HỌC
                    </span>
                    <h5 className="font-black text-white text-sm">Gói Cơ Bản</h5>
                    <div className="text-xl font-black text-white">
                      200.000đ <span className="text-xs text-slate-400 font-normal">/năm</span>
                    </div>
                    <ul className="text-xs text-slate-300 space-y-1.5 pt-1">
                      <li className="flex items-center gap-1.5">✓ Tạo đề kiểm tra Lớp 6, 7, 8, 9</li>
                      <li className="flex items-center gap-1.5">✓ Tải file Word chuẩn CV 7991</li>
                      <li className="flex items-center gap-1.5">✓ Hạn sử dụng: 12 tháng</li>
                    </ul>
                  </div>
                  <a
                    href={`https://zalo.me/${BRAND.zalo}?text=Thay%20Thanh%20oi,%20toi%20muon%20dang%20ky%20Goi%201%20Nam%20Tao%20de%20Tieng%20Anh%20THCS.%20Ma%20may:%20${detectedMid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold text-center block transition-colors cursor-pointer"
                  >
                    Đăng Ký Qua Zalo
                  </a>
                </div>

                {/* Gói 2 Năm */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      TIẾT KIỆM 25%
                    </span>
                    <h5 className="font-black text-white text-sm">Gói 2 Năm Học</h5>
                    <div className="text-xl font-black text-cyan-400">
                      300.000đ <span className="text-xs text-slate-400 font-normal">/2 năm</span>
                    </div>
                    <ul className="text-xs text-slate-300 space-y-1.5 pt-1">
                      <li className="flex items-center gap-1.5">✓ Đầy đủ tính năng Pro</li>
                      <li className="flex items-center gap-1.5">✓ Tặng kèm Add-in Word chạy trực tiếp</li>
                      <li className="flex items-center gap-1.5">✓ Cập nhật đề mới miễn phí</li>
                    </ul>
                  </div>
                  <a
                    href={`https://zalo.me/${BRAND.zalo}?text=Thay%20Thanh%20oi,%20toi%20muon%20dang%20ky%20Goi%202%20Nam%20Tao%20de%20Tieng%20Anh%20THCS.%20Ma%20may:%20${detectedMid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold text-center block transition-colors cursor-pointer"
                  >
                    Đăng Ký Qua Zalo
                  </a>
                </div>

                {/* Gói Vĩnh Viễn */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-950/40 via-slate-950 to-slate-950 border-2 border-amber-500/50 space-y-3 flex flex-col justify-between shadow-xl shadow-amber-500/10">
                  <div className="space-y-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/30 text-amber-300 border border-amber-500/40">
                      👑 PHỔ BIẾN NHẤT
                    </span>
                    <h5 className="font-black text-white text-sm">Gói Vĩnh Viễn (Lifetime)</h5>
                    <div className="text-xl font-black text-amber-400">
                      500.000đ <span className="text-xs text-slate-400 font-normal">/trọn đời</span>
                    </div>
                    <ul className="text-xs text-slate-300 space-y-1.5 pt-1">
                      <li className="flex items-center gap-1.5">✓ Không giới hạn thời gian</li>
                      <li className="flex items-center gap-1.5">✓ Bản cài Word + Desktop + Web</li>
                      <li className="flex items-center gap-1.5">✓ Hỗ trợ kỹ thuật trực tiếp từ Thầy Thành</li>
                    </ul>
                  </div>
                  <a
                    href={`https://zalo.me/${BRAND.zalo}?text=Thay%20Thanh%20oi,%20toi%20muon%20dang%20ky%20Goi%20Vinh%20Vien%20Tao%20de%20Tieng%20Anh%20THCS.%20Ma%20may:%20${detectedMid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold text-center block shadow-md shadow-amber-600/20 cursor-pointer"
                  >
                    Đăng Ký Trọn Đời Qua Zalo
                  </a>
                </div>
              </div>

              {/* THÔNG TIN TÁC GIẢ & HỖ TRỢ */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <strong>Tác giả:</strong> Thầy giáo Đinh Văn Thành – Trường THCS Đồng Yên
                  <br />
                  <strong>Hotline / Zalo:</strong> <span className="text-cyan-400 font-mono font-bold">{BRAND.phone}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`https://zalo.me/${BRAND.zalo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    💬 Nhắn Tin Zalo Thầy Thành
                  </a>
                  {onOpenAdmin && (
                    <button
                      onClick={onOpenAdmin}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Quản Trị Admin
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
