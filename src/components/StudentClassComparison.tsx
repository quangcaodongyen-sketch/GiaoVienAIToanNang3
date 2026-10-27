import React, { useState, useEffect } from 'react';
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
  MessageSquare, 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  Zap, 
  ChevronRight,
  ArrowUpRight,
  GraduationCap
} from 'lucide-react';
import { 
  studentGradebookService, 
  ClassRoom, 
  StudentProfile, 
  StudentSubmission, 
  ClassLeaderboardItem,
  ClassComparisonStats,
  AcademicRank
} from '../services/studentGradebookService';

interface StudentClassComparisonProps {
  onStartExercise?: () => void;
  onStartQuiz?: () => void;
}

export const StudentClassComparison: React.FC<StudentClassComparisonProps> = ({
  onStartExercise,
  onStartQuiz
}) => {
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('cls-8a1');
  const [activeStudent, setActiveStudent] = useState<StudentProfile | null>(null);
  const [leaderboard, setLeaderboard] = useState<ClassLeaderboardItem[]>([]);
  const [classStats, setClassStats] = useState<ClassComparisonStats | null>(null);
  const [studentSubs, setStudentSubs] = useState<StudentSubmission[]>([]);
  // Chế độ xem: Cùng Lớp hoặc Toàn Trường
  const [rankingScope, setRankingScope] = useState<'class' | 'school' | 'grade'>('class');
  // Tiêu chí xếp hạng: Điểm chuyên cần & thi đua hoặc Điểm bài thi
  const [rankingSortBy, setRankingSortBy] = useState<'merit' | 'score'>('merit');
  const [schoolGradeFilter, setSchoolGradeFilter] = useState<number>(0);

  // Đổi học sinh trong modal hoặc selector
  const [showSwitchModal, setShowSwitchModal] = useState<boolean>(false);

  const loadData = () => {
    const cls = studentGradebookService.getClasses();
    setClasses(cls);
    
    const curStudent = studentGradebookService.getActiveStudent();
    setActiveStudent(curStudent);

    const cId = curStudent ? curStudent.classId : (cls[0]?.id || 'cls-8a1');
    setSelectedClassId(cId);

    refreshLeaderboard(rankingScope, cId, schoolGradeFilter, rankingSortBy);

    if (curStudent) {
      const subs = studentGradebookService.getSubmissions({ studentId: curStudent.id });
      setStudentSubs(subs);
    }
  };

  const refreshLeaderboard = (
    scope: 'class' | 'school' | 'grade',
    cId: string,
    gradeFilter: number,
    sortBy: 'merit' | 'score'
  ) => {
    if (scope === 'class') {
      let lb = studentGradebookService.getClassLeaderboard(cId);
      if (sortBy === 'merit') {
        lb.sort((a, b) => (b.totalMeritPoints || 0) - (a.totalMeritPoints || 0) || b.averageScore - a.averageScore);
      } else {
        lb.sort((a, b) => b.averageScore - a.averageScore || (b.totalMeritPoints || 0) - (a.totalMeritPoints || 0));
      }
      lb.forEach((it, idx) => { it.rank = idx + 1; });
      setLeaderboard(lb);
      const stats = studentGradebookService.getClassComparisonStats(cId);
      setClassStats(stats);
    } else if (scope === 'grade') {
      const g = gradeFilter > 0 ? gradeFilter : (activeStudent?.grade || 8);
      const lb = studentGradebookService.getSchoolLeaderboard(g, sortBy);
      setLeaderboard(lb);
    } else {
      const lb = studentGradebookService.getSchoolLeaderboard(undefined, sortBy);
      setLeaderboard(lb);
    }
  };

  useEffect(() => {
    loadData();
  }, [rankingScope, rankingSortBy, schoolGradeFilter]);

  // Khi chọn lớp khác
  const handleSelectClass = (cId: string) => {
    setSelectedClassId(cId);
    refreshLeaderboard('class', cId, schoolGradeFilter, rankingSortBy);
  };

  // Chọn học sinh cụ thể
  const handleSelectStudent = (stu: StudentProfile) => {
    studentGradebookService.setActiveStudent(stu);
    setActiveStudent(stu);
    setShowSwitchModal(false);
    setSelectedClassId(stu.classId);
    const lb = studentGradebookService.getClassLeaderboard(stu.classId);
    setLeaderboard(lb);
    const stats = studentGradebookService.getClassComparisonStats(stu.classId);
    setClassStats(stats);
    const subs = studentGradebookService.getSubmissions({ studentId: stu.id });
    setStudentSubs(subs);
  };

  // Vị trí của học sinh hiện tại trong bảng xếp hạng
  const myStanding = leaderboard.find(item => item.studentId === activeStudent?.id);
  const myRank = myStanding ? myStanding.rank : 0;
  const myAverage = myStanding ? myStanding.averageScore : 0;
  const myHighest = myStanding ? myStanding.highestScore : 0;
  const myTestsCount = myStanding ? myStanding.testsCount : 0;

  // So sánh với điểm trung bình lớp
  const classAvg = classStats?.classAverageScore || 0;
  const diffWithClassAvg = Math.round((myAverage - classAvg) * 10) / 10;

  // So sánh với bạn Top 1
  const topStudent = leaderboard[0];
  const diffWithTop = topStudent && myStanding && topStudent.studentId !== myStanding.studentId
    ? Math.round((topStudent.averageScore - myAverage) * 10) / 10
    : 0;

  const currentClassObj = classes.find(c => c.id === selectedClassId);
  const classStudentsList = studentGradebookService.getStudents(selectedClassId);

  return (
    <div className="space-y-6">
      {/* THANH ĐỊNH DANH HỌC SINH (HOẶC CHẾ ĐỘ XEM CÔNG KHAI TOÀN LỚP, TOÀN TRƯỜNG, THEO KHỐI) */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 border-2 border-blue-500/40 p-5 sm:p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-radial from-white/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-13 h-13 rounded-2xl bg-amber-400 text-blue-950 flex items-center justify-center font-black text-2xl shadow-md shrink-0 border-2 border-amber-200">
            {activeStudent ? (myRank === 1 ? '👑' : myRank === 2 ? '🥈' : myRank === 3 ? '🥉' : '🌟') : '📊'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-300 font-black uppercase tracking-wider">
                {activeStudent ? 'Học Sinh Đang Luyện Tập:' : 'Chế Độ Xem Thống Kê Công Khai:'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-white/20 text-white border border-white/30 backdrop-blur-md">
                {activeStudent ? `Lớp ${activeStudent.className}` : 'Dành Cho Giáo Viên, Phụ Huynh & Học Sinh'}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 mt-0.5 tracking-tight">
              {activeStudent ? activeStudent.name : 'Biểu Thống Kê & Bảng Thi Đua Học Sinh'}
              {activeStudent?.studentCode && (
                <span className="text-xs font-mono font-bold text-blue-200 bg-white/15 px-2 py-0.5 rounded-md">({activeStudent.studentCode})</span>
              )}
            </h3>
            {!activeStudent && (
              <p className="text-xs text-blue-100/90 mt-1">
                Biểu thống kê đơn giản, công khai xem chung toàn lớp, toàn trường và theo khối. Ai cũng có thể theo dõi thi đua.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 relative z-10">
          <span className="text-xs text-blue-100 italic hidden sm:inline">
            {activeStudent ? 'Thứ hạng cập nhật theo điểm số thực tế' : 'Xem công khai không cần đăng nhập'}
          </span>
        </div>
      </div>

      {/* THẺ TỔNG HỢP ĐIỂM CHUYÊN CẦN & THI ĐUA CỦA RIÊNG BẠN */}
      {activeStudent && (
        <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 sm:p-6 text-white shadow-xl border-2 border-amber-300/60 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider backdrop-blur-md mb-2">
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Hệ Thống Tích Điểm Chuyên Cần & Thi Đua Thời Gian Thực</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>⭐ Tổng Điểm Thi Đua Tích Lũy:</span>
                <span className="text-3xl sm:text-4xl text-amber-100 font-black underline decoration-amber-300">
                  {activeStudent.totalMeritPoints || 0} Điểm
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-amber-100/90 mt-1">
                Tích điểm tự động: Đăng nhập mỗi ngày (+5đ) • Học xong bài từ vựng (+10đ) • Ôn đề cương & bài tập (+10đ) • Làm bài thi giữa kỳ (Điểm x 10) • Thời gian học tương tác (+3đ/5 phút)
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 bg-black/15 p-3 rounded-2xl backdrop-blur-md border border-white/20 text-center">
              <div className="p-2 rounded-xl bg-white/10">
                <span className="block text-[11px] text-amber-200 font-bold">⏰ Điểm Danh</span>
                <span className="text-base sm:text-lg font-black text-white">+{activeStudent.attendancePoints || 0}đ</span>
              </div>
              <div className="p-2 rounded-xl bg-white/10">
                <span className="block text-[11px] text-amber-200 font-bold">🧠 Học Từ Vựng</span>
                <span className="text-base sm:text-lg font-black text-white">+{activeStudent.vocabPoints || 0}đ</span>
              </div>
              <div className="p-2 rounded-xl bg-white/10">
                <span className="block text-[11px] text-amber-200 font-bold">📝 Ôn Đề Cương</span>
                <span className="text-base sm:text-lg font-black text-white">+{activeStudent.practicePoints || 0}đ</span>
              </div>
              <div className="p-2 rounded-xl bg-white/10">
                <span className="block text-[11px] text-amber-200 font-bold">🏆 Điểm Bài Thi</span>
                <span className="text-base sm:text-lg font-black text-white">+{activeStudent.examBonusPoints || 0}đ</span>
              </div>
              <div className="p-2 rounded-xl bg-white/10 col-span-2 sm:col-span-1">
                <span className="block text-[11px] text-amber-200 font-bold">⏱️ Tương Tác</span>
                <span className="text-base sm:text-lg font-black text-white">{activeStudent.studyTimeMinutes || 0}p (+{activeStudent.timePoints || 0}đ)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* THẺ ĐÁNH GIÁ VỊ TRÍ CỦA BẠN & SO SÁNH VỚI BẠN CÙNG LỚP (NỀN TRẮNG SÁNG, CHỮ RÕ NÉT) */}
      {activeStudent && (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* THẺ THỨ HẠNG */}
        <div className="p-5 rounded-2xl bg-white border-2 border-blue-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-blue-700 text-xs font-black uppercase tracking-wider">
            <span>Thứ Hạng Trong Lớp</span>
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-black text-amber-600">
              #{myRank > 0 ? myRank : '-'}
            </span>
            <span className="text-xs text-slate-500 font-bold">
              / {leaderboard.length} bạn lớp {activeStudent?.className}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600 font-medium">
            {myRank === 1 ? '🎉 Bạn đang là THỦ KHOA dẫn đầu lớp!' :
             myRank <= 3 ? '🌟 Bạn đang ở trong TOP 3 xuất sắc nhất!' :
             myRank <= 5 ? '🚀 Bạn đang bám sát Top 3, cố lên!' :
             '💪 Hãy luyện thêm đề để bứt phá thứ hạng nhé!'}
          </p>
        </div>

        {/* THẺ ĐIỂM TRUNG BÌNH */}
        <div className="p-5 rounded-2xl bg-white border-2 border-blue-100 shadow-sm">
          <div className="flex items-center justify-between text-blue-700 text-xs font-black uppercase tracking-wider">
            <span>Điểm Trung Bình Của Bạn</span>
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-black text-blue-950">
              {myAverage > 0 ? myAverage.toFixed(1) : '0.0'}
            </span>
            <span className="text-xs text-slate-500 font-bold">/ 10.0</span>
          </div>
          <p className="mt-2 text-xs text-slate-600 font-medium">
            Đã làm <span className="font-bold text-blue-700">{myTestsCount} bài thi</span> (Cao nhất: {myHighest}đ)
          </p>
        </div>

        {/* THẺ SO SÁNH VỚI ĐIỂM TRUNG BÌNH LỚP */}
        <div className="p-5 rounded-2xl bg-white border-2 border-blue-100 shadow-sm">
          <div className="flex items-center justify-between text-blue-700 text-xs font-black uppercase tracking-wider">
            <span>So Với Điểm TB Cả Lớp</span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-4xl font-black ${diffWithClassAvg >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {diffWithClassAvg >= 0 ? `+${diffWithClassAvg}` : `${diffWithClassAvg}`}
            </span>
            <span className="text-xs text-slate-500 font-bold">điểm</span>
          </div>
          <p className="mt-2 text-xs text-slate-600 font-medium">
            {diffWithClassAvg >= 0 
              ? `Cao hơn mức trung bình lớp (${classAvg}đ). Giỏi lắm!` 
              : `Thấp hơn mức TB lớp (${classAvg}đ). Hãy ôn tập thêm nhé!`}
          </p>
        </div>

        {/* THẺ KHOẢNG CÁCH VỚI BẠN TOP 1 */}
        <div className="p-5 rounded-2xl bg-white border-2 border-blue-100 shadow-sm">
          <div className="flex items-center justify-between text-blue-700 text-xs font-black uppercase tracking-wider">
            <span>Khoảng Cách Với Top 1</span>
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            {myRank === 1 ? (
              <span className="text-2xl font-black text-amber-600">Đang Dẫn Đầu 👑</span>
            ) : (
              <>
                <span className="text-4xl font-black text-amber-600">
                  {diffWithTop > 0 ? `${diffWithTop}` : '0.0'}
                </span>
                <span className="text-xs text-slate-500 font-bold">điểm tới Top 1</span>
              </>
            )}
          </div>
          <p className="mt-2 text-xs text-slate-600 font-medium">
            {myRank === 1 
              ? 'Giữ vững phong độ để duy trì ngôi vị thủ khoa!' 
              : `Top 1: ${topStudent?.studentName} (${topStudent?.averageScore}đ). Cố lên nhé!`}
          </p>
        </div>
      </div>
      )}

      {/* MỤC TIÊU HỌC TẬP PHẤN ĐẤU (NỀN TRẮNG SÁNG, TIẾN TRÌNH RÕ RÀNG) */}
      <div className="p-6 rounded-3xl bg-white border-2 border-blue-100 shadow-md space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h4 className="text-base sm:text-lg font-black text-blue-950 flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-600" />
              Mục Tiêu Học Tập & Huy Hiệu Phấn Đấu Của Bạn
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Hoàn thành các mục tiêu học tập này để tích lũy huy hiệu vinh danh và thăng hạng trên bảng thi đua lớp
            </p>
          </div>
          <span className="px-3.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
            Mục Tiêu Tháng Này
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* MỤC TIÊU 1 */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" /> Mục Tiêu 1: Vươn Lên Top 3
              </span>
              <span className="text-[11px] font-mono font-bold text-blue-800">
                {myRank <= 3 && myRank > 0 ? 'ĐÃ ĐẠT 🌟' : `Hạng #${myRank}`}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 to-yellow-400 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${myRank <= 3 && myRank > 0 ? 100 : Math.max(10, (1 - (myRank - 3)/leaderboard.length) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {myRank <= 3 && myRank > 0 
                ? 'Tuyệt vời! Bạn đang nằm trong Top 3 xuất sắc của lớp.' 
                : 'Làm thêm bài tập SGK và kiểm tra online để vượt lên Top 3!'}
            </p>
          </div>

          {/* MỤC TIÊU 2 */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-emerald-600" /> Mục Tiêu 2: Đạt Điểm 9.0+
              </span>
              <span className="text-[11px] font-mono font-bold text-blue-800">
                {myAverage >= 9.0 ? 'ĐÃ ĐẠT 🌟' : `${myAverage} / 9.0`}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (myAverage / 9.0) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {myAverage >= 9.0 
                ? 'Xuất sắc! Điểm trung bình của bạn đã đạt mức Xuất sắc 9.0+.' 
                : `Bạn cần thêm ${(9.0 - myAverage).toFixed(1)} điểm nữa để đạt mục tiêu này.`}
            </p>
          </div>

          {/* MỤC TIÊU 3 */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" /> Mục Tiêu 3: Luyện Đề Chăm Chỉ
              </span>
              <span className="text-[11px] font-mono font-bold text-blue-800">
                {myTestsCount} / 5 bài
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (myTestsCount / 5) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {myTestsCount >= 5 
                ? 'Rất chăm chỉ! Đã mở khóa huy hiệu "Chiến Binh Luyện Đề 📚".' 
                : `Làm thêm ${5 - myTestsCount} bài nữa để nhận huy hiệu Chăm Chỉ.`}
            </p>
          </div>
        </div>
      </div>

      {/* BẢNG XẾP HẠNG THI ĐUA CẢ LỚP & TOÀN TRƯỜNG - HEADER XANH CHỮ TRẮNG */}
      <div className="rounded-3xl bg-white border-2 border-blue-200 shadow-xl overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-300 shrink-0" />
            <div>
              <h4 className="text-base sm:text-lg font-black text-white">
                {rankingScope === 'class' 
                  ? `Bảng Thống Kê & Thi Đua Lớp ${currentClassObj?.name || '8A1'}`
                  : rankingScope === 'grade'
                  ? `Bảng Thống Kê & Thi Đua Khối ${schoolGradeFilter || 8}`
                  : `Bảng Thống Kê & Thi Đua Toàn Trường THCS Đồng Yên`}
              </h4>
              <p className="text-xs text-blue-100 font-medium">
                So sánh thứ hạng thi đua chuyên cần và kết quả học tập cùng bạn bè trong lớp & toàn trường
              </p>
            </div>
          </div>

          {/* CÁC NÚT ĐIỀU KHIỂN & CHUYỂN ĐỔI CHẾ ĐỘ XEM */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Chuyển 3 chế độ xem: Toàn Lớp | Toàn Trường | Theo Khối */}
            <div className="flex p-1 bg-white/15 rounded-xl border border-white/20 flex-wrap">
              <button
                type="button"
                onClick={() => setRankingScope('class')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                  rankingScope === 'class' ? 'bg-amber-400 text-blue-950 shadow-sm' : 'text-white hover:bg-white/10'
                }`}
              >
                👥 1. Toàn Lớp
              </button>
              <button
                type="button"
                onClick={() => setRankingScope('school')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                  rankingScope === 'school' ? 'bg-amber-400 text-blue-950 shadow-sm' : 'text-white hover:bg-white/10'
                }`}
              >
                🏫 2. Toàn Trường
              </button>
              <button
                type="button"
                onClick={() => {
                  setRankingScope('grade');
                  if (schoolGradeFilter === 0) setSchoolGradeFilter(8);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                  rankingScope === 'grade' ? 'bg-amber-400 text-blue-950 shadow-sm' : 'text-white hover:bg-white/10'
                }`}
              >
                📚 3. Theo Khối
              </button>
            </div>

            {/* Chuyển tiêu chí sắp xếp: Điểm Chuyên Cần vs Điểm Bài Thi */}
            <div className="flex p-1 bg-white/15 rounded-xl border border-white/20">
              <button
                type="button"
                onClick={() => setRankingSortBy('merit')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                  rankingSortBy === 'merit' ? 'bg-blue-600 text-white shadow-sm' : 'text-white hover:bg-white/10'
                }`}
                title="Xếp theo Tổng Điểm Chuyên Cần & Thi Đua"
              >
                ⭐ Điểm Chuyên Cần
              </button>
              <button
                type="button"
                onClick={() => setRankingSortBy('score')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                  rankingSortBy === 'score' ? 'bg-blue-600 text-white shadow-sm' : 'text-white hover:bg-white/10'
                }`}
                title="Xếp theo Điểm Trung Bình Bài Kiểm Tra"
              >
                📊 Điểm Bài Thi
              </button>
            </div>

            {rankingScope === 'class' && (
              <select
                value={selectedClassId}
                onChange={(e) => handleSelectClass(e.target.value)}
                className="bg-white text-blue-950 px-3 py-1.5 rounded-xl border border-blue-200 text-xs font-black focus:outline-none cursor-pointer shadow-sm"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>Lớp {c.name}</option>
                ))}
              </select>
            )}

            {rankingScope === 'grade' && (
              <div className="flex items-center gap-1 overflow-x-auto">
                {[6, 8, 9, 10, 11, 12].map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSchoolGradeFilter(g)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                      schoolGradeFilter === g ? 'bg-amber-400 text-blue-950' : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    Khối {g}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-800">
            <thead className="bg-blue-50 text-blue-950 font-black uppercase text-[11px] tracking-wider border-b border-blue-100">
              <tr>
                <th className="py-3.5 px-3 w-16 text-center">Thứ Hạng</th>
                <th className="py-3.5 px-4">Học Sinh</th>
                <th className="py-3.5 px-3 text-center">Lớp</th>
                <th className="py-3.5 px-4 text-center bg-amber-100/70 text-amber-950">⭐ Điểm Chuyên Cần & Thi Đua</th>
                <th className="py-3.5 px-3 text-center">Chi Tiết Tích Điểm</th>
                <th className="py-3.5 px-3 text-center">Số Bài Thi</th>
                <th className="py-3.5 px-3 text-center">Điểm TB</th>
                <th className="py-3.5 px-3 text-center">Xếp Loại</th>
                <th className="py-3.5 px-4">Huy Hiệu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 px-4 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-xl font-bold">
                        👥
                      </div>
                      <h5 className="font-black text-sm text-slate-800">Lớp {currentClassObj?.name} chưa có học sinh nào đăng ký tham gia</h5>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Các bạn học sinh lớp {currentClassObj?.name} sau khi đăng ký tài khoản và hoàn thành bài tập SGK hoặc Đề kiểm tra online, điểm số sẽ tự động được hệ thống ghi nhận và vinh danh trực tiếp tại đây!
                      </p>
                    </div>
                  </td>
                </tr>
              ) : leaderboard.map((item) => {
                const isMe = item.studentId === activeStudent?.id;
                return (
                  <tr 
                    key={item.studentId}
                    className={`transition-all ${
                      isMe 
                        ? 'bg-blue-100/90 ring-2 ring-blue-500 font-bold' 
                        : item.rank === 1 ? 'bg-amber-50/70' :
                          item.rank === 2 ? 'bg-slate-50' :
                          item.rank === 3 ? 'bg-orange-50/50' :
                          'hover:bg-blue-50/50'
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center font-black">
                      {item.rank === 1 && <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-400 text-blue-950 font-black text-sm shadow-sm">1 👑</span>}
                      {item.rank === 2 && <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-300 text-blue-950 font-black text-sm shadow-sm">2 🥈</span>}
                      {item.rank === 3 && <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-600 text-white font-black text-sm shadow-sm">3 🥉</span>}
                      {item.rank > 3 && <span className="text-slate-500 font-mono font-bold text-sm">#{item.rank}</span>}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-black ${isMe ? 'text-blue-900 text-base' : 'text-slate-900'}`}>
                          {item.studentName}
                        </span>
                        {isMe && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-700 text-white shadow-xs">
                            BẠN
                          </span>
                        )}
                      </div>
                      {item.recentTestTitle && (
                        <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                          Vừa làm: {item.recentTestTitle} ({item.recentScore}đ)
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-lg bg-blue-100 text-blue-900 font-mono font-bold text-xs">
                        {item.className}
                      </span>
                    </td>
                    {/* CỘT TỔNG ĐIỂM CHUYÊN CẦN & THI ĐUA NỔI BẬT */}
                    <td className="py-3.5 px-4 text-center bg-amber-50/50">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-sm shadow-xs">
                        <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                        <span>{item.totalMeritPoints || 0} điểm</span>
                      </div>
                    </td>
                    {/* CHI TIẾT TÍCH ĐIỂM */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-600">
                        <span title="Điểm danh chuyên cần" className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">⏰+{item.attendancePoints || 0}</span>
                        <span title="Học từ vựng" className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">🧠+{item.vocabPoints || 0}</span>
                        <span title="Đề cương & bài tập" className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700">📝+{item.practicePoints || 0}</span>
                        <span title="Điểm bài thi GK" className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">🏆+{item.examBonusPoints || 0}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center font-black text-emerald-700">{item.testsCount} bài</td>
                    <td className="py-3.5 px-3 text-center font-black text-amber-700 text-sm">
                      {item.averageScore > 0 ? item.averageScore.toFixed(1) : '-'}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        item.rankLevel === 'XUAT_SAC' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        item.rankLevel === 'GIOI' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                        item.rankLevel === 'KHA' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                        'bg-slate-100 text-slate-800 border border-slate-300'
                      }`}>
                        {item.rankLevel === 'XUAT_SAC' ? 'Xuất Sắc' :
                         item.rankLevel === 'GIOI' ? 'Giỏi' :
                         item.rankLevel === 'KHA' ? 'Khá' : 'Đạt'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {item.badges.map((b, i) => (
                          <span key={i} className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            {b}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* LỊCH SỬ BÀI LÀM VÀ LỜI PHÊ CỦA THẦY CÔ CHO RIÊNG BẠN (NỀN TRẮNG SÁNG) */}
      {studentSubs.length > 0 && (
        <div className="p-6 rounded-3xl bg-white border-2 border-blue-100 shadow-md space-y-4">
          <h4 className="text-base sm:text-lg font-black text-blue-950 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-700" />
            Lịch Sử Bài Làm & Lời Phê Của Thầy Cô Dành Cho {activeStudent?.name}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {studentSubs.map(sub => (
              <div key={sub.id} className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-blue-950 line-clamp-1">{sub.testTitle}</span>
                  <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 font-black text-sm">
                    {sub.score} điểm
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between">
                  <span>{sub.unitTitle}</span>
                  <span>{new Date(sub.submittedAt).toLocaleDateString('vi-VN')}</span>
                </div>
                {sub.teacherFeedback ? (
                  <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium italic">
                    <span className="font-bold not-italic text-amber-800 block mb-1">Lời phê của Thầy Đinh Thành:</span>
                    "{sub.teacherFeedback}"
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic mt-1">Đang chờ Thầy Cô chấm nhận xét</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL ĐỔI HỌC SINH TRONG LỚP (NỀN TRẮNG SÁCH GIÁO KHOA) */}
      {showSwitchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-blue-300 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <h3 className="font-black text-blue-950 text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-700" /> Chọn Tên Của Bạn Trong Lớp {currentClassObj?.name}
              </h3>
              <button onClick={() => setShowSwitchModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Bấm vào tên của bạn để hệ thống ghi nhận điểm số và tính thứ hạng chính xác:
            </p>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {classStudentsList.map(stu => (
                <div
                  key={stu.id}
                  onClick={() => handleSelectStudent(stu)}
                  className={`p-3.5 rounded-2xl cursor-pointer border-2 flex items-center justify-between transition-all ${
                    stu.id === activeStudent?.id
                      ? 'bg-blue-700 text-white border-blue-800 shadow-md font-bold'
                      : 'bg-slate-50 hover:bg-blue-50/80 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center ${
                      stu.id === activeStudent?.id ? 'bg-white text-blue-800' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {stu.gender === 'Nữ' ? '👧' : '👦'}
                    </div>
                    <div>
                      <p className={`text-sm font-black ${stu.id === activeStudent?.id ? 'text-white' : 'text-blue-950'}`}>{stu.name}</p>
                      <span className={`text-[11px] font-mono font-bold ${stu.id === activeStudent?.id ? 'text-blue-200' : 'text-blue-600'}`}>{stu.studentCode}</span>
                    </div>
                  </div>
                  {stu.id === activeStudent?.id && (
                    <span className="text-xs font-black text-amber-300">Đang chọn ✓</span>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowSwitchModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
