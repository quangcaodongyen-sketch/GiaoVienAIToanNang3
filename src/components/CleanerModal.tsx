import { TrialRegisterModal } from './TrialRegisterModal';
import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Trash2,
  HardDrive,
  Cpu,
  Zap,
  CheckCircle2,
  AlertCircle,
  Download,
  Key,
  Copy,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Play,
  Sparkles,
  Layers,
  FolderOpen,
  FileCheck,
  Lock,
  Check,
  Activity,
  Flame,
  MessageCircle,
  FileText
} from 'lucide-react';
import { BRAND } from '../config/brand';
import {
  getOrCreateCleanerHardwareCode,
  getSecureCleanerTrialRemaining,
  consumeSecureCleanerTrial,
  isCleanerVIPActivated,
  activateCleanerLicense
} from '../services/cleanerKeyService';

interface CleanerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

interface JunkCategory {
  id: string;
  name: string;
  desc: string;
  estimatedSize: string;
  sizeMb: number;
  icon: string;
  checked: boolean;
  isDeep?: boolean;
}

export const CleanerModal: React.FC<CleanerModalProps> = ({
  isOpen,
  onClose,
  onOpenAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'online' | 'download' | 'license'>('online');
  const [showTrialRegister, setShowTrialRegister] = useState<boolean>(false);
  const [hwid, setHwid] = useState<string>('DT-XXXX-XXXX-XXXX');
  const [remainingTrials, setRemainingTrials] = useState<number>(5);
  const [isVIP, setIsVIP] = useState<boolean>(true); // Miễn phí 100%
  const [licenseKeyInput, setLicenseKeyInput] = useState<string>('');
  const [activationMsg, setActivationMsg] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });
  const [isActivating, setIsActivating] = useState<boolean>(false);

  // Scanning & Cleaning states
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isCleaning, setIsCleaning] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentStepText, setCurrentStepText] = useState<string>('');
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [cleanedResult, setCleanedResult] = useState<{
    freedSpaceGb: number;
    freedRamMb: number;
    filesCount: number;
  } | null>(null);

  // System stats simulation
  const [diskUsedPercent, setDiskUsedPercent] = useState<number>(78);
  const [ramUsedPercent, setRamUsedPercent] = useState<number>(64);

  // Junk categories list
  const [categories, setCategories] = useState<JunkCategory[]>([
    {
      id: 'temp',
      name: 'Tệp tin tạm thời hệ thống (%TEMP%, Windows Temp)',
      desc: 'Tệp rác sinh ra trong quá trình chạy ứng dụng Office, trình duyệt và Windows',
      estimatedSize: '4.8 GB',
      sizeMb: 4915,
      icon: '🗑️',
      checked: true
    },
    {
      id: 'prefetch',
      name: 'Bộ nhớ đệm tiền nạp Windows Prefetch Cache',
      desc: 'Dữ liệu chỉ mục ứng dụng cũ không còn dùng gây nghẽn ổ đĩa',
      estimatedSize: '1.2 GB',
      sizeMb: 1228,
      icon: '⚡',
      checked: true
    },
    {
      id: 'browser',
      name: 'Cache rác trình duyệt (Chrome, Edge, Cốc Cốc, Firefox)',
      desc: 'Dữ liệu web tạm, cookies hết hạn, hình ảnh web lưu đệm nhiều tháng',
      estimatedSize: '3.6 GB',
      sizeMb: 3686,
      icon: '🌐',
      checked: true
    },
    {
      id: 'recycle',
      name: 'Thùng rác hệ thống (Windows Recycle Bin)',
      desc: 'Các tệp tin người dùng đã xóa nhưng vẫn chiếm dụng dung lượng ổ C',
      estimatedSize: '2.4 GB',
      sizeMb: 2457,
      icon: '🚮',
      checked: true
    },
    {
      id: 'thumb',
      name: 'Bộ nhớ đệm biểu tượng & Thumbnail ảnh thu nhỏ',
      desc: 'Tệp thumbs.db và icon cache cũ bị phân mảnh',
      estimatedSize: '950 MB',
      sizeMb: 950,
      icon: '🖼️',
      checked: true
    },
    {
      id: 'winupdate',
      name: 'Gói cài đặt bản cập nhật Windows Update cũ (VIP)',
      desc: 'Bản sao lưu các gói cập nhật Windows tích tụ hàng chục GB',
      estimatedSize: '5.2 GB',
      sizeMb: 5324,
      icon: '📦',
      checked: true,
      isDeep: true
    },
    {
      id: 'crash',
      name: 'Báo cáo sự cố phần mềm & Memory Crash Dumps',
      desc: 'Tệp ghi nhật ký lỗi ứng dụng treo đơ không cần thiết',
      estimatedSize: '1.8 GB',
      sizeMb: 1843,
      icon: '⚠️',
      checked: true
    },
    {
      id: 'recent',
      name: 'Lịch sử tệp mở gần đây & Lối tắt ứng dụng gãy hỏng',
      desc: 'Dọn sạch danh sách file truy cập nhanh để bảo mật riêng tư',
      estimatedSize: '320 MB',
      sizeMb: 320,
      icon: '🔒',
      checked: true
    }
  ]);

  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const code = getOrCreateCleanerHardwareCode();
      setHwid(code);
      setIsVIP(true);
      setRemainingTrials(999999);
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

  const toggleCategory = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c))
    );
  };

  // Tiến hành quét hệ thống
  const handleStartScan = async () => {
    if (isScanning || isCleaning) return;

    if (!isVIP && remainingTrials <= 0) {
      setActiveTab('license');
      return;
    }

    setIsScanning(true);
    setCleanedResult(null);
    setProgress(5);
    setScanLogs(['[KHỞI TẠO] Đang kết nối phân vùng ổ C:\\ và hệ thống tập tin NTFS...']);

    const scanSteps = [
      { pct: 15, text: 'Quét tệp tạm %TEMP% và C:\\Windows\\Temp...', log: 'Phát hiện 3,428 file rác tạm thời (4.8 GB)' },
      { pct: 30, text: 'Quét bộ nhớ đệm C:\\Windows\\Prefetch...', log: 'Phát hiện 412 tệp prefetch chỉ mục cũ (1.2 GB)' },
      { pct: 50, text: 'Quét cache trình duyệt Chrome, Edge, Cốc Cốc...', log: 'Phát hiện 12,890 mục đệm website (3.6 GB)' },
      { pct: 65, text: 'Quét Thùng rác Recycle Bin & Thumbnail Cache...', log: 'Phát hiện 85 file rác thùng rác (2.4 GB)' },
      { pct: 80, text: 'Phân tích thư mục phình to (Zalo PC, CapCut Drafts)...', log: 'Phát hiện thư mục Zalo PC tích tụ 4.2 GB và CapCut Cache 3.1 GB' },
      { pct: 95, text: 'Phân tích gói Windows Update và Crash Dumps...', log: 'Phát hiện gói cập nhật tích lũy cũ (5.2 GB)' },
      { pct: 100, text: 'Hoàn tất quét hệ thống!', log: '✅ TỔNG CỘNG: 19.8 GB rác hệ thống & 2.1 GB RAM phân mảnh có thể giải phóng ngay!' }
    ];

    for (const step of scanSteps) {
      await new Promise((r) => setTimeout(r, 450));
      setProgress(step.pct);
      setCurrentStepText(step.text);
      setScanLogs((prev) => [...prev, `[${step.pct}%] ${step.log}`]);
    }

    setIsScanning(false);
  };

  // Tiến hành dọn rác
  const handleStartClean = async () => {
    if (isCleaning || isScanning) return;

    if (!isVIP && remainingTrials <= 0) {
      setActiveTab('license');
      return;
    }

    setIsCleaning(true);
    setProgress(5);
    setScanLogs((prev) => [
      ...prev,
      '------------------------------------------------------------',
      '🚀 BẮT ĐẦU QUY TRÌNH DỌN DẸP & TỐI ƯU HỆ THỐNG AN TOÀN 100%...'
    ]);

    const cleanSteps = [
      { pct: 20, log: '🧹 Đang dọn sạch C:\\Users\\...\\AppData\\Local\\Temp (Đã xóa 3,428 tệp)' },
      { pct: 40, log: '🧹 Đang làm sạch cache trình duyệt & tệp tin rác internet...' },
      { pct: 60, log: '🧹 Đang dọn sạch Recycle Bin & thu hồi các khối tệp tin phân mảnh...' },
      { pct: 80, log: '🚀 Đang gọi API EmptyWorkingSet: Tối ưu bộ nhớ RAM tức thì...' },
      { pct: 95, log: '🌐 Đang Flush DNS Resolver Cache: Làm sạch bộ đệm phân giải tên miền...' },
      { pct: 100, log: '🎉 HOÀN THÀNH 100%! HỆ THỐNG ĐÃ ĐƯỢC TỐI ƯU HÓA TỐI ĐA!' }
    ];

    for (const step of cleanSteps) {
      await new Promise((r) => setTimeout(r, 550));
      setProgress(step.pct);
      setCurrentStepText(step.log);
      setScanLogs((prev) => [...prev, step.log]);
    }

    // Tiêu thụ 1 lượt dùng thử nếu chưa kích hoạt VIP
    if (!isVIP) {
      const nextTrials = await consumeSecureCleanerTrial();
      setRemainingTrials(nextTrials);
    }

    setCleanedResult({
      freedSpaceGb: 14.8,
      freedRamMb: 2150,
      filesCount: 16815
    });

    // Cập nhật chỉ số ảo mượt mà
    setDiskUsedPercent(52);
    setRamUsedPercent(38);
    setIsCleaning(false);
  };

  // Xử lý kích hoạt bản quyền VIP
  const handleActivateLicense = async () => {
    if (!licenseKeyInput.trim()) {
      setActivationMsg({ text: 'Vui lòng nhập mã bản quyền PRO!', type: 'error' });
      return;
    }

    setIsActivating(true);
    setActivationMsg({ text: '', type: '' });

    try {
      const res = await activateCleanerLicense(licenseKeyInput, hwid);
      if (res.success) {
        setIsVIP(true);
        setRemainingTrials(999);
        setActivationMsg({
          text: `🎉 ${res.message} Chúc mừng bạn đã sở hữu bản quyền ${res.packageName || 'VIP'}!`,
          type: 'success'
        });
      } else {
        setActivationMsg({ text: res.message, type: 'error' });
      }
    } catch {
      setActivationMsg({ text: 'Đã xảy ra lỗi khi kiểm tra mã bản quyền!', type: 'error' });
    } finally {
      setIsActivating(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`Đã sao chép ${label} vào bộ nhớ tạm!`);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl bg-[#0B132B] text-slate-100 rounded-2xl shadow-2xl border border-slate-700/60 flex flex-col my-auto max-h-[92vh] overflow-hidden cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center text-white">
              <Trash2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-wide text-white flex items-center gap-1.5">
                  ĐINH THÀNH CLEANER PRO
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold uppercase tracking-wider">
                    v4.5 VIP ULTRA
                  </span>
                </h2>
                {isVIP && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> BẢN QUYỀN PRO
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Dọn rác máy tính chuyên sâu • Tăng tốc RAM & CPU • Tác giả: Thầy {BRAND.author} ({BRAND.phone})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hidden sm:flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                title="Dành riêng cho Thầy Thành quản lý cấp Key"
              >
                <Key className="w-3.5 h-3.5 text-amber-400" />
                Cấp Key Admin
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3 TABS NAVIGATION */}
        <div className="flex border-b border-slate-800 bg-[#0F172A]/70 text-xs sm:text-sm font-semibold select-none">
          <button
            onClick={() => setActiveTab('online')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'online'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>1. Trải Nghiệm Dọn Rác (Online Studio)</span>
          </button>

          <button
            onClick={() => setActiveTab('download')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'download'
                ? 'border-sky-400 text-sky-300 bg-sky-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>2. Tải Về & Hướng Dẫn (.exe / .zip)</span>
          </button>

          <button
            onClick={() => setActiveTab('license')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'license'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span>3. Bản Quyền & Kích Hoạt VIP (50.000đ)</span>
          </button>
        </div>

        {/* MODAL CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* ========================================================================= */}
          {/* TAB 1: TRẢI NGHIỆM TRỰC TUYẾN (ONLINE STUDIO) */}
          {/* ========================================================================= */}
          {activeTab === 'online' && (
            <div className="space-y-6">
              {/* TRIAL STATUS & PEDAGOGICAL NOTICE */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-700/80">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Chế độ hoạt động</div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      {isVIP ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          👑 Bản Quyền VIP Trọn Đời (100% Công Suất Không Giới Hạn)
                        </span>
                      ) : (
                        <span className="text-amber-300 flex items-center gap-1">
                          ⚡ Bản Dùng Thử Trải Nghiệm (Tối Đa 5 Lần / Máy)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {!isVIP && (
                  <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-300 font-medium">Lượt dùng thử:</span>
                    <div className="flex items-center gap-1 text-emerald-400 text-sm font-black">
                      {[1, 2, 3, 4, 5].map((dot) => (
                        <span key={dot} className={dot <= remainingTrials ? 'text-emerald-400' : 'text-slate-600'}>
                          ●
                        </span>
                      ))}
                      <span className="ml-1 text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-200">
                        {remainingTrials}/5
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* PEDAGOGICAL SAFETY GUARANTEE (TIMES NEW ROMAN 13PT RED TEXT FOR INTEGRATED CONTENT) */}
              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-300 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div
                  className="text-[13pt] leading-relaxed"
                  style={{ fontFamily: '"Times New Roman", Times, serif', color: '#FF0000' }}
                >
                  <strong>LƯU Ý SƯ PHẠM VÀ AN TOÀN DỮ LIỆU TUYỆT ĐỐI:</strong> Thuật toán dọn dẹp Đinh Thành Cleaner Pro v4.5 được thiết kế tối ưu hóa 100% cho giáo viên. Phần mềm chỉ dọn các vùng nhớ tạm, tệp rác hệ điều hành và bộ đệm internet; <strong>tuyệt đối không bao giờ xóa nhầm giáo án Word, bài giảng PowerPoint, đề kiểm tra hay tệp cá nhân của giáo viên</strong>.
                </div>
              </div>

              {/* LIVE SPEEDOMETERS (DISK C & RAM USAGE) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* DISK C METER */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-[#111c38] border border-slate-800 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wide">
                      <HardDrive className="w-4 h-4 text-sky-400" /> Dung Lượng Phân Vùng Ổ C:\
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">
                      SSD NVMe
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-2xl font-black text-white">
                        {diskUsedPercent}% <span className="text-xs text-slate-400 font-normal">đã dùng</span>
                      </div>
                      <div className="text-xs text-slate-400">
                        {cleanedResult ? 'Đã giải phóng 14.8 GB rác' : 'Còn trống 28.4 GB / 256 GB'}
                      </div>
                    </div>
                    <div className="w-14 h-14 rounded-full border-4 border-slate-700 border-t-sky-400 border-r-sky-500 flex items-center justify-center font-bold text-xs text-sky-300">
                      {diskUsedPercent}%
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-teal-400 transition-all duration-700"
                      style={{ width: `${diskUsedPercent}%` }}
                    />
                  </div>
                </div>

                {/* RAM USAGE METER */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-[#111c38] border border-slate-800 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wide">
                      <Cpu className="w-4 h-4 text-emerald-400" /> Bộ Nhớ RAM Hệ Thống
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      DDR4 16GB
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-2xl font-black text-white">
                        {ramUsedPercent}% <span className="text-xs text-slate-400 font-normal">đang sử dụng</span>
                      </div>
                      <div className="text-xs text-slate-400">
                        {cleanedResult ? 'Đã thu hồi 2.1 GB RAM đệm' : 'Đang dùng 10.2 GB / 16.0 GB'}
                      </div>
                    </div>
                    <div className="w-14 h-14 rounded-full border-4 border-slate-700 border-t-emerald-400 border-r-emerald-500 flex items-center justify-center font-bold text-xs text-emerald-300">
                      {ramUsedPercent}%
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-all duration-700"
                      style={{ width: `${ramUsedPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* JUNK CATEGORIES LIST (10 ITEMS) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    Danh Mục Dọn Dẹp Hệ Thống (Chọn Vùng Cần Làm Sạch):
                  </h3>
                  <span className="text-xs text-slate-400">
                    Đã chọn {categories.filter((c) => c.checked).length}/{categories.length} mục
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                        cat.checked
                          ? 'bg-slate-900/90 border-emerald-500/50 shadow-md shadow-emerald-950/20'
                          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 opacity-60'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={cat.checked}
                        onChange={() => {}}
                        className="mt-1 w-4 h-4 rounded text-emerald-500 accent-emerald-500 focus:ring-0 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                            <span>{cat.icon}</span> {cat.name}
                          </span>
                          <span className="text-[11px] font-bold text-amber-400 shrink-0">
                            {cat.estimatedSize}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{cat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PROGRESS & LOGS CONSOLE */}
              {(isScanning || isCleaning || scanLogs.length > 0) && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-2">
                      <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${(isScanning || isCleaning) ? 'animate-spin' : ''}`} />
                      {currentStepText || 'Nhật ký xử lý hệ thống:'}
                    </span>
                    <span className="font-bold text-emerald-400">{progress}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-400 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Terminal log box */}
                  <div className="h-32 overflow-y-auto p-2.5 rounded-lg bg-black/60 border border-slate-900 text-[11px] text-slate-300 space-y-1">
                    {scanLogs.map((log, i) => (
                      <div
                        key={i}
                        className={
                          log.includes('✅') || log.includes('🎉')
                            ? 'text-emerald-400 font-bold'
                            : log.includes('🚀')
                            ? 'text-sky-300 font-bold'
                            : 'text-slate-400'
                        }
                      >
                        {log}
                      </div>
                    ))}
                    <div ref={logsEndRef} />
                  </div>
                </div>
              )}

              {/* SUCCESS CLEANED REPORT */}
              {cleanedResult && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900 border border-emerald-500/40 animate-fade-in">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">DỌN DẸP & TỐI ƯU HÓA HOÀN TẤT THÀNH CÔNG!</h4>
                      <p className="text-xs text-emerald-300">
                        Đã giải phóng <strong>{cleanedResult.freedSpaceGb} GB</strong> rác ổ C và thu hồi <strong>{cleanedResult.freedRamMb} MB</strong> RAM.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={handleStartScan}
                  disabled={isScanning || isCleaning}
                  className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 transition shadow-lg"
                >
                  <RefreshCw className={`w-4 h-4 text-sky-400 ${isScanning ? 'animate-spin' : ''}`} />
                  {isScanning ? 'Đang Quét Hệ Thống...' : '1. Quét Sâu Rác Hệ Thống'}
                </button>

                <button
                  onClick={handleStartClean}
                  disabled={isCleaning || isScanning || (!isVIP && remainingTrials <= 0)}
                  className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/40 transition"
                >
                  <Zap className={`w-4 h-4 text-amber-300 ${isCleaning ? 'animate-bounce' : ''}`} />
                  {isCleaning ? (
                    'Đang Dọn Dẹp An Toàn...'
                  ) : !isVIP && remainingTrials <= 0 ? (
                    'Hết 5 Lượt Thử - Kích Hoạt VIP Ngay'
                  ) : isVIP ? (
                    '2. Tiến Hành Dọn Rác & Tối Ưu VIP'
                  ) : (
                    `2. Tiến Hành Dọn Rác (Còn ${remainingTrials}/5 lượt)`
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: TẢI VỀ & HƯỚNG DẪN KỸ THUẬT */}
          {/* ========================================================================= */}
          {activeTab === 'download' && (
            <div className="space-y-6">
              {/* VIDEO PLAYER SECTION */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Play className="w-4 h-4 text-sky-400" />
                    Video Hướng Dẫn Sử Dụng & Dọn Rác Máy Tính Full HD:
                  </h3>
                  <a
                    href="/cleaner_demo.mp4"
                    download="Video_Huong_Dan_DinhThanh_Cleaner_Pro.mp4"
                    className="text-xs px-3 py-1.5 rounded-lg bg-sky-600/30 hover:bg-sky-600/50 text-sky-300 border border-sky-500/40 font-semibold flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Tải Video (.mp4)
                  </a>
                </div>

                <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
                  <video
                    src="/cleaner_demo.mp4"
                    controls
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover"
                  >
                    Trình duyệt của bạn không hỗ trợ phát video thẻ video HTML5.
                  </video>
                </div>
              </div>

              {/* DOWNLOAD CARDS (.EXE & .ZIP) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* CARD 1: .EXE DIRECT DOWNLOAD */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 to-[#122042] border border-slate-700/80 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <Download className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-white">BỘ CÀI ĐẶT CHÍNH (FILE .EXE)</h4>
                    <p className="text-xs text-slate-400">
                      Tải file thực thi <strong>DinhThanh_Cleaner_Pro.exe</strong> (11.2 MB). Click đúp chuột là chạy ngay, không cần cài đặt rườm rà.
                    </p>
                  </div>
                  <a
                    href="/DinhThanh_Cleaner_Pro.exe"
                    download="DinhThanh_Cleaner_Pro.exe"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-950/30"
                  >
                    <Download className="w-4 h-4" /> Tải DinhThanh_Cleaner_Pro.exe (11.2 MB)
                  </a>
                </div>

                {/* CARD 2: .ZIP FULL BUNDLE */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 to-[#122042] border border-slate-700/80 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                      <FolderOpen className="w-5 h-5" />
                    </div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">GÓI NÉN ZIP ĐẦY ĐỦ</h4>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                        Pass: 123
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Bao gồm phần mềm, file chạy nhanh .bat và tài liệu hướng dẫn chi tiết cho khách hàng.
                    </p>
                  </div>
                  <a
                    href="/DinhThanh_Cleaner_Pro_v4.5.zip"
                    download="DinhThanh_Cleaner_Pro_v4.5.zip"
                    className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-sky-950/30"
                  >
                    <Download className="w-4 h-4" /> Tải Gói Nén .ZIP (10.9 MB)
                  </a>
                </div>
              </div>

              {/* 4-STEP PEDAGOGICAL TUTORIAL */}
              <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  Quy Trình 4 Bước Dọn Rác & Tăng Tốc Máy Tính Đạt Hiệu Quả Cao Nhất:
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                    <div className="font-bold text-emerald-400">Bước 1: Chạy Quyền Administrator</div>
                    <p className="text-slate-400">
                      Bấm chuột phải vào file <strong>DinhThanh_Cleaner_Pro.exe</strong> chọn <em>"Run as administrator"</em> để cấp quyền dọn dẹp các tệp rác hệ thống sâu.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                    <div className="font-bold text-sky-400">Bước 2: Quét & Dọn Rác Siêu Tốc</div>
                    <p className="text-slate-400">
                      Tại <strong>Tab 1</strong>, bấm nút <em>"Dọn Rác Ngay"</em>. Phần mềm sẽ tự động làm sạch 10 khu vực và giải phóng ngay 5GB - 20GB dung lượng ổ C.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                    <div className="font-bold text-amber-400">Bước 3: Phân Tích Zalo & CapCut (Tab 2)</div>
                    <p className="text-slate-400">
                      Mở <strong>Tab Phân tích thủ phạm</strong> để xem dung lượng bộ nhớ đệm của Zalo PC, CapCut, Premiere và bấm nút <em>"Mở thư mục trực tiếp"</em> để xóa an toàn.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                    <div className="font-bold text-purple-400">Bước 4: Tối Ưu RAM & Tắt Ngủ Đông</div>
                    <p className="text-slate-400">
                      Bấm nút <em>"Giải phóng RAM"</em> và <em>"Tắt chế độ ngủ đông"</em> để lấy lại thêm 8GB - 16GB bộ nhớ SSD tức thì.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: BẢN QUYỀN & KÍCH HOẠT VIP */}
          {/* ========================================================================= */}
          {activeTab === 'license' && (
            <div className="space-y-6">
              {/* HARDWARE ID CARD */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-amber-400" />
                    Mã Máy Tính Cá Nhân Hóa (Hardware Code):
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">Định danh phần cứng riêng biệt</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-base font-bold text-sky-400 tracking-wider select-all">
                    {hwid}
                  </div>
                  <button
                    onClick={() => copyToClipboard(hwid, 'Mã máy')}
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition"
                  >
                    <Copy className="w-4 h-4" /> Sao Chép
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Gửi mã máy này qua Zalo <strong>{BRAND.phone}</strong> (Thầy Đinh Văn Thành) để nhận mã kích hoạt bản quyền VIP trọn đời.
                </p>
              </div>

              {/* PRICING PACKAGES TABLE */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Bảng Giá Gói Bản Quyền Chính Thức:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Gói 1 Năm */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-center">
                    <div className="text-xs font-bold text-slate-400">GÓI 1 NĂM</div>
                    <div className="text-xl font-black text-white">30.000đ</div>
                    <p className="text-[11px] text-slate-400">Sử dụng đầy đủ tính năng trong 365 ngày</p>
                  </div>

                  {/* Gói 2 Năm */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-center">
                    <div className="text-xs font-bold text-slate-400">GÓI 2 NĂM</div>
                    <div className="text-xl font-black text-white">40.000đ</div>
                    <p className="text-[11px] text-slate-400">Sử dụng đầy đủ tính năng trong 730 ngày</p>
                  </div>

                  {/* Gói Trọn Đời (Hot) */}
                  <div className="p-4 rounded-xl bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-500/60 space-y-2 text-center relative overflow-hidden shadow-lg shadow-amber-950/20">
                    <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 uppercase tracking-wider rounded-bl-lg">
                      PHỔ BIẾN NHẤT
                    </div>
                    <div className="text-xs font-bold text-amber-300">GÓI TRỌN ĐỜI (VIP)</div>
                    <div className="text-2xl font-black text-amber-400">50.000đ</div>
                    <p className="text-[11px] text-slate-300 font-medium">Kích hoạt vĩnh viễn theo máy tính, cập nhật miễn phí</p>
                  </div>
                </div>
              </div>

              {/* LICENSE ACTIVATION FORM */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                    Nhập Mã Kích Hoạt Bản Quyền VIP (Dạng: PRO-XXXX-XXXX-XXXX-XXXX):
                  </label>
                  <input
                    type="text"
                    value={licenseKeyInput}
                    onChange={(e) => setLicenseKeyInput(e.target.value)}
                    placeholder="Dán mã bản quyền Pro nhận được từ Thầy Thành..."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm tracking-wider focus:outline-none focus:border-amber-400"
                  />
                </div>

                {activationMsg.text && (
                  <div
                    className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                      activationMsg.type === 'success'
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {activationMsg.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    )}
                    {activationMsg.text}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleActivateLicense}
                    disabled={isActivating || !licenseKeyInput.trim()}
                    className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-amber-950/30"
                  >
                    <Key className="w-4 h-4" />
                    {isActivating ? 'Đang Xác Thực...' : '🚀 Kích Hoạt Bản Quyền VIP Ngay'}
                  </button>

                  <a
                    href={`https://zalo.me/${BRAND.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Nhắn Zalo: {BRAND.phone}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="px-5 py-3 bg-[#0F172A] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Tác giả: <span className="text-slate-200 font-semibold">Thầy {BRAND.author}</span> – Trường THCS Đồng Yên
          </div>
          <div className="flex items-center gap-3">
            <span>Hotline / Zalo: <strong className="text-amber-400">{BRAND.phone}</strong></span>
            <button
              onClick={onClose}
              className="py-1 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
          <TrialRegisterModal isOpen={showTrialRegister} onClose={() => setShowTrialRegister(false)} initialAppId="cleaner" initialAppName="PC Cleaner Pro" />
</div>
  );
};
