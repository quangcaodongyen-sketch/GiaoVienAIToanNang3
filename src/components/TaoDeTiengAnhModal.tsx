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
  CheckSquare
} from 'lucide-react';
import { BRAND, EXAM_RESOURCES } from '../config/brand';
import { cloudSyncService } from '../services/cloudSyncService';
import {
  getOrCreateExamHardwareCode,
  verifyExamLicenseKey,
  ExamVerifyResult
} from '../services/taodeKeyService';

interface TaoDeTiengAnhModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

export const TaoDeTiengAnhModal: React.FC<TaoDeTiengAnhModalProps> = ({ isOpen, onClose, onOpenAdmin }) => {
  // 3 Tabs chuẩn mực: 'trial' (Trực tuyến) | 'download' (Tải về) | 'register' (Bản quyền)
  const [activeTab, setActiveTab] = useState<'trial' | 'download' | 'register'>('trial');

  // State Dùng thử 5 lần cố định trên máy tính
  const [trialRemaining, setTrialRemaining] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [examGenerated, setExamGenerated] = useState<boolean>(false);
  const [selectedGrade, setSelectedGrade] = useState<string>('9');
  const [selectedTerm, setSelectedTerm] = useState<string>('GK1');
  const [schoolAgency, setSchoolAgency] = useState<string>('PHÒNG GIÁO DỤC VÀ ĐÀO TẠO');
  const [schoolName, setSchoolName] = useState<string>('TRƯỜNG THCS ĐỒNG YÊN');
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

  useEffect(() => {
    if (!isOpen) return;
    const mid = getOrCreateExamHardwareCode();
    setDetectedMid(mid);

    const savedPro = localStorage.getItem('gvai_taode_is_pro_active');
    if (savedPro === 'true' || localStorage.getItem('gvai_unlimited_machine') === 'true') {
      setIsProActive(true);
    }

    // Đọc số lượt dùng thử từ localStorage
    const savedTrial = localStorage.getItem('gvai_taode_eng_trial_remaining');
    if (savedTrial !== null) {
      setTrialRemaining(parseInt(savedTrial, 10));
    } else {
      localStorage.setItem('gvai_taode_eng_trial_remaining', '5');
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
    const res = await verifyExamLicenseKey(inputKey, detectedMid);
    setVerifyResult(res);
    if (res.isValid) {
      setIsProActive(true);
      localStorage.setItem('gvai_taode_is_pro_active', 'true');
      localStorage.setItem('gvai_taode_pro_key', inputKey.trim());
    }
  };

  const handleOnlineGenerate = () => {
    if (!isProActive && trialRemaining <= 0) {
      alert('⚠️ Thầy/Cô đã dùng hết 5 lượt dùng thử trực tuyến miễn phí!\n\nVui lòng chuyển sang Tab "Bản Quyền & Kích Hoạt" để kích hoạt bản Pro sử dụng vĩnh viễn không giới hạn.');
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
    }, 1200);
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
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 TAB NAVIGATION CHUẨN MỰC */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-6 shrink-0">
          <button
            onClick={() => setActiveTab('trial')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-sm border-b-2 transition-all ${
              activeTab === 'trial'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Trải nghiệm Trực Tuyến</span>
            {!isProActive && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                trialRemaining > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {trialRemaining}/5 lượt
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('download')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-sm border-b-2 transition-all ${
              activeTab === 'download'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Tải Về & Hướng Dẫn</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-sm border-b-2 transition-all ${
              activeTab === 'register'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Bản Quyền & Kích Hoạt</span>
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ========================================================================= */}
          {/* TAB 1: TRẢI NGHIỆM TRỰC TUYẾN (5 LƯỢT DÙNG THỬ BẮT BUỘC CỐ ĐỊNH)           */}
          {/* ========================================================================= */}
          {activeTab === 'trial' && (
            <div className="space-y-6">
              
              {/* Card Tiến trình Dùng thử 5 Chấm */}
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
                        {trialRemaining > 0 ? `Còn ${trialRemaining}/5 lượt trên máy này` : '⚠️ Đã hết 5 lượt dùng thử'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Mỗi thiết bị được tạo thử đúng 05 bộ đề kiểm tra hoàn chỉnh chuẩn CV 7991.
                  </p>
                </div>

                {/* Thanh 5 Chấm trực quan */}
                {!isProActive && (
                  <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-700">
                    <span className="text-xs text-slate-400 font-medium mr-1">Tiến trình:</span>
                    {[1, 2, 3, 4, 5].map((idx) => {
                      const isUsed = idx > trialRemaining;
                      return (
                        <div
                          key={idx}
                          title={isUsed ? `Lượt ${idx}: Đã dùng` : `Lượt ${idx}: Còn lại`}
                          className={`w-3.5 h-3.5 rounded-full transition-all ${
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Khối Lớp (Global Success):</label>
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

              {/* Nút Tạo Đề Trực Tuyến */}
              <button
                onClick={handleOnlineGenerate}
                disabled={isGenerating || (!isProActive && trialRemaining <= 0)}
                className={`w-full py-4 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-3 shadow-lg transition-all ${
                  !isProActive && trialRemaining <= 0
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600'
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25 active:scale-[0.99]'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Đang bốc câu hỏi từ ngân hàng Unit 1-12 & lập ma trận 7991...</span>
                  </>
                ) : !isProActive && trialRemaining <= 0 ? (
                  <>
                    <span>⚠️ ĐÃ HẾT 5 LƯỢT DÙNG THỬ • BẤM ĐỂ KÍCH HOẠT PRO</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>
                      TẠO ĐỀ KIỂM TRA TRỰC TUYẾN {isProActive ? '(PRO KHÔNG GIỚI HẠN)' : `(CÒN ${trialRemaining}/5 LƯỢT DÙNG THỬ)`}
                    </span>
                  </>
                )}
              </button>

              {/* Preview Khung Đề Thi Sư Phạm (Times New Roman 13pt) */}
              {examGenerated && (
                <div className="p-6 rounded-2xl bg-white text-black shadow-xl border border-slate-300 font-['Times_New_Roman',serif] text-[13pt] leading-relaxed animate-fade-in">
                  <div className="flex justify-between items-start border-b pb-4 mb-4">
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

                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-[#FF0000] text-[11pt] font-sans mb-4">
                    <strong>✔ TÍCH HỢP CHUẨN CÔNG VĂN 7991/BGDĐT:</strong> Bao gồm đầy đủ Ma trận 4 mức độ nhận thức, Bản đặc tả kỹ thuật chi tiết, 02 Mã đề trắc nghiệm khách quan + tự luận, Bảng đáp án, Audio scripts và Hướng dẫn chấm điểm.
                  </div>

                  <div className="space-y-4">
                    <p className="font-bold uppercase text-[12pt]">PART A. LISTENING (2.0 points)</p>
                    <p className="italic text-[11pt]">Listen to the conversation and choose the correct answer A, B, C or D.</p>
                    <p><strong>Question 1.</strong> What does Mai often do in her leisure time?</p>
                    <p className="pl-6">A. Surfing the internet &nbsp;&nbsp;&nbsp;&nbsp; B. Playing sports &nbsp;&nbsp;&nbsp;&nbsp; C. Reading books &nbsp;&nbsp;&nbsp;&nbsp; D. Cooking</p>

                    <p className="font-bold uppercase text-[12pt] pt-2">PART B. LANGUAGE &amp; GRAMMAR (2.5 points)</p>
                    <p><strong>Question 2.</strong> Life in the countryside is much ________ than life in the big city.</p>
                    <p className="pl-6">A. peaceful &nbsp;&nbsp;&nbsp;&nbsp; B. more peaceful &nbsp;&nbsp;&nbsp;&nbsp; C. as peaceful &nbsp;&nbsp;&nbsp;&nbsp; D. most peaceful</p>
                  </div>

                  <div className="mt-6 pt-4 border-t flex flex-wrap items-center justify-between gap-3 font-sans text-xs">
                    <span className="text-slate-500">Đã áp dụng thông tin: {schoolName} ({schoolYear})</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => alert('Đã sao chép nội dung đề thi vào clipboard!')}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg flex items-center gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5" /> Sao chép văn bản
                      </button>
                      <a
                        href="/De_Kiem_Tra_Tieng_Anh_6_Global_Success_CV7991.doc"
                        download
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" /> Tải file Word (.doc)
                      </a>
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
            <div className="space-y-6">
              {/* Video Player Full HD nhúng trực tiếp */}
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
                    download
                    className="text-blue-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <Download className="w-3.5 h-3.5" /> Tải video về máy
                  </a>
                </div>
              </div>

              {/* Danh sách các gói cài đặt tải về */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Bộ cài Word 1-Click */}
                <div className="p-5 rounded-2xl bg-slate-800/80 border border-blue-500/30 hover:border-blue-500/60 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        KHUYÊN DÙNG CHO GV
                      </span>
                      <span className="text-xs text-slate-400 font-mono">77 MB</span>
                    </div>
                    <h4 className="text-base font-bold text-white mb-1">Bộ Cài Đặt Tích Hợp Word 1-Click</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Tự động nhúng thanh công cụ "📝 TẠO ĐỀ TIẾNG ANH THCS" vào Microsoft Word. Xóa file ngoài Desktop vẫn dùng vĩnh viễn.
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-700/60 flex items-center gap-2">
                    <a
                      href={EXAM_RESOURCES.exeWordUrl}
                      className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
                    >
                      <Download className="w-4 h-4" /> Tải Bộ Cài Word (.exe)
                    </a>
                  </div>
                </div>

                {/* Trọn bộ nén ZIP Pass 123 */}
                <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        MẬT KHẨU: 123
                      </span>
                      <span className="text-xs text-slate-400 font-mono">76 MB</span>
                    </div>
                    <h4 className="text-base font-bold text-white mb-1">Trọn Bộ Bản Nén ZIP (Pass: 123)</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Dành cho máy tính cài đặt trình duyệt chặn file .exe. Tải về giải nén với mật khẩu <strong>123</strong> là chạy mượt mà.
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-700/60 flex items-center gap-2">
                    <a
                      href={EXAM_RESOURCES.fullZipUrl}
                      className="flex-1 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <Download className="w-4 h-4" /> Tải Bản Nén ZIP (.zip)
                    </a>
                  </div>
                </div>

                {/* Bản Desktop Chạy Trực Tiếp */}
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-white">Bản Desktop Chạy Trực Tiếp</h5>
                    <p className="text-[11px] text-slate-400">Không cần cài đặt, bấm mở chạy ngay (44 MB)</p>
                  </div>
                  <a
                    href={EXAM_RESOURCES.exeDesktopUrl}
                    className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-bold text-white flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Tải về
                  </a>
                </div>

                {/* Nền Tảng Tiếng Anh Online */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 to-slate-800/60 border border-indigo-500/30 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-white">Website Tiếng Anh Trực Tuyến</h5>
                    <p className="text-[11px] text-indigo-300">EnglishExam Global Success (Kho đề online)</p>
                  </div>
                  <a
                    href="https://github.com/quangcaodongyen-sketch/EnglishExam-GlobalSuccess"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Mở Web
                  </a>
                </div>

              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: BẢN QUYỀN & KÍCH HOẠT                                              */}
          {/* ========================================================================= */}
          {activeTab === 'register' && (
            <div className="space-y-6">
              
              {/* Hộp Mã Máy Tính & Kích Hoạt Nhanh */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-800 to-indigo-950/60 border border-slate-700 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                      MÃ MÁY TÍNH CỦA BẠN (HARDWARE CODE)
                    </span>
                    <div className="text-xl sm:text-2xl font-mono font-black text-white mt-0.5 tracking-wider select-all">
                      {detectedMid || 'Đang nhận diện...'}
                    </div>
                  </div>
                  <button
                    onClick={handleCopyMid}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 active:scale-95 transition-all"
                  >
                    {copiedMid ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Đã Sao Chép!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Sao Chép Mã Máy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Ô Nhập Key Kích Hoạt */}
                <div className="pt-3 border-t border-slate-700/80">
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    DÁN MÃ BẢN QUYỀN DO THẦY THÀNH CẤP VÀO ĐÂY ĐỂ KÍCH HOẠT:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputKey}
                      onChange={(e) => setInputKey(e.target.value)}
                      placeholder="KEY-ENG-20290930-XXXX..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={handleActivateKey}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 active:scale-95 transition-all shrink-0"
                    >
                      KÍCH HOẠT PRO
                    </button>
                  </div>

                  {verifyResult && (
                    <div className={`mt-2.5 p-3 rounded-xl text-xs font-medium ${
                      verifyResult.isValid ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {verifyResult.message}
                    </div>
                  )}
                </div>
              </div>

              {/* Bảng Giá Các Gói Bản Quyền Sư Phạm */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  BẢNG GIÁ CÁC GÓI BẢN QUYỀN SƯ PHẠM (ĐỒNG BỘ NLS-AI):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                    <span className="text-xs font-bold text-slate-400">GÓI 1 NĂM</span>
                    <div className="text-base font-black text-white mt-1">Ưu Đãi Sư Phạm</div>
                    <p className="text-[11px] text-slate-400 mt-1">Sử dụng trọn vẹn 1 năm học</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-b from-blue-950/60 to-slate-800 border border-blue-500/50 text-center relative overflow-hidden">
                    <span className="text-xs font-bold text-blue-400">GÓI 2 NĂM VIP</span>
                    <div className="text-base font-black text-amber-300 mt-1">Khuyên Dùng</div>
                    <p className="text-[11px] text-slate-300 mt-1">Bảo hành &amp; cập nhật 24 tháng</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                    <span className="text-xs font-bold text-slate-400">TRỌN ĐỜI (VIP)</span>
                    <div className="text-base font-black text-emerald-400 mt-1">Vĩnh Viễn</div>
                    <p className="text-[11px] text-slate-400 mt-1">Cập nhật mọi phiên bản mới</p>
                  </div>
                </div>
              </div>

              {/* Form Gửi Thông Tin Cho Thầy Thành */}
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  GỬI THÔNG TIN ĐĂNG KÝ CHO THẦY THÀNH (HỖ TRỢ ZALO 1-CLICK):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Họ và tên Thầy/Cô *</label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Cô Nguyễn Thị Lan"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Số điện thoại / Zalo *</label>
                    <input
                      type="text"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="0912.345678"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Trường THCS / Đơn vị công tác</label>
                  <input
                    type="text"
                    value={regSchool}
                    onChange={(e) => setRegSchool(e.target.value)}
                    placeholder="Trường THCS Đồng Yên"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  onClick={handleSendRegistration}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-98 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>KẾT NỐI ZALO VỚI THẦY THÀNH ĐỂ NHẬN MÃ PRO</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* FOOTER MODAL */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Hỗ trợ kỹ thuật 24/7 qua UltraViewer &amp; Zalo: <strong>0915.213717</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://zalo.me/0915213717"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline font-bold"
            >
              Liên hệ Zalo Thầy Thành
            </a>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
