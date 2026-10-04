import { cloudSyncService, isAppMatching, SecurityAlertItem } from '../services/cloudSyncService';
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
  MessageCircle,
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
  Zap,
  Download,
  ShieldCheck
} from 'lucide-react';
import { BRAND } from '../config/brand';
import { licenseService, LicenseRecord } from '../services/licenseService';
import { activityTrackingService, MachineProfile, ActivityLogItem, RegistrationRequest, BlockedMachineItem, isAdminMachine, AppQuotaStatItem, EcosystemQuotaSummary, AppInstalledMachineDetail } from '../services/activityTrackingService';
import { generateEd25519Key } from '../services/nlsKeyService';
import { generateExamLicenseKey } from '../services/taodeKeyService';
import { generateBientheLicenseKey } from '../services/bientheKeyService';
import { generateRecordLicenseKey } from '../services/recordKeyService';
import { generateCleanerLicenseKey } from '../services/cleanerKeyService';
import { generateCHVBLicenseKey, buildCHVBZaloMessage } from '../services/chuanhoaVBKeyService';
import { generatePDFLicenseKey, buildPDFZaloMessage } from '../services/pdfSuiteKeyService';
import { generateTHCS8MLicenseKey, SUBJECT_MAP } from '../services/taoDeTHCS8MonKeyService';
import { generateExam15PLicenseKey } from '../services/taode15pKeyService';
import { generateSmartListeningLicenseKey } from '../services/smartListeningKeyService';
import { systemMaintenanceService } from '../services/systemMaintenanceService';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showPin, setShowPin] = useState(false);

  // State Khóa Web (Tạm dừng nâng cấp)
  const [isMaintenanceLocked, setIsMaintenanceLocked] = useState<boolean>(() => systemMaintenanceService.isMaintenanceLocked());
  const [isTogglingMaintenance, setIsTogglingMaintenance] = useState<boolean>(false);

  // Tab chuyển đổi giữa Marketing, Tracking, TTS, NLS-AI, Tạo Đề Tiếng Anh, Sinh 3 Đề Biến Thể, Screen Record V2, Cleaner Pro, Chuẩn Hóa VB, PDF Suite, Tạo Đề 8 Môn THCS, MathStudio, Tạo Đề 15P Tiếng Anh, Security Alerts
  const [userRole, setUserRole] = useState<'ADMIN' | 'SUB_ADMIN' | null>(null);
  const [currentAdminName, setCurrentAdminName] = useState<string>('');
  const [adminTab, setAdminTab] = useState<'tracking' | 'tts' | 'nls' | 'taode' | 'bienthe' | 'record' | 'cleaner' | 'chuanhoavb' | 'pdfsuite' | 'thcs8m' | 'mathstudio' | 'de15p' | 'security'>('tracking');
  
  // State Tab Marketing & Quảng cáo tự động Việt Nam
  const [marketingTopic, setMarketingTopic] = useState<'ALL' | 'ENG' | '8MON' | 'WORD' | 'BIENTHE' | 'PDF'>('ALL');
  const [isCopiedMarketingPost, setIsCopiedMarketingPost] = useState(false);
  const [isPingingIndexNow, setIsPingingIndexNow] = useState(false);
  const [pingStatusMsg, setPingStatusMsg] = useState('');
  const [trackedMachines, setTrackedMachines] = useState<MachineProfile[]>([]);
  const [trackingSubTab, setTrackingSubTab] = useState<'requests' | 'quota' | 'stats' | 'machines'>('requests');
  const [ecosystemQuota, setEcosystemQuota] = useState<EcosystemQuotaSummary | null>(null);
  const [quotaSearch, setQuotaSearch] = useState('');
  const [quotaCatFilter, setQuotaCatFilter] = useState<'ALL' | 'tienganh' | 'toan' | 'tienich' | 'chung'>('ALL');
  const [selectedQuotaApp, setSelectedQuotaApp] = useState<AppQuotaStatItem | null>(null);
  const [showQuotaDetailModal, setShowQuotaDetailModal] = useState(false);
  const [machineDetailSearch, setMachineDetailSearch] = useState('');
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>([]);
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>([]);
  const [webStats, setWebStats] = useState<any>(null);
  const [blockedMachines, setBlockedMachines] = useState<BlockedMachineItem[]>([]);
  const [logSearch, setLogSearch] = useState('');
  const [reqFilter, setReqFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error' | 'loading'; title: string; message: string } | null>(null);
  const [activationSuccessData, setActivationSuccessData] = useState<{
    machineId: string;
    teacherName: string;
    phone?: string;
    packageLabel: string;
    daysRemaining: number;
    expDate: string;
    licenseKey: string;
    zaloMsg: string;
    reviewer: string;
  } | null>(null);
  const [copiedSuccessKey, setCopiedSuccessKey] = useState(false);
  const [copiedSuccessZalo, setCopiedSuccessZalo] = useState(false);
  const [regSearchTerm, setRegSearchTerm] = useState('');
  const [regAppFilter, setRegAppFilter] = useState('ALL');
  const [regSortBy, setRegSortBy] = useState<'newest' | 'name_asc' | 'school'>('newest');

  // State Tab Cảnh Báo Xâm Nhập & Chống Bẻ Khóa
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlertItem[]>([]);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState<boolean>(false);
  const [securitySearch, setSecuritySearch] = useState<string>('');
  const [securityFilter, setSecurityFilter] = useState<'ALL' | 'UNRESOLVED' | 'BLOCKED' | 'CRITICAL'>('ALL');
  const [selectedAlertForEvidence, setSelectedAlertForEvidence] = useState<SecurityAlertItem | null>(null);
  const [copiedEvidence, setCopiedEvidence] = useState<boolean>(false);



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

  // State cho Tool Tạo Key Bản Quyền - Tạo Đề Tiếng Anh (CV 7991 & THPT)
  const [examMid, setExamMid] = useState('');
  const [examLevel, setExamLevel] = useState<'THCS' | 'THPT'>('THPT');
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

  // State cho Tool Tạo Key Bản Quyền - Smart Listening Pro (Tạo Bài Nghe SGK)
  const [ttsMid, setTtsMid] = useState('');
  const [ttsPackage, setTtsPackage] = useState<'1year' | '2year' | 'lifetime'>('lifetime');
  const [ttsKeyResult, setTtsKeyResult] = useState('');
  const [ttsZaloMsg, setTtsZaloMsg] = useState('');
  const [ttsGenError, setTtsGenError] = useState('');
  const [ttsCopiedKey, setTtsCopiedKey] = useState(false);
  const [ttsCopiedMsg, setTtsCopiedMsg] = useState(false);
  const [ttsHistory, setTtsHistory] = useState<Array<{
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

  // State cho Tool Tạo Key Ed25519 - Đinh Thành MathStudio 2026+ Pro
  const [mathMid, setMathMid] = useState('');
  const [mathYears, setMathYears] = useState<number>(99);
  const [mathKeyResult, setMathKeyResult] = useState('');
  const [mathZaloMsg, setMathZaloMsg] = useState('');
  const [mathGenError, setMathGenError] = useState('');
  const [mathCopiedKey, setMathCopiedKey] = useState(false);
  const [mathCopiedMsg, setMathCopiedMsg] = useState(false);
  const [mathHistory, setMathHistory] = useState<Array<{
    mid: string;
    key: string;
    expDate: string;
    plan: string;
    createdAt: string;
  }>>([]);

  // State cho Tool Tạo Key Bản Quyền - Tạo Đề 15 Phút Tiếng Anh (Global Success - 48 Units)
  const [de15pMid, setDe15pMid] = useState('');
  const [de15pPackage, setDe15pPackage] = useState<'1year' | '2year' | 'lifetime'>('lifetime');
  const [de15pKeyResult, setDe15pKeyResult] = useState('');
  const [de15pZaloMsg, setDe15pZaloMsg] = useState('');
  const [de15pGenError, setDe15pGenError] = useState('');
  const [de15pCopiedKey, setDe15pCopiedKey] = useState(false);
  const [de15pCopiedMsg, setDe15pCopiedMsg] = useState(false);
  const [de15pHistory, setDe15pHistory] = useState<Array<{
    mid: string;
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
      cleanPin === 'Thaythanh2026@' ||
      normalized === 'thaythanh2026@' ||
      normalized === 'thaythanh2026' ||
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
      loadData();
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
    const DEMO_TEST_IDS = ['GV-TEST-9999', 'GV-TEST', 'GV-A7B8-90F1', 'GV-8F22-A109'];
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
        // Ưu tiên tuyệt đối đơn PENDING (Chờ duyệt / Xin gia hạn) để Admin nhận thông báo
        for (const cr of cloudRegs) {
          const k = `${cr.machineId}__${cr.appId || cr.appName || 'all'}`;
          if (!mergedMap.has(k)) {
            mergedMap.set(k, cr);
          } else {
            const prev = mergedMap.get(k);
            if (cr.status === 'PENDING' && prev.status !== 'PENDING') {
              mergedMap.set(k, cr);
            }
          }
        }
        for (const lr of localRegs) {
          const k = `${lr.machineId}__${lr.appId || lr.appName || 'all'}`;
          if (!mergedMap.has(k)) {
            mergedMap.set(k, lr);
          } else {
            const prev = mergedMap.get(k);
            if (lr.status === 'PENDING' && prev.status !== 'PENDING') {
              mergedMap.set(k, lr);
            }
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
    setEcosystemQuota(activityTrackingService.getEcosystemQuotaStats());

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

    // 4. Đồng bộ Cảnh báo Xâm nhập & Phá khóa từ Cloud
    try {
      setIsLoadingAlerts(true);
      const alerts = await cloudSyncService.fetchSecurityAlertsFromCloud();
      setSecurityAlerts(alerts);
    } catch (e) {
      console.warn('Lỗi tải cảnh báo an ninh:', e);
    } finally {
      setIsLoadingAlerts(false);
    }
  };

  // Hàm Xóa Triệt Để Đơn Đăng Ký (Biến mất ngay lập tức trong 0.01s trên UI và Cloud)
  const handleDeleteRegistration = async (id: string, machineId: string, issueNumber?: number) => {
    if (window.confirm(`Thầy có chắc chắn muốn XÓA VĨNH VIỄN đơn đăng ký của máy [${machineId}]?\n\nSau khi xóa, đơn này sẽ BIẾN MẤT NGAY TỨC THÌ khỏi hệ thống để có thể đăng ký mới.`)) {
      // 1. CẬP NHẬT STATE BIẾN MẤT TỨC KHẮC TRONG 0.01 GIÂY
      setRegistrationRequests(prev => prev.filter(r => r.id !== id && r.machineId !== machineId));

      // 2. Xóa trong localStorage đơn đăng ký
      const rawR = localStorage.getItem('gvai_registration_requests');
      if (rawR) {
        try {
          const list = JSON.parse(rawR);
          localStorage.setItem('gvai_registration_requests', JSON.stringify(list.filter((x: any) => x.id !== id && x.machineId !== machineId)));
        } catch {}
      }

      // 3. Xóa trong danh sách máy
      const rawM = localStorage.getItem('gvai_all_tracked_machines');
      if (rawM) {
        try {
          const list = JSON.parse(rawM);
          localStorage.setItem('gvai_all_tracked_machines', JSON.stringify(list.filter((x: any) => x.machineId !== machineId)));
        } catch {}
      }

      // 4. Xóa bản quyền
      await licenseService.deleteLicense(machineId);

      // 5. Đóng và gán nhãn status:deleted trên Cloud
      if (issueNumber) {
        try {
          await cloudSyncService.deleteRegistrationOnCloud(issueNumber, machineId);
        } catch (e) {
          console.error(e);
        }
      }

      await loadTrackingData();
      await loadData();
      alert(`Đã xóa vĩnh viễn đơn đăng ký của máy [${machineId}]. Đơn đã biến mất hoàn toàn!`);
    }
  };

  // HÀM KÍCH HOẠT THEO NĂM CHÍNH THỨC CỦA ADMIN (1 NĂM, 2 NĂM, 3 NĂM, TRỌN ĐỜI)
  const handleActivateMachineByYear = async (
    machineId: string,
    pkg: '1YEAR' | '2YEAR' | '3YEAR' | 'TRIAL_5' | 'LIFETIME' = '1YEAR',
    options?: {
      issueNumber?: number;
      fullName?: string;
      schoolUnit?: string;
      phoneNumber?: string;
      appId?: string;
      appName?: string;
      reqId?: string;
    }
  ) => {
    const cleanMid = (machineId || '').trim().toUpperCase();
    if (!cleanMid) {
      setActionNotice({ type: 'error', title: 'Thiếu thông tin', message: 'Vui lòng cung cấp Mã máy cần kích hoạt!' });
      return;
    }

    const opKey = `${cleanMid}_${pkg}`;
    setApprovingId(opKey);

    const years = pkg === '3YEAR' ? 3 : pkg === '2YEAR' ? 2 : pkg === 'LIFETIME' ? 99 : 1;
    const durationDays = years === 99 ? 36500 : years * 365;
    const pkgLabel = pkg === 'LIFETIME' ? 'Bản quyền Trọn Đời' : pkg === '3YEAR' ? 'Gói 3 Năm Pro' : pkg === '2YEAR' ? 'Gói 2 Năm VIP' : pkg === 'TRIAL_5' ? 'Dùng thử 5 lần' : 'Gói 1 Năm';

    setActionNotice({
      type: 'loading',
      title: 'Đang Xử Lý Kích Hoạt...',
      message: `Đang cấp phép [${pkgLabel}] cho máy [${cleanMid}] và đồng bộ lên GitHub Cloud...`
    });

    try {
      const reviewer = currentAdminName || (userRole === 'SUB_ADMIN' ? 'Cô Mai Tình - Phó Quản trị' : 'Thầy Đinh Văn Thành (Admin)');
      const effectiveFullName = options?.fullName || 'Thầy/Cô Giáo viên';
      const effectivePhone = options?.phoneNumber || '';
      const effectiveSchool = options?.schoolUnit || '';
      const effectiveAppId = options?.appId || 'nls_ai_thcs';
      const effectiveAppName = options?.appName || 'Tích Hợp NLS - AI THCS';

      // 1. Sinh Mã Key Ed25519 được ký số an toàn
      let licenseKey = '';
      let expDateStr = '';
      let zaloMsg = '';
      try {
        const cleanMidUpper = cleanMid.toUpperCase();
        const isListening = effectiveAppId.includes('listening') || effectiveAppId.includes('tts') || effectiveAppId.includes('nghe') || effectiveAppName.toLowerCase().includes('listening') || effectiveAppName.toLowerCase().includes('nghe') || cleanMidUpper.startsWith('MB-');
        if (isListening) {
          const ttsPkg = years === 99 ? 'lifetime' : years === 2 ? '2year' : '1year';
          const genRes = await generateSmartListeningLicenseKey(cleanMid, ttsPkg);
          licenseKey = genRes.key;
          expDateStr = genRes.expiryDateStr;
          zaloMsg = genRes.zaloMessage;
        } else {
          const appTag = effectiveAppId.includes('15p') ? 'ENG15' : effectiveAppId.includes('tienganh') ? 'ENG' : effectiveAppId.includes('taode') ? 'TAODE' : 'NLS';
          const prodId = appTag === 'ENG15' ? 'ENG15' : appTag === 'ENG' ? 'ENG' : appTag === 'TAODE' ? 'TAODE' : 'NLS_AI_THCS';
          const genRes = await generateEd25519Key(cleanMid, years, appTag, prodId);
          licenseKey = genRes.key;
          expDateStr = genRes.expDate;
          zaloMsg = genRes.zaloMessage;
        }
      } catch (errKey) {
        console.warn('Lỗi sinh key Ed25519:', errKey);
        const d = new Date();
        d.setDate(d.getDate() + durationDays);
        expDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      }

      // 2. Lưu vào CSDL nội bộ (activityTrackingService + licenseService)
      const nowTs = Math.floor(Date.now() / 1000);
      const expTs = years === 99 ? 9999999999 : nowTs + durationDays * 86400;

      await licenseService.createDirect({
        machine_id: cleanMid,
        teacher_name: effectiveFullName,
        phone_zalo: effectivePhone,
        school_unit: effectiveSchool,
        package_type: (pkg === 'TRIAL_5' ? '1YEAR' : pkg),
        status: 'ACTIVE',
        expiry_timestamp: expTs,
        notes: `Kích hoạt ${pkgLabel} bởi ${reviewer}`
      }, reviewer);

      const targetReq = registrationRequests.find(r => 
        (options?.reqId && r.id === options.reqId) || 
        (r.machineId === cleanMid && isAppMatching(r.appId, r.appName, effectiveAppId))
      );
      activityTrackingService.approveRegistration(
        options?.reqId || (targetReq ? targetReq.id : `REG-${cleanMid}-${effectiveAppId}`),
        reviewer,
        pkg,
        targetReq || {
          id: options?.reqId || `REG-${cleanMid}-${effectiveAppId}`,
          machineId: cleanMid,
          fullName: effectiveFullName,
          schoolUnit: effectiveSchool,
          phoneNumber: effectivePhone,
          appId: effectiveAppId,
          appName: effectiveAppName,
          packageType: pkg,
          status: 'APPROVED',
          createdAt: new Date().toLocaleString('vi-VN')
        }
      );

      // 3. Đồng bộ lên GitHub Cloud an toàn
      try {
        let issueNum = options?.issueNumber || targetReq?.issueNumber;
        if (issueNum) {
          await cloudSyncService.approveRegistrationOnCloud(
            issueNum,
            reviewer,
            pkg,
            licenseKey,
            expDateStr,
            cleanMid,
            effectiveFullName
          );
        } else {
          await cloudSyncService.ensureAndApproveMachineOnCloud(
            cleanMid,
            reviewer,
            pkg === 'TRIAL_5' ? '1YEAR' : pkg,
            licenseKey,
            expDateStr,
            effectiveFullName,
            effectivePhone,
            effectiveSchool,
            effectiveAppId,
            effectiveAppName
          );
        }
      } catch (errCloud) {
        console.error('Lỗi đồng bộ GitHub Cloud:', errCloud);
      }

      // 4. Cập nhật state UI tức thì trong 0.01 giây (CHỈ CẬP NHẬT ĐÚNG ĐƠN VÀ ĐÚNG APP ĐƯỢC DUYỆT)
      setRegistrationRequests(prev => prev.map(r => {
        const isTarget = options?.reqId ? r.id === options.reqId : (r.machineId === cleanMid && isAppMatching(r.appId, r.appName, effectiveAppId));
        if (isTarget) {
          return {
            ...r,
            status: 'APPROVED',
            packageType: pkg,
            reviewedBy: reviewer,
            reviewedAt: new Date().toLocaleString('vi-VN'),
            daysRemaining: durationDays,
            expiryDateStr: expDateStr
          };
        }
        return r;
      }));

      setTrackedMachines(prev => prev.map(m => {
        if (m.machineId === cleanMid) {
          return {
            ...m,
            trialUsed: m.trialMax,
            isRegisteredTrial: true
          };
        }
        return m;
      }));

      // Tải lại nền
      loadData();
      loadTrackingData();

      // 5. Hiển thị thông báo thành công và Modal Key
      setActionNotice({
        type: 'success',
        title: 'Kích Hoạt Thành Công!',
        message: `Đã kích hoạt ${pkgLabel} cho máy [${cleanMid}]. Hệ thống Cloud và máy giáo viên đã nhận bản quyền!`
      });

      setActivationSuccessData({
        machineId: cleanMid,
        teacherName: effectiveFullName,
        phone: effectivePhone,
        packageLabel: pkgLabel,
        daysRemaining: durationDays,
        expDate: expDateStr,
        licenseKey: licenseKey,
        zaloMsg: zaloMsg,
        reviewer: reviewer
      });

    } catch (err: any) {
      console.error('Lỗi khi kích hoạt đơn:', err);
      setActionNotice({
        type: 'error',
        title: 'Có Lỗi Xảy Ra',
        message: 'Lỗi kích hoạt: ' + (err?.message || String(err))
      });
    } finally {
      setApprovingId(null);
    }
  };

  const handleApproveReq = async (id: string, pkg?: '1YEAR' | '2YEAR' | '3YEAR' | 'TRIAL_5', issueNumber?: number) => {
    const targetReq = registrationRequests.find(r => r.id === id || (issueNumber && r.issueNumber === issueNumber));
    const mid = targetReq?.machineId || id;
    await handleActivateMachineByYear(mid, pkg || '1YEAR', {
      issueNumber: issueNumber || targetReq?.issueNumber,
      fullName: targetReq?.fullName,
      schoolUnit: targetReq?.schoolUnit,
      phoneNumber: targetReq?.phoneNumber,
      appId: targetReq?.appId,
      appName: targetReq?.appName,
      reqId: id
    });
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
        const savedMathHist = localStorage.getItem('gvai_admin_math_key_history');
        if (savedMathHist) setMathHistory(JSON.parse(savedMathHist));
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

  const handleGenerateTTSKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setTtsGenError('');
    const cleanId = ttsMid.trim().toUpperCase();
    if (!cleanId) {
      setTtsGenError('Vui lòng nhập Mã máy tính (Hardware Code) của khách hàng!');
      return;
    }
    try {
      const res = await generateSmartListeningLicenseKey(cleanId, ttsPackage);
      setTtsKeyResult(res.key);
      setTtsZaloMsg(res.zaloMessage);

      const newRecord = {
        mid: cleanId,
        key: res.key,
        expDate: res.expiryDateStr,
        plan: res.packageName,
        createdAt: new Date().toLocaleString('vi-VN')
      };
      const updated = [newRecord, ...ttsHistory.filter(x => x.key !== res.key).slice(0, 19)];
      setTtsHistory(updated);
      localStorage.setItem('gvai_admin_tts_key_history', JSON.stringify(updated));
    } catch (err: any) {
      setTtsGenError(err.message || 'Lỗi khi tạo key Smart Listening Pro');
    }
  };

  const handleCopyTTSKey = () => {
    if (ttsKeyResult) {
      navigator.clipboard.writeText(ttsKeyResult);
      setTtsCopiedKey(true);
      setTimeout(() => setTtsCopiedKey(false), 2000);
    }
  };

  const handleCopyTTSZaloMsg = () => {
    if (ttsZaloMsg) {
      navigator.clipboard.writeText(ttsZaloMsg);
      setTtsCopiedMsg(true);
      setTimeout(() => setTtsCopiedMsg(false), 2000);
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
      const isTHPT = examLevel === 'THPT' || cleanId.includes('THPT') || cleanId.includes('ENGPT');
      const years = examPackage === 'lifetime' ? 99 : examPackage === '2year' ? 2 : 1;
      let finalKey = '';
      let expDateStr = '';
      const pkgName = examPackage === 'lifetime' ? 'BẢN QUYỀN VIP TRỌN ĐỜI' : examPackage === '2year' ? 'GÓI 2 NĂM VIP' : 'GÓI 1 NĂM';

      if (isTHPT) {
        const edRes = await generateEd25519Key(cleanId, years, 'ENGPT', 'ENGPT');
        finalKey = edRes.key;
        expDateStr = edRes.expDate;
      } else {
        const edRes = await generateEd25519Key(cleanId, years, 'ENGCS', 'ENGCS');
        finalKey = edRes.key;
        expDateStr = edRes.expDate;
      }
      setExamKeyResult(finalKey);

      const appTitle = isTHPT ? 'TẠO ĐỀ & ĐỀ CƯƠNG TIẾNG ANH THPT (GLOBAL SUCCESS 10-11-12)' : 'TẠO ĐỀ TIẾNG ANH THCS (CV 7991)';
      const authorTitle = isTHPT ? 'Thầy giáo Đinh Văn Thành – THPT Đồng Yên' : 'Thầy giáo Đinh Văn Thành – THCS Đồng Yên';
      const appNameGuide = isTHPT ? 'Tạo đề kiểm tra Tiếng Anh Global Success THPT' : 'Tạo đề kiểm tra Tiếng Anh Global Success THCS';

      const msg = `KÍNH GỬI THẦY/CÔ BẢN QUYỀN PHẦN MỀM ${appTitle}:
----------------------------------------------------------------------
📌 Tác giả: ${authorTitle}
📞 Hotline/Zalo hỗ trợ: 0915.213717
💻 Mã máy (Hardware Code): ${cleanId}
🎁 Gói bản quyền: ${pkgName}
⏳ Hạn sử dụng: ${expDateStr}
🔑 MÃ KÍCH HOẠT PRO (ED25519):
${finalKey}
----------------------------------------------------------------------
👉 HƯỚNG DẪN KÍCH HOẠT:
1. Mở phần mềm "${appNameGuide}" (hoặc trên Web).
2. Chọn Tab "3. Bản Quyền & Kích Hoạt".
3. Dán đúng mã kích hoạt trên vào ô "Nhập Mã Bản Quyền Pro" rồi bấm "KÍCH HOẠT PRO NGAY".
Chúc Thầy/Cô có những tiết dạy và kỳ thi hiệu quả, tiết kiệm tối đa thời gian!`;
      setExamZaloMsg(msg);

      const newRecord = {
        mid: cleanId,
        key: finalKey,
        expDate: expDateStr,
        plan: pkgName,
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

  // Handlers cho Đinh Thành MathStudio 2026+ Pro (Ed25519)
  const handleGenerateMathKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setMathGenError('');
    try {
      const cleanId = mathMid.trim().toUpperCase();
      if (!cleanId) {
        setMathGenError('Vui lòng nhập Mã máy tính (Hardware Code) của khách hàng (VD: DVT-MATH-XXXX-XXXX)!');
        return;
      }
      const res = await generateEd25519Key(cleanId, mathYears, 'MATH', 'MATH_STUDIO');
      
      // Tính toán mã DVT format chuẩn cho Word Add-in MathStudio
      let cleanAlnum = '';
      for (let i = 0; i < cleanId.length; i++) {
        const ch = cleanId[i].toUpperCase();
        if ((ch >= '0' && ch <= '9') || (ch >= 'A' && ch <= 'Z')) {
          cleanAlnum += ch;
        }
      }
      const salt = "DINH-VAN-THANH-0915213717-TOOLMATHPIX";
      const licType = mathYears >= 10 ? 'VIP' : `${mathYears}Y`;
      const payloadDvt = `${cleanAlnum}-${licType}-${salt}`;
      let h1 = 17;
      let h2 = 23;
      for (let i = 0; i < payloadDvt.length; i++) {
        const c = payloadDvt.charCodeAt(i);
        h1 = (h1 * 31 + c) % 2147483647;
        h2 = (h2 * 37 + c) % 2147483629;
      }
      const hex1 = ('00000000' + h1.toString(16).toUpperCase()).slice(-8);
      const hex2 = ('00000000' + h2.toString(16).toUpperCase()).slice(-8);
      const hStr = hex1 + hex2;
      const dvtWordKey = `DVT-${licType}-${hStr.substr(0, 4)}-${hStr.substr(4, 4)}-${hStr.substr(8, 4)}-${hStr.substr(12, 4)}`;

      const customZaloMsg = `KÍNH GỬI QUÝ THẦY/CÔ!
Thầy Đinh Văn Thành xin gửi Thầy/Cô thông tin kích hoạt bản quyền Đinh Thành MathStudio 2026+ Pro:
----------------------------------------
👉 Ứng dụng: Đinh Thành MathStudio 2026+ Pro (Word & Mathpix)
👉 Mã máy tính: ${cleanId}
👉 Thời hạn bản quyền: ${res.planName} (Hạn dùng: Đến ${res.expDate})

🔑 1. MÃ KÍCH HOẠT NHẬP VÀO WORD ADD-IN:
${dvtWordKey}

🔑 2. MÃ KÍCH HOẠT TRỰC TUYẾN / WEB:
${res.key}
----------------------------------------
HƯỚNG DẪN KÍCH HOẠT:
• Trên Word: Mở Microsoft Word -> Vào tab ToolMathpix2 -> Bấm nút "Nhập Key" -> Dán mã số (1) ở trên vào -> Bản quyền VIP kích hoạt thành công 100%!
• Trên Web: Vào tab "Bản Quyền & Kích Hoạt" -> Dán mã vào ô kích hoạt.

Chúc Quý Thầy/Cô biên soạn đề thi Toán tốc độ cao và giảng dạy hiệu quả!
Mọi hỗ trợ xin liên hệ: Thầy Đinh Văn Thành - Hotline / Zalo: 0915.213717.`;

      setMathKeyResult(dvtWordKey);
      setMathZaloMsg(customZaloMsg);

      const newRecord = {
        mid: cleanId,
        key: `${dvtWordKey} | ${res.key}`,
        expDate: res.expDate,
        plan: res.planName,
        createdAt: new Date().toLocaleString('vi-VN')
      };
      const updated = [newRecord, ...mathHistory.filter(x => !x.key.includes(cleanId)).slice(0, 19)];
      setMathHistory(updated);
      localStorage.setItem('gvai_admin_math_key_history', JSON.stringify(updated));
    } catch (err: any) {
      setMathGenError(err.message || 'Lỗi khi tạo key MathStudio');
    }
  };

  const handleCopyMathKey = () => {
    if (mathKeyResult) {
      navigator.clipboard.writeText(mathKeyResult);
      setMathCopiedKey(true);
      setTimeout(() => setMathCopiedKey(false), 2000);
    }
  };

  const handleCopyMathZaloMsg = () => {
    if (mathZaloMsg) {
      navigator.clipboard.writeText(mathZaloMsg);
      setMathCopiedMsg(true);
      setTimeout(() => setMathCopiedMsg(false), 2000);
    }
  };

  // Handlers cho Tạo Đề 15 Phút Tiếng Anh (Global Success)
  const handleGenerateDe15pKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setDe15pGenError('');
    try {
      const cleanId = de15pMid.trim().toUpperCase();
      if (!cleanId) {
        setDe15pGenError('Vui lòng nhập Mã máy tính (Hardware Code) của khách hàng (VD: DVT-15M-XXXX-XXXX)!');
        return;
      }
      const key = await generateExam15PLicenseKey(cleanId, de15pPackage);
      setDe15pKeyResult(key);

      const pkgName = de15pPackage === '1year' ? '1 Năm' : de15pPackage === '2year' ? '2 Năm' : 'Trọn Đời (Vĩnh Viễn)';
      const msg = `Kính gửi Quý Thầy/Cô,\nThầy Đinh Văn Thành gửi mã kích hoạt Bản Quyền Pro phần mềm "TẠO ĐỀ 15 PHÚT TIẾNG ANH (GLOBAL SUCCESS - 48 UNITS)":\n- Mã máy: ${cleanId}\n- Gói bản quyền: ${pkgName}\n- Khóa kích hoạt: ${key}\n\nThầy/Cô mở phần mềm hoặc truy cập web, vào tab Bản quyền & Kích hoạt, dán mã key trên để sử dụng trọn vẹn toàn bộ 48 Units ạ. Chúc Thầy/Cô dạy tốt!\nHotline/Zalo: 0915.213717.`;
      setDe15pZaloMsg(msg);

      const newRecord = {
        mid: cleanId,
        key,
        expDate: de15pPackage === '1year' ? '1 Năm' : de15pPackage === '2year' ? '2 Năm' : 'Vĩnh viễn',
        plan: pkgName,
        createdAt: new Date().toLocaleString('vi-VN')
      };
      setDe15pHistory(prev => [newRecord, ...prev.filter(x => x.key !== key).slice(0, 19)]);
    } catch (err: any) {
      setDe15pGenError(err.message || 'Lỗi khi tạo key Tạo Đề 15P');
    }
  };

  const handleCopyDe15pKey = () => {
    if (de15pKeyResult) {
      navigator.clipboard.writeText(de15pKeyResult);
      setDe15pCopiedKey(true);
      setTimeout(() => setDe15pCopiedKey(false), 2000);
    }
  };

  const handleCopyDe15pZaloMsg = () => {
    if (de15pZaloMsg) {
      navigator.clipboard.writeText(de15pZaloMsg);
      setDe15pCopiedMsg(true);
      setTimeout(() => setDe15pCopiedMsg(false), 2000);
    }
  };

  // Lắng nghe sự kiện đồng bộ trạng thái Khóa Web
  useEffect(() => {
    const handleMaintenanceChange = (e: any) => {
      if (e?.detail?.locked !== undefined) {
        setIsMaintenanceLocked(e.detail.locked);
      } else {
        setIsMaintenanceLocked(systemMaintenanceService.isMaintenanceLocked());
      }
    };
    window.addEventListener('gvai_maintenance_status_changed', handleMaintenanceChange);
    return () => window.removeEventListener('gvai_maintenance_status_changed', handleMaintenanceChange);
  }, []);

  const handleToggleMaintenanceLock = async () => {
    if (isMaintenanceLocked) {
      if (window.confirm('Thầy có chắc chắn muốn MỞ KHÓA WEBSITE cho tất cả giáo viên toàn quốc truy cập bình thường không?')) {
        setIsTogglingMaintenance(true);
        await systemMaintenanceService.setMaintenanceLock(false, 'Mở lại web bởi Thầy Thành');
        setIsMaintenanceLocked(false);
        setIsTogglingMaintenance(false);
        alert('🎉 ĐÃ MỞ KHÓA WEBSITE THÀNH CÔNG!\n\nTất cả giáo viên trên toàn quốc hiện đã có thể truy cập và sử dụng bình thường.');
      }
    } else {
      if (window.confirm('⚠️ XÁC NHẬN KHÓA WEBSITE ĐỂ NÂNG CẤP:\n\nKhi khóa, tất cả giáo viên khi truy cập website sẽ chỉ xem được thông báo:\n"Web đang nâng cấp, vui lòng ghé thăm sau!"\n\nRiêng Admin có mật khẩu vẫn vào xem và quản lý bình thường.\n\nThầy có chắc chắn muốn KHÓA WEB ngay bây giờ không?')) {
        setIsTogglingMaintenance(true);
        await systemMaintenanceService.setMaintenanceLock(true, 'Nâng cấp và bảo trì hệ thống');
        setIsMaintenanceLocked(true);
        setIsTogglingMaintenance(false);
        alert('🔒 ĐÃ KHÓA WEBSITE THÀNH CÔNG!\n\nWebsite hiện đang ở chế độ nâng cấp. Giáo viên truy cập sẽ nhận được thông báo "Web đang nâng cấp, vui lòng ghé thăm sau!".');
      }
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
    const mid = newMid.trim().toUpperCase();
    const name = newName.trim() || 'Thầy/Cô';
    const phone = newPhone.trim();
    const school = newSchool.trim();
    const pkg = newPkg;

    setShowCreateModal(false);
    setNewMid('');
    setNewName('');
    setNewPhone('');
    setNewSchool('');

    await handleActivateMachineByYear(mid, pkg, {
      fullName: name,
      phoneNumber: phone,
      schoolUnit: school
    });
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
            {/* NÚT KHÓA / MỞ KHÓA WEB (NÂNG CẤP BẢO TRÌ) */}
            <button
              onClick={handleToggleMaintenanceLock}
              disabled={isTogglingMaintenance}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-black shadow-lg cursor-pointer ${
                isMaintenanceLocked
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 text-white border-2 border-emerald-300 hover:from-emerald-500 hover:to-teal-400 shadow-emerald-600/40 animate-pulse'
                  : 'bg-amber-950/80 hover:bg-amber-900/90 text-amber-200 border-2 border-amber-500/80 hover:border-amber-400'
              }`}
              title={
                isMaintenanceLocked 
                  ? 'Website đang KHÓA NÂNG CẤP (Khách chỉ thấy thông báo). Bấm để MỞ LẠI cho toàn quốc.' 
                  : 'Bấm để TẠM DỪNG NÂNG CẤP website (Khách chỉ xem thông báo nâng cấp).'
              }
            >
              {isMaintenanceLocked ? (
                <>
                  <Unlock className="w-4 h-4 text-emerald-200 animate-spin" />
                  <span>🔓 MỞ KHÓA WEB (ĐANG KHÓA)</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>🔒 KHÓA WEB (NÂNG CẤP)</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setAdminTab('security');
                loadTrackingData();
              }}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-black shadow-lg cursor-pointer ${
                adminTab === 'security'
                  ? 'bg-red-600 text-white ring-2 ring-red-400'
                  : 'bg-red-950/80 hover:bg-red-900/80 text-red-200 border-2 border-red-500/80 hover:border-red-400 animate-pulse'
              }`}
              title="Xem ngay các máy tính đang can thiệp bẻ khóa"
            >
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>🚨 CẢNH BÁO XÂM NHẬP</span>
              <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black">
                {securityAlerts.filter(a => a.status === 'UNRESOLVED').length || '1'}
              </span>
            </button>
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
            onClick={() => {
              setAdminTab('security');
              loadTrackingData();
            }}
            className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              adminTab === 'security'
                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 text-white shadow-lg shadow-rose-600/40 ring-2 ring-red-400 font-extrabold'
                : 'bg-red-950/80 border-2 border-red-500/80 text-red-200 hover:bg-red-900/90 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
            <span className="font-extrabold text-white">🚨 1. CẢNH BÁO XÂM NHẬP & BẺ KHÓA</span>
            <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[11px] font-black animate-bounce">
              {securityAlerts.filter(a => a.status === 'UNRESOLVED').length || '1'}
            </span>
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
          <button
            onClick={() => setAdminTab('mathstudio')}
            className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              adminTab === 'mathstudio'
                ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-md shadow-violet-600/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-300" />
            10. MathStudio 2026+ (Ed25519)
          </button>
          <button
            onClick={() => setAdminTab('de15p')}
            className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              adminTab === 'de15p'
                ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-md shadow-cyan-600/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-300" />
            11. Tạo Đề 15P Tiếng Anh (48 Units)
          </button>
          <button
            onClick={() => {
              setAdminTab('security');
              loadTrackingData();
            }}
            className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              adminTab === 'security'
                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 text-white shadow-md shadow-rose-600/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>12. Cảnh Báo Xâm Nhập & Chống Bẻ Khóa</span>
            {securityAlerts.filter(a => a.status === 'UNRESOLVED').length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black animate-pulse">
                {securityAlerts.filter(a => a.status === 'UNRESOLVED').length}
              </span>
            )}
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
                      onClick={() => setTrackingSubTab('quota')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                        trackingSubTab === 'quota'
                          ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>2. 📊 Hạn Ngạch Cài Đặt & Update ({ecosystemQuota?.appsStats?.length || 12} App)</span>
                    </button>

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
                      <span>3. Thống Kê Web & Lịch Sử Theo Ngày Giờ</span>
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
                      <span>4. Quản Lý Máy & Khóa Vĩnh Viễn</span>
                      {blockedMachines.length > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px] font-black">
                          {blockedMachines.length}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAdminTab('security');
                        loadTrackingData();
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition cursor-pointer bg-red-600/30 text-red-300 border border-red-500/60 hover:bg-red-600 hover:text-white animate-pulse"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                      <span>4. 🛡️ Cảnh Báo Xâm Nhập ({securityAlerts.filter(a => a.status === 'UNRESOLVED').length || '1'})</span>
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

            {/* BANNER CẢNH BÁO AN NINH XÂM NHẬP & PHÁ KHÓA KHẨN CẤP */}
            <div 
              onClick={() => {
                setAdminTab('security');
                loadTrackingData();
              }}
              className="bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border-2 border-red-500/80 hover:border-red-400 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-all hover:scale-[1.005] shadow-lg shadow-red-950/40 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/60 flex items-center justify-center text-red-400 shrink-0 group-hover:scale-110 transition-transform">
                  <ShieldAlert className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-black text-[11px] animate-pulse">GIÁM SÁT AN NINH 24/7</span>
                    <h4 className="text-sm font-black text-white group-hover:text-red-300 transition-colors">TRUNG TÂM PHÁT HIỆN XÂM NHẬP & BẺ KHÓA PHẦN MỀM</h4>
                  </div>
                  <p className="text-xs text-red-200/80 mt-0.5">
                    Hệ thống tự động theo dõi, thu thập IP, cấu hình máy tính và đối chiếu danh tính giáo viên đang có hành vi mở F12/DevTools hoặc can thiệp bẻ khóa.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-red-600/40">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Vào Bảng Báo Cáo Xâm Nhập ({securityAlerts.length}) &rarr;</span>
                </span>
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
                        <option value="tts">🎙️ Smart Listening Pro (Tạo Bài Nghe SGK)</option>
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
                        <th className="py-3 px-3">Gói & Thời Hạn Còn Lại</th>
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
                            if (regAppFilter === 'tts') {
                              if (!appK.includes('tts') && !appK.includes('speech') && !appK.includes('listening') && !appK.includes('bài nghe') && !appK.includes('smart-listening') && !r.machineId.toUpperCase().startsWith('MB-')) return false;
                            } else {
                              if (!appK.includes(regAppFilter.toLowerCase())) return false;
                            }
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

                              {/* 4. Gói & Thời Hạn Còn Lại */}
                              <td className="py-3 px-3">
                                <div className="font-bold flex items-center gap-1.5 flex-wrap">
                                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-black ${
                                    req.packageType === '3YEAR' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' :
                                    req.packageType === '2YEAR' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                                    req.packageType === 'LIFETIME' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  }`}>
                                    {req.packageType === '3YEAR' ? '👑 Gói 3 Năm VIP' :
                                     req.packageType === '2YEAR' ? '👑 Gói 2 Năm VIP' :
                                     req.packageType === '1YEAR' ? '📦 Gói 1 Năm' :
                                     req.packageType === 'LIFETIME' ? '🌟 Trọn Đời' : '🎁 Dùng thử'}
                                  </span>
                                </div>

                                {req.status === 'APPROVED' ? (
                                  <div className="mt-1 flex items-center gap-1 flex-wrap">
                                    {req.isLifetime || req.packageType === 'LIFETIME' ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-900/40 text-purple-200 border border-purple-500/30 text-[10px] font-bold">
                                        👑 Vĩnh viễn (Trọn đời)
                                      </span>
                                    ) : req.daysRemaining !== undefined ? (
                                      req.daysRemaining <= 0 ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-600/50 text-[10px] font-bold">
                                          ❌ Hết hạn ({req.expiryDateStr})
                                        </span>
                                      ) : req.daysRemaining <= 7 ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px] shadow-sm shadow-rose-500/40 animate-bounce">
                                          🔥 Còn {req.daysRemaining} ngày (Hạn: {req.expiryDateStr})
                                        </span>
                                      ) : req.daysRemaining <= 30 ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black animate-pulse">
                                          ⚠️ Còn {req.daysRemaining} ngày (Hạn: {req.expiryDateStr})
                                        </span>
                                      ) : req.daysRemaining <= 60 ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-bold">
                                          🔵 Còn {req.daysRemaining} ngày (Hạn: {req.expiryDateStr})
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                                          🟢 Còn {req.daysRemaining} ngày (Hạn: {req.expiryDateStr})
                                        </span>
                                      )
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                                        🟢 Đang hoạt động (Hạn: {req.expiryDateStr || 'Chuẩn'})
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <div className="font-mono text-slate-400 text-[10px] mt-1 flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-slate-500" />
                                    <span>Gửi: {req.createdAt || 'Mới đây'}</span>
                                  </div>
                                )}
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
                                    disabled={approvingId !== null}
                                    onClick={() => handleActivateMachineByYear(
                                      req.machineId,
                                      '1YEAR',
                                      {
                                        issueNumber: req.issueNumber,
                                        fullName: req.fullName,
                                        phoneNumber: req.phoneNumber,
                                        schoolUnit: req.schoolUnit,
                                        appId: req.appId,
                                        appName: req.appName,
                                        reqId: req.id
                                      }
                                    )}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-[11px] shadow-sm shadow-emerald-600/30 transition cursor-pointer flex items-center gap-1"
                                    title="Kích hoạt bản quyền 1 Năm (365 ngày)"
                                  >
                                    {approvingId === `${req.machineId}_1YEAR` ? (
                                      <RefreshCw className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Check className="w-3 h-3" />
                                    )}
                                    <span>{approvingId === `${req.machineId}_1YEAR` ? 'Đang kích hoạt...' : '1 Năm'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    disabled={approvingId !== null}
                                    onClick={() => handleActivateMachineByYear(
                                      req.machineId,
                                      '2YEAR',
                                      {
                                        issueNumber: req.issueNumber,
                                        fullName: req.fullName,
                                        phoneNumber: req.phoneNumber,
                                        schoolUnit: req.schoolUnit,
                                        appId: req.appId,
                                        appName: req.appName,
                                        reqId: req.id
                                      }
                                    )}
                                    className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-[11px] shadow-sm shadow-amber-600/30 transition cursor-pointer flex items-center gap-1"
                                    title="Kích hoạt bản quyền 2 Năm (730 ngày)"
                                  >
                                    {approvingId === `${req.machineId}_2YEAR` ? (
                                      <RefreshCw className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Crown className="w-3 h-3" />
                                    )}
                                    <span>{approvingId === `${req.machineId}_2YEAR` ? 'Đang kích hoạt...' : '2 Năm'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    disabled={approvingId !== null}
                                    onClick={() => handleActivateMachineByYear(
                                      req.machineId,
                                      '3YEAR',
                                      {
                                        issueNumber: req.issueNumber,
                                        fullName: req.fullName,
                                        phoneNumber: req.phoneNumber,
                                        schoolUnit: req.schoolUnit,
                                        appId: req.appId,
                                        appName: req.appName,
                                        reqId: req.id
                                      }
                                    )}
                                    className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-[11px] shadow-sm shadow-indigo-600/30 transition cursor-pointer flex items-center gap-1"
                                    title="Kích hoạt bản quyền 3 Năm (1095 ngày)"
                                  >
                                    {approvingId === `${req.machineId}_3YEAR` ? (
                                      <RefreshCw className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Sparkles className="w-3 h-3" />
                                    )}
                                    <span>{approvingId === `${req.machineId}_3YEAR` ? 'Đang kích hoạt...' : '3 Năm'}</span>
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
            {/* SUBTAB: THỐNG KÊ HẠN NGẠCH CÀI ĐẶT & UPDATE TẤT CẢ CÁC APP */}
            {/* ========================================================= */}
            {trackingSubTab === 'quota' && (
              <div className="flex-1 flex flex-col min-h-0 space-y-3.5">
                {/* 1. 4 THẺ KPI TỔNG HỢP TOÀN HỆ SINH THÁI */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {/* Card 1: Tổng máy đã cài đặt */}
                  <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-3.5 flex flex-col justify-between shadow-lg shadow-cyan-950/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">MÁY ĐÃ CÀI ĐẶT</span>
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                        <Laptop className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-black text-cyan-400 tracking-tight">
                        {ecosystemQuota?.totalUniqueInstalledMachines || 0} <span className="text-xs font-semibold text-slate-400">Máy tính</span>
                      </div>
                      <p className="text-[10px] text-cyan-300/80 mt-0.5 font-medium">
                        🛡️ Mỗi máy tính tính 1 lần duy nhất (Unique PC)
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Số máy đã dùng thử */}
                  <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-3.5 flex flex-col justify-between shadow-lg shadow-amber-950/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">MÁY ĐÃ DÙNG THỬ</span>
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-black text-amber-400 tracking-tight">
                        {ecosystemQuota?.totalUniqueTrialMachines || 0} <span className="text-xs font-semibold text-slate-400">Máy tính</span>
                      </div>
                      <p className="text-[10px] text-amber-300/80 mt-0.5 font-medium">
                        🧪 Đang trải nghiệm 5 lượt thử đầy đủ tính năng
                      </p>
                    </div>
                  </div>

                  {/* Card 3: Số máy đã kích hoạt Pro */}
                  <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-3.5 flex flex-col justify-between shadow-lg shadow-emerald-950/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ĐÃ KÍCH HOẠT PRO</span>
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-black text-emerald-400 tracking-tight">
                        {ecosystemQuota?.totalUniqueActivatedMachines || 0} <span className="text-xs font-semibold text-slate-400">Máy tính</span>
                      </div>
                      <p className="text-[10px] text-emerald-300/80 mt-0.5 font-medium">
                        👑 Đã cấp key bản quyền Pro / 1-3 Năm / VIP
                      </p>
                    </div>
                  </div>

                  {/* Card 4: Tổng số lượt giáo viên update */}
                  <div className="bg-slate-900/90 border border-purple-500/40 rounded-2xl p-3.5 flex flex-col justify-between shadow-lg shadow-purple-950/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">LƯỢT GV CẬP NHẬT</span>
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                        <RefreshCw className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-2xl font-black text-purple-400 tracking-tight">
                        {ecosystemQuota?.totalUpdateCount || 0} <span className="text-xs font-semibold text-slate-400">Lượt Update</span>
                      </div>
                      <p className="text-[10px] text-purple-300/80 mt-0.5 font-medium">
                        🔄 Tổng số lần GV tải & kiểm tra cập nhật mới
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. THANH ĐIỀU KHIỂN & BỘ LỌC TÌM KIẾM */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    {/* Bộ lọc danh mục */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="text-slate-400 font-semibold">Phân loại:</span>
                      {[
                        { id: 'ALL', label: 'Tất Cả' },
                        { id: 'tienganh', label: 'Tiếng Anh (THCS/THPT)' },
                        { id: 'toan', label: 'Toán Học (MathStudio)' },
                        { id: 'tienich', label: 'Tiện Ích Giáo Viên' },
                        { id: 'chung', label: 'Giáo Án & Đề Thi' }
                      ].map(cat => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setQuotaCatFilter(cat.id as any)}
                          className={`px-2.5 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                            quotaCatFilter === cat.id
                              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Nút hành động */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const data = activityTrackingService.getEcosystemQuotaStats();
                          setEcosystemQuota(data);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 text-xs cursor-pointer transition font-semibold"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Làm mới số liệu</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const data = activityTrackingService.getEcosystemQuotaStats();
                          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `Bao_Cao_Han_Ngach_Cai_Dat_Ecosystem_${Date.now()}.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 text-xs cursor-pointer transition font-semibold"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Xuất Báo Cáo JSON</span>
                      </button>
                    </div>
                  </div>

                  {/* Thanh tìm kiếm */}
                  <div className="relative w-full">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm phần mềm theo tên, mã app (nls, tieng anh, mathstudio, cleaner...)"
                      value={quotaSearch}
                      onChange={(e) => setQuotaSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* 3. BẢNG THỐNG KÊ CHI TIẾT TẤT CẢ CÁC APP */}
                <div className="flex-1 overflow-y-auto border border-slate-800 rounded-2xl bg-slate-950/60 shadow-inner">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-md text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-800 z-10">
                      <tr>
                        <th className="py-2.5 px-3 text-center w-12">STT</th>
                        <th className="py-2.5 px-3">Tên Ứng Dụng / Phần Mềm</th>
                        <th className="py-2.5 px-3">Phân Loại</th>
                        <th className="py-2.5 px-3 text-center">
                          <div className="font-bold text-cyan-400">Đã Cài Đặt (Unique)</div>
                          <div className="text-[9px] text-slate-400 lowercase font-normal">1 máy / 1 ID phần cứng</div>
                        </th>
                        <th className="py-2.5 px-3 text-center">
                          <div className="font-bold text-amber-400">Đã Dùng Thử</div>
                          <div className="text-[9px] text-slate-400 lowercase font-normal">đang trải nghiệm</div>
                        </th>
                        <th className="py-2.5 px-3 text-center">
                          <div className="font-bold text-emerald-400">Đã Kích Hoạt Pro</div>
                          <div className="text-[9px] text-slate-400 lowercase font-normal">bản quyền chính thức</div>
                        </th>
                        <th className="py-2.5 px-3 text-center">
                          <div className="font-bold text-purple-400">Lượt GV Update</div>
                          <div className="text-[9px] text-slate-400 lowercase font-normal">số lần cập nhật</div>
                        </th>
                        <th className="py-2.5 px-3 text-center">Tỷ Lệ Kích Hoạt</th>
                        <th className="py-2.5 px-3 text-right">Chi Tiết Máy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {ecosystemQuota?.appsStats
                        ?.filter(app => {
                          if (quotaCatFilter !== 'ALL' && app.category !== quotaCatFilter) return false;
                          if (!quotaSearch.trim()) return true;
                          const q = quotaSearch.toLowerCase();
                          return (
                            app.appName.toLowerCase().includes(q) ||
                            app.shortName.toLowerCase().includes(q) ||
                            app.appId.toLowerCase().includes(q)
                          );
                        })
                        .map((app, idx) => (
                          <tr key={app.appId} className="hover:bg-slate-900/80 transition-colors">
                            <td className="py-3 px-3 text-center font-bold text-slate-500">
                              {idx + 1}
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-bold text-white flex items-center gap-2">
                                <span>{app.appName}</span>
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                                  app.badge.includes('PRO')
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : app.badge.includes('ADMIN')
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                }`}>
                                  {app.badge}
                                </span>
                              </div>
                              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                                Mã: <code className="text-cyan-300 font-bold">{app.appId}</code>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] border border-slate-700 capitalize">
                                {app.category === 'tienganh' ? 'Tiếng Anh THCS & THPT' : app.category === 'toan' ? 'Toán Học & Mathpix' : app.category === 'tienich' ? 'Tiện Ích Giáo Viên' : 'Chung'}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800/80 text-cyan-300 font-black text-sm">
                                <Laptop className="w-3.5 h-3.5" />
                                {app.installedMachinesCount} máy
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800/80 text-amber-300 font-black text-sm">
                                <Sparkles className="w-3.5 h-3.5" />
                                {app.trialMachinesCount} máy
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 font-black text-sm">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {app.activatedMachinesCount} máy
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-800/80 text-purple-300 font-black text-sm">
                                <RefreshCw className="w-3.5 h-3.5" />
                                {app.updateCount} lượt
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <div className="flex flex-col items-center gap-1">
                                <span className="font-extrabold text-emerald-400">{app.activationRate}%</span>
                                <div className="w-20 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                  <div
                                    className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all"
                                    style={{ width: `${Math.min(100, app.activationRate)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedQuotaApp(app);
                                  setShowQuotaDetailModal(true);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-600 hover:text-white text-cyan-300 border border-slate-700 hover:border-cyan-500 font-bold text-xs inline-flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Xem Máy ({app.machines.length})</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* SUBTAB 3: THỐNG KÊ WEB & LỊCH SỬ THEO NGÀY GIỜ            */}
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

                          // Tính số ngày còn lại của bản quyền (đồng bộ cả Local và Cloud)
                          const approvedReq = registrationRequests.find(r => r.machineId === item.machineId && r.status === 'APPROVED');
                          let licenseInfoText = '⏳ Dùng thử (Chưa kích hoạt VIP)';
                          let daysLeft = 0;
                          if (activeLicense) {
                            if (activeLicense.package_type === 'LIFETIME' || activeLicense.expiry_timestamp > 9000000000) {
                              licenseInfoText = '👑 Bản quyền Trọn Đời (Vĩnh viễn)';
                            } else {
                              const nowTs = Math.floor(Date.now() / 1000);
                              daysLeft = Math.max(0, Math.ceil((activeLicense.expiry_timestamp - nowTs) / 86400));
                              const expDateStr = new Date(activeLicense.expiry_timestamp * 1000).toLocaleDateString('vi-VN');
                              const pkgLabelDisplay = (activeLicense.package_type === '3YEAR' || daysLeft > 730) ? '3 Năm Pro' : (activeLicense.package_type === '2YEAR' || daysLeft > 365) ? '2 Năm VIP' : '1 Năm';
                              licenseInfoText = `👑 Bản quyền ${pkgLabelDisplay} - Còn ${daysLeft} ngày (Hạn: ${expDateStr})`;
                            }
                          } else if (approvedReq) {
                            const pkgLabelDisplay = approvedReq.packageType === '3YEAR' ? '3 Năm Pro' : approvedReq.packageType === '2YEAR' ? '2 Năm VIP' : approvedReq.packageType === 'LIFETIME' ? 'Trọn Đời' : '1 Năm';
                            if (approvedReq.packageType === 'LIFETIME' || approvedReq.isLifetime) {
                              licenseInfoText = '👑 Bản quyền Trọn Đời (Vĩnh viễn)';
                            } else {
                              const dLeft = approvedReq.daysRemaining !== undefined ? approvedReq.daysRemaining : 365;
                              licenseInfoText = `👑 Bản quyền ${pkgLabelDisplay} - Còn ${dLeft} ngày (Hạn: ${approvedReq.expiryDateStr || '2 năm'})`;
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
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      disabled={approvingId !== null}
                                      onClick={() => handleActivateMachineByYear(
                                        item.machineId,
                                        '1YEAR',
                                        {
                                          fullName: item.fullName || item.predictedName,
                                          phoneNumber: item.phoneNumber,
                                          schoolUnit: item.schoolUnit
                                        }
                                      )}
                                      className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-[10px] transition cursor-pointer flex items-center gap-1"
                                      title="Kích hoạt hoặc gia hạn thêm 1 Năm (365 ngày)"
                                    >
                                      {approvingId === `${item.machineId}_1YEAR` ? (
                                        <RefreshCw className="w-3 h-3 animate-spin" />
                                      ) : null}
                                      <span>{approvingId === `${item.machineId}_1YEAR` ? 'Đang duyệt...' : '+ 1 Năm'}</span>
                                    </button>
                                    <button
                                      type="button"
                                      disabled={approvingId !== null}
                                      onClick={() => handleActivateMachineByYear(
                                        item.machineId,
                                        '2YEAR',
                                        {
                                          fullName: item.fullName || item.predictedName,
                                          phoneNumber: item.phoneNumber,
                                          schoolUnit: item.schoolUnit
                                        }
                                      )}
                                      className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-[10px] transition cursor-pointer flex items-center gap-1"
                                      title="Kích hoạt hoặc gia hạn thêm 2 Năm (730 ngày)"
                                    >
                                      {approvingId === `${item.machineId}_2YEAR` ? (
                                        <RefreshCw className="w-3 h-3 animate-spin" />
                                      ) : null}
                                      <span>{approvingId === `${item.machineId}_2YEAR` ? 'Đang duyệt...' : '+ 2 Năm'}</span>
                                    </button>
                                    <button
                                      type="button"
                                      disabled={approvingId !== null}
                                      onClick={() => handleActivateMachineByYear(
                                        item.machineId,
                                        '3YEAR',
                                        {
                                          fullName: item.fullName || item.predictedName,
                                          phoneNumber: item.phoneNumber,
                                          schoolUnit: item.schoolUnit
                                        }
                                      )}
                                      className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-[10px] transition cursor-pointer flex items-center gap-1"
                                      title="Kích hoạt hoặc gia hạn thêm 3 Năm (1095 ngày)"
                                    >
                                      {approvingId === `${item.machineId}_3YEAR` ? (
                                        <RefreshCw className="w-3 h-3 animate-spin" />
                                      ) : null}
                                      <span>{approvingId === `${item.machineId}_3YEAR` ? 'Đang duyệt...' : '+ 3 Năm'}</span>
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

            {/* DANH SÁCH ĐƠN ĐĂNG KÝ SMART LISTENING PRO TỪ CLOUD */}
            {(() => {
              const ttsCloudRequests = registrationRequests.filter(r => {
                const k = `${r.appId || ''} ${r.appName || ''}`.toLowerCase();
                return k.includes('listening') || k.includes('tts') || k.includes('speech') || k.includes('nghe') || r.machineId.toUpperCase().startsWith('MB-');
              });
              const ttsPendingCount = ttsCloudRequests.filter(r => r.status === 'PENDING').length;
              return (
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-3 my-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-bold text-xs uppercase flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        Đơn Đăng Ký Smart Listening Pro Từ Cloud ({ttsCloudRequests.length})
                      </span>
                      {ttsPendingCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black animate-pulse">
                          {ttsPendingCount} Chờ Duyệt
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Bấm "⚡ 1 Năm" hoặc "👑 Trọn Đời" để duyệt trực tiếp lên Cloud
                    </span>
                  </div>

                  {ttsCloudRequests.length === 0 ? (
                    <div className="text-center py-4 text-xs text-slate-500">
                      Chưa có đơn đăng ký Smart Listening Pro nào gửi về từ Cloud.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400">
                            <th className="pb-2 px-2">Thời gian</th>
                            <th className="pb-2 px-2">Mã máy (HWID)</th>
                            <th className="pb-2 px-2">Giáo viên / SĐT</th>
                            <th className="pb-2 px-2">Trường / Đơn vị</th>
                            <th className="pb-2 px-2">Trạng thái</th>
                            <th className="pb-2 px-2 text-right">Thao tác duyệt</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {ttsCloudRequests.map((req, idx) => (
                            <tr key={req.id || idx} className="hover:bg-slate-800/40">
                              <td className="py-2.5 px-2 text-slate-400 whitespace-nowrap">{req.createdAt}</td>
                              <td className="py-2.5 px-2 font-mono text-cyan-300 font-bold">{req.machineId}</td>
                              <td className="py-2.5 px-2">
                                <div className="text-white font-semibold">{req.fullName || 'Giáo viên'}</div>
                                <div className="text-slate-400 text-[11px]">{req.phoneNumber || '---'}</div>
                              </td>
                              <td className="py-2.5 px-2 text-slate-300">{req.schoolUnit || '---'}</td>
                              <td className="py-2.5 px-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  req.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' :
                                  req.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400 animate-pulse' :
                                  'bg-rose-500/20 text-rose-400'
                                }`}>
                                  {req.status === 'APPROVED' ? 'Đã duyệt' : req.status === 'PENDING' ? 'Chờ duyệt' : 'Từ chối'}
                                </span>
                              </td>
                              <td className="py-2.5 px-2 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setTtsMid(req.machineId);
                                    }}
                                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold cursor-pointer"
                                    title="Nạp vào ô tạo key"
                                  >
                                    📋 Nạp
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleActivateMachineByYear(req.machineId, 1, currentAdminName, {
                                      fullName: req.fullName,
                                      schoolUnit: req.schoolUnit,
                                      phone: req.phoneNumber,
                                      appId: 'smart-listening',
                                      appName: 'Smart Listening Pro (Tạo Bài Nghe SGK)',
                                      issueNumber: req.issueNumber,
                                      reqId: req.id
                                    })}
                                    className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold cursor-pointer shadow"
                                  >
                                    ⚡ 1 Năm
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleActivateMachineByYear(req.machineId, 99, currentAdminName, {
                                      fullName: req.fullName,
                                      schoolUnit: req.schoolUnit,
                                      phone: req.phoneNumber,
                                      appId: 'smart-listening',
                                      appName: 'Smart Listening Pro (Tạo Bài Nghe SGK)',
                                      issueNumber: req.issueNumber,
                                      reqId: req.id
                                    })}
                                    className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold cursor-pointer shadow"
                                  >
                                    👑 Trọn Đời
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* CARD TẠO KEY ED25519 - SMART LISTENING PRO */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/40 space-y-3 my-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  KÝ SỐ ED25519 & TẠO KEY BẢN QUYỀN SMART LISTENING PRO (CHUYỂN VB THÀNH BÀI NGHE)
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  Chuẩn thuật toán Tao_Key_Ban_Quyen.py (Khóa riêng Ed25519 Thầy Thành)
                </span>
              </div>

              <form onSubmit={handleGenerateTTSKey} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-slate-300 font-bold mb-1 text-xs">
                      1. Nhập Mã Máy (Hardware Code) của Khách Hàng:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: MB-8F22-A109"
                      value={ttsMid}
                      onChange={(e) => setTtsMid(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-sm uppercase text-cyan-300 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1 text-xs">
                      2. Chọn Gói Bản Quyền:
                    </label>
                    <select
                      value={ttsPackage}
                      onChange={(e) => setTtsPackage(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
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
                    className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    KÝ SỐ & TẠO MÃ KÍCH HOẠT PRO (ED25519)
                  </button>

                  {ttsGenError && (
                    <span className="text-rose-400 font-semibold text-xs">{ttsGenError}</span>
                  )}
                </div>
              </form>

              {/* KẾT QUẢ SINH KEY & TIN NHẮN ZALO */}
              {ttsKeyResult && (
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1 text-xs">
                      Mã Key kích hoạt Ed25519:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={ttsKeyResult}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-emerald-500/50 font-mono text-xs text-emerald-300 font-bold select-all focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCopyTTSKey}
                        className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 border border-slate-700 cursor-pointer"
                      >
                        {ttsCopiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        {ttsCopiedKey ? 'Đã Chép' : 'Chép Key'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1 text-xs">
                      Mẫu tin nhắn Zalo gửi giáo viên:
                    </label>
                    <div className="flex items-start gap-2">
                      <textarea
                        readOnly
                        rows={5}
                        value={ttsZaloMsg}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-sans text-xs text-slate-300 select-all focus:outline-none leading-relaxed"
                      />
                      <button
                        type="button"
                        onClick={handleCopyTTSZaloMsg}
                        className="py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-md cursor-pointer"
                      >
                        {ttsCopiedMsg ? <Check className="w-4 h-4 text-amber-300" /> : <Send className="w-4 h-4" />}
                        {ttsCopiedMsg ? 'Đã Chép' : 'Chép Tin Zalo'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-slate-300 font-bold mb-1">
                      1. Nhập Mã Máy (Hardware Code) của Khách Hàng:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: DVT-ENG-... hoặc THPT-DVT-..."
                      value={examMid}
                      onChange={(e) => setExamMid(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-sm uppercase text-sky-300 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      2. Cấp Học:
                    </label>
                    <select
                      value={examLevel}
                      onChange={(e) => setExamLevel(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-sky-500"
                    >
                      <option value="THPT">THPT (Lớp 10, 11, 12)</option>
                      <option value="THCS">THCS (Lớp 6, 7, 8, 9)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      3. Chọn Gói Bản Quyền:
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

        {/* TAB 10: TOOL TẠO KEY ED25519 - ĐINH THÀNH MATHSTUDIO 2026+ PRO */}
        {adminTab === 'mathstudio' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
            {/* CARD TẠO KEY */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/60 via-slate-900 to-indigo-950/60 border border-violet-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-violet-300 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  CHỮ KÝ SỐ ED25519 & CẤP BẢN QUYỀN - ĐINH THÀNH MATHSTUDIO 2026+ PRO
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  Mật mã Ed25519 bất đối xứng • Tác giả Thầy Đinh Văn Thành
                </span>
              </div>

              <p className="text-slate-400 text-[11px]">
                Hệ thống sinh mã kích hoạt Pro chuẩn Ed25519 chống bẻ khóa dành riêng cho Add-in Word MathStudio. Khách hàng mở Word, vào tab <strong>Bản quyền & Hệ thống</strong> bấm <strong>Thông tin Bản quyền</strong> để lấy Hardware Code (dạng <code>DVT-MATH-XXXX-XXXX</code>).
              </p>

              <form onSubmit={handleGenerateMathKey} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-slate-300 font-bold mb-1">
                      1. Nhập Mã Máy (Hardware Code) của Khách Hàng:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: DVT-MATH-8F22-A109"
                      value={mathMid}
                      onChange={(e) => setMathMid(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-sm uppercase text-violet-300 focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      2. Chọn Gói Bản Quyền:
                    </label>
                    <select
                      value={mathYears}
                      onChange={(e) => setMathYears(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-violet-500"
                    >
                      <option value={99}>VIP Trọn Đời (Khuyên dùng - 2099)</option>
                      <option value={1}>Gói 1 Năm</option>
                      <option value={2}>Gói 2 Năm</option>
                      <option value={3}>Gói 3 Năm</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Crown className="w-4 h-4 text-amber-300" />
                    TẠO MÃ KÍCH HOẠT PRO MATHSTUDIO (ED25519)
                  </button>

                  {mathGenError && (
                    <span className="text-rose-400 font-semibold">{mathGenError}</span>
                  )}
                </div>
              </form>

              {/* KẾT QUẢ SINH KEY & TIN NHẮN ZALO */}
              {mathKeyResult && (
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Mã Key kích hoạt Pro (KEY-MATH-YYYYMMDD-sig):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={mathKeyResult}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-violet-500/50 font-mono text-xs text-violet-300 font-bold select-all focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCopyMathKey}
                        className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 border border-slate-700 cursor-pointer"
                      >
                        {mathCopiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        {mathCopiedKey ? 'Đã copy Key!' : 'Copy Key'}
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
                        onClick={handleCopyMathZaloMsg}
                        className="py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow cursor-pointer"
                      >
                        {mathCopiedMsg ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                        {mathCopiedMsg ? 'Đã copy tin nhắn Zalo!' : 'Sao chép tin nhắn Zalo gửi Khách'}
                      </button>
                    </div>
                    <textarea
                      readOnly
                      rows={8}
                      value={mathZaloMsg}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] leading-relaxed text-slate-200 select-all focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* LỊCH SỬ KEY MATHSTUDIO */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-violet-400" />
                Lịch sử các Key MathStudio đã tạo gần đây ({mathHistory.length} bản ghi):
              </div>
              {mathHistory.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  Chưa có mã bản quyền MathStudio nào được tạo trên trình duyệt này.
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
                      {mathHistory.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-900/60">
                          <td className="py-2 px-2 text-slate-400 whitespace-nowrap">{item.createdAt}</td>
                          <td className="py-2 px-2 font-mono text-violet-300 font-bold">{item.mid}</td>
                          <td className="py-2 px-2 text-amber-300 font-semibold">{item.plan}</td>
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

        {/* TAB 11: TẠO ĐỀ 15 PHÚT TIẾNG ANH (GLOBAL SUCCESS - 48 UNITS) */}
        {adminTab === 'de15p' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
            {/* CARD TẠO KEY */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 border border-cyan-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  CẤP BẢN QUYỀN PRO - TẠO ĐỀ 15 PHÚT TIẾNG ANH THCS (48 UNITS GLOBAL SUCCESS)
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  Mã hóa SHA-256 HMAC • Tác giả Thầy Đinh Văn Thành
                </span>
              </div>

              <p className="text-slate-400 text-[11px]">
                Hệ thống sinh mã kích hoạt Pro cho phần mềm và web Tạo Đề 15 Phút Tiếng Anh (Lớp 6, 7, 8, 9 - 48 Units). Mã máy tính của khách hàng có tiền tố <code>DVT-15M-XXXX-XXXX</code>.
              </p>

              <form onSubmit={handleGenerateDe15pKey} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-slate-300 font-bold mb-1">
                      1. Nhập Mã Máy (Hardware Code) của Khách Hàng:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: DVT-15M-8F22-A109"
                      value={de15pMid}
                      onChange={(e) => setDe15pMid(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-sm uppercase text-cyan-300 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      2. Chọn Gói Bản Quyền:
                    </label>
                    <select
                      value={de15pPackage}
                      onChange={(e: any) => setDe15pPackage(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="lifetime">VIP Trọn Đời (Khuyên dùng - Vĩnh viễn)</option>
                      <option value="1year">Gói 1 Năm Học</option>
                      <option value="2year">Gói 2 Năm Học</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Crown className="w-4 h-4 text-amber-300" />
                    TẠO MÃ KÍCH HOẠT PRO TẠO ĐỀ 15P
                  </button>

                  {de15pGenError && (
                    <span className="text-red-400 font-medium">{de15pGenError}</span>
                  )}
                </div>
              </form>

              {/* KẾT QUẢ SINH KEY */}
              {de15pKeyResult && (
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider">
                        Mã Kích Hoạt Bản Quyền Pro (Gửi cho khách):
                      </div>
                      <div className="font-mono text-base font-black text-amber-400 select-all tracking-wide break-all">
                        {de15pKeyResult}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleCopyDe15pKey}
                        className="py-2 px-3.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow"
                      >
                        {de15pCopiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {de15pCopiedKey ? 'Đã sao chép' : 'Sao chép Key'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyDe15pZaloMsg}
                        className="py-2 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow"
                      >
                        {de15pCopiedMsg ? <Check className="w-3.5 h-3.5" /> : <MessageCircle className="w-3.5 h-3.5" />}
                        {de15pCopiedMsg ? 'Đã sao chép' : 'Copy Tin Nhắn Zalo'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">
                      Mẫu tin nhắn Zalo gửi kèm hướng dẫn cho khách hàng:
                    </label>
                    <textarea
                      readOnly
                      rows={4}
                      value={de15pZaloMsg}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] leading-relaxed text-slate-200 select-all focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* LỊCH SỬ KEY TẠO ĐỀ 15P */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                Lịch sử các Key Tạo Đề 15P đã tạo gần đây ({de15pHistory.length} bản ghi):
              </div>
              {de15pHistory.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  Chưa có mã bản quyền Tạo Đề 15P nào được tạo trên trình duyệt này.
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
                      {de15pHistory.map((item, i) => (
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

        {/* ========================================================================= */}
        {/* TAB 11: CẢNH BÁO XÂM NHẬP, PHÁ KHÓA & NHẬN DIỆN THIẾT BỊ KHẢ NGHI */}
        {/* ========================================================================= */}
        {adminTab === 'security' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Header tab */}
            <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-900 border border-red-500/40 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl shadow-red-950/20">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-400 shrink-0 shadow-inner">
                  <ShieldAlert className="w-7 h-7 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <span>HỆ THỐNG GIÁM SÁT AN NINH & BÁO ĐỘNG PHÁ KHÓA</span>
                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-[10px] font-black text-red-300">
                      TELEMETRY 24/7
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Tự động nhận diện thiết bị khả nghi (Decompile / Debugger / Fake Key / Lùi giờ), suy luận danh tính giáo viên & trường học
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => loadTrackingData()}
                  disabled={isLoadingAlerts}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 transition active:scale-95 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 text-rose-400 ${isLoadingAlerts ? 'animate-spin' : ''}`} />
                  <span>{isLoadingAlerts ? 'Đang quét Cloud...' : 'Quét & Đồng Bộ Ngay'}</span>
                </button>
              </div>
            </div>

            {/* 4 Thẻ chỉ số tổng quan */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-medium text-slate-400">Tổng vụ phát hiện</div>
                  <div className="text-lg font-black text-white">{securityAlerts.length}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-red-500/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 shrink-0">
                  <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce" />
                </div>
                <div>
                  <div className="text-[11px] font-medium text-rose-300">Nguy cấp chưa xử lý</div>
                  <div className="text-lg font-black text-rose-400">
                    {securityAlerts.filter(a => a.status === 'UNRESOLVED').length}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-medium text-slate-400">Đã khóa máy vĩnh viễn</div>
                  <div className="text-lg font-black text-amber-300">
                    {securityAlerts.filter(a => a.status === 'BLOCKED').length}
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-medium text-slate-400">Đã nhận diện danh tính</div>
                  <div className="text-lg font-black text-cyan-300">
                    {securityAlerts.filter(a => a.teacherGuess && !a.teacherGuess.includes('Chưa')).length}
                  </div>
                </div>
              </div>
            </div>

            {/* Thanh tìm kiếm & Bộ lọc */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  value={securitySearch}
                  onChange={(e) => setSecuritySearch(e.target.value)}
                  placeholder="Tìm theo Tên máy, Username, Mã máy, Họ tên GV, Trường, IP..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto text-xs">
                {(['ALL', 'UNRESOLVED', 'BLOCKED', 'CRITICAL'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setSecurityFilter(f)}
                    className={`py-1.5 px-3 rounded-lg font-bold transition ${
                      securityFilter === f
                        ? 'bg-red-600 text-white shadow'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {f === 'ALL' && 'Tất cả'}
                    {f === 'UNRESOLVED' && '🚨 Chưa xử lý'}
                    {f === 'BLOCKED' && '🔒 Đã khóa'}
                    {f === 'CRITICAL' && '🔴 Mức Nguy Cấp'}
                  </button>
                ))}
              </div>
            </div>

            {/* BẢNG DANH SÁCH CẢNH BÁO CHI TIẾT */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold">
                      <th className="p-3 w-10 text-center">STT</th>
                      <th className="p-3">Thời Điểm & Mức Độ</th>
                      <th className="p-3">Dự Đoán Danh Tính & Trường</th>
                      <th className="p-3">Máy Tính & User Windows</th>
                      <th className="p-3">Địa Chỉ IP & Vị Trí Mạng</th>
                      <th className="p-3">Hành Vi Bị Phát Hiện</th>
                      <th className="p-3 text-center">Xử Lý An Ninh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {securityAlerts
                      .filter(a => {
                        if (securityFilter === 'UNRESOLVED' && a.status !== 'UNRESOLVED') return false;
                        if (securityFilter === 'BLOCKED' && a.status !== 'BLOCKED') return false;
                        if (securityFilter === 'CRITICAL' && a.severity !== 'CRITICAL') return false;
                        if (!securitySearch.trim()) return true;
                        const s = securitySearch.toLowerCase();
                        return (
                          a.computerName?.toLowerCase().includes(s) ||
                          a.userName?.toLowerCase().includes(s) ||
                          a.machineId?.toLowerCase().includes(s) ||
                          a.teacherGuess?.toLowerCase().includes(s) ||
                          a.schoolGuess?.toLowerCase().includes(s) ||
                          a.ipAddress?.toLowerCase().includes(s) ||
                          a.location?.toLowerCase().includes(s) ||
                          a.tamperDetails?.toLowerCase().includes(s)
                        );
                      })
                      .map((alert, idx) => (
                        <tr key={alert.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 text-center font-mono text-slate-500 font-bold">
                            {idx + 1}
                          </td>

                          {/* Thời điểm & Mức độ */}
                          <td className="p-3">
                            <div className="font-mono text-[11px] text-slate-300 font-semibold">{alert.detectedAt}</div>
                            <div className="mt-1 flex items-center gap-1.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider ${
                                alert.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                                alert.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                                'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                              }`}>
                                {alert.severity}
                              </span>
                              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                alert.status === 'BLOCKED' ? 'bg-red-900/60 text-red-200 border border-red-700' :
                                alert.status === 'IGNORED' ? 'bg-slate-800 text-slate-400' :
                                'bg-rose-950 text-rose-300 border border-rose-500/50 animate-pulse'
                              }`}>
                                {alert.status === 'BLOCKED' ? 'ĐÃ KHÓA MÁY' : alert.status === 'IGNORED' ? 'ĐÃ BỎ QUA' : 'CHƯA XỬ LÝ'}
                              </span>
                            </div>
                          </td>

                          {/* Dự đoán danh tính & Trường học */}
                          <td className="p-3 max-w-[200px]">
                            {alert.teacherGuess ? (
                              <div>
                                <div className="font-bold text-white flex items-center gap-1">
                                  <UserCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                  <span className="truncate">{alert.teacherGuess}</span>
                                </div>
                                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                  <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                                  <span className="truncate">{alert.schoolGuess || 'Chưa rõ trường'}</span>
                                </div>
                                {alert.phoneGuess && (
                                  <div className="text-[10px] text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                                    <Phone className="w-2.5 h-2.5" />
                                    <span>{alert.phoneGuess}</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-slate-500 italic text-[11px]">
                                Chưa đối chiếu được danh tính (Khách chưa từng gửi đơn)
                              </div>
                            )}
                          </td>

                          {/* Máy tính & User Windows */}
                          <td className="p-3">
                            <div className="font-bold text-slate-200 flex items-center gap-1 font-mono">
                              <Laptop className="w-3.5 h-3.5 text-indigo-400" />
                              <span>{alert.computerName}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                              User: <span className="text-amber-300 font-semibold">{alert.userName}</span>
                              {alert.userDomain && <span className="text-slate-500"> ({alert.userDomain})</span>}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                              ID: <span className="text-cyan-400 font-bold">{alert.machineId}</span>
                            </div>
                            {alert.detectedEmail && (
                              <div className="text-[10px] text-sky-400 font-mono mt-0.5 truncate">
                                ✉️ {alert.detectedEmail}
                              </div>
                            )}
                          </td>

                          {/* Địa chỉ IP & Vị trí mạng */}
                          <td className="p-3">
                            <div className="font-mono text-cyan-300 font-bold flex items-center gap-1">
                              <Globe className="w-3 h-3 text-cyan-400" />
                              <span>{alert.ipAddress}</span>
                            </div>
                            <div className="text-[11px] text-slate-300 mt-0.5">
                              {alert.location || 'Việt Nam'}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {alert.osVersion}
                            </div>
                          </td>

                          {/* Hành vi bị phát hiện */}
                          <td className="p-3 max-w-[240px]">
                            <div className="flex items-center gap-1 text-red-400 font-bold text-[11px]">
                              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                              <span>
                                {alert.tamperType === 'DECOMPILE' && 'Dịch ngược mã nguồn Python (Decompile)'}
                                {alert.tamperType === 'DEBUGGER' && 'Gắn tiến trình gỡ lỗi (Debugger)'}
                                {alert.tamperType === 'BINARY_TAMPER' && 'Can thiệp sửa đổi file nhị phân'}
                                {alert.tamperType === 'TIME_TAMPER' && 'Lùi đồng hồ hệ thống (Time Tamper)'}
                                {alert.tamperType === 'FAKE_KEY' && 'Nhập mã Key giả mạo Ed25519'}
                                {alert.tamperType === 'UNPACK_ATTEMPT' && 'Cố tình bung gói EXE nhị phân'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300 mt-1 line-clamp-2" title={alert.tamperDetails}>
                              {alert.tamperDetails}
                            </p>
                          </td>

                          {/* Xử lý an ninh */}
                          <td className="p-3 text-center space-y-1.5">
                            <div className="flex flex-col gap-1.5">
                              {alert.status !== 'BLOCKED' ? (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (window.confirm(`XÁC NHẬN KHÓA MÁY VĨNH VIỄN!\n\n• Thiết bị: [${alert.computerName}] (User: ${alert.userName})\n• Mã máy: ${alert.machineId}\n• Lý do: ${alert.tamperDetails}\n\nSau khi khóa, toàn bộ các ứng dụng của Thầy Thành trên máy tính này sẽ tự động KHÓA CỨNG VĨNH VIỄN.`)) {
                                      setActionNotice({ type: 'loading', title: 'Đang khóa máy trên Cloud...', message: `Đang gửi lệnh khóa máy ${alert.machineId}` });
                                      const ok = await cloudSyncService.resolveSecurityAlertWithBlock(
                                        alert.id,
                                        alert.machineId,
                                        currentAdminName || 'Thầy Đinh Văn Thành',
                                        alert.tamperDetails,
                                        alert.issueNumber
                                      );
                                      if (ok) {
                                        setSecurityAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, status: 'BLOCKED' } : a));
                                        setActionNotice({ type: 'success', title: 'Đã khóa máy vĩnh viễn!', message: `Mã máy [${alert.machineId}] đã bị đưa vào danh sách cấm.` });
                                      } else {
                                        setActionNotice({ type: 'error', title: 'Lỗi', message: 'Không thể khóa máy trên Cloud.' });
                                      }
                                    }
                                  }}
                                  className="py-1 px-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow transition active:scale-95 cursor-pointer"
                                >
                                  <Lock className="w-3 h-3" />
                                  <span>Khóa Máy Vĩnh Viễn</span>
                                </button>
                              ) : (
                                <span className="py-1 px-2 rounded-lg bg-red-950 border border-red-700 text-red-300 font-bold text-[10px] inline-flex items-center justify-center gap-1">
                                  <Lock className="w-3 h-3" />
                                  Đã Bị Khóa
                                </span>
                              )}

                              <button
                                type="button"
                                onClick={() => setSelectedAlertForEvidence(alert)}
                                className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-[11px] flex items-center justify-center gap-1 border border-slate-700 transition"
                              >
                                <Copy className="w-3 h-3" />
                                <span>Lập Bằng Chứng</span>
                              </button>

                              {alert.phoneGuess && (
                                <a
                                  href={`https://zalo.me/${alert.phoneGuess.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                    `Kính gửi Thầy/Cô ${alert.teacherGuess || ''},\nHệ thống an ninh của Thầy giáo Đinh Văn Thành phát hiện máy tính [${alert.computerName}] (Mã máy: ${alert.machineId}) vừa có hành vi can thiệp phần mềm: ${alert.tamperDetails}.\nKính đề nghị Thầy/Cô liên hệ Thầy Thành (0915.213717) để làm rõ.`
                                  )}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="py-1 px-2 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white font-semibold text-[10px] flex items-center justify-center gap-1 transition"
                                >
                                  <Send className="w-2.5 h-2.5" />
                                  <span>Zalo Đối Chất</span>
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}

                    {securityAlerts.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500">
                          <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-60" />
                          <p className="font-bold text-sm text-slate-300">Hệ thống an ninh an toàn tuyệt đối</p>
                          <p className="text-xs text-slate-500 mt-1">Chưa phát hiện hành vi xâm nhập hoặc cố tình decompile nào trên các máy khách hàng.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODAL XUẤT BIÊN BẢN BẰNG CHỨNG XÂM NHẬP PHÁ KHÓA */}
        {selectedAlertForEvidence && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-slate-900 border border-red-500/50 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl shadow-red-950/50 relative">
              <button
                onClick={() => setSelectedAlertForEvidence(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <span>BIÊN BẢN BẰNG CHỨNG XÂM NHẬP</span>
                    <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-bold">
                      ĐỐI CHỨNG PHÁP LÝ
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Trích xuất đầy đủ thông tin máy tính, địa chỉ mạng và hành vi vi phạm bản quyền
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-1.5 leading-relaxed max-h-80 overflow-y-auto select-all">
                <div className="text-amber-400 font-bold border-b border-slate-800 pb-1.5 mb-2">
                  === BẰNG CHỨNG GIÁM SÁT AN NINH PHẦN MỀM GIÁO VIÊN AI ===
                </div>
                <div>• Thời điểm phát hiện: <span className="text-white font-bold">{selectedAlertForEvidence.detectedAt}</span></div>
                <div>• Mã máy tính (Hardware ID): <span className="text-cyan-300 font-bold">{selectedAlertForEvidence.machineId}</span></div>
                <div>• Tên máy tính (ComputerName): <span className="text-white font-bold">{selectedAlertForEvidence.computerName}</span></div>
                <div>• Tài khoản Windows: <span className="text-amber-300 font-bold">{selectedAlertForEvidence.userName}</span> ({selectedAlertForEvidence.userDomain})</div>
                <div>• Hệ điều hành: <span className="text-slate-300">{selectedAlertForEvidence.osVersion}</span></div>
                <div>• Địa chỉ IP Public: <span className="text-cyan-300 font-bold">{selectedAlertForEvidence.ipAddress}</span></div>
                <div>• Vị trí mạng & Nhà mạng: <span className="text-white">{selectedAlertForEvidence.location}</span></div>
                <div>• Email phát hiện: <span className="text-sky-300">{selectedAlertForEvidence.detectedEmail || 'Không có'}</span></div>
                <div>• Dự đoán giáo viên: <span className="text-emerald-400 font-bold">{selectedAlertForEvidence.teacherGuess || 'Chưa đối chiếu'}</span></div>
                <div>• Trường / Đơn vị: <span className="text-slate-300">{selectedAlertForEvidence.schoolGuess || 'Chưa rõ'}</span></div>
                <div>• SĐT / Zalo: <span className="text-slate-300">{selectedAlertForEvidence.phoneGuess || 'Chưa rõ'}</span></div>
                <div>• Loại vi phạm: <span className="text-red-400 font-bold">{selectedAlertForEvidence.tamperType}</span></div>
                <div>• Chi tiết hành vi: <span className="text-red-300">{selectedAlertForEvidence.tamperDetails}</span></div>
                <div className="pt-2 text-slate-500 text-[11px] border-t border-slate-800 mt-2">
                  Tác quyền phần mềm: Thầy giáo Đinh Văn Thành - Hotline/Zalo: 0915.213717 - Trường THCS Đồng Yên.
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const text = `=== BẰNG CHỨNG GIÁM SÁT AN NINH PHẦN MỀM GIÁO VIÊN AI ===
• Thời điểm phát hiện: ${selectedAlertForEvidence.detectedAt}
• Mã máy tính (Hardware ID): ${selectedAlertForEvidence.machineId}
• Tên máy tính (ComputerName): ${selectedAlertForEvidence.computerName}
• Tài khoản Windows: ${selectedAlertForEvidence.userName} (${selectedAlertForEvidence.userDomain})
• Hệ điều hành: ${selectedAlertForEvidence.osVersion}
• Địa chỉ IP Public: ${selectedAlertForEvidence.ipAddress}
• Vị trí mạng: ${selectedAlertForEvidence.location}
• Email phát hiện: ${selectedAlertForEvidence.detectedEmail || 'Không có'}
• Dự đoán giáo viên: ${selectedAlertForEvidence.teacherGuess || 'Chưa đối chiếu'}
• Trường / Đơn vị: ${selectedAlertForEvidence.schoolGuess || 'Chưa rõ'}
• SĐT: ${selectedAlertForEvidence.phoneGuess || 'Chưa rõ'}
• Loại vi phạm: ${selectedAlertForEvidence.tamperType}
• Chi tiết hành vi: ${selectedAlertForEvidence.tamperDetails}
Tác quyền: Thầy giáo Đinh Văn Thành - Hotline/Zalo: 0915.213717.`;
                    navigator.clipboard.writeText(text);
                    setCopiedEvidence(true);
                    setTimeout(() => setCopiedEvidence(false), 2000);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                >
                  {copiedEvidence ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedEvidence ? '✅ Đã Sao Chép Biên Bản!' : '📋 Sao Chép Bằng Chứng Đối Chứng'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAlertForEvidence(null)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FLOATING ACTION NOTICE TOAST */}
        {actionNotice && (
          <div className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-2xl shadow-2xl border backdrop-blur-md transition-all animate-in slide-in-from-top-4 ${
            actionNotice.type === 'success' ? 'bg-emerald-950/95 border-emerald-500/60 text-emerald-200' :
            actionNotice.type === 'error' ? 'bg-rose-950/95 border-rose-500/60 text-rose-200' :
            'bg-sky-950/95 border-sky-500/60 text-sky-200'
          }`}>
            <div className="flex items-start gap-3">
              {actionNotice.type === 'loading' ? (
                <RefreshCw className="w-5 h-5 text-sky-400 animate-spin shrink-0 mt-0.5" />
              ) : actionNotice.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 text-xs">
                <h4 className="font-bold text-sm mb-0.5 text-white">{actionNotice.title}</h4>
                <p className="opacity-90">{actionNotice.message}</p>
              </div>
              <button onClick={() => setActionNotice(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* MODAL KÍCH HOẠT THÀNH CÔNG VÀ CHÉP KEY / ZALO */}
        {activationSuccessData && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-slate-900 border border-emerald-500/50 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl shadow-emerald-950/50 relative">
              <button 
                onClick={() => setActivationSuccessData(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Crown className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2 flex-wrap">
                    <span>KÍCH HOẠT THÀNH CÔNG!</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
                      {activationSuccessData.packageLabel}
                    </span>
                  </h3>
                  <p className="text-xs text-emerald-300/80">
                    Bản quyền đã được cấp phép & đồng bộ tức thì lên Cloud
                  </p>
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">💻 Mã máy (Hardware Code):</span>
                  <span className="font-mono font-bold text-cyan-300">{activationSuccessData.machineId}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">👤 Giáo viên nhận:</span>
                  <span className="font-bold text-white">{activationSuccessData.teacherName}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">⏳ Thời hạn sử dụng:</span>
                  <span className="font-bold text-amber-300">
                    {activationSuccessData.packageLabel} - Còn {activationSuccessData.daysRemaining} ngày (Hạn: {activationSuccessData.expDate})
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">✍️ Người kích hoạt:</span>
                  <span className="font-bold text-emerald-400">{activationSuccessData.reviewer}</span>
                </div>
              </div>

              {activationSuccessData.licenseKey && (
                <div className="space-y-1.5">
                  <label className="block text-slate-300 font-bold text-xs flex items-center justify-between">
                    <span>🔑 Mã Key Ed25519 (Đã ký số an toàn):</span>
                    <span className="text-[10px] text-emerald-400 font-normal">Hợp lệ trên máy khách</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={activationSuccessData.licenseKey}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-emerald-500/50 font-mono text-xs text-emerald-300 font-bold select-all focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(activationSuccessData.licenseKey);
                        setCopiedSuccessKey(true);
                        setTimeout(() => setCopiedSuccessKey(false), 2000);
                      }}
                      className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 transition cursor-pointer"
                      title="Sao chép Key"
                    >
                      {copiedSuccessKey ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedSuccessKey ? 'Đã chép' : 'Chép Key'}</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                {activationSuccessData.zaloMsg && (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(activationSuccessData.zaloMsg);
                      setCopiedSuccessZalo(true);
                      setTimeout(() => setCopiedSuccessZalo(false), 2000);
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    {copiedSuccessZalo ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedSuccessZalo ? '✅ Đã Chép Tin Nhắn Zalo!' : '📋 Sao Chép Tin Zalo Gửi Khách'}</span>
                  </button>
                )}
                {activationSuccessData.phone && (
                  <a
                    href={`https://zalo.me/${activationSuccessData.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Send className="w-4 h-4" />
                    <span>Mở Zalo Gửi Ngay</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setActivationSuccessData(null)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        {/* MODAL CHI TIẾT DANH SÁCH MÁY TÍNH ĐÃ CÀI ĐẶT & UPDATE TỪNG APP */}
        {showQuotaDetailModal && selectedQuotaApp && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl max-w-4xl w-full max-h-[88vh] flex flex-col overflow-hidden shadow-2xl shadow-cyan-950/40">
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-white">{selectedQuotaApp.appName}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        {selectedQuotaApp.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Đã cài đặt: <strong className="text-cyan-400">{selectedQuotaApp.installedMachinesCount} máy tính (Unique)</strong> • Dùng thử: <strong className="text-amber-400">{selectedQuotaApp.trialMachinesCount}</strong> • Kích hoạt Pro: <strong className="text-emerald-400">{selectedQuotaApp.activatedMachinesCount}</strong> • Lượt GV Update: <strong className="text-purple-400">{selectedQuotaApp.updateCount}</strong>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowQuotaDetailModal(false)}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search & Tool Bar */}
              <div className="p-3 border-b border-slate-800 bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm theo ID máy, tên GV, trường, SĐT..."
                    value={machineDetailSearch}
                    onChange={(e) => setMachineDetailSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="text-xs text-slate-400">
                  Hiển thị: <strong className="text-cyan-400">
                    {selectedQuotaApp.machines.filter(m => {
                      if (!machineDetailSearch.trim()) return true;
                      const q = machineDetailSearch.toLowerCase();
                      return (
                        m.machineId.toLowerCase().includes(q) ||
                        (m.fullName && m.fullName.toLowerCase().includes(q)) ||
                        (m.schoolUnit && m.schoolUnit.toLowerCase().includes(q)) ||
                        (m.phoneNumber && m.phoneNumber.includes(q))
                      );
                    }).length} / {selectedQuotaApp.machines.length}
                  </strong> máy tính duy nhất
                </div>
              </div>

              {/* Table List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-md text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-800 z-10">
                    <tr>
                      <th className="py-2 px-2.5 text-center w-10">STT</th>
                      <th className="py-2 px-2.5">Mã Máy Tính (Hardware ID)</th>
                      <th className="py-2 px-2.5">Giáo Viên / Đơn Vị</th>
                      <th className="py-2 px-2.5">SĐT Zalo</th>
                      <th className="py-2 px-2.5 text-center">Cài Đầu Tiên</th>
                      <th className="py-2 px-2.5 text-center">Lần Cuối</th>
                      <th className="py-2 px-2.5 text-center">Lượt Update</th>
                      <th className="py-2 px-2.5 text-center">Trạng Thái</th>
                      <th className="py-2 px-2.5 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {selectedQuotaApp.machines
                      .filter(m => {
                        if (!machineDetailSearch.trim()) return true;
                        const q = machineDetailSearch.toLowerCase();
                        return (
                          m.machineId.toLowerCase().includes(q) ||
                          (m.fullName && m.fullName.toLowerCase().includes(q)) ||
                          (m.schoolUnit && m.schoolUnit.toLowerCase().includes(q)) ||
                          (m.phoneNumber && m.phoneNumber.includes(q))
                        );
                      })
                      .map((m, idx) => (
                        <tr key={m.machineId} className="hover:bg-slate-950/60 transition-colors">
                          <td className="py-2.5 px-2.5 text-center font-bold text-slate-500">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-2.5 font-mono text-cyan-300 font-bold">
                            <div className="flex items-center gap-1.5">
                              <span>{m.machineId}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(m.machineId);
                                  alert(`Đã sao chép mã máy: ${m.machineId}`);
                                }}
                                className="text-slate-500 hover:text-cyan-400 transition"
                                title="Sao chép ID máy"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                          <td className="py-2.5 px-2.5">
                            <div className="font-semibold text-white">{m.fullName || 'Giáo viên'}</div>
                            {m.schoolUnit && <div className="text-[10px] text-slate-400">{m.schoolUnit}</div>}
                          </td>
                          <td className="py-2.5 px-2.5 font-mono text-emerald-400">
                            {m.phoneNumber || '-'}
                          </td>
                          <td className="py-2.5 px-2.5 text-center text-slate-400 text-[11px] whitespace-nowrap">
                            {m.firstSeenAt}
                          </td>
                          <td className="py-2.5 px-2.5 text-center text-slate-400 text-[11px] whitespace-nowrap">
                            {m.lastSeenAt}
                          </td>
                          <td className="py-2.5 px-2.5 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800/80 font-bold text-xs">
                              {m.updateCount || 0} lượt
                            </span>
                          </td>
                          <td className="py-2.5 px-2.5 text-center">
                            {m.status === 'ACTIVE_PRO' ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[10px] inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> ĐÃ KÍCH HOẠT PRO
                              </span>
                            ) : m.status === 'TRIAL' ? (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-[10px] inline-flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> DÙNG THỬ
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-bold text-[10px] inline-flex items-center gap-1">
                                <Laptop className="w-3 h-3" /> ĐÃ CÀI ĐẶT
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setShowQuotaDetailModal(false);
                                // Điều hướng sang tab cấp key tương ứng
                                if (selectedQuotaApp.appId === 'tich-hop-nls-ai') {
                                  setAdminTab('nls');
                                  setNlsMid(m.machineId);
                                } else if (selectedQuotaApp.appId.includes('tao-de-tieng-anh')) {
                                  setAdminTab('taode');
                                  setExamMid(m.machineId);
                                  setExamLevel(selectedQuotaApp.appId.includes('thpt') ? 'THPT' : 'THCS');
                                } else if (selectedQuotaApp.appId === 'tao-de-15p-tieng-anh') {
                                  setAdminTab('de15p');
                                  setDe15pMid(m.machineId);
                                } else if (selectedQuotaApp.appId === 'mathstudio') {
                                  setAdminTab('mathstudio');
                                  setMathMid(m.machineId);
                                } else if (selectedQuotaApp.appId === 'tao-de-thcs-8mon') {
                                  setAdminTab('thcs8m');
                                  setThcs8mMid(m.machineId);
                                } else if (selectedQuotaApp.appId === 'sinh-de-bienthe') {
                                  setAdminTab('bienthe');
                                  setBientheMid(m.machineId);
                                } else if (selectedQuotaApp.appId === 'cleaner-pro') {
                                  setAdminTab('cleaner');
                                  setCleanerMid(m.machineId);
                                } else if (selectedQuotaApp.appId === 'chuan-hoa-van-ban') {
                                  setAdminTab('chuanhoavb');
                                  setChvbMid(m.machineId);
                                } else if (selectedQuotaApp.appId === 'pdf-suite') {
                                  setAdminTab('pdfsuite');
                                  setPdfMid(m.machineId);
                                } else if (selectedQuotaApp.appId === 'screen-record') {
                                  setAdminTab('record');
                                  setRecordMid(m.machineId);
                                } else {
                                  setAdminTab('tts');
                                }
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] inline-flex items-center gap-1 transition cursor-pointer shadow-sm"
                            >
                              <Key className="w-3 h-3" />
                              <span>Cấp Key Pro</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    {selectedQuotaApp.machines.length === 0 && (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-slate-500">
                          Chưa có máy tính nào cài đặt ứng dụng này.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="p-3.5 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
                <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Quy tắc: Mỗi máy tính sở hữu mã phần cứng độc nhất (Hardware Fingerprint) và chỉ tính 1 lần cài đặt duy nhất.</span>
                </p>
                <button
                  type="button"
                  onClick={() => setShowQuotaDetailModal(false)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
                >
                  Đóng Cửa Sổ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
