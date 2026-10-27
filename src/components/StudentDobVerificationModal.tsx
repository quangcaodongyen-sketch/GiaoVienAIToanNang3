import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { studentGradebookService, StudentProfile } from '../services/studentGradebookService';

export interface StudentDobVerificationModalProps {
  isOpen: boolean;
  student: StudentProfile | null;
  actionTitle?: string;
  onClose: () => void;
  onVerified: () => void;
}

export const StudentDobVerificationModal: React.FC<StudentDobVerificationModalProps> = ({
  isOpen,
  student,
  actionTitle = 'đăng bài / bình luận / nhắn tin',
  onClose,
  onVerified
}) => {
  const [inputDob, setInputDob] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [useTextInput, setUseTextInput] = useState<boolean>(false);

  if (!isOpen || !student) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!inputDob.trim()) {
      setErrorMsg('Vui lòng chọn hoặc nhập Ngày Tháng Năm Sinh của em!');
      return;
    }

    const res = studentGradebookService.verifyStudentDob(student, inputDob.trim());
    if (res.success) {
      setSuccessMsg('🎉 ' + res.message);
      setTimeout(() => {
        onVerified();
      }, 700);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border-2 border-emerald-500/40 shadow-2xl p-6 relative animate-in zoom-in-95 duration-150">
        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black shadow-md shadow-emerald-500/30 text-2xl shrink-0">
            🛡️
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Xác Thực Danh Tính Học Sinh</span>
            </h3>
            <p className="text-xs text-slate-500">
              Trường THCS Đồng Yên • Bảo vệ tài khoản & Chống mạo danh
            </p>
          </div>
        </div>

        {/* Thông tin học sinh đang đăng nhập */}
        <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">👦</span>
            <div>
              <div className="text-xs font-black text-emerald-950 dark:text-emerald-200">
                {student.name}
              </div>
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
                Lớp: {student.className} (Khối {student.grade})
              </div>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 font-bold">
            Sổ Điểm THCS
          </span>
        </div>

        {/* Lời giải thích sư phạm */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          Để đảm bảo an toàn, tránh người khác mạo danh gửi tin nhắn hoặc bình luận không đúng chuẩn mực học đường, em vui lòng <strong>xác thực Ngày Tháng Năm Sinh</strong> theo sổ điểm để mở quyền <strong>{actionTitle}</strong> nhé!
        </p>

        {/* Form nhập ngày sinh */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
                🎂 Ngày Tháng Năm Sinh Của Em (*):
              </label>
              <button
                type="button"
                onClick={() => {
                  setUseTextInput(!useTextInput);
                  setInputDob('');
                  setErrorMsg('');
                }}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                {useTextInput ? '📅 Chọn từ lịch' : '⌨️ Gõ tay DD/MM/YYYY'}
              </button>
            </div>

            {useTextInput ? (
              <input
                type="text"
                autoFocus
                value={inputDob}
                onChange={(e) => {
                  setInputDob(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Ví dụ: 14/08/2013 hoặc 04/04/2015..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono"
              />
            ) : (
              <input
                type="date"
                autoFocus
                value={inputDob}
                onChange={(e) => {
                  setInputDob(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-hidden cursor-pointer"
              />
            )}
            <p className="text-[10px] text-slate-400 mt-1">
              {useTextInput 
                ? 'Định dạng ngày/tháng/năm (vd: 14/08/2013)' 
                : 'Bấm biểu tượng lịch để chọn ngày sinh của em'}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-black flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Để Sau
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              <span>Xác Thực Danh Tính Ngay</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
