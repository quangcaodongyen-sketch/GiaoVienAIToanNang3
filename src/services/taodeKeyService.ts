// ============================================================================
// DỊCH VỤ QUẢN LÝ BẢN QUYỀN & MẬT MÃ TẠO ĐỀ TIẾNG ANH GLOBAL SUCCESS (CV 7991)
// Tác giả: Thầy giáo Đinh Văn Thành – THCS Đồng Yên – ĐT/Zalo: 0915.213717
// Thuật toán: SHA-256 HMAC Signature chuẩn khớp 100% với Tool_Tao_Key_Ban_Quyen_Thanh.py
// ============================================================================

const SECRET_SALT = "THANH_DONG_YEN_0915213717_2026_PRO_KEY";

export interface ExamVerifyResult {
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
 * Lấy hoặc khởi tạo Mã máy tính Hardware Code chuẩn thương hiệu Thầy Đinh Văn Thành
 * Định dạng: DVT-ENG-XXXX-XXXX
 */
export function getOrCreateExamHardwareCode(): string {
  if (typeof window === 'undefined') return 'DVT-ENG-DEFAULT';

  const STORAGE_KEY = 'gvai_taode_hardware_code';
  let code = localStorage.getItem(STORAGE_KEY);
  if (code && code.startsWith('DVT-ENG-')) {
    return code;
  }

  // Thu thập dấu vân tay phần cứng trình duyệt
  const screenPart = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
  const corePart = `${navigator.hardwareConcurrency || 4}-${navigator.platform || 'Win32'}`;
  const rawSeed = `${screenPart}-${corePart}-${navigator.userAgent}`;

  let hash = 0;
  for (let i = 0; i < rawSeed.length; i++) {
    hash = (hash << 5) - hash + rawSeed.charCodeAt(i);
    hash |= 0;
  }

  const hex1 = Math.abs(hash).toString(16).toUpperCase().padStart(4, '0').slice(-4);
  const hex2 = Math.abs((hash * 31) | 0).toString(16).toUpperCase().padStart(4, '0').slice(-4);
  code = `DVT-ENG-${hex1}-${hex2}`;
  localStorage.setItem(STORAGE_KEY, code);
  return code;
}

/**
 * Tạo License Key chuẩn dành cho Quản trị viên (Thầy Đinh Văn Thành)
 * Khớp 100% với Tool_Tao_Key_Ban_Quyen_Thanh.py
 */
export async function generateExamLicenseKey(
  machineId: string,
  packageType: '1year' | '2year' | 'lifetime' = 'lifetime'
): Promise<{ key: string; packageName: string; expiryDateStr: string }> {
  const cleanId = machineId.trim().toUpperCase();
  const nowTs = Math.floor(Date.now() / 1000);

  let prefix = 'LT';
  let expiryTs = 9999999999; // Năm 2286
  let packageName = 'GÓI VĨNH VIỄN / TRỌN ĐỜI (200.000đ)';
  let expiryDateStr = 'Vĩnh viễn (Trọn đời)';

  if (packageType === '1year') {
    prefix = 'Y1';
    expiryTs = nowTs + 365 * 86400;
    packageName = 'GÓI 1 NĂM (100.000đ)';
    const d = new Date(expiryTs * 1000);
    expiryDateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  } else if (packageType === '2year') {
    prefix = 'Y2';
    expiryTs = nowTs + 730 * 86400;
    packageName = 'GÓI 2 NĂM (150.000đ)';
    const d = new Date(expiryTs * 1000);
    expiryDateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }

  const expHex = expiryTs.toString(16).toUpperCase();
  const rawSig = `${cleanId}|${prefix}|${expHex}|${SECRET_SALT}`;
  const fullHash = await sha256Hex(rawSig);
  const sig = fullHash.slice(0, 8);
  const key = `ENG-${prefix}-${expHex}-${sig}`;

  return { key, packageName, expiryDateStr };
}

/**
 * Xác thực License Key khách hàng nhập vào trên trang web
 */
export async function verifyExamLicenseKey(key: string, machineId: string): Promise<ExamVerifyResult> {
  const cleanKey = key.trim().toUpperCase();
  const cleanId = machineId.trim().toUpperCase();

  const parts = cleanKey.split('-');
  if (parts.length !== 4 || parts[0] !== 'ENG') {
    return {
      isValid: false,
      message: 'Mã kích hoạt không đúng định dạng (Ví dụ: ENG-LT-...)!'
    };
  }

  const [, prefix, expHex, sig] = parts;
  const rawSig = `${cleanId}|${prefix}|${expHex}|${SECRET_SALT}`;
  const fullHash = await sha256Hex(rawSig);
  const expectedSig = fullHash.slice(0, 8);

  if (sig !== expectedSig) {
    return {
      isValid: false,
      message: 'Chữ ký bản quyền không hợp lệ hoặc mã máy tính không khớp!'
    };
  }

  let expiryTs = 0;
  try {
    expiryTs = parseInt(expHex, 16);
  } catch {
    return {
      isValid: false,
      message: 'Thời hạn bản quyền bị lỗi!'
    };
  }

  const nowTs = Math.floor(Date.now() / 1000);
  if (nowTs > expiryTs) {
    return {
      isValid: false,
      message: 'Mã bản quyền này đã hết hạn sử dụng!'
    };
  }

  let pkgType: '1year' | '2year' | 'lifetime' = 'lifetime';
  let pkgName = 'GÓI VĨNH VIỄN / TRỌN ĐỜI (200.000đ)';
  let expStr = 'Vĩnh viễn (Trọn đời)';
  let daysRemaining = 99999;

  if (prefix === 'Y1') {
    pkgType = '1year';
    pkgName = 'GÓI 1 NĂM (100.000đ)';
    const d = new Date(expiryTs * 1000);
    expStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    daysRemaining = Math.max(0, Math.ceil((expiryTs - nowTs) / 86400));
  } else if (prefix === 'Y2') {
    pkgType = '2year';
    pkgName = 'GÓI 2 NĂM (150.000đ)';
    const d = new Date(expiryTs * 1000);
    expStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    daysRemaining = Math.max(0, Math.ceil((expiryTs - nowTs) / 86400));
  }

  return {
    isValid: true,
    packageType: pkgType,
    packageName: pkgName,
    expiryDateStr: expStr,
    daysRemaining,
    message: 'Kích hoạt bản quyền Pro thành công!'
  };
}
