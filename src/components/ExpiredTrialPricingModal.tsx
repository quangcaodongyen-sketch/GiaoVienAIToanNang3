import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Crown, 
  Check, 
  Copy, 
  QrCode, 
  MessageCircle, 
  Clock
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

  const currentPlanName = 
    selectedPlan === '1YEAR' ? `Gói 1 Năm (${appName})` : 
    selectedPlan === '2YEAR' ? `Gói 2 Năm VIP (${appName})` : 'Gói Full Web Trọn Bộ Hệ Sinh Thái (Tất Cả Phần Mềm)';

  const zaloLink = `https://zalo.me/${BRAND.zalo}?text=Thay%20Thanh%20oi,%20toi%20muon%20nhan%20bao%20gia%20kich%20hoat%20${encodeURIComponent(currentPlanName)}.%20Ma%20may:%20${encodeURIComponent(hardwareCode)}`;

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

        {/* 3 THẺ BẢNG GIÁ LÔI CUỐN - ẨN GIÁ CÔNG KHAI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
          
          {/* THẺ 1: GÓI 1 NĂM */}
          <div
            onClick={() => setSelectedPlan('1YEAR')}
            className={`p-4 rounded-2xl border-2 flex flex-col justify-between cursor-pointer transition-all ${
              selectedPlan === '1YEAR'
                ? 'bg-gradient-to-b from-blue-950/60 to-slate-900 border-blue-400 shadow-lg shadow-blue-500/20 scale-[1.02]'
                : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 opacity-90'
            }`}
          >
            <div className="space-y-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30">
                GÓI 1 NĂM HỌC
              </span>
              <h4 className="font-bold text-sm text-white">{appName}</h4>
              <div className="text-xl font-black text-blue-400">
                Báo Giá Ưu Đãi
              </div>
              <p className="text-[11px] text-blue-300/90 font-medium">Chi phí hỗ trợ giáo dục cực kỳ tiết kiệm</p>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-1 border-t border-slate-800">
                <li className="flex items-center gap-1.5">✓ Sử dụng 12 tháng trọn vẹn</li>
                <li className="flex items-center gap-1.5">✓ Đầy đủ tính năng Pro cao cấp</li>
                <li className="flex items-center gap-1.5">✓ Xuất file Word chuẩn in ấn A4</li>
              </ul>
            </div>
            <button className={`w-full mt-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedPlan === '1YEAR' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}>
              {selectedPlan === '1YEAR' ? '✓ ĐANG CHỌN GÓI NÀY' : 'Chọn Gói 1 Năm'}
            </button>
          </div>

          {/* THẺ 2: GÓI 2 NĂM VIP */}
          <div
            onClick={() => setSelectedPlan('2YEAR')}
            className={`p-4 rounded-2xl border-2 flex flex-col justify-between cursor-pointer transition-all relative ${
              selectedPlan === '2YEAR'
                ? 'bg-gradient-to-b from-amber-950/60 to-slate-900 border-amber-400 shadow-xl shadow-amber-500/25 scale-[1.04]'
                : 'bg-slate-950/70 border-amber-500/50 hover:border-amber-400'
            }`}
          >
            {/* BADGE ƯU ĐÃI */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-black text-[9px] tracking-wider uppercase shadow-md flex items-center gap-1 shrink-0 whitespace-nowrap">
              <Clock className="w-3 h-3 animate-spin" />
              ƯU ĐÃI NĂM HỌC 2026 - 2027
            </div>

            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  🔥 TIẾT KIỆM NHẤT
                </span>
                <span className="text-[10px] text-amber-400 font-semibold">Gói Được Chọn Nhiều</span>
              </div>
              <h4 className="font-bold text-sm text-white">Gói 2 Năm VIP Ưu Đãi</h4>
              <div className="text-xl font-black text-amber-300">
                Báo Giá Tiết Kiệm
              </div>
              <p className="text-[11px] text-emerald-400 font-bold">Lựa chọn phổ biến & tiết kiệm nhất</p>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-1 border-t border-slate-800">
                <li className="flex items-center gap-1.5">✓ Sử dụng 24 tháng liên tục</li>
                <li className="flex items-center gap-1.5">✓ Tặng kèm Add-in Word & kho tài liệu</li>
                <li className="flex items-center gap-1.5">✓ Cập nhật đề mẫu mới miễn phí</li>
                <li className="flex items-center gap-1.5 text-amber-300 font-semibold">
                  ⭐️ Hỗ trợ kỹ thuật 24/7 trực tiếp từ Thầy Thành
                </li>
              </ul>
            </div>
            <button className={`w-full mt-4 py-2 rounded-xl text-xs font-black transition ${
              selectedPlan === '2YEAR' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300'
            }`}>
              {selectedPlan === '2YEAR' ? '👑 LỰA CHỌN ƯU ĐÃI NHẤT' : 'Chọn Gói 2 Năm VIP'}
            </button>
          </div>

          {/* THẺ 3: GÓI FULL WEB - TẤT CẢ PHẦN MỀM */}
          <div
            onClick={() => setSelectedPlan('FULL_WEB')}
            className={`p-4 rounded-2xl border-2 flex flex-col justify-between cursor-pointer transition-all relative ${
              selectedPlan === 'FULL_WEB'
                ? 'bg-gradient-to-b from-emerald-950/60 to-slate-900 border-emerald-400 shadow-xl shadow-emerald-500/25 scale-[1.02]'
                : 'bg-slate-950/70 border-emerald-500/40 hover:border-emerald-400 opacity-90'
            }`}
          >
            <div className="absolute -top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow">
              TIẾT KIỆM 80%
            </div>

            <div className="space-y-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                👑 TRỌN BỘ HỆ SINH THÁI
              </span>
              <h4 className="font-bold text-sm text-white">Gói Full Web Toàn Năng</h4>
              <div className="text-xl font-black text-emerald-400">
                Báo Giá Trọn Bộ
              </div>
              <p className="text-[11px] text-emerald-300 font-semibold">Mở khóa 100% tất cả các app trên web</p>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-1 border-t border-slate-800">
                <li className="flex items-center gap-1.5">✓ Tạo đề 8 môn THCS (CV 7991)</li>
                <li className="flex items-center gap-1.5">✓ Tạo đề Tiếng Anh & File Nghe MP3</li>
                <li className="flex items-center gap-1.5">✓ Sinh 3 đề biến thể VIP chống cóp</li>
                <li className="flex items-center gap-1.5">✓ Chuẩn hóa văn bản NĐ 30 & Giáo án 5512</li>
                <li className="flex items-center gap-1.5">✓ Đinh Thành Cleaner Pro, PDF Suite Pro...</li>
              </ul>
            </div>
            <button className={`w-full mt-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedPlan === 'FULL_WEB' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-800 text-slate-300'
            }`}>
              {selectedPlan === 'FULL_WEB' ? '✓ ĐANG CHỌN FULL WEB' : 'Chọn Gói Full Web'}
            </button>
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
                  QUÉT MÃ QR THANH TOÁN (MB BANK) - KÍCH HOẠT TỨC THÌ
                </h4>
                <p className="text-xs text-slate-400">
                  Đang chọn: <strong className="text-white">{currentPlanName}</strong> — <span className="text-emerald-400 font-semibold">Nhắn Zalo Thầy Thành để nhận báo giá ưu đãi sư phạm</span>
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
