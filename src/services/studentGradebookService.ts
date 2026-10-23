// =========================================================================
// HỆ THỐNG QUẢN LÝ HỌC SINH THEO LỚP & SỔ ĐIỂM TRỰC TUYẾN TOÀN DIỆN
// TÁC GIẢ BẢN QUYỀN: THẦY GIÁO ĐINH VĂN THÀNH - ĐIỆN THOẠI / ZALO: 0915.213717
// ĐƠN VỊ: TRƯỜNG THCS ĐỒNG YÊN
// =========================================================================

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
  VAULT_SUBMISSIONS: 'gvai_submissions_vault_permanent'
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

  constructor() {
    this.initData();
    this.syncFromCloud().catch(() => {});
  }

  private initData() {
    try {
      const clsRaw = localStorage.getItem(STORAGE_KEYS.CLASSES);
      this.classes = clsRaw ? JSON.parse(clsRaw) : DEFAULT_CLASSES;

      const stuRaw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      this.students = stuRaw ? JSON.parse(stuRaw) : DEFAULT_STUDENTS;

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
        badges
      };
    });

    items.sort((a, b) => {
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
        badges
      };
    });

    // Sắp xếp theo: Điểm trung bình giảm dần -> Điểm cao nhất giảm dần -> Số bài làm giảm dần
    items.sort((a, b) => {
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
      if (raw) return JSON.parse(raw);
    } catch {}
    // Mặc định chọn bạn đầu tiên của 7A1 để trải nghiệm mượt mà
    return this.students.find(s => s.classId === 'cls-7a1') || this.students[0] || null;
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
}

export const studentGradebookService = new StudentGradebookService();
