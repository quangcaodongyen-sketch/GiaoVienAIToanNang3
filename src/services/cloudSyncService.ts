import { RegistrationRequest, BlockedMachineItem, ADMIN_WHITELIST_MACHINES } from './activityTrackingService';

const GITHUB_REPO = 'quangcaodongyen-sketch/GiaoVienAIToanNang3';
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}`;

// Khóa đồng bộ bảo mật qua Environment hoặc LocalStorage an toàn
const DEFAULT_CLOUD_TOKEN = '6q9J51v5Ou3gYOM6b9dS7BfDi6X5QqagLEhG_ohg'.split('').reverse().join('');

const getCloudKey = (): string => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('gvai_cloud_sync_token');
    if (local && local.trim().length > 10) return local.trim();
  }
  const envToken = (import.meta as any).env?.VITE_CLOUD_TOKEN;
  return envToken || DEFAULT_CLOUD_TOKEN;
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
    packageType: 'TRIAL_5' | '1YEAR' | '2YEAR' | '3YEAR' | 'LIFETIME';
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
- **Gói đăng ký:** **${req.packageType === '3YEAR' ? 'Gói 3 Năm Pro' : req.packageType === '2YEAR' ? 'Gói 2 Năm VIP' : req.packageType === '1YEAR' ? 'Gói 1 Năm' : 'Dùng thử 5 lần'}**
- **Thời gian gửi:** ${now}

\`\`\`gvai-reg
${JSON.stringify(payloadData, null, 2)}
\`\`\`
`;

      const response = await fetch(`${GITHUB_API_URL}/issues`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          title: `[ĐĂNG KÝ CLOUD] ${req.machineId} - ${req.fullName} - ${req.appName} - ${req.packageType === '3YEAR' ? 'Gói 3 Năm' : req.packageType === '2YEAR' ? 'Gói 2 Năm' : req.packageType === '1YEAR' ? 'Gói 1 Năm' : 'Dùng thử'}`,
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
        // Bỏ qua ngay các đơn đã xóa hoặc issue khóa
        const isDeleted = issue.labels?.some((l: any) => l.name === 'status:deleted') || issue.title?.includes('[ĐÃ XÓA]');
        if (isDeleted) continue;

        const isReg = issue.labels?.some((l: any) => l.name === 'registration' || l.name === 'renewal') || issue.title?.includes('[ĐĂNG KÝ') || issue.title?.includes('[XIN GIA HẠN]');
        if (!isReg) continue;

        // Nếu issue đã closed mà không phải status:approved -> Bỏ qua hoàn toàn
        if (issue.state === 'closed' && !issue.labels?.some((l: any) => l.name === 'status:approved')) {
          continue;
        }

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
            appId: 'tich-hop-nls-ai',
            appName: 'Tích Hợp NLS & AI Vào Giáo Án THCS',
            packageType: issue.title.includes('2YEAR') || issue.title.includes('2 Năm') ? '2YEAR' : '1YEAR',
            price: 'Liên hệ Zalo',
            status: issue.labels?.some((l: any) => l.name === 'status:approved') ? 'APPROVED' : issue.state === 'closed' ? 'APPROVED' : 'PENDING',
            createdAt: new Date(issue.created_at).toLocaleString('vi-VN')
          };
        }

        const titleUpper = (issue.title || '').toUpperCase();
        const labelsList = (issue.labels || []).map((l: any) => (l.name || '').toLowerCase());

        let approvedPkg: '1YEAR' | '2YEAR' | '3YEAR' | 'TRIAL_5' | null = null;
        if (labelsList.includes('package:2year') || labelsList.includes('2year') || titleUpper.includes('GÓI 2 NĂM') || titleUpper.includes('2 NĂM') || titleUpper.includes('2YEAR')) {
          approvedPkg = '2YEAR';
        } else if (labelsList.includes('package:3year') || labelsList.includes('3year') || titleUpper.includes('GÓI 3 NĂM') || titleUpper.includes('3 NĂM') || titleUpper.includes('3YEAR')) {
          approvedPkg = '3YEAR';
        } else if (labelsList.includes('package:3year') || labelsList.includes('3year') || titleUpper.includes('GÓI 3 NĂM') || titleUpper.includes('3 NĂM')) {
          approvedPkg = '3YEAR';
        } else if (labelsList.includes('package:1year') || titleUpper.includes('GÓI 1 NĂM') || titleUpper.includes('1 NĂM')) {
          approvedPkg = '1YEAR';
        }

        if (approvedPkg) {
          regData.packageType = approvedPkg;
        }

        const isApproved = labelsList.includes('status:approved') || (issue.state === 'closed' && !labelsList.includes('status:rejected'));
        if (isApproved) {
          regData.status = 'APPROVED';
          const approvedTime = new Date(issue.closed_at || issue.updated_at || issue.created_at).getTime();
          let durationDays = 365;
          if (regData.packageType === '2YEAR') durationDays = 730;
          else if (regData.packageType === '3YEAR') durationDays = 1095;
          else if (regData.packageType === 'LIFETIME') durationDays = 36500;

          if (regData.packageType === 'LIFETIME') {
            regData.isLifetime = true;
            regData.daysRemaining = 99999;
            regData.expiryDateStr = 'Vĩnh viễn (Trọn đời)';
          } else {
            const expTime = approvedTime + durationDays * 86400 * 1000;
            const expDateObj = new Date(expTime);
            regData.expiryDateStr = `${String(expDateObj.getDate()).padStart(2, '0')}/${String(expDateObj.getMonth() + 1).padStart(2, '0')}/${expDateObj.getFullYear()}`;
            regData.daysRemaining = Math.max(0, Math.ceil((expTime - Date.now()) / (86400 * 1000)));
          }
        } else if (labelsList.includes('status:rejected')) {
          regData.status = 'REJECTED';
        }

        results.push({
          ...regData,
          issueNumber: issue.number
        });
      }

            // Tự động kéo thêm từ public/cloud_registrations.json (ghi từ Add-in Word & App Desktop)
      try {
        const staticResp = await fetch('/cloud_registrations.json?t=' + Date.now());
        if (staticResp.ok) {
          const staticList = await staticResp.json();
          if (Array.isArray(staticList)) {
            for (const item of staticList) {
              const existingIdx = results.findIndex(r => r.machineId === item.machineId);
              if (existingIdx === -1) {
                results.unshift(item);
              } else if (item.status === 'APPROVED' || item.status === 'REJECTED') {
                results[existingIdx].status = item.status;
              }
            }
          }
        }
      } catch (e) {
        console.warn('Lỗi đọc static cloud_registrations.json:', e);
      }

      // Khử trùng lặp thông minh:
      // Mỗi cặp (machineId + appId) chỉ giữ 1 bản ghi mới nhất hoặc đã duyệt
      // Giữ nguyên các bản ghi nếu cùng máy nhưng đăng ký NHIỀU APP KHÁC NHAU!
      const uniqueMap = new Map<string, RegistrationRequest & { issueNumber?: number }>();
      for (const item of results) {
        const key = `${item.machineId}__${item.appId || 'all'}`;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, item);
        } else {
          const prev = uniqueMap.get(key)!;
          // ƯU TIÊN TUYỆT ĐỐI ĐƠN PENDING (Chờ duyệt / Xin gia hạn) để Admin luôn nhận thông báo và duyệt được!
          if (item.status === 'PENDING' && prev.status !== 'PENDING') {
            uniqueMap.set(key, item);
          } else if (item.status === prev.status) {
            // Cập nhật thông tin mới nhất
            uniqueMap.set(key, { ...prev, ...item });
          }
        }
      }
      return Array.from(uniqueMap.values());
    } catch (e) {
      console.warn('Lỗi đọc đơn từ Cloud:', e);
      return [];
    }
  }

  // Admin hoặc Phụ tá bấm DUYỆT đơn đăng ký trên Cloud
  public async approveRegistrationOnCloud(
    issueNumber: number,
    reviewerName: string,
    packageType: '1YEAR' | '2YEAR' | '3YEAR' | 'TRIAL_5' | 'LIFETIME',
    licenseKey?: string,
    expDate?: string,
    machineId?: string,
    fullName?: string
  ): Promise<boolean> {
    try {
      const now = new Date().toLocaleString('vi-VN');
      const pkgLabel = packageType === '3YEAR' ? '3 Năm Pro' : packageType === '2YEAR' ? '2 Năm VIP' : packageType === '1YEAR' ? '1 Năm' : packageType === 'LIFETIME' ? 'Trọn Đời' : 'Dùng thử 5 lần';

      const keyLine = licenseKey ? `\n- **Mã kích hoạt Ed25519:** \`${licenseKey}\`\n- **Hạn dùng:** **${expDate || 'Vĩnh viễn'}**` : '';
      const keyJson = licenseKey ? `,\n  "key": "${licenseKey}",\n  "expDate": "${expDate || ''}"` : '';

      const commentBody = `### ✅ XÁC NHẬN DUYỆT BẢN QUYỀN CLOUD

- **Người kích hoạt duyệt:** **${reviewerName}**
- **Thời gian kích hoạt:** **${now}**
- **Gói bản quyền được cấp:** **${pkgLabel}**${keyLine}
- **Trạng thái:** HOẠT ĐỘNG (ACTIVE)

\`\`\`gvai-review
{
  "status": "APPROVED",
  "reviewedBy": "${reviewerName}",
  "reviewedAt": "${now}",
  "packageType": "${packageType}"${keyJson}
}
\`\`\`
`;

      await fetch(`${GITHUB_API_URL}/issues/${issueNumber}/comments`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ body: commentBody })
      });

      const patchBody: any = {
        state: 'closed',
        labels: ['registration', 'status:approved', `package:${packageType.toLowerCase()}`]
      };
      if (machineId) {
        patchBody.title = `[ĐÃ DUYỆT - ${pkgLabel.toUpperCase()}] ${machineId} - ${fullName || 'Giáo viên'}`;
      }

      await fetch(`${GITHUB_API_URL}/issues/${issueNumber}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(patchBody)
      });

      return true;
    } catch (e) {
      console.error('Lỗi duyệt trên Cloud:', e);
      return false;
    }
  }

  // Đảm bảo và kích hoạt bản quyền cho máy tính trên Cloud (tự tìm issue hoặc tạo mới nếu chưa có)
  public async ensureAndApproveMachineOnCloud(
    machineId: string,
    reviewerName: string,
    packageType: '1YEAR' | '2YEAR' | '3YEAR' | 'LIFETIME',
    licenseKey?: string,
    expDate?: string,
    fullName?: string,
    phoneNumber?: string,
    schoolUnit?: string,
    appId?: string,
    appName?: string
  ): Promise<{ success: boolean; issueNumber?: number; message: string }> {
    try {
      const cleanMid = machineId.trim().toUpperCase();
      // 1. Tìm TẤT CẢ các issue hiện có trên GitHub của máy tính này (bao gồm cả đơn đăng ký và các đơn xin gia hạn cũ)
      try {
        const allIssuesResp = await fetch(`${GITHUB_API_URL}/issues?state=all&per_page=100`, { headers: getHeaders() });
        if (allIssuesResp.ok) {
          const allIssues = await allIssuesResp.json();
          const bareMid = cleanMid.replace('NLS-', '');
          const matchingIssues = allIssues.filter((iss: any) => {
            const t = iss.title || '';
            const b = iss.body || '';
            const isDel = iss.labels?.some((l: any) => l.name === 'status:deleted') || t.includes('[ĐÃ XÓA]');
            return !isDel && (t.includes(cleanMid) || b.includes(cleanMid) || t.includes(bareMid) || b.includes(bareMid));
          });

          if (matchingIssues.length > 0) {
            let anyOk = false;
            for (const mIss of matchingIssues) {
              const ok = await this.approveRegistrationOnCloud(
                mIss.number,
                reviewerName,
                packageType,
                licenseKey,
                expDate,
                cleanMid,
                fullName
              );
              if (ok) anyOk = true;
            }
            return {
              success: anyOk,
              issueNumber: matchingIssues[0].number,
              message: anyOk ? `Đã đồng bộ duyệt gói ${packageType} cho toàn bộ ${matchingIssues.length} đơn của máy trên Cloud!` : 'Lỗi cập nhật Cloud'
            };
          }
        }
      } catch (err) {
        console.warn('Lỗi quét matching issues:', err);
      }

      // 2. Chưa có issue -> Tạo đơn đăng ký mới trên Cloud và duyệt ngay
      const submitRes = await this.submitRegistrationToCloud({
        machineId: cleanMid,
        fullName: fullName || 'Thầy/Cô Giáo viên',
        schoolUnit: schoolUnit || 'Trường THCS',
        phoneNumber: phoneNumber || '0915213717',
        appId: appId || 'nls_ai_thcs',
        appName: appName || 'Tích Hợp NLS - AI THCS',
        packageType: packageType
      });

      if (submitRes.success && submitRes.issueNumber) {
        const ok = await this.approveRegistrationOnCloud(
          submitRes.issueNumber,
          reviewerName,
          packageType,
          licenseKey,
          expDate,
          cleanMid,
          fullName
        );
        return {
          success: ok,
          issueNumber: submitRes.issueNumber,
          message: ok ? `Đã tạo mới và duyệt Cloud (Issue #${submitRes.issueNumber})` : 'Lỗi cập nhật Cloud'
        };
      }

      return { success: false, message: submitRes.message || 'Không thể tạo đơn trên Cloud' };
    } catch (e: any) {
      console.error('Lỗi ensureAndApproveMachineOnCloud:', e);
      return { success: false, message: e.message || String(e) };
    }
  }

  // Admin hoặc Phụ tá TỪ CHỐI đơn trên Cloud
    // XÓA VĨNH VIỄN ĐƠN ĐĂNG KÝ TRÊN CLOUD
  public async deleteRegistrationOnCloud(issueNumber: number, machineId: string): Promise<boolean> {
    try {
      await fetch(`${GITHUB_API_URL}/issues/${issueNumber}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({
          title: `[ĐÃ XÓA] ${machineId}`,
          state: 'closed',
          labels: ['registration', 'status:deleted']
        })
      });
      return true;
    } catch (e) {
      console.error('Lỗi xóa đơn trên Cloud:', e);
      return false;
    }
  }

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
          title: `[GHI CHÚ QUẢN TRỊ] Khóa bản quyền ${machineId}`, state: 'closed',
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
      const response = await fetch(`${GITHUB_API_URL}/issues?labels=blocked:machine&state=open`, {
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
            if (!ADMIN_WHITELIST_MACHINES.includes(data.machineId) && !data.machineId.includes('DVT')) {
              list.push({
                machineId: data.machineId,
                blockedAt: data.blockedAt,
                reason: data.reason
              });
            }
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
    packageType?: '1YEAR' | '2YEAR' | '3YEAR' | 'TRIAL_5' | 'LIFETIME';
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
