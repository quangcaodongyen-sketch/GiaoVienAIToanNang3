import React, { useState } from 'react';
import { 
  Bell, 
  Award, 
  BookOpen, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Trophy, 
  Sparkles,
  CheckCircle2,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { StudentProfile } from '../services/studentGradebookService';
import { vocabularyService } from '../services/vocabularyService';

export interface StudentStudyReminderProps {
  currentStudent?: StudentProfile | null;
  loginRewardInfo?: {
    points: number;
    title: string;
    promoBadge?: string;
    expiresAtDisplay?: string;
  };
  onGoToExam: () => void;
  onGoToQuiz: () => void;
  onGoToVocabUnit: (unitNumber: number, grade?: number) => void;
  onGoToDecuong: () => void;
  onGoToLeaderboard: () => void;
}

const STORAGE_REMINDER_BELL_KEY = 'gvai_student_study_reminder_bell_enabled';

export const StudentStudyReminder: React.FC<StudentStudyReminderProps> = ({
  currentStudent,
  loginRewardInfo,
  onGoToExam,
  onGoToQuiz,
  onGoToVocabUnit,
  onGoToDecuong,
  onGoToLeaderboard
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [showFullTips, setShowFullTips] = useState<boolean>(false);
  
  // Trạng thái chuông nhắc học tập
  const [isBellEnabled, setIsBellEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem(STORAGE_REMINDER_BELL_KEY);
    return saved === null ? true : saved === 'true';
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const grade = currentStudent?.grade || (currentStudent?.className ? (parseInt(currentStudent.className.replace(/\D/g, ''), 10) || 8) : 8);
  const studentName = currentStudent?.name || 'Em';
  const className = currentStudent?.className || `${grade}A1`;

  // Lấy danh sách Unit thực tế của khối lớp
  const units = vocabularyService.getUnitsByGrade(grade);
  const unit1 = units.find(u => u.unitNumber === 1) || { unitNumber: 1, title: 'Unit 1', wordCount: 22 };
  const unit2 = units.find(u => u.unitNumber === 2) || { unitNumber: 2, title: 'Unit 2', wordCount: 23 };
  const unit3 = units.find(u => u.unitNumber === 3) || { unitNumber: 3, title: 'Unit 3', wordCount: 23 };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const toggleBell = () => {
    const next = !isBellEnabled;
    setIsBellEnabled(next);
    localStorage.setItem(STORAGE_REMINDER_BELL_KEY, String(next));
    if (next) {
      showToast('🔔 Đã bật nhắc nhở học bài mỗi ngày cùng Thầy Đinh Thành!');
    } else {
      showToast('🔕 Đã tạm tắt nhắc nhở học bài.');
    }
  };

  const promoPts = loginRewardInfo?.points || 15;

  return (
    <div className="mb-4 rounded-2xl bg-gradient-to-br from-[#0B1E36] via-[#0F2A4A] to-[#123863] border border-blue-500/40 shadow-xl text-white overflow-hidden transition-all duration-300">
      {/* TOAST THÔNG BÁO NHANH */}
      {toastMsg && (
        <div className="bg-amber-400 text-slate-950 px-4 py-1.5 text-xs font-black text-center flex items-center justify-center gap-2 animate-in fade-in">
          <span>✨</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. THANH LỜI NHẮC GỌN NHẸ: LỊCH KIỂM TRA + DỤNG CỤ + TẶNG ĐIỂM */}
      <div className="p-3 sm:p-3.5 bg-gradient-to-r from-blue-950/95 via-slate-900/90 to-blue-950/95 border-b border-blue-500/30 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-md font-black shrink-0">
            <Bell className="w-4 h-4 text-slate-950" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-xs sm:text-sm font-black text-white tracking-tight">
                LỜI NHẮC ÔN TẬP GK1 &amp; NHẬN NHIỆM VỤ
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 shadow-2xs">
                Thầy Đinh Thành
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/30 text-cyan-200 border border-blue-400/30 truncate">
                {studentName} ({className})
              </span>
            </div>

            {/* DÒNG NHẮC LỊCH VÀ DỤNG CỤ ĐƠN GIẢN */}
            <div className="text-[11px] sm:text-xs text-blue-100/90 font-medium mt-1 flex items-center gap-2 flex-wrap">
              <span className="text-amber-300 font-bold flex items-center gap-1">
                <span>📢 Lịch thi:</span>
                <strong>Chiều Thứ 2 (02/11/2026)</strong>
              </span>
              <span className="text-white/40">•</span>
              <span className="text-cyan-200 flex items-center gap-1">
                <span>✏️ Dụng cụ:</span>
                <strong>2 bút chì 2B gọt sẵn + tẩy mềm + bút mực</strong>
              </span>
              <span className="text-white/40">•</span>
              <span className="text-emerald-300 font-bold">
                🎁 +{promoPts}đ Chuyên cần
              </span>
            </div>
          </div>
        </div>

        {/* NÚT BẬT CHUÔNG & THU GỌN */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleBell}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              isBellEnabled 
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 hover:bg-amber-400/30' 
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title={isBellEnabled ? 'Đang bật chuông nhắc nhở' : 'Bấm để bật chuông nhắc nhở'}
          >
            <Bell className={`w-3.5 h-3.5 ${isBellEnabled ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
            <span className="text-[11px] hidden sm:inline">{isBellEnabled ? 'Đang Nhắc' : 'Tắt Nhắc'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2.5 py-1 rounded-lg bg-blue-800/40 hover:bg-blue-700/60 text-cyan-200 font-bold text-xs transition flex items-center gap-1 cursor-pointer border border-blue-500/30"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-cyan-300" />
                <span className="text-[11px]">Thu Gọn</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-cyan-300" />
                <span className="text-[11px]">Mở Nhiệm Vụ</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. KHI MỞ RỘNG: 3 THẺ NHẬN NHIỆM VỤ & BẮT ĐẦU HỌC TẬP NGAY (TINH GỌN) */}
      {isExpanded && (
        <div className="p-3 sm:p-4 space-y-3">
          {/* LƯỚI 3 NHIỆM VỤ HỌC TẬP CHÍNH */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {/* NHIỆM VỤ 1: TỪ VỰNG UNIT 1-3 */}
            <div className="rounded-xl bg-[#0B1E36]/90 border border-emerald-400/40 p-3 flex flex-col justify-between shadow-xs hover:border-emerald-300 transition-all">
              <div>
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <span className="text-[10px] font-black uppercase text-emerald-300 flex items-center gap-1">
                    <span>📚 Nhiệm vụ 1: Từ Vựng</span>
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    +15đ / Bài
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-black text-white">
                  Luyện Từ Vựng Unit 1 - Unit 3
                </h4>
                <p className="text-[11px] text-blue-200/80 mt-1 line-clamp-1">
                  Chiếm 50% điểm đề thi. Nghe phát âm &amp; nhớ mặt từ siêu tốc.
                </p>

                <div className="mt-2 flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => onGoToVocabUnit(1, grade)}
                    className="px-2 py-0.5 rounded-md bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-200 text-[10px] font-bold transition cursor-pointer"
                  >
                    U1 ({unit1.wordCount} từ)
                  </button>
                  <button
                    type="button"
                    onClick={() => onGoToVocabUnit(2, grade)}
                    className="px-2 py-0.5 rounded-md bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-200 text-[10px] font-bold transition cursor-pointer"
                  >
                    U2 ({unit2.wordCount} từ)
                  </button>
                  <button
                    type="button"
                    onClick={() => onGoToVocabUnit(3, grade)}
                    className="px-2 py-0.5 rounded-md bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-200 text-[10px] font-bold transition cursor-pointer"
                  >
                    U3 ({unit3.wordCount} từ)
                  </button>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-blue-500/20">
                <button
                  type="button"
                  onClick={() => onGoToVocabUnit(1, grade)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-white font-black text-xs transition cursor-pointer shadow-xs flex items-center justify-center gap-1 active:scale-95"
                >
                  <BookOpen className="w-3.5 h-3.5 text-white" />
                  <span>Vào Học Từ Vựng</span>
                  <ArrowRight className="w-3 h-3 text-white/80" />
                </button>
              </div>
            </div>

            {/* NHIỆM VỤ 2: ĐỀ CƯƠNG ÔN TẬP */}
            <div className="rounded-xl bg-[#0B1E36]/90 border border-cyan-400/40 p-3 flex flex-col justify-between shadow-xs hover:border-cyan-300 transition-all">
              <div>
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <span className="text-[10px] font-black uppercase text-cyan-300 flex items-center gap-1">
                    <span>📖 Nhiệm vụ 2: Đề Cương</span>
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-cyan-500/20 text-cyan-200 border border-cyan-400/30">
                    Bám Sát SGK
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-black text-white">
                  Đề Cương Ôn Tập GK1 Lớp {grade}
                </h4>
                <p className="text-[11px] text-blue-200/80 mt-1 line-clamp-1">
                  Luyện chắc ngữ pháp Hiện tại đơn, Quá khứ đơn, V-ing &amp; tự luận.
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-blue-500/20 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onGoToDecuong}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white font-black text-xs transition cursor-pointer shadow-xs flex items-center justify-center gap-1 active:scale-95"
                >
                  <FileText className="w-3.5 h-3.5 text-white" />
                  <span>Mở Đề Cương Ôn</span>
                  <ArrowRight className="w-3 h-3 text-white/80" />
                </button>
                <button
                  type="button"
                  onClick={onGoToLeaderboard}
                  className="px-2 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs transition cursor-pointer border border-amber-400/30 flex items-center gap-1"
                  title="Xem kết quả thi đua cá nhân, tổ và lớp"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px]">Bảng Vàng</span>
                </button>
              </div>
            </div>

            {/* NHIỆM VỤ 3: THI THỬ ONLINE */}
            <div className="rounded-xl bg-[#0B1E36]/90 border border-amber-400/40 p-3 flex flex-col justify-between shadow-xs hover:border-amber-300 transition-all">
              <div>
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <span className="text-[10px] font-black uppercase text-amber-300 flex items-center gap-1">
                    <span>✍️ Nhiệm vụ 3: Thi Thử</span>
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    +30đ Thi Đua
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-black text-white">
                  Kiểm Tra Thử Online Lớp {grade}
                </h4>
                <p className="text-[11px] text-blue-200/80 mt-1 line-clamp-1">
                  Chuẩn ma trận Bộ GD&amp;ĐT, tự động bấm giờ &amp; giải thích chi tiết.
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-blue-500/20 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onGoToExam}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-xs flex items-center justify-center gap-1 active:scale-95"
                >
                  <Award className="w-3.5 h-3.5 text-slate-950" />
                  <span>Vào Thi Thử GK1</span>
                  <ArrowRight className="w-3 h-3 text-slate-950/80" />
                </button>
                <button
                  type="button"
                  onClick={onGoToQuiz}
                  className="px-2 py-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-cyan-200 font-bold text-xs transition cursor-pointer border border-blue-700/50"
                  title="Kiểm tra trắc nghiệm 5 phút nhanh"
                >
                  KT 5 Phút
                </button>
              </div>
            </div>
          </div>

          {/* 3. CHIẾN THUẬT LÀM BÀI NHẮC NGẮN GỌN (TINH TÚY - KHÔNG DÀI DÒNG) */}
          <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-400/30 text-xs">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="text-[11px] font-black text-amber-300 uppercase tracking-wide">
                  Chiến Thuật Bỏ Túi Của Thầy Thành:
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowFullTips(!showFullTips)}
                className="text-[11px] font-bold text-cyan-300 hover:text-white transition cursor-pointer flex items-center gap-1"
              >
                <span>{showFullTips ? 'Thu gọn mẹo' : 'Xem chi tiết mẹo'}</span>
                {showFullTips ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {/* DÒNG CHIẾN THUẬT RÚT GỌN 3 Ý CỐT LÕI */}
            <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[11px] text-blue-100/95 font-medium">
              <div className="p-1.5 rounded-lg bg-black/30 border border-white/10 flex items-center gap-1.5">
                <span className="text-amber-400 font-bold">1. Ngữ âm:</span>
                <span className="truncate" title="Đuôi -s: thời phong kiến f,p,k,t,th -> /s/. Đuôi -ed: t,d -> /id/">
                  Đuôi <em>-s</em> (f-p-k-t-th ➔ /s/), <em>-ed</em> (t,d ➔ /id/).
                </span>
              </div>
              <div className="p-1.5 rounded-lg bg-black/30 border border-white/10 flex items-center gap-1.5">
                <span className="text-emerald-400 font-bold">2. Ngữ pháp:</span>
                <span className="truncate" title="Thói quen -> Hiện tại đơn; Quá khứ -> V2/-ed; sau like/love -> V-ing">
                  Thói quen ➔ HTĐ; Quá khứ ➔ V2/-ed; like/love ➔ V-ing.
                </span>
              </div>
              <div className="p-1.5 rounded-lg bg-black/30 border border-white/10 flex items-center gap-1.5">
                <span className="text-cyan-400 font-bold">3. Kỹ năng:</span>
                <span className="truncate" title="Câu dễ làm trước, khó làm sau. Gạch chân từ khóa. Tô kín ô trắc nghiệm!">
                  Dễ làm trước, khó làm sau; tô kín ô đáp án 2B.
                </span>
              </div>
            </div>

            {/* CHI TIẾT MẸO KHI HỌC SINH MUỐN XEM ĐẦY ĐỦ */}
            {showFullTips && (
              <div className="mt-2 pt-2 border-t border-blue-500/20 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-200">
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-700/50 space-y-1">
                  <strong className="text-amber-300 block">🔊 Ngữ âm &amp; Trọng âm:</strong>
                  <p>• <strong>Đuôi -s/-es:</strong> Nhớ <em>"Thời phong kiến f-p-k-t-th"</em> ➔ <code>/s/</code>; đuôi <em>s, x, ch, sh, z, ge</em> ➔ <code>/iz/</code>; còn lại ➔ <code>/z/</code>.</p>
                  <p>• <strong>Đuôi -ed:</strong> Tận cùng <em>t, d</em> ➔ <code>/id/</code>; tận cùng <em>p, k, f, s, sh, ch</em> ➔ <code>/t/</code>; còn lại ➔ <code>/d/</code>.</p>
                  <p>• <strong>Trọng âm từ 2 âm tiết:</strong> Danh/Tính từ thường nhấn <strong>âm 1</strong>; Động từ nhấn <strong>âm 2</strong>.</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-700/50 space-y-1">
                  <strong className="text-cyan-300 block">📖 Chiến thuật Đọc hiểu &amp; Làm bài:</strong>
                  <p>• <strong>Đọc câu hỏi trước:</strong> Gạch chân từ khóa (tên riêng, số năm, địa danh) rồi quét vào bài tìm câu trả lời.</p>
                  <p>• <strong>Quản lý thời gian:</strong> 40 câu làm trong 45 phút ➔ Mỗi câu khoảng 1 phút, để dành 5 phút cuối kiểm tra tô đáp án.</p>
                  <p>• <strong>Tuyệt đối không bỏ trống:</strong> Luôn tô kín 100% các ô trên phiếu trắc nghiệm bằng bút chì 2B.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
