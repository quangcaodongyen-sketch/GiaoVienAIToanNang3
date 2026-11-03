import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Target, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  BookOpen, 
  FileText, 
  Award,
  Sparkles,
  Flame,
  Clock,
  Layers
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
  onGoToTextbook?: (unitNumber?: number) => void;
  onGoToDecuong?: () => void;
  onGoToExam?: () => void;
}

// Bảng tên chủ đề Unit 4 chuẩn SGK Global Success theo từng khối
const UNIT4_TITLES_BY_GRADE: Record<number, string> = {
  6: 'Unit 4: My Neighbourhood (Khu phố của em)',
  7: 'Unit 4: Music and Arts (Âm nhạc & Nghệ thuật)',
  8: 'Unit 4: Ethnic Groups of Viet Nam (Các dân tộc Việt Nam)',
  9: 'Unit 4: Remembering the Past (Ký ức quá khứ)',
  10: 'Unit 4: For a Better Community (Vì cộng đồng tốt đẹp)',
  11: 'Unit 4: ASEAN and Viet Nam (Hiệp hội các quốc gia ĐNA)',
  12: 'Unit 4: Urbanisation (Đô thị hoá)'
};

export const MidtermMissionCard: React.FC<MidtermMissionCardProps> = ({
  currentStudent,
  onGoToVocabUnit,
  onGoToTextbook,
  onGoToDecuong,
  onGoToExam
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeUnitTab, setActiveUnitTab] = useState<number>(4); // Mặc định mở ngay Unit 4 theo chỉ đạo Thầy Thành

  const grade = currentStudent.grade || 8;
  const unit4Title = UNIT4_TITLES_BY_GRADE[grade] || `Unit 4 Tiếng Anh Lớp ${grade} Global Success`;

  const missionState: MidtermMissionState = midtermMissionService.getMissionState(
    currentStudent.id,
    currentStudent.name,
    currentStudent.className,
    grade
  );

  return (
    <div className="bg-[#0B1E36] text-white rounded-3xl border-2 border-emerald-400/40 shadow-2xl overflow-hidden mb-6 transition-all duration-300 ring-4 ring-emerald-500/10">
      
      {/* 1. HEADER BANNER: MÀU XANH THI ĐUA HIỆN ĐẠI, NỔI BẬT NHIỆM VỤ MỚI */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-[#07241A] via-[#0D382B] to-[#123E59] border-b border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-2xl shrink-0 shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-300/40 animate-pulse">
            🎯
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                <span>Nhiệm Vụ Mới • 03/11/2026</span>
              </span>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                Chinh Phục Từ Vựng &amp; Bài Tập SGK Unit 4
              </h3>
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-200 border border-emerald-400/40 text-[11px] font-bold">
                Lớp {currentStudent.className || `${grade}A1`}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 font-semibold mt-1 flex items-center gap-2 flex-wrap">
              <span>📖 Chủ điểm: <strong className="text-amber-300 underline">{unit4Title}</strong></span>
              <span className="hidden sm:inline">•</span>
              <span className="text-cyan-200">👨‍🏫 Thầy giáo Đinh Văn Thành giao nhiệm vụ</span>
            </p>
          </div>
        </div>

        {/* TIẾN ĐỘ TỔNG & NÚT THU GỌN */}
        <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
          <div className="text-right bg-emerald-950/60 px-3.5 py-1.5 rounded-xl border border-emerald-500/30">
            <span className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider block">Tiến độ chung</span>
            <span className="text-xl sm:text-2xl font-black text-amber-300">
              {missionState.totalProgressPercent}%
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-emerald-500/40 shadow-sm"
          >
            <span>{isExpanded ? 'Thu gọn' : 'Xem chi tiết'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* THANH TIẾN ĐỘ XANH NGỌC SẮC NÉT */}
      <div className="h-2 w-full bg-emerald-950/90 relative overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 transition-all duration-500 ease-out shadow-[0_0_12px_rgba(52,211,153,0.8)]"
          style={{ width: `${Math.max(missionState.totalProgressPercent, 8)}%` }}
        />
      </div>

      {/* 2. NỘI DUNG NHIỆM VỤ CHI TIẾT */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4">
          
          {/* LỜI GIAO VIỆC & THƯỞNG KHỞI ĐỘNG CỦA THẦY THÀNH */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-teal-500/15 border border-amber-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <span className="text-xl shrink-0 mt-0.5">📢</span>
              <div className="leading-relaxed">
                <strong className="text-amber-300 font-black uppercase tracking-wide">Chỉ đạo học tập từ Thầy Thành (03/11/2026):</strong>
                <p className="text-slate-200 mt-0.5">
                  Sau khi hoàn thành thi Giữa kỳ 1, toàn thể học sinh bắt đầu bước vào <strong>Unit 4</strong>. Các em học toàn bộ từ vựng Unit 4 (nghe phát âm, lật thẻ 3D, gõ chính tả) và làm trọn bộ <strong>bài tập kèm Sách giáo khoa</strong> để tích lũy điểm thi đua Bảng Vàng!
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
              <span className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow-md">
                ⭐ Thưởng Khởi Động: +50đ
              </span>
            </div>
          </div>

          {/* CHỌN TAB UNIT (ƯU TIÊN UNIT 4 NẰM ĐẦU TIÊN VÀ GẮN HUY HIỆU MỚI) */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-950/70 rounded-2xl border border-blue-900/60 overflow-x-auto">
            {[4, 1, 2, 3].map(uNum => {
              const uData = missionState.mission1.units[uNum];
              const isActive = activeUnitTab === uNum;
              const isUnit4 = uNum === 4;

              return (
                <button
                  key={uNum}
                  type="button"
                  onClick={() => setActiveUnitTab(uNum)}
                  className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    isActive
                      ? isUnit4
                        ? 'bg-gradient-to-r from-emerald-500 via-teal-600 to-green-600 text-white shadow-lg border-2 border-emerald-300 ring-2 ring-emerald-400/30'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md border-2 border-blue-300'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-bold border border-slate-700/60'
                  }`}
                >
                  {isUnit4 && <span className="text-amber-300">🔥</span>}
                  <span>Unit {uNum} {isUnit4 ? '(Mới)' : ''}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                    isActive ? 'bg-white text-emerald-900' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {uData?.unitPercent || 0}%
                  </span>
                </button>
              );
            })}
          </div>

          {/* GRID 2 CỘT NHIỆM VỤ CHÍNH */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* ==================== CỘT 1: NHIỆM VỤ TỪ VỰNG ==================== */}
            <div className="bg-[#0D233E] rounded-2xl border border-blue-500/25 p-4 flex flex-col justify-between space-y-3.5 shadow-md">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-600/30 text-emerald-300 font-bold text-xs border border-emerald-400/30">
                      Nhiệm vụ 1
                    </span>
                    <h4 className="font-bold text-sm sm:text-base text-white">
                      Làm Chủ Từ Vựng Unit {activeUnitTab}
                    </h4>
                  </div>
                  <span className="text-sm font-black text-amber-300">
                    {missionState.mission1.units[activeUnitTab]?.unitPercent || 0}%
                  </span>
                </div>

                <p className="text-xs text-blue-200/90 mb-3">
                  Luyện tập các dạng bài từ vựng SGK: Lật thẻ 3D, Nối từ, Trắc nghiệm, Luyện nghe &amp; Chính tả.
                </p>

                {/* Danh sách các dạng bài của Unit đang chọn */}
                {(() => {
                  const currentUnitData = missionState.mission1.units[activeUnitTab];
                  if (!currentUnitData) return null;
                  return (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-blue-200">
                        <span>Trạng thái đạt chuẩn Unit {activeUnitTab}:</span>
                        <span className="font-bold text-cyan-300">
                          {currentUnitData.qualityPassedCount} / {currentUnitData.totalRequiredModes} dạng bài đạt
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
                        {VOCAB_MODES_CONFIG.map(m => {
                          const modeRes = currentUnitData.modes[m.id];
                          const isPassed = modeRes?.qualityPassed;
                          return (
                            <div 
                              key={m.id}
                              className={`p-2 rounded-xl border flex items-center justify-between gap-1.5 transition ${
                                isPassed
                                  ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
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
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <BookOpen className="w-4 h-4 text-amber-300" />
                  <span>Vào Luyện Từ Vựng Unit {activeUnitTab} Ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ==================== CỘT 2: NHIỆM VỤ BÀI TẬP SGK & KIỂM TRA 15P ==================== */}
            <div className="bg-[#0D233E] rounded-2xl border border-blue-500/25 p-4 flex flex-col justify-between space-y-3.5 shadow-md">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-teal-600/30 text-teal-300 font-bold text-xs border border-teal-400/30">
                      Nhiệm vụ 2
                    </span>
                    <h4 className="font-bold text-sm sm:text-base text-white">
                      Bài Tập Kèm SGK &amp; Kiểm Tra 15P
                    </h4>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold">
                    Chuẩn SGK 7 Phần
                  </span>
                </div>

                <p className="text-xs text-blue-200/90 mb-3">
                  Hoàn thành trọn bộ bài tập kèm Sách giáo khoa và bài kiểm tra trắc nghiệm nhanh 15 phút.
                </p>

                <div className="space-y-2.5">
                  {/* Thẻ 1: Trọn Bộ Bài Tập Kèm Sách Giáo Khoa (SGK) */}
                  <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-[#091B30] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📘</span>
                        <h5 className="font-bold text-xs sm:text-sm text-white">
                          Bài Tập Kèm SGK Unit {activeUnitTab}
                        </h5>
                      </div>
                      <div className="text-[11px] text-emerald-200/90 mt-1">
                        Gồm 7 phần: Getting Started, A Closer Look 1 &amp; 2, Communication, Looking Back.
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onGoToTextbook && onGoToTextbook(activeUnitTab)}
                      className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-xs shrink-0 cursor-pointer shadow-sm transition flex items-center justify-center gap-1.5"
                    >
                      <Layers className="w-3.5 h-3.5 text-amber-300" />
                      <span>Làm Bài Tập SGK</span>
                    </button>
                  </div>

                  {/* Thẻ 2: Kiểm Tra Nhanh 15 Phút Unit 4 */}
                  <div className="p-3.5 rounded-xl border border-blue-900/50 bg-[#091B30] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">⚡</span>
                        <h5 className="font-bold text-xs sm:text-sm text-white">
                          Kiểm Tra Nhanh 15 Phút Unit {activeUnitTab}
                        </h5>
                      </div>
                      <div className="text-[11px] text-blue-200/80 mt-1">
                        Đánh giá độ nhạy từ vựng &amp; ngữ pháp Unit 4 đạt điểm 9, 10.
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={onGoToExam}
                      className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shrink-0 cursor-pointer shadow-sm transition flex items-center justify-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-300" />
                      <span>Làm Bài Kiểm Tra 15P</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Chú thích sư phạm */}
              <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-800/40 text-[11px] text-blue-200 flex items-center gap-2">
                <span>⭐</span>
                <span>Hoàn thành bài tập SGK &amp; Từ vựng Unit 4 được cộng tích lũy trực tiếp vào Sổ Điểm Thi Đua của Lớp!</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
