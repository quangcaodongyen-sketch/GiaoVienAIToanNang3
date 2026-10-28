import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { 

  Trophy, 

  Award, 

  Target, 

  TrendingUp, 

  Star, 

  Users, 

  CheckCircle2, 

  Clock, 

  BookOpen, 

  Sparkles, 

  Flame, 

  ShieldCheck, 

  Zap, 

  ChevronRight,

  ArrowUpRight,

  GraduationCap,

  RotateCw,

  Search,

  Filter,

  Download,

  Copy,

  Printer,

  Gift,

  HelpCircle,

  Eye,

  Check,

  XCircle,

  UserCheck,

  UserX,

  ClipboardList,

  AlertCircle,

  BarChart3,

  Calendar,

  Activity

} from 'lucide-react';

import { 

  studentGradebookService, 

  ClassRoom, 

  StudentProfile, 

  StudentSubmission, 

  ClassLeaderboardItem,

  ClassComparisonStats,

  ClassAttendanceReport,

  ClassAttendanceStudentStatus,

  StudentCheckinLog,

  StudentLevelInfo,

  calculateStudentLevel,

  MeritBonusItem,

  getDailyLoginRewardInfo,

  TeacherLuckyBoxResult

} from '../services/studentGradebookService';

import { launchFireworks } from '../utils/fireworks';



interface UnifiedStudentStatsLeaderboardProps {

  defaultClassId?: string;

  defaultGrade?: number;

  defaultClassName?: string;

  onStartExercise?: () => void;

  onStartQuiz?: () => void;

  onStartExam?: () => void;

  onStartVocab?: () => void;

}



export const UnifiedStudentStatsLeaderboard: React.FC<UnifiedStudentStatsLeaderboardProps> = ({

  defaultClassId,

  defaultGrade,

  defaultClassName,

  onStartExercise,

  onStartQuiz,

  onStartExam,

  onStartVocab

}) => {

  // 1. CHẾ ĐỘ XEM TRUNG TÂM (Hợp nhất triệt để 2 loại thống kê cũ):

  // 'leaderboard' = Bảng Vàng Thi Đua & Cấp Độ (Level, Vương miện, Điểm minh bạch)

  // 'attendance'  = Sổ Điểm Danh & % Vào Học Chuẩn (Tỷ lệ %, DS đã vào / chưa vào học)

  // 'live_feed'   = Nhật Ký Thời Gian Thực (Live Stream các hoạt động học tập)

  const [activeTab, setActiveTab] = useState<'leaderboard' | 'attendance' | 'live_feed'>('leaderboard');



  // 2. PHẠM VI THỐNG KÊ: 'all' (Toàn trường), 'grade' (Theo khối), 'class' (Theo lớp)

  const [scopeFilter, setScopeFilter] = useState<'all' | 'grade' | 'class'>('all');

  const [selectedGrade, setSelectedGrade] = useState<number>(defaultGrade || 8);

  const [selectedClass, setSelectedClass] = useState<string>(defaultClassName || '8A1');



  // 3. TIÊU CHÍ XẾP HẠNG: 'merit' (Điểm thi đua toàn diện) hoặc 'score' (Điểm thi trung bình)

  const [sortBy, setSortBy] = useState<'merit' | 'score'>('merit');



  // 4. BỘ TÌM KIẾM HỌC SINH

  const [searchQuery, setSearchQuery] = useState<string>('');



  // 5. TRẠNG THÁI DỮ LIỆU THỜI GIAN THỰC

  const [classesList, setClassesList] = useState<ClassRoom[]>([]);

  const [officialClasses, setOfficialClasses] = useState<Array<{ name: string; grade: number; totalStudents: number }>>([]);

  const [leaderboard, setLeaderboard] = useState<ClassLeaderboardItem[]>([]);

  const [attendanceReport, setAttendanceReport] = useState<ClassAttendanceReport | null>(null);

  const [liveLogs, setLiveLogs] = useState<StudentCheckinLog[]>([]);

  const [activeStudent, setActiveStudent] = useState<StudentProfile | null>(null);

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('');



  // Thông tin khuyến mại đăng nhập hôm nay (+10 điểm) / ngày mai (+5 điểm)

  const [currentPromoDate, setCurrentPromoDate] = useState<string>(getLocalDateString());
  const loginReward = useMemo(() => getDailyLoginRewardInfo(currentPromoDate), [currentPromoDate]);

  // Tự động kiểm tra thời gian thực: Hết ngày (00:00:00) tự động xoá bỏ chương trình cũ và cập nhật chương trình ngày mới!
  useEffect(() => {
    const checkTimer = setInterval(() => {
      const realDate = getLocalDateString();
      if (realDate !== currentPromoDate) {
        setCurrentPromoDate(realDate);
      }
    }, 10000);
    return () => clearInterval(checkTimer);
  }, [currentPromoDate]);



  // 6. MODAL & THÔNG BÁO

  const [selectedStudentDetail, setSelectedStudentDetail] = useState<ClassLeaderboardItem | null>(null);

  const [toastMessage, setToastMessage] = useState<string>('');

  const [showBonusModal, setShowBonusModal] = useState<boolean>(false);

  const [bonusStudentId, setBonusStudentId] = useState<string>('');

  const [bonusPoints, setBonusPoints] = useState<number>(10);

  const [bonusReason, setBonusReason] = useState<string>('Học tập tích cực & chăm chỉ ôn bài');

  const [showLevelGuideModal, setShowLevelGuideModal] = useState<boolean>(false);

  const [attendanceStatusFilter, setAttendanceStatusFilter] = useState<'all' | 'entered' | 'not_entered'>('all');



  // Chế độ thống nhất 1 kiểu: Mặc định lọc học sinh THỰC TẾ ĐÃ THAM GIA HỌC

  const [onlyActiveStudents, setOnlyActiveStudents] = useState<boolean>(true);



  // Modal Hộp Quà May Mắn Thầy Đinh Thành

  const [showLuckyBoxModal, setShowLuckyBoxModal] = useState<boolean>(false);

  const [luckyBoxResult, setLuckyBoxResult] = useState<TeacherLuckyBoxResult | null>(null);

  const [luckyBoxTargetStudentId, setLuckyBoxTargetStudentId] = useState<string>('');



  // Toast helper

  const showToast = (msg: string) => {

    setToastMessage(msg);

    setTimeout(() => setToastMessage(''), 3500);

  };



  // Kích hoạt pháo hoa chúc mừng rực rỡ toàn màn hình

  const triggerConfetti = () => {

    launchFireworks(4500);

  };



  // Tải dữ liệu toàn diện theo thời gian thực (tự động rà soát & khôi phục điểm thực tế)

  const loadData = useCallback(async () => {

    setIsRefreshing(true);

    try {


      // 1. Tải danh sách lớp

      const cls = studentGradebookService.getClasses();

      setClassesList(cls);

      const offCls = studentGradebookService.getOfficialClassesList();

      setOfficialClasses(offCls);



      // 2. Tải học sinh hiện tại đang đăng nhập

      const curStu = studentGradebookService.getActiveStudent();

      setActiveStudent(curStu);



      // 3. Tải Bảng Xếp Hạng & Bảng Vàng theo phạm vi

      let lb: ClassLeaderboardItem[] = [];

      if (scopeFilter === 'all') {

        lb = studentGradebookService.getSchoolLeaderboard(undefined, sortBy);

      } else if (scopeFilter === 'grade') {

        lb = studentGradebookService.getSchoolLeaderboard(selectedGrade, sortBy);

      } else {

        lb = studentGradebookService.getClassLeaderboard(selectedClass);

        if (sortBy === 'score') {

          lb.sort((a, b) => b.averageScore - a.averageScore || b.totalMeritPoints - a.totalMeritPoints);

        } else {

          lb.sort((a, b) => b.totalMeritPoints - a.totalMeritPoints || b.averageScore - a.averageScore);

        }

        lb.forEach((it, idx) => { it.rank = idx + 1; });

      }

      setLeaderboard(lb);



      // 4. Tải Báo Cáo Sổ Điểm Danh & Tỷ Lệ Vào Học Chuẩn

      const attRep = studentGradebookService.getClassAttendanceReport(

        scopeFilter === 'class' ? selectedClass : (scopeFilter === 'grade' ? `Khối ${selectedGrade}` : 'ALL')

      );

      setAttendanceReport(attRep);



      // 5. Tải Nhật Ký Thời Gian Thực (Live Feed)

      const logs = studentGradebookService.getCheckinLogs(

        80, 

        scopeFilter === 'class' ? selectedClass : undefined

      );

      setLiveLogs(logs);



      // 6. Cập nhật nhãn thời gian

      const now = new Date();

      setLastUpdatedTime(now.toLocaleTimeString('vi-VN'));

    } finally {

      setTimeout(() => setIsRefreshing(false), 250);

    }

  }, [scopeFilter, selectedGrade, selectedClass, sortBy]);



  // Thao tác chủ động: Rà soát & khôi phục toàn diện điểm thực tế cho học sinh

  const handleAuditAndRestorePoints = async () => {

    setIsRefreshing(true);

    try {

      try {

        await studentGradebookService.syncFromCloud();

      } catch {}

      const res = studentGradebookService.auditAndRestoreAllStudentPoints();

      await loadData();

      if (res.restoredCount > 0) {

        alert(

          `🎉 ĐÃ KHÔI PHỤC ĐIỂM THÀNH CÔNG CHO HỌC SINH!\n\n` +

          `• Đã rà soát: ${res.auditedCount} học sinh\n` +

          `• Số học sinh được khôi phục/bù đắp điểm: ${res.restoredCount} em\n` +

          `• Tổng số điểm đã hoàn trả đúng thực tế: +${res.totalPointsRestored} điểm!\n\n` +

          `Toàn bộ kết quả bài thi, bài tập và lịch sử học từ hôm qua đến nay đã được bảo toàn đầy đủ, tránh mọi thiệt thòi cho các em học sinh!`

        );

      } else {

        alert(

          `✅ HỆ THỐNG ĐÃ RÀ SOÁT TOÀN DIỆN!\n\n` +

          `Toàn bộ ${res.auditedCount} học sinh đều đang có điểm số chuẩn xác, đầy đủ và bảo toàn tối đa theo đúng kết quả học tập thực tế!`

        );

      }

    } finally {

      setIsRefreshing(false);

    }

  };



  // Khởi động và lắng nghe Real-time events

  useEffect(() => {

    loadData();



    // Đồng bộ ngầm Cloud 1 lần duy nhất khi mở Bảng xếp hạng

    studentGradebookService.syncFromCloud().catch(() => {});



    // Lắng nghe sự kiện cập nhật điểm danh, nộp bài, thưởng điểm

    const handleGradebookUpdate = () => {

      loadData();

    };



    window.addEventListener('gvai_gradebook_updated', handleGradebookUpdate);

    window.addEventListener('storage', handleGradebookUpdate);



    // Tự động làm mới mỗi 15 giây để đảm bảo thời gian thực

    const timer = setInterval(() => {

      loadData();

    }, 30000);



    return () => {

      window.removeEventListener('gvai_gradebook_updated', handleGradebookUpdate);

      window.removeEventListener('storage', handleGradebookUpdate);

      clearInterval(timer);

    };

  }, [loadData]);



  // Đồng bộ lớp mặc định của học sinh nếu có

  useEffect(() => {

    if (defaultClassName) {

      setSelectedClass(defaultClassName);

    }

    if (defaultGrade) {

      setSelectedGrade(defaultGrade);

    }

  }, [defaultClassName, defaultGrade]);



  // Danh sách các học sinh THỰC TẾ ĐÃ THAM GIA HỌC (1 kiểu thống nhất trên toàn hệ thống)

  const actualStudyingStudents = useMemo(() => {

    return leaderboard.filter(s => s.isActuallyStudying || s.hasEntered || (s.totalMeritPoints && s.totalMeritPoints > 15) || (s.testsCount && s.testsCount > 0));

  }, [leaderboard]);



  // Danh sách hiển thị theo chế độ lọc (Mặc định: 1 kiểu thống nhất cho học sinh đã học thực tế)

  const targetLeaderboard = useMemo(() => {

    return onlyActiveStudents ? actualStudyingStudents : leaderboard;

  }, [onlyActiveStudents, actualStudyingStudents, leaderboard]);



  // Học sinh đứng Top 1, Top 2, Top 3 (Ưu tiên học sinh đã học thực tế)

  const top1Student = targetLeaderboard[0];

  const top2Student = targetLeaderboard[1];

  const top3Student = targetLeaderboard[2];



  // Thống kê tổng quan chung theo phạm vi hiện tại

  const statsOverview = useMemo(() => {

    const total = attendanceReport ? attendanceReport.totalRoster : leaderboard.length;

    const entered = attendanceReport ? attendanceReport.enteredCount : actualStudyingStudents.length;

    const percent = total > 0 ? Math.round((entered / total) * 100) : 0;

    const avgScore = targetLeaderboard.length > 0 

      ? Math.round((targetLeaderboard.reduce((acc, s) => acc + s.averageScore, 0) / targetLeaderboard.length) * 10) / 10 

      : 0;

    const highestScore = targetLeaderboard.length > 0 ? Math.max(...targetLeaderboard.map(s => s.highestScore)) : 0;

    const totalMeritSum = targetLeaderboard.reduce((acc, s) => acc + s.totalMeritPoints, 0);



    return {

      total,

      entered,

      notEntered: total - entered,

      percent,

      avgScore,

      highestScore,

      totalMeritSum

    };

  }, [attendanceReport, leaderboard, actualStudyingStudents, targetLeaderboard]);



  // Lọc danh sách bảng xếp hạng theo tìm kiếm và chế độ lọc thống nhất

  const filteredLeaderboard = useMemo(() => {

    let list = targetLeaderboard;

    if (searchQuery.trim()) {

      const q = searchQuery.toLowerCase().trim();

      list = list.filter(s => 

        s.studentName.toLowerCase().includes(q) ||

        s.studentCode.toLowerCase().includes(q) ||

        s.className.toLowerCase().includes(q)

      );

    }

    return list;

  }, [targetLeaderboard, searchQuery]);



  // Lọc danh sách sổ điểm danh (đồng bộ chuẩn 100% với chế độ lọc học sinh thực tế đã học)

  const filteredAttendanceStudents = useMemo(() => {

    if (!attendanceReport) return [];

    return attendanceReport.students.filter(s => {

      if (onlyActiveStudents && !s.hasEntered) return false;

      if (attendanceStatusFilter === 'entered' && !s.hasEntered) return false;

      if (attendanceStatusFilter === 'not_entered' && s.hasEntered) return false;

      if (searchQuery.trim()) {

        const q = searchQuery.toLowerCase().trim();

        return (

          s.name.toLowerCase().includes(q) ||

          s.studentCode.toLowerCase().includes(q) ||

          s.className.toLowerCase().includes(q)

        );

      }

      return true;

    });

  }, [attendanceReport, onlyActiveStudents, attendanceStatusFilter, searchQuery]);



  // XỬ LÝ MỞ HỘP QUÀ MAY MẮN CỦA THẦY ĐINH THÀNH

  const handleOpenLuckyBox = (studentId?: string) => {

    const targetId = studentId || activeStudent?.id || targetLeaderboard[0]?.studentId;

    if (!targetId) {

      showToast('⚠️ Vui lòng chọn hoặc đăng nhập một học sinh để mở hộp quà may mắn!');

      return;

    }

    setLuckyBoxTargetStudentId(targetId);

    const res = studentGradebookService.openTeacherLuckyBox(targetId);

    setLuckyBoxResult(res);

    setShowLuckyBoxModal(true);

    if (!res.alreadyOpenedToday) {

      launchFireworks(5000);

      showToast(`🎁 Chúc mừng em đã mở hộp quà may mắn và nhận +${res.pointsWon} điểm thi đua!`);

    }

    loadData();

  };



  // XỬ LÝ THƯỞNG ĐIỂM TÍCH CỰC

  const handleOpenBonusModal = (studentId?: string) => {

    if (studentId) {

      setBonusStudentId(studentId);

    } else if (activeStudent) {

      setBonusStudentId(activeStudent.id);

    } else if (leaderboard.length > 0) {

      setBonusStudentId(leaderboard[0].studentId);

    }

    setShowBonusModal(true);

  };



  const handleSubmitBonus = () => {

    if (!bonusStudentId) {

      alert('Vui lòng chọn học sinh được khen thưởng!');

      return;

    }

    const res = studentGradebookService.awardTeacherBonus(

      bonusStudentId,

      bonusPoints,

      bonusReason.trim() || 'Học tập tích cực & nỗ lực rèn luyện',

      'Thầy Đinh Văn Thành'

    );

    if (res.success) {

      triggerConfetti();

      showToast(res.message);

      setShowBonusModal(false);

      loadData();

    } else {

      alert(res.message);

    }

  };



  // XUẤT EXCEL / CSV CHUẨN UTF-8 BOM

  const handleExportCSV = () => {

    const scopeName = scopeFilter === 'all' 

      ? 'Toan_Truong' 

      : (scopeFilter === 'grade' ? `Khoi_${selectedGrade}` : `Lop_${selectedClass}`);

    

    let csvContent = '\uFEFF'; // BOM UTF-8 để mở Excel không lỗi font tiếng Việt

    csvContent += `BẢNG THỐNG KÊ ĐIỂM THI ĐUA & BẢNG VÀNG HỌC SINH - ${scopeName.toUpperCase()}\n`;

    csvContent += `Đơn vị: Trường THCS Đồng Yên - Giáo viên phụ trách: Thầy Đinh Văn Thành (0915.213717)\n`;

    csvContent += `Thời điểm xuất thống kê: ${new Date().toLocaleString('vi-VN')}\n\n`;



    csvContent += 'Hạng,Mã HS,Họ và Tên,Lớp,Cấp Độ,Danh Hiệu,Chuyên Cần,Từ Vựng,Đề Cương,Điểm Thi GK/CK,Thời Gian,Điểm Thưởng,Tổng Điểm Thi Đua,Điểm TB Bài Thi,Điểm Cao Nhất,Số Bài Đã Làm\n';



    leaderboard.forEach(item => {

      const lvl = item.levelInfo?.title || 'Tân Binh';

      const crown = item.rank === 1 ? 'Quán Quân Vàng 👑' : (item.rank === 2 ? 'Á Quân Bạc 🥈' : (item.rank === 3 ? 'Quý Quân Đồng 🥉' : ''));

      const badgesStr = item.badges.join(' | ');

      const row = [

        item.rank,

        `"${item.studentCode}"`,

        `"${item.studentName}"`,

        item.className,

        `"${lvl}"`,

        `"${crown ? crown + ' - ' + badgesStr : badgesStr}"`,

        item.attendancePoints || 0,

        item.vocabPoints || 0,

        item.practicePoints || 0,

        item.examBonusPoints || 0,

        item.timePoints || 0,

        (item.encouragementBonus || 15) + (item.teacherBonus || 0),

        item.totalMeritPoints,

        item.averageScore,

        item.highestScore,

        item.testsCount

      ].join(',');

      csvContent += row + '\n';

    });



    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;

    link.setAttribute('download', `Bang_Thong_Ke_Thi_Dua_${scopeName}_${new Date().toISOString().slice(0, 10)}.csv`);

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    showToast('🎉 Đã xuất thành công bảng thống kê Excel/CSV!');

  };



  // SAO CHÉP BÁO CÁO GỬI ZALO NHÓM LỚP / TOÀN TRƯỜNG

  const handleCopyZaloReport = () => {

    const scopeTitle = scopeFilter === 'all' 

      ? 'TOÀN TRƯỜNG THCS ĐỒNG YÊN' 

      : (scopeFilter === 'grade' ? `KHỐI ${selectedGrade}` : `LỚP ${selectedClass}`);

    

    const timeStr = `⏰ Cập nhật lúc: ${new Date().toLocaleTimeString('vi-VN')} ngày ${new Date().toLocaleDateString('vi-VN')}`;

    const header = `🏆 BẢNG VÀNG THI ĐUA & THỐNG KÊ HỌC TẬP TRỰC TUYẾN — ${scopeTitle}\n${timeStr}\n👨‍🏫 Phụ trách: Thầy Đinh Văn Thành (0915.213717)\n`;

    

    const statsStr = `📊 TỔNG QUAN HỌC TẬP:

• Sĩ số: ${statsOverview.total} học sinh

• Đã vào ôn tập: ${statsOverview.entered}/${statsOverview.total} em (Đạt ${statsOverview.percent}%)

• Điểm thi cao nhất: ${statsOverview.highestScore}/10đ

• Điểm trung bình bộ môn: ${statsOverview.avgScore}/10đ\n`;



    const top5 = leaderboard.slice(0, 5);

    const topStr = `👑 TOP 5 GƯƠNG MẶT XUẤT SẮC DẪN ĐẦU:

${top5.map((s, idx) => {

  const icon = idx === 0 ? '👑 #1' : (idx === 1 ? '🥈 #2' : (idx === 2 ? '🥉 #3' : `⭐ #${idx + 1}`));

  return `${icon}. ${s.studentName} (${s.className}) — ${s.totalMeritPoints}đ thi đua [${s.levelInfo?.title || 'Tân Binh'}] (Điểm TB: ${s.averageScore}/10đ)`;

}).join('\n')}\n`;



    let missingStr = '';

    if (attendanceReport) {

      const missing = attendanceReport.students.filter(s => !s.hasEntered);

      if (missing.length > 0) {

        missingStr = `📢 KÍNH NHỜ PHỤ HUYNH ĐÔN ĐỐC (${missing.length} em chưa vào ôn bài):

${missing.slice(0, 15).map((s, i) => `${i + 1}. ${s.name} (${s.className})`).join(', ')}${missing.length > 15 ? `... và ${missing.length - 15} bạn khác.` : '.'}\n\n`;

      } else {

        missingStr = `🎉 Tuyệt vời! 100% học sinh đã vào học đầy đủ!\n\n`;

      }

    }



    const footer = `👉 Link Cổng Học Tiếng Anh Trực Tuyến: https://dekiemtraso.com

(Học sinh chọn đúng Tên và Lớp là vào ôn từ vựng & luyện đề ngay, không cần mật khẩu)`;



    const fullMessage = [header, statsStr, topStr, missingStr, footer].join('\n');

    navigator.clipboard.writeText(fullMessage);

    showToast('📋 Đã sao chép báo cáo Zalo! Thầy Cô có thể dán ngay vào nhóm phụ huynh.');

  };



  // IN BẢNG VÀNG SƯ PHẠM

  const handlePrint = () => {

    window.print();

  };



  return (

    <div className="space-y-5">

      {/* =========================================================================

          BANNER TRUNG TÂM THỐNG KÊ & BẢNG VÀNG THỜI GIAN THỰC

          Thiết kế chuẩn Sư phạm Sang Trọng, Thống nhất 1 chức năng duy nhất

          ========================================================================= */}

      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl border-2 border-blue-500/30 relative overflow-hidden">

        {/* Nền ánh sáng rực rỡ */}

        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>



        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">

          <div className="space-y-1.5">

            <div className="flex items-center gap-2 flex-wrap">

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-400/30">

                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>

                <span>Thời Gian Thực (Real-Time)</span>

              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold border border-blue-400/30">

                <Clock className="w-3.5 h-3.5 text-blue-300" />

                <span>Cập nhật lúc: {lastUpdatedTime || 'Vừa xong'}</span>

              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-200 text-xs font-bold border border-amber-400/30">

                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />

                <span>Minh Bạch 100%</span>

              </span>

            </div>



            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">

              <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400 drop-shadow-md" />

              <span>Trung Tâm Thống Kê & Bảng Vàng Thi Đua Toàn Năng</span>

            </h2>



            <p className="text-xs sm:text-sm text-blue-200/90 max-w-3xl leading-relaxed">

              Hệ thống theo dõi tiến độ, vinh danh cấp bậc học sinh, tự động tính điểm chuyên cần, từ vựng 3D, đề cương và bài thi. Cập nhật liên tục từng giây cho học sinh và giáo viên Trường THCS Đồng Yên.

            </p>

          </div>



          {/* Các nút tác vụ nhanh */}

          <div className="flex items-center gap-2 flex-wrap shrink-0">

            <button

              type="button"

              onClick={() => handleOpenBonusModal()}

              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition flex items-center gap-1.5 cursor-pointer"

              title="Giáo viên thưởng thêm điểm thi đua cho học sinh tích cực"

            >

              <Gift className="w-4 h-4 text-slate-950" />

              <span>Thưởng Điểm Tích Cực</span>

            </button>



            <button

              type="button"

              onClick={handleCopyZaloReport}

              className="px-3 py-2 rounded-xl bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm border border-blue-400/30 transition flex items-center gap-1.5 cursor-pointer"

              title="Sao chép báo cáo kết quả gửi Zalo lớp"

            >

              <Copy className="w-4 h-4 text-blue-200" />

              <span>Sao Chép Zalo</span>

            </button>



            <button

              type="button"

              onClick={handleExportCSV}

              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"

              title="Xuất bảng Excel/CSV danh sách học sinh"

            >

              <Download className="w-4 h-4 text-emerald-400" />

              <span>Xuất Excel</span>

            </button>



            <button

              type="button"

              onClick={loadData}

              disabled={isRefreshing}

              className="px-3.5 py-2 rounded-xl bg-indigo-600/90 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm border border-indigo-400/40 shadow-md transition flex items-center gap-1.5 cursor-pointer"

              title="Đồng bộ dữ liệu học sinh & điểm số mới nhất từ Cloud"

            >

              <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-300' : 'text-blue-200'}`} />

              <span>{isRefreshing ? 'Đang Tải Cloud...' : 'Đồng Bộ Cloud'}</span>

            </button>

          </div>

        </div>



        {/* ==================== 4 THẺ THỐNG KÊ CHỈ SỐ NHANH ==================== */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-5 border-t border-white/10">

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-3.5 border border-white/10">

            <div className="flex items-center justify-between text-blue-200 text-xs font-semibold mb-1">

              <span>Sĩ Số & Tỷ Lệ Vào Học</span>

              <Users className="w-4 h-4 text-blue-300" />

            </div>

            <div className="flex items-baseline gap-2">

              <span className="text-xl sm:text-2xl font-black text-white">{statsOverview.entered}/{statsOverview.total}</span>

              <span className="text-xs font-black px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">

                {statsOverview.percent}%

              </span>

            </div>

            <div className="w-full bg-slate-700/60 rounded-full h-1.5 mt-2 overflow-hidden">

              <div 

                className="bg-gradient-to-r from-emerald-400 to-teal-400 h-1.5 rounded-full transition-all duration-500"

                style={{ width: `${Math.min(100, statsOverview.percent)}%` }}

              ></div>

            </div>

          </div>



          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-3.5 border border-white/10">

            <div className="flex items-center justify-between text-amber-200 text-xs font-semibold mb-1">

              <span>Quán Quân Dẫn Đầu</span>

              <CrownIcon className="w-4 h-4 text-amber-300" />

            </div>

            <div className="truncate text-base sm:text-lg font-black text-amber-300">

              {top1Student ? top1Student.studentName : 'Đang cập nhật...'}

            </div>

            <div className="text-[11px] text-amber-100/80 truncate">

              {top1Student ? `${top1Student.className} — ${top1Student.totalMeritPoints} điểm thi đua` : 'Chưa có dữ liệu'}

            </div>

          </div>



          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-3.5 border border-white/10">

            <div className="flex items-center justify-between text-emerald-200 text-xs font-semibold mb-1">

              <span>Điểm Thi Cao Nhất</span>

              <Star className="w-4 h-4 text-emerald-300" />

            </div>

            <div className="text-xl sm:text-2xl font-black text-white">

              {statsOverview.highestScore}/10đ

            </div>

            <div className="text-[11px] text-emerald-200/80">

              Điểm TB bộ môn: {statsOverview.avgScore}/10đ

            </div>

          </div>



          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-3.5 border border-white/10">

            <div className="flex items-center justify-between text-purple-200 text-xs font-semibold mb-1">

              <span>Hệ Thống Cấp Bậc</span>

              <Sparkles className="w-4 h-4 text-purple-300" />

            </div>

            <div className="text-base sm:text-lg font-black text-purple-200 flex items-center gap-1.5">

              <span>7 Cấp Bậc Sư Phạm</span>

            </div>

            <button

              type="button"

              onClick={() => setShowLevelGuideModal(true)}

              className="text-[11px] text-purple-300 hover:text-white underline cursor-pointer"

            >

              Xem thể lệ phong vương miện & cấp độ

            </button>

          </div>

        </div>

      </div>



      {/* =========================================================================

          CÔNG THỨC TÍNH ĐIỂM CÔNG KHAI MINH BẠCH (GHI RÕ RÀNG KHÔNG MẬP MỜ)

          ========================================================================= */}

      <div className="bg-blue-50/80 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700 rounded-2xl p-3 sm:p-4 text-xs text-slate-700 dark:text-slate-300">

        {/* KHUNG CÔNG BỐ CHÍNH THỨC CHƯƠNG TRÌNH KHUYẾN MẠI THEO NGÀY */}
        <div className="mb-3 p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-indigo-500/15 border-2 border-amber-400/50 dark:border-amber-500/30 shadow-xs">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                {loginReward.promoBadge || '🎁 CHƯƠNG TRÌNH KHUYẾN MẠI'}
              </span>
              <span className="text-xs font-black text-amber-950 dark:text-amber-200">
                📅 {loginReward.dateDisplay}
              </span>
              <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800">
                ⏰ {loginReward.expiresAtDisplay}
              </span>
            </div>
            <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
              ✓ Hết 24:00 Tự Động Hủy &amp; Cập Nhật Mới
            </span>
          </div>
          <h5 className="text-sm font-black text-slate-900 dark:text-white mt-1.5">
            {loginReward.title}
          </h5>
          <p className="text-slate-600 dark:text-slate-300 text-xs font-medium mt-0.5">
            {loginReward.bannerText}
          </p>
          {loginReward.bonusRules && loginReward.bonusRules.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mt-2">
              {loginReward.bonusRules.map((r, i) => (
                <span key={i} className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 bg-white/80 dark:bg-slate-900/80 px-2.5 py-0.5 rounded-lg border border-amber-300/40 shadow-2xs">
                  {r}
                </span>
              ))}
            </div>
          )}
          {loginReward.nextDayPromoPreview && (
            <p className="text-rose-600 dark:text-rose-400 font-black mt-2 text-xs flex items-center gap-1 bg-white/60 dark:bg-slate-900/60 p-2 rounded-xl border border-rose-200 dark:border-rose-900">
              <span>🔔</span>
              <span>{loginReward.nextDayPromoPreview}</span>
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap font-bold mb-2 text-blue-900 dark:text-blue-300">
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Quy Chuẩn Tính Điểm Thi Đua Tự Động &amp; Công Khai Minh Bạch:</span>
          </span>
          <span className="text-[11px] text-slate-500">Cộng trực tiếp vào Điểm Tổng</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 text-[11px]">

          <div className={`p-2 rounded-xl border relative overflow-hidden transition-all ${

            loginReward.isPromoToday 

              ? 'bg-amber-50/90 dark:bg-amber-950/50 border-amber-400 dark:border-amber-600 shadow-xs' 

              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'

          }`}>

            {loginReward.isPromoToday && (

              <span className="absolute top-0 right-0 text-[8px] px-1 bg-rose-600 text-white font-black rounded-bl tracking-wider">HÔM NAY</span>

            )}

            <div className={`font-black ${loginReward.isPromoToday ? 'text-amber-700 dark:text-amber-300' : 'text-blue-600'}`}>

              {loginReward.isPromoToday ? `🎁 Chuyên Cần (+${loginReward.points}đ)` : '📅 Chuyên Cần'}

            </div>

            <div className={loginReward.isPromoToday ? 'text-amber-800 dark:text-amber-200 font-bold' : 'text-slate-500'}>

              {loginReward.isPromoToday ? `+${loginReward.points}đ lần đầu đăng nhập` : '+5 điểm / ngày đăng nhập'}

            </div>

          </div>

          <div className="p-2 rounded-xl bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 dark:from-rose-950/40 dark:via-amber-950/40 dark:to-orange-950/40 border border-rose-300 dark:border-rose-700 shadow-2xs">

            <div className="font-black text-rose-600 dark:text-rose-400 flex items-center gap-1">

              <span>🎆 Pháo Hoa (+20đ)</span>

            </div>

            <div className="text-slate-600 dark:text-slate-300 font-bold">

              Học hôm qua &amp; quay lại hôm nay

            </div>

          </div>

          <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">

            <div className="font-bold text-indigo-600">🧠 Từ Vựng 3D</div>

            <div className="text-slate-500 font-semibold">

              {loginReward.vocabMultiplier > 1 

                ? `+${loginReward.vocabPointsPerUnit}đ / Unit (x${loginReward.vocabMultiplier} ĐIỂM)` 

                : '+10 điểm / Unit (Tăng 35%)'}

            </div>

          </div>

          <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">

            <div className="font-bold text-teal-600">📚 Đề Cương & Bài Tập</div>

            <div className="text-slate-500">+10 điểm / phần hoàn thành</div>

          </div>

          <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">

            <div className="font-bold text-amber-600">📝 Bài Thi GK/CK</div>

            <div className="text-slate-500">Điểm thi x 10 (VD: 9.5đ ➔ +95đ)</div>

          </div>

          <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">

            <div className="font-bold text-rose-600">⏳ Học Thực Tế Có Tương Tác</div>

            <div className="text-slate-500 font-semibold">+3 điểm / mỗi 10 phút cộng dồn</div>

            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">Chống treo máy: tự ngưng khi rời tab</div>

          </div>

          <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">

            <div className="font-bold text-purple-600">⭐ Thưởng Tích Cực</div>

            <div className="text-slate-500">+15đ khởi động &amp; Thầy khen</div>

          </div>

        </div>



        {/* BANNER THÔNG BÁO CHÍNH SÁCH KHUYẾN MẠI THI ĐUA HÔM NAY VÀ NGÀY MAI */}

        <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">

          <div className="flex items-center gap-2">

            <span className="text-xl shrink-0">🔥</span>

            <div>

              <span className="font-black text-amber-800 dark:text-amber-200">{loginReward.title}</span>

              {loginReward.nextDayPromoPreview && (

                <span className="block text-[11px] text-rose-600 dark:text-rose-400 font-bold mt-0.5">

                  {loginReward.nextDayPromoPreview}

                </span>

              )}

            </div>

          </div>

          <div className="flex items-center gap-2 shrink-0">

            <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black text-[11px]">

              Học 1-2 bài từ vựng ➔ Tăng ngay 35% - 70%

            </span>

          </div>

        </div>

      </div>



      {/* =========================================================================

          THANH ĐIỀU HƯỚNG ĐỒNG NHẤT 1 CHỨC NĂNG DUY NHẤT & BỘ LỌC THỐNG KÊ

          ========================================================================= */}

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">

          {/* 3 Tab chính của phân hệ thống kê duy nhất */}

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 w-fit text-xs font-black">

            <button

              type="button"

              onClick={() => setActiveTab('leaderboard')}

              className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${

                activeTab === 'leaderboard'

                  ? 'bg-blue-600 text-white shadow-xs'

                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'

              }`}

            >

              <Trophy className="w-4 h-4 text-amber-400" />

              <span>👑 Bảng Vàng &amp; Thi Đua</span>

            </button>

            <button

              type="button"

              onClick={() => setActiveTab('attendance')}

              className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${

                activeTab === 'attendance'

                  ? 'bg-blue-600 text-white shadow-xs'

                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'

              }`}

            >

              <BarChart3 className="w-4 h-4 text-emerald-400" />

              <span>📊 Sổ Điểm &amp; % Vào Học Chuẩn</span>

            </button>

            <button

              type="button"

              onClick={() => setActiveTab('live_feed')}

              className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${

                activeTab === 'live_feed'

                  ? 'bg-blue-600 text-white shadow-xs'

                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'

              }`}

            >

              <Activity className="w-4 h-4 text-rose-400" />

              <span>⚡ Nhật Ký Thời Gian Thực</span>

            </button>

          </div>



          {/* Ô tìm kiếm học sinh nhanh */}

          <div className="relative w-full md:w-64">

            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <input

              type="text"

              value={searchQuery}

              onChange={(e) => setSearchQuery(e.target.value)}

              placeholder="Tìm theo tên hoặc mã HS..."

              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"

            />

          </div>

        </div>



        {/* ==================== BỘ LỌC PHẠM VI (TOÀN TRƯỜNG / THEO KHỐI / THEO LỚP) ==================== */}

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">

          <div className="flex items-center gap-2 flex-wrap">

            <span className="font-bold text-slate-500 flex items-center gap-1">

              <Filter className="w-3.5 h-3.5" />

              <span>Phạm vi:</span>

            </span>



            {/* 1. Nút Toàn Trường */}

            <button

              type="button"

              onClick={() => {

                setScopeFilter('all');

              }}

              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${

                scopeFilter === 'all'

                  ? 'bg-blue-600 text-white shadow-xs'

                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'

              }`}

            >

              🏫 Toàn Trường THCS Đồng Yên

            </button>



            {/* 2. Các Khối Lớp 6, 7, 8, 9 */}

            {[6, 7, 8, 9].map(g => (

              <button

                key={g}

                type="button"

                onClick={() => {

                  setSelectedGrade(g);

                  setScopeFilter('grade');

                }}

                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${

                  scopeFilter === 'grade' && selectedGrade === g

                    ? 'bg-indigo-600 text-white shadow-xs'

                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'

                }`}

              >

                Khối {g}

              </button>

            ))}



            {/* 3. Dropdown chọn từng Lớp Cụ Thể */}

            <select

              value={scopeFilter === 'class' ? selectedClass : ''}

              onChange={(e) => {

                if (e.target.value) {

                  setSelectedClass(e.target.value);

                  setScopeFilter('class');

                }

              }}

              className={`px-3 py-1.5 rounded-lg font-bold border transition cursor-pointer ${

                scopeFilter === 'class'

                  ? 'bg-emerald-600 text-white border-emerald-500'

                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'

              }`}

            >

              <option value="" disabled>--- Chọn Lớp Cụ Thể ---</option>

              {officialClasses.map(c => (

                <option key={c.name} value={c.name}>

                  Lớp {c.name} ({c.totalStudents} học sinh)

                </option>

              ))}

            </select>



            {/* 4. CHẾ ĐỘ THỐNG KÊ 1 KIỂU THỐNG NHẤT: HỌC SINH THỰC TẾ ĐÃ VÀO HỌC */}

            <div className="flex items-center gap-1 bg-slate-200/90 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-300 dark:border-slate-700">

              <button

                type="button"

                onClick={() => setOnlyActiveStudents(true)}

                className={`px-3 py-1 rounded-md text-[11px] font-black transition flex items-center gap-1 cursor-pointer ${

                  onlyActiveStudents

                    ? 'bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-400'

                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'

                }`}

                title="Chỉ hiển thị các em học sinh THỰC TẾ ĐÃ THAM GIA HỌC (có điểm danh, làm bài, từ vựng, thời gian học)"

              >

                <CheckCircle2 className="w-3 h-3 text-emerald-200" />

                <span>🎯 Học Sinh Đã Học ({actualStudyingStudents.length})</span>

              </button>

              <button

                type="button"

                onClick={() => setOnlyActiveStudents(false)}

                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${

                  !onlyActiveStudents

                    ? 'bg-blue-600 text-white shadow-xs'

                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'

                }`}

                title="Xem toàn bộ danh bạ cả trường bao gồm cả những em chưa vào học"

              >

                <span>📋 Toàn Bộ ({attendanceReport ? attendanceReport.totalRoster : leaderboard.length})</span>

              </button>

            </div>

          </div>



          {/* Tiêu chí sắp xếp bảng xếp hạng (chỉ hiển thị ở tab Bảng Vàng) */}

          {activeTab === 'leaderboard' && (

            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">

              <span className="text-[11px] text-slate-500 font-bold px-1">Sắp xếp:</span>

              <button

                type="button"

                onClick={() => setSortBy('merit')}

                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${

                  sortBy === 'merit'

                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'

                    : 'text-slate-500'

                }`}

              >

                ⭐ Điểm Thi Đua Tổng

              </button>

              <button

                type="button"

                onClick={() => setSortBy('score')}

                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${

                  sortBy === 'score'

                    ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-300 shadow-xs'

                    : 'text-slate-500'

                }`}

              >

                📝 Điểm Bài Thi

              </button>

            </div>

          )}

        </div>

      </div>



      {/* =========================================================================

          TAB 1: BẢNG VÀNG THI ĐUA & XẾP HẠNG HỌC SINH (LEVEL & VƯƠNG MIỆN)

          ========================================================================= */}

      {activeTab === 'leaderboard' && (

        <div className="space-y-4">

          {/* BỤC VINH DANH TOP 3 HỌC SINH QUÁN QUÂN, Á QUÂN, QUÝ QUÂN (PODIUM 3D) */}

          {leaderboard.length >= 3 && !searchQuery && (

            <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-5 rounded-3xl border border-slate-800 shadow-lg">

              <div className="text-center mb-4">

                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-black uppercase tracking-wider border border-amber-400/30">

                  <CrownIcon className="w-3.5 h-3.5 text-amber-300" />

                  <span>Bục Vinh Danh Top 3 Dẫn Đầu</span>

                </span>

                <h3 className="text-lg font-black text-white mt-1">

                  Gương Mặt Xuất Sắc — {scopeFilter === 'all' ? 'Toàn Trường THCS Đồng Yên' : (scopeFilter === 'grade' ? `Khối ${selectedGrade}` : `Lớp ${selectedClass}`)}

                </h3>

              </div>



              <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto items-end pt-4">

                {/* TOP 2 - Á QUÂN BẠC */}

                {top2Student && (

                  <div className="flex flex-col items-center order-1">

                    <div className="relative">

                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-slate-400 to-slate-200 p-0.5 shadow-lg flex items-center justify-center font-black text-slate-800 text-lg">

                        {top2Student.gender === 'Nữ' ? '👧' : '👦'}

                      </div>

                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl drop-shadow">

                        🥈

                      </span>

                    </div>

                    <div className="mt-2 text-center">

                      <div className="text-xs sm:text-sm font-black text-slate-200 truncate max-w-[100px] sm:max-w-[130px]">

                        {top2Student.studentName}

                      </div>

                      <div className="text-[10px] text-slate-400">{top2Student.className}</div>

                      <div className="inline-block mt-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 text-[10px] font-black border border-slate-700">

                        {top2Student.totalMeritPoints}đ

                      </div>

                    </div>

                    <div className="w-full bg-gradient-to-t from-slate-800 to-slate-700 h-20 rounded-t-2xl mt-2 flex items-center justify-center font-black text-slate-300 text-xl border-t border-slate-600">

                      2

                    </div>

                  </div>

                )}



                {/* TOP 1 - QUÁN QUÂN VÀNG (CAO NHẤT) */}

                {top1Student && (

                  <div className="flex flex-col items-center order-2 -mt-4">

                    <div className="relative">

                      <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 p-1 shadow-2xl flex items-center justify-center font-black text-slate-900 text-2xl ring-4 ring-amber-400/30 animate-pulse">

                        {top1Student.gender === 'Nữ' ? '👸' : '🤴'}

                      </div>

                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-3xl drop-shadow-lg animate-bounce">

                        👑

                      </span>

                    </div>

                    <div className="mt-2 text-center">

                      <div className="text-sm sm:text-base font-black text-amber-300 truncate max-w-[120px] sm:max-w-[160px]">

                        {top1Student.studentName}

                      </div>

                      <div className="text-xs text-amber-100 font-bold">{top1Student.className}</div>

                      <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow-sm">

                        {top1Student.totalMeritPoints} Điểm

                      </div>

                    </div>

                    <div className="w-full bg-gradient-to-t from-amber-600 to-amber-500 h-28 rounded-t-2xl mt-2 flex items-center justify-center font-black text-slate-950 text-3xl border-t-2 border-yellow-300 shadow-lg">

                      1

                    </div>

                  </div>

                )}



                {/* TOP 3 - QUÝ QUÂN ĐỒNG */}

                {top3Student && (

                  <div className="flex flex-col items-center order-3">

                    <div className="relative">

                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-700 to-amber-600 p-0.5 shadow-lg flex items-center justify-center font-black text-amber-100 text-lg">

                        {top3Student.gender === 'Nữ' ? '👧' : '👦'}

                      </div>

                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl drop-shadow">

                        🥉

                      </span>

                    </div>

                    <div className="mt-2 text-center">

                      <div className="text-xs sm:text-sm font-black text-amber-200 truncate max-w-[100px] sm:max-w-[130px]">

                        {top3Student.studentName}

                      </div>

                      <div className="text-[10px] text-amber-300/80">{top3Student.className}</div>

                      <div className="inline-block mt-1 px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 text-[10px] font-black border border-amber-900/50">

                        {top3Student.totalMeritPoints}đ

                      </div>

                    </div>

                    <div className="w-full bg-gradient-to-t from-amber-900 to-amber-800 h-16 rounded-t-2xl mt-2 flex items-center justify-center font-black text-amber-200 text-lg border-t border-amber-700">

                      3

                    </div>

                  </div>

                )}

              </div>

            </div>

          )}



          {/* DANH SÁCH BẢNG XẾP HẠNG CHI TIẾT */}

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">

            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">

              <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">

                <GraduationCap className="w-4 h-4 text-blue-600" />

                <span>Bảng Thi Đua Chi Tiết ({filteredLeaderboard.length} học sinh)</span>

              </h4>

              <div className="flex items-center gap-2 flex-wrap">

                {/* Đã khóa nút Hộp Quà theo chỉ đạo của Thầy Đinh Thành */}

                <button

                  type="button"

                  onClick={() => {

                    launchFireworks(5000);

                    showToast('🎆 Bắn pháo hoa rực rỡ ăn mừng tinh thần học tập chăm chỉ của các em học sinh!');

                  }}

                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 via-amber-500 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-white font-black text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition active:scale-95"

                  title="Bắn pháo hoa rực rỡ ăn mừng thành tích học tập chăm chỉ của học sinh"

                >

                  <span>🎆</span>

                  <span>Pháo Hoa Ăn Mừng</span>

                </button>

                <button

                  type="button"

                  onClick={handleAuditAndRestorePoints}

                  disabled={isRefreshing}

                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition active:scale-95 disabled:opacity-50"

                  title="Tự động rà soát đối chiếu toàn bộ bài làm, bài thi giữa kỳ và lịch sử học tập thực tế từ hôm qua đến nay để khôi phục đầy đủ điểm số cho học sinh"

                >

                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />

                  <span>🛡️ Khôi Phục Điểm Thực Tế</span>

                </button>

                <button

                  type="button"

                  onClick={loadData}

                  disabled={isRefreshing}

                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1 cursor-pointer transition"

                  title="Làm mới bảng thống kê thời gian thực"

                >

                  <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />

                  <span>Làm mới</span>

                </button>

                <span className="text-xs text-slate-500 hidden md:inline">Bấm vào từng học sinh để xem bảng kê chi tiết</span>

              </div>

            </div>



            <div className="overflow-x-auto">

              <table className="w-full text-left text-xs border-collapse">

                <thead>

                  <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">

                    <th className="py-3 px-3 text-center w-14">Hạng</th>

                    <th className="py-3 px-3">Học Sinh</th>

                    <th className="py-3 px-3 text-center">Lớp</th>

                    <th className="py-3 px-3 text-center">Tiến Độ Học</th>

                    <th className="py-3 px-3 text-center">Cấp Độ (Level)</th>

                    <th className="py-3 px-3 text-center">Điểm Thi Đua</th>

                    <th className="py-3 px-3 text-center">Điểm Bài Thi</th>

                    <th className="py-3 px-3">Danh Hiệu &amp; Huy Hiệu</th>

                    <th className="py-3 px-3 text-center">Thao Tác</th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                  {filteredLeaderboard.map((item) => {

                    const isMyRow = activeStudent && activeStudent.id === item.studentId;

                    const lvl = item.levelInfo || calculateStudentLevel(item.totalMeritPoints, item.rank);

                    const isTop1 = item.rank === 1;

                    const isTop2 = item.rank === 2;

                    const isTop3 = item.rank === 3;



                    return (

                      <tr

                        key={item.studentId}

                        onClick={() => setSelectedStudentDetail(item)}

                        className={`hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition cursor-pointer ${

                          isMyRow ? 'bg-amber-50/70 dark:bg-amber-950/20 font-bold' : ''

                        } ${isTop1 ? 'bg-amber-50/40 dark:bg-amber-950/10' : ''}`}

                      >

                        {/* 1. Hạng */}

                        <td className="py-3 px-3 text-center">

                          {isTop1 ? (

                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black shadow-sm text-sm">

                              👑

                            </span>

                          ) : isTop2 ? (

                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-slate-900 font-black shadow-sm text-sm">

                              🥈

                            </span>

                          ) : isTop3 ? (

                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700 text-white font-black shadow-sm text-sm">

                              🥉

                            </span>

                          ) : (

                            <span className="font-bold text-slate-500">#{item.rank}</span>

                          )}

                        </td>



                        {/* 2. Họ và Tên */}

                        <td className="py-3 px-3">

                          <div className="flex items-center gap-2">

                            <span className="text-base">{item.gender === 'Nữ' ? '👧' : '👦'}</span>

                            <div>

                              <div className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">

                                <span>{item.studentName}</span>

                                {isMyRow && (

                                  <span className="px-1.5 py-0.2 rounded-md bg-blue-600 text-white text-[10px] font-black">

                                    Em

                                  </span>

                                )}

                              </div>

                              <div className="text-[11px] text-slate-400">{item.studentCode}</div>

                            </div>

                          </div>

                        </td>



                        {/* 3. Lớp */}

                        <td className="py-3 px-3 text-center font-bold text-slate-700 dark:text-slate-300">

                          {item.className}

                        </td>



                        {/* 4. Tiến Độ Học Tập & Bài Từ Vựng (1 bài = 35%, 2 bài = 70%) */}

                        <td className="py-3 px-3 text-center">

                          <div className="inline-flex flex-col items-center">

                            <span className="font-black text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">

                              <span>📈</span>

                              <span>{item.studyProgressPercent || 0}%</span>

                            </span>

                            <div className="w-20 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-1 overflow-hidden">

                              <div

                                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full transition-all duration-500"

                                style={{ width: `${item.studyProgressPercent || 0}%` }}

                              ></div>

                            </div>

                            <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 font-semibold">

                              {item.vocabUnitsCount && item.vocabUnitsCount > 0 

                                ? `${item.vocabUnitsCount} bài từ vựng` 

                                : 'Chưa học bài nào'}

                            </span>

                          </div>

                        </td>



                        {/* 4. Cấp Độ Level & Tiến Trình XP */}

                        <td className="py-3 px-3 text-center">

                          <div className="inline-flex flex-col items-center">

                            <span className="font-black text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1">

                              <span>{lvl.icon}</span>

                              <span>Level {lvl.level}: {lvl.title}</span>

                            </span>

                            <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-1 mt-1 overflow-hidden">

                              <div

                                className="bg-indigo-500 h-1 rounded-full transition-all"

                                style={{ width: `${lvl.progressPercent}%` }}

                              ></div>

                            </div>

                            <span className="text-[9px] text-slate-400 mt-0.5">

                              {lvl.pointsToNextLevel > 0 ? `Còn ${lvl.pointsToNextLevel}đ lên cấp` : 'Đỉnh cao'}

                            </span>

                          </div>

                        </td>



                        {/* 5. Điểm Thi Đua Tổng Hợp */}

                        <td className="py-3 px-3 text-center">

                          <span className="inline-block px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-700 dark:text-amber-300 font-black text-sm border border-amber-400/30">

                            {item.totalMeritPoints}đ

                          </span>

                        </td>



                        {/* 6. Điểm Bài Thi */}

                        <td className="py-3 px-3 text-center">

                          <div className="font-bold text-slate-800 dark:text-slate-200">

                            {item.averageScore > 0 ? `${item.averageScore}/10đ` : 'Chưa thi'}

                          </div>

                          <div className="text-[10px] text-slate-400">

                            {item.testsCount} bài làm

                          </div>

                        </td>



                        {/* 7. Danh Hiệu & Huy Hiệu */}

                        <td className="py-3 px-3">

                          <div className="flex flex-wrap gap-1 max-w-xs">

                            {item.badges.slice(0, 3).map((b, i) => (

                              <span

                                key={i}

                                className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-300 font-bold text-[10px] border border-blue-200 dark:border-slate-700"

                              >

                                {b}

                              </span>

                            ))}

                            {item.badges.length > 3 && (

                              <span className="text-[10px] text-slate-400 self-center">

                                +{item.badges.length - 3}

                              </span>

                            )}

                          </div>

                        </td>



                        {/* 8. Thao tác */}

                        <td className="py-3 px-3 text-center">

                          <button

                            type="button"

                            onClick={(e) => {

                              e.stopPropagation();

                              handleOpenBonusModal(item.studentId);

                            }}

                            className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-200 transition cursor-pointer"

                            title="Thưởng thêm điểm cho bạn này"

                          >

                            <Gift className="w-3.5 h-3.5" />

                          </button>

                        </td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      )}



      {/* =========================================================================

          TAB 2: SỔ ĐIỂM DANH & % VÀO HỌC CHUẨN THEO LỚP

          ========================================================================= */}

      {activeTab === 'attendance' && attendanceReport && (

        <div className="space-y-4">

          {/* Thanh lọc trạng thái điểm danh */}

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">

            <div className="flex items-center gap-2 flex-wrap">

              <span className="text-xs font-bold text-slate-500">Lọc theo trạng thái:</span>

              <button

                type="button"

                onClick={() => setAttendanceStatusFilter('all')}

                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${

                  attendanceStatusFilter === 'all'

                    ? 'bg-blue-600 text-white shadow-xs'

                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'

                }`}

              >

                Tất cả ({attendanceReport.totalRoster})

              </button>

              <button

                type="button"

                onClick={() => setAttendanceStatusFilter('entered')}

                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${

                  attendanceStatusFilter === 'entered'

                    ? 'bg-emerald-600 text-white shadow-xs'

                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'

                }`}

              >

                <CheckCircle2 className="w-3.5 h-3.5" />

                <span>Đã vào học ({attendanceReport.enteredCount})</span>

              </button>

              <button

                type="button"

                onClick={() => setAttendanceStatusFilter('not_entered')}

                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${

                  attendanceStatusFilter === 'not_entered'

                    ? 'bg-rose-600 text-white shadow-xs'

                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'

                }`}

              >

                <XCircle className="w-3.5 h-3.5" />

                <span>Chưa vào học ({attendanceReport.notEnteredCount})</span>

              </button>

            </div>



            {/* Nút sao chép danh sách học sinh chưa vào học */}

            {attendanceReport.notEnteredCount > 0 && (

              <button

                type="button"

                onClick={handleCopyZaloReport}

                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"

              >

                <Copy className="w-3.5 h-3.5" />

                <span>Nhắc nhở {attendanceReport.notEnteredCount} em chưa vào học</span>

              </button>

            )}

          </div>



          {/* Bảng danh sách sổ điểm danh chính thức */}

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">

            <div className="overflow-x-auto">

              <table className="w-full text-left text-xs border-collapse">

                <thead>

                  <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">

                    <th className="py-3 px-3 text-center w-12">STT</th>

                    <th className="py-3 px-3">Họ và Tên</th>

                    <th className="py-3 px-3 text-center">Lớp</th>

                    <th className="py-3 px-3 text-center">Mã HS</th>

                    <th className="py-3 px-3 text-center">Trạng Thái Vào Học</th>

                    <th className="py-3 px-3 text-center">Điểm ĐGtx</th>

                    <th className="py-3 px-3 text-center">Điểm Thi Đua</th>

                    <th className="py-3 px-3 text-center">Số Bài Đã Làm</th>

                    <th className="py-3 px-3 text-center">Lần Cuối Hoạt Động</th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                  {filteredAttendanceStudents.map((item) => (

                    <tr

                      key={`${item.studentCode}-${item.stt}`}

                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"

                    >

                      <td className="py-2.5 px-3 text-center font-bold text-slate-400">

                        {item.stt}

                      </td>

                      <td className="py-2.5 px-3">

                        <div className="font-black text-slate-900 dark:text-white">

                          {item.name}

                        </div>

                      </td>

                      <td className="py-2.5 px-3 text-center font-bold text-slate-600 dark:text-slate-300">

                        {item.className}

                      </td>

                      <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-[11px]">

                        {item.studentCode || '---'}

                      </td>

                      <td className="py-2.5 px-3 text-center">

                        {item.hasEntered ? (

                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-black text-[11px]">

                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />

                            <span>Đã Vào Học</span>

                          </span>

                        ) : (

                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 font-black text-[11px]">

                            <XCircle className="w-3 h-3 text-rose-600" />

                            <span>Chưa Vào</span>

                          </span>

                        )}

                      </td>

                      <td className="py-2.5 px-3 text-center font-bold text-slate-700 dark:text-slate-300">

                        {item.regularScore !== null ? `${item.regularScore}đ` : '---'}

                      </td>

                      <td className="py-2.5 px-3 text-center">

                        <span className="font-black text-amber-600 dark:text-amber-400">

                          {item.totalMeritPoints}đ

                        </span>

                      </td>

                      <td className="py-2.5 px-3 text-center font-bold text-slate-600 dark:text-slate-400">

                        {item.submissionsCount > 0 ? `${item.submissionsCount} bài` : '0 bài'}

                      </td>

                      <td className="py-2.5 px-3 text-center text-[11px] text-slate-400">

                        {item.lastActive || 'Chưa vào'}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      )}



      {/* =========================================================================

          TAB 3: NHẬT KÝ THỜI GIAN THỰC (LIVE STREAM FEED)

          ========================================================================= */}

      {activeTab === 'live_feed' && (

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">

          <div className="flex items-center justify-between gap-3">

            <div>

              <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">

                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>

                <span>Nhật Ký Tương Tác Học Tập Thời Gian Thực (Live Feed)</span>

              </h4>

              <p className="text-xs text-slate-500 mt-0.5">

                Ghi nhận trực tiếp từng giây các hoạt động: nộp bài thi, hoàn thành từ vựng, điểm danh và tích điểm của học sinh.

              </p>

            </div>

            <button

              type="button"

              onClick={loadData}

              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"

            >

              <RotateCw className="w-3.5 h-3.5" />

              <span>Cập nhật mới</span>

            </button>

          </div>



          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[500px] overflow-y-auto pr-1">

            {liveLogs.map((log) => (

              <div key={log.id} className="py-3 flex items-start justify-between gap-3 text-xs">

                <div className="flex items-start gap-2.5">

                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-black shrink-0 text-sm">

                    ⚡

                  </div>

                  <div>

                    <div className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">

                      <span>{log.studentName}</span>

                      <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400">

                        {log.className}

                      </span>

                    </div>

                    <div className="text-slate-600 dark:text-slate-300 font-medium mt-0.5">

                      {log.action}: <span className="text-blue-600 dark:text-blue-400 font-bold">{log.detail}</span>

                    </div>

                  </div>

                </div>



                <div className="text-[11px] text-slate-400 font-mono shrink-0">

                  {new Date(log.timestamp).toLocaleTimeString('vi-VN')}

                </div>

              </div>

            ))}

          </div>

        </div>

      )}



      {/* =========================================================================

          MODAL 1: BẢNG KÊ CHI TIẾT ĐIỂM MINH BẠCH CỦA TỪNG HỌC SINH

          ========================================================================= */}

      {selectedStudentDetail && (

        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">

          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">

            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center font-black text-xl shadow-md">

                  {selectedStudentDetail.gender === 'Nữ' ? '👧' : '👦'}

                </div>

                <div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">

                    {selectedStudentDetail.studentName}

                  </h3>

                  <div className="text-xs text-slate-500 flex items-center gap-2">

                    <span>Lớp {selectedStudentDetail.className}</span>

                    <span>•</span>

                    <span>Mã HS: {selectedStudentDetail.studentCode}</span>

                    <span>•</span>

                    <span className="font-bold text-amber-600">Hạng #{selectedStudentDetail.rank}</span>

                  </div>

                </div>

              </div>

              <button

                type="button"

                onClick={() => setSelectedStudentDetail(null)}

                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"

              >

                ✕

              </button>

            </div>



            {/* Thẻ Cấp Độ & Thanh XP */}

            {selectedStudentDetail.levelInfo && (

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800/40 space-y-2">

                <div className="flex items-center justify-between text-xs font-black text-indigo-900 dark:text-indigo-200">

                  <span className="flex items-center gap-1.5">

                    <span>{selectedStudentDetail.levelInfo.icon}</span>

                    <span>Level {selectedStudentDetail.levelInfo.level}: {selectedStudentDetail.levelInfo.title}</span>

                  </span>

                  <span>{selectedStudentDetail.totalMeritPoints} Điểm XP</span>

                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">

                  <div

                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"

                    style={{ width: `${selectedStudentDetail.levelInfo.progressPercent}%` }}

                  ></div>

                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">

                  <span>Mốc: {selectedStudentDetail.levelInfo.minPoints}đ</span>

                  <span>{selectedStudentDetail.levelInfo.pointsToNextLevel > 0 ? `Cần thêm ${selectedStudentDetail.levelInfo.pointsToNextLevel}đ để lên cấp tiếp theo` : 'Đã đạt cấp cao nhất'}</span>

                  <span>Mục tiêu: {selectedStudentDetail.levelInfo.maxPoints}đ</span>

                </div>

              </div>

            )}



            {/* TIẾN ĐỘ HỌC TẬP TỪ VỰNG & NHIỆM VỤ (1 BÀI = 35%, 2 BÀI = 70%) */}

            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 space-y-2">

              <div className="flex items-center justify-between text-xs font-black text-emerald-900 dark:text-emerald-200">

                <span className="flex items-center gap-1.5">

                  <span>📈</span>

                  <span>Tiến Độ Học Tập Tổng Hợp</span>

                </span>

                <span className="text-sm font-black text-emerald-700 dark:text-emerald-300">

                  {selectedStudentDetail.studyProgressPercent || 0}%

                </span>

              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">

                <div

                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500"

                  style={{ width: `${selectedStudentDetail.studyProgressPercent || 0}%` }}

                ></div>

              </div>

              <div className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between font-medium">

                <span>Số bài từ vựng hoàn thành: <strong>{selectedStudentDetail.vocabUnitsCount || 0} bài</strong></span>

                <span>(1 bài = 35% • 2 bài = 70% • 3 bài = 100%)</span>

              </div>

            </div>



            {/* BẢNG KÊ MINH BẠCH TỪNG THÀNH PHẦN TẠO THÀNH ĐIỂM TỔNG */}

            <div className="space-y-2">

              <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">

                Bảng Kê Chi Tiết Điểm Thi Đua (Công Khai Minh Bạch):

              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">

                  <span className="text-slate-600 dark:text-slate-400">📅 Chuyên cần:</span>

                  <span className="font-black text-blue-600">+{selectedStudentDetail.attendancePoints || 0}đ</span>

                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">

                  <span className="text-slate-600 dark:text-slate-400">🧠 Từ vựng 3D:</span>

                  <span className="font-black text-indigo-600">+{selectedStudentDetail.vocabPoints || 0}đ</span>

                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">

                  <span className="text-slate-600 dark:text-slate-400">📚 Đề cương & Bài tập:</span>

                  <span className="font-black text-teal-600">+{selectedStudentDetail.practicePoints || 0}đ</span>

                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">

                  <span className="text-slate-600 dark:text-slate-400">📝 Bài thi GK/CK:</span>

                  <span className="font-black text-amber-600">+{selectedStudentDetail.examBonusPoints || 0}đ</span>

                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">

                  <span className="text-slate-600 dark:text-slate-400">⏳ Tương tác thời gian:</span>

                  <span className="font-black text-rose-600">+{selectedStudentDetail.timePoints || 0}đ</span>

                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">

                  <span className="text-slate-600 dark:text-slate-400">⭐ Điểm thưởng tích cực:</span>

                  <span className="font-black text-purple-600">

                    +{(selectedStudentDetail.encouragementBonus || 15) + (selectedStudentDetail.teacherBonus || 0)}đ

                  </span>

                </div>

              </div>



              {/* DÒNG TỔNG KẾT MINH BẠCH */}

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-between text-sm font-black text-amber-800 dark:text-amber-300">

                <span>TỔNG ĐIỂM THI ĐUA CHÍNH THỨC:</span>

                <span className="text-lg">{selectedStudentDetail.totalMeritPoints} Điểm</span>

              </div>

            </div>



            {/* Lịch sử điểm thưởng của giáo viên nếu có */}

            {selectedStudentDetail.bonusHistory && selectedStudentDetail.bonusHistory.length > 0 && (

              <div className="space-y-1.5">

                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">

                  Nhật Ký Khen Thưởng Của Thầy Cô:

                </h4>

                <div className="space-y-1.5 max-h-36 overflow-y-auto">

                  {selectedStudentDetail.bonusHistory.map((b) => (

                    <div key={b.id} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">

                      <div>

                        <div className="font-bold text-slate-800 dark:text-slate-200">{b.reason}</div>

                        <div className="text-[10px] text-slate-400">Người khen: {b.awardedBy}</div>

                      </div>

                      <span className="font-black text-emerald-600">+{b.points}đ</span>

                    </div>

                  ))}

                </div>

              </div>

            )}



            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">

              <button

                type="button"

                onClick={() => {

                  handleOpenBonusModal(selectedStudentDetail.studentId);

                }}

                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 cursor-pointer"

              >

                <Gift className="w-4 h-4 text-slate-950" />

                <span>Thưởng Điểm Cho Em Này</span>

              </button>



              <button

                type="button"

                onClick={() => setSelectedStudentDetail(null)}

                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"

              >

                Đóng

              </button>

            </div>

          </div>

        </div>

      )}



      {/* =========================================================================

          MODAL 2: THƯỞNG ĐIỂM TÍCH CỰC CHO HỌC SINH

          ========================================================================= */}

      {showBonusModal && (

        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">

          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">

            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">

              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">

                <Gift className="w-5 h-5 text-amber-500" />

                <span>Thưởng Điểm Tích Cực Cho Học Sinh</span>

              </h3>

              <button

                type="button"

                onClick={() => setShowBonusModal(false)}

                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 cursor-pointer"

              >

                ✕

              </button>

            </div>



            <div className="space-y-3 text-xs">

              <div>

                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">

                  Chọn học sinh nhận thưởng:

                </label>

                <select

                  value={bonusStudentId}

                  onChange={(e) => setBonusStudentId(e.target.value)}

                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-white"

                >

                  {leaderboard.map((s) => (

                    <option key={s.studentId} value={s.studentId}>

                      {s.studentName} — Lớp {s.className} (Hiện có: {s.totalMeritPoints}đ)

                    </option>

                  ))}

                </select>

              </div>



              <div>

                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">

                  Mức điểm thưởng:

                </label>

                <div className="grid grid-cols-4 gap-2">

                  {[5, 10, 20, 50].map((pts) => (

                    <button

                      key={pts}

                      type="button"

                      onClick={() => setBonusPoints(pts)}

                      className={`p-2 rounded-xl font-black text-center transition cursor-pointer border ${

                        bonusPoints === pts

                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'

                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'

                      }`}

                    >

                      +{pts} Điểm

                    </button>

                  ))}

                </div>

              </div>



              <div>

                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">

                  Lý do khen thưởng công khai:

                </label>

                <input

                  type="text"

                  value={bonusReason}

                  onChange={(e) => setBonusReason(e.target.value)}

                  placeholder="Ví dụ: Phát biểu hăng hái, chăm chỉ ôn bài đêm..."

                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-slate-900 dark:text-white"

                />

              </div>



              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 text-[11px] leading-relaxed">

                ℹ️ Điểm thưởng sẽ được cộng trực tiếp vào Tổng Điểm Thi Đua của học sinh, tự động nâng cấp độ (Level) và hiển thị công khai trên Bảng Vàng toàn trường.

              </div>

            </div>



            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">

              <button

                type="button"

                onClick={() => setShowBonusModal(false)}

                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"

              >

                Hủy

              </button>

              <button

                type="button"

                onClick={handleSubmitBonus}

                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md transition cursor-pointer"

              >

                Xác Nhận Thưởng Điểm 🎉

              </button>

            </div>

          </div>

        </div>

      )}



      {/* =========================================================================

          MODAL 3: HƯỚNG DẪN CẤP BẬC (LEVELS) & DANH HIỆU SƯ PHẠM

          ========================================================================= */}

      {showLevelGuideModal && (

        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">

          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">

            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">

              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">

                <CrownIcon className="w-5 h-5 text-amber-500" />

                <span>Hệ Thống 7 Cấp Bậc &amp; Danh Hiệu Vương Miện</span>

              </h3>

              <button

                type="button"

                onClick={() => setShowLevelGuideModal(false)}

                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 cursor-pointer"

              >

                ✕

              </button>

            </div>



            <div className="space-y-3 text-xs">

              <p className="text-slate-600 dark:text-slate-400">

                Các em học sinh tích lũy điểm chuyên cần, từ vựng, bài tập và điểm thi trực tuyến để thăng cấp và nhận các danh hiệu vinh danh:

              </p>



              <div className="space-y-2">

                {[

                  { lvl: 1, title: 'Tân Binh Khởi Động', pts: '0 - 49 điểm', icon: '🌱', desc: 'Bắt đầu hành trình học tập trực tuyến' },

                  { lvl: 2, title: 'Mầm Non Chăm Chỉ', pts: '50 - 99 điểm', icon: '🌿', desc: 'Đăng nhập đều đặn và học từ vựng cơ bản' },

                  { lvl: 3, title: 'Chiến Binh Kiên Trì', pts: '100 - 199 điểm', icon: '⚔️', desc: 'Hoàn thành nhiều bài ôn tập đề cương' },

                  { lvl: 4, title: 'Cao Thủ Tinh Anh', pts: '200 - 349 điểm', icon: '💎', desc: 'Đạt điểm cao trong các bài kiểm tra' },

                  { lvl: 5, title: 'Đại Sư Xuất Chúng', pts: '350 - 499 điểm', icon: '🔮', desc: 'Luyện tập xuất sắc toàn diện 4 kỹ năng' },

                  { lvl: 6, title: 'Bậc Thầy Từ Vựng', pts: '500 - 749 điểm', icon: '👑', desc: 'Lĩnh hội trọn bộ từ vựng SGK Global Success' },

                  { lvl: 7, title: 'Huyền Thoại Toàn Năng', pts: '750+ điểm', icon: '⚡🔥', desc: 'Cột mốc vinh quang dẫn đầu toàn trường' }

                ].map((item) => (

                  <div key={item.lvl} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">

                    <div className="flex items-center gap-2.5">

                      <span className="text-xl">{item.icon}</span>

                      <div>

                        <div className="font-black text-slate-900 dark:text-white">

                          Level {item.lvl}: {item.title}

                        </div>

                        <div className="text-[11px] text-slate-400">{item.desc}</div>

                      </div>

                    </div>

                    <span className="font-bold text-blue-600 dark:text-blue-400">{item.pts}</span>

                  </div>

                ))}

              </div>



              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/40 text-amber-900 dark:text-amber-200 text-xs space-y-1">

                <div className="font-black flex items-center gap-1.5">

                  <span>👑 Quy Chế Phong Vương Miện Hoàng Gia:</span>

                </div>

                <div>• <strong>Top 1 Toàn Trường / Toàn Lớp:</strong> Vương Miện Vàng Quán Quân 👑</div>

                <div>• <strong>Top 2:</strong> Vương Miện Bạc Á Quân 🥈</div>

                <div>• <strong>Top 3:</strong> Vương Miện Đồng Quý Quân 🥉</div>

              </div>

            </div>



            <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-800">

              <button

                type="button"

                onClick={() => setShowLevelGuideModal(false)}

                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs cursor-pointer"

              >

                Đã Hiểu &amp; Tiếp Tục Phấn Đấu

              </button>

            </div>

          </div>

        </div>

      )}



      {/* =========================================================================

          MODAL 4: HỘP QUÀ MAY MẮN & LỜI CHÚC TRUYỀN CẢM HỨNG CỦA THẦY ĐINH THÀNH

          ========================================================================= */}

      {showLuckyBoxModal && luckyBoxResult && (

        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">

          <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-3xl max-w-md w-full p-6 border-2 border-amber-400/50 shadow-2xl space-y-4 text-center relative overflow-hidden">

            <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />



            <div className="relative inline-block my-2">

              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 p-1 shadow-2xl flex items-center justify-center text-4xl ring-4 ring-amber-400/30 animate-bounce">

                🎁

              </div>

              <span className="absolute -top-2 -right-2 text-2xl animate-spin">✨</span>

            </div>



            <div>

              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-black uppercase tracking-wider border border-amber-400/40">

                <span>⭐ Hộp Quà May Mắn Thầy Đinh Thành</span>

              </span>

              <h3 className="text-xl font-black text-white mt-2">

                {luckyBoxResult.alreadyOpenedToday 

                  ? 'Quà May Mắn Của Em Hôm Nay' 

                  : 'Chúc Mừng Em Đã Mở Hộp Quà!'}

              </h3>

              <p className="text-xs text-amber-200/90 font-medium mt-1">

                Dành tặng riêng cho học sinh: <strong className="text-white underline">{luckyBoxResult.studentName}</strong> (Lớp {luckyBoxResult.className})

              </p>

            </div>



            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-orange-500/20 border-2 border-amber-400/50 text-center shadow-inner">

              <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider block">

                Điểm Thưởng Thi Đua Nhận Được:

              </span>

              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 my-1 drop-shadow-md">

                +{luckyBoxResult.pointsWon} ĐIỂM

              </div>

              <span className="text-[11px] text-emerald-300 font-bold block">

                ⭐ Tổng điểm mới: {luckyBoxResult.newTotalPoints} điểm (Bảo toàn vĩnh viễn)

              </span>

            </div>



            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-left space-y-2">

              <div className="flex items-center gap-2">

                <span className="text-base">💌</span>

                <span className="text-xs font-black text-amber-300 uppercase tracking-wide">

                  Lời Nhắn Nhủ Sư Phạm Từ Thầy Đinh Thành:

                </span>

              </div>

              <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed font-medium bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">

                "{luckyBoxResult.wishMessage}"

              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">

                <span>👨‍🏫 {luckyBoxResult.teacherName}</span>

                <span className="text-cyan-300 font-bold">Zalo: {luckyBoxResult.teacherPhone}</span>

              </div>

            </div>



            {luckyBoxResult.alreadyOpenedToday && (

              <p className="text-[11px] text-amber-300/80 italic">

                * Hôm nay em đã mở quà rồi! Hãy quay lại vào ngày mai để tiếp tục mở hộp quà mới nhé!

              </p>

            )}



            <div className="pt-2">

              <button

                type="button"

                onClick={() => setShowLuckyBoxModal(false)}

                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-lg transition cursor-pointer active:scale-98"

              >

                Em Cảm Ơn Thầy Thành &amp; Cố Gắng Học Tốt! 🚀

              </button>

            </div>

          </div>

        </div>

      )}



      {/* TOAST THÔNG BÁO TỨC THÌ */}

      {toastMessage && (

        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-3">

          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />

          <span>{toastMessage}</span>

        </div>

      )}

    </div>

  );

};



function CrownIcon({ className }: { className?: string }) {

  return (

    <svg className={className} viewBox="0 0 24 24" fill="currentColor">

      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>

    </svg>

  );

}

