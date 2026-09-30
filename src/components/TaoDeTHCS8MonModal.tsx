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
  Send,
  Layers,
  ArrowRight
} from 'lucide-react';
import { BRAND, EXAM_7MON_RESOURCES } from '../config/brand';
import { cloudSyncService } from '../services/cloudSyncService';

interface TaoDeTHCS8MonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
  selectedSubject?: string;
  initialSubject?: string;
  onSwitchToEnglish?: () => void;
}

export const TaoDeTHCS8MonModal: React.FC<TaoDeTHCS8MonModalProps> = ({
  isOpen,
  onClose,
  onOpenAdmin,
  selectedSubject,
  initialSubject,
  onSwitchToEnglish
}) => {
  const activeSubject = selectedSubject || initialSubject || 'ALL';
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

  // Ánh xạ môn ban đầu khi mở modal
  useEffect(() => {
    if (!isOpen) return;

    if (activeSubject === 'TOAN') setRegSubject('Toán');
    else if (activeSubject === 'VAN') setRegSubject('Ngữ văn');
    else if (activeSubject === 'KHTN') setRegSubject('Khoa học tự nhiên');
    else if (activeSubject === 'SUDIA') setRegSubject('Lịch sử và Địa lí');
    else if (activeSubject === 'GDCD') setRegSubject('Giáo dục công dân');
    else if (activeSubject === 'TIN') setRegSubject('Tin học');
    else if (activeSubject === 'CN') setRegSubject('Công nghệ');

    let mid = localStorage.getItem('gvai_8mon_hw_code');
    if (!mid) {
      const randPart = Math.random().toString(36).substring(2, 6).toUpperCase();
      const randPart2 = Math.random().toString(36).substring(2, 6).toUpperCase();
      mid = `EXAM-DVT-${randPart}-${randPart2}-7MON`;
      localStorage.setItem('gvai_8mon_hw_code', mid);
    }
    setDetectedMid(mid);

    const savedPro = localStorage.getItem('gvai_8mon_is_pro');
    if (savedPro === 'true') {
      setIsProActive(true);
    }
  }, [isOpen, activeSubject]);

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
    if (inputKey.trim().startsWith('KEY-') || inputKey.trim().length > 15) {
      setIsProActive(true);
      localStorage.setItem('gvai_8mon_is_pro', 'true');
      setVerifyMsg('🎉 Kích hoạt Bản quyền Pro thành công! Thầy/Cô có thể sử dụng tất cả các ứng dụng tạo đề.');
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
      appId: 'exam-7mon',
      appName: `Tạo Đề Kiểm Tra 7 Môn THCS (${regSubject})`,
      createdAt: new Date().toLocaleString('vi-VN')
    };

    try {
      await cloudSyncService.submitRegistrationToCloud({
        machineId: detectedMid,
        fullName: regName.trim(),
        phoneNumber: regPhone.trim(),
        schoolUnit: `${regSchool.trim() || 'Trường THCS'} (Môn: ${regSubject})`,
        appId: 'exam-7mon',
        appName: `Tạo Đề Kiểm Tra 7 Môn THCS (${regSubject})`,
        packageType: '1YEAR'
      });
    } catch (e) {
      console.log('Issue error:', e);
    }

    const zaloMsg = `KÍNH GỬI THẦY ĐINH VĂN THÀNH - ĐĂNG KÝ BẢN QUYỀN TẠO ĐỀ THCS (CV 7991)
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

  const subjectList = [
    { key: 'TOAN', name: 'Môn Toán học', size: '127 MB', icon: '📐', desc: 'Ma trận, bản đặc tả & đề thi kèm công thức MathType chuẩn đẹp 100%.', cfg: EXAM_7MON_RESOURCES.subjects.TOAN },
    { key: 'VAN', name: 'Môn Ngữ văn', size: '34 MB', icon: '📖', desc: 'Đọc hiểu ngữ liệu ngoài SGK (6.0đ) & Viết (4.0đ) chuẩn CV 7991.', cfg: EXAM_7MON_RESOURCES.subjects.VAN },
    { key: 'KHTN', name: 'Khoa học tự nhiên', size: '34 MB', icon: '🔬', desc: 'Tích hợp 3 phân môn Vật lí, Hóa học, Sinh học chuẩn CTGDPT 2018.', cfg: EXAM_7MON_RESOURCES.subjects.KHTN },
    { key: 'SUDIA', name: 'Lịch sử & Địa lí', size: '34 MB', icon: '🌍', desc: 'Cân đối chuẩn 50% Lịch sử - 50% Địa lí trắc nghiệm và tự luận tình huống.', cfg: EXAM_7MON_RESOURCES.subjects.SUDIA },
    { key: 'GDCD', name: 'Giáo dục công dân', size: '34 MB', icon: '⚖️', desc: 'Nhận biết chuẩn mực đạo đức (4.0đ) và Tình huống pháp luật (6.0đ).', cfg: EXAM_7MON_RESOURCES.subjects.GDCD },
    { key: 'TIN', name: 'Môn Tin học', size: '34 MB', icon: '💻', desc: 'Lý thuyết số học, bài tập thực hành bảng tính Excel và Python.', cfg: EXAM_7MON_RESOURCES.subjects.TIN },
    { key: 'CN', name: 'Môn Công nghệ', size: '34 MB', icon: '⚙️', desc: 'Nông nghiệp, cơ khí chế tạo và mạch điện ứng dụng thực tế CT 2018.', cfg: EXAM_7MON_RESOURCES.subjects.CN },
  ];

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
                  HỆ THỐNG PHẦN MỀM TẠO ĐỀ KIỂM TRA THCS (7 BỘ MÔN)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  7 App Độc Lập
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Toán, Văn, KHTN, Sử - Địa, GDCD, Tin học, Công nghệ • Tác giả: Thầy Đinh Văn Thành (<span className="text-emerald-400 font-bold">0915.213717</span>)
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
              📥 TẢI APP THEO TỪNG BỘ MÔN
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
                ⏳ Bản dùng thử (7 Môn)
              </span>
            )}
          </div>
        </div>

        {/* NỘI DUNG 2 TABS */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
          
          {/* TAB 1: TẢI VỀ */}
          {activeTab === 'download' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              
              {/* THÔNG BÁO TIẾNG ANH ĐÃ CÓ APP RIÊNG */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇬🇧</span>
                  <div>
                    <h5 className="text-xs font-bold text-white">Thầy/Cô dạy môn Tiếng Anh Global Success?</h5>
                    <p className="text-[11px] text-slate-300">
                      Môn Tiếng Anh đã được tách thành ứng dụng độc lập chuyên biệt riêng (tự động tạo Audio Script, đề nghe MP3).
                    </p>
                  </div>
                </div>
                {onSwitchToEnglish && (
                  <button
                    onClick={() => {
                      onClose();
                      onSwitchToEnglish();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center gap-1.5 shrink-0 transition"
                  >
                    Mở App Tiếng Anh <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* PHẦN 1: DANH SÁCH 7 APP ĐỘC LẬP TỪNG BỘ MÔN */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    TẢI BỘ CÀI ĐẶT ĐỘC LẬP CHO TỪNG BỘ MÔN (PASS GIẢI NÉN: 123)
                  </h4>
                  <span className="text-[11px] text-slate-400">Chọn đúng môn để tải về</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {subjectList.map((sub) => {
                    const isSelected = activeSubject === sub.key;
                    return (
                      <div
                        key={sub.key}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-blue-950/40 border-cyan-400 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400'
                            : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <span className="text-2xl shrink-0 p-1.5 rounded-xl bg-slate-900 border border-slate-700/60">{sub.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-bold text-white truncate">{sub.name}</h5>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-700/60">{sub.size}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{sub.desc}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
                          <a
                            href={sub.cfg?.zipUrl}
                            download
                            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                              isSelected
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md'
                                : 'bg-slate-700/80 hover:bg-slate-700 text-slate-200'
                            }`}
                          >
                            <Download className="w-3.5 h-3.5" />
                            Tải .ZIP (Pass 123)
                          </a>
                          <a
                            href={sub.cfg?.exeUrl}
                            download
                            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center transition"
                            title="Tải trực tiếp file .EXE"
                          >
                            .EXE
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PHẦN 2: TRỌN BỘ TỔNG HỢP 7 MÔN (HUB ĐIỀU HÀNH) */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-white text-xs sm:text-sm">Trọn Bộ Hub Tổng Hợp 7 Môn THCS</h5>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300">Dành cho Nhà trường / Tổ CM</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Giao diện trung tâm điều hành mở nhanh cả 7 bộ môn trong cùng một bảng điều khiển duy nhất.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <a
                    href={EXAM_7MON_RESOURCES.fullZipUrl}
                    download
                    className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/30"
                  >
                    <Download className="w-4 h-4" />
                    Tải Hub 7 Môn (.ZIP)
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
                    <h5 className="font-bold text-white text-xs">Video Hướng Dẫn Ra Đề & Sử Dụng Phần Mềm</h5>
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
                    Đăng Ký Bản Quyền Tạo Đề THCS (Admin: 0915.213717)
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Kích hoạt nhanh chóng, hỗ trợ đầy đủ từng bộ môn cấp THCS theo Công văn 7991.
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
                      <option value="Toán">Môn Toán</option>
                      <option value="Ngữ văn">Môn Ngữ văn</option>
                      <option value="Khoa học tự nhiên">Môn Khoa học tự nhiên</option>
                      <option value="Lịch sử và Địa lí">Môn Lịch sử và Địa lí</option>
                      <option value="Giáo dục công dân">Môn Giáo dục công dân</option>
                      <option value="Tin học">Môn Tin học</option>
                      <option value="Công nghệ">Môn Công nghệ</option>
                      <option value="Trọn bộ 7 môn THCS">Trọn bộ 7 môn THCS</option>
                    </select>
                  </div>
                </div>

                {/* MÃ MÁY TÍNH */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Laptop className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Mã máy tính của bạn:</span>
                      <span className="text-xs font-mono font-bold text-cyan-300">{detectedMid}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyMid}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold flex items-center gap-1 transition"
                  >
                    {copiedMid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedMid ? 'Đã chép' : 'Sao chép'}
                  </button>
                </div>

                <button
                  onClick={handleSendRegistration}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  GỬI YÊU CẦU ĐĂNG KÝ BẢN QUYỀN QUA ZALO THẦY THÀNH
                </button>

                {regSent && (
                  <p className="text-[11px] text-center text-emerald-400 font-medium">
                    ✓ Đã sao chép thông tin đăng ký vào bộ nhớ tạm và mở Zalo Thầy Đinh Văn Thành!
                  </p>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
