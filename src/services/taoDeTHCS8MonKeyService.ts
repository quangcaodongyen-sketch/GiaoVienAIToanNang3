// ============================================================================
// DỊCH VỤ QUẢN LÝ BẢN QUYỀN HỆ THỐNG PHẦN MỀM TẠO ĐỀ KIỂM TRA THCS (8 MÔN)
// CHUẨN CÔNG VĂN 7991/BGDĐT & BỘ SÁCH KẾT NỐI TRI THỨC VỚI CUỘC SỐNG
// Tác giả: Thầy giáo Đinh Văn Thành – THCS Đồng Yên – Hotline/Zalo: 0915.213717
// Thuật toán: SHA-256 & HMAC Hardware Binding, Quản lý Gói 8 Môn & Từng Môn Lẻ
// ============================================================================

const SECRET_SALT = "DVT_THCS_8_MON_EXAM_SUITE_SECRET_2026_0915213717";
const TRIAL_SEC_SALT = "DVT_ANTI_TAMPER_TRIAL_THCS8M_2026";
const STORAGE_SEC_TRIAL = "gvai_thcs8m_sec_trials_v1";
const STORAGE_BACKUP_HASH = "_sys_hw_thcs8m_hash";
const STORAGE_VIP_LICENSE = "gvai_thcs8m_vip_license";

export interface THCS8MVerifyResult {
  isValid: boolean;
  packageType?: '1year' | '2year' | 'lifetime';
  packageName?: string;
  scope?: string; // 'ALL' | 'TOAN' | 'VAN' | 'ENG' | 'KHTN' | 'SUDIA' | 'TIN' | 'GDCD' | 'CN'
  expiryDateStr?: string;
  daysRemaining?: number;
  message?: string;
}

export const SUBJECT_MAP: Record<string, { name: string; icon: string; color: string }> = {
  ALL: { name: 'TRỌN GÓI TOÀN DIỆN 8 MÔN', icon: '🏛️', color: '#3b82f6' },
  TOAN: { name: 'Môn Toán học', icon: '📐', color: '#2563eb' },
  VAN: { name: 'Môn Ngữ văn', icon: '📖', color: '#dc2626' },
  ENG: { name: 'Môn Tiếng Anh', icon: '🇬🇧', color: '#0284c7' },
  KHTN: { name: 'Môn Khoa học tự nhiên', icon: '🔬', color: '#059669' },
  SUDIA: { name: 'Môn Lịch sử & Địa lí', icon: '🌍', color: '#d97706' },
  TIN: { name: 'Môn Tin học', icon: '💻', color: '#0891b2' },
  GDCD: { name: 'Môn Giáo dục công dân', icon: '⚖️', color: '#e11d48' },
  CN: { name: 'Môn Công nghệ', icon: '⚙️', color: '#ea580c' }
};

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
 * Định dạng: DVT-TH8M-XXXX-XXXX
 */
export function getOrCreateTHCS8MHardwareCode(): string {
  if (typeof window === 'undefined') return 'DVT-TH8M-9988-B2C3';

  const STORAGE_KEY = 'gvai_thcs8m_hardware_code';
  let code = localStorage.getItem(STORAGE_KEY);
  if (code && code.startsWith('DVT-TH8M-') && code.length >= 18) {
    return code;
  }

  const screenPart = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
  const corePart = `${navigator.hardwareConcurrency || 4}-${navigator.platform || 'Win32'}`;
  const rawSeed = `THCS8M-${screenPart}-${corePart}-${navigator.userAgent}`;

  let hash = 0;
  for (let i = 0; i < rawSeed.length; i++) {
    hash = (hash << 5) - hash + rawSeed.charCodeAt(i);
    hash |= 0;
  }

  const hex1 = Math.abs(hash).toString(16).toUpperCase().padStart(4, '0').slice(-4);
  const hex2 = Math.abs((hash * 47) | 0).toString(16).toUpperCase().padStart(4, '0').slice(-4);
  code = `DVT-TH8M-${hex1}-${hex2}`;
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
export async function getSecureTHCS8MTrialRemaining(): Promise<number> {
  if (typeof window === 'undefined') return 5;

  if (isTHCS8MVIPActivated()) {
    return 999;
  }

  const hwid = getOrCreateTHCS8MHardwareCode();
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
 * Tiêu hao 1 lượt trải nghiệm sau khi giáo viên bấm nút Tạo Đề
 */
export async function consumeSecureTHCS8MTrial(): Promise<number> {
  if (typeof window === 'undefined') return 0;
  if (isTHCS8MVIPActivated()) return 999;

  const current = await getSecureTHCS8MTrialRemaining();
  if (current <= 0) return 0;

  const next = current - 1;
  const hwid = getOrCreateTHCS8MHardwareCode();
  const newHash = await generateTrialChecksum(next, hwid);

  localStorage.setItem(STORAGE_SEC_TRIAL, next.toString());
  localStorage.setItem(STORAGE_BACKUP_HASH, newHash);
  return next;
}

/**
 * Kiểm tra trạng thái kích hoạt Bản quyền VIP
 */
export function isTHCS8MVIPActivated(): boolean {
  if (typeof window === 'undefined') return false;
  const item = localStorage.getItem(STORAGE_VIP_LICENSE);
  if (!item) return false;

  try {
    const data = JSON.parse(item);
    if (!data || !data.key || !data.hwid) return false;
    const currentHwid = getOrCreateTHCS8MHardwareCode();
    if (data.hwid !== currentHwid) return false;

    if (data.expiryTs && data.expiryTs < Math.floor(Date.now() / 1000)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Lấy thông tin gói bản quyền đang kích hoạt
 */
export function getTHCS8MActivePackage(): {
  isVIP: boolean;
  packageType?: '1year' | '2year' | 'lifetime';
  packageName?: string;
  scope?: string;
  expiryDateStr?: string;
} {
  if (typeof window === 'undefined') return { isVIP: false };
  const item = localStorage.getItem(STORAGE_VIP_LICENSE);
  if (!item) return { isVIP: false };

  try {
    const data = JSON.parse(item);
    if (!data || !data.key) return { isVIP: false };
    return {
      isVIP: true,
      packageType: data.packageType,
      packageName: data.packageName,
      scope: data.scope || 'ALL',
      expiryDateStr: data.expiryDateStr
    };
  } catch {
    return { isVIP: false };
  }
}

/**
 * Xác thực License Key cho Hệ thống Tạo đề THCS 8 môn
 * Cấu trúc: TH8M-[SCOPE]-[PKG]-[EXP_HEX]-[SIG]
 * Hỗ trợ các scope: ALL, TOAN, VAN, ENG, KHTN, SUDIA, TIN, GDCD, CN
 * Đồng thời tương thích với key desktop dạng: MATH-LT-..., VAN-LT-...
 */
export async function activateTHCS8MLicense(key: string, clientHwid: string): Promise<THCS8MVerifyResult> {
  const cleanKey = key.trim().toUpperCase();
  const parts = cleanKey.split('-');

  // Trường hợp 1: Chuẩn Key Suite TH8M: TH8M-[SCOPE]-[PKG]-[EXP_HEX]-[SIG]
  if (parts.length === 5 && parts[0] === 'TH8M') {
    const scope = parts[1]; // ALL, TOAN, VAN, ...
    const pkgCode = parts[2]; // 1Y, 2Y, LT
    const expHex = parts[3];
    const signature = parts[4];

    const expiryTs = parseInt(expHex, 16);
    if (isNaN(expiryTs)) {
      return { isValid: false, message: 'Cấu trúc thời hạn trong mã bản quyền không hợp lệ!' };
    }

    const nowTs = Math.floor(Date.now() / 1000);
    if (expiryTs < nowTs) {
      return { isValid: false, message: 'Mã bản quyền này đã hết hạn sử dụng!' };
    }

    const rawData = `${clientHwid}|${scope}|${pkgCode}|${expHex}|${SECRET_SALT}`;
    const fullHash = await sha256Hex(rawData);
    const expectedSig = fullHash.slice(0, 8);

    if (signature !== expectedSig) {
      return { isValid: false, message: 'Mã bản quyền không hợp lệ hoặc không khớp với Mã máy tính này!' };
    }

    let packageType: '1year' | '2year' | 'lifetime' = 'lifetime';
    let packageName = 'Gói Trọn Đời (Vĩnh Viễn)';
    if (pkgCode === '1Y') {
      packageType = '1year';
      packageName = 'Gói 1 Năm';
    } else if (pkgCode === '2Y') {
      packageType = '2year';
      packageName = 'Gói 2 Năm (Tiết Kiệm)';
    }

    const scopeInfo = SUBJECT_MAP[scope] || { name: scope };
    const fullPackageName = `${packageName} [${scopeInfo.name}]`;
    const expDate = new Date(expiryTs * 1000);
    const expiryDateStr = pkgCode === 'LT'
      ? 'Vĩnh viễn (Trọn đời máy)'
      : `${expDate.getDate().toString().padStart(2, '0')}/${(expDate.getMonth() + 1).toString().padStart(2, '0')}/${expDate.getFullYear()}`;

    // Lưu vào LocalStorage
    localStorage.setItem(STORAGE_VIP_LICENSE, JSON.stringify({
      key: cleanKey,
      hwid: clientHwid,
      packageType,
      packageName: fullPackageName,
      scope,
      expiryTs,
      expiryDateStr,
      activatedAt: new Date().toISOString()
    }));

    return {
      isValid: true,
      packageType,
      packageName: fullPackageName,
      scope,
      expiryDateStr,
      message: `Kích hoạt thành công ${fullPackageName}!`
    };
  }

  // Trường hợp 2: Key Desktop từng môn (MATH-..., VAN-..., ENG-..., KHTN-..., v.v.)
  const desktopPrefixes = ['MATH', 'VAN', 'ENG', 'KHTN', 'SUDIA', 'TIN', 'GDCD', 'CN'];
  if (parts.length === 4 && desktopPrefixes.includes(parts[0])) {
    const subPrefix = parts[0];
    const pkgCode = parts[1]; // LT, Y1, Y2
    const expHex = parts[2];
    const expiryTs = parseInt(expHex, 16);

    let scope = 'ALL';
    if (subPrefix === 'MATH') scope = 'TOAN';
    else if (subPrefix === 'VAN') scope = 'VAN';
    else if (subPrefix === 'ENG') scope = 'ENG';
    else if (subPrefix === 'KHTN') scope = 'KHTN';
    else if (subPrefix === 'SUDIA') scope = 'SUDIA';
    else if (subPrefix === 'TIN') scope = 'TIN';
    else if (subPrefix === 'GDCD') scope = 'GDCD';
    else if (subPrefix === 'CN') scope = 'CN';

    const packageName = `Bản quyền Desktop ${SUBJECT_MAP[scope]?.name || subPrefix}`;
    const expiryDateStr = pkgCode === 'LT' ? 'Vĩnh viễn (Trọn đời máy)' : '1 Năm';

    localStorage.setItem(STORAGE_VIP_LICENSE, JSON.stringify({
      key: cleanKey,
      hwid: clientHwid,
      packageType: 'lifetime',
      packageName,
      scope,
      expiryTs: expiryTs || 9999999999,
      expiryDateStr,
      activatedAt: new Date().toISOString()
    }));

    return {
      isValid: true,
      packageType: 'lifetime',
      packageName,
      scope,
      expiryDateStr,
      message: `Kích hoạt thành công ${packageName}!`
    };
  }

  return { isValid: false, message: 'Định dạng mã bản quyền không đúng (VD: TH8M-ALL-LT-XXXX-XXXX)' };
}

/**
 * Hàm sinh License Key cho Thầy Thành trong Admin Dashboard
 */
export async function generateTHCS8MLicenseKey(
  targetHwid: string,
  scope: string = 'ALL',
  pkg: '1year' | '2year' | 'lifetime' = 'lifetime'
): Promise<{
  licenseKey: string;
  expDateStr: string;
  zaloMessage: string;
}> {
  const cleanHwid = targetHwid.trim().toUpperCase();
  const cleanScope = scope.toUpperCase();

  const now = Math.floor(Date.now() / 1000);
  let pkgCode = 'LT';
  let expiryTs = 9999999999;
  let expDateStr = 'Vĩnh viễn (Trọn đời)';

  if (pkg === '1year') {
    pkgCode = '1Y';
    expiryTs = now + 365 * 86400;
    const d = new Date(expiryTs * 1000);
    expDateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  } else if (pkg === '2year') {
    pkgCode = '2Y';
    expiryTs = now + 730 * 86400;
    const d = new Date(expiryTs * 1000);
    expDateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }

  const expHex = expiryTs.toString(16).toUpperCase().padStart(8, '0');
  const rawData = `${cleanHwid}|${cleanScope}|${pkgCode}|${expHex}|${SECRET_SALT}`;
  const fullHash = await sha256Hex(rawData);
  const sig = fullHash.slice(0, 8);

  const licenseKey = `TH8M-${cleanScope}-${pkgCode}-${expHex}-${sig}`;
  const scopeName = SUBJECT_MAP[cleanScope]?.name || cleanScope;

  const zaloMessage = `Kính gửi Quý Thầy/Cô!
Thầy giáo Đinh Văn Thành (THCS Đồng Yên - 0915.213717) trân trọng gửi Quý Thầy/Cô thông tin kích hoạt Bản quyền Phần mềm Tạo Đề Kiểm Tra THCS:

- Phạm vi: ${scopeName}
- Gói bản quyền: ${pkg === 'lifetime' ? 'Trọn Đời (Vĩnh Viễn)' : (pkg === '1year' ? 'Gói 1 Năm' : 'Gói 2 Năm')}
- Thời hạn sử dụng: ${expDateStr}
- Mã máy tính (HWID): ${cleanHwid}
- MÃ BẢN QUYỀN PRO:
${licenseKey}

HƯỚNG DẪN KÍCH HOẠT:
1. Mở phần mềm hoặc truy cập website GiaoVienAI-ToanNang.
2. Vào Tab "Bản Quyền & Kích Hoạt", dán mã trên vào ô kích hoạt rồi bấm "KÍCH HOẠT NGAY".
Chúc Thầy/Cô ứng dụng AI hiệu quả và tiết kiệm tối đa thời gian soạn đề!`;

  return {
    licenseKey,
    expDateStr,
    zaloMessage
  };
}
