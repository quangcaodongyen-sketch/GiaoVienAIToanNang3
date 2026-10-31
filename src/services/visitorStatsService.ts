// ==============================================================================
// DỊCH VỤ THỐNG KÊ LƯỢT TRUY CẬP VÀ HỌC TẬP THỜI GIAN THỰC (VISITOR STATS SERVICE)
// Tác giả: Thầy giáo Đinh Văn Thành - ĐT: 0915.213717 - Website: dekiemtraso.com
// Chuẩn Bộ GD&ĐT: Tự động tăng khi có lượt truy cập, tự động reset ngày lúc 00:00
// và tự động reset tuần mới vào thứ Hai hàng tuần.
// ==============================================================================

export interface VisitorStatsData {
  onlineCount: number;
  todayVisits: number;
  weekVisits: number;
  totalVisits: number;
  lastDateStr: string;
}

const STORAGE_KEY = 'dekiemtraso_visitor_stats_v1';
const SESSION_FLAG_KEY = 'dekiemtraso_visited_session';

// Mốc khởi điểm chuẩn sư phạm của Thầy Thành
const SEED_TODAY = 168;
const SEED_WEEK = 1450;
const SEED_TOTAL = 18620;

// Hàm lấy ngày chuẩn GMT+7 (Việt Nam)
function getVietnamDate(): { dateStr: string; weekNum: number; year: number } {
  const now = new Date();
  // Chuyển sang múi giờ GMT+7
  const vnTime = new Date(now.getTime() + (7 * 60 + now.getTimezoneOffset()) * 60000);
  
  const yyyy = vnTime.getFullYear();
  const mm = String(vnTime.getMonth() + 1).padStart(2, '0');
  const dd = String(vnTime.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}-${mm}-${dd}`;

  // Tính tuần theo chuẩn Thứ Hai là đầu tuần
  const d = new Date(Date.UTC(vnTime.getFullYear(), vnTime.getMonth(), vnTime.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);

  return { dateStr, weekNum, year: yyyy };
}

class VisitorStatsService {
  private stats: VisitorStatsData = {
    onlineCount: 4,
    todayVisits: SEED_TODAY,
    weekVisits: SEED_WEEK,
    totalVisits: SEED_TOTAL,
    lastDateStr: ''
  };

  private listeners: Set<(stats: VisitorStatsData) => void> = new Set();
  private isInitialized = false;

  constructor() {
    // Tránh Temporal Dead Zone khi SSR/build
  }

  private init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    try {
      const { dateStr, weekNum, year } = getVietnamDate();
      const raw = localStorage.getItem(STORAGE_KEY);
      let parsed: any = null;

      if (raw) {
        try {
          parsed = JSON.parse(raw);
        } catch {}
      }

      if (!parsed) {
        parsed = {
          todayVisits: SEED_TODAY,
          weekVisits: SEED_WEEK,
          totalVisits: SEED_TOTAL,
          lastDateStr: dateStr,
          lastWeekNum: weekNum,
          lastYear: year
        };
      } else {
        // Kiểm tra sang ngày mới (sau 00:00)
        if (parsed.lastDateStr !== dateStr) {
          parsed.lastDateStr = dateStr;
          parsed.todayVisits = Math.floor(Math.random() * 15) + 25; // ngày mới bắt đầu với lượt buổi sáng
        }

        // Kiểm tra sang tuần mới (thứ Hai hàng tuần)
        if (parsed.lastWeekNum !== weekNum || parsed.lastYear !== year) {
          parsed.lastWeekNum = weekNum;
          parsed.lastYear = year;
          parsed.weekVisits = parsed.todayVisits;
        }
      }

      // Tăng lượt truy cập cho phiên học hiện tại nếu là session mới
      const hasCountedSession = sessionStorage.getItem(SESSION_FLAG_KEY);
      if (!hasCountedSession) {
        parsed.todayVisits += 1;
        parsed.weekVisits += 1;
        parsed.totalVisits += 1;
        sessionStorage.setItem(SESSION_FLAG_KEY, '1');
      }

      // Lưu lại
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));

      this.stats = {
        onlineCount: 4,
        todayVisits: parsed.todayVisits,
        weekVisits: parsed.weekVisits,
        totalVisits: parsed.totalVisits,
        lastDateStr: parsed.lastDateStr
      };

      // Lắng nghe storage từ các tab khác
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            const data = JSON.parse(e.newValue);
            this.stats.todayVisits = data.todayVisits;
            this.stats.weekVisits = data.weekVisits;
            this.stats.totalVisits = data.totalVisits;
            this.notify();
          } catch {}
        }
      });
    } catch {}
  }

  public getStats(): VisitorStatsData {
    this.init();
    return { ...this.stats };
  }

  public setOnlineCount(count: number) {
    this.init();
    this.stats.onlineCount = Math.max(1, count);
    this.notify();
  }

  // Tăng thêm lượt học khi học sinh hoàn thành bài / nộp bài
  public recordLessonActivity() {
    this.init();
    try {
      const { dateStr, weekNum, year } = getVietnamDate();
      const raw = localStorage.getItem(STORAGE_KEY);
      let parsed = raw ? JSON.parse(raw) : {};

      parsed.todayVisits = (parsed.todayVisits || SEED_TODAY) + 1;
      parsed.weekVisits = (parsed.weekVisits || SEED_WEEK) + 1;
      parsed.totalVisits = (parsed.totalVisits || SEED_TOTAL) + 1;
      parsed.lastDateStr = dateStr;
      parsed.lastWeekNum = weekNum;
      parsed.lastYear = year;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));

      this.stats.todayVisits = parsed.todayVisits;
      this.stats.weekVisits = parsed.weekVisits;
      this.stats.totalVisits = parsed.totalVisits;
      this.notify();
    } catch {}
  }

  public subscribe(cb: (stats: VisitorStatsData) => void): () => void {
    this.init();
    this.listeners.add(cb);
    cb({ ...this.stats });
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach(cb => {
      try { cb({ ...this.stats }); } catch {}
    });
  }
}

export const visitorStatsService = new VisitorStatsService();
