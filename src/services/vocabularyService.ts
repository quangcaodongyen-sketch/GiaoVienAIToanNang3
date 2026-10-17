// ============================================================================
// DỊCH VỤ DỮ LIỆU TỪ VỰNG GLOBAL SUCCESS TOÀN DIỆN (LỚP 6 - 12)
// Tác giả: Thầy giáo Đinh Văn Thành
// Cung cấp đầy đủ 1,328 từ vựng bám sát 100% từng Unit của 7 khối lớp
// ============================================================================

import rawVocabData from '../data/vocabularyData.json';

export interface VocabItem {
  id: string;
  grade: number;
  unit: string;
  unitNumber: number;
  unitTitle: string;
  word: string;
  phonetic: string;
  type: string;
  meaning: string;
  example: string;
  exampleMeaning: string;
}

export interface UnitInfo {
  unitNumber: number;
  title: string;
  wordCount: number;
}

class VocabularyService {
  private vocabItems: VocabItem[] = [];
  private unitsByGrade: Record<number, UnitInfo[]> = {};
  private isLoaded = false;

  constructor() {
    this.initData();
  }

  private initData() {
    if (this.isLoaded) return;

    const items: VocabItem[] = [];
    const unitsMap: Record<number, UnitInfo[]> = {};

    try {
      const data = rawVocabData as Record<string, any[]>;

      for (const [gradeStr, unitsList] of Object.entries(data)) {
        const grade = parseInt(gradeStr, 10);
        if (isNaN(grade) || !Array.isArray(unitsList)) continue;

        unitsMap[grade] = [];

        unitsList.forEach((u: any) => {
          const uNum = typeof u.unit === 'number' ? u.unit : parseInt(u.unit, 10) || 1;
          const uTitle = u.title || `Unit ${uNum}`;
          const words = Array.isArray(u.words) ? u.words : [];

          unitsMap[grade].push({
            unitNumber: uNum,
            title: uTitle,
            wordCount: words.length
          });

          words.forEach((w: any, idx: number) => {
            const rawWord = w.word || '';
            const ipa = w.ipa || '';
            const pos = w.pos || 'n';
            const meaning = w.meaning || '';
            const example = w.example || `Example sentence with '${rawWord}'.`;
            const exampleVi = w.example_vi || `Ví dụ minh họa cho từ '${rawWord}'.`;

            items.push({
              id: w.id || `g${grade}-u${uNum}-${idx + 1}`,
              grade,
              unit: `Unit ${uNum}: ${uTitle}`,
              unitNumber: uNum,
              unitTitle: uTitle,
              word: rawWord,
              phonetic: ipa,
              type: pos,
              meaning,
              example,
              exampleMeaning: exampleVi
            });
          });
        });

        // Sắp xếp các Unit theo thứ tự tăng dần
        unitsMap[grade].sort((a, b) => a.unitNumber - b.unitNumber);
      }

      this.vocabItems = items;
      this.unitsByGrade = unitsMap;
      this.isLoaded = true;
    } catch (e) {
      console.error('Lỗi phân tích cú pháp từ vựng:', e);
    }
  }

  // Lấy toàn bộ danh sách khối lớp có sẵn
  public getAvailableGrades(): number[] {
    return [6, 7, 8, 9, 10, 11, 12];
  }

  // Lấy danh sách Unit theo khối lớp
  public getUnitsByGrade(grade: number): UnitInfo[] {
    return this.unitsByGrade[grade] || [];
  }

  // Lấy toàn bộ từ vựng theo khối lớp và Unit (nếu unitNumber = 0 thì lấy tất cả unit của lớp)
  public getVocabulary(grade: number, unitNumber: number = 0, search: string = ''): VocabItem[] {
    const cleanSearch = search.trim().toLowerCase();

    return this.vocabItems.filter(item => {
      const matchGrade = grade === 0 || item.grade === grade;
      const matchUnit = unitNumber === 0 || item.unitNumber === unitNumber;
      const matchSearch = !cleanSearch ||
        item.word.toLowerCase().includes(cleanSearch) ||
        item.meaning.toLowerCase().includes(cleanSearch) ||
        item.unit.toLowerCase().includes(cleanSearch);

      return matchGrade && matchUnit && matchSearch;
    });
  }

  // Tổng số từ vựng toàn hệ thống
  public getTotalCount(): number {
    return this.vocabItems.length;
  }
}

export const vocabularyService = new VocabularyService();
export default vocabularyService;
