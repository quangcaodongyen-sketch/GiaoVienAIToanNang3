import React, { useState, useEffect } from 'react';
import { 
  Award, 
  RotateCw, 
  Volume2, 
  Sparkles,
  BookOpen,
  GraduationCap,
  Trophy
} from 'lucide-react';
import { studentGradebookService, StudentProfile } from '../services/studentGradebookService';

export interface ExamQuestion {
  part: 'A' | 'B' | 'C' | 'D';
  partTitle: string;
  partInstruction: string;
  qNumber: number;
  id: string;
  type: 'choice' | 'input' | 'listen';
  text: string;
  audioText?: string;
  options?: string[];
  correct: string;
  explanation: string;
  passage?: string;
}

export interface GeneratedExam {
  grade: number;
  examType: 'giua-ky-1' | 'cuoi-ky-1' | 'giua-ky-2' | 'cuoi-ky-2';
  typeTitle: string;
  examCode: string;
  durationMinutes: number;
  totalQuestions: number;
  passageText: string;
  questions: ExamQuestion[];
}

interface OnlineExamPortalProps {
  onGoToLeaderboard?: () => void;
}

export const OnlineExamPortal: React.FC<OnlineExamPortalProps> = ({ onGoToLeaderboard }) => {
  const [selectedGrade, setSelectedGrade] = useState<number>(7);
  const [examType, setExamType] = useState<'giua-ky-1' | 'cuoi-ky-1' | 'giua-ky-2' | 'cuoi-ky-2'>('giua-ky-1');
  const [selectedExamIndex, setSelectedExamIndex] = useState<number>(0);
  const [currentExam, setCurrentExam] = useState<GeneratedExam | null>(null);
  
  const [activeStudent, setActiveStudent] = useState<StudentProfile | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [scoreResult, setScoreResult] = useState<{
    score: number;
    correctCount: number;
    total: number;
    rankLevel: string;
    scaledScore: number;
  } | null>(null);

  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    const stu = studentGradebookService.getActiveStudent();
    if (stu) {
      setActiveStudent(stu);
      if (stu.grade >= 6 && stu.grade <= 12) {
        setSelectedGrade(stu.grade);
      }
    }
  }, []);

  useEffect(() => {
    buildExam(selectedGrade, examType, selectedExamIndex);
  }, [selectedGrade, examType, selectedExamIndex]);

  const speakText = (textToSpeak: string, qId?: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (qId) setPlayingId(qId);

    const u = new SpeechSynthesisUtterance(textToSpeak);
    u.lang = 'en-US';
    u.rate = 0.9;
    u.onend = () => setPlayingId(null);
    u.onerror = () => setPlayingId(null);
    window.speechSynthesis.speak(u);
  };

  const buildExam = (grade: number, type: string, examIdx: number) => {
    setIsSubmitted(false);
    setUserAnswers({});
    setScoreResult(null);

    const typeTitle = type === 'giua-ky-1' ? 'ĐỀ KIỂM TRA GIỮA HỌC KỲ I'
                    : type === 'cuoi-ky-1' ? 'ĐỀ KIỂM TRA CUỐI HỌC KỲ I'
                    : type === 'giua-ky-2' ? 'ĐỀ KIỂM TRA GIỮA HỌC KỲ II'
                    : 'ĐỀ KIỂM TRA CUỐI HỌC KỲ II';

    const examCode = `TA${grade}-${101 + examIdx * 7}`;

    const passages = [
      `Community service is voluntary work that helps improve our neighborhood and supports people in need. Many teenagers in Viet Nam join green clubs to plant trees along public streets, clean up plastic waste in local rivers, and donate warm clothes to poor children in mountainous areas. Through volunteering, students not only protect the surrounding environment but also develop vital teamwork, communication skills, and empathy.`,
      `Customs and traditions play an extremely important role in preserving the unique identity of each Vietnamese community. During traditional festivals, families gather to cook special dishes such as chung cakes, perform dragon dances, and visit relatives. These beautiful customs teach the younger generation to respect ancestors and protect cultural heritages for future centuries.`,
      `Modern lifestyle in big cities brings many technological conveniences, but it also creates stressful challenges such as heavy traffic jams, air pollution, and lack of green spaces for outdoor sports. Many young people now prefer living a green life by riding bicycles to school, sorting daily rubbish, and growing vegetables on home balconies to protect personal health and urban nature.`,
      `Education in the digital era has transformed significantly thanks to high-speed internet, smart devices, and artificial intelligence. Students can easily participate in virtual classrooms, listen to native English speakers, and practice interactive exercises at any time. However, learning effectively requires learners to practice self-discipline and balance computer screen time with physical sports.`
    ];
    const passage = passages[examIdx % passages.length];

    const questions: ExamQuestion[] = [];
    let qNum = 1;

    // PART A. LISTENING (4 questions - 2.0 pts)
    const listenData = [
      { text: "Listen to the speaker and choose the correct word you hear in the recording:", audio: "community service", opts: ["community service", "computer science", "commercial street", "communication skills"], correct: "community service", exp: "Từ phát âm là 'community service' (dịch vụ cộng đồng)." },
      { text: "Listen and choose the word related to student voluntary actions:", audio: "volunteer project", opts: ["volunteer project", "vacation plan", "violin practice", "village picnic"], correct: "volunteer project", exp: "Từ phát âm là 'volunteer project' (dự án tình nguyện)." },
      { text: "Listen to the recording and choose the correct activity:", audio: "planting trees", opts: ["planting trees", "painting walls", "playing tennis", "planning trips"], correct: "planting trees", exp: "Từ phát âm là 'planting trees' (trồng cây xanh)." },
      { text: "Listen and choose the correct feeling described:", audio: "generous and helpful", opts: ["generous and helpful", "general and hopeful", "gentle and harmful", "giant and healthy"], correct: "generous and helpful", exp: "Cụm từ phát âm là 'generous and helpful' (hào phóng và hay giúp đỡ)." }
    ];

    listenData.forEach(item => {
      questions.push({
        part: 'A',
        partTitle: 'PART A. LISTENING (2.0 points)',
        partInstruction: 'Listen to the audio recording and choose the best answer A, B, C, or D.',
        qNumber: qNum++,
        id: `q_${qNum}`,
        type: 'listen',
        text: item.text,
        audioText: item.audio,
        options: item.opts,
        correct: item.correct,
        explanation: item.exp
      });
    });

    // PART B. LANGUAGE FOCUS, PRONUNCIATION & GRAMMAR (8 questions - 4.0 pts)
    questions.push({
      part: 'B',
      partTitle: 'PART B. LANGUAGE FOCUS, VOCABULARY & GRAMMAR (4.0 points)',
      partInstruction: 'Choose the word whose underlined part is pronounced differently from the others.',
      qNumber: qNum++,
      id: `q_${qNum}`,
      type: 'choice',
      text: 'Choose the word whose underlined part is pronounced differently:',
      options: ['community', 'volunteer', 'hobby', 'collect'],
      correct: 'volunteer',
      explanation: "Chữ cái 'o' trong 'volunteer' phát âm là /ɒ/, còn lại phát âm là /ə/."
    });

    questions.push({
      part: 'B',
      partTitle: 'PART B. LANGUAGE FOCUS, VOCABULARY & GRAMMAR (4.0 points)',
      partInstruction: 'Choose the word that has different stress position from the rest.',
      qNumber: qNum++,
      id: `q_${qNum}`,
      type: 'choice',
      text: 'Choose the word that has a different stress position:',
      options: ['traditional', 'environment', 'activity', 'volunteer'],
      correct: 'volunteer',
      explanation: "'volunteer' trọng âm rơi vào âm tiết thứ 3, các từ còn lại trọng âm rơi vào âm tiết thứ 2."
    });

    const grammarData = [
      {
        text: "She loves __________ warm clothes and books to poor children every winter.",
        opts: ["donating", "to donate", "donated", "donates"],
        correct: "donating",
        exp: "Sau động từ chỉ sở thích 'love' dùng V-ing: donating."
      },
      {
        text: "Life in the countryside is much __________ than life in crowded big cities.",
        opts: ["peaceful", "more peaceful", "most peaceful", "as peaceful"],
        correct: "more peaceful",
        exp: "Cấu trúc so sánh hơn với tính từ dài (peaceful): more + adj + than."
      },
      {
        text: "If we __________ plastic bags responsibly, we will protect our ocean and soil.",
        opts: ["recycle", "recycled", "will recycle", "are recycling"],
        correct: "recycle",
        exp: "Câu điều kiện loại 1 (mệnh đề If): chia thì hiện tại đơn (If + S + V(hiện tại đơn))."
      },
      {
        text: "Vietnamese people often __________ Chung cakes during the Lunar New Year.",
        opts: ["make", "take", "do", "build"],
        correct: "make",
        exp: "Cụm từ cố định 'make Chung cakes' (gói bánh Chưng)."
      },
      {
        text: "How much __________ do you drink every day to stay healthy?",
        opts: ["water", "apples", "eggs", "vegetables"],
        correct: "water",
        exp: "'How much' đi với danh từ không đếm được: water."
      },
      {
        text: "My brother started __________ badminton three years ago.",
        opts: ["playing", "play", "played", "plays"],
        correct: "playing",
        exp: "Sau động từ 'start' có thể dùng V-ing: start playing."
      }
    ];

    grammarData.forEach(item => {
      questions.push({
        part: 'B',
        partTitle: 'PART B. LANGUAGE FOCUS, VOCABULARY & GRAMMAR (4.0 points)',
        partInstruction: 'Choose the best option A, B, C, or D to complete each sentence.',
        qNumber: qNum++,
        id: `q_${qNum}`,
        type: 'choice',
        text: item.text,
        options: item.opts,
        correct: item.correct,
        explanation: item.exp
      });
    });

    // PART C. READING COMPREHENSION (4 questions - 2.0 pts)
    const readQuestions = [
      {
        q: "What is community service according to the passage?",
        opts: ["Voluntary work that helps people in need", "A paid job with high salary", "Playing video games indoors", "Doing homework alone"],
        correct: "Voluntary work that helps people in need",
        exp: "Thông tin câu đầu: 'Community service is voluntary work that helps improve our neighborhood and supports people in need.'"
      },
      {
        q: "What environmental activities do Vietnamese teenagers join?",
        opts: ["Planting trees and cleaning up plastic waste", "Cutting down forests", "Buying plastic bags", "Driving cars"],
        correct: "Planting trees and cleaning up plastic waste",
        exp: "Dẫn chứng: '...join green clubs to plant trees along public streets, clean up plastic waste...'"
      },
      {
        q: "What skills can students develop through volunteering?",
        opts: ["Teamwork, communication, and empathy", "Selfish habits", "Car racing skills", "Computer hacking"],
        correct: "Teamwork, communication, and empathy",
        exp: "Dẫn chứng: '...develop vital teamwork, communication skills, and empathy.'"
      },
      {
        q: "What is the best title for this passage?",
        opts: ["The Importance and Benefits of Volunteering", "How to Play Football", "Traveling Abroad in Summer", "The History of Computers"],
        correct: "The Importance and Benefits of Volunteering",
        exp: "Toàn bộ bài đọc nói về ý nghĩa và lợi ích thiết thực của các hoạt động thiện nguyện cộng đồng."
      }
    ];

    readQuestions.forEach(rq => {
      questions.push({
        part: 'C',
        partTitle: 'PART C. READING COMPREHENSION (2.0 points)',
        partInstruction: 'Read the text and choose the correct answer A, B, C, or D.',
        passage: passage,
        qNumber: qNum++,
        id: `q_${qNum}`,
        type: 'choice',
        text: rq.q,
        options: rq.opts,
        correct: rq.correct,
        explanation: rq.exp
      });
    });

    // PART D. WRITING (4 questions - 2.0 pts)
    const writeData = [
      {
        text: "Rewrite the sentence beginning with 'She started...': <i>'She has played the piano for 5 years.'</i>",
        opts: [
          "She started playing the piano 5 years ago.",
          "She started play the piano for 5 years ago.",
          "She started playing the piano since 5 years.",
          "She start played the piano 5 years ago."
        ],
        correct: "She started playing the piano 5 years ago.",
        exp: "Chuyển từ Hiện tại hoàn thành (have/has + PII + for + time) sang Quá khứ đơn (started + V-ing + time + ago)."
      },
      {
        text: "Rewrite using 'Unless': <i>'If you don't study hard, you will not pass the exam.'</i>",
        opts: [
          "Unless you study hard, you will pass the exam.",
          "Unless you study hard, you will fail the exam.",
          "Unless you don't study hard, you will pass.",
          "Unless study hard, you pass exam."
        ],
        correct: "Unless you study hard, you will fail the exam.",
        exp: "Unless = If not. 'Unless you study hard, you will fail the exam' (Trừ khi em học chăm, em sẽ thi trượt)."
      },
      {
        text: "Rewrite using comparative structure: <i>'Cycling is healthier than traveling by car.'</i>",
        opts: [
          "Traveling by car is not as healthy as cycling.",
          "Traveling by car is healthier than cycling.",
          "Traveling by car is as healthy as cycling.",
          "Traveling by car is more healthier than cycling."
        ],
        correct: "Traveling by car is not as healthy as cycling.",
        exp: "Cấu trúc so sánh không bằng: not as/so + adj + as."
      },
      {
        text: "Rearrange words to make a meaningful sentence: <i>[free / loves / time / in / Mai / her / books / reading].</i>",
        opts: [
          "Mai loves reading books in her free time.",
          "Mai reading loves books in her free time.",
          "In her free time loves Mai reading books.",
          "Mai loves in her free time reading books."
        ],
        correct: "Mai loves reading books in her free time.",
        exp: "Cấu trúc câu hoàn chỉnh: Chủ ngữ (Mai) + Động từ (loves reading books) + Trạng từ (in her free time)."
      }
    ];

    writeData.forEach(wd => {
      questions.push({
        part: 'D',
        partTitle: 'PART D. WRITING (2.0 points)',
        partInstruction: 'Choose the sentence that has the closest meaning to the original sentence or makes a correct sentence.',
        qNumber: qNum++,
        id: `q_${qNum}`,
        type: 'choice',
        text: wd.text,
        options: wd.opts,
        correct: wd.correct,
        explanation: wd.exp
      });
    });

    setCurrentExam({
      grade,
      examType: type as any,
      typeTitle,
      examCode,
      durationMinutes: 45,
      totalQuestions: questions.length,
      passageText: passage,
      questions
    });
  };

  const handleSelectAnswer = (qId: string, answer: string) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [qId]: answer
    }));
  };

  const handleSubmitExam = () => {
    if (!currentExam) return;

    let correctCount = 0;
    currentExam.questions.forEach(q => {
      const userAns = (userAnswers[q.id] || '').trim().toLowerCase();
      const rightAns = (q.correct || '').trim().toLowerCase();
      if (userAns === rightAns) {
        correctCount++;
      }
    });

    const total = currentExam.questions.length;
    const scaledScore = Math.round((correctCount / total) * 100) / 10;

    let rankLevel = 'CAN_CO_GANG';
    if (scaledScore >= 9.0) rankLevel = 'XUAT_SAC';
    else if (scaledScore >= 8.0) rankLevel = 'GIOI';
    else if (scaledScore >= 6.5) rankLevel = 'KHA';
    else if (scaledScore >= 5.0) rankLevel = 'DAT';

    setScoreResult({
      score: scaledScore,
      correctCount,
      total,
      rankLevel,
      scaledScore
    });
    setIsSubmitted(true);

    try {
      const currentStu = activeStudent || studentGradebookService.getActiveStudent();
      const studentId = currentStu?.id || 'stu-guest-' + Date.now().toString(36);
      const studentCode = currentStu?.studentCode || 'HS' + selectedGrade + 'A1-' + studentId.slice(-4);
      const studentName = currentStu?.name || 'Học sinh Tiếng Anh ' + selectedGrade;
      const classId = currentStu?.classId || 'cls-' + selectedGrade + 'a1';
      const className = currentStu?.className || selectedGrade + 'A1';

      studentGradebookService.recordSubmission({
        studentId,
        studentCode,
        studentName,
        classId,
        className,
        grade: selectedGrade,
        testType: 'gk_ck_exam',
        unitNumber: examType.includes('giua') ? 1 : 2,
        unitTitle: currentExam.typeTitle,
        testTitle: `${currentExam.typeTitle} (Mã đề: ${currentExam.examCode})`,
        score: scaledScore,
        correctCount,
        totalQuestions: total,
        timeSpentSeconds: 1800,
        rankLevel: rankLevel as any,
        teacherFeedback: scaledScore >= 8 
          ? 'Bài làm xuất sắc! Em nắm rất chắc cấu trúc đề thi BGD&ĐT.' 
          : 'Cần ôn lại một số câu từ vựng & ngữ pháp sai để nâng cao điểm số.'
      });
    } catch (e) {
      console.warn('Auto submission error:', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER - SLIM & COMPACT */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-400/30 rounded-2xl p-4 sm:p-5 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Chuẩn Bộ GD&ĐT (CV 7991)</span>
            </div>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-white m-0">
              ĐỀ KIỂM TRA GIỮA KỲ & CUỐI KỲ ONLINE
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-blue-200">Đầy đủ 4 kỹ năng: Nghe, Phát âm, Ngữ pháp, Đọc hiểu & Viết.</span>
          </div>
        </div>

        {/* CONTROLS: CHỌN KHỐI LỚP + CHỌN KỲ THI + 10 MÃ ĐỀ HOÁN ĐỔI */}
        <div className="relative z-10 pt-3 border-t border-white/10 space-y-3">
          {/* Row 1: Chọn Khối Lớp */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-cyan-200 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Khối lớp:</span>
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {[6, 7, 8, 9, 10, 11, 12].map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setSelectedGrade(g)}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedGrade === g
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md scale-105'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <span>Lớp {g}</span>
                  <span className={`text-[10px] px-1 py-0.2 rounded font-bold ${
                    selectedGrade === g ? 'bg-slate-950/20 text-slate-950' : 'bg-black/30 text-cyan-200'
                  }`}>
                    {g <= 9 ? 'THCS' : 'THPT'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Chọn Đợt Kiểm Tra & 10 Mã Đề Hoán Đổi */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-amber-200">Đợt thi:</span>
              <div className="inline-flex rounded-xl bg-black/40 p-1 border border-white/10 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setExamType('giua-ky-1')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    examType === 'giua-ky-1' ? 'bg-blue-600 text-white font-black shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Giữa HK1
                </button>
                <button
                  type="button"
                  onClick={() => setExamType('cuoi-ky-1')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    examType === 'cuoi-ky-1' ? 'bg-blue-600 text-white font-black shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Cuối HK1
                </button>
                <button
                  type="button"
                  onClick={() => setExamType('giua-ky-2')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    examType === 'giua-ky-2' ? 'bg-blue-600 text-white font-black shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Giữa HK2
                </button>
                <button
                  type="button"
                  onClick={() => setExamType('cuoi-ky-2')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    examType === 'cuoi-ky-2' ? 'bg-blue-600 text-white font-black shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Cuối HK2
                </button>
              </div>
            </div>

            {/* 10 Đề Hoán Đổi */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-emerald-300">Chọn 1 trong 10 mã đề:</span>
              <div className="flex items-center gap-1 flex-wrap">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSelectedExamIndex(num)}
                    className={`w-7 h-7 rounded-lg text-xs font-black transition cursor-pointer flex items-center justify-center ${
                      selectedExamIndex === num
                        ? 'bg-emerald-400 text-slate-950 font-black scale-110 shadow-sm'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                    title={`Đề số ${num + 1}`}
                  >
                    {num + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EXAM PAPER CONTAINER */}
      {currentExam && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
          {/* Header thi */}
          <div className="bg-slate-50 dark:bg-slate-850 p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                TRƯỜNG THCS ĐỒNG YÊN — NĂM HỌC 2026 - 2027
              </div>
              <h3 className="text-base sm:text-lg font-black text-blue-950 dark:text-white">
                {currentExam.typeTitle} — TIẾNG ANH LỚP {currentExam.grade}
              </h3>
              <div className="text-xs text-slate-500 mt-0.5">
                Thời gian làm bài: <strong>45 phút</strong> | Số lượng: <strong>{currentExam.totalQuestions} câu</strong>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800">
                <span className="text-[11px] font-bold text-slate-500 block">MÃ ĐỀ THI</span>
                <span className="text-base font-black text-blue-600 dark:text-blue-400">{currentExam.examCode}</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedExamIndex(prev => (prev + 1) % 10)}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Đổi sang đề ngẫu nhiên khác"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Đổi Đề Khác</span>
              </button>
            </div>
          </div>

          {/* Body các câu hỏi */}
          <div className="p-4 sm:p-6 space-y-6">
            {currentExam.questions.some(q => q.part === 'C') && (
              <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                <p className="font-bold text-blue-900 dark:text-blue-300 mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>ĐOẠN VĂN ĐỌC HIỂU (READING PASSAGE):</span>
                </p>
                <p className="italic">{currentExam.passageText}</p>
              </div>
            )}

            <div className="space-y-4">
              {currentExam.questions.map((q) => {
                const userAns = userAnswers[q.id];
                const isCorrect = userAns && userAns.toLowerCase() === q.correct.toLowerCase();

                return (
                  <div 
                    key={q.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isSubmitted
                        ? isCorrect
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                          : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800'
                        : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex-1">
                        <span className="text-blue-600 dark:text-blue-400 mr-1.5">Câu {q.qNumber}:</span>
                        <span dangerouslySetInnerHTML={{ __html: q.text }} />
                      </div>

                      {q.type === 'listen' && q.audioText && (
                        <button
                          type="button"
                          onClick={() => speakText(q.audioText!, q.id)}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
                          title="Bấm để nghe phát âm"
                        >
                          <Volume2 className={`w-3.5 h-3.5 ${playingId === q.id ? 'animate-bounce' : ''}`} />
                          <span>Nghe</span>
                        </button>
                      )}
                    </div>

                    {q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                        {q.options.map((opt, optIdx) => {
                          const letters = ['A', 'B', 'C', 'D'];
                          const letter = letters[optIdx] || 'A';
                          const isOptSelected = userAns === opt;
                          const isOptRight = isSubmitted && opt.toLowerCase() === q.correct.toLowerCase();

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              disabled={isSubmitted}
                              onClick={() => handleSelectAnswer(q.id, opt)}
                              className={`p-2.5 rounded-xl text-left text-xs sm:text-sm font-semibold transition flex items-center gap-2 cursor-pointer border ${
                                isSubmitted
                                  ? isOptRight
                                    ? 'bg-emerald-600 text-white border-emerald-600 font-black shadow-xs'
                                    : isOptSelected
                                      ? 'bg-rose-100 text-rose-800 border-rose-300 line-through'
                                      : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 opacity-60'
                                  : isOptSelected
                                    ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                                    : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-black shrink-0 ${
                                isOptSelected ? 'bg-white text-blue-900' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                              }`}>
                                {letter}
                              </span>
                              <span className="flex-1">{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {isSubmitted && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs leading-relaxed">
                        {isCorrect ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            ✓ Chính xác (+0.5đ)! {q.explanation}
                          </span>
                        ) : (
                          <span className="text-rose-600 dark:text-rose-400">
                            ✗ Chưa đúng! Đáp án chuẩn: <strong>{q.correct}</strong>. ({q.explanation})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                {isSubmitted ? (
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Đã hoàn tất chấm điểm. Điểm số đã được tự động lưu vào Sổ điểm thi đua lớp!
                  </span>
                ) : (
                  <span>
                    Đã chọn <strong>{Object.keys(userAnswers).length}</strong> / {currentExam.totalQuestions} câu hỏi.
                  </span>
                )}
              </div>

              {!isSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitExam}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>NỘP BÀI THI & CHẤM ĐIỂM NGAY</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedExamIndex(prev => (prev + 1) % 10)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Làm Đề Khác Tiếp Tục</span>
                  </button>
                  {onGoToLeaderboard && (
                    <button
                      type="button"
                      onClick={onGoToLeaderboard}
                      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs transition cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      <span>Xem Sổ Điểm & Bảng Thi Đua Lớp</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Kết quả sau khi nộp */}
            {isSubmitted && scoreResult && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg text-center space-y-2 animate-fadeIn">
                <div className="text-2xl">
                  {scoreResult.scaledScore >= 8 ? '🌟🎉' : scoreResult.scaledScore >= 5 ? '👏' : '💪'}
                </div>
                <h4 className="text-xl font-black text-amber-300">
                  Điểm Số Của Em: {scoreResult.scaledScore} / 10.0 Điểm
                </h4>
                <p className="text-xs text-blue-100">
                  Đúng {scoreResult.correctCount} / {scoreResult.total} câu — Xếp loại: <strong>{scoreResult.rankLevel === 'XUAT_SAC' ? 'Xuất Sắc 🏆' : scoreResult.rankLevel === 'GIOI' ? 'Giỏi 🌟' : scoreResult.rankLevel === 'KHA' ? 'Khá 👍' : 'Đạt'}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
