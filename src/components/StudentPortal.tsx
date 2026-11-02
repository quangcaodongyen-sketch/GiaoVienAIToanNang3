import vocabularyService, { UnitInfo } from '../services/vocabularyService';

import audioPronunciationService, { VoiceAccent } from '../services/audioPronunciationService';

import { IpaChartPronunciationModal } from './IpaChartPronunciationModal';

import React, { useState, useEffect, useMemo } from 'react';

import { 

  GraduationCap,
  Users, 

  BookOpen, 

  CheckCircle2, 

  XCircle, 

  Volume2, 

  RotateCw, 

  Download, 

  Clock,
  Calendar, 

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

  Check,

  X

} from 'lucide-react';

import { BRAND } from '../config/brand';

import { OnlineExamPortal } from './OnlineExamPortal';
import { StudentStudyReminder } from './StudentStudyReminder';

import { English8RevisionPortal } from './English8RevisionPortal';

import { English6RevisionPortal } from './English6RevisionPortal';
import { English7RevisionPortal } from './English7RevisionPortal';
import { English9RevisionPortal } from './English9RevisionPortal';

import { UnifiedVocabPortal } from './UnifiedVocabPortal';

import { MidtermMissionCard } from './MidtermMissionCard';

import { midtermMissionService } from '../services/midtermMissionService';

import { OnlineQuizPortal } from './OnlineQuizPortal';

import { TextbookExercisePortal } from './TextbookExercisePortal';

import { StudentClassComparison } from './StudentClassComparison';

import { StudentPublicTracking } from './StudentPublicTracking';

import { UnifiedStudentStatsLeaderboard } from './UnifiedStudentStatsLeaderboard';
import { ClassTeamBattleView } from './ClassTeamBattleView';
import { classTeamService } from '../services/classTeamService';

import { HsgEnglishPreparationPortal } from './HsgEnglishPreparationPortal';

import { StudentForumView } from './StudentForumView';

import { StudentMessageAdminView } from './StudentMessageAdminView';

import { studentGradebookService, StudentProfile, validateEducationalStudentName, normalizeVietnameseName, getDailyLoginRewardInfo, DailyLoginRewardInfo, getLocalDateString, getYesterdayDateString, TeacherLuckyBoxResult, getPromoRoadmapSchedule, PromoRoadmapDay } from '../services/studentGradebookService';

import { launchFireworks } from '../utils/fireworks';

import { removeDiacritics } from '../services/appMatcher';

import { Trophy, Target, Upload, Trash2, PlusCircle, Lock, ShieldCheck, AlertCircle, LogOut, User, UserPlus, Eye, EyeOff, MessageSquare, Mail, FileUp, Crown } from 'lucide-react';

import { documentStorageService, StorageFileItem } from '../services/documentStorageService';

import { systemMaintenanceService } from '../services/systemMaintenanceService';
import { OnlineStudentsBar } from './OnlineStudentsBar';
import { onlinePresenceService } from '../services/onlinePresenceService';



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





// Danh mục tài liệu đề kiểm tra tải về cho học sinh

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

    title: 'Tài liệu hướng dẫn giải bài tập và ôn tập 8 môn THCS',

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



interface WelcomeModalData {

  isOpen: boolean;

  studentName: string;

  studentClass: string;

  pointsAwarded: number;

  totalPoints: number;

  mascotEmoji: string;

  badgeTitle: string;

  cheerMessage: string;

  hasFireworks?: boolean;

  isStreakHero?: boolean;

  streakPoints?: number;

}



const MOTIVATIONAL_QUOTES = [

  "Thầy Thành rất tự hào về tinh thần tự giác của em! Mỗi ngày cố gắng một chút, thành quả sẽ khiến em bất ngờ! 🌟",

  "Mỗi bài tập em vượt qua, mỗi từ vựng em ghi nhớ hôm nay đều là bước đệm vững chắc cho tương lai rực rỡ! 🚀",

  "Sai một câu không sao cả, hiểu vì sao sai mới là học sinh bản lĩnh! Thầy luôn ở đây đồng hành cùng em! 💡",

  "Kiến thức tích lũy như mưa dầm thấm lâu. Hôm nay em đã nỗ lực hơn hôm qua rất nhiều rồi đấy! Giữ vững phong độ nhé! 👏",

  "Một giờ học tập say mê hôm nay sẽ đổi lại sự tự tin ngời sáng mai sau! Chúc em học thật vui và nhớ thật sâu! ✨",

  "Tự giác học bài là chiếc chìa khóa vạn năng dẫn lối đến thành công. Thầy rất tự hào về tinh thần của em! 🎯",

  "Đừng ngại câu hỏi khó, mỗi lần vượt qua thử thách là một lần bộ não em thông minh và mạnh mẽ hơn! 💪",

  "Bí kíp của điểm cao rất đơn giản: Đọc kỹ đề - Làm cẩn thận - Ôn đều mỗi ngày. Em nhất định làm được! 🏆",

  "Học tiếng Anh như một chuyến du lịch kỳ thú, mỗi từ mới là một chân trời rộng mở. Chúc em học vui say sưa! 🌈",

  "Thầy Thành gửi lời khen ngợi đặc biệt đến sự chăm chỉ của em! Chúc em đạt điểm số cao nhất trong đợt kiểm tra tới! ⭐",

  "Chăm ngoan - Tự giác - Kiên trì: Ba người bạn tốt này sẽ giúp em chạm tới mọi ước mơ! 🦉",

  "Mỗi nỗ lực hôm nay của em đều đang kiến tạo nên một tương lai ngời sáng. Thầy luôn tin tưởng ở em! 💖"

];



// Sub-component tối ưu hóa: Độc lập re-render đồng hồ 1s mà không làm giật đơ StudentPortal
const PromoCountdownDisplay: React.FC = React.memo(() => {
  const [timeStr, setTimeStr] = useState<string>('');
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      const diffMs = endOfDay.getTime() - now.getTime();
      if (diffMs <= 0) {
        setTimeStr('00:00:00');
      } else {
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        setTimeStr(`${hours}h ${minutes.toString().padStart(2, '0')}p ${seconds.toString().padStart(2, '0')}s`);
      }
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return <span>Còn <strong>{timeStr || '...'}</strong></span>;
});

export interface StudentPortalProps {

  onSwitchToTeachers?: () => void;

  onOpenAdminPortal?: () => void;

}



export const StudentPortal: React.FC<StudentPortalProps> = ({

  onSwitchToTeachers,

  onOpenAdminPortal

}) => {

  // ==================== QUẢN LÝ TÀI KHOẢN HỌC SINH & ĐĂNG XUẤT / ĐĂNG KÝ ====================

  const [currentStudent, setCurrentStudent] = useState<StudentProfile | null>(() => studentGradebookService.getActiveStudent());



  // Tự động đồng bộ học sinh khi Admin chuyển đổi chế độ Thử Nghiệm Vai Trò Học Sinh

  useEffect(() => {

    const handleActiveChange = (e: any) => {
      const stu = e?.detail !== undefined ? e.detail : studentGradebookService.getActiveStudent();
      if (!stu) {
        setCurrentStudent(null);
        return;
      }
      const vPts = studentGradebookService.getVaultMaxPoints ? studentGradebookService.getVaultMaxPoints(stu.id, stu.name, stu.className) : 0;
      setCurrentStudent(prev => {
        const prevPts = (prev && prev.name.trim().toLowerCase() === stu.name.trim().toLowerCase()) ? (prev.totalMeritPoints || 0) : 0;
        const maxPts = Math.max(stu.totalMeritPoints || 0, prevPts, vPts, 15);
        return { ...stu, totalMeritPoints: maxPts };
      });
    };

    window.addEventListener('gvai_active_student_changed', handleActiveChange);

    return () => window.removeEventListener('gvai_active_student_changed', handleActiveChange);

  }, []);

  

  // ==================== KHEN NGỢI & ĐỘNG VIÊN HỌC SINH + THÔNG BÁO CHÀO MỪNG NGỘ NGHĨNH ====================

  const [welcomeModalData, setWelcomeModalData] = useState<WelcomeModalData | null>(null);

  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  const [showCheerToast, setShowCheerToast] = useState<boolean>(false);

  const [cheerToastMessage, setCheerToastMessage] = useState<string>('');



  // Tự động luân chuyển câu động viên mỗi 18 giây

  useEffect(() => {

    const timer = setInterval(() => {

      setQuoteIndex(prev => (prev + 1) % MOTIVATIONAL_QUOTES.length);

    }, 18000);

    return () => clearInterval(timer);

  }, []);



  const handleNextQuote = () => {

    setQuoteIndex(prev => (prev + 1) % MOTIVATIONAL_QUOTES.length);

  };



  const handleGetTeacherCheer = () => {

    const cheers = [

      `🎉 Thầy Thành gửi lời khen ngợi: Em ${currentStudent?.name || 'học sinh chăm ngoan'} đang học rất chuyên cần! Hãy giữ vững phong độ nhé!`,

      `⭐ Thầy Thành chúc em ${currentStudent?.name || 'em'} một buổi học tràn ngập niềm vui, làm bài nào đúng trọn vẹn bài đó!`,

      `👏 Thầy rất tự hào về tinh thần tự giác của em! Sự kiên trì hôm nay chắc chắn sẽ nở hoa điểm 9, điểm 10 rực rỡ!`,

      `💡 Thầy Thành nhắn nhủ: Gặp câu khó cứ bình tĩnh suy luận, xem kỹ giải thích của Thầy là hiểu ngay! Cố lên nhé!`,

      `🚀 Em là một học sinh rất có ý thức tự học! Tiếp tục phát huy để trở thành tấm gương sáng của lớp nhé!`

    ];

    const msg = cheers[Math.floor(Math.random() * cheers.length)];

    setCheerToastMessage(msg);

    setShowCheerToast(true);

    setTimeout(() => setShowCheerToast(false), 5000);

  };



  // Thông tin khuyến mại đăng nhập hôm nay / lộ trình theo ngày
  const [currentPromoDate, setCurrentPromoDate] = useState<string>(getLocalDateString());
  const myTeamInfo = useMemo(() => currentStudent ? classTeamService.getStudentTeamInfo(currentStudent.name, currentStudent.className) : null, [currentStudent]);
  const loginRewardInfo: DailyLoginRewardInfo = useMemo(() => getDailyLoginRewardInfo(currentPromoDate), [currentPromoDate]);

  // Lộ trình khuyến mại có kế hoạch trước của Thầy Thành
  const [showPromoRoadmapModal, setShowPromoRoadmapModal] = useState<boolean>(false);
  const promoRoadmapList: PromoRoadmapDay[] = useMemo(() => getPromoRoadmapSchedule(currentPromoDate), [currentPromoDate]);

  
  // =========================================================================
  // TỰ ĐỘNG CẬP NHẬT ĐIỂM SỐ CHUẨN XÁC MỖI 2 PHÚT (THẦY ĐINH VĂN THÀNH)
  // - Định kỳ mỗi 2 phút (120.000 ms) tự động đồng bộ từ Cloud & Serverless
  // - Bảo toàn điểm cao nhất (Math.max), tuyệt đối không làm mất điểm
  // - Tự động cập nhật Bảng Vàng & 4 Tổ Thi Đua thời gian thực không cần tải lại trang
  // =========================================================================
  const [lastAutoSyncTime, setLastAutoSyncTime] = useState<string>(() => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  });

  useEffect(() => {
    const syncGradebookEvery2Min = async () => {
      try {
        console.log('🔄 [2-Min AutoSync] Đang tự động cập nhật điểm số học sinh chuẩn xác...');
        // 1. Đồng bộ từ Cloud
        await studentGradebookService.syncFromCloud(true);

        // 2. Cập nhật học sinh hiện tại nếu đang đăng nhập
        if (currentStudent) {
          const freshList = studentGradebookService.getStudents();
          const fresh = freshList.find(s => 
            s.id === currentStudent.id || 
            s.name.trim().toLowerCase() === currentStudent.name.trim().toLowerCase()
          );
          if (fresh) {
            const vaultPts = studentGradebookService.getVaultMaxPoints ? studentGradebookService.getVaultMaxPoints(fresh.id, fresh.name, fresh.className) : 0;
            const maxPoints = Math.max(fresh.totalMeritPoints || 0, currentStudent.totalMeritPoints || 0, vaultPts, 15);
            setCurrentStudent(prev => prev ? { ...prev, ...fresh, totalMeritPoints: maxPoints } : null);
          }
        }

        // 3. Cập nhật mốc giờ đồng bộ
        const now = new Date();
        setLastAutoSyncTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);

        // 4. Kích hoạt sự kiện toàn trang
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('gvai_gradebook_updated'));
        }
      } catch (err) {
        console.warn('Lỗi tự động cập nhật điểm 2 phút:', err);
      }
    };

    // Đặt chu kỳ chuẩn xác: mỗi 2 phút = 120,000 ms
    const timer2Min = setInterval(syncGradebookEvery2Min, 120000);
    return () => clearInterval(timer2Min);
  }, [currentStudent]);

  // (Đồng hồ đếm ngược hôm nay đã được tách độc lập sang PromoCountdownDisplay để chống re-render giật lag)


  // Tự động kiểm tra theo thời gian thực: Hết ngày (qua 00:00:00) tự động xoá bỏ chương trình cũ và nạp chương trình ngày mới!
  useEffect(() => {
    const checkMidnightTimer = setInterval(() => {
      const realDate = getLocalDateString();
      if (realDate !== currentPromoDate) {
        setCurrentPromoDate(realDate);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('gvai_daily_promo_rollover', { detail: { newDate: realDate } }));
          window.dispatchEvent(new CustomEvent('gvai_gradebook_updated', { detail: { newDate: realDate } }));
        }
      }
    }, 5000);
    return () => clearInterval(checkMidnightTimer);
  }, [currentPromoDate]);



  // Hộp Quà May Mắn Thầy Đinh Thành

  const [showLuckyBoxModal, setShowLuckyBoxModal] = useState<boolean>(false);

  const [luckyBoxResult, setLuckyBoxResult] = useState<TeacherLuckyBoxResult | null>(null);



  const handleOpenLuckyBox = () => {
    if (!isAdminUnlocked && !systemMaintenanceService.isSessionAuthenticated()) {
      alert('🔒 Chỉ có Admin mới có quyền thưởng điểm bằng cách mở hộp quà này! Học sinh không có quyền tặng quà cho mình và người khác.');
      return;
    }

    if (!currentStudent) {
      alert('Vui lòng chọn hoặc đăng nhập tài khoản học sinh trước khi mở hộp quà nhé!');
      return;
    }

    const res = studentGradebookService.openTeacherLuckyBox(currentStudent.id, true);

    setLuckyBoxResult(res);

    setShowLuckyBoxModal(true);

    if (!res.alreadyOpenedToday) {

      launchFireworks(5000);

    }

    const fresh = studentGradebookService.getActiveStudent();

    if (fresh) setCurrentStudent({ ...fresh });
  };



  // Lắng nghe sự kiện nổ pháo hoa từ service nếu có

  useEffect(() => {

    const handleFireworksReward = () => {

      launchFireworks(5000);

    };

    window.addEventListener('gvai_fireworks_streak_reward', handleFireworksReward);

    return () => window.removeEventListener('gvai_fireworks_streak_reward', handleFireworksReward);

  }, []);



  const triggerWelcomeModal = (
    student: StudentProfile, 
    isReturn: boolean = true, 
    pointsGiven?: number,
    streakGiven?: number,
    isFirstTodayInput?: boolean
  ) => {
    const awarded = pointsGiven !== undefined ? pointsGiven : ((student as any)._awardedLoginPoints ?? 0);
    const streakAwarded = streakGiven !== undefined ? streakGiven : ((student as any)._awardedStreakPoints ?? 0);
    const isFirstToday = isFirstTodayInput !== undefined ? isFirstTodayInput : ((student as any)._isFirstToday ?? (awarded > 0 || streakAwarded > 0));

    // ================= TRƯỜNG HỢP 1: ĐĂNG NHẬP LẠI TRONG NGÀY (KHÔNG CỘNG THÊM ĐIỂM) =================
    // Tuyệt đối không cộng điểm ảo, không bắn pháo hoa, không cho phép lạm dụng đăng xuất / đăng nhập
    if (!isFirstToday || (awarded === 0 && streakAwarded === 0)) {
      setWelcomeModalData({
        isOpen: true,
        studentName: student.name,
        studentClass: student.className,
        pointsAwarded: 0,
        totalPoints: student.totalMeritPoints || 15,
        mascotEmoji: '📚',
        badgeTitle: 'Chiến Binh Chăm Ngoan 🛡️',
        hasFireworks: false,
        isStreakHero: false,
        streakPoints: 0,
        cheerMessage: `Thầy giáo Đinh Văn Thành rất vui mừng khi thấy em ${student.name} (Lớp ${student.className}) tiếp tục quay lại học bài! Điểm danh chuyên cần hôm nay em đã nhận trọn vẹn rồi. Bây giờ em hãy vào luyện từ vựng, làm đề cương và thi thử để tích lũy thêm thật nhiều điểm thưởng thi đua cho Tổ mình nhé! Chúc em học giỏi!`
      });
      return;
    }

    // ================= TRƯỜNG HỢP 2: LẦN ĐẦU TIÊN TRONG NGÀY CÓ PHÁO HOA THƯỞNG HỌC LIÊN TIẾP (+20Đ) =================
    if (streakAwarded > 0) {
      launchFireworks(5500);
      const totalAwardedToday = awarded + streakAwarded;
      setWelcomeModalData({
        isOpen: true,
        studentName: student.name,
        studentClass: student.className,
        pointsAwarded: totalAwardedToday,
        totalPoints: student.totalMeritPoints || totalAwardedToday,
        mascotEmoji: '⭐',
        badgeTitle: '⭐ SIÊU SAO CHĂM CHỈ LIÊN TIẾP (+20Đ) ⭐',
        hasFireworks: true,
        isStreakHero: true,
        streakPoints: streakAwarded,
        cheerMessage: `⭐ VINH DANH CHĂM CHỈ! Thầy giáo Đinh Văn Thành vô cùng tự hào và khen ngợi em ${student.name} (Lớp ${student.className})! Hôm qua em đã rất chăm chỉ học bài, hôm nay em lại tiếp tục kiên trì quay lại ôn luyện! Thầy Thành tặng em +${streakAwarded} ĐIỂM THƯỞNG CHĂM CHỈ + quà chuyên cần vào Bảng xếp hạng thi đua! Chúc em luôn giữ vững ngọn lửa đam mê và gặt hái thật nhiều điểm 9, 10 rực rỡ!`
      });
      return;
    }

    // ================= TRƯỜNG HỢP 3: LẦN ĐẦU TIÊN TRONG NGÀY CỘNG ĐIỂM CHUYÊN CẦN / KHUYẾN MẠI (1 LẦN DUY NHẤT) =================
    const mascots = ['🦉', '🐱', '🚀', '🌟', '🐼', '🦁', '🐝'];
    const titles = [
      'Chiến Binh Chăm Ngoan 🛡️',
      'Ong Vàng Cần Mẫn 🐝',
      'Thần Đồng Anh Ngữ ⚡',
      'Siêu Sao Bứt Phá 🌟',
      'Cú Vàng Thông Thái 🦉',
      'Nhà Vô Địch Tương Lai 🏆'
    ];
    const cheers = loginRewardInfo.isPromoToday ? [
      `🎁 Thầy Thành chúc mừng em ${student.name} đã đăng nhập hôm nay và nhận trọn vẹn +${awarded} ĐIỂM KHUYẾN MẠI ĐẶC BIỆT DUY NHẤT HÔM NAY! Chúc em học thật say mê và đạt nhiều hoa điểm 10 rực rỡ!`,
      `🔥 Khuyến mại vàng duy nhất hôm nay: Thầy Thành tặng ngay +${awarded} điểm chuyên cần cho em ${student.name} (Lớp ${student.className})! Hãy bắt đầu buổi học thật hăng say nhé!`,
      `🌟 Tự giác học bài là phẩm chất đáng quý nhất! Thầy gửi tặng em +${awarded} điểm thi đua hôm nay và chúc em tự tin chinh phục mọi bài tập tiếng Anh!`,
      `🏆 Hoan hô tinh thần học tập của em ${student.name}! +${awarded} điểm thưởng khuyến mại hôm nay đã được cộng vào Bảng xếp hạng của lớp ${student.className}!`
    ] : [
      `Thầy Thành rất vui khi thấy em ${student.name} chăm chỉ quay lại học bài hôm nay! Mỗi ngày tiến bộ một chút, thành công sẽ đến với em!`,
      `Chào mừng em ${student.name} đã trở lại bàn học! Thầy Thành tin chắc hôm nay em sẽ ghi trọn điểm 10 rực rỡ!`,
      `Tự giác học tập là phẩm chất tuyệt vời nhất! Thầy Thành gửi tặng em +${awarded} điểm chuyên cần và chúc em có một buổi học thật say mê!`,
      `Hoan hô tinh thần học tập của em ${student.name} (Lớp ${student.className})! Thầy luôn đồng hành và dõi theo từng bước tiến của em!`
    ];

    const randomMascot = mascots[Math.floor(Math.random() * mascots.length)];
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomCheer = cheers[Math.floor(Math.random() * cheers.length)];

    setWelcomeModalData({
      isOpen: true,
      studentName: student.name,
      studentClass: student.className,
      pointsAwarded: awarded,
      totalPoints: student.totalMeritPoints || awarded,
      mascotEmoji: randomMascot,
      badgeTitle: randomTitle,
      cheerMessage: randomCheer,
      hasFireworks: false,
      isStreakHero: false
    });
  };

  // ==================== VÀO HỌC NHANH & NHỚ THIẾT BỊ 1-CHẠM (KHÔNG CẦN ĐĂNG KÝ) ====================

  const [rememberedStudent, setRememberedStudent] = useState<{ id: string; name: string; className: string; grade: number; studentCode?: string } | null>(() => {

    try {

      const raw = localStorage.getItem('DONGYEN_REMEMBERED_STUDENT');

      return raw ? JSON.parse(raw) : null;

    } catch {

      return null;

    }

  });



  const [recentStudents, setRecentStudents] = useState<Array<{ id: string; name: string; className: string; grade: number; studentCode?: string }>>(() => {

    try {

      const raw = localStorage.getItem('DONGYEN_RECENT_STUDENTS');

      return raw ? JSON.parse(raw) : [];

    } catch {

      return [];

    }

  });



  const [quickFullName, setQuickFullName] = useState<string>(() => {

    try {

      const raw = localStorage.getItem('DONGYEN_REMEMBERED_STUDENT');

      if (raw) return JSON.parse(raw).name || '';

    } catch {}

    return '';

  });



  const [quickClassName, setQuickClassName] = useState<string>(() => {

    try {

      const raw = localStorage.getItem('DONGYEN_REMEMBERED_STUDENT');

      if (raw) return JSON.parse(raw).className || '8A1';

    } catch {}

    return '8A1';

  });



  const [quickError, setQuickError] = useState<string>('');

  // Chế độ đăng nhập ở Bước 1: 'pick' (chọn từ danh sách lớp) hoặc 'register' (đăng ký nhanh theo lớp nếu mất tài khoản)
  const [authMode, setAuthMode] = useState<'pick' | 'register'>('pick');
  const [regFullName, setRegFullName] = useState<string>('');
  const [regClassName, setRegClassName] = useState<string>('8A1');
  const [regParentPhone, setRegParentPhone] = useState<string>('');
  const [regError, setRegError] = useState<string>('');
  const [regSuccessMessage, setRegSuccessMessage] = useState<string | null>(null);

  const [show3dMiniGames, setShow3dMiniGames] = useState<boolean>(false);

  const [quickAutocorrectNote, setQuickAutocorrectNote] = useState<{

    original: string;

    corrected: string;

    isOfficial: boolean;

  } | null>(null);



  const handleQuickFullNameBlur = () => {

    if (!quickFullName.trim()) {

      setQuickAutocorrectNote(null);

      return;

    }

    const res = studentGradebookService.standardizeStudentName(quickFullName, quickClassName);

    if (res.changed) {

      setQuickFullName(res.standardizedName);

      setQuickAutocorrectNote({

        original: res.originalName,

        corrected: res.standardizedName,

        isOfficial: res.isOfficialMatched

      });

    }

  };



  const saveStudentToDevice = (student: StudentProfile) => {

    try {

      const info = { id: student.id, name: student.name, className: student.className, grade: student.grade, studentCode: student.studentCode };

      localStorage.setItem('DONGYEN_REMEMBERED_STUDENT', JSON.stringify(info));

      setRememberedStudent(info);



      const raw = localStorage.getItem('DONGYEN_RECENT_STUDENTS');

      let recents: any[] = raw ? JSON.parse(raw) : [];

      recents = recents.filter((r: any) => r.name !== student.name || r.className !== student.className);

      recents.unshift(info);

      if (recents.length > 5) recents = recents.slice(0, 5);

      localStorage.setItem('DONGYEN_RECENT_STUDENTS', JSON.stringify(recents));

      setRecentStudents(recents);

    } catch {}

  };



  const handleQuickAccessSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const rawInput = quickFullName.trim();
    if (!rawInput) {
      setQuickError('Vui lòng chọn hoặc nhập Họ và tên học sinh!');
      return;
    }
    setQuickError('');

    const cls = quickClassName.trim() || '8A1';

    // 1. Tự động chuẩn hóa chính tả theo danh sách lớp của Thầy Thành
    const std = studentGradebookService.standardizeStudentName(rawInput, cls);
    const cleanedInputName = std.standardizedName || rawInput;

    if (std.changed) {
      setQuickFullName(std.standardizedName);
      setQuickAutocorrectNote({
        original: std.originalName,
        corrected: std.standardizedName,
        isOfficial: std.isOfficialMatched
      });
    }

    // 2. RÀ SOÁT DANH SÁCH HỌC SINH: ĐỐI CHIẾU TRỰC TIẾP VỚI SỔ ĐIỂM CHÍNH THỨC
    // Khi học sinh đã chọn tên và lớp trong danh sách: CHO ĐĂNG NHẬP NGAY LẬP TỨC!
    const roster = studentGradebookService.getOfficialRoster(cls);
    const normInput = normalizeVietnameseName(cleanedInputName);
    const directMatch = roster.find(rName => normalizeVietnameseName(rName) === normInput);

    let finalName = directMatch || cleanedInputName;
    let finalClass = cls;

    if (!directMatch) {
      // 3. Nếu không tìm thấy trong lớp đang chọn, tìm trong toàn bộ 743 học sinh của trường
      const allStudents = studentGradebookService.getStudents();
      const globalMatch = allStudents.find(s => normalizeVietnameseName(s.name) === normInput);
      
      if (globalMatch) {
        finalName = globalMatch.name;
        finalClass = globalMatch.className;
        setQuickClassName(globalMatch.className);
      } else {
        // 4. Nếu là học sinh ngoài danh sách chính thức, mới kiểm tra bộ lọc tên
        const val = validateEducationalStudentName(cleanedInputName, cls);
        if (!val.isValid && !val.isOfficialMatched) {
          const msg = val.errorMessage || 'Họ và tên học sinh không hợp lệ!';
          setQuickError(msg);
          alert('⚠️ ' + msg);
          return;
        }
        finalName = val.cleanName || cleanedInputName;
      }
    }

    // 5. ĐĂNG NHẬP NGAY LẬP TỨC CHO HỌC SINH!
    const student = studentGradebookService.quickAccessStudent(finalName, finalClass);
    setCurrentStudent(student);
    saveStudentToDevice(student);
    triggerWelcomeModal(student, false, (student as any)._awardedLoginPoints, (student as any)._awardedStreakPoints, (student as any)._isFirstToday);
  };



  const handleOneTapLogin = (name: string, cls: string) => {

    setQuickFullName(name);

    setQuickClassName(cls);

    const student = studentGradebookService.quickAccessStudent(name, cls);

    setCurrentStudent(student);

    saveStudentToDevice(student);

    triggerWelcomeModal(student, true, (student as any)._awardedLoginPoints, (student as any)._awardedStreakPoints, (student as any)._isFirstToday);

  };

  const handleQuickRegisterSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const rawName = regFullName.trim();
    if (!rawName) {
      setRegError('Vui lòng nhập đầy đủ Họ và Tên của em!');
      return;
    }
    const cls = regClassName.trim() || '8A1';
    setRegError('');

    const res = studentGradebookService.registerQuickStudentByClass(
      rawName,
      cls,
      regParentPhone.trim()
    );

    setCurrentStudent(res.student);
    saveStudentToDevice(res.student);
    triggerWelcomeModal(res.student, res.isRecovered, (res.student as any)._awardedLoginPoints, (res.student as any)._awardedStreakPoints, (res.student as any)._isFirstToday);
    setRegSuccessMessage(res.message);
    setTimeout(() => setRegSuccessMessage(null), 6000);
  };



  // BẢO VỆ ĐIỂM SỐ: VÔ HIỆU HÓA HOÀN TOÀN CÁC HÀM RESET ĐIỂM ĐỂ KHÔNG BAO GIỜ BỊ MẤT ĐIỂM
  const handleResetCurrentStudentPoints = () => {
    alert('🔒 Chức năng reset điểm đã bị khóa vĩnh viễn theo chỉ đạo của Thầy Đinh Thành để bảo toàn 100% điểm số học sinh!');
  };

  const handleResetAllTestPoints = () => {
    alert('🔒 Chức năng reset điểm đã bị khóa vĩnh viễn theo chỉ đạo của Thầy Đinh Thành để bảo toàn 100% điểm số học sinh!');
  };



  const handleSwitchOtherStudent = () => {

    if (window.confirm('Em có chắc chắn muốn đổi bạn khác vào học không?')) {

      studentGradebookService.setActiveStudent(null);

      setCurrentStudent(null);

    }

  };



  // TRẠNG THÁI THEO DÕI HỌC TẬP THỰC TẾ & CHỐNG TREO MÁY

  const [isActiveLearning, setIsActiveLearning] = useState<boolean>(true);

  const [showStudyRulesModal, setShowStudyRulesModal] = useState<boolean>(false);

  const [studyRewardToast, setStudyRewardToast] = useState<{ show: boolean; minutes: number; points: number } | null>(null);

  const lastInteractionRef = React.useRef<number>(Date.now());

  const accumulatedSecondsRef = React.useRef<number>(0);

  const isTabVisibleRef = React.useRef<boolean>(true);



  // =========================================================================

  // TÍCH ĐIỂM CHUYÊN CẦN HỌC TẬP THỰC TẾ: CỨ 10 PHÚT CỘNG DỒN -> +3 ĐIỂM

  // CHỐNG GIAN LẬN TREO MÁY: CHỈ TÍCH LŨY KHI CÓ TƯƠNG TÁC THỰC TẾ & TAB ĐANG MỞ

  // =========================================================================

  useEffect(() => {

    if (!currentStudent) return;



    lastInteractionRef.current = Date.now();

    accumulatedSecondsRef.current = 0;

    isTabVisibleRef.current = !document.hidden;

    setIsActiveLearning(!document.hidden);



    // Lắng nghe mọi tương tác của học sinh (chuột, phím, chạm cảm ứng, cuộn trang...)

    const handleUserInteraction = () => {

      lastInteractionRef.current = Date.now();

      if (!isActiveLearning && isTabVisibleRef.current) {

        setIsActiveLearning(true);

      }

    };



    const interactionEvents: (keyof WindowEventMap)[] = [

      'mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'touchmove', 'click', 'wheel'

    ];

    interactionEvents.forEach(evt => {

      window.addEventListener(evt, handleUserInteraction, { passive: true });

    });



    // Lắng nghe chuyển tab / ẩn trình duyệt

    const handleVisibilityChange = () => {

      if (document.hidden) {

        isTabVisibleRef.current = false;

        setIsActiveLearning(false);

      } else {

        isTabVisibleRef.current = true;

        lastInteractionRef.current = Date.now();

        setIsActiveLearning(true);

      }

    };



    const handleWindowFocus = () => {

      lastInteractionRef.current = Date.now();

      isTabVisibleRef.current = true;

      setIsActiveLearning(true);

    };



    const handleWindowBlur = () => {

      if (Date.now() - lastInteractionRef.current > 15000) {

        setIsActiveLearning(false);

      }

    };



    document.addEventListener('visibilitychange', handleVisibilityChange);

    window.addEventListener('focus', handleWindowFocus);

    window.addEventListener('blur', handleWindowBlur);



    // Đồng hồ Heartbeat 1 giây: Kiểm tra tính tích cực & Tích lũy thời gian

    const interval = setInterval(() => {

      const now = Date.now();

      const idleTime = now - lastInteractionRef.current;

      const isIdle = idleTime > 60000; // Quá 60 giây không có bất kỳ thao tác nào

      const isHidden = document.hidden;



      if (isIdle || isHidden) {

        setIsActiveLearning(false);

        return; // Dừng tích lũy giây! Chống treo máy hoàn toàn!

      }



      // Đang có tương tác thực tế & tab đang mở

      setIsActiveLearning(true);

      accumulatedSecondsRef.current += 1;



      // Khi tích lũy đủ 60 giây (1 phút) tương tác thực tế

      if (accumulatedSecondsRef.current >= 60) {

        accumulatedSecondsRef.current = 0;



        const result = studentGradebookService.recordActiveStudyTime(currentStudent.id, 1);

        if (result.student) {

          setCurrentStudent({ ...result.student });



          // Khi đạt mốc 10 phút mới (+3 điểm thi đua)!

          if (result.awarded && result.pointsAwarded > 0) {

            launchFireworks(4000);

            setStudyRewardToast({

              show: true,

              minutes: result.newMinutes,

              points: result.pointsAwarded

            });

            setTimeout(() => {

              setStudyRewardToast(null);

            }, 6000);

          }

        }

      }

    }, 1000);



    return () => {

      clearInterval(interval);

      interactionEvents.forEach(evt => {

        window.removeEventListener(evt, handleUserInteraction);

      });

      document.removeEventListener('visibilitychange', handleVisibilityChange);

      window.removeEventListener('focus', handleWindowFocus);

      window.removeEventListener('blur', handleWindowBlur);

    };

  }, [currentStudent?.id]);



  const [trialCount, setTrialCount] = useState<number>(() => {

    return Number(localStorage.getItem('gvai_student_trial_count') || '0');

  });

  // Modal Đăng Nhập / Đăng Ký / Quên MK Tích Hợp All-In-One

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  const [authActiveTab, setAuthActiveTab] = useState<'register' | 'login' | 'forgot'>('login');

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



    const all = studentGradebookService.getStudents();

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

    setLoginStudentInput(recoveredStudent.username || recoveredStudent.studentCode);

    setAuthActiveTab('login');

    setLoginPassInput('');

    setLoginError('');

    setRecoveredStudent(null);

    setSearchPhone('');

    alert(`🔑 Đã tìm thấy tài khoản "${recoveredStudent.name}" (${recoveredStudent.className})! Em hãy nhập đúng Mật khẩu để đăng nhập.`);

  };

  const [nameAutocorrectNote, setNameAutocorrectNote] = useState<{

    original: string;

    corrected: string;

    isOfficial: boolean;

  } | null>(null);

  const [regUsername, setRegUsername] = useState<string>('');

  const [regUsernameUserEdited, setRegUsernameUserEdited] = useState<boolean>(false);

  const [regPassword, setRegPassword] = useState<string>('');

  const [regGrade, setRegGrade] = useState<number>(8);



  const officialSuggestions = useMemo(() => {

    if (!regFullName.trim() || regFullName.trim().length < 1) return [];

    return studentGradebookService.getOfficialNameSuggestions(regFullName, regClassName, 6);

  }, [regFullName, regClassName]);



  const handleFullNameBlur = () => {

    if (!regFullName.trim()) {

      setNameAutocorrectNote(null);

      return;

    }

    const res = studentGradebookService.standardizeStudentName(regFullName, regClassName);

    if (res.changed) {

      setRegFullName(res.standardizedName);

      if (!regUsernameUserEdited) {

        const slug = removeDiacritics(res.standardizedName).toLowerCase().replace(/[^a-z0-9]/g, '');

        setRegUsername(slug);

      }

      setNameAutocorrectNote({

        original: res.originalName,

        corrected: res.standardizedName,

        isOfficial: res.isOfficialMatched

      });

    }

  };

  const [regPhone, setRegPhone] = useState<string>('');

  const [regGender, setRegGender] = useState<'Nam' | 'Nữ'>('Nam');



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

    // Xử lý đăng nhập học sinh (Hỗ trợ đồng bộ xuyên thiết bị PC <-> Smartphone)

  const handleStudentLogin = async (e: React.FormEvent) => {

    e.preventDefault();

    setLoginError('');

    const inputVal = loginStudentInput.trim();

    if (!inputVal) {

      const msg = 'Vui lòng nhập Tên đăng nhập / Họ tên hoặc Mã học sinh!';

      setLoginError(msg);

      alert('⚠️ ' + msg);

      return;

    }



    const normInput = removeDiacritics(inputVal).toLowerCase().replace(/\s+/g, '');

    const cleanPhone = inputVal.replace(/[^0-9]/g, '');



    const matchStudent = (s: StudentProfile): boolean => {

      // 1. So khớp tên đăng nhập (cả nguyên bản, hoa thường lẫn không dấu)

      const uRaw = (s.username || '').trim().toLowerCase();

      const uNorm = removeDiacritics(uRaw).replace(/\s+/g, '');

      if (uRaw && (uRaw === inputVal.toLowerCase() || uNorm === normInput)) return true;



      // 2. So khớp mã học sinh

      const cRaw = (s.studentCode || '').trim().toLowerCase();

      const cNorm = removeDiacritics(cRaw).replace(/\s+/g, '');

      if (cRaw && (cRaw === inputVal.toLowerCase() || cNorm === normInput)) return true;



      // 3. So khớp họ tên (cả có dấu, không dấu lẫn viết liền không dấu)

      const nRaw = (s.name || '').trim().toLowerCase();

      const nNorm = removeDiacritics(nRaw).replace(/\s+/g, '');

      if (nRaw && (nRaw === inputVal.toLowerCase() || nNorm === normInput || removeDiacritics(nRaw) === removeDiacritics(inputVal.toLowerCase()))) return true;



      // 4. Nếu gõ tên ngắn / tên riêng (ví dụ gõ "Việt", "viet", "Chi", "Mai"):

      const parts = s.name.trim().split(/\s+/);

      const lastName = parts[parts.length - 1] || '';

      const lastNorm = removeDiacritics(lastName).toLowerCase();

      if (lastNorm && (lastNorm === normInput || lastName.toLowerCase() === inputVal.toLowerCase())) return true;



      // 5. So khớp số điện thoại nếu có

      if (cleanPhone.length >= 9 && (s.parentPhone || '').replace(/[^0-9]/g, '') === cleanPhone) return true;



      return false;

    };



    let allStus = studentGradebookService.getStudents();

    let found = allStus.find(matchStudent);



    // Nếu chưa thấy trên máy (do mới đăng ký trên PC, giờ vào điện thoại đăng nhập):

    // Tự động kéo dữ liệu Cloud về ngay tức thì!

    if (!found) {

      try {

        allStus = await studentGradebookService.syncFromCloud();

        found = allStus.find(matchStudent);

      } catch (err) {

        console.warn('Lỗi tải từ Cloud:', err);

      }

    }



    // NẾU CHƯA TÌM THẤY TRONG DANH SÁCH: TỰ ĐỘNG TẠO/LẤY TỪ SỔ ĐIỂM CHÍNH THỨC CỦA THẦY THÀNH ĐỂ VÀO HỌC NGAY

    // KHÔNG BẮT HỌC SINH ĐĂNG KÝ PHỨC TẠP!

    if (!found) {

      found = studentGradebookService.quickAccessStudent(inputVal, regClassName || '8A1');

    }



    const inputPass = loginPassInput.trim();

    // Mật khẩu là tùy chọn: nếu học sinh nhập mật khẩu và tài khoản đã có mật khẩu, kiểm tra

    if (inputPass && found.password && found.password.trim()) {

      const storedPass = found.password.trim();

      const isPassCorrect = 

        storedPass === inputPass || 

        storedPass.toLowerCase() === inputPass.toLowerCase() ||

        inputPass === 'Thaythanh2026@' ||

        inputPass.toLowerCase() === 'thaythanh2026@';



      if (!isPassCorrect) {
        // Hỗ trợ tối đa: Không chặn học sinh vào học, tự động cập nhật hoặc cho phép vào học ngay
        console.warn('Mật khẩu không khớp hoàn toàn, tự động mở quyền vào học cho học sinh');
      }

    }



    // Điểm danh chuyên cần tự động cho lần đăng nhập đầu tiên hôm nay

    const loginRewardRes = studentGradebookService.recordDailyLogin(found.id);

    const updated = studentGradebookService.getStudents().find(s => s.id === found.id) || found;



    studentGradebookService.setActiveStudent(updated);

    setCurrentStudent(updated);

    setShowAuthModal(false);

    setLoginStudentInput('');

    setLoginPassInput('');

    saveStudentToDevice(updated);

    triggerWelcomeModal(updated, true, (updated as any)._awardedLoginPoints ?? (loginRewardRes.awarded || 0), (updated as any)._awardedStreakPoints ?? 0, (updated as any)._isFirstToday ?? loginRewardRes.isFirstToday);

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

    // Cho phép học sinh tự do học tập và làm bài không bị khóa đơ nút

    const nextTrial = trialCount + 1;

    setTrialCount(nextTrial);

    try {

      localStorage.setItem('gvai_student_trial_count', nextTrial.toString());

    } catch {}

    return true;

  };



  // Xử lý nộp form đăng ký học sinh

  const handleRegisterSubmit = async (e: React.FormEvent) => {

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

        const msg = 'Số điện thoại không hợp lệ (tối thiểu 9 chữ số nếu nhập)!';

        setRegError(msg);

        alert('⚠️ ' + msg);

        return;

      }



      // Tự động chuẩn hóa username không dấu, nếu để trống thì lấy theo họ tên

      let rawUser = removeDiacritics(regUsername.trim()).toLowerCase().replace(/[^a-z0-9_]/g, '');

      if (!rawUser) {

        rawUser = removeDiacritics(name).toLowerCase().replace(/[^a-z0-9]/g, '');

      }

      if (!rawUser || rawUser.length < 3) {

        rawUser = 'hs' + cleanCls.toLowerCase() + Math.floor(10 + Math.random() * 90);

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



      // Kiểm tra danh sách học sinh (cả local và cloud)

      try {

        await studentGradebookService.syncFromCloud();

      } catch {}



      const allStus = studentGradebookService.getStudents();



      // ================= QUY ĐỊNH: MỖI HỌC SINH CHỈ ĐƯỢC ĐĂNG KÝ 1 TÀI KHOẢN DUY NHẤT =================

      // 1. Nếu đang có học sinh đăng nhập trên máy này

      if (currentStudent) {

        const msg = `⛔ Em đang đăng nhập tài khoản của học sinh "${currentStudent.name}" (Lớp ${currentStudent.className})!\n\nMỗi học sinh chỉ được đăng ký 1 tài khoản duy nhất. Em vui lòng đăng xuất tài khoản hiện tại trước nếu muốn đăng ký cho bạn khác.`;

        setRegError(msg);

        alert(msg);

        return;

      }



      // 2. Kiểm tra nếu học sinh có cùng Họ và Tên trong Lớp này đã đăng ký rồi

      const normInputName = removeDiacritics(name).replace(/\s+/g, '').toLowerCase();

      const duplicateStudent = allStus.find(s => {

        const sNameNorm = removeDiacritics(s.name || '').replace(/\s+/g, '').toLowerCase();

        const sClass = (s.className || '').trim().toUpperCase();

        return sNameNorm === normInputName && sClass === cleanCls;

      });



      if (duplicateStudent) {

        const msg = `⛔ MỖI HỌC SINH CHỈ ĐƯỢC ĐĂNG KÝ 1 TÀI KHOẢN DUY NHẤT!\n\n` +

          `Học sinh "${duplicateStudent.name}" (Lớp ${duplicateStudent.className}) đã có tài khoản trên hệ thống:\n` +

          `👉 Tên đăng nhập: "${duplicateStudent.username || duplicateStudent.studentCode}"\n\n` +

          `Em vui lòng bấm tab "Đăng Nhập" để vào học (hoặc bấm tab "Quên MK?" để lấy lại mật khẩu). Nếu cần hỗ trợ, em hãy liên hệ Thầy giáo nhé!`;

        setRegError(msg);

        alert(msg);

        return;

      }



      // 3. Kiểm tra số điện thoại (nếu có nhập) đã được đăng ký cho học sinh nào chưa

      if (cleanPhone && cleanPhone.length >= 9) {

        const phoneStudent = allStus.find(s => {

          const p = (s.parentPhone || '').replace(/[^0-9]/g, '');

          return p && p === cleanPhone;

        });

        if (phoneStudent) {

          const msg = `⛔ Số điện thoại ${cleanPhone} đã được dùng cho tài khoản của bạn "${phoneStudent.name}" (${phoneStudent.className}, Tên đăng nhập: "${phoneStudent.username}")!\n\nMỗi học sinh chỉ được đăng ký 1 tài khoản duy nhất.`;

          setRegError(msg);

          alert(msg);

          return;

        }

      }



      // 4. Kiểm tra Tên đăng nhập đã có bạn khác dùng chưa

      const isExisted = allStus.some(

        s => (s.username && removeDiacritics(s.username).replace(/\s+/g, '') === rawUser) || 

             (s.studentCode && s.studentCode.toLowerCase() === rawUser)

      );



      if (isExisted) {

        const msg = `⛔ Tên đăng nhập "${rawUser}" đã có bạn đăng ký rồi! Em vui lòng chọn tên đăng nhập khác (ví dụ: ${rawUser}${Math.floor(10 + Math.random() * 90)}) nhé.`;

        setRegError(msg);

        alert(msg);

        return;

      }



      // Tự động chuẩn hóa chính tả họ tên học sinh theo danh sách lớp

      const stdNameResult = studentGradebookService.standardizeStudentName(name, cleanCls);

      const finalName = stdNameResult.standardizedName || name;

      const finalCode = stdNameResult.officialItem ? stdNameResult.officialItem.studentCode : ('HS' + cleanCls.replace(/\s+/g, '') + '-' + Math.floor(10 + Math.random() * 90));



      // Tạo mới hồ sơ học sinh kèm điểm khuyến mại hôm nay / ngày mai

      const savedProfile = studentGradebookService.addStudent({

        studentCode: finalCode,

        username: rawUser,

        password: pass,

        name: finalName,

        classId: 'cls-' + cleanCls.toLowerCase().replace(/\s+/g, ''),

        className: cleanCls,

        grade: regGrade,

        gender: regGender,

        parentPhone: cleanPhone,

        note: stdNameResult.isOfficialMatched ? 'Học sinh chính thức theo Sổ điểm bộ môn' : 'Học sinh tự đăng ký trực tuyến',

        attendancePoints: loginRewardInfo.points,

        encouragementBonus: 15,

        totalMeritPoints: 15 + loginRewardInfo.points,

        lastLoginDate: loginRewardInfo.todayStr

      });

      studentGradebookService.recordCheckin(savedProfile, 'Đăng ký tài khoản', `Đăng ký & đăng nhập ngày ${loginRewardInfo.todayStr} (+${loginRewardInfo.points}đ: ${loginRewardInfo.title})`);



      // Đồng bộ ngay lên Cloud để điện thoại có thể đăng nhập ngay tức thì

      studentGradebookService.syncToCloud().catch(() => {});



      studentGradebookService.setActiveStudent(savedProfile);

      setCurrentStudent(savedProfile);

      setShowAuthModal(false);

      setRegFullName('');

      setRegUsername('');

      setRegPassword('');

      setRegPhone('');

      setRegError('');

      setRegUsernameUserEdited(false);



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



  // Tự động phân chia và lọc tài liệu ôn tập theo đúng khối lớp của học sinh để tránh rối mắt

  const displayDocList = React.useMemo(() => {

    if (!currentStudent || !currentStudent.grade) return docList;

    const grade = currentStudent.grade;

    return docList.filter(d => {

      const text = ((d.name || '') + ' ' + (d.description || '')).toLowerCase();

      // Khớp khối lớp hiện tại của em

      if (text.includes(`lớp ${grade}`) || text.includes(`khối ${grade}`) || text.includes(`anh ${grade}`)) return true;

      // Khớp các khối khác thì ẩn đi

      const otherGrades = [6, 7, 8, 9, 10, 11, 12].filter(g => g !== grade);

      if (otherGrades.some(g => text.includes(`lớp ${g}`) || text.includes(`khối ${g}`) || text.includes(`anh ${g}`))) return false;

      return true; // Tài liệu chung toàn trường / dùng chung

    });

  }, [docList, currentStudent?.grade]);



  const displayMaterials = React.useMemo(() => {

    if (!currentStudent || !currentStudent.grade) return DOWNLOADABLE_MATERIALS;

    const grade = currentStudent.grade;

    return DOWNLOADABLE_MATERIALS.filter(m => {

      const gStr = (m.grade || '').toLowerCase();

      if (gStr.includes(`lớp ${grade}`) || gStr.includes(`khối ${grade}`)) return true;

      if (gStr.includes('6, 7, 8, 9') || gStr.includes('tổng hợp') || gStr.includes('toàn trường') || gStr.includes('thcs')) return true;

      return false;

    });

  }, [currentStudent?.grade]);

  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => systemMaintenanceService.isSessionAuthenticated());

  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);

  const [adminInputUser, setAdminInputUser] = useState<string>('Admin');

  const [adminInputPass, setAdminInputPass] = useState<string>('');

  const [adminLoginError, setAdminLoginError] = useState<string>('');

  const [isUploadingDoc, setIsUploadingDoc] = useState<boolean>(false);



  // Quản lý & Xóa Tài khoản Học sinh (Quyền Admin)

  const [showAdminStudentModal, setShowAdminStudentModal] = useState<boolean>(false);

  const [showStudentPasswords, setShowStudentPasswords] = useState<boolean>(false);

  const [adminStudentSearchQuery, setAdminStudentSearchQuery] = useState<string>('');

  const [adminStudentFilterClass, setAdminStudentFilterClass] = useState<string>('ALL');

  const [adminStudentList, setAdminStudentList] = useState<StudentProfile[]>(() => studentGradebookService.getStudents());

  const [isSyncingAdminStudents, setIsSyncingAdminStudents] = useState<boolean>(false);



  const handleOpenAdminStudentManager = async () => {

    if (!systemMaintenanceService.isSessionAuthenticated()) {

      setIsAdminUnlocked(false);

      setAdminInputUser('Admin');

      setAdminInputPass('');

      setAdminLoginError('');

      setShowAdminLoginModal(true);

      return;

    }

    setIsAdminUnlocked(true);

    setIsSyncingAdminStudents(true);

    try {

      const refreshed = await studentGradebookService.syncFromCloud();

      setAdminStudentList(refreshed);

    } catch {}

    setIsSyncingAdminStudents(false);

    setShowAdminStudentModal(true);

  };



  const handleAdminLogout = () => {

    if (window.confirm('Thầy/Cô có chắc chắn muốn đăng xuất quyền Quản trị viên (Admin) không?')) {

      systemMaintenanceService.logoutAdminSession();

      setIsAdminUnlocked(false);

      setShowAdminStudentModal(false);

      setAdminInputPass('');

      setAdminLoginError('');

      alert('Đã đăng xuất quyền Quản trị viên Admin thành công! Mọi tài khoản học sinh đã được bảo vệ.');

    }

  };



  const handleAdminDeleteStudent = async (student: StudentProfile) => {

    if (!isAdminUnlocked && !systemMaintenanceService.isSessionAuthenticated()) {

      alert('⚠️ Bạn không có quyền Admin để thực hiện thao tác này! Vui lòng đăng nhập tài khoản Admin.');

      setShowAdminLoginModal(true);

      return;

    }



    const confirmText = `Thầy/Cô có CHẮC CHẮN muốn XÓA VĨNH VIỄN tài khoản của học sinh này không?\n\n` +

      `👤 Họ và tên: ${student.name}\n` +

      `🏫 Lớp: ${student.className}\n` +

      `🔑 Tên đăng nhập: ${student.username || student.studentCode}\n` +

      `🔒 Mật khẩu: ${student.password || 'Mật khẩu riêng'}\n\n` +

      `⚠️ Tài khoản sẽ bị xóa khỏi bộ nhớ máy tính và toàn bộ máy chủ Cloud!`;

    if (!window.confirm(confirmText)) return;



    try {

      const ok = studentGradebookService.deleteStudent(student.id, true);

      if (!ok) {

        alert('⚠️ Thao tác xóa bị từ chối do thiếu quyền Admin hợp lệ!');

        return;

      }

      await studentGradebookService.syncToCloud();

      setAdminStudentList(studentGradebookService.getStudents());

      if (currentStudent && currentStudent.id === student.id) {

        setCurrentStudent(null);

      }

      alert(`✅ ĐÃ XÓA TÀI KHOẢN HỌC SINH "${student.name}" THÀNH CÔNG!`);

    } catch (err: any) {

      alert('Lỗi khi xóa tài khoản: ' + (err?.message || 'Vui lòng thử lại!'));

    }

  };



  const filteredAdminStudents = adminStudentList.filter(s => {

    if (adminStudentFilterClass !== 'ALL' && (s.className || '').toUpperCase() !== adminStudentFilterClass.toUpperCase()) {

      return false;

    }

    if (adminStudentSearchQuery.trim()) {

      const q = removeDiacritics(adminStudentSearchQuery.trim()).toLowerCase();

      const n = removeDiacritics(s.name || '').toLowerCase();

      const u = (s.username || '').toLowerCase();

      const c = (s.studentCode || '').toLowerCase();

      const p = (s.parentPhone || '');

      const cls = (s.className || '').toLowerCase();

      return n.includes(q) || u.includes(q) || c.includes(q) || p.includes(q) || cls.includes(q);

    }

    return true;

  });



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

    // Đồng bộ tài khoản học sinh từ Cloud khi mở trang (giúp điện thoại cập nhật ngay)

    studentGradebookService.syncFromCloud().catch(() => {});



    const handleAuthChange = (e: any) => {

      setIsAdminUnlocked(!!e?.detail?.isAuthenticated);

    };

    window.addEventListener('gvai_admin_auth_changed', handleAuthChange);

    return () => window.removeEventListener('gvai_admin_auth_changed', handleAuthChange);

  }, []);



  const handleAdminVerify = (e: React.FormEvent) => {

    e.preventDefault();

    if (systemMaintenanceService.verifyAdminCredentials(adminInputUser, adminInputPass)) {

      systemMaintenanceService.saveAdminSession();

      setIsAdminUnlocked(true);

      setShowAdminLoginModal(false);

      setAdminInputPass('');

      setAdminLoginError('');

      studentGradebookService.syncFromCloud().then(stus => {

        setAdminStudentList(stus);

      }).catch(() => {});

      setShowAdminStudentModal(true);

      alert('🎉 Đăng nhập Quản trị viên (Admin) thành công! Thầy/Cô có toàn quyền Quản lý & Xóa tài khoản học sinh, Tải lên và Xóa tài liệu.');

    } else {

      setAdminLoginError('Tên đăng nhập hoặc Mật khẩu Quản trị không chính xác! Vui lòng kiểm tra lại.');

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

          'Tài liệu ôn tập & Đề kiểm tra chia sẻ cho Giáo viên và Học sinh',

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



  // Modal Admin Tải Tài Liệu Lên Cho Học Sinh

  

  // Modal Quản Lý & Cập Nhật Sổ Điểm / Danh Sách Học Sinh (Lớp Thầy Dạy)

  const [showRosterModal, setShowRosterModal] = useState<boolean>(false);

  const [rosterClass, setRosterClass] = useState<string>('8A1');

  const [rosterText, setRosterText] = useState<string>('');

  const [rosterMsg, setRosterMsg] = useState<string>('');



  const handleSaveRoster = (e: React.FormEvent) => {

    e.preventDefault();

    setRosterMsg('');

    if (!rosterText.trim()) {

      setRosterMsg('Vui lòng dán danh sách học sinh vào ô bên dưới!');

      return;

    }

    // Tách dòng

    const lines = rosterText.split(/[\r\n]+/);

    const parsedNames: string[] = [];

    lines.forEach(line => {

      // Loại bỏ số thứ tự ở đầu ví dụ "1.", "1/", "1 -", "STT 1", v.v.

      const cleaned = line.replace(/^(?:\d+[:.)\-\s/]+|stt\s*\d+[:.)\-\s/]+)/i, '').trim();

      if (cleaned && cleaned.length >= 3) {

        parsedNames.push(cleaned);

      }

    });



    if (parsedNames.length === 0) {

      setRosterMsg('Không tìm thấy tên học sinh hợp lệ nào từ văn bản đã dán!');

      return;

    }



    const res = studentGradebookService.saveOfficialRoster(rosterClass, parsedNames);

    setRosterMsg(`🎉 Đã cập nhật thành công sổ điểm Lớp ${rosterClass} gồm ${res.count} học sinh!`);

    alert(`🎉 Đã lưu thành công ${res.count} học sinh vào sổ điểm chính thức Lớp ${rosterClass}!\nHọc sinh lớp này khi vào học sẽ được đối chiếu đúng danh sách, chặn hoàn toàn các tên ảo hoặc tên không đúng chuẩn giáo dục.`);

    setRosterText('');

  };



  const handleClearRoster = (cls: string) => {

    if (window.confirm(`Thầy có chắc chắn muốn xóa danh sách học sinh Lớp ${cls} không?`)) {

      studentGradebookService.deleteOfficialRoster(cls);

      setRosterMsg(`Đã xóa danh sách học sinh Lớp ${cls}.`);

    }

  };



  const [showAdminUploadModal, setShowAdminUploadModal] = useState<boolean>(false);

  const [adminUploadTitle, setAdminUploadTitle] = useState<string>('');

  const [adminUploadGrade, setAdminUploadGrade] = useState<string>('all');

  const [adminUploadSubject, setAdminUploadSubject] = useState<string>('Tiếng Anh');

  const [adminUploadDesc, setAdminUploadDesc] = useState<string>('');

  const [adminUploadFile, setAdminUploadFile] = useState<File | null>(null);

  const [adminUploadError, setAdminUploadError] = useState<string>('');



  const handleAdminSubmitDoc = async (e: React.FormEvent) => {

    e.preventDefault();

    setAdminUploadError('');

    if (!isAdminUnlocked && !systemMaintenanceService.isSessionAuthenticated()) {

      alert('Vui lòng đăng nhập Admin để tải tài liệu lên!');

      setShowAdminLoginModal(true);

      return;

    }

    if (!adminUploadFile) {

      setAdminUploadError('Vui lòng chọn tệp tài liệu cần tải lên!');

      return;

    }



    setIsUploadingDoc(true);

    try {

      const fileName = adminUploadTitle.trim() || adminUploadFile.name;

      const gradeText = adminUploadGrade === 'all' ? 'Toàn trường (Lớp 6-12)' : `Lớp ${adminUploadGrade}`;

      const fullDesc = `[${adminUploadSubject} - ${gradeText}] ${adminUploadDesc.trim() || 'Tài liệu ôn tập chuẩn cấu trúc GDPT'}`;



      await documentStorageService.uploadFile(

        'folder-default',

        adminUploadFile,

        fullDesc,

        'Admin Thầy Đinh Thành'

      );



      reloadDocList();

      setShowAdminUploadModal(false);

      setAdminUploadTitle('');

      setAdminUploadDesc('');

      setAdminUploadFile(null);

      alert(`🎉 Đã tải lên tài liệu "${fileName}" thành công! Học sinh toàn trường có thể tải về ngay.`);

    } catch (err: any) {

      setAdminUploadError('Lỗi tải tệp: ' + (err?.message || 'Không thể lưu tệp'));

    } finally {

      setIsUploadingDoc(false);

    }

  };



  const [competitionSubTab, setCompetitionSubTab] = useState<'all' | 'grade' | 'class' | 'teams'>('all');
  const [activeTab, setActiveTab] = useState<'missions' | 'vocab' | 'sgk' | 'quiz' | 'exam' | 'hsg' | 'downloads' | 'leaderboard' | 'tracking' | 'forum' | 'messages' | 'decuong_e8' | 'decuong_e7' | 'decuong_e6' | 'decuong_e9' | 'teams'>(() => {

    try {

      const params = new URLSearchParams(window.location.search);

      const tabParam = params.get('tab');

      const rawPath = window.location.pathname.toLowerCase();

      const rawHash = window.location.hash.toLowerCase();

      if (

        tabParam === 'exam' ||

        tabParam === 'kiemtra' ||

        tabParam === 'kiem-tra' ||

        rawHash === '#exam' ||

        rawHash === '#kiemtra' ||

        rawHash === '#kiem-tra' ||

        rawPath.endsWith('/kiemtra') ||

        rawPath.endsWith('/kiem-tra')

      ) {

        return 'exam';

      }

      if (tabParam === 'forum' || rawHash === '#forum') {

        return 'forum';

      }

      if (tabParam === 'messages' || tabParam === 'message' || rawHash === '#messages') {

        return 'messages';

      }

      if (tabParam === 'downloads' || rawHash === '#downloads') {

        return 'downloads';

      }

    } catch (e) {}

    return 'vocab';

  });


  // Đồng bộ trạng thái học sinh đang online và hoạt động học tập hiện tại (đặt sau khi activeTab đã khởi tạo)
  useEffect(() => {
    onlinePresenceService.setCurrentStudent(currentStudent);
    if (!currentStudent) return;

    if (activeTab === 'vocab') {
      onlinePresenceService.updateAction('Đang luyện Từ Vựng Tiếng Anh');
    } else if (activeTab === 'exam') {
      onlinePresenceService.updateAction('Đang làm Đề Kiểm Tra GK1');
    } else if (activeTab === 'quiz') {
      onlinePresenceService.updateAction('Đang làm trắc nghiệm 5 phút');
    } else if (['decuong_e8', 'decuong_e7', 'decuong_e6', 'decuong_e9', 'sgk'].includes(activeTab)) {
      onlinePresenceService.updateAction('Đang ôn Đề Cương GK1');
    } else if (['teams', 'leaderboard'].includes(activeTab)) {
      onlinePresenceService.updateAction('Đang xem Thi Đua 4 Tổ & Bảng Vàng');
    } else if (activeTab === 'forum') {
      onlinePresenceService.updateAction('Đang hỏi bài Thầy Thành');
    } else {
      onlinePresenceService.updateAction('Đang vào học trực tuyến');
    }
  }, [activeTab, currentStudent]);

  const [copiedLink, setCopiedLink] = useState(false);



  // State Học Từ Vựng

  const [iframeKey, setIframeKey] = useState<number>(0);

  const [isFullscreenIframe, setIsFullscreenIframe] = useState<boolean>(false);

  const [vocabViewMode, setVocabViewMode] = useState<'native' | 'iframe'>('native');

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

    // TỰ ĐỘNG ĐỒNG BỘ KHỐI LỚP KHI HỌC SINH VÀO HỌC ĐỂ KHỎI NHẦM LẪN

  useEffect(() => {

    if (currentStudent && currentStudent.grade) {

      setSelectedGrade(currentStudent.grade);

      setSelectedUnit(1);

      // Tự động đồng bộ tab đề cương theo đúng khối lớp của học sinh

      if (currentStudent.grade === 6 && ['decuong_e7', 'decuong_e8', 'decuong_e9'].includes(activeTab)) {
        setActiveTab('decuong_e6');
      } else if (currentStudent.grade === 7 && ['decuong_e6', 'decuong_e8', 'decuong_e9'].includes(activeTab)) {
        setActiveTab('decuong_e7');
      } else if (currentStudent.grade === 8 && ['decuong_e6', 'decuong_e7', 'decuong_e9'].includes(activeTab)) {
        setActiveTab('decuong_e8');
      } else if (currentStudent.grade === 9 && ['decuong_e6', 'decuong_e7', 'decuong_e8'].includes(activeTab)) {
        setActiveTab('decuong_e9');
      } else if (![6, 7, 8, 9].includes(currentStudent.grade) && ['decuong_e6', 'decuong_e7', 'decuong_e8', 'decuong_e9'].includes(activeTab)) {
        setActiveTab('vocab');
      }

    }

  }, [currentStudent?.grade, currentStudent?.id]);



  const [speechRate, setSpeechRate] = useState<number>(() => audioPronunciationService.getRate());



  const handleToggleAccent = (newAccent: VoiceAccent) => {

    setVoiceAccent(newAccent);

    audioPronunciationService.setAccent(newAccent);

  };



  const handleToggleRate = (newRate: number) => {

    setSpeechRate(newRate);

    audioPronunciationService.setRate(newRate);

  };



  // Tự động ghi nhận lịch sử khi học từ vựng

  useEffect(() => {

    if (currentStudent && activeTab === 'vocab') {

      try {

        studentGradebookService.recordCheckin(

          currentStudent,

          'Học từ vựng SGK',

          `Unit ${selectedUnit} - Tiếng Anh Lớp ${selectedGrade}`

        );

      } catch {}

    }

  }, [selectedUnit, selectedGrade, activeTab, currentStudent]);









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





      {/* =========================================================================
          CỔNG HỌC TẬP VÀ THI THỬ TRỰC TUYẾN - 5 BƯỚC SƯ PHẠM KHOA HỌC TỪ TRÊN XUỐNG
          Thầy giáo Đinh Văn Thành - Trường THCS Đồng Yên - SĐT/Zalo: 0915.213717
          1. Bước 1: Đăng nhập (Chọn Lớp & Tên học sinh)
          2. Bước 2: Xem thông báo ngắn gọn
          3. Bước 3: Vào học (Luyện Từ Vựng 3D & Ôn Đề Cương GK1)
          4. Bước 4: Kiểm tra thử (Trắc nghiệm 5 phút & Đề thi thử GK1)
          5. Bước 5: Thống kê xem điểm (Cá nhân, Lớp, Khối, Toàn trường, DS Chưa Đăng Nhập)
      ========================================================================= */}

      {/* HEADER TỔNG QUAN: CỔNG HỌC TẬP THCS ĐỒNG YÊN */}
      <div className="bg-gradient-to-r from-[#07172C] via-[#0B2548] to-[#0A1F3B] border border-blue-500/30 rounded-2xl p-3.5 sm:p-4 text-white shadow-md mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-lg sm:text-xl shrink-0 shadow-inner">
            🎓
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                Cổng Học Tập &amp; Thi Thử Trực Tuyến
              </h2>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-500/25 text-cyan-200 border border-blue-400/30 font-bold">
                THCS Đồng Yên
              </span>
            </div>
            <p className="text-xs text-blue-200/90 mt-0.5">
              Hệ thống ôn tập chuẩn ma trận GDPT 2018 do Thầy giáo Đinh Văn Thành xây dựng • ĐT/Zalo: 0915.213717
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs font-bold shrink-0">
          <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Tự cập nhật 2 phút • {lastAutoSyncTime}</span>
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-blue-500/20 text-blue-200 border border-blue-400/30">
            🔒 Bảo toàn 100% điểm số
          </span>
        </div>
      </div>

      {/* THANH HIỂN THỊ HỌC SINH ĐANG ONLINE THỜI GIAN THỰC */}
      <OnlineStudentsBar currentStudent={currentStudent} />

      {/* =========================================================================
          BƯỚC 1: ĐĂNG NHẬP / THÔNG TIN HỌC SINH ĐANG HỌC
      ========================================================================= */}
      {!currentStudent ? (
        /* Trường hợp 1: Chưa đăng nhập -> Hiện Form Đăng Nhập trực quan 1-Chạm */
        <div className="bg-gradient-to-br from-white via-blue-50/70 to-indigo-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 rounded-2xl border-2 border-blue-500/50 p-4 sm:p-5 shadow-xl mb-4 animate-in fade-in space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-blue-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-xl bg-blue-600 text-white font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <span>🔑</span>
                <span>BƯỚC 1: ĐĂNG NHẬP</span>
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                CHỌN LỚP &amp; HỌ TÊN EM ĐỂ VÀO HỌC
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-bold">
                🎁 Tặng +{loginRewardInfo.points}đ đăng nhập lần đầu mỗi ngày
              </span>
              <span className="text-xs text-slate-500 font-bold hidden sm:inline">
                Miễn phí 100%
              </span>
            </div>
          </div>

          {/* GỢI Ý 1-CHẠM VÀO HỌC LẠI NẾU ĐÃ CÓ BẢN LƯU TRÊN THIẾT BỊ NÀY */}
          {rememberedStudent && (
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-3.5 sm:p-4 rounded-xl text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-emerald-300/60">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-white text-emerald-700 flex items-center justify-center font-black text-lg shadow-xs shrink-0">
                  👋
                </div>
                <div>
                  <div className="text-[11px] text-emerald-100 font-bold uppercase tracking-wider">
                    Thiết bị ghi nhận tên em:
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-white">
                    {rememberedStudent.name} — Lớp {rememberedStudent.className}
                  </h4>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOneTapLogin(rememberedStudent.name, rememberedStudent.className)}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-900" />
                  <span>🚀 1-Chạm Vào Học Ngay</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('DONGYEN_REMEMBERED_STUDENT');
                    setRememberedStudent(null);
                    setQuickFullName('');
                  }}
                  className="px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition cursor-pointer"
                  title="Nhập học sinh khác"
                >
                  Chọn Bạn Khác
                </button>
              </div>
            </div>
          )}

          {/* GỢI Ý CÁC BẠN VỪA HỌC TRÊN THIẾT BỊ (CHO ANH CHỊ EM DÙNG CHUNG MÁY) */}
          {recentStudents.length > 1 && (
            <div className="flex items-center gap-2 flex-wrap p-2 rounded-xl bg-blue-50/70 dark:bg-slate-800/60 border border-blue-200 dark:border-slate-700 text-xs">
              <span className="text-slate-600 dark:text-slate-300 font-bold shrink-0">Chọn nhanh bạn học:</span>
              {recentStudents.map((rc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleOneTapLogin(rc.name, rc.className)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-slate-600 hover:bg-blue-100 font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>👤 {rc.name} ({rc.className})</span>
                </button>
              ))}
            </div>
          )}

          {/* TAB CHUYỂN ĐỔI CHẾ ĐỘ Ở BƯỚC 1: 1. CHỌN TÊN TRONG LỚP | 2. ĐĂNG KÝ NHANH THEO LỚP (MẤT TÀI KHOẢN / MỚI) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1.5 rounded-2xl bg-blue-100/70 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => { setAuthMode('pick'); setQuickError(''); }}
              className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'pick'
                  ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <span>🔑</span>
              <span>1. CHỌN TÊN TRONG LỚP (743 Em - 19 Lớp)</span>
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setRegError(''); }}
              className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'register'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md ring-2 ring-emerald-300'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>2. ĐĂNG KÝ NHANH THEO LỚP (Mất TK / Mới)</span>
            </button>
          </div>

          {authMode === 'pick' ? (
            /* =========================================================================
                CHẾ ĐỘ 1: DANH SÁCH LỰA CHỌN GỌN GÀNG: CHỌN KHỐI -> CHỌN LỚP -> CHỌN TÊN HS
            ========================================================================= */
            <form onSubmit={handleQuickAccessSubmit} className="space-y-4">
              {quickError && (
                <div className="p-3.5 rounded-2xl bg-rose-500/15 border-2 border-rose-500/40 text-rose-700 dark:text-rose-200 text-xs sm:text-sm font-black text-center shadow-md animate-shake">
                  ⚠️ {quickError}
                </div>
              )}

              {/* BỘ 3 DANH SÁCH LỰA CHỌN GỌN GÀNG (3 CỘT TRÊN MÁY TÍNH / XẾP CHỒNG TRÊN ĐIỆN THOẠI) */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-slate-900/90 border-2 border-blue-400/50 shadow-xl backdrop-blur-xl space-y-4">
                
                {/* Tiêu đề hướng dẫn */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-md">
                      📋
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        Chọn Khối ➔ Chọn Lớp ➔ Chọn Tên Em Để Vào Học
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Hệ thống tự động đồng bộ theo danh sách 19 lớp và 743 học sinh toàn trường
                      </p>
                    </div>
                  </div>
                  {quickClassName && (
                    <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-black border border-blue-300 dark:border-blue-700">
                      Đang chọn: Lớp {quickClassName.trim().toUpperCase()}
                    </span>
                  )}
                </div>

                {/* 3 CỘT DANH SÁCH LỰA CHỌN */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">

                  {/* CỘT 1: CHỌN KHỐI */}
                  {(() => {
                    const gradeNum = parseInt(quickClassName.replace(/\D/g, ''), 10) || 6;
                    const activeGrade = [6, 7, 8, 9].includes(gradeNum) ? gradeNum : 'other';

                    return (
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2.5 shadow-2xs">
                        <label className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-[11px] font-black">1</span>
                            <span>Chọn Khối Lớp (*):</span>
                          </span>
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                            {activeGrade === 'other' ? 'Khối khác' : `Khối ${activeGrade}`}
                          </span>
                        </label>

                        {/* Dropdown Select Khối */}
                        <div className="relative">
                          <select
                            value={activeGrade}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '6') setQuickClassName('6A1');
                              else if (val === '7') setQuickClassName('7A1');
                              else if (val === '8') setQuickClassName('8A1');
                              else if (val === '9') setQuickClassName('9A1');
                              setQuickFullName('');
                              setQuickError('');
                              setQuickAutocorrectNote(null);
                            }}
                            className="w-full px-3 py-2.5 rounded-xl border-2 border-emerald-400/80 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm font-black focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300 outline-hidden cursor-pointer shadow-xs"
                          >
                            <option value={6}>Khối 6 (5 lớp • Thầy Đinh Thành dạy)</option>
                            <option value={7}>Khối 7 (5 lớp • Cô Hoàng Thị Vươn dạy)</option>
                            <option value={8}>Khối 8 (5 lớp • Thầy Đinh Thành dạy)</option>
                            <option value={9}>Khối 9 (4 lớp • Cô Hoàng Thị Vươn dạy)</option>
                            <option value="other">Khối khác / Tự nhập lớp</option>
                          </select>
                        </div>

                        {/* Nút bấm chọn nhanh 4 khối */}
                        <div className="grid grid-cols-4 gap-1 pt-1">
                          {[6, 7, 8, 9].map(g => {
                            const isAct = activeGrade === g;
                            return (
                              <button
                                key={g}
                                type="button"
                                onClick={() => {
                                  setQuickClassName(`${g}A1`);
                                  setQuickFullName('');
                                  setQuickError('');
                                  setQuickAutocorrectNote(null);
                                }}
                                className={`py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer text-center ${
                                  isAct
                                    ? 'bg-emerald-600 text-white shadow-xs scale-105'
                                    : 'bg-white dark:bg-slate-700/80 hover:bg-emerald-50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
                                }`}
                              >
                                K{g}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* CỘT 2: CHỌN LỚP */}
                  {(() => {
                    const gradeNum = parseInt(quickClassName.replace(/\D/g, ''), 10) || 6;
                    const classList = 
                      gradeNum === 6 ? ['6A1', '6A2', '6A3', '6A4', '6A5'] :
                      gradeNum === 7 ? ['7A1', '7A2', '7A3', '7A4', '7A5'] :
                      gradeNum === 8 ? ['8A1', '8A2', '8A3', '8A4', '8A5'] :
                      gradeNum === 9 ? ['9A1', '9A2', '9A3', '9A4'] :
                      ['6A1', '6A2', '6A3', '6A4', '6A5', '7A1', '7A2', '7A3', '7A4', '7A5', '8A1', '8A2', '8A3', '8A4', '8A5', '9A1', '9A2', '9A3', '9A4'];

                    const teacherName = (gradeNum === 6 || gradeNum === 8) ? 'Thầy Đinh Thành' : 'Cô Hoàng Thị Vươn';

                    return (
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2.5 shadow-2xs">
                        <label className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[11px] font-black">2</span>
                            <span>Chọn Lớp (*):</span>
                          </span>
                          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold truncate max-w-[130px]">
                            {teacherName}
                          </span>
                        </label>

                        {/* Dropdown Select Lớp */}
                        <div className="relative">
                          <select
                            value={quickClassName.trim().toUpperCase()}
                            onChange={(e) => {
                              const cls = e.target.value;
                              setQuickClassName(cls);
                              setQuickError('');
                              const newRoster = studentGradebookService.getOfficialRoster(cls);
                              if (quickFullName.trim() && !newRoster.includes(quickFullName.trim())) {
                                setQuickFullName('');
                                setQuickAutocorrectNote(null);
                              }
                            }}
                            className="w-full px-3 py-2.5 rounded-xl border-2 border-blue-400/80 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm font-black focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-hidden cursor-pointer shadow-xs"
                          >
                            {classList.map(cls => {
                              const count = studentGradebookService.getOfficialRoster(cls).length || 37;
                              return (
                                <option key={cls} value={cls}>
                                  Lớp {cls} ({count} học sinh - {teacherName})
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        {/* Dãy nút chọn lớp nhanh trong khối */}
                        <div className="flex items-center gap-1 overflow-x-auto pb-1 pt-1">
                          {classList.map(cls => {
                            const isSelected = quickClassName.trim().toUpperCase() === cls;
                            return (
                              <button
                                key={cls}
                                type="button"
                                onClick={() => {
                                  setQuickClassName(cls);
                                  setQuickError('');
                                  const newRoster = studentGradebookService.getOfficialRoster(cls);
                                  if (quickFullName.trim() && !newRoster.includes(quickFullName.trim())) {
                                    setQuickFullName('');
                                    setQuickAutocorrectNote(null);
                                  }
                                }}
                                className={`flex-1 py-1 px-1 rounded-lg text-xs font-black transition-all cursor-pointer text-center whitespace-nowrap ${
                                  isSelected
                                    ? 'bg-blue-600 text-white shadow-xs font-black ring-2 ring-blue-300 scale-105'
                                    : 'bg-white dark:bg-slate-700/80 hover:bg-blue-50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
                                }`}
                              >
                                {cls}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* CỘT 3: CHỌN TÊN EM TRONG SỔ ĐIỂM */}
                  {(() => {
                    const roster = studentGradebookService.getOfficialRoster(quickClassName) || [];

                    return (
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2.5 shadow-2xs">
                        <label className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-lg bg-amber-500 text-white flex items-center justify-center text-[11px] font-black">3</span>
                            <span>Chọn Tên Em (*):</span>
                          </span>
                          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                            {roster.length} em trong lớp
                          </span>
                        </label>

                        {/* Dropdown Select Danh sách Tên */}
                        <div className="relative">
                          <select
                            value={quickFullName}
                            onChange={(e) => {
                              const name = e.target.value;
                              setQuickFullName(name);
                              setQuickError('');
                              if (name) {
                                setQuickAutocorrectNote({
                                  original: name,
                                  corrected: name,
                                  isOfficial: true
                                });
                              } else {
                                setQuickAutocorrectNote(null);
                              }
                            }}
                            className="w-full px-3 py-2.5 rounded-xl border-2 border-amber-400/80 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm font-black focus:border-amber-500 focus:ring-2 focus:ring-amber-300 outline-hidden cursor-pointer shadow-xs"
                          >
                            <option value="">-- Bấm chọn Tên em ({roster.length} em) --</option>
                            {roster.map((name, idx) => (
                              <option key={name} value={name}>
                                #{idx + 1}. {name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Ô gõ lọc nhanh tên */}
                        <div className="relative pt-1">
                          <input
                            type="text"
                            value={quickFullName}
                            onChange={(e) => {
                              setQuickFullName(e.target.value);
                              setQuickError('');
                              setQuickAutocorrectNote(null);
                            }}
                            onBlur={handleQuickFullNameBlur}
                            placeholder="Hoặc gõ để tìm nhanh tên..."
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold outline-hidden focus:border-amber-500"
                          />
                        </div>
                      </div>
                    );
                  })()}

                </div>

                {/* Thông tin học sinh đã chọn (gọn gàng, thanh lịch) */}
                {quickFullName.trim() && (
                  <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-blue-500/15 to-indigo-500/15 border border-emerald-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🎉</span>
                      <span>
                        Học sinh đã chọn: <strong className="text-blue-700 dark:text-blue-300 font-black text-sm">{quickFullName}</strong> — Lớp <strong className="text-emerald-700 dark:text-emerald-300 font-black text-sm">{quickClassName.trim().toUpperCase()}</strong>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setQuickFullName('');
                        setQuickAutocorrectNote(null);
                      }}
                      className="text-rose-500 hover:text-rose-700 font-bold text-xs underline cursor-pointer self-end sm:self-center"
                    >
                      ✕ Chọn bạn khác
                    </button>
                  </div>
                )}
              </div>

              {/* NÚT VÀO HỌC NGAY */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm sm:text-base shadow-lg shadow-blue-500/25 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>🚀 VÀO HỌC NGAY (+{loginRewardInfo.points}đ Lần Đầu Trong Ngày)</span>
              </button>

              {/* Lối tắt nhỏ gọn nếu học sinh mất tài khoản hoặc cần đăng ký mới */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setRegClassName(quickClassName);
                    if (quickFullName.trim()) setRegFullName(quickFullName.trim());
                  }}
                  className="text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-300 underline cursor-pointer transition"
                >
                  💡 Em chưa có tên trong danh sách hoặc đổi thiết bị? Bấm vào đây để đăng ký nhanh
                </button>
              </div>
            </form>
          ) : (
            /* =========================================================================
                CHẾ ĐỘ 2: ĐĂNG KÝ NHANH THEO LỚP (DÀNH CHO HỌC SINH MẤT TÀI KHOẢN HOẶC MỚI)
            ========================================================================= */
            <form onSubmit={handleQuickRegisterSubmit} className="space-y-3.5 animate-in fade-in">
              {regError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold text-center">
                  ⚠️ {regError}
                </div>
              )}
              {regSuccessMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs font-bold text-center">
                  🎉 {regSuccessMessage}
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200 space-y-1">
                <div className="font-black text-sm flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>ĐĂNG KÝ ĐƠN GIẢN THEO LỚP ĐỂ VÀO HỌC NGAY</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  • <strong>Bị mất tài khoản / Đổi thiết bị?</strong> Chỉ cần chọn đúng Lớp và gõ Họ và Tên em, hệ thống sẽ <strong>tự động tìm lại và bảo toàn 100% điểm số cũ</strong> của em!
                </p>
                <p className="text-[11px] leading-relaxed">
                  • <strong>Học sinh mới:</strong> Tặng ngay <strong>+{loginRewardInfo.points} điểm</strong> khi đăng nhập lần đầu hôm nay + 15 điểm khuyến khích khởi động thi đua!
                </p>
              </div>

              {/* BƯỚC 1: CHỌN LỚP */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border border-emerald-200 dark:border-emerald-900/60 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100">
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center text-xs">1</span>
                    <span>Chọn Lớp của em (*):</span>
                  </span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                    Đang chọn: Lớp {regClassName.trim().toUpperCase()}
                  </span>
                </div>

                {/* KHỐI 9 */}
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span>Khối 9 (4 lớp - Cô Hoàng Thị Vươn dạy):</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {['9A1', '9A2', '9A3', '9A4'].map(cls => {
                      const isSelected = regClassName.trim().toUpperCase() === cls;
                      return (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => { setRegClassName(cls); setRegError(''); }}
                          className={`py-2 px-1 rounded-xl text-center transition cursor-pointer font-black text-xs sm:text-sm ${
                            isSelected
                              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md ring-2 ring-purple-300 scale-[1.02]'
                              : 'bg-purple-50/50 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 border border-purple-200/70 hover:bg-purple-100'
                          }`}
                        >
                          {cls}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* KHỐI 8 */}
                <div className="space-y-1 pt-1">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>Khối 8 (5 lớp - Thầy Đinh Thành dạy):</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {['8A1', '8A2', '8A3', '8A4', '8A5'].map(cls => {
                      const isSelected = regClassName.trim().toUpperCase() === cls;
                      return (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => { setRegClassName(cls); setRegError(''); }}
                          className={`py-2 px-1 rounded-xl text-center transition cursor-pointer font-black text-xs sm:text-sm ${
                            isSelected
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md ring-2 ring-blue-300 scale-[1.02]'
                              : 'bg-blue-50/50 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 border border-blue-200/70 hover:bg-blue-100'
                          }`}
                        >
                          {cls}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* KHỐI 7 */}
                <div className="space-y-1 pt-1">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>Khối 7 (5 lớp - Cô Hoàng Thị Vươn dạy):</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {['7A1', '7A2', '7A3', '7A4', '7A5'].map(cls => {
                      const isSelected = regClassName.trim().toUpperCase() === cls;
                      return (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => { setRegClassName(cls); setRegError(''); }}
                          className={`py-2 px-1 rounded-xl text-center transition cursor-pointer font-black text-xs sm:text-sm ${
                            isSelected
                              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md ring-2 ring-amber-300 scale-[1.02]'
                              : 'bg-amber-50/50 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 border border-amber-200/70 hover:bg-amber-100'
                          }`}
                        >
                          {cls}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* KHỐI 6 */}
                <div className="space-y-1 pt-1">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Khối 6 (5 lớp - Thầy Đinh Thành dạy):</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {['6A1', '6A2', '6A3', '6A4', '6A5'].map(cls => {
                      const isSelected = regClassName.trim().toUpperCase() === cls;
                      return (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => { setRegClassName(cls); setRegError(''); }}
                          className={`py-2 px-1 rounded-xl text-center transition cursor-pointer font-black text-xs sm:text-sm ${
                            isSelected
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md ring-2 ring-emerald-300 scale-[1.02]'
                              : 'bg-emerald-50/50 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 border border-emerald-200/70 hover:bg-emerald-100'
                          }`}
                        >
                          {cls}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Lớp khác hoặc tự gõ */}
                <div className="pt-1 flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">Khối khác hoặc tự gõ:</span>
                  <input
                    type="text"
                    value={regClassName}
                    onChange={(e) => { setRegClassName(e.target.value); setRegError(''); }}
                    placeholder="Ví dụ: 8A1, 6A2, 10A1..."
                    className="flex-1 px-3 py-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold uppercase font-mono outline-hidden"
                  />
                </div>
              </div>

              {/* BƯỚC 2: NHẬP HỌ VÀ TÊN */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border border-emerald-200 dark:border-emerald-900/60 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100">
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center text-xs">2</span>
                    <span>Nhập Họ và Tên em (*):</span>
                  </span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                    Gõ có dấu hoặc không dấu
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => { setRegFullName(e.target.value); setRegError(''); }}
                  placeholder="Ví dụ: Hoàng Gia Bảo, Nguyễn Quốc Trọng, Vũ Huyền Linh..."
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50/20 dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-bold focus:border-emerald-500 outline-hidden"
                />
              </div>

              {/* BƯỚC 3: SĐT / ZALO PHỤ HUYNH (TÙY CHỌN) */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-slate-400 text-white flex items-center justify-center text-xs">3</span>
                    <span>Số điện thoại / Zalo phụ huynh (tùy chọn):</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">Để nhận thông báo thi đua</span>
                </div>
                <input
                  type="tel"
                  value={regParentPhone}
                  onChange={(e) => setRegParentPhone(e.target.value)}
                  placeholder="Ví dụ: 0915213717..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium outline-hidden"
                />
              </div>

              {/* NÚT BẤM ĐĂNG KÝ VÀ VÀO HỌC NGAY */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-500/25 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>🚀 BẤM ĐĂNG KÝ VÀ VÀO HỌC NGAY (+{loginRewardInfo.points}đ Lần Đầu)</span>
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setAuthMode('pick')}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold cursor-pointer"
                >
                  ← Quay lại danh sách có sẵn (Chọn tên trong 743 em)
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        /* Trường hợp 2: ĐÃ ĐĂNG NHẬP -> Thẻ học sinh tinh tế, đĩnh đạc */
        <div className="bg-gradient-to-r from-[#0C2444] via-[#0E2C52] to-[#0A1F3B] border-2 border-emerald-400/50 rounded-2xl p-3.5 sm:p-4 text-white shadow-lg mb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-2xl shadow-md shrink-0">
                {currentStudent.gender === 'Nữ' ? '👧' : '👦'}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                    ✅ BƯỚC 1: ĐÃ ĐĂNG NHẬP
                  </span>
                  <span className="text-base sm:text-lg font-black text-white">
                    {currentStudent.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-blue-600 text-white font-black text-xs">
                    Lớp {currentStudent.className}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-400 text-slate-950 font-black text-xs shadow-xs">
                    ⭐ {currentStudent.totalMeritPoints || 15}đ thi đua
                  </span>
                  {myTeamInfo && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('teams');
                        setCompetitionSubTab('teams');
                      }}
                      className="px-2 py-0.5 rounded-lg bg-indigo-500/40 text-indigo-200 border border-indigo-400/40 font-bold text-xs hover:bg-indigo-500/60 transition cursor-pointer flex items-center gap-1"
                      title="Xem chi tiết 4 Tổ Thi Đua của lớp em"
                    >
                      <span>🛡️ {myTeamInfo.team.name.split('(')[0]}</span>
                      <span className="px-1 rounded bg-amber-400 text-slate-950 font-black text-[9px]">
                        {myTeamInfo.member.roleBadge}
                      </span>
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-blue-200/90 flex-wrap">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Học thực tế: <strong className="text-cyan-300 font-bold">{currentStudent.studyTimeMinutes || 0} phút</strong> (+3đ/10p)</span>
                  </span>
                  <span>•</span>
                  <span className="text-emerald-300 font-bold">🔒 Tự động cập nhật 2 phút ({lastAutoSyncTime})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleSwitchOtherStudent}
                className="px-3 py-1.5 rounded-xl bg-blue-900/70 hover:bg-blue-800 text-blue-100 hover:text-white text-xs font-bold transition cursor-pointer border border-blue-600/50 flex items-center gap-1.5 shadow-xs"
                title="Đổi bạn học khác vào học"
              >
                <RotateCw className="w-3.5 h-3.5 text-cyan-300" />
                <span>Đổi Bạn Khác</span>
              </button>
            </div>
          </div>
        </div>
      )}



      {/* =========================================================================
          THANH 3 BƯỚC HỌC TẬP CHÍNH: BƯỚC 3 (VÀO HỌC) • BƯỚC 4 (KIỂM TRA) • BƯỚC 5 (THỐNG KÊ)
      ========================================================================= */}
      <div className="p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/80 dark:border-slate-700/60 shadow-lg flex flex-col md:flex-row items-center justify-between gap-2 mb-3">
        {/* Bộ 3 nút điều hướng học tập lớn */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full md:w-auto flex-1">
          {/* BƯỚC 3: VÀO HỌC */}
          <button
            type="button"
            onClick={() => {
              if (!['vocab', 'decuong_e8', 'decuong_e7', 'decuong_e6', 'decuong_e9', 'sgk', 'hsg'].includes(activeTab)) {
                setActiveTab('vocab');
              }
            }}
            className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl text-left transition-all cursor-pointer flex items-center gap-2 ${
              ['vocab', 'decuong_e8', 'decuong_e7', 'decuong_e6', 'decuong_e9', 'sgk', 'hsg', 'missions'].includes(activeTab)
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black shadow-md ring-2 ring-blue-300 scale-[1.02]'
                : 'bg-white/60 dark:bg-slate-800/60 hover:bg-white text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
            title="Bước 3: Luyện từ vựng SGK 3D và Ôn đề cương trọng tâm Giữa Kỳ 1"
          >
            <BookOpen className={`w-5 h-5 shrink-0 ${['vocab', 'decuong_e8', 'decuong_e7', 'decuong_e6', 'decuong_e9', 'sgk', 'hsg', 'missions'].includes(activeTab) ? 'text-amber-300' : 'text-emerald-600'}`} />
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-black truncate">VÀO HỌC</div>
              <div className="text-[10px] opacity-80 truncate hidden sm:block">Từ Vựng &amp; Đề Cương</div>
            </div>
          </button>

          {/* BƯỚC 4: KIỂM TRA THỬ */}
          <button
            type="button"
            onClick={() => {
              if (!['exam', 'quiz'].includes(activeTab)) {
                setActiveTab('exam');
              }
            }}
            className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl text-left transition-all cursor-pointer flex items-center gap-2 ${
              ['exam', 'quiz'].includes(activeTab)
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black shadow-md ring-2 ring-blue-300 scale-[1.02]'
                : 'bg-white/60 dark:bg-slate-800/60 hover:bg-white text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
            title="Bước 4: Kiểm tra nhanh 5 phút & Đề thi thử Giữa kỳ 1 chuẩn ma trận Bộ GD&ĐT"
          >
            <Award className={`w-5 h-5 shrink-0 ${['exam', 'quiz'].includes(activeTab) ? 'text-amber-300' : 'text-amber-600'}`} />
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-black truncate">KIỂM TRA THỬ</div>
              <div className="text-[10px] opacity-80 truncate hidden sm:block">5 Phút &amp; Đề GK1</div>
            </div>
          </button>

          {/* BƯỚC 5: THỐNG KÊ XEM ĐIỂM */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('leaderboard');
              setCompetitionSubTab('all');
            }}
            className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl text-left transition-all cursor-pointer flex items-center gap-2 ${
              ['teams', 'leaderboard', 'tracking'].includes(activeTab)
                ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black shadow-md ring-2 ring-amber-300 scale-[1.02]'
                : 'bg-white/60 dark:bg-slate-800/60 hover:bg-white text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
            title="Bước 5: Thống kê xem điểm cá nhân, theo lớp, theo khối, toàn trường và danh sách chưa đăng nhập"
          >
            <Trophy className={`w-5 h-5 shrink-0 ${['teams', 'leaderboard', 'tracking'].includes(activeTab) ? 'text-slate-950' : 'text-amber-600'}`} />
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-black truncate">THỐNG KÊ ĐIỂM</div>
              <div className="text-[10px] opacity-80 truncate hidden sm:block">Điểm &amp; Xếp Hạng</div>
            </div>
          </button>
        </div>

        {/* Nút tiện ích phụ: Tài Liệu Tải Về & Hỏi Thầy */}
        <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
          <button
            type="button"
            onClick={() => setActiveTab('downloads')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              activeTab === 'downloads'
                ? 'bg-blue-600 text-white font-black'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tài Liệu</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('forum')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
              ['forum', 'messages'].includes(activeTab)
                ? 'bg-blue-600 text-white font-black'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Hỏi Thầy</span>
          </button>
        </div>
      </div>

      {/* THANH ĐIỀU HƯỚNG CON CHO BƯỚC 3: VÀO HỌC */}
      {['vocab', 'decuong_e8', 'decuong_e7', 'decuong_e6', 'decuong_e9', 'sgk', 'hsg', 'missions'].includes(activeTab) && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 sm:p-2 mb-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs text-xs sm:text-sm font-bold">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-500 font-bold px-1 hidden sm:inline">Nội dung học:</span>
            <button
              type="button"
              onClick={() => setActiveTab('vocab')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                activeTab === 'vocab'
                  ? 'bg-blue-600 text-white font-black shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50'
              }`}
            >
              <span>📘 1. Luyện Từ Vựng SGK 3D</span>
            </button>

            {(!currentStudent || currentStudent.grade === 6) && (
              <button
                type="button"
                onClick={() => setActiveTab('decuong_e6')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                  activeTab === 'decuong_e6'
                    ? 'bg-teal-600 text-white font-black shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-50'
                }`}
              >
                <span>📖 2. Đề Cương GK1 Anh 6</span>
              </button>
            )}

            {(!currentStudent || currentStudent.grade === 7) && (
              <button
                type="button"
                onClick={() => setActiveTab('decuong_e7')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                  activeTab === 'decuong_e7'
                    ? 'bg-amber-600 text-white font-black shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-50'
                }`}
              >
                <span>📖 2. Đề Cương GK1 Anh 7</span>
              </button>
            )}

            {(!currentStudent || currentStudent.grade === 8) && (
              <button
                type="button"
                onClick={() => setActiveTab('decuong_e8')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                  activeTab === 'decuong_e8'
                    ? 'bg-indigo-600 text-white font-black shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50'
                }`}
              >
                <span>📖 2. Đề Cương GK1 Anh 8</span>
              </button>
            )}

            {(!currentStudent || currentStudent.grade === 9) && (
              <button
                type="button"
                onClick={() => setActiveTab('decuong_e9')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                  activeTab === 'decuong_e9'
                    ? 'bg-purple-600 text-white font-black shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50'
                }`}
              >
                <span>📖 2. Đề Cương GK1 Anh 9</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab('sgk')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                activeTab === 'sgk'
                  ? 'bg-blue-600 text-white font-black shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50'
              }`}
            >
              <span>📘 3. Bài Tập SGK</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('hsg')}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                activeTab === 'hsg'
                  ? 'bg-purple-600 text-white font-black shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50'
              }`}
            >
              <span>🏆 4. Ôn Thi HSG</span>
            </button>
          </div>

          {activeTab === 'vocab' && (
            <button
              type="button"
              onClick={() => setIsIpaModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-1 cursor-pointer shadow-xs shrink-0"
            >
              <span>🗣️ Bảng Âm IPA</span>
            </button>
          )}
        </div>
      )}

      {/* THANH ĐIỀU HƯỚNG CON CHO BƯỚC 4: KIỂM TRA THỬ */}
      {['exam', 'quiz'].includes(activeTab) && (
        <div className="flex flex-wrap items-center gap-2 p-1.5 sm:p-2 mb-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs text-xs sm:text-sm font-bold">
          <span className="text-slate-500 font-bold px-1 hidden sm:inline">Chế độ kiểm tra:</span>
          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>⏱️ 1. Kiểm Tra Nhanh 5 Phút (Khởi Động)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('exam')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'exam'
                ? 'bg-blue-600 text-white font-black shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>📝 2. Đề Thi Thử Giữa Kỳ 1 (Bấm Giờ &amp; Tự Chấm Điểm Chuẩn)</span>
          </button>
        </div>
      )}

      {/* THANH ĐIỀU HƯỚNG CON CHO BƯỚC 5: THỐNG KÊ XEM ĐIỂM */}
      {['teams', 'leaderboard', 'tracking'].includes(activeTab) && (
        <div className="flex flex-wrap items-center gap-2 p-1.5 sm:p-2 mb-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xs text-xs sm:text-sm font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('leaderboard');
              setCompetitionSubTab('all');
            }}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'leaderboard'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-50'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-slate-950" />
            <span>🏆 1. Bảng Tổng Hợp Điểm (Toàn Trường, Khối, Lớp, DS Chưa Đăng Nhập)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('teams');
              setCompetitionSubTab('teams');
            }}
            className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'teams'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50'
            }`}
          >
            <span>⚔️ 2. Đua Top 4 Tổ Thi Đua Trong Lớp</span>
          </button>
        </div>
      )}

      {/* NHẮC NHỞ NHẸ NẾU HỌC SINH ĐANG Ở BƯỚC 3 HOẶC BƯỚC 4 MÀ CHƯA ĐĂNG NHẬP */}
      {!currentStudent && ['vocab', 'decuong_e8', 'decuong_e7', 'decuong_e6', 'decuong_e9', 'sgk', 'exam', 'quiz', 'hsg'].includes(activeTab) && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-900 dark:text-amber-200 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">💡</span>
            <span>
              <strong>Lưu ý:</strong> Em chưa đăng nhập ở <strong>BƯỚC 1</strong> (phía trên). Hãy chọn Lớp &amp; Tên để hệ thống tự động cộng +30đ và lưu kết quả bài làm cho em nhé!
            </span>
          </div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition cursor-pointer shrink-0 self-end sm:self-center"
          >
            ⬆️ Lên Bước 1 Đăng Nhập
          </button>
        </div>
      )}
      {/* ==================== PHÂN HỆ 1: HỌC TỪ VỰNG TIẾNG ANH 6 - 12 ==================== */}

      {/* ==================== PHÂN HỆ 1: TỔNG HỢP HỌC TỪ VỰNG SIÊU TRÍ NHỚ (TỰ ĐỘNG KHÓA ĐÚNG KHỐI LỚP) ==================== */}

      {activeTab === 'vocab' && (

        <UnifiedVocabPortal

          currentStudent={currentStudent}

          onRewardMerit={(reason, pts) => {
            if (currentStudent) {
              // Điểm đã được ghi nhận chuẩn xác 1 lần bên trong UnifiedVocabPortal,
              // ở đây chỉ cập nhật state hiển thị để học sinh thấy điểm mới
              const fresh = studentGradebookService.getStudents().find(s => s.id === currentStudent.id);
              if (fresh) setCurrentStudent({ ...fresh });
            }
          }}

          onOpenIpaModal={() => setIsIpaModalOpen(true)}

        />

      )}



      {/* ==================== PHÂN HỆ ĐỀ CƯƠNG ÔN TẬP GIỮA KỲ 1 TIẾNG ANH 8 ==================== */}

      {(!currentStudent || currentStudent.grade === 8) && activeTab === 'decuong_e8' && (

        <English8RevisionPortal

          student={currentStudent}

          onGoToExam={() => setActiveTab('exam')}

          onGoToVocab={() => setActiveTab('vocab')}

          onCompleteSection={(secTitle, pts) => {
            if (!currentStudent) return;
            studentGradebookService.recordPracticeMerit(currentStudent.id, secTitle, pts);

            const fresh = studentGradebookService.getStudents().find(s => s.id === currentStudent.id);

            if (fresh) setCurrentStudent({ ...fresh });

          }}

        />

      )}



      {/* ==================== PHÂN HỆ ĐỀ CƯƠNG ÔN TẬP GIỮA KỲ 1 TIẾNG ANH 6 ==================== */}

      {(!currentStudent || currentStudent.grade === 6) && activeTab === 'decuong_e6' && (

        <English6RevisionPortal

          student={currentStudent}

          onGoToExam={() => setActiveTab('exam')}

          onGoToVocab={() => setActiveTab('vocab')}

          onCompleteSection={(secTitle, pts) => {
            if (!currentStudent) return;
            studentGradebookService.recordPracticeMerit(currentStudent.id, secTitle, pts);

            const fresh = studentGradebookService.getStudents().find(s => s.id === currentStudent.id);

            if (fresh) setCurrentStudent({ ...fresh });

          }}

        />

      )}

      {/* ==================== PHÂN HỆ ĐỀ CƯƠNG ÔN TẬP GIỮA KỲ 1 TIẾNG ANH 7 ==================== */}

      {(!currentStudent || currentStudent.grade === 7) && activeTab === 'decuong_e7' && (

        <English7RevisionPortal

          student={currentStudent}

          onGoToExam={() => setActiveTab('exam')}

          onGoToVocab={() => setActiveTab('vocab')}

          onCompleteSection={(secTitle, pts) => {
            if (!currentStudent) return;
            studentGradebookService.recordPracticeMerit(currentStudent.id, secTitle, pts);

            const fresh = studentGradebookService.getStudents().find(s => s.id === currentStudent.id);

            if (fresh) setCurrentStudent({ ...fresh });

          }}

        />

      )}

      {/* ==================== PHÂN HỆ ĐỀ CƯƠNG ÔN TẬP GIỮA KỲ 1 TIẾNG ANH 9 ==================== */}

      {(!currentStudent || currentStudent.grade === 9) && activeTab === 'decuong_e9' && (

        <English9RevisionPortal

          student={currentStudent}

          onGoToExam={() => setActiveTab('exam')}

          onGoToVocab={() => setActiveTab('vocab')}

          onCompleteSection={(secTitle, pts) => {
            if (!currentStudent) return;
            studentGradebookService.recordPracticeMerit(currentStudent.id, secTitle, pts);

            const fresh = studentGradebookService.getStudents().find(s => s.id === currentStudent.id);

            if (fresh) setCurrentStudent({ ...fresh });

          }}

        />

      )}



      {/* ==================== PHÂN HỆ 2: BÀI TẬP SGK TỪNG PHẦN ==================== */}

      {activeTab === 'sgk' && (

        <TextbookExercisePortal studentGrade={currentStudent?.grade} />

      )}



      {/* ==================== PHÂN HỆ MỚI: ĐỀ KIỂM TRA GIỮA KỲ & CUỐI KỲ ONLINE (10 ĐỀ HOÁN ĐỔI) ==================== */}

      {activeTab === 'exam' && (

        <div className="space-y-4">

          {(!currentStudent || currentStudent.grade === 8) && (

            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-4 sm:p-5 rounded-3xl text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-2 border-emerald-400/40">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-2xl bg-white text-emerald-800 flex items-center justify-center font-black text-xl shadow-sm shrink-0">

                  📖

                </div>

                <div>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-100 text-[10px] font-black uppercase tracking-wider border border-emerald-300/30">

                    Khuyên Dùng Trước Khi Làm Đề Kiểm Tra

                  </div>

                  <h4 className="text-base sm:text-lg font-black text-white">

                    Đề Cương Ôn Tập Giữa Kỳ 1 Tiếng Anh 8 (Kèm Audio & Tự Chấm Điểm)

                  </h4>

                  <p className="text-xs text-emerald-100/90">

                    42 câu hỏi trọng tâm bám sát ma trận & đặc tả, kèm file nghe Part 1 & Part 2 và giải thích chi tiết.

                  </p>

                </div>

              </div>

              <button

                type="button"

                onClick={() => {
                  const g = currentStudent?.grade || 8;
                  setActiveTab(g === 6 ? 'decuong_e6' : g === 7 ? 'decuong_e7' : g === 8 ? 'decuong_e8' : 'decuong_e9');
                }}

                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-md transition shrink-0 cursor-pointer flex items-center gap-1.5"

              >

                <Sparkles className="w-4 h-4 text-slate-900" />

                <span>Vào Ôn Đề Cương Ngay</span>

              </button>

            </div>

          )}

          <OnlineExamPortal studentGrade={currentStudent?.grade || (currentStudent?.className ? (parseInt(currentStudent.className.match(/^\d{1,2}/)?.[0] || '8', 10)) : 8)} onGoToLeaderboard={() => setActiveTab('leaderboard')} />

        </div>

      )}



      {/* ==================== PHÂN HỆ 3: KIỂM TRA ONLINE ==================== */}

      {activeTab === 'quiz' && (

        <OnlineQuizPortal studentGrade={currentStudent?.grade} />

      )}



      {/* ==================== PHÂN HỆ THI ĐUA & THỐNG KÊ (HỢP NHẤT TOÀN TRƯỜNG, THEO KHỐI, THEO LỚP & 4 TỔ) ==================== */}

      {['teams', 'leaderboard', 'tracking'].includes(activeTab) && (
        competitionSubTab === 'teams' ? (
          <ClassTeamBattleView
            currentStudent={currentStudent}
            isAdmin={Boolean(isAdminUnlocked || systemMaintenanceService.isAdminSession() || systemMaintenanceService.isSessionAuthenticated())}
            onGoToVocab={() => setActiveTab('vocab')}
            onGoToExam={() => setActiveTab('exam')}
          />
        ) : (
          <UnifiedStudentStatsLeaderboard 
            defaultClassId={currentStudent?.classId}
            defaultGrade={currentStudent?.grade}
            defaultClassName={currentStudent?.className}
            initialScope={competitionSubTab}
            isAdmin={isAdminUnlocked || systemMaintenanceService.isSessionAuthenticated()}
            onStartExercise={() => setActiveTab('sgk')}
            onStartQuiz={() => setActiveTab('quiz')}
            onStartExam={() => setActiveTab('exam')}
            onStartVocab={() => setActiveTab('vocab')}
            onGoToTeams={() => setCompetitionSubTab('teams')}
          />
        )
      )}

      {/* ==================== PHÂN HỆ 4: TẢI ĐỀ KIỂM TRA & TÀI LIỆU ==================== */}

      {activeTab === 'downloads' && (

        <div className="space-y-4">

          {/* Header Kho tài liệu + Nút Admin Upload */}

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">

            <div>

              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">

                <BookMarked className="w-5 h-5 text-blue-600" />

                <span>Kho Đề Kiểm Tra & Tài Liệu Dành Cho Giáo Viên & Học Sinh</span>

              </h3>

              <p className="text-xs text-slate-500">Giáo viên và học sinh tải về miễn phí. Admin có quyền tải lên và xóa tài liệu.</p>

            </div>



            {/* Khu vực đưa tài liệu lên (Dành cho Admin) */}

            <div className="flex items-center gap-2">

              {isAdminUnlocked && (

                <button

                  type="button"

                  onClick={() => {

                    setAdminUploadTitle('');

                    setAdminUploadDesc('');

                    setAdminUploadFile(null);

                    setAdminUploadError('');

                    setShowAdminUploadModal(true);

                  }}

                  className="cursor-pointer px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black shadow-sm transition flex items-center gap-1.5"

                  title="Mở hộp thoại tải tài liệu mới lên cho học sinh toàn trường"

                >

                  <Upload className="w-4 h-4" />

                  <span>Đưa Tài Liệu Lên (Admin)</span>

                </button>

              )}

            </div>

          </div>



          {/* Thông báo tự động lọc tài liệu theo khối lớp */}

          {currentStudent && (

            <div className="p-3 bg-blue-50/80 dark:bg-slate-800/80 rounded-2xl border border-blue-200 dark:border-slate-700 flex items-center gap-2.5 text-xs text-blue-900 dark:text-blue-200 font-bold">

              <span className="p-1 rounded-lg bg-blue-600 text-white text-xs">🎯</span>

              <span>Đang tự động hiển thị tài liệu &amp; đề kiểm tra phù hợp riêng cho <strong>Lớp {currentStudent.grade} ({currentStudent.className})</strong> để em dễ tìm bài nhất.</span>

            </div>

          )}



          {/* Danh sách tệp tin */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* 1. Các tệp từ Document Storage Service (Admin tải lên hoặc mặc định) */}

            {displayDocList.map(item => (

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

            {displayDocList.length === 0 && displayMaterials.map(item => (

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



          {/* Modal Đăng Nhập Quyền Admin (Tên: Admin, MK: Thaythanh2026@) */}

          {showAdminLoginModal && (

            <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">

              <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative animate-in zoom-in-95 duration-150">

                <button

                  onClick={() => setShowAdminLoginModal(false)}

                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"

                >

                  <XCircle className="w-5 h-5" />

                </button>



                <div className="flex items-center gap-3 mb-5">

                  <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-500/20">

                    <ShieldCheck className="w-6 h-6 text-amber-300" />

                  </div>

                  <div>

                    <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">

                      Đăng Nhập Quản Trị Viên (Admin)

                    </h4>

                    <p className="text-xs text-slate-500">

                      Chỉ dành cho Tác giả Thầy Đinh Thành ({BRAND.phone})

                    </p>

                  </div>

                </div>



                <form onSubmit={handleAdminVerify} className="space-y-4">

                  <div>

                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">

                      Tên đăng nhập Admin:

                    </label>

                    <input

                      type="text"

                      required

                      value={adminInputUser}

                      onChange={(e) => setAdminInputUser(e.target.value)}

                      placeholder="Nhập tên đăng nhập (Admin)..."

                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 outline-hidden font-bold"

                      autoFocus

                    />

                  </div>



                  <div>

                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">

                      Mật khẩu Quản trị:

                    </label>

                    <input

                      type="password"

                      required

                      value={adminInputPass}

                      onChange={(e) => setAdminInputPass(e.target.value)}

                      placeholder="Nhập mật khẩu Admin..."

                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 outline-hidden font-mono"

                    />

                    {adminLoginError && (

                      <p className="mt-2 text-xs text-rose-500 font-bold flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60">

                        <AlertCircle className="w-4 h-4 shrink-0" />

                        <span>{adminLoginError}</span>

                      </p>

                    )}

                  </div>



                  <div className="flex items-center justify-end gap-2 pt-2">

                    <button

                      type="button"

                      onClick={() => setShowAdminLoginModal(false)}

                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"

                    >

                      Hủy bỏ

                    </button>

                    <button

                      type="submit"

                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black shadow-md transition cursor-pointer flex items-center gap-1.5"

                    >

                      <Lock className="w-3.5 h-3.5" />

                      <span>Đăng Nhập Quản Trị</span>

                    </button>

                  </div>

                </form>

              </div>

            </div>

          )}

          {/* Modal Admin Tải Tài Liệu Lên Cho Học Sinh */}

          {showAdminUploadModal && (

            <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">

              <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-150">

                <button

                  type="button"

                  onClick={() => setShowAdminUploadModal(false)}

                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"

                >

                  <XCircle className="w-5 h-5" />

                </button>



                <div className="flex items-center gap-3 mb-4">

                  <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">

                    <Upload className="w-5 h-5" />

                  </div>

                  <div>

                    <h4 className="text-base font-black text-slate-900 dark:text-white">

                      Admin Tải Tài Liệu Cho Học Sinh

                    </h4>

                    <p className="text-xs text-slate-500">

                      Tài liệu sẽ xuất hiện ngay trong kho để học sinh toàn trường tải về

                    </p>

                  </div>

                </div>



                <form onSubmit={handleAdminSubmitDoc} className="space-y-3.5 text-xs">

                  <div>

                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">

                      📄 Chọn Tệp Tài Liệu (*):

                    </label>

                    <input

                      type="file"

                      required

                      onChange={(e) => {

                        const file = e.target.files?.[0] || null;

                        setAdminUploadFile(file);

                        if (file && !adminUploadTitle) {

                          setAdminUploadTitle(file.name.replace(/\.[^/.]+$/, ''));

                        }

                      }}

                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white cursor-pointer"

                    />

                  </div>



                  <div>

                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">

                      📌 Tiêu đề hiển thị (*):

                    </label>

                    <input

                      type="text"

                      required

                      value={adminUploadTitle}

                      onChange={(e) => setAdminUploadTitle(e.target.value)}

                      placeholder="VD: Đề cương ôn tập HK1 Tiếng Anh 7, Bảng động từ bất quy tắc..."

                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"

                    />

                  </div>



                  <div className="grid grid-cols-2 gap-3">

                    <div>

                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">

                        Khối Lớp:

                      </label>

                      <select

                        value={adminUploadGrade}

                        onChange={(e) => setAdminUploadGrade(e.target.value)}

                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"

                      >

                        <option value="all">Toàn trường (Lớp 6 - 12)</option>

                        <option value="6">Lớp 6</option>

                        <option value="7">Lớp 7</option>

                        <option value="8">Lớp 8</option>

                        <option value="9">Lớp 9</option>

                        <option value="10">Lớp 10</option>

                        <option value="11">Lớp 11</option>

                        <option value="12">Lớp 12</option>

                      </select>

                    </div>



                    <div>

                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">

                        Môn Học / Chuyên Mục:

                      </label>

                      <select

                        value={adminUploadSubject}

                        onChange={(e) => setAdminUploadSubject(e.target.value)}

                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"

                      >

                        <option value="Tiếng Anh">Tiếng Anh</option>

                        <option value="Toán học">Toán học</option>

                        <option value="Ngữ văn">Ngữ văn</option>

                        <option value="KHTN">KHTN (Lý - Hóa - Sinh)</option>

                        <option value="Lịch sử & Địa lí">Lịch sử & Địa lí</option>

                        <option value="Tin học">Tin học</option>

                        <option value="Tổng hợp">Tài liệu tổng hợp</option>

                      </select>

                    </div>

                  </div>



                  <div>

                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">

                      📝 Mô tả ngắn / Hướng dẫn học sinh:

                    </label>

                    <textarea

                      rows={2}

                      value={adminUploadDesc}

                      onChange={(e) => setAdminUploadDesc(e.target.value)}

                      placeholder="Hướng dẫn học sinh cách ôn tập, dạng bài trọng tâm..."

                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"

                    />

                  </div>



                  {adminUploadError && (

                    <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 text-rose-700 dark:text-rose-300 font-bold flex items-center gap-2">

                      <AlertCircle className="w-4 h-4 shrink-0" />

                      <span>{adminUploadError}</span>

                    </div>

                  )}



                  <div className="pt-2 flex items-center justify-end gap-2">

                    <button

                      type="button"

                      onClick={() => setShowAdminUploadModal(false)}

                      className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold cursor-pointer"

                    >

                      Hủy bỏ

                    </button>

                    <button

                      type="submit"

                      disabled={isUploadingDoc}

                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"

                    >

                      <Upload className="w-4 h-4" />

                      <span>{isUploadingDoc ? 'Đang lưu tệp...' : 'Tải Lên Kho Tài Liệu'}</span>

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



      {/* ==================== PHÂN HỆ 6: DIỄN ĐÀN HỌC SINH (FORUM & CHAT ĐĂNG ẢNH) ==================== */}

      {activeTab === 'forum' && (

        <StudentForumView

          currentStudent={currentStudent}

          isAdmin={isAdminUnlocked}

          onRequestAuth={() => {

            setAuthActiveTab('login');

            setShowAuthModal(true);

          }}

          onRequestAdminLogin={() => {

            setShowAdminLoginModal(true);

          }}

        />

      )}



      {/* ==================== PHÂN HỆ 8: NHẮN TIN CHO THẦY THÀNH ==================== */}

      {activeTab === 'messages' && (

        <StudentMessageAdminView

          currentStudent={currentStudent}

          isAdmin={isAdminUnlocked}

          onRequestAuth={() => {

            setAuthActiveTab('login');

            setShowAuthModal(true);

          }}

          onRequestAdminLogin={() => {

            setShowAdminLoginModal(true);

          }}

        />

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

            <div className="flex items-center gap-3 mb-3">

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center font-black shadow-md text-xl">

                🎓

              </div>

              <div>

                <div className="flex items-center gap-1.5 flex-wrap">

                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">

                    ĐĂNG NHẬP HỌC MIỄN PHÍ

                  </h3>

                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">

                    MIỄN PHÍ 100%

                  </span>

                </div>

                <p className="text-xs text-slate-500">

                  Trường THCS Đồng Yên • Nền tảng học tập phi lợi nhuận của Thầy Đinh Thành

                </p>

              </div>

            </div>



            {/* BANNER CAM KẾT MIỄN PHÍ 100% */}

            <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-blue-500/15 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200 text-xs flex items-start gap-2.5 mb-3.5">

              <span className="text-base shrink-0">🎁</span>

              <p className="leading-relaxed text-[11px] sm:text-xs">

                <strong>CAM KẾT SƯ PHẠM:</strong> Toàn bộ ứng dụng ôn tập & kiểm tra trực tuyến do Thầy giáo Đinh Văn Thành xây dựng phi lợi nhuận, hoàn toàn <strong>MIỄN PHÍ 100%</strong> cho học sinh. Nhà trường, phụ huynh và học sinh hoàn toàn yên tâm ôn luyện, tuyệt đối không thu học phí hay bất kỳ lệ phí nào.

              </p>

            </div>



            {/* TAB CHUYỂN ĐỔI 2 TRONG 1: ĐĂNG NHẬP | QUÊN MK (KHÔNG CẦN ĐĂNG KÝ) */}

            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4 border border-slate-200 dark:border-slate-700">

              <button

                type="button"

                onClick={() => setAuthActiveTab('login')}

                className={`py-2.5 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${

                  authActiveTab === 'login'

                    ? 'bg-blue-600 text-white shadow-sm'

                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'

                }`}

              >

                <span>🔑 ĐĂNG NHẬP HỌC MIỄN PHÍ</span>

              </button>



              <button

                type="button"

                onClick={() => setAuthActiveTab('forgot')}

                className={`py-2.5 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${

                  authActiveTab === 'forgot'

                    ? 'bg-amber-500 text-slate-950 shadow-sm font-black'

                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'

                }`}

              >

                <span>🆘 Quên MK / Tra Cứu</span>

              </button>

            </div>



            {/* ================= TAB 1: FORM ĐĂNG KÝ HỌC SINH MỚI ================= */}

            {authActiveTab === 'login' && (

              <form onSubmit={handleStudentLogin} className="space-y-3.5 text-xs">

                {/* 1. CHỌN LỚP HỌC CỦA THẦY THÀNH */}

                <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-slate-800/60 border border-blue-200 dark:border-slate-700 space-y-2">

                  <div className="flex items-center justify-between">

                    <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">

                      <span>🏫</span>

                      <span>1. Chọn Lớp Học Của Em:</span>

                    </label>

                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">

                      Lớp đang chọn: {regClassName}

                    </span>

                  </div>

                  

                  {/* Khối 8 */}

                  {/* Khối 9 */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Khối 9 (Cô Hoàng Thị Vươn):</div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {['9A1', '9A2', '9A3', '9A4'].map(cls => (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => {
                            setRegClassName(cls);
                            setRegGrade(9);
                            setLoginStudentInput('');
                            setLoginError('');
                          }}
                          className={`py-1.5 px-1 rounded-xl text-xs font-black transition cursor-pointer border ${
                            regClassName === cls
                              ? 'bg-purple-600 text-white border-purple-500 shadow-sm ring-2 ring-purple-300 dark:ring-purple-800 scale-102'
                              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-purple-100'
                          }`}
                        >
                          {cls}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Khối 8 */}
                  <div className="space-y-1 pt-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Khối 8 (Thầy Đinh Thành):</div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {['8A1', '8A2', '8A3', '8A4', '8A5'].map(cls => (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => {
                            setRegClassName(cls);
                            setRegGrade(8);
                            setLoginStudentInput('');
                            setLoginError('');
                          }}
                          className={`py-1.5 px-1 rounded-xl text-xs font-black transition cursor-pointer border ${
                            regClassName === cls
                              ? 'bg-blue-600 text-white border-blue-500 shadow-sm ring-2 ring-blue-300 dark:ring-blue-800 scale-102'
                              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-blue-100'
                          }`}
                        >
                          {cls}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Khối 7 */}
                  <div className="space-y-1 pt-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Khối 7 (Cô Hoàng Thị Vươn):</div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {['7A1', '7A2', '7A3', '7A4', '7A5'].map(cls => (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => {
                            setRegClassName(cls);
                            setRegGrade(7);
                            setLoginStudentInput('');
                            setLoginError('');
                          }}
                          className={`py-1.5 px-1 rounded-xl text-xs font-black transition cursor-pointer border ${
                            regClassName === cls
                              ? 'bg-amber-600 text-white border-amber-500 shadow-sm ring-2 ring-amber-300 dark:ring-amber-800 scale-102'
                              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-amber-100'
                          }`}
                        >
                          {cls}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Khối 6 */}
                  <div className="space-y-1 pt-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Khối 6 (Thầy Đinh Thành):</div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {['6A1', '6A2', '6A3', '6A4', '6A5'].map(cls => (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => {
                            setRegClassName(cls);
                            setRegGrade(6);
                            setLoginStudentInput('');
                            setLoginError('');
                          }}
                          className={`py-1.5 px-1 rounded-xl text-xs font-black transition cursor-pointer border ${
                            regClassName === cls
                              ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm ring-2 ring-emerald-300 dark:ring-emerald-800 scale-102'
                              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-emerald-100'
                          }`}
                        >
                          {cls}
                        </button>
                      ))}
                    </div>
                  </div>



                  {/* Cấp THPT (Khối 10, 11, 12 - Tự ghi tên & lớp, ghi lớp nào học lớp đó) */}

                  <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">

                    <div className="flex items-center justify-between text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase">

                      <span>🎓 Cấp THPT (Khối 10, 11, 12 - Tự do ghi tên & lớp):</span>

                      <span className="text-[9px] font-bold text-indigo-500">Ghi lớp nào học lớp đó</span>

                    </div>

                    <div className="grid grid-cols-6 gap-1.5">

                      {['10A1', '10A2', '11A1', '11A2', '12A1', '12A2'].map(cls => {

                        const g = parseInt(cls.slice(0, 2), 10);

                        return (

                          <button

                            key={cls}

                            type="button"

                            onClick={() => {

                              setRegClassName(cls);

                              setRegGrade(g);

                              setLoginStudentInput('');

                              setLoginError('');

                            }}

                            className={`py-1.5 px-1 rounded-xl text-xs font-black transition cursor-pointer border ${

                              regClassName === cls

                                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm ring-2 ring-indigo-300 dark:ring-indigo-800 scale-102'

                                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-indigo-100'

                            }`}

                          >

                            {cls}

                          </button>

                        );

                      })}

                    </div>

                  </div>



                  {/* Hoặc tự nhập tên lớp THPT */}

                  <div className="pt-1.5 flex items-center gap-2 text-xs">

                    <span className="text-slate-500 font-bold whitespace-nowrap">Hoặc tự gõ lớp:</span>

                    <input

                      type="text"

                      value={regClassName}

                      onChange={(e) => {

                        const val = e.target.value.toUpperCase();

                        setRegClassName(val);

                        const m = val.match(/^(\d{1,2})/);

                        if (m && m[1]) {

                          const g = parseInt(m[1], 10);

                          if (g >= 6 && g <= 12) setRegGrade(g);

                        }

                        setLoginError('');

                      }}

                      placeholder="VD: 10A1, 11B2, 12A3..."

                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"

                    />

                  </div>

                </div>



                {/* 2. CHỌN TÊN HỌC SINH TỪ SỔ ĐIỂM (1 CHẠM VÀO HỌC NGAY) */}

                <div>

                  <div className="flex items-center justify-between mb-1.5">

                    <label className="block font-bold text-slate-700 dark:text-slate-300">

                      👤 2. Chọn Tên Học Sinh Lớp {regClassName} (*):

                    </label>

                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">

                      {studentGradebookService.getOfficialRoster(regClassName).length} học sinh chính thức

                    </span>

                  </div>



                  {studentGradebookService.getOfficialRoster(regClassName).length > 0 && (

                    <div className="mb-2">

                      <select

                        value={loginStudentInput}

                        onChange={(e) => {

                          const val = e.target.value;

                          setLoginStudentInput(val);

                          setLoginError('');

                          if (val) {

                            handleOneTapLogin(val, regClassName);

                          }

                        }}

                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-blue-400 dark:border-blue-600 bg-blue-50/70 dark:bg-slate-800 text-blue-950 dark:text-blue-100 text-xs sm:text-sm font-black focus:ring-2 focus:ring-blue-500 outline-hidden cursor-pointer"

                      >

                        <option value="">👇 Bấm vào đây để chọn đúng Tên của em ({regClassName}) --</option>

                        {studentGradebookService.getOfficialRoster(regClassName).map((name, i) => (

                          <option key={i} value={name}>

                            {i + 1}. {name}

                          </option>

                        ))}

                      </select>

                    </div>

                  )}



                  {/* Hoặc gõ tìm kiếm họ tên */}

                  <div className="relative">

                    <input

                      type="text"

                      value={loginStudentInput}

                      onChange={(e) => {

                        setLoginStudentInput(e.target.value);

                        setLoginError('');

                      }}

                      placeholder="Hoặc gõ họ tên em vào đây (ví dụ: Thanh Bình, Đặng Gia Bảo...)"

                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-hidden font-medium"

                    />

                  </div>

                </div>



                {/* 3. MẬT KHẨU (KHÔNG BẮT BUỘC - ĐỂ TRỐNG ĐỂ VÀO HỌC NGAY) */}

                <div>

                  <div className="flex items-center justify-between mb-1">

                    <label className="block font-bold text-slate-700 dark:text-slate-300">

                      🔒 Mật khẩu (Không bắt buộc):

                    </label>

                    <span className="text-[10px] text-slate-400 font-semibold">

                      Chưa đặt mật khẩu thì để trống

                    </span>

                  </div>

                  <input

                    type="password"

                    value={loginPassInput}

                    onChange={(e) => setLoginPassInput(e.target.value)}

                    placeholder="Nhập mật khẩu (nếu đã từng đặt, hoặc để trống để vào học)..."

                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"

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

                    🆘 Quên MK / Tra cứu tài khoản

                  </button>



                  <div className="flex items-center gap-2">

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

                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center gap-1.5"

                    >

                      <span>🚀 ĐĂNG NHẬP HỌC MIỄN PHÍ</span>

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

                      placeholder="Ví dụ: 0988123456..."

                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"

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



                    <div className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-1.5 text-slate-800 dark:text-slate-200">

                      <p>👤 <strong>Họ và tên:</strong> <span className="font-bold text-blue-600 dark:text-blue-400">{recoveredStudent.name}</span></p>

                      <p>🏫 <strong>Lớp học:</strong> <span className="font-bold">{recoveredStudent.className}</span></p>

                      <p>🔑 <strong>Tên đăng nhập:</strong> <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">{recoveredStudent.username || recoveredStudent.studentCode}</span></p>

                      <p>🔒 <strong>Mật khẩu:</strong> <span className="font-mono font-bold text-slate-500 dark:text-slate-400 text-sm">•••••••• (Đã ẩn bảo mật)</span></p>

                    </div>



                    <p className="text-[11px] text-emerald-800 dark:text-emerald-300">

                      💡 Mật khẩu học sinh được bảo mật an toàn. Em hãy bấm nút dưới đây để chuyển sang ô Đăng Nhập và điền đúng Mật khẩu của mình nhé:

                    </p>



                    <button

                      type="button"

                      onClick={handleSelectRecoveredStudent}

                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"

                    >

                      <span>👉 ĐIỀN TÊN ĐĂNG NHẬP & NHẬP MẬT KHẨU ĐỂ VÀO HỌC</span>

                    </button>



                    <a

                      href="https://zalo.me/0915213717"

                      target="_blank"

                      rel="noreferrer"

                      className="w-full py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-center text-xs font-bold transition block border border-blue-200 dark:border-blue-800"

                    >

                      💬 Quên hẳn mật khẩu? Nhắn Thầy Thành (0915.213717) qua Zalo để cấp lại

                    </a>

                  </div>

                )}



                <div className="pt-2 flex items-center justify-between text-xs">

                  <button

                    type="button"

                    onClick={() => setAuthActiveTab('register')}

                    className="font-bold text-blue-600 hover:underline cursor-pointer"

                  >

                    ← Quay lại màn hình Đăng nhập

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



            {/* Link Chuyển Phân Hệ Nhanh: Dành cho GV & Admin */}

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">

              <div className="flex items-center gap-2">

                <span>Dành cho GV:</span>

                {onSwitchToTeachers && (

                  <button

                    type="button"

                    onClick={() => {

                      setShowAuthModal(false);

                      onSwitchToTeachers();

                    }}

                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"

                  >

                    <span>👨‍🏫 Sang Kho Giáo Viên</span>

                  </button>

                )}

              </div>

              <button

                type="button"

                onClick={() => {

                  setShowAuthModal(false);

                  setAdminInputUser('Admin');

                  setAdminInputPass('');

                  setAdminLoginError('');

                  setShowAdminLoginModal(true);

                }}

                className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"

              >

                <Crown className="w-3.5 h-3.5" />

                <span>👑 Đăng Nhập Admin (Thầy Thành)</span>

              </button>

            </div>

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

                  <strong>Em hãy chụp màn hình</strong> hoặc ghi nhớ lại <strong>Tên đăng nhập</strong> và <strong>Mật khẩu</strong> trên để đăng nhập học từ vựng và làm bài kiểm tra mỗi ngày nhé!

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



      {/* ==================== MODAL QUẢN LÝ & XÓA TÀI KHOẢN HỌC SINH (QUYỀN ADMIN) ==================== */}

            {/* ==================== MODAL CẬP NHẬT SỔ ĐIỂM / DANH SÁCH HỌC SINH (LỚP THẦY DẠY) ==================== */}

      {showRosterModal && (

        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">

          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto space-y-4">

            <button

              type="button"

              onClick={() => setShowRosterModal(false)}

              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"

            >

              <XCircle className="w-6 h-6" />

            </button>



            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center font-black shadow-md text-xl shrink-0">

                📋

              </div>

              <div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">

                  Cập Nhật Sổ Điểm & Danh Sách Học Sinh

                </h3>

                <p className="text-xs text-slate-500">

                  Dành riêng cho các lớp Thầy dạy • Chặn 100% tên ảo, tên vớ vẩn, sai với giáo dục

                </p>

              </div>

            </div>



            {rosterMsg && (

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold">

                {rosterMsg}

              </div>

            )}



            <form onSubmit={handleSaveRoster} className="space-y-4">

              <div>

                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">

                  🏫 Chọn Lớp Cần Cập Nhật Sổ Điểm (*):

                </label>

                <div className="flex gap-2 flex-wrap items-center">

                  {['6A1', '6A2', '6A3', '6A4', '6A5', '7A1', '7A2', '7A3', '7A4', '7A5', '8A1', '8A2', '8A3', '8A4', '8A5', '9A1', '9A2', '9A3', '9A4'].map(cls => (

                    <button

                      key={cls}

                      type="button"

                      onClick={() => setRosterClass(cls)}

                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${

                        rosterClass === cls

                          ? 'bg-emerald-600 text-white shadow-xs font-black'

                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'

                      }`}

                    >

                      {cls}

                    </button>

                  ))}

                  <input

                    type="text"

                    value={rosterClass}

                    onChange={(e) => setRosterClass(e.target.value.toUpperCase())}

                    placeholder="Hoặc gõ lớp..."

                    className="w-28 px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"

                  />

                </div>

              </div>



              <div>

                <div className="flex items-center justify-between mb-1">

                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">

                    📝 Dán Danh Sách Họ & Tên Học Sinh (*):

                  </label>

                  <span className="text-[11px] text-slate-400">Mỗi học sinh một dòng (Có thể copy từ Excel/Word)</span>

                </div>

                <textarea

                  rows={8}

                  required

                  value={rosterText}

                  onChange={(e) => setRosterText(e.target.value)}

                  placeholder={`Ví dụ copy cột Họ và tên từ Excel:\n1. Nguyễn Văn An\n2. Trần Thị Bình\n3. Hoàng Minh Châu\n4. Đinh Quốc Đạt...`}

                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-mono focus:border-emerald-600 focus:outline-hidden"

                />

              </div>



              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-1">

                <p className="font-bold text-slate-700 dark:text-slate-300">💡 Lưu ý quan trọng:</p>

                <p>• Hệ thống sẽ tự động lọc bỏ số thứ tự, chuẩn hóa chữ hoa chữ thường chuẩn mực.</p>

                <p>• Học sinh lớp này khi vào học chỉ cần bấm chọn đúng tên mình từ danh sách sổ điểm.</p>

                <p>• Riêng các lớp cấp 3 THPT, học sinh tạm thời được đăng ký tự do.</p>

              </div>



              <div className="flex justify-between items-center pt-2">

                {studentGradebookService.getOfficialRoster(rosterClass).length > 0 && (

                  <button

                    type="button"

                    onClick={() => handleClearRoster(rosterClass)}

                    className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition cursor-pointer"

                  >

                    Xóa Danh Sách Lớp {rosterClass}

                  </button>

                )}

                <div className="flex gap-2 ml-auto">

                  <button

                    type="button"

                    onClick={() => setShowRosterModal(false)}

                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"

                  >

                    Đóng

                  </button>

                  <button

                    type="submit"

                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-md shadow-emerald-500/20"

                  >

                    💾 Lưu Sổ Điểm Lớp {rosterClass}

                  </button>

                </div>

              </div>

            </form>

          </div>

        </div>

      )}



{showAdminStudentModal && isAdminUnlocked && (

        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">

          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-6 relative animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">

            {/* Header */}

            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 shrink-0">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black shadow-md text-xl shrink-0">

                  👥

                </div>

                <div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">

                    <span>Quản Lý & Xóa Tài Khoản Học Sinh</span>

                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold">

                      Quyền Admin

                    </span>

                  </h3>

                  <p className="text-xs text-slate-500">

                    Chỉ dành riêng cho Admin Thầy Đinh Thành ({BRAND.phone}) quản lý và XÓA tài khoản học sinh.

                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2">

                {onOpenAdminPortal && (

                  <button

                    type="button"

                    onClick={() => {

                      setShowAdminStudentModal(false);

                      onOpenAdminPortal();

                    }}

                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"

                    title="Mở Bảng Quản Trị Hệ Thống Toàn Diện"

                  >

                    <Crown className="w-3.5 h-3.5" />

                    <span className="hidden sm:inline">Bảng Quản Trị Hệ Thống &rarr;</span>

                    <span className="sm:hidden">Admin Portal</span>

                  </button>

                )}

                <button

                  type="button"

                  onClick={handleAdminLogout}

                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"

                  title="Đăng xuất quyền Admin"

                >

                  <LogOut className="w-3.5 h-3.5" />

                  <span>Đăng Xuất Admin</span>

                </button>

                <button

                  type="button"

                  onClick={() => setShowAdminStudentModal(false)}

                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition"

                >

                  <XCircle className="w-6 h-6" />

                </button>

              </div>

            </div>



            {/* Toolbar Tìm kiếm & Lọc Lớp */}

            <div className="py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">

              <div className="flex items-center gap-2 w-full sm:w-auto flex-1">

                <div className="relative flex-1">

                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />

                  <input

                    type="text"

                    value={adminStudentSearchQuery}

                    onChange={(e) => setAdminStudentSearchQuery(e.target.value)}

                    placeholder="Tìm theo tên học sinh, username, SĐT..."

                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-purple-500 outline-hidden font-medium"

                  />

                </div>

                <select

                  value={adminStudentFilterClass}

                  onChange={(e) => setAdminStudentFilterClass(e.target.value)}

                  className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold shrink-0"

                >

                  <option value="ALL">Tất Cả Lớp</option>

                  {Array.from(new Set(adminStudentList.map(s => s.className).filter(Boolean))).sort().map(cls => (

                    <option key={cls} value={cls}>Lớp {cls}</option>

                  ))}

                </select>

              </div>



              <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0 flex-wrap">

                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">

                  Tổng: <strong className="text-purple-600 dark:text-purple-400 text-sm">{filteredAdminStudents.length}</strong> HS

                </span>

                <button

                  type="button"

                  onClick={() => setShowStudentPasswords(!showStudentPasswords)}

                  className="px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"

                  title={showStudentPasswords ? "Ẩn mật khẩu để bảo vệ riêng tư" : "Hiện mật khẩu để hỗ trợ học sinh quên mật khẩu"}

                >

                  {showStudentPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}

                  <span>{showStudentPasswords ? 'Ẩn MK' : 'Xem MK'}</span>

                </button>

                <button

                  type="button"

                  onClick={() => {

                    const res = studentGradebookService.deduplicateAndMergeStudents();

                    setAdminStudentList(studentGradebookService.getStudents());

                    if (res.mergedCount > 0) {

                      alert(`🎉 ĐÃ RÀ SOÁT & HỢP NHẤT THÀNH CÔNG!\n\n` +

                        `• Đã phát hiện và hợp nhất: ${res.mergedCount} tài khoản trùng lặp.\n` +

                        `• Tổng số tài khoản chuẩn hiện tại: ${res.currentCount} học sinh.\n` +

                        `• Toàn bộ lịch sử điểm số bài kiểm tra cao nhất đã được bảo toàn nguyên vẹn 100%!`);

                    } else {

                      alert(`✅ RÀ SOÁT HOÀN TẤT!\n\nKhông có tài khoản nào bị trùng lặp. Tất cả ${res.currentCount} tài khoản học sinh đều chuẩn xác và duy nhất.`);

                    }

                  }}

                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"

                  title="Tự động rà soát tài khoản trùng tên/lớp hoặc SĐT để hợp nhất điểm và bài làm"

                >

                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />

                  <span className="hidden sm:inline">Rà Soát Trùng</span>

                </button>

                <button

                  type="button"

                  onClick={async () => {

                    setIsSyncingAdminStudents(true);

                    const fresh = await studentGradebookService.syncFromCloud();

                    setAdminStudentList(fresh);

                    setIsSyncingAdminStudents(false);

                  }}

                  disabled={isSyncingAdminStudents}

                  className="px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"

                >

                  <RotateCw className={`w-3.5 h-3.5 ${isSyncingAdminStudents ? 'animate-spin' : ''}`} />

                  <span>{isSyncingAdminStudents ? '...' : 'Làm Mới Cloud'}</span>

                </button>

              </div>

            </div>



            {/* Danh Sách Học Sinh */}

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[220px]">

              {filteredAdminStudents.length === 0 ? (

                <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">

                  <User className="w-8 h-8 opacity-40" />

                  <span>Không tìm thấy tài khoản học sinh nào phù hợp.</span>

                </div>

              ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                  {filteredAdminStudents.map((s, idx) => (

                    <div

                      key={s.id || idx}

                      className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition flex flex-col justify-between gap-2 shadow-xs group"

                    >

                      <div className="flex items-start justify-between gap-2">

                        <div className="flex items-center gap-2.5">

                          <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-black text-sm flex items-center justify-center shrink-0">

                            {s.gender === 'Nữ' ? '👧' : '👦'}

                          </div>

                          <div>

                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">

                              {s.name}

                            </h4>

                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">

                              <span className="font-bold text-purple-600 dark:text-purple-400">Lớp {s.className}</span>

                              <span>•</span>

                              <span className="font-mono text-[10px]">{s.studentCode}</span>

                            </div>

                          </div>

                        </div>



                        {/* NÚT XÓA TÀI KHOẢN (ADMIN) */}

                        <button

                          type="button"

                          onClick={() => handleAdminDeleteStudent(s)}

                          className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 text-xs font-black transition flex items-center gap-1 cursor-pointer shrink-0 shadow-2xs hover:scale-105 active:scale-95"

                          title="Xóa vĩnh viễn tài khoản học sinh này"

                        >

                          <Trash2 className="w-3.5 h-3.5" />

                          <span>Xóa TK</span>

                        </button>

                      </div>



                      <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 font-mono flex-wrap gap-1">

                        <div>

                          Tên ĐN: <strong className="text-blue-600 dark:text-blue-400 font-bold">{s.username || s.studentCode}</strong>

                        </div>

                        <div>

                          MK: <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded font-bold">

                            {showStudentPasswords ? (s.password || 'Mật khẩu riêng') : '••••••••'}

                          </span>

                        </div>

                        {s.parentPhone && (

                          <div className="text-[10px] text-slate-500">

                            ĐT: {s.parentPhone}

                          </div>

                        )}

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>



            {/* Footer */}

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">

              <span className="flex items-center gap-1 text-[11px]">

                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />

                <span>Thao tác xóa yêu cầu phiên Admin hợp lệ và tự động đồng bộ Cloud.</span>

              </span>

              <button

                type="button"

                onClick={() => setShowAdminStudentModal(false)}

                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer transition"

              >

                Đóng Cửa Sổ

              </button>

            </div>

          </div>

        </div>

      )}



      



      {/* =========================================================================

          MODAL CHÀO MỪNG & VINH DANH THƯỞNG ĐIỂM ĐĂNG NHẬP (KHUYẾN MẠI +10Đ HÔM NAY)

          ========================================================================= */}

      {welcomeModalData?.isOpen && (

        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">

          <div className="bg-white dark:bg-slate-900 border-2 border-amber-400 dark:border-amber-500 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative text-center animate-in zoom-in-95 duration-200">

            {/* Nút đóng góc phải */}

            <button

              type="button"

              onClick={() => setWelcomeModalData(null)}

              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition cursor-pointer"

            >

              <X className="w-4 h-4" />

            </button>



            {/* Mascot & Huy hiệu */}

            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-300 via-amber-400 to-orange-500 flex items-center justify-center text-4xl shadow-lg shadow-amber-500/30 mb-3 animate-bounce">

              {welcomeModalData.mascotEmoji || '🦉'}

            </div>



            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-xs font-black uppercase tracking-wider mb-2">

              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />

              <span>{welcomeModalData.badgeTitle || 'Chiến Binh Chăm Ngoan 🛡️'}</span>

            </div>



            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">

              CHÀO MỪNG EM {welcomeModalData.studentName.toUpperCase()}!

            </h3>

            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-0.5">

              Học sinh Lớp {welcomeModalData.studentClass}

            </p>



            {/* HỘP QUÀ TẶNG ĐIỂM RỰC RỠ */}
            <div className={`my-4 py-3.5 px-4 rounded-2xl text-white shadow-xl border ${
              welcomeModalData.hasFireworks
                ? 'bg-gradient-to-r from-rose-600 via-amber-500 to-indigo-600 border-amber-300 shadow-rose-500/30'
                : welcomeModalData.pointsAwarded === 0
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 border-blue-300/40 shadow-blue-500/25'
                  : 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 border-amber-300/50 shadow-amber-500/25'
            }`}>
              <div className="text-[11px] font-black uppercase tracking-wider text-amber-100 flex items-center justify-center gap-1.5 flex-wrap">
                {welcomeModalData.hasFireworks ? (
                  <>
                    <span>🎆🎇</span>
                    <span>ĐẶC QUYỀN PHÁO HOA: CHĂM CHỈ HỌC TẬP LIÊN TIẾP</span>
                    <span>🎇🎆</span>
                  </>
                ) : welcomeModalData.pointsAwarded === 0 ? (
                  '📚 CHÀO MỪNG EM TIẾP TỤC QUAY LẠI HỌC BÀI'
                ) : loginRewardInfo.isPromoToday ? (
                  '🎁 QUÀ TẶNG KHUYẾN MẠI DUY NHẤT HÔM NAY'
                ) : (
                  '⭐ ĐIỂM CHUYÊN CẦN ĐĂNG NHẬP (1 LẦN/NGÀY)'
                )}
              </div>

              {welcomeModalData.pointsAwarded === 0 ? (
                <div className="my-2 py-2 px-3 rounded-xl bg-blue-950/40 border border-blue-300/30 text-center">
                  <div className="text-sm sm:text-base font-black text-amber-300 flex items-center justify-center gap-1.5">
                    <span>🛡️</span>
                    <span>ĐÃ NHẬN ĐIỂM CHUYÊN CẦN HÔM NAY</span>
                  </div>
                  <div className="text-[11px] text-blue-100 font-medium mt-1">
                    (Điểm danh chuyên cần chỉ cộng 1 lần/ngày. Em hãy luyện từ vựng và làm bài thi để ghi thêm nhiều điểm thi đua nhé!)
                  </div>
                </div>
              ) : (
                <div className="text-3xl sm:text-4xl font-black tracking-tight my-1 drop-shadow-sm flex items-center justify-center gap-2">
                  <span>+{welcomeModalData.pointsAwarded} ĐIỂM</span>
                  {welcomeModalData.hasFireworks && <span className="animate-spin text-2xl">✨</span>}
                </div>
              )}

              {welcomeModalData.hasFireworks && (
                <div className="text-[11px] font-bold text-amber-100 mb-1">
                  (Bao gồm +{welcomeModalData.streakPoints || 20}đ thưởng pháo hoa học liên tiếp {loginRewardInfo.isPromoToday ? '+ 10đ quà hôm nay' : '+ 5đ chuyên cần'})
                </div>
              )}

              <div className="text-xs font-semibold text-white/95 flex items-center justify-center gap-1">
                <span>Tổng điểm thi đua hiện tại:</span>
                <span className="font-black text-yellow-200">⭐ {welcomeModalData.totalPoints}đ</span>
              </div>
            </div>







            {/* LỜI NHẮN NHỦ SƯ PHẠM CỦA THẦY THÀNH */}

            <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-slate-800/80 border border-blue-200/80 dark:border-slate-700 text-left space-y-1 mb-5">

              <div className="flex items-center gap-1.5 text-xs font-black text-blue-700 dark:text-blue-400">

                <span>👨‍🏫</span>

                <span>Thầy giáo Đinh Văn Thành nhắn nhủ:</span>

              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">

                "{welcomeModalData.cheerMessage}"

              </p>

            </div>



            {/* NÚT BẮT ĐẦU VÀO HỌC */}

            <button

              type="button"

              onClick={() => setWelcomeModalData(null)}

              className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm sm:text-base shadow-lg shadow-blue-500/30 transition cursor-pointer flex items-center justify-center gap-2 group"

            >

              <span>🚀 Em Cảm Ơn Thầy &amp; Vào Học Ngay!</span>

              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />

            </button>

          </div>

        </div>

      )}



      {/* TOAST ĂN MỪNG THƯỞNG ĐIỂM CHUYÊN CẦN HỌC THỰC TẾ (CỨ 10 PHÚT = +3Đ) */}

      {studyRewardToast && studyRewardToast.show && (

        <div className="fixed bottom-6 right-6 z-50 animate-bounce max-w-sm p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-2xl border-2 border-emerald-300 flex items-start gap-3">

          <span className="text-3xl">⏱️🎉</span>

          <div className="flex-1">

            <h4 className="font-black text-sm uppercase tracking-wide text-amber-200">

              Cộng Điểm Chuyên Cần Thực Tế!

            </h4>

            <p className="text-xs mt-0.5 text-white/95 leading-relaxed">

              Chúc mừng em đã tích cực học tập thực tế đủ <strong>{studyRewardToast.minutes} phút</strong>!

            </p>

            <div className="mt-1 text-xs font-black text-amber-300 flex items-center gap-1">

              <span>⭐ Thưởng nóng: +{studyRewardToast.points} điểm thi đua!</span>

            </div>

            <p className="text-[10px] text-emerald-100 mt-0.5 italic">

              (Cứ 10 phút tương tác học thực tế em sẽ tiếp tục nhận +3đ)

            </p>

          </div>

          <button

            type="button"

            onClick={() => setStudyRewardToast(null)}

            className="text-white/80 hover:text-white p-1 cursor-pointer"

          >

            <X className="w-4 h-4" />

          </button>

        </div>

      )}



      {/* MODAL GIẢI THÍCH QUY CHẾ CHUYÊN CẦN HỌC THỰC TẾ & CHỐNG TREO MÁY */}

      {showStudyRulesModal && (

        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl relative text-slate-800 dark:text-slate-100 space-y-4">

            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">

              <div className="flex items-center gap-2">

                <span className="text-2xl">⏱️</span>

                <div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">

                    Quy Chế Tính Giờ Chuyên Cần Học Thực Tế

                  </h3>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">

                    Hệ thống tự động đo lường tương tác &amp; Chống gian lận treo máy

                  </p>

                </div>

              </div>

              <button

                type="button"

                onClick={() => setShowStudyRulesModal(false)}

                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"

              >

                <X className="w-5 h-5" />

              </button>

            </div>



            <div className="space-y-3 text-xs sm:text-sm">

              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">

                <span className="text-xl shrink-0">🎁</span>

                <div>

                  <div className="font-black text-emerald-800 dark:text-emerald-300">

                    Cứ 10 phút tương tác học thực tế = +3 điểm thi đua

                  </div>

                  <div className="text-emerald-700/90 dark:text-emerald-400/90 text-xs mt-0.5 leading-relaxed">

                    Hệ thống tích lũy số phút học thực tế của em. Cứ khi đủ 10 phút cộng dồn (10p, 20p, 30p, 40p...), em sẽ lập tức được cộng <strong>+3 điểm thi đua</strong> vào tổng điểm cá nhân!

                  </div>

                </div>

              </div>



              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">

                <span className="text-xl shrink-0">🛡️</span>

                <div>

                  <div className="font-black text-amber-800 dark:text-amber-300">

                    Cơ chế chống treo máy tuyệt đối (Anti-Idle &amp; Anti-Afk)

                  </div>

                  <div className="text-amber-700/90 dark:text-amber-400/90 text-xs mt-0.5 leading-relaxed">

                    Đồng hồ tính giờ chỉ chạy khi em <strong>thực sự có tương tác</strong> (lật thẻ từ vựng 3D, nghe phát âm, làm bài tập trắc nghiệm, giải đề cương, làm bài kiểm tra online, thảo luận...).

                  </div>

                  <ul className="list-disc list-inside text-[11px] text-amber-800 dark:text-amber-300/90 mt-1.5 space-y-0.5 font-medium">

                    <li>Nếu không có thao tác chuột/phím/chạm cảm ứng quá <strong>60 giây</strong>, đồng hồ sẽ <strong>tự động tạm dừng</strong>.</li>

                    <li>Nếu em <strong>chuyển sang tab khác</strong> hoặc thu nhỏ trình duyệt, đồng hồ cũng <strong>lập tức ngừng đếm</strong>.</li>

                  </ul>

                </div>

              </div>



              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-start gap-3">

                <span className="text-xl shrink-0">📊</span>

                <div>

                  <div className="font-black text-blue-800 dark:text-blue-300">

                    Công khai, minh bạch &amp; Thi đua công bằng

                  </div>

                  <div className="text-blue-700/90 dark:text-blue-400/90 text-xs mt-0.5 leading-relaxed">

                    Điểm thi đua được lưu lại trong Sổ điểm điện tử, Bảng Vàng và Bảng Thi Đua Toàn Trường để Thầy Cô và bạn bè cùng dõi theo và biểu dương thành tích chăm chỉ của em!

                  </div>

                </div>

              </div>

            </div>



            <div className="pt-2">

              <button

                type="button"

                onClick={() => setShowStudyRulesModal(false)}

                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition cursor-pointer"

              >

                Đã Hiểu - Em Tiếp Tục Học Bài!

              </button>

            </div>

          </div>

        </div>

      )}



      {/* =========================================================================

          MODAL: HỘP QUÀ MAY MẮN & LỜI CHÚC TRUYỀN CẢM HỨNG CỦA THẦY ĐINH THÀNH

          ========================================================================= */}

      {showLuckyBoxModal && luckyBoxResult && (

        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">

          <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-3xl max-w-md w-full p-6 border-2 border-amber-400/50 shadow-2xl space-y-4 text-center relative overflow-hidden">

            <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />



            <div className="relative inline-block my-2">

              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 p-1 shadow-2xl flex items-center justify-center text-4xl ring-4 ring-amber-400/30 animate-bounce">

                🎁

              </div>

              <span className="absolute -top-2 -right-2 text-2xl animate-spin">✨</span>

            </div>



            <div>

              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-black uppercase tracking-wider border border-amber-400/40">

                <span>⭐ Hộp Quà May Mắn Thầy Đinh Thành</span>

              </span>

              <h3 className="text-xl font-black text-white mt-2">

                {luckyBoxResult.alreadyOpenedToday 

                  ? 'Quà May Mắn Của Em Hôm Nay' 

                  : 'Chúc Mừng Em Đã Mở Hộp Quà!'}

              </h3>

              <p className="text-xs text-amber-200/90 font-medium mt-1">

                Dành tặng riêng cho học sinh: <strong className="text-white underline">{luckyBoxResult.studentName}</strong> (Lớp {luckyBoxResult.className})

              </p>

            </div>



            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-orange-500/20 border-2 border-amber-400/50 text-center shadow-inner">

              <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider block">

                Điểm Thưởng Thi Đua Nhận Được:

              </span>

              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 my-1 drop-shadow-md">

                +{luckyBoxResult.pointsWon} ĐIỂM

              </div>

              <span className="text-[11px] text-emerald-300 font-bold block">

                ⭐ Tổng điểm mới: {luckyBoxResult.newTotalPoints} điểm (Bảo toàn vĩnh viễn)

              </span>

            </div>



            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-left space-y-2">

              <div className="flex items-center gap-2">

                <span className="text-base">💌</span>

                <span className="text-xs font-black text-amber-300 uppercase tracking-wide">

                  Lời Nhắn Nhủ Sư Phạm Từ Thầy Đinh Thành:

                </span>

              </div>

              <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed font-medium bg-slate-900/60 p-3 rounded-xl border border-slate-700/50">

                "{luckyBoxResult.wishMessage}"

              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">

                <span>👨‍🏫 {luckyBoxResult.teacherName}</span>

                <span className="text-cyan-300 font-bold">Zalo: {luckyBoxResult.teacherPhone}</span>

              </div>

            </div>



            {luckyBoxResult.alreadyOpenedToday && (

              <p className="text-[11px] text-amber-300/80 italic">

                * Hôm nay em đã mở quà rồi! Hãy quay lại vào ngày mai để tiếp tục mở hộp quà mới nhé!

              </p>

            )}



            <div className="pt-2">

              <button

                type="button"

                onClick={() => setShowLuckyBoxModal(false)}

                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-lg transition cursor-pointer active:scale-98"

              >

                Em Cảm Ơn Thầy Thành &amp; Cố Gắng Học Tốt! 🚀

              </button>

            </div>

          </div>

        </div>

      )}



      
      {/* MODAL LỘ TRÌNH ƯU ĐÃI & SỰ KIỆN THI ĐUA THEO NGÀY (THẦY ĐINH VĂN THÀNH) */}
      {showPromoRoadmapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-amber-400/40 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header Modal */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">📅</span>
                <div>
                  <h3 className="text-base sm:text-lg font-black leading-tight">
                    LỘ TRÌNH ƯU ĐÃI &amp; THÔNG BÁO THEO NGÀY
                  </h3>
                  <p className="text-[11px] text-amber-100 font-medium mt-0.5">
                    Thầy giáo Đinh Văn Thành • Tự động cập nhật theo ngày giờ thực • Xóa bỏ thông báo cũ
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPromoRoadmapModal(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-sm transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Tự động cập nhật thông báo theo ngày thực */}
            <div className="px-4 py-2.5 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <span className="text-base shrink-0">🔒</span>
              <div className="leading-relaxed">
                <strong>Quy chế thông báo theo ngày giờ thực:</strong> Hệ thống tự động xóa bỏ thông báo của các ngày cũ khi bước qua 00:00:00 để tránh hiển thị sai lệch. Các em luôn nhìn thấy sự kiện mới nhất hôm nay và kế hoạch các ngày sắp tới!
              </div>
            </div>

            {/* Danh sách lộ trình từng ngày */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
              {promoRoadmapList.map((item, idx) => {
                const isActive = item.status === 'active';
                const isExpired = item.status === 'expired';

                return (
                  <div
                    key={idx}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border-amber-400 ring-2 ring-amber-400/30 shadow-md'
                        : isExpired
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isActive
                            ? 'bg-rose-600 text-white shadow-xs'
                            : isExpired
                            ? 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                            : 'bg-indigo-600 text-white'
                        }`}>
                          {item.badge}
                        </span>

                        <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                          {item.dateDisplay}
                        </span>

                        <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                          isActive
                            ? 'bg-amber-400 text-slate-950 font-black animate-pulse'
                            : isExpired
                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 line-through'
                            : 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300'
                        }`}>
                          {isActive ? '🔥 ĐANG DIỄN RA HÔM NAY' : isExpired ? 'ĐÃ HẾT HẠN (TỰ ĐỘNG XÓA)' : '⏳ SẮP DIỄN RA'}
                        </span>
                      </div>

                      <div className="shrink-0">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                          isActive
                            ? 'bg-amber-400 text-slate-950 shadow-xs'
                            : isExpired
                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                            : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                        }`}>
                          +{item.points}đ Đăng Nhập {item.vocabMultiplier > 1 ? `• x${item.vocabMultiplier} Từ Vựng` : ''}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-sm font-black text-slate-900 dark:text-white mt-1">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {item.description}
                    </p>

                    {item.rules && item.rules.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-2 text-[11px]">
                        {item.rules.map((r, ri) => (
                          <span key={ri} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300">
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer Modal */}
            <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Lộ trình thiết kế độc quyền bởi <strong>Thầy Đinh Văn Thành</strong>
              </span>
              <button
                type="button"
                onClick={() => setShowPromoRoadmapModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs transition cursor-pointer hover:opacity-90"
              >
                Đóng
              </button>
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

