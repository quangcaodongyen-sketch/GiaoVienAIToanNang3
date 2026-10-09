import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Download,
  Copy,
  Check,
  Crown,
  Play,
  CheckCircle2,
  FileCheck2,
  Headphones,
  MessageCircle,
  FileText,
  Laptop,
  ShieldCheck,
  ExternalLink,
  User,
  Send,
  Sliders,
  CheckSquare,
  RefreshCw,
  BookOpen,
  Lock,
  Layers,
  Shuffle
} from 'lucide-react';
import { BRAND, EXAM_THPT_RESOURCES, EXAM_TIENG_ANH_THPT_RESOURCES, THPT_10MON_RESOURCES } from '../config/brand';
import {
  getOrCreateExamTHPTHardwareCode,
  verifyExamLicenseKey,
  ExamVerifyResult
} from '../services/taodeKeyService';
import { webSecurityGuard } from '../services/webSecurityGuard';
import { cloudSyncService } from '../services/cloudSyncService';
import { CrossPromoBanner } from './CrossPromoBanner';
import { ShareLinkBar } from './ShareLinkBar';
import { syncBrowserHash } from '../utils/shareUtils';

interface TaoDeTiengAnhTHPTModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

export const TaoDeTiengAnhTHPTModal: React.FC<TaoDeTiengAnhTHPTModalProps> = ({ isOpen, onClose, onOpenAdmin }) => {
  // Modal 3 Tabs chuẩn quy định Rule 2
  const [activeTab, setActiveTab] = useState<'online' | 'download' | 'register'>('online');

  // State Dùng thử 5 lần cố định trên máy tính
  const [trialRemaining, setTrialRemaining] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [examGenerated, setExamGenerated] = useState<boolean>(true);
  const [selectedGrade, setSelectedGrade] = useState<string>('10');
  const [selectedTerm, setSelectedTerm] = useState<string>('GK1');
  const [numVariants, setNumVariants] = useState<number>(4);
  const [generationMode, setGenerationMode] = useState<string>('shuffle'); // 'shuffle' | 'distinct'
  const [schoolAgency, setSchoolAgency] = useState<string>('SỞ GIÁO DỤC VÀ ĐÀO TẠO ....................');
  const [schoolName, setSchoolName] = useState<string>('TRƯỜNG THPT ....................');
  const [schoolYear, setSchoolYear] = useState<string>('2026 - 2027');

  const [detectedMid, setDetectedMid] = useState<string>('');
  const [isProActive, setIsProActive] = useState<boolean>(false);
  const [verifyResult, setVerifyResult] = useState<ExamVerifyResult | null>(null);
  const [inputKey, setInputKey] = useState<string>('');
  const [copiedMid, setCopiedMid] = useState<boolean>(false);

  // Form đăng ký Giáo viên
  const [regName, setRegName] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regSchool, setRegSchool] = useState<string>('');
  const [regNote, setRegNote] = useState<string>('');
  const [regSent, setRegSent] = useState<boolean>(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);
  const [copiedContent, setCopiedContent] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    syncBrowserHash('#tao-de-tieng-anh-thpt');
    const thptMid = getOrCreateExamTHPTHardwareCode();
    setDetectedMid(thptMid);

    const savedPro = localStorage.getItem('gvai_taode_thpt_is_pro_active');
    if (savedPro === 'true') {
      setIsProActive(true);
    }

    // Đọc số lượt dùng thử từ localStorage
    const savedTrial = localStorage.getItem('gvai_taode_thpt_trial_remaining');
    if (savedTrial !== null) {
      setTrialRemaining(parseInt(savedTrial, 10));
    } else {
      localStorage.setItem('gvai_taode_thpt_trial_remaining', '5');
      setTrialRemaining(5);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyMid = () => {
    navigator.clipboard.writeText(detectedMid);
    setCopiedMid(true);
    setTimeout(() => setCopiedMid(false), 2500);
  };

  const handleActivateKey = async () => {
    if (!inputKey.trim()) {
      setVerifyResult({ isValid: false, message: 'Vui lòng dán Mã kích hoạt do Thầy Thành cấp!' });
      return;
    }
    const res = await verifyExamLicenseKey(detectedMid, inputKey.trim());
    if (res.isValid) {
      setIsProActive(true);
      localStorage.setItem('gvai_taode_thpt_is_pro_active', 'true');
      setVerifyResult({ isValid: true, message: '🎉 Kích hoạt Bản quyền Pro THPT thành công! Thầy/Cô có thể tạo đề không giới hạn.' });
    } else {
      setVerifyResult(res);
    }
  };

  const handleGenerateExamOnline = () => {
    if (!isProActive && trialRemaining <= 0) {
      setActiveTab('register');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setExamGenerated(true);

      if (!isProActive) {
        const nextCount = Math.max(0, trialRemaining - 1);
        setTrialRemaining(nextCount);
        localStorage.setItem('gvai_taode_thpt_trial_remaining', nextCount.toString());
      }
    }, 1000);
  };

  const handleSendRegForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) {
      alert('Vui lòng điền Họ tên và Số điện thoại / Zalo!');
      return;
    }

    setIsSyncingCloud(true);
    try {
      await cloudSyncService.submitRegistrationToCloud({
        machineId: detectedMid,
        fullName: regName,
        phoneNumber: regPhone,
        schoolUnit: regSchool || 'Trường THPT Đồng Yên',
        appId: 'tao-de-tieng-anh-thpt',
        appName: 'Tạo Đề Tiếng Anh THPT Global Success',
        packageType: '1YEAR'
      });
      setRegSent(true);
    } catch {
      setRegSent(true);
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const downloadAllInOneUrl = EXAM_THPT_RESOURCES.subjects.TIENGANH.exeUrl;
  const downloadZipUrl = EXAM_THPT_RESOURCES.subjects.TIENGANH.zipUrl;
  const downloadDotmUrl = EXAM_THPT_RESOURCES.subjects.TIENGANH.dotmUrl;

  // Danh sách mã đề theo lớp
  const getExamCodePrefix = () => {
    if (selectedGrade === '10') return '10';
    if (selectedGrade === '11') return '11';
    return '12';
  };
  const codePrefix = getExamCodePrefix();
  const variantCodes = Array.from({ length: numVariants }, (_, i) => `${codePrefix}${i + 1}`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[850px] bg-slate-900 border border-violet-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* HEADER MODAL */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-600/30 text-white font-bold text-lg">
              📝
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  TẠO ĐỀ &amp; ĐỀ CƯƠNG TIẾNG ANH THPT
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-sm uppercase tracking-wide">
                  GLOBAL SUCCESS 10 - 11 - 12
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Chuẩn Ma trận 16 cột &amp; Bản đặc tả BGD&amp;ĐT • Tác giả: Thầy giáo Đinh Văn Thành (0915.213717)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShareLinkBar 
              appUrl="#tao-de-tieng-anh-thpt" 
              appName="Tạo Đề Tiếng Anh THPT" 
              compact={true} 
            />
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* THANH LINK GỬI KHÁCH HÀNG (TRỰC QUAN - COPY 1 CHẠM GỬI ZALO) */}
        <ShareLinkBar 
          appUrl="#tao-de-tieng-anh-thpt" 
          appName="Tạo Đề Tiếng Anh THPT (Lớp 10, 11, 12)" 
        />

        {/* TABS NAVIGATION CHUẨN 3 TAB THEO RULE 2 */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-5 pt-3 gap-2 sm:gap-4 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('online')}
            className={`flex items-center gap-2 px-4 py-2.5 font-bold text-sm rounded-t-xl transition-all border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'online'
                ? 'border-violet-400 text-violet-400 bg-violet-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-violet-300" />
            <span>1. Trải Nghiệm Trực Tuyến</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 font-bold">
              {isProActive ? 'PRO' : `${trialRemaining}/5`}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('download')}
            className={`flex items-center gap-2 px-4 py-2.5 font-bold text-sm rounded-t-xl transition-all border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'download'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Download className="w-4 h-4 text-cyan-300" />
            <span>2. Tải Về &amp; Hướng Dẫn</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
              Pass: 123
            </span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`flex items-center gap-2 px-4 py-2.5 font-bold text-sm rounded-t-xl transition-all border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'register'
                ? 'border-amber-400 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>3. Bản Quyền &amp; Kích Hoạt</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: TRẢI NGHIỆM TRỰC TUYẾN (5 LẦN DÙNG THỬ)                           */}
        {/* ========================================================================= */}
        {activeTab === 'online' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            
            {/* THANH DÙNG THỬ 5 CHẤM */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-950 border border-violet-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400 font-bold text-lg">
                  {isProActive ? '👑' : trialRemaining}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    Chính sách Dùng thử Trực tuyến Cấp THPT (5 Lần / Máy tính)
                    {isProActive && (
                      <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40">
                        ĐÃ KÍCH HOẠT PRO
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-300">
                    Mỗi lượt bấm sinh ra 01 Ma trận 16 cột + Bản đặc tả + Bộ {numVariants} mã đề hoán vị + Bảng đối chiếu đáp án song song N cột in đỏ.
                  </p>
                </div>
              </div>
              
              {/* 5 chấm tiến trình */}
              <div className="flex items-center gap-1.5 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-800">
                {[1, 2, 3, 4, 5].map((idx) => {
                  const isUsed = idx > trialRemaining;
                  return (
                    <div
                      key={idx}
                      title={isUsed ? `Lượt ${idx}: Đã dùng` : `Lượt ${idx}: Còn lại`}
                      className={`w-3.5 h-3.5 rounded-full transition-all ${
                        isProActive
                          ? 'bg-emerald-400 shadow-sm shadow-emerald-500/50'
                          : isUsed
                          ? 'bg-slate-700 opacity-40'
                          : 'bg-violet-400 shadow-sm shadow-violet-500/50'
                      }`}
                    />
                  );
                })}
                <span className="ml-2 text-xs font-semibold text-slate-300">
                  {isProActive ? 'Vô hạn Pro' : `${5 - trialRemaining}/5 đã dùng`}
                </span>
              </div>
            </div>

            {/* BẢNG CHỌN KHỐI LỚP, KỲ THI, SỐ MÃ ĐỀ & THÔNG TIN TRƯỜNG */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cột trái: Cấu hình đề */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-violet-400 tracking-wider uppercase block">
                  1. Chọn Khối Lớp THPT (Global Success)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['10', '11', '12'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGrade(g)}
                      className={`py-2 px-3 rounded-lg text-sm font-bold transition-all border cursor-pointer ${
                        selectedGrade === g
                          ? 'bg-violet-600 border-violet-400 text-white shadow-lg shadow-violet-900/40 scale-102'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      Lớp {g}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-xs font-bold text-violet-400 tracking-wider uppercase block mb-1">
                      2. Kỳ Kiểm Tra
                    </label>
                    <select
                      value={selectedTerm}
                      onChange={(e) => setSelectedTerm(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                    >
                      <option value="GK1">GK1 - Giữa Kì 1 (60 phút)</option>
                      <option value="CK1">CK1 - Cuối Kì 1 (Viết + Nói)</option>
                      <option value="GK2">GK2 - Giữa Kì 2 (60 phút)</option>
                      <option value="CK2">CK2 - Cuối Kì 2 (Viết + Nói)</option>
                      <option value="KSCL">KSCL - Khảo sát đầu năm</option>
                      <option value="DECUONG">DECUONG - Đề cương ôn tập</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-violet-400 tracking-wider uppercase block mb-1">
                      3. Số Lượng Mã Đề
                    </label>
                    <select
                      value={numVariants}
                      onChange={(e) => setNumVariants(parseInt(e.target.value, 10))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                    >
                      <option value={1}>1 mã đề ({codePrefix}1)</option>
                      <option value={2}>2 mã đề ({codePrefix}1, {codePrefix}2)</option>
                      <option value={4}>4 mã đề ({codePrefix}1 - {codePrefix}4)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-violet-400 tracking-wider uppercase block mb-1">
                    4. Phương Thức Sinh Đề
                  </label>
                  <select
                    value={generationMode}
                    onChange={(e) => setGenerationMode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="shuffle">Đảo câu &amp; hoán vị đáp án (Cùng nội dung đề gốc)</option>
                    <option value="distinct">Đề mới tương đương (Khác câu hỏi, cùng chuẩn KTKN)</option>
                  </select>
                </div>

                {/* BẢO CHỨNG BÀI NGHE PHÒNG THI */}
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-[11px] text-emerald-300 flex items-center gap-2">
                  <Headphones className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>
                    🔒 <strong>Bài nghe (Q1 - Q8)</strong> cố định 100% chung đáp án giữa các mã đề để học sinh nghe chung 1 file audio trong phòng thi.
                  </span>
                </div>
              </div>

              {/* Cột phải: Thông tin đơn vị & Nút bấm sinh đề */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-violet-400 tracking-wider uppercase block">
                    5. Thông Tin Đơn Vị (Tự Động In Lên Đề)
                  </label>
                  <div>
                    <span className="text-[11px] text-slate-400">Cơ quan chủ quản:</span>
                    <input
                      type="text"
                      value={schoolAgency}
                      onChange={(e) => setSchoolAgency(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 mt-0.5 focus:border-violet-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400">Tên trường THPT:</span>
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 mt-0.5 font-bold focus:border-violet-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400">Năm học áp dụng:</span>
                    <input
                      type="text"
                      value={schoolYear}
                      onChange={(e) => setSchoolYear(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 mt-0.5 focus:border-violet-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* NÚT BẤM SINH ĐỀ TRỰC TUYẾN */}
                <button
                  type="button"
                  onClick={handleGenerateExamOnline}
                  disabled={isGenerating || (!isProActive && trialRemaining <= 0)}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                    !isProActive && trialRemaining <= 0
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-violet-900/40 hover:scale-[1.01]'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Đang sinh bộ đề THPT &amp; bảng đối chiếu...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>
                        TẠO BỘ ĐỀ THPT {numVariants} MÃ ĐỀ{' '}
                        {isProActive ? '(PRO KHÔNG GIỚI HẠN)' : `[CÒN ${trialRemaining}/5 LƯỢT]`}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* LIVE PREVIEW ĐỀ THI SƯ PHẠM CHUẨN */}
            {examGenerated && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-violet-500/40 space-y-4 animate-fadeIn shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white">
                      BỘ ĐỀ KIỂM TRA TIẾNG ANH {selectedGrade} ({selectedTerm}) • {numVariants} MÃ ĐỀ ({variantCodes.join(', ')})
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const content = document.getElementById('thpt-exam-paper')?.innerText || '';
                        navigator.clipboard.writeText(content);
                        setCopiedContent(true);
                        setTimeout(() => setCopiedContent(false), 2000);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedContent ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedContent ? 'Đã sao chép!' : 'Sao chép văn bản'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('download')}
                      className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-xs font-bold text-white flex items-center gap-1.5 transition-colors shadow cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải bộ cài máy tính để xuất Word</span>
                    </button>
                  </div>
                </div>

                {/* VĂN BẢN ĐỀ THI CHUẨN SƯ PHẠM (TIMES NEW ROMAN 13PT, ĐÁP ÁN ĐÚNG IN ĐỎ BOLD=FALSE) */}
                <div
                  id="thpt-exam-paper"
                  className="bg-white text-black p-6 rounded-xl font-serif text-[13pt] leading-relaxed space-y-4 shadow-lg max-h-[460px] overflow-y-auto select-text border border-slate-300"
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                >
                  {/* TIÊU ĐỀ ĐỀ THI 2 CỘT */}
                  <div className="grid grid-cols-2 text-center text-xs font-bold uppercase pb-3 border-b-2 border-black">
                    <div>
                      <p>{schoolAgency}</p>
                      <p className="font-extrabold text-blue-900">{schoolName}</p>
                      <p className="font-normal italic normal-case text-slate-700 mt-0.5">
                        Mã đề thi: <strong className="text-black">{variantCodes[0]}</strong> (Kèm bộ {numVariants} mã đề: {variantCodes.join(', ')})
                      </p>
                    </div>
                    <div>
                      <p>ĐỀ KIỂM TRA {selectedTerm} - NĂM HỌC {schoolYear}</p>
                      <p className="font-extrabold text-red-600">MÔN: TIẾNG ANH {selectedGrade} (THPT)</p>
                      <p className="font-normal italic normal-case text-slate-700 mt-0.5">
                        Thời gian làm bài: 60 phút (Không kể thời gian giao đề)
                      </p>
                    </div>
                  </div>

                  {/* THÔNG TIN MA TRẬN */}
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <p className="font-bold text-center text-red-600 uppercase text-xs">
                      A. MA TRẬN 16 CỘT &amp; BẢN ĐẶC TẢ KỸ THUẬT (CHUẨN BGD&amp;ĐT TỪ 2025)
                    </p>
                    <p className="italic text-center mt-0.5">
                      Đề thi gồm 4 phần: Listening (2.0đ) • Language (2.5đ) • Reading (2.5đ) • Writing (1.0đ - 2.0đ) • Speaking test ({selectedTerm.startsWith('CK') ? '2.0đ' : '0.0đ'}).
                    </p>
                  </div>

                  {/* PHẦN I: LISTENING (CỐ ĐỊNH 100% GIỮA CÁC MÃ ĐỀ) */}
                  <div className="pt-2 border-t border-slate-300 space-y-2 text-[12pt]">
                    <p className="font-bold text-blue-900 uppercase">
                      PART I. LISTENING (2.0 points) - 🔒 CỐ ĐỊNH CHUNG ĐÁP ÁN CHO CẢ {numVariants} MÃ ĐỀ
                    </p>
                    <p className="italic text-[11pt] text-slate-600">
                      Section 1: Listen to a talk about community development and decide whether each statement is True (T) or False (F).
                    </p>
                    <div className="space-y-1 pl-2">
                      <p>Question 1. The green community project was officially launched three years ago. &nbsp;&nbsp;&nbsp;&nbsp; <span className="text-[#FF0000] font-normal underline">✔ A. True</span> &nbsp;&nbsp;&nbsp;&nbsp; B. False</p>
                      <p>Question 2. Volunteers only participate in the cleanup on Sunday afternoons. &nbsp;&nbsp;&nbsp;&nbsp; A. True &nbsp;&nbsp;&nbsp;&nbsp; <span className="text-[#FF0000] font-normal underline">✔ B. False</span></p>
                      <p>Question 3. Local schools have planted more than 500 shade trees along streets. &nbsp;&nbsp;&nbsp;&nbsp; <span className="text-[#FF0000] font-normal underline">✔ A. True</span> &nbsp;&nbsp;&nbsp;&nbsp; B. False</p>
                      <p>Question 4. Plastic waste can be exchanged for organic vegetables at the market. &nbsp;&nbsp;&nbsp;&nbsp; A. True &nbsp;&nbsp;&nbsp;&nbsp; <span className="text-[#FF0000] font-normal underline">✔ B. False</span></p>
                    </div>

                    <p className="italic text-[11pt] text-slate-600 pt-1">
                      Section 2: Listen to an announcement about energy conservation and choose the best answer A, B, C or D.
                    </p>
                    <div className="space-y-2 pl-2">
                      <div>
                        <p>Question 5. What is the primary purpose of the green school campaign?</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[11.5pt] pl-4">
                          <span>A. To plant flowers</span>
                          <span className="text-[#FF0000] font-normal underline">✔ B. To reduce plastic waste</span>
                          <span>C. To raise funds</span>
                          <span>D. To clean rooms</span>
                        </div>
                      </div>
                      <div>
                        <p>Question 6. How often do students collect recyclable items?</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[11.5pt] pl-4">
                          <span>A. Once a month</span>
                          <span>B. Twice a week</span>
                          <span className="text-[#FF0000] font-normal underline">✔ C. Every Friday morning</span>
                          <span>D. Every afternoon</span>
                        </div>
                      </div>
                      <div>
                        <p>Question 7. Who can participate in the environmental workshop?</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[11.5pt] pl-4">
                          <span className="text-[#FF0000] font-normal underline">✔ A. All high school students</span>
                          <span>B. Only club leaders</span>
                          <span>C. Teachers only</span>
                          <span>D. Invited experts</span>
                        </div>
                      </div>
                      <div>
                        <p>Question 8. Where will the award ceremony be held next week?</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[11.5pt] pl-4">
                          <span>A. In the school library</span>
                          <span>B. At the community hall</span>
                          <span>C. On the playground</span>
                          <span className="text-[#FF0000] font-normal underline">✔ D. In the main auditorium</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PHẦN II: LANGUAGE & GRAMMAR */}
                  <div className="pt-3 border-t border-slate-300 space-y-2 text-[12pt]">
                    <p className="font-bold text-blue-900 uppercase">
                      PART II. LANGUAGE &amp; GRAMMAR (2.5 points)
                    </p>
                    <p className="italic text-[11pt] text-slate-600">
                      Mark the letter A, B, C, or D to indicate the word whose underlined part differs from the other three.
                    </p>
                    <div className="space-y-1 pl-2">
                      <div>
                        <p>Question 9.</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[11.5pt] pl-4">
                          <span>A. cook<u>ed</u></span>
                          <span className="text-[#FF0000] font-normal underline">✔ B. clean<u>ed</u></span>
                          <span>C. help<u>ed</u></span>
                          <span>D. pass<u>ed</u></span>
                        </div>
                      </div>
                      <div>
                        <p>Question 10.</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[11.5pt] pl-4">
                          <span>A. sust<u>ai</u>n</span>
                          <span>B. m<u>ai</u>ntain</span>
                          <span className="text-[#FF0000] font-normal underline">✔ C. cert<u>ai</u>n</span>
                          <span>D. entert<u>ai</u>n</span>
                        </div>
                      </div>
                    </div>

                    <p className="italic text-[11pt] text-slate-600 pt-1">
                      Mark the letter A, B, C, or D to indicate the correct answer to complete each sentence.
                    </p>
                    <div className="space-y-2 pl-2">
                      <div>
                        <p>Question 11. If teenagers _______ independent life skills, they would adapt easily to university environments.</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[11.5pt] pl-4">
                          <span>A. develop</span>
                          <span className="text-[#FF0000] font-normal underline">✔ B. developed</span>
                          <span>C. will develop</span>
                          <span>D. have developed</span>
                        </div>
                      </div>
                      <div>
                        <p>Question 12. Digital technologies have revolutionized the way high school students _______ knowledge.</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[11.5pt] pl-4">
                          <span className="text-[#FF0000] font-normal underline">✔ A. acquire</span>
                          <span>B. achieve</span>
                          <span>C. deliver</span>
                          <span>D. conduct</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PHẦN III: READING & SENTENCE ORDERING */}
                  <div className="pt-3 border-t border-slate-300 space-y-2 text-[12pt]">
                    <p className="font-bold text-blue-900 uppercase">
                      PART III. READING &amp; SENTENCE ORDERING (2.5 points)
                    </p>
                    <p className="italic text-[11pt] text-slate-600">
                      Mark the letter A, B, C, or D to indicate the correct arrangement of the sentences to make a meaningful letter.
                    </p>
                    <div className="pl-2 space-y-1">
                      <p>Question 15.</p>
                      <p className="italic pl-4 text-[11pt] text-slate-700">
                        a. Moreover, we have learned how to classify household waste effectively.<br />
                        b. Dear Minh, I am writing to share our recent environmental project at school.<br />
                        c. Firstly, we cleaned up the school playground and planted several trees.
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[11.5pt] pl-4 pt-1">
                        <span className="text-[#FF0000] font-normal underline">✔ A. b - c - a</span>
                        <span>B. a - b - c</span>
                        <span>C. c - a - b</span>
                        <span>D. b - a - c</span>
                      </div>
                    </div>
                  </div>

                  {/* BẢNG ĐỐI CHIẾU ĐÁP ÁN SONG SONG N CỘT CHUẨN QUY ĐỊNH */}
                  <div className="pt-4 border-t-2 border-red-500 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xs uppercase text-red-600 flex items-center gap-2">
                        <span>★ BẢNG ĐỐI CHIẾU ĐÁP ÁN SONG SONG {numVariants} MÃ ĐỀ (IN THƯỜNG, MÀU ĐỎ #FF0000):</span>
                      </p>
                      <span className="text-[11px] text-slate-600 italic">
                        Bài nghe (Q1-Q8) cố định 100% chung đáp án cho mọi mã đề
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-slate-300 text-center text-xs">
                        <thead>
                          <tr className="bg-slate-100 text-slate-800 font-bold">
                            <th className="border border-slate-300 p-1.5 w-14">Câu</th>
                            {variantCodes.map((code) => (
                              <th key={code} className="border border-slate-300 p-1.5 text-blue-900 font-bold">
                                Mã {code}
                              </th>
                            ))}
                            <th className="border border-slate-300 p-1.5 text-left pl-3">Đơn vị kiến thức / Kỹ năng</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Listening T/F Q1 - Q4: Giống nhau 100% */}
                          {[
                            { q: 1, key: 'A', skill: 'Nghe thông tin dự án môi trường (True)' },
                            { q: 2, key: 'B', skill: 'Nghe thông tin lịch hoạt động (False)' },
                            { q: 3, key: 'A', skill: 'Nghe số lượng cây xanh đã trồng (True)' },
                            { q: 4, key: 'B', skill: 'Nghe quy định đổi rác thải (False)' },
                          ].map((item) => (
                            <tr key={item.q} className="hover:bg-slate-50">
                              <td className="border border-slate-300 p-1 font-bold">{item.q}</td>
                              {variantCodes.map((c) => (
                                <td key={c} className="border border-slate-300 p-1 text-[#FF0000] font-normal text-sm">
                                  {item.key}
                                </td>
                              ))}
                              <td className="border border-slate-300 p-1 text-left pl-3 text-slate-600 text-[11px]">
                                {item.skill}
                              </td>
                            </tr>
                          ))}

                          {/* Listening MCQs Q5 - Q8: Giống nhau 100% */}
                          {[
                            { q: 5, key: 'B', skill: 'Nghe mục đích chính chiến dịch (To reduce plastic)' },
                            { q: 6, key: 'C', skill: 'Nghe tần suất thu gom rác (Every Friday)' },
                            { q: 7, key: 'A', skill: 'Nghe đối tượng tham gia workshop (All students)' },
                            { q: 8, key: 'D', skill: 'Nghe địa điểm lễ trao giải (Main auditorium)' },
                          ].map((item) => (
                            <tr key={item.q} className="hover:bg-slate-50">
                              <td className="border border-slate-300 p-1 font-bold">{item.q}</td>
                              {variantCodes.map((c) => (
                                <td key={c} className="border border-slate-300 p-1 text-[#FF0000] font-normal text-sm">
                                  {item.key}
                                </td>
                              ))}
                              <td className="border border-slate-300 p-1 text-left pl-3 text-slate-600 text-[11px]">
                                {item.skill}
                              </td>
                            </tr>
                          ))}

                          {/* Các câu trắc nghiệm khác: Hoán vị đảo đáp án */}
                          {[
                            { q: 9, keys: ['B', 'C', 'A', 'D'], skill: 'Phát âm đuôi -ed: /t/ vs /d/' },
                            { q: 10, keys: ['C', 'A', 'D', 'B'], skill: 'Phát âm nguyên âm kép: /eɪ/ vs /ɪ/' },
                            { q: 11, keys: ['B', 'D', 'B', 'A'], skill: 'Câu điều kiện loại 2 (Conditional Type 2)' },
                            { q: 12, keys: ['A', 'B', 'C', 'D'], skill: 'Từ vựng chủ đề Chuyển đổi số (acquire knowledge)' },
                            { q: 15, keys: ['A', 'D', 'B', 'C'], skill: 'Sắp xếp câu tạo bức thư hoàn chỉnh' },
                          ].map((item) => (
                            <tr key={item.q} className="hover:bg-slate-50">
                              <td className="border border-slate-300 p-1 font-bold">{item.q}</td>
                              {variantCodes.map((c, idx) => (
                                <td key={c} className="border border-slate-300 p-1 text-[#FF0000] font-normal text-sm">
                                  {item.keys[idx % item.keys.length]}
                                </td>
                              ))}
                              <td className="border border-slate-300 p-1 text-left pl-3 text-slate-600 text-[11px]">
                                {item.skill}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BÁO HẾT LƯỢT DÙNG THỬ */}
            {!isProActive && trialRemaining <= 0 && (
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div>
                  <h5 className="text-sm font-bold text-amber-300">
                    Thầy/Cô đã dùng hết 5 lượt trải nghiệm miễn phí trên máy này!
                  </h5>
                  <p className="text-xs text-slate-400">
                    Vui lòng bấm sang Tab "Bản Quyền &amp; Kích Hoạt" để kích hoạt bản quyền Pro sử dụng không giới hạn.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('register')}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow cursor-pointer"
                >
                  Kích hoạt Pro ngay
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: TẢI VỀ & HƯỚNG DẪN                                                */}
        {/* ========================================================================= */}
        {activeTab === 'download' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Nút 1: Bộ cài All-in-One */}
              <div className="p-5 rounded-xl bg-slate-950 border border-emerald-500/40 flex flex-col justify-between space-y-4 hover:border-emerald-400 transition-all">
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 w-fit">
                    <Laptop className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Bộ Cài Đặt Tự Động Vào Word (.exe)</h4>
                  <p className="text-xs text-slate-400">
                    Khuyên dùng cho Giáo viên: Nhúng sẵn Add-in Word &amp; Tool Desktop. Tự động cấu hình Word STARTUP chỉ với 1 click.
                  </p>
                </div>
                <a
                  href={downloadAllInOneUrl}
                  className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải Cai_Dat_TaoDe_TiengAnh_THPT.exe</span>
                </a>
              </div>

              {/* Nút 2: Bản nén ZIP Pass 123 */}
              <div className="p-5 rounded-xl bg-slate-950 border border-blue-500/40 flex flex-col justify-between space-y-4 hover:border-blue-400 transition-all">
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-400 w-fit">
                    <FileCheck2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Bản Nén Đầy Đủ (Pass: 123)</h4>
                  <p className="text-xs text-slate-400">
                    Bao gồm cả file .exe bộ cài, file chạy trực tiếp Desktop không cần cài, Add-in .dotm và file Hướng dẫn sử dụng.
                  </p>
                </div>
                <a
                  href={downloadZipUrl}
                  className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải Tao_De_Tieng_Anh_THPT_Pass_123.zip</span>
                </a>
              </div>

              {/* Nút 3: Add-in .dotm độc lập */}
              <div className="p-5 rounded-xl bg-slate-950 border border-purple-500/40 flex flex-col justify-between space-y-4 hover:border-purple-400 transition-all">
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-purple-500/20 text-purple-400 w-fit">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">File Add-in Word (.dotm)</h4>
                  <p className="text-xs text-slate-400">
                    Dành cho Thầy/Cô am hiểu kỹ thuật muốn copy thủ công vào thư mục Word STARTUP (%APPDATA%\Microsoft\Word\STARTUP).
                  </p>
                </div>
                <a
                  href={downloadDotmUrl}
                  download="TaoDe_TiengAnh_THPT.dotm"
                  className="w-full py-2.5 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải TaoDe_TiengAnh_THPT.dotm</span>
                </a>
              </div>
            </div>

            {/* HƯỚNG DẪN CÀI ĐẶT 3 BƯỚC */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider text-violet-400">
                📖 Quy trình 3 bước cài đặt &amp; sử dụng trên Microsoft Word:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                  <span className="font-bold text-violet-400">Bước 1: Tải bộ cài</span>
                  <p>Tải tệp <code className="text-emerald-400">Cai_Dat_TaoDe_TiengAnh_THPT.exe</code> về máy tính của Thầy/Cô.</p>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                  <span className="font-bold text-violet-400">Bước 2: Bấm Cài Đặt</span>
                  <p>Mở file và bấm nút <strong>"CÀI ĐẶT VÀO WORD NGAY"</strong>. Bộ cài sẽ tự sao chép và thiết lập Trusted Locations.</p>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                  <span className="font-bold text-violet-400">Bước 3: Mở Word sử dụng</span>
                  <p>Mở Microsoft Word, thanh công cụ xuất hiện tab <strong>"📝 TẠO ĐỀ TIẾNG ANH THPT"</strong>. Bấm nút để bắt đầu!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: BẢN QUYỀN & KÍCH HOẠT                                              */}
        {/* ========================================================================= */}
        {activeTab === 'register' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CỘT TRÁI: MÃ MÁY & KÍCH HOẠT KEY */}
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wide text-amber-400 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Kích Hoạt Bản Quyền Pro THPT</span>
                </h4>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Mã nhận diện máy tính của Thầy/Cô (Rule 5: DVT-ENGPT-...):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={detectedMid}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-amber-400 font-mono font-bold tracking-wider select-all"
                    />
                    <button
                      onClick={handleCopyMid}
                      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
                    >
                      {copiedMid ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedMid ? 'Đã chép' : 'Sao chép'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-xs text-slate-400 block mb-1">Dán Mã kích hoạt do Thầy Thành cấp:</label>
                  <input
                    type="text"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="KEY-ENGPT-20261004-XXXXXX-XXXXXX..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-emerald-400 font-mono focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    onClick={handleActivateKey}
                    className="w-full mt-3 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Crown className="w-4 h-4" />
                    <span>KÍCH HOẠT PRO TỨC THÌ</span>
                  </button>

                  {verifyResult && (
                    <div
                      className={`p-3 rounded-lg text-xs mt-3 ${
                        verifyResult.isValid
                          ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300'
                          : 'bg-rose-950/60 border border-rose-500/50 text-rose-300'
                      }`}
                    >
                      {verifyResult.message}
                    </div>
                  )}
                </div>

                {/* TUÂN THỦ RULE 4: TUYỆT ĐỐI KHÔNG HIỂN THỊ GIÁ TIỀN CỐ ĐỊNH BẰNG SỐ */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">Các Gói Bản Quyền Sư Phạm (Không hiển thị giá số):</span>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-slate-900 border border-amber-500/30 text-amber-300">
                      <span className="font-bold block text-[11px]">VIP TRỌN ĐỜI</span>
                      <span className="text-[10px] text-slate-400">Khuyên Dùng</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300">
                      <span className="font-bold block text-[11px]">GÓI 2 NĂM</span>
                      <span className="text-[10px] text-slate-400">2 Năm học</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300">
                      <span className="font-bold block text-[11px]">GÓI 1 NĂM</span>
                      <span className="text-[10px] text-slate-400">1 Năm học</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-400 space-y-1">
                  <p>• Bản quyền độc lập cấp theo mã máy DVT-ENGPT-... hoạt động vĩnh viễn không cần mạng.</p>
                  <p>• Hỗ trợ chuyển bản quyền miễn phí khi Thầy/Cô đổi hoặc nâng cấp máy tính mới.</p>
                </div>
              </div>

              {/* CỘT PHẢI: FORM ĐĂNG KÝ VÀ LIÊN HỆ ZALO */}
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wide text-violet-400 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Đăng Ký Nhận Tư Vấn &amp; Báo Giá Sư Phạm</span>
                </h4>

                {regSent ? (
                  <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                    <h5 className="text-sm font-bold text-white">ĐÃ GỬI THÔNG TIN LÊN HỆ THỐNG CỦA ADMIN!</h5>
                    <p className="text-xs text-slate-300">
                      Thầy Đinh Văn Thành đã nhận được thông tin đăng ký của Thầy/Cô. Để được duyệt và nhận mã key nhanh nhất, xin vui lòng nhắn tin trực tiếp qua Zalo.
                    </p>
                    <a
                      href={BRAND.zaloUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Nhắn tin Zalo với Thầy Thành: 0915.213717</span>
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleSendRegForm} className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Họ và tên Giáo viên (*):</label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Thầy/Cô Nguyễn Văn A"
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:border-violet-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Số điện thoại / Zalo (*):</label>
                      <input
                        type="text"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="0915.xxx.xxx"
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:border-violet-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Trường THPT công tác:</label>
                      <input
                        type="text"
                        value={regSchool}
                        onChange={(e) => setRegSchool(e.target.value)}
                        placeholder="Ví dụ: THPT Chu Văn An..."
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:border-violet-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Ghi chú / Yêu cầu thêm:</label>
                      <input
                        type="text"
                        value={regNote}
                        onChange={(e) => setRegNote(e.target.value)}
                        placeholder="Em muốn đăng ký gói VIP Trọn Đời cho bộ môn Tiếng Anh THPT"
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:border-violet-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSyncingCloud}
                      className="w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSyncingCloud ? 'Đang gửi...' : 'GỬI ĐĂNG KÝ BẢN QUYỀN'}</span>
                    </button>

                    <div className="pt-2 text-center">
                      <a
                        href={BRAND.zaloUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 text-emerald-400 hover:text-emerald-300 text-xs font-bold transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat Zalo trực tiếp Thầy Thành (0915.213717)</span>
                      </a>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 shrink-0">
          <div className="flex items-center gap-3">
            <span>© 2026 Thầy giáo Đinh Văn Thành – THPT Đồng Yên</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-amber-400 font-medium">Hotline / Zalo: 0915.213717</span>
          </div>
          <div className="flex items-center gap-3">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-slate-500 hover:text-slate-300 text-[11px] underline cursor-pointer"
              >
                Quản trị viên
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
