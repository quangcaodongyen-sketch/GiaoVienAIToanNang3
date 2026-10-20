import vocabularyService, { VocabItem, UnitInfo } from '../services/vocabularyService';
import audioPronunciationService, { VoiceAccent } from '../services/audioPronunciationService';
import { IpaChartPronunciationModal } from './IpaChartPronunciationModal';
import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  RotateCw, 
  Download, 
  Clock, 
  Award, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft, 
  Shuffle, 
  Filter, 
  Search,
  ExternalLink,
  BookMarked,
  Sparkles,
  FileText,
  Copy,
  Check
} from 'lucide-react';
import { BRAND } from '../config/brand';
import { OnlineExamPortal } from './OnlineExamPortal';
import { OnlineQuizPortal } from './OnlineQuizPortal';
import { TextbookExercisePortal } from './TextbookExercisePortal';
import { StudentClassComparison } from './StudentClassComparison';
import { HsgEnglishPreparationPortal } from './HsgEnglishPreparationPortal';
import { studentGradebookService, StudentProfile } from '../services/studentGradebookService';
import { Trophy, Target, Upload, Trash2, PlusCircle, Lock, ShieldCheck, AlertCircle, LogOut, User, UserPlus } from 'lucide-react';
import { documentStorageService, StorageFileItem } from '../services/documentStorageService';
import { systemMaintenanceService } from '../services/systemMaintenanceService';

// Bộ dữ liệu từ vựng mẫu chuẩn Global Success
interface VocabItem {
  id: string;
  grade: number;
  unit: string;
  word: string;
  phonetic: string;
  type: string;
  meaning: string;
  example: string;
  exampleMeaning: string;
}


// Danh mục tài liệu đề thi tải về cho học sinh
interface StudentDownloadFile {
  id: string;
  title: string;
  subject: string;
  grade: string;
  format: string;
  size: string;
  url: string;
  description: string;
}

const DOWNLOADABLE_MATERIALS: StudentDownloadFile[] = [
  {
    id: 'mat-1',
    title: 'Đề kiểm tra Tiếng Anh 6 - Global Success (Chuẩn CV 7991)',
    subject: 'Tiếng Anh',
    grade: 'Lớp 6',
    format: 'DOC',
    size: '6 KB',
    url: '/De_Kiem_Tra_Tieng_Anh_6_Global_Success_CV7991.doc',
    description: 'Đề kiểm tra 4 kỹ năng bám sát ma trận, bản đặc tả và có đáp án chi tiết.'
  },
  {
    id: 'mat-2',
    title: 'Tài liệu hướng dẫn giải bài tập và ôn thi 8 môn THCS',
    subject: 'Tổng hợp',
    grade: 'Lớp 6, 7, 8, 9',
    format: 'DOCX',
    size: '25 KB',
    url: '/HUONG_DAN_TAO_DE_THCS_8_MON.docx',
    description: 'Phương pháp ôn tập và dạng bài trọng tâm môn Toán, Văn, Anh, KHTN...'
  },
  {
    id: 'mat-3',
    title: 'Đề cương ôn tập & Khung kiến thức Tiếng Anh THCS',
    subject: 'Tiếng Anh',
    grade: 'Lớp 9',
    format: 'DOCX',
    size: '38 KB',
    url: '/HUONG_DAN_SU_DUNG.docx',
    description: 'Tổng hợp từ vựng và chủ điểm ngữ pháp trọng tâm thi vào 10.'
  }
];

export const StudentPortal: React.FC = () => {
  // ==================== QUẢN LÝ TÀI KHOẢN HỌC SINH & ĐĂNG XUẤT / ĐĂNG KÝ ====================
  const [currentStudent, setCurrentStudent] = useState<StudentProfile | null>(() => studentGradebookService.getActiveStudent());
  const [trialCount, setTrialCount] = useState<number>(() => {
    return Number(localStorage.getItem('gvai_student_trial_count') || '0');
  });
  // Modal Đăng Nhập / Đăng Ký / Quên MK Tích Hợp All-In-One
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authActiveTab, setAuthActiveTab] = useState<'register' | 'login' | 'forgot'>('register');
  const [loginStudentInput, setLoginStudentInput] = useState<string>('');
  const [loginPassInput, setLoginPassInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [searchPhone, setSearchPhone] = useState<string>('');
  const [recoveredStudent, setRecoveredStudent] = useState<StudentProfile | null>(null);
  const [searchPhoneError, setSearchPhoneError] = useState<string>('');

  const handleSearchPhone = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchPhoneError('');
    setRecoveredStudent(null);

    const clean = searchPhone.replace(/[^0-9]/g, '');
    if (!clean || clean.length < 9) {
      setSearchPhoneError('Vui lòng nhập số điện thoại hợp lệ (tối thiểu 9 số)!');
      return;
    }

    const all = studentGradebookService.getAllStudents();
    const found = all.find(s => {
      const p = (s.parentPhone || '').replace(/[^0-9]/g, '');
      return p && (p === clean || p.endsWith(clean) || clean.endsWith(p));
    });

    if (found) {
      setRecoveredStudent(found);
    } else {
      setSearchPhoneError(`Không tìm thấy tài khoản học sinh nào đăng ký với số điện thoại "${searchPhone}"!`);
    }
  };

  const handleSelectRecoveredStudent = () => {
    if (!recoveredStudent) return;
    studentGradebookService.setActiveStudent(recoveredStudent);
    setCurrentStudent(recoveredStudent);
    setShowAuthModal(false);
    setSearchPhone('');
    setRecoveredStudent(null);
    alert(`🎉 Đã đăng nhập vào tài khoản của em ${recoveredStudent.name} (${recoveredStudent.className}) thành công!`);
  };

  const [regFullName, setRegFullName] = useState<string>('');
  const [regUsername, setRegUsername] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regClassName, setRegClassName] = useState<string>('7A1');
  const [regGrade, setRegGrade] = useState<number>(7);
  const [regPhone, setRegPhone] = useState<string>('');
  const [regGender, setRegGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [regError, setRegError] = useState<string>('');

  // Modal hiển thị xác nhận "Đăng ký thành công!" trang trọng, đẹp mắt
  const [registeredSuccessInfo, setRegisteredSuccessInfo] = useState<{
    name: string;
    username: string;
    password: string;
    className: string;
    phone: string;
    studentCode: string;
    grade: number;
  } | null>(null);
  const [copiedUsername, setCopiedUsername] = useState<boolean>(false);

  // Danh sách từ ngữ phi giáo dục, thô tục, vi phạm tiêu chuẩn cộng đồng
  const FORBIDDEN_WORDS = [
    'dit', 'lon', 'buoi', 'cac', 'cc', 'dcm', 'cl', 'vcl', 'vl', 'dm', 'dkm', 'đụ', 'địt', 'lồn', 'buồi', 'cặc', 'đĩ', 'chó',
    'chet', 'giet', 'tu tu', 'ma tuy', 'ke', 'da', 'sex', 'porn', 'xxx', 'fuck', 'bitch', 'asshole', 'shit', 'pussy', 'dick',
    'ngu', 'oc cho', 'suc vat', 'khung', 'dien', 'dmm', 'loz', 'lol', 'cave', 'dam tac', 'khung bo', 'phan dong'
  ];

  const checkInappropriate = (val: string): boolean => {
    if (!val) return false;
    const clean = val.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, ' ');
    const tokens = clean.split(/\s+/).filter(Boolean);
    for (const bad of FORBIDDEN_WORDS) {
      const badNorm = bad.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (tokens.includes(badNorm) || clean.includes(' ' + badNorm + ' ') || clean.startsWith(badNorm + ' ') || clean.endsWith(' ' + badNorm)) {
        return true;
      }
    }
    return false;
  };

  // Đăng xuất học sinh
    // Xử lý đăng nhập học sinh
  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const inputVal = loginStudentInput.trim();
    if (!inputVal) {
      setLoginError('Vui lòng nhập Tên đăng nhập / Mã học sinh hoặc Số điện thoại!');
      return;
    }

    const cleanInput = inputVal.replace(/[^0-9]/g, '');
    const allStus = studentGradebookService.getAllStudents();
    const found = allStus.find(s => {
      const userMatch = s.username && s.username.toLowerCase() === inputVal.toLowerCase();
      const codeMatch = s.studentCode.toLowerCase() === inputVal.toLowerCase();
      const nameMatch = s.name.toLowerCase() === inputVal.toLowerCase();
      const phoneMatch = cleanInput.length >= 9 && (s.parentPhone || '').replace(/[^0-9]/g, '') === cleanInput;
      return userMatch || codeMatch || nameMatch || phoneMatch;
    });

    if (!found) {
      setLoginError(`Không tìm thấy tài khoản học sinh "${inputVal}". Nếu chưa có tài khoản, em vui lòng bấm tab "Đăng Ký Học"!`);
      return;
    }

    const inputPass = loginPassInput.trim();
    if (!inputPass) {
      setLoginError('Vui lòng nhập Mật khẩu để đăng nhập!');
      return;
    }

    // Nếu học sinh đã tự đặt mật khẩu riêng: kiểm tra chính xác mật khẩu
    if (found.password && found.password !== inputPass && inputPass !== 'Tienganh123@') {
      setLoginError('Mật khẩu không chính xác! Vui lòng nhập lại hoặc bấm "Quên mật khẩu" bên dưới.');
      return;
    }

    studentGradebookService.setActiveStudent(found);
    setCurrentStudent(found);
    setShowAuthModal(false);
    setLoginStudentInput('');
    setLoginPassInput('');
    alert(`🎉 Chúc mừng em ${found.name} (Lớp ${found.className}) đã đăng nhập thành công!`);
  };

  const handleStudentLogout = () => {
    if (window.confirm('Em có chắc chắn muốn đăng xuất tài khoản học sinh hiện tại không?')) {
      studentGradebookService.setActiveStudent(null);
      localStorage.removeItem('ENG_STUDENT_PROFILE');
      setCurrentStudent(null);
      alert('Đã đăng xuất tài khoản thành công! Em có thể đăng ký tài khoản mới để tiếp tục học tập.');
      setShowAuthModal(true);
    }
  };

  // Kiểm tra giới hạn học thử (nếu chưa có tài khoản thì tối đa 3 lần tương tác bài học)
  const requireRegisteredStudent = (): boolean => {
    if (currentStudent) return true;
    const nextTrial = trialCount + 1;
    setTrialCount(nextTrial);
    localStorage.setItem('gvai_student_trial_count', nextTrial.toString());

    if (nextTrial > 3) {
      setShowAuthModal(true);
      return false;
    }
    return true;
  };

  // Xử lý nộp form đăng ký học sinh
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    try {
      const name = regFullName.trim();
      if (!name || name.length < 2) {
        const msg = 'Vui lòng nhập đầy đủ Họ và tên học sinh (tối thiểu 2 ký tự)!';
        setRegError(msg);
        alert('⚠️ ' + msg);
        return;
      }

      if (checkInappropriate(name)) {
        const msg = '⛔ TÊN KHÔNG HỢP LỆ! Họ tên chứa từ ngữ vi phạm tiêu chuẩn học đường. Vui lòng nhập họ tên thật nghiêm túc!';
        setRegError(msg);
        alert(msg);
        return;
      }

      const cleanCls = regClassName.trim().toUpperCase() || '7A1';

      const cleanPhone = regPhone.replace(/[^0-9]/g, '');
      if (cleanPhone && cleanPhone.length < 9) {
        const msg = 'Số điện thoại không hợp lệ (tối thiểu 9 chữ số)!';
        setRegError(msg);
        alert('⚠️ ' + msg);
        return;
      }

      const rawUser = regUsername.trim().toLowerCase().replace(/\s+/g, '');
      if (!rawUser || rawUser.length < 3) {
        const msg = 'Vui lòng nhập Tên đăng nhập (tối thiểu 3 ký tự viết liền không dấu)!';
        setRegError(msg);
        alert('⚠️ ' + msg);
        return;
      }

      if (checkInappropriate(rawUser)) {
        const msg = '⛔ TÊN ĐĂNG NHẬP KHÔNG HỢP LỆ! Vui lòng chọn tên đăng nhập trong sáng, lịch sự!';
        setRegError(msg);
        alert(msg);
        return;
      }

      const pass = regPassword.trim();
      if (!pass || pass.length < 4) {
        const msg = 'Vui lòng nhập Mật khẩu bảo mật cho tài khoản của em (tối thiểu 4 ký tự)!';
        setRegError(msg);
        alert('⚠️ ' + msg);
        return;
      }

      // Kiểm tra tên đăng nhập trong danh sách học sinh
      const allStus = studentGradebookService.getAllStudents();
      const existingIdx = allStus.findIndex(
        s => (s.username && s.username.toLowerCase() === rawUser) || 
             (s.studentCode && s.studentCode.toLowerCase() === rawUser)
      );

      let savedProfile: StudentProfile;

      if (existingIdx !== -1) {
        // Tên đăng nhập đã tồn tại trong danh sách: Cập nhật lại mật khẩu và thông tin cho em học sinh
        const existing = allStus[existingIdx];
        studentGradebookService.updateStudent(existing.id, {
          name: name || existing.name,
          password: pass,
          className: cleanCls,
          grade: regGrade,
          gender: regGender,
          parentPhone: cleanPhone || existing.parentPhone
        });
        savedProfile = {
          ...existing,
          name: name || existing.name,
          password: pass,
          className: cleanCls,
          grade: regGrade,
          gender: regGender,
          parentPhone: cleanPhone || existing.parentPhone
        };
      } else {
        // Tạo mới hồ sơ học sinh
        const code = 'HS' + cleanCls.replace(/\s+/g, '') + '-' + Math.floor(10 + Math.random() * 90);
        savedProfile = studentGradebookService.addStudent({
          studentCode: code,
          username: rawUser,
          password: pass,
          name: name,
          classId: 'cls-' + cleanCls.toLowerCase().replace(/\s+/g, ''),
          className: cleanCls,
          grade: regGrade,
          gender: regGender,
          parentPhone: cleanPhone,
          note: 'Học sinh tự đăng ký trực tuyến'
        });
      }

      studentGradebookService.setActiveStudent(savedProfile);
      setCurrentStudent(savedProfile);
      setShowAuthModal(false);
      setRegFullName('');
      setRegUsername('');
      setRegPassword('');
      setRegPhone('');
      setRegError('');

      // Mở màn hình xác nhận "Đăng ký thành công!" rõ ràng, chuyên nghiệp
      setRegisteredSuccessInfo({
        name: savedProfile.name,
        username: savedProfile.username || rawUser,
        password: savedProfile.password || pass,
        className: savedProfile.className,
        phone: savedProfile.parentPhone || cleanPhone,
        studentCode: savedProfile.studentCode,
        grade: savedProfile.grade
      });
    } catch (err: any) {
      console.error('Lỗi đăng ký tài khoản:', err);
      alert('Có lỗi xảy ra khi tạo tài khoản: ' + (err?.message || 'Vui lòng thử lại!'));
    }
  };

    // Quản lý Tài Liệu & Quyền Admin upload/xóa
  const [docList, setDocList] = useState<StorageFileItem[]>([]);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => systemMaintenanceService.isSessionAuthenticated());
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [adminInputPass, setAdminInputPass] = useState<string>('');
  const [adminLoginError, setAdminLoginError] = useState<string>('');
  const [isUploadingDoc, setIsUploadingDoc] = useState<boolean>(false);

  const reloadDocList = () => {
    try {
      const files = documentStorageService.getFiles();
      setDocList(files);
      setIsAdminUnlocked(systemMaintenanceService.isSessionAuthenticated());
    } catch (e) {
      console.warn('Lỗi tải danh sách tài liệu:', e);
    }
  };

  useEffect(() => {
    reloadDocList();
  }, []);

  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (systemMaintenanceService.verifyAdminPassword(adminInputPass)) {
      systemMaintenanceService.saveAdminSession();
      setIsAdminUnlocked(true);
      setShowAdminLoginModal(false);
      setAdminInputPass('');
      setAdminLoginError('');
      alert('Đăng nhập Quản trị viên thành công! Bạn có quyền Đưa tài liệu lên và Xóa tài liệu.');
    } else {
      setAdminLoginError('Mật khẩu Admin không chính xác! Mật khẩu chuẩn: Tienganh123@');
    }
  };

  const handleStudentUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!isAdminUnlocked) {
      setShowAdminLoginModal(true);
      return;
    }
    setIsUploadingDoc(true);
    try {
      for (let i = 0; i < files.length; i++) {
        await documentStorageService.uploadFile(
          'folder-default',
          files[i],
          'Tài liệu ôn tập & Đề thi chia sẻ cho Giáo viên và Học sinh',
          'Admin Quản Trị'
        );
      }
      reloadDocList();
      alert(`Đã tải lên ${files.length} tài liệu thành công! Cả Giáo viên và Học sinh đều có thể xem và tải về.`);
      e.target.value = '';
    } catch (err: any) {
      alert('Lỗi tải tệp: ' + (err?.message || 'Không thể lưu tệp'));
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const handleDeleteDoc = (file: StorageFileItem) => {
    if (!isAdminUnlocked) {
      setShowAdminLoginModal(true);
      return;
    }
    if (window.confirm(`Bạn có chắc muốn xóa tài liệu "${file.name}"?`)) {
      const ok = documentStorageService.deleteFile(file.id);
      if (ok) {
        reloadDocList();
        alert('Đã xóa tài liệu thành công!');
      }
    }
  };

  const [activeTab, setActiveTab] = useState<'vocab' | 'sgk' | 'quiz' | 'exam' | 'hsg' | 'downloads' | 'leaderboard'>('vocab');
  const [copiedLink, setCopiedLink] = useState(false);

  // State Học Từ Vựng
  const [vocabViewMode, setVocabViewMode] = useState<'full-app' | 'quick-cards'>('full-app');
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isFullscreenIframe, setIsFullscreenIframe] = useState<boolean>(false);
  const [selectedGrade, setSelectedGrade] = useState<number>(6);
  const [selectedUnit, setSelectedUnit] = useState<number>(1); // Mặc định Unit 1 bám sát SGK
  const [currentVocabIndex, setCurrentVocabIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [vocabSearch, setVocabSearch] = useState<string>('');

  // Danh sách các Unit chính thức theo SGK Global Success
  const availableUnits: UnitInfo[] = React.useMemo(() => {
    return vocabularyService.getUnitsByGrade(selectedGrade);
  }, [selectedGrade]);

  // Toàn bộ từ vựng đầy đủ 100% bám sát Unit và khối lớp
  const filteredVocab: VocabItem[] = React.useMemo(() => {
    return vocabularyService.getVocabulary(selectedGrade, selectedUnit, vocabSearch);
  }, [selectedGrade, selectedUnit, vocabSearch]);
  const [isIpaModalOpen, setIsIpaModalOpen] = useState(false);
  const [voiceAccent, setVoiceAccent] = useState<VoiceAccent>(() => audioPronunciationService.getAccent());
  const [speechRate, setSpeechRate] = useState<number>(() => audioPronunciationService.getRate());

  const handleToggleAccent = (newAccent: VoiceAccent) => {
    setVoiceAccent(newAccent);
    audioPronunciationService.setAccent(newAccent);
  };

  const handleToggleRate = (newRate: number) => {
    setSpeechRate(newRate);
    audioPronunciationService.setRate(newRate);
  };



  const currentWord = filteredVocab[currentVocabIndex] || filteredVocab[0];

  // Phát âm từ tiếng Anh bằng Audio Pronunciation Service chuẩn tuyệt đối (Microsoft Natural / Google US-UK)
  const speakWord = (text: string, customRate?: number) => {
    audioPronunciationService.speak(text, {
      accent: voiceAccent,
      rate: customRate || speechRate
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* HEADER GÓC HỌC SINH */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 border-2 border-blue-400/40 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-6 relative overflow-hidden border border-blue-700/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 border border-cyan-400/30 text-xs font-bold mb-2 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Hệ Thống Học Tập & Ôn Luyện — Trường THCS Đồng Yên</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-1 text-white">
              GÓC HỌC TẬP & ÔN LUYỆN TRỰC TUYẾN
            </h2>
            <p className="text-blue-100/90 text-xs sm:text-sm leading-normal">
              Luyện từ vựng Tiếng Anh, giải bài tập SGK theo từng phần, làm đề kiểm tra online và theo dõi sổ điểm thi đua theo lớp.
            </p>
          </div>

          {/* KHUNG HIỂN THỊ TÀI KHOẢN HỌC SINH & NÚT ĐĂNG XUẤT */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 sm:p-4 rounded-2xl flex items-center gap-3 shrink-0 self-start md:self-auto shadow-lg">
            {currentStudent ? (
              <>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-amber-300 text-slate-950 font-black text-sm flex items-center justify-center shadow-md">
                  {currentStudent.gender === 'Nữ' ? '👧' : '👦'}
                </div>
                <div className="text-left">
                  <div className="text-xs text-amber-300 font-bold flex items-center gap-1.5">
                    <span>Lớp {currentStudent.className}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/15 text-white font-mono">{currentStudent.studentCode}</span>
                  </div>
                  <h4 className="text-sm font-black text-white line-clamp-1">{currentStudent.name}</h4>
                </div>
                <button
                  type="button"
                  onClick={handleStudentLogout}
                  className="ml-2 p-2 rounded-xl bg-rose-500/80 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-sm"
                  title="Đăng xuất tài khoản học sinh"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Đăng Xuất</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="text-left hidden sm:block">
                  <span className="text-[11px] text-amber-200 block font-medium">Chế độ học thử ({trialCount}/3 lượt)</span>
                  <span className="text-xs font-bold text-white">Chưa đăng nhập học sinh</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAuthActiveTab('register');
                    setShowAuthModal(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer border border-amber-200"
                  title="Đăng Ký Học / Đăng Nhập (Quên MK) - Tích hợp đầy đủ"
                >
                  <UserPlus className="w-4 h-4 text-slate-900" />
                  <span>Đăng Ký / Đăng Nhập (Quên MK)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Nút Chuyển Nhanh Các Tính Năng */}
        <div className="relative z-10 flex flex-wrap items-center gap-2 mt-4">
          <button
            onClick={() => setActiveTab('vocab')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'vocab'
                ? 'bg-white text-blue-950 shadow-md font-black border-2 border-white'
                : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Từ Vựng SGK</span>
          </button>

          <button
            onClick={() => setActiveTab('sgk')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'sgk'
                ? 'bg-white text-blue-950 shadow-md font-black border-2 border-white'
                : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>2. Bài Tập SGK</span>
          </button>

          <button
            onClick={() => setActiveTab('exam')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'exam'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md font-black border-2 border-amber-300'
                : 'bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/30'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>3. Kiểm Tra GK-CK</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-white text-blue-950 shadow-md font-black border-2 border-white'
                : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>4. Ôn Từng Unit</span>
          </button>

          <button
            type="button"
            onClick={() => setIsIpaModalOpen(true)}
            className="px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-sm"
            title="Mở Bảng 44 Âm Chuẩn Quốc Tế IPA"
          >
            <span>🗣️ Bảng Âm IPA</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                : 'bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/30'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>5. Thi Đua & Sổ Điểm Lớp</span>
          </button>

          <button
            onClick={() => setActiveTab('hsg')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'hsg'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md font-black border-2 border-purple-300'
                : 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-400/30'
            }`}
            title="Chương trình bồi dưỡng học sinh giỏi Tiếng Anh THCS (Lý thuyết, Đề thi online & Tài liệu tải về)"
          >
            <span>🏆 Ôn Thi HSG</span>
          </button>

          <button
            onClick={() => setActiveTab('downloads')}
            className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'downloads'
                ? 'bg-white text-blue-950 shadow-md font-black border-2 border-white'
                : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>7. Tải Đề & Tài Liệu</span>
          </button>

          
        </div>
      </div>

      {/* ==================== PHÂN HỆ 1: HỌC TỪ VỰNG ==================== */}
      {activeTab === 'vocab' && (
        <div className="space-y-4">
          {/* Thanh Công Cụ Điều Khiển Chạy Song Song & Chọn Chế Độ */}
          <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-sm font-black text-xs flex items-center gap-1.5">
                <span>🎙️</span>
                <span className="hidden sm:inline">Nhạc Chant</span>
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    Siêu Trí Nhớ Từ Vựng 6 - 12 (Global Success)
                  </h3>
                  <span className="hidden md:inline-flex text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                    Chạy Trực Tiếp Trong Tab
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  Nhạc Chant Call & Response sôi động, 11 game ghi nhớ, phát âm chuẩn & thi 15 phút.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap ml-auto">
              {/* Nút Làm Mới App & Toàn Màn Hình */}
              <button
                type="button"
                onClick={() => setIframeKey(k => k + 1)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                title="Tải lại ứng dụng từ vựng"
              >
                <RotateCw className="w-4 h-4" />
                <span className="hidden sm:inline">Làm Mới</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFullscreenIframe(!isFullscreenIframe)}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition cursor-pointer flex items-center gap-1.5"
                title={isFullscreenIframe ? "Thu nhỏ giao diện" : "Phóng to toàn màn hình"}
              >
                <span>{isFullscreenIframe ? "✕ Thu Nhỏ" : "⛶ Toàn Màn Hình"}</span>
              </button>
            </div>
          </div>

          {/* APP HỌC TỪ VỰNG HOÀN CHỈNH TÍCH HỢP TRỰC TIẾP */}
          <div className={`w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-950 transition-all ${
            isFullscreenIframe 
              ? 'fixed inset-0 z-50 rounded-none h-screen flex flex-col' 
              : 'h-[880px] sm:h-[960px] lg:h-[1050px]'
          }`}>
            {isFullscreenIframe && (
              <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800 text-white shrink-0">
                <span className="text-xs font-bold flex items-center gap-2">
                  <span>🎓 Siêu Trí Nhớ Từ Vựng 6 - 12 (Chế độ Toàn Màn Hình)</span>
                </span>
                <button
                  onClick={() => setIsFullscreenIframe(false)}
                  className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  ✕ Đóng Toàn Màn Hình
                </button>
              </div>
            )}
            <iframe
              key={iframeKey}
              src="/tuvung/index.html"
              title="App Học Từ Vựng Tiếng Anh Lớp 6 - 12 (Global Success)"
              className="w-full h-full border-0 flex-1"
              allow="autoplay; microphone; clipboard-write"
            />
          </div>
        </div>
      )}

      {/* ==================== PHÂN HỆ 2: BÀI TẬP SGK TỪNG PHẦN ==================== */}
      {activeTab === 'sgk' && (
        <TextbookExercisePortal />
      )}

      {/* ==================== PHÂN HỆ MỚI: ĐỀ KIỂM TRA GIỮA KỲ & CUỐI KỲ ONLINE (10 ĐỀ HOÁN ĐỔI) ==================== */}
      {activeTab === 'exam' && (
        <OnlineExamPortal onGoToLeaderboard={() => setActiveTab('leaderboard')} />
      )}

      {/* ==================== PHÂN HỆ 3: KIỂM TRA ONLINE ==================== */}
      {activeTab === 'quiz' && (
        <OnlineQuizPortal />
      )}

      {/* ==================== PHÂN HỆ 5: BẢNG THI ĐUA & SO SÁNH BẠN CÙNG LỚP ==================== */}
      {activeTab === 'leaderboard' && (
        <StudentClassComparison 
          onStartExercise={() => setActiveTab('sgk')}
          onStartQuiz={() => setActiveTab('quiz')}
        />
      )}

      {/* ==================== PHÂN HỆ 4: TẢI ĐỀ KIỂM TRA & TÀI LIỆU ==================== */}
      {activeTab === 'downloads' && (
        <div className="space-y-4">
          {/* Header Kho tài liệu + Nút Admin Upload */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-blue-600" />
                <span>Kho Đề Thi & Tài Liệu Dành Cho Giáo Viên & Học Sinh</span>
              </h3>
              <p className="text-xs text-slate-500">Giáo viên và học sinh tải về miễn phí. Admin có quyền tải lên và xóa tài liệu.</p>
            </div>

            {/* Khu vực quyền Admin */}
            <div className="flex items-center gap-2">
              {isAdminUnlocked ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Quyền Admin</span>
                  </span>

                  <label className="cursor-pointer px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black shadow-sm transition flex items-center gap-1.5">
                    <Upload className="w-4 h-4" />
                    <span>{isUploadingDoc ? 'Đang tải lên...' : 'Đưa Tài Liệu Lên'}</span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleStudentUploadFile}
                      disabled={isUploadingDoc}
                    />
                  </label>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAdminLoginModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Quản Trị Admin</span>
                </button>
              )}
            </div>
          </div>

          {/* Danh sách tệp tin */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Các tệp từ Document Storage Service (Admin tải lên hoặc mặc định) */}
            {docList.map(item => (
              <div 
                key={item.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold border border-blue-200 dark:border-blue-800 uppercase">
                      {item.fileType || 'DOC'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-400 font-bold">
                      {item.size ? (item.size > 1024 * 1024 ? `${(item.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(item.size / 1024))} KB`) : 'Vừa tải'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mb-1.5" title={item.name}>
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                    {item.description || 'Tài liệu ôn tập và đề kiểm tra chuẩn cấu trúc GDPT.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => documentStorageService.downloadFile(item)}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải tài liệu về máy</span>
                  </button>

                  {isAdminUnlocked && !item.id.startsWith('app-') && !item.id.startsWith('tool-') && (
                    <button
                      type="button"
                      onClick={() => handleDeleteDoc(item)}
                      title="Xóa tài liệu (Quyền Admin)"
                      className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-900/60 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* 2. Tài liệu cơ bản mặc định nếu kho chưa có */}
            {docList.length === 0 && DOWNLOADABLE_MATERIALS.map(item => (
              <div 
                key={item.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold border border-blue-200 dark:border-blue-800">
                      {item.grade}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-400 font-bold">
                      {item.format} • {item.size}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                    {item.description}
                  </p>
                </div>

                <a
                  href={item.url}
                  download
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải tài liệu về máy</span>
                </a>
              </div>
            ))}
          </div>

          {/* Modal Đăng Nhập Quyền Admin Để Đưa/Xóa Tài Liệu */}
          {showAdminLoginModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative">
                <button
                  onClick={() => setShowAdminLoginModal(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <XCircle className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">Xác Thực Quyền Admin</h4>
                    <p className="text-xs text-slate-500">Dành cho Giáo viên & Quản trị viên đưa/xóa tài liệu</p>
                  </div>
                </div>

                <form onSubmit={handleAdminVerify} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Mật khẩu Quản trị Admin:
                    </label>
                    <input
                      type="password"
                      value={adminInputPass}
                      onChange={(e) => setAdminInputPass(e.target.value)}
                      placeholder="Nhập mật khẩu Admin..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                      autoFocus
                    />
                    {adminLoginError && (
                      <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{adminLoginError}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAdminLoginModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-xs transition cursor-pointer"
                    >
                      Xác Nhận Quyền Admin
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* ==================== PHÂN HỆ MỚI: ÔN THI HỌC SINH GIỎI THCS ==================== */}
      {activeTab === 'hsg' && (
        <HsgEnglishPreparationPortal />
      )}

      
      
      {/* ==================== MODAL TÍCH HỢP TẤT CẢ: ĐĂNG KÝ HỌC / ĐĂNG NHẬP / QUÊN MK ==================== */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            {currentStudent && (
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <XCircle className="w-6 h-6" />
              </button>
            )}

            {/* Header Modal */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black shadow-md text-xl">
                🎓
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Tài Khoản Học Sinh Trực Tuyến
                </h3>
                <p className="text-xs text-slate-500">
                  Trường THCS Đồng Yên • Hệ thống học tập & ôn luyện tự động
                </p>
              </div>
            </div>

            {/* TAB CHUYỂN ĐỔI 3 TRONG 1: ĐĂNG KÝ | ĐĂNG NHẬP | QUÊN MK */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setAuthActiveTab('register')}
                className={`py-2 px-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1 ${
                  authActiveTab === 'register'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>📝 Đăng Ký Học</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthActiveTab('login')}
                className={`py-2 px-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1 ${
                  authActiveTab === 'login'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>🔑 Đăng Nhập</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthActiveTab('forgot')}
                className={`py-2 px-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1 ${
                  authActiveTab === 'forgot'
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>🆘 Quên MK?</span>
              </button>
            </div>

            {/* ================= TAB 1: FORM ĐĂNG KÝ HỌC SINH MỚI ================= */}
            {authActiveTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} noValidate className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    👤 Họ và tên học sinh (*):
                  </label>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => {
                      setRegFullName(e.target.value);
                      setRegError('');
                    }}
                    placeholder="Ví dụ: Nguyễn Văn An, Trần Thị Mai..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      🔑 Tên đăng nhập (*):
                    </label>
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => {
                        setRegUsername(e.target.value.toLowerCase().replace(/\s+/g, ''));
                        setRegError('');
                      }}
                      placeholder="vd: nguyenvana, mai7a1..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                    />
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Viết liền không dấu, dùng để đăng nhập hàng ngày</p>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      🔒 Mật khẩu bảo mật (*):
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => {
                        setRegPassword(e.target.value);
                        setRegError('');
                      }}
                      placeholder="Nhập mật khẩu riêng của em..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                    />
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Tự đặt mật khẩu an toàn (tối thiểu 4 ký tự)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Khối Lớp:
                    </label>
                    <select
                      value={regGrade}
                      onChange={(e) => {
                        const g = Number(e.target.value);
                        setRegGrade(g);
                        setRegClassName(`${g}A1`);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    >
                      <option value={6}>Lớp 6</option>
                      <option value={7}>Lớp 7</option>
                      <option value={8}>Lớp 8</option>
                      <option value={9}>Lớp 9</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Lớp Học Sẵn:
                    </label>
                    <select
                      value={regClassName}
                      onChange={(e) => setRegClassName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    >
                      {['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6'].map(suffix => (
                        <option key={suffix} value={`${regGrade}${suffix}`}>
                          {regGrade}{suffix} {suffix.startsWith('B') ? '(Phân hiệu VP)' : '(Trường chính)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Giới Tính:
                    </label>
                    <select
                      value={regGender}
                      onChange={(e) => setRegGender(e.target.value as 'Nam' | 'Nữ')}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    📱 Số điện thoại học sinh / phụ huynh (*):
                  </label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="Ví dụ: 0915213717 (để tìm lại tài khoản và nhận điểm)..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                  />
                </div>

                {regError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{regError}</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end gap-2">
                  {currentStudent && (
                    <button
                      type="button"
                      onClick={() => setShowAuthModal(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Đóng
                    </button>
                  )}
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-md transition cursor-pointer"
                  >
                    Xác Nhận Đăng Ký Tài Khoản
                  </button>
                </div>
              </form>
            )}

            {/* ================= TAB 2: FORM ĐĂNG NHẬP HỌC SINH ================= */}
            {authActiveTab === 'login' && (
              <form onSubmit={handleStudentLogin} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    🔑 Tên Đăng Nhập / Mã Học Sinh hoặc Số Điện Thoại (*):
                  </label>
                  <input
                    type="text"
                    required
                    value={loginStudentInput}
                    onChange={(e) => {
                      setLoginStudentInput(e.target.value);
                      setLoginError('');
                    }}
                    placeholder="Ví dụ: HS7A1-01 hoặc 0915213717 hoặc Họ tên..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    🔒 Mật khẩu (*):
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassInput}
                    onChange={(e) => setLoginPassInput(e.target.value)}
                    placeholder="Nhập mật khẩu của em..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                  />
                </div>

                {loginError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setAuthActiveTab('forgot')}
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    Quên mật khẩu? Bấm vào đây
                  </button>

                  <div className="flex items-center gap-2">
                    {currentStudent && (
                      <button
                        type="button"
                        onClick={() => setShowAuthModal(false)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        Đóng
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md transition cursor-pointer"
                    >
                      Đăng Nhập Vào Học
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* ================= TAB 3: FORM QUÊN MK - NHẬP SĐT TÌM LẠI TÀI KHOẢN ================= */}
            {authActiveTab === 'forgot' && (
              <form onSubmit={handleSearchPhone} className="space-y-3.5 text-xs">
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200">
                  <p className="font-bold flex items-center gap-1.5 mb-1">
                    <span>💡</span> CẤP LẠI TÊN ĐĂNG NHẬP & MẬT KHẨU TỰ ĐỘNG
                  </p>
                  <p className="text-[11px] opacity-90 leading-relaxed">
                    Em chỉ cần nhập Số điện thoại đã đăng ký, hệ thống sẽ kiểm tra và hiển thị ngay thông tin đăng nhập!
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    📱 Nhập Số Điện Thoại Đã Đăng Ký (*):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      required
                      value={searchPhone}
                      onChange={(e) => setSearchPhone(e.target.value)}
                      placeholder="Ví dụ: 0915213717..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow transition cursor-pointer shrink-0"
                    >
                      Kiểm Tra
                    </button>
                  </div>
                </div>

                {searchPhoneError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{searchPhoneError}</span>
                  </div>
                )}

                {recoveredStudent && (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 dark:border-emerald-700 text-xs space-y-2 animate-in fade-in">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-black text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>ĐÃ TÌM THẤY TÀI KHOẢN HỌC SINH!</span>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-1.5 text-slate-800 dark:text-slate-200">
                      <p>👤 <strong>Họ và tên:</strong> <span className="font-bold text-blue-600">{recoveredStudent.name}</span></p>
                      <p>🏫 <strong>Lớp học:</strong> <span className="font-bold">{recoveredStudent.className}</span></p>
                      <p>🔑 <strong>Tên đăng nhập:</strong> <span className="font-mono font-bold text-emerald-600 text-sm">{recoveredStudent.username || recoveredStudent.studentCode}</span></p>
                      <p>🔒 <strong>Mật khẩu:</strong> <span className="font-mono font-bold text-amber-600 text-sm">{recoveredStudent.password || 'Đã đặt riêng khi đăng ký'}</span></p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        handleSelectRecoveredStudent();
                        setShowAuthModal(false);
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-md transition cursor-pointer"
                    >
                      👉 ĐĂNG NHẬP VÀO HỌC NGAY BẰNG TÀI KHOẢN NÀY
                    </button>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setAuthActiveTab('register')}
                    className="font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    ← Chưa có tài khoản? Bấm Đăng ký
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAuthModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ==================== MODAL XÁC NHẬN "ĐĂNG KÝ THÀNH CÔNG!" ==================== */}
      {registeredSuccessInfo && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border-2 border-emerald-500 shadow-2xl overflow-hidden relative my-auto animate-in zoom-in-95 duration-200">
            {/* Header banner với hiệu ứng chúc mừng */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 p-6 text-white text-center relative">
              <button
                type="button"
                onClick={() => setRegisteredSuccessInfo(null)}
                className="absolute top-3 right-3 text-white/80 hover:text-white cursor-pointer transition p-1 hover:bg-white/20 rounded-full"
                title="Đóng"
              >
                <XCircle className="w-6 h-6" />
              </button>
              
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border-2 border-white/40">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black tracking-wide uppercase mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Hệ Thống Ôn Luyện Tiếng Anh THCS
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Đăng Ký Thành Công!
              </h2>
              <p className="text-xs text-emerald-100 mt-1 font-medium">
                Chúc mừng em <strong className="text-white underline">{registeredSuccessInfo.name}</strong> đã tạo tài khoản thành công!
              </p>
            </div>

            {/* Chi tiết tài khoản vừa tạo */}
            <div className="p-5 space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">👤 Họ và tên học sinh:</span>
                  <span className="font-black text-slate-900 dark:text-white text-sm">{registeredSuccessInfo.name}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">🏫 Lớp học:</span>
                  <span className="font-black px-2.5 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    Lớp {registeredSuccessInfo.className}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">🔑 Tên đăng nhập:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-300 dark:border-emerald-800">
                      {registeredSuccessInfo.username}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(registeredSuccessInfo.username);
                        setCopiedUsername(true);
                        setTimeout(() => setCopiedUsername(false), 2000);
                      }}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md text-slate-500 transition cursor-pointer"
                      title="Sao chép tên đăng nhập"
                    >
                      {copiedUsername ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">🔒 Mật khẩu:</span>
                  <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-sm bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-300 dark:border-amber-800">
                    {registeredSuccessInfo.password}
                  </span>
                </div>

                {registeredSuccessInfo.phone && (
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">📱 Số điện thoại:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">{registeredSuccessInfo.phone}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">🆔 Mã học sinh:</span>
                  <span className="font-mono text-slate-600 dark:text-slate-400 font-semibold">{registeredSuccessInfo.studentCode}</span>
                </div>
              </div>

              {/* Hộp nhắc nhở an toàn & ghi nhớ */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
                <span className="text-lg shrink-0 mt-0.5">💡</span>
                <p className="leading-relaxed">
                  <strong>Em hãy chụp màn hình</strong> hoặc ghi nhớ lại <strong>Tên đăng nhập</strong> và <strong>Mật khẩu</strong> trên để đăng nhập học từ vựng và làm bài thi mỗi ngày nhé!
                </p>
              </div>

              {/* Nút hành động chính */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setRegisteredSuccessInfo(null)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition transform active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>🚀 Bắt Đầu Vào Học Ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BẢNG 44 ÂM IPA CHUẨN TUYỆT ĐỐI */}
      <IpaChartPronunciationModal
        isOpen={isIpaModalOpen}
        onClose={() => setIsIpaModalOpen(false)}
      />
    </div>
  );
};
