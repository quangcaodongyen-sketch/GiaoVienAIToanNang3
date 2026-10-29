import React, { useState } from 'react';
import { 
  Bell, 
  Award, 
  BookOpen, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Trophy, 
  Clock,
  Sparkles
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
  const [activeTipTab, setActiveTipTab] = useState<'pronunciation' | 'grammar' | 'error_find' | 'reading'>('pronunciation');
  
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

      {/* 1. HEADER GỘP GỌN: TIÊU ĐỀ + TÓM TẮT LỊCH THI & ƯU ĐÃI + NÚT THU GỌN */}
      <div className="p-3 sm:p-3.5 bg-gradient-to-r from-blue-950/90 via-slate-900/90 to-blue-950/90 border-b border-blue-500/30 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-md font-black shrink-0">
            <Bell className="w-4 h-4 text-slate-950" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-xs sm:text-sm font-black text-white tracking-tight">
                LỜI NHẮC ÔN TẬP GK1 &amp; TĂNG ĐIỂM SỐ
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 shadow-2xs">
                Thầy Đinh Thành
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/30 text-cyan-200 border border-blue-400/30 truncate">
                Dành cho {studentName} ({className})
              </span>
            </div>
            <p className="text-[11px] text-blue-200/95 font-medium mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span className="text-amber-300 font-bold">📢 Thi GK1: Chiều Thứ 2 (02/11)</span>
              <span>•</span>
              <span className="text-emerald-300 font-bold">🎁 Tặng +{promoPts}đ Đăng nhập</span>
              <span>•</span>
              <span className="text-cyan-200">Mang 2 bút chì 2B &amp; tẩy mềm</span>
            </p>
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
                <span className="text-[11px]">Xem Chi Tiết</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. KHI THU GỌN: THANH TÓM TẮT 1 DÒNG ĐƠN GIẢN */}
      {!isExpanded && (
        <div className="px-3.5 py-2 bg-blue-950/40 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-blue-100 font-medium text-[11px] sm:text-xs">
            <span className="text-amber-300 font-bold">📢 Thầy nhắc:</span>
            <span>Thi GK1 Chiều Thứ 2 (02/11) • Bắt buộc mang <strong>2 bút chì 2B &amp; tẩy mềm</strong> • Ôn chắc Unit 1 - 3!</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onGoToExam}
              className="px-2.5 py-0.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] transition cursor-pointer"
            >
              ✍️ Làm Đề GK1
            </button>
            <button
              type="button"
              onClick={() => onGoToVocabUnit(1, grade)}
              className="px-2.5 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] transition cursor-pointer"
            >
              📚 Học Từ Vựng
            </button>
          </div>
        </div>
      )}

      {/* 3. KHI MỞ RỘNG: BỐ CỤC ĐƠN GIẢN HÓA - ĐỌC NHANH TRONG 3 GIÂY */}
      {isExpanded && (
        <div className="p-3 sm:p-4 space-y-3">
          {/* LƯỚI 4 LƯU Ý TRỌNG TÂM - NGẮN GỌN 1 DÒNG */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-amber-400/15 border border-amber-400/50 flex items-start gap-2 shadow-2xs">
              <span className="text-base shrink-0">✏️</span>
              <div>
                <strong className="text-amber-300 block text-xs">1. Thẻ Dụng Cụ:</strong>
                <p className="text-white/95 text-[11px] font-medium leading-tight mt-0.5">
                  Ít nhất <strong>2 bút chì 2B</strong> gọt sẵn + <strong>hòn tẩy mềm</strong> tô trắc nghiệm.
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-400/30 flex items-start gap-2 shadow-2xs">
              <span className="text-base shrink-0">🧠</span>
              <div>
                <strong className="text-cyan-300 block text-xs">2. Kiến Thức Trọng Tâm:</strong>
                <p className="text-blue-100/90 text-[11px] leading-tight mt-0.5">
                  Từ vựng <strong>Unit 1 - 3</strong> &amp; thì Hiện tại đơn, Quá khứ đơn, V-ing.
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-400/30 flex items-start gap-2 shadow-2xs">
              <span className="text-base shrink-0">⏱️</span>
              <div>
                <strong className="text-emerald-300 block text-xs">3. Lịch Thi GK1:</strong>
                <p className="text-blue-100/90 text-[11px] leading-tight mt-0.5">
                  <strong>Chiều Thứ Hai (02/11/2026)</strong> trên lớp • Làm đề thử online để rèn phản xạ.
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-400/30 flex items-start gap-2 shadow-2xs">
              <span className="text-base shrink-0">🛡️</span>
              <div>
                <strong className="text-purple-300 block text-xs">4. Trách Nhiệm TT &amp; TP:</strong>
                <p className="text-blue-100/90 text-[11px] leading-tight mt-0.5">
                  Đôn đốc các bạn trong tổ ôn tập đầy đủ và mang đủ bút chì 2B đi thi.
                </p>
              </div>
            </div>
          </div>

          {/* 3 THẺ HÀNH ĐỘNG CỐT LÕI (NGẮN GỌN & NÚT BẤM RÕ RÀNG) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {/* THẺ 1: ĐỀ THI ONLINE GK1 */}
            <div className="rounded-xl bg-[#0B1E36]/90 border border-amber-400/40 p-3 flex flex-col justify-between shadow-xs hover:border-amber-300 transition-all">
              <div>
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <span className="text-[10px] font-black uppercase text-amber-300">
                    ✍️ Đề Minh Họa GK1
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    +30đ Thi Đua
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-black text-white">
                  Kiểm Tra Thử Online Lớp {grade}
                </h4>
                <p className="text-[11px] text-blue-200/80 mt-1 line-clamp-1">
                  40 câu trắc nghiệm chuẩn ma trận Bộ GD&ĐT, tự động bấm giờ.
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-blue-500/20 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onGoToExam}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-xs flex items-center justify-center gap-1"
                >
                  <Award className="w-3.5 h-3.5 text-slate-950" />
                  <span>Vào Thi Thử GK1</span>
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

            {/* THẺ 2: TỪ VỰNG UNIT 1-3 */}
            <div className="rounded-xl bg-[#0B1E36]/90 border border-emerald-400/40 p-3 flex flex-col justify-between shadow-xs hover:border-emerald-300 transition-all">
              <div>
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <span className="text-[10px] font-black uppercase text-emerald-300">
                    📚 Chiếm 50% Điểm GK1
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    +15đ / Bài
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-black text-white">
                  Luyện Từ Vựng Unit 1 - Unit 3
                </h4>

                <div className="mt-1.5 flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => onGoToVocabUnit(1, grade)}
                    className="px-1.5 py-0.5 rounded-md bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-200 text-[10px] font-bold transition cursor-pointer"
                  >
                    U1 ({unit1.wordCount} từ)
                  </button>
                  <button
                    type="button"
                    onClick={() => onGoToVocabUnit(2, grade)}
                    className="px-1.5 py-0.5 rounded-md bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-200 text-[10px] font-bold transition cursor-pointer"
                  >
                    U2 ({unit2.wordCount} từ)
                  </button>
                  <button
                    type="button"
                    onClick={() => onGoToVocabUnit(3, grade)}
                    className="px-1.5 py-0.5 rounded-md bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-200 text-[10px] font-bold transition cursor-pointer"
                  >
                    U3 ({unit3.wordCount} từ)
                  </button>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-blue-500/20">
                <button
                  type="button"
                  onClick={() => onGoToVocabUnit(1, grade)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-white font-black text-xs transition cursor-pointer shadow-xs flex items-center justify-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5 text-white" />
                  <span>Vào Luyện Từ Vựng</span>
                </button>
              </div>
            </div>

            {/* THẺ 3: ĐỀ CƯƠNG ÔN TẬP */}
            <div className="rounded-xl bg-[#0B1E36]/90 border border-cyan-400/40 p-3 flex flex-col justify-between shadow-xs hover:border-cyan-300 transition-all">
              <div>
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <span className="text-[10px] font-black uppercase text-cyan-300">
                    📖 Bám Sát SGK
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-cyan-500/20 text-cyan-200 border border-cyan-400/30">
                    Có Đáp Án
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-black text-white">
                  Đề Cương GK1 Lớp {grade}
                </h4>
                <p className="text-[11px] text-blue-200/80 mt-1 line-clamp-1">
                  Ngữ pháp trọng tâm &amp; bài tập tự luận có đáp án đối chiếu.
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-blue-500/20 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onGoToDecuong}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white font-black text-xs transition cursor-pointer shadow-xs flex items-center justify-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5 text-white" />
                  <span>Mở Đề Cương</span>
                </button>
                <button
                  type="button"
                  onClick={onGoToLeaderboard}
                  className="px-2 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs transition cursor-pointer border border-amber-400/30 flex items-center gap-1"
                  title="Xem Bảng Vàng thi đua"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px]">Bảng Vàng</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4. PHƯƠNG PHÁP TƯ DUY & MẸO NHẬN DIỆN CỦA THẦY THÀNH (THIẾT KẾ GỌN) */}
          <div className="p-2.5 sm:p-3 rounded-xl bg-blue-950/60 border border-blue-400/30 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400 text-sm">💡</span>
                <span className="text-xs font-black text-amber-300 uppercase tracking-wide">
                  Mẹo Làm Bài Thi GK1 Của Thầy Thành
                </span>
              </div>
              <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTipTab('pronunciation')}
                  className={`px-2 py-0.5 rounded transition cursor-pointer ${
                    activeTipTab === 'pronunciation' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  1. Ngữ Âm
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTipTab('grammar')}
                  className={`px-2 py-0.5 rounded transition cursor-pointer ${
                    activeTipTab === 'grammar' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  2. Ngữ Pháp
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTipTab('error_find')}
                  className={`px-2 py-0.5 rounded transition cursor-pointer ${
                    activeTipTab === 'error_find' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  3. Lỗi Sai
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTipTab('reading')}
                  className={`px-2 py-0.5 rounded transition cursor-pointer ${
                    activeTipTab === 'reading' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  4. Đọc Hiểu
                </button>
              </div>
            </div>

            {/* NỘI DUNG MẸO SÚC TÍCH */}
            <div className="text-[11px] text-blue-100/95 leading-relaxed bg-[#0B1E36]/90 p-2.5 rounded-lg border border-blue-500/20">
              {activeTipTab === 'pronunciation' && (
                <div>
                  <strong className="text-amber-300">🔊 Bí quyết Ngữ âm &amp; Trọng âm:</strong>
                  <div className="mt-1 space-y-0.5 text-slate-200">
                    <p>• <strong>Đuôi -s/-es:</strong> Nhớ <em>"Thời phong kiến f-p-k-t-th"</em> ➔ <code>/s/</code>; đuôi <em>s, x, ch, sh, z, ge</em> ➔ <code>/iz/</code>; còn lại ➔ <code>/z/</code>.</p>
                    <p>• <strong>Đuôi -ed:</strong> Tận cùng <em>t, d</em> ➔ <code>/id/</code>; tận cùng <em>p, k, f, s, sh, ch</em> ➔ <code>/t/</code>; còn lại ➔ <code>/d/</code>.</p>
                    <p>• <strong>Trọng âm từ 2 âm tiết:</strong> Danh/Tính từ thường nhấn <strong>âm 1</strong>; Động từ thường nhấn <strong>âm 2</strong>.</p>
                  </div>
                </div>
              )}

              {activeTipTab === 'grammar' && (
                <div>
                  <strong className="text-amber-300">🧩 Bí quyết câu Ngữ pháp:</strong>
                  <div className="mt-1 space-y-0.5 text-slate-200">
                    <p>• <em>always, usually, often, every day</em> ➔ <strong>Hiện tại đơn</strong> (He/She/It + V-s/es).</p>
                    <p>• <em>yesterday, last week, ago, in 2020</em> ➔ <strong>Quá khứ đơn</strong> (V2/V-ed).</p>
                    <p>• Sau động từ sở thích <em>like, love, enjoy, fancy, hate</em> ➔ Bắt buộc đi với <strong>V-ing</strong>.</p>
                  </div>
                </div>
              )}

              {activeTipTab === 'error_find' && (
                <div>
                  <strong className="text-amber-300">🔍 Kỹ thuật Tìm Lỗi Sai trong 5 giây:</strong>
                  <div className="mt-1 space-y-0.5 text-slate-200">
                    <p>• <strong>Chia động từ:</strong> Xem chủ ngữ số ít hay nhiều (ví dụ: <em>Every student have ➔ has</em>).</p>
                    <p>• <strong>Cấu trúc song hành:</strong> Trước và sau <em>and, but, or</em> phải cùng dạng từ (ví dụ: <em>singing and dance ➔ dancing</em>).</p>
                    <p>• <strong>Lượng từ:</strong> <em>many</em> + danh từ đếm được; <em>much</em> + danh từ không đếm được.</p>
                  </div>
                </div>
              )}

              {activeTipTab === 'reading' && (
                <div>
                  <strong className="text-amber-300">📖 Chiến thuật Đọc hiểu nhanh:</strong>
                  <div className="mt-1 space-y-0.5 text-slate-200">
                    <p>• <strong>Đọc câu hỏi trước:</strong> Gạch chân từ khóa (tên riêng, số năm, thuật ngữ).</p>
                    <p>• <strong>Quét (Scan) bài đọc:</strong> Tìm dòng chứa từ khóa ➔ Đọc câu trước và sau để chốt đáp án.</p>
                    <p>• <strong>Câu hỏi ý chính:</strong> Thường nằm ở 1-2 câu đầu đoạn 1 hoặc câu cuối bài.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
