import { TrialRegisterModal } from './TrialRegisterModal';
import React, { useState, useEffect, useRef } from "react";
import { ModalSafeFooter } from "./ModalSafeFooter";
import {
  Video,
  Mic,
  MicOff,
  Square,
  Play,
  Pause,
  Download,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Crown,
  Key,
  Lock,
  Unlock,
  X,
  Volume2,
  Camera,
  CameraOff,
  Sparkles,
  Layers,
  Settings,
  Monitor,
  Radio,
  Share2,
  FileDown,
  RefreshCw,
  Send,
  Palette,
  Eraser,
  RotateCcw,
  PenTool,
  Type,
  Cast,
  Tv,
  MessageCircle
} from "lucide-react";
import { BRAND, SCREEN_RECORD_RESOURCES } from "../config/brand";
import {
  getOrCreateRecordHardwareCode,
  getSecureRecordTrialRemaining,
  consumeSecureRecordTrial,
  verifyRecordLicenseKey
} from "../services/recordKeyService";

interface ScreenRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

export const ScreenRecordModal: React.FC<ScreenRecordModalProps> = ({
  isOpen,
  onClose,
  onOpenAdmin
}) => {
  const [activeTab, setActiveTab] = useState<"download" | "license">("download");
  const [showTrialRegister, setShowTrialRegister] = useState<boolean>(false);

  // Recording mode: "screen" (Display Capture) | "whiteboard" (Studio Bảng Giảng Dạy Trực Tuyến)
  const [recordMode, setRecordMode] = useState<"screen" | "whiteboard">("screen");

  // Recording states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [recordedFileSize, setRecordedFileSize] = useState<string>("0 MB");
  const [recordError, setRecordError] = useState<string>("");

  // Options
  const [includeMic, setIncludeMic] = useState<boolean>(true);
  const [enableVtvFilter, setEnableVtvFilter] = useState<boolean>(true);
  const [cursorHaloColor, setCursorHaloColor] = useState<string>("#FFD700"); // Gold
  const [haloRadius, setHaloRadius] = useState<number>(30);

  // Whiteboard drawing tools
  const [penColor, setPenColor] = useState<string>("#00E5FF"); // Cyan neon
  const [penSize, setPenSize] = useState<number>(4);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [boardTheme, setBoardTheme] = useState<"chalkboard" | "dark" | "navy">("chalkboard");

  // License & Security states
  const [hardwareCode, setHardwareCode] = useState<string>("");
  const [trialRemaining, setTrialRemaining] = useState<number>(5);
  const [isProActive, setIsProActive] = useState<boolean>(true); // Miễn phí 100%
  const [licenseInputKey, setLicenseInputKey] = useState<string>("");
  const [activationError, setActivationError] = useState<string>("");
  const [activationSuccess, setActivationSuccess] = useState<string>("");
  const [copiedHw, setCopiedHw] = useState<boolean>(false);

  // Audio VU Meter
  const [vuLevel, setVuLevel] = useState<number>(20);

  // References
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<any>(null);
  const liveVideoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  // Khởi tạo bảng vẽ
  const initBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Nền bảng
    if (boardTheme === "chalkboard") {
      ctx.fillStyle = "#0c281e"; // Màu xanh bảng trường học
    } else if (boardTheme === "navy") {
      ctx.fillStyle = "#0a192f"; // Xanh navy công nghệ
    } else {
      ctx.fillStyle = "#090d16"; // Cyber Dark
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Kẻ lưới ô ly nhẹ sư phạm
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let x = 40; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 40; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Tiêu đề mẫu mở đầu
    ctx.fillStyle = "#F59E0B";
    ctx.font = "bold 24px 'Segoe UI', Tahoma, Arial";
    ctx.fillText("✨ BÀI GIẢNG ĐIỆN TỬ - THẦY GIÁO ĐINH VĂN THÀNH (0915.213717)", 40, 50);

    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "16px 'Segoe UI', Tahoma, Arial";
    ctx.fillText("Dùng chuột hoặc bút cảm ứng viết bảng trực tiếp tại đây, bấm 'Bắt Đầu Ghi Hình' để tạo video bài giảng.", 40, 85);
  };

  // Lắng nghe phím Escape (Esc) để đóng modal ngay lập tức
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Esc") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && (activeTab as any) === "demo" && recordMode === "whiteboard") {
      setTimeout(initBoard, 100);
    }
  }, [isOpen, activeTab, recordMode, boardTheme]);

  // Load hardware code & license on open
  useEffect(() => {
    if (isOpen) {
      const hw = getOrCreateRecordHardwareCode();
      setHardwareCode(hw);

      const savedKey = localStorage.getItem("gvai_record_license_key");
      if (savedKey) {
        verifyRecordLicenseKey(savedKey, hw).then(res => {
          if (res.isValid) {
            setIsProActive(true);
          } else {
            setIsProActive(true);
            setTrialRemaining(999999);
          }
        });
      } else {
        setIsProActive(true);
        setTrialRemaining(999999);
      }
    }
  }, [isOpen]);

  // Timer interval
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
        if (includeMic) {
          setVuLevel(Math.floor(40 + Math.random() * 50));
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setVuLevel(10);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused, includeMic]);

  // Clean up on unmount or close
  useEffect(() => {
    return () => {
      stopAllTracks();
    };
  }, []);

  const stopAllTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Start Recording Handler (cả 2 chế độ Screen và Whiteboard)
  const handleStartRecording = async () => {
    setRecordError("");

    // Kiểm tra lượt dùng thử
    if (!isProActive) {
      const rem = await getSecureRecordTrialRemaining(hardwareCode);
      if (rem <= 0) {
        setRecordError("Thầy Cô đã sử dụng hết 5 lượt quay thử nghiệm trên thiết bị này. Vui lòng kích hoạt Bản Quyền Pro để ghi hình không giới hạn!");
        setActiveTab("license");
        return;
      }
    }

    try {
      let captureStream: MediaStream;

      if (recordMode === "screen") {
        // Chế độ 1: Quay Màn Hình Thật (Display Media API)
        try {
          captureStream = await navigator.mediaDevices.getDisplayMedia({
            video: {
              width: { ideal: 1920 },
              height: { ideal: 1080 },
              frameRate: { ideal: 60 }
            },
            audio: true
          });
        } catch (displayErr: any) {
          if (displayErr.name === "NotAllowedError") {
            setRecordError("Thầy Cô đã bấm hủy chia sẻ màn hình. Thầy Cô có thể bấm lại hoặc chuyển sang chế độ 'Studio Bảng Giảng Dạy' bên cạnh để thử nghiệm ngay lập tức!");
            return;
          }
          throw displayErr;
        }
      } else {
        // Chế độ 2: Studio Bảng Giảng Dạy Trực Tuyến (Interactive Canvas Capture)
        const canvas = canvasRef.current;
        if (!canvas) {
          setRecordError("Không tìm thấy khung bảng giảng dạy.");
          return;
        }
        captureStream = (canvas as any).captureStream(60);
      }

      let finalStream = captureStream;

      // Hòa trộn Micro nếu người dùng bật
      if (includeMic) {
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            }
          });

          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const dest = audioContext.createMediaStreamDestination();

          if (captureStream.getAudioTracks().length > 0) {
            const sysSource = audioContext.createMediaStreamSource(new MediaStream(captureStream.getAudioTracks()));
            sysSource.connect(dest);
          }

          if (micStream.getAudioTracks().length > 0) {
            const micSource = audioContext.createMediaStreamSource(new MediaStream(micStream.getAudioTracks()));
            const gainNode = audioContext.createGain();
            gainNode.gain.value = enableVtvFilter ? 1.3 : 1.0;
            micSource.connect(gainNode);
            gainNode.connect(dest);
          }

          const mixedTracks = [
            ...captureStream.getVideoTracks(),
            ...dest.stream.getAudioTracks()
          ];
          finalStream = new MediaStream(mixedTracks);
        } catch (micErr) {
          console.warn("Không thể thu âm Micro:", micErr);
        }
      }

      streamRef.current = finalStream;

      // Chiếu Live Video Monitor
      if (liveVideoRef.current && recordMode === "screen") {
        liveVideoRef.current.srcObject = finalStream;
        liveVideoRef.current.play().catch(e => console.warn(e));
      }

      const chunks: Blob[] = [];
      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
        ? "video/webm;codecs=vp9,opus"
        : MediaRecorder.isTypeSupported("video/webm")
          ? "video/webm"
          : "video/mp4";

      const recorder = new MediaRecorder(finalStream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const completeBlob = new Blob(chunks, { type: mimeType });
        const videoUrl = URL.createObjectURL(completeBlob);
        const sizeMb = (completeBlob.size / (1024 * 1024)).toFixed(2) + " MB";
        setRecordedFileSize(sizeMb);
        setRecordedVideoUrl(videoUrl);
        setRecordedChunks(chunks);
        setIsRecording(false);
        setIsPaused(false);
        stopAllTracks();

        // Trừ 1 lượt dùng thử
        if (!isProActive) {
          const nextRem = await consumeSecureRecordTrial(hardwareCode);
          setTrialRemaining(nextRem);
        }
      };

      // Xử lý khi người dùng ấn nút "Stop Sharing" trên thanh duyệt trình
      if (captureStream.getVideoTracks().length > 0) {
        captureStream.getVideoTracks()[0].onended = () => {
          if (recorder.state !== "inactive") {
            recorder.stop();
          }
        };
      }

      recorder.start(1000);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setRecordedVideoUrl(null);
    } catch (err: any) {
      console.error(err);
      setRecordError(err.message || "Không thể khởi tạo ghi hình. Vui lòng kiểm tra quyền truy cập trình duyệt hoặc thử chế độ Bảng Giảng Dạy.");
    }
  };

  const handlePauseResume = () => {
    if (!mediaRecorderRef.current) return;
    if (mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    } else if (mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const handleCancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    stopAllTracks();
    setIsRecording(false);
    setIsPaused(false);
    setRecordedVideoUrl(null);
    setRecordedChunks([]);
  };

  const handleDownloadVideo = () => {
    if (!recordedVideoUrl) return;
    const a = document.createElement("a");
    a.href = recordedVideoUrl;
    a.download = `Bai_Giang_Screen_Record_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "_")}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Thao tác vẽ bảng tương tác
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    lastPosRef.current = {
      x: (e.clientX - rect.left) * (e.currentTarget.width / rect.width),
      y: (e.clientY - rect.top) * (e.currentTarget.height / rect.height)
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Di chuyển spotlight chuột
    const rect = e.currentTarget.getBoundingClientRect();
    const halo = document.getElementById("cursor-halo-preview");
    if (halo) {
      halo.style.left = `${e.clientX - rect.left}px`;
      halo.style.top = `${e.clientY - rect.top}px`;
      halo.style.opacity = "1";
    }

    if (!isDrawingRef.current || !lastPosRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const currentX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const currentY = (e.clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(currentX, currentY);
    ctx.strokeStyle = isEraser ? (boardTheme === "chalkboard" ? "#0c281e" : boardTheme === "navy" ? "#0a192f" : "#090d16") : penColor;
    ctx.lineWidth = isEraser ? penSize * 5 : penSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    lastPosRef.current = { x: currentX, y: currentY };
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
  };

  const insertTemplateTopic = (title: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = penColor;
    ctx.font = "bold 28px 'Segoe UI', Tahoma, Arial";
    ctx.fillText(title, 50, 160 + Math.random() * 80);
  };

  const handleActivatePro = async (e: React.FormEvent) => {
    e.preventDefault();
    setActivationError("");
    setActivationSuccess("");

    const key = licenseInputKey.trim().toUpperCase();
    if (!key) {
      setActivationError("Vui lòng nhập mã kích hoạt Pro!");
      return;
    }

    const res = await verifyRecordLicenseKey(key, hardwareCode);
    if (res.isValid) {
      localStorage.setItem("gvai_record_license_key", key);
      setIsProActive(true);
      setActivationSuccess(`Chúc mừng Thầy/Cô đã kích hoạt thành công ${res.packageName}!`);
    } else {
      setActivationError(res.message || "Mã kích hoạt không đúng hoặc không khớp với mã máy này!");
    }
  };

  const handleCopyHardwareCode = () => {
    navigator.clipboard.writeText(hardwareCode);
    setCopiedHw(true);
    setTimeout(() => setCopiedHw(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-6xl w-full p-4 sm:p-6 text-white shadow-2xl my-auto max-h-[96vh] flex flex-col cursor-default"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER MODAL */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 flex items-center justify-center text-white font-black shadow-lg shadow-rose-600/20">
              <Video className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-xl font-black text-white tracking-tight">
                  SCREEN RECORD PRO V2 (QUAY MÀN HÌNH BTV)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] sm:text-xs font-extrabold flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-400" />
                  BẢN QUYỀN PRO
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  LỌC ÂM CHUẨN VTV
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Tác giả: Thầy giáo {BRAND.author} – Quay màn hình Full HD 60fps, lọc tạp âm chuẩn BTV Đài VTV & hiệu ứng con trỏ chuột Spotlight
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30 text-xs font-bold transition-all"
                title="Cổng quản trị sinh key cho Thầy Thành"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Key</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* NAVIGATION 3 TABS TIÊU CHUẨN */}
        <div className="flex items-center justify-between border-b border-slate-800 my-3 pb-2 gap-2 overflow-x-auto text-xs font-bold">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("download")}
              className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${activeTab === "download"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
            >
              <Play className="w-4 h-4" />
              1. Tải Bản Máy Tính Dùng Thử (.exe / .zip)
            </button>

            <button
              onClick={() => setActiveTab("license")}
              className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${activeTab === "license"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20"
                  : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
            >
              <Crown className="w-4 h-4" />
              2. Bản Quyền & Kích Hoạt Pro
            </button>
          </div>

          {/* TRIAL PROGRESS BADGE (5 CHẤM ● ● ● ○ ○) */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
            {isProActive ? (
              <span className="text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                PRO VĨNH VIỄN
              </span>
            ) : (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Quay thử:</span>
                <div className="flex gap-1 text-rose-400">
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <span
                      key={dot}
                      className={dot <= trialRemaining ? "text-rose-400 font-bold" : "text-slate-600 font-normal"}
                    >
                      ●
                    </span>
                  ))}
                </div>
                <span className="font-extrabold text-rose-300">
                  {trialRemaining}/5 lượt
                </span>
              </div>
            )}
          </div>
        </div>

        {/* TAB 1: TRẢI NGHIỆM TRỰC TUYẾN (WEB SCREEN RECORDER STUDIO) */}
        {activeTab === "download" && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
            

            {/* 2. BANNER TẢI BỘ CÀI DESKTOP */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/70 via-slate-900 to-amber-950/70 border border-rose-500/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-rose-200 flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-rose-400" />
                    Bộ Cài Đặt Desktop Phần Mềm Screen Record Pro V2 (Windows 10/11)
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Bao gồm file <code>Screen Record.exe</code> độc lập (16.4 MB), bộ xử lý âm thanh đa tầng chuẩn BTV Đài VTV, phím tắt F9/F10 và hiệu ứng con trỏ chuột tương tác.
                  </p>
                </div>

                <a
                  href={SCREEN_RECORD_RESOURCES.exeUrl}
                  download="CaiDat_Screen_Record_Pro_V2_QuayManHinh.exe"
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all hover:scale-105 shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Tải Bộ Cài (.exe 16.4 MB)
                </a>
              </div>
            </div>

            {/* 3. 3 LỰA CHỌN TẢI TIỆN ÍCH */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                    .EXE
                  </div>
                  <h5 className="font-bold text-slate-200 text-xs">Bản Portable Chạy Ngay</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Không cần cài đặt rườm rà. Tải về và nhấp đúp là có thể quay màn hình và thu âm ngay.
                  </p>
                </div>
                <a
                  href={SCREEN_RECORD_RESOURCES.exeUrl}
                  download="Screen_Record_Pro_V2_QuayManHinh_Portable.exe"
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  Tải File EXE
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    .ZIP
                  </div>
                  <h5 className="font-bold text-slate-200 text-xs">Bản Nén Đầy Đủ (Pass: 123)</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Trọn gói mã nguồn Python, script tạo biểu tượng ra màn hình Desktop và bộ lọc audio.
                  </p>
                </div>
                <a
                  href={BRAND.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  Nhận Bản Nén (Pass: 123)
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    .DOC
                  </div>
                  <h5 className="font-bold text-slate-200 text-xs">Cẩm Nang Kỹ Thuật Quay</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Tài liệu chia sẻ mẹo thiết lập micro không bị rè, căn chỉnh khung hình bài giảng Elearning.
                  </p>
                </div>
                <a
                  href={BRAND.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  Xem Cẩm Nang
                </a>
              </div>
            </div>

            {/* 4. HƯỚNG DẪN 4 BƯỚC SỬ DỤNG */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
              <h4 className="font-extrabold text-xs text-rose-300 uppercase tracking-wide">
                HƯỚNG DẪN NHANH DÀNH CHO THẦY CÔ:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-300">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <strong className="text-rose-400 block font-bold">1. Mở phần mềm hoặc quay trên Web</strong>
                  <p className="text-slate-400 leading-relaxed">
                    Mở file `Screen Record.exe` hoặc sử dụng trực tiếp Studio quay màn hình trên website này.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <strong className="text-amber-400 block font-bold">2. Bật Lọc âm chuẩn BTV VTV</strong>
                  <p className="text-slate-400 leading-relaxed">
                    Tích chọn bộ lọc âm để loại bỏ tiếng ồn máy quạt, xe cộ và giúp giọng nói ấm áp, rõ ràng.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <strong className="text-cyan-400 block font-bold">3. Phím tắt F9 / F10</strong>
                  <p className="text-slate-400 leading-relaxed">
                    Nhấn `F9` để Bắt đầu hoặc Dừng quay; nhấn `F10` để Tạm dừng khi chuyển bài giảng.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <strong className="text-emerald-400 block font-bold">4. Lưu video bài giảng MP4</strong>
                  <p className="text-slate-400 leading-relaxed">
                    File video MP4 xuất ra sắc nét, dung lượng tối ưu, có thể gửi ngay qua Zalo hoặc đưa lên YouTube.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BẢN QUYỀN & KÍCH HOẠT */}
        {activeTab === "license" && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">

            {/* HARDWARE CODE DISPLAY */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-400" />
                  Mã Máy Tính Thiết Bị Của Bạn (Hardware Code):
                </span>
                <span className="text-[11px] text-amber-400 font-mono font-bold">
                  Khóa Bản Quyền Vĩnh Viễn
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={hardwareCode}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-amber-500/50 font-mono text-sm uppercase text-amber-300 font-bold select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyHardwareCode}
                  className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 border border-slate-700 cursor-pointer"
                >
                  {copiedHw ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copiedHw ? "Đã copy!" : "Sao chép"}
                </button>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                👉 Hãy sao chép Mã máy tính trên và gửi qua Zalo cho Tác giả Đinh Thành (<strong className="text-white">{BRAND.phone}</strong>) để nhận Key kích hoạt Pro.
              </p>
            </div>

            {/* ACTIVATION INPUT FORM */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-teal-950/40 border border-emerald-500/40 space-y-3">
              <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" />
                NHẬP MÃ BẢN QUYỀN PRO ĐỂ KÍCH HOẠT
              </h4>

              <form onSubmit={handleActivatePro} className="space-y-3">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Dán mã kích hoạt tại đây (Ví dụ: REC-LT-3B9AC9FF-48A1B2C3)..."
                    value={licenseInputKey}
                    onChange={(e) => setLicenseInputKey(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs uppercase text-emerald-300 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 cursor-pointer"
                  >
                    <Unlock className="w-4 h-4" />
                    KÍCH HOẠT BẢN QUYỀN PRO NGAY
                  </button>

                  <a
                    href={BRAND.zaloUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Nhắn Zalo Thầy Thành: {BRAND.phone}
                  </a>
                </div>

                {activationSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{activationSuccess}</span>
                  </div>
                )}

                {activationError && (
                  <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500 text-rose-300 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>{activationError}</span>
                  </div>
                )}
              </form>
            </div>

            {/* BÁO GIÁ DUY NHẤT & ĐĂNG KÝ BẢN QUYỀN QUA ZALO */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-rose-950/20 to-slate-900 border-2 border-rose-500/40 text-center space-y-3.5 shadow-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                Báo Giá Bản Quyền Screen Record Pro
              </div>
              
              <h4 className="text-base font-extrabold text-white">
                Liên Hệ Nhận Báo Giá Chi Tiết & Hỗ Trợ Kích Hoạt Tức Thì
              </h4>

              <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
                Để phục vụ phù hợp nhất với nhu cầu sử dụng của từng Thầy/Cô (Gói 1 năm cá nhân, 2 năm tiết kiệm hoặc Gói Trọn Đời VIP), kính mời Thầy/Cô liên hệ trực tiếp qua Zalo của <strong>Thầy giáo {BRAND.author}</strong> để được tư vấn gói phù hợp và nhận báo giá ưu đãi sư phạm tốt nhất.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={`https://zalo.me/${BRAND.phoneRaw}?text=${encodeURIComponent(`Chào Thầy Thành, tôi muốn nhận báo giá bản quyền phần mềm Quay Màn Hình Screen Record Pro (Mã máy: ${hardwareCode}). Xin Thầy tư vấn chi tiết giúp tôi!`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-sm transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Nhận Báo Giá Chi Tiết Qua Zalo: {BRAND.phone}
                </a>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800/80">
                Thầy Thành hỗ trợ cài đặt từ xa qua UltraViewer / AnyDesk miễn phí 100% trọn đời.
              </div>
            </div>

          </div>
        )}

                <ModalSafeFooter onClose={onClose} />
</div>
          <TrialRegisterModal isOpen={showTrialRegister} onClose={() => setShowTrialRegister(false)} initialAppId="screen-record" initialAppName="Quay Màn Hình Screen Record Pro" />
</div>
  );
};
