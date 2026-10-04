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
  ExternalLink,
  Layers,
  Sparkles,
  CalendarCheck
} from 'lucide-react';
import { activityTrackingService, MachineProfile, RegistrationRequest } from '../services/activityTrackingService';
import { cloudSyncService } from '../services/cloudSyncService';
import { BRAND } from '../config/brand';

export interface RegisterableApp {
  id: string;
  name: string;
  category: string;
  icon?: string;
}

export const REGISTERABLE_APPS: RegisterableApp[] = [
  // 1. Tích hợp NLS AI
  { id: 'tich-hop-nls-ai', name: 'Tích Hợp NLS & AI Vào Giáo Án THCS (TT 02 & QĐ 2422)', category: 'Năng Lực Số & AI' },
  
  // 2. Bộ môn tạo đề
  { id: 'taode-toan', name: 'Tạo Đề & Ma Trận Đề - Môn Toán THCS (CV 7991)', category: 'Bộ Môn Tạo Đề' },
  { id: 'taode-van', name: 'Tạo Đề & Ma Trận Đề - Môn Ngữ Văn THCS (CV 7991)', category: 'Bộ Môn Tạo Đề' },
  { id: 'taode-tienganh', name: 'Tạo Đề & Ma Trận Đề - Môn Tiếng Anh Global Success', category: 'Bộ Môn Tạo Đề' },
  { id: 'taode-khtn', name: 'Tạo Đề & Ma Trận Đề - Môn KHTN THCS (CV 7991)', category: 'Bộ Môn Tạo Đề' },
  { id: 'taode-sudia', name: 'Tạo Đề & Ma Trận Đề - Môn Lịch Sử & Địa Lí THCS', category: 'Bộ Môn Tạo Đề' },
  { id: 'taode-gdcd', name: 'Tạo Đề & Ma Trận Đề - Môn GDCD THCS (CV 7991)', category: 'Bộ Môn Tạo Đề' },
  { id: 'taode-tin', name: 'Tạo Đề & Ma Trận Đề - Môn Tin Học THCS (CV 7991)', category: 'Bộ Môn Tạo Đề' },
  { id: 'taode-congnghe', name: 'Tạo Đề & Ma Trận Đề - Môn Công Nghệ THCS (CV 7991)', category: 'Bộ Môn Tạo Đề' },

  // 3. Tiện ích sư phạm chuyên sâu
  { id: 'smart-listening', name: 'Luyện Nghe & Tạo Audio MP3 Tiếng Anh Global Success', category: 'Tiện Ích Sư Phạm' },
  { id: 'sinh-de-bien-the', name: 'Sinh 3 Đề Biến Thể Tương Đương Từ Đề Gốc', category: 'Tiện Ích Sư Phạm' },
  { id: 'chuan-hoa-nd30', name: 'Chuẩn Hóa Thể Thức Văn Bản Theo Nghị Định 30/2020', category: 'Tiện Ích Sư Phạm' },
  { id: 'tach-gop-pdf', name: 'Tách & Gộp File PDF Giáo Dục Tự Động', category: 'Tiện Ích Sư Phạm' },
  { id: 'cleaner', name: 'Dọn Rác & Tối Ưu Tốc Độ Máy Tính Windows', category: 'Tiện Ích Sư Phạm' },
  { id: 'screen-record', name: 'Quay Màn Hình Bài Giảng & Xuất Video MP4', category: 'Tiện Ích Sư Phạm' },
  { id: 'viet-skkn', name: 'Hỗ Trợ Soạn Sáng Kiến Kinh Nghiệm (SKKN) Giáo Viên', category: 'Tiện Ích Sư Phạm' }
];

interface TrialRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAppId?: string;
  initialAppName?: string;
  initialPackage?: '1YEAR' | '2YEAR' | '3YEAR';
  onSuccess?: (profile: MachineProfile) => void;
}

export const TrialRegisterModal: React.FC<TrialRegisterModalProps> = ({ 
  isOpen, 
  onClose, 
  initialAppId,
  initialAppName,
  initialPackage = '1YEAR',
  onSuccess 
}) => {
  // Map initialAppId sang danh sách
  const resolveInitialApp = () => {
    if (!initialAppId || initialAppId === 'all-apps') {
      return REGISTERABLE_APPS[0];
    }
    const found = REGISTERABLE_APPS.find(a => 
      a.id === initialAppId || 
      (initialAppId.includes('nls') && a.id.includes('nls')) ||
      (initialAppId.includes('clean') && a.id.includes('clean')) ||
      (initialAppId.includes('pdf') && a.id.includes('pdf')) ||
      (initialAppId.includes('chuan-hoa') && a.id.includes('chuan-hoa'))
    );
    return found || { id: initialAppId, name: initialAppName || initialAppId, category: 'Ứng dụng' };
  };

  const defaultApp = resolveInitialApp();
  const [selectedAppId, setSelectedAppId] = useState(defaultApp.id);
  const [selectedAppName, setSelectedAppName] = useState(defaultApp.name);
  const [selectedPackage, setSelectedPackage] = useState<'1YEAR' | '2YEAR' | '3YEAR'>((initialPackage as '1YEAR' | '2YEAR' | '3YEAR') || '1YEAR');

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
      
      const initApp = resolveInitialApp();
      setSelectedAppId(initApp.id);
      setSelectedAppName(initApp.name);
      setSelectedPackage((initialPackage as '1YEAR' | '2YEAR' | '3YEAR') || '1YEAR');
      
      setSubmittedData(null);
      setErrorMessage('');
    }
  }, [isOpen, initialAppId, initialAppName]);

  if (!isOpen) return null;

  const handleAppChange = (newAppId: string) => {
    setSelectedAppId(newAppId);
    const item = REGISTERABLE_APPS.find(a => a.id === newAppId);
    if (item) {
      setSelectedAppName(item.name);
    }
  };

  const handleCopyMid = () => {
    navigator.clipboard.writeText(machineId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getPackageLabel = (pkg: '1YEAR' | '2YEAR' | '3YEAR') => {
    if (pkg === '3YEAR') return 'Gói 3 Năm Pro (36 tháng)';
    if (pkg === '2YEAR') return 'Gói 2 Năm VIP (24 tháng - Ưu đãi)';
    return 'Gói 1 Năm (12 tháng)';
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
        appId: selectedAppId,
        appName: selectedAppName
      });

      const reg = activityTrackingService.submitRegistration({
        machineId,
        fullName: fullName.trim(),
        schoolUnit: schoolUnit.trim() || 'Trường THCS',
        phoneNumber: phoneNumber.trim(),
        appId: selectedAppId,
        appName: selectedAppName,
        packageType: selectedPackage
      });

      await cloudSyncService.submitRegistrationToCloud({
        machineId,
        fullName: fullName.trim(),
        schoolUnit: schoolUnit.trim() || 'Trường THCS',
        phoneNumber: phoneNumber.trim(),
        appId: selectedAppId,
        appName: selectedAppName,
        packageType: selectedPackage
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
    `KÍNH GỬI THẦY ĐINH VĂN THÀNH - ĐĂNG KÝ BẢN QUYỀN PHẦN MỀM THCS\n` +
    `----------------------------------------\n` +
    `• Họ và tên Giáo viên: ${fullName}\n` +
    `• Số điện thoại / Zalo: ${phoneNumber}\n` +
    `• Trường / Đơn vị: ${schoolUnit || 'Giáo viên THCS'}\n` +
    `• Mã máy (ID): ${machineId}\n` +
    `• Ứng dụng đăng ký: ${selectedAppName}\n` +
    `• Gói đăng ký: ${getPackageLabel(selectedPackage)}\n` +
    `----------------------------------------\n` +
    `Kính nhờ Thầy duyệt và kích hoạt bản quyền trực tuyến cho ứng dụng này giúp em. Em xin cảm ơn Thầy!`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
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
              ĐĂNG KÝ BẢN QUYỀN THEO TỪNG ỨNG DỤNG
            </span>
          </div>

          <h3 className="text-lg font-bold text-white">
            Kích Hoạt Bản Quyền Pro
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Thầy/Cô chọn ứng dụng cụ thể có nhu cầu sử dụng và gửi thông tin cho Admin Thầy Đinh Văn Thành để kích hoạt Pro trực tuyến.
          </p>
        </div>

        {/* Content Form / Success */}
        <div className="p-5 overflow-y-auto space-y-4">
          {submittedData ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-sm flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-emerald-300 text-base">Đã gửi đơn đăng ký thành công!</p>
                  <p className="text-xs text-emerald-200/90 leading-relaxed">
                    Thông tin của Thầy/Cô đã được cập nhật lên hệ thống Cloud. Admin Thầy Đinh Văn Thành sẽ duyệt và kích hoạt trực tuyến đúng ứng dụng Thầy/Cô đã chọn.
                  </p>
                  <div className="mt-2.5 p-3 rounded-lg bg-slate-950/80 border border-emerald-500/30 text-xs space-y-1.5">
                    <div><strong>Họ và tên:</strong> <span className="text-white">{submittedData.fullName}</span></div>
                    <div><strong>Số điện thoại / Zalo:</strong> <span className="text-white">{submittedData.phoneNumber}</span></div>
                    <div><strong>Trường/Đơn vị:</strong> <span className="text-white">{submittedData.schoolUnit}</span></div>
                    <div><strong>Ứng dụng:</strong> <span className="text-emerald-300 font-bold">{selectedAppName}</span></div>
                    <div><strong>Gói:</strong> <span className="text-amber-300 font-bold">{getPackageLabel(selectedPackage)}</span></div>
                    <div><strong>Mã máy (ID):</strong> <span className="font-mono text-cyan-300 font-bold">{submittedData.machineId}</span></div>
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
                  (Tin nhắn Zalo đã soạn sẵn nội dung đăng ký ứng dụng này, Thầy/Cô chỉ cần bấm gửi)
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

              {/* 1. Chọn Ứng Dụng Cần Kích Hoạt */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  Chọn Ứng dụng Thầy/Cô cần đăng ký Pro: <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedAppId}
                    onChange={(e) => handleAppChange(e.target.value)}
                    className="w-full bg-slate-950 border border-blue-500/50 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-blue-100 focus:outline-none focus:border-blue-400 transition cursor-pointer font-medium"
                  >
                    {REGISTERABLE_APPS.map((app) => (
                      <option key={app.id} value={app.id} className="bg-slate-900 text-white py-1">
                        [{app.category}] {app.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>Kích hoạt độc lập cho từng ứng dụng chuyên môn của Thầy/Cô.</span>
                </div>
              </div>

              {/* 2. Chọn Gói Thời Hạn Bản Quyền */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <CalendarCheck className="w-3.5 h-3.5 text-amber-400" />
                  Chọn Gói thời hạn kích hoạt: <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPackage('1YEAR')}
                    className={`p-2 rounded-xl text-left border transition cursor-pointer ${
                      selectedPackage === '1YEAR'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs text-white">Gói 1 Năm</div>
                    <div className="text-[10px] text-slate-400">12 tháng</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPackage('2YEAR')}
                    className={`p-2 rounded-xl text-left border transition cursor-pointer relative ${
                      selectedPackage === '2YEAR'
                        ? 'bg-amber-600/25 border-amber-500 text-amber-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="absolute -top-1.5 right-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-[8px] font-black text-slate-950 uppercase">
                      Ưu đãi
                    </span>
                    <div className="font-bold text-xs text-white">Gói 2 Năm</div>
                    <div className="text-[10px] text-slate-400">24 tháng VIP</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPackage('3YEAR')}
                    className={`p-2 rounded-xl text-left border transition cursor-pointer relative ${
                      selectedPackage === '3YEAR'
                        ? 'bg-indigo-600/25 border-indigo-500 text-indigo-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs text-white">Gói 3 Năm</div>
                    <div className="text-[10px] text-slate-400">36 tháng Pro</div>
                  </button>
                </div>
              </div>

              {/* 3. Họ và tên */}
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

              {/* 4. Số điện thoại */}
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

              {/* 5. Trường / Đơn vị */}
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

              {/* 6. ID Máy tính tự động nhận diện */}
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
                  <span>{isSubmitting ? 'ĐANG GỬI...' : 'GỬI ĐĂNG KÝ KÍCH HOẠT CHO ADMIN'}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400 text-center pt-1">
                Admin Thầy Đinh Văn Thành (0915.213717) duyệt và kích hoạt trực tuyến theo đúng ứng dụng đã chọn.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
