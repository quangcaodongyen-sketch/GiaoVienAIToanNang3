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
  Send
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
  // 2 Tabs chuẩn mực: 'download' | 'register' (Đã loại bỏ phiên bản dùng thử web rườm rà)
  const [activeTab, setActiveTab] = useState<'download' | 'register'>('download');

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
    if (savedPro === 'true') {
      setIsProActive(true);
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

    // Đẩy đăng ký lên Cloud qua cloudSyncService an toàn
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

    // Soạn tin nhắn Zalo gửi Thầy Thành
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
                  TẠO ĐỀ TIẾNG ANH (CV 7991)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  v3.2.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tác giả: <strong className="text-amber-300">Thầy giáo Đinh Văn Thành</strong> • Hotline / Zalo: <span className="text-emerald-400 font-bold">0915.213717</span> • Chuẩn Công văn 7991/BGDĐT
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVIGATION TABS (2 TABS GỌN GÀNG) */}
        <div className="px-6 pt-3 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('download')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
                activeTab === 'download'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Download className="w-4 h-4" />
              TẢI BỘ CÀI ĐẶT
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition ${
                activeTab === 'register'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Crown className="w-4 h-4" />
              ĐĂNG KÝ BẢN QUYỀN
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-400">
            {isProActive ? (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Bản quyền Pro đã kích hoạt
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                ⏳ Bản dùng thử (5 lần)
              </span>
            )}
          </div>
        </div>

        {/* NỘI DUNG 2 TABS */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
          
          {/* ========================================================================= */}
          {/* TAB 1: TẢI VỀ & CÀI ĐẶT (ĐƠN GIẢN, VIẾT ÍT CHỮ, DỄ HIỂU) */}
          {/* ========================================================================= */}
          {activeTab === 'download' && (
            <div className="space-y-5 max-w-3xl mx-auto">
              
              {/* BANNER TÍNH NĂNG NỔI BẬT */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Chuẩn CV 7991</h5>
                    <p className="text-[11px] text-slate-400">Đủ Ma trận & Đặc tả Lớp 6, 7, 8, 9</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Xuất Audio Nghe</h5>
                    <p className="text-[11px] text-slate-400">Tự động xuất file nghe MP3 chuẩn</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Đề Cương & Đáp Án</h5>
                    <p className="text-[11px] text-slate-400">Xuất Word đẹp, bảo toàn 100%</p>
                  </div>
                </div>
              </div>

              {/* KHUNG TẢI VỀ 3 PHƯƠNG ÁN (CHUẨN CHỐNG CHẶN VIRUS) */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Download className="w-4 h-4 text-blue-400" />
                    LỰA CHỌN GÓI CÀI ĐẶT PHÙ HỢP VỚI MÁY TÍNH CỦA THẦY/CÔ
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium">Hỗ trợ Word 2013, 2016, 2019, 2021, Office 365</span>
                </div>

                {/* PHƯƠNG ÁN 1: BẢN ZIP AN TOÀN (KHUYÊN DÙNG) */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-950 border-2 border-emerald-500/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950 uppercase tracking-wide">
                        ⭐ Khuyên Dùng
                      </span>
                      <span className="text-sm font-bold text-white">Bản ZIP An Toàn (Mật khẩu: 123)</span>
                    </div>
                    <p className="text-xs text-emerald-300/80">
                      Trình duyệt và diệt virus không quét nhầm, tải về giải nén bằng mật khẩu <strong>123</strong> là chạy vĩnh viễn 100%.
                    </p>
                  </div>
                  <a
                    href={EXAM_RESOURCES.fullZipUrl || "/Tao_De_Tieng_Anh_THCS_Pass_123.zip"}
                    className="w-full sm:w-auto py-3 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition whitespace-nowrap shadow-lg shadow-emerald-500/30 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    TẢI BẢN ZIP (PASS: 123)
                  </a>
                </div>

                {/* PHƯƠNG ÁN 2: BẢN .EXE CÀI TỰ ĐỘNG */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-xs font-bold text-white">Bản Cài Đặt Tự Động (.exe trực tiếp)</span>
                    <p className="text-[11px] text-slate-400">
                      Nhấp đúp là tự cài thanh công cụ vào Word và màn hình Desktop.
                    </p>
                  </div>
                  <a
                    href={EXAM_RESOURCES.exeWordUrl || "/Cai_Dat_Chay_Tren_Word.exe"}
                    className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition whitespace-nowrap cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Tải File .EXE Cài Đặt
                  </a>
                </div>

                {/* PHƯƠNG ÁN 3: FILE WORD .DOTM SIÊU NHẸ */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-xs font-bold text-white">File Ribbon Word Trực Tiếp (.dotm - 50 KB)</span>
                    <p className="text-[11px] text-slate-400">
                      Tải trong 1 giây, mở trực tiếp bằng Microsoft Word là dùng ngay.
                    </p>
                  </div>
                  <a
                    href="/TaoDe_TiengAnh_THCS.dotm"
                    className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition whitespace-nowrap cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Tải File Word .dotm (50 KB)
                  </a>
                </div>
              </div>

              {/* VIDEO HƯỚNG DẪN SỬ DỤNG 3 PHÚT */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Play className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">Video Hướng Dẫn Sử Dụng Nhanh</h5>
                    <p className="text-[11px] text-slate-400">Xem cách tạo đề kiểm tra và xuất file nghe chỉ trong 3 phút</p>
                  </div>
                </div>
                <a
                  href={EXAM_RESOURCES.videoDirectUrl || "/HD_Tao_De_Tieng_Anh_THCS.mp4"}
                  target="_blank"
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Xem Video
                </a>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: ĐĂNG KÝ BẢN QUYỀN (GỌN GÀNG, KHÔNG LỘ GIÁ TIỀN) */}
          {/* ========================================================================= */}
          {activeTab === 'register' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              
              {/* KHUNG DÁN MÃ KÍCH HOẠT */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/40 border border-amber-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-400" />
                    Nếu đã có Mã kích hoạt do Thầy Thành cấp, dán vào đây:
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="Dán mã kích hoạt tại đây (KEY-YYYYMMDD-...)"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={handleActivateKey}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 font-black text-xs transition cursor-pointer whitespace-nowrap"
                  >
                    KÍCH HOẠT NGAY
                  </button>
                </div>
                {verifyResult && (
                  <p className={`text-xs font-medium ${verifyResult.isValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {verifyResult.message}
                  </p>
                )}
              </div>

              {/* KHUNG ĐĂNG KÝ THÔNG TIN GIÁO VIÊN */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5">
                <div className="border-b border-slate-800 pb-2.5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    Đăng Ký Bản Quyền Chính Thức (Kết nối Thầy Đinh Văn Thành)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Hệ thống tự động kích hoạt trực tuyến siêu tốc, hỗ trợ trọn đời toàn bộ các khối 6, 7, 8, 9.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Họ và tên Giáo viên (*):</label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Văn A"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Số điện thoại / Zalo (*):</label>
                    <input
                      type="text"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="Ví dụ: 0915.213717"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Trường / Đơn vị công tác:</label>
                  <input
                    type="text"
                    value={regSchool}
                    onChange={(e) => setRegSchool(e.target.value)}
                    placeholder="Ví dụ: Trường THCS Đồng Yên"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Mã máy tính (Tự động nhận diện):</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={detectedMid}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-blue-400 font-mono text-xs focus:outline-none"
                    />
                    <button
                      onClick={handleCopyMid}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      {copiedMid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedMid ? 'Đã chép' : 'Chép ID'}
                    </button>
                  </div>
                </div>

                {/* NÚT GỬI ĐĂNG KÝ CHO ADMIN */}
                <div className="pt-2">
                  <button
                    onClick={handleSendRegistration}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/30 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    GỬI THÔNG TIN CHO ADMIN THẦY THÀNH (ZALO: 0915.213717)
                  </button>
                  {regSent && (
                    <p className="text-center text-xs text-emerald-400 font-medium mt-2">
                      ✔ Đã gửi đơn đăng ký và mở Zalo Thầy Đinh Văn Thành. Thầy/Cô chỉ cần bấm Dán (Ctrl + V) và Gửi để Thầy duyệt ngay!
                    </p>
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
