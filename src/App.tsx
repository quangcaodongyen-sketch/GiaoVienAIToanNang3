import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { BRAND } from './config/brand';
import { apps, AppCard } from './data/apps';

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [showSKKNModal, setShowSKKNModal] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [appImgErrors, setAppImgErrors] = useState<Record<string, boolean>>({});

  // Filter only active apps
  const activeApps = apps
    .filter((app) => app.active)
    .sort((a, b) => a.order - b.order);

  // Categories based ONLY on activeApps
  const categories = ['Tất cả', ...Array.from(new Set(activeApps.map((app) => app.category)))];

  const filteredApps = selectedCategory === 'Tất cả'
    ? activeApps
    : activeApps.filter((app) => app.category === selectedCategory);

  const handleAppClick = (app: AppCard, e: React.MouseEvent) => {
    if (app.id === 'viet-skkn') {
      e.preventDefault();
      setShowSKKNModal(true);
    }
  };

  const handleAppImgError = (appId: string) => {
    setAppImgErrors((prev) => ({ ...prev, [appId]: true }));
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] text-[#172033] flex flex-col font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo & Brand Name */}
            <a href="#hero" className="flex items-center gap-3 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#123A63] to-[#2563EB] flex items-center justify-center text-white shadow-md shadow-blue-900/10 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#123A63]">
                  {BRAND.websiteTitle}
                </h1>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  {BRAND.slogan}
                </p>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 font-medium text-slate-700 text-sm">
              <a href="#hero" className="hover:text-[#2563EB] transition-colors">Trang chủ</a>
              <a href="#apps" className="hover:text-[#2563EB] transition-colors">Ứng dụng</a>
              <a href="#about" className="hover:text-[#2563EB] transition-colors">Về tác giả</a>
              <a href="#contact" className="hover:text-[#2563EB] transition-colors">Liên hệ</a>
              <a 
                href="#contact" 
                className="px-4 py-2 rounded-lg bg-[#123A63] text-white hover:bg-[#2563EB] transition-colors text-sm font-semibold shadow-sm"
              >
                Hỗ trợ ngay
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation Drawer */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-100 flex flex-col gap-3 font-medium text-slate-700 text-sm">
              <a 
                href="#hero" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Trang chủ
              </a>
              <a 
                href="#apps" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Ứng dụng
              </a>
              <a 
                href="#about" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Về tác giả
              </a>
              <a 
                href="#contact" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Liên hệ
              </a>
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <a
                  href={BRAND.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center px-4 py-2.5 rounded-lg bg-[#0D9488] text-white font-semibold"
                >
                  Chat Zalo: {BRAND.phone}
                </a>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section id="hero" className="relative py-16 sm:py-24 bg-white border-b border-slate-200/80 overflow-hidden">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-[#2563EB] text-xs sm:text-sm font-semibold tracking-wide shadow-xs">
                <Sparkles className="w-4 h-4" />
                <span>{BRAND.hero.subtitle}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#123A63] tracking-tight leading-tight">
                {BRAND.hero.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                {BRAND.hero.description}
              </p>

              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <a
                  href="#apps"
                  className="px-6 py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm sm:text-base shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
                >
                  <BookOpen className="w-5 h-5" />
                  Khám phá ứng dụng
                </a>
                <a
                  href="#about"
                  className="px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm sm:text-base transition-all flex items-center gap-2"
                >
                  <UserCheck className="w-5 h-5 text-slate-600" />
                  Về tác giả
                </a>
                <a
                  href="#contact"
                  className="px-6 py-3.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-sm sm:text-base shadow-xs transition-all flex items-center gap-2"
                >
                  <Phone className="w-5 h-5 text-[#0D9488]" />
                  Liên hệ hỗ trợ
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* APPS SECTION */}
        <section id="apps" className="py-16 sm:py-20 bg-[#F6F8FC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-[#0D9488] font-bold text-xs sm:text-sm uppercase tracking-wider block mb-1">
                  Danh mục công cụ
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#123A63]">
                  Hệ thống Ứng dụng AI
                </h2>
              </div>

              {/* Category filter tabs if activeApps exist */}
              {activeApps.length > 0 && categories.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                        selectedCategory === cat
                          ? 'bg-[#123A63] text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Empty State when no active apps */}
            {activeApps.length === 0 ? (
              <div className="max-w-2xl mx-auto py-16 px-6 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-[#F59E0B]">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#123A63] mb-2">
                  Thông báo cập nhật
                </h3>
                <p className="text-slate-600 text-base font-medium">
                  Các công cụ đang được rà soát và cập nhật. Vui lòng quay lại sau.
                </p>
              </div>
            ) : (
              /* Active Apps Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredApps.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
                  >
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      {!appImgErrors[app.id] ? (
                        <img
                          src={app.image}
                          alt={app.title}
                          onError={() => handleAppImgError(app.id)}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                          <Layers className="w-12 h-12 mb-2" />
                          <span className="text-xs font-semibold">GV AI TOÀN NĂNG</span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#123A63]/90 text-white backdrop-blur-xs">
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
                        <h3 className="text-lg font-bold text-[#123A63] line-clamp-1">
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
                        className="w-full py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
                      >
                        Truy cập ứng dụng
                        <ExternalLink className="w-4 h-4" />
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
    </div>
  );
}
