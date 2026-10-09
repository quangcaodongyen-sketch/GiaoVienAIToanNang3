import React, { useState } from 'react';
import { Lock, ShieldCheck, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { BRAND } from '../config/brand';

interface InternalAdminGuardProps {
  appName: string;
  appDescription?: string;
  onUnlocked: () => void;
  onClose: () => void;
}

export const InternalAdminGuard: React.FC<InternalAdminGuardProps> = ({
  appName,
  appDescription = 'hiện đang trong giai đoạn thử nghiệm chuyên sâu và kiểm thử nội bộ.',
  onUnlocked,
  onClose,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const pin = pinInput.trim();
    if (pin === 'Thaythanh2026@' || pin === 'Thaythanh@' || pin === 'Kichhoat123@') {
      localStorage.setItem('gvai_admin_session', 'authenticated');
      localStorage.setItem('gvai_unlimited_machine', 'true');
      onUnlocked();
    } else {
      setPinError('Mật khẩu Quản trị viên không chính xác. Vui lòng kiểm tra lại!');
    }
  };

  return (
    <div className="p-6 sm:p-10 overflow-y-auto flex-1 flex flex-col items-center justify-center text-center">
      <div className="max-w-lg mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* ICON KHÓA NỘI BỘ */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-rose-500/10 border-2 border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center shadow-xl shadow-rose-500/20">
          <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-rose-400" />
        </div>

        {/* THÔNG BÁO BẢO VỆ NỘI BỘ */}
        <div className="space-y-2">
          <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase tracking-wider">
            ⚠️ CÔNG CỤ NỘI BỘ - CHỈ DÀNH CHO ADMIN THẦY THÀNH
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Khóa Quyền Truy Cập Nội Bộ
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Phần mềm <strong className="text-amber-300">{appName}</strong> {appDescription}
          </p>
          <p className="text-xs text-rose-300 font-semibold leading-relaxed">
            Để đảm bảo chất lượng sư phạm và tác quyền, phần mềm <strong>KHÓA SỬ DỤNG VÀ TẢI VỀ CÔNG KHAI</strong> đối với người dùng đại trà. Chỉ Thầy giáo Đinh Văn Thành (Admin) được mở quyền truy cập.
          </p>
        </div>

        {/* HỘP LIÊN HỆ ADMIN */}
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-left text-xs space-y-2.5">
          <p className="font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            Liên hệ Admin Thầy Thành để kích hoạt bản quyền & báo giá ưu đãi:
          </p>
          <div className="text-slate-300 space-y-1">
            <p>• Tác giả & Quản trị: <strong>Thầy giáo Đinh Văn Thành</strong> – THCS Đồng Yên</p>
            <p>• Hotline / Zalo chính thức: <strong className="text-emerald-400 font-mono text-sm">0915.213717</strong></p>
          </div>
          <div className="pt-1 flex gap-2">
            <a
              href={`https://zalo.me/${BRAND.phoneRaw}?text=${encodeURIComponent(`Kính gửi Thầy Đinh Văn Thành - Em muốn đăng ký mở khóa bản quyền Pro ứng dụng ${appName}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" /> Liên hệ Zalo Thầy Thành
            </a>
          </div>
        </div>

        {/* FORM NHẬP MẬT KHẨU ADMIN */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-rose-500/40 space-y-3 shadow-2xl">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-200">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span>Xác thực Mật khẩu Admin (Thầy Đinh Văn Thành):</span>
          </div>
          <form onSubmit={handleVerify} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="Nhập mật khẩu Admin..."
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError('');
                }}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs transition shadow-lg shadow-rose-600/30 cursor-pointer whitespace-nowrap flex items-center gap-1"
              >
                <span>Mở Quyền Admin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {pinError && (
              <p className="text-rose-400 font-bold text-xs mt-1 text-left">{pinError}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
