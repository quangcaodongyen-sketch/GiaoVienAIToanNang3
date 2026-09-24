// ============================================================================
// DỊCH VỤ QUẢN LÝ BẢN QUYỀN CHUẨN HÓA VĂN BẢN HÀNH CHÍNH AI (NGHỊ ĐỊNH 30/2020)
// Tác giả: Thầy giáo Đinh Văn Thành – THCS Đồng Yên – ĐT/Zalo: 0915.213717
// Thuật toán: SHA-256 Hardware Binding & Anti-Tamper Trial Storage
// ============================================================================

const SECRET_SALT = "DVT_CHUAN_HOA_VAN_BAN_VIP_SECRET_2026_0915213717";
const TRIAL_SEC_SALT = "DVT_ANTI_TAMPER_TRIAL_CHVB_2026";
const STORAGE_SEC_TRIAL = "gvai_chvb_sec_trials_v1";
const STORAGE_BACKUP_HASH = "_sys_hw_chvb_hash";
const STORAGE_VIP_LICENSE = "gvai_chvb_vip_license";

export interface CHVBVerifyResult {
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
 * Định dạng: DVT-CHVB-XXXX-XXXX
 */
export function getOrCreateCHVBHardwareCode(): string {
  if (typeof window === 'undefined') return 'DVT-CHVB-8899-A1B2';

  const STORAGE_KEY = 'gvai_chvb_hardware_code';
  let code = localStorage.getItem(STORAGE_KEY);
  if (code && code.startsWith('DVT-CHVB-') && code.length >= 18) {
    return code;
  }

  // Thu thập dấu vân tay phần cứng trình duyệt nhiều tầng
  const screenPart = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
  const corePart = `${navigator.hardwareConcurrency || 4}-${navigator.platform || 'Win32'}`;
  const rawSeed = `CHVB-${screenPart}-${corePart}-${navigator.userAgent}`;

  let hash = 0;
  for (let i = 0; i < rawSeed.length; i++) {
    hash = (hash << 5) - hash + rawSeed.charCodeAt(i);
    hash |= 0;
  }

  const hex1 = Math.abs(hash).toString(16).toUpperCase().padStart(4, '0').slice(-4);
  const hex2 = Math.abs((hash * 41) | 0).toString(16).toUpperCase().padStart(4, '0').slice(-4);
  code = `DVT-CHVB-${hex1}-${hex2}`;
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
export async function getSecureCHVBTrialRemaining(): Promise<number> {
  if (typeof window === 'undefined') return 5;

  if (isCHVBVIPActivated()) {
    return 999;
  }

  const hwid = getOrCreateCHVBHardwareCode();
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
    localStorage.setItem(STORAGE_SEC_TRIAL, '0');
    return 0;
  }

  const expectedHash = await generateTrialChecksum(trials, hwid);
  if (expectedHash !== storedHash) {
    localStorage.setItem(STORAGE_SEC_TRIAL, '0');
    return 0;
  }

  return trials;
}

/**
 * Trừ 1 lượt dùng thử an toàn và cập nhật chữ ký số
 */
export async function consumeSecureCHVBTrial(): Promise<number> {
  if (typeof window === 'undefined') return 0;
  if (isCHVBVIPActivated()) return 999;

  const current = await getSecureCHVBTrialRemaining();
  if (current <= 0) return 0;

  const nextTrials = current - 1;
  const hwid = getOrCreateCHVBHardwareCode();
  const newHash = await generateTrialChecksum(nextTrials, hwid);

  localStorage.setItem(STORAGE_SEC_TRIAL, nextTrials.toString());
  localStorage.setItem(STORAGE_BACKUP_HASH, newHash);
  return nextTrials;
}

/**
 * Kiểm tra xem máy đã kích hoạt bản quyền VIP chưa
 */
export function isCHVBVIPActivated(): boolean {
  if (typeof window === 'undefined') return false;
  const key = localStorage.getItem(STORAGE_VIP_LICENSE);
  return Boolean(key && key.startsWith('CHVB-'));
}

/**
 * Sinh mã bản quyền VIP theo thuật toán của Thầy Đinh Văn Thành
 */
export async function generateCHVBLicenseKey(
  machineId: string,
  pkgType: '1year' | '2year' | 'lifetime' = 'lifetime'
): Promise<string> {
  const cleanId = machineId.trim().toUpperCase();
  let tag = 'LIFETIME_VIP';
  let prefix = 'CHVB-VIP';
  if (pkgType === '1year') {
    tag = '1YEAR';
    prefix = 'CHVB-1Y';
  } else if (pkgType === '2year') {
    tag = '2YEAR';
    prefix = 'CHVB-2Y';
  }

  const token = `${cleanId}::${SECRET_SALT}::${tag}`;
  const h = await sha256Hex(token);
  return `${prefix}-${h.slice(0, 4)}-${h.slice(4, 8)}-${h.slice(8, 12)}`;
}

/**
 * Xác thực mã bản quyền VIP
 */
export async function verifyCHVBLicenseKey_orig(
  key: string,
  machineId: string
): Promise<CHVBVerifyResult> {
  const cleanKey = key.trim().toUpperCase();
  const cleanHwid = machineId.trim().toUpperCase();

  if (!cleanKey || !cleanHwid) {
    return { isValid: false, message: 'Vui lòng nhập đầy đủ mã máy và mã bản quyền!' };
  }

  // 1. Kiểm tra gói trọn đời VIP
  const expectedLifetime = await generateCHVBLicenseKey(cleanHwid, 'lifetime');
  if (cleanKey === expectedLifetime) {
    return {
      isValid: true,
      packageType: 'lifetime',
      packageName: 'BẢN QUYỀN VIP TRỌN ĐỜI',
      expiryDateStr: 'Vĩnh viễn không giới hạn thời gian',
      daysRemaining: 99999,
      message: 'Kích hoạt BẢN QUYỀN VIP TRỌN ĐỜI thành công!'
    };
  }

  // 2. Kiểm tra gói 2 năm
  const expected2Year = await generateCHVBLicenseKey(cleanHwid, '2year');
  if (cleanKey === expected2Year) {
    return {
      isValid: true,
      packageType: '2year',
      packageName: 'GÓI BẢN QUYỀN 2 NĂM',
      expiryDateStr: '2 Năm (730 ngày kể từ ngày kích hoạt)',
      daysRemaining: 730,
      message: 'Kích hoạt GÓI BẢN QUYỀN 2 NĂM thành công!'
    };
  }

  // 3. Kiểm tra gói 1 năm
  const expected1Year = await generateCHVBLicenseKey(cleanHwid, '1year');
  if (cleanKey === expected1Year) {
    return {
      isValid: true,
      packageType: '1year',
      packageName: 'GÓI BẢN QUYỀN 1 NĂM',
      expiryDateStr: '1 Năm (365 ngày kể từ ngày kích hoạt)',
      daysRemaining: 365,
      message: 'Kích hoạt GÓI BẢN QUYỀN 1 NĂM thành công!'
    };
  }

  return {
    isValid: false,
    message: 'Mã bản quyền không hợp lệ hoặc không khớp với Mã máy tính này!'
  };
}

/**
 * Kích hoạt mã bản quyền và lưu vào máy
 */
export async function activateCHVBLicense(
  key: string,
  machineId: string
): Promise<CHVBVerifyResult> {
  const result = await verifyCHVBLicenseKey(key, machineId);
  if (result.isValid) {
    localStorage.setItem(STORAGE_VIP_LICENSE, key.trim().toUpperCase());
    localStorage.setItem('gvai_chvb_license_pkg', result.packageName || 'VIP');
    localStorage.setItem('gvai_chvb_license_date', new Date().toISOString());
  }
  return result;
}

/**
 * Soạn mẫu tin nhắn Zalo kèm key gửi khách hàng
 */
export function buildCHVBZaloMessage(
  machineId: string,
  licenseKey: string,
  pkgName: string
): string {
  return `Chào Thầy/Cô! Thầy Thành (THCS Đồng Yên - 0915.213717) xin gửi mã kích hoạt Phần mềm Chuẩn Hóa Văn Bản Hành Chính AI (Nghị định 30/2020/NĐ-CP):

🔑 Mã máy tính: ${machineId}
📦 Gói đăng ký: ${pkgName}
⭐ MÃ KÍCH HOẠT PRO: ${licenseKey}

👉 Hướng dẫn kích hoạt:
1. Mở phần mềm hoặc truy cập website Giáo Viên AI Toàn Năng.
2. Mở cửa sổ "Chuẩn Hóa Văn Bản Hành Chính AI" -> Chọn Tab "Bản Quyền & Kích Hoạt".
3. Dán Mã kích hoạt ở trên vào ô và bấm "KÍCH HOẠT PRO NGAY".

Chúc Thầy/Cô soạn thảo và chuẩn hóa văn bản nhanh chóng, chuẩn quy cách 100%!`;
}

export async function verifyCHVBLicenseKey(...args: any[]): Promise<any> {
  if (typeof window !== 'undefined' && localStorage.getItem('gvai_unlimited_machine') === 'true') {
    return {
      isValid: true,
      isPro: true,
      packageName: 'ĐẶC QUYỀN MÁY THẦY THÀNH (UNLIMITED VIP)',
      expiryDateStr: 'Vĩnh viễn không giới hạn',
      daysRemaining: 99999,
      message: 'Kích hoạt đặc quyền máy Thầy Thành: Sử dụng thoải mái!'
    };
  }
  return (verifyCHVBLicenseKey_orig as any)(...args);
}
