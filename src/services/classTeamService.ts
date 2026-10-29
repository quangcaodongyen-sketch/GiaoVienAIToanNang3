/**
 * DỊCH VỤ PHÂN CHIA 4 TỔ THI ĐUA CÂN BẰNG HỌC ĐƯỜNG (THẦY ĐINH VĂN THÀNH)
 * =========================================================================
 * Quy chuẩn sư phạm:
 * 1. Mỗi lớp chia ngẫu nhiên làm 4 tổ.
 * 2. Cân bằng đều Nam / Nữ giữa 4 tổ.
 * 3. Cân bằng đều số học sinh ĐÃ THAM GIA và CHƯA THAM GIA giữa 4 tổ.
 * 4. Bầu Tổ Trưởng (TT - Team Leader) và Tổ Phó (TP - Vice Leader) từ những em có thành tích cao nhất.
 * 5. Phân công rõ trách nhiệm nhắc nhở học tập, tạo phong trào thi đua trong lớp và cùng khối.
 */

import officialRosterData from '../data/officialStudentRoster.json';
import { studentGradebookService, StudentProfile, OfficialStudentRosterItem } from './studentGradebookService';

export type TeamRole = 'leader' | 'vice_leader' | 'member';

export interface ClassTeamMember {
  studentCode: string;
  name: string;
  gender: 'Nam' | 'Nữ';
  role: TeamRole;
  roleTitle: string;          // 'Tổ Trưởng (Team Leader)' | 'Tổ Phó (Vice Leader)' | 'Thành Viên'
  roleBadge: string;          // '👑 TT' | '⭐ TP' | '👤 TV'
  hasParticipated: boolean;   // Đã vào học / có điểm thi đua
  points: number;             // Điểm thi đua cá nhân đóng góp vào tổ
  vocabCount: number;         // Số bài từ vựng đã học
  dutyDescription: string;    // Nhiệm vụ cụ thể
}

export interface ClassTeam {
  id: string;                 // 'team_1', 'team_2', 'team_3', 'team_4'
  teamNumber: number;         // 1, 2, 3, 4
  name: string;               // 'Tổ 1 (Team Pioneers)'
  englishName: string;        // 'Team Pioneers'
  slogan: string;             // Slogan hành động của tổ
  colorTheme: 'blue' | 'emerald' | 'amber' | 'purple';
  className: string;          // '8A1'
  grade: number;              // 8
  leader?: ClassTeamMember;   // Tổ trưởng (TT)
  viceLeader?: ClassTeamMember; // Tổ phó (TP)
  members: ClassTeamMember[]; // Toàn bộ thành viên trong tổ
  totalPoints: number;        // Tổng điểm của tổ
  avgPoints: number;          // Điểm trung bình mỗi thành viên
  participatedCount: number;  // Số em đã tham gia
  maleCount: number;          // Số nam
  femaleCount: number;        // Số nữ
  totalCount: number;         // Tổng số thành viên
  participationRate: number;  // Tỷ lệ % tham gia (VD: 85%)
  rankInClass: number;        // Xếp hạng trong lớp (1, 2, 3, 4)
}

const STORAGE_KEY = 'gvai_class_teams_v1';

// Danh sách tên bộ môn Tiếng Anh và slogan ý nghĩa sư phạm cho 4 tổ
const TEAM_METADATA: Record<number, { englishName: string; slogan: string; colorTheme: 'blue' | 'emerald' | 'amber' | 'purple' }> = {
  1: {
    englishName: 'Team Pioneers',
    slogan: '🚀 Tiên phong dẫn đầu • Chăm chỉ mỗi ngày • Bứt phá Bảng Vàng',
    colorTheme: 'blue'
  },
  2: {
    englishName: 'Team Champions',
    slogan: '🏆 Đoàn kết tự tin • Làm chủ từ vựng • Vươn tới đỉnh cao',
    colorTheme: 'emerald'
  },
  3: {
    englishName: 'Team Stars',
    slogan: '⭐ Ngôi sao sáng tạo • Kỷ luật kiên trì • Giúp nhau cùng tiến',
    colorTheme: 'amber'
  },
  4: {
    englishName: 'Team Victors',
    slogan: '⚡ Chiến binh vượt khó • Chinh phục điểm 10 • Quyết tâm chiến thắng',
    colorTheme: 'purple'
  }
};

/**
 * Hàm suy đoán giới tính tiếng Việt chuẩn xác theo tên đệm và tên chính
 */
export function inferVietnameseGender(fullName: string): 'Nam' | 'Nữ' {
  if (!fullName) return 'Nam';
  const clean = fullName.trim().toLowerCase();
  const words = clean.split(/\s+/);
  if (words.length === 0) return 'Nam';

  // 1. Dấu hiệu tên đệm chắc chắn là Nữ
  if (words.includes('thị') || words.includes('thi')) {
    return 'Nữ';
  }
  // 2. Dấu hiệu tên đệm chắc chắn là Nam
  if (words.includes('văn') || words.includes('van')) {
    return 'Nam';
  }

  const firstName = words[words.length - 1];
  const middleName = words.length > 1 ? words[words.length - 2] : '';

  // Tên con gái phổ biến
  const femaleNames = new Set([
    'hương', 'huong', 'hoa', 'hồng', 'hong', 'lan', 'mai', 'ngọc', 'ngoc', 'linh', 
    'trang', 'hà', 'ha', 'phương', 'phuong', 'thảo', 'thao', 'huyền', 'huyen', 'nhung',
    'oanh', 'thủy', 'thuy', 'quỳnh', 'quynh', 'yến', 'yen', 'ly', 'chi', 'hằng', 'hang',
    'diệp', 'diep', 'thu', 'tuyết', 'tuyet', 'nga', 'hạnh', 'hanh', 'liên', 'lien',
    'nhi', 'thùy', 'tram', 'trâm', 'vy', 'bích', 'bich', 'vân', 'van', 'dịu', 'diu', 
    'quyên', 'quyen', 'thơ', 'tho', 'loan', 'ngân', 'ngan', 'cúc', 'cuc', 'tâm', 'tam', 
    'hiền', 'hien', 'dung', 'mơ', 'mo', 'duyên', 'duyen', 'kim'
  ]);

  if (femaleNames.has(firstName)) {
    // Trường hợp đặc biệt: tên "Anh" nhưng đệm Nam
    if (firstName === 'anh' && ['đức', 'hải', 'tuấn', 'văn', 'hoàng', 'quốc', 'minh', 'hùng', 'long'].includes(middleName)) {
      return 'Nam';
    }
    return 'Nữ';
  }

  return 'Nam';
}

/**
 * Xáo trộn ngẫu nhiên một mảng (Fisher-Yates Shuffle)
 */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

class ClassTeamService {
  private cache: Record<string, ClassTeam[]> = {};

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.cache = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Lỗi đọc dữ liệu tổ từ localStorage:', e);
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
    } catch (e) {
      console.warn('Lỗi lưu dữ liệu tổ vào localStorage:', e);
    }
  }

  /**
   * Lấy danh sách 4 tổ của một lớp (Tự động tạo cân bằng nếu chưa có)
   */
  public getClassTeams(className: string, forceReshuffle: boolean = false): ClassTeam[] {
    const cleanCls = className.trim().toUpperCase();
    if (!cleanCls) return [];

    if (!forceReshuffle && this.cache[cleanCls] && this.cache[cleanCls].length === 4) {
      // Cập nhật lại điểm số thời gian thực của các thành viên từ Sổ điểm
      return this.refreshTeamScores(cleanCls, this.cache[cleanCls]);
    }

    // Nếu chưa có hoặc yêu cầu chia lại ngẫu nhiên cân bằng:
    const newTeams = this.generateBalancedTeams(cleanCls);
    this.cache[cleanCls] = newTeams;
    this.saveToStorage();
    return newTeams;
  }

  /**
   * Cập nhật điểm số thời gian thực cho 4 tổ dựa vào dữ liệu sổ điểm mới nhất
   */
  private refreshTeamScores(className: string, teams: ClassTeam[]): ClassTeam[] {
    const activeProfiles = studentGradebookService.getStudents(className);
    const profileMap = new Map<string, StudentProfile>();
    activeProfiles.forEach(p => {
      profileMap.set(p.name.trim().toLowerCase(), p);
      if (p.studentCode) profileMap.set(p.studentCode, p);
    });

    const updatedTeams = teams.map(team => {
      const updatedMembers = team.members.map(m => {
        const found = profileMap.get(m.name.trim().toLowerCase()) || profileMap.get(m.studentCode);
        const pts = found?.totalMeritPoints || m.points || 0;
        const vCnt = (found as any)?.vocabLearnedCount || m.vocabCount || 0;
        const hasPart = pts > 0 || (found?.attendancePoints || 0) > 0;

        return {
          ...m,
          points: pts,
          vocabCount: vCnt,
          hasParticipated: hasPart
        };
      });

      // Tự động bầu lại Tổ Trưởng và Tổ Phó nếu có em bứt phá thành tích vượt bậc
      const sortedByScore = [...updatedMembers].sort((a, b) => b.points - a.points);
      const top1 = sortedByScore[0];
      const top2 = sortedByScore[1];

      // Gán lại vai trò theo thành tích
      const finalMembers = updatedMembers.map(m => {
        if (top1 && m.studentCode === top1.studentCode && top1.points > 0) {
          return {
            ...m,
            role: 'leader' as TeamRole,
            roleTitle: 'Tổ Trưởng (Team Leader)',
            roleBadge: '👑 TT',
            dutyDescription: '👑 Nhiệm vụ: Theo dõi tiến độ học tập của cả tổ, đôn đốc các bạn vào học mỗi ngày, hỗ trợ các bạn chưa tham gia để tổ bứt phá Bảng Vàng!'
          };
        } else if (top2 && m.studentCode === top2.studentCode && top2.points > 0) {
          return {
            ...m,
            role: 'vice_leader' as TeamRole,
            roleTitle: 'Tổ Phó (Vice Leader)',
            roleBadge: '⭐ TP',
            dutyDescription: '⭐ Nhiệm vụ: Hỗ trợ Tổ trưởng theo dõi chuyên cần, hướng dẫn các bạn học từ vựng và làm bài kiểm tra thử GK1, nhắc nhở giữ chuỗi ngày học pháo hoa liên tục!'
          };
        } else {
          return {
            ...m,
            role: (m.role === 'leader' || m.role === 'vice_leader' ? 'member' : m.role) as TeamRole,
            roleTitle: 'Thành Viên',
            roleBadge: '👤 TV',
            dutyDescription: '👤 Nhiệm vụ: Tự giác học từ vựng và làm bài tập đều đặn mỗi ngày. Mỗi điểm số cá nhân kiếm được sẽ đóng góp trực tiếp vào Tổng Điểm của Tổ!'
          };
        }
      });

      const leader = finalMembers.find(m => m.role === 'leader') || finalMembers[0];
      const viceLeader = finalMembers.find(m => m.role === 'vice_leader') || finalMembers[1];

      const totalPts = finalMembers.reduce((sum, m) => sum + m.points, 0);
      const participated = finalMembers.filter(m => m.hasParticipated).length;
      const maleC = finalMembers.filter(m => m.gender === 'Nam').length;
      const femaleC = finalMembers.filter(m => m.gender === 'Nữ').length;
      const totalC = finalMembers.length;
      const avg = totalC > 0 ? Math.round((totalPts / totalC) * 10) / 10 : 0;
      const partRate = totalC > 0 ? Math.round((participated / totalC) * 100) : 0;

      return {
        ...team,
        members: finalMembers,
        leader,
        viceLeader,
        totalPoints: totalPts,
        avgPoints: avg,
        participatedCount: participated,
        maleCount: maleC,
        femaleCount: femaleC,
        totalCount: totalC,
        participationRate: partRate
      };
    });

    // Xếp hạng 4 tổ theo Tổng điểm (hoặc Điểm trung bình nếu bằng nhau)
    const sorted = [...updatedTeams].sort((a, b) => b.totalPoints - a.totalPoints || b.avgPoints - a.avgPoints);
    sorted.forEach((t, i) => {
      t.rankInClass = i + 1;
    });

    return updatedTeams;
  }

  /**
   * THUẬT TOÁN PHÂN CHIA 4 TỔ CÂN BẰNG THÔNG MINH (THEO CHỈ ĐẠO CỦA THẦY ĐINH THÀNH):
   * 1. Lấy danh sách chính thức 35 - 42 học sinh của lớp.
   * 2. Phân loại thành 4 giỏ:
   *    - Giỏ 1: Nam đã tham gia (sắp xếp điểm giảm dần)
   *    - Giỏ 2: Nữ đã tham gia (sắp xếp điểm giảm dần)
   *    - Giỏ 3: Nam chưa tham gia (xáo trộn ngẫu nhiên)
   *    - Giỏ 4: Nữ chưa tham gia (xáo trộn ngẫu nhiên)
   * 3. Phân bổ tuần hoàn zic-zắc (serpentine) vào 4 tổ để san đều hạt giống và số lượng.
   * 4. Bầu Tổ Trưởng và Tổ Phó cho từng tổ từ những em có thành tích cao nhất.
   */
  public generateBalancedTeams(className: string): ClassTeam[] {
    const cleanCls = className.trim().toUpperCase();
    const rawRoster = (officialRosterData as Record<string, OfficialStudentRosterItem[]>)[cleanCls] || [];

    if (rawRoster.length === 0) {
      return [];
    }

    // Lấy điểm thực tế từ hệ thống
    const activeProfiles = studentGradebookService.getStudents(cleanCls);
    const profileMap = new Map<string, StudentProfile>();
    activeProfiles.forEach(p => {
      profileMap.set(p.name.trim().toLowerCase(), p);
      if (p.studentCode) profileMap.set(p.studentCode, p);
    });

    // Chuẩn bị danh sách thành viên với đầy đủ thông tin
    const candidateList: ClassTeamMember[] = rawRoster.map((item, idx) => {
      const found = profileMap.get(item.name.trim().toLowerCase()) || profileMap.get(item.studentCode);
      const gender = found?.gender || inferVietnameseGender(item.name);
      const pts = found?.totalMeritPoints || 0;
      const vCnt = (found as any)?.vocabLearnedCount || 0;
      const hasPart = pts > 0 || (found?.attendancePoints || 0) > 0;

      return {
        studentCode: item.studentCode || `ST_${cleanCls}_${idx + 1}`,
        name: item.name,
        gender,
        role: 'member',
        roleTitle: 'Thành Viên',
        roleBadge: '👤 TV',
        hasParticipated: hasPart,
        points: pts,
        vocabCount: vCnt,
        dutyDescription: '👤 Nhiệm vụ: Tự giác học từ vựng và làm bài tập đều đặn mỗi ngày. Mỗi điểm số cá nhân kiếm được sẽ đóng góp trực tiếp vào Tổng Điểm của Tổ!'
      };
    });

    // 4 Giỏ phân loại
    const femalePart = candidateList.filter(c => c.gender === 'Nữ' && c.hasParticipated).sort((a, b) => b.points - a.points);
    const malePart = candidateList.filter(c => c.gender === 'Nam' && c.hasParticipated).sort((a, b) => b.points - a.points);
    const femaleNotPart = shuffleArray(candidateList.filter(c => c.gender === 'Nữ' && !c.hasParticipated));
    const maleNotPart = shuffleArray(candidateList.filter(c => c.gender === 'Nam' && !c.hasParticipated));

    // Khởi tạo 4 tổ rỗng
    const teamBuckets: ClassTeamMember[][] = [[], [], [], []];

    // Thuật toán Serpentine (Zig-Zag) phân bổ đều các bạn có thành tích
    const distributeSerpentine = (list: ClassTeamMember[]) => {
      let forward = true;
      let teamIdx = 0;
      list.forEach(item => {
        teamBuckets[teamIdx].push(item);
        if (forward) {
          if (teamIdx === 3) {
            forward = false;
          } else {
            teamIdx++;
          }
        } else {
          if (teamIdx === 0) {
            forward = true;
          } else {
            teamIdx--;
          }
        }
      });
    };

    // Phân bổ các bạn đã tham gia
    distributeSerpentine(femalePart);
    distributeSerpentine(malePart);

    // Phân bổ đều các bạn nữ chưa tham gia (để cân bằng số nữ của 4 tổ)
    femaleNotPart.forEach(item => {
      // Tìm tổ đang có ít Nữ nhất để nhét vào
      let minFemaleTeam = 0;
      let minFemaleCount = 999;
      for (let i = 0; i < 4; i++) {
        const fCount = teamBuckets[i].filter(m => m.gender === 'Nữ').length;
        if (fCount < minFemaleCount) {
          minFemaleCount = fCount;
          minFemaleTeam = i;
        }
      }
      teamBuckets[minFemaleTeam].push(item);
    });

    // Phân bổ đều các bạn nam chưa tham gia (để cân bằng tổng quân số giữa 4 tổ)
    maleNotPart.forEach(item => {
      let minTeam = 0;
      let minTotalCount = 999;
      for (let i = 0; i < 4; i++) {
        const total = teamBuckets[i].length;
        if (total < minTotalCount) {
          minTotalCount = total;
          minTeam = i;
        }
      }
      teamBuckets[minTeam].push(item);
    });

    const gradeNumber = parseInt(cleanCls.replace(/\D/g, ''), 10) || 8;

    // Xây dựng 4 đối tượng ClassTeam
    const resultTeams: ClassTeam[] = teamBuckets.map((rawMembers, idx) => {
      const teamNum = idx + 1;
      const meta = TEAM_METADATA[teamNum] || TEAM_METADATA[1];

      // Bầu Tổ Trưởng và Tổ Phó cho tổ này từ những em có thành tích cao nhất
      const sortedByPoints = [...rawMembers].sort((a, b) => b.points - a.points);
      const top1 = sortedByPoints[0];
      const top2 = sortedByPoints[1];

      const assignedMembers = rawMembers.map(m => {
        if (top1 && m.studentCode === top1.studentCode) {
          return {
            ...m,
            role: 'leader' as TeamRole,
            roleTitle: 'Tổ Trưởng (Team Leader)',
            roleBadge: '👑 TT',
            dutyDescription: '👑 Nhiệm vụ: Theo dõi tiến độ học tập của cả tổ, đôn đốc các bạn vào học mỗi ngày, hỗ trợ các bạn chưa tham gia để tổ bứt phá Bảng Vàng!'
          };
        } else if (top2 && m.studentCode === top2.studentCode) {
          return {
            ...m,
            role: 'vice_leader' as TeamRole,
            roleTitle: 'Tổ Phó (Vice Leader)',
            roleBadge: '⭐ TP',
            dutyDescription: '⭐ Nhiệm vụ: Hỗ trợ Tổ trưởng theo dõi chuyên cần, hướng dẫn các bạn học từ vựng và làm bài kiểm tra thử GK1, nhắc nhở giữ chuỗi ngày học pháo hoa liên tục!'
          };
        } else {
          return {
            ...m,
            role: 'member' as TeamRole,
            roleTitle: 'Thành Viên',
            roleBadge: '👤 TV',
            dutyDescription: '👤 Nhiệm vụ: Tự giác học từ vựng và làm bài tập đều đặn mỗi ngày. Mỗi điểm số cá nhân kiếm được sẽ đóng góp trực tiếp vào Tổng Điểm của Tổ!'
          };
        }
      });

      const leader = assignedMembers.find(m => m.role === 'leader') || assignedMembers[0];
      const viceLeader = assignedMembers.find(m => m.role === 'vice_leader') || assignedMembers[1];

      const totalPts = assignedMembers.reduce((sum, m) => sum + m.points, 0);
      const participated = assignedMembers.filter(m => m.hasParticipated).length;
      const maleC = assignedMembers.filter(m => m.gender === 'Nam').length;
      const femaleC = assignedMembers.filter(m => m.gender === 'Nữ').length;
      const totalC = assignedMembers.length;
      const avg = totalC > 0 ? Math.round((totalPts / totalC) * 10) / 10 : 0;
      const partRate = totalC > 0 ? Math.round((participated / totalC) * 100) : 0;

      return {
        id: `team_${cleanCls}_${teamNum}`,
        teamNumber: teamNum,
        name: `Tổ ${teamNum} (${meta.englishName})`,
        englishName: meta.englishName,
        slogan: meta.slogan,
        colorTheme: meta.colorTheme,
        className: cleanCls,
        grade: gradeNumber,
        leader,
        viceLeader,
        members: assignedMembers,
        totalPoints: totalPts,
        avgPoints: avg,
        participatedCount: participated,
        maleCount: maleC,
        femaleCount: femaleC,
        totalCount: totalC,
        participationRate: partRate,
        rankInClass: 1
      };
    });

    // Xếp hạng trong lớp
    const ranked = [...resultTeams].sort((a, b) => b.totalPoints - a.totalPoints || b.avgPoints - a.avgPoints);
    ranked.forEach((t, i) => {
      t.rankInClass = i + 1;
    });

    return resultTeams;
  }

  /**
   * Tìm xem học sinh thuộc tổ nào, giữ vai trò gì
   */
  public getStudentTeamInfo(studentNameOrCode: string, className: string): { team: ClassTeam; member: ClassTeamMember } | null {
    const teams = this.getClassTeams(className);
    const search = studentNameOrCode.trim().toLowerCase();

    for (const team of teams) {
      const found = team.members.find(m => m.name.trim().toLowerCase() === search || m.studentCode === search);
      if (found) {
        return { team, member: found };
      }
    }
    return null;
  }

  /**
   * Lấy Bảng xếp hạng Đua Top tất cả các tổ cùng một khối (20 tổ Khối 6 hoặc 20 tổ Khối 8)
   */
  public getGradeTeamLeaderboard(grade: number): Array<ClassTeam & { rankInGrade: number }> {
    const classList = grade === 6 
      ? ['6A1', '6A2', '6A3', '6A4', '6A5'] 
      : ['8A1', '8A2', '8A3', '8A4', '8A5'];

    const allTeams: ClassTeam[] = [];
    classList.forEach(cls => {
      const teams = this.getClassTeams(cls);
      allTeams.push(...teams);
    });

    // Xếp hạng theo Tổng Điểm
    const sorted = [...allTeams].sort((a, b) => b.totalPoints - a.totalPoints || b.avgPoints - a.avgPoints);
    return sorted.map((t, idx) => ({
      ...t,
      rankInGrade: idx + 1
    }));
  }

  /**
   * Đổi vai trò Tổ trưởng / Tổ phó thủ công (dành cho Admin Thầy Thành)
   */
  public changeTeamRole(className: string, teamNumber: number, studentCode: string, newRole: TeamRole): boolean {
    const teams = this.getClassTeams(className);
    const team = teams.find(t => t.teamNumber === teamNumber);
    if (!team) return false;

    team.members.forEach(m => {
      if (m.studentCode === studentCode) {
        m.role = newRole;
        if (newRole === 'leader') {
          m.roleTitle = 'Tổ Trưởng (Team Leader)';
          m.roleBadge = '👑 TT';
          m.dutyDescription = '👑 Nhiệm vụ: Theo dõi tiến độ học tập của cả tổ, đôn đốc các bạn vào học mỗi ngày, hỗ trợ các bạn chưa tham gia để tổ bứt phá Bảng Vàng!';
        } else if (newRole === 'vice_leader') {
          m.roleTitle = 'Tổ Phó (Vice Leader)';
          m.roleBadge = '⭐ TP';
          m.dutyDescription = '⭐ Nhiệm vụ: Hỗ trợ Tổ trưởng theo dõi chuyên cần, hướng dẫn các bạn học từ vựng và làm bài kiểm tra thử GK1, nhắc nhở giữ chuỗi ngày học pháo hoa liên tục!';
        } else {
          m.roleTitle = 'Thành Viên';
          m.roleBadge = '👤 TV';
          m.dutyDescription = '👤 Nhiệm vụ: Tự giác học từ vựng và làm bài tập đều đặn mỗi ngày. Mỗi điểm số cá nhân kiếm được sẽ đóng góp trực tiếp vào Tổng Điểm của Tổ!';
        }
      }
    });

    team.leader = team.members.find(m => m.role === 'leader');
    team.viceLeader = team.members.find(m => m.role === 'vice_leader');

    this.cache[className.trim().toUpperCase()] = teams;
    this.saveToStorage();
    return true;
  }
}

export const classTeamService = new ClassTeamService();
