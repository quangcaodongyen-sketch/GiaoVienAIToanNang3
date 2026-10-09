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
  RefreshCw
} from 'lucide-react';
import { BRAND, EXAM_RESOURCES } from '../config/brand';
import { cloudSyncService } from '../services/cloudSyncService';
import {
  getOrCreateExamHardwareCode,
  verifyExamLicenseKey,
  ExamVerifyResult
} from '../services/taodeKeyService';
import { webSecurityGuard } from '../services/webSecurityGuard';
import { CrossPromoBanner } from './CrossPromoBanner';
import { ShareLinkBar } from './ShareLinkBar';
import { syncBrowserHash } from '../utils/shareUtils';

interface TaoDeTiengAnhModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

export const TaoDeTiengAnhModal: React.FC<TaoDeTiengAnhModalProps> = ({ isOpen, onClose, onOpenAdmin }) => {
  // Chuẩn hóa theo phong cách NLS-AI: 'download' (Tải về) | 'register' (Bản quyền) | 'preview' (Xem mẫu)
  const [activeTab, setActiveTab] = useState<'download' | 'register' | 'preview'>('download');

  // State Dùng thử 5 lần cố định trên máy tính
  const [trialRemaining, setTrialRemaining] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [examGenerated, setExamGenerated] = useState<boolean>(false);
  const [selectedGrade, setSelectedGrade] = useState<string>('9');
  const [selectedTerm, setSelectedTerm] = useState<string>('GK1');
  const [selectedNumVariants, setSelectedNumVariants] = useState<number>(2);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Tiêu chuẩn (Phân hóa chung)');
  const [schoolAgency, setSchoolAgency] = useState<string>('PHÒNG GIÁO DỤC VÀ ĐÀO TẠO');
  const [schoolName, setSchoolName] = useState<string>('TRƯỜNG THCS ........................');
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
    syncBrowserHash('#tao-de-tieng-anh');
    const mid = getOrCreateExamHardwareCode();
    setDetectedMid(mid);

    const savedPro = localStorage.getItem('gvai_taode_is_pro_active');
    if (savedPro === 'true') {
      setIsProActive(true);
    }

    // Đọc số lượt dùng thử từ localStorage (Chuẩn 3 lần/môn)
    const savedTrial = localStorage.getItem('gvai_taode_eng_trial_remaining');
    if (savedTrial !== null) {
      setTrialRemaining(parseInt(savedTrial, 10));
    } else {
      localStorage.setItem('gvai_taode_eng_trial_remaining', '3');
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
    const res = await verifyExamLicenseKey(inputKey, detectedMid);
    setVerifyResult(res);
    if (res.isValid) {
      setIsProActive(true);
      localStorage.setItem('gvai_taode_is_pro_active', 'true');
      localStorage.setItem('gvai_taode_pro_key', inputKey.trim());
    } else {
      webSecurityGuard.recordFailedKeyAttempt('tao-de-tieng-anh-thcs', inputKey, detectedMid);
    }
  };

  const handleCloudSync = async () => {
    setIsSyncingCloud(true);
    try {
      // ĐỘC LẬP BẢN QUYỀN: Bắt buộc truyền appId 'exam-eng'
      const res = await cloudSyncService.checkCurrentMachineCloudStatus(detectedMid, 'exam-eng');
      if (res.isApproved) {
        setIsProActive(true);
        localStorage.setItem('gvai_taode_is_pro_active', 'true');
        alert(`🎉 Chúc mừng Thầy/Cô!\n\nMáy tính [${detectedMid}] đã được duyệt bản quyền ${res.packageType || 'Pro'} cho ứng dụng "Tạo Đề Tiếng Anh THCS" trên Web Cloud bởi ${res.approvedBy || 'Thầy Thành'}!`);
      } else {
        alert(`ℹ️ Chưa tìm thấy phê duyệt cho ứng dụng Tạo Đề Tiếng Anh trên Cloud của máy tính [${detectedMid}].\n\nNếu Thầy/Cô đã gửi đơn, xin vui lòng chờ Thầy Thành duyệt hoặc nhắn tin Zalo 0915.213717 để được hỗ trợ tức thì!`);
      }
    } catch (e) {
      alert("⚠️ Không thể kết nối Cloud. Vui lòng kiểm tra lại mạng Internet.");
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const handleOnlineGenerate = () => {
    if (!isProActive && trialRemaining <= 0) {
      alert('⚠️ Thầy/Cô đã dùng hết 3 lượt dùng thử trực tuyến miễn phí!\n\nVui lòng chuyển sang Tab "Bản Quyền & Kích Hoạt" để liên hệ Thầy Thành kích hoạt bản Pro sử dụng vĩnh viễn không giới hạn.');
      setActiveTab('register');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setExamGenerated(true);

      if (!isProActive) {
        const nextRem = Math.max(0, trialRemaining - 1);
        setTrialRemaining(nextRem);
        localStorage.setItem('gvai_taode_eng_trial_remaining', nextRem.toString());
      }
    }, 800);
  };

  const handleSendRegistration = async () => {
    if (!regName.trim() || !regPhone.trim()) {
      alert('Vui lòng điền Họ tên và Số điện thoại / Zalo để nhận mã kích hoạt!');
      return;
    }

    const regData = {
      fullName: regName.trim(),
      phoneNumber: regPhone.trim(),
      schoolUnit: regSchool.trim() || 'Trường THCS',
      machineId: detectedMid,
      appId: 'exam-eng',
      appName: 'Tạo Đề Tiếng Anh THCS Global Success (CV 7991)',
      note: regNote.trim(),
      createdAt: new Date().toLocaleString('vi-VN')
    };

    try {
      await cloudSyncService.submitRegistrationToCloud({
        machineId: detectedMid,
        fullName: regName.trim(),
        phoneNumber: regPhone.trim(),
        schoolUnit: regSchool.trim() || 'Trường THCS',
        appId: 'exam-eng',
        appName: 'Tạo Đề Tiếng Anh THCS Global Success (CV 7991)',
        packageType: '1YEAR'
      });
    } catch (e) {
      console.log('Cloud sync error (fallback local):', e);
    }

    const zaloMsg = `KÍNH GỬI THẦY ĐINH VĂN THÀNH - ĐĂNG KÝ BẢN QUYỀN TẠO ĐỀ TIẾNG ANH THCS (CV 7991)
----------------------------------------
• Họ và tên: ${regData.fullName}
• Điện thoại / Zalo: ${regData.phoneNumber}
• Đơn vị: ${regData.schoolUnit}
• Mã máy tính: ${regData.machineId}
----------------------------------------
Kính nhờ Thầy kích hoạt bản quyền giúp em. Em xin trân trọng cảm ơn!`;

    navigator.clipboard.writeText(zaloMsg);
    setRegSent(true);
    window.open('https://zalo.me/0915213717', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden">
        
        {/* HEADER MODAL */}
        <div className="px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center text-white">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  TẠO ĐỀ TIẾNG ANH THCS (CV 7991)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  v3.2.0
                </span>
                {isProActive && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" /> BẢN QUYỀN PRO
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Thầy giáo Đinh Văn Thành • THCS Đồng Yên • Hotline/Zalo: 0915.213717
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShareLinkBar 
              appUrl="#tao-de-tieng-anh" 
              appName="Tạo Đề Tiếng Anh THCS" 
              compact={true} 
            />
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* THANH LINK GỬI KHÁCH HÀNG (TRỰC QUAN - COPY 1 CHẠM GỬI ZALO) */}
        <ShareLinkBar 
          appUrl="#tao-de-tieng-anh" 
          appName="Tạo Đề Tiếng Anh THCS (CV 7991)" 
        />

        {/* TABS NAVIGATION CHUẨN THEO NLS-AI: TẢI VỀ MÁY TÍNH & ĐĂNG KÝ BẢN QUYỀN */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-6 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('download')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'download'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4 text-cyan-300" />
            <span>1. Tải Bản Máy Tính (.exe / .zip)</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'register'
                ? 'border-amber-400 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>2. Bản Quyền & Kích Hoạt</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'preview'
                ? 'border-blue-400 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>3. Xem Mẫu Đề Thi (CV 7991)</span>
          </button>
        </div>

        {/* CROSS PROMOTION BANNER QUẢNG CÁO CÁC APP TÍNH TIỀN PRO CỦA THẦY THÀNH */}
        <div className="px-6 pt-3">
          <CrossPromoBanner currentAppId="taode" onNavigateApp={(h) => { onClose(); window.location.hash = h; }} />
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ========================================================================= */}
          {/* TAB 3: XEM MẪU ĐỀ THI SƯ PHẠM (CV 7991)                                    */}
          {/* ========================================================================= */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold block text-white text-[13px]">Bản Xem Thử Mẫu Đề Kiểm Tra Tiếng Anh THCS (CV 7991)</span>
                    <span className="text-[11px] text-amber-200/80">Để tạo đề tự động cho 48 Units (Lớp 6, 7, 8, 9), xuất file Word in ấn kèm audio MP3, Quý Thầy/Cô vui lòng tải phần mềm về máy tính.</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('download')}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shrink-0 flex items-center gap-1 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Tải Bộ Cài Ngay
                </button>
              </div>
              
              {/* Banner EnglishExam Pro Web Trực Tuyến */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-900/50 via-indigo-900/50 to-purple-900/50 border border-indigo-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-xl shrink-0">
                    🇬🇧
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <span>EnglishExam Pro – Nền Tảng Tiếng Anh THCS Global Success</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/30 text-indigo-300 border border-indigo-400/40">ONLINE HUB</span>
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Trọn bộ 48 Units (Lớp 6-9), Flashcard 3D, Audio Lab bản ngữ, Đề 15 phút 2 mã đề & Phòng luyện thi thông minh.
                    </p>
                  </div>
                </div>
                <a
                  href="/web-tieng-anh/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shrink-0 shadow-md shadow-indigo-600/30 transition cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>MỞ WEB TIẾNG ANH NGAY</span>
                </a>
              </div>

              {/* Card Tiến trình Dùng thử 3 Chấm */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-800/80 to-indigo-950/40 border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Chính Sách Dùng Thử Trực Tuyến:</span>
                    {isProActive ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        👑 Không giới hạn (Đã kích hoạt Pro)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {trialRemaining > 0 ? `Còn ${trialRemaining}/3 lượt trên máy này` : '⚠️ Đã hết 3 lượt dùng thử'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Mỗi thiết bị được tạo thử 03 bộ đề kiểm tra (xem 1/2 đáp án, tạo 1 đề/lần). Bản quyền Pro xem trọn vẹn và không giới hạn.
                  </p>
                </div>

                {/* Thanh 3 Chấm trực quan */}
                {!isProActive && (
                  <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-700">
                    <span className="text-xs text-slate-400 font-medium mr-1">Tiến trình (3 lượt):</span>
                    {[1, 2, 3].map((idx) => {
                      const isUsed = idx > trialRemaining;
                      return (
                        <div
                          key={idx}
                          title={isUsed ? `Lượt ${idx}: Đã dùng` : `Lượt ${idx}: Còn lại`}
                          className={`w-4 h-4 rounded-full transition-all ${
                            isUsed 
                              ? 'bg-slate-600 border border-slate-500' 
                              : 'bg-emerald-400 shadow-md shadow-emerald-500/40 animate-pulse'
                          }`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Form Tùy Chọn Đề Thi */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Khối Lớp (Global):</label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="6">Tiếng Anh Lớp 6</option>
                    <option value="7">Tiếng Anh Lớp 7</option>
                    <option value="8">Tiếng Anh Lớp 8</option>
                    <option value="9">Tiếng Anh Lớp 9</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Kỳ Kiểm Tra:</label>
                  <select
                    value={selectedTerm}
                    onChange={(e) => setSelectedTerm(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="GK1">Giữa Học Kỳ 1 (Unit 1 - 3)</option>
                    <option value="CK1">Cuối Học Kỳ 1 (Unit 1 - 6)</option>
                    <option value="GK2">Giữa Học Kỳ 2 (Unit 7 - 9)</option>
                    <option value="CK2">Cuối Học Kỳ 2 (Unit 7 - 12)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-400 mb-1">Mức Độ Đề:</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full bg-slate-800 border border-amber-500/50 rounded-xl px-3 py-2.5 text-sm text-amber-300 focus:outline-none focus:border-amber-400 font-semibold"
                  >
                    <option value="Tiêu chuẩn (Phân hóa chung)">Tiêu chuẩn (Phân hóa)</option>
                    <option value="Cơ bản (Dễ - TB, Yếu)">Cơ bản (Dễ - TB, Yếu)</option>
                    <option value="Nâng cao (Khó - Khá, Giỏi)">Nâng cao (Khó - Khá, Giỏi)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Số Mã Đề (1 đề/lần):</label>
                  <select
                    value={isProActive ? selectedNumVariants : 1}
                    onChange={(e) => isProActive && setSelectedNumVariants(parseInt(e.target.value))}
                    disabled={!isProActive}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-semibold disabled:opacity-75"
                  >
                    <option value={1}>1 mã đề {isProActive ? '' : '(Dùng thử)'}</option>
                    {isProActive && (
                      <>
                        <option value={2}>2 mã đề</option>
                        <option value={3}>3 mã đề</option>
                        <option value={4}>4 mã đề</option>
                        <option value={5}>5 mã đề</option>
                        <option value={6}>6 mã đề</option>
                        <option value={7}>7 mã đề</option>
                        <option value={8}>8 mã đề</option>
                        <option value={9}>9 mã đề</option>
                        <option value={10}>10 mã đề (Pro)</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Năm Học:</label>
                  <input
                    type="text"
                    value={schoolYear}
                    onChange={(e) => setSchoolYear(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="2026 - 2027"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Cơ quan chủ quản:</label>
                  <input
                    type="text"
                    value={schoolAgency}
                    onChange={(e) => setSchoolAgency(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Đơn vị / Tên trường:</label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* NÚT TẠO ĐỀ TRỰC TUYẾN (BẮT BUỘC BẤM ĐỂ SINH ĐỀ, KHÔNG NẠP SẴN MẪU) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleOnlineGenerate}
                  disabled={isGenerating || (!isProActive && trialRemaining <= 0)}
                  className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                    !isProActive && trialRemaining <= 0
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-emerald-500/30 active:scale-[0.99]'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Đang tổng hợp Đề Tiếng Anh Lớp {selectedGrade} chuẩn CV 7991...</span>
                    </>
                  ) : !isProActive && trialRemaining <= 0 ? (
                    <>
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>Hết 3 lượt dùng thử – Vui lòng nâng cấp bản quyền Pro</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-yellow-300" />
                      <span>🚀 BẤM TẠO ĐỀ TIẾNG ANH LỚP {selectedGrade} ({isProActive ? 'BẢN QUYỀN PRO' : `DÙNG THỬ CÒN ${trialRemaining}/3 LƯỢT`})</span>
                    </>
                  )}
                </button>
              </div>

              {/* THANH ĐIỀU HƯỚNG TẢI PHẦN MỀM & ĐĂNG KÝ BẢN QUYỀN TRÊN MÁY TÍNH */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('download')}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Tải bản máy tính (.exe) để xuất file Word trọn gói</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 transition cursor-pointer"
                >
                  <Crown className="w-4 h-4" />
                  <span>🔑 Kích hoạt Bản quyền Pro</span>
                </button>
              </div>

              {/* MÀN HÌNH CHỜ KHI CHƯA BẤM TẠO ĐỀ */}
              {!examGenerated && (
                <div className="p-8 rounded-2xl bg-slate-900/60 border border-dashed border-slate-700 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Chưa tạo đề kiểm tra</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    Hệ thống không cung cấp sẵn đề mẫu để sao chép tự do. Quý Thầy/Cô vui lòng bấm nút 
                    <strong className="text-emerald-400"> "🚀 BẤM TẠO ĐỀ TIẾNG ANH"</strong> ở trên để hệ thống tự động sinh 01 đề hoàn chỉnh (Dùng thử 3 lần, xem 1/2 đáp án).
                  </p>
                </div>
              )}

              {/* Preview Khung Đề Thi Sư Phạm (Times New Roman 13pt) */}
              {examGenerated && (
                <div className="p-6 rounded-2xl bg-white text-black shadow-xl border border-slate-300 font-['Times_New_Roman',serif] text-[13pt] leading-relaxed animate-fade-in space-y-4">
                  
                  {/* BANNER QUẢNG CÁO DÙNG THỬ CỦA THẦY ĐINH VĂN THÀNH */}
                  {!isProActive && (
                    <div className="p-3.5 rounded-xl border-2 border-dashed border-amber-500 bg-amber-50 text-slate-800 text-xs font-sans">
                      <div className="flex items-center gap-2 text-amber-900 font-bold text-[13px] mb-1">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>BẢN DÙNG THỬ SƯ PHẠM (XEM 1/2 ĐÁP ÁN – 1 ĐỀ/LẦN)</span>
                      </div>
                      <p className="text-slate-700 leading-normal">
                        • Tác quyền & Quản trị: <strong>Thầy giáo Đinh Văn Thành</strong> – THCS Đồng Yên – Hotline/Zalo: <strong className="text-emerald-700">0915.213717</strong>.<br/>
                        • Ở bản dùng thử, quý Thầy/Cô được xem 1/2 đáp án câu hỏi để đánh giá chất lượng. Để mở khóa toàn bộ đáp án, xuất file Word và audio MP3, vui lòng liên hệ Zalo <strong>0915.213717</strong> nâng cấp Pro!
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-start border-b pb-4">
                    <div className="text-center font-bold">
                      <p className="text-[11pt] uppercase">{schoolAgency}</p>
                      <p className="text-[12pt] uppercase font-black">{schoolName}</p>
                      <p className="text-[10pt] italic">Đề kiểm tra chính thức</p>
                    </div>
                    <div className="text-center font-bold">
                      <p className="text-[12pt] uppercase font-black">KHUNG MA TRẬN &amp; ĐỀ KIỂM TRA {selectedTerm}</p>
                      <p className="text-[12pt]">MÔN: TIẾNG ANH {selectedGrade} (GLOBAL SUCCESS)</p>
                      <p className="text-[10pt] italic">Thời gian làm bài: 45 - 60 phút • Năm học {schoolYear}</p>
                    </div>
                  </div>

                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-[#FF0000] text-[11pt] font-sans">
                    <strong>✔ TÍCH HỢP CHUẨN CÔNG VĂN 7991/BGDĐT:</strong> Đầy đủ Ma trận 4 mức độ nhận thức, Bản đặc tả kỹ thuật chi tiết, <strong>01 Mã đề</strong> trắc nghiệm khách quan + tự luận. 
                    {!isProActive && <strong> (BẢN DÙNG THỬ CHỈ HIỂN THỊ 1/2 ĐÁP ÁN ĐỂ BẢO VỆ TÁC QUYỀN)</strong>}
                  </div>

                  {/* NỘI DUNG ĐỀ THI KÈM ĐÁP ÁN CHỮ ĐỎ (CHỈ 1/2 ĐÁP ÁN KHI !isProActive) */}
                  <div className="space-y-4">
                    <p className="font-bold uppercase text-[12pt]">PART A. LISTENING (2.0 points)</p>
                    <p className="italic text-[11pt]">Listen to the conversation and choose the correct answer A, B, C or D.</p>
                    <p><strong>Question 1.</strong> What does Mai often do in her leisure time?</p>
                    <p className="pl-6">
                      A. Surfing the internet &nbsp;&nbsp;&nbsp;&nbsp; 
                      <strong className="text-[#FF0000] font-black underline bg-red-50 px-1.5 py-0.5 rounded">✔ B. Playing sports</strong> &nbsp;&nbsp;&nbsp;&nbsp; 
                      C. Reading books &nbsp;&nbsp;&nbsp;&nbsp; 
                      D. Cooking
                    </p>

                    <p className="font-bold uppercase text-[12pt] pt-2">PART B. LANGUAGE &amp; GRAMMAR (2.5 points)</p>
                    <p><strong>Question 2.</strong> Life in the countryside is much ________ than life in the big city.</p>
                    <p className="pl-6">
                      A. peaceful &nbsp;&nbsp;&nbsp;&nbsp; 
                      {isProActive ? (
                        <span className="text-[#FF0000] font-normal underline bg-red-50/60 px-1.5 py-0.5 rounded">✔ B. more peaceful</span>
                      ) : (
                        <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                          🔒 [Đáp án câu 2 đã bị khóa - Nâng cấp Pro để xem]
                        </span>
                      )} &nbsp;&nbsp;&nbsp;&nbsp; 
                      C. as peaceful &nbsp;&nbsp;&nbsp;&nbsp; 
                      D. most peaceful
                    </p>

                    <p><strong>Question 3.</strong> Nam didn't go to school yesterday ________ he had a severe fever.</p>
                    <p className="pl-6">
                      {isProActive ? (
                        <span className="text-[#FF0000] font-normal underline bg-red-50/60 px-1.5 py-0.5 rounded">✔ A. because</span>
                      ) : (
                        <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                          🔒 [Đáp án câu 3 đã bị khóa - Nâng cấp Pro để xem]
                        </span>
                      )} &nbsp;&nbsp;&nbsp;&nbsp; 
                      B. although &nbsp;&nbsp;&nbsp;&nbsp; 
                      C. but &nbsp;&nbsp;&nbsp;&nbsp; 
                      D. so
                    </p>

                    {/* BẢNG ĐÁP ÁN CHỮ ĐỎ DÀNH RIÊNG CHO GIÁO VIÊN (HIỂN THỊ 1/2 KHI !isProActive) */}
                    <div className="mt-6 p-4 rounded-xl border border-red-300 bg-red-50/50">
                      <p className="font-bold text-[#FF0000] text-[12pt] mb-2 uppercase flex items-center justify-between">
                        <span>★ BẢNG ĐÁP ÁN VÀ THANG ĐIỂM CHI TIẾT {isProActive ? '(TOÀN BỘ ĐỀ)' : '(DÙNG THỬ 1/2 ĐÁP ÁN)'}:</span>
                        {!isProActive && (
                          <span className="text-xs font-sans font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded border border-amber-400">
                            🔒 1/2 Đáp Án Khóa Pro
                          </span>
                        )}
                      </p>
                      <table className="w-full border-collapse border border-red-300 text-center text-[11pt]">
                        <thead>
                          <tr className="bg-red-100/70 text-[#FF0000] font-bold">
                            <th className="border border-red-300 p-1.5">Câu</th>
                            <th className="border border-red-300 p-1.5">Đáp án đúng</th>
                            <th className="border border-red-300 p-1.5">Điểm</th>
                            <th className="border border-red-300 p-1.5 text-left pl-3">Nội dung kiến thức / Giải thích</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-red-300 p-1 font-bold">1</td>
                            <td className="border border-red-300 p-1 text-[#FF0000] font-normal text-[13pt]">B</td>
                            <td className="border border-red-300 p-1">0.25 đ</td>
                            <td className="border border-red-300 p-1 text-left pl-3 text-[#FF0000]">Nghe thông tin chi tiết: "Mai often plays sports after school".</td>
                          </tr>
                          <tr>
                            <td className="border border-red-300 p-1 font-bold">2</td>
                            <td className="border border-red-300 p-1 text-[#FF0000] font-normal text-[13pt]">
                              {isProActive ? 'B' : '🔒 Khóa Pro'}
                            </td>
                            <td className="border border-red-300 p-1">0.25 đ</td>
                            <td className="border border-red-300 p-1 text-left pl-3 text-[#FF0000]">
                              {isProActive ? 'So sánh hơn tính từ dài: much + more peaceful + than.' : '🔒 Nội dung giải thích dành cho bản quyền Pro (Zalo: 0915.213717)'}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-red-300 p-1 font-bold">3</td>
                            <td className="border border-red-300 p-1 text-[#FF0000] font-normal text-[13pt]">
                              {isProActive ? 'A' : '🔒 Khóa Pro'}
                            </td>
                            <td className="border border-red-300 p-1">0.25 đ</td>
                            <td className="border border-red-300 p-1 text-left pl-3 text-[#FF0000]">
                              {isProActive ? 'Liên từ chỉ nguyên nhân: because + clause (chỉ lý do sốt).' : '🔒 Nội dung giải thích dành cho bản quyền Pro (Zalo: 0915.213717)'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* III. PHẦN THI NÓI (SPEAKING TEST: 2.0 ĐIỂM) - CHUẨN THEO BỘ GD&ĐT */}
                    <div className="mt-6 pt-4 border-t border-slate-300">
                      <p className="font-bold text-[#1a202c] text-[13pt] mb-2 uppercase">
                        III. PHẦN THI NÓI (SPEAKING TEST: 2.0 ĐIỂM)
                      </p>
                      <table className="w-full border-collapse border border-slate-800 text-[11pt] text-left">
                        <thead>
                          <tr className="bg-slate-100 text-black font-bold text-center">
                            <th className="border border-slate-800 p-2 w-[18%]">To do</th>
                            <th className="border border-slate-800 p-2 w-[34%]">To say (Examiner)</th>
                            <th className="border border-slate-800 p-2 w-[28%]">Response (Students)</th>
                            <th className="border border-slate-800 p-2 w-[20%]">Back-up</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="align-top">
                            <td className="border border-slate-800 p-2 text-center">
                              <div className="font-semibold text-black">Part 1: Interview</div>
                              <div className="text-black">(0.6 pt)</div>
                            </td>
                            <td className="border border-slate-800 p-2">
                              <p className="font-medium text-black">Examiner asks 2-3 personal questions:</p>
                              <p className="text-black">- What is your name and class?</p>
                              <p className="text-black">- What do you usually do in your free time?</p>
                              <p className="text-black">- Which school subject do you like best?</p>
                            </td>
                            <td className="border border-slate-800 p-2 text-black">
                              Student responds naturally with full sentences and accurate grammar.
                            </td>
                            <td className="border border-slate-800 p-2 text-black">
                              Back-up: Can you tell me more about your hobby?
                            </td>
                          </tr>
                          <tr className="align-top">
                            <td className="border border-slate-800 p-2 text-center">
                              <div className="font-semibold text-black">Part 2: Topic Speaking</div>
                              <div className="text-black">(0.8 pt)</div>
                            </td>
                            <td className="border border-slate-800 p-2">
                              <p className="font-medium text-black">Examiner presents a topic based on Unit 1 đến Unit 6 (Thêm Unit 4: Neighbourhood, Unit 5: Natural Wonders, Unit 6: Tet):</p>
                              <p className="text-black">- Talk about a festival, favourite food, or dream career.</p>
                            </td>
                            <td className="border border-slate-800 p-2 text-black">
                              Student speaks continuously for 1-1.5 minutes covering key points.
                            </td>
                            <td className="border border-slate-800 p-2 text-black">
                              Back-up: Why is this important to you?
                            </td>
                          </tr>
                          <tr className="align-top">
                            <td className="border border-slate-800 p-2 text-center">
                              <div className="font-semibold text-black">Part 3: Follow-up</div>
                              <div className="text-black">(0.6 pt)</div>
                            </td>
                            <td className="border border-slate-800 p-2">
                              <p className="font-medium text-black">Examiner asks 2 open-ended follow-up questions to test fluency and critical thinking.</p>
                            </td>
                            <td className="border border-slate-800 p-2 text-black">
                              Student explains viewpoints confidently with expanded vocabulary.
                            </td>
                            <td className="border border-slate-800 p-2 text-black">
                              Back-up: What do you think about the future?
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <p className="mt-2 text-[10pt] text-slate-600 italic">* Lưu ý: Phần thi Nói (Speaking Test 2.0đ) được giáo viên tổ chức phỏng vấn trực tiếp từng học sinh hoặc theo nhóm nhỏ theo bảng hướng dẫn trên.</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t flex flex-wrap items-center justify-between gap-3 font-sans text-xs">
                    <span className="text-slate-500">Đã áp dụng thông tin: {schoolName} ({schoolYear})</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => alert('Đã sao chép toàn bộ đề thi kèm đáp án chữ màu đỏ vào bộ nhớ tạm!')}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" /> Sao chép văn bản
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('download')}
                        className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Tải Bộ Cài Máy Tính Để Xuất File Word Trọn Gói
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: TẢI VỀ & HƯỚNG DẪN                                                */}
          {/* ========================================================================= */}
          {activeTab === 'download' && (
            <div className="space-y-5">
              {/* Video Hướng dẫn phát trực tiếp */}
              <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-700/80 shadow-xl">
                <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
                  <video
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                    poster="/taodektcv7991.jpg"
                  >
                    <source src="/HD_Tao_De_Tieng_Anh_THCS.mp4" type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ phát video MP4.
                  </video>
                </div>
                <div className="p-3 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-blue-400" />
                    <span>Video Hướng dẫn cài đặt &amp; sử dụng công cụ Tạo Đề Tiếng Anh THCS</span>
                  </div>
                  <a
                    href="/HD_Tao_De_Tieng_Anh_THCS.mp4"
                    download="Huong_Dan_Tao_De_Tieng_Anh_THCS_CV7991.mp4"
                    className="text-blue-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <Download className="w-3.5 h-3.5" /> Tải video MP4
                  </a>
                </div>
              </div>

              {/* KHỐI TẢI BỘ CÀI ĐƠN GIẢN - ÍT NÚT, ÍT CHỮ, RÕ RÀNG BẢN CẬP NHẬT */}
              <div className="p-5 rounded-2xl bg-slate-900 border-2 border-emerald-500/60 shadow-2xl space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Phần Mềm Tạo Đề Tiếng Anh THCS (Công Văn 7991)</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        v3.9.0 (Mới nhất)
                      </span>
                    </h4>
                    <p className="text-xs text-amber-300 font-medium mt-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Bản cập nhật đưa lên web: <strong>09/10/2026 (Lúc 23:45:00)</strong></span>
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    Dung lượng: ~44 MB
                  </span>
                </div>

                {/* 2 NÚT TẢI BỘ CÀI CHÍNH */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <a
                    href={EXAM_RESOURCES.exeUrl}
                    download="Cai_Dat_TaoDe_TiengAnh_THCS.exe"
                    className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer text-center"
                  >
                    <Download className="w-5 h-5 shrink-0" />
                    <span>TẢI BỘ CÀI BẢN .EXE</span>
                  </a>
                  <a
                    href={EXAM_RESOURCES.fullZipUrl}
                    download="Tao_De_Tieng_Anh_THCS_Pass_123.zip"
                    className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer text-center"
                  >
                    <Download className="w-5 h-5 shrink-0" />
                    <span>TẢI BẢN NÉN .ZIP (Pass: 123)</span>
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 text-center text-xs text-slate-300 space-y-1 border border-slate-800">
                  <p>🔑 Mật khẩu giải nén bản .ZIP: <code className="text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded">123</code></p>
                  <p className="text-[11px] text-slate-400">Tương thích Windows 10/11 &amp; Microsoft Word 2016-2024 • Không bị diệt virus chặn</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: BẢN QUYỀN & KÍCH HOẠT (CHUẨN FORM NHẬN DIỆN THẦY ĐINH VĂN THÀNH)   */}
          {/* ========================================================================= */}
          {activeTab === 'register' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              
              {/* KHỐI 1: THÔNG TIN TÁC GIẢ & BẢN QUYỀN (CHUẨN HÌNH KHỐI SANG TRỌNG) */}
              <div className="p-4 rounded-2xl bg-[#17143A] border-2 border-indigo-500/60 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 bg-indigo-950 flex items-center justify-center shadow-md">
                    <img
                      src="/dinhvanthanh.jpg"
                      alt="Thầy Đinh Văn Thành"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // fallback nếu ảnh lỗi
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <User className="w-8 h-8 text-amber-400" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wide">
                      TÁC GIẢ & BẢN QUYỀN PHẦN MỀM: THẦY GIÁO ĐINH VĂN THÀNH
                    </h4>
                    <p className="text-xs text-slate-200">
                      • Đơn vị: <strong>Trường THCS Đồng Yên</strong> &nbsp;|&nbsp; • Hotline / Zalo: <strong>0915.213717</strong>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      • Phần mềm: <strong>TẠO ĐỀ TIẾNG ANH THCS (GLOBAL SUCCESS - CV 7991)</strong> (Chuẩn Khung NLS TT 02/2025, AI QĐ 2422 & CV 5512)
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                  <a
                    href="https://zalo.me/0915213717"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
                  >
                    <MessageCircle className="w-4 h-4" /> Chat Zalo
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("0915213717");
                      alert("Đã sao chép SĐT Thầy Thành: 0915.213717");
                    }}
                    className="flex-1 sm:flex-none py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center justify-center gap-1 transition"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy SĐT
                  </button>
                </div>
              </div>

              {/* KHỐI 2: THÔNG TIN BẢN QUYỀN CỦA GIÁO VIÊN */}
              {isProActive ? (
                /* TRƯỜNG HỢP A: ĐÃ KÍCH HOẠT PRO THÀNH CÔNG */
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-[#022C22] border-2 border-emerald-500 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600/30 text-emerald-300 border border-emerald-500/40">
                      🎉 BẢN QUYỀN CHÍNH THỨC - ĐÃ KÍCH HOẠT THÀNH CÔNG
                    </span>
                    <span className="text-xs text-emerald-400 font-mono font-bold">PRO EDITION</span>
                  </div>

                  {/* Hộp đếm lùi thời hạn */}
                  <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-400/40 space-y-1">
                    <span className="text-xs font-bold text-emerald-200 block">
                      ⏳ THỜI HẠN BẢN QUYỀN CÒN LẠI CỦA GIÁO VIÊN:
                    </span>
                    <div className="text-2xl font-black text-amber-300">
                      CÒN 1093 NGÀY (Gói 3 Năm)
                    </div>
                    <p className="text-[11px] text-emerald-200">
                      • Hạn dùng đến ngày: <strong>2029-09-30 (Gói 3 Năm)</strong> &nbsp;|&nbsp; • Trạng thái: <strong>Hoạt động bình thường (Không giới hạn tất cả các môn)</strong>
                    </p>
                  </div>

                  {/* Thông tin giáo viên & mã máy tính */}
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <p>• Họ và tên Giáo viên: <strong>{regName || 'Giáo viên Tiếng Anh'}</strong></p>
                    <p>• Trường / Đơn vị công tác: <strong>{regSchool || 'Chưa cập nhật'}</strong></p>
                    <p>• Số điện thoại / Zalo: <strong>{regPhone || '0915213717'}</strong></p>
                    <p className="text-cyan-300 font-mono">• Mã máy tính nhận diện: <strong>{detectedMid}</strong></p>
                  </div>

                  {/* Khu vực xin gia hạn bản quyền */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-3">
                    <span className="text-xs font-bold text-emerald-300 block">
                      ⚡ GIA HẠN BẢN QUYỀN CHO NĂM TIẾP THEO:
                    </span>
                    <button
                      onClick={handleSendRegistration}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>📲 BẤM VÀO ĐÂY ĐỂ XIN GIA HẠN THÊM BẢN QUYỀN (GỬI ADMIN)</span>
                    </button>

                    <div className="pt-2 border-t border-slate-800 space-y-1.5">
                      <label className="text-[11px] text-slate-300 block">
                        Hoặc nếu Admin đã cấp sẵn Mã kích hoạt gia hạn, Thầy/Cô dán vào đây:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={inputKey}
                          onChange={(e) => setInputKey(e.target.value)}
                          placeholder="Dán mã kích hoạt gia hạn tại đây (KEY-YYYYMMDD-...)"
                          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-400"
                        />
                        <button
                          onClick={handleActivateKey}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 cursor-pointer"
                        >
                          ⚡ Kích hoạt Gia hạn
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Nút đồng bộ bản quyền từ Cloud */}
                  <button
                    onClick={handleCloudSync}
                    disabled={isSyncingCloud}
                    className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncingCloud ? 'animate-spin' : ''}`} />
                    <span>{isSyncingCloud ? 'ĐANG KẾT NỐI VÀ ĐỒNG BỘ TỪ WEB CLOUD...' : '🔄 CẬP NHẬT / ĐỒNG BỘ BẢN QUYỀN TỪ WEB CLOUD (LÀM MỚI TỨC THÌ)'}</span>
                  </button>
                </div>
              ) : (
                /* TRƯỜNG HỢP B: CHƯA KÍCH HOẠT HOẶC ĐANG DÙNG THỬ (5 LẦN) */
                <div className="p-5 rounded-2xl bg-slate-900 border-2 border-amber-500/50 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      🎁 CHẾ ĐỘ DÙNG THỬ TRỰC TUYẾN
                    </span>
                    <span className="text-xs text-amber-400 font-mono font-bold">5 LẦN MIỄN PHÍ</span>
                  </div>

                  {/* Hộp đếm lượt dùng thử */}
                  <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-amber-200 block">
                        SỐ LƯỢT DÙNG THỬ CÒN LẠI CỦA MÁY TÍNH:
                      </span>
                      <div className="text-2xl font-black text-amber-300 mt-0.5">
                        CÒN {trialRemaining} / 5 LƯỢT
                      </div>
                    </div>
                    <div className="flex gap-1.5 text-base">
                      {[1, 2, 3, 4, 5].map((dot) => (
                        <span key={dot} className={dot <= trialRemaining ? 'text-amber-400' : 'text-slate-600'}>
                          ●
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Mã máy tính cá nhân hóa */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        MÃ MÁY TÍNH NHẬN DIỆN CỦA THẦY/CÔ (HARDWARE CODE):
                      </span>
                      <span className="text-sm sm:text-base font-mono font-black text-cyan-300">
                        {detectedMid}
                      </span>
                    </div>
                    <button
                      onClick={handleCopyMid}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-1.5 transition cursor-pointer"
                    >
                      {copiedMid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedMid ? 'Đã chép' : 'Sao chép'}</span>
                    </button>
                  </div>

                  {/* Form đăng ký bản quyền gửi Admin tức thời */}
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                    <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                      📝 ĐĂNG KÝ BẢN QUYỀN PRO - GỬI LÊN WEB CLOUD ADMIN TỨC THÌ:
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-300 font-bold block mb-1">Họ và tên Giáo viên (*):</label>
                        <input
                          type="text"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Ví dụ: Thầy Đinh Văn Thành"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-300 font-bold block mb-1">Số điện thoại / Zalo (*):</label>
                        <input
                          type="text"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="Ví dụ: 0915213717"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-300 font-bold block mb-1">Trường / Đơn vị công tác:</label>
                      <input
                        type="text"
                        value={regSchool}
                        onChange={(e) => setRegSchool(e.target.value)}
                        placeholder="Ví dụ: Trường THCS Chu Văn An"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <button
                      onClick={handleSendRegistration}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>GỬI ĐĂNG KÝ BẢN QUYỀN LÊN WEB CLOUD (TỨC THÌ)</span>
                    </button>

                    {regSent && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Đã chuyển thông tin đăng ký lên Web Cloud Admin của Thầy Thành! Hệ thống đã mở Zalo để Thầy duyệt cấp mã kích hoạt ngay cho Thầy/Cô.</span>
                      </div>
                    )}
                  </div>

                  {/* Ô dán mã kích hoạt */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <label className="text-xs font-bold text-slate-300 block">
                      ĐÃ CÓ MÃ BẢN QUYỀN TỪ THẦY THÀNH? DÁN VÀO ĐÂY ĐỂ KÍCH HOẠT:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputKey}
                        onChange={(e) => setInputKey(e.target.value)}
                        placeholder="Dán mã kích hoạt (KEY-ENG-...)"
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-400"
                      />
                      <button
                        onClick={handleActivateKey}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 cursor-pointer"
                      >
                        ⚡ Kích Hoạt Pro
                      </button>
                    </div>

                    {verifyResult && (
                      <div className={`mt-2 p-2.5 rounded-xl text-xs font-medium ${
                        verifyResult.isValid ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {verifyResult.message}
                      </div>
                    )}
                  </div>

                  {/* Nút đồng bộ Cloud */}
                  <button
                    onClick={handleCloudSync}
                    disabled={isSyncingCloud}
                    className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncingCloud ? 'animate-spin' : ''}`} />
                    <span>{isSyncingCloud ? 'ĐANG KẾT NỐI VÀ ĐỒNG BỘ TỪ WEB CLOUD...' : '🔄 CẬP NHẬT / ĐỒNG BỘ BẢN QUYỀN TỪ WEB CLOUD (LÀM MỚI TỨC THÌ)'}</span>
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

        {/* FOOTER MODAL CHUẨN */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Hỗ trợ giáo viên 24/7 qua Zalo Thầy Đinh Văn Thành: <strong>0915.213717</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://zalo.me/0915213717"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition"
            >
              <MessageCircle className="w-3.5 h-3.5" /> Kết Nối Zalo
            </a>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
            >
              Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
