// ==============================================================================
// KHỐI BỘ ĐẾM LƯỢT TRUY CẬP VÀ HỌC TẬP THỜI GIAN THỰC (VISITOR STATS BAR)
// Tác giả: Thầy giáo Đinh Văn Thành - ĐT: 0915.213717 - Website: dekiemtraso.com
// Phong cách 3D Glassmorphism sư phạm đĩnh đạc, tương phản cao, số to rõ ràng
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { Users, Calendar, BarChart3, Globe } from 'lucide-react';
import { visitorStatsService, VisitorStatsData } from '../services/visitorStatsService';
import { onlinePresenceService } from '../services/onlinePresenceService';

interface VisitorStatsBarProps {
  className?: string;
  variant?: 'compact' | 'full' | 'card';
}

export const VisitorStatsBar: React.FC<VisitorStatsBarProps> = ({
  className = '',
  variant = 'full'
}) => {
  const [stats, setStats] = useState<VisitorStatsData>(() => visitorStatsService.getStats());

  useEffect(() => {
    // Cập nhật số online từ onlinePresenceService
    const updateOnline = () => {
      const list = onlinePresenceService.getOnlineStudents();
      visitorStatsService.setOnlineCount(list.length || 4);
    };

    updateOnline();
    const unsubOnline = onlinePresenceService.subscribe(updateOnline);
    const unsubStats = visitorStatsService.subscribe((newStats) => {
      setStats(newStats);
    });

    return () => {
      unsubOnline();
      unsubStats();
    };
  }, []);

  return (
    <div
      className={`w-full bg-gradient-to-r from-slate-900/90 via-slate-800/95 to-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-2xl p-2.5 sm:p-3 shadow-lg shadow-black/20 text-white ${className}`}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {/* MỤC 1: ĐANG ONLINE */}
        <div className="flex items-center gap-2.5 bg-slate-800/80 hover:bg-slate-800 border border-emerald-500/40 rounded-xl px-3 py-2 transition-all">
          <div className="relative shrink-0 flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-xs"></span>
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <span>Đang online</span>
            </div>
            <div className="text-sm sm:text-base font-black text-emerald-400 truncate">
              {stats.onlineCount} bạn
            </div>
          </div>
        </div>

        {/* MỤC 2: HÔM NAY */}
        <div className="flex items-center gap-2.5 bg-slate-800/80 hover:bg-slate-800 border border-sky-500/40 rounded-xl px-3 py-2 transition-all">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/30">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Hôm nay
            </div>
            <div className="text-sm sm:text-base font-black text-sky-400 truncate">
              {stats.todayVisits.toLocaleString('vi-VN')} lượt học
            </div>
          </div>
        </div>

        {/* MỤC 3: TUẦN NÀY */}
        <div className="flex items-center gap-2.5 bg-slate-800/80 hover:bg-slate-800 border border-amber-500/40 rounded-xl px-3 py-2 transition-all">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Tuần này
            </div>
            <div className="text-sm sm:text-base font-black text-amber-400 truncate">
              {stats.weekVisits.toLocaleString('vi-VN')} lượt học
            </div>
          </div>
        </div>

        {/* MỤC 4: TỔNG TRUY CẬP */}
        <div className="flex items-center gap-2.5 bg-slate-800/80 hover:bg-slate-800 border border-purple-500/40 rounded-xl px-3 py-2 transition-all">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30">
            <Globe className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Tổng truy cập
            </div>
            <div className="text-sm sm:text-base font-black text-purple-300 truncate">
              {stats.totalVisits.toLocaleString('vi-VN')} lượt
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
