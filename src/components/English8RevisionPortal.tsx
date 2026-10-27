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
  const [lastMeritBonus, setLastMeritBonus] = useState<number>(0);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong' | 'correct'>('all');
  const [writingAwarded, setWritingAwarded] = useState<boolean>(false);

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
  const wrongCount = allItems.filter(item => userAnswers[item.id] !== undefined && userAnswers[item.id] !== item.correct).length;
  const unansweredCount = allItems.length - answeredCount;
  const rawRatio = allItems.length > 0 ? (correctCount / allItems.length) : 0;
  const totalScore10 = (rawRatio * 10.0).toFixed(1);

  // Số lượng câu đã làm từng phần
  const listeningAnswered = listeningP1.filter(i => userAnswers[i.id] !== undefined).length + 
                            listeningP2.filter(i => userAnswers[i.id] !== undefined).length;
  const practiceAnswered = practiceQuestions.filter(i => userAnswers[i.id] !== undefined).length;

  // Xử lý chọn đáp án (khi chưa nộp bài có thể chọn lại thoải mái)
  const handleSelectOption = (qId: string, optIdx: number) => {
    if (isSubmitted) return; // Đã nộp bài thì khóa, xem chấm chữa
    setUserAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  // Word count for writing
  const words = writingText.trim() ? writingText.trim().split(/\s+/).filter(w => w.length > 0) : [];
  const wordCount = words.length;

  // NỘP BÀI & CHẤM CHỮA
  const handleSubmitExam = () => {
    if (answeredCount === 0) {
      alert('⚠️ Em chưa làm câu hỏi nào! Hãy chọn đáp án ở phần Luyện Nghe hoặc Trắc Nghiệm trước khi nộp bài nhé.');
      return;
    }

    if (answeredCount < allItems.length) {
      const confirmSubmit = window.confirm(
        `⚠️ Em mới hoàn thành ${answeredCount}/${allItems.length} câu hỏi.\n` +
        `Em có chắc chắn muốn nộp bài ngay để chấm điểm và xem lời giải chi tiết không?`
      );
      if (!confirmSubmit) return;
    }

    setIsSubmitted(true);
    setActiveTab('results');

    // Tính điểm chuyên cần cộng thêm mỗi lần làm bài:
    // +10 điểm chuyên cần mỗi lần hoàn thành đề cương
    // Thưởng điểm cao: >= 8.0: +5 điểm
    const scoreNum = parseFloat(totalScore10);
    let meritBonus = 10;
    if (scoreNum >= 8.0) meritBonus += 5;
    setLastMeritBonus(meritBonus);

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
          studentName: currentStudent.name,
          className: currentStudent.className,
          grade: 8,
          subject: 'Tiếng Anh',
          testTitle: `Đề Cương Ôn Tập GK1 (Lần ${attemptCount})`,
          testType: 'regular_test',
          score: scoreNum,
          maxScore: 10,
          completionTimeSeconds: 600,
          correctCount: correctCount,
          totalQuestions: allItems.length
        });

        studentGradebookService.recordPracticeMerit(
          currentStudent.id,
          `Đề Cương Ôn Tập GK1 - Lần ${attemptCount} (${scoreNum}đ)`,
          meritBonus
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

  // LÀM LẠI LẦN 2, 3, 4...
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
    if (wordCount < 80) {
      alert(`⚠️ Đoạn văn của em hiện có ${wordCount} từ (chưa đủ 80-100 từ theo yêu cầu đề cương). Hãy viết thêm một vài câu chi tiết về người thân nhé!`);
      return;
    }

    if (currentStudent && !writingAwarded) {
      studentGradebookService.recordPracticeMerit(
        currentStudent.id,
        `Bài Viết Đoạn Văn Đề Cương GK1 (${wordCount} từ)`,
        10
      );
      setWritingAwarded(true);
    }

    alert(
      `🎉 XUẤT SẮC! Đoạn văn của em đạt ${wordCount} từ (đạt chuẩn độ dài 80-100 từ).\n` +
      `⭐ Em được CỘNG +10 ĐIỂM CHUYÊN CẦN cho phần luyện viết!\n` +
      `Hãy đối chiếu với bài mẫu chuẩn điểm 10 bên cạnh để hoàn thiện cấu trúc câu nhé!`
    );
  };

  // Lọc câu hỏi trong phần Chấm Chữa Chi Tiết
  const reviewQuestions = allItems.filter(item => {
    if (reviewFilter === 'wrong') {
      return userAnswers[item.id] !== item.correct;
    }
    if (reviewFilter === 'correct') {
      return userAnswers[item.id] === item.correct;
    }
    return true;
  });

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
            <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider">
              LẦN LÀM BÀI: LẦN {attemptCount}
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight">
            📖 Đề Cương Ôn Tập &amp; Luyện Thi Trực Tuyến — Tiếng Anh 8
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-3xl leading-relaxed">
            Học sinh ôn tập lý thuyết Unit 1, 2, 3, luyện nghe Audio có lời thoại, làm bài tập trắc nghiệm có nộp bài &amp; chấm chữa đầy đủ. Có thể làm lại nhiều lần để gỡ điểm và tích lũy điểm chuyên cần.
          </p>

          {/* Quick Stats Pill */}
          <div className="pt-2 flex items-center gap-3 flex-wrap">
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

      {/* NAVIGATION TABS - HIỂN THỊ NGẮN GỌN XEM ĐƯỢC HẾT 100% KHÔNG BỊ TRÀN HAY CHE KHUẤT */}
      <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-2">
          {/* Tab 1: Lý Thuyết */}
          <button
            type="button"
            onClick={() => setActiveTab('theory')}
            className={`px-2 sm:px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'theory'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-black'
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
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-black'
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
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-black'
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
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-black'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Luyện Viết Đoạn Văn 80-100 từ"
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
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-black text-xs">UNIT 1</span>
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase">LEISURE TIME (Thời Gian Rảnh Rỗi)</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2">
                <h4 className="font-black text-blue-600 dark:text-blue-400">1. Từ vựng trọng tâm</h4>
                <p>• <strong>origami</strong> (n): nghệ thuật gấp giấy Nhật Bản</p>
                <p>• <strong>DIY</strong> (do-it-yourself): đồ tự làm thủ công</p>
                <p>• <strong>snowboarding</strong> (n): trượt tuyết bằng ván</p>
                <p>• <strong>knitting</strong> (n): đan len, đan áo</p>
                <p>• <strong>surfing the net</strong>: lướt mạng Internet</p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 space-y-2">
                <h4 className="font-black text-blue-600 dark:text-blue-400">2. Động từ chỉ sự yêu thích (Verbs of liking/disliking)</h4>
                <p>• <strong>enjoy, love, like, adore, fancy + V-ing</strong> (thích làm gì)</p>
                <p>• <strong>detest, hate, dislike + V-ing</strong> (ghét, không thích làm gì)</p>
                <p>• <strong>be fond of / be keen on / be into + V-ing</strong>: say mê, rất thích</p>
                <p className="text-blue-700 dark:text-blue-300 italic">Ví dụ: I <strong>enjoy making</strong> origami in my free time.</p>
              </div>
            </div>
          </div>

          {/* Unit 2 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-black text-xs">UNIT 2</span>
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase">LIFE IN THE COUNTRYSIDE (Cuộc Sống Ở Nông Thôn)</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2">
                <h4 className="font-black text-emerald-600 dark:text-emerald-400">1. Từ vựng làng quê</h4>
                <p>• <strong>harvest time</strong> (n): vụ mùa gặt hái</p>
                <p>• <strong>combine harvester</strong> (n): máy gặt đập liên hợp</p>
                <p>• <strong>peaceful / tranquil</strong> (adj): yên bình, thanh bình</p>
                <p>• <strong>vast / picturesque</strong> (adj): rộng lớn / đẹp như tranh</p>
                <p>• <strong>cattle / herd</strong>: gia súc / chăn dắt đàn gia súc</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 space-y-2">
                <h4 className="font-black text-emerald-600 dark:text-emerald-400">2. So sánh hơn của trạng từ (Comparative Adverbs)</h4>
                <p>• Trạng từ ngắn (fast, hard, early, late): <strong>adv + -er + than</strong></p>
                <p className="italic pl-2">Ví dụ: faster than, harder than, earlier than</p>
                <p>• Trạng từ dài (carefully, slowly, peacefully): <strong>more + adv + than</strong></p>
                <p className="italic pl-2">Ví dụ: more carefully than, more slowly than</p>
                <p>• Bất quy tắc: <strong>well &rarr; better</strong>, <strong>badly &rarr; worse</strong></p>
              </div>
            </div>
          </div>

          {/* Unit 3 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-black text-xs">UNIT 3</span>
              <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase">TEENAGERS (Thanh Thiếu Niên)</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2">
                <h4 className="font-black text-purple-600 dark:text-purple-400">1. Đời sống học đường &amp; Mạng xã hội</h4>
                <p>• <strong>peer pressure</strong> (n): áp lực bạn bè cùng trang lứa</p>
                <p>• <strong>browse websites / check notifications</strong>: lướt web / kiểm tra thông báo</p>
                <p>• <strong>upload pictures / connect with friends</strong>: đăng ảnh / kết nối bạn bè</p>
                <p>• <strong>school club / coach</strong>: câu lạc bộ trường học / huấn luyện viên</p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 space-y-2">
                <h4 className="font-black text-purple-600 dark:text-purple-400">2. Câu ghép &amp; Liên từ (Compound Sentences)</h4>
                <p>• <strong>and</strong>: và (thêm thông tin tương đồng)</p>
                <p>• <strong>but</strong>: nhưng (chỉ sự đối lập, tương phản)</p>
                <p>• <strong>so / therefore</strong>: vì vậy, do đó (kết quả)</p>
                <p>• <strong>however</strong>: tuy nhiên (chỉ sự nhượng bộ, đứng sau dấu chấm phẩy ; hoặc dấu chấm .)</p>
                <p className="italic text-purple-700 dark:text-purple-300">Ví dụ: She worked hard; however, she did not pass.</p>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setActiveTab('listening')}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm shadow-md transition flex items-center gap-2 mx-auto cursor-pointer"
            >
              <span>Tiếp Tục Sang Phần 2: Luyện Nghe Audio &rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: LUYỆN NGHE AUDIO ==================== */}
      {activeTab === 'listening' && (
        <div className="space-y-6">
          {/* THANH ĐIỀU HƯỚNG & NỘP BÀI NHANH */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:bg-slate-800/90 p-4 rounded-2xl border border-blue-200 dark:border-blue-900 flex items-center justify-between gap-3 flex-wrap shadow-xs">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-xl bg-blue-600 text-white text-xs font-black">
                Lần {attemptCount}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                Tiến độ: <strong className="text-blue-600 dark:text-blue-400">{answeredCount}/{allItems.length} câu</strong>
                {isSubmitted && (
                  <span className="ml-2 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
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
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Nộp Bài &amp; Chấm Chữa</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveTab('results')}
                    className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Xem Điểm ({totalScore10}đ)</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRetakeExam}
                    className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>Làm Lại Lần {attemptCount + 1}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Part 1 */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-black text-xs">Part 1 • 1.25 Điểm</span>
                <h3 className="text-lg font-black text-slate-800 dark:text-white mt-1">Teenagers and Stress (Nghe chọn True / False)</h3>
              </div>
              <button
                onClick={() => setShowTapescript1(!showTapescript1)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer"
              >
                {showTapescript1 ? 'Ẩn Lời Thoại' : '👁 Xem Lời Thoại (Tapescript)'}
              </button>
            </div>

            <audio controls className="w-full h-11 rounded-xl outline-none" preload="metadata">
              <source src={audioPart1Url} type="audio/mpeg" />
              Trình duyệt không hỗ trợ phát Audio.
            </audio>

            {showTapescript1 && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 border-l-4 border-blue-500 space-y-1">
                <strong>Lời thoại Part 1:</strong><br />
                "Teenagers today often feel stressed because of schoolwork, exams and their busy schedules. Many students try to finish too much homework late at night, which makes them feel tired during the day. To reduce stress, doctors suggest that they should organise their time and take short breaks between study sessions. Teenagers should not spend all their free time studying because they need time to rest, do exercise or enjoy their hobbies. When they have problems, talking to parents, teachers or trusted friends can help them feel better. A balanced lifestyle is the most effective way for teenagers to stay healthy and happy."
              </div>
            )}

            <div className="space-y-3 pt-2">
              {listeningP1.map(item => {
                const userChoice = userAnswers[item.id];
                const isAnswered = userChoice !== undefined;
                const isCorrect = userChoice === item.correct;
                return (
                  <div key={item.id} className={`p-4 rounded-2xl border transition ${
                    isSubmitted
                      ? (isCorrect 
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-400' 
                          : 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-400')
                      : (isAnswered 
                          ? 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-300' 
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800')
                  }`}>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <p className="font-bold text-sm text-slate-800 dark:text-white">
                        <span className="inline-block px-2 py-0.5 rounded bg-blue-600 text-white text-xs mr-2 font-mono">Câu {item.num}</span>
                        {item.q}
                      </p>
                      {isSubmitted && (
                        <span className={`px-2 py-0.5 rounded-md text-xs font-black shrink-0 ${
                          isCorrect ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200' : 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200'
                        }`}>
                          {isCorrect ? '✅ Đúng' : '❌ Sai'}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {item.options.map((opt, oIdx) => {
                        const isSelected = userChoice === oIdx;
                        let btnStyle = 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-500';
                        if (isSubmitted) {
                          if (oIdx === item.correct) {
                            btnStyle = 'bg-emerald-600 text-white font-black shadow-xs ring-2 ring-emerald-400';
                          } else if (isSelected && !isCorrect) {
                            btnStyle = 'bg-rose-600 text-white font-bold line-through';
                          } else {
                            btnStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 opacity-60';
                          }
                        } else {
                          if (isSelected) {
                            btnStyle = 'bg-blue-600 text-white font-black shadow-sm ring-2 ring-blue-400';
                          }
                        }
                        return (
                          <button
                            key={oIdx}
                            disabled={isSubmitted}
                            onClick={() => handleSelectOption(item.id, oIdx)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {!isSubmitted && isSelected && <span>✓</span>}
                          </button>
                        );
                      })}
                    </div>
                    {isSubmitted && (
                      <div className="mt-3 p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        <strong className="text-blue-600 dark:text-blue-400">💡 Chấm chữa của Thầy: </strong>
                        <span>{item.exp}</span>
                      </div>
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
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition cursor-pointer"
              >
                {showTapescript2 ? 'Ẩn Lời Thoại' : '👁 Xem Lời Thoại (Tapescript)'}
              </button>
            </div>

            <audio controls className="w-full h-11 rounded-xl outline-none" preload="metadata">
              <source src={audioPart2Url} type="audio/mpeg" />
              Trình duyệt không hỗ trợ phát Audio.
            </audio>

            {showTapescript2 && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 border-l-4 border-emerald-500">
                <strong>Lời thoại Part 2:</strong><br />
                "I live in a small village in the countryside. Life here is peaceful, and the people are friendly. My family grows rice and vegetables on our farm. During the harvest season, my father uses a combine harvester to collect the rice. He always drives it more carefully than some other farmers because safety is important. In the afternoon, I often help my parents in the garden or ride my bike along the village roads. I especially love the peaceful scenery, the green fields and the fresh air. Although life in the countryside is sometimes quiet, I really enjoy living here because I can spend time with my family and experience nature every day."
              </div>
            )}

            <div className="space-y-3 pt-2">
              {listeningP2.map(item => {
                const userChoice = userAnswers[item.id];
                const isAnswered = userChoice !== undefined;
                const isCorrect = userChoice === item.correct;
                return (
                  <div key={item.id} className={`p-4 rounded-2xl border transition ${
                    isSubmitted
                      ? (isCorrect 
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-400' 
                          : 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-400')
                      : (isAnswered 
                          ? 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-300' 
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800')
                  }`}>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <p className="font-bold text-sm text-slate-800 dark:text-white">
                        <span className="inline-block px-2 py-0.5 rounded bg-emerald-600 text-white text-xs mr-2 font-mono">Câu {item.num}</span>
                        {item.q}
                      </p>
                      {isSubmitted && (
                        <span className={`px-2 py-0.5 rounded-md text-xs font-black shrink-0 ${
                          isCorrect ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200' : 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200'
                        }`}>
                          {isCorrect ? '✅ Đúng' : '❌ Sai'}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {item.options.map((opt, oIdx) => {
                        const isSelected = userChoice === oIdx;
                        let btnStyle = 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-500';
                        if (isSubmitted) {
                          if (oIdx === item.correct) {
                            btnStyle = 'bg-emerald-600 text-white font-black shadow-xs ring-2 ring-emerald-400';
                          } else if (isSelected && !isCorrect) {
                            btnStyle = 'bg-rose-600 text-white font-bold line-through';
                          } else {
                            btnStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 opacity-60';
                          }
                        } else {
                          if (isSelected) {
                            btnStyle = 'bg-blue-600 text-white font-black shadow-sm ring-2 ring-blue-400';
                          }
                        }
                        return (
                          <button
                            key={oIdx}
                            disabled={isSubmitted}
                            onClick={() => handleSelectOption(item.id, oIdx)}
                            className={`p-2.5 rounded-xl text-xs font-bold text-left transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {!isSubmitted && isSelected && <span>✓</span>}
                          </button>
                        );
                      })}
                    </div>
                    {isSubmitted && (
                      <div className="mt-3 p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        <strong className="text-emerald-600 dark:text-emerald-400">💡 Chấm chữa của Thầy: </strong>
                        <span>{item.exp}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* NÚT NỘP BÀI DƯỚI ĐÁY */}
          <div className="pt-2 text-center space-y-2">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmitExam}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-600/30 transition transform hover:-translate-y-0.5 cursor-pointer inline-flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>NỘP BÀI &amp; CHẤM CHỮA (LẦN {attemptCount})</span>
              </button>
            ) : (
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveTab('results')}
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <Trophy className="w-5 h-5" />
                  <span>XEM BẢNG ĐIỂM &amp; CHẤM CHỮA CHI TIẾT</span>
                </button>
                <button
                  type="button"
                  onClick={handleRetakeExam}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <RotateCw className="w-5 h-5" />
                  <span>LÀM LẠI LẦN {attemptCount + 1} (+10Đ CHUYÊN CẦN)</span>
                </button>
              </div>
            )}
            <p className="text-xs text-slate-500">
              Có thể chuyển sang Tab 3 để làm tiếp các câu trắc nghiệm trước khi nộp bài!
            </p>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: BÀI TẬP TRẮC NGHIỆM ĐỀ CƯƠNG ==================== */}
      {activeTab === 'practice' && (
        <div className="space-y-6">
          {/* THANH ĐIỀU HƯỚNG & NỘP BÀI NHANH */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:bg-slate-800/90 p-4 rounded-2xl border border-blue-200 dark:border-blue-900 flex items-center justify-between gap-3 flex-wrap shadow-xs">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-xl bg-blue-600 text-white text-xs font-black">
                Lần {attemptCount}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                Tiến độ: <strong className="text-blue-600 dark:text-blue-400">{answeredCount}/{allItems.length} câu</strong>
                {isSubmitted && (
                  <span className="ml-2 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
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
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Nộp Bài &amp; Chấm Chữa</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveTab('results')}
                    className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>Xem Điểm ({totalScore10}đ)</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRetakeExam}
                    className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>Làm Lại Lần {attemptCount + 1}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-400">Lọc phần thi:</span>
            <button
              onClick={() => setPracticeFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                practiceFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Tất cả ({practiceQuestions.length})
            </button>
            <button
              onClick={() => setPracticeFilter('lang')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                practiceFilter === 'lang' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Language Focus (12 câu)
            </button>
            <button
              onClick={() => setPracticeFilter('read')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                practiceFilter === 'read' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Reading (4 câu)
            </button>
            <button
              onClick={() => setPracticeFilter('cloze')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                practiceFilter === 'cloze' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Cloze Test (4 câu)
            </button>
            <button
              onClick={() => setPracticeFilter('trans')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                practiceFilter === 'trans' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Sắp xếp &amp; Viết lại (6 câu)
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
                const userChoice = userAnswers[item.id];
                const isAnswered = userChoice !== undefined;
                const isCorrect = userChoice === item.correct;
                return (
                  <div key={item.id} className={`p-4 rounded-2xl border transition ${
                    isSubmitted
                      ? (isCorrect 
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-400' 
                          : 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-400')
                      : (isAnswered 
                          ? 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-300' 
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800')
                  }`}>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <p className="font-bold text-sm text-slate-800 dark:text-white">
                        <span className="inline-block px-2 py-0.5 rounded bg-blue-600 text-white text-xs mr-2 font-mono">Câu {item.num}</span>
                        {item.q}
                      </p>
                      {isSubmitted && (
                        <span className={`px-2 py-0.5 rounded-md text-xs font-black shrink-0 ${
                          isCorrect ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200' : 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200'
                        }`}>
                          {isCorrect ? '✅ Đúng' : '❌ Sai'}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {item.options.map((opt, oIdx) => {
                        const isSelected = userChoice === oIdx;
                        let btnStyle = 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-500';
                        if (isSubmitted) {
                          if (oIdx === item.correct) {
                            btnStyle = 'bg-emerald-600 text-white font-black shadow-xs ring-2 ring-emerald-400';
                          } else if (isSelected && !isCorrect) {
                            btnStyle = 'bg-rose-600 text-white font-bold line-through';
                          } else {
                            btnStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 opacity-60';
                          }
                        } else {
                          if (isSelected) {
                            btnStyle = 'bg-blue-600 text-white font-black shadow-sm ring-2 ring-blue-400';
                          }
                        }
                        return (
                          <button
                            key={oIdx}
                            disabled={isSubmitted}
                            onClick={() => handleSelectOption(item.id, oIdx)}
                            className={`p-2.5 rounded-xl text-xs font-bold text-left transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {!isSubmitted && isSelected && <span>✓</span>}
                          </button>
                        );
                      })}
                    </div>
                    {isSubmitted && (
                      <div className="mt-3 p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        <strong className="text-blue-600 dark:text-blue-400">💡 Chấm chữa của Thầy: </strong>
                        <span>{item.exp}</span>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* NÚT NỘP BÀI DƯỚI ĐÁY */}
          <div className="pt-2 text-center space-y-2">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmitExam}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-600/30 transition transform hover:-translate-y-0.5 cursor-pointer inline-flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>NỘP BÀI &amp; CHẤM CHỮA (LẦN {attemptCount})</span>
              </button>
            ) : (
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveTab('results')}
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <Trophy className="w-5 h-5" />
                  <span>XEM BẢNG ĐIỂM &amp; CHẤM CHỮA CHI TIẾT</span>
                </button>
                <button
                  type="button"
                  onClick={handleRetakeExam}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <RotateCw className="w-5 h-5" />
                  <span>LÀM LẠI LẦN {attemptCount + 1} (+10Đ CHUYÊN CẦN)</span>
                </button>
              </div>
            )}
            <p className="text-xs text-slate-500">
              Sau khi nộp bài, hệ thống sẽ tự động chấm điểm, hiển thị giải thích chi tiết từng câu và cộng điểm chuyên cần!
            </p>
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
                placeholder="Bắt đầu viết đoạn văn của em tại đây (80-100 từ)...&#10;Ví dụ: In my family, my father has an interesting hobby in his free time. He is fond of..."
                className="w-full h-64 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:border-blue-500 leading-relaxed resize-none font-sans"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 gap-2 flex-wrap">
              <span>{wordCount >= 80 && wordCount <= 110 ? '✅ Độ dài đạt chuẩn 80-100 từ!' : '⚠️ Hãy viết đủ 80-100 từ để đạt điểm tối đa.'}</span>
              <button 
                type="button"
                onClick={handleWritingSubmit}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold cursor-pointer hover:bg-blue-700 transition flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Nộp Đoạn Văn (+10đ Chuyên Cần)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 5: BẢNG ĐIỂM, CHẤM CHỮA & LÀM LẠI ==================== */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          {!isSubmitted ? (
            /* Khi học sinh chưa nộp bài */
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-5">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-3xl font-black shadow-xs">
                📝
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-xl font-black text-slate-800 dark:text-white">
                  Em Chưa Nộp Bài Đề Cương (Lần {attemptCount})
                </h3>
                <p className="text-sm text-slate-500">
                  Hiện tại em đã chọn được <strong>{answeredCount}/{allItems.length} câu hỏi</strong>.
                  Sau khi nộp bài, hệ thống sẽ chấm điểm chi tiết, giải thích từng câu và cộng điểm chuyên cần cho em!
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveTab('listening')}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm cursor-pointer"
                >
                  👈 Quay Lại Làm Phần Nghe
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('practice')}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm cursor-pointer"
                >
                  👈 Quay Lại Làm Trắc Nghiệm
                </button>
                {answeredCount > 0 && (
                  <button
                    type="button"
                    onClick={handleSubmitExam}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-md cursor-pointer"
                  >
                    📝 Nộp Bài Ngay Bây Giờ &rarr;
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Khi học sinh đã nộp bài: Hiển thị đầy đủ điểm số, chấm chữa chi tiết & nút làm lại */
            <>
              {/* BẢNG ĐIỂM TỔNG KẾT */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-6">
                <div className="max-w-md mx-auto space-y-3">
                  <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 text-slate-950 flex flex-col items-center justify-center font-black shadow-xl">
                    <span className="text-3xl leading-none">{totalScore10}</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider mt-0.5">/ 10.0 Điểm</span>
                  </div>

                  <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-xs font-black">
                    KẾT QUẢ ĐỀ CƯƠNG: LẦN LÀM {attemptCount}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">
                    {parseFloat(totalScore10) >= 9.0 ? '🏆 Xuất Sắc — Đạt Mức Điểm Giỏi!' :
                     parseFloat(totalScore10) >= 8.0 ? '🌟 Giỏi — Nắm Rất Vững Kiến Thức!' :
                     parseFloat(totalScore10) >= 6.5 ? '💪 Khá — Tiếp Tục Ôn Các Câu Sai!' :
                     parseFloat(totalScore10) >= 5.0 ? '📖 Đạt Yêu Cầu — Hãy Làm Lại Để Gỡ Điểm!' :
                     '⚠️ Cần Cố Gắng — Xem Kỹ Chấm Chữa & Làm Lại Lần Tiếp Theo!'}
                  </h3>

                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-2 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-bold">
                    <Sparkles className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>
                      {currentStudent 
                        ? `⭐ Đã cộng +${lastMeritBonus || 10} điểm chuyên cần vào sổ thi đua Lớp ${currentStudent.className} của em ${currentStudent.name}!` 
                        : `⭐ Hoàn thành đề cương: +${lastMeritBonus || 10} điểm chuyên cần!`}
                    </span>
                  </div>
                </div>

                {/* 3 THỐNG KÊ CHI TIẾT */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{correctCount}</div>
                    <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Câu Đúng ({(correctCount * 10 / allItems.length).toFixed(1)}đ)</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
                    <div className="text-2xl font-black text-rose-600 dark:text-rose-400">{wrongCount}</div>
                    <div className="text-xs font-bold text-rose-800 dark:text-rose-300">Câu Chưa Đúng</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="text-2xl font-black text-slate-600 dark:text-slate-400">{unansweredCount}</div>
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Câu Chưa Chọn</div>
                  </div>
                </div>

                {/* NÚT LÀM LẠI & THI CHÍNH THỨC */}
                <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={handleRetakeExam}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>🔄 Làm Lại Lần {attemptCount + 1} (Gỡ Điểm &amp; Nhận Thêm Chuyên Cần)</span>
                  </button>

                  {onGoToExams && (
                    <button
                      type="button"
                      onClick={onGoToExams}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                    >
                      <span>🚀 Làm Bài Thi Chính Thức (Mã 801, 802, 803) &rarr;</span>
                    </button>
                  )}
                </div>

                {/* LỊCH SỬ CÁC LẦN LÀM BÀI */}
                {attemptHistory.length > 0 && (
                  <div className="max-w-2xl mx-auto pt-4 border-t border-slate-100 dark:border-slate-800 text-left">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                      📜 Lịch Sử Ôn Luyện Của Em ({attemptHistory.length} lần làm bài):
                    </h4>
                    <div className="space-y-1.5">
                      {attemptHistory.map((att, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            Lần {att.attempt} ({att.time}):
                          </span>
                          <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-sm">
                            {att.score} / 10.0đ
                          </span>
                          <span className="text-slate-500">
                            {att.correct}/{att.total} câu đúng
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                            +{att.meritBonus}đ chuyên cần
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* BẢNG CHẤM CHỮA CHI TIẾT TOÀN BỘ CÂU HỎI */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-3 flex-wrap border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                      <span>📝</span>
                      <span>Chấm Chữa &amp; Lời Giải Chi Tiết Của Thầy</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Xem lại từng câu, đối chiếu đáp án của em và lời giải thích ngữ pháp / từ vựng chuẩn mực
                    </p>
                  </div>

                  {/* BỘ LỌC CHẤM CHỮA */}
                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setReviewFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        reviewFilter === 'all' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Tất cả ({allItems.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewFilter('wrong')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        reviewFilter === 'wrong' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      ❌ Câu sai ({wrongCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewFilter('correct')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        reviewFilter === 'correct' ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      ✅ Câu đúng ({correctCount})
                    </button>
                  </div>
                </div>

                {/* DANH SÁCH CÂU HỎI ĐƯỢC CHẤM CHỮA */}
                <div className="space-y-4">
                  {reviewQuestions.map(item => {
                    const userChoice = userAnswers[item.id];
                    const isAnswered = userChoice !== undefined;
                    const isCorrect = userChoice === item.correct;
                    return (
                      <div 
                        key={item.id} 
                        className={`p-4 sm:p-5 rounded-2xl border transition ${
                          isCorrect 
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800' 
                            : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <p className="font-bold text-sm text-slate-900 dark:text-white leading-relaxed">
                            <span className="inline-block px-2 py-0.5 rounded bg-blue-600 text-white text-xs mr-2 font-mono">
                              Câu {item.num}
                            </span>
                            {item.q}
                          </p>
                          <span className={`px-2.5 py-0.5 rounded-md text-xs font-black shrink-0 ${
                            isCorrect 
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' 
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                          }`}>
                            {isCorrect ? '✅ ĐÚNG' : (isAnswered ? '❌ CHƯA ĐÚNG' : '⚪ CHƯA LÀM')}
                          </span>
                        </div>

                        {/* Các lựa chọn & đánh dấu đáp án */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2.5">
                          {item.options.map((opt, oIdx) => {
                            const isUserPick = userChoice === oIdx;
                            const isActualCorrect = oIdx === item.correct;
                            let style = 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
                            if (isActualCorrect) {
                              style = 'bg-emerald-600 text-white font-bold ring-2 ring-emerald-400';
                            } else if (isUserPick && !isCorrect) {
                              style = 'bg-rose-600 text-white font-bold line-through';
                            } else {
                              style = 'bg-slate-50 dark:bg-slate-800/60 text-slate-400 border border-slate-200 dark:border-slate-700 opacity-60';
                            }
                            return (
                              <div key={oIdx} className={`p-2.5 rounded-xl text-xs flex items-center justify-between ${style}`}>
                                <span>{opt}</span>
                                {isActualCorrect && <span className="font-bold text-[11px] ml-1">⭐ Đáp án đúng</span>}
                                {isUserPick && !isCorrect && <span className="font-bold text-[11px] ml-1">❌ Em chọn</span>}
                              </div>
                            );
                          })}
                        </div>

                        {/* Lời giải & chấm chữa của Thầy */}
                        <div className="mt-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-1">
                          <div className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                            <span>Chấm chữa &amp; Hướng dẫn giải chi tiết:</span>
                          </div>
                          <p className="pl-5 italic text-slate-600 dark:text-slate-300">
                            {item.exp}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
