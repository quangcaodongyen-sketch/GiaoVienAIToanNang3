import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Sparkles, 
  Award, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Zap, 
  Trophy, 
  Target, 
  Volume2, 
  Lightbulb, 
  HelpCircle,
  Clock,
  Check
} from 'lucide-react';
import { StudentProfile } from '../services/studentGradebookService';
import { vocabularyService } from '../services/vocabularyService';

export interface StudentStudyReminderProps {
  currentStudent?: StudentProfile | null;
  onGoToExam: () => void;
  onGoToQuiz: () => void;
  onGoToVocabUnit: (unitNumber: number, grade?: number) => void;
  onGoToDecuong: () => void;
  onGoToLeaderboard: () => void;
}

const STORAGE_REMINDER_BELL_KEY = 'gvai_student_study_reminder_bell_enabled';

export const StudentStudyReminder: React.FC<StudentStudyReminderProps> = ({
  currentStudent,
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
  const unit1 = units.find(u => u.unitNumber === 1) || { unitNumber: 1, title: 'Unit 1', wordCount: 25 };
  const unit2 = units.find(u => u.unitNumber === 2) || { unitNumber: 2, title: 'Unit 2', wordCount: 25 };
  const unit3 = units.find(u => u.unitNumber === 3) || { unitNumber: 3, title: 'Unit 3', wordCount: 25 };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const toggleBell = () => {
    const next = !isBellEnabled;
    setIsBellEnabled(next);
    localStorage.setItem(STORAGE_REMINDER_BELL_KEY, String(next));
    if (next) {
      showToast('🔔 Đã bật nhắc nhở học bài mỗi ngày! Thầy Đinh Thành sẽ đồng hành cùng em.');
    } else {
      showToast('🔕 Đã tạm tắt nhắc nhở học bài.');
    }
  };

  return (
    <div className="mb-5 rounded-2xl bg-gradient-to-br from-[#0B1E36] via-[#0F2A4A] to-[#123863] border-2 border-amber-400/50 shadow-xl text-white overflow-hidden transition-all duration-300">
      {/* TOAST THÔNG BÁO NHẸ NHÀNG */}
      {toastMsg && (
        <div className="bg-amber-400 text-slate-950 px-4 py-2 text-xs font-black text-center flex items-center justify-center gap-2 animate-in fade-in">
          <span>✨</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. HEADER THANH NHẮC NHỞ */}
      <div className="p-3.5 sm:p-4 bg-gradient-to-r from-blue-950/80 via-slate-900/80 to-blue-950/80 border-b border-blue-500/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-lg font-black text-lg shrink-0 animate-pulse">
            <Bell className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-1.5">
                <span>LỜI NHẮC ÔN THI &amp; TĂNG ĐIỂM SỐ</span>
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 shadow-xs">
                Thầy Đinh Thành
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/30 text-cyan-200 border border-blue-400/30">
                Dành cho {studentName} ({className})
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-blue-200/90 font-medium mt-0.5">
              Rèn kỹ năng nhận dạng đề thi Giữa Kỳ 1 (GK1) • Học từ vựng trọng tâm • Tăng điểm thi đua siêu tốc
            </p>
          </div>
        </div>

        {/* NÚT TÁC VỤ: BẬT CHUÔNG & THU GỌN */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleBell}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              isBellEnabled
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 hover:bg-amber-400/30'
                : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title={isBellEnabled ? 'Đang bật chuông nhắc học bài' : 'Bấm để bật chuông nhắc học bài'}
          >
            <Bell className={`w-3.5 h-3.5 ${isBellEnabled ? 'text-amber-400 fill-amber-400' : ''}`} />
            <span className="hidden sm:inline">{isBellEnabled ? 'Đang Nhắc Học Bài' : 'Bật Nhắc Học'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-white font-bold text-xs transition cursor-pointer border border-blue-700/50 flex items-center gap-1"
            title={isExpanded ? 'Thu gọn lời nhắc' : 'Mở rộng lời nhắc'}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 text-cyan-300" />
                <span className="hidden sm:inline">Thu Gọn</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 text-cyan-300" />
                <span className="hidden sm:inline">Xem Lời Nhắc</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. KHI THU GỌN: THANH TÓM TẮT NHANH */}
      {!isExpanded && (
        <div className="px-4 py-2.5 bg-blue-950/40 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 text-blue-100 font-medium">
            <span className="text-amber-300">💡</span>
            <span>
              <strong>Thầy Thành nhắc:</strong> Em hãy thi thử 1 đề minh họa GK1 và ôn từ vựng Unit 1-3 để tăng <strong>+35đ thi đua</strong> hôm nay nhé!
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onGoToExam}
              className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-xs"
            >
              ✍️ Làm Đề GK1
            </button>
            <button
              type="button"
              onClick={() => onGoToVocabUnit(1, grade)}
              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition cursor-pointer shadow-xs"
            >
              📚 Luyện Từ Vựng
            </button>
          </div>
        </div>
      )}

      {/* 3. KHI MỞ RỘNG: 3 CARD NHẮC NHỞ HÀNH ĐỘNG CỐT LÕI */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* CAM KẾT BẢO MẬT ĐỀ THI HỌC ĐƯỜNG */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start sm:items-center gap-3 text-amber-900 dark:text-amber-200">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-xs text-base">
              🔒
            </div>
            <div className="text-xs sm:text-sm leading-relaxed">
              <strong className="font-black text-amber-950 dark:text-amber-100 uppercase">Quy Chế Bảo Mật Đề Thi:</strong>{' '}
              Toàn bộ bài tập và đề thi trên website là <strong>ĐỀ THI THỬ MINH HỌA &amp; LUYỆN TẬP MÔ PHỎNG</strong> theo ma trận Công văn 7991/BGDĐT.
              Website <strong>TUYỆT ĐỐI KHÔNG ĐƯA ĐỀ KIỂM TRA CHÍNH THỨC</strong> của nhà trường lên mạng internet để bảo đảm tuyệt đối tính bảo mật và công bằng học tập cho học sinh.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {/* LỜI NHẮC 1: LÀM BÀI THI ONLINE ĐỀ GIỮA KỲ 1 (GK1) */}
            <div className="rounded-2xl bg-[#0B1E36]/90 border border-amber-400/40 p-4 flex flex-col justify-between shadow-md hover:border-amber-300 transition-all group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-xs">
                    ✍️ Trọng Tâm Nhận Dạng Đề
                  </span>
                  <span className="text-[11px] font-black text-amber-300">
                    +30đ Thi Đua
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-black text-white group-hover:text-amber-300 transition-colors">
                  Thi Thử Online Đề Minh Họa GK1 (Lớp {grade})
                </h4>

                <p className="text-xs text-blue-100/90 leading-relaxed mt-1.5 font-normal">
                  <strong>Mục đích:</strong> Giúp em làm quen với ma trận 40 câu trắc nghiệm chuẩn Bộ GD&amp;ĐT (Ngữ âm, Trọng âm, Tìm lỗi sai, Đọc hiểu). Cọ xát đề có bấm giờ 45-60 phút để không bỡ ngỡ và tự tin đạt điểm 9-10 khi thi trên lớp!
                </p>

                <div className="mt-2.5 space-y-1 text-[11px] text-cyan-200 font-medium">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Làm quen dạng bài bẫy thường gặp</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Chấm điểm tự động &amp; xem giải thích từng câu</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-blue-500/30 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onGoToExam}
                  className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                  title="Mở phân hệ Đề Thi Online Giữa Kỳ 1"
                >
                  <Award className="w-4 h-4 text-slate-950" />
                  <span>Vào Thi Thử Minh Họa GK1</span>
                </button>
                <button
                  type="button"
                  onClick={onGoToQuiz}
                  className="px-2.5 py-2 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-cyan-200 hover:text-white font-bold text-xs transition cursor-pointer border border-blue-700/50"
                  title="Thử sức bài trắc nghiệm nhanh 15 phút"
                >
                  15 Phút
                </button>
              </div>
            </div>

            {/* LỜI NHẮC 2: HỌC TỪ VỰNG TRỌNG TÂM ĐỂ TĂNG ĐIỂM SỐ NHANH HƠN */}
            <div className="rounded-2xl bg-[#0B1E36]/90 border border-emerald-400/40 p-4 flex flex-col justify-between shadow-md hover:border-emerald-300 transition-all group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xs">
                    📚 Tăng Điểm Thần Tốc
                  </span>
                  <span className="text-[11px] font-black text-emerald-300">
                    +15đ / Bài Học
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-black text-white group-hover:text-emerald-300 transition-colors">
                  Luyện Từ Vựng Unit 1 - Unit 3
                </h4>

                <p className="text-xs text-blue-100/90 leading-relaxed mt-1.5 font-normal">
                  <strong>Mục đích:</strong> Từ vựng Unit 1 - 3 chiếm 50% điểm số bài thi GK1. Mỗi bài từ vựng hoàn thành giúp em nhận ngay <strong>+15đ thi đua</strong> (+35% ngày vàng) để bứt phá bảng xếp hạng toàn trường!
                </p>

                <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => onGoToVocabUnit(1, grade)}
                    className="px-2 py-1 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-200 font-bold transition flex items-center gap-1 cursor-pointer"
                    title={`Mở từ vựng ${unit1.title}`}
                  >
                    <span>Unit 1</span>
                    <span className="text-[9px] text-emerald-300">({unit1.wordCount} từ)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onGoToVocabUnit(2, grade)}
                    className="px-2 py-1 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-200 font-bold transition flex items-center gap-1 cursor-pointer"
                    title={`Mở từ vựng ${unit2.title}`}
                  >
                    <span>Unit 2</span>
                    <span className="text-[9px] text-emerald-300">({unit2.wordCount} từ)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onGoToVocabUnit(3, grade)}
                    className="px-2 py-1 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-200 font-bold transition flex items-center gap-1 cursor-pointer"
                    title={`Mở từ vựng ${unit3.title}`}
                  >
                    <span>Unit 3</span>
                    <span className="text-[9px] text-emerald-300">({unit3.wordCount} từ)</span>
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-blue-500/30">
                <button
                  type="button"
                  onClick={() => onGoToVocabUnit(1, grade)}
                  className="w-full px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4 text-white" />
                  <span>Vào Luyện Từ Vựng Ngay</span>
                </button>
              </div>
            </div>

            {/* LỜI NHẮC 3: ÔN ĐỀ CƯƠNG GK1 TOÀN DIỆN */}
            <div className="rounded-2xl bg-[#0B1E36]/90 border border-cyan-400/40 p-4 flex flex-col justify-between shadow-md hover:border-cyan-300 transition-all group md:col-span-2 lg:col-span-1">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-xs">
                    📖 Đề Cương Bám Sát SGK & Ma Trận
                  </span>
                  <span className="text-[11px] font-black text-cyan-300">
                    Tài Liệu Ôn Tập SGK
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-black text-white group-hover:text-cyan-300 transition-colors">
                  Ôn Đề Cương GK1 Có Đáp Án Chi Tiết
                </h4>

                <p className="text-xs text-blue-100/90 leading-relaxed mt-1.5 font-normal">
                  <strong>Mục đích:</strong> Nắm chắc lý thuyết ngữ pháp trọng tâm và làm toàn bộ bài tập tự luận, viết lại câu theo đề cương thực dạy của Thầy Thành.
                </p>

                <div className="mt-2.5 p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[11px] text-cyan-100">
                  <span>💡 <strong>Lưu ý của Thầy:</strong> Học sinh Lớp 6 ôn Đề cương Anh 6; Học sinh Lớp 8 ôn Đề cương Anh 8 có sẵn đáp án đối chiếu.</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-blue-500/30 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onGoToDecuong}
                  className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-4 h-4 text-white" />
                  <span>Mở Đề Cương GK1 Lớp {grade}</span>
                </button>
                <button
                  type="button"
                  onClick={onGoToLeaderboard}
                  className="px-2.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs transition cursor-pointer border border-amber-400/30 flex items-center gap-1"
                  title="Xem thứ hạng thi đua hiện tại"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Bảng Vàng</span>
                </button>
              </div>
            </div>

          </div>

          {/* 4. MẸO SƯ PHẠM NHẬN DẠNG ĐỀ THI GK1 CỦA THẦY ĐINH THÀNH */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-blue-950/60 border border-blue-400/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-base">💡</span>
                <span className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wide">
                  Phương Pháp Tư Duy & Kỹ Năng Làm Bài Thi Minh Họa Của Thầy Thành
                </span>
              </div>
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTipTab('pronunciation')}
                  className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                    activeTipTab === 'pronunciation' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  1. Ngữ Âm
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTipTab('grammar')}
                  className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                    activeTipTab === 'grammar' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  2. Ngữ Pháp
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTipTab('error_find')}
                  className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                    activeTipTab === 'error_find' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  3. Tìm Lỗi Sai
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTipTab('reading')}
                  className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                    activeTipTab === 'reading' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  4. Đọc Hiểu
                </button>
              </div>
            </div>

            {/* NỘI DUNG MẸO TƯƠNG ỨNG */}
            <div className="text-xs text-blue-100 leading-relaxed bg-[#0B1E36]/80 p-3 rounded-lg border border-blue-500/20">
              <div className="mb-2 p-2 rounded bg-amber-500/10 border border-amber-400/20 text-[11px] text-amber-200">
                🔒 <strong>Quy chế bảo mật &amp; sư phạm:</strong> Các bí quyết trên nhằm rèn phương pháp tư duy và kỹ năng làm bài tập Tiếng Anh nói chung. Tuyệt đối nghiêm cấm việc gợi ý hoặc ngụ ý câu hỏi có trong đề thi chính thức. Hệ thống nghiêm cấm lộ đề dưới mọi hình thức!
              </div>
              {activeTipTab === 'pronunciation' && (
                <div>
                  <strong className="text-amber-300">🔊 Bí quyết câu Ngữ âm &amp; Trọng âm:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-200">
                    <li><strong>Đuôi -s/-es:</strong> Nhớ câu thần chú <em>"Thời phong kiến f-p-k-t-th"</em> phát âm là <code>/s/</code>; đuôi <em>s, x, ch, sh, z, ge</em> phát âm là <code>/iz/</code>; còn lại phát âm là <code>/z/</code>.</li>
                    <li><strong>Đuôi -ed:</strong> Tận cùng là <em>t, d</em> phát âm là <code>/id/</code> (tiền đô); tận cùng <em>p, k, f, s, sh, ch</em> phát âm là <code>/t/</code>; còn lại là <code>/d/</code>.</li>
                    <li><strong>Trọng âm từ 2 âm tiết:</strong> Danh từ &amp; Tính từ thường nhấn <strong>âm 1</strong> (như <em>village, country, happy</em>); Động từ thường nhấn <strong>âm 2</strong> (như <em>relax, collect, enjoy</em>).</li>
                  </ul>
                </div>
              )}

              {activeTipTab === 'grammar' && (
                <div>
                  <strong className="text-amber-300">🧩 Bí quyết nhận diện câu Ngữ pháp:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-200">
                    <li>Thấy dấu hiệu <em>always, usually, often, every day, on Sundays</em> ➔ Chọn <strong>Hiện tại đơn</strong> (He/She/It + V-s/es).</li>
                    <li>Thấy dấu hiệu <em>yesterday, last week, ago, in 2020</em> ➔ Chọn <strong>Quá khứ đơn</strong> (V2/V-ed).</li>
                    <li>Sau các động từ chỉ sở thích/cảm xúc: <em>like, love, enjoy, fancy, adore, dislike, hate</em> ➔ Bắt buộc đi với <strong>V-ing</strong> (ví dụ: <em>enjoy playing, hate cooking</em>).</li>
                  </ul>
                </div>
              )}

              {activeTipTab === 'error_find' && (
                <div>
                  <strong className="text-amber-300">🔍 Kỹ thuật nhận diện Tìm Lỗi Sai trong 5 giây:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-200">
                    <li><strong>Lỗi chia động từ:</strong> Kiểm tra chủ ngữ số ít hay số nhiều (như <em>Every student have ➔ has</em>).</li>
                    <li><strong>Lỗi cấu trúc song hành:</strong> Trước và sau từ nối <em>and, but, or</em> phải cùng dạng (như <em>swimming, singing and dance ➔ dancing</em>).</li>
                    <li><strong>Lỗi mạo từ &amp; lượng từ:</strong> <em>many</em> đi với danh từ đếm được số nhiều; <em>much</em> đi với danh từ không đếm được.</li>
                  </ul>
                </div>
              )}

              {activeTipTab === 'reading' && (
                <div>
                  <strong className="text-amber-300">📖 Chiến thuật làm bài Đọc hiểu nhanh không cần dịch hết:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-200">
                    <li><strong>Đọc câu hỏi trước:</strong> Gạch chân từ khóa (tên riêng, năm tháng, địa danh hoặc thuật ngữ chính).</li>
                    <li><strong>Quét (Scan) đoạn văn:</strong> Tìm dòng chứa từ khóa đó trong bài đọc ➔ Đọc kỹ câu trước và câu sau dòng đó để chọn đáp án.</li>
                    <li><strong>Câu hỏi ý chính (Main idea / Title):</strong> Thường nằm ở 1-2 câu đầu tiên hoặc câu cuối cùng của đoạn văn mở đầu.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
