import React, { useState, useEffect, useRef } from 'react';
import { 
  Crown, 
  X, 
  Play, 
  Square, 
  Volume2, 
  Download, 
  Sparkles, 
  MessageCircle, 
  Video, 
  FileText, 
  CheckCircle2, 
  Send,
  RotateCcw,
  Zap,
  Users,
  Bell
} from 'lucide-react';
import { BRAND } from '../config/brand';
import { licenseService } from '../services/licenseService';

interface OnlineTTSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_DIALOG = `Teacher: Good morning class! Welcome to our English listening practice.
Student A: Good morning teacher! What are we going to talk about today?
Teacher: Today we will learn about technology and how AI helps us study better.
Student B: That sounds very exciting! Can we start now?
Teacher: Yes, please open your books to page ten.`;

export const OnlineTTSModal: React.FC<OnlineTTSModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'online' | 'download' | 'register'>('online');

  // Online TTS States
  const [textInput, setTextInput] = useState(SAMPLE_DIALOG);
  const [voiceList, setVoiceList] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);
  const [rate, setRate] = useState<number>(1.0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Form Đăng ký bản quyền States
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regSchool, setRegSchool] = useState('');
  const [regMid, setRegMid] = useState('');
  const [regPackage, setRegPackage] = useState<'1YEAR' | '2YEAR' | 'LIFETIME'>('LIFETIME');
  const [regSuccess, setRegSuccess] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  // Kích hoạt Web Pro bằng mã máy
  const [activeMidInput, setActiveMidInput] = useState('');
  const [isProActivated, setIsProActivated] = useState(false);
  const [proTeacherName, setProTeacherName] = useState('');
  const [proMessage, setProMessage] = useState('');
  const [checkLoading, setCheckLoading] = useState(false);

  useEffect(() => {
    const savedMid = localStorage.getItem('gvai_web_pro_mid');
    if (savedMid) {
      licenseService.checkOnlineLicense(savedMid).then(res => {
        if (res.isValid && res.record) {
          setIsProActivated(true);
          setProTeacherName(res.record.teacher_name || 'Thầy/Cô');
        }
      });
    }
  }, []);

  const handleActivatePro = async () => {
    if (!activeMidInput.trim()) return;
    setCheckLoading(true);
    setProMessage('');
    try {
      const res = await licenseService.checkOnlineLicense(activeMidInput);
      setProMessage(res.message);
      if (res.isValid && res.record) {
        setIsProActivated(true);
        setProTeacherName(res.record.teacher_name || 'Thầy/Cô');
        localStorage.setItem('gvai_web_pro_mid', activeMidInput.trim().toUpperCase());
      }
    } finally {
      setCheckLoading(false);
    }
  };

  // Load giọng đọc trình duyệt
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        // Lọc ưu tiên các giọng tiếng Anh
        const englishVoices = voices.filter(v => v.lang.startsWith('en'));
        setVoiceList(englishVoices.length > 0 ? englishVoices : voices);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const handlePlayOnline = () => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn chưa hỗ trợ phát âm thanh trực tiếp.');
      return;
    }

    window.speechSynthesis.cancel();
    if (!textInput.trim()) return;

    // Loại bỏ tên nhân vật trước dấu 2 chấm nếu có để đọc tự nhiên
    const utterance = new SpeechSynthesisUtterance(textInput);
    if (voiceList[selectedVoiceIndex]) {
      utterance.voice = voiceList[selectedVoiceIndex];
    }
    utterance.rate = rate;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStopOnline = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regMid.trim() || !regPhone.trim()) {
      alert('Vui lòng nhập Mã máy và Số Zalo liên hệ.');
      return;
    }

    setRegLoading(true);
    try {
      await licenseService.register({
        machine_id: regMid.trim().toUpperCase(),
        teacher_name: regName.trim(),
        phone_zalo: regPhone.trim(),
        school_unit: regSchool.trim(),
        package_type: regPackage
      });
      setRegSuccess(true);
    } finally {
      setRegLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl relative my-auto border border-slate-100 max-h-[95vh] flex flex-col">
        {/* CLOSE BUTTON */}
        <button
          onClick={() => {
            handleStopOnline();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* HEADER */}
        <div className="flex items-start gap-4 pb-4 border-b border-slate-100 pr-10">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#123A63] via-[#1E40AF] to-[#2563EB] flex items-center justify-center text-amber-400 shadow-md shadow-blue-900/20 shrink-0">
            <Crown className="w-7 h-7" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              BẢN QUYỀN THƯƠNG MẠI PRO
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#123A63] tracking-tight">
              SMART LISTENING PRO
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Tạo bài nghe Tiếng Anh chuẩn Quốc tế – Tác giả: {BRAND.author}
            </p>
          </div>
        </div>

        {/* 3 TABS SWITCHER */}
        <div className="flex border-b border-slate-200 mt-4 mb-4 gap-2">
          <button
            onClick={() => {
              handleStopOnline();
              setActiveTab('online');
            }}
            className={`pb-2.5 px-3.5 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'online'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            Dùng Online Ngay
          </button>

          <button
            onClick={() => {
              handleStopOnline();
              setActiveTab('download');
            }}
            className={`pb-2.5 px-3.5 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'download'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-4 h-4 text-emerald-600" />
            Tải Bản Pro & Video HD
          </button>

          <button
            onClick={() => {
              handleStopOnline();
              setActiveTab('register');
            }}
            className={`pb-2.5 px-3.5 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'register'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 text-purple-600" />
            Đăng Ký Bản Quyền
          </button>
        </div>

        {/* TAB 1: DÙNG ONLINE NGAY */}
        {activeTab === 'online' && (
          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            {/* PRO ACTIVATION / STATUS BANNER */}
            {isProActivated ? (
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-blue-500/10 border border-amber-400/40 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      BẢN QUYỀN WEB PRO ĐÃ MỞ KHÓA
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Chủ sở hữu: <b>{proTeacherName}</b> – Không giới hạn độ dài & mở khóa toàn bộ tính năng
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem('gvai_web_pro_mid');
                    setIsProActivated(false);
                    setProMessage('');
                  }}
                  className="text-[10px] text-slate-400 hover:text-rose-500 underline"
                >
                  Đổi mã khác
                </button>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                  <div className="text-[11px] font-semibold text-amber-950 flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Đã mua bản quyền trên máy? Nhập mã để mở Web Pro:</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-1 max-w-xs">
                    <input
                      type="text"
                      placeholder="MB-XXXX-XXXX"
                      value={activeMidInput}
                      onChange={(e) => setActiveMidInput(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-amber-300 text-xs font-mono uppercase focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={handleActivatePro}
                      disabled={checkLoading}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs whitespace-nowrap transition-colors"
                    >
                      {checkLoading ? '...' : 'Mở Khóa'}
                    </button>
                  </div>
                </div>
                {proMessage && (
                  <p className={`text-xs px-2 ${isProActivated ? 'text-emerald-700 font-bold' : 'text-amber-800 font-medium'}`}>
                    {proMessage}
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Volume2 className="w-4 h-4 text-[#2563EB]" />
                Nhập văn bản hoặc lời thoại cần phát âm:
              </span>
              <button
                onClick={() => setTextInput(SAMPLE_DIALOG)}
                className="text-[11px] font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Nạp mẫu hội thoại A - B
              </button>
            </div>

            <textarea
              rows={5}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Dán đoạn văn bản hoặc kịch bản tiếng Anh vào đây..."
              className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#2563EB] font-sans leading-relaxed resize-none bg-slate-50/50"
            />

            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Giọng Đọc Tiếng Anh:
                </label>
                <select
                  value={selectedVoiceIndex}
                  onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-300 text-xs text-slate-700 bg-white"
                >
                  {voiceList.map((v, i) => (
                    <option key={i} value={i}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Tốc Độ Đọc: {rate}x
                </label>
                <input
                  type="range"
                  min="0.6"
                  max="1.4"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB] mt-2"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex flex-wrap gap-2">
              {!isPlaying ? (
                <button
                  onClick={handlePlayOnline}
                  className="py-2.5 px-5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-blue-500/20"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Phát Âm Thanh Trực Tiếp
                </button>
              ) : (
                <button
                  onClick={handleStopOnline}
                  className="py-2.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md"
                >
                  <Square className="w-4 h-4 fill-white" />
                  Dừng Lại
                </button>
              )}

              <button
                onClick={() => setTextInput('')}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs"
              >
                Xóa chữ
              </button>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-blue-900 leading-relaxed">
              💡 <b>Lưu ý:</b> Tính năng Online trên web giúp Thầy/Cô nghe thử nhanh. Để xuất file MP3 chất lượng cao, tự động ghép 2-3 nhân vật và chèn tiếng chuông hiệu lệnh phòng thi, Thầy/Cô hãy chuyển sang tab <b>"Tải Bản Pro & Video HD"</b>.
            </div>
          </div>
        )}

        {/* TAB 2: TẢI BẢN PRO & VIDEO HD */}
        {activeTab === 'download' && (
          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            {/* Video Tutorial Player (1.28 MB HD) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#123A63] flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  Video hướng dẫn 3 bước tải về & kích hoạt bản quyền (1 phút):
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Full HD 1080p</span>
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner">
                <video 
                  controls 
                  preload="metadata"
                  className="w-full aspect-video max-h-[300px] object-contain bg-black"
                >
                  <source src="/Video_Huong_Dan_Cai_Dat_Smart_Listening_Pro.mp4" type="video/mp4" />
                </video>
              </div>
              <p className="text-[11px] text-slate-500 italic text-center">
                💡 Video đồ họa tóm tắt nhanh 3 bước lấy mã máy và mở khóa bản quyền Pro vĩnh viễn.
              </p>
            </div>

            {/* DOWNLOAD ACTION BUTTON */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Phần Mềm Smart Listening Pro (Bản 1-Click)
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Dung lượng: 22 MB – Không cần cài đặt, nhấp đúp là chạy ngay trên máy tính!
                </p>
              </div>

              <a
                href={`https://zalo.me/${BRAND.phoneRaw}?text=${encodeURIComponent('Chào Thầy Thành, tôi đang ở trên trang web Giáo Viên AI Toàn Năng. Thầy gửi giúp tôi file Smart Listening Pro.exe để cài đặt nhé!')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
              >
                <Download className="w-4 h-4" />
                Nhận File Cài Đặt Trực Tiếp (Zalo Thầy Thành)
              </a>
            </div>

            {/* 4 Feature Highlights Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                <span className="font-bold text-slate-800 block">🎙️ Giọng AI Bản Ngữ</span>
                <span className="text-[11px] text-slate-500">Giọng Anh - Mỹ, Anh - Anh chuẩn xác</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                <span className="font-bold text-slate-800 block">👥 Đa Nhân Vật</span>
                <span className="text-[11px] text-slate-500">Phân vai Teacher, Student linh hoạt</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                <span className="font-bold text-slate-800 block">🔔 Chuông & Nghỉ</span>
                <span className="text-[11px] text-slate-500">Tự chèn chuông Ding, Bell chuẩn kỳ thi</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                <span className="font-bold text-slate-800 block">⚡ Chạy Offline</span>
                <span className="text-[11px] text-slate-500">Không lo mất mạng Wifi trên lớp học</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ĐĂNG KÝ BẢN QUYỀN PRO */}
        {activeTab === 'register' && (
          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            {regSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-emerald-900">
                  ĐÃ GỬI THÔNG TIN ĐĂNG KÝ LÊN CLOUD THẦY THÀNH!
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Hệ thống đã nhận diện mã máy của Thầy/Cô. Thầy Thành sẽ kiểm tra và bấm duyệt kích hoạt bản quyền trong ít phút.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                  <a
                    href={`https://zalo.me/${BRAND.phoneRaw}?text=${encodeURIComponent(
                      `Chào Thầy Thành, tôi vừa đăng ký bản quyền Smart Listening Pro trên Web cho máy ${regMid}. Tôi gửi ảnh bill chuyển khoản nhờ Thầy duyệt giúp nhé!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-5 rounded-xl bg-[#0D9488] hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Mở Zalo Gửi Ảnh Bill ({BRAND.phone})
                  </a>
                  <button
                    onClick={() => setRegSuccess(false)}
                    className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                  >
                    Đăng ký máy khác
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitRegister} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Mã Máy Tính (Machine ID) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: MB-E10D-BE85 (Xem trên app)"
                      value={regMid}
                      onChange={(e) => setRegMid(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Họ và Tên Thầy/Cô *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Nguyễn Thị Mai"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Số Điện Thoại Zalo *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ví dụ: 0988..."
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Gói Đăng Ký
                    </label>
                    <select
                      value={regPackage}
                      onChange={(e) => setRegPackage(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-[#2563EB] bg-white"
                    >
                      <option value="LIFETIME">👑 Trọn Đời (Vĩnh Viễn) - 150.000đ</option>
                      <option value="1YEAR">1 Năm (365 ngày) - 100.000đ</option>
                      <option value="2YEAR">2 Năm - 150.000đ</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Trường / Đơn Vị Công Tác
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Trường THCS Đồng Yên"
                    value={regSchool}
                    onChange={(e) => setRegSchool(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={regLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#2563EB] to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {regLoading ? 'Đang gửi thông tin...' : 'Gửi Đăng Ký Lên Cloud Thầy Thành'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* FOOTER BUTTONS */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2 mt-auto">
          <a
            href={BRAND.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#0D9488] hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            Liên Hệ Thầy Thành (Zalo: {BRAND.phone})
          </a>
          <button
            onClick={() => {
              handleStopOnline();
              onClose();
            }}
            className="py-2.5 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
