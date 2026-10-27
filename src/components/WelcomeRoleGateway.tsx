import React from 'react';
import { 
  GraduationCap, 
  Layers, 
  Crown, 
  ArrowRight,
  Sparkles
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
    <div className="min-h-[70vh] flex flex-col justify-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* TIÊU ĐỀ NGẮN GỌN, CHUYÊN NGHIỆP */}
      <div className="text-center space-y-2.5 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>dekiemtraso.com • Nền Tảng Giáo Dục Số Phi Thương Mại</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Hệ Thống Khảo Thí & Học Tập Trực Tuyến
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          Học tập & Ôn thi hoàn toàn MIỄN PHÍ 100% cho học sinh • Chọn phân hệ để bắt đầu:
        </p>
      </div>

      {/* 2 PHÂN HỆ: GIÁO VIÊN & HỌC SINH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-1">
        
        {/* PHÂN HỆ GIÁO VIÊN */}
        <div 
          onClick={onSelectTeachers}
          className="group relative rounded-2xl p-6 sm:p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer hover:-translate-y-0.5"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-md shadow-blue-600/20 group-hover:scale-105 transition">
                👨‍🏫
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition">
                <span>Truy cập</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                Dành Cho Giáo Viên
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Phần mềm tạo đề kiểm tra chuẩn cấu trúc Bộ GD&ĐT, Add-in Word Ribbon và công cụ AI hỗ trợ giảng dạy.
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
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Vào Phân Hệ Giáo Viên</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PHÂN HỆ HỌC SINH */}
        <div 
          onClick={onSelectStudents}
          className="group relative rounded-2xl p-6 sm:p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-400 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer hover:-translate-y-0.5"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-md shadow-emerald-600/20 group-hover:scale-105 transition">
                🎓
              </div>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700">
                <span>🎁 MIỄN PHÍ 100%</span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                  Dành Cho Học Sinh
                </h2>
                <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-emerald-500 text-white shadow-xs">
                  MIỄN PHÍ
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Hệ thống ôn tập kiến thức, đề cương giữa kỳ và thi thử trực tuyến phi lợi nhuận của Thầy giáo Đinh Văn Thành. Hoàn toàn miễn phí 100% cho học sinh.
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
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <GraduationCap className="w-4 h-4" />
              <span>ĐĂNG NHẬP HỌC MIỄN PHÍ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* LỐI VÀO ADMIN QUẢN TRỊ VIÊN */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 max-w-xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Crown className="w-4 h-4" />
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-white">Dành cho Quản trị viên:</span> Điểm danh & Quản lý đề thi
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenAdmin}
          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Crown className="w-3.5 h-3.5" />
          <span>Admin</span>
        </button>
      </div>

      {/* CHỮ KÝ GỌN GÀNG */}
      <div className="text-center text-xs text-slate-400 dark:text-slate-500 pt-1">
        Tác giả: <strong className="text-slate-600 dark:text-slate-300">Thầy giáo Đinh Văn Thành</strong> • Trường THCS Đồng Yên • Hotline/Zalo: 0915.213717
      </div>

    </div>
  );
};
