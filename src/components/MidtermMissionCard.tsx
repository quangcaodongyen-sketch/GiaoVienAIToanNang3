import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Target, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  BookOpen, 
  FileText, 
  Award,
  Sparkles
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
    <div className="bg-[#0B1E36] text-white rounded-2xl border border-blue-500/30 shadow-xl overflow-hidden mb-5 transition-all duration-300">
      
      {/* 1. HEADER BANNER: MÀU XANH DỊU MẮT, CHỮ TRẮNG TƯƠNG PHẢN CAO */}
      <div className="p-3.5 sm:p-5 bg-gradient-to-r from-[#0E2746] to-[#14365D] border-b border-blue-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-600/30 border border-blue-400/40 text-cyan-300 flex items-center justify-center text-xl shrink-0">
            🎯
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                Kế Hoạch Ôn Tập Giữa Kỳ 1
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-cyan-200 border border-blue-400/30 text-[11px] font-bold">
                Lớp {currentStudent.className || '8A1'}
              </span>
            </div>
            <p className="text-xs text-blue-200/90 mt-0.5">
              Từ vựng Unit 1 - 3, đề cương ôn tập và đề kiểm tra thử trực tuyến
            </p>
          </div>
        </div>

        {/* TIẾN ĐỘ TỔNG & NÚT THU GỌN */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          <div className="text-right">
            <span className="text-[11px] text-blue-200 font-semibold block">Tiến độ chung</span>
            <span className="text-xl sm:text-2xl font-black text-cyan-300">
              {missionState.totalProgressPercent}%
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2.5 py-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1 transition cursor-pointer border border-blue-700/50"
          >
            <span>{isExpanded ? 'Thu gọn' : 'Chi tiết'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* THANH TIẾN ĐỘ DỊU MẮT */}
      <div className="h-2 w-full bg-slate-900 relative overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-teal-400 to-cyan-400 transition-all duration-500 ease-out"
          style={{ width: `${missionState.totalProgressPercent}%` }}
        />
      </div>

      {/* 2. NỘI DUNG 2 NHIỆM VỤ: TỐI GIẢN - RÕ NÉT - DỄ SỬ DỤNG */}
      {isExpanded && (
        <div className="p-3.5 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* ==================== CỘT 1: NHIỆM VỤ TỪ VỰNG ==================== */}
            <div className="bg-[#0D233E] rounded-xl border border-blue-500/25 p-3.5 sm:p-4 flex flex-col justify-between space-y-3">
              <div>
                {/* Header Nhiệm Vụ 1 */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-600/30 text-cyan-300 font-bold text-xs border border-blue-400/30">
                      Nhiệm vụ 1
                    </span>
                    <h4 className="font-bold text-sm sm:text-base text-white">
                      Từ Vựng Unit 1 - 3
                    </h4>
                  </div>
                  <span className="text-sm font-bold text-cyan-300">
                    {missionState.mission1.overallPercent}%
                  </span>
                </div>

                <p className="text-xs text-blue-200/80 mb-3">
                  Luyện tập các dạng bài tập từ vựng trọng tâm theo từng Unit.
                </p>

                {/* Tabs Chọn Unit */}
                <div className="flex items-center gap-1.5 p-1 bg-[#091B30] rounded-lg mb-3 border border-blue-900/50">
                  {[1, 2, 3].map(uNum => {
                    const uData = missionState.mission1.units[uNum];
                    const isActive = activeUnitTab === uNum;
                    return (
                      <button
                        key={uNum}
                        type="button"
                        onClick={() => setActiveUnitTab(uNum)}
                        className={`flex-1 py-1.5 px-2 rounded-md text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-blue-200 hover:text-white hover:bg-blue-900/40'
                        }`}
                      >
                        <span>Unit {uNum}</span>
                        <span className={`text-[10px] px-1 rounded ${uData?.unitPercent >= 100 ? 'bg-emerald-500/30 text-emerald-300' : 'text-blue-300'}`}>
                          {uData?.unitPercent || 0}%
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Danh sách 11 dạng bài của Unit đang chọn */}
                {(() => {
                  const currentUnitData = missionState.mission1.units[activeUnitTab];
                  if (!currentUnitData) return null;
                  return (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-blue-200">
                        <span>Trạng thái Unit {activeUnitTab}:</span>
                        <span className="font-bold text-cyan-300">
                          {currentUnitData.qualityPassedCount} / {currentUnitData.totalRequiredModes} dạng bài đạt
                        </span>
                      </div>

                      {/* Checklist các dạng bài gọn gàng */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-44 overflow-y-auto pr-1 text-xs">
                        {VOCAB_MODES_CONFIG.map(m => {
                          const modeRes = currentUnitData.modes[m.id];
                          const isPassed = modeRes?.qualityPassed;
                          return (
                            <div 
                              key={m.id}
                              className={`p-2 rounded-lg border flex items-center justify-between gap-1.5 transition ${
                                isPassed
                                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                                  : 'bg-[#091B30] border-blue-900/40 text-slate-200'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <span>{m.icon}</span>
                                <span className="font-medium text-white truncate" title={m.title}>{m.title}</span>
                              </div>
                              <div className="shrink-0 text-[10px]">
                                {isPassed ? (
                                  <span className="inline-flex items-center gap-0.5 text-emerald-300 font-bold bg-emerald-500/20 px-1.5 py-0.5 rounded">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    <span>Đạt</span>
                                  </span>
                                ) : (
                                  <span className="text-slate-400">Chưa học</span>
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

              {/* Nút hành động Nhiệm vụ 1 */}
              <div className="pt-2 border-t border-blue-900/40">
                <button
                  type="button"
                  onClick={() => onGoToVocabUnit && onGoToVocabUnit(activeUnitTab)}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Vào Luyện Từ Vựng Unit {activeUnitTab}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ==================== CỘT 2: NHIỆM VỤ ĐỀ CƯƠNG & KIỂM TRA THỬ ==================== */}
            <div className="bg-[#0D233E] rounded-xl border border-blue-500/25 p-3.5 sm:p-4 flex flex-col justify-between space-y-3">
              <div>
                {/* Header Nhiệm Vụ 2 */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-teal-600/30 text-teal-300 font-bold text-xs border border-teal-400/30">
                      Nhiệm vụ 2
                    </span>
                    <h4 className="font-bold text-sm sm:text-base text-white">
                      Đề Cương & Kiểm Tra Thử GK1
                    </h4>
                  </div>
                  <span className="text-sm font-bold text-cyan-300">
                    {missionState.mission2.overallPercent}%
                  </span>
                </div>

                <p className="text-xs text-blue-200/80 mb-3">
                  Hoàn thành đề cương và bài kiểm tra kiểm tra thử giữa học kỳ 1.
                </p>

                {/* 2 Thẻ Bài Tập Tối Giản */}
                <div className="space-y-2.5">
                  
                  {/* Thẻ 1: Đề Cương */}
                  <div className="p-3 rounded-xl border border-blue-900/40 bg-[#091B30] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">📖</span>
                        <h5 className="font-bold text-xs sm:text-sm text-white">
                          Đề Cương Ôn Tập Giữa Kỳ 1
                        </h5>
                      </div>
                      <div className="text-[11px] text-blue-200/80 mt-1 flex items-center gap-2 flex-wrap">
                        <span>Đã làm: <strong className="text-white">{missionState.mission2.decuong.attemptsCount} lần</strong></span>
                        <span>•</span>
                        <span>Điểm cao nhất: <strong className="text-cyan-300">{missionState.mission2.decuong.highestScore > 0 ? `${missionState.mission2.decuong.highestScore}/10đ` : 'Chưa có'}</strong></span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onGoToDecuong}
                      className="px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs transition flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{missionState.mission2.decuong.attemptsCount > 0 ? 'Làm Lại Đề Cương' : 'Vào Làm Đề Cương'}</span>
                    </button>
                  </div>

                  {/* Thẻ 2: Đề Kiểm Tra Thử Online */}
                  <div className="p-3 rounded-xl border border-blue-900/40 bg-[#091B30] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">📝</span>
                        <h5 className="font-bold text-xs sm:text-sm text-white">
                          Đề Kiểm Tra Giữa Kỳ 1 Online
                        </h5>
                      </div>
                      <div className="text-[11px] text-blue-200/80 mt-1 flex items-center gap-2 flex-wrap">
                        <span>Đã làm: <strong className="text-white">{missionState.mission2.midtermExam.attemptsCount} lần</strong></span>
                        <span>•</span>
                        <span>Điểm cao nhất: <strong className="text-cyan-300">{missionState.mission2.midtermExam.highestScore > 0 ? `${missionState.mission2.midtermExam.highestScore}/10đ` : 'Chưa có'}</strong></span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onGoToExam}
                      className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs transition flex items-center justify-center gap-1"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>{missionState.mission2.midtermExam.attemptsCount > 0 ? 'Kiểm Tra Thử Lại' : 'Vào Kiểm Tra Thử GK1'}</span>
                    </button>
                  </div>

                </div>
              </div>

              {/* Chú thích tích điểm thi đua */}
              <div className="p-2 rounded-lg bg-blue-950/50 border border-blue-800/40 text-[11px] text-blue-200 flex items-center gap-1.5">
                <span>⭐</span>
                <span>Hoàn thành bài tập để tích lũy điểm thi đua chuyên cần.</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
