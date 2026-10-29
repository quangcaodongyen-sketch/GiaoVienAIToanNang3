import React from 'react';
import { 
  GraduationCap, 
  Layers, 
  Crown, 
  ArrowRight,
  Sparkles,
  ShieldCheck,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { BRAND } from '../config/brand';

interface WelcomeRoleGatewayProps {
  onSelectTeachers: () => void;
  onSelectStudents: () => void;
  onOpenAdmin: () => void;
}

export const WelcomeRoleGateway: React.FC<WelcomeRoleGatewayProps> = ({
  onSelectTeachers,
  onSelectStudents,
  onOpenAdmin
}) => {
  return (
    <div className="min-h-[75vh] flex flex-col justify-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* 1. THÔNG BÁO CHUNG 3D TRONG SUỐT: LIÊN TỤC UPDATE 2026 & GHI NHẬN Ý KIẾN THẦY CÔ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0C2340]/90 via-[#123660]/85 to-[#0A1A2E]/90 text-white p-4 sm:p-5 border border-cyan-400/40 shadow-[0_12px_32px_rgba(12,35,64,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-xl">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-400/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 shadow-[0_3px_10px_rgba(245,158,11,0.45),inset_0_1px_0_rgba(255,255,255,0.7)] animate-pulse">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>LIÊN TỤC UPDATE 2026</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-400/20 text-cyan-200 border border-cyan-400/40 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
                <span>Chuẩn BGD&ĐT • Phi Thương Mại</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              Ghi nhận và trân trọng mọi ý kiến, yêu cầu nâng cấp, bổ sung tính năng &amp; sửa app từ Quý Thầy/Cô trên toàn quốc để hoàn thiện phần mềm ngày càng hoàn hảo, chuẩn mực hơn.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <a
              href={BRAND.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs shadow-[0_4px_14px_rgba(16,185,129,0.4),inset_0_1px_0_rgba(255,255,255,0.4)] border border-emerald-400/50 flex items-center gap-1.5 transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              title="Gửi tin nhắn Zalo góp ý trực tiếp tới Thầy Đinh Thành"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>Góp Ý &amp; Nhận Trợ Giúp</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. TIÊU ĐỀ CHÍNH GỘP TINH GỌN, TRANG NHÃ */}
      <div className="text-center space-y-2 max-w-2xl mx-auto pt-1">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Hệ Thống Khảo Thí &amp; Tiện Ích Giáo Dục Số
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
          Tác giả: <strong className="text-blue-600 dark:text-blue-400 font-bold">{BRAND.author}</strong> • Hoàn toàn <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold uppercase">Miễn phí 100%</strong> cho học sinh
        </p>
      </div>

      {/* 3. 2 PHÂN HỆ: GIÁO VIÊN & HỌC SINH - TAB 3D TRONG SUỐT GLASSMORPHISM ĐỈNH CAO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-1">
        
        {/* PHÂN HỆ GIÁO VIÊN (TAB 3D TRONG SUỐT) */}
        <div 
          onClick={onSelectTeachers}
          className="group relative rounded-3xl p-6 sm:p-7 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-white/10 hover:border-blue-400 dark:hover:border-blue-400 shadow-[0_12px_40px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] hover:shadow-[0_20px_50px_rgba(37,99,235,0.18)] transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-center text-2xl shadow-lg shadow-blue-600/30 group-hover:scale-105 group-hover:rotate-2 transition-all duration-300 border border-white/20">
                👨‍🏫
              </div>
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Vào Phân Hệ</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Dành Cho Giáo Viên
                </h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  v3.0 PRO
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Kho phần mềm tạo đề kiểm tra chuẩn cấu trúc Bộ GD&amp;ĐT (CV 7991 THCS, QĐ 764 THPT), Add-in Word Ribbon và công cụ AI hỗ trợ giáo viên.
              </p>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectTeachers();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white font-black text-sm shadow-[0_6px_20px_rgba(37,99,235,0.4),inset_0_1px_0_rgba(255,255,255,0.4)] border border-blue-400/50 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Layers className="w-4 h-4" />
              <span>Vào Kho Tiện Ích Giáo Viên</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PHÂN HỆ HỌC SINH (TAB 3D TRONG SUỐT) */}
        <div 
          onClick={onSelectStudents}
          className="group relative rounded-3xl p-6 sm:p-7 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/60 dark:border-white/10 hover:border-emerald-400 dark:hover:border-emerald-400 shadow-[0_12px_40px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.18)] transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-center text-2xl shadow-lg shadow-emerald-600/30 group-hover:scale-105 group-hover:rotate-2 transition-all duration-300 border border-white/20">
                🎓
              </div>
              <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 shadow-xs">
                <span>🎁 MIỄN PHÍ 100%</span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Dành Cho Học Sinh
                </h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                  ONLINE 24/7
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Học từ vựng siêu trí nhớ, làm đề kiểm tra 5 phút, cọ xát đề kiểm tra giữa kỳ minh họa và theo dõi bảng xếp hạng thi đua được bảo toàn điểm 100%.
              </p>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectStudents();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm shadow-[0_6px_20px_rgba(16,185,129,0.4),inset_0_1px_0_rgba(255,255,255,0.4)] border border-emerald-400/50 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <GraduationCap className="w-4 h-4" />
              <span>ĐĂNG NHẬP HỌC MIỄN PHÍ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* 4. LỐI VÀO ADMIN QUẢN TRỊ VIÊN 3D TRONG SUỐT */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 flex items-center justify-between gap-3 max-w-xl mx-auto w-full shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center shrink-0">
            <Crown className="w-4 h-4 text-amber-300" />
          </div>
          <div className="text-xs text-slate-200">
            <span className="font-bold text-amber-300">Dành cho Quản trị viên:</span> Quản lý bảng điểm &amp; xuất đề kiểm tra
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenAdmin}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-md active:scale-95"
        >
          <Crown className="w-3.5 h-3.5" />
          <span>Admin</span>
        </button>
      </div>

      {/* 5. GỘP NỘI DUNG CHỮ CUỐI CHÂN TRANG TINH GỌN */}
      <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1 font-medium">
        dekiemtraso.com • Tác giả: <strong className="text-slate-700 dark:text-slate-200">{BRAND.author}</strong> • Hotline/Zalo: <strong className="text-amber-500 font-bold">{BRAND.phone}</strong>
      </div>

    </div>
  );
};
