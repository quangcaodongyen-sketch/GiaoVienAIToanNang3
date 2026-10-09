import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Zap, BookOpen, FileCheck, ExternalLink, Download } from 'lucide-react';
import { MATHSTUDIO_RESOURCES } from '../config/brand';

interface PromoItem {
  id: string;
  badge: string;
  badgeColor: string;
  text: string;
  highlightText: string;
  actionText: string;
  hash: string;
  isDownload?: boolean;
  downloadUrl?: string;
}

const PROMO_ITEMS: PromoItem[] = [
  {
    id: 'nls',
    badge: 'HOT NLS',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    text: 'Tự động chèn Năng lực số, STEM, AI vào giáo án 12 môn (CV 5512) chữ màu đỏ',
    highlightText: 'Add-in Word 1-Click',
    actionText: 'Dùng Thử 5 Lần',
    hash: '#nls-ai'
  },
  {
    id: 'taode',
    badge: 'CV 7991',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    text: 'Sinh ma trận, bản đặc tả & đề thi 12 môn THCS với đáp án đúng chữ đỏ tiện chấm bài',
    highlightText: 'Ma Trận & Đặc Tả',
    actionText: 'Trải Nghiệm Ngay',
    hash: '#tao-de-tieng-anh'
  },
  {
    id: 'math',
    badge: 'MATHPIX WORD',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    text: 'Chuyển công thức Toán Mathpix sang Word Equation / MathType chuẩn Office trong 3 giây',
    highlightText: 'Bộ Cài Gọn 838KB',
    actionText: 'Tải Về Dùng Thử',
    hash: '#mathstudio',
    isDownload: true,
    downloadUrl: MATHSTUDIO_RESOURCES.fullZipUrl
  },
  {
    id: 'bienthe',
    badge: 'CHỐNG QUAY CÓP',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    text: 'Sinh 3 đề biến thể tương đương từ đề thi gốc kèm hướng dẫn chấm và audio script',
    highlightText: 'Sinh Đề Biến Thể VIP',
    actionText: 'Dùng Thử 5 Lượt',
    hash: '#sinh-de-bien-the'
  }
];

interface CrossPromoBannerProps {
  currentAppId?: string;
  currentToolId?: string;
  onNavigateApp?: (hash: string) => void;
  className?: string;
}

export const CrossPromoBanner: React.FC<CrossPromoBannerProps> = ({
  currentAppId,
  currentToolId,
  onNavigateApp,
  className = ''
}) => {
  // Lọc bỏ app hiện tại để quảng cáo chéo các app khác
  const activeId = currentAppId || currentToolId;
  const eligiblePromos = PROMO_ITEMS.filter((p) => p.id !== activeId);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Tự động chuyển luân phiên mỗi 7 giây
  useEffect(() => {
    if (eligiblePromos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % eligiblePromos.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [eligiblePromos.length]);

  const currentPromo = eligiblePromos[currentIndex] || eligiblePromos[0];
  if (!currentPromo) return null;

  const handleClick = (e: React.MouseEvent) => {
    if (currentPromo.isDownload && currentPromo.downloadUrl) {
      // Cho phép tải trực tiếp file zip
      return;
    }
    if (onNavigateApp) {
      e.preventDefault();
      onNavigateApp(currentPromo.hash);
    } else {
      window.location.hash = currentPromo.hash;
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-500/30 p-2.5 sm:px-4 sm:py-2.5 shadow-md flex items-center justify-between gap-3 text-xs font-sans transition-all hover:border-blue-400/50 ${className}`}
    >
      {/* Hiệu ứng nhấp nháy phát sáng nhẹ nhàng thu hút ánh nhìn nhưng không làm phiền */}
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
        </span>

        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0 animate-pulse ${currentPromo.badgeColor}`}
        >
          {currentPromo.badge}
        </span>

        <p className="text-slate-200 truncate text-[11.5px] sm:text-xs">
          <strong className="text-white font-bold">{currentPromo.highlightText}: </strong>
          <span className="text-slate-300 hidden md:inline">{currentPromo.text}</span>
          <span className="text-slate-300 md:hidden">{currentPromo.text.slice(0, 50)}...</span>
        </p>
      </div>

      <div className="shrink-0 flex items-center gap-2">
        <a
          href={currentPromo.isDownload && currentPromo.downloadUrl ? currentPromo.downloadUrl : currentPromo.hash}
          onClick={handleClick}
          download={currentPromo.isDownload ? true : undefined}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-[11px] shadow-sm flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
          title={`Bấm để ${currentPromo.actionText}`}
        >
          {currentPromo.isDownload ? (
            <Download className="w-3.5 h-3.5 text-cyan-300" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          )}
          <span>{currentPromo.actionText}</span>
          <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
