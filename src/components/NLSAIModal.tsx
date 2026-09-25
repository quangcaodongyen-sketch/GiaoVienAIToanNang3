import { TrialRegisterModal } from './TrialRegisterModal';
import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  X, 
  Play,
  Sparkles, 
  MessageCircle, 
  FileText, 
  CheckCircle2, 
  Download, 
  Copy, 
  Check, 
  Laptop, 
  BookOpen, 
  Layers, 
  Settings, 
  FileCode, 
  ShieldCheck, 
  CheckSquare, 
  ExternalLink,
  ChevronRight,
  Info,
  Award,
  Sliders,
  HelpCircle,
  HeartHandshake
} from 'lucide-react';
import { BRAND, NLS_RESOURCES } from '../config/brand';
import { getOrCreateNLSHardwareCode, verifyKeyFormat } from '../services/nlsKeyService';

interface NLSAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

// 12 Môn học THCS chuẩn CV 5512
const SUBJECTS = [
  'Toán',
  'Tiếng Anh',
  'Khoa học tự nhiên',
  'Ngữ văn',
  'Lịch sử và Địa lí',
  'Tin học',
  'Công nghệ',
  'Giáo dục công dân',
  'Nghệ thuật (Âm nhạc, Mĩ thuật)',
  'Giáo dục thể chất',
  'Hoạt động trải nghiệm, HN',
  'Giáo dục địa phương'
];

// Các chủ đề mẫu theo môn học
const SAMPLE_LESSONS: Record<string, string[]> = {
  'Toán': [
    'Bài 1: Khái niệm phương trình và hệ hai phương trình bậc nhất hai ẩn (Lớp 9)',
    'Bài 3: Giải hệ phương trình bậc nhất hai ẩn (Lớp 9)',
    'Bài 2: Hình thang cân và tính chất hình học phẳng (Lớp 8)',
    'Bài 4: Thu thập và phân loại dữ liệu thống kê (Lớp 7)'
  ],
  'Tiếng Anh': [
    'Unit 1: Leisure Time - Getting Started & A Closer Look 1 (Grade 8)',
    'Unit 2: Life in the Countryside - Skills 1: Reading & Speaking (Grade 8)',
    'Unit 3: Teenagers - A Closer Look 2: Grammar & Practice (Grade 8)',
    'Unit 7: Environmental Protection - Project & Review (Grade 8)'
  ],
  'Khoa học tự nhiên': [
    'Bài 21: Quang hợp ở thực vật và vai trò của trao đổi chất (Lớp 7)',
    'Bài 12: Tác dụng làm quay của lực và ứng dụng đòn bẩy (Lớp 8)',
    'Bài 5: Phản ứng hóa học và định luật bảo toàn khối lượng (Lớp 8)',
    'Bài 15: Năng lượng và sự chuyển hóa năng lượng trong tự nhiên (Lớp 6)'
  ],
  'Ngữ văn': [
    'Bài 2: Vẻ đẹp cổ điển - Đọc hiểu văn bản truyện trung đại (Lớp 8)',
    'Bài 3: Lắng nghe lịch sử nước mình - Viết bài văn nghị luận xã hội (Lớp 6)',
    'Bài 5: Những gương mặt thân yêu - Thực hành tiếng Việt (Lớp 7)'
  ],
  'Tin học': [
    'Bài 5: Ứng dụng bảng tính điện tử và biểu diễn biểu đồ (Lớp 7)',
    'Bài 8: An toàn thông tin trên không gian mạng và ứng xử số (Lớp 8)',
    'Bài 11: Thuật toán tìm kiếm tuần tự và tìm kiếm nhị phân (Lớp 7)'
  ],
  'Lịch sử và Địa lí': [
    'Bài 6: Cách mạng công nghiệp thế kỉ XVIII - XIX (Lịch sử 8)',
    'Bài 10: Khí hậu và biến đổi khí hậu ở Việt Nam (Địa lí 8)',
    'Bài 3: Văn minh Ai Cập và Lưỡng Hà cổ đại (Lịch sử 6)'
  ],
  'Công nghệ': [
    'Bài 2: Lắp đặt mạch điện bảng điện trong gia đình (Lớp 9)',
    'Bài 6: Dự án trồng trọt công nghệ cao và nông nghiệp thông minh (Lớp 7)'
  ],
  'Giáo dục công dân': [
    'Bài 4: Bảo vệ lẽ phải và tôn trọng sự thật (Lớp 8)',
    'Bài 8: Phòng, chống bạo lực gia đình và học đường (Lớp 8)'
  ],
  'Nghệ thuật (Âm nhạc, Mĩ thuật)': [
    'Chủ đề 2: Giai điệu quê hương - Ứng dụng phần mềm hòa âm số (Âm nhạc 8)',
    'Chủ đề 4: Thiết kế đồ họa và poster tuyên truyền bảo vệ môi trường (Mĩ thuật 8)'
  ],
  'Giáo dục thể chất': [
    'Bài 1: Chạy cự li ngắn (60m) và phân tích video động tác kỹ thuật (Lớp 8)'
  ],
  'Hoạt động trải nghiệm, HN': [
    'Chủ đề 3: Xây dựng kế hoạch tài chính cá nhân và chi tiêu thông minh (Lớp 8)',
    'Chủ đề 6: Nghề nghiệp trong kỉ nguyên số và ứng dụng AI (Lớp 9)'
  ],
  'Giáo dục địa phương': [
    'Chủ đề 2: Di tích lịch sử và danh lam thắng cảnh quê hương (Lớp 8)'
  ]
};

// Gợi ý prompt văn bản tùy biến nhanh cho giáo viên (Bản V3)
const PROMPT_PRESETS = [
  'Tích hợp ngắn gọn, chú ý học sinh khiếm thính',
  'Tích hợp chi tiết, lồng ghép kỹ năng sống và phòng chống bạo lực học đường',
  'Lớp có học sinh tự kỷ, tiếp thu chậm, cần hỗ trợ trực quan',
  'Lồng ghép Bảo vệ môi trường và Giáo dục tài chính cá nhân'
];

export const NLSAIModal: React.FC<NLSAIModalProps> = ({ isOpen, onClose, onOpenAdmin }) => {
  const [activeTab, setActiveTab] = useState<'online' | 'download' | 'register'>('online');
  const [showTrialRegister, setShowTrialRegister] = useState<boolean>(false);

  // State cho Tab 1: Trực tuyến
  const [selectedSubject, setSelectedSubject] = useState<string>('Toán');
  const [selectedGrade, setSelectedGrade] = useState<string>('Lớp 9');
  const [lessonName, setLessonName] = useState<string>(
    'Bài 1: Khái niệm phương trình và hệ hai phương trình bậc nhất hai ẩn'
  );
  const [integrationMode, setIntegrationMode] = useState<'exact' | 'ai_deep'>('ai_deep');
  
  // TÍNH NĂNG MỚI V3: Mức độ chi tiết
  const [detailLevel, setDetailLevel] = useState<'standard' | 'short' | 'detailed'>('standard');

  // TÍNH NĂNG MỚI V3: Tùy chọn "Chỉ tích hợp giáo dục học sinh khuyết tật hòa nhập"
  const [onlyDisability, setOnlyDisability] = useState<boolean>(false);

  // TÍNH NĂNG MỚI V3: Ô yêu cầu bổ sung bằng văn bản do giáo viên nhập
  const [enableCustomPrompt, setEnableCustomPrompt] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');

  // Checkboxes nội dung tích hợp chung
  const [integrateNLS, setIntegrateNLS] = useState(true);
  const [integrateAI, setIntegrateAI] = useState(true);
  const [integrateSTEM, setIntegrateSTEM] = useState(false);
  const [integrateANQP, setIntegrateANQP] = useState(false);
  const [integrateQCN, setIntegrateQCN] = useState(false);
  const [integrateBVMT, setIntegrateBVMT] = useState(false);
  const [integrateGDTC, setIntegrateGDTC] = useState(false);
  const [integrateXBHTLH, setIntegrateXBHTLH] = useState(false);
  const [integrateDisability, setIntegrateDisability] = useState(true);

  // Kết quả sinh ra (phân tách rõ màu đỏ #FF0000 và màu xanh #0070C0)
  const [generatedPrimaryObjectives, setGeneratedPrimaryObjectives] = useState<string>('');
  const [generatedDisabilityObjectives, setGeneratedDisabilityObjectives] = useState<string>('');
  const [generatedPrimaryProcedures, setGeneratedPrimaryProcedures] = useState<string>('');
  const [generatedDisabilityProcedures, setGeneratedDisabilityProcedures] = useState<string>('');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedSection, setCopiedSection] = useState<'obj' | 'proc' | 'all' | null>(null);

  // State cho Tab 3: Bản quyền
  const [detectedMid, setDetectedMid] = useState<string>('');
  const [inputKey, setInputKey] = useState<string>('');
  const [verifyResult, setVerifyResult] = useState<{ isValid: boolean; message: string } | null>(null);
  const [isProActive, setIsProActive] = useState<boolean>(false);

  // Hệ thống 5 lượt dùng thử miễn phí / máy tính
  const [trialRemaining, setTrialRemaining] = useState<number>(5);

  // Form đăng ký
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regSchool, setRegSchool] = useState('');
  const [regPlan, setRegPlan] = useState<'1YEAR' | '2YEAR' | '3YEAR' | 'LIFETIME'>('LIFETIME');
  const [regSuccess, setRegSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const code = getOrCreateNLSHardwareCode();
      setDetectedMid(code);

      // Đọc số lượt dùng thử còn lại trên máy (tối đa 5 lượt/máy tính)
      const savedTrials = localStorage.getItem('gvai_nls_trial_remaining');
      if (savedTrials !== null) {
        const parsed = parseInt(savedTrials, 10);
        setTrialRemaining(isNaN(parsed) ? 5 : Math.max(0, Math.min(parsed, 5)));
      } else {
        localStorage.setItem('gvai_nls_trial_remaining', '5');
        setTrialRemaining(5);
      }

      const savedKey = localStorage.getItem('gvai_nls_active_key');
      if (savedKey) {
        setInputKey(savedKey);
        const res = verifyKeyFormat(savedKey, code);
        if (res.isValid) {
          setIsProActive(true);
          setVerifyResult(res);
        }
      }
    }
  }, [isOpen]);

  // Cập nhật tên bài gợi ý khi đổi môn
  const handleSubjectChange = (subj: string) => {
    setSelectedSubject(subj);
    const presets = SAMPLE_LESSONS[subj];
    if (presets && presets.length > 0) {
      setLessonName(presets[0]);
    }
  };

  // Phân tích prompt văn bản tùy biến (theo thuật toán V3)
  const analyzePrompt = (text: string) => {
    const p = (text || '').toLowerCase().trim();
    let detectedLevel = detailLevel;
    if (p.includes('ngắn gọn') || p.includes('ngắn') || p.includes('tóm tắt') || p.includes('súc tích') || p.includes('tối giản')) {
      detectedLevel = 'short';
    } else if (p.includes('chi tiết') || p.includes('chuyên sâu') || p.includes('kỹ lưỡng') || p.includes('đầy đủ')) {
      detectedLevel = 'detailed';
    }

    const disabilities: string[] = [];
    if (p.includes('khiếm thính') || p.includes('nghe kém') || p.includes('điếc')) disabilities.push('khiếm thính');
    if (p.includes('khiếm thị') || p.includes('nhìn kém') || p.includes('mù') || p.includes('mắt kém')) disabilities.push('khiếm thị');
    if (p.includes('tự kỷ') || p.includes('tăng động') || p.includes('adhd')) disabilities.push('tự kỷ');
    if (p.includes('chậm') || p.includes('tiếp thu chậm') || p.includes('trí tuệ')) disabilities.push('chậm tiếp thu');
    if (p.includes('vận động') || p.includes('liệt')) disabilities.push('vận động');

    const topics: string[] = [];
    if (p.includes('kỹ năng sống') || p.includes('kns')) topics.push('KNS');
    if (p.includes('bạo lực') || p.includes('pcblhđ') || p.includes('pcblhd')) topics.push('PCBLHĐ');
    if (p.includes('môi trường') || p.includes('bvmt') || p.includes('rác')) topics.push('BVMT');
    if (p.includes('tài chính') || p.includes('gdtc') || p.includes('tiết kiệm')) topics.push('GDTC');
    if (p.includes('giao thông') || p.includes('atgt')) topics.push('ATGT');

    return { detectedLevel, disabilities, topics };
  };

  // Sinh nội dung tích hợp mẫu chuẩn xác theo bộ quy tắc Thầy Thành (Phiên bản V3)
  const handleGenerateContent = () => {
    // KIỂM TRA LƯỢT DÙNG THỬ 5 LẦN/MÁY TÍNH
    if (!isProActive) {
      if (trialRemaining <= 0) {
        alert('Thầy/Cô đã hoàn thành 5/5 lượt dùng thử tích hợp NLS miễn phí trên máy tính này!\n\nQuý Thầy/Cô vui lòng bấm Liên hệ Zalo Thầy Thành (0915.213717) để nhận báo giá ưu đãi sư phạm và kích hoạt bản quyền tiếp tục sử dụng không giới hạn.');
        setActiveTab('register');
        return;
      }
      // Trừ 1 lượt dùng thử (tối thiểu 0)
      const nextRemaining = Math.max(0, trialRemaining - 1);
      setTrialRemaining(nextRemaining);
      localStorage.setItem('gvai_nls_trial_remaining', String(nextRemaining));
    }

    setIsGenerating(true);

    setTimeout(() => {
      const isEnglish = selectedSubject === 'Tiếng Anh';
      const promptInfo = enableCustomPrompt ? analyzePrompt(customPrompt) : { detectedLevel: detailLevel, disabilities: [], topics: [] };
      const effectiveLevel = promptInfo.detectedLevel || detailLevel;

      // 1. SINH NỘI DUNG MÔN TIẾNG ANH (100% English)
      if (isEnglish) {
        let pObj = '';
        let dObj = '';
        let pProc = '';
        let dProc = '';

        if (!onlyDisability) {
          pObj = `I. OBJECTIVES / MỤC TIÊU BÀI DẠY (TÍCH HỢP CHUẨN CV 5512 - V3):\n` +
            `* Language Competences: Master key vocabulary and grammatical structures related to "${lessonName}".\n` +
            (integrateNLS ? `* Digital Competence [NLS.1.2 - NLS.3.1]: Use digital learning platforms, online dictionaries (Oxford, Cambridge), and interactive quiz tools for language acquisition.\n` : '') +
            (integrateAI ? `* AI [AI.2 - AI.3]: Utilize generative AI assistants responsibly to practice authentic dialogues, check pronunciation nuances, and verify sentence grammar.\n` : '') +
            (integrateSTEM ? `* STEM [STEM.1]: Design multimedia English vocabulary mindmaps and structured digital concept charts.\n` : '') +
            (integrateBVMT || promptInfo.topics.includes('BVMT') ? `* Environmental Protection [BVMT.1]: Raise ecological awareness, resource conservation, and green lifestyle through topical discussions.\n` : '') +
            (promptInfo.topics.includes('KNS') ? `* Life Skills [KNS.1]: Foster proactive communication, active listening, and constructive team collaboration in English.\n` : '') +
            (promptInfo.topics.includes('PCBLHĐ') ? `* Human Rights & Safety [QCN.1]: Promote inclusive friendship, mutual respect, and safe, civilized school communication.\n` : '');

          pProc = `III. TEACHING PROCEDURES / TIẾN TRÌNH DẠY HỌC (TÍCH HỢP SƯ PHẠM 4 HOẠT ĐỘNG):\n\n` +
            `1. WARM-UP (KHỞI ĐỘNG) [NLS.1.1, AI.1]:\n` +
            (effectiveLevel === 'short' 
              ? `- T plays a digital multimedia clip; Ss interact on mobile/smart screens to identify key terms.\n`
              : `- T presents an interactive multimedia video clip / audio dialogue introducing "${lessonName}".\n- Ss interact on digital devices / respond to rapid quiz questions.\n- Expected product: High engagement and initial vocabulary activation.\n`) +
            `\n2. KNOWLEDGE DISCOVERY (KHÁM PHÁ KIẾN THỨC) [NLS.1.2, AI.2]:\n` +
            (effectiveLevel === 'short'
              ? `- T guides Ss to look up keywords via digital dictionary; Ss extract language patterns in pairs.\n`
              : `- T guides Ss to analyze target texts, look up unfamiliar words via digital dictionaries, and examine grammar points.\n- Ss work in pairs/groups, listen attentively to authentic native recordings, and record grammar rules.\n- Expected product: Structured vocabulary charts and accurate grammar notes.\n`) +
            `\n3. PRACTICE (LUYỆN TẬP) [NLS.3.1, AI.3]:\n` +
            (effectiveLevel === 'short'
              ? `- T assigns digital gap-filling/speaking exercises; Ss use AI assistant feedback to self-correct.\n`
              : `- T assigns communicative practice tasks (gap-filling, sentence building, pair role-play).\n- Ss practice speaking and writing, using AI assistant feedback to self-correct pronunciation and grammar.\n- Expected product: Fluent communicative dialogues with correct intonation.\n`) +
            `\n4. APPLICATION (VẬN DỤNG) [NLS.5.2, STEM.1]:\n` +
            (effectiveLevel === 'short'
              ? `- T gives a real-life mini-project; Ss design digital posters and share findings.\n`
              : `- T introduces a real-world communicative scenario or creative mini-project related to the topic.\n- Ss collaborate in groups, design digital presentation slides/posters, and share practical viewpoints.\n- Expected product: Group multimedia presentation and peer assessment report.\n`);
        }

        // Nội dung Khuyết tật hòa nhập (Màu xanh #0070C0)
        if (integrateDisability || onlyDisability) {
          const hasHearing = promptInfo.disabilities.includes('khiếm thính');
          const hasVisual = promptInfo.disabilities.includes('khiếm thị');
          const hasAutism = promptInfo.disabilities.includes('tự kỷ');

          if (hasHearing) {
            dObj = `* For students with hearing difficulties: Focus on visual learning materials, flashcards, and gestures to recognize key vocabulary and actively participate in communicative activities.`;
            dProc = `[SUPPORT FOR STUDENTS WITH HEARING IMPAIRMENT]:\n` +
              `- T provides illustrated flashcards, subtitle cues, and visual body language during all activities.\n` +
              `- Pair with a supportive classmate to verify pronunciation steps and written tasks.\n` +
              `- Expected outcome: Confident recognition and written production of core target words.`;
          } else if (hasVisual) {
            dObj = `* For students with visual difficulties: Develop listening comprehension, oral repetition of basic words, and self-confidence in group participation.`;
            dProc = `[SUPPORT FOR STUDENTS WITH VISUAL IMPAIRMENT]:\n` +
              `- T reads out text slowly with clear intonation and provides large-print audio materials.\n` +
              `- Ss participate through spoken responses, audio repetition, and supportive partner guidance.\n` +
              `- Expected outcome: Confident listening and oral reproduction of basic vocabulary.`;
          } else if (hasAutism) {
            dObj = `* For students with autism / attention difficulties: Follow structured step-by-step instructions, complete small achievable tasks, and receive timely teacher encouragement.`;
            dProc = `[SUPPORT FOR STUDENTS WITH AUTISM / ATTENTION CHALLENGES]:\n` +
              `- T segments tasks into small, concrete milestones with predictable visual schedules.\n` +
              `- Foster a calm, encouraging environment with peer buddy support.\n` +
              `- Expected outcome: Active participation in basic recognition activities without anxiety.`;
          } else {
            dObj = `* For students with disabilities: Acquire core vocabulary at basic recognition level with visual flashcards, simplified tasks, and peer assistance.`;
            dProc = `[INCLUSIVE EDUCATION SUPPORT FOR STUDENTS WITH DISABILITIES]:\n` +
              `- T assigns simplified recognition tasks, offers visual aids, and provides patient 1-on-1 guidance.\n` +
              `- Ss participate within group activities, assisted by friendly peer buddies.\n` +
              `- Expected outcome: Recognition of core vocabulary and positive attitude toward learning.`;
          }
        }

        setGeneratedPrimaryObjectives(pObj);
        setGeneratedDisabilityObjectives(dObj);
        setGeneratedPrimaryProcedures(pProc);
        setGeneratedDisabilityProcedures(dProc);

      } else {
        // 2. SINH NỘI DUNG 11 MÔN TIẾNG VIỆT (Chuẩn Times New Roman 13pt)
        let pObj = '';
        let dObj = '';
        let pProc = '';
        let dProc = '';

        if (!onlyDisability) {
          pObj = `I. MỤC TIÊU BÀI DẠY (TÍCH HỢP THEO CV 5512, TT 02/2025, QĐ 2422 & TT 08/2024 - BẢN V3):\n` +
            `1. Yêu cầu cần đạt chung: Nắm vững và vận dụng các kiến thức, kĩ năng trọng tâm của bài "${lessonName}".\n` +
            `2. Năng lực đặc thù & Nội dung giáo dục tích hợp (Gắn mã chỉ báo chuẩn):\n`;

          if (integrateNLS) {
            pObj += `   * NLS [NLS.1.2 - NLS.3.1]: Khai thác học liệu số, phần mềm chuyên dụng (GeoGebra/mô phỏng 3D/PhET/bảng tính điện tử) và thiết bị số để tra cứu, xử lí dữ liệu và trực quan hóa kiến thức bài học.\n`;
          }
          if (integrateAI) {
            pObj += `   * AI [AI.2 - AI.3]: Sử dụng công cụ AI (trợ lí ngôn ngữ, AI hỗ trợ giải toán/khoa học) để đối chiếu kết quả, kiểm tra nghiệm, hỗ trợ tìm kiếm tài liệu và nâng cao năng lực tự học có trách nhiệm.\n`;
          }
          if (integrateSTEM) {
            pObj += `   * STEM [STEM.1]: Vận dụng kiến thức liên môn, kĩ năng thiết kế mô hình và giải quyết vấn đề thực tiễn gắn với nội dung bài học.\n`;
          }
          if (integrateANQP) {
            pObj += `   * ANQP [ANQP.1 - ANQP.2]: Giáo dục tinh thần yêu nước, ý thức bảo vệ chủ quyền biên giới, biển đảo và tự hào về truyền thống lực lượng vũ trang nhân dân (theo Thông tư 08/2024/TT-BGDĐT).\n`;
          }
          if (integrateQCN || promptInfo.topics.includes('PCBLHĐ')) {
            pObj += `   * QCN & KNS [QCN.1, KNS.1]: Giáo dục quyền con người, tinh thần tôn trọng bạn bè, hợp tác nhóm văn minh và phòng chống bạo lực học đường (theo Quyết định 1309/QĐ-TTg).\n`;
          }
          if (integrateBVMT || promptInfo.topics.includes('BVMT')) {
            pObj += `   * BVMT [BVMT.1]: Nâng cao ý thức bảo vệ môi trường, giữ gìn cảnh quan lớp học, tiết kiệm năng lượng và ứng phó biến đổi khí hậu.\n`;
          }
          if (integrateGDTC || promptInfo.topics.includes('GDTC')) {
            pObj += `   * GDTC [GDTC.1]: Giáo dục tài chính, nâng cao kĩ năng lập kế hoạch và quản lí chi tiêu thông minh, hiệu quả.\n`;
          }
          if (integrateXBHTLH) {
            pObj += `   * XBHTLH [XBHTLH.1]: Tuyên truyền xóa bỏ các hủ tục, phong tục lạc hậu, xây dựng nếp sống văn minh hiện đại trong gia đình và nhà trường.\n`;
          }
          if (promptInfo.topics.includes('ATGT')) {
            pObj += `   * ATGT [ATGT.1]: Nâng cao văn hóa chấp hành luật an toàn giao thông đường bộ khi đến trường.\n`;
          }

          pProc = `III. TIẾN TRÌNH DẠY HỌC (PHÂN TÍCH SƯ PHẠM CHI TIẾT 4 HOẠT ĐỘNG CHUẨN CV 5512):\n\n` +
            `1. HOẠT ĐỘNG 1: KHỞI ĐỘNG (XÁC ĐỊNH VẤN ĐỀ) [NLS.1.1, AI.1]\n` +
            (effectiveLevel === 'short'
              ? `- GV trình chiếu tình huống/video số; HS quan sát, trao đổi nhanh theo cặp và nêu nhận xét ban đầu.\n- Sản phẩm: Câu trả lời khởi động của HS, tâm thế chủ động tiếp nhận bài mới.\n`
              : `- Mục tiêu: Tạo tâm thế hứng thú, kích hoạt kiến thức nền tảng gắn với "${lessonName}".\n- Hoạt động của GV: Trình chiếu video mô phỏng số / câu hỏi tình huống trên màn hình tương tác; giao nhiệm vụ cho cả lớp.\n- Hoạt động của HS: Quan sát, thảo luận nhanh theo cặp/bàn, tương tác trả lời câu hỏi khởi động.\n- Sản phẩm dự kiến: Câu trả lời của HS, sự hào hứng tiếp cận kiến thức mới.\n`) +
            `\n2. HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI [NLS.1.2, AI.2, STEM.1]\n` +
            (effectiveLevel === 'short'
              ? `- GV hướng dẫn HS khai thác học liệu số, mô hình trực quan; HS thảo luận nhóm và ghi nhận quy tắc/định lí.\n- Sản phẩm: Nội dung ghi bài và kết luận trọng tâm được chuẩn hóa.\n`
              : `- Mục tiêu: Giúp HS lĩnh hội bản chất kiến thức trọng tâm bài "${lessonName}".\n- Hoạt động của GV: Hướng dẫn HS khai thác học liệu số, mô hình thực hành / phần mềm chuyên dụng (GeoGebra, PhET, bảng số liệu); định hướng HS phân tích rút ra quy tắc, định lí.\n- Hoạt động của HS: Thao tác trên thiết bị số/phiếu học tập, phân tích số liệu, thảo luận nhóm và đại diện báo cáo kết quả.\n- Sản phẩm dự kiến: Nội dung ghi bài hoàn chỉnh, các công thức, định nghĩa và kết luận khoa học được chuẩn hóa.\n`) +
            `\n3. HOẠT ĐỘNG 3: LUYỆN TẬP [NLS.3.1, AI.2, AI.3]\n` +
            (effectiveLevel === 'short'
              ? `- GV giao bài tập phân hóa; HS làm bài, sử dụng MTCT/phần mềm/AI kiểm tra đối chiếu kết quả.\n- Sản phẩm: Lời giải hoàn thiện của bài tập trong vở.\n`
              : `- Mục tiêu: Củng cố, khắc sâu kiến thức, rèn kĩ năng giải bài tập và sử dụng công cụ số thành thạo.\n- Hoạt động của GV: Giao hệ thống bài tập phân hóa; hướng dẫn HS dùng máy tính cầm tay (MTCT) / phần mềm số / trợ lí AI để kiểm tra, đối chiếu nghiệm và kết quả.\n- Hoạt động của HS: Làm bài tập độc lập và thảo luận cặp đôi; tự đối chiếu kết quả, phát hiện và tự sửa lỗi sai.\n- Sản phẩm dự kiến: Lời giải chi tiết các bài tập trong vở và trên bảng nhóm.\n`) +
            `\n4. HOẠT ĐỘNG 4: VẬN DỤNG & MỞ RỘNG [NLS.5.2, STEM.1, BVMT.1]\n` +
            (effectiveLevel === 'short'
              ? `- GV giao nhiệm vụ thực tiễn/dự án nhỏ; HS lập kế hoạch tìm hiểu và hoàn thành báo cáo số.\n- Sản phẩm: Báo cáo thực hành hoặc sản phẩm ứng dụng bài học.\n`
              : `- Mục tiêu: Vận dụng kiến thức bài học để giải quyết các vấn đề thực tiễn trong cuộc sống và học tập.\n- Hoạt động của GV: Nêu tình huống thực tế hoặc giao dự án học tập nhỏ về nhà; hướng dẫn tìm kiếm tư liệu chính thống trên Internet.\n- Hoạt động của HS: Lập kế hoạch thực hiện theo nhóm, thu thập thông tin, chuẩn bị bài trình bày hoặc sản phẩm học tập.\n- Sản phẩm dự kiến: Báo cáo thực hành, bài thuyết trình số hoặc sản phẩm ứng dụng thực tiễn của nhóm.\n`);
        }

        // Nội dung Khuyết tật hòa nhập (Màu xanh #0070C0)
        if (integrateDisability || onlyDisability) {
          const hasHearing = promptInfo.disabilities.includes('khiếm thính');
          const hasVisual = promptInfo.disabilities.includes('khiếm thị');
          const hasAutism = promptInfo.disabilities.includes('tự kỷ');
          const hasSlow = promptInfo.disabilities.includes('chậm tiếp thu');

          if (hasHearing) {
            dObj = `* Giáo dục học sinh khuyết tật hòa nhập (Khiếm thính): Tiếp thu kiến thức cốt lõi thông qua kênh hình ảnh trực quan, cử chỉ mô tả, sơ đồ tư duy; tham gia trả lời câu hỏi bằng cách chỉ bảng, viết vào bảng con với sự hỗ trợ của bạn học.`;
            dProc = `[CHỈ DẪN GIÁO DỤC HỌC SINH KHIẾM THÍNH HÒA NHẬP]:\n` +
              `- GV bố trí HS khiếm thính ngồi vị trí đầu dãy, dễ quan sát bảng và cử chỉ của thầy cô.\n` +
              `- Tăng cường sử dụng hình ảnh, video có phụ đề, sơ đồ trực quan và phiếu học tập in sẵn.\n` +
              `- Phân công 1 bạn học bên cạnh hỗ trợ nhắc việc và đối chiếu kết quả.\n` +
              `- Dự kiến sản phẩm: HS hoàn thành các bài tập nhận biết cơ bản và tích cực tương tác qua cử chỉ/bảng phụ.`;
          } else if (hasVisual) {
            dObj = `* Giáo dục học sinh khuyết tật hòa nhập (Khiếm thị / Thị lực kém): Tiếp thu kiến thức cốt lõi thông qua kênh nghe và lời giảng trực tiếp; tham gia phát biểu miệng, trao đổi cùng nhóm bạn và rèn luyện tính tự tin hòa nhập.`;
            dProc = `[CHỈ DẪN GIÁO DỤC HỌC SINH KHIẾM THỊ HÒA NHẬP]:\n` +
              `- GV giảng bài to rõ, mô tả chi tiết bằng lời các hình vẽ, công thức trên bảng.\n` +
              `- Cung cấp tài liệu phóng to chữ hoặc hướng dẫn HS nghe học liệu âm thanh.\n` +
              `- Khuyến khích HS trả lời miệng, thảo luận nhóm để phát huy thế mạnh ngôn ngữ.\n` +
              `- Dự kiến sản phẩm: HS ghi nhớ các khái niệm chính và tự tin trình bày câu trả lời bằng lời nói.`;
          } else if (hasAutism || hasSlow) {
            dObj = `* Giáo dục học sinh khuyết tật hòa nhập (Tự kỷ / Chậm tiếp thu): Nắm được kiến thức cơ bản ở mức nhận biết; được chia nhỏ nhiệm vụ, hỗ trợ từng bước và khích lệ kịp thời để tự tin tham gia học tập cùng các bạn.`;
            dProc = `[CHỈ DẪN GIÁO DỤC HỌC SINH TỰ KỶ / CHẬM TIẾP THU HÒA NHẬP]:\n` +
              `- GV chia nhỏ từng thao tác học tập, giao nhiệm vụ vừa sức (nhận biết, điền từ đơn giản).\n` +
              `- Tạo bầu không khí lớp học thân thiện, kiên nhẫn hướng dẫn và động viên khen ngợi kịp thời.\n` +
              `- Bạn trong nhóm đồng hành hướng dẫn thao tác, không tạo áp lực thời gian.\n` +
              `- Dự kiến sản phẩm: HS hoàn thành nhiệm vụ mức độ cơ bản trong phiếu học tập riêng.`;
          } else {
            dObj = `* Giáo dục học sinh khuyết tật hòa nhập: Tiếp thu kiến thức cốt lõi ở mức độ nhận biết cơ bản, rèn luyện tính tự tin, hòa nhập thông qua sự đồng hành của giáo viên và các bạn trong nhóm.`;
            dProc = `[CHỈ DẪN GIÁO DỤC HỌC SINH KHUYẾT TẬT HÒA NHẬP]:\n` +
              `- Hoạt động 1 (Khởi động): GV khích lệ HS tham gia trả lời câu hỏi nhận biết đơn giản cùng cả lớp.\n` +
              `- Hoạt động 2 (Khám phá): GV giao phiếu học tập có hình ảnh minh họa, bạn nhóm trưởng hỗ trợ giải thích.\n` +
              `- Hoạt động 3 (Luyện tập): HS hoàn thành bài tập nhận biết mức 1, được GV chấm chữa động viên kịp thời.\n` +
              `- Hoạt động 4 (Vận dụng): HS cùng nhóm quan sát sản phẩm thực tế, hòa nhập vào không khí học tập chung.`;
          }
        }

        setGeneratedPrimaryObjectives(pObj);
        setGeneratedDisabilityObjectives(dObj);
        setGeneratedPrimaryProcedures(pProc);
        setGeneratedDisabilityProcedures(dProc);
      }

      setIsGenerating(false);
    }, 500);
  };

  // Copy to clipboard
  const handleCopy = (text: string, type: 'obj' | 'proc' | 'all') => {
    navigator.clipboard.writeText(text);
    setCopiedSection(type);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  // Tải file Word giả lập (.doc với HTML format định dạng OpenXML chuẩn: Chữ đỏ #FF0000 và Chữ xanh #0070C0)
  const handleDownloadDoc = () => {
    const fullHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${lessonName}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.3; }
        .text-red { color: #FF0000; font-family: 'Times New Roman', serif; font-size: 13pt; text-align: justify; }
        .text-blue { color: #0070C0; font-family: 'Times New Roman', serif; font-size: 13pt; text-align: justify; font-weight: normal; }
        h1, h2 { font-family: 'Times New Roman', serif; font-size: 14pt; font-weight: bold; }
      </style>
      </head>
      <body>
        <h2>GIÁO ÁN TÍCH HỢP NLS & AI - CHUẨN CÔNG VĂN 5512 (PHIÊN BẢN V3)</h2>
        <p><b>Môn học:</b> ${selectedSubject} - <b>Lớp:</b> ${selectedGrade}</p>
        <p><b>Bài dạy:</b> ${lessonName}</p>
        <p><b>Tác giả phần mềm:</b> Thầy giáo Đinh Văn Thành – ĐT/Zalo: 0915.213717 – Trường THCS Đồng Yên</p>
        <hr/>
        
        ${generatedPrimaryObjectives ? `
        <div class="text-red" style="white-space: pre-wrap; margin-bottom: 12pt;">
${generatedPrimaryObjectives}
        </div>` : ''}

        ${generatedDisabilityObjectives ? `
        <div class="text-blue" style="white-space: pre-wrap; margin-bottom: 16pt;">
${generatedDisabilityObjectives}
        </div>` : ''}

        ${generatedPrimaryProcedures ? `
        <div class="text-red" style="white-space: pre-wrap; margin-bottom: 12pt;">
${generatedPrimaryProcedures}
        </div>` : ''}

        ${generatedDisabilityProcedures ? `
        <div class="text-blue" style="white-space: pre-wrap; margin-bottom: 16pt;">
${generatedDisabilityProcedures}
        </div>` : ''}
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff' + fullHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Tich_Hop_NLS_AI_V3_${selectedSubject}_${lessonName.substring(0, 30)}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Kích hoạt key bản quyền Ed25519
  const handleActivateKey = () => {
    if (!inputKey.trim()) {
      setVerifyResult({ isValid: false, message: 'Vui lòng dán mã Key kích hoạt (dạng KEY-YYYYMMDD-...).' });
      return;
    }
    const res = verifyKeyFormat(inputKey, detectedMid);
    setVerifyResult(res);
    if (res.isValid) {
      setIsProActive(true);
      localStorage.setItem('gvai_nls_active_key', inputKey.trim());
    }
  };

  // Submit đăng ký
  const handleSubmitRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegSuccess(true);
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

  const hasResult = !!(generatedPrimaryObjectives || generatedDisabilityObjectives);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col text-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* HEADER MODAL */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <FileCode className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                  TÍCH HỢP NLS - AI THCS (ADD-INS V3)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  CV 5512 CHUẨN 2026 - BẢN NÂNG CẤP V3
                </span>
                {isProActive && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" /> BẢN QUYỀN PRO
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Tác giả: Thầy giáo Đinh Văn Thành – ĐT/Zalo: <strong>{BRAND.phone}</strong> – Trường THCS Đồng Yên
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 border border-slate-700 transition-colors"
                title="Quản trị tạo key Ed25519"
              >
                <Settings className="w-3.5 h-3.5 text-amber-400" />
                Admin
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3 TABS NAVIGATION */}
        <div className="bg-slate-950/90 px-4 sm:px-6 pt-3 border-b border-slate-800/90 flex gap-2 sm:gap-4 shrink-0 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('online')}
            className={`pb-3 px-3 font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'online'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            1. Dùng Thử Trực Tuyến V3
          </button>

          <button
            onClick={() => setActiveTab('download')}
            className={`pb-3 px-3 font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'download'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4 text-cyan-300" />
            2. Tải Bản Máy Tính & Add-in (.exe/.dotm)
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`pb-3 px-3 font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'register'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            3. Bản Quyền & Kích Hoạt
          </button>
        </div>

        {/* BODY MODAL CONTENT */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-xs">

          {/* ========================================================================= */}
          {/* TAB 1: TRẢI NGHIỆM TRỰC TUYẾN (ONLINE AI INTEGRATION GENERATOR V3) */}
          {/* ========================================================================= */}
          {activeTab === 'online' && (
            <div className="space-y-4">
              {/* Box giới thiệu tính năng nâng cấp V3 */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-cyan-950/50 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-emerald-200">
                      Hệ thống tự động tích hợp Năng lực số, AI, STEM và Giáo dục Khuyết tật hòa nhập (Bản V3):
                    </p>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Định dạng chuẩn <b>Times New Roman, 13pt</b>. Màu đỏ chuẩn (<span className="text-rose-400 font-bold">#FF0000</span>) cho NLS/AI/STEM và màu xanh dương chuẩn (<span className="text-cyan-400 font-bold">#0070C0</span>) cho Học sinh khuyết tật hòa nhập.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('download')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-[11px] transition-all shrink-0 shadow-md hover:scale-105"
                >
                  <Play className="w-3.5 h-3.5 fill-white text-white" />
                  Xem Video HD
                </button>
              </div>

              {/* STATUS CARD: TRIAL OR PRO BANNER (5 LƯỢT DÙNG THỬ / MÁY TÍNH) */}
              {isProActive ? (
                <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-blue-950/80 border border-emerald-500/40 flex items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                      <Crown className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                        👑 BẢN QUYỀN PRO V3: ĐÃ KÍCH HOẠT CHÍNH THỨC
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Mã máy: <b className="text-cyan-300 font-mono">{detectedMid}</b> – Không giới hạn số lần tích hợp NLS, AI & Khuyết tật hòa nhập cho 12 môn THCS.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.removeItem('gvai_nls_active_key');
                      setIsProActive(false);
                      setVerifyResult(null);
                    }}
                    className="text-[10px] text-slate-500 hover:text-rose-400 underline"
                  >
                    Đổi key
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-blue-500/40 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🎁</span>
                      <span className="font-bold text-xs sm:text-sm text-white">
                        DÙNG THỬ TÍCH HỢP NLS - AI MIỄN PHÍ TRÊN MÁY TÍNH NÀY:
                      </span>
                      <span className="text-[11px] text-slate-300">
                        Đã sử dụng {5 - trialRemaining}/5 lượt
                      </span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                      trialRemaining > 2 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {trialRemaining > 0 ? `👉 Còn lại: ${trialRemaining} lượt` : 'Đã hết lượt dùng thử'}
                    </span>
                  </div>

                  {/* 5 Dấu Chấm Tiến Trình [ ● ● ● ○ ○ ] */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-slate-400 font-mono text-[11px]">Tiến trình:</span>
                    <div className="flex items-center gap-1.5 font-mono">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                            i < (5 - trialRemaining)
                              ? 'bg-emerald-500 text-slate-950 shadow-xs shadow-emerald-500/50'
                              : 'bg-slate-800 text-slate-500 border border-slate-700'
                          }`}
                        >
                          {i < (5 - trialRemaining) ? '●' : '○'}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 italic ml-auto hidden sm:inline">
                      (Mỗi máy tính được tặng đúng 5 lượt tích hợp NLS miễn phí)
                    </span>
                  </div>
                </div>
              )}

              {/* BỘ LỌC CẤU HÌNH TÍCH HỢP CHUẨN V3 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                {/* 1. Chọn Môn học */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    1. Môn học (12 môn THCS)
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => handleSubjectChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-medium text-white focus:outline-none focus:border-emerald-500"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* 2. Chọn Khối lớp */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    2. Khối lớp
                  </label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-medium text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Lớp 6">Lớp 6</option>
                    <option value="Lớp 7">Lớp 7</option>
                    <option value="Lớp 8">Lớp 8</option>
                    <option value="Lớp 9">Lớp 9</option>
                  </select>
                </div>

                {/* 3. Chế độ tích hợp */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    3. Chế độ tích hợp
                  </label>
                  <select
                    value={integrationMode}
                    onChange={(e) => setIntegrationMode(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-medium text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ai_deep">Phân tích Sư phạm AI (Mục I & III)</option>
                    <option value="exact">Tích hợp Nguyên văn Phụ lục III</option>
                  </select>
                </div>

                {/* 4. Mức độ chi tiết (Mới V3) */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    4. Mức độ chi tiết (V3)
                  </label>
                  <select
                    value={detailLevel}
                    onChange={(e) => setDetailLevel(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-medium text-cyan-300 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="standard">Tiêu chuẩn (Chuẩn CV 5512)</option>
                    <option value="short">Ngắn gọn, súc tích (Short)</option>
                    <option value="detailed">Chuyên sâu, đa tầng (Detailed)</option>
                  </select>
                </div>

                {/* Tên bài học / Chủ đề */}
                <div className="md:col-span-4">
                  <label className="block text-slate-300 font-bold mb-1">
                    Tên bài dạy / Chủ đề giảng dạy:
                  </label>
                  <input
                    type="text"
                    value={lessonName}
                    onChange={(e) => setLessonName(e.target.value)}
                    placeholder="Nhập tên bài hoặc chọn bài mẫu gợi ý bên dưới..."
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-emerald-300 font-semibold focus:outline-none focus:border-emerald-500"
                  />

                  {/* Bài mẫu chọn nhanh */}
                  {SAMPLE_LESSONS[selectedSubject] && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-[11px] text-slate-400 font-medium self-center mr-1">
                        Gợi ý nhanh:
                      </span>
                      {SAMPLE_LESSONS[selectedSubject].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setLessonName(preset)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700/60 transition-colors truncate max-w-xs"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* TÍNH NĂNG ĐẶC BIỆT MỚI V3: CHẾ ĐỘ CHỈ KHUYẾT TẬT HÒA NHẬP */}
              <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between gap-3">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyDisability}
                    onChange={(e) => setOnlyDisability(e.target.checked)}
                    className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
                  />
                  <div>
                    <div className="font-bold text-xs text-cyan-300 flex items-center gap-1.5">
                      <HeartHandshake className="w-4 h-4 text-cyan-400" />
                      Tùy chọn V3: Chỉ tích hợp Giáo dục học sinh khuyết tật hòa nhập (Chuyên đề độc lập)
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Khi bật: Tự động tập trung tích hợp nội dung dành cho học sinh khuyết tật (màu xanh dương <b className="text-cyan-300">#0070C0</b>), không chèn đè các nội dung chuyên đề khác.
                    </p>
                  </div>
                </label>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0 hidden sm:inline">
                  Mới V3
                </span>
              </div>

              {/* NỘI DUNG TÍCH HỢP CHUYÊN ĐỀ (Ẩn hoặc làm mờ khi chọn onlyDisability) */}
              <div className={`bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2 transition-all ${
                onlyDisability ? 'opacity-40 pointer-events-none' : ''
              }`}>
                <span className="font-bold text-slate-200 block">
                  Chọn các chuyên đề tích hợp vào bài giảng này (Màu đỏ chuẩn #FF0000):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-1">
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={integrateNLS}
                      onChange={(e) => setIntegrateNLS(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    <span className="text-slate-200 font-medium">NLS (Năng lực số)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={integrateAI}
                      onChange={(e) => setIntegrateAI(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    <span className="text-slate-200 font-medium">AI (Trí tuệ nhân tạo)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={integrateSTEM}
                      onChange={(e) => setIntegrateSTEM(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    <span className="text-slate-200 font-medium">STEM / STEAM</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={integrateANQP}
                      onChange={(e) => setIntegrateANQP(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    <span className="text-slate-200 font-medium">ANQP (An ninh QP)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={integrateQCN}
                      onChange={(e) => setIntegrateQCN(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    <span className="text-slate-200 font-medium">QCN (Quyền con người)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={integrateBVMT}
                      onChange={(e) => setIntegrateBVMT(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    <span className="text-slate-200 font-medium">BVMT (Môi trường)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={integrateGDTC}
                      onChange={(e) => setIntegrateGDTC(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    <span className="text-slate-200 font-medium">GDTC (Tài chính)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={integrateXBHTLH}
                      onChange={(e) => setIntegrateXBHTLH(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    <span className="text-slate-200 font-medium">XBHTLH (Xóa hủ tục)</span>
                  </label>
                </div>
              </div>

              {/* TÍNH NĂNG MỚI V3: Ô YÊU CẦU BỔ SUNG BẰNG VĂN BẢN (CUSTOM PROMPT) */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-indigo-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-bold text-indigo-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={enableCustomPrompt}
                      onChange={(e) => setEnableCustomPrompt(e.target.checked)}
                      className="w-4 h-4 rounded accent-indigo-400 cursor-pointer"
                    />
                    <span>✍️ Yêu cầu bổ sung đặc thù bằng văn bản (Tùy biến Prompt sư phạm - Bản V3)</span>
                  </label>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    Tự nhận diện độ chi tiết, dạng khuyết tật và chuyên đề mở rộng
                  </span>
                </div>

                {enableCustomPrompt && (
                  <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                    <textarea
                      rows={2}
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Nhập yêu cầu bổ sung bằng văn bản tự do, ví dụ: 'Tích hợp ngắn gọn, chú ý học sinh khiếm thính', 'Lớp có học sinh tự kỷ, lồng ghép kỹ năng sống và phòng chống bạo lực học đường'..."
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-indigo-400/40 text-xs text-indigo-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400"
                    />
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-[11px] text-slate-400 font-medium">Mẫu gợi ý:</span>
                      {PROMPT_PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCustomPrompt(p)}
                          className="px-2 py-0.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 text-[11px] text-indigo-300 border border-indigo-500/30 transition-colors"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* NÚT THỰC THI SINH NỘI DUNG */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                {!isProActive && trialRemaining <= 0 ? (
                  <a
                    href={`https://zalo.me/${BRAND.phoneRaw}?text=${encodeURIComponent(
                      `Chào Thầy Thành, tôi đã dùng thử hết 5 lượt phần mềm Tích hợp NLS - AI THCS V3. Nhờ Thầy báo giá ưu đãi và hướng dẫn kích hoạt bản quyền giúp tôi (Mã máy: ${detectedMid}).`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] cursor-pointer animate-pulse"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>HẾT LƯỢT DÙNG THỬ – NHẮN ZALO BÁO GIÁ ƯU ĐÃI</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={handleGenerateContent}
                    disabled={isGenerating}
                    className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isGenerating 
                      ? 'Đang phân tích sư phạm AI V3...' 
                      : !isProActive
                      ? `Sinh Nội Dung Tích Hợp AI V3 (Còn ${trialRemaining}/5 lượt)`
                      : 'Sinh Nội Dung Tích Hợp AI V3 (Chuẩn CV 5512)'}
                  </button>
                )}

                {hasResult && (
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => handleCopy(
                        `${generatedPrimaryObjectives}\n\n${generatedDisabilityObjectives}\n\n${generatedPrimaryProcedures}\n\n${generatedDisabilityProcedures}`.trim(),
                        'all'
                      )}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                    >
                      {copiedSection === 'all' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedSection === 'all' ? 'Đã chép tất cả!' : 'Sao chép tất cả'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadDoc}
                      className="px-3.5 py-2 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold flex items-center gap-1.5 transition-colors shadow"
                    >
                      <Download className="w-4 h-4" />
                      Tải File Word (.doc V3)
                    </button>
                  </div>
                )}
              </div>

              {/* KẾT QUẢ HIỂN THỊ CHUẨN OPENXML V3 (MÀU ĐỎ #FF0000 & MÀU XANH #0070C0) */}
              {hasResult ? (
                <div className="space-y-3 pt-2">
                  {/* Mục I: Mục tiêu */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-amber-300 flex items-center gap-1.5 text-xs sm:text-sm">
                        <BookOpen className="w-4 h-4 text-amber-400" />
                        MỤC I. MỤC TIÊU BÀI DẠY (GẮN MÃ CHỈ BÁO CHUẨN V3)
                      </span>
                      <button
                        onClick={() => handleCopy(`${generatedPrimaryObjectives}\n\n${generatedDisabilityObjectives}`.trim(), 'obj')}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 flex items-center gap-1"
                      >
                        {copiedSection === 'obj' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedSection === 'obj' ? 'Đã sao chép' : 'Sao chép Mục I'}
                      </button>
                    </div>

                    <div className="font-serif text-[13px] leading-relaxed pl-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-2">
                      {/* Phần màu đỏ: NLS, AI, STEM, ANQP... */}
                      {generatedPrimaryObjectives && (
                        <div className="text-rose-400 whitespace-pre-wrap">
                          {generatedPrimaryObjectives}
                        </div>
                      )}
                      {/* Phần màu xanh dương: Khuyết tật hòa nhập chuẩn OpenXML #0070C0 */}
                      {generatedDisabilityObjectives && (
                        <div className="text-cyan-400 font-medium whitespace-pre-wrap pt-1 border-t border-slate-800/60">
                          {generatedDisabilityObjectives}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mục III: Tiến trình 4 hoạt động */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-cyan-300 flex items-center gap-1.5 text-xs sm:text-sm">
                        <Layers className="w-4 h-4 text-cyan-400" />
                        MỤC III. TIẾN TRÌNH DẠY HỌC (4 HOẠT ĐỘNG SƯ PHẠM V3)
                      </span>
                      <button
                        onClick={() => handleCopy(`${generatedPrimaryProcedures}\n\n${generatedDisabilityProcedures}`.trim(), 'proc')}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 flex items-center gap-1"
                      >
                        {copiedSection === 'proc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedSection === 'proc' ? 'Đã sao chép' : 'Sao chép Mục III'}
                      </button>
                    </div>

                    <div className="font-serif text-[13px] leading-relaxed pl-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-2">
                      {/* Phần màu đỏ: 4 hoạt động NLS & AI */}
                      {generatedPrimaryProcedures && (
                        <div className="text-rose-400 whitespace-pre-wrap">
                          {generatedPrimaryProcedures}
                        </div>
                      )}
                      {/* Phần màu xanh dương: Chỉ dẫn khuyết tật hòa nhập */}
                      {generatedDisabilityProcedures && (
                        <div className="text-cyan-400 font-medium whitespace-pre-wrap pt-2 border-t border-slate-800/60">
                          {generatedDisabilityProcedures}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 border border-dashed border-slate-800 rounded-2xl p-6 text-slate-500">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  <p className="font-medium text-slate-400">
                    Bấm nút "Sinh Nội Dung Tích Hợp AI V3" ở trên để tạo tự động nội dung chuẩn xác cho giáo án.
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Phiên bản V3 bổ sung phân tích chuyên sâu Giáo dục học sinh khuyết tật hòa nhập (màu xanh #0070C0) và Prompt văn bản tùy biến.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: TẢI BẢN CÀI DESKTOP, VIDEO HD & WORD ADD-IN V3 (.DOTM / .EXE) */}
          {/* ========================================================================= */}
          {activeTab === 'download' && (
            <div className="space-y-4">
              
              {/* 1. VIDEO PLAYER HƯỚNG DẪN CHI TIẾT */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    Video hướng dẫn cài đặt, kích hoạt Add-in Word & tích hợp NLS - AI vào giáo án:
                  </span>
                  <span className="text-[11px] text-cyan-400 font-mono">Full HD 1080p</span>
                </div>

                <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
                  {NLS_RESOURCES.videoEmbedUrl ? (
                    <iframe
                      src={NLS_RESOURCES.videoEmbedUrl}
                      title="Video hướng dẫn tích hợp NLS-AI"
                      className="w-full aspect-video max-h-[360px] border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <video 
                      controls 
                      playsInline
                      preload="metadata"
                      poster="/giaoanNLS.png"
                      className="w-full aspect-video max-h-[320px] object-contain bg-black"
                    >
                      <source src={NLS_RESOURCES.videoDirectUrl || "/HD_tich_hop_NLS_AI.mp4"} type="video/mp4" />
                      <source src="/HD_tich_hop_NLS_AI.mp4" type="video/mp4" />
                      <source src="/HD%20t%C3%ADch%20h%E1%BB%A3p%20NLS-AI.mp4" type="video/mp4" />
                      Trình duyệt không hỗ trợ thẻ video.
                    </video>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 px-1 gap-2">
                  <span>💡 Video hướng dẫn thực chiến từng thao tác cài đặt và soạn giáo án chuẩn CV 5512.</span>
                  <div className="flex items-center gap-3 shrink-0">
                    <a
                      href={NLS_RESOURCES.videoWatchUrl || "/HD_tich_hop_NLS_AI.mp4"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      ▶ Mở tab mới
                    </a>
                    <a
                      href={NLS_RESOURCES.videoDownloadUrl || NLS_RESOURCES.videoWatchUrl || "/HD_tich_hop_NLS_AI.mp4"}
                      target={NLS_RESOURCES.videoDownloadUrl?.startsWith('http') || NLS_RESOURCES.videoWatchUrl?.startsWith('http') ? "_blank" : undefined}
                      download={!NLS_RESOURCES.videoDownloadUrl?.startsWith('http') ? "HD_tich_hop_NLS_AI.mp4" : undefined}
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Tải Video HD
                    </a>
                  </div>
                </div>
              </div>

              {/* 2. BANNER TẢI TRỌN BỘ CÀI ĐẶT V3 */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-blue-950/70 border border-cyan-500/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-cyan-200 flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-cyan-400" />
                      Trọn Bộ Cài Đặt Desktop & Word Add-in Tích Hợp NLS-AI V3
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Bản V3 nâng cấp: Bổ sung chế độ chuyên sâu Học sinh khuyết tật hòa nhập (#0070C0), ô tùy biến prompt văn bản và cơ chế Single Instance.
                    </p>
                  </div>

                  <a
                    href={NLS_RESOURCES.fullZipUrl || "/Tich_Hop_NLS_AI_THCS_Pass_123.zip"}
                    target={NLS_RESOURCES.fullZipUrl?.startsWith('http') ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    download={!NLS_RESOURCES.fullZipUrl?.startsWith('http') ? "Tich_Hop_NLS_AI_THCS_Pass_123.zip" : undefined}
                    className="py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 shrink-0 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Tải Trọn Bộ V3 (Pass: 123)
                  </a>
                </div>
              </div>

              {/* 3. 4 LỰA CHỌN TẢI TỪNG PHẦN BẢN V3 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. Bản Cài Đặt Tự Động V3 */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                      .EXE
                    </div>
                    <h5 className="font-bold text-slate-200 text-xs">
                      Bộ Cài Tự Động V3 (.exe)
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      File: <code>Cai_Dat_Tich_Hop_NLS_AI_THCS.exe</code> (77 MB). Tự động cấu hình Desktop và Add-in Word 1-click.
                    </p>
                  </div>
                  <a
                    href={NLS_RESOURCES.exeUrl || "/Cai_Dat_Tich_Hop_NLS_AI_THCS.exe"}
                    target={NLS_RESOURCES.exeUrl?.startsWith('http') ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    download={!NLS_RESOURCES.exeUrl?.startsWith('http') ? "Cai_Dat_Tich_Hop_NLS_AI_THCS.exe" : undefined}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Tải File Cài Đặt V3 (.exe)
                  </a>
                </div>

                {/* 2. File Add-in Word V3 */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                      .DOTM
                    </div>
                    <h5 className="font-bold text-slate-200 text-xs">
                      Word Add-in Ribbon V3 (.dotm)
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      File: <code>TichHop_NLS_AI_THCS.dotm</code> (51.5 KB). Tab "TÍCH HỢP NLS & AI" trên thanh Ribbon Word với các nút tính năng mới V3.
                    </p>
                  </div>
                  <a
                    href="/TichHop_NLS_AI_THCS.dotm"
                    download="TichHop_NLS_AI_THCS.dotm"
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Tải Add-in Ribbon V3 (.dotm)
                  </a>
                </div>

                {/* 3. Video Hướng Dẫn */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                      .MP4
                    </div>
                    <h5 className="font-bold text-slate-200 text-xs">
                      Video Hướng Dẫn Full HD
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      File: <code>HD_tich_hop_NLS_AI.mp4</code>. Video chất lượng cao hướng dẫn chi tiết từng thao tác thực chiến.
                    </p>
                  </div>
                  <a
                    href="/HD_tich_hop_NLS_AI.mp4"
                    download="HD_tich_hop_NLS_AI.mp4"
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Tải Video HD (.mp4)
                  </a>
                </div>

                {/* 4. Hướng Dẫn Sử Dụng & Phụ Lục Mẫu */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      .DOCX
                    </div>
                    <h5 className="font-bold text-slate-200 text-xs">
                      Hướng Dẫn & Phụ Lục Mẫu V3
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      File: <code>HUONG_DAN_SU_DUNG.docx</code>. Hướng dẫn chi tiết nạp Phụ lục III và tùy chọn khuyết tật hòa nhập.
                    </p>
                  </div>
                  <a
                    href="/HUONG_DAN_SU_DUNG.docx"
                    download="HUONG_DAN_SU_DUNG.docx"
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Tải Hướng Dẫn (.docx)
                  </a>
                </div>
              </div>

              {/* 5 ĐIỂM NÂNG CẤP ĐẮT GIÁ CỦA PHIÊN BẢN V3 */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  Các điểm nâng cấp nổi bật trên Phiên bản V3 so với Bản cũ (V2):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <b className="text-cyan-300 block">1. Giáo dục Khuyết tật hòa nhập:</b>
                    <p className="text-slate-300 leading-relaxed">
                      Tích hợp chế độ riêng biệt cho học sinh khuyết tật hòa nhập (khiếm thính, khiếm thị, tự kỷ, chậm tiếp thu) với màu chữ xanh dương chuẩn <code>#0070C0</code>.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <b className="text-cyan-300 block">2. Ô Yêu Cầu Prompt Tự Do:</b>
                    <p className="text-slate-300 leading-relaxed">
                      Giáo viên có thể gõ trực tiếp yêu cầu văn bản riêng (ngắn gọn/chi tiết/lồng ghép chuyên đề), AI tự động nhận diện và đáp ứng đúng mong muốn.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <b className="text-cyan-300 block">3. Cơ Chế Single Instance:</b>
                    <p className="text-slate-300 leading-relaxed">
                      Chống mở trùng lặp nhiều cửa sổ ứng dụng gây xung đột tệp Word và hao tốn tài nguyên CPU/RAM của máy tính.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <b className="text-cyan-300 block">4. Add-in Word Ribbon V3 Mới:</b>
                    <p className="text-slate-300 leading-relaxed">
                      Nâng cấp dung lượng 51.5 KB, tối ưu thanh Ribbon với các nút bấm trực quan, hỗ trợ Word 2013, 2016, 2019, 2021 và Office 365.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <b className="text-cyan-300 block">5. Multi-Anchor Mirror 4 Chốt:</b>
                    <p className="text-slate-300 leading-relaxed">
                      Bảo vệ tích lũy số lần dùng thử chống reset khi gỡ cài đặt, kiểm soát hạn ngạch cài đặt 5 máy tính an toàn tuyệt đối.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <b className="text-cyan-300 block">6. Bảo Toàn File Gốc 100%:</b>
                    <p className="text-slate-300 leading-relaxed">
                      Giữ nguyên vẹn 100% công thức toán học MathType/OMML, sơ đồ, tranh ảnh và bảng biểu theo chuẩn OpenXML của Microsoft Word.
                    </p>
                  </div>
                </div>
              </div>

              {/* HƯỚNG DẪN 3 BƯỚC THIẾT LẬP TRONG WORD */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Hướng dẫn kích hoạt tab "TÍCH HỢP NLS & AI THCS" trên thanh Ribbon của Word:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <b className="text-cyan-400 block mb-1">Bước 1: Tải file .dotm V3</b>
                    <p className="text-slate-300">
                      Tải file <code>TichHop_NLS_AI_THCS.dotm</code> ở trên và lưu vào một thư mục cố định trên máy (ví dụ: ổ D hoặc C).
                    </p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <b className="text-cyan-400 block mb-1">Bước 2: Thêm Trusted Location</b>
                    <p className="text-slate-300">
                      Mở Word &gt; <b>File</b> &gt; <b>Options</b> &gt; <b>Trust Center</b> &gt; <b>Trust Center Settings</b> &gt; <b>Trusted Locations</b> &gt; bấm <b>Add new location</b> chọn thư mục vừa lưu file.
                    </p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <b className="text-cyan-400 block mb-1">Bước 3: Mở giáo án & Sử dụng</b>
                    <p className="text-slate-300">
                      Mở file Word giáo án bất kì, tab <b>TÍCH HỢP NLS & AI THCS</b> sẽ xuất hiện trên thanh Ribbon để Thầy/Cô tích hợp 1-click!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: BẢN QUYỀN ED25519 PRO (MÃ MÁY & KÍCH HOẠT KEY V3) */}
          {/* ========================================================================= */}
          {activeTab === 'register' && (
            <div className="space-y-4">
              {/* KHUNG NHẬP KEY HOẶC KIỂM TRA BẢN QUYỀN */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-emerald-950/70 border border-amber-500/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-400" />
                    Đã nhận được mã kích hoạt từ Thầy Thành? Kích hoạt ngay:
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Bảo mật Chữ ký số Ed25519 (Chống bẻ khóa 100%)
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="Dán mã kích hoạt dạng: KEY-YYYYMMDD-XXXXXX-..."
                    className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-amber-400/40 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleActivateKey}
                    className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs whitespace-nowrap transition-colors shadow-md"
                  >
                    Kích Hoạt Ngay
                  </button>
                </div>

                {verifyResult && (
                  <p className={`text-xs font-semibold ${verifyResult.isValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {verifyResult.message}
                  </p>
                )}
              </div>

              {/* THÔNG TIN MÃ MÁY TÍNH HIỆN TẠI */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Laptop className="w-5 h-5 text-cyan-400" />
                  <div>
                    <span className="text-slate-400 text-[11px] block">
                      Mã máy tính của Thầy/Cô (Hardware Code):
                    </span>
                    <span className="font-mono text-cyan-300 font-bold text-sm">
                      {detectedMid || 'DVT-8F22-A109-5B3C'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(detectedMid, 'all')}
                  className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1.5 border border-slate-700"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Sao chép Mã máy
                </button>
              </div>

              {/* THẺ BÁO GIÁ & ĐĂNG KÝ BẢN QUYỀN - 1 LOẠI DUY NHẤT */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border-2 border-cyan-500/50 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        👑 CHÍNH SÁCH BẢN QUYỀN V3 CHÍNH THỨC
                      </span>
                      <span className="text-[10px] text-amber-400 font-semibold">Ưu Đãi Sư Phạm</span>
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-white mt-1">
                      Báo Giá Ưu Đãi & Tư Vấn Chi Tiết Theo Nhu Cầu
                    </h4>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <div className="text-sm sm:text-base font-black text-cyan-400">
                      Liên Hệ Admin Thầy Thành
                    </div>
                    <p className="text-[11px] text-slate-400">Tùy chọn: 1 Năm • 2 Năm • Trọn Đời Vĩnh Viễn</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span><strong>Trợ giá giáo dục:</strong> Chi phí hỗ trợ giáo viên cực kỳ tiết kiệm, Thầy Thành sẽ báo giá chi tiết trực tiếp qua Zalo.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span><strong>Tích hợp NLS, AI & Khuyết tật hòa nhập V3:</strong> Tự động tích hợp khung năng lực số và học sinh hòa nhập cho 12 môn học THCS.</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span><strong>Cài đặt từ xa miễn phí:</strong> Hỗ trợ UltraViewer / TeamViewer cài trọn gói lên máy tính, bảo hành hỗ trợ 24/7.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span><strong>Cập nhật dài lâu:</strong> Miễn phí nâng cấp các phiên bản tiếp theo theo thông tư mới của Bộ GD&ĐT.</span>
                    </div>
                  </div>
                </div>

                {/* NÚT BẤM LIÊN HỆ ZALO BÁO GIÁ DUY NHẤT */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={`https://zalo.me/${BRAND.phoneRaw}?text=${encodeURIComponent(
                      `Chào Thầy Thành, tôi muốn nhận tư vấn và báo giá chi tiết phần mềm Tích Hợp NLS - AI THCS V3. Mã máy của tôi: ${detectedMid}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition active:scale-[0.98] cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5 text-amber-300" />
                    Nhắn Tin Zalo Nhận Báo Giá Chi Tiết ({BRAND.phone})
                  </a>
                </div>
              </div>

              {/* FORM ĐĂNG KÝ BẢN QUYỀN TRỰC TIẾP */}
              {regSuccess ? (
                <div className="p-5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-center space-y-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-bold text-emerald-300">
                    ĐÃ GHI NHẬN ĐĂNG KÝ BẢN QUYỀN V3!
                  </h4>
                  <p className="text-slate-300 text-xs max-w-md mx-auto">
                    Thông tin máy <b className="text-cyan-300 font-mono">{detectedMid}</b> của Thầy/Cô đã được lưu lại. Vui lòng bấm nút bên dưới để mở Zalo gửi xác nhận cho Thầy Thành.
                  </p>
                  <a
                    href={`https://zalo.me/${BRAND.phoneRaw}?text=${encodeURIComponent(
                      `Chào Thầy Thành, tôi đăng ký bản quyền Phần mềm Tích hợp NLS-AI THCS V3 cho máy ${detectedMid} (Gói: ${regPlan}, Tên: ${regName || 'Giáo viên'}, Trường: ${regSchool || 'THCS'}). Nhờ Thầy gửi giúp mã kích hoạt nhé!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 py-2.5 px-5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Mở Zalo Gửi Cho Thầy Thành ({BRAND.phone})
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmitRegister} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <span className="font-bold text-slate-200 block">
                    Đăng ký thông tin nhận Key kích hoạt Ed25519 V3:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Họ và tên Thầy/Cô *</label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Thầy/Cô Nguyễn Văn A"
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Số điện thoại / Zalo *</label>
                      <input
                        type="text"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="09xx.xxx.xxx"
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Trường học / Đơn vị</label>
                      <input
                        type="text"
                        value={regSchool}
                        onChange={(e) => setRegSchool(e.target.value)}
                        placeholder="Trường THCS..."
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Gói bản quyền đăng ký</label>
                      <select
                        value={regPlan}
                        onChange={(e) => setRegPlan(e.target.value as any)}
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="1YEAR">Gói 1 Năm (Hạn dùng 365 ngày)</option>
                        <option value="2YEAR">Gói 2 Năm (Khuyên dùng)</option>
                        <option value="3YEAR">Gói 3 Năm (Tiết kiệm)</option>
                        <option value="LIFETIME">Gói VIP Trọn Đời (Vĩnh viễn)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow"
                    >
                      Gửi Đăng Ký Lên Hệ Thống
                    </button>

                    <a
                      href={`https://zalo.me/${BRAND.phoneRaw}?text=${encodeURIComponent(
                        `Chào Thầy Thành, tôi muốn đăng ký bản quyền Phần mềm Tích hợp NLS-AI THCS V3 cho máy ${detectedMid}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-400 hover:underline text-[11px] font-semibold flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Chat trực tiếp Zalo: {BRAND.phone}
                    </a>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

        {/* FOOTER MODAL */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800/90 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 text-[11px] text-slate-400">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Phần mềm Tích hợp NLS - AI THCS V3 (Chuẩn CV 5512) – Bản quyền: Thầy giáo Đinh Văn Thành</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="py-1.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>

      </div>
      <TrialRegisterModal isOpen={showTrialRegister} onClose={() => setShowTrialRegister(false)} initialAppId="nls-ai" initialAppName="Tích Hợp NLS - AI THCS V3" />
    </div>
  );
};
