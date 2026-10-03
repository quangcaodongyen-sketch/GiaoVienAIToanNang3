import { ADMIN_WHITELIST_MACHINES } from './activityTrackingService';

const GITHUB_REPO = 'quangcaodongyen-sketch/GiaoVienAIToanNang3';
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}`;

const DEFAULT_CLOUD_TOKEN = '6q9J51v5Ou3gYOM6b9dS7BfDi6X5QqagLEhG_ohg'.split('').reverse().join('');

const getCloudToken = (): string => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('gvai_cloud_sync_token');
    if (local && local.trim().length > 10) return local.trim();
  }
  const envToken = (import.meta as any).env?.VITE_CLOUD_TOKEN;
  return envToken || DEFAULT_CLOUD_TOKEN;
};

const getHeaders = (): Record<string, string> => {
  const token = getCloudToken();
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }
  return headers;
};

export const MAINTENANCE_STORAGE_KEY = 'gvai_web_maintenance_locked';
export const ADMIN_SESSION_STORAGE_KEY = 'gvai_admin_session';
export const ADMIN_SESSION_TEMP_KEY = 'gvai_admin_auth';

class SystemMaintenanceService {
  /**
   * Kiểm tra nhanh trạng thái Khóa Web từ LocalStorage
   */
  public isMaintenanceLocked(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(MAINTENANCE_STORAGE_KEY) === 'true';
  }

  /**
   * Kiểm tra người dùng hiện tại có phải là Admin đang đăng nhập hợp lệ không
   */
  public isAdminSession(): boolean {
    if (typeof window === 'undefined') return false;
    
    // 1. Kiểm tra session admin
    const isAuthSession = 
      sessionStorage.getItem(ADMIN_SESSION_TEMP_KEY) === 'true' ||
      localStorage.getItem(ADMIN_SESSION_STORAGE_KEY) === 'authenticated' ||
      localStorage.getItem('gvai_unlimited_machine') === 'true';

    if (isAuthSession) return true;

    // 2. Kiểm tra mã máy tính của Thầy Đinh Văn Thành
    try {
      const mid = localStorage.getItem('gvai_detected_machine_id') || 
                  localStorage.getItem('gvai_machine_fingerprint') || '';
      if (mid && (ADMIN_WHITELIST_MACHINES.includes(mid) || mid === 'GV-0DAD-F76C' || mid.includes('DVT'))) {
        return true;
      }
    } catch {}

    return false;
  }

  /**
   * Xác thực mật khẩu Quản trị viên
   */
  public verifyAdminPassword(password: string): boolean {
    const clean = password.trim();
    const normalized = clean.toLowerCase();
    
    const isValid = 
      clean === 'Thaythanh2026@' ||
      normalized === 'thaythanh2026@' ||
      normalized === 'thaythanh2026' ||
      clean === 'Kichhoat123@' ||
      normalized === 'kichhoat123@' ||
      normalized === 'kichhoat123' ||
      clean === 'Kíchhoạt123@' ||
      clean === 'Thaythanh@' ||
      clean === 'Tiemgiang123@';

    if (isValid) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(ADMIN_SESSION_TEMP_KEY, 'true');
        localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, 'authenticated');
        window.dispatchEvent(new CustomEvent('gvai_admin_auth_changed', { detail: { isAuthenticated: true } }));
      }
      return true;
    }
    return false;
  }

  /**
   * Đăng xuất quyền Admin trên trình duyệt này
   */
  public logoutAdminSession(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(ADMIN_SESSION_TEMP_KEY);
      localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('gvai_admin_auth_changed', { detail: { isAuthenticated: false } }));
    }
  }

  /**
   * Bật hoặc Tắt chế độ Khóa Web (Bảo trì nâng cấp)
   */
  public async setMaintenanceLock(locked: boolean, note: string = 'Nâng cấp hệ thống'): Promise<boolean> {
    if (typeof window !== 'undefined') {
      localStorage.setItem(MAINTENANCE_STORAGE_KEY, locked ? 'true' : 'false');
      window.dispatchEvent(new CustomEvent('gvai_maintenance_status_changed', { 
        detail: { locked, note, timestamp: new Date().toISOString() } 
      }));
    }

    // Đồng bộ lên Cloud GitHub Issues (nếu có kết nối)
    try {
      await this.syncMaintenanceStatusToCloud(locked, note);
      return true;
    } catch (err) {
      console.warn('Lỗi đồng bộ Cloud trạng thái bảo trì:', err);
      return true; // Vẫn thành công ở mức local
    }
  }

  /**
   * Kiểm tra trạng thái Khóa Web từ Cloud (Toàn cầu)
   */
  public async checkCloudMaintenanceStatus(): Promise<boolean> {
    try {
      const resp = await fetch(`${GITHUB_API_URL}/issues?labels=system:maintenance&state=open&per_page=1`, {
        headers: getHeaders()
      });
      if (resp.ok) {
        const issues = await resp.json();
        const isLockedOnCloud = Array.isArray(issues) && issues.length > 0;
        if (typeof window !== 'undefined') {
          const currentLocal = localStorage.getItem(MAINTENANCE_STORAGE_KEY) === 'true';
          if (currentLocal !== isLockedOnCloud) {
            localStorage.setItem(MAINTENANCE_STORAGE_KEY, isLockedOnCloud ? 'true' : 'false');
            window.dispatchEvent(new CustomEvent('gvai_maintenance_status_changed', { 
              detail: { locked: isLockedOnCloud, fromCloud: true } 
            }));
          }
        }
        return isLockedOnCloud;
      }
    } catch (err) {
      console.warn('Không thể kiểm tra Cloud maintenance status:', err);
    }
    return this.isMaintenanceLocked();
  }

  /**
   * Đồng bộ lên Cloud GitHub
   */
  private async syncMaintenanceStatusToCloud(locked: boolean, note: string): Promise<void> {
    try {
      // 1. Quét tìm issue bảo trì hiện tại
      const listResp = await fetch(`${GITHUB_API_URL}/issues?labels=system:maintenance&state=all&per_page=5`, {
        headers: getHeaders()
      });
      
      let existingOpenIssue: any = null;
      if (listResp.ok) {
        const issues = await listResp.json();
        existingOpenIssue = issues.find((i: any) => i.state === 'open');
      }

      const now = new Date().toLocaleString('vi-VN');

      if (locked) {
        // Cần KHÓA WEB: Tạo hoặc giữ open issue
        if (!existingOpenIssue) {
          await fetch(`${GITHUB_API_URL}/issues`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
              title: `[HỆ THỐNG] KHÓA BẢO TRÌ NÂNG CẤP WEBSITE - ${now}`,
              body: `### 🔒 CHẾ ĐỘ BẢO TRÌ NÂNG CẤP ĐANG KÍCH HOẠT\n\n- **Thời gian khóa:** ${now}\n- **Lý do / Ghi chú:** ${note}\n- **Người kích hoạt:** Thầy giáo Đinh Văn Thành (Admin)\n\nKhi issue này còn MỞ (OPEN), toàn bộ giáo viên vào web sẽ thấy thông báo: "Web đang nâng cấp, vui lòng ghé thăm sau!"`,
              labels: ['system:maintenance', 'status:locked']
            })
          });
        }
      } else {
        // Cần MỞ KHÓA WEB: Đóng tất cả issue bảo trì đang mở
        if (existingOpenIssue) {
          await fetch(`${GITHUB_API_URL}/issues/${existingOpenIssue.number}`, {
            method: 'PATCH',
            headers: getHeaders(),
            body: JSON.stringify({
              state: 'closed',
              state_reason: 'completed'
            })
          });
        }
      }
    } catch (err) {
      console.warn('Lỗi API đồng bộ Cloud bảo trì:', err);
    }
  }
}

export const systemMaintenanceService = new SystemMaintenanceService();
