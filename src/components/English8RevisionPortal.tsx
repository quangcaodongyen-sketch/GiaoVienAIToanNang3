import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Headphones, PenTool, Award, Trophy, Star, Volume2, 
  RotateCw, CheckCircle2, XCircle, ChevronDown, ChevronUp, 
  Sparkles, Lightbulb, FileText, Check, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { studentGradebookService, StudentProfile } from '../services/studentGradebookService';

interface English8RevisionPortalProps {
  currentStudent?: StudentProfile | null;
  onGoToExams?: () => void;
}

export const English8RevisionPortal: React.FC<English8RevisionPortalProps> = ({ 
  currentStudent,
  onGoToExams 
}) => {
  const [activeTab, setActiveTab] = useState<'theory' | 'listening' | 'practice' | 'writing' | 'results'>('theory');
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showTapescript1, setShowTapescript1] = useState(false);
  const [showTapescript2, setShowTapescript2] = useState(false);
  const [showSampleWriting, setShowSampleWriting] = useState(false);
  const [writingText, setWritingText] = useState('');
  const [practiceFilter, setPracticeFilter] = useState<'all' | 'lang' | 'read' | 'cloze' | 'trans'>('all');
  const [pointsAwarded, setPointsAwarded] = useState(false);

  // Audio elements
  const audioPart1Url = '/audio/g8_gk1_part1.mp3';
  const audioPart2Url = '/audio/g8_gk1_part2.mp3';

  // Questions Data
  const listeningP1 = [
    {
      id: "rev_l1_1",
      num: 1,
      q: "Many teenagers feel stressed because of schoolwork and exams.",
      options: ["A. True", "B. False"],
      correct: 0,
      exp: "Đúng! Bài nghe nói rõ: 'Teenagers today often feel stressed because of schoolwork, exams and their busy schedules.'"
    },
    {
      id: "rev_l1_2",
      num: 2,
      q: "Taking short breaks can help teenagers relax.",
      options: ["A. True", "B. False"],
      correct: 0,
      exp: "Đúng! Bài nghe khuyên: '...they should organise their time and take short breaks between study sessions.'"
    },
    {
      id: "rev_l1_3",
      num: 3,
      q: "Teenagers should spend all their free time studying.",
      options: ["A. True", "B. False"],
      correct: 1,
      exp: "Sai (False)! Bài nghe nói: 'Teenagers should NOT spend all their free time studying because they need time to rest...'"
    },
    {
      id: "rev_l1_4",
      num: 4,
      q: "Talking to trusted people can help teenagers deal with stress.",
      options: ["A. True", "B. False"],
      correct: 0,
      exp: "Đúng! Bài nghe: 'When they have problems, talking to parents, teachers or trusted friends can help them feel better.'"
    },
    {
      id: "rev_l1_5",
      num: 5,
      q: "Having a balanced lifestyle can help teenagers feel better.",
      options: ["A. True", "B. False"],
      correct: 0,
      exp: "Đúng! Lối sống cân bằng (nghỉ ngơi, học tập, thể thao) là yếu tố quan trọng cho sức khỏe thanh thiếu niên."
    }
  ];

  const listeningP2 = [
    {
      id: "rev_l2_6",
      num: 6,
      q: "Where does the speaker live?",
      options: ["A. In a busy city.", "B. In a small village.", "C. Near a large shopping centre."],
      correct: 1,
      exp: "Đáp án B! 'I live in a small village in the countryside. Life here is peaceful...'"
    },
    {
      id: "rev_l2_7",
      num: 7,
      q: "What does the speaker's family grow on their farm?",
      options: ["A. Rice and vegetables.", "B. Flowers and coffee.", "C. Apples and oranges."],
      correct: 0,
      exp: "Đáp án A! 'My family grows rice and vegetables on our farm.'"
    },
    {
      id: "rev_l2_8",
      num: 8,
      q: "How does the speaker's father drive the combine harvester?",
      options: ["A. More carelessly than other farmers.", "B. As carelessly as other farmers.", "C. More carefully than some other farmers."],
      correct: 2,
      exp: "Đáp án C! 'He always drives it more carefully than some other farmers because safety is important.'"
    },
    {
      id: "rev_l2_9",
      num: 9,
      q: "What does the speaker like most about village life?",
      options: ["A. The noisy streets.", "B. The peaceful scenery.", "C. The crowded shopping centres."],
      correct: 1,
      exp: "Đáp án B! 'I especially love the peaceful scenery, the green fields and the fresh air.'"
    },
    {
      id: "rev_l2_10",
      num: 10,
      q: "What is the main idea of the talk?",
      options: ["A. The difficulties of living in a big city.", "B. The importance of modern technology at school.", "C. The speaker's life and experiences in the countryside."],
      correct: 2,
      exp: "Đáp án C! Bài nói kể về cuộc sống và trải nghiệm của tác giả tại vùng quê thanh bình."
    }
  ];

  const practiceQuestions = [
    // Language Focus
    {
      id: "rev_p_11",
      cat: "lang",
      num: 11,
      q: "My sister is fond of ______ paper flowers in her free time.",
      options: ["A. make", "B. making", "C. to make"],
      correct: 1,
      exp: "Cấu trúc be fond of + V-ing (thích làm gì đó). Đáp án: making."
    },
    {
      id: "rev_p_12",
      cat: "lang",
      num: 12,
      q: "Farmers use a ______ to harvest rice quickly on the fields.",
      options: ["A. combine harvester", "B. ferry", "C. lighthouse"],
      correct: 0,
      exp: "'combine harvester' là máy gặt đập liên hợp giúp thu hoạch lúa nhanh."
    },
    {
      id: "rev_p_13",
      cat: "lang",
      num: 13,
      q: "The villagers are very ______. They always welcome visitors warmly.",
      options: ["A. hospitable", "B. stressful", "C. addictive"],
      correct: 0,
      exp: "'hospitable' nghĩa là hiếu khách, niềm nở chào đón khách ghé thăm."
    },
    {
      id: "rev_p_14",
      cat: "lang",
      num: 14,
      q: "Lan usually finishes her homework ______ than her younger brother.",
      options: ["A. careful", "B. more carefully", "C. most carefully"],
      correct: 1,
      exp: "Bổ nghĩa cho động từ 'finishes' trong so sánh hơn với 'than', dùng trạng từ dài: more carefully than."
    },
    {
      id: "rev_p_15",
      cat: "lang",
      num: 15,
      q: "Many teenagers feel ______ before an important exam.",
      options: ["A. pressure", "B. peer", "C. stressed"],
      correct: 2,
      exp: "'feel stressed' nghĩa là cảm thấy căng thẳng/lo âu trước kỳ thi."
    },
    {
      id: "rev_p_16",
      cat: "lang",
      num: 16,
      q: "My brother can run ______ than I can.",
      options: ["A. faster", "B. more fast", "C. fastest"],
      correct: 0,
      exp: "'fast' là trạng từ ngắn đặc biệt, so sánh hơn là 'faster than'."
    },
    {
      id: "rev_p_17",
      cat: "lang",
      num: 17,
      q: "I prefer ______ models to playing computer games.",
      options: ["A. make", "B. making", "C. made"],
      correct: 1,
      exp: "Cấu trúc prefer V-ing to V-ing (thích làm gì hơn làm gì). Đáp án: making."
    },
    {
      id: "rev_p_18",
      cat: "lang",
      num: 18,
      q: "I was tired, ______ I went to bed early last night.",
      options: ["A. but", "B. or", "C. so"],
      correct: 2,
      exp: "Liên từ 'so' (vì vậy) chỉ kết quả: Tôi mệt, vì vậy tôi đi ngủ sớm."
    },
    {
      id: "rev_p_19",
      cat: "lang",
      num: 19,
      q: "My cousin speaks English ______ than he did last year.",
      options: ["A. well", "B. better", "C. best"],
      correct: 1,
      exp: "'well' có dạng so sánh hơn bất quy tắc bắt buộc nhớ: better than."
    },
    {
      id: "rev_p_20",
      cat: "lang",
      num: 20,
      q: "You should not share your password online because it may put your ______ at risk.",
      options: ["A. account", "B. orchard", "C. crop"],
      correct: 0,
      exp: "Cụm 'put your account at risk' (làm tài khoản mạng gặp nguy cơ rủi ro)."
    },
    {
      id: "rev_p_21",
      cat: "lang",
      num: 21,
      q: "Mai: “Would you like to join our origami club this afternoon?” - Nam: “______”",
      options: ["A. I'd love to.", "B. You look great.", "C. Never mind."],
      correct: 0,
      exp: "Đáp lại lời mời 'Would you like to...?' bằng cách đồng ý: 'I'd love to' (Mình rất sẵn lòng)."
    },
    {
      id: "rev_p_22",
      cat: "lang",
      num: 22,
      q: "Hoa: “Your countryside photos are beautiful!” - Minh: “______”",
      options: ["A. Thanks. I'm glad you like them.", "B. Could you help me?", "C. I'm busy right now."],
      correct: 0,
      exp: "Đáp lại lời khen bằng cảm ơn: 'Thanks. I'm glad you like them'."
    },
    // Reading
    {
      id: "rev_p_23",
      cat: "read",
      num: 23,
      q: "What is the reading passage mainly about?",
      options: ["A. The history of social media.", "B. The benefits and risks of teenagers' online activities.", "C. How to become famous online."],
      correct: 1,
      exp: "Bài đọc nói về lợi ích (benefits) và rủi ro (risks) khi thanh thiếu niên sử dụng Internet."
    },
    {
      id: "rev_p_24",
      cat: "read",
      num: 24,
      q: "The word “They” in the first paragraph refers to ______.",
      options: ["A. teenagers", "B. websites", "C. English lessons"],
      correct: 0,
      exp: "'They' thay thế cho danh từ 'teenagers' được nhắc ở câu trước."
    },
    {
      id: "rev_p_25",
      cat: "read",
      num: 25,
      q: "According to the passage, what can teenagers do online to improve their skills?",
      options: ["A. Stay up late every night.", "B. Compare with others.", "C. Watch English lessons."],
      correct: 2,
      exp: "Đoạn 1 nêu: '...they can watch English lessons or join online groups...'"
    },
    {
      id: "rev_p_26",
      cat: "read",
      num: 26,
      q: "Why can spending too much time online cause problems?",
      options: ["A. It always improves sleep.", "B. It may reduce sleep time and cause stress.", "C. It makes everyone famous."],
      correct: 1,
      exp: "Đoạn 2 nêu: '...so they do not get enough sleep. Others may feel stressed...'"
    },
    {
      id: "rev_p_27",
      cat: "read",
      num: 27,
      q: "Which of the following is NOT mentioned as a safe and healthy online habit?",
      options: ["A. Protecting online accounts.", "B. Thinking carefully before posting.", "C. Sharing passwords with strangers."],
      correct: 2,
      exp: "Chia sẻ mật khẩu cho người lạ là nguy hiểm, bài đọc KHÔNG BAO GIỜ khuyên làm điều này."
    },
    // Cloze
    {
      id: "rev_p_28",
      cat: "cloze",
      num: 28,
      q: "They live near a large (28) ______ where they grow rice.",
      options: ["A. paddy field", "B. forum", "C. account"],
      correct: 0,
      exp: "'paddy field' nghĩa là cánh đồng lúa, nơi trồng lúa ('grow rice')."
    },
    {
      id: "rev_p_29",
      cat: "cloze",
      num: 29,
      q: "Farmers work (29) ______ than machines did in the past.",
      options: ["A. careful", "B. more efficiently", "C. most efficient"],
      correct: 1,
      exp: "Bổ nghĩa cho 'work' trong so sánh hơn với 'than', dùng 'more efficiently'."
    },
    {
      id: "rev_p_30",
      cat: "cloze",
      num: 30,
      q: "My grandmother is very (30) ______ and always prepares delicious food for visitors.",
      options: ["A. hospitable", "B. stressful", "C. addictive"],
      correct: 0,
      exp: "'hospitable' nghĩa là hiếu khách, tiếp đón khách chu đáo."
    },
    {
      id: "rev_p_31",
      cat: "cloze",
      num: 31,
      q: "My cousin invited me (31) ______ fishing by the river.",
      options: ["A. go", "B. going", "C. to go"],
      correct: 2,
      exp: "Cấu trúc invite someone + TO-V (mời ai đi đâu làm gì): to go."
    },
    {
      id: "rev_p_32",
      cat: "cloze",
      num: 32,
      q: "We had a wonderful time together, (32) ______ the weather was quite hot.",
      options: ["A. but", "B. so", "C. or"],
      correct: 0,
      exp: "Liên từ 'but' chỉ sự đối lập: thời gian tuyệt vời, nhưng (but) trời khá nóng."
    },
    // Transform & Reorder
    {
      id: "rev_p_33",
      cat: "trans",
      num: 33,
      q: "Sắp xếp: my sister / enjoys / in her free time / making models",
      options: [
        "A. My sister in her free time enjoys making models.",
        "B. My sister enjoys making models in her free time.",
        "C. Enjoys my sister making models in her free time."
      ],
      correct: 1,
      exp: "Trật tự: S (My sister) + V (enjoys) + O (making models) + Time (in her free time)."
    },
    {
      id: "rev_p_34",
      cat: "trans",
      num: 34,
      q: "Sắp xếp: more carefully / than / drives / my father / I do",
      options: [
        "A. My father drives more carefully than I do.",
        "B. My father more carefully drives than I do.",
        "C. My father drives more careful than I do."
      ],
      correct: 0,
      exp: "Trật tự so sánh hơn: My father drives more carefully than I do."
    },
    {
      id: "rev_p_35",
      cat: "trans",
      num: 35,
      q: "Đồng nghĩa: I enjoy surfing the net in my free time.",
      options: [
        "A. I am interested in surfing the net in my free time.",
        "B. I detest surfing the net in my free time.",
        "C. I dislike surfing the net in my free time."
      ],
      correct: 0,
      exp: "'enjoy + V-ing' đồng nghĩa với 'be interested in + V-ing' (thích làm gì đó)."
    },
    {
      id: "rev_p_36",
      cat: "trans",
      num: 36,
      q: "Đồng nghĩa: Mai doesn’t study as hard as Lan, so she often gets worse marks.",
      options: [
        "A. Lan studies more hardly than Mai, but she often gets better marks.",
        "B. Lan studies harder than Mai, so she often gets better marks.",
        "C. Lan studies harder than Mai, but she often gets worse marks."
      ],
      correct: 1,
      exp: "Mai không học chăm bằng Lan => Lan học chăm hơn Mai (Lan studies harder than Mai), nên thường được điểm cao hơn."
    }
  ];

  const allItems = [...listeningP1, ...listeningP2, ...practiceQuestions];

  // Calculate scores
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = allItems.filter(item => userAnswers[item.id] === item.correct).length;
  const rawRatio = allItems.length > 0 ? (correctCount / allItems.length) : 0;
  const totalScore10 = (rawRatio * 10.0).toFixed(1);

  const handleSelectOption = (qId: string, optIdx: number) => {
    if (userAnswers[qId] !== undefined) return;
    setUserAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  // Word count for writing
  const words = writingText.trim() ? writingText.trim().split(/\s+/).filter(w => w.length > 0) : [];
  const wordCount = words.length;

  // Award merit points when finishing at least 20 questions
  useEffect(() => {
    if (currentStudent && answeredCount >= 15 && !pointsAwarded) {
      studentGradebookService.recordPracticeMerit(
        currentStudent.id, 
        parseFloat(totalScore10), 
        "Đề Cương Ôn Tập GK1 - Tiếng Anh 8"
      );
      setPointsAwarded(true);
    }
  }, [answeredCount, currentStudent, pointsAwarded, totalScore10]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* BANNER HEADER */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider backdrop-blur-md">
              TRƯỜNG THCS ĐỒNG YÊN • NĂM HỌC 2026 - 2027
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider">
              BÁM SÁT 100% ĐỀ KIỂM TRA GIỮA KỲ 1
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight">
            📖 Đề Cương Ôn Tập &amp; Luyện Thi Trực Tuyến — Tiếng Anh 8
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-3xl leading-relaxed">
            Học sinh ôn tập lý thuyết Unit 1, 2, 3, luyện nghe Audio có lời thoại, làm bài tập trắc nghiệm giải thích tức thì và luyện viết đoạn văn gỡ điểm.
          </p>

          {/* Quick Stats Pill */}
          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <div className="px-4 py-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center gap-2 text-sm font-bold">
              <Star className="w-4 h-4 text-amber-300" />
              <span>Tiến độ: <strong>{answeredCount}/{allItems.length} câu</strong></span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center gap-2 text-sm font-bold">
              <Trophy className="w-4 h-4 text-emerald-300" />
              <span>Điểm trắc nghiệm: <strong className="text-amber-300 text-base">{totalScore10}</strong> / 10.0</span>
            </div>
            {currentStudent && (
              <div className="px-4 py-2 rounded-xl bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Cộng +10 điểm chuyên cần khi hoàn thành bài tập!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('theory')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'theory'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-black'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Lý Thuyết Trọng Tâm</span>
        </button>

        <button
          onClick={() => setActiveTab('listening')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'listening'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-black'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>2. Luyện Nghe Audio (Part 1 &amp; 2)</span>
        </button>

        <button
          onClick={() => setActiveTab('practice')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'practice'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-black'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>3. Bài Tập Trắc Nghiệm ({practiceQuestions.length} câu)</span>
        </button>

        <button
          onClick={() => setActiveTab('writing')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'writing'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-black'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>4. Luyện Viết Đoạn Văn (80-100 từ)</span>
        </button>

        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'results'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>5. Bảng Điểm &amp; Đánh Giá</span>
        </button>
      </div>

      {/* ==================== TAB 1: LÝ THUYẾT ==================== */}
      {activeTab === 'theory' && (
        <div className="space-y-6">
          {/* Unit 1 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-black text-xs">UNIT 1</span>
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase">LEISURE TIME (Thời Gian Rảnh Rỗi)</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-blue-600">origami</span> <span className="text-xs text-slate-400">/ˌɒrɪˈɡɑːmi/ (n)</span>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Nghệ thuật gấp giấy Nhật Bản</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-blue-600">craft kit</span> <span className="text-xs text-slate-400">/ˈkrɑːft kɪt/ (n)</span>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Bộ dụng cụ thủ công</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-blue-600">surf the net</span> <span className="text-xs text-slate-400">(vp)</span>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Lướt mạng Internet</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-blue-600">addictive</span> <span className="text-xs text-slate-400">/əˈdɪktɪv/ (adj)</span>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Gây nghiện, dễ đam mê khó dứt</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs sm:text-sm space-y-1.5">
              <strong className="text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" /> Ngữ pháp vàng: Động từ chỉ sở thích + V-ing
              </strong>
              <p className="text-slate-700 dark:text-slate-300">
                • <code>S + like / love / enjoy / fancy / detest / prefer + V-ing</code><br />
                • <code>S + be fond of / keen on / interested in + V-ing</code><br />
                • <strong>Cấu trúc so sánh thích hơn:</strong> <code>S + prefer + V-ing (1) + TO + V-ing (2)</code> (Ex: <em>I prefer <u>making</u> models <u>to</u> playing games</em>).
              </p>
            </div>
          </div>

          {/* Unit 2: Comparative Adverbs */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-amber-300 dark:border-amber-500 shadow-md space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-amber-100 dark:border-amber-900/40">
              <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-black text-xs">UNIT 2 • TRỌNG TÂM NHẤT</span>
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase">SO SÁNH HƠN CỦA TRẠNG TỪ (COMPARATIVE ADVERBS)</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3 font-bold">Loại trạng từ</th>
                    <th className="p-3 font-bold">Công thức</th>
                    <th className="p-3 font-bold">Ví dụ trong đề thi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="p-3 font-bold text-slate-800 dark:text-white">Trạng từ ngắn (1 âm tiết: fast, hard, early, late)</td>
                    <td className="p-3"><code className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-blue-600 font-bold">adv + -er + than</code></td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">
                      • fast &rarr; <strong>faster than</strong> (My brother runs <em>faster than</em> I can)<br />
                      • hard &rarr; <strong>harder than</strong> (Lan studies <em>harder than</em> Mai)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-800 dark:text-white">Trạng từ dài (đuôi -ly: carefully, efficiently, fluently)</td>
                    <td className="p-3"><code className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-emerald-600 font-bold">more + adv + than</code></td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">
                      • carefully &rarr; <strong>more carefully than</strong> (My father drives <em>more carefully than</em> I do)<br />
                      • efficiently &rarr; <strong>more efficiently than</strong> (Farmers work <em>more efficiently</em>)
                    </td>
                  </tr>
                  <tr className="bg-amber-50/50 dark:bg-amber-950/20 font-bold">
                    <td className="p-3 text-amber-700 dark:text-amber-300">Bất quy tắc (CẤM NHẦM LẪN)</td>
                    <td className="p-3 text-rose-600">KHÔNG CÓ "MORE WELL"</td>
                    <td className="p-3 text-slate-800 dark:text-white">
                      ★ <strong>well &rarr; BETTER THAN</strong> (speaks English <em>better than</em> last year)<br />
                      ★ <strong>badly &rarr; WORSE THAN</strong> (gets <em>worse marks</em>)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Unit 3 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-black text-xs">UNIT 3</span>
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase">TEENAGERS &amp; CÂU GHÉP (COMPOUND SENTENCES)</h3>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-xs sm:text-sm space-y-1.5">
              <p className="text-slate-700 dark:text-slate-300">
                • <strong>, so</strong> (vì vậy &rarr; kết quả): <em>I was tired, <u>so</u> I went to bed early.</em><br />
                • <strong>, but</strong> (nhưng &rarr; đối lập): <em>We had a wonderful time, <u>but</u> the weather was hot.</em><br />
                • <strong>, or</strong> (hoặc là &rarr; lựa chọn): <em>Hurry up, <u>or</u> you will be late.</em><br />
                • <strong>Chuyển đổi câu so sánh:</strong> <em>Mai doesn't study as hard as Lan &hArr; Lan studies harder than Mai.</em>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: LUYỆN NGHE AUDIO ==================== */}
      {activeTab === 'listening' && (
        <div className="space-y-6">
          {/* Part 1 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-black text-xs">Part 1 • 1.25 Điểm</span>
                <h3 className="text-lg font-black text-slate-800 dark:text-white mt-1">Teenagers and Stress (Nghe chọn True / False)</h3>
              </div>
              <button
                onClick={() => setShowTapescript1(!showTapescript1)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
              >
                {showTapescript1 ? 'Ẩn Lời Thoại' : '👁 Xem Lời Thoại (Tapescript)'}
              </button>
            </div>

            <audio controls className="w-full h-11 rounded-xl outline-none" preload="metadata">
              <source src={audioPart1Url} type="audio/mpeg" />
            </audio>

            {showTapescript1 && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 border-l-4 border-blue-500">
                <strong>Lời thoại Part 1:</strong><br />
                "Teenagers today often feel stressed because of schoolwork, exams and their busy schedules. To deal with stress, they should organise their time and take short breaks between study sessions. They can also enjoy hobbies, play sports or listen to music to relax. Teenagers should not spend all their free time studying because they need time to rest and have fun. When they have problems, talking to parents, teachers or trusted friends can help them feel better. Getting enough sleep, staying active and spending quality time with family are also important for a balanced and healthy life."
              </div>
            )}

            <div className="space-y-3 pt-2">
              {listeningP1.map(item => {
                const isAnswered = userAnswers[item.id] !== undefined;
                const isCorrect = userAnswers[item.id] === item.correct;
                return (
                  <div key={item.id} className={`p-4 rounded-2xl border transition ${
                    isAnswered 
                      ? (isCorrect ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300' : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-300')
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                  }`}>
                    <p className="font-bold text-sm text-slate-800 dark:text-white mb-2">
                      <span className="inline-block px-2 py-0.5 rounded bg-blue-600 text-white text-xs mr-2 font-mono">Câu {item.num}</span>
                      {item.q}
                    </p>
                    <div className="flex gap-2">
                      {item.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          disabled={isAnswered}
                          onClick={() => handleSelectOption(item.id, oIdx)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                            isAnswered
                              ? (oIdx === item.correct 
                                  ? 'bg-emerald-600 text-white font-black' 
                                  : (userAnswers[item.id] === oIdx ? 'bg-rose-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'))
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-500'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {isAnswered && (
                      <p className="text-xs mt-2 text-slate-600 dark:text-slate-300 italic pt-1 border-t border-slate-200/60">
                        {isCorrect ? '✅ ' : '❌ '} {item.exp}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Part 2 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs">Part 2 • 1.25 Điểm</span>
                <h3 className="text-lg font-black text-slate-800 dark:text-white mt-1">Life in the Countryside (Nghe chọn A, B, C)</h3>
              </div>
              <button
                onClick={() => setShowTapescript2(!showTapescript2)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
              >
                {showTapescript2 ? 'Ẩn Lời Thoại' : '👁 Xem Lời Thoại (Tapescript)'}
              </button>
            </div>

            <audio controls className="w-full h-11 rounded-xl outline-none" preload="metadata">
              <source src={audioPart2Url} type="audio/mpeg" />
            </audio>

            {showTapescript2 && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 border-l-4 border-emerald-500">
                <strong>Lời thoại Part 2:</strong><br />
                "I live in a small village in the countryside. Life here is peaceful, and the people are friendly. My family grows rice and vegetables on our farm. During the harvest season, my father uses a combine harvester to collect the rice. He always drives it more carefully than some other farmers because safety is important. In the afternoon, I often help my parents in the garden or ride my bike along the village roads. I especially love the peaceful scenery, the green fields and the fresh air. Although life in the countryside is sometimes quiet, I really enjoy living here because I can spend time with my family and experience nature every day."
              </div>
            )}

            <div className="space-y-3 pt-2">
              {listeningP2.map(item => {
                const isAnswered = userAnswers[item.id] !== undefined;
                const isCorrect = userAnswers[item.id] === item.correct;
                return (
                  <div key={item.id} className={`p-4 rounded-2xl border transition ${
                    isAnswered 
                      ? (isCorrect ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300' : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-300')
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                  }`}>
                    <p className="font-bold text-sm text-slate-800 dark:text-white mb-2">
                      <span className="inline-block px-2 py-0.5 rounded bg-emerald-600 text-white text-xs mr-2 font-mono">Câu {item.num}</span>
                      {item.q}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {item.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          disabled={isAnswered}
                          onClick={() => handleSelectOption(item.id, oIdx)}
                          className={`p-2.5 rounded-xl text-xs font-bold text-left transition cursor-pointer ${
                            isAnswered
                              ? (oIdx === item.correct 
                                  ? 'bg-emerald-600 text-white font-black' 
                                  : (userAnswers[item.id] === oIdx ? 'bg-rose-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'))
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {isAnswered && (
                      <p className="text-xs mt-2 text-slate-600 dark:text-slate-300 italic pt-1 border-t border-slate-200/60">
                        {isCorrect ? '✅ ' : '❌ '} {item.exp}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: BÀI TẬP TRẮC NGHIỆM ĐỀ CƯƠNG ==================== */}
      {activeTab === 'practice' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400">Lọc phần thi:</span>
            <button
              onClick={() => setPracticeFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                practiceFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}
            >
              Tất cả ({practiceQuestions.length})
            </button>
            <button
              onClick={() => setPracticeFilter('lang')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                practiceFilter === 'lang' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}
            >
              Language Focus
            </button>
            <button
              onClick={() => setPracticeFilter('read')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                practiceFilter === 'read' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}
            >
              Reading
            </button>
            <button
              onClick={() => setPracticeFilter('cloze')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                practiceFilter === 'cloze' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}
            >
              Cloze Test
            </button>
            <button
              onClick={() => setPracticeFilter('trans')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                practiceFilter === 'trans' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
              }`}
            >
              Sắp xếp &amp; Viết lại
            </button>
          </div>

          {/* Reading Material if active */}
          {(practiceFilter === 'all' || practiceFilter === 'read') && (
            <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm space-y-2 leading-relaxed">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white text-xs font-bold">Bài Đọc Hiểu (Teenagers &amp; Online Activities)</span>
              <p>Many teenagers enjoy spending their free time online. <mark className="bg-amber-200 px-1 rounded font-bold">They</mark> can watch videos, browse websites, upload pictures and communicate with friends through social media. Online activities are entertaining and can also help teenagers learn new skills. For example, they can <strong>watch English lessons</strong> or join online groups to share ideas about their hobbies.</p>
              <p>However, spending too much time online may cause problems. Some teenagers stay up late using their phones, so they do not get enough sleep. Others may feel stressed when they compare themselves with people on social media. In addition, sharing personal information with strangers can be dangerous.</p>
              <p>To enjoy the benefits of the Internet, teenagers should manage their screen time carefully. They should also protect their accounts, think before posting anything and spend time doing outdoor activities.</p>
            </div>
          )}

          {/* Questions */}
          <div className="space-y-3">
            {practiceQuestions
              .filter(item => practiceFilter === 'all' || item.cat === practiceFilter)
              .map(item => {
                const isAnswered = userAnswers[item.id] !== undefined;
                const isCorrect = userAnswers[item.id] === item.correct;
                return (
                  <div key={item.id} className={`p-4 rounded-2xl border transition ${
                    isAnswered 
                      ? (isCorrect ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300' : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-300')
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}>
                    <p className="font-bold text-sm text-slate-800 dark:text-white mb-2">
                      <span className="inline-block px-2 py-0.5 rounded bg-blue-600 text-white text-xs mr-2 font-mono">Câu {item.num}</span>
                      {item.q}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {item.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          disabled={isAnswered}
                          onClick={() => handleSelectOption(item.id, oIdx)}
                          className={`p-2.5 rounded-xl text-xs font-bold text-left transition cursor-pointer ${
                            isAnswered
                              ? (oIdx === item.correct 
                                  ? 'bg-emerald-600 text-white font-black' 
                                  : (userAnswers[item.id] === oIdx ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'))
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-500'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {isAnswered && (
                      <p className="text-xs mt-2 text-slate-600 dark:text-slate-300 italic pt-1 border-t border-slate-200/60">
                        {isCorrect ? '✅ ' : '❌ '} {item.exp}
                      </p>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ==================== TAB 4: LUYỆN VIẾT ĐOẠN VĂN ==================== */}
      {activeTab === 'writing' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-black text-xs">Part 8 • 1.0 Điểm</span>
            <h3 className="text-lg font-black text-slate-800 dark:text-white">
              Write a short paragraph (80–100 words) about one of your family members' leisure time.
            </h3>
            <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
              <li>• <strong>Câu 1:</strong> Giới thiệu người thân và sở thích (bố/mẹ thích làm vườn/nấu ăn).</li>
              <li>• <strong>Câu 2:</strong> Bắt đầu từ khi nào và làm cùng ai?</li>
              <li>• <strong>Câu 3:</strong> Hoạt động cụ thể và lợi ích (giảm căng thẳng, tăng gắn kết).</li>
              <li>• <strong>Câu 4:</strong> Sử dụng so sánh hơn: <em>He works more carefully than anyone...</em></li>
              <li>• <strong>Câu 5:</strong> Cảm xúc của em về người thân.</li>
            </ul>

            <button
              onClick={() => setShowSampleWriting(!showSampleWriting)}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <span>{showSampleWriting ? 'Ẩn Bài Mẫu' : '⭐ Xem Bài Mẫu Chuẩn Điểm 10'}</span>
            </button>

            {showSampleWriting && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 text-xs sm:text-sm text-slate-800 dark:text-slate-200 italic leading-relaxed">
                "In my family, my father has a very interesting way of spending his leisure time. He is extremely fond of gardening and doing DIY woodwork. He started these hobbies about five years ago when we moved to our village house. At weekends, he usually spends several hours tending to fruit trees and making small wooden tables for our home. I often help him water the flowers and clean up the garden tools. Working in the garden helps my father relieve work stress and stay active. He always does everything more carefully and patiently than anyone else. I really admire his creativity because he makes our home greener and warmer every day." (107 words)
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Khung Soạn Thảo Đoạn Văn</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                  wordCount >= 80 && wordCount <= 110 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {wordCount} / 80-100 từ
                </span>
              </div>
              <textarea
                value={writingText}
                onChange={(e) => setWritingText(e.target.value)}
                placeholder="Bắt đầu viết đoạn văn của em tại đây (80-100 từ)...\nVí dụ: In my family, my father has an interesting hobby in his free time. He is fond of..."
                className="w-full h-64 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 leading-relaxed resize-none"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{wordCount >= 80 && wordCount <= 110 ? '✅ Độ dài đạt chuẩn!' : '⚠️ Hãy viết đủ 80-100 từ.'}</span>
              <button 
                onClick={() => alert(`Đoạn văn của em gồm ${wordCount} từ. Hãy kiểm tra các liên từ nối (so, but, because) và so sánh hơn trạng từ nhé!`)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold cursor-pointer hover:bg-blue-700"
              >
                Kiểm Tra Nhanh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 5: BẢNG ĐIỂM & ĐÁNH GIÁ ==================== */}
      {activeTab === 'results' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-6">
          <div className="max-w-md mx-auto space-y-2">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black text-3xl shadow-lg">
              {totalScore10}
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white">
              {parseFloat(totalScore10) >= 8.5 ? '🏆 Xuất Sắc - Đạt Điểm Giỏi!' : (parseFloat(totalScore10) >= 6.5 ? '🌟 Rất Tốt - Đạt Mức Khá!' : '💪 Đạt Yêu Cầu - Cố Gắng Thêm Nhé!')}
            </h3>
            <p className="text-sm text-slate-500">
              Em đã hoàn thành <strong>{answeredCount}/{allItems.length} câu</strong> với <strong>{correctCount} câu trả lời chính xác</strong>.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => {
                if (confirm('Em có muốn làm lại bài tập đề cương để nâng cao điểm số không?')) {
                  setUserAnswers({});
                  setActiveTab('listening');
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm cursor-pointer"
            >
              🔄 Làm Lại Toàn Bộ
            </button>
            {onGoToExams && (
              <button
                onClick={onGoToExams}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs sm:text-sm shadow-md hover:scale-105 transition cursor-pointer"
              >
                🚀 Làm Bài Thi Chính Thức (Mã 801, 802, 803) &rarr;
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
