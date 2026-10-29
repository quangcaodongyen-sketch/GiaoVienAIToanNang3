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
  Clock,
  ChevronDown,
  ChevronUp
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
  const [showRules, setShowRules] = useState<boolean>(false);

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

  // Thao tác chia lại tổ ngẫu nhiên (CHỈ ADMIN MỚI CÓ QUYỀN!)
  const handleReshuffleTeams = () => {
    if (!isAdmin) {
      alert('⛔ Quyền bị từ chối: Chỉ có Quản trị viên (Admin) mới có quyền chia lại danh sách tổ của lớp!');
      return;
    }
    if (!window.confirm(`Thầy có chắc chắn muốn TÁI PHÂN CHIA 4 TỔ NGẪU NHIÊN CÂN BẰNG cho Lớp ${selectedClass} không?\nHệ thống sẽ tự động cân bằng lại Nam/Nữ và bầu lại Tổ Trưởng, Tổ Phó.`)) {
      return;
    }
    classTeamService.getClassTeams(selectedClass, true);
    setRefreshTrigger(prev => prev + 1);
    alert(`🎉 ĐÃ CHIA LẠI 4 TỔ CHO LỚP ${selectedClass} THÀNH CÔNG!`);
  };

  // Mở tin nhắn nhắc nhở bạn học
  const handleOpenRemind = (member: ClassTeamMember, team: ClassTeam) => {
    setRemindTarget({ member, team });
    setCopiedRemindText(false);
  };

  // Copy tin nhắn nhắc bạn
  const handleCopyRemind = () => {
    if (!remindTarget) return;
    const txt = `📢 [NHẮC BÀI CÙNG TỔ ${remindTarget.team.teamNumber}] Chào bạn ${remindTarget.member.name} thân mến! ${remindTarget.team.name} lớp ${selectedClass} đang rất cần điểm thi đua của bạn để cùng vươn lên Top 1 Quán Quân! Bạn tranh thủ vào web làm 1-2 bài từ vựng và bài kiểm tra thử nhé. Cố lên bạn ơi! 🚀`;
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
    <div className="space-y-4">
      {/* 1. BANNER TIÊU ĐỀ SƯ PHẠM GỌN NHẸ */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-950 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-sky-800/40 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  THI ĐUA 4 TỔ HỌC ĐƯỜNG
                </span>
                {currentStudent && myTeamInfo && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[11px] font-black tracking-wider flex items-center gap-1 shadow-xs">
                    <span>Em thuộc: {myTeamInfo.team.name} ({myTeamInfo.member.roleTitle})</span>
                  </span>
                )}
              </div>

              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                <span>🛡️ ĐẤU TRƯỜNG 4 TỔ THI ĐUA — LỚP {selectedClass}</span>
              </h2>

              <p className="text-xs text-sky-200 font-normal mt-0.5">
                Chia đều 4 tổ cân bằng Nam/Nữ • 100% điểm cá nhân đóng góp trực tiếp vào Tổng điểm của Tổ
              </p>
            </div>

            {/* BỘ CHUYỂN CHẾ ĐỘ XEM: 4 TỔ TRONG LỚP HOẶC ĐUA TOP KHỐI */}
            <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/20 shrink-0">
              <button
                type="button"
                onClick={() => setViewScope('class_teams')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                  viewScope === 'class_teams'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>4 Tổ Lớp {selectedClass}</span>
              </button>

              <button
                type="button"
                onClick={() => setViewScope('grade_leaderboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                  viewScope === 'grade_leaderboard'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Top 20 Tổ Khối {currentGrade}</span>
              </button>
            </div>
          </div>

          {/* DÒNG CHỌN LỚP TINH GỌN */}
          <div className="flex items-center justify-between gap-2 flex-wrap pt-2.5 border-t border-white/10 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sky-300 font-bold text-[11px] hidden sm:inline">Chọn lớp:</span>
              {officialClasses.map(cls => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setSelectedClass(cls)}
                  className={`px-2.5 py-0.5 rounded-md font-black text-xs transition cursor-pointer ${
                    selectedClass === cls
                      ? 'bg-amber-400 text-slate-950 shadow-xs ring-2 ring-amber-300'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>

            {/* NÚT TÁI PHÂN TỔ: CHỈ ADMIN MỚI CÓ QUYỀN */}
            {isAdmin ? (
              <button
                type="button"
                onClick={handleReshuffleTeams}
                className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-black text-[11px] transition cursor-pointer flex items-center gap-1 shadow-xs ml-auto border border-amber-300"
                title="Chỉ có Quản trị viên mới có quyền chia lại 4 tổ ngẫu nhiên cân bằng"
              >
                <RotateCw className="w-3 h-3" />
                <span>🎲 Chia Lại 4 Tổ (Admin)</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* 2. KHUNG QUY CHẾ & NHIỆM VỤ GỌN GÀNG (COLLAPSIBLE - KHÔNG CHIẾM DIỆN TÍCH) */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => setShowRules(!showRules)}
          className="w-full px-4 py-2.5 flex items-center justify-between gap-2 text-left bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              Quy chế thi đua 4 Tổ &amp; Phân công nhiệm vụ (Tổ Trưởng, Tổ Phó, Thành Viên)
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 shrink-0">
            <span>{showRules ? 'Thu gọn' : 'Xem chi tiết'}</span>
            {showRules ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </button>

        {showRules && (
          <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 space-y-1">
              <strong className="text-amber-800 dark:text-amber-300 block text-xs">👑 TỔ TRƯỞNG:</strong>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                Theo dõi tiến độ học hàng ngày, đôn đốc các bạn chưa vào học để tổ không bị tụt hạng.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-400/30 space-y-1">
              <strong className="text-sky-800 dark:text-sky-300 block text-xs">⭐ TỔ PHÓ:</strong>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                Hỗ trợ kèm cặp các bạn còn yếu từ vựng/ngữ pháp, nhắc nhở giữ chuỗi ngày học chuyên cần.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/30 space-y-1">
              <strong className="text-emerald-800 dark:text-emerald-300 block text-xs">👤 THÀNH VIÊN:</strong>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                Tự giác học từ vựng, làm đề thử online. 100% điểm cá nhân kiếm được sẽ cộng thẳng vào Tổ.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. NỘI DUNG CHÍNH: HIỂN THỊ 4 TỔ CỦA LỚP */}
      {viewScope === 'class_teams' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {teams.map(team => {
            const isMyTeam = myTeamInfo?.team.id === team.id;
            
            const borderStyle = isMyTeam 
              ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-md' 
              : 'border-slate-200 dark:border-slate-800';

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
                className={`bg-white dark:bg-slate-900 rounded-2xl border shadow-xs overflow-hidden flex flex-col justify-between transition-all ${borderStyle}`}
              >
                {/* HEADER TỔ */}
                <div>
                  <div className={`p-3 sm:p-4 bg-gradient-to-r ${headerBg} text-white`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          {getRankBadge(team.rankInClass)}
                          {isMyTeam && (
                            <span className="px-2 py-0.5 rounded-full bg-white text-slate-950 font-black text-[10px] uppercase shadow-xs">
                              🛡️ TỔ CỦA EM
                            </span>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-black text-white">
                          {team.name}
                        </h3>

                        <p className="text-[11px] text-white/90 italic font-medium">
                          {team.slogan}
                        </p>
                      </div>

                      {/* TỔNG ĐIỂM TỔ */}
                      <div className="text-right shrink-0 bg-black/25 px-2.5 py-1.5 rounded-xl border border-white/20">
                        <div className="text-[10px] uppercase font-bold text-amber-200">Tổng Điểm</div>
                        <div className="text-lg sm:text-xl font-black text-amber-300 leading-none mt-0.5">
                          +{team.totalPoints}đ
                        </div>
                        <div className="text-[10px] text-white/80 mt-0.5">
                          TB: +{team.avgPoints}đ
                        </div>
                      </div>
                    </div>

                    {/* QUÂN SỐ & TỶ LỆ HỌC */}
                    <div className="flex items-center gap-2 flex-wrap mt-2.5 pt-2 border-t border-white/20 text-[11px] font-semibold">
                      <span>👥 {team.totalCount} bạn ({team.maleCount} Nam • {team.femaleCount} Nữ)</span>
                      <span>•</span>
                      <span className="text-emerald-200">
                        Đã học: <strong>{team.participatedCount}/{team.totalCount} ({team.participationRate}%)</strong>
                      </span>
                    </div>
                  </div>

                  {/* BAN CÁN SỰ TỔ GỌN GÀNG (1 DÒNG) */}
                  <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-amber-500 font-bold">👑 TT:</span>
                      <strong className="text-slate-800 dark:text-slate-200 truncate">
                        {team.leader?.name || 'Chưa có'}
                      </strong>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                        (+{team.leader?.points || 0}đ)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-sky-500 font-bold">⭐ TP:</span>
                      <strong className="text-slate-800 dark:text-slate-200 truncate">
                        {team.viceLeader?.name || 'Chưa có'}
                      </strong>
                      <span className="text-[10px] text-sky-600 dark:text-sky-400 font-bold">
                        (+{team.viceLeader?.points || 0}đ)
                      </span>
                    </div>
                  </div>

                  {/* DANH SÁCH THÀNH VIÊN TRONG TỔ */}
                  <div className="p-2 sm:p-3 space-y-1 max-h-64 overflow-y-auto">
                    {team.members.map((mem, memIdx) => {
                      const isMe = currentStudent?.name.trim().toLowerCase() === mem.name.trim().toLowerCase();

                      return (
                        <div 
                          key={mem.studentCode || memIdx}
                          className={`p-1.5 sm:p-2 rounded-lg border flex items-center justify-between gap-1.5 text-xs transition ${
                            isMe
                              ? 'bg-amber-100 dark:bg-amber-950/40 border-amber-400 font-black'
                              : mem.hasParticipated
                              ? 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                              : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            <span className="w-4 text-center font-bold text-slate-400 text-[10px] shrink-0">
                              {memIdx + 1}
                            </span>

                            <span className={`px-1 py-0.2 rounded text-[9px] font-black shrink-0 ${
                              mem.role === 'leader'
                                ? 'bg-amber-400 text-slate-950'
                                : mem.role === 'vice_leader'
                                ? 'bg-sky-500 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}>
                              {mem.roleBadge}
                            </span>

                            <span 
                              className="font-bold text-slate-800 dark:text-slate-200 truncate flex-1 min-w-0 text-xs"
                              title={mem.name}
                            >
                              {mem.name}
                              {isMe && <span className="ml-1 text-amber-600 dark:text-amber-400 font-black shrink-0">(Em)</span>}
                            </span>
                          </div>

                          <div className="shrink-0">
                            {mem.hasParticipated ? (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                                +{mem.points}đ
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenRemind(mem, team)}
                                className="px-1.5 py-0.5 rounded bg-rose-100 hover:bg-rose-200 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold text-[10px] transition cursor-pointer border border-rose-300 dark:border-rose-800 flex items-center gap-0.5"
                                title="Gửi lời nhắn nhắc bạn vào học cùng tổ"
                              >
                                <MessageSquare className="w-2.5 h-2.5 text-rose-600" />
                                <span>Nhắc học</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* FOOTER TỔ: KÊU GỌI HÀNH ĐỘNG */}
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Học từ vựng: <strong>+10đ đến +20đ</strong>/bài
                  </span>

                  {isMyTeam && (
                    <button
                      type="button"
                      onClick={onGoToVocab}
                      className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1 shadow-2xs active:scale-95"
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
        /* CHẾ ĐỘ 2: BẢNG XẾP HẠNG ĐUA TOP 20 TỔ TOÀN KHỐI */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>BẢNG VÀNG ĐUA TOP 20 TỔ KHỐI {currentGrade}</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                20 tổ của 5 lớp Khối {currentGrade} (6A1-6A5 hoặc 8A1-8A5) đua tài giành Cúp Vàng
              </p>
            </div>

            <div className="text-[11px] text-amber-800 dark:text-amber-300 font-bold bg-amber-50 dark:bg-amber-950/40 border border-amber-300 px-2.5 py-1 rounded-lg">
              🏆 Tổ Quán Quân Khối được thưởng nóng +100 điểm tập thể!
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-black text-[10px] border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-2.5 text-center">Hạng</th>
                  <th className="p-2.5">Tổ Thi Đua</th>
                  <th className="p-2.5 text-center">Lớp</th>
                  <th className="p-2.5">Tổ Trưởng</th>
                  <th className="p-2.5 text-center">Quân Số</th>
                  <th className="p-2.5 text-center">Tỷ Lệ Học</th>
                  <th className="p-2.5 text-right">Tổng Điểm</th>
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
                      <td className="p-2.5 text-center">
                        {isTop1 ? (
                          <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black inline-flex items-center justify-center text-xs shadow-xs">
                            🥇
                          </span>
                        ) : isTop2 ? (
                          <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-900 font-black inline-flex items-center justify-center text-xs shadow-xs">
                            🥈
                          </span>
                        ) : isTop3 ? (
                          <span className="w-5 h-5 rounded-full bg-amber-800 text-white font-black inline-flex items-center justify-center text-xs shadow-xs">
                            🥉
                          </span>
                        ) : (
                          <span className="text-slate-500 font-bold text-xs">{idx + 1}</span>
                        )}
                      </td>

                      <td className="p-2.5 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <span>{team.name}</span>
                          {isMyTeamInLeaderboard && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 text-[9px] font-black">
                              Tổ Em
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-2.5 text-center">
                        <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-black text-[11px]">
                          {team.className}
                        </span>
                      </td>

                      <td className="p-2.5">
                        <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                          <Crown className="w-3 h-3 text-amber-500" />
                          <span>{team.leader?.name || '---'}</span>
                        </div>
                      </td>

                      <td className="p-2.5 text-center text-slate-600 dark:text-slate-400 text-[11px]">
                        {team.totalCount} ({team.maleCount}N • {team.femaleCount}Nữ)
                      </td>

                      <td className="p-2.5 text-center">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                          {team.participatedCount}/{team.totalCount} ({team.participationRate}%)
                        </span>
                      </td>

                      <td className="p-2.5 text-right">
                        <span className="text-xs font-black text-amber-600 dark:text-amber-400">
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full shadow-2xl border border-rose-400/40 overflow-hidden">
            <div className="p-3.5 bg-gradient-to-r from-rose-600 to-amber-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔔</span>
                <div>
                  <h3 className="font-black text-sm sm:text-base">GỬI LỜI NHẮC BẠN HỌC CÙNG TỔ</h3>
                  <p className="text-[11px] text-rose-100">
                    Tổ {remindTarget.team.teamNumber} • Lớp {selectedClass}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRemindTarget(null)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-xs text-amber-900 dark:text-amber-200">
                <strong>Bạn nhận lời nhắc:</strong> <span className="font-black text-sm text-blue-600 dark:text-blue-400">{remindTarget.member.name}</span>
                <p className="mt-0.5 text-[10px] text-slate-600 dark:text-slate-400">
                  Hãy sao chép lời nhắn thân thiện bên dưới để gửi Zalo nhắc bạn vào học kiếm điểm cho tổ nhé!
                </p>
              </div>

              {/* NỘI DUNG TIN NHẮN MẪU THÂN THIỆN */}
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs leading-relaxed text-slate-800 dark:text-slate-200 italic font-medium">
                "📢 [NHẮC BÀI CÙNG TỔ {remindTarget.team.teamNumber}] Chào bạn {remindTarget.member.name} thân mến! {remindTarget.team.name} lớp {selectedClass} đang rất cần điểm thi đua của bạn để cùng vươn lên Top 1 Quán Quân! Bạn tranh thủ vào web làm 1-2 bài từ vựng và bài kiểm tra thử nhé. Cố lên bạn ơi! 🚀"
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyRemind}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 text-slate-950 font-black text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{copiedRemindText ? '✅ Đã Copy Lời Nhắc!' : 'Sao Chép Lời Nhắc'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRemindTarget(null)}
                  className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs"
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
