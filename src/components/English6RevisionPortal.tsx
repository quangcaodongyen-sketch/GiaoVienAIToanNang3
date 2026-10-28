import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Headphones, PenTool, Trophy, Star, Volume2, 
  RotateCw, CheckCircle2, ChevronDown, ChevronUp, 
  Sparkles, Lightbulb, FileText, Check, ArrowRight, ShieldCheck,
  Type
} from 'lucide-react';
import { studentGradebookService, StudentProfile } from '../services/studentGradebookService';
import { midtermMissionService } from '../services/midtermMissionService';

export interface English6RevisionPortalProps {
  currentStudent?: StudentProfile | null;
  student?: StudentProfile | null;
  onGoToExams?: () => void;
  onGoToExam?: () => void;
  onGoToVocab?: () => void;
  onCompleteSection?: (secTitle: string, pts: number) => void;
}

export const English6RevisionPortal: React.FC<English6RevisionPortalProps> = ({ 
  currentStudent: propStudent,
  student,
  onGoToExams,
  onGoToExam,
  onGoToVocab,
  onCompleteSection
}) => {
  const currentStudent = propStudent || student;
  const [activeTab, setActiveTab] = useState<'theory' | 'listening' | 'practice' | 'writing' | 'results'>('theory');
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showTapescript1, setShowTapescript1] = useState(false);
  const [showTapescript2, setShowTapescript2] = useState(false);
  const [showSampleWriting, setShowSampleWriting] = useState(false);
  const [writingText, setWritingText] = useState('');
  const [practiceFilter, setPracticeFilter] = useState<'all' | 'lang' | 'read' | 'cloze' | 'trans'>('all');

  // ĐIỀU CHỈNH CỠ CHỮ TO RÕ THEO YÊU CẦU: Mặc định là 'large' (To rõ, dễ đọc)
  const [fontSizeMode, setFontSizeMode] = useState<'normal' | 'large' | 'xlarge'>('large');

  // Trạng thái Nộp bài & Chấm chữa & Làm lại nhiều lần
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [attemptCount, setAttemptCount] = useState<number>(1);
  const [attemptHistory, setAttemptHistory] = useState<Array<{
    attempt: number;
    score: string;
    correct: number;
    total: number;
    time: string;
    meritBonus: number;
  }>>([]);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong' | 'correct'>('all');
  const [writingAwarded, setWritingAwarded] = useState<boolean>(false);

  // Audio elements
  const audioPart1Url = '/audio/g6_gk1_part1.mp3';
  const audioPart2Url = '/audio/g6_gk1_part2.mp3';

  // Questions Data
  const listeningP1 = [
    {
      id: "rev_l1_1",
      num: 1,
      q: "Mi lives in a town house in Da Nang.",
      options: ["A. True", "B. False"],
      correct: 1,
      exp: "💡 Sai (Bẫy địa danh): Trong bài nghe, Mi nói 'I live in a town house in Hanoi' (ở Hà Nội, không phải Đà Nẵng)."
    },
    {
      id: "rev_l1_2",
      num: 2,
      q: "Her house is small and has five rooms.",
      options: ["A. True", "B. False"],
      correct: 1,
      exp: "💡 Sai (Bẫy số lượng): Mi nói 'My house is quite big. There are six rooms in my house' (khá to, có 6 phòng, không phải nhỏ và 5 phòng)."
    },
    {
      id: "rev_l1_3",
      num: 3,
      q: "There is a living room, a kitchen, three bedrooms and two bathrooms.",
      options: ["A. True", "B. False"],
      correct: 1,
      exp: "💡 Sai: Ngôi nhà có 'four bedrooms' (4 phòng ngủ), không phải 3 phòng ngủ."
    },
    {
      id: "rev_l1_4",
      num: 4,
      q: "Mi's favourite room is her bedroom.",
      options: ["A. True", "B. False"],
      correct: 0,
      exp: "💡 Đúng: Bài nghe có câu 'My favourite room is my bedroom because it has a big window and many beautiful pictures.'"
    },
    {
      id: "rev_l1_5",
      num: 5,
      q: "She loves her house because it is comfortable.",
      options: ["A. True", "B. False"],
      correct: 0,
      exp: "💡 Đúng: 'I love my house because it is very cozy and comfortable.'"
    }
  ];

  const listeningP2 = [
    {
      id: "rev_l2_6",
      num: 6,
      q: "What school does Phong go to?",
      options: ["A. An Son Lower Secondary School", "B. Dream Lower Secondary School", "C. Nguyen Hue Lower Secondary School"],
      correct: 0,
      exp: "💡 Nghe chi tiết: Phong giới thiệu 'I go to An Son Lower Secondary School.'"
    },
    {
      id: "rev_l2_7",
      num: 7,
      q: "How many clubs are there in An's new school?",
      options: ["A. Four", "B. Five", "C. Six"],
      correct: 1,
      exp: "💡 Nghe số lượng: An nói 'There are five clubs in our school: sports, music, art, science, and English.'"
    },
    {
      id: "rev_l2_8",
      num: 8,
      q: "What club does An want to join?",
      options: ["A. The music club", "B. The sports club", "C. The English club"],
      correct: 2,
      exp: "💡 Nghe chi tiết: An nói 'I want to join the English club because I love speaking English with foreign teachers.'"
    },
    {
      id: "rev_l2_9",
      num: 9,
      q: "What is An's favourite subject?",
      options: ["A. Science", "B. English", "C. Maths"],
      correct: 0,
      exp: "💡 Nghe chi tiết: 'My favourite subject is Science. I love doing fun experiments in the lab.'"
    },
    {
      id: "rev_l2_10",
      num: 10,
      q: "What do Phong and An do after school?",
      options: ["A. They go home immediately", "B. They play football in the school playground", "C. They read books in the library"],
      correct: 1,
      exp: "💡 Nghe chi tiết: Phong rủ 'Let's play football in the school playground after school today!' và An đồng ý."
    }
  ];

  const practiceQuestions = [
    {
        "id": "rev_p_11",
        "num": 11,
        "category": "lang",
        "q": "- Nam: \"What does your best friend look like?\" - Ba: \"____________________\"",
        "options": [
            "A. She is tall with long black hair.",
            "B. She is very friendly.",
            "C. She likes watching TV."
        ],
        "correct": 0,
        "exp": "🎯 ĐÁP ÁN ĐÚNG: A 📌 'What does S look like?' dùng để hỏi về ngoại hình (tall, long black hair)."
    },
    {
        "id": "rev_p_12",
        "num": 12,
        "category": "lang",
        "q": "Which of the following words does NOT belong to the topic of school things?",
        "options": [
            "A. pencil case",
            "B. compass",
            "C. cooker"
        ],
        "correct": 2,
        "exp": "🎯 ĐÁP ÁN ĐÚNG: C (cooker: cái bếp/nồi nấu, thuộc chủ đề đồ dùng nhà bếp)."
    },
    {
        "id": "rev_p_13",
        "num": 13,
        "category": "lang",
        "q": "The little dog is sleeping peacefully ________ the table.",
        "options": [
            "A. under",
            "B. at",
            "C. on"
        ],
        "correct": 0,
        "exp": "🎯 ĐÁP ÁN ĐÚNG: A (under the table: ở dưới gầm bàn)."
    },
    {
        "id": "rev_p_14",
        "num": 14,
        "category": "lang",
        "q": "Nam's family lives in a beautiful ________ house surrounded by trees and rice fields.",
        "options": [
            "A. country",
            "B. city",
            "C. flat"
        ],
        "correct": 0,
        "exp": "🎯 ĐÁP ÁN ĐÚNG: A (country house: ngôi nhà ở nông thôn, bao quanh bởi đồng lúa)."
    },
    {
        "id": "rev_p_15",
        "num": 15,
        "category": "lang",
        "q": "Students can read and borrow interesting books in the school ________.",
        "options": [
            "A. kitchen",
            "B. library",
            "C. bathroom"
        ],
        "correct": 1,
        "exp": "🎯 ĐÁP ÁN ĐÚNG: B (library: thư viện trường học là nơi đọc và mượn sách)."
    },
    {
        "id": "rev_p_16",
        "num": 16,
        "category": "lang",
        "q": "Look! The children ________ football happily in the schoolyard now.",
        "options": [
            "A. are playing",
            "B. is playing",
            "C. plays"
        ],
        "correct": 0,
        "exp": "🎯 ĐÁP ÁN ĐÚNG: A (Dấu hiệu 'Look!' và 'now' -> thì Hiện tại tiếp diễn: S nhiều 'The children' + are playing)."
    },
    {
        "id": "rev_p_17",
        "num": 17,
        "category": "lang",
        "q": "Hoa is very ________. She always helps her classmates with difficult exercises.",
        "options": [
            "A. helpful",
            "B. shy",
            "C. careless"
        ],
        "correct": 0,
        "exp": "🎯 ĐÁP ÁN ĐÚNG: A (helpful: hay giúp đỡ bạn bè)."
    },
    {
        "id": "rev_p_18",
        "num": 18,
        "category": "lang",
        "q": "- Tom: \"Let's go to the English club this afternoon!\" - Nam: \"________\"",
        "options": [
            "A. Great idea!",
            "B. You're welcome.",
            "C. He is reading books."
        ],
        "correct": 0,
        "exp": "🎯 ĐÁP ÁN ĐÚNG: A ('Great idea!': Ý kiến hay đấy! Đáp lại lời rủ rê 'Let's...')."
    },
    {
        "id": "rev_p_19",
        "num": 19,
        "category": "lang",
        "q": "Which word has the underlined part pronounced differently from the others?",
        "options": [
            "A. smart",
            "B. sharp",
            "C. apple"
        ],
        "correct": 2,
        "exp": "🎯 ĐÁP ÁN ĐÚNG: C ('apple' phát âm là /æ/, trong khi 'smart' và 'sharp' phát âm là /ɑː/)."
    },
    {
        "id": "rev_p_20",
        "num": 20,
        "category": "lang",
        "q": "Nam usually ________ his homework at 7 o'clock in the evening.",
        "options": [
            "A. does",
            "B. do",
            "C. is doing"
        ],
        "correct": 0,
        "exp": "🎯 ĐÁP ÁN ĐÚNG: A (Thì Hiện tại đơn chỉ thói quen với trạng từ 'usually', chủ ngữ số ít 'Nam' đi với 'does')."
    },
    {
        "id": "rev_p_21",
        "num": 21,
        "category": "lang",
        "q": "Listen! The English teacher ________ about the new grammar lesson.",
        "options": [
            "A. is speaking",
            "B. speaks",
            "C. are speaking"
        ],
        "correct": 0,
        "exp": "🎯 ĐÁP ÁN ĐÚNG: A ('Listen!' là dấu hiệu Hiện tại tiếp diễn: S số ít 'The English teacher' + is speaking)."
    },
    {
        "id": "rev_p_22",
        "num": 22,
        "category": "lang",
        "q": "All students must wear their school ________ on Mondays and Fridays.",
        "options": [
            "A. uniform",
            "B. bags",
            "C. shoes"
        ],
        "correct": 0,
        "exp": "🎯 ĐÁP ÁN ĐÚNG: A ('school uniform': đồng phục trường học)."
    },
    {
        "id": "rev_p_23",
        "num": 23,
        "category": "cloze",
        "q": "Nam lives with his grandparents in a quiet (23) ________ house in a peaceful village.",
        "options": [
            "A. country",
            "B. city",
            "C. apartment"
        ],
        "correct": 0,
        "exp": "🎯 ĐÁP ÁN ĐÚNG: A (Ngôi nhà ở làng quê: 'country house')."
    },
    {
        "id": "rev_p_24",
        "num": 24,
        "category": "cloze",
        "q": "...three cozy bedrooms, and a modern (24) ________ with a large dining table.",
        "options": [
            "A. garage",
            "B. hall",
            "C. kitchen"
        ],
        "correct": 2,
        "exp": "🎯 ĐÁP ÁN ĐÚNG: C (Có bàn ăn lớn: phòng bếp 'kitchen')."
    },
    {
        "id": "rev_p_25",
        "num": 25,
        "category": "cloze",
        "q": "On the living room wall, his father hangs a wooden (25) ________ with many books and family photos.",
        "options": [
            "A. shelf",
            "B. vase",
            "C. clock"
        ],
        "correct": 0,
        "exp": "🎯 ĐÁP ÁN ĐÚNG: A (wooden shelf: giá gỗ/kệ gỗ treo tường để sách và ảnh)."
    },
    {
        "id": "rev_p_26",
        "num": 26,
        "category": "cloze",
        "q": "Behind the house, there is a green garden where his grandfather grows (26) ________ and vegetables.",
        "options": [
            "A. flowers",
            "B. machines",
            "C. cars"
        ],
        "correct": 0,
        "exp": "🎯 ĐÁP ÁN ĐÚNG: A (Trồng hoa và rau củ: 'grows flowers and vegetables')."
    },
    {
        "id": "rev_p_27",
        "num": 27,
        "category": "cloze",
        "q": "Nam really loves his peaceful (27) ________ because it brings him joy and comfort.",
        "options": [
            "A. home",
            "B. road",
            "C. market"
        ],
        "correct": 0,
        "exp": "🎯 ĐÁP ÁN ĐÚNG: A ('his peaceful home': mái ấm/ngôi nhà yên bình)."
    },
    {
        "id": "rev_p_28",
        "num": 28,
        "category": "read",
        "q": "What does Lan look like?",
        "options": [
            "A. She is tall with short blond hair.",
            "B. She has a round face, brown eyes, and long black hair.",
            "C. She wears thick glasses."
        ],
        "correct": 1,
        "exp": "🎯 ĐÁP ÁN ĐÚNG: B 📌 Dẫn chứng: Câu 2 trong bài: \"She is a lovely girl with a round face, friendly brown eyes, and long black hair.\""
    },
    {
        "id": "rev_p_29",
        "num": 29,
        "category": "read",
        "q": "Why does Lan love learning English?",
        "options": [
            "A. Because she loves communicating with friends and singing English songs.",
            "B. Because it has no homework.",
            "C. Because she wants to travel alone."
        ],
        "correct": 0,
        "exp": "🎯 ĐÁP ÁN ĐÚNG: A 📌 Dẫn chứng: \"...because she loves communicating with friends and singing English songs.\""
    },
    {
        "id": "rev_p_30",
        "num": 30,
        "category": "read",
        "q": "The word 'She' in line 2 refers to ________.",
        "options": [
            "A. Lan",
            "B. The teacher",
            "C. The author"
        ],
        "correct": 0,
        "exp": "🎯 ĐÁP ÁN ĐÚNG: A ('She' thay thế cho nhân vật chính 'Lan' được nhắc tới ở câu trước)."
    },
    {
        "id": "rev_p_31",
        "num": 31,
        "category": "read",
        "q": "How does Lan help her classmates when they struggle with lessons?",
        "options": [
            "A. She ignores their questions.",
            "B. She tells the teacher to punish them.",
            "C. She kindly sits down and explains everything step by step."
        ],
        "correct": 2,
        "exp": "🎯 ĐÁP ÁN ĐÚNG: C 📌 Dẫn chứng: \"Lan kindly sits down and explains everything step by step.\""
    },
    {
        "id": "rev_p_32",
        "num": 32,
        "category": "read",
        "q": "What does Lan dream of becoming in the future?",
        "options": [
            "A. A famous singer",
            "B. An English teacher",
            "C. A painter"
        ],
        "correct": 1,
        "exp": "🎯 ĐÁP ÁN ĐÚNG: B 📌 Dẫn chứng: \"Lan dreams of becoming an English teacher at a secondary school in the future.\""
    },
    {
        "id": "rev_p_33",
        "num": 33,
        "category": "trans",
        "q": "Does your house have four bedrooms?",
        "options": [
            "A. Are there four bedrooms in your house?",
            "B. There are four bedrooms in your house?",
            "C. Are there four bedrooms in house your?"
        ],
        "correct": 0,
        "exp": "🎯 ĐÁP ÁN ĐÚNG: A 📌 Chuyển đổi giữa 'Does S have...?' và 'Are there ... in S?'."
    },
    {
        "id": "rev_p_34",
        "num": 34,
        "category": "trans",
        "q": "Linh has short curly hair.",
        "options": [
            "A. Linh's hair is short and curly.",
            "B. Linh hair is short and curly.",
            "C. Linh's hair are short and curly."
        ],
        "correct": 0,
        "exp": "🎯 ĐÁP ÁN ĐÚNG: A 📌 'S + has + adj + hair' <=> 'S's hair is + adj'."
    },
    {
        "id": "rev_p_35",
        "num": 35,
        "category": "trans",
        "q": "students / are / creative / these / helpful / and / .",
        "options": [
            "A. Helpful and creative these students are.",
            "B. These students are creative and helpful.",
            "C. These students helpful and creative are."
        ],
        "correct": 1,
        "exp": "🎯 ĐÁP ÁN ĐÚNG: B 📌 Cấu trúc câu khẳng định: S (These students) + to be (are) + adj and adj (creative and helpful)."
    },
    {
        "id": "rev_p_36",
        "num": 36,
        "category": "trans",
        "q": "doing / are / homework / you / your / now / ?",
        "options": [
            "A. Are you doing your homework now?",
            "B. You are doing your homework now?",
            "C. Are doing you your homework now?"
        ],
        "correct": 0,
        "exp": "🎯 ĐÁP ÁN ĐÚNG: A 📌 Câu hỏi thì Hiện tại tiếp diễn: Are + you + V-ing (doing) + O (your homework) + adv (now)?"
    }
];

  const allItems = [...listeningP1, ...listeningP2, ...practiceQuestions];

  // Calculate scores
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = allItems.filter(item => userAnswers[item.id] === item.correct).length;
  const wrongCount = allItems.filter(item => userAnswers[item.id] !== undefined && userAnswers[item.id] !== item.correct).length;
  const unansweredCount = allItems.length - answeredCount;
  const rawRatio = allItems.length > 0 ? (correctCount / allItems.length) : 0;
  const totalScore10 = (rawRatio * 10.0).toFixed(1);

  // Số lượng câu đã làm từng phần
  const listeningAnswered = listeningP1.filter(i => userAnswers[i.id] !== undefined).length + 
                            listeningP2.filter(i => userAnswers[i.id] !== undefined).length;
  const practiceAnswered = practiceQuestions.filter(i => userAnswers[i.id] !== undefined).length;

  // Typography Scaling Helper Classes
  const fsQuestion = fontSizeMode === 'xlarge'
    ? 'text-lg sm:text-2xl font-bold leading-relaxed'
    : fontSizeMode === 'large'
      ? 'text-base sm:text-xl font-bold leading-relaxed'
      : 'text-sm sm:text-base font-bold leading-relaxed';

  const fsOption = fontSizeMode === 'xlarge'
    ? 'text-base sm:text-lg py-3.5 sm:py-4 px-4 sm:px-5 font-semibold'
    : fontSizeMode === 'large'
      ? 'text-sm sm:text-base py-3 sm:py-3.5 px-3.5 sm:px-4 font-semibold'
      : 'text-xs sm:text-sm py-2 px-3 font-medium';

  const fsBody = fontSizeMode === 'xlarge'
    ? 'text-base sm:text-lg leading-loose space-y-3'
    : fontSizeMode === 'large'
      ? 'text-sm sm:text-base leading-relaxed space-y-2'
      : 'text-xs sm:text-sm leading-relaxed space-y-1.5';

  const fsBadge = fontSizeMode === 'xlarge'
    ? 'w-8 h-8 sm:w-9 sm:h-9 text-sm sm:text-base'
    : fontSizeMode === 'large'
      ? 'w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm'
      : 'w-6 h-6 text-xs';

  const fsExp = fontSizeMode === 'xlarge'
    ? 'text-sm sm:text-base leading-relaxed'
    : fontSizeMode === 'large'
      ? 'text-xs sm:text-sm leading-relaxed'
      : 'text-xs leading-normal';

  // Xử lý chọn đáp án
  const handleSelectOption = (qId: string, optIdx: number) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  // Word count for writing
  const words = writingText.trim().split(/\s+/).filter(Boolean);
  const wordCount = writingText.trim() === '' ? 0 : words.length;

  // NỘP BÀI CHẤM ĐIỂM
  const handleSubmitExam = () => {
    if (answeredCount < 10) {
      const confirmSubmit = window.confirm(
        `⚠️ Em mới chỉ làm được ${answeredCount}/${allItems.length} câu.\n\n` +
        `Em có chắc chắn muốn nộp bài ngay bây giờ không? Lời khuyên là hãy làm thêm nhiều câu để gỡ điểm và đạt kết quả cao hơn nhé!`
      );
      if (!confirmSubmit) return;
    }

    setIsSubmitted(true);
    setActiveTab('results');

    const scoreNum = parseFloat(totalScore10);
    const meritBonus = scoreNum >= 8.0 ? 15 : scoreNum >= 5.0 ? 10 : 5;

    // Lưu vào lịch sử các lần làm bài
    const nowStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setAttemptHistory(prev => [
      {
        attempt: attemptCount,
        score: totalScore10,
        correct: correctCount,
        total: allItems.length,
        time: nowStr,
        meritBonus
      },
      ...prev
    ]);

    // Ghi nhận vào sổ điểm & cộng điểm chuyên cần trong dịch vụ
    if (currentStudent) {
      try {
        studentGradebookService.recordSubmission({
          studentId: currentStudent.id,
          studentCode: currentStudent.studentCode,
          studentName: currentStudent.name,
          classId: currentStudent.classId,
          className: currentStudent.className,
          grade: 6,
          unitNumber: 0,
          unitTitle: 'Đề Cương GK1',
          testTitle: `Đề Cương Ôn Tập GK1 Tiếng Anh 6 (Lần ${attemptCount})`,
          testType: 'gk_ck_exam',
          score: scoreNum,
          correctCount: correctCount,
          totalQuestions: allItems.length,
          timeSpentSeconds: 600
        });

        studentGradebookService.recordPracticeMerit(
          currentStudent.id,
          `Đề Cương Ôn Tập GK1 Tiếng Anh 6 - Lần ${attemptCount} (${scoreNum}đ)`,
          meritBonus
        );

        midtermMissionService.recordExamPracticeQuality(
          currentStudent.id,
          currentStudent.name,
          currentStudent.className,
          6,
          'decuong',
          scoreNum,
          600,
          `Đề Cương Ôn Tập GK1 Tiếng Anh 6 (Lần ${attemptCount})`
        );
      } catch (err) {
        console.error('Lỗi khi ghi nhận điểm:', err);
      }
    }

    alert(
      `🎉 CHÚC MỪNG EM ĐÃ NỘP BÀI THÀNH CÔNG (LẦN ${attemptCount})!\n\n` +
      `📊 Điểm số đạt được: ${totalScore10} / 10.0đ (${correctCount}/${allItems.length} câu đúng)\n` +
      `⭐ Em được CỘNG +${meritBonus} ĐIỂM CHUYÊN CẦN vào sổ thi đua của lớp!\n\n` +
      `💡 Hệ thống đã mở toàn bộ phần CHẤM CHỮA CHI TIẾT từng câu để em ôn lại.\n` +
      `🔄 Em có thể bấm "Làm Lại Lần ${attemptCount + 1}" bất cứ lúc nào để tiếp tục gỡ điểm và tích lũy thêm điểm chuyên cần!`
    );
  };

  // LÀM LẠI
  const handleRetakeExam = () => {
    const confirmRetake = window.confirm(
      `🔄 Em có chắc chắn muốn làm lại Lần ${attemptCount + 1} không?\n\n` +
      `Các câu trả lời sẽ được làm mới để em tự mình rèn luyện lại. Mỗi lần hoàn thành em đều được cộng thêm điểm chuyên cần!`
    );
    if (!confirmRetake) return;

    setUserAnswers({});
    setIsSubmitted(false);
    setAttemptCount(prev => prev + 1);
    setActiveTab('listening');
  };

  // Nộp bài viết đoạn văn gỡ điểm
  const handleWritingSubmit = () => {
    if (wordCount < 40) {
      alert(`⚠️ Đoạn văn của em hiện có ${wordCount} từ (chưa đủ 40-60 từ theo yêu cầu đề cương lớp 6). Hãy viết thêm 1-2 câu chi tiết về người bạn hoặc ngôi nhà nhé!`);
      return;
    }

    if (currentStudent && !writingAwarded) {
      studentGradebookService.recordPracticeMerit(
        currentStudent.id,
        `Bài Viết Đoạn Văn Đề Cương GK1 Lớp 6 (${wordCount} từ)`,
        10
      );
      setWritingAwarded(true);
    }

    alert(
      `🎉 XUẤT SẮC! Đoạn văn của em đạt ${wordCount} từ (đạt chuẩn độ dài 40-60 từ lớp 6).\n` +
      `⭐ Em được CỘNG +10 ĐIỂM CHUYÊN CẦN cho phần luyện viết!\n` +
      `Hãy đối chiếu với bài mẫu chuẩn điểm 10 bên cạnh để hoàn thiện cấu trúc câu nhé!`
    );
  };

  // Lọc câu hỏi trong tab Review / Results
  const filteredReviewItems = allItems.filter(item => {
    if (reviewFilter === 'wrong') return userAnswers[item.id] !== undefined && userAnswers[item.id] !== item.correct;
    if (reviewFilter === 'correct') return userAnswers[item.id] === item.correct;
    return true;
  });

  // Lọc câu hỏi trong tab Practice
  const filteredPractice = practiceQuestions.filter(item => {
    if (practiceFilter === 'all') return true;
    if (practiceFilter === 'lang') return item.category === 'lang';
    if (practiceFilter === 'read') return item.category === 'read';
    if (practiceFilter === 'cloze') return item.category === 'cloze';
    if (practiceFilter === 'trans') return item.category === 'trans';
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* BANNER HEADER */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider backdrop-blur-md">
                BỘ TÀI LIỆU LUYỆN TẬP BỔ TRỢ • NĂM HỌC 2026 - 2027
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider">
                TÀI LIỆU ÔN TẬP THAM KHẢO (MA TRẬN CV 7991)
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider">
                LẦN LÀM BÀI: LẦN {attemptCount}
              </span>
            </div>
            <div className="text-[11px] text-amber-200/90 font-medium italic pt-1">
              🔒 Lưu ý sư phạm: Toàn bộ bài tập nhằm ôn củng cố kiến thức ngữ pháp &amp; từ vựng. Tuyệt đối không phải và không gợi ý bất kỳ câu hỏi nào trong đề thi chính thức của nhà trường.
            </div>

            {/* BỘ CHUYỂN CỠ CHỮ TO RÕ TIỆN DỤNG */}
            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-xs shadow-inner">
              <span className="font-bold text-amber-300 flex items-center gap-1">
                <Type className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cỡ Chữ:</span>
              </span>
              <button
                type="button"
                onClick={() => setFontSizeMode('normal')}
                className={`px-2 py-0.5 rounded-lg font-bold transition cursor-pointer ${
                  fontSizeMode === 'normal'
                    ? 'bg-white text-slate-900 shadow-sm font-black'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                A Vừa
              </button>
              <button
                type="button"
                onClick={() => setFontSizeMode('large')}
                className={`px-2 py-0.5 rounded-lg font-bold transition cursor-pointer ${
                  fontSizeMode === 'large'
                    ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                A+ To Rõ
              </button>
              <button
                type="button"
                onClick={() => setFontSizeMode('xlarge')}
                className={`px-2 py-0.5 rounded-lg font-bold transition cursor-pointer ${
                  fontSizeMode === 'xlarge'
                    ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                A++ Cực To
              </button>
            </div>
          </div>

          <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight">
            📖 Đề Cương Ôn Tập &amp; Luyện Thi Trực Tuyến — Tiếng Anh 6
          </h2>
          <p className="text-sm sm:text-base text-teal-100 max-w-3xl leading-relaxed">
            Học sinh ôn tập lý thuyết Unit 1, 2, 3, luyện nghe Audio có lời thoại, làm bài tập trắc nghiệm chữ to rõ, nộp bài &amp; chấm chữa đầy đủ. Có thể làm lại nhiều lần để gỡ điểm và tích lũy điểm chuyên cần.
          </p>

          {/* Quick Stats Pill */}
          <div className="pt-1 flex items-center gap-3 flex-wrap">
            <div className="px-4 py-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center gap-2 text-sm font-bold">
              <Star className="w-4 h-4 text-amber-300" />
              <span>Tiến độ: <strong>{answeredCount}/{allItems.length} câu</strong></span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center gap-2 text-sm font-bold">
              <Trophy className="w-4 h-4 text-emerald-300" />
              <span>
                {isSubmitted ? (
                  <>Điểm đạt được: <strong className="text-amber-300 text-base">{totalScore10}</strong> / 10.0</>
                ) : (
                  <>Trạng thái: <strong className="text-yellow-300">Đang làm bài (Chưa nộp)</strong></>
                )}
              </span>
            </div>
            {currentStudent && (
              <div className="px-4 py-2 rounded-xl bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Mỗi lần nộp bài hoàn thành: Cộng +10 điểm chuyên cần!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-2">
          {/* Tab 1: Lý Thuyết */}
          <button
            type="button"
            onClick={() => setActiveTab('theory')}
            className={`px-2 sm:px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'theory'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-500/25 font-black'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Lý Thuyết Trọng Tâm Unit 1, 2, 3"
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span className="truncate">1. Lý Thuyết</span>
          </button>

          {/* Tab 2: Luyện Nghe */}
          <button
            type="button"
            onClick={() => setActiveTab('listening')}
            className={`px-2 sm:px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'listening'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-500/25 font-black'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Luyện Nghe Audio Part 1 &amp; 2"
          >
            <Headphones className="w-4 h-4 shrink-0" />
            <span className="truncate">2. Luyện Nghe</span>
            <span className="text-[10px] opacity-80 font-mono hidden md:inline">({listeningAnswered}/10)</span>
          </button>

          {/* Tab 3: Trắc Nghiệm */}
          <button
            type="button"
            onClick={() => setActiveTab('practice')}
            className={`px-2 sm:px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'practice'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-500/25 font-black'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Bài Tập Trắc Nghiệm 26 Câu"
          >
            <PenTool className="w-4 h-4 shrink-0" />
            <span className="truncate">3. Trắc Nghiệm</span>
            <span className="text-[10px] opacity-80 font-mono hidden md:inline">({practiceAnswered}/26)</span>
          </button>

          {/* Tab 4: Luyện Viết */}
          <button
            type="button"
            onClick={() => setActiveTab('writing')}
            className={`px-2 sm:px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'writing'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-500/25 font-black'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Luyện Viết Đoạn Văn 40-60 từ"
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span className="truncate">4. Luyện Viết</span>
          </button>

          {/* Tab 5: Chấm Chữa & Điểm */}
          <button
            type="button"
            onClick={() => setActiveTab('results')}
            className={`col-span-2 sm:col-span-1 px-2 sm:px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'results'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-black'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-amber-300/40'
            }`}
            title="Bảng Điểm, Chấm Chữa Chi Tiết &amp; Làm Lại"
          >
            <Trophy className="w-4 h-4 shrink-0 text-amber-500" />
            <span className="truncate">5. Chấm Chữa</span>
            {isSubmitted && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-950 text-amber-300 font-mono font-black">
                {totalScore10}đ
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ==================== TAB 1: LÝ THUYẾT TRỌNG TÂM ==================== */}
      {activeTab === 'theory' && (
        <div className="space-y-6">
          {/* Unit 1 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="px-3 py-1.5 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 font-black text-xs sm:text-sm">UNIT 1</span>
              <h3 className="text-lg sm:text-2xl font-black text-slate-800 dark:text-white uppercase">MY NEW SCHOOL (Ngôi Trường Mới Của Tôi)</h3>
            </div>
            
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${fsBody}`}>
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2 border border-slate-200/60 dark:border-slate-700/60">
                <h4 className="font-black text-teal-700 dark:text-teal-300 text-base sm:text-lg">1. Từ vựng đồ dùng học tập</h4>
                <p>• <strong>compass</strong> (n): compa vẽ hình tròn</p>
                <p>• <strong>school bag</strong> (n): cặp sách, ba lô</p>
                <p>• <strong>pencil sharpener</strong> (n): gọt bút chì</p>
                <p>• <strong>calculator</strong> (n): máy tính bỏ túi</p>
                <p>• <strong>rubber</strong> (n): cục tẩy</p>
                <p>• <strong>uniform</strong> (n): đồng phục học sinh</p>
                <p>• <strong>pencil case</strong> (n): hộp bút</p>
                <p>• <strong>textbook</strong> (n): sách giáo khoa</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2 border border-slate-200/60 dark:border-slate-700/60">
                <h4 className="font-black text-teal-700 dark:text-teal-300 text-base sm:text-lg">2. Cụm động từ kết hợp (Collocations)</h4>
                <p>• <strong>play</strong> + sports/games/music (football, badminton, the piano...)</p>
                <p>• <strong>do</strong> + homework / exercise / judo (hoạt động cá nhân, võ thuật)</p>
                <p>• <strong>have</strong> + meals / lessons (breakfast, lunch, a science lesson...)</p>
                <p>• <strong>study</strong> + subjects (English, maths, history, science...)</p>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-semibold border border-amber-200 dark:border-amber-900">
                  💡 <em>Mẹo gỡ điểm:</em> Gặp "judo", "homework" chọn động từ <strong>do</strong>; gặp môn thể thao có bóng chọn <strong>play</strong>!
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2.5 md:col-span-2 border border-slate-200/60 dark:border-slate-700/60">
                <h4 className="font-black text-teal-700 dark:text-teal-300 text-base sm:text-lg">3. Thì Hiện Tại Đơn (The Present Simple)</h4>
                <p>• <strong>Công thức:</strong> S + V(s/es) | S + don't / doesn't + V-inf | Do / Does + S + V-inf?</p>
                <p>• <strong>Chủ ngữ số ít (He, She, It, danh từ số ít):</strong> Động từ thêm <em>-s</em> hoặc <em>-es</em>.</p>
                <p>• <strong>Chủ ngữ số nhiều (I, We, You, They, danh từ số nhiều):</strong> Động từ giữ nguyên mẫu (V-inf).</p>
                <p>• <strong>Trạng từ chỉ tần suất:</strong> <em>always, usually, often, sometimes, never</em> (Đứng TRƯỚC động từ thường, đứng SAU động từ 'to be').</p>
                <p>• <strong>Phát âm đuôi -s/-es:</strong></p>
                <p className="pl-3">• /s/: Tận cùng bằng /p/, /t/, /k/, /f/, /θ/ (sách, bút, cặp, sách vở: books, maps, lamps...)</p>
                <p className="pl-3">• /ɪz/: Tận cùng bằng các âm rít /s, z, ʃ, ʧ, ʒ, ʤ/ (watches, boxes, houses, classes...)</p>
                <p className="pl-3">• /z/: Các âm còn lại (pens, rooms, pencils, tables...)</p>
              </div>
            </div>
          </div>

          {/* Unit 2 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="px-3 py-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-200 font-black text-xs sm:text-sm">UNIT 2</span>
              <h3 className="text-lg sm:text-2xl font-black text-slate-800 dark:text-white uppercase">MY HOUSE (Ngôi Nhà Của Tôi)</h3>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${fsBody}`}>
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2 border border-slate-200/60 dark:border-slate-700/60">
                <h4 className="font-black text-indigo-700 dark:text-indigo-300 text-base sm:text-lg">1. Từ vựng các kiểu nhà &amp; phòng ốc</h4>
                <p>• <strong>town house</strong>: nhà phố</p>
                <p>• <strong>country house</strong>: nhà ở vùng quê</p>
                <p>• <strong>villa</strong>: biệt thự sân vườn</p>
                <p>• <strong>apartment / flat</strong>: căn hộ chung cư</p>
                <p>• <strong>hall</strong>: đại sảnh, tiền sảnh</p>
                <p>• <strong>attic</strong>: gác mái</p>
                <p>• <strong>chest of drawers</strong>: tủ có nhiều ngăn kéo</p>
                <p>• <strong>dishwasher</strong>: máy rửa bát đĩa</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2 border border-slate-200/60 dark:border-slate-700/60">
                <h4 className="font-black text-indigo-700 dark:text-indigo-300 text-base sm:text-lg">2. Giới từ chỉ vị trí (Prepositions of place)</h4>
                <p>• <strong>in</strong> (trong) | <strong>on</strong> (trên mặt phẳng) | <strong>under</strong> (dưới gầm)</p>
                <p>• <strong>behind</strong> (phía sau) | <strong>in front of</strong> (phía trước)</p>
                <p>• <strong>next to</strong> (bên cạnh) | <strong>between ... and ...</strong> (ở giữa hai vật)</p>
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-semibold border border-blue-200 dark:border-blue-900">
                  💡 <em>Ví dụ kinh điển:</em> The cat is sleeping <strong>under</strong> the table. / The dog is <strong>in front of</strong> the kennel.
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2.5 md:col-span-2 border border-slate-200/60 dark:border-slate-700/60">
                <h4 className="font-black text-indigo-700 dark:text-indigo-300 text-base sm:text-lg">3. Sở Hữu Cách (Possessive Case)</h4>
                <p>• Thêm <strong>'s</strong> sau danh từ chỉ người số ít: <em>Nam's house</em> (ngôi nhà của Nam), <em>my mother's bag</em> (cặp của mẹ).</p>
                <p>• Nếu danh từ số nhiều đã có tận cùng là <em>-s</em>: chỉ thêm dấu phẩy <strong>'</strong>: <em>the teachers' room</em>.</p>
                <p>• <strong>Cấu trúc chuyển đổi câu tương đương gỡ điểm:</strong></p>
                <p className="pl-3 font-semibold text-emerald-700 dark:text-emerald-300">• My house has 6 rooms. &lt;=&gt; There are 6 rooms in my house.</p>
                <p className="pl-3 font-semibold text-emerald-700 dark:text-emerald-300">• Does your house have four bedrooms? &lt;=&gt; Are there four bedrooms in your house?</p>
              </div>
            </div>
          </div>

          {/* Unit 3 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="px-3 py-1.5 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-800 dark:text-pink-200 font-black text-xs sm:text-sm">UNIT 3</span>
              <h3 className="text-lg sm:text-2xl font-black text-slate-800 dark:text-white uppercase">MY FRIENDS (Những Người Bạn Của Tôi)</h3>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${fsBody}`}>
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2 border border-slate-200/60 dark:border-slate-700/60">
                <h4 className="font-black text-pink-700 dark:text-pink-300 text-base sm:text-lg">1. Tính từ miêu tả tính cách &amp; ngoại hình</h4>
                <p>• <strong>friendly</strong>: thân thiện, dễ mến</p>
                <p>• <strong>kind</strong>: tốt bụng, hay giúp đỡ</p>
                <p>• <strong>creative</strong>: sáng tạo, có nhiều ý tưởng mới</p>
                <p>• <strong>hard-working</strong>: chăm chỉ, cần cù làm việc</p>
                <p>• <strong>confident</strong>: tự tin khi nói chuyện trước đám đông</p>
                <p>• <strong>caring</strong>: chu đáo, biết quan tâm</p>
                <p>• <strong>round face</strong>: khuôn mặt tròn trịa phúc hậu</p>
                <p>• <strong>curly black hair</strong>: mái tóc xoăn màu đen</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2 border border-slate-200/60 dark:border-slate-700/60">
                <h4 className="font-black text-pink-700 dark:text-pink-300 text-base sm:text-lg">2. Thì Hiện Tại Tiếp Diễn (The Present Continuous)</h4>
                <p>• <strong>Công thức:</strong> S + am / is / are + V-ing</p>
                <p>• <strong>Ý nghĩa:</strong> Diễn tả hành động ĐANG XẢY RA ngay lúc nói.</p>
                <p>• <strong>Dấu hiệu nhận biết:</strong> <em>now, right now, at present, at the moment, Look!, Listen!, Be quiet!</em></p>
                <div className="p-3 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-900 dark:text-pink-200 font-semibold border border-pink-200 dark:border-pink-900">
                  💡 <em>Ví dụ:</em> Be quiet! The baby <strong>is sleeping</strong> in the bedroom.
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2.5 md:col-span-2 border border-slate-200/60 dark:border-slate-700/60">
                <h4 className="font-black text-pink-700 dark:text-pink-300 text-base sm:text-lg">3. Mẫu câu giao tiếp hàng ngày (Everyday English)</h4>
                <p>• <strong>Hỏi ngoại hình:</strong> "What does he / she look like?" &rarr; "He has short black hair and big eyes."</p>
                <p>• <strong>Hỏi tính cách:</strong> "What is he / she like?" &rarr; "She is very kind, creative and helpful."</p>
                <p>• <strong>Mượn đồ dùng học tập:</strong> "Can you pass/lend me your ruler, please?" &rarr; "Sure, here you are."</p>
                <p>• <strong>Cấu trúc biến đổi miêu tả:</strong></p>
                <p className="pl-3 font-semibold text-emerald-700 dark:text-emerald-300">• Linh has short curly hair. &lt;=&gt; Linh's hair is short and curly.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: LUYỆN NGHE AUDIO ==================== */}
      {activeTab === 'listening' && (
        <div className="space-y-6">
          {/* THANH ĐIỀU HƯỚNG & NỘP BÀI NHANH */}
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:bg-slate-800/90 p-4 rounded-2xl border border-teal-200 dark:border-teal-900 flex items-center justify-between gap-3 flex-wrap shadow-xs">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-xl bg-teal-600 text-white text-xs sm:text-sm font-black">
                Lần {attemptCount}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                Đã hoàn thành: <strong className="text-teal-600 dark:text-teal-400">{answeredCount}/{allItems.length} câu</strong>
                {isSubmitted && (
                  <span className="ml-2 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Đã chấm: {totalScore10}/10.0đ
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('practice')}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 font-bold text-xs sm:text-sm border border-slate-200 dark:border-slate-600 shadow-xs transition flex items-center gap-1 cursor-pointer"
              >
                <span>Sang Phần Trắc Nghiệm</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {!isSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitExam}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Nộp Bài Chấm Điểm</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRetakeExam}
                  className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-xs transition flex items-center gap-1 cursor-pointer"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Làm Lại Lần {attemptCount + 1}</span>
                </button>
              )}
            </div>
          </div>

          {/* PART 1 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between gap-3 flex-wrap pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="px-3 py-1 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 font-black text-xs sm:text-sm">
                  PART 1 • 1.25 ĐIỂM
                </span>
                <h3 className="text-base sm:text-xl font-black text-slate-800 dark:text-white mt-1.5 leading-snug">
                  Listen to Mi talking about her house and decide whether statements 1-5 are True (A) or False (B).
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTapescript1(!showTapescript1)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>{showTapescript1 ? 'Ẩn Lời Thoại (Tapescript)' : 'Xem Lời Thoại (Tapescript)'}</span>
                {showTapescript1 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Audio Player */}
            <div className="p-4 sm:p-5 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/60 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 text-teal-800 dark:text-teal-200 font-bold text-sm shrink-0">
                <Volume2 className="w-5 h-5 text-teal-600 animate-pulse" />
                <span>File Audio Part 1:</span>
              </div>
              <audio controls className="w-full h-11 rounded-xl outline-none" preload="metadata">
                <source src={audioPart1Url} type="audio/mpeg" />
                Trình duyệt của em không hỗ trợ phát âm thanh.
              </audio>
            </div>

            {/* Tapescript Collapsible */}
            {showTapescript1 && (
              <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-sm sm:text-base space-y-2.5">
                <div className="font-bold text-amber-800 dark:text-amber-200 flex items-center gap-1.5 text-base">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                  <span>Lời thoại tiếng Anh &amp; Dịch nghĩa chi tiết (Part 1):</span>
                </div>
                <p className="text-slate-800 dark:text-slate-200 italic leading-relaxed">
                  "Hi, I'm Mi. I live in a town house in Hanoi. My house is quite big. There are six rooms in my house: a living room, a kitchen, four bedrooms, and two bathrooms. My favourite room is my bedroom because it has a big window and many beautiful pictures. I love my house because it is very cozy and comfortable."
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-sm pt-2 border-t border-amber-200/60 dark:border-amber-900/40 leading-relaxed">
                  <em>Dịch: "Xin chào, mình là Mi. Mình sống trong một ngôi nhà phố ở Hà Nội. Nhà mình khá to. Có 6 phòng trong nhà: một phòng khách, một bếp, bốn phòng ngủ và hai phòng tắm. Phòng yêu thích của mình là phòng ngủ vì nó có cửa sổ to và nhiều bức tranh đẹp. Mình yêu ngôi nhà vì nó rất ấm cúng và tiện nghi."</em>
                </p>
              </div>
            )}

            {/* Questions 1-5 */}
            <div className="space-y-4 pt-2">
              {listeningP1.map(item => {
                const isAnswered = userAnswers[item.id] !== undefined;
                const isCorrect = userAnswers[item.id] === item.correct;
                return (
                  <div 
                    key={item.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition ${
                      isSubmitted
                        ? isCorrect
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-400'
                          : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-400'
                        : isAnswered
                          ? 'bg-teal-50/50 dark:bg-teal-950/20 border-teal-300'
                          : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`${fsBadge} rounded-xl bg-teal-600 text-white font-black flex items-center justify-center shrink-0 mt-0.5 shadow-xs`}>
                        {item.num}
                      </span>
                      <div className="flex-1 space-y-3">
                        <p className={`${fsQuestion} text-slate-900 dark:text-slate-100`}>
                          {item.q}
                        </p>

                        <div className="flex items-center gap-3 flex-wrap">
                          {item.options.map((opt, oIdx) => {
                            const isChosen = userAnswers[item.id] === oIdx;
                            return (
                              <button
                                key={oIdx}
                                type="button"
                                disabled={isSubmitted}
                                onClick={() => handleSelectOption(item.id, oIdx)}
                                className={`${fsOption} rounded-xl transition flex items-center gap-2 cursor-pointer ${
                                  isChosen
                                    ? isSubmitted
                                      ? oIdx === item.correct
                                        ? 'bg-emerald-600 text-white shadow-md font-black ring-2 ring-emerald-400'
                                        : 'bg-rose-600 text-white shadow-md font-black ring-2 ring-rose-400'
                                      : 'bg-teal-600 text-white shadow-md font-black ring-2 ring-teal-400'
                                    : isSubmitted && oIdx === item.correct
                                      ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-500 font-black'
                                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 hover:border-teal-500 shadow-2xs'
                                }`}
                              >
                                <span>{opt}</span>
                                {isChosen && !isSubmitted && <span>✓</span>}
                              </button>
                            );
                          })}
                        </div>

                        {/* Giải thích sau khi nộp */}
                        {isSubmitted && (
                          <div className={`mt-3 p-3.5 sm:p-4 rounded-xl ${fsExp} font-medium ${
                            isCorrect ? 'bg-emerald-100/80 text-emerald-950 border border-emerald-300' : 'bg-rose-100/80 text-rose-950 border border-rose-300'
                          }`}>
                            <p>{item.exp}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PART 2 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between gap-3 flex-wrap pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="px-3 py-1 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 font-black text-xs sm:text-sm">
                  PART 2 • 1.25 ĐIỂM
                </span>
                <h3 className="text-base sm:text-xl font-black text-slate-800 dark:text-white mt-1.5 leading-snug">
                  Listen to Phong and An talking about their school and choose the best answer A, B, or C.
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTapescript2(!showTapescript2)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>{showTapescript2 ? 'Ẩn Lời Thoại (Tapescript)' : 'Xem Lời Thoại (Tapescript)'}</span>
                {showTapescript2 ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {/* Audio Player */}
            <div className="p-4 sm:p-5 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/60 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 text-teal-800 dark:text-teal-200 font-bold text-sm shrink-0">
                <Volume2 className="w-5 h-5 text-teal-600 animate-pulse" />
                <span>File Audio Part 2:</span>
              </div>
              <audio controls className="w-full h-11 rounded-xl outline-none" preload="metadata">
                <source src={audioPart2Url} type="audio/mpeg" />
                Trình duyệt của em không hỗ trợ phát âm thanh.
              </audio>
            </div>

            {/* Tapescript Collapsible */}
            {showTapescript2 && (
              <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-sm sm:text-base space-y-2.5">
                <div className="font-bold text-amber-800 dark:text-amber-200 flex items-center gap-1.5 text-base">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                  <span>Lời thoại tiếng Anh &amp; Dịch nghĩa chi tiết (Part 2):</span>
                </div>
                <p className="text-slate-800 dark:text-slate-200 italic leading-relaxed">
                  "Phong: Hi An! Welcome to our school! I go to An Son Lower Secondary School. How do you feel about your new school?<br />
                  An: Oh, hi Phong! I really like it here. There are five clubs in our school: sports, music, art, science, and English.<br />
                  Phong: That's great! Which club do you want to join?<br />
                  An: I want to join the English club because I love speaking English with foreign teachers.<br />
                  Phong: Nice! What is your favourite subject?<br />
                  An: My favourite subject is Science. I love doing fun experiments in the lab.<br />
                  Phong: Awesome! Let's play football in the school playground after school today!<br />
                  An: Sure, that sounds fun!"
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-sm pt-2 border-t border-amber-200/60 dark:border-amber-900/40 leading-relaxed">
                  <em>Dịch: "Phong chào An và giới thiệu mình học ở trường THCS An Sơn. An chia sẻ trường có 5 câu lạc bộ và muốn tham gia CLB Tiếng Anh. Môn học yêu thích của An là Khoa học vì được làm thí nghiệm. Cuối cùng, hai bạn hẹn nhau cùng đá bóng ở sân trường sau giờ học."</em>
                </p>
              </div>
            )}

            {/* Questions 6-10 */}
            <div className="space-y-4 pt-2">
              {listeningP2.map(item => {
                const isAnswered = userAnswers[item.id] !== undefined;
                const isCorrect = userAnswers[item.id] === item.correct;
                return (
                  <div 
                    key={item.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition ${
                      isSubmitted
                        ? isCorrect
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-400'
                          : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-400'
                        : isAnswered
                          ? 'bg-teal-50/50 dark:bg-teal-950/20 border-teal-300'
                          : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`${fsBadge} rounded-xl bg-teal-600 text-white font-black flex items-center justify-center shrink-0 mt-0.5 shadow-xs`}>
                        {item.num}
                      </span>
                      <div className="flex-1 space-y-3">
                        <p className={`${fsQuestion} text-slate-900 dark:text-slate-100`}>
                          {item.q}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {item.options.map((opt, oIdx) => {
                            const isChosen = userAnswers[item.id] === oIdx;
                            return (
                              <button
                                key={oIdx}
                                type="button"
                                disabled={isSubmitted}
                                onClick={() => handleSelectOption(item.id, oIdx)}
                                className={`${fsOption} rounded-xl transition text-left cursor-pointer flex items-center justify-between ${
                                  isChosen
                                    ? isSubmitted
                                      ? oIdx === item.correct
                                        ? 'bg-emerald-600 text-white shadow-md font-black ring-2 ring-emerald-400'
                                        : 'bg-rose-600 text-white shadow-md font-black ring-2 ring-rose-400'
                                      : 'bg-teal-600 text-white shadow-md font-black ring-2 ring-teal-400'
                                    : isSubmitted && oIdx === item.correct
                                      ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-500 font-black'
                                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 hover:border-teal-500 shadow-2xs'
                                }`}
                              >
                                <span>{opt}</span>
                                {isChosen && !isSubmitted && <span>✓</span>}
                              </button>
                            );
                          })}
                        </div>

                        {/* Giải thích sau khi nộp */}
                        {isSubmitted && (
                          <div className={`mt-3 p-3.5 sm:p-4 rounded-xl ${fsExp} font-medium ${
                            isCorrect ? 'bg-emerald-100/80 text-emerald-950 border border-emerald-300' : 'bg-rose-100/80 text-rose-950 border border-rose-300'
                          }`}>
                            <p>{item.exp}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: BÀI TẬP TRẮC NGHIỆM ==================== */}
      {activeTab === 'practice' && (
        <div className="space-y-6">
          {/* THANH ĐIỀU HƯỚNG & NỘP BÀI NHANH */}
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:bg-slate-800/90 p-4 sm:p-5 rounded-2xl border border-teal-200 dark:border-teal-900 flex items-center justify-between gap-3 flex-wrap shadow-xs">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="px-3.5 py-1.5 rounded-xl bg-teal-600 text-white text-xs sm:text-sm font-black">
                Lần {attemptCount}
              </span>
              <span className="text-xs sm:text-base font-bold text-slate-700 dark:text-slate-300">
                Tiến độ: <strong className="text-teal-600 dark:text-teal-400">{answeredCount}/{allItems.length} câu</strong>
                {isSubmitted && (
                  <span className="ml-2 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold">
                    Đã chấm: {totalScore10}/10.0đ
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {!isSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitExam}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Nộp Bài &amp; Chấm Chữa</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveTab('results')}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Xem Điểm ({totalScore10}đ)</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRetakeExam}
                    className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>Làm Lại Lần {attemptCount + 1}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-2 flex-wrap">
            <span className="text-xs sm:text-sm font-bold text-slate-500">Lọc phần thi:</span>
            <button
              onClick={() => setPracticeFilter('all')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                practiceFilter === 'all' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Tất cả ({practiceQuestions.length})
            </button>
            <button
              onClick={() => setPracticeFilter('lang')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                practiceFilter === 'lang' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Language Focus (12 câu)
            </button>
            <button
              onClick={() => setPracticeFilter('cloze')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                practiceFilter === 'cloze' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Đọc Điền Từ (5 câu)
            </button>
            <button
              onClick={() => setPracticeFilter('read')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                practiceFilter === 'read' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Đọc Hiểu (5 câu)
            </button>
            <button
              onClick={() => setPracticeFilter('trans')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                practiceFilter === 'trans' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Viết Lại &amp; Sắp Xếp (4 câu)
            </button>
          </div>

          {/* List Questions */}
          <div className="space-y-4">
            {filteredPractice.map(item => {
              const isAnswered = userAnswers[item.id] !== undefined;
              const isCorrect = userAnswers[item.id] === item.correct;
              return (
                <div 
                  key={item.id}
                  className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl border transition ${
                    isSubmitted
                      ? isCorrect
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-400'
                        : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-400'
                      : isAnswered
                        ? 'bg-teal-50/50 dark:bg-teal-950/20 border-teal-300'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <span className={`${fsBadge} rounded-xl bg-teal-600 text-white font-black flex items-center justify-center shrink-0 mt-0.5 shadow-xs`}>
                      {item.num}
                    </span>
                    <div className="flex-1 space-y-3.5">
                      <p className={`${fsQuestion} text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-line`}>
                        {item.q}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {item.options.map((opt, oIdx) => {
                          const isChosen = userAnswers[item.id] === oIdx;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              disabled={isSubmitted}
                              onClick={() => handleSelectOption(item.id, oIdx)}
                              className={`${fsOption} rounded-xl sm:rounded-2xl transition text-left cursor-pointer flex items-center justify-between ${
                                isChosen
                                  ? isSubmitted
                                    ? oIdx === item.correct
                                      ? 'bg-emerald-600 text-white shadow-md font-black ring-2 ring-emerald-400'
                                      : 'bg-rose-600 text-white shadow-md font-black ring-2 ring-rose-400'
                                    : 'bg-teal-600 text-white shadow-md font-black ring-2 ring-teal-400'
                                  : isSubmitted && oIdx === item.correct
                                    ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-500 font-black'
                                    : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 hover:border-teal-500 shadow-2xs'
                              }`}
                            >
                              <span>{opt}</span>
                              {isChosen && !isSubmitted && <span>✓</span>}
                            </button>
                          );
                        })}
                      </div>

                      {/* Giải thích sau khi nộp */}
                      {isSubmitted && (
                        <div className={`mt-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl ${fsExp} font-medium ${
                          isCorrect ? 'bg-emerald-100/80 text-emerald-950 border border-emerald-300' : 'bg-rose-100/80 text-rose-950 border border-rose-300'
                        }`}>
                          <p>{item.exp}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== TAB 4: LUYỆN VIẾT ĐOẠN VĂN ==================== */}
      {activeTab === 'writing' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CỘT TRÁI: KHUNG LUYỆN VIẾT CỦA HỌC SINH */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="px-3 py-1.5 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 font-black text-xs sm:text-sm">
                WRITING TASK • 1.0 ĐIỂM
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-500">
                Số từ: <strong className={wordCount >= 40 && wordCount <= 70 ? 'text-emerald-600 text-base' : 'text-amber-600 text-base'}>{wordCount}</strong> / 40 - 60 từ
              </span>
            </div>

            <div>
              <h3 className="text-base sm:text-xl font-black text-slate-800 dark:text-white leading-snug">
                Đề bài: Write a paragraph (40-60 words) about your best friend or your house.
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                (Hãy viết một đoạn văn ngắn từ 40 - 60 từ miêu tả về người bạn thân nhất của em hoặc ngôi nhà nơi em đang sống).
              </p>
            </div>

            {/* Dàn ý gợi ý gỡ điểm */}
            <div className={`p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/40 ${fsBody} space-y-2`}>
              <p className="font-black text-teal-800 dark:text-teal-200">💡 4 Câu gợi ý gỡ điểm tuyệt đối:</p>
              <p>1. <strong>Mở đoạn:</strong> My best friend is... / I live in a beautiful house in...</p>
              <p>2. <strong>Ngoại hình / Cấu trúc:</strong> He/She has... (round face, short hair...) / My house has six rooms...</p>
              <p>3. <strong>Tính cách / Điểm nổi bật:</strong> He/She is very kind, creative and helpful... / My favourite room is my bedroom because...</p>
              <p>4. <strong>Kết đoạn:</strong> I really like him/her because... / I love my house very much.</p>
            </div>

            {/* Textarea */}
            <div className="space-y-3">
              <textarea
                value={writingText}
                onChange={e => setWritingText(e.target.value)}
                rows={8}
                placeholder="Nhập đoạn văn của em vào đây (bằng tiếng Anh)... Ví dụ: My best friend is Nam. He is twelve years old and studies with me in class 6A..."
                className={`w-full p-4 sm:p-5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 ${fontSizeMode === 'xlarge' ? 'text-lg' : fontSizeMode === 'large' ? 'text-base' : 'text-sm'} outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed`}
              />

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setWritingText('')}
                  className="text-xs sm:text-sm text-slate-400 hover:text-slate-600 transition"
                >
                  Xóa viết lại
                </button>
                <button
                  type="button"
                  onClick={handleWritingSubmit}
                  className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Nộp Bài Đoạn Văn (+10 Điểm Chuyên Cần)</span>
                </button>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: BÀI MẪU THAM KHẢO & DÀN Ý ĐIỂM 10 */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-black text-xs sm:text-sm">
                BÀI MẪU CHUẨN ĐIỂM 10
              </span>
              <button
                type="button"
                onClick={() => setShowSampleWriting(!showSampleWriting)}
                className="text-xs sm:text-sm font-bold text-teal-600 hover:underline cursor-pointer"
              >
                {showSampleWriting ? 'Thu gọn' : 'Xem chi tiết'}
              </button>
            </div>

            <div className={`space-y-4 ${fsBody}`}>
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2.5 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-slate-800 dark:text-white text-base sm:text-lg">Mẫu 1: Miêu tả Người Bạn Thân (52 từ)</h4>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">52 từ • Chuẩn GDPT 2018</span>
                </div>
                <p className="text-slate-800 dark:text-slate-100 leading-relaxed italic">
                  "My best friend is Nam. He is twelve years old and studies with me in class 6A. He is tall and has short black hair with a friendly round face. Nam is very kind and helpful because he always shares his pens and helps classmates with homework. I really like him because he is a wonderful friend."
                </p>
                <div className="text-xs sm:text-sm text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-700 leading-relaxed">
                  <em>Dịch: Bạn thân nhất của mình là Nam. Bạn ấy 12 tuổi và học cùng mình ở lớp 6A. Bạn ấy cao, có mái tóc đen ngắn và khuôn mặt tròn thân thiện. Nam rất tốt bụng và hay giúp đỡ vì bạn luôn chia sẻ bút và giúp bạn cùng lớp làm bài tập. Mình rất quý bạn ấy vì bạn là một người bạn tuyệt vời.</em>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2.5 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-slate-800 dark:text-white text-base sm:text-lg">Mẫu 2: Miêu tả Ngôi Nhà Của Em (55 từ)</h4>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">55 từ • Dễ thuộc</span>
                </div>
                <p className="text-slate-800 dark:text-slate-100 leading-relaxed italic">
                  "I live with my family in a lovely country house in Dong Yen. My house has six rooms: a living room, a kitchen, three bedrooms and a bathroom. Behind the house, there is a green garden with many flowers. My favourite room is my bedroom because it is bright and comfortable. I love my peaceful home very much."
                </p>
                <div className="text-xs sm:text-sm text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-700 leading-relaxed">
                  <em>Dịch: Mình sống cùng gia đình trong một ngôi nhà quê xinh xắn ở Đồng Yên. Nhà mình có 6 phòng: một phòng khách, một bếp, 3 phòng ngủ và một phòng tắm. Phía sau nhà có khu vườn xanh mát nhiều hoa. Phòng yêu thích của mình là phòng ngủ vì rất sáng và tiện nghi. Mình rất yêu mái ấm bình yên của mình.</em>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 5: BẢNG ĐIỂM & CHẤM CHỮA ==================== */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          {!isSubmitted ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 mx-auto flex items-center justify-center">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white">
                Em Chưa Nộp Bài Để Xem Bảng Điểm &amp; Chấm Chữa
              </h3>
              <p className="text-slate-500 text-sm max-w-lg mx-auto">
                Hiện tại em đã hoàn thành <strong>{answeredCount}/{allItems.length} câu</strong>. Hãy chuyển sang Tab Luyện Nghe và Tab Trắc Nghiệm để hoàn thành bài và bấm nút "Nộp Bài" nhé!
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('listening')}
                  className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition"
                >
                  Làm tiếp bài nghe
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('practice')}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 transition"
                >
                  Làm tiếp trắc nghiệm
                </button>
                <button
                  type="button"
                  onClick={handleSubmitExam}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-md transition"
                >
                  Nộp bài ngay
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* SCORE SUMMARY CARD */}
              <div className="bg-gradient-to-br from-white via-teal-50/40 to-emerald-50/50 dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-teal-200 dark:border-slate-800 shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                  {/* Cột 1: Điểm số */}
                  <div className="text-center md:border-r border-slate-200 dark:border-slate-800 pr-4 space-y-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Điểm Tổng Kết</span>
                    <div className="text-5xl font-black text-teal-600 tracking-tight">
                      {totalScore10}
                    </div>
                    <span className="text-xs font-semibold text-slate-400">trên thang điểm 10.0</span>
                  </div>

                  {/* Cột 2: Số câu đúng/sai */}
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-600 dark:text-slate-300">Độ chính xác:</span>
                      <span className="text-teal-600">{Math.round(rawRatio * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.round(rawRatio * 100)}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                      <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
                        <span className="text-emerald-700 dark:text-emerald-300 font-bold block">Đúng</span>
                        <strong className="text-emerald-800 dark:text-emerald-200 text-sm">{correctCount} câu</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900">
                        <span className="text-rose-700 dark:text-rose-300 font-bold block">Sai</span>
                        <strong className="text-rose-800 dark:text-rose-200 text-sm">{wrongCount} câu</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-slate-500 font-bold block">Chưa làm</span>
                        <strong className="text-slate-700 dark:text-slate-300 text-sm">{unansweredCount} câu</strong>
                      </div>
                    </div>
                  </div>

                  {/* Cột 3: Nút làm lại */}
                  <div className="flex flex-col gap-2 justify-center">
                    <button
                      type="button"
                      onClick={handleRetakeExam}
                      className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RotateCw className="w-4 h-4" />
                      <span>Làm Lại Lần {attemptCount + 1}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onGoToExam ? onGoToExam() : null}
                      className="w-full py-2.5 px-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 text-teal-700 dark:text-teal-300 font-bold text-xs border border-teal-300 dark:border-teal-800 shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Vào Thi Thử Mã Đề 605</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Nhận xét sư phạm */}
                <div className="mt-4 pt-4 border-t border-teal-200/60 dark:border-slate-800 flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Lời phê của Thầy Đinh Thành: </span>
                    {parseFloat(totalScore10) >= 8.5 ? (
                      <span>Xuất sắc! Em đã nắm rất vững toàn bộ kiến thức 3 Unit đầu. Cứ giữ vững phong độ này trong kỳ thi Giữa kỳ 1 nhé!</span>
                    ) : parseFloat(totalScore10) >= 6.5 ? (
                      <span>Khá tốt! Em đã gỡ điểm thành công phần từ vựng và câu cơ bản. Hãy xem lại các câu sai bên dưới và bấm "Làm lại" để bứt phá điểm 9-10 nhé!</span>
                    ) : (
                      <span>Cố lên em! Đừng nản lòng, hãy xem kỹ lời giải chi tiết cho từng câu bên dưới, sau đó bấm "Làm lại lần {attemptCount + 1}" để nâng cao điểm số nhé!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* REVIEW FILTER */}
              <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">Xem câu:</span>
                  <button
                    onClick={() => setReviewFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      reviewFilter === 'all' ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Tất cả ({allItems.length})
                  </button>
                  <button
                    onClick={() => setReviewFilter('wrong')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      reviewFilter === 'wrong' ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Chỉ câu sai ({wrongCount})
                  </button>
                  <button
                    onClick={() => setReviewFilter('correct')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      reviewFilter === 'correct' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Chỉ câu đúng ({correctCount})
                  </button>
                </div>
              </div>

              {/* DETAILED QUESTIONS REVIEW */}
              <div className="space-y-4">
                {filteredReviewItems.map(item => {
                  const isAnswered = userAnswers[item.id] !== undefined;
                  const isCorrect = userAnswers[item.id] === item.correct;
                  return (
                    <div 
                      key={item.id}
                      className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl border transition ${
                        isCorrect
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-400'
                          : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-400'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <span className={`${fsBadge} rounded-xl text-white font-black flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${
                          isCorrect ? 'bg-emerald-600' : 'bg-rose-600'
                        }`}>
                          {item.num}
                        </span>
                        <div className="flex-1 space-y-3.5">
                          <p className={`${fsQuestion} text-slate-900 dark:text-slate-100 whitespace-pre-line`}>
                            {item.q}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {item.options.map((opt, oIdx) => {
                              const isChosen = userAnswers[item.id] === oIdx;
                              const isRight = oIdx === item.correct;
                              return (
                                <div
                                  key={oIdx}
                                  className={`${fsOption} rounded-xl sm:rounded-2xl ${
                                    isRight
                                      ? 'bg-emerald-600 text-white font-black shadow-sm'
                                      : isChosen
                                        ? 'bg-rose-600 text-white font-black shadow-sm'
                                        : 'bg-white/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                  }`}
                                >
                                  <span>{opt}</span>
                                  {isRight && <span className="ml-1 text-xs"> (Đáp án đúng)</span>}
                                  {isChosen && !isRight && <span className="ml-1 text-xs"> (Em đã chọn)</span>}
                                </div>
                              );
                            })}
                          </div>

                          <div className={`p-4 rounded-xl sm:rounded-2xl ${fsExp} font-medium ${
                            isCorrect ? 'bg-emerald-100/90 text-emerald-950 border border-emerald-300' : 'bg-rose-100/90 text-rose-950 border border-rose-300'
                          }`}>
                            <p className="font-semibold">{item.exp}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
