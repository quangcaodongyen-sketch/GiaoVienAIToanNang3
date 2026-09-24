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
  Award
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

export const NLSAIModal: React.FC<NLSAIModalProps> = ({ isOpen, onClose, onOpenAdmin }) => {
  const [activeTab, setActiveTab] = useState<'online' | 'download' | 'register'>('online');

  // State cho Tab 1: Trực tuyến
  const [selectedSubject, setSelectedSubject] = useState<string>('Toán');
  const [selectedGrade, setSelectedGrade] = useState<string>('Lớp 9');
  const [lessonName, setLessonName] = useState<string>(
    'Bài 1: Khái niệm phương trình và hệ hai phương trình bậc nhất hai ẩn'
  );
  const [integrationMode, setIntegrationMode] = useState<'exact' | 'ai_deep'>('ai_deep');

  // Checkboxes nội dung tích hợp
  const [integrateNLS, setIntegrateNLS] = useState(true);
  const [integrateAI, setIntegrateAI] = useState(true);
  const [integrateSTEM, setIntegrateSTEM] = useState(false);
  const [integrateANQP, setIntegrateANQP] = useState(false);
  const [integrateQCN, setIntegrateQCN] = useState(false);
  const [integrateBVMT, setIntegrateBVMT] = useState(false);
  const [integrateGDTC, setIntegrateGDTC] = useState(false);
  const [integrateXBHTLH, setIntegrateXBHTLH] = useState(false);
  const [integrateDisability, setIntegrateDisability] = useState(false);

  // Kết quả sinh ra
  const [generatedObjectives, setGeneratedObjectives] = useState<string>('');
  const [generatedProcedures, setGeneratedProcedures] = useState<string>('');
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

  // Sinh nội dung tích hợp mẫu chuẩn xác theo bộ quy tắc Thầy Thành
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

      if (isEnglish) {
        // Môn Tiếng Anh: 100% tiếng Anh
        setGeneratedObjectives(
          `I. OBJECTIVES / MỤC TIÊU BÀI DẠY (TÍCH HỢP CHUẨN):\n` +
          `* Language Competences: Master vocabulary and grammatical structures related to "${lessonName}".\n` +
          (integrateNLS ? `* Digital Competence [NLS.1.2 - NLS.3.1]: Use digital learning platforms, online dictionaries (Oxford, Cambridge), and educational quiz apps to enhance interactive language acquisition.\n` : '') +
          (integrateAI ? `* AI [AI.2 - AI.3]: Use generative AI tools to practice natural conversation, check pronunciation nuances, and verify grammar accuracy responsibly.\n` : '') +
          (integrateSTEM ? `* STEM [STEM.1]: Apply technical design and multimedia presentation skills to create interactive English vocabulary mindmaps.\n` : '') +
          (integrateBVMT ? `* Environmental Protection [BVMT.1]: Raise awareness of ecological balance, saving resources, and green lifestyle through topical discussions.\n` : '') +
          (integrateDisability ? `* For students with disabilities: Acquire core vocabulary at basic recognition level with visual flashcards, simplified tasks, and peer assistance.\n` : '')
        );

        setGeneratedProcedures(
          `III. TEACHING PROCEDURES / TIẾN TRÌNH DẠY HỌC (4 HOẠT ĐỘNG TÍCH HỢP SƯ PHẠM):\n\n` +
          `1. WARM-UP (KHỞI ĐỘNG) [NLS.1.1, AI.1]:\n` +
          `- T plays a multimedia video clip / audio dialogue to introduce the topic.\n` +
          `- Ss interact on digital devices / respond to quick lead-in questions.\n` +
          `- Expected product: High engagement, topic identification, and initial vocabulary activation.\n\n` +
          `2. KNOWLEDGE DISCOVERY (KHÁM PHÁ KIẾN THỨC) [NLS.1.2, AI.2]:\n` +
          `- T guides Ss to examine the dialogue, look up new words via digital dictionaries, and analyze grammar patterns.\n` +
          `- Ss work in pairs/groups, listen attentively to native pronunciations, and record key language points.\n` +
          `- Expected product: Completed vocabulary charts and accurate grammar comprehension notes.\n\n` +
          `3. PRACTICE (LUYỆN TẬP) [NLS.3.1, AI.3]:\n` +
          `- T assigns interactive digital practice tasks (gap-filling, sentence building, dialogue role-play).\n` +
          `- Ss practice speaking and writing, using AI assistant feedback to self-correct pronunciation and grammar errors.\n` +
          `- Expected product: Pairs perform communicative dialogues fluently with correct intonation.\n\n` +
          `4. APPLICATION (VẬN DỤNG) [NLS.5.2, STEM.1]:\n` +
          `- T sets a real-world communicative scenario or creative mini-project related to the topic.\n` +
          `- Ss collaborate in groups, design digital presentation slides/posters, and share practical viewpoints.\n` +
          `- Expected product: Group multimedia presentation and peer assessment report.`
        );
      } else {
        // 11 Môn học còn lại (tiếng Việt chuẩn Times New Roman 13pt)
        let objs = `I. MỤC TIÊU BÀI DẠY (TÍCH HỢP THEO CV 5512, TT 02/2025, QĐ 2422 & TT 08/2024):\n`;
        objs += `1. Kiến thức, kĩ năng chung của bài: Nắm vững và vận dụng kiến thức trọng tâm của bài "${lessonName}".\n`;
        objs += `2. Năng lực đặc thù & Nội dung tích hợp có mã chỉ báo chuẩn:\n`;
        if (integrateNLS) {
          objs += `   * NLS [NLS.1.2 - NLS.3.1]: Khai thác học liệu số, phần mềm chuyên dụng (GeoGebra/mô phỏng 3D/PhET/bảng tính điện tử) và thiết bị số để tra cứu, xử lí dữ liệu và trực quan hóa kiến thức bài học.\n`;
        }
        if (integrateAI) {
          objs += `   * AI [AI.2 - AI.3]: Sử dụng công cụ AI (trợ lí ngôn ngữ, AI hỗ trợ giải toán/khoa học) để đối chiếu kết quả, kiểm tra nghiệm, hỗ trợ tìm kiếm tài liệu và nâng cao năng lực tự học có trách nhiệm.\n`;
        }
        if (integrateSTEM) {
          objs += `   * STEM [STEM.1]: Vận dụng kiến thức liên môn, kĩ năng thiết kế mô hình và giải quyết vấn đề thực tiễn gắn với nội dung bài học.\n`;
        }
        if (integrateANQP) {
          objs += `   * ANQP [ANQP.1 - ANQP.2]: Giáo dục tinh thần yêu nước, ý thức bảo vệ chủ quyền biên giới, biển đảo và tự hào về truyền thống lực lượng vũ trang nhân dân (theo Thông tư 08/2024/TT-BGDĐT).\n`;
        }
        if (integrateQCN) {
          objs += `   * QCN [QCN.1]: Giáo dục quyền con người, tinh thần tôn trọng bạn bè, hợp tác nhóm và phòng chống bạo lực học đường (theo Quyết định 1309/QĐ-TTg).\n`;
        }
        if (integrateBVMT) {
          objs += `   * BVMT [BVMT.1]: Nâng cao ý thức bảo vệ môi trường, giữ gìn cảnh quan lớp học, tiết kiệm năng lượng và ứng phó biến đổi khí hậu.\n`;
        }
        if (integrateGDTC) {
          objs += `   * GDTC [GDTC.1]: Giáo dục tài chính, nâng cao kĩ năng lập kế hoạch và quản lí chi tiêu thông minh, hiệu quả.\n`;
        }
        if (integrateXBHTLH) {
          objs += `   * XBHTLH [XBHTLH.1]: Tuyên truyền xóa bỏ các hủ tục, phong tục lạc hậu, xây dựng nếp sống văn minh hiện đại trong gia đình và nhà trường.\n`;
        }
        if (integrateDisability) {
          objs += `   * Hỗ trợ HS khuyết tật: Tiếp thu kiến thức cốt lõi ở mức độ nhận biết cơ bản, rèn luyện tính tự tin, hòa nhập thông qua sự đồng hành của giáo viên và các bạn trong nhóm.\n`;
        }
        setGeneratedObjectives(objs);

        let procs = `III. TIẾN TRÌNH DẠY HỌC (PHÂN TÍCH SƯ PHẠM CHI TIẾT 4 HOẠT ĐỘNG):\n\n`;
        procs += `1. HOẠT ĐỘNG 1: KHỞI ĐỘNG (XÁC ĐỊNH VẤN ĐỀ) [NLS.1.1, AI.1]\n`;
        procs += `- Mục tiêu: Tạo tâm thế hứng thú, kết nối kiến thức đã có với vấn đề mới của bài học.\n`;
        procs += `- Hoạt động của GV: Trình chiếu video mô phỏng số / câu hỏi tình huống trên màn hình tương tác; giao nhiệm vụ cho cả lớp.\n`;
        procs += `- Hoạt động của HS: Quan sát, thảo luận nhanh theo cặp/bàn, tương tác trả lời câu hỏi khởi động.\n`;
        procs += `- Sản phẩm dự kiến: Câu trả lời của HS, tâm thế sẵn sàng tiếp cận nội dung bài học.\n\n`;

        procs += `2. HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI [NLS.1.2, AI.2, STEM.1]\n`;
        procs += `- Mục tiêu: Giúp HS lĩnh hội bản chất kiến thức trọng tâm bài "${lessonName}".\n`;
        procs += `- Hoạt động của GV: Hướng dẫn HS khai thác học liệu số, mô hình thực hành / phần mềm chuyên dụng (GeoGebra, PhET, bảng số liệu); định hướng HS phân tích rút ra quy tắc, định lí.\n`;
        procs += `- Hoạt động của HS: Thao tác trên thiết bị số/phiếu học tập, phân tích số liệu, thảo luận nhóm và đại diện báo cáo kết quả.\n`;
        procs += `- Sản phẩm dự kiến: Nội dung ghi bài hoàn chỉnh, các công thức, định nghĩa và kết luận khoa học được chuẩn hóa.\n\n`;

        procs += `3. HOẠT ĐỘNG 3: LUYỆN TẬP [NLS.3.1, AI.2, AI.3]\n`;
        procs += `- Mục tiêu: Củng cố, khắc sâu kiến thức, rèn kĩ năng giải bài tập và sử dụng công cụ số thành thạo.\n`;
        procs += `- Hoạt động của GV: Giao hệ thống bài tập phân hóa; hướng dẫn HS dùng máy tính cầm tay (MTCT) / phần mềm số / trợ lí AI để kiểm tra, đối chiếu nghiệm và kết quả.\n`;
        procs += `- Hoạt động của HS: Làm bài tập độc lập và thảo luận cặp đôi; tự đối chiếu kết quả, phát hiện và tự sửa lỗi sai.\n`;
        procs += `- Sản phẩm dự kiến: Lời giải chi tiết các bài tập trong vở và trên bảng nhóm.\n\n`;

        procs += `4. HOẠT ĐỘNG 4: VẬN DỤNG & MỞ RỘNG [NLS.5.2, STEM.1, BVMT.1]\n`;
        procs += `- Mục tiêu: Vận dụng kiến thức bài học để giải quyết các vấn đề thực tiễn trong cuộc sống và học tập.\n`;
        procs += `- Hoạt động của GV: Nêu tình huống thực tế hoặc giao dự án học tập nhỏ về nhà; hướng dẫn tìm kiếm tư liệu chính thống trên Internet.\n`;
        procs += `- Hoạt động của HS: Lập kế hoạch thực hiện theo nhóm, thu thập thông tin, chuẩn bị bài trình bày hoặc sản phẩm học tập.\n`;
        procs += `- Sản phẩm dự kiến: Báo cáo thực hành, bài thuyết trình số hoặc sản phẩm ứng dụng thực tiễn của nhóm.`;

        setGeneratedProcedures(procs);
      }

      setIsGenerating(false);
    }, 600);
  };

  // Copy to clipboard
  const handleCopy = (text: string, type: 'obj' | 'proc' | 'all') => {
    navigator.clipboard.writeText(text);
    setCopiedSection(type);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  // Tải file Word giả lập (.doc với HTML format để Word mở chuẩn 100%)
  const handleDownloadDoc = () => {
    const fullContent = `${generatedObjectives}\n\n${generatedProcedures}`;
    const htmlDoc = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${lessonName}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.3; }
        .integrated-text { color: #FF0000; font-family: 'Times New Roman', serif; font-size: 13pt; text-align: justify; }
        h1, h2 { font-family: 'Times New Roman', serif; font-size: 14pt; font-weight: bold; }
      </style>
      </head>
      <body>
        <h2>GIÁO ÁN TÍCH HỢP NLS & AI - CHUẨN CÔNG VĂN 5512</h2>
        <p><b>Môn:</b> ${selectedSubject} - <b>Lớp:</b> ${selectedGrade}</p>
        <p><b>Bài dạy:</b> ${lessonName}</p>
        <hr/>
        <div class="integrated-text" style="white-space: pre-wrap;">
${fullContent}
        </div>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff' + htmlDoc], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Tich_Hop_NLS_AI_${selectedSubject}_${lessonName.substring(0, 30)}.doc`;
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
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                  TÍCH HỢP NLS - AI THCS (ADD-INS V2)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  CV 5512 CHUẨN 2026
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
            <Sparkles className="w-4 h-4" />
            1. Trải Nghiệm Online (CV 5512)
          </button>

          <button
            onClick={() => setActiveTab('download')}
            className={`pb-3 px-3 font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'download'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            2. Tải Bản Cài Desktop & Word Add-in
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`pb-3 px-3 font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'register'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Crown className="w-4 h-4" />
            3. Bản Quyền Ed25519 Pro
          </button>
        </div>

        {/* BODY MODAL CONTENT */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-xs">

          {/* ========================================================================= */}
          {/* TAB 1: TRẢI NGHIỆM TRỰC TUYẾN (ONLINE AI INTEGRATION GENERATOR) */}
          {/* ========================================================================= */}
          {activeTab === 'online' && (
            <div className="space-y-4">
              {/* Box hướng dẫn nhanh */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-emerald-200">
                      Hệ thống tự động thiết kế nội dung tích hợp Năng lực số (NLS), AI, STEM, ANQP vào giáo án Word chuẩn thể thức:
                    </p>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Định dạng chuẩn <b>Times New Roman, 13pt, màu đỏ chuẩn (#FF0000)</b>, gắn mã chỉ báo chuẩn quốc gia (<code className="text-amber-300">[NLS.1.2 - NLS.3.1]</code>, <code className="text-amber-300">[AI.2 - AI.3]</code>, <code className="text-amber-300">[STEM.1]</code>) đồng bộ cho Mục I và Mục III (4 hoạt động dạy học).
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
                        👑 BẢN QUYỀN PRO: ĐÃ KÍCH HOẠT CHÍNH THỨC
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Mã máy: <b className="text-cyan-300 font-mono">{detectedMid}</b> – Không giới hạn số lần tích hợp NLS & AI cho 12 môn THCS.
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
                        DÙNG THỬ TÍCH HỢP NLS MIỄN PHÍ TRÊN MÁY TÍNH NÀY:
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
                      (Mỗi máy tính được tặng 5 lượt tích hợp NLS miễn phí)
                    </span>
                  </div>
                </div>
              )}

              {/* BỘ LỌC CẤU HÌNH TÍCH HỢP */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
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
                    <option value="ai_deep">Phân tích Sư phạm AI chi tiết (Mục I & III)</option>
                    <option value="exact">Tích hợp Nguyên văn Phụ lục III</option>
                  </select>
                </div>

                {/* Tên bài học / Chủ đề */}
                <div className="md:col-span-3">
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
                        Gợi ý:
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

              {/* NỘI DUNG TÍCH HỢP (CHECKBOXES) */}
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="font-bold text-slate-200 block">
                  Chọn các chuyên đề tích hợp vào bài giảng này:
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
                      checked={integrateDisability}
                      onChange={(e) => setIntegrateDisability(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    <span className="text-slate-200 font-medium">HS khuyết tật/hòa nhập</span>
                  </label>
                </div>
              </div>

              {/* NÚT THỰC THI SINH NỘI DUNG */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                {!isProActive && trialRemaining <= 0 ? (
                  <a
                    href={`https://zalo.me/${BRAND.phoneRaw}?text=${encodeURIComponent(
                      `Chào Thầy Thành, tôi đã dùng thử hết 5 lượt phần mềm Tích hợp NLS - AI THCS V2. Nhờ Thầy báo giá ưu đãi và hướng dẫn kích hoạt bản quyền giúp tôi (Mã máy: ${detectedMid}).`
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
                      ? 'Đang phân tích sư phạm AI...' 
                      : !isProActive
                      ? `Sinh Nội Dung Tích Hợp AI (Còn ${trialRemaining}/5 lượt)`
                      : 'Sinh Nội Dung Tích Hợp AI (Chuẩn CV 5512)'}
                  </button>
                )}

                {generatedObjectives && (
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => handleCopy(`${generatedObjectives}\n\n${generatedProcedures}`, 'all')}
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
                      Tải File Word (.doc)
                    </button>
                  </div>
                )}
              </div>

              {/* KẾT QUẢ HIỂN THỊ */}
              {generatedObjectives ? (
                <div className="space-y-3 pt-2">
                  {/* Mục I: Mục tiêu */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-amber-300 flex items-center gap-1.5 text-xs sm:text-sm">
                        <BookOpen className="w-4 h-4 text-amber-400" />
                        MỤC I. MỤC TIÊU BÀI DẠY (CÓ GẮN MÃ CHỈ BÁO)
                      </span>
                      <button
                        onClick={() => handleCopy(generatedObjectives, 'obj')}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 flex items-center gap-1"
                      >
                        {copiedSection === 'obj' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedSection === 'obj' ? 'Đã sao chép' : 'Sao chép Mục I'}
                      </button>
                    </div>
                    <div className="font-serif text-[13px] leading-relaxed text-rose-400 whitespace-pre-wrap pl-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                      {generatedObjectives}
                    </div>
                  </div>

                  {/* Mục III: Tiến trình 4 hoạt động */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-cyan-300 flex items-center gap-1.5 text-xs sm:text-sm">
                        <Layers className="w-4 h-4 text-cyan-400" />
                        MỤC III. TIẾN TRÌNH DẠY HỌC (4 HOẠT ĐỘNG PHÂN TÍCH SƯ PHẠM CHI TIẾT)
                      </span>
                      <button
                        onClick={() => handleCopy(generatedProcedures, 'proc')}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 flex items-center gap-1"
                      >
                        {copiedSection === 'proc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedSection === 'proc' ? 'Đã sao chép' : 'Sao chép Mục III'}
                      </button>
                    </div>
                    <div className="font-serif text-[13px] leading-relaxed text-rose-400 whitespace-pre-wrap pl-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                      {generatedProcedures}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 border border-dashed border-slate-800 rounded-2xl p-6 text-slate-500">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  <p className="font-medium text-slate-400">
                    Bấm nút "Sinh Nội Dung Tích Hợp AI" ở trên để tạo tự động nội dung chuẩn xác cho giáo án.
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Hỗ trợ đầy đủ 12 môn học THCS và tất cả các chuyên đề NLS, AI, STEM, ANQP, QCN theo quy định mới nhất.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: TẢI BẢN CÀI DESKTOP, VIDEO HD & WORD ADD-IN (.DOTM / .EXE) */}
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
                      Tải Video HD (12 MB)
                    </a>
                  </div>
                </div>
              </div>

              {/* 2. BANNER TẢI TRỌN BỘ CÀI ĐẶT */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-blue-950/70 border border-cyan-500/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-cyan-200 flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-cyan-400" />
                      Trọn Bộ Cài Đặt Desktop & Word Add-in Tích Hợp NLS-AI V2
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Bao gồm bộ cài tự động 1-click, file Word Add-in thanh Ribbon và toàn bộ tài liệu hướng dẫn chuẩn CV 5512.
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
                    Tải Trọn Bộ (Pass: 123)
                  </a>
                </div>
              </div>

              {/* 3. 4 LỰA CHỌN TẢI TỪNG PHẦN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. Bản Cài Đặt Tự Động */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                      .EXE
                    </div>
                    <h5 className="font-bold text-slate-200 text-xs">
                      Bộ Cài Đặt Tự Động (.exe)
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      File: <code>Cai_Dat_Tich_Hop_NLS_AI_THCS.exe</code> (77 MB). Tự động tạo biểu tượng trên Desktop và cấu hình hệ thống.
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
                    Tải File Cài Đặt (.exe)
                  </a>
                </div>

                {/* 2. File Add-in Word */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                      .DOTM
                    </div>
                    <h5 className="font-bold text-slate-200 text-xs">
                      Word Add-in Ribbon (.dotm)
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      File: <code>TichHop_NLS_AI_THCS.dotm</code>. Gắn trực tiếp tab "TÍCH HỢP NLS & AI" trên thanh Ribbon của Microsoft Word.
                    </p>
                  </div>
                  <a
                    href="/TichHop_NLS_AI_THCS.dotm"
                    download="TichHop_NLS_AI_THCS.dotm"
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Tải File Add-in (.dotm)
                  </a>
                </div>

                {/* 3. Video Hướng Dẫn */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                      .MP4
                    </div>
                    <h5 className="font-bold text-slate-200 text-xs">
                      Video Hướng Dẫn Chi Tiết
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      File: <code>HD_tich_hop_NLS_AI.mp4</code> (52 MB). Video chất lượng Full HD hướng dẫn chi tiết từng thao tác.
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

                {/* 4. Hướng Dẫn Sử Dụng */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      .DOCX
                    </div>
                    <h5 className="font-bold text-slate-200 text-xs">
                      Hướng Dẫn & Phụ Lục Mẫu
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      File: <code>HUONG_DAN_SU_DUNG.docx</code>. Hướng dẫn chi tiết từng bước cài đặt, tích hợp vào Word và chuẩn bị giáo án.
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

              {/* HƯỚNG DẪN 3 BƯỚC THIẾT LẬP TRONG WORD */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Hướng dẫn kích hoạt tab "TÍCH HỢP NLS & AI" trên thanh Ribbon của Word:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <b className="text-cyan-400 block mb-1">Bước 1: Tải file .dotm</b>
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
          {/* TAB 3: BẢN QUYỀN ED25519 PRO (MÃ MÁY & KÍCH HOẠT KEY) */}
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

              {/* BẢNG BÁO GIÁ CÁC GÓI - ẨN GIÁ ĐỂ TẾ NHỊ & LIÊN HỆ ZALO */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <a
                  href={`https://zalo.me/${BRAND.phoneRaw}?text=${encodeURIComponent(
                    `Chào Thầy Thành, tôi muốn nhận báo giá ưu đãi Gói 1 Năm Phần mềm Tích hợp NLS-AI THCS V2 cho máy ${detectedMid}.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/60 transition-all cursor-pointer block"
                >
                  <span className="text-slate-400 block text-[11px]">Gói 1 Năm</span>
                  <span className="text-xs font-bold text-emerald-400 block my-1">Báo Giá Zalo</span>
                  <span className="text-[10px] text-slate-500">1 Máy tính</span>
                </a>
                <a
                  href={`https://zalo.me/${BRAND.phoneRaw}?text=${encodeURIComponent(
                    `Chào Thầy Thành, tôi muốn nhận báo giá ưu đãi Gói 2 Năm Phần mềm Tích hợp NLS-AI THCS V2 cho máy ${detectedMid}.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/60 transition-all cursor-pointer block"
                >
                  <span className="text-slate-400 block text-[11px]">Gói 2 Năm</span>
                  <span className="text-xs font-bold text-cyan-400 block my-1">Báo Giá Zalo</span>
                  <span className="text-[10px] text-slate-500">Tiết kiệm chi phí</span>
                </a>
                <a
                  href={`https://zalo.me/${BRAND.phoneRaw}?text=${encodeURIComponent(
                    `Chào Thầy Thành, tôi muốn nhận báo giá ưu đãi Gói 3 Năm Phần mềm Tích hợp NLS-AI THCS V2 cho máy ${detectedMid}.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/60 transition-all cursor-pointer block"
                >
                  <span className="text-slate-400 block text-[11px]">Gói 3 Năm</span>
                  <span className="text-xs font-bold text-purple-400 block my-1">Báo Giá Zalo</span>
                  <span className="text-[10px] text-slate-500">Khuyên dùng</span>
                </a>
                <a
                  href={`https://zalo.me/${BRAND.phoneRaw}?text=${encodeURIComponent(
                    `Chào Thầy Thành, tôi muốn nhận báo giá ưu đãi Gói VIP Trọn Đời Phần mềm Tích hợp NLS-AI THCS V2 cho máy ${detectedMid}.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-slate-950 border border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer block"
                >
                  <span className="text-amber-300 block text-[11px] font-bold">Gói VIP Trọn Đời</span>
                  <span className="text-xs font-bold text-amber-400 block my-1">Báo Giá VIP</span>
                  <span className="text-[10px] text-slate-400">Vĩnh viễn không hết hạn</span>
                </a>
              </div>

              {/* FORM ĐĂNG KÝ BẢN QUYỀN TRỰC TIẾP */}
              {regSuccess ? (
                <div className="p-5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-center space-y-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-bold text-emerald-300">
                    ĐÃ GHI NHẬN ĐĂNG KÝ BẢN QUYỀN!
                  </h4>
                  <p className="text-slate-300 text-xs max-w-md mx-auto">
                    Thông tin máy <b className="text-cyan-300 font-mono">{detectedMid}</b> của Thầy/Cô đã được lưu lại. Vui lòng bấm nút bên dưới để mở Zalo gửi xác nhận cho Thầy Thành.
                  </p>
                  <a
                    href={`https://zalo.me/${BRAND.phoneRaw}?text=${encodeURIComponent(
                      `Chào Thầy Thành, tôi đăng ký bản quyền Phần mềm Tích hợp NLS-AI THCS V2 cho máy ${detectedMid} (Gói: ${regPlan}, Tên: ${regName || 'Giáo viên'}, Trường: ${regSchool || 'THCS'}). Nhờ Thầy gửi giúp mã kích hoạt nhé!`
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
                    Đăng ký thông tin nhận Key kích hoạt Ed25519:
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
                        `Chào Thầy Thành, tôi muốn đăng ký bản quyền Phần mềm Tích hợp NLS-AI THCS V2 cho máy ${detectedMid}.`
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
            <span>Phần mềm Tích hợp NLS - AI THCS V2 – Bản quyền: Thầy giáo Đinh Văn Thành</span>
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
    </div>
  );
};
