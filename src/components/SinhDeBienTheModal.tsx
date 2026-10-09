import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Crown,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Eye,
  Key,
  Lock,
  Unlock,
  Play,
  X,
  Upload,
  Layers,
  ChevronRight,
  BookOpen,
  Send,
  Sliders,
  FileCode,
  ShieldAlert,
  MessageCircle
} from "lucide-react";
import { BRAND, SINH_DE_BIEN_THE_RESOURCES } from "../config/brand";
import {
  BientheSuiteData,
  BIENTHE_PRESETS,
  generateLocalPedagogicalVariants,
  generateVariantsWithGeminiClient,
  exportBientheToWordHtml
} from "../services/bientheGeneratorEngine";
import {
  getOrCreateBientheHardwareCode,
  getSecureBientheTrialRemaining,
  consumeSecureBientheTrial,
  verifyBientheLicenseKey
} from "../services/bientheKeyService";
import { cloudSyncService } from "../services/cloudSyncService";
import { webSecurityGuard } from "../services/webSecurityGuard";

interface SinhDeBienTheModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

export const SinhDeBienTheModal: React.FC<SinhDeBienTheModalProps> = ({
  isOpen,
  onClose,
  onOpenAdmin
}) => {
  const [activeTab, setActiveTab] = useState<"demo" | "download" | "license">("download");
  const [subTab, setSubTab] = useState<"var1" | "var2" | "var3" | "analysis">("var1");
  const [variantViewMode, setVariantViewMode] = useState<"exam" | "answers">("exam");

  // Input state
  const [originalExamText, setOriginalExamText] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<string>("Lớp 8");
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    base64: string;
    mimeType: string;
    size?: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Gemini API Key config
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [apiKeyInput, setApiKeyInput] = useState<string>(() => {
    return typeof window !== "undefined" ? localStorage.getItem("gvai_bienthe_gemini_key") || "" : "";
  });
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    return typeof window !== "undefined" ? localStorage.getItem("gvai_bienthe_model") || "gemini-2.5-flash" : "gemini-2.5-flash";
  });
  const [apiSaveSuccess, setApiSaveSuccess] = useState<boolean>(false);

  // Generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [suiteData, setSuiteData] = useState<BientheSuiteData | null>(null);

  // License & Security states
  const [hardwareCode, setHardwareCode] = useState<string>("");
  const [trialRemaining, setTrialRemaining] = useState<number>(5);
  const [isProActive, setIsProActive] = useState<boolean>(false);
  const [proLicenseInfo, setProLicenseInfo] = useState<any>(null);
  const [licenseInputKey, setLicenseInputKey] = useState<string>("");
  const [activationError, setActivationError] = useState<string>("");
  const [activationSuccess, setActivationSuccess] = useState<string>("");

  // Copy states
  const [copiedHw, setCopiedHw] = useState<boolean>(false);

  // Initialize Hardware & Trial on modal open
  useEffect(() => {
    if (isOpen) {
      const hw = getOrCreateBientheHardwareCode();
      setHardwareCode(hw);

      // Check saved Pro license
      const savedKey = localStorage.getItem("gvai_bienthe_license_key");
      if (savedKey) {
        verifyBientheLicenseKey(savedKey, hw).then(res => {
          if (res.isValid) {
            setIsProActive(true);
            setProLicenseInfo(res);
          } else {
            setIsProActive(false);
            getSecureBientheTrialRemaining(hw).then(rem => setTrialRemaining(rem));
          }
        });
      } else {
        getSecureBientheTrialRemaining(hw).then(rem => setTrialRemaining(rem));
      }
    }
  }, [isOpen]);

  // Lắng nghe phím Escape (Esc) để đóng modal ngay lập tức
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // File Upload Handlers
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processUpload(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processUpload(file);
  };

  const processUpload = (file: File) => {
    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage("Kích thước tệp quá lớn (tối đa 20MB). Vui lòng chọn tệp nhỏ hơn.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedFile({
        name: file.name,
        base64: reader.result as string,
        mimeType: file.type || "application/octet-stream",
        size: (file.size / 1024 / 1024).toFixed(2) + " MB"
      });
      setOriginalExamText("");
      setErrorMessage("");
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPreset = (preset: typeof BIENTHE_PRESETS[0]) => {
    setUploadedFile(null);
    setOriginalExamText(preset.content);
    setSelectedGrade(preset.grade);
    setErrorMessage("");
  };

  const handleSaveApiKey = () => {
    localStorage.setItem("gvai_bienthe_gemini_key", apiKeyInput.trim());
    localStorage.setItem("gvai_bienthe_model", selectedModel);
    setApiSaveSuccess(true);
    setTimeout(() => setApiSaveSuccess(false), 2000);
  };

  // Main Generation Action
  const handleGenerate = async () => {
    setErrorMessage("");

    // Security Check: Trial Quota
    if (!isProActive) {
      const remaining = await getSecureBientheTrialRemaining(hardwareCode);
      if (remaining <= 0) {
        setErrorMessage("Bạn đã dùng hết 5 lượt tạo thử nghiệm trên thiết bị này. Vui lòng kích hoạt Bản Quyền Pro để tiếp tục!");
        setActiveTab("license");
        return;
      }
    }

    if (!originalExamText.trim() && !uploadedFile) {
      setErrorMessage("Vui lòng tải lên file đề thi gốc hoặc chọn một đề kiểm tra mẫu bên dưới!");
      return;
    }

    setIsGenerating(true);

    try {
      let result: BientheSuiteData;

      if (apiKeyInput.trim()) {
        // Option 1: Live generation with Client-Side Gemini API
        result = await generateVariantsWithGeminiClient(
          apiKeyInput.trim(),
          selectedModel,
          originalExamText,
          uploadedFile ? { base64: uploadedFile.base64, mimeType: uploadedFile.mimeType } : undefined
        );
      } else {
        // Option 2: Fallback to high-quality pedagogical algorithm
        await new Promise(r => setTimeout(r, 1200)); // Smooth UI transition
        result = generateLocalPedagogicalVariants(originalExamText, selectedGrade);
      }

      setSuiteData(result);
      setSubTab("var1");
      setVariantViewMode("exam");

      // Deduct Trial
      if (!isProActive) {
        const nextRem = await consumeSecureBientheTrial(hardwareCode);
        setTrialRemaining(nextRem);
      }
    } catch (err: any) {
      console.error(err);
      // Fallback gracefully to built-in pedagogical variants if Gemini API encounters rate limit or errors
      const fallback = generateLocalPedagogicalVariants(originalExamText, selectedGrade);
      setSuiteData(fallback);
      setSubTab("var1");
      setVariantViewMode("exam");
      if (!isProActive) {
        const nextRem = await consumeSecureBientheTrial(hardwareCode);
        setTrialRemaining(nextRem);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // License Activation Action
  const handleActivatePro = async (e: React.FormEvent) => {
    e.preventDefault();
    setActivationError("");
    setActivationSuccess("");

    const key = licenseInputKey.trim().toUpperCase();
    if (!key) {
      setActivationError("Vui lòng nhập mã kích hoạt Pro!");
      return;
    }

    const res = await verifyBientheLicenseKey(key, hardwareCode);
    if (res.isValid) {
      localStorage.setItem("gvai_bienthe_license_key", key);
      setIsProActive(true);
      setProLicenseInfo(res);
      setActivationSuccess(`Chúc mừng Thầy/Cô đã kích hoạt thành công ${res.packageName}!`);
    } else {
      setActivationError(res.message || "Mã kích hoạt không hợp lệ cho thiết bị này!");
      webSecurityGuard.recordFailedKeyAttempt('sinhdebienthe', key, hardwareCode);
    }
  };

  const handleCopyHardwareCode = () => {
    navigator.clipboard.writeText(hardwareCode);
    setCopiedHw(true);
    setTimeout(() => setCopiedHw(false), 2000);
  };

  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);
  const handleCloudSync = async () => {
    setIsSyncingCloud(true);
    try {
      const res = await cloudSyncService.checkCurrentMachineCloudStatus(hardwareCode, 'sinh-de-bien-the');
      if (res.isApproved) {
        setIsProActive(true);
        localStorage.setItem("gvai_bienthe_is_vip_pro", "true");
        setTrialRemaining(999);
        setActivationSuccess(`🎉 Chúc mừng Thầy/Cô!\nMáy tính [${hardwareCode}] đã được kích hoạt ${res.packageType || 'Pro'} trên Web Cloud bởi ${res.approvedBy || 'Thầy Thành'}!`);
        alert(`🎉 Chúc mừng Thầy/Cô!\n\nMáy tính [${hardwareCode}] đã được duyệt bản quyền ${res.packageType || 'Pro'} cho ứng dụng "Sinh Đề Biến Thể" trên Web Cloud bởi ${res.approvedBy || 'Thầy Thành'}!`);
      } else {
        alert(`ℹ️ Chưa tìm thấy phê duyệt cho ứng dụng Sinh Đề Biến Thể trên Cloud của máy tính [${hardwareCode}].\n\nNếu Thầy/Cô đã gửi đơn, xin vui lòng chờ Thầy Thành duyệt hoặc nhắn tin Zalo 0915.213717 để được hỗ trợ tức thì!`);
      }
    } catch (e) {
      alert("⚠️ Không thể kết nối Cloud. Vui lòng kiểm tra lại mạng Internet.");
    } finally {
      setIsSyncingCloud(false);
    }
  };

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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <Layers className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-xl font-black text-white tracking-tight">
                  SINH 3 ĐỀ BIẾN THỂ VIP (V1) - AI PRO
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] sm:text-xs font-extrabold flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-400" />
                  BẢN QUYỀN PRO
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold">
                  GLOBAL SUCCESS THCS
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Tác giả: Thầy giáo {BRAND.author} – Tự động phân tích ma trận đề gốc & sinh 3 đề biến thể kèm đáp án chi tiết
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
        {/* NAVIGATION 3 TABS TIÊU CHUẨN CHUẨN NLS-AI */}
        <div className="flex items-center justify-between border-b border-slate-800 my-3 pb-2 gap-2 overflow-x-auto text-xs font-bold">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("download")}
              className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                activeTab === "download"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Download className="w-4 h-4 text-cyan-300" />
              1. Tải Bản Máy Tính (.exe / .zip Pass: 123)
            </button>

            <button
              onClick={() => setActiveTab("license")}
              className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                activeTab === "license"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Crown className="w-4 h-4 text-amber-400" />
              2. Bản Quyền & Kích Hoạt
            </button>

            <button
        {activeTab === "download" && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
            {/* 1. VIDEO PLAYER PRESENTATION */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  Video giới thiệu & hướng dẫn quy trình sinh 3 đề biến thể chuẩn Sư phạm:
                </span>
                <span className="text-[11px] text-cyan-400 font-mono">Full HD 1080p</span>
              </div>

              {/* VIDEO CONTAINER */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster="/sinhdebientheVIP.png"
                  className="w-full aspect-video max-h-[320px] object-contain bg-black"
                >
                  <source src="/HD_Sinh_3_De_Bien_The_VIP.mp4" type="video/mp4" />
                  Trình duyệt không hỗ trợ xem video trực tiếp.
                </video>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 px-1 gap-2">
                <span>💡 Hướng dẫn chi tiết cách tải đề gốc, thiết lập mức độ biến thể và xuất file Word chuẩn A4.</span>
                <div className="flex items-center gap-2">
                  <a
                    href="/HD_Sinh_3_De_Bien_The_VIP.mp4"
                    download="HuongDan_Sinh3De_BienThe_VIP_TiengAnh.mp4"
                    className="text-emerald-400 hover:text-emerald-300 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Tải Video (.mp4)
                  </a>
                  <a
                    href={BRAND.zaloUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline font-semibold flex items-center gap-1"
                  >
                    Kết nối Zalo Thầy Thành ({BRAND.phone})
                  </a>
                </div>
              </div>
            </div>

            {/* 2. BỘ TÀI LIỆU & FILE MẪU CHUẨN */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    .DOC
                  </div>
                  <h5 className="font-bold text-slate-200 text-xs">Bộ Đề Mẫu Chuẩn Khối 6-9</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Trọn bộ 20 đề thi mẫu bám sát SGK Global Success mới nhất kèm ma trận và bảng đặc tả.
                  </p>
                </div>
                <a
                  href={BRAND.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  Nhận Bộ Đề Mẫu
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    .ZIP
                  </div>
                  <h5 className="font-bold text-slate-200 text-xs">Mã Nguồn Web & Backend</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Bản nén mã nguồn đầy đủ của công cụ sinh đề biến thể (Pass giải nén: <code>123</code>).
                  </p>
                </div>
                <a
                  href={SINH_DE_BIEN_THE_RESOURCES.fullZipUrl}
                  download="Sinh3De_BienThe_VIP_TiengAnh_TronBo_Pass123.zip"
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Tải Bản Nén ZIP (Pass: 123)
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    .PDF
                  </div>
                  <h5 className="font-bold text-slate-200 text-xs">Cẩm Nang Sư Phạm AI</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Tài liệu hướng dẫn ứng dụng AI để sinh đề thi phân hóa và chống học vẹt hiệu quả.
                  </p>
                </div>
                <a
                  href={BRAND.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  Xem Hướng Dẫn
                </a>
              </div>
            </div>

            {/* 3. 4 BƯỚC HƯỚNG DẪN QUY CHUẨN */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
              <h4 className="font-extrabold text-xs text-amber-300 uppercase tracking-wide">
                QUY TRÌNH 4 BƯỚC SỬ DỤNG CÔNG CỤ SINH 3 ĐỀ BIẾN THỂ:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-300">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <strong className="text-amber-400 block font-bold">1. Chuẩn bị đề thi gốc</strong>
                  <p className="text-slate-400 leading-relaxed">
                    Thầy/Cô kéo thả tệp Word, PDF hoặc dán nội dung văn bản đề kiểm tra cần nhân bản vào khung làm việc.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <strong className="text-cyan-400 block font-bold">2. Bấm Sinh 3 Đề Biến Thể</strong>
                  <p className="text-slate-400 leading-relaxed">
                    AI tự động quét ma trận kiến thức và sinh ra 3 đề riêng biệt (Biến thể nhẹ, Biến thể vừa, Biến thể sâu).
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <strong className="text-emerald-400 block font-bold">3. Kiểm tra đáp án & lời giải</strong>
                  <p className="text-slate-400 leading-relaxed">
                    Xem trước từng đề, kiểm tra bảng đáp án, đoạn văn mẫu Writing và kịch bản thi nói Speaking.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <strong className="text-orange-400 block font-bold">4. Xuất file Microsoft Word</strong>
                  <p className="text-slate-400 leading-relaxed">
                    Tải về từng file Word riêng hoặc trọn bộ 3 đề gộp chung để in ấn hoặc nộp chuyên môn ngay lập tức.
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
                    placeholder="Dán mã kích hoạt tại đây (Ví dụ: VAR-LT-3B9AC9FF-48A1B2C3)..."
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

                {/* NÚT ĐỒNG BỘ BẢN QUYỀN TỪ CLOUD */}
                <button
                  type="button"
                  onClick={handleCloudSync}
                  disabled={isSyncingCloud}
                  className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer mt-3"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncingCloud ? 'animate-spin' : ''}`} />
                  <span>{isSyncingCloud ? 'ĐANG KẾT NỐI VÀ ĐỒNG BỘ TỪ WEB CLOUD...' : '🔄 CẬP NHẬT / ĐỒNG BỘ BẢN QUYỀN TỪ WEB CLOUD (LÀM MỚI TỨC THÌ)'}</span>
                </button>
              </form>
            </div>

            {/* THẺ BÁO GIÁ & ĐĂNG KÝ BẢN QUYỀN - 1 LOẠI DUY NHẤT */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border-2 border-cyan-500/50 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      👑 CHÍNH SÁCH BẢN QUYỀN CHÍNH THỨC
                    </span>
                    <span className="text-[10px] text-amber-400 font-semibold">Ưu Đãi Sư Phạm</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-white mt-1">
                    Báo Giá Ưu Đãi & Tư Vấn Chi Tiết Theo Nhu Cầu
                  </h4>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <div className="text-sm sm:text-base font-black text-cyan-400">
                    Liên Hệ Admin Thầy Thành
                  </div>
                  <p className="text-[11px] text-slate-400">Tùy chọn: 1 Năm • 2 Năm • Trọn Đời Vĩnh Viễn</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Trợ giá giáo dục:</strong> Chi phí hỗ trợ giáo viên cực kỳ tiết kiệm, Thầy Thành sẽ báo giá chi tiết trực tiếp qua Zalo.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Thuật toán hoán vị AI:</strong> Tự động phân tích đề gốc và tạo 3 đề biến thể tương đương chống quay cóp trong phòng thi.</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Cài đặt từ xa miễn phí:</strong> Hỗ trợ UltraViewer / TeamViewer cài trọn gói lên máy tính, bảo hành hỗ trợ 24/7.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span><strong>Cập nhật dài lâu:</strong> Miễn phí cập nhật các thuật toán và mẫu đề mới nhất.</span>
                  </div>
                </div>
              </div>

              {/* NÚT BẤM LIÊN HỆ ZALO BÁO GIÁ DUY NHẤT */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={`https://zalo.me/${BRAND.phoneRaw}?text=${encodeURIComponent(
                    `Chào Thầy Thành, tôi muốn nhận tư vấn và báo giá chi tiết phần mềm Sinh 3 Đề Biến Thể VIP. Mã máy của tôi: ${hardwareCode}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition active:scale-[0.98] cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 text-amber-300" />
                  Nhắn Tin Zalo Nhận Báo Giá Chi Tiết ({BRAND.phone})
                </a>
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
