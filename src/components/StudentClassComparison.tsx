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
  ArrowUpRight
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
  const [selectedClassId, setSelectedClassId] = useState<string>('cls-7a1');
  const [activeStudent, setActiveStudent] = useState<StudentProfile | null>(null);
  const [leaderboard, setLeaderboard] = useState<ClassLeaderboardItem[]>([]);
  const [classStats, setClassStats] = useState<ClassComparisonStats | null>(null);
  const [studentSubs, setStudentSubs] = useState<StudentSubmission[]>([]);

  // Đổi học sinh trong modal hoặc selector
  const [showSwitchModal, setShowSwitchModal] = useState<boolean>(false);

  const loadData = () => {
    const cls = studentGradebookService.getClasses();
    setClasses(cls);
    
    let curStudent = studentGradebookService.getActiveStudent();
    if (!curStudent && cls.length > 0) {
      const classStus = studentGradebookService.getStudents(cls[0].id);
      if (classStus.length > 0) {
        curStudent = classStus[0];
        studentGradebookService.setActiveStudent(curStudent);
      }
    }
    setActiveStudent(curStudent);

    const cId = curStudent ? curStudent.classId : (cls[0]?.id || 'cls-7a1');
    setSelectedClassId(cId);

    const lb = studentGradebookService.getClassLeaderboard(cId);
    setLeaderboard(lb);

    const stats = studentGradebookService.getClassComparisonStats(cId);
    setClassStats(stats);

    if (curStudent) {
      const subs = studentGradebookService.getSubmissions({ studentId: curStudent.id });
      setStudentSubs(subs);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Khi chọn lớp khác
  const handleSelectClass = (cId: string) => {
    setSelectedClassId(cId);
    const lb = studentGradebookService.getClassLeaderboard(cId);
    setLeaderboard(lb);
    const stats = studentGradebookService.getClassComparisonStats(cId);
    setClassStats(stats);

    // Tự động chuyển activeStudent sang bạn đầu tiên của lớp đó nếu học sinh hiện tại khác lớp
    if (!activeStudent || activeStudent.classId !== cId) {
      const stus = studentGradebookService.getStudents(cId);
      if (stus.length > 0) {
        studentGradebookService.setActiveStudent(stus[0]);
        setActiveStudent(stus[0]);
        const subs = studentGradebookService.getSubmissions({ studentId: stus[0].id });
        setStudentSubs(subs);
      }
    }
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
      {/* THANH ĐỊNH DANH HỌC SINH ĐANG ĐĂNG NHẬP */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-700/50 p-4 sm:p-5 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shrink-0">
            {myRank === 1 ? '👑' : myRank === 2 ? '🥈' : myRank === 3 ? '🥉' : '🌟'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">Học Sinh Đang Xem:</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-black bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                Lớp {activeStudent?.className || '7A1'}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              {activeStudent?.name || 'Nguyễn Văn An'}
              <span className="text-xs font-mono font-semibold text-slate-400">({activeStudent?.studentCode})</span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowSwitchModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all hover:scale-105 flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" /> Đổi Bạn Khác Trong Lớp
          </button>
        </div>
      </div>

      {/* THẺ ĐÁNH GIÁ VỊ TRÍ CỦA BẠN & SO SÁNH VỚI BẠN CÙNG LỚP */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* THẺ THỨ HẠNG */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-950/80 to-slate-900 border border-indigo-800/60 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-indigo-300 text-xs font-bold uppercase">
            <span>Thứ Hạng Trong Lớp</span>
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-black text-amber-300">
              #{myRank > 0 ? myRank : '-'}
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              / {leaderboard.length} bạn lớp {activeStudent?.className}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-300">
            {myRank === 1 ? '🎉 Bạn đang là THỦ KHOA dẫn đầu lớp!' :
             myRank <= 3 ? '🌟 Bạn đang ở trong TOP 3 xuất sắc nhất!' :
             myRank <= 5 ? '🚀 Bạn đang bám sát Top 3, cố lên!' :
             '💪 Hãy luyện thêm đề để bứt phá thứ hạng nhé!'}
          </p>
        </div>

        {/* THẺ ĐIỂM TRUNG BÌNH */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-950/80 to-slate-900 border border-indigo-800/60 shadow-lg">
          <div className="flex items-center justify-between text-indigo-300 text-xs font-bold uppercase">
            <span>Điểm Trung Bình Của Bạn</span>
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">
              {myAverage > 0 ? myAverage.toFixed(1) : '0.0'}
            </span>
            <span className="text-xs text-slate-400 font-semibold">/ 10.0</span>
          </div>
          <p className="mt-2 text-xs text-slate-300">
            Đã hoàn thành <span className="font-bold text-cyan-300">{myTestsCount} bài thi</span> (Cao nhất: {myHighest}đ)
          </p>
        </div>

        {/* THẺ SO SÁNH VỚI ĐIỂM TRUNG BÌNH LỚP */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-950/80 to-slate-900 border border-indigo-800/60 shadow-lg">
          <div className="flex items-center justify-between text-indigo-300 text-xs font-bold uppercase">
            <span>So Với Điểm TB Cả Lớp</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-black ${diffWithClassAvg >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {diffWithClassAvg >= 0 ? `+${diffWithClassAvg}` : `${diffWithClassAvg}`}
            </span>
            <span className="text-xs text-slate-400 font-semibold">điểm</span>
          </div>
          <p className="mt-2 text-xs text-slate-300">
            {diffWithClassAvg >= 0 
              ? `Cao hơn mức trung bình lớp (${classAvg}đ). Giỏi lắm!` 
              : `Thấp hơn mức TB lớp (${classAvg}đ). Hãy ôn tập thêm nhé!`}
          </p>
        </div>

        {/* THẺ KHOẢNG CÁCH VỚI BẠN TOP 1 */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-950/80 to-slate-900 border border-indigo-800/60 shadow-lg">
          <div className="flex items-center justify-between text-indigo-300 text-xs font-bold uppercase">
            <span>Khoảng Cách Với Top 1</span>
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            {myRank === 1 ? (
              <span className="text-2xl font-black text-amber-300">Đang Dẫn Đầu 👑</span>
            ) : (
              <>
                <span className="text-3xl font-black text-amber-300">
                  {diffWithTop > 0 ? `${diffWithTop}` : '0.0'}
                </span>
                <span className="text-xs text-slate-400 font-semibold">điểm tới Top 1</span>
              </>
            )}
          </div>
          <p className="mt-2 text-xs text-slate-300">
            {myRank === 1 
              ? 'Giữ vững phong độ để duy trì ngôi vị thủ khoa!' 
              : `Top 1 là ${topStudent?.studentName} (${topStudent?.averageScore}đ). Cố lên bạn ơi!`}
          </p>
        </div>
      </div>

      {/* MỤC TIÊU HỌC TẬP PHẤN ĐẤU (LEARNING GOALS) */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-400" />
              Mục Tiêu Học Tập & Huy Hiệu Phấn Đấu Của Bạn
            </h4>
            <p className="text-xs text-slate-400">
              Hoàn thành các mục tiêu học tập này để tích lũy huy hiệu vinh danh và thăng hạng trên bảng xếp hạng lớp
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Mục Tiêu Tháng Này
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* MỤC TIÊU 1 */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" /> Mục Tiêu 1: Vươn Lên Top 3
              </span>
              <span className="text-[11px] font-mono font-bold text-slate-300">
                {myRank <= 3 && myRank > 0 ? 'ĐÃ ĐẠT 🌟' : `Hạng #${myRank}`}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 to-yellow-400 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${myRank <= 3 && myRank > 0 ? 100 : Math.max(10, (1 - (myRank - 3)/leaderboard.length) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-300">
              {myRank <= 3 && myRank > 0 
                ? 'Tuyệt vời! Bạn đang nằm trong Top 3 xuất sắc của lớp.' 
                : 'Làm thêm bài tập SGK và kiểm tra online để vượt lên Top 3!'}
            </p>
          </div>

          {/* MỤC TIÊU 2 */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-emerald-400" /> Mục Tiêu 2: Đạt Điểm 9.0+
              </span>
              <span className="text-[11px] font-mono font-bold text-slate-300">
                {myAverage >= 9.0 ? 'ĐÃ ĐẠT 🌟' : `${myAverage} / 9.0`}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (myAverage / 9.0) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-300">
              {myAverage >= 9.0 
                ? 'Xuất sắc! Điểm trung bình của bạn đã đạt mức Xuất sắc 9.0+.' 
                : `Bạn cần thêm ${(9.0 - myAverage).toFixed(1)} điểm nữa để đạt mục tiêu này.`}
            </p>
          </div>

          {/* MỤC TIÊU 3 */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-cyan-400" /> Mục Tiêu 3: Luyện Đề Chăm Chỉ
              </span>
              <span className="text-[11px] font-mono font-bold text-slate-300">
                {myTestsCount} / 5 bài
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (myTestsCount / 5) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-300">
              {myTestsCount >= 5 
                ? 'Rất chăm chỉ! Đã mở khóa huy hiệu "Chiến Binh Luyện Đề 📚".' 
                : `Làm thêm ${5 - myTestsCount} bài nữa để nhận huy hiệu Chăm Chỉ.`}
            </p>
          </div>
        </div>
      </div>

      {/* BẢNG XẾP HẠNG THI ĐUA CẢ LỚP (LEADERBOARD) */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-slate-800 via-indigo-950 to-slate-800 border-b border-slate-700 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-amber-400" />
            <div>
              <h4 className="text-base sm:text-lg font-black text-white">
                Bảng Vinh Danh & Thi Đua Lớp {currentClassObj?.name} (Khối {currentClassObj?.grade})
              </h4>
              <p className="text-xs text-slate-300">
                Xem thứ hạng của mình và các bạn để cùng nhau thi đua tiến bộ trong học tập
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Xem lớp khác:</span>
            <select
              value={selectedClassId}
              onChange={(e) => handleSelectClass(e.target.value)}
              className="bg-slate-800 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-bold focus:outline-none focus:border-indigo-500"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>Lớp {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-200">
            <thead className="bg-slate-800/60 text-slate-400 font-bold uppercase text-[11px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 w-16 text-center">Thứ Hạng</th>
                <th className="py-3.5 px-4">Họ và Tên Học Sinh</th>
                <th className="py-3.5 px-4 text-center">Mã HS</th>
                <th className="py-3.5 px-4 text-center">Số Bài Đã Làm</th>
                <th className="py-3.5 px-4 text-center">Điểm Cao Nhất</th>
                <th className="py-3.5 px-4 text-center">Điểm Trung Bình</th>
                <th className="py-3.5 px-4 text-center">Xếp Loại</th>
                <th className="py-3.5 px-4">Huy Hiệu Vinh Danh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {leaderboard.map((item) => {
                const isMe = item.studentId === activeStudent?.id;
                return (
                  <tr 
                    key={item.studentId}
                    className={`transition-all ${
                      isMe 
                        ? 'bg-indigo-900/40 ring-2 ring-indigo-500/80 font-bold' 
                        : item.rank === 1 ? 'bg-amber-500/10' :
                          item.rank === 2 ? 'bg-slate-300/10' :
                          item.rank === 3 ? 'bg-amber-700/10' :
                          'hover:bg-slate-800/30'
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center font-black">
                      {item.rank === 1 && <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black text-sm shadow-md">1 👑</span>}
                      {item.rank === 2 && <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-300 text-slate-950 font-black text-sm shadow-md">2 🥈</span>}
                      {item.rank === 3 && <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-700 text-white font-black text-sm shadow-md">3 🥉</span>}
                      {item.rank > 3 && <span className="text-slate-400 font-mono text-sm">#{item.rank}</span>}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-extrabold ${isMe ? 'text-cyan-300 text-base' : 'text-white'}`}>
                          {item.studentName}
                        </span>
                        {isMe && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-400 text-slate-950">
                            BẠN
                          </span>
                        )}
                      </div>
                      {item.recentTestTitle && (
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          Vừa làm: {item.recentTestTitle} ({item.recentScore}đ)
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-indigo-400 font-bold">{item.studentCode}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-400">{item.testsCount} bài</td>
                    <td className="py-3.5 px-4 text-center font-black text-white">
                      {item.highestScore > 0 ? item.highestScore.toFixed(1) : '-'}
                    </td>
                    <td className="py-3.5 px-4 text-center font-black text-amber-300 text-base">
                      {item.averageScore > 0 ? item.averageScore.toFixed(1) : '-'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        item.rankLevel === 'XUAT_SAC' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                        item.rankLevel === 'GIOI' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                        item.rankLevel === 'KHA' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' :
                        'bg-slate-700 text-slate-300'
                      }`}>
                        {item.rankLevel === 'XUAT_SAC' ? 'Xuất Sắc' :
                         item.rankLevel === 'GIOI' ? 'Giỏi' :
                         item.rankLevel === 'KHA' ? 'Khá' : 'Đạt'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {item.badges.map((b, i) => (
                          <span key={i} className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
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

      {/* LỊCH SỬ BÀI LÀM VÀ LỜI PHÊ CỦA THẦY CÔ CHO RIÊNG BẠN */}
      {studentSubs.length > 0 && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h4 className="text-base font-black text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            Lịch Sử Bài Làm & Lời Phê Của Thầy Cô Dành Cho {activeStudent?.name}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {studentSubs.map(sub => (
              <div key={sub.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 line-clamp-1">{sub.testTitle}</span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-black text-sm">
                    {sub.score} điểm
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{sub.unitTitle}</span>
                  <span>{new Date(sub.submittedAt).toLocaleDateString('vi-VN')}</span>
                </div>
                {sub.teacherFeedback ? (
                  <div className="mt-2 p-3 rounded-xl bg-amber-950/30 border border-amber-900/50 text-xs text-amber-200 italic">
                    <span className="font-bold not-italic text-amber-400 block mb-1">Lời phê của Thầy Đinh Thành:</span>
                    "{sub.teacherFeedback}"
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 italic mt-1">Đang chờ Thầy Cô chấm nhận xét</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL ĐỔI HỌC SINH TRONG LỚP */}
      {showSwitchModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" /> Chọn Tên Của Bạn Trong Lớp {currentClassObj?.name}
              </h3>
              <button onClick={() => setShowSwitchModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Bấm vào tên của bạn để hệ thống ghi nhận điểm số và tính thứ hạng chính xác:
            </p>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {classStudentsList.map(stu => (
                <div
                  key={stu.id}
                  onClick={() => handleSelectStudent(stu)}
                  className={`p-3 rounded-xl cursor-pointer border flex items-center justify-between transition-all ${
                    stu.id === activeStudent?.id
                      ? 'bg-indigo-600/30 border-indigo-500 font-bold ring-1 ring-indigo-500'
                      : 'bg-slate-800 hover:bg-slate-700/80 border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center">
                      {stu.gender === 'Nữ' ? '👧' : '👦'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{stu.name}</p>
                      <span className="text-[11px] text-indigo-400 font-mono">{stu.studentCode}</span>
                    </div>
                  </div>
                  {stu.id === activeStudent?.id && (
                    <span className="text-xs font-bold text-emerald-400">Đang chọn ✓</span>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowSwitchModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
