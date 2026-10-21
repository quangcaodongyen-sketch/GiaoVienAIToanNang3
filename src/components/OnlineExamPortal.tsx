import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, 
  RotateCw, 
  Volume2, 
  Sparkles,
  BookOpen,
  GraduationCap,
  Trophy,
  Play,
  Pause,
  FileText
} from 'lucide-react';
import { studentGradebookService, StudentProfile } from '../services/studentGradebookService';
import { OFFICIAL_MIDTERM_EXAMS_DATA } from '../data/officialMidtermExams';

export interface ExamQuestion {
  part: 'A' | 'B' | 'C' | 'D' | 'E';
  partTitle: string;
  partInstruction: string;
  qNumber: number;
  id: string;
  type: 'choice' | 'input' | 'listen' | 'essay';
  text: string;
  audioText?: string;
  options?: string[];
  correct: string;
  correctLetter?: string;
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
  audioUrl?: string;
  audioScript?: string;
  sampleWriting?: string;
  writingRubric?: string;
  questions: ExamQuestion[];
}

interface OnlineExamPortalProps {
  onGoToLeaderboard?: () => void;
}

export const OnlineExamPortal: React.FC<OnlineExamPortalProps> = ({ onGoToLeaderboard }) => {
  const [selectedGrade, setSelectedGrade] = useState<number>(8);
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
  const [isPlayingMainAudio, setIsPlayingMainAudio] = useState<boolean>(false);
  const [showAudioScript, setShowAudioScript] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingMainAudio(false);
    }
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

  const toggleMainAudio = (url?: string, scriptText?: string) => {
    if (isPlayingMainAudio) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingMainAudio(false);
      return;
    }

    if (url) {
      if (!audioRef.current) {
        audioRef.current = new Audio(url);
        audioRef.current.onended = () => setIsPlayingMainAudio(false);
        audioRef.current.onerror = () => {
          if (scriptText) speakText(scriptText);
        };
      } else {
        audioRef.current.src = url;
      }
      audioRef.current.play().then(() => {
        setIsPlayingMainAudio(true);
      }).catch(() => {
        if (scriptText) speakText(scriptText);
      });
    } else if (scriptText) {
      speakText(scriptText);
      setIsPlayingMainAudio(true);
    }
  };

  const isOfficialMidterm = examType === 'giua-ky-1' && (selectedGrade === 6 || selectedGrade === 8);
  const officialCodes = isOfficialMidterm 
    ? (selectedGrade === 6 ? ['601', '602', '603', '604', '605', '606'] : ['801', '802', '803', '804', '805', '806'])
    : [];

  const buildExam = (grade: number, type: string, examIdx: number) => {
    setIsSubmitted(false);
    setUserAnswers({});
    setScoreResult(null);
    setShowAudioScript(false);

    // ── KIỂM TRA NẾU LÀ ĐỀ CHÍNH THỨC GIỮA KÌ 1 KHỐI 6 HOẶC KHỐI 8 ──
    if (type === 'giua-ky-1' && (grade === 6 || grade === 8)) {
      const codes = grade === 6 ? ['601', '602', '603', '604', '605', '606'] : ['801', '802', '803', '804', '805', '806'];
      const targetCode = codes[examIdx % codes.length];
      const offExam = OFFICIAL_MIDTERM_EXAMS_DATA[grade]?.[targetCode];

      if (offExam) {
        const convertedQuestions: ExamQuestion[] = offExam.questions.map(q => ({
          part: q.part,
          partTitle: q.partTitle,
          partInstruction: q.partInstruction,
          qNumber: q.qNumber,
          id: q.id,
          type: q.type,
          text: q.text,
          options: q.options,
          correct: q.correct,
          correctLetter: q.correctLetter,
          explanation: q.explanation,
          passage: q.passage
        }));

        setCurrentExam({
          grade,
          examType: type as any,
          typeTitle: 'BÀI KIỂM TRA ĐÁNH GIÁ GIỮA HỌC KỲ I (CHÍNH THỨC)',
          examCode: `MÃ ĐỀ ${targetCode}`,
          durationMinutes: 60,
          totalQuestions: convertedQuestions.length,
          passageText: offExam.passageText,
          audioUrl: offExam.audioUrl,
          audioScript: offExam.audioScript,
          writingRubric: offExam.writingRubric,
          sampleWriting: offExam.sampleWritingText,
          questions: convertedQuestions
        });
        return;
      }
    }

    // ── FALLBACK CHO CÁC KHỐI VÀ KỲ THI KHÁC ──
    let typeTitle = 'BÀI KIỂM TRA GIỮA HỌC KỲ I';
    if (type === 'cuoi-ky-1') typeTitle = 'BÀI KIỂM TRA CUỐI HỌC KỲ I';
    if (type === 'giua-ky-2') typeTitle = 'BÀI KIỂM TRA GIỮA HỌC KỲ II';
    if (type === 'cuoi-ky-2') typeTitle = 'BÀI KIỂM TRA CUỐI HỌC KỲ II';

    const examCode = `TA${grade}-${101 + examIdx * 7}`;

    const passages = [
      `Community service is voluntary work that helps improve our neighborhood and supports people in need. In Viet Nam, many teenagers join green clubs to plant trees along public streets, clean up plastic waste at lakes, and collect warm coats for children in remote mountainous provinces. These hands-on activities not only protect the natural environment but also help youngsters develop vital teamwork, communication skills, and empathy. When students engage constructively in social projects, they discover a profound sense of civic responsibility and happiness.`,
      `Countryside life in Viet Nam presents a serene contrast to bustling urban areas. Most rural villages are surrounded by vast emerald paddy fields, quiet rivers, and lush bamboo groves. The atmosphere is refreshingly unpolluted, free from heavy traffic jams and factory exhaust. Villagers are remarkably hospitable, often gathering in communal houses to celebrate local harvest festivals. Although country living requires hard agricultural labor from dawn till dusk, local residents appreciate peace, strong neighborly ties, and close harmony with nature.`,
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

    // PART B. LANGUAGE FOCUS (8 questions - 4.0 pts)
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
      { text: "She loves __________ warm clothes and books to poor children every winter.", opts: ["donating", "to donate", "donated", "donates"], correct: "donating", exp: "Sau động từ chỉ sở thích 'love' dùng V-ing: donating." },
      { text: "Life in the countryside is much __________ than life in crowded big cities.", opts: ["peaceful", "more peaceful", "most peaceful", "as peaceful"], correct: "more peaceful", exp: "Cấu trúc so sánh hơn với tính từ dài (peaceful): more + adj + than." },
      { text: "If we __________ plastic bags responsibly, we will protect our ocean and soil.", opts: ["recycle", "recycled", "will recycle", "are recycling"], correct: "recycle", exp: "Câu điều kiện loại 1 (mệnh đề If): chia thì hiện tại đơn." },
      { text: "Vietnamese people often __________ Chung cakes during the Lunar New Year.", opts: ["make", "take", "do", "build"], correct: "make", exp: "Cụm từ cố định 'make Chung cakes' (gói bánh Chưng)." },
      { text: "How much __________ do you drink every day to stay healthy?", opts: ["water", "apples", "eggs", "vegetables"], correct: "water", exp: "'How much' đi với danh từ không đếm được: water." },
      { text: "My brother started __________ badminton three years ago.", opts: ["playing", "play", "played", "plays"], correct: "playing", exp: "Sau động từ 'start' có thể dùng V-ing: start playing." }
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

    // PART C. READING (4 questions - 2.0 pts)
    const readQuestions = [
      { q: "What is community service according to the passage?", opts: ["Voluntary work that helps people in need", "A paid job with high salary", "Playing video games indoors", "Doing homework alone"], correct: "Voluntary work that helps people in need", exp: "Thông tin câu đầu: 'Community service is voluntary work that helps improve our neighborhood and supports people in need.'" },
      { q: "What environmental activities do Vietnamese teenagers join?", opts: ["Planting trees and cleaning up plastic waste", "Cutting down forests", "Buying plastic bags", "Driving cars"], correct: "Planting trees and cleaning up plastic waste", exp: "Dẫn chứng: '...join green clubs to plant trees along public streets, clean up plastic waste...'" },
      { q: "What skills can students develop through volunteering?", opts: ["Teamwork, communication, and empathy", "Selfish habits", "Car racing skills", "Computer hacking"], correct: "Teamwork, communication, and empathy", exp: "Dẫn chứng: '...develop vital teamwork, communication skills, and empathy.'" },
      { q: "What is the best title for this passage?", opts: ["The Importance and Benefits of Volunteering", "How to Play Football", "Traveling Abroad in Summer", "The History of Computers"], correct: "The Importance and Benefits of Volunteering", exp: "Toàn bộ bài đọc nói về ý nghĩa và lợi ích thiết thực của các hoạt động thiện nguyện cộng đồng." }
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
      { text: "Rewrite the sentence beginning with 'She started...': <i>'She has played the piano for 5 years.'</i>", opts: ["She started playing the piano 5 years ago.", "She started play the piano for 5 years ago.", "She started playing the piano since 5 years.", "She start played the piano 5 years ago."], correct: "She started playing the piano 5 years ago.", exp: "Chuyển từ Hiện tại hoàn thành sang Quá khứ đơn (started + V-ing + time + ago)." },
      { text: "Rewrite using 'Unless': <i>'If you don't study hard, you will not pass the exam.'</i>", opts: ["Unless you study hard, you will pass the exam.", "Unless you study hard, you will fail the exam.", "Unless you don't study hard, you will pass.", "Unless study hard, you pass exam."], correct: "Unless you study hard, you will fail the exam.", exp: "Unless = If not. 'Unless you study hard, you will fail the exam'." },
      { text: "Rewrite using comparative structure: <i>'Cycling is healthier than traveling by car.'</i>", opts: ["Traveling by car is not as healthy as cycling.", "Traveling by car is healthier than cycling.", "Traveling by car is as healthy as cycling.", "Traveling by car is more healthier than cycling."], correct: "Traveling by car is not as healthy as cycling.", exp: "Cấu trúc so sánh không bằng: not as/so + adj + as." },
      { text: "Rearrange words to make a meaningful sentence: <i>[free / loves / time / in / Mai / her / books / reading].</i>", opts: ["Mai loves reading books in her free time.", "Mai reading loves books in her free time.", "In her free time loves Mai reading books.", "Mai loves in her free time reading books."], correct: "Mai loves reading books in her free time.", exp: "Cấu trúc: Chủ ngữ (Mai) + Động từ (loves reading books) + Trạng từ (in her free time)." }
    ];

    writeData.forEach(wd => {
      questions.push({
        part: 'D',
        partTitle: 'PART D. WRITING (2.0 points)',
        partInstruction: 'Choose the sentence that has the closest meaning or makes a correct sentence.',
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

      if (q.type === 'essay') {
        const words = (userAnswers[q.id] || '').trim().match(/\S+/g) || [];
        if (words.length >= 15) {
          correctCount++;
        }
      } else if (userAns === rightAns) {
        correctCount++;
      } else if (q.options) {
        const userIdx = q.options.findIndex(o => o.trim().toLowerCase() === userAns);
        const rightIdx = q.options.findIndex(o => o.trim().toLowerCase() === rightAns);
        if (userIdx !== -1 && userIdx === rightIdx) {
          correctCount++;
        } else if (q.correctLetter && userAns === q.correctLetter.toLowerCase()) {
          correctCount++;
        }
      }
    });

    const total = currentExam.questions.length;
    const scaledScore = Math.round((correctCount / total) * 100) / 10;

    let rankLevel = 'CAN_CO_GANG';
    if (scaledScore >= 9.0) rankLevel = 'XUAT_SAC';
    else if (scaledScore >= 8.0) rankLevel = 'GIOI';
    else if (scaledScore >= 6.5) rankLevel = 'KHA';
    else if (scaledScore >= 5.0) rankLevel = 'TRUNG_BINH';

    setScoreResult({
      score: correctCount,
      correctCount,
      total,
      rankLevel,
      scaledScore
    });
    setIsSubmitted(true);

    if (activeStudent) {
      studentGradebookService.saveExamResult(activeStudent.id, {
        examId: currentExam.examCode,
        examTitle: `${currentExam.typeTitle} - ${currentExam.examCode}`,
        examType: currentExam.examType,
        score: scaledScore,
        correctCount,
        totalQuestions: total,
        completedAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* FILTER TOP BAR */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-lg border border-blue-800/40">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-amber-400/20 px-2 py-0.5 rounded-md border border-amber-400/30">
                CHUẨN BỘ GD&ĐT (CV 7991)
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
                ĐỀ KIỂM TRA GIỮA KỲ & CUỐI KỲ ONLINE
              </h2>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs text-blue-200 block">Đầy đủ 4 kỹ năng:</span>
            <span className="text-xs font-bold text-amber-300">Nghe, Phát âm, Ngữ pháp, Đọc hiểu & Viết.</span>
          </div>
        </div>

        {/* Row 1: Chọn Khối Lớp */}
        <div className="space-y-3 pt-3 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
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

          {/* Row 2: Chọn Đợt Kiểm Tra & Mã Đề */}
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

            {/* Mã Đề Thi */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-emerald-300">
                {isOfficialMidterm ? `Chọn 1 trong 6 mã đề chuẩn (Khối ${selectedGrade}):` : 'Chọn 1 trong 10 mã đề:'}
              </span>
              <div className="flex items-center gap-1 flex-wrap">
                {isOfficialMidterm ? (
                  officialCodes.map((codeStr, idx) => (
                    <button
                      key={codeStr}
                      type="button"
                      onClick={() => setSelectedExamIndex(idx)}
                      className={`px-2.5 h-7 rounded-lg text-xs font-black transition cursor-pointer flex items-center justify-center ${
                        selectedExamIndex === idx
                          ? 'bg-emerald-400 text-slate-950 font-black scale-105 shadow-sm ring-2 ring-white/30'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      Mã {codeStr}
                    </button>
                  ))
                ) : (
                  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
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
                  ))
                )}
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
                {currentExam.typeTitle} — TIẾNG ANH LỚP {currentExam.grade} (GLOBAL SUCCESS)
              </h3>
              <div className="text-xs text-slate-500 mt-0.5">
                Thời gian làm bài: <strong>{currentExam.durationMinutes} phút</strong> | Cấu trúc: <strong>{currentExam.totalQuestions} câu {isOfficialMidterm ? '(36 trắc nghiệm + 1 tự luận viết)' : ''}</strong>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800">
                <span className="text-[11px] font-bold text-slate-500 block">MÃ ĐỀ THI</span>
                <span className="text-base font-black text-blue-600 dark:text-blue-400">{currentExam.examCode}</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedExamIndex(prev => (prev + 1) % (isOfficialMidterm ? officialCodes.length : 10))}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Đổi sang đề khác"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Đổi Đề Khác</span>
              </button>
            </div>
          </div>

          {/* Body các câu hỏi */}
          <div className="p-4 sm:p-6 space-y-6">
            {/* Audio Listening Bar if available */}
            {(currentExam.audioUrl || currentExam.audioScript) && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-slate-800 dark:to-slate-850 border border-sky-200 dark:border-sky-900 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center text-xl shadow-xs">
                    🎧
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-black text-sky-950 dark:text-sky-200">
                      Audio Bài Thi Nghe (Part 1 & Part 2) — Giọng Bản Ngữ Chuẩn US/UK
                    </div>
                    <div className="text-[11px] text-sky-700 dark:text-sky-400">
                      Quy chế phòng thi: Học sinh được bấm nghe tối đa 02 lần.
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleMainAudio(currentExam.audioUrl, currentExam.audioScript)}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {isPlayingMainAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlayingMainAudio ? 'Tạm Dừng Audio' : 'Bắt Đầu Nghe Audio'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAudioScript(prev => !prev)}
                    className="px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-700 hover:bg-white text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-600 transition cursor-pointer flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{showAudioScript ? 'Ẩn Script' : 'Xem Audio Script'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Audio Script collapsible box */}
            {showAudioScript && currentExam.audioScript && (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 whitespace-pre-line leading-relaxed">
                <div className="font-bold text-amber-950 dark:text-amber-300 mb-1 flex items-center gap-1">
                  <span>📜 Kịch bản Audio Script chính thức:</span>
                </div>
                {currentExam.audioScript}
              </div>
            )}

            {/* Reading Passage if general passage exists */}
            {currentExam.passageText && !isOfficialMidterm && (
              <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                <p className="font-bold text-blue-900 dark:text-blue-300 mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>ĐOẠN VĂN ĐỌC HIỂU (READING PASSAGE):</span>
                </p>
                <p className="italic">{currentExam.passageText}</p>
              </div>
            )}

            {/* Question List */}
            <div className="space-y-4">
              {currentExam.questions.map((q, idx) => {
                const userAns = (userAnswers[q.id] || '').trim().toLowerCase();
                const rightAns = (q.correct || '').trim().toLowerCase();

                let isCorrect = false;
                if (q.type === 'essay') {
                  const words = (userAnswers[q.id] || '').trim().match(/\S+/g) || [];
                  isCorrect = words.length >= 15;
                } else if (userAns === rightAns) {
                  isCorrect = true;
                } else if (q.options) {
                  const userIdx = q.options.findIndex(o => o.trim().toLowerCase() === userAns);
                  const rightIdx = q.options.findIndex(o => o.trim().toLowerCase() === rightAns);
                  if (userIdx !== -1 && userIdx === rightIdx) {
                    isCorrect = true;
                  } else if (q.correctLetter && userAns === q.correctLetter.toLowerCase()) {
                    isCorrect = true;
                  }
                }

                // Show section header if first question of section
                const isFirstOfPart = idx === 0 || currentExam.questions[idx - 1].partTitle !== q.partTitle;

                return (
                  <React.Fragment key={q.id}>
                    {isFirstOfPart && (
                      <div className="pt-3 pb-1 border-b-2 border-blue-600 dark:border-blue-400">
                        <div className="text-xs sm:text-sm font-black text-blue-900 dark:text-blue-300 uppercase">
                          {q.partTitle}
                        </div>
                        {q.passage && (
                          <div className="p-3.5 my-2.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
                            <span className="font-bold text-blue-900 dark:text-blue-300 block mb-1">📖 Đoạn văn đọc hiểu (Reading Passage):</span>
                            <p className="italic whitespace-pre-line">{q.passage}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div 
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

                      {/* Multiple choice options */}
                      {q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                          {q.options.map((opt, optIdx) => {
                            const letters = ['A', 'B', 'C', 'D'];
                            const letter = letters[optIdx] || 'A';
                            const isOptSelected = userAns === opt.trim().toLowerCase() || userAns === letter.toLowerCase();
                            const isOptRight = isSubmitted && (opt.trim().toLowerCase() === q.correct.toLowerCase() || (q.correctLetter && letter === q.correctLetter));

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

                      {/* Essay writing box */}
                      {q.type === 'essay' && (
                        <div className="mt-3 space-y-2">
                          <textarea
                            disabled={isSubmitted}
                            rows={4}
                            value={userAnswers[q.id] || ''}
                            onChange={(e) => handleSelectAnswer(q.id, e.target.value)}
                            placeholder="Nhập đoạn văn tiếng Anh của em vào đây (khoảng 50 - 60 từ)..."
                            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>Số từ đã viết: <b>{((userAnswers[q.id] || '').trim().match(/\S+/g) || []).length}</b> từ</span>
                            <span className="italic">Yêu cầu: Viết khoảng 50 - 60 từ</span>
                          </div>
                        </div>
                      )}

                      {/* Solution feedback */}
                      {isSubmitted && (
                        <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs leading-relaxed">
                          {isCorrect ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              ✓ Chính xác (+0.25đ)! {q.explanation}
                            </span>
                          ) : (
                            <span className="text-rose-600 dark:text-rose-400">
                              ✗ Chưa đúng! Đáp án chuẩn: <strong>{q.correctLetter ? `${q.correctLetter}. ` : ''}{q.correct}</strong>. ({q.explanation})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </React.Fragment>
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
                    onClick={() => setSelectedExamIndex(prev => (prev + 1) % (isOfficialMidterm ? officialCodes.length : 10))}
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
                {currentExam.sampleWriting && (
                  <div className="mt-3 p-3 text-left rounded-xl bg-white/10 text-xs leading-relaxed text-blue-100">
                    <span className="font-bold text-amber-300 block mb-1">📝 Đoạn văn mẫu tham khảo (Part 8 Writing):</span>
                    {currentExam.sampleWriting}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
