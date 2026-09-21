import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Crown,
  FileText,
  Play,
  CheckCircle2,
  AlertTriangle,
  Send,
  BookOpen,
  HelpCircle,
  FolderDown,
  Layers,
  FileCheck2,
  Headphones,
  Award
} from 'lucide-react';
import { BRAND, EXAM_RESOURCES } from '../config/brand';
import {
  getOrCreateExamHardwareCode,
  verifyExamLicenseKey,
  getSecureExamTrialRemaining,
  consumeSecureExamTrial,
  ExamVerifyResult
} from '../services/taodeKeyService';

interface TaoDeTiengAnhModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

// Ngữ liệu bộ đề chuẩn CV 7991 cho Global Success 6, 7, 8, 9 (Trung tính, áp dụng chuẩn cho mọi trường THCS trên toàn quốc)
const EXAM_DATABASE: Record<string, Record<string, {
  topics: string;
  hasSpeaking: boolean;
  listeningScript: string;
  examCode1: string;
  examCode2: string;
  answers: string;
  matrixSpec: string;
}>> = {
  '6': {
    'GK1': {
      topics: 'Unit 1: My New School, Unit 2: My House, Unit 3: My Friends',
      hasSpeaking: false,
      listeningScript: `AUDIO SCRIPT - KIỂM TRA GIỮA HỌC KÌ I TIẾNG ANH 6\nPart 1: Listen to Phong talking about his first day at secondary school. Circle A, B or C.\nPhong: Hi everyone! Today is my first day at secondary school. My school is very big and modern. There are 25 classrooms and a big computer room. I wear my new uniform: a white shirt and blue trousers. My best friend is Duy. He is in the same class with me. We are very excited!\n\nPart 2: Listen to Mi talking about her house. Circle True (A) or False (B).\nMi: My family lives in a beautiful town house in Da Nang. There are six rooms: a living room, three bedrooms, a kitchen and two bathrooms. My favorite room is my bedroom because it has a big window overlooking the green garden.`,
      examCode1: `PART I. LISTENING (2.0 pts)\nTask 1. Listen to Phong talking about his school. Circle A, B, or C (1.0 pt):\n1. How is Phong's new school?\nA. small and old          B. big and modern         C. small but modern\n2. How many classrooms are there in his school?\nA. 20                     B. 25                     C. 30\n3. What does Phong wear on his first day?\nA. white shirt and blue trousers    B. white shirt and black trousers    C. blue T-shirt\n4. Who is Phong's best friend?\nA. Duy                    B. Nam                    C. Minh\n\nTask 2. Listen to Mi talking about her house. Circle A (True) or B (False) (1.0 pt):\n5. Mi's family lives in a country house.                   A. True      B. False\n6. There are six rooms in her house.                       A. True      B. False\n7. Her house has three bathrooms.                          A. True      B. False\n8. Her bedroom has a window overlooking a garden.          A. True      B. False\n\nPART II. LANGUAGE & GRAMMAR (3.0 pts)\nQuestion 9. Choose the word whose underlined part is pronounced differently:\nA. fast<u>s</u>               B. book<u>s</u>              C. pen<u>s</u>               D. cat<u>s</u>\nQuestion 10. Find the word with different stress position:\nA. 'compass               B. 'clever               C. po'lite              D. 'active\nQuestion 11. Duy is very ________. He likes drawing creative pictures.\nA. hard-working           B. creative              C. confident            D. patient\nQuestion 12. There ________ a large poster and two lamps in my bedroom.\nA. is                     B. are                   C. be                   D. have\nQuestion 13. Look! The students ________ football in the school playground.\nA. play                   B. plays                 C. are playing          D. is playing\nQuestion 14. We ________ to the English club every Tuesday afternoon.\nA. go                     B. goes                  C. are going            D. went\n\nPART III. READING (2.5 pts)\nRead the text and choose the correct answer for each question:\n"My name is Nam. I live in a peaceful green town in Viet Nam. My house is surrounded by green trees and fresh air. There is a secondary school near my house, so I walk to school every morning with my friends. After school, we often play badminton in the park..."\nQuestion 15. Where does Nam live?\nA. In a busy city         B. In a peaceful green town  C. In a tall apartment\nQuestion 16. How does he go to school?\nA. By bicycle             B. By bus                C. On foot\n\nPART IV. WRITING (2.5 pts)\nRewrite the following sentences without changing their meaning:\nQuestion 17. My house has six rooms.\n-> There are __________________________________________________.\nQuestion 18. Lan's hair is long and black.\n-> Lan has ____________________________________________________.\nWrite a paragraph (50-60 words) about your best friend (1.5 pts).`,
      examCode2: `PART I. LISTENING (2.0 pts) [MÃ ĐỀ HOÁN VỊ 602]\nTask 1. Listen to Phong talking about his school. Circle A, B, or C:\n1. Who is Phong's best friend?\nA. Minh                   B. Duy                   C. Nam\n2. How is Phong's new school?\nA. big and modern         B. small and old         C. small but modern\n3. How many classrooms are there in his school?\nA. 30                     B. 20                    C. 25\n4. What does Phong wear on his first day?\nA. blue T-shirt           B. white shirt and blue trousers   C. white shirt and black trousers\n\nTask 2. Listen to Mi talking about her house. Circle True or False:\n5. There are six rooms in her house.                       A. True      B. False\n6. Mi's family lives in a country house.                   A. True      B. False\n7. Her bedroom has a window overlooking a garden.          A. True      B. False\n8. Her house has three bathrooms.                          A. True      B. False\n\nPART II. LANGUAGE FOCUS (3.0 pts)\nQuestion 9. Find the word with different stress position:\nA. po'lite                B. 'compass              C. 'clever              D. 'active\nQuestion 10. Choose the word whose underlined part is pronounced differently:\nA. pen<u>s</u>               B. fast<u>s</u>              C. book<u>s</u>             D. cat<u>s</u>\nQuestion 11. Look! The students ________ football in the school playground.\nA. are playing            B. play                  C. plays                D. is playing\nQuestion 12. Duy is very ________. He likes drawing creative pictures.\nA. confident              B. hard-working          C. creative             D. patient\n\nPART III. READING & PART IV. WRITING\n(Nội dung các câu hỏi đọc hiểu và viết lại câu tương đương chuẩn mực)`,
      answers: `HƯỚNG DẪN CHẤM & ĐÁP ÁN CHI TIẾT - ĐỀ GIỮA KÌ I TIẾNG ANH 6\nMÃ ĐỀ 601:\n1. B   2. B   3. A   4. A\n5. B (False)   6. A (True)   7. B (False)   8. A (True)\n9. C (/z/ vs /s/)\n10. C (Trọng âm 2, còn lại âm 1)\n11. B (creative)\n12. A (is)\n13. C (are playing)\n14. A (go)\n15. B   16. C\n17. There are six rooms in my house.\n18. Lan has long black hair.\nWriting (1.5 pts): Đúng cấu trúc ngữ pháp, từ vựng phong phú, chuẩn chính tả (1.5đ).\n\nMÃ ĐỀ HOÁN VỊ 602:\n1. B   2. A   3. C   4. B\n5. A   6. B   7. A   8. B\n9. A   10. A  11. A  12. C`,
      matrixSpec: `MA TRẬN & BẢN ĐẶC TẢ ĐỀ KIỂM TRA GIỮA KÌ I TIẾNG ANH 6 (CV 7991)\n- Nghe hiểu (Listening): 20% (2.0 điểm - 8 câu TNKQ: 4 câu ABC, 4 câu True/False)\n- Kiến thức ngôn ngữ (Language): 30% (3.0 điểm - 12 câu TNKQ)\n- Đọc hiểu (Reading): 25% (2.5 điểm - 5 câu điền từ + 5 câu đọc hiểu)\n- Viết (Writing): 25% (2.5 điểm - 4 câu viết lại + 1 bài viết đoạn văn 1.5đ)\n- Thang điểm tổng: 10,0 điểm (100% Đề viết trên giấy - Giữa kỳ không thi Nói).`
    },
    'CK1': {
      topics: 'Unit 1 đến Unit 6 (Tet, Natural Wonders, Neighbourhood, Schools, Houses, Friends)',
      hasSpeaking: true,
      listeningScript: `AUDIO SCRIPT - KIỂM TRA CUỐI HỌC KÌ I TIẾNG ANH 6\nPart 1: Listen to An talking about Tet holiday in Viet Nam. Circle A, B or C.\nAn: Tet is the most important festival in Viet Nam. Before Tet, people clean and decorate their homes with peach blossoms and kumquat trees. Children receive lucky money in red envelopes. Families gather to eat traditional food like Chung cake.\n\nPart 2: Listen to Nick talking about Ha Long Bay. Circle True (A) or False (B).\nNick: Ha Long Bay is in Quang Ninh province. It has thousands of limestone islands and beautiful caves. Tourists can go kayaking, swimming and explore breathtaking scenery. It is a world natural wonder.`,
      examCode1: `PART I. LISTENING (2.0 pts)\nTask 1. Listen to An talking about Tet. Circle A, B or C (1.0 pt):\n1. What is Tet in Viet Nam?\nA. The longest holiday    B. The most important festival   C. A modern event\n2. What do people decorate their homes with?\nA. Roses and sunflowers   B. Peach blossoms and kumquat trees   C. Green balloons\n\nPART II. LANGUAGE FOCUS (2.4 pts)\nPART III. READING COMPREHENSION (2.0 pts)\nPART IV. WRITING (1.6 pts)\nPART V. SPEAKING (2.0 pts - Tổ chức phỏng vấn và thuyết trình chủ đề)`,
      examCode2: `PART I. LISTENING (2.0 pts) [MÃ ĐỀ HOÁN VỊ 602]\nPART II. LANGUAGE FOCUS (2.4 pts)\nPART III. READING COMPREHENSION (2.0 pts)\nPART IV. WRITING (1.6 pts)\nPART V. SPEAKING (2.0 pts)`,
      answers: `HƯỚNG DẪN CHẤM & ĐÁP ÁN ĐỀ CUỐI HỌC KÌ I TIẾNG ANH 6 (Thang điểm 10.0đ):\n- Điểm bài viết trên giấy: 8.0 điểm\n- Điểm bài nói (Speaking): 2.0 điểm (Gồm Interview 0.5đ, Topic Presentation 1.0đ, Q&A 0.5đ).`,
      matrixSpec: `MA TRẬN & BẢN ĐẶC TẢ ĐỀ CUỐI HỌC KÌ I TIẾNG ANH 6 (CV 7991):\n- Phần thi Viết: 8.0 điểm (36 câu trắc nghiệm + Viết câu + Viết đoạn văn)\n- Phần thi Nói: 2.0 điểm (Thực hiện trực tiếp với giám khảo)`
    }
  },
  '7': {
    'GK1': {
      topics: 'Unit 1: Hobbies, Unit 2: Healthy Living, Unit 3: Community Service',
      hasSpeaking: false,
      listeningScript: `AUDIO SCRIPT - KIỂM TRA GIỮA HỌC KÌ I TIẾNG ANH 7\nListen to Elena talking about her hobby of making pottery. Elena started this hobby two years ago. She learns from her grandfather who is an experienced artisan. Making pottery helps her become more patient and relaxed...`,
      examCode1: `PART I. LISTENING (2.0 pts)\nTask 1. Listen to Elena talking about pottery making. Circle A, B or C (1.0 pt):\n1. When did Elena start her hobby?\nA. One year ago           B. Two years ago          C. Three years ago\n2. Who taught her how to make pottery?\nA. Her grandfather        B. Her father             C. Her art teacher\n\nPART II. LANGUAGE FOCUS (3.0 pts)\nQuestion 3. Choose the word with a different sound in the underlined part:\nA. act<u>i</u>vity           B. tr<u>i</u>p                 C. f<u>i</u>nd                D. c<u>i</u>nema\nQuestion 4. We should eat more vegetables ________ they are rich in vitamins.\nA. so                     B. because               C. although             D. but\n\nPART III. READING (2.5 pts)\nPART IV. WRITING (2.5 pts)`,
      examCode2: `PART I. LISTENING (2.0 pts) [MÃ ĐỀ HOÁN VỊ 702]\nPART II. LANGUAGE FOCUS (3.0 pts)\nPART III. READING (2.5 pts)\nPART IV. WRITING (2.5 pts)`,
      answers: `ĐÁP ÁN CHI TIẾT MÃ ĐỀ 701 & 702 (GIỮA KÌ I TIẾNG ANH 7 chuẩn CV 7991)`,
      matrixSpec: `MA TRẬN BẢN ĐẶC TẢ ĐỀ GIỮA KÌ I TIẾNG ANH 7 THEO CV 7991 (10.0đ)`
    }
  },
  '8': {
    'GK1': {
      topics: 'Unit 1: Leisure Time, Unit 2: Life in the Countryside, Unit 3: Teenagers',
      hasSpeaking: false,
      listeningScript: `AUDIO SCRIPT - KIỂM TRA GIỮA HỌC KÌ I TIẾNG ANH 8\nListen to Tom talking about life in the countryside and how teenagers spend their free time with outdoor sports, flying kites, and helping families during harvest seasons...`,
      examCode1: `PART I. LISTENING (2.0 pts)\nTask 1. Listen to Tom talking about life in the countryside. Circle A, B or C:\n1. Where does Tom live?\nA. In a big city          B. In a peaceful village  C. Near the seaside\n2. What do teenagers enjoy doing during harvest time?\nA. Flying kites and riding bikes    B. Playing computer games    C. Watching movies\n\nPART II. LANGUAGE (3.0 pts)\nQuestion 3. Life in the countryside is usually ________ than in the bustling city.\nA. peaceful               B. more peaceful         C. most peaceful        D. as peaceful\n\nPART III. READING (2.5 pts)\nPART IV. WRITING (2.5 pts)`,
      examCode2: `PART I. LISTENING (2.0 pts) [MÃ ĐỀ HOÁN VỊ 802]\nPART II. LANGUAGE (3.0 pts)\nPART III. READING (2.5 pts)\nPART IV. WRITING (2.5 pts)`,
      answers: `ĐÁP ÁN CHI TIẾT MÃ ĐỀ 801 & 802 (GIỮA KÌ I TIẾNG ANH 8 chuẩn CV 7991)`,
      matrixSpec: `MA TRẬN BẢN ĐẶC TẢ ĐỀ GIỮA KÌ I TIẾNG ANH 8 THEO CV 7991 (10.0đ)`
    }
  },
  '9': {
    'GK1': {
      topics: 'Unit 1: Local Community, Unit 2: City Life, Unit 3: Healthy Living for Teens',
      hasSpeaking: false,
      listeningScript: `AUDIO SCRIPT - KIỂM TRA GIỮA HỌC KÌ I TIẾNG ANH 9\nListen to Sarah talking about community volunteer projects and how teenagers can maintain a healthy, balanced lifestyle with study and physical exercise in modern society...`,
      examCode1: `PART I. LISTENING (2.0 pts)\nTask 1. Listen to Sarah talking about community activities. Circle A, B or C:\n1. What community project does Sarah participate in?\nA. Green park cleaning    B. Blood donation        C. Book charity for kids\n2. How do physical exercises help teenagers?\nA. Reduce stress and stay fit       B. Make more money       C. Pass examinations easily\n\nPART II. LANGUAGE FOCUS (3.0 pts)\nQuestion 3. The artisan explained how to ________ traditional conical hats.\nA. knit                   B. carve                 C. weave                D. embroider\n\nPART III. READING (2.5 pts)\nPART IV. WRITING (2.5 pts)`,
      examCode2: `PART I. LISTENING (2.0 pts) [MÃ ĐỀ HOÁN VỊ 902]\nPART II. LANGUAGE (3.0 pts)\nPART III. READING (2.5 pts)\nPART IV. WRITING (2.5 pts)`,
      answers: `ĐÁP ÁN CHI TIẾT MÃ ĐỀ 901 & 902 (GIỮA KÌ I TIẾNG ANH 9 chuẩn CV 7991)`,
      matrixSpec: `MA TRẬN BẢN ĐẶC TẢ ĐỀ GIỮA KÌ I TIẾNG ANH 9 THEO CV 7991 (10.0đ)`
    }
  }
};

export const TaoDeTiengAnhModal: React.FC<TaoDeTiengAnhModalProps> = ({ isOpen, onClose, onOpenAdmin }) => {
  // Navigation tabs: 'experience' | 'download' | 'register'
  const [activeTab, setActiveTab] = useState<'experience' | 'download' | 'register'>('experience');

  // Trial limit system: 5 uses per computer
  const [trialRemaining, setTrialRemaining] = useState<number>(5);
  const [detectedMid, setDetectedMid] = useState<string>('');
  const [isProActive, setIsProActive] = useState<boolean>(false);
  const [verifyResult, setVerifyResult] = useState<ExamVerifyResult | null>(null);

  // Form State (Mặc định trung tính, không chứa địa danh riêng, bất kỳ giáo viên nào cũng dùng được ngay)
  const [selectedGrade, setSelectedGrade] = useState<string>('6');
  const [selectedTerm, setSelectedTerm] = useState<string>('GK1');
  const [numVariants, setNumVariants] = useState<number>(2);
  const [schoolName, setSchoolName] = useState<string>('TRƯỜNG THCS ........................................');
  const [parentAgency, setParentAgency] = useState<string>('PHÒNG GIÁO DỤC VÀ ĐÀO TẠO');
  const [schoolYear, setSchoolYear] = useState<string>('2026 - 2027');
  const [examDuration, setExamDuration] = useState<string>('60');

  // Preview sub-tab
  const [previewSubTab, setPreviewSubTab] = useState<'de1' | 'de2' | 'dapan' | 'matran' | 'audio'>('de1');

  // Generation state - Khởi tạo rỗng, khách hàng KHÔNG THỂ xem đề mẫu trước khi bấm Tạo đề!
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedExam1, setGeneratedExam1] = useState<string>('');
  const [generatedExam2, setGeneratedExam2] = useState<string>('');
  const [generatedAnswers, setGeneratedAnswers] = useState<string>('');
  const [generatedMatrix, setGeneratedMatrix] = useState<string>('');
  const [generatedAudio, setGeneratedAudio] = useState<string>('');

  // Pro registration form
  const [inputKey, setInputKey] = useState<string>('');
  const [teacherName, setTeacherName] = useState<string>('');
  const [teacherPhone, setTeacherPhone] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<'1year' | '2year' | 'lifetime'>('lifetime');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Initialize Hardware Code & Multi-Layer Anti-Tamper Trial Limit on open
  useEffect(() => {
    if (isOpen) {
      const code = getOrCreateExamHardwareCode();
      setDetectedMid(code);

      // Đọc số lượt dùng thử được ký số mật mã SHA-256 an toàn (Chống can thiệp F12)
      getSecureExamTrialRemaining(code).then(trials => {
        setTrialRemaining(trials);
      });

      // Kiểm tra License Key Pro đã lưu trước đó
      const savedKey = localStorage.getItem('gvai_taode_active_key');
      if (savedKey) {
        setInputKey(savedKey);
        verifyExamLicenseKey(savedKey, code).then(res => {
          if (res.isValid) {
            setIsProActive(true);
            setVerifyResult(res);
          }
        });
      }

      // Khách hàng KHÔNG THỂ xem trước đề mẫu tiếng anh. Chỉ có thể tạo đề mới!
      // Không tự động sinh đề tại đây.
    }
  }, [isOpen]);

  // Sinh đề kiểm tra mới & tính lượt dùng thử 5 đề/máy
  const handleGenerateExam = async () => {
    if (!isProActive) {
      const currentTrials = await getSecureExamTrialRemaining(detectedMid);
      if (currentTrials <= 0) {
        alert('⚠️ Thầy/Cô đã sử dụng hết 5 lượt dùng thử tạo đề tiếng Anh miễn phí trên máy tính này!\n\nVui lòng kích hoạt bản quyền Pro (hoặc liên hệ Thầy Thành: 0915.213717) để mở khóa tạo đề không giới hạn.');
        setActiveTab('register');
        return;
      }
      // Trừ 1 lượt an toàn kèm chữ ký số SHA-256 chống can thiệp F12 DevTools
      const nextRemaining = await consumeSecureExamTrial(detectedMid);
      setTrialRemaining(nextRemaining);
    }

    setIsGenerating(true);

    setTimeout(() => {
      const gradeData = EXAM_DATABASE[selectedGrade] || EXAM_DATABASE['6'];
      const termData = gradeData[selectedTerm] || gradeData['GK1'];

      const termName = selectedTerm === 'GK1' ? 'GIỮA HỌC KÌ I' 
        : selectedTerm === 'CK1' ? 'CUỐI HỌC KÌ I' 
        : selectedTerm === 'GK2' ? 'GIỮA HỌC KÌ II' 
        : selectedTerm === 'CK2' ? 'CUỐI HỌC KÌ II' 
        : 'KHẢO SÁT CHẤT LƯỢNG ĐẦU NĂM';

      const header1 = `${parentAgency}\n${schoolName}\n\nĐỀ KIỂM TRA ${termName} - MÔN TIẾNG ANH ${selectedGrade}\nNăm học: ${schoolYear} | Thời gian làm bài: ${examDuration} phút (Không kể thời gian phát đề)\nMÃ ĐỀ: ${selectedGrade}01 (Chuẩn Công văn 7991/BGDĐT)\n----------------------------------------------------------------------\nChủ đề kiểm tra: ${termData.topics}\n\n`;

      const header2 = `${parentAgency}\n${schoolName}\n\nĐỀ KIỂM TRA ${termName} - MÔN TIẾNG ANH ${selectedGrade}\nNăm học: ${schoolYear} | Thời gian làm bài: ${examDuration} phút (Không kể thời gian phát đề)\nMÃ ĐỀ: ${selectedGrade}02 (Hoán vị phương án và vị trí câu hỏi chuẩn CV 7991)\n----------------------------------------------------------------------\nChủ đề kiểm tra: ${termData.topics}\n\n`;

      setGeneratedExam1(header1 + termData.examCode1);
      setGeneratedExam2(header2 + termData.examCode2);
      setGeneratedAnswers(termData.answers);
      setGeneratedMatrix(termData.matrixSpec);
      setGeneratedAudio(termData.listeningScript);

      setIsGenerating(false);
    }, 1200);
  };

  // Kích hoạt License Key Pro
  const handleActivatePro = async () => {
    if (!inputKey.trim()) {
      alert('Vui lòng nhập License Key kích hoạt!');
      return;
    }

    const res = await verifyExamLicenseKey(inputKey, detectedMid);
    setVerifyResult(res);

    if (res.isValid) {
      setIsProActive(true);
      localStorage.setItem('gvai_taode_active_key', inputKey.trim().toUpperCase());
      alert(`🎉 KÍCH HOẠT BẢN QUYỀN PRO THÀNH CÔNG!\n\n${res.packageName}\nThời hạn: ${res.expiryDateStr}\nThầy/Cô đã có thể tạo đề không giới hạn.`);
      setActiveTab('experience');
    } else {
      alert(`❌ Kích hoạt thất bại: ${res.message}`);
    }
  };

  // Copy text to clipboard
  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Tải file Word (.doc)
  const handleDownloadDoc = () => {
    const fullContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>De_Kiem_Tra_Tieng_Anh_${selectedGrade}_${selectedTerm}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.25; }
        h1, h2, h3 { font-family: 'Times New Roman', serif; }
      </style>
      </head>
      <body>
        <div style="text-align: center; font-weight: bold; margin-bottom: 20px;">
          ${parentAgency}<br>${schoolName}<br>
          BỘ ĐỀ KIỂM TRA TIẾNG ANH ${selectedGrade} (GLOBAL SUCCESS) - NĂM HỌC ${schoolYear}
        </div>
        <hr/>
        <h2>I. ĐỀ KIỂM TRA MÃ ${selectedGrade}01</h2>
        <pre style="font-family: 'Times New Roman'; font-size: 13pt; white-space: pre-wrap;">${generatedExam1}</pre>
        <br style="page-break-before: always;"/>
        <h2>II. ĐỀ KIỂM TRA MÃ ${selectedGrade}02 (HOÁN VỊ)</h2>
        <pre style="font-family: 'Times New Roman'; font-size: 13pt; white-space: pre-wrap;">${generatedExam2}</pre>
        <br style="page-break-before: always;"/>
        <h2>III. HƯỚNG DẪN CHẤM & ĐÁP ÁN CHI TIẾT</h2>
        <pre style="font-family: 'Times New Roman'; font-size: 13pt; white-space: pre-wrap;">${generatedAnswers}</pre>
        <br style="page-break-before: always;"/>
        <h2>IV. MA TRẬN & BẢN ĐẶC TẢ (CV 7991)</h2>
        <pre style="font-family: 'Times New Roman'; font-size: 13pt; white-space: pre-wrap;">${generatedMatrix}</pre>
        <br style="page-break-before: always;"/>
        <h2>V. AUDIO SCRIPT FILE NGHE</h2>
        <pre style="font-family: 'Times New Roman'; font-size: 13pt; white-space: pre-wrap;">${generatedAudio}</pre>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff' + fullContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `De_Kiem_Tra_Tieng_Anh_${selectedGrade}_${selectedTerm}_CV7991.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[900px] flex flex-col rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
        
        {/* HEADER MODAL */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <FileCheck2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-white tracking-wide">
                  TẠO ĐỀ KIỂM TRA TIẾNG ANH GLOBAL SUCCESS (CV 7991)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  CV 7991 CHUẨN 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Tác giả: Thầy giáo Đinh Văn Thành – ĐT/Zalo: <strong>{BRAND.phone}</strong> – Trường THCS Đồng Yên
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 TABS NAVIGATION BAR */}
        <div className="px-4 sm:px-6 py-2 bg-slate-950 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('experience')}
            className={`py-2 px-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'experience'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            1. Trải Nghiệm Online (CV 7991)
          </button>

          <button
            onClick={() => setActiveTab('download')}
            className={`py-2 px-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'download'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FolderDown className="w-4 h-4" />
            2. Tải Bản Cài Desktop & Word Add-in
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`py-2 px-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'register'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            3. Bản Quyền Pro
            {isProActive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>

        {/* TAB BODY CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-300">

          {/* ========================================================================= */}
          {/* TAB 1: TRẢI NGHIỆM TRỰC TUYẾN (SINH ĐỀ & ĐÁP ÁN THEO CV 7991)             */}
          {/* ========================================================================= */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              
              {/* TRIAL OR PRO STATUS BANNER */}
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
                        Mã máy: <b className="text-cyan-300 font-mono">{detectedMid}</b> – Không giới hạn số lần tạo đề kiểm tra & đề cương ôn tập.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.removeItem('gvai_taode_active_key');
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
                        DÙNG THỬ TẠO ĐỀ MIỄN PHÍ TRÊN MÁY TÍNH NÀY:
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
                              ? 'bg-cyan-500 text-slate-950 shadow-xs shadow-cyan-500/50'
                              : 'bg-slate-800 text-slate-500 border border-slate-700'
                          }`}
                        >
                          {i < (5 - trialRemaining) ? '●' : '○'}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 italic ml-auto hidden sm:inline">
                      (Mỗi máy tính được tặng 5 lượt sinh đề kiểm tra miễn phí)
                    </span>
                  </div>
                </div>
              )}

              {/* BỘ LỌC CẤU HÌNH SINH ĐỀ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                {/* 1. Chọn Lớp */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    1. Khối lớp
                  </label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-cyan-500"
                  >
                    <option value="6">Lớp 6 (Global Success)</option>
                    <option value="7">Lớp 7 (Global Success)</option>
                    <option value="8">Lớp 8 (Global Success)</option>
                    <option value="9">Lớp 9 (Global Success)</option>
                  </select>
                </div>

                {/* 2. Chọn Kỳ kiểm tra */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    2. Kỳ kiểm tra
                  </label>
                  <select
                    value={selectedTerm}
                    onChange={(e) => setSelectedTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-cyan-500"
                  >
                    <option value="GK1">Giữa Học Kì I (GK1)</option>
                    <option value="CK1">Cuối Học Kì I (CK1 - Kèm Nói)</option>
                    <option value="GK2">Giữa Học Kì II (GK2)</option>
                    <option value="CK2">Cuối Học Kì II (CK2 - Kèm Nói)</option>
                    <option value="KSCL">Khảo Sát Đầu Năm (KSCL)</option>
                  </select>
                </div>

                {/* 3. Số mã đề hoán vị */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    3. Số mã đề
                  </label>
                  <select
                    value={numVariants}
                    onChange={(e) => setNumVariants(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-cyan-500"
                  >
                    <option value={2}>2 Mã đề (Hoán vị A/B)</option>
                    <option value={4}>4 Mã đề (601, 602, 603, 604)</option>
                  </select>
                </div>

                {/* 4. Thời gian làm bài */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    4. Thời gian
                  </label>
                  <select
                    value={examDuration}
                    onChange={(e) => setExamDuration(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-cyan-500"
                  >
                    <option value="45">45 Phút</option>
                    <option value="60">60 Phút (Chuẩn CV 7991)</option>
                    <option value="90">90 Phút</option>
                  </select>
                </div>

                {/* Thông tin đơn vị */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold mb-1">
                    Tên trường THCS
                  </label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="Ví dụ: TRƯỜNG THCS NGUYỄN DU"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold mb-1">
                    Đơn vị chủ quản
                  </label>
                  <input
                    type="text"
                    value={parentAgency}
                    onChange={(e) => setParentAgency(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="Ví dụ: PHÒNG GIÁO DỤC VÀ ĐÀO TẠO"
                  />
                </div>
              </div>

              {/* NÚT THAO TÁC SINH ĐỀ */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={handleGenerateExam}
                  disabled={isGenerating || (!isProActive && trialRemaining <= 0)}
                  className={`py-3 px-6 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all ${
                    !isProActive && trialRemaining <= 0
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-cyan-600/30 hover:scale-105 cursor-pointer'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  {isGenerating
                    ? 'AI Đang Biên Soạn Đề Chuẩn CV 7991...'
                    : !isProActive && trialRemaining <= 0
                    ? 'Đã Hết Lượt Tạo Thử (0/5) - Nâng Cấp Pro'
                    : isProActive
                    ? '⚡ TẠO ĐỀ KIỂM TRA MỚI (CV 7991) - PRO'
                    : `⚡ TẠO ĐỀ KIỂM TRA MỚI (Còn ${trialRemaining}/5 đề thử)`}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadDoc}
                    disabled={!generatedExam1}
                    className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all ${
                      !generatedExam1
                        ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 hover:scale-105 cursor-pointer'
                    }`}
                    title={!generatedExam1 ? 'Vui lòng bấm Tạo Đề trước khi tải file Word' : 'Tải file Word (.doc)'}
                  >
                    <Download className="w-4 h-4" />
                    Tải File Word (.doc)
                  </button>
                </div>
              </div>

              {/* KHUNG XEM TRƯỚC 5 TAB CON (PREVIEW TABS) */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                {/* Sub-tabs header */}
                <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto">
                  <button
                    onClick={() => setPreviewSubTab('de1')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                      previewSubTab === 'de1'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    📄 1. Đề thi Mã {selectedGrade}01
                  </button>
                  <button
                    onClick={() => setPreviewSubTab('de2')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                      previewSubTab === 'de2'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    📄 2. Đề thi Mã {selectedGrade}02 (Hoán vị)
                  </button>
                  <button
                    onClick={() => setPreviewSubTab('dapan')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                      previewSubTab === 'dapan'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    ✅ 3. Đáp án & Thang điểm
                  </button>
                  <button
                    onClick={() => setPreviewSubTab('matran')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                      previewSubTab === 'matran'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    📊 4. Ma trận & Đặc tả (CV 7991)
                  </button>
                  <button
                    onClick={() => setPreviewSubTab('audio')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                      previewSubTab === 'audio'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    🎧 5. Audio Script File Nghe
                  </button>
                </div>

                {/* Sub-tab content */}
                <div className="p-4 relative">
                  {generatedExam1 ? (
                    <>
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        <button
                          onClick={() => {
                            const contentMap = {
                              de1: generatedExam1,
                              de2: generatedExam2,
                              dapan: generatedAnswers,
                              matran: generatedMatrix,
                              audio: generatedAudio
                            };
                            handleCopy(contentMap[previewSubTab], previewSubTab);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 shadow-sm"
                        >
                          {copiedSection === previewSubTab ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              Đã Sao Chép!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Sao Chép Mục Này
                            </>
                          )}
                        </button>
                      </div>

                      <div className="p-4 rounded-xl bg-white text-slate-900 font-serif leading-relaxed text-[13pt] max-h-[420px] overflow-y-auto whitespace-pre-wrap selection:bg-cyan-100">
                        {previewSubTab === 'de1' && generatedExam1}
                        {previewSubTab === 'de2' && generatedExam2}
                        {previewSubTab === 'dapan' && generatedAnswers}
                        {previewSubTab === 'matran' && generatedMatrix}
                        {previewSubTab === 'audio' && generatedAudio}
                      </div>
                    </>
                  ) : (
                    /* TRẠNG THÁI KHÓA/CHƯA TẠO ĐỀ: KHÁCH HÀNG KHÔNG THỂ XEM TRƯỚC ĐỀ MẪU */
                    <div className="py-12 px-4 text-center flex flex-col items-center justify-center space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <FileText className="w-7 h-7" />
                      </div>
                      <div className="max-w-md space-y-2">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                          Chưa Có Đề Kiểm Tra Nào Được Tạo
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Theo quy định bảo mật hệ thống, khách hàng không thể xem trước đề mẫu. Thầy/Cô hãy thiết lập Khối lớp, Kì kiểm tra và bấm nút <span className="text-cyan-400 font-bold">"TẠO ĐỀ KIỂM TRA MỚI (CV 7991)"</span> ở trên để khởi tạo bộ đề hoàn chỉnh.
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-medium text-amber-300">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>
                          {isProActive 
                            ? "Bản quyền Pro vĩnh viễn: Tạo đề không giới hạn" 
                            : `Hạn mức dùng thử: Còn ${trialRemaining}/5 đề trên máy tính này`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: TẢI BỘ CÀI DESKTOP, VIDEO HD & WORD ADD-IN                        */}
          {/* ========================================================================= */}
          {activeTab === 'download' && (
            <div className="space-y-4">
              
              {/* 1. TRÌNH PHÁT VIDEO FULL HD */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    Video hướng dẫn thao tác tạo đề kiểm tra & xuất ma trận CV 7991:
                  </span>
                  <span className="text-[11px] text-cyan-400 font-mono">Full HD 1080p</span>
                </div>

                <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
                  <video 
                    controls 
                    playsInline
                    preload="metadata"
                    poster="/Taodektcv7991.jpg"
                    className="w-full aspect-video max-h-[320px] object-contain bg-black"
                  >
                    <source src={EXAM_RESOURCES.videoDirectUrl} type="video/mp4" />
                    Trình duyệt không hỗ trợ thẻ video.
                  </video>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 px-1 gap-2">
                  <span>💡 Video hướng dẫn chi tiết từng bước tạo đề thi hoán vị và xuất ra Microsoft Word.</span>
                  <div className="flex items-center gap-3 shrink-0">
                    <a
                      href={EXAM_RESOURCES.videoWatchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      ▶ Mở tab mới
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
                      Trọn Bộ Cài Đặt Desktop & Word Add-in Tạo Đề Tiếng Anh THCS
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Bao gồm bộ cài tự động 1-click chạy trên Microsoft Word, bản Desktop độc lập và trọn bộ 20 đề mẫu kèm ma trận đặc tả chuẩn CV 7991.
                    </p>
                  </div>

                  <a
                    href={EXAM_RESOURCES.fullZipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 shrink-0 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Tải Trọn Bộ (Pass: 123)
                  </a>
                </div>
              </div>

              {/* 3. 4 LỰA CHỌN TẢI TỪNG PHẦN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. Bản Cài Đặt Chạy Trên Word */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                      .EXE
                    </div>
                    <h5 className="font-bold text-slate-200 text-xs">
                      Cài Đặt Chạy Trên Word
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      File: <code>Cai_Dat_Chay_Tren_Word.exe</code> (74 MB). Tự động gắn tab Tạo đề lên thanh Ribbon Word.
                    </p>
                  </div>
                  <a
                    href={EXAM_RESOURCES.fullZipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Tải Bộ Cài Word (.exe)
                  </a>
                </div>

                {/* 2. Bản Desktop Độc Lập */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                      .EXE
                    </div>
                    <h5 className="font-bold text-slate-200 text-xs">
                      Bản Chạy Trực Tiếp Desktop
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      File: <code>Tao_De_Tieng_Anh_Desktop.exe</code> (41 MB). Chạy ngay không cần cài đặt.
                    </p>
                  </div>
                  <a
                    href={EXAM_RESOURCES.fullZipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Tải Bản Desktop (.exe)
                  </a>
                </div>

                {/* 3. Đề Cương & Ma Trận Mẫu */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                      .DOCX
                    </div>
                    <h5 className="font-bold text-slate-200 text-xs">
                      Bộ Đề Mẫu & Ma Trận Đặc Tả
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Trọn bộ 20 đề thi Lớp 6, 7, 8, 9 kèm file Excel Ma trận & Bản đặc tả chuẩn CV 7991.
                    </p>
                  </div>
                  <a
                    href={EXAM_RESOURCES.fullZipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Tải Đề Mẫu (.docx)
                  </a>
                </div>

                {/* 4. Hướng Dẫn Sử Dụng */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      .TXT
                    </div>
                    <h5 className="font-bold text-slate-200 text-xs">
                      Hướng Dẫn Nhanh & Kích Hoạt
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Tài liệu chỉ dẫn chi tiết từng bước sử dụng phần mềm và kích hoạt bản quyền.
                    </p>
                  </div>
                  <a
                    href={EXAM_RESOURCES.fullZipUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Tải Hướng Dẫn (.txt)
                  </a>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: ĐĂNG KÝ BẢN QUYỀN PRO & KÍCH HOẠT                                  */}
          {/* ========================================================================= */}
          {activeTab === 'register' && (
            <div className="space-y-4">
              
              {/* KHUNG NHẬP MÃ BẢN QUYỀN */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  KÍCH HOẠT BẢN QUYỀN PRO BẰNG LICENSE KEY
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">
                      Mã máy tính của Thầy/Cô (Hardware Code):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={detectedMid}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-cyan-300 font-mono font-bold text-xs"
                      />
                      <button
                        onClick={() => handleCopy(detectedMid, 'mid')}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
                        title="Sao chép mã máy"
                      >
                        {copiedSection === 'mid' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 text-[11px] mb-1">
                      Nhập License Key Pro (Ví dụ: ENG-LT-2540BE3FF-...):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={inputKey}
                        onChange={(e) => setInputKey(e.target.value)}
                        placeholder="ENG-LT-..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-emerald-300 font-mono font-bold text-xs focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        onClick={handleActivatePro}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 shrink-0"
                      >
                        Kích Hoạt Ngay
                      </button>
                    </div>
                  </div>
                </div>

                {verifyResult && (
                  <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                    verifyResult.isValid 
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200' 
                      : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                  }`}>
                    {verifyResult.isValid ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
                    <span>{verifyResult.message} {verifyResult.isValid && `(${verifyResult.packageName} - Hạn dùng: ${verifyResult.expiryDateStr})`}</span>
                  </div>
                )}
              </div>

              {/* BẢNG GIÁ GÓI BẢN QUYỀN */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1 Năm */}
                <div 
                  onClick={() => setSelectedPackage('1year')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedPackage === '1year'
                      ? 'bg-blue-950/60 border-blue-500 shadow-md shadow-blue-500/20'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-blue-300">GÓI 1 NĂM</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">365 ngày</span>
                  </div>
                  <div className="text-xl font-black text-white mb-2">100.000đ</div>
                  <ul className="text-[11px] text-slate-400 space-y-1">
                    <li>✓ Tạo đề không giới hạn</li>
                    <li>✓ Trọn bộ 4 khối 6, 7, 8, 9</li>
                    <li>✓ Hỗ trợ cập nhật 1 năm</li>
                  </ul>
                </div>

                {/* 2 Năm */}
                <div 
                  onClick={() => setSelectedPackage('2year')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedPackage === '2year'
                      ? 'bg-purple-950/60 border-purple-500 shadow-md shadow-purple-500/20'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-purple-300">GÓI 2 NĂM</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">Tiết kiệm</span>
                  </div>
                  <div className="text-xl font-black text-white mb-2">150.000đ</div>
                  <ul className="text-[11px] text-slate-400 space-y-1">
                    <li>✓ Tạo đề không giới hạn</li>
                    <li>✓ Đầy đủ đề cương & đặc tả</li>
                    <li>✓ Hỗ trợ kỹ thuật 2 năm</li>
                  </ul>
                </div>

                {/* Vĩnh viễn */}
                <div 
                  onClick={() => setSelectedPackage('lifetime')}
                  className={`p-4 rounded-2xl border relative transition-all cursor-pointer ${
                    selectedPackage === 'lifetime'
                      ? 'bg-amber-950/60 border-amber-500 shadow-lg shadow-amber-500/20'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="absolute -top-2.5 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                    KHUYÊN DÙNG
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-amber-300">GÓI TRỌN ĐỜI</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">Vĩnh viễn</span>
                  </div>
                  <div className="text-xl font-black text-white mb-2">200.000đ</div>
                  <ul className="text-[11px] text-slate-400 space-y-1">
                    <li>✓ Bản quyền trọn đời theo máy</li>
                    <li>✓ Cập nhật miễn phí trọn đời</li>
                    <li>✓ Hỗ trợ 24/7 từ Thầy Thành</li>
                  </ul>
                </div>
              </div>

              {/* NÚT LIÊN HỆ ZALO THẦY THÀNH */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-cyan-950/60 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h5 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                    Liên hệ cấp mã bản quyền tức thì qua Zalo
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Thầy giáo Đinh Văn Thành – THCS Đồng Yên – Hotline / Zalo: <strong>{BRAND.phone}</strong>
                  </p>
                </div>

                <a
                  href={`https://zalo.me/${BRAND.phoneRaw}?text=${encodeURIComponent(
                    `Chào Thầy Thành, tôi muốn đăng ký bản quyền Pro phần mềm Tạo đề kiểm tra Tiếng Anh Global Success THCS (${
                      selectedPackage === '1year' ? 'Gói 1 Năm - 100k' : selectedPackage === '2year' ? 'Gói 2 Năm - 150k' : 'Gói Trọn Đời - 200k'
                    }). Mã máy tính của tôi là: ${detectedMid}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/30 transition-all hover:scale-105 shrink-0"
                >
                  <Send className="w-4 h-4" />
                  Mở Zalo Nhận Key Ngay ({BRAND.phone})
                </a>
              </div>

            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="px-4 sm:px-6 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            🟢 Tạo đề Tiếng Anh Global Success THCS – Bản quyền Thầy giáo Đinh Văn Thành
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
