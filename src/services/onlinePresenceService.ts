// ==============================================================================
// DỊCH VỤ QUẢN LÝ HỌC SINH ĐANG ONLINE THỜI GIAN THỰC (REAL-TIME PRESENCE)
// Tác giả: Thầy giáo Đinh Văn Thành - ĐT: 0915.213717
// Hệ thống nhận diện học sinh đang học, cập nhật hoạt động tức thì, tạo không khí học đường sôi nổi
// ==============================================================================

import { studentGradebookService, StudentProfile } from './studentGradebookService';

export interface OnlineStudentItem {
  id: string;
  name: string;
  className: string;
  grade: number;
  action: string;
  detail?: string;
  lastActiveTime: number; // timestamp ms
  isCurrentDevice?: boolean;
  avatarColor: string;
}

const STORAGE_ONLINE_KEY = 'gvai_online_presence_v1';
const HEARTBEAT_INTERVAL = 25000; // 25s gửi tín hiệu đang học
const TIMEOUT_OFFLINE = 4 * 60 * 1000; // 4 phút không hoạt động thì offline

const AVATAR_COLORS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-purple-500 to-indigo-600',
  'from-cyan-500 to-blue-600'
];

// Danh sách các hoạt động học tập thực tế phong phú
const REALISTIC_ACTIVITIES = [
  'Đang luyện Từ Vựng Unit 1',
  'Đang luyện Từ Vựng Unit 2',
  'Đang luyện Từ Vựng Unit 3',
  'Đang giải Đề Cương Ôn Tập GK1',
  'Đang làm Đề Kiểm Tra Thử GK1',
  'Đang làm bài trắc nghiệm 5 phút',
  'Đang ôn phát âm đuôi -s và -ed',
  'Đang luyện phản xạ từ vựng Flashcard',
  'Vừa hoàn thành bài học (+15đ)',
  'Vừa đăng nhập vào học bài'
];

class OnlinePresenceService {
  private currentStudent: StudentProfile | null = null;
  private currentAction: string = 'Đang xem bài học';
  private heartbeatTimer: any = null;
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_ONLINE_KEY) {
          this.notifyListeners();
        }
      });

      // Lắng nghe tương tác người dùng để refresh trạng thái online
      ['click', 'keydown', 'touchstart'].forEach(evt => {
        window.addEventListener(evt, () => {
          this.touchActivity();
        }, { passive: true });
      });

      this.startHeartbeat();
    }
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notifyListeners() {
    this.listeners.forEach(cb => {
      try { cb(); } catch {}
    });
  }

  public setCurrentStudent(student: StudentProfile | null) {
    this.currentStudent = student;
    if (student) {
      this.sendHeartbeat();
    }
  }

  public updateAction(action: string, detail?: string) {
    this.currentAction = detail ? `${action}: ${detail}` : action;
    this.sendHeartbeat();
  }

  private touchActivity() {
    if (this.currentStudent) {
      this.sendHeartbeat();
    }
  }

  private startHeartbeat() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat();
    }, HEARTBEAT_INTERVAL);
  }

  // Ghi nhận phiên đang online của máy tính/điện thoại này
  public sendHeartbeat() {
    if (typeof window === 'undefined') return;

    try {
      const storedRaw = localStorage.getItem(STORAGE_ONLINE_KEY);
      let list: OnlineStudentItem[] = storedRaw ? JSON.parse(storedRaw) : [];
      const now = Date.now();

      // Dọn dẹp các phiên quá cũ (> 4 phút)
      list = list.filter(item => now - item.lastActiveTime < TIMEOUT_OFFLINE);

      if (this.currentStudent && this.currentStudent.name) {
        const studentName = this.currentStudent.name.trim();
        const className = this.currentStudent.className || '8A1';
        const grade = this.currentStudent.grade || (parseInt(className.replace(/\D/g, ''), 10) || 8);

        const existingIdx = list.findIndex(item => 
          item.name.toLowerCase() === studentName.toLowerCase() && 
          item.className.toLowerCase() === className.toLowerCase()
        );

        const hash = (studentName + className).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
        const avatarColor = AVATAR_COLORS[hash % AVATAR_COLORS.length];

        const myEntry: OnlineStudentItem = {
          id: 'me-' + this.currentStudent.id,
          name: studentName,
          className: className.toUpperCase(),
          grade,
          action: this.currentAction,
          lastActiveTime: now,
          isCurrentDevice: true,
          avatarColor
        };

        if (existingIdx >= 0) {
          list[existingIdx] = myEntry;
        } else {
          list.unshift(myEntry);
        }
      }

      localStorage.setItem(STORAGE_ONLINE_KEY, JSON.stringify(list));
      this.notifyListeners();
    } catch {}
  }

  // Lấy danh sách các bạn đang online học bài
  public getOnlineStudents(classFilter?: string): OnlineStudentItem[] {
    if (typeof window === 'undefined') return [];

    try {
      const storedRaw = localStorage.getItem(STORAGE_ONLINE_KEY);
      let realList: OnlineStudentItem[] = storedRaw ? JSON.parse(storedRaw) : [];
      const now = Date.now();

      // Giữ các phiên online hợp lệ trong 4 phút
      realList = realList.filter(item => now - item.lastActiveTime < TIMEOUT_OFFLINE);

      // Nếu đang có học sinh đăng nhập, đảm bảo học sinh hiện tại luôn đứng đầu tiên
      if (this.currentStudent) {
        const myName = this.currentStudent.name.trim().toLowerCase();
        const meItem = realList.find(i => i.name.trim().toLowerCase() === myName);
        if (meItem) {
          meItem.isCurrentDevice = true;
          realList = [meItem, ...realList.filter(i => i !== meItem)];
        }
      }

      // Tạo thêm các bạn học sinh đang cùng online từ Sổ điểm chính thức của Thầy Thành
      // Để tạo không khí học tập sôi động chân thực giữa các bạn cùng lớp/toàn trường
      const simulatedList = this.generateClassmatePresence(realList, now);

      let combined = [...realList];
      simulatedList.forEach(sim => {
        if (!combined.some(c => c.name.toLowerCase() === sim.name.toLowerCase())) {
          combined.push(sim);
        }
      });

      // Lọc theo lớp nếu có yêu cầu
      if (classFilter && classFilter !== 'all' && classFilter !== 'ALL') {
        const normFilter = classFilter.toUpperCase().replace(/\s+/g, '');
        combined = combined.filter(c => c.className.toUpperCase().replace(/\s+/g, '') === normFilter);
      }

      return combined;
    } catch {
      return [];
    }
  }

  // Sinh danh sách bạn học đang online dựa trên sổ điểm thực tế của Thầy Thành
  private generateClassmatePresence(existingList: OnlineStudentItem[], now: number): OnlineStudentItem[] {
    const defaultClasses = ['8A1', '8A2', '6A1', '6A4', '8A3', '6A3', '8A5'];
    const classmates: OnlineStudentItem[] = [];

    // Chọn lớp ưu tiên: nếu học sinh đang đăng nhập lớp nào thì ưu tiên sinh các bạn lớp đó đang học
    const myClass = this.currentStudent?.className || '8A1';
    const activeClasses = [myClass, ...defaultClasses.filter(c => c !== myClass)];

    activeClasses.forEach((cls, clsIdx) => {
      const roster = studentGradebookService.getOfficialRoster(cls);
      if (!roster || roster.length === 0) return;

      // Mỗi lớp chọn từ 2 đến 4 bạn đang online (dựa trên thời gian trong ngày để luân phiên)
      const hour = new Date().getHours();
      const countPerClass = cls === myClass ? 4 : 2;

      for (let i = 0; i < countPerClass && i < roster.length; i++) {
        const studentIndex = (hour * 3 + i * 5 + clsIdx * 7) % roster.length;
        const studentName = roster[studentIndex];

        // Tránh trùng với học sinh đang đăng nhập trên máy này
        if (this.currentStudent && studentName.toLowerCase() === this.currentStudent.name.toLowerCase()) {
          continue;
        }

        const grade = parseInt(cls.replace(/\D/g, ''), 10) || 8;
        const actIndex = (studentIndex + hour + i) % REALISTIC_ACTIVITIES.length;
        const minutesAgo = (i * 2 + (studentIndex % 3)) * 60 * 1000;
        const hash = (studentName + cls).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
        const avatarColor = AVATAR_COLORS[hash % AVATAR_COLORS.length];

        classmates.push({
          id: `sim-${cls}-${studentIndex}`,
          name: studentName,
          className: cls,
          grade,
          action: REALISTIC_ACTIVITIES[actIndex],
          lastActiveTime: now - minutesAgo,
          isCurrentDevice: false,
          avatarColor
        });
      }
    });

    return classmates;
  }
}

export const onlinePresenceService = new OnlinePresenceService();
