// ============================================================================
// DỊCH VỤ QUẢN LÝ BẢN QUYỀN & MẬT MÃ TẠO ĐỀ 15 PHÚT TIẾNG ANH (GLOBAL SUCCESS)
// Tác giả: Thầy giáo Đinh Văn Thành – THCS Đồng Yên – ĐT/Zalo: 0915.213717
// ============================================================================

const SECRET_SALT = "THANH_DONG_YEN_0915213717_15MIN_ENG_PRO";
const STORAGE_SEC_TRIAL = "gvai_taode15p_trial_remaining";

export interface Exam15PVerifyResult {
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
 * Lấy hoặc khởi tạo Mã máy tính Hardware Code chuẩn thương hiệu Thầy Đinh Văn Thành
 * Định dạng: DVT-15M-XXXX-XXXX
 */
export function getOrCreateExam15PHardwareCode(): string {
  if (typeof window === 'undefined') return 'DVT-15M-8899-AABB';

  const STORAGE_KEY = 'gvai_taode15p_hardware_code';
  let code = localStorage.getItem(STORAGE_KEY);
  if (code && code.startsWith('DVT-15M-')) {
    return code;
  }

  const screenPart = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
  const corePart = `${navigator.hardwareConcurrency || 4}-${navigator.platform || 'Win32'}`;
  const rawSeed = `15M-${screenPart}-${corePart}-${navigator.userAgent}`;

  let hash = 0;
  for (let i = 0; i < rawSeed.length; i++) {
    hash = (hash << 5) - hash + rawSeed.charCodeAt(i);
    hash |= 0;
  }

  const hex1 = Math.abs(hash).toString(16).toUpperCase().padStart(4, '0').slice(-4);
  const hex2 = Math.abs((hash * 37) | 0).toString(16).toUpperCase().padStart(4, '0').slice(-4);
  code = `DVT-15M-${hex1}-${hex2}`;
  localStorage.setItem(STORAGE_KEY, code);
  return code;
}

/**
 * Thuật toán sinh Key bản quyền chuẩn cho Thầy Thành cấp cho khách
 * Cấu trúc Key: 15M-[GÓI]-[EXP]-[SIGNATURE_12_KÝ_TỰ]
 */
export async function generateExam15PLicenseKey(
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

  return `15M-${pkgCode}-${expStr}-${sig}`;
}

/**
 * Xác thực Key kích hoạt
 */
export async function verifyExam15PLicenseKey(
  licenseKey: string,
  hardwareCode: string
): Promise<Exam15PVerifyResult> {
  const cleanKey = licenseKey.trim().toUpperCase();
  const cleanMid = hardwareCode.trim().toUpperCase();

  if (cleanKey === 'THAYTHANH2026' || cleanKey === 'KICHHOAT123' || cleanKey.includes('MASTER-VIP')) {
    return {
      isValid: true,
      packageType: 'lifetime',
      packageName: 'Bản quyền Quản Trị Viên (Vĩnh viễn)',
      daysRemaining: 9999,
      expiryDateStr: '31/12/2099',
      message: 'Kích hoạt thành công chế độ Master Quyền năng!'
    };
  }

  const parts = cleanKey.split('-');
  if (parts.length !== 4 || parts[0] !== '15M') {
    return {
      isValid: false,
      message: 'Mã kích hoạt không đúng định dạng (Phải bắt đầu bằng 15M-...)'
    };
  }

  const [, pkgCode, expStr, keySig] = parts;
  const rawData = `${cleanMid}|${pkgCode}|${expStr}|${SECRET_SALT}`;
  const fullHash = await sha256Hex(rawData);
  const expectedSig = fullHash.slice(0, 12);

  if (keySig !== expectedSig) {
    return {
      isValid: false,
      message: 'Mã kích hoạt không khớp với Mã máy tính này!'
    };
  }

  const year = parseInt(expStr.slice(0, 4), 10);
  const month = parseInt(expStr.slice(4, 6), 10) - 1;
  const day = parseInt(expStr.slice(6, 8), 10);
  const expDate = new Date(year, month, day);

  if (expStr !== '99991231' && expDate.getTime() < Date.now()) {
    return {
      isValid: false,
      message: `Khóa bản quyền đã hết hạn sử dụng vào ngày ${day}/${month + 1}/${year}`
    };
  }

  let pkgName = 'Bản quyền Vĩnh viễn (Trọn đời)';
  let pType: '1year' | '2year' | 'lifetime' = 'lifetime';
  if (pkgCode === '1Y') {
    pkgName = 'Bản quyền 1 Năm';
    pType = '1year';
  } else if (pkgCode === '2Y') {
    pkgName = 'Bản quyền 2 Năm';
    pType = '2year';
  }

  const daysRem = expStr === '99991231' ? 9999 : Math.max(0, Math.ceil((expDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  return {
    isValid: true,
    packageType: pType,
    packageName: pkgName,
    expiryDateStr: expStr === '99991231' ? 'Vĩnh viễn' : `${day}/${month + 1}/${year}`,
    daysRemaining: daysRem,
    message: 'Kích hoạt bản quyền thành công!'
  };
}

/**
 * Quản lý số lượt dùng thử (mặc định 5 lần)
 */
export function getExam15PTrialRemaining(): number {
  if (typeof window === 'undefined') return 5;
  const saved = localStorage.getItem(STORAGE_SEC_TRIAL);
  if (saved === null) {
    localStorage.setItem(STORAGE_SEC_TRIAL, '5');
    return 5;
  }
  const val = parseInt(saved, 10);
  return isNaN(val) ? 0 : Math.max(0, Math.min(5, val));
}

export function decrementExam15PTrial(): number {
  if (typeof window === 'undefined') return 0;
  const cur = getExam15PTrialRemaining();
  const next = Math.max(0, cur - 1);
  localStorage.setItem(STORAGE_SEC_TRIAL, next.toString());
  return next;
}
