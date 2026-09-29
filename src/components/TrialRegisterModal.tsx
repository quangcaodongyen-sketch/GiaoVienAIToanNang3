import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Copy, 
  Check, 
  Laptop, 
  User, 
  Building2, 
  Phone, 
  Send, 
  Crown,
  ExternalLink
} from 'lucide-react';
import { activityTrackingService, MachineProfile, RegistrationRequest } from '../services/activityTrackingService';
import { cloudSyncService } from '../services/cloudSyncService';
import { BRAND } from '../config/brand';

interface TrialRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAppId?: string;
  initialAppName?: string;
  initialPackage?: any;
  onSuccess?: (profile: MachineProfile) => void;
}

export const TrialRegisterModal: React.FC<TrialRegisterModalProps> = ({ 
  isOpen, 
  onClose, 
  initialAppId = 'all-apps',
  initialAppName = 'Hệ sinh thái Giáo viên THCS',
  onSuccess 
}) => {
  const [machineId, setMachineId] = useState('');
  const [fullName, setFullName] = useState('');
  const [schoolUnit, setSchoolUnit] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<RegistrationRequest | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const mid = activityTrackingService.getOrCreateMachineId();
      setMachineId(mid);
      const profile = activityTrackingService.getCurrentProfile();
      if (profile.fullName) setFullName(profile.fullName);
      if (profile.schoolUnit) setSchoolUnit(profile.schoolUnit);
      if (profile.phoneNumber) setPhoneNumber(profile.phoneNumber);
      setSubmittedData(null);
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyMid = () => {
    navigator.clipboard.writeText(machineId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMessage('Vui lòng nhập Họ và tên của Thầy/Cô.');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMessage('Vui lòng nhập Số điện thoại hoặc Zalo để Admin kích hoạt.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const trialRes = activityTrackingService.registerTrial({
        fullName: fullName.trim(),
        schoolUnit: schoolUnit.trim() || 'Trường THCS',
        phoneNumber: phoneNumber.trim(),
        appId: initialAppId,
        appName: initialAppName
      });

      const reg = activityTrackingService.submitRegistration({
        machineId,
        fullName: fullName.trim(),
        schoolUnit: schoolUnit.trim() || 'Trường THCS',
        phoneNumber: phoneNumber.trim(),
        appId: initialAppId,
        appName: initialAppName,
        packageType: '1YEAR'
      });

      await cloudSyncService.submitRegistrationToCloud({
        machineId,
        fullName: fullName.trim(),
        schoolUnit: schoolUnit.trim() || 'Trường THCS',
        phoneNumber: phoneNumber.trim(),
        appId: initialAppId,
        appName: initialAppName,
        packageType: '1YEAR'
      });

      setSubmittedData(reg);
      if (onSuccess) {
        onSuccess(trialRes.profile);
      }
    } catch (err) {
      setErrorMessage('Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const zaloMessage = encodeURIComponent(
    `KÍNH GỬI THẦY ĐINH VĂN THÀNH - ĐĂNG KÝ BẢN QUYỀN NĂM PHẦN MỀM THCS\n` +
    `----------------------------------------\n` +
    `• Họ và tên: ${fullName}\n` +
    `• Số điện thoại / Zalo: ${phoneNumber}\n` +
    `• Trường / Đơn vị: ${schoolUnit || 'Giáo viên THCS'}\n` +
    `• Mã máy (ID): ${machineId}\n` +
    `• Ứng dụng: ${initialAppName}\n` +
    `----------------------------------------\n` +
    `Kính nhờ Thầy kích hoạt bản quyền trực tuyến theo năm giúp em. Em xin cảm ơn!`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="relative p-5 bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              ĐĂNG KÝ BẢN QUYỀN THEO NĂM
            </span>
          </div>

          <h3 className="text-lg font-bold text-white">
            Đăng Ký Bản Quyền Phần Mềm
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Admin Thầy Đinh Văn Thành nhận thông tin và kích hoạt trực tuyến theo năm.
          </p>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {submittedData ? (
            <div className="space-y-4 animate-in zoom-in-95">
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-sm flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-300 text-base">Đã gửi đăng ký thành công!</p>
                  <p className="text-xs text-emerald-200/90 mt-1">
                    Thông tin của Thầy/Cô đã được cập nhật lên hệ thống để Admin Thầy Đinh Văn Thành kích hoạt trực tuyến theo năm.
                  </p>
                  <div className="mt-2.5 p-2.5 rounded-lg bg-slate-950/70 border border-emerald-500/30 text-xs space-y-1">
                    <div><strong>Họ và tên:</strong> {submittedData.fullName}</div>
                    <div><strong>Số điện thoại:</strong> {submittedData.phoneNumber}</div>
                    <div><strong>Trường/Đơn vị:</strong> {submittedData.schoolUnit}</div>
                    <div><strong>ID máy:</strong> <span className="font-mono text-cyan-300 font-bold">{submittedData.machineId}</span></div>
                  </div>
                </div>
              </div>

              {/* Nút gửi nhanh qua Zalo */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <a
                  href={`https://zalo.me/${BRAND.phoneRaw}?text=${zaloMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-[#0068FF] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  BẤM VÀO ĐÂY ĐỂ NHẮN ZALO CHO ADMIN (0915.213717)
                </a>
                <p className="text-[11px] text-slate-400 text-center">
                  (Tin nhắn Zalo đã soạn sẵn nội dung đăng ký, Thầy/Cô chỉ cần bấm gửi)
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
              >
                Đóng Cửa Sổ
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-red-200 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* 1. Họ và tên */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  Họ và tên Giáo viên: <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Thị Mai"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              {/* 2. Số điện thoại */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  Số điện thoại / Zalo: <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: 0988.123456"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              {/* 3. Trường / Đơn vị */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  Trường / Đơn vị công tác: <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Trường THCS Đồng Yên"
                  value={schoolUnit}
                  onChange={(e) => setSchoolUnit(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* 4. ID Máy tính tự động nhận diện */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-cyan-400" />
                    Mã máy tính (Tự động nhận diện):
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={machineId}
                    className="flex-1 bg-slate-950 border border-cyan-500/40 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-cyan-300 tracking-wider select-all cursor-default"
                  />
                  <button
                    type="button"
                    onClick={handleCopyMid}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1 shrink-0 border border-slate-700 transition cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Đã copy' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Nút gửi */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'ĐANG GỬI...' : 'GỬI CHO ADMIN ĐỂ KÍCH HOẠT THEO NĂM'}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400 text-center pt-1">
                Admin Thầy Đinh Văn Thành (0915.213717) duyệt thông tin và kích hoạt trực tuyến theo năm.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
