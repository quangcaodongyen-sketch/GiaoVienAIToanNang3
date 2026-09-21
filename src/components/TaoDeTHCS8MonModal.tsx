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
  Clock,
  Printer,
  Sliders,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Layers,
  ChevronRight,
  FolderDown,
  FileCheck
} from 'lucide-react';
import { BRAND } from '../config/brand';
import {
  getOrCreateTHCS8MHardwareCode,
  getSecureTHCS8MTrialRemaining,
  consumeSecureTHCS8MTrial,
  isTHCS8MVIPActivated,
  getTHCS8MActivePackage,
  activateTHCS8MLicense,
  SUBJECT_MAP
} from '../services/taoDeTHCS8MonKeyService';

interface TaoDeTHCS8MonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
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
  onOpenAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'online' | 'download' | 'license'>('online');
  const [hwid, setHwid] = useState<string>('DVT-TH8M-XXXX-XXXX');
  const [remainingTrials, setRemainingTrials] = useState<number>(5);
  const [isVIP, setIsVIP] = useState<boolean>(false);
  const [activePkgInfo, setActivePkgInfo] = useState<any>(null);

  // License state
  const [licenseKeyInput, setLicenseKeyInput] = useState<string>('');
  const [activationMsg, setActivationMsg] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });
  const [isActivating, setIsActivating] = useState<boolean>(false);

  // Online Studio Filter State
  const [selectedSubject, setSelectedSubject] = useState<string>('TOAN');
  const [selectedGrade, setSelectedGrade] = useState<string>('7');
  const [selectedExamType, setSelectedExamType] = useState<string>('GK1');
  const [examCode, setExamCode] = useState<string>('701');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

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
      alert('Thầy/Cô đã sử dụng hết 5 lượt dùng thử trực tuyến miễn phí! Vui lòng kích hoạt Bản quyền Pro để tiếp tục tạo đề không giới hạn.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-[#0A1128] text-slate-100 w-full max-w-6xl rounded-2xl shadow-2xl border border-blue-900/60 flex flex-col max-h-[96vh] overflow-hidden my-auto">
        
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
                  HỆ THỐNG PHẦN MỀM TẠO ĐỀ KIỂM TRA THCS (8 MÔN)
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
                Tự động sinh Ma trận, Bản đặc tả kỹ thuật, Đề thi chuẩn in ấn khổ A4 và Đáp án thang điểm chi tiết (Toán, Văn, Anh, KHTN, Sử - Địa, Tin, GDCD, Công nghệ)
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

            {/* BỘ CHỌN MÔN HỌC (8 MÔN) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" /> Chọn Môn Học Cần Tạo Đề:
                </span>
                <span className="text-[11px] text-amber-300">
                  Đang chọn: <strong>{currentSubjectObj.name}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {SUBJECT_OPTIONS.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubject(sub.id)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                      selectedSubject === sub.id
                        ? 'bg-gradient-to-b from-blue-900/60 to-slate-900 border-blue-400 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xl mb-1">{sub.icon}</span>
                    <span className="text-xs font-bold truncate w-full">{sub.name.replace('MÔN ', '')}</span>
                    <span className="text-[9px] text-slate-400 truncate w-full mt-0.5">{sub.badge}</span>
                  </button>
                ))}
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
              <button
                onClick={handleGenerateExam}
                disabled={isGenerating || (!isVIP && remainingTrials <= 0)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                  !isVIP && remainingTrials <= 0
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white shadow-blue-600/30 active:scale-95'
                }`}
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
            </div>

            {/* KHUNG XEM TRƯỚC ĐỀ THI SƯ PHẠM (TIMES NEW ROMAN 13PT) */}
            <div className="bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-slate-200">
                    BẢN XEM TRƯỚC ĐỀ THI SƯ PHẠM (FONT TIMES NEW ROMAN 13PT - CHUẨN IN ẤN A4)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyExam}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1 border border-slate-700 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg text-xs font-medium flex items-center gap-1 border border-blue-500/40 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>In đề thi</span>
                  </button>
                </div>
              </div>

              {/* Tờ giấy đề thi trắng chuẩn Times New Roman 13pt */}
              <div
                id="thcs-exam-preview-content"
                className="p-6 sm:p-8 bg-white text-slate-900 font-serif leading-relaxed max-h-[500px] overflow-y-auto select-text text-[13pt]"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                {/* Khối tiêu đề đầu đề thi 2 cột */}
                <div className="grid grid-cols-2 gap-4 pb-4 border-b-2 border-slate-900 text-center">
                  <div>
                    <p className="font-bold text-[11pt] uppercase">PHÒNG GD&ĐT BẮC QUANG</p>
                    <p className="font-bold text-[12pt] uppercase text-blue-900">TRƯỜNG THCS ĐỒNG YÊN</p>
                    <p className="text-[11pt] italic">Đề thi chính thức</p>
                  </div>
                  <div>
                    <p className="font-bold text-[12pt] uppercase" style={{ color: '#FF0000' }}>
                      ĐỀ KIỂM TRA {selectedExamType === 'GK1' ? 'GIỮA HỌC KỲ I' : selectedExamType === 'CK1' ? 'CUỐI HỌC KỲ I' : selectedExamType === 'GK2' ? 'GIỮA HỌC KỲ II' : 'CUỐI HỌC KỲ II'}
                    </p>
                    <p className="font-bold text-[12pt] uppercase">
                      NĂM HỌC 2026 - 2027 | {currentSubjectObj.name} - LỚP {selectedGrade}
                    </p>
                    <p className="text-[11pt] italic">
                      Thời gian làm bài: {selectedSubject === 'VAN' ? '90 phút' : '60 phút'} (Không kể thời gian phát đề)
                    </p>
                  </div>
                </div>

                {/* Bảng điểm & Mã đề */}
                <div className="my-4 flex items-center justify-between border border-slate-800 p-2 text-[11pt]">
                  <div className="flex gap-6">
                    <span>Họ và tên thí sinh: ..............................................................</span>
                    <span>Lớp: {selectedGrade}....</span>
                  </div>
                  <div className="font-bold font-mono px-3 py-0.5 bg-slate-100 border border-slate-400">
                    MÃ ĐỀ: {examCode}
                  </div>
                </div>

                {/* Nội dung đề thi mẫu theo môn */}
                <div className="space-y-4 text-justify mt-4">
                  {selectedSubject === 'TOAN' && (
                    <>
                      <p className="font-bold" style={{ color: '#FF0000' }}>
                        PHẦN I. TRẮC NGHIỆM KHÁCH QUAN (3,0 điểm)
                      </p>
                      <p className="italic text-[11pt]">Khoanh tròn vào chữ cái A, B, C hoặc D đứng trước câu trả lời đúng:</p>
                      <p><strong>Câu 1:</strong> Kết quả của phép tính 15 + 45 : 3² bằng bao nhiêu?</p>
                      <div className="grid grid-cols-4 pl-6 text-[12pt]">
                        <span>A. 20</span>
                        <span><strong style={{ color: '#FF0000' }}>B. 20 (Đúng)</strong></span>
                        <span>C. 18</span>
                        <span>D. 25</span>
                      </div>
                      <p><strong>Câu 2:</strong> Trong các hình sau, hình nào có trục đối xứng?</p>
                      <div className="grid grid-cols-4 pl-6 text-[12pt]">
                        <span>A. Hình bình hành</span>
                        <span><strong style={{ color: '#FF0000' }}>B. Hình thang cân (Đúng)</strong></span>
                        <span>C. Hình tam giác thường</span>
                        <span>D. Hình chữ nhật lệch</span>
                      </div>

                      <p className="font-bold pt-2" style={{ color: '#FF0000' }}>
                        PHẦN II. TỰ LUẬN (7,0 điểm)
                      </p>
                      <p><strong>Bài 1 (1,5 điểm):</strong> Thực hiện phép tính hợp lí: a) 37.64 + 37.36; b) 120 : [54 - (50 : 2 + 3²)]</p>
                      <p><strong>Bài 2 (1,5 điểm):</strong> Tìm số tự nhiên x biết: 3x - 14 = 2² . 5</p>
                      <p><strong>Bài 3 (2,0 điểm):</strong> Khu vườn hình chữ nhật có chiều dài 20m, chiều rộng 12m. Tính diện tích và chu vi khu vườn.</p>
                      <p><strong>Bài 4 (1,5 điểm):</strong> Hình học trực quan và ứng dụng thực tế đo đạc góc.</p>
                      <p><strong>Bài 5 (0,5 điểm):</strong> Bài toán nâng cao chia hết và logic dãy số.</p>
                    </>
                  )}

                  {selectedSubject === 'VAN' && (
                    <>
                      <p className="font-bold" style={{ color: '#FF0000' }}>
                        I. ĐỌC HIỂU (6,0 điểm)
                      </p>
                      <p className="italic text-[11pt] pl-4 border-l-2 border-slate-300">
                        "Quê hương là chùm khế ngọt / Cho con trèo hái mỗi ngày / Quê hương là đường đi học / Con về rợp bướm vàng bay..."
                        <br /><span className="text-[10pt] font-sans text-slate-500">(Trích Quê hương – Đỗ Trung Quân)</span>
                      </p>
                      <p><strong>Câu 1:</strong> Xác định phương thức biểu đạt chính của đoạn trích trên.</p>
                      <p><strong>Câu 2:</strong> Chỉ ra biện pháp tu từ được sử dụng nổi bật trong 4 câu thơ đầu.</p>
                      <p><strong>Câu 3:</strong> Em hiểu thế nào về hình ảnh "Quê hương là con diều biếc"?</p>
                      <p><strong>Câu 4:</strong> Thông điệp ý nghĩa nhất mà văn bản gửi đến thế hệ trẻ ngày nay là gì?</p>

                      <p className="font-bold pt-2" style={{ color: '#FF0000' }}>
                        II. VIẾT (4,0 điểm)
                      </p>
                      <p>Viết một bài văn biểu cảm (khoảng 400 từ) trình bày cảm nghĩ của em về một người thầy, cô giáo đã để lại ấn tượng sâu sắc nhất trong lòng em.</p>
                    </>
                  )}

                  {selectedSubject === 'ENG' && (
                    <>
                      <p className="font-bold" style={{ color: '#FF0000' }}>
                        PART 1. LISTENING (2.0 points)
                      </p>
                      <p className="italic text-[11pt]">Listen to the conversation between Phong and Mai about school activities. Choose the best answer:</p>
                      <p><strong>Question 1:</strong> What time does the science club meet every Thursday?</p>
                      <div className="grid grid-cols-4 pl-6 text-[12pt]">
                        <span>A. At 3:00 PM</span>
                        <span><strong style={{ color: '#FF0000' }}>B. At 3:30 PM (Key)</strong></span>
                        <span>C. At 4:00 PM</span>
                        <span>D. At 4:30 PM</span>
                      </div>

                      <p className="font-bold pt-2" style={{ color: '#FF0000' }}>
                        PART 2. LANGUAGE FOCUS (2.0 points)
                      </p>
                      <p><strong>Question 5:</strong> My brother is interested in ________ solar energy models.</p>
                      <div className="grid grid-cols-4 pl-6 text-[12pt]">
                        <span>A. make</span>
                        <span>B. to make</span>
                        <span><strong style={{ color: '#FF0000' }}>C. making (Key)</strong></span>
                        <span>D. made</span>
                      </div>

                      <p className="font-bold pt-2" style={{ color: '#FF0000' }}>
                        PART 3. READING & WRITING (4.0 points)
                      </p>
                      <p className="italic text-[11pt]">Đọc hiểu đoạn văn 150 từ và hoàn thành bài viết thư điện tử chuẩn khảo thí.</p>

                      <p className="font-bold pt-2" style={{ color: '#FF0000' }}>
                        PART 4. SPEAKING TEST (2.0 points - Dành cho kỳ Cuối kỳ CK1/CK2)
                      </p>
                      <p className="italic text-[11pt]">Examiner's Script 4 cột chuẩn Bộ GD&ĐT: To do | To say | Student's response | Back-up.</p>
                    </>
                  )}

                  {selectedSubject !== 'TOAN' && selectedSubject !== 'VAN' && selectedSubject !== 'ENG' && (
                    <>
                      <p className="font-bold" style={{ color: '#FF0000' }}>
                        PHẦN I. CÂU HỎI TRẮC NGHIỆM (4,0 điểm)
                      </p>
                      <p className="italic text-[11pt]">Gồm 16 câu hỏi trắc nghiệm bám sát ma trận và bản đặc tả kỹ thuật Công văn 7991/BGDĐT.</p>
                      <p><strong>Câu 1:</strong> Nội dung kiến thức cốt lõi phân môn chuẩn chương trình GDPT 2018.</p>
                      <div className="grid grid-cols-4 pl-6 text-[12pt]">
                        <span>A. Phương án A</span>
                        <span><strong style={{ color: '#FF0000' }}>B. Phương án B (Đáp án)</strong></span>
                        <span>C. Phương án C</span>
                        <span>D. Phương án D</span>
                      </div>

                      <p className="font-bold pt-2" style={{ color: '#FF0000' }}>
                        PHẦN II. TỰ LUẬN THỰC TIỄN (6,0 điểm)
                      </p>
                      <p><strong>Câu 17 (2,0 điểm):</strong> Trình bày hiểu biết và giải thích hiện tượng theo tình huống thực tế.</p>
                      <p><strong>Câu 18 (2,5 điểm):</strong> Vận dụng kiến thức bài học để giải quyết vấn đề đời sống.</p>
                      <p><strong>Câu 19 (1,5 điểm):</strong> Đề xuất giải pháp sáng tạo, năng lực giải quyết vấn đề số.</p>
                    </>
                  )}
                </div>

                {/* Hết đề */}
                <div className="mt-8 pt-4 border-t border-slate-400 text-center italic text-[11pt]">
                  ---------- HẾT ----------
                  <p className="text-[10pt] not-italic mt-1 text-slate-600">
                    Cán bộ coi thi không giải thích gì thêm. Giữ nguyên định dạng chuẩn Times New Roman 13pt khi xuất Word.
                  </p>
                </div>
              </div>

              {/* Footer info */}
              <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Chuẩn 100% Công văn 7991/BGDĐT & Bộ sách Kết nối tri thức
                </span>
                <span>Tự động hoán vị mã đề (601 ↔ 602, 701 ↔ 702...)</span>
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
                    Video Hướng Dẫn Sử Dụng Bảng Điều Khiển Tạo Đề THCS (8 Môn)
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
                            Trung Tâm Tạo Đề THCS (.exe)
                          </p>
                          <p className="text-[10px] text-slate-400">Bảng điều khiển 8 môn (28.8 MB)</p>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-white" />
                    </a>

                    <a
                      href="/Smart_Listening_Pro_Pass_123.zip"
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
                          <p className="text-[10px] text-slate-400">Trình duyệt không chặn tải</p>
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
                            Sổ Tay Hướng Dẫn Soạn Đề
                          </p>
                          <p className="text-[10px] text-slate-400">Chuẩn CV 7991/BGDĐT</p>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-white" />
                    </a>
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
                    href={`https://zalo.me/${BRAND.author.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#0068FF]/20 hover:bg-[#0068FF]/30 text-[#0068FF] hover:text-blue-300 border border-[#0068FF]/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Nhắn Zalo Thầy Thành ({BRAND.author.phone})
                  </a>
                </div>
              </div>

              {/* Bảng Giá Các Gói Bản Quyền */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Bảng Giá Các Gói Bản Quyền Tạo Đề THCS
                </h4>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white">Gói Từng Môn Riêng Lẻ (Toán / Văn / Anh...)</span>
                    <p className="text-[11px] text-slate-400">Sử dụng đầy đủ mọi tính năng, cập nhật 1 năm</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-blue-400">199.000đ</span>
                    <span className="block text-[10px] text-slate-500">/ 1 môn / 1 máy</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white">Gói Toàn Diện 8 Môn (1 Năm)</span>
                    <p className="text-[11px] text-slate-400">Mở khóa toàn bộ 8 môn học THCS (Toán, Văn, Anh, KHTN, Sử Địa, Tin, GDCD, CN)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-amber-400">499.000đ</span>
                    <span className="block text-[10px] text-slate-500">/ trọn gói 8 môn / 1 năm</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900 border-2 border-amber-500/50 flex items-center justify-between shadow-lg shadow-amber-500/10">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-white">GÓI TRỌN ĐỜI 8 MÔN (VIP KHUYÊN DÙNG)</span>
                      <span className="px-1.5 py-0.2 text-[9px] font-extrabold rounded bg-red-600 text-white">
                        SIÊU TIẾT KIỆM
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Sở hữu vĩnh viễn cả 8 môn học THCS, cập nhật ngân hàng câu hỏi định kỳ, hỗ trợ chuyển máy mới
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-amber-300">990.000đ</span>
                    <span className="block text-[10px] text-emerald-400 font-bold">TRỌN ĐỜI VĨNH VIỄN</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
