import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Download,
  Key,
  Copy,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Play,
  FileText,
  Check,
  AlertCircle,
  Printer,
  CheckCircle2,
  GraduationCap,
  Crown,
  Layers,
  ChevronRight,
  FolderDown,
  FileCheck,
  MessageCircle
} from 'lucide-react';
import { BRAND } from '../config/brand';
import { activityTrackingService } from '../services/activityTrackingService';
import { TrialRegisterModal } from './TrialRegisterModal';
import {
  getOrCreateTHCS8MHardwareCode,
  getSecureTHCS8MTrialRemaining,
  consumeSecureTHCS8MTrial,
  isTHCS8MVIPActivated,
  getTHCS8MActivePackage,
  activateTHCS8MLicense,
  
} from '../services/taoDeTHCS8MonKeyService';
import {
  downloadTHCS8MonWordDoc,
  getTHCS8MonExamSuite,
  
} from '../services/thcs8MonWordExportService';

interface TaoDeTHCS8MonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
  initialSubject?: string;
}

// Dữ liệu 8 Môn Học THCS chuẩn CV 7991 & Sách Kết nối tri thức
const SUBJECT_OPTIONS = [
  {
    id: 'TOAN',
    name: 'MÔN TOÁN HỌC',
    icon: '📐',
    badge: 'Đại số & Hình học',
    color: '#2563eb',
    desc: 'Trắc nghiệm 3.0đ (12 câu) + Tự luận 7.0đ (5 bài: Đại số, Hình học, Thực tế). Công thức MathType chuẩn in ấn.'
  },
  {
    id: 'VAN',
    name: 'MÔN NGỮ VĂN',
    icon: '📖',
    badge: 'Đọc hiểu & Viết',
    color: '#dc2626',
    desc: 'Phần I: Đọc hiểu 6.0đ (Ngữ liệu ngoài SGK + 8 TN + 2 TL ngắn) + Phần II: Viết 4.0đ (Tự sự, Nghị luận).'
  },
  {
    id: 'ENG',
    name: 'MÔN TIẾNG ANH',
    icon: '🇬🇧',
    badge: 'Global Success',
    color: '#0284c7',
    desc: 'Listening (Hội thoại Nam-Nữ & Độc thoại), Language, Reading, Writing, Speaking Test 2.0đ & Audio Scripts.'
  },
  {
    id: 'KHTN',
    name: 'MÔN KHOA HỌC TỰ NHIÊN',
    icon: '🔬',
    badge: 'Lí - Hóa - Sinh',
    color: '#059669',
    desc: 'Tích hợp 3 phân môn Vật lí, Hóa học, Sinh học chuẩn CT 2018 (Trắc nghiệm 4.0đ + Tự luận 6.0đ).'
  },
  {
    id: 'SUDIA',
    name: 'MÔN LỊCH SỬ VÀ ĐỊA LÍ',
    icon: '🌍',
    badge: 'Sử 50% - Địa 50%',
    color: '#d97706',
    desc: 'Phân môn Lịch sử 5.0đ + Phân môn Địa lí 5.0đ, kết hợp trắc nghiệm khách quan và tự luận thực tiễn.'
  },
  {
    id: 'TIN',
    name: 'MÔN TIN HỌC',
    icon: '💻',
    badge: 'Kỹ năng số & Python',
    color: '#0891b2',
    desc: 'Trắc nghiệm kiến thức số 4.0đ + Tự luận bảng tính Excel, CSDL và Lập trình Python 6.0đ.'
  },
  {
    id: 'GDCD',
    name: 'MÔN GIÁO DỤC CÔNG DÂN',
    icon: '⚖️',
    badge: 'Đạo đức & Pháp luật',
    color: '#e11d48',
    desc: 'Trắc nghiệm chuẩn mực đạo đức 4.0đ + Tự luận xử lý tình huống pháp luật thực tiễn đời sống 6.0đ.'
  },
  {
    id: 'CN',
    name: 'MÔN CÔNG NGHỆ',
    icon: '⚙️',
    badge: 'Kỹ thuật đời sống',
    color: '#ea580c',
    desc: 'Trắc nghiệm kỹ thuật 4.0đ + Tự luận trồng trọt, bản vẽ cơ khí và mạch điện gia đình 6.0đ.'
  }
];

export const TaoDeTHCS8MonModal: React.FC<TaoDeTHCS8MonModalProps> = ({
  isOpen,
  onClose,
  onOpenAdmin,
  initialSubject = 'TOAN'
}) => {
  const [activeTab, setActiveTab] = useState<'online' | 'download' | 'license'>('online');
  const [showTrialRegister, setShowTrialRegister] = useState<boolean>(false);
  const [hwid, setHwid] = useState<string>('DVT-TH8M-XXXX-XXXX');
  const [remainingTrials, setRemainingTrials] = useState<number>(5);
  const [isVIP, setIsVIP] = useState<boolean>(false);
  const [activePkgInfo, setActivePkgInfo] = useState<any>(null);

  // License state
  const [licenseKeyInput, setLicenseKeyInput] = useState<string>('');
  const [activationMsg, setActivationMsg] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });
  const [isActivating, setIsActivating] = useState<boolean>(false);

  // Online Studio Filter State
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject);
  useEffect(() => {
    if (isOpen && initialSubject) {
      setSelectedSubject(initialSubject);
    }
  }, [isOpen, initialSubject]);

  const [selectedGrade, setSelectedGrade] = useState<string>('7');
  const [selectedExamType, setSelectedExamType] = useState<string>('GK1');
  const [examCode, setExamCode] = useState<string>('701');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [previewSubTab, setPreviewSubTab] = useState<'exam' | 'matrix' | 'answer'>('exam');


  // Lắng nghe phím Escape (Esc) để đóng modal ngay lập tức
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Esc") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      const code = getOrCreateTHCS8MHardwareCode();
      setHwid(code);
      const vip = isTHCS8MVIPActivated();
      setIsVIP(vip);
      setActivePkgInfo(getTHCS8MActivePackage());
      if (!vip) {
        getSecureTHCS8MTrialRemaining().then(setRemainingTrials);
      } else {
        setRemainingTrials(999);
      }
    }
  }, [isOpen]);

  // Đồng bộ mã đề khi đổi lớp
  useEffect(() => {
    setExamCode(`${selectedGrade}01`);
  }, [selectedGrade]);

  const handleGenerateExam = async () => {
    if (!isVIP && remainingTrials <= 0) {
      alert('Thầy/Cô đã hoàn thành 5/5 lượt dùng thử trực tuyến miễn phí trên máy tính này!\n\nQuý Thầy/Cô vui lòng bấm Liên hệ Zalo Thầy Thành (0915.213717) để nhận báo giá ưu đãi sư phạm và kích hoạt bản quyền tiếp tục sử dụng không giới hạn.');
      setActiveTab('license');
      return;
    }

    setIsGenerating(true);
    try {
      // Giả lập sinh ma trận và hoán vị đề ngẫu nhiên
      await new Promise((r) => setTimeout(r, 650));

      // Đổi mã đề sang mã kế tiếp (601 -> 602...)
      const currentNum = parseInt(examCode.slice(-2), 10) || 1;
      const nextNum = currentNum % 2 === 1 ? currentNum + 1 : currentNum - 1;
      setExamCode(`${selectedGrade}0${nextNum}`);

      if (!isVIP) {
        const nextTrials = await consumeSecureTHCS8MTrial();
        setRemainingTrials(nextTrials);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyExam = () => {
    const el = document.getElementById('thcs-exam-preview-content');
    if (el) {
      navigator.clipboard.writeText(el.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Tải file Word (.doc) chuẩn định dạng mẫu 100% Bộ GD&ĐT & CV 7991
  const handleDownloadDoc = () => {
    try {
      downloadTHCS8MonWordDoc(selectedSubject, selectedGrade, selectedExamType, examCode);
    } catch (err) {
      console.error('Download word error:', err);
      alert('Có lỗi khi tải file Word, vui lòng thử lại.');
    }
  };


  const handleActivateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKeyInput.trim()) {
      setActivationMsg({ text: 'Vui lòng nhập Mã bản quyền Pro!', type: 'error' });
      return;
    }
    setIsActivating(true);
    try {
      const res = await activateTHCS8MLicense(licenseKeyInput, hwid);
      if (res.isValid) {
        setIsVIP(true);
        setRemainingTrials(999);
        setActivePkgInfo(getTHCS8MActivePackage());
        setActivationMsg({ text: res.message || 'Kích hoạt Bản quyền VIP thành công!', type: 'success' });
      } else {
        setActivationMsg({ text: res.message || 'Mã bản quyền không đúng hoặc không khớp Mã máy!', type: 'error' });
      }
    } finally {
      setIsActivating(false);
    }
  };

  if (!isOpen) return null;

  const currentSubjectObj = SUBJECT_OPTIONS.find(s => s.id === selectedSubject) || SUBJECT_OPTIONS[0];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-[#0A1128] text-slate-100 w-full max-w-6xl rounded-2xl shadow-2xl border border-blue-900/60 flex flex-col max-h-[96vh] overflow-hidden my-auto cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* HEADER BAR */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0A1128] border-b border-blue-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-[#0F172A] rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  TẠO ĐỀ KIỂM TRA {currentSubjectObj.name} (CV 7991)
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  CÔNG VĂN 7991/BGDĐT
                </span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 hidden sm:inline-block">
                  KẾT NỐI TRI THỨC
                </span>
                {isVIP && (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> VIP PRO
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Hệ thống tự động sinh Ma trận, Bản đặc tả kỹ thuật, Đề thi in ấn A4 và Đáp án chi tiết dành riêng cho {currentSubjectObj.name} chuẩn CV 7991/BGDĐT.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/70 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/40 transition-colors cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center justify-between px-4 sm:px-6 bg-[#0B132B] border-b border-slate-800">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('online')}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'online'
                  ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Trải nghiệm Trực Tuyến</span>
              {!isVIP && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-slate-800 text-amber-300 font-mono border border-slate-700">
                  {remainingTrials}/5 lượt
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('download')}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'download'
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Tải Về & Hướng Dẫn</span>
            </button>

            <button
              onClick={() => setActiveTab('license')}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'license'
                  ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Key className="w-4 h-4 text-amber-400" />
              <span>Bản Quyền & Kích Hoạt</span>
              {isVIP ? (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700">
                  ĐÃ KÍCH HOẠT
                </span>
              ) : (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                  PRO
                </span>
              )}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
            <span>Chủ nhiệm dự án:</span>
            <strong className="text-white font-medium">Thầy giáo Đinh Văn Thành (0915.213717)</strong>
          </div>
        </div>

        {/* TAB 1: TRẢI NGHIỆM TRỰC TUYẾN */}
        {activeTab === 'online' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* Thanh thông báo dùng thử 5 lần */}
            <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 p-3 sm:p-4 rounded-xl border border-blue-800/40 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white">Chính Sách Dùng Thử Trực Tuyến:</span>
                    <span className="text-xs font-semibold text-amber-300">
                      {isVIP ? `Vô hạn (${activePkgInfo?.packageName || 'VIP'})` : `Còn ${remainingTrials}/5 lượt trên máy tính này`}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Định dạng Times New Roman 13pt, chữ màu <span className="font-bold text-red-400">đỏ #FF0000</span> đánh dấu các tiêu đề và đáp án chuẩn khảo thí BGD&ĐT.
                  </p>
                </div>
              </div>

              {/* 5 Chấm tiến trình trực quan */}
              <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 mr-1.5">Tiến trình:</span>
                {[1, 2, 3, 4, 5].map((dot) => (
                  <span
                    key={dot}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      isVIP || dot <= remainingTrials
                        ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.7)]'
                        : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* THÔNG TIN CHUYÊN MÔN DÀNH RIÊNG CHO MÔN HỌC */}
            <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 p-4 rounded-xl border border-blue-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="text-3xl p-2.5 bg-slate-950/80 rounded-xl border border-blue-500/30 shadow-inner">
                  {currentSubjectObj.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm sm:text-base font-bold text-white uppercase tracking-wide">
                      {currentSubjectObj.name}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {currentSubjectObj.badge}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                      BẢN QUYỀN PRO
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {currentSubjectObj.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <span className="px-2.5 py-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 rounded-lg border border-emerald-700/50 flex items-center gap-1">
                  ✓ Chuẩn CV 7991/BGDĐT
                </span>
              </div>
            </div>

            {/* BỘ LỌC CẤU HÌNH: KHỐI LỚP + KỲ THI + MÃ ĐỀ + NÚT SINH ĐỀ */}
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Chọn Khối Lớp */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400 font-semibold">Khối Lớp:</span>
                  <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                    {['6', '7', '8', '9'].map((g) => (
                      <button
                        key={g}
                        onClick={() => setSelectedGrade(g)}
                        className={`px-2.5 py-0.5 text-xs font-bold rounded transition-colors ${
                          selectedGrade === g
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Lớp {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chọn Kỳ Thi */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400 font-semibold">Kỳ Kiểm Tra:</span>
                  <select
                    value={selectedExamType}
                    onChange={(e) => setSelectedExamType(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs font-semibold text-white px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="GK1">Giữa Học Kỳ I (GK1)</option>
                    <option value="CK1">Cuối Học Kỳ I (CK1)</option>
                    <option value="GK2">Giữa Học Kỳ II (GK2)</option>
                    <option value="CK2">Cuối Học Kỳ II (CK2)</option>
                  </select>
                </div>

                {/* Mã đề */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400 font-semibold">Mã Đề:</span>
                  <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 font-mono font-bold text-xs rounded-lg border border-amber-500/30">
                    {examCode}
                  </span>
                </div>
              </div>

              {/* Nút bấm sinh đề */}
              {!isVIP && remainingTrials <= 0 ? (
                <a
                  href={`https://zalo.me/${BRAND.author.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Chào Thầy Thành, tôi đã dùng thử hết 5 lượt phần mềm Tạo đề kiểm tra THCS 8 môn. Nhờ Thầy báo giá ưu đãi và hướng dẫn kích hoạt bản quyền giúp tôi (Mã máy: ${hwid}).`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30 transition-all cursor-pointer animate-pulse"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>HẾT LƯỢT DÙNG THỬ – NHẮN ZALO BÁO GIÁ ƯU ĐÃI</span>
                </a>
              ) : (
                <button
                  onClick={handleGenerateExam}
                  disabled={isGenerating}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white shadow-blue-600/30 active:scale-95"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                      <span>AI Đang Sinh Đề Chuẩn 7991...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>
                        TẠO ĐỀ KIỂM TRA MỚI ({isVIP ? 'VIP' : `${remainingTrials}/5 lượt`})
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* KHUNG XEM TRƯỚC ĐỀ THI SƯ PHẠM (TIMES NEW ROMAN 13PT) */}
            {/* KHUNG XEM TRƯỚC ĐỀ THI SƯ PHẠM (TIMES NEW ROMAN 13PT) */}
            <div className="bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-950/80 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-slate-200">
                    BẢN XEM TRƯỚC ĐỀ KIỂM TRA SƯ PHẠM (FONT TIMES NEW ROMAN 13PT - CHUẨN IN ẤN A4)
                  </span>
                </div>

                {/* Sub-tab chuyển đổi xem Đề thi / Ma trận / Đáp án */}
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[11px]">
                  <button
                    onClick={() => setPreviewSubTab('exam')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                      previewSubTab === 'exam'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    1. Đề Kiểm Tra
                  </button>
                  <button
                    onClick={() => setPreviewSubTab('matrix')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                      previewSubTab === 'matrix'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    2. Ma Trận (CV 7991)
                  </button>
                  <button
                    onClick={() => setPreviewSubTab('answer')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                      previewSubTab === 'answer'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    3. Đáp Án & Biểu Điểm
                  </button>
                </div>

                {/* Các nút thao tác xuất file */}
                <div className="flex items-center gap-2">
                  {/* Nút Tải Word (.doc) chuẩn 100% mẫu */}
                  <button
                    onClick={handleDownloadDoc}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-700/30 transition-all cursor-pointer active:scale-95 border border-emerald-400/40"
                    title="Tải trọn bộ Đề kiểm tra + Ma trận đặc tả + Đáp án thang điểm chi tiết dạng Microsoft Word (.doc)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải File Word (.doc)</span>
                  </button>

                  <button
                    onClick={handleCopyExam}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1 border border-slate-700 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg text-xs font-medium flex items-center gap-1 border border-blue-500/40 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>In đề kiểm tra</span>
                  </button>
                </div>
              </div>

              {/* Tờ giấy đề thi trắng chuẩn Times New Roman 13pt */}
              {(() => {
                const examSuite = getTHCS8MonExamSuite(selectedSubject, selectedGrade, selectedExamType, examCode);
                return (
                  <div
                    id="thcs-exam-preview-content"
                    className="p-6 sm:p-8 bg-white text-slate-900 font-serif leading-relaxed max-h-[520px] overflow-y-auto select-text text-[13pt]"
                    style={{ fontFamily: '"Times New Roman", Times, serif' }}
                  >
                    {/* VIEW 1: ĐỀ KIỂM TRA CHÍNH THỨC */}
                    {previewSubTab === 'exam' && (
                      <>
                        {/* Khung tiêu đề đầu đề thi 2 cột chuẩn Trường THCS Đồng Yên */}
                        <div className="grid grid-cols-3 gap-4 pb-3 border-b-2 border-slate-900 text-center font-serif">
                          <div className="col-span-1">
                            <p className="font-bold text-[11pt] uppercase">{examSuite.parentAgency}</p>
                            <p className="font-bold text-[11.5pt] uppercase underline text-slate-900">{examSuite.schoolName}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="font-bold text-[12.5pt] uppercase text-slate-900">
                              BÀI KIỂM TRA ĐÁNH GIÁ {examSuite.termTitle.toUpperCase()}
                            </p>
                            <p className="font-bold text-[11.5pt]">
                              NĂM HỌC: {examSuite.schoolYear}
                            </p>
                            <p className="font-bold text-[12pt]">
                              Môn: {examSuite.subjectName} {examSuite.grade}
                            </p>
                            <p className="text-[11pt] italic">
                              Thời gian làm bài: {examSuite.timeMinutes} phút (Không kể thời gian phát đề)
                            </p>
                          </div>
                        </div>

                        {/* Dòng Họ tên học sinh & Mã đề */}
                        <div className="py-2.5 text-[12.5pt] flex items-center justify-between font-serif border-b border-slate-300">
                          <span>Họ và tên: __________________________,</span>
                          <span>Lớp: {examSuite.grade}A___</span>
                          <span className="font-bold">Mã đề: {examSuite.examCode}</span>
                        </div>

                        {/* Bảng Điểm & Lời phê chuẩn Trường THCS Đồng Yên (2 dòng kẻ) */}
                        <table className="w-full border-collapse border border-black text-center text-[11pt] my-3 font-serif">
                          <thead>
                            <tr>
                              <th colSpan={2} className="border border-black p-1.5 w-1/4 font-bold">Điểm</th>
                              <th rowSpan={2} className="border border-black p-1.5 font-bold">Lời phê của thầy, cô giáo</th>
                            </tr>
                            <tr>
                              <th className="border border-black p-1 w-1/8 font-bold">Điểm số</th>
                              <th className="border border-black p-1 w-1/8 font-bold">Điểm chữ</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="h-14">
                              <td className="border border-black p-1"></td>
                              <td className="border border-black p-1"></td>
                              <td className="border border-black p-2 text-left align-top text-[10pt] leading-loose">
                                <div>___________________________________________________________</div>
                                <div>___________________________________________________________</div>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        {/* Nội dung đề thi phong phú theo môn */}
                        <div className="space-y-4 text-justify mt-2">
                          {examSuite.parts.map((part, pIdx) => (
                            <div key={pIdx} className="space-y-2">
                              <p className="font-bold pt-1" style={{ color: '#FF0000' }}>
                                {part.title} ({part.points})
                              </p>
                              {part.instruction && (
                                <p className="italic text-[11pt] text-slate-700">{part.instruction}</p>
                              )}
                              {part.passage && (
                                <div className="p-3 bg-slate-50 border-l-4 border-slate-400 italic text-[11.5pt] whitespace-pre-line my-2">
                                  {part.passage}
                                </div>
                              )}
                              {part.questions.map((q, qIdx) => (
                                <div key={qIdx} className="mt-2 space-y-1">
                                  <p>
                                    <strong>
                                      {typeof q.num === 'number' ? `Câu ${q.num}:` : `${q.num}${q.points ? ` (${q.points}):` : ':'}`}
                                    </strong>{' '}
                                    {q.content}
                                  </p>
                                  {q.options && q.options.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 pl-5 text-[12pt] gap-1">
                                      {q.options.map((opt, oIdx) => {
                                        const isCorrect = q.correctKey && (opt.startsWith(q.correctKey + '.') || opt.includes('(Đúng)'));
                                        return (
                                          <span key={oIdx} className={isCorrect ? 'font-bold' : ''}>
                                            {isCorrect ? (
                                              <span style={{ color: '#FF0000' }}>{opt}</span>
                                            ) : (
                                              opt
                                            )}
                                          </span>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>

                        {/* Hết đề */}
                        <div className="mt-8 pt-4 border-t border-slate-400 text-center italic text-[11pt]">
                          ---------- HẾT ----------
                          <p className="text-[10pt] not-italic mt-1 text-slate-600">
                            Giáo viên coi kiểm tra không giải thích gì thêm. Giữ nguyên định dạng chuẩn Times New Roman 13pt khi xuất Word.
                          </p>
                        </div>
                      </>
                    )}

                    {/* VIEW 2: MA TRẬN & BẢN ĐẶC TẢ THEO CV 7991 */}
                    {previewSubTab === 'matrix' && (
                      <div className="space-y-6">
                        <div>
                          <div className="text-center mb-3">
                            <p className="font-bold text-[12pt] text-blue-900 uppercase">
                              MA TRẬN ĐỀ KIỂM TRA {examSuite.termTitle.toUpperCase()}
                            </p>
                            <p className="font-bold text-[11pt]">
                              MÔN: {examSuite.subjectName.toUpperCase()} {examSuite.grade} (CÔNG VĂN 7991/BGDĐT)
                            </p>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-slate-800 text-[10pt] text-center">
                              <thead className="bg-slate-100">
                                <tr>
                                  {examSuite.matrix.headers.map((h, i) => (
                                    <th key={i} className="border border-slate-800 p-2 font-bold">{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {examSuite.matrix.rows.map((r, ri) => (
                                  <tr key={ri} className={String(r[0]).startsWith('TỔNG') ? 'bg-slate-100 font-bold' : ''}>
                                    {r.map((c, ci) => (
                                      <td key={ci} className={`border border-slate-800 p-2 ${ci === 1 ? 'text-left' : 'text-center'}`}>
                                        {c}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div>
                          <div className="text-center mb-3">
                            <p className="font-bold text-[12pt] text-blue-900 uppercase">
                              BẢN ĐẶC TẢ KỸ THUẬT ĐỀ KIỂM TRA
                            </p>
                            <p className="font-bold text-[11pt]">MÔN: {examSuite.subjectName.toUpperCase()} - LỚP {examSuite.grade}</p>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-slate-800 text-[9.5pt]">
                              <thead className="bg-slate-100">
                                <tr>
                                  {examSuite.specification.headers.map((h, i) => (
                                    <th key={i} className="border border-slate-800 p-2 font-bold text-center">{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {examSuite.specification.rows.map((r, ri) => (
                                  <tr key={ri}>
                                    {r.map((c, ci) => (
                                      <td key={ci} className={`border border-slate-800 p-2 ${ci === 0 || ci >= 4 ? 'text-center' : 'text-left'}`}>
                                        {c}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* VIEW 3: ĐÁP ÁN & BIỂU ĐIỂM CHI TIẾT */}
                    {previewSubTab === 'answer' && (
                      <div className="space-y-5">
                        <div className="text-center mb-3">
                          <p className="font-bold text-[13pt] uppercase" style={{ color: '#FF0000' }}>
                            HƯỚNG DẪN CHẤM VÀ ĐÁP ÁN CHI TIẾT
                          </p>
                          <p className="font-bold text-[11pt]">
                            MÔN: {examSuite.subjectName.toUpperCase()} - LỚP {examSuite.grade} | MÃ ĐỀ: {examSuite.examCode}
                          </p>
                        </div>

                        <div>
                          <p className="font-bold text-[11.5pt] mb-2" style={{ color: '#FF0000' }}>
                            1. ĐÁP ÁN PHẦN TRẮC NGHIỆM:
                          </p>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-slate-800 text-[11pt] text-center">
                              <thead className="bg-slate-100">
                                <tr>
                                  <th className="border border-slate-800 p-1.5">Câu</th>
                                  {examSuite.answerGuide.mcqAnswers.map((m) => (
                                    <th key={m.q} className="border border-slate-800 p-1.5">{m.q}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="border border-slate-800 p-1.5 font-bold bg-slate-50">Đáp án</td>
                                  {examSuite.answerGuide.mcqAnswers.map((m) => (
                                    <td key={m.q} className="border border-slate-800 p-1.5 font-bold" style={{ color: '#FF0000' }}>
                                      {m.ans}
                                    </td>
                                  ))}
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div>
                          <p className="font-bold text-[11.5pt] mb-2" style={{ color: '#FF0000' }}>
                            2. HƯỚNG DẪN CHẤM VÀ THANG ĐIỂM PHẦN TỰ LUẬN:
                          </p>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-slate-800 text-[10.5pt]">
                              <thead className="bg-slate-100">
                                <tr>
                                  <th className="border border-slate-800 p-2 text-center w-[20%]">Câu / Bài</th>
                                  <th className="border border-slate-800 p-2 text-center w-[65%]">Nội dung đáp án & Các bước giải</th>
                                  <th className="border border-slate-800 p-2 text-center w-[15%]">Điểm</th>
                                </tr>
                              </thead>
                              <tbody>
                                {examSuite.answerGuide.essayGuide.map((eg, i) => (
                                  <tr key={i}>
                                    <td className="border border-slate-800 p-2 font-bold text-center">{eg.question}</td>
                                    <td className="border border-slate-800 p-2 whitespace-pre-line font-medium text-red-600">{eg.step}</td>
                                    <td className="border border-slate-800 p-2 font-bold text-center" style={{ color: '#FF0000' }}>
                                      {eg.point}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Footer info */}
              <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Chuẩn 100% Công văn 7991/BGDĐT & Định dạng Word Times New Roman 13pt
                </span>
                <span className="text-slate-400">
                  Hỗ trợ cả 8 môn học THCS: Toán, Văn, Anh, KHTN, Sử - Địa, Tin, GDCD, Công nghệ
                </span>
              </div>
            </div>
          </div>

        )}

        {/* TAB 2: TẢI VỀ & HƯỚNG DẪN */}
        {activeTab === 'download' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Player HD */}
              <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-4 border border-slate-800 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <Play className="w-4 h-4 text-blue-500" />
                    Video Hướng Dẫn Soạn Đề Kiểm Tra {currentSubjectObj.name} (CV 7991)
                  </h3>
                  <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-500/20 text-blue-300 rounded">
                    Full HD 1080p
                  </span>
                </div>

                <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center group">
                  <video
                    className="w-full h-full object-cover"
                    controls
                    poster="/taodethcs8mon.png"
                  >
                    <source src="/HD_Tao_De_Tieng_Anh_THCS.mp4" type="video/mp4" />
                    Trình duyệt không hỗ trợ video HTML5.
                  </video>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>Trình bày: Thầy giáo Đinh Văn Thành (THCS Đồng Yên)</span>
                  <a
                    href="/HD_Tao_De_Tieng_Anh_THCS.mp4"
                    download="HD_Tao_De_THCS_8_Mon.mp4"
                    className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Tải video MP4 về máy
                  </a>
                </div>
              </div>

              {/* Danh sách các gói tải về */}
              <div className="space-y-4">
                <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Bộ Cài Đặt & Tài Liệu Phân Phối
                  </h4>
                  <div className="space-y-2.5">
                    <a
                      href="/Trung_Tam_Tao_De_THCS.exe"
                      className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-900/40 to-slate-800 hover:from-blue-800/60 hover:to-slate-700 border border-blue-700/40 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                          EXE
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-blue-300">
                            Bộ Cài Đặt {currentSubjectObj.name} (.exe)
                          </p>
                          <p className="text-[10px] text-slate-400">Phòng làm việc chuyên môn (28.8 MB)</p>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-white" />
                    </a>

                    <a
                      href="/Trung_Tam_Tao_De_THCS_Pass_123.zip"
                      download="Trung_Tam_Tao_De_THCS_Pass_123.zip"
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                          ZIP
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-amber-300">
                            Gói Nén Đầy Đủ (.zip) Pass: 123
                          </p>
                          <p className="text-[10px] text-slate-400">Trọn bộ 8 môn kèm tài liệu (Pass: 123)</p>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-white" />
                    </a>

                    <a
                      href="/HUONG_DAN_TAO_DE_THCS_8_MON.docx"
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                          DOCX
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-emerald-300">
                            Sổ Tay Hướng Dẫn Soạn Đề Kiểm Tra {currentSubjectObj.name}
                          </p>
                          <p className="text-[10px] text-slate-400">Chuẩn CV 7991/BGDĐT</p>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-white" />
                    </a>

                    {/* Nút tải trực tiếp Đề Mẫu Word của môn đang chọn */}
                    <button
                      onClick={handleDownloadDoc}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-900/40 to-slate-800 hover:from-emerald-800/60 hover:to-slate-700 border border-emerald-600/40 transition-all group cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold text-xs">
                          DOC
                        </div>
                        <div>
                          <p className="text-xs font-bold text-emerald-300 group-hover:text-white">
                            Tải Đề Mẫu Word (.doc) Chuẩn 7991
                          </p>
                          <p className="text-[10px] text-slate-400">Đầy đủ Đề + Ma trận + Đáp án chi tiết</p>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-emerald-400 group-hover:text-white" />
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-950/30 via-slate-900 to-slate-900 rounded-2xl p-4 border border-blue-800/30">
                  <h4 className="text-xs font-bold text-blue-300 flex items-center gap-1.5 mb-2">
                    <ShieldCheck className="w-4 h-4 text-blue-400" /> Cam Kết Sư Phạm 100%
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                    <li>100% bám sát SGK Kết nối tri thức và CV 7991/BGDĐT.</li>
                    <li>Đầy đủ Ma trận, Bản đặc tả kỹ thuật và Đáp án thang điểm 10đ.</li>
                    <li>Xuất file Word (.docx) chuẩn in ấn khổ A4, không vỡ layout.</li>
                    <li>Khắc phục triệt để lỗi in ấn và dính chữ công thức MathType.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BẢN QUYỀN & KÍCH HOẠT */}
        {activeTab === 'license' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form Kích Hoạt */}
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Key className="w-5 h-5 text-amber-400" />
                    Kích Hoạt Bản Quyền Pro
                  </h3>
                  <span className="text-xs text-slate-400">Xác thực tức thì</span>
                </div>

                {/* Mã máy tính Hardware Code */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Mã Máy Tính Của Thầy/Cô (Hardware Code):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={hwid}
                      className="flex-1 bg-slate-950 border border-slate-700 text-amber-300 font-mono text-xs sm:text-sm font-bold px-3 py-2.5 rounded-xl select-all focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(hwid);
                        alert('Đã sao chép Mã máy tính vào bộ nhớ tạm!');
                      }}
                      className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-colors cursor-pointer"
                      title="Sao chép mã máy"
                    >
                      <Copy className="w-3.5 h-3.5" /> Sao chép
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Gửi mã máy này qua Zalo <strong className="text-white">0915.213717</strong> cho Thầy Thành để nhận Key kích hoạt.
                  </p>
                </div>

                {/* Nhập Key Kích Hoạt */}
                <form onSubmit={handleActivateLicense} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Nhập Mã Bản Quyền Pro Được Cấp:
                    </label>
                    <input
                      type="text"
                      value={licenseKeyInput}
                      onChange={(e) => setLicenseKeyInput(e.target.value)}
                      placeholder="VD: TH8M-ALL-LT-XXXX-XXXX hoặc MATH-LT-..."
                      className="w-full bg-slate-950 border border-slate-700 text-white font-mono text-xs sm:text-sm px-3 py-2.5 rounded-xl uppercase tracking-wider focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {activationMsg.text && (
                    <div
                      className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                        activationMsg.type === 'success'
                          ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                          : 'bg-red-950/60 border border-red-800 text-red-300'
                      }`}
                    >
                      {activationMsg.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                      <span>{activationMsg.text}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isActivating}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    {isActivating ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    <span>KÍCH HOẠT BẢN QUYỀN PRO NGAY</span>
                  </button>
                </form>

                {/* Nút liên hệ Zalo trực tiếp */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Hỗ trợ kỹ thuật 24/7:</span>
                  <a
                    href={`https://zalo.me/${BRAND.phoneRaw}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#0068FF]/20 hover:bg-[#0068FF]/30 text-[#0068FF] hover:text-blue-300 border border-[#0068FF]/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Nhắn Zalo Thầy Thành ({BRAND.phone})
                  </a>
                </div>
              </div>

              {/* Bảng Các Gói Bản Quyền - Ẩn Giá Cả Để Tế Nhị & Liên Hệ Zalo */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Các Gói Bản Quyền Tạo Đề THCS (Chuẩn CV 7991)
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowTrialRegister(true)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold hover:bg-emerald-500/30 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Đăng Ký Dùng Thử 5 Lần
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white">Gói Từng Môn Riêng Lẻ (Toán / Văn / Anh...)</span>
                    <p className="text-[11px] text-slate-400">Sử dụng đầy đủ mọi tính năng theo từng bộ môn, cập nhật 1 năm</p>
                  </div>
                  <a
                    href={`https://zalo.me/${BRAND.author.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Chào Thầy Thành, tôi muốn nhận báo giá ưu đãi Gói Từng Môn Riêng Lẻ phần mềm Tạo đề THCS. Mã máy của tôi: ${hwid}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-blue-400" /> Báo Giá Qua Zalo
                  </a>
                </div>

                {/* Gói Toàn Diện 8 Môn */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between hover:border-sky-500/40 transition">
                  <div>
                    <span className="text-xs font-bold text-white">Gói Toàn Diện 8 Môn (1 Năm)</span>
                    <p className="text-[11px] text-slate-400">Mở khóa toàn bộ 8 môn học THCS (Toán, Văn, Anh, KHTN, Sử Địa, Tin, GDCD, CN)</p>
                  </div>
                  <a
                    href={`https://zalo.me/${BRAND.author.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Chào Thầy Thành, tôi muốn nhận báo giá ưu đãi Gói Trọn Bộ 8 Môn (1 Năm) phần mềm Tạo đề THCS. Mã máy của tôi: ${hwid}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-amber-400" /> Báo Giá Qua Zalo
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900 border-2 border-amber-500/50 flex items-center justify-between shadow-lg shadow-amber-500/10">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-white">GÓI TRỌN ĐỜI 8 MÔN (VIP KHUYÊN DÙNG)</span>
                      <span className="px-1.5 py-0.2 text-[9px] font-extrabold rounded bg-red-600 text-white">
                        HOT
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Sở hữu vĩnh viễn cả 8 môn học THCS, cập nhật ngân hàng câu hỏi định kỳ, hỗ trợ chuyển máy mới
                    </p>
                  </div>
                  <a
                    href={`https://zalo.me/${BRAND.author.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Chào Thầy Thành, tôi muốn nhận báo giá ưu đãi Gói VIP Trọn Đời 8 Môn phần mềm Tạo đề THCS. Mã máy của tôi: ${hwid}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all shrink-0 ml-2"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Báo Giá Ưu Đãi VIP
                  </a>
                </div>
                </div>

                <p className="text-[11px] text-slate-400 italic px-1 pt-1">
                  * Chính sách giá ưu đãi đặc biệt dành cho giáo viên và các nhà trường. Quý Thầy/Cô vui lòng bấm nút nhắn tin Zalo để nhận báo giá chi tiết và hỗ trợ kích hoạt trực tiếp từ Thầy Thành.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <TrialRegisterModal isOpen={showTrialRegister} onClose={() => setShowTrialRegister(false)} />
    </div>
  );
};
