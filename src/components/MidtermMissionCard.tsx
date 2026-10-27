import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Trophy, 
  Target, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  ShieldCheck, 
  BookOpen, 
  FileText, 
  HelpCircle,
  Award
} from 'lucide-react';
import { 
  midtermMissionService, 
  MidtermMissionState, 
  VOCAB_MODES_CONFIG 
} from '../services/midtermMissionService';
import { StudentProfile } from '../services/studentGradebookService';

interface MidtermMissionCardProps {
  currentStudent: StudentProfile;
  onGoToVocabUnit?: (unitNumber: number) => void;
  onGoToDecuong?: () => void;
  onGoToExam?: () => void;
}

export const MidtermMissionCard: React.FC<MidtermMissionCardProps> = ({
  currentStudent,
  onGoToVocabUnit,
  onGoToDecuong,
  onGoToExam
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeUnitTab, setActiveUnitTab] = useState<number>(1);

  const missionState: MidtermMissionState = midtermMissionService.getMissionState(
    currentStudent.id,
    currentStudent.name,
    currentStudent.className,
    currentStudent.grade || 8
  );

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl border-2 border-indigo-400/50 shadow-2xl overflow-hidden mb-6 transition-all duration-300">
      {/* 1. HEADER BANNER NHIỆM VỤ */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-900/80 via-indigo-900/80 to-purple-900/80 border-b border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-300 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/20 shrink-0">
            🎯
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-200 border border-cyan-400/30 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                Học Kỳ 1
              </span>
              <span className="text-xs text-slate-300">
                Thầy Đinh Văn Thành
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Kế Hoạch Ôn Tập Giữa Kỳ 1
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Hoàn thành từ vựng Unit 1 - 3 và làm bài ôn luyện đề cương, đề thi thử đạt chất lượng.
            </p>
          </div>
        </div>

        {/* NÚT THU GỌN / MỞ RỘNG & TỔNG TIẾN ĐỘ NHANH */}
        <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
          <div className="text-right">
            <div className="text-[11px] text-blue-200 font-bold uppercase">Tổng Tiến Độ GK1</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 flex items-center justify-end gap-1">
              <span>{missionState.totalProgressPercent}%</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-white/20"
          >
            <span>{isExpanded ? 'Thu gọn' : 'Xem chi tiết'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* THANH TIẾN ĐỘ TỔNG THỂ */}
      <div className="h-2.5 w-full bg-slate-800/80 relative overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 transition-all duration-700 ease-out shadow-lg"
          style={{ width: `${missionState.totalProgressPercent}%` }}
        />
      </div>

      {/* 2. NỘI DUNG CHI TIẾT 2 NHIỆM VỤ */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-6 animate-in fade-in duration-200">
          {/* LỜI NHẬN XÉT SƯ PHẠM CỦA THẦY THÀNH */}
          <div className="bg-slate-900/80 rounded-2xl border-2 border-indigo-500/40 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-inner">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
                👨‍🏫
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-black text-sm text-cyan-300">Đánh Giá Tiến Độ:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black border ${missionState.levelColor}`}>
                    {missionState.levelBadgeText}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {missionState.teacherEvaluation}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cập nhật liên tục theo bài làm thực tế</span>
            </div>
          </div>

          {/* GRID 2 CỘT: NHIỆM VỤ 1 & NHIỆM VỤ 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* ============================================================== */}
            {/* NHIỆM VỤ 1: LÀM CHỦ TỪ VỰNG UNIT 1 - 3 Ở TẤT CẢ CÁC DẠNG BÀI */}
            {/* ============================================================== */}
            <div className="bg-slate-900/90 rounded-2xl border border-indigo-500/30 p-4 sm:p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-blue-500/20 text-blue-300 font-black text-sm">
                      NHIỆM VỤ 1
                    </span>
                    <h4 className="font-black text-base text-white">
                      Làm Chủ Từ Vựng Unit 1 - 3
                    </h4>
                  </div>
                  <span className="text-sm font-black text-emerald-400">
                    {missionState.mission1.overallPercent}%
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-3">
                  Phải học đầy đủ 11 dạng bài tập. <strong className="text-amber-300">Chống học chống đối:</strong> Chỉ tính % khi đạt độ chính xác từ 60% trở lên (chứng minh đã nắm được từ vựng).
                </p>

                {/* TAB CHỌN UNIT 1, UNIT 2, UNIT 3 */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl mb-3 border border-slate-800">
                  {[1, 2, 3].map(uNum => {
                    const uData = missionState.mission1.units[uNum];
                    return (
                      <button
                        key={uNum}
                        type="button"
                        onClick={() => setActiveUnitTab(uNum)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                          activeUnitTab === uNum
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <span>Unit {uNum}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${uData?.unitPercent >= 100 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                          {uData?.unitPercent || 0}%
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* CHI TIẾT CÁC DẠNG BÀI CỦA UNIT ĐANG CHỌN */}
                {(() => {
                  const currentUnitData = missionState.mission1.units[activeUnitTab];
                  if (!currentUnitData) return null;
                  return (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span>Trạng thái Unit {activeUnitTab}:</span>
                        <span className="font-bold text-cyan-300">
                          {currentUnitData.qualityPassedCount} / {currentUnitData.totalRequiredModes} dạng bài đạt chuẩn
                        </span>
                      </div>

                      {/* Tiến độ thanh Unit */}
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${currentUnitData.unitPercent}%` }}
                        />
                      </div>

                      {/* Danh sách 11 dạng bài checklist */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
                        {VOCAB_MODES_CONFIG.map(m => {
                          const modeRes = currentUnitData.modes[m.id];
                          const isPassed = modeRes?.qualityPassed;
                          return (
                            <div 
                              key={m.id}
                              className={`p-2 rounded-xl border flex items-center justify-between gap-1.5 transition ${
                                isPassed
                                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                                  : (modeRes?.completed 
                                      ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                                      : 'bg-slate-950/50 border-slate-800 text-slate-400')
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <span>{m.icon}</span>
                                <span className="font-bold truncate" title={m.title}>{m.title}</span>
                              </div>
                              <div className="shrink-0">
                                {isPassed ? (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded-md">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    <span>Đạt</span>
                                  </span>
                                ) : (
                                  modeRes?.completed ? (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-400 bg-rose-500/20 px-1.5 py-0.5 rounded-md" title={modeRes.note}>
                                      <AlertCircle className="w-3 h-3 text-rose-400" />
                                      <span>Làm lại</span>
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-slate-500">Chưa học</span>
                                  )
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* NÚT VÀO HỌC UNIT NGAY */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => onGoToVocabUnit && onGoToVocabUnit(activeUnitTab)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-cyan-300" />
                  <span>Vào Luyện Từ Vựng Unit {activeUnitTab} Ngay (+10đ/bài)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ============================================================== */}
            {/* NHIỆM VỤ 2: ÔN ĐỀ CƯƠNG & LÀM BÀI THI THỬ GIỮA KỲ 1 */}
            {/* ============================================================== */}
            <div className="bg-slate-900/90 rounded-2xl border border-indigo-500/30 p-4 sm:p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 font-black text-sm">
                      NHIỆM VỤ 2
                    </span>
                    <h4 className="font-black text-base text-white">
                      Ôn Đề Cương &amp; Thi Thử GK1
                    </h4>
                  </div>
                  <span className="text-sm font-black text-amber-400">
                    {missionState.mission2.overallPercent}%
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-3">
                  Mỗi bài tối thiểu 1 lần. <strong className="text-amber-300">Yêu cầu chất lượng:</strong> Bắt buộc đạt điểm từ 5.0 trở lên, làm nghiêm túc không chọn bừa sai lỗi lung tung.
                </p>

                {/* 2 MỤC CON: ĐỀ CƯƠNG VÀ ĐỀ THI */}
                <div className="space-y-3">
                  {/* Mục 1: Đề Cương Ôn Tập GK1 */}
                  <div className={`p-3.5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    missionState.mission2.decuong.qualityPassed
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  }`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base">📖</span>
                        <h5 className="font-black text-xs sm:text-sm text-white">
                          Đề Cương Ôn Tập Giữa Kỳ 1 (Có Audio & Tự Chấm)
                        </h5>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                        <span>Đã làm: <strong className="text-white">{missionState.mission2.decuong.attemptsCount} lần</strong></span>
                        <span>•</span>
                        <span>Điểm cao nhất: <strong className="text-amber-300">{missionState.mission2.decuong.highestScore > 0 ? `${missionState.mission2.decuong.highestScore}/10đ` : 'Chưa có'}</strong></span>
                      </div>
                      <div className="text-[11px] mt-0.5">
                        {missionState.mission2.decuong.qualityPassed ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Đã đạt yêu cầu chất lượng của Thầy Thành</span>
                          </span>
                        ) : (
                          <span className="text-amber-400/90 font-medium">
                            {missionState.mission2.decuong.statusNote}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onGoToDecuong}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs transition flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{missionState.mission2.decuong.attemptsCount > 0 ? 'Làm Lại Đề Cương' : 'Vào Làm Đề Cương'}</span>
                    </button>
                  </div>

                  {/* Mục 2: Đề Kiểm Tra Giữa Kỳ 1 Online */}
                  <div className={`p-3.5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    missionState.mission2.midtermExam.qualityPassed
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  }`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base">📝</span>
                        <h5 className="font-black text-xs sm:text-sm text-white">
                          Đề Kiểm Tra Giữa Kỳ 1 Online (10 Đề Hoán Đổi)
                        </h5>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                        <span>Đã làm: <strong className="text-white">{missionState.mission2.midtermExam.attemptsCount} lần</strong></span>
                        <span>•</span>
                        <span>Điểm cao nhất: <strong className="text-amber-300">{missionState.mission2.midtermExam.highestScore > 0 ? `${missionState.mission2.midtermExam.highestScore}/10đ` : 'Chưa có'}</strong></span>
                      </div>
                      <div className="text-[11px] mt-0.5">
                        {missionState.mission2.midtermExam.qualityPassed ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Đã đạt yêu cầu chất lượng của Thầy Thành</span>
                          </span>
                        ) : (
                          <span className="text-amber-400/90 font-medium">
                            {missionState.mission2.midtermExam.statusNote}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onGoToExam}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 cursor-pointer shadow-xs transition flex items-center gap-1"
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>{missionState.mission2.midtermExam.attemptsCount > 0 ? 'Thi Thử Lại GK1' : 'Vào Thi Thử GK1'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* LỜI NHẮC QUY CHẾ */}
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Hoàn thành tốt cả 2 bài với điểm số cao sẽ được cộng tối đa <strong>+100 điểm thi đua chuyên cần</strong>!</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
