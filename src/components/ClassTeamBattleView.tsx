import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Crown, 
  Star, 
  Trophy, 
  Award, 
  ShieldCheck, 
  RotateCw, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Send, 
  ChevronRight,
  Flame,
  UserCheck,
  TrendingUp,
  HelpCircle,
  Clock
} from 'lucide-react';
import { classTeamService, ClassTeam, ClassTeamMember, TeamRole } from '../services/classTeamService';
import { StudentProfile } from '../services/studentGradebookService';

interface ClassTeamBattleViewProps {
  currentStudent?: StudentProfile | null;
  isAdmin?: boolean;
  onSelectStudentToStudy?: (studentName: string) => void;
  onGoToVocab?: () => void;
  onGoToExam?: () => void;
}

export const ClassTeamBattleView: React.FC<ClassTeamBattleViewProps> = ({
  currentStudent,
  isAdmin = false,
  onSelectStudentToStudy,
  onGoToVocab,
  onGoToExam
}) => {
  // Lớp hiện tại đang xem (mặc định theo lớp của học sinh, hoặc lớp 8A1 / 6A1 nếu admin)
  const defaultClass = currentStudent?.className || '8A1';
  const [selectedClass, setSelectedClass] = useState<string>(defaultClass);
  const [viewScope, setViewScope] = useState<'class_teams' | 'grade_leaderboard'>('class_teams');

  // Modal nhắc nhở bạn học
  const [remindTarget, setRemindTarget] = useState<{ member: ClassTeamMember; team: ClassTeam } | null>(null);
  const [copiedRemindText, setCopiedRemindText] = useState<boolean>(false);

  // Danh sách 10 lớp chính thức của Thầy Thành
  const officialClasses = ['6A1', '6A2', '6A3', '6A4', '6A5', '8A1', '8A2', '8A3', '8A4', '8A5'];

  // Dữ liệu 4 tổ của lớp đang chọn
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const teams = useMemo(() => {
    return classTeamService.getClassTeams(selectedClass);
  }, [selectedClass, refreshTrigger]);

  // Thông tin tổ của chính học sinh đang đăng nhập
  const myTeamInfo = useMemo(() => {
    if (!currentStudent) return null;
    return classTeamService.getStudentTeamInfo(currentStudent.name, currentStudent.className);
  }, [currentStudent, refreshTrigger]);

  // Khối học (6 hoặc 8)
  const currentGrade = parseInt(selectedClass.replace(/\D/g, ''), 10) || 8;

  // Bảng xếp hạng 20 tổ toàn khối
  const gradeLeaderboard = useMemo(() => {
    return classTeamService.getGradeTeamLeaderboard(currentGrade);
  }, [currentGrade, refreshTrigger]);

  // Thao tác chia lại tổ ngẫu nhiên (chỉ Admin hoặc khi cần đổi mới)
  const handleReshuffleTeams = () => {
    if (!isAdmin) {
      if (!window.confirm(`Thầy/Cô có chắc chắn muốn TÁI PHÂN CHIA 4 TỔ NGẪU NHIÊN CÂN BẰNG cho Lớp ${selectedClass} không?\nHệ thống sẽ tự động cân bằng lại Nam/Nữ và bầu lại Tổ Trưởng, Tổ Phó.`)) {
        return;
      }
    }
    classTeamService.getClassTeams(selectedClass, true);
    setRefreshTrigger(prev => prev + 1);
  };

  // Mở tin nhắn nhắc nhở bạn học
  const handleOpenRemind = (member: ClassTeamMember, team: ClassTeam) => {
    setRemindTarget({ member, team });
    setCopiedRemindText(false);
  };

  // Copy tin nhắn nhắc bạn
  const handleCopyRemind = () => {
    if (!remindTarget) return;
    const txt = `📢 [NHẮC BÀI CÙNG TỔ ${remindTarget.team.teamNumber}] Chào bạn ${remindTarget.member.name} thân mến! ${remindTarget.team.name} lớp ${selectedClass} đang rất cần điểm thi đua của bạn để cùng vươn lên Top 1 Quán Quân! Bạn tranh thủ vào web làm 1-2 bài từ vựng và bài thi thử nhé. Cố lên bạn ơi! 🚀`;
    navigator.clipboard.writeText(txt).then(() => {
      setCopiedRemindText(true);
      setTimeout(() => setCopiedRemindText(false), 3000);
    });
  };

  // Huy hiệu thứ hạng tổ
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-md flex items-center gap-1 border border-yellow-300 animate-pulse">
            <Trophy className="w-3.5 h-3.5 text-amber-900" />
            <span>🥇 QUÁN QUÂN LỚP</span>
          </span>
        );
      case 2:
        return (
          <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-slate-200 to-slate-400 text-slate-900 font-black text-xs shadow-sm flex items-center gap-1 border border-slate-300">
            <Award className="w-3.5 h-3.5 text-slate-700" />
            <span>🥈 Á QUÂN LỚP</span>
          </span>
        );
      case 3:
        return (
          <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-700 to-amber-900 text-amber-100 font-black text-xs shadow-sm flex items-center gap-1 border border-amber-600">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>🥉 HẠNG BA</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-800 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>⚡ HẠNG 4 (CỐ GẮNG)</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. BANNER TIÊU ĐỀ SƯ PHẠM & ĐIỀU HƯỚNG */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-sky-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-xs">
                  THI ĐUA HỌC ĐƯỜNG 2026 - 2027
                </span>
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                  MÔN TIẾNG ANH THCS
                </span>
                {currentStudent && myTeamInfo && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-black tracking-wider flex items-center gap-1 shadow-xs">
                    <span>Em thuộc: {myTeamInfo.team.name}</span>
                    <span className="bg-emerald-700 px-1.5 py-0.2 rounded-full text-[10px]">
                      {myTeamInfo.member.roleTitle}
                    </span>
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>🛡️ ĐẤU TRƯỜNG 4 TỔ THI ĐUA (TEAM BATTLE) — LỚP {selectedClass}</span>
              </h2>

              <p className="text-xs sm:text-sm text-sky-200 leading-relaxed font-normal mt-1">
                Chia ngẫu nhiên 4 tổ cân bằng Nam/Nữ &amp; Học sinh tham gia • Tổ Trưởng &amp; Tổ Phó dẫn dắt, đôn đốc thành viên cùng tiến bộ!
              </p>
            </div>

            {/* BỘ CHUYỂN CHẾ ĐỘ XEM: 4 TỔ TRONG LỚP HOẶC ĐUA TOP KHỐI */}
            <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-2xl border border-white/20 shrink-0">
              <button
                type="button"
                onClick={() => setViewScope('class_teams')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                  viewScope === 'class_teams'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>4 Tổ Lớp {selectedClass}</span>
              </button>

              <button
                type="button"
                onClick={() => setViewScope('grade_leaderboard')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                  viewScope === 'grade_leaderboard'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Đua Top 20 Tổ Khối {currentGrade}</span>
              </button>
            </div>
          </div>

          {/* DÒNG CHỌN LỚP (10 LỚP CHÍNH THỨC) */}
          <div className="flex items-center justify-between gap-2 flex-wrap pt-3 border-t border-white/10 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sky-300 font-bold hidden sm:inline">Chọn lớp xem thi đua:</span>
              {officialClasses.map(cls => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setSelectedClass(cls)}
                  className={`px-2.5 py-1 rounded-lg font-black transition cursor-pointer ${
                    selectedClass === cls
                      ? 'bg-white text-blue-950 shadow-xs ring-2 ring-amber-400'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>

            {/* NÚT TÁI PHÂN TỔ (DÀNH CHO ADMIN HOẶC RESET) */}
            <button
              type="button"
              onClick={handleReshuffleTeams}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95 ml-auto"
              title="Phân chia lại 4 tổ ngẫu nhiên cân bằng Nam/Nữ và Bầu lại TT, TP"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>🎲 Chia Lại 4 Tổ Cân Bằng</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. BẢNG PHÂN CÔNG RÕ NHIỆM VỤ SƯ PHẠM CỦA HỌC SINH */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-wide">
              QUY CHẾ THI ĐUA &amp; PHÂN CÔNG RÕ NHIỆM VỤ CỦA HỌC SINH
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 italic">
            Chỉ đạo bộ môn của Thầy giáo Đinh Văn Thành
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* CỘT 1: TỔ TRƯỞNG */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/40 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
              <span className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shadow-xs">
                👑
              </span>
              <div>
                <h4 className="text-xs sm:text-sm font-black uppercase">TỔ TRƯỞNG (Team Leader)</h4>
                <p className="text-[10px] text-amber-800 dark:text-amber-300 font-bold">Bầu từ học sinh có thành tích Top 1 của tổ</p>
              </div>
            </div>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside leading-relaxed pt-1">
              <li><strong>Theo dõi tiến độ:</strong> Kiểm tra xem hôm nay tổ mình có bao nhiêu bạn đã vào học.</li>
              <li><strong>Đôn đốc, nhắc nhở:</strong> Nhắn tin hoặc trực tiếp nhắc các bạn chưa vào học để tổ không bị tụt lại.</li>
              <li><strong>Đại diện tổ:</strong> Báo cáo tình hình thi đua và danh sách các bạn tích cực cho Thầy Thành.</li>
            </ul>
          </div>

          {/* CỘT 2: TỔ PHÓ */}
          <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-400/40 space-y-1.5">
            <div className="flex items-center gap-2 text-sky-900 dark:text-sky-200">
              <span className="w-7 h-7 rounded-xl bg-sky-500 text-white flex items-center justify-center font-black text-xs shadow-xs">
                ⭐
              </span>
              <div>
                <h4 className="text-xs sm:text-sm font-black uppercase">TỔ PHÓ (Vice Leader)</h4>
                <p className="text-[10px] text-sky-800 dark:text-sky-300 font-bold">Bầu từ học sinh có thành tích Top 2 của tổ</p>
              </div>
            </div>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside leading-relaxed pt-1">
              <li><strong>Hỗ trợ Tổ trưởng:</strong> Cùng tổ trưởng theo dõi chuyên cần và điểm số của các thành viên.</li>
              <li><strong>Kèm cặp bạn học:</strong> Giúp đỡ các bạn còn yếu về phát âm từ vựng hoặc ngữ pháp tiếng Anh.</li>
              <li><strong>Nhắc nhở chuỗi học:</strong> Động viên các bạn giữ chuỗi pháo hoa chuyên cần (streak) liên tục.</li>
            </ul>
          </div>

          {/* CỘT 3: THÀNH VIÊN */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-400/40 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
              <span className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-xs shadow-xs">
                👤
              </span>
              <div>
                <h4 className="text-xs sm:text-sm font-black uppercase">THÀNH VIÊN (Team Members)</h4>
                <p className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold">Cùng chung tay đưa tổ giành Cúp Quán Quân</p>
              </div>
            </div>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside leading-relaxed pt-1">
              <li><strong>Tự giác học tập:</strong> Mỗi ngày hoàn thành từ vựng, giải đề cương, làm bài thi thử online.</li>
              <li><strong>Đóng góp điểm số:</strong> 100% điểm cá nhân kiếm được sẽ cộng thẳng vào Tổng Điểm của Tổ.</li>
              <li><strong>Tinh thần đồng đội:</strong> Tương trợ, hỏi bạn và chia sẻ kinh nghiệm học tập tiếng Anh.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. NỘI DUNG CHÍNH THEO CHẾ ĐỘ XEM */}
      {viewScope === 'class_teams' ? (
        /* CHẾ ĐỘ 1: HIỂN THỊ 4 TỔ CỦA LỚP ĐANG CHỌN (GRID 2x2 HOẶC 4 CỘT) */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {teams.map(team => {
            const isMyTeam = myTeamInfo?.team.id === team.id;
            
            // Màu sắc theo colorTheme của tổ
            const borderStyle = isMyTeam 
              ? 'border-amber-400 ring-4 ring-amber-400/20' 
              : team.colorTheme === 'blue'
              ? 'border-blue-300 dark:border-blue-800'
              : team.colorTheme === 'emerald'
              ? 'border-emerald-300 dark:border-emerald-800'
              : team.colorTheme === 'amber'
              ? 'border-amber-300 dark:border-amber-800'
              : 'border-purple-300 dark:border-purple-800';

            const headerBg = team.colorTheme === 'blue'
              ? 'from-blue-600 to-indigo-700'
              : team.colorTheme === 'emerald'
              ? 'from-emerald-600 to-teal-700'
              : team.colorTheme === 'amber'
              ? 'from-amber-500 to-orange-600'
              : 'from-purple-600 to-indigo-700';

            return (
              <div 
                key={team.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl border-2 shadow-sm overflow-hidden flex flex-col justify-between transition-all ${borderStyle}`}
              >
                {/* HEADER TỔ */}
                <div>
                  <div className={`p-4 sm:p-5 bg-gradient-to-r ${headerBg} text-white relative`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          {getRankBadge(team.rankInClass)}
                          {isMyTeam && (
                            <span className="px-2 py-0.5 rounded-full bg-white text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-xs">
                              🛡️ TỔ CỦA EM
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                          {team.name}
                        </h3>

                        <p className="text-xs text-white/90 italic font-medium mt-0.5">
                          {team.slogan}
                        </p>
                      </div>

                      {/* TỔNG ĐIỂM TỔ */}
                      <div className="text-right shrink-0 bg-black/25 backdrop-blur-xs px-3 py-2 rounded-2xl border border-white/20">
                        <div className="text-[10px] uppercase font-bold text-amber-200">Tổng Điểm Tổ</div>
                        <div className="text-xl sm:text-2xl font-black text-amber-300 leading-none mt-0.5">
                          +{team.totalPoints}đ
                        </div>
                        <div className="text-[10px] text-white/80 mt-0.5">
                          TB: +{team.avgPoints}đ/bạn
                        </div>
                      </div>
                    </div>

                    {/* CHỈ SỐ QUÂN SỐ CÂN BẰNG: NAM/NỮ & ĐÃ THAM GIA */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap mt-3 pt-3 border-t border-white/20 text-xs font-semibold">
                      <span className="flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-lg">
                        <span>👥 Quân số: <strong>{team.totalCount} bạn</strong></span>
                      </span>
                      <span className="flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-lg">
                        <span>⚖️ Cân bằng: <strong>{team.maleCount} Nam • {team.femaleCount} Nữ</strong></span>
                      </span>
                      <span className="flex items-center gap-1 bg-white/15 px-2.5 py-1 rounded-lg">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Đã học: <strong>{team.participatedCount}/{team.totalCount} ({team.participationRate}%)</strong></span>
                      </span>
                    </div>
                  </div>

                  {/* KHUNG BAN CÁN SỰ TỔ: TỔ TRƯỞNG & TỔ PHÓ */}
                  <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center justify-between">
                      <span>👑 BAN CÁN SỰ DẪN DẮT TỔ:</span>
                      <span className="text-slate-500 font-normal">Bầu từ học sinh có thành tích cao nhất</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {/* TỔ TRƯỞNG */}
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-300/40 dark:border-amber-600/40 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                            👑
                          </span>
                          <div className="min-w-0">
                            <div className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase">
                              Tổ Trưởng (Team Leader)
                            </div>
                            <div className="font-black text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                              {team.leader?.name || 'Đang bầu chọn'}
                            </div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 font-black text-xs shrink-0">
                          +{team.leader?.points || 0}đ
                        </span>
                      </div>

                      {/* TỔ PHÓ */}
                      <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-300/40 dark:border-sky-600/40 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-8 h-8 rounded-xl bg-sky-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                            ⭐
                          </span>
                          <div className="min-w-0">
                            <div className="text-[10px] font-bold text-sky-800 dark:text-sky-300 uppercase">
                              Tổ Phó (Vice Leader)
                            </div>
                            <div className="font-black text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                              {team.viceLeader?.name || 'Đang bầu chọn'}
                            </div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-lg bg-sky-500 text-white font-black text-xs shrink-0">
                          +{team.viceLeader?.points || 0}đ
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* DANH SÁCH TẤT CẢ THÀNH VIÊN TRONG TỔ */}
                  <div className="p-3 sm:p-4 space-y-1.5 max-h-80 overflow-y-auto">
                    <div className="text-[11px] font-black uppercase text-slate-400 tracking-wider mb-2 flex items-center justify-between">
                      <span>DANH SÁCH THÀNH VIÊN ({team.members.length} em):</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        Đã tham gia: {team.participatedCount} • Chưa học: {team.totalCount - team.participatedCount}
                      </span>
                    </div>

                    {team.members.map((mem, memIdx) => {
                      const isMe = currentStudent?.name.trim().toLowerCase() === mem.name.trim().toLowerCase();

                      return (
                        <div 
                          key={mem.studentCode || memIdx}
                          className={`p-2 sm:p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs transition ${
                            isMe
                              ? 'bg-amber-100 dark:bg-amber-950/40 border-amber-400 shadow-2xs font-black'
                              : mem.hasParticipated
                              ? 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                              : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 text-center font-bold text-slate-400 text-[11px]">
                              {memIdx + 1}
                            </span>

                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                              mem.role === 'leader'
                                ? 'bg-amber-400 text-slate-950'
                                : mem.role === 'vice_leader'
                                ? 'bg-sky-500 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}>
                              {mem.roleBadge}
                            </span>

                            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              mem.gender === 'Nữ'
                                ? 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            }`}>
                              {mem.gender}
                            </span>

                            <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                              {mem.name}
                              {isMe && <span className="ml-1 text-amber-600 dark:text-amber-400 font-black">(Em)</span>}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {mem.hasParticipated ? (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>+{mem.points}đ</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenRemind(mem, team)}
                                className="px-2 py-0.5 rounded-md bg-rose-100 hover:bg-rose-200 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold text-[10px] flex items-center gap-1 transition cursor-pointer border border-rose-300 dark:border-rose-800"
                                title="Gửi lời nhắn thân thiện nhắc bạn vào học cùng tổ"
                              >
                                <MessageSquare className="w-3 h-3 text-rose-600" />
                                <span>Nhắc học 🔔</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* FOOTER TỔ: LỜI KÊU GỌI HÀNH ĐỘNG */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Mỗi bài từ vựng học thuộc: <strong>+10đ đến +20đ</strong> cho tổ
                  </span>

                  {isMyTeam && (
                    <button
                      type="button"
                      onClick={onGoToVocab}
                      className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1"
                    >
                      <span>Học Kiếm Điểm Cho Tổ &rarr;</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* CHẾ ĐỘ 2: BẢNG XẾP HẠNG ĐUA TOP 20 TỔ TOÀN KHỐI (KHỐI 6 HOẶC KHỐI 8) */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>BẢNG VÀNG ĐUA TOP 20 TỔ TOÀN KHỐI {currentGrade}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gồm 20 tổ của 5 lớp Khối {currentGrade} (6A1-6A5 hoặc 8A1-8A5) cùng đua tài giành Cúp Vàng
              </p>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300 font-bold bg-amber-50 dark:bg-amber-950/40 border border-amber-300 px-3 py-1.5 rounded-xl">
              🏆 Tổ Quán Quân Khối được thưởng nóng +100 điểm tập thể!
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-black text-[11px] border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3 text-center">Hạng Khối</th>
                  <th className="p-3">Tổ Thi Đua</th>
                  <th className="p-3 text-center">Lớp</th>
                  <th className="p-3">Tổ Trưởng (TL)</th>
                  <th className="p-3 text-center">Quân Số</th>
                  <th className="p-3 text-center">Tỷ Lệ Học</th>
                  <th className="p-3 text-right">Tổng Điểm Tổ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {gradeLeaderboard.map((team, idx) => {
                  const isTop1 = idx === 0;
                  const isTop2 = idx === 1;
                  const isTop3 = idx === 2;
                  const isMyTeamInLeaderboard = myTeamInfo?.team.id === team.id;

                  return (
                    <tr 
                      key={team.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition ${
                        isMyTeamInLeaderboard 
                          ? 'bg-amber-50 dark:bg-amber-950/30 font-black' 
                          : isTop1 
                          ? 'bg-amber-500/10' 
                          : ''
                      }`}
                    >
                      <td className="p-3 text-center">
                        {isTop1 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black inline-flex items-center justify-center shadow-xs">
                            🥇
                          </span>
                        ) : isTop2 ? (
                          <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-900 font-black inline-flex items-center justify-center shadow-xs">
                            🥈
                          </span>
                        ) : isTop3 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-800 text-white font-black inline-flex items-center justify-center shadow-xs">
                            🥉
                          </span>
                        ) : (
                          <span className="text-slate-500 font-bold text-xs">{idx + 1}</span>
                        )}
                      </td>

                      <td className="p-3 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <span>{team.name}</span>
                          {isMyTeamInLeaderboard && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 text-[10px] font-black">
                              Tổ Em
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-black">
                          {team.className}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                          <Crown className="w-3.5 h-3.5 text-amber-500" />
                          <span>{team.leader?.name || '---'}</span>
                        </div>
                      </td>

                      <td className="p-3 text-center text-slate-600 dark:text-slate-400">
                        {team.totalCount} em ({team.maleCount}N • {team.femaleCount}Nu)
                      </td>

                      <td className="p-3 text-center">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {team.participatedCount}/{team.totalCount} ({team.participationRate}%)
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <span className="text-sm font-black text-amber-600 dark:text-amber-400">
                          +{team.totalPoints}đ
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. MODAL NHẮC BẠN VÀO HỌC CÙNG TỔ */}
      {remindTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-rose-400/40 overflow-hidden">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-600 to-amber-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔔</span>
                <div>
                  <h3 className="font-black text-base sm:text-lg">GỬI LỜI NHẮC HỌC TẬP CÙNG TỔ</h3>
                  <p className="text-xs text-rose-100">
                    Tổ {remindTarget.team.teamNumber} • Lớp {selectedClass}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRemindTarget(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-3.5">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-xs text-amber-900 dark:text-amber-200">
                <strong>Bạn nhận lời nhắc:</strong> <span className="font-black text-base text-blue-600 dark:text-blue-400">{remindTarget.member.name}</span>
                <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                  Tổ Trưởng hoặc các thành viên hãy copy lời nhắn thân thiện bên dưới để gửi Zalo hoặc nhắc bạn vào học nhé!
                </p>
              </div>

              {/* NỘI DUNG TIN NHẮN MẪU THÂN THIỆN */}
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs leading-relaxed text-slate-800 dark:text-slate-200 italic font-medium">
                "📢 [NHẮC BÀI CÙNG TỔ {remindTarget.team.teamNumber}] Chào bạn {remindTarget.member.name} thân mến! {remindTarget.team.name} lớp {selectedClass} đang rất cần điểm thi đua của bạn để cùng vươn lên Top 1 Quán Quân! Bạn tranh thủ vào web làm 1-2 bài từ vựng và bài thi thử nhé. Cố lên bạn ơi! 🚀"
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyRemind}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{copiedRemindText ? '✅ Đã Copy Lời Nhắc!' : 'Sao Chép Lời Nhắc Thân Thiện'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRemindTarget(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
