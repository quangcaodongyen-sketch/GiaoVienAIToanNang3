import officialRosterData from '../data/officialStudentRoster.json';
// =========================================================================
// HỆ THỐNG QUẢN LÝ HỌC SINH THEO LỚP & SỔ ĐIỂM TRỰC TUYẾN TOÀN DIỆN
// TÁC GIẢ BẢN QUYỀN: THẦY GIÁO ĐINH VĂN THÀNH - ĐIỆN THOẠI / ZALO: 0915.213717
// ĐƠN VỊ: TRƯỜNG THCS ĐỒNG YÊN
// =========================================================================


export interface OfficialStudentRosterItem {
  stt: number;
  studentCode: string;
  name: string;
  className: string;
  grade: number;
  dob: string;
  regularScore: number | null;
  midtermScore: number | null;
  finalScore: number | null;
  termAvg: number | null;
}

export interface MeritBonusItem {
  id: string;
  points: number;
  reason: string;
  awardedBy: string;
  createdAt: string;
}

export interface DailyLoginRewardInfo {
  points: number;
  isPromoToday: boolean;
  title: string;
  bannerText: string;
  todayStr: string;
}

export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * QUY TẮC KHUYẾN MẠI ĐĂNG NHẬP SƯ PHẠM:
 * - Khuyến mại duy nhất hôm nay (2026-10-28): Lần đăng nhập đầu tiên được cộng 10 điểm để tặng học sinh.
 * - Từ ngày mai (2026-10-29 trở đi): Học sinh mới đăng nhập sẽ cộng 5 điểm thôi.
 */
export function getYesterdayDateString(referenceDateStr?: string): string {
  try {
    const todayStr = referenceDateStr || getLocalDateString();
    const parts = todayStr.split('-').map(Number);
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      d.setDate(d.getDate() - 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
  } catch {}
  return '2026-10-27';
}

export function getDailyLoginRewardInfo(customDateStr?: string): DailyLoginRewardInfo {
  const todayStr = customDateStr || getLocalDateString();
  const PROMO_DATE = '2026-10-28';
  const isPromoToday = todayStr === PROMO_DATE;

  if (isPromoToday) {
    return {
      points: 10,
      isPromoToday: true,
      title: '🎁 KHUYẾN MẠI DUY NHẤT HÔM NAY (28/10): Tặng +10 Điểm Đăng Nhập Đầu Tiên!',
      bannerText: '🎁 KHUYẾN MẠI DUY NHẤT HÔM NAY (28/10): Tặng ngay +10 ĐIỂM cho lần đăng nhập đầu tiên vào học! (Từ ngày mai mới đăng nhập sẽ chỉ cộng +5 điểm)',
      todayStr
    };
  }

  return {
    points: 5,
    isPromoToday: false,
    title: '⭐ Điểm Chuyên Cần Đăng Nhập: +5 Điểm',
    bannerText: '⭐ Chăm chỉ học tập: Đăng nhập mỗi ngày nhận ngay +5 ĐIỂM chuyên cần vào Bảng xếp hạng!',
    todayStr
  };
}

export interface StudentLevelInfo {
  level: number;
  title: string;
  badge: string;
  icon: string;
  minPoints: number;
  maxPoints: number;
  currentPoints: number;
  progressPercent: number;
  pointsToNextLevel: number;
  crownType?: 'gold' | 'silver' | 'bronze' | null;
}

export function calculateStudentLevel(totalMeritPoints: number, rank?: number): StudentLevelInfo {
  const pts = Math.max(0, totalMeritPoints || 0);
  let level = 1;
  let title = 'Tân Binh Khởi Động';
  let badge = 'Tân Binh Khởi Động 🌱';
  let icon = '🌱';
  let minPoints = 0;
  let maxPoints = 50;

  if (pts >= 750) {
    level = 7;
    title = 'Huyền Thoại Toàn Năng';
    badge = 'Huyền Thoại Toàn Năng ⚡🔥';
    icon = '⚡';
    minPoints = 750;
    maxPoints = 1000;
  } else if (pts >= 500) {
    level = 6;
    title = 'Bậc Thầy Từ Vựng';
    badge = 'Bậc Thầy Từ Vựng 👑';
    icon = '👑';
    minPoints = 500;
    maxPoints = 750;
  } else if (pts >= 350) {
    level = 5;
    title = 'Đại Sư Xuất Chúng';
    badge = 'Đại Sư Xuất Chúng 🔮';
    icon = '🔮';
    minPoints = 350;
    maxPoints = 500;
  } else if (pts >= 200) {
    level = 4;
    title = 'Cao Thủ Tinh Anh';
    badge = 'Cao Thủ Tinh Anh 💎';
    icon = '💎';
    minPoints = 200;
    maxPoints = 350;
  } else if (pts >= 100) {
    level = 3;
    title = 'Chiến Binh Kiên Trì';
    badge = 'Chiến Binh Kiên Trì ⚔️';
    icon = '⚔️';
    minPoints = 100;
    maxPoints = 200;
  } else if (pts >= 50) {
    level = 2;
    title = 'Mầm Non Chăm Chỉ';
    badge = 'Mầm Non Chăm Chỉ 🌿';
    icon = '🌿';
    minPoints = 50;
    maxPoints = 100;
  } else {
    level = 1;
    title = 'Tân Binh Khởi Động';
    badge = 'Tân Binh Khởi Động 🌱';
    icon = '🌱';
    minPoints = 0;
    maxPoints = 50;
  }

  const span = maxPoints - minPoints;
  const progressPercent = span > 0 ? Math.min(100, Math.max(0, Math.round(((pts - minPoints) / span) * 100))) : 100;
  const pointsToNextLevel = Math.max(0, maxPoints - pts);

  let crownType: 'gold' | 'silver' | 'bronze' | null = null;
  if (rank === 1) crownType = 'gold';
  else if (rank === 2) crownType = 'silver';
  else if (rank === 3) crownType = 'bronze';

  return {
    level,
    title,
    badge,
    icon,
    minPoints,
    maxPoints,
    currentPoints: pts,
    progressPercent,
    pointsToNextLevel,
    crownType
  };
}

export interface ClassAttendanceStudentStatus {
  stt: number;
  studentCode: string;
  name: string;
  className: string;
  grade: number;
  dob: string;
  regularScore: number | null;
  hasEntered: boolean;
  totalMeritPoints: number;
  attendancePoints: number;
  vocabPoints: number;
  examBonusPoints: number;
  practicePoints: number;
  encouragementBonus?: number;
  teacherBonus?: number;
  bonusHistory?: MeritBonusItem[];
  levelInfo?: StudentLevelInfo;
  submissionsCount: number;
  highestExamScore: number | null;
  lastActive: string | null;
}

export interface ClassAttendanceReport {
  className: string;
  totalRoster: number;
  enteredCount: number;
  notEnteredCount: number;
  enteredPercentage: number;
  totalMeritPoints: number;
  students: ClassAttendanceStudentStatus[];
}

export type AcademicRank = 'XUAT_SAC' | 'GIOI' | 'KHA' | 'DAT' | 'CAN_CO_GANG';

export interface ClassRoom {
  id: string;
  name: string; // VD: "6A1", "7A1", "8A1", "9A1", "10A1", "11A1", "12A1"
  grade: number; // 6, 7, 8, 9, 10, 11, 12
  schoolYear: string; // VD: "2025 - 2026"
  homeroomTeacher: string; // VD: "Thầy Đinh Văn Thành"
  description?: string;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  studentCode: string; // VD: "HS7A1-01", "HS7A1-05"
  username?: string;
  password?: string;
  name: string;
  classId: string;
  className: string;
  grade: number;
  gender: 'Nam' | 'Nữ';
  dob?: string;
  parentPhone?: string;
  note?: string;
  createdAt: string;
  // Hệ thống tích điểm chuyên cần & thi đua học sinh
  attendancePoints?: number; // Điểm chuyên cần (đăng nhập: +5đ/ngày)
  vocabPoints?: number;      // Điểm học từ vựng (+10đ/bài unit)
  examBonusPoints?: number;  // Điểm thưởng bài thi GK (điểm thi x 10)
  practicePoints?: number;   // Điểm làm đề cương & bài tập (+10đ/phần)
  studyTimeMinutes?: number; // Thời gian tương tác học tập thực tế (phút)
  timePoints?: number;       // Điểm cộng theo thời gian (+3đ mỗi 5 phút)
  totalMeritPoints?: number; // Tổng điểm thi đua chuyên cần
  lastLoginDate?: string;    // Ngày đăng nhập gần nhất (YYYY-MM-DD)
  stt?: number;              // Số thứ tự theo sổ điểm chính thức
  regularScore?: number | null; // Điểm ĐGtx từ sổ điểm chính thức
  encouragementBonus?: number; // Điểm thưởng khuyến khích ôn thi GK1 (+15đ)
  teacherBonus?: number;       // Điểm thưởng giáo viên trao thêm do tích cực (+10, +20...)
  bonusHistory?: MeritBonusItem[]; // Nhật ký điểm thưởng công khai
  streakBonusAwardedDate?: string; // Ngày đã nhận thưởng pháo hoa học liên tiếp (+20đ) (YYYY-MM-DD)
}

export interface StudentSubmission {
  id: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  classId: string;
  className: string;
  grade: number;
  testType: 'sgk_exercise' | 'online_quiz' | 'gk_ck_exam';
  unitNumber: number;
  unitTitle: string;
  testTitle: string;
  score: number; // Thang 10 (làm tròn 1 chữ số thập phân)
  correctCount: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  submittedAt: string;
  rankLevel: AcademicRank;
  teacherFeedback?: string; // Lời phê của Thầy/Cô
  feedbackDate?: string;
}

export interface ClassLeaderboardItem {
  studentId: string;
  studentCode: string;
  studentName: string;
  className: string;
  gender: 'Nam' | 'Nữ';
  rank: number; // #1, #2, #3...
  testsCount: number;
  highestScore: number;
  averageScore: number;
  rankLevel: AcademicRank;
  recentTestTitle?: string;
  recentScore?: number;
  badges: string[];
  attendancePoints?: number;
  vocabPoints?: number;
  examBonusPoints?: number;
  practicePoints?: number;
  studyTimeMinutes?: number;
  timePoints?: number;
  encouragementBonus?: number;
  teacherBonus?: number;
  bonusHistory?: MeritBonusItem[];
  levelInfo?: StudentLevelInfo;
  totalMeritPoints: number;
}
export interface PurgeAndSyncRosterResult {
  totalOfficialStudents: number;
  totalOriginalCandidates: number;
  purgedDemoCount: number;
  mergedDuplicateCount: number;
  encouragementBonusGranted: number;
  totalSubmissionsPreserved: number;
  purgedDemoNames: string[];
  details: string[];
}


export interface StudentCheckinLog {
  id: string;
  studentId: string;
  studentCode: string;
  studentName: string;
  className: string;
  grade: number;
  action: string;
  detail?: string;
  timestamp: string;
}

export interface ClassComparisonStats {
  totalStudents: number;
  activeStudents: number;
  classAverageScore: number;
  highestScore: number;
  lowestScore: number;
  topStudentName: string;
  topStudentScore: number;
  rankCounts: Record<AcademicRank, number>;
}

const CLOUD_SYNC_ENDPOINT = '/api/students';
const CLOUD_STORAGE_FALLBACK = 'https://extendsclass.com/api/json-storage/bin/bbfdeba';

const STORAGE_KEYS = {
  CLASSES: 'gvai_gradebook_classes_v4_clean',
  STUDENTS: 'gvai_gradebook_students_v4_clean',
  SUBMISSIONS: 'gvai_gradebook_submissions_v4_clean',
  ACTIVE_STUDENT: 'gvai_gradebook_active_student_v4_clean',
  VAULT_STUDENTS: 'gvai_students_vault_permanent',
  VAULT_SUBMISSIONS: 'gvai_submissions_vault_permanent',
  CHECKIN_LOGS: 'gvai_gradebook_checkin_logs_v5_clean',
  OFFICIAL_ROSTERS: 'gvai_gradebook_official_rosters_v2'
};

// Hàm chuẩn hóa tiếng Việt loại bỏ dấu và ký tự thừa để rà soát trùng lặp chính xác
function normalizeVietnameseName(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function normalizeClassName(cls: string): string {
  if (!cls) return '';
  return cls
    .toUpperCase()
    .replace(/LỚP\s*/gi, '')
    .replace(/LOP\s*/gi, '')
    .replace(/\s+/g, '')
    .trim();
}


// ==================== TỰ ĐỘNG CHUẨN HÓA CHÍNH TẢ & ĐỐI CHIẾU DANH SÁCH LỚP ====================
export function toVietnameseTitleCase(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(w => {
      if (!w) return '';
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(' ');
}

export interface StandardizeStudentNameResult {
  standardizedName: string;
  isOfficialMatched: boolean;
  officialItem?: OfficialStudentRosterItem;
  originalName: string;
  changed: boolean;
}

/**
 * Tự động chuẩn hóa chính tả họ tên học sinh theo danh sách lớp của Thầy Thành:
 * - Nếu học sinh viết thường (nguyen thanh binh, vi gia bao, hoang kim anh...) hoặc viết không dấu:
 *   Hệ thống tự động đối chiếu danh sách lớp chính thức và sửa về chuẩn chính tả: "Nguyễn Thanh Bình", "Vi Gia Bảo"...
 * - Nếu học sinh ngoài danh sách: Tự động viết hoa chuẩn danh từ riêng (Title Case): "Nguyễn Văn An"
 */
export function standardizeStudentName(rawName: string, className?: string): StandardizeStudentNameResult {
  if (!rawName || typeof rawName !== 'string') {
    return {
      standardizedName: '',
      isOfficialMatched: false,
      originalName: rawName || '',
      changed: false
    };
  }

  const originalTrimmed = rawName.trim().replace(/\s+/g, ' ');
  const normInput = normalizeVietnameseName(originalTrimmed);
  const cleanCls = normalizeClassName(className || '');

  // 1. Đối chiếu danh sách học sinh chính thức từ Sổ Điểm Thầy Đinh Văn Thành
  const allData = officialRosterData as Record<string, OfficialStudentRosterItem[]>;
  let candidateRoster: OfficialStudentRosterItem[] = [];

  if (cleanCls && allData[cleanCls]) {
    candidateRoster = allData[cleanCls];
  } else {
    Object.values(allData).forEach(arr => candidateRoster.push(...arr));
  }

  // A. So khớp trong lớp chỉ định
  for (const item of candidateRoster) {
    const normOfficial = normalizeVietnameseName(item.name);
    if (normInput === normOfficial) {
      return {
        standardizedName: item.name,
        isOfficialMatched: true,
        officialItem: item,
        originalName: originalTrimmed,
        changed: originalTrimmed !== item.name
      };
    }
  }

  // B. Nếu chưa tìm thấy trong lớp chỉ định, thử tìm trên toàn bộ các lớp của Thầy
  if (cleanCls && allData[cleanCls]) {
    for (const [clsKey, list] of Object.entries(allData)) {
      if (clsKey === cleanCls) continue;
      for (const item of list) {
        if (normInput === normalizeVietnameseName(item.name)) {
          return {
            standardizedName: item.name,
            isOfficialMatched: true,
            officialItem: item,
            originalName: originalTrimmed,
            changed: originalTrimmed !== item.name
          };
        }
      }
    }
  }

  // 2. Nếu không nằm trong danh sách chính thức, tự động viết hoa chuẩn danh từ riêng tiếng Việt
  const titleCased = toVietnameseTitleCase(originalTrimmed);
  return {
    standardizedName: titleCased,
    isOfficialMatched: false,
    originalName: originalTrimmed,
    changed: originalTrimmed !== titleCased
  };
}

/**
 * Gợi ý nhanh danh sách học sinh chính thức theo lớp đang gõ để bấm chọn chuẩn 100%
 */
export function getOfficialNameSuggestions(query: string, className?: string, limit: number = 8): OfficialStudentRosterItem[] {
  const cleanCls = normalizeClassName(className || '');
  const allData = officialRosterData as Record<string, OfficialStudentRosterItem[]>;
  let list: OfficialStudentRosterItem[] = [];

  if (cleanCls && allData[cleanCls]) {
    list = allData[cleanCls];
  } else {
    Object.values(allData).forEach(arr => list.push(...arr));
  }

  const q = normalizeVietnameseName(query || '');
  if (!q) {
    return list.slice(0, limit);
  }

  const matches = list.filter(item => {
    const n = normalizeVietnameseName(item.name);
    return n.includes(q) || n.startsWith(q);
  });

  return matches.slice(0, limit);
}

// ==================== BỘ LỌC TÊN HỌC SINH CHUẨN MỰC GIÁO DỤC ====================
export interface NameValidationResult {
  isValid: boolean;
  cleanName: string;
  errorMessage?: string;
  isOfficialMatched?: boolean;
}

export function validateEducationalStudentName(rawName: string, className?: string): NameValidationResult {
  if (!rawName || typeof rawName !== 'string') {
    return { isValid: false, cleanName: '', errorMessage: 'Vui lòng nhập Họ và tên học sinh!' };
  }

  const trimmed = rawName.trim().replace(/\s+/g, ' ');
  if (trimmed.length < 4) {
    return { isValid: false, cleanName: '', errorMessage: 'Họ và tên học sinh quá ngắn (tối thiểu 4 ký tự)!' };
  }
  if (trimmed.length > 45) {
    return { isValid: false, cleanName: '', errorMessage: 'Họ và tên học sinh không được vượt quá 45 ký tự!' };
  }

  // Chặn số
  if (/\d/.test(trimmed)) {
    return { isValid: false, cleanName: '', errorMessage: 'Họ và tên thật của học sinh không được chứa chữ số!' };
  }

  // Chấp nhận chữ cái tiếng Việt và khoảng trắng
  const vietnameseLetterRegex = /^[\p{L}\s]+$/u;
  if (!vietnameseLetterRegex.test(trimmed)) {
    return { isValid: false, cleanName: '', errorMessage: 'Họ và tên chỉ được chứa chữ cái tiếng Việt và khoảng cách, không được chứa ký tự đặc biệt hay biểu tượng emoji!' };
  }

  // Bắt buộc tối thiểu 2 từ (Họ + Tên)
  const words = trimmed.split(' ');
  if (words.length < 2) {
    return { isValid: false, cleanName: '', errorMessage: 'Vui lòng nhập đầy đủ cả Họ và Tên (gồm tối thiểu 2 từ, ví dụ: Nguyễn Văn An), không nhập tên cụt 1 từ!' };
  }

  // Chuẩn hóa không dấu chữ thường để rà soát từ tục / spam
  const norm = normalizeVietnameseName(trimmed);

  // 1. Danh sách từ ngữ tục tĩu, phi giáo dục
  const VULGAR_WORDS = [
    'dm', 'dcm', 'vcl', 'cl', 'dit', 'lon', 'buoi', 'cac', 'dai', 'cho', 'may', 'tao',
    'ngu', 'oc cho', 'dien', 'dam', 'sex', 'porn', 'vl', 'deo', 'de tien', 'thang',
    'con me', 'me may', 'du ma', 'mat day', 'vo van', 'chet', 'giet', 'khung', 'dot',
    'ham', 'buom', 'chim', 'cu', 'penis', 'vagina', 'bitch', 'fuck', 'shit', 'ass', 'idiot'
  ];

  for (const vw of VULGAR_WORDS) {
    const regex = new RegExp(`(^|\\s)${vw}(\\s|$)`, 'i');
    if (regex.test(norm)) {
      return { isValid: false, cleanName: '', errorMessage: 'Tên học sinh chứa từ ngữ không phù hợp với chuẩn mực môi trường giáo dục!' };
    }
  }

  // 2. Danh sách chuỗi spam mashing bàn phím vô nghĩa
  const SPAM_PATTERNS = ['asdf', 'qwerty', 'zxcv', 'jkl;', 'test', 'demo', 'abcde', '1234', 'xxx', 'zzz', 'aaa', 'kkk', 'fake'];
  for (const sp of SPAM_PATTERNS) {
    if (norm.includes(sp)) {
      return { isValid: false, cleanName: '', errorMessage: 'Tên học sinh không hợp lệ. Vui lòng nhập đúng Họ và tên thật của em để Thầy ghi nhận điểm chuyên cần và thi đua nhé!' };
    }
  }

  // 3. Danh sách mạo danh hệ thống hoặc giáo viên
  const IMPERSONATION_WORDS = [
    'admin', 'administrator', 'root', 'mod', 'giao vien', 'thay co', 'thay giao',
    'co giao', 'hieu truong', 'bo giao duc', 'so giao duc', 'chu nhiem', 'hacker', 'hoc sinh'
  ];
  for (const iw of IMPERSONATION_WORDS) {
    const regex = new RegExp(`(^|\\s)${iw}(\\s|$)`, 'i');
    if (regex.test(norm)) {
      return { isValid: false, cleanName: '', errorMessage: 'Vui lòng sử dụng đúng Họ và tên thật của học sinh, không dùng danh xưng hệ thống hoặc chức danh giáo viên!' };
    }
  }

  // 4. Kiểm tra lặp ký tự quá mức (ví dụ "aaaaaa", "hhhhhh")
  if (/(.)\1{3,}/i.test(trimmed)) {
    return { isValid: false, cleanName: '', errorMessage: 'Họ và tên không hợp lệ do có quá nhiều ký tự lặp lại!' };
  }

  // Tự động chuẩn hóa chính tả theo danh sách lớp hoặc Title Case
  const std = standardizeStudentName(trimmed, className);
  return { isValid: true, cleanName: std.standardizedName, isOfficialMatched: std.isOfficialMatched };
}

// Dữ liệu lớp học khởi tạo mẫu
// Danh sách các lớp học chuẩn Trường THCS Đồng Yên (Trường chính & Phân hiệu Vĩnh Phúc) + Cấp 3 THPT
export const DONG_YEN_CLASSES: ClassRoom[] = [
  // KHỐI 6: 6A1 - 6A5 (Trường chính), 6B1 - 6B6 (Phân hiệu Vĩnh Phúc)
  { id: 'cls-6a1', name: '6A1', grade: 6, schoolYear: '2026 - 2027', homeroomTeacher: 'Trường THCS Đồng Yên', description: 'Trường THCS Đồng Yên (Trường chính)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-6a2', name: '6A2', grade: 6, schoolYear: '2026 - 2027', homeroomTeacher: 'Trường THCS Đồng Yên', description: 'Trường THCS Đồng Yên (Trường chính)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-6a3', name: '6A3', grade: 6, schoolYear: '2026 - 2027', homeroomTeacher: 'Trường THCS Đồng Yên', description: 'Trường THCS Đồng Yên (Trường chính)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-6a4', name: '6A4', grade: 6, schoolYear: '2026 - 2027', homeroomTeacher: 'Trường THCS Đồng Yên', description: 'Trường THCS Đồng Yên (Trường chính)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-6a5', name: '6A5', grade: 6, schoolYear: '2026 - 2027', homeroomTeacher: 'Trường THCS Đồng Yên', description: 'Trường THCS Đồng Yên (Trường chính)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-6b1', name: '6B1', grade: 6, schoolYear: '2026 - 2027', homeroomTeacher: 'THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', description: 'Trường THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-6b2', name: '6B2', grade: 6, schoolYear: '2026 - 2027', homeroomTeacher: 'THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', description: 'Trường THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-6b3', name: '6B3', grade: 6, schoolYear: '2026 - 2027', homeroomTeacher: 'THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', description: 'Trường THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-6b4', name: '6B4', grade: 6, schoolYear: '2026 - 2027', homeroomTeacher: 'THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', description: 'Trường THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-6b5', name: '6B5', grade: 6, schoolYear: '2026 - 2027', homeroomTeacher: 'THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', description: 'Trường THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-6b6', name: '6B6', grade: 6, schoolYear: '2026 - 2027', homeroomTeacher: 'THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', description: 'Trường THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', createdAt: '2026-09-05T07:30:00Z' },

  // KHỐI 7: 7A1 - 7A5 (Trường chính), 7B1 - 7B5 (Phân hiệu Vĩnh Phúc)
  { id: 'cls-7a1', name: '7A1', grade: 7, schoolYear: '2026 - 2027', homeroomTeacher: 'Trường THCS Đồng Yên', description: 'Trường THCS Đồng Yên (Trường chính)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-7a2', name: '7A2', grade: 7, schoolYear: '2026 - 2027', homeroomTeacher: 'Trường THCS Đồng Yên', description: 'Trường THCS Đồng Yên (Trường chính)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-7a3', name: '7A3', grade: 7, schoolYear: '2026 - 2027', homeroomTeacher: 'Trường THCS Đồng Yên', description: 'Trường THCS Đồng Yên (Trường chính)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-7a4', name: '7A4', grade: 7, schoolYear: '2026 - 2027', homeroomTeacher: 'Trường THCS Đồng Yên', description: 'Trường THCS Đồng Yên (Trường chính)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-7a5', name: '7A5', grade: 7, schoolYear: '2026 - 2027', homeroomTeacher: 'Trường THCS Đồng Yên', description: 'Trường THCS Đồng Yên (Trường chính)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-7b1', name: '7B1', grade: 7, schoolYear: '2026 - 2027', homeroomTeacher: 'THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', description: 'Trường THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-7b2', name: '7B2', grade: 7, schoolYear: '2026 - 2027', homeroomTeacher: 'THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', description: 'Trường THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-7b3', name: '7B3', grade: 7, schoolYear: '2026 - 2027', homeroomTeacher: 'THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', description: 'Trường THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-7b4', name: '7B4', grade: 7, schoolYear: '2026 - 2027', homeroomTeacher: 'THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', description: 'Trường THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-7b5', name: '7B5', grade: 7, schoolYear: '2026 - 2027', homeroomTeacher: 'THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', description: 'Trường THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', createdAt: '2026-09-05T07:30:00Z' },

  // KHỐI 8: 8A1 - 8A5 (Trường chính), 8B1 - 8B5 (Phân hiệu Vĩnh Phúc)
  { id: 'cls-8a1', name: '8A1', grade: 8, schoolYear: '2026 - 2027', homeroomTeacher: 'Trường THCS Đồng Yên', description: 'Trường THCS Đồng Yên (Trường chính)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-8a2', name: '8A2', grade: 8, schoolYear: '2026 - 2027', homeroomTeacher: 'Trường THCS Đồng Yên', description: 'Trường THCS Đồng Yên (Trường chính)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-8a3', name: '8A3', grade: 8, schoolYear: '2026 - 2027', homeroomTeacher: 'Trường THCS Đồng Yên', description: 'Trường THCS Đồng Yên (Trường chính)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-8a4', name: '8A4', grade: 8, schoolYear: '2026 - 2027', homeroomTeacher: 'Trường THCS Đồng Yên', description: 'Trường THCS Đồng Yên (Trường chính)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-8a5', name: '8A5', grade: 8, schoolYear: '2026 - 2027', homeroomTeacher: 'Trường THCS Đồng Yên', description: 'Trường THCS Đồng Yên (Trường chính)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-8b1', name: '8B1', grade: 8, schoolYear: '2026 - 2027', homeroomTeacher: 'THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', description: 'Trường THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-8b2', name: '8B2', grade: 8, schoolYear: '2026 - 2027', homeroomTeacher: 'THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', description: 'Trường THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-8b3', name: '8B3', grade: 8, schoolYear: '2026 - 2027', homeroomTeacher: 'THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', description: 'Trường THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-8b4', name: '8B4', grade: 8, schoolYear: '2026 - 2027', homeroomTeacher: 'THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', description: 'Trường THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-8b5', name: '8B5', grade: 8, schoolYear: '2026 - 2027', homeroomTeacher: 'THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', description: 'Trường THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', createdAt: '2026-09-05T07:30:00Z' },

  // KHỐI 9: 9A1 - 9A5 (Trường chính), 9B1 - 9B5 (Phân hiệu Vĩnh Phúc)
  { id: 'cls-9a1', name: '9A1', grade: 9, schoolYear: '2026 - 2027', homeroomTeacher: 'Trường THCS Đồng Yên', description: 'Trường THCS Đồng Yên (Trường chính)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-9a2', name: '9A2', grade: 9, schoolYear: '2026 - 2027', homeroomTeacher: 'Trường THCS Đồng Yên', description: 'Trường THCS Đồng Yên (Trường chính)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-9a3', name: '9A3', grade: 9, schoolYear: '2026 - 2027', homeroomTeacher: 'Trường THCS Đồng Yên', description: 'Trường THCS Đồng Yên (Trường chính)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-9a4', name: '9A4', grade: 9, schoolYear: '2026 - 2027', homeroomTeacher: 'Trường THCS Đồng Yên', description: 'Trường THCS Đồng Yên (Trường chính)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-9a5', name: '9A5', grade: 9, schoolYear: '2026 - 2027', homeroomTeacher: 'Trường THCS Đồng Yên', description: 'Trường THCS Đồng Yên (Trường chính)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-9b1', name: '9B1', grade: 9, schoolYear: '2026 - 2027', homeroomTeacher: 'THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', description: 'Trường THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-9b2', name: '9B2', grade: 9, schoolYear: '2026 - 2027', homeroomTeacher: 'THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', description: 'Trường THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-9b3', name: '9B3', grade: 9, schoolYear: '2026 - 2027', homeroomTeacher: 'THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', description: 'Trường THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-9b4', name: '9B4', grade: 9, schoolYear: '2026 - 2027', homeroomTeacher: 'THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', description: 'Trường THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-9b5', name: '9B5', grade: 9, schoolYear: '2026 - 2027', homeroomTeacher: 'THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', description: 'Trường THCS Đồng Yên (Phân hiệu Vĩnh Phúc)', createdAt: '2026-09-05T07:30:00Z' },

  // CẤP 3 THPT & TRƯỜNG KHÁC
  { id: 'cls-10a1', name: '10A1', grade: 10, schoolYear: '2026 - 2027', homeroomTeacher: 'Trường THPT', description: 'Lớp 10A1 THPT', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-11a1', name: '11A1', grade: 11, schoolYear: '2026 - 2027', homeroomTeacher: 'Trường THPT', description: 'Lớp 11A1 THPT', createdAt: '2026-09-05T07:30:00Z' },
  { id: 'cls-12a1', name: '12A1', grade: 12, schoolYear: '2026 - 2027', homeroomTeacher: 'Trường THPT', description: 'Lớp 12A1 THPT - Ôn thi Tốt nghiệp 2026 - 2027', createdAt: '2026-09-05T07:30:00Z' }
];

const DEFAULT_CLASSES: ClassRoom[] = DONG_YEN_CLASSES;

// Xóa sạch toàn bộ học sinh ảo demo cũ, hệ thống bắt đầu danh sách học sinh thật trống
const DEFAULT_STUDENTS: StudentProfile[] = [];

// Xóa sạch bài nộp ảo demo cũ, điểm sẽ do hệ thống tự động ghi nhận khi học sinh làm bài tập
const DEFAULT_SUBMISSIONS: StudentSubmission[] = [];

class StudentGradebookService {
  private classes: ClassRoom[] = [];
  private students: StudentProfile[] = [];
  private submissions: StudentSubmission[] = [];
  private checkinLogs: StudentCheckinLog[] = [];

  constructor() {
    this.initData();
    this.syncFromCloud().catch(() => {});
  }

    // Tải danh sách sổ điểm chính thức
  // 
  // ==================== QUẢN LÝ SỔ ĐIỂM & DANH SÁCH HỌC SINH CHÍNH THỨC ====================
  private officialRosters: Record<string, string[]> = {};

  private loadOfficialRosters() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.OFFICIAL_ROSTERS);
      const local = raw ? JSON.parse(raw) : {};

      // Baseline danh sách chính thức từ Sổ Điểm Bộ Môn Thầy Đinh Văn Thành
      const baseline: Record<string, string[]> = {};
      Object.entries(officialRosterData as Record<string, OfficialStudentRosterItem[]>).forEach(([cls, list]) => {
        baseline[cls] = list.map(item => item.name);
      });

      this.officialRosters = { ...baseline, ...local };
    } catch {
      this.officialRosters = {};
    }
  }

  public getOfficialRoster(className: string): string[] {
    const cleanCls = normalizeClassName(className);
    if (!cleanCls) return [];
    if (!this.officialRosters || Object.keys(this.officialRosters).length === 0) {
      this.loadOfficialRosters();
    }
    const fromLoaded = this.officialRosters[cleanCls];
    if (fromLoaded && fromLoaded.length > 0) return fromLoaded;
    const rawData = officialRosterData as Record<string, OfficialStudentRosterItem[]>;
    if (rawData && rawData[cleanCls] && rawData[cleanCls].length > 0) {
      return rawData[cleanCls].map(item => item.name);
    }
    return [];
  }

  public saveOfficialRoster(className: string, names: string[]): { count: number; saved: string[] } {
    const cleanCls = normalizeClassName(className);
    if (!cleanCls) return { count: 0, saved: [] };

    // Làm sạch và lọc tên
    const cleanList: string[] = [];
    const seen = new Set<string>();

    names.forEach(n => {
      const val = validateEducationalStudentName(n, cleanCls);
      if (val.isValid && val.cleanName) {
        const norm = normalizeVietnameseName(val.cleanName);
        if (!seen.has(norm)) {
          seen.add(norm);
          cleanList.push(val.cleanName);
        }
      }
    });

    // Sắp xếp theo tên tiếng Việt
    cleanList.sort((a, b) => {
      const aParts = a.split(' ');
      const bParts = b.split(' ');
      const aLast = aParts[aParts.length - 1];
      const bLast = bParts[bParts.length - 1];
      return aLast.localeCompare(bLast, 'vi');
    });

    this.officialRosters[cleanCls] = cleanList;
    try {
      localStorage.setItem(STORAGE_KEYS.OFFICIAL_ROSTERS, JSON.stringify(this.officialRosters));
      // Tự động tạo hồ sơ học sinh sẵn cho lớp
      cleanList.forEach((name, idx) => {
        const code = 'HS' + cleanCls.replace(/[^A-Za-z0-9]/g, '') + '-' + (idx + 1).toString().padStart(2, '0');
        const existing = this.students.find(s => normalizeVietnameseName(s.name) === normalizeVietnameseName(name) && normalizeClassName(s.className) === cleanCls);
        if (!existing) {
          const gNum = parseInt(cleanCls.match(/^(\d{1,2})/)?.[1] || '8', 10);
          this.students.push({
            id: 'stu-roster-' + cleanCls.toLowerCase() + '-' + (idx + 1),
            studentCode: code,
            name: name,
            classId: 'cls-' + cleanCls.toLowerCase(),
            className: cleanCls,
            grade: gNum >= 6 && gNum <= 12 ? gNum : 8,
            gender: 'Nam',
            createdAt: new Date().toISOString(),
            attendancePoints: 0,
            vocabPoints: 0,
            examBonusPoints: 0,
            practicePoints: 0,
            studyTimeMinutes: 0,
            totalMeritPoints: 0
          });
        }
      });
      this.saveStudents();
    } catch {}

    return { count: cleanList.length, saved: cleanList };
  }

  public deleteOfficialRoster(className: string): boolean {
    const cleanCls = normalizeClassName(className);
    if (this.officialRosters[cleanCls]) {
      delete this.officialRosters[cleanCls];
      try {
        localStorage.setItem(STORAGE_KEYS.OFFICIAL_ROSTERS, JSON.stringify(this.officialRosters));
      } catch {}
      return true;
    }
    return false;
  }

  public getAllOfficialRosters(): Record<string, string[]> {
    if (!this.officialRosters || Object.keys(this.officialRosters).length === 0) {
      this.loadOfficialRosters();
    }
    return this.officialRosters;
  }

  public isTHPTClass(className: string): boolean {
    const cleanCls = normalizeClassName(className);
    const match = cleanCls.match(/^(\d{1,2})/);
    if (match && match[1]) {
      const gNum = parseInt(match[1], 10);
      return gNum >= 10 && gNum <= 12;
    }
    return cleanCls.includes('THPT') || cleanCls.includes('10') || cleanCls.includes('11') || cleanCls.includes('12');
  }

  public verifyStudentInRoster(name: string, className: string): { allowed: boolean; matchedName?: string; reason?: string } {
    const cleanCls = normalizeClassName(className);
    
    // Riêng cấp THPT tạm thời cho đăng ký tự do (miễn là tên đúng chuẩn giáo dục)
    if (this.isTHPTClass(cleanCls)) {
      const val = validateEducationalStudentName(name, cleanCls);
      if (!val.isValid) {
        return { allowed: false, reason: val.errorMessage };
      }
      return { allowed: true, matchedName: val.cleanName };
    }

    // Với các khối THCS Thầy dạy: Kiểm tra đối chiếu với Sổ điểm chính thức nếu đã cập nhật
    const roster = this.getOfficialRoster(cleanCls);
    if (roster && roster.length > 0) {
      const normInput = normalizeVietnameseName(name);
      const match = roster.find(rName => normalizeVietnameseName(rName) === normInput);
      if (match) {
        return { allowed: true, matchedName: match };
      }
      return {
        allowed: false,
        reason: `Tên "${name}" chưa có trong danh sách chính thức Lớp ${cleanCls}. Em vui lòng chọn đúng tên trong danh sách lớp hoặc nhờ Thầy Đinh Thành cập nhật sổ điểm nhé!`
      };
    }

    // Nếu lớp chưa tải sổ điểm lên: Áp dụng bộ lọc tên giáo dục
    const val = validateEducationalStudentName(name, cleanCls);
    if (!val.isValid) {
      return { allowed: false, reason: val.errorMessage };
    }
    return { allowed: true, matchedName: val.cleanName };
  }


  private initData() {
    try {
      const clsRaw = localStorage.getItem(STORAGE_KEYS.CLASSES);
      this.classes = clsRaw ? JSON.parse(clsRaw) : DEFAULT_CLASSES;

      const stuRaw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      this.students = stuRaw ? JSON.parse(stuRaw) : DEFAULT_STUDENTS;

            try {
        const logRaw = localStorage.getItem(STORAGE_KEYS.CHECKIN_LOGS);
        this.checkinLogs = logRaw ? JSON.parse(logRaw) : [];
      } catch {
        this.checkinLogs = [];
      }
      const subRaw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      this.submissions = subRaw ? JSON.parse(subRaw) : DEFAULT_SUBMISSIONS;

      // 1. Tự động khôi phục toàn diện tất cả tài khoản học sinh và bài thi từ toàn bộ các key cũ
      this.recoverAllLegacyData();

      // 2. Tự động lọc sạch học sinh demo, đối chiếu và đồng nhất theo Sổ Điểm chính thức (390 học sinh), cộng điểm khuyến khích (+15đ)
      this.purgeDemoAndSyncOfficialRoster({ grantEncouragementBonus: true });

      // 3. Tự động rà soát & khôi phục toàn diện điểm thực tế của học sinh từ tất cả bài thi, bài tập và lịch sử học hôm qua đến nay
      this.auditAndRestoreAllStudentPoints();

      // Lưu lại nếu chưa từng có
      if (!clsRaw) localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(this.classes));
      if (!stuRaw) localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(this.students));
      if (!subRaw) localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(this.submissions));
    } catch {
      this.classes = DEFAULT_CLASSES;
      this.students = DEFAULT_STUDENTS;
      this.submissions = DEFAULT_SUBMISSIONS;
    }
  }

  // ==================== KHÔI PHỤC TÀI KHOẢN CŨ & BẢO VỆ DỮ LIỆU VĨNH VIỄN ====================
  public recoverAllLegacyData(): { recoveredStudents: number; recoveredSubmissions: number } {
    let recoveredStudentsCount = 0;
    let recoveredSubmissionsCount = 0;

    const studentKeys = [
      STORAGE_KEYS.STUDENTS,
      STORAGE_KEYS.VAULT_STUDENTS,
      'gvai_gradebook_students_v4',
      'gvai_gradebook_students_v3_dongyen',
      'gvai_gradebook_students_v3',
      'gvai_gradebook_students_v2',
      'gvai_gradebook_students',
      'gvai_students_dongyen',
      'gvai_students',
      'gvai_students_backup',
      'ALL_STUDENTS_LIST',
      'ENG_STUDENTS'
    ];

    const studentMap = new Map<string, StudentProfile>();

    // Giữ danh sách hiện có trước
    (this.students || []).forEach(s => {
      if (s && s.id) {
        studentMap.set(s.id, s);
      }
    });

    studentKeys.forEach(k => {
      try {
        const raw = localStorage.getItem(k);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            parsed.forEach((s: any) => {
              if (s && s.name && (s.id || s.studentCode || s.username)) {
                const key = s.id || ('stu-' + (s.username || s.studentCode));
                if (!studentMap.has(key)) {
                  studentMap.set(key, s);
                  recoveredStudentsCount++;
                }
              }
            });
          }
        }
      } catch {}
    });

    // Quét cả các key chứa 1 đối tượng học sinh hoạt động gần nhất
    const singleProfileKeys = [
      STORAGE_KEYS.ACTIVE_STUDENT,
      'ENG_STUDENT_PROFILE',
      'gvai_gradebook_active_student_v3_dongyen',
      'gvai_gradebook_active_student'
    ];
    singleProfileKeys.forEach(k => {
      try {
        const raw = localStorage.getItem(k);
        if (raw) {
          const s = JSON.parse(raw);
          if (s && (s.fullName || s.name) && (s.id || s.username || s.studentCode)) {
            const stuId = s.id || ('stu-' + (s.username || s.phone || Date.now().toString(36)));
            if (!studentMap.has(stuId)) {
              const mapped: StudentProfile = {
                id: stuId,
                name: s.fullName || s.name,
                className: s.className || '6A1',
                classId: s.classId || 'cls-6a1',
                grade: Number(s.grade) || 6,
                gender: s.gender === 'Nữ' ? 'Nữ' : 'Nam',
                studentCode: s.studentCode || s.username || ('HS' + (s.className || '6A1') + '-01'),
                username: s.username,
                password: s.password || '12345',
                parentPhone: s.phone || s.parentPhone,
                createdAt: s.registeredAt || new Date().toISOString()
              };
              studentMap.set(stuId, mapped);
              recoveredStudentsCount++;
            }
          }
        }
      } catch {}
    });

    this.students = Array.from(studentMap.values());

    // Khôi phục toàn bộ bài làm / điểm số từ các key cũ
    const submissionKeys = [
      STORAGE_KEYS.SUBMISSIONS,
      STORAGE_KEYS.VAULT_SUBMISSIONS,
      'gvai_gradebook_submissions_v3_dongyen',
      'gvai_gradebook_submissions_v3',
      'gvai_gradebook_submissions',
      'gvai_submissions'
    ];
    const subMap = new Map<string, StudentSubmission>();
    (this.submissions || []).forEach(sub => {
      if (sub && sub.id) subMap.set(sub.id, sub);
    });

    submissionKeys.forEach(k => {
      try {
        const raw = localStorage.getItem(k);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            parsed.forEach((sub: any) => {
              if (sub && sub.id && sub.studentName && typeof sub.score === 'number') {
                if (!subMap.has(sub.id)) {
                  subMap.set(sub.id, sub);
                  recoveredSubmissionsCount++;
                }
              }
            });
          }
        }
      } catch {}
    });

    this.submissions = Array.from(subMap.values());
    this.saveStudents();
    this.saveSubmissions();

    return { recoveredStudents: recoveredStudentsCount, recoveredSubmissions: recoveredSubmissionsCount };
  }

  // ==================== LỌC SẠCH DEMO & ĐỒNG NHẤT SỔ ĐIỂM CHÍNH THỨC 390 HỌC SINH (+15Đ KHUYẾN KHÍCH) ====================
  public purgeDemoAndSyncOfficialRoster(options?: {
    grantEncouragementBonus?: boolean;
    bonusAmount?: number;
  }): PurgeAndSyncRosterResult {
    const grantBonus = options?.grantEncouragementBonus !== false;
    const bonusAmount = options?.bonusAmount ?? 15;

    const DEMO_REGEX = /\b(demo|test|thử|học sinh ảo|tài khoản mẫu|mẫu|asdf|qwerty|fake|abcde|1234|admin|mod|quản trị|nguyễn văn a|bài test)\b/i;

    // 1. Tải danh sách 390 học sinh chính thức từ officialStudentRoster.json
    const rawRoster = officialRosterData as Record<string, OfficialStudentRosterItem[]>;
    const allOfficial: OfficialStudentRosterItem[] = [];
    const officialByCode = new Map<string, OfficialStudentRosterItem>();
    const officialByKey = new Map<string, OfficialStudentRosterItem>();
    const officialByNameOnly = new Map<string, OfficialStudentRosterItem[]>();

    Object.entries(rawRoster).forEach(([rawCls, list]) => {
      const cleanCls = normalizeClassName(rawCls);
      (list || []).forEach(item => {
        const standardItem: OfficialStudentRosterItem = {
          stt: item.stt,
          studentCode: String(item.studentCode).trim(),
          name: item.name.trim(),
          className: cleanCls,
          grade: item.grade || (cleanCls.startsWith('6') ? 6 : 8),
          dob: item.dob || '',
          regularScore: item.regularScore ?? null,
          midtermScore: item.midtermScore ?? null,
          finalScore: item.finalScore ?? null,
          termAvg: item.termAvg ?? null
        };
        allOfficial.push(standardItem);
        officialByCode.set(standardItem.studentCode.toLowerCase(), standardItem);
        const normN = normalizeVietnameseName(standardItem.name);
        officialByKey.set(`${normN}__${cleanCls}`, standardItem);
        const nameList = officialByNameOnly.get(normN) || [];
        nameList.push(standardItem);
        officialByNameOnly.set(normN, nameList);
      });
    });

    // 2. Gom toàn bộ candidate accounts từ this.students và tất cả legacy storage keys
    const candidateMap = new Map<string, StudentProfile>();
    (this.students || []).forEach(s => {
      if (s && s.id) candidateMap.set(s.id, s);
    });

    const legacyStudentKeys = [
      STORAGE_KEYS.STUDENTS,
      STORAGE_KEYS.VAULT_STUDENTS,
      'gvai_gradebook_students_v4',
      'gvai_gradebook_students_v3_dongyen',
      'gvai_gradebook_students_v3',
      'gvai_gradebook_students_v2',
      'gvai_gradebook_students',
      'gvai_students_dongyen',
      'gvai_students',
      'gvai_students_backup',
      'ALL_STUDENTS_LIST',
      'ENG_STUDENTS'
    ];

    legacyStudentKeys.forEach(k => {
      try {
        const raw = localStorage.getItem(k);
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            list.forEach((s: any) => {
              if (s && s.id && !candidateMap.has(s.id)) {
                candidateMap.set(s.id, s);
              }
            });
          }
        }
      } catch {}
    });

    const candidateList = Array.from(candidateMap.values());
    const totalOriginalCandidates = candidateList.length;

    // 3. Phân loại tài khoản Demo vs Tài khoản chính thức
    const purgedDemoIds = new Set<string>();
    const purgedDemoNames: string[] = [];
    const officialGroups = new Map<string, StudentProfile[]>(); // studentCode -> candidate profiles
    const thptGroups = new Map<string, StudentProfile[]>(); // normName__class -> THPT candidate profiles

    candidateList.forEach(cand => {
      const cName = (cand.name || '').trim();
      const cUser = (cand.username || '').trim().toLowerCase();
      const cCode = (cand.studentCode || '').trim().toLowerCase();
      const cCls = normalizeClassName(cand.className || '');
      const normN = normalizeVietnameseName(cName);
      const isTHPT = this.isTHPTClass(cCls) || (cand.grade !== undefined && cand.grade >= 10);

      const hasDemoKeyword = 
        DEMO_REGEX.test(cName) || 
        DEMO_REGEX.test(cUser) || 
        DEMO_REGEX.test(cCode) || 
        DEMO_REGEX.test(cCls);

      let matchedOfficial: OfficialStudentRosterItem | undefined = undefined;

      if (!hasDemoKeyword && !isTHPT) {
        // Ưu tiên 1: Khớp mã học sinh chính thức
        if (cCode && officialByCode.has(cCode)) {
          matchedOfficial = officialByCode.get(cCode);
        }
        // Ưu tiên 2: Khớp Họ tên chuẩn hóa + Lớp
        if (!matchedOfficial && officialByKey.has(`${normN}__${cCls}`)) {
          matchedOfficial = officialByKey.get(`${normN}__${cCls}`);
        }
        // Ưu tiên 3: Khớp Họ tên duy nhất trên toàn khối 390 học sinh
        if (!matchedOfficial && officialByNameOnly.has(normN)) {
          const matches = officialByNameOnly.get(normN)!;
          if (matches.length === 1) {
            matchedOfficial = matches[0];
          }
        }
      }

      if (hasDemoKeyword) {
        purgedDemoIds.add(cand.id);
        purgedDemoNames.push(cName || cand.id);
      } else if (matchedOfficial) {
        const grp = officialGroups.get(matchedOfficial.studentCode) || [];
        grp.push(cand);
        officialGroups.set(matchedOfficial.studentCode, grp);
      } else if (isTHPT && cName.length >= 2) {
        // Học sinh THPT tự ghi tên và ghi lớp: Giữ lại và nhóm để hợp nhất duy nhất 1 tài khoản
        const thptKey = `${normN}__${cCls || '10A1'}`;
        const grp = thptGroups.get(thptKey) || [];
        grp.push(cand);
        thptGroups.set(thptKey, grp);
      } else {
        purgedDemoIds.add(cand.id);
        purgedDemoNames.push(cName || cand.id);
      }
    });

    // 4. Xây dựng danh sách 390 học sinh chuẩn mực theo Sổ Điểm chính thức (1 học sinh = 1 tài khoản)
    const idMigrationMap = new Map<string, string>(); // oldId -> canonicalId
    const cleanStudents: StudentProfile[] = [];
    let mergedDuplicateCount = 0;
    const details: string[] = [];

    allOfficial.forEach(off => {
      const candidates = officialGroups.get(off.studentCode) || [];

      if (candidates.length > 1) {
        mergedDuplicateCount += (candidates.length - 1);
        details.push(`Đồng nhất ${candidates.length} tài khoản thành 1 cho học sinh ${off.name} (Lớp ${off.className}, SBD: ${off.studentCode})`);
      }

      // Xác định Canonical ID (ưu tiên ID đã có tài khoản/mật khẩu hoặc hoạt động)
      let canonicalId: string;
      if (candidates.length > 0) {
        candidates.sort((a, b) => {
          const aWeight = (a.username ? 2 : 0) + (a.password ? 2 : 0) + (a.totalMeritPoints ? 1 : 0);
          const bWeight = (b.username ? 2 : 0) + (b.password ? 2 : 0) + (b.totalMeritPoints ? 1 : 0);
          if (bWeight !== aWeight) return bWeight - aWeight;
          return (a.createdAt || '').localeCompare(b.createdAt || '');
        });
        canonicalId = candidates[0].id;
      } else {
        canonicalId = `stu-${off.className.toLowerCase()}-${String(off.stt).padStart(2, '0')}`;
      }

      // Ánh xạ tất cả candidate ID về canonicalId
      candidates.forEach(c => {
        idMigrationMap.set(c.id, canonicalId);
      });

      // Hợp nhất điểm chuyên cần, thi đua và thời gian học
      const att = Math.max(...candidates.map(c => c.attendancePoints || 0), 0);
      const voc = Math.max(...candidates.map(c => c.vocabPoints || 0), 0);
      const exm = Math.max(...candidates.map(c => c.examBonusPoints || 0), 0);
      const prc = Math.max(...candidates.map(c => c.practicePoints || 0), 0);
      const timePts = Math.max(...candidates.map(c => c.timePoints || 0), 0);
      const teacherBonus = Math.max(...candidates.map(c => c.teacherBonus || 0), 0);
      const studyMins = candidates.reduce((sum, c) => sum + (c.studyTimeMinutes || 0), 0);
      const maxCandidateTotal = Math.max(...candidates.map(c => c.totalMeritPoints || 0), 0);

      // Điểm khuyến khích ôn thi Giữa kỳ 1 (+15 điểm)
      const bonus = grantBonus ? bonusAmount : 15;
      const calcSum = att + voc + exm + prc + timePts + bonus + teacherBonus;
      // BẢO TOÀN ĐIỂM: Tuyệt đối không làm giảm điểm đã ghi nhận của học sinh
      const totalMerit = Math.max(maxCandidateTotal, calcSum);

      // Tìm ngày đăng nhập gần nhất & ngày tạo
      const validDates = candidates.map(c => c.lastLoginDate).filter(Boolean) as string[];
      validDates.sort();
      const lastLogin = validDates.length > 0 ? validDates[validDates.length - 1] : undefined;

      const createdDates = candidates.map(c => c.createdAt).filter(Boolean) as string[];
      createdDates.sort();
      const createdAt = createdDates.length > 0 ? createdDates[0] : '2026-09-05T07:30:00Z';

      // Thông tin đăng nhập chuẩn
      const bestUser = candidates.find(c => c.username && !DEMO_REGEX.test(c.username))?.username || `hs${off.className.toLowerCase()}_${off.stt}`;
      const bestPass = candidates.find(c => c.password)?.password || '12345';
      const bestPhone = candidates.find(c => c.parentPhone)?.parentPhone || '';
      const bestGender = candidates.find(c => c.gender)?.gender || 'Nam';

      const canonicalProfile: StudentProfile = {
        id: canonicalId,
        studentCode: off.studentCode,
        username: bestUser,
        password: bestPass,
        name: off.name,
        classId: `cls-${off.className.toLowerCase()}`,
        className: off.className,
        grade: off.grade,
        gender: bestGender,
        dob: off.dob,
        parentPhone: bestPhone,
        note: 'Học sinh chính thức Trường THCS Đồng Yên',
        createdAt,
        attendancePoints: att,
        vocabPoints: voc,
        examBonusPoints: exm,
        practicePoints: prc,
        studyTimeMinutes: studyMins,
        timePoints: timePts,
        encouragementBonus: bonus,
        totalMeritPoints: totalMerit,
        lastLoginDate: lastLogin,
        stt: off.stt,
        regularScore: off.regularScore
      };

      cleanStudents.push(canonicalProfile);
    });

    // 4b. Xây dựng danh sách học sinh Cấp THPT (Khối 10, 11, 12 tự ghi tên & lớp, hợp nhất 1 tài khoản duy nhất)
    thptGroups.forEach((candidates, key) => {
      if (candidates.length === 0) return;
      const first = candidates[0];
      const cls = normalizeClassName(first.className) || '10A1';
      const gMatch = cls.match(/^(\d{1,2})/);
      const grade = gMatch ? parseInt(gMatch[1], 10) : (first.grade && first.grade >= 10 ? first.grade : 10);

      if (candidates.length > 1) {
        mergedDuplicateCount += (candidates.length - 1);
        details.push(`Hợp nhất ${candidates.length} tài khoản thành 1 cho học sinh THPT ${first.name} (Lớp ${cls})`);
      }

      // Xác định Canonical ID cho học sinh THPT
      candidates.sort((a, b) => {
        const aWeight = (a.username ? 2 : 0) + (a.password ? 2 : 0) + (a.totalMeritPoints ? 1 : 0);
        const bWeight = (b.username ? 2 : 0) + (b.password ? 2 : 0) + (b.totalMeritPoints ? 1 : 0);
        if (bWeight !== aWeight) return bWeight - aWeight;
        return (a.createdAt || '').localeCompare(b.createdAt || '');
      });
      const canonicalId = candidates[0].id || `stu-thpt-${cls.toLowerCase()}-${Date.now().toString(36)}`;

      candidates.forEach(c => {
        idMigrationMap.set(c.id, canonicalId);
      });

      const att = Math.max(...candidates.map(c => c.attendancePoints || 0), 0);
      const voc = Math.max(...candidates.map(c => c.vocabPoints || 0), 0);
      const exm = Math.max(...candidates.map(c => c.examBonusPoints || 0), 0);
      const prc = Math.max(...candidates.map(c => c.practicePoints || 0), 0);
      const timePts = Math.max(...candidates.map(c => c.timePoints || 0), 0);
      const teacherBonus = Math.max(...candidates.map(c => c.teacherBonus || 0), 0);
      const studyMins = candidates.reduce((sum, c) => sum + (c.studyTimeMinutes || 0), 0);
      const maxCandidateTotal = Math.max(...candidates.map(c => c.totalMeritPoints || 0), 0);

      const bonus = grantBonus ? bonusAmount : 15;
      const calcSum = att + voc + exm + prc + timePts + bonus + teacherBonus;
      const totalMerit = Math.max(maxCandidateTotal, calcSum);

      const validDates = candidates.map(c => c.lastLoginDate).filter(Boolean) as string[];
      validDates.sort();
      const lastLogin = validDates.length > 0 ? validDates[validDates.length - 1] : undefined;

      const createdDates = candidates.map(c => c.createdAt).filter(Boolean) as string[];
      createdDates.sort();
      const createdAt = createdDates.length > 0 ? createdDates[0] : new Date().toISOString();

      const bestUser = candidates.find(c => c.username && !DEMO_REGEX.test(c.username))?.username || `thpt_${cls.toLowerCase()}_${canonicalId.slice(-4)}`;
      const bestPass = candidates.find(c => c.password)?.password || '12345';
      const bestPhone = candidates.find(c => c.parentPhone)?.parentPhone || '';
      const bestGender = candidates.find(c => c.gender)?.gender || 'Nam';
      const bestCode = candidates.find(c => c.studentCode)?.studentCode || `HS${cls.replace(/[^A-Za-z0-9]/g, '')}-${canonicalId.slice(-4)}`;

      const canonicalTHPTProfile: StudentProfile = {
        id: canonicalId,
        studentCode: bestCode,
        username: bestUser,
        password: bestPass,
        name: first.name,
        classId: `cls-${cls.toLowerCase()}`,
        className: cls,
        grade: grade,
        gender: bestGender,
        dob: first.dob || '',
        parentPhone: bestPhone,
        note: `Học sinh cấp THPT (Lớp ${cls})`,
        createdAt,
        attendancePoints: att,
        vocabPoints: voc,
        examBonusPoints: exm,
        practicePoints: prc,
        studyTimeMinutes: studyMins,
        timePoints: timePts,
        encouragementBonus: bonus,
        totalMeritPoints: totalMerit,
        lastLoginDate: lastLogin
      };

      cleanStudents.push(canonicalTHPTProfile);
    });

    this.students = cleanStudents;

    // 5. Làm sạch & hợp nhất bài nộp (Student Submissions)
    // - Xóa bỏ bài thi của học sinh demo
    // - Chuyển studentId về canonical student
    // - Giữ điểm cao nhất cho bài làm lặp lại
    const subKeyMap = new Map<string, StudentSubmission>();

    this.submissions.forEach(sub => {
      if (!sub || !sub.id) return;
      if (purgedDemoIds.has(sub.studentId) || DEMO_REGEX.test(sub.studentName || '')) {
        return; // Bỏ qua bài thi demo
      }

      const canonicalId = idMigrationMap.get(sub.studentId) || sub.studentId;
      const canonicalStudent = this.students.find(s => s.id === canonicalId);

      if (!canonicalStudent) {
        // Kiểm tra xem tên bài thi có trùng với học sinh nào trong sổ điểm không
        const normSubName = normalizeVietnameseName(sub.studentName || '');
        const normSubCls = normalizeClassName(sub.className || '');
        const matched = this.students.find(s => 
          normalizeVietnameseName(s.name) === normSubName && 
          (normalizeClassName(s.className) === normSubCls || !normSubCls)
        );
        if (!matched) return;
        sub.studentId = matched.id;
        sub.studentName = matched.name;
        sub.studentCode = matched.studentCode;
        sub.className = matched.className;
        sub.classId = matched.classId;
        sub.grade = matched.grade;
      } else {
        sub.studentId = canonicalStudent.id;
        sub.studentName = canonicalStudent.name;
        sub.studentCode = canonicalStudent.studentCode;
        sub.className = canonicalStudent.className;
        sub.classId = canonicalStudent.classId;
        sub.grade = canonicalStudent.grade;
      }

      // Giữ bài làm điểm cao nhất nếu làm nhiều lần
      const subKey = `${sub.studentId}__${sub.testType}__${sub.unitNumber}__${(sub.testTitle || '').toLowerCase()}`;
      const existing = subKeyMap.get(subKey);
      if (!existing || sub.score > existing.score) {
        subKeyMap.set(subKey, sub);
      }
    });

    this.submissions = Array.from(subKeyMap.values());

    // 6. Làm sạch nhật ký check-in (Checkin Logs)
    if (this.checkinLogs && this.checkinLogs.length > 0) {
      this.checkinLogs = this.checkinLogs
        .filter(log => !purgedDemoIds.has(log.studentId) && !DEMO_REGEX.test(log.studentName || ''))
        .map(log => {
          const canonicalId = idMigrationMap.get(log.studentId) || log.studentId;
          const canonical = this.students.find(s => s.id === canonicalId);
          if (canonical) {
            return {
              ...log,
              studentId: canonical.id,
              studentCode: canonical.studentCode,
              studentName: canonical.name,
              className: canonical.className,
              grade: canonical.grade
            };
          }
          return log;
        });
    }

    // 7. Đồng bộ & làm sạch nhiệm vụ học tập MidtermMissionService
    try {
      purgedDemoIds.forEach(demoId => {
        localStorage.removeItem('MIDTERM_MISSION_EVAL_' + demoId);
      });
      idMigrationMap.forEach((canonicalId, oldId) => {
        if (oldId !== canonicalId) {
          const oldMission = localStorage.getItem('MIDTERM_MISSION_EVAL_' + oldId);
          if (oldMission && !localStorage.getItem('MIDTERM_MISSION_EVAL_' + canonicalId)) {
            localStorage.setItem('MIDTERM_MISSION_EVAL_' + canonicalId, oldMission);
          }
          localStorage.removeItem('MIDTERM_MISSION_EVAL_' + oldId);
        }
      });
    } catch {}

    // 8. Làm sạch phiên đăng nhập hiện tại nếu là demo
    try {
      const activeRaw = localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT);
      if (activeRaw) {
        const active = JSON.parse(activeRaw);
        if (active?.id && (purgedDemoIds.has(active.id) || DEMO_REGEX.test(active.name || ''))) {
          localStorage.removeItem(STORAGE_KEYS.ACTIVE_STUDENT);
        } else if (active?.id && idMigrationMap.has(active.id)) {
          const canonical = this.students.find(s => s.id === idMigrationMap.get(active.id));
          if (canonical) {
            this.setActiveStudent(canonical);
          }
        }
      }

      const rememberedRaw = localStorage.getItem('DONGYEN_REMEMBERED_STUDENT');
      if (rememberedRaw) {
        const rem = JSON.parse(rememberedRaw);
        if (rem?.id && (purgedDemoIds.has(rem.id) || DEMO_REGEX.test(rem.name || ''))) {
          localStorage.removeItem('DONGYEN_REMEMBERED_STUDENT');
        } else if (rem?.id && idMigrationMap.has(rem.id)) {
          const canonical = this.students.find(s => s.id === idMigrationMap.get(rem.id));
          if (canonical) {
            localStorage.setItem('DONGYEN_REMEMBERED_STUDENT', JSON.stringify({
              id: canonical.id,
              name: canonical.name,
              className: canonical.className,
              grade: canonical.grade,
              studentCode: canonical.studentCode
            }));
          }
        }
      }
    } catch {}

    // 9. Lưu trữ danh sách học sinh và bài thi sạch tuyệt đối vào bộ nhớ vĩnh viễn
    this.saveStudents();
    this.saveSubmissions();
    try {
      localStorage.setItem(STORAGE_KEYS.CHECKIN_LOGS, JSON.stringify(this.checkinLogs));
    } catch {}

    // Làm sạch toàn bộ các key legacy cũ để demo không bao giờ tự phục hồi
    legacyStudentKeys.forEach(k => {
      try {
        localStorage.setItem(k, JSON.stringify(this.students));
      } catch {}
    });

    this.syncToCloud().catch(() => {});

    return {
      totalOfficialStudents: this.students.length,
      totalOriginalCandidates,
      purgedDemoCount: purgedDemoIds.size,
      mergedDuplicateCount,
      encouragementBonusGranted: bonusAmount,
      totalSubmissionsPreserved: this.submissions.length,
      purgedDemoNames: Array.from(new Set(purgedDemoNames)),
      details
    };
  }

  // ==================== TỰ RÀ SOÁT TÀI KHOẢN TRÙNG ĐỂ HỢP NHẤT (MERGE DEDUPLICATE) ====================
  public deduplicateAndMergeStudents(): {
    mergedCount: number;
    originalCount: number;
    currentCount: number;
    details: string[];
  } {
    const res = this.purgeDemoAndSyncOfficialRoster({ grantEncouragementBonus: true });
    return {
      mergedCount: res.mergedDuplicateCount,
      originalCount: res.totalOriginalCandidates,
      currentCount: res.totalOfficialStudents,
      details: res.details
    };
  }

  // ==================== RÀ SOÁT & KHÔI PHỤC ĐIỂM THỰC TẾ HỌC SINH TOÀN DIỆN ====================
  /**
   * Tự động rà soát từ Submissions, Checkin Logs, Tiến độ Nhiệm vụ & Lịch sử học thực tế hôm qua đến nay
   * Khôi phục toàn bộ điểm số bị mất hoặc bị ghi đè, bù đắp mọi thiệt thòi cho học sinh, bảo toàn điểm cao nhất!
   */
  public auditAndRestoreAllStudentPoints(): {
    auditedCount: number;
    restoredCount: number;
    totalPointsRestored: number;
    details: string[];
  } {
    let restoredCount = 0;
    let totalPointsRestored = 0;
    const details: string[] = [];

    // 1. Gom tất cả Submissions từ mọi nguồn lưu trữ (cả hiện tại lẫn vault vĩnh viễn và legacy keys)
    const allSubsMap = new Map<string, StudentSubmission>();
    (this.submissions || []).forEach(sub => {
      if (sub && sub.id) allSubsMap.set(sub.id, sub);
    });

    const subStorageKeys = [
      STORAGE_KEYS.SUBMISSIONS,
      STORAGE_KEYS.VAULT_SUBMISSIONS,
      'gvai_gradebook_submissions_v3_dongyen',
      'gvai_gradebook_submissions_v3',
      'gvai_gradebook_submissions',
      'gvai_submissions',
      'ENG_SUBMISSIONS_LIST'
    ];

    subStorageKeys.forEach(k => {
      try {
        const raw = localStorage.getItem(k);
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            list.forEach((sub: any) => {
              if (sub && sub.id && typeof sub.score === 'number' && (sub.studentName || sub.studentId)) {
                if (!allSubsMap.has(sub.id)) {
                  allSubsMap.set(sub.id, sub);
                }
              }
            });
          }
        }
      } catch {}
    });

    const allSubmissions = Array.from(allSubsMap.values());
    this.submissions = allSubmissions;

    // 2. Gom tất cả Checkin Logs từ mọi nguồn
    const allLogsMap = new Map<string, StudentCheckinLog>();
    (this.checkinLogs || []).forEach(log => {
      if (log && log.id) allLogsMap.set(log.id, log);
    });

    const logStorageKeys = [
      STORAGE_KEYS.CHECKIN_LOGS,
      'gvai_gradebook_checkin_logs_v4',
      'DONGYEN_STUDENT_CHECKINS_V2',
      'DONGYEN_STUDENT_CHECKINS'
    ];

    logStorageKeys.forEach(k => {
      try {
        const raw = localStorage.getItem(k);
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            list.forEach((log: any) => {
              if (log && log.id && (log.studentName || log.studentId)) {
                if (!allLogsMap.has(log.id)) {
                  allLogsMap.set(log.id, log);
                }
              }
            });
          }
        }
      } catch {}
    });

    const allCheckinLogs = Array.from(allLogsMap.values());
    this.checkinLogs = allCheckinLogs;

    // 3. Ngày hôm nay & Khuyến mại
    const todayStr = getLocalDateString();
    const loginReward = getDailyLoginRewardInfo(todayStr);

    // 4. Rà soát từng học sinh
    this.students.forEach(student => {
      if (!student || !student.name) return;

      const normName = normalizeVietnameseName(student.name);
      const cleanCls = normalizeClassName(student.className);
      const origTotal = student.totalMeritPoints || 0;

      // a) Thu thập tất cả bài nộp của học sinh này
      const studentSubs = allSubmissions.filter(sub => {
        if (sub.studentId && sub.studentId === student.id) return true;
        if (sub.studentCode && student.studentCode && sub.studentCode.toLowerCase() === student.studentCode.toLowerCase()) return true;
        const sNorm = normalizeVietnameseName(sub.studentName || '');
        const cNorm = normalizeClassName(sub.className || '');
        return sNorm === normName && (cNorm === cleanCls || !cNorm);
      });

      // Điểm bài thi GK/CK: Điểm thi x 10 (lấy bài cao nhất hoặc tích lũy các bài thi)
      let examBonusFromSubs = 0;
      let highestExamScore = 0;
      let practiceBonusFromSubs = 0;

      studentSubs.forEach(sub => {
        if (sub.testType === 'gk_ck_exam') {
          if (sub.score > highestExamScore) highestExamScore = sub.score;
          examBonusFromSubs = Math.max(examBonusFromSubs, Math.round(sub.score * 10));
        } else {
          // Bài tập SGK, kiểm tra trắc nghiệm, đề cương
          practiceBonusFromSubs += Math.max(10, Math.round(sub.score * 5));
        }
      });

      // b) Thu thập tất cả nhật ký check-in của học sinh này
      const studentLogs = allCheckinLogs.filter(log => {
        if (log.studentId && log.studentId === student.id) return true;
        const lNorm = normalizeVietnameseName(log.studentName || '');
        const cNorm = normalizeClassName(log.className || '');
        return lNorm === normName && (cNorm === cleanCls || !cNorm);
      });

      // Đếm các Unit từ vựng khác nhau mà học sinh đã học
      const vocabUnitsSet = new Set<string>();
      // Đếm các ngày chuyên cần học sinh đã tham gia
      const activeDaysSet = new Set<string>();
      let practiceBonusFromLogs = 0;
      let teacherBonusFromLogs = 0;

      studentLogs.forEach(log => {
        const d = (log.detail || '') + ' ' + (log.action || '');
        // Lấy ngày hoạt động
        if (log.timestamp) {
          const dateOnly = log.timestamp.slice(0, 10);
          if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
            activeDaysSet.add(dateOnly);
          }
        }
        // Unit từ vựng
        const uMatch = d.match(/Unit\s*(\d{1,2})/i);
        if (uMatch && uMatch[1]) {
          vocabUnitsSet.add(uMatch[1]);
        }
        // Bài tập / Đề cương
        if (log.action?.includes('bài tập') || log.action?.includes('đề cương') || log.action?.includes('trắc nghiệm')) {
          practiceBonusFromLogs += 10;
        }
        // Thưởng điểm tích cực từ Thầy
        const tMatch = d.match(/\+(\d+)\s*đ/i);
        if (log.action?.includes('Thưởng') && tMatch && tMatch[1]) {
          teacherBonusFromLogs += parseInt(tMatch[1], 10);
        }
      });

      // c) Đọc tiến độ nhiệm vụ giữa kỳ từ localStorage (nếu có)
      let vocabFromMission = 0;
      let examFromMission = 0;
      let practiceFromMission = 0;

      try {
        const missionRaw = localStorage.getItem('MIDTERM_MISSION_EVAL_' + student.id);
        if (missionRaw) {
          const mState = JSON.parse(missionRaw);
          if (mState?.mission1?.units) {
            Object.values(mState.mission1.units).forEach((u: any) => {
              if (u?.isMastered || (u?.qualityPassedCount && u.qualityPassedCount >= 3)) {
                vocabUnitsSet.add(String(u.unitNumber));
              }
            });
          }
          if (mState?.mission2?.midtermExam?.highestScore) {
            examFromMission = Math.round(mState.mission2.midtermExam.highestScore * 10);
          }
          if (mState?.mission2?.decuong?.highestScore) {
            practiceFromMission = Math.round(mState.mission2.decuong.highestScore * 5);
          }
        }
      } catch {}

      // d) Tính toán các thành phần điểm chuẩn xác
      const vocabFromUnits = Math.max(vocabUnitsSet.size * 10, vocabFromMission);

      // Điểm chuyên cần theo ngày:
      // Nếu có hoạt động ngày hôm qua (27/10/2026): +5đ
      // Nếu có hoạt động ngày hôm nay (28/10/2026): +10đ (Khuyến mại)
      if (student.lastLoginDate) {
        activeDaysSet.add(student.lastLoginDate);
      }
      let attendanceCalculated = 0;
      activeDaysSet.forEach(day => {
        if (day === '2026-10-28') {
          attendanceCalculated += 10; // Khuyến mại hôm nay
        } else {
          attendanceCalculated += 5;  // Ngày thường
        }
      });
      // Tối thiểu chuyên cần là 5 điểm nếu đã từng đăng nhập
      if (attendanceCalculated === 0 && (student.lastLoginDate || studentSubs.length > 0 || studentLogs.length > 0)) {
        attendanceCalculated = student.lastLoginDate === todayStr ? loginReward.points : 5;
      }

      // Khởi tạo các trường điểm nếu chưa có
      const recAtt = Math.max(student.attendancePoints || 0, attendanceCalculated);
      const recVoc = Math.max(student.vocabPoints || 0, vocabFromUnits);
      const recExm = Math.max(student.examBonusPoints || 0, examBonusFromSubs, examFromMission);
      const recPrc = Math.max(student.practicePoints || 0, practiceBonusFromSubs, practiceBonusFromLogs, practiceFromMission);
      const recTime = student.timePoints || (student.studyTimeMinutes ? Math.floor(student.studyTimeMinutes / 5) * 3 : 0);
      const recBonus = student.encouragementBonus ?? 15;
      let recTeacher = Math.max(student.teacherBonus || 0, teacherBonusFromLogs);

      // ================= THƯỞNG PHÁO HOA CHĂM CHỈ LIÊN TIẾP (+20Đ) =================
      // Dành cho học sinh đã học thực tế hôm qua và tiếp tục vào học hôm nay
      const yesterdayStr = getYesterdayDateString(todayStr);
      const hadActivityYesterday = (student.lastLoginDate === yesterdayStr || student.lastLoginDate === '2026-10-27') ||
        studentLogs.some(l => (l.timestamp || '').startsWith(yesterdayStr) || (l.timestamp || '').startsWith('2026-10-27')) ||
        studentSubs.some(s => (s.submittedAt || '').startsWith(yesterdayStr) || (s.submittedAt || '').startsWith('2026-10-27')) ||
        (vocabFromUnits > 0 || examBonusFromSubs > 0);

      const hasActivityToday = (student.lastLoginDate === todayStr) ||
        studentLogs.some(l => (l.timestamp || '').startsWith(todayStr)) ||
        studentSubs.some(s => (s.submittedAt || '').startsWith(todayStr));

      if (hadActivityYesterday && hasActivityToday && student.streakBonusAwardedDate !== todayStr) {
        student.streakBonusAwardedDate = todayStr;
        recTeacher += 20;
        this.recordCheckin(
          student,
          '🎆 NỔ PHÁO HOA ĂN MỪNG',
          `🎆 Nổ pháo hoa rực rỡ! Đã học hôm qua (${yesterdayStr}) và tiếp tục vào học hôm nay (${todayStr})! Thầy Thành tặng thêm +20 điểm thi đua chăm chỉ!`
        );
        details.push(`🎆 Thưởng Pháo Hoa Chăm Chỉ cho ${student.name} (${student.className}): +20đ vì đã học liên tục từ hôm qua đến hôm nay!`);
      }

      const calculatedSum = recAtt + recVoc + recExm + recPrc + recTime + recBonus + recTeacher;

      // ================= QUY TẮC BẢO VỆ ĐIỂM TỐI CAO: BÙ ĐẮP MỌI THIỆT THÒI =================
      // Mục tiêu điểm: Phải ít nhất bằng điểm ghi nhận cao nhất từ trước đến nay, HOẶC điểm tính lại thực tế!
      const targetTotal = Math.max(origTotal, calculatedSum);

      // Nếu có chênh lệch giữa targetTotal và calculatedSum (do điểm tích lũy trước đó):
      // Giữ nguyên và bù vào practicePoints để các thành phần cộng lại tròn khít!
      let finalPractice = recPrc;
      if (targetTotal > calculatedSum) {
        finalPractice += (targetTotal - calculatedSum);
      }

      if (targetTotal > origTotal) {
        restoredCount++;
        const added = targetTotal - origTotal;
        totalPointsRestored += added;
        details.push(`Khôi phục cho ${student.name} (${student.className}): ${origTotal}đ ➔ ${targetTotal}đ (+${added}đ từ bài thi/hoạt động thực tế)`);
      }

      // Cập nhật lại toàn bộ hồ sơ học sinh
      student.attendancePoints = recAtt;
      student.vocabPoints = recVoc;
      student.examBonusPoints = recExm;
      student.practicePoints = finalPractice;
      student.timePoints = recTime;
      student.encouragementBonus = recBonus;
      student.teacherBonus = recTeacher;
      student.totalMeritPoints = targetTotal;
    });

    // 5. Lưu trữ vĩnh viễn và đồng bộ Cloud
    this.saveStudents();
    this.saveSubmissions();
    try {
      localStorage.setItem(STORAGE_KEYS.CHECKIN_LOGS, JSON.stringify(this.checkinLogs));
      localStorage.setItem(STORAGE_KEYS.VAULT_STUDENTS, JSON.stringify(this.students));
      localStorage.setItem(STORAGE_KEYS.VAULT_SUBMISSIONS, JSON.stringify(this.submissions));
    } catch {}

    const active = this.getActiveStudent();
    if (active) {
      const updatedActive = this.students.find(s => s.id === active.id);
      if (updatedActive) {
        this.setActiveStudent(updatedActive);
      }
    }

    this.syncToCloud().catch(() => {});

    return {
      auditedCount: this.students.length,
      restoredCount,
      totalPointsRestored,
      details
    };
  }

  // ==================== KIỂM TRA & THƯỞNG PHÁO HOA HỌC LIÊN TỤC HÔM QUA ➔ HÔM NAY (+20Đ) ====================
  public didStudentStudyYesterday(studentId: string, studentName?: string, className?: string, refDateStr?: string): boolean {
    const todayStr = refDateStr || getLocalDateString();
    const yesterdayStr = getYesterdayDateString(todayStr);
    const normName = studentName ? normalizeVietnameseName(studentName) : '';
    const normCls = className ? normalizeClassName(className) : '';

    // 1. Kiểm tra ngày đăng nhập hồ sơ học sinh
    const stu = this.students.find(s => 
      s.id === studentId || 
      (normName && normalizeVietnameseName(s.name) === normName && (!normCls || normalizeClassName(s.className) === normCls))
    );
    if (stu) {
      if (stu.lastLoginDate === yesterdayStr || stu.lastLoginDate === '2026-10-27') {
        return true;
      }
    }

    // 2. Kiểm tra nhật ký checkinLogs ngày hôm qua
    const hasCheckinYesterday = this.checkinLogs.some(log => {
      const isTarget = (log.studentId && log.studentId === studentId) ||
        (normName && log.studentName && normalizeVietnameseName(log.studentName) === normName);
      if (!isTarget) return false;
      const logDate = (log.timestamp || '').split('T')[0];
      return logDate === yesterdayStr || logDate === '2026-10-27';
    });
    if (hasCheckinYesterday) return true;

    // 3. Kiểm tra bài làm submissions ngày hôm qua
    const hasSubYesterday = this.submissions.some(sub => {
      const isTarget = (sub.studentId && sub.studentId === studentId) ||
        (normName && sub.studentName && normalizeVietnameseName(sub.studentName) === normName);
      if (!isTarget) return false;
      const subDate = (sub.submittedAt || '').split('T')[0];
      return subDate === yesterdayStr || subDate === '2026-10-27';
    });
    if (hasSubYesterday) return true;

    // 4. Nếu học sinh đã có điểm từ vựng hoặc điểm thi từ hôm qua thì cũng tính là đã học
    if (stu && ((stu.vocabPoints || 0) > 0 || (stu.examBonusPoints || 0) > 0 || (stu.practicePoints || 0) > 0)) {
      return true;
    }

    return false;
  }

  public checkAndAwardYesterdayStreakBonus(student: StudentProfile, refDateStr?: string): { awarded: boolean; bonusPoints: number; reason: string } {
    const todayStr = refDateStr || getLocalDateString();
    const yesterdayStr = getYesterdayDateString(todayStr);

    if (student.streakBonusAwardedDate === todayStr) {
      return { awarded: false, bonusPoints: 0, reason: 'Hôm nay đã nhận thưởng chuỗi chuyên cần +20đ rồi' };
    }

    const studiedYesterday = this.didStudentStudyYesterday(student.id, student.name, student.className, todayStr);
    if (!studiedYesterday) {
      return { awarded: false, bonusPoints: 0, reason: 'Chưa có dữ liệu học tập ngày hôm qua' };
    }

    const BONUS = 20;
    student.teacherBonus = (student.teacherBonus || 0) + BONUS;
    student.totalMeritPoints = (student.totalMeritPoints || 0) + BONUS;
    student.streakBonusAwardedDate = todayStr;

    this.recordCheckin(
      student,
      '🎆 NỔ PHÁO HOA ĂN MỪNG',
      `🎆 Hoan hô! Đã học hôm qua (${yesterdayStr}) và tiếp tục vào học hôm nay (${todayStr})! Thầy Thành tặng thêm +${BONUS}đ thi đua & bắn pháo hoa rực rỡ!`
    );

    this.saveStudents();
    this.syncToCloud().catch(() => {});

    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('gvai_fireworks_streak_reward', {
          detail: { student, streakPoints: BONUS, todayStr, yesterdayStr }
        }));
      } catch {}
    }

    return {
      awarded: true,
      bonusPoints: BONUS,
      reason: `Hôm qua (${yesterdayStr}) đã học thực tế và hôm nay (${todayStr}) tiếp tục quay lại học!`
    };
  }

  // ==================== QUẢN LÝ LỚP HỌC ====================
  public getClasses(grade?: number): ClassRoom[] {
    if (grade) {
      return this.classes.filter(c => c.grade === grade);
    }
    return [...this.classes].sort((a, b) => a.grade - b.grade || a.name.localeCompare(b.name));
  }

  public getClassById(id: string): ClassRoom | undefined {
    return this.classes.find(c => c.id === id);
  }

  public addClass(data: Omit<ClassRoom, 'id' | 'createdAt'>): ClassRoom {
    const newClass: ClassRoom = {
      ...data,
      id: 'cls-' + Date.now().toString(36),
      createdAt: new Date().toISOString()
    };
    this.classes.push(newClass);
    this.saveClasses();
    return newClass;
  }

  public updateClass(id: string, data: Partial<ClassRoom>): boolean {
    const idx = this.classes.findIndex(c => c.id === id);
    if (idx === -1) return false;
    this.classes[idx] = { ...this.classes[idx], ...data };
    this.saveClasses();
    return true;
  }

  public deleteClass(id: string): boolean {
    this.classes = this.classes.filter(c => c.id !== id);
    // Xóa cả học sinh và bài làm của lớp này
    this.students = this.students.filter(s => s.classId !== id);
    this.submissions = this.submissions.filter(sub => sub.classId !== id);
    this.saveClasses();
    this.saveStudents();
    this.saveSubmissions();
    return true;
  }

  private saveClasses() {
    try {
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(this.classes));
    } catch (e) {
      console.error('Failed to save classes:', e);
    }
  }

  // ==================== QUẢN LÝ HỌC SINH ====================
  public getStudents(classId?: string): StudentProfile[] {
    if (classId) {
      return this.students.filter(s => s.classId === classId);
    }
    return [...this.students];
  }

  // Tự động kéo danh sách học sinh từ Cloud về (giúp đăng ký trên PC lập tức đăng nhập được trên Điện thoại)
  public async syncFromCloud(): Promise<StudentProfile[]> {
    try {
      let cloudStudents: StudentProfile[] | null = null;
      const bust = '_t=' + Date.now();

      // 1. Gọi API Vercel cùng domain (kèm timestamp chống cache hoàn toàn)
      try {
        const resp = await fetch(CLOUD_SYNC_ENDPOINT + '?' + bust, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
        });
        if (resp.ok) {
          const json = await resp.json();
          if (json && Array.isArray(json.students)) {
            cloudStudents = json.students;
          }
        }
      } catch (e) {
        // Fallback
      }

      // 2. Fallback gọi trực tiếp ExtendsClass nếu API Vercel chưa sẵn sàng
      if (!cloudStudents) {
        try {
          const resp = await fetch(CLOUD_STORAGE_FALLBACK + '?' + bust, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
          });
          if (resp.ok) {
            const json = await resp.json();
            if (json && Array.isArray(json.students)) {
              cloudStudents = json.students;
            }
          }
        } catch (e) {
          // Ignored
        }
      }

      if (cloudStudents && Array.isArray(cloudStudents)) {
        let hasNewLocal = false;
        const map = new Map<string, StudentProfile>();
        cloudStudents.forEach(s => {
          const key = (s.username || s.studentCode || s.id).toLowerCase();
          map.set(key, s);
        });
        this.students.forEach(s => {
          const key = (s.username || s.studentCode || s.id).toLowerCase();
          const existing = map.get(key);
          if (!existing) {
            map.set(key, s);
            hasNewLocal = true;
          } else {
            // MERGE ĐIỂM SỐ & DỮ LIỆU: BẢO TOÀN ĐIỂM CAO NHẤT CỦA CẢ 2 BÊN, TUYỆT ĐỐI KHÔNG LÀM MẤT ĐIỂM CỦA HỌC SINH
            existing.attendancePoints = Math.max(existing.attendancePoints || 0, s.attendancePoints || 0);
            existing.vocabPoints = Math.max(existing.vocabPoints || 0, s.vocabPoints || 0);
            existing.examBonusPoints = Math.max(existing.examBonusPoints || 0, s.examBonusPoints || 0);
            existing.practicePoints = Math.max(existing.practicePoints || 0, s.practicePoints || 0);
            existing.timePoints = Math.max(existing.timePoints || 0, s.timePoints || 0);
            existing.studyTimeMinutes = Math.max(existing.studyTimeMinutes || 0, s.studyTimeMinutes || 0);
            existing.teacherBonus = Math.max(existing.teacherBonus || 0, s.teacherBonus || 0);
            existing.encouragementBonus = Math.max(existing.encouragementBonus ?? 15, s.encouragementBonus ?? 15);
            const sumParts = (
              (existing.attendancePoints || 0) + 
              (existing.vocabPoints || 0) + 
              (existing.examBonusPoints || 0) + 
              (existing.practicePoints || 0) + 
              (existing.timePoints || 0) + 
              (existing.encouragementBonus || 15) + 
              (existing.teacherBonus || 0)
            );
            existing.totalMeritPoints = Math.max(
              existing.totalMeritPoints || 0,
              s.totalMeritPoints || 0,
              sumParts
            );
            if (s.password && !existing.password) {
              existing.password = s.password;
            }
            if (s.lastLoginDate && (!existing.lastLoginDate || s.lastLoginDate > existing.lastLoginDate)) {
              existing.lastLoginDate = s.lastLoginDate;
            }
          }
        });
        this.students = Array.from(map.values());
        this.saveStudents();
        // Tự động rà soát và khôi phục điểm thực tế cho toàn bộ học sinh
        this.auditAndRestoreAllStudentPoints();
        if (hasNewLocal) {
          this.syncToCloud().catch(() => {});
        }
      }
    } catch (e) {
      console.warn('Lỗi syncFromCloud:', e);
    }
    return [...this.students];
  }

  // Đẩy danh sách học sinh lên Cloud để thiết bị khác đồng bộ
  public async syncToCloud(): Promise<void> {
    try {
      const payload = JSON.stringify({
        school: 'THCS Dong Yen',
        updatedAt: Date.now(),
        students: this.students
      });

      let success = false;
      try {
        const resp = await fetch(CLOUD_SYNC_ENDPOINT + '?_t=' + Date.now(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          body: payload
        });
        if (resp.ok) success = true;
      } catch (e) {
        // Fallback
      }

      if (!success) {
        try {
          await fetch(CLOUD_STORAGE_FALLBACK + '?_t=' + Date.now(), {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            },
            body: payload
          });
        } catch (e) {
          // Ignored
        }
      }
    } catch (e) {
      console.warn('Lỗi syncToCloud:', e);
    }
  }

  // Alias method để tương thích 100% không bao giờ gặp lỗi "Ve.getAllStudents is not a function"
  public getAllStudents(): StudentProfile[] {
    return this.getStudents();
  }

  // Xóa toàn bộ học sinh (YÊU CẦU QUYỀN ADMIN TUYỆT ĐỐI)
  public clearAllStudents(isAdminAuthorized: boolean = false): boolean {
    const hasAdminSession = 
      sessionStorage.getItem('gvai_admin_logged_in') === 'true' ||
      sessionStorage.getItem('gvai_admin_auth') === 'true';

    const isSystemAdmin = isAdminAuthorized === true && hasAdminSession;

    if (!isSystemAdmin) {
      console.warn('Từ chối thao tác: Chỉ Admin đã đăng nhập mới có quyền xóa!');
      return false;
    }
    this.students = [];
    this.saveStudents();
    this.setActiveStudent(null);
    return true;
  }

  public getStudentById(id: string): StudentProfile | undefined {
    return this.students.find(s => s.id === id);
  }

  public addStudent(data: Omit<StudentProfile, 'id' | 'createdAt'>): StudentProfile {
    const newStudent: StudentProfile = {
      ...data,
      id: 'stu-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString()
    };
    this.students.push(newStudent);
    this.saveStudents();
    this.syncToCloud().catch(() => {});
    return newStudent;
  }

  public updateStudent(id: string, data: Partial<StudentProfile>): boolean {
    const idx = this.students.findIndex(s => s.id === id);
    if (idx === -1) return false;
    this.students[idx] = { ...this.students[idx], ...data };
    this.saveStudents();
    this.syncToCloud().catch(() => {});
    return true;
  }

  // Xóa tài khoản học sinh: BẢO VỆ CHẶT CHẼ, DUY NHẤT GIÁO VIÊN / ADMIN ĐÃ ĐĂNG NHẬP MỚI CÓ QUYỀN XÓA
  public deleteStudent(idOrIdentifier: string, isAdminAuthorized: boolean = false): boolean {
    const hasAdminSession = 
      sessionStorage.getItem('gvai_admin_logged_in') === 'true' ||
      sessionStorage.getItem('gvai_admin_auth') === 'true';

    const isSystemAdmin = isAdminAuthorized === true && hasAdminSession;

    if (!isSystemAdmin) {
      console.warn('Từ chối xóa tài khoản: Chỉ Giáo viên / Admin đã đăng nhập mới có quyền xóa học sinh!');
      return false;
    }

    const target = (idOrIdentifier || '').trim().toLowerCase();
    this.students = this.students.filter(s => 
      s.id !== idOrIdentifier && 
      (s.username || '').toLowerCase() !== target &&
      (s.studentCode || '').toLowerCase() !== target
    );
    this.submissions = this.submissions.filter(sub => 
      sub.studentId !== idOrIdentifier &&
      (sub.studentCode || '').toLowerCase() !== target
    );
    const curActive = this.getActiveStudent();
    if (curActive && (
      curActive.id === idOrIdentifier || 
      (curActive.username || '').toLowerCase() === target ||
      (curActive.studentCode || '').toLowerCase() === target
    )) {
      this.setActiveStudent(null);
    }
    this.saveStudents();
    this.saveSubmissions();
    this.syncToCloud().catch(() => {});
    return true;
  }

  // Nhập danh sách nhanh học sinh từ Excel hoặc văn bản dán
  public bulkImportStudents(classId: string, rawText: string): { importedCount: number; errors: string[] } {
    const targetClass = this.getClassById(classId);
    if (!targetClass) {
      return { importedCount: 0, errors: ['Không tìm thấy lớp học chỉ định!'] };
    }

    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    let count = 0;
    const errors: string[] = [];

    // Lấy số thứ tự hiện tại của lớp
    const currentClassStudents = this.getStudents(classId);
    let startSeq = currentClassStudents.length + 1;

    for (const line of lines) {
      // Hỗ trợ định dạng: "Nguyễn Văn A" hoặc "HS01 \t Nguyễn Văn A \t Nam" hoặc "Nguyễn Văn A, Nữ, 0912..."
      const parts = line.includes('\t') 
        ? line.split('\t') 
        : line.includes(',') 
          ? line.split(',') 
          : [line];

      let name = '';
      let gender: 'Nam' | 'Nữ' = 'Nam';
      let phone = '';

      if (parts.length === 1) {
        name = parts[0].trim();
      } else if (parts.length === 2) {
        name = parts[0].trim();
        const gRaw = parts[1].trim().toLowerCase();
        if (gRaw === 'nữ' || gRaw === 'nu' || gRaw === 'female' || gRaw === 'f') gender = 'Nữ';
      } else {
        // Có thể cột 0 là STT hoặc Mã, cột 1 là Họ tên
        if (/^\d+$/.test(parts[0].trim()) || parts[0].trim().toUpperCase().startsWith('HS')) {
          name = parts[1].trim();
          if (parts[2]) {
            const gRaw = parts[2].trim().toLowerCase();
            if (gRaw === 'nữ' || gRaw === 'nu' || gRaw === 'female' || gRaw === 'f') gender = 'Nữ';
          }
          if (parts[3]) phone = parts[3].trim();
        } else {
          name = parts[0].trim();
          const gRaw = parts[1].trim().toLowerCase();
          if (gRaw === 'nữ' || gRaw === 'nu' || gRaw === 'female' || gRaw === 'f') gender = 'Nữ';
          if (parts[2]) phone = parts[2].trim();
        }
      }

      if (!name) continue;

      const code = `HS${targetClass.name}-${startSeq < 10 ? '0' + startSeq : startSeq}`;
      startSeq++;

      this.students.push({
        id: 'stu-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        studentCode: code,
        name: name,
        classId: targetClass.id,
        className: targetClass.name,
        grade: targetClass.grade,
        gender: gender,
        parentPhone: phone,
        createdAt: new Date().toISOString()
      });
      count++;
    }

    this.saveStudents();
    return { importedCount: count, errors };
  }

  private saveStudents() {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(this.students));
      // Lưu trữ bền vững vĩnh viễn vào Vault và các bản sao lưu
      if (this.students && this.students.length > 0) {
        localStorage.setItem(STORAGE_KEYS.VAULT_STUDENTS, JSON.stringify(this.students));
        localStorage.setItem('gvai_students_backup', JSON.stringify(this.students));
        localStorage.setItem('ALL_STUDENTS_LIST', JSON.stringify(this.students));
      }
      // Đồng bộ thông tin học sinh hiện tại sang ENG_STUDENT_PROFILE cho App Từ Vựng
      const active = this.getActiveStudent();
      if (active) {
        const engProfile = {
          id: active.id,
          username: active.username || active.studentCode,
          fullName: active.name,
          className: active.className,
          grade: active.grade || 6,
          phone: active.parentPhone || '',
          avatar: active.gender === 'Nữ' ? 'av_girl1' : 'av_boy1',
          xp: 200,
          streakDays: 3,
          registeredAt: active.createdAt || 'Chính thức',
          lastActiveAt: new Date().toLocaleString('vi-VN')
        };
        localStorage.setItem('ENG_STUDENT_PROFILE', JSON.stringify(engProfile));
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('gvai_gradebook_updated', { detail: { timestamp: Date.now() } }));
      }
    } catch (e) {
      console.error('Failed to save students:', e);
    }
  }

  // ==================== QUẢN LÝ SỔ ĐIỂM & BÀI LÀM ====================
  public recordSubmission(data: Omit<StudentSubmission, 'id' | 'submittedAt' | 'rankLevel'>): StudentSubmission {
    // Tính xếp loại học lực theo điểm số thang 10
    let rankLevel: AcademicRank = 'DAT';
    if (data.score >= 9.0) rankLevel = 'XUAT_SAC';
    else if (data.score >= 8.0) rankLevel = 'GIOI';
    else if (data.score >= 6.5) rankLevel = 'KHA';
    else if (data.score >= 5.0) rankLevel = 'DAT';
    else rankLevel = 'CAN_CO_GANG';

    const newSub: StudentSubmission = {
      ...data,
      id: 'sub-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      submittedAt: new Date().toISOString(),
      rankLevel
    };

    this.submissions.unshift(newSub);
    this.saveSubmissions();
    // Tự động cộng điểm chuyên cần & thi đua theo kết quả bài làm:
    try {
      let meritBonus = 0;
      if (newSub.testType === 'gk_ck_exam') {
        meritBonus = Math.round(newSub.score * 10); // VD: 8.5đ -> +85 điểm chuyên cần
        this.addStudentMeritPoints(newSub.studentId, {
          examBonus: meritBonus,
          reason: `Bài thi ${newSub.testTitle}: Đạt ${newSub.score}đ (+${meritBonus} điểm thi đua)`
        });
      } else {
        meritBonus = Math.max(5, Math.round(newSub.score * 5)); // Bài tập SGK/ôn tập: +5 -> +50 điểm
        this.addStudentMeritPoints(newSub.studentId, {
          practice: meritBonus,
          reason: `${newSub.testTitle}: Đạt ${newSub.score}đ (+${meritBonus} điểm chuyên cần)`
        });
      }

      this.recordCheckin(
        { id: newSub.studentId, studentCode: newSub.studentCode, name: newSub.studentName, className: newSub.className, grade: newSub.grade },
        newSub.testType === 'online_quiz' ? 'Hoàn thành bài kiểm tra trắc nghiệm' : (newSub.testType === 'gk_ck_exam' ? 'Nộp bài thi GK-CK' : 'Hoàn thành bài tập SGK'),
        `${newSub.testTitle} - Đạt ${newSub.score}/10 điểm (+${meritBonus} điểm thi đua)`
      );
      this.syncToCloud().catch(() => {});
    } catch {}
    return newSub;
  }

  public getSubmissions(filters?: {
    classId?: string;
    grade?: number;
    testType?: 'sgk_exercise' | 'online_quiz';
    unitNumber?: number;
    studentId?: string;
    searchQuery?: string;
  }): StudentSubmission[] {
    let result = [...this.submissions];

    if (!filters) return result;

    if (filters.classId && filters.classId !== 'all') {
      result = result.filter(s => s.classId === filters.classId);
    }
    if (filters.grade) {
      result = result.filter(s => s.grade === filters.grade);
    }
    if (filters.testType) {
      result = result.filter(s => s.testType === filters.testType);
    }
    if (filters.unitNumber) {
      result = result.filter(s => s.unitNumber === filters.unitNumber);
    }
    if (filters.studentId) {
      result = result.filter(s => s.studentId === filters.studentId);
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(s => 
        s.studentName.toLowerCase().includes(q) || 
        s.studentCode.toLowerCase().includes(q) ||
        s.className.toLowerCase().includes(q) ||
        s.testTitle.toLowerCase().includes(q)
      );
    }

    return result;
  }

  public updateTeacherFeedback(submissionId: string, feedback: string): boolean {
    const idx = this.submissions.findIndex(s => s.id === submissionId);
    if (idx === -1) return false;
    this.submissions[idx].teacherFeedback = feedback;
    this.submissions[idx].feedbackDate = new Date().toISOString();
    this.saveSubmissions();
    return true;
  }

  public deleteSubmission(submissionId: string): boolean {
    this.submissions = this.submissions.filter(s => s.id !== submissionId);
    this.saveSubmissions();
    return true;
  }

  private saveSubmissions() {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(this.submissions));
      if (this.submissions && this.submissions.length > 0) {
        localStorage.setItem(STORAGE_KEYS.VAULT_SUBMISSIONS, JSON.stringify(this.submissions));
        localStorage.setItem('gvai_submissions_backup', JSON.stringify(this.submissions));
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('gvai_gradebook_updated', { detail: { timestamp: Date.now() } }));
      }
    } catch (e) {
      console.error('Failed to save submissions:', e);
    }
  }

  // ==================== BẢNG XẾP HẠNG & SO SÁNH HỌC SINH THEO LỚP ====================
  
  // ==================== BẢNG XẾP HẠNG TOÀN KHỐI ====================
  public getGradeLeaderboard(grade: number): ClassLeaderboardItem[] {
    const gradeStudents = this.students.filter(s => s.grade === grade);
    const gradeSubs = this.submissions.filter(s => s.grade === grade);

    const items: ClassLeaderboardItem[] = gradeStudents.map(student => {
      const stuSubs = gradeSubs.filter(s => s.studentId === student.id);
      const testsCount = stuSubs.length;
      const highestScore = testsCount > 0 ? Math.max(...stuSubs.map(s => s.score)) : 0;
      const averageScore = testsCount > 0 
        ? Math.round((stuSubs.reduce((acc, s) => acc + s.score, 0) / testsCount) * 10) / 10 
        : 0;

      let rankLevel: AcademicRank = 'CAN_CO_GANG';
      if (averageScore >= 9.0) rankLevel = 'XUAT_SAC';
      else if (averageScore >= 8.0) rankLevel = 'GIOI';
      else if (averageScore >= 6.5) rankLevel = 'KHA';
      else if (averageScore >= 5.0) rankLevel = 'DAT';

      const recentSub = stuSubs[0];

      const badges: string[] = [];
      if (highestScore === 10) badges.push('Điểm 10 Tuyệt Đối 🌟');
      if (testsCount >= 5) badges.push('Chăm Chỉ Luyện Đề 📚');
      if (averageScore >= 8.5) badges.push('Thủ Khoa Khối 🏆');

      const att = student.attendancePoints || 0;
      const voc = student.vocabPoints || 0;
      const exm = student.examBonusPoints || 0;
      const prc = student.practicePoints || 0;
      const tme = student.timePoints || 0;
      const enc = student.encouragementBonus ?? 15;
      const tch = student.teacherBonus || 0;
      const totalMerit = (student.totalMeritPoints !== undefined && student.totalMeritPoints !== null)
        ? student.totalMeritPoints
        : (att + voc + exm + prc + tme + enc + tch);

      if (totalMerit >= 100) badges.push('Ngôi Sao Thi Đua ⭐');
      if (att >= 15) badges.push('Chuyên Cần Gương Mẫu ⏰');
      if (voc >= 20) badges.push('Siêu Trí Nhớ 3D 🧠');
      if (tch > 0) badges.push('Được Thầy Khen Thưởng 🎁');
      if (student.studyTimeMinutes && student.studyTimeMinutes >= 30) badges.push('Chiến Binh Bứt Phá 🔥');

      return {
        studentId: student.id,
        studentCode: student.studentCode,
        studentName: student.name,
        className: student.className,
        gender: student.gender,
        rank: 0,
        testsCount,
        highestScore,
        averageScore,
        rankLevel,
        recentTestTitle: recentSub?.testTitle,
        recentScore: recentSub?.score,
        badges,
        attendancePoints: att,
        vocabPoints: voc,
        examBonusPoints: exm,
        practicePoints: prc,
        studyTimeMinutes: student.studyTimeMinutes || 0,
        timePoints: tme,
        encouragementBonus: enc,
        teacherBonus: tch,
        bonusHistory: student.bonusHistory || [],
        levelInfo: calculateStudentLevel(totalMerit, undefined),
        totalMeritPoints: totalMerit
      };
    });

    items.sort((a, b) => {
      if (b.totalMeritPoints !== a.totalMeritPoints) return b.totalMeritPoints - a.totalMeritPoints;
      if (b.averageScore !== a.averageScore) return b.averageScore - a.averageScore;
      if (b.highestScore !== a.highestScore) return b.highestScore - a.highestScore;
      return b.testsCount - a.testsCount;
    });

    items.forEach((item, index) => {
      item.rank = index + 1;
      item.levelInfo = calculateStudentLevel(item.totalMeritPoints, item.rank);
      if (item.rank === 1) item.badges.unshift('Quán Quân Vàng 👑');
      else if (item.rank === 2) item.badges.unshift('Á Quân Bạc 🥈');
      else if (item.rank === 3) item.badges.unshift('Quý Quân Đồng 🥉');
    });

    return items;
  }

  public getClassLeaderboard(classId: string): ClassLeaderboardItem[] {
    const classStudents = this.getStudents(classId);
    const classSubs = this.submissions.filter(s => s.classId === classId);

    const items: ClassLeaderboardItem[] = classStudents.map(student => {
      const stuSubs = classSubs.filter(s => s.studentId === student.id);
      const testsCount = stuSubs.length;
      const highestScore = testsCount > 0 ? Math.max(...stuSubs.map(s => s.score)) : 0;
      const averageScore = testsCount > 0 
        ? Math.round((stuSubs.reduce((acc, s) => acc + s.score, 0) / testsCount) * 10) / 10 
        : 0;

      let rankLevel: AcademicRank = 'CAN_CO_GANG';
      if (averageScore >= 9.0) rankLevel = 'XUAT_SAC';
      else if (averageScore >= 8.0) rankLevel = 'GIOI';
      else if (averageScore >= 6.5) rankLevel = 'KHA';
      else if (averageScore >= 5.0) rankLevel = 'DAT';

      const recentSub = stuSubs[0];

      // Huy hiệu thành tích
      const badges: string[] = [];
      if (highestScore === 10) badges.push('Điểm 10 Tuyệt Đối 🌟');
      if (testsCount >= 5) badges.push('Chăm Chỉ Luyện Đề 📚');
      if (averageScore >= 8.5) badges.push('Học Sinh Xuất Sắc 🏆');

      const att = student.attendancePoints || 0;
      const voc = student.vocabPoints || 0;
      const exm = student.examBonusPoints || 0;
      const prc = student.practicePoints || 0;
      const tme = student.timePoints || 0;
      const enc = student.encouragementBonus ?? 15;
      const tch = student.teacherBonus || 0;
      const totalMerit = (student.totalMeritPoints !== undefined && student.totalMeritPoints !== null)
        ? student.totalMeritPoints
        : (att + voc + exm + prc + tme + enc + tch);

      if (totalMerit >= 100) badges.push('Ngôi Sao Thi Đua ⭐');
      if (att >= 15) badges.push('Chuyên Cần Gương Mẫu ⏰');
      if (voc >= 20) badges.push('Siêu Trí Nhớ 3D 🧠');
      if (tch > 0) badges.push('Được Thầy Khen Thưởng 🎁');
      if (student.studyTimeMinutes && student.studyTimeMinutes >= 30) badges.push('Chiến Binh Bứt Phá 🔥');

      return {
        studentId: student.id,
        studentCode: student.studentCode,
        studentName: student.name,
        className: student.className,
        gender: student.gender,
        rank: 0,
        testsCount,
        highestScore,
        averageScore,
        rankLevel,
        recentTestTitle: recentSub?.testTitle,
        recentScore: recentSub?.score,
        badges,
        attendancePoints: att,
        vocabPoints: voc,
        examBonusPoints: exm,
        practicePoints: prc,
        studyTimeMinutes: student.studyTimeMinutes || 0,
        timePoints: tme,
        encouragementBonus: enc,
        teacherBonus: tch,
        bonusHistory: student.bonusHistory || [],
        levelInfo: calculateStudentLevel(totalMerit, undefined),
        totalMeritPoints: totalMerit
      };
    });

    // Sắp xếp theo: Tổng điểm chuyên cần & thi đua giảm dần -> Điểm trung bình giảm dần
    items.sort((a, b) => {
      if (b.totalMeritPoints !== a.totalMeritPoints) return b.totalMeritPoints - a.totalMeritPoints;
      if (b.averageScore !== a.averageScore) return b.averageScore - a.averageScore;
      if (b.highestScore !== a.highestScore) return b.highestScore - a.highestScore;
      return b.testsCount - a.testsCount;
    });

    // Gán thứ hạng
    items.forEach((item, index) => {
      item.rank = index + 1;
      item.levelInfo = calculateStudentLevel(item.totalMeritPoints, item.rank);
      if (item.rank === 1) item.badges.unshift('Quán Quân Vàng 👑');
      else if (item.rank === 2) item.badges.unshift('Á Quân Bạc 🥈');
      else if (item.rank === 3) item.badges.unshift('Quý Quân Đồng 🥉');
    });

    return items;
  }

  // Thống kê tổng hợp cả lớp để học sinh so sánh với điểm trung bình lớp
  public getClassComparisonStats(classId: string): ClassComparisonStats {
    const classStudents = this.getStudents(classId);
    const leaderboard = this.getClassLeaderboard(classId);
    const activeLeaderboard = leaderboard.filter(i => i.testsCount > 0);

    const totalStudents = classStudents.length;
    const activeStudents = activeLeaderboard.length;

    let classAverageScore = 0;
    if (activeStudents > 0) {
      const sum = activeLeaderboard.reduce((acc, i) => acc + i.averageScore, 0);
      classAverageScore = Math.round((sum / activeStudents) * 10) / 10;
    }

    const highestScore = activeStudents > 0 ? activeLeaderboard[0].highestScore : 0;
    const lowestScore = activeStudents > 0 ? activeLeaderboard[activeLeaderboard.length - 1].averageScore : 0;
    const topStudentName = activeStudents > 0 ? activeLeaderboard[0].studentName : 'Chưa có';
    const topStudentScore = activeStudents > 0 ? activeLeaderboard[0].averageScore : 0;

    const rankCounts: Record<AcademicRank, number> = {
      XUAT_SAC: 0,
      GIOI: 0,
      KHA: 0,
      DAT: 0,
      CAN_CO_GANG: 0
    };

    activeLeaderboard.forEach(item => {
      rankCounts[item.rankLevel] = (rankCounts[item.rankLevel] || 0) + 1;
    });

    return {
      totalStudents,
      activeStudents,
      classAverageScore,
      highestScore,
      lowestScore,
      topStudentName,
      topStudentScore,
      rankCounts
    };
  }

  // ==================== PHIÊN HỌC SINH HIỆN TẠI ====================
  public getActiveStudent(): StudentProfile | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.id) {
          // Luôn lấy bản ghi cập nhật mới nhất từ this.students để đảm bảo điểm số khôi phục chuẩn xác
          const live = this.students.find(s => s.id === parsed.id || (s.name === parsed.name && normalizeClassName(s.className) === normalizeClassName(parsed.className)));
          if (live) return live;
          return parsed;
        }
      }
    } catch {}
    // Tuyệt đối không tự ý gán tài khoản học sinh khác khi chưa đăng nhập
    return null;
  }

  public setActiveStudent(student: StudentProfile | null) {
    try {
      if (student) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, JSON.stringify(student));
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_STUDENT);
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('gvai_active_student_changed', { detail: student }));
      }
    } catch {}
  }

  // ==================== XUẤT SỔ ĐIỂM EXCEL (CSV UTF-8 CÓ DẤU) ====================
  
  // ==================== QUẢN LÝ LỊCH SỬ HỌC SINH VÀO HỌC (CHECK-IN LOGS) ====================
  private saveCheckinLogs() {
    try {
      localStorage.setItem(STORAGE_KEYS.CHECKIN_LOGS, JSON.stringify(this.checkinLogs.slice(0, 500)));
    } catch {}
  }

  public recordCheckin(student: Partial<StudentProfile>, action: string, detail?: string): StudentCheckinLog {
    const log: StudentCheckinLog = {
      id: 'log-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      studentId: student.id || ('stu-' + (student.name || 'guest')),
      studentCode: student.studentCode || '',
      studentName: student.name || 'Học sinh',
      className: student.className || 'Toàn trường',
      grade: student.grade || 12,
      action,
      detail: detail || '',
      timestamp: new Date().toISOString()
    };
    this.checkinLogs.unshift(log);
    if (this.checkinLogs.length > 500) {
      this.checkinLogs = this.checkinLogs.slice(0, 500);
    }
    this.saveCheckinLogs();
    return log;
  }

  public getCheckinLogs(limit = 100, classFilter?: string): StudentCheckinLog[] {
    let list = [...this.checkinLogs];
    if (classFilter && classFilter !== 'ALL' && classFilter !== 'all') {
      const normCls = normalizeClassName(classFilter);
      list = list.filter(l => normalizeClassName(l.className) === normCls);
    }
    return list.slice(0, limit);
  }

  public getPublicStudySummary() {
    const todayStr = new Date().toDateString();
    const todayLogs = this.checkinLogs.filter(l => {
      try {
        return new Date(l.timestamp).toDateString() === todayStr;
      } catch {
        return false;
      }
    });

    const activeClassesMap = new Map<string, number>();
    this.students.forEach(s => {
      const cls = s.className || 'Chưa xếp lớp';
      activeClassesMap.set(cls, (activeClassesMap.get(cls) || 0) + 1);
    });

    const topClasses = Array.from(activeClassesMap.entries())
      .map(([className, studentCount]) => ({ className, studentCount }))
      .sort((a, b) => b.studentCount - a.studentCount)
      .slice(0, 5);

    return {
      totalStudents: this.students.length,
      todayCheckinsCount: todayLogs.length,
      totalSubmissionsCount: this.submissions.length,
      totalClassesCount: activeClassesMap.size,
      topClasses
    };
  }

  // ==================== VÀO HỌC NHANH SIÊU ĐƠN GIẢN (CHỈ CẦN TÊN & LỚP - KHÔNG CẦN ĐĂNG KÝ) ====================
  public quickAccessStudent(fullName: string, className: string, gradeInput?: number): StudentProfile {
    const cleanName = fullName.trim().replace(/\s+/g, ' ');
    let cleanCls = normalizeClassName(className) || '8A1';
    if (!cleanCls) cleanCls = '8A1';

    // Xác định khối lớp tự động (6 -> 12)
    let grade = gradeInput || 8;
    const matchGrade = cleanCls.match(/^(\d{1,2})/);
    if (matchGrade && matchGrade[1]) {
      const gNum = parseInt(matchGrade[1], 10);
      if (gNum >= 6 && gNum <= 12) grade = gNum;
    }

    // Đảm bảo lớp học có trong danh sách
    let targetClass = this.classes.find(c => normalizeClassName(c.name) === cleanCls);
    if (!targetClass) {
      targetClass = {
        id: 'cls-' + cleanCls.toLowerCase().replace(/[^a-z0-9]/g, ''),
        name: cleanCls,
        grade: grade,
        schoolYear: '2026 - 2027',
        homeroomTeacher: 'Giáo viên bộ môn',
        description: `Lớp ${cleanCls}`,
        createdAt: new Date().toISOString()
      };
      this.classes.push(targetClass);
      this.saveClasses();
    }

    // Tìm học sinh đã tồn tại theo Tên + Lớp
    const normInputName = normalizeVietnameseName(cleanName);
    let existing = this.students.find(s => {
      const sNameNorm = normalizeVietnameseName(s.name);
      const sClsNorm = normalizeClassName(s.className);
      return sNameNorm === normInputName && (sClsNorm === cleanCls || s.classId === targetClass!.id);
    });

    const todayStr = getLocalDateString();
    const loginReward = getDailyLoginRewardInfo(todayStr);

    if (existing) {
      existing.grade = grade;
      existing.className = cleanCls;
      existing.classId = targetClass.id;
      // Khởi tạo điểm thưởng khuyến khích nếu chưa có
      if (existing.encouragementBonus === undefined) {
        existing.encouragementBonus = 15;
      }
      
      // Khôi phục điểm bài thi nếu có từ submissions
      const studentSubs = this.submissions.filter(sub => 
        sub.studentId === existing.id || 
        (normalizeVietnameseName(sub.studentName) === normInputName && (normalizeClassName(sub.className) === cleanCls || !sub.className))
      );
      let examFromSubs = 0;
      let practiceFromSubs = 0;
      studentSubs.forEach(sub => {
        if (sub.testType === 'gk_ck_exam') {
          examFromSubs = Math.max(examFromSubs, Math.round(sub.score * 10));
        } else {
          practiceFromSubs += Math.max(10, Math.round(sub.score * 5));
        }
      });
      existing.examBonusPoints = Math.max(existing.examBonusPoints || 0, examFromSubs);
      existing.practicePoints = Math.max(existing.practicePoints || 0, practiceFromSubs);

      const prevTotal = existing.totalMeritPoints || 0;
      const prevLoginDate = existing.lastLoginDate;
      const studiedYesterday = this.didStudentStudyYesterday(existing.id, existing.name, existing.className, todayStr) ||
        (prevLoginDate === getYesterdayDateString(todayStr) || prevLoginDate === '2026-10-27');

      // Khuyến mại duy nhất hôm nay cộng 10 điểm, từ ngày mai cộng 5 điểm cho lần đăng nhập đầu tiên
      if (existing.lastLoginDate !== todayStr) {
        existing.attendancePoints = (existing.attendancePoints || 0) + loginReward.points;
        existing.lastLoginDate = todayStr;
        const sumParts = (
          (existing.attendancePoints || 0) + 
          (existing.vocabPoints || 0) + 
          (existing.examBonusPoints || 0) + 
          (existing.practicePoints || 0) + 
          (existing.timePoints || 0) + 
          (existing.encouragementBonus || 15) +
          (existing.teacherBonus || 0)
        );
        // BẢO VỆ ĐIỂM TỐI CAO: Ít nhất bằng điểm cũ + điểm thưởng hôm nay
        existing.totalMeritPoints = Math.max(prevTotal + loginReward.points, sumParts);
        this.recordCheckin(existing, 'Điểm danh chuyên cần', `Đăng nhập ngày ${todayStr} (+${loginReward.points}đ: ${loginReward.title})`);
      } else {
        const sumParts = (
          (existing.attendancePoints || 0) + 
          (existing.vocabPoints || 0) + 
          (existing.examBonusPoints || 0) + 
          (existing.practicePoints || 0) + 
          (existing.timePoints || 0) + 
          (existing.encouragementBonus || 15) +
          (existing.teacherBonus || 0)
        );
        existing.totalMeritPoints = Math.max(prevTotal, sumParts);
        this.recordCheckin(existing, 'Vào học trực tuyến', `Tiếp tục học tập & ôn luyện Lớp ${cleanCls}`);
      }

      // ================= THƯỞNG PHÁO HOA +20 ĐIỂM NẾU HÔM QUA ĐÃ HỌC VÀ HÔM NAY TIẾP TỤC HỌC =================
      if (studiedYesterday && existing.streakBonusAwardedDate !== todayStr) {
        existing.streakBonusAwardedDate = todayStr;
        const STREAK_BONUS = 20;
        existing.teacherBonus = (existing.teacherBonus || 0) + STREAK_BONUS;
        existing.totalMeritPoints = (existing.totalMeritPoints || 0) + STREAK_BONUS;
        this.recordCheckin(
          existing,
          '🎆 NỔ PHÁO HOA ĂN MỪNG',
          `🎆 Nổ pháo hoa rực rỡ! Đã học hôm qua (${getYesterdayDateString(todayStr)}) và tiếp tục vào học hôm nay (${todayStr})! Thầy Thành tặng thêm +${STREAK_BONUS} điểm thi đua chăm chỉ!`
        );
        if (typeof window !== 'undefined') {
          try {
            window.dispatchEvent(new CustomEvent('gvai_fireworks_streak_reward', {
              detail: { student: existing, streakPoints: STREAK_BONUS, todayStr }
            }));
          } catch {}
        }
      }

      this.setActiveStudent(existing);
      this.saveStudents();
      this.syncToCloud().catch(() => {});
      // Lưu vào bộ nhớ thiết bị để gợi ý 1-chạm lần sau
      try {
        localStorage.setItem('DONGYEN_REMEMBERED_STUDENT', JSON.stringify({
          id: existing.id,
          name: existing.name,
          className: existing.className,
          grade: existing.grade,
          studentCode: existing.studentCode
        }));
      } catch {}
      return existing;
    }

    // Tạo hồ sơ học sinh mới ngay lập tức
    const existingInClass = this.students.filter(s => normalizeClassName(s.className) === cleanCls).length;
    const code = 'HS' + cleanCls.replace(/[^A-Za-z0-9]/g, '') + '-' + (existingInClass + 1).toString().padStart(2, '0');
    
    // Tạo username an toàn từ họ tên
    const slug = cleanName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');

    const newStudent: StudentProfile = {
      id: 'stu-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 1000),
      studentCode: code,
      username: slug || code.toLowerCase(),
      password: '12345',
      name: cleanName,
      classId: targetClass.id,
      className: cleanCls,
      grade: grade,
      gender: 'Nam',
      note: 'Vào học nhanh trực tiếp không cần đăng ký',
      createdAt: new Date().toISOString(),
      attendancePoints: loginReward.points,
      vocabPoints: 0,
      examBonusPoints: 0,
      practicePoints: 0,
      studyTimeMinutes: 0,
      timePoints: 0,
      encouragementBonus: 15,
      totalMeritPoints: 15 + loginReward.points,
      lastLoginDate: todayStr
    };
    try {
      localStorage.setItem('DONGYEN_REMEMBERED_STUDENT', JSON.stringify({
        id: newStudent.id,
        name: newStudent.name,
        className: newStudent.className,
        grade: newStudent.grade,
        studentCode: newStudent.studentCode
      }));
    } catch {}

    this.students.push(newStudent);
    this.saveStudents();
    this.setActiveStudent(newStudent);
    this.recordCheckin(newStudent, 'Vào học trực tuyến', `Bắt đầu buổi học mới tại Lớp ${cleanCls} (+${loginReward.points}đ: ${loginReward.title})`);
    this.syncToCloud().catch(() => {});
    return newStudent;
  }

  public exportGradebookToCSV(classId?: string): string {
    const list = this.getSubmissions({ classId });
    const targetClass = classId && classId !== 'all' ? this.getClassById(classId) : null;
    const className = targetClass ? targetClass.name : 'Toàn Trường';

    const headers = [
      'STT',
      'Mã Học Sinh',
      'Họ và Tên',
      'Lớp',
      'Khối',
      'Hình Thức Kiểm Tra',
      'Bài Học / Unit',
      'Tên Bài Kiểm Tra',
      'Số Câu Đúng',
      'Tổng Số Câu',
      'Điểm Số (/10)',
      'Xếp Loại Học Lực',
      'Thời Gian Làm (Giây)',
      'Ngày Nộp Bài',
      'Lời Phê Của Thầy Cô'
    ];

    const rows = list.map((item, index) => {
      const typeLabel = item.testType === 'online_quiz' ? 'Đề Thi Online Trắc Nghiệm' : 'Bài Tập SGK Theo Phần';
      let rankText = 'Đạt Yêu Cầu';
      if (item.rankLevel === 'XUAT_SAC') rankText = 'Xuất Sắc (9 - 10)';
      else if (item.rankLevel === 'GIOI') rankText = 'Giỏi (8 - 8.9)';
      else if (item.rankLevel === 'KHA') rankText = 'Khá (6.5 - 7.9)';
      else if (item.rankLevel === 'DAT') rankText = 'Đạt (5.0 - 6.4)';
      else rankText = 'Chưa Đạt (< 5.0)';

      return [
        index + 1,
        `"${item.studentCode}"`,
        `"${item.studentName}"`,
        `"${item.className}"`,
        item.grade,
        `"${typeLabel}"`,
        `"${item.unitTitle}"`,
        `"${item.testTitle}"`,
        item.correctCount,
        item.totalQuestions,
        item.score,
        `"${rankText}"`,
        item.timeSpentSeconds,
        `"${new Date(item.submittedAt).toLocaleString('vi-VN')}"`,
        `"${item.teacherFeedback || ''}"`
      ].join(',');
    });

    // Thêm BOM \uFEFF để Excel mở trực tiếp file CSV không bao giờ bị lỗi font tiếng Việt!
    return '\uFEFF' + [
      `"SỔ ĐIỂM TRỰC TUYẾN - ${className.toUpperCase()}"`,
      `"Trường THCS Đồng Yên - Giáo Viên Phụ Trách: Thầy Đinh Văn Thành (0915.213717)"`,
      `"Ngày xuất dữ liệu: ${new Date().toLocaleDateString('vi-VN')}"`,
      '',
      headers.join(','),
      ...rows
    ].join('\r\n');
  }

  /**
   * Đặt lại (reset) toàn bộ điểm thi đua, tiến độ học tập và bài thi đã test thử trên máy tính này
   * Trả học sinh về trạng thái ban đầu sạch sẽ
   */
  public resetAllTestProgress(studentId?: string): { success: boolean; count: number } {
    let affectedCount = 0;

    if (studentId) {
      const s = this.students.find(st => st.id === studentId);
      if (s) {
        s.attendancePoints = 0;
        s.vocabPoints = 0;
        s.examBonusPoints = 0;
        s.practicePoints = 0;
        s.studyTimeMinutes = 0;
        s.timePoints = 0;
        s.totalMeritPoints = 0;
        s.lastLoginDate = undefined;
        affectedCount = 1;

        try {
          localStorage.removeItem('MIDTERM_MISSION_EVAL_' + s.id);
          localStorage.removeItem('gvai_dob_verified_' + s.id);
        } catch {}
      }
      this.submissions = this.submissions.filter(sub => sub.studentId !== studentId);
      this.checkinLogs = this.checkinLogs.filter(log => log.studentId !== studentId);
    } else {
      this.students.forEach(s => {
        s.attendancePoints = 0;
        s.vocabPoints = 0;
        s.examBonusPoints = 0;
        s.practicePoints = 0;
        s.studyTimeMinutes = 0;
        s.timePoints = 0;
        s.totalMeritPoints = 0;
        s.lastLoginDate = undefined;
        affectedCount++;

        try {
          localStorage.removeItem('MIDTERM_MISSION_EVAL_' + s.id);
          localStorage.removeItem('gvai_dob_verified_' + s.id);
        } catch {}
      });

      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.startsWith('MIDTERM_MISSION_EVAL_') || k.startsWith('gvai_dob_verified_'))) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
      } catch {}

      this.submissions = [];
      this.checkinLogs = [];
    }

    this.saveStudents();
    this.saveSubmissions();
    try {
      localStorage.setItem(STORAGE_KEYS.CHECKIN_LOGS, JSON.stringify(this.checkinLogs));
    } catch {}

    const active = this.getActiveStudent();
    if (active && (!studentId || active.id === studentId)) {
      const updated = this.students.find(s => s.id === active.id);
      if (updated) {
        this.setActiveStudent(updated);
      }
    }

    return { success: true, count: affectedCount };
  }

  // Khôi phục dữ liệu mẫu ban đầu
  public resetToDefault() {
    this.classes = DEFAULT_CLASSES;
    this.students = DEFAULT_STUDENTS;
    this.submissions = DEFAULT_SUBMISSIONS;
    this.saveClasses();
    this.saveStudents();
    this.saveSubmissions();
  }

  // ==================== HỆ THỐNG TÍCH ĐIỂM CHUYÊN CẦN & THI ĐUA ====================

  /**
   * Cộng điểm chuyên cần / thi đua tổng hợp cho học sinh
   */
  public addStudentMeritPoints(studentId: string, options: {
    attendance?: number;
    vocab?: number;
    examBonus?: number;
    practice?: number;
    timePoints?: number;
    minutes?: number;
    teacherBonus?: number;
    reason?: string;
  }): StudentProfile | null {
    const student = this.students.find(s => s.id === studentId);
    if (!student) return null;

    if (options.attendance) student.attendancePoints = (student.attendancePoints || 0) + options.attendance;
    if (options.vocab) student.vocabPoints = (student.vocabPoints || 0) + options.vocab;
    if (options.examBonus) student.examBonusPoints = (student.examBonusPoints || 0) + options.examBonus;
    if (options.practice) student.practicePoints = (student.practicePoints || 0) + options.practice;
    if (options.timePoints) student.timePoints = (student.timePoints || 0) + options.timePoints;
    if (options.minutes) student.studyTimeMinutes = (student.studyTimeMinutes || 0) + options.minutes;
    if (options.teacherBonus) student.teacherBonus = (student.teacherBonus || 0) + options.teacherBonus;

    student.totalMeritPoints = 
      (student.attendancePoints || 0) + 
      (student.vocabPoints || 0) + 
      (student.examBonusPoints || 0) + 
      (student.practicePoints || 0) + 
      (student.timePoints || 0) +
      (student.encouragementBonus ?? 15) +
      (student.teacherBonus || 0);

    this.saveStudents();

    const active = this.getActiveStudent();
    if (active && active.id === student.id) {
      this.setActiveStudent(student);
    }

    if (options.reason) {
      try {
        this.recordCheckin(student, 'Tích điểm thi đua', options.reason);
      } catch {}
    }

    return student;
  }

  /**
   * Giáo viên thưởng thêm điểm cho học sinh tích cực (công khai minh bạch trong mục thống kê)
   */
  public awardTeacherBonus(
    studentId: string, 
    bonusPoints: number, 
    reason: string, 
    awardedBy: string = 'Thầy Đinh Văn Thành'
  ): { success: boolean; student?: StudentProfile; message: string } {
    const student = this.students.find(s => s.id === studentId);
    if (!student) return { success: false, message: 'Không tìm thấy học sinh!' };

    if (!student.bonusHistory) {
      student.bonusHistory = [];
    }

    const bonusItem: MeritBonusItem = {
      id: 'bonus-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      points: bonusPoints,
      reason: reason || 'Khen thưởng học tập tích cực',
      awardedBy: awardedBy || 'Thầy Đinh Văn Thành',
      createdAt: new Date().toISOString()
    };

    student.bonusHistory.unshift(bonusItem);
    student.teacherBonus = (student.teacherBonus || 0) + bonusPoints;

    student.totalMeritPoints = 
      (student.attendancePoints || 0) + 
      (student.vocabPoints || 0) + 
      (student.examBonusPoints || 0) + 
      (student.practicePoints || 0) + 
      (student.timePoints || 0) +
      (student.encouragementBonus ?? 15) +
      (student.teacherBonus || 0);

    this.saveStudents();

    const active = this.getActiveStudent();
    if (active && active.id === student.id) {
      this.setActiveStudent(student);
    }

    try {
      this.recordCheckin(student, 'Thưởng điểm tích cực', `+${bonusPoints}đ do ${awardedBy}: ${reason}`);
    } catch {}

    return { 
      success: true, 
      student, 
      message: `Đã thưởng +${bonusPoints} điểm thi đua cho học sinh ${student.name}!` 
    };
  }

  /**
   * 1. Điểm danh đăng nhập: Khuyến mại DUY NHẤT HÔM NAY +10 điểm, từ ngày mai +5 điểm
   */
  public recordDailyLogin(studentId: string): { awarded: number; total: number; isFirstToday: boolean; rewardInfo: DailyLoginRewardInfo } {
    const today = getLocalDateString();
    const loginReward = getDailyLoginRewardInfo(today);
    const student = this.students.find(s => s.id === studentId);
    if (!student) {
      return { awarded: 0, total: 0, isFirstToday: false, rewardInfo: loginReward };
    }
    if (student.lastLoginDate !== today) {
      student.lastLoginDate = today;
      this.addStudentMeritPoints(studentId, {
        attendance: loginReward.points,
        reason: `Đăng nhập chuyên cần ngày ${today} (+${loginReward.points}đ: ${loginReward.title})`
      });
      return {
        awarded: loginReward.points,
        total: student.totalMeritPoints || 0,
        isFirstToday: true,
        rewardInfo: loginReward
      };
    }
    return {
      awarded: 0,
      total: student.totalMeritPoints || 0,
      isFirstToday: false,
      rewardInfo: loginReward
    };
  }

  /**
   * 2. Hoàn thành 1 bài từ vựng: +10 điểm chuyên cần
   */
  public recordVocabUnitCompleted(studentId: string, unitNumber: number, grade: number): number {
    const student = this.addStudentMeritPoints(studentId, {
      vocab: 10,
      reason: `Học xong từ vựng Unit ${unitNumber} - Lớp ${grade} (+10 điểm)`
    });
    return student?.totalMeritPoints || 0;
  }

  /**
   * 3. Điểm bài thi giữa kỳ: Tùy theo điểm đạt được để cộng điểm vào tổng điểm
   */
  public recordExamScoreMerit(studentId: string, examTitle: string, score: number): number {
    const bonus = Math.round(score * 10);
    const student = this.addStudentMeritPoints(studentId, {
      examBonus: bonus,
      reason: `Điểm thi ${examTitle}: ${score}đ (+${bonus} điểm thi đua)`
    });
    return student?.totalMeritPoints || 0;
  }

  /**
   * 4. Ôn tập đề cương và làm bài tập: +10 điểm chuyên cần
   */
  public recordPracticeMerit(studentId: string, sectionTitle: string, bonus: number = 10): number {
    const student = this.addStudentMeritPoints(studentId, {
      practice: bonus,
      reason: `Ôn tập đề cương: ${sectionTitle} (+${bonus} điểm)`
    });
    return student?.totalMeritPoints || 0;
  }

  /**
   * 5. Thời gian học và tương tác thời gian thực: Cứ mỗi 5 phút +3 điểm
   */
  public recordActiveStudyTime(studentId: string, minutes: number = 5): number {
    const student = this.students.find(s => s.id === studentId);
    if (!student) return 0;
    const oldMinutes = student.studyTimeMinutes || 0;
    const newMinutes = oldMinutes + minutes;
    const oldBuckets = Math.floor(oldMinutes / 5);
    const newBuckets = Math.floor(newMinutes / 5);
    const pointsAwarded = (newBuckets - oldBuckets) * 3;

    this.addStudentMeritPoints(studentId, {
      minutes: minutes,
      timePoints: pointsAwarded > 0 ? pointsAwarded : 0,
      reason: pointsAwarded > 0 ? `Học tập tích cực (${newMinutes} phút) (+${pointsAwarded} điểm)` : undefined
    });
    return student.totalMeritPoints || 0;
  }

  /**
   * Bảng xếp hạng toàn trường (School Leaderboard) để học sinh so sánh với bạn cùng lớp, cùng trường
   */
  public getSchoolLeaderboard(gradeFilter?: number, sortBy: 'merit' | 'score' = 'merit'): ClassLeaderboardItem[] {
    let targetStudents = this.students;
    if (gradeFilter && gradeFilter > 0) {
      targetStudents = targetStudents.filter(s => s.grade === gradeFilter);
    }

    const items: ClassLeaderboardItem[] = targetStudents.map(student => {
      const stuSubs = this.submissions.filter(s => s.studentId === student.id);
      const testsCount = stuSubs.length;
      const highestScore = testsCount > 0 ? Math.max(...stuSubs.map(s => s.score)) : 0;
      const averageScore = testsCount > 0 
        ? Math.round((stuSubs.reduce((acc, s) => acc + s.score, 0) / testsCount) * 10) / 10 
        : 0;

      let rankLevel: AcademicRank = 'CAN_CO_GANG';
      if (averageScore >= 9.0) rankLevel = 'XUAT_SAC';
      else if (averageScore >= 8.0) rankLevel = 'GIOI';
      else if (averageScore >= 6.5) rankLevel = 'KHA';
      else if (averageScore >= 5.0) rankLevel = 'DAT';

      const att = student.attendancePoints || 0;
      const voc = student.vocabPoints || 0;
      const exm = student.examBonusPoints || 0;
      const prc = student.practicePoints || 0;
      const tme = student.timePoints || 0;
      const enc = student.encouragementBonus ?? 15;
      const tch = student.teacherBonus || 0;
      const totalMerit = (student.totalMeritPoints !== undefined && student.totalMeritPoints !== null)
        ? student.totalMeritPoints
        : (att + voc + exm + prc + tme + enc + tch);

      const badges: string[] = [];
      if (totalMerit >= 100) badges.push('Ngôi Sao Thi Đua ⭐');
      if (att >= 15) badges.push('Chuyên Cần Gương Mẫu ⏰');
      if (voc >= 20) badges.push('Siêu Trí Nhớ 3D 🧠');
      if (highestScore === 10) badges.push('Điểm 10 Tuyệt Đối 🌟');
      if (testsCount >= 3) badges.push('Chăm Chỉ Luyện Đề 📚');
      if (tch > 0) badges.push('Được Thầy Khen Thưởng 🎁');
      if (student.studyTimeMinutes && student.studyTimeMinutes >= 30) badges.push('Chiến Binh Bứt Phá 🔥');

      return {
        studentId: student.id,
        studentCode: student.studentCode,
        studentName: student.name,
        className: student.className,
        gender: student.gender,
        rank: 0,
        testsCount,
        highestScore,
        averageScore,
        rankLevel,
        recentTestTitle: stuSubs[0]?.testTitle,
        recentScore: stuSubs[0]?.score,
        badges,
        attendancePoints: att,
        vocabPoints: voc,
        examBonusPoints: exm,
        practicePoints: prc,
        studyTimeMinutes: student.studyTimeMinutes || 0,
        timePoints: tme,
        encouragementBonus: enc,
        teacherBonus: tch,
        bonusHistory: student.bonusHistory || [],
        levelInfo: calculateStudentLevel(totalMerit, undefined),
        totalMeritPoints: totalMerit
      };
    });

    if (sortBy === 'merit') {
      items.sort((a, b) => {
        if (b.totalMeritPoints !== a.totalMeritPoints) return b.totalMeritPoints - a.totalMeritPoints;
        if (b.averageScore !== a.averageScore) return b.averageScore - a.averageScore;
        return b.testsCount - a.testsCount;
      });
    } else {
      items.sort((a, b) => {
        if (b.averageScore !== a.averageScore) return b.averageScore - a.averageScore;
        if (b.totalMeritPoints !== a.totalMeritPoints) return b.totalMeritPoints - a.totalMeritPoints;
        return b.testsCount - a.testsCount;
      });
    }

    items.forEach((item, index) => {
      item.rank = index + 1;
      item.levelInfo = calculateStudentLevel(item.totalMeritPoints, item.rank);
      if (item.rank === 1) item.badges.unshift('Quán Quân Vàng 👑');
      else if (item.rank === 2) item.badges.unshift('Á Quân Bạc 🥈');
      else if (item.rank === 3) item.badges.unshift('Quý Quân Đồng 🥉');
    });

    return items;
  }


  // ==================== TỰ ĐỘNG CHUẨN HÓA CHÍNH TẢ THEO DANH SÁCH LỚP ====================
  public standardizeStudentName(rawName: string, className?: string): StandardizeStudentNameResult {
    return standardizeStudentName(rawName, className);
  }

  public getOfficialNameSuggestions(query: string, className?: string, limit: number = 8): OfficialStudentRosterItem[] {
    return getOfficialNameSuggestions(query, className, limit);
  }

  // ==================== BÁO CÁO ĐIỂM DANH & ROSTER HỌC SINH TỪNG LỚP ====================
  public getOfficialRosterFull(className?: string): OfficialStudentRosterItem[] {
    const allData = officialRosterData as Record<string, OfficialStudentRosterItem[]>;
    if (!className || className === 'ALL') {
      const all: OfficialStudentRosterItem[] = [];
      Object.values(allData).forEach(arr => {
        all.push(...arr);
      });
      return all;
    }
    const clean = normalizeClassName(className);
    return allData[clean] || [];
  }

  public getClassAttendanceReport(className: string = 'ALL'): ClassAttendanceReport {
    const allRoster = this.getOfficialRosterFull(className);

    // Map danh sách học sinh đã vào học từ this.students
    const studentProfileMap = new Map<string, StudentProfile>();
    this.students.forEach(s => {
      const key = `${normalizeVietnameseName(s.name)}__${normalizeClassName(s.className)}`;
      studentProfileMap.set(key, s);
      if (s.studentCode) {
        studentProfileMap.set(s.studentCode.trim().toLowerCase(), s);
      }
    });

    // Map bài nộp từ this.submissions
    const subMap = new Map<string, StudentSubmission[]>();
    this.submissions.forEach(sub => {
      const key = `${normalizeVietnameseName(sub.studentName)}__${normalizeClassName(sub.className)}`;
      const list = subMap.get(key) || [];
      list.push(sub);
      subMap.set(key, list);
    });

    let enteredCount = 0;
    let totalMerit = 0;

    const list: ClassAttendanceStudentStatus[] = allRoster.map(item => {
      const key = `${normalizeVietnameseName(item.name)}__${normalizeClassName(item.className)}`;
      const profile = studentProfileMap.get(key) || (item.studentCode ? studentProfileMap.get(item.studentCode.trim().toLowerCase()) : undefined);
      const studentSubs = subMap.get(key) || [];

      // Học sinh được tính là đã vào học nếu có hoạt động thực tế (đã đăng nhập, chuyên cần, thời gian học, bài nộp)
      const hasEntered = Boolean(
        profile && (
          Boolean(profile.lastLoginDate) ||
          ((profile.attendancePoints || 0) > 0) ||
          ((profile.studyTimeMinutes || 0) > 0) ||
          ((profile.vocabPoints || 0) > 0) ||
          ((profile.practicePoints || 0) > 0) ||
          ((profile.examBonusPoints || 0) > 0) ||
          studentSubs.length > 0
        )
      );

      if (hasEntered) enteredCount++;

      const merit = profile?.totalMeritPoints || 0;
      totalMerit += merit;

      let highestScore: number | null = null;
      if (studentSubs.length > 0) {
        highestScore = Math.max(...studentSubs.map(s => s.score));
      }

      return {
        stt: item.stt,
        studentCode: item.studentCode || profile?.studentCode || '',
        name: item.name,
        className: item.className,
        grade: item.grade,
        dob: item.dob,
        regularScore: item.regularScore,
        hasEntered,
        totalMeritPoints: merit,
        attendancePoints: profile?.attendancePoints || 0,
        vocabPoints: profile?.vocabPoints || 0,
        examBonusPoints: profile?.examBonusPoints || 0,
        practicePoints: profile?.practicePoints || 0,
        encouragementBonus: profile?.encouragementBonus ?? 15,
        teacherBonus: profile?.teacherBonus || 0,
        bonusHistory: profile?.bonusHistory || [],
        levelInfo: calculateStudentLevel(merit, undefined),
        submissionsCount: studentSubs.length,
        highestExamScore: highestScore,
        lastActive: profile?.lastLoginDate || (studentSubs[0]?.submittedAt ? new Date(studentSubs[0].submittedAt).toLocaleDateString('vi-VN') : null)
      };
    });

    const totalRoster = list.length;
    const notEnteredCount = totalRoster - enteredCount;
    const enteredPercentage = totalRoster > 0 ? Math.round((enteredCount / totalRoster) * 100) : 0;

    return {
      className,
      totalRoster,
      enteredCount,
      notEnteredCount,
      enteredPercentage,
      totalMeritPoints: totalMerit,
      students: list
    };
  }

  // =========================================================================
  // XÁC THỰC DANH TÍNH HỌC SINH BẰNG NGÀY THÁNG NĂM SINH (DOB) CHUẨN SỔ ĐIỂM
  // =========================================================================
  public normalizeDob(dobStr: string): string {
    if (!dobStr) return '';
    const clean = dobStr.trim().replace(/[-.]/g, '/');
    const mYmd = clean.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
    if (mYmd) {
      return `${mYmd[3].padStart(2, '0')}/${mYmd[2].padStart(2, '0')}/${mYmd[1]}`;
    }
    const mDmy = clean.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (mDmy) {
      return `${mDmy[1].padStart(2, '0')}/${mDmy[2].padStart(2, '0')}/${mDmy[3]}`;
    }
    return clean;
  }

  public getOfficialStudentDob(studentName: string, className: string): string {
    const cleanCls = normalizeClassName(className);
    const rosters = (officialRosterData as Record<string, OfficialStudentRosterItem[]>)[cleanCls] || [];
    const normName = normalizeVietnameseName(studentName);
    const matched = rosters.find(r => normalizeVietnameseName(r.name) === normName);
    if (matched && matched.dob) {
      return this.normalizeDob(matched.dob);
    }
    const stu = this.students.find(s => normalizeVietnameseName(s.name) === normName && normalizeClassName(s.className) === cleanCls);
    if (stu && stu.dob) {
      return this.normalizeDob(stu.dob);
    }
    return '';
  }

  public isStudentIdentityVerified(studentId: string): boolean {
    if (!studentId) return false;
    try {
      return localStorage.getItem(`gvai_dob_verified_${studentId}`) === 'true' ||
             sessionStorage.getItem(`gvai_dob_verified_${studentId}`) === 'true';
    } catch {
      return false;
    }
  }

  public setStudentIdentityVerified(studentId: string, verified: boolean = true): void {
    if (!studentId) return;
    try {
      if (verified) {
        localStorage.setItem(`gvai_dob_verified_${studentId}`, 'true');
        sessionStorage.setItem(`gvai_dob_verified_${studentId}`, 'true');
      } else {
        localStorage.removeItem(`gvai_dob_verified_${studentId}`);
        sessionStorage.removeItem(`gvai_dob_verified_${studentId}`);
      }
    } catch {}
  }

  public verifyStudentDob(student: StudentProfile, inputDob: string): { success: boolean; message: string } {
    if (!student) return { success: false, message: 'Chưa có thông tin học sinh!' };
    const normInput = this.normalizeDob(inputDob);
    if (!normInput || normInput.length < 8) {
      return { success: false, message: 'Vui lòng nhập đầy đủ ngày, tháng, năm sinh (ví dụ: 14/08/2013)!' };
    }

    const officialDob = this.getOfficialStudentDob(student.name, student.className) || this.normalizeDob(student.dob || '');

    // Nếu học sinh đã có ngày sinh trong sổ điểm chính thức của Thầy Thành
    if (officialDob) {
      if (normInput === officialDob) {
        this.setStudentIdentityVerified(student.id, true);
        return { success: true, message: 'Xác thực danh tính học sinh thành công!' };
      } else {
        return { 
          success: false, 
          message: `Ngày tháng năm sinh "${normInput}" không trùng khớp với sổ điểm bộ môn của Lớp ${student.className}! Em vui lòng kiểm tra lại ngày sinh chính xác trên giấy khai sinh nhé.` 
        };
      }
    }

    // Trường hợp học sinh lớp mở rộng chưa có ngày sinh trong sổ điểm:
    student.dob = normInput;
    this.updateStudent(student.id, { dob: normInput });
    this.setStudentIdentityVerified(student.id, true);
    return { success: true, message: 'Đã lưu và xác thực ngày sinh thành công!' };
  }

  public getOfficialClassesList(): Array<{ name: string; grade: number; totalStudents: number }> {
    const allData = officialRosterData as Record<string, OfficialStudentRosterItem[]>;
    return Object.entries(allData).map(([cls, list]) => {
      const gNum = parseInt(cls[0] || '8', 10);
      return {
        name: cls,
        grade: gNum,
        totalStudents: list.length
      };
    });
  }

}

export const studentGradebookService = new StudentGradebookService();

// Gắn vào window để Thầy Đinh Thành có thể gọi trực tiếp bất kỳ lúc nào từ F12 Console
if (typeof window !== 'undefined') {
  (window as unknown as { resetDongYenTestData: (studentId?: string) => { success: boolean; count: number } }).resetDongYenTestData = (studentId?: string) => {
    return studentGradebookService.resetAllTestProgress(studentId);
  };
}
