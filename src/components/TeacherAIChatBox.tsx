import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Phone, 
  Volume2, 
  VolumeX, 
  Download, 
  ExternalLink, 
  Copy, 
  Check, 
  Minimize2, 
  Maximize2,
  ChevronRight,
  HelpCircle,
  Laptop,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { 
  BRAND, 
  EXAM_7MON_RESOURCES, 
  EXAM_RESOURCES, 
  EXAM_THPT_RESOURCES, 
  NLS_RESOURCES, 
  SMART_LISTENING_RESOURCES,
  MATHSTUDIO_RESOURCES,
  PRICING
} from '../config/brand';

export interface TeacherAIChatBoxProps {
  onOpenApp?: (appId: string, subjectKey?: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  actions?: Array<{
    label: string;
    icon?: string;
    actionType: 'open-modal' | 'download-exe' | 'download-zip' | 'open-url' | 'zalo';
    appId?: string;
    subjectKey?: string;
    url?: string;
    primary?: boolean;
  }>;
}

// Hàm phát tiếng chuông chào đón bằng Web Audio API (không phụ thuộc file ngoài)
const playWelcomeChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Nốt 1: E5 (659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.6);

    // Nốt 2: B5 (987.77 Hz) ngân chuông êm ái
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, now + 0.15);
    gain2.gain.setValueAtTime(0.18, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 1.2);
  } catch (e) {
    // Autoplay policy fallback
  }
};

export const TeacherAIChatBox: React.FC<TeacherAIChatBoxProps> = ({ onOpenApp }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'zalo'>('ai');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcomeBubble, setShowWelcomeBubble] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [unreadCount, setUnreadCount] = useState(1);
  const [copiedZalo, setCopiedZalo] = useState(false);
  const [zaloDirectMessage, setZaloDirectMessage] = useState('Thầy Thành ơi, mình cần hỗ trợ tư vấn phần mềm tạo đề và bản quyền.');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasPlayedSoundRef = useRef(false);

  // Tin nhắn ban đầu
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'bot',
      text: '👋 Dạ kính chào Thầy/Cô! Em là Trợ lý AI của Thầy giáo Đinh Văn Thành (Trường THCS Đồng Yên).\n\nEm sẵn sàng hỗ trợ Thầy/Cô:\n• Lấy link tải & mở phần mềm Tạo Đề theo môn (Toán, Tiếng Anh, KHTN, Văn, Sử, Địa, Tin...)\n• Tải bộ 10 đề Giữa kỳ 1 Lớp 9 chuẩn tập huấn 2026-2027\n• Hướng dẫn lấy Mã máy tính & Kích hoạt bản quyền Ed25519\n• Giải đáp mọi thắc mắc kỹ thuật & kết nối trực tiếp với Thầy Thành qua Zalo 0915.213717.\n\nThầy/Cô cần hỗ trợ nội dung gì ạ?',
      timestamp: 'Vừa xong',
      actions: [
        { label: '📐 Tạo Đề Toán THCS (Mới nhất)', actionType: 'open-modal', appId: 'tao-de-toan-thcs', subjectKey: 'TOAN', primary: true },
        { label: '🇬🇧 Tạo Đề Tiếng Anh Global', actionType: 'open-modal', appId: 'tao-de-tieng-anh', primary: true },
        { label: '📚 Bộ 10 đề Giữa kỳ 1 Toán 9', actionType: 'open-modal', appId: 'tao-de-toan-thcs', subjectKey: 'TOAN' },
        { label: '🔑 Hướng dẫn lấy Mã Máy', actionType: 'open-modal', appId: 'trial' }
      ]
    }
  ]);

  // Âm thanh chào đón khi vào web
  useEffect(() => {
    const timer = setTimeout(() => {
      if (soundEnabled && !hasPlayedSoundRef.current) {
        playWelcomeChime();
        hasPlayedSoundRef.current = true;
      }
      setShowWelcomeBubble(true);
    }, 1500);

    const handleFirstInteraction = () => {
      if (soundEnabled && !hasPlayedSoundRef.current) {
        playWelcomeChime();
        hasPlayedSoundRef.current = true;
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [soundEnabled]);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  // Bộ phân tích câu hỏi tự động (Smart NLP Matcher)
  const processQuery = (rawText: string) => {
    const query = rawText.toLowerCase().trim();

    // 1. MÔN TOÁN THCS / TOÁN 9 / 10 ĐỀ GIỮA KỲ
    if (
      query.includes('toán') || 
      query.includes('toan') || 
      query.includes('toán 9') || 
      query.includes('toan 9') || 
      query.includes('giữa kỳ') || 
      query.includes('giua ky') || 
      query.includes('10 đề') || 
      query.includes('10 de') ||
      query.includes('ma trận toán')
    ) {
      return {
        text: '📐 **PHẦN MỀM TẠO ĐỀ TOÁN THCS (CV 7991/BGDĐT) - BẢN CẬP NHẬT MỚI NHẤT 2026-2027**\n\n' +
          '• **Bám sát tài liệu tập huấn Ra đề Toán 9 năm 2026-2027**:\n' +
          '  - Tùy chọn linh hoạt từng bài học theo tiến độ từng trường (Đại số & Hình học độc lập).\n' +
          '  - **Giải thuật xáo trộn ngẫu nhiên cân bằng 3A-3B-3C-3D** (triệt tiêu hoàn toàn lỗi toàn đáp án A).\n' +
          '  - Kèm sẵn **Bộ 10 đề Giữa kì 1 Lớp 9 chuẩn Bộ GD&ĐT** (đầy đủ đề Giáo viên có ma trận 16 cột 3 tầng + đặc tả 7 cột + hướng dẫn chấm chi tiết và bản in Học sinh).\n' +
          '• Tích hợp Add-in Ribbon Word 1-Click vĩnh viễn (xóa file ngoài Desktop vẫn dùng tốt).\n' +
          '• Hạn ngạch cài đặt 5 máy tính an toàn bảo mật Ed25519.',
        actions: [
          { label: '🚀 MỞ CÔNG CỤ TẠO ĐỀ TOÁN NGAY', actionType: 'open-modal' as const, appId: 'tao-de-toan-thcs', subjectKey: 'TOAN', primary: true },
          { label: '📥 Tải Bộ Cài Đặt (.EXE - 78 MB)', actionType: 'open-url' as const, url: 'https://github.com/quangcaodongyen-sketch/GiaoVienAIToanNang3/releases/download/v3.0-nls/Cai_Dat_TaoDe_TOAN_THCS.exe' },
          { label: '📦 Tải File Zip (Pass: 123)', actionType: 'open-url' as const, url: 'https://github.com/quangcaodongyen-sketch/GiaoVienAIToanNang3/releases/download/v3.0-nls/Tao_De_Toan_THCS_Pass_123.zip' },
          { label: '💬 Chat Zalo Với Thầy Thành', actionType: 'zalo' as const }
        ]
      };
    }

    // 2. MÔN TIẾNG ANH (GLOBAL SUCCESS / 15 PHÚT / THPT)
    if (
      query.includes('tiếng anh') || 
      query.includes('tieng anh') || 
      query.includes('english') || 
      query.includes('global') || 
      query.includes('15 phút') || 
      query.includes('15 phut') ||
      query.includes('luyện nghe') ||
      query.includes('luyen nghe')
    ) {
      return {
        text: '🇬🇧 **BỘ PHẦN MỀM TẠO ĐỀ TIẾNG ANH GLOBAL SUCCESS (LỚP 6-12)**\n\n' +
          '• **Chuẩn giáo trình Global Success & CV 7991/BGDĐT**:\n' +
          '  - Tự động sinh Ma trận 16 cột, Bản đặc tả 7 cột có dòng Tổng.\n' +
          '  - Tạo đề kiểm tra 15 phút, Giữa kỳ, Cuối kỳ kèm file Audio bài nghe chuẩn giọng bản xứ.\n' +
          '  - Hỗ trợ cả cấp Tiểu học, THCS và THPT (Lớp 10, 11, 12).\n' +
          '  - Định dạng chuẩn sư phạm không lỗi dãn dòng Word, công thức và ký hiệu phiên âm quốc tế chuẩn.',
        actions: [
          { label: '🚀 Mở Tạo Đề Tiếng Anh THCS', actionType: 'open-modal' as const, appId: 'tao-de-tieng-anh', primary: true },
          { label: '🌟 Mở Tạo Đề Tiếng Anh THPT', actionType: 'open-modal' as const, appId: 'tao-de-tieng-anh-thpt' },
          { label: '🎧 Tạo Bài Nghe Audio AI', actionType: 'open-modal' as const, appId: 'text-to-speech' },
          { label: '💬 Hỗ Trợ Zalo Thầy Thành', actionType: 'zalo' as const }
        ]
      };
    }

    // 3. MÔN KHTN (KHOA HỌC TỰ NHIÊN / LÝ / HÓA / SINH)
    if (
      query.includes('khtn') || 
      query.includes('khoa học tự nhiên') || 
      query.includes('vật lí') || 
      query.includes('vat li') || 
      query.includes('vật lý') || 
      query.includes('hóa học') || 
      query.includes('hoa hoc') || 
      query.includes('sinh học') || 
      query.includes('sinh hoc')
    ) {
      return {
        text: '🔬 **PHẦN MỀM TẠO ĐỀ KHOA HỌC TỰ NHIÊN THCS (CV 7991)**\n\n' +
          '• Phân bổ mạch kiến thức chuẩn Bộ GD&ĐT: Chất và sự biến đổi của chất (Hóa), Vật sống (Sinh), Năng lượng và sự biến đổi (Lý), Trái Đất và bầu trời.\n' +
          '• Tự động tạo ma trận, bản đặc tả và đề thi chuẩn đẹp kèm công thức và ký hiệu hóa học chuẩn.',
        actions: [
          { label: '🚀 MỞ CÔNG CỤ TẠO ĐỀ KHTN NGAY', actionType: 'open-modal' as const, appId: 'tao-de-khtn-thcs', subjectKey: 'KHTN', primary: true },
          { label: '📦 Tải Bản Nén (.ZIP Pass: 123)', actionType: 'open-url' as const, url: 'https://github.com/quangcaodongyen-sketch/GiaoVienAIToanNang3/releases/download/v3.0-nls/Tao_De_KHTN_THCS_Pass_123.zip' },
          { label: '💬 Chat Zalo Với Thầy Thành', actionType: 'zalo' as const }
        ]
      };
    }

    // 4. MÔN NGỮ VĂN
    if (
      query.includes('văn') || 
      query.includes('van') || 
      query.includes('ngữ văn') || 
      query.includes('ngu van') || 
      query.includes('đọc hiểu') || 
      query.includes('doc hieu') ||
      query.includes('viết bài')
    ) {
      return {
        text: '📖 **PHẦN MỀM TẠO ĐỀ NGỮ VĂN THCS & THPT (CV 7991 & 2025+)**\n\n' +
          '• Chuẩn cấu trúc: Phần Đọc hiểu (ngữ liệu ngoài SGK) + Phần Viết (nghị luận xã hội / nghị luận văn học).\n' +
          '• Xuất ma trận, bản đặc tả, đề thi và thang điểm hướng dẫn chấm chi tiết, biểu điểm barem chuẩn Bộ.',
        actions: [
          { label: '🚀 MỞ CÔNG CỤ TẠO ĐỀ VĂN THCS', actionType: 'open-modal' as const, appId: 'tao-de-van-thcs', subjectKey: 'VAN', primary: true },
          { label: '🌟 Mở Tạo Đề Ngữ Văn THPT', actionType: 'open-modal' as const, appId: 'tao-de-thpt-subject', subjectKey: 'NGUVAN' },
          { label: '💬 Chat Zalo Thầy Thành', actionType: 'zalo' as const }
        ]
      };
    }

    // 5. CÁC MÔN KHÁC: LỊCH SỬ, ĐỊA LÍ, TIN HỌC, CÔNG NGHỆ, GDCD
    if (
      query.includes('sử') || 
      query.includes('su') || 
      query.includes('địa') || 
      query.includes('dia') || 
      query.includes('tin') || 
      query.includes('công nghệ') || 
      query.includes('cong nghe') || 
      query.includes('gdcd') ||
      query.includes('giáo dục công dân')
    ) {
      let subjKey = 'GDCD';
      let title = 'Giáo dục công dân';
      if (query.includes('sử') || query.includes('su') || query.includes('địa') || query.includes('dia')) {
        subjKey = 'SUDIA';
        title = 'Lịch sử & Địa lí';
      } else if (query.includes('tin')) {
        subjKey = 'TIN';
        title = 'Tin học';
      } else if (query.includes('công nghệ') || query.includes('cong nghe')) {
        subjKey = 'CN';
        title = 'Công nghệ';
      }

      return {
        text: `🏛️ **PHẦN MỀM TẠO ĐỀ ${title.toUpperCase()} THCS (CV 7991)**\n\n` +
          '• Trọn bộ ngân hàng câu hỏi bám sát sách Kết nối tri thức, Cánh diều, Chân trời sáng tạo.\n' +
          '• Xuất ma trận 16 cột 3 tầng, đặc tả 7 cột và barem chấm chuẩn Bộ GD&ĐT 1-click vào Word.',
        actions: [
          { label: `🚀 MỞ TẠO ĐỀ ${title.toUpperCase()}`, actionType: 'open-modal' as const, appId: 'tao-de-thcs-8mon', subjectKey: subjKey, primary: true },
          { label: '💬 Chat Zalo Thầy Thành', actionType: 'zalo' as const }
        ]
      };
    }

    // 6. TÍCH HỢP NĂNG LỰC SỐ (NLS) & AI VÀO GIÁO ÁN
    if (
      query.includes('nls') || 
      query.includes('năng lực số') || 
      query.includes('nang luc so') || 
      query.includes('giáo án') || 
      query.includes('giao an') || 
      query.includes('5512') || 
      query.includes('add-in') || 
      query.includes('addin')
    ) {
      return {
        text: '📝 **ADD-IN TÍCH HỢP NĂNG LỰC SỐ (NLS) & AI VÀO GIÁO ÁN 5512**\n\n' +
          '• Tự động quét và chèn 5 miền năng lực số (Thông tư 02/2025/BGDĐT) vào các hoạt động giáo án.\n' +
          '• Tích hợp thanh Ribbon Word tiện dụng, chỉ cần mở giáo án bấm 1 nút là hoàn thành.\n' +
          '• Định dạng Word chuẩn không lỗi dãn dòng, giữ nguyên cấu trúc bảng giáo án.',
        actions: [
          { label: '🚀 MỞ CÔNG CỤ TÍCH HỢP NLS & AI', actionType: 'open-modal' as const, appId: 'tich-hop-nls-ai', primary: true },
          { label: '📦 Tải Bản Cài Đặt Add-in (.ZIP Pass: 123)', actionType: 'open-url' as const, url: 'https://github.com/quangcaodongyen-sketch/GiaoVienAIToanNang3/releases/download/v3.0-nls/Tich_Hop_NLS_AI_THCS_Pass_123.zip' },
          { label: '💬 Hỗ Trợ Zalo Thầy Thành', actionType: 'zalo' as const }
        ]
      };
    }

    // 7. BẢN QUYỀN / KEY / MÃ MÁY / DÙNG THỬ / GIÁ CẢ
    if (
      query.includes('key') || 
      query.includes('mã máy') || 
      query.includes('ma may') || 
      query.includes('bản quyền') || 
      query.includes('ban quyen') || 
      query.includes('dùng thử') || 
      query.includes('dung thu') || 
      query.includes('giá') || 
      query.includes('gia') || 
      query.includes('chi phí') || 
      query.includes('kích hoạt')
    ) {
      return {
        text: '🔑 **CHÍNH SÁCH BẢN QUYỀN & MÃ MÁY TÍNH (DVT-XXXX-XXXX)**\n\n' +
          '• **Chính sách dùng thử**: Mọi giáo viên được **trải nghiệm miễn phí 5 lần** trên máy tính.\n' +
          '• **Mã máy tính (Hardware Code)**: Mỗi máy có mã riêng biệt dạng `DVT-XXXX-XXXX-XXXX`.\n' +
          '• **Bảo mật đa tầng Ed25519**: Sau khi Thầy Thành cấp Key, bản quyền được gắn vĩnh viễn với thiết bị (cài qua UltraViewer xong có thể xóa file cài đặt mà Word vẫn chạy bình thường).\n' +
          '• **Hạn ngạch**: Hỗ trợ kích hoạt tối đa **5 máy tính** theo nhu cầu giáo viên.\n' +
          '• **Chi phí sư phạm**: Rất ưu đãi cho thầy cô giáo vùng cao và giáo viên cả nước.',
        actions: [
          { label: '💻 Xem Mã Máy & Dùng Thử Ngay', actionType: 'open-modal' as const, appId: 'trial', primary: true },
          { label: '💬 Nhắn Zalo Thầy Thành Lấy Key', actionType: 'zalo' as const, primary: true },
          { label: '📞 Gọi Hotline: 0915.213717', actionType: 'open-url' as const, url: 'tel:0915213717' }
        ]
      };
    }

    // 8. HƯỚNG DẪN CÀI ĐẶT / LỖI WORD / MỞ WORD
    if (
      query.includes('cài đặt') || 
      query.includes('cai dat') || 
      query.includes('lỗi word') || 
      query.includes('loi word') || 
      query.includes('ribbon') || 
      query.includes('startup') || 
      query.includes('mật khẩu') || 
      query.includes('pass')
    ) {
      return {
        text: '⚙️ **HƯỚNG DẪN CÀI ĐẶT VÀ KHẮC PHỤC SỰ CỐ**\n\n' +
          '1. **Mật khẩu giải nén**: Mọi file nén đều dùng mật khẩu là **`123`** để tránh Windows Defender hoặc trình duyệt chặn tải.\n' +
          '2. **Cài đặt 1-Click**: Mở file `Cai_Dat_TaoDe_...exe`, bấm nút **"CÀI ĐẶT VÀO WORD (1-CLICK)"** -> Hệ thống tự cấu hình Trusted Locations, Macro Trust và đưa thanh công cụ vào Word STARTUP.\n' +
          '3. **Lưu vĩnh viễn**: Bộ cài tự copy vào `%APPDATA%`, Thầy/Cô xóa file cài đặt ngoài Desktop thì Word vẫn dùng vĩnh viễn!\n' +
          '4. Nếu cần hỗ trợ cài qua UltraViewer / AnyDesk, Thầy Thành sẵn sàng hỗ trợ trực tiếp từ xa.',
        actions: [
          { label: '💬 Kết Nối Zalo Thầy Thành Hỗ Trợ', actionType: 'zalo' as const, primary: true },
          { label: '📞 Hotline: 0915.213717', actionType: 'open-url' as const, url: 'tel:0915213717' }
        ]
      };
    }

    // 9. CÂU HỎI MẶC ĐỊNH / CHUNG CHUNG
    return {
      text: '✨ **TRỢ LÝ GIÁO VIÊN AI - HỖ TRỢ ĐA MÔN TOÀN DIỆN**\n\n' +
        'Dạ em đã nhận được yêu cầu của Thầy/Cô. Thầy/Cô có thể bấm vào các nút gợi ý bên dưới để mở ngay phần mềm, hoặc nhắn trực tiếp qua Zalo Thầy giáo Đinh Văn Thành để được tư vấn chu đáo nhất ạ!',
      actions: [
        { label: '📐 Tạo Đề Toán THCS (Mới nhất)', actionType: 'open-modal' as const, appId: 'tao-de-toan-thcs', subjectKey: 'TOAN', primary: true },
        { label: '🇬🇧 Tạo Đề Tiếng Anh THCS', actionType: 'open-modal' as const, appId: 'tao-de-tieng-anh', primary: true },
        { label: '🔬 Tạo Đề KHTN THCS', actionType: 'open-modal' as const, appId: 'tao-de-khtn-thcs', subjectKey: 'KHTN' },
        { label: '📝 Tích Hợp NLS-AI Vào Word', actionType: 'open-modal' as const, appId: 'tich-hop-nls-ai' },
        { label: '💬 Chat Trực Tiếp Zalo Thầy Thành', actionType: 'zalo' as const, primary: true }
      ]
    };
  };

  // Gửi tin nhắn trong Chatbot AI
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: 'Vừa xong'
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = processQuery(userText);
      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: response.text,
        timestamp: 'Vừa xong',
        actions: response.actions
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);

      if (soundEnabled) {
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(800, ctx.currentTime);
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.2);
        } catch (_) {}
      }
    }, 600);
  };

  // Xử lý khi click vào nút hành động trong tin nhắn
  const handleActionClick = (action: NonNullable<ChatMessage['actions']>[number]) => {
    if (action.actionType === 'open-modal' && action.appId) {
      if (onOpenApp) {
        onOpenApp(action.appId, action.subjectKey);
      } else {
        window.location.hash = action.appId === 'tao-de-toan-thcs' ? '#tao-de-toan' : '#' + action.appId;
      }
      setIsOpen(false);
    } else if (action.actionType === 'download-exe' || action.actionType === 'download-zip' || action.actionType === 'open-url') {
      if (action.url) {
        window.open(action.url, '_blank');
      }
    } else if (action.actionType === 'zalo') {
      window.open(BRAND.zaloUrl, '_blank');
    }
  };

  // Gửi tin nhắn trực tiếp qua Zalo Thầy Thành
  const handleSendZaloDirect = () => {
    const textEncoded = encodeURIComponent(zaloDirectMessage.trim());
    const cleanPhone = BRAND.phone.replace(/[^0-9]/g, '');
    const zaloUrl = `https://zalo.me/${cleanPhone}`;
    window.open(zaloUrl, '_blank');
  };

  const handleCopyZaloPhone = () => {
    navigator.clipboard.writeText(BRAND.phone);
    setCopiedZalo(true);
    setTimeout(() => setCopiedZalo(false), 2000);
  };

  return (
    <>
      {/* 1. BONG BÓNG CHÀO ĐÓN (WELCOME BUBBLE) */}
      {!isOpen && showWelcomeBubble && (
        <div className="fixed bottom-24 right-6 z-40 max-w-[290px] sm:max-w-[340px] p-3.5 rounded-2xl bg-slate-900/95 border border-cyan-500/40 shadow-2xl backdrop-blur-md text-slate-100 text-xs animate-bounce-subtle flex items-start gap-2.5">
          <div className="relative shrink-0">
            <img 
              src="/dinhvanthanh.jpg" 
              alt="Thầy giáo Đinh Thành" 
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400 shadow-md"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="font-bold text-cyan-300 text-[11px] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Thầy giáo Đinh Thành
              </span>
              <button 
                onClick={() => setShowWelcomeBubble(false)}
                className="text-slate-400 hover:text-white p-0.5"
                title="Đóng thông báo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-slate-200 text-[11px] leading-relaxed">
              👋 <strong>Kính chào Thầy/Cô!</strong> Cần lấy link tải phần mềm Tạo Đề môn gì hay kích hoạt bản quyền, em gửi ngay nhé!
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <button
                onClick={() => {
                  setIsOpen(true);
                  setShowWelcomeBubble(false);
                  setUnreadCount(0);
                }}
                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 transition shadow-sm"
              >
                <MessageCircle className="w-3 h-3" />
                <span>Mở Chat Box</span>
              </button>
              <a
                href={BRAND.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition"
              >
                Zalo Thầy Thành
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 2. NÚT NỔI LAUNCHER GÓC DƯỚI PHẢI */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setShowWelcomeBubble(false);
            setUnreadCount(0);
            if (soundEnabled && !hasPlayedSoundRef.current) {
              playWelcomeChime();
              hasPlayedSoundRef.current = true;
            }
          }}
          className="fixed bottom-6 right-6 z-40 p-2 sm:px-4 sm:py-2.5 rounded-full bg-gradient-to-r from-slate-900 via-cyan-950 to-emerald-950 hover:from-cyan-900 hover:to-emerald-900 text-white shadow-2xl shadow-cyan-950/60 flex items-center gap-2.5 border-2 border-cyan-400/50 hover:border-cyan-300 transition-all hover:scale-105 group"
          title="Chat Box Trợ Lý AI & Thầy giáo Đinh Thành"
        >
          {/* Avatar Thầy Thành với viền phát sáng */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-400 shadow-md ring-2 ring-cyan-400/50 group-hover:ring-cyan-300 transition">
              <img 
                src="/dinhvanthanh.jpg" 
                alt="Thầy Thành" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            {/* Chấm Online nhấp nháy */}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950"></span>
            </span>
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white font-black text-[10px] flex items-center justify-center border-2 border-slate-950 animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-cyan-300 tracking-wide">CHAT BOX THẦY THÀNH</span>
              <span className="inline-block px-1.5 py-0.2 text-[9px] font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Online
              </span>
            </div>
            <span className="text-[11px] text-slate-300 font-medium truncate max-w-[150px]">
              Trợ lý AI & Đinh Thành
            </span>
          </div>

          <MessageCircle className="w-5 h-5 text-emerald-400 animate-pulse shrink-0 ml-0.5" />
        </button>
      )}

      {/* 3. CỬA SỔ CHAT BOX (MODAL CHAT WINDOW) */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[calc(100vw-32px)] sm:w-[420px] h-[580px] max-h-[calc(100vh-32px)] rounded-3xl bg-slate-950/95 border border-cyan-500/40 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden animate-fade-in font-sans">
          
          {/* HEADER CHAT BOX */}
          <div className="p-3.5 bg-gradient-to-r from-slate-900 via-cyan-950 to-emerald-950 border-b border-cyan-500/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img 
                  src="/dinhvanthanh.jpg" 
                  alt="Thầy Đinh Thành" 
                  className="w-11 h-11 rounded-full object-cover border-2 border-emerald-400 shadow-md ring-2 ring-cyan-400/40"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950"></span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-black text-white leading-tight">
                    Thầy giáo Đinh Thành
                  </h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                    ✓ GV Pro
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Trường THCS Đồng Yên • 0915.213717
                </p>
                <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Trợ lý AI & Thầy Thành đang trực tuyến
                </p>
              </div>
            </div>

            {/* CÁC NÚT ĐIỀU KHIỂN HEADER */}
            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
                title={soundEnabled ? 'Tắt tiếng chuông' : 'Bật tiếng chuông'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
                title="Thu nhỏ Chat Box"
              >
                <Minimize2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-rose-900/40 hover:text-rose-300 transition"
                title="Đóng Chat Box"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* TAB SWITCHER: TRỢ LÝ AI vs CHAT ZALO */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-900/80 border-b border-slate-800/80 text-xs font-bold shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('ai')}
              className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
                activeTab === 'ai' 
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Trợ Lý AI Tự Động</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('zalo')}
              className={`py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
                activeTab === 'zalo' 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat Zalo Thầy Thành</span>
            </button>
          </div>

          {/* NỘI DUNG TAB 1: TRỢ LÝ AI TỰ ĐỘNG */}
          {activeTab === 'ai' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-950/70">
              
              {/* DANH SÁCH TIN NHẮN */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'bot' && (
                      <div className="w-7 h-7 rounded-full bg-cyan-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-3 shadow-md ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-tr-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      <div className="whitespace-pre-line leading-relaxed">
                        {msg.text}
                      </div>

                      {/* CÁC NÚT HÀNH ĐỘNG KÈM THEO TIN NHẮN */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-1.5">
                          {msg.actions.map((act, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleActionClick(act)}
                              className={`w-full py-1.5 px-2.5 rounded-xl text-[11px] font-bold flex items-center justify-between transition cursor-pointer ${
                                act.primary
                                  ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white shadow-md'
                                  : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700'
                              }`}
                            >
                              <span>{act.label}</span>
                              <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-80" />
                            </button>
                          ))}
                        </div>
                      )}

                      <div
                        className={`text-[9px] mt-1 text-right ${
                          msg.sender === 'user' ? 'text-cyan-200' : 'text-slate-500'
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>

                    {msg.sender === 'user' && (
                      <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-2.5 justify-start">
                    <div className="w-7 h-7 rounded-full bg-cyan-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-3 shadow-md flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]"></span>
                      <span className="text-[10px] text-slate-400 ml-1.5">Trợ lý Thầy Thành đang soạn tin...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* THANH GỢI Ý NHANH (QUICK PILLS) */}
              <div className="px-3 py-1.5 bg-slate-900/60 border-t border-slate-800/80 overflow-x-auto flex items-center gap-1.5 no-scrollbar shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setInputText('Cho tôi link tải app Tạo đề Toán THCS');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold whitespace-nowrap transition border border-slate-700"
                >
                  📐 App Toán THCS
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputText('10 đề Giữa kỳ 1 lớp 9');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold whitespace-nowrap transition border border-slate-700"
                >
                  📚 10 Đề GK1 Lớp 9
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputText('Tạo đề Tiếng Anh Global Success');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold whitespace-nowrap transition border border-slate-700"
                >
                  🇬🇧 Tiếng Anh Global
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputText('Cách lấy mã máy tính và bản quyền');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold whitespace-nowrap transition border border-slate-700"
                >
                  🔑 Mã Máy & Bản Quyền
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputText('Tích hợp Năng lực số vào giáo án 5512');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold whitespace-nowrap transition border border-slate-700"
                >
                  📝 Tích Hợp NLS-AI
                </button>
              </div>

              {/* Ô NHẬP TIN NHẮN */}
              <form onSubmit={handleSendMessage} className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Nhập câu hỏi (Ví dụ: Lấy link app Toán, KHTN, bản quyền...)"
                  className="flex-1 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition shadow-md"
                  title="Gửi tin nhắn"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* NỘI DUNG TAB 2: CHAT TRỰC TIẾP ZALO THẦY THÀNH */}
          {activeTab === 'zalo' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/70 text-xs">
              
              {/* CARD THÔNG TIN THẦY THÀNH */}
              <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border-b border-l border-emerald-500/30 rounded-bl-xl text-[10px] font-bold">
                  Kênh Trực Tiếp
                </div>

                <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-2.5 border-2 border-emerald-400 ring-4 ring-emerald-500/20 shadow-lg">
                  <img 
                    src="/dinhvanthanh.jpg" 
                    alt="Thầy Đinh Văn Thành" 
                    className="w-full h-full object-cover"
                  />
                </div>

                <h4 className="text-sm font-black text-white">Thầy giáo Đinh Văn Thành</h4>
                <p className="text-xs text-cyan-300 font-medium">Trường THCS Đồng Yên</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Chuyên phát triển phần mềm giáo viên, Add-in Office, công cụ AI sư phạm và tạo đề kiểm tra chuẩn Bộ GD&ĐT.
                </p>

                {/* SỐ ĐIỆN THOẠI & NÚT COPY */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono font-bold text-white text-xs">{BRAND.phone}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyZaloPhone}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1 transition"
                  >
                    {copiedZalo ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedZalo ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                </div>
              </div>

              {/* KHUNG SOẠN TIN NHẮN GỬI ZALO */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                  💬 Soạn tin nhắn gửi Thầy Thành qua Zalo:
                </label>
                <textarea
                  rows={3}
                  value={zaloDirectMessage}
                  onChange={(e) => setZaloDirectMessage(e.target.value)}
                  placeholder="Nhập nội dung Thầy/Cô cần trao đổi..."
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition resize-none"
                />

                <div className="mt-2.5 flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={handleSendZaloDirect}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Mở Zalo Gửi Cho Thầy Thành</span>
                  </button>

                  <a
                    href="tel:0915213717"
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition border border-slate-700"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Gọi Điện</span>
                  </a>
                </div>
              </div>

              {/* CAM KẾT HỖ TRỢ */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Cam kết đồng hành cùng Thầy/Cô:</span>
                </div>
                <p>• Hỗ trợ cài đặt từ xa qua UltraViewer / AnyDesk miễn phí 100%.</p>
                <p>• Bảo hành và tự động cập nhật ngân hàng đề thi trong suốt năm học.</p>
                <p>• Giải đáp thắc mắc chuyên môn ra đề và thể thức văn bản Nghị định 30/2020.</p>
              </div>
            </div>
          )}

          {/* FOOTER CHAT BOX */}
          <div className="p-2.5 bg-slate-900/90 border-t border-slate-800 text-center text-[10px] text-slate-500 shrink-0">
            Hệ thống Giáo Viên AI Toàn Năng • Tác giả Đinh Thành ({BRAND.phone})
          </div>
        </div>
      )}
    </>
  );
};
