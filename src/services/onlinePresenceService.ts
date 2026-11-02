// ==============================================================================
// DỊCH VỤ QUẢN LÝ HỌC SINH ĐANG ONLINE THỜI GIAN THỰC (REAL-TIME PRESENCE)
// Tác giả: Thầy giáo Đinh Văn Thành - ĐT: 0915.213717
// ĐỘC LẬP HOÀN TOÀN - KHÁCH QUAN - PHÙ HỢP TÂM LÝ SƯ PHẠM
// NGUYÊN TẮC:
// 1. Phân bổ khách quan các lớp, chủ yếu Khối 6 và Khối 8 (chiếm ~75%-80%).
// 2. CHỦ YẾU Ở NHỮNG EM ĐÃ CÓ ĐIỂM THI ĐUA / HỌC TẬP THỰC TẾ.
// 3. NHỮNG EM CHƯA TỪNG ĐĂNG NHẬP BAO GIỜ THÌ TUYỆT ĐỐI KHÔNG ĐĂNG LÀ ĐANG ONLINE.
// 4. THƯỜNG XUYÊN THAY ĐỔI / XOAY TUA HỌC SINH MỖI 20S ĐỂ KHÍCH LỆ TINH THẦN THI ĐUA.
// ==============================================================================

import type { StudentProfile } from './studentGradebookService';
import { 
  studentGradebookService, 
  VERIFIED_HIGH_SCORE_BASELINE, 
  normalizeVietnameseName 
} from './studentGradebookService';

export interface OnlineStudentItem {
  id: string;
  name: string;
  className: string;
  grade: number;
  points?: number; // Điểm thi đua đã tích lũy của học sinh
  action: string;
  detail?: string;
  lastActiveTime: number; // timestamp ms
  isCurrentDevice?: boolean;
  avatarColor: string;
}

const STORAGE_ONLINE_KEY = 'gvai_online_presence_v1';
const HEARTBEAT_INTERVAL = 30000; // 30s
const TIMEOUT_OFFLINE = 4 * 60 * 1000; // 4 phút
const ROTATION_WINDOW_MS = 20000; // 20s cho mỗi nhịp xoay tua học sinh mới

const AVATAR_COLORS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-purple-500 to-indigo-600',
  'from-cyan-500 to-blue-600',
  'from-teal-500 to-emerald-600',
  'from-indigo-500 to-purple-600'
];

// Danh mục hoạt động học tập thực tế theo từng khối lớp
const GRADE_ACTIVITIES: Record<number, string[]> = {
  6: [
    'Đang luyện Từ Vựng Unit 1: My New School',
    'Đang luyện Từ Vựng Unit 2: My House',
    'Đang luyện Từ Vựng Unit 3: My Friends',
    'Đang giải Đề Cương Ôn Tập GK1 Khối 6',
    'Đang làm Đề Kiểm Tra Thử GK1 Khối 6',
    'Đang luyện phản xạ từ vựng Flashcard',
    'Đang làm bài trắc nghiệm 5 phút',
    'Vừa hoàn thành bài từ vựng (+10đ)',
    'Vừa làm bài kiểm tra đạt 10 điểm (+20đ)',
    'Vừa đăng nhập vào học bài'
  ],
  8: [
    'Đang luyện Từ Vựng Unit 1: Leisure Time',
    'Đang luyện Từ Vựng Unit 2: Life in the Countryside',
    'Đang luyện Từ Vựng Unit 3: Teenagers',
    'Đang giải Đề Cương Ôn Tập GK1 Khối 8',
    'Đang làm Đề Kiểm Tra Thử GK1 Khối 8',
    'Đang ôn phát âm đuôi -s và -ed',
    'Đang luyện phản xạ từ vựng Flashcard',
    'Vừa làm bài kiểm tra đạt 10 điểm (+20đ)',
    'Vừa hoàn thành bài từ vựng (+10đ)',
    'Vừa đăng nhập vào học bài'
  ],
  7: [
    'Đang luyện Từ Vựng Unit 1: Hobbies',
    'Đang luyện Từ Vựng Unit 2: Healthy Living',
    'Đang giải Đề Cương Ôn Tập GK1 Khối 7',
    'Đang làm Đề Kiểm Tra Thử GK1 Khối 7',
    'Vừa hoàn thành bài trắc nghiệm (+10đ)',
    'Vừa đăng nhập vào học bài'
  ],
  9: [
    'Đang luyện Từ Vựng Unit 1: Local Community',
    'Đang luyện Từ Vựng Unit 2: City Life',
    'Đang giải Đề Cương Ôn Tập GK1 Khối 9',
    'Đang làm Đề Kiểm Tra Thử GK1 Khối 9',
    'Đang ôn thi vào lớp 10 môn Tiếng Anh',
    'Vừa làm bài kiểm tra đạt điểm giỏi (+20đ)',
    'Vừa đăng nhập vào học bài'
  ]
};

// ==============================================================================
// DANH SÁCH NỀN TẢNG CÁC HỌC SINH ĐÃ CÓ ĐIỂM VÀ LỊCH SỬ HỌC TẬP THỰC TẾ
// (Tuyệt đối không bao gồm học sinh chưa từng đăng nhập hay chưa có điểm)
// ==============================================================================
interface ActiveCandidate {
  name: string;
  className: string;
  grade: number;
  points: number;
}

// Bổ sung học sinh tiêu biểu Khối 7 và 9 đã có điểm kiểm tra ĐGtx chính thức và điểm khởi động
const BASELINE_ACTIVE_STUDENTS_G7_G9: ActiveCandidate[] = [
  // Khối 7 (7A1 -> 7A5)
  { name: 'Hoàng Trường An', className: '7A1', grade: 7, points: 185 },
  { name: 'Hoàng Minh Nhật', className: '7A1', grade: 7, points: 180 },
  { name: 'Phạm Ngọc Diệp', className: '7A1', grade: 7, points: 175 },
  { name: 'Nguyễn Minh Tú', className: '7A1', grade: 7, points: 170 },
  { name: 'Đỗ Thị Bích Nhuận', className: '7A2', grade: 7, points: 185 },
  { name: 'Nguyễn Thảo Nhi', className: '7A2', grade: 7, points: 175 },
  { name: 'Hoàng Trọng Tấn', className: '7A2', grade: 7, points: 170 },
  { name: 'Hoàng Minh Thư', className: '7A2', grade: 7, points: 170 },
  { name: 'Mai Lộc Thọ', className: '7A3', grade: 7, points: 185 },
  { name: 'Hoàng Ngọc Anh', className: '7A3', grade: 7, points: 175 },
  { name: 'Phạm Khải Hoàn', className: '7A3', grade: 7, points: 170 },
  { name: 'Mai Diệu Linh', className: '7A3', grade: 7, points: 170 },
  { name: 'Nguyễn Quang Khải', className: '7A4', grade: 7, points: 185 },
  { name: 'Bùi Yến Nhi', className: '7A4', grade: 7, points: 175 },
  { name: 'Hoàng Hương Giang', className: '7A4', grade: 7, points: 165 },
  { name: 'Hoàng Quỳnh Như', className: '7A4', grade: 7, points: 160 },
  { name: 'Lê Thanh Thảo', className: '7A5', grade: 7, points: 185 },
  { name: 'Lê Gia Khang', className: '7A5', grade: 7, points: 175 },
  { name: 'Hoàng Thùy Linh', className: '7A5', grade: 7, points: 170 },
  { name: 'Hoàng Thị Như Loan', className: '7A5', grade: 7, points: 170 },

  // Khối 9 (9A1 -> 9A4)
  { name: 'Phạm Chí Hữu', className: '9A1', grade: 9, points: 295 },
  { name: 'Nguyễn Thị Quỳnh Thao', className: '9A1', grade: 9, points: 290 },
  { name: 'Đỗ Anh Thư', className: '9A1', grade: 9, points: 285 },
  { name: 'Nguyễn Kim Thư', className: '9A1', grade: 9, points: 285 },
  { name: 'Vũ Phương Anh', className: '9A2', grade: 9, points: 295 },
  { name: 'Vũ Nhật Linh', className: '9A2', grade: 9, points: 290 },
  { name: 'Lý Thị Bích Ngọc', className: '9A2', grade: 9, points: 285 },
  { name: 'Mạc Huyền Thương', className: '9A2', grade: 9, points: 285 },
  { name: 'Đinh Nhật Phương', className: '9A3', grade: 9, points: 310 },
  { name: 'Bùi Ngọc Hân', className: '9A3', grade: 9, points: 290 },
  { name: 'Nguyễn Trí Kiên', className: '9A3', grade: 9, points: 285 },
  { name: 'Hà Bảo Lâm', className: '9A3', grade: 9, points: 285 },
  { name: 'Nguyễn Trần Bảo Linh', className: '9A4', grade: 9, points: 310 },
  { name: 'Lê Hải Đăng', className: '9A4', grade: 9, points: 290 },
  { name: 'Hoàng Thúy Nga', className: '9A4', grade: 9, points: 285 },
  { name: 'Hoàng Ngọc Hà', className: '9A4', grade: 9, points: 280 }
];

class OnlinePresenceService {
  private currentStudent: StudentProfile | null = null;
  private currentAction: string = 'Đang xem bài học';
  private heartbeatTimer: any = null;
  private listeners: Set<() => void> = new Set();
  private isInitialized: boolean = false;

  constructor() {}

  private ensureInit() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    try {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_ONLINE_KEY) {
          this.notifyListeners();
        }
      });

      ['click', 'keydown', 'touchstart'].forEach(evt => {
        window.addEventListener(evt, () => {
          this.touchActivity();
        }, { passive: true });
      });

      if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = setInterval(() => {
        this.sendHeartbeat();
      }, HEARTBEAT_INTERVAL);
    } catch {}
  }

  public subscribe(cb: () => void): () => void {
    this.ensureInit();
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notifyListeners() {
    this.listeners.forEach(cb => {
      try { cb(); } catch {}
    });
  }

  public setCurrentStudent(student: StudentProfile | null) {
    this.ensureInit();
    this.currentStudent = student;
    if (student) {
      this.sendHeartbeat();
    }
  }

  public updateAction(action: string, detail?: string) {
    this.ensureInit();
    this.currentAction = detail ? `${action}: ${detail}` : action;
    this.sendHeartbeat();
  }

  private touchActivity() {
    if (this.currentStudent) {
      this.sendHeartbeat();
    }
  }

  // Ghi nhận phiên đang online của máy tính/điện thoại này
  public sendHeartbeat() {
    if (typeof window === 'undefined') return;

    try {
      const storedRaw = localStorage.getItem(STORAGE_ONLINE_KEY);
      let list: OnlineStudentItem[] = storedRaw ? JSON.parse(storedRaw) : [];
      const now = Date.now();

      // Dọn dẹp các phiên quá cũ (> 4 phút)
      list = list.filter(item => item && item.lastActiveTime && (now - item.lastActiveTime < TIMEOUT_OFFLINE));

      if (this.currentStudent && this.currentStudent.name) {
        const studentName = this.currentStudent.name.trim();
        const className = (this.currentStudent.className || '8A1').toUpperCase();
        const grade = this.currentStudent.grade || (parseInt(className.replace(/\D/g, ''), 10) || 8);
        const points = this.currentStudent.totalMeritPoints || 15;

        const existingIdx = list.findIndex(item => 
          item.name.toLowerCase() === studentName.toLowerCase() && 
          item.className.toLowerCase() === className.toLowerCase()
        );

        const hash = (studentName + className).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
        const avatarColor = AVATAR_COLORS[hash % AVATAR_COLORS.length];

        const myEntry: OnlineStudentItem = {
          id: 'me-' + (this.currentStudent.id || studentName),
          name: studentName,
          className: className,
          grade,
          points,
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

  /**
   * LẤY TOÀN BỘ DANH SÁCH HỌC SINH ĐỦ ĐIỀU KIỆN ONLINE (ĐÃ TỪNG ĐĂNG NHẬP & CÓ ĐIỂM)
   * TUYỆT ĐỐI LOẠI BỎ các em chưa từng đăng nhập bao giờ!
   */
  private getEligibleActiveStudents(): ActiveCandidate[] {
    const candidateMap = new Map<string, ActiveCandidate>();

    // 1. Nạp toàn bộ 62 học sinh Khối 6 & 8 có điểm thi đua xác thực từ VERIFIED_HIGH_SCORE_BASELINE
    Object.entries(VERIFIED_HIGH_SCORE_BASELINE).forEach(([key, info]) => {
      const parts = key.split('__');
      if (parts.length === 2) {
        const normN = parts[0];
        const cls = parts[1].toUpperCase();
        const grade = parseInt(cls.replace(/\D/g, ''), 10) || 6;
        
        // Trích xuất tên hiển thị đẹp từ info.notes nếu có
        let displayName = normN;
        if (info.notes) {
          const match = info.notes.match(/^([^(]+)/);
          if (match) displayName = match[1].trim();
        } else {
          displayName = normN.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }

        const mapKey = `${normN}__${cls.toLowerCase()}`;
        candidateMap.set(mapKey, {
          name: displayName,
          className: cls,
          grade,
          points: info.total
        });
      }
    });

    // 2. Nạp các học sinh Khối 7 & 9 tiêu biểu có điểm
    BASELINE_ACTIVE_STUDENTS_G7_G9.forEach(item => {
      const mapKey = `${normalizeVietnameseName(item.name)}__${item.className.toLowerCase()}`;
      if (!candidateMap.has(mapKey)) {
        candidateMap.set(mapKey, item);
      }
    });

    // 3. Quét động các học sinh thực tế từ studentGradebookService đã từng đăng nhập
    try {
      const serviceStudents = studentGradebookService.getStudents();
      if (Array.isArray(serviceStudents)) {
        serviceStudents.forEach(stu => {
          if (!stu || !stu.name || !stu.className) return;

          // QUY TẮC CỐT LÕI CỦA THẦY ĐINH THÀNH:
          // Chỉ coi là hợp lệ nếu:
          // - Đã có ngày đăng nhập (lastLoginDate hoặc lastLoginRewardDate)
          // - Hoặc đã có điểm chuyên cần / từ vựng / bài thi / tổng điểm > 15
          const hasLoggedIn = Boolean(stu.lastLoginDate || stu.lastLoginRewardDate);
          const hasEarnedPoints = (stu.totalMeritPoints && stu.totalMeritPoints > 15) ||
                                  (stu.attendancePoints && stu.attendancePoints > 0) ||
                                  (stu.vocabPoints && stu.vocabPoints > 0) ||
                                  (stu.practicePoints && stu.practicePoints > 0) ||
                                  (stu.examBonusPoints && stu.examBonusPoints > 0);

          if (hasLoggedIn || hasEarnedPoints) {
            const cls = stu.className.toUpperCase();
            const grade = stu.grade || (parseInt(cls.replace(/\D/g, ''), 10) || 8);
            const mapKey = `${normalizeVietnameseName(stu.name)}__${cls.toLowerCase()}`;
            
            const existing = candidateMap.get(mapKey);
            const pts = Math.max(stu.totalMeritPoints || 0, existing?.points || 0, 15);

            candidateMap.set(mapKey, {
              name: stu.name.trim(),
              className: cls,
              grade,
              points: pts
            });
          }
        });
      }
    } catch {}

    return Array.from(candidateMap.values());
  }

  /**
   * SINH DANH SÁCH BẠN HỌC ĐANG ONLINE KHÁCH QUAN, SÔI NỔI
   * - Có ở các lớp (19 lớp).
   * - CHỦ YẾU KHỐI 6 VÀ KHỐI 8 (chiếm ~75% - 80%).
   * - CHỦ YẾU Ở NHỮNG EM ĐÃ CÓ ĐIỂM.
   * - TUYỆT ĐỐI KHÔNG ĐĂNG NHỮNG EM CHƯA TỪNG ĐĂNG NHẬP.
   * - THƯỜNG XUYÊN THAY ĐỔI / XOAY TUA ĐỂ KHÍCH LỆ HỌC SINH.
   */
  private generateClassmatePresence(existingList: OnlineStudentItem[], now: number): OnlineStudentItem[] {
    const eligibleStudents = this.getEligibleActiveStudents();
    if (eligibleStudents.length === 0) return [];

    // Nhịp xoay tua thời gian thực (Cứ mỗi 20 giây chuyển 1 nhịp để thay đổi danh sách tạo động lực)
    const cycleIndex = Math.floor(now / ROTATION_WINDOW_MS);

    // Phân nhóm học sinh theo khối
    const poolG6 = eligibleStudents.filter(s => s.grade === 6);
    const poolG8 = eligibleStudents.filter(s => s.grade === 8);
    const poolG7 = eligibleStudents.filter(s => s.grade === 7);
    const poolG9 = eligibleStudents.filter(s => s.grade === 9);

    const myClass = (this.currentStudent?.className || '8A1').toUpperCase().replace(/\s+/g, '');
    const myNameNorm = this.currentStudent ? normalizeVietnameseName(this.currentStudent.name) : '';

    const selectedList: OnlineStudentItem[] = [];
    const addedKeys = new Set<string>();

    if (myNameNorm) {
      addedKeys.add(`${myNameNorm}__${myClass.toLowerCase()}`);
    }

    // 1. ĐẢM BẢO LỚP CỦA HỌC SINH ĐANG HỌC CÓ 4-6 BẠN CÙNG LỚP ONLINE ĐỂ KHÍCH LỆ
    const myClassPool = eligibleStudents.filter(s => 
      s.className.toUpperCase().replace(/\s+/g, '') === myClass &&
      normalizeVietnameseName(s.name) !== myNameNorm
    );

    const myClassTargetCount = Math.min(Math.max(myClassPool.length, 3), 5);
    for (let i = 0; i < myClassTargetCount && i < myClassPool.length; i++) {
      const idx = (cycleIndex * 2 + i * 3) % myClassPool.length;
      const s = myClassPool[idx];
      const key = `${normalizeVietnameseName(s.name)}__${s.className.toLowerCase()}`;
      if (!addedKeys.has(key)) {
        addedKeys.add(key);
        selectedList.push(this.createOnlineItem(s, i, now, cycleIndex));
      }
    }

    // 2. KHỐI 6: CHỌN 10 BẠN CÓ ĐIỂM TIÊU BIỂU (XOAY TUA THEO NHỊP)
    const targetG6 = 10;
    if (poolG6.length > 0) {
      for (let i = 0; i < targetG6 && i < poolG6.length; i++) {
        const idx = (cycleIndex * 3 + i * 5) % poolG6.length;
        const s = poolG6[idx];
        const key = `${normalizeVietnameseName(s.name)}__${s.className.toLowerCase()}`;
        if (!addedKeys.has(key)) {
          addedKeys.add(key);
          selectedList.push(this.createOnlineItem(s, selectedList.length, now, cycleIndex));
        }
      }
    }

    // 3. KHỐI 8: CHỌN 10 BẠN CÓ ĐIỂM TIÊU BIỂU (XOAY TUA THEO NHỊP)
    const targetG8 = 10;
    if (poolG8.length > 0) {
      for (let i = 0; i < targetG8 && i < poolG8.length; i++) {
        const idx = (cycleIndex * 3 + i * 7) % poolG8.length;
        const s = poolG8[idx];
        const key = `${normalizeVietnameseName(s.name)}__${s.className.toLowerCase()}`;
        if (!addedKeys.has(key)) {
          addedKeys.add(key);
          selectedList.push(this.createOnlineItem(s, selectedList.length, now, cycleIndex));
        }
      }
    }

    // 4. KHỐI 7: CHỌN 3 BẠN TIÊU BIỂU (ĐẢM BẢO CÓ ĐỦ CÁC KHỐI TOÀN TRƯỜNG)
    const targetG7 = 3;
    if (poolG7.length > 0) {
      for (let i = 0; i < targetG7 && i < poolG7.length; i++) {
        const idx = (cycleIndex + i * 3) % poolG7.length;
        const s = poolG7[idx];
        const key = `${normalizeVietnameseName(s.name)}__${s.className.toLowerCase()}`;
        if (!addedKeys.has(key)) {
          addedKeys.add(key);
          selectedList.push(this.createOnlineItem(s, selectedList.length, now, cycleIndex));
        }
      }
    }

    // 5. KHỐI 9: CHỌN 3 BẠN TIÊU BIỂU
    const targetG9 = 3;
    if (poolG9.length > 0) {
      for (let i = 0; i < targetG9 && i < poolG9.length; i++) {
        const idx = (cycleIndex + i * 4) % poolG9.length;
        const s = poolG9[idx];
        const key = `${normalizeVietnameseName(s.name)}__${s.className.toLowerCase()}`;
        if (!addedKeys.has(key)) {
          addedKeys.add(key);
          selectedList.push(this.createOnlineItem(s, selectedList.length, now, cycleIndex));
        }
      }
    }

    return selectedList;
  }

  // Tạo đối tượng OnlineStudentItem chân thực, sinh động
  private createOnlineItem(cand: ActiveCandidate, order: number, now: number, cycleIndex: number): OnlineStudentItem {
    const activities = GRADE_ACTIVITIES[cand.grade] || GRADE_ACTIVITIES[8];
    const actIdx = (order * 3 + cycleIndex + cand.name.length) % activities.length;
    const action = activities[actIdx];

    // Thời gian hoạt động gần nhất: Các bạn mới vào thì 'Vừa xong', các bạn khác vài phút trước
    const isJustJoined = (order % 4 === (cycleIndex % 4));
    let lastActiveTime: number;
    if (isJustJoined) {
      lastActiveTime = now - ((cycleIndex % 3) * 10000 + 5000);
    } else {
      const minutesAgo = (order % 4 + 1) * 60 * 1000 + (cand.name.length * 1000);
      lastActiveTime = now - minutesAgo;
    }

    const hash = (cand.name + cand.className).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const avatarColor = AVATAR_COLORS[hash % AVATAR_COLORS.length];

    return {
      id: `active-${cand.className}-${cand.name.replace(/\s+/g, '')}-${order}`,
      name: cand.name,
      className: cand.className,
      grade: cand.grade,
      points: cand.points,
      action: isJustJoined ? 'Vừa đăng nhập vào học bài' : action,
      lastActiveTime,
      isCurrentDevice: false,
      avatarColor
    };
  }

  // Lấy danh sách các bạn đang online học bài
  public getOnlineStudents(classFilter?: string): OnlineStudentItem[] {
    if (typeof window === 'undefined') return [];

    try {
      const storedRaw = localStorage.getItem(STORAGE_ONLINE_KEY);
      let realList: OnlineStudentItem[] = storedRaw ? JSON.parse(storedRaw) : [];
      const now = Date.now();

      // Giữ các phiên online hợp lệ trong 4 phút
      realList = realList.filter(item => item && item.lastActiveTime && (now - item.lastActiveTime < TIMEOUT_OFFLINE));

      // Nếu đang có học sinh đăng nhập, đảm bảo học sinh hiện tại luôn đứng đầu tiên
      if (this.currentStudent) {
        const myName = this.currentStudent.name.trim().toLowerCase();
        const meItem = realList.find(i => i.name.trim().toLowerCase() === myName);
        if (meItem) {
          meItem.isCurrentDevice = true;
          if (this.currentStudent.totalMeritPoints) {
            meItem.points = this.currentStudent.totalMeritPoints;
          }
          realList = [meItem, ...realList.filter(i => i !== meItem)];
        }
      }

      // Tạo thêm các bạn học sinh đang cùng online từ danh sách có điểm xác thực
      const simulatedList = this.generateClassmatePresence(realList, now);

      let combined = [...realList];
      simulatedList.forEach(sim => {
        if (!combined.some(c => c.name.toLowerCase() === sim.name.toLowerCase())) {
          combined.push(sim);
        }
      });

      // Sắp xếp: Thiết bị hiện tại lên đầu, tiếp đến các bạn có điểm cao và hoạt động sôi nổi
      combined.sort((a, b) => {
        if (a.isCurrentDevice) return -1;
        if (b.isCurrentDevice) return 1;
        return (b.lastActiveTime || 0) - (a.lastActiveTime || 0);
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
}

export const onlinePresenceService = new OnlinePresenceService();
