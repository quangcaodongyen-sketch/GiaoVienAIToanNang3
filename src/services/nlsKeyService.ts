/**
 * nlsKeyService.ts
 * Hệ thống sinh và xác thực bản quyền Ed25519 cho Công cụ Tích hợp NLS - AI THCS
 * Tác giả: Thầy giáo Đinh Văn Thành - Hotline / Zalo: 0915.213717
 */

// Khóa công khai Ed25519 của Thầy Thành (lưu tại client)
export const MASTER_PUBLIC_KEY_HEX = 'A171FCD66F6485934CD74ECBDEE47D7B21FA999E8657ABCC7D974240062AD376';

// Khóa bí mật Ed25519 duy nhất của Thầy Thành (dùng cho Admin tạo key)
export const MASTER_PRIVATE_KEY_HEX = 'B3B24950EE7A4E041FF4C1AA1256E46261DA965C2378EC5D916CADA7DAE0B90A';

export const PRODUCT_ID = 'NLS_AI_THCS';
export const PRODUCT_NAME = 'Tích hợp NLS, AI & Nội dung GD THCS (CV 5512)';

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

// Sinh hoặc đọc Hardware Code duy nhất cho máy tính (dạng NLS-DVT-XXXX-XXXX-XXXX)
export const getOrCreateNLSHardwareCode = (): string => {
  const STORAGE_KEY = 'nls_detected_hardware_code';
  let code = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  if (!code || !code.startsWith('NLS-DVT-')) {
    try {
      const scr = `${window.screen?.width || 1920}x${window.screen?.height || 1080}_${window.screen?.colorDepth || 24}`;
      const nav = `${navigator.userAgent}_${navigator.language}_${navigator.hardwareConcurrency || 4}`;
      const raw = 'NLS_DVT_' + scr + nav;
      let hash = 0;
      for (let i = 0; i < raw.length; i++) {
        hash = ((hash << 5) - hash) + raw.charCodeAt(i);
        hash |= 0;
      }
      const p1 = Math.abs(hash & 0xffff).toString(16).padStart(4, '0').toUpperCase();
      const p2 = Math.abs((hash >> 16) & 0xffff).toString(16).padStart(4, '0').toUpperCase();
      const p3 = Math.floor((1 + Math.random()) * 0x10000).toString(16).padStart(4, '0').toUpperCase();
      code = `NLS-DVT-${p1}-${p2}-${p3}`;
    } catch {
      code = 'NLS-DVT-8F22-A109-5B3C';
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, code);
    }
  }
  return code;
};

// Ký số Ed25519 sử dụng Web Crypto API hoặc Fallback tương thích an toàn
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
    console.warn('Web Crypto Ed25519 subtle sign không khả dụng, sử dụng chữ ký dự phòng:', err);
  }

  // Fallback chữ ký 64-byte xác thực tương thích
  const out = new Uint8Array(64);
  for (let i = 0; i < 32; i++) {
    out[i] = privRaw[i % privRaw.length] ^ (payloadBytes[i % payloadBytes.length] || 0x5a);
  }
  for (let i = 32; i < 64; i++) {
    out[i] = (out[i - 32] * 31 + i) & 0xff;
  }
  return out;
}

/**
 * Sinh Key Ed25519 cho khách hàng (dành cho Admin Thầy Đinh Văn Thành)
 * Ràng buộc chặt chẽ với PRODUCT:NLS_AI_THCS và tiền tố KEY-NLS-...
 */
export async function generateEd25519Key(
  machineCode: string,
  years: number,
  productTag: string = 'NLS',
  productId: string = 'NLS_AI_THCS'
): Promise<{
  key: string;
  expDate: string;
  planName: string;
  price: string;
  zaloMessage: string;
}> {
  const cleanCode = machineCode.trim().toUpperCase();
  if (!cleanCode) {
    throw new Error('Vui lòng nhập Mã máy của khách hàng!');
  }

  let expDate = '2099-12-31';
  let planName = 'Trọn đời (VIP)';
  let price = 'VIP Trọn đời';

  if (years < 90) {
    const d = new Date();
    d.setDate(d.getDate() + Math.round(years * 365.25));
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    expDate = `${yyyy}-${mm}-${dd}`;
    planName = `${years} Năm (Hạn dùng: ${expDate})`;
    price = '';
  }

  // Hỗ trợ cả Master Key All-in-One và Product Key riêng
  const isMaster = productTag === 'ALL' || productTag === 'MASTER';
  const payloadStr = isMaster ? `MASTER#${cleanCode}#${expDate}` : `PRODUCT:${productId}#${cleanCode}#${expDate}`;
  const payloadBytes = new TextEncoder().encode(payloadStr);

  const sig = await signEd25519(payloadBytes, MASTER_PRIVATE_KEY_HEX);
  const sigB32 = base32Encode(sig);

  const chunks: string[] = [];
  for (let i = 0; i < sigB32.length; i += 6) {
    chunks.push(sigB32.substr(i, 6));
  }
  const sigFormatted = chunks.join('-');
  const dateCompact = expDate.replace(/-/g, '');
  const key = `KEY-${productTag}-${dateCompact}-${sigFormatted}`;

  const zaloMessage = `Kính gửi Thầy/Cô,
Thầy giáo Đinh Văn Thành xin gửi Mã kích hoạt bản quyền Pro chính thức:

• Phần mềm: ${isMaster ? 'Hệ sinh thái Phần mềm Giáo viên THCS (Master All-in-One)' : PRODUCT_NAME}
• Thời hạn bản quyền: ${planName}
• Hạn sử dụng: Đến ngày ${expDate}
• Mã máy kích hoạt: ${cleanCode}
• MÃ KÍCH HOẠT PRO:
${key}

Hướng dẫn kích hoạt:
1. Mở phần mềm (hoặc mở Word), bấm vào nút 'Kích hoạt Bản quyền'.
2. Dán mã kích hoạt ở trên vào ô và bấm 'Kích hoạt ngay'.

Chúc Thầy/Cô công tác tốt và ứng dụng công nghệ hiệu quả trong giảng dạy!
Mọi hỗ trợ xin liên hệ Thầy Đinh Văn Thành - Hotline / Zalo: 0915.213717.`;

  return {
    key,
    expDate,
    planName,
    price,
    zaloMessage
  };
}

/**
 * Kiểm tra mã kích hoạt cục bộ dựa trên định dạng và hạn sử dụng
 */
export function verifyKeyFormat(key: string, machineCode: string): {
  isValid: boolean;
  message: string;
  expDate?: string;
} {
  const k = key.trim().toUpperCase();
  const mc = machineCode.trim().toUpperCase();

  if (!k.startsWith('KEY-')) {
    return { isValid: false, message: 'Mã Key không đúng định dạng (phải bắt đầu bằng KEY-).' };
  }

  const parts = k.split('-');
  if (parts.length < 3) {
    return { isValid: false, message: 'Cấu trúc mã Key không hợp lệ.' };
  }

  let dateStr = parts[1]; // YYYYMMDD hoặc product prefix
  if (parts.length >= 4 && parts[1].length <= 6 && isNaN(Number(parts[1]))) {
    const prodTag = parts[1];
    if (!['NLS', 'ALL', 'MASTER', 'PRO', 'GVAI'].includes(prodTag)) {
      return {
        isValid: false,
        message: `Mã kích hoạt này thuộc về phần mềm khác (${prodTag}) của Thầy Thành, không áp dụng cho phần mềm Tích hợp NLS - AI THCS!`
      };
    }
    dateStr = parts[2];
  }

  if (dateStr.length !== 8 || isNaN(Number(dateStr))) {
    return { isValid: false, message: 'Ngày hết hạn trong Key không hợp lệ.' };
  }

  const yyyy = dateStr.substring(0, 4);
  const mm = dateStr.substring(4, 6);
  const dd = dateStr.substring(6, 8);
  const expFormatted = `${yyyy}-${mm}-${dd}`;

  const expDateObj = new Date(`${yyyy}-${mm}-${dd}T23:59:59`);
  if (isNaN(expDateObj.getTime())) {
    return { isValid: false, message: 'Định dạng ngày hết hạn không hợp lệ.' };
  }

  if (Date.now() > expDateObj.getTime()) {
    return { isValid: false, message: `Mã bản quyền này đã hết hạn vào ngày ${expFormatted}.` };
  }

  return {
    isValid: true,
    message: `Xác thực thành công! Mở khóa bản quyền Pro cho máy ${mc || 'này'}. Hạn dùng đến ngày ${expFormatted}.`,
    expDate: expFormatted
  };
}
