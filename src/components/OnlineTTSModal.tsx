// Các mẫu kịch bản thuyết minh video hướng dẫn (Giọng Thầy Đinh Văn Thành & Nữ miền Bắc)
export const SAMPLE_VIDEO_TAO_DE = `Kính chào quý Thầy Cô! Hôm nay, tôi xin hướng dẫn quý Thầy Cô cách sử dụng phần mềm Tạo Đề Kiểm Tra THCS chuẩn Công văn 7991 của Bộ Giáo dục và Đào tạo.
Chỉ với một cú nhấp chuột, hệ thống sẽ tự động khởi tạo trọn bộ Ma trận đề, Bản đặc tả kỹ thuật và Đề kiểm tra in ấn A4 chuẩn mực, kèm theo hướng dẫn đáp án chi tiết.
Thầy Cô có thể chọn môn học, khối lớp, phân môn và xuất file Microsoft Word đầy đủ để sử dụng ngay trong công tác giảng dạy. Chúc quý Thầy Cô thực hiện thành công!`;

export const SAMPLE_VIDEO_ND30 = `Xin chào các đồng chí cán bộ và giáo viên!
Video hôm nay sẽ hướng dẫn quy trình chuẩn hóa văn bản hành chính theo đúng Nghị định 30 năm 2020 của Chính phủ.
Hệ thống sẽ tự động căn chỉnh lề giấy A4 chuẩn xác, tạo khung Quốc hiệu tiêu ngữ của Ủy ban nhân dân xã Đồng Yên, Trường Trung học cơ sở Đồng Yên, và khung chữ ký của Hiệu trưởng.
Chỉ trong chưa đầy một giây, văn bản của Thầy Cô sẽ đạt chuẩn khảo thí và thể thức văn bản quốc gia!`;

export const SAMPLE_VIDEO_ADDIN_WORD = `Xin chào quý Thầy Cô! Tôi là Thầy Đinh Văn Thành, giáo viên Trường Trung học cơ sở Đồng Yên.
Hôm nay tôi rất vui mừng được chia sẻ bộ công cụ AI Word Assistant tích hợp trực tiếp vào Microsoft Word.
Phần mềm hoạt động hoàn toàn độc lập, không cần bất kỳ API key nào.
Thầy Cô có thể bấm một phát là có ngay giáo án 5512, sửa nhanh lỗi chính tả tiếng Việt và chèn các công thức, ký hiệu toán học đẹp mắt hơn cả MathType. Xin trân trọng cảm ơn!`;

import React, { useState, useEffect, useRef } from 'react';
import { 
  Crown, 
  X, 
  Play, 
  Pause,
  Square, 
  Volume2, 
  VolumeX,
  Download, 
  Sparkles, 
  MessageCircle, 
  FileText, 
  CheckCircle2, 
  Send,
  Zap,
  Bell,
  Clock,
  Copy,
  Check,
  Laptop,
  Rewind,
  FastForward
} from 'lucide-react';
import { BRAND } from '../config/brand';
import { licenseService } from '../services/licenseService';

interface OnlineTTSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Các mẫu lời thoại chuẩn SGK (giống hệt bản desktop AI_Voice_Pro.py)
const SAMPLE_SECONDARY = `Nick: Hi, Mi! Are you excited about your first week at the new secondary school?
Mi: Yes, Nick! The school is very big and modern. I really love the science lab and the large library.
Nick: That sounds awesome! What is your favourite subject this semester?
Mi: My favourite subjects are English and Computer Science. How about you?
Nick: I enjoy Geography and Physical Education because I love doing outdoor sports with our classmates.`;

const SAMPLE_PRIMARY = `Teacher: Look, listen and repeat.
[CHIME_DING]
Mai: Good morning, Tom. How are you today?
Tom: Good morning, Mai. I am very well, thank you. And how are you?
Mai: I am great! What are you doing in the classroom?
Tom: I am reading an English story book about animals. It is very interesting!
Mai: Wow, that is wonderful. Let's read together!`;

const SAMPLE_DIALOGUE_AB = `A: Hello! What is your name?
B: My name is Thanh. Nice to meet you!
A: Nice to meet you too, Thanh. Where are you from?
B: I am from Hanoi, Vietnam. And where are you from?
A: I come from London, England. How long have you lived here?
B: I have lived here for five years. It is a very peaceful and beautiful city!`;

const SAMPLE_MONOLOGUE = `Good morning, everyone. Today we are going to talk about one of the most fascinating topics in science: the solar system.
Our solar system consists of the Sun and everything that orbits around it, including eight planets, dozens of moons, and millions of asteroids and comets.
The four inner planets are Mercury, Venus, Earth, and Mars.
The four outer planets are Jupiter, Saturn, Uranus, and Neptune.
Earth is the only planet known to support life, thanks to its perfect distance from the Sun and its protective atmosphere.`;

// Hàm sinh hoặc đọc mã máy tính duy nhất cho từng trình duyệt/máy tính
const getOrCreateMachineId = (): string => {
  let mid = localStorage.getItem('gvai_detected_machine_id');
  if (!mid || !mid.startsWith('MB-')) {
    // Tạo mã định danh duy nhất dựa trên màn hình + trình duyệt + ngẫu nhiên
    try {
      const scr = `${window.screen?.width || 1920}x${window.screen?.height || 1080}_${window.screen?.colorDepth || 24}`;
      const nav = `${navigator.userAgent}_${navigator.language}_${navigator.hardwareConcurrency || 4}`;
      const raw = scr + nav;
      let hash = 0;
      for (let i = 0; i < raw.length; i++) {
        hash = ((hash << 5) - hash) + raw.charCodeAt(i);
        hash |= 0;
      }
      const part1 = Math.abs(hash).toString(16).padStart(4, '0').substring(0, 4).toUpperCase();
      const part2 = Math.floor((1 + Math.random()) * 0x10000).toString(16).padStart(4, '0').toUpperCase();
      mid = `MB-${part1}-${part2}`;
    } catch {
      mid = 'MB-8F22-A109';
    }
    localStorage.setItem('gvai_detected_machine_id', mid);
  }
  return mid;
};

// Hàm phát chuông giả lập Web Audio API chất lượng cao (không cần file ngoài)
const playAcousticChime = (type: 'ding' | 'bell' | 'jingle') => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === 'ding') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1567.98, now); // G6 crystal ding
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.2);
    } else if (type === 'bell') {
      [880, 1760].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(idx === 0 ? 0.22 : 0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.8);
      });
    } else if (type === 'jingle') {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const st = now + idx * 0.14;
        osc.frequency.setValueAtTime(freq, st);
        gain.gain.setValueAtTime(0.2, st);
        gain.gain.exponentialRampToValueAtTime(0.0001, st + (idx === 3 ? 1.4 : 0.35));
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(st);
        osc.stop(st + (idx === 3 ? 1.4 : 0.35));
      });
    }
  } catch (e) {
    console.warn('Audio chime error:', e);
  }
};

export const OnlineTTSModal: React.FC<OnlineTTSModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'online' | 'download' | 'register'>('online');

  // ID máy tính tự động
  const [detectedMid, setDetectedMid] = useState<string>('MB-E10D-BE85');
  const [copiedMid, setCopiedMid] = useState(false);

  // Hệ thống 5 lượt dùng thử miễn phí
  const [trialRemaining, setTrialRemaining] = useState<number>(5);

  // Online Studio States
  const [studioMode, setStudioMode] = useState<'video_guide' | 'english_sgk'>('video_guide');
  const [vietnameseVoiceType, setVietnameseVoiceType] = useState<'thay_thanh' | 'co_giao_bac'>('thay_thanh');
  const [textInput, setTextInput] = useState(SAMPLE_VIDEO_TAO_DE);
  const [voiceList, setVoiceList] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);
  const [rate, setRate] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(100);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [, setCurrentLineIndex] = useState<number>(-1);
  const [playbackSeconds, setPlaybackSeconds] = useState<number>(0);
  const [totalEstimatedSeconds, setTotalEstimatedSeconds] = useState<number>(30);

  // Form Đăng ký bản quyền
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

  // Ref điều khiển playback
  const isPlayingRef = useRef(false);
  const timerIntervalRef = useRef<any>(null);

  // Khởi tạo mã máy, lượt dùng thử và kiểm tra bản quyền Pro tự động
  useEffect(() => {
    const mid = getOrCreateMachineId();
    setDetectedMid(mid);
    setRegMid(mid);
    setActiveMidInput(mid);

    // Đọc số lượt dùng thử còn lại trên máy (tối đa 5 lượt/máy tính)
    const savedTrials = localStorage.getItem('gvai_trial_remaining');
    if (savedTrials !== null) {
      const parsed = parseInt(savedTrials, 10);
      setTrialRemaining(isNaN(parsed) ? 5 : Math.max(0, Math.min(parsed, 5)));
    } else {
      localStorage.setItem('gvai_trial_remaining', '5');
      setTrialRemaining(5);
    }

    // Tự động kiểm tra xem mã máy này đã được kích hoạt Pro trên Cloud chưa
    licenseService.checkOnlineLicense(mid).then(res => {
      if (res.isValid && res.record) {
        setIsProActivated(true);
        setProTeacherName(res.record.teacher_name || 'Thầy/Cô');
      }
    });

    const savedProMid = localStorage.getItem('gvai_web_pro_mid');
    if (savedProMid && savedProMid !== mid) {
      licenseService.checkOnlineLicense(savedProMid).then(res => {
        if (res.isValid && res.record) {
          setIsProActivated(true);
          setProTeacherName(res.record.teacher_name || 'Thầy/Cô');
        }
      });
    }
  }, []);

  // Tính toán số từ và ước tính thời lượng
  useEffect(() => {
    const words = textInput.trim().split(/\s+/).filter(Boolean).length;
    const est = Math.max(10, Math.round((words / (130 * rate)) * 60));
    setTotalEstimatedSeconds(est);
  }, [textInput, rate]);

  // Load danh sách giọng đọc của trình duyệt
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        setVoiceList(voices);
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Hủy phát âm khi đóng modal
  useEffect(() => {
    if (!isOpen) {
      stopPlayback();
    }
  }, [isOpen]);

  const copyMachineIdToClipboard = () => {
    navigator.clipboard.writeText(detectedMid);
    setCopiedMid(true);
    setTimeout(() => setCopiedMid(false), 2000);
  };

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

  // Chèn thẻ chuông hoặc thời gian nghỉ vào vị trí con trỏ
  const insertTagAtCursor = (tag: string) => {
    setTextInput(prev => prev + (prev.endsWith('\n') ? '' : '\n') + tag + '\n');
  };

  // Dừng phát âm thanh
  const stopPlayback = () => {
    isPlayingRef.current = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentLineIndex(-1);
    setPlaybackSeconds(0);
  };

  // Phát toàn bộ bài nghe có hỗ trợ nhận diện Chuông & Thời gian nghỉ & Lượt dùng thử
  const handlePlayStudio = async () => {
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn chưa hỗ trợ Web Speech API.');
      return;
    }

    // KIỂM TRA LƯỢT DÙNG THỬ 5 LẦN/MÁY TÍNH
    if (!isProActivated) {
      if (trialRemaining <= 0) {
        alert('⚠️ Thầy/Cô đã sử dụng hết 5 lượt dùng thử miễn phí trên máy tính này!\n\nVui lòng đăng ký kích hoạt bản quyền Pro vĩnh viễn (hoặc liên hệ Thầy Thành: 0915.213717) để mở khóa tạo bài không giới hạn.');
        setActiveTab('register');
        return;
      }
      // Trừ 1 lượt dùng thử (tối thiểu 0)
      const nextRemaining = Math.max(0, trialRemaining - 1);
      setTrialRemaining(nextRemaining);
      localStorage.setItem('gvai_trial_remaining', String(nextRemaining));
    }

    stopPlayback();
    isPlayingRef.current = true;
    setIsPlaying(true);
    setIsPaused(false);
    setPlaybackSeconds(0);

    // Đồng hồ đếm giây phát
    timerIntervalRef.current = setInterval(() => {
      setPlaybackSeconds(sec => sec + 1);
    }, 1000);

    const lines = textInput.split('\n').map(l => l.trim()).filter(Boolean);

    for (let i = 0; i < lines.length; i++) {
      if (!isPlayingRef.current) break;
      setCurrentLineIndex(i);
      const line = lines[i];

      // Xử lý chèn chuông
      if (line.includes('[CHIME_DING]')) {
        playAcousticChime('ding');
        await new Promise(r => setTimeout(r, 1200));
        continue;
      }
      if (line.includes('[CHIME_BELL]')) {
        playAcousticChime('bell');
        await new Promise(r => setTimeout(r, 1800));
        continue;
      }
      if (line.includes('[CHIME_JINGLE]')) {
        playAcousticChime('jingle');
        await new Promise(r => setTimeout(r, 1800));
        continue;
      }

      // Xử lý nghỉ
      if (line.includes('[PAUSE_2S]')) {
        await new Promise(r => setTimeout(r, 2000));
        continue;
      }
      if (line.includes('[PAUSE_5S]')) {
        await new Promise(r => setTimeout(r, 5000));
        continue;
      }

      // Đọc lời thoại
      await new Promise<void>((resolve) => {
        if (!isPlayingRef.current) {
          resolve();
          return;
        }

        // Tách nhãn người nói để đọc tự nhiên
        const colonIdx = line.indexOf(':');
        const spokenText = colonIdx !== -1 ? line.substring(colonIdx + 1).trim() : line;

        const utterance = new SpeechSynthesisUtterance(spokenText);
        if (voiceList[selectedVoiceIndex]) {
          utterance.voice = voiceList[selectedVoiceIndex];
        }
        utterance.rate = rate;
        utterance.volume = isMuted ? 0 : volume / 100;

        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();

        window.speechSynthesis.speak(utterance);
      });

      // Khoảng nghỉ nhỏ giữa các câu (0.4s)
      await new Promise(r => setTimeout(r, 400));
    }

    stopPlayback();
  };

  const handlePauseResume = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regMid.trim() || !regPhone.trim()) {
      alert('Vui lòng kiểm tra Mã máy và Số điện thoại Zalo.');
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

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Lắng nghe phím Escape (Esc) để đóng modal ngay lập tức
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        stopPlayback();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto cursor-pointer"
      onClick={() => {
        stopPlayback();
        onClose();
      }}
    >
      <div 
        className="bg-[#0f172a] text-slate-100 rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl relative my-auto border border-slate-700/60 max-h-[96vh] flex flex-col cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* CLOSE BUTTON */}
        <button
          onClick={() => {
            stopPlayback();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* HEADER BRANDING & AUTO-DETECTED MACHINE ID */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 pr-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-blue-900/40 shrink-0">
              <Crown className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold tracking-wider uppercase">
                  Bản Quyền Thương Mại Pro
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">v2.0 Desktop & Web</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-1.5 mt-0.5">
                SMART LISTENING PRO
              </h3>
              <p className="text-[11px] text-slate-400">
                Tạo bài nghe Tiếng Anh chuẩn Quốc tế – Tác giả: <span className="text-slate-300 font-semibold">{BRAND.author}</span>
              </p>
            </div>
          </div>

          {/* AUTO-DETECTED MACHINE ID BADGE WITH 1-CLICK COPY */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-1.5 self-start sm:self-auto">
            <Laptop className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">ID Máy Tính Của Bạn:</div>
              <div className="text-xs font-mono font-bold text-cyan-300 tracking-wider">
                {detectedMid}
              </div>
            </div>
            <button
              onClick={copyMachineIdToClipboard}
              className="ml-1 p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Sao chép mã máy"
            >
              {copiedMid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 3 TABS SWITCHER */}
        <div className="flex border-b border-slate-800 mt-3 mb-3 gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => {
              stopPlayback();
              setActiveTab('online');
            }}
            className={`pb-2 px-3 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'online'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            Studio Tạo Bài Nghe (Dùng Online)
          </button>

          <button
            onClick={() => {
              stopPlayback();
              setActiveTab('download');
            }}
            className={`pb-2 px-3 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'download'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4 text-emerald-400" />
            Tải Bản Cài Đặt Desktop & Video HD
          </button>

          <button
            onClick={() => {
              stopPlayback();
              setActiveTab('register');
            }}
            className={`pb-2 px-3 text-xs sm:text-sm font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'register'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4 text-purple-400" />
            Đăng Ký Bản Quyền Pro
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: STUDIO TẠO BÀI NGHE (ONLINE STUDIO THEME DESKTOP) */}
        {/* ========================================================================= */}
        {activeTab === 'online' && (
          <div className="space-y-3 flex-1 overflow-y-auto pr-1 text-xs">
            
            {/* 1. STATUS CARD: TRIAL OR PRO BANNER (GIỐNG HỆT BẢN CÀI ĐẶT DESKTOP) */}
            {isProActivated ? (
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-blue-950/80 border border-emerald-500/40 flex items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      👑 BẢN QUYỀN CHÍNH THỨC PRO: ĐÃ KÍCH HOẠT VĨNH VIỄN
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Chủ sở hữu: <b className="text-slate-200">{proTeacherName}</b> – Không giới hạn số lần tạo bài & mở khóa toàn bộ tính năng Studio.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem('gvai_web_pro_mid');
                    setIsProActivated(false);
                    setProMessage('');
                  }}
                  className="text-[10px] text-slate-500 hover:text-rose-400 underline"
                >
                  Đổi mã
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-blue-500/40 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🎁</span>
                    <span className="font-bold text-xs sm:text-sm text-white">
                      DÙNG THỬ MIỄN PHÍ TRÊN MÁY TÍNH NÀY:
                    </span>
                    <span className="text-[11px] text-slate-300">
                      Đã sử dụng {5 - trialRemaining}/5 lượt
                    </span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                    trialRemaining > 2 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {trialRemaining > 0 ? `👉 Còn lại: ${trialRemaining} lượt` : 'Đã hết lượt dùng thử'}
                  </span>
                </div>

                {/* 5 Dấu Chấm Tiến Trình [ ● ● ● ○ ○ ] */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-slate-400 font-mono text-[11px]">Tiến trình:</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                          i < (5 - trialRemaining)
                            ? 'bg-blue-500 text-white shadow-xs shadow-blue-500/50'
                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}
                      >
                        {i < (5 - trialRemaining) ? '●' : '○'}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 italic ml-auto hidden sm:inline">
                    (Mỗi máy tính được tặng 5 lượt tạo bài nghe miễn phí)
                  </span>
                </div>
              </div>
            )}

            {/* BỘ CHỌN CHẾ ĐỘ: 1. THUYẾT MINH VIDEO (TIẾNG VIỆT) | 2. SGK TIẾNG ANH */}
            <div className="flex gap-2 p-1.5 bg-slate-900 border border-amber-500/30 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setStudioMode('video_guide');
                  setTextInput(SAMPLE_VIDEO_TAO_DE);
                }}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  studioMode === 'video_guide'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Crown className="w-4 h-4" />
                🎙️ Tạo Giọng Thuyết Minh Video Hướng Dẫn (Tiếng Việt)
              </button>
              <button
                type="button"
                onClick={() => {
                  setStudioMode('english_sgk');
                  setTextInput(SAMPLE_SECONDARY);
                }}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  studioMode === 'english_sgk'
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                🎧 Luyện Nghe SGK Tiếng Anh (English Global Success)
              </button>
            </div>

            {/* THANH CÔNG CỤ NHANH */}
            <div className="bg-slate-800/80 rounded-2xl p-2.5 border border-slate-700 space-y-2">
              {studioMode === 'video_guide' ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      Chọn giọng đọc thuyết minh:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setVietnameseVoiceType('thay_thanh')}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                          vietnameseVoiceType === 'thay_thanh'
                            ? 'bg-amber-500 text-slate-950 shadow-md'
                            : 'bg-slate-900 text-slate-300 border border-slate-700 hover:text-white'
                        }`}
                      >
                        👑 Giọng Thầy Đinh Văn Thành (Nam Miền Bắc - Trầm Ấm Sư Phạm)
                      </button>
                      <button
                        type="button"
                        onClick={() => setVietnameseVoiceType('co_giao_bac')}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                          vietnameseVoiceType === 'co_giao_bac'
                            ? 'bg-purple-500 text-white shadow-md'
                            : 'bg-slate-900 text-slate-300 border border-slate-700 hover:text-white'
                        }`}
                      >
                        🌸 Giọng Cô Giáo Miền Bắc (Nữ Miền Bắc - Truyền Cảm Phát Thanh)
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-700/60">
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Kịch bản video mẫu:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setTextInput(SAMPLE_VIDEO_TAO_DE)}
                        className="px-2.5 py-1 rounded-lg bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-600/40 text-xs font-semibold"
                      >
                        📜 Video 1: Tạo Đề 7991
                      </button>
                      <button
                        type="button"
                        onClick={() => setTextInput(SAMPLE_VIDEO_ND30)}
                        className="px-2.5 py-1 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-600/40 text-xs font-semibold"
                      >
                        🏛️ Video 2: Chuẩn Hóa NĐ 30
                      </button>
                      <button
                        type="button"
                        onClick={() => setTextInput(SAMPLE_VIDEO_ADDIN_WORD)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/40 text-xs font-semibold"
                      >
                        💻 Video 3: Add-in AI Word
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Nạp bài mẫu chuẩn SGK:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setTextInput(SAMPLE_SECONDARY)}
                      className="px-2.5 py-1 rounded-lg bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-600/40 font-semibold transition-colors"
                    >
                      🏫 Cấp 2 (Nick & Mi)
                    </button>
                    <button
                      onClick={() => setTextInput(SAMPLE_PRIMARY)}
                      className="px-2.5 py-1 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-600/40 font-semibold transition-colors"
                    >
                      🎒 Cấp 1 (Tom & Mai)
                    </button>
                    <button
                      onClick={() => setTextInput(SAMPLE_DIALOGUE_AB)}
                      className="px-2.5 py-1 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-600/40 font-semibold transition-colors"
                    >
                      💬 Giao tiếp (A & B)
                    </button>
                    <button
                      onClick={() => setTextInput(SAMPLE_MONOLOGUE)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/40 font-semibold transition-colors"
                    >
                      🎙️ Độc thoại (Monologue)
                    </button>
                  </div>
                </div>
              )}

              {/* Chèn Chuông & Thời gian nghỉ */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-700/60">
                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  Chèn hiệu lệnh phòng thi:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => {
                      insertTagAtCursor('[CHIME_DING]');
                      playAcousticChime('ding');
                    }}
                    className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1"
                    title="Phát chuông Ding trong trẻo"
                  >
                    🔔 Chèn Ding
                  </button>
                  <button
                    onClick={() => {
                      insertTagAtCursor('[CHIME_BELL]');
                      playAcousticChime('bell');
                    }}
                    className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1"
                    title="Phát chuông Bell ngân vang"
                  >
                    🔔 Chèn Bell
                  </button>
                  <button
                    onClick={() => {
                      insertTagAtCursor('[CHIME_JINGLE]');
                      playAcousticChime('jingle');
                    }}
                    className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-semibold flex items-center gap-1"
                    title="Nhạc hiệu mở đầu / kết thúc"
                  >
                    🎵 Chèn Jingle
                  </button>
                  <button
                    onClick={() => insertTagAtCursor('[PAUSE_2S]')}
                    className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-300 border border-slate-600 font-semibold flex items-center gap-1"
                  >
                    ⏸️ Nghỉ 2s
                  </button>
                  <button
                    onClick={() => insertTagAtCursor('[PAUSE_5S]')}
                    className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-300 border border-slate-600 font-semibold flex items-center gap-1"
                  >
                    ⏸️ Nghỉ 5s
                  </button>
                </div>
              </div>
            </div>

            {/* 3. KHUNG NHẬP KỊCH BẢN / SCRIPT EDITOR */}
            <div className="relative">
              <div className="flex items-center justify-between pb-1 text-slate-400">
                <span className="font-semibold text-[11px] flex items-center gap-1 text-slate-300">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  Nội dung kịch bản / Lời thoại bài nghe:
                </span>
                <span className="font-mono text-[11px] text-cyan-400">
                  📊 {textInput.trim().split(/\s+/).filter(Boolean).length} từ | {textInput.length} ký tự
                </span>
              </div>
              <textarea
                rows={6}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Dán kịch bản tiếng Anh vào đây (Ví dụ: Nick: Hello... Mi: Hi...)..."
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
              />
            </div>

            {/* 4. CẤU HÌNH GIỌNG ĐỌC & TỐC ĐỘ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Giọng Đọc Tiếng Anh:
                </label>
                <select
                  value={selectedVoiceIndex}
                  onChange={(e) => setSelectedVoiceIndex(Number(e.target.value))}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                >
                  {voiceList.map((v, i) => (
                    <option key={i} value={i}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-300 mb-1">
                  <span>Tốc Độ Phát Âm:</span>
                  <span className="text-cyan-400 font-mono">{rate}x</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="1.4"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-2"
                />
              </div>
            </div>

            {/* 5. STUDIO AUDIO PLAYER BAR (TÁI TẠO NGUYÊN BẢN CÀI ĐẶT DESKTOP AI_VOICE_PRO.PY) */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                {/* Play / Pause / Stop Buttons */}
                <div className="flex items-center gap-1.5">
                  {!isPlaying ? (
                    <button
                      onClick={handlePlayStudio}
                      className={`py-2 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-105 ${
                        !isProActivated && trialRemaining <= 0
                          ? 'bg-rose-900/80 text-rose-200 border border-rose-600/40 hover:bg-rose-800'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/30'
                      }`}
                    >
                      <Play className="w-4 h-4 fill-white" />
                      {!isProActivated && trialRemaining <= 0
                        ? 'Đã Hết 5 Lượt Thử (Kích hoạt Pro)'
                        : isProActivated
                        ? 'Phát Toàn Bộ Bài Nghe'
                        : `Phát Bài Nghe (Còn ${trialRemaining}/5 lượt)`}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handlePauseResume}
                        className="py-2 px-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                      >
                        <Pause className="w-3.5 h-3.5" />
                        {isPaused ? 'Tiếp tục' : 'Tạm dừng'}
                      </button>
                      <button
                        onClick={stopPlayback}
                        className="py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1"
                      >
                        <Square className="w-3.5 h-3.5 fill-white" />
                        Dừng
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => {
                      setPlaybackSeconds(sec => Math.max(0, sec - 5));
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Lùi lại 5 giây"
                  >
                    <Rewind className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setPlaybackSeconds(sec => sec + 5);
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Tua tới 5 giây"
                  >
                    <FastForward className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Digital Time Display (Consolas font) */}
                <div className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl flex items-center gap-2 self-start sm:self-auto">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-mono font-bold text-cyan-300 text-xs">
                    {formatSeconds(playbackSeconds)} / {formatSeconds(totalEstimatedSeconds)}
                  </span>
                </div>
              </div>

              {/* Seek Slider Bar */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max={totalEstimatedSeconds}
                  value={Math.min(playbackSeconds, totalEstimatedSeconds)}
                  onChange={(e) => setPlaybackSeconds(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Volume Row & Quick Actions */}
              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-slate-300 hover:text-white"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4 text-rose-400" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-cyan-400" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(Number(e.target.value));
                      if (isMuted) setIsMuted(false);
                    }}
                    className="w-16 sm:w-24 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <span className="font-mono text-cyan-300">{isMuted ? '0%' : `${volume}%`}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTextInput('')}
                    className="text-slate-500 hover:text-slate-300 underline"
                  >
                    Xóa kịch bản
                  </button>
                  <button
                    onClick={() => setActiveTab('download')}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Tải Bản Cài Desktop (.exe)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: TẢI BẢN PRO & VIDEO HD (ĐÃ KHẮC PHỤC LỖI VIDEO & CÓ BẢN CÀI TỰ TẢI) */}
        {/* ========================================================================= */}
        {activeTab === 'download' && (
          <div className="space-y-4 flex-1 overflow-y-auto pr-1 text-xs">
            
            {/* 1. VIDEO PLAYER (SỬ DỤNG FILE 200 OK TRÊN VERCEL, CÓ POSTER & NÚT MỞ TRỰC TIẾP) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  Video hướng dẫn cài đặt & kích hoạt bản quyền Smart Listening Pro:
                </span>
                <span className="text-[11px] text-cyan-400 font-mono">Full HD 1080p</span>
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
                <video 
                  controls 
                  playsInline
                  preload="auto"
                  poster="/smart_listening_icon.png"
                  className="w-full aspect-video max-h-[300px] object-contain bg-black"
                >
                  <source src="/tao-bai-nghe-listening.mp4" type="video/mp4" />
                  <source src="/Video_Huong_Dan_Cai_Dat_Smart_Listening_Pro.mp4" type="video/mp4" />
                  Trình duyệt không hỗ trợ thẻ video.
                </video>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>💡 Video hướng dẫn chi tiết các bước lấy ID máy tính và mở khóa vĩnh viễn.</span>
                <a
                  href="/tao-bai-nghe-listening.mp4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline font-semibold"
                >
                  ▶ Mở xem video tab mới
                </a>
              </div>
            </div>

            {/* 2. NÚT TẢI VỀ BẢN CÀI ĐẶT TRỰC TIẾP CHO GIÁO VIÊN (22 MB - DƯỚI 25 MB GITHUB) */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-slate-900 to-teal-950/90 border border-emerald-500/40 space-y-3 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Phần Mềm Smart Listening Pro (Bản 1-Click Chạy Ngay)
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Dung lượng: <b>22 MB</b> – Đã nén mật khẩu bảo vệ <code className="text-amber-300 font-bold bg-amber-500/20 px-1.5 py-0.5 rounded">123</code> (giúp tải 100% không bị trình duyệt Chrome/Cốc Cốc chặn).
                  </p>
                </div>

                {/* NÚT TẢI TRỰC TIẾP FILE ZIP BẢN CÀI ĐẶT */}
                <a
                  href="/Smart_Listening_Pro.zip"
                  download="Smart_Listening_Pro.zip"
                  className="py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 shrink-0"
                >
                  <Download className="w-4 h-4" />
                  Tải Bản Cài Đặt (Pass: 123)
                </a>
              </div>

              {/* Hướng Dẫn Nhanh 3 Bước */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-emerald-500/20 text-[11px]">
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="font-bold text-emerald-400 block mb-0.5">Bước 1: Tải về</span>
                  <span className="text-slate-300">Bấm nút xanh ở trên để tải file về máy. (Nếu Chrome hiện cảnh báo, bấm dấu <strong>&gt;</strong> chọn <em>"Vẫn tải xuống"</em>).</span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="font-bold text-emerald-400 block mb-0.5">Bước 2: Giải nén</span>
                  <span className="text-slate-300">Nhấp chuột phải vào file &rarr; chọn "Extract Here" &rarr; Nhập mật khẩu: <strong className="text-amber-300">123</strong></span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="font-bold text-emerald-400 block mb-0.5">Bước 3: Chạy ứng dụng</span>
                  <span className="text-slate-300">Nhấp đúp vào <code>Smart Listening Pro.exe</code> (Chọn <em>More info &rarr; Run anyway</em> nếu có).</span>
                </div>
              </div>
            </div>

            {/* 3. ĐẶC QUYỀN BẢN PRO CÀI ĐẶT TRÊN MÁY */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="font-bold text-slate-200 block">🎙️ Giọng Bản Ngữ</span>
                <span className="text-[11px] text-slate-400">Edge-TTS chuẩn Anh - Mỹ, Anh - Anh</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="font-bold text-slate-200 block">👥 Đa Nhân Vật</span>
                <span className="text-[11px] text-slate-400">Phân vai Teacher & Students mượt mà</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="font-bold text-slate-200 block">🔔 Chuông Phòng Thi</span>
                <span className="text-[11px] text-slate-400">Chèn chuông Ding, Bell chuẩn Bộ GD&ĐT</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="font-bold text-slate-200 block">⚡ Chạy Offline</span>
                <span className="text-[11px] text-slate-400">Không lo mất mạng internet trên lớp</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ĐĂNG KÝ BẢN QUYỀN PRO (TỰ ĐIỀN SẴN ID MÁY TÍNH) */}
        {/* ========================================================================= */}
        {activeTab === 'register' && (
          <div className="space-y-3 flex-1 overflow-y-auto pr-1 text-xs">
            {/* THẺ NHẬP KEY HOẶC MÃ MÁY ĐỂ MỞ KHÓA NGAY */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-blue-950/60 border border-amber-500/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="text-[11px] font-semibold text-amber-200 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Đã mua bản quyền? Nhập mã máy để mở Web Pro vĩnh viễn:</span>
              </div>
              <div className="flex items-center gap-1.5 flex-1 max-w-sm">
                <input
                  type="text"
                  placeholder="MB-XXXX-XXXX"
                  value={activeMidInput}
                  onChange={(e) => setActiveMidInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-amber-400/40 text-xs font-mono uppercase text-amber-300 focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={handleActivatePro}
                  disabled={checkLoading}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs whitespace-nowrap transition-colors"
                >
                  {checkLoading ? '...' : 'Mở Khóa'}
                </button>
              </div>
            </div>
            {proMessage && (
              <p className={`text-xs px-2 ${isProActivated ? 'text-emerald-400 font-bold' : 'text-amber-300 font-medium'}`}>
                {proMessage}
              </p>
            )}

            {/* FORM ĐĂNG KÝ MỚI LÊN CLOUD */}
            {regSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-emerald-300">
                  ĐÃ GỬI THÔNG TIN ĐĂNG KÝ LÊN CLOUD THẦY THÀNH!
                </h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Hệ thống đã nhận diện mã máy <b className="text-cyan-300 font-mono">{regMid}</b> của Thầy/Cô. Thầy Thành sẽ kiểm tra và kích hoạt bản quyền trong ít phút.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                  <a
                    href={`https://zalo.me/${BRAND.phoneRaw}?text=${encodeURIComponent(
                      `Chào Thầy Thành, tôi vừa đăng ký bản quyền Smart Listening Pro trên Web cho máy ${regMid}. Tôi gửi ảnh bill chuyển khoản nhờ Thầy duyệt kích hoạt giúp nhé!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Mở Zalo Gửi Ảnh Bill ({BRAND.phone})
                  </a>
                  <button
                    onClick={() => setRegSuccess(false)}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                  >
                    Đăng ký máy khác
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitRegister} className="space-y-3 bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
                <div className="p-2.5 rounded-xl bg-blue-950/50 border border-blue-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-cyan-400" />
                    <span className="text-slate-300">
                      Mã máy đã được tự động nhận diện: <b className="text-cyan-300 font-mono">{detectedMid}</b>
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-md">
                    Tự Điền Sẵn
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Mã Máy Tính (Machine ID) *
                    </label>
                    <input
                      type="text"
                      required
                      value={regMid}
                      onChange={(e) => setRegMid(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-cyan-300 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Họ và Tên Thầy/Cô *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Nguyễn Thị Mai"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Số Điện Thoại Zalo *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ví dụ: 0988..."
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Gói Đăng Ký
                    </label>
                    <select
                      value={regPackage}
                      onChange={(e) => setRegPackage(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-amber-300 focus:outline-none focus:border-blue-500"
                    >
                      <option value="LIFETIME">👑 Trọn Đời (Vĩnh Viễn) - 150.000đ</option>
                      <option value="1YEAR">1 Năm (365 ngày) - 100.000đ</option>
                      <option value="2YEAR">2 Năm - 150.000đ</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Trường / Đơn Vị Công Tác
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Trường THCS Đồng Yên"
                    value={regSchool}
                    onChange={(e) => setRegSchool(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={regLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    <Send className="w-4 h-4" />
                    {regLoading ? 'Đang gửi thông tin...' : 'Gửi Đăng Ký Lên Cloud Thầy Thành'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* FOOTER ACTIONS */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row gap-2 mt-auto">
          <a
            href={BRAND.zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-teal-600/20"
          >
            <MessageCircle className="w-4 h-4" />
            Liên Hệ Thầy Thành Hỗ Trợ (Zalo: {BRAND.phone})
          </a>
          <button
            onClick={() => {
              stopPlayback();
              onClose();
            }}
            className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
