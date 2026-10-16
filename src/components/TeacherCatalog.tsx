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
  Check
} from 'lucide-react';
import { apps, AppCard } from '../data/apps';
import { BRAND } from '../config/brand';

interface TeacherCatalogProps {
  onOpenAppModal: (app: AppCard) => void;
  onCopyShareLink: (url: string, title: string, e: React.MouseEvent) => void;
}

// Bảng ánh xạ link tải file .exe hoặc .zip cho từng phần mềm
const APP_DOWNLOAD_LINKS: Record<string, { exe?: string; zip?: string }> = {
  'tichhop-nls-ai-thcs': {
    exe: '/Cai_Dat_Tich_Hop_NLS_AI.exe',
    zip: '/Tich_Hop_NLS_AI_Pass_123.zip'
  },
  'tao-de-tieng-anh-tieu-hoc': {
    zip: '/Tao_De_Tieng_Anh_Tieu_Hoc_Pass_123.zip'
  },
  'tao-de-tieng-viet-tieu-hoc': {
    exe: '/Cai_Dat_TaoDe_TiengViet_TieuHoc.exe',
    zip: '/Cai_Dat_TaoDe_TiengViet_TieuHoc_Pass_123.zip'
  },
  'tao-de-tieng-anh-thcs': {
    exe: '/Tao_De_Tieng_Anh_THCS_Desktop.exe',
    zip: '/Tao_De_Tieng_Anh_THCS_Pass_123.zip'
  },
  'tao-de-15p-tienganh': {
    exe: '/TaoDe_15Phut_TiengAnh_THCS.exe',
    zip: '/TaoDe_15Phut_TiengAnh_THCS_Pass_123.zip'
  },
  'tao-de-toan-thcs': {
    exe: '/Trung_Tam_Tao_De_THCS.exe',
    zip: '/Trung_Tam_Tao_De_THCS_Pass_123.zip'
  },
  'tao-de-van-thcs': {
    exe: '/Tao_De_Van_THCS.exe',
    zip: '/Tao_De_Van_THCS_Pass_123.zip'
  },
  'tao-de-khtn-thcs': {
    exe: '/Tao_De_KHTN_THCS.exe',
    zip: '/Tao_De_KHTN_THCS_Pass_123.zip'
  },
  'tao-de-lich-su-thcs': {
    exe: '/Cai_Dat_TaoDe_LS_THCS.exe',
    zip: '/Tao_De_Lich_Su_THCS_Pass_123.zip'
  },
  'tao-de-tin-thcs': {
    exe: '/Tao_De_Tin_Hoc_THCS.exe',
    zip: '/Tao_De_Tin_Hoc_THCS_Pass_123.zip'
  },
  'tao-de-cn-thcs': {
    exe: '/Tao_De_Cong_Nghe_THCS.exe',
    zip: '/Tao_De_Cong_Nghe_THCS_Pass_123.zip'
  },
  'tao-de-gdcd-thcs': {
    exe: '/Tao_De_GDCD_THCS.exe',
    zip: '/Tao_De_GDCD_THCS_Pass_123.zip'
  },
  'tao-de-tieng-anh-thpt': {
    exe: '/Cai_Dat_TaoDe_TiengAnh_THPT.exe',
    zip: '/Tao_De_Tieng_Anh_THPT_Pass_123.zip'
  },
  'tao-de-toan-thpt': {
    zip: '/TaoDe_Toan_THPT.dotm'
  },
  'tao-de-van-thpt': {
    zip: '/Tao_De_NguVan_THPT_Pass_123.zip'
  },
  'tao-de-vatli-thpt': {
    zip: '/Tao_De_VatLi_THPT_Pass_123.zip'
  },
  'tao-de-hoahoc-thpt': {
    zip: '/Tao_De_HoaHoc_THPT_Pass_123.zip'
  },
  'tao-de-sinhhoc-thpt': {
    zip: '/Tao_De_SinhHoc_THPT_Pass_123.zip'
  },
  'tao-de-lichsu-thpt': {
    zip: '/Tao_De_LichSu_THPT_Pass_123.zip'
  },
  'tao-de-diali-thpt': {
    zip: '/Tao_De_DiaLi_THPT_Pass_123.zip'
  },
  'tao-de-tin-thpt': {
    zip: '/Tao_De_TinHoc_THPT_Pass_123.zip'
  },
  'tao-de-cn-thpt': {
    zip: '/Tao_De_CongNghe_THPT_Pass_123.zip'
  },
  'tao-de-gdktpl-thpt': {
    zip: '/Tao_De_GDKTPL_THPT_Pass_123.zip'
  },
  'chuanhoavanbanvip': {
    zip: '/Chuan_Hoa_Van_Ban_VIP_Pass_123.zip'
  },
  'dinhthanh-cleaner-pro': {
    exe: '/DinhThanh_Cleaner_Pro.exe',
    zip: '/DinhThanh_Cleaner_Pro_v4.5.zip'
  },
  'TACH-GOP-PDF': {
    zip: '/PDF_Suite_Pro_Pass_123.zip'
  },
  'screen-record-v2': {
    exe: '/Screen_Record_Pro_V2.exe'
  },
  'sinhdebienthe': {
    zip: '/Sinh_3_De_Bien_The_VIP_Pass_123.zip'
  },
  'mathstudio-pro': {
    exe: '/Cai_Dat_MathStudio.exe',
    zip: '/MathStudio_Pro_Pass_123.zip'
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
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-3 w-10 text-center">STT</th>
                <th className="py-3 px-3 min-w-[200px]">Tên Phần Mềm & Ứng Dụng</th>
                <th className="py-3 px-3 min-w-[120px]">Cấp Học / Môn</th>
                <th className="py-3 px-3 min-w-[250px]">Chức Năng Chính</th>
                <th className="py-3 px-3 text-center min-w-[130px]">Dùng Thử Trực Tuyến</th>
                <th className="py-3 px-3 text-center min-w-[150px]">Tải Về Miễn Phí</th>
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
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-300/60 text-xs font-bold transition shadow-2xs cursor-pointer active:scale-95"
                          title="Trải nghiệm thử 5 lượt miễn phí"
                        >
                          <Sparkles className="w-3 h-3 text-cyan-600 animate-pulse" />
                          <span>Dùng thử Online</span>
                        </button>
                      </td>

                      {/* TẢI BỘ CÀI MIỄN PHÍ */}
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-1.5 flex-wrap justify-center">
                          {downloads.exe && (
                            <a
                              href={downloads.exe}
                              download
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] shadow-2xs transition"
                              title="Tải tệp cài đặt thực thi .exe"
                            >
                              <Download className="w-3 h-3" />
                              <span>.exe</span>
                            </a>
                          )}
                          {downloads.zip && (
                            <a
                              href={downloads.zip}
                              download
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-[11px] border border-slate-300 dark:border-slate-700 shadow-2xs transition"
                              title="Bản nén .zip (Mật khẩu giải nén: 123)"
                            >
                              <Download className="w-3 h-3" />
                              <span>.zip (Pass: 123)</span>
                            </a>
                          )}
                          {!downloads.exe && !downloads.zip && (
                            <button
                              onClick={() => onOpenAppModal(app)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-slate-400 text-[11px] hover:text-blue-600"
                            >
                              <span>Xem link tải</span>
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
