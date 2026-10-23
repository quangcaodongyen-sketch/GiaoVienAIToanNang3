import { cloudSyncService } from './services/cloudSyncService';
import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Sparkles, 
  ExternalLink, 
  Phone, 
  MessageCircle, 
  Share2, 
  GraduationCap, 
  UserCheck, 
  FileText, 
  Layers,
  Crown,
  Search,
  CheckCircle2,
  Check,
  Palette,
  LayoutGrid,
  ListFilter,
  SlidersHorizontal,
  Globe,
  Copy,
  Info,
  ChevronRight,
  BookOpen,
  Award,
  Zap
} from 'lucide-react';
import { BRAND } from './config/brand';
import { apps, AppCard } from './data/apps';
import { AdminDashboard } from './components/AdminDashboard';
import { TrialRegisterModal } from './components/TrialRegisterModal';
import { activityTrackingService, ADMIN_WHITELIST_MACHINES } from './services/activityTrackingService';
import { OnlineTTSModal } from './components/OnlineTTSModal';
import { NLSAIModal } from './components/NLSAIModal';
import { TaoDeTiengAnhModal } from './components/TaoDeTiengAnhModal';
import { TaoDeTiengAnhTieuHocModal } from './components/TaoDeTiengAnhTieuHocModal';
import { TaoDeTiengVietTieuHocModal } from './components/TaoDeTiengVietTieuHocModal';
import { TaoDeTiengAnhTHPTModal } from './components/TaoDeTiengAnhTHPTModal';
import { TaoDeToanTHPTModal } from './components/TaoDeToanTHPTModal';
import { SinhDeBienTheModal } from './components/SinhDeBienTheModal';
import { ScreenRecordModal } from './components/ScreenRecordModal';
import { CleanerModal } from './components/CleanerModal';
import { ChuanHoaVBModal } from './components/ChuanHoaVBModal';
import { TachGopPDFModal } from './components/TachGopPDFModal';
import { TaoDeTHCS8MonModal } from './components/TaoDeTHCS8MonModal';
import { TaoDeLichSuTHCSModal } from './components/TaoDeLichSuTHCSModal';
import { MathStudioModal } from './components/MathStudioModal';
import { TaoDe15PhutModal } from './components/TaoDe15PhutModal';
import { TaoDeTHPTSubjectModal } from './components/TaoDeTHPTSubjectModal';
import { CrossPromoBanner } from './components/CrossPromoBanner';
import { webSecurityGuard } from './services/webSecurityGuard';
import { MaintenanceScreen } from './components/MaintenanceScreen';
import { systemMaintenanceService } from './services/systemMaintenanceService';
import { getAppShareUrl, copyToClipboard, syncBrowserHash } from './utils/shareUtils';
import { TeacherCatalog } from './components/TeacherCatalog';
import { AdminPortal } from './components/AdminPortal';
import { StudentPortal } from './components/StudentPortal';

export type MainViewTab = 'teachers' | 'admin' | 'students';
export type ThemeMode = 'pedagogical' | 'dark-cyber' | 'emerald-sage' | 'royal-purple';
export type ViewMode = 'grid' | 'compact';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  pageBg: string;
  topbarBg: string;
  topbarText: string;
  topbarBorder: string;
  navbarBg: string;
  navBorder: string;
  textHeading: string;
  textBody: string;
  textMuted: string;
  heroGradient: string;
  heroBorder: string;
  heroBadge: string;
  cardBg: string;
  cardBorder: string;
  cardHoverBorder: string;
  cardHoverShadow: string;
  filterBoxBg: string;
  filterBoxBorder: string;
  activeTabBg: string;
  activeTabText: string;
  activeTabShadow: string;
  inactiveTabBg: string;
  inactiveTabText: string;
  primaryBtn: string;
  badgeBg: string;
  footerBg: string;
  footerBorder: string;
  accentColor: string;
}

const THEMES: Record<ThemeMode, ThemeConfig> = {
  'pedagogical': {
    id: 'pedagogical',
    name: 'Giao Diện Sư Phạm',
    shortName: 'Sư Phạm',
    icon: '🎓',
    description: 'Tông Xanh Lam & Trắng dịu mắt, trang nhã, hỗ trợ sư phạm Việt Nam',
    pageBg: 'bg-[#F4F7FB]',
    topbarBg: 'bg-[#091C36]',
    topbarText: 'text-slate-200',
    topbarBorder: 'border-blue-900/40',
    navbarBg: 'bg-white/95 backdrop-blur-md',
    navBorder: 'border-slate-200/90',
    textHeading: 'text-slate-900',
    textBody: 'text-slate-700',
    textMuted: 'text-slate-500',
    heroGradient: 'bg-gradient-to-br from-[#0C233E] via-[#143B64] to-[#1E4E85]',
    heroBorder: 'border-blue-800/40',
    heroBadge: 'bg-cyan-400/20 text-cyan-300 border-cyan-400/30',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200/90',
    cardHoverBorder: 'hover:border-blue-400',
    cardHoverShadow: 'hover:shadow-xl hover:shadow-blue-600/10',
    filterBoxBg: 'bg-white',
    filterBoxBorder: 'border-slate-200/90',
    activeTabBg: 'bg-blue-600',
    activeTabText: 'text-white',
    activeTabShadow: 'shadow-md shadow-blue-600/30',
    inactiveTabBg: 'bg-slate-100 hover:bg-slate-200/80',
    inactiveTabText: 'text-slate-700',
    primaryBtn: 'bg-gradient-to-r from-[#103055] via-[#194573] to-[#2563EB] hover:from-[#0b223d] hover:to-blue-700 text-white',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200/60',
    footerBg: 'bg-[#081526]',
    footerBorder: 'border-slate-800',
    accentColor: '#2563EB'
  },
  'dark-cyber': {
    id: 'dark-cyber',
    name: 'Đêm AI Chuyên Nghiệp',
    shortName: 'Đêm AI',
    icon: '🌌',
    description: 'Chế độ tối công nghệ cao, tương phản sắc nét, làm việc ban đêm không mỏi mắt',
    pageBg: 'bg-[#070B14]',
    topbarBg: 'bg-[#030712]',
    topbarText: 'text-slate-300',
    topbarBorder: 'border-slate-800',
    navbarBg: 'bg-[#0B1222]/95 backdrop-blur-md',
    navBorder: 'border-slate-800',
    textHeading: 'text-white',
    textBody: 'text-slate-300',
    textMuted: 'text-slate-400',
    heroGradient: 'bg-gradient-to-br from-[#0B1120] via-[#101D38] to-[#15274E]',
    heroBorder: 'border-cyan-500/30',
    heroBadge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
    cardBg: 'bg-[#0F172A]',
    cardBorder: 'border-slate-800',
    cardHoverBorder: 'hover:border-cyan-400/80',
    cardHoverShadow: 'hover:shadow-xl hover:shadow-cyan-500/15',
    filterBoxBg: 'bg-[#0B1222]',
    filterBoxBorder: 'border-slate-800',
    activeTabBg: 'bg-cyan-500',
    activeTabText: 'text-slate-950 font-black',
    activeTabShadow: 'shadow-md shadow-cyan-500/30',
    inactiveTabBg: 'bg-slate-800/80 hover:bg-slate-700',
    inactiveTabText: 'text-slate-300',
    primaryBtn: 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold',
    badgeBg: 'bg-cyan-950/70 text-cyan-300 border-cyan-800/60',
    footerBg: 'bg-[#030611]',
    footerBorder: 'border-slate-800/80',
    accentColor: '#06B6D4'
  },
  'emerald-sage': {
    id: 'emerald-sage',
    name: 'Xanh Tri Thức Học Đường',
    shortName: 'Tri Thức',
    icon: '🌿',
    description: 'Tông Xanh Ngọc Lục Bảo tươi mát, khơi gợi cảm hứng giáo dục đổi mới',
    pageBg: 'bg-[#F1F7F4]',
    topbarBg: 'bg-[#052C20]',
    topbarText: 'text-emerald-100',
    topbarBorder: 'border-emerald-900/40',
    navbarBg: 'bg-white/95 backdrop-blur-md',
    navBorder: 'border-emerald-100',
    textHeading: 'text-slate-900',
    textBody: 'text-slate-700',
    textMuted: 'text-slate-500',
    heroGradient: 'bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#0D9488]',
    heroBorder: 'border-emerald-600/40',
    heroBadge: 'bg-emerald-400/20 text-emerald-200 border-emerald-400/30',
    cardBg: 'bg-white',
    cardBorder: 'border-emerald-100/90',
    cardHoverBorder: 'hover:border-emerald-400',
    cardHoverShadow: 'hover:shadow-xl hover:shadow-emerald-600/10',
    filterBoxBg: 'bg-white',
    filterBoxBorder: 'border-emerald-100/90',
    activeTabBg: 'bg-emerald-600',
    activeTabText: 'text-white',
    activeTabShadow: 'shadow-md shadow-emerald-600/30',
    inactiveTabBg: 'bg-emerald-50/70 hover:bg-emerald-100/80',
    inactiveTabText: 'text-emerald-900',
    primaryBtn: 'bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-600 hover:from-emerald-800 hover:to-teal-600 text-white font-bold',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200/60',
    footerBg: 'bg-[#04241A]',
    footerBorder: 'border-emerald-900/50',
    accentColor: '#10B981'
  },
  'royal-purple': {
    id: 'royal-purple',
    name: 'Tím Sáng Tạo Số',
    shortName: 'Sáng Tạo',
    icon: '🔮',
    description: 'Tông Tím Hoàng Gia hiện đại, đậm chất công nghệ giáo dục kỷ nguyên số',
    pageBg: 'bg-[#F8F5FC]',
    topbarBg: 'bg-[#1C0B3B]',
    topbarText: 'text-purple-100',
    topbarBorder: 'border-purple-900/40',
    navbarBg: 'bg-white/95 backdrop-blur-md',
    navBorder: 'border-purple-100',
    textHeading: 'text-slate-900',
    textBody: 'text-slate-700',
    textMuted: 'text-slate-500',
    heroGradient: 'bg-gradient-to-br from-[#2E1065] via-[#4C1D95] to-[#6D28D9]',
    heroBorder: 'border-purple-600/40',
    heroBadge: 'bg-purple-400/20 text-purple-200 border-purple-400/30',
    cardBg: 'bg-white',
    cardBorder: 'border-purple-100/90',
    cardHoverBorder: 'hover:border-purple-400',
    cardHoverShadow: 'hover:shadow-xl hover:shadow-purple-600/10',
    filterBoxBg: 'bg-white',
    filterBoxBorder: 'border-purple-100/90',
    activeTabBg: 'bg-purple-600',
    activeTabText: 'text-white',
    activeTabShadow: 'shadow-md shadow-purple-600/30',
    inactiveTabBg: 'bg-purple-50/70 hover:bg-purple-100/80',
    inactiveTabText: 'text-purple-900',
    primaryBtn: 'bg-gradient-to-r from-[#3B0764] via-[#581C87] to-[#7E22CE] hover:from-[#2e054f] hover:to-purple-700 text-white font-bold',
    badgeBg: 'bg-purple-50 text-purple-800 border-purple-200/60',
    footerBg: 'bg-[#14062E]',
    footerBorder: 'border-purple-900/50',
    accentColor: '#8B5CF6'
  }
};

const QUICK_SUBJECT_CHIPS = [
  { label: 'Tất cả môn', query: '' },
  { label: 'Tiếng Anh', query: 'tiếng anh' },
  { label: 'Toán học', query: 'toán' },
  { label: 'Ngữ văn', query: 'văn' },
  { label: 'KHTN & Lý Hóa', query: 'khoa học tự nhiên' },
  { label: 'Lịch sử', query: 'lịch sử' },
  { label: 'Địa lí', query: 'địa lí' },
  { label: 'Tin học', query: 'tin học' },
  { label: 'GDCD & CN', query: 'công dân' },
  { label: 'Cấp THCS (CV 7991)', query: '7991' },
  { label: 'Cấp THPT (2025+)', query: 'thpt' },
  { label: 'Kế hoạch 5512', query: '5512' },
  { label: 'Chuẩn NĐ 30', query: 'nghị định 30' }
];

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Kiểm tra đường dẫn URL hoặc hash có thuộc Cổng Học Sinh hay không
  const isStudentRoute = () => {
    const rawPath = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    const rawHash = window.location.hash.toLowerCase();
    return (
      rawPath === '/hocsinh' ||
      rawPath === '/hoc-sinh' ||
      rawPath === '/students' ||
      rawPath === '/tuvung' ||
      rawPath === '/tu-vung' ||
      rawPath === '/kiemtra' ||
      rawPath === '/kiem-tra' ||
      rawHash === '#hocsinh' ||
      rawHash === '#hoc-sinh' ||
      rawHash === '#students' ||
      rawHash === '#tuvung' ||
      rawHash === '#tu-vung' ||
      rawHash === '#kiemtra' ||
      rawHash === '#kiem-tra' ||
      rawHash === '#exam' ||
      rawHash === '#eng12_vocab'
    );
  };

  const isAdminRoute = () => {
    const rawPath = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    const rawHash = window.location.hash.toLowerCase();
    return rawPath === '/admin' || rawHash === '#admin' || rawHash === '#quan-tri';
  };

  // Quản lý 3 Phân Hệ Chính Của Website: Kho Giáo Viên | Quản Trị Admin | Góc Học Sinh
  const [mainViewTab, setMainViewTab] = useState<MainViewTab>(() => {
    if (isAdminRoute()) return 'admin';
    if (isStudentRoute()) return 'students';
    return 'teachers';
  });

  // Tự động lắng nghe thay đổi URL (pathname, hash, popstate) và chuẩn hóa về link ngắn: dekiemtraso.com/hocsinh
  useEffect(() => {
    const syncCurrentRoute = () => {
      if (isAdminRoute()) {
        setMainViewTab('admin');
      } else if (isStudentRoute()) {
        setMainViewTab('students');
        // Chuẩn hóa thanh địa chỉ thành /hocsinh gọn gàng, loại bỏ hash kỹ thuật #hoc-sinh
        if (window.location.pathname !== '/hocsinh' || window.location.hash) {
          window.history.replaceState(null, '', '/hocsinh');
        }
      } else {
        setMainViewTab('teachers');
      }
    };

    syncCurrentRoute();

    window.addEventListener('hashchange', syncCurrentRoute);
    window.addEventListener('popstate', syncCurrentRoute);
    return () => {
      window.removeEventListener('hashchange', syncCurrentRoute);
      window.removeEventListener('popstate', syncCurrentRoute);
    };
  }, []);

  // Quản lý Chế độ Giao diện (Theme) & Bố cục Hiển thị (View Mode)
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('gvai_theme_mode');
    if (saved === 'pedagogical' || saved === 'dark-cyber' || saved === 'emerald-sage' || saved === 'royal-purple') {
      return saved;
    }
    return 'pedagogical';
  });

  const [appViewMode, setAppViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('gvai_app_view_mode');
    if (saved === 'grid' || saved === 'compact') {
      return saved;
    }
    return 'compact';
  });

  const [themeToast, setThemeToast] = useState<string | null>(null);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const changeTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
    localStorage.setItem('gvai_theme_mode', mode);
    setShowThemeMenu(false);
    const names: Record<ThemeMode, string> = {
      'pedagogical': '🎓 Giao Diện Sư Phạm',
      'dark-cyber': '🌌 Đêm AI Chuyên Nghiệp',
      'emerald-sage': '🌿 Xanh Tri Thức Học Đường',
      'royal-purple': '🔮 Tím Sáng Tạo Số'
    };
    setThemeToast(`Đã chuyển sang giao diện: ${names[mode]}`);
    setTimeout(() => setThemeToast(null), 3000);
  };

  const changeViewMode = (mode: ViewMode) => {
    setAppViewMode(mode);
    localStorage.setItem('gvai_app_view_mode', mode);
    const names: Record<ViewMode, string> = {
      'grid': '🎴 Dạng Thẻ Lưới Trực Quan',
      'compact': '📋 Dạng Danh Mục Khoa Học Gọn Gàng'
    };
    setThemeToast(`Đã chuyển bố cục: ${names[mode]}`);
    setTimeout(() => setThemeToast(null), 2500);
  };

  const t = THEMES[themeMode];
  const [showSKKNModal, setShowSKKNModal] = useState(false);
  const [showListeningModal, setShowListeningModal] = useState(false);
  const [showNLSAIModal, setShowNLSAIModal] = useState(false);
  const [showTaoDeModal, setShowTaoDeModal] = useState(false);
  const [showTaoDeTieuHocModal, setShowTaoDeTieuHocModal] = useState(false);
  const [showTaoDeTiengVietTieuHocModal, setShowTaoDeTiengVietTieuHocModal] = useState(false);
  const [showTaoDeTHPTModal, setShowTaoDeTHPTModal] = useState(false);
  const [showTaoDeToanTHPTModal, setShowTaoDeToanTHPTModal] = useState(false);
  const [showTaoDeTHPTSubjectModal, setShowTaoDeTHPTSubjectModal] = useState(false);
  const [thptSelectedSubject, setThptSelectedSubject] = useState<string>('TOAN');
  const [showSinhDeBienTheModal, setShowSinhDeBienTheModal] = useState(false);
  const [showScreenRecordModal, setShowScreenRecordModal] = useState(false);
  const [showCleanerModal, setShowCleanerModal] = useState(false);
  const [showChuanHoaVBModal, setShowChuanHoaVBModal] = useState(false);
  const [showTachGopPDFModal, setShowTachGopPDFModal] = useState(false);
  const [showTaoDeTHCS8MonModal, setShowTaoDeTHCS8MonModal] = useState(false);
  const [showTaoDeLichSuTHCSModal, setShowTaoDeLichSuTHCSModal] = useState(false);
  const [showMathStudioModal, setShowMathStudioModal] = useState(false);
  const [showTaoDe15PhutModal, setShowTaoDe15PhutModal] = useState(false);
  const [thcs8MonSelectedSubject, setThcs8MonSelectedSubject] = useState<string>('TOAN');
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [isCurrentBlocked, setIsCurrentBlocked] = useState(false);

  // Quản lý trạng thái Khóa Web (Nâng cấp hệ thống)
  const [isMaintenanceLocked, setIsMaintenanceLocked] = useState<boolean>(() => systemMaintenanceService.isMaintenanceLocked());
  const [isAdminSession, setIsAdminSession] = useState<boolean>(() => systemMaintenanceService.isAdminSession());
  useEffect(() => {
    const mid = activityTrackingService.getOrCreateMachineId();
    const isAdmin = ADMIN_WHITELIST_MACHINES.includes(mid) || mid === 'GV-0DAD-F76C' || mid.includes('DVT');

    if (isAdmin) {
      localStorage.removeItem('gvai_blocked_machines');
      localStorage.removeItem('gvai_blocked_list');
      activityTrackingService.unblockMachine(mid);
      setIsCurrentBlocked(false);
    } else {
      localStorage.removeItem('gvai_unlimited_machine');
      // Dọn dẹp các master key rò rỉ nếu từng vô tình lưu
      if (localStorage.getItem('gvai_taode_active_key')?.includes('DVT-ENG-LIFETIME-MASTER')) {
        localStorage.removeItem('gvai_taode_active_key');
      }
      if (localStorage.getItem('gvai_nls_active_key')?.includes('DVT-NLS-LIFETIME-MASTER')) {
        localStorage.removeItem('gvai_nls_active_key');
      }
      if (localStorage.getItem('gvai_bienthe_active_key')?.includes('DVT-BIENTHE-LIFETIME-MASTER')) {
        localStorage.removeItem('gvai_bienthe_active_key');
      }
      if (localStorage.getItem('gvai_cleaner_active_key')?.includes('DVT-CLEANER-LIFETIME-MASTER')) {
        localStorage.removeItem('gvai_cleaner_active_key');
      }
      if (localStorage.getItem('gvai_mathstudio_active_key')?.includes('DVT-MATH-LIFETIME-MASTER')) {
        localStorage.removeItem('gvai_mathstudio_active_key');
      }
      setIsCurrentBlocked(false);
    }
  }, []);

  // Lắng nghe sự kiện Khóa Web và thay đổi quyền Admin
  useEffect(() => {
    const handleMaintenanceChange = (e: any) => {
      if (e?.detail?.locked !== undefined) {
        setIsMaintenanceLocked(e.detail.locked);
      } else {
        setIsMaintenanceLocked(systemMaintenanceService.isMaintenanceLocked());
      }
    };

    const handleAdminAuthChange = (e: any) => {
      if (e?.detail?.isAuthenticated !== undefined) {
        setIsAdminSession(e.detail.isAuthenticated);
      } else {
        setIsAdminSession(systemMaintenanceService.isAdminSession());
      }
    };

    window.addEventListener('gvai_maintenance_status_changed', handleMaintenanceChange);
    window.addEventListener('gvai_admin_auth_changed', handleAdminAuthChange);

    // Đồng bộ kiểm tra trạng thái bảo trì Cloud
    systemMaintenanceService.checkCloudMaintenanceStatus().then(locked => {
      setIsMaintenanceLocked(locked);
    }).catch(() => {});

    return () => {
      window.removeEventListener('gvai_maintenance_status_changed', handleMaintenanceChange);
      window.removeEventListener('gvai_admin_auth_changed', handleAdminAuthChange);
    };
  }, []);

  const [imgError, setImgError] = useState(false);
  const [appImgErrors, setAppImgErrors] = useState<Record<string, boolean>>({});

  const closeAllModals = () => {
    setShowSKKNModal(false);
    setShowListeningModal(false);
    setShowNLSAIModal(false);
    setShowTaoDeModal(false);
    setShowTaoDeTieuHocModal(false);
    setShowTaoDeTiengVietTieuHocModal(false);
    setShowTaoDeTHPTModal(false);
    setShowTaoDeToanTHPTModal(false);
    setShowTaoDeTHPTSubjectModal(false);
    setShowSinhDeBienTheModal(false);
    setShowScreenRecordModal(false);
    setShowCleanerModal(false);
    setShowChuanHoaVBModal(false);
    setShowTachGopPDFModal(false);
    setShowTaoDeTHCS8MonModal(false);
    setShowTaoDeLichSuTHCSModal(false);
    setShowMathStudioModal(false);
    setShowTaoDe15PhutModal(false);
    setShowAdminDashboard(false);
    webSecurityGuard.setActiveApp('home', 'Cổng Thông Tin Giáo Viên AI Toàn Năng');
    if (window.location.hash && window.location.hash !== '#') {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
  };

  // Lắng nghe phím Escape (Esc) trên toàn trang để đóng modal ngay lập tức
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        closeAllModals();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lắng nghe URL hash để mở modal tương ứng khi người dùng truy cập link trực tiếp
  useEffect(() => {
    activityTrackingService.trackAppVisit('home', 'Trang Chủ Giáo Viên AI Toàn Năng');
    const handleHash = () => {
      const rawHash = window.location.hash;
      const hash = rawHash.replace(/_/g, '-');
      if (hash === '#admin' || hash === '#quan-tri') {
        setMainViewTab('admin');
        return;
      }
      if (hash === '#hoc-sinh' || hash === '#students' || hash === '#hocsinh' || hash === '#tuvung' || hash === '#tu-vung') {
        setMainViewTab('students');
        window.history.replaceState(null, '', '/hocsinh');
        return;
      }
      if (hash === '#giao-vien' || hash === '#apps') {
        setMainViewTab('teachers');
        return;
      }
      if (hash === '#dung-thu' || hash === '#trial') {
        setShowTrialModal(true);
        webSecurityGuard.setActiveApp('trial', 'Đăng Ký Trải Nghiệm Giáo Viên AI');
        return;
      }
      if (hash === '#tao-de-tieng-anh') {
        setShowTaoDeModal(true);
        webSecurityGuard.setActiveApp('tao-de-tieng-anh-thcs', 'Tạo Đề Tiếng Anh THCS (CV 7991)');
      }
      else if (hash === '#taode-tienganh-tieuhoc' || hash === '#tao-de-tieng-anh-tieu-hoc') {
        setShowTaoDeTieuHocModal(true);
        webSecurityGuard.setActiveApp('tao-de-tieng-anh-tieu-hoc', 'Tạo Đề Tiếng Anh Tiểu Học (TT 27)');
      }
      else if (hash === '#taode-tiengviet-tieuhoc' || hash === '#tao-de-tieng-viet-tieu-hoc') {
        setShowTaoDeTiengVietTieuHocModal(true);
        webSecurityGuard.setActiveApp('tao-de-tieng-viet-tieu-hoc', 'Tạo Đề Tiếng Việt Tiểu Học (TT 27)');
      }
      else if (hash === '#tao-de-tieng-anh-thpt') {
        setShowTaoDeTHPTModal(true);
        webSecurityGuard.setActiveApp('tao-de-tieng-anh-thpt', 'Tạo Đề Tiếng Anh THPT (Lớp 10, 11, 12)');
      }
      else if (hash === '#tao-de-toan-thpt') {
        setShowTaoDeToanTHPTModal(true);
        webSecurityGuard.setActiveApp('tao-de-toan-thpt', 'Tạo Đề Toán THPT (QĐ 764/BGDĐT)');
      }
      else if (hash === '#tao-de-van-thpt' || hash === '#tao-de-nguvan-thpt') {
        setThptSelectedSubject('NGUVAN');
        setShowTaoDeTHPTSubjectModal(true);
        webSecurityGuard.setActiveApp('tao-de-van-thpt', 'Tạo Đề Ngữ Văn THPT (2025+)');
      }
      else if (hash === '#tao-de-vatli-thpt' || hash === '#tao-de-vat-li-thpt' || hash === '#tao-de-ly-thpt') {
        setThptSelectedSubject('VATLI');
        setShowTaoDeTHPTSubjectModal(true);
        webSecurityGuard.setActiveApp('tao-de-vatli-thpt', 'Tạo Đề Vật Lí THPT (2025+)');
      }
      else if (hash === '#tao-de-hoahoc-thpt' || hash === '#tao-de-hoa-hoc-thpt' || hash === '#tao-de-hoa-thpt') {
        setThptSelectedSubject('HOAHOC');
        setShowTaoDeTHPTSubjectModal(true);
        webSecurityGuard.setActiveApp('tao-de-hoahoc-thpt', 'Tạo Đề Hóa Học THPT (2025+)');
      }
      else if (hash === '#tao-de-sinhhoc-thpt' || hash === '#tao-de-sinh-hoc-thpt' || hash === '#tao-de-sinh-thpt') {
        setThptSelectedSubject('SINHHOC');
        setShowTaoDeTHPTSubjectModal(true);
        webSecurityGuard.setActiveApp('tao-de-sinhhoc-thpt', 'Tạo Đề Sinh Học THPT (2025+)');
      }
      else if (hash === '#tao-de-tin-thpt' || hash === '#tao-de-tinhoc-thpt') {
        setThptSelectedSubject('TINHOC');
        setShowTaoDeTHPTSubjectModal(true);
        webSecurityGuard.setActiveApp('tao-de-tin-thpt', 'Tạo Đề Tin Học THPT (2025+)');
      }
      else if (hash === '#tao-de-lichsu-thpt' || hash === '#tao-de-lich-su-thpt' || hash === '#tao-de-su-thpt') {
        setThptSelectedSubject('LICHSU');
        setShowTaoDeTHPTSubjectModal(true);
        webSecurityGuard.setActiveApp('tao-de-lichsu-thpt', 'Tạo Đề Lịch Sử THPT (2025+)');
      }
      else if (hash === '#tao-de-diali-thpt' || hash === '#tao-de-dia-li-thpt' || hash === '#tao-de-dia-thpt') {
        setThptSelectedSubject('DIALI');
        setShowTaoDeTHPTSubjectModal(true);
        webSecurityGuard.setActiveApp('tao-de-diali-thpt', 'Tạo Đề Địa Lí THPT (2025+)');
      }
      else if (hash === '#tao-de-gdktpl-thpt' || hash === '#tao-de-gdkt-pl-thpt' || hash === '#tao-de-kinhte-phapluat-thpt') {
        setThptSelectedSubject('GDKTPL');
        setShowTaoDeTHPTSubjectModal(true);
        webSecurityGuard.setActiveApp('tao-de-gdktpl-thpt', 'Tạo Đề GDKT & PL THPT (2025+)');
      }
      else if (hash === '#tao-de-cn-thpt' || hash === '#tao-de-congnghe-thpt' || hash === '#tao-de-cong-nghe-thpt') {
        setThptSelectedSubject('CONGNGHE');
        setShowTaoDeTHPTSubjectModal(true);
        webSecurityGuard.setActiveApp('tao-de-cn-thpt', 'Tạo Đề Công Nghệ THPT (2025+)');
      }
      else if (hash === '#tao-de-toan' || hash === '#tao-de-toan-thcs') {
        setThcs8MonSelectedSubject('TOAN');
        setShowTaoDeTHCS8MonModal(true);
        webSecurityGuard.setActiveApp('tao-de-toan-thcs', 'Tạo Đề Toán THCS (CV 7991)');
      }
      else if (hash === '#tao-de-van' || hash === '#tao-de-van-thcs' || hash === '#tao-de-nguvan-thcs') {
        setThcs8MonSelectedSubject('VAN');
        setShowTaoDeTHCS8MonModal(true);
        webSecurityGuard.setActiveApp('tao-de-van-thcs', 'Tạo Đề Ngữ Văn THCS (CV 7991)');
      }
      else if (hash === '#tao-de-khtn' || hash === '#tao-de-khtn-thcs') {
        setThcs8MonSelectedSubject('KHTN');
        setShowTaoDeTHCS8MonModal(true);
        webSecurityGuard.setActiveApp('tao-de-khtn-thcs', 'Tạo Đề KHTN THCS (CV 7991)');
      }
      else if (hash === '#tao-de-sudia' || hash === '#tao-de-sudia-thcs' || hash === '#tao-de-su-dia-thcs') {
        setThcs8MonSelectedSubject('SUDIA');
        setShowTaoDeTHCS8MonModal(true);
        webSecurityGuard.setActiveApp('tao-de-sudia-thcs', 'Tạo Đề Lịch Sử - Địa Lí THCS');
      }
      else if (hash === '#tao-de-lichsu' || hash === '#tao-de-lich-su-thcs' || hash === '#tao-de-lichsu-thcs') {
        setShowTaoDeLichSuTHCSModal(true);
        webSecurityGuard.setActiveApp('tao-de-lichsu-thcs', 'Tạo Đề Lịch Sử THCS (CV 7991)');
      }
      else if (hash === '#tao-de-diali' || hash === '#tao-de-dia-li-thcs' || hash === '#tao-de-diali-thcs' || hash === '#tao-de-dia') {
        setThcs8MonSelectedSubject('DIALI');
        setShowTaoDeTHCS8MonModal(true);
        webSecurityGuard.setActiveApp('tao-de-dia-li-thcs', 'Tạo Đề Địa Lí THCS (CV 7991)');
      }
      else if (hash === '#tao-de-tin' || hash === '#tao-de-tin-thcs' || hash === '#tao-de-tinhoc-thcs') {
        setThcs8MonSelectedSubject('TIN');
        setShowTaoDeTHCS8MonModal(true);
        webSecurityGuard.setActiveApp('tao-de-tin-thcs', 'Tạo Đề Tin Học THCS');
      }
      else if (hash === '#tao-de-gdcd' || hash === '#tao-de-gdcd-thcs' || hash === '#tao-de-giao-duc-cong-dan-thcs') {
        setThcs8MonSelectedSubject('GDCD');
        setShowTaoDeTHCS8MonModal(true);
        webSecurityGuard.setActiveApp('tao-de-gdcd-thcs', 'Tạo Đề GDCD THCS');
      }
      else if (hash === '#tao-de-cn' || hash === '#tao-de-cn-thcs' || hash === '#tao-de-congnghe-thcs' || hash === '#tao-de-cong-nghe-thcs' || hash === '#tao-de-cong-nghe') {
        setThcs8MonSelectedSubject('CN');
        setShowTaoDeTHCS8MonModal(true);
        webSecurityGuard.setActiveApp('tao-de-cn-thcs', 'Tạo Đề Công Nghệ THCS');
      }
      else if (hash === '#sinh-de-bien-the') {
        setShowSinhDeBienTheModal(true);
        webSecurityGuard.setActiveApp('sinhdebienthe', 'Sinh Đề Biến Thể AI Pro');
      }
      else if (hash === '#screen-record') {
        setShowScreenRecordModal(true);
        webSecurityGuard.setActiveApp('screen-record-v2', 'Quay Màn Hình (Screen Record)');
      }
      else if (hash === '#cleaner-pro' || hash === '#cleaner') {
        setShowCleanerModal(true);
        webSecurityGuard.setActiveApp('dinhthanh-cleaner-pro', 'Dọn Rác Máy Tính Cleaner Pro');
      }
      else if (hash === '#chuan-hoa-vb' || hash === '#chuanhoavanban') {
        setShowChuanHoaVBModal(true);
        webSecurityGuard.setActiveApp('chuanhoavanbanvip', 'Chuẩn Hóa Văn Bản (NĐ 30)');
      }
      else if (hash === '#tach-gop-pdf' || hash === '#pdf-suite') {
        setShowTachGopPDFModal(true);
        webSecurityGuard.setActiveApp('TACH-GOP-PDF', 'Tách - Gộp PDF Suite');
      }
      else if (hash === '#tao-de-thcs-8mon' || hash === '#tao-de-8mon' || hash === '#thcs-8mon') {
        setShowTaoDeTHCS8MonModal(true);
        webSecurityGuard.setActiveApp('tao-de-thcs-8mon', 'Tạo Đề THCS 8 Môn (CV 7991)');
      }
      else if (hash === '#smart-listening') {
        setShowListeningModal(true);
        webSecurityGuard.setActiveApp('smart-listening-pro', 'Tạo Bài Nghe MP3 (Smart Listening)');
      }
      else if (hash === '#nls-ai') {
        setShowNLSAIModal(true);
        webSecurityGuard.setActiveApp('tichhop-nls-ai-thcs', 'Tích Hợp NLS - AI (Add-ins V3)');
      }
      else if (hash === '#mathstudio' || hash === '#congthucmathtype' || hash === '#mathpix') {
        setShowMathStudioModal(true);
        webSecurityGuard.setActiveApp('mathstudio-pro', 'Đinh Thành MathStudio 2026+ Pro');
      }
      else if (hash === '#tao-de-15p-tienganh' || hash === '#15p-tienganh' || hash === '#de-15p') {
        setShowTaoDe15PhutModal(true);
        webSecurityGuard.setActiveApp('tao-de-15p-tienganh', 'Tạo Đề 15 Phút Tiếng Anh (Global Success)');
      }
      else if (hash === '#admin') {
        setShowAdminDashboard(true);
        webSecurityGuard.setActiveApp('admin', 'Bảng Điều Khiển Quản Trị Hệ Thống');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('popstate', handleHash);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('popstate', handleHash);
    };
  }, []);

  const [copyToast, setCopyToast] = useState<{ visible: boolean; url: string; title: string }>({
    visible: false,
    url: '',
    title: ''
  });

  const handleCopyShareLink = async (appUrl: string, appTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const shareUrl = getAppShareUrl(appUrl);
    const ok = await copyToClipboard(shareUrl);
    if (ok) {
      setCopyToast({ visible: true, url: shareUrl, title: appTitle });
      setTimeout(() => {
        setCopyToast((prev) => ({ ...prev, visible: false }));
      }, 3500);
    }
  };

  // Hàm điều hướng mở modal từ Chat Box Trợ Lý AI
  const handleOpenAppFromChat = (appId: string, subjectKey?: string) => {
    if (appId === 'tao-de-toan-thcs') {
      setThcs8MonSelectedSubject('TOAN');
      setShowTaoDeTHCS8MonModal(true);
    } else if (appId === 'tao-de-van-thcs') {
      setThcs8MonSelectedSubject('VAN');
      setShowTaoDeTHCS8MonModal(true);
    } else if (appId === 'tao-de-khtn-thcs') {
      setThcs8MonSelectedSubject('KHTN');
      setShowTaoDeTHCS8MonModal(true);
    } else if (appId === 'tao-de-sudia-thcs') {
      setThcs8MonSelectedSubject('SUDIA');
      setShowTaoDeTHCS8MonModal(true);
    } else if (appId === 'tao-de-thcs-8mon') {
      setThcs8MonSelectedSubject(subjectKey || 'TOAN');
      setShowTaoDeTHCS8MonModal(true);
    } else if (appId === 'tao-de-lichsu-thcs') {
      setShowTaoDeLichSuTHCSModal(true);
    } else if (appId === 'tao-de-tieng-anh') {
      setShowTaoDeModal(true);
    } else if (appId === 'tao-de-tieng-anh-thpt') {
      setShowTaoDeTHPTModal(true);
    } else if (appId === 'tao-de-toan-thpt') {
      setShowTaoDeToanTHPTModal(true);
    } else if (appId === 'tao-de-thpt-subject') {
      setThptSelectedSubject(subjectKey || 'TOAN');
      setShowTaoDeTHPTSubjectModal(true);
    } else if (appId === 'tich-hop-nls-ai') {
      setShowNLSAIModal(true);
    } else if (appId === 'text-to-speech') {
      setShowListeningModal(true);
    } else if (appId === 'math-studio') {
      setShowMathStudioModal(true);
    } else if (appId === 'cleaner') {
      setShowCleanerModal(true);
    } else if (appId === 'trial') {
      setShowTrialModal(true);
    } else {
      window.location.hash = '#' + appId;
    }
  };

  const handleAppClick = (app: AppCard, e: React.MouseEvent) => {
    webSecurityGuard.setActiveApp(app.id, app.title);
    if (app.id === 'hoc-tu-vung-tieng-anh-6-12' || app.url === '/hocsinh' || app.url === '#hoc-sinh') {
      e.preventDefault();
      setMainViewTab('students');
      window.history.pushState(null, '', '/hocsinh');
      return;
    }
    if (app.url && app.url.startsWith('#')) {
      syncBrowserHash(app.url);
    }
    if (app.id === 'smart-listening-pro') {
      e.preventDefault();
      setShowListeningModal(true);
      return;
    }
    if (app.id === 'tichhop-nls-ai-thcs' || app.id === 'soangiaoannanglucso') {
      e.preventDefault();
      setShowNLSAIModal(true);
      return;
    }
    if (app.id === 'tao-de-tieng-anh-tieu-hoc' || app.url === '#taode-tienganh-tieuhoc') {
      e.preventDefault();
      setShowTaoDeTieuHocModal(true);
      return;
    }
    if (app.id === 'tao-de-tieng-viet-tieu-hoc' || app.url === '#taode-tiengviet-tieuhoc') {
      e.preventDefault();
      setShowTaoDeTiengVietTieuHocModal(true);
      return;
    }
    if (app.id === 'tao-de-tieng-anh-thcs' || app.url === '#tao-de-tieng-anh') {
      e.preventDefault();
      setShowTaoDeModal(true);
      return;
    }
    if (app.id === 'tao-de-tieng-anh-thpt' || app.url === '#tao-de-tieng-anh-thpt') {
      e.preventDefault();
      setShowTaoDeTHPTModal(true);
      return;
    }
    if (app.id === 'tao-de-toan-thpt' || app.url === '#tao-de-toan-thpt') {
      e.preventDefault();
      setShowTaoDeToanTHPTModal(true);
      return;
    }
    if (app.id === 'tao-de-van-thpt' || app.url === '#tao-de-van-thpt') {
      e.preventDefault();
      setThptSelectedSubject('NGUVAN');
      setShowTaoDeTHPTSubjectModal(true);
      return;
    }
    if (app.id === 'tao-de-vatli-thpt' || app.url === '#tao-de-vatli-thpt') {
      e.preventDefault();
      setThptSelectedSubject('VATLI');
      setShowTaoDeTHPTSubjectModal(true);
      return;
    }
    if (app.id === 'tao-de-hoahoc-thpt' || app.url === '#tao-de-hoahoc-thpt') {
      e.preventDefault();
      setThptSelectedSubject('HOAHOC');
      setShowTaoDeTHPTSubjectModal(true);
      return;
    }
    if (app.id === 'tao-de-sinhhoc-thpt' || app.url === '#tao-de-sinhhoc-thpt') {
      e.preventDefault();
      setThptSelectedSubject('SINHHOC');
      setShowTaoDeTHPTSubjectModal(true);
      return;
    }
    if (app.id === 'tao-de-tin-thpt' || app.url === '#tao-de-tin-thpt') {
      e.preventDefault();
      setThptSelectedSubject('TINHOC');
      setShowTaoDeTHPTSubjectModal(true);
      return;
    }
    if (app.id === 'tao-de-lichsu-thpt' || app.url === '#tao-de-lichsu-thpt') {
      e.preventDefault();
      setThptSelectedSubject('LICHSU');
      setShowTaoDeTHPTSubjectModal(true);
      return;
    }
    if (app.id === 'tao-de-diali-thpt' || app.url === '#tao-de-diali-thpt') {
      e.preventDefault();
      setThptSelectedSubject('DIALI');
      setShowTaoDeTHPTSubjectModal(true);
      return;
    }
    if (app.id === 'tao-de-gdktpl-thpt' || app.url === '#tao-de-gdktpl-thpt') {
      e.preventDefault();
      setThptSelectedSubject('GDKTPL');
      setShowTaoDeTHPTSubjectModal(true);
      return;
    }
    if (app.id === 'tao-de-cn-thpt' || app.url === '#tao-de-cn-thpt') {
      e.preventDefault();
      setThptSelectedSubject('CONGNGHE');
      setShowTaoDeTHPTSubjectModal(true);
      return;
    }
    if (app.id === 'sinhdebienthe' || app.url === '#sinh-de-bien-the') {
      e.preventDefault();
      setShowSinhDeBienTheModal(true);
      return;
    }
    if (app.id === 'screen-record-v2' || app.url === '#screen-record') {
      e.preventDefault();
      setShowScreenRecordModal(true);
      return;
    }
    if (app.id === 'dinhthanh-cleaner-pro' || app.url === '#cleaner-pro' || app.url === '#cleaner') {
      e.preventDefault();
      setShowCleanerModal(true);
      return;
    }
    if (app.id === 'chuanhoavanbanvip' || app.url === '#chuan-hoa-vb') {
      e.preventDefault();
      setShowChuanHoaVBModal(true);
      return;
    }
    if (app.id === 'TACH-GOP-PDF' || app.url === '#tach-gop-pdf') {
      e.preventDefault();
      setShowTachGopPDFModal(true);
      return;
    }
    if (app.id === 'mathstudio-pro' || app.id === 'congthutoan' || app.url === '#mathstudio') {
      e.preventDefault();
      setShowMathStudioModal(true);
      return;
    }
    if (app.id === 'tao-de-15p-tienganh' || app.url === '#tao-de-15p-tienganh') {
      e.preventDefault();
      setShowTaoDe15PhutModal(true);
      return;
    }
    if (app.id === 'tao-de-toan-thcs' || app.url === '#tao-de-toan') {
      e.preventDefault();
      setThcs8MonSelectedSubject('TOAN');
      setShowTaoDeTHCS8MonModal(true);
      return;
    }
    if (app.id === 'tao-de-van-thcs' || app.url === '#tao-de-van') {
      e.preventDefault();
      setThcs8MonSelectedSubject('VAN');
      setShowTaoDeTHCS8MonModal(true);
      return;
    }
    if (app.id === 'tao-de-khtn-thcs' || app.url === '#tao-de-khtn') {
      e.preventDefault();
      setThcs8MonSelectedSubject('KHTN');
      setShowTaoDeTHCS8MonModal(true);
      return;
    }
    if (app.id === 'tao-de-sudia-thcs' || app.url === '#tao-de-sudia') {
      e.preventDefault();
      setThcs8MonSelectedSubject('SUDIA');
      setShowTaoDeTHCS8MonModal(true);
      return;
    }
    if (app.id === 'tao-de-lich-su-thcs' || app.id === 'tao-de-lichsu-thcs' || app.url === '#tao-de-lichsu-thcs' || app.url === '#tao-de-lichsu') {
      e.preventDefault();
      setShowTaoDeLichSuTHCSModal(true);
      return;
    }
    if (app.id === 'tao-de-dia-li-thcs' || app.id === 'tao-de-diali-thcs' || app.url === '#tao-de-dia-li-thcs' || app.url === '#tao-de-diali') {
      e.preventDefault();
      setThcs8MonSelectedSubject('DIALI');
      setShowTaoDeTHCS8MonModal(true);
      return;
    }
    if (app.id === 'tao-de-tin-thcs' || app.url === '#tao-de-tin') {
      e.preventDefault();
      setThcs8MonSelectedSubject('TIN');
      setShowTaoDeTHCS8MonModal(true);
      return;
    }
    if (app.id === 'tao-de-gdcd-thcs' || app.url === '#tao-de-gdcd') {
      e.preventDefault();
      setThcs8MonSelectedSubject('GDCD');
      setShowTaoDeTHCS8MonModal(true);
      return;
    }
    if (app.id === 'tao-de-cn-thcs' || app.url === '#tao-de-cn') {
      e.preventDefault();
      setThcs8MonSelectedSubject('CN');
      setShowTaoDeTHCS8MonModal(true);
      return;
    }
    if (app.id === 'trung-tam-tao-de-thcs-8mon' || app.url === '#tao-de-thcs-8mon') {
      e.preventDefault();
      setShowTaoDeTHCS8MonModal(true);
      return;
    }
    if (app.id === 'viet-skkn') {
      e.preventDefault();
      setShowSKKNModal(true);
      return;
    }
  };

  const handleAppImgError = (appId: string) => {
    setAppImgErrors((prev) => ({ ...prev, [appId]: true }));
  };

  // KHI WEB ĐANG KHÓA NÂNG CẤP VÀ NGƯỜI DÙNG KHÔNG PHẢI ADMIN:
  // Hiển thị toàn màn hình thông báo "Web đang nâng cấp, vui lòng ghé thăm sau!"
  if (isMaintenanceLocked && !isAdminSession) {
    return (
      <>
        <MaintenanceScreen 
          onAdminLoginSuccess={() => {
            setIsAdminSession(true);
          }} 
        />
        <AdminDashboard
          isOpen={showAdminDashboard}
          onClose={closeAllModals}
        />
      </>
    );
  }

  return (
    <div className={`min-h-screen ${t.pageBg} ${t.textBody} flex flex-col font-sans transition-colors duration-300 relative`}>
      {/* BANNER NỔI BẬT DÀNH CHO ADMIN KHI WEB ĐANG KHÓA NÂNG CẤP */}
      {isMaintenanceLocked && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white px-3 sm:px-6 py-2.5 text-xs sm:text-sm font-bold flex flex-wrap items-center justify-between gap-2 shadow-xl z-50 sticky top-0 border-b border-red-400/40">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
            <span>⚠️ CHẾ ĐỘ BẢO TRÌ NÂNG CẤP ĐANG BẬT: Giáo viên chỉ xem được thông báo "Web đang nâng cấp, vui lòng ghé thăm sau!". Admin đang xem nội bộ.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                if (window.confirm('Thầy có chắc chắn muốn MỞ KHÓA WEBSITE cho tất cả giáo viên toàn quốc ngay bây giờ?')) {
                  await systemMaintenanceService.setMaintenanceLock(false, 'Mở lại web bởi Thầy Thành từ banner');
                  setIsMaintenanceLocked(false);
                  alert('🎉 ĐÃ MỞ KHÓA WEBSITE THÀNH CÔNG!\n\nTất cả giáo viên trên toàn quốc hiện đã có thể truy cập và sử dụng bình thường.');
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <span>🔓 MỞ KHÓA WEB NGAY</span>
            </button>
            <button
              onClick={() => setShowAdminDashboard(true)}
              className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-white font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>Bảng Admin</span>
            </button>
          </div>
        </div>
      )}

      {/* TOP ANNOUNCEMENT & UTILITIES BAR - TÊN MIỀN DEKIEMTRASO.COM & TÙY BIẾN GIAO DIỆN */}
      <div className={`${t.topbarBg} ${t.topbarText} text-[11px] sm:text-xs py-2 px-3 sm:px-4 border-b ${t.topbarBorder} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
          {/* Cổng thông tin chính thức */}
          <div className="flex items-center gap-2 truncate">
            <a 
              href="https://dekiemtraso.com"
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 font-bold text-[10px] tracking-wide uppercase hover:bg-cyan-500/25 transition shrink-0"
              title="Cổng thông tin & Hệ sinh thái Phần mềm Giáo Viên AI Toàn Năng"
            >
              <Globe className="w-3 h-3 text-cyan-300 animate-pulse" />
              <span>dekiemtraso.com</span>
            </a>
            <span className="hidden md:inline font-medium text-slate-300 truncate">
              Cộng đồng chia sẻ App Ra Đề Kiểm Tra & Tiện Ích Giáo Dục Tham Khảo 2026
            </span>
            <span className="md:hidden text-slate-300 font-medium truncate">
              Đề Kiểm Tra Số 2026
            </span>
          </div>

          {/* Thanh công cụ giao diện & Hỗ trợ kỹ thuật */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 font-medium">
            {/* Bộ chuyển đổi Giao diện màu sắc trực tiếp */}
            <div className="hidden lg:flex items-center gap-1 bg-black/30 p-1 rounded-full border border-white/10 text-[10px]">
              <span className="px-2 text-slate-300 font-bold flex items-center gap-1">
                <Palette className="w-3 h-3 text-amber-300" />
                <span>Giao diện:</span>
              </span>
              {(Object.keys(THEMES) as ThemeMode[]).map((mode) => {
                const cfg = THEMES[mode];
                const isAct = themeMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => changeTheme(mode)}
                    className={`px-2.5 py-0.5 rounded-full transition flex items-center gap-1 cursor-pointer font-bold ${
                      isAct
                        ? 'bg-white text-slate-950 shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                    title={cfg.description}
                  >
                    <span>{cfg.icon}</span>
                    <span>{cfg.shortName}</span>
                  </button>
                );
              })}
            </div>

            {/* Bộ chuyển đổi Bố cục Thẻ lưới / Danh mục khoa học */}
            <div className="hidden sm:flex items-center gap-0.5 bg-black/30 p-0.5 rounded-xl border border-white/10 text-[11px]">
              <button
                onClick={() => changeViewMode('grid')}
                className={`px-2 py-0.5 rounded-lg transition flex items-center gap-1 cursor-pointer font-bold ${
                  appViewMode === 'grid'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Xem dạng thẻ lưới trực quan có ảnh minh họa"
              >
                <LayoutGrid className="w-3 h-3" />
                <span className="hidden xl:inline">Thẻ lưới</span>
              </button>
              <button
                onClick={() => changeViewMode('compact')}
                className={`px-2 py-0.5 rounded-lg transition flex items-center gap-1 cursor-pointer font-bold ${
                  appViewMode === 'compact'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Xem dạng danh mục khoa học gọn gàng, tiện theo dõi"
              >
                <ListFilter className="w-3 h-3" />
                <span className="hidden xl:inline">Danh mục</span>
              </button>
            </div>

            <span className="text-white/20 hidden sm:inline">|</span>

            {/* Hotline & Zalo Thầy Thành */}
            <a
              href={BRAND.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
              title="Nhắn tin Zalo trực tiếp hỗ trợ kỹ thuật"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Zalo Tác Giả:</span>
              <strong className="text-emerald-400 font-bold">{BRAND.phone}</strong>
            </a>

            <button
              onClick={() => {
                navigator.clipboard.writeText('https://dekiemtraso.com');
                setThemeToast('Đã sao chép link dekiemtraso.com để gửi cho đồng nghiệp!');
                setTimeout(() => setThemeToast(null), 2500);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition cursor-pointer text-[10px] font-semibold border border-white/15"
              title="Sao chép link trang web để gửi cho đồng nghiệp trong trường"
            >
              <Copy className="w-2.5 h-2.5 text-cyan-300" />
              <span className="hidden sm:inline">Sao chép</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR - SANG TRỌNG, ĐẲNG CẤP CHUẨN SAAS GIÁO DỤC */}
      <header className={`sticky top-0 z-50 ${t.navbarBg} border-b ${t.navBorder} shadow-xs transition-colors duration-300`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo & Nhận diện thương hiệu */}
            <a href="#apps" className="flex items-center gap-3 sm:gap-3.5 group">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#0B1E36] via-[#123A63] to-[#2563EB] flex items-center justify-center text-white shadow-md shadow-blue-900/20 group-hover:scale-105 group-hover:shadow-blue-600/30 transition-all duration-300 ring-2 ring-blue-500/20">
                  <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-white transition-transform group-hover:-rotate-6" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className={`text-base sm:text-xl font-black tracking-tight ${t.textHeading}`}>
                    GIÁO VIÊN AI <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">TOÀN NĂNG</span>
                  </h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
                    v3.0 PRO
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className={`text-[11px] sm:text-xs ${t.textMuted} font-medium`}>
                    {BRAND.slogan}
                  </p>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <span className="text-[11px] text-teal-700 dark:text-teal-400 font-bold hidden sm:inline">
                    {BRAND.author}
                  </span>
                </div>
              </div>
            </a>

            {/* Desktop Navigation 3 Trụ Cột Chính: Kho Giáo Viên | Quản Trị Admin | Dành Cho Học Sinh */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs xl:text-sm font-bold">
              {/* Nút 1: Kho Ứng Dụng Giáo Viên */}
              <button
                type="button"
                onClick={() => {
                  setMainViewTab('teachers');
                  window.history.pushState(null, '', '/');
                }}
                className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                  mainViewTab === 'teachers'
                    ? 'bg-blue-600 text-white shadow-md font-black'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>1. Kho Ứng Dụng Giáo Viên</span>
              </button>

              {/* Nút 2: Bảng Quản Trị Admin */}
              <button
                type="button"
                onClick={() => {
                  setMainViewTab('admin');
                  window.history.pushState(null, '', '/admin');
                }}
                className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                  mainViewTab === 'admin'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Crown className="w-4 h-4 text-amber-500" />
                <span>2. Quản Trị Admin</span>
              </button>

              {/* Nút 3: Dành Cho Học Sinh */}
              <button
                type="button"
                onClick={() => {
                  setMainViewTab('students');
                  window.history.pushState(null, '', '/hocsinh');
                }}
                className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                  mainViewTab === 'students'
                    ? 'bg-emerald-600 text-white shadow-md font-black'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-emerald-500" />
                <span>3. Dành Cho Học Sinh</span>
              </button>
            </div>

            {/* Action Buttons: Dùng thử 5 lần & Hotline Zalo */}
            <div className="hidden md:flex items-center gap-2 lg:gap-2.5 font-medium text-sm">


              <a
                href={BRAND.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 text-slate-800 dark:text-slate-200 hover:text-blue-700 border border-slate-200 dark:border-slate-700 transition-all text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                title={`Hotline / Zalo: ${BRAND.phone}`}
              >
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden xl:inline">Zalo: {BRAND.phone}</span>
                <span className="xl:hidden">{BRAND.phone}</span>
              </a>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Drawer Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-3 border-t border-slate-200/80 dark:border-slate-800 flex flex-col gap-2 font-medium text-sm animate-fadeIn">
              {/* Chọn giao diện trên di động */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-blue-600" />
                  <span>Chọn Giao Diện Website</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {(Object.keys(THEMES) as ThemeMode[]).map((mode) => {
                    const cfg = THEMES[mode];
                    const isAct = themeMode === mode;
                    return (
                      <button
                        key={mode}
                        onClick={() => changeTheme(mode)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                          isAct
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                        }`}
                      >
                        <span>{cfg.icon}</span>
                        <span>{cfg.shortName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chọn bố cục trên di động */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeViewMode('grid')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    appViewMode === 'grid'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Dạng Thẻ Lưới</span>
                </button>
                <button
                  onClick={() => changeViewMode('compact')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    appViewMode === 'compact'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>Danh Mục Gọn</span>
                </button>
              </div>

              <button 
                onClick={() => {
                  setMainViewTab('teachers');
                  window.history.pushState(null, '', '/');
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3.5 py-2.5 rounded-xl font-bold flex items-center gap-2.5 transition-colors text-left cursor-pointer ${
                  mainViewTab === 'teachers' ? 'bg-blue-600 text-white' : 'hover:bg-blue-50 text-slate-800 dark:text-slate-200'
                }`}
              >
                <Layers className="w-4 h-4 text-blue-500" />
                <span>1. Kho Ứng Dụng Giáo Viên</span>
              </button>

              <button 
                onClick={() => {
                  setMainViewTab('admin');
                  window.history.pushState(null, '', '/admin');
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3.5 py-2.5 rounded-xl font-bold flex items-center gap-2.5 transition-colors text-left cursor-pointer ${
                  mainViewTab === 'admin' ? 'bg-amber-500 text-slate-950 font-black' : 'hover:bg-amber-50 text-slate-800 dark:text-slate-200'
                }`}
              >
                <Crown className="w-4 h-4 text-amber-500" />
                <span>2. Bảng Quản Trị Admin</span>
              </button>

              <button 
                onClick={() => {
                  setMainViewTab('students');
                  window.history.pushState(null, '', '/hocsinh');
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3.5 py-2.5 rounded-xl font-bold flex items-center gap-2.5 transition-colors text-left cursor-pointer ${
                  mainViewTab === 'students' ? 'bg-emerald-600 text-white' : 'hover:bg-emerald-50 text-slate-800 dark:text-slate-200'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-emerald-500" />
                <span>3. Dành Cho Học Sinh</span>
              </button>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">

                <a
                  href={BRAND.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center px-4 py-2.5 rounded-xl bg-[#0D9488] hover:bg-teal-700 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Zalo: {BRAND.phone}
                </a>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className="flex-1">
        {/* 1. PHÂN HỆ KHO ỨNG DỤNG GIÁO VIÊN */}
        {mainViewTab === 'teachers' && (
          <>
            {/* HERO BANNER TINH TẾ (CHỈ 1-2 DÒNG) */}
            <section className={`pt-3 pb-2 sm:pt-4 sm:pb-2 transition-colors duration-300`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`rounded-3xl ${t.heroGradient} text-white p-4 sm:p-6 shadow-xl border ${t.heroBorder} flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300`}>
                  <div className="space-y-1 max-w-2xl">
                    <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      Kho Tiện Ích Giáo Dục &amp; Tạo Đề Kiểm Tra Tham Khảo
                    </h1>
                    <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal">
                      Chia sẻ các phần mềm tạo đề kiểm tra &amp; tiện ích giảng dạy tải về dùng miễn phí, nâng cấp Pro qua Zalo.
                    </p>
                    <p className="text-xs text-cyan-300 font-semibold">
                      Tác giả: Đinh Thành • Hotline / Zalo: 0915.213717 • Công cụ hỗ trợ, tham khảo dành cho giáo viên.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">

                    <a
                      href={BRAND.zaloUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold text-xs transition flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4 text-teal-300" />
                      <span>Zalo Tư Vấn Pro</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* BẢNG DANH MỤC ỨNG DỤNG ĐƠN GIẢN, GỌN GÀNG, KHÔNG TỐN DIỆN TÍCH */}
            <TeacherCatalog
              onOpenAppModal={(app) => {
                handleAppClick(app, { preventDefault: () => {} } as any);
              }}
              onCopyShareLink={handleCopyShareLink}
            />
          </>
        )}

        {/* 2. PHÂN HỆ QUẢN TRỊ ADMIN (THẦY THÀNH) */}
        {mainViewTab === 'admin' && (
          <AdminPortal onBackToHome={() => setMainViewTab('teachers')} />
        )}

        {/* 3. PHÂN HỆ DÀNH CHO HỌC SINH (TỪ VỰNG + THI ONLINE + TẢI ĐỀ) */}
        {mainViewTab === 'students' && (
          <StudentPortal />
        )}

      </main>

            {/* FOOTER & THONG TIN TAC GIA THEO QUY CHUAN SKILL CHIA SE & MIEN TRU TRACH NHIEM (#footer-info) */}
      <footer id="footer-info" className={`${t.footerBg} text-white border-t-2 ${t.footerBorder} py-8 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-5 border-b border-slate-800/80">
            {/* Thông tin dự án đơn giản 1-2 dòng */}
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-white">
                    Dự án Hỗ trợ Giáo viên - Đề Kiểm Tra Số
                  </h2>
                  <p className="text-xs text-cyan-400 font-semibold">
                    Chia sẻ các app hỗ trợ ra đề kiểm tra &amp; tiện ích giáo dục tham khảo • dekiemtraso.com
                  </p>
                </div>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 pl-11">
                * Dữ liệu do AI gợi ý chỉ mang tính chất tham khảo, giáo viên vui lòng rà soát trước khi sử dụng.
              </p>
            </div>

            {/* Thông tin tác giả & Liên hệ */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-left md:text-right pr-2">
                <div className="text-xs sm:text-sm font-bold text-white">Tác giả Đinh Thành</div>
                <div className="text-xs text-emerald-400 font-semibold">ĐT/Zalo: 0915.213717</div>
              </div>

              <a
                href={BRAND.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Zalo: 0915.213717</span>
              </a>

              <a
                href={BRAND.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-blue-600/70 hover:bg-blue-600 text-white font-bold text-xs border border-blue-500/40 transition-colors flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Facebook</span>
              </a>
            </div>
          </div>

          {/* Dòng bản quyền & Cổng Admin */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div>
              © 2026 Tác giả Đinh Thành (0915.213717). Dự án Hỗ trợ Giáo viên • <a href="https://dekiemtraso.com" className="text-cyan-400 hover:underline font-bold">dekiemtraso.com</a>
            </div>

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={() => {
                  setMainViewTab('admin');
                  window.location.hash = '#admin';
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-amber-400 hover:text-amber-300 font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Cổng Quản Trị Admin</span>
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* THÔNG BÁO TOAST KHI CHUYỂN GIAO DIỆN HOẶC BỐ CỤC */}
      {themeToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-slate-950/95 text-white text-xs font-bold shadow-2xl border border-slate-700/90 flex items-center gap-2 animate-bounce backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{themeToast}</span>
        </div>
      )}

      {/* SKKN MODAL IF NEEDED */}
      {showSKKNModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowSKKNModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2563EB] mx-auto flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#123A63]">Viết SKKN Tự Động</h3>
              <p className="text-slate-600 text-sm">
                Vui lòng liên hệ tác giả để được hướng dẫn sử dụng công cụ.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={BRAND.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#0D9488] hover:bg-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Liên hệ Zalo: {BRAND.phone}
              </a>
              <button
                onClick={() => setShowSKKNModal(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ONLINE TTS & SMART LISTENING PRO MODAL (3 TABS) */}
      {showListeningModal && (
        <OnlineTTSModal
          isOpen={showListeningModal}
          onClose={closeAllModals}
        />
      )}

      {/* TÍCH HỢP NLS - AI THCS (ADD-INS V3) MODAL (3 TABS) */}
      {showNLSAIModal && (
        <NLSAIModal
          isOpen={showNLSAIModal}
          onClose={closeAllModals}
          onOpenAdmin={() => setShowAdminDashboard(true)}
        />
      )}

      {/* TẠO ĐỀ TIẾNG ANH TIỂU HỌC (GLOBAL SUCCESS - THÔNG TƯ 27) MODAL (3 TABS) */}
      {showTaoDeTieuHocModal && (
        <TaoDeTiengAnhTieuHocModal
          isOpen={showTaoDeTieuHocModal}
          onClose={closeAllModals}
          onOpenAdmin={() => setShowAdminDashboard(true)}
        />
      )}

      {/* TẠO ĐỀ TIẾNG VIỆT TIỂU HỌC (TT 27) MODAL (3 TABS) */}
      {showTaoDeTiengVietTieuHocModal && (
        <TaoDeTiengVietTieuHocModal
          isOpen={showTaoDeTiengVietTieuHocModal}
          onClose={closeAllModals}
          onOpenAdmin={() => setShowAdminDashboard(true)}
        />
      )}

      {/* TẠO ĐỀ KIỂM TRA TIẾNG ANH GLOBAL SUCCESS (CV 7991) MODAL (3 TABS) */}
      {showTaoDeModal && (
        <TaoDeTiengAnhModal
          isOpen={showTaoDeModal}
          onClose={closeAllModals}
          onOpenAdmin={() => setShowAdminDashboard(true)}
        />
      )}

      {/* TẠO ĐỀ KIỂM TRA TIẾNG ANH THPT (LỚP 10 - 11 - 12) MODAL (3 TABS) */}
      {showTaoDeTHPTModal && (
        <TaoDeTiengAnhTHPTModal
          isOpen={showTaoDeTHPTModal}
          onClose={closeAllModals}
          onOpenAdmin={() => setShowAdminDashboard(true)}
        />
      )}

      {/* TẠO ĐỀ KIỂM TRA TOÁN THPT (LỚP 10 - 11 - 12) MODAL (3 TABS) */}
      {showTaoDeToanTHPTModal && (
        <TaoDeToanTHPTModal
          isOpen={showTaoDeToanTHPTModal}
          onClose={closeAllModals}
          onOpenAdmin={() => setShowAdminDashboard(true)}
        />
      )}

      {/* HỆ THỐNG TẠO ĐỀ CÁC MÔN THPT (11 MÔN - ĐỊNH DẠNG MỚI 2025+) (3 TABS) */}
      {showTaoDeTHPTSubjectModal && (
        <TaoDeTHPTSubjectModal
          isOpen={showTaoDeTHPTSubjectModal}
          onClose={closeAllModals}
          initialSubject={thptSelectedSubject}
          onOpenAdmin={() => setShowAdminDashboard(true)}
        />
      )}

      {/* SINH 3 ĐỀ BIẾN THỂ VIP (V1) MODAL (3 TABS) */}
      {showSinhDeBienTheModal && (
        <SinhDeBienTheModal
          isOpen={showSinhDeBienTheModal}
          onClose={closeAllModals}
          onOpenAdmin={() => setShowAdminDashboard(true)}
        />
      )}

      {/* SCREEN RECORD PRO V2 (3 TABS) */}
      {showScreenRecordModal && (
        <ScreenRecordModal
          isOpen={showScreenRecordModal}
          onClose={closeAllModals}
          onOpenAdmin={() => setShowAdminDashboard(true)}
        />
      )}

      {/* ĐINH THÀNH CLEANER PRO v4.5 VIP (3 TABS) */}
      {showCleanerModal && (
        <CleanerModal
          isOpen={showCleanerModal}
          onClose={closeAllModals}
          onOpenAdmin={() => setShowAdminDashboard(true)}
        />
      )}

      {/* CHUẨN HÓA VĂN BẢN HÀNH CHÍNH AI (NGHỊ ĐỊNH 30/2020) (3 TABS) */}
      {showChuanHoaVBModal && (
        <ChuanHoaVBModal
          isOpen={showChuanHoaVBModal}
          onClose={closeAllModals}
          onOpenAdmin={() => setShowAdminDashboard(true)}
        />
      )}

      {/* PDF SUITE PRO (TÁCH - GỘP - LỌC TRANG TRẮNG AI) (3 TABS) */}
      {showTachGopPDFModal && (
        <TachGopPDFModal
          isOpen={showTachGopPDFModal}
          onClose={closeAllModals}
          onOpenAdmin={() => setShowAdminDashboard(true)}
        />
      )}

      {/* HỆ THỐNG PHẦN MỀM TẠO ĐỀ KIỂM TRA THCS (7 MÔN & 7 APP ĐỘC LẬP) */}
      {showTaoDeTHCS8MonModal && (
        <TaoDeTHCS8MonModal
          isOpen={showTaoDeTHCS8MonModal}
          onClose={closeAllModals}
          initialSubject={thcs8MonSelectedSubject}
          selectedSubject={thcs8MonSelectedSubject}
          onOpenAdmin={() => setShowAdminDashboard(true)}
          onSwitchToEnglish={() => setShowTaoDeModal(true)}
        />
      )}

      {/* PHẦN MỀM TẠO ĐỀ LỊCH SỬ THCS (CV 7991) - MÔN CHUYÊN BIỆT */}
      {showTaoDeLichSuTHCSModal && (
        <TaoDeLichSuTHCSModal
          isOpen={showTaoDeLichSuTHCSModal}
          onClose={closeAllModals}
          onOpenAdmin={() => setShowAdminDashboard(true)}
        />
      )}

      {/* ĐINH THÀNH MATHSTUDIO 2026+ (WORD & MATHPIX) */}
      {showMathStudioModal && (
        <MathStudioModal
          isOpen={showMathStudioModal}
          onClose={closeAllModals}
          onOpenAdmin={() => setShowAdminDashboard(true)}
        />
      )}

      {/* TẠO ĐỀ 15 PHÚT TIẾNG ANH (GLOBAL SUCCESS) - CHỈ DÀNH CHO ADMIN */}
      {showTaoDe15PhutModal && (
        <TaoDe15PhutModal
          isOpen={showTaoDe15PhutModal}
          onClose={closeAllModals}
          onOpenAdmin={() => setShowAdminDashboard(true)}
          onSwitchToStandardExam={() => {
            closeAllModals();
            setShowTaoDeModal(true);
          }}
        />
      )}

      {/* CLOUD ADMIN DASHBOARD 24/7 */}
      {showAdminDashboard && (
        <AdminDashboard
          isOpen={showAdminDashboard}
          onClose={closeAllModals}
        />
      )}

      {/* MODAL ĐĂNG KÝ DÙNG THỬ 5 LẦN */}
      {showTrialModal && (
        <TrialRegisterModal
          isOpen={showTrialModal}
          onClose={() => setShowTrialModal(false)}
        />
      )}
      {/* FLOATING TOAST THÔNG BÁO SAO CHÉP LINK GỬI KHÁCH THÀNH CÔNG */}
      {copyToast.visible && (
        <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50 max-w-sm bg-slate-950/95 border-2 border-emerald-500 text-white p-4 rounded-2xl shadow-2xl shadow-emerald-950/60 flex items-start gap-3 backdrop-blur-md animate-bounce">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-black text-emerald-400 text-xs sm:text-sm uppercase tracking-wide">
              ĐÃ SAO CHÉP LINK GỬI KHÁCH!
            </div>
            <div className="text-white text-xs font-semibold truncate mt-0.5">
              {copyToast.title}
            </div>
            <code className="block bg-slate-900 border border-slate-800 text-cyan-300 font-mono text-[11px] px-2 py-1 rounded-lg mt-1 truncate select-all">
              {copyToast.url}
            </code>
            <div className="text-slate-400 text-[10px] mt-1">
              Thầy có thể dán (Ctrl+V) vào Zalo / Facebook để gửi giáo viên ngay.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
