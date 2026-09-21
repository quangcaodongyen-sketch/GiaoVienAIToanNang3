import React, { useState, useEffect, useRef } from "react";
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
  Send
} from "lucide-react";
import { BRAND } from "../config/brand";
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
  const [activeTab, setActiveTab] = useState<"demo" | "download" | "license">("demo");

  // Recording states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [recordError, setRecordError] = useState<string>("");

  // Options
  const [includeMic, setIncludeMic] = useState<boolean>(true);
  const [includeCamera, setIncludeCamera] = useState<boolean>(false);
  const [enableVtvFilter, setEnableVtvFilter] = useState<boolean>(true);
  const [cursorHaloColor, setCursorHaloColor] = useState<string>("#FFD700"); // Gold
  const [haloRadius, setHaloRadius] = useState<number>(30);
  const [haloOpacity, setHaloOpacity] = useState<number>(0.5);

  // License & Security states
  const [hardwareCode, setHardwareCode] = useState<string>("");
  const [trialRemaining, setTrialRemaining] = useState<number>(5);
  const [isProActive, setIsProActive] = useState<boolean>(false);
  const [licenseInputKey, setLicenseInputKey] = useState<string>("");
  const [activationError, setActivationError] = useState<string>("");
  const [activationSuccess, setActivationSuccess] = useState<string>("");
  const [copiedHw, setCopiedHw] = useState<boolean>(false);

  // Audio VU Meter simulation
  const [vuLevel, setVuLevel] = useState<number>(20);

  // References
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<any>(null);
  const cameraVideoRef = useRef<HTMLVideoElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

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
            setIsProActive(false);
            getSecureRecordTrialRemaining(hw).then(rem => setTrialRemaining(rem));
          }
        });
      } else {
        getSecureRecordTrialRemaining(hw).then(rem => setTrialRemaining(rem));
      }
    }
  }, [isOpen]);

  // Timer interval
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
        // Simulate VU Meter jitter
        if (includeMic) {
          setVuLevel(Math.floor(35 + Math.random() * 55));
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

  // Clean up media streams on unmount or close
  useEffect(() => {
    return () => {
      stopAllTracks();
    };
  }, []);

  if (!isOpen) return null;

  const stopAllTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Start Screen Recording
  const handleStartRecording = async () => {
    setRecordError("");

    // Security check: Trial Quota
    if (!isProActive) {
      const rem = await getSecureRecordTrialRemaining(hardwareCode);
      if (rem <= 0) {
        setRecordError("Bạn đã sử dụng hết 5 lượt quay thử nghiệm trên thiết bị này. Vui lòng kích hoạt Bản Quyền Pro để ghi hình không giới hạn!");
        setActiveTab("license");
        return;
      }
    }

    try {
      // 1. Capture Display
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 60 }
        },
        audio: true
      });

      let finalStream = displayStream;

      // 2. Mix with Microphone if requested
      if (includeMic) {
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            }
          });

          // Mix audio tracks
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const dest = audioContext.createMediaStreamDestination();

          if (displayStream.getAudioTracks().length > 0) {
            const sysSource = audioContext.createMediaStreamSource(new MediaStream(displayStream.getAudioTracks()));
            sysSource.connect(dest);
          }

          if (micStream.getAudioTracks().length > 0) {
            const micSource = audioContext.createMediaStreamSource(new MediaStream(micStream.getAudioTracks()));
            // VTV filter gain simulation
            const gainNode = audioContext.createGain();
            gainNode.gain.value = enableVtvFilter ? 1.25 : 1.0;
            micSource.connect(gainNode);
            gainNode.connect(dest);
          }

          const mixedTracks = [
            ...displayStream.getVideoTracks(),
            ...dest.stream.getAudioTracks()
          ];
          finalStream = new MediaStream(mixedTracks);
        } catch (micErr) {
          console.warn("Không thể thu âm Micro:", micErr);
        }
      }

      streamRef.current = finalStream;
      const chunks: Blob[] = [];

      // Create MediaRecorder
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
        setRecordedVideoUrl(videoUrl);
        setRecordedChunks(chunks);
        setIsRecording(false);
        setIsPaused(false);
        stopAllTracks();

        // Consume trial
        if (!isProActive) {
          const nextRem = await consumeSecureRecordTrial(hardwareCode);
          setTrialRemaining(nextRem);
        }
      };

      // Handle user clicking "Stop Sharing" on browser banner
      displayStream.getVideoTracks()[0].onended = () => {
        if (recorder.state !== "inactive") {
          recorder.stop();
        }
      };

      recorder.start(1000);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setRecordedVideoUrl(null);
    } catch (err: any) {
      console.error(err);
      if (err.name !== "NotAllowedError") {
        setRecordError(err.message || "Không thể khởi tạo quay màn hình. Vui lòng cấp quyền truy cập trình duyệt.");
      }
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
    a.download = `Screen_Record_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "_")}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-6xl w-full p-4 sm:p-6 text-white shadow-2xl my-auto max-h-[96vh] flex flex-col">
        
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
              onClick={() => setActiveTab("demo")}
              className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                activeTab === "demo"
                  ? "bg-gradient-to-r from-rose-600 to-red-500 text-white shadow-md shadow-rose-600/20"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Video className="w-4 h-4" />
              1. Trải Nghiệm Quay Trực Tuyến
            </button>

            <button
              onClick={() => setActiveTab("download")}
              className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                activeTab === "download"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Play className="w-4 h-4" />
              2. Tải Về Desktop & Video HD
            </button>

            <button
              onClick={() => setActiveTab("license")}
              className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                activeTab === "license"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Crown className="w-4 h-4" />
              3. Bản Quyền & Kích Hoạt
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
        {activeTab === "demo" && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
            
            {/* RECORDING CONTROL PANEL */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${isRecording ? "bg-red-500 animate-ping" : "bg-emerald-400"}`} />
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    {isRecording ? (
                      <span className="text-rose-400 flex items-center gap-2">
                        <span>ĐANG GHI HÌNH:</span>
                        <span className="font-mono text-base font-black text-amber-300">{formatTime(recordingTime)}</span>
                        {isPaused && <span className="text-xs text-amber-400 font-bold">(ĐANG TẠM DỪNG)</span>}
                      </span>
                    ) : (
                      <span className="text-slate-200">PHÒNG THU QUAY MÀN HÌNH & GHI ÂM BÀI GIẢNG (ONLINE STUDIO)</span>
                    )}
                  </h3>
                </div>

                {/* AUDIO VU METER */}
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  <Volume2 className={`w-4 h-4 ${includeMic ? "text-emerald-400" : "text-slate-500"}`} />
                  <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 transition-all duration-150"
                      style={{ width: `${includeMic ? vuLevel : 0}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {includeMic ? `${vuLevel} dB` : "MUTE"}
                  </span>
                </div>
              </div>

              {/* TOGGLES BAR */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {/* 1. Mic toggle */}
                <button
                  type="button"
                  onClick={() => setIncludeMic(!includeMic)}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all cursor-pointer ${
                    includeMic
                      ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
                      : "bg-slate-900 border-slate-800 text-slate-500"
                  }`}
                >
                  {includeMic ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4" />}
                  <span>{includeMic ? "Microphone: BẬT" : "Microphone: TẮT"}</span>
                </button>

                {/* 2. VTV Broadcast Filter toggle */}
                <button
                  type="button"
                  onClick={() => setEnableVtvFilter(!enableVtvFilter)}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all cursor-pointer ${
                    enableVtvFilter
                      ? "bg-amber-950/40 border-amber-500/50 text-amber-300"
                      : "bg-slate-900 border-slate-800 text-slate-500"
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{enableVtvFilter ? "Lọc Âm VTV: BẬT" : "Lọc Âm: TẮT"}</span>
                </button>

                {/* 3. Halo Spotlight Color */}
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between px-3">
                  <span className="text-slate-400 font-medium">Spotlight Chuột:</span>
                  <div className="flex gap-1">
                    {["#FFD700", "#00E5FF", "#00E676", "#FF3366"].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setCursorHaloColor(color)}
                        style={{ backgroundColor: color }}
                        className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                          cursorHaloColor === color ? "scale-125 ring-2 ring-white" : "opacity-70 hover:opacity-100"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* 4. Halo Radius / Opacity */}
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between px-3">
                  <span className="text-slate-400 font-medium">Bán kính: {haloRadius}px</span>
                  <input
                    type="range"
                    min="15"
                    max="50"
                    value={haloRadius}
                    onChange={(e) => setHaloRadius(Number(e.target.value))}
                    className="w-20 accent-rose-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* ACTION BUTTONS BAR */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/80">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Monitor className="w-3.5 h-3.5 text-blue-400" />
                  <span>Hỗ trợ quay Toàn màn hình, Cửa sổ PowerPoint, Word hoặc Tab bài giảng.</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      disabled={!isProActive && trialRemaining <= 0}
                      className={`w-full sm:w-auto py-3 px-8 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer ${
                        !isProActive && trialRemaining <= 0
                          ? "bg-rose-900/60 text-rose-300 border border-rose-500/50 cursor-not-allowed"
                          : "bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white shadow-rose-600/30 hover:scale-[1.02]"
                      }`}
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>BẮT ĐẦU QUAY MÀN HÌNH (F9) {!isProActive && `(${trialRemaining} lượt)`}</span>
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handlePauseResume}
                        className="py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
                      >
                        {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4 fill-white" />}
                        <span>{isPaused ? "Tiếp Tục (Resume)" : "Tạm Dừng (Pause)"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleStopRecording}
                        className="py-2.5 px-6 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-600/30"
                      >
                        <Square className="w-4 h-4 fill-white" />
                        <span>DỪNG & XEM VIDEO</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCancelRecording}
                        className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        <span>Hủy</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {recordError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{recordError}</span>
                </div>
              )}
            </div>

            {/* RECORDED VIDEO PLAYBACK OR SIMULATOR */}
            {recordedVideoUrl ? (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    KẾT QUẢ GHI HÌNH THÀNH CÔNG
                  </h4>
                  <button
                    type="button"
                    onClick={handleDownloadVideo}
                    className="py-2 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>TẢI VIDEO VỀ MÁY (.WEBM / .MP4)</span>
                  </button>
                </div>

                <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl max-h-[460px] flex items-center justify-center">
                  <video
                    src={recordedVideoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full max-h-[440px] object-contain"
                  />
                </div>
              </div>
            ) : (
              /* LIVE INTERACTIVE SIMULATION CANVAS (HALO & CURSOR PREVIEW) */
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Mô phỏng hiệu ứng Spotlight con trỏ chuột & Sóng nhấp chuột (Click Waves):
                  </span>
                  <span className="text-[11px] text-slate-400">
                    💡 Rê chuột và click thử vào ô bên dưới để trải nghiệm hiệu ứng thực tế
                  </span>
                </div>

                {/* INTERACTIVE SPOTLIGHT PREVIEW CONTAINER */}
                <div
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const halo = document.getElementById("cursor-halo-preview");
                    if (halo) {
                      halo.style.left = `${x}px`;
                      halo.style.top = `${y}px`;
                      halo.style.opacity = "1";
                    }
                  }}
                  onMouseLeave={() => {
                    const halo = document.getElementById("cursor-halo-preview");
                    if (halo) halo.style.opacity = "0";
                  }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const wave = document.createElement("div");
                    wave.className = "absolute rounded-full pointer-events-none animate-ping";
                    wave.style.left = `${x - 20}px`;
                    wave.style.top = `${y - 20}px`;
                    wave.style.width = "40px";
                    wave.style.height = "40px";
                    wave.style.border = "3px solid #FF3366";
                    e.currentTarget.appendChild(wave);
                    setTimeout(() => wave.remove(), 600);
                  }}
                  className="relative h-64 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center cursor-crosshair select-none"
                >
                  {/* Spotlight Circle */}
                  <div
                    id="cursor-halo-preview"
                    style={{
                      width: `${haloRadius * 2}px`,
                      height: `${haloRadius * 2}px`,
                      backgroundColor: cursorHaloColor,
                      opacity: 0,
                      transform: "translate(-50%, -50%)",
                      boxShadow: `0 0 25px ${cursorHaloColor}`
                    }}
                    className="absolute rounded-full pointer-events-none transition-opacity duration-150"
                  />

                  <div className="text-center space-y-2 pointer-events-none z-10 p-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 mx-auto flex items-center justify-center text-amber-400 shadow-md">
                      <Video className="w-6 h-6" />
                    </div>
                    <h5 className="font-extrabold text-sm text-white">
                      BÀI GIẢNG ĐIỆN TỬ & MÀN HÌNH GIẢNG DẠY
                    </h5>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Khi bấm <strong className="text-rose-400">"Bắt đầu quay"</strong>, phần mềm sẽ ghi lại trọn vẹn màn hình bài giảng, lời giảng Micro chuẩn đài truyền hình và hiệu ứng trỏ chuột thu hút sự chú ý của học sinh.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TẢI VỀ DESKTOP & VIDEO HƯỚNG DẪN */}
        {activeTab === "download" && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
            {/* 1. TRÌNH PHÁT VIDEO FULL HD */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  Video giới thiệu thực tế & hướng dẫn sử dụng Screen Record Pro V2:
                </span>
                <span className="text-[11px] text-cyan-400 font-mono">Full HD 1080p 60fps</span>
              </div>

              {/* VIDEO CONTAINER */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster="/screenrecord_banner.png"
                  className="w-full aspect-video max-h-[340px] object-contain bg-black"
                >
                  <source src="/screen_record_demo.mp4" type="video/mp4" />
                  Trình duyệt không hỗ trợ xem video trực tiếp.
                </video>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 px-1 gap-2">
                <span>💡 Video quay thực tế trên màn hình máy tính của Thầy Thành thể hiện độ nét cao và âm thanh lọc trong trẻo.</span>
                <a
                  href="/screen_record_demo.mp4"
                  download="Screen_Record_Pro_V2_Demo.mp4"
                  className="text-cyan-400 hover:underline font-semibold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  Tải Video MP4 Về Máy
                </a>
              </div>
            </div>

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
                  href="/Screen_Record_Pro_V2.exe"
                  download="Screen_Record_Pro_V2.exe"
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
                  href="/Screen_Record_Pro_V2.exe"
                  download="Screen_Record_Pro_V2.exe"
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
                👉 Hãy sao chép Mã máy tính trên và gửi qua Zalo cho Thầy Đinh Văn Thành (<strong className="text-white">{BRAND.phone}</strong>) để nhận Key kích hoạt Pro.
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

            {/* PRICING TABLE */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="font-extrabold text-xs text-slate-300 uppercase tracking-wide">
                BẢNG GIÁ CÁC GÓI BẢN QUYỀN CHÍNH THỨC:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
                  <span className="font-bold text-slate-300 block text-xs">GÓI 1 NĂM</span>
                  <div className="text-xl font-extrabold text-white">100.000đ</div>
                  <span className="text-[11px] text-slate-400 block">Sử dụng 365 ngày</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
                  <span className="font-bold text-slate-300 block text-xs">GÓI 2 NĂM</span>
                  <div className="text-xl font-extrabold text-sky-400">150.000đ</div>
                  <span className="text-[11px] text-slate-400 block">Tiết kiệm 50.000đ</span>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-b from-rose-500/20 to-slate-900 border border-rose-500/60 text-center space-y-2 shadow-lg shadow-rose-500/10">
                  <span className="font-extrabold text-rose-300 block text-xs flex items-center justify-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    GÓI TRỌN ĐỜI (VIP)
                  </span>
                  <div className="text-2xl font-black text-rose-400">200.000đ</div>
                  <span className="text-[11px] text-rose-200 font-semibold block">Sử dụng vĩnh viễn không giới hạn</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* MODAL FOOTER */}
        <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div>
            Hệ sinh thái Giáo viên AI Toàn Năng – Thầy giáo {BRAND.author}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
          >
            Đóng Cửa Sổ
          </button>
        </div>

      </div>
    </div>
  );
};
