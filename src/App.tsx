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
    name: 'Sư Phạm Chuẩn Mực',
    shortName: 'Sư Phạm',
    icon: '🎓',
    description: 'Tông Xanh Lam & Trắng dịu mắt, trang nhã, chuẩn mực sư phạm Việt Nam',
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
    return 'grid';
  });

  const [themeToast, setThemeToast] = useState<string | null>(null);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const changeTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
    localStorage.setItem('gvai_theme_mode', mode);
    setShowThemeMenu(false);
    const names: Record<ThemeMode, string> = {
      'pedagogical': '🎓 Sư Phạm Chuẩn Mực',
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

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Filter only active apps
  const activeApps = apps
    .filter((app) => app.active)
    .sort((a, b) => a.order - b.order);

  // Lọc ứng dụng theo Category Tab và từ khóa tìm kiếm
  const filteredApps = activeApps.filter((app) => {
    // Lọc theo Tab Danh mục
    if (selectedCategory !== 'ALL') {
      if (selectedCategory === 'THCS') {
        if (!app.category.includes('THCS')) return false;
      } else if (selectedCategory === 'THPT') {
        if (!app.category.includes('THPT')) return false;
      } else if (selectedCategory === 'PRIMARY') {
        if (!app.category.includes('TIỂU HỌC') && app.levelBadge !== 'TIỂU HỌC') return false;
      } else if (selectedCategory === 'NLS') {
        const isNls = app.category.includes('5512') || app.id.includes('nls') || app.id.includes('soangiaoan');
        if (!isNls) return false;
      } else if (selectedCategory === 'UTILITY') {
        const isUtility = app.category.includes('TIỆN ÍCH') || app.id.includes('cleaner') || app.id.includes('record') || app.id.includes('pdf') || app.id.includes('chuan-hoa') || app.id.includes('math') || app.id.includes('listening') || app.id.includes('troly');
        if (!isUtility) return false;
      }
    }

    // Lọc theo từ khóa tìm kiếm
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      app.title.toLowerCase().includes(query) ||
      app.description.toLowerCase().includes(query) ||
      app.category.toLowerCase().includes(query)
    );
  });

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

  const handleAppClick = (app: AppCard, e: React.MouseEvent) => {
    webSecurityGuard.setActiveApp(app.id, app.title);
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

            {/* Desktop Navigation & Actions */}
            <div className="hidden lg:flex items-center gap-2 text-xs xl:text-sm font-bold">
              {/* Nút Kho Ứng Dụng */}
              <a
                href="#apps"
                className={`px-3 py-2 rounded-xl text-blue-600 bg-blue-50/80 dark:bg-blue-950/40 hover:bg-blue-100 transition-colors flex items-center gap-1.5`}
              >
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Kho Ứng Dụng ({activeApps.length})</span>
              </a>

              {/* Nút Đổi Giao Diện Dropdown / Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                  className={`px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer text-xs ${t.textHeading}`}
                  title="Thay đổi giao diện màu sắc của website"
                >
                  <Palette className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t.icon} {t.shortName}</span>
                </button>

                {showThemeMenu && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-fadeIn space-y-1">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                      Chọn Giao Diện Website
                    </div>
                    {(Object.keys(THEMES) as ThemeMode[]).map((mode) => {
                      const cfg = THEMES[mode];
                      const isAct = themeMode === mode;
                      return (
                        <button
                          key={mode}
                          onClick={() => changeTheme(mode)}
                          className={`w-full text-left px-3 py-2 rounded-xl transition flex items-center justify-between text-xs font-semibold cursor-pointer ${
                            isAct
                              ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{cfg.icon}</span>
                            <div>
                              <div>{cfg.name}</div>
                              <div className="text-[10px] text-slate-400 font-normal line-clamp-1">{cfg.description}</div>
                            </div>
                          </div>
                          {isAct && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Nút Đổi Bố Cục Thẻ / Bảng */}
              <button
                type="button"
                onClick={() => changeViewMode(appViewMode === 'grid' ? 'compact' : 'grid')}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
                title="Chuyển đổi giữa Dạng Thẻ Lưới và Dạng Danh Mục Khoa Học"
              >
                {appViewMode === 'grid' ? (
                  <>
                    <ListFilter className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Dạng Danh Mục</span>
                  </>
                ) : (
                  <>
                    <LayoutGrid className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Dạng Thẻ Lưới</span>
                  </>
                )}
              </button>
            </div>

            {/* Action Buttons: Dùng thử 5 lần, Admin & Hotline */}
            <div className="hidden md:flex items-center gap-2 lg:gap-2.5 font-medium text-sm">
              <button
                onClick={() => setShowTrialModal(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all text-xs font-black flex items-center gap-1.5 active:scale-95 cursor-pointer"
                title="Đăng ký dùng thử 5 lần miễn phí"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>DÙNG THỬ 5 LẦN</span>
              </button>

              <button
                onClick={() => setShowAdminDashboard(true)}
                className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700 transition-all text-xs font-bold flex items-center gap-1.5 shadow-2xs group cursor-pointer"
                title="Bảng Quản Trị Bản Quyền Cloud 24/7"
              >
                <Crown className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
                <span>Quản Trị</span>
              </button>

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

              <a 
                href="#apps" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3.5 py-2 rounded-xl hover:bg-blue-50 text-blue-700 font-bold flex items-center gap-2.5 transition-colors"
              >
                <Layers className="w-4 h-4 text-blue-600" />
                Kho Ứng Dụng ({activeApps.length})
              </a>

              <a 
                href="#footer-info" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3.5 py-2 rounded-xl hover:bg-blue-50 text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-2.5 transition-colors"
              >
                <UserCheck className="w-4 h-4 text-indigo-600" />
                Thông Tin Tác Giả & Hỗ Trợ
              </a>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setShowTrialModal(true);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-left flex items-center gap-2.5 shadow-2xs"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Đăng Ký Dùng Thử 5 Lần Miễn Phí
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setShowAdminDashboard(true);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-bold text-left flex items-center gap-2.5 shadow-2xs"
                >
                  <Crown className="w-4 h-4 text-amber-600" />
                  Quản Trị Admin Cloud
                </button>
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
        {/* HERO SECTION KHOA HỌC, GIÁO DỤC, UY TÍN SƯ PHẠM */}
        <section className={`pt-3 pb-3 sm:pt-6 sm:pb-4 transition-colors duration-300`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`rounded-3xl ${t.heroGradient} text-white p-5 sm:p-7 shadow-xl border ${t.heroBorder} flex flex-col gap-5 transition-all duration-300`}>
              
              {/* Header Hero */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-200 text-xs font-bold uppercase tracking-wider border border-white/20 backdrop-blur-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    <span>🎁 CHIA SẺ TIỆN ÍCH GIÁO DỤC • TRẢI NGHIỆM DÙNG THỬ MIỄN PHÍ</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug">
                    Kho Ứng Dụng Ra Đề Kiểm Tra & Tiện Ích Giáo Dục Tham Khảo
                  </h1>
                  <p className="text-xs sm:text-sm text-blue-50/90 leading-relaxed font-normal">
                    Chia sẻ các app ra đề kiểm tra, tiện ích giáo dục hỗ trợ giáo viên (Tiểu học, THCS, THPT). Tác giả: <strong>Đinh Thành, ĐT/Zalo: 0915.213717</strong>. Kính mời quý Thầy/Cô tải về trải nghiệm dùng thử miễn phí; Thầy/Cô có nhu cầu hỗ trợ chuyên sâu và kích hoạt bản Pro không giới hạn vui lòng liên hệ trực tiếp Zalo: <strong>0915.213717</strong>.
                    <span className="block mt-1 text-[11px] sm:text-xs text-amber-300 font-bold">
                      📌 SẢN PHẨM ĐƯỢC TẠO RA GIÚP GV CÓ TÀI LIỆU THAM KHẢO TRONG CÔNG TÁC RA ĐỀ KIỂM TRA & GIẢNG DẠY
                    </span>
                  </p>
                </div>

                {/* Hero Action CTA Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => setShowTrialModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>DÙNG THỬ 5 LẦN</span>
                  </button>
                  <a
                    href={BRAND.zaloUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4 text-teal-300" />
                    <span>Zalo Tác Giả (0915.213717)</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      const modes: ThemeMode[] = ['pedagogical', 'dark-cyber', 'emerald-sage', 'royal-purple'];
                      const next = modes[(modes.indexOf(themeMode) + 1) % modes.length];
                      changeTheme(next);
                    }}
                    className="px-3 py-2.5 rounded-xl bg-black/30 hover:bg-black/50 text-white border border-white/20 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Bấm để chuyển sang giao diện tiếp theo"
                  >
                    <Palette className="w-3.5 h-3.5 text-amber-300" />
                    <span>Đổi Giao Diện ({t.shortName})</span>
                  </button>
                </div>
              </div>

              {/* 4 Trụ Cột Khoa Học Sư Phạm (Scientific Pedagogical Badges) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 pt-3 border-t border-white/15 text-xs">
                <div className="bg-white/10 rounded-2xl p-2.5 sm:p-3 border border-white/15 flex items-start gap-2.5">
                  <BookOpen className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-extrabold text-white text-[11px] sm:text-xs">Chuẩn Quy Định BGD&ĐT</div>
                    <div className="text-[10px] sm:text-[11px] text-blue-100/80">CV 7991 • QĐ 764 • CV 5512 • TT 27</div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-2xl p-2.5 sm:p-3 border border-white/15 flex items-start gap-2.5">
                  <Zap className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-extrabold text-white text-[11px] sm:text-xs">18+ Môn Học Toàn Diện</div>
                    <div className="text-[10px] sm:text-[11px] text-blue-100/80">Toán, Văn, Anh, KHTN, Sử, Địa, Tin...</div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-2xl p-2.5 sm:p-3 border border-white/15 flex items-start gap-2.5">
                  <Award className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-extrabold text-white text-[11px] sm:text-xs">Dùng Thử Miễn Phí</div>
                    <div className="text-[10px] sm:text-[11px] text-blue-100/80">Trải nghiệm dùng thử, liên hệ Zalo hỗ trợ Pro</div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-2xl p-2.5 sm:p-3 border border-white/15 flex items-start gap-2.5">
                  <Globe className="w-4 h-4 text-purple-300 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-extrabold text-white text-[11px] sm:text-xs">Trực Tuyến & Cài Máy</div>
                    <div className="text-[10px] sm:text-[11px] text-blue-100/80">Dùng trên Web & Add-in Office Word</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* APPS SECTION (PRIMARY SHOWCASE) - GIAO DIỆN & BỘ LỌC KHOA HỌC */}
        <section id="apps" className="pt-3 pb-12 sm:pt-4 sm:pb-16 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* THANH TÌM KIẾM, ĐIỀU KHIỂN GIAO DIỆN VÀ BỘ LỌC TABS KHOA HỌC */}
            <div className={`${t.filterBoxBg} rounded-3xl border ${t.filterBoxBorder} shadow-sm p-4 sm:p-5 mb-6 transition-all space-y-4`}>
              
              {/* Hàng 1: Tiêu đề + Chuyển đổi Bố cục + Ô tìm kiếm */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                {/* Tiêu đề & Trạng thái giao diện */}
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950 shrink-0"></div>
                  <div>
                    <h2 className={`text-base sm:text-lg font-black ${t.textHeading} tracking-tight flex flex-wrap items-center gap-2`}>
                      <span>Kho Ứng Dụng Chuyên Môn THCS & THPT 2026</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${t.badgeBg}`}>
                        Chuẩn Bộ GD&ĐT
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {t.icon} {t.name}
                      </span>
                    </h2>
                    <p className={`text-xs ${t.textMuted} mt-0.5`}>
                      Chọn lọc công cụ chuyên biệt theo nhu cầu soạn bài và kiểm tra đánh giá của Thầy/Cô
                    </p>
                  </div>
                </div>

                {/* Bộ nút chuyển đổi View Mode + Ô tìm kiếm */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  {/* Nút Bố cục Thẻ Lưới vs Danh Mục Khoa Học */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => changeViewMode('grid')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        appViewMode === 'grid'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Xem dạng thẻ lưới trực quan có hình ảnh"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>Thẻ Lưới</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => changeViewMode('compact')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        appViewMode === 'compact'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Xem dạng danh mục khoa học gọn gàng"
                    >
                      <ListFilter className="w-3.5 h-3.5" />
                      <span>Danh Mục Khoa Học</span>
                    </button>
                  </div>

                  {/* Ô tìm kiếm nhanh */}
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Tìm môn học, tên ứng dụng..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 transition"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
                        title="Xóa tìm kiếm"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Bộ đếm kết quả */}
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-black bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{filteredApps.length}/{activeApps.length}</span>
                  </span>
                </div>
              </div>

              {/* Hàng 2: Bộ lọc danh mục cấp học (Category Tabs) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none font-sans">
                {[
                  { id: 'ALL', label: 'Tất Cả Ứng Dụng', count: activeApps.length },
                  { id: 'PRIMARY', label: '🎒 Đề Thi Tiểu Học (TT 27)', count: activeApps.filter(a => a.category.includes('TIỂU HỌC') || a.levelBadge === 'TIỂU HỌC').length },
                  { id: 'THCS', label: '🏫 Đề Thi Cấp THCS (CV 7991)', count: activeApps.filter(a => a.category.includes('THCS')).length },
                  { id: 'THPT', label: '🎓 Đề Thi Cấp THPT (2025+)', count: activeApps.filter(a => a.category.includes('THPT')).length },
                  { id: 'NLS', label: '📝 Giáo Án & NLS (5512)', count: activeApps.filter(a => a.category.includes('5512') || a.id.includes('nls')).length },
                  { id: 'UTILITY', label: '🛠️ Tiện Ích Sư Phạm', count: activeApps.filter(a => a.category.includes('TIỆN ÍCH') || a.id.includes('cleaner') || a.id.includes('record') || a.id.includes('pdf') || a.id.includes('chuan-hoa') || a.id.includes('math') || a.id.includes('listening') || a.id.includes('troly')).length },
                ].map((tab) => {
                  const isActive = selectedCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedCategory(tab.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? `${t.activeTabBg} ${t.activeTabText} ${t.activeTabShadow}`
                          : `${t.inactiveTabBg} ${t.inactiveTabText}`
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Hàng 3: Gợi ý tìm nhanh theo môn học (Quick Subject Chips) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none text-[11px]">
                <span className="text-slate-400 font-semibold shrink-0">Lọc nhanh:</span>
                {QUICK_SUBJECT_CHIPS.map((chip, idx) => {
                  const isCurrent = searchQuery.toLowerCase() === chip.query.toLowerCase();
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSearchQuery(chip.query)}
                      className={`px-2.5 py-1 rounded-lg transition shrink-0 cursor-pointer font-medium ${
                        isCurrent
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BANNER QUẢNG CÁO CHÉO CÁC APP TÍNH TIỀN PRO */}
            <div className="mb-6">
              <CrossPromoBanner
                onNavigateApp={(hash) => {
                  window.location.hash = hash;
                }}
              />
            </div>

            {/* EMPTY STATE KHI KHÔNG TÌM THẤY KẾT QUẢ */}
            {filteredApps.length === 0 ? (
              <div className={`max-w-md mx-auto py-12 px-6 ${t.cardBg} rounded-3xl border ${t.cardBorder} shadow-sm text-center`}>
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className={`text-base font-bold ${t.textHeading} mb-1`}>
                  Không tìm thấy ứng dụng phù hợp
                </h3>
                <p className={`text-xs ${t.textMuted} mb-4`}>
                  Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc để xem toàn bộ {activeApps.length} ứng dụng.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('ALL');
                  }}
                  className={`px-4 py-2 rounded-xl ${t.primaryBtn} text-xs font-bold transition-colors shadow-sm cursor-pointer`}
                >
                  Xem toàn bộ {activeApps.length} ứng dụng
                </button>
              </div>
            ) : appViewMode === 'compact' ? (
              /* ==================== BỐ CỤC 1: DẠNG DANH MỤC KHOA HỌC GỌN GÀNG ==================== */
              <div className="space-y-3">
                <div className="hidden md:flex items-center justify-between px-4 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="w-7 text-center">STT</span>
                    <span className="w-14 text-center">Ảnh</span>
                    <span>Tên Ứng Dụng & Phân Loại Môn Học</span>
                  </div>
                  <div>Thao Tác & Trải Nghiệm</div>
                </div>

                {filteredApps.map((app, index) => (
                  <div
                    key={app.id}
                    className={`p-3.5 sm:p-4 rounded-2xl ${t.cardBg} border ${t.cardBorder} ${t.cardHoverBorder} ${t.cardHoverShadow} transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-3.5 group`}
                  >
                    {/* Phần Trái: STT + Thumbnail + Tên Ứng Dụng + Badges */}
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                      <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-xs flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                        {!appImgErrors[app.id] ? (
                          <img 
                            src={app.image} 
                            alt={app.title} 
                            onError={() => handleAppImgError(app.id)} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100 dark:bg-slate-800">
                            <Layers className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                            app.levelBadge === 'TIỂU HỌC' ? 'bg-amber-600 text-white' :
                            app.levelBadge === 'THCS' ? 'bg-blue-700 text-white' :
                            app.levelBadge === 'THPT' ? 'bg-purple-700 text-white' :
                            app.levelBadge === 'CV 5512' ? 'bg-emerald-700 text-white' :
                            'bg-slate-700 text-white'
                          }`}>
                            {app.levelBadge || 'TIỆN ÍCH'}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${t.badgeBg}`}>
                            {app.category}
                          </span>
                          {app.featured && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-gradient-to-r from-amber-500 to-yellow-500 text-white flex items-center gap-1">
                              <Crown className="w-2.5 h-2.5" />
                              HOT
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            app.badge === 'MIỄN PHÍ' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                            app.badge === 'NỘI BỘ ADMIN' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' :
                            'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            {app.badge}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-cyan-100 text-cyan-900 dark:bg-cyan-950/80 dark:text-cyan-300 border border-cyan-300/50 dark:border-cyan-700/50 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {app.version || 'v3.8.2'} • {app.updatedAt || '09/10/2026 22:58'}
                          </span>
                        </div>
                        <h3 className={`text-sm sm:text-base font-bold ${t.textHeading} group-hover:text-blue-600 transition-colors truncate`}>
                          {app.title}
                        </h3>
                        <p className={`text-xs ${t.textMuted} line-clamp-1 mt-0.5`}>
                          {app.description}
                        </p>
                      </div>
                    </div>

                    {/* Phần Phải: Nút Copy Link gửi khách & Mở công cụ */}
                    <div className="flex items-center gap-2 shrink-0 justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={(e) => handleCopyShareLink(app.url, app.title, e)}
                        className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95"
                        title={`Sao chép link gửi khách: ${getAppShareUrl(app.url)}`}
                      >
                        <Copy className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Copy Link</span>
                      </button>
                      {app.url && app.url.startsWith('http') ? (
                        <a
                          href={app.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-4 py-2 rounded-xl ${t.primaryBtn} text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm hover:shadow`}
                        >
                          <span>Mở công cụ</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleAppClick(app, e)}
                          className={`px-4 py-2 rounded-xl ${t.primaryBtn} text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm hover:shadow cursor-pointer`}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Trải nghiệm ngay</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* ==================== BỐ CỤC 2: DẠNG THẺ LƯỚI TRỰC QUAN (GRID VIEW) ==================== */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {filteredApps.map((app) => (
                  <div
                    key={app.id}
                    className={`group ${t.cardBg} rounded-2xl border ${t.cardBorder} overflow-hidden shadow-xs ${t.cardHoverBorder} ${t.cardHoverShadow} transition-all duration-300 flex flex-col hover:-translate-y-1 ${
                      app.featured ? 'ring-2 ring-amber-400/80 shadow-amber-500/10' : ''
                    }`}
                  >
                    <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      {!appImgErrors[app.id] ? (
                        <img
                          src={app.image}
                          alt={app.title}
                          onError={() => handleAppImgError(app.id)}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-400">
                          <Layers className="w-12 h-12 mb-2" />
                          <span className="text-xs font-semibold">GV AI TOÀN NĂNG</span>
                        </div>
                      )}
                      
                      {/* Badge Cấp học rõ nét ở góc trên bên trái */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                        {app.levelBadge === 'TIỂU HỌC' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-600 text-white shadow-md border border-amber-400/50 tracking-wide flex items-center gap-1">
                            🎒 TIỂU HỌC
                          </span>
                        )}
                        {app.levelBadge === 'THCS' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-700 text-white shadow-md border border-blue-400/50 tracking-wide flex items-center gap-1">
                            🏫 CẤP THCS
                          </span>
                        )}
                        {app.levelBadge === 'THPT' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-700 text-white shadow-md border border-purple-400/50 tracking-wide flex items-center gap-1">
                            🎓 CẤP THPT
                          </span>
                        )}
                        {app.levelBadge === 'CV 5512' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-700 text-white shadow-md border border-emerald-400/50 tracking-wide flex items-center gap-1">
                            📝 CV 5512
                          </span>
                        )}
                        {app.levelBadge === 'TIỆN ÍCH' && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-700 text-white shadow-md border border-slate-500/50 tracking-wide flex items-center gap-1">
                            🛠️ TIỆN ÍCH
                          </span>
                        )}
                      </div>

                      {/* Badge HOT và Bản Quyền PRO ở góc trên bên phải */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        {app.featured && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-xs flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            HOT
                          </span>
                        )}
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-xs shadow-xs ${
                          app.badge === 'MIỄN PHÍ'
                            ? 'bg-emerald-600 text-white border border-emerald-400/40'
                            : 'bg-gradient-to-r from-amber-600 to-rose-600 text-white border border-amber-400/30'
                        }`}>
                          {app.badge}
                        </span>
                      </div>
                      
                      <div className="absolute bottom-3 left-3">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 shadow-xs backdrop-blur-xs">
                          {app.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-2 font-mono">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {app.version || 'v3.8.2'}
                          </span>
                          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                            🕒 {app.updatedAt || '09/10/2026 22:58'}
                          </span>
                        </div>
                        <h3 className={`text-lg font-bold ${t.textHeading} group-hover:text-blue-600 transition-colors line-clamp-1`}>
                          {app.title}
                        </h3>
                        <p className={`text-sm ${t.textMuted} leading-relaxed mt-2 line-clamp-3`}>
                          {app.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {app.url && app.url.startsWith('http') ? (
                          <a
                            href={app.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex-1 py-2.5 px-4 rounded-xl ${t.primaryBtn} text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg group-hover:scale-[1.01]`}
                          >
                            <span>Mở công cụ ngay</span>
                            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => handleAppClick(app, e)}
                            className={`flex-1 py-2.5 px-4 rounded-xl ${t.primaryBtn} text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg group-hover:scale-[1.01] cursor-pointer`}
                          >
                            <span>Mở công cụ ngay</span>
                            <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12 text-amber-300" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => handleCopyShareLink(app.url, app.title, e)}
                          className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-xs active:scale-95"
                          title={`Sao chép link gửi khách: ${getAppShareUrl(app.url)}`}
                        >
                          <Copy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="hidden sm:inline">Copy Link</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </main>

            {/* FOOTER & THONG TIN TAC GIA THEO QUY CHUAN SKILL CHIA SE & MIEN TRU TRACH NHIEM (#footer-info) */}
      <footer id="footer-info" className={`${t.footerBg} text-white border-t-2 ${t.footerBorder} py-10 sm:py-12 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-800">
            
            {/* Cot 1: Thong tin thuong hieu */}
            <div className="md:col-span-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    Dự án Hỗ trợ Giáo viên - Đề Kiểm Tra Số
                  </h2>
                  <p className="text-xs text-cyan-400 font-semibold">
                    Cộng đồng chia sẻ tiện ích giáo dục tham khảo • dekiemtraso.com
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Dự án xây dựng với mục đích phi lợi nhuận nhằm hỗ trợ đồng nghiệp giáo viên tối ưu hóa thời gian soạn bài, tạo khung đề kiểm tra tham khảo định kỳ các cấp (Tiểu học, THCS, THPT) và chuẩn hóa học liệu sư phạm.
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 text-emerald-400 border border-slate-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mở khóa theo từng môn học
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 text-cyan-300 border border-slate-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Tiện ích trải nghiệm miễn phí
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 text-amber-300 border border-slate-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Đồng hành cùng tác giả
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 text-purple-300 border border-slate-700 font-medium">
                  <Globe className="w-3.5 h-3.5" />
                  Tên miền dekiemtraso.com
                </span>
              </div>
            </div>

            {/* Cot 2: Thong tin tac gia */}
            <div className="md:col-span-6 space-y-3 md:pl-6">
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Tác Giả & Hỗ Trợ Đồng Nghiệp
              </div>

              <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-6 h-6 text-cyan-300" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">Tác giả Đinh Thành</div>
                    <div className="text-xs text-emerald-400 font-semibold">Điện thoại / Zalo hỗ trợ: 0915.213717</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
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
                    href={`tel:${BRAND.phoneRaw}`}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-teal-300" />
                    <span>0915.213717</span>
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
            </div>

          </div>

          {/* BO DIEU KHOAN MIEN TRU TRACH NHIEM CHUAN SKILL MUC 3.1 */}
          <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
              <div className="text-sm font-extrabold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Dự án Hỗ trợ Giáo viên - Đề Kiểm Tra Số</span>
                <span className="text-cyan-400 font-semibold">(dekiemtraso.com)</span>
              </div>
              <div className="text-xs text-slate-300">
                <strong>Tác giả:</strong> Đinh Thành | <strong>Điện thoại/Zalo:</strong> 0915.213717
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="font-bold text-amber-300 flex items-center gap-1.5 text-xs sm:text-sm">
                <span>⚠️</span> Lưu ý quan trọng &amp; Miễn trừ trách nhiệm:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                <li>Website và các ứng dụng được xây dựng với mục đích phi lợi nhuận nhằm hỗ trợ đồng nghiệp giáo viên tối ưu hóa thời gian soạn bài.</li>
                <li>Toàn bộ dữ liệu, ma trận, câu hỏi và đáp án do Trí tuệ Nhân tạo (AI) gợi ý chỉ mang tính chất <strong>tham khảo</strong>. Do giới hạn của công nghệ AI, nội dung có thể phát sinh sai sót học thuật hoặc chưa bám sát 100% chương trình riêng của từng địa phương.</li>
                <li>Quý thầy/cô có trách nhiệm <strong>rà soát, thẩm định và hiệu chỉnh kỹ lưỡng</strong> nội dung trước khi áp dụng vào công tác giảng dạy, kiểm tra đánh giá học sinh thực tế.</li>
                <li>Tác giả không chịu trách nhiệm đối với bất kỳ khiếu nại, điểm số hay hệ quả nào phát sinh do việc sử dụng nguyên văn nội dung AI tạo ra mà chưa qua khâu biên tập của giáo viên bộ môn.</li>
              </ul>
            </div>
          </div>

          {/* Dong ban quyen & Cong Admin */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div>
              © 2026 Tác giả Đinh Thành (ĐT: 0915.213717). Dự án Hỗ trợ Giáo viên • <a href="https://dekiemtraso.com" className="text-cyan-400 hover:underline font-bold">dekiemtraso.com</a>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowTrialModal(true)}
                className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer"
              >
                Trải nghiệm dùng thử
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setShowAdminDashboard(true)}
                className="text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5" />
                Cổng Quản Trị Hệ Thống
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

      {/* FLOATING QUICK CONTACT (ZALO THẦY THÀNH) */}
      <a
        href={BRAND.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 p-3 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-[#0D9488] to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs sm:text-sm shadow-2xl shadow-teal-900/40 flex items-center gap-2 hover:scale-105 transition-all border border-teal-400/30 group"
        title="Chat Zalo Tác giả Đinh Thành (0915.213717)"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-300"></span>
        </span>
        <MessageCircle className="w-5 h-5 text-white" />
        <span className="hidden sm:inline font-semibold">Zalo: {BRAND.phone}</span>
      </a>
    </div>
  );
}
