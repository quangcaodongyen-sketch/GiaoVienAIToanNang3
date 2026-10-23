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
      {/* THANH LỌC & TÌM KIẾM TINH GỌN */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Phân loại:</span>
          </span>
          {[
            { id: 'ALL', label: `Tất cả (${apps.length})` },
            { id: 'THCS', label: 'Cấp THCS (CV 7991)' },
            { id: 'THPT', label: 'Cấp THPT (2025+)' },
            { id: 'TIỂU HỌC', label: 'Cấp Tiểu Học (TT 27)' },
            { id: 'CV 5512', label: 'Giáo Án & NLS (5512)' },
            { id: 'TIỆN ÍCH', label: 'Tiện Ích Giáo Viên' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                categoryFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-xs font-black'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Ô TÌM KIẾM NHANH */}
        <div className="relative min-w-[260px] flex-1 sm:flex-initial">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm môn học hoặc tên công cụ..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>
      </div>

      {/* BẢNG DANH MỤC ỨNG DỤNG ĐƠN GIẢN - GỌN GÀNG - KHÔNG TỐN DIỆN TÍCH */}
      {/* KHUYẾN NGHỊ TẢI FILE AN TOÀN - TRÁNH BÁO LỖI VIRUS */}
      <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-emerald-900 dark:text-emerald-200">
              Khuyên dùng: Tải bản nén <span className="underline decoration-emerald-500 font-extrabold">.zip (Pass: 123)</span> để không bao giờ bị trình duyệt chặn nhầm virus!
            </p>
            <p className="text-emerald-700 dark:text-emerald-400 text-[11px] mt-0.5">
              Tải siêu tốc qua máy chủ Cloud. Mật khẩu giải nén chung: <span className="font-mono font-bold bg-emerald-200 dark:bg-emerald-900/60 px-1.5 py-0.2 rounded text-emerald-950 dark:text-emerald-100">123</span> • Hoặc chọn bản <span className="font-semibold">.exe</span> cài trực tiếp.
            </p>
          </div>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-semibold text-[11px]">
          ✓ 100% Sạch & An toàn
        </span>
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
