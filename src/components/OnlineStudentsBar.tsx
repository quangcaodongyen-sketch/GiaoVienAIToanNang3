// ==============================================================================
// THANH HIỂN THỊ CÁC BẠN HỌC SINH ĐANG ONLINE HỌC BÀI THỜI GIAN THỰC
// Tác giả: Thầy giáo Đinh Văn Thành - ĐT: 0915.213717
// Chữ hiển thị to, rõ ràng, dễ đọc trên cả máy tính và điện thoại cảm ứng
// ==============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Sparkles, 
  ChevronRight, 
  Send, 
  X, 
  CheckCircle2, 
  BookOpen, 
  Award, 
  Smile,
  Activity
} from 'lucide-react';
import { onlinePresenceService, OnlineStudentItem } from '../services/onlinePresenceService';
import type { StudentProfile } from '../services/studentGradebookService';

interface OnlineStudentsBarProps {
  currentStudent?: StudentProfile | null;
  onSelectStudentToRemind?: (name: string, className: string) => void;
}

export const OnlineStudentsBar: React.FC<OnlineStudentsBarProps> = ({
  currentStudent,
  onSelectStudentToRemind
}) => {
  const [onlineList, setOnlineList] = useState<OnlineStudentItem[]>([]);
  const [filterMode, setFilterMode] = useState<'class' | 'all'>('class');
  const [showFullModal, setShowFullModal] = useState<boolean>(false);
  const [greetToast, setGreetToast] = useState<string | null>(null);

  const studentClass = currentStudent?.className || '8A1';

  // Lắng nghe cập nhật real-time từ onlinePresenceService
  useEffect(() => {
    onlinePresenceService.setCurrentStudent(currentStudent || null);

    const update = () => {
      setOnlineList(onlinePresenceService.getOnlineStudents());
    };

    update();
    const unsubscribe = onlinePresenceService.subscribe(update);
    const interval = setInterval(update, 10000); // 10s tự động refresh

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [currentStudent]);

  // Danh sách đã lọc theo chế độ xem
  const filteredList = useMemo(() => {
    if (filterMode === 'class') {
      const normCls = studentClass.toUpperCase().replace(/\s+/g, '');
      return onlineList.filter(item => item.className.toUpperCase().replace(/\s+/g, '') === normCls);
    }
    return onlineList;
  }, [onlineList, filterMode, studentClass]);

  const totalOnlineCount = onlineList.length;
  const classOnlineCount = useMemo(() => {
    const normCls = studentClass.toUpperCase().replace(/\s+/g, '');
    return onlineList.filter(item => item.className.toUpperCase().replace(/\s+/g, '') === normCls).length;
  }, [onlineList, studentClass]);

  const showGreetToast = (msg: string) => {
    setGreetToast(msg);
    setTimeout(() => setGreetToast(null), 3000);
  };

  const handleSendGreeting = (name: string) => {
    showGreetToast(`👋 Em vừa gửi lời chào và lời chúc học tốt đến bạn ${name}!`);
  };

  const formatTimeAgo = (timestamp: number) => {
    const diffSec = Math.floor((Date.now() - timestamp) / 1000);
    if (diffSec < 30) return 'Vừa xong';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin <= 1) return '1 phút trước';
    return `${diffMin} phút trước`;
  };

  return (
    <div className="mb-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-500/40 shadow-md p-3 sm:p-4 text-slate-900 dark:text-white transition-all">
      {/* TOAST LỜI CHÀO BẠN HỌC */}
      {greetToast && (
        <div className="mb-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-center flex items-center justify-center gap-2 shadow-md animate-in fade-in">
          <span>🎉</span>
          <span>{greetToast}</span>
        </div>
      )}

      {/* HEADER THANH ONLINE: TIÊU ĐỀ RÕ RÀNG + ĐẾM SỐ LƯỢNG + BỘ LỌC */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* CHẤM XANH ONLINE SỐNG ĐỘNG */}
          <div className="relative flex items-center justify-center shrink-0">
            <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 shadow-xs"></span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                <span>CÁC BẠN ĐANG ONLINE HỌC BÀI</span>
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-black border border-emerald-300 dark:border-emerald-800 shadow-2xs">
                🟢 {filterMode === 'class' ? classOnlineCount : totalOnlineCount} bạn đang học
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Cùng nhau học tập sôi nổi • Đua điểm thi đua theo tổ và lớp
            </p>
          </div>
        </div>

        {/* BỘ LỌC: CÙNG LỚP HOẶC TOÀN TRƯỜNG & NÚT XEM TẤT CẢ */}
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
          <div className="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-300 dark:border-slate-700 flex items-center text-xs sm:text-sm font-bold">
            <button
              type="button"
              onClick={() => setFilterMode('class')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                filterMode === 'class'
                  ? 'bg-emerald-500 text-white font-black shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Lớp {studentClass} ({classOnlineCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-emerald-500 text-white font-black shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Toàn trường ({totalOnlineCount})
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowFullModal(true)}
            className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-bold transition cursor-pointer border border-blue-200 dark:border-blue-800 flex items-center gap-1"
          >
            <span>Xem tất cả</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* DANH SÁCH CUỘN NGANG CÁC BẠN ĐANG ONLINE (CHỮ TO RÕ, ĐẸP MẮT TRÊN MÁY TÍNH & ĐIỆN THOẠI) */}
      <div className="mt-3 flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-emerald-300 dark:scrollbar-thumb-emerald-700">
        {filteredList.map((student) => {
          const firstLetter = student.name.trim().charAt(0).toUpperCase();

          return (
            <div
              key={student.id}
              className={`shrink-0 w-64 sm:w-72 p-2.5 sm:p-3 rounded-xl border flex items-center justify-between gap-2.5 transition-all shadow-xs ${
                student.isCurrentDevice
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 ring-2 ring-amber-300/60'
                  : 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {/* AVATAR KÈM CHẤM XANH */}
                <div className="relative shrink-0">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr ${student.avatarColor} text-white flex items-center justify-center font-black text-sm sm:text-base shadow-xs`}>
                    {firstLetter}
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-2xs"></span>
                </div>

                {/* THÔNG TIN TÊN & HOẠT ĐỘNG (CHỮ TO RÕ RÀNG) */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate" title={student.name}>
                      {student.name}
                    </span>
                    {student.isCurrentDevice && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-black">
                        (Em)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-cyan-200 text-xs font-black shrink-0">
                      {student.className}
                    </span>
                    <span className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 font-semibold truncate" title={student.action}>
                      {student.action}
                    </span>
                  </div>
                </div>
              </div>

              {/* THỜI GIAN HOẶC NÚT CHÀO BẠN */}
              <div className="shrink-0 flex flex-col items-end gap-1">
                <span className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {formatTimeAgo(student.lastActiveTime)}
                </span>
                {!student.isCurrentDevice && (
                  <button
                    type="button"
                    onClick={() => handleSendGreeting(student.name)}
                    className="p-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 transition cursor-pointer"
                    title={`Gửi lời chào đến bạn ${student.name}`}
                  >
                    <Smile className="w-3.5 h-3.5 text-emerald-600" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL XEM DANH SÁCH ĐẦY ĐỦ TẤT CẢ CÁC BẠN ĐANG ONLINE */}
      {showFullModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full shadow-2xl border border-emerald-400/50 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-700 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                  🟢
                </span>
                <div>
                  <h3 className="font-black text-base sm:text-lg">
                    DANH SÁCH HỌC SINH ĐANG ONLINE ({onlineList.length} BẠN)
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100">
                    Trường THCS Đồng Yên • Môn Tiếng Anh Thầy Thành
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowFullModal(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2 flex-1 divide-y divide-slate-100 dark:divide-slate-800">
              {onlineList.map((st, idx) => (
                <div key={st.id || idx} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${st.avatarColor} text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs relative`}>
                      {st.name.charAt(0)}
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                          {st.name}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-cyan-200 text-xs font-black">
                          Lớp {st.className}
                        </span>
                        {st.isCurrentDevice && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 text-xs font-black">
                            (Em)
                          </span>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{st.action}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                      {formatTimeAgo(st.lastActiveTime)}
                    </span>
                    {!st.isCurrentDevice && (
                      <button
                        type="button"
                        onClick={() => handleSendGreeting(st.name)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center gap-1"
                      >
                        <Smile className="w-3 h-3" />
                        <span className="hidden sm:inline">Chào bạn</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-800 text-center shrink-0">
              <button
                type="button"
                onClick={() => setShowFullModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm hover:bg-slate-300 transition"
              >
                Đóng danh sách
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
