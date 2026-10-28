import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Sparkles, 
  MessageCircle, 
  ExternalLink, 
  Filter, 
  CheckCircle2, 
  FileText, 
  Layers, 
  Share2, 
  Laptop,
  Check,
  ShieldCheck
} from 'lucide-react';
import { apps, AppCard } from '../data/apps';
import { BRAND } from '../config/brand';

interface TeacherCatalogProps {
  onOpenAppModal: (app: AppCard) => void;
  onCopyShareLink: (url: string, title: string, e: React.MouseEvent) => void;
}

// CDN lưu trữ bộ cài đặt tốc độ cao GitHub Releases (tag v3.0-nls)
// Kho Google Drive chính thức tốc độ cao, không bao giờ bị chặn virus
const CDN_BASE = 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing';

// Bảng ánh xạ link tải file .exe hoặc .zip cho từng phần mềm (100% link thật CDN)
const APP_DOWNLOAD_LINKS: Record<string, { exe?: string; zip?: string }> = {
  'tichhop-nls-ai-thcs': {
    exe: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing',
    zip: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing'
  },
  'tao-de-tieng-anh-tieu-hoc': {
    zip: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing'
  },
  'tao-de-tieng-viet-tieu-hoc': {
    exe: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing',
    zip: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing'
  },
  'tao-de-tieng-anh-thcs': {
    exe: 'https://drive.google.com/file/d/1hb-9vs-ny-xGcJUGaX5_86k-pN0op0qY/view?usp=sharing',
    zip: 'https://drive.google.com/file/d/1fOFfPS7DgcNgJrTj_kvdEwK8-lScgL1d/view?usp=sharing'
  },
  'tao-de-15p-tienganh': {
    exe: 'https://drive.google.com/file/d/1UvoS3l1rw8_omyensQ9qtuBeyyUJ9bdE/view?usp=sharing',
    zip: 'https://drive.google.com/file/d/1Gp-DRLSBVZgzJJI7spQ7VkE_wRrNSFJw/view?usp=sharing'
  },
  'tao-de-toan-thcs': {
    exe: 'https://drive.google.com/file/d/101JAzB5CpgE16dN25JC_uI88g7Wym6WD/view?usp=sharing',
    zip: 'https://drive.google.com/file/d/1jI0pqYZLGiVAvEjrSuUTCx2IgmtqNaSl/view?usp=sharing'
  },
  'tao-de-van-thcs': {
    exe: 'https://drive.google.com/file/d/1DFqNm7ecPqDUJqvNlmxvjiPri5VnwlI9/view?usp=sharing',
    zip: 'https://drive.google.com/file/d/13ZG7pVSjgkaXKPwRr5_nKIkdxDUL03O7/view?usp=sharing'
  },
  'tao-de-khtn-thcs': {
    exe: 'https://drive.google.com/file/d/1BM_1b5e6U8k778SIq0OjuJI_NnLlBXbH/view?usp=sharing',
    zip: 'https://drive.google.com/file/d/1dZwFXL1ruCJhHF9RLQ_9JviWuG1ovaHX/view?usp=sharing'
  },
  'tao-de-sudia-thcs': {
    exe: 'https://drive.google.com/file/d/1P1fZxrJ2C6Rf1mpqUpKe8Vr703tf-Vb6/view?usp=sharing',
    zip: 'https://drive.google.com/file/d/1ouEeznfCOyJXiX3AukFcAoIBidCTLa9B/view?usp=sharing'
  },
  'tao-de-lich-su-thcs': {
    exe: 'https://drive.google.com/file/d/1RKZ3KQrO5wM0cBL2iGnOQ4M6e1lYseod/view?usp=sharing',
    zip: 'https://drive.google.com/file/d/1R22KTK7x1JIbGi_X9KNwBgErL3qitthk/view?usp=sharing'
  },
  'tao-de-dia-li-thcs': {
    exe: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing',
    zip: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing'
  },
  'tao-de-tin-thcs': {
    exe: 'https://drive.google.com/file/d/1JLQCqAuTnesXkq3haEoFtQ1OZKMnAv86/view?usp=sharing',
    zip: 'https://drive.google.com/file/d/1UoyLxirC4th9u7dGvyZarlWBTRs6ISny/view?usp=sharing'
  },
  'tao-de-gddp-thcs': {
    exe: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing',
    zip: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing'
  },
  'tao-de-hdtn-thcs': {
    exe: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing',
    zip: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing'
  },
    'tao-de-cn-thcs': {
    exe: 'https://drive.google.com/file/d/1ijY-nFdcajr5vSCXG-MS27sYhIhe6urw/view?usp=sharing',
    zip: 'https://drive.google.com/file/d/1vr2V6f6yPaUWh_v9pCxoXT-i7_QsxIjL/view?usp=sharing'
  },
  'tao-de-gdcd-thcs': {
    exe: 'https://drive.google.com/file/d/13B9CNEi9-rj1YgbUyAM6IUDyzDqAvsgp/view?usp=sharing',
    zip: 'https://drive.google.com/file/d/1NDZJDC75Cv0SsKccnPCJi20QukGH8McO/view?usp=sharing'
  },
  'tao-de-tieng-anh-thpt': {
    exe: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing',
    zip: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing'
  },
  'tao-de-toan-thpt': {
    exe: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing',
    zip: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing'
  },
  'tao-de-van-thpt': {
    exe: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing',
    zip: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing'
  },
  'tao-de-vatli-thpt': {
    exe: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing',
    zip: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing'
  },
  'tao-de-hoahoc-thpt': {
    exe: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing',
    zip: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing'
  },
  'tao-de-sinhhoc-thpt': {
    exe: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing',
    zip: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing'
  },
  'tao-de-lichsu-thpt': {
    exe: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing',
    zip: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing'
  },
  'tao-de-diali-thpt': {
    exe: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing',
    zip: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing'
  },
  'tao-de-tin-thpt': {
    exe: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing',
    zip: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing'
  },
  'tao-de-cn-thpt': {
    exe: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing',
    zip: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing'
  },
  'tao-de-gdktpl-thpt': {
    exe: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing',
    zip: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing'
  },
  'smart-listening-pro': {
    exe: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing',
    zip: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing'
  },
  'mathstudio-pro': {
    exe: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing',
    zip: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing'
  },
  'chuanhoavanbanvip': {
    exe: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing',
    zip: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing'
  },
  'dinhthanh-cleaner-pro': {
    exe: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing',
    zip: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing'
  },
  'TACH-GOP-PDF': {
    zip: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing'
  },
  'screen-record-v2': {
    exe: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing'
  },
  'sinhdebienthe': {
    zip: 'https://drive.google.com/drive/folders/1zdjJpfoahpD35lbmIpfXfzxz7LDC7wjD?usp=sharing'
  }
};

export const TeacherCatalog: React.FC<TeacherCatalogProps> = ({ 
  onOpenAppModal, 
  onCopyShareLink 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Lọc danh sách app
  const filteredApps = apps.filter(app => {
    if (!app.active) return false;
    const matchCategory = 
      categoryFilter === 'ALL' ||
      (categoryFilter === 'TIỂU HỌC' && (app.levelBadge === 'TIỂU HỌC' || app.category.includes('TIỂU HỌC'))) ||
      (categoryFilter === 'THCS' && (app.levelBadge === 'THCS' || app.category.includes('THCS'))) ||
      (categoryFilter === 'THPT' && (app.levelBadge === 'THPT' || app.category.includes('THPT'))) ||
      (categoryFilter === 'CV 5512' && (app.levelBadge === 'CV 5512' || app.category.includes('5512'))) ||
      (categoryFilter === 'TIỆN ÍCH' && (app.levelBadge === 'TIỆN ÍCH' || app.category.includes('TIỆN ÍCH')));

    const matchSearch = searchQuery.trim() === '' ||
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* THANH LỌC TAB 3D TRONG SUỐT & TÌM KIẾM NHANH */}
      <div className="backdrop-blur-md bg-white/75 dark:bg-slate-900/75 p-3.5 sm:p-4 rounded-3xl border border-white/60 dark:border-slate-800/80 shadow-[0_8px_30px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 mr-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Phân loại:</span>
          </span>
          {[
            { id: 'ALL', icon: '✨', label: 'Tất Cả', sub: `${apps.length} App` },
            { id: 'THCS', icon: '📐', label: 'THCS', sub: 'CV 7991' },
            { id: 'THPT', icon: '🏛️', label: 'THPT', sub: 'QĐ 764' },
            { id: 'TIỂU HỌC', icon: '🎒', label: 'Tiểu Học', sub: 'TT 27' },
            { id: 'CV 5512', icon: '📋', label: 'Giáo Án', sub: '5512 & NLS' },
            { id: 'TIỆN ÍCH', icon: '⚡', label: 'Tiện Ích', sub: 'Trợ Lý AI' }
          ].map(tab => {
            const isAct = categoryFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id)}
                className={`relative px-3.5 py-2 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                  isAct
                    ? 'bg-gradient-to-b from-blue-600 via-indigo-600 to-blue-700 text-white font-black shadow-[0_6px_18px_rgba(37,99,235,0.4),inset_0_1px_0_rgba(255,255,255,0.4)] border border-blue-400/50 -translate-y-0.5'
                    : 'bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 hover:text-blue-600 font-extrabold border border-slate-200/90 dark:border-slate-700/80 shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.9)]'
                }`}
              >
                <span className="text-sm">{tab.icon}</span>
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isAct ? 'bg-white/20 text-white' : 'bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {tab.sub}
                </span>
              </button>
            );
          })}
        </div>

        {/* Ô TÌM KIẾM NHANH 3D TRONG SUỐT */}
        <div className="relative min-w-[260px] flex-1 sm:flex-initial">
          <Search className="w-4 h-4 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm môn học, lớp hoặc tên công cụ..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-2xl border border-slate-200/90 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)] backdrop-blur-xs"
          />
        </div>
      </div>

      {/* THÔNG BÁO CHUNG 3D TRONG SUỐT: LIÊN TỤC UPDATE & GHI NHẬN Ý KIẾN THẦY CÔ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0C2340]/95 via-[#123660]/90 to-[#0A1A2E]/95 text-white p-4 sm:p-5 border border-cyan-400/40 shadow-[0_12px_32px_rgba(12,35,64,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-md">
        {/* Hiệu ứng hào quang ánh sáng 3D đa chiều */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-400/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Cột trái: Thông điệp Liên tục update & Ghi nhận hoàn thiện */}
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              {/* Huy hiệu 3D: LIÊN TỤC UPDATE */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 shadow-[0_3px_10px_rgba(245,158,11,0.45),inset_0_1px_0_rgba(255,255,255,0.7)] animate-pulse">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>LIÊN TỤC UPDATE 2026</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-400/20 text-cyan-200 border border-cyan-400/40 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
                <span>Chuẩn BGD&ĐT • 100% An Toàn</span>
              </span>
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>📢</span>
                <span>Hệ sinh thái phần mềm được <strong className="text-amber-300 underline decoration-amber-400/60 font-black">LIÊN TỤC UPDATE</strong> đồng hành cùng Thầy/Cô</span>
              </h3>
              <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed mt-1">
                Tác giả <strong className="text-cyan-300 font-bold">Thầy giáo Đinh Thành</strong> luôn trân trọng lắng nghe &amp; ghi nhận mọi yêu cầu nâng cấp, bổ sung môn học, tối ưu hóa tính năng cũng như sửa app theo góp ý thực tế của quý Thầy/Cô trên toàn quốc để các ứng dụng ngày càng hoàn thiện, phục vụ đắc lực nhất cho công tác giảng dạy &amp; ra đề kiểm tra.
              </p>
            </div>

            {/* Hướng dẫn tải an toàn .zip Pass 123 */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-300 pt-1.5 border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Khuyên dùng: Tải bản nén <strong className="text-amber-300 font-bold font-mono bg-white/10 px-1.5 py-0.2 rounded border border-white/15">.zip (Pass: 123)</strong> để tải siêu tốc, không bị chặn nhầm.</span>
              </span>
              <span className="hidden sm:inline text-white/30">•</span>
              <span>Hoặc chọn bản <strong className="text-cyan-200 font-bold">.exe</strong> cài trực tiếp qua Google Drive / Cloud CDN.</span>
            </div>
          </div>

          {/* Cột phải: Nút 3D tương tác gửi yêu cầu & Hotline Zalo */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
            <a
              href={BRAND.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs shadow-[0_6px_18px_rgba(16,185,129,0.4),inset_0_1px_0_rgba(255,255,255,0.4)] border border-emerald-400/50 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer text-center"
              title="Gửi tin nhắn Zalo yêu cầu nâng cấp tính năng hoặc sửa app trực tiếp tới Thầy Đinh Thành"
            >
              <MessageCircle className="w-4 h-4 text-white shrink-0" />
              <span>Góp Ý &amp; Yêu Cầu Nâng Cấp App</span>
            </a>

            <div className="text-[10px] text-slate-300 text-center font-medium">
              Hotline / Zalo Thầy Thành: <strong className="text-amber-300 font-bold">{BRAND.phone}</strong> (24/7)
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white font-bold border-b border-blue-800 shadow-sm">
              <tr>
                <th className="py-3 px-3 w-10 text-center">STT</th>
                <th className="py-3 px-3 min-w-[200px]">Tên Phần Mềm & Ứng Dụng</th>
                <th className="py-3 px-3 min-w-[120px]">Cấp Học / Môn</th>
                <th className="py-3 px-3 min-w-[250px]">Chức Năng Chính</th>
                <th className="py-3 px-3 text-center min-w-[130px]">Dùng Thử Trực Tuyến</th>
                <th className="py-3 px-3 text-center min-w-[180px]">Tải Bộ Cài Miễn Phí</th>
                <th className="py-3 px-3 text-center min-w-[140px]">Bản Quyền Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredApps.length > 0 ? (
                filteredApps.map((app, idx) => {
                  const downloads = APP_DOWNLOAD_LINKS[app.id] || {};
                  return (
                    <tr 
                      key={app.id} 
                      className="hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition group"
                    >
                      {/* STT */}
                      <td className="py-3 px-3 text-center text-slate-400 font-mono font-semibold">
                        {idx + 1}
                      </td>

                      {/* TÊN PHẦN MỀM */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onOpenAppModal(app)}
                            className="font-bold text-slate-900 dark:text-white hover:text-blue-600 transition text-left cursor-pointer flex items-center gap-1.5"
                          >
                            <span>{app.title}</span>
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            {app.badge || 'PRO'}
                          </span>
                          <button
                            onClick={(e) => onCopyShareLink(app.url, app.title, e)}
                            className="text-[10px] text-slate-400 hover:text-blue-600 transition inline-flex items-center gap-0.5"
                            title="Sao chép link gửi cho đồng nghiệp"
                          >
                            <Share2 className="w-2.5 h-2.5" />
                            <span>Link</span>
                          </button>
                        </div>
                      </td>

                      {/* CẤP HỌC / MÔN */}
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {app.levelBadge || 'TIỆN ÍCH'}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[130px]">
                          {app.category}
                        </p>
                      </td>

                      {/* CHỨC NĂNG CHÍNH */}
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400 leading-relaxed">
                        {app.description}
                      </td>

                      {/* DÙNG THỬ TRỰC TUYẾN (5 LƯỢT) */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => onOpenAppModal(app)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 text-xs font-bold transition shadow-2xs cursor-pointer active:scale-95"
                          title="Trải nghiệm thử 5 lượt miễn phí"
                        >
                          <Sparkles className="w-3 h-3 text-cyan-600 animate-pulse" />
                          <span>Dùng thử Online</span>
                        </button>
                      </td>

                      {/* TẢI BỘ CÀI ĐẶT DUY NHẤT (CHUẨN XANH DƯƠNG CHUYÊN NGHIỆP) */}
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center justify-center">
                          {downloads.zip ? (
                            <a
                              href={downloads.zip}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer"
                              title="Tải bộ cài đặt 2-in-1 bản quyền (Pass giải nén: 123) - 100% không bị chặn nhầm virus"
                            >
                              <Download className="w-3.5 h-3.5 text-blue-100 shrink-0" />
                              <span>Tải Bộ Cài (.zip)</span>
                            </a>
                          ) : downloads.exe ? (
                            <a
                              href={downloads.exe}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer"
                              title="Tải bộ cài đặt thực thi .exe"
                            >
                              <Download className="w-3.5 h-3.5 text-blue-100 shrink-0" />
                              <span>Tải Cài Đặt</span>
                            </a>
                          ) : (
                            <button
                              onClick={() => onOpenAppModal(app)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 text-xs hover:bg-blue-100 font-bold border border-blue-200 cursor-pointer"
                            >
                              <span>Dùng Online</span>
                            </button>
                          )}
                        </div>
                      </td>

                      {/* NÂNG CẤP BẢN QUYỀN PRO */}
                      <td className="py-3 px-3 text-center">
                        <a
                          href={BRAND.zaloUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 text-xs font-bold transition shadow-2xs"
                          title="Liên hệ Thầy Thành qua Zalo để nhận báo giá ưu đãi sư phạm"
                        >
                          <MessageCircle className="w-3 h-3 text-emerald-600" />
                          <span>Zalo Kích Hoạt</span>
                        </a>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Không tìm thấy phần mềm phù hợp với từ khóa "{searchQuery}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
