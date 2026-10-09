import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Download,
  Copy,
  Check,
  Crown,
  CheckCircle2,
  FileCheck2,
  Headphones,
  MessageCircle,
  FileText,
  Laptop,
  ShieldCheck,
  User,
  Send,
  Sliders,
  CheckSquare,
  BookOpen,
  Lock,
  Layers,
  Star,
  Award
} from 'lucide-react';
import { BRAND, EXAM_ENG_PRIMARY_RESOURCES } from '../config/brand';
import { cloudSyncService } from '../services/cloudSyncService';
import {
  getOrCreateExamEngPrimaryHardwareCode,
  getSecureExamPrimaryTrialRemaining,
  consumeSecureExamPrimaryTrial,
  verifyExamEngPrimaryLicenseKey,
  ExamVerifyResult
} from '../services/taodeKeyService';
import { webSecurityGuard } from '../services/webSecurityGuard';
import { CrossPromoBanner } from './CrossPromoBanner';
import { ShareLinkBar } from './ShareLinkBar';
import { syncBrowserHash } from '../utils/shareUtils';

interface TaoDeTiengAnhTieuHocModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

export const TaoDeTiengAnhTieuHocModal: React.FC<TaoDeTiengAnhTieuHocModalProps> = ({ isOpen, onClose, onOpenAdmin }) => {
  // Modal 3 Tabs chuẩn quy định Rule 2
  const [activeTab, setActiveTab] = useState<'online' | 'download' | 'register'>('online');

  // State Dùng thử 5 lần cố định trên máy tính (Rule 2)
  const [trialRemaining, setTrialRemaining] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [examGenerated, setExamGenerated] = useState<boolean>(true);
  const [selectedGrade, setSelectedGrade] = useState<string>('3');
  const [selectedTerm, setSelectedTerm] = useState<string>('GK1');
  const [numVariants, setNumVariants] = useState<number>(2);
  const [schoolAgency, setSchoolAgency] = useState<string>('PHÒNG GIÁO DỤC VÀ ĐÀO TẠO ....................');
  const [schoolName, setSchoolName] = useState<string>('TRƯỜNG TIỂU HỌC ....................');
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
    syncBrowserHash('#taode-tienganh-tieuhoc');
    const priMid = getOrCreateExamEngPrimaryHardwareCode();
    setDetectedMid(priMid);

    const savedPro = localStorage.getItem('gvai_taode_engpri_is_pro_active');
    if (savedPro === 'true') {
      setIsProActive(true);
    }

    getSecureExamPrimaryTrialRemaining(priMid).then(rem => {
      setTrialRemaining(rem);
    });
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
    const res = await verifyExamEngPrimaryLicenseKey(inputKey, detectedMid);
    setVerifyResult(res);
    if (res.isValid) {
      setIsProActive(true);
      localStorage.setItem('gvai_taode_engpri_is_pro_active', 'true');
      localStorage.setItem('gvai_taode_engpri_license_key', inputKey.trim());
    }
  };

  const handleGenerateExamOnline = async () => {
    if (!isProActive && trialRemaining <= 0) {
      setActiveTab('register');
      return;
    }

    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 600));

    if (!isProActive) {
      const nextRemaining = await consumeSecureExamPrimaryTrial(detectedMid);
      setTrialRemaining(nextRemaining);
    }

    setIsGenerating(false);
    setExamGenerated(true);
  };

  const handleSendRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) {
      alert('Vui lòng nhập Họ tên và Số điện thoại/Zalo để Thầy Thành hỗ trợ!');
      return;
    }
    setIsSyncingCloud(true);
    try {
      await cloudSyncService.register({
        machineId: detectedMid,
        fullName: regName,
        phoneZalo: regPhone,
        schoolName: regSchool || 'Trường Tiểu Học',
        note: `[Đề Tiếng Anh Tiểu Học - TT 27] Lớp ${selectedGrade} - ${regNote}`,
        appId: 'taode_tieuhoc_tienganh',
        appName: 'Tạo Đề Tiếng Anh Tiểu Học Global Success (TT 27)'
      });
      setRegSent(true);
    } catch {
      setRegSent(true);
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const copyExamText = () => {
    const el = document.getElementById('primary-exam-preview-content');
    if (el) {
      navigator.clipboard.writeText(el.innerText);
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* MODAL HEADER */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-950 via-slate-900 to-sky-950 border-b border-amber-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg text-white font-black text-lg">
              🎒
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-wide flex items-center gap-2">
                  TẠO ĐỀ TIẾNG ANH TIỂU HỌC GLOBAL SUCCESS
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold">
                    THÔNG TƯ 27/2020
                  </span>
                </h2>
              </div>
              <p className="text-xs text-amber-200/80 font-medium">
                Tác giả: Thầy giáo Đinh Văn Thành – THCS Đồng Yên – Zalo: 0915.213717
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ShareLinkBar 
              appUrl="#taode-tienganh-tieuhoc" 
              appName="Tạo Đề Tiếng Anh Tiểu Học" 
              compact={true} 
            />
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-700/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* THANH LINK GỬI KHÁCH HÀNG (TRỰC QUAN - COPY 1 CHẠM GỬI ZALO) */}
        <ShareLinkBar 
          appUrl="#taode-tienganh-tieuhoc" 
          appName="Tạo Đề Tiếng Anh Tiểu Học (TT 27)" 
        />

        {/* 3 TABS NAVIGATION (Rule 2) */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-5 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('online')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'online'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Tab 1: Trải Nghiệm Trực Tuyến</span>
            {!isProActive && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/40">
                {trialRemaining}/5 Lượt
              </span>
            )}
            {isProActive && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                PRO VIP
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('download')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'download'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Tab 2: Tải Về & Hướng Dẫn</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/40">
              Desktop .zip
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`py-3 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Crown className="w-4 h-4 text-yellow-400" />
            <span>Tab 3: Bản Quyền & Kích Hoạt</span>
            {isProActive ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                Đã Kích Hoạt
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40">
                Cấp Key Pro
              </span>
            )}
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-900/90 text-slate-100">
          
          {/* ========================================================================= */}
          {/* TAB 1: TRẢI NGHIỆM TRỰC TUYẾN (5 LƯỢT DÙNG THỬ) */}
          {/* ========================================================================= */}
          {activeTab === 'online' && (
            <div className="space-y-6">
              
              {/* THANH TIẾN TRÌNH 5 CHẤM DÙNG THỬ (Rule 2) */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      CHÍNH SÁCH DÙNG THỬ MIỄN PHÍ TRÊN MÁY TÍNH
                      {isProActive ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white">
                          ĐÃ KÍCH HOẠT BẢN QUYỀN PRO
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/30 text-amber-300 border border-amber-500/40">
                          {trialRemaining} / 5 LƯỢT CÒN LẠI
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Mỗi máy tính được trải nghiệm đủ 5 lần tạo đề hoàn chỉnh kèm Ma trận 4 mức độ & Bản đặc tả theo Thông tư 27.
                    </p>
                  </div>
                </div>

                {/* 5 CHẤM TIẾN TRÌNH TRỰC QUAN */}
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((dot) => {
                    const isUsed = dot > trialRemaining && !isProActive;
                    return (
                      <div
                        key={dot}
                        className={`w-3.5 h-3.5 rounded-full transition-all flex items-center justify-center text-[8px] font-bold ${
                          isProActive
                            ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/40'
                            : isUsed
                            ? 'bg-slate-700 text-slate-500'
                            : 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/50 animate-pulse'
                        }`}
                        title={isProActive ? 'Bản quyền Pro không giới hạn' : `Lượt ${dot}: ${isUsed ? 'Đã sử dụng' : 'Khả dụng'}`}
                      >
                        {isProActive ? '★' : dot}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* BẢNG ĐIỀU KHIỂN THIẾT LẬP ĐỀ THI TIỂU HỌC */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    CẤU HÌNH THÔNG SỐ ĐỀ THI TIỂU HỌC (GLOBAL SUCCESS)
                  </h3>
                  <span className="text-xs text-slate-400">
                    Mã máy: <span className="font-mono text-amber-300 font-bold">{detectedMid}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Khối Lớp:</label>
                    <select
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 font-bold text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option value="1">Lớp 1 (Global Success Tiểu Học)</option>
                      <option value="2">Lớp 2 (Global Success Tiểu Học)</option>
                      <option value="3">Lớp 3 (Global Success Tiểu Học)</option>
                      <option value="4">Lớp 4 (Global Success Tiểu Học)</option>
                      <option value="5">Lớp 5 (Global Success Tiểu Học)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Kỳ Kiểm Tra:</label>
                    <select
                      value={selectedTerm}
                      onChange={(e) => setSelectedTerm(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sky-300 font-bold text-xs focus:outline-none focus:border-sky-400"
                    >
                      <option value="GK1">Giữa Học Kì 1 (Units 1 - 5)</option>
                      <option value="CK1">Cuối Học Kì 1 (Units 1 - 10)</option>
                      <option value="GK2">Giữa Học Kì 2 (Units 11 - 15)</option>
                      <option value="CK2">Cuối Học Kì 2 (Units 11 - 20)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Số Lượng Đề Trộn:</label>
                    <select
                      value={numVariants}
                      onChange={(e) => setNumVariants(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-emerald-300 font-bold text-xs focus:outline-none focus:border-emerald-400"
                    >
                      <option value={1}>1 Mã Đề (Đề Gốc)</option>
                      <option value={2}>2 Mã Đề (Đề 101, 102)</option>
                      <option value={3}>3 Mã Đề (Đề 101, 102, 103)</option>
                      <option value={4}>4 Mã Đề (Đề 101, 102, 103, 104)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Năm Học:</label>
                    <input
                      type="text"
                      value={schoolYear}
                      onChange={(e) => setSchoolYear(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Đơn vị chủ quản:</label>
                    <input
                      type="text"
                      value={schoolAgency}
                      onChange={(e) => setSchoolAgency(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Tên trường Tiểu học:</label>
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* NÚT TẠO ĐỀ TRỰC TUYẾN KÈM BẢNG LƯỢT */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                    <span>Chuẩn định dạng: <strong>Times New Roman 13pt</strong>, bảng đánh giá Thông tư 27.</span>
                  </div>

                  <button
                    type="button"
                    disabled={isGenerating || (!isProActive && trialRemaining <= 0)}
                    onClick={handleGenerateExamOnline}
                    className={`px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                      !isProActive && trialRemaining <= 0
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 hover:shadow-amber-500/30 hover:scale-[1.02]'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Đang khởi tạo đề Tiểu học...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>
                          {isProActive
                            ? 'XUẤT ĐỀ TIỂU HỌC NGAY (BẢN PRO KHÔNG GIỚI HẠN)'
                            : trialRemaining > 0
                            ? `TẠO ĐỀ TIỂU HỌC NGAY (${trialRemaining}/5 LƯỢT DÙNG THỬ)`
                            : 'ĐÃ HẾT 5 LƯỢT - NÂNG CẤP BẢN QUYỀN PRO'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* KHUNG XEM TRƯỚC ĐỀ THI ĐẠT CHUẨN SƯ PHẠM (TIMES NEW ROMAN 13PT) */}
              {examGenerated && (
                <div className="rounded-2xl border border-slate-700 bg-white text-slate-900 shadow-2xl overflow-hidden font-serif">
                  
                  {/* THANH CÔNG CỤ XEM TRƯỚC */}
                  <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-300 flex items-center justify-between font-sans">
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-blue-700" />
                      <span className="text-xs font-bold text-slate-800">
                        BẢN XEM TRƯỚC SƯ PHẠM (ĐỀ KIỂM TRA ĐỊNH KÌ TIẾNG ANH LỚP {selectedGrade} - TT 27)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={copyExamText}
                        className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        {copiedContent ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedContent ? 'Đã sao chép' : 'Sao chép văn bản'}</span>
                      </button>
                    </div>
                  </div>

                  {/* NỘI DUNG VĂN BẢN ĐẠT CHUẨN SƯ PHẠM */}
                  <div id="primary-exam-preview-content" className="p-6 sm:p-8 space-y-6 text-[13pt] leading-relaxed text-slate-900 font-serif">
                    
                    {/* TIÊU NGỮ VÀ TIÊU ĐỀ BỘ ĐỀ */}
                    <div className="flex justify-between items-start text-center border-b pb-4">
                      <div className="text-xs uppercase font-bold space-y-1">
                        <p>{schoolAgency}</p>
                        <p>{schoolName}</p>
                        <p className="text-blue-700">MÃ ĐỀ: 101</p>
                      </div>
                      <div className="text-center space-y-1">
                        <p className="font-bold text-sm sm:text-base uppercase text-blue-900">
                          BÀI KIỂM TRA ĐỊNH KÌ TIẾNG ANH - LỚP {selectedGrade}
                        </p>
                        <p className="text-xs font-bold italic">
                          {selectedTerm === 'GK1' ? 'Giữa Học Kì 1' : selectedTerm === 'CK1' ? 'Cuối Học Kì 1' : selectedTerm === 'GK2' ? 'Giữa Học Kì 2' : 'Cuối Học Kì 2'} - Năm học: {schoolYear}
                        </p>
                        <p className="text-xs italic">Thời gian làm bài: 40 phút (Không kể thời gian phát đề)</p>
                      </div>
                    </div>

                    {/* KHUNG THÔNG TIN HỌC SINH VÀ PHIẾU ĐÁNH GIÁ THEO THÔNG TƯ 27 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs border p-3 rounded-lg bg-slate-50">
                      <div>
                        <p>Họ và tên học sinh: ............................................................................</p>
                        <p className="mt-1">Lớp: {selectedGrade}.... - Trường Tiểu học: ............................................</p>
                      </div>
                      <div>
                        <p>Ngày kiểm tra: ...... / ...... / 2026</p>
                        <p className="mt-1">Giáo viên coi thi: .............................................................</p>
                      </div>
                    </div>

                    {/* BẢNG ĐÁNH GIÁ CHUẨN THÔNG TƯ 27/2020/TT-BGDĐT */}
                    <div className="border border-slate-400 rounded-lg overflow-hidden text-xs">
                      <div className="grid grid-cols-12 bg-slate-100 font-bold text-center border-b border-slate-400 py-1.5">
                        <div className="col-span-3 border-r border-slate-400">Điểm số (Bằng số & chữ)</div>
                        <div className="col-span-5 border-r border-slate-400">Mức đạt được (Thông tư 27)</div>
                        <div className="col-span-4">Lời nhận xét của thầy cô giáo</div>
                      </div>
                      <div className="grid grid-cols-12 text-center min-h-[60px] items-center">
                        <div className="col-span-3 border-r border-slate-400 font-bold text-sm text-red-600">
                          ............ / 10.0
                        </div>
                        <div className="col-span-5 border-r border-slate-400 text-left px-3 py-1 space-y-1">
                          <p>🔲 Hoàn thành tốt (Tốt)</p>
                          <p>🔲 Hoàn thành (Đạt)</p>
                          <p>🔲 Chưa hoàn thành (Cần cố gắng)</p>
                        </div>
                        <div className="col-span-4 text-left px-3 py-1 italic text-slate-600">
                          .............................................................<br />
                          .............................................................
                        </div>
                      </div>
                    </div>

                    {/* NỘI DUNG 4 PHẦN KỸ NĂNG */}
                    <div className="space-y-4 pt-2">
                      <div className="font-bold text-blue-900 border-b pb-1 flex items-center justify-between">
                        <span>PART 1: LISTENING (4.0 points - 15 minutes)</span>
                        <span className="text-xs text-red-600 font-normal italic">Kỹ năng Nghe chuẩn giáo trình Global Success</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <p className="font-bold">Question 1. Listen and number (1.0 pt):</p>
                        <p className="italic text-slate-600">Listen to the audio and write the numbers 1, 2, 3, 4 in the correct boxes below.</p>
                        <div className="grid grid-cols-4 gap-2 text-center p-3 border rounded bg-slate-50">
                          <div className="border p-2 rounded bg-white font-bold">Picture A: [ ..... ]</div>
                          <div className="border p-2 rounded bg-white font-bold">Picture B: [ ..... ]</div>
                          <div className="border p-2 rounded bg-white font-bold">Picture C: [ ..... ]</div>
                          <div className="border p-2 rounded bg-white font-bold">Picture D: [ ..... ]</div>
                        </div>

                        <p className="font-bold pt-2">Question 2. Listen and tick (✓) True or False (1.0 pt):</p>
                        <table className="w-full text-left border-collapse border border-slate-300 text-xs">
                          <thead>
                            <tr className="bg-slate-100">
                              <th className="border border-slate-300 p-1.5 w-10 text-center">No</th>
                              <th className="border border-slate-300 p-1.5">Statements</th>
                              <th className="border border-slate-300 p-1.5 w-16 text-center">True (✓)</th>
                              <th className="border border-slate-300 p-1.5 w-16 text-center">False (✓)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-slate-300 p-1.5 text-center">1</td>
                              <td className="border border-slate-300 p-1.5">My name is Nam. I'm in class 3A.</td>
                              <td className="border border-slate-300 p-1.5 text-center">[ ]</td>
                              <td className="border border-slate-300 p-1.5 text-center">[ ]</td>
                            </tr>
                            <tr>
                              <td className="border border-slate-300 p-1.5 text-center">2</td>
                              <td className="border border-slate-300 p-1.5">This is my school bag. It is blue and big.</td>
                              <td className="border border-slate-300 p-1.5 text-center">[ ]</td>
                              <td className="border border-slate-300 p-1.5 text-center">[ ]</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="font-bold text-blue-900 border-b pb-1 pt-3 flex items-center justify-between">
                        <span>PART 2: READING (2.5 points)</span>
                        <span className="text-xs text-red-600 font-normal italic">Kỹ năng Đọc hiểu từ vựng & mẫu câu</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <p className="font-bold">Question 3. Read and choose the correct answer A, B or C (1.5 pts):</p>
                        <p>1. Hello, I am Mai. - Hi Mai, ________ am Tony.</p>
                        <p className="pl-4">A. I <span className="pl-8">B. You</span> <span className="pl-8">C. She</span></p>

                        <p className="pt-1">2. How are you today? - I am fine, ________ you.</p>
                        <p className="pl-4">A. thanks <span className="pl-8">B. good</span> <span className="pl-8">C. bye</span></p>
                      </div>

                      <div className="font-bold text-blue-900 border-b pb-1 pt-3 flex items-center justify-between">
                        <span>PART 3: WRITING (2.5 points)</span>
                        <span className="text-xs text-red-600 font-normal italic">Kỹ năng Viết chính tả & sắp xếp câu</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <p className="font-bold">Question 4. Reorder the words to make complete sentences (1.5 pts):</p>
                        <p>1. name / your / What / is / ?</p>
                        <p className="italic text-slate-500 pl-4">➔ ............................................................................................................</p>

                        <p className="pt-1">2. my / This / teacher / is / English / .</p>
                        <p className="italic text-slate-500 pl-4">➔ ............................................................................................................</p>
                      </div>

                      <div className="font-bold text-blue-900 border-b pb-1 pt-3 flex items-center justify-between">
                        <span>PART 4: SPEAKING (1.0 point)</span>
                        <span className="text-xs text-red-600 font-normal italic">Kỹ năng Nói & Giao tiếp trực tiếp</span>
                      </div>

                      <div className="space-y-1 text-xs">
                        <p>• Task 1: Getting to know each other (Chào hỏi, giới thiệu tên, tuổi).</p>
                        <p>• Task 2: Talk about classroom objects (Chỉ vào đồ dùng học tập và gọi tên).</p>
                      </div>
                    </div>

                    {/* MA TRẬN 4 MỨC ĐỘ THEO THÔNG TƯ 27/2020 */}
                    <div className="pt-6 border-t mt-6 space-y-2">
                      <div className="text-center font-bold text-blue-900 text-sm">
                        MA TRẬN ĐỀ KIỂM TRA ĐỊNH KÌ TIẾNG ANH TIỂU HỌC (THÔNG TƯ 27)
                      </div>
                      <table className="w-full text-xs border-collapse border border-slate-400 text-center">
                        <thead>
                          <tr className="bg-slate-100 font-bold">
                            <th className="border border-slate-400 p-1.5" rowSpan={2}>Kỹ năng</th>
                            <th className="border border-slate-400 p-1.5" colSpan={2}>Mức 1 (50%)</th>
                            <th className="border border-slate-400 p-1.5" colSpan={2}>Mức 2 (30%)</th>
                            <th className="border border-slate-400 p-1.5" colSpan={2}>Mức 3 (15%)</th>
                            <th className="border border-slate-400 p-1.5" colSpan={2}>Mức 4 (5%)</th>
                            <th className="border border-slate-400 p-1.5" colSpan={2}>Tổng cộng</th>
                          </tr>
                          <tr className="bg-slate-50 font-bold">
                            <th className="border border-slate-400 p-1">Số câu</th>
                            <th className="border border-slate-400 p-1">Điểm</th>
                            <th className="border border-slate-400 p-1">Số câu</th>
                            <th className="border border-slate-400 p-1">Điểm</th>
                            <th className="border border-slate-400 p-1">Số câu</th>
                            <th className="border border-slate-400 p-1">Điểm</th>
                            <th className="border border-slate-400 p-1">Số câu</th>
                            <th className="border border-slate-400 p-1">Điểm</th>
                            <th className="border border-slate-400 p-1">Số câu</th>
                            <th className="border border-slate-400 p-1">Điểm</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-slate-400 p-1.5 font-bold text-left">1. Listening</td>
                            <td className="border border-slate-400 p-1">4</td>
                            <td className="border border-slate-400 p-1">2.0</td>
                            <td className="border border-slate-400 p-1">2</td>
                            <td className="border border-slate-400 p-1">1.0</td>
                            <td className="border border-slate-400 p-1">2</td>
                            <td className="border border-slate-400 p-1">1.0</td>
                            <td className="border border-slate-400 p-1">0</td>
                            <td className="border border-slate-400 p-1">0.0</td>
                            <td className="border border-slate-400 p-1 font-bold">8</td>
                            <td className="border border-slate-400 p-1 font-bold">4.0</td>
                          </tr>
                          <tr>
                            <td className="border border-slate-400 p-1.5 font-bold text-left">2. Reading</td>
                            <td className="border border-slate-400 p-1">3</td>
                            <td className="border border-slate-400 p-1">1.5</td>
                            <td className="border border-slate-400 p-1">2</td>
                            <td className="border border-slate-400 p-1">1.0</td>
                            <td className="border border-slate-400 p-1">0</td>
                            <td className="border border-slate-400 p-1">0.0</td>
                            <td className="border border-slate-400 p-1">0</td>
                            <td className="border border-slate-400 p-1">0.0</td>
                            <td className="border border-slate-400 p-1 font-bold">5</td>
                            <td className="border border-slate-400 p-1 font-bold">2.5</td>
                          </tr>
                          <tr>
                            <td className="border border-slate-400 p-1.5 font-bold text-left">3. Writing</td>
                            <td className="border border-slate-400 p-1">2</td>
                            <td className="border border-slate-400 p-1">1.0</td>
                            <td className="border border-slate-400 p-1">2</td>
                            <td className="border border-slate-400 p-1">1.0</td>
                            <td className="border border-slate-400 p-1">1</td>
                            <td className="border border-slate-400 p-1">0.5</td>
                            <td className="border border-slate-400 p-1">0</td>
                            <td className="border border-slate-400 p-1">0.0</td>
                            <td className="border border-slate-400 p-1 font-bold">5</td>
                            <td className="border border-slate-400 p-1 font-bold">2.5</td>
                          </tr>
                          <tr>
                            <td className="border border-slate-400 p-1.5 font-bold text-left">4. Speaking</td>
                            <td className="border border-slate-400 p-1">1</td>
                            <td className="border border-slate-400 p-1">0.5</td>
                            <td className="border border-slate-400 p-1">0</td>
                            <td className="border border-slate-400 p-1">0.0</td>
                            <td className="border border-slate-400 p-1">0</td>
                            <td className="border border-slate-400 p-1">0.0</td>
                            <td className="border border-slate-400 p-1">1</td>
                            <td className="border border-slate-400 p-1">0.5</td>
                            <td className="border border-slate-400 p-1 font-bold">2</td>
                            <td className="border border-slate-400 p-1 font-bold">1.0</td>
                          </tr>
                          <tr className="bg-slate-100 font-bold">
                            <td className="border border-slate-400 p-1.5 text-left">Tổng cộng</td>
                            <td className="border border-slate-400 p-1">10</td>
                            <td className="border border-slate-400 p-1">5.0 (50%)</td>
                            <td className="border border-slate-400 p-1">6</td>
                            <td className="border border-slate-400 p-1">3.0 (30%)</td>
                            <td className="border border-slate-400 p-1">3</td>
                            <td className="border border-slate-400 p-1">1.5 (15%)</td>
                            <td className="border border-slate-400 p-1">1</td>
                            <td className="border border-slate-400 p-1">0.5 (5%)</td>
                            <td className="border border-slate-400 p-1">20</td>
                            <td className="border border-slate-400 p-1">10.0 (100%)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: TẢI VỀ & HƯỚNG DẪN CÀI ĐẶT DESKTOP */}
          {/* ========================================================================= */}
          {activeTab === 'download' && (
            <div className="space-y-6">
              
              {/* KHỐI TẢI VỀ BỘ CÀI ĐẶT */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 border border-sky-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-sky-500/20 text-sky-300 border border-sky-400/40">
                      BẢN DESKTOP CHẠY OFFLINE
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      Pass giải nén: 123
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white tracking-wide">
                    PHẦN MỀM TẠO ĐỀ TIẾNG ANH TIỂU HỌC GLOBAL SUCCESS
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    Trọn bộ công cụ tạo đề kiểm tra 4 kỹ năng (Nghe, Đọc, Viết, Nói) từ Lớp 1 đến Lớp 5 theo chuẩn Thông tư 27/2020/TT-BGDĐT. Tự động xuất file Word .docx kèm Ma trận 4 mức độ, Bản đặc tả 7 cột và Audio Script.
                  </p>
                </div>

                <div className="flex flex-col gap-3 shrink-0 w-full sm:w-auto">
                  <a
                    href={EXAM_ENG_PRIMARY_RESOURCES.fullZipUrl}
                    download="Tao_De_Tieng_Anh_Tieu_Hoc_Pass_123.zip"
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30 hover:scale-[1.02] transition-all"
                  >
                    <Download className="w-5 h-5" />
                    <span>TẢI BỘ CÀI ĐẶT (.ZIP - PASS: 123)</span>
                  </a>
                  
                  <p className="text-[11px] text-center text-slate-400 font-medium">
                    Dung lượng: ~300 KB • Hoạt động vĩnh viễn trên Windows
                  </p>
                </div>
              </div>

              {/* HƯỚNG DẪN 3 BƯỚC SỬ DỤNG PHẦN MỀM */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 font-black text-sm flex items-center justify-center">
                    1
                  </div>
                  <h4 className="text-sm font-bold text-white">Tải về & Giải nén</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Bấm nút tải file <code className="text-amber-300 font-mono">Tao_De_Tieng_Anh_Tieu_Hoc_Pass_123.zip</code>. Chuột phải chọn <em>Extract Here</em> và nhập mật khẩu giải nén là <strong className="text-amber-300">123</strong>.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 font-black text-sm flex items-center justify-center">
                    2
                  </div>
                  <h4 className="text-sm font-bold text-white">Khởi động Phần mềm</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Nhấp đúp chuột vào tệp <code className="text-sky-300 font-mono">Chay_Ung_Dung.bat</code> để mở giao diện đồ họa trực quan của Thầy Thành mà không cần cài đặt phức tạp.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-sm flex items-center justify-center">
                    3
                  </div>
                  <h4 className="text-sm font-bold text-white">Xuất File Word Đạt Chuẩn</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Chọn khối lớp (1 - 5), học kì (GK1, CK1, GK2, CK2), số lượng đề và bấm <strong>Tạo Đề Kiểm Tra</strong>. File Word sẽ tự động mở ra sẵn sàng in ấn cho học sinh.
                  </p>
                </div>
              </div>

              {/* YÊU CẦU HỆ THỐNG */}
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-400 space-y-1">
                <p className="font-bold text-slate-300">⚙️ Yêu cầu cấu hình máy tính:</p>
                <p>• Hệ điều hành: Windows 10, Windows 11 (64-bit).</p>
                <p>• Soạn thảo văn bản: Microsoft Word 2013, 2016, 2019, 2021 hoặc Office 365.</p>
                <p>• Phần mềm độc lập hoàn toàn, không phụ thuộc vào kết nối mạng khi tạo đề.</p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: BẢN QUYỀN & KÍCH HOẠT (Rule 1, 4, 5) */}
          {/* ========================================================================= */}
          {activeTab === 'register' && (
            <div className="space-y-6">
              
              {/* KHỐI HIỂN THỊ MÃ MÁY TÍNH VÀ KÍCH HOẠT KEY */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 border border-amber-500/40 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-amber-400" />
                      KÍCH HOẠT BẢN QUYỀN PRO TIẾNG ANH TIỂU HỌC
                    </h3>
                    <p className="text-xs text-slate-400">
                      Bản quyền độc lập cấp theo mã máy tính chuẩn Rule 5: <code className="text-amber-300">DVT-ENGPRI-XXXX-XXXX</code>.
                    </p>
                  </div>

                  {isProActive && (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-white shadow-md">
                      👑 ĐÃ KÍCH HOẠT PRO
                    </span>
                  )}
                </div>

                {/* Ô 1: MÃ MÁY TÍNH CỦA KHÁCH HÀNG */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">
                    1. Mã Máy Tính Nhận Diện (Hardware Code):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={detectedMid}
                      className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-mono font-bold text-sm tracking-widest focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCopyMid}
                      className="px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      {copiedMid ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedMid ? 'Đã sao chép' : 'Sao chép mã máy'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 italic">
                    Gửi mã máy này cho Thầy giáo Đinh Văn Thành qua Zalo để nhận Mã kích hoạt bản quyền Pro.
                  </p>
                </div>

                {/* Ô 2: NHẬP KEY KÍCH HOẠT */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-slate-300 block">
                    2. Nhập Mã Bản Quyền Pro (Do Thầy Thành Cấp):
                  </label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="text"
                      placeholder="Dán mã kích hoạt (Ví dụ: KEY-ENGPRI-2026... hoặc ENGPRI-LT-...)"
                      value={inputKey}
                      onChange={(e) => setInputKey(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sky-300 font-mono text-xs uppercase focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={handleActivateKey}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>KÍCH HOẠT NGAY</span>
                    </button>
                  </div>
                </div>

                {/* THÔNG BÁO XÁC THỰC */}
                {verifyResult && (
                  <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    verifyResult.isValid
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
                  }`}>
                    {verifyResult.isValid ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
                    <span>{verifyResult.message}</span>
                  </div>
                )}
              </div>

              {/* FORM GỬI THÔNG TIN ĐĂNG KÝ SƯ PHẠM VÀ BÁO GIÁ ƯU ĐÃI (Rule 4) */}
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-sky-400" />
                    ĐĂNG KÝ TƯ VẤN & BÁO GIÁ ƯU ĐÃI SƯ PHẠM (RULE 4)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Thầy/Cô vui lòng gửi thông tin để Thầy giáo Đinh Văn Thành gửi báo giá ưu đãi sư phạm tốt nhất và hỗ trợ cài đặt tận tình.
                  </p>
                </div>

                {regSent ? (
                  <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>
                      Đã gửi thông tin thành công! Thầy Đinh Văn Thành sẽ liên hệ qua Zalo ({regPhone}) để tư vấn và cấp mã bản quyền Pro.
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleSendRegistration} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Họ và tên Giáo viên *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ví dụ: Thầy Nguyễn Văn A"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Số Điện thoại / Zalo *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ví dụ: 0912.345678"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Trường Tiểu học công tác</label>
                        <input
                          type="text"
                          placeholder="Ví dụ: Trường Tiểu học Đồng Yên"
                          value={regSchool}
                          onChange={(e) => setRegSchool(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Gói bản quyền quan tâm</label>
                        <select
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                          value={regNote}
                          onChange={(e) => setRegNote(e.target.value)}
                        >
                          <option value="Gói VIP Trọn Đời (Khuyên Dùng)">Gói VIP Trọn Đời (Khuyên Dùng)</option>
                          <option value="Gói Bản Quyền 2 Năm">Gói Bản Quyền 2 Năm</option>
                          <option value="Gói Bản Quyền 1 Năm">Gói Bản Quyền 1 Năm</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <p className="text-[11px] text-slate-400 italic">
                        * Hoặc liên hệ trực tiếp Thầy Thành qua Zalo: <strong>0915.213717</strong>
                      </p>

                      <div className="flex items-center gap-2">
                        <a
                          href={BRAND.zaloUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Chat Zalo Thầy Thành</span>
                        </a>

                        <button
                          type="submit"
                          disabled={isSyncingCloud}
                          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                          <span>{isSyncingCloud ? 'Đang gửi...' : 'Gửi đăng ký'}</span>
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>

            </div>
          )}

          {/* QUẢNG BÁ CHÉO CÁC CÔNG CỤ TRONG HỆ SINH THÁI */}
          <div className="pt-2 border-t border-slate-800">
            <CrossPromoBanner currentToolId="tao-de-tieng-anh-tieu-hoc" />
          </div>

        </div>

      </div>
    </div>
  );
};
