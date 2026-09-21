import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  X, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Trash2, 
  Plus, 
  Search, 
  RefreshCw, 
  Key, 
  Phone, 
  Building2, 
  Check, 
  Lock, 
  Unlock,
  Cloud,
  AlertCircle,
  Copy,
  Send,
  FileCode,
  Sparkles
} from 'lucide-react';
import { licenseService, LicenseRecord } from '../services/licenseService';
import { generateEd25519Key } from '../services/nlsKeyService';
import { generateExamLicenseKey } from '../services/taodeKeyService';
import { generateBientheLicenseKey } from '../services/bientheKeyService';
import { generateRecordLicenseKey } from '../services/recordKeyService';
import { generateCleanerLicenseKey } from '../services/cleanerKeyService';
import { generateCHVBLicenseKey, buildCHVBZaloMessage } from '../services/chuanhoaVBKeyService';
import { generatePDFLicenseKey, buildPDFZaloMessage } from '../services/pdfSuiteKeyService';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Tab chuyển đổi giữa TTS, NLS-AI, Tạo Đề Tiếng Anh (CV 7991), Sinh 3 Đề Biến Thể, Screen Record V2, Cleaner Pro, Chuẩn Hóa VB, PDF Suite
  const [adminTab, setAdminTab] = useState<'tts' | 'nls' | 'taode' | 'bienthe' | 'record' | 'cleaner' | 'chuanhoavb' | 'pdfsuite'>('tts');

  const [licenses, setLicenses] = useState<LicenseRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState(false);

  // Modal tạo key mới (Smart Listening Pro)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMid, setNewMid] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newSchool, setNewSchool] = useState('');
  const [newPkg, setNewPkg] = useState<'1YEAR' | '2YEAR' | 'LIFETIME'>('LIFETIME');

  // Modal cấu hình Supabase
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [configSuccess, setConfigSuccess] = useState(false);

  // State cho Tool Tạo Key Ed25519 (NLS-AI THCS V2)
  const [nlsMid, setNlsMid] = useState('');
  const [nlsYears, setNlsYears] = useState<number>(99);
  const [nlsKeyResult, setNlsKeyResult] = useState('');
  const [nlsZaloMsg, setNlsZaloMsg] = useState('');
  const [nlsGenError, setNlsGenError] = useState('');
  const [nlsCopiedKey, setNlsCopiedKey] = useState(false);
  const [nlsCopiedMsg, setNlsCopiedMsg] = useState(false);
  const [nlsHistory, setNlsHistory] = useState<Array<{
    mid: string;
    key: string;
    expDate: string;
    plan: string;
    createdAt: string;
  }>>([]);

  // State cho Tool Tạo Key Bản Quyền - Tạo Đề Tiếng Anh (CV 7991)
  const [examMid, setExamMid] = useState('');
  const [examPackage, setExamPackage] = useState<'1year' | '2year' | 'lifetime'>('lifetime');
  const [examKeyResult, setExamKeyResult] = useState('');
  const [examZaloMsg, setExamZaloMsg] = useState('');
  const [examGenError, setExamGenError] = useState('');
  const [examCopiedKey, setExamCopiedKey] = useState(false);
  const [examCopiedMsg, setExamCopiedMsg] = useState(false);
  const [examHistory, setExamHistory] = useState<Array<{
    mid: string;
    key: string;
    expDate: string;
    plan: string;
    createdAt: string;
  }>>([]);

  // State cho Tool Tạo Key Bản Quyền - Sinh 3 Đề Biến Thể VIP (V1)
  const [bientheMid, setBientheMid] = useState('');
  const [bienthePackage, setBienthePackage] = useState<'1year' | '2year' | 'lifetime'>('lifetime');
  const [bientheKeyResult, setBientheKeyResult] = useState('');
  const [bientheZaloMsg, setBientheZaloMsg] = useState('');
  const [bientheGenError, setBientheGenError] = useState('');
  const [bientheCopiedKey, setBientheCopiedKey] = useState(false);
  const [bientheCopiedMsg, setBientheCopiedMsg] = useState(false);
  const [bientheHistory, setBientheHistory] = useState<Array<{
    mid: string;
    key: string;
    expDate: string;
    plan: string;
    createdAt: string;
  }>>([]);

  // State cho Tool Tạo Key Bản Quyền - Screen Record Pro V2
  const [recordMid, setRecordMid] = useState('');
  const [recordPackage, setRecordPackage] = useState<'1year' | '2year' | 'lifetime'>('lifetime');
  const [recordKeyResult, setRecordKeyResult] = useState('');
  const [recordZaloMsg, setRecordZaloMsg] = useState('');
  const [recordGenError, setRecordGenError] = useState('');
  const [recordCopiedKey, setRecordCopiedKey] = useState(false);
  const [recordCopiedMsg, setRecordCopiedMsg] = useState(false);
  const [recordHistory, setRecordHistory] = useState<Array<{
    mid: string;
    key: string;
    expDate: string;
    plan: string;
    createdAt: string;
  }>>([]);

  // State cho Tool Tạo Key Bản Quyền - Đinh Thành Cleaner Pro v4.5 VIP
  const [cleanerMid, setCleanerMid] = useState('');
  const [cleanerPackage, setCleanerPackage] = useState<'1year' | '2year' | 'lifetime'>('lifetime');
  const [cleanerKeyResult, setCleanerKeyResult] = useState('');
  const [cleanerZaloMsg, setCleanerZaloMsg] = useState('');
  const [cleanerGenError, setCleanerGenError] = useState('');
  const [cleanerCopiedKey, setCleanerCopiedKey] = useState(false);
  const [cleanerCopiedMsg, setCleanerCopiedMsg] = useState(false);
  const [cleanerHistory, setCleanerHistory] = useState<Array<{
    mid: string;
    key: string;
    expDate: string;
    plan: string;
    createdAt: string;
  }>>([]);

  // State cho Tool Tạo Key Bản Quyền - Chuẩn Hóa Văn Bản Hành Chính AI (NĐ 30/2020)
  const [chvbMid, setChvbMid] = useState('');
  const [chvbPackage, setChvbPackage] = useState<'1year' | '2year' | 'lifetime'>('lifetime');
  const [chvbKeyResult, setChvbKeyResult] = useState('');
  const [chvbZaloMsg, setChvbZaloMsg] = useState('');
  const [chvbGenError, setChvbGenError] = useState('');
  const [chvbCopiedKey, setChvbCopiedKey] = useState(false);
  const [chvbCopiedMsg, setChvbCopiedMsg] = useState(false);
  const [chvbHistory, setChvbHistory] = useState<Array<{
    mid: string;
    key: string;
    expDate: string;
    plan: string;
    createdAt: string;
  }>>([]);

  // State cho Tool Tạo Key Bản Quyền - PDF Suite Pro (Tách - Gộp - Xóa Trang Trắng AI)
  const [pdfMid, setPdfMid] = useState('');
  const [pdfPackage, setPdfPackage] = useState<'1year' | '2year' | 'lifetime'>('lifetime');
  const [pdfKeyResult, setPdfKeyResult] = useState('');
  const [pdfZaloMsg, setPdfZaloMsg] = useState('');
  const [pdfGenError, setPdfGenError] = useState('');
  const [pdfCopiedKey, setPdfCopiedKey] = useState(false);
  const [pdfCopiedMsg, setPdfCopiedMsg] = useState(false);
  const [pdfHistory, setPdfHistory] = useState<Array<{
    mid: string;
    key: string;
    expDate: string;
    plan: string;
    createdAt: string;
  }>>([]);

  // Mật khẩu Admin chính thức: Thaythanh2026@
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === 'Thaythanh2026@') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await licenseService.getLicenses();
      setLicenses(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadData();
      const cfg = licenseService.getSavedConfig();
      setSupabaseUrl(cfg.url);
      setSupabaseKey(cfg.anonKey);
      try {
        const savedHist = localStorage.getItem('gvai_admin_nls_key_history');
        if (savedHist) setNlsHistory(JSON.parse(savedHist));
        const savedExamHist = localStorage.getItem('gvai_admin_taode_key_history');
        if (savedExamHist) setExamHistory(JSON.parse(savedExamHist));
        const savedBientheHist = localStorage.getItem('gvai_admin_bienthe_key_history');
        if (savedBientheHist) setBientheHistory(JSON.parse(savedBientheHist));
        const savedRecordHist = localStorage.getItem('gvai_admin_record_key_history');
        if (savedRecordHist) setRecordHistory(JSON.parse(savedRecordHist));
        const savedCleanerHist = localStorage.getItem('gvai_admin_cleaner_key_history');
        if (savedCleanerHist) setCleanerHistory(JSON.parse(savedCleanerHist));
        const savedChvbHist = localStorage.getItem('gvai_admin_chvb_key_history');
        if (savedChvbHist) setChvbHistory(JSON.parse(savedChvbHist));
        const savedPdfHist = localStorage.getItem('gvai_admin_pdf_key_history');
        if (savedPdfHist) setPdfHistory(JSON.parse(savedPdfHist));
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen, isAuthenticated]);

  const handleGenerateNLSKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setNlsGenError('');
    try {
      const res = await generateEd25519Key(nlsMid, nlsYears);
      setNlsKeyResult(res.key);
      setNlsZaloMsg(res.zaloMessage);

      const newRecord = {
        mid: nlsMid.trim().toUpperCase(),
        key: res.key,
        expDate: res.expDate,
        plan: res.planName,
        createdAt: new Date().toLocaleString('vi-VN')
      };
      const updated = [newRecord, ...nlsHistory.filter(x => x.key !== res.key).slice(0, 19)];
      setNlsHistory(updated);
      localStorage.setItem('gvai_admin_nls_key_history', JSON.stringify(updated));
    } catch (err: any) {
      setNlsGenError(err.message || 'Lỗi khi tạo key Ed25519');
    }
  };

  const handleCopyNLSKey = () => {
    if (nlsKeyResult) {
      navigator.clipboard.writeText(nlsKeyResult);
      setNlsCopiedKey(true);
      setTimeout(() => setNlsCopiedKey(false), 2000);
    }
  };

  const handleCopyNLSZaloMsg = () => {
    if (nlsZaloMsg) {
      navigator.clipboard.writeText(nlsZaloMsg);
      setNlsCopiedMsg(true);
      setTimeout(() => setNlsCopiedMsg(false), 2000);
    }
  };

  const handleGenerateExamKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setExamGenError('');
    try {
      const cleanId = examMid.trim().toUpperCase();
      if (!cleanId) {
        setExamGenError('Vui lòng nhập Mã máy tính (Hardware Code) của khách hàng!');
        return;
      }
      const res = await generateExamLicenseKey(cleanId, examPackage);
      setExamKeyResult(res.key);

      const msg = `KÍNH GỬI THẦY/CÔ BẢN QUYỀN PHẦN MỀM TẠO ĐỀ TIẾNG ANH THCS (CV 7991):
----------------------------------------------------------------------
📌 Tác giả: Thầy giáo Đinh Văn Thành – THCS Đồng Yên
📞 Hotline/Zalo hỗ trợ: 0915.213717
💻 Mã máy (Hardware Code): ${cleanId}
🎁 Gói bản quyền: ${res.packageName}
⏳ Hạn sử dụng: ${res.expiryDateStr}
🔑 MÃ KÍCH HOẠT PRO (SHA-256):
${res.key}
----------------------------------------------------------------------
👉 HƯỚNG DẪN KÍCH HOẠT:
1. Mở phần mềm "Tạo đề kiểm tra Tiếng Anh Global Success THCS" (hoặc trên Web).
2. Chọn Tab "3. Bản Quyền & Kích Hoạt".
3. Dán đúng mã kích hoạt trên vào ô "Nhập Mã Bản Quyền Pro" rồi bấm "KÍCH HOẠT PRO NGAY".
Chúc Thầy/Cô có những tiết dạy và kỳ thi hiệu quả, tiết kiệm tối đa thời gian!`;
      setExamZaloMsg(msg);

      const newRecord = {
        mid: cleanId,
        key: res.key,
        expDate: res.expiryDateStr,
        plan: res.packageName,
        createdAt: new Date().toLocaleString('vi-VN')
      };
      const updated = [newRecord, ...examHistory.filter(x => x.key !== res.key).slice(0, 19)];
      setExamHistory(updated);
      localStorage.setItem('gvai_admin_taode_key_history', JSON.stringify(updated));
    } catch (err: any) {
      setExamGenError(err.message || 'Lỗi khi tạo key');
    }
  };

  const handleCopyExamKey = () => {
    if (examKeyResult) {
      navigator.clipboard.writeText(examKeyResult);
      setExamCopiedKey(true);
      setTimeout(() => setExamCopiedKey(false), 2000);
    }
  };

  const handleCopyExamZaloMsg = () => {
    if (examZaloMsg) {
      navigator.clipboard.writeText(examZaloMsg);
      setExamCopiedMsg(true);
      setTimeout(() => setExamCopiedMsg(false), 2000);
    }
  };

  const handleGenerateBientheKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setBientheGenError('');
    try {
      const cleanId = bientheMid.trim().toUpperCase();
      if (!cleanId) {
        setBientheGenError('Vui lòng nhập Mã máy tính (Hardware Code) của khách hàng!');
        return;
      }
      const res = await generateBientheLicenseKey(cleanId, bienthePackage);
      setBientheKeyResult(res.key);

      const msg = `KÍNH GỬI THẦY/CÔ BẢN QUYỀN PHẦN MỀM SINH 3 ĐỀ BIẾN THỂ VIP (V1):
----------------------------------------------------------------------
📌 Tác giả: Thầy giáo Đinh Văn Thành – THCS Đồng Yên
📞 Hotline/Zalo hỗ trợ: 0915.213717
💻 Mã máy (Hardware Code): ${cleanId}
🎁 Gói bản quyền: ${res.packageName}
⏳ Hạn sử dụng: ${res.expiryDateStr}
🔑 MÃ KÍCH HOẠT PRO (SHA-256):
${res.key}
----------------------------------------------------------------------
👉 HƯỚNG DẪN KÍCH HOẠT:
1. Mở công cụ "Sinh 3 Đề Biến Thể VIP" trên trang web GiaoVienAI-ToanNang3.
2. Chọn Tab "3. Bản Quyền & Kích Hoạt".
3. Dán đúng mã kích hoạt trên vào ô "Nhập Mã Bản Quyền Pro" rồi bấm "KÍCH HOẠT BẢN QUYỀN PRO NGAY".
Chúc Thầy/Cô có những bộ đề thi phân hóa chất lượng, tiết kiệm tối đa thời gian!`;
      setBientheZaloMsg(msg);

      const newRecord = {
        mid: cleanId,
        key: res.key,
        expDate: res.expiryDateStr,
        plan: res.packageName,
        createdAt: new Date().toLocaleString('vi-VN')
      };
      const updated = [newRecord, ...bientheHistory.filter(x => x.key !== res.key).slice(0, 19)];
      setBientheHistory(updated);
      localStorage.setItem('gvai_admin_bienthe_key_history', JSON.stringify(updated));
    } catch (err: any) {
      setBientheGenError(err.message || 'Lỗi khi tạo key');
    }
  };

  const handleCopyBientheKey = () => {
    if (bientheKeyResult) {
      navigator.clipboard.writeText(bientheKeyResult);
      setBientheCopiedKey(true);
      setTimeout(() => setBientheCopiedKey(false), 2000);
    }
  };

  const handleCopyBientheZaloMsg = () => {
    if (bientheZaloMsg) {
      navigator.clipboard.writeText(bientheZaloMsg);
      setBientheCopiedMsg(true);
      setTimeout(() => setBientheCopiedMsg(false), 2000);
    }
  };

  const handleGenerateRecordKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecordGenError('');
    try {
      const cleanId = recordMid.trim().toUpperCase();
      if (!cleanId) {
        setRecordGenError('Vui lòng nhập Mã máy tính (Hardware Code) của khách hàng!');
        return;
      }
      const res = await generateRecordLicenseKey(cleanId, recordPackage);
      setRecordKeyResult(res.key);

      const msg = `KÍNH GỬI THẦY/CÔ BẢN QUYỀN PHẦN MỀM SCREEN RECORD PRO V2 (QUAY MÀN HÌNH BTV):
----------------------------------------------------------------------
📌 Tác giả: Thầy giáo Đinh Văn Thành – THCS Đồng Yên
📞 Hotline/Zalo hỗ trợ: 0915.213717
💻 Mã máy (Hardware Code): ${cleanId}
🎁 Gói bản quyền: ${res.packageName}
⏳ Hạn sử dụng: ${res.expiryDateStr}
🔑 MÃ KÍCH HOẠT PRO (SHA-256):
${res.key}
----------------------------------------------------------------------
👉 HƯỚNG DẪN KÍCH HOẠT:
1. Mở phần mềm "Screen Record Pro V2" (hoặc trên Web GiaoVienAI-ToanNang3).
2. Chọn Tab "3. Bản Quyền & Kích Hoạt".
3. Dán đúng mã kích hoạt trên vào ô "Nhập Mã Bản Quyền Pro" rồi bấm "KÍCH HOẠT BẢN QUYỀN PRO NGAY".
Chúc Thầy/Cô quay được nhiều bài giảng chất lượng cao, âm thanh trong trẻo!`;
      setRecordZaloMsg(msg);

      const newRecord = {
        mid: cleanId,
        key: res.key,
        expDate: res.expiryDateStr,
        plan: res.packageName,
        createdAt: new Date().toLocaleString('vi-VN')
      };
      const updated = [newRecord, ...recordHistory.filter(x => x.key !== res.key).slice(0, 19)];
      setRecordHistory(updated);
      localStorage.setItem('gvai_admin_record_key_history', JSON.stringify(updated));
    } catch (err: any) {
      setRecordGenError(err.message || 'Lỗi khi tạo key');
    }
  };

  const handleCopyRecordKey = () => {
    if (recordKeyResult) {
      navigator.clipboard.writeText(recordKeyResult);
      setRecordCopiedKey(true);
      setTimeout(() => setRecordCopiedKey(false), 2000);
    }
  };

  const handleCopyRecordZaloMsg = () => {
    if (recordZaloMsg) {
      navigator.clipboard.writeText(recordZaloMsg);
      setRecordCopiedMsg(true);
      setTimeout(() => setRecordCopiedMsg(false), 2000);
    }
  };

  const handleGenerateCleanerKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setCleanerGenError('');
    try {
      const cleanId = cleanerMid.trim().toUpperCase();
      if (!cleanId) {
        setCleanerGenError('Vui lòng nhập Mã máy tính (Hardware Code) của khách hàng (VD: DT-XXXX-XXXX-XXXX)!');
        return;
      }
      const key = await generateCleanerLicenseKey(cleanId, cleanerPackage);
      setCleanerKeyResult(key);

      const pkgName = cleanerPackage === 'lifetime' ? 'BẢN QUYỀN VIP TRỌN ĐỜI (50.000đ)' : cleanerPackage === '2year' ? 'GÓI 2 NĂM (40.000đ)' : 'GÓI 1 NĂM (30.000đ)';
      const expStr = cleanerPackage === 'lifetime' ? 'Vĩnh viễn không giới hạn' : cleanerPackage === '2year' ? '730 ngày (2 Năm)' : '365 ngày (1 Năm)';

      const msg = `KÍNH GỬI THẦY/CÔ BẢN QUYỀN PHẦN MỀM ĐINH THÀNH CLEANER PRO v4.5 VIP ULTRA:
----------------------------------------------------------------------
📌 Tác giả: Thầy giáo Đinh Văn Thành – THCS Đồng Yên
📞 Hotline/Zalo hỗ trợ: 0915.213717
💻 Mã máy (Hardware Code): ${cleanId}
🎁 Gói bản quyền: ${pkgName}
⏳ Thời hạn sử dụng: ${expStr}
🔑 MÃ KÍCH HOẠT PRO (SHA-256):
${key}
----------------------------------------------------------------------
👉 HƯỚNG DẪN KÍCH HOẠT:
1. Mở phần mềm "Đinh Thành Cleaner Pro v4.5" (hoặc trên Web GiaoVienAI-ToanNang3).
2. Chọn Tab "3. Bản Quyền & Kích Hoạt VIP".
3. Dán đúng mã kích hoạt trên vào ô "Nhập Mã Kích Hoạt Bản Quyền VIP" rồi bấm "🚀 KÍCH HOẠT BẢN QUYỀN VIP NGAY".
Chúc Thầy/Cô dọn dẹp sạch sẽ ổ C, máy tính chạy êm mượt và giảng dạy thăng hoa!`;
      setCleanerZaloMsg(msg);

      const newRecord = {
        mid: cleanId,
        key: key,
        expDate: expStr,
        plan: pkgName,
        createdAt: new Date().toLocaleString('vi-VN')
      };
      const updated = [newRecord, ...cleanerHistory.filter(x => x.key !== key).slice(0, 19)];
      setCleanerHistory(updated);
      localStorage.setItem('gvai_admin_cleaner_key_history', JSON.stringify(updated));
    } catch (err: any) {
      setCleanerGenError(err.message || 'Lỗi khi tạo key');
    }
  };

  const handleCopyCleanerKey = () => {
    if (cleanerKeyResult) {
      navigator.clipboard.writeText(cleanerKeyResult);
      setCleanerCopiedKey(true);
      setTimeout(() => setCleanerCopiedKey(false), 2000);
    }
  };

  const handleCopyCleanerZaloMsg = () => {
    if (cleanerZaloMsg) {
      navigator.clipboard.writeText(cleanerZaloMsg);
      setCleanerCopiedMsg(true);
      setTimeout(() => setCleanerCopiedMsg(false), 2000);
    }
  };

  // Handlers cho Chuẩn Hóa Văn Bản Hành Chính AI
  const handleGenerateCHVBKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setChvbGenError('');
    try {
      const cleanId = chvbMid.trim().toUpperCase();
      if (!cleanId) {
        setChvbGenError('Vui lòng nhập Mã máy tính (Hardware Code) của khách hàng!');
        return;
      }
      const key = await generateCHVBLicenseKey(cleanId, chvbPackage);
      setChvbKeyResult(key);

      let pkgName = 'BẢN QUYỀN VIP TRỌN ĐỜI (499.000đ)';
      let expDateStr = 'Vĩnh viễn không giới hạn';
      if (chvbPackage === '1year') {
        pkgName = 'GÓI BẢN QUYỀN 1 NĂM (199.000đ)';
        expDateStr = '1 Năm';
      } else if (chvbPackage === '2year') {
        pkgName = 'GÓI BẢN QUYỀN 2 NĂM (299.000đ)';
        expDateStr = '2 Năm';
      }

      const msg = buildCHVBZaloMessage(cleanId, key, pkgName);
      setChvbZaloMsg(msg);

      const newRecord = {
        mid: cleanId,
        key: key,
        expDate: expDateStr,
        plan: pkgName,
        createdAt: new Date().toLocaleString('vi-VN')
      };
      const updated = [newRecord, ...chvbHistory.filter(x => x.key !== key).slice(0, 19)];
      setChvbHistory(updated);
      localStorage.setItem('gvai_admin_chvb_key_history', JSON.stringify(updated));
    } catch (err: any) {
      setChvbGenError(err.message || 'Lỗi khi tạo key');
    }
  };

  const handleCopyCHVBKey = () => {
    if (chvbKeyResult) {
      navigator.clipboard.writeText(chvbKeyResult);
      setChvbCopiedKey(true);
      setTimeout(() => setChvbCopiedKey(false), 2000);
    }
  };

  const handleCopyCHVBZaloMsg = () => {
    if (chvbZaloMsg) {
      navigator.clipboard.writeText(chvbZaloMsg);
      setChvbCopiedMsg(true);
      setTimeout(() => setChvbCopiedMsg(false), 2000);
    }
  };

  // Handlers cho PDF Suite Pro
  const handleGeneratePDFKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setPdfGenError('');
    try {
      const cleanId = pdfMid.trim().toUpperCase();
      if (!cleanId) {
        setPdfGenError('Vui lòng nhập Mã máy tính (Hardware Code) của khách hàng!');
        return;
      }
      const key = await generatePDFLicenseKey(cleanId, pdfPackage);
      setPdfKeyResult(key);

      let pkgName = 'BẢN QUYỀN VIP TRỌN ĐỜI (499.000đ)';
      let expDateStr = 'Vĩnh viễn không giới hạn';
      if (pdfPackage === '1year') {
        pkgName = 'GÓI BẢN QUYỀN 1 NĂM (199.000đ)';
        expDateStr = '1 Năm';
      } else if (pdfPackage === '2year') {
        pkgName = 'GÓI BẢN QUYỀN 2 NĂM (299.000đ)';
        expDateStr = '2 Năm';
      }

      const msg = buildPDFZaloMessage(cleanId, key, pkgName);
      setPdfZaloMsg(msg);

      const newRecord = {
        mid: cleanId,
        key: key,
        expDate: expDateStr,
        plan: pkgName,
        createdAt: new Date().toLocaleString('vi-VN')
      };
      const updated = [newRecord, ...pdfHistory.filter(x => x.key !== key).slice(0, 19)];
      setPdfHistory(updated);
      localStorage.setItem('gvai_admin_pdf_key_history', JSON.stringify(updated));
    } catch (err: any) {
      setPdfGenError(err.message || 'Lỗi khi tạo key');
    }
  };

  const handleCopyPDFKey = () => {
    if (pdfKeyResult) {
      navigator.clipboard.writeText(pdfKeyResult);
      setPdfCopiedKey(true);
      setTimeout(() => setPdfCopiedKey(false), 2000);
    }
  };

  const handleCopyPDFZaloMsg = () => {
    if (pdfZaloMsg) {
      navigator.clipboard.writeText(pdfZaloMsg);
      setPdfCopiedMsg(true);
      setTimeout(() => setPdfCopiedMsg(false), 2000);
    }
  };

  if (!isOpen) return null;

  // Màn hình Đăng nhập bảo mật
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 sm:p-8 text-white shadow-2xl relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-3 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 mx-auto flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-white">QUẢN TRỊ VIÊN BẢN QUYỀN</h3>
            <p className="text-xs text-slate-400">
              Hệ sinh thái AI Thầy Đinh Văn Thành – Xác thực quyền Admin
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mật khẩu Quản trị (PIN):
              </label>
              <input
                type="password"
                placeholder="Nhập mật khẩu Admin..."
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm font-mono"
                autoFocus
              />
              {pinError && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Mật khẩu không chính xác! Vui lòng kiểm tra lại.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              Mở Bảng Điều Khiển
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Lọc dữ liệu
  const filtered = licenses.filter(item => {
    const matchSearch = 
      item.machine_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.teacher_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone_zalo.includes(searchQuery);
    
    if (filterStatus === 'ALL') return matchSearch;
    return matchSearch && item.status === filterStatus;
  });

  // Thống kê
  const totalCount = licenses.length;
  const pendingCount = licenses.filter(x => x.status === 'PENDING').length;
  const activeCount = licenses.filter(x => x.status === 'ACTIVE').length;
  const revokedCount = licenses.filter(x => x.status === 'REVOKED').length;

  const handleApprove = async (mid: string) => {
    await licenseService.approve(mid);
    await loadData();
  };

  const handleExtend = async (mid: string, pkg: '1YEAR' | 'LIFETIME') => {
    await licenseService.extend(mid, pkg);
    await loadData();
  };

  const handleRevoke = async (mid: string) => {
    if (window.confirm(`Thầy có chắc chắn muốn KHÓA BẢN QUYỀN của máy ${mid} không?`)) {
      await licenseService.revoke(mid);
      await loadData();
    }
  };

  const handleDelete = async (mid: string) => {
    if (window.confirm(`Xóa bản ghi của máy ${mid}?`)) {
      await licenseService.deleteLicense(mid);
      await loadData();
    }
  };

  const handleCreateDirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMid.trim()) return;
    const nowTs = Math.floor(Date.now() / 1000);
    const expTs = newPkg === 'LIFETIME' ? 9999999999 : nowTs + 365 * 86400;

    await licenseService.createDirect({
      machine_id: newMid.trim().toUpperCase(),
      teacher_name: newName.trim() || 'Thầy/Cô',
      phone_zalo: newPhone.trim(),
      school_unit: newSchool.trim(),
      package_type: newPkg,
      status: 'ACTIVE',
      expiry_timestamp: expTs,
      notes: 'Admin tạo trực tiếp'
    });

    setNewMid('');
    setNewName('');
    setNewPhone('');
    setNewSchool('');
    setShowCreateModal(false);
    await loadData();
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    licenseService.saveConfig({ url: supabaseUrl.trim(), anonKey: supabaseKey.trim() });
    setConfigSuccess(true);
    setTimeout(() => {
      setConfigSuccess(false);
      setShowConfigModal(false);
      loadData();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-6xl w-full p-4 sm:p-6 text-white shadow-2xl my-auto max-h-[95vh] flex flex-col">
        {/* TOP HEADER */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  QUẢN TRỊ BẢN QUYỀN CLOUD 24/7
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold">
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Thầy giáo Đinh Văn Thành – Quản lý cấp phép & kích hoạt từ xa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfigModal(true)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Cấu hình Cloud Database"
            >
              <Cloud className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Kết nối Cloud</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* TAB CHUYỂN ĐỔI: 1. SMART LISTENING | 2. NLS-AI V2 | 3. ĐỀ TIẾNG ANH CV 7991 | 4. SINH 3 ĐỀ BIẾN THỂ */}
        <div className="flex gap-2 my-3 border-b border-slate-800 pb-2 text-xs font-bold shrink-0 overflow-x-auto">
          <button
            onClick={() => setAdminTab('tts')}
            className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              adminTab === 'tts'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4" />
            1. Smart Listening Pro (Cloud)
          </button>
          <button
            onClick={() => setAdminTab('nls')}
            className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              adminTab === 'nls'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-4 h-4" />
            2. NLS-AI V2 (Ed25519)
          </button>
          <button
            onClick={() => setAdminTab('taode')}
            className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              adminTab === 'taode'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            3. Đề Tiếng Anh (CV 7991)
          </button>
          <button
            onClick={() => setAdminTab('bienthe')}
            className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              adminTab === 'bienthe'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4" />
            4. Sinh 3 Đề Biến Thể (VIP)
          </button>
          <button
            onClick={() => setAdminTab('record')}
            className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              adminTab === 'record'
                ? 'bg-gradient-to-r from-rose-600 to-red-500 text-white shadow-md shadow-rose-600/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4" />
            5. Screen Record V2 (VIP)
          </button>
          <button
            onClick={() => setAdminTab('cleaner')}
            className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              adminTab === 'cleaner'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4" />
            6. Đinh Thành Cleaner Pro (VIP)
          </button>
          <button
            onClick={() => setAdminTab('chuanhoavb')}
            className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              adminTab === 'chuanhoavb'
                ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-md shadow-red-600/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4" />
            7. Chuẩn Hóa VB (NĐ 30)
          </button>
          <button
            onClick={() => setAdminTab('pdfsuite')}
            className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all shrink-0 ${
              adminTab === 'pdfsuite'
                ? 'bg-gradient-to-r from-pink-600 to-indigo-600 text-white shadow-md shadow-pink-600/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4" />
            8. PDF Suite Pro (Tách/Gộp)
          </button>
        </div>

        {/* TAB 1: SMART LISTENING PRO (CLOUD DATABASE) */}
        {adminTab === 'tts' && (
          <>
            {/* 4 STATS CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-2">
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-xs text-slate-400 font-medium block">Tổng thiết bị</span>
                <span className="text-2xl font-black text-white mt-1 block">{totalCount}</span>
              </div>
              <div className={`p-3.5 rounded-2xl border transition-all ${pendingCount > 0 ? 'bg-amber-500/15 border-amber-500/50 shadow-lg shadow-amber-500/10 animate-pulse' : 'bg-slate-800/80 border-slate-700/60'}`}>
                <span className="text-xs text-amber-400 font-bold block flex items-center gap-1">
                  🔔 Chờ duyệt mới
                </span>
                <span className="text-2xl font-black text-amber-400 mt-1 block">{pendingCount}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-xs text-emerald-400 font-medium block">Đang hoạt động (Pro)</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">{activeCount}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-xs text-rose-400 font-medium block">Bị khóa / Thu hồi</span>
                <span className="text-2xl font-black text-rose-400 mt-1 block">{revokedCount}</span>
              </div>
            </div>

            {/* CONTROLS BAR */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm mã máy, tên giáo viên, số điện thoại..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
                  <button
                    onClick={() => setFilterStatus('ALL')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${filterStatus === 'ALL' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setFilterStatus('PENDING')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${filterStatus === 'PENDING' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    Chờ duyệt {pendingCount > 0 && `(${pendingCount})`}
                  </button>
                  <button
                    onClick={() => setFilterStatus('ACTIVE')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${filterStatus === 'ACTIVE' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    Pro
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  Tạo Key Trực Tiếp
                </button>
                <button
                  onClick={loadData}
                  disabled={loading}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Làm mới"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* CUSTOMER LICENSES TABLE */}
            <div className="flex-1 overflow-y-auto border border-slate-800 rounded-2xl bg-slate-950/50">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm">
                  Không tìm thấy thiết bị nào phù hợp.
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-slate-800/90 backdrop-blur-md text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-3">Mã Thiết Bị</th>
                      <th className="py-3 px-3">Giáo Viên / Đơn Vị</th>
                      <th className="py-3 px-3">Gói Bản Quyền</th>
                      <th className="py-3 px-3">Trạng Thái</th>
                      <th className="py-3 px-3">Ngày Kích Hoạt</th>
                      <th className="py-3 px-3 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filtered.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-amber-300">
                          {item.machine_id}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-white">{item.teacher_name || 'Chưa cập nhật'}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-500" />
                            <span>{item.phone_zalo || 'Không có'}</span>
                            {item.school_unit && (
                              <>
                                <span className="text-slate-600">•</span>
                                <Building2 className="w-3 h-3 text-slate-500" />
                                <span>{item.school_unit}</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${item.package_type === 'LIFETIME' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'}`}>
                            {item.package_type === 'LIFETIME' ? 'Trọn Đời' : item.package_type}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {item.status === 'ACTIVE' && (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Hoạt động
                            </span>
                          )}
                          {item.status === 'PENDING' && (
                            <span className="inline-flex items-center gap-1 text-amber-400 font-bold animate-pulse">
                              <Clock className="w-3.5 h-3.5" /> Chờ duyệt
                            </span>
                          )}
                          {item.status === 'REVOKED' && (
                            <span className="inline-flex items-center gap-1 text-rose-400 font-bold">
                              <ShieldAlert className="w-3.5 h-3.5" /> Bị khóa
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-400 text-[11px]">
                          {item.activated_at ? item.activated_at.substring(0, 10) : 'Chưa kích hoạt'}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {item.status === 'PENDING' && (
                              <button
                                onClick={() => handleApprove(item.machine_id)}
                                className="py-1 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm transition-colors"
                              >
                                Duyệt Pro
                              </button>
                            )}
                            {item.status !== 'PENDING' && (
                              <>
                                {item.status === 'ACTIVE' ? (
                                  <button
                                    onClick={() => handleRevoke(item.machine_id)}
                                    className="p-1.5 rounded-md hover:bg-rose-950/40 text-slate-500 hover:text-rose-400"
                                    title="Khóa bản quyền"
                                  >
                                    <Lock className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleApprove(item.machine_id)}
                                    className="p-1.5 rounded-md hover:bg-emerald-950/40 text-emerald-400"
                                    title="Mở khóa máy này"
                                  >
                                    <Unlock className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </>
                            )}
                            <button
                              onClick={() => handleDelete(item.machine_id)}
                              className="p-1.5 rounded-md hover:bg-slate-800 text-slate-500 hover:text-rose-400"
                              title="Xóa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* TAB 2: TOOL TẠO KEY ED25519 - TÍCH HỢP NLS-AI V2 */}
        {adminTab === 'nls' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
            {/* CARD TẠO KEY ED25519 */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  KÝ SỐ ED25519 & TẠO KEY BẢN QUYỀN PRO THCS 2026
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  Chuẩn thuật toán Admin_Tao_Key_Pro.exe
                </span>
              </div>

              <form onSubmit={handleGenerateNLSKey} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-slate-300 font-bold mb-1">
                      1. Nhập Mã Máy (Hardware Code) của Khách Hàng:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: DVT-0B1D-A6A7-5A14"
                      value={nlsMid}
                      onChange={(e) => setNlsMid(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-sm uppercase text-cyan-300 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      2. Chọn Gói Bản Quyền:
                    </label>
                    <select
                      value={nlsYears}
                      onChange={(e) => setNlsYears(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value={99}>VIP Trọn Đời (Khuyên dùng)</option>
                      <option value={1}>1 Năm (150.000 VNĐ)</option>
                      <option value={2}>2 Năm (250.000 VNĐ)</option>
                      <option value={3}>3 Năm (300.000 VNĐ)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
                  >
                    <Sparkles className="w-4 h-4" />
                    KÝ SỐ & TẠO MÃ KÍCH HOẠT PRO (ED25519)
                  </button>

                  {nlsGenError && (
                    <span className="text-rose-400 font-semibold">{nlsGenError}</span>
                  )}
                </div>
              </form>

              {/* KẾT QUẢ SINH KEY & TIN NHẮN ZALO */}
              {nlsKeyResult && (
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Mã Key kích hoạt Ed25519:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={nlsKeyResult}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-emerald-500/50 font-mono text-xs text-emerald-300 font-bold select-all focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCopyNLSKey}
                        className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 border border-slate-700"
                      >
                        {nlsCopiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        {nlsCopiedKey ? 'Đã copy Key!' : 'Copy Key'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-300 font-bold">
                        Tin nhắn Zalo gửi khách hàng (đã định dạng chuẩn):
                      </label>
                      <button
                        type="button"
                        onClick={handleCopyNLSZaloMsg}
                        className="py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow"
                      >
                        {nlsCopiedMsg ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                        {nlsCopiedMsg ? 'Đã copy tin nhắn Zalo!' : 'Sao chép tin nhắn Zalo gửi Khách'}
                      </button>
                    </div>
                    <textarea
                      readOnly
                      rows={7}
                      value={nlsZaloMsg}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] leading-relaxed text-slate-200 select-all focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* LỊCH SỬ CÁC KEY ĐÃ TẠO GẦN ĐÂY */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-slate-200 block text-xs">
                Lịch sử các Key Ed25519 đã tạo gần đây ({nlsHistory.length} bản ghi):
              </span>
              {nlsHistory.length === 0 ? (
                <p className="text-slate-500 py-3 text-center">Chưa có key nào được tạo gần đây.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-2">Thời gian</th>
                        <th className="py-2 px-2">Mã máy</th>
                        <th className="py-2 px-2">Gói</th>
                        <th className="py-2 px-2">Key Pro</th>
                        <th className="py-2 px-2 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {nlsHistory.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-900/60">
                          <td className="py-2 px-2 text-slate-400 whitespace-nowrap">{item.createdAt}</td>
                          <td className="py-2 px-2 font-mono text-cyan-300 font-bold">{item.mid}</td>
                          <td className="py-2 px-2 text-amber-300 font-semibold">{item.plan}</td>
                          <td className="py-2 px-2 font-mono text-emerald-400 truncate max-w-xs">{item.key}</td>
                          <td className="py-2 px-2 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(item.key);
                                alert(`Đã sao chép Key của máy ${item.mid}!`);
                              }}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px]"
                            >
                              Copy Key
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: TOOL TẠO KEY BẢN QUYỀN - TẠO ĐỀ TIẾNG ANH CV 7991 */}
        {adminTab === 'taode' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
            {/* CARD TẠO KEY */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/60 via-slate-900 to-slate-950 border border-sky-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-sky-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  MẬT MÃ SHA-256 & TẠO KEY BẢN QUYỀN - ĐỀ TIẾNG ANH (CV 7991)
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  Chuẩn thuật toán Tool_Tao_Key_Ban_Quyen_Thanh.py
                </span>
              </div>

              <form onSubmit={handleGenerateExamKey} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-slate-300 font-bold mb-1">
                      1. Nhập Mã Máy (Hardware Code) của Khách Hàng:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: DVT-ENG-1A2B-3C4D"
                      value={examMid}
                      onChange={(e) => setExamMid(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-sm uppercase text-sky-300 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      2. Chọn Gói Bản Quyền:
                    </label>
                    <select
                      value={examPackage}
                      onChange={(e) => setExamPackage(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-sky-500"
                    >
                      <option value="lifetime">VIP Trọn Đời (200.000 VNĐ - Khuyên dùng)</option>
                      <option value="1year">1 Năm (100.000 VNĐ)</option>
                      <option value="2year">2 Năm (150.000 VNĐ)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-sky-600/30 transition-all hover:scale-[1.02]"
                  >
                    <Sparkles className="w-4 h-4" />
                    TẠO MÃ KÍCH HOẠT PRO TIẾNG ANH (SHA-256)
                  </button>

                  {examGenError && (
                    <span className="text-rose-400 font-semibold">{examGenError}</span>
                  )}
                </div>
              </form>

              {/* KẾT QUẢ SINH KEY & TIN NHẮN ZALO */}
              {examKeyResult && (
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Mã Key kích hoạt Pro (ENG-prefix-expts-sig):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={examKeyResult}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-sky-500/50 font-mono text-xs text-sky-300 font-bold select-all focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCopyExamKey}
                        className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 border border-slate-700"
                      >
                        {examCopiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        {examCopiedKey ? 'Đã copy Key!' : 'Copy Key'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-300 font-bold">
                        Tin nhắn Zalo gửi khách hàng (đã định dạng chuẩn):
                      </label>
                      <button
                        type="button"
                        onClick={handleCopyExamZaloMsg}
                        className="py-1.5 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow"
                      >
                        {examCopiedMsg ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                        {examCopiedMsg ? 'Đã copy tin nhắn Zalo!' : 'Sao chép tin nhắn Zalo gửi Khách'}
                      </button>
                    </div>
                    <textarea
                      readOnly
                      rows={7}
                      value={examZaloMsg}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] leading-relaxed text-slate-200 select-all focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* LỊCH SỬ CÁC KEY ĐÃ TẠO GẦN ĐÂY */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-slate-200 block text-xs">
                Lịch sử các Key Đề Tiếng Anh đã tạo gần đây ({examHistory.length} bản ghi):
              </span>
              {examHistory.length === 0 ? (
                <p className="text-slate-500 py-3 text-center">Chưa có key nào được tạo gần đây.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-2">Thời gian</th>
                        <th className="py-2 px-2">Mã máy</th>
                        <th className="py-2 px-2">Gói</th>
                        <th className="py-2 px-2">Key Pro</th>
                        <th className="py-2 px-2 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {examHistory.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-900/60">
                          <td className="py-2 px-2 text-slate-400 whitespace-nowrap">{item.createdAt}</td>
                          <td className="py-2 px-2 font-mono text-sky-300 font-bold">{item.mid}</td>
                          <td className="py-2 px-2 text-amber-300 font-semibold">{item.plan}</td>
                          <td className="py-2 px-2 font-mono text-emerald-400 truncate max-w-xs">{item.key}</td>
                          <td className="py-2 px-2 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(item.key);
                                alert(`Đã sao chép Key của máy ${item.mid}!`);
                              }}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px]"
                            >
                              Copy Key
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: TOOL TẠO KEY BẢN QUYỀN - SINH 3 ĐỀ BIẾN THỂ VIP (V1) */}
        {adminTab === 'bienthe' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
            {/* CARD TẠO KEY */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  MẬT MÃ SHA-256 & TẠO KEY BẢN QUYỀN - SINH 3 ĐỀ BIẾN THỂ VIP (V1)
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  Thuật toán bientheKeyService.ts (Thầy Đinh Văn Thành)
                </span>
              </div>

              <form onSubmit={handleGenerateBientheKey} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-slate-300 font-bold mb-1">
                      1. Nhập Mã Máy (Hardware Code) của Khách Hàng:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: DVT-VAR-1A2B-3C4D"
                      value={bientheMid}
                      onChange={(e) => setBientheMid(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-sm uppercase text-amber-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      2. Chọn Gói Bản Quyền:
                    </label>
                    <select
                      value={bienthePackage}
                      onChange={(e) => setBienthePackage(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="lifetime">VIP Trọn Đời (200.000 VNĐ - Khuyên dùng)</option>
                      <option value="1year">1 Năm (100.000 VNĐ)</option>
                      <option value="2year">2 Năm (150.000 VNĐ)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Crown className="w-4 h-4" />
                    TẠO MÃ KÍCH HOẠT PRO BIẾN THỂ (SHA-256)
                  </button>

                  {bientheGenError && (
                    <span className="text-rose-400 font-semibold">{bientheGenError}</span>
                  )}
                </div>
              </form>

              {/* KẾT QUẢ SINH KEY & TIN NHẮN ZALO */}
              {bientheKeyResult && (
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Mã Key kích hoạt Pro (VAR-prefix-expts-sig):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={bientheKeyResult}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-amber-500/50 font-mono text-xs text-amber-300 font-bold select-all focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCopyBientheKey}
                        className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 border border-slate-700 cursor-pointer"
                      >
                        {bientheCopiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        {bientheCopiedKey ? 'Đã copy Key!' : 'Copy Key'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-300 font-bold">
                        Tin nhắn Zalo gửi khách hàng (đã định dạng chuẩn):
                      </label>
                      <button
                        type="button"
                        onClick={handleCopyBientheZaloMsg}
                        className="py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow cursor-pointer"
                      >
                        {bientheCopiedMsg ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                        {bientheCopiedMsg ? 'Đã copy tin nhắn Zalo!' : 'Sao chép tin nhắn Zalo gửi Khách'}
                      </button>
                    </div>
                    <textarea
                      readOnly
                      rows={7}
                      value={bientheZaloMsg}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] leading-relaxed text-slate-200 select-all focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* LỊCH SỬ CÁC KEY ĐÃ TẠO GẦN ĐÂY */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-slate-200 block text-xs">
                Lịch sử các Key Đề Biến Thể đã tạo gần đây ({bientheHistory.length} bản ghi):
              </span>
              {bientheHistory.length === 0 ? (
                <p className="text-slate-500 py-3 text-center">Chưa có key nào được tạo gần đây.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-2">Thời gian</th>
                        <th className="py-2 px-2">Mã máy</th>
                        <th className="py-2 px-2">Gói</th>
                        <th className="py-2 px-2">Key Pro</th>
                        <th className="py-2 px-2 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {bientheHistory.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-900/60">
                          <td className="py-2 px-2 text-slate-400 whitespace-nowrap">{item.createdAt}</td>
                          <td className="py-2 px-2 font-mono text-amber-300 font-bold">{item.mid}</td>
                          <td className="py-2 px-2 text-sky-300 font-semibold">{item.plan}</td>
                          <td className="py-2 px-2 font-mono text-emerald-400 truncate max-w-xs">{item.key}</td>
                          <td className="py-2 px-2 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(item.key);
                                alert(`Đã sao chép Key của máy ${item.mid}!`);
                              }}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] cursor-pointer"
                            >
                              Copy Key
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: TOOL TẠO KEY BẢN QUYỀN - SCREEN RECORD PRO V2 */}
        {adminTab === 'record' && (
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
            {/* CARD TẠO KEY */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-950 border border-rose-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-rose-400" />
                  MẬT MÃ SHA-256 & TẠO KEY BẢN QUYỀN - SCREEN RECORD PRO V2
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  Thuật toán recordKeyService.ts (Thầy Đinh Văn Thành)
                </span>
              </div>

              <form onSubmit={handleGenerateRecordKey} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-slate-300 font-bold mb-1">
                      1. Nhập Mã Máy (Hardware Code) của Khách Hàng:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: DVT-REC-1A2B-3C4D"
                      value={recordMid}
                      onChange={(e) => setRecordMid(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-sm uppercase text-rose-300 focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      2. Chọn Gói Bản Quyền:
                    </label>
                    <select
                      value={recordPackage}
                      onChange={(e) => setRecordPackage(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-rose-500"
                    >
                      <option value="lifetime">VIP Trọn Đời (200.000 VNĐ - Khuyên dùng)</option>
                      <option value="1year">1 Năm (100.000 VNĐ)</option>
                      <option value="2year">2 Năm (150.000 VNĐ)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Crown className="w-4 h-4" />
                    TẠO MÃ KÍCH HOẠT PRO SCREEN RECORD (SHA-256)
                  </button>

                  {recordGenError && (
                    <span className="text-rose-400 font-semibold">{recordGenError}</span>
                  )}
                </div>
              </form>

              {/* KẾT QUẢ SINH KEY & TIN NHẮN ZALO */}
              {recordKeyResult && (
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">
                      Mã Key kích hoạt Pro (REC-prefix-expts-sig):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={recordKeyResult}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-rose-500/50 font-mono text-xs text-rose-300 font-bold select-all focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCopyRecordKey}
                        className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 border border-slate-700 cursor-pointer"
                      >
                        {recordCopiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        {recordCopiedKey ? 'Đã copy Key!' : 'Copy Key'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-300 font-bold">
                        Tin nhắn Zalo gửi khách hàng (đã định dạng chuẩn):
                      </label>
                      <button
                        type="button"
                        onClick={handleCopyRecordZaloMsg}
                        className="py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow cursor-pointer"
                      >
                        {recordCopiedMsg ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                        {recordCopiedMsg ? 'Đã copy tin nhắn Zalo!' : 'Sao chép tin nhắn Zalo gửi Khách'}
                      </button>
                    </div>
                    <textarea
                      readOnly
                      rows={7}
                      value={recordZaloMsg}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] leading-relaxed text-slate-200 select-all focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* LỊCH SỬ CÁC KEY ĐÃ TẠO GẦN ĐÂY */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-slate-200 block text-xs">
                Lịch sử các Key Screen Record đã tạo gần đây ({recordHistory.length} bản ghi):
              </span>
              {recordHistory.length === 0 ? (
                <p className="text-slate-500 py-3 text-center">Chưa có key nào được tạo gần đây.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead className="text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-2">Thời gian</th>
                        <th className="py-2 px-2">Mã máy</th>
                        <th className="py-2 px-2">Gói</th>
                        <th className="py-2 px-2">Key Pro</th>
                        <th className="py-2 px-2 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {recordHistory.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-900/60">
                          <td className="py-2 px-2 text-slate-400 whitespace-nowrap">{item.createdAt}</td>
                          <td className="py-2 px-2 font-mono text-rose-300 font-bold">{item.mid}</td>
                          <td className="py-2 px-2 text-sky-300 font-semibold">{item.plan}</td>
                          <td className="py-2 px-2 font-mono text-emerald-400 truncate max-w-xs">{item.key}</td>
                          <td className="py-2 px-2 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(item.key);
                                alert(`Đã sao chép Key của máy ${item.mid}!`);
                              }}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] cursor-pointer"
                            >
                              Copy Key
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: TOOL TẠO KEY BẢN QUYỀN - ĐINH THÀNH CLEANER PRO v4.5 VIP */}
        {adminTab === 'cleaner' && (
          <div className="space-y-4 my-2">
            {/* THÔNG BÁO THUẬT TOÁN BẢO MẬT */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 text-emerald-200 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <div className="font-bold text-white text-sm">
                  MẬT MÃ SHA-256 & TẠO KEY BẢN QUYỀN - ĐINH THÀNH CLEANER PRO v4.5 VIP
                </div>
                <div>
                  Thuật toán tương thích 100% với <code>Tao_Key_Ban_Quyen.py</code> và phần mềm desktop <code>DinhThanh_Cleaner_Pro.exe</code> của Thầy Đinh Văn Thành.
                </div>
              </div>
            </div>

            {/* FORM TẠO KEY BẢN QUYỀN */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-4">
              <form onSubmit={handleGenerateCleanerKey} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Mã Máy Tính của Khách (Hardware Code DT-XXXX-XXXX-XXXX) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: DT-8899-A1B2-C3D4"
                      value={cleanerMid}
                      onChange={(e) => setCleanerMid(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-emerald-500 outline-none uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Gói Bản Quyền Cần Cấp
                    </label>
                    <select
                      value={cleanerPackage}
                      onChange={(e) => setCleanerPackage(e.target.value as any)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-emerald-500 outline-none"
                    >
                      <option value="lifetime">VIP Trọn Đời (50.000đ - Phổ biến nhất)</option>
                      <option value="2year">Gói 2 Năm (40.000đ - 730 ngày)</option>
                      <option value="1year">Gói 1 Năm (30.000đ - 365 ngày)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/30 transition-all"
                  >
                    <Key className="w-4 h-4" />
                    ⚡ TẠO MÃ KÍCH HOẠT PRO CLEANER (SHA-256)
                  </button>
                  {cleanerGenError && (
                    <span className="text-rose-400 font-semibold text-xs">{cleanerGenError}</span>
                  )}
                </div>
              </form>

              {/* KẾT QUẢ SINH KEY */}
              {cleanerKeyResult && (
                <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-emerald-500/50 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">
                      Mã Key Bản Quyền VIP vừa tạo (Chuẩn định dạng PRO-XXXX-XXXX-XXXX-XXXX):
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                      SHA-256 HỢP LỆ
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={cleanerKeyResult}
                      className="flex-1 py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-sm font-black select-all"
                    />
                    <button
                      type="button"
                      onClick={handleCopyCleanerKey}
                      className="py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                    >
                      {cleanerCopiedKey ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                      {cleanerCopiedKey ? 'Đã copy Key!' : 'Copy Key'}
                    </button>
                  </div>

                  {/* KHUNG TIN NHẮN ZALO MẪU */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                        Tin nhắn Zalo mẫu (Đã điền sẵn mã máy và mã key):
                      </label>
                      <button
                        type="button"
                        onClick={handleCopyCleanerZaloMsg}
                        className="text-[11px] py-1 px-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        {cleanerCopiedMsg ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                        {cleanerCopiedMsg ? 'Đã copy tin nhắn Zalo!' : 'Sao chép tin nhắn Zalo gửi Khách'}
                      </button>
                    </div>
                    <textarea
                      readOnly
                      rows={7}
                      value={cleanerZaloMsg}
                      className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs leading-relaxed select-all"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* LỊCH SỬ CÁC KEY CLEANER ĐÃ CẤP */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Lịch sử các Key Đinh Thành Cleaner Pro đã tạo gần đây ({cleanerHistory.length} bản ghi):
              </div>
              {cleanerHistory.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  Chưa có mã bản quyền Cleaner nào được tạo trên trình duyệt này.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400">
                        <th className="pb-2 px-2">Thời gian</th>
                        <th className="pb-2 px-2">Mã máy (HWID)</th>
                        <th className="pb-2 px-2">Gói cước</th>
                        <th className="pb-2 px-2">Key Bản Quyền</th>
                        <th className="pb-2 px-2 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {cleanerHistory.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-900/60">
                          <td className="py-2 px-2 text-slate-400 whitespace-nowrap">{item.createdAt}</td>
                          <td className="py-2 px-2 font-mono text-emerald-300 font-bold">{item.mid}</td>
                          <td className="py-2 px-2 text-sky-300 font-semibold">{item.plan}</td>
                          <td className="py-2 px-2 font-mono text-amber-300 truncate max-w-xs">{item.key}</td>
                          <td className="py-2 px-2 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(item.key);
                                alert(`Đã sao chép Key của máy ${item.mid}!`);
                              }}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] cursor-pointer"
                            >
                              Copy Key
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: CHUẨN HÓA VĂN BẢN HÀNH CHÍNH AI (NGHỊ ĐỊNH 30/2020) */}
        {adminTab === 'chuanhoavb' && (
          <div className="space-y-4 my-2 overflow-y-auto max-h-[70vh] pr-1">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-amber-950/20 to-slate-800/80 border border-red-800/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                      Tạo Key Bản Quyền Chuẩn Hóa Văn Bản Hành Chính AI
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Thuật toán SHA-256 Hardware Binding • Khóa chặt theo Mã máy tính DVT-CHVB-XXXX-XXXX
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-bold border border-red-500/30">
                  NGHỊ ĐỊNH 30/2020
                </span>
              </div>

              <form onSubmit={handleGenerateCHVBKey} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Mã Máy Tính (Hardware Code) của Khách hàng:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: DVT-CHVB-8899-A1B2"
                      value={chvbMid}
                      onChange={(e) => setChvbMid(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs uppercase focus:outline-none focus:border-red-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Gói bản quyền cấp phép:
                    </label>
                    <select
                      value={chvbPackage}
                      onChange={(e) => setChvbPackage(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-red-400"
                    >
                      <option value="1year">Gói 1 Năm (199.000đ)</option>
                      <option value="2year">Gói 2 Năm (299.000đ)</option>
                      <option value="lifetime">Gói Trọn Đời VIP (499.000đ)</option>
                    </select>
                  </div>
                </div>

                {chvbGenError && (
                  <p className="text-red-400 text-xs font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {chvbGenError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-md shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>TẠO KEY BẢN QUYỀN CHUẨN HÓA VB NGAY</span>
                </button>
              </form>

              {chvbKeyResult && (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-red-800/60 space-y-3 animate-fadeIn">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                      Mã Key Kích Hoạt (Gửi khách dán vào Tab Bản Quyền):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={chvbKeyResult}
                        className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-amber-300 font-mono text-xs font-bold select-all"
                      />
                      <button
                        type="button"
                        onClick={handleCopyCHVBKey}
                        className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        {chvbCopiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{chvbCopiedKey ? 'Đã copy!' : 'Copy Key'}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-400 uppercase">
                        Tin nhắn Zalo mẫu (Đã điền sẵn mã máy và key):
                      </label>
                      <button
                        type="button"
                        onClick={handleCopyCHVBZaloMsg}
                        className="text-[11px] py-1 px-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        {chvbCopiedMsg ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                        <span>{chvbCopiedMsg ? 'Đã copy tin nhắn Zalo!' : 'Sao chép tin nhắn Zalo gửi Khách'}</span>
                      </button>
                    </div>
                    <textarea
                      readOnly
                      rows={7}
                      value={chvbZaloMsg}
                      className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs leading-relaxed select-all"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Lịch sử Key Chuẩn Hóa VB */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-400" />
                Lịch sử các Key Chuẩn Hóa VB đã tạo gần đây ({chvbHistory.length} bản ghi):
              </div>
              {chvbHistory.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  Chưa có mã bản quyền Chuẩn Hóa VB nào được tạo trên trình duyệt này.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400">
                        <th className="pb-2 px-2">Thời gian</th>
                        <th className="pb-2 px-2">Mã máy (HWID)</th>
                        <th className="pb-2 px-2">Gói cước</th>
                        <th className="pb-2 px-2">Key Bản Quyền</th>
                        <th className="pb-2 px-2 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {chvbHistory.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-900/60">
                          <td className="py-2 px-2 text-slate-400 whitespace-nowrap">{item.createdAt}</td>
                          <td className="py-2 px-2 font-mono text-red-300 font-bold">{item.mid}</td>
                          <td className="py-2 px-2 text-sky-300 font-semibold">{item.plan}</td>
                          <td className="py-2 px-2 font-mono text-amber-300 truncate max-w-xs">{item.key}</td>
                          <td className="py-2 px-2 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(item.key);
                                alert(`Đã sao chép Key của máy ${item.mid}!`);
                              }}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] cursor-pointer"
                            >
                              Copy Key
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 8: PDF SUITE PRO (TÁCH - GỘP - LỌC TRANG TRẮNG AI) */}
        {adminTab === 'pdfsuite' && (
          <div className="space-y-4 my-2 overflow-y-auto max-h-[70vh] pr-1">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-pink-950/20 to-slate-800/80 border border-purple-800/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                      Tạo Key Bản Quyền PDF Suite Pro
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Thuật toán SHA-256 Hardware Binding • Khóa chặt theo Mã máy tính DVT-PDF-XXXX-XXXX
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 text-[10px] font-bold border border-pink-500/30">
                  TÁCH/GỘP/LỌC PDF
                </span>
              </div>

              <form onSubmit={handleGeneratePDFKey} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Mã Máy Tính (Hardware Code) của Khách hàng:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: DVT-PDF-7788-B2C3"
                      value={pdfMid}
                      onChange={(e) => setPdfMid(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xs uppercase focus:outline-none focus:border-pink-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Gói bản quyền cấp phép:
                    </label>
                    <select
                      value={pdfPackage}
                      onChange={(e) => setPdfPackage(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-pink-400"
                    >
                      <option value="1year">Gói 1 Năm (199.000đ)</option>
                      <option value="2year">Gói 2 Năm (299.000đ)</option>
                      <option value="lifetime">Gói Trọn Đời VIP (499.000đ)</option>
                    </select>
                  </div>
                </div>

                {pdfGenError && (
                  <p className="text-red-400 text-xs font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {pdfGenError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-pink-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>TẠO KEY BẢN QUYỀN PDF SUITE PRO NGAY</span>
                </button>
              </form>

              {pdfKeyResult && (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-pink-800/60 space-y-3 animate-fadeIn">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                      Mã Key Kích Hoạt (Gửi khách dán vào Tab Bản Quyền):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={pdfKeyResult}
                        className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-amber-300 font-mono text-xs font-bold select-all"
                      />
                      <button
                        type="button"
                        onClick={handleCopyPDFKey}
                        className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        {pdfCopiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{pdfCopiedKey ? 'Đã copy!' : 'Copy Key'}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-400 uppercase">
                        Tin nhắn Zalo mẫu (Đã điền sẵn mã máy và key):
                      </label>
                      <button
                        type="button"
                        onClick={handleCopyPDFZaloMsg}
                        className="text-[11px] py-1 px-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        {pdfCopiedMsg ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                        <span>{pdfCopiedMsg ? 'Đã copy tin nhắn Zalo!' : 'Sao chép tin nhắn Zalo gửi Khách'}</span>
                      </button>
                    </div>
                    <textarea
                      readOnly
                      rows={7}
                      value={pdfZaloMsg}
                      className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs leading-relaxed select-all"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Lịch sử Key PDF Suite */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-pink-400" />
                Lịch sử các Key PDF Suite Pro đã tạo gần đây ({pdfHistory.length} bản ghi):
              </div>
              {pdfHistory.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  Chưa có mã bản quyền PDF Suite nào được tạo trên trình duyệt này.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400">
                        <th className="pb-2 px-2">Thời gian</th>
                        <th className="pb-2 px-2">Mã máy (HWID)</th>
                        <th className="pb-2 px-2">Gói cước</th>
                        <th className="pb-2 px-2">Key Bản Quyền</th>
                        <th className="pb-2 px-2 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {pdfHistory.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-900/60">
                          <td className="py-2 px-2 text-slate-400 whitespace-nowrap">{item.createdAt}</td>
                          <td className="py-2 px-2 font-mono text-pink-300 font-bold">{item.mid}</td>
                          <td className="py-2 px-2 text-sky-300 font-semibold">{item.plan}</td>
                          <td className="py-2 px-2 font-mono text-amber-300 truncate max-w-xs">{item.key}</td>
                          <td className="py-2 px-2 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(item.key);
                                alert(`Đã sao chép Key của máy ${item.mid}!`);
                              }}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] cursor-pointer"
                            >
                              Copy Key
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL TẠO KEY TRỰC TIẾP */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                Cấp Bản Quyền Mới (Tạo Key Online)
              </h3>
              <form onSubmit={handleCreateDirect} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mã Máy Tính (Machine ID) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: MB-E10D-BE85"
                    value={newMid}
                    onChange={(e) => setNewMid(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tên Thầy/Cô</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Thầy Đinh Văn Thành"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Số Zalo</label>
                    <input
                      type="text"
                      placeholder="0915..."
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Gói Kích Hoạt</label>
                    <select
                      value={newPkg}
                      onChange={(e) => setNewPkg(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="LIFETIME">Trọn Đời (Vĩnh Viễn)</option>
                      <option value="1YEAR">1 Năm (365 ngày)</option>
                      <option value="2YEAR">2 Năm</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Trường / Đơn Vị</label>
                  <input
                    type="text"
                    placeholder="Trường THCS..."
                    value={newSchool}
                    onChange={(e) => setNewSchool(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md transition-colors"
                  >
                    Kích Hoạt Pro Ngay
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL CẤU HÌNH SUPABASE */}
        {showConfigModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
              <button 
                onClick={() => setShowConfigModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <Cloud className="w-6 h-6 text-sky-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Kết Nối Cơ Sở Dữ Liệu Cloud Supabase</h3>
                  <p className="text-[11px] text-slate-400">Đồng bộ đám mây quốc tế 24/7 – Không lo tắt máy tính</p>
                </div>
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Supabase Project URL</label>
                  <input
                    type="text"
                    placeholder="https://your-project.supabase.co"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Supabase Anon Public Key</label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-sky-400"
                  />
                </div>

                {configSuccess && (
                  <p className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Đã lưu cấu hình Cloud thành công!
                  </p>
                )}

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold shadow-md transition-colors"
                  >
                    Lưu & Kích Hoạt Cloud 24/7
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Đóng
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
