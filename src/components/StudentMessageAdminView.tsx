import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  Trash2, 
  Reply, 
  User, 
  Phone, 
  ChevronRight,
  Sparkles,
  Inbox
} from 'lucide-react';
import { studentMessageService, StudentPrivateMessage } from '../services/studentMessageService';
import { StudentProfile } from '../services/studentGradebookService';
import { BRAND } from '../config/brand';

interface StudentMessageAdminViewProps {
  currentStudent: StudentProfile | null;
  isAdmin: boolean;
  onRequestAuth: () => void;
  onRequestAdminLogin: () => void;
}

export const StudentMessageAdminView: React.FC<StudentMessageAdminViewProps> = ({
  currentStudent,
  isAdmin,
  onRequestAuth,
  onRequestAdminLogin
}) => {
  // Dành cho Học sinh gửi tin
  const [subject, setSubject] = useState<string>('Hỏi bài tập');
  const [content, setContent] = useState<string>('');
  const [senderPhone, setSenderPhone] = useState<string>(currentStudent?.parentPhone || '');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);
  const [sendError, setSendError] = useState<string>('');

  // Tin nhắn của chính học sinh hiện tại
  const [studentMessages, setStudentMessages] = useState<StudentPrivateMessage[]>([]);

  // Dành riêng cho Admin
  const [adminAllMessages, setAdminAllMessages] = useState<StudentPrivateMessage[]>([]);
  const [adminFilterStatus, setAdminFilterStatus] = useState<'all' | 'unread' | 'replied'>('all');
  const [replyingMessageId, setReplyingMessageId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');

  const loadData = () => {
    if (currentStudent) {
      setStudentMessages(studentMessageService.getMessagesForStudent(currentStudent.id));
    } else {
      setStudentMessages([]);
    }

    if (isAdmin) {
      setAdminAllMessages(studentMessageService.getAllMessagesForAdmin(true));
    } else {
      setAdminAllMessages([]);
    }
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener('gvai_messages_data_changed', handleUpdate);
    return () => {
      window.removeEventListener('gvai_messages_data_changed', handleUpdate);
    };
  }, [currentStudent, isAdmin]);

  const handleStudentSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setSendError('');
    setSendSuccess(false);

    if (!currentStudent) {
      onRequestAuth();
      return;
    }

    const text = content.trim();
    if (!text) {
      setSendError('Vui lòng nhập nội dung tin nhắn gửi đến Thầy Thành!');
      return;
    }

    setIsSending(true);
    try {
      studentMessageService.sendMessage({
        senderId: currentStudent.id,
        senderName: currentStudent.name,
        senderClass: currentStudent.className,
        senderPhone: senderPhone.trim() || currentStudent.parentPhone,
        senderStudentCode: currentStudent.studentCode,
        subject,
        content: text
      });

      setContent('');
      setSendSuccess(true);
      loadData();
      setTimeout(() => setSendSuccess(false), 6000);
    } catch (err: any) {
      setSendError('Lỗi khi gửi tin nhắn: ' + (err?.message || 'Vui lòng thử lại!'));
    } finally {
      setIsSending(false);
    }
  };

  const handleAdminReply = (messageId: string) => {
    if (!isAdmin) return;
    const text = replyText.trim();
    if (!text) return;

    studentMessageService.replyMessage(messageId, text, true);
    setReplyText('');
    setReplyingMessageId(null);
    loadData();
    alert('Đã gửi phản hồi đến học sinh thành công!');
  };

  const handleAdminDelete = (messageId: string) => {
    if (!isAdmin) return;
    if (window.confirm('Thầy/Cô có chắc chắn muốn xóa tin nhắn này không?')) {
      studentMessageService.deleteMessage(messageId, true);
      loadData();
    }
  };

  const filteredAdminMessages = adminAllMessages.filter(m => {
    if (adminFilterStatus === 'unread') return m.status === 'unread';
    if (adminFilterStatus === 'replied') return m.status === 'replied';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* BANNER HỘP THƯ */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 border border-cyan-400/30 text-xs font-bold mb-2">
              <Mail className="w-3.5 h-3.5 text-cyan-300" />
              <span>Hộp Thư Riêng Tư Trực Tuyến</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black mb-1">
              NHẮN TIN CHO THẦY THÀNH — TRAO ĐỔI HỌC TẬP & HỎI BÀI
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm max-w-2xl">
              Học sinh có thể gửi câu hỏi bài tập khó, thắc mắc điểm số hoặc trao đổi riêng tư với Thầy Thành.
              Mọi tin nhắn đều được gửi trực tiếp và Thầy sẽ đọc để giải đáp cho em.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAdmin ? (
              <span className="px-3.5 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md">
                <ShieldCheck className="w-4 h-4 text-purple-900" />
                <span>Thầy Thành Đang Trực Hòm Thư ({adminAllMessages.length} tin)</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={onRequestAdminLogin}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>Thầy Thành Đăng Nhập Xem Thư</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ==================== CHẾ ĐỘ 1: DÀNH CHO ADMIN QUẢN TRỊ HÒM THƯ ==================== */}
      {isAdmin && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-purple-500/30 shadow-xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Inbox className="w-5 h-5 text-purple-600" />
                <span>Hòm Thư Của Thầy Thành (Toàn Quyền Xem & Trả Lời Học Sinh)</span>
              </h4>
              <p className="text-xs text-slate-500">
                Thầy Đinh Thành ({BRAND.phone}) đang xem toàn bộ {adminAllMessages.length} tin nhắn gửi về từ học sinh.
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setAdminFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  adminFilterStatus === 'all'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Tất cả ({adminAllMessages.length})
              </button>
              <button
                type="button"
                onClick={() => setAdminFilterStatus('unread')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  adminFilterStatus === 'unread'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Chưa đọc ({adminAllMessages.filter(m => m.status === 'unread').length})
              </button>
              <button
                type="button"
                onClick={() => setAdminFilterStatus('replied')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  adminFilterStatus === 'replied'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Đã trả lời ({adminAllMessages.filter(m => m.status === 'replied').length})
              </button>
            </div>
          </div>

          {filteredAdminMessages.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Hiện không có tin nhắn nào trong mục này.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAdminMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-2xl border transition space-y-2.5 ${
                    msg.status === 'unread'
                      ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800/60'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                        msg.status === 'unread'
                          ? 'bg-rose-500 text-white'
                          : msg.status === 'replied'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {msg.status === 'unread' ? 'Mới' : msg.status === 'replied' ? 'Đã trả lời' : 'Đã đọc'}
                      </span>
                      <h5 className="text-xs font-black text-slate-900 dark:text-white">
                        [{msg.subject}] — {msg.senderName} ({msg.senderClass})
                      </h5>
                      {msg.senderPhone && (
                        <a
                          href={`tel:${msg.senderPhone}`}
                          className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-mono"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{msg.senderPhone}</span>
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(msg.createdAt).toLocaleString('vi-VN')}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAdminDelete(msg.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Xóa tin nhắn này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    {msg.content}
                  </p>

                  {/* Câu trả lời của Admin nếu có */}
                  {msg.adminReply && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
                      <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-bold">
                        <span>💬 Phản hồi của Thầy Đinh Thành:</span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                          {msg.repliedAt ? new Date(msg.repliedAt).toLocaleString('vi-VN') : ''}
                        </span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{msg.adminReply}</p>
                    </div>
                  )}

                  {/* Ô nhập phản hồi */}
                  {replyingMessageId === msg.id ? (
                    <div className="pt-2 space-y-2">
                      <textarea
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Nhập nội dung trả lời học sinh..."
                        className="w-full px-3 py-2 rounded-xl border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-purple-500 outline-hidden"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingMessageId(null);
                            setReplyText('');
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdminReply(msg.id)}
                          className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-sm"
                        >
                          Gửi Phản Hồi
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-1 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setReplyingMessageId(msg.id);
                          setReplyText(msg.adminReply || '');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Reply className="w-3.5 h-3.5" />
                        <span>{msg.adminReply ? 'Sửa Phản Hồi' : 'Trả Lời Học Sinh'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== CHẾ ĐỘ 2: HỌC SINH GỬI TIN NHẮN ĐẾN ADMIN ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CỘT TRÁI: FORM GỬI TIN NHẮN (2 CỘT) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-md">
              ✍️
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900 dark:text-white">
                Gửi Tin Nhắn / Thắc Mắc Đến Thầy Thành
              </h4>
              <p className="text-xs text-slate-500">
                Thầy Đinh Thành sẽ đọc và trực tiếp giải đáp cho em qua hệ thống hoặc Zalo {BRAND.phone}.
              </p>
            </div>
          </div>

          {currentStudent ? (
            <form onSubmit={handleStudentSendMessage} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    👤 Người gửi:
                  </label>
                  <div className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold flex items-center justify-between">
                    <span>{currentStudent.name}</span>
                    <span className="text-blue-600 font-mono">Lớp {currentStudent.className}</span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    📱 Số điện thoại Zalo để Thầy liên hệ (tùy chọn):
                  </label>
                  <input
                    type="tel"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder="VD: 0988123456..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  📌 Chủ đề tin nhắn:
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                >
                  <option value="Hỏi bài tập">❓ Hỏi bài tập & Ngữ pháp Tiếng Anh</option>
                  <option value="Báo lỗi đề thi / bài tập">⚠️ Báo lỗi câu hỏi đề thi / bài tập</option>
                  <option value="Thắc mắc tài khoản / điểm số">🔑 Thắc mắc tài khoản / Điểm số thi đua</option>
                  <option value="Xin thêm tài liệu ôn thi">📚 Xin thêm tài liệu & Đề cương ôn thi</option>
                  <option value="Góp ý xây dựng trang web">💡 Góp ý xây dựng và hoàn thiện website</option>
                  <option value="Khác">💬 Nội dung khác</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  📝 Nội dung tin nhắn (*):
                </label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Em hãy viết chi tiết câu hỏi hoặc thắc mắc cần Thầy hỗ trợ..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-hidden resize-none"
                />
              </div>

              {sendError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-rose-700 dark:text-rose-300 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{sendError}</span>
                </div>
              )}

              {sendSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>🎉 Đã gửi tin nhắn đến Thầy Đinh Thành thành công! Thầy sẽ phản hồi sớm nhất cho em.</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tin nhắn được gửi bảo mật tuyệt đối.</span>
                </span>

                <button
                  type="submit"
                  disabled={isSending}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSending ? 'Đang gửi...' : 'Gửi Đến Thầy Thành 🚀'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center mx-auto mb-3 font-bold text-xl">
                🔒
              </div>
              <h4 className="text-base font-black text-slate-900 dark:text-white mb-1">
                Vui Lòng Đăng Nhập Để Gửi Tin Nhắn
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                Em cần đăng nhập vào tài khoản học sinh của mình để Thầy Thành biết ai đang gửi và phản hồi chính xác đến em nhé!
              </p>
              <button
                type="button"
                onClick={onRequestAuth}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md transition inline-flex items-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Đăng Ký / Đăng Nhập Ngay</span>
              </button>
            </div>
          )}
        </div>

        {/* CỘT PHẢI: LỊCH SỬ TIN NHẮN CỦA CHÍNH HỌC SINH (CHỈ CHÍNH HỌC SINH ĐÓ THẤY) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Tin Nhắn Em Đã Gửi Cho Thầy Thành ({studentMessages.length})</span>
            </h4>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold">
              Bảo mật riêng tư
            </span>
          </div>

          {studentMessages.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Em chưa gửi tin nhắn nào cho Thầy Thành. Khi gặp bài tập khó, cần giải thích bài học hoặc thắc mắc điểm số, em cứ tự nhiên nhắn cho Thầy ở khung bên cạnh nhé!
            </div>
          ) : (
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {studentMessages.map((m) => (
                <div 
                  key={m.id}
                  className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-900 dark:text-white truncate">
                      {m.subject}
                    </span>
                    <span className={`text-[10px] px-2 py-0.2 rounded font-bold shrink-0 ${
                      m.status === 'replied' 
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' 
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                    }`}>
                      {m.status === 'replied' ? 'Đã phản hồi' : 'Đang chờ Thầy xem'}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{m.content}</p>

                  {/* Phản hồi từ Thầy Đinh Thành */}
                  {m.adminReply && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-slate-800 dark:text-slate-200 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
                        <span>🎓 Thầy Đinh Thành trả lời:</span>
                      </div>
                      <p className="whitespace-pre-wrap">{m.adminReply}</p>
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(m.createdAt).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
