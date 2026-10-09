import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Download,
  Copy,
  Check,
  Crown,
  CheckCircle2,
  FileCheck2,
  MessageCircle,
  FileText,
  Laptop,
  ShieldCheck,
  User,
  Send,
  BookOpen,
  Lock,
  Layers,
  Star,
  Award
} from 'lucide-react';
import { BRAND } from '../config/brand';
import { cloudSyncService } from '../services/cloudSyncService';
import {
  getOrCreateExamEngPrimaryHardwareCode,
  verifyExamEngPrimaryLicenseKey,
  ExamVerifyResult
} from '../services/taodeKeyService';
import { CrossPromoBanner } from './CrossPromoBanner';
import { ShareLinkBar } from './ShareLinkBar';
import { syncBrowserHash } from '../utils/shareUtils';

interface TaoDeTiengVietTieuHocModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

export const TaoDeTiengVietTieuHocModal: React.FC<TaoDeTiengVietTieuHocModalProps> = ({ isOpen, onClose, onOpenAdmin }) => {
  const [activeTab, setActiveTab] = useState<'download' | 'register'>('download');

  const [detectedMid, setDetectedMid] = useState<string>('');
  const [isProActive, setIsProActive] = useState<boolean>(false);
  const [verifyResult, setVerifyResult] = useState<ExamVerifyResult | null>(null);
  const [inputKey, setInputKey] = useState<string>('');
  const [copiedMid, setCopiedMid] = useState<boolean>(false);

  // Form đăng ký Giáo viên
  const [regName, setRegName] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regSchool, setRegSchool] = useState<string>('');
  const [regNote, setRegNote] = useState<string>('');
  const [regSent, setRegSent] = useState<boolean>(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    syncBrowserHash('#taode-tiengviet-tieuhoc');
    const rawMid = getOrCreateExamEngPrimaryHardwareCode();
    const tvMid = rawMid.replace('ENGP', 'TVTH');
    setDetectedMid(tvMid);

    const checkPro = async () => {
      const savedKey = localStorage.getItem('gvai_tvth_license_key');
      if (savedKey) {
        const res = verifyExamEngPrimaryLicenseKey(savedKey, tvMid);
        if (res.isValid) {
          setIsProActive(true);
          setVerifyResult(res);
          return;
        }
      }
      setIsProActive(false);
    };
    checkPro();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyMid = () => {
    navigator.clipboard.writeText(detectedMid);
    setCopiedMid(true);
    setTimeout(() => setCopiedMid(false), 2000);
  };

  const handleActivate = () => {
    if (!inputKey.trim()) return;
    const res = verifyExamEngPrimaryLicenseKey(inputKey.trim(), detectedMid);
    setVerifyResult(res);
    if (res.isValid) {
      setIsProActive(true);
      localStorage.setItem('gvai_tvth_license_key', inputKey.trim());
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone) return;
    setIsSyncingCloud(true);
    try {
      await cloudSyncService.submitRegistration({
        teacherName: regName,
        phone: regPhone,
        school: regSchool,
        note: regNote,
        productTag: 'TVTH_TIEUHOC',
        machineCode: detectedMid,
        timestamp: new Date().toISOString()
      });
      setRegSent(true);
    } catch (err) {
      setRegSent(true);
    } finally {
      setIsSyncingCloud(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-rose-500/30 rounded-3xl shadow-2xl overflow-hidden text-slate-100 my-auto">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-rose-950/60 via-slate-900 to-rose-900/40 border-b border-rose-500/20">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 p-0.5 flex items-center justify-center shadow-lg shadow-rose-500/30">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-rose-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold bg-gradient-to-r from-rose-300 via-amber-200 to-white bg-clip-text text-transparent">
                  TẠO ĐỀ TIẾNG VIỆT TIỂU HỌC PRO (TT 27)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  LỚP 1 - 5
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tác giả: {BRAND.author} ({BRAND.phone}) – {BRAND.school}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <ShareLinkBar title="Tạo đề Tiếng Việt Tiểu học (TT 27)" hash="#taode-tiengviet-tieuhoc" />

        {/* NAVIGATION TABS 2 TAB */}
        <div className="flex items-center gap-2 px-5 pt-4 border-b border-slate-800 bg-slate-950/40 overflow-x-auto">
          <button
            onClick={() => setActiveTab('download')}
            className={`py-2.5 px-5 rounded-t-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer border-b-2 ${
              activeTab === 'download'
                ? 'bg-rose-600/20 text-rose-300 border-rose-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Download className="w-4 h-4 text-rose-400" />
            1. TẢI BỘ CÀI VỀ MÁY TÍNH (KHUYÊN DÙNG)
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`py-2.5 px-5 rounded-t-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer border-b-2 ${
              activeTab === 'register'
                ? 'bg-amber-600/20 text-amber-300 border-amber-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            2. BẢN QUYỀN & KÍCH HOẠT PRO
          </button>
        </div>

        {/* TAB BODY CONTENT */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {activeTab === 'download' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/30 border border-rose-500/20">
                <h3 className="text-lg font-bold text-rose-300 mb-2 flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-rose-400" />
                  PHẦN MỀM TẠO ĐỀ TIẾNG VIỆT TIỂU HỌC PRO (DESKTOP PC)
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Bộ ứng dụng tạo đề kiểm tra môn Tiếng Việt Tiểu học (Lớp 1, 2, 3, 4, 5) tham khảo dành cho giáo viên Thông tư 27/2020/TT-BGDĐT. Tự động sinh Ma trận 3 mức độ, Bản đặc tả kỹ thuật, Đọc thành tiếng, Đọc hiểu, Chính tả, Tập làm văn và Bản Học sinh sạch rảnh tay in ngay!
                </p>

                <div className="mt-5 flex flex-wrap gap-4">
                  <a
                    href="/Cai_Dat_TaoDe_TiengViet_TieuHoc.exe"
                    download
                    className="py-3 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-sm shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    TẢI BỘ CÀI ĐẶT PC (.EXE)
                  </a>
                  <a
                    href="/Cai_Dat_TaoDe_TiengViet_TieuHoc_Pass_123.zip"
                    download
                    className="py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 flex items-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    BẢN BỎ TÚI ZIP (PASS: 123)
                  </a>
                </div>
              </div>

              {/* Tính năng nổi bật */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                  <FileText className="w-6 h-6 text-rose-400 mb-2" />
                  <h4 className="font-bold text-sm text-slate-200">Chuẩn Thông tư 27/2020</h4>
                  <p className="text-xs text-slate-400 mt-1">Đầy đủ 4 thành phần Đọc thành tiếng, Đọc hiểu, Chính tả & Tập làm văn cho Lớp 1 - 5.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                  <Layers className="w-6 h-6 text-amber-400 mb-2" />
                  <h4 className="font-bold text-sm text-slate-200">Ma trận & Đặc tả chuẩn</h4>
                  <p className="text-xs text-slate-400 mt-1">Tự động xuất Ma trận 3 mức độ nhận thức và Bản đặc tả kỹ thuật 16 cột kèm đề thi.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                  <Award className="w-6 h-6 text-emerald-400 mb-2" />
                  <h4 className="font-bold text-sm text-slate-200">Bản Học Sinh Sạch</h4>
                  <p className="text-xs text-slate-400 mt-1">Tự động sinh file Word song song không chứa chữ màu đỏ, sẵn sàng phát cho học sinh làm bài.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'register' && (
            <div className="space-y-6">
              {/* Thẻ Mã Máy */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-rose-500/20">
                <h4 className="text-sm font-bold text-rose-300 mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  MÃ MÁY TÍNH CỦA BẠN (HARDWARE CODE)
                </h4>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex-1 py-3 px-4 rounded-xl bg-slate-900 border border-slate-700 font-mono text-lg font-bold text-amber-400 tracking-wider">
                    {detectedMid || 'ĐANG TẠO MÃ MÁY...'}
                  </div>
                  <button
                    onClick={handleCopyMid}
                    className="py-3 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
                  >
                    {copiedMid ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedMid ? 'ĐÃ SAO CHÉP' : 'SAO CHÉP MÃ'}
                  </button>
                </div>
              </div>

              {/* Ô Nhập Key */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-amber-500/20">
                <h4 className="text-sm font-bold text-amber-300 mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" />
                  KÍCH HOẠT BẢN QUYỀN PRO
                </h4>
                <div className="flex items-center gap-3 mt-3">
                  <input
                    type="text"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="Nhập mã bản quyền Pro (KEY-TVTH-...)"
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-900 border border-slate-700 font-mono text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={handleActivate}
                    className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    <Crown className="w-4 h-4" />
                    KÍCH HOẠT
                  </button>
                </div>

                {isProActive && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    BẢN QUYỀN PRO ĐÃ ĐƯỢC KÍCH HOẠT THÀNH CÔNG!
                  </div>
                )}
              </div>

              {/* Form Đăng ký nhận tư vấn Zalo */}
              <div className="p-5 rounded-2xl bg-slate-950/40 border border-slate-800">
                <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-rose-400" />
                  LIÊN HỆ TRỰC TIẾP TÁC GIẢ THẦY THÀNH (ZALO: 0915.213717)
                </h4>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Họ và tên Giáo viên (*)"
                      className="py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-rose-500"
                    />
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="Số điện thoại / Zalo (*)"
                      className="py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <input
                    type="text"
                    value={regSchool}
                    onChange={(e) => setRegSchool(e.target.value)}
                    placeholder="Trường Tiểu học công tác"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-rose-500"
                  />

                  <button
                    type="submit"
                    disabled={isSyncingCloud}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    {isSyncingCloud ? 'ĐANG GỬI...' : 'GỬI ĐĂNG KÝ KÍCH HOẠT PRO'}
                  </button>

                  {regSent && (
                    <p className="text-center text-xs text-emerald-400 font-bold">
                      ✓ Đã gửi thông tin! Thầy Thành sẽ liên hệ qua Zalo ({BRAND.phone}) hỗ trợ Thầy/Cô sớm nhất.
                    </p>
                  )}
                </form>
              </div>
            </div>
          )}

          <CrossPromoBanner currentAppId="tao-de-tieng-viet-tieu-hoc" />
        </div>
      </div>
    </div>
  );
};
