import React, { useState, useEffect } from 'react';
import {
  Award,
  BookOpen,
  Sparkles,
  Download,
  Trash2,
  PlusCircle,
  FileText,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldCheck,
  Lock,
  Upload,
  AlertCircle,
  Filter,
  Search,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { documentStorageService, StorageFileItem } from '../services/documentStorageService';
import { systemMaintenanceService } from '../services/systemMaintenanceService';

// Cấu trúc chuyên đề lý thuyết & câu hỏi thi HSG Tiếng Anh THCS
export interface HsgTheoryTopic {
  id: string;
  grade: number; // 6, 7, 8, 9
  topicCode: string;
  title: string;
  badge: string;
  summary: string;
  theoryContent: string[];
  keyRules: string[];
  sampleQuestions: {
    q: string;
    options: string[];
    answer: string;
    explanation: string;
  }[];
}

// Cấu trúc đề thi thử HSG online
export interface HsgPracticeExam {
  id: string;
  grade: number;
  title: string;
  timeMinutes: number;
  totalQuestions: number;
  description: string;
  questions: {
    id: string;
    part: string;
    q: string;
    options: string[];
    answer: string;
    explanation: string;
  }[];
}

// ==================== DỮ LIỆU LÝ THUYẾT ÔN THI HSG CHUẨN GDPT 2018 (THCS) ====================
export const INITIAL_HSG_TOPICS: HsgTheoryTopic[] = [
  {
    id: 'hsg-theory-inversion',
    grade: 9,
    topicCode: 'GRAM-01',
    title: 'Chuyên Đề Đảo Ngữ Nâng Cao (Inversion with Negative Adverbials)',
    badge: 'Chuyên Đề Bồi Dưỡng Lớp 8 - 9',
    summary: 'Quy tắc đảo trợ động từ lên trước chủ ngữ khi đứng đầu câu là các trạng từ phủ định, bán phủ định, điều kiện đảo ngữ.',
    theoryContent: [
      '1. Đảo ngữ với trạng từ phủ định: Never, Rarely, Seldom, Little, Hardly/Scarcely... when, No sooner... than.',
      '2. Đảo ngữ với Only: Only when, Only after, Only if, Only by + V-ing, Only then + Đảo trợ động từ.',
      '3. Đảo ngữ câu điều kiện: Loại 1 (Should + S + V), Loại 2 (Were + S / Were + S + to V), Loại 3 (Had + S + PII).',
      '4. Đảo ngữ với So/Such: So + Adj + be + S + that... / Such + be + Noun + that...'
    ],
    keyRules: [
      'Hardly had + S + PII + WHEN + S + V-ed (Vừa mới... thì...)',
      'No sooner had + S + PII + THAN + S + V-ed',
      'Not only + Aux + S + V + BUT ALSO + S + V',
      'Under no circumstances / On no account + Aux + S + V (Dù trong bất cứ trường hợp nào cũng không)'
    ],
    sampleQuestions: [
      {
        q: '______ had he entered the exam room than the listening test began.',
        options: ['A. Hardly', 'B. No sooner', 'C. Scarcely', 'D. Seldom'],
        answer: 'B',
        explanation: 'Cấu trúc No sooner had + S + PII + THAN + S + V-ed đi cùng từ nối "than".'
      },
      {
        q: '______ will students be allowed to submit test papers after the bell rings.',
        options: ['A. Under no circumstances', 'B. In no time', 'C. At no cost', 'D. On no way'],
        answer: 'A',
        explanation: 'Under no circumstances đảo ngữ mang nghĩa: "Trong bất kỳ hoàn cảnh nào cũng không được".'
      }
    ]
  },
  {
    id: 'hsg-theory-subjunctive',
    grade: 9,
    topicCode: 'GRAM-02',
    title: 'Câu Giả Định & Thể Giả Định Hiện Đại (Subjunctive Mood)',
    badge: 'Ngữ Pháp Nâng Cao HSG Cấp Tỉnh/Huyện',
    summary: 'Toàn bộ thể thức câu giả định với các động từ demand, suggest, insist, recommend và tính từ essential, vital, imperative.',
    theoryContent: [
      '1. Thể thức với động từ yêu cầu: S1 + suggest / demand / insist / recommend / order + that + S2 + (should) + V-nguyên thể.',
      '2. Thể thức với tính từ quan trọng: It is essential / necessary / important / vital / imperative + that + S + (should) + V-bare.',
      '3. Cấu trúc It is (high/about) time + S + V-ed / V2 (Đã đến lúc ai đó phải làm gì).',
      '4. Thể thức Would rather: S1 + would rather that + S2 + V-ed/P2 (Hiện tại) hoặc Had + PII (Quá khứ).'
    ],
    keyRules: [
      'Động từ trong mệnh đề "that" luôn ở dạng nguyên thể không "to" đối với mọi ngôi chủ ngữ (He, She, It vẫn giữ V-inf).',
      'Dạng phủ định: S + (should) + NOT + V-bare.',
      'Dạng bị động: S + (should) + BE + PII.'
    ],
    sampleQuestions: [
      {
        q: 'The headmaster suggested that every candidate ______ punctual on the competition day.',
        options: ['A. is', 'B. was', 'C. be', 'D. would be'],
        answer: 'C',
        explanation: 'Cấu trúc giả định thức S + suggest that + S + (should) be/V-bare.'
      },
      {
        q: 'It is high time we ______ practical steps to protect the local environment.',
        options: ['A. take', 'B. took', 'C. have taken', 'D. are taking'],
        answer: 'B',
        explanation: 'It is high time + S + V-ed/V2 diễn tả hành động lẽ ra đã phải làm ngay lúc này.'
      }
    ]
  },
  {
    id: 'hsg-theory-collocations-idioms',
    grade: 8,
    topicCode: 'VOCAB-03',
    title: 'Cụm Từ Cố Định & Thành Ngữ Thường Gặp (Collocations & Idioms)',
    badge: 'Từ Vựng Tinh Hoa Cấp THCS',
    summary: 'Hệ thống các thành ngữ (Idioms) và Collocations ăn điểm tuyệt đối trong các đề thi HSG cấp Trường, Huyện và Tỉnh.',
    theoryContent: [
      '1. Thành ngữ chỉ sự nỗ lực học tập: Burn the midnight oil (thức khuya học bài), Hit the books, Pass with flying colours.',
      '2. Thành ngữ chỉ cảm xúc & trạng thái: Over the moon, Down in the dumps, In seventh heaven, Under the weather.',
      '3. Collocations với Make & Do: Make an effort, Make headway, Make a difference; Do someone a favor, Do wonders, Do justice.',
      '4. Cặp từ ghép & Phrasal Verbs bẫy: Call off (hủy), Put off (hoãn), Look down on, Look up to, Come down with.'
    ],
    keyRules: [
      'To make ends meet = Xoay xở đủ sống trang trải gia đình.',
      'At the drop of a hat = Ngay lập tức, không do dự.',
      'A blessing in disguise = Trong cái rủi có cái may.'
    ],
    sampleQuestions: [
      {
        q: 'With exceptional determination and hard work, Mai passed the gifted school entrance exam with flying ______.',
        options: ['A. wings', 'B. marks', 'C. colours', 'D. flags'],
        answer: 'C',
        explanation: 'Thành ngữ "pass with flying colours" nghĩa là thi đỗ với kết quả vô cùng xuất sắc.'
      },
      {
        q: 'Before the final contest, the English teacher advised us to keep our ______ up and stay confident.',
        options: ['A. chin', 'B. head', 'C. face', 'D. mind'],
        answer: 'A',
        explanation: 'Thành ngữ "keep one\'s chin up" nghĩa là hãy luôn lạc quan, dũng cảm và tự tin.'
      }
    ]
  },
  {
    id: 'hsg-theory-word-formation',
    grade: 7,
    topicCode: 'WORD-04',
    title: 'Cấu Tạo Từ & Biến Đổi Dạng Từ Nâng Cao (Word Formation / Derivatives)',
    badge: 'Kỹ Năng Trọng Tâm Mọi Đề HSG',
    summary: 'Quy tắc nhận diện tiền tố (Prefixes) và hậu tố (Suffixes) để biến đổi từ gốc thành danh từ, tính từ, trạng từ hoặc động từ chính xác.',
    theoryContent: [
      '1. Tiền tố mang nghĩa phủ định / đối lập: un-, in-, im-, ir-, il-, dis-, mis-, non-.',
      '2. Hậu tố tạo Danh từ chỉ người (-er, -or, -ant, -ee, -ist) và chỉ khái niệm (-tion, -ment, -ance, -ity, -hood, -ship).',
      '3. Hậu tố tạo Tính từ: -able, -ible, -al, -ous, -ive, -ful, -less, -ic.',
      '4. Hậu tố tạo Động từ: -en (widen, shorten, sharpen), -ize / -ise (modernize, industrialize), -ify (beautify).'
    ],
    keyRules: [
      'Xác định từ loại còn thiếu: S + [Verb] + O, Sau giới từ cần V-ing/Noun, Giữa a/an/the và Noun là Adj.',
      'Lưu ý dạng phủ định theo ngữ cảnh: "care" -> careless (bất cẩn) / carefree (vô tư).',
      'Từ gốc "courage" -> encourage (động viên), discouragement (sự nản lòng), courageous (dũng cảm).'
    ],
    sampleQuestions: [
      {
        q: 'Technological innovations have ______ simplified communication among distant communities. (DRAMATIC)',
        options: ['A. dramatized', 'B. dramatically', 'C. dramatical', 'D. dramatic'],
        answer: 'B',
        explanation: 'Cần một trạng từ (Adverb) đứng giữa trợ động từ "have" và động từ "simplified" để bổ nghĩa cho động từ.'
      },
      {
        q: 'His unexpected dismissal from the school team was a great ______ to his parents. (APPOINT)',
        options: ['A. disappointment', 'B. disappointing', 'C. disappointed', 'D. appointive'],
        answer: 'A',
        explanation: 'Sau cụm "a great" cần một danh từ (Noun) mang nghĩa sự thất vọng: "disappointment".'
      }
    ]
  }
];

// ==================== BỘ ĐỀ THI THỬ HSG TIẾNG ANH THCS MẪU ====================
export const INITIAL_HSG_EXAMS: HsgPracticeExam[] = [
  {
    id: 'hsg-exam-thcs-01',
    grade: 9,
    title: 'Đề Thi Thử HSG Tiếng Anh Lớp 9 - Đề Số 01 (Cấu Trúc Chuẩn Phòng GD&ĐT)',
    timeMinutes: 60,
    totalQuestions: 15,
    description: 'Bao gồm phần Ngữ âm nâng cao, Trọng âm, Ngữ pháp chuyên sâu, Thành ngữ, Đọc hiểu và Viết lại câu không đổi nghĩa.',
    questions: [
      {
        id: 'q1',
        part: 'PHONETICS & STRESS',
        q: 'Choose the word whose underlined part is pronounced differently from the others:',
        options: ['A. breath', 'B. breathe', 'C. thank', 'D. threat'],
        answer: 'B',
        explanation: 'Từ "breathe" phát âm âm /ð/, các từ còn lại phát âm âm /θ/.'
      },
      {
        id: 'q2',
        part: 'PHONETICS & STRESS',
        q: 'Choose the word whose primary stress is positioned differently from that of the others:',
        options: ['A. economic', 'B. photography', 'C. advantageous', 'D. entertaining'],
        answer: 'B',
        explanation: '"photography" trọng âm rơi vào âm tiết thứ 2 /fəˈtɒɡrəfi/, các từ còn lại rơi vào âm tiết thứ 3.'
      },
      {
        id: 'q3',
        part: 'LEXICO-GRAMMAR',
        q: 'By the time the medical team arrived at the venue, the injured athlete ______ first aid.',
        options: ['A. was given', 'B. had already been given', 'C. has been given', 'D. gave'],
        answer: 'B',
        explanation: 'By the time + QKĐ, mệnh đề chính dùng Quá khứ hoàn thành ở thể bị động: had already been given.'
      },
      {
        id: 'q4',
        part: 'LEXICO-GRAMMAR',
        q: 'Rarely ______ so much courage and resilience in the face of such adversity.',
        options: ['A. has an individual shown', 'B. an individual has shown', 'C. did an individual showed', 'D. has shown an individual'],
        answer: 'A',
        explanation: 'Đảo ngữ với Rarely đứng đầu câu: Rarely + Aux + S + V-PII.'
      },
      {
        id: 'q5',
        part: 'LEXICO-GRAMMAR',
        q: 'The principal insisted that the school library ______ open during the weekend for exam preparation.',
        options: ['A. remains', 'B. remained', 'C. remain', 'D. will remain'],
        answer: 'C',
        explanation: 'Thể giả định thức với insist that + S + (should) + V-bare.'
      },
      {
        id: 'q6',
        part: 'IDIOMS & COLLOCATIONS',
        q: 'I decided to take the bull by the ______ and resolve the misunderstanding immediately.',
        options: ['A. ears', 'B. horns', 'C. tail', 'D. eyes'],
        answer: 'B',
        explanation: 'Thành ngữ "take the bull by the horns" = Trực diện đối mặt và giải quyết vấn đề khó khăn.'
      },
      {
        id: 'q7',
        part: 'IDIOMS & COLLOCATIONS',
        q: 'Although the initial interview was challenging, it turned out to be a ______ in disguise.',
        options: ['A. luck', 'B. benefit', 'C. fortune', 'D. blessing'],
        answer: 'D',
        explanation: 'Thành ngữ "a blessing in disguise" = trong cái rủi có cái may.'
      },
      {
        id: 'q8',
        part: 'WORD FORMATION',
        q: 'Deforestation is one of the primary causes of environmental ______ worldwide. (GRADE)',
        options: ['A. degradation', 'B. degrading', 'C. gradualness', 'D. upgrade'],
        answer: 'A',
        explanation: 'Environmental degradation = Sự suy thoái môi trường.'
      },
      {
        id: 'q9',
        part: 'READING COMPREHENSION',
        q: 'According to modern educational research, autonomous learners tend to ______ academic objectives more consistently.',
        options: ['A. accomplish', 'B. abandon', 'C. misunderstand', 'D. deteriorate'],
        answer: 'A',
        explanation: '"Accomplish academic objectives" nghĩa là hoàn thành các mục tiêu học tập.'
      },
      {
        id: 'q10',
        part: 'SENTENCE TRANSFORMATION',
        q: '"If you do not practice English daily, you cannot master fluency." Choose the sentence closest in meaning:',
        options: [
          'A. Only by practicing English daily can you master fluency.',
          'B. Hardly do you practice English daily when you master fluency.',
          'C. Should you practice English daily, you cannot master fluency.',
          'D. Were you not to practice English daily, you will master fluency.'
        ],
        answer: 'A',
        explanation: 'Cấu trúc viết lại câu đảo ngữ: Only by + V-ing + Aux + S + V.'
      }
    ]
  },
  {
    id: 'hsg-exam-thcs-02',
    grade: 8,
    title: 'Đề Thi Thử HSG Tiếng Anh Lớp 8 - Đề Số 02 (Chuyên Sâu Từ Vựng & Ngữ Pháp)',
    timeMinutes: 45,
    totalQuestions: 10,
    description: 'Chuyên đề bồi dưỡng học sinh mũi nhọn lớp 8 bám sát chương trình Giáo dục Phổ thông mới.',
    questions: [
      {
        id: 'q1',
        part: 'PHONETICS',
        q: 'Choose the word that has different stress pattern from the rest:',
        options: ['A. volunteer', 'B. understand', 'C. contribute', 'D. entertain'],
        answer: 'C',
        explanation: 'contribute trọng âm rơi vào âm tiết thứ 2 /kənˈtrɪbjuːt/, các từ còn lại trọng âm thứ 3.'
      },
      {
        id: 'q2',
        part: 'GRAMMAR',
        q: 'Neither the class monitor nor his classmates ______ aware of the schedule revision.',
        options: ['A. was', 'B. were', 'C. has been', 'D. is'],
        answer: 'B',
        explanation: 'Neither S1 nor S2 + Verb chia theo S2 (his classmates số nhiều -> were).'
      },
      {
        id: 'q3',
        part: 'VOCABULARY',
        q: 'The community campaign made a remarkable ______ to the reduction of plastic waste.',
        options: ['A. contribution', 'B. distraction', 'C. replacement', 'D. destruction'],
        answer: 'A',
        explanation: 'Cụm từ "make a contribution to" = Đóng góp vào.'
      },
      {
        id: 'q4',
        part: 'INVERSION',
        q: 'No sooner ______ home than the heavy rain started pouring.',
        options: ['A. had we arrived', 'B. we arrived', 'C. did we arrive', 'D. have we arrived'],
        answer: 'A',
        explanation: 'No sooner had + S + PII + than + QKĐ.'
      },
      {
        id: 'q5',
        part: 'IDIOMS',
        q: 'To prepare thoroughly for the upcoming gifted student contest, Minh has been burning the ______ oil.',
        options: ['A. morning', 'B. evening', 'C. midnight', 'D. daylight'],
        answer: 'C',
        explanation: 'Burn the midnight oil = Thức khuya miệt mài học tập.'
      }
    ]
  }
];

export const HsgEnglishPreparationPortal: React.FC = () => {
  // Quản lý Tab bên trong: Lý thuyết & Chuyên đề vs Thi Thử Online vs Thư viện Tài liệu HSG
  const [subTab, setSubTab] = useState<'theory' | 'online_exam' | 'docs'>('theory');

  // Quản lý danh sách Chuyên đề lý thuyết (Lưu trong localStorage)
  const [topics, setTopics] = useState<HsgTheoryTopic[]>(() => {
    try {
      const saved = localStorage.getItem('gvai_hsg_theory_topics');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_HSG_TOPICS;
  });

  // Quản lý bộ đề thi thử HSG (Lưu trong localStorage)
  const [exams, setExams] = useState<HsgPracticeExam[]>(() => {
    try {
      const saved = localStorage.getItem('gvai_hsg_practice_exams');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_HSG_EXAMS;
  });

  // State lọc Chuyên đề theo khối lớp
  const [gradeFilter, setGradeFilter] = useState<number>(0); // 0 = Tất cả
  const [selectedTopic, setSelectedTopic] = useState<HsgTheoryTopic | null>(null);

  // State Làm Bài Thi Thử Online
  const [activeExam, setActiveExam] = useState<HsgPracticeExam | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isExamSubmitted, setIsExamSubmitted] = useState<boolean>(false);
  const [examScore, setExamScore] = useState<{
    correct: number;
    total: number;
    scaled: number;
  } | null>(null);

  // Quản lý Quyền Admin
  const [isAdmin, setIsAdmin] = useState<boolean>(() => systemMaintenanceService.isSessionAuthenticated());
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);
  const [adminPin, setAdminPin] = useState<string>('');
  const [adminError, setAdminError] = useState<string>('');

  // Modal Thêm Chuyên Đề / Đề Thi Mới (Dành cho Admin)
  const [showAddTopicModal, setShowAddTopicModal] = useState<boolean>(false);
  const [newTopicGrade, setNewTopicGrade] = useState<number>(9);
  const [newTopicTitle, setNewTopicTitle] = useState<string>('');
  const [newTopicSummary, setNewTopicSummary] = useState<string>('');
  const [newTopicTheory, setNewTopicTheory] = useState<string>('');
  const [newTopicRules, setNewTopicRules] = useState<string>('');

  // Đọc danh sách tài liệu từ Document Storage
  const [hsgDocList, setHsgDocList] = useState<StorageFileItem[]>([]);

  const reloadHsgDocs = () => {
    try {
      const allFiles = documentStorageService.getFiles();
      // Lọc các file có tên hoặc mô tả liên quan tới HSG, Đề thi, Ôn tập
      const filtered = allFiles.filter(f => 
        f.name.toLowerCase().includes('hsg') || 
        f.name.toLowerCase().includes('học sinh giỏi') ||
        (f.description && f.description.toLowerCase().includes('hsg')) ||
        f.folderId === 'folder-de-kiem-tra-ma-tran'
      );
      setHsgDocList(filtered.length > 0 ? filtered : allFiles.slice(0, 6));
    } catch (e) {
      console.warn('Lỗi tải tài liệu HSG:', e);
    }
  };

  useEffect(() => {
    reloadHsgDocs();
    setIsAdmin(systemMaintenanceService.isSessionAuthenticated());
    if (topics.length > 0 && !selectedTopic) {
      setSelectedTopic(topics[0]);
    }
    if (exams.length > 0 && !activeExam) {
      setActiveExam(exams[0]);
    }
  }, []);

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (systemMaintenanceService.verifyAdminPassword(adminPin)) {
      systemMaintenanceService.saveAdminSession();
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPin('');
      setAdminError('');
      alert('Đăng nhập Quản trị viên thành công! Bạn có quyền thêm, chỉnh sửa và xóa tài liệu / chuyên đề HSG.');
    } else {
      setAdminError('Mật khẩu Admin không đúng! Mật khẩu chuẩn: Tienganh123@');
    }
  };

  // Thêm Chuyên Đề Mới (Admin)
  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim()) {
      alert('Vui lòng nhập tiêu đề chuyên đề!');
      return;
    }

    const newTopic: HsgTheoryTopic = {
      id: `hsg-topic-${Date.now()}`,
      grade: newTopicGrade,
      topicCode: `HSG-${newTopicGrade}-${Math.floor(10 + Math.random() * 90)}`,
      title: newTopicTitle.trim(),
      badge: `Chuyên Đề Lớp ${newTopicGrade} Do Admin Bổ Sung`,
      summary: newTopicSummary.trim() || 'Tài liệu bồi dưỡng học sinh giỏi Tiếng Anh THCS.',
      theoryContent: newTopicTheory.split('\n').filter(l => l.trim()),
      keyRules: newTopicRules.split('\n').filter(l => l.trim()),
      sampleQuestions: []
    };

    const updated = [newTopic, ...topics];
    setTopics(updated);
    try {
      localStorage.setItem('gvai_hsg_theory_topics', JSON.stringify(updated));
    } catch (err) {}

    setSelectedTopic(newTopic);
    setShowAddTopicModal(false);
    setNewTopicTitle('');
    setNewTopicSummary('');
    setNewTopicTheory('');
    setNewTopicRules('');
    alert('Đã bổ sung Chuyên đề Ôn thi HSG thành công!');
  };

  // Xóa Chuyên Đề (Admin)
  const handleDeleteTopic = (topicId: string) => {
    if (!isAdmin) {
      setShowAdminLogin(true);
      return;
    }
    if (window.confirm('Bạn có chắc chắn muốn xóa chuyên đề này khỏi hệ thống?')) {
      const updated = topics.filter(t => t.id !== topicId);
      setTopics(updated);
      try {
        localStorage.setItem('gvai_hsg_theory_topics', JSON.stringify(updated));
      } catch (err) {}
      if (selectedTopic?.id === topicId) {
        setSelectedTopic(updated[0] || null);
      }
      alert('Đã xóa chuyên đề thành công!');
    }
  };

  // Xử lý nộp bài thi thử online
  const handleSubmitExam = () => {
    if (!activeExam) return;
    let correct = 0;
    activeExam.questions.forEach(q => {
      if (userAnswers[q.id] === q.answer) {
        correct++;
      }
    });

    const scaled = Number(((correct / activeExam.questions.length) * 10).toFixed(2));
    setExamScore({
      correct,
      total: activeExam.questions.length,
      scaled
    });
    setIsExamSubmitted(true);
  };

  // Làm lại bài thi
  const handleResetExam = () => {
    setUserAnswers({});
    setIsExamSubmitted(false);
    setExamScore(null);
  };

  // Xóa tài liệu HSG (Admin)
  const handleDeleteHsgDoc = (file: StorageFileItem) => {
    if (!isAdmin) {
      setShowAdminLogin(true);
      return;
    }
    if (window.confirm(`Bạn có chắc muốn xóa tài liệu "${file.name}"?`)) {
      documentStorageService.deleteFile(file.id);
      reloadHsgDocs();
      alert('Đã xóa tài liệu thành công!');
    }
  };

  // Admin upload file tài liệu HSG
  const handleUploadHsgDoc = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (!isAdmin) {
      setShowAdminLogin(true);
      return;
    }

    try {
      for (let i = 0; i < files.length; i++) {
        await documentStorageService.uploadFile(
          'folder-de-kiem-tra-ma-tran',
          files[i],
          'Tài liệu bồi dưỡng và đề thi HSG Tiếng Anh THCS',
          'Admin Quản Trị'
        );
      }
      reloadHsgDocs();
      alert(`Đã tải lên ${files.length} tài liệu ôn thi HSG thành công!`);
      e.target.value = '';
    } catch (err: any) {
      alert('Lỗi tải tệp: ' + (err?.message || 'Không thể lưu tệp'));
    }
  };

  const filteredTopics = gradeFilter === 0 ? topics : topics.filter(t => t.grade === gradeFilter);

  return (
    <div className="space-y-4">
      {/* ==================== BANNER ĐỈNH PHÂN HỆ ÔN THI HSG ==================== */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white p-5 rounded-3xl border border-indigo-700/50 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Chương Trình Bồi Dưỡng Học Sinh Mũi Nhọn THCS (Lớp 6 - 9)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <span>🏆 Phân Hệ Ôn Thi Học Sinh Giỏi Tiếng Anh THCS</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Trang bị lý thuyết ngữ pháp chuyên sâu, bài tập trắc nghiệm tự soạn làm online chấm điểm tức thì, ngân hàng đề thi thử cấp Trường, Huyện và Tỉnh tải về miễn phí.
            </p>
          </div>

          {/* Nút Quyền Admin */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-black">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Quyền Admin</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddTopicModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Thêm Chuyên Đề Mới</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAdminLogin(true)}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>Quản Trị Admin</span>
              </button>
            )}
          </div>
        </div>

        {/* Thanh Điều Hướng 3 Phân Mục: Lý Thuyết - Làm Đề Online - Tài Liệu Tải Về */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/10 flex-wrap">
          <button
            type="button"
            onClick={() => setSubTab('theory')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 cursor-pointer ${
              subTab === 'theory'
                ? 'bg-amber-400 text-slate-950 shadow-lg'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Lý Thuyết & Chuyên Đề Tinh Hoa</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('online_exam')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 cursor-pointer ${
              subTab === 'online_exam'
                ? 'bg-amber-400 text-slate-950 shadow-lg'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>2. Làm Đề Thi Thử HSG Online (Tự Soạn)</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('docs')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 cursor-pointer ${
              subTab === 'docs'
                ? 'bg-amber-400 text-slate-950 shadow-lg'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>3. Kho Đề & Tài Liệu HSG Tải Về ({hsgDocList.length})</span>
          </button>
        </div>
      </div>

      {/* ==================== PHÂN MỤC 1: LÝ THUYẾT & CHUYÊN ĐỀ ==================== */}
      {subTab === 'theory' && (
        <div className="space-y-4">
          {/* Lọc Khối Lớp */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                <span>Chọn khối lớp ôn luyện:</span>
              </span>
              {[
                { label: 'Tất cả khối lớp', val: 0 },
                { label: 'Lớp 6 HSG', val: 6 },
                { label: 'Lớp 7 HSG', val: 7 },
                { label: 'Lớp 8 HSG', val: 8 },
                { label: 'Lớp 9 HSG (Vào 10 Chuyên)', val: 9 }
              ].map(item => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setGradeFilter(item.val)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    gradeFilter === item.val
                      ? 'bg-blue-600 text-white shadow-xs font-black'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500 font-medium">
              Đang hiển thị <strong>{filteredTopics.length}</strong> chuyên đề lý thuyết
            </span>
          </div>

          {/* Giao diện 2 cột: Danh sách chuyên đề (trái) & Chi tiết nội dung (phải) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Cột trái: Danh mục chuyên đề */}
            <div className="lg:col-span-5 space-y-3">
              {filteredTopics.map(topic => (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                    selectedTopic?.id === topic.id
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 dark:border-blue-700 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-mono font-bold text-[10px]">
                        {topic.topicCode}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                        Lớp {topic.grade}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900 dark:text-white line-clamp-2 mb-1">
                      {topic.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {topic.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">
                      {topic.theoryContent.length} mục lý thuyết • {topic.keyRules.length} quy tắc vàng
                    </span>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTopic(topic.id);
                        }}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                        title="Xóa chuyên đề này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Cột phải: Khung đọc lý thuyết chuyên sâu */}
            <div className="lg:col-span-7">
              {selectedTopic ? (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                  {/* Tiêu đề & Thông tin chuyên đề */}
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-black text-xs">
                        LỚP {selectedTopic.grade}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500">
                        MÃ: {selectedTopic.topicCode}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                      {selectedTopic.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {selectedTopic.summary}
                    </p>
                  </div>

                  {/* Phần 1: Khung Lý Thuyết Trọng Tâm */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-black text-blue-700 dark:text-blue-400 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Hệ Thống Lý Thuyết & Bản Chất Ngữ Pháp</span>
                    </h4>
                    <div className="space-y-2.5 bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                      {selectedTopic.theoryContent.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-2" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phần 2: Quy Tắc Vàng & Cấu Trúc Bất Hủ */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-black text-amber-600 dark:text-amber-400 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Quy Tắc Vàng Ăn Điểm Tuyệt Đối Trong Bài Thi</span>
                    </h4>
                    <div className="space-y-2 bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 text-xs sm:text-sm text-slate-900 dark:text-amber-100 font-mono">
                      {selectedTopic.keyRules.map((rule, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-900/30 flex items-center gap-2">
                          <span className="text-amber-600 font-bold shrink-0">★</span>
                          <span>{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phần 3: Bài Tập Vận Dụng Mẫu Có Lời Giải */}
                  {selectedTopic.sampleQuestions.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Bài Tập Vận Dụng Trọng Tâm Đề Thi HSG</span>
                      </h4>
                      <div className="space-y-3">
                        {selectedTopic.sampleQuestions.map((q, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs space-y-2">
                            <p className="font-bold text-slate-900 dark:text-white text-sm">
                              Câu {idx + 1}: {q.q}
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {q.options.map((opt, optIdx) => (
                                <div key={optIdx} className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                                  {opt}
                                </div>
                              ))}
                            </div>
                            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                              <span className="font-bold">Đáp án chuẩn: {q.answer}</span> — {q.explanation}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
                  <BookOpen className="w-10 h-10 mb-2 opacity-40" />
                  <p className="text-sm">Vui lòng chọn một chuyên đề bên trái để xem lý thuyết chi tiết</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== PHÂN MỤC 2: LÀM ĐỀ THI THỬ ONLINE (TỰ SOẠN) ==================== */}
      {subTab === 'online_exam' && activeExam && (
        <div className="space-y-4">
          {/* Header Đề Thi Đang Chọn */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-black text-xs">
                  LỚP {activeExam.grade} HSG
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  Thời gian: {activeExam.timeMinutes} phút • {activeExam.questions.length} câu hỏi
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {activeExam.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeExam.description}
              </p>
            </div>

            {/* Nút chọn đổi đề thi khác */}
            <div className="flex items-center gap-2">
              <select
                value={activeExam.id}
                onChange={(e) => {
                  const found = exams.find(ex => ex.id === e.target.value);
                  if (found) {
                    setActiveExam(found);
                    handleResetExam();
                  }
                }}
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
              >
                {exams.map(ex => (
                  <option key={ex.id} value={ex.id}>
                    {ex.title}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleResetExam}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                title="Làm lại từ đầu"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm lại</span>
              </button>
            </div>
          </div>

          {/* Khung kết quả thi nếu đã nộp bài */}
          {isExamSubmitted && examScore && (
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-black flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Kết Quả Bài Thi Thử HSG Online: {examScore.scaled}/10 Điểm</span>
                </h4>
                <p className="text-xs text-emerald-100 mt-1">
                  Đúng {examScore.correct}/{examScore.total} câu ({((examScore.correct / examScore.total) * 100).toFixed(0)}%). Hệ thống đã hiển thị chi tiết đáp án và lời giải giải thích bên dưới từng câu.
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetExam}
                className="px-4 py-2 rounded-xl bg-white text-emerald-950 font-black text-xs shadow hover:bg-emerald-50 transition cursor-pointer self-start sm:self-auto"
              >
                Làm Lại Đề Này
              </button>
            </div>
          )}

          {/* Danh sách câu hỏi thi thử */}
          <div className="space-y-4">
            {activeExam.questions.map((q, idx) => {
              const selectedAns = userAnswers[q.id];
              const isCorrect = isExamSubmitted && selectedAns === q.answer;
              const isWrong = isExamSubmitted && selectedAns && selectedAns !== q.answer;

              return (
                <div
                  key={q.id}
                  className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border transition ${
                    isExamSubmitted
                      ? isCorrect
                        ? 'border-emerald-500/60 bg-emerald-50/20 dark:bg-emerald-950/20'
                        : isWrong
                        ? 'border-rose-500/60 bg-rose-50/20 dark:bg-rose-950/20'
                        : 'border-slate-200 dark:border-slate-800'
                      : 'border-slate-200 dark:border-slate-800 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-600 dark:text-slate-400">
                      CÂU {idx + 1} • {q.part}
                    </span>
                    {isExamSubmitted && (
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                        isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                      }`}>
                        {isCorrect ? '✓ Đúng (+1.0đ)' : '✗ Chưa chính xác'}
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-bold text-slate-900 dark:text-white mb-3 leading-relaxed">
                    {q.q}
                  </p>

                  {/* Lựa chọn 4 đáp án */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map(opt => {
                      const letter = opt.substring(0, 1);
                      const isOptionSelected = selectedAns === letter;
                      const isOptionCorrect = isExamSubmitted && q.answer === letter;

                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={isExamSubmitted}
                          onClick={() => {
                            setUserAnswers(prev => ({ ...prev, [q.id]: letter }));
                          }}
                          className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition cursor-pointer flex items-center justify-between ${
                            isOptionCorrect
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold'
                              : isOptionSelected
                              ? isExamSubmitted
                                ? 'bg-rose-100 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200 font-bold'
                                : 'bg-blue-50 dark:bg-blue-950 border-blue-600 text-blue-900 dark:text-blue-100 font-bold shadow-xs'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <span>{opt}</span>
                          {isOptionCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                          {isExamSubmitted && isOptionSelected && !isOptionCorrect && (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Lời giải chi tiết sau khi nộp bài */}
                  {isExamSubmitted && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                      <p className="font-bold text-blue-700 dark:text-blue-300">
                        Đáp án đúng: {q.answer}
                      </p>
                      <p className="text-slate-600 dark:text-slate-300">
                        <strong>Giải thích:</strong> {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Thanh Nộp Bài Dưới Cùng */}
          {!isExamSubmitted && (
            <div className="sticky bottom-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                Đã hoàn thành <strong>{Object.keys(userAnswers).length}/{activeExam.questions.length}</strong> câu hỏi
              </span>

              <button
                type="button"
                onClick={handleSubmitExam}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm shadow-md transition cursor-pointer flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>Nộp Bài Chấm Điểm Ngay</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================== PHÂN MỤC 3: KHO TÀI LIỆU & ĐỀ THI HSG TẢI VỀ ==================== */}
      {subTab === 'docs' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600" />
                <span>Kho Đề Thi & Chuyên Đề Bồi Dưỡng HSG Tải Về Miễn Phí</span>
              </h3>
              <p className="text-xs text-slate-500">
                Giáo viên và học sinh tải về ôn tập tại nhà. Admin có quyền tải lên thêm và xóa tài liệu.
              </p>
            </div>

            {/* Quyền upload tài liệu cho Admin */}
            {isAdmin ? (
              <label className="cursor-pointer px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto">
                <Upload className="w-4 h-4" />
                <span>Đưa Tài Liệu Lên</span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleUploadHsgDoc}
                />
              </label>
            ) : (
              <button
                type="button"
                onClick={() => setShowAdminLogin(true)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 cursor-pointer self-start sm:self-auto"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>Quản Trị Admin</span>
              </button>
            )}
          </div>

          {/* Lưới các file tải về */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hsgDocList.map(item => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold border border-blue-200 dark:border-blue-800 uppercase">
                      {item.fileType || 'DOCX'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-400 font-bold">
                      {item.size ? (item.size > 1024 * 1024 ? `${(item.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(item.size / 1024))} KB`) : 'Tài liệu chuẩn'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mb-1.5" title={item.name}>
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                    {item.description || 'Tài liệu bồi dưỡng học sinh giỏi và ôn luyện thi vào 10 chuyên môn Tiếng Anh.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => documentStorageService.downloadFile(item)}
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải về miễn phí</span>
                  </button>

                  {isAdmin && !item.id.startsWith('app-') && !item.id.startsWith('tool-') && (
                    <button
                      type="button"
                      onClick={() => handleDeleteHsgDoc(item)}
                      title="Xóa tài liệu (Quyền Admin)"
                      className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-900/60 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== MODAL ĐĂNG NHẬP ADMIN ==================== */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative">
            <button
              onClick={() => setShowAdminLogin(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900 dark:text-white">Xác Thực Quyền Admin</h4>
                <p className="text-xs text-slate-500">Dành cho Giáo viên & Quản trị viên thêm/xóa tài liệu HSG</p>
              </div>
            </div>

            <form onSubmit={handleAdminAuth} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Mật khẩu Quản trị Admin:
                </label>
                <input
                  type="password"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="Nhập mật khẩu Admin..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-hidden font-mono"
                  autoFocus
                />
                {adminError && (
                  <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{adminError}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminLogin(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-xs transition cursor-pointer"
                >
                  Xác Nhận Quyền Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL THÊM CHUYÊN ĐỀ MỚI (ADMIN) ==================== */}
      {showAddTopicModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddTopicModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900 dark:text-white">Bổ Sung Chuyên Đề HSG Mới</h4>
                <p className="text-xs text-slate-500">Soạn và đưa chuyên đề lý thuyết vào hệ thống để học sinh ôn tập</p>
              </div>
            </div>

            <form onSubmit={handleCreateTopic} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Khối Lớp:</label>
                  <select
                    value={newTopicGrade}
                    onChange={(e) => setNewTopicGrade(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value={6}>Lớp 6</option>
                    <option value={7}>Lớp 7</option>
                    <option value={8}>Lớp 8</option>
                    <option value={9}>Lớp 9 (Vào 10 Chuyên)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tên Chuyên Đề (*):</label>
                  <input
                    type="text"
                    required
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    placeholder="VD: Chuyên đề Đảo Ngữ, Câu Chẻ Cleft Sentence..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tóm Tắt Mục Tiêu:</label>
                <input
                  type="text"
                  value={newTopicSummary}
                  onChange={(e) => setNewTopicSummary(e.target.value)}
                  placeholder="Mục tiêu kiến thức đạt được trong đề thi HSG..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nội Dung Lý Thuyết (Mỗi dòng là một ý):
                </label>
                <textarea
                  rows={4}
                  value={newTopicTheory}
                  onChange={(e) => setNewTopicTheory(e.target.value)}
                  placeholder="1. Định nghĩa và cách sử dụng...&#10;2. Công thức cấu tạo...&#10;3. Các trường hợp đặc biệt..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-sans"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Quy Tắc Vàng / Công Thức Ăn Điểm (Mỗi dòng một công thức):
                </label>
                <textarea
                  rows={3}
                  value={newTopicRules}
                  onChange={(e) => setNewTopicRules(e.target.value)}
                  placeholder="Công thức 1: Hardly had + S + PII + when...&#10;Công thức 2: Not only + Aux + S + V..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTopicModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-xs transition cursor-pointer"
                >
                  Lưu & Đưa Lên Hệ Thống
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
