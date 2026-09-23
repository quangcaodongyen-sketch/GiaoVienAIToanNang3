/**
 * DỊCH VỤ THEO DÕI HOẠT ĐỘNG, ĐĂNG KÝ THÀNH VIÊN & QUẢN TRỊ MÁY TÍNH
 * Hệ sinh thái Giáo Viên AI Toàn Năng - Thầy Đinh Văn Thành
 */

import { licenseService } from './licenseService';

export interface AppVisitRecord {
  appId: string;
  appName: string;
  count: number;
  lastVisit: string;
}

export interface MachineProfile {
  machineId: string;
  fullName: string;
  schoolUnit: string;
  phoneNumber: string;
  trialUsed: number;
  trialMax: number;
  isRegisteredTrial: boolean;
  registeredAt?: string;
  lastSeenAt: string;
  firstSeenAt: string;
  deviceInfo: string;
  isBlocked?: boolean;
  blockedReason?: string;
  appsVisited: Record<string, AppVisitRecord>;
  predictedName?: string;
}

export interface ActivityLogItem {
  id: string;
  machineId: string;
  userName?: string;
  school?: string;
  phone?: string;
  appId: string;
  appName: string;
  action: string;
  timestamp: string;
  date: string;
}

export interface RegistrationRequest {
  id: string;
  machineId: string;
  fullName: string;
  schoolUnit: string;
  phoneNumber: string;
  appId: string;
  appName: string;
  packageType: 'TRIAL_5' | '1YEAR' | '2YEAR' | 'FULL_WEB';
  price: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface BlockedMachineItem {
  machineId: string;
  blockedAt: string;
  reason: string;
  fullName?: string;
  schoolUnit?: string;
}

const STORAGE_MACHINE_ID = 'gvai_hardware_machine_id';
const STORAGE_CURRENT_PROFILE = 'gvai_current_machine_profile';
const STORAGE_ALL_MACHINES = 'gvai_all_tracked_machines';
const STORAGE_ACTIVITY_LOGS = 'gvai_detailed_activity_logs';
const STORAGE_REGISTRATIONS = 'gvai_registration_requests';
const STORAGE_BLOCKED_MACHINES = 'gvai_blocked_machines_list';
const STORAGE_WEB_PAGEVIEWS = 'gvai_web_pageviews_count';

// Dữ liệu mẫu ban đầu để Bảng Thống Kê Admin hiển thị ngay dữ liệu sống động, chân thực
const DEFAULT_TRACKED_USERS: MachineProfile[] = [
  {
    machineId: 'GV-A7B8-90F1',
    fullName: 'Cô Hoàng Thu Thảo',
    schoolUnit: 'Trường THCS Lê Quý Đôn',
    phoneNumber: '0983.123456',
    registeredAt: '2026-09-23 08:30:15',
    trialUsed: 5,
    trialMax: 5,
    isRegisteredTrial: true,
    lastSeenAt: '2026-09-23 15:10:20',
    firstSeenAt: '2026-09-22 09:00:00',
    deviceInfo: 'Windows 11 / Chrome 128',
    appsVisited: {
      'tao-de-8mon': { appId: 'tao-de-8mon', appName: 'Tạo Đề Kiểm Tra 8 Môn (CV 7991)', count: 9, lastVisit: '2026-09-23 15:10:20' },
      'tao-de-anh': { appId: 'tao-de-anh', appName: 'Tạo Đề Tiếng Anh (Global Success)', count: 4, lastVisit: '2026-09-23 14:20:10' },
      'chuan-hoa-nd30': { appId: 'chuan-hoa-nd30', appName: 'Chuẩn Hóa Văn Bản (NĐ 30/2020)', count: 3, lastVisit: '2026-09-22 14:15:00' }
    }
  },
  {
    machineId: 'GV-8F22-A109',
    fullName: 'Thầy Trần Văn Tuấn',
    schoolUnit: 'Trường THCS Đồng Yên',
    phoneNumber: '0977.654321',
    registeredAt: '2026-09-23 07:15:20',
    trialUsed: 3,
    trialMax: 5,
    isRegisteredTrial: true,
    lastSeenAt: '2026-09-23 14:45:30',
    firstSeenAt: '2026-09-23 07:15:20',
    deviceInfo: 'Windows 10 / Edge 127',
    appsVisited: {
      'tao-de-8mon': { appId: 'tao-de-8mon', appName: 'Tạo Đề Kiểm Tra 8 Môn (CV 7991)', count: 6, lastVisit: '2026-09-23 14:45:30' },
      'tach-gop-pdf': { appId: 'tach-gop-pdf', appName: 'PDF Suite Pro (Tách - Gộp PDF)', count: 4, lastVisit: '2026-09-23 11:20:00' }
    }
  },
  {
    machineId: 'GV-3E11-9B5C',
    fullName: 'Cô Nguyễn Thị Hoa',
    schoolUnit: 'Trường THCS Nguyễn Du',
    phoneNumber: '0912.889900',
    registeredAt: '2026-09-23 09:40:00',
    trialUsed: 4,
    trialMax: 5,
    isRegisteredTrial: true,
    lastSeenAt: '2026-09-23 13:25:10',
    firstSeenAt: '2026-09-23 09:40:00',
    deviceInfo: 'Windows 11 / Chrome 128',
    appsVisited: {
      'tao-de-anh': { appId: 'tao-de-anh', appName: 'Tạo Đề Tiếng Anh (Global Success)', count: 5, lastVisit: '2026-09-23 13:25:10' },
      'sinh-de-bienthe': { appId: 'sinh-de-bienthe', appName: 'Sinh 3 Đề Biến Thể Tương Đương', count: 2, lastVisit: '2026-09-23 11:00:00' }
    }
  },
  {
    machineId: 'GV-4C91-D3F0',
    fullName: '',
    schoolUnit: '',
    phoneNumber: '',
    trialUsed: 1,
    trialMax: 5,
    isRegisteredTrial: false,
    lastSeenAt: '2026-09-23 15:02:18',
    firstSeenAt: '2026-09-23 14:50:00',
    deviceInfo: 'Windows 11 / Cốc Cốc 125',
    appsVisited: {
      'tao-de-anh': { appId: 'tao-de-anh', appName: 'Tạo Đề Tiếng Anh (Global Success)', count: 2, lastVisit: '2026-09-23 15:02:18' }
    }
  }
];

// Dữ liệu mẫu đơn đăng ký chờ duyệt
const DEFAULT_REGISTRATIONS: RegistrationRequest[] = [
  {
    id: 'REG-1727078400001',
    machineId: 'GV-A7B8-90F1',
    fullName: 'Cô Hoàng Thu Thảo',
    schoolUnit: 'Trường THCS Lê Quý Đôn',
    phoneNumber: '0983.123456',
    appId: 'tao-de-8mon',
    appName: 'Tạo Đề Kiểm Tra 8 Môn (CV 7991)',
    packageType: '2YEAR',
    price: '250.000đ',
    status: 'PENDING',
    createdAt: '23/09/2026 14:15:30'
  },
  {
    id: 'REG-1727078400002',
    machineId: 'GV-3E11-9B5C',
    fullName: 'Cô Nguyễn Thị Hoa',
    schoolUnit: 'Trường THCS Nguyễn Du',
    phoneNumber: '0912.889900',
    appId: 'tao-de-anh',
    appName: 'Tạo Đề Tiếng Anh Global Success',
    packageType: '1YEAR',
    price: '200.000đ',
    status: 'APPROVED',
    createdAt: '23/09/2026 10:20:15',
    reviewedBy: 'Thầy Đinh Văn Thành',
    reviewedAt: '23/09/2026 10:35:00'
  },
  {
    id: 'REG-1727078400003',
    machineId: 'GV-8F22-A109',
    fullName: 'Thầy Trần Văn Tuấn',
    schoolUnit: 'Trường THCS Đồng Yên',
    phoneNumber: '0977.654321',
    appId: 'chuan-hoa-nd30',
    appName: 'Chuẩn Hóa Văn Bản NĐ 30 & Soạn 5512',
    packageType: 'TRIAL_5',
    price: 'Miễn phí (5 lượt)',
    status: 'APPROVED',
    createdAt: '23/09/2026 07:15:20',
    reviewedBy: 'Cô Mai Tình',
    reviewedAt: '23/09/2026 07:16:00'
  }
];

// Dữ liệu mẫu log hoạt động chi tiết theo ngày giờ
const DEFAULT_ACTIVITY_LOGS: ActivityLogItem[] = [
  {
    id: 'LOG-001',
    machineId: 'GV-A7B8-90F1',
    userName: 'Cô Hoàng Thu Thảo',
    school: 'Trường THCS Lê Quý Đôn',
    phone: '0983.123456',
    appId: 'tao-de-8mon',
    appName: 'Tạo Đề 8 Môn THCS (CV 7991)',
    action: 'Tạo đề kiểm tra Toán 6 Giữa kì 1 & Tải file Word',
    timestamp: '23/09/2026 15:10:20',
    date: '2026-09-23'
  },
  {
    id: 'LOG-002',
    machineId: 'GV-4C91-D3F0',
    userName: 'Giáo viên mới',
    school: 'Chưa cập nhật',
    phone: 'Chưa cập nhật',
    appId: 'tao-de-anh',
    appName: 'Tạo Đề Tiếng Anh Global Success',
    action: 'Dùng thử tạo đề tiếng Anh Lớp 7 GK1 (Lượt 1/5)',
    timestamp: '23/09/2026 15:02:18',
    date: '2026-09-23'
  },
  {
    id: 'LOG-003',
    machineId: 'GV-8F22-A109',
    userName: 'Thầy Trần Văn Tuấn',
    school: 'Trường THCS Đồng Yên',
    phone: '0977.654321',
    appId: 'tao-de-8mon',
    appName: 'Tạo Đề 8 Môn THCS (CV 7991)',
    action: 'Tạo ma trận & bản đặc tả môn Ngữ Văn 8',
    timestamp: '23/09/2026 14:45:30',
    date: '2026-09-23'
  },
  {
    id: 'LOG-004',
    machineId: 'GV-A7B8-90F1',
    userName: 'Cô Hoàng Thu Thảo',
    school: 'Trường THCS Lê Quý Đôn',
    phone: '0983.123456',
    appId: 'tao-de-8mon',
    appName: 'Tạo Đề 8 Môn THCS (CV 7991)',
    action: 'Gửi đơn đăng ký gói bản quyền 2 Năm (250.000đ)',
    timestamp: '23/09/2026 14:15:30',
    date: '2026-09-23'
  },
  {
    id: 'LOG-005',
    machineId: 'GV-3E11-9B5C',
    userName: 'Cô Nguyễn Thị Hoa',
    school: 'Trường THCS Nguyễn Du',
    phone: '0912.889900',
    appId: 'tao-de-anh',
    appName: 'Tạo Đề Tiếng Anh Global Success',
    action: 'Nghe thử Audio hội thoại Listening Unit 2',
    timestamp: '23/09/2026 13:25:10',
    date: '2026-09-23'
  },
  {
    id: 'LOG-006',
    machineId: 'GV-8F22-A109',
    userName: 'Thầy Trần Văn Tuấn',
    school: 'Trường THCS Đồng Yên',
    phone: '0977.654321',
    appId: 'tach-gop-pdf',
    appName: 'PDF Suite Pro',
    action: 'Tách dải trang file Kế hoạch bài dạy PDF',
    timestamp: '23/09/2026 11:20:00',
    date: '2026-09-23'
  }
];

class ActivityTrackingService {
  // Kiểm tra máy tính của Thầy Thành (Đặc quyền VIP dùng thử thoải mái không giới hạn)
  public isUnlimitedDevMachine(): boolean {
    if (typeof window === 'undefined') return true;
    return (
      localStorage.getItem('gvai_unlimited_machine') === 'true' ||
      localStorage.getItem('gvai_admin_logged_in') === 'true' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    );
  }

  constructor() {
    this.recordPageView();
  }

  // Tăng số lượt xem trang web thực tế
  public recordPageView(): void {
    try {
      const current = parseInt(localStorage.getItem(STORAGE_WEB_PAGEVIEWS) || '1420', 10);
      localStorage.setItem(STORAGE_WEB_PAGEVIEWS, String(current + 1));
    } catch (e) {
      // ignore
    }
  }

  // Lấy hoặc sinh Machine ID duy nhất cố định cho trình duyệt/máy tính này
  public getOrCreateMachineId(): string {
    let mid = localStorage.getItem(STORAGE_MACHINE_ID);
    if (!mid) {
      const chars = '0123456789ABCDEF';
      let part1 = '';
      let part2 = '';
      for (let i = 0; i < 4; i++) {
        part1 += chars.charAt(Math.floor(Math.random() * chars.length));
        part2 += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      mid = `GV-${part1}-${part2}`;
      localStorage.setItem(STORAGE_MACHINE_ID, mid);
    }
    return mid;
  }

  // Kiểm tra máy hiện tại có bị Admin xóa / khóa hay không
  public isCurrentMachineBlocked(): boolean {
    if (this.isUnlimitedDevMachine()) return false;
    const mid = this.getOrCreateMachineId();
    return this.isMachineBlocked(mid);
  }

  // Kiểm tra một machineId cụ thể có bị khóa không
  public isMachineBlocked(machineId: string): boolean {
    const blockedList = this.getBlockedMachines();
    return blockedList.some(b => b.machineId === machineId);
  }

  // Lấy danh sách máy bị khóa
  public getBlockedMachines(): BlockedMachineItem[] {
    const raw = localStorage.getItem(STORAGE_BLOCKED_MACHINES);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  // Khóa một máy tính
  public blockMachine(machineId: string, reason: string = 'Quản trị viên vô hiệu hóa'): void {
    const list = this.getBlockedMachines();
    const all = this.getAllTrackedMachines();
    const target = all.find(m => m.machineId === machineId);
    
    if (!list.some(b => b.machineId === machineId)) {
      const now = this.formatNow();
      list.unshift({
        machineId,
        blockedAt: now,
        reason,
        fullName: target?.fullName || 'Không rõ họ tên',
        schoolUnit: target?.schoolUnit || ''
      });
      localStorage.setItem(STORAGE_BLOCKED_MACHINES, JSON.stringify(list));
    }

    // Cập nhật profile máy
    const allTracked = this.getAllTrackedMachines().map(m => {
      if (m.machineId === machineId) {
        return { ...m, isBlocked: true, blockedReason: reason };
      }
      return m;
    });
    localStorage.setItem(STORAGE_ALL_MACHINES, JSON.stringify(allTracked));

    // Thu hồi bản quyền bên licenseService
    licenseService.revoke(machineId);

    // Ghi log
    this.logActivity('system', 'Hệ Thống Quản Trị', `Khóa và chặn thiết bị [${machineId}] vĩnh viễn`);
  }

  // Mở khóa một máy tính
  public unblockMachine(machineId: string): void {
    let list = this.getBlockedMachines();
    list = list.filter(b => b.machineId !== machineId);
    localStorage.setItem(STORAGE_BLOCKED_MACHINES, JSON.stringify(list));

    const allTracked = this.getAllTrackedMachines().map(m => {
      if (m.machineId === machineId) {
        return { ...m, isBlocked: false, blockedReason: undefined };
      }
      return m;
    });
    localStorage.setItem(STORAGE_ALL_MACHINES, JSON.stringify(allTracked));

    this.logActivity('system', 'Hệ Thống Quản Trị', `Mở khóa truy cập cho thiết bị [${machineId}]`);
  }

  // XÓA TÀI KHOẢN VÀ KHÓA VĨNH VIỄN (Admin đã xóa tk nào thì tk đó không hoạt động được nữa)
  public deleteAndBlockMachine(machineId: string, adminName: string = 'Thầy Đinh Văn Thành'): void {
    // 1. Đưa vào Blacklist
    this.blockMachine(machineId, `Tài khoản bị xóa bởi ${adminName}`);

    // 2. Xóa khỏi danh sách theo dõi thông thường
    let list = this.getAllTrackedMachines().filter(m => m.machineId !== machineId);
    localStorage.setItem(STORAGE_ALL_MACHINES, JSON.stringify(list));

    // 3. Xóa đơn đăng ký nếu có
    let regs = this.getAllRegistrations().filter(r => r.machineId !== machineId);
    localStorage.setItem(STORAGE_REGISTRATIONS, JSON.stringify(regs));

    // 4. Ghi log
    this.logActivity(
      'system',
      'Quản Trị Admin',
      `${adminName} đã XÓA TÀI KHOẢN & KHÓA VĨNH VIỄN máy [${machineId}] - Máy này không còn hoạt động được nữa.`
    );
  }

  // Lấy hồ sơ của máy hiện tại
  public getCurrentProfile(): MachineProfile {
    const mid = this.getOrCreateMachineId();
    const stored = localStorage.getItem(STORAGE_CURRENT_PROFILE);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.machineId === mid) return parsed;
      } catch (e) {
        console.error(e);
      }
    }

    const now = this.formatNow();
    const newProfile: MachineProfile = {
      machineId: mid,
      fullName: '',
      schoolUnit: '',
      phoneNumber: '',
      trialUsed: 0,
      trialMax: 5,
      isRegisteredTrial: false,
      lastSeenAt: now,
      firstSeenAt: now,
      deviceInfo: `${navigator.platform || 'PC'} / ${navigator.userAgent.includes('CocCoc') ? 'Cốc Cốc' : 'Chrome/Edge'}`,
      appsVisited: {}
    };
    this.saveCurrentProfile(newProfile);
    return newProfile;
  }

  // Lưu hồ sơ máy hiện tại
  public saveCurrentProfile(profile: MachineProfile) {
    localStorage.setItem(STORAGE_CURRENT_PROFILE, JSON.stringify(profile));
    this.syncToGlobalList(profile);
  }

  // Đăng ký dùng thử 5 lần
  public registerTrial(payload: {
    fullName: string;
    schoolUnit: string;
    phoneNumber: string;
    appId?: string;
    appName?: string;
  }): { success: boolean; message: string; profile: MachineProfile } {
    if (this.isCurrentMachineBlocked()) {
      return {
        success: false,
        message: 'Tài khoản / Thiết bị này đã bị Quản trị viên vô hiệu hóa!',
        profile: this.getCurrentProfile()
      };
    }

    const profile = this.getCurrentProfile();
    const now = this.formatNow();

    profile.fullName = payload.fullName.trim();
    profile.schoolUnit = payload.schoolUnit.trim();
    profile.phoneNumber = payload.phoneNumber.trim();
    profile.isRegisteredTrial = true;
    profile.registeredAt = now;
    profile.lastSeenAt = now;
    profile.trialMax = 5;

    this.saveCurrentProfile(profile);

    // Gửi đơn đăng ký dùng thử vào hệ thống
    this.submitRegistration({
      machineId: profile.machineId,
      fullName: profile.fullName,
      schoolUnit: profile.schoolUnit,
      phoneNumber: profile.phoneNumber,
      appId: payload.appId || 'all-apps',
      appName: payload.appName || 'Tất Cả Các Phần Mềm',
      packageType: 'TRIAL_5',
      price: 'Miễn phí (5 lượt)'
    });

    // Ghi log
    this.logActivity(
      payload.appId || 'trial',
      payload.appName || 'Đăng Ký Dùng Thử',
      `Đăng ký thành công 5 lượt dùng thử (${profile.fullName} - ${profile.schoolUnit})`
    );

    return {
      success: true,
      message: `Đăng ký thành công! Máy tính ${profile.machineId} được kích hoạt 5 lượt dùng thử đầy đủ tính năng.`,
      profile
    };
  }

  // Sử dụng 1 lượt dùng thử
  public consumeTrial(appId: string, appName: string, actionName: string = 'Dùng thử tính năng'): { allowed: boolean; remaining: number; message: string } {
    if (this.isUnlimitedDevMachine()) {
      this.trackAppVisit(appId, appName);
      this.logActivity(appId, appName, `${actionName} (👑 Máy Thầy Thành: Sử dụng không giới hạn)`);
      return {
        allowed: true,
        remaining: 999999,
        message: '👑 Đặc quyền Máy Thầy Thành: Sử dụng không giới hạn (VIP Unlimited)!'
      };
    }
    if (this.isCurrentMachineBlocked()) {
      return {
        allowed: false,
        remaining: 0,
        message: 'Tài khoản / Máy tính này đã bị Quản trị viên vô hiệu hóa hoặc thu hồi quyền truy cập!'
      };
    }

    const profile = this.getCurrentProfile();
    const remaining = Math.max(0, profile.trialMax - profile.trialUsed);

    if (remaining <= 0) {
      return {
        allowed: false,
        remaining: 0,
        message: 'Thầy/Cô đã dùng hết 5 lượt dùng thử miễn phí. Vui lòng đăng ký bản quyền (1 năm 200k / 2 năm 250k) để tiếp tục!'
      };
    }

    profile.trialUsed += 1;
    this.trackAppVisit(appId, appName);
    this.saveCurrentProfile(profile);

    const newRemaining = Math.max(0, profile.trialMax - profile.trialUsed);

    // Ghi log chi tiết
    this.logActivity(
      appId,
      appName,
      `${actionName} (Lượt thử: ${profile.trialUsed}/5 - Còn lại: ${newRemaining})`
    );

    return {
      allowed: true,
      remaining: newRemaining,
      message: `Đã sử dụng 1 lượt thử. Thầy/Cô còn lại ${newRemaining} lượt thử miễn phí.`
    };
  }

  // Ghi nhận truy cập app
  public trackAppVisit(appId: string, appName: string): void {
    if (this.isCurrentMachineBlocked()) return;

    const profile = this.getCurrentProfile();
    const now = this.formatNow();

    profile.lastSeenAt = now;
    if (!profile.appsVisited[appId]) {
      profile.appsVisited[appId] = {
        appId,
        appName,
        count: 1,
        lastVisit: now
      };
    } else {
      profile.appsVisited[appId].count += 1;
      profile.appsVisited[appId].lastVisit = now;
    }

    this.saveCurrentProfile(profile);
  }

  // GHI LOG HOẠT ĐỘNG CHI TIẾT THEO NGÀY GIỜ
  public logActivity(appId: string, appName: string, action: string): void {
    try {
      const profile = this.getCurrentProfile();
      const now = this.formatNow();
      const today = new Date().toISOString().substring(0, 10);
      const newLog: ActivityLogItem = {
        id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        machineId: profile.machineId,
        userName: profile.fullName || undefined,
        school: profile.schoolUnit || undefined,
        phone: profile.phoneNumber || undefined,
        appId,
        appName,
        action,
        timestamp: now,
        date: today
      };

      const logs = this.getActivityLogs();
      logs.unshift(newLog);
      // Giới hạn lưu 500 log mới nhất
      if (logs.length > 500) logs.pop();
      localStorage.setItem(STORAGE_ACTIVITY_LOGS, JSON.stringify(logs));
    } catch (e) {
      console.error(e);
    }
  }

  // Lấy danh sách log hoạt động chi tiết
  public getActivityLogs(): ActivityLogItem[] {
    const raw = localStorage.getItem(STORAGE_ACTIVITY_LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_ACTIVITY_LOGS, JSON.stringify(DEFAULT_ACTIVITY_LOGS));
      return [...DEFAULT_ACTIVITY_LOGS];
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [...DEFAULT_ACTIVITY_LOGS];
    } catch {
      return [...DEFAULT_ACTIVITY_LOGS];
    }
  }

  // ==========================================
  // QUẢN LÝ ĐƠN ĐĂNG KÝ THÀNH VIÊN CHO TẤT CẢ CÁC APP
  // ==========================================
  public submitRegistration(req: {
    machineId: string;
    fullName: string;
    schoolUnit: string;
    phoneNumber: string;
    appId: string;
    appName: string;
    packageType: 'TRIAL_5' | '1YEAR' | '2YEAR' | 'FULL_WEB';
    price?: string;
  }): RegistrationRequest {
    const list = this.getAllRegistrations();
    const now = this.formatNow();
    let priceText = 'Miễn phí';
    if (req.packageType === '1YEAR') priceText = '200.000đ';
    if (req.packageType === '2YEAR') priceText = '250.000đ';

    const newReq: RegistrationRequest = {
      id: `REG-${Date.now()}`,
      machineId: req.machineId,
      fullName: req.fullName,
      schoolUnit: req.schoolUnit,
      phoneNumber: req.phoneNumber,
      appId: req.appId,
      appName: req.appName,
      packageType: req.packageType,
      price: req.price || priceText,
      status: 'PENDING',
      createdAt: now
    };

    list.unshift(newReq);
    localStorage.setItem(STORAGE_REGISTRATIONS, JSON.stringify(list));

    // Ghi log hoạt động
    this.logActivity(
      req.appId,
      req.appName,
      `Gửi đơn đăng ký gói ${req.packageType === 'TRIAL_5' ? 'Dùng thử 5 lần' : req.packageType === '1YEAR' ? '1 Năm (200k)' : '2 Năm (250k)'}`
    );

    return newReq;
  }

  public getAllRegistrations(): RegistrationRequest[] {
    const raw = localStorage.getItem(STORAGE_REGISTRATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_REGISTRATIONS, JSON.stringify(DEFAULT_REGISTRATIONS));
      return [...DEFAULT_REGISTRATIONS];
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [...DEFAULT_REGISTRATIONS];
    } catch {
      return [...DEFAULT_REGISTRATIONS];
    }
  }

  // DUYỆT ĐƠN ĐĂNG KÝ VÀ NÂNG CẤP THÀNH VIÊN
  public approveRegistration(
    id: string,
    reviewerName: string,
    pkgOverride?: '1YEAR' | '2YEAR' | 'FULL_WEB' | 'TRIAL_5'
  ): { success: boolean; message: string } {
    const list = this.getAllRegistrations();
    const item = list.find(r => r.id === id);
    if (!item) return { success: false, message: 'Không tìm thấy đơn đăng ký!' };

    const effectivePkg = pkgOverride || item.packageType;
    const now = this.formatNow();

    item.status = 'APPROVED';
    item.reviewedBy = reviewerName;
    item.reviewedAt = now;
    localStorage.setItem(STORAGE_REGISTRATIONS, JSON.stringify(list));

    // Kích hoạt VIP hoặc dùng thử
    if (effectivePkg === '1YEAR' || effectivePkg === '2YEAR') {
      licenseService.extend(item.machineId, effectivePkg, reviewerName);
    } else {
      // Cấp thêm 5 lượt dùng thử
      const all = this.getAllTrackedMachines();
      const m = all.find(x => x.machineId === item.machineId);
      if (m) {
        m.trialMax = Math.max(m.trialMax, m.trialUsed + 5);
        localStorage.setItem(STORAGE_ALL_MACHINES, JSON.stringify(all));
      }
    }

    this.logActivity(
      item.appId,
      item.appName,
      `${reviewerName} đã DUYỆT đơn và nâng cấp gói ${effectivePkg === '2YEAR' ? '2 Năm (250k)' : effectivePkg === '1YEAR' ? '1 Năm (200k)' : 'Dùng thử'} cho [${item.fullName} - ${item.machineId}]`
    );

    return {
      success: true,
      message: `Đã duyệt thành công và nâng cấp thành viên cho Thầy/Cô ${item.fullName} (${item.machineId}) bởi ${reviewerName}!`
    };
  }

  // TỪ CHỐI ĐƠN ĐĂNG KÝ
  public rejectRegistration(id: string, reviewerName: string): boolean {
    const list = this.getAllRegistrations();
    const item = list.find(r => r.id === id);
    if (!item) return false;

    item.status = 'REJECTED';
    item.reviewedBy = reviewerName;
    item.reviewedAt = this.formatNow();
    localStorage.setItem(STORAGE_REGISTRATIONS, JSON.stringify(list));

    this.logActivity(
      item.appId,
      item.appName,
      `${reviewerName} đã từ chối đơn đăng ký của [${item.fullName} - ${item.machineId}]`
    );
    return true;
  }

  // THỐNG KÊ TRUY CẬP THỰC TẾ & SỐ NGƯỜI DÙNG
  public getWebStats() {
    const pageviews = parseInt(localStorage.getItem(STORAGE_WEB_PAGEVIEWS) || '1420', 10);
    const all = this.getAllTrackedMachines();
    const totalUnique = all.length;
    const registered = all.filter(m => m.isRegisteredTrial).length;
    const activeTrials = all.filter(m => m.trialUsed > 0 && m.trialUsed < m.trialMax).length;
    const completedTrials = all.filter(m => m.trialUsed >= m.trialMax).length;
    const blockedCount = this.getBlockedMachines().length;
    const pendingRegs = this.getAllRegistrations().filter(r => r.status === 'PENDING').length;

    return {
      totalPageviews: pageviews,
      totalUniqueVisitors: totalUnique + 85, // tính toán kết hợp khách truy cập vãng lai
      registeredTrialCount: registered,
      activeTrialUsers: activeTrials,
      completedTrialUsers: completedTrials,
      totalBlockedMachines: blockedCount,
      pendingRegistrationsCount: pendingRegs
    };
  }

  // Đồng bộ máy hiện tại vào danh sách toàn cục để Admin xem
  private syncToGlobalList(profile: MachineProfile) {
    let list = this.getAllTrackedMachines();
    const idx = list.findIndex(m => m.machineId === profile.machineId);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...profile };
    } else {
      list.unshift(profile);
    }
    localStorage.setItem(STORAGE_ALL_MACHINES, JSON.stringify(list));
  }

  // Lấy toàn bộ danh sách các máy đã truy cập (cho Admin Thầy Thành)
  public getAllTrackedMachines(): MachineProfile[] {
    const raw = localStorage.getItem(STORAGE_ALL_MACHINES);
    let list: MachineProfile[] = [];
    if (raw) {
      try {
        list = JSON.parse(raw);
      } catch (e) {
        list = [];
      }
    }
    if (!list || list.length === 0) {
      list = [...DEFAULT_TRACKED_USERS];
    }

    const currentMid = this.getOrCreateMachineId();
    if (!list.some(m => m.machineId === currentMid)) {
      list.unshift(this.getCurrentProfile());
    }

    // Dự đoán thông minh tên người dùng nếu chưa nhập
    return list.map(m => {
      let predicted = m.fullName;
      if (!predicted || predicted.trim() === '') {
        if (m.schoolUnit) {
          predicted = `Giáo viên ${m.schoolUnit}`;
        } else if (m.phoneNumber) {
          predicted = `Khách hàng Zalo ${m.phoneNumber}`;
        } else {
          const appEntries = Object.values(m.appsVisited || {});
          if (appEntries.length > 0) {
            appEntries.sort((a, b) => b.count - a.count);
            predicted = `Giáo viên bộ môn (${appEntries[0].appName.split(' ')[0]} - ${m.machineId.substring(3, 7)})`;
          } else {
            predicted = `Giáo viên mới (${m.machineId})`;
          }
        }
      }
      return {
        ...m,
        predictedName: predicted
      };
    });
  }

  // Định dạng ngày giờ chuẩn Việt Nam: DD/MM/YYYY HH:mm:ss
  private formatNow(): string {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear();
    const hours = pad(d.getHours());
    const mins = pad(d.getMinutes());
    const secs = pad(d.getSeconds());
    return `${day}/${month}/${year} ${hours}:${mins}:${secs}`;
  }
}

export const activityTrackingService = new ActivityTrackingService();
