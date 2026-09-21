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
  Search
} from 'lucide-react';
import { BRAND } from './config/brand';
import { apps, AppCard } from './data/apps';
import { AdminDashboard } from './components/AdminDashboard';
import { OnlineTTSModal } from './components/OnlineTTSModal';
import { NLSAIModal } from './components/NLSAIModal';
import { TaoDeTiengAnhModal } from './components/TaoDeTiengAnhModal';
import { SinhDeBienTheModal } from './components/SinhDeBienTheModal';
import { ScreenRecordModal } from './components/ScreenRecordModal';
import { CleanerModal } from './components/CleanerModal';
import { ChuanHoaVBModal } from './components/ChuanHoaVBModal';
import { TachGopPDFModal } from './components/TachGopPDFModal';

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
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [appImgErrors, setAppImgErrors] = useState<Record<string, boolean>>({});

  // Lắng nghe URL hash để mở modal tương ứng khi người dùng truy cập link trực tiếp
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#tao-de-tieng-anh') setShowTaoDeModal(true);
      else if (hash === '#sinh-de-bien-the') setShowSinhDeBienTheModal(true);
      else if (hash === '#screen-record') setShowScreenRecordModal(true);
      else if (hash === '#cleaner-pro' || hash === '#cleaner') setShowCleanerModal(true);
      else if (hash === '#chuan-hoa-vb' || hash === '#chuanhoavanban') setShowChuanHoaVBModal(true);
      else if (hash === '#tach-gop-pdf' || hash === '#pdf-suite') setShowTachGopPDFModal(true);
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
            <a
              href={BRAND.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1 text-blue-200 hover:text-white transition-colors"
            >
              <Share2 className="w-3 h-3" />
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
                  <h1 className="text-base sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-[#0f2b48] via-[#123A63] to-[#2563EB] bg-clip-text text-transparent">
                    {BRAND.websiteTitle}
                  </h1>
                  <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
                    AI 4.0
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
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#123A63]/90 text-white backdrop-blur-xs shadow-xs">
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
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#123A63] to-[#2563EB] hover:from-[#0d2847] hover:to-blue-600 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-xs group-hover:shadow-md"
                      >
                        Truy cập ứng dụng
                        <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
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
        onClose={() => setShowListeningModal(false)}
      />

      {/* TÍCH HỢP NLS - AI THCS (ADD-INS V2) MODAL (3 TABS) */}
      <NLSAIModal
        isOpen={showNLSAIModal}
        onClose={() => setShowNLSAIModal(false)}
        onOpenAdmin={() => setShowAdminDashboard(true)}
      />

      {/* TẠO ĐỀ KIỂM TRA TIẾNG ANH GLOBAL SUCCESS (CV 7991) MODAL (3 TABS) */}
      <TaoDeTiengAnhModal
        isOpen={showTaoDeModal}
        onClose={() => setShowTaoDeModal(false)}
        onOpenAdmin={() => setShowAdminDashboard(true)}
      />

      {/* SINH 3 ĐỀ BIẾN THỂ VIP (V1) MODAL (3 TABS) */}
      <SinhDeBienTheModal
        isOpen={showSinhDeBienTheModal}
        onClose={() => setShowSinhDeBienTheModal(false)}
        onOpenAdmin={() => setShowAdminDashboard(true)}
      />

      {/* SCREEN RECORD PRO V2 (3 TABS) */}
      <ScreenRecordModal
        isOpen={showScreenRecordModal}
        onClose={() => setShowScreenRecordModal(false)}
        onOpenAdmin={() => setShowAdminDashboard(true)}
      />

      {/* ĐINH THÀNH CLEANER PRO v4.5 VIP (3 TABS) */}
      <CleanerModal
        isOpen={showCleanerModal}
        onClose={() => setShowCleanerModal(false)}
        onOpenAdmin={() => setShowAdminDashboard(true)}
      />

      {/* CHUẨN HÓA VĂN BẢN HÀNH CHÍNH AI (NGHỊ ĐỊNH 30/2020) (3 TABS) */}
      <ChuanHoaVBModal
        isOpen={showChuanHoaVBModal}
        onClose={() => setShowChuanHoaVBModal(false)}
        onOpenAdmin={() => setShowAdminDashboard(true)}
      />

      {/* PDF SUITE PRO (TÁCH - GỘP - LỌC TRANG TRẮNG AI) (3 TABS) */}
      <TachGopPDFModal
        isOpen={showTachGopPDFModal}
        onClose={() => setShowTachGopPDFModal(false)}
        onOpenAdmin={() => setShowAdminDashboard(true)}
      />

      {/* CLOUD ADMIN DASHBOARD 24/7 */}
      <AdminDashboard
        isOpen={showAdminDashboard}
        onClose={() => setShowAdminDashboard(false)}
      />
    </div>
  );
}
