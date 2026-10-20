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

const STORAGE_KEYS = {
  CLASSES: 'gvai_gradebook_classes_v3_dongyen',
  STUDENTS: 'gvai_gradebook_students_v3_dongyen',
  SUBMISSIONS: 'gvai_gradebook_submissions_v3_dongyen',
  ACTIVE_STUDENT: 'gvai_gradebook_active_student_v3_dongyen'
};

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
  }

  private initData() {
    try {
      const clsRaw = localStorage.getItem(STORAGE_KEYS.CLASSES);
      this.classes = clsRaw ? JSON.parse(clsRaw) : DEFAULT_CLASSES;

      const stuRaw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      this.students = stuRaw ? JSON.parse(stuRaw) : DEFAULT_STUDENTS;

      const subRaw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      this.submissions = subRaw ? JSON.parse(subRaw) : DEFAULT_SUBMISSIONS;

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
    return newStudent;
  }

  public updateStudent(id: string, data: Partial<StudentProfile>): boolean {
    const idx = this.students.findIndex(s => s.id === id);
    if (idx === -1) return false;
    this.students[idx] = { ...this.students[idx], ...data };
    this.saveStudents();
    return true;
  }

  public deleteStudent(id: string): boolean {
    this.students = this.students.filter(s => s.id !== id);
    this.submissions = this.submissions.filter(sub => sub.studentId !== id);
    this.saveStudents();
    this.saveSubmissions();
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
      else rankText = 'Cần Cố Gắng (< 5.0)';

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
