/**
 * webSecurityGuard.ts
 * HỆ THỐNG GIÁM SÁT AN NINH, CẢNH BÁO XÂM NHẬP & CHỐNG PHÁ KHÓA TẤT CẢ CÁC APP TRÊN WEB
 * Tác giả: Tác giả Đinh Thành - ĐT: 0915.213717 – THCS Đồng Yên – Hotline/Zalo: 0915.213717
 */

import { cloudSyncService, SecurityAlertItem } from './cloudSyncService';
import { isAdminMachine } from './activityTrackingService';

export interface DeviceTelemetry {
  machineId: string;
  computerName: string;
  userName: string;
  osVersion: string;
  browser: string;
  ipAddress: string;
  location: string;
  detectedEmail: string;
  teacherGuess: string;
  schoolGuess: string;
  phoneGuess: string;
}

class WebSecurityGuard {
  private activeAppId: string = 'home';
  private activeAppName: string = 'Cổng Thông Tin Giáo Viên AI Toàn Năng';
  private cachedTelemetry: DeviceTelemetry | null = null;
  private failedKeyCount: Record<string, number> = {};
  private lastAlertTime: Record<string, number> = {};
  private isInitialized: boolean = false;
  private devtoolsOpenDetected: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  public setActiveApp(appId: string, appName: string) {
    this.activeAppId = appId;
    this.activeAppName = appName;
  }

  public getActiveApp() {
    return { id: this.activeAppId, name: this.activeAppName };
  }

  // Khởi tạo các tầng giám sát an ninh trên web
  public init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    // Lấy thông tin thiết bị và mạng ngầm
    this.collectTelemetry();

    // 1. Giám sát phím tắt can thiệp mã nguồn (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U)
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (this.isDevOrAdmin()) return;

      const isF12 = e.key === 'F12';
      const isDevShortcut = (e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key);
      const isViewSource = (e.ctrlKey || e.metaKey) && ['U', 'u', 'S', 's'].includes(e.key);

      if (isF12 || isDevShortcut || isViewSource) {
        e.preventDefault();
        e.stopPropagation();

        this.triggerAlert(
          'DEBUGGER',
          `Cố tình mở DevTools / Soi mã nguồn qua phím tắt (${e.key}) trên ứng dụng: ${this.activeAppName}`,
          'CRITICAL'
        );
      }
    }, true);

    // 2. Giám sát kích thước DevTools cửa sổ dock (Chỉ áp dụng khi F12/Inspect thực sự, loại trừ bot/mobile/co dãn màn hình)
    const ua = navigator.userAgent || '';
    const isBotOrCrawler = /bot|googlebot|crawler|spider|headless|amazon|slurp|lighthouse/i.test(ua);
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) || 
                           (typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1);

    if (!isMobileDevice && !isBotOrCrawler) {
      window.addEventListener('resize', () => {
        if (this.isDevOrAdmin()) return;
        // Chỉ ghi nhận nếu màn hình chuẩn PC (>1024px) và cửa sổ thu nhỏ đột ngột với chênh lệch siêu lớn (>320px)
        const widthDiff = window.outerWidth - window.innerWidth;
        const heightDiff = window.outerHeight - window.innerHeight;
        
        if (window.outerWidth > 1024 && (widthDiff > 320 || heightDiff > 320) && (!this.devtoolsOpenDetected)) {
          this.devtoolsOpenDetected = true;
          // Ghi nhận dạng MEDIUM nhẹ nhàng, không gây báo động nhầm
          this.triggerAlert(
            'DEBUGGER',
            `Phát hiện giao diện thay đổi kích thước lớn trên ứng dụng: ${this.activeAppName}`,
            'MEDIUM'
          );
        }
      });
    }

    // 3. Giám sát can thiệp trái phép vào LocalStorage (Bẻ khóa lượt dùng thử, sửa Key)
    this.watchStorageTampering();
  }

  private isDevOrAdmin(): boolean {
    if (typeof window === 'undefined') return true;
    const mid = localStorage.getItem('gvai_hardware_machine_id') || '';
    return (
      isAdminMachine(mid) ||
      localStorage.getItem('gvai_admin_logged_in') === 'true' ||
      localStorage.getItem('gvai_unlimited_machine') === 'true' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    );
  }

  // Thu thập dấu vết thiết bị và mạng Internet
  public async collectTelemetry(): Promise<DeviceTelemetry> {
    if (this.cachedTelemetry) return this.cachedTelemetry;

    const mid = localStorage.getItem('gvai_hardware_machine_id') || 
                localStorage.getItem('mathstudio_detected_hardware_code') || 
                localStorage.getItem('nls_detected_hardware_code') || 
                'WEB-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    // Suy đoán tên máy tính & hệ điều hành từ User Agent & Platform
    const ua = navigator.userAgent;
    let os = 'Windows PC';
    if (ua.includes('Windows NT 10.0')) os = 'Windows 10/11';
    else if (ua.includes('Windows NT 6.3')) os = 'Windows 8.1';
    else if (ua.includes('Windows NT 6.1')) os = 'Windows 7';
    else if (ua.includes('Macintosh')) os = 'macOS Apple';
    else if (ua.includes('Android')) os = 'Android Mobile';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS Device';

    let browser = 'Chrome/Edge';
    if (ua.includes('Edg/')) browser = 'Microsoft Edge';
    else if (ua.includes('Chrome/')) browser = 'Google Chrome';
    else if (ua.includes('Firefox/')) browser = 'Mozilla Firefox';
    else if (ua.includes('Safari/') && !ua.includes('Chrome/')) browser = 'Apple Safari';
    else if (ua.includes('CocCoc/')) browser = 'Cốc Cốc Browser';

    // Dự đoán Tên máy tính
    const screenRes = `${window.screen?.width || 1920}x${window.screen?.height || 1080}`;
    const compName = `${os.split(' ')[0]}_${screenRes}_${(navigator.hardwareConcurrency || 4)}Cores`;

    // Suy luận danh tính giáo viên từ profile hoặc các đơn đăng ký đã lưu
    let teacherGuess = '';
    let schoolGuess = '';
    let phoneGuess = '';
    let detectedEmail = '';

    try {
      const profileStr = localStorage.getItem('gvai_current_machine_profile');
      if (profileStr) {
        const p = JSON.parse(profileStr);
        if (p.fullName) teacherGuess = p.fullName;
        if (p.schoolUnit) schoolGuess = p.schoolUnit;
        if (p.phoneNumber) phoneGuess = p.phoneNumber;
      }
      
      // Tìm trong đơn đăng ký đã lưu
      if (!teacherGuess) {
        const regStr = localStorage.getItem('gvai_registration_requests');
        if (regStr) {
          const regs = JSON.parse(regStr);
          if (Array.isArray(regs) && regs.length > 0) {
            const found = regs.find((r: any) => r.machineId === mid || r.phoneNumber);
            if (found) {
              teacherGuess = found.fullName || '';
              schoolGuess = found.schoolUnit || '';
              phoneGuess = found.phoneNumber || '';
            }
          }
        }
      }

      // Tìm email nếu có trong input cache
      const storedEmail = localStorage.getItem('gvai_user_email') || localStorage.getItem('user_contact_email');
      if (storedEmail) detectedEmail = storedEmail;
    } catch {
      // Ignore
    }

    // Lấy thông tin IP và vị trí địa lý thực tế
    let ipAddress = 'Đang phân giải IP...';
    let location = 'Việt Nam';

    try {
      let fetchOpts: RequestInit = {};
      try {
        if (typeof AbortSignal !== 'undefined' && typeof (AbortSignal as any).timeout === 'function') {
          fetchOpts.signal = (AbortSignal as any).timeout(3000);
        }
      } catch {
        fetchOpts = {};
      }
      const res = await fetch('https://ipapi.co/json/', fetchOpts);
      if (res.ok) {
        const data = await res.json();
        ipAddress = data.ip || '';
        const city = data.city || '';
        const region = data.region || '';
        const org = data.org || '';
        location = `${city}${city && region ? ', ' : ''}${region} (${org})`;
      }
    } catch {
      try {
        let fetchOpts2: RequestInit = {};
        try {
          if (typeof AbortSignal !== 'undefined' && typeof (AbortSignal as any).timeout === 'function') {
            fetchOpts2.signal = (AbortSignal as any).timeout(2000);
          }
        } catch {
          fetchOpts2 = {};
        }
        const res2 = await fetch('https://api.ipify.org?format=json', fetchOpts2);
        if (res2.ok) {
          const d2 = await res2.json();
          ipAddress = d2.ip || '';
        }
      } catch {
        ipAddress = '14.232.180.89'; // Fallback
      }
    }

    this.cachedTelemetry = {
      machineId: mid,
      computerName: compName,
      userName: teacherGuess ? `GV_${teacherGuess.replace(/\s+/g, '_')}` : (navigator.platform || 'Client_PC'),
      osVersion: `${os} (${browser})`,
      browser,
      ipAddress,
      location,
      detectedEmail,
      teacherGuess,
      schoolGuess,
      phoneGuess
    };

    return this.cachedTelemetry;
  }

  // Giám sát can thiệp LocalStorage để phá khóa lượt dùng thử
  private watchStorageTampering() {
    if (typeof window === 'undefined' || !window.localStorage) return;

    try {
      const originalSetItem = localStorage.setItem.bind(localStorage);
      const originalRemoveItem = localStorage.removeItem.bind(localStorage);

      localStorage.setItem = (key: string, value: string) => {
        try {
          if (!this.isDevOrAdmin()) {
            // Nếu can thiệp vào các biến số lượt dùng thử hoặc bản quyền
            const sensitiveKeys = [
              'gvai_mathstudio_trial_remaining',
              'gvai_nls_trial_count',
              'gvai_taode_trial_count',
              'gvai_thcs8m_trial_count',
              'gvai_unlimited_machine',
              'gvai_blocked_machines'
            ];

            if (sensitiveKeys.includes(key)) {
              // Kiểm tra nếu người dùng tự ý set lượt dùng thử cao hơn quy định (> 5)
              const valNum = parseInt(value, 10);
              if (!isNaN(valNum) && valNum > 5) {
                this.triggerAlert(
                  'BINARY_TAMPER',
                  `Cố tình can thiệp LocalStorage key [${key}] thành [${value}] để gian lận lượt dùng thử trên app: ${this.activeAppName}`,
                  'CRITICAL'
                );
                return; // Chặn ghi đè
              }

              if (key === 'gvai_unlimited_machine' && value === 'true') {
                this.triggerAlert(
                  'BINARY_TAMPER',
                  `Cố tình tự phong quyền Master Admin (gvai_unlimited_machine=true) trên app: ${this.activeAppName}`,
                  'CRITICAL'
                );
                return;
              }
            }
          }
        } catch {
          // Bỏ qua lỗi giám sát
        }
        return originalSetItem(key, value);
      };

      localStorage.removeItem = (key: string) => {
        try {
          if (!this.isDevOrAdmin()) {
            if (key === 'gvai_blocked_machines' || key === 'gvai_blocked_list') {
              this.triggerAlert(
                'BINARY_TAMPER',
                `Cố tình xóa danh sách khóa máy tính [${key}] từ Console DevTools`,
                'CRITICAL'
              );
              return;
            }
          }
        } catch {
          // Bỏ qua lỗi giám sát
        }
        return originalRemoveItem(key);
      };
    } catch (e) {
      console.warn('[webSecurityGuard] Storage tampering monitor bypassed safely:', e);
    }
  }

  // Ghi nhận khi người dùng nhập sai Key nhiều lần liên tiếp (Brute-force crack key)
  public recordFailedKeyAttempt(appId: string, attemptedKey: string, machineCode: string) {
    if (this.isDevOrAdmin()) return;

    this.failedKeyCount[appId] = (this.failedKeyCount[appId] || 0) + 1;
    const count = this.failedKeyCount[appId];

    if (count >= 3) {
      this.triggerAlert(
        'FAKE_KEY',
        `Cố tình dò mật khẩu/Bẻ khóa Key bản quyền liên tiếp ${count} lần trên app [${this.activeAppName}]. Mã Key đã thử: "${attemptedKey.slice(0, 30)}..." | Mã máy: ${machineCode}`,
        'HIGH'
      );
    }
  }

  // Kích hoạt gửi cảnh báo lên Cloud và lưu nhật ký
  public async triggerAlert(
    tamperType: SecurityAlertItem['tamperType'],
    details: string,
    severity: SecurityAlertItem['severity'] = 'HIGH'
  ) {
    if (this.isDevOrAdmin()) return;

    // Giới hạn tần suất: Tối đa 1 cảnh báo mỗi loại mỗi 5 phút để tránh spam
    const alertKey = `${tamperType}_${this.activeAppId}`;
    const now = Date.now();
    if (this.lastAlertTime[alertKey] && now - this.lastAlertTime[alertKey] < 5 * 60 * 1000) {
      return;
    }
    this.lastAlertTime[alertKey] = now;

    // Thu thập telemetry
    const tel = await this.collectTelemetry();

    const alertData: Partial<SecurityAlertItem> = {
      machineId: tel.machineId,
      computerName: tel.computerName,
      userName: tel.userName,
      userDomain: `${this.activeAppName} (Web Online)`,
      osVersion: tel.osVersion,
      ipAddress: tel.ipAddress,
      location: tel.location,
      detectedEmail: tel.detectedEmail,
      teacherGuess: tel.teacherGuess,
      schoolGuess: tel.schoolGuess,
      phoneGuess: tel.phoneGuess,
      tamperType,
      tamperDetails: `[${this.activeAppName}] ${details}`,
      severity
    };

    console.warn(`[AN NINH GIÁO VIÊN AI] 🚨 Phát hiện hành vi xâm nhập (${tamperType}):`, details);

    // Gửi ngầm lên Cloud Issue của Thầy Thành
    try {
      await cloudSyncService.submitSecurityAlertToCloud(alertData);
    } catch {
      // Ignore
    }

    // Hiển thị thông báo răn đe vi phạm bản quyền nhẹ nhàng cho người dùng
    if (severity === 'CRITICAL') {
      alert(
        `⚠️ CẢNH BÁO AN NINH & BẢN QUYỀN HỆ THỐNG\n\n` +
        `Hệ thống vừa phát hiện hành vi can thiệp kỹ thuật trái phép vào ứng dụng "${this.activeAppName}".\n` +
        `Địa chỉ IP (${tel.ipAddress}), Thiết bị (${tel.computerName}) và Dấu vết vi phạm đã được tự động ghi nhận và chuyển tiếp về Quản trị viên: Tác giả Đinh Thành - ĐT: 0915.213717 (THCS Đồng Yên - Hotline: 0915.213717).\n\n` +
        `Quý Thầy/Cô vui lòng tôn trọng bản quyền sở hữu trí tuệ để tiếp tục sử dụng phần mềm!`
      );
    }
  }
}

export const webSecurityGuard = new WebSecurityGuard();
