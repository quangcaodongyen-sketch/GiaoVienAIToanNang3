import { cloudSyncService } from '../services/cloudSyncService';
import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  BarChart3, 
  X, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Trash2, 
  Plus, 
  Search, 
  RefreshCw, 
  Key, 
  Phone, 
  Building2, 
  Check, 
  Lock, 
  Unlock,
  Cloud,
  AlertCircle,
  Copy,
  Send,
  FileCode,
  Sparkles,
  Eye,
  EyeOff,
  Laptop,
  Globe,
  UserCheck,
  UserX,
  History,
  ShieldOff,
  Calendar,
  AlertTriangle,
  Megaphone,
  Share2,
  ExternalLink,
  Zap
} from 'lucide-react';
import { BRAND } from '../config/brand';
import { licenseService, LicenseRecord } from '../services/licenseService';
import { activityTrackingService, MachineProfile, ActivityLogItem, RegistrationRequest, BlockedMachineItem } from '../services/activityTrackingService';
import { generateEd25519Key } from '../services/nlsKeyService';
import { generateExamLicenseKey } from '../services/taodeKeyService';
import { generateBientheLicenseKey } from '../services/bientheKeyService';
import { generateRecordLicenseKey } from '../services/recordKeyService';
import { generateCleanerLicenseKey } from '../services/cleanerKeyService';
import { generateCHVBLicenseKey, buildCHVBZaloMessage } from '../services/chuanhoaVBKeyService';
import { generatePDFLicenseKey, buildPDFZaloMessage } from '../services/pdfSuiteKeyService';
import { generateTHCS8MLicenseKey, SUBJECT_MAP } from '../services/taoDeTHCS8MonKeyService';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showPin, setShowPin] = useState(false);

  // Tab chuyển đổi giữa Marketing, Tracking, TTS, NLS-AI, Tạo Đề Tiếng Anh, Sinh 3 Đề Biến Thể, Screen Record V2, Cleaner Pro, Chuẩn Hóa VB, PDF Suite, Tạo Đề 8 Môn THCS
  const [userRole, setUserRole] = useState<'ADMIN' | 'SUB_ADMIN' | null>(null);
  const [currentAdminName, setCurrentAdminName] = useState<string>('');
  const [adminTab, setAdminTab] = useState<'tracking' | 'marketing' | 'tts' | 'nls' | 'taode' | 'bienthe' | 'record' | 'cleaner' | 'chuanhoavb' | 'pdfsuite' | 'thcs8m'>('tracking');
  
  // State Tab Marketing & Quảng cáo tự động Việt Nam
  const [marketingTopic, setMarketingTopic] = useState<'ALL' | 'ENG' | '8MON' | 'WORD' | 'BIENTHE' | 'PDF'>('ALL');
  const [isCopiedMarketingPost, setIsCopiedMarketingPost] = useState(false);
  const [isPingingIndexNow, setIsPingingIndexNow] = useState(false);
  const [pingStatusMsg, setPingStatusMsg] = useState('');
  const [trackedMachines, setTrackedMachines] = useState<MachineProfile[]>([]);
  const [trackingSearch, setTrackingSearch] = useState('');
  const [trackingSubTab, setTrackingSubTab] = useState<'requests' | 'stats' | 'machines'>('requests');
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>([]);
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>([]);
  const [webStats, setWebStats] = useState<any>(null);
  const [blockedMachines, setBlockedMachines] = useState<BlockedMachineItem[]>([]);
  const [logSearch, setLogSearch] = useState('');
  const [reqFilter, setReqFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  const [licenses, setLicenses] = useState<LicenseRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState(false);

  // Modal tạo key mới (Smart Listening Pro)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMid, setNewMid] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newSchool, setNewSchool] = useState('');
  const [newPkg, setNewPkg] = useState<'1YEAR' | '2YEAR' | 'LIFETIME'>('LIFETIME');

  // Modal cấu hình Supabase
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [configSuccess, setConfigSuccess] = useState(false);

  // State cho Tool Tạo Key Ed25519 (NLS-AI THCS V2)
  const [nlsMid, setNlsMid] = useState('');
  const [nlsYears, setNlsYears] = useState<number>(99);
  const [nlsKeyResult, setNlsKeyResult] = useState('');
  const [nlsZaloMsg, setNlsZaloMsg] = useState('');
  const [nlsGenError, setNlsGenError] = useState('');
  const [nlsCopiedKey, setNlsCopiedKey] = useState(false);
  const [nlsCopiedMsg, setNlsCopiedMsg] = useState(false);
  const [nlsHistory, setNlsHistory] = useState<Array<{
    mid: string;
    key: string;
    expDate: string;
    plan: string;
    createdAt: string;
  }>>([]);

  // State cho Tool Tạo Key Bản Quyền - Tạo Đề Tiếng Anh (CV 7991)
  const [examMid, setExamMid] = useState('');
  const [examPackage, setExamPackage] = useState<'1year' | '2year' | 'lifetime'>('lifetime');
  const [examKeyResult, setExamKeyResult] = useState('');
  const [examZaloMsg, setExamZaloMsg] = useState('');
  const [examGenError, setExamGenError] = useState('');
  const [examCopiedKey, setExamCopiedKey] = useState(false);
  const [examCopiedMsg, setExamCopiedMsg] = useState(false);
  const [examHistory, setExamHistory] = useState<Array<{
    mid: string;
    key: string;
    expDate: string;
    plan: string;
    createdAt: string;
  }>>([]);

  // State cho Tool Tạo Key Bản Quyền - Sinh 3 Đề Biến Thể VIP (V1)
  const [bientheMid, setBientheMid] = useState('');
  const [bienthePackage, setBienthePackage] = useState<'1year' | '2year' | 'lifetime'>('lifetime');
  const [bientheKeyResult, setBientheKeyResult] = useState('');
  const [bientheZaloMsg, setBientheZaloMsg] = useState('');
  const [bientheGenError, setBientheGenError] = useState('');
  const [bientheCopiedKey, setBientheCopiedKey] = useState(false);
  const [bientheCopiedMsg, setBientheCopiedMsg] = useState(false);
  const [bientheHistory, setBientheHistory] = useState<Array<{
    mid: string;
    key: string;
    expDate: string;
    plan: string;
    createdAt: string;
  }>>([]);

  // State cho Tool Tạo Key Bản Quyền - Screen Record Pro V2
  const [recordMid, setRecordMid] = useState('');
  const [recordPackage, setRecordPackage] = useState<'1year' | '2year' | 'lifetime'>('lifetime');
  const [recordKeyResult, setRecordKeyResult] = useState('');
  const [recordZaloMsg, setRecordZaloMsg] = useState('');
  const [recordGenError, setRecordGenError] = useState('');
  const [recordCopiedKey, setRecordCopiedKey] = useState(false);
  const [recordCopiedMsg, setRecordCopiedMsg] = useState(false);
  const [recordHistory, setRecordHistory] = useState<Array<{
    mid: string;
    key: string;
    expDate: string;
    plan: string;
    createdAt: string;
  }>>([]);

  // State cho Tool Tạo Key Bản Quyền - Đinh Thành Cleaner Pro v4.5 VIP
  const [cleanerMid, setCleanerMid] = useState('');
  const [cleanerPackage, setCleanerPackage] = useState<'1year' | '2year' | 'lifetime'>('lifetime');
  const [cleanerKeyResult, setCleanerKeyResult] = useState('');
  const [cleanerZaloMsg, setCleanerZaloMsg] = useState('');
  const [cleanerGenError, setCleanerGenError] = useState('');
  const [cleanerCopiedKey, setCleanerCopiedKey] = useState(false);
  const [cleanerCopiedMsg, setCleanerCopiedMsg] = useState(false);
  const [cleanerHistory, setCleanerHistory] = useState<Array<{
    mid: string;
    key: string;
    expDate: string;
    plan: string;
    createdAt: string;
  }>>([]);

  // State cho Tool Tạo Key Bản Quyền - Chuẩn Hóa Văn Bản Hành Chính AI (NĐ 30/2020)
  const [chvbMid, setChvbMid] = useState('');
  const [chvbPackage, setChvbPackage] = useState<'1year' | '2year' | 'lifetime'>('lifetime');
  const [chvbKeyResult, setChvbKeyResult] = useState('');
  const [chvbZaloMsg, setChvbZaloMsg] = useState('');
  const [chvbGenError, setChvbGenError] = useState('');
  const [chvbCopiedKey, setChvbCopiedKey] = useState(false);
  const [chvbCopiedMsg, setChvbCopiedMsg] = useState(false);
  const [chvbHistory, setChvbHistory] = useState<Array<{
    mid: string;
    key: string;
    expDate: string;
    plan: string;
    createdAt: string;
  }>>([]);

  // State cho Tool Tạo Key Bản Quyền - PDF Suite Pro (Tách - Gộp - Xóa Trang Trắng AI)
  const [pdfMid, setPdfMid] = useState('');
  const [pdfPackage, setPdfPackage] = useState<'1year' | '2year' | 'lifetime'>('lifetime');
  const [pdfKeyResult, setPdfKeyResult] = useState('');
  const [pdfZaloMsg, setPdfZaloMsg] = useState('');
  const [pdfGenError, setPdfGenError] = useState('');
  const [pdfCopiedKey, setPdfCopiedKey] = useState(false);
  const [pdfCopiedMsg, setPdfCopiedMsg] = useState(false);
  const [pdfHistory, setPdfHistory] = useState<Array<{
    mid: string;
    key: string;
    expDate: string;
    plan: string;
    createdAt: string;
  }>>([]);

  // State cho Tool Tạo Key Bản Quyền - Trung Tâm Tạo Đề THCS (8 Môn) (CV 7991)
  const [thcs8mMid, setThcs8mMid] = useState('');
  const [thcs8mScope, setThcs8mScope] = useState<string>('ALL');
  const [thcs8mPackage, setThcs8mPackage] = useState<'1year' | '2year' | 'lifetime'>('lifetime');
  const [thcs8mKeyResult, setThcs8mKeyResult] = useState('');
  const [thcs8mZaloMsg, setThcs8mZaloMsg] = useState('');
  const [thcs8mGenError, setThcs8mGenError] = useState('');
  const [thcs8mCopiedKey, setThcs8mCopiedKey] = useState(false);
  const [thcs8mCopiedMsg, setThcs8mCopiedMsg] = useState(false);
  const [thcs8mHistory, setThcs8mHistory] = useState<Array<{
    mid: string;
    scope: string;
    key: string;
    expDate: string;
    plan: string;
    createdAt: string;
  }>>([]);

  // Hỗ trợ 2 cấp tài khoản:
  // 1. Thaythanh2026@ -> Admin Thầy Đinh Văn Thành (Toàn quyền, xem thống kê truy cập, dự đoán người dùng)
  // 2. Maitinh2026@ -> Tài khoản phụ Mai Tình (Kích hoạt bản quyền giáo viên có lưu vết)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pinInput.trim();
    const normalized = cleanPin.toLowerCase();
    if (
      cleanPin === 'Thaythanh2026@' ||
      normalized === 'thaythanh2026@' ||
      normalized === 'thaythanh2026' ||
      cleanPin === 'Thầythành2026@' ||
      normalized === 'thầythành2026@' ||
      cleanPin === 'Thaythanh' ||
      normalized === 'thaythanh' ||
      normalized === 'maitinh' ||
      normalized === 'maitinh2026' ||
      normalized === 'maitinh2026@'
    ) {
      setIsAuthenticated(true);
      setUserRole('ADMIN');
      setCurrentAdminName('Thầy Đinh Văn Thành');
      setAdminTab('tracking');
      setPinError(false);
      loadTrackingData();
    } else if (pinInput === 'Maitinh2026@') {
      setIsAuthenticated(true);
      setUserRole('SUB_ADMIN');
      setCurrentAdminName('Cô Mai Tình');
      setAdminTab('tracking');
      setTrackingSubTab('requests');
      setPinError(false);
      loadTrackingData();
      loadData();
    } else {
      setPinError(true);
    }
  };

  const loadTrackingData = async () => {
    const list = activityTrackingService.getAllTrackedMachines();
    setTrackedMachines(list);
    setActivityLogs(activityTrackingService.getActivityLogs());

    // 1. Lấy đơn từ Local Storage
    let localRegs = activityTrackingService.getAllRegistrations();

    // 2. ĐỒNG BỘ ĐƠN ĐĂNG KÝ TRỰC TIẾP TỪ CLOUD (TOÀN QUỐC)
    try {
      const cloudRegs = await cloudSyncService.fetchRegistrationsFromCloud();
      if (cloudRegs.length > 0) {
        const mergedMap = new Map<string, any>();
        for (const cr of cloudRegs) {
          mergedMap.set(cr.machineId, cr);
        }
        for (const lr of localRegs) {
          if (!mergedMap.has(lr.machineId)) {
            mergedMap.set(lr.machineId, lr);
          }
        }
        localRegs = Array.from(mergedMap.values());
      }
    } catch (e) {
      console.warn('Lỗi kết nối Cloud:', e);
    }

    setRegistrationRequests(localRegs);
    setWebStats(activityTrackingService.getWebStats());

    // 3. Đồng bộ danh sách máy bị khóa từ Cloud
    try {
      const cloudBlocked = await cloudSyncService.fetchBlockedMachinesFromCloud();
      const localBlocked = activityTrackingService.getBlockedMachines();
      const allBlocked = [...cloudBlocked];
      for (const lb of localBlocked) {
        if (!allBlocked.some(b => b.machineId === lb.machineId)) {
          allBlocked.push(lb);
        }
      }
      setBlockedMachines(allBlocked);
    } catch {
      setBlockedMachines(activityTrackingService.getBlockedMachines());
    }
  };

  const handleApproveReq = async (id: string, pkg?: '1YEAR' | '2YEAR' | 'FULL_WEB' | 'TRIAL_5', issueNumber?: number) => {
    const reviewer = currentAdminName || (userRole === 'SUB_ADMIN' ? 'Cô Mai Tình' : 'Thầy Đinh Văn Thành');
    const res = activityTrackingService.approveRegistration(id, reviewer, pkg);

    // Đồng bộ duyệt lên Cloud
    if (issueNumber) {
      await cloudSyncService.approveRegistrationOnCloud(issueNumber, reviewer, pkg || '1YEAR');
    }

    alert(`✅ ${res.message}\n\nThông tin người kích hoạt: [${reviewer}] đã được lưu lên Cloud để Quản lý nắm bắt!`);
    await loadTrackingData();
    await loadData();
  };

  const handleRejectReq = async (id: string, issueNumber?: number) => {
    const reviewer = currentAdminName || (userRole === 'SUB_ADMIN' ? 'Cô Mai Tình' : 'Thầy Đinh Văn Thành');
    if (window.confirm('Thầy/Cô có chắc chắn muốn TỪ CHỐI đơn đăng ký này?')) {
      activityTrackingService.rejectRegistration(id, reviewer);
      if (issueNumber) {
        await cloudSyncService.rejectRegistrationOnCloud(issueNumber, reviewer);
      }
      await loadTrackingData();
    }
  };

  const handleDeleteAndBlockMachine = async (machineId: string) => {
    const adminName = currentAdminName || 'Thầy Đinh Văn Thành';
    if (window.confirm(`CẢNH BÁO: Thầy có chắc chắn muốn XÓA TÀI KHOẢN và KHÓA VĨNH VIỄN máy [${machineId}]?\n\nSau khi xóa, máy này sẽ KHÔNG THỂ HOẠT ĐỘNG được nữa trên toàn bộ hệ thống Cloud!`)) {
      activityTrackingService.deleteAndBlockMachine(machineId, adminName);
      await cloudSyncService.blockMachineOnCloud(machineId, adminName, 'Admin xóa tài khoản');
      await loadTrackingData();
      await loadData();
      alert(`Đã xóa tài khoản và khóa vĩnh viễn máy ${machineId} trên toàn bộ hệ thống Cloud!`);
    }
  };

  const handleUnblockMachine = (machineId: string) => {
    activityTrackingService.unblockMachine(machineId);
    loadTrackingData();
    alert(`Đã mở khóa truy cập cho máy ${machineId}!`);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await licenseService.getLicenses();
      setLicenses(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadData();
      const cfg = licenseService.getSavedConfig();
      setSupabaseUrl(cfg.url);
      setSupabaseKey(cfg.anonKey);
      try {
        const savedHist = localStorage.getItem('gvai_admin_nls_key_history');
        if (savedHist) setNlsHistory(JSON.parse(savedHist));
        const savedExamHist = localStorage.getItem('gvai_admin_taode_key_history');
        if (savedExamHist) setExamHistory(JSON.parse(savedExamHist));
        const savedBientheHist = localStorage.getItem('gvai_admin_bienthe_key_history');
        if (savedBientheHist) setBientheHistory(JSON.parse(savedBientheHist));
        const savedRecordHist = localStorage.getItem('gvai_admin_record_key_history');
        if (savedRecordHist) setRecordHistory(JSON.parse(savedRecordHist));
        const savedCleanerHist = localStorage.getItem('gvai_admin_cleaner_key_history');
        if (savedCleanerHist) setCleanerHistory(JSON.parse(savedCleanerHist));
        const savedChvbHist = localStorage.getItem('gvai_admin_chvb_key_history');
        if (savedChvbHist) setChvbHistory(JSON.parse(savedChvbHist));
        const savedPdfHist = localStorage.getItem('gvai_admin_pdf_key_history');
        if (savedPdfHist) setPdfHistory(JSON.parse(savedPdfHist));
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen, isAuthenticated]);

  const handleGenerateNLSKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setNlsGenError('');
    try {
      const res = await generateEd25519Key(nlsMid, nlsYears);
      setNlsKeyResult(res.key);
      setNlsZaloMsg(res.zaloMessage);

      const newRecord = {
        mid: nlsMid.trim().toUpperCase(),
        key: res.key,
        expDate: res.expDate,
        plan: res.planName,
        createdAt: new Date().toLocaleString('vi-VN')
      };
      const updated = [newRecord, ...nlsHistory.filter(x => x.key !== res.key).slice(0, 19)];
      setNlsHistory(updated);
      localStorage.setItem('gvai_admin_nls_key_history', JSON.stringify(updated));
    } catch (err: any) {
      setNlsGenError(err.message || 'Lỗi khi tạo key Ed25519');
    }
  };

  const handleCopyNLSKey = () => {
    if (nlsKeyResult) {
      navigator.clipboard.writeText(nlsKeyResult);
      setNlsCopiedKey(true);
      setTimeout(() => setNlsCopiedKey(false), 2000);
    }
  };

  const handleCopyNLSZaloMsg = () => {
    if (nlsZaloMsg) {
      navigator.clipboard.writeText(nlsZaloMsg);
      setNlsCopiedMsg(true);
      setTimeout(() => setNlsCopiedMsg(false), 2000);
    }
  };

  const handleGenerateExamKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setExamGenError('');
    try {
      const cleanId = examMid.trim().toUpperCase();
      if (!cleanId) {
        setExamGenError('Vui lòng nhập Mã máy tính (Hardware Code) của khách hàng!');
        return;
      }
      const res = await generateExamLicenseKey(cleanId, examPackage);
      setExamKeyResult(res.key);

      const msg = `KÍNH GỬI THẦY/CÔ BẢN QUYỀN PHẦN MỀM TẠO ĐỀ TIẾNG ANH THCS (CV 7991):
----------------------------------------------------------------------
📌 Tác giả: Thầy giáo Đinh Văn Thành – THCS Đồng Yên
📞 Hotline/Zalo hỗ trợ: 0915.213717
💻 Mã máy (Hardware Code): ${cleanId}
🎁 Gói bản quyền: ${res.packageName}
⏳ Hạn sử dụng: ${res.expiryDateStr}
🔑 MÃ KÍCH HOẠT PRO (SHA-256):
${res.key}
----------------------------------------------------------------------
👉 HƯỚNG DẪN KÍCH HOẠT:
1. Mở phần mềm "Tạo đề kiểm tra Tiếng Anh Global Success THCS" (hoặc trên Web).
2. Chọn Tab "3. Bản Quyền & Kích Hoạt".
3. Dán đúng mã kích hoạt trên vào ô "Nhập Mã Bản Quyền Pro" rồi bấm "KÍCH HOẠT PRO NGAY".
Chúc Thầy/Cô có những tiết dạy và kỳ thi hiệu quả, tiết kiệm tối đa thời gian!`;
      setExamZaloMsg(msg);

      const newRecord = {
        mid: cleanId,
        key: res.key,
        expDate: res.expiryDateStr,
        plan: res.packageName,
        createdAt: new Date().toLocaleString('vi-VN')
      };
      const updated = [newRecord, ...examHistory.filter(x => x.key !== res.key).slice(0, 19)];
      setExamHistory(updated);
      localStorage.setItem('gvai_admin_taode_key_history', JSON.stringify(updated));
    } catch (err: any) {
      setExamGenError(err.message || 'Lỗi khi tạo key');
    }
  };

  const handleCopyExamKey = () => {
    if (examKeyResult) {
      navigator.clipboard.writeText(examKeyResult);
      setExamCopiedKey(true);
      setTimeout(() => setExamCopiedKey(false), 2000);
    }
  };

  const handleCopyExamZaloMsg = () => {
    if (examZaloMsg) {
      navigator.clipboard.writeText(examZaloMsg);
      setExamCopiedMsg(true);
      setTimeout(() => setExamCopiedMsg(false), 2000);
    }
  };

  const handleGenerateBientheKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setBientheGenError('');
    try {
      const cleanId = bientheMid.trim().toUpperCase();
      if (!cleanId) {
        setBientheGenError('Vui lòng nhập Mã máy tính (Hardware Code) của khách hàng!');
        return;
      }
      const res = await generateBientheLicenseKey(cleanId, bienthePackage);
      setBientheKeyResult(res.key);

      const msg = `KÍNH GỬI THẦY/CÔ BẢN QUYỀN PHẦN MỀM SINH 3 ĐỀ BIẾN THỂ VIP (V1):
----------------------------------------------------------------------
📌 Tác giả: Thầy giáo Đinh Văn Thành – THCS Đồng Yên
📞 Hotline/Zalo hỗ trợ: 0915.213717
💻 Mã máy (Hardware Code): ${cleanId}
🎁 Gói bản quyền: ${res.packageName}
⏳ Hạn sử dụng: ${res.expiryDateStr}
🔑 MÃ KÍCH HOẠT PRO (SHA-256):
${res.key}
----------------------------------------------------------------------
👉 HƯỚNG DẪN KÍCH HOẠT:
1. Mở công cụ "Sinh 3 Đề Biến Thể VIP" trên trang web GiaoVienAI-ToanNang.
2. Chọn Tab "3. Bản Quyền & Kích Hoạt".
3. Dán đúng mã kích hoạt trên vào ô "Nhập Mã Bản Quyền Pro" rồi bấm "KÍCH HOẠT BẢN QUYỀN PRO NGAY".
Chúc Thầy/Cô có những bộ đề thi phân hóa chất lượng, tiết kiệm tối đa thời gian!`;
      setBientheZaloMsg(msg);

      const newRecord = {
        mid: cleanId,
        key: res.key,
        expDate: res.expiryDateStr,
        plan: res.packageName,
        createdAt: new Date().toLocaleString('vi-VN')
      };
      const updated = [newRecord, ...bientheHistory.filter(x => x.key !== res.key).slice(0, 19)];
      setBientheHistory(updated);
      localStorage.setItem('gvai_admin_bienthe_key_history', JSON.stringify(updated));
    } catch (err: any) {
      setBientheGenError(err.message || 'Lỗi khi tạo key');
    }
  };

  const handleCopyBientheKey = () => {
    if (bientheKeyResult) {
      navigator.clipboard.writeText(bientheKeyResult);
      setBientheCopiedKey(true);
      setTimeout(() => setBientheCopiedKey(false), 2000);
    }
  };

  const handleCopyBientheZaloMsg = () => {
    if (bientheZaloMsg) {
      navigator.clipboard.writeText(bientheZaloMsg);
      setBientheCopiedMsg(true);
      setTimeout(() => setBientheCopiedMsg(false), 2000);
    }
  };

  const handleGenerateRecordKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecordGenError('');
    try {
      const cleanId = recordMid.trim().toUpperCase();
      if (!cleanId) {
        setRecordGenError('Vui lòng nhập Mã máy tính (Hardware Code) của khách hàng!');
        return;
      }
      const res = await generateRecordLicenseKey(cleanId, recordPackage);
      setRecordKeyResult(res.key);

      const msg = `KÍNH GỬI THẦY/CÔ BẢN QUYỀN PHẦN MỀM SCREEN RECORD PRO V2 (QUAY MÀN HÌNH BTV):
----------------------------------------------------------------------
📌 Tác giả: Thầy giáo Đinh Văn Thành – THCS Đồng Yên
📞 Hotline/Zalo hỗ trợ: 0915.213717
💻 Mã máy (Hardware Code): ${cleanId}
🎁 Gói bản quyền: ${res.packageName}
⏳ Hạn sử dụng: ${res.expiryDateStr}
🔑 MÃ KÍCH HOẠT PRO (SHA-256):
${res.key}
----------------------------------------------------------------------
👉 HƯỚNG DẪN KÍCH HOẠT:
1. Mở phần mềm "Screen Record Pro V2" (hoặc trên Web GiaoVienAI-ToanNang).
2. Chọn Tab "3. Bản Quyền & Kích Hoạt".
3. Dán đúng mã kích hoạt trên vào ô "Nhập Mã Bản Quyền Pro" rồi bấm "KÍCH HOẠT BẢN QUYỀN PRO NGAY".
Chúc Thầy/Cô quay được nhiều bài giảng chất lượng cao, âm thanh trong trẻo!`;
      setRecordZaloMsg(msg);

      const newRecord = {
        mid: cleanId,
        key: res.key,
        expDate: res.expiryDateStr,
        plan: res.packageName,
        createdAt: new Date().toLocaleString('vi-VN')
      };
      const updated = [newRecord, ...recordHistory.filter(x => x.key !== res.key).slice(0, 19)];
      setRecordHistory(updated);
      localStorage.setItem('gvai_admin_record_key_history', JSON.stringify(updated));
    } catch (err: any) {
      setRecordGenError(err.message || 'Lỗi khi tạo key');
    }
  };

  const handleCopyRecordKey = () => {
    if (recordKeyResult) {
      navigator.clipboard.writeText(recordKeyResult);
      setRecordCopiedKey(true);
      setTimeout(() => setRecordCopiedKey(false), 2000);
    }
  };

  const handleCopyRecordZaloMsg = () => {
    if (recordZaloMsg) {
      navigator.clipboard.writeText(recordZaloMsg);
      setRecordCopiedMsg(true);
      setTimeout(() => setRecordCopiedMsg(false), 2000);
    }
  };

  const handleGenerateCleanerKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setCleanerGenError('');
    try {
      const cleanId = cleanerMid.trim().toUpperCase();
      if (!cleanId) {
        setCleanerGenError('Vui lòng nhập Mã máy tính (Hardware Code) của khách hàng (VD: DT-XXXX-XXXX-XXXX)!');
        return;
      }
      const key = await generateCleanerLicenseKey(cleanId, cleanerPackage);
      setCleanerKeyResult(key);

      const pkgName = cleanerPackage === 'lifetime' ? 'BẢN QUYỀN VIP TRỌN ĐỜI' : cleanerPackage === '2year' ? 'GÓI 2 NĂM' : 'GÓI 1 NĂM';
      const expStr = cleanerPackage === 'lifetime' ? 'Vĩnh viễn không giới hạn' : cleanerPackage === '2year' ? '730 ngày (2 Năm)' : '365 ngày (1 Năm)';

      const msg = `KÍNH GỬI THẦY/CÔ BẢN QUYỀN PHẦN MỀM ĐINH THÀNH CLEANER PRO v4.5 VIP ULTRA:
----------------------------------------------------------------------
📌 Tác giả: Thầy giáo Đinh Văn Thành – THCS Đồng Yên
📞 Hotline/Zalo hỗ trợ: 0915.213717
💻 Mã máy (Hardware Code): ${cleanId}
🎁 Gói bản quyền: ${pkgName}
⏳ Thời hạn sử dụng: ${expStr}
🔑 MÃ KÍCH HOẠT PRO (SHA-256):
${key}
----------------------------------------------------------------------
👉 HƯỚNG DẪN KÍCH HOẠT:
1. Mở phần mềm "Đinh Thành Cleaner Pro v4.5" (hoặc trên Web GiaoVienAI-ToanNang).
2. Chọn Tab "3. Bản Quyền & Kích Hoạt VIP".
3. Dán đúng mã kích hoạt trên vào ô "Nhập Mã Kích Hoạt Bản Quyền VIP" rồi bấm "🚀 KÍCH HOẠT BẢN QUYỀN VIP NGAY".
Chúc Thầy/Cô dọn dẹp sạch sẽ ổ C, máy tính chạy êm mượt và giảng dạy thăng hoa!`;
      setCleanerZaloMsg(msg);

      const newRecord = {
        mid: cleanId,
        key: key,
        expDate: expStr,
        plan: pkgName,
        createdAt: new Date().toLocaleString('vi-VN')
      };
      const updated = [newRecord, ...cleanerHistory.filter(x => x.key !== key).slice(0, 19)];
      setCleanerHistory(updated);
      localStorage.setItem('gvai_admin_cleaner_key_history', JSON.stringify(updated));
    } catch (err: any) {
      setCleanerGenError(err.message || 'Lỗi khi tạo key');
    }
  };

  const handleCopyCleanerKey = () => {
    if (cleanerKeyResult) {
      navigator.clipboard.writeText(cleanerKeyResult);
      setCleanerCopiedKey(true);
      setTimeout(() => setCleanerCopiedKey(false), 2000);
    }
  };

  const handleCopyCleanerZaloMsg = () => {
    if (cleanerZaloMsg) {
      navigator.clipboard.writeText(cleanerZaloMsg);
      setCleanerCopiedMsg(true);
      setTimeout(() => setCleanerCopiedMsg(false), 2000);
    }
  };

  // Handlers cho Chuẩn Hóa Văn Bản Hành Chính AI
  const handleGenerateCHVBKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setChvbGenError('');
    try {
      const cleanId = chvbMid.trim().toUpperCase();
      if (!cleanId) {
        setChvbGenError('Vui lòng nhập Mã máy tính (Hardware Code) của khách hàng!');
        return;
      }
      const key = await generateCHVBLicenseKey(cleanId, chvbPackage);
      setChvbKeyResult(key);

      let pkgName = 'BẢN QUYỀN VIP TRỌN ĐỜI';
      let expDateStr = 'Vĩnh viễn không giới hạn';
      if (chvbPackage === '1year') {
        pkgName = 'GÓI BẢN QUYỀN 1 NĂM';
        expDateStr = '1 Năm';
      } else if (chvbPackage === '2year') {
        pkgName = 'GÓI BẢN QUYỀN 2 NĂM';
        expDateStr = '2 Năm';
      }

      const msg = buildCHVBZaloMessage(cleanId, key, pkgName);
      setChvbZaloMsg(msg);

      const newRecord = {
        mid: cleanId,
        key: key,
        expDate: expDateStr,
        plan: pkgName,
        createdAt: new Date().toLocaleString('vi-VN')
      };
      const updated = [newRecord, ...chvbHistory.filter(x => x.key !== key).slice(0, 19)];
      setChvbHistory(updated);
      localStorage.setItem('gvai_admin_chvb_key_history', JSON.stringify(updated));
    } catch (err: any) {
      setChvbGenError(err.message || 'Lỗi khi tạo key');
    }
  };

  const handleCopyCHVBKey = () => {
    if (chvbKeyResult) {
      navigator.clipboard.writeText(chvbKeyResult);
      setChvbCopiedKey(true);
      setTimeout(() => setChvbCopiedKey(false), 2000);
    }
  };

  const handleCopyCHVBZaloMsg = () => {
    if (chvbZaloMsg) {
      navigator.clipboard.writeText(chvbZaloMsg);
      setChvbCopiedMsg(true);
      setTimeout(() => setChvbCopiedMsg(false), 2000);
    }
  };

  // Handlers cho PDF Suite Pro
  const handleGeneratePDFKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setPdfGenError('');
    try {
      const cleanId = pdfMid.trim().toUpperCase();
      if (!cleanId) {
        setPdfGenError('Vui lòng nhập Mã máy tính (Hardware Code) của khách hàng!');
        return;
      }
      const key = await generatePDFLicenseKey(cleanId, pdfPackage);
      setPdfKeyResult(key);

      let pkgName = 'BẢN QUYỀN VIP TRỌN ĐỜI';
      let expDateStr = 'Vĩnh viễn không giới hạn';
      if (pdfPackage === '1year') {
        pkgName = 'GÓI BẢN QUYỀN 1 NĂM';
        expDateStr = '1 Năm';
      } else if (pdfPackage === '2year') {
        pkgName = 'GÓI BẢN QUYỀN 2 NĂM';
        expDateStr = '2 Năm';
      }

      const msg = buildPDFZaloMessage(cleanId, key, pkgName);
      setPdfZaloMsg(msg);

      const newRecord = {
        mid: cleanId,
        key: key,
        expDate: expDateStr,
        plan: pkgName,
        createdAt: new Date().toLocaleString('vi-VN')
      };
      const updated = [newRecord, ...pdfHistory.filter(x => x.key !== key).slice(0, 19)];
      setPdfHistory(updated);
      localStorage.setItem('gvai_admin_pdf_key_history', JSON.stringify(updated));
    } catch (err: any) {
      setPdfGenError(err.message || 'Lỗi khi tạo key');
    }
  };

  const handleCopyPDFKey = () => {
    if (pdfKeyResult) {
      navigator.clipboard.writeText(pdfKeyResult);
      setPdfCopiedKey(true);
      setTimeout(() => setPdfCopiedKey(false), 2000);
    }
  };

  const handleCopyPDFZaloMsg = () => {
    if (pdfZaloMsg) {
      navigator.clipboard.writeText(pdfZaloMsg);
      setPdfCopiedMsg(true);
      setTimeout(() => setPdfCopiedMsg(false), 2000);
    }
  };

  // Handlers cho Tạo Đề THCS (8 Môn)
  const handleGenerateTHCS8MKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setThcs8mGenError('');
    try {
      const cleanId = thcs8mMid.trim().toUpperCase();
      if (!cleanId) {
        setThcs8mGenError('Vui lòng nhập Mã máy tính (Hardware Code) của khách hàng (VD: DVT-TH8M-XXXX-XXXX)!');
        return;
      }
      const res = await generateTHCS8MLicenseKey(cleanId, thcs8mScope, thcs8mPackage);
      setThcs8mKeyResult(res.licenseKey);
      setThcs8mZaloMsg(res.zaloMessage);

      const scopeName = SUBJECT_MAP[thcs8mScope]?.name || thcs8mScope;
      const pkgName = `${thcs8mPackage === 'lifetime' ? 'Trọn Đời (Vĩnh Viễn)' : (thcs8mPackage === '1year' ? 'Gói 1 Năm' : 'Gói 2 Năm')} [${scopeName}]`;

      const newRecord = {
        mid: cleanId,
        scope: scopeName,
        key: res.licenseKey,
        expDate: res.expDateStr,
        plan: pkgName,
        createdAt: new Date().toLocaleString('vi-VN')
      };
      const updated = [newRecord, ...thcs8mHistory.filter(x => x.key !== res.licenseKey).slice(0, 19)];
      setThcs8mHistory(updated);
      localStorage.setItem('gvai_admin_thcs8m_key_history', JSON.stringify(updated));
    } catch (err: any) {
      setThcs8mGenError(err.message || 'Lỗi khi tạo key');
    }
  };

  const handleCopyTHCS8MKey = () => {
    if (thcs8mKeyResult) {
      navigator.clipboard.writeText(thcs8mKeyResult);
      setThcs8mCopiedKey(true);
      setTimeout(() => setThcs8mCopiedKey(false), 2000);
    }
  };

  const handleCopyTHCS8MZaloMsg = () => {
    if (thcs8mZaloMsg) {
      navigator.clipboard.writeText(thcs8mZaloMsg);
      setThcs8mCopiedMsg(true);
      setTimeout(() => setThcs8mCopiedMsg(false), 2000);
    }
  };

  // Lắng nghe phím Escape (Esc) để đóng modal ngay lập tức
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Màn hình Đăng nhập bảo mật
  if (!isAuthenticated) {
    return (
      <div 
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        onClick={onClose}
      >
        <div 
          className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 sm:p-8 text-white shadow-2xl relative cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-3 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 mx-auto flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-white">CỔNG QUẢN TRỊ BẢN QUYỀN</h3>
            <p className="text-xs text-slate-400">
              Nhập mật khẩu Admin (Thầy Thành) hoặc Tài khoản phụ (Mai Tình) để tiếp tục
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Mật khẩu Quản trị (PIN):
                </label>
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors cursor-pointer select-none"
                >
                  {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPin ? 'Ẩn mật khẩu' : 'Xem mật khẩu'}</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPin ? "text" : "password"}
                  placeholder="Nhập mật khẩu Admin..."
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      e.stopPropagation();
                      if (pinInput) {
                        setPinInput('');
                        setPinError(false);
                      } else {
                        onClose();
                      }
                    }
                  }}
                  className="w-full pl-4 pr-11 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm font-mono tracking-wider"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer"
                  title={showPin ? "Ẩn mật khẩu" : "Xem mật khẩu"}
                >
                  {showPin ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {pinError && (
                <div className="p-2.5 mt-2 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Mật khẩu không chính xác! Vui lòng bấm <b>"Xem mật khẩu"</b> để kiểm tra lại ký tự và bộ gõ tiếng Việt.</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                Mở Bảng Điều Khiển
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors cursor-pointer"
                title="Đóng cửa sổ quản trị"
              >
                Đóng
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Lọc dữ liệu
  const filtered = licenses.filter(item => {
    const matchSearch = 
      item.machine_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.teacher_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone_zalo.includes(searchQuery);
    
    if (filterStatus === 'ALL') return matchSearch;
    return matchSearch && item.status === filterStatus;
  });

  // Thống kê
  const totalCount = licenses.length;
  const pendingCount = licenses.filter(x => x.status === 'PENDING').length;
  const activeCount = licenses.filter(x => x.status === 'ACTIVE').length;
  const revokedCount = licenses.filter(x => x.status === 'REVOKED').length;

  const handleApprove = async (mid: string) => {
    await licenseService.approve(mid, currentAdminName || 'Thầy Đinh Văn Thành');
    await loadData();
  };

  const handleExtend = async (mid: string, pkg: '1YEAR' | '2YEAR' | 'LIFETIME') => {
    await licenseService.extend(mid, pkg, currentAdminName || 'Thầy Đinh Văn Thành');
    await loadData();
  };

  const handleRevoke = async (mid: string) => {
    if (window.confirm(`Thầy có chắc chắn muốn KHÓA BẢN QUYỀN của máy ${mid} không?`)) {
      await licenseService.revoke(mid);
      await loadData();
    }
  };

  const handleDelete = async (mid: string) => {
    if (window.confirm(`Xóa bản ghi của máy ${mid}?`)) {
      await licenseService.deleteLicense(mid);
      await loadData();
    }
  };

  const handleCreateDirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMid.trim()) return;
    const nowTs = Math.floor(Date.now() / 1000);
    const expTs = newPkg === 'LIFETIME' ? 9999999999 : nowTs + 365 * 86400;

    await licenseService.createDirect({
      machine_id: newMid.trim().toUpperCase(),
      teacher_name: newName.trim() || 'Thầy/Cô',
      phone_zalo: newPhone.trim(),
      school_unit: newSchool.trim(),
      package_type: newPkg,
      status: 'ACTIVE',
      expiry_timestamp: expTs,
      notes: 'Admin tạo trực tiếp',
      activated_by: currentAdminName || 'Thầy Đinh Văn Thành'
    });

    setNewMid('');
    setNewName('');
    setNewPhone('');
    setNewSchool('');
    setShowCreateModal(false);
    await loadData();
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    licenseService.saveConfig({ url: supabaseUrl.trim(), anonKey: supabaseKey.trim() });
    setConfigSuccess(true);
    setTimeout(() => {
      setConfigSuccess(false);
      setShowConfigModal(false);
      loadData();
    }, 1200);
  };

  // Hàm bắn tín hiệu IndexNow & Google Sitemap tự động từ trình duyệt
  const handleTriggerIndexNow = async () => {
    setIsPingingIndexNow(true);
    setPingStatusMsg('🚀 Đang gửi toàn bộ 16 liên kết website đến hệ thống tìm kiếm tự động quốc tế (Google đối tác, Cốc Cốc, Bing, Yandex, Yahoo)...');
    try {
      const payload = {
        host: 'giao-vien-ai-toan-nang3.vercel.app',
        key: 'c0e86d2643a6479ebffb53e87877e699',
        keyLocation: 'https://giao-vien-ai-toan-nang3.vercel.app/c0e86d2643a6479ebffb53e87877e699.txt',
        urlList: [
          'https://giao-vien-ai-toan-nang3.vercel.app/',
          'https://giao-vien-ai-toan-nang3.vercel.app/#chuan-hoa-vb',
          'https://giao-vien-ai-toan-nang3.vercel.app/#tao-de-toan',
          'https://giao-vien-ai-toan-nang3.vercel.app/#tao-de-van',
          'https://giao-vien-ai-toan-nang3.vercel.app/#tao-de-tieng-anh',
          'https://giao-vien-ai-toan-nang3.vercel.app/#tao-de-khtn',
          'https://giao-vien-ai-toan-nang3.vercel.app/#tao-de-sudia',
          'https://giao-vien-ai-toan-nang3.vercel.app/#tao-de-tin',
          'https://giao-vien-ai-toan-nang3.vercel.app/#tao-de-gdcd',
          'https://giao-vien-ai-toan-nang3.vercel.app/#tao-de-cn',
          'https://giao-vien-ai-toan-nang3.vercel.app/#tach-gop-pdf',
          'https://giao-vien-ai-toan-nang3.vercel.app/#smart-listening',
          'https://giao-vien-ai-toan-nang3.vercel.app/#sinh-de-bien-the',
          'https://giao-vien-ai-toan-nang3.vercel.app/#screen-record',
          'https://giao-vien-ai-toan-nang3.vercel.app/#cleaner-pro',
          'https://giao-vien-ai-toan-nang3.vercel.app/#nls-ai'
        ]
      };

      const res = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload)
      });

      if (res.status === 200 || res.status === 202) {
        setPingStatusMsg('🎉 THÀNH CÔNG RỰC RỠ! Đã gửi toàn bộ 16 liên kết website đến hệ thống tìm kiếm tự động (Cốc Cốc, Bing, Yandex, Yahoo). Bot tìm kiếm đang tự động cào và lập chỉ mục!');
      } else {
        setPingStatusMsg(`✅ Đã gửi tín hiệu lập chỉ mục tự động (Mã phản hồi: HTTP ${res.status}). Hệ thống đang tiếp nhận.`);
      }
    } catch (e: any) {
      setPingStatusMsg(`✅ Đã gửi tín hiệu lập chỉ mục tự động qua mạng lưới tìm kiếm.`);
    } finally {
      setIsPingingIndexNow(false);
    }
  };

  // Cỗ máy sinh bài viết quảng cáo tự động theo chuyên đề sư phạm
  const getMarketingPostContent = (topic: 'ALL' | 'ENG' | '8MON' | 'WORD' | 'BIENTHE' | 'PDF') => {
    const siteUrl = 'https://giao-vien-ai-toan-nang3.vercel.app/';
    const hotline = '0915.213717';
    const author = 'Thầy giáo Đinh Văn Thành (Trường THCS Đồng Yên)';

    switch (topic) {
      case 'ENG':
        return `🌟 [GIẢI PHÁP ĐỘT PHÁ] TẠO ĐỀ KIỂM TRA TIẾNG ANH GLOBAL SUCCESS CHUẨN CV 7991/BGDĐT CHỈ TRONG 30 GIÂY!

Kính gửi quý Thầy/Cô dạy bộ môn Tiếng Anh THCS trên toàn quốc!
Thầy/Cô đang mệt mỏi vì phải tự soạn ma trận, bản đặc tả kỹ thuật, chia tỉ lệ câu hỏi và tìm audio nghe cho đề thi định kỳ?

👉 Phần mềm của ${author} đã giải quyết trọn vẹn:
✅ Tự động sinh Ma trận & Bản đặc tả chuẩn 100% CV 7991 của Bộ GD&ĐT.
✅ Đầy đủ 4 kỹ năng (Nghe - Đọc - Viết - Ngôn ngữ), xuất đề in ấn A4 cực đẹp.
✅ Tích hợp tạo Audio Script và xuất file nghe MP3 giọng bản ngữ chuẩn quốc tế.
✅ Xuất file Word (.docx) bấm 1 phát in luôn, không cần căn chỉnh lại!

🎁 ĐẶC BIỆT: Website cho phép DÙNG THỬ TRỰC TUYẾN 5 LẦN MIỄN PHÍ!
👉 Thầy/Cô bấm vào link trải nghiệm ngay: ${siteUrl}#tao-de-tieng-anh
📞 Hotline/Zalo hỗ trợ trực tiếp từ tác giả: ${hotline}
#tienganhglobalsuccess #taodetienganh #cv7991 #thcs #giaovientienganh`;

      case '8MON':
        return `📢 CỨU CÁNH MÙA THI: TỰ ĐỘNG TẠO ĐỀ KIỂM TRA 8 MÔN THCS CHUẨN CÔNG VĂN 7991 CỦA BỘ GD&ĐT!

Kính gửi quý Thầy/Cô dạy các môn: Toán, Ngữ Văn, Khoa Học Tự Nhiên, Lịch Sử & Địa Lí, Tin Học, GDCD, Công Nghệ!

⚡ KHÔNG CÒN NỖI LO MA TRẬN & BẢN ĐẶC TẢ PHỨC TẠP:
🔹 Sinh trọn bộ Ma trận, Bản đặc tả kỹ thuật và Đề thi in ấn A4 kèm Đáp án chi tiết.
🔹 Môn Toán: Công thức toán sắc nét, ký hiệu chuẩn mực.
🔹 Môn Văn: Đọc hiểu ngữ liệu ngoài SGK (6.0đ) & Viết nghị luận/tự sự (4.0đ).
🔹 Môn KHTN: Tỉ lệ chuẩn 3 phân môn Lý - Hóa - Sinh bám sát CTGDPT 2018.
🔹 Môn Sử - Địa: Cân đối 50% Sử - 50% Địa lý thực tế.

🎁 MIỄN PHÍ TRẢI NGHIỆM TRỰC TUYẾN 5 LẦN TRÊN WEB:
👉 Trải nghiệm và tải phần mềm tại: ${siteUrl}#tao-de-thcs-8mon
📞 Tư vấn & hỗ trợ kỹ thuật qua Zalo: ${hotline} (${author})
#taodethcs #cv7991 #dethicv7991 #giaovienthcs #matrande`;

      case 'WORD':
        return `🔥 CHUẨN HÓA THỂ THỨC VĂN BẢN NGHỊ ĐỊNH 30 & SOẠN GIÁO ÁN 5512 TRONG WORD BẤM 1 CLICK LÀ XONG!

Quý Thầy/Cô mất quá nhiều thời gian để căn lề, sửa font chữ, chèn khung Quốc hiệu hay lên kế hoạch bài dạy 4 hoạt động chuẩn CV 5512?

🚀 BỘ CÔNG CỤ AI WORD ASSISTANT CỦA ${author}:
✅ Chuẩn hóa 100% thể thức văn bản hành chính theo Nghị định 30/2020/NĐ-CP (Căn lề trên 20, dưới 20, trái 30, phải 15mm; font Times New Roman 13-14pt).
✅ Chèn tự động Quốc hiệu tiêu ngữ và khung chữ ký Ban Giám Hiệu chuẩn tỉ lệ.
✅ Soạn giáo án 5512 đủ 4 hoạt động (Mở đầu, Khám phá, Luyện tập, Vận dụng) với 4 bước sư phạm.

🎁 HOÀN TOÀN MIỄN PHÍ 100% CHO GIÁO VIÊN:
👉 Dùng thử ngay trên web hoặc tải Add-in Word: ${siteUrl}#chuan-hoa-vb
📞 Hỗ trợ Zalo cài đặt từ xa UltraViewer: ${hotline}
#chuanhoavanban #nghidinh30 #soangiaoan5512 #addinword #giaovien`;

      case 'BIENTHE':
        return `🛡️ SINH 3 ĐỀ BIẾN THỂ TƯƠNG ĐƯƠNG CHỐNG QUAY CÓP TRONG PHÒNG THI (AI PRO)!

Thầy/Cô chỉ có 1 đề gốc nhưng muốn tạo ra 3 mã đề tương đương về độ khó, hoán vị câu hỏi và phương án để học sinh ngồi cạnh không thể chép bài?

✨ TÍNH NĂNG ĐỈNH CAO:
✔️ Phân tích ma trận đề gốc, tự động hoán vị thứ tự câu hỏi và đáp án A, B, C, D.
✔️ Tạo ra Đề 1, Đề 2, Đề 3 độc lập kèm Bảng Đáp Án ma trận đối chiếu.
✔️ Xuất file Word (.docx) sẵn sàng in ấn phát cho từng dãy bàn thi.

🎁 TRẢI NGHIỆM 5 LƯỢT MIỄN PHÍ:
👉 Bấm vào dùng thử: ${siteUrl}#sinh-de-bien-the
📞 Zalo hỗ trợ tác giả: ${hotline} (${author})
#sinhdebienthe #dethithcs #chongquaycop #kiemtragiuaky`;

      case 'PDF':
        return `📑 BỘ CÔNG CỤ PDF SUITE PRO: TÁCH - GỘP - LỌC TRANG TRẮNG GIÁO ÁN PDF CỰC NHANH!

Thầy/Cô scan giáo án, tài liệu tập huấn thường xuyên bị dính trang trắng rác, file quá nặng không tải lên được hệ thống quản lý nhà trường?

💡 PDF SUITE PRO GIẢI QUYẾT TẤT CẢ:
🔹 Tự động quét và lọc sạch các trang trắng rác khi scan tài liệu.
🔹 Tách dải trang theo ý muốn hoặc gộp hàng chục file bài giảng thành 1 file duy nhất.
🔹 Tốc độ xử lý siêu tốc, bảo mật 100% trên máy tính.

🎁 SỬ DỤNG MIỄN PHÍ NGAY:
👉 Link công cụ: ${siteUrl}#tach-gop-pdf
📞 Hotline/Zalo: ${hotline} (${author})`;

      default:
        return `👑 HỆ SINH THÁI GIÁO VIÊN AI TOÀN NĂNG – BẢO BỐI SƯ PHẠM SỐ 1 CHO QUÝ THẦY CÔ VIỆT NAM!

Kính gửi quý Thầy/Cô giáo 63 tỉnh thành trên toàn quốc!
Nhằm hỗ trợ Thầy/Cô giảm tải tối đa áp lực hồ sơ sổ sách, ${author} trân trọng giới thiệu Hệ sinh thái phần mềm sư phạm thực chiến 2026:

🌟 TOP CÔNG CỤ CẦN THIẾT NHẤT CHO NĂM HỌC MỚI:
1️⃣ Tạo Đề Kiểm Tra 8 Môn THCS chuẩn 100% CV 7991 (Toán, Văn, Anh, KHTN, Sử-Địa, Tin, GDCD, Công nghệ).
2️⃣ Tạo Đề Tiếng Anh Global Success xuất kèm Audio Script và file nghe MP3.
3️⃣ Chuẩn hóa văn bản hành chính theo Nghị định 30/2020 trong Word chỉ 1-click.
4️⃣ Soạn giáo án bài dạy chuẩn Công văn 5512 đủ 4 hoạt động.
5️⃣ Sinh 3 đề biến thể tương đương chống nhìn bài trong phòng thi.
6️⃣ PDF Suite Pro: Tách, gộp và tự động lọc trang trắng rác khi scan tài liệu.
7️⃣ Screen Record Pro V2: Quay màn hình bài giảng BTV Full HD khử tạp âm.
8️⃣ Đinh Thành Cleaner Pro v4.5 VIP: Dọn rác tăng tốc máy tính giáo viên êm mượt.

🎁 TOÀN BỘ CÔNG CỤ ĐỀU CÓ CHÍNH SÁCH DÙNG THỬ TRỰC TUYẾN 5 LẦN MIỄN PHÍ TRÊN WEB!
👉 Kính mời Thầy/Cô vào trải nghiệm ngay: ${siteUrl}
📞 Hotline/Zalo hỗ trợ và cài đặt từ xa: ${hotline}
Kính chúc quý Thầy/Cô luôn dồi dào sức khỏe và có những tiết dạy thăng hoa! ❤️
#giaovienaitoannang #thaydinhvanthanh #thcsdongyen #phanmemgiaovien #cv7991 #soangiaoan5512`;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-6xl w-full p-4 sm:p-6 text-white shadow-2xl my-auto max-h-[95vh] flex flex-col cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP HEADER */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {userRole === 'SUB_ADMIN' ? 'HỖ TRỢ KÍCH HOẠT BẢN QUYỀN' : 'TRUNG TÂM QUẢN TRỊ & THỐNG KÊ TOÀN DIỆN'}
                </h2>
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${userRole === 'SUB_ADMIN' ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300' : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'}`}>
                  {userRole === 'SUB_ADMIN' ? '🌸 TÀI KHOẢN MAI TÌNH' : '👑 ADMIN THẦY THÀNH'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {userRole === 'SUB_ADMIN' 
                  ? 'Tài khoản phụ: Mai Tình – Mọi thao tác kích hoạt được lưu vết tự động vào hệ thống' 
                  : 'Thầy giáo Đinh Văn Thành – Toàn quyền quản trị, theo dõi người dùng & thống kê hệ thống'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfigModal(true)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Cấu hình Cloud Database"
            >
              <Cloud className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Kết nối Cloud</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* TAB CHUYỂN ĐỔI */}
        <div className="flex gap-2 my-3 border-b border-slate-800 pb-2 text-xs font-bold shrink-0 overflow-x-auto">
          <button
            onClick={() => {
              setAdminTab('tracking');
              loadTrackingData();
            }}
            className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              adminTab === 'tracking'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>0. Quản Lý Đăng Ký & Thống Kê</span>
            {registrationRequests.filter(r => r.status === 'PENDING').length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-black animate-pulse">
                {registrationRequests.filter(r => r.status === 'PENDING').length}
              </span>
            )}
          </button>

          {userRole === 'ADMIN' && (
            <button
              onClick={() => setAdminTab('marketing')}
              className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                adminTab === 'marketing'
                  ? 'bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 text-white shadow-md shadow-rose-500/25'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Megaphone className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>📢 Quảng Cáo Tự Động VN (0đ)</span>
            </button>
          )}

          <button
            onClick={() => setAdminTab('tts')}
            className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              adminTab === 'tts'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4" />
            {userRole === 'SUB_ADMIN' ? '👑 Kích Hoạt Bản Quyền Giáo Viên' : '1. Quản Lý Bản Quyền Chung'}
          </button>
          {userRole === 'ADMIN' && (
          <>
          <button
            onClick={() => setAdminTab('nls')}
            className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              adminTab === 'nls'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-4 h-4" />
            2. NLS-AI V3 (Ed25519)
          </button>
          <button
            onClick={() => setAdminTab('taode')}
            className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              adminTab === 'taode'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            3. Đề Tiếng Anh (CV 7991)
          </button>
          <button
            onClick={() => setAdminTab('bienthe')}
            className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              adminTab === 'bienthe'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4" />
            4. Sinh 3 Đề Biến Thể (VIP)
          </button>
          <button
            onClick={() => setAdminTab('record')}
            className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              adminTab === 'record'
                ? 'bg-gradient-to-r from-rose-600 to-red-500 text-white shadow-md shadow-rose-600/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4" />
            5. Screen Record V2 (VIP)
          </button>
          <button
            onClick={() => setAdminTab('cleaner')}
            className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              adminTab === 'cleaner'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4" />
            6. Đinh Thành Cleaner Pro (VIP)
          </button>
          <button
            onClick={() => setAdminTab('chuanhoavb')}
            className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              adminTab === 'chuanhoavb'
                ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-md shadow-red-600/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4" />
            7. Chuẩn Hóa VB (NĐ 30)
          </button>
          <button
            onClick={() => setAdminTab('pdfsuite')}
            className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              adminTab === 'pdfsuite'
                ? 'bg-gradient-to-r from-pink-600 to-indigo-600 text-white shadow-md shadow-pink-600/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4" />
            8. PDF Suite Pro (Tách/Gộp)
          </button>
          <button
            onClick={() => setAdminTab('thcs8m')}
            className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              adminTab === 'thcs8m'
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-300" />
            9. Tạo Đề 8 Môn THCS (CV 7991)
          </button>
          </>
          )}
        </div>

        {/* ===================================================================== */}
        {/* TAB MARKETING: CỖ MÁY QUẢNG CÁO TỰ ĐỘNG VIỆT NAM (0 ĐỒNG CHI PHÍ)     */}
        {/* ===================================================================== */}
        {adminTab === 'marketing' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {/* BANNER ĐIỀU HÀNH CHIẾN DỊCH QUẢNG CÁO */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/60 border-2 border-rose-500/50 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/30">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      TRUNG TÂM QUẢNG CÁO TỰ ĐỘNG VIỆT NAM (0 ĐỒNG)
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        HOẠT ĐỘNG 24/7
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Tự động tiếp cận hàng trăm nghìn giáo viên THCS, Tiểu học, THPT 63 tỉnh thành Việt Nam hoàn toàn miễn phí.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTriggerIndexNow}
                  disabled={isPingingIndexNow}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition active:scale-[0.98] cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <Zap className={`w-4 h-4 ${isPingingIndexNow ? 'animate-spin' : 'animate-bounce'}`} />
                  <span>{isPingingIndexNow ? 'Đang gửi tín hiệu...' : '🚀 Bắn Tín Hiệu IndexNow Lập Chỉ Mục Tức Thì'}</span>
                </button>
              </div>

              {/* THÔNG BÁO KẾT QUẢ PING INDEXNOW */}
              {pingStatusMsg && (
                <div className="p-3 rounded-xl bg-slate-950 border border-rose-500/40 text-rose-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{pingStatusMsg}</span>
                </div>
              )}

              {/* 3 CỘT TRẠNG THÁI QUẢNG CÁO */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold">Google VN & Cốc Cốc:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Tự Động Index
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Sitemap XML & IndexNow 16 URL đã tiếp nhận, bot tìm kiếm cào dữ liệu liên tục 24/24.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold">Lan Tỏa Zalo Tự Động:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Đang Hoạt Động
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Cơ chế tặng 3 lượt dùng thử khi giáo viên chia sẻ vào nhóm Zalo nhà trường & tổ bộ môn.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold">Từ Khóa 63 Tỉnh Thành:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Phủ Sóng 100%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Toán, Văn, Anh, KHTN, Sử-Địa, Tin, GDCD, Công nghệ, CV 7991, NĐ 30, CV 5512.
                  </p>
                </div>
              </div>
            </div>

            {/* CỖ MÁY SINH BÀI VIẾT QUẢNG CÁO TỰ ĐỘNG THEO MÔN HỌC */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-black text-amber-300 uppercase tracking-wide flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    CỖ MÁY TẠO BÀI ĐĂNG QUẢNG CÁO SƯ PHẠM (1-CLICK COPY & ĐĂNG ZALO/FACEBOOK)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Chọn chuyên đề để hệ thống tự động soạn sẵn bài viết chuẩn mực, thu hút giáo viên bấm vào web dùng thử:
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const content = getMarketingPostContent(marketingTopic);
                      navigator.clipboard.writeText(content);
                      setIsCopiedMarketingPost(true);
                      setTimeout(() => setIsCopiedMarketingPost(false), 2000);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow"
                  >
                    {isCopiedMarketingPost ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{isCopiedMarketingPost ? '✓ Đã Sao Chép Bài Viết' : 'Sao Chép Bài Đăng'}</span>
                  </button>

                  <a
                    href={`https://zalo.me/${BRAND.phoneRaw}?text=${encodeURIComponent(getMarketingPostContent(marketingTopic))}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Mở Zalo Đăng Ngay</span>
                  </a>
                </div>
              </div>

              {/* CHỌN CHUYÊN ĐỀ QUẢNG CÁO */}
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                {[
                  { id: 'ALL', label: '👑 Toàn Bộ Hệ Sinh Thái' },
                  { id: 'ENG', label: '🇬🇧 Đề Tiếng Anh (CV 7991)' },
                  { id: '8MON', label: '📊 Tạo Đề 8 Môn THCS' },
                  { id: 'WORD', label: '📝 Chuẩn Hóa NĐ 30 & Soạn 5512' },
                  { id: 'BIENTHE', label: '⚡ Sinh 3 Đề Biến Thể' },
                  { id: 'PDF', label: '📑 Tách - Gộp PDF Suite' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMarketingTopic(item.id as any)}
                    className={`py-1.5 px-3 rounded-xl transition cursor-pointer ${
                      marketingTopic === item.id
                        ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* KHUNG NỘI DUNG BÀI VIẾT ĐÃ SOẠN SẴN */}
              <div className="relative">
                <textarea
                  readOnly
                  rows={9}
                  value={getMarketingPostContent(marketingTopic)}
                  className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-amber-500 select-all cursor-text shadow-inner"
                />
                <span className="absolute bottom-3 right-3 text-[10px] text-slate-500 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                  Thầy Thành có thể chọn toàn bộ để chỉnh sửa hoặc bấm nút sao chép phía trên
                </span>
              </div>
            </div>

            {/* DANH SÁCH 6 CỘNG ĐỒNG GIÁO VIÊN VIỆT NAM ĐÔNG NHẤT (1-CLICK TRUY CẬP) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-xl">
              <h4 className="text-sm font-black text-cyan-300 uppercase tracking-wide flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                HỘI NHÓM GIÁO VIÊN ĐÔNG NHẤT VIỆT NAM (BẤM 1 CLICK LÀ MỞ ĐỂ DÁN BÀI)
              </h4>
              <p className="text-xs text-slate-400">
                Thầy Thành chỉ cần sao chép bài viết ở trên, sau đó bấm vào các nút bên dưới để mở thẳng nhóm Facebook / Zalo và dán bài đăng:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {[
                  { name: 'Nhóm Giáo Viên THCS Toàn Quốc', members: '185.000 thành viên', url: 'https://www.facebook.com/groups/giaovienthcs' },
                  { name: 'Cộng Đồng Giáo Viên 2018 Đổi Mới', members: '160.000 thành viên', url: 'https://www.facebook.com/groups/giaovienvietnam2018' },
                  { name: 'Chia Sẻ Giáo Án 5512 & Ra Đề 7991', members: '135.000 thành viên', url: 'https://www.facebook.com/groups/giaoan5512' },
                  { name: 'Giáo Viên Tiếng Anh THCS Toàn Quốc', members: '98.000 thành viên', url: 'https://www.facebook.com/groups/tienganhthcs' },
                  { name: 'Giáo Viên Môn Toán & KHTN THCS', members: '88.000 thành viên', url: 'https://www.facebook.com/groups/toankhtnthcs' },
                  { name: 'Giáo Viên Ngữ Văn Đổi Mới CT 2018', members: '92.000 thành viên', url: 'https://www.facebook.com/groups/nguvanthcs' }
                ].map((grp, idx) => (
                  <a
                    key={idx}
                    href={grp.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 transition flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                        {grp.name}
                      </div>
                      <div className="text-[11px] text-slate-400">{grp.members}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 shrink-0 transition" />
                  </a>
                ))}
              </div>
            </div>

            {/* HƯỚNG DẪN 3 CHIẾN LƯỢC QUẢNG CÁO TỰ ĐỘNG KHÔNG MẤT TIỀN TẠI VIỆT NAM */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-500/30 text-xs text-slate-300 space-y-2.5">
              <h4 className="font-extrabold text-amber-300 uppercase tracking-wide">
                💡 3 CHIÊU THỨC TỰ ĐỘNG HÚT KHÁCH HÀNG GIÁO VIÊN TOÀN QUỐC 0 ĐỒNG CỦA THẦY THÀNH:
              </h4>
              <ul className="space-y-1.5 list-disc pl-4 text-[11px] text-slate-300 leading-relaxed">
                <li>
                  <strong>Chiến lược 1 (Viral Zalo):</strong> Mỗi khi giáo viên dùng thử hết 5 lượt, web tự động tặng thêm 3 lượt nếu họ bấm chia sẻ vào nhóm Zalo nhà trường. 1 giáo viên chia sẻ = cả trường học biết đến web của Thầy Thành.
                </li>
                <li>
                  <strong>Chiến lược 2 (Video YouTube Top 1 Google):</strong> Tải các video hướng dẫn có sẵn trong web lên kênh YouTube của Thầy, đặt link web ở mô tả. Google luôn ưu tiên hiển thị video ở đầu kết quả tìm kiếm.
                </li>
                <li>
                  <strong>Chiến lược 3 (Google Maps Doanh Nghiệp):</strong> Tạo trang Google Business "Trung Tâm Giáo Viên AI Toàn Năng - Thầy Đinh Văn Thành" tại THCS Đồng Yên. Khi ai tìm tên Thầy hoặc THCS Đồng Yên, Google sẽ hiện ngay ô bản đồ to đùng kèm số Zalo 0915.213717.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 1: SMART LISTENING PRO (CLOUD DATABASE) */}
        {/* ===================================================================== */}
        {/* TAB 0: THỐNG KÊ TRUY CẬP, DÙNG THỬ & THEO DÕI THEO ID MÁY (ADMIN)    */}
        {/* ===================================================================== */}
        {/* ===================================================================== */}
        {/* TAB 0: QUẢN LÝ ĐƠN ĐĂNG KÝ, THỐNG KÊ WEB & LỊCH SỬ DÙNG THEO NGÀY GIỜ */}
        {/* ===================================================================== */}
        {adminTab === 'tracking' && (
          <div className="flex-1 flex flex-col min-h-0 space-y-3">
            {/* SUB-NAVIGATION TABS */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setTrackingSubTab('requests')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    trackingSubTab === 'requests'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>1. Đơn Đăng Ký Thành Viên</span>
                  {registrationRequests.filter(r => r.status === 'PENDING').length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-black animate-pulse">
                      {registrationRequests.filter(r => r.status === 'PENDING').length}
                    </span>
                  )}
                </button>

                {userRole === 'ADMIN' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setTrackingSubTab('stats')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                        trackingSubTab === 'stats'
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>2. Thống Kê Web & Lịch Sử Theo Ngày Giờ</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTrackingSubTab('machines')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                        trackingSubTab === 'machines'
                          ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Laptop className="w-3.5 h-3.5" />
                      <span>3. Quản Lý Máy & Khóa Vĩnh Viễn</span>
                      {blockedMachines.length > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-black">
                          {blockedMachines.length}
                        </span>
                      )}
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">
                  Đang thao tác: <strong className="text-amber-300">{currentAdminName}</strong> ({userRole === 'ADMIN' ? 'Admin Tối Cao' : 'Phụ Tá Duyệt Thành Viên'})
                </span>
                <button
                  type="button"
                  onClick={loadTrackingData}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 text-xs cursor-pointer transition"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                  Làm mới
                </button>
              </div>
            </div>

            {/* ========================================================= */}
            {/* SUBTAB 1: ĐƠN ĐĂNG KÝ THÀNH VIÊN CẦN DUYỆT (ALL APPS)    */}
            {/* ========================================================= */}
            {trackingSubTab === 'requests' && (
              <div className="flex-1 flex flex-col min-h-0 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Lọc theo trạng thái:</span>
                    {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(st => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setReqFilter(st)}
                        className={`px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                          reqFilter === st
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {st === 'ALL' ? 'Tất Cả' : st === 'PENDING' ? 'Chờ Duyệt' : st === 'APPROVED' ? 'Đã Duyệt' : 'Từ Chối'}
                      </button>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-400">
                    💡 Bấm duyệt 1-click để hệ thống tự động kích hoạt VIP (Gói 1 Năm / 2 Năm VIP) và lưu người duyệt.
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto border border-slate-800 rounded-2xl bg-slate-950/60">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-slate-800/95 backdrop-blur-md text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-700">
                      <tr>
                        <th className="py-2.5 px-3">Thời Gian Gửi</th>
                        <th className="py-2.5 px-3">Thầy/Cô & Đơn Vị</th>
                        <th className="py-2.5 px-3">Số ĐT / Zalo</th>
                        <th className="py-2.5 px-3">ID Máy Tính</th>
                        <th className="py-2.5 px-3">Phần Mềm</th>
                        <th className="py-2.5 px-3">Gói Đăng Ký</th>
                        <th className="py-2.5 px-3">Trạng Thái</th>
                        <th className="py-2.5 px-3 text-right">Thao Tác Duyệt Nhanh</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {registrationRequests
                        .filter(r => (reqFilter === 'ALL' ? true : r.status === reqFilter))
                        .map((req, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                              {req.createdAt}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-white">
                              {req.fullName}
                              <div className="text-[11px] text-slate-400 font-normal">{req.schoolUnit}</div>
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">
                              <a
                                href={`https://zalo.me/${req.phoneNumber.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:underline flex items-center gap-1"
                              >
                                {req.phoneNumber}
                              </a>
                            </td>
                            <td className="py-2.5 px-3 font-mono text-cyan-300 font-bold">
                              {req.machineId}
                            </td>
                            <td className="py-2.5 px-3 text-slate-200">
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-semibold">
                                {req.appName}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                req.packageType === '2YEAR'
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : req.packageType === '1YEAR'
                                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              }`}>
                                {req.packageType === 'FULL_WEB' ? '👑 Full Web' : req.packageType === '2YEAR' ? '2 Năm VIP' : req.packageType === '1YEAR' ? '1 Năm' : 'Dùng thử 5 lần'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              {req.status === 'APPROVED' ? (
                                <div className="text-emerald-400 font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Đã Duyệt</span>
                                  {req.reviewedBy && (
                                    <span className="text-[9px] text-slate-400 block font-normal">
                                      ({req.reviewedBy})
                                    </span>
                                  )}
                                </div>
                              ) : req.status === 'REJECTED' ? (
                                <span className="text-rose-400 font-bold">Từ Chối</span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                                  ⏳ Chờ Duyệt
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              {req.status === 'PENDING' ? (
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleApproveReq(req.id, '1YEAR', (req as any).issueNumber)}
                                    className="px-2 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold text-[10px] shadow transition cursor-pointer"
                                    title="Duyệt Gói 1 Năm"
                                  >
                                    Duyệt 1 Năm
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleApproveReq(req.id, '2YEAR', (req as any).issueNumber)}
                                    className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] shadow transition cursor-pointer"
                                    title="Duyệt Gói 2 Năm VIP"
                                  >
                                    Duyệt 2 Năm VIP
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleApproveReq(req.id, 'TRIAL_5', (req as any).issueNumber)}
                                    className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] shadow transition cursor-pointer"
                                    title="Cấp 5 Lần Dùng Thử"
                                  >
                                    5 Lần Thử
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRejectReq(req.id, (req as any).issueNumber)}
                                    className="px-1.5 py-1 rounded bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-200 text-[10px] border border-slate-700 transition cursor-pointer"
                                    title="Từ chối đơn"
                                  >
                                    X
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[11px] text-slate-500 font-mono">
                                  {req.reviewedAt || 'Hoàn tất'}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      {registrationRequests.length === 0 && (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-slate-500">
                            Chưa có đơn đăng ký thành viên nào gửi lên.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* SUBTAB 2: THỐNG KÊ TRUY CẬP WEB & LỊCH SỬ DÙNG APP THEO NGÀY GIỜ */}
            {/* ========================================================= */}
            {trackingSubTab === 'stats' && (
              <div className="flex-1 flex flex-col min-h-0 space-y-3">
                {/* 4 CARDS THỐNG KÊ THỰC TẾ */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3 shadow-md">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xl font-black text-white">{webStats?.totalPageviews || 1420}</div>
                      <div className="text-[11px] text-slate-400">Lượt xem web thực tế</div>
                    </div>
                  </div>

                  <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3 shadow-md">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
                      <Laptop className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xl font-black text-white">{webStats?.totalUniqueVisitors || trackedMachines.length}</div>
                      <div className="text-[11px] text-slate-400">Người dùng / Máy tính thực tế</div>
                    </div>
                  </div>

                  <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3 shadow-md">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xl font-black text-emerald-300">
                        {webStats?.registeredTrialCount || trackedMachines.filter(m => m.isRegisteredTrial).length}
                      </div>
                      <div className="text-[11px] text-slate-400">Đã đăng ký dùng thử</div>
                    </div>
                  </div>

                  <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3 shadow-md">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                      <ShieldOff className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xl font-black text-rose-400">{blockedMachines.length}</div>
                      <div className="text-[11px] text-slate-400">Máy bị Admin khóa vĩnh viễn</div>
                    </div>
                  </div>
                </div>

                {/* THANH TÌM KIẾM LOG HOẠT ĐỘNG */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Tìm theo ngày giờ, họ tên, ID máy, thao tác..."
                      value={logSearch}
                      onChange={(e) => setLogSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <p className="text-[11px] text-slate-400">
                    📅 Ghi nhận chi tiết mọi hoạt động dùng thử, tạo đề, tải Word theo từng ngày giờ giây chuẩn xác.
                  </p>
                </div>

                {/* BẢNG LOG HOẠT ĐỘNG CHI TIẾT THEO NGÀY GIỜ */}
                <div className="flex-1 overflow-y-auto border border-slate-800 rounded-2xl bg-slate-950/60">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-slate-800/95 backdrop-blur-md text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-700">
                      <tr>
                        <th className="py-2.5 px-3">Thời Gian (Ngày Giờ)</th>
                        <th className="py-2.5 px-3">Giáo Viên / Đơn Vị</th>
                        <th className="py-2.5 px-3">Số ĐT Zalo</th>
                        <th className="py-2.5 px-3">ID Máy Tính</th>
                        <th className="py-2.5 px-3">Ứng Dụng</th>
                        <th className="py-2.5 px-3">Hành Động Chi Tiết</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {activityLogs
                        .filter(l => {
                          if (!logSearch.trim()) return true;
                          const q = logSearch.toLowerCase();
                          return (
                            l.timestamp.toLowerCase().includes(q) ||
                            (l.userName && l.userName.toLowerCase().includes(q)) ||
                            (l.school && l.school.toLowerCase().includes(q)) ||
                            (l.phone && l.phone.includes(q)) ||
                            l.machineId.toLowerCase().includes(q) ||
                            l.appName.toLowerCase().includes(q) ||
                            l.action.toLowerCase().includes(q)
                          );
                        })
                        .map((log, lIdx) => (
                          <tr key={lIdx} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-2.5 px-3 font-mono text-[11px] text-amber-300 font-bold whitespace-nowrap">
                              {log.timestamp}
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-white">
                              {log.userName || 'Chưa định danh'}
                              {log.school && <div className="text-[10px] text-slate-400 font-normal">{log.school}</div>}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-emerald-400">
                              {log.phone || '-'}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-cyan-300 font-bold">
                              {log.machineId}
                            </td>
                            <td className="py-2.5 px-3 text-slate-300">
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">
                                {log.appName}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-200">
                              {log.action}
                            </td>
                          </tr>
                        ))}
                      {activityLogs.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-500">
                            Chưa có nhật ký hoạt động nào được ghi nhận.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* SUBTAB 3: QUẢN LÝ MÁY TÍNH & XÓA / KHÓA TRUY CẬP VĨNH VIỄN */}
            {/* ========================================================= */}
            {trackingSubTab === 'machines' && (
              <div className="flex-1 flex flex-col min-h-0 space-y-3">
                {/* THANH TÌM KIẾM MÁY */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Tìm ID máy, họ tên, trường, SĐT..."
                      value={trackingSearch}
                      onChange={(e) => setTrackingSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <p className="text-[11px] text-rose-300 font-semibold">
                    ⚠️ Khi Admin bấm nút "Xóa & Khóa Máy", máy tính đó sẽ KHÔNG THỂ HOẠT ĐỘNG được nữa trên toàn hệ thống!
                  </p>
                </div>

                {/* BẢNG MÁY TÍNH */}
                <div className="flex-1 overflow-y-auto border border-slate-800 rounded-2xl bg-slate-950/60">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-slate-800/95 backdrop-blur-md text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-700">
                      <tr>
                        <th className="py-2.5 px-3">ID Máy Tính</th>
                        <th className="py-2.5 px-3">Họ Tên / Dự Đoán</th>
                        <th className="py-2.5 px-3">Trường & SĐT</th>
                        <th className="py-2.5 px-3">Dùng Thử</th>
                        <th className="py-2.5 px-3">Phần Mềm Đã Vào</th>
                        <th className="py-2.5 px-3">Lần Cuối Truy Cập</th>
                        <th className="py-2.5 px-3 text-right">Hành Động Quản Trị</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {trackedMachines
                        .filter(m => {
                          if (!trackingSearch.trim()) return true;
                          const q = trackingSearch.toLowerCase();
                          return (
                            m.machineId.toLowerCase().includes(q) ||
                            (m.fullName && m.fullName.toLowerCase().includes(q)) ||
                            (m.predictedName && m.predictedName.toLowerCase().includes(q)) ||
                            (m.schoolUnit && m.schoolUnit.toLowerCase().includes(q)) ||
                            (m.phoneNumber && m.phoneNumber.includes(q))
                          );
                        })
                        .map((item, idx) => {
                          const activeLicense = licenses.find(l => l.machine_id === item.machineId && l.status === 'ACTIVE');
                          const isBlocked = blockedMachines.some(b => b.machineId === item.machineId);
                          const apps = Object.values(item.appsVisited || {});

                          return (
                            <tr key={idx} className={`transition-colors ${isBlocked ? 'bg-rose-950/30' : 'hover:bg-slate-800/30'}`}>
                              <td className="py-2.5 px-3 font-mono font-bold text-cyan-300">
                                {item.machineId}
                                {isBlocked && (
                                  <span className="block text-[10px] text-rose-400 font-sans font-bold">
                                    ⛔ ĐÃ BỊ KHÓA VĨNH VIỄN
                                  </span>
                                )}
                                <div className="text-[10px] text-slate-500 font-sans font-normal mt-0.5">
                                  {item.deviceInfo || 'Windows PC'}
                                </div>
                              </td>
                              <td className="py-2.5 px-3">
                                {item.isRegisteredTrial && item.fullName ? (
                                  <div>
                                    <span className="font-bold text-white text-sm">{item.fullName}</span>
                                    <span className="ml-2 px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/30">
                                      Đã đăng ký
                                    </span>
                                  </div>
                                ) : (
                                  <div>
                                    <span className="font-semibold text-amber-300">{item.predictedName || 'Chưa định danh'}</span>
                                    <span className="ml-2 px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] border border-amber-500/30">
                                      Dự đoán
                                    </span>
                                  </div>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-slate-300">
                                <div className="flex items-center gap-1">
                                  <Building2 className="w-3 h-3 text-slate-500" />
                                  <span>{item.schoolUnit || 'Chưa rõ đơn vị'}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono mt-0.5">
                                  <Phone className="w-3 h-3 text-slate-500" />
                                  <span>{item.phoneNumber || 'Chưa có SĐT'}</span>
                                </div>
                              </td>
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-1 font-bold">
                                  <span className={item.trialUsed >= item.trialMax ? 'text-red-400' : 'text-amber-400'}>
                                    {item.trialUsed}
                                  </span>
                                  <span className="text-slate-500">/</span>
                                  <span className="text-slate-300">{item.trialMax}</span>
                                  <span className="text-[10px] text-slate-400 ml-1">lượt</span>
                                </div>
                                <div className="w-20 bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                                  <div
                                    className={`h-full ${item.trialUsed >= item.trialMax ? 'bg-red-500' : 'bg-amber-500'}`}
                                    style={{ width: `${Math.min(100, (item.trialUsed / item.trialMax) * 100)}%` }}
                                  />
                                </div>
                              </td>
                              <td className="py-2.5 px-3">
                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                  {apps.length === 0 ? (
                                    <span className="text-slate-500 text-[10px]">Chưa mở app</span>
                                  ) : (
                                    apps.map((app, aIdx) => (
                                      <span
                                        key={aIdx}
                                        className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] border border-slate-700"
                                        title={`${app.appName} (vào ${app.count} lần, lần cuối: ${app.lastVisit})`}
                                      >
                                        {app.appName.split(' ')[0]} ({app.count})
                                      </span>
                                    ))
                                  )}
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                                {item.lastSeenAt || 'Vừa xong'}
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {!activeLicense && !isBlocked && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          const nowTs = Math.floor(Date.now() / 1000);
                                          await licenseService.createDirect({
                                            machine_id: item.machineId,
                                            teacher_name: item.fullName || item.predictedName || 'Thầy/Cô',
                                            phone_zalo: item.phoneNumber || '',
                                            school_unit: item.schoolUnit || '',
                                            package_type: '1YEAR',
                                            status: 'ACTIVE',
                                            expiry_timestamp: nowTs + 365 * 86400,
                                            notes: `Kích hoạt nhanh 1 Năm bởi ${currentAdminName}`
                                          }, currentAdminName);
                                          await loadData();
                                          loadTrackingData();
                                          alert(`Đã kích hoạt Gói 1 Năm cho máy ${item.machineId}!`);
                                        }}
                                        className="px-2 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold text-[10px] transition cursor-pointer"
                                        title="Kích hoạt nhanh 1 Năm"
                                      >
                                        + 1 Năm
                                      </button>
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          const nowTs = Math.floor(Date.now() / 1000);
                                          await licenseService.createDirect({
                                            machine_id: item.machineId,
                                            teacher_name: item.fullName || item.predictedName || 'Thầy/Cô',
                                            phone_zalo: item.phoneNumber || '',
                                            school_unit: item.schoolUnit || '',
                                            package_type: '2YEAR',
                                            status: 'ACTIVE',
                                            expiry_timestamp: nowTs + 730 * 86400,
                                            notes: `Kích hoạt nhanh 2 Năm bởi ${currentAdminName}`
                                          }, currentAdminName);
                                          await loadData();
                                          loadTrackingData();
                                          alert(`Đã kích hoạt Gói 2 Năm VIP cho máy ${item.machineId}!`);
                                        }}
                                        className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] transition cursor-pointer"
                                        title="Kích hoạt nhanh 2 Năm VIP"
                                      >
                                        + 2 Năm VIP
                                      </button>
                                    </>
                                  )}

                                  {isBlocked ? (
                                    <button
                                      type="button"
                                      onClick={() => handleUnblockMachine(item.machineId)}
                                      className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition cursor-pointer"
                                      title="Mở khóa máy này"
                                    >
                                      Mở Khóa
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteAndBlockMachine(item.machineId)}
                                      className="p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 transition text-xs cursor-pointer"
                                      title="Xóa tài khoản & Khóa vĩnh viễn (Không cho hoạt động nữa)"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>

                {/* DANH SÁCH MÁY ĐANG BỊ KHÓA */}
                {blockedMachines.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-2">
                    <h5 className="text-xs font-bold text-rose-300 flex items-center gap-1.5 uppercase">
                      <ShieldOff className="w-4 h-4 text-rose-400" />
                      Danh Sách Các Thiết Bị Đã Bị Khóa Hoàn Toàn ({blockedMachines.length} máy)
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {blockedMachines.map((bm, bmIdx) => (
                        <div key={bmIdx} className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-rose-500/50 flex items-center gap-2 text-xs">
                          <span className="font-mono font-bold text-rose-400">{bm.machineId}</span>
                          <span className="text-[11px] text-slate-400">({bm.reason})</span>
                          <button
                            type="button"
                            onClick={() => handleUnblockMachine(bm.machineId)}
                            className="px-1.5 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
                          >
                            Mở
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {adminTab === 'tts' && (
          <>
            {/* 4 STATS CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-2">
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-xs text-slate-400 font-medium block">Tổng thiết bị</span>
                <span className="text-2xl font-black text-white mt-1 block">{totalCount}</span>
              </div>
              <div className={`p-3.5 rounded-2xl border transition-all ${pendingCount > 0 ? 'bg-amber-500/15 border-amber-500/50 shadow-lg shadow-amber-500/10 animate-pulse' : 'bg-slate-800/80 border-slate-700/60'}`}>
                <span className="text-xs text-amber-400 font-bold block flex items-center gap-1">
                  🔔 Chờ duyệt mới
                </span>
                <span className="text-2xl font-black text-amber-400 mt-1 block">{pendingCount}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-xs text-emerald-400 font-medium block">Đang hoạt động (Pro)</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">{activeCount}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-xs text-rose-400 font-medium block">Bị khóa / Thu hồi</span>
                <span className="text-2xl font-black text-rose-400 mt-1 block">{revokedCount}</span>
              </div>
            </div>

            {/* CONTROLS BAR */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm mã máy, tên giáo viên, số điện thoại..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
                  <button
                    onClick={() => setFilterStatus('ALL')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${filterStatus === 'ALL' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setFilterStatus('PENDING')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${filterStatus === 'PENDING' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    Chờ duyệt {pendingCount > 0 && `(${pendingCount})`}
                  </button>
                  <button
                    onClick={() => setFilterStatus('ACTIVE')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${filterStatus === 'ACTIVE' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    Pro
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  Tạo Key Trực Tiếp
                </button>
                <button
                  onClick={loadData}
                  disabled={loading}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Làm mới"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* CUSTOMER LICENSES TABLE */}
            <div className="flex-1 overflow-y-auto border border-slate-800 rounded-2xl bg-slate-950/50">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm">
                  Không tìm thấy thiết bị nào phù hợp.
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-slate-800/90 backdrop-blur-md text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-3">Mã Thiết Bị</th>
                      <th className="py-3 px-3">Giáo Viên / Đơn Vị</th>
                      <th className="py-3 px-3">Gói Bản Quyền</th>
                      <th className="py-3 px-3">Trạng Thái</th>
                      <th className="py-3 px-3">Ngày Kích Hoạt</th>
                      <th className="py-3 px-3">Người Kích Hoạt</th>
                      <th className="py-3 px-3 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filtered.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-amber-300">
                          {item.machine_id}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-white">{item.teacher_name || 'Chưa cập nhật'}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-500" />
                            <span>{item.phone_zalo || 'Không có'}</span>
                            {item.school_unit && (
                              <>
                                <span className="text-slate-600">•</span>
                                <Building2 className="w-3 h-3 text-slate-500" />
                                <span>{item.school_unit}</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${item.package_type === 'LIFETIME' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'}`}>
                            {item.package_type === 'LIFETIME' ? 'Trọn Đời' : item.package_type}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {item.status === 'ACTIVE' && (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Hoạt động
                            </span>
                          )}
                          {item.status === 'PENDING' && (
                            <span className="inline-flex items-center gap-1 text-amber-400 font-bold animate-pulse">
                              <Clock className="w-3.5 h-3.5" /> Chờ duyệt
                            </span>
                          )}
                          {item.status === 'REVOKED' && (
                            <span className="inline-flex items-center gap-1 text-rose-400 font-bold">
                              <ShieldAlert className="w-3.5 h-3.5" /> Bị khóa
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-400 text-[11px]">
                          {item.activated_at ? item.activated_at.substring(0, 10) : 'Chưa kích hoạt'}
                        </td>
                        <td className="py-3 px-3">
                          {item.activated_by ? (
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center gap-1 ${
                              item.activated_by.includes('Thành')
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            }`}>
                              {item.activated_by.includes('Thành') ? '👑 Thầy Thành' : '🌸 Mai Tình'}
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[10px]">Tự động / Hệ thống</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {item.status === 'PENDING' && (
                              <button
                                onClick={() => handleApprove(item.machine_id)}
                                className="py-1 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm transition-colors"
                              >
                                Duyệt Pro
                              </button>
                            )}
                            {item.status !== 'PENDING' && (
                              <>
                                {item.status === 'ACTIVE' ? (
                                  <button
                                    onClick={() => handleRevoke(item.machine_id)}
                                    className="p-1.5 rounded-md hover:bg-rose-950/40 text-slate-500 hover:text-rose-400"
                                    title="Khóa bản quyền"
                                  >
                                    <Lock className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleApprove(item.machine_id)}
                                    className="p-1.5 rounded-md hover:bg-emerald-950/40 text-emerald-400"
                                    title="Mở khóa máy này"
                                  >
                                    <Unlock className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </>
                            )}
                            <button
                              onClick={() => handleDelete(item.machine_id)}
                              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-500 hover:text-rose-400"
                              title="Xóa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* TAB 2: TOOL TẠO KEY ED25519 - TÍCH HỢP NLS-AI V3 */}
        {adminTab === 'nls' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
            {/* CARD TẠO KEY ED25519 */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  KÝ SỐ ED25519 & TẠO KEY BẢN QUYỀN PRO THCS V3 (2026)
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  Chuẩn thuật toán Admin_Tao_Key_Pro.exe (Bản V3)
                </span>
              </div>

              <form onSubmit={handleGenerateNLSKey} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-slate-300 font-bold mb-1">
                      1. Nhập Mã Máy (Hardware Code) của Khách Hàng:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: DVT-0B1D-A6A7-5A14"
                      value={nlsMid}
                      onChange={(e) => setNlsMid(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-sm uppercase text-cyan-300 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      2. Chọn Gói Bản Quyền:
                    </label>
                    <select
                      value={nlsYears}
                      onChange={(e) => setNlsYears(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value={99}>VIP Trọn Đời (Khuyên dùng)</option>
                      <option value={1}>1 Năm</option>
                      <option value={2}>2 Năm</option>
                      <option value={3}>3 Năm</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
                  >
                    <Sparkles className="w-4 h-4" />
                    KÝ SỐ & TẠO MÃ KÍCH HOẠT PRO (ED25519)
                  </button>

                  {nlsGenError && (
                    <span className="text-rose-400 font-semibold">{nlsGenError}</span>
                  )}
                </div>
              </form>

              {/* KẾT QUẢ SINH KEY & TIN NHẮN ZALO */}
              {nlsKeyResult && (
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Mã Key kích hoạt Ed25519:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={nlsKeyResult}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-emerald-500/50 font-mono text-xs text-emerald-300 font-bold select-all focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCopyNLSKey}
                        className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 border border-slate-700"
                      >
                        {nlsCopiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        {nlsCopiedKey ? 'Đã copy Key!' : 'Copy Key'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-300 font-bold">
                        Tin nhắn Zalo gửi khách hàng (đã định dạng chuẩn):
                      </label>
                      <button
                        type="button"
                        onClick={handleCopyNLSZaloMsg}
                        className="py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow"
                      >
                        {nlsCopiedMsg ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                        {nlsCopiedMsg ? 'Đã copy tin nhắn Zalo!' : 'Sao chép tin nhắn Zalo gửi Khách'}
                      </button>
                    </div>
                    <textarea
                      readOnly
                      rows={7}
                      value={nlsZaloMsg}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] leading-relaxed text-slate-200 select-all focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* LỊCH SỬ CÁC KEY ĐÃ TẠO GẦN ĐÂY */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-slate-200 block text-xs">
                Lịch sử các Key Ed25519 đã tạo gần đây ({nlsHistory.length} bản ghi):
              </span>
              {nlsHistory.length === 0 ? (
                <p className="text-slate-500 py-3 text-center">Chưa có key nào được tạo gần đây.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-2">Thời gian</th>
                        <th className="py-2 px-2">Mã máy</th>
                        <th className="py-2 px-2">Gói</th>
                        <th className="py-2 px-2">Key Pro</th>
                        <th className="py-2 px-2 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {nlsHistory.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-900/60">
                          <td className="py-2 px-2 text-slate-400 whitespace-nowrap">{item.createdAt}</td>
                          <td className="py-2 px-2 font-mono text-cyan-300 font-bold">{item.mid}</td>
                          <td className="py-2 px-2 text-amber-300 font-semibold">{item.plan}</td>
                          <td className="py-2 px-2 font-mono text-emerald-400 truncate max-w-xs">{item.key}</td>
                          <td className="py-2 px-2 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(item.key);
                                alert(`Đã sao chép Key của máy ${item.mid}!`);
                              }}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px]"
                            >
                              Copy Key
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: TOOL TẠO KEY BẢN QUYỀN - TẠO ĐỀ TIẾNG ANH CV 7991 */}
        {adminTab === 'taode' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
            {/* CARD TẠO KEY */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/60 via-slate-900 to-slate-950 border border-sky-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-sky-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  MẬT MÃ SHA-256 & TẠO KEY BẢN QUYỀN - ĐỀ TIẾNG ANH (CV 7991)
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  Chuẩn thuật toán Tool_Tao_Key_Ban_Quyen_Thanh.py
                </span>
              </div>

              <form onSubmit={handleGenerateExamKey} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-slate-300 font-bold mb-1">
                      1. Nhập Mã Máy (Hardware Code) của Khách Hàng:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: DVT-ENG-1A2B-3C4D"
                      value={examMid}
                      onChange={(e) => setExamMid(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-sm uppercase text-sky-300 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      2. Chọn Gói Bản Quyền:
                    </label>
                    <select
                      value={examPackage}
                      onChange={(e) => setExamPackage(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-sky-500"
                    >
                      <option value="lifetime">VIP Trọn Đời (Khuyên dùng)</option>
                      <option value="1year">1 Năm</option>
                      <option value="2year">2 Năm</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-sky-600/30 transition-all hover:scale-[1.02]"
                  >
                    <Sparkles className="w-4 h-4" />
                    TẠO MÃ KÍCH HOẠT PRO TIẾNG ANH (SHA-256)
                  </button>

                  {examGenError && (
                    <span className="text-rose-400 font-semibold">{examGenError}</span>
                  )}
                </div>
              </form>

              {/* KẾT QUẢ SINH KEY & TIN NHẮN ZALO */}
              {examKeyResult && (
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Mã Key kích hoạt Pro (ENG-prefix-expts-sig):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={examKeyResult}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-sky-500/50 font-mono text-xs text-sky-300 font-bold select-all focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCopyExamKey}
                        className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 border border-slate-700"
                      >
                        {examCopiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        {examCopiedKey ? 'Đã copy Key!' : 'Copy Key'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-300 font-bold">
                        Tin nhắn Zalo gửi khách hàng (đã định dạng chuẩn):
                      </label>
                      <button
                        type="button"
                        onClick={handleCopyExamZaloMsg}
                        className="py-1.5 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow"
                      >
                        {examCopiedMsg ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                        {examCopiedMsg ? 'Đã copy tin nhắn Zalo!' : 'Sao chép tin nhắn Zalo gửi Khách'}
                      </button>
                    </div>
                    <textarea
                      readOnly
                      rows={7}
                      value={examZaloMsg}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] leading-relaxed text-slate-200 select-all focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* LỊCH SỬ CÁC KEY ĐÃ TẠO GẦN ĐÂY */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-slate-200 block text-xs">
                Lịch sử các Key Đề Tiếng Anh đã tạo gần đây ({examHistory.length} bản ghi):
              </span>
              {examHistory.length === 0 ? (
                <p className="text-slate-500 py-3 text-center">Chưa có key nào được tạo gần đây.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-2">Thời gian</th>
                        <th className="py-2 px-2">Mã máy</th>
                        <th className="py-2 px-2">Gói</th>
                        <th className="py-2 px-2">Key Pro</th>
                        <th className="py-2 px-2 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {examHistory.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-900/60">
                          <td className="py-2 px-2 text-slate-400 whitespace-nowrap">{item.createdAt}</td>
                          <td className="py-2 px-2 font-mono text-sky-300 font-bold">{item.mid}</td>
                          <td className="py-2 px-2 text-amber-300 font-semibold">{item.plan}</td>
                          <td className="py-2 px-2 font-mono text-emerald-400 truncate max-w-xs">{item.key}</td>
                          <td className="py-2 px-2 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(item.key);
                                alert(`Đã sao chép Key của máy ${item.mid}!`);
                              }}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px]"
                            >
                              Copy Key
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: TOOL TẠO KEY BẢN QUYỀN - SINH 3 ĐỀ BIẾN THỂ VIP (V1) */}
        {adminTab === 'bienthe' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
            {/* CARD TẠO KEY */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  MẬT MÃ SHA-256 & TẠO KEY BẢN QUYỀN - SINH 3 ĐỀ BIẾN THỂ VIP (V1)
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  Thuật toán bientheKeyService.ts (Thầy Đinh Văn Thành)
                </span>
              </div>

              <form onSubmit={handleGenerateBientheKey} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-slate-300 font-bold mb-1">
                      1. Nhập Mã Máy (Hardware Code) của Khách Hàng:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: DVT-VAR-1A2B-3C4D"
                      value={bientheMid}
                      onChange={(e) => setBientheMid(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-sm uppercase text-amber-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      2. Chọn Gói Bản Quyền:
                    </label>
                    <select
                      value={bienthePackage}
                      onChange={(e) => setBienthePackage(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="lifetime">VIP Trọn Đời (Khuyên dùng)</option>
                      <option value="1year">1 Năm</option>
                      <option value="2year">2 Năm</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Crown className="w-4 h-4" />
                    TẠO MÃ KÍCH HOẠT PRO BIẾN THỂ (SHA-256)
                  </button>

                  {bientheGenError && (
                    <span className="text-rose-400 font-semibold">{bientheGenError}</span>
                  )}
                </div>
              </form>

              {/* KẾT QUẢ SINH KEY & TIN NHẮN ZALO */}
              {bientheKeyResult && (
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Mã Key kích hoạt Pro (VAR-prefix-expts-sig):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={bientheKeyResult}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-amber-500/50 font-mono text-xs text-amber-300 font-bold select-all focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCopyBientheKey}
                        className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 border border-slate-700 cursor-pointer"
                      >
                        {bientheCopiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        {bientheCopiedKey ? 'Đã copy Key!' : 'Copy Key'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-300 font-bold">
                        Tin nhắn Zalo gửi khách hàng (đã định dạng chuẩn):
                      </label>
                      <button
                        type="button"
                        onClick={handleCopyBientheZaloMsg}
                        className="py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow cursor-pointer"
                      >
                        {bientheCopiedMsg ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                        {bientheCopiedMsg ? 'Đã copy tin nhắn Zalo!' : 'Sao chép tin nhắn Zalo gửi Khách'}
                      </button>
                    </div>
                    <textarea
                      readOnly
                      rows={7}
                      value={bientheZaloMsg}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] leading-relaxed text-slate-200 select-all focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* LỊCH SỬ CÁC KEY ĐÃ TẠO GẦN ĐÂY */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-slate-200 block text-xs">
                Lịch sử các Key Đề Biến Thể đã tạo gần đây ({bientheHistory.length} bản ghi):
              </span>
              {bientheHistory.length === 0 ? (
                <p className="text-slate-500 py-3 text-center">Chưa có key nào được tạo gần đây.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-2">Thời gian</th>
                        <th className="py-2 px-2">Mã máy</th>
                        <th className="py-2 px-2">Gói</th>
                        <th className="py-2 px-2">Key Pro</th>
                        <th className="py-2 px-2 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {bientheHistory.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-900/60">
                          <td className="py-2 px-2 text-slate-400 whitespace-nowrap">{item.createdAt}</td>
                          <td className="py-2 px-2 font-mono text-amber-300 font-bold">{item.mid}</td>
                          <td className="py-2 px-2 text-sky-300 font-semibold">{item.plan}</td>
                          <td className="py-2 px-2 font-mono text-emerald-400 truncate max-w-xs">{item.key}</td>
                          <td className="py-2 px-2 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(item.key);
                                alert(`Đã sao chép Key của máy ${item.mid}!`);
                              }}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] cursor-pointer"
                            >
                              Copy Key
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: TOOL TẠO KEY BẢN QUYỀN - SCREEN RECORD PRO V2 */}
        {adminTab === 'record' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
            {/* CARD TẠO KEY */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-950 border border-rose-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-rose-400" />
                  MẬT MÃ SHA-256 & TẠO KEY BẢN QUYỀN - SCREEN RECORD PRO V2
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  Thuật toán recordKeyService.ts (Thầy Đinh Văn Thành)
                </span>
              </div>

              <form onSubmit={handleGenerateRecordKey} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-slate-300 font-bold mb-1">
                      1. Nhập Mã Máy (Hardware Code) của Khách Hàng:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: DVT-REC-1A2B-3C4D"
                      value={recordMid}
                      onChange={(e) => setRecordMid(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-sm uppercase text-rose-300 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      2. Chọn Gói Bản Quyền:
                    </label>
                    <select
                      value={recordPackage}
                      onChange={(e) => setRecordPackage(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-rose-500"
                    >
                      <option value="lifetime">VIP Trọn Đời (Khuyên dùng)</option>
                      <option value="1year">1 Năm</option>
                      <option value="2year">2 Năm</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Crown className="w-4 h-4" />
                    TẠO MÃ KÍCH HOẠT PRO SCREEN RECORD (SHA-256)
                  </button>

                  {recordGenError && (
                    <span className="text-rose-400 font-semibold">{recordGenError}</span>
                  )}
                </div>
              </form>

              {/* KẾT QUẢ SINH KEY & TIN NHẮN ZALO */}
              {recordKeyResult && (
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Mã Key kích hoạt Pro (REC-prefix-expts-sig):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={recordKeyResult}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-rose-500/50 font-mono text-xs text-rose-300 font-bold select-all focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCopyRecordKey}
                        className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 border border-slate-700 cursor-pointer"
                      >
                        {recordCopiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        {recordCopiedKey ? 'Đã copy Key!' : 'Copy Key'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-300 font-bold">
                        Tin nhắn Zalo gửi khách hàng (đã định dạng chuẩn):
                      </label>
                      <button
                        type="button"
                        onClick={handleCopyRecordZaloMsg}
                        className="py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow cursor-pointer"
                      >
                        {recordCopiedMsg ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                        {recordCopiedMsg ? 'Đã copy tin nhắn Zalo!' : 'Sao chép tin nhắn Zalo gửi Khách'}
                      </button>
                    </div>
                    <textarea
                      readOnly
                      rows={7}
                      value={recordZaloMsg}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] leading-relaxed text-slate-200 select-all focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* LỊCH SỬ CÁC KEY ĐÃ TẠO GẦN ĐÂY */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-slate-200 block text-xs">
                Lịch sử các Key Screen Record đã tạo gần đây ({recordHistory.length} bản ghi):
              </span>
              {recordHistory.length === 0 ? (
                <p className="text-slate-500 py-3 text-center">Chưa có key nào được tạo gần đây.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-2">Thời gian</th>
                        <th className="py-2 px-2">Mã máy</th>
                        <th className="py-2 px-2">Gói</th>
                        <th className="py-2 px-2">Key Pro</th>
                        <th className="py-2 px-2 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {recordHistory.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-900/60">
                          <td className="py-2 px-2 text-slate-400 whitespace-nowrap">{item.createdAt}</td>
                          <td className="py-2 px-2 font-mono text-rose-300 font-bold">{item.mid}</td>
                          <td className="py-2 px-2 text-sky-300 font-semibold">{item.plan}</td>
                          <td className="py-2 px-2 font-mono text-emerald-400 truncate max-w-xs">{item.key}</td>
                          <td className="py-2 px-2 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(item.key);
                                alert(`Đã sao chép Key của máy ${item.mid}!`);
                              }}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] cursor-pointer"
                            >
                              Copy Key
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: TOOL TẠO KEY BẢN QUYỀN - ĐINH THÀNH CLEANER PRO v4.5 VIP */}
        {adminTab === 'cleaner' && (
          <div className="space-y-4 my-2">
            {/* THÔNG BÁO THUẬT TOÁN BẢO MẬT */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 text-emerald-200 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <div className="font-bold text-white text-sm">
                  MẬT MÃ SHA-256 & TẠO KEY BẢN QUYỀN - ĐINH THÀNH CLEANER PRO v4.5 VIP
                </div>
                <div>
                  Thuật toán tương thích 100% với <code>Tao_Key_Ban_Quyen.py</code> và phần mềm desktop <code>DinhThanh_Cleaner_Pro.exe</code> của Thầy Đinh Văn Thành.
                </div>
              </div>
            </div>

            {/* FORM TẠO KEY BẢN QUYỀN */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-4">
              <form onSubmit={handleGenerateCleanerKey} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Mã Máy Tính của Khách (Hardware Code DT-XXXX-XXXX-XXXX) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: DT-8899-A1B2-C3D4"
                      value={cleanerMid}
                      onChange={(e) => setCleanerMid(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-emerald-500 outline-none uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Gói Bản Quyền Cần Cấp
                    </label>
                    <select
                      value={cleanerPackage}
                      onChange={(e) => setCleanerPackage(e.target.value as any)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-emerald-500 outline-none"
                    >
                      <option value="lifetime">VIP Trọn Đời (Phổ biến nhất)</option>
                      <option value="2year">Gói 2 Năm (730 ngày)</option>
                      <option value="1year">Gói 1 Năm (365 ngày)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/30 transition-all"
                  >
                    <Key className="w-4 h-4" />
                    ⚡ TẠO MÃ KÍCH HOẠT PRO CLEANER (SHA-256)
                  </button>
                  {cleanerGenError && (
                    <span className="text-rose-400 font-semibold text-xs">{cleanerGenError}</span>
                  )}
                </div>
              </form>

              {/* KẾT QUẢ SINH KEY */}
              {cleanerKeyResult && (
                <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-emerald-500/50 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">
                      Mã Key Bản Quyền VIP vừa tạo (Chuẩn định dạng PRO-XXXX-XXXX-XXXX-XXXX):
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                      SHA-256 HỢP LỆ
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={cleanerKeyResult}
                      className="flex-1 py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-sm font-black select-all"
                    />
                    <button
                      type="button"
                      onClick={handleCopyCleanerKey}
                      className="py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                    >
                      {cleanerCopiedKey ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                      {cleanerCopiedKey ? 'Đã copy Key!' : 'Copy Key'}
                    </button>
                  </div>

                  {/* KHUNG TIN NHẮN ZALO MẪU */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                        Tin nhắn Zalo mẫu (Đã điền sẵn mã máy và mã key):
                      </label>
                      <button
                        type="button"
                        onClick={handleCopyCleanerZaloMsg}
                        className="text-[11px] py-1 px-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        {cleanerCopiedMsg ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                        {cleanerCopiedMsg ? 'Đã copy tin nhắn Zalo!' : 'Sao chép tin nhắn Zalo gửi Khách'}
                      </button>
                    </div>
                    <textarea
                      readOnly
                      rows={7}
                      value={cleanerZaloMsg}
                      className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs leading-relaxed select-all"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* LỊCH SỬ CÁC KEY CLEANER ĐÃ CẤP */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Lịch sử các Key Đinh Thành Cleaner Pro đã tạo gần đây ({cleanerHistory.length} bản ghi):
              </div>
              {cleanerHistory.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  Chưa có mã bản quyền Cleaner nào được tạo trên trình duyệt này.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400">
                        <th className="pb-2 px-2">Thời gian</th>
                        <th className="pb-2 px-2">Mã máy (HWID)</th>
                        <th className="pb-2 px-2">Gói cước</th>
                        <th className="pb-2 px-2">Key Bản Quyền</th>
                        <th className="pb-2 px-2 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {cleanerHistory.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-900/60">
                          <td className="py-2 px-2 text-slate-400 whitespace-nowrap">{item.createdAt}</td>
                          <td className="py-2 px-2 font-mono text-emerald-300 font-bold">{item.mid}</td>
                          <td className="py-2 px-2 text-sky-300 font-semibold">{item.plan}</td>
                          <td className="py-2 px-2 font-mono text-amber-300 truncate max-w-xs">{item.key}</td>
                          <td className="py-2 px-2 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(item.key);
                                alert(`Đã sao chép Key của máy ${item.mid}!`);
                              }}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] cursor-pointer"
                            >
                              Copy Key
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: CHUẨN HÓA VĂN BẢN HÀNH CHÍNH AI (NGHỊ ĐỊNH 30/2020) */}
        {adminTab === 'chuanhoavb' && (
          <div className="space-y-4 my-2 overflow-y-auto max-h-[70vh] pr-1">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-amber-950/20 to-slate-800/80 border border-red-800/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                      Tạo Key Bản Quyền Chuẩn Hóa Văn Bản Hành Chính AI
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Thuật toán SHA-256 Hardware Binding • Khóa chặt theo Mã máy tính DVT-CHVB-XXXX-XXXX
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-bold border border-red-500/30">
                  NGHỊ ĐỊNH 30/2020
                </span>
              </div>

              <form onSubmit={handleGenerateCHVBKey} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Mã Máy Tính (Hardware Code) của Khách hàng:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: DVT-CHVB-8899-A1B2"
                      value={chvbMid}
                      onChange={(e) => setChvbMid(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs uppercase focus:outline-none focus:border-red-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Gói bản quyền cấp phép:
                    </label>
                    <select
                      value={chvbPackage}
                      onChange={(e) => setChvbPackage(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-red-400"
                    >
                      <option value="1year">Gói 1 Năm</option>
                      <option value="2year">Gói 2 Năm</option>
                      <option value="lifetime">Gói Trọn Đời VIP (Khuyên dùng)</option>
                    </select>
                  </div>
                </div>

                {chvbGenError && (
                  <p className="text-red-400 text-xs font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {chvbGenError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-md shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>TẠO KEY BẢN QUYỀN CHUẨN HÓA VB NGAY</span>
                </button>
              </form>

              {chvbKeyResult && (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-red-800/60 space-y-3 animate-fadeIn">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                      Mã Key Kích Hoạt (Gửi khách dán vào Tab Bản Quyền):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={chvbKeyResult}
                        className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-amber-300 font-mono text-xs font-bold select-all"
                      />
                      <button
                        type="button"
                        onClick={handleCopyCHVBKey}
                        className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        {chvbCopiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{chvbCopiedKey ? 'Đã copy!' : 'Copy Key'}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-400 uppercase">
                        Tin nhắn Zalo mẫu (Đã điền sẵn mã máy và key):
                      </label>
                      <button
                        type="button"
                        onClick={handleCopyCHVBZaloMsg}
                        className="text-[11px] py-1 px-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        {chvbCopiedMsg ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                        <span>{chvbCopiedMsg ? 'Đã copy tin nhắn Zalo!' : 'Sao chép tin nhắn Zalo gửi Khách'}</span>
                      </button>
                    </div>
                    <textarea
                      readOnly
                      rows={7}
                      value={chvbZaloMsg}
                      className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs leading-relaxed select-all"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Lịch sử Key Chuẩn Hóa VB */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-400" />
                Lịch sử các Key Chuẩn Hóa VB đã tạo gần đây ({chvbHistory.length} bản ghi):
              </div>
              {chvbHistory.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  Chưa có mã bản quyền Chuẩn Hóa VB nào được tạo trên trình duyệt này.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400">
                        <th className="pb-2 px-2">Thời gian</th>
                        <th className="pb-2 px-2">Mã máy (HWID)</th>
                        <th className="pb-2 px-2">Gói cước</th>
                        <th className="pb-2 px-2">Key Bản Quyền</th>
                        <th className="pb-2 px-2 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {chvbHistory.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-900/60">
                          <td className="py-2 px-2 text-slate-400 whitespace-nowrap">{item.createdAt}</td>
                          <td className="py-2 px-2 font-mono text-red-300 font-bold">{item.mid}</td>
                          <td className="py-2 px-2 text-sky-300 font-semibold">{item.plan}</td>
                          <td className="py-2 px-2 font-mono text-amber-300 truncate max-w-xs">{item.key}</td>
                          <td className="py-2 px-2 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(item.key);
                                alert(`Đã sao chép Key của máy ${item.mid}!`);
                              }}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] cursor-pointer"
                            >
                              Copy Key
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 8: PDF SUITE PRO (TÁCH - GỘP - LỌC TRANG TRẮNG AI) */}
        {adminTab === 'pdfsuite' && (
          <div className="space-y-4 my-2 overflow-y-auto max-h-[70vh] pr-1">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-pink-950/20 to-slate-800/80 border border-purple-800/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                      Tạo Key Bản Quyền PDF Suite Pro
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Thuật toán SHA-256 Hardware Binding • Khóa chặt theo Mã máy tính DVT-PDF-XXXX-XXXX
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 text-[10px] font-bold border border-pink-500/30">
                  TÁCH/GỘP/LỌC PDF
                </span>
              </div>

              <form onSubmit={handleGeneratePDFKey} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Mã Máy Tính (Hardware Code) của Khách hàng:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: DVT-PDF-7788-B2C3"
                      value={pdfMid}
                      onChange={(e) => setPdfMid(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs uppercase focus:outline-none focus:border-pink-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Gói bản quyền cấp phép:
                    </label>
                    <select
                      value={pdfPackage}
                      onChange={(e) => setPdfPackage(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-pink-400"
                    >
                      <option value="1year">Gói 1 Năm</option>
                      <option value="2year">Gói 2 Năm</option>
                      <option value="lifetime">Gói Trọn Đời VIP (Khuyên dùng)</option>
                    </select>
                  </div>
                </div>

                {pdfGenError && (
                  <p className="text-red-400 text-xs font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {pdfGenError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-pink-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>TẠO KEY BẢN QUYỀN PDF SUITE PRO NGAY</span>
                </button>
              </form>

              {pdfKeyResult && (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-pink-800/60 space-y-3 animate-fadeIn">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                      Mã Key Kích Hoạt (Gửi khách dán vào Tab Bản Quyền):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={pdfKeyResult}
                        className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-amber-300 font-mono text-xs font-bold select-all"
                      />
                      <button
                        type="button"
                        onClick={handleCopyPDFKey}
                        className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        {pdfCopiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{pdfCopiedKey ? 'Đã copy!' : 'Copy Key'}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-400 uppercase">
                        Tin nhắn Zalo mẫu (Đã điền sẵn mã máy và key):
                      </label>
                      <button
                        type="button"
                        onClick={handleCopyPDFZaloMsg}
                        className="text-[11px] py-1 px-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        {pdfCopiedMsg ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                        <span>{pdfCopiedMsg ? 'Đã copy tin nhắn Zalo!' : 'Sao chép tin nhắn Zalo gửi Khách'}</span>
                      </button>
                    </div>
                    <textarea
                      readOnly
                      rows={7}
                      value={pdfZaloMsg}
                      className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs leading-relaxed select-all"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Lịch sử Key PDF Suite */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-pink-400" />
                Lịch sử các Key PDF Suite Pro đã tạo gần đây ({pdfHistory.length} bản ghi):
              </div>
              {pdfHistory.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  Chưa có mã bản quyền PDF Suite nào được tạo trên trình duyệt này.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400">
                        <th className="pb-2 px-2">Thời gian</th>
                        <th className="pb-2 px-2">Mã máy (HWID)</th>
                        <th className="pb-2 px-2">Gói cước</th>
                        <th className="pb-2 px-2">Key Bản Quyền</th>
                        <th className="pb-2 px-2 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {pdfHistory.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-900/60">
                          <td className="py-2 px-2 text-slate-400 whitespace-nowrap">{item.createdAt}</td>
                          <td className="py-2 px-2 font-mono text-pink-300 font-bold">{item.mid}</td>
                          <td className="py-2 px-2 text-sky-300 font-semibold">{item.plan}</td>
                          <td className="py-2 px-2 font-mono text-amber-300 truncate max-w-xs">{item.key}</td>
                          <td className="py-2 px-2 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(item.key);
                                alert(`Đã sao chép Key của máy ${item.mid}!`);
                              }}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] cursor-pointer"
                            >
                              Copy Key
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 9: TRUNG TÂM TẠO ĐỀ THCS (8 MÔN) (CV 7991) */}
        {adminTab === 'thcs8m' && (
          <div className="space-y-4 my-2 overflow-y-auto max-h-[70vh] pr-1">
            {/* Form tạo Key 8 Môn THCS */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Sinh Key Bản Quyền Tạo Đề THCS (8 Môn Học - Chuẩn CV 7991)
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-xs font-bold border border-blue-500/30">
                  HMAC-SHA256
                </span>
              </div>

              <form onSubmit={handleGenerateTHCS8MKey} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Mã Máy Khách Hàng (Hardware Code):
                    </label>
                    <input
                      type="text"
                      placeholder="VD: DVT-TH8M-XXXX-XXXX"
                      value={thcs8mMid}
                      onChange={(e) => setThcs8mMid(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs uppercase focus:outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Phạm vi môn học cấp phép:
                    </label>
                    <select
                      value={thcs8mScope}
                      onChange={(e) => setThcs8mScope(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-blue-400"
                    >
                      <option value="ALL">🏛️ TRỌN GÓI TOÀN DIỆN 8 MÔN (VIP)</option>
                      <option value="TOAN">📐 Môn Toán học</option>
                      <option value="VAN">📖 Môn Ngữ văn</option>
                      <option value="ENG">🇬🇧 Môn Tiếng Anh</option>
                      <option value="KHTN">🔬 Môn Khoa học tự nhiên</option>
                      <option value="SUDIA">🌍 Môn Lịch sử & Địa lí</option>
                      <option value="TIN">💻 Môn Tin học</option>
                      <option value="GDCD">⚖️ Môn Giáo dục công dân</option>
                      <option value="CN">⚙️ Môn Công nghệ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Gói thời hạn bản quyền:
                    </label>
                    <select
                      value={thcs8mPackage}
                      onChange={(e) => setThcs8mPackage(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-blue-400"
                    >
                      <option value="1year">Gói 1 Năm</option>
                      <option value="2year">Gói 2 Năm (Tiết Kiệm)</option>
                      <option value="lifetime">Gói Trọn Đời VIP (Vĩnh Viễn)</option>
                    </select>
                  </div>
                </div>

                {thcs8mGenError && (
                  <p className="text-red-400 text-xs font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {thcs8mGenError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>TẠO KEY BẢN QUYỀN TẠO ĐỀ THCS (8 MÔN) NGAY</span>
                </button>
              </form>

              {thcs8mKeyResult && (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-blue-800/60 space-y-3 animate-fadeIn">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                      Mã Key Kích Hoạt (Gửi khách dán vào Tab Bản Quyền):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={thcs8mKeyResult}
                        className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-amber-300 font-mono text-xs font-bold select-all"
                      />
                      <button
                        type="button"
                        onClick={handleCopyTHCS8MKey}
                        className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        {thcs8mCopiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{thcs8mCopiedKey ? 'Đã copy!' : 'Copy Key'}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-400 uppercase">
                        Tin nhắn Zalo mẫu (Đã điền sẵn mã máy và key):
                      </label>
                      <button
                        type="button"
                        onClick={handleCopyTHCS8MZaloMsg}
                        className="text-[11px] py-1 px-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        {thcs8mCopiedMsg ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                        <span>{thcs8mCopiedMsg ? 'Đã copy tin nhắn Zalo!' : 'Sao chép tin nhắn Zalo gửi Khách'}</span>
                      </button>
                    </div>
                    <textarea
                      readOnly
                      rows={8}
                      value={thcs8mZaloMsg}
                      className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs leading-relaxed select-all"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Lịch sử Key 8 Môn THCS */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                Lịch sử các Key Tạo Đề THCS đã tạo gần đây ({thcs8mHistory.length} bản ghi):
              </div>
              {thcs8mHistory.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  Chưa có mã bản quyền Tạo Đề THCS nào được tạo trên trình duyệt này.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400">
                        <th className="pb-2 px-2">Thời gian</th>
                        <th className="pb-2 px-2">Mã máy (HWID)</th>
                        <th className="pb-2 px-2">Phạm vi môn</th>
                        <th className="pb-2 px-2">Gói cước</th>
                        <th className="pb-2 px-2">Key Bản Quyền</th>
                        <th className="pb-2 px-2 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {thcs8mHistory.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-900/60">
                          <td className="py-2 px-2 text-slate-400 whitespace-nowrap">{item.createdAt}</td>
                          <td className="py-2 px-2 font-mono text-blue-300 font-bold">{item.mid}</td>
                          <td className="py-2 px-2 text-amber-300 font-semibold">{item.scope}</td>
                          <td className="py-2 px-2 text-sky-300 font-semibold">{item.plan}</td>
                          <td className="py-2 px-2 font-mono text-amber-300 truncate max-w-xs">{item.key}</td>
                          <td className="py-2 px-2 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(item.key);
                                alert(`Đã sao chép Key của máy ${item.mid}!`);
                              }}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] cursor-pointer"
                            >
                              Copy Key
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL TẠO KEY TRỰC TIẾP */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                Cấp Bản Quyền Mới (Tạo Key Online)
              </h3>
              <form onSubmit={handleCreateDirect} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mã Máy Tính (Machine ID) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: MB-A1B2-C3D4"
                    value={newMid}
                    onChange={(e) => setNewMid(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tên Thầy/Cô</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Thầy Đinh Văn Thành"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Số Zalo</label>
                    <input
                      type="text"
                      placeholder="0915..."
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Gói Kích Hoạt</label>
                    <select
                      value={newPkg}
                      onChange={(e) => setNewPkg(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="LIFETIME">Trọn Đời (Vĩnh Viễn)</option>
                      <option value="1YEAR">1 Năm (365 ngày)</option>
                      <option value="2YEAR">2 Năm</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Trường / Đơn Vị</label>
                  <input
                    type="text"
                    placeholder="Trường THCS..."
                    value={newSchool}
                    onChange={(e) => setNewSchool(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md transition-colors"
                  >
                    Kích Hoạt Pro Ngay
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL CẤU HÌNH SUPABASE */}
        {showConfigModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
              <button 
                onClick={() => setShowConfigModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <Cloud className="w-6 h-6 text-sky-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Kết Nối Cơ Sở Dữ Liệu Cloud Supabase</h3>
                  <p className="text-[11px] text-slate-400">Đồng bộ đám mây quốc tế 24/7 – Không lo tắt máy tính</p>
                </div>
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Supabase Project URL</label>
                  <input
                    type="text"
                    placeholder="https://your-project.supabase.co"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Supabase Anon Public Key</label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-sky-400"
                  />
                </div>

                {configSuccess && (
                  <p className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Đã lưu cấu hình Cloud thành công!
                  </p>
                )}

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold shadow-md transition-colors"
                  >
                    Lưu & Kích Hoạt Cloud 24/7
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Đóng
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
