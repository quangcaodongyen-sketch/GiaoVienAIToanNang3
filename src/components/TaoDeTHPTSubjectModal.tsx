import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Download,
  Copy,
  Check,
  Crown,
  CheckCircle2,
  FileText,
  Laptop,
  ShieldCheck,
  User,
  Send,
  Sliders,
  RefreshCw,
  Lock,
  Calculator,
  MessageCircle,
  ExternalLink,
  BookOpen,
  Layers,
  ChevronRight,
  Play
} from 'lucide-react';
import { BRAND, EXAM_THPT_RESOURCES } from '../config/brand';
import { cloudSyncService } from '../services/cloudSyncService';
import { webSecurityGuard } from '../services/webSecurityGuard';

interface TaoDeTHPTSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
  initialSubject?: string;
}

export const TaoDeTHPTSubjectModal: React.FC<TaoDeTHPTSubjectModalProps> = ({
  isOpen,
  onClose,
  onOpenAdmin,
  initialSubject = 'TOAN'
}) => {
  const subjectList = Object.entries(EXAM_THPT_RESOURCES.subjects);
  const [currentSubKey, setCurrentSubKey] = useState<string>(initialSubject || 'TOAN');
  const [activeTab, setActiveTab] = useState<'online' | 'download' | 'register'>('download');

  const curSub = EXAM_THPT_RESOURCES.subjects[currentSubKey as keyof typeof EXAM_THPT_RESOURCES.subjects] || EXAM_THPT_RESOURCES.subjects.TOAN;

  // Bản quyền & Dùng thử 5 lượt
  const [trialRemaining, setTrialRemaining] = useState<number>(5);
  const [detectedMid, setDetectedMid] = useState<string>('');
  const [isProActive, setIsProActive] = useState<boolean>(false);
  const [inputKey, setInputKey] = useState<string>('');
  const [copiedMid, setCopiedMid] = useState<boolean>(false);
  const [verifyMsg, setVerifyMsg] = useState<string>('');
  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);

  // Form đăng ký Giáo viên
  const [regName, setRegName] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regSchool, setRegSchool] = useState<string>('');
  const [regSent, setRegSent] = useState<boolean>(false);

  // State Trực tuyến
  const [selectedGrade, setSelectedGrade] = useState<string>('12');
  const [selectedTerm, setSelectedTerm] = useState<string>('GK1');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedPreview, setGeneratedPreview] = useState<string>('');

  useEffect(() => {
    if (initialSubject && EXAM_THPT_RESOURCES.subjects[initialSubject as keyof typeof EXAM_THPT_RESOURCES.subjects]) {
      setCurrentSubKey(initialSubject);
    }
  }, [initialSubject, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    // Sinh mã máy chuẩn định dạng DVT-[APP_TAG]-XXXX-XXXX
    const appTag = curSub.appTag || 'MATHPT';
    const storageMidKey = `gvai_hw_${appTag.toLowerCase()}`;
    let mid = localStorage.getItem(storageMidKey);
    if (!mid) {
      const rand1 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const rand2 = Math.random().toString(36).substring(2, 6).toUpperCase();
      mid = `DVT-${appTag}-${rand1}-${rand2}`;
      localStorage.setItem(storageMidKey, mid);
    }
    setDetectedMid(mid);

    // Kiểm tra bản quyền Pro riêng cho môn
    const proKey = `gvai_pro_${appTag.toLowerCase()}`;
    const savedPro = localStorage.getItem(proKey) === 'true';
    setIsProActive(savedPro);

    // Kiểm tra số lượt dùng thử 5 lần
    const trialKey = `gvai_trial_${appTag.toLowerCase()}`;
    const savedCount = localStorage.getItem(trialKey);
    if (savedPro) {
      setTrialRemaining(999);
    } else if (savedCount !== null) {
      const used = parseInt(savedCount, 10) || 0;
      setTrialRemaining(Math.max(0, 5 - used));
    } else {
      setTrialRemaining(5);
    }

    setVerifyMsg('');
    setInputKey('');
  }, [isOpen, currentSubKey]);

  if (!isOpen) return null;

  const handleCopyMid = () => {
    navigator.clipboard.writeText(detectedMid);
    setCopiedMid(true);
    setTimeout(() => setCopiedMid(false), 2500);
  };

  const handleActivateKey = () => {
    if (!inputKey.trim()) {
      setVerifyMsg('Vui lòng dán Mã kích hoạt do Thầy Thành cấp!');
      return;
    }
    const cleanKey = inputKey.trim().toUpperCase();
    const appTag = curSub.appTag;

    // Chặn dùng nhầm key của môn khác hoặc app khác
    if (cleanKey.startsWith('KEY-NLS') || cleanKey.startsWith('KEY-TH8M') || cleanKey.startsWith('KEY-ENGCS')) {
      setVerifyMsg('⚠️ Mã kích hoạt này thuộc về ứng dụng khác, không áp dụng cho ' + curSub.fullName + '!');
      return;
    }

    // Kiểm tra khớp tag môn THPT
    const isTagMatched = cleanKey.includes(appTag) || cleanKey.includes('MASTER') || cleanKey.includes('KEY-ALL');
    if (isTagMatched && (cleanKey.startsWith('KEY-') || cleanKey.startsWith('DVT-'))) {
      setIsProActive(true);
      localStorage.setItem(`gvai_pro_${appTag.toLowerCase()}`, 'true');
      setTrialRemaining(999);
      setVerifyMsg(`🎉 Kích hoạt Bản quyền Pro ${curSub.fullName} thành công!`);
    } else {
      setVerifyMsg('Mã kích hoạt không đúng hoặc không thuộc ' + curSub.fullName + '. Vui lòng kiểm tra lại!');
      webSecurityGuard.recordFailedKeyAttempt(`taode-${appTag.toLowerCase()}`, inputKey, detectedMid);
    }
  };

  const handleCloudSync = async () => {
    setIsSyncingCloud(true);
    try {
      const appTag = curSub.appTag;
      const res = await cloudSyncService.checkCurrentMachineCloudStatus(detectedMid, `taode_thpt_${currentSubKey.toLowerCase()}`);
      if (res.isApproved) {
        setIsProActive(true);
        localStorage.setItem(`gvai_pro_${appTag.toLowerCase()}`, 'true');
        setTrialRemaining(999);
        alert(`🎉 Chúc mừng Thầy/Cô!\n\nMáy tính [${detectedMid}] đã được duyệt bản quyền ${res.packageType || 'Pro'} cho ứng dụng "${curSub.fullName}" trên Web Cloud bởi ${res.approvedBy || 'Thầy Thành'}!`);
      } else {
        alert(`ℹ️ Chưa tìm thấy phê duyệt cho ứng dụng "${curSub.fullName}" trên Cloud của máy tính [${detectedMid}].\n\nNếu Thầy/Cô đã gửi đơn, xin vui lòng chờ Thầy Thành duyệt hoặc nhắn tin Zalo 0915.213717 để được hỗ trợ tức thì!`);
      }
    } catch (e) {
      alert("⚠️ Không thể kết nối Cloud. Vui lòng kiểm tra lại mạng Internet.");
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const handleSendRegistration = () => {
    if (!regName.trim() || !regPhone.trim()) {
      alert('Vui lòng nhập Họ tên và Số điện thoại / Zalo để nhận mã kích hoạt!');
      return;
    }
    setRegSent(true);
    const msg = `KÍNH GỬI THẦY ĐINH VĂN THÀNH - ĐĂNG KÝ BẢN QUYỀN PRO:
• Phần mềm: ${curSub.fullName} (Cấu trúc mới BGD&ĐT 2025+)
• Họ tên GV: ${regName.trim()}
• Số điện thoại: ${regPhone.trim()}
• Đơn vị: ${regSchool.trim() || 'Trường THPT'}
• Mã máy tính: ${detectedMid}
Kính nhờ Thầy báo giá ưu đãi sư phạm và kích hoạt bản quyền giúp em!`;
    const zaloUrl = `https://zalo.me/${BRAND.phoneRaw}?text=${encodeURIComponent(msg)}`;
    window.open(zaloUrl, '_blank');
  };

  const handleGenerateOnline = () => {
    if (!isProActive) {
      if (trialRemaining <= 0) {
        alert(`Thầy/Cô đã hoàn thành 5/5 lượt trải nghiệm miễn phí môn ${curSub.name} trên máy tính này!\n\nVui lòng đăng ký bản quyền Pro qua Zalo Thầy Thành: 0915.213717 để tiếp tục sử dụng không giới hạn.`);
        setActiveTab('register');
        return;
      }
      const nextRemaining = Math.max(0, trialRemaining - 1);
      setTrialRemaining(nextRemaining);
      localStorage.setItem(`gvai_trial_${curSub.appTag.toLowerCase()}`, String(5 - nextRemaining));
    }

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedPreview(`SỞ GIÁO DỤC VÀ ĐÀO TẠO ....................
TRƯỜNG THPT ....................
MÃ ĐỀ THI: ${selectedGrade}01 - ${selectedTerm}

ĐỀ KIỂM TRA ĐỊNH KỲ ${curSub.fullName.toUpperCase()} - LỚP ${selectedGrade}
(Cấu trúc định dạng mới theo chuẩn Quyết định 764/BGDĐT từ năm 2025)

PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (4 LỰA CHỌN - 1 ĐÁP ÁN ĐÚNG)
Thí sinh trả lời từ câu 1 đến câu 12. Mỗi câu hỏi thí sinh chỉ chọn một phương án.
[ĐÁP ÁN ĐỎ: Tự động bôi đỏ đáp án đúng chuẩn mực sư phạm]

PHẦN II. CÂU TRẮC NGHIỆM ĐÚNG SAI
Thí sinh trả lời từ câu 1 đến câu 4. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai.
• Điểm phần Đúng/Sai: Đúng 1 ý: 0.1đ | Đúng 2 ý: 0.25đ | Đúng 3 ý: 0.5đ | Đúng 4 ý: 1.0đ.

PHẦN III. CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN (ĐIỀN SỐ HOẶC KẾT QUẢ RÚT GỌN)
Thí sinh trả lời từ câu 1 đến câu 6. Điền kết quả chính xác vào phiếu trả lời.

--- MA TRẬN 16 CỘT & BẢN ĐẶC TẢ ĐÃ TỰ ĐỘNG ĐƯỢC TẠO HOÀN CHỈNH KÈM THEO FILE WORD ---`);
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto cursor-pointer"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-5xl w-full text-white shadow-2xl my-auto max-h-[95vh] flex flex-col cursor-default overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER MODAL */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-2xl shadow-lg shrink-0">
              {curSub.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  CẤP THPT • 2025+
                </span>
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  TẠO ĐỀ {curSub.fullName.toUpperCase()}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Cấu trúc đề kiểm tra định dạng mới chuẩn Bộ GD&ĐT • Tác giả: Thầy Đinh Văn Thành
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* THANH CHỌN BỘ MÔN THPT (11 MÔN ĐỘC LẬP) */}
        <div className="px-4 py-2.5 bg-slate-950/90 border-b border-slate-800/80 overflow-x-auto flex items-center gap-1.5 scrollbar-none shrink-0">
          <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0">Chọn môn:</span>
          {subjectList.map(([key, sub]) => {
            const isSel = currentSubKey === key;
            return (
              <button
                key={key}
                onClick={() => setCurrentSubKey(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isSel
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{sub.icon}</span>
                <span>{sub.name}</span>
              </button>
            );
          })}
        </div>

        {/* 3 TABS ĐIỀU HƯỚNG */}
        <div className="px-5 pt-3 border-b border-slate-800 bg-slate-900/50 flex gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('download')}
            className={`py-2 px-4 rounded-t-xl text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'download'
                ? 'border-blue-500 text-blue-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>1. Tải Về Cài Đặt ({curSub.size})</span>
          </button>
          <button
            onClick={() => setActiveTab('online')}
            className={`py-2 px-4 rounded-t-xl text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'online'
                ? 'border-emerald-500 text-emerald-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>2. Trải Nghiệm Trực Tuyến</span>
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`py-2 px-4 rounded-t-xl text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'register'
                ? 'border-amber-500 text-amber-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>3. Bản Quyền & Kích Hoạt Pro</span>
          </button>
        </div>

        {/* BODY MODAL */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">

          {/* ========================================================================= */}
          {/* TAB 1: TẢI VỀ BỘ CÀI ĐẶT RIÊNG CHO MÔN ĐANG CHỌN */}
          {/* ========================================================================= */}
          {activeTab === 'download' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              {/* CARD TẢI BỘ CÀI CHÍNH */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/40 shadow-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="text-4xl p-3 rounded-2xl bg-slate-950 border border-slate-800 shrink-0">
                      {curSub.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base sm:text-lg font-black text-white uppercase">
                          PHẦN MỀM TẠO ĐỀ {curSub.fullName}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {curSub.size}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                        Tự động tạo ma trận 16 cột, bản đặc tả và đề kiểm tra định kỳ chuẩn định dạng mới từ năm 2025. Hỗ trợ xuất file Word A4 chuẩn mực kèm đáp án chữ đỏ.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3 ĐIỂM NỔI BẬT */}
                <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Cấu trúc 3 phần trắc nghiệm chuẩn Bộ GD&ĐT</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Ma trận 16 cột 3 tầng nhận biết, thông hiểu, vận dụng</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Tích hợp thanh công cụ Word Ribbon & bản Desktop</span>
                  </div>
                </div>

                {/* NÚT TẢI XUỐNG CHÍNH MÔN THPT */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-3">
                  <a
                    href={curSub.zipUrl}
                    download={curSub.zipUrl.split('/').pop()}
                    className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20 cursor-pointer hover:scale-[1.01]"
                  >
                    <Download className="w-4 h-4" />
                    <span>🚀 TẢI BỘ CÀI ĐẶT PRO (.ZIP - MẬT KHẨU: 123)</span>
                  </a>
                </div>
              </div>

              {/* HƯỚNG DẪN CÀI ĐẶT NHANH 3 BƯỚC */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <h5 className="font-bold text-white text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  HƯỚNG DẪN CÀI ĐẶT 3 BƯỚC NHANH:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center">1</span>
                    <h6 className="font-bold text-white text-xs">Tải file .ZIP</h6>
                    <p className="text-[11px] text-slate-400">Bấm nút Tải bản ZIP ở trên về máy tính của Thầy/Cô.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center">2</span>
                    <h6 className="font-bold text-white text-xs">Giải nén bằng Pass: 123</h6>
                    <p className="text-[11px] text-slate-400">Nhấp chuột phải vào file ZIP ➔ Extract Here ➔ Nhập mật khẩu: <strong className="text-amber-300">123</strong>.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">3</span>
                    <h6 className="font-bold text-white text-xs">Chạy ứng dụng</h6>
                    <p className="text-[11px] text-slate-400">Mở file bộ cài hoặc bấm `Chay_Ung_Dung.bat` để bắt đầu ra đề ngay.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: TRẢI NGHIỆM TRỰC TUYẾN */}
          {/* ========================================================================= */}
          {activeTab === 'online' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              {/* THANH TIẾN TRÌNH DÙNG THỬ 5 LẦN */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-300 font-bold">Lượt trải nghiệm miễn phí:</span>
                  {isProActive ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      BẢN QUYỀN PRO VĨNH VIỄN (KHÔNG GIỚI HẠN)
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((dot) => (
                        <span
                          key={dot}
                          className={`w-3 h-3 rounded-full ${
                            dot <= trialRemaining ? 'bg-amber-400 shadow-xs shadow-amber-400/50' : 'bg-slate-700'
                          }`}
                        />
                      ))}
                      <span className="text-xs font-bold text-amber-300 ml-1.5">
                        {trialRemaining}/5 lượt còn lại
                      </span>
                    </div>
                  )}
                </div>

                {!isProActive && (
                  <button
                    onClick={() => setActiveTab('register')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    <span>Kích hoạt Pro</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* TÙY CHỌN KHỐI LỚP & ĐỢT KIỂM TRA */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Khối lớp THPT:</label>
                    <select
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="10">Khối Lớp 10 (Chương trình mới)</option>
                      <option value="11">Khối Lớp 11 (Chương trình mới)</option>
                      <option value="12">Khối Lớp 12 (Định hướng thi tốt nghiệp 2025+)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Kỳ kiểm tra đánh giá:</label>
                    <select
                      value={selectedTerm}
                      onChange={(e) => setSelectedTerm(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="GK1">Kiểm tra Giữa Học kỳ 1</option>
                      <option value="CK1">Kiểm tra Cuối Học kỳ 1</option>
                      <option value="GK2">Kiểm tra Giữa Học kỳ 2</option>
                      <option value="CK2">Kiểm tra Cuối Học kỳ 2</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateOnline}
                  disabled={isGenerating}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition cursor-pointer"
                >
                  <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>{isGenerating ? 'ĐANG TẠO ĐỀ VÀ MA TRẬN ĐẶC TẢ...' : `TẠO ĐỀ KIỂM TRA MÔN ${curSub.name.toUpperCase()} (LỚP ${selectedGrade})`}</span>
                </button>
              </div>

              {/* KHUNG HIỂN THỊ KẾT QUẢ ĐỀ THI */}
              {generatedPreview && (
                <div className="p-4 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-md space-y-2">
                  <div className="flex items-center justify-between border-b pb-2 border-slate-200">
                    <span className="text-xs font-bold text-blue-900">BẢN XEM TRƯỚC SƯ PHẠM (CHUẨN FONT TIMES NEW ROMAN):</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedPreview);
                        alert('Đã sao chép nội dung đề thi!');
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" /> Sao chép văn bản
                    </button>
                  </div>
                  <pre className="font-serif text-xs leading-relaxed whitespace-pre-wrap text-slate-800 max-h-80 overflow-y-auto">
                    {generatedPreview}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: BẢN QUYỀN & KÍCH HOẠT PRO */}
          {/* ========================================================================= */}
          {activeTab === 'register' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              {/* THÔNG TIN TÁC GIẢ THẦY ĐINH VĂN THÀNH */}
              <div className="p-4 rounded-2xl bg-[#17143A] border-2 border-indigo-500/60 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 bg-indigo-950 flex items-center justify-center shadow-md">
                    <img
                      src="/dinhvanthanh.jpg"
                      alt="Thầy Đinh Văn Thành"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wide">
                      TÁC GIẢ & BẢN QUYỀN PHẦN MỀM: THẦY GIÁO ĐINH VĂN THÀNH
                    </h4>
                    <p className="text-xs text-slate-200">
                      • Đơn vị: <strong>Trường THCS Đồng Yên</strong> &nbsp;|&nbsp; • Hotline / Zalo: <strong>0915.213717</strong>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      • Phần mềm: <strong>TẠO ĐỀ {curSub.fullName.toUpperCase()} (2025+)</strong>
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                  <a
                    href={`https://zalo.me/${BRAND.phoneRaw}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Chat Zalo
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText("0915213717");
                      alert("Đã sao chép SĐT Thầy Thành: 0915.213717");
                    }}
                    className="py-1 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center justify-center gap-1 transition"
                  >
                    <Copy className="w-3 h-3" /> Copy SĐT
                  </button>
                </div>
              </div>

              {/* Ô NHẬP MÃ KÍCH HOẠT PRO */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-white uppercase">
                    KÍCH HOẠT BẢN QUYỀN PRO MÔN {curSub.name.toUpperCase()} (ĐÃ CÓ KEY)
                  </h4>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Laptop className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Mã máy tính của bạn:</span>
                      <span className="text-xs font-mono font-bold text-cyan-300">{detectedMid}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyMid}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    {copiedMid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedMid ? 'Đã sao chép' : 'Sao chép'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder={`Dán mã kích hoạt (KEY-${curSub.appTag}-...) do Thầy Thành cấp tại đây`}
                    className="flex-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleActivateKey}
                    className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 transition cursor-pointer"
                  >
                    Kích Hoạt
                  </button>
                </div>

                {verifyMsg && (
                  <p className={`text-xs ${verifyMsg.includes('thành công') ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {verifyMsg}
                  </p>
                )}

                {/* NÚT ĐỒNG BỘ BẢN QUYỀN TỪ CLOUD */}
                <button
                  type="button"
                  onClick={handleCloudSync}
                  disabled={isSyncingCloud}
                  className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncingCloud ? 'animate-spin' : ''}`} />
                  <span>{isSyncingCloud ? 'ĐANG KẾT NỐI VÀ ĐỒNG BỘ TỪ WEB CLOUD...' : '🔄 CẬP NHẬT / ĐỒNG BỘ BẢN QUYỀN TỪ WEB CLOUD (LÀM MỚI TỨC THÌ)'}</span>
                </button>
              </div>

              {/* FORM ĐĂNG KÝ BẢN QUYỀN */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold text-white uppercase">
                    ĐĂNG KÝ BẢN QUYỀN PRO & NHẬN BÁO GIÁ ƯU ĐÃI SƯ PHẠM
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Họ và tên giáo viên (*):</label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Ví dụ: Thầy Đinh Văn Thành"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Số điện thoại / Zalo (*):</label>
                    <input
                      type="text"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="Ví dụ: 0915213717"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Trường THPT công tác:</label>
                  <input
                    type="text"
                    value={regSchool}
                    onChange={(e) => setRegSchool(e.target.value)}
                    placeholder="Ví dụ: Trường THPT Chuyên..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSendRegistration}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>GỬI ĐĂNG KÝ BẢN QUYỀN MÔN {curSub.name.toUpperCase()} (QUA ZALO)</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER MODAL */}
        <div className="px-5 py-2.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span>© 2026 Bản quyền thuộc Thầy giáo <strong>Đinh Văn Thành</strong></span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">Hotline: 0915.213717</span>
          </div>
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="text-[11px] text-slate-500 hover:text-slate-300 transition cursor-pointer"
            >
              Quản trị Admin ↗
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
