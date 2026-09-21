// ==============================================================================
// THẦY GIÁO ĐINH VĂN THÀNH - CÔNG CỤ TẠO ĐỀ KIỂM TRA TIẾNG ANH THCS (CV 7991)
// ENGINE SINH ĐỀ ĐỘNG NGẪU NHIÊN 100% CHUẨN MẪU DESKTOP VÀ WORD ADD-IN
// ==============================================================================

export interface ExamQuestionMcq {
  num: string;
  stem: string;
  options: string[];
  correctAnswer?: string;
  correctLetter?: string;
}

export interface ExamPart {
  title: string;
  points: string;
  intro?: string;
  passage?: string;
  questions: ExamQuestionMcq[];
}

export interface ExamSuiteData {
  code1: string;
  code2: string;
  grade: string;
  term: string;
  termTitle: string;
  schoolYear: string;
  parentAgency: string;
  schoolName: string;
  timeMinutes: number;
  hasSpeaking: boolean;
  
  // Matrix & Spec
  matrixSubtitle: string;
  matrixHeaders: string[];
  matrixRows: string[][];
  
  specSubtitle: string;
  specHeaders: string[];
  specRows: string[][];

  // Exam Code 1
  examCode1: {
    code: string;
    parts: ExamPart[];
    writingPrompt: string;
    writingCues: string;
  };

  // Exam Code 2 (Hoán vị)
  examCode2: {
    code: string;
    parts: ExamPart[];
    writingPrompt: string;
    writingCues: string;
  };

  // Answers & Rubric
  audioDialogue: [string, string][];
  audioMonologue: string;
  mcqTotalPts: string;
  answerRows: {
    col1Num: string;
    col1Ans: string;
    col2Num: string;
    col2Ans: string;
  }[];
  writingRubric: string[];
  sampleWriting: string;
  speakingRows: [string, string, string, string][];
  scoreSummary: string;
}

// NGÂN HÀNG CÂU HỎI MỞ RỘNG CHO CÁC KHỐI LỚP (GRADE 6, 7, 8, 9)
// Trích xuất 100% chuẩn xác từ dynamic_exam_engine.py & exam_catalog_generator.py
export const QUESTION_BANKS: Record<string, {
  phonetics: [string, string[], string][];
  language: [string, string[], string][];
}> = {
  '6': {
    phonetics: [
      ["help<u>ed</u>, cook<u>ed</u>, play<u>ed</u>", ["played", "helped", "cooked"], "played"],
      ["book<u>s</u>, cat<u>s</u>, dog<u>s</u>", ["dogs", "books", "cats"], "dogs"],
      ["watch<u>es</u>, class<u>es</u>, appl<u>es</u>", ["apples", "watches", "classes"], "apples"],
      ["want<u>ed</u>, decid<u>ed</u>, walk<u>ed</u>", ["walked", "wanted", "decided"], "walked"],
      ["c<u>i</u>ty, l<u>i</u>ke, b<u>i</u>cycle", ["like", "city", "bicycle"], "like"],
      ["sch<u>oo</u>l, f<u>oo</u>t, b<u>oo</u>k", ["school", "foot", "book"], "school"],
      ["t<u>ea</u>cher, cl<u>ea</u>n, h<u>ea</u>d", ["head", "teacher", "clean"], "head"],
      ["th<u>i</u>nk, th<u>a</u>nk, th<u>e</u>re", ["there", "think", "thank"], "there"]
    ],
    language: [
      ["My new school ________ a large green library.", ["has", "have", "having"], "has"],
      ["Students ________ wear uniform on Mondays and Thursdays.", ["must", "can't", "needn't"], "must"],
      ["Listen! The birds ________ happily in the trees.", ["are singing", "sing", "sang"], "are singing"],
      ["Da Nang is ________ than Hai Phong.", ["more modern", "modern", "most modern"], "more modern"],
      ["There ________ any milk left in the fridge.", ["isn't", "is", "aren't"], "isn't"],
      ["Turn off the lights ________ saving electricity.", ["to", "for", "so that"], "to"],
      ["How ________ hours do you sleep every night?", ["many", "much", "often"], "many"],
      ["We ________ to Cuc Phuong National Park last Sunday.", ["went", "go", "will go"], "went"],
      ["Which city is the ________ in Viet Nam?", ["biggest", "big", "bigger"], "biggest"],
      ["You should brush your teeth ________ going to bed.", ["before", "after", "while"], "before"],
      ["Would you like ________ apple juice with your lunch?", ["some", "a", "any"], "some"],
      ["Robots in the future ________ do all heavy housework.", ["will", "must", "need"], "will"]
    ]
  },
  '7': {
    phonetics: [
      ["help<u>ed</u>, cook<u>ed</u>, play<u>ed</u>", ["played", "helped", "cooked"], "played"],
      ["donat<u>ed</u>, start<u>ed</u>, listen<u>ed</u>", ["listened", "donated", "started"], "listened"],
      ["commun<u>i</u>ty, mus<u>i</u>c, act<u>i</u>vity", ["music", "community", "activity"], "music"],
      ["f<u>a</u>st, f<u>a</u>ther, c<u>a</u>t", ["cat", "fast", "father"], "cat"]
    ],
    language: [
      ["My sister enjoys ________ origami flowers in her spare time.", ["making", "make", "made"], "making"],
      ["You should eat more fresh vegetables ________ they provide vitamins.", ["because", "so", "but"], "because"],
      ["We ________ hundreds of warm coats to poor children last winter.", ["donated", "donate", "will donate"], "donated"],
      ["Drinking green tea every day is good ________ your health.", ["for", "at", "with"], "for"],
      ["Classical music is not ________ rock music.", ["as exciting as", "exciting as", "more exciting"], "as exciting as"],
      ["How ________ water do you usually drink each day?", ["much", "many", "often"], "much"],
      ["She usually ________ voluntary work at the community center on Saturdays.", ["does", "makes", "takes"], "does"],
      ["Be careful, ________ you will get a burn from the hot pot!", ["or", "and", "so"], "or"],
      ["Pass me a bottle of mineral water, ________?", ["please", "thank you", "welcome"], "please"],
      ["Traditional arts and music help keep our culture ________.", ["alive", "life", "living"], "alive"]
    ]
  },
  '8': {
    phonetics: [
      ["l<u>ei</u>sure, n<u>ei</u>ghbour, w<u>ei</u>ght", ["leisure", "neighbour", "weight"], "leisure"],
      ["nat<u>u</u>ral, cult<u>u</u>re, f<u>u</u>ture", ["natural", "culture", "future"], "natural"],
      ["er<u>u</u>ption, pollu<u>ti</u>on, ques<u>ti</u>on", ["question", "eruption", "pollution"], "question"]
    ],
    language: [
      ["Living in the countryside is ________ than living in a crowded metropolis.", ["more peaceful", "peaceful", "peacefuller"], "more peaceful"],
      ["Students are keen on ________ new digital skills online.", ["learning", "learn", "learned"], "learning"],
      ["________ you work hard every day, you will pass the exam easily.", ["If", "Unless", "Although"], "If"],
      ["Farmers in my village often load rice onto carts at ________ time.", ["harvest", "planting", "free"], "harvest"],
      ["Life in rural areas has changed ________ over the last ten years.", ["significantly", "significant", "significance"], "significantly"],
      ["He drove ________ than usual because of the heavy thunderstorm.", ["more carefully", "carefully", "careful"], "more carefully"],
      ["Which ethnic group has the ________ population in Viet Nam?", ["largest", "larger", "large"], "largest"],
      ["Teenagers nowadays spend too much time ________ on their smartphones.", ["surfing", "surf", "surfed"], "surfing"]
    ]
  },
  '9': {
    phonetics: [
      ["l<u>o</u>cal, h<u>o</u>metown, p<u>o</u>pular", ["popular", "local", "hometown"], "popular"],
      ["c<u>i</u>ty, c<u>e</u>nter, <u>c</u>raft", ["craft", "city", "center"], "craft"],
      ["pr<u>e</u>serve, r<u>e</u>place, d<u>e</u>velop", ["replace", "preserve", "develop"], "replace"]
    ],
    language: [
      ["My grandparents ________ in this peaceful craft village for fifty years.", ["have lived", "lived", "live"], "have lived"],
      ["I don't know where ________ the best pottery products.", ["to buy", "buying", "bought"], "to buy"],
      ["She wishes she ________ speak fluent English like a native speaker.", ["could", "can", "will"], "could"],
      ["The local artisans are trying to ________ their ancestral handicraft traditions.", ["preserve", "destroy", "ignore"], "preserve"],
      ["Urban life is becoming increasingly stressful; ________, many people move to suburbs.", ["therefore", "however", "although"], "therefore"],
      ["The higher the building is, the ________ the construction cost becomes.", ["greater", "great", "greatest"], "greater"],
      ["It is essential that every citizen ________ clean water and electricity.", ["conserve", "conserves", "conserved"], "conserve"],
      ["He turned ________ the lucrative job offer because he wanted to live near his family.", ["down", "on", "up"], "down"]
    ]
  }
};

// Hàm trộn ngẫu nhiên mảng
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export interface GenerateExamOptions {
  grade: string;
  term: string;
  parentAgency: string;
  schoolName: string;
  schoolYear: string;
  timeMinutes: number;
}

/**
 * Sinh trọn bộ đề thi chuẩn Công văn 7991/BGDĐT
 * Khớp 100% quy chuẩn master_exam_builder.py và dynamic_exam_engine.py
 */
export function generateExamSuite(options: GenerateExamOptions): ExamSuiteData {
  const { grade, term, schoolYear, timeMinutes } = options;
  const parentAgency = options.parentAgency.trim().toUpperCase() || 'PHÒNG GIÁO DỤC VÀ ĐÀO TẠO';
  const schoolName = options.schoolName.trim().toUpperCase() || 'TRƯỜNG THCS ........................................';

  const termNames: Record<string, string> = {
    GK1: 'GIỮA HỌC KÌ I',
    CK1: 'CUỐI HỌC KÌ I',
    GK2: 'GIỮA HỌC KÌ II',
    CK2: 'CUỐI HỌC KÌ II',
    KSCL: 'KHẢO SÁT CHẤT LƯỢNG'
  };
  const termTitle = termNames[term] || 'KIỂM TRA ĐỊNH KỲ';
  const hasSpeaking = term.includes('CK');

  // Sinh mã đề ngẫu nhiên (ví dụ 675, 676 hoặc 703, 704)
  const baseNum = Math.floor(Math.random() * 40) * 2 + 15;
  const code1 = `${grade}${baseNum < 10 ? '0' + baseNum : baseNum}`;
  const code2 = `${grade}${baseNum + 1 < 10 ? '0' + (baseNum + 1) : baseNum + 1}`;

  // Điểm số các phần
  const part3Points = hasSpeaking ? '2.4 pts' : '3.0 pts';
  const part4Points = hasSpeaking ? '1.0 pt' : '1.25 pts';
  const part5Points = hasSpeaking ? '1.0 pt' : '1.25 pts';
  const part6Points = hasSpeaking ? '0.4 pt' : '0.5 pt';
  const part7Points = hasSpeaking ? '0.4 pt' : '0.5 pt';
  const part8Points = hasSpeaking ? '0.8 pt' : '1.5 pts';
  const mcqTotalPts = hasSpeaking ? '7.2' : '8.5';

  // Ma trận 15 cột chuẩn CV 7991
  const matrixHeaders = [
    "TT", "Chủ đề / Kĩ năng", "Nội dung / Đơn vị kiến thức",
    "TNKQ nhiều lựa chọn (Biết)", "TNKQ nhiều lựa chọn (Hiểu)", "TNKQ nhiều lựa chọn (VD)",
    "TNKQ Đúng/Sai (Biết)", "TNKQ Đúng/Sai (Hiểu)", "TNKQ Đúng/Sai (VD)",
    "Tự luận (Biết)", "Tự luận (Hiểu)", "Tự luận (VD)",
    "Tổng Biết", "Tổng Hiểu", "Tổng VD"
  ];

  const matrixRows = [
    ["1", "Nghe hiểu", "Part 1: Listen & circle A, B, or C (1.0đ)", "2", "2", "1", "", "", "", "", "", "", "2", "2", "1"],
    ["", "", "Part 2: Listen & circle A (True) or B (False) (1.0đ)", "", "", "", "3", "2", "", "", "", "", "3", "2", "0"],
    ["2", "Kiến thức ngôn ngữ", "Part 3: Choose A, B, or C (Phát âm, Từ vựng, Ngữ pháp)", "6", "4", "2", "", "", "", "", "", "", "6", "4", "2"],
    ["3", "Đọc hiểu", "Part 4: Cloze test điền từ", "3", "1", "1", "", "", "", "", "", "", "3", "1", "1"],
    ["", "", "Part 5: Reading comprehension trả lời câu hỏi", "2", "2", "1", "", "", "", "", "", "", "2", "2", "1"],
    ["4", "Viết", "Part 6: Transformation & Part 7: Word order", "", "2", "2", "", "", "", "", "", "", "0", "2", "2"],
    ["", "", "Part 8: Paragraph Writing tự luận", "", "", "", "", "", "", "", "", "1", "0", "0", "1"],
    ["TỔNG CÂU", "", "36 câu Đề kiểm tra + 1 Tự luận", "13", "11", "7", "3", "2", "0", "0", "0", "1", "16", "13", "8"],
    ["TỔNG ĐIỂM", "", "10,0 điểm (Chuẩn BGD&ĐT)", "3.25", "3.0", "1.75", "0.6", "0.4", "0.0", "0.0", "0.0", "1.0", "4.0đ", "3.5đ", "2.5đ"]
  ];

  // Bản đặc tả 7 cột
  const specHeaders = ["TT", "Chủ đề / Kĩ năng", "Đơn vị kiến thức", "Yêu cầu cần đạt", "TNKQ (MCQs)", "TNKQ (Đúng/Sai)", "Tự luận"];
  const specRows = [
    ["1", "Nghe hiểu", `Part 1: Nghe hội thoại chủ đề Lớp ${grade}`, "Nhận biết, Thông hiểu & Vận dụng chi tiết bài nghe.", "5 câu\n(C1-C5)", "", ""],
    ["", "", `Part 2: Nghe độc thoại chủ đề Lớp ${grade}`, "Nhận biết & Thông hiểu câu đúng / sai (T/F).", "", "5 câu\n(C6-C10)", ""],
    ["2", "Kiến thức ngôn ngữ", `Part 3: Ngữ âm, Từ vựng, Ngữ pháp theo Unit Lớp ${grade}`, "Nhận biết, Thông hiểu, Vận dụng trắc nghiệm A, B, C.", "12 câu\n(C11-C22)", "", ""],
    ["3", "Đọc hiểu", "Part 4: Cloze test & Part 5: Reading comprehension", "Điền từ vào chỗ trống và đọc hiểu trả lời câu hỏi.", "10 câu\n(C23-C32)", "", ""],
    ["4", "Viết", "Part 6: Viết lại câu & Part 7: Sắp xếp từ thành câu", "Viết câu tương đương và sắp xếp từ hoàn chỉnh.", "4 câu\n(C33-C36)", "", ""],
    ["", "", "Part 8: Viết đoạn văn 80-100 từ có gợi ý", "Đoạn văn hoàn chỉnh bám sát chủ đề học tập.", "", "", "1 câu\n(Writing)"]
  ];

  // LẤY NGÂN HÀNG CÂU HỎI CHO GRADE
  const bank = QUESTION_BANKS[grade] || QUESTION_BANKS['6'];
  const shuffledPhonetics = shuffleArray(bank.phonetics);
  const shuffledLang = shuffleArray(bank.language);

  // Chọn 2 câu phonetics và 10 câu language cho Part 3 (tổng 12 câu)
  const part3Raw = [...shuffledPhonetics.slice(0, 2), ...shuffledLang.slice(0, 10)];

  // Xây dựng Part 3 Mã đề 1
  const part3Questions1: ExamQuestionMcq[] = [];
  const part3Answers1: string[] = [];

  part3Raw.forEach((item, index) => {
    const qNum = `${11 + index}.`;
    const stem = item[0];
    const originalOpts = item[1];
    const correctVal = item[2];

    const shuffledOpts = shuffleArray(originalOpts);
    part3Questions1.push({
      num: qNum,
      stem,
      options: shuffledOpts,
      correctAnswer: correctVal
    });

    const correctIndex = shuffledOpts.indexOf(correctVal);
    const correctLetter = String.fromCharCode(65 + (correctIndex >= 0 ? correctIndex : 0));
    part3Answers1.push(`${correctLetter} (${correctVal})`);
  });

  // Xây dựng Part 3 Mã đề 2 (Đảo vị trí phương án)
  const part3Questions2: ExamQuestionMcq[] = [];
  const part3Answers2: string[] = [];

  part3Questions1.forEach((q) => {
    const reversedOpts = [...q.options].reverse();
    part3Questions2.push({
      num: q.num,
      stem: q.stem,
      options: reversedOpts,
      correctAnswer: q.correctAnswer
    });
    const correctIndex = reversedOpts.indexOf(q.correctAnswer || '');
    const correctLetter = String.fromCharCode(65 + (correctIndex >= 0 ? correctIndex : 0));
    part3Answers2.push(`${correctLetter} (${q.correctAnswer})`);
  });

  // PART 1 (Listen & Circle A, B, C) - 5 câu
  const part1Questions1: ExamQuestionMcq[] = [
    { num: "1.", stem: "What is the main topic of the conversation?", options: ["School life and daily hobbies", "Travelling abroad", "Playing computer games"] },
    { num: "2.", stem: "Where does the dialogue take place?", options: ["In the school yard", "At the cinema", "At the airport"] },
    { num: "3.", stem: "How often do they take part in this activity?", options: ["Every weekend", "Once a year", "Never"] },
    { num: "4.", stem: "What benefit does this activity bring?", options: ["Good health and relaxation", "Money", "New toys"] },
    { num: "5.", stem: "They will meet again next ________.", options: ["Sunday", "Friday", "Wednesday"] }
  ];

  const part1Questions2: ExamQuestionMcq[] = [
    { num: "1.", stem: "What is the main topic of the conversation?", options: ["School life and daily hobbies", "Playing computer games", "Travelling abroad"] },
    { num: "2.", stem: "Where does the dialogue take place?", options: ["In the school yard", "At the airport", "At the cinema"] },
    { num: "3.", stem: "How often do they take part in this activity?", options: ["Every weekend", "Never", "Once a year"] },
    { num: "4.", stem: "What benefit does this activity bring?", options: ["Good health and relaxation", "New toys", "Money"] },
    { num: "5.", stem: "They will meet again next ________.", options: ["Sunday", "Wednesday", "Friday"] }
  ];

  // PART 2 (Listen True/False) - 5 câu
  const part2Questions1: ExamQuestionMcq[] = [
    { num: "6.", stem: "The green school campaign started last month.", options: ["A. True", "B. False"] },
    { num: "7.", stem: "Students planted more than two hundred trees.", options: ["A. True", "B. False"] },
    { num: "8.", stem: "They threw plastic bottles into the river.", options: ["A. True", "B. False"] },
    { num: "9.", stem: "Recycling paper helps protect green forests.", options: ["A. True", "B. False"] },
    { num: "10.", stem: "Joining community service makes students happy.", options: ["A. True", "B. False"] }
  ];

  const part2Questions2: ExamQuestionMcq[] = [
    { num: "6.", stem: "The green school campaign started last month.", options: ["A. True", "B. False"] },
    { num: "7.", stem: "Students planted more than two hundred trees.", options: ["A. True", "B. False"] },
    { num: "8.", stem: "They threw plastic bottles into the river.", options: ["A. True", "B. False"] },
    { num: "9.", stem: "Recycling paper helps protect green forests.", options: ["A. True", "B. False"] },
    { num: "10.", stem: "Joining community service makes students happy.", options: ["A. True", "B. False"] }
  ];

  // PART 4 (Cloze reading) - 5 câu
  const clozePassage = `Education is extremely important for secondary students. Every day, students attend classes to learn new academic subjects and practical (23) ________. Teachers always encourage students to work in teams (24) ________ they can help each other. In addition, students have access to (25) ________ large library with thousands of fascinating books. If students (26) ________ hard every day, they will achieve outstanding results and develop (27) ________.`;

  const part4Questions1: ExamQuestionMcq[] = [
    { num: "23.", stem: "", options: ["skills", "games", "candies"] },
    { num: "24.", stem: "", options: ["so that", "because of", "although"] },
    { num: "25.", stem: "", options: ["a", "an", "the"] },
    { num: "26.", stem: "", options: ["study", "studied", "studying"] },
    { num: "27.", stem: "", options: ["positively", "positive", "positivity"] }
  ];

  const part4Questions2: ExamQuestionMcq[] = [
    { num: "23.", stem: "", options: ["skills", "candies", "games"] },
    { num: "24.", stem: "", options: ["so that", "although", "because of"] },
    { num: "25.", stem: "", options: ["a", "the", "an"] },
    { num: "26.", stem: "", options: ["study", "studying", "studied"] },
    { num: "27.", stem: "", options: ["positively", "positivity", "positive"] }
  ];

  // PART 5 (Reading comprehension) - 5 câu
  // Trung tính, không gán cố định bất kỳ trường nào để tất cả giáo viên đều dùng được
  const compPassage = `Our secondary school is famous for its friendly atmosphere and high academic standards. The school has bright classrooms, modern computer laboratories, and a spacious green schoolyard. Students participate actively in volunteer clubs, tree planting days, and English speaking contests. Teachers always provide helpful guidance and encourage students to become responsible citizens.`;

  const part5Questions1: ExamQuestionMcq[] = [
    { num: "28.", stem: "What is our secondary school famous for?", options: ["Friendly atmosphere and high academic standards", "Racing tracks", "Shopping centres"] },
    { num: "29.", stem: "What facilities does the school have?", options: ["Bright classrooms and computer laboratories", "Only a cafeteria", "Only a swimming pool"] },
    { num: "30.", stem: "Which activities do students participate in?", options: ["Volunteer clubs and English speaking contests", "Only video games", "Only watching TV"] },
    { num: "31.", stem: "How do teachers help students?", options: ["Provide guidance and encouragement", "Give no homework", "Ignore students"] },
    { num: "32.", stem: "What is the school's overall goal?", options: ["To develop responsible citizens", "To make money", "To build cars"] }
  ];

  const part5Questions2: ExamQuestionMcq[] = [
    { num: "28.", stem: "What is our secondary school famous for?", options: ["Friendly atmosphere and high academic standards", "Shopping centres", "Racing tracks"] },
    { num: "29.", stem: "What facilities does the school have?", options: ["Bright classrooms and computer laboratories", "Only a swimming pool", "Only a cafeteria"] },
    { num: "30.", stem: "Which activities do students participate in?", options: ["Volunteer clubs and English speaking contests", "Only watching TV", "Only video games"] },
    { num: "31.", stem: "How do teachers help students?", options: ["Provide guidance and encouragement", "Ignore students", "Give no homework"] },
    { num: "32.", stem: "What is the school's overall goal?", options: ["To develop responsible citizens", "To build cars", "To make money"] }
  ];

  // PART 6 (Transformation) - 2 câu
  const part6Questions1: ExamQuestionMcq[] = [
    {
      num: "33.",
      stem: "Because it rained heavily, we stayed at home.",
      options: [
        "It rained heavily, so we stayed at home.",
        "Although it rained heavily, we went out.",
        "We stayed at home because so it rained."
      ]
    },
    {
      num: "34.",
      stem: "My brother likes playing badminton very much.",
      options: [
        "My brother is interested in playing badminton.",
        "My brother hates playing badminton.",
        "My brother enjoys to play badminton."
      ]
    }
  ];

  const part6Questions2: ExamQuestionMcq[] = [
    {
      num: "33.",
      stem: "Because it rained heavily, we stayed at home.",
      options: [
        "It rained heavily, so we stayed at home.",
        "We stayed at home because so it rained.",
        "Although it rained heavily, we went out."
      ]
    },
    {
      num: "34.",
      stem: "My brother likes playing badminton very much.",
      options: [
        "My brother is interested in playing badminton.",
        "My brother enjoys to play badminton.",
        "My brother hates playing badminton."
      ]
    }
  ];

  // PART 7 (Word order) - 2 câu
  const part7Questions1: ExamQuestionMcq[] = [
    {
      num: "35.",
      stem: "eating / healthy / good / for / is / food / health.",
      options: [
        "Eating healthy food is good for health.",
        "Health is good for eating healthy food.",
        "Good for health is eating healthy food."
      ]
    },
    {
      num: "36.",
      stem: "learning / helps / knowledge / English / us / broaden / our.",
      options: [
        "Learning English helps us broaden our knowledge.",
        "Our knowledge helps us broaden learning English.",
        "Broaden our knowledge helps learning English us."
      ]
    }
  ];

  const part7Questions2: ExamQuestionMcq[] = [
    {
      num: "35.",
      stem: "eating / healthy / good / for / is / food / health.",
      options: [
        "Eating healthy food is good for health.",
        "Good for health is eating healthy food.",
        "Health is good for eating healthy food."
      ]
    },
    {
      num: "36.",
      stem: "learning / helps / knowledge / English / us / broaden / our.",
      options: [
        "Learning English helps us broaden our knowledge.",
        "Broaden our knowledge helps learning English us.",
        "Our knowledge helps us broaden learning English."
      ]
    }
  ];

  // PART 8 (Writing)
  const writingPrompt = `Write a paragraph (80-100 words) about a meaningful activity you participated in at school. You can use these cues:`;
  const writingCues = `• What was the activity and when did it take place?\n• Who participated with you and what did you do?\n• What feelings and benefits did you gain from it?`;

  // AUDIO SCRIPTS
  const audioDialogue: [string, string][] = [
    ["Nam:", "Hi Mai, what do you usually do to improve your English?"],
    ["Mai:", "Hello Nam! I usually read English short stories and practice speaking with friends in the library."],
    ["Nam:", "How often do you go to the English speaking club?"],
    ["Mai:", "I go there every Sunday morning to participate in group presentations."],
    ["Nam:", "Does it help you feel confident when communicating?"],
    ["Mai:", "Yes, it helps me learn new words and correct pronunciation errors naturally."]
  ];

  const audioMonologue = `Community activities play a significant role in developing good moral character among secondary students. Last month, more than two hundred student volunteers took part in a green campaign. They planted trees along the main roads, cleaned up public parks, and collected used books for underprivileged children. These practical deeds inspire everyone to build a cleaner, greener, and happier hometown.`;

  // BẢNG ĐÁP ÁN 4 CỘT (19 HÀNG)
  // Câu 1 - 18 (Mã 1) & Câu 19 - 36 (Mã 2)
  const answerRows: ExamSuiteData['answerRows'] = [];

  // Mảng đáp án câu 1 - 36 Mã 1
  const allAnsCode1: string[] = [
    "A", "A", "A", "A", "A", // 1-5
    "A (True)", "A (True)", "B (False)", "A (True)", "A (True)", // 6-10
    ...part3Answers1, // 11-22
    "A (skills)", "A (so that)", "A (a)", "A (study)", "A (positively)", // 23-27
    "A (Friendly atmosphere)", "A (Bright classrooms)", "A (Volunteer clubs)", "A (Provide guidance)", "A (To develop responsible)", // 28-32
    "A", "A", // 33-34
    "A", "A"  // 35-36
  ];

  // Mảng đáp án câu 1 - 36 Mã 2
  const allAnsCode2: string[] = [
    "A", "A", "A", "A", "A", // 1-5
    "A (True)", "A (True)", "B (False)", "A (True)", "A (True)", // 6-10
    ...part3Answers2, // 11-22
    "A (skills)", "A (so that)", "A (a)", "A (study)", "A (positively)", // 23-27
    "A (Friendly atmosphere)", "A (Bright classrooms)", "A (Volunteer clubs)", "A (Provide guidance)", "A (To develop responsible)", // 28-32
    "A", "A", // 33-34
    "A", "A"  // 35-36
  ];

  for (let i = 0; i < 18; i++) {
    answerRows.push({
      col1Num: `${i + 1}`,
      col1Ans: `${i + 1}. ${allAnsCode1[i]}`,
      col2Num: `${i + 19}`,
      col2Ans: `${i + 19}. ${allAnsCode2[i + 18]}`
    });
  }

  // Tiêu chí chấm viết
  const writingRubric = [
    "1. Topic sentence (Giới thiệu hoạt động ý nghĩa và thời gian tham gia): 0,3 pts (Đề GK) hoặc 0,2 pts (Đề CK).",
    "2. Supporting sentences (Mô tả chi tiết việc làm, người tham gia, cảm xúc): 0,5 pts (Đề GK) hoặc 0,2 pts (Đề CK).",
    "3. Range of vocabulary use (Từ vựng phong phú, chuẩn chủ đề): 0,3 pts (Đề GK) hoặc 0,2 pts (Đề CK).",
    "4. Accuracy (Ngữ pháp thì quá khứ/hiện tại, chính tả, dấu câu): 0,4 pts (Đề GK) hoặc 0,2 pts (Đề CK)."
  ];

  const sampleWriting = `Last weekend, I took part in a green cleaning campaign organized by our secondary school. Together with my classmates, I collected plastic bottles and planted green trees along the main village road. Although we worked hard under the warm morning sun, we felt extremely joyful and proud of our contribution. This meaningful activity helped me realize the great value of environmental protection.`;

  // Speaking rows nếu có
  const speakingRows: [string, string, string, string][] = [
    ["Greeting", "Hello, what's your name? How are you feeling today?", "Hello teacher. My name is Lan. I'm feeling great, thank you.", "Level 1: Repeat | Level 2: Are you Lan? | Level 3: Are you happy?"],
    ["Phase 1\nPicture Talk\n(1.0 pt)", "Look at this picture of students doing community service:\n1. Where are the students?\n2. What activities are they doing?\n3. How many trees can you see?", "1. They are in the school garden.\n2. They are planting trees and watering flowers.\n3. I can see five small trees.", "Level 1: Repeat question.\nLevel 2: Are they in the park?\nLevel 3: Are they planting trees?\nLevel 4: Yes/No questions."],
    ["Phase 2\nPersonal Topic\n(1.0 pt)", "Answer these personal questions:\n1. What is your favourite hobby?\n2. How do you help protect the environment?\n3. Why is learning English useful for you?", "1. I like reading books and playing sports.\n2. I recycle plastic bottles and turn off lights.\n3. It helps me communicate with global friends.", "Level 1: Repeat.\nLevel 2: Do you like reading?\nLevel 3: Do you recycle?\nLevel 4: Give choices."]
  ];

  const scoreSummary = hasSpeaking
    ? `IV. TỔNG ĐIỂM TOÀN BÀI KIỂM TRA ${termTitle}: 10,0 ĐIỂM\n(Phần thi Viết: 8.0 điểm [Listening: 2.0đ, Language: 2.4đ, Reading: 2.0đ, Writing: 1.6đ] + Phần thi Nói: 2.0 điểm)`
    : `III. TỔNG ĐIỂM BÀI KIỂM TRA ${termTitle}: 10,0 ĐIỂM\n(Phần 1 - Listening: 2.0đ + Phần 2 - Language: 3.0đ + Phần 3 - Reading: 2.5đ + Phần 4 - Writing: 2.5đ)`;

  return {
    code1,
    code2,
    grade,
    term,
    termTitle,
    schoolYear,
    parentAgency,
    schoolName,
    timeMinutes,
    hasSpeaking,
    matrixSubtitle: `Đề kiểm tra ngẫu nhiên tạo tự động (Mã đề ${code1} & ${code2}) - Thang điểm 10,0đ`,
    matrixHeaders,
    matrixRows,
    specSubtitle: `CHƯƠNG TRÌNH GLOBAL SUCCESS - NĂM HỌC ${schoolYear}`,
    specHeaders,
    specRows,
    examCode1: {
      code: code1,
      parts: [
        { title: "Part 1. Listen and circle the best answer A, B, or C.", points: "1.0 pt", questions: part1Questions1 },
        { title: "Part 2. Listen and circle the best answer A or B.", points: "1.0 pt", questions: part2Questions1 },
        { title: "Part 3. Choose A, B, or C to complete the following sentences.", points: part3Points, questions: part3Questions1 },
        { title: "Part 4. Read and choose the best answer A, B or C to complete the passage.", points: part4Points, passage: clozePassage, questions: part4Questions1 },
        { title: "Part 5. Read the passage and choose the best answer A, B or C.", points: part5Points, passage: compPassage, questions: part5Questions1 },
        { title: "Part 6. Sentence Transformation: Choose the correct sentence A, B or C.", points: part6Points, questions: part6Questions1 },
        { title: "Part 7. Word Order: Choose the correct sentence A, B or C.", points: part7Points, questions: part7Questions1 }
      ],
      writingPrompt,
      writingCues
    },
    examCode2: {
      code: code2,
      parts: [
        { title: "Part 1. Listen and circle the best answer A, B, or C.", points: "1.0 pt", questions: part1Questions2 },
        { title: "Part 2. Listen and circle the best answer A or B.", points: "1.0 pt", questions: part2Questions2 },
        { title: "Part 3. Choose A, B, or C to complete the following sentences.", points: part3Points, questions: part3Questions2 },
        { title: "Part 4. Read and choose the best answer A, B or C to complete the passage.", points: part4Points, passage: clozePassage, questions: part4Questions2 },
        { title: "Part 5. Read the passage and choose the best answer A, B or C.", points: part5Points, passage: compPassage, questions: part5Questions2 },
        { title: "Part 6. Sentence Transformation: Choose the correct sentence A, B or C.", points: part6Points, questions: part6Questions2 },
        { title: "Part 7. Word Order: Choose the correct sentence A, B or C.", points: part7Points, questions: part7Questions2 }
      ],
      writingPrompt,
      writingCues
    },
    audioDialogue,
    audioMonologue,
    mcqTotalPts,
    answerRows,
    writingRubric,
    sampleWriting,
    speakingRows,
    scoreSummary
  };
}

/**
 * Xuất file Word HTML chuẩn 100% template của Thầy Đinh Văn Thành
 * Tương thích Microsoft Word trên Windows / Mac / Office 365
 */
export function exportToWordHtml(suite: ExamSuiteData): string {
  const {
    code1, code2, grade, termTitle, schoolYear, parentAgency, schoolName, timeMinutes,
    matrixSubtitle, matrixHeaders, matrixRows,
    specSubtitle, specHeaders, specRows,
    examCode1, examCode2,
    audioDialogue, audioMonologue, mcqTotalPts, answerRows,
    writingRubric, sampleWriting, speakingRows, hasSpeaking, scoreSummary
  } = suite;

  // Helper render bảng điểm học sinh chuẩn 3 hàng 4 cột
  const renderMarksTable = () => `
    <table style="width: 100%; border-collapse: collapse; margin-top: 6px; margin-bottom: 12px;">
      <tr>
        <th colspan="2" style="border: 1px solid #000; padding: 4px; text-align: center; font-size: 11.5pt; width: 25%;"><b>Marks</b></th>
        <th rowspan="2" style="border: 1px solid #000; padding: 4px; text-align: center; font-size: 11.5pt; width: 15%;"><b>Total</b></th>
        <th rowspan="2" style="border: 1px solid #000; padding: 4px; text-align: center; font-size: 11.5pt; width: 60%;"><b>Teacher’s remarks</b></th>
      </tr>
      <tr>
        <th style="border: 1px solid #000; padding: 4px; text-align: center; font-size: 11.5pt; width: 12.5%;"><b>Speak</b></th>
        <th style="border: 1px solid #000; padding: 4px; text-align: center; font-size: 11.5pt; width: 12.5%;"><b>Write</b></th>
      </tr>
      <tr style="height: 50px;">
        <td style="border: 1px solid #000; padding: 4px; text-align: center;">&nbsp;</td>
        <td style="border: 1px solid #000; padding: 4px; text-align: center;">&nbsp;</td>
        <td style="border: 1px solid #000; padding: 4px; text-align: center;">&nbsp;</td>
        <td style="border: 1px solid #000; padding: 6px 12px; vertical-align: top; font-size: 11pt;">
          ___________________________________________________________<br/>
          ___________________________________________________________
        </td>
      </tr>
    </table>
  `;

  // Helper render đề thi cho một mã đề
  const renderExamContent = (exam: typeof examCode1) => {
    let html = `
      <table style="width: 100%; border: none; border-collapse: collapse; margin-bottom: 8px;">
        <tr>
          <td style="width: 40%; text-align: center; vertical-align: top; font-size: 11.5pt;">
            <b>${parentAgency}</b><br/>
            <b style="text-decoration: underline;">${schoolName}</b>
          </td>
          <td style="width: 60%; text-align: center; vertical-align: top; font-size: 11.5pt;">
            <b style="font-size: 12.5pt;">BÀI KIỂM TRA ĐÁNH GIÁ ${termTitle}</b><br/>
            <b>NĂM HỌC: ${schoolYear}</b><br/>
            <b>Môn: Tiếng Anh ${grade}</b><br/>
            <i>Thời gian: ${timeMinutes} phút</i>
          </td>
        </tr>
      </table>

      <div style="margin-top: 6px; margin-bottom: 4px; font-size: 13pt;">
        Full name: __________________________, &nbsp;&nbsp;&nbsp;&nbsp; Class: ${grade}A___ &nbsp;&nbsp;&nbsp;&nbsp; <b>Mã đề ${exam.code}</b>
      </div>

      ${renderMarksTable()}
    `;

    exam.parts.forEach(p => {
      html += `<div style="font-weight: bold; font-size: 13pt; margin-top: 10px; margin-bottom: 4px;">${p.title} (${p.points})</div>`;
      if (p.passage) {
        html += `<div style="text-align: justify; text-indent: 28px; margin-bottom: 8px; font-size: 13pt; line-height: 1.25;">${p.passage}</div>`;
      }
      p.questions.forEach(q => {
        html += `<div style="margin-bottom: 2px; font-size: 13pt;"><b>${q.num}</b> ${q.stem}</div>`;
        if (q.options && q.options.length > 0) {
          html += `<div style="margin-left: 20px; margin-bottom: 4px; font-size: 13pt;">`;
          q.options.forEach((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            html += `<span style="margin-right: 28px;"><b>${opt.startsWith(letter + '.') ? '' : letter + '. '}</b>${opt}</span>`;
          });
          html += `</div>`;
        }
      });
    });

    html += `
      <div style="font-weight: bold; font-size: 13pt; margin-top: 10px; margin-bottom: 4px;">Part 8. Writing (${hasSpeaking ? '0.8 pt' : '1.5 pts'}) ${exam.writingPrompt}</div>
      <div style="font-style: italic; margin-left: 10px; margin-bottom: 8px; font-size: 13pt; white-space: pre-line;">${exam.writingCues}</div>
      <div style="text-align: center; font-weight: bold; margin-top: 20px; margin-bottom: 10px; font-size: 12pt;">------The end------</div>
      <div style="text-align: right; font-style: italic; font-weight: bold; font-size: 11pt;">Mã đề: ${exam.code}</div>
    `;

    return html;
  };

  return `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>De_Kiem_Tra_Tieng_Anh_${grade}_${termTitle.replace(/\s+/g, '_')}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page {
          size: 210mm 297mm;
          margin: 15mm 15mm 15mm 15mm;
        }
        body {
          font-family: 'Times New Roman', Times, serif;
          font-size: 13pt;
          line-height: 1.25;
          color: #000000;
        }
        table {
          border-collapse: collapse;
          width: 100%;
        }
        th, td {
          font-family: 'Times New Roman', Times, serif;
        }
        .tbl-border th, .tbl-border td {
          border: 1px solid #000000;
          padding: 4px 6px;
        }
        .bg-head {
          background-color: #E8EEF5;
        }
        .bg-total {
          background-color: #F4F6F9;
        }
        .page-break {
          page-break-before: always;
          clear: both;
        }
      </style>
    </head>
    <body>

      <!-- =================================================================== -->
      <!-- SECTION 1: MA TRẬN & BẢN ĐẶC TẢ (CV 7991)                           -->
      <!-- =================================================================== -->
      <div style="text-align: center; margin-bottom: 12px;">
        <div style="font-weight: bold; font-size: 11.5pt;">${parentAgency} - ${schoolName}</div>
        <div style="font-weight: bold; font-size: 12pt;">MA TRẬN ĐỀ KIỂM TRA ĐÁNH GIÁ ${termTitle} - NĂM HỌC ${schoolYear}</div>
        <div style="font-weight: bold; font-size: 11pt;">MÔN: TIẾNG ANH ${grade} (GLOBAL SUCCESS) - THỜI GIAN LÀM BÀI: ${timeMinutes} PHÚT</div>
        <div style="font-style: italic; font-size: 9.5pt;">${matrixSubtitle}</div>
      </div>

      <table class="tbl-border" style="font-size: 8pt; text-align: center; margin-bottom: 20px;">
        <tr class="bg-head">
          ${matrixHeaders.map(h => `<th style="padding: 4px;"><b>${h}</b></th>`).join('')}
        </tr>
        ${matrixRows.map(row => {
          const isTotal = row[0].startsWith("TỔNG");
          const cls = isTotal ? 'class="bg-total"' : '';
          return `
            <tr ${cls}>
              ${row.map((val, idx) => `
                <td style="padding: 3px; text-align: ${idx === 1 || idx === 2 ? 'left' : 'center'}; ${isTotal ? 'font-weight: bold;' : ''}">
                  ${val}
                </td>
              `).join('')}
            </tr>
          `;
        }).join('')}
      </table>

      <div class="page-break"></div>

      <div style="text-align: center; margin-bottom: 12px;">
        <div style="font-weight: bold; font-size: 11.5pt;">BẢN ĐẶC TẢ KỸ THUẬT ĐỀ KIỂM TRA ${termTitle} - TIẾNG ANH ${grade}</div>
        <div style="font-style: italic; font-size: 9.5pt;">${specSubtitle}</div>
      </div>

      <table class="tbl-border" style="font-size: 8pt; margin-bottom: 20px;">
        <tr class="bg-head">
          ${specHeaders.map(h => `<th style="text-align: center; padding: 4px;"><b>${h}</b></th>`).join('')}
        </tr>
        ${specRows.map(row => `
          <tr>
            ${row.map((val, idx) => `
              <td style="padding: 3px; text-align: ${[0, 4, 5, 6].includes(idx) ? 'center' : 'left'};">
                ${val.replace(/\n/g, '<br/>')}
              </td>
            `).join('')}
          </tr>
        `).join('')}
      </table>

      <!-- =================================================================== -->
      <!-- SECTION 2: ĐỀ THI MÃ ĐỀ 1                                          -->
      <!-- =================================================================== -->
      <div class="page-break"></div>
      ${renderExamContent(examCode1)}

      <!-- =================================================================== -->
      <!-- SECTION 3: ĐỀ THI MÃ ĐỀ 2 (HOÁN VỊ)                                 -->
      <!-- =================================================================== -->
      <div class="page-break"></div>
      ${renderExamContent(examCode2)}

      <!-- =================================================================== -->
      <!-- SECTION 4: HƯỚNG DẪN ĐÁP ÁN VÀ BIỂU ĐIỂM                           -->
      <!-- =================================================================== -->
      <div class="page-break"></div>
      
      <div style="margin-bottom: 8px;">
        <div style="font-weight: bold; font-size: 11.5pt; text-align: left;">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${parentAgency}<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;${schoolName}
        </div>
        <div style="text-align: center; margin-top: 4px;">
          <div style="font-weight: bold; font-size: 13.5pt;">HƯỚNG DẪN ĐÁP ÁN VÀ BIỂU ĐIỂM</div>
          <div style="font-weight: bold; font-size: 13.5pt;">KIỂM TRA ĐÁNH GIÁ ${termTitle}</div>
          <div style="font-weight: bold; font-size: 13pt;">NĂM HỌC: ${schoolYear} - MÔN: TIẾNG ANH ${grade} (MÃ ĐỀ ${code1} & ${code2})</div>
        </div>
      </div>

      <div style="font-weight: bold; font-size: 13pt; margin-top: 14px; margin-bottom: 6px;">
        NỘI DUNG BÀI NGHE (AUDIO SCRIPTS - DÙNG CHO CẢ 2 MÃ ĐỀ)
      </div>

      <div style="font-weight: bold; font-size: 13pt; margin-bottom: 4px;">Part 1. Listen and circle the best answer A, B, or C. (1.0 pt)</div>
      <div style="margin-left: 20px; font-size: 13pt; line-height: 1.25; margin-bottom: 8px;">
        ${audioDialogue.map(([spk, txt]) => `<div><b>${spk}</b>&nbsp;&nbsp;&nbsp;&nbsp;${txt}</div>`).join('')}
      </div>

      <div style="font-weight: bold; font-size: 13pt; margin-bottom: 4px;">Part 2. Listen and circle the best answer A or B. (1.0 pt)</div>
      <div style="text-align: justify; text-indent: 28px; font-size: 13pt; line-height: 1.25; margin-bottom: 14px;">
        ${audioMonologue}
      </div>

      <div style="font-weight: bold; font-size: 13pt; margin-top: 14px; margin-bottom: 6px;">
        I. PHẦN TRẮC NGHIỆM KHÁCH QUAN (36 CÂU = ${mcqTotalPts} ĐIỂM TRÊN ĐỀ VIẾT)
      </div>

      <table class="tbl-border" style="font-size: 12pt; text-align: center; margin-bottom: 14px;">
        <tr class="bg-head">
          <th style="width: 12%; padding: 6px;"><b>Câu</b></th>
          <th style="width: 38%; padding: 6px;"><b>Đáp án MÃ ĐỀ ${code1}</b></th>
          <th style="width: 12%; padding: 6px;"><b>Câu</b></th>
          <th style="width: 38%; padding: 6px;"><b>Đáp án MÃ ĐỀ ${code2}</b></th>
        </tr>
        ${answerRows.map(row => `
          <tr>
            <td style="padding: 4px;">${row.col1Num}</td>
            <td style="padding: 4px;">${row.col1Ans}</td>
            <td style="padding: 4px;">${row.col2Num}</td>
            <td style="padding: 4px;">${row.col2Ans}</td>
          </tr>
        `).join('')}
      </table>

      <div style="font-weight: bold; font-size: 13pt; margin-top: 14px; margin-bottom: 6px;">
        II. PHẦN TỰ LUẬN VIẾT (PART 8: ${hasSpeaking ? '0.8 pt' : '1.5 pts'})
      </div>
      <div style="font-size: 12pt; margin-bottom: 6px;">
        ${writingRubric.map(r => `<div>${r}</div>`).join('')}
      </div>
      <div style="font-weight: bold; font-style: italic; font-size: 12.5pt; margin-top: 8px; margin-bottom: 4px;">
        * Đoạn văn mẫu tham khảo (Sample writing):
      </div>
      <div style="text-align: justify; text-indent: 28px; font-size: 13pt; line-height: 1.25; margin-bottom: 14px;">
        ${sampleWriting}
      </div>

      ${hasSpeaking ? `
        <div style="font-weight: bold; font-size: 13pt; margin-top: 14px; margin-bottom: 6px;">
          III. PHẦN THI NÓI (SPEAKING TEST: 2.0 ĐIỂM)
        </div>
        <table class="tbl-border" style="font-size: 10pt; margin-bottom: 14px;">
          <tr class="bg-head">
            <th style="width: 15%; text-align: center; padding: 4px;"><b>To do</b></th>
            <th style="width: 32%; text-align: center; padding: 4px;"><b>To say (Examiner)</b></th>
            <th style="width: 28%; text-align: center; padding: 4px;"><b>Response (Students)</b></th>
            <th style="width: 25%; text-align: center; padding: 4px;"><b>Back-up</b></th>
          </tr>
          ${speakingRows.map(([todo, say, res, backup]) => `
            <tr>
              <td style="padding: 4px; text-align: center; font-weight: bold;">${todo.replace(/\n/g, '<br/>')}</td>
              <td style="padding: 4px;">${say.replace(/\n/g, '<br/>')}</td>
              <td style="padding: 4px;">${res.replace(/\n/g, '<br/>')}</td>
              <td style="padding: 4px;">${backup.replace(/\n/g, '<br/>')}</td>
            </tr>
          `).join('')}
        </table>
      ` : ''}

      <div style="font-weight: bold; font-size: 12.5pt; margin-top: 14px;">
        ${scoreSummary.replace(/\n/g, '<br/>')}
      </div>

    </body>
    </html>
  `;
}
