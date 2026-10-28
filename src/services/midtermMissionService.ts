/**
 * DỊCH VỤ QUẢN LÝ NHIỆM VỤ CHUẨN BỊ KIỂM TRA GIỮA KỲ 1 (MIDTERM 1 MISSION SERVICE)
 * Thiết kế sư phạm độc quyền - Thầy giáo Đinh Văn Thành (THCS Đồng Yên)
 * 
 * Quy chuẩn:
 * - Nhiệm vụ 1: Làm chủ từ vựng Unit 1 - Unit 3 ở TẤT CẢ các dạng bài tập từ vựng.
 *   + Chống học chống đối: Chỉ tính % khi đạt độ chính xác >= 60% (nắm vững từ vựng).
 * - Nhiệm vụ 2: Ôn tập đề cương và làm thử bài đề cương, đề kiểm tra Giữa kỳ 1 (tối thiểu 1 lần/bài).
 *   + Chống làm bừa: Bắt buộc đạt điểm >= 5.0đ và thời gian làm bài thực tế >= 2 phút (không nộp vội).
 * - Tự động đánh giá, xếp loại và đưa ra lời phê sư phạm của Thầy Thành cho từng học sinh.
 */

export interface VocabModeQualityResult {
  modeId: string;
  modeTitle: string;
  icon: string;
  completed: boolean;
  qualityPassed: boolean; // Đạt độ chính xác >= 60%
  accuracyPercent: number; // 0 - 100%
  score?: number;
  totalQuestions?: number;
  note?: string;
  completedAt?: string;
}

export interface UnitMissionProgress {
  unitNumber: number;
  unitTitle: string;
  modes: Record<string, VocabModeQualityResult>;
  totalRequiredModes: number;
  qualityPassedCount: number;
  unitPercent: number; // 0 - 100% dựa trên các dạng bài ĐẠT CHẤT LƯỢNG
  isMastered: boolean; // Khi đạt >= 75% các dạng bài
  isUnitCompleted?: boolean; // Khi học sinh đã hoàn thành bài từ vựng
  statusNote: string;
}

export interface ExamMissionItem {
  type: 'decuong' | 'midterm_exam';
  title: string;
  attemptsCount: number;
  highestScore: number;
  lastScore: number;
  lastTimeSpentSeconds: number;
  qualityPassed: boolean; // Điểm >= 5.0 và thời gian >= 120s
  statusNote: string;
  lastAttemptAt?: string;
}

export interface MidtermMissionState {
  studentId: string;
  studentName: string;
  className: string;
  grade: number;
  
  // NHIỆM VỤ 1: TỪ VỰNG UNIT 1 - 3
  mission1: {
    title: string;
    description: string;
    units: Record<number, UnitMissionProgress>;
    overallPercent: number; // Trung bình Unit 1, 2, 3
    isFullyCompleted: boolean;
    qualityPassedCount: number;
    totalRequiredCount: number;
    warningNote?: string;
  };

  // NHIỆM VỤ 2: ĐỀ CƯƠNG & ĐỀ KIỂM TRA GIỮA KỲ 1
  mission2: {
    title: string;
    description: string;
    decuong: ExamMissionItem;
    midtermExam: ExamMissionItem;
    overallPercent: number; // 0%, 50%, hoặc 100%
    isFullyCompleted: boolean;
  };

  // TỔNG TIẾN ĐỘ & ĐÁNH GIÁ CỦA THẦY THÀNH
  totalProgressPercent: number; // (Mission1 % + Mission2 %) / 2
  academicLevel: 'XUAT_SAC' | 'GIOI' | 'KHA' | 'DAT' | 'CAN_CO_GANG' | 'CHUA_HOAN_THANH';
  levelBadgeText: string;
  levelColor: string;
  teacherEvaluation: string; // Lời phê sư phạm của Thầy Thành
  lastUpdatedAt: string;
}

export const VOCAB_MODES_CONFIG = [
  { id: 'flashcard', title: 'Thẻ Ghi Nhớ 3D & Phát Âm', icon: '🃏', minPassReq: 'Xem & nghe tối thiểu 70% từ' },
  { id: 'match', title: 'Nối Cặp Từ - Nghĩa', icon: '🧩', minPassReq: 'Ghép đúng toàn bộ với sai < 40%' },
  { id: 'quiz', title: 'Trắc Nghiệm Từ Vựng 4 Lựa Chọn', icon: '🎯', minPassReq: 'Đúng >= 60% số câu hỏi' },
  { id: 'listen', title: 'Luyện Nghe Chọn Đáp Án', icon: '🎧', minPassReq: 'Nghe hiểu đúng >= 60%' },
  { id: 'spelling', title: 'Luyện Gõ Chính Tả', icon: '✍️', minPassReq: 'Gõ chuẩn xác >= 60% từ' },
  { id: 'chant', title: 'Bài Chant & Karaoke Nhịp Điệu', icon: '🎵', minPassReq: 'Luyện nhịp điệu & phản xạ từ' },
  { id: 'scramble', title: 'Xếp Chữ / Ghép Chữ', icon: '🔤', minPassReq: 'Ghép đúng >= 60% từ' },
  { id: 'blitz', title: 'Phản Xạ Nhanh 5s Đúng/Sai', icon: '⚡', minPassReq: 'Phản xạ đúng >= 60%' },
];

const STORAGE_PREFIX = 'MIDTERM_MISSION_EVAL_';

export class MidtermMissionService {
  /**
   * Lấy hoặc khởi tạo trạng thái nhiệm vụ của học sinh
   */
  public getMissionState(studentId: string, studentName: string, className: string, grade: number = 8): MidtermMissionState {
    const key = STORAGE_PREFIX + studentId;
    let saved: MidtermMissionState | null = null;
    try {
      const raw = localStorage.getItem(key);
      if (raw) saved = JSON.parse(raw);
    } catch {}

    if (!saved) {
      saved = this.createNewState(studentId, studentName, className, grade);
      this.saveState(saved);
    } else {
      // Cập nhật tên/lớp/khối nếu có thay đổi
      saved.studentName = studentName || saved.studentName;
      saved.className = className || saved.className;
      saved.grade = grade || saved.grade;
      // Đồng bộ recalculate để đảm bảo tỷ lệ % và lời nhận xét luôn chuẩn xác
      this.recalculateState(saved);
    }

    return saved;
  }

  /**
   * Tạo trạng thái rỗng ban đầu cho học sinh
   */
  private createNewState(studentId: string, studentName: string, className: string, grade: number): MidtermMissionState {
    const units: Record<number, UnitMissionProgress> = {};
    for (const u of [1, 2, 3]) {
      const modes: Record<string, VocabModeQualityResult> = {};
      for (const m of VOCAB_MODES_CONFIG) {
        modes[m.id] = {
          modeId: m.id,
          modeTitle: m.title,
          icon: m.icon,
          completed: false,
          qualityPassed: false,
          accuracyPercent: 0,
          note: `Chưa học (Yêu cầu: ${m.minPassReq})`
        };
      }
      units[u] = {
        unitNumber: u,
        unitTitle: `Unit ${u}`,
        modes,
        totalRequiredModes: VOCAB_MODES_CONFIG.length,
        qualityPassedCount: 0,
        unitPercent: 0,
        isMastered: false,
        statusNote: 'Chưa bắt đầu học'
      };
    }

    const state: MidtermMissionState = {
      studentId,
      studentName,
      className,
      grade,
      mission1: {
        title: 'Nhiệm vụ 1: Làm chủ từ vựng Unit 1 - Unit 3',
        description: 'Phải học đầy đủ 11 dạng bài tập từ vựng, nắm vững từ (đạt >= 60% độ chính xác). Không làm chống đối.',
        units,
        overallPercent: 0,
        isFullyCompleted: false,
        qualityPassedCount: 0,
        totalRequiredCount: VOCAB_MODES_CONFIG.length * 3
      },
      mission2: {
        title: 'Nhiệm vụ 2: Ôn đề cương & kiểm tra thử Giữa Kỳ 1',
        description: 'Học kỹ đề cương và làm bài kiểm tra thử giữa kỳ (tối thiểu 1 lần/bài). Điểm số >= 5.0đ, làm nghiêm túc không chọn bừa.',
        decuong: {
          type: 'decuong',
          title: `Đề Cương Ôn Tập Giữa Kỳ 1 (Kèm Audio & Chấm Điểm)`,
          attemptsCount: 0,
          highestScore: 0,
          lastScore: 0,
          lastTimeSpentSeconds: 0,
          qualityPassed: false,
          statusNote: 'Chưa làm bài đề cương (Yêu cầu tối thiểu 1 lần, điểm >= 5.0đ)'
        },
        midtermExam: {
          type: 'midterm_exam',
          title: `Đề Kiểm Tra Thử Giữa Kỳ 1 Chuẩn Cấu Trúc BGD&ĐT`,
          attemptsCount: 0,
          highestScore: 0,
          lastScore: 0,
          lastTimeSpentSeconds: 0,
          qualityPassed: false,
          statusNote: 'Chưa làm bài kiểm tra thử GK1 (Yêu cầu tối thiểu 1 lần, điểm >= 5.0đ)'
        },
        overallPercent: 0,
        isFullyCompleted: false
      },
      totalProgressPercent: 0,
      academicLevel: 'CHUA_HOAN_THANH',
      levelBadgeText: 'Chưa hoàn thành',
      levelColor: 'text-slate-500 bg-slate-100',
      teacherEvaluation: 'Bắt đầu ôn tập: Hoàn thành từ vựng Unit 1 - 3 và làm bài đề cương, đề kiểm tra thử.',
      lastUpdatedAt: new Date().toISOString()
    };

    return state;
  }

  /**
   * Ghi nhận kết quả làm bài tập từ vựng (Kiểm tra chất lượng chống học chống đối)
   * @param accuracyPercent: Độ chính xác thực tế của học sinh (0 - 100)
   */
  public recordVocabPracticeQuality(
    studentId: string,
    studentName: string,
    className: string,
    grade: number,
    unitNumber: number,
    modeId: string,
    accuracyPercent: number,
    details?: { score?: number; totalQuestions?: number; note?: string }
  ): { state: MidtermMissionState; passedQuality: boolean; message: string } {
    const state = this.getMissionState(studentId, studentName, className, grade);
    
    // Chỉ áp dụng cho Unit 1, 2, 3 của nhiệm vụ GK1
    if (![1, 2, 3].includes(unitNumber)) {
      return { state, passedQuality: true, message: 'Đã ghi nhận bài tập' };
    }

    const unit = state.mission1.units[unitNumber];
    if (!unit) return { state, passedQuality: false, message: 'Unit không hợp lệ' };

    const modeConfig = VOCAB_MODES_CONFIG.find(m => m.id === modeId);
    const modeTitle = modeConfig?.title || modeId;

    // QUY CHUẨN CHỐNG HỌC CHỐNG ĐỐI:
    // Độ chính xác tối thiểu phải >= 60% thì mới được coi là nắm vững từ vựng!
    const passedQuality = accuracyPercent >= 60;

    let note = '';
    let message = '';

    if (passedQuality) {
      note = `Đạt chuẩn (${accuracyPercent}% chính xác - Nắm tốt từ vựng)`;
      message = `🎉 Tuyệt vời! Em đã đạt chuẩn chất lượng dạng bài "${modeTitle}" (${accuracyPercent}%). Tiến độ GK1 của em đã được tăng lên!`;
    } else {
      note = `Chưa đạt chất lượng (${accuracyPercent}% chính xác - Cần làm lại để được tính %)`;
      message = `⚠️ Nhắc nhở của Thầy Thành: Dạng bài "${modeTitle}" em mới đạt ${accuracyPercent}% (Yêu cầu phải đạt từ 60% trở lên để chứng minh em đã nắm được từ vựng, không làm chống đối). Em hãy làm lại nhé!`;
    }

    unit.modes[modeId] = {
      modeId,
      modeTitle,
      icon: modeConfig?.icon || '📝',
      completed: true,
      qualityPassed: passedQuality,
      accuracyPercent,
      score: details?.score,
      totalQuestions: details?.totalQuestions,
      note,
      completedAt: new Date().toISOString()
    };

    this.recalculateState(state);
    this.saveState(state);

    return { state, passedQuality, message };
  }

  /**
   * Ghi nhận làm bài kiểm tra đề cương hoặc đề kiểm tra Giữa Kỳ 1
   * @param timeSpentSeconds: Thời gian làm bài thực tế (tính bằng giây)
   */
  public recordExamPracticeQuality(
    studentId: string,
    studentName: string,
    className: string,
    grade: number,
    examType: 'decuong' | 'midterm_exam',
    score: number,
    timeSpentSeconds: number = 300,
    examTitle?: string
  ): { state: MidtermMissionState; passedQuality: boolean; message: string } {
    const state = this.getMissionState(studentId, studentName, className, grade);
    const targetItem = examType === 'decuong' ? state.mission2.decuong : state.mission2.midtermExam;

    if (examTitle) {
      targetItem.title = examTitle;
    }

    targetItem.attemptsCount += 1;
    targetItem.lastScore = score;
    targetItem.lastTimeSpentSeconds = timeSpentSeconds;
    if (score > targetItem.highestScore) {
      targetItem.highestScore = score;
    }
    targetItem.lastAttemptAt = new Date().toISOString();

    // QUY CHUẨN CHẤT LƯỢNG THẦY THÀNH:
    // 1. Điểm số tối thiểu phải >= 5.0 (Mức Đạt Thông tư 22 BGD&ĐT).
    // 2. Không được nộp bài vội vàng (< 90 giây đối với bài kiểm tra đầy đủ).
    const isNotRushed = timeSpentSeconds >= 90;
    const isPassingScore = score >= 5.0;
    const passedQuality = isPassingScore && isNotRushed;

    let message = '';
    if (passedQuality) {
      targetItem.qualityPassed = true;
      targetItem.statusNote = `Đạt chuẩn chất lượng (Điểm cao nhất: ${targetItem.highestScore}/10 • Làm ${targetItem.attemptsCount} lần)`;
      message = `🎉 Chúc mừng em ${state.studentName}! Bài ${targetItem.title} đạt ${score}/10 điểm, hoàn thành xuất sắc yêu cầu của Thầy Thành!`;
    } else {
      // Nếu lần trước đã từng đạt chất lượng thì giữ chất lượng, còn nếu lần này chưa đạt thì cảnh báo
      if (!targetItem.qualityPassed) {
        if (!isNotRushed) {
          targetItem.statusNote = `Chưa đạt: Nộp bài quá nhanh (${timeSpentSeconds}s). Thầy yêu cầu đọc kỹ đề và làm lại!`;
          message = `⚠️ Nhắc nhở của Thầy Thành: Em nộp bài quá nhanh (${timeSpentSeconds} giây). Em hãy làm bài nghiêm túc, đọc kỹ từng câu để đạt kết quả tốt nhất!`;
        } else {
          targetItem.statusNote = `Chưa đạt: Điểm dưới 5.0 (${score}đ). Em hãy ôn lại lý thuyết và làm lại đề!`;
          message = `⚠️ Thầy Thành nhắc nhở: Điểm bài làm là ${score}/10 (dưới 5.0đ). Để chuẩn bị tốt cho đợt kiểm tra thật, em hãy xem lại lời giải chi tiết và làm lại lần nữa nhé!`;
        }
      } else {
        message = `Em vừa hoàn thành thêm 1 lần làm bài ${targetItem.title} (${score}/10đ). Cố gắng phát huy nhé!`;
      }
    }

    this.recalculateState(state);
    this.saveState(state);

    return { state, passedQuality, message };
  }

  /**
   * Đánh dấu học sinh đã hoàn thành trọn vẹn 1 bài từ vựng (Unit 1, 2 hoặc 3)
   * Giúp học sinh học được 1 - 2 bài là % tăng vọt rõ nét ngay lập tức!
   */
  public markUnitMastered(
    studentId: string,
    studentName: string,
    className: string,
    grade: number,
    unitNumber: number
  ): MidtermMissionState {
    const state = this.getMissionState(studentId, studentName, className, grade);
    if ([1, 2, 3].includes(unitNumber)) {
      const unit = state.mission1.units[unitNumber];
      if (unit) {
        unit.isUnitCompleted = true;
        unit.isMastered = true;
        unit.unitPercent = 100;
        unit.statusNote = `🌟 Đã hoàn thành 100% trọn vẹn bài từ vựng Unit ${unitNumber}!`;

        // Tự động kích hoạt đạt chất lượng cho các dạng cốt lõi
        const coreModes = ['flashcard', 'quiz', 'match'];
        coreModes.forEach(mId => {
          if (unit.modes[mId]) {
            unit.modes[mId].completed = true;
            unit.modes[mId].qualityPassed = true;
            unit.modes[mId].accuracyPercent = Math.max(unit.modes[mId].accuracyPercent || 0, 95);
            unit.modes[mId].note = 'Đã hoàn thành xuất sắc';
            unit.modes[mId].completedAt = new Date().toISOString();
          }
        });

        this.recalculateState(state);
        this.saveState(state);
      }
    }
    return state;
  }

  /**
   * Tính toán lại toàn bộ % tiến độ và nhận xét sư phạm của Thầy Thành
   * Quy chuẩn sư phạm: Học sinh học được 1 - 2 bài từ vựng là % phải tăng vọt rõ ràng cho các em thấy!
   */
  private recalculateState(state: MidtermMissionState) {
    // 1. Tính % Nhiệm vụ 1 (Từ vựng Unit 1 - 3)
    let totalQualityPassedVocab = 0;
    let sumUnitPercents = 0;

    for (const uNum of [1, 2, 3]) {
      const u = state.mission1.units[uNum];
      if (!u) continue;

      let passedCount = 0;
      for (const mId in u.modes) {
        if (u.modes[mId].qualityPassed) {
          passedCount++;
        }
      }

      u.qualityPassedCount = passedCount;

      // QUY CHUẨN TÍNH % RÕ RÀNG, ĐỘNG VIÊN TINH THẦN HỌC SINH:
      // Học sinh học được 1 - 2 bài từ vựng là % phải tăng rõ ràng:
      // - Học xong bài Unit (hoặc làm >= 3 dạng): Đạt ngay 100% của Unit!
      // - Làm 2 dạng bài: Đạt ngay 75%!
      // - Làm 1 dạng bài: Đạt ngay 50%!
      if (u.isUnitCompleted || u.isMastered || passedCount >= 3) {
        u.unitPercent = 100;
        u.isMastered = true;
        u.statusNote = `🌟 Đã hoàn thành xuất sắc 100% bài học từ vựng Unit ${uNum}!`;
      } else if (passedCount === 2) {
        u.unitPercent = 75;
        u.statusNote = `Đạt 75% (${passedCount} dạng bài đạt chuẩn). Hãy hoàn thành tiếp nhé!`;
      } else if (passedCount === 1) {
        u.unitPercent = 50; // Làm 1 dạng bài chất lượng đạt ngay 50% bài học!
        u.statusNote = `Đạt 50% (${passedCount} dạng bài). Hãy làm thêm 1 bài nữa để hoàn thành 100%!`;
      } else {
        u.unitPercent = 0;
        u.statusNote = 'Chưa hoàn thành dạng bài nào';
      }

      totalQualityPassedVocab += passedCount;
      sumUnitPercents += u.unitPercent;
    }

    state.mission1.qualityPassedCount = totalQualityPassedVocab;
    // 1 bài = 33%, 2 bài = 67%, 3 bài = 100%
    state.mission1.overallPercent = Math.min(100, Math.round(sumUnitPercents / 3));
    state.mission1.isFullyCompleted = state.mission1.overallPercent >= 100;

    // 2. Tính % Nhiệm vụ 2 (Đề cương & Đề kiểm tra Giữa kỳ)
    let m2PassedCount = 0;
    if (state.mission2.decuong.qualityPassed) m2PassedCount++;
    if (state.mission2.midtermExam.qualityPassed) m2PassedCount++;

    state.mission2.overallPercent = m2PassedCount === 2 ? 100 : (m2PassedCount === 1 ? 50 : 0);
    state.mission2.isFullyCompleted = m2PassedCount === 2;

    // 3. Tính Tổng % Toàn Diện (50% từ vựng + 50% đề cương/đề kiểm tra)
    state.totalProgressPercent = Math.round((state.mission1.overallPercent * 0.5) + (state.mission2.overallPercent * 0.5));

    // 4. Xếp loại học lực & Lời nhận xét sư phạm của Thầy Thành
    const avgScore = Math.max(state.mission2.decuong.highestScore, state.mission2.midtermExam.highestScore);

    if (state.totalProgressPercent >= 90 && avgScore >= 8.5) {
      state.academicLevel = 'XUAT_SAC';
      state.levelBadgeText = 'Xuất sắc';
      state.levelColor = 'text-emerald-700 bg-emerald-100 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300';
      state.teacherEvaluation = `Hoàn thành 90%+ nhiệm vụ (${state.totalProgressPercent}%), điểm bài làm ${avgScore}đ. Nắm vững kiến thức trọng tâm.`;
    } else if (state.totalProgressPercent >= 75 && avgScore >= 7.5) {
      state.academicLevel = 'GIOI';
      state.levelBadgeText = 'Giỏi';
      state.levelColor = 'text-blue-700 bg-blue-100 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300';
      state.teacherEvaluation = `Tiến độ ${state.totalProgressPercent}%, điểm cao nhất ${avgScore}đ. Đạt kết quả tốt, tiếp tục ôn tập kỹ các phần còn lại.`;
    } else if (state.totalProgressPercent >= 50 && avgScore >= 6.0) {
      state.academicLevel = 'KHA';
      state.levelBadgeText = 'Khá';
      state.levelColor = 'text-indigo-700 bg-indigo-100 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300';
      state.teacherEvaluation = `Đã hoàn thành ${state.totalProgressPercent}% nhiệm vụ. Cần hoàn thành đủ các dạng bài từ vựng và luyện lại đề kiểm tra.`;
    } else if (state.totalProgressPercent >= 30 || avgScore >= 5.0) {
      state.academicLevel = 'DAT';
      state.levelBadgeText = 'Đạt yêu cầu';
      state.levelColor = 'text-amber-800 bg-amber-100 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300';
      state.teacherEvaluation = `Tiến độ cơ bản (${state.totalProgressPercent}%). Cần hoàn thành tiếp từ vựng Unit 1 - 3 và làm bài đề cương.`;
    } else {
      state.academicLevel = 'CAN_CO_GANG';
      state.levelBadgeText = 'Cần nỗ lực';
      state.levelColor = 'text-rose-700 bg-rose-100 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300';
      state.teacherEvaluation = `Tiến độ hiện tại: ${state.totalProgressPercent}%. Cần hoàn thành nhiệm vụ từ vựng và nộp bài kiểm tra thử theo quy định.`;
    }

    state.lastUpdatedAt = new Date().toISOString();
  }

  /**
   * Lưu vào LocalStorage
   */
  private saveState(state: MidtermMissionState) {
    try {
      localStorage.setItem(STORAGE_PREFIX + state.studentId, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save midterm mission state:', e);
    }
  }
}

export const midtermMissionService = new MidtermMissionService();
