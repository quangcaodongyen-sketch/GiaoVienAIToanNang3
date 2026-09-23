export interface AppVisitLog {
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
  registeredAt?: string;
  trialUsed: number;
  trialMax: number;
  isRegisteredTrial: boolean;
  lastSeenAt: string;
  firstSeenAt: string;
  ipAddress?: string;
  deviceInfo?: string;
  appsVisited: { [appId: string]: AppVisitLog };
  predictedName?: string;
}

const STORAGE_MACHINE_ID = 'gvai_machine_id_v2';
const STORAGE_CURRENT_PROFILE = 'gvai_current_machine_profile_v2';
const STORAGE_ALL_MACHINES = 'gvai_all_machines_tracking_v2';

// Danh sách dữ liệu mẫu đại diện cho các giáo viên các tỉnh thành đã truy cập
const DEFAULT_TRACKED_USERS: MachineProfile[] = [
  {
    machineId: 'GV-E10D-BE85',
    fullName: 'Cô Nguyễn Thị Mai',
    schoolUnit: 'Trường THCS Lê Quý Đôn',
    phoneNumber: '0988.123456',
    registeredAt: '2026-09-22 08:30:15',
    trialUsed: 5,
    trialMax: 5,
    isRegisteredTrial: true,
    lastSeenAt: '2026-09-23 11:20:00',
    firstSeenAt: '2026-09-22 08:30:15',
    deviceInfo: 'Windows 11 / Chrome 128 / Cốc Cốc',
    appsVisited: {
      'tao-de-toan': { appId: 'tao-de-toan', appName: 'Tạo Đề Toán THCS (CV 7991)', count: 4, lastVisit: '2026-09-23 11:20:00' },
      'tao-de-anh': { appId: 'tao-de-anh', appName: 'Tạo Đề Tiếng Anh (Global Success)', count: 3, lastVisit: '2026-09-23 10:45:10' },
      'chuan-hoa-nd30': { appId: 'chuan-hoa-nd30', appName: 'Chuẩn Hóa Văn Bản (NĐ 30/2020)', count: 2, lastVisit: '2026-09-22 14:15:00' }
    }
  },
  {
    machineId: 'GV-8F22-A109',
    fullName: 'Thầy Trần Văn Tuấn',
    schoolUnit: 'Trường THCS Đồng Yên',
    phoneNumber: '0977.654321',
    registeredAt: '2026-09-23 07:15:20',
    trialUsed: 2,
    trialMax: 5,
    isRegisteredTrial: true,
    lastSeenAt: '2026-09-23 12:45:30',
    firstSeenAt: '2026-09-23 07:15:20',
    deviceInfo: 'Windows 10 / Edge 127',
    appsVisited: {
      'tao-de-khtn': { appId: 'tao-de-khtn', appName: 'Tạo Đề KHTN (Lý-Hóa-Sinh CV 7991)', count: 5, lastVisit: '2026-09-23 12:45:30' },
      'soan-giao-an-5512': { appId: 'soan-giao-an-5512', appName: 'Soạn Kế Hoạch Bài Dạy 5512', count: 3, lastVisit: '2026-09-23 09:12:00' }
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
    lastSeenAt: '2026-09-23 13:02:18',
    firstSeenAt: '2026-09-23 12:50:00',
    deviceInfo: 'Windows 11 / Cốc Cốc 125',
    appsVisited: {
      'tao-de-anh': { appId: 'tao-de-anh', appName: 'Tạo Đề Tiếng Anh (Global Success)', count: 2, lastVisit: '2026-09-23 13:02:18' }
    }
  }
];

class ActivityTrackingService {
  // Lấy hoặc sinh Machine ID duy nhất cố định cho trình duyệt/máy tính này
  public getOrCreateMachineId(): string {
    let mid = localStorage.getItem(STORAGE_MACHINE_ID);
    if (!mid) {
      // Tạo chuỗi dạng GV-XXXX-XXXX
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

    // Nếu chưa có, tạo hồ sơ mặc định
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
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
  private saveCurrentProfile(profile: MachineProfile) {
    localStorage.setItem(STORAGE_CURRENT_PROFILE, JSON.stringify(profile));
    this.syncToGlobalList(profile);
  }

  // Đăng ký dùng thử 5 lần (Họ tên, trường, sđt)
  public registerTrial(payload: {
    fullName: string;
    schoolUnit: string;
    phoneNumber: string;
  }): { success: boolean; message: string; profile: MachineProfile } {
    const profile = this.getCurrentProfile();
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    profile.fullName = payload.fullName.trim();
    profile.schoolUnit = payload.schoolUnit.trim();
    profile.phoneNumber = payload.phoneNumber.trim();
    profile.isRegisteredTrial = true;
    profile.registeredAt = now;
    profile.lastSeenAt = now;
    // Đảm bảo có đủ 5 lượt dùng thử
    profile.trialMax = 5;

    this.saveCurrentProfile(profile);
    return {
      success: true,
      message: `Đăng ký thành công! Máy tính ${profile.machineId} được cấp 5 lượt dùng thử toàn diện.`,
      profile
    };
  }

  // Sử dụng 1 lượt dùng thử
  public consumeTrial(appId: string, appName: string): { allowed: boolean; remaining: number; message: string } {
    const profile = this.getCurrentProfile();
    const remaining = Math.max(0, profile.trialMax - profile.trialUsed);

    if (remaining <= 0) {
      return {
        allowed: false,
        remaining: 0,
        message: 'Thầy/Cô đã dùng hết 5 lượt dùng thử miễn phí. Vui lòng đăng ký bản quyền để tiếp tục sử dụng!'
      };
    }

    profile.trialUsed += 1;
    this.trackAppVisit(appId, appName);
    this.saveCurrentProfile(profile);

    const newRemaining = Math.max(0, profile.trialMax - profile.trialUsed);
    return {
      allowed: true,
      remaining: newRemaining,
      message: `Đã sử dụng 1 lượt thử. Thầy/Cô còn ${newRemaining} lượt thử miễn phí.`
    };
  }

  // Ghi nhận truy cập app
  public trackAppVisit(appId: string, appName: string): void {
    const profile = this.getCurrentProfile();
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

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

    // Đảm bảo máy hiện tại luôn có trong danh sách
    const currentMid = this.getOrCreateMachineId();
    if (!list.some(m => m.machineId === currentMid)) {
      list.unshift(this.getCurrentProfile());
    }

    // Tính toán dự đoán tên người dùng
    return list.map(m => {
      let predicted = m.fullName;
      if (!predicted || predicted.trim() === '') {
        // Thuật toán dự đoán thông minh:
        if (m.schoolUnit) {
          predicted = `Giáo viên ${m.schoolUnit}`;
        } else if (m.phoneNumber) {
          predicted = `Khách hàng Zalo ${m.phoneNumber}`;
        } else {
          // Dự đoán theo app hay vào nhất
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
}

export const activityTrackingService = new ActivityTrackingService();
