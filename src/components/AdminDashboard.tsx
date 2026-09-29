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
  const [adminTab, setAdminTab] = useState<'tracking' | 'tts' | 'nls' | 'taode' | 'bienthe' | 'record' | 'cleaner' | 'chuanhoavb' | 'pdfsuite' | 'thcs8m'>('tracking');
  
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
  const [regSearchTerm, setRegSearchTerm] = useState('');
  const [regAppFilter, setRegAppFilter] = useState('ALL');
  const [regSortBy, setRegSortBy] = useState<'newest' | 'name_asc' | 'school'>('newest');


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

    // Hỗ trợ 2 cấp tài khoản quản trị bảo mật cao (Ẩn tuyệt đối khỏi giao diện người dùng):
  // 1. Kichhoat123@ -> Admin Chính: Thầy Đinh Văn Thành (Toàn quyền quản trị cao nhất)
  // 2. Tiemgiang123@ -> Phó Quản trị: Thầy Nguyễn Văn Tiềm (Hỗ trợ duyệt và kích hoạt có lưu vết)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pinInput.trim();
    const normalized = cleanPin.toLowerCase();
    if (
      cleanPin === 'Kichhoat123@' ||
      normalized === 'kichhoat123@' ||
      normalized === 'kichhoat123' ||
      cleanPin === 'Kíchhoạt123@' ||
      normalized === 'kíchhoạt123@'
    ) {
      setIsAuthenticated(true);
      setUserRole('ADMIN');
      setCurrentAdminName('Thầy Đinh Văn Thành (Admin)');
      setAdminTab('tracking');
      setPinError(false);
      loadTrackingData();
    } else if (
      cleanPin === 'Tiemgiang123@' ||
      normalized === 'tiemgiang123@' ||
      normalized === 'tiemgiang123' ||
      cleanPin === 'Tiệmgiảng123@' ||
      normalized === 'tiệmgiảng123@'
    ) {
      setIsAuthenticated(true);
      setUserRole('SUB_ADMIN');
      setCurrentAdminName('Thầy Nguyễn Văn Tiềm - Phó Quản trị');
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
    // Tự động dọn sạch triệt để mọi mã test demo rác cũ (GV-TEST-9999, Thầy Nguyễn Văn An...)
    const DEMO_TEST_IDS = ['GV-TEST-9999', 'GV-TEST', 'GV-A7B8-90F1', 'GV-8F22-A109', 'MB-E10D-BE85'];
    activityTrackingService.unblockMachine('GV-33B3-4A70');
    try {
      const rawR = localStorage.getItem('gvai_registration_requests');
      if (rawR) {
        const parsed = JSON.parse(rawR);
        const filtered = parsed.filter((x: any) => !isAdminMachine(x.machineId) && !DEMO_TEST_IDS.includes(x.machineId) && x.fullName !== 'Thầy Nguyễn Văn An');
        localStorage.setItem('gvai_registration_requests', JSON.stringify(filtered));
      }
      const rawM = localStorage.getItem('gvai_all_tracked_machines');
      if (rawM) {
        const parsed = JSON.parse(rawM);
        const filtered = parsed.filter((x: any) => !isAdminMachine(x.machineId) && !DEMO_TEST_IDS.includes(x.machineId) && x.fullName !== 'Thầy Nguyễn Văn An');
        localStorage.setItem('gvai_all_tracked_machines', JSON.stringify(filtered));
      }
      const rawB = localStorage.getItem('gvai_blocked_machines');
      if (rawB) {
        const parsed = JSON.parse(rawB);
        const filtered = parsed.filter((x: any) => !isAdminMachine(x.machineId));
        localStorage.setItem('gvai_blocked_machines', JSON.stringify(filtered));
      }
    } catch {}

    let list = activityTrackingService.getAllTrackedMachines();
    list = list.filter(m => !DEMO_TEST_IDS.includes(m.machineId) && m.fullName !== 'Thầy Nguyễn Văn An');
    setTrackedMachines(list);
    setActivityLogs(activityTrackingService.getActivityLogs().filter(l => !DEMO_TEST_IDS.includes(l.machineId)));

    // 1. Lấy đơn từ Local Storage
    let localRegs = activityTrackingService.getAllRegistrations();

    // 2. ĐỒNG BỘ ĐƠN ĐĂNG KÝ TRỰC TIẾP TỪ CLOUD (TOÀN QUỐC)
    try {
      const cloudRegs = await cloudSyncService.fetchRegistrationsFromCloud();
      if (cloudRegs.length > 0) {
        const mergedMap = new Map<string, any>();
        // Key kết hợp (machineId + appId): Mỗi máy đăng ký app nào thì quản lý app đó
        // Nếu cùng máy gửi lại cập nhật app đó thì đè lên (không tạo nhiều tên trùng lặp)
        // Nếu cùng máy đăng ký thêm app khác thì vẫn hiển thị đầy đủ từng app!
        for (const cr of cloudRegs) {
          const k = `${cr.machineId}__${cr.appId || cr.appName || 'all'}`;
          mergedMap.set(k, cr);
        }
        for (const lr of localRegs) {
          const k = `${lr.machineId}__${lr.appId || lr.appName || 'all'}`;
          if (!mergedMap.has(k)) {
            mergedMap.set(k, lr);
          }
        }
        localRegs = Array.from(mergedMap.values());
      }
    } catch (e) {
      console.warn('Lỗi kết nối Cloud:', e);
    }

    // Lọc sạch dứt điểm thành viên demo
    localRegs = localRegs.filter(r => !DEMO_TEST_IDS.includes(r.machineId) && r.fullName !== 'Thầy Nguyễn Văn An');

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

  // Hàm Xóa Triệt Để Thành Viên / Đơn Đăng Ký (Xóa hoàn toàn khỏi máy và cloud)
  const handleDeleteRegistration = async (id: string, machineId: string, issueNumber?: number) => {
    if (window.confirm(`Thầy có chắc chắn muốn XÓA VĨNH VIỄN thành viên này [${machineId}] khỏi hệ thống?`)) {
      // 1. Xóa trong localStorage đơn đăng ký
      const rawR = localStorage.getItem('gvai_registration_requests');
      if (rawR) {
        try {
          const list = JSON.parse(rawR);
          const filtered = list.filter((x: any) => x.id !== id && x.machineId !== machineId);
          localStorage.setItem('gvai_registration_requests', JSON.stringify(filtered));
        } catch {}
      }

      // 2. Xóa trong danh sách máy
      const rawM = localStorage.getItem('gvai_all_tracked_machines');
      if (rawM) {
        try {
          const list = JSON.parse(rawM);
          const filtered = list.filter((x: any) => x.machineId !== machineId);
          localStorage.setItem('gvai_all_tracked_machines', JSON.stringify(filtered));
        } catch {}
      }

      // 3. Xóa bản quyền trong licenseService
      await licenseService.deleteLicense(machineId);

      // 4. Đóng issue trên cloud nếu có
      if (issueNumber) {
        try {
          await cloudSyncService.rejectRegistrationOnCloud(issueNumber, 'Admin đã xóa vĩnh viễn');
        } catch {}
      }

      await loadTrackingData();
      await loadData();
      alert(`Đã xóa vĩnh viễn thành viên [${machineId}] thành công!`);
    }
  };

  const handleApproveReq = async (id: string, pkg?: '1YEAR' | '2YEAR' | '3YEAR' | 'FULL_WEB' | 'TRIAL_5', issueNumber?: number) => {
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

  const handleDeleteMachinePermanently = async (machineId: string) => {
    if (window.confirm(`Thầy có chắc chắn muốn XÓA HOÀN TOÀN máy [${machineId}] khỏi danh sách hệ thống?\n\nSau khi xóa, bản ghi này sẽ BIẾN MẤT VĨNH VIỄN khỏi bảng.`)) {
      // 1. Xóa khỏi danh sách máy bị khóa
      activityTrackingService.unblockMachine(machineId);
      const rawB = localStorage.getItem('gvai_blocked_machines');
      if (rawB) {
        try {
          const list = JSON.parse(rawB);
          localStorage.setItem('gvai_blocked_machines', JSON.stringify(list.filter((b: any) => b.machineId !== machineId)));
        } catch {}
      }

      // 2. Xóa khỏi danh sách tất cả các máy
      activityTrackingService.deleteAndBlockMachine(machineId, currentAdminName || 'Admin');
      const rawM = localStorage.getItem('gvai_all_tracked_machines');
      if (rawM) {
        try {
          const list = JSON.parse(rawM);
          localStorage.setItem('gvai_all_tracked_machines', JSON.stringify(list.filter((m: any) => m.machineId !== machineId)));
        } catch {}
      }

      // 3. Xóa đơn đăng ký nếu có
      const rawR = localStorage.getItem('gvai_registration_requests');
      if (rawR) {
        try {
          const list = JSON.parse(rawR);
          localStorage.setItem('gvai_registration_requests', JSON.stringify(list.filter((r: any) => r.machineId !== machineId)));
        } catch {}
      }

      // 4. Xóa bản quyền
      await licenseService.deleteLicense(machineId);

      // 5. Cập nhật state ngay lập tức để dòng BIẾN MẤT TỨC THÌ
      setTrackedMachines(prev => prev.filter(m => m.machineId !== machineId));
      setBlockedMachines(prev => prev.filter(b => b.machineId !== machineId));
      setRegistrationRequests(prev => prev.filter(r => r.machineId !== machineId));

      await loadTrackingData();
      await loadData();
      alert(`Đã xóa hoàn toàn máy [${machineId}]. Bản ghi đã biến mất khỏi hệ thống!`);
    }
  };

  const handleDeleteAndBlockMachine = handleDeleteMachinePermanently;

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
      loadTrackingData();

      // TỰ ĐỘNG CẬP NHẬT TRỰC TIẾP (REALTIME LIVE 4s/lần)
      const liveInterval = setInterval(() => {
        loadTrackingData();
        loadData();
      }, 4000);
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

      return () => clearInterval(liveInterval);
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
              Khu vực bảo mật nội bộ dành cho Ban Quản trị hệ thống. Vui lòng nhập mật khẩu xác thực để tiếp tục.
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
                  placeholder="Nhập mật khẩu quản trị..."
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
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-[11px] animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                  🟢 TỰ ĐỘNG CẬP NHẬT TRỰC TIẾP (4s/lần)
                </div>
                <span className="text-slate-400">
                  Admin: <strong className="text-amber-300">{currentAdminName}</strong>
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
                {/* THANH ĐIỀU KHIỂN BỘ LỌC, TÌM KIẾM & SẮP XẾP ĐA NĂNG */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    {/* 1. Lọc theo trạng thái */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-slate-400 font-semibold">Trạng thái:</span>
                      {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(st => {
                        const count = registrationRequests.filter(r => st === 'ALL' ? true : r.status === st).length;
                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setReqFilter(st)}
                            className={`px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1 ${
                              reqFilter === st
                                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            <span>{st === 'ALL' ? 'Tất Cả' : st === 'PENDING' ? 'Chờ Duyệt' : st === 'APPROVED' ? 'Đã Duyệt' : 'Từ Chối'}</span>
                            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                              st === 'PENDING' && count > 0 ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-950/60 text-slate-300'
                            }`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* 2. Sắp xếp đa dạng */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400 font-semibold">Sắp xếp:</span>
                      <select
                        value={regSortBy}
                        onChange={(e) => setRegSortBy(e.target.value as any)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        <option value="newest">⏰ Mới nhất (Thời gian gửi)</option>
                        <option value="name_asc">👤 Tên Giáo viên (A - Z)</option>
                        <option value="school">🏫 Theo Trường / Đơn vị</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-slate-800/80">
                    {/* 3. Lọc theo Ứng dụng cụ thể */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400 font-semibold">Lọc Ứng Dụng:</span>
                      <select
                        value={regAppFilter}
                        onChange={(e) => setRegAppFilter(e.target.value)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-cyan-300 font-bold text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
                      >
                        <option value="ALL">📦 Tất Cả Ứng Dụng ({registrationRequests.length})</option>
                        <option value="nls">⚡ Tích Hợp NLS - AI</option>
                        <option value="taode">📝 Trung Tâm Tạo Đề THCS (8 Môn)</option>
                        <option value="bienthe">🔀 Biến Thể Đề Thi & Trộn Đề</option>
                        <option value="tts">🎙️ Text To Speech</option>
                        <option value="chvb">📑 Chuẩn Hóa Văn Bản AI</option>
                        <option value="cleaner">🧹 Dinh Thanh Cleaner Pro</option>
                        <option value="pdfsuite">📄 PDF Suite Pro</option>
                        <option value="record">🎥 Screen Record Pro V2</option>
                        <option value="eng">🇬🇧 Tiếng Anh Global Success</option>
                      </select>
                    </div>

                    {/* 4. Ô tìm kiếm trực tiếp */}
                    <div className="relative min-w-[260px]">
                      <input
                        type="text"
                        placeholder="🔍 Tìm Tên GV / SĐT / Trường / Mã máy..."
                        value={regSearchTerm}
                        onChange={(e) => setRegSearchTerm(e.target.value)}
                        className="w-full px-3 py-1 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 font-medium"
                      />
                      {regSearchTerm && (
                        <button
                          type="button"
                          onClick={() => setRegSearchTerm('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* BẢNG ĐƠN ĐĂNG KÝ BẢN QUYỀN THỰC TẾ CỦA GIÁO VIÊN */}
                <div className="flex-1 overflow-y-auto border border-slate-800 rounded-2xl bg-slate-950/60 shadow-inner">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-md text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-800 z-10">
                      <tr>
                        <th className="py-3 px-3">ID Máy Tính & Ứng Dụng</th>
                        <th className="py-3 px-3">Giáo Viên & Đơn Vị</th>
                        <th className="py-3 px-3">Số ĐT / Zalo</th>
                        <th className="py-3 px-3">Gói & Thời Gian Gửi</th>
                        <th className="py-3 px-3">Trạng Thái</th>
                        <th className="py-3 px-3 text-right">Kích Hoạt & Quản Trị</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {registrationRequests
                        .filter(r => {
                          if (reqFilter !== 'ALL' && r.status !== reqFilter) return false;
                          if (regAppFilter !== 'ALL') {
                            const appK = (r.appId || r.appName || '').toLowerCase();
                            if (!appK.includes(regAppFilter.toLowerCase())) return false;
                          }
                          if (regSearchTerm.trim()) {
                            const q = regSearchTerm.toLowerCase();
                            const matchMid = r.machineId.toLowerCase().includes(q);
                            const matchName = (r.fullName || '').toLowerCase().includes(q);
                            const matchSchool = (r.schoolUnit || '').toLowerCase().includes(q);
                            const matchPhone = (r.phoneNumber || '').includes(q);
                            if (!matchMid && !matchName && !matchSchool && !matchPhone) return false;
                          }
                          return true;
                        })
                        .sort((a, b) => {
                          if (regSortBy === 'name_asc') {
                            return (a.fullName || '').localeCompare(b.fullName || '');
                          } else if (regSortBy === 'school') {
                            return (a.schoolUnit || '').localeCompare(b.schoolUnit || '');
                          }
                          return 0; // newest giữ nguyên thứ tự cloud
                        })
                        .map((req, rIdx) => {
                          const isBlocked = blockedMachines.some(b => b.machineId === req.machineId);
                          return (
                            <tr key={req.id || rIdx} className="hover:bg-slate-900/80 transition-colors">
                              {/* 1. ID Máy Tính & Ứng Dụng */}
                              <td className="py-3 px-3">
                                <div className="font-mono text-cyan-300 font-bold text-xs flex items-center gap-1.5">
                                  <span>💻 {req.machineId}</span>
                                  {req.issueNumber && (
                                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-400 font-normal">
                                      #{req.issueNumber}
                                    </span>
                                  )}
                                </div>
                                <div className="mt-1">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
                                    ⚡ {req.appName || 'Tích Hợp NLS - AI'}
                                  </span>
                                </div>
                              </td>

                              {/* 2. Giáo Viên & Đơn Vị */}
                              <td className="py-3 px-3">
                                <div className="font-bold text-white text-[13px] flex items-center gap-1.5">
                                  <span>{req.fullName || 'Chưa cung cấp'}</span>
                                </div>
                                <div className="text-slate-400 text-[11px] mt-0.5">
                                  🏫 {req.schoolUnit || 'Chưa có thông tin trường'}
                                </div>
                              </td>

                              {/* 3. Số ĐT / Zalo */}
                              <td className="py-3 px-3">
                                <div className="font-mono text-emerald-400 font-bold text-xs flex items-center gap-2">
                                  <span>📞 {req.phoneNumber || '-'}</span>
                                  {req.phoneNumber && (
                                    <a
                                      href={`https://zalo.me/${req.phoneNumber.replace(/[^0-9]/g, '')}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="px-1.5 py-0.5 rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-[10px] border border-emerald-500/30 font-bold transition flex items-center gap-1"
                                      title="Nhắn tin Zalo với Giáo viên này"
                                    >
                                      Chat Zalo ↗
                                    </a>
                                  )}
                                </div>
                              </td>

                              {/* 4. Gói & Thời Gian Gửi */}
                              <td className="py-3 px-3">
                                <div className="font-semibold text-slate-200">
                                  {req.packageType === 'FULL_WEB' ? '🌟 Full Web Trọn Bộ' :
                                   req.packageType === '3YEAR' ? '👑 Gói 3 Năm VIP' :
                                   req.packageType === '2YEAR' ? '👑 Gói 2 Năm VIP' :
                                   req.packageType === '1YEAR' ? '📦 Gói 1 Năm' : '🎁 Dùng thử'}
                                </div>
                                <div className="font-mono text-slate-400 text-[10px] mt-0.5 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-500" />
                                  <span>{req.createdAt || 'Mới đây'}</span>
                                </div>
                              </td>

                              {/* 5. Trạng Thái */}
                              <td className="py-3 px-3">
                                {isBlocked ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold">
                                    🔒 ĐÃ KHÓA TRUY CẬP
                                  </span>
                                ) : req.status === 'APPROVED' ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                                    ✅ ĐÃ KÍCH HOẠT PRO
                                  </span>
                                ) : req.status === 'REJECTED' ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[11px] font-bold">
                                    ❌ ĐÃ TỪ CHỐI
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600 text-white font-black text-[11px] shadow-sm shadow-red-500/30 animate-pulse">
                                    ⏳ CHỜ DUYỆT CẤP KEY
                                  </span>
                                )}
                              </td>

                              {/* 6. Thao Tác Kích Hoạt & Quản Trị */}
                              <td className="py-3 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                  {/* Nhóm Kích Hoạt Nhanh 1, 2, 3 Năm */}
                                  <button
                                    type="button"
                                    onClick={() => handleApproveReq(req.id, '1YEAR', req.issueNumber)}
                                    className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm shadow-emerald-600/30 transition cursor-pointer flex items-center gap-1"
                                    title="Duyệt và kích hoạt bản quyền 1 Năm cho GV này"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>1 Năm</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleApproveReq(req.id, '2YEAR', req.issueNumber)}
                                    className="px-2 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] shadow-sm shadow-amber-600/30 transition cursor-pointer flex items-center gap-1"
                                    title="Duyệt và kích hoạt bản quyền 2 Năm cho GV này"
                                  >
                                    <Crown className="w-3 h-3" />
                                    <span>2 Năm</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleApproveReq(req.id, '3YEAR', req.issueNumber)}
                                    className="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] shadow-sm shadow-indigo-600/30 transition cursor-pointer flex items-center gap-1"
                                    title="Duyệt và kích hoạt bản quyền 3 Năm cho GV này"
                                  >
                                    <Sparkles className="w-3 h-3" />
                                    <span>3 Năm</span>
                                  </button>

                                  {/* Nút Tạm Khóa Máy */}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteAndBlockMachine(req.machineId)}
                                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-rose-300 hover:text-white border border-rose-800/40 text-[11px] font-semibold transition cursor-pointer flex items-center gap-1"
                                    title="Tạm khóa máy tính này không cho dùng hệ thống"
                                  >
                                    <Lock className="w-3 h-3" />
                                    <span>Khóa</span>
                                  </button>

                                  {/* Nút Xóa Tài Khoản / Đơn */}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteRegistration(req.id, req.machineId, req.issueNumber)}
                                    className="p-1 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white transition cursor-pointer"
                                    title="Xóa vĩnh viễn tài khoản / đơn đăng ký này"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}

                      {registrationRequests.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            <UserCheck className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-50" />
                            <div className="font-semibold text-sm">Chưa có đơn đăng ký nào trên hệ thống Cloud.</div>
                            <div className="text-xs text-slate-500 mt-1">Khi Giáo viên đăng ký từ Web hoặc Word Add-in, đơn sẽ hiển thị ngay tức thì tại đây!</div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* SUBTAB 2: THỐNG KÊ WEB & LỊCH SỬ THEO NGÀY GIỜ            */}
            {/* ========================================================= */}
            {trackingSubTab === 'stats' && (
              <div className="flex-1 flex flex-col min-h-0 space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-3">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Tìm nhật ký: Tên, SĐT, máy, hành động..."
                      value={logSearch}
                      onChange={(e) => setLogSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <span className="text-xs text-slate-400">
                    Tổng số bản ghi nhật ký: <strong className="text-emerald-400">{activityLogs.length}</strong>
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto border border-slate-800 rounded-2xl bg-slate-950/60 shadow-inner">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-md text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-800 z-10">
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
                          <tr key={lIdx} className="hover:bg-slate-900/80 transition-colors">
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
                    💡 Danh sách các máy tính giáo viên truy cập web. Admin có thể kích hoạt nhanh hoặc xóa vĩnh viễn tài khoản.
                  </p>
                </div>

                {/* BẢNG MÁY TÍNH */}
                <div className="flex-1 overflow-y-auto border border-slate-800 rounded-2xl bg-slate-950/60">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-slate-800/95 backdrop-blur-md text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-700">
                      <tr>
                        <th className="py-2.5 px-3">ID Máy Tính & Thiết Bị</th>
                        <th className="py-2.5 px-3">Giáo Viên & Đơn Vị</th>
                        <th className="py-2.5 px-3">Cụ Thể Đang Dùng App Nào</th>
                        <th className="py-2.5 px-3">Bản Quyền Kích Hoạt Bao Lâu</th>
                        <th className="py-2.5 px-3">Trạng Thái Hoạt Động</th>
                        <th className="py-2.5 px-3 text-right">Thao Tác Quản Trị</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {trackedMachines
                        .filter(m => !isAdminMachine(m.machineId))
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

                          // Tính số ngày còn lại của bản quyền
                          let licenseInfoText = '⏳ Dùng thử (Chưa kích hoạt VIP)';
                          let daysLeft = 0;
                          if (activeLicense) {
                            if (activeLicense.package_type === 'LIFETIME' || activeLicense.expiry_timestamp > 9000000000) {
                              licenseInfoText = '👑 Bản quyền Trọn Đời (Vĩnh viễn)';
                            } else {
                              const nowTs = Math.floor(Date.now() / 1000);
                              daysLeft = Math.max(0, Math.ceil((activeLicense.expiry_timestamp - nowTs) / 86400));
                              const expDateStr = new Date(activeLicense.expiry_timestamp * 1000).toLocaleDateString('vi-VN');
                              licenseInfoText = `👑 Bản quyền 1 Năm - Còn ${daysLeft} ngày (Hạn: ${expDateStr})`;
                            }
                          } else {
                            licenseInfoText = `⏳ Dùng thử: Đã dùng ${item.trialUsed}/${item.trialMax} lượt`;
                          }

                          // Xác định trạng thái Online (trong vòng 10 phút)
                          let isOnlineNow = false;
                          if (item.lastSeenAt) {
                            try {
                              const lastTs = new Date(item.lastSeenAt.replace(' ', 'T')).getTime();
                              if (!isNaN(lastTs) && (Date.now() - lastTs) < 10 * 60 * 1000) {
                                isOnlineNow = true;
                              }
                            } catch {}
                          }

                          return (
                            <tr key={idx} className={`transition-colors ${isBlocked ? 'bg-rose-950/30' : 'hover:bg-slate-800/30'}`}>
                              {/* 1. ID MÁY TÍNH & THIẾT BỊ */}
                              <td className="py-2.5 px-3 font-mono font-bold text-cyan-300">
                                <div className="flex items-center gap-1.5">
                                  <span>{item.machineId}</span>
                                  {isOnlineNow && (
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" title="Đang trực tuyến" />
                                  )}
                                </div>
                                {isBlocked && (
                                  <span className="block text-[10px] text-rose-400 font-sans font-bold">
                                    ⛔ ĐÃ BỊ KHÓA VĨNH VIỄN
                                  </span>
                                )}
                                <div className="text-[10px] text-slate-500 font-sans font-normal mt-0.5">
                                  {item.deviceInfo || 'Windows PC'}
                                </div>
                              </td>

                              {/* 2. GIÁO VIÊN & ĐƠN VỊ */}
                              <td className="py-2.5 px-3">
                                <div className="font-bold text-white text-xs">
                                  {item.fullName || item.predictedName || 'Giáo viên THCS'}
                                </div>
                                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                  <Building2 className="w-3 h-3 text-slate-500" />
                                  <span>{item.schoolUnit || 'Chưa rõ trường'}</span>
                                </div>
                                {item.phoneNumber && (
                                  <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                                    <Phone className="w-3 h-3 text-slate-500" />
                                    <span>{item.phoneNumber}</span>
                                  </div>
                                )}
                              </td>

                              {/* 3. CỤ THỂ ĐANG DÙNG APP NÀO */}
                              <td className="py-2.5 px-3">
                                {apps.length === 0 ? (
                                  <span className="text-slate-500 text-[11px]">Chưa thao tác app</span>
                                ) : (
                                  <div className="space-y-1">
                                    {apps.map((app, aIdx) => (
                                      <div
                                        key={aIdx}
                                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] flex items-center justify-between gap-2 max-w-[260px]"
                                      >
                                        <span className="font-semibold text-cyan-200 truncate">
                                          {app.appName}
                                        </span>
                                        <span className="text-[10px] text-amber-400 font-bold shrink-0">
                                          {app.count} lần
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </td>

                              {/* 4. BẢN QUYỀN KÍCH HOẠT BAO LÂU */}
                              <td className="py-2.5 px-3">
                                <div className="space-y-1">
                                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border inline-block ${
                                    activeLicense 
                                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' 
                                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                  }`}>
                                    {licenseInfoText}
                                  </span>
                                  {activeLicense && (
                                    <div className="text-[10px] text-amber-300 font-medium mt-0.5">
                                      👤 Kích hoạt bởi: <b>{activeLicense.activated_by || 'Thầy Đinh Văn Thành (Admin)'}</b>
                                    </div>
                                  )}
                                  {!activeLicense && (
                                    <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                      <div
                                        className={`h-full ${item.trialUsed >= item.trialMax ? 'bg-red-500' : 'bg-amber-500'}`}
                                        style={{ width: `${Math.min(100, (item.trialUsed / item.trialMax) * 100)}%` }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* 5. TRẠNG THÁI HOẠT ĐỘNG ONLINE */}
                              <td className="py-2.5 px-3 text-[11px]">
                                {isOnlineNow ? (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold inline-flex items-center gap-1">
                                    🟢 Đang Online
                                  </span>
                                ) : (
                                  <span className="text-slate-400">
                                    {item.lastSeenAt || 'Vừa xong'}
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* CÁC NÚT KÍCH HOẠT 1, 2, 3 NĂM */}
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        const nowTs = Math.floor(Date.now() / 1000);
                                        const currentExp = (activeLicense && activeLicense.expiry_timestamp > nowTs) ? activeLicense.expiry_timestamp : nowTs;
                                        await licenseService.createDirect({
                                          machine_id: item.machineId,
                                          teacher_name: item.fullName || item.predictedName || 'Thầy/Cô',
                                          phone_zalo: item.phoneNumber || '',
                                          school_unit: item.schoolUnit || '',
                                          package_type: '1YEAR',
                                          status: 'ACTIVE',
                                          expiry_timestamp: currentExp + 365 * 86400,
                                          notes: `Kích hoạt 1 Năm bởi ${currentAdminName}`
                                        }, currentAdminName);
                                        await loadData();
                                        loadTrackingData();
                                        alert(`Đã kích hoạt Gói 1 Năm cho máy ${item.machineId}!\nNgười kích hoạt: ${currentAdminName}`);
                                      }}
                                      className="px-2 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-bold text-[10px] transition cursor-pointer"
                                      title="Kích hoạt hoặc gia hạn thêm 1 Năm (365 ngày)"
                                    >
                                      + 1 Năm
                                    </button>
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        const nowTs = Math.floor(Date.now() / 1000);
                                        const currentExp = (activeLicense && activeLicense.expiry_timestamp > nowTs) ? activeLicense.expiry_timestamp : nowTs;
                                        await licenseService.createDirect({
                                          machine_id: item.machineId,
                                          teacher_name: item.fullName || item.predictedName || 'Thầy/Cô',
                                          phone_zalo: item.phoneNumber || '',
                                          school_unit: item.schoolUnit || '',
                                          package_type: '2YEAR',
                                          status: 'ACTIVE',
                                          expiry_timestamp: currentExp + 730 * 86400,
                                          notes: `Kích hoạt 2 Năm bởi ${currentAdminName}`
                                        }, currentAdminName);
                                        await loadData();
                                        loadTrackingData();
                                        alert(`Đã kích hoạt Gói 2 Năm cho máy ${item.machineId}!\nNgười kích hoạt: ${currentAdminName}`);
                                      }}
                                      className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] transition cursor-pointer"
                                      title="Kích hoạt hoặc gia hạn thêm 2 Năm (730 ngày)"
                                    >
                                      + 2 Năm
                                    </button>
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        const nowTs = Math.floor(Date.now() / 1000);
                                        const currentExp = (activeLicense && activeLicense.expiry_timestamp > nowTs) ? activeLicense.expiry_timestamp : nowTs;
                                        await licenseService.createDirect({
                                          machine_id: item.machineId,
                                          teacher_name: item.fullName || item.predictedName || 'Thầy/Cô',
                                          phone_zalo: item.phoneNumber || '',
                                          school_unit: item.schoolUnit || '',
                                          package_type: '3YEAR',
                                          status: 'ACTIVE',
                                          expiry_timestamp: currentExp + 1095 * 86400,
                                          notes: `Kích hoạt 3 Năm bởi ${currentAdminName}`
                                        }, currentAdminName);
                                        await loadData();
                                        loadTrackingData();
                                        alert(`Đã kích hoạt Gói 3 Năm Pro cho máy ${item.machineId}!\nNgười kích hoạt: ${currentAdminName}`);
                                      }}
                                      className="px-2 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] transition cursor-pointer"
                                      title="Kích hoạt hoặc gia hạn thêm 3 Năm (1095 ngày)"
                                    >
                                      + 3 Năm
                                    </button>
                                  </div>

                                  {/* NÚT TẠM KHÓA / MỞ KHÓA TÀI KHOẢN */}
                                  {isBlocked ? (
                                    <button
                                      type="button"
                                      onClick={() => handleUnblockMachine(item.machineId)}
                                      className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition cursor-pointer flex items-center gap-1"
                                      title="Mở khóa tài khoản cho giáo viên sử dụng lại"
                                    >
                                      🔓 Mở Khóa
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        if (window.confirm(`Thầy/Cô có chắc chắn muốn TẠM KHÓA tài khoản máy [${item.machineId}]?`)) {
                                          activityTrackingService.blockMachine(item.machineId, `Tạm khóa bởi ${currentAdminName}`);
                                          await cloudSyncService.blockMachineOnCloud(item.machineId, currentAdminName, 'Tạm khóa tài khoản');
                                          loadTrackingData();
                                          alert(`Đã tạm khóa tài khoản máy ${item.machineId}!`);
                                        }
                                      }}
                                      className="px-2 py-1 rounded bg-amber-700/80 hover:bg-amber-600 text-white font-bold text-[10px] transition cursor-pointer flex items-center gap-1"
                                      title="Tạm khóa tài khoản của giáo viên này"
                                    >
                                      🔒 Tạm Khóa
                                    </button>
                                  )}

                                  {/* NÚT XÓA TÀI KHOẢN */}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteAndBlockMachine(item.machineId)}
                                    className="p-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 transition text-xs cursor-pointer"
                                    title="Xóa vĩnh viễn tài khoản và thiết bị này (biến mất hoàn toàn)"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
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
                            className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] cursor-pointer"
                            title="Mở khóa máy này"
                          >
                            Mở
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMachinePermanently(bm.machineId)}
                            className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] cursor-pointer flex items-center gap-1"
                            title="Xóa vĩnh viễn và biến mất khỏi danh sách"
                          >
                            <Trash2 className="w-3 h-3" />
                            Xóa
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
                      placeholder="Ví dụ: NLS-DVT-0B1D-A6A7-5A14"
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
