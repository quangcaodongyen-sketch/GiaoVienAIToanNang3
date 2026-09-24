import { RegistrationRequest, BlockedMachineItem } from './activityTrackingService';

const GITHUB_REPO = 'quangcaodongyen-sketch/GiaoVienAIToanNang3';
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}`;

// Khóa đồng bộ bảo mật qua Environment hoặc LocalStorage an toàn
const getCloudKey = (): string => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('gvai_cloud_sync_token');
    if (local) return local.trim();
  }
  return (import.meta as any).env?.VITE_CLOUD_TOKEN || '';
};

const getHeaders = (): Record<string, string> => {
  const token = getCloudKey();
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }
  return headers;
};

class CloudSyncService {
  // Gửi đơn đăng ký của giáo viên lên Cloud
  public async submitRegistrationToCloud(req: {
    machineId: string;
    fullName: string;
    schoolUnit: string;
    phoneNumber: string;
    appId: string;
    appName: string;
    packageType: 'TRIAL_5' | '1YEAR' | '2YEAR' | 'FULL_WEB';
    price?: string;
    createdAt?: string;
  }): Promise<{ success: boolean; issueNumber?: number; message: string }> {
    try {
      const now = req.createdAt || new Date().toLocaleString('vi-VN');
      const payloadData: RegistrationRequest = {
        id: `REG-${Date.now()}`,
        machineId: req.machineId,
        fullName: req.fullName,
        schoolUnit: req.schoolUnit,
        phoneNumber: req.phoneNumber,
        appId: req.appId,
        appName: req.appName,
        packageType: req.packageType,
        price: req.price || 'Liên hệ Zalo',
        status: 'PENDING',
        createdAt: now
      };

      const bodyText = `### ĐƠN ĐĂNG KÝ BẢN QUYỀN GIÁO VIÊN AI TOÀN NĂNG

- **Họ và tên:** ${req.fullName}
- **Trường / Đơn vị:** ${req.schoolUnit}
- **Số điện thoại / Zalo:** ${req.phoneNumber}
- **ID Máy tính:** \`${req.machineId}\`
- **Ứng dụng đăng ký:** ${req.appName}
- **Gói đăng ký:** **${req.packageType === '1YEAR' ? 'Gói 1 Năm' : req.packageType === '2YEAR' ? 'Gói 2 Năm VIP' : req.packageType === 'FULL_WEB' ? 'Gói Full Web' : 'Dùng thử 5 lần'}**
- **Thời gian gửi:** ${now}

\`\`\`gvai-reg
${JSON.stringify(payloadData, null, 2)}
\`\`\`
`;

      const response = await fetch(`${GITHUB_API_URL}/issues`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          title: `[ĐĂNG KÝ CLOUD] ${req.machineId} - ${req.fullName} - ${req.packageType === '1YEAR' ? 'Gói 1 Năm' : req.packageType === '2YEAR' ? 'Gói 2 Năm VIP' : req.packageType === 'FULL_WEB' ? 'Full Web' : 'Dùng thử'}`,
          body: bodyText,
          labels: ['registration', 'status:pending']
        })
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          issueNumber: data.number,
          message: 'Đã gửi đơn đăng ký thành công lên Cloud!'
        };
      } else {
        const errText = await response.text();
        console.warn('Lỗi gửi lên Cloud:', errText);
        return { success: false, message: 'Không thể kết nối Cloud, đã lưu dự phòng trên máy.' };
      }
    } catch (e) {
      console.warn('Lỗi mạng khi gửi Cloud:', e);
      return { success: false, message: 'Lỗi mạng kết nối Cloud.' };
    }
  }

  // Tải toàn bộ đơn đăng ký từ Cloud về cho Admin Thầy Thành & Cô Mai Tình xem
  public async fetchRegistrationsFromCloud(): Promise<Array<RegistrationRequest & { issueNumber?: number }>> {
    try {
      const response = await fetch(`${GITHUB_API_URL}/issues?state=all&per_page=100`, {
        headers: getHeaders()
      });

      if (!response.ok) return [];

      const issues = await response.json();
      const results: Array<RegistrationRequest & { issueNumber?: number }> = [];

      for (const issue of issues) {
        const isReg = issue.labels?.some((l: any) => l.name === 'registration') || issue.title?.includes('[ĐĂNG KÝ');
        if (!isReg) continue;

        const body: string = issue.body || '';
        const match = body.match(/```gvai-reg\s*([\s\S]*?)\s*```/);
        
        let regData: RegistrationRequest | null = null;
        if (match && match[1]) {
          try {
            regData = JSON.parse(match[1]);
          } catch {
            // ignore
          }
        }

        if (!regData) {
          regData = {
            id: `REG-${issue.id}`,
            machineId: issue.title.match(/GV-[A-Z0-9]{4}-[A-Z0-9]{4}/)?.[0] || 'GV-UNKNOWN',
            fullName: issue.user?.login || 'Giáo viên',
            schoolUnit: 'Trường THCS Đồng Yên',
            phoneNumber: '0915.213717',
            appId: 'all-apps',
            appName: 'Tất Cả Hệ Sinh Thái',
            packageType: issue.title.includes('2YEAR') || issue.title.includes('2 Năm') ? '2YEAR' : '1YEAR',
            price: 'Liên hệ Zalo',
            status: issue.labels?.some((l: any) => l.name === 'status:approved') ? 'APPROVED' : issue.state === 'closed' ? 'APPROVED' : 'PENDING',
            createdAt: new Date(issue.created_at).toLocaleString('vi-VN')
          };
        }

        if (issue.labels?.some((l: any) => l.name === 'status:approved')) {
          regData.status = 'APPROVED';
        } else if (issue.labels?.some((l: any) => l.name === 'status:rejected')) {
          regData.status = 'REJECTED';
        }

        results.push({
          ...regData,
          issueNumber: issue.number
        });
      }

      return results;
    } catch (e) {
      console.warn('Lỗi đọc đơn từ Cloud:', e);
      return [];
    }
  }

  // Admin hoặc Phụ tá bấm DUYỆT đơn đăng ký trên Cloud
  public async approveRegistrationOnCloud(
    issueNumber: number,
    reviewerName: string,
    packageType: '1YEAR' | '2YEAR' | 'FULL_WEB' | 'TRIAL_5'
  ): Promise<boolean> {
    try {
      const now = new Date().toLocaleString('vi-VN');
      const pkgLabel = packageType === 'FULL_WEB' ? 'Full Web' : packageType === '1YEAR' ? '1 Năm' : packageType === '2YEAR' ? '2 Năm VIP' : 'Dùng thử 5 lần';

      const commentBody = `### ✅ XÁC NHẬN DUYỆT BẢN QUYỀN CLOUD

- **Người kích hoạt duyệt:** **${reviewerName}**
- **Thời gian kích hoạt:** **${now}**
- **Gói bản quyền được cấp:** **${pkgLabel}**
- **Trạng thái:** HOẠT ĐỘNG (ACTIVE)

\`\`\`gvai-review
{
  "status": "APPROVED",
  "reviewedBy": "${reviewerName}",
  "reviewedAt": "${now}",
  "packageType": "${packageType}"
}
\`\`\`
`;

      await fetch(`${GITHUB_API_URL}/issues/${issueNumber}/comments`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ body: commentBody })
      });

      await fetch(`${GITHUB_API_URL}/issues/${issueNumber}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({
          state: 'closed',
          labels: ['registration', 'status:approved']
        })
      });

      return true;
    } catch (e) {
      console.error('Lỗi duyệt trên Cloud:', e);
      return false;
    }
  }

  // Admin hoặc Phụ tá TỪ CHỐI đơn trên Cloud
  public async rejectRegistrationOnCloud(issueNumber: number, reviewerName: string): Promise<boolean> {
    try {
      const now = new Date().toLocaleString('vi-VN');
      const commentBody = `### ❌ TỪ CHỐI ĐƠN ĐĂNG KÝ

- **Người xử lý:** **${reviewerName}**
- **Thời gian:** **${now}**
- **Trạng thái:** TỪ CHỐI (REJECTED)
`;

      await fetch(`${GITHUB_API_URL}/issues/${issueNumber}/comments`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ body: commentBody })
      });

      await fetch(`${GITHUB_API_URL}/issues/${issueNumber}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({
          state: 'closed',
          labels: ['registration', 'status:rejected']
        })
      });

      return true;
    } catch (e) {
      console.error('Lỗi từ chối trên Cloud:', e);
      return false;
    }
  }

  // Khóa thiết bị trên Cloud (Admin xóa tài khoản)
  public async blockMachineOnCloud(machineId: string, adminName: string, reason: string): Promise<boolean> {
    try {
      const now = new Date().toLocaleString('vi-VN');
      const bodyText = `### ⛔ KHÓA VÀ VÔ HIỆU HÓA THIẾT BỊ VĨNH VIỄN

- **Mã thiết bị (Machine ID):** \`${machineId}\`
- **Người thực hiện:** **${adminName}**
- **Thời gian:** **${now}**
- **Lý do:** ${reason}

\`\`\`gvai-blocked
{
  "machineId": "${machineId}",
  "blockedAt": "${now}",
  "reason": "${reason}",
  "blockedBy": "${adminName}"
}
\`\`\`
`;

      await fetch(`${GITHUB_API_URL}/issues`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          title: `[KHÓA MÁY VĨNH VIỄN] ${machineId}`,
          body: bodyText,
          labels: ['blocked:machine']
        })
      });

      return true;
    } catch (e) {
      console.error('Lỗi khóa trên Cloud:', e);
      return false;
    }
  }

  // Tải danh sách các máy bị khóa từ Cloud
  public async fetchBlockedMachinesFromCloud(): Promise<BlockedMachineItem[]> {
    try {
      const response = await fetch(`${GITHUB_API_URL}/issues?labels=blocked:machine&state=all`, {
        headers: getHeaders()
      });
      if (!response.ok) return [];

      const issues = await response.json();
      const list: BlockedMachineItem[] = [];

      for (const issue of issues) {
        const body: string = issue.body || '';
        const match = body.match(/```gvai-blocked\s*([\s\S]*?)\s*```/);
        if (match && match[1]) {
          try {
            const data = JSON.parse(match[1]);
            list.push({
              machineId: data.machineId,
              blockedAt: data.blockedAt,
              reason: data.reason
            });
          } catch {
            // ignore
          }
        }
      }
      return list;
    } catch (e) {
      console.warn('Lỗi đọc blocked list từ Cloud:', e);
      return [];
    }
  }

  // Kiểm tra máy tính hiện tại trên Cloud xem đã được duyệt hay bị khóa chưa
  public async checkCurrentMachineCloudStatus(machineId: string): Promise<{
    isApproved: boolean;
    packageType?: '1YEAR' | '2YEAR' | 'TRIAL_5' | 'FULL_WEB';
    approvedBy?: string;
    approvedAt?: string;
    isBlocked: boolean;
  }> {
    try {
      const issues = await this.fetchRegistrationsFromCloud();
      const myReg = issues.find(r => r.machineId === machineId);

      const blockedList = await this.fetchBlockedMachinesFromCloud();
      const isBlocked = blockedList.some(b => b.machineId === machineId);

      if (isBlocked) {
        return { isApproved: false, isBlocked: true };
      }

      if (myReg && myReg.status === 'APPROVED') {
        return {
          isApproved: true,
          packageType: myReg.packageType,
          approvedBy: myReg.reviewedBy || 'Admin Thầy Thành / Cô Mai Tình',
          approvedAt: myReg.reviewedAt,
          isBlocked: false
        };
      }

      return { isApproved: false, isBlocked: false };
    } catch (e) {
      return { isApproved: false, isBlocked: false };
    }
  }
}

export const cloudSyncService = new CloudSyncService();
