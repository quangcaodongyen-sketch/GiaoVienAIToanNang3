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
  Play
} from 'lucide-react';
import { BRAND, EXAM_7MON_RESOURCES } from '../config/brand';
import { cloudSyncService } from '../services/cloudSyncService';

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
  }
};

const SUBJECT_KEYS = ['TOAN', 'VAN', 'KHTN', 'SUDIA', 'GDCD', 'TIN', 'CN'];

export const TaoDeTHCS8MonModal: React.FC<TaoDeTHCS8MonModalProps> = ({
  isOpen,
  onClose,
  onOpenAdmin,
  selectedSubject,
  initialSubject,
  onSwitchToEnglish
}) => {
  const [currentSubjectKey, setCurrentSubjectKey] = useState<string>('TOAN');
  const [activeTab, setActiveTab] = useState<'download' | 'register'>('download');

  const [detectedMid, setDetectedMid] = useState<string>('');
  const [isProActive, setIsProActive] = useState<boolean>(false);
  const [inputKey, setInputKey] = useState<string>('');
  const [copiedMid, setCopiedMid] = useState<boolean>(false);
  const [verifyMsg, setVerifyMsg] = useState<string>('');

  const [regName, setRegName] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regSchool, setRegSchool] = useState<string>('');
  const [regPackage, setRegPackage] = useState<'1YEAR' | '2YEAR' | '3YEAR'>('1YEAR');
  const [regSent, setRegSent] = useState<boolean>(false);

  // Khởi tạo môn học khi mở modal
  useEffect(() => {
    if (!isOpen) return;

    const sub = selectedSubject || initialSubject || 'TOAN';
    if (SUBJECT_DETAILS[sub]) {
      setCurrentSubjectKey(sub);
    } else {
      setCurrentSubjectKey('TOAN');
    }

    let mid = localStorage.getItem('gvai_taode_hw_code');
    if (!mid) {
      const randPart = Math.random().toString(36).substring(2, 6).toUpperCase();
      const randPart2 = Math.random().toString(36).substring(2, 6).toUpperCase();
      mid = `EXAM-DVT-${randPart}-${randPart2}`;
      localStorage.setItem('gvai_taode_hw_code', mid);
    }
    setDetectedMid(mid);

    const savedPro = localStorage.getItem(`gvai_taode_${currentSubjectKey.toLowerCase()}_is_pro`) || localStorage.getItem('gvai_8mon_is_pro');
    if (savedPro === 'true') {
      setIsProActive(true);
    } else {
      setIsProActive(false);
    }
  }, [isOpen, selectedSubject, initialSubject, currentSubjectKey]);

  if (!isOpen) return null;

  const curSub = SUBJECT_DETAILS[currentSubjectKey] || SUBJECT_DETAILS.TOAN;

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
    if (inputKey.trim().startsWith('KEY-') || inputKey.trim().length > 15) {
      setIsProActive(true);
      localStorage.setItem(`gvai_taode_${currentSubjectKey.toLowerCase()}_is_pro`, 'true');
      setVerifyMsg(`🎉 Kích hoạt Bản quyền Pro ${curSub.fullName} thành công!`);
    } else {
      setVerifyMsg('Mã kích hoạt không đúng định dạng. Vui lòng kiểm tra lại!');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden">
        
        {/* HEADER MODAL - TÊN TỪNG MÔN ĐỘC LẬP */}
        <div className="px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${curSub.accentColor} p-0.5 shadow-lg flex items-center justify-center text-white text-2xl`}>
              <span>{curSub.icon}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight uppercase">
                  TẠO ĐỀ {curSub.name.toUpperCase()} (CV 7991)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  CHUẨN CV 7991
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Tác giả: Thầy giáo Đinh Văn Thành (<span className="text-emerald-400 font-bold">Hotline / Zalo: 0915.213717</span>)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVIGATION TABS (2 TABS GỌN GÀNG) */}
        <div className="px-6 pt-3 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('download')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'download'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Download className="w-4 h-4" />
              TẢI BỘ CÀI ĐẶT
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Key className="w-4 h-4" />
              ĐĂNG KÝ BẢN QUYỀN
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-400">
            {isProActive ? (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Bản quyền Pro đã kích hoạt
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                ⏳ Bản dùng thử (Môn {curSub.name})
              </span>
            )}
          </div>
        </div>

        {/* NỘI DUNG 2 TABS */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
          
          {/* ========================================================================= */}
          {/* TAB 1: TẢI VỀ BỘ CÀI ĐẶT RIÊNG BIỆT CỦA MÔN ĐANG CHỌN */}
          {/* ========================================================================= */}
          {activeTab === 'download' && (
            <div className="space-y-5 max-w-3xl mx-auto">
              
              {/* CARD TẢI BỘ CÀI CHÍNH CỦA MÔN ĐANG CHỌN */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950/30 to-slate-900 border border-cyan-500/40 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl p-3 rounded-2xl bg-slate-950 border border-slate-800 shrink-0">
                      {curSub.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-lg font-black text-white">
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

                {/* NÚT TẢI XUỐNG RIÊNG CHO MÔN */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={curSub.zipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/20 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>TẢI BẢN ZIP (PASS: 123)</span>
                  </a>

                  <a
                    href={curSub.exeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
                    title="Tải trực tiếp tệp chạy .EXE của môn này"
                  >
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>Tải file .EXE trực tiếp</span>
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
                    <p className="text-[11px] text-slate-400">Bấm nút tải ở trên và lưu file vào ổ D: hoặc Desktop.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center">2</span>
                    <h6 className="font-bold text-white text-xs">Giải nén bằng Pass: 123</h6>
                    <p className="text-[11px] text-slate-400">Nhấp chuột phải vào file ZIP ➔ Chọn Extract Here ➔ Nhập mật khẩu: <strong className="text-amber-300">123</strong>.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">3</span>
                    <h6 className="font-bold text-white text-xs">Chạy ứng dụng</h6>
                    <p className="text-[11px] text-slate-400">Nhấp đúp chuột vào file để mở phần mềm tạo đề {curSub.name} ngay tức thì.</p>
                  </div>
                </div>
              </div>

              {/* HƯỚNG DẪN KHI CỐC CỐC / CHROME / WINDOWS BÁO TỆP LẠ */}
              <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-left space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>LƯU Ý KHI TRÌNH DUYỆT BÁO "TỆP NGUY HIỂM / LỖI TẢI XUỐNG":</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  💡 Do phần mềm giáo dục được lập trình Native đóng gói độc lập, chưa đăng ký chứng chỉ doanh nghiệp có trả phí của Microsoft nên Cốc Cốc / Chrome / Defender có thể cảnh báo nhận diện nhầm (False Positive). Phần mềm <strong>an toàn 100%</strong>. Khuyên dùng bấm <strong>Tải bản ZIP (Pass: 123)</strong> để tải mượt mà không bị chặn, hoặc chọn "Giữ lại / Keep anyway".
                </p>
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
          {/* TAB 2: ĐĂNG KÝ BẢN QUYỀN ĐỘC LẬP TỪNG BỘ MÔN (KHÔNG CÓ GÓI TRỌN 7 MÔN) */}
          {/* ========================================================================= */}
          {activeTab === 'register' && (
            <div className="space-y-5 max-w-2xl mx-auto">
              
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Key className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-white">
                    ĐĂNG KÝ BẢN QUYỀN {curSub.fullName.toUpperCase()}
                  </h4>
                </div>

                {/* THÔNG TIN NGƯỜI ĐĂNG KÝ */}
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
                      placeholder="Ví dụ: Trường THCS Đồng Yên"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Bộ môn giảng dạy:</label>
                    {/* CHỈ CÓ 7 BỘ MÔN ĐỘC LẬP - TUYỆT ĐỐI KHÔNG CÓ TRỌN BỘ 7 MÔN */}
                    <select
                      value={currentSubjectKey}
                      onChange={(e) => setCurrentSubjectKey(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="TOAN">Môn Toán học</option>
                      <option value="VAN">Môn Ngữ văn</option>
                      <option value="KHTN">Môn Khoa học tự nhiên</option>
                      <option value="SUDIA">Môn Lịch sử và Địa lí</option>
                      <option value="GDCD">Môn Giáo dục công dân</option>
                      <option value="TIN">Môn Tin học</option>
                      <option value="CN">Môn Công nghệ</option>
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

                {/* CHỌN GÓI BẢN QUYỀN CHO BỘ MÔN */}
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

            </div>
          )}

        </div>

        {/* FOOTER MODAL */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400 shrink-0">
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
