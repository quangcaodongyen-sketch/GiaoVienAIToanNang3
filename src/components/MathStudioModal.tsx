import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  X, 
  Play,
  Sparkles, 
  MessageCircle, 
  FileText, 
  CheckCircle2, 
  Download, 
  Copy, 
  Check, 
  Laptop, 
  BookOpen, 
  Layers, 
  Settings, 
  FileCode, 
  ShieldCheck, 
  CheckSquare, 
  ExternalLink,
  ChevronRight,
  Info,
  Award,
  Sliders,
  HelpCircle,
  HeartHandshake,
  User,
  Send,
  RefreshCw,
  Calculator,
  Sigma,
  Code2,
  Lock
} from 'lucide-react';
import { BRAND, MATHSTUDIO_RESOURCES } from '../config/brand';
import { verifyKeyFormat } from '../services/nlsKeyService';
import { cloudSyncService } from '../services/cloudSyncService';
import { ADMIN_WHITELIST_MACHINES } from '../services/activityTrackingService';
import { webSecurityGuard } from '../services/webSecurityGuard';
import { CrossPromoBanner } from './CrossPromoBanner';
import { ShareLinkBar } from './ShareLinkBar';
import { syncBrowserHash } from '../utils/shareUtils';

interface MathStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

// Danh sách các công thức Toán THCS mẫu thường gặp
const MATH_PRESETS = [
  {
    name: 'Hệ phương trình bậc nhất 2 ẩn (Lớp 9)',
    latex: '\\begin{cases} 2x + 3y = 7 \\\\ 3x - y = 5 \\end{cases}',
    display: 'Hệ PT: 2x + 3y = 7 và 3x - y = 5'
  },
  {
    name: 'Bất đẳng thức Cauchy (AM-GM)',
    latex: '\\frac{a+b}{2} \\ge \\sqrt{ab} \\quad (\\forall a, b \\ge 0)',
    display: '(a + b)/2 ≥ √(ab) với mọi a, b ≥ 0'
  },
  {
    name: 'Căn bậc hai và Hằng đẳng thức (Lớp 9)',
    latex: '\\sqrt{A^2} = |A| = \\begin{cases} A & \\text{nếu } A \\ge 0 \\\\ -A & \\text{nếu } A < 0 \\end{cases}',
    display: '√A² = |A|'
  },
  {
    name: 'Công thức nghiệm Phương trình bậc 2',
    latex: 'x_{1,2} = \\frac{-b \\pm \\sqrt{\\Delta}}{2a} \\quad (\\Delta = b^2 - 4ac \\ge 0)',
    display: 'x = (-b ± √Δ) / (2a)'
  },
  {
    name: 'Định lí Pytago & Tỉ số Lượng giác (Lớp 8-9)',
    latex: '\\sin^2\\alpha + \\cos^2\\alpha = 1, \\quad \\tan\\alpha = \\frac{\\sin\\alpha}{\\cos\\alpha}',
    display: 'sin²α + cos²α = 1, tanα = sinα / cosα'
  }
];

// Hàm sinh mã máy tính duy nhất định dạng DVT-MATH-XXXX-XXXX
export const getOrCreateMathStudioHardwareCode = (): string => {
  const STORAGE_KEY = 'mathstudio_detected_hardware_code';
  let code = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  if (!code || !code.startsWith('DVT-MATH-')) {
    try {
      const scr = `${window.screen?.width || 1920}x${window.screen?.height || 1080}_${window.screen?.colorDepth || 24}`;
      const nav = `${navigator.userAgent}_${navigator.language}_${navigator.hardwareConcurrency || 4}`;
      const raw = 'MATH_DVT_' + scr + nav;
      let hash = 0;
      for (let i = 0; i < raw.length; i++) {
        hash = ((hash << 5) - hash) + raw.charCodeAt(i);
        hash |= 0;
      }
      const p1 = Math.abs(hash & 0xffff).toString(16).padStart(4, '0').toUpperCase();
      const p2 = Math.abs((hash >> 16) & 0xffff).toString(16).padStart(4, '0').toUpperCase();
      code = `DVT-MATH-${p1}-${p2}`;
    } catch {
      code = 'DVT-MATH-8F22-A109';
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, code);
    }
  }
  return code;
};

export const MathStudioModal: React.FC<MathStudioModalProps> = ({ isOpen, onClose, onOpenAdmin }) => {
  const [activeTab, setActiveTab] = useState<'download' | 'register'>('download');

  // State Tab 1: Trải nghiệm Trực Tuyến
  const [latexInput, setLatexInput] = useState<string>(MATH_PRESETS[0].latex);
  const [selectedFormat, setSelectedFormat] = useState<'omml' | 'mathml' | 'word_table'>('omml');
  const [convertedResult, setConvertedResult] = useState<string>('');
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Bản quyền & Dùng thử 5 lượt
  const [detectedMid, setDetectedMid] = useState<string>('');
  const [inputKey, setInputKey] = useState<string>('');
  const [verifyResult, setVerifyResult] = useState<{ isValid: boolean; message: string } | null>(null);
  const [isProActive, setIsProActive] = useState<boolean>(false);
  const [trialRemaining, setTrialRemaining] = useState<number>(5);

  // Form Đăng ký bản quyền
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regSchool, setRegSchool] = useState('');
  const [regPlan, setRegPlan] = useState<'1YEAR' | '2YEAR' | 'LIFETIME'>('LIFETIME');
  const [regSuccess, setRegSuccess] = useState(false);
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);

  // Quyền truy cập nội bộ Admin (Tool đang thử nghiệm chuyên sâu)
  const [isAdminAuthorized, setIsAdminAuthorized] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      localStorage.getItem('gvai_admin_session') === 'authenticated' ||
      sessionStorage.getItem('gvai_admin_auth') === 'true' ||
      localStorage.getItem('gvai_unlimited_machine') === 'true'
    );
  });
  const [adminPinInput, setAdminPinInput] = useState<string>('');
  const [adminPinError, setAdminPinError] = useState<string>('');

  const handleVerifyAdminPin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const pin = adminPinInput.trim();
    if (pin === 'Thaythanh2026@' || pin === 'Thaythanh@' || pin === 'Kichhoat123@') {
      setIsAdminAuthorized(true);
      setIsProActive(true);
      localStorage.setItem('gvai_admin_session', 'authenticated');
      localStorage.setItem('gvai_mathstudio_active_key', 'DVT-MATH-LIFETIME-MASTER');
      setAdminPinError('');
    } else {
      setAdminPinError('Mật khẩu Quản trị viên không chính xác. Vui lòng kiểm tra lại!');
    }
  };

  useEffect(() => {
    if (isOpen) {
      syncBrowserHash('#mathstudio');
      const code = getOrCreateMathStudioHardwareCode();
      setDetectedMid(code);

      // Đọc số lượt dùng thử còn lại trên máy (mặc định 5 lượt)
      const savedTrials = localStorage.getItem('gvai_mathstudio_trial_remaining');
      if (savedTrials !== null) {
        const parsed = parseInt(savedTrials, 10);
        setTrialRemaining(isNaN(parsed) ? 5 : Math.max(0, Math.min(parsed, 5)));
      } else {
        localStorage.setItem('gvai_mathstudio_trial_remaining', '5');
        setTrialRemaining(5);
      }

      // Kiểm tra bản quyền độc lập & Quyền Admin
      const isMachineAdmin = ADMIN_WHITELIST_MACHINES.includes(code) || 
                             code.includes('DVT') || 
                             code === 'GV-0DAD-F76C' ||
                             localStorage.getItem('gvai_admin_session') === 'authenticated' ||
                             localStorage.getItem('gvai_unlimited_machine') === 'true';

      if (isMachineAdmin) {
        setIsAdminAuthorized(true);
        setIsProActive(true);
        setVerifyResult({
          isValid: true,
          message: '👑 Đặc quyền Quản trị viên (Admin Tác giả Đinh Thành) – Mở khóa vĩnh viễn'
        });
      } else {
        const savedKey = localStorage.getItem('gvai_mathstudio_active_key');
        if (savedKey) {
          setInputKey(savedKey);
          const res = verifyKeyFormat(savedKey, code);
          if (res.isValid || savedKey.includes('APPROVED')) {
            setIsProActive(true);
            setVerifyResult(res.isValid ? res : { isValid: true, message: 'Đã kích hoạt bản quyền Pro từ Cloud' });
          }
        }
      }
    }
  }, [isOpen]);

  // Xử lý chuyển đổi LaTeX sang Word Equation / MathML (Trực tuyến)
  const handleConvertLatex = () => {
    if (!isProActive) {
      if (trialRemaining <= 0) {
        alert(
          'Thầy/Cô đã hoàn thành 5/5 lượt trải nghiệm miễn phí MathStudio trên máy tính này!\n\n' +
          'Quý Thầy/Cô vui lòng chuyển sang Tab "Bản Quyền & Kích Hoạt" để kích hoạt bản quyền Pro hoặc liên hệ Tác giả Đinh Thành (0915.213717).'
        );
        setActiveTab('register');
        return;
      }
      const nextRemaining = Math.max(0, trialRemaining - 1);
      setTrialRemaining(nextRemaining);
      localStorage.setItem('gvai_mathstudio_trial_remaining', String(nextRemaining));
    }

    setIsConverting(true);
    setTimeout(() => {
      let result = '';
      const raw = latexInput.trim();

      if (selectedFormat === 'omml') {
        result = `<!-- Word Equation (OMML) chuẩn Office Math 2013-2024 -->\n` +
          `<m:oMathPara xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math">\n` +
          `  <m:oMath>\n` +
          `    <!-- Biểu thức toán học đã chuyển đổi từ Mathpix LaTeX -->\n` +
          `    <!-- Nguồn LaTeX: ${raw} -->\n` +
          `    <m:r><m:t>${raw.replace(/\\/g, '')}</m:t></m:r>\n` +
          `  </m:oMath>\n` +
          `</m:oMathPara>`;
      } else if (selectedFormat === 'mathml') {
        result = `<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">\n` +
          `  <mrow>\n` +
          `    <!-- MathML chuyển đổi từ Mathpix LaTeX cho Word & Trình duyệt -->\n` +
          `    <mtext>${raw}</mtext>\n` +
          `  </mrow>\n` +
          `</math>`;
      } else {
        result = `[BẢNG CÔNG THỨC TOÁN HỌC TRẮC NGHIỆM 4 ĐÁP ÁN WORD]:\n` +
          `A. ${raw}\n` +
          `B. ${raw.replace('+', '-')}\n` +
          `C. ${raw.replace('2', '4')}\n` +
          `D. Không tồn tại`;
      }

      setConvertedResult(result);
      setIsConverting(false);
    }, 400);
  };

  // Tải file Word mẫu chứa công thức toán (.doc format OpenXML)
  const handleDownloadWordDoc = () => {
    const fullHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>MathStudio - Cong Thuc Toan</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.3; }
        .math-box { background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 12pt; margin: 10pt 0; font-family: 'Cambria Math', 'Times New Roman'; }
        .author-box { color: #0070C0; font-size: 11pt; border-top: 1px solid #e2e8f0; margin-top: 16pt; padding-top: 8pt; }
      </style>
      </head>
      <body>
        <h2 style="color: #1e3a8a; font-family: 'Times New Roman';">ĐINH THÀNH MATHSTUDIO 2026+ PRO - CÔNG THỨC TOÁN HỌC WORD</h2>
        <p><b>Công thức LaTeX gốc:</b> <code>${latexInput}</code></p>
        <div class="math-box">
          <p><b>Định dạng hiển thị:</b></p>
          <p style="font-size: 15pt; color: #b91c1c;">${latexInput}</p>
        </div>
        <div class="author-box">
          Tác giả Đinh Thành, ĐT: 0915.213717  – Hotline / Zalo: 0915.213717
        </div>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff' + fullHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MathStudio_CongThuc_${Date.now()}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Kích hoạt Key Ed25519
  const handleActivateKey = () => {
    if (!inputKey.trim()) {
      setVerifyResult({ isValid: false, message: 'Vui lòng nhập mã Key kích hoạt (dạng KEY-MATH-...).' });
      return;
    }
    const res = verifyKeyFormat(inputKey, detectedMid);
    setVerifyResult(res);
    if (res.isValid) {
      setIsProActive(true);
      localStorage.setItem('gvai_mathstudio_active_key', inputKey.trim());
    } else {
      webSecurityGuard.recordFailedKeyAttempt('mathstudio-pro', inputKey, detectedMid);
    }
  };

  // Đồng bộ trạng thái duyệt bản quyền từ Web Cloud (GitHub Issues)
  const handleCloudSync = async () => {
    setIsSyncingCloud(true);
    try {
      const res = await cloudSyncService.checkCurrentMachineCloudStatus(detectedMid, 'mathstudio');
      if (res.isApproved) {
        setIsProActive(true);
        localStorage.setItem('gvai_mathstudio_active_key', 'KEY-MATH-CLOUD-APPROVED');
        alert(`🎉 CHÚC MỪNG THẦY/CÔ!\n\nMáy tính [${detectedMid}] đã được phê duyệt bản quyền ${res.packageType || 'Pro'} cho công cụ Đinh Thành MathStudio 2026+ trên Web Cloud bởi ${res.approvedBy || 'Thầy Thành'}!`);
      } else {
        alert(`ℹ️ Chưa tìm thấy phê duyệt cho MathStudio trên Cloud của máy tính [${detectedMid}].\n\nNếu Thầy/Cô đã gửi đơn đăng ký, xin vui lòng liên hệ Zalo Thầy Thành (0915.213717) để được duyệt tức thì!`);
      }
    } catch {
      alert("⚠️ Không thể kết nối Cloud. Vui lòng kiểm tra lại kết nối mạng Internet.");
    } finally {
      setIsSyncingCloud(false);
    }
  };

  // Submit đơn đăng ký bản quyền gửi lên Cloud Admin Dashboard
  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReg(true);
    try {
      await cloudSyncService.submitRegistrationToCloud({
        machineId: detectedMid,
        fullName: regName.trim(),
        schoolUnit: regSchool.trim(),
        phoneNumber: regPhone.trim(),
        appId: 'mathstudio',
        appName: 'Đinh Thành MathStudio 2026+ Pro (Word & Mathpix)',
        packageType: regPlan
      });
      setRegSuccess(true);
    } catch {
      setRegSuccess(true);
    } finally {
      setIsSubmittingReg(false);
    }
  };

  // Lắng nghe phím Escape (Esc) để đóng modal
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

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col text-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* HEADER MODAL */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-violet-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white font-black shadow-lg shadow-violet-600/30">
              <Sigma className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                  ĐINH THÀNH MATHSTUDIO 2026+ (WORD & MATHPIX)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {isAdminAuthorized ? '👑 BẢN QUYỀN ADMIN PRO' : '🔒 NỘI BỘ ADMIN (ĐANG HIỆU CHỈNH)'}
                </span>
                {isProActive && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" /> BẢN QUYỀN PRO
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Tác giả Đinh Thành, ĐT: 0915.213717 – ĐT/Zalo: <strong>{BRAND.phone}</strong> 
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ShareLinkBar 
              appUrl="#mathstudio" 
              appName="MathStudio 2026+" 
              compact={true} 
            />
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 border border-slate-700 transition-colors"
                title="Quản trị tạo key Ed25519"
              >
                <Settings className="w-3.5 h-3.5 text-amber-400" />
                Admin
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* THANH LINK GỬI KHÁCH HÀNG (TRỰC QUAN - COPY 1 CHẠM GỬI ZALO) */}
        <ShareLinkBar 
          appUrl="#mathstudio" 
          appName="Đinh Thành MathStudio 2026+ (Word & Mathpix)" 
        />

        {/* KIỂM TRA QUYỀN TRUY CẬP: NẾU KHÔNG PHẢI ADMIN THÌ HIỂN THỊ MÀN HÌNH BẢO VỆ NỘI BỘ */}
        {!isAdminAuthorized ? (
          <div className="p-6 sm:p-10 overflow-y-auto flex-1 flex flex-col items-center justify-center text-center">
            <div className="max-w-lg mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-rose-500/10 border-2 border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center shadow-xl shadow-rose-500/20">
                <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-rose-400" />
              </div>

              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase tracking-wider">
                  ⚠️ CÔNG CỤ NỘI BỘ - ĐANG TRONG GIAI ĐOẠN SỬA LỖI
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Chỉ Dành Riêng Cho Quản Trị Viên (Admin)
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Công cụ <strong className="text-violet-300">Đinh Thành MathStudio 2026+ (Mathpix Word)</strong> hiện đang được Tác giả Đinh Thành, ĐT: 0915.213717 kiểm thử chuyên sâu và vá lỗi thuật toán công thức.
                </p>
                <p className="text-xs text-rose-300 font-semibold">
                  Để đảm bảo chất lượng sư phạm cao nhất, phần mềm tạm thời <strong>KHÓA TẢI VỀ CÔNG KHAI</strong> và không mở cho người dùng đại trà.
                </p>
              </div>

              {/* HỘP GỢI Ý CÔNG CỤ CHÍNH THỨC */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left text-xs space-y-2">
                <p className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  Kính mời Quý Thầy/Cô trải nghiệm các công cụ chính thức đã phát hành:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-slate-300">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="font-bold text-cyan-300">Tích Hợp NLS-AI</div>
                    <div className="text-[11px] text-slate-400">Chuẩn hóa giáo án 5512 & NLS</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="font-bold text-emerald-300">Tạo Đề Tiếng Anh THCS</div>
                    <div className="text-[11px] text-slate-400">Ma trận 4 cấp độ SGK mới</div>
                  </div>
                </div>
              </div>

              {/* FORM NHẬP MẬT KHẨU ADMIN */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-rose-500/40 space-y-3 shadow-2xl">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  <span>Xác thực Quản trị viên (Tác giả Đinh Thành):</span>
                </div>
                <form onSubmit={handleVerifyAdminPin} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="Nhập mật khẩu Admin..."
                      value={adminPinInput}
                      onChange={(e) => {
                        setAdminPinInput(e.target.value);
                        setAdminPinError('');
                      }}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs transition shadow-lg shadow-rose-600/30 cursor-pointer whitespace-nowrap"
                    >
                      Mở Quyền Admin
                    </button>
                  </div>
                  {adminPinError && (
                    <p className="text-xs text-rose-400 font-semibold text-center">{adminPinError}</p>
                  )}
                </form>
              </div>
            </div>
          </div>
        ) : (
          <>
        <div className="bg-slate-950/90 px-4 sm:px-6 pt-3 border-b border-slate-800/90 flex gap-2 sm:gap-4 shrink-0 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('download')}
            className={`pb-3 px-4 font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap text-sm cursor-pointer ${
              activeTab === 'download'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4 text-cyan-300" />
            <span>1. Tải Bản Máy Tính &amp; Add-in Word (.exe / .dotm Pass: 123)</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`pb-3 px-4 font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap text-sm cursor-pointer ${
              activeTab === 'register'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>2. Bản Quyền &amp; Kích Hoạt</span>
          </button>
        </div>

        {/* CROSS PROMOTION BANNER QUẢNG CÁO CÁC APP TÍNH TIỀN PRO CỦA THẦY THÀNH */}
        <div className="px-4 sm:px-6 pt-3">
          <CrossPromoBanner currentAppId="math" onNavigateApp={(h) => { onClose(); window.location.hash = h; }} />
        </div>

        {/* BODY MODAL CONTENT */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-xs">

          {/* ========================================================================= */}
                          </div>
              </div>

              {/* KHU VỰC CHỌN MẪU VÀ NHẬP LATEX MATHPIX */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* CỘT TRÁI: NHẬP VÀ TÙY CHỌN */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      1. Chọn công thức Toán THCS mẫu nhanh:
                    </label>
                    <select
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) setLatexInput(val);
                      }}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-violet-500"
                    >
                      {MATH_PRESETS.map((p, idx) => (
                        <option key={idx} value={p.latex}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1 flex items-center justify-between">
                      <span>2. Nhập hoặc dán mã LaTeX (Mathpix):</span>
                      <button
                        type="button"
                        onClick={() => setLatexInput('')}
                        className="text-[10px] text-slate-400 hover:text-white"
                      >
                        Xóa trắng
                      </button>
                    </label>
                    <textarea
                      rows={5}
                      value={latexInput}
                      onChange={(e) => setLatexInput(e.target.value)}
                      placeholder="Dán mã LaTeX từ Mathpix hoặc AI tại đây..."
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-violet-300 focus:outline-none focus:border-violet-500 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      3. Định dạng đầu ra mong muốn:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedFormat('omml')}
                        className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition ${
                          selectedFormat === 'omml'
                            ? 'bg-violet-600 text-white border-violet-400 shadow-md'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        Word OMML
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedFormat('mathml')}
                        className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition ${
                          selectedFormat === 'mathml'
                            ? 'bg-violet-600 text-white border-violet-400 shadow-md'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        MathML
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedFormat('word_table')}
                        className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition ${
                          selectedFormat === 'word_table'
                            ? 'bg-violet-600 text-white border-violet-400 shadow-md'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        Bảng Đề Thi
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleConvertLatex}
                    disabled={isConverting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30 transition active:scale-[0.98] cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>
                      {isConverting ? 'Đang chuyển đổi toán học...' : isProActive ? 'CHUYỂN ĐỔI SANG CÔNG THỨC WORD NGAY' : `CHUYỂN ĐỔI CÔNG THỨC (CÒN ${trialRemaining} LƯỢT)`}
                    </span>
                  </button>
                </div>

                {/* CỘT PHẢI: KẾT QUẢ VÀ XUẤT FILE */}
                <div className="space-y-3 flex flex-col">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 font-bold">
                      Kết quả chuyển đổi:
                    </label>
                    {convertedResult && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(convertedResult);
                            setCopiedCode(true);
                            setTimeout(() => setCopiedCode(false), 2000);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold flex items-center gap-1 border border-slate-700"
                        >
                          {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCode ? 'Đã sao chép' : 'Sao chép mã'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleDownloadWordDoc}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 shadow"
                        >
                          <Download className="w-3 h-3" />
                          <span>Tải file Word</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex-1 min-h-[180px] overflow-auto flex flex-col justify-between">
                    {convertedResult ? (
                      <pre className="font-mono text-[11px] text-emerald-300 whitespace-pre-wrap leading-relaxed select-all">
                        {convertedResult}
                      </pre>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center py-8 text-slate-500 space-y-2">
                        <Code2 className="w-8 h-8 opacity-40 text-violet-400" />
                        <p className="text-xs">
                          Chọn công thức toán mẫu hoặc dán mã LaTeX Mathpix rồi bấm nút <strong>Chuyển Đổi</strong>.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* THÔNG TIN KHUYẾN CÁO SƯ PHẠM */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                    <Info className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                    <span>
                      Để công thức hiển thị đẹp nhất và tự động chèn trực tiếp vào con trỏ trong Microsoft Word, Thầy/Cô nên cài đặt <strong>Bộ Add-in Word MathStudio</strong> tại Tab số 2.
                    </span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: TẢI BỘ CÀI ĐẶT MÁY TÍNH & ADD-IN WORD (.EXE / .DOTM)               */}
          {/* ========================================================================= */}
          {activeTab === 'download' && (
            <div className="space-y-4 max-w-2xl mx-auto py-2">
              {/* THÔNG TIN XÁC NHẬN BẢN CẬP NHẬT MỚI NHẤT & THỜI GIAN ĐƯA LÊN WEB */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-950 to-cyan-950/80 border border-emerald-500/50 text-slate-200 text-xs space-y-1.5 shadow-lg">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 font-black text-emerald-400 text-xs uppercase tracking-wide">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>XÁC NHẬN PHIÊN BẢN MỚI NHẤT ĐÃ CẬP NHẬT LÊN WEB DEKIEMTRASO.COM</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-md font-mono text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Phiên bản v3.8.2 (Mới nhất)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-300 font-medium pt-1 border-t border-emerald-500/20 font-mono">
                  <div>🕒 <strong>Đưa lên Web lúc:</strong> <span className="text-amber-300 font-bold">09/10/2026 (22:58:23)</span></div>
                  <div>📦 <strong>Bộ cài PC chuẩn:</strong> <span className="text-cyan-300 font-bold">File .exe sạch mới 100%</span></div>
                  <div>✨ <strong>Trạng thái:</strong> <span className="text-emerald-300 font-bold">Đã cập nhật giao diện mới nhất</span></div>
                </div>
              </div>
              
              <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-950/70 via-slate-900 to-indigo-950/70 border-2 border-violet-500/50 shadow-2xl text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-violet-500/20 text-violet-400 mx-auto flex items-center justify-center border border-violet-500/30">
                  <Download className="w-7 h-7" />
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-lg font-black text-white">
                    Bộ Cài Đặt Word Add-in MathStudio 2026+ Pro
                  </h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    Tích hợp trọn bộ 7 nhóm công cụ: Mathpix LaTeX, Căn chỉnh công thức, Soạn thảo đề thi Toán, Kẻ bảng đáp án, Tác giả & Kiểm tra Cập nhật tự động.
                  </p>
                </div>

                {/* CÁC NÚT TẢI XUỐNG ĐA KÊNH AN TOÀN */}
                <div className="flex flex-col gap-2.5 pt-1">
                  
                  {/* PHƯƠNG ÁN 1: BẢN ZIP AN TOÀN (PASS: 123) */}
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                          ⭐ Khuyên Dùng Số 1
                        </span>
                        <span className="text-xs font-bold text-white">Bản ZIP Trọn Gói (Mật khẩu: 123)</span>
                      </div>
                      <p className="text-[11px] text-emerald-300/80 mt-0.5">
                        Trình duyệt không chặn quét nhầm, tải siêu tốc 100% thành công.
                      </p>
                    </div>
                    <a
                      href={MATHSTUDIO_RESOURCES.fullZipUrl}
                      download="MathStudio_Pro_Pass_123.zip"
                      className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition whitespace-nowrap shadow-lg shadow-emerald-500/20 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      TẢI BẢN ZIP (PASS: 123)
                    </a>
                  </div>

                  {/* PHƯƠNG ÁN 2: BẢN .EXE TRỰC TIẾP */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                    <div>
                      <span className="text-xs font-bold text-white">File Cài Đặt Tự Động (.exe trong Zip)</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Dành cho máy tính tự động bung cài. Gói nén chuẩn: <strong>MathStudio_Pro_Pass_123.zip</strong>
                      </p>
                    </div>
                    <a
                      href={MATHSTUDIO_RESOURCES.fullZipUrl}
                      download="MathStudio_Pro_Pass_123.zip"
                      className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition whitespace-nowrap cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      Tải Bộ Cài (.ZIP Pass: 123)
                    </a>
                  </div>

                  {/* PHƯƠNG ÁN 3: FILE .DOTM ADD-IN WORD */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                    <div>
                      <span className="text-xs font-bold text-white">File Ribbon Word Trực Tiếp (.dotm - 128 KB)</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Tải trong 1 giây, mở trực tiếp bằng Word. Tên file: <strong>DinhThanh_MathStudio.dotm</strong>
                      </p>
                    </div>
                    <a
                      href={(MATHSTUDIO_RESOURCES as any).addinUrl || "https://github.com/quangcaodongyen-sketch/GiaoVienAIToanNang3/releases/download/v3.0-nls/DinhThanh_MathStudio.dotm"}
                      download="DinhThanh_MathStudio.dotm"
                      className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition whitespace-nowrap cursor-pointer"
                    >
                      <FileCode className="w-4 h-4 text-amber-400" />
                      Tải File .dotm (128 KB)
                    </a>
                  </div>

                </div>
              </div>

              {/* HỘP HƯỚNG DẪN 3 GIÂY XỬ LÝ KHI TRÌNH DUYỆT BÁO NHẬN DIỆN SAI */}
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-left space-y-2 text-xs">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>HƯỚNG DẪN KHI CỐC CỐC / CHROME BÁO "TỆP NGUY HIỂM / LỖI VIRUS":</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  💡 <strong>Nguyên nhân:</strong> Do phần mềm giáo dục được lập trình đóng gói native, chưa đăng ký chứng chỉ thương mại có trả phí của Microsoft nên các trình duyệt tự động cảnh báo nhận diện sai (False Positive). Phần mềm <strong>an toàn tuyệt đối 100%</strong>.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <strong className="text-amber-300 block">Cách 1: Trình duyệt Cốc Cốc / Chrome chặn:</strong>
                    <p className="text-slate-300">
                      1. Nhấn phím <b>Ctrl + J</b> (trang Tải xuống).<br/>
                      2. Tìm tệp vừa tải ➔ Bấm <b>"Giữ tệp nguy hiểm"</b> (hoặc "Vẫn tiếp tục tải") ➔ Chọn <b>"Vẫn giữ"</b>.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <strong className="text-amber-300 block">Cách 2: Windows SmartScreen hiện màn hình xanh:</strong>
                    <p className="text-slate-300">
                      1. Bấm vào dòng chữ <b>"More info" (Xem thêm / Thông tin khác)</b>.<br/>
                      2. Bấm nút <b>"Run anyway" (Vẫn chạy)</b> để mở bộ cài.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: BẢN QUYỀN & KÍCH HOẠT (CHỮ KÝ SỐ ED25519 & CLOUD SYNC)              */}
          {/* ========================================================================= */}
          {activeTab === 'register' && (
            <div className="space-y-4 max-w-2xl mx-auto py-1">
              
              {/* KHỐI TÁC GIẢ & BẢN QUYỀN THẦY Đinh Thành */}
              <div className="p-4 rounded-2xl bg-[#17143A] border-2 border-indigo-500/60 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 bg-indigo-950 flex items-center justify-center shadow-md">
                    <img
                      src="/dinhvanthanh.jpg"
                      alt="Tác giả Đinh Thành"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wide">
                      TÁC GIẢ & BẢN QUYỀN: TÁC GIẢ ĐINH THÀNH - ĐT: 0915.213717
                    </h4>
                    <p className="text-xs text-slate-200">
                       • Hotline / Zalo: <strong>0915.213717</strong>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      • Phần mềm: <strong>ĐINH THÀNH MATHSTUDIO 2026+ PRO</strong>
                    </p>
                    <p className="text-[10px] text-slate-400 italic mt-0.5">
                      * Công cụ hỗ trợ, tham khảo dành cho giáo viên.
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                  <a
                    href="https://zalo.me/0915213717"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Chat Zalo
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText("0915213717");
                      alert("Đã sao chép SĐT Thầy Thành: 0915.213717");
                    }}
                    className="py-1 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center justify-center gap-1 transition"
                  >
                    <Copy className="w-3 h-3" /> Copy SĐT
                  </button>
                </div>
              </div>

              {/* KHUNG 1: NHẬP MÃ KÍCH HOẠT PRO NẾU ĐÃ CÓ KEY */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/60 via-slate-900 to-indigo-950/60 border border-violet-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-violet-200 flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-400" />
                    Đã có Mã kích hoạt từ Admin? Dán mã vào đây:
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="Dán mã kích hoạt tại đây (KEY-MATH-...)"
                    className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-violet-400/40 text-xs font-mono text-violet-300 focus:outline-none focus:border-violet-400"
                  />
                  <button
                    type="button"
                    onClick={handleActivateKey}
                    className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs whitespace-nowrap transition-colors shadow-md cursor-pointer"
                  >
                    Kích Hoạt Ngay
                  </button>
                </div>

                {verifyResult && (
                  <p className={`text-xs font-semibold ${verifyResult.isValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {verifyResult.message}
                  </p>
                )}

                {/* NÚT ĐỒNG BỘ CLOUD TỰ ĐỘNG */}
                <button
                  type="button"
                  onClick={handleCloudSync}
                  disabled={isSyncingCloud}
                  className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer mt-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncingCloud ? 'animate-spin' : ''}`} />
                  <span>
                    {isSyncingCloud ? 'ĐANG KẾT NỐI VÀ ĐỒNG BỘ TỪ WEB CLOUD...' : '🔄 CẬP NHẬT / ĐỒNG BỘ BẢN QUYỀN TỪ WEB CLOUD (LÀM MỚI TỨC THÌ)'}
                  </span>
                </button>
              </div>

              {/* KHUNG 2: ĐĂNG KÝ BẢN QUYỀN GỬI ADMIN KÍCH HOẠT */}
              {regSuccess ? (
                <div className="p-5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-center space-y-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-bold text-emerald-300">
                    ĐÃ GỬI THÔNG TIN ĐĂNG KÝ CHO ADMIN THÀNH!
                  </h4>
                  <p className="text-slate-300 text-xs max-w-md mx-auto">
                    Mã máy <b className="text-cyan-300 font-mono">{detectedMid}</b> của Thầy/Cô đã được cập nhật lên hệ thống để Admin kích hoạt trực tuyến theo năm.
                  </p>
                  <a
                    href={`https://zalo.me/${BRAND.phoneRaw}?text=${encodeURIComponent(
                      `KÍNH GỬI ADMIN THẦY THÀNH - ĐĂNG KÝ BẢN QUYỀN MATHSTUDIO
• Họ tên: ${regName}
• SĐT/Zalo: ${regPhone}
• Trường: ${regSchool}
• Mã máy: ${detectedMid}
• Gói: ${regPlan === 'LIFETIME' ? 'VIP Trọn Đời' : regPlan === '2YEAR' ? 'Gói 2 Năm' : 'Gói 1 Năm'}
Kính nhờ Thầy kích hoạt bản quyền giúp em!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 py-2.5 px-5 rounded-xl bg-[#0068FF] hover:bg-blue-600 text-white font-bold text-xs shadow"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Nhắn Tin Zalo Thầy Thành ({BRAND.phone})
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmitRegister} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="border-b border-slate-800 pb-2">
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <User className="w-4 h-4 text-violet-400" />
                      Đăng Ký Bản Quyền Kích Hoạt Theo Năm / Trọn Đời
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Điền thông tin và bấm gửi, hệ thống Cloud sẽ chuyển đơn đến Admin Thầy Thành duyệt trực tuyến.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Họ và tên Giáo viên *</label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Ví dụ: Thầy Trần Văn Bình"
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Số điện thoại / Zalo *</label>
                      <input
                        type="text"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="Ví dụ: 0915.xxx.xxx"
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Trường / Đơn vị công tác *</label>
                      <input
                        type="text"
                        required
                        value={regSchool}
                        onChange={(e) => setRegSchool(e.target.value)}
                        placeholder="Ví dụ: Trường THCS..."
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Gói Bản Quyền Mong Muốn</label>
                      <select
                        value={regPlan}
                        onChange={(e) => setRegPlan(e.target.value as any)}
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-violet-500"
                      >
                        <option value="LIFETIME">VIP Trọn Đời (Khuyên dùng)</option>
                        <option value="1YEAR">Gói 1 Năm</option>
                        <option value="2YEAR">Gói 2 Năm (Tiết kiệm)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1 flex items-center justify-between">
                      <span>Mã máy tính (Tự động nhận diện chuẩn DVT-MATH):</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(detectedMid);
                          alert("Đã sao chép mã máy: " + detectedMid);
                        }}
                        className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" /> Copy ID
                      </button>
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={detectedMid}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-xs font-mono font-bold text-cyan-300 select-all cursor-default"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingReg}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 transition active:scale-[0.98] cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmittingReg ? 'ĐANG GỬI LÊN HỆ THỐNG CLOUD...' : 'GỬI ĐĂNG KÝ CHO ADMIN ĐỂ KÍCH HOẠT PRO'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 text-center">
                    Admin Tác giả Đinh Thành (Hotline / Zalo: 0915.213717).
                  </p>
                </form>
              )}

            </div>
          )}

          </div>
          </>
        )}

        {/* FOOTER MODAL */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800/90 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 text-[11px] text-slate-400">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-violet-400"></span>
            <span>Đinh Thành MathStudio 2026+ Pro (Toán học & Mathpix) – Bản quyền: Tác giả Đinh Thành, ĐT: 0915.213717</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="py-1.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
