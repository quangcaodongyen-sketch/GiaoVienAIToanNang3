import { TrialRegisterModal } from './TrialRegisterModal';
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
  ShieldAlert
} from "lucide-react";
import { BRAND } from "../config/brand";
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
  const [activeTab, setActiveTab] = useState<"demo" | "download" | "license">("demo");
  const [showTrialRegister, setShowTrialRegister] = useState<boolean>(false);
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
    }
  };

  const handleCopyHardwareCode = () => {
    navigator.clipboard.writeText(hardwareCode);
    setCopiedHw(true);
    setTimeout(() => setCopiedHw(false), 2000);
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
        <div className="flex items-center justify-between border-b border-slate-800 my-3 pb-2 gap-2 overflow-x-auto text-xs font-bold">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("demo")}
              className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                activeTab === "demo"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              1. Trải Nghiệm Trực Tuyến (Sinh 3 Đề)
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
              2. Tải Về & Video Hướng Dẫn
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
                <span className="text-slate-400 font-medium">Dùng thử:</span>
                <div className="flex gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <span
                      key={dot}
                      className={dot <= trialRemaining ? "text-amber-400 font-bold" : "text-slate-600 font-normal"}
                    >
                      ●
                    </span>
                  ))}
                </div>
                <span className="font-extrabold text-amber-300">
                  {trialRemaining}/5 lượt
                </span>
              </div>
            )}
          </div>
        </div>

        {/* TAB 1: TRẢI NGHIỆM TRỰC TUYẾN */}
        {activeTab === "demo" && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
            
            {/* TOP NOTICE & CONTROLS */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <h3 className="font-extrabold text-sm text-amber-300">
                    BƯỚC 1: TẢI ĐỀ THI GỐC LÊN HOẶC CHỌN ĐỀ MẪU GLOBAL SUCCESS THCS
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setShowConfig(!showConfig)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-semibold self-start sm:self-auto cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{showConfig ? "Ẩn cấu hình AI" : "Cấu hình Gemini API (Tùy chọn)"}</span>
                </button>
              </div>

              {/* COLLAPSIBLE GEMINI API DRAWER */}
              {showConfig && (
                <div className="p-3.5 rounded-xl bg-slate-950/90 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center justify-between text-cyan-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Key className="w-4 h-4 text-cyan-400" />
                      Cấu hình Gemini API cá nhân (Chạy trực tiếp trên trình duyệt, không giới hạn):
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      Miễn phí tại: aistudio.google.com
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="sm:col-span-2">
                      <input
                        type="password"
                        placeholder="Dán mã API Key Gemini của bạn tại đây..."
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-cyan-200 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="gemini-2.5-flash">Gemini 2.5 Flash (Khuyên dùng)</option>
                        <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                        <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      💡 Nếu không có API Key, hệ thống sẽ tự động sử dụng động cơ Sư phạm chuyên sâu cài sẵn.
                    </span>
                    <button
                      type="button"
                      onClick={handleSaveApiKey}
                      className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                    >
                      {apiSaveSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      {apiSaveSuccess ? "Đã lưu cấu hình!" : "Lưu Cấu Hình"}
                    </button>
                  </div>
                </div>
              )}

              {/* DRAG & DROP FILE OR DIRECT TEXT AREA */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                {/* File Dropzone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  className={`lg:col-span-5 p-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all min-h-[160px] ${
                    isDragging
                      ? "border-amber-400 bg-amber-500/10"
                      : uploadedFile
                      ? "border-emerald-500/50 bg-emerald-950/20"
                      : "border-slate-700 bg-slate-950/50 hover:border-slate-600"
                  }`}
                >
                  <input
                    type="file"
                    id="fileInput"
                    accept=".pdf,.docx,.doc,.txt,image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  {uploadedFile ? (
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="font-bold text-slate-200 truncate max-w-[220px]">
                        {uploadedFile.name}
                      </div>
                      <span className="text-[10px] text-emerald-400 block font-mono">
                        {uploadedFile.size} • Sẵn sàng phân tích
                      </span>
                      <button
                        type="button"
                        onClick={() => setUploadedFile(null)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 text-[10px] font-bold"
                      >
                        Xóa file & chọn lại
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="fileInput" className="cursor-pointer space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="font-bold text-slate-300 text-xs">
                        Kéo thả file đề gốc (.docx, .pdf, ảnh)
                      </div>
                      <span className="text-[11px] text-slate-500 block">
                        Hoặc bấm vào đây để duyệt từ máy tính
                      </span>
                    </label>
                  )}
                </div>

                {/* Direct Text Input */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-2">
                  <textarea
                    rows={6}
                    value={originalExamText}
                    onChange={(e) => {
                      setOriginalExamText(e.target.value);
                      if (uploadedFile) setUploadedFile(null);
                    }}
                    placeholder="Hoặc dán toàn bộ nội dung đề thi gốc (Câu hỏi, bài đọc, đáp án nếu có) vào đây..."
                    className="w-full flex-1 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-amber-400 resize-none"
                  />
                  
                  {/* Presets 1-click */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-400 font-bold shrink-0">Chọn đề mẫu:</span>
                    {BIENTHE_PRESETS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleApplyPreset(p)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 text-[11px] font-medium border border-slate-700 transition-colors"
                      >
                        {p.grade}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ACTION GENERATE BUTTON */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold">Khối lớp mục tiêu:</span>
                  <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    {["Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setSelectedGrade(g)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors ${
                          selectedGrade === g
                            ? "bg-amber-500 text-slate-950"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating || (!isProActive && trialRemaining <= 0)}
                  className={`w-full sm:w-auto py-3 px-8 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer ${
                    isGenerating
                      ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                      : !isProActive && trialRemaining <= 0
                      ? "bg-rose-900/60 text-rose-300 border border-rose-500/50 cursor-not-allowed"
                      : "bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-amber-500/20 hover:scale-[1.02]"
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Đang phân tích & sinh 3 đề biến thể...
                    </>
                  ) : !isProActive && trialRemaining <= 0 ? (
                    <>
                      <Lock className="w-4 h-4" />
                      Hết 5 lượt dùng thử (Kích hoạt Pro để tiếp tục)
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      SINH 3 ĐỀ BIẾN THỂ & ĐÁP ÁN (AI PRO) {!isProActive && `(${trialRemaining} lượt)`}
                    </>
                  )}
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* RESULTS PREVIEW PANEL */}
            {suiteData ? (
              <div className="space-y-4">
                {/* 1. ANALYSIS SUMMARY BANNER */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-blue-300 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-400" />
                      KẾT QUẢ PHÂN TÍCH MA TRẬN ĐỀ GỐC
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
                      {suiteData.analysis.difficulty}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                    <div>
                      <span className="text-slate-400 block">Môn & Lớp:</span>
                      <strong className="text-white font-bold">{suiteData.analysis.subject} – {suiteData.analysis.grade}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Quy mô đề gốc:</span>
                      <strong className="text-white font-bold">{suiteData.analysis.totalQuestions} ({suiteData.analysis.totalParts})</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block">Kỹ năng đánh giá:</span>
                      <strong className="text-cyan-300 font-semibold">{suiteData.analysis.skillsTested}</strong>
                    </div>
                  </div>
                </div>

                {/* 2. SUB-TABS & EXPORT BUTTONS */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <div className="flex gap-1.5 overflow-x-auto">
                    <button
                      type="button"
                      onClick={() => setSubTab("var1")}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                        subTab === "var1"
                          ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                          : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span>📑 1. Đề 1 (Nhẹ)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubTab("var2")}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                        subTab === "var2"
                          ? "bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20"
                          : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span>📑 2. Đề 2 (Vừa)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubTab("var3")}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                        subTab === "var3"
                          ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                          : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span>📑 3. Đề 3 (Sâu)</span>
                    </button>
                  </div>

                  {/* WORD EXPORT BUTTONS */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const targetVar = subTab === "var1" ? suiteData.variant1 : subTab === "var2" ? suiteData.variant2 : suiteData.variant3;
                        exportBientheToWordHtml(targetVar.title, [targetVar], suiteData.analysis, false);
                      }}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-400" />
                      <span>Tải Đề Này (.doc)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        exportBientheToWordHtml(
                          "TRON_BO_3_DE_BIEN_THE",
                          [suiteData.variant1, suiteData.variant2, suiteData.variant3],
                          suiteData.analysis,
                          true
                        );
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>TẢI TRỌN BỘ 3 ĐỀ (.DOC)</span>
                    </button>
                  </div>
                </div>

                {/* 3. EXAM PAPER PREVIEW CONTAINER */}
                <div className="p-4 sm:p-6 rounded-2xl bg-white text-slate-900 shadow-xl max-h-[560px] overflow-y-auto selection:bg-amber-100 font-serif border border-slate-300">
                  
                  {/* PAPER TOP SWITCH (ĐỀ THI / ĐÁP ÁN) */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 font-sans">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">
                        {subTab === "var1" ? suiteData.variant1.title : subTab === "var2" ? suiteData.variant2.title : suiteData.variant3.title}
                      </span>
                    </div>

                    <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-300 text-xs">
                      <button
                        type="button"
                        onClick={() => setVariantViewMode("exam")}
                        className={`px-3 py-1 rounded-lg font-bold transition-all ${
                          variantViewMode === "exam"
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Xem Đề Thi
                      </button>
                      <button
                        type="button"
                        onClick={() => setVariantViewMode("answers")}
                        className={`px-3 py-1 rounded-lg font-bold transition-all ${
                          variantViewMode === "answers"
                            ? "bg-rose-600 text-white shadow-sm"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Xem Đáp Án & Hướng Dẫn Chấm
                      </button>
                    </div>
                  </div>

                  {/* ACTIVE VARIANT DISPLAY */}
                  {(() => {
                    const currentVar = subTab === "var1" ? suiteData.variant1 : subTab === "var2" ? suiteData.variant2 : suiteData.variant3;
                    const content = variantViewMode === "exam" ? currentVar.examContent : currentVar.answers;

                    return (
                      <div className="space-y-3 leading-relaxed text-[12.5pt] text-slate-900">
                        {content.split("\n").map((line, idx) => {
                          const tr = line.trim();
                          if (!tr) return <div key={idx} className="h-2" />;
                          
                          // Style headings
                          if (
                            tr.startsWith("PHẦN") ||
                            tr.startsWith("PART") ||
                            tr.startsWith("A.") ||
                            tr.startsWith("B.") ||
                            tr.startsWith("C.") ||
                            tr.startsWith("D.") ||
                            tr.startsWith("I.") ||
                            tr.startsWith("II.") ||
                            tr.startsWith("III.") ||
                            tr.startsWith("IV.") ||
                            tr.startsWith("BÀI KIỂM TRA") ||
                            tr.startsWith("UBND")
                          ) {
                            return (
                              <div key={idx} className="font-bold text-blue-950 mt-2">
                                {tr}
                              </div>
                            );
                          }

                          if (tr.includes(":") && (tr.startsWith("1.") || tr.startsWith("2.") || tr.startsWith("3.") || tr.startsWith("BẢNG ĐÁP ÁN") || tr.startsWith("ĐOẠN VĂN MẪU"))) {
                            return (
                              <div key={idx} className="font-bold text-rose-800 mt-2">
                                {tr}
                              </div>
                            );
                          }

                          return <div key={idx}>{tr}</div>;
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            ) : (
              /* EMPTY PROMPT */
              <div className="py-14 px-4 text-center flex flex-col items-center justify-center space-y-3 bg-slate-950/40 rounded-2xl border border-slate-800">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Layers className="w-7 h-7" />
                </div>
                <div className="max-w-md space-y-1">
                  <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">
                    Chưa Có Đề Biến Thể Nào Được Sinh
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Vui lòng tải lên file đề kiểm tra gốc (Word / PDF / ảnh) hoặc chọn một đề mẫu Global Success ở Bước 1 và nhấn nút <span className="text-amber-400 font-bold">"SINH 3 ĐỀ BIẾN THỂ & ĐÁP ÁN"</span> để khởi tạo.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TẢI VỀ & VIDEO HƯỚNG DẪN */}
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
                    download="HD_Sinh_3_De_Bien_The_VIP.mp4"
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
                  href={BRAND.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  Tải Bản Nén (Pass: 123)
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
                  <div className="text-xl font-extrabold text-white">200.000đ</div>
                  <span className="text-[11px] text-slate-400 block">Sử dụng 365 ngày</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
                  <span className="font-bold text-slate-300 block text-xs">GÓI 2 NĂM</span>
                  <div className="text-xl font-extrabold text-sky-400">250.000đ</div>
                  <span className="text-[11px] text-slate-400 block">Tiết kiệm 100.000đ</span>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-500/20 to-slate-900 border border-amber-500/60 text-center space-y-2 shadow-lg shadow-amber-500/10">
                  <span className="font-extrabold text-amber-300 block text-xs flex items-center justify-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    GÓI TRỌN ĐỜI (VIP)
                  </span>
                  <div className="text-2xl font-black text-amber-400">200.000đ</div>
                  <span className="text-[11px] text-amber-200 font-semibold block">Sử dụng vĩnh viễn không giới hạn</span>
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
      <TrialRegisterModal isOpen={showTrialRegister} onClose={() => setShowTrialRegister(false)} initialAppId="sinh-de-bienthe" initialAppName="Sinh 3 Đề Biến Thể Tương Đương" />
    </div>
  );
};
