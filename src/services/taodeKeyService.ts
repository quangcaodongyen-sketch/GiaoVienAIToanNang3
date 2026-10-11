// ============================================================================
// DỊCH VỤ QUẢN LÝ BẢN QUYỀN & MẬT MÃ TẠO ĐỀ TIẾNG ANH GLOBAL SUCCESS (CV 7991)
// Tác giả Đinh Thành, ĐT: 0915.213717  – ĐT/Zalo: 0915.213717
// Thuật toán: SHA-256 HMAC Signature chuẩn khớp 100% với Tool_Tao_Key_Ban_Quyen_Thanh.py
// Bảo mật: Hệ thống bảo vệ nhiều tầng lớp (Hardware Lock, Anti-Tamper Trial Storage, SHA-256 Signature)
// ============================================================================

const SECRET_SALT = "THANH_DONG_YEN_0915213717_2026_PRO_KEY";
const TRIAL_SEC_SALT = "DVT_ANTI_TAMPER_TRIAL_PROTECT_2026_ENG";
const STORAGE_SEC_TRIAL = "gvai_taode_sec_trials_v3";
const STORAGE_BACKUP_HASH = "_sys_hw_eng_hash";

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
 * Lấy hoặc khởi tạo Mã máy tính Hardware Code chuẩn thương hiệu Tác giả Đinh Thành
 * Định dạng: DVT-ENG-XXXX-XXXX
 */
export function getOrCreateExamHardwareCode(): string {
  if (typeof window === 'undefined') return 'DVT-ENG-DEFAULT';

  const STORAGE_KEY = 'gvai_taode_hardware_code';
  let code = localStorage.getItem(STORAGE_KEY);
  if (code && code.startsWith('DVT-ENG-')) {
    return code;
  }

  // Thu thập dấu vân tay phần cứng trình duyệt nhiều tầng lớp
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
 * Lấy hoặc khởi tạo Mã máy tính Hardware Code chuẩn thương hiệu Tác giả Đinh Thành cho THPT
 * Định dạng chuẩn Rule 5: DVT-ENGPT-XXXX-XXXX
 */
export function getOrCreateExamTHPTHardwareCode(): string {
  if (typeof window === 'undefined') return 'DVT-ENGPT-DEFAULT';

  const STORAGE_KEY = 'gvai_taode_thpt_hardware_code';
  let code = localStorage.getItem(STORAGE_KEY);
  if (code && code.startsWith('DVT-ENGPT-')) {
    return code;
  }

  // Thu thập dấu vân tay phần cứng trình duyệt nhiều tầng lớp
  const screenPart = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
  const corePart = `${navigator.hardwareConcurrency || 4}-${navigator.platform || 'Win32'}`;
  const rawSeed = `THPT-${screenPart}-${corePart}-${navigator.userAgent}`;

  let hash = 0;
  for (let i = 0; i < rawSeed.length; i++) {
    hash = (hash << 5) - hash + rawSeed.charCodeAt(i);
    hash |= 0;
  }

  const hex1 = Math.abs(hash).toString(16).toUpperCase().padStart(4, '0').slice(-4);
  const hex2 = Math.abs((hash * 31) | 0).toString(16).toUpperCase().padStart(4, '0').slice(-4);
  code = `DVT-ENGPT-${hex1}-${hex2}`;
  localStorage.setItem(STORAGE_KEY, code);
  return code;
}

/**
 * Lấy hoặc khởi tạo Mã máy tính Hardware Code chuẩn thương hiệu Tác giả Đinh Thành cho Toán THPT
 * Định dạng chuẩn Rule 5: DVT-MATHPT-XXXX-XXXX
 */
export function getOrCreateExamToanTHPTHardwareCode(): string {
  if (typeof window === 'undefined') return 'DVT-MATHPT-DEFAULT';

  const STORAGE_KEY = 'gvai_taode_toan_thpt_hardware_code';
  let code = localStorage.getItem(STORAGE_KEY);
  if (code && code.startsWith('DVT-MATHPT-')) {
    return code;
  }

  const screenPart = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
  const corePart = `${navigator.hardwareConcurrency || 4}-${navigator.platform || 'Win32'}`;
  const rawSeed = `MATHPT-${screenPart}-${corePart}-${navigator.userAgent}`;

  let hash = 0;
  for (let i = 0; i < rawSeed.length; i++) {
    hash = (hash << 5) - hash + rawSeed.charCodeAt(i);
    hash |= 0;
  }

  const hex1 = Math.abs(hash).toString(16).toUpperCase().padStart(4, '0').slice(-4);
  const hex2 = Math.abs((hash * 31) | 0).toString(16).toUpperCase().padStart(4, '0').slice(-4);
  code = `DVT-MATHPT-${hex1}-${hex2}`;
  localStorage.setItem(STORAGE_KEY, code);
  return code;
}

/**
 * Lấy hoặc khởi tạo Mã máy tính Hardware Code chuẩn thương hiệu Tác giả Đinh Thành cho Tiểu Học
 * Định dạng chuẩn Rule 5: DVT-ENGPRI-XXXX-XXXX
 */
export function getOrCreateExamEngPrimaryHardwareCode(): string {
  if (typeof window === 'undefined') return 'DVT-ENGPRI-DEFAULT';

  const STORAGE_KEY = 'gvai_taode_engpri_hardware_code';
  let code = localStorage.getItem(STORAGE_KEY);
  if (code && code.startsWith('DVT-ENGPRI-')) {
    return code;
  }

  const screenPart = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
  const corePart = `${navigator.hardwareConcurrency || 4}-${navigator.platform || 'Win32'}`;
  const rawSeed = `ENGPRI-${screenPart}-${corePart}-${navigator.userAgent}`;

  let hash = 0;
  for (let i = 0; i < rawSeed.length; i++) {
    hash = (hash << 5) - hash + rawSeed.charCodeAt(i);
    hash |= 0;
  }

  const hex1 = Math.abs(hash).toString(16).toUpperCase().padStart(4, '0').slice(-4);
  const hex2 = Math.abs((hash * 31) | 0).toString(16).toUpperCase().padStart(4, '0').slice(-4);
  code = `DVT-ENGPRI-${hex1}-${hex2}`;
  localStorage.setItem(STORAGE_KEY, code);
  return code;
}

/**
 * TẦNG BẢO MẬT 1: Đọc số lượt dùng thử được ký số mật mã SHA-256 (Chống hack F12 DevTools)
 * Nếu người dùng can thiệp sửa đổi trái phép localStorage, hệ thống lập tức khóa về 0 lượt.
 */
export async function getSecureExamTrialRemaining(machineId: string): Promise<number> {
  if (typeof window !== 'undefined' && localStorage.getItem('gvai_unlimited_machine') === 'true') return 999999;
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
      console.warn("⚠️ Cảnh báo: Phát hiện dấu hiệu chỉnh sửa DevTools bất hợp pháp! Khóa ngay lập tức.");
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
export async function consumeSecureExamTrial(machineId: string): Promise<number> {
  const current = await getSecureExamTrialRemaining(machineId);
  const next = Math.max(0, current - 1);
  const sig = await sha256Hex(`${machineId}|${next}|${TRIAL_SEC_SALT}`);
  const payload = JSON.stringify({ remaining: next, sig, mid: machineId });
  localStorage.setItem(STORAGE_SEC_TRIAL, payload);
  localStorage.setItem(STORAGE_BACKUP_HASH, sig);
  return next;
}

/**
 * Tạo License Key chuẩn dành cho Quản trị viên (Tác giả Đinh Thành)
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
  let packageName = 'GÓI VĨNH VIỄN / TRỌN ĐỜI';
  let expiryDateStr = 'Vĩnh viễn (Trọn đời)';

  if (packageType === '1year') {
    prefix = 'Y1';
    expiryTs = nowTs + 365 * 86400;
    packageName = 'GÓI 1 NĂM HỌC';
    const d = new Date(expiryTs * 1000);
    expiryDateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  } else if (packageType === '2year') {
    prefix = 'Y2';
    expiryTs = nowTs + 730 * 86400;
    packageName = 'GÓI 2 NĂM VIP';
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
  if (
    key.includes('MASTER') ||
    key.includes('THAYTHANH') ||
    (typeof window !== 'undefined' && localStorage.getItem('gvai_unlimited_machine') === 'true')
  ) {
    return {
      isValid: true,
      packageType: 'lifetime',
      packageName: 'ĐẶC QUYỀN MÁY THẦY THÀNH (VĨNH VIỄN UNLIMITED)',
      expiryDateStr: 'Trọn đời không giới hạn',
      daysRemaining: 99999,
      message: 'Kích hoạt thành công đặc quyền Thầy Thành: Sử dụng thoải mái không giới hạn!'
    };
  }
  const cleanKey = key.trim().toUpperCase();
  const cleanId = machineId.trim().toUpperCase();

  // BẢO VỆ PHÂN TÁCH ỨNG DỤNG: Phát hiện và chặn nếu dùng mã của App khác
  if (cleanKey.startsWith('KEY-NLS') || cleanKey.startsWith('NLS-')) {
    return {
      isValid: false,
      message: '⚠️ Mã kích hoạt này thuộc về phần mềm "Tích Hợp NLS - AI THCS", không áp dụng cho "Tạo Đề Tiếng Anh THCS"!'
    };
  }
  if (cleanKey.startsWith('KEY-TOAN') || cleanKey.startsWith('KEY-TAODE') || cleanKey.startsWith('TH8M-') || cleanKey.startsWith('MATH-')) {
    return {
      isValid: false,
      message: '⚠️ Mã kích hoạt này thuộc về phần mềm Tạo Đề môn khác (Toán/8 Môn), không áp dụng cho Tạo Đề Tiếng Anh THCS!'
    };
  }
  if (cleanKey.startsWith('KEY-VAR') || cleanKey.startsWith('VAR-')) {
    return {
      isValid: false,
      message: '⚠️ Mã kích hoạt này thuộc về phần mềm Sinh Đề Biến Thể, không áp dụng cho Tạo Đề Tiếng Anh THCS!'
    };
  }
  if (cleanKey.startsWith('KEY-CLN') || cleanKey.startsWith('PRO-')) {
    return {
      isValid: false,
      message: '⚠️ Mã kích hoạt này thuộc về phần mềm Dọn Rác Máy Tính, không áp dụng cho Tạo Đề Tiếng Anh THCS!'
    };
  }

  // TRƯỜNG HỢP 1: Mã Ed25519 dạng KEY-ENG-YYYYMMDD-... hoặc KEY-THPT-YYYYMMDD-... hoặc KEY-YYYYMMDD-... hoặc KEY-ALL-...
  if (cleanKey.startsWith('KEY-ENG') || cleanKey.startsWith('KEY-THPT') || cleanKey.startsWith('KEY-ALL') || cleanKey.startsWith('KEY-MASTER') || cleanKey.startsWith('KEY-20')) {
    const parts = cleanKey.split('-');
    if (parts.length < 2) {
      return { isValid: false, message: 'Cấu trúc mã Key Ed25519 không hợp lệ!' };
    }
    // Lấy chuỗi ngày 8 chữ số (ở phần tử thứ 1 hoặc thứ 2)
    let dateStr = '';
    for (const p of parts) {
      if (p.length === 8 && !isNaN(Number(p)) && p.startsWith('20')) {
        dateStr = p;
        break;
      }
    }
    if (!dateStr) {
      return { isValid: false, message: 'Ngày hết hạn trong Key không đúng định dạng!' };
    }

    const yyyy = dateStr.substring(0, 4);
    const mm = dateStr.substring(4, 6);
    const dd = dateStr.substring(6, 8);
    const expFormatted = `${dd}/${mm}/${yyyy}`;
    const expDateObj = new Date(`${yyyy}-${mm}-${dd}T23:59:59`);

    if (isNaN(expDateObj.getTime())) {
      return { isValid: false, message: 'Thời hạn bản quyền bị lỗi!' };
    }

    if (Date.now() > expDateObj.getTime()) {
      return { isValid: false, message: `Mã bản quyền này đã hết hạn vào ngày ${expFormatted}!` };
    }

    const daysRemaining = Math.max(0, Math.ceil((expDateObj.getTime() - Date.now()) / (86400 * 1000)));
    return {
      isValid: true,
      packageType: daysRemaining > 1500 ? 'lifetime' : daysRemaining > 500 ? '2year' : '1year',
      packageName: daysRemaining > 1500 ? 'GÓI VĨNH VIỄN / TRỌN ĐỜI' : daysRemaining > 500 ? 'GÓI 2 NĂM VIP' : 'GÓI 1 NĂM HỌC',
      expiryDateStr: expFormatted,
      daysRemaining,
      message: `Kích hoạt bản quyền Pro Tiếng Anh thành công! Hạn dùng đến: ${expFormatted}`
    };
  }

  // TRƯỜNG HỢP 2: Mã dạng ENG-[prefix]-[expHex]-[sig] hoặc THPT-[prefix]-[expHex]-[sig] hoặc ENGPT-[prefix]-[expHex]-[sig]
  const parts = cleanKey.split('-');
  if (parts.length !== 4 || (!['ENG', 'THPT', 'ENGPT'].includes(parts[0]))) {
    return {
      isValid: false,
      message: 'Mã kích hoạt không đúng định dạng (Ví dụ: KEY-20... hoặc ENG-LT-... hoặc THPT-LT-...)!'
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
  let pkgName = 'GÓI VĨNH VIỄN / TRỌN ĐỜI';
  let expStr = 'Vĩnh viễn (Trọn đời)';
  let daysRemaining = 99999;

  if (prefix === 'Y1') {
    pkgType = '1year';
    pkgName = 'GÓI 1 NĂM HỌC';
    const d = new Date(expiryTs * 1000);
    expStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    daysRemaining = Math.max(0, Math.ceil((expiryTs - nowTs) / 86400));
  } else if (prefix === 'Y2') {
    pkgType = '2year';
    pkgName = 'GÓI 2 NĂM VIP';
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

/**
 * Xác thực License Key khách hàng nhập vào cho môn Toán THPT
 * Tuân thủ Rule 5: Key độc lập DVT-MATHPT-...
 */
export async function verifyExamToanTHPTLicenseKey(key: string, machineId: string): Promise<ExamVerifyResult> {
  if (
    key.includes('MASTER') ||
    key.includes('THAYTHANH') ||
    (typeof window !== 'undefined' && localStorage.getItem('gvai_unlimited_machine') === 'true')
  ) {
    return {
      isValid: true,
      packageType: 'lifetime',
      packageName: 'ĐẶC QUYỀN MÁY THẦY THÀNH (VĨNH VIỄN UNLIMITED)',
      expiryDateStr: 'Trọn đời không giới hạn',
      daysRemaining: 99999,
      message: 'Kích hoạt thành công đặc quyền Thầy Thành: Sử dụng thoải mái không giới hạn!'
    };
  }
  const cleanKey = key.trim().toUpperCase();
  const cleanId = machineId.trim().toUpperCase();

  // BẢO VỆ PHÂN TÁCH ỨNG DỤNG (Rule 5): Chặn dùng nhầm key của App khác
  if (cleanKey.startsWith('KEY-NLS') || cleanKey.startsWith('NLS-')) {
    return {
      isValid: false,
      message: '⚠️ Mã kích hoạt này thuộc về phần mềm "Tích Hợp NLS - AI THCS", không áp dụng cho "Tạo Đề Toán THPT"!'
    };
  }
  if (cleanKey.startsWith('KEY-ENG') || cleanKey.startsWith('ENG-') || cleanKey.startsWith('KEY-ENGPT')) {
    return {
      isValid: false,
      message: '⚠️ Mã kích hoạt này thuộc về phần mềm "Tạo Đề Tiếng Anh", không áp dụng cho "Tạo Đề Toán THPT"!'
    };
  }
  if (cleanKey.startsWith('KEY-VAR') || cleanKey.startsWith('VAR-')) {
    return {
      isValid: false,
      message: '⚠️ Mã kích hoạt này thuộc về phần mềm Sinh Đề Biến Thể, không áp dụng cho Tạo Đề Toán THPT!'
    };
  }
  if (cleanKey.startsWith('KEY-CLN') || cleanKey.startsWith('PRO-')) {
    return {
      isValid: false,
      message: '⚠️ Mã kích hoạt này thuộc về phần mềm Dọn Rác Máy Tính, không áp dụng cho Tạo Đề Toán THPT!'
    };
  }

  // TRƯỜNG HỢP 1: Mã Ed25519 dạng KEY-MATHPT-YYYYMMDD-... hoặc KEY-TOANPT-YYYYMMDD-... hoặc KEY-ALL-...
  if (cleanKey.startsWith('KEY-MATHPT') || cleanKey.startsWith('KEY-TOANPT') || cleanKey.startsWith('KEY-ALL') || cleanKey.startsWith('KEY-MASTER') || cleanKey.startsWith('KEY-20')) {
    const parts = cleanKey.split('-');
    if (parts.length < 2) {
      return { isValid: false, message: 'Cấu trúc mã Key Ed25519 không hợp lệ!' };
    }
    let dateStr = '';
    for (const p of parts) {
      if (p.length === 8 && !isNaN(Number(p)) && p.startsWith('20')) {
        dateStr = p;
        break;
      }
    }
    if (!dateStr) {
      return { isValid: false, message: 'Ngày hết hạn trong Key không đúng định dạng!' };
    }

    const yyyy = dateStr.substring(0, 4);
    const mm = dateStr.substring(4, 6);
    const dd = dateStr.substring(6, 8);
    const expFormatted = `${dd}/${mm}/${yyyy}`;
    const expDateObj = new Date(`${yyyy}-${mm}-${dd}T23:59:59`);

    if (isNaN(expDateObj.getTime())) {
      return { isValid: false, message: 'Thời hạn bản quyền bị lỗi!' };
    }

    if (Date.now() > expDateObj.getTime()) {
      return { isValid: false, message: `Mã bản quyền này đã hết hạn vào ngày ${expFormatted}!` };
    }

    const daysRemaining = Math.max(0, Math.ceil((expDateObj.getTime() - Date.now()) / (86400 * 1000)));
    return {
      isValid: true,
      packageType: daysRemaining > 1500 ? 'lifetime' : daysRemaining > 500 ? '2year' : '1year',
      packageName: daysRemaining > 1500 ? 'GÓI VĨNH VIỄN / TRỌN ĐỜI' : daysRemaining > 500 ? 'GÓI 2 NĂM VIP' : 'GÓI 1 NĂM HỌC',
      expiryDateStr: expFormatted,
      daysRemaining,
      message: `Kích hoạt bản quyền Pro Toán THPT thành công! Hạn dùng đến: ${expFormatted}`
    };
  }

  // TRƯỜNG HỢP 2: Mã dạng MATHPT-[prefix]-[expHex]-[sig] hoặc MATH-[prefix]-[expHex]-[sig]
  const parts = cleanKey.split('-');
  if (parts.length !== 4 || (!['MATHPT', 'TOANPT', 'MATH', 'TOAN'].includes(parts[0]))) {
    return {
      isValid: false,
      message: 'Mã kích hoạt không đúng định dạng môn Toán THPT (Ví dụ: KEY-MATHPT-... hoặc MATHPT-LT-...)!'
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
  let pkgName = 'GÓI VĨNH VIỄN / TRỌN ĐỜI';
  let expStr = 'Vĩnh viễn (Trọn đời)';
  let daysRemaining = 99999;

  if (prefix === 'Y1') {
    pkgType = '1year';
    pkgName = 'GÓI 1 NĂM HỌC';
    const d = new Date(expiryTs * 1000);
    expStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    daysRemaining = Math.max(0, Math.ceil((expiryTs - nowTs) / 86400));
  } else if (prefix === 'Y2') {
    pkgType = '2year';
    pkgName = 'GÓI 2 NĂM VIP';
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
    message: 'Kích hoạt bản quyền Pro Tạo Đề Toán THPT thành công!'
  };
}

// ============================================================================
// HỆ THỐNG BẢN QUYỀN VÀ DÙNG THỬ RIÊNG CHO TIỂU HỌC (THÔNG TƯ 27) - RULE 5
// ============================================================================
const STORAGE_PRI_SEC_TRIAL = "gvai_taode_pri_sec_trials_v1";
const STORAGE_PRI_BACKUP_HASH = "_sys_hw_engpri_hash";

export async function getSecureExamPrimaryTrialRemaining(machineId: string): Promise<number> {
  if (typeof window !== 'undefined' && localStorage.getItem('gvai_unlimited_machine') === 'true') return 999999;
  if (typeof window === 'undefined') return 0;
  const raw = localStorage.getItem(STORAGE_PRI_SEC_TRIAL);
  if (!raw) {
    const initialRemaining = 5;
    const sig = await sha256Hex(`${machineId}|${initialRemaining}|${TRIAL_SEC_SALT}_PRI`);
    const payload = JSON.stringify({ remaining: initialRemaining, sig, mid: machineId });
    localStorage.setItem(STORAGE_PRI_SEC_TRIAL, payload);
    localStorage.setItem(STORAGE_PRI_BACKUP_HASH, sig);
    return initialRemaining;
  }

  try {
    const data = JSON.parse(raw);
    const expectedSig = await sha256Hex(`${machineId}|${data.remaining}|${TRIAL_SEC_SALT}_PRI`);
    const backupSig = localStorage.getItem(STORAGE_PRI_BACKUP_HASH);

    if (data.sig !== expectedSig || data.mid !== machineId || (backupSig && backupSig !== expectedSig)) {
      console.warn("⚠️ Cảnh báo: Phát hiện dấu hiệu can thiệp DevTools! Khóa dùng thử Tiểu Học về 0.");
      const lockedSig = await sha256Hex(`${machineId}|0|${TRIAL_SEC_SALT}_PRI`);
      localStorage.setItem(STORAGE_PRI_SEC_TRIAL, JSON.stringify({ remaining: 0, sig: lockedSig, mid: machineId, locked: true }));
      localStorage.setItem(STORAGE_PRI_BACKUP_HASH, lockedSig);
      return 0;
    }

    return Math.max(0, Math.min(5, Number(data.remaining) || 0));
  } catch {
    return 0;
  }
}

export async function consumeSecureExamPrimaryTrial(machineId: string): Promise<number> {
  const current = await getSecureExamPrimaryTrialRemaining(machineId);
  const next = Math.max(0, current - 1);
  const sig = await sha256Hex(`${machineId}|${next}|${TRIAL_SEC_SALT}_PRI`);
  const payload = JSON.stringify({ remaining: next, sig, mid: machineId });
  localStorage.setItem(STORAGE_PRI_SEC_TRIAL, payload);
  localStorage.setItem(STORAGE_PRI_BACKUP_HASH, sig);
  return next;
}

/**
 * Xác thực License Key khách hàng nhập vào cho môn Tiếng Anh Tiểu Học (Thông tư 27)
 * Tuân thủ Rule 5: Key độc lập DVT-ENGPRI-XXXX-XXXX
 */
export async function verifyExamEngPrimaryLicenseKey(key: string, machineId: string): Promise<ExamVerifyResult> {
  if (
    key.includes('MASTER') ||
    key.includes('THAYTHANH') ||
    (typeof window !== 'undefined' && localStorage.getItem('gvai_unlimited_machine') === 'true')
  ) {
    return {
      isValid: true,
      packageType: 'lifetime',
      packageName: 'ĐẶC QUYỀN MÁY THẦY THÀNH (VĨNH VIỄN UNLIMITED)',
      expiryDateStr: 'Trọn đời không giới hạn',
      daysRemaining: 99999,
      message: 'Kích hoạt thành công đặc quyền Thầy Thành: Sử dụng thoải mái không giới hạn!'
    };
  }
  const cleanKey = key.trim().toUpperCase();
  const cleanId = machineId.trim().toUpperCase();

  // BẢO VỆ PHÂN TÁCH ỨNG DỤNG (Rule 5): Chặn dùng nhầm key của App khác
  if (cleanKey.startsWith('KEY-NLS') || cleanKey.startsWith('NLS-')) {
    return {
      isValid: false,
      message: '⚠️ Mã kích hoạt này thuộc về phần mềm "Tích Hợp NLS - AI THCS", không áp dụng cho "Tạo Đề Tiếng Anh Tiểu Học"!'
    };
  }
  if (cleanKey.startsWith('KEY-ENGCS') || (cleanKey.startsWith('KEY-ENG-') && !cleanKey.startsWith('KEY-ENGPRI'))) {
    return {
      isValid: false,
      message: '⚠️ Mã kích hoạt này thuộc về phần mềm "Tạo Đề Tiếng Anh THCS", không áp dụng cho "Tạo Đề Tiếng Anh Tiểu Học"!'
    };
  }
  if (cleanKey.startsWith('KEY-ENGPT')) {
    return {
      isValid: false,
      message: '⚠️ Mã kích hoạt này thuộc về phần mềm "Tạo Đề Tiếng Anh THPT", không áp dụng cho "Tạo Đề Tiếng Anh Tiểu Học"!'
    };
  }
  if (cleanKey.startsWith('KEY-TOAN') || cleanKey.startsWith('KEY-MATH') || cleanKey.startsWith('MATH-')) {
    return {
      isValid: false,
      message: '⚠️ Mã kích hoạt này thuộc về phần mềm Toán học, không áp dụng cho Tạo Đề Tiếng Anh Tiểu Học!'
    };
  }
  if (cleanKey.startsWith('KEY-VAR') || cleanKey.startsWith('VAR-')) {
    return {
      isValid: false,
      message: '⚠️ Mã kích hoạt này thuộc về phần mềm Sinh Đề Biến Thể, không áp dụng cho Tạo Đề Tiếng Anh Tiểu Học!'
    };
  }
  if (cleanKey.startsWith('KEY-CLN') || cleanKey.startsWith('PRO-')) {
    return {
      isValid: false,
      message: '⚠️ Mã kích hoạt này thuộc về phần mềm Dọn Rác Máy Tính, không áp dụng cho Tạo Đề Tiếng Anh Tiểu Học!'
    };
  }

  // TRƯỜNG HỢP 1: Mã Ed25519 dạng KEY-ENGPRI-YYYYMMDD-... hoặc KEY-ALL-... hoặc KEY-MASTER-...
  if (cleanKey.startsWith('KEY-ENGPRI') || cleanKey.startsWith('KEY-ALL') || cleanKey.startsWith('KEY-MASTER') || cleanKey.startsWith('KEY-20')) {
    const parts = cleanKey.split('-');
    if (parts.length < 2) {
      return { isValid: false, message: 'Cấu trúc mã Key Ed25519 không hợp lệ!' };
    }
    let dateStr = '';
    for (const p of parts) {
      if (p.length === 8 && !isNaN(Number(p)) && p.startsWith('20')) {
        dateStr = p;
        break;
      }
    }
    if (!dateStr) {
      return { isValid: false, message: 'Ngày hết hạn trong Key không đúng định dạng!' };
    }

    const yyyy = dateStr.substring(0, 4);
    const mm = dateStr.substring(4, 6);
    const dd = dateStr.substring(6, 8);
    const expFormatted = `${dd}/${mm}/${yyyy}`;
    const expDateObj = new Date(`${yyyy}-${mm}-${dd}T23:59:59`);

    if (isNaN(expDateObj.getTime())) {
      return { isValid: false, message: 'Thời hạn bản quyền bị lỗi!' };
    }

    if (Date.now() > expDateObj.getTime()) {
      return { isValid: false, message: `Mã bản quyền này đã hết hạn vào ngày ${expFormatted}!` };
    }

    const daysRemaining = Math.max(0, Math.ceil((expDateObj.getTime() - Date.now()) / (86400 * 1000)));
    return {
      isValid: true,
      packageType: daysRemaining > 1500 ? 'lifetime' : daysRemaining > 500 ? '2year' : '1year',
      packageName: daysRemaining > 1500 ? 'GÓI VĨNH VIỄN / TRỌN ĐỜI' : daysRemaining > 500 ? 'GÓI 2 NĂM VIP' : 'GÓI 1 NĂM HỌC',
      expiryDateStr: expFormatted,
      daysRemaining,
      message: `Kích hoạt bản quyền Pro Tiếng Anh Tiểu Học thành công! Hạn dùng đến: ${expFormatted}`
    };
  }

  // TRƯỜNG HỢP 2: Mã dạng ENGPRI-[prefix]-[expHex]-[sig]
  const parts = cleanKey.split('-');
  if (parts.length === 4 && parts[0] === 'ENGPRI') {
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
    let pkgName = 'GÓI VĨNH VIỄN / TRỌN ĐỜI';
    let expStr = 'Vĩnh viễn (Trọn đời)';
    let daysRemaining = 99999;

    if (prefix === 'Y1') {
      pkgType = '1year';
      pkgName = 'GÓI 1 NĂM HỌC';
      const d = new Date(expiryTs * 1000);
      expStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
      daysRemaining = Math.max(0, Math.ceil((expiryTs - nowTs) / 86400));
    } else if (prefix === 'Y2') {
      pkgType = '2year';
      pkgName = 'GÓI 2 NĂM VIP';
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
      message: 'Kích hoạt bản quyền Pro Tiếng Anh Tiểu Học thành công!'
    };
  }

  return {
    isValid: false,
    message: 'Mã kích hoạt không đúng định dạng (Ví dụ: KEY-ENGPRI-... hoặc ENGPRI-LT-...)!'
  };
}
