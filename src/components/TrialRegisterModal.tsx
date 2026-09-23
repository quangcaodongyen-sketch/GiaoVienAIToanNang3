import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  Copy, 
  Check, 
  Laptop, 
  User, 
  Building2, 
  Phone, 
  Send, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';
import { activityTrackingService, MachineProfile } from '../services/activityTrackingService';

interface TrialRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (profile: MachineProfile) => void;
}

export const TrialRegisterModal: React.FC<TrialRegisterModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [machineId, setMachineId] = useState('');
  const [fullName, setFullName] = useState('');
  const [schoolUnit, setSchoolUnit] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const mid = activityTrackingService.getOrCreateMachineId();
      setMachineId(mid);
      const profile = activityTrackingService.getCurrentProfile();
      if (profile.fullName) setFullName(profile.fullName);
      if (profile.schoolUnit) setSchoolUnit(profile.schoolUnit);
      if (profile.phoneNumber) setPhoneNumber(profile.phoneNumber);
      setSuccessMessage('');
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyMid = () => {
    navigator.clipboard.writeText(machineId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMessage('Vui lòng nhập Họ và tên của Thầy/Cô.');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMessage('Vui lòng nhập Số điện thoại hoặc Zalo để Thầy Thành hỗ trợ.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const result = activityTrackingService.registerTrial({
        fullName,
        schoolUnit: schoolUnit || 'Đơn vị THCS / THPT',
        phoneNumber
      });

      if (result.success) {
        setSuccessMessage(result.message);
        if (onSuccess) {
          onSuccess(result.profile);
        }
        setTimeout(() => {
          onClose();
        }, 1800);
      }
    } catch (err) {
      setErrorMessage('Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              ĐĂNG KÝ TRẢI NGHIỆM MIỄN PHÍ
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              5 LẦN DÙNG THỬ
            </span>
          </div>

          <h3 className="text-xl font-black text-white flex items-center gap-2">
            Bảng Đăng Ký Dùng Thử 5 Lần
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Nhập thông tin nhận ngay 5 lượt trải nghiệm đầy đủ tính năng tạo đề, ma trận, đặc tả và xuất file Word chuẩn Bộ GD&ĐT.
          </p>
        </div>

        {/* Content Form */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {successMessage ? (
            <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-sm flex items-start gap-3 animate-in zoom-in-95">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-300">Đăng ký thành công!</p>
                <p className="text-xs text-emerald-200/80 mt-1">{successMessage}</p>
                <p className="text-[11px] text-slate-400 mt-2">Cửa sổ sẽ tự đóng sau giây lát...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Họ và tên */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  Họ và tên Thầy/Cô: <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A / Trần Thị Mai"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                />
              </div>

              {/* 2. Trường học / Đơn vị */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  Trường / Đơn vị công tác:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Trường THCS Đồng Yên"
                  value={schoolUnit}
                  onChange={(e) => setSchoolUnit(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>

              {/* 3. Số điện thoại */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  Số điện thoại / Zalo: <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: 0915.213717"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>

              {/* 4. ID Máy tự động tạo */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-cyan-400" />
                    ID máy (Hệ thống tự động tạo):
                  </span>
                  <span className="text-[10px] text-cyan-400 font-normal">Cố định cho máy tính này</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={machineId}
                    className="flex-1 bg-slate-950 border border-cyan-500/40 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-cyan-300 tracking-wider select-all cursor-default"
                  />
                  <button
                    type="button"
                    onClick={handleCopyMid}
                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition flex items-center gap-1.5 text-xs font-semibold"
                    title="Sao chép ID máy"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-400" />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Mã máy dùng để hệ thống cấp quyền dùng thử và kích hoạt bản quyền PRO.
                </p>
              </div>

              {/* Nút gửi đi */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98] transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'ĐANG GỬI THÔNG TIN...' : 'BẤM GỬI ĐI & NHẬN 5 LẦN DÙNG THỬ'}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Sau khi bấm gửi đi, thông tin sẽ được chuyển về trung tâm quản trị của Thầy Đinh Văn Thành. Giáo viên được dùng thử ngay 5 lần tất cả các phần mềm môn học!
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
