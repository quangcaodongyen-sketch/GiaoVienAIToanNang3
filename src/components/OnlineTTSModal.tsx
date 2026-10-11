import { TrialRegisterModal } from './TrialRegisterModal';
// Các mẫu kịch bản thuyết minh video hướng dẫn (Giọng Tác giả Đinh Thành & Nữ miền Bắc)
export const SAMPLE_VIDEO_TAO_DE = `Kính chào quý Thầy Cô! Hôm nay, tôi xin hướng dẫn quý Thầy Cô cách sử dụng phần mềm Tạo Đề Kiểm Tra THCS chuẩn Công văn 7991 của Bộ Giáo dục và Đào tạo.
Chỉ với một cú nhấp chuột, hệ thống sẽ tự động khởi tạo trọn bộ Ma trận đề, Bản đặc tả kỹ thuật và Đề kiểm tra in ấn A4 chuẩn mực, kèm theo hướng dẫn đáp án chi tiết.
Thầy Cô có thể chọn môn học, khối lớp, phân môn và xuất file Microsoft Word đầy đủ để sử dụng ngay trong công tác giảng dạy. Chúc quý Thầy Cô thực hiện thành công!`;

export const SAMPLE_VIDEO_ND30 = `Xin chào các đồng chí cán bộ và giáo viên!
Video hôm nay sẽ hướng dẫn quy trình chuẩn hóa văn bản hành chính theo đúng Nghị định 30 năm 2020 của Chính phủ.
Hệ thống sẽ tự động căn chỉnh lề giấy A4 chuẩn xác, tạo khung Quốc hiệu tiêu ngữ của Ủy ban nhân dân, Trường Trung học cơ sở , và khung chữ ký của Hiệu trưởng.
Chỉ trong chưa đầy một giây, văn bản của Thầy Cô sẽ đạt chuẩn khảo thí và thể thức văn bản quốc gia!`;

export const SAMPLE_VIDEO_ADDIN_WORD = `Xin chào quý Thầy Cô! Tôi là Tác giả Đinh Thành (ĐT: 0915.213717).
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
  FastForward,
  RefreshCw
} from 'lucide-react';
import { BRAND, SMART_LISTENING_RESOURCES } from '../config/brand';
import { licenseService } from '../services/licenseService';
import { cloudSyncService } from '../services/cloudSyncService';
import {
  verifySmartListeningLicenseKey,
  saveSmartListeningVIPActivation,
  isSmartListeningVIPActivated,
  SmartListeningVerifyResult
} from '../services/smartListeningKeyService';

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
      const p1 = Math.floor((1 + Math.random()) * 0x10000).toString(16).padStart(4, '0').toUpperCase();
      const p2 = Math.floor((1 + Math.random()) * 0x10000).toString(16).padStart(4, '0').toUpperCase();
      mid = `MB-${p1}-${p2}`;
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
  const [activeTab, setActiveTab] = useState<'download' | 'register'>('download');
  const [showTrialRegister, setShowTrialRegister] = useState<boolean>(false);

  // ID máy tính tự động
  const [detectedMid, setDetectedMid] = useState<string>('');
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

  // Trạng thái kích hoạt bằng mã Key Ed25519 & Đồng bộ Cloud
  const [inputKey, setInputKey] = useState('');
  const [verifyResult, setVerifyResult] = useState<SmartListeningVerifyResult | null>(null);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);

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

    // 1. Kiểm tra trạng thái VIP đã kích hoạt trước đó
    if (isSmartListeningVIPActivated()) {
      setIsProActivated(true);
      setProTeacherName('Quý Thầy/Cô');
    }

    // 2. Tự động kiểm tra trạng thái phê duyệt trên Cloud GitHub
    cloudSyncService.checkCurrentMachineCloudStatus(mid, 'smart-listening').then(res => {
      if (res.isApproved) {
        setIsProActivated(true);
        setProTeacherName(res.approvedBy || 'Admin Thầy Thành');
        localStorage.setItem('gvai_web_pro_mid', mid);
      }
    });

    // 3. Fallback licenseService cũ
    licenseService.checkOnlineLicense(mid).then(res => {
      if (res.isValid && res.record) {
        setIsProActivated(true);
        setProTeacherName(res.record.teacher_name || 'Thầy/Cô');
      }
    });
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
        alert('Thầy/Cô đã hoàn thành 5/5 lượt dùng thử tạo bài nghe tiếng Anh miễn phí trên máy tính này!\n\nQuý Thầy/Cô vui lòng bấm Liên hệ Zalo Thầy Thành (0915.213717) để nhận báo giá ưu đãi sư phạm và kích hoạt bản quyền tiếp tục sử dụng không giới hạn.');
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

  // Kích hoạt bản quyền trực tiếp bằng mã Key Ed25519 (TTS-Y1-... hoặc TTS-LT-...)
  const handleActivateKey = async () => {
    if (!inputKey.trim()) {
      alert('Vui lòng nhập hoặc dán mã kích hoạt bản quyền do Thầy Thành cấp!');
      return;
    }
    const res = await verifySmartListeningLicenseKey(inputKey.trim(), detectedMid);
    setVerifyResult(res);
    if (res.isValid) {
      saveSmartListeningVIPActivation(inputKey.trim(), detectedMid, res);
      setIsProActivated(true);
      setProTeacherName('Quý Thầy/Cô');
      alert(`🎉 CHÚC MỪNG QUÝ THẦY/CÔ!\n\nĐã kích hoạt thành công: ${res.packageName}!\nThời hạn: ${res.expiryDateStr}.\nThầy/Cô có thể tạo bài nghe không giới hạn số từ trên hệ thống.`);
    } else {
      alert(`❌ KÍCH HOẠT KHÔNG THÀNH CÔNG:\n\n${res.message}`);
    }
  };

  // Đồng bộ bản quyền trực tiếp từ GitHub Cloud
  const handleCloudSync = async () => {
    setIsSyncingCloud(true);
    try {
      const res = await cloudSyncService.checkCurrentMachineCloudStatus(detectedMid, 'smart-listening');
      if (res.isApproved) {
        setIsProActivated(true);
        setProTeacherName(res.approvedBy || 'Admin Thầy Thành');
        localStorage.setItem('gvai_web_pro_mid', detectedMid);
        const pkgText = res.packageType === 'LIFETIME' ? 'VIP Trọn Đời' : 'Bản quyền';
        alert(`🎉 ĐÃ ĐỒNG BỘ THÀNH CÔNG TỪ CLOUD!\n\nMã máy [${detectedMid}] đã được Admin duyệt kích hoạt gói ${pkgText}!\nThầy/Cô có thể sử dụng đầy đủ các tính năng không giới hạn.`);
      } else if (res.isBlocked) {
        setIsProActivated(false);
        alert('⚠️ Thiết bị này đang ở trạng thái tạm khóa trên Cloud.');
      } else {
        alert(`ℹ️ THÔNG BÁO TỪ CLOUD:\n\nĐơn đăng ký của máy [${detectedMid}] chưa được Admin phê duyệt hoặc đang chờ xử lý.\n\nQuý Thầy/Cô vui lòng nhắn tin Zalo Thầy Thành (0915.213717) để được duyệt kích hoạt nhanh trong 1 phút!`);
      }
    } catch (e) {
      alert('Lỗi kết nối kiểm tra Cloud. Vui lòng kiểm tra lại mạng internet.');
    } finally {
      setIsSyncingCloud(false);
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
      const cleanMid = regMid.trim().toUpperCase();
      const teacherName = regName.trim() || 'Thầy/Cô Giáo viên';
      const phoneZalo = regPhone.trim();
      const schoolUnit = regSchool.trim() || 'Trường THCS';

      // 1. Gửi trực tiếp lên GitHub Cloud Issues
      await cloudSyncService.submitRegistrationToCloud({
        machineId: cleanMid,
        fullName: teacherName,
        phoneNumber: phoneZalo,
        schoolUnit: schoolUnit,
        appId: 'smart-listening',
        appName: 'Smart Listening Pro (Tạo Bài Nghe Tiếng Anh)',
        packageType: regPackage === 'LIFETIME' ? 'LIFETIME' : regPackage === '2YEAR' ? '2YEAR' : '1YEAR'
      });

      // 2. Đồng thời lưu local/supabase
      try {
        await licenseService.register({
          machine_id: cleanMid,
          teacher_name: teacherName,
          phone_zalo: phoneZalo,
          school_unit: schoolUnit,
          package_type: regPackage
        });
      } catch {}

      setRegSuccess(true);

      // 3. Mở Zalo Thầy Thành gửi thông tin
      const zaloMsg = `KÍNH GỬI ADMIN THẦY THÀNH - ĐĂNG KÝ BẢN QUYỀN SMART LISTENING PRO (TẠO BÀI NGHE)
----------------------------------------
• Họ và tên: ${teacherName}
• Điện thoại / Zalo: ${phoneZalo}
• Đơn vị: ${schoolUnit}
• Mã máy tính: ${cleanMid}
• Gói đăng ký: ${regPackage === 'LIFETIME' ? 'VIP Trọn Đời' : regPackage === '2YEAR' ? 'Gói 2 Năm' : 'Gói 1 Năm'}
----------------------------------------
Kính nhờ Thầy kiểm tra và kích hoạt bản quyền giúp em. Em xin trân trọng cảm ơn!`;

      try {
        navigator.clipboard.writeText(zaloMsg);
      } catch {}

      const zaloUrl = `https://zalo.me/${BRAND.phoneRaw}?text=${encodeURIComponent(zaloMsg)}`;
      window.open(zaloUrl, '_blank');
    } catch (err) {
      console.error('Lỗi gửi đăng ký:', err);
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

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 px-1 gap-2">
                <span>💡 Video hướng dẫn chi tiết các bước lấy ID máy tính và mở khóa vĩnh viễn.</span>
                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href="/tao-bai-nghe-listening.mp4"
                    download="Huong_Dan_Smart_Listening_Pro.mp4"
                    className="text-emerald-400 hover:underline font-semibold flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Tải Video (.mp4)
                  </a>
                  <a
                    href="/tao-bai-nghe-listening.mp4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline font-semibold"
                  >
                    ▶ Xem tab mới
                  </a>
                </div>
              </div>
            </div>

            {/* 2. NÚT TẢI VỀ BẢN CÀI ĐẶT TRỰC TIẾP CHO GIÁO VIÊN (ZIP PASS 123 TRỰC TIẾP TỪ GITHUB RELEASES) */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-slate-900 to-teal-950/90 border border-emerald-500/40 space-y-3 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Phần Mềm Smart Listening Pro (Bản 1-Click Chạy Ngay)
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Dung lượng: <b>22.8 MB</b> – Đã nén mật khẩu bảo vệ <code className="text-amber-300 font-bold bg-amber-500/20 px-1.5 py-0.5 rounded">123</code> (giúp tải 100% tốc độ cao không bị trình duyệt hay Antivirus chặn).
                  </p>
                </div>

                {/* NÚT TẢI CHÍNH TRỌN BỘ CÀI PRO */}
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={SMART_LISTENING_RESOURCES.fullZipUrl}
                    download="Smart_Listening_Pro_Pass_123.zip"
                    className="py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
                    title="Tải bản nén zip trọn gói có mật khẩu 123 - Tránh chặn tải trên mọi trình duyệt"
                  >
                    <Download className="w-4 h-4" />
                    🚀 TẢI BỘ CÀI ĐẶT PRO (.ZIP - PASS: 123)
                  </a>
                </div>
              </div>

              {/* Hướng Dẫn Nhanh 3 Bước */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-emerald-500/20 text-[11px]">
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="font-bold text-emerald-400 block mb-0.5">Bước 1: Tải về máy</span>
                  <span className="text-slate-300">Bấm nút <strong>"🚀 Tải Bộ Cài Đặt Pro"</strong> ở trên để tải file nén .ZIP siêu tốc từ GitHub Releases.</span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="font-bold text-emerald-400 block mb-0.5">Bước 2: Giải nén bằng mật khẩu 123</span>
                  <span className="text-slate-300">Nhấp chuột phải vào file ZIP ➔ Chọn <em>Extract Here</em> ➔ Nhập mật khẩu: <strong className="text-amber-300">123</strong>.</span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="font-bold text-emerald-400 block mb-0.5">Bước 3: Chạy ứng dụng</span>
                  <span className="text-slate-300">Nhấp đúp mở file <code>Smart Listening Pro.exe</code> để bắt đầu tạo bài nghe Tiếng Anh ngay!</span>
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
        {/* TAB 3: BẢN QUYỀN & KÍCH HOẠT (CHUẨN FORM NHẬN DIỆN THẦY Đinh Thành)   */}
        {/* ========================================================================= */}
        {activeTab === 'register' && (
          <div className="space-y-4 max-w-3xl mx-auto flex-1 overflow-y-auto pr-1 text-xs">
            {/* KHỐI 1: THÔNG TIN TÁC GIẢ & BẢN QUYỀN */}
            <div className="p-4 rounded-2xl bg-[#17143A] border-2 border-indigo-500/60 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 bg-indigo-950 flex items-center justify-center shadow-md">
                  <img
                    src="/dinhvanthanh.jpg"
                    alt="Tác giả Đinh Thành"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <Crown className="w-7 h-7 text-amber-400" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wide">
                    TÁC GIẢ & BẢN QUYỀN: TÁC GIẢ ĐINH THÀNH - ĐT: 0915.213717
                  </h4>
                  <p className="text-xs text-slate-200">
                     • Hotline / Zalo: <strong>0915.213717</strong>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    • Phần mềm: <strong>SMART LISTENING PRO (TẠO BÀI NGHE SGK TIẾNG ANH)</strong>
                  </p>
                  <p className="text-[10px] text-slate-400 italic mt-0.5">
                    * Công cụ hỗ trợ, tham khảo dành cho giáo viên.
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                <a
                  href={`https://zalo.me/${BRAND.phoneRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
                >
                  <MessageCircle className="w-4 h-4" /> Chat Zalo Thầy Thành
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("0915213717");
                    alert("Đã sao chép SĐT Thầy Thành: 0915.213717");
                  }}
                  className="flex-1 sm:flex-none py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center justify-center gap-1 transition"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy SĐT: 0915.213717
                </button>
              </div>
            </div>

            {/* KHỐI 2: THÔNG TIN BẢN QUYỀN CỦA MÁY TÍNH */}
            {isProActivated ? (
              /* TRƯỜNG HỢP A: ĐÃ KÍCH HOẠT PRO THÀNH CÔNG */
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-[#022C22] border-2 border-emerald-500 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    BẢN QUYỀN CHÍNH THỨC - ĐÃ KÍCH HOẠT PRO THÀNH CÔNG
                  </span>
                  <span className="text-xs text-amber-300 font-mono font-bold">PRO EDITION</span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-400/40 space-y-1">
                  <span className="text-xs font-bold text-emerald-200 block">
                    ✨ TRẠNG THÁI SỬ DỤNG:
                  </span>
                  <div className="text-xl font-black text-amber-300">
                    BẢN QUYỀN HOẠT ĐỘNG KHÔNG GIỚI HẠN
                  </div>
                  <p className="text-[11px] text-emerald-200">
                    • Người dùng: <strong>{proTeacherName || 'Quý Thầy/Cô'}</strong> &nbsp;|&nbsp; • Mã máy: <strong className="font-mono text-cyan-300">{detectedMid}</strong>
                  </p>
                </div>

                {/* Hộp dán key gia hạn */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-2">
                  <label className="text-[11px] text-slate-300 block font-bold">
                    🔑 Gia hạn bản quyền hoặc nhập mã kích hoạt mới:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputKey}
                      onChange={(e) => setInputKey(e.target.value)}
                      placeholder="Dán mã kích hoạt tại đây (TTS-Y1-... hoặc TTS-LT-...)"
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-400 uppercase"
                    />
                    <button
                      onClick={handleActivateKey}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 cursor-pointer"
                    >
                      ⚡ Cập nhật Key
                    </button>
                  </div>
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
            ) : (
              /* TRƯỜNG HỢP B: CHƯA KÍCH HOẠT HOẶC ĐANG DÙNG THỬ (5 LẦN) */
              <div className="p-5 rounded-2xl bg-slate-900 border-2 border-amber-500/50 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    🎁 CHẾ ĐỘ DÙNG THỬ TRỰC TUYẾN
                  </span>
                  <span className="text-xs text-amber-400 font-mono font-bold">5 LẦN MIỄN PHÍ / MÁY TÍNH</span>
                </div>

                {/* Hộp đếm lượt dùng thử 5 chấm */}
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-200 block">
                      SỐ LƯỢT TẠO BÀI NGHE MIỄN PHÍ CÒN LẠI:
                    </span>
                    <div className="text-2xl font-black text-amber-300 mt-0.5">
                      CÒN {trialRemaining} / 5 LƯỢT
                    </div>
                  </div>
                  <div className="flex gap-1.5 text-lg">
                    {[1, 2, 3, 4, 5].map((dot) => (
                      <span key={dot} className={dot <= trialRemaining ? 'text-amber-400' : 'text-slate-600'}>
                        ●
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mã máy tính nhận diện */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      MÃ MÁY TÍNH NHẬN DIỆN (HARDWARE CODE):
                    </span>
                    <span className="text-sm sm:text-base font-mono font-black text-cyan-300">
                      {detectedMid}
                    </span>
                  </div>
                  <button
                    onClick={copyMachineIdToClipboard}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copiedMid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedMid ? 'Đã chép' : 'Sao chép mã'}</span>
                  </button>
                </div>

                {/* Ô DÁN MÃ KÍCH HOẠT PRO TRỰC TIẾP */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-300 block flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-400" />
                    ĐÃ CÓ MÃ BẢN QUYỀN TỪ THẦY THÀNH? DÁN VÀO ĐÂY ĐỂ MỞ KHÓA PRO:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputKey}
                      onChange={(e) => setInputKey(e.target.value)}
                      placeholder="Dán mã kích hoạt (Ví dụ: TTS-Y1-... hoặc TTS-LT-...)"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-400 uppercase"
                    />
                    <button
                      onClick={handleActivateKey}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 cursor-pointer shadow-md transition-all hover:scale-[1.02]"
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

                {/* NÚT ĐỒNG BỘ BẢN QUYỀN TỪ WEB CLOUD */}
                <button
                  onClick={handleCloudSync}
                  disabled={isSyncingCloud}
                  className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncingCloud ? 'animate-spin' : ''}`} />
                  <span>{isSyncingCloud ? 'ĐANG KẾT NỐI VÀ ĐỒNG BỘ TỪ WEB CLOUD...' : '🔄 CẬP NHẬT / ĐỒNG BỘ BẢN QUYỀN TỪ WEB CLOUD (LÀM MỚI TỨC THÌ)'}</span>
                </button>

                {/* CHÍNH SÁCH BẢN QUYỀN ƯU ĐÃI SƯ PHẠM (TUYỆT ĐỐI KHÔNG HIỂN THỊ GIÁ TIỀN CỐ ĐỊNH) */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/40 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                          👑 CHÍNH SÁCH BẢN QUYỀN
                        </span>
                        <span className="text-[10px] text-amber-400 font-semibold">Ưu Đãi Sư Phạm</span>
                      </div>
                      <h4 className="text-sm font-black text-white mt-1">
                        Báo Giá Ưu Đãi & Hỗ Trợ Kỹ Thuật Trọn Gói
                      </h4>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <div className="text-xs font-bold text-cyan-400">
                        Liên Hệ Zalo Thầy Thành: {BRAND.phone}
                      </div>
                      <p className="text-[10px] text-slate-400">Tùy chọn: Gói 1 Năm • Gói 2 Năm • VIP Trọn Đời</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <div className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span><strong>Trợ giá giáo dục:</strong> Chi phí hỗ trợ giáo viên tối ưu, báo giá ưu đãi trực tiếp qua Zalo.</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span><strong>Tạo bài nghe SGK tiếng Anh:</strong> Giọng đọc Anh - Mỹ tự nhiên chuẩn bản xứ, xuất file MP3 không giới hạn số từ.</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span><strong>Cài đặt UltraViewer miễn phí:</strong> Hỗ trợ cài trọn gói từ xa, bảo hành hỗ trợ 24/7.</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span><strong>Cập nhật dài lâu:</strong> Miễn phí cập nhật giọng đọc và thuật toán AI tổng hợp âm thanh mới nhất.</span>
                    </div>
                  </div>

                  {/* Nút bấm liên hệ Zalo báo giá */}
                  <a
                    href={`https://zalo.me/${BRAND.phoneRaw}?text=${encodeURIComponent(
                      `Chào Thầy Thành, tôi muốn nhận tư vấn và báo giá ưu đãi sư phạm phần mềm Smart Listening Pro. Mã máy của tôi: ${detectedMid}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition active:scale-[0.98] cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-amber-300" />
                    Nhắn Tin Zalo Nhận Báo Giá Chi Tiết ({BRAND.phone})
                  </a>
                </div>

                {/* FORM ĐĂNG KÝ BẢN QUYỀN GỬI CLOUD */}
                {regSuccess ? (
                  <div className="p-5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-center space-y-2.5">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-emerald-300 uppercase">
                      ĐÃ GỬI THÔNG TIN ĐĂNG KÝ LÊN WEB CLOUD THẦY THÀNH!
                    </h4>
                    <p className="text-xs text-slate-300 max-w-md mx-auto">
                      Hệ thống đã ghi nhận mã máy <b className="text-cyan-300 font-mono">{regMid}</b> của Thầy/Cô. Thầy Thành sẽ kiểm tra và cấp mã kích hoạt trong ít phút.
                    </p>

                    <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                      <a
                        href={`https://zalo.me/${BRAND.phoneRaw}?text=${encodeURIComponent(
                          `Chào Thầy Thành, tôi vừa đăng ký bản quyền Smart Listening Pro trên Web cho máy ${regMid}. Tôi gửi ảnh bill chuyển khoản nhờ Thầy duyệt kích hoạt giúp nhé!`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Mở Zalo Nhận Key ({BRAND.phone})
                      </a>
                      <button
                        onClick={() => setRegSuccess(false)}
                        className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                      >
                        Đăng ký máy khác
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitRegister} className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                      📝 ĐĂNG KÝ BẢN QUYỀN PRO - GỬI LÊN WEB CLOUD ADMIN TỨC THÌ:
                    </h5>

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
                          className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs text-cyan-300 focus:outline-none focus:border-blue-500 uppercase"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">
                          Họ và Tên Thầy/Cô *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ví dụ: Thầy Nguyễn Văn A"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
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
                          placeholder="Ví dụ: 0915..."
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">
                          Gói Đăng Ký
                        </label>
                        <select
                          value={regPackage}
                          onChange={(e) => setRegPackage(e.target.value as any)}
                          className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-amber-300 focus:outline-none focus:border-blue-500"
                        >
                          <option value="LIFETIME">👑 Gói Bản Quyền VIP Trọn Đời (Khuyên Dùng)</option>
                          <option value="1YEAR">Gói Bản Quyền 1 Năm (365 ngày)</option>
                          <option value="2YEAR">Gói Bản Quyền 2 Năm</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        Trường / Đơn Vị Công Tác
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Trường THCS"
                        value={regSchool}
                        onChange={(e) => setRegSchool(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={regLoading}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      {regLoading ? 'Đang gửi thông tin lên Cloud...' : 'GỬI ĐĂNG KÝ BẢN QUYỀN LÊN WEB CLOUD (TỨC THÌ)'}
                    </button>
                  </form>
                )}
              </div>
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
          <TrialRegisterModal isOpen={showTrialRegister} onClose={() => setShowTrialRegister(false)} initialAppId="smart-listening" initialAppName="Smart Listening Pro" />
</div>
  );
};
