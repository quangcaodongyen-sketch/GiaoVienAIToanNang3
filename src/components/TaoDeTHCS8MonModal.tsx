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
  Printer,
  SlidersHorizontal,
  GraduationCap,
  Crown
} from 'lucide-react';
import { BRAND, EXAM_7MON_RESOURCES } from '../config/brand';
import { cloudSyncService } from '../services/cloudSyncService';
import { webSecurityGuard } from '../services/webSecurityGuard';
import {
  getTHCS8MonExamSuite,
  downloadTHCS8MonWordDoc,
  THCS8MonExamData
} from '../services/thcs8MonWordExportService';

interface TaoDeTHCS8MonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
  selectedSubject?: string;
  initialSubject?: string;
  onSwitchToEnglish?: () => void;
}

interface SubjectDetail {
  key: string;
  name: string;
  fullName: string;
  icon: string;
  size: string;
  desc: string;
  highlights: string[];
  zipUrl: string;
  exeUrl: string;
  accentColor: string;
  badgeBg: string;
}

const SUBJECT_DETAILS: Record<string, SubjectDetail> = {
  TOAN: {
    key: 'TOAN',
    name: 'Toán học',
    fullName: 'Môn Toán học THCS',
    icon: '📐',
    size: '127 MB',
    desc: 'Tự động tạo ma trận, bản đặc tả và đề kiểm tra kèm công thức MathType chuẩn đẹp 100% theo Công văn 7991.',
    highlights: [
      'Đầy đủ các dạng thức trắc nghiệm nhiều lựa chọn, đúng/sai, trả lời ngắn và tự luận Toán 6, 7, 8, 9',
      'Tương thích hoàn hảo Microsoft Word 2016-2024 và MathType 6.x / 7.x không bao giờ bị lỗi font',
      'Tự động xuất đáp án, lời giải chi tiết từng bước và thang điểm biểu điểm barem chuẩn'
    ],
    zipUrl: EXAM_7MON_RESOURCES.subjects.TOAN.zipUrl,
    exeUrl: EXAM_7MON_RESOURCES.subjects.TOAN.exeUrl,
    accentColor: 'from-blue-600 to-cyan-600',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
  },
  VAN: {
    key: 'VAN',
    name: 'Ngữ văn',
    fullName: 'Môn Ngữ văn THCS',
    icon: '📖',
    size: '34 MB',
    desc: 'Cấu trúc chuẩn CV 7991: Đọc hiểu văn bản ngoài SGK (6.0 điểm) & Viết đoạn văn / bài văn (4.0 điểm).',
    highlights: [
      'Ngân hàng văn bản ngữ liệu phong phú, chọn lọc ngoài SGK chuẩn CT GDPT 2018',
      'Đầy đủ hệ thống câu hỏi nhận biết, thông hiểu, vận dụng và bảng đáp án mẫu chuẩn',
      'Hướng dẫn chấm và biểu điểm chi tiết cho phần Viết đoạn văn / bài tập làm văn'
    ],
    zipUrl: EXAM_7MON_RESOURCES.subjects.VAN.zipUrl,
    exeUrl: EXAM_7MON_RESOURCES.subjects.VAN.exeUrl,
    accentColor: 'from-amber-600 to-orange-600',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  },
  KHTN: {
    key: 'KHTN',
    name: 'Khoa học tự nhiên',
    fullName: 'Môn Khoa học tự nhiên THCS',
    icon: '🔬',
    size: '34 MB',
    desc: 'Tích hợp 3 phân môn Vật lí, Hóa học, Sinh học với tỉ lệ phân bổ chính xác theo kế hoạch dạy học.',
    highlights: [
      'Cân đối thời lượng kiến thức Vật lí - Hóa học - Sinh học theo tuần và số tiết dạy học',
      'Hệ thống hình vẽ sơ đồ thí nghiệm, đồ thị và bảng số liệu khoa học trực quan',
      'Đề thi tích hợp ma trận và bản đặc tả đánh giá năng lực khoa học tự nhiên toàn diện'
    ],
    zipUrl: EXAM_7MON_RESOURCES.subjects.KHTN.zipUrl,
    exeUrl: EXAM_7MON_RESOURCES.subjects.KHTN.exeUrl,
    accentColor: 'from-emerald-600 to-teal-600',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  },
  SUDIA: {
    key: 'SUDIA',
    name: 'Lịch sử & Địa lí',
    fullName: 'Môn Lịch sử và Địa lí THCS',
    icon: '🌍',
    size: '34 MB',
    desc: 'Cân đối chuẩn 50% Lịch sử - 50% Địa lí, hỗ trợ câu hỏi tình huống thực tế và bản đồ lược đồ.',
    highlights: [
      'Phân bổ chuẩn 2 phân môn Lịch sử (50%) và Địa lí (50%) theo đúng quy định Bộ GD&ĐT',
      'Khai thác bảng số liệu địa lí, biểu đồ khí hậu và lược đồ lịch sử sắc nét',
      'Hệ thống câu hỏi liên hệ vận dụng giải quyết tình huống thực tiễn địa phương'
    ],
    zipUrl: EXAM_7MON_RESOURCES.subjects.SUDIA.zipUrl,
    exeUrl: EXAM_7MON_RESOURCES.subjects.SUDIA.exeUrl,
    accentColor: 'from-rose-600 to-red-600',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
  },
  GDCD: {
    key: 'GDCD',
    name: 'Giáo dục công dân',
    fullName: 'Môn Giáo dục công dân THCS',
    icon: '⚖️',
    size: '34 MB',
    desc: 'Tích hợp chuẩn mực đạo đức (4.0 điểm) và Xử lý tình huống pháp luật thực tế đời sống (6.0 điểm).',
    highlights: [
      'Ngân hàng tình huống pháp luật gắn liền với lứa tuổi học sinh THCS và gia đình',
      'Đánh giá hành vi, chuẩn mực đạo đức, kỹ năng sống và văn hóa ứng xử chuẩn mực',
      'Ma trận và bản đặc tả chi tiết bám sát khung yêu cầu cần đạt chương trình 2018'
    ],
    zipUrl: EXAM_7MON_RESOURCES.subjects.GDCD.zipUrl,
    exeUrl: EXAM_7MON_RESOURCES.subjects.GDCD.exeUrl,
    accentColor: 'from-indigo-600 to-blue-600',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
  },
  TIN: {
    key: 'TIN',
    name: 'Tin học',
    fullName: 'Môn Tin học THCS',
    icon: '💻',
    size: '34 MB',
    desc: 'Lý thuyết số học, bài tập thực hành phần mềm bảng tính Excel, thuật toán và lập trình Python cơ bản.',
    highlights: [
      'Phần trắc nghiệm lý thuyết số hóa, mạng máy tính và thuật toán tư duy',
      'Bài tập thực hành bảng tính Excel, hệ cơ sở dữ liệu và đoạn mã Python trực quan',
      'Xuất bản đặc tả và đề kiểm tra định kỳ 15 phút, giữa kì, cuối kì đầy đủ đáp án'
    ],
    zipUrl: EXAM_7MON_RESOURCES.subjects.TIN.zipUrl,
    exeUrl: EXAM_7MON_RESOURCES.subjects.TIN.exeUrl,
    accentColor: 'from-cyan-600 to-sky-600',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
  },
  CN: {
    key: 'CN',
    name: 'Công nghệ',
    fullName: 'Môn Công nghệ THCS',
    icon: '⚙️',
    size: '34 MB',
    desc: 'Kiến thức nông nghiệp công nghệ cao, cơ khí chế tạo và mạch điện ứng dụng thực tế CTGDPT 2018.',
    highlights: [
      'Chuyên đề công nghệ gia đình, trồng trọt và chăn nuôi công nghệ cao',
      'Bản vẽ kỹ thuật, cơ khí chế tạo và thiết kế mạch điện ứng dụng an toàn',
      'Đầy đủ ma trận, đặc tả và barem điểm chấm chi tiết theo từng mức độ'
    ],
    zipUrl: EXAM_7MON_RESOURCES.subjects.CN.zipUrl,
    exeUrl: EXAM_7MON_RESOURCES.subjects.CN.exeUrl,
    accentColor: 'from-teal-600 to-emerald-600',
    badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/40'
  },
  LICHSU: {
    key: 'LICHSU',
    name: 'Lịch sử',
    fullName: 'Môn Lịch sử THCS',
    icon: '🏛️',
    size: '91 MB',
    desc: 'Tự động tạo ma trận 16 cột 3 tầng, bản đặc tả 7 cột và đề kiểm tra Lịch sử 6, 7, 8, 9 chuẩn Công văn 7991.',
    highlights: [
      'Cấu trúc chuẩn CV 7991: 12 câu TN (3.0đ), 4 câu Đúng/Sai tư liệu (4.0đ), 2 câu Tự luận (3.0đ)',
      'Bám sát 4 khối lớp 6, 7, 8, 9 sách Kết nối tri thức với cuộc sống',
      'Tích hợp Add-in Word Ribbon và xuất song song Bản Giáo viên & Bản Học sinh'
    ],
    zipUrl: EXAM_LICHSU_THCS_RESOURCES.fullZipUrl,
    exeUrl: EXAM_LICHSU_THCS_RESOURCES.exeUrl,
    accentColor: 'from-amber-600 to-yellow-600',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  }
};

const SUBJECT_KEYS = ['GDCD', 'TOAN', 'VAN', 'KHTN', 'SUDIA', 'LICHSU', 'TIN', 'CN'];

export const TaoDeTHCS8MonModal: React.FC<TaoDeTHCS8MonModalProps> = ({
  isOpen,
  onClose,
  onOpenAdmin,
  selectedSubject,
  initialSubject,
  onSwitchToEnglish
}) => {
  const resolveSubKey = () => {
    const s = selectedSubject || initialSubject || 'GDCD';
    return SUBJECT_DETAILS[s] ? s : 'GDCD';
  };

  const [currentSubjectKey, setCurrentSubjectKey] = useState<string>(resolveSubKey);
  const [activeTab, setActiveTab] = useState<'download' | 'register' | 'preview'>('download');

  // Cấu hình tạo đề trực tuyến
  const [selectedGrade, setSelectedGrade] = useState<string>('7');
  const [selectedTerm, setSelectedTerm] = useState<string>('GK1');
  const [selectedExamCode, setSelectedExamCode] = useState<string>('701');
  const [activeView, setActiveView] = useState<'exam' | 'matrix' | 'spec' | 'answers'>('exam');
  const [examData, setExamData] = useState<THCS8MonExamData>(() => {
    return getTHCS8MonExamSuite(resolveSubKey(), '7', 'GK1', '701');
  });
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Bản quyền & Dùng thử 5 lượt
  const [trialRemaining, setTrialRemaining] = useState<number>(5);
  const [detectedMid, setDetectedMid] = useState<string>('');
  const [isProActive, setIsProActive] = useState<boolean>(false);
  const [inputKey, setInputKey] = useState<string>('');
  const [copiedMid, setCopiedMid] = useState<boolean>(false);
  const [verifyMsg, setVerifyMsg] = useState<string>('');
  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);

  // Đăng ký bản quyền
  const [regName, setRegName] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regSchool, setRegSchool] = useState<string>('');
  const [regPackage, setRegPackage] = useState<'1YEAR' | '2YEAR' | '3YEAR'>('1YEAR');
  const [regSent, setRegSent] = useState<boolean>(false);

  // Khởi tạo môn học và lượt dùng thử khi mở modal (Chống vòng lặp re-render tuyệt đối)
  useEffect(() => {
    if (!isOpen) return;

    const finalSub = resolveSubKey();
    setCurrentSubjectKey(finalSub);

    let mid = localStorage.getItem('gvai_taode_hw_code');
    if (!mid) {
      const randPart = Math.random().toString(36).substring(2, 6).toUpperCase();
      const randPart2 = Math.random().toString(36).substring(2, 6).toUpperCase();
      mid = `EXAM-DVT-${randPart}-${randPart2}`;
      localStorage.setItem('gvai_taode_hw_code', mid);
    }
    setDetectedMid(mid);

    // Kiểm tra bản quyền Pro riêng biệt cho từng môn
    const savedPro = localStorage.getItem(`gvai_taode_${finalSub.toLowerCase()}_is_pro`) === 'true';
    setIsProActive(savedPro);

    // Kiểm tra số lượt dùng thử 5 lần
    const trialKey = `gvai_taode_${finalSub.toLowerCase()}_trial_count`;
    const savedCount = localStorage.getItem(trialKey);
    let remaining = 5;
    if (savedPro) {
      remaining = 999;
    } else if (savedCount !== null) {
      const used = parseInt(savedCount, 10) || 0;
      remaining = Math.max(0, 5 - used);
    }
    setTrialRemaining(remaining);

    // Tải đề mẫu an toàn theo đúng môn hiện tại
    try {
      const suite = getTHCS8MonExamSuite(finalSub, selectedGrade, selectedTerm, selectedExamCode);
      setExamData(suite);
    } catch (e) {
      console.warn('[TaoDeTHCS] Lỗi khởi tạo đề ban đầu:', e);
    }
  }, [isOpen, selectedSubject, initialSubject]);

  if (!isOpen) return null;

  const curSub = SUBJECT_DETAILS[currentSubjectKey] || SUBJECT_DETAILS.GDCD;

  // Xử lý tạo đề mới (Trải nghiệm trực tuyến)


  const handleCopyMid = () => {
    if (detectedMid) {
      navigator.clipboard.writeText(detectedMid);
      setCopiedMid(true);
      setTimeout(() => setCopiedMid(false), 2500);
    }
  };

  const handleActivateKey = () => {
    if (!inputKey.trim()) {
      setVerifyMsg('Vui lòng dán Mã kích hoạt do Thầy Thành cấp!');
      return;
    }
    const cleanKey = inputKey.trim().toUpperCase();
    if (cleanKey.startsWith('KEY-NLS') || cleanKey.startsWith('KEY-ENG') || cleanKey.startsWith('ENG-')) {
      setVerifyMsg('⚠️ Mã kích hoạt này thuộc về phần mềm khác (Tiếng Anh hoặc NLS-AI), không áp dụng cho Tạo Đề THCS!');
      return;
    }
    if (cleanKey.startsWith('KEY-') || cleanKey.startsWith('TH8M-') || cleanKey.startsWith('MATH-') || cleanKey.startsWith('DVT-')) {
      setIsProActive(true);
      localStorage.setItem(`gvai_taode_${currentSubjectKey.toLowerCase()}_is_pro`, 'true');
      setTrialRemaining(999);
      setVerifyMsg(`🎉 Kích hoạt Bản quyền Pro ${curSub.fullName} thành công!`);
    } else {
      setVerifyMsg('Mã kích hoạt không đúng định dạng. Vui lòng kiểm tra lại!');
      webSecurityGuard.recordFailedKeyAttempt(`tao-de-${currentSubjectKey.toLowerCase()}-thcs`, inputKey, detectedMid);
    }
  };

  const handleCloudSync = async () => {
    setIsSyncingCloud(true);
    try {
      const res = await cloudSyncService.checkCurrentMachineCloudStatus(detectedMid, `taode-${currentSubjectKey.toLowerCase()}`);
      if (res.isApproved) {
        setIsProActive(true);
        localStorage.setItem(`gvai_taode_${currentSubjectKey.toLowerCase()}_is_pro`, 'true');
        setTrialRemaining(999);
        alert(`🎉 Chúc mừng Thầy/Cô!\n\nMáy tính [${detectedMid}] đã được duyệt bản quyền ${res.packageType || 'Pro'} cho ứng dụng Tạo Đề ${curSub.name} trên Web Cloud bởi ${res.approvedBy || 'Thầy Thành'}!`);
      } else {
        alert(`ℹ️ Chưa tìm thấy phê duyệt cho ứng dụng Tạo Đề ${curSub.name} trên Cloud của máy tính [${detectedMid}].\n\nNếu Thầy/Cô đã gửi đơn, xin vui lòng chờ Thầy Thành duyệt hoặc nhắn tin Zalo 0915.213717 để được hỗ trợ tức thì!`);
      }
    } catch (e) {
      alert("⚠️ Không thể kết nối Cloud. Vui lòng kiểm tra lại mạng Internet.");
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const handleSendRegistration = async () => {
    if (!regName.trim() || !regPhone.trim()) {
      alert('Vui lòng điền Họ tên và Số điện thoại / Zalo để nhận mã kích hoạt!');
      return;
    }

    const pkgLabel = regPackage === '2YEAR' ? 'Gói 2 Năm VIP' : regPackage === '3YEAR' ? 'Gói 3 Năm Pro' : 'Gói 1 Năm';
    const appId = `taode-${currentSubjectKey.toLowerCase()}`;
    const appName = `Tạo Đề Kiểm Tra ${curSub.fullName}`;

    try {
      await cloudSyncService.submitRegistrationToCloud({
        machineId: detectedMid,
        fullName: regName.trim(),
        phoneNumber: regPhone.trim(),
        schoolUnit: `${regSchool.trim() || 'Trường THCS'} (Môn: ${curSub.name})`,
        appId: appId,
        appName: appName,
        packageType: regPackage
      });
    } catch (e) {
      console.log('Issue error:', e);
    }

    const zaloMsg = `KÍNH GỬI THẦY ĐINH VĂN THÀNH - ĐĂNG KÝ BẢN QUYỀN ${appName.toUpperCase()} (CV 7991)
----------------------------------------
• Họ và tên: ${regName.trim()}
• Điện thoại / Zalo: ${regPhone.trim()}
• Đơn vị: ${regSchool.trim() || 'Trường THCS'}
• Bộ môn: ${curSub.name}
• Gói đăng ký: ${pkgLabel}
• Mã máy tính: ${detectedMid}
----------------------------------------
Kính nhờ Thầy duyệt kích hoạt bản quyền giúp em. Em xin trân trọng cảm ơn!`;

    navigator.clipboard.writeText(zaloMsg);
    setRegSent(true);
    window.open('https://zalo.me/0915213717', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[94vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden">
        
        {/* HEADER MODAL - TÊN MÔN HỌC & TÁC GIẢ */}
        <div className="px-5 py-3.5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${curSub.accentColor} p-0.5 shadow-lg flex items-center justify-center text-white text-2xl`}>
              <span>{curSub.icon}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black text-white tracking-tight uppercase">
                  TẠO ĐỀ {curSub.name.toUpperCase()} (CV 7991)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  CHUẨN CV 7991
                </span>
                {isProActive && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    BẢN QUYỀN PRO
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Tác giả: Thầy giáo Đinh Văn Thành (<span className="text-emerald-400 font-bold">Hotline / Zalo: 0915.213717</span>) – THCS Đồng Yên
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVIGATION TABS (CHUẨN THEO NLS-AI: TẢI VỀ MÁY TÍNH & ĐĂNG KÝ KÍCH HOẠT) */}
        <div className="px-5 pt-2.5 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('download')}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'download'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              1. TẢI BỘ CÀI MÁY TÍNH (.EXE / .ZIP)
            </button>

            <button
              onClick={() => setActiveTab('register')}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              2. BẢN QUYỀN & KÍCH HOẠT
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              3. XEM MẪU ĐỀ THI SƯ PHẠM
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            {isProActive ? (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Bản quyền Pro Đã Kích Hoạt
              </span>
            ) : (
              <button
                onClick={() => setActiveTab('register')}
                className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 font-bold hover:bg-amber-500/20 transition cursor-pointer text-[11px]"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Đăng ký bản quyền Pro</span>
              </button>
            )}
          </div>
        </div>

        {/* NỘI DUNG CHÍNH CỦA 3 TABS */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">
          
          {/* ========================================================================= */}
          {/* TAB 3: XEM MẪU ĐỀ THI SƯ PHẠM (CV 7991) */}
          {/* ========================================================================= */}
          {activeTab === 'preview' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-bold block text-white text-[13px]">Bản Xem Thử Mẫu Đề Kiểm Tra Sư Phạm (CV 7991)</span>
                    <span className="text-[11px] text-amber-200/80">Để tạo đề tự động cho tất cả các khối lớp, sinh ma trận, đặc tả và xuất file Word in ấn, Quý Thầy/Cô vui lòng tải phần mềm về máy tính.</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('download')}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shrink-0 flex items-center gap-1 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Tải Bộ Cài Ngay
                </button>
              </div>
              
              {/* THANH ĐIỀU KHIỂN CẤU HÌNH ĐỀ THI */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* CHỌN BỘ MÔN */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Môn học:</label>
                    <select
                      value={currentSubjectKey}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCurrentSubjectKey(val);
                        try {
                          const suite = getTHCS8MonExamSuite(val, selectedGrade, selectedTerm, selectedExamCode);
                          setExamData(suite);
                        } catch (err) {
                          console.warn(err);
                        }
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-blue-500"
                    >
                      <option value="GDCD">⚖️ Môn GDCD</option>
                      <option value="TOAN">📐 Môn Toán học</option>
                      <option value="VAN">📖 Môn Ngữ văn</option>
                      <option value="KHTN">🔬 Khoa học tự nhiên</option>
                      <option value="SUDIA">🌍 Lịch sử & Địa lí</option>
                      <option value="TIN">💻 Môn Tin học</option>
                      <option value="CN">⚙️ Môn Công nghệ</option>
                    </select>
                  </div>

                  {/* CHỌN KHỐI LỚP */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Khối lớp:</label>
                    <select
                      value={selectedGrade}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedGrade(val);
                        try {
                          const suite = getTHCS8MonExamSuite(currentSubjectKey, val, selectedTerm, selectedExamCode);
                          setExamData(suite);
                        } catch (err) {
                          console.warn(err);
                        }
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-blue-500"
                    >
                      <option value="6">Lớp 6 (KNTT)</option>
                      <option value="7">Lớp 7 (KNTT)</option>
                      <option value="8">Lớp 8 (KNTT)</option>
                      <option value="9">Lớp 9 (KNTT)</option>
                    </select>
                  </div>

                  {/* CHỌN KỲ THI */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Kỳ kiểm tra:</label>
                    <select
                      value={selectedTerm}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedTerm(val);
                        try {
                          const suite = getTHCS8MonExamSuite(currentSubjectKey, selectedGrade, val, selectedExamCode);
                          setExamData(suite);
                        } catch (err) {
                          console.warn(err);
                        }
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-blue-500"
                    >
                      <option value="15P">Đề 15 phút</option>
                      <option value="GK1">Giữa học kỳ 1 (45p)</option>
                      <option value="CK1">Cuối học kỳ 1 (45p)</option>
                      <option value="GK2">Giữa học kỳ 2 (45p)</option>
                      <option value="CK2">Cuối học kỳ 2 (45p)</option>
                    </select>
                  </div>

                  {/* CHỌN MÃ ĐỀ */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Mã đề thi:</label>
                    <select
                      value={selectedExamCode}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedExamCode(val);
                        try {
                          const suite = getTHCS8MonExamSuite(currentSubjectKey, selectedGrade, selectedTerm, val);
                          setExamData(suite);
                        } catch (err) {
                          console.warn(err);
                        }
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-blue-500"
                    >
                      <option value="701">Mã đề 701</option>
                      <option value="702">Mã đề 702</option>
                      <option value="703">Mã đề 703</option>
                      <option value="704">Mã đề 704</option>
                    </select>
                  </div>
                </div>

                {/* THANH ĐIỀU HƯỚNG TẢI PHẦN MỀM & ĐĂNG KÝ BẢN QUYỀN TRÊN MÁY TÍNH */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('download')}
                    className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>📥 TẢI PHẦN MỀM ĐỂ TẠO ĐỀ & XUẤT WORD TRÊN MÁY TÍNH</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 transition cursor-pointer"
                  >
                    <Crown className="w-4 h-4" />
                    <span>🔑 ĐĂNG KÝ BẢN QUYỀN PRO SƯ PHẠM</span>
                  </button>
                </div>
              </div>

              {/* 4 TAB XEM NỘI DUNG: ĐỀ THI - MA TRẬN - BẢN ĐẶC TẢ - ĐÁP ÁN */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
                <button
                  onClick={() => setActiveView('exam')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    activeView === 'exam'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  1. ĐỀ THI HỌC SINH
                </button>

                <button
                  onClick={() => setActiveView('matrix')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    activeView === 'matrix'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  <Table className="w-3.5 h-3.5" />
                  2. MA TRẬN ĐỀ (CV 7991)
                </button>

                <button
                  onClick={() => setActiveView('spec')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    activeView === 'spec'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  <ListChecks className="w-3.5 h-3.5" />
                  3. BẢN ĐẶC TẢ KỸ THUẬT
                </button>

                <button
                  onClick={() => setActiveView('answers')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    activeView === 'answers'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  4. ĐÁP ÁN & BIỂU ĐIỂM
                </button>
              </div>

              {/* KHUNG HIỂN THỊ NỘI DUNG SƯ PHẠM CHUẨN */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white text-slate-900 border border-slate-300 shadow-inner font-serif text-[13pt] leading-relaxed max-h-[55vh] overflow-y-auto custom-scrollbar">
                
                {/* 1. XEM ĐỀ THI HỌC SINH */}
                {activeView === 'exam' && examData && (
                  <div className="space-y-4">
                    {/* TIÊU ĐỀ ĐỀ THI SƯ PHẠM */}
                    <div className="grid grid-cols-2 gap-4 pb-3 border-b-2 border-slate-800 text-center">
                      <div>
                        <p className="font-bold text-xs uppercase">{examData.parentAgency || 'PHÒNG GIÁO DỤC VÀ ĐÀO TẠO ....................'}</p>
                        <p className="font-black text-sm uppercase text-[#123A63]">{examData.schoolName || 'TRƯỜNG THCS ....................'}</p>
                      </div>
                      <div>
                        <p className="font-black text-sm uppercase text-[#FF0000]">
                          ĐỀ KIỂM TRA {examData.termTitle?.toUpperCase() || 'GIỮA HỌC KỲ I'}
                        </p>
                        <p className="font-bold text-xs">MÔN: {examData.subjectName?.toUpperCase()} {examData.grade}</p>
                        <p className="text-[11px] italic">Thời gian: {examData.timeMinutes} phút | Mã đề: {examData.examCode}</p>
                      </div>
                    </div>

                    {/* NỘI DUNG CÁC PHẦN ĐỀ THI */}
                    {examData.parts?.map((part, pIdx) => (
                      <div key={pIdx} className="space-y-3 pt-2">
                        <div className="font-bold text-[#FF0000] text-sm">
                          {part.title} ({part.points})
                        </div>
                        {part.instruction && (
                          <p className="italic text-xs text-slate-700">{part.instruction}</p>
                        )}
                        <div className="space-y-2.5">
                          {part.questions?.map((q, qIdx) => (
                            <div key={qIdx} className="text-xs leading-relaxed">
                              <p className="font-medium text-slate-900">
                                <strong>Câu {q.num}:</strong> {q.content}
                              </p>
                              {q.options && q.options.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1.5 pl-3">
                                  {q.options.map((opt, oIdx) => (
                                    <div key={oIdx} className="text-slate-800">
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
                  </div>
                )}

                {/* 2. XEM MA TRẬN ĐỀ THI (CV 7991) */}
                {activeView === 'matrix' && examData?.matrix && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-[#FF0000] text-center uppercase">
                      KHUNG MA TRẬN ĐỀ KIỂM TRA {examData.subjectName?.toUpperCase()} {examData.grade} (CV 7991)
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[11px] border-collapse border border-slate-400">
                        <thead>
                          <tr className="bg-slate-100 text-slate-900 font-bold">
                            {examData.matrix.headers.map((h, i) => (
                              <th key={i} className="border border-slate-400 p-2 text-center">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {examData.matrix.rows.map((row, rIdx) => (
                            <tr key={rIdx} className={rIdx === examData.matrix!.rows.length - 1 ? 'font-bold bg-slate-50' : ''}>
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="border border-slate-400 p-2 text-center">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 3. XEM BẢN ĐẶC TẢ KỸ THUẬT (CV 7991) */}
                {activeView === 'spec' && examData?.specification && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-[#FF0000] text-center uppercase">
                      BẢN ĐẶC TẢ KỸ THUẬT ĐỀ KIỂM TRA {examData.subjectName?.toUpperCase()} {examData.grade} (CV 7991)
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[11px] border-collapse border border-slate-400">
                        <thead>
                          <tr className="bg-slate-100 text-slate-900 font-bold">
                            {examData.specification.headers.map((h, i) => (
                              <th key={i} className="border border-slate-400 p-2 text-center">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {examData.specification.rows.map((row, rIdx) => (
                            <tr key={rIdx}>
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="border border-slate-400 p-2 text-left">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 4. XEM ĐÁP ÁN & BIỂU ĐIỂM CHI TIẾT */}
                {activeView === 'answers' && examData && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-[#FF0000] text-center uppercase">
                      HƯỚNG DẪN CHẤM & ĐÁP ÁN ĐỀ {examData.examCode} - {examData.subjectName?.toUpperCase()} {examData.grade}
                    </h4>

                    {/* BẢNG ĐÁP ÁN TRẮC NGHIỆM */}
                    <div className="space-y-2">
                      <h5 className="font-bold text-xs text-slate-900">I. ĐÁP ÁN PHẦN TRẮC NGHIỆM KHÁCH QUAN:</h5>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center text-xs">
                        {examData.parts?.[0]?.questions?.map((q, idx) => (
                          <div key={idx} className="p-1.5 border border-slate-300 rounded bg-slate-50">
                            <span className="font-bold text-slate-700 block">C{q.num}</span>
                            <span className="font-black text-[#FF0000]">{q.correctKey || 'A'}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* BIỂU ĐIỂM TỰ LUẬN TÌNH HUỐNG */}
                    {examData.parts?.[1] && (
                      <div className="space-y-2 pt-3 border-t border-slate-200">
                        <h5 className="font-bold text-xs text-slate-900">II. HƯỚNG DẪN CHẤM PHẦN TỰ LUẬN XỬ LÝ TÌNH HUỐNG:</h5>
                        {examData.parts[1].questions?.map((t, idx) => (
                          <div key={idx} className="p-2.5 bg-slate-50 rounded border border-slate-200 text-xs space-y-1">
                            <p className="font-bold text-blue-900">{t.num} ({t.points}):</p>
                            <p className="text-slate-800 whitespace-pre-line">{t.content}</p>
                            <p className="text-emerald-700 font-semibold mt-1">
                              ✓ Tiêu chuẩn chấm: Trả lời đúng trọng tâm chuẩn mực đạo đức & pháp luật, lập luận logic, nêu được giải pháp thực tiễn.
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: TẢI VỀ BỘ CÀI ĐẶT RIÊNG BIỆT CHO MÔN ĐANG CHỌN (CHUẨN NLS-AI) */}
          {/* ========================================================================= */}
          {activeTab === 'download' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              
              {/* THANH CHỌN BỘ MÔN CẦN TẢI CÀI ĐẶT */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300">Bộ môn đang chọn:</span>
                  <span className="text-xs text-cyan-400 font-bold uppercase">{curSub.name}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-end">
                  {SUBJECT_KEYS.map((key) => {
                    const subItem = SUBJECT_DETAILS[key];
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setCurrentSubjectKey(key)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                          currentSubjectKey === key
                            ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        <span>{subItem.icon}</span>
                        <span>{subItem.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CARD TẢI BỘ CÀI CHÍNH */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950/30 to-slate-900 border border-cyan-500/40 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl p-3 rounded-2xl bg-slate-950 border border-slate-800 shrink-0">
                      {curSub.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base sm:text-lg font-black text-white">
                          BỘ CÀI ĐẶT TẠO ĐỀ {curSub.fullName.toUpperCase()}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {curSub.size}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                        {curSub.desc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3 ĐIỂM NỔI BẬT */}
                <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {curSub.highlights.map((h, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* NÚT TẢI XUỐNG CHÍNH MÔN THCS */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-3">
                  <a
                    href={curSub.zipUrl}
                    download={`Bo_Cai_Tao_De_${curSub.name.replace(/\s+/g, '_')}_THCS_Pass_123.zip`}
                    className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20 cursor-pointer hover:scale-[1.01]"
                  >
                    <Download className="w-4 h-4" />
                    <span>🚀 TẢI BỘ CÀI ĐẶT PRO (.ZIP - MẬT KHẨU: 123)</span>
                  </a>
                </div>
              </div>

              {/* HƯỚNG DẪN CÀI ĐẶT 3 BƯỚC */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h5 className="font-bold text-white text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  HƯỚNG DẪN CÀI ĐẶT & SỬ DỤNG MÔN {curSub.name.toUpperCase()} (3 BƯỚC NHANH):
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center">1</span>
                    <h6 className="font-bold text-white text-xs">Tải file .ZIP về máy</h6>
                    <p className="text-[11px] text-slate-400">Bấm nút tải ở trên. File lưu về dạng ZIP mật khẩu 123.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center">2</span>
                    <h6 className="font-bold text-white text-xs">Giải nén bằng Pass: 123</h6>
                    <p className="text-[11px] text-slate-400">Nhấp chuột phải vào file ZIP ➔ Extract Here ➔ Nhập mật khẩu: <strong className="text-amber-300">123</strong>.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">3</span>
                    <h6 className="font-bold text-white text-xs">Chạy ứng dụng</h6>
                    <p className="text-[11px] text-slate-400">Nhấp đúp chuột vào file để mở phần mềm tạo đề {curSub.name} ngay tức thì.</p>
                  </div>
                </div>
              </div>

              {/* VIDEO HƯỚNG DẪN */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Play className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">Video Hướng Dẫn Ra Đề & Sử Dụng Phần Mềm</h5>
                    <p className="text-[11px] text-slate-400">Xem quy trình ra đề kiểm tra định kỳ chuẩn mẫu Công văn 7991</p>
                  </div>
                </div>
                <a
                  href="/HD_Tao_De_Tieng_Anh_THCS.mp4"
                  download="Huong_Dan_Tao_De_THCS_CV7991.mp4"
                  target="_blank"
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Xem Video
                </a>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: ĐĂNG KÝ BẢN QUYỀN ĐỘC LẬP TỪNG BỘ MÔN */}
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
                      • Phần mềm: <strong>TẠO ĐỀ KIỂM TRA {curSub.fullName.toUpperCase()} (CV 7991)</strong>
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                  <a
                    href="https://zalo.me/0915213717"
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

              {/* FORM ĐĂNG KÝ BẢN QUYỀN */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Key className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-white">
                    ĐĂNG KÝ BẢN QUYỀN {curSub.fullName.toUpperCase()}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Trường / Đơn vị:</label>
                    <input
                      type="text"
                      value={regSchool}
                      onChange={(e) => setRegSchool(e.target.value)}
                      placeholder="Ví dụ: Trường THCS Chu Văn An..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Bộ môn giảng dạy:</label>
                    <select
                      value={currentSubjectKey}
                      onChange={(e) => setCurrentSubjectKey(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="GDCD">⚖️ Môn Giáo dục công dân</option>
                      <option value="TOAN">📐 Môn Toán học</option>
                      <option value="VAN">📖 Môn Ngữ văn</option>
                      <option value="KHTN">🔬 Môn Khoa học tự nhiên</option>
                      <option value="SUDIA">🌍 Môn Lịch sử và Địa lí</option>
                      <option value="TIN">💻 Môn Tin học</option>
                      <option value="CN">⚙️ Môn Công nghệ</option>
                    </select>
                  </div>
                </div>

                {/* MÃ MÁY TÍNH */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Laptop className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Mã máy tính của bạn:</span>
                      <span className="text-xs font-mono font-bold text-cyan-300">{detectedMid}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyMid}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    {copiedMid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedMid ? 'Đã sao chép' : 'Sao chép'}</span>
                  </button>
                </div>

                {/* GÓI BẢN QUYỀN - KHÔNG HIỂN THỊ GIÁ TIỀN TĨNH THEO QUY CHUẨN SƯ PHẠM */}
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1.5">Gói bản quyền đăng ký:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRegPackage('1YEAR')}
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                        regPackage === '1YEAR'
                          ? 'bg-blue-600/30 border-blue-500 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-xs font-bold block">Gói 1 Năm</span>
                      <span className="text-[10px] text-slate-400">Chuẩn 365 ngày</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegPackage('2YEAR')}
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                        regPackage === '2YEAR'
                          ? 'bg-amber-600/30 border-amber-500 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-xs font-bold block text-amber-300">Gói 2 Năm VIP</span>
                      <span className="text-[10px] text-slate-400">Khuyên dùng</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegPackage('3YEAR')}
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                        regPackage === '3YEAR'
                          ? 'bg-purple-600/30 border-purple-500 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-xs font-bold block text-purple-300">Gói 3 Năm Pro</span>
                      <span className="text-[10px] text-slate-400">Dài hạn</span>
                    </button>
                  </div>
                </div>

                {/* NÚT GỬI ĐĂNG KÝ */}
                <button
                  type="button"
                  onClick={handleSendRegistration}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>GỬI ĐĂNG KÝ BẢN QUYỀN MÔN {curSub.name.toUpperCase()} (QUA ZALO)</span>
                </button>

                {regSent && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>Đã tạo thông tin đăng ký môn {curSub.name}! Đang chuyển tiếp đến Zalo Thầy Đinh Văn Thành...</span>
                  </div>
                )}
              </div>

              {/* Ô NHẬP MÃ KÍCH HOẠT PRO */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-white uppercase">
                    KÍCH HOẠT BẢN QUYỀN MÔN {curSub.name.toUpperCase()} KHI ĐÃ CÓ KEY
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="Dán mã kích hoạt (KEY-...) Thầy Thành cấp tại đây"
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
              </div>

              {/* NÚT ĐỒNG BỘ BẢN QUYỀN TỪ CLOUD */}
              <button
                onClick={handleCloudSync}
                disabled={isSyncingCloud}
                className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncingCloud ? 'animate-spin' : ''}`} />
                <span>{isSyncingCloud ? 'ĐANG KẾT NỐI VÀ ĐỒNG BỘ TỪ WEB CLOUD...' : '🔄 CẬP NHẬT / ĐỒNG BỘ BẢN QUYỀN TỪ WEB CLOUD (LÀM MỚI TỨC THÌ)'}</span>
              </button>

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
