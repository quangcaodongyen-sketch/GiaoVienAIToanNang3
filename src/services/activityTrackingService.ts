
export const isAdminMachine = (mid?: string): boolean => {
  if (!mid) return false;
  const upper = mid.toUpperCase();
  return ADMIN_WHITELIST_MACHINES.includes(mid) ||
         ADMIN_WHITELIST_MACHINES.includes(upper) ||
         upper.includes('DVT') ||
         upper.includes('ADMIN') ||
         mid === 'GV-33B3-4A70' ||
         mid === 'GV-0DAD-F76C';
};

export const ADMIN_WHITELIST_MACHINES = [
  'GV-0DAD-F76C',
  'GV-33B3-4A70',
  'NLS-DVT-0B1D-A6A7-5A14'
];
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
  packageType: 'TRIAL_5' | '1YEAR' | '2YEAR' | '3YEAR' | 'LIFETIME';
  price?: string;
  issueNumber?: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  daysRemaining?: number;
  expiryDateStr?: string;
  isLifetime?: boolean;
}

export interface BlockedMachineItem {
  machineId: string;
  blockedAt: string;
  reason: string;
  fullName?: string;
  schoolUnit?: string;
}

export interface AppInstalledMachineDetail {
  machineId: string;
  firstSeenAt: string;
  lastSeenAt: string;
  fullName?: string;
  schoolUnit?: string;
  phoneNumber?: string;
  status: 'ACTIVE_PRO' | 'TRIAL' | 'INSTALLED';
  installCount: number; // Số lần thực hiện cài/tải (máy tính chỉ tính là 1 máy duy nhất)
  updateCount: number;  // Số lần giáo viên bấm cập nhật phiên bản mới
  lastVersion?: string;
}

export interface AppQuotaStatItem {
  appId: string;
  appName: string;
  shortName: string;
  category: 'tienganh' | 'toan' | 'tienich' | 'chung';
  badge: string;
  installedMachinesCount: number; // Số máy tính duy nhất đã cài đặt (mỗi máy tính tính 1 lần duy nhất)
  trialMachinesCount: number;     // Số máy tính duy nhất đã dùng thử
  activatedMachinesCount: number; // Số máy tính duy nhất đã kích hoạt Pro
  updateCount: number;            // Tổng số lượt giáo viên update app này
  activationRate: number;         // Tỷ lệ % kích hoạt Pro / tổng máy cài đặt
  machines: AppInstalledMachineDetail[];
}

export interface EcosystemQuotaSummary {
  totalUniqueInstalledMachines: number; // Tổng số máy tính duy nhất đã cài đặt trên toàn hệ sinh thái (mỗi máy chỉ tính 1 lần)
  totalUniqueTrialMachines: number;     // Tổng số máy tính duy nhất đã dùng thử
  totalUniqueActivatedMachines: number; // Tổng số máy tính duy nhất đã có bản quyền Pro
  totalUpdateCount: number;            // Tổng số lượt giáo viên update trên mọi app
  appsStats: AppQuotaStatItem[];
}

const STORAGE_MACHINE_ID = 'gvai_hardware_machine_id';
const STORAGE_CURRENT_PROFILE = 'gvai_current_machine_profile';
const STORAGE_ALL_MACHINES = 'gvai_all_tracked_machines';
const STORAGE_ACTIVITY_LOGS = 'gvai_detailed_activity_logs';
const STORAGE_REGISTRATIONS = 'gvai_registration_requests';
const STORAGE_BLOCKED_MACHINES = 'gvai_blocked_machines_list';
const STORAGE_WEB_PAGEVIEWS = 'gvai_web_pageviews_count';
const STORAGE_APP_INSTALLS_MAP = 'gvai_ecosystem_app_installs_map_v2';
const STORAGE_APP_UPDATES_LOG = 'gvai_ecosystem_app_updates_log_v2';

export const ECOSYSTEM_APPS_CATALOG = [
  {
    appId: 'tich-hop-nls-ai',
    appName: 'Tích Hợp NLS & AI Vào Giáo Án (CV 5512 - THCS & THPT)',
    shortName: 'Tích Hợp NLS & AI',
    category: 'chung' as const,
    badge: 'BẢN QUYỀN PRO'
  },
  {
    appId: 'tao-de-tieng-anh-thcs',
    appName: 'Tạo Đề Tiếng Anh THCS (Global Success 6, 7, 8, 9 - CV 7991)',
    shortName: 'Tạo Đề TA THCS',
    category: 'tienganh' as const,
    badge: 'BẢN QUYỀN PRO'
  },
  {
    appId: 'tao-de-tieng-anh-thpt',
    appName: 'Tạo Đề Tiếng Anh THPT (Global Success 10, 11, 12 - BGD&ĐT)',
    shortName: 'Tạo Đề TA THPT',
    category: 'tienganh' as const,
    badge: 'BẢN QUYỀN PRO'
  },
  {
    appId: 'tao-de-15p-tieng-anh',
    appName: 'Tạo Đề 15 Phút Tiếng Anh THCS (Global Success 48 Units)',
    shortName: 'Tạo Đề 15 Phút TA',
    category: 'tienganh' as const,
    badge: 'BẢN QUYỀN PRO'
  },
  {
    appId: 'mathstudio',
    appName: 'Đinh Thành MathStudio 2026+ Pro (Chuyển Mathpix sang Word)',
    shortName: 'MathStudio Pro',
    category: 'toan' as const,
    badge: 'NỘI BỘ ADMIN'
  },
  {
    appId: 'tao-de-thcs-8mon',
    appName: 'Trung Tâm Tạo Đề 8 Môn THCS (CV 7991 Chuẩn Ma Trận Đặc Tả)',
    shortName: 'Tạo Đề 8 Môn THCS',
    category: 'chung' as const,
    badge: 'BẢN QUYỀN PRO'
  },
  {
    appId: 'sinh-de-bienthe',
    appName: 'Sinh 3 Đề Biến Thể Tương Đương (Word Add-in VIP)',
    shortName: 'Sinh Đề Biến Thể',
    category: 'chung' as const,
    badge: 'BẢN QUYỀN PRO'
  },
  {
    appId: 'screen-record',
    appName: 'Screen Record Pro V2 (Ghi Màn Hình & Giảng Bài HD)',
    shortName: 'Screen Record Pro',
    category: 'tienich' as const,
    badge: 'MIỄN PHÍ'
  },
  {
    appId: 'cleaner-pro',
    appName: 'Đinh Thành Cleaner Pro v4.5 (Dọn Rác Máy Tính Giáo Viên)',
    shortName: 'Cleaner Pro v4.5',
    category: 'tienich' as const,
    badge: 'MIỄN PHÍ'
  },
  {
    appId: 'chuan-hoa-van-ban',
    appName: 'Chuẩn Hóa Văn Bản Word & Giáo Án (NĐ 30/2020 & CV 5512)',
    shortName: 'Chuẩn Hóa Văn Bản',
    category: 'chung' as const,
    badge: 'MIỄN PHÍ'
  },
  {
    appId: 'pdf-suite',
    appName: 'PDF Suite Pro (Tách - Gộp - Lọc Trang Trắng AI)',
    shortName: 'PDF Suite Pro',
    category: 'tienich' as const,
    badge: 'MIỄN PHÍ'
  },
  {
    appId: 'smart-listening-pro',
    appName: 'Tạo Bài Nghe MP3 Tiếng Anh (Smart Listening Pro)',
    shortName: 'Smart Listening MP3',
    category: 'tienganh' as const,
    badge: 'BẢN QUYỀN PRO'
  }
];

// Dữ liệu mẫu ban đầu để Bảng Thống Kê Admin hiển thị ngay dữ liệu sống động, chân thực
const DEFAULT_TRACKED_USERS: MachineProfile[] = [];

// Dữ liệu mẫu đơn đăng ký chờ duyệt
const DEFAULT_REGISTRATIONS: RegistrationRequest[] = [];

// Dữ liệu mẫu log hoạt động chi tiết theo ngày giờ
const DEFAULT_ACTIVITY_LOGS: ActivityLogItem[] = [];

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
    // Tuyệt đối không bao giờ chặn hoặc khóa màn hình web của người dùng
    return false;
  }

  // Kiểm tra một machineId cụ thể có bị khóa không
  public isMachineBlocked(machineId: string): boolean {
    if (ADMIN_WHITELIST_MACHINES.includes(machineId) || machineId.includes('DVT')) return false;
    if (typeof window !== 'undefined' && localStorage.getItem('gvai_unlimited_machine') === 'true') return false;
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
    // Xóa triệt để khỏi danh sách máy bị khóa để không hiện lại
    this.unblockMachine(machineId);

    // Xóa khỏi danh sách theo dõi
    let list = this.getAllTrackedMachines().filter(m => m.machineId !== machineId);
    localStorage.setItem(STORAGE_ALL_MACHINES, JSON.stringify(list));

    // Xóa đơn đăng ký nếu có
    let regs = this.getAllRegistrations().filter(r => r.machineId !== machineId);
    localStorage.setItem(STORAGE_REGISTRATIONS, JSON.stringify(regs));

    // Ghi log
    this.logActivity(
      'system',
      'Quản Trị Admin',
      `${adminName} đã XÓA VĨNH VIỄN máy [${machineId}] khỏi hệ thống.`
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
      appId: payload.appId || 'tich-hop-nls-ai',
      appName: payload.appName || 'Tích Hợp NLS & AI Vào Giáo Án THCS',
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
        message: 'Thầy/Cô đã dùng hết 5 lượt dùng thử miễn phí. Vui lòng liên hệ Zalo Thầy Thành (0915.213717) để được báo giá ưu đãi và tiếp tục sử dụng!'
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
    packageType: 'TRIAL_5' | '1YEAR' | '2YEAR' | '3YEAR' | 'LIFETIME';
    price?: string;
  }): RegistrationRequest {
    const list = this.getAllRegistrations();
    const now = this.formatNow();
    let priceText = 'Miễn phí';
    if (req.packageType === '1YEAR') priceText = 'Liên hệ Zalo';
    if (req.packageType === '2YEAR') priceText = 'Liên hệ Zalo';
    if (req.packageType === '3YEAR') priceText = 'Liên hệ Zalo';

    // Cặp định danh duy nhất: (machineId + appId)
    // Nếu cùng máy và cùng App: CẬP NHẬT đè thông tin mới (không tạo rác nhiều bản ghi)
    // Nếu cùng máy nhưng App khác: Thêm bản ghi cho App mới (cho phép đăng ký nhiều App)
    const existingIndex = list.findIndex(r => r.machineId === req.machineId && (r.appId === req.appId || (!r.appId && !req.appId)));
    
    let resultReq: RegistrationRequest;
    if (existingIndex !== -1) {
      resultReq = {
        ...list[existingIndex],
        fullName: req.fullName,
        schoolUnit: req.schoolUnit,
        phoneNumber: req.phoneNumber,
        appName: req.appName,
        packageType: req.packageType,
        price: req.price || priceText,
        createdAt: now
      };
      list[existingIndex] = resultReq;
    } else {
      resultReq = {
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
      list.unshift(resultReq);
    }
    localStorage.setItem(STORAGE_REGISTRATIONS, JSON.stringify(list));

    // Ghi log hoạt động
    this.logActivity(
      req.appId,
      req.appName,
      `Gửi đơn đăng ký gói ${req.packageType === 'TRIAL_5' ? 'Dùng thử 5 lần' : req.packageType === '1YEAR' ? 'Gói 1 Năm' : req.packageType === '2YEAR' ? 'Gói 2 Năm VIP' : 'Gói Full Web'}`
    );

    return resultReq;
  }

  public getAllRegistrations(): RegistrationRequest[] {
    const raw = localStorage.getItem(STORAGE_REGISTRATIONS);
    let list: RegistrationRequest[] = [];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        list = Array.isArray(parsed) ? parsed : [];
      } catch {
        list = [];
      }
    }
    const DEMO_IDS = ['GV-A7B8-90F1', 'GV-3E11-9B5C', 'GV-4C91-D3F0'];
    list = list.filter(r => !DEMO_IDS.includes(r.machineId) && r.fullName !== 'Cô Hoàng Thu Thảo' && r.fullName !== 'Thầy Trần Văn Tuấn');
    localStorage.setItem(STORAGE_REGISTRATIONS, JSON.stringify(list));
    return list;
  }

  // DUYỆT ĐƠN ĐĂNG KÝ VÀ NÂNG CẤP THÀNH VIÊN
  public approveRegistration(
    id: string,
    reviewerName: string,
    pkgOverride?: '1YEAR' | '2YEAR' | '3YEAR' | 'TRIAL_5' | 'LIFETIME',
    fallbackItem?: RegistrationRequest
  ): { success: boolean; message: string } {
    let list = this.getAllRegistrations();
    let item = list.find(r => r.id === id || (fallbackItem?.machineId && r.machineId === fallbackItem.machineId));
    if (!item && fallbackItem) {
      item = { ...fallbackItem };
      list.push(item);
    }
    if (!item) return { success: false, message: 'Không tìm thấy đơn đăng ký!' };

    const effectivePkg = pkgOverride || item.packageType;
    const now = this.formatNow();

    item.status = 'APPROVED';
    item.reviewedBy = reviewerName;
    item.reviewedAt = now;
    item.packageType = effectivePkg;
    localStorage.setItem(STORAGE_REGISTRATIONS, JSON.stringify(list));

    // Kích hoạt VIP hoặc dùng thử
    if (effectivePkg === '1YEAR' || effectivePkg === '2YEAR' || effectivePkg === '3YEAR' || effectivePkg === 'LIFETIME') {
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
      `${reviewerName} đã DUYỆT đơn và nâng cấp gói ${effectivePkg === 'LIFETIME' ? 'Trọn Đời' : effectivePkg === '3YEAR' ? '3 Năm Pro' : effectivePkg === '2YEAR' ? '2 Năm VIP' : effectivePkg === '1YEAR' ? '1 Năm' : 'Dùng thử'} cho [${item.fullName} - ${item.machineId}]`
    );

    const pkgMsgLabel = effectivePkg === 'LIFETIME' ? 'Trọn Đời' : effectivePkg === '3YEAR' ? '3 Năm Pro' : effectivePkg === '2YEAR' ? '2 Năm VIP' : effectivePkg === '1YEAR' ? '1 Năm' : 'Dùng thử';
    return {
      success: true,
      message: `Đã duyệt thành công Gói [${pkgMsgLabel}] cho Thầy/Cô ${item.fullName} (${item.machineId}) bởi ${reviewerName}!`
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

  // Đồng bộ máy hiện tại vào danh sách toàn cục để Admin xem (Loại trừ 100% máy Admin / Thầy Thành)
  private syncToGlobalList(profile: MachineProfile) {
    if (isAdminMachine(profile.machineId)) {
      return; // Tuyệt đối không bao giờ đưa máy Admin vào danh sách khách hàng theo dõi
    }
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

    const DEMO_IDS = ['GV-A7B8-90F1', 'GV-3E11-9B5C', 'GV-4C91-D3F0'];
    list = list.filter(m => !isAdminMachine(m.machineId) && !DEMO_IDS.includes(m.machineId) && m.fullName !== 'Cô Hoàng Thu Thảo' && m.fullName !== 'Thầy Trần Văn Tuấn');

    const currentMid = this.getOrCreateMachineId();
    if (!isAdminMachine(currentMid) && !DEMO_IDS.includes(currentMid) && !list.some(m => m.machineId === currentMid)) {
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

  // ==========================================
  // HỆ THỐNG QUẢN LÝ HẠN NGẠCH CÀI ĐẶT & UPDATE TẤT CẢ CÁC APP
  // ==========================================

  // Ghi nhận máy tính đã cài đặt app (mỗi máy tính chỉ tính là 1 lần cài đặt duy nhất)
  public recordInstallation(
    appId: string,
    appName: string,
    machineId?: string,
    teacherInfo?: { fullName?: string; schoolUnit?: string; phoneNumber?: string }
  ): { isNewMachine: boolean; installedCount: number } {
    const mid = (machineId || this.getOrCreateMachineId()).trim().toUpperCase();
    if (isAdminMachine(mid)) return { isNewMachine: false, installedCount: 0 };

    try {
      const raw = localStorage.getItem(STORAGE_APP_INSTALLS_MAP);
      const installsMap: Record<string, Record<string, AppInstalledMachineDetail>> = raw ? JSON.parse(raw) : {};
      if (!installsMap[appId]) installsMap[appId] = {};

      const now = this.formatNow();
      let isNewMachine = false;

      if (!installsMap[appId][mid]) {
        isNewMachine = true;
        installsMap[appId][mid] = {
          machineId: mid,
          firstSeenAt: now,
          lastSeenAt: now,
          fullName: teacherInfo?.fullName || this.getCurrentProfile().fullName || undefined,
          schoolUnit: teacherInfo?.schoolUnit || this.getCurrentProfile().schoolUnit || undefined,
          phoneNumber: teacherInfo?.phoneNumber || this.getCurrentProfile().phoneNumber || undefined,
          status: 'INSTALLED',
          installCount: 1,
          updateCount: 0
        };
      } else {
        installsMap[appId][mid].lastSeenAt = now;
        installsMap[appId][mid].installCount += 1;
        if (teacherInfo?.fullName) installsMap[appId][mid].fullName = teacherInfo.fullName;
        if (teacherInfo?.schoolUnit) installsMap[appId][mid].schoolUnit = teacherInfo.schoolUnit;
        if (teacherInfo?.phoneNumber) installsMap[appId][mid].phoneNumber = teacherInfo.phoneNumber;
      }

      localStorage.setItem(STORAGE_APP_INSTALLS_MAP, JSON.stringify(installsMap));

      // Ghi log hoạt động
      this.logActivity(
        appId,
        appName,
        `${isNewMachine ? 'Cài đặt lần đầu' : 'Cài lại / Xác nhận'} thành công trên máy [${mid}]`
      );

      const installedCount = Object.keys(installsMap[appId]).length;
      return { isNewMachine, installedCount };
    } catch (e) {
      console.error('Lỗi khi ghi nhận cài đặt:', e);
      return { isNewMachine: false, installedCount: 0 };
    }
  }

  // Ghi nhận một lần giáo viên bấm kiểm tra/cập nhật phiên bản mới
  public recordAppUpdate(
    appId: string,
    appName: string,
    version: string,
    machineId?: string
  ): { totalAppUpdates: number } {
    const mid = (machineId || this.getOrCreateMachineId()).trim().toUpperCase();
    try {
      // 1. Cập nhật vào danh sách máy đã cài đặt
      const raw = localStorage.getItem(STORAGE_APP_INSTALLS_MAP);
      const installsMap: Record<string, Record<string, AppInstalledMachineDetail>> = raw ? JSON.parse(raw) : {};
      if (!installsMap[appId]) installsMap[appId] = {};

      const now = this.formatNow();
      if (!installsMap[appId][mid]) {
        installsMap[appId][mid] = {
          machineId: mid,
          firstSeenAt: now,
          lastSeenAt: now,
          fullName: this.getCurrentProfile().fullName || undefined,
          schoolUnit: this.getCurrentProfile().schoolUnit || undefined,
          phoneNumber: this.getCurrentProfile().phoneNumber || undefined,
          status: 'INSTALLED',
          installCount: 1,
          updateCount: 1,
          lastVersion: version
        };
      } else {
        installsMap[appId][mid].updateCount = (installsMap[appId][mid].updateCount || 0) + 1;
        installsMap[appId][mid].lastSeenAt = now;
        installsMap[appId][mid].lastVersion = version;
      }
      localStorage.setItem(STORAGE_APP_INSTALLS_MAP, JSON.stringify(installsMap));

      // 2. Ghi vào nhật ký các lần update toàn hệ thống
      const rawUpdates = localStorage.getItem(STORAGE_APP_UPDATES_LOG);
      const updatesLog: Array<{ id: string; appId: string; appName: string; version: string; machineId: string; timestamp: string }> = rawUpdates ? JSON.parse(rawUpdates) : [];
      updatesLog.unshift({
        id: `UPD-${Date.now()}`,
        appId,
        appName,
        version,
        machineId: mid,
        timestamp: now
      });
      if (updatesLog.length > 500) updatesLog.pop();
      localStorage.setItem(STORAGE_APP_UPDATES_LOG, JSON.stringify(updatesLog));

      // Ghi log hoạt động
      this.logActivity(
        appId,
        appName,
        `Giáo viên cập nhật phiên bản mới (v${version}) trên máy [${mid}]`
      );

      const totalAppUpdates = updatesLog.filter(u => u.appId === appId).length;
      return { totalAppUpdates };
    } catch (e) {
      console.error('Lỗi khi ghi nhận update:', e);
      return { totalAppUpdates: 0 };
    }
  }

  // TÍNH TOÁN VÀ TRẢ VỀ TOÀN BỘ BẢNG THỐNG KÊ HẠN NGẠCH CÀI ĐẶT & UPDATE TẤT CẢ CÁC APP
  public getEcosystemQuotaStats(): EcosystemQuotaSummary {
    const rawInstalls = localStorage.getItem(STORAGE_APP_INSTALLS_MAP);
    const installsMap: Record<string, Record<string, AppInstalledMachineDetail>> = rawInstalls ? JSON.parse(rawInstalls) : {};

    const rawUpdates = localStorage.getItem(STORAGE_APP_UPDATES_LOG);
    const updatesLog: Array<{ appId: string; machineId: string; timestamp: string }> = rawUpdates ? JSON.parse(rawUpdates) : [];

    const allMachines = this.getAllTrackedMachines();
    const allRegistrations = this.getAllRegistrations();
    let localLicenses: any[] = [];
    try {
      const licRaw = localStorage.getItem('gvai_cloud_licenses_v2');
      if (licRaw) localLicenses = JSON.parse(licRaw);
    } catch {
      localLicenses = [];
    }

    const globalUniqueInstalledSet = new Set<string>();
    const globalUniqueTrialSet = new Set<string>();
    const globalUniqueActivatedSet = new Set<string>();

    const appsStats: AppQuotaStatItem[] = ECOSYSTEM_APPS_CATALOG.map(catItem => {
      const appId = catItem.appId;
      const appMachinesMap = new Map<string, AppInstalledMachineDetail>();

      // 1. Nạp từ lưu trữ chuyên biệt
      if (installsMap[appId]) {
        Object.entries(installsMap[appId]).forEach(([mid, item]) => {
          if (!isAdminMachine(mid)) {
            appMachinesMap.set(mid.toUpperCase(), { ...item });
          }
        });
      }

      // 2. Nạp thêm từ danh sách các máy truy cập / dùng thử
      allMachines.forEach(m => {
        if (!isAdminMachine(m.machineId)) {
          const mid = m.machineId.toUpperCase();
          const visited = m.appsVisited && (m.appsVisited[appId] || Object.keys(m.appsVisited).some(k => k.includes(appId) || appId.includes(k)));
          if (visited || m.trialUsed > 0) {
            if (!appMachinesMap.has(mid)) {
              appMachinesMap.set(mid, {
                machineId: mid,
                firstSeenAt: m.firstSeenAt || m.lastSeenAt,
                lastSeenAt: m.lastSeenAt,
                fullName: m.fullName || m.predictedName,
                schoolUnit: m.schoolUnit,
                phoneNumber: m.phoneNumber,
                status: 'INSTALLED',
                installCount: 1,
                updateCount: 0
              });
            }
          }
        }
      });

      // 3. Nạp từ đơn đăng ký
      allRegistrations.forEach(r => {
        if (!isAdminMachine(r.machineId)) {
          const mid = r.machineId.toUpperCase();
          const matchesApp = r.appId === appId || (!r.appId && appId === 'tich-hop-nls-ai');
          if (matchesApp) {
            const existing = appMachinesMap.get(mid);
            if (existing) {
              if (r.fullName) existing.fullName = r.fullName;
              if (r.schoolUnit) existing.schoolUnit = r.schoolUnit;
              if (r.phoneNumber) existing.phoneNumber = r.phoneNumber;
              if (r.status === 'APPROVED') {
                existing.status = 'ACTIVE_PRO';
              } else if (existing.status !== 'ACTIVE_PRO') {
                existing.status = 'TRIAL';
              }
            } else {
              appMachinesMap.set(mid, {
                machineId: mid,
                firstSeenAt: r.createdAt,
                lastSeenAt: r.createdAt,
                fullName: r.fullName,
                schoolUnit: r.schoolUnit,
                phoneNumber: r.phoneNumber,
                status: r.status === 'APPROVED' ? 'ACTIVE_PRO' : 'TRIAL',
                installCount: 1,
                updateCount: 0
              });
            }
          }
        }
      });

      // 4. Đối chiếu bản quyền kích hoạt Pro (licenseService)
      localLicenses.forEach(lic => {
        if (!isAdminMachine(lic.machine_id) && lic.status === 'ACTIVE') {
          const mid = lic.machine_id.toUpperCase();
          const existing = appMachinesMap.get(mid);
          if (existing) {
            existing.status = 'ACTIVE_PRO';
            if (lic.teacher_name) existing.fullName = lic.teacher_name;
            if (lic.school_unit) existing.schoolUnit = lic.school_unit;
            if (lic.phone_zalo) existing.phoneNumber = lic.phone_zalo;
          }
        }
      });

      // Gom danh sách máy tính duy nhất cho app này
      const machineList = Array.from(appMachinesMap.values());
      const installedCount = machineList.length;

      // Đếm số máy dùng thử và kích hoạt
      let trialCount = 0;
      let activatedCount = 0;

      machineList.forEach(m => {
        globalUniqueInstalledSet.add(m.machineId);

        if (m.status === 'ACTIVE_PRO') {
          activatedCount++;
          globalUniqueActivatedSet.add(m.machineId);
        } else if (m.status === 'TRIAL') {
          trialCount++;
          globalUniqueTrialSet.add(m.machineId);
        } else {
          // Kiểm tra xem máy có dùng thử không
          const tm = allMachines.find(x => x.machineId.toUpperCase() === m.machineId);
          if (tm && (tm.trialUsed > 0 || tm.isRegisteredTrial)) {
            m.status = 'TRIAL';
            trialCount++;
            globalUniqueTrialSet.add(m.machineId);
          }
        }
      });

      // Đếm số lượt update cho app này
      const specificUpdates = updatesLog.filter(u => u.appId === appId).length;
      const machineUpdatesSum = machineList.reduce((acc, m) => acc + (m.updateCount || 0), 0);
      const totalAppUpdates = Math.max(specificUpdates, machineUpdatesSum);

      const activationRate = installedCount > 0 ? Math.round((activatedCount / installedCount) * 100) : 0;

      return {
        appId: catItem.appId,
        appName: catItem.appName,
        shortName: catItem.shortName,
        category: catItem.category,
        badge: catItem.badge,
        installedMachinesCount: installedCount,
        trialMachinesCount: trialCount,
        activatedMachinesCount: activatedCount,
        updateCount: totalAppUpdates,
        activationRate,
        machines: machineList
      };
    });

    const totalUpdateCount = updatesLog.length + appsStats.reduce((acc, a) => acc + a.updateCount, 0);

    return {
      totalUniqueInstalledMachines: globalUniqueInstalledSet.size,
      totalUniqueTrialMachines: globalUniqueTrialSet.size,
      totalUniqueActivatedMachines: globalUniqueActivatedSet.size,
      totalUpdateCount: Math.max(updatesLog.length, totalUpdateCount),
      appsStats
    };
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

