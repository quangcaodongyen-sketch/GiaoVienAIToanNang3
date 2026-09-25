import { cloudSyncService } from './services/cloudSyncService';
import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Sparkles, 
  ExternalLink, 
  BookOpen, 
  Phone, 
  MessageCircle, 
  Share2, 
  GraduationCap, 
  Building2, 
  MapPin, 
  Quote, 
  UserCheck, 
  FileText, 
  Layers,
  ArrowRight,
  Crown,
  Search,
  ShieldAlert
} from 'lucide-react';
import { BRAND } from './config/brand';
import { apps, AppCard } from './data/apps';
import { AdminDashboard } from './components/AdminDashboard';
import { TrialRegisterModal } from './components/TrialRegisterModal';
import { activityTrackingService } from './services/activityTrackingService';
import { OnlineTTSModal } from './components/OnlineTTSModal';
import { NLSAIModal } from './components/NLSAIModal';
import { TaoDeTiengAnhModal } from './components/TaoDeTiengAnhModal';
import { SinhDeBienTheModal } from './components/SinhDeBienTheModal';
import { ScreenRecordModal } from './components/ScreenRecordModal';
import { CleanerModal } from './components/CleanerModal';
import { ChuanHoaVBModal } from './components/ChuanHoaVBModal';
import { TachGopPDFModal } from './components/TachGopPDFModal';
import { TaoDeTHCS8MonModal } from './components/TaoDeTHCS8MonModal';

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
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
  const [thcs8MonSelectedSubject, setThcs8MonSelectedSubject] = useState<string>('TOAN');
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [isCurrentBlocked, setIsCurrentBlocked] = useState(false);
  useEffect(() => {
    // 👑 TỰ ĐỘNG KÍCH HOẠT ĐẶC QUYỀN MÁY THẦY THÀNH (DÙNG THỬ THOẢI MÁI KHÔNG GIỚI HẠN)
    localStorage.setItem('gvai_unlimited_machine', 'true');
    localStorage.setItem('gvai_taode_active_key', 'DVT-ENG-LIFETIME-MASTER-PRO-KEY');
    localStorage.setItem('gvai_bienthe_active_key', 'DVT-BIENTHE-LIFETIME-MASTER');
    localStorage.setItem('gvai_nls_active_key', 'DVT-NLS-LIFETIME-MASTER');
    localStorage.setItem('gvai_cleaner_active_key', 'DVT-CLEANER-LIFETIME-MASTER');

    const mid = activityTrackingService.getOrCreateMachineId();
    setIsCurrentBlocked(activityTrackingService.isCurrentMachineBlocked());

    // Kiểm tra trạng thái máy tính từ Cloud
    cloudSyncService.checkCurrentMachineCloudStatus(mid).then(res => {
      if (res.isBlocked) {
        activityTrackingService.blockMachine(mid, 'Đồng bộ khóa từ Cloud');
        setIsCurrentBlocked(true);
      }
    });
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
    setShowAdminDashboard(false);
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
        return;
      }
      if (hash === '#tao-de-tieng-anh') setShowTaoDeModal(true);
      else if (hash === '#tao-de-toan') { setThcs8MonSelectedSubject('TOAN'); setShowTaoDeTHCS8MonModal(true); }
      else if (hash === '#tao-de-van') { setThcs8MonSelectedSubject('VAN'); setShowTaoDeTHCS8MonModal(true); }
      else if (hash === '#tao-de-khtn') { setThcs8MonSelectedSubject('KHTN'); setShowTaoDeTHCS8MonModal(true); }
      else if (hash === '#tao-de-sudia') { setThcs8MonSelectedSubject('SUDIA'); setShowTaoDeTHCS8MonModal(true); }
      else if (hash === '#tao-de-tin') { setThcs8MonSelectedSubject('TIN'); setShowTaoDeTHCS8MonModal(true); }
      else if (hash === '#tao-de-gdcd') { setThcs8MonSelectedSubject('GDCD'); setShowTaoDeTHCS8MonModal(true); }
      else if (hash === '#tao-de-cn') { setThcs8MonSelectedSubject('CN'); setShowTaoDeTHCS8MonModal(true); }
      else if (hash === '#sinh-de-bien-the') setShowSinhDeBienTheModal(true);
      else if (hash === '#screen-record') setShowScreenRecordModal(true);
      else if (hash === '#cleaner-pro' || hash === '#cleaner') setShowCleanerModal(true);
      else if (hash === '#chuan-hoa-vb' || hash === '#chuanhoavanban') setShowChuanHoaVBModal(true);
      else if (hash === '#tach-gop-pdf' || hash === '#pdf-suite') setShowTachGopPDFModal(true);
      else if (hash === '#tao-de-thcs-8mon' || hash === '#tao-de-8mon' || hash === '#thcs-8mon') setShowTaoDeTHCS8MonModal(true);
      else if (hash === '#smart-listening') setShowListeningModal(true);
      else if (hash === '#nls-ai') setShowNLSAIModal(true);
      else if (hash === '#admin') setShowAdminDashboard(true);
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Filter only active apps
  const activeApps = apps
    .filter((app) => app.active)
    .sort((a, b) => a.order - b.order);

  // Categories based ONLY on activeApps
  const categories = ['Tất cả', ...Array.from(new Set(activeApps.map((app) => app.category)))];

  // Category counts
  const categoryCounts = categories.reduce<Record<string, number>>((acc, cat) => {
    if (cat === 'Tất cả') {
      acc[cat] = activeApps.length;
    } else {
      acc[cat] = activeApps.filter((a) => a.category === cat).length;
    }
    return acc;
  }, {});

  // Filtered by Category and Search Query
  const filteredApps = activeApps.filter((app) => {
    const matchesCategory = selectedCategory === 'Tất cả' || app.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = query === '' ||
      app.title.toLowerCase().includes(query) ||
      app.description.toLowerCase().includes(query) ||
      app.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const handleAppClick = (app: AppCard, e: React.MouseEvent) => {
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
      {/* TOP ANNOUNCEMENT & CONTACT BAR */}
      <div className="bg-gradient-to-r from-[#0d2a4a] via-[#123A63] to-[#1a4b80] text-white text-[11px] sm:text-xs py-2 px-4 border-b border-blue-900/50 shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 font-semibold text-[10px] tracking-wide uppercase">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Công cụ AI Giáo Dục
            </span>
            <span className="hidden sm:inline text-blue-100 font-medium truncate">
              Hệ sinh thái công cụ AI thiết thực cho giáo viên – Thầy giáo {BRAND.author}
            </span>
            <span className="sm:hidden text-blue-100 font-medium truncate">
              GV AI Toàn Năng – {BRAND.author}
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 font-medium">
            <a
              href={BRAND.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-100 hover:text-white transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Zalo hỗ trợ: <strong className="text-white">{BRAND.phone}</strong></span>
            </a>
            <span className="text-blue-400/40 hidden md:inline">|</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText('https://giao-vien-ai-toan-nang3.vercel.app/');
                alert('Đã sao chép liên kết Website Giáo Viên AI Toàn Năng!\nThầy/Cô hãy dán (Paste) vào Zalo hoặc Facebook để chia sẻ cho đồng nghiệp trong trường/tổ chuyên môn cùng sử dụng nhé!');
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 hover:text-white transition cursor-pointer text-[11px] font-semibold border border-blue-400/30"
              title="Sao chép liên kết website để gửi Zalo cho đồng nghiệp"
            >
              <Share2 className="w-3 h-3 text-cyan-300" />
              <span>Chia sẻ cho đồng nghiệp</span>
            </button>
            <span className="text-blue-400/40 hidden lg:inline">|</span>
            <a
              href={BRAND.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1 text-blue-200 hover:text-white transition-colors"
            >
              <span>Facebook</span>
            </a>
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm transition-all">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo & Brand Name */}
            <a href="#apps" className="flex items-center gap-3 sm:gap-3.5 group">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#0f2b48] via-[#123A63] to-[#2563EB] flex items-center justify-center text-white shadow-md shadow-blue-900/20 group-hover:scale-105 group-hover:shadow-blue-600/30 transition-all duration-300 ring-2 ring-blue-500/20">
                  <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-white transition-transform group-hover:-rotate-6" />
                </div>
                {/* Active Indicator Pulse */}
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-xl font-black tracking-tight bg-gradient-to-r from-[#0f2b48] via-[#123A63] to-[#2563EB] bg-clip-text text-transparent">
                    GIÁO VIÊN AI TOÀN NĂNG
                  </h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs">
                    BẢN CHÍNH THỨC
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm border border-emerald-400/40">
                    👑 MÁY THẦY THÀNH (VIP PRO)
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                    {BRAND.slogan}
                  </p>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <span className="text-[11px] text-[#0D9488] font-semibold hidden sm:inline">
                    {BRAND.author}
                  </span>
                </div>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3 font-medium text-slate-700 text-sm">
              <a
                href="#apps"
                className="px-3 py-2 rounded-xl text-slate-700 hover:text-[#2563EB] hover:bg-blue-50/70 transition-all font-semibold flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Kho ứng dụng</span>
              </a>
              <a
                href="#about"
                className="px-3 py-2 rounded-xl text-slate-700 hover:text-[#2563EB] hover:bg-blue-50/70 transition-all font-semibold flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4 text-slate-500" />
                <span>Về tác giả</span>
              </a>
              <a
                href="#contact"
                className="px-3 py-2 rounded-xl text-slate-700 hover:text-[#2563EB] hover:bg-blue-50/70 transition-all font-semibold flex items-center gap-1.5"
              >
                <Phone className="w-4 h-4 text-teal-600" />
                <span>Liên hệ</span>
              </a>

              {/* Nút Đăng Ký Dùng Thử 5 Lần */}
              <button
                onClick={() => setShowTrialModal(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/20 transition-all text-xs font-black flex items-center gap-1.5 active:scale-95 cursor-pointer"
                title="Đăng ký dùng thử 5 lần miễn phí"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>ĐĂNG KÝ THÀNH VIÊN</span>
              </button>

              {/* Quản trị Cloud Button */}
              <button
                onClick={() => setShowAdminDashboard(true)}
                className="ml-1 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-yellow-500/10 hover:from-amber-500/20 hover:to-yellow-500/20 text-amber-900 border border-amber-300/80 transition-all text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:shadow-xs group"
                title="Quản trị Bản quyền Cloud 24/7"
              >
                <Crown className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
                <span>Quản trị Cloud</span>
              </button>

              {/* Primary Hotline / Zalo Button */}
              <a
                href={BRAND.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/80 transition-all text-xs font-bold flex items-center gap-1.5 shadow-2xs"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#0D9488]" />
                <span>Zalo Hỗ trợ</span>
              </a>

              {/* Primary Contact CTA */}
              <a 
                href="#contact" 
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#123A63] to-[#2563EB] hover:from-[#0f2d4f] hover:to-blue-600 text-white transition-all text-sm font-semibold shadow-md shadow-blue-900/15 hover:shadow-blue-600/30 hover:scale-[1.02]"
              >
                Hỗ trợ ngay
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

          {/* Mobile Navigation Drawer */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200/80 flex flex-col gap-2 font-medium text-slate-700 text-sm animate-fadeIn">
              <a 
                href="#apps" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl hover:bg-blue-50 text-slate-800 font-semibold flex items-center gap-2.5 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-blue-600" />
                Kho ứng dụng AI
              </a>
              <a 
                href="#about" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl hover:bg-blue-50 text-slate-800 font-semibold flex items-center gap-2.5 transition-colors"
              >
                <UserCheck className="w-4 h-4 text-slate-600" />
                Về tác giả
              </a>
              <a 
                href="#contact" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl hover:bg-blue-50 text-slate-800 font-semibold flex items-center gap-2.5 transition-colors"
              >
                <Phone className="w-4 h-4 text-teal-600" />
                Liên hệ hỗ trợ
              </a>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setShowAdminDashboard(true);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-bold text-left flex items-center gap-2.5 shadow-2xs"
              >
                <Crown className="w-4 h-4 text-amber-600" />
                Quản trị Bản quyền Cloud
              </button>
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <a
                  href={BRAND.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center px-4 py-2.5 rounded-xl bg-[#0D9488] hover:bg-teal-700 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat Zalo: {BRAND.phone}
                </a>
              </div>
            </div>
          )}
        </nav>
      </header>

            <main className="flex-1">
        {/* HERO SECTION - GIÁO VIÊN AI TOÀN NĂNG */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#081329] via-[#0E1E38] to-[#122B4F] text-white pt-10 pb-14 sm:pt-14 sm:pb-20 border-b border-blue-900/40">
          {/* Ambient Lighting Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-indigo-500/20 to-teal-400/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 -left-24 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

          {/* Grid pattern overlay */}
          <div 
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '28px 28px'
            }}
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Version 3.0 Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-teal-500/20 border border-blue-400/40 text-blue-200 text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-500/10 mb-5">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>HỆ SINH THÁI GIÁO VIÊN AI TOÀN NĂNG • BẢN CHÍNH THỨC 2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight max-w-4xl mx-auto">
              Đột Phá Giảng Dạy & Quản Lý Với{' '}
              <span className="bg-gradient-to-r from-amber-300 via-rose-400 to-cyan-400 bg-clip-text text-transparent">
                Giáo Viên AI Toàn Năng
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
              Trọn bộ 17 siêu công cụ trí tuệ nhân tạo chuyên sâu dành cho giáo viên: Tạo đề 8 môn THCS chuẩn CV 7991, Chuẩn hóa văn bản hành chính NĐ 30, Soạn giáo án 5512, Luyện nghe tiếng Anh, Quay video bài giảng và tối ưu máy tính.
            </p>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mt-8 sm:mt-10">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xl sm:text-2xl">
                  <span>17+</span>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs text-slate-300 font-medium mt-1">Siêu Công Cụ AI Thực Chiến</div>
              </div>
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xl sm:text-2xl">
                  <span>100%</span>
                  <FileText className="w-4 h-4" />
                </div>
                <div className="text-xs text-slate-300 font-medium mt-1">Chuẩn CV 7991, 5512 & NĐ 30</div>
              </div>
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xl sm:text-2xl">
                  <span>1-Click</span>
                  <Layers className="w-4 h-4" />
                </div>
                <div className="text-xs text-slate-300 font-medium mt-1">Add-in Word & Bản PC Cài Đặt</div>
              </div>
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2 text-rose-400 font-extrabold text-xl sm:text-2xl">
                  <span>24/7</span>
                  <Crown className="w-4 h-4" />
                </div>
                <div className="text-xs text-slate-300 font-medium mt-1">Bản Quyền Đám Mây An Toàn</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <a
                href="#apps"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-blue-600/30 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95"
              >
                <span>Khám Phá 17 Công Cụ Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => setShowAdminDashboard(true)}
                className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm sm:text-base border border-white/20 backdrop-blur-md flex items-center gap-2 transition-all hover:border-amber-400/50"
              >
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Quản Trị Bản Quyền Cloud</span>
              </button>

              <a
                href={BRAND.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-2xl bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/40 font-bold text-sm sm:text-base flex items-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-teal-400" />
                <span>Zalo Hỗ Trợ: {BRAND.phone}</span>
              </a>
            </div>
          </div>
        </section>
        {/* APPS SECTION (PRIMARY SHOWCASE) */}
        <section id="apps" className="pt-6 pb-16 sm:pt-8 sm:pb-20 bg-[#F6F8FC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* SECTION HEADER & SEARCH / FILTER PANEL */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 mb-8 transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-slate-100">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Hệ Thống Ứng Dụng AI Giáo Dục
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#123A63] tracking-tight">
                    Kho Công Cụ AI Thực Chiến
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl font-normal leading-relaxed">
                    Tuyển tập các công cụ AI thiết thực hỗ trợ giáo viên soạn bài, tạo đề thi ma trận, chuẩn hóa văn bản, bài nghe tiếng Anh và đổi mới phương pháp giảng dạy.
                  </p>
                </div>

                {/* SEARCH BAR */}
                <div className="w-full lg:w-80 shrink-0">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm công cụ (Đề thi, SKKN, Nghe...)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-50 border border-slate-200/90 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-all shadow-inner"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60"
                        title="Xóa tìm kiếm"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* CATEGORY FILTER TABS & APP COUNTER */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {activeApps.length > 0 && categories.length > 1 && (
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    {categories.map((cat) => {
                      const count = categoryCounts[cat] || 0;
                      const isSelected = selectedCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-[#123A63] text-white shadow-sm ring-2 ring-[#123A63]/20'
                              : 'bg-slate-100 hover:bg-slate-200/70 text-slate-700 border border-slate-200/80 hover:text-[#123A63]'
                          }`}
                        >
                          <span>{cat}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-white text-slate-500 border border-slate-200'
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="text-xs text-slate-500 font-medium shrink-0 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>Hiển thị <strong className="text-slate-800 font-bold">{filteredApps.length}</strong> / {activeApps.length} ứng dụng</span>
                </div>
              </div>
            </div>

            {/* EMPTY STATE */}
            {filteredApps.length === 0 ? (
              <div className="max-w-md mx-auto py-16 px-6 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-[#123A63] mb-1">
                  Không tìm thấy ứng dụng phù hợp
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm">
                  Không có công cụ nào khớp với từ khóa "{searchQuery}". Thầy/Cô vui lòng thử từ khóa khác.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Tất cả');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2563EB] font-bold text-xs transition-all inline-flex items-center gap-1.5"
                >
                  Đặt lại bộ lọc
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

        {/* ABOUT AUTHOR SECTION */}
        <section id="about" className="py-16 sm:py-24 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[#2563EB] font-bold text-xs sm:text-sm uppercase tracking-wider block mb-1">
                Giới thiệu tác giả
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123A63]">
                {BRAND.about.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Photo Column */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-md">
                  {/* Laptop / Computer style Frame */}
                  <div className="bg-slate-900 p-2.5 rounded-2xl shadow-2xl border border-slate-700">
                    {/* Screen Header Dots */}
                    <div className="flex items-center gap-1.5 px-2 pb-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                      <span className="ml-2 text-[10px] text-slate-400 font-mono">dinhvanthanh.jpg</span>
                    </div>
                    {/* Photo Container */}
                    <div className="relative aspect-[4/5] bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
                      {!imgError ? (
                        <img
                          src="/dinhvanthanh.jpg"
                          alt={BRAND.about.photoAlt}
                          onError={() => setImgError(true)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-[#123A63] text-white">
                          <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-3xl font-extrabold mb-2 border-2 border-white/20">
                            ĐT
                          </div>
                          <span className="text-sm font-semibold text-blue-100">{BRAND.author}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Content Column */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-4 text-slate-700 text-base leading-relaxed">
                  <p className="text-lg font-bold text-[#123A63]">
                    {BRAND.about.greeting}
                  </p>
                  <p>{BRAND.about.paragraph1}</p>
                  <p>{BRAND.about.paragraph2}</p>
                  <p>{BRAND.about.paragraph3}</p>
                </div>

                {/* Quote Card */}
                <div className="p-5 rounded-xl bg-blue-50/60 border-l-4 border-[#2563EB] space-y-2">
                  <div className="flex gap-3">
                    <Quote className="w-6 h-6 text-[#2563EB] shrink-0 mt-0.5" />
                    <p className="italic font-medium text-slate-800 text-base">
                      {BRAND.about.quote}
                    </p>
                  </div>
                </div>

                {/* Contact Detail Cards */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium">
                  <div className="p-4 rounded-xl bg-[#F6F8FC] border border-slate-200 flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-[#123A63] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-[#123A63]">{BRAND.author}</div>
                      <div className="text-slate-600 text-xs mt-0.5">{BRAND.job}</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F6F8FC] border border-slate-200 flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-[#0D9488] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-[#123A63]">{BRAND.organization}</div>
                      <div className="text-slate-600 text-xs mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {BRAND.address}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <a
                    href={BRAND.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold transition-colors flex items-center gap-2 shadow-xs"
                  >
                    <Share2 className="w-4 h-4" />
                    Facebook
                  </a>
                  <a
                    href={BRAND.zaloUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-[#0D9488] hover:bg-teal-700 text-white text-sm font-semibold transition-colors flex items-center gap-2 shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Zalo: {BRAND.phone}
                  </a>
                  <a
                    href={`tel:${BRAND.phoneRaw}`}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-colors flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-slate-600" />
                    Gọi điện
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-16 sm:py-20 bg-[#F6F8FC]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10 space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#123A63]">
                  Thông tin Liên hệ & Hỗ trợ
                </h2>
                <p className="text-slate-600 text-sm sm:text-base">
                  Quý thầy cô cần hỗ trợ giải đáp thắc mắc hoặc tư vấn công cụ AI, vui lòng kết nối qua các kênh dưới đây.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-blue-50/50 border border-blue-100 space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-[#2563EB] text-white flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#123A63] text-base">Zalo & Điện thoại</h3>
                    <p className="text-slate-600 text-sm mt-1">Liên hệ trực tiếp thầy Đinh Văn Thành</p>
                    <a
                      href={BRAND.zaloUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#2563EB] font-bold text-base mt-2 hover:underline"
                    >
                      {BRAND.phone}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-teal-50/50 border border-teal-100 space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0D9488] text-white flex items-center justify-center">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#123A63] text-base">Trang Facebook</h3>
                    <p className="text-slate-600 text-sm mt-1">Cập nhật tin tức và chia sẻ kinh nghiệm AI</p>
                    <a
                      href={BRAND.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#0D9488] font-bold text-base mt-2 hover:underline"
                    >
                      Ghé thăm Facebook
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#123A63] text-white py-12 border-t border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-8 border-b border-blue-800/60">
            <div className="space-y-2 max-w-md">
              <h2 className="text-xl font-extrabold tracking-tight text-white">
                {BRAND.websiteTitle}
              </h2>
              <p className="text-blue-200 text-sm leading-relaxed">
                Hệ sinh thái công cụ AI thiết thực dành cho giáo viên Việt Nam.
              </p>
            </div>

            <div className="space-y-1.5 text-sm text-blue-100">
              <p className="font-bold text-white text-base">{BRAND.author}</p>
              <p>{BRAND.job} – {BRAND.organization}</p>
              <p>Tel/Zalo: <a href={BRAND.zaloUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">{BRAND.phone}</a></p>
              <p>
                <a 
                  href={BRAND.facebookUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-300 hover:text-white underline font-medium"
                >
                  Kết nối Facebook
                </a>
              </p>
            </div>
          </div>

          <div className="pt-6 text-center text-xs text-blue-300 font-medium">
            <p>{BRAND.copyright}</p>
            <div className="mt-2">
              <button
                onClick={() => setShowAdminDashboard(true)}
                className="text-[11px] text-blue-300 hover:text-white underline inline-flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity"
              >
                <Crown className="w-3 h-3 text-amber-400" />
                Cổng Quản trị Bản quyền Online (Admin Thầy Thành)
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

      {/* HỆ THỐNG PHẦN MỀM TẠO ĐỀ KIỂM TRA THCS (8 MÔN) (3 TABS) */}
      <TaoDeTHCS8MonModal
        isOpen={showTaoDeTHCS8MonModal}
        onClose={closeAllModals}
        initialSubject={thcs8MonSelectedSubject}
        onOpenAdmin={() => setShowAdminDashboard(true)}
      />

      {/* CLOUD ADMIN DASHBOARD 24/7 */}
      <AdminDashboard
        isOpen={showAdminDashboard}
        onClose={closeAllModals}
      />

            {/* CẢNH BÁO KHI MÁY TÍNH BỊ ADMIN XÓA / KHÓA TRUY CẬP */}
      {isCurrentBlocked && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border-2 border-rose-500/80 rounded-3xl p-6 text-center shadow-2xl shadow-rose-500/20 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-white">THIẾT BỊ ĐÃ BỊ VÔ HIỆU HÓA</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tài khoản / Thiết bị này đã bị Quản trị viên xóa hoặc tạm thời vô hiệu hóa quyền truy cập theo chính sách hệ thống.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-400">
              Mã thiết bị: <strong>{activityTrackingService.getOrCreateMachineId()}</strong>
            </div>
            <p className="text-xs text-slate-400">
              Vui lòng liên hệ trực tiếp Thầy giáo <strong>Đinh Văn Thành</strong> để được xem xét mở khóa:
            </p>
            <a
              href={`https://zalo.me/${BRAND.phoneRaw}?text=Thay%20Thanh%20oi,%20may%20toi%20ma%20${activityTrackingService.getOrCreateMachineId()}%20bi%20khoa,%20nho%20Thay%20ho%20tro%20mo%20khoa%20giup%20toi!`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 rounded-xl bg-[#0068FF] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <ExternalLink className="w-4 h-4" />
              Nhắn Zalo Thầy Thành ({BRAND.phone})
            </a>
          </div>
        </div>
      )}

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
