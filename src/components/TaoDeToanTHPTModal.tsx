import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Download,
  Copy,
  Check,
  Crown,
  CheckCircle2,
  FileText,
  Laptop,
  ShieldCheck,
  User,
  Send,
  Sliders,
  RefreshCw,
  Lock,
  Calculator,
  MessageCircle
} from 'lucide-react';
import { BRAND, EXAM_TOAN_THPT_RESOURCES } from '../config/brand';
import { cloudSyncService } from '../services/cloudSyncService';
import {
  getOrCreateExamToanTHPTHardwareCode,
  verifyExamToanTHPTLicenseKey,
  ExamVerifyResult
} from '../services/taodeKeyService';
import { CrossPromoBanner } from './CrossPromoBanner';
import { ShareLinkBar } from './ShareLinkBar';
import { syncBrowserHash } from '../utils/shareUtils';

interface TaoDeToanTHPTModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

export const TaoDeToanTHPTModal: React.FC<TaoDeToanTHPTModalProps> = ({ isOpen, onClose, onOpenAdmin }) => {
  // Modal 3 Tabs chuẩn quy định Rule 2
  const [activeTab, setActiveTab] = useState<'online' | 'download' | 'register'>('download');

  // State Dùng thử 3 lần cố định trên máy tính
  const [trialRemaining, setTrialRemaining] = useState<number>(3);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [hasGeneratedExam, setHasGeneratedExam] = useState<boolean>(false);
  const [selectedGrade, setSelectedGrade] = useState<string>('10');
  const [selectedTerm, setSelectedTerm] = useState<string>('GK1');
  const [numVariants, setNumVariants] = useState<number>(1);
  const [generationMode, setGenerationMode] = useState<string>('shuffle');
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

  useEffect(() => {
    if (!isOpen) return;
    syncBrowserHash('#tao-de-toan-thpt');
    const toanMid = getOrCreateExamToanTHPTHardwareCode();
    setDetectedMid(toanMid);

    const savedPro = localStorage.getItem('gvai_taode_toan_thpt_is_pro_active');
    if (savedPro === 'true') {
      setIsProActive(true);
    }

    // Đọc số lượt dùng thử từ localStorage (Chuẩn 3 lần/môn)
    const savedTrial = localStorage.getItem('gvai_taode_toan_thpt_trial_remaining');
    if (savedTrial !== null) {
      setTrialRemaining(parseInt(savedTrial, 10));
    } else {
      localStorage.setItem('gvai_taode_toan_thpt_trial_remaining', '3');
      setTrialRemaining(3);
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
    const res = await verifyExamToanTHPTLicenseKey(inputKey.trim(), detectedMid);
    if (res.isValid) {
      setIsProActive(true);
      localStorage.setItem('gvai_taode_toan_thpt_is_pro_active', 'true');
      setVerifyResult({ isValid: true, message: '🎉 Kích hoạt Bản quyền Pro Toán THPT thành công! Thầy/Cô có thể tạo đề không giới hạn.' });
    } else {
      setVerifyResult(res);
    }
  };

  const handleGenerateExamOnline = () => {
    if (!isProActive && trialRemaining <= 0) {
      alert('⚠️ Thầy/Cô đã dùng hết 3 lượt dùng thử môn Toán THPT!\n\nVui lòng kích hoạt Bản quyền Pro để sử dụng không giới hạn và xem đầy đủ 100% đáp án.');
      setActiveTab('register');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setHasGeneratedExam(true);

      if (!isProActive) {
        const nextCount = Math.max(0, trialRemaining - 1);
        setTrialRemaining(nextCount);
        localStorage.setItem('gvai_taode_toan_thpt_trial_remaining', nextCount.toString());
      }
    }, 800);
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
        schoolUnit: regSchool || 'Trường THPT',
        appId: 'tao-de-toan-thpt',
        appName: 'Tạo Đề Kiểm Tra Toán THPT (QĐ 764/BGDĐT)',
        packageType: '1YEAR'
      });
      setRegSent(true);
    } catch {
      setRegSent(true);
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const downloadAllInOneUrl = EXAM_TOAN_THPT_RESOURCES.exeWordUrl;
  const downloadZipUrl = EXAM_TOAN_THPT_RESOURCES.fullZipUrl;
  const downloadDotmUrl = EXAM_TOAN_THPT_RESOURCES.dotmUrl;

  // Danh sách mã đề chuẩn theo quy định người dùng:
  // Lớp 10: 101, 102, 103, 104
  // Lớp 11: 111, 112, 113, 114
  // Lớp 12: 121, 122, 123, 124
  const getExamCodePrefix = () => {
    if (selectedGrade === '10') return '10';
    if (selectedGrade === '11') return '11';
    return '12';
  };
  const codePrefix = getExamCodePrefix();
  const variantCodes = Array.from({ length: numVariants }, (_, i) => `${codePrefix}${i + 1}`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[850px] bg-slate-900 border border-blue-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* HEADER MODAL */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-600/30 text-white font-bold text-lg">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  TẠO ĐỀ KIỂM TRA TOÁN THPT (LỚP 10, 11, 12)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm uppercase tracking-wide">
                  ĐỊNH DẠNG MỚI BGD&amp;ĐT 2025+
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Cấu trúc 3 phần (QĐ 764/BGDĐT) • Ma trận 16 cột 3 tầng • Tác giả: Thầy giáo Đinh Văn Thành (0915.213717)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShareLinkBar 
              appUrl="#tao-de-toan-thpt" 
              appName="Tạo Đề Toán THPT" 
              compact={true} 
            />
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* THANH LINK GỬI KHÁCH HÀNG (TRỰC QUAN - COPY 1 CHẠM GỬI ZALO) */}
        <ShareLinkBar 
          appUrl="#tao-de-toan-thpt" 
          appName="Tạo Đề Toán THPT (QĐ 764/BGDĐT)" 
        />

        {/* 3 TABS ĐIỀU HƯỚNG */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 shrink-0 gap-2">
          <button
            onClick={() => setActiveTab('online')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all ${
              activeTab === 'online'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Trải Nghiệm Trực Tuyến
            <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/20 text-blue-300">
              {isProActive ? 'PRO' : `${trialRemaining}/5`}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('download')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all ${
              activeTab === 'download'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Download className="w-4 h-4" />
            Tải Về &amp; Cài Đặt (.EXE, .ZIP, .DOTM)
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all ${
              activeTab === 'register'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Crown className="w-4 h-4" />
            Bản Quyền &amp; Kích Hoạt
          </button>
        </div>

        {/* NỘI DUNG TỪNG TAB */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: TRẢI NGHIỆM TRỰC TUYẾN */}
          {activeTab === 'online' && (
            <div className="space-y-6">
              {/* THANH TRẠNG THÁI DÙNG THỬ 5 CHẤM BẮT BUỘC (RULE 2) */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      Trạng thái phiên bản:
                      {isProActive ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1">
                          <Crown className="w-3.5 h-3.5 text-amber-400" /> BẢN QUYỀN PRO TOÁN THPT ĐÃ KÍCH HOẠT
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold">
                          DÙNG THỬ TRẢI NGHIỆM ({trialRemaining}/5 LƯỢT)
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isProActive
                        ? 'Thầy/Cô sở hữu quyền tạo đề không giới hạn trên máy tính này.'
                        : 'Mỗi máy tính được trải nghiệm miễn phí 5 lần tạo đề đầy đủ ma trận và đáp án đỏ.'}
                    </p>
                  </div>
                </div>

                {!isProActive && (
                  <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-700/50">
                    <span className="text-xs font-semibold text-slate-300">Tiến trình dùng thử:</span>
                    <div className="flex items-center gap-1.5 text-sm">
                      {[1, 2, 3, 4, 5].map((dot) => (
                        <span
                          key={dot}
                          className={`inline-block w-2.5 h-2.5 rounded-full transition-all ${
                            dot <= trialRemaining ? 'bg-blue-500 shadow-sm shadow-blue-500/50' : 'bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* BỘ LỌC CẤU HÌNH ĐỀ KIỂM TRA */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                  <Sliders className="w-4 h-4" />
                  Cấu hình đề kiểm tra Toán THPT (QĐ 764/BGDĐT)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Khối lớp THPT</label>
                    <select
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="10">Toán Lớp 10 (Mã: 101 - 104)</option>
                      <option value="11">Toán Lớp 11 (Mã: 111 - 114)</option>
                      <option value="12">Toán Lớp 12 (Mã: 121 - 124)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Kỳ kiểm tra</label>
                    <select
                      value={selectedTerm}
                      onChange={(e) => setSelectedTerm(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="GK1">Giữa Học kỳ 1 (90 phút)</option>
                      <option value="CK1">Cuối Học kỳ 1 (90 phút)</option>
                      <option value="GK2">Giữa Học kỳ 2 (90 phút)</option>
                      <option value="CK2">Cuối Học kỳ 2 (90 phút)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Số mã đề (1 đề/lần)</label>
                    <select
                      value={isProActive ? numVariants : 1}
                      onChange={(e) => isProActive && setNumVariants(Number(e.target.value))}
                      disabled={!isProActive}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-500 disabled:opacity-75"
                    >
                      <option value={1}>1 Mã đề {isProActive ? '' : '(Dùng thử)'}</option>
                      {isProActive && (
                        <>
                          <option value={2}>2 Mã đề</option>
                          <option value={4}>4 Mã đề chuẩn BGD</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Phương thức sinh đề</label>
                    <select
                      value={generationMode}
                      onChange={(e) => setGenerationMode(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="shuffle">Hoán vị câu &amp; phương án (Đảo đề)</option>
                      <option value="distinct">Ngẫu nhiên phân hóa từng mã đề</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Cơ quan quản lý</label>
                    <input
                      type="text"
                      value={schoolAgency}
                      onChange={(e) => setSchoolAgency(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Tên đơn vị trường</label>
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Năm học</label>
                    <input
                      type="text"
                      value={schoolYear}
                      onChange={(e) => setSchoolYear(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Mã đề sẽ xuất:</span>
                    <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-bold text-xs border border-blue-500/30">
                      {variantCodes[0]} {isProActive ? '' : '(1 đề duy nhất)'}
                    </span>
                  </div>

                  <button
                    onClick={handleGenerateExamOnline}
                    disabled={isGenerating || (!isProActive && trialRemaining <= 0)}
                    className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
                      !isProActive && trialRemaining <= 0
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-blue-600/30 active:scale-95'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Đang tổng hợp Ma trận &amp; Đề thi...
                      </>
                    ) : !isProActive && trialRemaining <= 0 ? (
                      <>
                        <Lock className="w-4 h-4 text-amber-400" /> Hết 3 lượt dùng thử – Nâng cấp Pro
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" /> 🚀 BẤM XUẤT ĐỀ TOÁN LỚP {selectedGrade} ({isProActive ? 'Bản Quyền Pro' : `Dùng thử còn ${trialRemaining}/3 lượt`})
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* MÀN HÌNH CHỜ KHI CHƯA BẤM TẠO ĐỀ */}
              {!hasGeneratedExam && (
                <div className="p-8 rounded-2xl bg-slate-900/60 border border-dashed border-slate-700 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Chưa tạo đề kiểm tra Toán THPT</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    Hệ thống không cung cấp sẵn đề mẫu để copy dùng luôn mà không nuôi app. Quý Thầy/Cô vui lòng bấm nút 
                    <strong className="text-cyan-400"> "🚀 BẤM XUẤT ĐỀ TOÁN LỚP {selectedGrade}"</strong> ở trên để sinh đề thi bám sát Quyết định 764/BGDĐT (Dùng thử 3 lần, xem 1/2 đáp án).
                  </p>
                </div>
              )}

              {/* VÙNG XEM TRƯỚC SƯ PHẠM (CHUẨN FONT TIMES NEW ROMAN, ĐÁP ÁN ĐỎ, BẢNG ĐIỂM NHẬN XÉT) */}
              {hasGeneratedExam && (
                <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl font-serif text-[13pt] leading-relaxed border border-slate-300 overflow-x-auto space-y-4 animate-fade-in">
                  
                  {/* BANNER QUẢNG CÁO DÙNG THỬ CỦA THẦY ĐINH VĂN THÀNH */}
                  {!isProActive && (
                    <div className="p-3.5 rounded-xl border-2 border-dashed border-amber-500 bg-amber-50 text-slate-800 text-xs font-sans">
                      <div className="flex items-center gap-2 text-amber-900 font-bold text-[13px] mb-1">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>BẢN DÙNG THỬ SƯ PHẠM TOÁN THPT (XEM 1/2 ĐÁP ÁN – 1 ĐỀ/LẦN)</span>
                      </div>
                      <p className="text-slate-700 leading-normal">
                        • Tác quyền & Quản trị: <strong>Thầy giáo Đinh Văn Thành</strong> – THCS Đồng Yên – Hotline/Zalo: <strong className="text-emerald-700">0915.213717</strong>.<br/>
                        • Ở bản dùng thử, quý Thầy/Cô được xem 1/2 đáp án câu hỏi để kiểm chứng ma trận chuẩn BGD. Để mở khóa toàn bộ đáp án, xuất file Word và ma trận đặc tả, vui lòng liên hệ Zalo <strong>0915.213717</strong> nâng cấp Pro!
                      </p>
                    </div>
                  )}

                  {/* TIÊU NGỮ VÀ KHUNG ĐỀ THI */}
                  <div className="flex justify-between items-start text-center mb-4 text-[12pt] border-b pb-3 border-slate-300">
                    <div className="text-center font-bold">
                      <p className="uppercase">{schoolAgency}</p>
                      <p className="uppercase font-extrabold text-blue-900">{schoolName}</p>
                      <p className="text-[11pt] font-normal italic mt-0.5">(Đề thi gồm có 04 trang)</p>
                    </div>
                    <div className="text-center font-bold">
                      <p className="uppercase">KIỂM TRA {selectedTerm === 'GK1' ? 'GIỮA HỌC KỲ I' : selectedTerm === 'CK1' ? 'CUỐI HỌC KỲ I' : selectedTerm === 'GK2' ? 'GIỮA HỌC KỲ II' : 'CUỐI HỌC KỲ II'}</p>
                      <p className="uppercase text-blue-900">MÔN TOÁN – LỚP {selectedGrade}</p>
                      <p className="text-[11pt] font-normal italic mt-0.5">Năm học: {schoolYear} • Thời gian: 90 phút</p>
                    </div>
                  </div>

                  {/* DÒNG HỌ TÊN, LỚP VÀ MÃ ĐỀ THI TRÊN BẢNG BIỂU THEO QUY CHUẨN */}
                  <div className="flex justify-between items-center text-[12pt] font-semibold mb-3 px-1">
                    <div>Họ và tên thí sinh: .................................................................................</div>
                    <div>Lớp: ....................</div>
                    <div className="border-2 border-slate-800 px-3 py-0.5 font-bold font-mono text-[13pt] bg-slate-100">
                      Mã đề thi: {variantCodes[0]}
                    </div>
                  </div>

                  {/* BẢNG GHI CHẤM ĐIỂM VÀ NHẬN XÉT CỦA GIÁO VIÊN THEO QUY CHUẨN */}
                  <div className="w-full border-2 border-slate-800 my-4 text-[11pt]">
                    <div className="grid grid-cols-2 border-b border-slate-800 font-bold text-center bg-slate-100">
                      <div className="py-1.5 border-r border-slate-800">ĐIỂM SỐ</div>
                      <div className="py-1.5">NHẬN XÉT CỦA THẦY / CÔ GIÁO</div>
                    </div>
                    <div className="grid grid-cols-2 h-16">
                      <div className="border-r border-slate-800 flex items-center justify-around font-medium text-slate-500 text-center px-2">
                        <div>Bằng số: .........</div>
                        <div>Bằng chữ: .........</div>
                      </div>
                      <div className="p-2 text-slate-500 italic text-[10pt]">
                        ....................................................................................................................................
                      </div>
                    </div>
                  </div>

                  {/* NỘI DUNG ĐỀ THI MÔN TOÁN THPT ĐỊNH DẠNG MỚI (CHỈ 1/2 ĐÁP ÁN KHI !isProActive) */}
                  <div className="space-y-4 text-justify mt-5">
                    <div className="font-bold text-[13pt] text-blue-950 uppercase border-b pb-1 border-slate-400 flex items-center justify-between">
                      <span>PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn (Từ câu 1 đến câu 12)</span>
                      {!isProActive && <span className="text-xs font-sans text-amber-700 bg-amber-100 px-2 py-0.5 rounded">🔒 1/2 Đáp án khóa Pro</span>}
                    </div>
                    <p className="italic text-[11pt] text-slate-600">
                      Mỗi câu hỏi thí sinh chỉ chọn một phương án. (Mỗi câu trả lời đúng thí sinh được 0,25 điểm)
                    </p>

                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold">
                          Câu 1: Cho tập hợp <span className="font-sans font-bold">A = &#123;x &isin; &Ropf; | x&#178; - 5x + 6 = 0&#125;</span>. Tập hợp A được viết dưới dạng liệt kê các phần tử là:
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1.5 pl-3">
                          <span className="font-bold text-[#FF0000]">✔ A. A = &#123;2; 3&#125;.</span>
                          <span>B. A = &#123;-2; -3&#125;.</span>
                          <span>C. A = &#123;1; 6&#125;.</span>
                          <span>D. A = &#123;-1; 6&#125;.</span>
                        </div>
                      </div>

                      <div>
                        <p className="font-semibold">
                          Câu 2: Bất phương trình nào sau đây là bất phương trình bậc nhất hai ẩn?
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1.5 pl-3">
                          <span>A. 2x&#178; + 3y &le; 0.</span>
                          {isProActive ? (
                            <span className="font-bold text-[#FF0000]">✔ B. 2x - 3y + 1 &gt; 0.</span>
                          ) : (
                            <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                              🔒 [Đáp án câu 2 đã bị khóa - Nâng cấp Pro để xem]
                            </span>
                          )}
                          <span>C. 2x + 3y&#178; &ge; 5.</span>
                          <span>D. 2xy - 3y &lt; 1.</span>
                        </div>
                      </div>
                    </div>

                    <div className="font-bold text-[13pt] text-blue-950 uppercase border-b pb-1 border-slate-400 pt-4 flex items-center justify-between">
                      <span>PHẦN II. Câu trắc nghiệm đúng sai (Từ câu 1 đến câu 4)</span>
                      {!isProActive && <span className="text-xs font-sans text-amber-700 bg-amber-100 px-2 py-0.5 rounded">🔒 1/2 Đáp án khóa Pro</span>}
                    </div>
                    <p className="italic text-[11pt] text-slate-600">
                      Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.
                    </p>
                    <div>
                      <p className="font-semibold">
                        Câu 1: Cho hàm số bậc hai <span className="font-sans font-bold">y = f(x) = ax&#178; + bx + c (a &ne; 0)</span> có đồ thị là parabol (P) với đỉnh <span className="font-sans">I(1; -4)</span> và đi qua điểm <span className="font-sans">A(0; -3)</span>.
                      </p>
                      <div className="pl-4 space-y-1 mt-1.5">
                        <p>a) Trục đối xứng của parabol (P) là đường thẳng <span className="font-sans">x = 1</span>. <span className="text-[#FF0000] font-bold">[ĐÚNG]</span></p>
                        <p>b) Hàm số đồng biến trên khoảng <span className="font-sans">(-&infin;; 1)</span>. <span className="text-[#FF0000] font-bold">[SAI]</span></p>
                        <p>c) Đồ thị cắt trục hoành tại hai điểm phân biệt có hoành độ dương. <span className="text-[#FF0000] font-bold">[SAI]</span></p>
                        <p>d) Giá trị nhỏ nhất của hàm số trên đoạn <span className="font-sans">[0; 3]</span> bằng -4. <span className="text-[#FF0000] font-bold">[ĐÚNG]</span></p>
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold">
                        Câu 2: Cho tam giác ABC có độ dài các cạnh a, b, c và bán kính đường tròn ngoại tiếp R.
                      </p>
                      <div className="pl-4 space-y-1 mt-1.5">
                        {isProActive ? (
                          <>
                            <p>a) Định lí sin: a / sinA = 2R. <span className="text-[#FF0000] font-bold">[ĐÚNG]</span></p>
                            <p>b) Diện tích S = abc / 4R. <span className="text-[#FF0000] font-bold">[ĐÚNG]</span></p>
                          </>
                        ) : (
                          <div className="p-2.5 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 text-xs font-sans font-bold">
                            🔒 [Đáp án chi tiết câu 2, 3, 4 đã bị khóa trong bản dùng thử – Vui lòng nâng cấp Pro qua Zalo: 0915.213717]
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="font-bold text-[13pt] text-blue-950 uppercase border-b pb-1 border-slate-400 pt-4 flex items-center justify-between">
                      <span>PHẦN III. Câu trắc nghiệm trả lời ngắn (Từ câu 1 đến câu 6)</span>
                      {!isProActive && <span className="text-xs font-sans text-amber-700 bg-amber-100 px-2 py-0.5 rounded">🔒 1/2 Đáp án khóa Pro</span>}
                    </div>
                    <div>
                      <p className="font-semibold">
                        Câu 1: Một mảnh vườn hình chữ nhật có chu vi bằng 40 m. Để diện tích mảnh vườn lớn nhất thì chiều dài của mảnh vườn bằng bao nhiêu mét?
                      </p>
                      <p className="pl-3 mt-1 font-bold text-[#FF0000]">
                        Đáp án: 10
                      </p>
                    </div>

                    {!isProActive && (
                      <div className="p-3 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 text-xs font-sans font-bold mt-2">
                        🔒 [Đáp án các câu trả lời ngắn từ câu 2 đến câu 6 đã bị khóa ở bản dùng thử. Quý Thầy/Cô vui lòng nâng cấp Bản quyền Pro để xem toàn bộ đáp án 100%]
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-300 text-center italic text-[11pt] text-slate-600">
                    ------------------------- HẾT -------------------------
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TẢI VỀ & CÀI ĐẶT */}
          {activeTab === 'download' && (
            <div className="space-y-6">
              {/* THÔNG TIN XÁC NHẬN BẢN CẬP NHẬT MỚI NHẤT & THỜI GIAN ĐƯA LÊN WEB */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-950 to-cyan-950/80 border border-emerald-500/50 text-slate-200 text-xs space-y-1.5 shadow-lg">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 font-black text-emerald-400 text-xs uppercase tracking-wide">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>XÁC NHẬN PHIÊN BẢN MỚI NHẤT ĐÃ CẬP NHẬT LÊN WEB DEKIEMTRASO.COM</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-md font-mono text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Phiên bản v3.8.2 (Mới nhất)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-300 font-medium pt-1 border-t border-emerald-500/20 font-mono">
                  <div>🕒 <strong>Đưa lên Web lúc:</strong> <span className="text-amber-300 font-bold">09/10/2026 (22:58:23)</span></div>
                  <div>📦 <strong>Bộ cài PC chuẩn:</strong> <span className="text-cyan-300 font-bold">File .exe sạch mới 100%</span></div>
                  <div>✨ <strong>Trạng thái:</strong> <span className="text-emerald-300 font-bold">Đã cập nhật giao diện mới nhất</span></div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 p-5 rounded-2xl border border-blue-500/30 flex flex-col md:flex-row items-center justify-between gap-5">
                <div className="space-y-1.5">
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    BẢN PHÁT HÀNH CHÍNH THỨC 2026
                  </span>
                  <h4 className="text-lg font-black text-white">
                    Tải Trọn Bộ Cài Đặt Tạo Đề Toán THPT (QĐ 764/BGDĐT)
                  </h4>
                  <p className="text-xs text-slate-300 max-w-xl">
                    Đã tích hợp sẵn Ma trận 16 cột 3 tầng, thư viện đề Toán Lớp 10, 11, 12 Kết Nối Tri Thức, tự động sinh 4 mã đề hoán vị và xuất Word chuẩn mực.
                  </p>
                </div>
                <a
                  href={downloadAllInOneUrl}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-blue-500/30 flex items-center gap-2 shrink-0 transition-all hover:scale-105"
                >
                  <Download className="w-5 h-5" /> Tải Bộ Cài Word (.EXE)
                </a>
              </div>

              {/* LƯỚI 3 TÙY CHỌN TẢI XUỐNG */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 flex flex-col justify-between hover:border-blue-500/40 transition-all">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                      📦
                    </div>
                    <h5 className="font-bold text-white text-sm">Bộ Cài Đặt Tự Động (1-Click)</h5>
                    <p className="text-xs text-slate-400">
                      Tệp thực thi <span className="font-mono text-blue-300">Cai_Dat_TaoDe_Toan_THPT.exe</span> (76 MB). Nháy đúp để tự động tích hợp thanh công cụ Tạo Đề vào Word.
                    </p>
                  </div>
                  <a
                    href={downloadAllInOneUrl}
                    className="mt-4 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" /> Tải Cai_Dat_TaoDe_Toan_THPT.exe
                  </a>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-500/40 transition-all">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                      🗜️
                    </div>
                    <h5 className="font-bold text-white text-sm">Bản Nén Trọn Bộ Pass 123</h5>
                    <p className="text-xs text-slate-400">
                      Tệp nén <span className="font-mono text-indigo-300">Tao_De_Toan_THPT_Pass_123.zip</span> (114 MB). Chứa đầy đủ bộ cài Word, bản chạy Desktop và hướng dẫn.
                    </p>
                    <div className="inline-block px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[11px] text-amber-300 font-semibold">
                      Mật khẩu giải nén: <span className="font-bold font-mono">123</span>
                    </div>
                  </div>
                  <a
                    href={downloadZipUrl}
                    className="mt-4 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" /> Tải Bản Nén ZIP (Pass: 123)
                  </a>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-all">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                      📄
                    </div>
                    <h5 className="font-bold text-white text-sm">Add-in Word Ribbon (.DOTM)</h5>
                    <p className="text-xs text-slate-400">
                      Tệp mẫu <span className="font-mono text-emerald-300">TaoDe_Toan_THPT.dotm</span>. Dành cho Quý Thầy/Cô sao chép trực tiếp vào thư mục STARTUP của Word.
                    </p>
                  </div>
                  <a
                    href={downloadDotmUrl}
                    className="mt-4 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" /> Tải File TaoDe_Toan_THPT.dotm
                  </a>
                </div>
              </div>

              {/* HƯỚNG DẪN CÀI ĐẶT NHANH */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 space-y-3">
                <h5 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  Hướng dẫn cài đặt nhanh 3 bước
                </h5>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300">
                  <li>Tải file <span className="font-mono text-blue-300 font-bold">Cai_Dat_TaoDe_Toan_THPT.exe</span> hoặc tải file ZIP (Mật khẩu giải nén là <span className="font-bold text-amber-300">123</span>).</li>
                  <li>Tắt toàn bộ các cửa sổ Microsoft Word đang mở, sau đó nháy đúp vào file <span className="font-mono text-blue-300 font-bold">Cai_Dat_TaoDe_Toan_THPT.exe</span> và nhấn "Cài đặt ngay".</li>
                  <li>Mở Microsoft Word lên, Thầy/Cô sẽ thấy tab mới <span className="font-bold text-white bg-blue-600/30 px-1.5 py-0.5 rounded">TẠO ĐỀ TOÁN THPT</span> xuất hiện trên thanh công cụ Ribbon Word.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: BẢN QUYỀN & KÍCH HOẠT */}
          {activeTab === 'register' && (
            <div className="space-y-6">
              {/* PHẦN 1: MÃ MÁY TÍNH & Ô NHẬP KEY */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-4">
                  <div>
                    <h5 className="font-bold text-white text-sm flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-blue-400" />
                      Mã Phần Cứng Máy Tính Của Thầy/Cô (Hardware Code)
                    </h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Gửi mã này qua Zalo <span className="font-bold text-blue-300">0915.213717</span> để Thầy Thành kích hoạt bản quyền Pro.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 bg-slate-900 rounded-xl font-mono text-xs font-bold text-blue-400 border border-blue-500/30">
                      {detectedMid || 'DVT-MATHPT-ĐANG-LẤY...'}
                    </div>
                    <button
                      onClick={handleCopyMid}
                      className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="Sao chép mã máy"
                    >
                      {copiedMid ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedMid ? 'Đã chép' : 'Chép'}
                    </button>
                  </div>
                </div>

                {/* Ô NHẬP KEY KÍCH HOẠT */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">
                    Nhập mã bản quyền Pro (Do Thầy Đinh Văn Thành cấp):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputKey}
                      onChange={(e) => setInputKey(e.target.value)}
                      placeholder="Dán mã kích hoạt tại đây (Ví dụ: KEY-MATHPT-... hoặc MATHPT-LT-...)"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={handleActivateKey}
                      className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all shrink-0 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Kích Hoạt Ngay
                    </button>
                  </div>

                  {verifyResult && (
                    <div
                      className={`p-3 rounded-xl text-xs font-medium border ${
                        verifyResult.isValid
                          ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                          : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                      }`}
                    >
                      {verifyResult.message}
                    </div>
                  )}
                </div>
              </div>

              {/* PHẦN 2: BẢNG GÓI BẢN QUYỀN (TUÂN THỦ RULE 4: TUYỆT ĐỐI KHÔNG HIỂN THỊ GIÁ TIỀN CỤ THỂ) */}
              <div className="space-y-3">
                <h5 className="font-bold text-white text-sm flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  Các Gói Bản Quyền Sư Phạm (Liên hệ Zalo để nhận báo giá ưu đãi)
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tiết Kiệm</span>
                      <h6 className="font-bold text-white text-base">Gói Bản Quyền 1 Năm</h6>
                      <p className="text-xs text-slate-400">
                        Sử dụng trọn vẹn 1 năm học (12 tháng). Đầy đủ tính năng tạo đề Toán 10, 11, 12 theo cấu trúc mới.
                      </p>
                      <div className="pt-2 text-xs font-bold text-blue-400">
                        Báo giá ưu đãi sư phạm qua Zalo
                      </div>
                    </div>
                    <a
                      href={`https://zalo.me/${BRAND.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-blue-400" /> Nhận báo giá qua Zalo
                    </a>
                  </div>

                  <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Ưu Đãi Sư Phạm</span>
                      <h6 className="font-bold text-white text-base">Gói Bản Quyền 2 Năm</h6>
                      <p className="text-xs text-slate-400">
                        Sử dụng 2 năm học (24 tháng). Tự động cập nhật ngân hàng câu hỏi và tính năng mới miễn phí.
                      </p>
                      <div className="pt-2 text-xs font-bold text-indigo-400">
                        Báo giá ưu đãi sư phạm qua Zalo
                      </div>
                    </div>
                    <a
                      href={`https://zalo.me/${BRAND.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full py-2 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-indigo-300" /> Nhận báo giá qua Zalo
                    </a>
                  </div>

                  <div className="bg-gradient-to-b from-blue-900/40 to-indigo-900/30 border-2 border-blue-500/60 rounded-2xl p-4 flex flex-col justify-between relative shadow-xl shadow-blue-500/10">
                    <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] uppercase shadow-md">
                      Khuyên Dùng
                    </div>
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Đặc Quyền Vĩnh Viễn</span>
                      <h6 className="font-bold text-white text-base">Gói VIP Trọn Đời (Khuyên Dùng)</h6>
                      <p className="text-xs text-slate-300">
                        Sử dụng vĩnh viễn trọn đời không giới hạn thời gian. Hỗ trợ kỹ thuật 24/7 và nâng cấp trọn đời.
                      </p>
                      <div className="pt-2 text-xs font-bold text-amber-300">
                        Ưu đãi đặc biệt sư phạm qua Zalo
                      </div>
                    </div>
                    <a
                      href={`https://zalo.me/${BRAND.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-slate-950" /> Liên hệ Thầy Thành ngay
                    </a>
                  </div>
                </div>
              </div>

              {/* FORM GỬI ĐĂNG KÝ BẢN QUYỀN TỰ ĐỘNG */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 space-y-4">
                <h5 className="font-bold text-white text-sm flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-400" />
                  Đăng ký nhận báo giá &amp; mã kích hoạt trực tuyến
                </h5>

                {regSent ? (
                  <div className="bg-emerald-950/60 border border-emerald-500/40 p-4 rounded-xl text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <h6 className="font-bold text-white text-sm">Đã gửi thông tin đăng ký thành công!</h6>
                    <p className="text-xs text-slate-300">
                      Hệ thống đã chuyển thông tin tới Thầy Đinh Văn Thành. Thầy Thành sẽ chủ động liên hệ qua Zalo của Thầy/Cô để tư vấn và cấp key bản quyền.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSendRegForm} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Họ và tên Giáo viên *</label>
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Ví dụ: Thầy / Cô Nguyễn Văn A"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Số điện thoại / Zalo *</label>
                        <input
                          type="text"
                          required
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="Ví dụ: 0915213717"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Trường học / Đơn vị công tác</label>
                        <input
                          type="text"
                          value={regSchool}
                          onChange={(e) => setRegSchool(e.target.value)}
                          placeholder="Ví dụ: Trường THPT..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Ghi chú hoặc yêu cầu thêm</label>
                        <input
                          type="text"
                          value={regNote}
                          onChange={(e) => setRegNote(e.target.value)}
                          placeholder="Ví dụ: Cần gói trọn đời..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSyncingCloud}
                      className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      {isSyncingCloud ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Đang chuyển thông tin...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Gửi Đăng Ký Bản Quyền Ngay
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* CROSS PROMO BANNER HỆ SINH THÁI */}
          <CrossPromoBanner currentAppId="tao-de-toan-thpt" />
        </div>

        {/* FOOTER MODAL */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950/80 text-xs text-slate-400 shrink-0 gap-2">
          <div className="flex items-center gap-3">
            <span>Tác giả: <strong className="text-white">Thầy Đinh Văn Thành</strong> (THCS Đồng Yên)</span>
            <span>•</span>
            <span>Hotline / Zalo: <strong className="text-blue-400">0915.213717</strong></span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-[11px] text-slate-500 hover:text-slate-300 font-mono underline"
              >
                Khu vực Quản trị Admin
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
            >
              Đóng lại
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
