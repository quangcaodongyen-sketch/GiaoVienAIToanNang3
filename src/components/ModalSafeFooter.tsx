import React from 'react';

interface ModalSafeFooterProps {
  onClose?: () => void;
  onOpenAdmin?: () => void;
}

export const ModalSafeFooter: React.FC<ModalSafeFooterProps> = ({ onClose, onOpenAdmin }) => {
  return (
    <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/95 flex flex-col gap-1.5 shrink-0">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div>
          <span className="font-semibold text-slate-200">Tác giả: <strong className="text-amber-400 font-bold">Đinh Thành</strong></span>
          <span className="mx-2 text-slate-600">•</span>
          <span className="text-slate-300">Hỗ trợ kỹ thuật Zalo: <a href="https://zalo.me/0915213717" target="_blank" rel="noreferrer" className="text-emerald-400 font-bold hover:underline">0915.213717</a></span>
        </div>
        <div className="flex items-center gap-3">
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="text-[11px] text-slate-500 hover:text-slate-300 transition cursor-pointer"
            >
              Quản trị Admin ↗
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
            >
              Đóng cửa sổ
            </button>
          )}
        </div>
      </div>
      <div className="text-[11px] text-slate-400 leading-relaxed">
        Thầy/Cô tải phần mềm về cài đặt dùng thử trên máy tính. Để được hỗ trợ kỹ thuật và mở khóa tính năng Pro đầy đủ, Thầy/Cô vui lòng nhắn tin trực tiếp qua Zalo: <span className="text-emerald-400 font-semibold">0915.213717</span> (Tác giả Đinh Thành).
      </div>
      <div className="text-[10px] text-slate-500 italic border-t border-slate-900 pt-1 leading-relaxed">
        * Cam kết miễn nhiệm: Toàn bộ ứng dụng và tài liệu mang tính chất tham khảo, hỗ trợ giáo viên trong công tác soạn giảng. Mọi nội dung do AI gợi ý cần được giáo viên rà soát, thẩm định trước khi áp dụng. Tác giả không chịu trách nhiệm đối với việc sử dụng nguyên văn vào thực tế giảng dạy.
      </div>
    </div>
  );
};
