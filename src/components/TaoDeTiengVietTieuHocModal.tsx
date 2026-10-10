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
  MessageCircle,
  FileText,
  Laptop,
  ShieldCheck,
  User,
  Send,
  BookOpen,
  Lock,
  Layers,
  Star,
  Award,
  RefreshCw,
  Play,
  Printer,
  FileSpreadsheet,
  Zap,
  HelpCircle,
  CheckSquare
} from 'lucide-react';
import { BRAND } from '../config/brand';
import { cloudSyncService } from '../services/cloudSyncService';
import {
  getOrCreateExamTVTHHardwareCode,
  verifyExamTVTHLicenseKey,
  getExamTVTHTrialRemaining,
  decrementExamTVTHTrial,
  ExamTVTHVerifyResult
} from '../services/taodeTVTHKeyService';
import { CrossPromoBanner } from './CrossPromoBanner';
import { ShareLinkBar } from './ShareLinkBar';
import { syncBrowserHash } from '../utils/shareUtils';
import { getWebTVTHEntry, TVTHEntry } from '../services/tvthWebEngine';

interface TaoDeTiengVietTieuHocModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

export const TaoDeTiengVietTieuHocModal: React.FC<TaoDeTiengVietTieuHocModalProps> = ({ isOpen, onClose, onOpenAdmin }) => {
  // Tab 1: Trải nghiệm Trực Tuyến | Tab 2: Tải Về & Hướng Dẫn | Tab 3: Bản Quyền & Kích Hoạt
  const [activeTab, setActiveTab] = useState<'online' | 'download' | 'register'>('online');

  // Trial state
  const [trialCount, setTrialCount] = useState<number>(5);
  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  const [selectedTerm, setSelectedTerm] = useState<'GK1' | 'CK1' | 'GK2' | 'CK2'>('GK1');
  const [schoolAgency, setSchoolAgency] = useState<string>('UBND XÃ ....................');
  const [schoolName, setSchoolName] = useState<string>('TRƯỜNG TIỂU HỌC ....................');
  
  const [generatedExam, setGeneratedExam] = useState<TVTHEntry | null>(null);
  const [showAnswers, setShowAnswers] = useState<boolean>(true);

  // License state
  const [detectedMid, setDetectedMid] = useState<string>('');
  const [isProActive, setIsProActive] = useState<boolean>(false);
  const [verifyResult, setVerifyResult] = useState<ExamTVTHVerifyResult | null>(null);
  const [inputKey, setInputKey] = useState<string>('');
  const [copiedMid, setCopiedMid] = useState<boolean>(false);

  // Form đăng ký Giáo viên
  const [regName, setRegName] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regSchool, setRegSchool] = useState<string>('');
  const [regSent, setRegSent] = useState<boolean>(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    syncBrowserHash('#taode-tiengviet-tieuhoc');

    // Lấy số lượt dùng thử còn lại
    const rem = getExamTVTHTrialRemaining();
    setTrialCount(rem);

    // Lấy Hardware code
    const hwCode = getOrCreateExamTVTHHardwareCode();
    setDetectedMid(hwCode);

    // Kiểm tra Pro key
    const checkPro = async () => {
      const savedKey = localStorage.getItem('gvai_tvth_license_key');
      if (savedKey) {
        const res = await verifyExamTVTHLicenseKey(hwCode, savedKey);
        if (res.isValid) {
          setIsProActive(true);
          setVerifyResult(res);
          return;
        }
      }
      setIsProActive(false);
    };
    checkPro();

    // Khởi tạo ngay 1 đề mẫu mặc định
    setGeneratedExam(getWebTVTHEntry(1, 'GK1'));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGenerateExam = () => {
    if (!isProActive && trialCount <= 0) {
      alert('Thầy/Cô đã hết 5 lượt dùng thử trải nghiệm miễn phí! Vui lòng liên hệ Admin Thầy Thành Zalo 0915.213717 để nâng cấp bản quyền Pro.');
      setActiveTab('register');
      return;
    }

    const entry = getWebTVTHEntry(selectedGrade, selectedTerm);
    setGeneratedExam(entry);

    if (!isProActive) {
      const nextCount = decrementExamTVTHTrial();
      setTrialCount(nextCount);
    }
  };

  const handleCopyMid = () => {
    navigator.clipboard.writeText(detectedMid);
    setCopiedMid(true);
    setTimeout(() => setCopiedMid(false), 2000);
  };

  const handleActivate = async () => {
    if (!inputKey.trim()) return;
    const res = await verifyExamTVTHLicenseKey(detectedMid, inputKey.trim());
    setVerifyResult(res);
    if (res.isValid) {
      setIsProActive(true);
      localStorage.setItem('gvai_tvth_license_key', inputKey.trim());
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone) return;
    setIsSyncingCloud(true);
    try {
      await cloudSyncService.submitRegistration({
        teacherName: regName,
        phone: regPhone,
        school: regSchool,
        note: 'Đăng ký Tạo Đề Tiếng Việt Tiểu Học Pro',
        productTag: 'TVTH_TIEUHOC',
        machineCode: detectedMid,
        timestamp: new Date().toISOString()
      });
      setRegSent(true);
    } catch {
      setRegSent(true);
    } finally {
      setIsSyncingCloud(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-rose-500/40 rounded-3xl shadow-2xl overflow-hidden text-slate-100 my-auto flex flex-col max-h-[94vh]">
        
        {/* HEADER MODAL */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-rose-950/80 via-slate-900 to-amber-950/60 border-b border-rose-500/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 p-0.5 flex items-center justify-center shadow-lg shadow-rose-500/30">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-rose-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-bold bg-gradient-to-r from-rose-300 via-amber-200 to-white bg-clip-text text-transparent">
                  TẠO ĐỀ TIẾNG VIỆT TIỂU HỌC PRO (TT 27/2020)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  KẾT NỐI TRI THỨC (LỚP 1-5)
                </span>
                {isProActive && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" /> PRO CHÍNH THỨC
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Tác giả Đinh Thành - ĐT: 0915.213717 • Hotline/Zalo: 0915.213717
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

        <ShareLinkBar title="Tạo đề Tiếng Việt Tiểu học (TT 27)" hash="#taode-tiengviet-tieuhoc" />

        {/* 3 TABS CHUẨN KIẾN TRÚC MODAL */}
        <div className="flex items-center gap-1 sm:gap-2 px-4 pt-3 border-b border-slate-800 bg-slate-950/60 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('online')}
            className={`py-2.5 px-4 rounded-t-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'online'
                ? 'bg-rose-600/20 text-rose-300 border-rose-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Sparkles className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>1. Trải Nghiệm Trực Tuyến</span>
            {!isProActive && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/30 text-rose-200 font-mono">
                {trialCount}/5 lượt
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('download')}
            className={`py-2.5 px-4 rounded-t-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'download'
                ? 'bg-blue-600/20 text-blue-300 border-blue-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>2. Tải Bản Máy Tính (.exe / .zip)</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`py-2.5 px-4 rounded-t-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'register'
                ? 'bg-amber-600/20 text-amber-300 border-amber-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>3. Bản Quyền &amp; Kích Hoạt</span>
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* ========================================================================= */}
          {/* TAB 1: TRẢI NGHIỆM TRỰC TUYẾN */}
          {/* ========================================================================= */}
          {activeTab === 'online' && (
            <div className="space-y-6">
              
              {/* THANH ĐIỀU KHIỂN TẠO ĐỀ */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-200">Sách giáo khoa:</span>
                    <span className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      📖 KẾT NỐI TRI THỨC VỚI CUỘC SỐNG
                    </span>
                  </div>

                  {/* Thanh Tiến trình 5 chấm dùng thử */}
                  {!isProActive && (
                    <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                      <span className="text-xs text-slate-400">Lượt dùng thử:</span>
                      <div className="flex items-center gap-1 text-xs">
                        {[1, 2, 3, 4, 5].map((idx) => (
                          <span key={idx} className={idx <= trialCount ? 'text-rose-400 font-bold' : 'text-slate-600'}>
                            {idx <= trialCount ? '●' : '○'}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs font-mono font-bold text-rose-300">({trialCount}/5)</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Khối lớp */}
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 font-bold">1. Chọn Khối lớp:</label>
                    <select
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs font-bold focus:border-rose-500 outline-none"
                    >
                      <option value={1}>Khối Lớp 1</option>
                      <option value={2}>Khối Lớp 2</option>
                      <option value={3}>Khối Lớp 3</option>
                      <option value={4}>Khối Lớp 4</option>
                      <option value={5}>Khối Lớp 5</option>
                    </select>
                  </div>

                  {/* Kỳ kiểm tra */}
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 font-bold">2. Kỳ kiểm tra:</label>
                    <select
                      value={selectedTerm}
                      onChange={(e) => setSelectedTerm(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs font-bold focus:border-rose-500 outline-none"
                    >
                      <option value="GK1">Giữa Học Kỳ 1 (GK1)</option>
                      <option value="CK1">Cuối Học Kỳ 1 (CK1)</option>
                      <option value="GK2">Giữa Học Kỳ 2 (GK2)</option>
                      <option value="CK2">Cuối Học Kỳ 2 (CK2)</option>
                    </select>
                  </div>

                  {/* Cơ quan quản lý */}
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 font-bold">3. Đơn vị cấp trên:</label>
                    <input
                      type="text"
                      value={schoolAgency}
                      onChange={(e) => setSchoolAgency(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:border-rose-500 outline-none"
                    />
                  </div>

                  {/* Trường học */}
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 font-bold">4. Tên Trường Tiểu học:</label>
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs focus:border-rose-500 outline-none"
                    />
                  </div>
                </div>

                {/* NÚT TẠO ĐỀ */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={handleGenerateExam}
                    disabled={!isProActive && trialCount <= 0}
                    className={`py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                      !isProActive && trialCount <= 0
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-rose-600/30'
                    }`}
                  >
                    <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
                    <span>TẠO ĐỀ TIẾNG VIỆT TIỂU HỌC TỰ ĐỘNG</span>
                    {!isProActive && <span className="text-xs font-mono">({trialCount}/5 lượt)</span>}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowAnswers(!showAnswers)}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center gap-1.5 transition"
                    >
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                      <span>{showAnswers ? 'Ẩn đáp án chuẩn' : 'Hiện đáp án chuẩn'}</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs flex items-center gap-1.5 transition"
                    >
                      <Printer className="w-4 h-4 text-amber-400" />
                      <span>In đề này</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* VÙNG XEM TRƯỚC SƯ PHẠM ĐỀ THI TIẾNG VIỆT TIỂU HỌC */}
              {generatedExam && (
                <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl font-serif text-[13pt] leading-relaxed border border-slate-300 overflow-x-auto space-y-6 animate-fadeIn">
                  
                  {/* GHI CHÚ BẢO HỘ PHÁP LÝ CHỮ NHỎ */}
                  <div className="text-[10px] text-slate-500 italic font-sans text-right border-b border-slate-200 pb-1">
                    * Công cụ hỗ trợ, tham khảo dành cho giáo viên.
                  </div>

                  {/* HEADER ĐỀ THI 2 DÒNG CHUẨN THÔNG TƯ 27 */}
                  <div className="flex justify-between items-start text-center text-[12pt] border-b-2 border-slate-800 pb-3">
                    <div className="text-center font-bold">
                      <p className="uppercase">{schoolAgency}</p>
                      <p className="uppercase font-extrabold text-blue-900">{schoolName}</p>
                    </div>
                    <div className="text-center font-bold">
                      <p className="uppercase">ĐỀ KIỂM TRA {generatedExam.termLabel.toUpperCase()}</p>
                      <p>NĂM HỌC 2026 - 2027</p>
                      <p className="text-[11pt] font-normal italic">Môn: Tiếng Việt - Khối Lớp {generatedExam.grade}</p>
                    </div>
                  </div>

                  {/* KHUNG ĐIỂM SỐ VÀ NHẬN XÉT CỦA GIÁO VIÊN (ĐÓNG KHUNG VIỀN ĐEN 100%) */}
                  <table className="w-full border-collapse border border-slate-800 text-center text-[11pt] my-3">
                    <thead>
                      <tr className="bg-slate-100 font-bold border-b border-slate-800">
                        <td className="border border-slate-800 p-2 w-1/3">ĐIỂM ĐỌC</td>
                        <td className="border border-slate-800 p-2 w-1/3">ĐIỂM VIẾT</td>
                        <td className="border border-slate-800 p-2 w-1/3">ĐIỂM TỔNG CỘNG</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="h-14">
                        <td className="border border-slate-800 p-2 font-bold text-lg text-rose-700"></td>
                        <td className="border border-slate-800 p-2 font-bold text-lg text-rose-700"></td>
                        <td className="border border-slate-800 p-2 font-bold text-xl text-rose-700"></td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="border border-slate-800 p-2 text-left italic">
                          <strong>Nhận xét của giáo viên:</strong> ..........................................................................................................................................
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* A. PHẦN ĐỌC (5.0 ĐIỂM) */}
                  <div className="space-y-4">
                    <h3 className="font-bold uppercase text-[14pt] text-rose-900 border-b border-rose-300 pb-1">
                      A. PHẦN KIỂM TRA ĐỌC (5.0 ĐIỂM)
                    </h3>

                    {/* I. Đọc thành tiếng */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-[13pt]">I. Đọc thành tiếng &amp; Trả lời câu hỏi (3.0 điểm)</h4>
                      <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl space-y-1">
                        <p className="italic font-bold">1. Bài đọc: "{generatedExam.readingOral.passage}"</p>
                        <p><strong>2. Câu hỏi:</strong> {generatedExam.readingOral.question}</p>
                      </div>
                    </div>

                    {/* II. Đọc hiểu & Bài tập */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-[13pt]">II. Đọc hiểu &amp; Bài tập (7.0 điểm)</h4>
                      <div className="text-center font-bold">
                        <p className="text-[14pt] text-blue-900">{generatedExam.readingDoc.title}</p>
                      </div>
                      <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl italic leading-relaxed text-[12.5pt]">
                        "{generatedExam.readingDoc.passage}"
                      </div>

                      <p className="font-bold italic">Khoanh tròn vào chữ cái trước câu trả lời đúng hoặc thực hiện các yêu cầu:</p>

                      <div className="space-y-3">
                        {generatedExam.readingDoc.questions.map((q) => (
                          <div key={q.num} className="space-y-1">
                            <p>
                              <strong>Câu {q.num} ({q.level}):</strong> {q.stem}
                            </p>
                            {q.options && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-4 font-sans text-[12pt]">
                                {q.options.map((opt, oIdx) => (
                                  <div key={oIdx} className={showAnswers && opt === q.correctAnswer ? 'font-bold text-red-600' : ''}>
                                    {opt}
                                  </div>
                                ))}
                              </div>
                            )}
                            {showAnswers && !q.options && (
                              <div className="pl-4 text-red-600 font-bold text-[12pt]">
                                👉 Gợi ý đáp án: {q.correctAnswer}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* B. PHẦN VIẾT (5.0 ĐIỂM) */}
                  <div className="space-y-4 pt-4 border-t-2 border-slate-800">
                    <h3 className="font-bold uppercase text-[14pt] text-rose-900 border-b border-rose-300 pb-1">
                      B. PHẦN KIỂM TRA VIẾT (5.0 ĐIỂM)
                    </h3>

                    {/* I. Chính tả */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-[13pt]">I. Nghe - viết (2.0 điểm)</h4>
                      <p className="font-bold text-center text-blue-900">{generatedExam.dictationText.title}</p>
                      <p className="italic bg-slate-50 p-3 rounded-xl border border-slate-300">
                        "{generatedExam.dictationText.passage}"
                      </p>
                    </div>

                    {/* II. Tập làm văn / Viết đoạn văn + Ô LI TẬP VIẾT */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-[13pt]">II. Tập làm văn / Viết (3.0 điểm)</h4>
                      <p><strong>Đề bài:</strong> {generatedExam.writingTask.topic}</p>
                      {generatedExam.writingTask.guidelines.map((g, gIdx) => (
                        <p key={gIdx} className="text-[12pt] italic text-slate-700 pl-3">{g}</p>
                      ))}

                      {/* KHUNG Ô LI 4 DÒNG TẬP VIẾT CHUẨN TIỂU HỌC */}
                      <div className="mt-3 p-3 border-2 border-slate-400 bg-amber-50/30 rounded-xl space-y-2">
                        <p className="text-[10pt] font-sans font-bold text-slate-600 uppercase tracking-wider text-center">
                          ✍️ Khung ô li tập viết (Chuẩn 4 dòng kẻ tiểu học)
                        </p>
                        {[1, 2, 3, 4, 5, 6].map((lineNum) => (
                          <div key={lineNum} className="h-6 border-b border-dashed border-rose-300 flex items-center text-[10pt] font-mono text-slate-400 pl-2">
                            ........................................................................................................................................................................................................
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* BẢNG MA TRẬN ĐỀ KIỂM TRA 3 MỨC ĐỘ (ĐÓNG KHUNG VIỀN ĐEN 100%) */}
                  <div className="pt-6 border-t-2 border-slate-800 space-y-3 font-sans text-[11pt]">
                    <h4 className="font-bold uppercase text-[12pt] text-slate-800 text-center">
                      MA TRẬN ĐỀ KIỂM TRA TIẾNG VIỆT LỚP {generatedExam.grade} ({generatedExam.termLabel})
                    </h4>
                    <table className="w-full border-collapse border border-slate-800 text-center">
                      <thead>
                        <tr className="bg-slate-200 font-bold border-b border-slate-800">
                          <th className="border border-slate-800 p-2">Mạch kiến thức, kỹ năng</th>
                          <th className="border border-slate-800 p-2">Mức 1 (Nhận biết)</th>
                          <th className="border border-slate-800 p-2">Mức 2 (Thông hiểu)</th>
                          <th className="border border-slate-800 p-2">Mức 3 (Vận dụng)</th>
                          <th className="border border-slate-800 p-2">Tổng cộng</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-slate-800 p-2 text-left font-bold">1. Đọc hiểu văn bản</td>
                          <td className="border border-slate-800 p-2">2 câu TN (2.0đ)</td>
                          <td className="border border-slate-800 p-2">1 câu TL (1.0đ)</td>
                          <td className="border border-slate-800 p-2">1 câu TL (1.0đ)</td>
                          <td className="border border-slate-800 p-2 font-bold">4 câu (4.0đ)</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-800 p-2 text-left font-bold">2. Kiến thức tiếng Việt</td>
                          <td className="border border-slate-800 p-2">1 câu TN (1.0đ)</td>
                          <td className="border border-slate-800 p-2">1 câu TL (1.0đ)</td>
                          <td className="border border-slate-800 p-2">1 câu TL (1.0đ)</td>
                          <td className="border border-slate-800 p-2 font-bold">3 câu (3.0đ)</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-800 p-2 text-left font-bold">3. Viết chính tả &amp; TLV</td>
                          <td className="border border-slate-800 p-2">Chính tả (2.0đ)</td>
                          <td className="border border-slate-800 p-2">-</td>
                          <td className="border border-slate-800 p-2">Viết đoạn văn (1.0đ)</td>
                          <td className="border border-slate-800 p-2 font-bold">3.0 điểm</td>
                        </tr>
                        <tr className="bg-amber-100 font-bold">
                          <td className="border border-slate-800 p-2 text-left">Tổng cộng điểm</td>
                          <td className="border border-slate-800 p-2">5.0 điểm (50%)</td>
                          <td className="border border-slate-800 p-2">2.0 điểm (20%)</td>
                          <td className="border border-slate-800 p-2">3.0 điểm (30%)</td>
                          <td className="border border-slate-800 p-2 text-rose-700">10.0 điểm (100%)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: TẢI VỀ & HƯỚNG DẪN */}
          {/* ========================================================================= */}
          {activeTab === 'download' && (
            <div className="space-y-6">
              
              {/* TRÌNH PHÁT VIDEO HƯỚNG DẪN trực tiếp */}
              <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 shadow-xl">
                <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
                  <video
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                    poster="/taode_tiengviet_tieuhoc.jpg"
                  >
                    <source src="/HD_Tao_De_Tieng_Viet_Tieu_Hoc.mp4" type="video/mp4" />
                    Trình duyệt không hỗ trợ xem video MP4.
                  </video>
                </div>
                <div className="p-3 bg-slate-900 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-rose-400" />
                    <span>Video Hướng dẫn cài đặt &amp; sử dụng Phần mềm Tạo Đề Tiếng Việt Tiểu Học</span>
                  </div>
                  <a
                    href="/HD_Tao_De_Tieng_Viet_Tieu_Hoc.mp4"
                    download="Huong_Dan_Tao_De_Tieng_Viet_Tieu_Hoc.mp4"
                    className="text-rose-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <Download className="w-3.5 h-3.5" /> Tải video MP4
                  </a>
                </div>
              </div>

              {/* KHỐI TẢI BỘ CÀI ĐẶT DESKTOP .EXE VÀ .ZIP */}
              <div className="p-6 rounded-2xl bg-slate-900 border-2 border-rose-500/50 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>Phần Mềm Tạo Đề Tiếng Việt Tiểu Học Pro</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        v3.0 (Mới nhất)
                      </span>
                    </h3>
                    <p className="text-xs text-amber-300 font-medium mt-1">
                      Cập nhật: <strong>10/10/2026</strong> • Chuẩn Bộ GD&amp;ĐT Thông tư 27/2020/TT-BGDĐT
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    Dung lượng: ~74 MB
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href="/Cai_Dat_TaoDe_TiengViet_TieuHoc.exe"
                    download="Cai_Dat_TaoDe_TiengViet_TieuHoc.exe"
                    className="py-3.5 px-5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all text-center cursor-pointer"
                  >
                    <Download className="w-5 h-5" />
                    <span>TẢI BỘ CÀI BẢN .EXE (DUY NHẤT)</span>
                  </a>

                  <a
                    href="/Cai_Dat_TaoDe_TiengViet_TieuHoc_Pass_123.zip"
                    download="Cai_Dat_TaoDe_TiengViet_TieuHoc_Pass_123.zip"
                    className="py-3.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all text-center cursor-pointer"
                  >
                    <Download className="w-5 h-5" />
                    <span>TẢI BẢN NÉN .ZIP (Pass: 123)</span>
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 text-center text-xs text-slate-300 space-y-1 border border-slate-800">
                  <p>🔑 Mật khẩu giải nén bản .ZIP: <code className="text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded">123</code></p>
                  <p className="text-[11px] text-slate-400">Tương thích Windows 10/11 &amp; Microsoft Word 2016-2024</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: BẢN QUYỀN & KÍCH HOẠT */}
          {/* ========================================================================= */}
          {activeTab === 'register' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              
              {/* THÔNG TIN TÁC GIẢ THẦY ĐINH THÀNH */}
              <div className="p-4 rounded-2xl bg-[#17143A] border-2 border-indigo-500/60 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 bg-indigo-950 flex items-center justify-center shadow-md">
                    <img
                      src="/dinhvanthanh.jpg"
                      alt="Tác giả Đinh Thành"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <User className="w-7 h-7 text-amber-400" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wide">
                      TÁC GIẢ &amp; BẢN QUYỀN: TÁC GIẢ ĐINH THÀNH - ĐT: 0915.213717
                    </h4>
                    <p className="text-xs text-slate-200">
                      • Đơn vị: <strong>Trường THCS Đồng Yên</strong> &nbsp;|&nbsp; • Hotline / Zalo: <strong>0915.213717</strong>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      • Phần mềm: <strong>TẠO ĐỀ TIẾNG VIỆT TIỂU HỌC PRO (LỚP 1-5)</strong>
                    </p>
                    <p className="text-[10px] text-slate-400 italic mt-0.5">
                      * Công cụ hỗ trợ, tham khảo dành cho giáo viên.
                    </p>
                  </div>
                </div>
              </div>

              {/* KHỐI HIỂN THỊ MÃ MÁY & KÍCH HOẠT PRO */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-cyan-400" />
                  <span>1. MÃ MÁY TÍNH HARDWARE CODE CỦA BẠN:</span>
                </h4>

                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 font-mono text-base font-bold text-cyan-300 text-center tracking-widest">
                    {detectedMid || 'Đang nhận diện mã máy...'}
                  </div>
                  <button
                    onClick={handleCopyMid}
                    className="py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedMid ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedMid ? 'Đã sao chép' : 'Sao chép'}</span>
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-400" />
                    <span>2. NHẬP MÃ BẢN QUYỀN KÍCH HOẠT PRO:</span>
                  </h4>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={inputKey}
                      onChange={(e) => setInputKey(e.target.value)}
                      placeholder="Dán mã bản quyền KEY-TVTH-... vào đây"
                      className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 font-mono text-sm focus:border-amber-500 outline-none"
                    />
                    <button
                      onClick={handleActivate}
                      className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-sm shadow-lg shadow-amber-600/30 transition cursor-pointer whitespace-nowrap"
                    >
                      KÍCH HOẠT PRO
                    </button>
                  </div>

                  {verifyResult && (
                    <div className={`p-3 rounded-xl text-xs font-bold ${verifyResult.isValid ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300' : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'}`}>
                      {verifyResult.message}
                    </div>
                  )}
                </div>
              </div>

              {/* BẢNG TƯ VẤN BÁO GIÁ ƯU ĐÃI SƯ PHẠM VÀ LIÊN HỆ ZALO THẦY THÀNH */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 border border-amber-500/30 space-y-3 text-center">
                <h4 className="font-bold text-base text-amber-300">
                  NHẬN BÁO GIÁ ƯU ĐÃI SƯ PHẠM &amp; KÍCH HOẠT QUA ZALO
                </h4>
                <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                  Liên hệ Admin Thầy Thành để nhận tư vấn, báo giá ưu đãi sư phạm phù hợp các gói 1 Năm, 2 Năm hoặc VIP Trọn Đời qua Zalo:
                </p>

                <a
                  href={`https://zalo.me/0915213717?text=${encodeURIComponent(
                    `KÍNH GỬI ADMIN THẦY THÀNH - ĐĂNG KÝ BẢN QUYỀN PHẦN MỀM TẠO ĐỀ TIẾNG VIỆT TIỂU HỌC PRO\n` +
                    `----------------------------------------\n` +
                    `• Họ tên GV: ${regName || 'Giáo viên Tiểu học'}\n` +
                    `• Mã máy (ID): ${detectedMid}\n` +
                    `----------------------------------------\n` +
                    `Kính nhờ Thầy tư vấn báo giá ưu đãi sư phạm và kích hoạt bản quyền giúp em!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-[#0068FF] hover:bg-blue-600 text-white font-extrabold text-sm shadow-lg shadow-blue-500/30 transition cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>LIÊN HỆ THẦY THÀNH QUA ZALO (0915.213717)</span>
                </a>
              </div>

            </div>
          )}

        </div>

        {/* FOOTER MODAL */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span>© 2026 Bản quyền thuộc <strong>Tác giả Đinh Thành - ĐT: 0915.213717</strong></span>
          </div>
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="text-[11px] text-slate-500 hover:text-slate-300 transition cursor-pointer"
            >
              Quản trị Admin ↗
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
