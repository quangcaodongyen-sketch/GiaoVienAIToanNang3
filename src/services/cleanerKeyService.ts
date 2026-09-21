// ============================================================================
// DỊCH VỤ QUẢN LÝ BẢN QUYỀN & MẬT MÃ ĐINH THÀNH CLEANER PRO v4.5 VIP
// Tác giả: Thầy giáo Đinh Văn Thành – THCS Đồng Yên – ĐT/Zalo: 0915.213717
// Thuật toán: SHA-256 Hardware Binding tương thích 100% với Tao_Key_Ban_Quyen.py
// Bảo mật: Bảo vệ nhiều tầng lớp (Hardware Lock, Anti-Tamper Trial Storage, SHA-256 Signature)
// ============================================================================

const SECRET_SALT = "DINH_THANH_VIP_SECRET_KEY_2026_0915213717_CLEANER_SECURITY";
const TRIAL_SEC_SALT = "DVT_ANTI_TAMPER_TRIAL_CLEANER_2026";
const STORAGE_SEC_TRIAL = "gvai_cleaner_sec_trials_v1";
const STORAGE_BACKUP_HASH = "_sys_hw_cleaner_hash";
const STORAGE_VIP_LICENSE = "gvai_cleaner_vip_license";

export interface CleanerVerifyResult {
  isValid: boolean;
  packageType?: '1year' | '2year' | 'lifetime';
  packageName?: string;
  expiryDateStr?: string;
  daysRemaining?: number;
  message?: string;
}

/**
 * Sinh chuỗi SHA-256 Hex bằng Web Crypto API
 */
async function sha256Hex(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

/**
 * Lấy hoặc khởi tạo Mã máy tính Hardware Code chuẩn thương hiệu Thầy Đinh Thành
 * Định dạng: DT-XXXX-XXXX-XXXX
 */
export function getOrCreateCleanerHardwareCode(): string {
  if (typeof window === 'undefined') return 'DT-8899-A1B2-C3D4';

  const STORAGE_KEY = 'gvai_cleaner_hardware_code';
  let code = localStorage.getItem(STORAGE_KEY);
  if (code && code.startsWith('DT-') && code.length >= 16) {
    return code;
  }

  // Thu thập dấu vân tay phần cứng trình duyệt nhiều tầng lớp
  const screenPart = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
  const corePart = `${navigator.hardwareConcurrency || 4}-${navigator.platform || 'Win32'}`;
  const rawSeed = `CLEANER-${screenPart}-${corePart}-${navigator.userAgent}`;

  let hash = 0;
  for (let i = 0; i < rawSeed.length; i++) {
    hash = (hash << 5) - hash + rawSeed.charCodeAt(i);
    hash |= 0;
  }

  const hex1 = Math.abs(hash).toString(16).toUpperCase().padStart(4, '0').slice(-4);
  const hex2 = Math.abs((hash * 37) | 0).toString(16).toUpperCase().padStart(4, '0').slice(-4);
  const hex3 = Math.abs((hash * 97) | 0).toString(16).toUpperCase().padStart(4, '0').slice(-4);
  code = `DT-${hex1}-${hex2}-${hex3}`;
  localStorage.setItem(STORAGE_KEY, code);
  return code;
}

/**
 * Tạo chữ ký bảo vệ số lần dùng thử chống can thiệp LocalStorage
 */
async function generateTrialChecksum(remaining: number, hwid: string): Promise<string> {
  const raw = `${TRIAL_SEC_SALT}::REM:${remaining}::HWID:${hwid}`;
  return sha256Hex(raw);
}

/**
 * Lấy số lượt dùng thử còn lại (Tối đa 5 lượt, có xác thực chữ ký số chống hack)
 */
export async function getSecureCleanerTrialRemaining(): Promise<number> {
  if (typeof window === 'undefined') return 5;

  // Nếu đã kích hoạt VIP vĩnh viễn
  if (isCleanerVIPActivated()) {
    return 999;
  }

  const hwid = getOrCreateCleanerHardwareCode();
  const rawStored = localStorage.getItem(STORAGE_SEC_TRIAL);
  const storedHash = localStorage.getItem(STORAGE_BACKUP_HASH);

  if (rawStored === null || storedHash === null) {
    const defaultTrials = 5;
    const initialHash = await generateTrialChecksum(defaultTrials, hwid);
    localStorage.setItem(STORAGE_SEC_TRIAL, defaultTrials.toString());
    localStorage.setItem(STORAGE_BACKUP_HASH, initialHash);
    return defaultTrials;
  }

  const trials = parseInt(rawStored, 10);
  if (isNaN(trials) || trials < 0 || trials > 5) {
    // Phát hiện gian lận -> Khóa ngay về 0
    localStorage.setItem(STORAGE_SEC_TRIAL, '0');
    return 0;
  }

  const expectedHash = await generateTrialChecksum(trials, hwid);
  if (expectedHash !== storedHash) {
    // Chữ ký không khớp (đã bị can thiệp bộ nhớ) -> Khóa ngay về 0
    localStorage.setItem(STORAGE_SEC_TRIAL, '0');
    return 0;
  }

  return trials;
}

/**
 * Trừ 1 lượt dùng thử an toàn và cập nhật chữ ký số
 */
export async function consumeSecureCleanerTrial(): Promise<number> {
  if (typeof window === 'undefined') return 0;
  if (isCleanerVIPActivated()) return 999;

  const current = await getSecureCleanerTrialRemaining();
  if (current <= 0) return 0;

  const nextTrials = current - 1;
  const hwid = getOrCreateCleanerHardwareCode();
  const newHash = await generateTrialChecksum(nextTrials, hwid);

  localStorage.setItem(STORAGE_SEC_TRIAL, nextTrials.toString());
  localStorage.setItem(STORAGE_BACKUP_HASH, newHash);
  return nextTrials;
}

/**
 * Kiểm tra xem máy đã kích hoạt bản quyền VIP chưa
 */
export function isCleanerVIPActivated(): boolean {
  if (typeof window === 'undefined') return false;
  const key = localStorage.getItem(STORAGE_VIP_LICENSE);
  return Boolean(key && key.startsWith('PRO-'));
}

/**
 * Sinh mã bản quyền VIP theo thuật toán của Thầy Đinh Văn Thành
 * Tương thích 100% với Tao_Key_Ban_Quyen.py
 */
export async function generateCleanerLicenseKey(
  machineId: string,
  pkgType: '1year' | '2year' | 'lifetime' = 'lifetime'
): Promise<string> {
  const cleanId = machineId.trim().toUpperCase();
  let tag = 'LIFETIME_VIP_50K';
  if (pkgType === '1year') tag = '1YEAR_30K';
  else if (pkgType === '2year') tag = '2YEAR_40K';

  const token = `${cleanId}::${SECRET_SALT}::${tag}`;
  const h = await sha256Hex(token);
  return `PRO-${h.slice(0, 4)}-${h.slice(4, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}`;
}

/**
 * Xác thực mã bản quyền VIP
 */
export async function verifyCleanerLicenseKey(
  key: string,
  machineId: string
): Promise<CleanerVerifyResult> {
  const cleanKey = key.trim().toUpperCase();
  const cleanHwid = machineId.trim().toUpperCase();

  if (!cleanKey || !cleanHwid) {
    return { isValid: false, message: 'Vui lòng nhập đầy đủ mã máy và mã bản quyền!' };
  }

  // 1. Kiểm tra gói trọn đời VIP 50k (Thuật toán chính thức)
  const expectedLifetime = await generateCleanerLicenseKey(cleanHwid, 'lifetime');
  if (cleanKey === expectedLifetime) {
    return {
      isValid: true,
      packageType: 'lifetime',
      packageName: 'BẢN QUYỀN VIP TRỌN ĐỜI (50.000đ)',
      expiryDateStr: 'Vĩnh viễn không giới hạn thời gian',
      message: 'Kích hoạt thành công Gói VIP Trọn Đời! Đã mở khóa 100% công suất dọn dẹp.'
    };
  }

  // 2. Kiểm tra gói 2 năm
  const expected2Year = await generateCleanerLicenseKey(cleanHwid, '2year');
  if (cleanKey === expected2Year) {
    return {
      isValid: true,
      packageType: '2year',
      packageName: 'GÓI BẢN QUYỀN 2 NĂM (40.000đ)',
      expiryDateStr: 'Thời hạn sử dụng: 730 ngày',
      message: 'Kích hoạt thành công Gói 2 Năm! Đã mở khóa 100% công suất dọn dẹp.'
    };
  }

  // 3. Kiểm tra gói 1 năm
  const expected1Year = await generateCleanerLicenseKey(cleanHwid, '1year');
  if (cleanKey === expected1Year) {
    return {
      isValid: true,
      packageType: '1year',
      packageName: 'GÓI BẢN QUYỀN 1 NĂM (30.000đ)',
      expiryDateStr: 'Thời hạn sử dụng: 365 ngày',
      message: 'Kích hoạt thành công Gói 1 Năm! Đã mở khóa 100% công suất dọn dẹp.'
    };
  }

  return {
    isValid: false,
    message: 'Mã bản quyền không hợp lệ hoặc không khớp với mã máy này!'
  };
}

/**
 * Kích hoạt bản quyền VIP và lưu vào LocalStorage
 */
export async function activateCleanerLicense(
  key: string,
  machineId: string
): Promise<{ success: boolean; message: string; packageName?: string }> {
  const result = await verifyCleanerLicenseKey(key, machineId);
  if (result.isValid) {
    localStorage.setItem(STORAGE_VIP_LICENSE, key.trim().toUpperCase());
    return {
      success: true,
      message: result.message || 'Kích hoạt VIP thành công!',
      packageName: result.packageName
    };
  }
  return {
    success: false,
    message: result.message || 'Mã kích hoạt không hợp lệ!'
  };
}
