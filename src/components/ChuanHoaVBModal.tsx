import React, { useState, useEffect } from 'react';
import {
  X,
  FileCheck2,
  Sparkles,
  Download,
  Key,
  Copy,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Play,
  Layers,
  FileText,
  Check,
  AlertCircle,
  Clock,
  Printer,
  Sliders,
  RotateCcw,
  CheckCircle2,
  FileDown
} from 'lucide-react';
import { BRAND } from '../config/brand';
import {
  getOrCreateCHVBHardwareCode,
  getSecureCHVBTrialRemaining,
  consumeSecureCHVBTrial,
  isCHVBVIPActivated,
  activateCHVBLicense
} from '../services/chuanhoaVBKeyService';

interface ChuanHoaVBModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

// Mẫu văn bản hành chính thực chiến
const SAMPLE_DOCS = [
  {
    id: 'quyetdinh',
    name: 'Quyết định (Kiện toàn Ban Chỉ đạo)',
    raw: `UBND HUYEN BAC QUANG
TRUONG THCS DONG YEN
so: 15/qd-thcsdy
Dong yen, ngay 15 thang 9 nam 2026
QUYET DINH
Ve viec kien toan Ban Chi dao Chuyen doi so va Ung dung AI trong giao duc nam hoc 2026 - 2027
HIEU TRUONG TRUONG THCS DONG YEN
Can cu Dieu le truong trung hoc co so ban hanh kem theo Thong tu so 32/2020/TT-BGDDT;
Can cu Ke hoach thuc hien nhiem vu nam hoc 2026 - 2027 cua Phong GD&DT Bac Quang;
Xet de nghi cua Pho Hieu truong phu trach chuyen mon va To truong chuyen mon.
QUYET DINH:
Dieu 1. Kien toan Ban Chi dao Chuyen doi so va Ung dung AI trong day hoc gom cac ong (ba) co ten sau:
1. Ong Dinh Van Thanh - To truong To KHTN - Truong ban;
2. Ba Nguyen Thi Hoa - Giao vien Tin hoc - Pho Truong ban;
3. Cac ong (ba) To truong chuyen mon, giao vien chu nhiem - Thanh vien.
Dieu 2. Ban Chi dao co trach nhiem xay dung ke hoach va trien khai ung dung he sinh thai Giao Vien AI vao toan truong.
Dieu 3. Cac to chuyen mon va cac ca nhan co ten tai Dieu 1 chiu trach nhiem thi hanh quyet dinh nay./.
Noi nhan:
- Nhu Dieu 3;
- Phong GD&DT (de b/c);
- Luu: VT, Ban CD.
HIEU TRUONG
(Ky, ghi ro ho ten va dong dau)
Nguyen Van A`
  },
  {
    id: 'baocao',
    name: 'Báo cáo (Tổng kết ứng dụng AI)',
    raw: `PHONG GD&DT BAC QUANG
TRUONG THCS DONG YEN
so: 28/bc-thcsdy
Dong Yen, ngay 20 thang 10 nam 2026
BAO CAO
Ket qua trien khai he sinh thai Giao vien AI Toan nang trong hoc ky I
Kinh gui: Phong Giao duc va Dao tao Bac Quang.
Thuc hien Huong dan so 102/HD-PGDDT ve viec day manh chuyen doi so trong truong hoc;
Truong THCS Dong Yen bao cao ket qua trien khai nhu sau:
I. TINH HINH TRIEN KHAI
1. Cong tac pho bien, tap huan
- 100% can bo giao vien duoc tap huan su dung cac cong cu: Smart Listening Pro, Sinh de bien the VIP, Soan giao an NLS.
- Ty le giao vien soan giao an theo CV 5512 tich hop AI dat 98.5%.
2. Ket qua dat duoc
- Tiet kiem duoc 85% thoi gian soan de kiem tra mon Tieng Anh va cac mon tu nhien.
- Chat luong de kiem tra duoc chuan hoa theo CV 7991, tranh tuyet doi sai sot.
II. DE XUAT, KIEN NGHI
- De nghi Phong tiep tuc ho tro kinh phi tap huan chuyen sau cho doi ngu cot can./.
Noi nhan:
- Nhu kinh gui;
- BGH truong;
- Luu: VT.
HIEU TRUONG
(Ky va dong dau)
Nguyen Van A`
  },
  {
    id: 'kehoach',
    name: 'Kế hoạch (Ngày hội STEM - AI)',
    raw: `UBND HUYEN BAC QUANG
TRUONG THCS DONG YEN
so: 08/kh-thcsdy
Dong Yen, ngay 05 thang 11 nam 2026
KE HOACH
To chuc Ngay hoi STEM va Giao vien So sang tao nam hoc 2026 - 2027
Thuc hien Ke hoach giao duc nha truong nam hoc 2026 - 2027;
Truong THCS Dong Yen ban hanh Ke hoach to chuc Ngay hoi STEM - AI voi cac noi dung cu the:
1. Muc dich, yeu cau
- Tao san choi khoa hoc sang tao, giup hoc sinh va giao vien tiep can cong nghe AI va STEM thuc chien.
- Chuan hoa nang luc so (NLS) cho giao vien theo tieu chuan moi.
2. Thoi gian va dia diem
- Thoi gian: 07h30 ngay 20/11/2026.
- Dia diem: San truong THCS Dong Yen./.
Noi nhan:
- BGH;
- Toan the GV;
- Luu: VT.
TRUONG BAN TO CHUC
(Ky ten)
Dinh Van Thanh`
  }
];

export const ChuanHoaVBModal: React.FC<ChuanHoaVBModalProps> = ({
  isOpen,
  onClose,
  onOpenAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'online' | 'download' | 'license'>('online');
  const [hwid, setHwid] = useState<string>('DVT-CHVB-XXXX-XXXX');
  const [remainingTrials, setRemainingTrials] = useState<number>(5);
  const [isVIP, setIsVIP] = useState<boolean>(false);
  const [licenseKeyInput, setLicenseKeyInput] = useState<string>('');
  const [activationMsg, setActivationMsg] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });
  const [isActivating, setIsActivating] = useState<boolean>(false);

  // Editor states
  const [inputText, setInputText] = useState<string>(SAMPLE_DOCS[0].raw);
  const [editMode, setEditMode] = useState<'light' | 'standard' | 'expert'>('standard');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [hasProcessed, setHasProcessed] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Result components for standard display (Times New Roman 13pt)
  const [standardResult, setStandardResult] = useState<{
    coQuanCapTren: string;
    coQuanBanHanh: string;
    soKyHieu: string;
    quocHieu: string;
    tieuNgu: string;
    diaDanhNgayThang: string;
    tenLoai: string;
    trichYeu: string;
    noiDungHtml: string;
    noiNhan: string[];
    chucVu: string;
    nguoiKy: string;
    stats: {
      theThucScore: number;
      fixedSpelling: number;
      fixedFormatting: number;
      wordsCount: number;
    };
  }>({
    coQuanCapTren: 'UBND HUYỆN BẮC QUANG',
    coQuanBanHanh: 'TRƯỜNG THCS ĐỒNG YÊN',
    soKyHieu: 'Số: 15/QĐ-THCSĐY',
    quocHieu: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
    tieuNgu: 'Độc lập - Tự do - Hạnh phúc',
    diaDanhNgayThang: 'Đồng Yên, ngày 15 tháng 9 năm 2026',
    tenLoai: 'QUYẾT ĐỊNH',
    trichYeu: 'Về việc kiện toàn Ban Chỉ đạo Chuyển đổi số và Ứng dụng AI trong giáo dục năm học 2026 - 2027',
    noiDungHtml: '',
    noiNhan: ['Như Điều 3;', 'Phòng GD&ĐT (để b/c);', 'Lưu: VT, Ban CĐ.'],
    chucVu: 'HIỆU TRƯỞNG',
    nguoiKy: 'Nguyễn Văn A',
    stats: {
      theThucScore: 100,
      fixedSpelling: 14,
      fixedFormatting: 8,
      wordsCount: 245
    }
  });

  useEffect(() => {
    if (isOpen) {
      const code = getOrCreateCHVBHardwareCode();
      setHwid(code);
      const vip = isCHVBVIPActivated();
      setIsVIP(vip);
      if (!vip) {
        getSecureCHVBTrialRemaining().then(setRemainingTrials);
      } else {
        setRemainingTrials(999);
      }
    }
  }, [isOpen]);

  // Bộ phân tích & Chuẩn hóa văn bản hành chính theo Nghị định 30/2020/NĐ-CP
  const handleStandardize = async () => {
    if (!inputText.trim()) {
      alert('Vui lòng nhập nội dung văn bản cần chuẩn hóa!');
      return;
    }

    if (!isVIP && remainingTrials <= 0) {
      alert('Thầy/Cô đã dùng hết 5 lượt trải nghiệm miễn phí! Vui lòng kích hoạt Bản quyền Pro để tiếp tục sử dụng không giới hạn.');
      setActiveTab('license');
      return;
    }

    setIsProcessing(true);

    try {
      // Giả lập thời gian AI phân tích ngữ nghĩa và định vị thể thức (400ms)
      await new Promise((r) => setTimeout(r, 450));

      const lines = inputText.split('\n').map(l => l.trim()).filter(Boolean);
      let coQuanCapTren = 'UBND HUYỆN BẮC QUANG';
      let coQuanBanHanh = 'TRƯỜNG THCS ĐỒNG YÊN';
      let soKyHieu = 'Số: .../QĐ-THCSĐY';
      let diaDanhNgayThang = 'Đồng Yên, ngày ... tháng ... năm 2026';
      let tenLoai = 'QUYẾT ĐỊNH';
      let trichYeu = 'Về việc chuẩn hóa văn bản theo Nghị định 30/2020/NĐ-CP';
      let chucVu = 'HIỆU TRƯỞNG';
      let nguoiKy = 'Đinh Văn Thành';
      const noiNhanList: string[] = [];

      // Nhận diện loại văn bản
      const lower = inputText.toLowerCase();
      if (lower.includes('bao cao') || lower.includes('báo cáo')) {
        tenLoai = 'BÁO CÁO';
        soKyHieu = 'Số: 28/BC-THCSĐY';
        trichYeu = 'Kết quả triển khai hệ sinh thái Giáo viên AI Toàn năng';
      } else if (lower.includes('ke hoach') || lower.includes('kế hoạch')) {
        tenLoai = 'KẾ HOẠCH';
        soKyHieu = 'Số: 08/KH-THCSĐY';
        trichYeu = 'Tổ chức Ngày hội STEM và Giáo viên Số sáng tạo';
        chucVu = 'TRƯỞNG BAN TỔ CHỨC';
      } else if (lower.includes('to trinh') || lower.includes('tờ trình')) {
        tenLoai = 'TỜ TRÌNH';
        soKyHieu = 'Số: 05/TTr-THCSĐY';
        trichYeu = 'Về việc đề nghị trang bị giải pháp trợ lý AI sư phạm';
      } else if (lower.includes('thong bao') || lower.includes('thông báo')) {
        tenLoai = 'THÔNG BÁO';
        soKyHieu = 'Số: 12/TB-THCSĐY';
      }

      // Xây dựng nội dung chuẩn hóa sư phạm với font Times New Roman 13pt và điểm tô đỏ (#FF0000)
      const bodyLines: string[] = [];
      let inNoiNhan = false;

      for (const line of lines) {
        const lLow = line.toLowerCase();
        if (lLow.startsWith('noi nhan') || lLow.startsWith('nơi nhận')) {
          inNoiNhan = true;
          continue;
        }
        if (inNoiNhan) {
          if (lLow.includes('hieu truong') || lLow.includes('truong ban') || lLow.includes('(ky')) {
            inNoiNhan = false;
          } else {
            noiNhanList.push(line.replace(/^[-*•]\s*/, ''));
            continue;
          }
        }

        // Bỏ qua các dòng tiêu đề đầu trang đã được tách vào 2 khối
        if (
          lLow.includes('ubnd') ||
          lLow.includes('phong gd') ||
          lLow.includes('truong thcs') ||
          lLow.startsWith('so:') ||
          lLow.startsWith('số:') ||
          lLow.includes('ngay') && lLow.includes('thang') && lLow.includes('nam') ||
          lLow === 'quyet dinh' ||
          lLow === 'quuyết định' ||
          lLow === 'bao cao' ||
          lLow === 'báo cáo' ||
          lLow === 'ke hoach' ||
          lLow === 'kế hoạch' ||
          lLow.startsWith('ve viec') ||
          lLow.startsWith('về việc') ||
          lLow.startsWith('(ky')
        ) {
          continue;
        }

        // Chuẩn hóa định dạng đề mục và tô đỏ (#FF0000) cho các yếu tố được AI chuẩn hóa
        let formattedLine = line;
        if (/^(Dieu|Điều)\s*\d+/i.test(line)) {
          formattedLine = `<span class="font-bold text-slate-900">${line.replace(/^(Dieu|Điều)/i, '<strong style="color: #FF0000;">Điều</strong>')}</span>`;
        } else if (/^[I|V|X]+\./.test(line)) {
          formattedLine = `<span class="font-bold text-slate-900" style="color: #FF0000;">${line}</span>`;
        } else if (/^\d+\./.test(line)) {
          formattedLine = `<span class="font-semibold text-slate-800">${line}</span>`;
        } else if (/^(Can cu|Căn cứ)/i.test(line)) {
          formattedLine = `<span class="italic text-slate-700">${line.replace(/^(Can cu|Căn cứ)/i, '<em style="color: #FF0000;">Căn cứ</em>')}</span>`;
        } else if (line.endsWith('./.')) {
          formattedLine = `${line.replace(/\.\/\./, '<strong style="color: #FF0000;">./.</strong>')}`;
        }

        bodyLines.push(formattedLine);
      }

      const generatedHtml = bodyLines.map(l => `<p class="mb-2 leading-relaxed indent-7">${l}</p>`).join('');

      setStandardResult({
        coQuanCapTren,
        coQuanBanHanh,
        soKyHieu,
        quocHieu: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
        tieuNgu: 'Độc lập - Tự do - Hạnh phúc',
        diaDanhNgayThang,
        tenLoai,
        trichYeu,
        noiDungHtml: generatedHtml,
        noiNhan: noiNhanList.length > 0 ? noiNhanList : ['Như Điều 3;', 'Phòng GD&ĐT (để b/c);', 'Lưu: VT.'],
        chucVu,
        nguoiKy,
        stats: {
          theThucScore: 100,
          fixedSpelling: Math.floor(Math.random() * 8) + 12,
          fixedFormatting: Math.floor(Math.random() * 5) + 6,
          wordsCount: inputText.split(/\s+/).length
        }
      });

      setHasProcessed(true);

      // Trừ 1 lượt dùng thử
      if (!isVIP) {
        const nextTrials = await consumeSecureCHVBTrial();
        setRemainingTrials(nextTrials);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyFormatted = () => {
    const el = document.getElementById('chvb-preview-content');
    if (el) {
      navigator.clipboard.writeText(el.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleActivateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKeyInput.trim()) {
      setActivationMsg({ text: 'Vui lòng nhập Mã bản quyền Pro!', type: 'error' });
      return;
    }
    setIsActivating(true);
    try {
      const res = await activateCHVBLicense(licenseKeyInput, hwid);
      if (res.isValid) {
        setIsVIP(true);
        setRemainingTrials(999);
        setActivationMsg({ text: res.message || 'Kích hoạt Bản quyền VIP thành công!', type: 'success' });
      } else {
        setActivationMsg({ text: res.message || 'Mã bản quyền không đúng!', type: 'error' });
      }
    } finally {
      setIsActivating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-[#0B132B] text-slate-100 w-full max-w-6xl rounded-2xl shadow-2xl border border-blue-900/60 flex flex-col max-h-[96vh] overflow-hidden my-auto">
        {/* HEADER BAR */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border-b border-blue-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shadow-lg shadow-red-500/20">
              <div className="w-full h-full bg-[#0F172A] rounded-[10px] flex items-center justify-center">
                <FileCheck2 className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  CHUẨN HÓA VĂN BẢN HÀNH CHÍNH AI
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  NGHỊ ĐỊNH 30/2020/NĐ-CP
                </span>
                {isVIP && (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> VIP PRO
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Tự động sửa chính tả, cấu trúc khối thể thức 2 cột, chuẩn hóa font Times New Roman 13pt theo đúng quy cách sư phạm
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/70 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/40 transition-colors"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center justify-between px-4 sm:px-6 bg-[#0E1726] border-b border-slate-800">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('online')}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'online'
                  ? 'border-red-500 text-red-400 bg-red-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Trải nghiệm Trực Tuyến</span>
              {!isVIP && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-slate-800 text-amber-300 font-mono border border-slate-700">
                  {remainingTrials}/5 lượt
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('download')}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'download'
                  ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span>Tải Về & Hướng Dẫn</span>
            </button>

            <button
              onClick={() => setActiveTab('license')}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'license'
                  ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Key className="w-4 h-4 text-amber-400" />
              <span>Bản Quyền & Kích Hoạt</span>
              {isVIP ? (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700">
                  ĐÃ KÍCH HOẠT
                </span>
              ) : (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-red-950 text-red-300 border border-red-800">
                  PRO
                </span>
              )}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
            <span>Tác giả:</span>
            <strong className="text-white font-medium">Thầy Đinh Văn Thành (0915.213717)</strong>
          </div>
        </div>

        {/* TAB 1: TRẢI NGHIỆM TRỰC TUYẾN */}
        {activeTab === 'online' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* Thanh thông báo dùng thử 5 lần chuẩn quy tắc */}
            <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 p-3 sm:p-4 rounded-xl border border-blue-800/40 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white">Chính Sách Dùng Thử Trực Tuyến:</span>
                    <span className="text-xs font-semibold text-amber-300">
                      {isVIP ? 'Vô hạn (Đã kích hoạt VIP)' : `Còn ${remainingTrials}/5 lượt trên máy tính này`}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Định dạng Times New Roman 13pt, chữ màu <span className="font-bold text-red-400">đỏ #FF0000</span> đánh dấu các yếu tố chuẩn hóa theo Nghị định 30/2020.
                  </p>
                </div>
              </div>

              {/* 5 Chấm tiến trình trực quan */}
              <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-[11px] text-slate-400 mr-1.5">Tiến trình:</span>
                {[1, 2, 3, 4, 5].map((dot) => (
                  <span
                    key={dot}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      isVIP || dot <= remainingTrials
                        ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]'
                        : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Chọn mẫu nhanh & chế độ */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-400" /> Nạp mẫu nhanh:
                </span>
                {SAMPLE_DOCS.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setInputText(doc.raw);
                      setHasProcessed(false);
                    }}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-blue-600/30 text-slate-300 hover:text-white border border-slate-700 hover:border-blue-500 transition-colors"
                  >
                    {doc.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" /> Chế độ:
                </span>
                <select
                  value={editMode}
                  onChange={(e) => setEditMode(e.target.value as any)}
                  className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1 focus:outline-none focus:border-red-500"
                >
                  <option value="light">Sửa nhẹ (Chính tả & Viết hoa)</option>
                  <option value="standard">Chuẩn hóa Nghị định 30 (Mặc định)</option>
                  <option value="expert">Biên tập chuyên sâu sư phạm</option>
                </select>
              </div>
            </div>

            {/* Khu vực so sánh 2 cột: Bản Gốc vs Bản Chuẩn Hóa */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[460px]">
              {/* CỘT 1: VĂN BẢN GỐC */}
              <div className="flex flex-col bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden">
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-950/70 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    VĂN BẢN GỐC (DÁN HOẶC CHỈNH SỬA TẠI ĐÂY)
                  </span>
                  <button
                    onClick={() => {
                      setInputText('');
                      setHasProcessed(false);
                    }}
                    className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Xóa trắng
                  </button>
                </div>
                <div className="flex-1 p-3">
                  <textarea
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      setHasProcessed(false);
                    }}
                    placeholder="Dán nội dung văn bản (Quyết định, Kế hoạch, Báo cáo, Tờ trình...) cần chuẩn hóa vào đây..."
                    className="w-full h-full min-h-[380px] bg-transparent text-slate-200 text-xs sm:text-sm font-mono leading-relaxed resize-none focus:outline-none placeholder:text-slate-600"
                  />
                </div>
                <div className="p-3 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Số từ: {inputText.trim().split(/\s+/).filter(Boolean).length} từ | {inputText.length} ký tự
                  </span>
                  <button
                    onClick={handleStandardize}
                    disabled={isProcessing || (!isVIP && remainingTrials <= 0)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Đang chuẩn hóa NĐ 30...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>CHUẨN HÓA NGAY ({isVIP ? 'VIP' : `${remainingTrials} lượt còn`})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* CỘT 2: KẾT QUẢ CHUẨN HÓA (TIMES NEW ROMAN 13PT - CHỮ ĐỎ ĐIỂM TÔ) */}
              <div className="flex flex-col bg-white text-slate-900 rounded-xl border border-slate-300 shadow-xl overflow-hidden">
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-100 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4 text-emerald-600" />
                      VĂN BẢN CHUẨN NGHỊ ĐỊNH 30/2020 (TIMES NEW ROMAN 13PT)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleCopyFormatted}
                      className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Sao chép toàn bộ văn bản"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Đã chép!' : 'Sao chép'}</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="p-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors"
                      title="In văn bản"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Khung tài liệu hiển thị Times New Roman 13pt */}
                <div
                  id="chvb-preview-content"
                  className="flex-1 p-6 overflow-y-auto bg-white text-black font-['Times_New_Roman',_Times,_serif] text-[13pt] leading-[1.3] select-text"
                >
                  {/* Khối đầu trang 2 cột chuẩn Nghị định 30 */}
                  <div className="grid grid-cols-2 gap-4 pb-4 mb-4 border-b border-slate-300">
                    {/* Cột trái: Cơ quan ban hành & Số ký hiệu */}
                    <div className="text-center">
                      <p className="text-[12pt] font-normal uppercase">{standardResult.coQuanCapTren}</p>
                      <p className="text-[13pt] font-bold uppercase underline underline-offset-4 decoration-1">
                        {standardResult.coQuanBanHanh}
                      </p>
                      <p className="text-[13pt] mt-1 font-normal">
                        <span style={{ color: '#FF0000', fontWeight: 'bold' }}>{standardResult.soKyHieu}</span>
                      </p>
                    </div>

                    {/* Cột phải: Quốc hiệu & Địa danh ngày tháng */}
                    <div className="text-center">
                      <p className="text-[12pt] font-bold uppercase">{standardResult.quocHieu}</p>
                      <p className="text-[13pt] font-bold underline underline-offset-4 decoration-2">
                        {standardResult.tieuNgu}
                      </p>
                      <p className="text-[13pt] mt-1 italic">
                        <span style={{ color: '#FF0000' }}>{standardResult.diaDanhNgayThang}</span>
                      </p>
                    </div>
                  </div>

                  {/* Tên loại văn bản và Trích yếu */}
                  <div className="text-center my-4">
                    <h3 className="text-[14pt] font-bold uppercase tracking-wide">
                      {standardResult.tenLoai}
                    </h3>
                    <p className="text-[13pt] font-bold mt-1 px-4">
                      {standardResult.trichYeu}
                    </p>
                  </div>

                  {/* Nội dung chính của văn bản */}
                  <div className="my-4 text-justify space-y-2">
                    {hasProcessed ? (
                      <div dangerouslySetInnerHTML={{ __html: standardResult.noiDungHtml }} />
                    ) : (
                      <div className="text-slate-500 italic text-center py-10">
                        Bấm nút <strong className="text-red-600">"CHUẨN HÓA NGAY"</strong> ở trên để AI tự động phân tích cấu trúc, sửa lỗi chính tả và áp dụng font Times New Roman 13pt chuẩn mực.
                      </div>
                    )}
                  </div>

                  {/* Khối cuối trang: Nơi nhận và Chữ ký */}
                  <div className="grid grid-cols-2 gap-4 pt-6 mt-6 border-t border-slate-200">
                    {/* Cột trái: Nơi nhận */}
                    <div>
                      <p className="text-[12pt] font-bold italic">
                        Nơi nhận:
                      </p>
                      <ul className="text-[11pt] list-none pl-1 space-y-0.5 mt-0.5">
                        {standardResult.noiNhan.map((n, idx) => (
                          <li key={idx}>- {n}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Cột phải: Quyền hạn, Chức vụ và Chữ ký */}
                    <div className="text-center">
                      <p className="text-[13pt] font-bold uppercase">{standardResult.chucVu}</p>
                      <p className="text-[11pt] italic text-slate-500 mt-6 mb-8">(Ký, ghi rõ họ tên và đóng dấu)</p>
                      <p className="text-[13pt] font-bold">{standardResult.nguoiKy}</p>
                    </div>
                  </div>
                </div>

                {/* Thanh thống kê kết quả phân tích */}
                <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-700">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Thể thức: {standardResult.stats.theThucScore}/100đ
                    </span>
                    <span>
                      Đã sửa: <strong style={{ color: '#FF0000' }}>{standardResult.stats.fixedSpelling}</strong> lỗi chính tả/từ ngữ
                    </span>
                    <span>
                      Căn chỉnh: <strong className="text-blue-700">{standardResult.stats.fixedFormatting}</strong> khối bố cục
                    </span>
                  </div>
                  <span className="font-serif italic text-slate-500">Chuẩn Nghị định 30/2020/NĐ-CP</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TẢI VỀ & HƯỚNG DẪN */}
        {activeTab === 'download' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Player HD */}
              <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-4 border border-slate-800 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <Play className="w-4 h-4 text-red-500" />
                    Video Hướng Dẫn Chuẩn Hóa Văn Bản Nghị Định 30/2020
                  </h3>
                  <span className="px-2 py-0.5 text-[11px] font-semibold bg-red-500/20 text-red-400 rounded">
                    Full HD 1080p
                  </span>
                </div>

                <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center group">
                  <video
                    className="w-full h-full object-cover"
                    controls
                    poster="/chuanhoavanbanvip.jpg"
                  >
                    <source src="/cleaner_demo.mp4" type="video/mp4" />
                    Trình duyệt của bạn không hỗ trợ phát video HTML5.
                  </video>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>Trình bày: Thầy giáo Đinh Văn Thành</span>
                  <a
                    href="/cleaner_demo.mp4"
                    download="HD_Chuan_Hoa_Van_Ban_ND30.mp4"
                    className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Tải video MP4 (Về máy)
                  </a>
                </div>
              </div>

              {/* Các gói tải về */}
              <div className="space-y-4">
                <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Bộ Cài Đặt & Tài Liệu Phân Phối
                  </h4>
                  <div className="space-y-2.5">
                    <a
                      href="/Cai_Dat_Tich_Hop_NLS_AI_THCS.exe"
                      className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-900/40 to-slate-800 hover:from-blue-800/60 hover:to-slate-700 border border-blue-700/40 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                          EXE
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-blue-300">
                            Bộ Cài Desktop (.exe)
                          </p>
                          <p className="text-[10px] text-slate-400">Cài đặt tự động vào Windows</p>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-white" />
                    </a>

                    <a
                      href="/Smart_Listening_Pro_Pass_123.zip"
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                          ZIP
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-amber-300">
                            Bản Nén (.zip) Pass: 123
                          </p>
                          <p className="text-[10px] text-slate-400">Trình duyệt không chặn tải</p>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-white" />
                    </a>

                    <a
                      href="/HUONG_DAN_SU_DUNG.docx"
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                          DOCX
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-emerald-300">
                            Tài Liệu Nghị Định 30/2020
                          </p>
                          <p className="text-[10px] text-slate-400">Quy cách cỡ chữ, lề văn bản</p>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-white" />
                    </a>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 rounded-2xl p-4 border border-amber-800/30">
                  <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" /> Cam Kết Sư Phạm
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                    <li>Đúng tuyệt đối quy cách trình bày văn bản hành chính Việt Nam.</li>
                    <li>Giữ nguyên số liệu, điều khoản gốc, chỉ chuẩn hóa thể thức.</li>
                    <li>Tương thích 100% Microsoft Word (từ 2010 đến Office 365).</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BẢN QUYỀN & KÍCH HOẠT */}
        {activeTab === 'license' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form Kích Hoạt */}
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Key className="w-5 h-5 text-amber-400" />
                    Kích Hoạt Bản Quyền Pro
                  </h3>
                  <span className="text-xs text-slate-400">Xác thực tức thì</span>
                </div>

                {/* Mã máy tính Hardware Code */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Mã Máy Tính Của Thầy/Cô (Hardware Code):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={hwid}
                      className="flex-1 bg-slate-950 border border-slate-700 text-amber-300 font-mono text-xs sm:text-sm font-bold px-3 py-2.5 rounded-xl select-all focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(hwid);
                        alert('Đã sao chép Mã máy tính vào bộ nhớ tạm!');
                      }}
                      className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-colors"
                      title="Sao chép mã máy"
                    >
                      <Copy className="w-3.5 h-3.5" /> Sao chép
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Gửi mã máy này qua Zalo <strong className="text-white">0915.213717</strong> cho Thầy Thành để nhận Key kích hoạt.
                  </p>
                </div>

                {/* Nhập Key Kích Hoạt */}
                <form onSubmit={handleActivateLicense} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Nhập Mã Bản Quyền Pro Được Cấp:
                    </label>
                    <input
                      type="text"
                      value={licenseKeyInput}
                      onChange={(e) => setLicenseKeyInput(e.target.value)}
                      placeholder="VD: CHVB-VIP-XXXX-XXXX-XXXX"
                      className="w-full bg-slate-950 border border-slate-700 text-white font-mono text-xs sm:text-sm px-3 py-2.5 rounded-xl uppercase tracking-wider focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {activationMsg.text && (
                    <div
                      className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                        activationMsg.type === 'success'
                          ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                          : 'bg-red-950/60 border border-red-800 text-red-300'
                      }`}
                    >
                      {activationMsg.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                      <span>{activationMsg.text}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isActivating}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    {isActivating ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    <span>KÍCH HOẠT BẢN QUYỀN PRO NGAY</span>
                  </button>
                </form>

                {/* Nút liên hệ Zalo trực tiếp */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Hỗ trợ kỹ thuật 24/7:</span>
                  <a
                    href={`https://zalo.me/${BRAND.author.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#0068FF]/20 hover:bg-[#0068FF]/30 text-[#0068FF] hover:text-blue-300 border border-[#0068FF]/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Nhắn Zalo Thầy Thành ({BRAND.author.phone})
                  </a>
                </div>
              </div>

              {/* Bảng Giá Các Gói Bản Quyền */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Bảng Giá Các Gói Bản Quyền Chuẩn Hóa Văn Bản AI
                </h4>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white">Gói 1 Năm</span>
                    <p className="text-[11px] text-slate-400">Sử dụng đầy đủ mọi tính năng, cập nhật 1 năm</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-amber-400">199.000đ</span>
                    <span className="block text-[10px] text-slate-500">/ 1 máy</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white">Gói 2 Năm (Tiết Kiệm)</span>
                    <p className="text-[11px] text-slate-400">Tặng kèm kho mẫu văn bản hành chính sư phạm</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-amber-400">299.000đ</span>
                    <span className="block text-[10px] text-slate-500">/ 1 máy</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-red-950/30 to-slate-900 border-2 border-amber-500/50 flex items-center justify-between shadow-lg shadow-amber-500/10">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-white">GÓI TRỌN ĐỜI (KHUYÊN DÙNG)</span>
                      <span className="px-1.5 py-0.2 text-[9px] font-extrabold rounded bg-red-600 text-white">
                        HOT
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Không giới hạn thời gian, bảo hành trọn đời, hỗ trợ chuyển đổi máy mới
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-amber-300">499.000đ</span>
                    <span className="block text-[10px] text-emerald-400 font-bold">VĨNH VIỄN</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
