// ============================================================================
// DỊCH VỤ QUẢN LÝ BẢN QUYỀN & MẬT MÃ TẠO ĐỀ TIẾNG VIỆT TIỂU HỌC PRO (LỚP 1-5)
// Tác giả Đinh Thành, ĐT: 0915.213717  – Hotline/Zalo: 0915.213717
// ============================================================================

const SECRET_SALT = "THANH_DONG_YEN_0915213717_TVTH_PRO_2026";
const STORAGE_SEC_TRIAL = "gvai_taodetvth_trial_remaining";

export interface ExamTVTHVerifyResult {
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
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  }
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    hash = (hash << 5) - hash + message.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).toUpperCase().padStart(16, '0');
}

/**
 * Lấy hoặc khởi tạo Mã máy tính Hardware Code chuẩn thương hiệu Tác giả Đinh Thành
 * Định dạng: DVT-TVTH-XXXX-XXXX
 */
export function getOrCreateExamTVTHHardwareCode(): string {
  if (typeof window === 'undefined') return 'DVT-TVTH-8899-AABB';

  const STORAGE_KEY = 'gvai_taodetvth_hardware_code';
  let code = localStorage.getItem(STORAGE_KEY);
  if (code && code.startsWith('DVT-TVTH-')) {
    return code;
  }

  const screenPart = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
  const corePart = `${navigator.hardwareConcurrency || 4}-${navigator.platform || 'Win32'}`;
  const rawSeed = `TVTH-${screenPart}-${corePart}-${navigator.userAgent}`;

  let hash = 0;
  for (let i = 0; i < rawSeed.length; i++) {
    hash = (hash << 5) - hash + rawSeed.charCodeAt(i);
    hash |= 0;
  }

  const hex1 = Math.abs(hash).toString(16).toUpperCase().padStart(4, '0').slice(-4);
  const hex2 = Math.abs((hash * 37) | 0).toString(16).toUpperCase().padStart(4, '0').slice(-4);
  code = `DVT-TVTH-${hex1}-${hex2}`;
  localStorage.setItem(STORAGE_KEY, code);
  return code;
}

/**
 * Thuật toán sinh Key bản quyền chuẩn cho Thầy Thành cấp cho khách
 * Cấu trúc Key: KEY-TVTH-[GÓI]-[EXP]-[SIGNATURE_12_KÝ_TỰ]
 */
export async function generateExamTVTHLicenseKey(
  hardwareCode: string,
  packageType: '1year' | '2year' | 'lifetime' = 'lifetime',
  customExpDate?: string
): Promise<string> {
  const cleanMid = hardwareCode.trim().toUpperCase();
  let expStr = '99991231';
  let pkgCode = 'LIFE';

  if (packageType === '1year') {
    pkgCode = '1Y';
    const now = new Date();
    now.setFullYear(now.getFullYear() + 1);
    expStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  } else if (packageType === '2year') {
    pkgCode = '2Y';
    const now = new Date();
    now.setFullYear(now.getFullYear() + 2);
    expStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  }

  if (customExpDate) {
    expStr = customExpDate.replace(/-/g, '');
  }

  const rawData = `${cleanMid}|${pkgCode}|${expStr}|${SECRET_SALT}`;
  const fullHash = await sha256Hex(rawData);
  const sig = fullHash.slice(0, 12);

  return `KEY-TVTH-${pkgCode}-${expStr}-${sig}`;
}

/**
 * Kiểm tra tính hợp lệ của Key bản quyền Tiếng Việt Tiểu Học
 */
export async function verifyExamTVTHLicenseKey(
  hardwareCode: string,
  licenseKey: string
): Promise<ExamTVTHVerifyResult> {
  if (!licenseKey || !licenseKey.startsWith('KEY-TVTH-')) {
    return { isValid: false, message: 'Định dạng mã bản quyền Tiếng Việt Tiểu Học không đúng!' };
  }

  const parts = licenseKey.trim().toUpperCase().split('-');
  if (parts.length < 5) {
    return { isValid: false, message: 'Cấu trúc mã bản quyền không hợp lệ!' };
  }

  const pkgCode = parts[2];
  const expStr = parts[3];
  const inputSig = parts[4];

  const cleanMid = hardwareCode.trim().toUpperCase();
  const rawData = `${cleanMid}|${pkgCode}|${expStr}|${SECRET_SALT}`;
  const fullHash = await sha256Hex(rawData);
  const expectedSig = fullHash.slice(0, 12);

  if (inputSig !== expectedSig) {
    return { isValid: false, message: 'Mã bản quyền không khớp với Mã máy tính này!' };
  }

  if (expStr !== '99991231') {
    const year = parseInt(expStr.slice(0, 4));
    const month = parseInt(expStr.slice(4, 6)) - 1;
    const day = parseInt(expStr.slice(6, 8));
    const expDate = new Date(year, month, day, 23, 59, 59);
    const now = new Date();

    if (now > expDate) {
      return { isValid: false, message: 'Mã bản quyền đã hết hạn sử dụng!' };
    }

    const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
    return {
      isValid: true,
      packageType: pkgCode === '1Y' ? '1year' : '2year',
      packageName: pkgCode === '1Y' ? 'Gói Bản Quyền 1 Năm' : 'Gói Bản Quyền 2 Năm',
      expiryDateStr: `${day}/${month + 1}/${year}`,
      daysRemaining: diffDays,
      message: `Đã kích hoạt bản quyền Pro! Còn ${diffDays} ngày sử dụng.`
    };
  }

  return {
    isValid: true,
    packageType: 'lifetime',
    packageName: 'Gói VIP Trọn Đời (Khuyên Dùng)',
    expiryDateStr: 'Vĩnh viễn',
    daysRemaining: 99999,
    message: 'Đã kích hoạt Gói VIP Trọn Đời vĩnh viễn!'
  };
}

/**
 * Quản lý số lần dùng thử (Default: 5 lần)
 */
export function getExamTVTHTrialRemaining(): number {
  if (typeof window === 'undefined') return 5;
  const val = localStorage.getItem(STORAGE_SEC_TRIAL);
  if (val === null) {
    localStorage.setItem(STORAGE_SEC_TRIAL, '5');
    return 5;
  }
  return parseInt(val, 10);
}

export function decrementExamTVTHTrial(): number {
  const current = getExamTVTHTrialRemaining();
  const next = Math.max(0, current - 1);
  localStorage.setItem(STORAGE_SEC_TRIAL, next.toString());
  return next;
}
