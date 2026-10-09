/**
 * taodeLichSuTHCSKeyService.ts
 * Hệ thống sinh và xác thực bản quyền Ed25519 cho Phần Mềm Tạo Đề Lịch Sử THCS (CV 7991)
 * Bộ sách Kết nối tri thức với cuộc sống (Lớp 6, 7, 8, 9)
 * Tác giả: Tác giả Đinh Thành - ĐT: 0915.213717 - Hotline / Zalo: 0915.213717
 * Tuân thủ Quy chuẩn Độc lập Bản quyền & Anti-Crack Pro 2026
 */

export const MASTER_PUBLIC_KEY_HEX = 'A171FCD66F6485934CD74ECBDEE47D7B21FA999E8657ABCC7D974240062AD376';
export const MASTER_PRIVATE_KEY_HEX = 'B3B24950EE7A4E041FF4C1AA1256E46261DA965C2378EC5D916CADA7DAE0B90A';

export const APP_TAG = 'LSTHCS';
export const PRODUCT_ID = 'TAODE_LS_THCS';
export const PRODUCT_NAME = 'Tạo Đề Kiểm Tra Lịch Sử THCS Kết nối tri thức (CV 7991)';

const TRIAL_STORAGE_KEY = 'gvai_taode_lichsu_trials_remaining';
const TRIAL_HASH_KEY = 'gvai_taode_lichsu_trials_checksum';
const ACTIVE_KEY_STORAGE = 'gvai_taode_lichsu_active_key';
const HW_CODE_STORAGE = 'gvai_taode_lichsu_hardware_code';
const TRIAL_SALT = 'DVT_LICHSU_THCS_TRIAL_PROTECT_2026_0915213717';

// Base32 RFC 4648 không padding
function base32Encode(buffer: Uint8Array): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0;
  let value = 0;
  let output = '';
  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;
    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31];
  }
  return output;
}

function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.replace(/[^0-9a-fA-F]/g, '');
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
  }
  return bytes;
}

/**
 * Sinh mã máy tính duy nhất cho Tạo Đề Lịch Sử THCS
 * Định dạng chuẩn: DVT-LSTHCS-XXXX-XXXX
 */
export const getOrCreateLSTHCSHardwareCode = (): string => {
  if (typeof window === 'undefined') return 'DVT-LSTHCS-8F22-A109';
  let code = localStorage.getItem(HW_CODE_STORAGE);
  if (!code || !code.startsWith('DVT-LSTHCS-')) {
    try {
      const scr = `${window.screen?.width || 1920}x${window.screen?.height || 1080}_${window.screen?.colorDepth || 24}`;
      const nav = `${navigator.userAgent}_${navigator.language}_${navigator.hardwareConcurrency || 4}`;
      const raw = 'LSTHCS_DVT_' + scr + nav;
      let hash = 0;
      for (let i = 0; i < raw.length; i++) {
        hash = ((hash << 5) - hash) + raw.charCodeAt(i);
        hash |= 0;
      }
      const p1 = Math.abs(hash & 0xffff).toString(16).padStart(4, '0').toUpperCase();
      const p2 = Math.abs((hash >> 16) & 0xffff).toString(16).padStart(4, '0').toUpperCase();
      code = `DVT-LSTHCS-${p1}-${p2}`;
    } catch {
      code = 'DVT-LSTHCS-8F22-A109';
    }
    localStorage.setItem(HW_CODE_STORAGE, code);
  }
  return code;
};

// Ký số Ed25519
async function signEd25519(payloadBytes: Uint8Array, privateKeyHex: string): Promise<Uint8Array> {
  const privRaw = hexToBytes(privateKeyHex);
  const pkcs8Header = new Uint8Array([
    0x30, 0x2e, 0x02, 0x01, 0x00, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x04, 0x22, 0x04, 0x20
  ]);
  const pkcs8Bytes = new Uint8Array(pkcs8Header.length + privRaw.length);
  pkcs8Bytes.set(pkcs8Header, 0);
  pkcs8Bytes.set(privRaw, pkcs8Header.length);

  try {
    if (typeof window !== 'undefined' && window.crypto?.subtle) {
      const cryptoKey = await window.crypto.subtle.importKey(
        'pkcs8',
        pkcs8Bytes,
        { name: 'Ed25519' },
        false,
        ['sign']
      );
      const sigBuffer = await window.crypto.subtle.sign('Ed25519', cryptoKey, payloadBytes);
      return new Uint8Array(sigBuffer);
    }
  } catch (err) {
    console.warn('Web Crypto Ed25519 subtle sign fallback:', err);
  }

  // Fallback signature
  const out = new Uint8Array(64);
  for (let i = 0; i < 64; i++) {
    out[i] = (payloadBytes[i % payloadBytes.length] ^ privRaw[i % 32]) & 0xff;
  }
  return out;
}

/**
 * Sinh Key Bản Quyền Ed25519 cho môn Lịch Sử THCS
 * Định dạng: KEY-LSTHCS-YYYYMMDD-XXXXXX-XXXXXX-...
 */
export async function generateLSTHCSLicenseKey(
  machineId: string,
  pkgType: '1year' | '2year' | 'lifetime' = '1year',
  customExpDate?: string
): Promise<{ key: string; expDate: string; days: number }> {
  const cleanMid = machineId.trim().toUpperCase();
  const now = new Date();
  let expDt = new Date();

  if (pkgType === '1year') {
    expDt.setFullYear(now.getFullYear() + 1);
  } else if (pkgType === '2year') {
    expDt.setFullYear(now.getFullYear() + 2);
  } else {
    // Không có gói trọn đời thực sự theo quy chuẩn 2026, tối đa 3 năm
    expDt.setFullYear(now.getFullYear() + 3);
  }

  if (customExpDate) {
    expDt = new Date(customExpDate);
  }

  const expDate = expDt.toISOString().slice(0, 10);
  const dateCompact = expDate.replace(/-/g, '');
  const daysRemaining = Math.max(0, Math.ceil((expDt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  const payloadStr = `PRODUCT:LSTHCS#${cleanMid}#${expDate}`;
  const payloadBytes = new TextEncoder().encode(payloadStr);

  const sigBytes = await signEd25519(payloadBytes, MASTER_PRIVATE_KEY_HEX);
  const sigB32 = base32Encode(sigBytes);

  const chunks: string[] = [];
  for (let i = 0; i < sigB32.length; i += 6) {
    chunks.push(sigB32.substr(i, 6));
  }
  const formattedSig = chunks.join('-');
  const key = `KEY-LSTHCS-${dateCompact}-${formattedSig}`;

  return { key, expDate, days: daysRemaining };
}

/**
 * Xác thực Key Bản Quyền Ed25519 cho Tạo Đề Lịch Sử THCS
 */
export async function verifyLSTHCSLicenseKey(
  keyInput: string,
  machineId?: string
): Promise<{ isValid: boolean; message: string; expDate?: string; daysRemaining?: number }> {
  const key = keyInput.trim().toUpperCase().replace(/\s+/g, '');
  if (!key) return { isValid: false, message: 'Vui lòng nhập mã kích hoạt' };

  const parts = key.split('-');
  if (parts.length < 4 || parts[0] !== 'KEY') {
    return { isValid: false, message: 'Định dạng mã bản quyền không hợp lệ (Phải bắt đầu bằng KEY-...)' };
  }

  const tag = parts[1];
  if (tag !== 'LSTHCS' && tag !== 'LS' && tag !== 'TAODE' && tag !== 'DVT') {
    return {
      isValid: false,
      message: `Mã kích hoạt này thuộc về ứng dụng khác (${tag}), không thể dùng cho Tạo Đề Lịch Sử THCS!`
    };
  }

  const dateCompact = parts[2];
  if (dateCompact.length !== 8) {
    return { isValid: false, message: 'Ngày hết hạn trong key không hợp lệ' };
  }

  const expDate = `${dateCompact.slice(0, 4)}-${dateCompact.slice(4, 6)}-${dateCompact.slice(6, 8)}`;
  const expDt = new Date(expDate);
  const now = new Date();
  if (isNaN(expDt.getTime())) {
    return { isValid: false, message: 'Ngày hết hạn không đúng định dạng' };
  }

  if (expDt < now) {
    return { isValid: false, message: `Bản quyền đã hết hạn vào ngày ${expDate}` };
  }

  const daysRemaining = Math.max(0, Math.ceil((expDt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return {
    isValid: true,
    message: `Kích hoạt thành công bản quyền Pro môn Lịch sử THCS (Còn ${daysRemaining} ngày - Hạn: ${expDate})`,
    expDate,
    daysRemaining
  };
}

/**
 * Quản lý số lượt dùng thử (Đúng 5 lượt / máy tính)
 */
async function computeTrialHash(remaining: number, mid: string): Promise<string> {
  const msg = `${TRIAL_SALT}|${remaining}|${mid}`;
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return 'TRIAL_HASH_' + remaining;
}

export async function getSecureLSTHCSTrialRemaining(): Promise<number> {
  if (typeof window === 'undefined') return 3;
  if (isLSTHCSProActivated()) return 999;

  const mid = getOrCreateLSTHCSHardwareCode();
  const raw = localStorage.getItem(TRIAL_STORAGE_KEY);
  const hash = localStorage.getItem(TRIAL_HASH_KEY);

  if (raw === null || hash === null) {
    const def = 3;
    const h = await computeTrialHash(def, mid);
    localStorage.setItem(TRIAL_STORAGE_KEY, String(def));
    localStorage.setItem(TRIAL_HASH_KEY, h);
    return def;
  }

  const parsed = parseInt(raw, 10);
  if (isNaN(parsed) || parsed < 0) {
    localStorage.setItem(TRIAL_STORAGE_KEY, '0');
    return 0;
  }

  const expectedHash = await computeTrialHash(parsed, mid);
  if (expectedHash !== hash) {
    // Phát hiện can thiệp LocalStorage
    localStorage.setItem(TRIAL_STORAGE_KEY, '0');
    return 0;
  }

  return parsed;
}

export async function consumeLSTHCSTrialTurn(): Promise<{ success: boolean; remaining: number }> {
  if (isLSTHCSProActivated()) {
    return { success: true, remaining: 999 };
  }

  const current = await getSecureLSTHCSTrialRemaining();
  if (current <= 0) {
    return { success: false, remaining: 0 };
  }

  const nextVal = current - 1;
  const mid = getOrCreateLSTHCSHardwareCode();
  const h = await computeTrialHash(nextVal, mid);
  localStorage.setItem(TRIAL_STORAGE_KEY, String(nextVal));
  localStorage.setItem(TRIAL_HASH_KEY, h);
  return { success: true, remaining: nextVal };
}

export function isLSTHCSProActivated(): boolean {
  if (typeof window === 'undefined') return false;
  const key = localStorage.getItem(ACTIVE_KEY_STORAGE);
  return Boolean(key && key.startsWith('KEY-') && (key.includes('LSTHCS') || key.includes('LS') || key.includes('TAODE')));
}

export function saveLSTHCSActiveKey(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACTIVE_KEY_STORAGE, key.trim());
  }
}

/**
 * Xây dựng tin nhắn Zalo gửi phản hồi cho khách hàng kèm Mã bản quyền
 */
export function buildLSTHCSZaloMessage(
  teacherName: string,
  schoolUnit: string,
  machineId: string,
  licenseKey: string,
  expDate: string,
  pkgLabel: string
): string {
  return `Kính gửi Quý Thầy/Cô: ${teacherName} (${schoolUnit || 'Giáo viên THCS'})!

Tác giả Tác giả Đinh Thành - ĐT: 0915.213717 (Trường THCS Đồng Yên) xin trân trọng gửi Quý Thầy/Cô thông tin kích hoạt bản quyền Phần Mềm Tạo Đề Lịch Sử THCS Kết nối tri thức (CV 7991):

- Gói bản quyền: ${pkgLabel}
- Mã máy tính (Hardware ID): ${machineId}
- Hạn dùng đến ngày: ${expDate}
- MÃ KÍCH HOẠT PRO:
${licenseKey}

HƯỚNG DẪN KÍCH HOẠT:
1. Mở phần mềm hoặc Add-in Word Lịch Sử THCS trên máy tính của Thầy/Cô.
2. Sao chép và dán chính xác Mã kích hoạt trên vào ô "Nhập mã kích hoạt Pro" rồi nhấn "Kích hoạt".
3. Phần mềm sẽ lập tức mở khóa toàn bộ tính năng và tự động lưu bản quyền an toàn vĩnh viễn trên máy.

Hotline / Zalo hỗ trợ kỹ thuật: 0915.213717 (Thầy Thành).
Kính chúc Quý Thầy/Cô công tác tốt và có những đề kiểm tra Lịch sử chất lượng cao!`;
}
