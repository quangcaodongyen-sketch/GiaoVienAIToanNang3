import { cloudSyncService } from '../services/cloudSyncService';
import React, { useState, useEffect } from 'react';
import { 
  QrCode,
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
  Zap,
  Crown,
  ExternalLink,
  Layers
} from 'lucide-react';
import { activityTrackingService, MachineProfile, RegistrationRequest } from '../services/activityTrackingService';
import { BRAND } from '../config/brand';

interface TrialRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAppId?: string;
  initialAppName?: string;
  initialPackage?: 'TRIAL_5' | '1YEAR' | '2YEAR' | 'FULL_WEB';
  onSuccess?: (profile: MachineProfile) => void;
}

const APP_OPTIONS = [
  { id: 'all-apps', name: 'Tất Cả Hệ Sinh Thái (Toàn Năng)' },
  { id: 'tao-de-8mon', name: '1. Tạo Đề Kiểm Tra 8 Môn THCS (CV 7991)' },
  { id: 'tao-de-anh', name: '2. Tạo Đề Tiếng Anh Global Success THCS' },
  { id: 'chuan-hoa-nd30', name: '3. Chuẩn Hóa Văn Bản NĐ 30 & Soạn 5512 (AI Word)' },
  { id: 'tach-gop-pdf', name: '4. PDF Suite Pro (Tách - Gộp PDF & Lọc Trang)' },
  { id: 'sinh-de-bienthe', name: '5. Sinh 3 Đề Biến Thể Tương Đương' },
  { id: 'smart-listening', name: '6. Smart Listening Pro (Luyện Nghe Tiếng Anh)' },
  { id: 'screen-record', name: '7. Quay Màn Hình Screen Record Pro' },
  { id: 'cleaner', name: '8. PC Cleaner Pro (Dọn Rác Tăng Tốc PC)' },
  { id: 'nls-ai', name: '9. Tích Hợp NLS - AI (Soạn Bài Dạy 5512)' }
];

export const TrialRegisterModal: React.FC<TrialRegisterModalProps> = ({ 
  isOpen, 
  onClose, 
  initialAppId = 'all-apps',
  initialAppName = 'Tất Cả Hệ Sinh Thái (Toàn Năng)',
  initialPackage = 'TRIAL_5',
  onSuccess 
}) => {
  const [machineId, setMachineId] = useState('');
  const [fullName, setFullName] = useState('');
  const [schoolUnit, setSchoolUnit] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedAppId, setSelectedAppId] = useState(initialAppId);
  const [selectedPackage, setSelectedPackage] = useState<'TRIAL_5' | '1YEAR' | '2YEAR' | 'FULL_WEB'>(initialPackage);
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
      setSelectedAppId(initialAppId || 'all-apps');
      setSelectedPackage(initialPackage || 'TRIAL_5');
      setSubmittedData(null);
      setErrorMessage('');
    }
  }, [isOpen, initialAppId, initialPackage]);

  if (!isOpen) return null;

  const handleCopyMid = () => {
    navigator.clipboard.writeText(machineId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const currentAppName = APP_OPTIONS.find(a => a.id === selectedAppId)?.name || initialAppName;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMessage('Vui lòng nhập Họ và tên của Thầy/Cô.');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMessage('Vui lòng nhập Số điện thoại hoặc Zalo để Thầy Thành liên hệ duyệt.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // 1. Cập nhật hồ sơ dùng thử & kích hoạt 5 lần
      const trialRes = activityTrackingService.registerTrial({
        fullName: fullName.trim(),
        schoolUnit: schoolUnit.trim() || 'Trường THCS Đồng Yên',
        phoneNumber: phoneNumber.trim(),
        appId: selectedAppId,
        appName: currentAppName
      });

      // 2. Gửi đơn đăng ký gói đã chọn
      const reg = activityTrackingService.submitRegistration({
        machineId,
        fullName: fullName.trim(),
        schoolUnit: schoolUnit.trim() || 'Trường THCS Đồng Yên',
        phoneNumber: phoneNumber.trim(),
        appId: selectedAppId,
        appName: currentAppName,
        packageType: selectedPackage
      });

      // 3. GỬI TRỰC TIẾP LÊN CLOUD CHO ADMIN THẦY THÀNH & CÔ MAI TÌNH DUYỆT
      await cloudSyncService.submitRegistrationToCloud({
        machineId,
        fullName: fullName.trim(),
        schoolUnit: schoolUnit.trim() || 'Trường THCS Đồng Yên',
        phoneNumber: phoneNumber.trim(),
        appId: selectedAppId,
        appName: currentAppName,
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

  const pkgLabel = selectedPackage === 'TRIAL_5' 
    ? 'Dùng thử 5 lần miễn phí' 
    : selectedPackage === '1YEAR' 
      ? 'Gói 1 Năm (200.000đ)' 
      : 'Gói 2 Năm Siêu Tiết Kiệm (250.000đ)';

  const zaloMessage = encodeURIComponent(
    `Kính gửi Thầy Đinh Văn Thành,\nTôi là: ${fullName} - Đơn vị: ${schoolUnit || 'Giáo viên THCS'}\nSố điện thoại/Zalo: ${phoneNumber}\nTôi xin đăng ký: ${pkgLabel}\nCho phần mềm: ${currentAppName}\nMã máy (ID) của tôi: ${machineId}\nNhờ Thầy duyệt và nâng cấp thành viên giúp tôi ạ!`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-amber-950/50 via-slate-900 to-indigo-950/50 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              FORM ĐĂNG KÝ THÀNH VIÊN & DÙNG THỬ
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              DUYỆT 24/7
            </span>
          </div>

          <h3 className="text-xl font-black text-white flex items-center gap-2">
            Đăng Ký Thành Viên Giáo Viên AI
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Điền thông tin để nhận ngay 5 lượt dùng thử hoặc gửi đơn để Admin Thầy Thành duyệt nâng cấp VIP gói 1 Năm (200k) / 2 Năm (250k).
          </p>
        </div>

        {/* Content Form */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {submittedData ? (
            <div className="space-y-4 animate-in zoom-in-95">
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-sm flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-300 text-base">Gửi đơn đăng ký thành công!</p>
                  <p className="text-xs text-emerald-200/90 mt-1">
                    Thông tin của Thầy/Cô đã được đồng bộ lên Cloud để Thầy Đinh Văn Thành (Thaythanh2026@) hoặc Cô Mai Tình (Maitinh2026@) duyệt ngay. Máy tính của Thầy/Cô đã được kích hoạt ngay <strong>5 lượt dùng thử miễn phí tức thì mà không cần chờ Admin phê duyệt</strong>. Thầy/Cô có thể đóng cửa sổ này và trải nghiệm ngay!
                  </p>
                  <div className="mt-2.5 p-2.5 rounded-lg bg-slate-950/70 border border-emerald-500/30 text-xs space-y-1">
                    <div><strong>Họ và tên:</strong> {submittedData.fullName}</div>
                    <div><strong>Trường/Đơn vị:</strong> {submittedData.schoolUnit}</div>
                    <div><strong>Số điện thoại:</strong> {submittedData.phoneNumber}</div>
                    <div><strong>ID máy:</strong> <span className="font-mono text-cyan-300 font-bold">{submittedData.machineId}</span></div>
                    <div><strong>Gói đăng ký:</strong> <span className="text-amber-300 font-bold">{pkgLabel}</span></div>
                  </div>
                </div>
              </div>

              {/* Nút gửi nhanh qua Zalo Thầy Thành */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <p className="text-xs text-slate-300 font-bold flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Để được duyệt và kích hoạt ngay tức khắc:
                </p>
                <a
                  href={`https://zalo.me/${BRAND.phoneRaw}?text=${zaloMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-[#0068FF] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  BẤM VÀO ĐÂY ĐỂ NHẮN ZALO THẦY THÀNH (0915.213717)
                </a>
                <p className="text-[11px] text-slate-400 text-center">
                  (Tin nhắn Zalo đã được soạn sẵn đầy đủ thông tin máy và gói đăng ký)
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
              >
                Đóng Cửa Sổ & Tiếp Tục Trải Nghiệm
              </button>
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
                  placeholder="Ví dụ: Nguyễn Văn An / Trần Thị Mai"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                />
              </div>

              {/* 2. Trường học / Đơn vị */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  Trường / Đơn vị công tác: <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
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

              {/* 4. Chọn Phần mềm muốn đăng ký */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  Phần mềm / Ứng dụng đăng ký:
                </label>
                <select
                  value={selectedAppId}
                  onChange={(e) => setSelectedAppId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 transition cursor-pointer"
                >
                  {APP_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id} className="bg-slate-900 text-white">
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 5. Chọn Gói Thành Viên (Bảng giá mới: 1 năm 200k, 2 năm 250k) */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    Chọn Gói Đăng Ký Bản Quyền:
                  </span>
                  <span className="text-[11px] text-amber-400 font-bold">1 Năm 200k - 2 Năm 250k</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {/* Gói Dùng Thử */}
                  <label
                    onClick={() => setSelectedPackage('TRIAL_5')}
                    className={`p-2.5 rounded-xl border flex flex-col justify-between cursor-pointer transition ${
                      selectedPackage === 'TRIAL_5'
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[11px] font-bold">DÙNG THỬ 5 LẦN</div>
                    <div className="text-base font-black text-emerald-400 mt-1">Miễn Phí</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">5 lượt thử đầy đủ tính năng</div>
                  </label>

                  {/* Gói 1 Năm: 200k */}
                  <label
                    onClick={() => setSelectedPackage('1YEAR')}
                    className={`p-2.5 rounded-xl border flex flex-col justify-between cursor-pointer transition ${
                      selectedPackage === '1YEAR'
                        ? 'bg-sky-950/40 border-sky-500 text-sky-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-[11px] font-bold">GÓI 1 NĂM HỌC</div>
                    <div className="text-base font-black text-sky-400 mt-1">200.000đ</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Sử dụng 12 tháng trọn vẹn</div>
                  </label>

                  {/* Gói 2 Năm: 250k (Ưu đãi) */}
                  <label
                    onClick={() => setSelectedPackage('2YEAR')}
                    className={`p-2.5 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition relative ${
                      selectedPackage === '2YEAR'
                        ? 'bg-amber-950/50 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-950 border-amber-500/50 text-slate-300 hover:border-amber-400'
                    }`}
                  >
                    <span className="absolute -top-2 right-2 px-1.5 py-0.2 text-[8px] font-black rounded bg-amber-400 text-slate-950">
                      KM HẾT 30/11/2026
                    </span>
                    <div className="text-[11px] font-bold text-amber-300">GÓI 2 NĂM VIP</div>
                    <div className="text-base font-black text-amber-300 mt-1">250.000đ</div>
                    <div className="text-[10px] text-emerald-400 font-bold mt-0.5">24 tháng (Sau 30/11: 300k)</div>
                  </label>
                  {/* Gói Full Web: 500k */}
                  <label
                    onClick={() => setSelectedPackage('FULL_WEB')}
                    className={`p-2.5 rounded-xl border-2 flex flex-col justify-between cursor-pointer transition relative ${
                      selectedPackage === 'FULL_WEB'
                        ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-950 border-emerald-500/40 text-slate-300 hover:border-emerald-400'
                    }`}
                  >
                    <span className="absolute -top-2 right-2 px-1.5 py-0.2 text-[8px] font-black rounded bg-emerald-400 text-slate-950">
                      👑 FULL WEB
                    </span>
                    <div className="text-[11px] font-bold text-emerald-300">TRỌN BỘ HỆ SINH THÁI</div>
                    <div className="text-base font-black text-emerald-400 mt-1">500.000đ</div>
                    <div className="text-[10px] text-emerald-300/90 font-medium mt-0.5">Mở khóa tất cả các app</div>
                  </label>

                </div>
              </div>

              
              {/* KHỐI QR CHUYỂN KHOẢN KHI CHỌN GÓI 1 NĂM HOẶC 2 NĂM */}
              {selectedPackage !== 'TRIAL_5' && (
                <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/60 shadow-xl space-y-3.5 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-amber-300 uppercase tracking-wide">
                          QUÉT MÃ QR THANH TOÁN (MB BANK)
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          Số tiền: <strong className="text-amber-400 text-xs">{selectedPackage === 'FULL_WEB' ? '500.000đ' : selectedPackage === '1YEAR' ? '200.000đ' : '250.000đ'}</strong> ({selectedPackage === 'FULL_WEB' ? 'Gói Full Web (Tất cả phần mềm)' : selectedPackage === '1YEAR' ? 'Gói 1 Năm' : 'Gói 2 Năm Ưu Đãi (KM hết T11/2026)'})
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      KÍCH HOẠT NHANH
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <div className="shrink-0 relative">
                      <img
                        src="/qr_payment.png"
                        alt="Mã QR MB Bank Thầy Thành"
                        className="w-36 h-auto rounded-xl border border-slate-700 shadow-md bg-white p-1 object-contain"
                      />
                    </div>

                    <div className="flex-1 text-xs space-y-2 text-slate-300 w-full">
                      <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1.5">
                        <div><strong>Ngân hàng:</strong> <span className="text-cyan-300 font-bold">MB Bank (Quân đội)</span></div>
                        <div className="flex items-center justify-between">
                          <span><strong>Số tài khoản:</strong> <span className="text-amber-300 font-mono font-bold text-sm">0915213717</span></span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('0915213717');
                              alert('Đã sao chép Số tài khoản MB Bank: 0915213717');
                            }}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-200 border border-slate-700 cursor-pointer font-bold"
                          >
                            Sao chép STK
                          </button>
                        </div>
                        <div><strong>Chủ tài khoản:</strong> <span className="text-white font-bold">DINH VAN THANH</span></div>
                      </div>

                      {/* CẢNH BÁO BẮT BUỘC THEO YÊU CẦU CỦA THẦY THÀNH */}
                      <div className="p-2.5 rounded-xl bg-red-950/90 border-2 border-red-500 text-center shadow-lg shadow-red-950/50">
                        <p className="text-xs font-black text-red-200 uppercase tracking-wide">
                          ⚠️ KHÔNG GHI NỘI DUNG CHUYỂN KHOẢN
                        </p>
                        <p className="text-[10px] text-red-300/90 mt-0.5 font-medium">
                          (Thầy/Cô vui lòng XÓA TRỐNG / ĐỂ TRỐNG phần lời nhắn khi chuyển khoản)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. ID Máy tự động tạo */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-cyan-400" />
                    ID máy (Hệ thống tự động nhận diện):
                  </span>
                  <span className="text-[10px] text-cyan-400 font-normal">Cố định theo máy tính</span>
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
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                    title="Sao chép ID máy"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Mã máy dùng để hệ thống cấp quyền dùng thử và Admin duyệt nâng cấp thành viên.
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
                  {isSubmitting ? 'ĐANG GỬI THÔNG TIN...' : 'BẤM GỬI LÊN CLOUD ĐỂ ADMIN DUYỆT & NHẬN 5 LẦN THỬ'}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Sau khi bấm gửi đi, thông tin sẽ được chuyển về trung tâm quản trị của Thầy Đinh Văn Thành. Giáo viên được dùng thử ngay 5 lần và Admin sẽ kích hoạt bản quyền nhanh chóng!
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
