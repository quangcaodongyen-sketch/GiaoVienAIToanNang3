import React from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Layers, 
  Crown, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';

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
    <div className="min-h-[75vh] flex flex-col justify-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      
      {/* 1. LỜI CHÀO MỪNG TRANG TRỌNG ĐẲNG CẤP SƯ PHẠM */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-emerald-600/10 dark:from-blue-950/70 dark:via-indigo-950/70 dark:to-emerald-950/70 border border-blue-300/40 dark:border-blue-700/50 text-blue-800 dark:text-blue-300 font-black text-xs uppercase tracking-wider shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
          <span>CỔNG GIÁO DỤC SỐ TOÀN DIỆN • DEKIEMTRASO.COM</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Kính Chào Quý Thầy/Cô &amp; Các Em Học Sinh!
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          Chào mừng bạn đến với Cổng Phần Mềm Tạo Đề &amp; Luyện Thi Trực Tuyến của <strong className="text-blue-600 dark:text-blue-400 font-bold">Thầy giáo Đinh Văn Thành</strong> — Trường THCS Đồng Yên.
        </p>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          Vui lòng bấm chọn đúng phân hệ phù hợp của bạn bên dưới để bắt đầu:
        </p>
      </div>

      {/* 2. HAI LỰA CHỌN LỚN: DÀNH CHO GV & DÀNH CHO HS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 pt-2">
        
        {/* THẺ 1: DÀNH CHO GIÁO VIÊN */}
        <div 
          onClick={onSelectTeachers}
          className="group relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/60 dark:from-slate-900 dark:via-slate-900/90 dark:to-blue-950/40 border-2 border-blue-200 dark:border-blue-800/80 hover:border-blue-500 dark:hover:border-blue-400 shadow-xl hover:shadow-2xl hover:shadow-blue-500/15 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
        >
          {/* Badge phân hệ */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-black text-xs tracking-wider uppercase border border-blue-200 dark:border-blue-800">
              <span>👨‍🏫</span>
              <span>DÀNH CHO THẦY / CÔ</span>
            </span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition">
              <span>Truy cập</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-2xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition duration-300">
                👨‍🏫
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  Kho Ứng Dụng Giáo Viên
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Phần mềm tạo đề kiểm tra &amp; Tiện ích giảng dạy
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Dành cho Thầy Cô THCS &amp; THPT: Kho phần mềm tạo đề thi chuẩn cấu trúc Bộ GD&amp;ĐT, tích hợp Add-in Word Ribbon và công cụ AI hỗ trợ giáo viên chuyên sâu.
            </p>

            {/* Đặc điểm nổi bật */}
            <div className="space-y-2 pt-2 border-t border-blue-100 dark:border-blue-900/60">
              <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Chuẩn Ma trận 16 cột 3 tầng &amp; Đặc tả 7 cột (CV 7991 THCS, QĐ 764 THPT)</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Xuất Word chuẩn Tab Stops 13pt không lệch lề, công thức native chuẩn xác</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Trợ lý AI giáo viên, bộ đề tham khảo &amp; dùng thử miễn phí</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectTeachers();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm sm:text-base shadow-lg shadow-blue-500/25 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4" />
              <span>Vào Kho Dành Cho Giáo Viên</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* THẺ 2: DÀNH CHO HỌC SINH */}
        <div 
          onClick={onSelectStudents}
          className="group relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/60 dark:from-slate-900 dark:via-slate-900/90 dark:to-emerald-950/40 border-2 border-emerald-200 dark:border-emerald-800/80 hover:border-emerald-500 dark:hover:border-emerald-400 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/15 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
        >
          {/* Badge phân hệ */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-black text-xs tracking-wider uppercase border border-emerald-200 dark:border-emerald-800">
              <span>🎓</span>
              <span>DÀNH CHO HỌC SINH</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-1"></span>
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition">
              <span>Vào học ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition duration-300">
                🎓
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                  Cổng Học Tập &amp; Thi Online
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Luyện từ vựng 3D, Ôn đề cương &amp; Thi giữa kỳ
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Dành cho các em Học sinh (đặc biệt 10 lớp chính thức Thầy Đinh Thành dạy tại THCS Đồng Yên): Vào học nhanh chỉ cần 1 chạm, tự động nhớ thiết bị, không cần tạo tài khoản rườm rà.
            </p>

            {/* Đặc điểm nổi bật */}
            <div className="space-y-2 pt-2 border-t border-emerald-100 dark:border-emerald-900/60">
              <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Đủ 10 lớp chính thức (Khối 8: 8A1–8A5 &amp; Khối 6: 6A1–6A5, 390 em theo sổ điểm)</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Học từ vựng siêu trí nhớ 3D (Unit 1 - 3), 4 chế độ tương tác (Chant, Ghép từ...)</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Ôn đề cương &amp; Thi thử Giữa kỳ 1 trực tuyến, tính % nhiệm vụ chất lượng</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectStudents();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-500/25 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Vào Phân Hệ Dành Cho Học Sinh</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* 3. KHỐI ĐĂNG NHẬP ADMIN & THÔNG TIN TÁC GIẢ BẢN QUYỀN */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              Dành riêng cho Quản trị viên (Thầy Đinh Thành)
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Đăng nhập để xem thống kê điểm danh, chấm bài thi trực tuyến và cập nhật đề thi.
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenAdmin}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm transition flex items-center gap-2 shadow-md shadow-amber-950/20 cursor-pointer shrink-0"
        >
          <Crown className="w-4 h-4" />
          <span>👑 Đăng Nhập Admin</span>
        </button>
      </div>

      {/* 4. CHỮ KÝ SƯ PHẠM & LIÊN HỆ */}
      <div className="text-center text-xs text-slate-400 dark:text-slate-500 space-y-1 pt-2">
        <p>
          Tác giả &amp; Bản quyền: <strong className="text-slate-700 dark:text-slate-300 font-bold">Thầy giáo Đinh Văn Thành</strong> • Trường THCS Đồng Yên
        </p>
        <p className="flex items-center justify-center gap-2 flex-wrap">
          <span>Điện thoại / Zalo: <strong className="text-blue-600 dark:text-blue-400">0915.213717</strong></span>
          <span>•</span>
          <span>Website chính thức: <strong className="text-slate-700 dark:text-slate-300">dekiemtraso.com</strong></span>
        </p>
      </div>

    </div>
  );
};
