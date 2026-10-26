import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  FileText, 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  RotateCw, 
  Search, 
  Filter, 
  Award, 
  BookOpen, 
  Flame, 
  GraduationCap,
  Calendar,
  Eye,
  Check
} from 'lucide-react';
import { 
  studentGradebookService, 
  StudentCheckinLog, 
  ClassLeaderboardItem,
  ClassRoom 
} from '../services/studentGradebookService';

interface StudentPublicTrackingProps {
  onStartExam?: () => void;
  onStartVocab?: () => void;
}

export const StudentPublicTracking: React.FC<StudentPublicTrackingProps> = ({
  onStartExam,
  onStartVocab
}) => {
  const [logs, setLogs] = useState<StudentCheckinLog[]>([]);
  const [summary, setSummary] = useState(() => studentGradebookService.getPublicStudySummary());
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [searchName, setSearchName] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [leaderboard, setLeaderboard] = useState<ClassLeaderboardItem[]>([]);

  const loadData = () => {
    setIsRefreshing(true);
    try {
      const clsList = studentGradebookService.getClasses();
      setClasses(clsList);

      const checkinList = studentGradebookService.getCheckinLogs(150, selectedClass);
      setLogs(checkinList);

      const summ = studentGradebookService.getPublicStudySummary();
      setSummary(summ);

      // Lấy bảng điểm thi đua
      const targetClassId = selectedClass === 'ALL' ? (clsList[0]?.id || 'cls-12a1') : (clsList.find(c => c.name.toUpperCase() === selectedClass.toUpperCase())?.id || 'cls-12a1');
      const lb = studentGradebookService.getClassLeaderboard(targetClassId);
      setLeaderboard(lb);
    } finally {
      setTimeout(() => setIsRefreshing(false), 300);
    }
  };

  useEffect(() => {
    loadData();
    // Tự động làm mới mỗi 30 giây để cập nhật học sinh đang vào học
    const timer = setInterval(loadData, 30000);
    return () => clearInterval(timer);
  }, [selectedClass]);

  // Lọc log theo tìm kiếm tên
  const filteredLogs = logs.filter(item => {
    if (!searchName.trim()) return true;
    const term = searchName.toLowerCase().trim();
    return (
      (item.studentName || '').toLowerCase().includes(term) ||
      (item.className || '').toLowerCase().includes(term) ||
      (item.action || '').toLowerCase().includes(term) ||
      (item.detail || '').toLowerCase().includes(term)
    );
  });

  // Định dạng thời gian thân thiện (Vừa xong, X phút trước...)
  const formatTimeAgo = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffSec < 60) return 'Vừa xong';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin} phút trước`;
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) return `${diffHour} giờ trước`;
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Vừa xong';
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 THẺ THỐNG KÊ TỔNG QUAN CÔNG KHAI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Thẻ 1: Tổng học sinh */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-sm">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {summary.totalStudents}
            </div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Học Sinh Đã Vào Học
            </div>
          </div>
        </div>

        {/* Thẻ 2: Lượt vào học hôm nay */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {summary.todayCheckinsCount}
            </div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Lượt Vào Học Hôm Nay
            </div>
          </div>
        </div>

        {/* Thẻ 3: Tổng bài kiểm tra đã nộp */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {summary.totalSubmissionsCount}
            </div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Bài Thi & Bài Tập Đã Nộp
            </div>
          </div>
        </div>

        {/* Thẻ 4: Tổng số lớp tham gia */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 shadow-sm">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">
              {summary.totalClassesCount}
            </div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Lớp Học Toàn Trường
            </div>
          </div>
        </div>
      </div>

      {/* THANH CÔNG CỤ LỌC & TÌM KIẾM CÔNG KHAI */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Lọc theo Lớp:</span>
          </span>

          <button
            type="button"
            onClick={() => setSelectedClass('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedClass === 'ALL'
                ? 'bg-blue-600 text-white shadow-xs font-black'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Toàn Trường ({summary.totalStudents})
          </button>

          {['12A1', '12A2', '11A1', '10A1', '9A1', '8A1', '7A1', '6A1'].map(cls => (
            <button
              key={cls}
              type="button"
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedClass === cls
                  ? 'bg-blue-600 text-white shadow-xs font-black'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Lớp {cls}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Tìm theo tên học sinh..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="button"
            onClick={loadData}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer flex items-center gap-1 shrink-0"
            title="Làm mới dữ liệu"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span className="hidden sm:inline">Cập nhật</span>
          </button>
        </div>
      </div>

      {/* 2 CỘT: CỘT TRÁI LIVE LOGS VÀO HỌC - CỘT PHẢI BẢNG VINH DANH THI ĐUA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CỘT TRÁI (7 PHẦN): BẢNG LỊCH SỬ HỌC SINH VÀO HỌC (REAL-TIME FEED) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col h-[580px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>🔴 Nhật Ký Học Sinh Vào Học Trực Tuyến</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 font-bold border border-emerald-200 dark:border-emerald-800">
                  {filteredLogs.length} lượt
                </span>
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Tự động cập nhật 30s</span>
          </div>

          {/* Danh sách lượt vào học */}
          <div className="flex-1 overflow-y-auto space-y-2 pt-3 pr-1">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((item) => {
                const isExam = item.action.includes('kiểm tra') || item.action.includes('thi') || item.action.includes('GK');
                const isVocab = item.action.includes('từ vựng');

                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/30 hover:bg-blue-50/50 dark:hover:bg-slate-800 transition flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                        isExam
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                          : isVocab
                          ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        {item.className}
                      </div>

                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                            {item.studentName}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono">
                            {item.className}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 dark:text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                          <span className="font-bold text-blue-600 dark:text-blue-400">{item.action}</span>
                          {item.detail && (
                            <>
                              <span>•</span>
                              <span className="text-slate-500 truncate">{item.detail}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 block">
                        {formatTimeAgo(item.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Users className="w-12 h-12 text-slate-300 mb-2 stroke-1" />
                <p className="text-xs font-bold">Chưa có lượt vào học nào phù hợp bộ lọc.</p>
                <p className="text-[11px] text-slate-400 mt-1">Học sinh chỉ cần ghi Tên & Lớp là lượt học sẽ hiển thị ngay tại đây!</p>
              </div>
            )}
          </div>
        </div>

        {/* CỘT PHẢI (5 PHẦN): BẢNG VINH DANH & SỔ ĐIỂM CÔNG KHAI */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col h-[580px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Bảng Vinh Danh Học Tập ({selectedClass === 'ALL' ? 'Toàn Trường' : `Lớp ${selectedClass}`})</span>
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 font-bold border border-amber-200 dark:border-amber-800">
              Công Khai
            </span>
          </div>

          {/* Danh sách học sinh tiêu biểu */}
          <div className="flex-1 overflow-y-auto space-y-2 pt-3 pr-1">
            {leaderboard.length > 0 ? (
              leaderboard.map((stu, idx) => {
                const isTop1 = idx === 0;
                const isTop2 = idx === 1;
                const isTop3 = idx === 2;

                return (
                  <div
                    key={stu.studentId || idx}
                    className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                      isTop1
                        ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 shadow-xs'
                        : isTop2
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                        : isTop3
                        ? 'bg-amber-50/30 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-900/40'
                        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                        isTop1 ? 'bg-amber-400 text-slate-950 shadow-sm' :
                        isTop2 ? 'bg-slate-300 text-slate-900' :
                        isTop3 ? 'bg-amber-600 text-white' :
                        'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        #{idx + 1}
                      </div>

                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                            {stu.studentName}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Đã làm: <span className="font-bold text-slate-700 dark:text-slate-300">{stu.testsCount} bài</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-blue-600 dark:text-blue-400">
                        {stu.averageScore} đ
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Cao nhất: {stu.highestScore}đ
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Trophy className="w-12 h-12 text-slate-300 mb-2 stroke-1" />
                <p className="text-xs font-bold">Chưa có dữ liệu bài nộp cho lớp này.</p>
                <p className="text-[11px] text-slate-400 mt-1">Khi các em làm bài trắc nghiệm hoặc bài tập SGK, điểm số sẽ tự động xuất hiện tại đây!</p>
              </div>
            )}
          </div>

          {/* Footer nút hành động nhanh */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
            {onStartVocab && (
              <button
                type="button"
                onClick={onStartVocab}
                className="flex-1 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold transition text-center cursor-pointer flex items-center justify-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Học Từ Vựng SGK</span>
              </button>
            )}

            {onStartExam && (
              <button
                type="button"
                onClick={onStartExam}
                className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black transition text-center cursor-pointer flex items-center justify-center gap-1 shadow-xs"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Làm Bài Kiểm Tra</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
