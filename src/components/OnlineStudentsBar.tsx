// ==============================================================================
// THANH HIỂN THỊ CÁC BẠN HỌC SINH ĐANG ONLINE HỌC BÀI THỜI GIAN THỰC
// Tác giả: Thầy giáo Đinh Văn Thành - ĐT: 0915.213717
// CHỮ HIỂN THỊ TO, RÕ RÀNG, SƯ PHẠM ĐĨNH ĐẠC
// THỐNG KÊ GHÉP GỌN GÀNG VÀO HEADER - KHÔNG CHIẾM DIỆN TÍCH
// PHÂN BỔ NGẪU NHIÊN CÁC LỚP, CHỦ YẾU LỚP 6 VÀ LỚP 8 ĐUA ĐIỂM SÔI NỔI
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
  Activity,
  Calendar,
  BarChart3,
  Globe
} from 'lucide-react';
import { onlinePresenceService, OnlineStudentItem } from '../services/onlinePresenceService';
import { visitorStatsService, VisitorStatsData } from '../services/visitorStatsService';
import type { StudentProfile } from '../services/studentGradebookService';

interface OnlineStudentsBarProps {
  currentStudent?: StudentProfile | null;
  onSelectStudentToRemind?: (name: string, className: string) => void;
}

const ALL_19_CLASSES = [
  '8A1', '8A2', '8A3', '8A4', '8A5',
  '6A1', '6A2', '6A3', '6A4', '6A5',
  '7A1', '7A2', '7A3', '7A4', '7A5',
  '9A1', '9A2', '9A3', '9A4'
];

export const OnlineStudentsBar: React.FC<OnlineStudentsBarProps> = ({
  currentStudent,
  onSelectStudentToRemind
}) => {
  const [onlineList, setOnlineList] = useState<OnlineStudentItem[]>([]);
  const [filterMode, setFilterMode] = useState<'class' | 'all'>('class');
  const [selectedClass, setSelectedClass] = useState<string>(() => {
    return currentStudent?.className ? currentStudent.className.toUpperCase().replace(/\s+/g, '') : '8A1';
  });
  const [showFullModal, setShowFullModal] = useState<boolean>(false);
  const [modalGradeFilter, setModalGradeFilter] = useState<'all' | '6' | '8' | '7' | '9'>('all');
  const [modalClassFilter, setModalClassFilter] = useState<string>('all');
  const [greetToast, setGreetToast] = useState<string | null>(null);
  const [stats, setStats] = useState<VisitorStatsData>(() => visitorStatsService.getStats());

  // Đồng bộ lớp khi học sinh hiện tại thay đổi
  useEffect(() => {
    if (currentStudent?.className) {
      setSelectedClass(currentStudent.className.toUpperCase().replace(/\s+/g, ''));
    }
  }, [currentStudent]);

  // Lắng nghe cập nhật real-time từ onlinePresenceService và visitorStatsService
  useEffect(() => {
    onlinePresenceService.setCurrentStudent(currentStudent || null);

    const update = () => {
      setOnlineList(onlinePresenceService.getOnlineStudents(filterMode === 'class' ? selectedClass : 'all'));
      setStats(visitorStatsService.getClassStats(filterMode === 'class' ? selectedClass : 'all'));
    };

    update();
    const unsubPresence = onlinePresenceService.subscribe(update);
    const unsubStats = visitorStatsService.subscribe(() => {
      setStats(visitorStatsService.getClassStats(filterMode === 'class' ? selectedClass : 'all'));
    });

    const interval = setInterval(update, 7000); // 7s tự động refresh

    return () => {
      unsubPresence();
      unsubStats();
      clearInterval(interval);
    };
  }, [currentStudent, filterMode, selectedClass]);

  const classOnlineCount = useMemo(() => {
    return onlinePresenceService.getClassOnlineCount(selectedClass);
  }, [selectedClass, onlineList]);

  const totalOnlineCount = useMemo(() => {
    return onlinePresenceService.getTotalOnlineCount();
  }, [onlineList]);

  const currentDisplayedCount = filterMode === 'class' ? classOnlineCount : totalOnlineCount;

  // Lấy danh sách đầy đủ cho Modal
  const fullSchoolOnlineList = useMemo(() => {
    return onlinePresenceService.getOnlineStudents('all');
  }, [onlineList]);

  // Danh sách học sinh trong Modal theo bộ lọc khối/lớp
  const modalFilteredList = useMemo(() => {
    let list = fullSchoolOnlineList;
    if (modalGradeFilter !== 'all') {
      const g = parseInt(modalGradeFilter, 10);
      list = list.filter(item => item.grade === g);
    }
    if (modalClassFilter !== 'all') {
      list = list.filter(item => item.className.toUpperCase().replace(/\s+/g, '') === modalClassFilter.toUpperCase().replace(/\s+/g, ''));
    }
    return list;
  }, [fullSchoolOnlineList, modalGradeFilter, modalClassFilter]);

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
    <div className="mb-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-500/40 shadow-sm p-3 sm:p-4 text-slate-900 dark:text-white transition-all">
      {/* TOAST LỜI CHÀO BẠN HỌC */}
      {greetToast && (
        <div className="mb-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-center flex items-center justify-center gap-2 shadow-md animate-in fade-in">
          <span>🎉</span>
          <span>{greetToast}</span>
        </div>
      )}

      {/* ============================================================================== */}
      {/* HEADER GỘP GỌN GÀNG: TIÊU ĐỀ + CON SỐ THỐNG KÊ GHÉP CÙNG NHAU (TIẾT KIỆM DIỆN TÍCH) */}
      {/* ============================================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-200 dark:border-slate-800">
        {/* BÊN TRÁI: TIÊU ĐỀ + CHẤM XANH + BADGE ONLINE + THỐNG KÊ GHÉP GỌN */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            {/* CHẤM XANH ONLINE SỐNG ĐỘNG */}
            <div className="relative flex items-center justify-center shrink-0">
              <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-xs"></span>
            </div>

            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
              <span>CÁC BẠN ĐANG ONLINE HỌC BÀI</span>
            </h3>

            {/* SỐ BẠN ĐANG HỌC */}
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-black border border-emerald-300 dark:border-emerald-800 shadow-2xs">
              🟢 {currentDisplayedCount} bạn đang học
            </span>
          </div>

          {/* GHÉP CÁC CON SỐ THỐNG KÊ GỌN GÀNG VÀO DÒNG NÀY (KHÔNG CHIẾM KHỐI LỚN) */}
          <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 flex-wrap text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800">
              <Calendar className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
              <span>Hôm nay: <strong className="font-extrabold">{stats.todayVisits.toLocaleString('vi-VN')}</strong> lượt</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-800">
              <BarChart3 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Tuần này: <strong className="font-extrabold">{stats.weekVisits.toLocaleString('vi-VN')}</strong> lượt</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800 hidden sm:inline-flex">
              <Globe className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
              <span>Tổng truy cập: <strong className="font-extrabold">{stats.totalVisits.toLocaleString('vi-VN')}</strong></span>
            </span>

            <span className="text-slate-500 dark:text-slate-400 hidden md:inline text-[11px] font-medium">
              • {filterMode === 'class' ? `Lớp ${selectedClass} (Chủ yếu Khối 6 & 8 đua điểm)` : 'Toàn trường THCS Đồng Yên (19 lớp)'}
            </span>
          </div>
        </div>

        {/* BÊN PHẢI: BỘ LỌC CHỌN LỚP / TOÀN TRƯỜNG & NÚT XEM TẤT CẢ */}
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
              Lớp {selectedClass} ({classOnlineCount})
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

          {/* DROPDOWN CHỌN LỚP NHANH (19 LỚP - CHỦ YẾU KHỐI 6 VÀ 8) */}
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setFilterMode('class');
            }}
            className="px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-slate-700 cursor-pointer focus:outline-emerald-500"
            title="Đổi lớp hiển thị"
          >
            <optgroup label="Khối 8 (Chủ yếu)">
              {['8A1', '8A2', '8A3', '8A4', '8A5'].map(cls => (
                <option key={cls} value={cls}>Lớp {cls} ({onlinePresenceService.getClassOnlineCount(cls)})</option>
              ))}
            </optgroup>
            <optgroup label="Khối 6 (Chủ yếu)">
              {['6A1', '6A2', '6A3', '6A4', '6A5'].map(cls => (
                <option key={cls} value={cls}>Lớp {cls} ({onlinePresenceService.getClassOnlineCount(cls)})</option>
              ))}
            </optgroup>
            <optgroup label="Khối 7">
              {['7A1', '7A2', '7A3', '7A4', '7A5'].map(cls => (
                <option key={cls} value={cls}>Lớp {cls} ({onlinePresenceService.getClassOnlineCount(cls)})</option>
              ))}
            </optgroup>
            <optgroup label="Khối 9">
              {['9A1', '9A2', '9A3', '9A4'].map(cls => (
                <option key={cls} value={cls}>Lớp {cls} ({onlinePresenceService.getClassOnlineCount(cls)})</option>
              ))}
            </optgroup>
          </select>

          <button
            type="button"
            onClick={() => setShowFullModal(true)}
            className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-bold transition cursor-pointer border border-blue-200 dark:border-blue-800 flex items-center gap-1"
          >
            <span>Xem tất cả</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ============================================================================== */}
      {/* DANH SÁCH CUỘN NGANG CÁC BẠN ĐANG ONLINE (HIỂN THỊ NGAY BÊN DƯỚI, GỌN GÀNG) */}
      {/* ============================================================================== */}
      <div className="mt-3 flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-emerald-300 dark:scrollbar-thumb-emerald-700">
        {onlineList.map((student) => {
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
                    {student.points !== undefined && student.points > 0 && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-[10px] sm:text-xs font-black shrink-0">
                        ⭐ {student.points.toLocaleString('vi-VN')}đ
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

      {/* ============================================================================== */}
      {/* MODAL XEM DANH SÁCH ĐẦY ĐỦ TẤT CẢ CÁC BẠN ĐANG ONLINE THEO KHỐI / LỚP */}
      {/* ============================================================================== */}
      {showFullModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-emerald-400/50 overflow-hidden flex flex-col max-h-[85vh]">
            {/* TIÊU ĐỀ MODAL */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-700 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                  🟢
                </span>
                <div>
                  <h3 className="font-black text-base sm:text-lg">
                    DANH SÁCH HỌC SINH ĐANG ONLINE ({modalFilteredList.length}/{totalOnlineCount} BẠN)
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100">
                    Trường THCS Đồng Yên • Môn Tiếng Anh Thầy Đinh Thành
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

            {/* THANH BỘ LỌC KHỐI & LỚP TRONG MODAL */}
            <div className="p-2.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center gap-1.5 flex-wrap shrink-0">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1">Lọc:</span>
              <button
                type="button"
                onClick={() => { setModalGradeFilter('all'); setModalClassFilter('all'); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  modalGradeFilter === 'all' && modalClassFilter === 'all'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Toàn trường ({totalOnlineCount})
              </button>
              <button
                type="button"
                onClick={() => { setModalGradeFilter('8'); setModalClassFilter('all'); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  modalGradeFilter === '8'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Khối 8 (Chủ yếu)
              </button>
              <button
                type="button"
                onClick={() => { setModalGradeFilter('6'); setModalClassFilter('all'); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  modalGradeFilter === '6'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Khối 6 (Chủ yếu)
              </button>
              <button
                type="button"
                onClick={() => { setModalGradeFilter('7'); setModalClassFilter('all'); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  modalGradeFilter === '7'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Khối 7
              </button>
              <button
                type="button"
                onClick={() => { setModalGradeFilter('9'); setModalClassFilter('all'); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  modalGradeFilter === '9'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Khối 9
              </button>
            </div>

            {/* DANH SÁCH HỌC SINH */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1 divide-y divide-slate-100 dark:divide-slate-800">
              {modalFilteredList.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm font-medium">
                  Chưa có bạn nào đang online ở bộ lọc này
                </div>
              ) : (
                modalFilteredList.map((st, idx) => (
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
                          {st.points !== undefined && st.points > 0 && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-black">
                              ⭐ {st.points.toLocaleString('vi-VN')}đ
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
                          className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Smile className="w-3 h-3" />
                          <span className="hidden sm:inline">Chào bạn</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* CHÂN MODAL */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-800 text-center shrink-0">
              <button
                type="button"
                onClick={() => setShowFullModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition cursor-pointer"
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
