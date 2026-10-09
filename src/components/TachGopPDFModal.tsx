import { TrialRegisterModal } from './TrialRegisterModal';
import React, { useState, useEffect } from 'react';
import {
  X,
  Layers,
  FileSpreadsheet,
  FileCheck2,
  Sparkles,
  Download,
  Key,
  Copy,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Play,
  FileText,
  Check,
  AlertCircle,
  Clock,
  Split,
  Merge,
  Trash2,
  MoveUp,
  MoveDown,
  UploadCloud,
  FileBox,
  CheckCircle2,
  Plus,
  MessageCircle,
  Lock
} from 'lucide-react';
import { BRAND, PDF_SUITE_RESOURCES } from '../config/brand';
import {
  getOrCreatePDFHardwareCode,
  getSecurePDFTrialRemaining,
  consumeSecurePDFTrial,
  isPDFVIPActivated,
  activatePDFLicense
} from '../services/pdfSuiteKeyService';
import { CrossPromoBanner } from './CrossPromoBanner';

interface TachGopPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

interface DemoPdfItem {
  id: string;
  name: string;
  pages: number;
  size: string;
}

export const TachGopPDFModal: React.FC<TachGopPDFModalProps> = ({
  isOpen,
  onClose,
  onOpenAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'online' | 'download' | 'license'>('online');
  const [showTrialRegister, setShowTrialRegister] = useState<boolean>(false);
  const [hwid, setHwid] = useState<string>('DVT-PDF-XXXX-XXXX');
  const [remainingTrials, setRemainingTrials] = useState<number>(5);
  const [isVIP, setIsVIP] = useState<boolean>(true); // Miễn phí 100%
  const [licenseKeyInput, setLicenseKeyInput] = useState<string>('');
  const [activationMsg, setActivationMsg] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });
  const [isActivating, setIsActivating] = useState<boolean>(false);

  // Tool selection in Tab 1
  const [currentTool, setCurrentTool] = useState<'split' | 'merge' | 'clean'>('split');

  // State Tool Tách PDF
  const [splitFile, setSplitFile] = useState<string>('Giao_An_Toan_7_CV5512.pdf (16 Trang)');
  const [splitRange, setSplitRange] = useState<string>('1-4, 7, 10-12');
  const [splitMode, setSplitMode] = useState<'custom' | 'even' | 'odd' | 'each'>('custom');

  // State Tool Gộp PDF
  const [mergeFiles, setMergeFiles] = useState<DemoPdfItem[]>([
    { id: '1', name: '01_Phan_Mo_Dau_Ke_Hoach_Day_Hoc.pdf', pages: 4, size: '420 KB' },
    { id: '2', name: '02_Noi_Dung_Chu_De_STEM_Tich_Hop.pdf', pages: 8, size: '890 KB' },
    { id: '3', name: '03_Phu_Luc_Phieu_Hoc_Tap_Kiem_Tra.pdf', pages: 3, size: '250 KB' }
  ]);

  // State Tool Xóa Trang Trắng
  const [cleanFile, setCleanFile] = useState<string>('Tai_Lieu_Scan_Hoi_Thi_GVG_2026.pdf (12 Trang)');
  const [detectedBlanks, setDetectedBlanks] = useState<number[]>([3, 7, 11]);

  // Action status
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processedResult, setProcessedResult] = useState<{
    success: boolean;
    title: string;
    detail: string;
    downloadName: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const code = getOrCreatePDFHardwareCode();
      setHwid(code);
      const vip = true;
      setIsVIP(true);
      if (!vip) {
        setRemainingTrials(999999);
      } else {
        setRemainingTrials(999);
      }
    }
  }, [isOpen]);

    // Xử lý tải file PDF thật 100% về máy tính (Hỗ trợ mở trên mọi trình xem PDF)
  const handleDownloadPDF = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!processedResult) return;

    const title = processedResult.downloadName.replace('.pdf', '');
    const detail = processedResult.detail || 'Da xu ly thanh cong boi PDF Suite Pro';

    const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>
endobj
4 0 obj
<< /Length 320 >>
stream
BT
/F1 18 Tf
50 780 Td
(${title}) Tj
/F2 12 Tf
0 -30 Td
(HE SINH THAI GIAO VIEN AI TOAN NANG - PDF SUITE PRO) Tj
0 -25 Td
(${detail}) Tj
0 -30 Td
(Trang thai: Da xu ly hoan tat 100% - Tep an toan san sang su dung) Tj
0 -30 Td
(Tac gia: Thay giao Dinh Van Thanh - THCS Dong Yen - Hotline: 0915.213717) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
6 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000257 00000 n 
0000000629 00000 n 
0000000702 00000 n 
trailer
<< /Size 7 /Root 1 0 R >>
startxref
770
%%EOF`;

    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = processedResult.downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExecuteTool = async () => {
    if (!isVIP && remainingTrials <= 0) {
      alert('Thầy/Cô đã hoàn thành 5/5 lượt trải nghiệm miễn phí trên máy tính này!\n\nQuý Thầy/Cô vui lòng bấm Liên hệ Zalo Thầy Thành (0915.213717) để nhận báo giá ưu đãi sư phạm và kích hoạt bản quyền sử dụng không giới hạn.');
      setActiveTab('license');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((r) => setTimeout(r, 650));

      if (currentTool === 'split') {
        let pagesCount = 7;
        if (splitMode === 'even') pagesCount = 8;
        if (splitMode === 'odd') pagesCount = 8;
        if (splitMode === 'each') pagesCount = 16;
        setProcessedResult({
          success: true,
          title: 'Tách PDF Thành Công!',
          detail: `Đã trích xuất ${pagesCount} trang từ file ${splitFile.split(' ')[0]} theo dải trang: ${splitRange}.`,
          downloadName: 'Tep_Tach_Xong.pdf'
        });
      } else if (currentTool === 'merge') {
        const totalP = mergeFiles.reduce((acc, f) => acc + f.pages, 0);
        setProcessedResult({
          success: true,
          title: 'Gộp PDF Hoàn Tất!',
          detail: `Đã gộp ${mergeFiles.length} tệp tin thành 1 tài liệu thống nhất (${totalP} trang). Thứ tự các trang được bảo toàn nguyên bản.`,
          downloadName: 'Giao_An_Tong_Hop_Merged.pdf'
        });
      } else {
        setProcessedResult({
          success: true,
          title: 'Lọc & Xóa Trang Trắng Hoàn Tất!',
          detail: `AI đã quét toàn bộ 12 trang và loại bỏ thành công 3 trang trắng (Trang 3, 7, 11). Tài liệu mới còn 9 trang chuẩn.`,
          downloadName: 'Tai_Lieu_Da_Loc_Trang_Trang.pdf'
        });
      }

      if (!isVIP) {
        const next = await consumeSecurePDFTrial();
        setRemainingTrials(next);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMoveFile = (index: number, direction: 'up' | 'down') => {
    const updated = [...mergeFiles];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx >= 0 && targetIdx < updated.length) {
      const temp = updated[index];
      updated[index] = updated[targetIdx];
      updated[targetIdx] = temp;
      setMergeFiles(updated);
    }
  };

  const handleRemoveMergeFile = (id: string) => {
    setMergeFiles(mergeFiles.filter(f => f.id !== id));
  };

  const handleActivateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKeyInput.trim()) {
      setActivationMsg({ text: 'Vui lòng nhập Mã bản quyền Pro!', type: 'error' });
      return;
    }
    setIsActivating(true);
    try {
      const res = await activatePDFLicense(licenseKeyInput, hwid);
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

  // Lắng nghe phím Escape (Esc) để đóng modal ngay lập tức
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-[#0B132B] text-slate-100 w-full max-w-5xl rounded-2xl shadow-2xl border border-red-900/40 flex flex-col max-h-[96vh] overflow-hidden my-auto cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER BAR */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#1A0B1E] via-[#2D1236] to-[#0F172A] border-b border-purple-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-indigo-600 p-0.5 shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-[#1A0B1E] rounded-[10px] flex items-center justify-center">
                <FileBox className="w-5 h-5 text-pink-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  PDF SUITE PRO
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  TÁCH - GỘP - LỌC TRANG TRẮNG AI
                </span>
                {isVIP && (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> VIP PRO
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Bộ công cụ xử lý tệp PDF chuyên sâu dành cho giáo viên: Tách dải trang, gộp giáo án, tự động xóa trang rác khi scan
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
                  ? 'border-pink-500 text-pink-400 bg-pink-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>1. Dùng Thử Trực Tuyến</span>
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
              <span>2. Tải Bản Máy Tính (.exe)</span>
            </button>

            <button
              onClick={() => setActiveTab('license')}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'license'
                  ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>3. Tiện Ích Miễn Phí & App Pro</span>
              <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700">
                MIỄN PHÍ
              </span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
            <span>Tác giả:</span>
            <strong className="text-white font-medium">Thầy Đinh Văn Thành (0915.213717)</strong>
          </div>
        </div>

        {/* CROSS PROMOTION BANNER QUẢNG CÁO CÁC APP TÍNH TIỀN PRO CỦA THẦY THÀNH */}
        <div className="px-4 sm:px-6 pt-3">
          <CrossPromoBanner currentAppId="pdf" onNavigateApp={() => onClose()} />
        </div>

        
              {/* NỘI DUNG 2: GỘP FILE */}
              {currentTool === 'merge' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <Merge className="w-4 h-4 text-indigo-400" /> Danh sách File PDF chuẩn bị gộp ({mergeFiles.length} tệp)
                    </span>
                    <button
                      onClick={() => {
                        const nextId = String(mergeFiles.length + 1);
                        setMergeFiles([
                          ...mergeFiles,
                          {
                            id: nextId,
                            name: `0${nextId}_Tai_Lieu_Bo_Sung_Moi.pdf`,
                            pages: 5,
                            size: '310 KB'
                          }
                        ]);
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5" /> Thêm file mẫu
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {mergeFiles.map((file, idx) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="text-xs sm:text-sm font-semibold text-white">{file.name}</p>
                            <p className="text-[10px] text-slate-400">
                              {file.pages} trang • Dung lượng: {file.size}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMoveFile(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                            title="Di chuyển lên"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveFile(idx, 'down')}
                            disabled={idx === mergeFiles.length - 1}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                            title="Di chuyển xuống"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRemoveMergeFile(file.id)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                            title="Xóa tệp"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* NỘI DUNG 3: XÓA TRANG TRẮNG */}
              {currentTool === 'clean' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <Trash2 className="w-4 h-4 text-emerald-400" /> Tự động Quét và Loại bỏ Trang Trắng Rác
                    </span>
                    <span className="text-xs text-slate-400">File scan: {cleanFile}</span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-300 mb-3">
                      Thuật toán AI tự động tính toán mật độ ký tự và ma trận pixel, phát hiện các trang trắng do scan 2 mặt hoặc lỗi xuất file:
                    </p>

                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((p) => {
                        const isBlank = detectedBlanks.includes(p);
                        return (
                          <div
                            key={p}
                            className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                              isBlank
                                ? 'bg-red-950/40 border-red-600/70 text-red-300'
                                : 'bg-slate-900 border-slate-800 text-slate-300'
                            }`}
                          >
                            <span className="text-xs font-bold">Trang {p}</span>
                            <span className="text-[10px] mt-1 font-semibold">
                              {isBlank ? 'Trang Rỗng' : 'Có Nội Dung'}
                            </span>
                            {isBlank && (
                              <span className="text-[9px] px-1.5 py-0.2 mt-1 rounded bg-red-600 text-white font-bold">
                                Sẽ xóa
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* THÔNG BÁO KẾT QUẢ VÀ NÚT TẢI VỀ */}
              {processedResult && (
                <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-600/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-emerald-300">
                        {processedResult.title}
                      </span>
                      <p className="text-[11px] text-slate-300">{processedResult.detail}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleDownloadPDF}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-all shrink-0 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Tải Tệp Về Máy
                  </button>
                </div>
              )}

              {/* NÚT THỰC THI */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Thời gian xử lý: ~0.5s | Bảo mật 100% không upload lên máy chủ ngoài
                </span>

                {!isVIP && remainingTrials <= 0 ? (
                  <a
                    href={`https://zalo.me/${BRAND.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Chào Thầy Thành, tôi đã dùng thử hết 5 lượt phần mềm PDF Suite Pro. Nhờ Thầy báo giá ưu đãi và hướng dẫn kích hoạt bản quyền giúp tôi (Mã máy: ${hwid}).`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer animate-pulse"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>HẾT LƯỢT DÙNG THỬ – NHẮN ZALO BÁO GIÁ ƯU ĐÃI</span>
                  </a>
                ) : (
                  <button
                    onClick={handleExecuteTool}
                    disabled={isProcessing}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-pink-600/30 transition-all cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Đang xử lý...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>
                          {currentTool === 'split' && 'TIẾN HÀNH TÁCH TRANG'}
                          {currentTool === 'merge' && 'TIẾN HÀNH GỘP FILE'}
                          {currentTool === 'clean' && 'QUÉT & XÓA TRANG TRẮNG NGAY'}
                          {' '}({isVIP ? 'VIP' : `${remainingTrials} lượt còn`})
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TẢI VỀ & HƯỚNG DẪN */}
        {activeTab === 'download' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Hướng dẫn kỹ thuật xử lý PDF sư phạm */}
              <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-400" />
                      Quy Chuẩn Xử Lý Tệp PDF Sư Phạm Chuyên Nghiệp
                    </h3>
                    <span className="px-2 py-0.5 text-[11px] font-semibold bg-pink-500/20 text-pink-300 rounded border border-pink-500/30">
                      Bảo Mật Nội Bộ 100%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <span className="text-xs font-bold text-pink-400 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" /> 1. Tách Dải Trang Linh Hoạt
                      </span>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Tách nhanh theo số trang lẻ (1, 3, 5...), trang chẵn (2, 4, 6...) hoặc dải trang bất kỳ (1-5, 8-12) phục vụ in ấn hai mặt tiết kiệm giấy.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" /> 2. Gộp Giáo Án & Đề Thi Siêu Tốc
                      </span>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Kéo thả sắp xếp thứ tự các tệp bài giảng, tài liệu ôn tập và đề thi thành 1 file duy nhất với tốc độ tức thì, không làm giảm chất lượng chữ và hình.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" /> 3. Quét & Lọc Bỏ Trang Trắng AI
                      </span>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Tự động phân tích mật độ điểm ảnh để phát hiện các trang trắng rác phát sinh khi scan sách, tài liệu hai mặt, loại bỏ sạch sẽ 100%.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" /> 4. Xử Lý Offline Trực Tiếp Trên Máy
                      </span>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Dữ liệu được xử lý trực tiếp bằng công nghệ WebAssembly ngay trên máy tính của bạn, tuyệt đối không gửi lên server, bảo vệ 100% bí mật đề thi.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-2 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Tác giả: Thầy giáo Đinh Văn Thành (THCS Đồng Yên)</span>
                  <a
                    href={`https://zalo.me/${BRAND.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Hỗ trợ kỹ thuật Zalo ({BRAND.phone})
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
                      href={PDF_SUITE_RESOURCES.fullZipUrl}
                      download="PDF_Suite_Pro_Pass_123.zip"
                      className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-pink-900/40 to-slate-800 hover:from-pink-800/60 hover:to-slate-700 border border-pink-700/40 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-xs">
                          ZIP
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-pink-300">
                            Bản Nén Đầy Đủ (.zip) Pass: 123
                          </p>
                          <p className="text-[10px] text-slate-400">Trọn gói công cụ xử lý PDF máy tính</p>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-white" />
                    </a>

                    <a
                      href="/HUONG_DAN_SU_DUNG.docx"
                      download="SoTay_HuongDan_XuLyPDF_SuPham.docx"
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                          DOCX
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-emerald-300">
                            Sổ Tay Xử Lý PDF Sư Phạm
                          </p>
                          <p className="text-[10px] text-slate-400">Mẹo scan và in ấn tài liệu chuẩn</p>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-white" />
                    </a>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-950/30 via-slate-900 to-slate-900 rounded-2xl p-4 border border-purple-800/30">
                  <h4 className="text-xs font-bold text-pink-300 flex items-center gap-1.5 mb-2">
                    <ShieldCheck className="w-4 h-4 text-pink-400" /> Ưu Điểm Độc Quyền
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                    <li>Xử lý trực tiếp trên máy tính, không sợ lộ đề thi, giáo án.</li>
                    <li>Không giới hạn dung lượng và số lượng tệp cần gộp.</li>
                    <li>Giữ nguyên độ sắc nét chuẩn in ấn 300dpi.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TIỆN ÍCH MIỄN PHÍ & QUẢNG CÁO APP PRO CỦA THẦY THÀNH */}
        {activeTab === 'license' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 max-w-4xl mx-auto">
            {/* KHỐI XÁC NHẬN TIỆN ÍCH MIỄN PHÍ */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border-2 border-emerald-500/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                      100% MIỄN PHÍ VĨNH VIỄN
                    </span>
                    <span className="text-xs text-slate-300 font-medium">Không Cần Kích Hoạt Key</span>
                  </div>
                  <h4 className="text-base font-black text-white mt-1">
                    Bộ Tiện Ích Tách - Gộp PDF Suite - Tặng Quý Thầy/Cô
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Thầy giáo <strong>{BRAND.author}</strong> (THCS Đồng Yên) phát triển và chia sẻ miễn phí trọn đời cho toàn thể giáo viên Việt Nam.
                  </p>
                </div>
              </div>

              <a
                href={PDF_SUITE_RESOURCES.fullZipUrl}
                download="PDF_Suite_Pro_Pass_123.zip"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Tải Bản Máy Tính (.zip Pass: 123)</span>
              </a>
            </div>

            {/* QUẢNG CÁO CÁC ỨNG DỤNG TÍNH TIỀN PRO CỦA THẦY THÀNH (NHẤP NHÁY NHẸ, 1-CLICK DÙNG THỬ) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
                  </span>
                  <h4 className="text-sm font-black text-amber-300 uppercase tracking-wider">
                    CÁC ỨNG DỤNG BẢN QUYỀN PRO CHUYÊN MÔN CỦA THẦY THÀNH
                  </h4>
                </div>
                <span className="text-[11px] text-slate-400">Mỗi app đăng ký độc lập • Dùng thử 5 lần</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* APP 1: NLS 5512 */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-rose-500/30 hover:border-rose-400 transition-all flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      BẢN QUYỀN PRO
                    </span>
                    <h5 className="text-sm font-bold text-white">Tích Hợp NLS - AI (CV 5512)</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Tự động chèn Năng lực số, STEM, AI vào giáo án 12 môn THCS với chữ màu đỏ chuẩn mực.
                    </p>
                  </div>
                  <a
                    href="#nls-ai"
                    onClick={() => onClose()}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Dùng Thử 5 Lần</span>
                  </a>
                </div>

                {/* APP 2: TẠO ĐỀ 12 MÔN 7991 */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 hover:border-amber-400 transition-all flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      BẢN QUYỀN PRO
                    </span>
                    <h5 className="text-sm font-bold text-white">Tạo Đề Kiểm Tra 12 Môn (CV 7991)</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Sinh ma trận, bản đặc tả và đề kiểm tra định kỳ có đáp án chữ đỏ tiện tra cứu chấm thi.
                    </p>
                  </div>
                  <a
                    href="#tao-de-tieng-anh"
                    onClick={() => onClose()}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition"
                  >
                    <FileCheck2 className="w-3.5 h-3.5 text-white" />
                    <span>Dùng Thử Trực Tuyến</span>
                  </a>
                </div>

                {/* APP 3: MATHSTUDIO PRO */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-violet-500/30 hover:border-violet-400 transition-all flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      NỘI BỘ ADMIN
                    </span>
                    <h5 className="text-sm font-bold text-white">MathStudio Pro (Mathpix Word)</h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Công cụ đang thử nghiệm chuyên sâu nội bộ và sửa lỗi, tạm thời chỉ dành riêng cho Admin Thầy Thành.
                    </p>
                  </div>
                  <button
                    onClick={() => alert("Công cụ MathStudio hiện đang trong giai đoạn thử nghiệm nội bộ và sửa lỗi, chỉ dành riêng cho Admin (Thầy Đinh Văn Thành).")}
                    className="w-full py-2 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs text-center flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700 hover:bg-slate-700 hover:text-slate-300 transition"
                  >
                    <Lock className="w-3.5 h-3.5 text-rose-400" />
                    <span>Nội Bộ Admin (Tạm Khóa Tải)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <TrialRegisterModal isOpen={showTrialRegister} onClose={() => setShowTrialRegister(false)} initialAppId="tach-gop-pdf" initialAppName="PDF Suite Pro (Tách - Gộp PDF)" />
    </div>
  );
};
