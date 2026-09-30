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
  BookOpen,
  MessageCircle,
  FileText,
  Laptop,
  ShieldCheck,
  User,
  Send
} from 'lucide-react';
import { BRAND, EXAM_8MON_RESOURCES } from '../config/brand';
import { cloudSyncService } from '../services/cloudSyncService';

interface TaoDeTHCS8MonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

export const TaoDeTHCS8MonModal: React.FC<TaoDeTHCS8MonModalProps> = ({ isOpen, onClose, onOpenAdmin }) => {
  const [activeTab, setActiveTab] = useState<'download' | 'register'>('download');

  const [detectedMid, setDetectedMid] = useState<string>('');
  const [isProActive, setIsProActive] = useState<boolean>(false);
  const [inputKey, setInputKey] = useState<string>('');
  const [copiedMid, setCopiedMid] = useState<boolean>(false);
  const [verifyMsg, setVerifyMsg] = useState<string>('');

  const [regName, setRegName] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regSchool, setRegSchool] = useState<string>('');
  const [regSubject, setRegSubject] = useState<string>('Toán');
  const [regSent, setRegSent] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    let mid = localStorage.getItem('gvai_8mon_hw_code');
    if (!mid) {
      const randPart = Math.random().toString(36).substring(2, 6).toUpperCase();
      const randPart2 = Math.random().toString(36).substring(2, 6).toUpperCase();
      mid = `EXAM-DVT-${randPart}-${randPart2}-8MON`;
      localStorage.setItem('gvai_8mon_hw_code', mid);
    }
    setDetectedMid(mid);

    const savedPro = localStorage.getItem('gvai_8mon_is_pro');
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

  const handleActivateKey = () => {
    if (!inputKey.trim()) {
      setVerifyMsg('Vui lòng dán Mã kích hoạt do Thầy Thành cấp!');
      return;
    }
    if (inputKey.trim().startsWith('KEY-') || inputKey.trim().length > 20) {
      setIsProActive(true);
      localStorage.setItem('gvai_8mon_is_pro', 'true');
      setVerifyMsg('🎉 Kích hoạt Bản quyền Pro thành công! Thầy/Cô có thể sử dụng tất cả 8 môn học.');
    } else {
      setVerifyMsg('Mã kích hoạt không đúng định dạng. Vui lòng kiểm tra lại!');
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
      subject: regSubject,
      machineId: detectedMid,
      appId: 'exam-8mon',
      appName: 'Trung Tâm Tạo Đề Kiểm Tra 8 Môn THCS (CV 7991)',
      createdAt: new Date().toLocaleString('vi-VN')
    };

    try {
      await cloudSyncService.submitRegistrationToCloud({
        machineId: detectedMid,
        fullName: regName.trim(),
        phoneNumber: regPhone.trim(),
        schoolUnit: `${regSchool.trim() || 'Trường THCS'} (Môn: ${regSubject})`,
        appId: 'exam-8mon',
        appName: `Tạo Đề Kiểm Tra 8 Môn THCS (${regSubject})`,
        packageType: '1YEAR'
      });
    } catch (e) {
      console.log('Issue error:', e);
    }

    const zaloMsg = `KÍNH GỬI THẦY ĐINH VĂN THÀNH - ĐĂNG KÝ BẢN QUYỀN TẠO ĐỀ 8 MÔN THCS (CV 7991)
----------------------------------------
• Họ và tên: ${regData.fullName}
• Điện thoại / Zalo: ${regData.phoneNumber}
• Đơn vị: ${regData.schoolUnit}
• Môn phụ trách: ${regData.subject}
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
        <div className="px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-blue-950/50 to-slate-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center text-white">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  TRUNG TÂM TẠO ĐỀ KIỂM TRA 8 BỘ MÔN THCS (CV 7991)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  Hub 8 Môn
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Toán, Văn, KHTN, Lịch sử - Địa lí, GDCD, Tin học, Công nghệ, Tiếng Anh • Thầy giáo Đinh Văn Thành (<span className="text-emerald-400 font-bold">0915.213717</span>)
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

        {/* NAVIGATION TABS */}
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
              📥 TẢI VỀ & CÀI ĐẶT
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
              🔑 ĐĂNG KÝ BẢN QUYỀN
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-400">
            {isProActive ? (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Bản quyền Pro đã kích hoạt
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                ⏳ Bản dùng thử (8 Môn)
              </span>
            )}
          </div>
        </div>

        {/* NỘI DUNG 2 TABS */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
          
          {/* TAB 1: TẢI VỀ */}
          {activeTab === 'download' && (
            <div className="space-y-5 max-w-3xl mx-auto">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Trọn Vẹn 8 Bộ Môn</h5>
                    <p className="text-[11px] text-slate-400">Toán, Văn, KHTN, Sử Địa, Anh...</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Chuẩn Ma Trận CV 7991</h5>
                    <p className="text-[11px] text-slate-400">Bản đặc tả câu hỏi 4 mức độ</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Bảo Toàn Công Thức</h5>
                    <p className="text-[11px] text-slate-400">Giữ nguyên 100% Math Type, hình vẽ</p>
                  </div>
                </div>
              </div>

              {/* 3 PHƯƠNG ÁN TẢI CHUẨN */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Download className="w-4 h-4 text-blue-400" />
                    LỰA CHỌN GÓI CÀI ĐẶT TRUNG TÂM TẠO ĐỀ 8 MÔN THCS
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium">Bản quyền Thầy Đinh Văn Thành</span>
                </div>

                {/* PHƯƠNG ÁN 1: BẢN ZIP AN TOÀN */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-950 border-2 border-emerald-500/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950 uppercase tracking-wide">
                        ⭐ Khuyên Dùng
                      </span>
                      <span className="text-sm font-bold text-white">Bản ZIP An Toàn 8 Môn (Mật khẩu: 123)</span>
                    </div>
                    <p className="text-xs text-emerald-300/80">
                      Tải về giải nén bằng mật khẩu <strong>123</strong>, không bị trình duyệt hay Windows Defender chặn quét nhầm.
                    </p>
                  </div>
                  <a
                    href={EXAM_8MON_RESOURCES.fullZipUrl || "/Trung_Tam_Tao_De_THCS_Pass_123.zip"}
                    className="w-full sm:w-auto py-3 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition whitespace-nowrap shadow-lg shadow-emerald-500/30 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    TẢI BẢN ZIP (PASS: 123)
                  </a>
                </div>

                {/* PHƯƠNG ÁN 2: BẢN .EXE */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-xs font-bold text-white">Bản Cài Đặt Tự Động (.exe trực tiếp)</span>
                    <p className="text-[11px] text-slate-400">
                      Cài đặt trọn bộ công cụ tạo đề 8 bộ môn THCS lên máy tính.
                    </p>
                  </div>
                  <a
                    href={EXAM_8MON_RESOURCES.exeUrl || "/Trung_Tam_Tao_De_THCS.exe"}
                    className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition whitespace-nowrap cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Tải File .EXE Cài Đặt
                  </a>
                </div>
              </div>

              {/* VIDEO HƯỚNG DẪN */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Play className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">Video Hướng Dẫn Ra Đề 8 Bộ Môn</h5>
                    <p className="text-[11px] text-slate-400">Xem quy trình ra đề kiểm tra định kỳ chuẩn mẫu Công văn 7991</p>
                  </div>
                </div>
                <a
                  href="/HD_Tao_De_Tieng_Anh_THCS.mp4"
                  target="_blank"
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Xem Video
                </a>
              </div>

            </div>
          )}

          {/* TAB 2: ĐĂNG KÝ BẢN QUYỀN */}
          {activeTab === 'register' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/40 border border-amber-500/40 space-y-3">
                <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-400" />
                  Nếu đã có Mã kích hoạt do Thầy Thành cấp, dán vào đây:
                </span>
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
                {verifyMsg && <p className="text-xs font-medium text-emerald-400">{verifyMsg}</p>}
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5">
                <div className="border-b border-slate-800 pb-2.5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    Đăng Ký Bản Quyền Trung Tâm Tạo Đề 8 Môn (Admin: 0915.213717)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Kích hoạt nhanh chóng, hỗ trợ đầy đủ 8 bộ môn cấp THCS theo Công văn 7991.
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Trường / Đơn vị:</label>
                    <input
                      type="text"
                      value={regSchool}
                      onChange={(e) => setRegSchool(e.target.value)}
                      placeholder="Ví dụ: Trường THCS Đồng Yên"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Bộ môn giảng dạy:</label>
                    <select
                      value={regSubject}
                      onChange={(e) => setRegSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="Toán">Toán</option>
                      <option value="Ngữ văn">Ngữ văn</option>
                      <option value="Khoa học tự nhiên">Khoa học tự nhiên (Lý - Hóa - Sinh)</option>
                      <option value="Lịch sử và Địa lí">Lịch sử và Địa lí</option>
                      <option value="Tiếng Anh">Tiếng Anh</option>
                      <option value="Giáo dục công dân">Giáo dục công dân</option>
                      <option value="Tin học">Tin học</option>
                      <option value="Công nghệ">Công nghệ</option>
                    </select>
                  </div>
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
