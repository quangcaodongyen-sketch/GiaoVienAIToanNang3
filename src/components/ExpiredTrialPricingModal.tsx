import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Crown, 
  Check, 
  Copy, 
  QrCode, 
  MessageCircle, 
  Clock,
  Share2
} from 'lucide-react';
import { BRAND } from '../config/brand';

interface ExpiredTrialPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  appName?: string;
  appId?: string;
  hardwareCode?: string;
}

export const ExpiredTrialPricingModal: React.FC<ExpiredTrialPricingModalProps> = ({
  isOpen,
  onClose,
  appName = "Công cụ AI Giáo Viên",
  hardwareCode = ""
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'1YEAR' | '2YEAR' | 'FULL_WEB'>('2YEAR');
  const [isCopiedMid, setIsCopiedMid] = useState(false);
  const [isCopiedStk, setIsCopiedStk] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, type: 'mid' | 'stk') => {
    navigator.clipboard.writeText(text);
    if (type === 'mid') {
      setIsCopiedMid(true);
      setTimeout(() => setIsCopiedMid(false), 2000);
    } else {
      setIsCopiedStk(true);
      setTimeout(() => setIsCopiedStk(false), 2000);
    }
  };

  const zaloLink = `https://zalo.me/${BRAND.zalo}?text=${encodeURIComponent(
    `Chào Thầy Thành, tôi đã dùng thử hết 5 lượt phần mềm ${appName}. Nhờ Thầy tư vấn và báo giá chi tiết giúp tôi (Mã máy: ${hardwareCode}).`
  )}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-5 sm:p-7 space-y-6 text-white cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* NÚT ĐÓNG */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* PHẦN ĐẦU: LỜI MỞ ĐẦU CHÂN TÌNH, KHÉO LÉO & TRI ÂN */}
        <div className="text-center space-y-2.5 max-w-2xl mx-auto pt-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            TRI ÂN THẦY/CÔ ĐÃ HOÀN THÀNH 5 LƯỢT TRẢI NGHIỆM MIỄN PHÍ
          </div>
          
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
            Cảm Ơn Thầy/Cô Đã Tin Dùng <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{appName}</span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Thầy/Cô vừa hoàn thành <strong>5 lượt tạo sản phẩm thực tế</strong> và tiết kiệm được nhiều giờ làm việc căng thẳng! 
            Để tiếp tục đồng hành cùng Thầy/Cô trong suốt các kỳ thi và năm học 2026 – 2027, tác giả <strong>Thầy giáo Đinh Văn Thành</strong> gửi tặng chính sách trợ giá đặc biệt dành riêng cho giáo viên:
          </p>
        </div>

        {/* KHỐI VIRAL CHIA SẺ ZALO NHẬN THÊM 3 LƯỢT DÙNG THỬ (QUẢNG CÁO TỰ ĐỘNG VIỆT NAM) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border-2 border-emerald-500/70 shadow-2xl space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-l from-emerald-500 to-teal-500 text-slate-950 font-black text-[10px] rounded-bl-xl uppercase tracking-wider shadow">
            🎉 QUÀ TẶNG SƯ PHẠM
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-xl shrink-0 border border-emerald-500/30">
                🎁
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-emerald-300">
                  TẶNG THÊM 3 LƯỢT DÙNG THỬ KHI CHIA SẺ VÀO NHÓM ZALO TRƯỜNG
                </h4>
                <p className="text-[11px] text-slate-300">
                  Thầy/Cô hãy lan tỏa phần mềm hữu ích này đến đồng nghiệp cùng trường hoặc tổ bộ môn nhé!
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 w-fit">
              +3 LƯỢT DÙNG THỬ
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
            <button
              onClick={() => {
                const viralShareText = `Kính gửi quý Thầy/Cô,\nTôi đang dùng phần mềm hỗ trợ giáo viên "${appName}" của Thầy giáo Đinh Văn Thành (THCS Đồng Yên) rất hay và chuẩn quy định Bộ GD&ĐT (CV 7991 & CV 5512). Thầy/Cô vào dùng thử miễn phí trực tiếp trên web tại đây nhé:\n👉 https://giao-vien-ai-toan-nang3.vercel.app/\n(Hotline/Zalo tác giả: 0915.213717)`;
                navigator.clipboard.writeText(viralShareText);
                
                // Mở cửa sổ Zalo chia sẻ
                window.open(`https://zalo.me/${BRAND.phoneRaw}?text=${encodeURIComponent(viralShareText)}`, '_blank');
                
                // Mở khóa thêm lượt dùng thử
                localStorage.removeItem('gvai_taode_sec_trials_v3');
                localStorage.removeItem('gvai_thcs8m_trials_v3');
                localStorage.removeItem('gvai_bienthe_sec_trials_v3');
                localStorage.removeItem('gvai_tts_trial_count');
                
                alert(`🎉 Chúc mừng Thầy/Cô!\n\nHệ thống đã tự động sao chép bài viết và mở Zalo để Thầy/Cô dán vào nhóm Zalo nhà trường / tổ chuyên môn.\n\n🎁 Thầy/Cô đã được CỘNG THÊM 3 LƯỢT DÙNG THỬ MIỄN PHÍ! Xin mời Thầy/Cô bấm OK để tiếp tục trải nghiệm.`);
                onClose();
                window.location.reload();
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition active:scale-[0.98] cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-amber-300 animate-bounce" />
              Bấm Vào Đây: Chia Sẻ Nhóm Zalo Trường & Nhận Thêm 3 Lượt Miễn Phí
            </button>
          </div>
        </div>

        {/* 1 THẺ BÁO GIÁ DUY NHẤT - ĐƠN GIẢN HÓA THEO YÊU CẦU CỦA THẦY THÀNH */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border-2 border-cyan-500/50 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  👑 CHÍNH SÁCH BẢN QUYỀN CHÍNH THỨC
                </span>
                <span className="text-[10px] text-amber-400 font-semibold">Ưu Đãi Sư Phạm</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-white mt-1">
                Đăng Ký Bản Quyền & Nhận Báo Giá Chi Tiết Qua Zalo
              </h4>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <div className="text-sm sm:text-base font-black text-cyan-400">
                Liên Hệ Thầy Thành (Admin)
              </div>
              <p className="text-[11px] text-slate-400">Tư vấn linh hoạt theo nhu cầu của Thầy/Cô</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Trợ giá giáo dục:</strong> Mức giá ưu đãi đặc biệt dành riêng cho giáo viên và các nhà trường, cực kỳ tiết kiệm.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Tùy chọn đa dạng:</strong> Thầy Thành sẽ báo giá chi tiết theo từng môn học, theo năm học hoặc trọn gói hệ thống phần mềm.</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Hỗ trợ cài đặt trọn gói:</strong> Kết nối UltraViewer / TeamViewer cài đặt trực tiếp lên máy tính của Thầy/Cô hoàn toàn miễn phí.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Cập nhật dài lâu:</strong> Miễn phí cập nhật mẫu đề, ngân hàng câu hỏi mới nhất từ Bộ GD&ĐT.</span>
              </div>
            </div>
          </div>

          {/* NÚT BẤM ZALO NỔI BẬT */}
          <div className="pt-1">
            <a
              href={zaloLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition active:scale-[0.98] cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 text-amber-300 animate-pulse" />
              Bấm Vào Đây Để Nhắn Zalo Thầy Thành Nhận Báo Giá Chi Tiết ({BRAND.phone})
            </a>
          </div>
        </div>

        {/* KHỐI QUÉT MÃ QR MB BANK & HƯỚNG DẪN KÍCH HOẠT NHANH */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-amber-500/60 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-amber-300 uppercase tracking-wide">
                  THÔNG TIN TÀI KHOẢN THANH TOÁN (MB BANK)
                </h4>
                <p className="text-xs text-slate-400">
                  Phần mềm: <strong className="text-white">{appName}</strong> — <span className="text-emerald-400 font-semibold">Nhắn Zalo Thầy Thành để nhận báo giá ưu đãi và kích hoạt tức thì</span>
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 w-fit">
              DUYỆT NHANH 24/7
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            {/* Ảnh mã QR MB Bank */}
            <div className="shrink-0 relative group">
              <img
                src="/qr_payment.png"
                alt="Mã QR MB Bank Thầy Thành"
                className="w-40 h-auto rounded-xl border-2 border-amber-500/50 shadow-lg bg-white p-1.5 object-contain"
              />
            </div>

            {/* Thông tin tài khoản & Cảnh báo */}
            <div className="flex-1 text-xs space-y-2.5 text-slate-300 w-full">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div><strong>Ngân hàng:</strong> <span className="text-cyan-300 font-bold">MB Bank (Quân đội)</span></div>
                <div className="flex items-center justify-between">
                  <span><strong>Số tài khoản:</strong> <span className="text-amber-300 font-mono font-black text-sm">0915213717</span></span>
                  <button
                    type="button"
                    onClick={() => handleCopy('0915213717', 'stk')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 border border-slate-700 font-bold cursor-pointer"
                  >
                    {isCopiedStk ? '✓ Đã sao chép' : 'Sao chép STK'}
                  </button>
                </div>
                <div><strong>Chủ tài khoản:</strong> <span className="text-white font-bold">DINH VAN THANH</span></div>
                {hardwareCode && (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px]">
                    <span>Mã máy của Thầy/Cô: <code className="text-cyan-300 font-mono font-bold">{hardwareCode}</code></span>
                    <button
                      type="button"
                      onClick={() => handleCopy(hardwareCode, 'mid')}
                      className="text-cyan-400 hover:underline cursor-pointer"
                    >
                      {isCopiedMid ? '✓ Đã chép' : 'Chép mã máy'}
                    </button>
                  </div>
                )}
              </div>

              {/* DÒNG CẢNH BÁO BẮT BUỘC THEO CHỈ THỊ CỦA THẦY THÀNH */}
              <div className="p-2.5 rounded-xl bg-red-950/90 border-2 border-red-500 text-center shadow-lg shadow-red-950/50">
                <p className="text-xs font-black text-red-200 uppercase tracking-wide flex items-center justify-center gap-1.5">
                  ⚠️ LƯU Ý BẮT BUỘC: KHÔNG GHI NỘI DUNG CHUYỂN KHOẢN
                </p>
                <p className="text-[10px] text-red-300/90 mt-0.5">
                  (Thầy/Cô vui lòng XÓA TRỐNG / ĐỂ TRỐNG toàn bộ phần nội dung khi quét mã chuyển khoản)
                </p>
              </div>

              {/* Nút bấm liên hệ Zalo Thầy Thành */}
              <div className="pt-1 flex items-center gap-2">
                <a
                  href={zaloLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4" />
                  Bấm Vào Đây Để Nhắn Zalo Thầy Thành (0915.213717)
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition cursor-pointer"
                >
                  Đóng Lại
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
