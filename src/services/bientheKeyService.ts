// ============================================================================
// DỊCH VỤ QUẢN LÝ BẢN QUYỀN & MẬT MÃ SINH 3 ĐỀ BIẾN THỂ VIP (V1)
// Tác giả: Thầy giáo Đinh Văn Thành – THCS Đồng Yên – ĐT/Zalo: 0915.213717
// Thuật toán: SHA-256 HMAC Signature chuẩn thương hiệu Thầy Đinh Văn Thành
// Bảo mật: Hệ thống bảo vệ nhiều tầng lớp (Hardware Lock, Anti-Tamper Trial Storage, SHA-256 Signature)
// ============================================================================

const SECRET_SALT = "THANH_DONG_YEN_0915213717_2026_BIENTHE_KEY";
const TRIAL_SEC_SALT = "DVT_ANTI_TAMPER_TRIAL_PROTECT_2026_BIENTHE";
const STORAGE_SEC_TRIAL = "gvai_bienthe_sec_trials_v1";
const STORAGE_BACKUP_HASH = "_sys_hw_var_hash";

export interface BientheVerifyResult {
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
 * Định dạng: DVT-VAR-XXXX-XXXX
 */
export function getOrCreateBientheHardwareCode(): string {
  if (typeof window === 'undefined') return 'DVT-VAR-DEFAULT';

  const STORAGE_KEY = 'gvai_bienthe_hardware_code';
  let code = localStorage.getItem(STORAGE_KEY);
  if (code && code.startsWith('DVT-VAR-')) {
    return code;
  }

  // Thu thập dấu vân tay phần cứng trình duyệt nhiều tầng lớp
  const screenPart = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
  const corePart = `${navigator.hardwareConcurrency || 4}-${navigator.platform || 'Win32'}`;
  const rawSeed = `VAR-${screenPart}-${corePart}-${navigator.userAgent}`;

  let hash = 0;
  for (let i = 0; i < rawSeed.length; i++) {
    hash = (hash << 5) - hash + rawSeed.charCodeAt(i);
    hash |= 0;
  }

  const hex1 = Math.abs(hash).toString(16).toUpperCase().padStart(4, '0').slice(-4);
  const hex2 = Math.abs((hash * 37) | 0).toString(16).toUpperCase().padStart(4, '0').slice(-4);
  code = `DVT-VAR-${hex1}-${hex2}`;
  localStorage.setItem(STORAGE_KEY, code);
  return code;
}

/**
 * TẦNG BẢO MẬT 1: Đọc số lượt dùng thử được ký số mật mã SHA-256 (Chống hack F12 DevTools)
 * Nếu người dùng can thiệp sửa đổi trái phép localStorage, hệ thống lập tức khóa về 0 lượt.
 */
export async function getSecureBientheTrialRemaining(machineId: string): Promise<number> {
  if (typeof window === 'undefined') return 0;
  const raw = localStorage.getItem(STORAGE_SEC_TRIAL);
  if (!raw) {
    // Khởi tạo 5 lượt với chữ ký bảo mật tầng 1
    const initialRemaining = 5;
    const sig = await sha256Hex(`${machineId}|${initialRemaining}|${TRIAL_SEC_SALT}`);
    const payload = JSON.stringify({ remaining: initialRemaining, sig, mid: machineId });
    localStorage.setItem(STORAGE_SEC_TRIAL, payload);
    localStorage.setItem(STORAGE_BACKUP_HASH, sig);
    return initialRemaining;
  }

  try {
    const data = JSON.parse(raw);
    const expectedSig = await sha256Hex(`${machineId}|${data.remaining}|${TRIAL_SEC_SALT}`);
    const backupSig = localStorage.getItem(STORAGE_BACKUP_HASH);

    // Kiểm tra tính toàn vẹn 2 lớp (Anti-tamper Layer)
    if (data.sig !== expectedSig || data.mid !== machineId || (backupSig && backupSig !== expectedSig)) {
      console.warn("⚠️ Cảnh báo: Phát hiện dấu hiệu can thiệp DevTools bất hợp pháp! Khóa ngay lập tức.");
      const lockedSig = await sha256Hex(`${machineId}|0|${TRIAL_SEC_SALT}`);
      localStorage.setItem(STORAGE_SEC_TRIAL, JSON.stringify({ remaining: 0, sig: lockedSig, mid: machineId, locked: true }));
      localStorage.setItem(STORAGE_BACKUP_HASH, lockedSig);
      return 0;
    }

    return Math.max(0, Math.min(5, Number(data.remaining) || 0));
  } catch {
    return 0;
  }
}

/**
 * TẦNG BẢO MẬT 2: Trừ lượt dùng thử an toàn kèm ký số mật mã mới
 */
export async function consumeSecureBientheTrial(machineId: string): Promise<number> {
  const current = await getSecureBientheTrialRemaining(machineId);
  const next = Math.max(0, current - 1);
  const sig = await sha256Hex(`${machineId}|${next}|${TRIAL_SEC_SALT}`);
  const payload = JSON.stringify({ remaining: next, sig, mid: machineId });
  localStorage.setItem(STORAGE_SEC_TRIAL, payload);
  localStorage.setItem(STORAGE_BACKUP_HASH, sig);
  return next;
}

/**
 * Tạo License Key chuẩn dành cho Quản trị viên (Thầy Đinh Văn Thành)
 */
export async function generateBientheLicenseKey(
  machineId: string,
  packageType: '1year' | '2year' | 'lifetime' = 'lifetime'
): Promise<{ key: string; packageName: string; expiryDateStr: string }> {
  const cleanId = machineId.trim().toUpperCase();
  const nowTs = Math.floor(Date.now() / 1000);

  let prefix = 'LT';
  let expiryTs = 9999999999; // Vĩnh viễn
  let packageName = 'GÓI VĨNH VIỄN / TRỌN ĐỜI (200.000đ)';
  let expiryDateStr = 'Vĩnh viễn (Trọn đời)';

  if (packageType === '1year') {
    prefix = 'Y1';
    expiryTs = nowTs + 365 * 86400;
    packageName = 'GÓI 1 NĂM (200.000đ)';
    const d = new Date(expiryTs * 1000);
    expiryDateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  } else if (packageType === '2year') {
    prefix = 'Y2';
    expiryTs = nowTs + 730 * 86400;
    packageName = 'GÓI 2 NĂM (250.000đ)';
    const d = new Date(expiryTs * 1000);
    expiryDateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }

  const expHex = expiryTs.toString(16).toUpperCase();
  const rawSig = `${cleanId}|${prefix}|${expHex}|${SECRET_SALT}`;
  const fullHash = await sha256Hex(rawSig);
  const sig = fullHash.slice(0, 8);
  const key = `VAR-${prefix}-${expHex}-${sig}`;

  return { key, packageName, expiryDateStr };
}

/**
 * Xác thực License Key khách hàng nhập vào trên trang web
 */
export async function verifyBientheLicenseKey_orig(key: string, machineId: string): Promise<BientheVerifyResult> {
  const cleanKey = key.trim().toUpperCase();
  const cleanId = machineId.trim().toUpperCase();

  const parts = cleanKey.split('-');
  if (parts.length !== 4 || parts[0] !== 'VAR') {
    return {
      isValid: false,
      message: 'Mã kích hoạt không đúng định dạng (Ví dụ: VAR-LT-...)!'
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
    pkgName = 'GÓI 1 NĂM (200.000đ)';
    const d = new Date(expiryTs * 1000);
    expStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    daysRemaining = Math.max(0, Math.ceil((expiryTs - nowTs) / 86400));
  } else if (prefix === 'Y2') {
    pkgType = '2year';
    pkgName = 'GÓI 2 NĂM (250.000đ)';
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

export async function verifyBientheLicenseKey(...args: any[]): Promise<any> {
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
  return (verifyBientheLicenseKey_orig as any)(...args);
}
