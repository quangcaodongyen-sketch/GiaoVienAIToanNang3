import React, { useState } from 'react';
import { 
  Sparkles, 
  Lock, 
  Unlock, 
  MessageCircle, 
  Phone, 
  ShieldCheck, 
  AlertTriangle,
  Clock, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  GraduationCap,
  Layers,
  FileText
} from 'lucide-react';
import { BRAND } from '../config/brand';
import { systemMaintenanceService } from '../services/systemMaintenanceService';

interface MaintenanceScreenProps {
  onAdminLoginSuccess: () => void;
}

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({ onAdminLoginSuccess }) => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const isValid = systemMaintenanceService.verifyAdminPassword(adminPin);
    if (isValid) {
      onAdminLoginSuccess();
    } else {
      setErrorMessage('Mật khẩu Quản trị viên không chính xác. Vui lòng kiểm tra lại ký tự và bộ gõ tiếng Việt!');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-teal-500 selection:text-white">
      {/* BACKGROUND GLOW EFFECTS */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/10 via-teal-500/15 to-violet-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

      {/* TOP HEADER */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-teal-500 via-emerald-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-teal-500/20">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-black tracking-tight text-white uppercase flex items-center gap-1.5">
              <span>GIÁO VIÊN AI TOÀN NĂNG 3</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                PRO 2026
              </span>
            </h1>
            <p className="text-[10px] text-slate-400">
              Tác giả: Thầy giáo Đinh Văn Thành – Trường THCS Đồng Yên
            </p>
          </div>
        </div>

        {/* NÚT MỞ FORM ĐĂNG NHẬP ADMIN */}
        <button
          onClick={() => {
            setShowAdminLogin(!showAdminLogin);
            setErrorMessage('');
          }}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          title="Dành riêng cho Admin Đinh Văn Thành"
        >
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>{showAdminLogin ? 'Đóng Cổng Admin' : 'Cổng Admin'}</span>
        </button>
      </header>

      {/* MAIN CENTER CONTENT */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="max-w-2xl w-full mx-auto text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
          
          {/* BADGE TRẠNG THÁI */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-lg shadow-amber-500/10">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="uppercase tracking-wider">HỆ THỐNG ĐANG TẠM DỪNG ĐỂ NÂNG CẤP</span>
          </div>

          {/* ICON ĐỒNG HỒ / CẢNH BÁO NÂNG CẤP */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-slate-900 to-teal-500/20 border-2 border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-2xl shadow-amber-500/10">
            <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 animate-pulse" />
          </div>

          {/* CÂU THÔNG BÁO BẮT BUỘC CHUẨN YÊU CẦU CỦA THẦY THÀNH */}
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Web đang nâng cấp, vui lòng ghé thăm sau!
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Kính gửi Quý Thầy/Cô và các bạn đồng nghiệp! Website hiện đang được <strong className="text-amber-300">Thầy giáo Đinh Văn Thành</strong> tiến hành bảo trì định kỳ, tối ưu hóa hệ sinh thái và nâng cấp các thuật toán sư phạm mới.
            </p>
          </div>

          {/* KHUNG THÔNG TIN HỖ TRỢ SƯ PHẠM */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-left max-w-xl mx-auto space-y-3 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Nâng Cấp & Hoàn Thiện Các Tính Năng</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Tích hợp Năng lực số & AI 5512</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Tạo Đề THCS 8 Môn chuẩn CV 7991</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Tạo Đề 15P Tiếng Anh SGK mới</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Tạo file Audio nghe MP3 bản ngữ</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-slate-400 text-center sm:text-left">
                Cần kích hoạt bản quyền hoặc hỗ trợ khẩn cấp:
              </div>
              <a
                href={BRAND.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20 transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Zalo Thầy Thành: {BRAND.phone}</span>
              </a>
            </div>
          </div>

          {/* KHU VỰC ĐĂNG NHẬP QUẢN TRỊ VIÊN (BẬT/TẮT THEO YÊU CẦU) */}
          {showAdminLogin && (
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/40 max-w-md mx-auto space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-center gap-2 text-xs font-black text-amber-300 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Xác Thực Mật Khẩu Admin</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Dành riêng cho Thầy giáo Đinh Văn Thành để vào kiểm tra, sửa đổi và mở lại website cho giáo viên.
              </p>

              <form onSubmit={handleAdminSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu quản trị..."
                    value={adminPin}
                    onChange={(e) => {
                      setAdminPin(e.target.value);
                      setErrorMessage('');
                    }}
                    autoFocus
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 p-1"
                    title={showPin ? 'Ẩn' : 'Xem'}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {errorMessage && (
                  <p className="text-xs text-rose-400 font-medium">{errorMessage}</p>
                )}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>Mở Quyền Admin</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAdminLogin(false)}
                    className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-4 py-3 text-center text-xs text-slate-500">
        <p>
          Bản quyền © 2026 <strong>Thầy giáo Đinh Văn Thành</strong> – Trường THCS Đồng Yên. Hotline / Zalo: <strong>{BRAND.phone}</strong>
        </p>
      </footer>
    </div>
  );
};
