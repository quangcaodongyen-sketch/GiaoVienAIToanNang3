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
  ArrowRight,
  Crown,
  Search,
  ShieldAlert,
  CheckCircle2,
  Zap,
  ShieldCheck,
  FileCheck,
  BookOpen,
  Check
} from 'lucide-react';
import { BRAND } from './config/brand';
import { apps, AppCard } from './data/apps';
import { AdminDashboard } from './components/AdminDashboard';
import { TrialRegisterModal } from './components/TrialRegisterModal';
import { activityTrackingService, ADMIN_WHITELIST_MACHINES } from './services/activityTrackingService';
import { OnlineTTSModal } from './components/OnlineTTSModal';
import { NLSAIModal } from './components/NLSAIModal';
import { TaoDeTiengAnhModal } from './components/TaoDeTiengAnhModal';
import { SinhDeBienTheModal } from './components/SinhDeBienTheModal';
import { ScreenRecordModal } from './components/ScreenRecordModal';
import { CleanerModal } from './components/CleanerModal';
import { ChuanHoaVBModal } from './components/ChuanHoaVBModal';
import { TachGopPDFModal } from './components/TachGopPDFModal';
import { TaoDeTHCS8MonModal } from './components/TaoDeTHCS8MonModal';
import { MathStudioModal } from './components/MathStudioModal';
import { TaoDe15PhutModal } from './components/TaoDe15PhutModal';
import { CrossPromoBanner } from './components/CrossPromoBanner';
import { webSecurityGuard } from './services/webSecurityGuard';

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSKKNModal, setShowSKKNModal] = useState(false);
  const [showListeningModal, setShowListeningModal] = useState(false);
  const [showNLSAIModal, setShowNLSAIModal] = useState(false);
  const [showTaoDeModal, setShowTaoDeModal] = useState(false);
  const [showSinhDeBienTheModal, setShowSinhDeBienTheModal] = useState(false);
  const [showScreenRecordModal, setShowScreenRecordModal] = useState(false);
  const [showCleanerModal, setShowCleanerModal] = useState(false);
  const [showChuanHoaVBModal, setShowChuanHoaVBModal] = useState(false);
  const [showTachGopPDFModal, setShowTachGopPDFModal] = useState(false);
  const [showTaoDeTHCS8MonModal, setShowTaoDeTHCS8MonModal] = useState(false);
  const [showMathStudioModal, setShowMathStudioModal] = useState(false);
  const [showTaoDe15PhutModal, setShowTaoDe15PhutModal] = useState(false);
  const [thcs8MonSelectedSubject, setThcs8MonSelectedSubject] = useState<string>('TOAN');
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [isCurrentBlocked, setIsCurrentBlocked] = useState(false);
  useEffect(() => {
    const mid = activityTrackingService.getOrCreateMachineId();
    const isAdmin = ADMIN_WHITELIST_MACHINES.includes(mid) || mid === 'GV-0DAD-F76C' || mid.includes('DVT');

    if (isAdmin) {
      // 👑 TỰ ĐỘNG KÍCH HOẠT ĐẶC QUYỀN RIÊNG CHO MÁY THẦY THÀNH / ADMIN
      localStorage.setItem('gvai_unlimited_machine', 'true');
      localStorage.setItem('gvai_taode_active_key', 'DVT-ENG-LIFETIME-MASTER-PRO-KEY');
      localStorage.setItem('gvai_bienthe_active_key', 'DVT-BIENTHE-LIFETIME-MASTER');
      localStorage.setItem('gvai_nls_active_key', 'DVT-NLS-LIFETIME-MASTER');
      localStorage.setItem('gvai_cleaner_active_key', 'DVT-CLEANER-LIFETIME-MASTER');
      localStorage.setItem('gvai_mathstudio_active_key', 'DVT-MATH-LIFETIME-MASTER');
      localStorage.removeItem('gvai_blocked_machines');
      localStorage.removeItem('gvai_blocked_list');
      activityTrackingService.unblockMachine(mid);
      setIsCurrentBlocked(false);
    } else {
      // 🛡️ BẢO VỆ BẢN QUYỀN MÁY GIÁO VIÊN / KHÁCH HÀNG:
      // Mỗi App kích hoạt độc lập, TUYỆT ĐỐI KHÔNG mở khóa chéo hay mở khóa toàn bộ!
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
  const [imgError, setImgError] = useState(false);
  const [appImgErrors, setAppImgErrors] = useState<Record<string, boolean>>({});

  const closeAllModals = () => {
    setShowSKKNModal(false);
    setShowListeningModal(false);
    setShowNLSAIModal(false);
    setShowTaoDeModal(false);
    setShowSinhDeBienTheModal(false);
    setShowScreenRecordModal(false);
    setShowCleanerModal(false);
    setShowChuanHoaVBModal(false);
    setShowTachGopPDFModal(false);
    setShowTaoDeTHCS8MonModal(false);
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
      const hash = window.location.hash;
      if (hash === '#dung-thu' || hash === '#trial') {
        setShowTrialModal(true);
        webSecurityGuard.setActiveApp('trial', 'Đăng Ký Trải Nghiệm Giáo Viên AI');
        return;
      }
      if (hash === '#tao-de-tieng-anh') {
        setShowTaoDeModal(true);
        webSecurityGuard.setActiveApp('tao-de-tieng-anh-thcs', 'Tạo Đề Tiếng Anh THCS (CV 7991)');
      }
      else if (hash === '#tao-de-toan') {
        setThcs8MonSelectedSubject('TOAN');
        setShowTaoDeTHCS8MonModal(true);
        webSecurityGuard.setActiveApp('tao-de-toan-thcs', 'Tạo Đề Toán THCS (CV 7991)');
      }
      else if (hash === '#tao-de-van') {
        setThcs8MonSelectedSubject('VAN');
        setShowTaoDeTHCS8MonModal(true);
        webSecurityGuard.setActiveApp('tao-de-van-thcs', 'Tạo Đề Ngữ Văn THCS (CV 7991)');
      }
      else if (hash === '#tao-de-khtn') {
        setThcs8MonSelectedSubject('KHTN');
        setShowTaoDeTHCS8MonModal(true);
        webSecurityGuard.setActiveApp('tao-de-khtn-thcs', 'Tạo Đề KHTN THCS (CV 7991)');
      }
      else if (hash === '#tao-de-sudia') {
        setThcs8MonSelectedSubject('SUDIA');
        setShowTaoDeTHCS8MonModal(true);
        webSecurityGuard.setActiveApp('tao-de-sudia-thcs', 'Tạo Đề Lịch Sử - Địa Lí THCS');
      }
      else if (hash === '#tao-de-tin') {
        setThcs8MonSelectedSubject('TIN');
        setShowTaoDeTHCS8MonModal(true);
        webSecurityGuard.setActiveApp('tao-de-tin-thcs', 'Tạo Đề Tin Học THCS');
      }
      else if (hash === '#tao-de-gdcd') {
        setThcs8MonSelectedSubject('GDCD');
        setShowTaoDeTHCS8MonModal(true);
        webSecurityGuard.setActiveApp('tao-de-gdcd-thcs', 'Tạo Đề GDCD THCS');
      }
      else if (hash === '#tao-de-cn') {
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
    return () => window.removeEventListener('hashchange', handleHash);
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
      if (selectedCategory === 'NLS') {
        const isNls = app.category.includes('5512') || app.id.includes('nls') || app.id.includes('soangiaoan');
        if (!isNls) return false;
      } else if (selectedCategory === 'EXAM') {
        const isExam = app.category.includes('7991') || app.id.includes('tao-de') || app.id.includes('bienthe') || app.id.includes('15p');
        if (!isExam) return false;
      } else if (selectedCategory === 'MATH') {
        const isMath = app.category.includes('MATHPIX') || app.id.includes('math') || app.id.includes('toan');
        if (!isMath) return false;
      } else if (selectedCategory === 'AUDIO') {
        const isAudio = app.category.includes('NGOẠI NGỮ') || app.id.includes('listening') || app.id.includes('tieng-anh');
        if (!isAudio) return false;
      } else if (selectedCategory === 'UTILITY') {
        const isUtility = app.category.includes('TIỆN ÍCH') || app.id.includes('cleaner') || app.id.includes('record') || app.id.includes('pdf') || app.id.includes('chuan-hoa');
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

  const handleAppClick = (app: AppCard, e: React.MouseEvent) => {
    webSecurityGuard.setActiveApp(app.id, app.title);
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
    if (app.id === 'tao-de-tieng-anh-thcs' || app.url === '#tao-de-tieng-anh') {
      e.preventDefault();
      setShowTaoDeModal(true);
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

  return (
    <div className="min-h-screen bg-[#F6F8FC] text-[#172033] flex flex-col font-sans">
      {/* TOP ANNOUNCEMENT & UTILITIES BAR - TINH TẾ, KHÔNG TRÙNG LẶP */}
      <div className="bg-[#071322] text-white text-[11px] sm:text-xs py-2 px-4 border-b border-blue-900/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 font-bold text-[10px] tracking-wide uppercase">
              <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
              Kỷ Nguyên Số 2026
            </span>
            <span className="hidden sm:inline text-slate-300 font-medium truncate">
              Nền tảng Trợ lý Trí tuệ Nhân tạo & Giải pháp Số hóa Giáo dục THCS Chuẩn Bộ GD&ĐT
            </span>
            <span className="sm:hidden text-slate-300 font-medium truncate">
              Trợ lý AI Giáo Dục THCS 2026
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0 font-medium text-slate-300">
            <a
              href={BRAND.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
              title="Nhắn tin Zalo trực tiếp hỗ trợ kỹ thuật"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Hỗ trợ trực tuyến: <strong className="text-emerald-400 font-semibold">{BRAND.phone}</strong></span>
            </a>
            <span className="text-slate-700 hidden md:inline">|</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText('https://giao-vien-ai-toan-nang3.vercel.app/');
                alert('Đã sao chép liên kết Website Giáo Viên AI Toàn Năng! Thầy/Cô hãy gửi Zalo hoặc Facebook để chia sẻ cho đồng nghiệp trong trường nhé!');
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white transition cursor-pointer text-[11px] font-semibold border border-slate-700/80"
              title="Sao chép link gửi cho đồng nghiệp"
            >
              <Share2 className="w-3 h-3 text-cyan-300" />
              <span>Chia sẻ</span>
            </button>
            <span className="text-slate-700 hidden lg:inline">|</span>
            <a
              href={BRAND.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <span>Facebook</span>
            </a>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR - SANG TRỌNG, ĐẲNG CẤP CHUẨN SAAS */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-all">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo & Brand Identity */}
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
                  <h1 className="text-base sm:text-xl font-black tracking-tight text-slate-900">
                    GIÁO VIÊN AI <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">TOÀN NĂNG</span>
                  </h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
                    v3.0 PRO
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                    {BRAND.slogan}
                  </p>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <span className="text-[11px] text-teal-700 font-bold hidden sm:inline">
                    Thầy {BRAND.author}
                  </span>
                </div>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-slate-700 text-xs xl:text-sm font-bold">
              <a
                href="#apps"
                className="px-3.5 py-2 rounded-xl text-blue-700 bg-blue-50/80 hover:bg-blue-100 transition-colors flex items-center gap-1.5"
              >
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Kho Ứng Dụng ({activeApps.length})</span>
              </a>
              <a
                href="#footer-info"
                className="px-3.5 py-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 transition-colors"
              >
                Tác Giả & Hỗ Trợ
              </a>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2 lg:gap-2.5 font-medium text-slate-700 text-sm">
              {/* Nút Đăng Ký Dùng Thử */}
              <button
                onClick={() => setShowTrialModal(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all text-xs font-black flex items-center gap-1.5 active:scale-95 cursor-pointer"
                title="Đăng ký dùng thử 5 lần miễn phí"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>DÙNG THỬ 5 LẦN</span>
              </button>

              {/* Nút Quản Trị Admin */}
              <button
                onClick={() => setShowAdminDashboard(true)}
                className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-300 transition-all text-xs font-bold flex items-center gap-1.5 shadow-2xs group cursor-pointer"
                title="Bảng Quản Trị Bản Quyền Cloud 24/7"
              >
                <Crown className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
                <span>Quản Trị</span>
              </button>

              {/* Hotline Pill */}
              <a
                href={BRAND.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-700 border border-slate-200 hover:border-blue-200 transition-all text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                title={`Hotline / Zalo: ${BRAND.phone}`}
              >
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden xl:inline">Zalo: {BRAND.phone}</span>
                <span className="xl:hidden">{BRAND.phone}</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-slate-800" /> : <Menu className="w-6 h-6 text-slate-800" />}
            </button>
          </div>

          {/* Mobile Drawer */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-3 border-t border-slate-200/80 flex flex-col gap-2 font-medium text-slate-700 text-sm animate-fadeIn">
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
                className="px-3.5 py-2 rounded-xl hover:bg-blue-50 text-slate-800 font-semibold flex items-center gap-2.5 transition-colors"
              >
                <UserCheck className="w-4 h-4 text-indigo-600" />
                Thông Tin Tác Giả & Hỗ Trợ
              </a>

              <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
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
                  Zalo Thầy Thành: {BRAND.phone}
                </a>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className="flex-1">
        {/* HERO SECTION 2 CỘT HIỆN ĐẠI CHUẨN MARKETING AGENCY / SAAS */}
        <section className="pt-4 pb-6 sm:pt-7 sm:pb-9 bg-gradient-to-b from-[#F0F4FA] via-[#F6F8FC] to-[#F6F8FC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#071527] via-[#0E2748] to-[#173F6E] text-white shadow-2xl shadow-blue-950/25 border border-blue-700/30">
              
              {/* Hiệu ứng ánh sáng nền đa tầng */}
              <div className="absolute -right-20 -top-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-600/25 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute right-1/3 top-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

              <div className="relative px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                
                {/* CỘT TRÁI: HEADLINE MẠNH MẼ + CAM KẾT SƯ PHẠM + CTA (COL-SPAN-7) */}
                <div className="lg:col-span-7 text-center lg:text-left z-10 space-y-4 sm:space-y-5">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 text-[11px] sm:text-xs font-black tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    <span>CHUYỂN ĐỔI SỐ GIÁO DỤC THCS 2026 • PRO 3.0</span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                    Đột Phá Năng Suất Giảng Dạy <br className="hidden sm:inline" />
                    <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-200 bg-clip-text text-transparent">
                      Cùng Hệ Thống Giáo Viên AI
                    </span>
                  </h1>

                  <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-normal max-w-2xl mx-auto lg:mx-0">
                    Giải pháp sư phạm chuyên biệt do <strong>Thầy giáo Đinh Văn Thành</strong> (THCS Đồng Yên) phát triển: Tự động tích hợp Năng lực số (CV 5512), tạo ma trận & đề thi 12 môn (CV 7991), chuyển công thức Mathpix sang Word chỉ 3 giây.
                  </p>

                  {/* CÁC NÚT KÊU GỌI HÀNH ĐỘNG (CTA) */}
                  <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
                    <a
                      href="#apps"
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-200 hover:from-cyan-300 hover:to-white text-[#071527] font-black text-xs sm:text-sm shadow-xl shadow-cyan-900/30 hover:scale-[1.03] transition-all flex items-center gap-2 group cursor-pointer"
                    >
                      <span>Khám phá kho công cụ</span>
                      <ArrowRight className="w-4 h-4 text-[#071527] group-hover:translate-x-1 transition-transform" />
                    </a>

                    <button
                      onClick={() => setShowTrialModal(true)}
                      className="px-5 py-3 rounded-2xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm border border-emerald-400/40 shadow-lg shadow-emerald-950/40 hover:scale-[1.03] transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Dùng thử 5 lần miễn phí</span>
                    </button>

                    <a
                      href={BRAND.zaloUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-blue-100 hover:text-white border border-white/20 font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4 text-teal-300" />
                      <span>Tư vấn Zalo 24/7</span>
                    </a>
                  </div>

                  {/* CAM KẾT SƯ PHẠM UY TÍN (TRUST BADGES) */}
                  <div className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-blue-200/90 font-medium text-left">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0" />
                      <span>100% Chuẩn CV 5512 & 7991</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                      <span>Cài đặt 1-Click • Dùng Offline</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                      <span>Được bảo chứng bởi Thầy Thành</span>
                    </div>
                  </div>
                </div>

                {/* CỘT PHẢI: INTERACTIVE LIVE PREVIEW MOCKUP (COL-SPAN-5) */}
                <div className="lg:col-span-5 relative flex items-center justify-center">
                  <div className="w-full max-w-md p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-white/15 via-white/10 to-white/5 border border-white/25 backdrop-blur-xl shadow-2xl shadow-blue-950/40 space-y-3.5 font-sans">
                    
                    {/* Header Thẻ Preview */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/20">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                          <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-white flex items-center gap-1.5">
                            <span>Giáo Viên AI v3.0 Pro</span>
                            <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black">VIP</span>
                          </div>
                          <div className="text-[10px] text-cyan-300">Bản quyền Sư phạm: Thầy Đinh Văn Thành</div>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Đang hoạt động
                      </span>
                    </div>

                    {/* Khối mô phỏng 3 tính năng trực quan */}
                    <div className="space-y-2.5 text-xs">
                      {/* Mục 1: Giáo án NLS 5512 */}
                      <div className="p-2.5 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/15 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-extrabold text-cyan-300 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-cyan-300" />
                            Giáo án NLS (CV 5512)
                          </span>
                          <span className="text-[10px] text-slate-300">Word Add-in</span>
                        </div>
                        <div className="text-[11px] text-slate-200">
                          Tự động chèn Năng lực số, STEM, AI với <span className="font-bold text-red-300 bg-red-950/60 px-1 py-0.5 rounded border border-red-500/40">chữ màu đỏ</span> chuẩn quy cách sư phạm.
                        </div>
                      </div>

                      {/* Mục 2: Đề kiểm tra 12 môn 7991 */}
                      <div className="p-2.5 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/15 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-extrabold text-amber-300 flex items-center gap-1.5">
                            <FileCheck className="w-3.5 h-3.5 text-amber-300" />
                            Đề Kiểm Tra 12 Môn (CV 7991)
                          </span>
                          <span className="text-[10px] text-slate-300">Ma trận & Đặc tả</span>
                        </div>
                        <div className="text-[11px] text-slate-200">
                          Xuất file Word đầy đủ bảng ma trận, đặc tả và đáp án đúng được <span className="font-bold text-red-300 bg-red-950/60 px-1 py-0.5 rounded border border-red-500/40">tô đỏ (#FF0000)</span> tiện tra cứu chấm bài.
                        </div>
                      </div>

                      {/* Mục 3: MathStudio Pro */}
                      <div className="p-2.5 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/15 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-extrabold text-emerald-300 flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-emerald-300" />
                            MathStudio Pro (Mathpix Word)
                          </span>
                          <span className="text-[10px] text-emerald-300 font-bold">1-Click</span>
                        </div>
                        <div className="text-[11px] text-slate-200">
                          Chuyển đổi công thức Toán học Mathpix sang MathType và Equation chuẩn Office tốc độ cao.
                        </div>
                      </div>
                    </div>

                    {/* Dòng bảo chứng bản quyền */}
                    <div className="pt-1 flex items-center justify-between text-[10.5px] text-slate-300">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Mã bảo mật: <strong>Ed25519 Cloud Anti-Crack</strong>
                      </span>
                      <a href="#apps" className="text-cyan-300 font-bold hover:underline">Xem tất cả 17 app →</a>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>


        {/* APPS SECTION (PRIMARY SHOWCASE) */}
        <section id="apps" className="pt-6 pb-12 sm:pt-8 sm:pb-16 bg-[#F6F8FC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* THANH TÌM KIẾM VÀ BỘ LỌC TABS HIỆN ĐẠI */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 mb-6 transition-all space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                {/* TIÊU ĐỀ BỘ CÔNG CỤ */}
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 shrink-0"></div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <span>Kho Ứng Dụng Chuyên Môn THCS 2026</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                        Chuẩn Bộ GD&ĐT
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Chọn lọc công cụ chuyên biệt theo nhu cầu soạn bài và kiểm tra đánh giá của Thầy/Cô
                    </p>
                  </div>
                </div>

                {/* Ô TÌM KIẾM NHANH + BỘ ĐẾM SỐ LƯỢNG */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Tìm môn học, tên ứng dụng hoặc mã văn bản..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-8 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs text-slate-800 placeholder-slate-400 transition"
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
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-black bg-slate-100 px-3.5 py-2.5 rounded-2xl border border-slate-200/80 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{filteredApps.length}/{activeApps.length}</span>
                  </span>
                </div>
              </div>

              {/* BỘ LỌC DANH MỤC DẠNG TAB (CATEGORY TABS) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none font-sans">
                {[
                  { id: 'ALL', label: 'Tất Cả Ứng Dụng', count: activeApps.length },
                  { id: 'NLS', label: 'Giáo Án & NLS (5512)', count: activeApps.filter(a => a.category.includes('5512') || a.id.includes('nls')).length },
                  { id: 'EXAM', label: 'Đề Thi 12 Môn (7991)', count: activeApps.filter(a => a.category.includes('7991') || a.id.includes('tao-de') || a.id.includes('bienthe') || a.id.includes('15p')).length },
                  { id: 'MATH', label: 'Toán Học & Mathpix', count: activeApps.filter(a => a.category.includes('MATHPIX') || a.id.includes('math') || a.id.includes('toan')).length },
                  { id: 'AUDIO', label: 'Bài Giảng & Ngoại Ngữ', count: activeApps.filter(a => a.category.includes('NGOẠI NGỮ') || a.id.includes('listening') || a.id.includes('tieng-anh')).length },
                  { id: 'UTILITY', label: 'Tiện Ích Sư Phạm', count: activeApps.filter(a => a.category.includes('TIỆN ÍCH') || a.id.includes('cleaner') || a.id.includes('record') || a.id.includes('pdf') || a.id.includes('chuan-hoa')).length },
                ].map((tab) => {
                  const isActive = selectedCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedCategory(tab.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* BANNER QUẢNG CÁO CHÉO CÁC APP TÍNH TIỀN PRO CỦA THẦY THÀNH (NHẤP NHÁY NHẸ, 1-CLICK TẢI / TRẢI NGHIỆM) */}
            <div className="mb-6">
              <CrossPromoBanner
                onNavigateApp={(hash) => {
                  window.location.hash = hash;
                }}
              />
            </div>

            {/* EMPTY STATE */}
            {filteredApps.length === 0 ? (
              <div className="max-w-md mx-auto py-12 px-6 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#123A63] mb-1">
                  Không tìm thấy ứng dụng phù hợp
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc để xem toàn bộ {activeApps.length} ứng dụng.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 rounded-xl bg-[#123A63] text-white text-xs font-bold hover:bg-blue-900 transition-colors shadow-sm cursor-pointer"
                >
                  Xem toàn bộ {activeApps.length} ứng dụng
                </button>
              </div>
            ) : (
              /* ACTIVE APPS GRID */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {filteredApps.map((app) => (
                  <div
                    key={app.id}
                    className={`group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-300/80 transition-all duration-300 flex flex-col hover:-translate-y-1 ${
                      app.featured ? 'ring-2 ring-amber-400/80 shadow-amber-500/10' : ''
                    }`}
                  >
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      {!appImgErrors[app.id] ? (
                        <img
                          src={app.image}
                          alt={app.title}
                          onError={() => handleAppImgError(app.id)}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                          <Layers className="w-12 h-12 mb-2" />
                          <span className="text-xs font-semibold">GV AI TOÀN NĂNG</span>
                        </div>
                      )}
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
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white/90 text-slate-700 shadow-xs backdrop-blur-xs">
                          {app.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-[#123A63] group-hover:text-[#2563EB] transition-colors line-clamp-1">
                          {app.title}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed mt-2 line-clamp-3">
                          {app.description}
                        </p>
                      </div>

                      <a
                        href={app.url}
                        onClick={(e) => handleAppClick(app, e)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#123A63] via-[#1A4574] to-[#2563EB] hover:from-[#0d2847] hover:to-blue-600 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg group-hover:scale-[1.01]"
                      >
                        Mở công cụ ngay
                        <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </main>

      {/* FOOTER & THÔNG TIN TÁC GIẢ TƯƠNG PHẢN CAO (#footer-info) */}
      <footer id="footer-info" className="bg-[#0A192F] text-white border-t-2 border-[#1E293B] py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-800">
            
            {/* Cột 1: Thông tin thương hiệu & hệ thống */}
            <div className="md:col-span-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    {BRAND.websiteTitle}
                  </h2>
                  <p className="text-xs text-cyan-400 font-semibold">
                    Hệ Sinh Thái Ứng Dụng Chuyên Môn Giáo Viên THCS
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Bộ công cụ chuyên biệt hỗ trợ soạn giáo án tích hợp Năng lực số (CV 5512), sinh ma trận & đề kiểm tra 12 môn (CV 7991), chuyển đổi công thức Toán học Mathpix sang Word và các tiện ích sư phạm thiết thực.
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-400 border border-slate-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Kích hoạt độc lập từng app
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 border border-slate-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Tiện ích miễn phí trọn đời
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 border border-slate-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Bảo mật Ed25519 Offline
                </span>
              </div>
            </div>

            {/* Cột 2: Thông tin tác giả & liên hệ */}
            <div className="md:col-span-6 space-y-3 md:pl-6">
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Tác Giả & Hỗ Trợ Kỹ Thuật
              </div>

              <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-6 h-6 text-cyan-300" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">{BRAND.author}</div>
                    <div className="text-xs text-slate-300">{BRAND.job} – {BRAND.organization}</div>
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
                    <span>Zalo: {BRAND.phone}</span>
                  </a>

                  <a
                    href={`tel:${BRAND.phoneRaw}`}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-teal-300" />
                    <span>{BRAND.phone}</span>
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

          {/* Dòng bản quyền & Cổng Admin */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div>
              {BRAND.copyright}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowTrialModal(true)}
                className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer"
              >
                Dùng thử 5 lần
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setShowAdminDashboard(true)}
                className="text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5" />
                Cổng Quản trị Admin Dashboard
              </button>
            </div>
          </div>
        </div>
      </footer>

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
      <OnlineTTSModal
        isOpen={showListeningModal}
        onClose={closeAllModals}
      />

      {/* TÍCH HỢP NLS - AI THCS (ADD-INS V3) MODAL (3 TABS) */}
      <NLSAIModal
        isOpen={showNLSAIModal}
        onClose={closeAllModals}
        onOpenAdmin={() => setShowAdminDashboard(true)}
      />

      {/* TẠO ĐỀ KIỂM TRA TIẾNG ANH GLOBAL SUCCESS (CV 7991) MODAL (3 TABS) */}
      <TaoDeTiengAnhModal
        isOpen={showTaoDeModal}
        onClose={closeAllModals}
        onOpenAdmin={() => setShowAdminDashboard(true)}
      />

      {/* SINH 3 ĐỀ BIẾN THỂ VIP (V1) MODAL (3 TABS) */}
      <SinhDeBienTheModal
        isOpen={showSinhDeBienTheModal}
        onClose={closeAllModals}
        onOpenAdmin={() => setShowAdminDashboard(true)}
      />

      {/* SCREEN RECORD PRO V2 (3 TABS) */}
      <ScreenRecordModal
        isOpen={showScreenRecordModal}
        onClose={closeAllModals}
        onOpenAdmin={() => setShowAdminDashboard(true)}
      />

      {/* ĐINH THÀNH CLEANER PRO v4.5 VIP (3 TABS) */}
      <CleanerModal
        isOpen={showCleanerModal}
        onClose={closeAllModals}
        onOpenAdmin={() => setShowAdminDashboard(true)}
      />

      {/* CHUẨN HÓA VĂN BẢN HÀNH CHÍNH AI (NGHỊ ĐỊNH 30/2020) (3 TABS) */}
      <ChuanHoaVBModal
        isOpen={showChuanHoaVBModal}
        onClose={closeAllModals}
        onOpenAdmin={() => setShowAdminDashboard(true)}
      />

      {/* PDF SUITE PRO (TÁCH - GỘP - LỌC TRANG TRẮNG AI) (3 TABS) */}
      <TachGopPDFModal
        isOpen={showTachGopPDFModal}
        onClose={closeAllModals}
        onOpenAdmin={() => setShowAdminDashboard(true)}
      />

      {/* HỆ THỐNG PHẦN MỀM TẠO ĐỀ KIỂM TRA THCS (7 MÔN & 7 APP ĐỘC LẬP) */}
      <TaoDeTHCS8MonModal
        isOpen={showTaoDeTHCS8MonModal}
        onClose={closeAllModals}
        initialSubject={thcs8MonSelectedSubject}
        selectedSubject={thcs8MonSelectedSubject}
        onOpenAdmin={() => setShowAdminDashboard(true)}
        onSwitchToEnglish={() => setShowTaoDeModal(true)}
      />

      {/* ĐINH THÀNH MATHSTUDIO 2026+ (WORD & MATHPIX) */}
      <MathStudioModal
        isOpen={showMathStudioModal}
        onClose={closeAllModals}
        onOpenAdmin={() => setShowAdminDashboard(true)}
      />

      {/* TẠO ĐỀ 15 PHÚT TIẾNG ANH (GLOBAL SUCCESS) - CHỈ DÀNH CHO ADMIN */}
      <TaoDe15PhutModal
        isOpen={showTaoDe15PhutModal}
        onClose={closeAllModals}
        onOpenAdmin={() => setShowAdminDashboard(true)}
        onSwitchToStandardExam={() => {
          closeAllModals();
          setShowTaoDeModal(true);
        }}
      />

      {/* CLOUD ADMIN DASHBOARD 24/7 */}
      <AdminDashboard
        isOpen={showAdminDashboard}
        onClose={closeAllModals}
      />

            {/* MODAL ĐĂNG KÝ DÙNG THỬ 5 LẦN */}
      <TrialRegisterModal
        isOpen={showTrialModal}
        onClose={() => setShowTrialModal(false)}
      />
      {/* FLOATING QUICK CONTACT (ZALO THẦY THÀNH) */}
      <a
        href={BRAND.zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 p-3 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-[#0D9488] to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs sm:text-sm shadow-2xl shadow-teal-900/40 flex items-center gap-2 hover:scale-105 transition-all border border-teal-400/30 group"
        title="Chat Zalo Thầy Đinh Văn Thành (0915.213717)"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-300"></span>
        </span>
        <MessageCircle className="w-5 h-5 text-white" />
        <span className="hidden sm:inline font-semibold">Zalo Thầy Thành: {BRAND.phone}</span>
      </a>
    </div>
  );
}
