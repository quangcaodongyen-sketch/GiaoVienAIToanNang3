// DỮ LIỆU ĐỀ KIỂM TRA THỬ MINH HỌA & LUYỆN TẬP TOÀN DIỆN CẢ NĂM HỌC (320 MÃ ĐỀ KIỂM TRA ĐỘC LẬP - TUYỆT ĐỐI KHÔNG PHẢI ĐỀ KIỂM TRA CHÍNH THỨC CỦA NHÀ TRƯỜNG)
// Chuẩn Công văn 7991/BGDĐT & Chương trình GDPT 2018 Bộ SGK Global Success
// Tác giả bản quyền phần mềm: Thầy giáo Đinh Văn Thành (Hotline/Zalo: 0915.213717) - Trường THCS Đồng Yên
// Gồm:
// - Giữa HK1 (80 Mã đề: 601-620, 701-720, 801-820, 901-920)
// - Cuối HK1 (80 Mã đề: 601-620, 701-720, 801-820, 901-920)
// - Giữa HK2 (80 Mã đề: 601-620, 701-720, 801-820, 901-920)
// - Cuối HK2 (80 Mã đề: 601-620, 701-720, 801-820, 901-920)
// Kiến trúc nạp dữ liệu: Lazy Load qua JSON tĩnh tối ưu bộ nhớ, xây dựng tức thì và chống tràn RAM khi Build

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
  audioUrlPart1?: string;
  audioUrlPart2?: string;
  audioScript: string;
  audioScriptPart1?: string;
  audioScriptPart2?: string;
  clozeText?: string;
  readingText?: string;
  passageText: string;
  writingRubric: string;
  sampleWritingText: string;
  questions: OfficialExamQuestion[];
}

export type TermExamsData = Record<string, Record<string, OfficialMidtermExam>>;

// Cache in-memory sau khi nạp JSON
const termCache: Record<string, TermExamsData> = {};

export async function loadTermExams(term: string): Promise<TermExamsData> {
  if (termCache[term] && Object.keys(termCache[term]).length > 0) {
    return termCache[term];
  }

  const map: Record<string, string> = {
    'giua-ky-1': 'gk1',
    'cuoi-ky-1': 'ck1',
    'giua-ky-2': 'gk2',
    'cuoi-ky-2': 'ck2'
  };

  const key = map[term] || 'gk1';
  try {
    const res = await fetch(`/data/officialExams_${key}.json`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data: TermExamsData = await res.json();
    termCache[term] = data;
    return data;
  } catch (error) {
    console.error("Failed to load term exams for " + term, error);
    return {};
  }
}

// Đối tượng tương thích ngược
export const OFFICIAL_ALL_TERMS_EXAMS_DATA: Record<string, TermExamsData> = termCache;
export const OFFICIAL_MIDTERM_EXAMS_DATA: any = {};
