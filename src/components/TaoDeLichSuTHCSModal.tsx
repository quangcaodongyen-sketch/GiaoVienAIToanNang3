import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Key,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  Laptop,
  Check,
  Play,
  RefreshCw,
  MessageCircle,
  Sparkles,
  FileText,
  Table,
  ListChecks,
  CheckSquare,
  Lock,
  SlidersHorizontal,
  GraduationCap,
  Crown,
  BookOpen,
  Award,
  AlertTriangle
} from 'lucide-react';
import { BRAND, EXAM_LICHSU_THCS_RESOURCES } from '../config/brand';
import { cloudSyncService } from '../services/cloudSyncService';
import { webSecurityGuard } from '../services/webSecurityGuard';
import {
  getTHCS8MonExamSuite,
  downloadTHCS8MonWordDoc,
  THCS8MonExamData
} from '../services/thcs8MonWordExportService';
import {
  getOrCreateLSTHCSHardwareCode,
  getSecureLSTHCSTrialRemaining,
  consumeLSTHCSTrialTurn,
  isLSTHCSProActivated,
  saveLSTHCSActiveKey,
  verifyLSTHCSLicenseKey,
  PRODUCT_NAME,
  APP_TAG
} from '../services/taodeLichSuTHCSKeyService';
import { ShareLinkBar } from './ShareLinkBar';
import { syncBrowserHash } from '../utils/shareUtils';

interface TaoDeLichSuTHCSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

export const TaoDeLichSuTHCSModal: React.FC<TaoDeLichSuTHCSModalProps> = ({
  isOpen,
  onClose,
  onOpenAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'download' | 'license'>('download');
  const [grade, setGrade] = useState<'6' | '7' | '8' | '9'>('8');
  const [termCode, setTermCode] = useState<'GK1' | 'CK1' | 'GK2' | 'CK2'>('GK1');
  const [examCode, setExamCode] = useState('801');
  const [examData, setExamData] = useState<THCS8MonExamData | null>(null);

  // Bản quyền & Dùng thử 5 lượt
  const [trialsRemaining, setTrialsRemaining] = useState<number>(5);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [hardwareCode, setHardwareCode] = useState<string>('');
  const [licenseKeyInput, setLicenseKeyInput] = useState<string>('');
  const [activationMsg, setActivationMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedHw, setCopiedHw] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showExpiredNotice, setShowExpiredNotice] = useState(false);

  // Form đăng ký Cloud
  const [regName, setRegName] = useState('');
  const [regSchool, setRegSchool] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPackage, setRegPackage] = useState<'1YEAR' | '2YEAR' | 'LIFETIME'>('LIFETIME');
  const [isSubmittingCloud, setIsSubmittingCloud] = useState(false);
  const [cloudSuccess, setCloudSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      syncBrowserHash('#tao-de-lichsu');
      webSecurityGuard.setActiveApp('tao-de-lichsu-thcs', PRODUCT_NAME);
      const hw = getOrCreateLSTHCSHardwareCode();
      setHardwareCode(hw);
      const pro = isLSTHCSProActivated();
      setIsPro(pro);

      getSecureLSTHCSTrialRemaining().then(rem => {
        setTrialsRemaining(rem);
        if (!pro && rem <= 0) {
          setShowExpiredNotice(true);
        }
      });
      // Không tự động nạp trước đề mẫu để bảo vệ tác quyền
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGenerateExam = async () => {
    alert(`⚠️ TÍNH NĂNG TẠO ĐỀ LỊCH SỬ THCS ĐÃ CHUYỂN SANG PHẦN MỀM PC MÁY TÍNH\n\nĐể xuất file Word chuẩn mực 100% không lỗi font và nhận các bản vá lỗi mới nhất của Tác giả Đinh Thành, Quý Thầy/Cô vui lòng TẢI BỘ CÀI VỀ MÁY TÍNH (file .exe / .zip) tại Tab 1.`);
    setActiveTab('download');
    return;
  };

  const handleExportWord = async () => {
    if (!examData) return;
    if (!isPro && trialsRemaining <= 0) {
      setShowExpiredNotice(true);
      setActiveTab('license');
      return;
    }

    setIsExporting(true);
    try {
      if (!isPro) {
        const { success, remaining } = await consumeLSTHCSTrialTurn();
        if (!success) {
          setShowExpiredNotice(true);
          setActiveTab('license');
          setIsExporting(false);
          return;
        }
        setTrialsRemaining(remaining);
      }
      await downloadTHCS8MonWordDoc(examData, `De_LichSu_${grade}_${termCode}.doc`, isPro);
    } catch (err) {
      console.error(err);
      alert('Không thể xuất file Word. Vui lòng thử lại!');
    } finally {
      setIsExporting(false);
    }
  };

  const handleActivate = async () => {
    if (!licenseKeyInput.trim()) {
      setActivationMsg({ text: 'Vui lòng nhập mã kích hoạt bản quyền!', isError: true });
      return;
    }

    const res = await verifyLSTHCSLicenseKey(licenseKeyInput, hardwareCode);
    if (res.isValid) {
      saveLSTHCSActiveKey(licenseKeyInput);
      setIsPro(true);
      setTrialsRemaining(999);
      setActivationMsg({ text: res.message, isError: false });
    } else {
      setActivationMsg({ text: res.message, isError: true });
    }
  };

  const handleSubmitCloud = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) {
      alert('Vui lòng nhập Họ tên và Số điện thoại / Zalo để nhận mã bản quyền!');
      return;
    }

    setIsSubmittingCloud(true);
    try {
      await cloudSyncService.submitRegistrationRequest({
        machineId: hardwareCode,
        fullName: regName,
        schoolUnit: regSchool || 'Trường THCS',
        phoneNumber: regPhone,
        appId: 'taode_lichsu_thcs',
        appName: 'Tạo Đề Lịch Sử THCS Kết Nối Tri Thức (CV 7991)',
        packageType: regPackage
      });
      setCloudSuccess(true);
    } catch (err) {
      alert('Có lỗi xảy ra khi gửi đơn đăng ký. Vui lòng kết nối Zalo trực tiếp với Thầy Thành: 0915.213717');
    } finally {
      setIsSubmittingCloud(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* HEADER MODAL */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 text-2xl font-bold">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                  TẠO ĐỀ LỊCH SỬ THCS (CV 7991)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {isPro ? 'BẢN QUYỀN PRO' : 'DÙNG THỬ SƯ PHẠM'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Bám sát SGK Kết nối tri thức với cuộc sống (Lớp 6, 7, 8, 9) • Tác giả: Tác giả Đinh Thành - ĐT: 0915.213717 (THCS Đồng Yên)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ShareLinkBar 
              appUrl="#tao-de-lichsu" 
              appName="Tạo Đề Lịch Sử THCS" 
              compact={true} 
            />
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all"
              >
                <Crown className="w-3.5 h-3.5" />
                Quản Trị Admin
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* THANH LINK GỬI KHÁCH HÀNG (TRỰC QUAN - COPY 1 CHẠM GỬI ZALO) */}
        <ShareLinkBar 
          appUrl="#tao-de-lichsu" 
          appName="Tạo Đề Lịch Sử THCS (CV 7991)" 
        />

        <div className="flex border-b border-slate-800 bg-slate-900/90 px-6">
          <button
            onClick={() => setActiveTab('download')}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'download'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Download className="w-4 h-4" />
            1. Tải Về & Hướng Dẫn (.exe / .zip Pass: 123)
          </button>

          <button
            onClick={() => setActiveTab('license')}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'license'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Key className="w-4 h-4" />
            2. Bản Quyền & Kích Hoạt
            {isPro && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">
                PRO ACTIVE
              </span>
            )}
          </button>
        </div>

        {/* THÔNG BÁO HẾT LƯỢT DÙNG THỬ NẾU CÓ */}
        {showExpiredNotice && !isPro && (
          <div className="bg-rose-500/15 border-b border-rose-500/30 px-6 py-2.5 flex items-center justify-between text-xs text-rose-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>
                Thầy/Cô đã dùng hết <strong>5 lượt trải nghiệm miễn phí</strong> trên thiết bị này. Kính mời Quý Thầy/Cô đăng ký kích hoạt bản quyền Pro để tiếp tục sử dụng không giới hạn!
              </span>
            </div>
            <button
              onClick={() => setActiveTab('license')}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-bold transition-all ml-3 flex-shrink-0"
            >
              Kích Hoạt Ngay
            </button>
          </div>
        )}

        {/* NỘI DUNG TỪNG TAB */}
        <div className="flex-1 overflow-y-auto p-6">
          
          
              {/* BỘ LỌC CẤU HÌNH ĐỀ KIỂM TRA */}
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Cấu Hình Đề Kiểm Tra Lịch Sử THCS
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Chọn Lớp */}
                  <div>
                    <label className="block text-xs text-slate-300 font-semibold mb-1.5">
                      Khối Lớp (Kết nối tri thức):
                    </label>
                    <select
                      value={grade}
                      onChange={e => setGrade(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="6">Lớp 6 - Lịch Sử 6 KNTT</option>
                      <option value="7">Lớp 7 - Lịch Sử 7 KNTT</option>
                      <option value="8">Lớp 8 - Lịch Sử 8 KNTT</option>
                      <option value="9">Lớp 9 - Lịch Sử 9 KNTT</option>
                    </select>
                  </div>

                  {/* Chọn Kỳ */}
                  <div>
                    <label className="block text-xs text-slate-300 font-semibold mb-1.5">
                      Kỳ kiểm tra định kỳ:
                    </label>
                    <select
                      value={termCode}
                      onChange={e => setTermCode(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="GK1">Kiểm tra Giữa Học kỳ I</option>
                      <option value="CK1">Kiểm tra Cuối Học kỳ I</option>
                      <option value="GK2">Kiểm tra Giữa Học kỳ II</option>
                      <option value="CK2">Kiểm tra Cuối Học kỳ II</option>
                    </select>
                  </div>

                  {/* Mã đề */}
                  <div>
                    <label className="block text-xs text-slate-300 font-semibold mb-1.5">
                      Mã đề thi (Gợi ý 3 chữ số):
                    </label>
                    <input
                      type="text"
                      value={examCode}
                      onChange={e => setExamCode(e.target.value)}
                      placeholder="VD: 801, 802..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-700/50">
                  <div className="text-xs text-slate-400">
                    Cấu trúc chuẩn CV 7991: <strong>12 câu TN (3.0đ)</strong> + <strong>4 câu Đúng/Sai tư liệu (4.0đ)</strong> + <strong>2 câu Tự luận (3.0đ)</strong>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleGenerateExam}
                      disabled={!isPro && trialsRemaining <= 0}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 rounded-xl text-sm font-black shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      🚀 BẤM TẠO ĐỀ LỊCH SỬ THCS ({isPro ? 'Bản Quyền Pro' : `Còn ${trialsRemaining}/3 lượt`})
                    </button>

                    {examData && (
                      <button
                        onClick={handleExportWord}
                        disabled={isExporting || (!isPro && trialsRemaining <= 0)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        {isExporting ? 'Đang xuất Word...' : 'Tải File Word (.doc)'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* MÀN HÌNH CHỜ KHI CHƯA BẤM TẠO ĐỀ */}
              {!examData && (
                <div className="p-8 rounded-2xl bg-slate-900/60 border border-dashed border-slate-700 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Chưa tạo đề kiểm tra Lịch Sử THCS</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    Hệ thống không cung cấp sẵn đề mẫu để copy dùng luôn mà không nuôi app. Quý Thầy/Cô vui lòng bấm nút 
                    <strong className="text-amber-400"> "🚀 BẤM TẠO ĐỀ LỊCH SỬ THCS"</strong> ở trên để hệ thống tự động sinh 01 đề hoàn chỉnh (Dùng thử 3 lần, xem 1/2 đáp án).
                  </p>
                </div>
              )}

              {/* KHUNG XEM TRƯỚC SƯ PHẠM CHUẨN TIMES NEW ROMAN 13PT */}
              {examData && (
                <div className="bg-white text-slate-900 rounded-xl p-6 shadow-xl border border-slate-300 font-['Times_New_Roman',serif] text-[13pt] leading-relaxed">
                  
                  {/* QUỐC HIỆU TIÊU NGỮ & BẢNG HEADER */}
                  <div className="grid grid-cols-2 gap-4 pb-4 border-b border-black text-center text-xs sm:text-sm font-bold uppercase mb-4">
                    <div>
                      <div>{examData.parentAgency}</div>
                      <div>{examData.schoolName}</div>
                      <div className="font-normal normal-case mt-1 italic">ĐỀ KIỂM TRA CHÍNH THỨC</div>
                    </div>
                    <div>
                      <div>ĐỀ KIỂM TRA {examData.termTitle.toUpperCase()}</div>
                      <div>MÔN: LỊCH SỬ {examData.grade} - NĂM HỌC {examData.schoolYear}</div>
                      <div className="font-normal normal-case mt-1 italic">Thời gian làm bài: {examData.timeMinutes} phút (Không kể giao đề)</div>
                      <div className="font-bold text-amber-700 normal-case mt-0.5">Mã đề: {examData.examCode}</div>
                    </div>
                  </div>

                  {/* BẢNG ĐIỂM GIÁO VIÊN */}
                  <div className="mb-4 border border-black text-xs sm:text-sm">
                    <div className="grid grid-cols-2 text-center font-bold border-b border-black bg-slate-100">
                      <div className="py-1 border-r border-black">ĐIỂM</div>
                      <div className="py-1">NHẬN XÉT CỦA GIÁO VIÊN</div>
                    </div>
                    <div className="grid grid-cols-2 h-16 text-center">
                      <div className="border-r border-black flex items-center justify-center text-slate-400 italic">
                        Bằng số: ....... Bằng chữ: .......
                      </div>
                      <div className="p-2 text-left text-slate-400 italic">
                        ...........................................................................
                      </div>
                    </div>
                  </div>

                  {/* NỘI DUNG CÁC PHẦN ĐỀ THI */}
                  {examData.parts.map((p, pIdx) => (
                    <div key={pIdx} className="mb-6">
                      <div className="font-bold text-base uppercase text-blue-900 mb-2">
                        {p.title} ({p.points})
                      </div>
                      {p.instruction && (
                        <div className="italic text-xs text-slate-600 mb-3">{p.instruction}</div>
                      )}
                      {p.passage && (
                        <div className="bg-amber-50/80 border-l-4 border-amber-500 p-3 mb-3 text-xs italic text-slate-800 rounded-r">
                          {p.passage}
                        </div>
                      )}

                      <div className="space-y-3">
                        {p.questions.map((q, qIdx) => (
                          <div key={qIdx} className="pl-2">
                            <div className="font-semibold">
                              <span className="font-bold text-slate-900">
                                {typeof q.num === 'number' ? `Câu ${q.num}. ` : `${q.num}. `}
                              </span>
                              {q.content}
                            </div>
                            {q.options && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pl-4 text-xs">
                                {q.options.map((opt, optIdx) => (
                                  <div
                                    key={optIdx}
                                    className={`p-1.5 rounded border ${
                                      opt.includes('(Đúng)') || opt.includes(q.correctKey || '')
                                        ? 'bg-red-50 text-[#FF0000] border-red-200 font-bold'
                                        : 'bg-slate-50 text-slate-800 border-slate-200'
                                    }`}
                                  >
                                    {opt}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* MA TRẬN 16 CỘT & BẢN ĐẶC TẢ */}
                  <div className="mt-8 pt-4 border-t-2 border-black">
                    <div className="font-bold text-sm uppercase text-slate-900 mb-2 flex items-center gap-2">
                      <Table className="w-4 h-4 text-amber-700" />
                      MA TRẬN ĐỀ KIỂM TRA MÔN LỊCH SỬ {examData.grade} (CV 7991/BGDĐT)
                    </div>
                    <div className="overflow-x-auto text-[10pt]">
                      <table className="w-full border-collapse border border-black text-center">
                        <thead>
                          <tr className="bg-slate-200 font-bold">
                            {examData.matrix.headers.map((h, hIdx) => (
                              <th key={hIdx} className="border border-black p-1 text-xs">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {examData.matrix.rows.map((r, rIdx) => (
                            <tr key={rIdx} className={r[0] === 'TỔNG ĐIỂM' ? 'font-bold bg-amber-100' : ''}>
                              {r.map((cell, cIdx) => (
                                <td key={cIdx} className="border border-black p-1 text-xs">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ===================== TAB 2: TẢI VỀ & HƯỚNG DẪN ===================== */}
          {activeTab === 'download' && (
            <div className="space-y-6">
              
              {/* THÔNG TIN XÁC NHẬN BẢN CẬP NHẬT MỚI NHẤT & THỜI GIAN ĐƯA LÊN WEB */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-950 to-cyan-950/80 border border-emerald-500/50 text-slate-200 text-xs space-y-1.5 shadow-lg">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 font-black text-emerald-400 text-xs uppercase tracking-wide">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>XÁC NHẬN PHIÊN BẢN MỚI NHẤT ĐÃ CẬP NHẬT LÊN WEB DEKIEMTRASO.COM</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-md font-mono text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Phiên bản v3.8.2 (Mới nhất)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-300 font-medium pt-1 border-t border-emerald-500/20 font-mono">
                  <div>🕒 <strong>Đưa lên Web lúc:</strong> <span className="text-amber-300 font-bold">09/10/2026 (Lúc 23:45:00)</span></div>
                  <div>📦 <strong>Bộ cài PC chuẩn:</strong> <span className="text-cyan-300 font-bold">File .exe sạch mới 100% (91 MB)</span></div>
                  <div>✨ <strong>Trạng thái:</strong> <span className="text-emerald-300 font-bold">Đã cập nhật giao diện mới nhất</span></div>
                </div>
              </div>

              {/* VIDEO HƯỚNG DẪN */}
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
                <div className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Play className="w-4 h-4 text-amber-400" />
                  Video Hướng Dẫn Sử Dụng & Tích Hợp Microsoft Word Ribbon
                </div>
                <div className="aspect-video w-full max-w-3xl mx-auto rounded-lg overflow-hidden bg-black/60 border border-slate-700 flex items-center justify-center">
                  <video
                    controls
                    className="w-full h-full object-cover"
                    src={EXAM_LICHSU_THCS_RESOURCES.videoDirectUrl}
                  >
                    Trình duyệt của bạn không hỗ trợ phát video.
                  </video>
                </div>
              </div>

              {/* CARD TẢI BỘ CÀI & TÀI NGUYÊN */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Bộ cài đặt Desktop All-in-One (.exe) */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/30 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl mb-3 font-bold">
                      💻
                    </div>
                    <h3 className="font-bold text-white text-base">Bộ Cài Đặt Desktop (.EXE)</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Cài đặt 1-Click tự động thiết lập toàn bộ công cụ, tạo lối tắt ngoài Desktop và cấu hình Word STARTUP vĩnh viễn.
                    </p>
                    <div className="mt-3 text-xs text-amber-300 font-semibold">
                      Dung lượng: ~91 MB • Windows 10/11
                    </div>
                  </div>

                  <a
                    href={EXAM_LICHSU_THCS_RESOURCES.exeUrl}
                    download
                    className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-bold transition-all shadow-md shadow-amber-600/20"
                  >
                    <Download className="w-4 h-4" />
                    Tải Bộ Cài .EXE (91MB)
                  </a>
                </div>

                {/* 2. Bản nén ZIP Pass 123 (Tránh chặn tải) */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl mb-3 font-bold">
                      📦
                    </div>
                    <h3 className="font-bold text-white text-base">Bản Nén ZIP (Pass: 123)</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Bản nén bảo mật chống trình duyệt chặn tải về. Mật khẩu giải nén là <span className="text-emerald-400 font-bold">123</span>.
                    </p>
                    <div className="mt-3 text-xs text-emerald-300 font-semibold">
                      Dung lượng: ~90 MB • Pass: 123
                    </div>
                  </div>

                  <a
                    href={EXAM_LICHSU_THCS_RESOURCES.fullZipUrl}
                    download
                    className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold transition-all shadow-md shadow-emerald-600/20"
                  >
                    <Download className="w-4 h-4" />
                    Tải Bản ZIP (Pass: 123)
                  </a>
                </div>

                {/* 3. Word Add-in Ribbon (.dotm) */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl mb-3 font-bold">
                      📄
                    </div>
                    <h3 className="font-bold text-white text-base">Word Add-in (.DOTM)</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      File template sạch nạp thẳng vào Microsoft Word 2016-2024 / Office 365. Tải trong 1 giây, siêu nhẹ ~32 KB.
                    </p>
                    <div className="mt-3 text-xs text-blue-300 font-semibold">
                      Dung lượng: ~32 KB • Word Ribbon
                    </div>
                  </div>

                  <a
                    href={EXAM_LICHSU_THCS_RESOURCES.dotmUrl}
                    download
                    className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-all shadow-md shadow-blue-600/20"
                  >
                    <Download className="w-4 h-4" />
                    Tải File Add-in .DOTM
                  </a>
                </div>

              </div>

              {/* HƯỚNG DẪN CÀI ĐẶT TỪNG BƯỚC */}
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5 text-sm space-y-3">
                <div className="font-bold text-white text-base flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  Quy Trình Cài Đặt & Kích Hoạt Phần Mềm Lịch Sử THCS
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
                    <div className="font-bold text-amber-400 mb-1">Bước 1: Tải & Cài Đặt</div>
                    <div className="text-xs text-slate-300">
                      Tải file <strong>Cai_Dat_TaoDe_LS_THCS.exe</strong> về máy và nhấp đúp để cài đặt tự động 1-Click.
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
                    <div className="font-bold text-amber-400 mb-1">Bước 2: Lấy Mã Máy Tính</div>
                    <div className="text-xs text-slate-300">
                      Mở phần mềm hoặc tab Bản quyền để copy mã phần cứng duy nhất (dạng <code>DVT-LSTHCS-...</code>).
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
                    <div className="font-bold text-amber-400 mb-1">Bước 3: Nhận Key & Sử Dụng</div>
                    <div className="text-xs text-slate-300">
                      Gửi mã máy về Zalo Thầy Thành (<strong>0915.213717</strong>) để nhận Key Pro kích hoạt trọn gói không giới hạn.
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ===================== TAB 3: BẢN QUYỀN & KÍCH HOẠT ===================== */}
          {activeTab === 'license' && (
            <div className="space-y-6">
              
              {/* CARD HIỂN THỊ MÃ MÁY TÍNH */}
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase">
                    Mã máy tính của bạn (Hardware ID):
                  </div>
                  <div className="text-xl sm:text-2xl font-mono font-extrabold text-amber-400 mt-1 tracking-wider">
                    {hardwareCode}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Gửi mã này cho Thầy Thành qua Zalo để nhận Key bản quyền Pro tương thích riêng cho máy này.
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(hardwareCode);
                    setCopiedHw(true);
                    setTimeout(() => setCopiedHw(false), 2000);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-semibold transition-all flex-shrink-0"
                >
                  {copiedHw ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copiedHw ? 'Đã sao chép' : 'Sao chép mã máy'}
                </button>
              </div>

              {/* Ô NHẬP MÃ BẢN QUYỀN PRO */}
              <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-5">
                <div className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" />
                  Kích Hoạt Bản Quyền Pro Môn Lịch Sử THCS
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={licenseKeyInput}
                    onChange={e => setLicenseKeyInput(e.target.value)}
                    placeholder="Dán mã kích hoạt (VD: KEY-LSTHCS-20271008-...)"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={handleActivate}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white rounded-lg text-sm font-bold transition-all shadow-md shadow-amber-500/20 flex-shrink-0"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Kích Hoạt Ngay
                  </button>
                </div>

                {activationMsg && (
                  <div
                    className={`mt-3 p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                      activationMsg.isError
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {activationMsg.isError ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    {activationMsg.text}
                  </div>
                )}
              </div>

              {/* BẢNG CÁC GÓI BẢN QUYỀN (TUYỆT ĐỐI KHÔNG HIỂN THỊ GIÁ TIỀN CỐ ĐỊNH THEO QUY TẮC GEMINI.MD) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Gói 1 Năm */}
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                      GÓI 1 NĂM
                    </span>
                    <h4 className="font-bold text-white text-base mt-2">Bản Quyền 1 Năm Học</h4>
                    <div className="text-amber-400 font-extrabold text-lg mt-1">
                      Ưu đãi Sư phạm
                    </div>
                    <ul className="text-xs text-slate-300 space-y-2 mt-4">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" /> Tạo đề Lịch sử 6-9 không giới hạn
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" /> Đầy đủ Ma trận & Bản đặc tả CV 7991
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" /> Cập nhật tính năng miễn phí 12 tháng
                      </li>
                    </ul>
                  </div>

                  <a
                    href={`https://zalo.me/0915213717`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold text-center block transition-all"
                  >
                    Liên Hệ Nhận Ưu Đãi
                  </a>
                </div>

                {/* Gói VIP Trọn Đời (Khuyên Dùng) */}
                <div className="bg-gradient-to-br from-amber-950/40 via-slate-800 to-amber-950/40 border-2 border-amber-500/60 rounded-xl p-5 flex flex-col justify-between relative shadow-xl shadow-amber-500/10">
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950 uppercase tracking-wide">
                    KHUYÊN DÙNG
                  </div>

                  <div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/30 text-amber-300">
                      GÓI VIP TRỌN ĐỜI
                    </span>
                    <h4 className="font-bold text-white text-base mt-2">Bản Quyền VIP Trọn Đời</h4>
                    <div className="text-amber-300 font-extrabold text-lg mt-1">
                      Báo giá Sư phạm qua Zalo
                    </div>
                    <ul className="text-xs text-slate-200 space-y-2 mt-4">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-400" /> Sử dụng vĩnh viễn trọn đời máy
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-400" /> Hỗ trợ cài đặt UltraViewer tận tình
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-400" /> Miễn phí nâng cấp tất cả các phiên bản mới
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-amber-400" /> Tặng kèm trọn bộ giáo án & tài liệu Lịch sử
                      </li>
                    </ul>
                  </div>

                  <a
                    href={`https://zalo.me/0915213717`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 rounded-lg text-xs font-extrabold text-center block transition-all shadow-md"
                  >
                    Kết Nối Zalo Thầy Thành (0915.213717)
                  </a>
                </div>

                {/* Gói 2 Năm */}
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                      GÓI 2 NĂM
                    </span>
                    <h4 className="font-bold text-white text-base mt-2">Bản Quyền 2 Năm Học</h4>
                    <div className="text-amber-400 font-extrabold text-lg mt-1">
                      Tiết Kiệm Tối Đa
                    </div>
                    <ul className="text-xs text-slate-300 space-y-2 mt-4">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" /> Tạo đề không giới hạn 24 tháng
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" /> Hỗ trợ bảo hành chuyển đổi máy 1 lần
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" /> Đồng bộ Word Ribbon & Desktop
                      </li>
                    </ul>
                  </div>

                  <a
                    href={`https://zalo.me/0915213717`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold text-center block transition-all"
                  >
                    Liên Hệ Nhận Ưu Đãi
                  </a>
                </div>

              </div>

              {/* FORM GỬI THÔNG TIN LÊN CLOUD */}
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
                <div className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-amber-400" />
                  Gửi Thông Tin Đăng Ký Kích Hoạt Đến Admin Thầy Thành
                </div>
                <div className="text-xs text-slate-400 mb-4">
                  Sau khi gửi, thông tin sẽ được tự động chuyển đến bảng quản trị của Thầy Thành để cấp mã kích hoạt nhanh chóng.
                </div>

                {cloudSuccess ? (
                  <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs">
                    <div className="font-bold text-sm mb-1">✓ Đã gửi yêu cầu đăng ký thành công!</div>
                    Thầy Thành đã nhận được thông tin. Vui lòng kết nối Zalo <strong>0915.213717</strong> để nhận mã kích hoạt nhanh nhất!
                  </div>
                ) : (
                  <form onSubmit={handleSubmitCloud} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <input
                        type="text"
                        value={regName}
                        onChange={e => setRegName(e.target.value)}
                        placeholder="Họ và tên giáo viên *"
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={regSchool}
                        onChange={e => setRegSchool(e.target.value)}
                        placeholder="Trường / Đơn vị công tác"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={e => setRegPhone(e.target.value)}
                        placeholder="Số điện thoại / Zalo *"
                        required
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="sm:col-span-3 flex items-center justify-between pt-2">
                      <div className="text-[11px] text-slate-400">
                        * Hoặc kết nối trực tiếp qua Zalo: <strong>0915.213717 (Tác giả Đinh Thành)</strong>
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmittingCloud}
                        className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                      >
                        {isSubmittingCloud ? 'Đang gửi...' : 'Gửi Yêu Cầu Cấp Key'}
                      </button>
                    </div>
                  </form>
                )}
              </div>

            </div>
          )}

        </div>

        {/* FOOTER MODAL */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            Tác giả: <strong>Tác giả Đinh Thành - ĐT: 0915.213717</strong> • Trường THCS Đồng Yên • Hotline/Zalo: <strong>0915.213717</strong>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://zalo.me/0915213717"
              target="_blank"
              rel="noreferrer"
              className="text-amber-400 hover:underline font-semibold"
            >
              Hỗ trợ Zalo 24/7
            </a>
            <span>•</span>
            <button onClick={onClose} className="hover:text-white transition-colors">
              Đóng cửa sổ
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
