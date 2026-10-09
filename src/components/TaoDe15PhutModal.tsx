import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Download,
  Copy,
  Check,
  Crown,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  User,
  Send,
  RefreshCw,
  Printer,
  Eye,
  AlertCircle,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { BRAND, EXAM_15P_RESOURCES } from '../config/brand';
import { cloudSyncService } from '../services/cloudSyncService';
import {
  getOrCreateExam15PHardwareCode,
  verifyExam15PLicenseKey,
  Exam15PVerifyResult,
  getExam15PTrialRemaining,
  decrementExam15PTrial
} from '../services/taode15pKeyService';
import { webSecurityGuard } from '../services/webSecurityGuard';
import { ShareLinkBar } from './ShareLinkBar';
import { syncBrowserHash } from '../utils/shareUtils';

interface TaoDe15PhutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
  onSwitchToStandardExam?: () => void;
}

export const TaoDe15PhutModal: React.FC<TaoDe15PhutModalProps> = ({ 
  isOpen, 
  onClose, 
  onOpenAdmin,
  onSwitchToStandardExam 
}) => {
  // Chuẩn hóa theo mô hình NLS-AI: Mặc định Tab Tải về máy tính
  const [activeTab, setActiveTab] = useState<'download' | 'register' | 'preview'>('download');

  // State Dùng thử 5 lần cố định trên máy tính
  const [trialRemaining, setTrialRemaining] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [examGenerated, setExamGenerated] = useState<boolean>(true);
  const [selectedGrade, setSelectedGrade] = useState<string>('6');
  const [selectedUnit, setSelectedUnit] = useState<number>(1);
  const [previewFace, setPreviewFace] = useState<1 | 2 | 3>(1);
  const [currentCode, setCurrentCode] = useState<1 | 2>(1);

  const [schoolName] = useState<string>('TRƯỜNG THCS ....................');

  const [detectedMid, setDetectedMid] = useState<string>('');
  const [isProActive, setIsProActive] = useState<boolean>(false);
  const [verifyResult, setVerifyResult] = useState<Exam15PVerifyResult | null>(null);
  const [inputKey, setInputKey] = useState<string>('');
  const [copiedMid, setCopiedMid] = useState<boolean>(false);

  // Form đăng ký Giáo viên
  const [regName, setRegName] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regSchool, setRegSchool] = useState<string>('');
  const [regProvince, setRegProvince] = useState<string>('');
  const [regNote, setRegNote] = useState<string>('');
  const [regSent, setRegSent] = useState<boolean>(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    syncBrowserHash('#tao-de-15p-tienganh');
    const mid = getOrCreateExam15PHardwareCode();
    setDetectedMid(mid);

    const savedPro = localStorage.getItem('gvai_taode15p_is_pro_active') === 'true';
    if (savedPro) {
      setIsProActive(true);
    }

    setTrialRemaining(getExam15PTrialRemaining());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyMid = () => {
    navigator.clipboard.writeText(detectedMid);
    setCopiedMid(true);
    setTimeout(() => setCopiedMid(false), 2000);
  };

  const handleActivateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;

    const res = await verifyExam15PLicenseKey(inputKey, detectedMid);
    setVerifyResult(res);

    if (res.isValid) {
      setIsProActive(true);
      localStorage.setItem('gvai_taode15p_is_pro_active', 'true');
      localStorage.setItem('gvai_taode15p_license_key', inputKey.trim());
      localStorage.setItem('gvai_taode15p_plan', res.packageName || 'Pro');

      // Đồng bộ đăng ký thành công lên Cloud
      try {
        await cloudSyncService.submitRegistrationToCloud({
          machineId: detectedMid,
          fullName: regName || 'Giáo viên Tiếng Anh THCS',
          schoolUnit: regSchool || 'Trường THCS',
          phoneNumber: regPhone || 'Chưa cung cấp',
          appId: 'tao-de-15p-tienganh',
          appName: 'Tạo Đề 15 Phút Tiếng Anh (48 Units)',
          packageType: 'LIFETIME'
        });
      } catch (err) {
        console.warn('Lỗi đồng bộ:', err);
      }
    } else {
      webSecurityGuard.recordFailedKeyAttempt('tao-de-15p-tienganh', inputKey, detectedMid);
    }
  };

  const handleSyncCloud = async () => {
    setIsSyncingCloud(true);
    try {
      const res = await cloudSyncService.checkCurrentMachineCloudStatus(detectedMid, 'tao-de-15p-tienganh');
      if (res && res.isApproved) {
        setIsProActive(true);
        localStorage.setItem('gvai_taode15p_is_pro_active', 'true');
        setVerifyResult({
          isValid: true,
          packageName: res.packageType || 'Pro Cloud',
          message: 'Đồng bộ bản quyền từ máy chủ thành công!'
        });
      } else {
        setVerifyResult({
          isValid: false,
          message: 'Chưa tìm thấy bản quyền trên hệ thống đám mây. Vui lòng liên hệ Thầy Thành để kích hoạt.'
        });
      }
    } catch {
      setVerifyResult({
        isValid: false,
        message: 'Không thể kết nối máy chủ Cloud, vui lòng thử lại sau.'
      });
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const handleCreateTest = () => {
    if (!isProActive && trialRemaining <= 0) {
      setActiveTab('register');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setExamGenerated(true);
      if (!isProActive) {
        const next = decrementExam15PTrial();
        setTrialRemaining(next);
      }
    }, 500);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) {
      alert('Vui lòng nhập Họ tên và Số điện thoại / Zalo!');
      return;
    }

    setIsSyncingCloud(true);
    try {
      await cloudSyncService.submitRegistrationToCloud({
        machineId: detectedMid,
        fullName: regName.trim(),
        schoolUnit: (regSchool.trim() ? `${regSchool.trim()} - ` : '') + (regProvince.trim() || 'Toàn quốc'),
        phoneNumber: regPhone.trim(),
        appId: 'tao-de-15p-tienganh',
        appName: 'Tạo Đề 15 Phút Tiếng Anh (48 Units)',
        packageType: '1YEAR'
      });
      setRegSent(true);
    } catch {
      setRegSent(true);
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const code1 = `${selectedGrade}01`;
  const code2 = `${selectedGrade}02`;
  const activeCodeDisplay = currentCode === 1 ? code1 : code2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-blue-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Modal */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-950 via-blue-950/80 to-slate-950 border-b border-blue-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/20">
              📝
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  TẠO ĐỀ 15 PHÚT TIẾNG ANH (GLOBAL SUCCESS)
                </h3>
                <span className="px-2.5 py-0.5 text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-full flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-400" /> BẢN QUYỀN PRO THẦY THÀNH
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tác giả: Thầy giáo Đinh Văn Thành • THCS Đồng Yên • Hotline/Zalo: 0915.213717
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ShareLinkBar 
              appUrl="#tao-de-15p-tienganh" 
              appName="Tạo Đề 15 Phút Tiếng Anh" 
              compact={true} 
            />
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition text-xs font-bold"
                title="Cổng quản trị cấp mã bản quyền"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Key</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* THANH LINK GỬI KHÁCH HÀNG (TRỰC QUAN - COPY 1 CHẠM GỬI ZALO) */}
        <ShareLinkBar 
          appUrl="#tao-de-15p-tienganh" 
          appName="Tạo Đề 15 Phút Tiếng Anh (Global Success)" 
        />

        {/* 3 Tabs Navigation Bar - Chuẩn mô hình NLS-AI */}
        <div className="flex border-b border-slate-800 bg-slate-950/70 px-4 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('download')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'download'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>1. Tải Bản Máy Tính (.exe / .zip Pass: 123)</span>
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'register'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>2. Bản Quyền & Kích Hoạt</span>
            {isProActive && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                ĐÃ KÍCH HOẠT
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'preview'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4 text-emerald-400" />
            <span>3. Xem Mẫu Đề Thi 15 Phút</span>
            {!isProActive && (
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30">
                {trialRemaining}/5 lượt thử
              </span>
            )}
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* ========================================================================= */}
          {/* TAB 1: TẢI BỘ CÀI MÁY TÍNH (.EXE / .ZIP PASS: 123) */}
          {/* ========================================================================= */}
          {activeTab === 'download' && (
            <div className="space-y-6">
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
              
              {/* Thẻ tải bộ cài chính */}
              <div className="p-5 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 rounded-2xl border border-emerald-500/40 space-y-3 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-xl border border-emerald-500/30">
                    📦
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">TRỌN BỘ CÀI ĐẶT TẠO ĐỀ 15 PHÚT PRO (.ZIP - MẬT KHẨU: 123)</h4>
                    <p className="text-xs text-slate-400">Phiên bản offline trọn bộ 48 Units (Lớp 6, 7, 8, 9) • Tải trực tiếp siêu tốc từ GitHub Releases</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Đã nén an toàn trong file .ZIP với mật khẩu bảo vệ <code className="text-amber-300 font-bold bg-amber-500/20 px-1.5 py-0.5 rounded">123</code> giúp tải 100% không bị trình duyệt Chrome/Cốc Cốc hay Windows Defender ngăn chặn.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <a
                    href={EXAM_15P_RESOURCES.fullZipUrl}
                    download="TaoDe_15Phut_TiengAnh_THCS_Pass_123.zip"
                    className="py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition text-center"
                  >
                    <Download className="w-4 h-4" /> 🚀 TẢI BẢN NÉN (.ZIP PASS: 123)
                  </a>
                  <a
                    href={(EXAM_15P_RESOURCES as any).dotmUrl || "https://github.com/quangcaodongyen-sketch/GiaoVienAIToanNang3/releases/download/v3.0-nls/TaoDe_15Phut_TiengAnh_THCS.dotm"}
                    download="TaoDe_15Phut_TiengAnh_THCS.dotm"
                    className="py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition text-center"
                  >
                    <Download className="w-4 h-4" /> 📄 TẢI ADD-IN WORD (.DOTM)
                  </a>
                </div>
              </div>

              {/* Hướng dẫn 3 bước */}
              <div className="p-5 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <span>📖</span> Quy trình 3 bước sử dụng chuẩn mực:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="font-bold text-blue-400 mb-1">Bước 1: Chọn Khối & Unit</div>
                    <p className="text-slate-400">Chọn khối lớp 6, 7, 8, 9 và bài học cần kiểm tra 15 phút.</p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="font-bold text-indigo-400 mb-1">Bước 2: Sinh 2 Mã Đề</div>
                    <p className="text-slate-400">Hệ thống tự động hoán vị câu hỏi, sinh cặp mã đối xứng (601-602, 701-702...).</p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="font-bold text-emerald-400 mb-1">Bước 3: In & Chấm Nhanh</div>
                    <p className="text-slate-400">Xuất file Word hoặc in ấn 5 mặt: 2 mặt đề, 2 phiếu trắc nghiệm, 1 bảng đáp án.</p>
                  </div>
                </div>
              </div>

              {/* Gợi ý chuyển app */}
              <div className="p-4 bg-blue-950/30 border border-blue-500/20 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-white">Thầy/Cô cần tạo đề kiểm tra 4 kỹ năng chuẩn Bộ GD&ĐT?</div>
                  <p className="text-slate-400 mt-0.5">Sử dụng phần mềm Tạo Đề Tiếng Anh THCS (Công văn 7991).</p>
                </div>
                {onSwitchToStandardExam && (
                  <button
                    onClick={() => {
                      onClose();
                      onSwitchToStandardExam();
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition shrink-0"
                  >
                    Mở App Tạo Đề CV 7991
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: BẢN QUYỀN & KÍCH HOẠT */}
          {/* ========================================================================= */}
          {activeTab === 'register' && (
            <div className="space-y-6">
              
              {/* Thẻ hiển thị Mã máy tính */}
              <div className="p-5 bg-slate-950/80 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">MÃ MÁY TÍNH CỦA BẠN (HARDWARE CODE):</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold">DVT-15M</span>
                  </div>
                  <div className="font-mono text-xl sm:text-2xl font-black text-amber-400 tracking-wider mt-1">
                    {detectedMid || 'DVT-15M-8899-AABB'}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Gửi mã này cho Thầy Đinh Văn Thành để nhận Khóa kích hoạt bản quyền.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleCopyMid}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-2 transition"
                  >
                    {copiedMid ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedMid ? 'Đã sao chép!' : 'Sao chép mã máy'}</span>
                  </button>
                  <button
                    onClick={handleSyncCloud}
                    disabled={isSyncingCloud}
                    className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition shadow-lg shadow-cyan-600/30"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncingCloud ? 'animate-spin' : ''}`} />
                    <span>Đồng Bộ Cloud 24/7</span>
                  </button>
                  <a
                    href={`https://zalo.me/0915213717?text=${encodeURIComponent(
                      `Chào Thầy Thành, tôi muốn đăng ký Bản quyền Tạo Đề 15 Phút Tiếng Anh (48 Units). Mã máy tính của tôi là: ${detectedMid}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition shadow-lg shadow-blue-600/30"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Nhắn Zalo Thầy Thành</span>
                  </a>
                </div>
              </div>

              {/* Form Đăng ký thông tin Giáo viên */}
              <div className="p-5 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-400" /> Form Đăng Ký Cấp Key Bản Quyền Sư Phạm:
                </h4>

                {regSent ? (
                  <div className="p-4 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-bold">Đã gửi thông tin đăng ký thành công!</div>
                      <div className="text-slate-400 mt-0.5">
                        Thầy Thành sẽ liên hệ qua Zalo/Điện thoại để gửi mã bản quyền Pro cho Thầy/Cô sớm nhất.
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">Họ và tên Giáo viên *</label>
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Ví dụ: Thầy Nguyễn Văn A"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">Số điện thoại / Zalo *</label>
                        <input
                          type="text"
                          required
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="Ví dụ: 0988xxxxxx"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">Trường THCS công tác</label>
                        <input
                          type="text"
                          value={regSchool}
                          onChange={(e) => setRegSchool(e.target.value)}
                          placeholder="Ví dụ: THCS Chu Văn An..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1">Tỉnh / Thành phố</label>
                        <input
                          type="text"
                          value={regProvince}
                          onChange={(e) => setRegProvince(e.target.value)}
                          placeholder="Ví dụ: Hà Giang, Hà Nội..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Ghi chú hoặc yêu cầu thêm</label>
                      <input
                        type="text"
                        value={regNote}
                        onChange={(e) => setRegNote(e.target.value)}
                        placeholder="Nội dung cần tư vấn..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSyncingCloud}
                      className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSyncingCloud ? 'Đang gửi đăng ký...' : 'Gửi Thông Tin Đăng Ký'}</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Ô kích hoạt Key */}
              <div className="p-5 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" /> Kích hoạt Bản Quyền Pro:
                </h4>
                <form onSubmit={handleActivateKey} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="Dán mã Key kích hoạt (Ví dụ: 15M-LIFE-99991231-XXXXX)..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" /> Kích Hoạt Ngay
                  </button>
                </form>

                {verifyResult && (
                  <div
                    className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                      verifyResult.isValid
                        ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                        : 'bg-red-950/50 border-red-500/40 text-red-300'
                    }`}
                  >
                    {verifyResult.isValid ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                    <span>{verifyResult.message}</span>
                  </div>
                )}
              </div>

              {/* Bảng các gói bản quyền SƯ PHẠM (Tuân thủ Quy tắc 4: Tuyệt đối không hiển thị giá tiền số cố định) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-center space-y-2">
                  <div className="text-xs font-bold text-slate-400">GÓI BẢN QUYỀN 1 NĂM</div>
                  <div className="text-sm font-black text-slate-200">Ưu Đãi Sư Phạm</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Sử dụng đầy đủ 48 Units (Lớp 6, 7, 8, 9) trong 1 năm học. Hỗ trợ kỹ thuật chu đáo.
                  </p>
                </div>
                <div className="p-4 bg-slate-900/60 rounded-xl border border-blue-500/40 text-center space-y-2 relative">
                  <div className="text-xs font-bold text-blue-400">GÓI BẢN QUYỀN 2 NĂM</div>
                  <div className="text-sm font-black text-blue-300">Tiết Kiệm Tối Đa</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Giải pháp tối ưu cho chu kỳ đào tạo 2 năm, cập nhật liên tục đề mới.
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-b from-amber-950/30 to-slate-900 rounded-xl border border-amber-500/50 text-center space-y-2">
                  <div className="text-xs font-bold text-amber-400">GÓI VIP TRỌN ĐỜI (KHUYÊN DÙNG)</div>
                  <div className="text-sm font-black text-amber-300">Hỗ Trợ Vĩnh Viễn</div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Kích hoạt một lần dùng mãi mãi, chuyển bản quyền khi đổi máy, cập nhật trọn đời.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center text-xs text-amber-300">
                ⭐ <b>Chính sách sư phạm:</b> Liên hệ Admin Thầy Thành để kích hoạt bản quyền Pro & nhận báo giá ưu đãi sư phạm qua Zalo: <b>0915.213717</b>.
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: XEM MẪU ĐỀ THI 15 PHÚT (GLOBAL SUCCESS) */}
          {/* ========================================================================= */}
          {activeTab === 'preview' && (
            <div className="space-y-5">
              
              {/* Banner nhắc nhở tải bản máy tính chuẩn mực NLS-AI */}
              <div className="p-4 bg-gradient-to-r from-amber-950/50 via-slate-900 to-amber-950/50 border border-amber-500/40 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-amber-300 text-sm">
                      BẢN XEM TRƯỚC MẪU CẤU TRÚC ĐỀ 15 PHÚT (GLOBAL SUCCESS)
                    </div>
                    <p className="text-slate-300 mt-1 leading-relaxed">
                      Chức năng trên web chỉ phục vụ xem trước cấu trúc mẫu. Để tạo và xuất file Word .docx tự động cho toàn bộ 48 Units (Lớp 6, 7, 8, 9), tự động hoán vị câu hỏi và sinh cặp mã đối xứng, Thầy/Cô vui lòng tải phần mềm về máy tính và kích hoạt bản quyền Pro.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('download')}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl transition shrink-0 shadow-lg flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải Bộ Cài Máy Tính</span>
                </button>
              </div>

              {/* Thanh tiến trình Dùng thử 5 lần */}
              <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold text-slate-300">Tiến trình dùng thử máy tính:</span>
                  <div className="flex gap-1.5 text-base">
                    {[1, 2, 3, 4, 5].map((idx) => (
                      <span
                        key={idx}
                        className={
                          isProActive
                            ? 'text-emerald-400'
                            : idx <= 5 - trialRemaining
                            ? 'text-blue-500'
                            : 'text-slate-700'
                        }
                      >
                        ●
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-400">
                    {isProActive ? 'Vô hạn (Pro VIP)' : `Còn ${trialRemaining}/5 lượt miễn phí`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('download')}
                    className="px-3 py-1.5 text-xs font-bold bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải bản Desktop</span>
                  </button>
                </div>
              </div>

              {/* Bộ điều khiển & Tạo đề */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                {/* Chọn Lớp */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">1. Khối Lớp (Global Success)</label>
                  <div className="grid grid-cols-4 gap-1">
                    {['6', '7', '8', '9'].map((g) => (
                      <button
                        key={g}
                        onClick={() => setSelectedGrade(g)}
                        className={`py-2 text-xs font-bold rounded-lg border transition ${
                          selectedGrade === g
                            ? 'bg-blue-600 text-white border-blue-500 shadow'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        Lớp {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chọn Unit */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">2. Chọn Unit (1 - 12)</label>
                  <select
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((u) => (
                      <option key={u} value={u}>
                        Unit {u} (Tiếng Anh {selectedGrade})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nút Điều Hướng Tải Máy Tính */}
                <div className="flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={() => setActiveTab('download')}
                    className="w-full py-2.5 px-3 font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>TẢI PHẦN MỀM ĐỂ TẠO ĐỀ TRÊN MÁY</span>
                  </button>
                </div>
              </div>

              {/* Toolbar xem trước & xuất tệp */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-400 font-semibold">Xem trang:</span>
                  <button
                    onClick={() => setPreviewFace(1)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition ${
                      previewFace === 1 ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    📄 Đề 20 câu (Trang 1/3)
                  </button>
                  <button
                    onClick={() => setPreviewFace(2)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition ${
                      previewFace === 2 ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    📝 Phiếu TN (Trang 2/4)
                  </button>
                  <button
                    onClick={() => setPreviewFace(3)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition ${
                      previewFace === 3 ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    🔑 Đáp án nhanh (Trang 5)
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-slate-400 font-medium">Mã đề:</span>
                    <button
                      onClick={() => setCurrentCode(1)}
                      className={`px-2.5 py-1 rounded font-mono font-bold ${
                        currentCode === 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {code1}
                    </button>
                    <button
                      onClick={() => setCurrentCode(2)}
                      className={`px-2.5 py-1 rounded font-mono font-bold ${
                        currentCode === 2
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {code2}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('download')}
                    className="px-3 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition flex items-center gap-1 shadow cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Tải bản Desktop để In/Xuất Word
                  </button>
                </div>
              </div>

              {/* Khung tài liệu A4 mô phỏng (Font Times New Roman chuẩn) */}
              <div className="bg-white text-black p-6 rounded-xl shadow-xl border border-slate-300 min-h-[480px] font-['Times_New_Roman'] text-[13px] leading-relaxed">
                {previewFace === 1 && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-start border-b border-black pb-2 text-[12px]">
                      <div>
                        <div className="font-bold text-[13px]">{schoolName}</div>
                        <div>Họ và tên: ................................................................</div>
                        <div>Lớp: {selectedGrade}A.....</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-[13px] uppercase">BÀI KIỂM TRA 15 PHÚT</div>
                        <div className="italic">Môn: Tiếng Anh {selectedGrade} - Unit {selectedUnit}</div>
                        <div className="font-bold text-red-600 text-[13px]">Mã đề: {activeCodeDisplay}</div>
                      </div>
                    </div>

                    <div className="font-bold text-[12.5px]">
                      Part I: Vocabulary & Communication. <span className="font-normal italic">Choose the best answer A, B, or C.</span>
                    </div>

                    <div className="space-y-1.5 pl-2 text-[12px]">
                      <div>
                        <b>1.</b> I need a _______ to draw a circle in geometry class.
                        <div className="pl-4 flex gap-6 text-[11.5px]">
                          <span><b>A.</b> calculator</span>
                          <span className="font-bold text-red-600"><b>B.</b> compass</span>
                          <span><b>C.</b> rubber</span>
                        </div>
                      </div>
                      <div>
                        <b>2.</b> Students in my school always wear a _______ on Mondays.
                        <div className="pl-4 flex gap-6 text-[11.5px]">
                          <span className="font-bold text-red-600"><b>A.</b> uniform</span>
                          <span><b>B.</b> jacket</span>
                          <span><b>C.</b> towel</span>
                        </div>
                      </div>
                      <div>
                        <b>3.</b> Look! The boys _______ football in the school yard.
                        <div className="pl-4 flex gap-6 text-[11.5px]">
                          <span><b>A.</b> play</span>
                          <span className="font-bold text-red-600"><b>B.</b> are playing</span>
                          <span><b>C.</b> plays</span>
                        </div>
                      </div>
                      <div>
                        <b>4.</b> My best friend has _______ hair and big blue eyes.
                        <div className="pl-4 flex gap-6 text-[11.5px]">
                          <span className="font-bold text-red-600"><b>A.</b> short black</span>
                          <span><b>B.</b> black short</span>
                          <span><b>C.</b> a short black</span>
                        </div>
                      </div>
                    </div>

                    <div className="font-bold text-[12.5px] pt-1">
                      Part II: Grammar & Reading Comprehension. <span className="font-normal italic">Choose the correct option.</span>
                    </div>

                    <div className="space-y-1.5 pl-2 text-[12px]">
                      <div>
                        <b>11.</b> There _______ two computers in our school library.
                        <div className="pl-4 flex gap-6 text-[11.5px]">
                          <span><b>A.</b> is</span>
                          <span className="font-bold text-red-600"><b>B.</b> are</span>
                          <span><b>C.</b> have</span>
                        </div>
                      </div>
                      <div>
                        <b>12.</b> Lan is very _______. She always helps her friends with difficult homework.
                        <div className="pl-4 flex gap-6 text-[11.5px]">
                          <span className="font-bold text-red-600"><b>A.</b> helpful</span>
                          <span><b>B.</b> shy</span>
                          <span><b>C.</b> active</span>
                        </div>
                      </div>
                      <div className="text-center text-slate-500 italic text-[11px] pt-3">
                        --- [Trọn vẹn đúng 20 câu trắc nghiệm nằm gọn trên 1 trang giấy A4] ---
                      </div>
                    </div>
                  </div>
                )}

                {previewFace === 2 && (
                  <div className="space-y-4 text-center">
                    <div className="font-bold text-[15px] uppercase tracking-wide">
                      PHIẾU TRẢ LỜI TRẮC NGHIỆM 20 CÂU
                    </div>
                    <p className="text-xs text-slate-600 italic">
                      Mẫu chuẩn in ấn sạch sẽ (Đã loại bỏ chữ 8C, có chỗ điền Họ tên, Lớp, Mã đề)
                    </p>
                    <div className="max-w-md mx-auto border-2 border-slate-800 p-4 rounded-lg bg-slate-50">
                      <div className="grid grid-cols-2 gap-4 text-left text-xs">
                        <div>
                          <div><b>Mã đề thi:</b> [{activeCodeDisplay}]</div>
                          <div><b>Họ và tên:</b> ..............................</div>
                        </div>
                        <div>
                          <div><b>Lớp:</b> ....................................</div>
                          <div><b>Điểm:</b> ...................................</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-300 text-xs">
                        <div className="space-y-1">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                            <div key={n} className="flex items-center gap-2">
                              <span className="font-bold w-5">{n}.</span>
                              <span className="px-1.5 py-0.5 border rounded-full text-[10px]">A</span>
                              <span className="px-1.5 py-0.5 border rounded-full text-[10px]">B</span>
                              <span className="px-1.5 py-0.5 border rounded-full text-[10px]">C</span>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-1">
                          {[11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(n => (
                            <div key={n} className="flex items-center gap-2">
                              <span className="font-bold w-5">{n}.</span>
                              <span className="px-1.5 py-0.5 border rounded-full text-[10px]">A</span>
                              <span className="px-1.5 py-0.5 border rounded-full text-[10px]">B</span>
                              <span className="px-1.5 py-0.5 border rounded-full text-[10px]">C</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {previewFace === 3 && (
                  <div className="space-y-3">
                    <div className="text-center font-bold text-[14px] uppercase text-slate-800">
                      BẢNG ĐÁP ÁN RÚT GỌN (CHẤM NHANH TRONG VÀI GIÂY)
                    </div>
                    <div className="text-center text-xs text-slate-600 italic">
                      Đối chiếu 2 mã đề song song ({code1} & {code2})
                    </div>
                    <table className="w-full max-w-lg mx-auto border-collapse border border-black text-xs text-center mt-2">
                      <thead>
                        <tr className="bg-slate-100 font-bold">
                          <th className="border border-black p-1">Câu</th>
                          <th className="border border-black p-1 text-red-600">Mã {code1}</th>
                          <th className="border border-black p-1 text-blue-600">Mã {code2}</th>
                          <th className="border border-black p-1">Câu</th>
                          <th className="border border-black p-1 text-red-600">Mã {code1}</th>
                          <th className="border border-black p-1 text-blue-600">Mã {code2}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          [1, 'B', 'A', 11, 'B', 'C'],
                          [2, 'A', 'C', 12, 'A', 'B'],
                          [3, 'B', 'B', 13, 'C', 'A'],
                          [4, 'A', 'A', 14, 'B', 'B'],
                          [5, 'C', 'B', 15, 'A', 'C'],
                          [6, 'A', 'C', 16, 'B', 'A'],
                          [7, 'B', 'A', 17, 'C', 'B'],
                          [8, 'C', 'B', 18, 'A', 'A'],
                          [9, 'A', 'C', 19, 'B', 'C'],
                          [10, 'B', 'A', 20, 'C', 'B'],
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="border border-black p-1 font-bold">{row[0]}</td>
                            <td className="border border-black p-1 font-bold text-red-600">{row[1]}</td>
                            <td className="border border-black p-1 font-bold text-blue-600">{row[2]}</td>
                            <td className="border border-black p-1 font-bold">{row[3]}</td>
                            <td className="border border-black p-1 font-bold text-red-600">{row[4]}</td>
                            <td className="border border-black p-1 font-bold text-blue-600">{row[5]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer Modal */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Hỗ trợ kỹ thuật: <b>Thầy Đinh Văn Thành</b> (Zalo: 0915.213717)
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
