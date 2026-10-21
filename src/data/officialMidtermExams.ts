// DỮ LIỆU ĐỀ KIỂM TRA CHÍNH THỨC TOÀN DIỆN CẢ NĂM HỌC (320 MÃ ĐỀ THI ĐỘC LẬP)
// Chuẩn Công văn 7991/BGDĐT & Chương trình GDPT 2018 Bộ SGK Global Success
// Tác giả bản quyền: Thầy giáo Đinh Văn Thành (Hotline/Zalo: 0915.213717) - Trường THCS Đồng Yên
// Gồm:
// - Giữa HK1 (80 Mã đề: 601-620, 701-720, 801-820, 901-920)
// - Cuối HK1 (80 Mã đề: 601-620, 701-720, 801-820, 901-920)
// - Giữa HK2 (80 Mã đề: 601-620, 701-720, 801-820, 901-920)
// - Cuối HK2 (80 Mã đề: 601-620, 701-720, 801-820, 901-920)

export interface OfficialExamQuestion {
  part: 'A' | 'B' | 'C' | 'D' | 'E';
  partTitle: string;
  partInstruction: string;
  qNumber: number;
  id: string;
  type: 'choice' | 'fill' | 'rewrite' | 'essay';
  text: string;
  options: string[];
  correct: string;
  correctLetter: string;
  explanation: string;
  passage?: string;
}

export interface OfficialMidtermExam {
  grade: number;
  examType: string;
  typeTitle: string;
  examCode: string;
  durationMinutes: number;
  schoolName: string;
  teacherName: string;
  audioUrl: string;
  audioScript: string;
  clozeText?: string;
  readingText?: string;
  passageText: string;
  writingRubric: string;
  sampleWritingText: string;
  questions: OfficialExamQuestion[];
}

import { GK1_EXAMS_DATA } from './officialExams_gk1';
import { CK1_EXAMS_DATA } from './officialExams_ck1';
import { GK2_EXAMS_DATA } from './officialExams_gk2';
import { CK2_EXAMS_DATA } from './officialExams_ck2';

export const OFFICIAL_ALL_TERMS_EXAMS_DATA: Record<string, Record<string, Record<string, OfficialMidtermExam>>> = {
  'giua-ky-1': GK1_EXAMS_DATA,
  'cuoi-ky-1': CK1_EXAMS_DATA,
  'giua-ky-2': GK2_EXAMS_DATA,
  'cuoi-ky-2': CK2_EXAMS_DATA
};

// Tương thích ngược với các hàm gọi cũ
export const OFFICIAL_MIDTERM_EXAMS_DATA: any = GK1_EXAMS_DATA;
