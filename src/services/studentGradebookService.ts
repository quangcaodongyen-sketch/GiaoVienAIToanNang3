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
  totalMeritPoints: number;
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

      // 2. Tự động rà soát và hợp nhất tài khoản trùng lặp (giữ điểm cao nhất, bảo toàn 100% dữ liệu)
      this.deduplicateAndMergeStudents();

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

  // ==================== TỰ RÀ SOÁT TÀI KHOẢN TRÙNG ĐỂ HỢP NHẤT (MERGE DEDUPLICATE) ====================
  public deduplicateAndMergeStudents(): {
    mergedCount: number;
    originalCount: number;
    currentCount: number;
    details: string[];
  } {
    const originalCount = this.students.length;
    if (originalCount <= 1) {
      return { mergedCount: 0, originalCount, currentCount: originalCount, details: [] };
    }

    const groups: StudentProfile[][] = [];
    const visited = new Set<string>();

    for (let i = 0; i < this.students.length; i++) {
      const s1 = this.students[i];
      if (visited.has(s1.id)) continue;

      const currentGroup: StudentProfile[] = [s1];
      visited.add(s1.id);

      const normName1 = normalizeVietnameseName(s1.name);
      const normClass1 = normalizeClassName(s1.className);
      const phone1 = (s1.parentPhone || '').replace(/\D/g, '');
      const user1 = (s1.username || '').trim().toLowerCase();

      for (let j = i + 1; j < this.students.length; j++) {
        const s2 = this.students[j];
        if (visited.has(s2.id)) continue;

        const normName2 = normalizeVietnameseName(s2.name);
        const normClass2 = normalizeClassName(s2.className);
        const phone2 = (s2.parentPhone || '').replace(/\D/g, '');
        const user2 = (s2.username || '').trim().toLowerCase();

        // Tiêu chí nhận diện tài khoản trùng:
        // 1. Trùng họ tên + cùng lớp (hoặc cùng khối lớp)
        const isSameNameAndClass = normName1 && normName1 === normName2 && (normClass1 === normClass2 || s1.grade === s2.grade);
        // 2. Trùng số điện thoại phụ huynh (độ dài >= 9 số)
        const isSamePhone = phone1.length >= 9 && phone1 === phone2;
        // 3. Trùng username đăng nhập
        const isSameUsername = user1.length >= 2 && user1 === user2;
        // 4. Trùng mã học sinh
        const isSameCode = s1.studentCode && s2.studentCode && s1.studentCode.trim().toLowerCase() === s2.studentCode.trim().toLowerCase();

        if (isSameNameAndClass || isSamePhone || isSameUsername || isSameCode) {
          currentGroup.push(s2);
          visited.add(s2.id);
        }
      }

      groups.push(currentGroup);
    }

    const details: string[] = [];
    const unifiedStudents: StudentProfile[] = [];
    const idMigrationMap = new Map<string, StudentProfile>();

    let mergedCount = 0;

    for (const group of groups) {
      if (group.length === 1) {
        unifiedStudents.push(group[0]);
        continue;
      }

      mergedCount += (group.length - 1);

      // Sắp xếp ưu tiên giữ tài khoản chuẩn nhất
      group.sort((a, b) => {
        const aAuth = (a.username ? 2 : 0) + (a.password ? 2 : 0);
        const bAuth = (b.username ? 2 : 0) + (b.password ? 2 : 0);
        if (bAuth !== aAuth) return bAuth - aAuth;
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      });

      const canonical: StudentProfile = { ...group[0] };

      // Hợp nhất các thông tin từ các tài khoản trùng khác
      group.forEach(other => {
        if (!canonical.username && other.username) canonical.username = other.username;
        if (!canonical.password && other.password) canonical.password = other.password;
        if (!canonical.parentPhone && other.parentPhone) canonical.parentPhone = other.parentPhone;
        if (!canonical.dob && other.dob) canonical.dob = other.dob;
        if (!canonical.note && other.note) canonical.note = other.note;
        if (!canonical.studentCode && other.studentCode) canonical.studentCode = other.studentCode;
      });

      // Ánh xạ tất cả ID cũ sang tài khoản chuẩn
      group.forEach(s => {
        idMigrationMap.set(s.id, canonical);
      });

      unifiedStudents.push(canonical);
      details.push(`Hợp nhất ${group.length} tài khoản trùng của học sinh "${canonical.name}" (Lớp ${canonical.className})`);
    }

    this.students = unifiedStudents;

    // Hợp nhất toàn bộ bài nộp & giữ điểm cao nhất
    if (idMigrationMap.size > 0) {
      this.submissions.forEach(sub => {
        const canonical = idMigrationMap.get(sub.studentId);
        if (canonical) {
          sub.studentId = canonical.id;
          sub.studentName = canonical.name;
          sub.studentCode = canonical.studentCode;
          sub.className = canonical.className;
          sub.classId = canonical.classId;
          sub.grade = canonical.grade;
        }
      });

      const subKeyMap = new Map<string, StudentSubmission>();
      this.submissions.forEach(sub => {
        const testKey = `${sub.studentId}__${sub.testType}__${sub.unitNumber}__${(sub.testTitle || '').toLowerCase()}`;
        const existing = subKeyMap.get(testKey);
        if (!existing) {
          subKeyMap.set(testKey, sub);
        } else {
          if (sub.score > existing.score) {
            subKeyMap.set(testKey, sub);
          }
        }
      });
      this.submissions = Array.from(subKeyMap.values());
    }

    this.saveStudents();
    this.saveSubmissions();
    this.syncToCloud().catch(() => {});

    return {
      mergedCount,
      originalCount,
      currentCount: this.students.length,
      details
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
            if (s.password && !existing.password) {
              existing.password = s.password;
            }
          }
        });
        this.students = Array.from(map.values());
        this.saveStudents();
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
      const totalMerit = (student.totalMeritPoints !== undefined && student.totalMeritPoints !== null)
        ? student.totalMeritPoints
        : (att + voc + exm + prc + tme);

      if (totalMerit >= 100) badges.push('Ngôi Sao Thi Đua ⭐');
      if (att >= 15) badges.push('Chuyên Cần Gương Mẫu ⏰');
      if (voc >= 20) badges.push('Siêu Trí Nhớ 3D 🧠');

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
      const totalMerit = (student.totalMeritPoints !== undefined && student.totalMeritPoints !== null)
        ? student.totalMeritPoints
        : (att + voc + exm + prc + tme);

      if (totalMerit >= 100) badges.push('Ngôi Sao Thi Đua ⭐');
      if (att >= 15) badges.push('Chuyên Cần Gương Mẫu ⏰');
      if (voc >= 20) badges.push('Siêu Trí Nhớ 3D 🧠');

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
        if (parsed && parsed.id) return parsed;
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

    const todayStr = new Date().toISOString().slice(0, 10);
    if (existing) {
      existing.grade = grade;
      existing.className = cleanCls;
      existing.classId = targetClass.id;
      // Cộng 5 điểm chuyên cần mỗi ngày đăng nhập
      if (existing.lastLoginDate !== todayStr) {
        existing.attendancePoints = (existing.attendancePoints || 0) + 5;
        existing.lastLoginDate = todayStr;
        existing.totalMeritPoints = ((existing.attendancePoints || 0) + (existing.vocabPoints || 0) + (existing.examBonusPoints || 0) + (existing.practicePoints || 0) + (existing.timePoints || 0));
        this.recordCheckin(existing, 'Điểm danh chuyên cần', `Đăng nhập ngày ${todayStr} (+5 điểm chuyên cần)`);
      } else {
        this.recordCheckin(existing, 'Vào học trực tuyến', `Tiếp tục học tập & ôn luyện Lớp ${cleanCls}`);
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
      attendancePoints: 5,
      vocabPoints: 0,
      examBonusPoints: 0,
      practicePoints: 0,
      studyTimeMinutes: 0,
      timePoints: 0,
      totalMeritPoints: 5,
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
    this.recordCheckin(newStudent, 'Vào học trực tuyến', `Bắt đầu buổi học mới tại Lớp ${cleanCls}`);
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

    student.totalMeritPoints = 
      (student.attendancePoints || 0) + 
      (student.vocabPoints || 0) + 
      (student.examBonusPoints || 0) + 
      (student.practicePoints || 0) + 
      (student.timePoints || 0);

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
   * 1. Điểm danh đăng nhập: +5 điểm chuyên cần
   */
  public recordDailyLogin(studentId: string): number {
    const today = new Date().toISOString().slice(0, 10);
    const student = this.students.find(s => s.id === studentId);
    if (!student) return 0;
    if (student.lastLoginDate !== today) {
      student.lastLoginDate = today;
      this.addStudentMeritPoints(studentId, {
        attendance: 5,
        reason: `Đăng nhập chuyên cần ngày ${today} (+5 điểm)`
      });
    }
    return student.totalMeritPoints || 0;
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
      const totalMerit = (student.totalMeritPoints !== undefined && student.totalMeritPoints !== null)
        ? student.totalMeritPoints
        : (att + voc + exm + prc + tme);

      const badges: string[] = [];
      if (totalMerit >= 100) badges.push('Ngôi Sao Thi Đua ⭐');
      if (att >= 15) badges.push('Chuyên Cần Gương Mẫu ⏰');
      if (voc >= 20) badges.push('Siêu Trí Nhớ 3D 🧠');
      if (highestScore === 10) badges.push('Điểm 10 Tuyệt Đối 🌟');
      if (testsCount >= 3) badges.push('Chăm Chỉ Luyện Đề 📚');

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

      // Học sinh được tính là đã vào học nếu có tài khoản học sinh, có điểm chuyên cần > 0, hoặc có bài nộp
      const hasEntered = Boolean(
        profile && (
          (profile.totalMeritPoints && profile.totalMeritPoints > 0) ||
          profile.lastLoginDate ||
          (profile.attendancePoints && profile.attendancePoints > 0) ||
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
