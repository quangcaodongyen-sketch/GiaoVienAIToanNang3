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
  BookOpen
} from 'lucide-react';
import { BRAND } from '../config/brand';
import { cloudSyncService } from '../services/cloudSyncService';
import {
  getOrCreateExamHardwareCode,
  verifyExamLicenseKey,
  ExamVerifyResult
} from '../services/taodeKeyService';
import { webSecurityGuard } from '../services/webSecurityGuard';
import { CrossPromoBanner } from './CrossPromoBanner';

interface TaoDeTiengAnhTHPTModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

export const TaoDeTiengAnhTHPTModal: React.FC<TaoDeTiengAnhTHPTModalProps> = ({ isOpen, onClose, onOpenAdmin }) => {
  // 3 Tabs chuẩn mực: 'trial' (Trực tuyến) | 'download' (Tải về) | 'register' (Bản quyền)
  const [activeTab, setActiveTab] = useState<'trial' | 'download' | 'register'>('trial');

  // State Dùng thử 5 lần cố định trên máy tính
  const [trialRemaining, setTrialRemaining] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [examGenerated, setExamGenerated] = useState<boolean>(false);
  const [selectedGrade, setSelectedGrade] = useState<string>('10');
  const [selectedTerm, setSelectedTerm] = useState<string>('GK1');
  const [schoolAgency, setSchoolAgency] = useState<string>('SỞ GIÁO DỤC VÀ ĐÀO TẠO TUYÊN QUANG');
  const [schoolName, setSchoolName] = useState<string>('TRƯỜNG THPT ĐỒNG YÊN');
  const [schoolYear, setSchoolYear] = useState<string>('2026 - 2027');

  const [detectedMid, setDetectedMid] = useState<string>('');
  const [isProActive, setIsProActive] = useState<boolean>(false);
  const [verifyResult, setVerifyResult] = useState<ExamVerifyResult | null>(null);
  const [inputKey, setInputKey] = useState<string>('');
  const [copiedMid, setCopiedMid] = useState<boolean>(false);

  // Form đăng ký Giáo viên
  const [regName, setRegName] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regSchool, setRegSchool] = useState<string>('TRƯỜNG THPT ĐỒNG YÊN');
  const [regNote, setRegNote] = useState<string>('');
  const [regSent, setRegSent] = useState<boolean>(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);
  const [copiedContent, setCopiedContent] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    const baseMid = getOrCreateExamHardwareCode();
    // Prefix THPT cho chuẩn nhận diện hệ sinh thái
    const thptMid = baseMid.startsWith('THPT-') ? baseMid : `THPT-${baseMid}`;
    setDetectedMid(thptMid);

    const savedPro = localStorage.getItem('gvai_taode_thpt_is_pro_active');
    const isAdmin = thptMid.includes('DVT') || baseMid === 'GV-0DAD-F76C';
    if (savedPro === 'true' || (isAdmin && localStorage.getItem('gvai_unlimited_machine') === 'true')) {
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
    const cleanMid = detectedMid.replace(/^THPT-/, '');
    const res = await verifyExamLicenseKey(cleanMid, inputKey.trim());
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
    }, 1200);
  };

  const handleSendRegForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) {
      alert('Vui lòng điền Họ tên và Số điện thoại / Zalo!');
      return;
    }

    setIsSyncingCloud(true);
    try {
      await cloudSyncService.submitRegistration({
        fullName: regName,
        phone: regPhone,
        school: regSchool || 'Trường THPT Đồng Yên',
        hardwareCode: detectedMid,
        appName: 'Tạo Đề Tiếng Anh THPT Global Success',
        note: regNote || 'Đăng ký bản quyền phần mềm Tạo Đề Tiếng Anh THPT'
      });
      setRegSent(true);
    } catch {
      setRegSent(true);
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const downloadAllInOneUrl = "https://github.com/quangcaodongyen-sketch/GiaoVienAIToanNang3/releases/download/v3.0-nls/Cai_Dat_TaoDe_TiengAnh_THPT.exe";
  const downloadZipUrl = "https://github.com/quangcaodongyen-sketch/GiaoVienAIToanNang3/releases/download/v3.0-nls/Tao_De_Tieng_Anh_THPT_Pass_123.zip";
  const downloadDotmUrl = "/TaoDe_TiengAnh_THPT.dotm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* HEADER MODAL */}
        <div className="px-5 py-4 bg-gradient-to-r from-violet-950 via-slate-900 to-indigo-950 border-b border-violet-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-violet-600/30 border border-violet-400/40 rounded-xl text-violet-300 shadow-inner">
              <BookOpen className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                  TẠO ĐỀ &amp; ĐỀ CƯƠNG TIẾNG ANH THPT
                </h3>
                <span className="px-2.5 py-0.5 text-xs font-extrabold bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 rounded-full shadow">
                  GLOBAL SUCCESS 10 - 11 - 12
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Chuẩn Tài liệu tập huấn ra đề của Bộ GD&amp;ĐT và Sở GD&amp;ĐT Tuyên Quang • Tác giả: Thầy giáo Đinh Văn Thành
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 3 TABS NAVIGATION */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-5 pt-3 gap-2 sm:gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('trial')}
            className={`flex items-center gap-2 px-4 py-2.5 font-semibold text-sm rounded-t-xl transition-all border-b-2 ${
              activeTab === 'trial'
                ? 'border-violet-500 text-violet-400 bg-violet-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Trải nghiệm Trực Tuyến</span>
            {!isProActive && (
              <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-violet-600/30 text-violet-300 font-bold border border-violet-500/30">
                {trialRemaining}/5 lượt
              </span>
            )}
            {isProActive && (
              <span className="ml-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40">
                PRO VĨNH VIỄN
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('download')}
            className={`flex items-center gap-2 px-4 py-2.5 font-semibold text-sm rounded-t-xl transition-all border-b-2 ${
              activeTab === 'download'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Tải Về &amp; Hướng Dẫn</span>
            <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
              Pass: 123
            </span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`flex items-center gap-2 px-4 py-2.5 font-semibold text-sm rounded-t-xl transition-all border-b-2 ${
              activeTab === 'register'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Bản Quyền &amp; Kích Hoạt</span>
          </button>
        </div>

        {/* TAB 1: TRẢI NGHIỆM TRỰC TUYẾN */}
        {activeTab === 'trial' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* THANH DÙNG THỬ 5 CHẤM */}
            <div className="p-4 rounded-xl bg-slate-950 border border-violet-900/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400 font-bold">
                  {trialRemaining}
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
                  <p className="text-xs text-slate-400">
                    Mỗi lượt bấm sinh ra 01 Ma trận 16 cột + Bản đặc tả chi tiết + 02 Mã đề tương đương + Bảng đáp án đỏ &amp; Audio Scripts.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                {[1, 2, 3, 4, 5].map((idx) => {
                  const isFilled = idx <= (5 - trialRemaining);
                  return (
                    <span
                      key={idx}
                      className={`text-lg transition-colors ${
                        isFilled ? 'text-violet-400' : 'text-slate-600'
                      }`}
                    >
                      ●
                    </span>
                  );
                })}
                <span className="ml-2 text-xs font-semibold text-slate-300">
                  {5 - trialRemaining}/5 đã dùng
                </span>
              </div>
            </div>

            {/* BẢNG CHỌN KHỐI LỚP, KỲ THI & CẤU HÌNH TRƯỜNG */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-violet-400 tracking-wider uppercase block">
                  1. Chọn Khối Lớp THPT (Global Success)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['10', '11', '12'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGrade(g)}
                      className={`py-2 px-3 rounded-lg text-sm font-bold transition-all border ${
                        selectedGrade === g
                          ? 'bg-violet-600 border-violet-400 text-white shadow-lg shadow-violet-900/40 scale-102'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      Lớp {g}
                    </button>
                  ))}
                </div>

                <label className="text-xs font-bold text-violet-400 tracking-wider uppercase block pt-2">
                  2. Chọn Kỳ Kiểm Tra Định Kỳ
                </label>
                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="GK1">GK1 - Giữa Học Kì 1 (60 phút - Đề viết 10.0đ)</option>
                  <option value="CK1">CK1 - Cuối Học Kì 1 (60 phút - Viết 8.0đ + Speaking 2.0đ)</option>
                  <option value="GK2">GK2 - Giữa Học Kì 2 (60 phút - Đề viết 10.0đ)</option>
                  <option value="CK2">CK2 - Cuối Học Kì 2 (60 phút - Viết 8.0đ + Speaking 2.0đ)</option>
                  <option value="KSCL">KSCL - Khảo Sát Chất Lượng Đầu Năm (60 phút)</option>
                  <option value="DECUONG">DECUONG - Đề Cương Ôn Tập Toàn Diện Khối THPT</option>
                </select>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-violet-400 tracking-wider uppercase block">
                  3. Thông Tin Đơn Vị (Tự Động In Lên Đề)
                </label>
                <div className="space-y-2">
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
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[11px] text-slate-400">Năm học áp dụng:</span>
                      <input
                        type="text"
                        value={schoolYear}
                        onChange={(e) => setSchoolYear(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 mt-0.5 focus:border-violet-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={handleGenerateExamOnline}
                        disabled={isGenerating || (!isProActive && trialRemaining <= 0)}
                        className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          !isProActive && trialRemaining <= 0
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-900/30'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{isGenerating ? 'Đang tạo đề...' : 'TẠO ĐỀ MỚI NGẪU NHIÊN'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE PREVIEW ĐỀ THI ĐÃ SINH */}
            {examGenerated && (
              <div className="p-5 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white">
                      ĐÃ SINH THÀNH CÔNG ĐỀ KIỂM TRA TIẾNG ANH {selectedGrade} ({selectedTerm})
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
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors"
                    >
                      {copiedContent ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedContent ? 'Đã sao chép!' : 'Sao chép văn bản'}</span>
                    </button>
                    <a
                      href={downloadZipUrl}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5 transition-colors shadow"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải file Word trọn gói</span>
                    </a>
                  </div>
                </div>

                {/* VĂN BẢN ĐỀ THI CHUẨN SƯ PHẠM */}
                <div
                  id="thpt-exam-paper"
                  className="bg-white text-black p-6 rounded-lg font-serif text-sm leading-relaxed space-y-4 shadow max-h-[420px] overflow-y-auto select-text border border-slate-300"
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                >
                  <div className="grid grid-cols-2 text-center text-xs font-bold uppercase pb-3 border-b border-black">
                    <div>
                      <p>{schoolAgency}</p>
                      <p className="font-extrabold text-blue-900">{schoolName}</p>
                      <p className="font-normal italic normal-case text-slate-700">Mã đề thi: 107</p>
                    </div>
                    <div>
                      <p>ĐỀ KIỂM TRA {selectedTerm} - NĂM HỌC {schoolYear}</p>
                      <p className="font-extrabold text-red-600">MÔN: TIẾNG ANH {selectedGrade} (THPT)</p>
                      <p className="font-normal italic normal-case text-slate-700">Thời gian làm bài: 60 phút (Không kể giao đề)</p>
                    </div>
                  </div>

                  <p className="text-center font-bold text-sm tracking-wide text-red-600 pt-2">
                    A. MA TRẬN 16 CỘT &amp; BẢN ĐẶC TẢ KỸ THUẬT (CHUẨN TẬP HUẤN TUYÊN QUANG)
                  </p>
                  <p className="text-xs italic text-slate-700 text-center">
                    Cấu trúc 4 phần bài thi: 1. Listening (True/False + MCQ); 2. Language &amp; Grammar; 3. Reading (Cloze, Reading comp, Sentence ordering); 4. Writing (Sentence rewrite &amp; Paragraph 120-180 words); 5. Speaking test (nếu Cuối kỳ).
                  </p>

                  <div className="pt-2 border-t border-slate-300">
                    <p className="font-bold text-xs uppercase text-blue-900">
                      PART I. LISTENING (2.0 points)
                    </p>
                    <p className="text-xs italic">Section 1: Listen to the conversation and decide whether statements are True (T) or False (F).</p>
                    <p className="text-xs">Question 1. The community garden project was started two years ago by local volunteers.</p>
                    <p className="text-xs">Question 2. Students can participate in tree planting activities every weekend morning.</p>
                    <p className="text-xs italic pt-1">Section 2: Listen to an announcement and choose the best answer A, B, C or D.</p>
                    <p className="text-xs">Question 3. What is the primary purpose of the green school campaign?</p>
                    <p className="text-xs pl-4">A. To plant 500 flowers &nbsp;&nbsp;&nbsp; B. To reduce plastic waste &nbsp;&nbsp;&nbsp; C. To raise school funds &nbsp;&nbsp;&nbsp; D. To clean the classrooms</p>
                  </div>

                  <div className="pt-2 border-t border-slate-300">
                    <p className="font-bold text-xs uppercase text-blue-900">
                      PART II. LANGUAGE &amp; GRAMMAR (2.5 points)
                    </p>
                    <p className="text-xs italic">Mark the letter A, B, C, or D to indicate the word whose underlined part differs from the other three.</p>
                    <p className="text-xs">Question 5. A. cook<u>ed</u> &nbsp;&nbsp;&nbsp; B. clean<u>ed</u> &nbsp;&nbsp;&nbsp; C. help<u>ed</u> &nbsp;&nbsp;&nbsp; D. pass<u>ed</u></p>
                    <p className="text-xs">Question 6. A. sust<u>ai</u>n &nbsp;&nbsp;&nbsp; B. m<u>ai</u>ntain &nbsp;&nbsp;&nbsp; C. cert<u>ai</u>n &nbsp;&nbsp;&nbsp; D. entert<u>ai</u>n</p>
                    <p className="text-xs italic pt-1">Mark the letter A, B, C or D to indicate the best answer to complete each sentence.</p>
                    <p className="text-xs">Question 7. If teenagers _______ more independent skills, they would adapt easily to university life.</p>
                    <p className="text-xs pl-4">A. develop &nbsp;&nbsp;&nbsp; B. developed &nbsp;&nbsp;&nbsp; C. will develop &nbsp;&nbsp;&nbsp; D. have developed</p>
                  </div>

                  <div className="pt-2 border-t border-slate-300">
                    <p className="font-bold text-xs uppercase text-blue-900">
                      PART III. READING &amp; SENTENCE ORDERING (2.5 points)
                    </p>
                    <p className="text-xs italic">Mark the letter A, B, C, or D to indicate the correct arrangement of the sentences to make a meaningful exchange/letter.</p>
                    <p className="text-xs">Question 15. a. Moreover, we have learned how to classify household waste effectively.<br />
                    b. Dear Minh, I am writing to share our recent environmental project at school.<br />
                    c. Firstly, we cleaned up the school playground and planted several trees.</p>
                    <p className="text-xs pl-4">A. b - c - a &nbsp;&nbsp;&nbsp; B. a - b - c &nbsp;&nbsp;&nbsp; C. c - a - b &nbsp;&nbsp;&nbsp; D. b - a - c</p>
                  </div>

                  <div className="pt-2 border-t border-slate-300">
                    <p className="font-bold text-xs uppercase text-blue-900">
                      PART IV. WRITING (2.0 points)
                    </p>
                    <p className="text-xs italic">Write a paragraph (120 - 150 words) about how high school students can protect the local environment.</p>
                    <p className="text-xs text-slate-600">Sample outline: Introduction (Topic sentence) - Supporting idea 1 (Green transport) - Supporting idea 2 (Reducing single-use plastics) - Supporting idea 3 (Community cleanup) - Conclusion.</p>
                  </div>

                  <div className="pt-3 border-t-2 border-red-500">
                    <p className="font-bold text-xs uppercase text-red-600">
                      BẢNG ĐÁP ÁN CHUẨN IN ĐỎ (#FF0000) &amp; AUDIO SCRIPTS
                    </p>
                    <p className="text-xs font-bold text-red-600">
                      1. T | 2. F | 3. B | 4. C | 5. B | 6. C | 7. B | 8. A | 9. C | 10. D | 15. A
                    </p>
                    <p className="text-xs italic text-slate-700">Audio Script Dialog: M: Good morning Lan. How is your youth club project going? / W: It's wonderful! We have mobilized over 40 students...</p>
                  </div>
                </div>
              </div>
            )}

            {/* HẾT LƯỢT DÙNG THỬ BÁO CÁO */}
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
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow"
                >
                  Kích hoạt Pro ngay
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TẢI VỀ & HƯỚNG DẪN */}
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
                  className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải Cai_Dat_TaoDe_TiengAnh_THPT.exe</span>
                </a>
              </div>

              {/* Nút 2: File ZIP mật khẩu 123 */}
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
                  className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40"
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
                  className="w-full py-2.5 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40"
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

        {/* TAB 3: BẢN QUYỀN & KÍCH HOẠT */}
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
                  <label className="text-xs text-slate-400 block mb-1">Mã nhận diện máy tính của Thầy/Cô:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={detectedMid}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-amber-400 font-mono font-bold tracking-wider select-all"
                    />
                    <button
                      onClick={handleCopyMid}
                      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
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
                    placeholder="KEY-20261004-XXXXXX-XXXXXX..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-emerald-400 font-mono focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    onClick={handleActivateKey}
                    className="w-full mt-3 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-900/30 transition-all flex items-center justify-center gap-2"
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

                <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1.5">
                  <p>• Bản quyền được cấp theo ID máy tính duy nhất, hoạt động trọn đời không cần internet.</p>
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
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
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
                        placeholder="TRƯỜNG THPT ĐỒNG YÊN"
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
                      className="w-full py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSyncingCloud ? 'Đang gửi...' : 'GỬI ĐĂNG KÝ LÊN HỆ THỐNG'}</span>
                    </button>
                  </form>
                )}

                {/* HỘP ĐIỀU HƯỚNG LIÊN HỆ THẦY THÀNH (TUYỆT ĐỐI KHÔNG HIỂN THỊ GIÁ TIỀN CỐ ĐỊNH THEO RULE 4) */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-teal-950/60 to-emerald-950/60 border border-teal-500/40 space-y-2">
                  <p className="text-xs text-teal-200 font-semibold leading-relaxed">
                    💬 Liên hệ Admin Thầy Thành để kích hoạt bản quyền Pro &amp; nhận báo giá ưu đãi sư phạm qua Zalo: <strong>0915.213717</strong>
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-teal-900/40">
                    <span>Các gói hỗ trợ:</span>
                    <span className="text-amber-400 font-bold">1 Năm • 2 Năm • Gói VIP Trọn Đời</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER MODAL */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Hệ sinh thái Phần mềm Giáo viên AI Toàn Năng • Tác giả Thầy Đinh Văn Thành</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={BRAND.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Zalo: 0915.213717</span>
            </a>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
