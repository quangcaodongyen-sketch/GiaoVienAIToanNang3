// =========================================================================
// DỊCH VỤ HỘP THƯ TIN NHẮN HỌC SINH GỬI ADMIN (THẦY ĐINH THÀNH)
// BẢO MẬT TUYỆT ĐỐI: CHỈ ADMIN ĐÃ ĐĂNG NHẬP MỚI XEM ĐƯỢC TOÀN BỘ TIN NHẮN
// HỌC SINH CHỈ XEM ĐƯỢC TIN NHẮN DO CHÍNH MÌNH GỬI
// TÁC GIẢ BẢN QUYỀN: THẦY GIÁO ĐINH VĂN THÀNH - ĐIỆN THOẠI / ZALO: 0915.213717
// =========================================================================

import { systemMaintenanceService } from './systemMaintenanceService';

export interface StudentPrivateMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderClass: string;
  senderPhone?: string;
  senderStudentCode?: string;
  subject: string;
  content: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied';
  adminReply?: string;
  repliedAt?: string;
}

const STORAGE_KEY_MESSAGES = 'gvai_admin_private_messages_v1';
const MSG_BROADCAST_CHANNEL = 'gvai_messages_channel';

class StudentMessageService {
  private messages: StudentPrivateMessage[] = [];
  private channel: BroadcastChannel | null = null;

  constructor() {
    this.initData();
    this.initBroadcast();
  }

  private initData() {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (raw) {
        this.messages = JSON.parse(raw);
      } else {
        this.messages = [];
      }
    } catch {
      this.messages = [];
    }
  }

  private initBroadcast() {
    if (typeof window === 'undefined' || !window.BroadcastChannel) return;
    try {
      this.channel = new BroadcastChannel(MSG_BROADCAST_CHANNEL);
      this.channel.onmessage = (event) => {
        if (event.data && event.data.type === 'MESSAGES_UPDATED') {
          this.initData();
          window.dispatchEvent(new CustomEvent('gvai_messages_data_changed'));
        }
      };
    } catch {}
  }

  private saveMessages() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(this.messages));
      if (this.channel) {
        this.channel.postMessage({ type: 'MESSAGES_UPDATED', timestamp: Date.now() });
      }
      window.dispatchEvent(new CustomEvent('gvai_messages_data_changed'));
    } catch (e) {
      console.warn('Lỗi lưu tin nhắn Admin:', e);
    }
  }

  // Học sinh gửi tin nhắn riêng cho Admin
  public sendMessage(data: {
    senderId: string;
    senderName: string;
    senderClass: string;
    senderPhone?: string;
    senderStudentCode?: string;
    subject: string;
    content: string;
  }): StudentPrivateMessage {
    const newMsg: StudentPrivateMessage = {
      id: 'msg-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      senderId: data.senderId,
      senderName: data.senderName,
      senderClass: data.senderClass,
      senderPhone: data.senderPhone,
      senderStudentCode: data.senderStudentCode,
      subject: data.subject.trim(),
      content: data.content.trim(),
      createdAt: new Date().toISOString(),
      status: 'unread'
    };

    this.messages.unshift(newMsg);
    this.saveMessages();
    return newMsg;
  }

  // Lấy danh sách tin nhắn của chính học sinh đang đăng nhập (Bảo vệ tính riêng tư)
  public getMessagesForStudent(studentId: string): StudentPrivateMessage[] {
    if (!studentId) return [];
    return this.messages.filter(m => m.senderId === studentId);
  }

  // Lấy toàn bộ tin nhắn: CHỈ ADMIN ĐÃ ĐĂNG NHẬP MỚI ĐƯỢC XEM
  public getAllMessagesForAdmin(isAdminAuthorized: boolean): StudentPrivateMessage[] {
    const isRealAdmin = isAdminAuthorized === true && systemMaintenanceService.isSessionAuthenticated();
    if (!isRealAdmin) {
      console.warn('Từ chối truy cập: Chỉ Admin đã đăng nhập mới có quyền xem danh sách tin nhắn học sinh!');
      return [];
    }

    return [...this.messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Admin phản hồi tin nhắn của học sinh
  public replyMessage(messageId: string, replyText: string, isAdminAuthorized: boolean): boolean {
    const isRealAdmin = isAdminAuthorized === true && systemMaintenanceService.isSessionAuthenticated();
    if (!isRealAdmin) return false;

    const msg = this.messages.find(m => m.id === messageId);
    if (!msg) return false;

    msg.adminReply = replyText.trim();
    msg.repliedAt = new Date().toISOString();
    msg.status = 'replied';

    this.saveMessages();
    return true;
  }

  // Đánh dấu đã đọc
  public markAsRead(messageId: string, isAdminAuthorized: boolean): boolean {
    const isRealAdmin = isAdminAuthorized === true && systemMaintenanceService.isSessionAuthenticated();
    if (!isRealAdmin) return false;

    const msg = this.messages.find(m => m.id === messageId);
    if (!msg) return false;

    if (msg.status === 'unread') {
      msg.status = 'read';
      this.saveMessages();
    }
    return true;
  }

  // Admin xóa tin nhắn rác
  public deleteMessage(messageId: string, isAdminAuthorized: boolean): boolean {
    const isRealAdmin = isAdminAuthorized === true && systemMaintenanceService.isSessionAuthenticated();
    if (!isRealAdmin) return false;

    this.messages = this.messages.filter(m => m.id !== messageId);
    this.saveMessages();
    return true;
  }

  // Đếm số tin nhắn chưa đọc (Dành cho Admin Badge)
  public getUnreadCount(isAdminAuthorized: boolean): number {
    const isRealAdmin = isAdminAuthorized === true && systemMaintenanceService.isSessionAuthenticated();
    if (!isRealAdmin) return 0;
    return this.messages.filter(m => m.status === 'unread').length;
  }
}

export const studentMessageService = new StudentMessageService();
