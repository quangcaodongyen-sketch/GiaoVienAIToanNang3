import React, { useState, useEffect, useMemo } from 'react';
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
  Check,
  Copy,
  AlertCircle,
  XCircle,
  UserCheck,
  UserX,
  ClipboardList
} from 'lucide-react';
import { 
  studentGradebookService, 
  StudentCheckinLog, 
  ClassLeaderboardItem,
  ClassRoom,
  ClassAttendanceReport,
  ClassAttendanceStudentStatus
} from '../services/studentGradebookService';

interface StudentPublicTrackingProps {
  onStartExam?: () => void;
  onStartVocab?: () => void;
  defaultClass?: string;
}

export const StudentPublicTracking: React.FC<StudentPublicTrackingProps> = ({
  onStartExam,
  onStartVocab,
  defaultClass
}) => {
  // Chế độ xem: 'attendance_roster' (Sổ điểm danh chính thức từng lớp) hoặc 'live_feed' (Nhật ký thời gian thực)
  const [activeTrackingMode, setActiveTrackingMode] = useState<'attendance_roster' | 'live_feed'>('attendance_roster');

  // Lớp được chọn: Mặc định theo lớp của học sinh nếu có, hoặc 'ALL'
  const [selectedClass, setSelectedClass] = useState<string>(defaultClass || 'ALL');

  useEffect(() => {
    if (defaultClass) {
      setSelectedClass(defaultClass);
    }
  }, [defaultClass]);

  // Bộ lọc trạng thái điểm danh: 'all', 'entered', 'not_entered'
  const [statusFilter, setStatusFilter] = useState<'all' | 'entered' | 'not_entered'>('all');

  // Tìm kiếm theo tên hoặc mã HS
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Báo cáo điểm danh và roster lớp
  const [attendanceReport, setAttendanceReport] = useState<ClassAttendanceReport>(() => 
    studentGradebookService.getClassAttendanceReport('ALL')
  );

  // Danh sách các lớp chính thức
  const officialClasses = useMemo(() => {
    return studentGradebookService.getOfficialClassesList();
  }, []);

  // State thông báo sao chép
  const [copyToast, setCopyToast] = useState<string>('');

  // State Live feed
  const [logs, setLogs] = useState<StudentCheckinLog[]>([]);
  const [summary, setSummary] = useState(() => studentGradebookService.getPublicStudySummary());
  const [leaderboard, setLeaderboard] = useState<ClassLeaderboardItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Tải dữ liệu báo cáo
  const loadData = () => {
    setIsRefreshing(true);
    try {
      // 1. Tải báo cáo điểm danh chính thức
      const rep = studentGradebookService.getClassAttendanceReport(selectedClass);
      setAttendanceReport(rep);

      // 2. Tải nhật ký thời gian thực
      const checkinList = studentGradebookService.getCheckinLogs(150, selectedClass);
      setLogs(checkinList);

      const summ = studentGradebookService.getPublicStudySummary();
      setSummary(summ);

      // 3. Lấy bảng thi đua
      const targetClassId = selectedClass === 'ALL' ? 'cls-8a1' : 'cls-' + selectedClass.toLowerCase();
      const lb = studentGradebookService.getClassLeaderboard(targetClassId);
      setLeaderboard(lb);
    } finally {
      setTimeout(() => setIsRefreshing(false), 300);
    }
  };

  useEffect(() => {
    loadData();
    // Tự động cập nhật mỗi 30 giây
    const timer = setInterval(loadData, 30000);
    return () => clearInterval(timer);
  }, [selectedClass]);

  // Lọc danh sách học sinh theo trạng thái và tìm kiếm
  const filteredStudents = useMemo(() => {
    return attendanceReport.students.filter(s => {
      // 1. Lọc theo trạng thái điểm danh
      if (statusFilter === 'entered' && !s.hasEntered) return false;
      if (statusFilter === 'not_entered' && s.hasEntered) return false;

      // 2. Lọc theo tìm kiếm
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const normName = s.name.toLowerCase();
        const code = (s.studentCode || '').toLowerCase();
        const cls = s.className.toLowerCase();
        return normName.includes(q) || code.includes(q) || cls.includes(q);
      }
      return true;
    });
  }, [attendanceReport, statusFilter, searchQuery]);

  // Sao chép danh sách học sinh chưa vào học để gửi vào nhóm Zalo lớp
  const handleCopyMissingList = () => {
    const missing = attendanceReport.students.filter(s => !s.hasEntered);
    if (missing.length === 0) {
      alert(`🎉 Tuyệt vời! 100% học sinh ${selectedClass === 'ALL' ? 'tất cả các lớp' : `Lớp ${selectedClass}`} đã vào học!`);
      return;
    }

    const header = `📢 DANH SÁCH HỌC SINH CHƯA VÀO HỌC TRỰC TUYẾN — ${selectedClass === 'ALL' ? 'TOÀN TRƯỜNG' : `LỚP ${selectedClass}`}`;
    const timeStr = `⏰ Điểm danh lúc: ${new Date().toLocaleTimeString('vi-VN')} ngày ${new Date().toLocaleDateString('vi-VN')}`;
    const subheader = `Kính nhờ Quý Phụ huynh và Thầy/Cô đôn đốc ${missing.length} em học sinh sau vào học ôn tập:`;
    const studentLines = missing.map((s, idx) => `${idx + 1}. ${s.name} (${s.className}) - Mã HS: ${s.studentCode || 'Chưa cấp'}`);
    const footer = `
👉 Link Cổng Học Tập & Ôn Tập Tiếng Anh: https://dekiemtraso.com
(Học sinh chỉ cần chọn đúng Tên và Lớp là vào học được ngay, không cần mật khẩu)`;

    const fullText = [header, timeStr, subheader, '', ...studentLines, footer].join('\n');
    navigator.clipboard.writeText(fullText);
    setCopyToast(`✅ Đã sao chép danh sách ${missing.length} em chưa vào học! Thầy/Cô có thể dán ngay vào Zalo lớp.`);
    setTimeout(() => setCopyToast(''), 5000);
  };

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
      {/* BANNER ĐIỂM DANH & SỔ LỚP CHÍNH THỨC */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 border border-cyan-400/30 text-xs font-bold mb-2">
              <ClipboardList className="w-3.5 h-3.5 text-cyan-300" />
              <span>Sổ Điểm Môn Học HK1 2026 - 2027 • Thầy Đinh Văn Thành</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black mb-1">
              SỔ ĐIỂM DANH &amp; TIẾN ĐỘ VÀO HỌC TỪNG LỚP
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm max-w-2xl">
              Cập nhật đầy đủ 390 học sinh chính thức từ 10 lớp Thầy dạy (6A1-6A5 và 8A1-8A5).
              Mọi người có thể kiểm tra danh sách từng lớp xem ai đã vào học, tổng điểm bao nhiêu và ai chưa vào học để nhắc nhở kịp thời.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTrackingMode('attendance_roster')}
              className={`px-4 py-2.5 rounded-xl font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm ${
                activeTrackingMode === 'attendance_roster'
                  ? 'bg-amber-400 text-slate-950 border-2 border-amber-300'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <UserCheck className="w-4 h-4 text-slate-950" />
              <span>📋 Sổ Điểm Danh Từng Lớp</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTrackingMode('live_feed')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm ${
                activeTrackingMode === 'live_feed'
                  ? 'bg-cyan-400 text-slate-950 font-black border-2 border-cyan-300'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <Clock className="w-4 h-4 text-cyan-300" />
              <span>⚡ Hoạt Động Thời Gian Thực</span>
            </button>

            <button
              type="button"
              onClick={loadData}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1 border border-white/20"
              title="Làm mới dữ liệu điểm danh"
            >
              <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-300' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* TOAST THÔNG BÁO SAO CHÉP */}
      {copyToast && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 border-2 border-white">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-slate-950" />
            <span>{copyToast}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setCopyToast('')}
            className="text-slate-950 hover:opacity-70 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* CHẾ ĐỘ 1: BẢNG SỔ ĐIỂM DANH CHÍNH THỨC TỪNG LỚP (MẶC ĐỊNH) */}
      {/* ============================================================== */}
      {activeTrackingMode === 'attendance_roster' && (
        <div className="space-y-5">
          {/* 4 THẺ METRICS TIẾN ĐỘ CỦA LỚP ĐƯỢC CHỌN */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Card 1: Tổng sĩ số */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {attendanceReport.totalRoster}
                </div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {selectedClass === 'ALL' ? 'Tổng Sĩ Số 10 Lớp' : `Sĩ Số Lớp ${selectedClass}`}
                </div>
              </div>
            </div>

            {/* Card 2: Đã vào học */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-emerald-500/40 p-4 sm:p-5 shadow-xs flex items-center gap-3.5 bg-emerald-50/20 dark:bg-emerald-950/20">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
                <UserCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 flex items-baseline gap-1.5">
                  <span>{attendanceReport.enteredCount}</span>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    ({attendanceReport.enteredPercentage}%)
                  </span>
                </div>
                <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Học Sinh Đã Vào Học
                </div>
              </div>
            </div>

            {/* Card 3: Chưa vào học */}
            <div className={`rounded-2xl border p-4 sm:p-5 shadow-xs flex items-center gap-3.5 ${
              attendanceReport.notEnteredCount > 0 
                ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800/80' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                attendanceReport.notEnteredCount > 0
                  ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                <UserX className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
                  {attendanceReport.notEnteredCount}
                </div>
                <div className="text-xs font-bold text-rose-800 dark:text-rose-300">
                  Chưa Vào Học (Cần Nhắc)
                </div>
              </div>
            </div>

            {/* Card 4: Tổng điểm chuyên cần */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
                  {attendanceReport.totalMeritPoints}đ
                </div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Tổng Điểm Chuyên Cần ⭐
                </div>
              </div>
            </div>
          </div>

          {/* THANH CHỌN LỚP & BỘ LỌC ĐIỂM DANH */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-4">
            {/* HÀNG 1: CHỌN LỚP (TẤT CẢ 10 LỚP CHÍNH THỨC) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="w-4 h-4 text-blue-600" />
                  <span>Chọn Lớp Điểm Danh &amp; Tra Cứu:</span>
                </span>
                <span className="text-xs text-slate-500">
                  10 lớp • 390 học sinh chính thức
                </span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setSelectedClass('ALL')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                    selectedClass === 'ALL'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <span>Toàn Bộ 10 Lớp (390 HS)</span>
                </button>

                {/* Khối 6 */}
                {officialClasses.filter(c => c.grade === 6).map(c => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedClass(c.name)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                      selectedClass === c.name
                        ? 'bg-indigo-600 text-white shadow-md font-black'
                        : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100'
                    }`}
                  >
                    <span>Lớp {c.name}</span>
                    <span className="text-[10px] opacity-75">({c.totalStudents})</span>
                  </button>
                ))}

                {/* Khối 8 */}
                {officialClasses.filter(c => c.grade === 8).map(c => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedClass(c.name)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                      selectedClass === c.name
                        ? 'bg-emerald-600 text-white shadow-md font-black'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                    }`}
                  >
                    <span>Lớp {c.name}</span>
                    <span className="text-[10px] opacity-75">({c.totalStudents})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* HÀNG 2: BỘ LỌC TRẠNG THÁI + TÌM KIẾM + NÚT SAO CHÉP */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              {/* Lọc Đã vào / Chưa vào */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    statusFilter === 'all'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Tất Cả ({attendanceReport.totalRoster})
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('entered')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    statusFilter === 'entered'
                      ? 'bg-emerald-600 text-white font-black shadow-xs'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Đã Vào Học ({attendanceReport.enteredCount})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('not_entered')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                    statusFilter === 'not_entered'
                      ? 'bg-rose-600 text-white font-black shadow-xs'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
                  }`}
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span>Chưa Vào Học ({attendanceReport.notEnteredCount})</span>
                </button>
              </div>

              {/* Tìm kiếm & Nút sao chép */}
              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-56">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm tên hoặc mã HS..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                  {searchQuery && (
                    <button 
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleCopyMissingList}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
                  title="Sao chép danh sách học sinh chưa vào học để dán vào Zalo lớp"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao Chép DS Chưa Vào ({attendanceReport.notEnteredCount})</span>
                </button>
              </div>
            </div>
          </div>

          {/* BẢNG DANH SÁCH HỌC SINH ĐIỂM DANH */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-blue-600" />
                <span>
                  Danh Sách Điểm Danh: {selectedClass === 'ALL' ? 'Toàn Bộ 10 Lớp' : `Lớp ${selectedClass}`}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                  Hiển thị {filteredStudents.length} / {attendanceReport.totalRoster} học sinh
                </span>
              </h4>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-emerald-600 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Đã vào: {attendanceReport.enteredCount}</span>
                </span>
                <span className="flex items-center gap-1 text-rose-600 font-bold">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Chưa vào: {attendanceReport.notEnteredCount}</span>
                </span>
              </div>
            </div>

            {/* Bảng Dữ Liệu */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-black uppercase text-[11px] border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-3 px-3 text-center w-12">STT</th>
                    <th className="py-3 px-3">Mã Học Sinh</th>
                    <th className="py-3 px-4">Họ Và Tên Học Sinh</th>
                    <th className="py-3 px-3 text-center">Lớp</th>
                    <th className="py-3 px-3 text-center">Ngày Sinh</th>
                    <th className="py-3 px-3 text-center">Trạng Thái Điểm Danh</th>
                    <th className="py-3 px-3 text-center">Tổng Điểm Chuyên Cần ⭐</th>
                    <th className="py-3 px-3 text-center">Bài Làm &amp; Điểm Thi</th>
                    <th className="py-3 px-3 text-center">Lần Cuối Vào Học</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((s, idx) => (
                      <tr 
                        key={`${s.className}_${s.stt}_${s.studentCode}`}
                        className={`hover:bg-blue-50/40 dark:hover:bg-slate-800/50 transition ${
                          !s.hasEntered ? 'bg-rose-50/20 dark:bg-rose-950/10' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center font-bold text-slate-400">
                          {s.stt || idx + 1}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-600 dark:text-slate-300">
                          {s.studentCode || '—'}
                        </td>
                        <td className="py-2.5 px-4 font-black text-slate-900 dark:text-white text-sm">
                          {s.name}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold font-mono">
                            {s.className}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-500 font-mono">
                          {s.dob || '—'}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {s.hasEntered ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-black text-[11px] shadow-xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>ĐÃ VÀO HỌC</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 font-black text-[11px] border border-rose-200 dark:border-rose-900">
                              <XCircle className="w-3.5 h-3.5 text-rose-500" />
                              <span>CHƯA VÀO HỌC</span>
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center font-black">
                          {s.hasEntered ? (
                            <span className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-xs shadow-xs">
                              ⭐ {s.totalMeritPoints}đ
                            </span>
                          ) : (
                            <span className="text-slate-400 font-medium">0đ</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {s.submissionsCount > 0 ? (
                            <span className="font-bold text-blue-600 dark:text-blue-400">
                              {s.submissionsCount} bài {s.highestExamScore !== null ? `(${s.highestExamScore}đ)` : ''}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Chưa làm</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-500">
                          {s.lastActive || <span className="text-rose-500 font-bold">Chưa từng vào</span>}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        <Users className="w-12 h-12 mx-auto mb-2 text-slate-300 stroke-1" />
                        <p className="font-bold text-sm">Không tìm thấy học sinh nào phù hợp bộ lọc.</p>
                        <p className="text-xs text-slate-400 mt-1">Hãy thử xóa từ khóa tìm kiếm hoặc chọn bộ lọc "Tất Cả".</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CHẾ ĐỘ 2: NHẬT KÝ HOẠT ĐỘNG THỜI GIAN THỰC & VINH DANH */}
      {/* ============================================================== */}
      {activeTrackingMode === 'live_feed' && (
        <div className="space-y-6">
          {/* 4 THẺ THỐNG KÊ TỔNG QUAN */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {summary.totalSubmissionsCount}
                </div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Bài Kiểm Tra &amp; Bài Tập Đã Nộp
                </div>
              </div>
            </div>

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

          {/* 2 CỘT: CỘT TRÁI LIVE LOGS - CỘT PHẢI BẢNG VINH DANH */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* CỘT TRÁI (7 PHẦN): BẢNG LỊCH SỬ HỌC SINH VÀO HỌC (REAL-TIME FEED) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col h-[580px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>🔴 Nhật Ký Học Sinh Vào Học Trực Tuyến</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 font-bold border border-emerald-200 dark:border-emerald-800">
                      {logs.length} lượt
                    </span>
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">Tự động cập nhật 30s</span>
              </div>

              {/* Danh sách lượt vào học */}
              <div className="flex-1 overflow-y-auto space-y-2 pt-3 pr-1">
                {logs.length > 0 ? (
                  logs.map((item) => {
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
                    <p className="text-[11px] text-slate-400 mt-1">Học sinh chỉ cần ghi Tên &amp; Lớp là lượt học sẽ hiển thị ngay tại đây!</p>
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
                  Top Điểm Cao
                </span>
              </div>

              {/* Danh sách vinh danh */}
              <div className="flex-1 overflow-y-auto space-y-2 pt-3 pr-1">
                {leaderboard.length > 0 ? (
                  leaderboard.slice(0, 15).map((item, idx) => {
                    const isTop1 = idx === 0;
                    const isTop2 = idx === 1;
                    const isTop3 = idx === 2;

                    return (
                      <div
                        key={item.studentId}
                        className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                          isTop1
                            ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/60 shadow-xs'
                            : isTop2
                            ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700'
                            : isTop3
                            ? 'bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800/40'
                            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                            isTop1
                              ? 'bg-amber-400 text-slate-950 shadow-sm'
                              : isTop2
                              ? 'bg-slate-300 text-slate-900'
                              : isTop3
                              ? 'bg-amber-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            {idx + 1}
                          </div>

                          <div>
                            <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{item.studentName}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                                {item.className}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span>Đã làm: <strong className="text-slate-700 dark:text-slate-300">{item.testsCount} bài</strong></span>
                              <span>•</span>
                              <span>ĐTB: <strong className="text-blue-600 dark:text-blue-400">{item.averageScore.toFixed(1)}đ</strong></span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="px-2.5 py-1 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow-xs inline-block">
                            ⭐ {item.totalMeritPoints}đ
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                    <Trophy className="w-12 h-12 text-slate-300 mb-2 stroke-1" />
                    <p className="text-xs font-bold">Chưa có dữ liệu bài nộp cho lớp này.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
