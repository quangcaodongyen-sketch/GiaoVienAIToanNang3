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

export interface SpeakingPhase {
  title: string;
  subtitle?: string;
  targetCompetence?: string;
  materialOrCard?: string;
  cues?: string[];
  scriptRows: [string, string, string, string][]; // To do, To say, Response, Back-up
}

export interface SpeakingTestData {
  title: string;
  subtitle: string;
  structureInfo: string;
  openingRows: [string, string, string, string][];
  phase1: SpeakingPhase;
  phase2: SpeakingPhase;
  closingRows: [string, string, string, string][];
  rubric: {
    criteria: string;
    points: string;
    description: string;
  }[];
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

  // Dedicated Speaking Test (Đề thi nói chính thức)
  speakingTest: SpeakingTestData;

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
  scoreSummary: string;
}

// NGÂN HÀNG CÂU HỎI MỞ RỘNG CHO CÁC KHỐI LỚP (GRADE 6, 7, 8, 9)
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

// DỮ LIỆU ĐỀ KIỂM TRA NÓI CHUẨN 100% CỦA THẦY THÀNH (LỚP 6, 7, 8, 9)
export const SPEAKING_BANKS: Record<string, SpeakingTestData> = {
  '6': {
    title: "SPEAKING TEST – GRADE 6 – GLOBAL SUCCESS",
    subtitle: "English 6 – Suggested time: 5–6 minutes/student",
    structureInfo: "Structure: Opening + 2 Phases + Closing | Total Speaking score: 2.0 points",
    openingRows: [
      ["Greet the student", "Hello. My name’s ______. What’s your name?", "Hello. My name’s ______. / I’m ______.", "Are you Mai/Nam...?"],
      ["Ask one easy question", "How are you today?", "I’m fine/good, thank you.", "Are you fine today?"]
    ],
    phase1: {
      title: "PHASE 1. PICTURE TALK",
      targetCompetence: "LOOK → ANSWER → DESCRIBE",
      materialOrCard: "Test material: One picture of a school and neighbourhood environment",
      scriptRows: [
        ["Show the picture", "Look at this picture.", "Student looks at the picture.", "—"],
        ["Ask about place", "Where are the children?", "They are near/at the school. / They are in the neighbourhood.", "Are they at school?"],
        ["Ask about an activity", "What are the boys doing?", "They are playing football.", "Are they playing football?"],
        ["Ask about another activity", "What is the boy on the bike doing?", "He is riding a bike.", "Is he riding a bike?"],
        ["Ask about places", "What places can you see in the picture?", "I can see a school, a park, some houses and a shop.", "Can you see a school? A park?"],
        ["Ask about location", "Is the park near the school?", "Yes, it is.", "Point to the school and the park: Are they near each other?"]
      ]
    },
    phase2: {
      title: "PHASE 2. ABOUT YOU",
      targetCompetence: "LISTEN → ANSWER → ADD ONE DETAIL",
      materialOrCard: "Personal topics: School, Home/Neighbourhood, Best friend, Tet holiday",
      scriptRows: [
        ["Introduce the phase", "Good. Now let’s talk about you.", "Student listens attentively.", "—"],
        ["Ask about school", "What is your school like?", "My school is big/small/nice. It has many classrooms.", "Is your school big or small?"],
        ["Ask about neighbourhood", "Where do you live? What is your neighbourhood like?", "I live in ______. My neighbourhood is quiet/beautiful.", "Is your neighbourhood quiet?"],
        ["Ask about friends", "Who is your best friend? What is he/she like?", "My best friend is Lan. She is friendly and kind.", "Is your best friend friendly?"],
        ["Ask about Tet", "What do you usually do at Tet?", "I visit my grandparents. / I clean my house. / I get lucky money.", "Do you visit your grandparents at Tet?"],
        ["Optional follow-up", "What do you like best about Tet? Why?", "I like lucky money because it is fun. / I like family time because we are together.", "Do you like lucky money?"]
      ]
    },
    closingRows: [
      ["Finish the test", "OK. That’s the end of the test. Thank you. Goodbye.", "Thank you teacher. Goodbye.", "—"]
    ],
    rubric: [
      { criteria: "1. Pronunciation & Intonation", points: "0.5 pt", description: "Phát âm rõ ràng các âm cơ bản, có ngữ điệu câu hỏi/câu trần thuật." },
      { criteria: "2. Vocabulary & Grammar", points: "0.5 pt", description: "Sử dụng đúng thì hiện tại đơn, hiện tại tiếp diễn, từ vựng theo chủ đề lớp 6." },
      { criteria: "3. Fluency & Interaction", points: "0.5 pt", description: "Trả lời tự nhiên, tốc độ vừa phải, phản xạ nhanh với câu hỏi giám khảo." },
      { criteria: "4. Content & Completeness", points: "0.5 pt", description: "Trả lời đúng trọng tâm, bổ sung được ít nhất 1 chi tiết mở rộng." }
    ]
  },
  '7': {
    title: "SPEAKING TEST – GRADE 7 – GLOBAL SUCCESS",
    subtitle: "English 7 – Suggested time: 5–6 minutes/student",
    structureInfo: "Structure: Opening + 2 Phases + Closing | Total Speaking score: 2.0 points",
    openingRows: [
      ["Greet the student", "Hello. My name’s ______. What’s your name?", "Hello. My name’s ______. / I’m ______.", "Are you Mai/Nam...?"],
      ["Ask one easy question", "How are you today?", "I’m fine/good, thank you.", "Are you fine today?"]
    ],
    phase1: {
      title: "PHASE 1. DESCRIBE A PICTURE",
      targetCompetence: "LOOK → DESCRIBE → CONNECT",
      materialOrCard: "Test material: One picture of students doing outdoor community & sports activities in a park",
      scriptRows: [
        ["Show the picture", "Look at this picture. It shows students in a park.", "Student looks at the picture.", "—"],
        ["Ask about the place", "Where are the people?", "They are in a park.", "Are they in a park?"],
        ["Ask about activities", "What are the students doing?", "Some students are playing football. Two students are playing badminton.", "Are they playing sports?"],
        ["Ask about other people", "What are the two girls doing?", "They are talking under the tree.", "Are they talking?"],
        ["Ask about feelings", "How do the students feel?", "They look happy and energetic.", "Do they look happy?"],
        ["Optional extension", "What do you think about these activities?", "I think they are fun and very good for our health.", "Are these activities fun?"]
      ]
    },
    phase2: {
      title: "PHASE 2. MY HOBBY & HEALTHY LIVING",
      targetCompetence: "ANSWER → ADD INFORMATION → GIVE A SIMPLE REASON",
      materialOrCard: "Student Card: Talk about your hobby. (What is it, when you do it, who with, why you like it)",
      scriptRows: [
        ["Introduce the topic", "Good. Now let’s talk about your hobby.", "Student listens.", "—"],
        ["Ask about hobby", "What is your hobby?", "My hobby is playing badminton. / I like reading books.", "Do you like playing badminton/reading?"],
        ["Ask about time", "When do you usually do it?", "I usually play after school. / I read books in the evening.", "Do you do it after school?"],
        ["Ask about people", "Who do you usually do it with?", "I play with my friends. / I read by myself.", "Do you play with your friends?"],
        ["Ask for a reason", "Why do you like it?", "Because it is fun and helps me relax after studying.", "Is it fun/interesting?"]
      ]
    },
    closingRows: [
      ["Finish the test", "OK. That’s the end of the test. Thank you. Goodbye.", "Thank you teacher. Goodbye.", "—"]
    ],
    rubric: [
      { criteria: "1. Pronunciation & Intonation", points: "0.5 pt", description: "Phát âm chuẩn đuôi -s/-es/-ed, trọng âm từ 2 âm tiết chính xác." },
      { criteria: "2. Vocabulary & Grammar", points: "0.5 pt", description: "Dùng tốt câu so sánh, thì quá khứ đơn, từ nối (because, although, so)." },
      { criteria: "3. Fluency & Interaction", points: "0.5 pt", description: "Nói lưu loát, tự tin, không ngập ngừng quá lâu, giao tiếp mắt tốt." },
      { criteria: "4. Content & Completeness", points: "0.5 pt", description: "Phát triển ý mạch lạc, đưa ra được lý do giải thích cho sở thích." }
    ]
  },
  '8': {
    title: "SPEAKING TEST – GRADE 8 – GLOBAL SUCCESS",
    subtitle: "English 8 – Suggested time: 5–6 minutes/student",
    structureInfo: "Structure: Opening + 2 Phases + Closing | Total Speaking score: 2.0 points",
    openingRows: [
      ["Greet the student", "Hello. My name’s ______. What’s your name?", "Hello. My name’s ______. / I’m ______.", "Are you Mai/Nam...?"],
      ["Ask one easy question", "How are you today?", "I’m fine/good, thank you.", "Are you fine today?"]
    ],
    phase1: {
      title: "PHASE 1. SHORT TOPIC TALK (MY LEISURE TIME)",
      targetCompetence: "ANSWER → ORGANISE → TALK BRIEFLY",
      materialOrCard: "Student Card: Talk about your leisure time. You should say: what you usually do; when/how often; why you like it.",
      scriptRows: [
        ["Give the Topic Card", "Now, let’s talk about your leisure time. Look at these prompts. You have a few seconds to think.", "Student reads the prompts.", "Point to the three prompts."],
        ["Start the task", "Please tell me about your leisure time.", "In my free time, I usually play badminton. I often play after school with my friends three times a week. I like it because it is fun and keeps me fit.", "What do you do in your free time?"],
        ["Support if necessary", "When and how often do you do it?", "Student elaborates on schedule.", "Do you do it at weekends?"],
        ["Support if necessary", "Why do you like this activity?", "Student explains benefits (health, friendship, relaxation).", "Is it good for your health?"]
      ]
    },
    phase2: {
      title: "PHASE 2. CHOOSE & SAY WHY",
      targetCompetence: "LOOK → CHOOSE → GIVE A REASON → RESPOND",
      materialOrCard: "Situation: Your class wants to choose a good leisure activity for teenagers: 1. Sports  2. Reading books  3. Listening to music.",
      scriptRows: [
        ["Show the options", "Look at these activities: playing sports, reading books and listening to music.", "Student looks at the options.", "Point to each option."],
        ["Ask for a choice", "Which activity do you think is the best for teenagers?", "I think playing sports is the best.", "Do you think playing sports is good?"],
        ["Ask for a reason", "Why do you think so?", "Because it helps teenagers stay healthy and make more friends.", "Is it good for health?"],
        ["Ask about another option", "What about reading books?", "Reading is also useful because it broadens our knowledge.", "Is reading books useful?"],
        ["Ask for preference", "So, which one do you prefer personally?", "I prefer playing sports because I enjoy team games.", "Do you prefer sports or reading?"]
      ]
    },
    closingRows: [
      ["Finish the test", "OK. That’s the end of the test. Thank you. Goodbye.", "Thank you teacher. Goodbye.", "—"]
    ],
    rubric: [
      { criteria: "1. Pronunciation & Intonation", points: "0.5 pt", description: "Phát âm rõ ràng phụ âm cuối, nối âm tự nhiên, ngữ điệu câu biểu cảm." },
      { criteria: "2. Vocabulary & Grammar", points: "0.5 pt", description: "Sử dụng đa dạng trạng từ chỉ tần suất, so sánh hơn/nhất, câu điều kiện." },
      { criteria: "3. Fluency & Coherence", points: "0.5 pt", description: "Liên kết ý tốt bằng từ nối (firstly, besides, in addition, because)." },
      { criteria: "4. Content & Interaction", points: "0.5 pt", description: "Đưa ra lập luận bảo vệ quan điểm lựa chọn thuyết phục." }
    ]
  },
  '9': {
    title: "SPEAKING TEST – GRADE 9 – GLOBAL SUCCESS",
    subtitle: "English 9 – Suggested time: 5–6 minutes/student",
    structureInfo: "Structure: Opening + 2 Phases + Closing | Total Speaking score: 2.0 points",
    openingRows: [
      ["Greet the student", "Hello. My name’s ______. What’s your name?", "Hello. My name’s ______. / I’m ______.", "Are you Mai/Nam...?"],
      ["Ask one easy question", "How are you today?", "I’m fine/good, thank you.", "Are you fine today?"]
    ],
    phase1: {
      title: "PHASE 1. PHOTO TALK",
      targetCompetence: "LOOK → DESCRIBE → ADD OPINION",
      materialOrCard: "Test material: One photo of volunteers planting trees and cleaning a public community park",
      scriptRows: [
        ["Show the photo", "Look at this photo.", "Student looks at the photo.", "—"],
        ["Ask about place", "Where are the students?", "They are in a public park / in their local community.", "Are they in a park?"],
        ["Ask about activity", "What are they doing?", "They are cleaning the park, collecting rubbish and planting green trees.", "Are they cleaning the park?"],
        ["Ask for more detail", "What else can you see?", "Some students are watering young plants, others are putting trash into recycling bins.", "What are the students doing with the plants?"],
        ["Ask for opinion", "Do you think this activity is useful for the community? Why?", "Yes, it keeps our environment green, clean and reduces pollution.", "Is it good for the environment?"]
      ]
    },
    phase2: {
      title: "PHASE 2. COMPARE & CHOOSE",
      targetCompetence: "LOOK → COMPARE → CHOOSE → EXPLAIN",
      materialOrCard: "Situation: Your class wants to do something useful for the local community:\nA. PLANTING TREES\nB. CLEANING A PUBLIC PLACE\nC. COLLECTING OLD CLOTHES FOR PEOPLE IN NEED",
      scriptRows: [
        ["Show the three options", "Look at these three activities: planting trees, cleaning a public place, and collecting old clothes.", "Student looks at the options.", "Point to and name each activity."],
        ["Ask about option A", "What do you think about planting trees?", "Planting trees is meaningful because it makes our town greener.", "Is planting trees good for the environment?"],
        ["Ask about option B", "What about cleaning a public place?", "It is very practical because everyone can see immediate positive results.", "Is cleaning public places useful?"],
        ["Ask for comparison", "Which is better for your class: planting trees or cleaning a public place?", "I think cleaning a public place is more suitable because all students can join easily.", "Which one is easier to organize?"],
        ["Ask for final choice", "So, which activity do you choose? Why?", "I choose cleaning a public place because it directly improves our school and neighbourhood.", "Do you choose planting trees or cleaning? Why?"]
      ]
    },
    closingRows: [
      ["Finish the test", "OK. That’s the end of the test. Thank you. Goodbye.", "Thank you teacher. Goodbye.", "—"]
    ],
    rubric: [
      { criteria: "1. Pronunciation & Intonation", points: "0.5 pt", description: "Phát âm chuẩn xác, ngữ điệu tự nhiên, nuốt âm và nối âm chuẩn bản xứ." },
      { criteria: "2. Vocabulary & Grammar", points: "0.5 pt", description: "Vốn từ vựng phong phú về cộng đồng, môi trường, mệnh đề quan hệ, câu điều kiện." },
      { criteria: "3. Fluency & Coherence", points: "0.5 pt", description: "Trình bày mạch lạc, cấu trúc câu chặt chẽ, mở rộng ý sâu sắc." },
      { criteria: "4. Argumentation & Critical Thinking", points: "0.5 pt", description: "So sánh, phân tích ưu nhược điểm và đưa ra lựa chọn có căn cứ xác đáng." }
    ]
  }
};

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
 * Khớp 100% quy chuẩn master_exam_builder.py, dynamic_exam_engine.py và Thư viện Speaking Test
 */
export function generateExamSuite(options: GenerateExamOptions): ExamSuiteData {
  const { grade, term, schoolYear, timeMinutes } = options;
  const parentAgency = options.parentAgency.trim().toUpperCase() || 'UBND XÃ ĐỒNG YÊN';
  const schoolName = options.schoolName.trim().toUpperCase() || 'TRƯỜNG THCS ĐỒNG YÊN';

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
    { num: "1.", stem: "What is the main topic of the conversation?", options: ["School life and daily hobbies", "Travelling abroad", "Playing computer games"], correctAnswer: "School life and daily hobbies" },
    { num: "2.", stem: "Where does the dialogue take place?", options: ["In the school yard", "At the cinema", "At the airport"], correctAnswer: "In the school yard" },
    { num: "3.", stem: "How often do they take part in this activity?", options: ["Every weekend", "Once a year", "Never"], correctAnswer: "Every weekend" },
    { num: "4.", stem: "What benefit does this activity bring?", options: ["Good health and relaxation", "Money", "New toys"], correctAnswer: "Good health and relaxation" },
    { num: "5.", stem: "They will meet again next ________.", options: ["Sunday", "Friday", "Wednesday"], correctAnswer: "Sunday" }
  ];

  const part1Questions2: ExamQuestionMcq[] = [
    { num: "1.", stem: "What is the main topic of the conversation?", options: ["School life and daily hobbies", "Playing computer games", "Travelling abroad"], correctAnswer: "School life and daily hobbies" },
    { num: "2.", stem: "Where does the dialogue take place?", options: ["In the school yard", "At the airport", "At the cinema"], correctAnswer: "In the school yard" },
    { num: "3.", stem: "How often do they take part in this activity?", options: ["Every weekend", "Never", "Once a year"], correctAnswer: "Every weekend" },
    { num: "4.", stem: "What benefit does this activity bring?", options: ["Good health and relaxation", "New toys", "Money"], correctAnswer: "Good health and relaxation" },
    { num: "5.", stem: "They will meet again next ________.", options: ["Sunday", "Wednesday", "Friday"], correctAnswer: "Sunday" }
  ];

  // PART 2 (Listen True/False) - 5 câu
  const part2Questions1: ExamQuestionMcq[] = [
    { num: "6.", stem: "The green school campaign started last month.", options: ["A. True", "B. False"], correctAnswer: "A. True" },
    { num: "7.", stem: "Students planted more than two hundred trees.", options: ["A. True", "B. False"], correctAnswer: "A. True" },
    { num: "8.", stem: "They threw plastic bottles into the river.", options: ["A. True", "B. False"], correctAnswer: "B. False" },
    { num: "9.", stem: "Recycling paper helps protect green forests.", options: ["A. True", "B. False"], correctAnswer: "A. True" },
    { num: "10.", stem: "Joining community service makes students happy.", options: ["A. True", "B. False"], correctAnswer: "A. True" }
  ];

  const part2Questions2: ExamQuestionMcq[] = [
    { num: "6.", stem: "The green school campaign started last month.", options: ["A. True", "B. False"], correctAnswer: "A. True" },
    { num: "7.", stem: "Students planted more than two hundred trees.", options: ["A. True", "B. False"], correctAnswer: "A. True" },
    { num: "8.", stem: "They threw plastic bottles into the river.", options: ["A. True", "B. False"], correctAnswer: "B. False" },
    { num: "9.", stem: "Recycling paper helps protect green forests.", options: ["A. True", "B. False"], correctAnswer: "A. True" },
    { num: "10.", stem: "Joining community service makes students happy.", options: ["A. True", "B. False"], correctAnswer: "A. True" }
  ];

  // PART 4 (Cloze reading) - 5 câu
  const clozePassage = `Education is extremely important for secondary students. Every day, students attend classes to learn new academic subjects and practical (23) ________. Teachers always encourage students to work in teams (24) ________ they can help each other. In addition, students have access to (25) ________ large library with thousands of fascinating books. If students (26) ________ hard every day, they will achieve outstanding results and develop (27) ________.`;

  const part4Questions1: ExamQuestionMcq[] = [
    { num: "23.", stem: "", options: ["skills", "games", "candies"], correctAnswer: "skills" },
    { num: "24.", stem: "", options: ["so that", "because of", "although"], correctAnswer: "so that" },
    { num: "25.", stem: "", options: ["a", "an", "the"], correctAnswer: "a" },
    { num: "26.", stem: "", options: ["study", "studied", "studying"], correctAnswer: "study" },
    { num: "27.", stem: "", options: ["positively", "positive", "positivity"], correctAnswer: "positively" }
  ];

  const part4Questions2: ExamQuestionMcq[] = [
    { num: "23.", stem: "", options: ["skills", "candies", "games"], correctAnswer: "skills" },
    { num: "24.", stem: "", options: ["so that", "although", "because of"], correctAnswer: "so that" },
    { num: "25.", stem: "", options: ["a", "the", "an"], correctAnswer: "a" },
    { num: "26.", stem: "", options: ["study", "studying", "studied"], correctAnswer: "study" },
    { num: "27.", stem: "", options: ["positively", "positivity", "positive"], correctAnswer: "positively" }
  ];

  // PART 5 (Reading comprehension) - 5 câu
  const compPassage = `Our secondary school is famous for its friendly atmosphere and high academic standards. The school has bright classrooms, modern computer laboratories, and a spacious green schoolyard. Students participate actively in volunteer clubs, tree planting days, and English speaking contests. Teachers always provide helpful guidance and encourage students to become responsible citizens.`;

  const part5Questions1: ExamQuestionMcq[] = [
    { num: "28.", stem: "What is our secondary school famous for?", options: ["Friendly atmosphere and high academic standards", "Racing tracks", "Shopping centres"], correctAnswer: "Friendly atmosphere and high academic standards" },
    { num: "29.", stem: "What facilities does the school have?", options: ["Bright classrooms and computer laboratories", "Only a cafeteria", "Only a swimming pool"], correctAnswer: "Bright classrooms and computer laboratories" },
    { num: "30.", stem: "Which activities do students participate in?", options: ["Volunteer clubs and English speaking contests", "Only video games", "Only watching TV"], correctAnswer: "Volunteer clubs and English speaking contests" },
    { num: "31.", stem: "How do teachers help students?", options: ["Provide guidance and encouragement", "Give no homework", "Ignore students"], correctAnswer: "Provide guidance and encouragement" },
    { num: "32.", stem: "What is the school's overall goal?", options: ["To develop responsible citizens", "To make money", "To build cars"], correctAnswer: "To develop responsible citizens" }
  ];

  const part5Questions2: ExamQuestionMcq[] = [
    { num: "28.", stem: "What is our secondary school famous for?", options: ["Friendly atmosphere and high academic standards", "Shopping centres", "Racing tracks"], correctAnswer: "Friendly atmosphere and high academic standards" },
    { num: "29.", stem: "What facilities does the school have?", options: ["Bright classrooms and computer laboratories", "Only a swimming pool", "Only a cafeteria"], correctAnswer: "Bright classrooms and computer laboratories" },
    { num: "30.", stem: "Which activities do students participate in?", options: ["Volunteer clubs and English speaking contests", "Only watching TV", "Only video games"], correctAnswer: "Volunteer clubs and English speaking contests" },
    { num: "31.", stem: "How do teachers help students?", options: ["Provide guidance and encouragement", "Ignore students", "Give no homework"], correctAnswer: "Provide guidance and encouragement" },
    { num: "32.", stem: "What is the school's overall goal?", options: ["To develop responsible citizens", "To build cars", "To make money"], correctAnswer: "To develop responsible citizens" }
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
      ],
      correctAnswer: "It rained heavily, so we stayed at home."
    },
    {
      num: "34.",
      stem: "My brother likes playing badminton very much.",
      options: [
        "My brother is interested in playing badminton.",
        "My brother hates playing badminton.",
        "My brother enjoys to play badminton."
      ],
      correctAnswer: "My brother is interested in playing badminton."
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
      ],
      correctAnswer: "It rained heavily, so we stayed at home."
    },
    {
      num: "34.",
      stem: "My brother likes playing badminton very much.",
      options: [
        "My brother is interested in playing badminton.",
        "My brother enjoys to play badminton.",
        "My brother hates playing badminton."
      ],
      correctAnswer: "My brother is interested in playing badminton."
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
      ],
      correctAnswer: "Eating healthy food is good for health."
    },
    {
      num: "36.",
      stem: "learning / helps / knowledge / English / us / broaden / our.",
      options: [
        "Learning English helps us broaden our knowledge.",
        "Our knowledge helps us broaden learning English.",
        "Broaden our knowledge helps learning English us."
      ],
      correctAnswer: "Learning English helps us broaden our knowledge."
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
      ],
      correctAnswer: "Eating healthy food is good for health."
    },
    {
      num: "36.",
      stem: "learning / helps / knowledge / English / us / broaden / our.",
      options: [
        "Learning English helps us broaden our knowledge.",
        "Broaden our knowledge helps learning English us.",
        "Our knowledge helps us broaden learning English."
      ],
      correctAnswer: "Learning English helps us broaden our knowledge."
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
  const answerRows: ExamSuiteData['answerRows'] = [];

  const allAnsCode1: string[] = [
    "A", "A", "A", "A", "A",
    "A (True)", "A (True)", "B (False)", "A (True)", "A (True)",
    ...part3Answers1,
    "A (skills)", "A (so that)", "A (a)", "A (study)", "A (positively)",
    "A (Friendly atmosphere)", "A (Bright classrooms)", "A (Volunteer clubs)", "A (Provide guidance)", "A (To develop responsible)",
    "A", "A",
    "A", "A"
  ];

  const allAnsCode2: string[] = [
    "A", "A", "A", "A", "A",
    "A (True)", "A (True)", "B (False)", "A (True)", "A (True)",
    ...part3Answers2,
    "A (skills)", "A (so that)", "A (a)", "A (study)", "A (positively)",
    "A (Friendly atmosphere)", "A (Bright classrooms)", "A (Volunteer clubs)", "A (Provide guidance)", "A (To develop responsible)",
    "A", "A",
    "A", "A"
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

  // ĐỀ KIỂM TRA NÓI SPEAKING TEST CHÍNH THỨC CHO TỪNG KHỐI LỚP
  const speakingTest = SPEAKING_BANKS[grade] || SPEAKING_BANKS['6'];

  const scoreSummary = hasSpeaking
    ? `IV. TỔNG ĐIỂM TOÀN BÀI KIỂM TRA ${termTitle}: 10,0 ĐIỂM\n(Phần thi Viết: 8.0 điểm [Listening: 2.0đ, Language: 2.4đ, Reading: 2.0đ, Writing: 1.6đ] + Phần thi Nói: 2.0 điểm [Speaking Test: 2.0đ])`
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
    speakingTest,
    audioDialogue,
    audioMonologue,
    mcqTotalPts,
    answerRows,
    writingRubric,
    sampleWriting,
    scoreSummary
  };
}

/**
 * Xuất file Word HTML chuẩn 100% template của Thầy Đinh Văn Thành
 * Cố định trang chuẩn xác: ngắt trang đúng vị trí, không bị nhảy dòng/sang trang bừa bãi
 */
export function exportToWordHtml(suite: ExamSuiteData): string {
  const {
    code1, code2, grade, termTitle, schoolYear, parentAgency, schoolName, timeMinutes,
    matrixSubtitle, matrixHeaders, matrixRows,
    specSubtitle, specHeaders, specRows,
    examCode1, examCode2, speakingTest,
    audioDialogue, audioMonologue, mcqTotalPts, answerRows,
    writingRubric, sampleWriting, hasSpeaking, scoreSummary
  } = suite;

  // Render bảng điểm học sinh 3 hàng 4 cột
  const renderMarksTable = () => `
    <table style="width: 100%; border-collapse: collapse; margin-top: 4pt; margin-bottom: 8pt; page-break-inside: avoid;">
      <tr>
        <th colspan="2" style="border: 1px solid #000; padding: 3pt; text-align: center; font-size: 11.5pt; width: 25%;"><b>Marks</b></th>
        <th rowspan="2" style="border: 1px solid #000; padding: 3pt; text-align: center; font-size: 11.5pt; width: 15%;"><b>Total</b></th>
        <th rowspan="2" style="border: 1px solid #000; padding: 3pt; text-align: center; font-size: 11.5pt; width: 60%;"><b>Teacher’s remarks</b></th>
      </tr>
      <tr>
        <th style="border: 1px solid #000; padding: 2pt; text-align: center; font-size: 11.5pt; width: 12.5%;"><b>Speak</b></th>
        <th style="border: 1px solid #000; padding: 2pt; text-align: center; font-size: 11.5pt; width: 12.5%;"><b>Write</b></th>
      </tr>
      <tr style="height: 46pt;">
        <td style="border: 1px solid #000; padding: 2pt; text-align: center;">&nbsp;</td>
        <td style="border: 1px solid #000; padding: 2pt; text-align: center;">&nbsp;</td>
        <td style="border: 1px solid #000; padding: 2pt; text-align: center;">&nbsp;</td>
        <td style="border: 1px solid #000; padding: 4pt 8pt; vertical-align: top; font-size: 10.5pt; line-height: 1.6;">
          ___________________________________________________________<br/>
          ___________________________________________________________
        </td>
      </tr>
    </table>
  `;

  // Render đề thi cho một mã đề
  const renderExamContent = (exam: typeof examCode1) => {
    let html = `
      <table style="width: 100%; border: none; border-collapse: collapse; margin-bottom: 4pt; page-break-inside: avoid;">
        <tr>
          <td style="width: 40%; text-align: center; vertical-align: top; font-size: 11pt; border: none; padding: 0;">
            <b>${parentAgency}</b><br/>
            <b style="text-decoration: underline;">${schoolName}</b>
          </td>
          <td style="width: 60%; text-align: center; vertical-align: top; font-size: 11.5pt; border: none; padding: 0;">
            <b style="font-size: 12.5pt;">BÀI KIỂM TRA ĐÁNH GIÁ ${termTitle}</b><br/>
            <b>NĂM HỌC: ${schoolYear}</b><br/>
            <b>Môn: Tiếng Anh ${grade}</b><br/>
            <i>Thời gian: ${timeMinutes} phút</i>
          </td>
        </tr>
      </table>

      <div style="margin-top: 4pt; margin-bottom: 2pt; font-size: 12.5pt;">
        Full name: __________________________, &nbsp;&nbsp;&nbsp;&nbsp; Class: ${grade}A___ &nbsp;&nbsp;&nbsp;&nbsp; <b>Mã đề ${exam.code}</b>
      </div>

      ${renderMarksTable()}
    `;

    exam.parts.forEach(p => {
      html += `<div style="font-weight: bold; font-size: 12.5pt; margin-top: 6pt; margin-bottom: 2pt;">${p.title} (${p.points})</div>`;
      if (p.passage) {
        html += `<div style="text-align: justify; text-indent: 24pt; margin-top: 2pt; margin-bottom: 4pt; font-size: 12pt; line-height: 1.2;">${p.passage}</div>`;
      }
      p.questions.forEach(q => {
        html += `<div style="margin-top: 2pt; margin-bottom: 1pt; font-size: 12pt;"><b>${q.num}</b> ${q.stem}</div>`;
        if (q.options && q.options.length > 0) {
          html += `<div style="margin-left: 16pt; margin-bottom: 2pt; font-size: 12pt;">`;
          q.options.forEach((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const isCorrect = q.correctAnswer && (opt.trim() === q.correctAnswer.trim() || opt.startsWith(q.correctAnswer) || opt.includes(q.correctAnswer));
            html += `<span style="margin-right: 22pt;"><b>${opt.startsWith(letter + '.') ? '' : letter + '. '}</b>${isCorrect ? `<b style="color: #FF0000;">${opt}</b>` : opt}</span>`;
          });
          html += `</div>`;
        }
      });
    });

    html += `
      <div style="font-weight: bold; font-size: 12.5pt; margin-top: 6pt; margin-bottom: 2pt;">Part 8. Writing (${hasSpeaking ? '0.8 pt' : '1.5 pts'}) ${exam.writingPrompt}</div>
      <div style="font-style: italic; margin-left: 10pt; margin-bottom: 6pt; font-size: 12pt; white-space: pre-line;">${exam.writingCues}</div>
      <div style="text-align: center; font-weight: bold; margin-top: 14pt; margin-bottom: 6pt; font-size: 12pt;">------The end------</div>
      <div style="text-align: right; font-style: italic; font-weight: bold; font-size: 11pt;">Mã đề: ${exam.code}</div>
    `;

    return html;
  };

  // Render bảng kịch bản nói 4 cột
  const renderSpeakingScriptTable = (rows: [string, string, string, string][]) => `
    <table class="tbl-border" style="width: 100%; font-size: 9.5pt; margin-top: 4pt; margin-bottom: 8pt; page-break-inside: avoid;">
      <tr class="bg-head">
        <th style="width: 15%; text-align: center; padding: 4pt;"><b>To do</b></th>
        <th style="width: 33%; text-align: center; padding: 4pt;"><b>To say (Examiner)</b></th>
        <th style="width: 27%; text-align: center; padding: 4pt;"><b>Response (Students)</b></th>
        <th style="width: 25%; text-align: center; padding: 4pt;"><b>Back-up</b></th>
      </tr>
      ${rows.map(([todo, say, res, backup]) => `
        <tr>
          <td style="padding: 3pt; font-weight: bold; text-align: center;">${todo.replace(/\n/g, '<br/>')}</td>
          <td style="padding: 3pt;">${say.replace(/\n/g, '<br/>')}</td>
          <td style="padding: 3pt;">${res.replace(/\n/g, '<br/>')}</td>
          <td style="padding: 3pt;">${backup.replace(/\n/g, '<br/>')}</td>
        </tr>
      `).join('')}
    </table>
  `;

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
          margin: 12.7mm 15.2mm 12.7mm 15.2mm; /* Khổ A4 chuẩn 0.5in Top/Bottom, 0.6in Left/Right */
        }
        body {
          font-family: 'Times New Roman', Times, serif;
          font-size: 12.5pt;
          line-height: 1.15;
          color: #000000;
        }
        p, div {
          margin-top: 2pt;
          margin-bottom: 2pt;
          line-height: 1.15;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          page-break-inside: avoid;
        }
        tr {
          page-break-inside: avoid;
        }
        th, td {
          font-family: 'Times New Roman', Times, serif;
          vertical-align: middle;
        }
        .tbl-border th, .tbl-border td {
          border: 1px solid #000000;
          padding: 3pt 5pt;
        }
        .bg-head {
          background-color: #E8EEF5;
        }
        .bg-total {
          background-color: #F4F6F9;
        }
      </style>
    </head>
    <body>

      <!-- =================================================================== -->
      <!-- PHẦN 1: MA TRẬN & BẢN ĐẶC TẢ (CV 7991)                              -->
      <!-- =================================================================== -->
      <div style="text-align: center; margin-bottom: 8pt;">
        <div style="font-weight: bold; font-size: 11.5pt;">${parentAgency} - ${schoolName}</div>
        <div style="font-weight: bold; font-size: 12pt;">MA TRẬN ĐỀ KIỂM TRA ĐÁNH GIÁ ${termTitle} - NĂM HỌC ${schoolYear}</div>
        <div style="font-weight: bold; font-size: 11pt;">MÔN: TIẾNG ANH ${grade} (GLOBAL SUCCESS) - THỜI GIAN LÀM BÀI: ${timeMinutes} PHÚT</div>
        <div style="font-style: italic; font-size: 9.5pt;">${matrixSubtitle}</div>
      </div>

      <table class="tbl-border" style="font-size: 8pt; text-align: center; margin-bottom: 12pt; page-break-inside: avoid;">
        <tr class="bg-head">
          ${matrixHeaders.map(h => `<th style="padding: 3pt;"><b>${h}</b></th>`).join('')}
        </tr>
        ${matrixRows.map(row => {
          const isTotal = row[0].startsWith("TỔNG");
          const cls = isTotal ? 'class="bg-total"' : '';
          return `
            <tr ${cls}>
              ${row.map((val, idx) => `
                <td style="padding: 2.5pt; text-align: ${idx === 1 || idx === 2 ? 'left' : 'center'}; ${isTotal ? 'font-weight: bold;' : ''}">
                  ${val}
                </td>
              `).join('')}
            </tr>
          `;
        }).join('')}
      </table>

      <!-- Ngắt trang sang Bản Đặc Tả Kỹ Thuật -->
      <br clear="all" style="page-break-before: always; mso-break-type: section-break;" />

      <div style="text-align: center; margin-bottom: 8pt;">
        <div style="font-weight: bold; font-size: 11.5pt;">BẢN ĐẶC TẢ KỸ THUẬT ĐỀ KIỂM TRA ${termTitle} - TIẾNG ANH ${grade}</div>
        <div style="font-style: italic; font-size: 9.5pt;">${specSubtitle}</div>
      </div>

      <table class="tbl-border" style="font-size: 8pt; margin-bottom: 12pt; page-break-inside: avoid;">
        <tr class="bg-head">
          ${specHeaders.map(h => `<th style="text-align: center; padding: 3pt;"><b>${h}</b></th>`).join('')}
        </tr>
        ${specRows.map(row => `
          <tr>
            ${row.map((val, idx) => `
              <td style="padding: 2.5pt; text-align: ${[0, 4, 5, 6].includes(idx) ? 'center' : 'left'};">
                ${val.replace(/\n/g, '<br/>')}
              </td>
            `).join('')}
          </tr>
        `).join('')}
      </table>

      <!-- =================================================================== -->
      <!-- PHẦN 2: ĐỀ THI MÃ ĐỀ 1                                              -->
      <!-- =================================================================== -->
      <br clear="all" style="page-break-before: always; mso-break-type: section-break;" />
      ${renderExamContent(examCode1)}

      <!-- =================================================================== -->
      <!-- PHẦN 3: ĐỀ THI MÃ ĐỀ 2 (HOÁN VỊ)                                    -->
      <!-- =================================================================== -->
      <br clear="all" style="page-break-before: always; mso-break-type: section-break;" />
      ${renderExamContent(examCode2)}

      <!-- =================================================================== -->
      <!-- PHẦN 4: ĐỀ KIỂM TRA NÓI (SPEAKING TEST: 2.0 ĐIỂM)                   -->
      <!-- =================================================================== -->
      <br clear="all" style="page-break-before: always; mso-break-type: section-break;" />
      
      <table style="width: 100%; border: none; border-collapse: collapse; margin-bottom: 6pt; page-break-inside: avoid;">
        <tr>
          <td style="width: 45%; text-align: center; vertical-align: top; font-size: 11pt; border: none; padding: 0;">
            <b>${parentAgency}</b><br/>
            <b style="text-decoration: underline;">${schoolName}</b>
          </td>
          <td style="width: 55%; text-align: center; vertical-align: top; font-size: 11pt; border: none; padding: 0;">
            <b style="font-size: 12.5pt;">ĐỀ THI ĐÁNH GIÁ NĂNG LỰC NÓI (SPEAKING TEST)</b><br/>
            <b>MÔN: TIẾNG ANH ${grade} - HỌC KỲ: ${termTitle}</b><br/>
            <i>${speakingTest.subtitle}</i>
          </td>
        </tr>
      </table>

      <div style="background-color: #E8EEF5; padding: 4pt 8pt; border: 1px solid #B0C4DE; font-size: 10.5pt; font-weight: bold; text-align: center; margin-bottom: 8pt;">
        ${speakingTest.structureInfo}
      </div>

      <div style="font-weight: bold; font-size: 12pt; margin-top: 6pt; margin-bottom: 2pt;">
        OPENING – GREETINGS (Khởi động làm quen - Không tính điểm vào phase)
      </div>
      ${renderSpeakingScriptTable(speakingTest.openingRows)}

      <div style="font-weight: bold; font-size: 12pt; margin-top: 8pt; margin-bottom: 2pt;">
        ${speakingTest.phase1.title}
      </div>
      <div style="font-size: 10.5pt; color: #1E3A8A; font-weight: bold; margin-bottom: 2pt;">
        • Target competence: ${speakingTest.phase1.targetCompetence}
      </div>
      ${speakingTest.phase1.materialOrCard ? `<div style="font-size: 10.5pt; font-style: italic; margin-bottom: 3pt;">${speakingTest.phase1.materialOrCard}</div>` : ''}
      ${renderSpeakingScriptTable(speakingTest.phase1.scriptRows)}

      <div style="font-weight: bold; font-size: 12pt; margin-top: 8pt; margin-bottom: 2pt;">
        ${speakingTest.phase2.title}
      </div>
      <div style="font-size: 10.5pt; color: #1E3A8A; font-weight: bold; margin-bottom: 2pt;">
        • Target competence: ${speakingTest.phase2.targetCompetence}
      </div>
      ${speakingTest.phase2.materialOrCard ? `<div style="font-size: 10.5pt; font-style: italic; margin-bottom: 3pt; white-space: pre-line;">${speakingTest.phase2.materialOrCard}</div>` : ''}
      ${renderSpeakingScriptTable(speakingTest.phase2.scriptRows)}

      <div style="font-weight: bold; font-size: 12pt; margin-top: 8pt; margin-bottom: 2pt;">
        CLOSING (Kết thúc phần thi nói)
      </div>
      ${renderSpeakingScriptTable(speakingTest.closingRows)}

      <div style="font-weight: bold; font-size: 11.5pt; margin-top: 8pt; margin-bottom: 3pt;">
        TIÊU CHÍ VÀ BIỂU ĐIỂM CHẤM THI NÓI (SPEAKING RUBRIC: 2.0 ĐIỂM):
      </div>
      <table class="tbl-border" style="width: 100%; font-size: 9.5pt; margin-bottom: 8pt; page-break-inside: avoid;">
        <tr class="bg-head">
          <th style="width: 30%; text-align: center; padding: 3pt;"><b>Tiêu chí đánh giá</b></th>
          <th style="width: 15%; text-align: center; padding: 3pt;"><b>Điểm tối đa</b></th>
          <th style="width: 55%; text-align: center; padding: 3pt;"><b>Mô tả yêu cầu cần đạt</b></th>
        </tr>
        ${speakingTest.rubric.map(r => `
          <tr>
            <td style="padding: 3pt; font-weight: bold;">${r.criteria}</td>
            <td style="padding: 3pt; text-align: center; font-weight: bold;">${r.points}</td>
            <td style="padding: 3pt;">${r.description}</td>
          </tr>
        `).join('')}
      </table>

      <!-- =================================================================== -->
      <!-- PHẦN 5: HƯỚNG DẪN ĐÁP ÁN VÀ BIỂU ĐIỂM                              -->
      <!-- =================================================================== -->
      <br clear="all" style="page-break-before: always; mso-break-type: section-break;" />
      
      <div style="margin-bottom: 6pt;">
        <div style="font-weight: bold; font-size: 11pt; text-align: left;">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${parentAgency}<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;${schoolName}
        </div>
        <div style="text-align: center; margin-top: 2pt;">
          <div style="font-weight: bold; font-size: 14pt; color: #FF0000;">HƯỚNG DẪN ĐÁP ÁN VÀ BIỂU ĐIỂM</div>
          <div style="font-weight: bold; font-size: 13pt;">KIỂM TRA ĐÁNH GIÁ ${termTitle}</div>
          <div style="font-weight: bold; font-size: 12pt;">NĂM HỌC: ${schoolYear} - MÔN: TIẾNG ANH ${grade} (MÃ ĐỀ ${code1} & ${code2})</div>
        </div>
      </div>

      <div style="font-weight: bold; font-size: 12pt; margin-top: 8pt; margin-bottom: 4pt;">
        NỘI DUNG BÀI NGHE (AUDIO SCRIPTS - DÙNG CHO CẢ 2 MÃ ĐỀ)
      </div>

      <div style="font-weight: bold; font-size: 11.5pt; margin-bottom: 2pt;">Part 1. Listen and circle the best answer A, B, or C. (1.0 pt)</div>
      <div style="margin-left: 16pt; font-size: 11.5pt; line-height: 1.2; margin-bottom: 6pt;">
        ${audioDialogue.map(([spk, txt]) => `<div><b>${spk}</b>&nbsp;&nbsp;&nbsp;&nbsp;${txt}</div>`).join('')}
      </div>

      <div style="font-weight: bold; font-size: 11.5pt; margin-bottom: 2pt;">Part 2. Listen and circle the best answer A or B. (1.0 pt)</div>
      <div style="text-align: justify; text-indent: 24pt; font-size: 11.5pt; line-height: 1.2; margin-bottom: 10pt;">
        ${audioMonologue}
      </div>

      <div style="font-weight: bold; font-size: 12pt; color: #FF0000; margin-top: 8pt; margin-bottom: 4pt;">
        I. PHẦN TRẮC NGHIỆM KHÁCH QUAN (36 CÂU = ${mcqTotalPts} ĐIỂM TRÊN ĐỀ VIẾT)
      </div>

      <table class="tbl-border" style="font-size: 11pt; text-align: center; margin-bottom: 10pt; page-break-inside: avoid;">
        <tr class="bg-head">
          <th style="width: 12%; padding: 4pt;"><b>Câu</b></th>
          <th style="width: 38%; padding: 4pt;"><b>Đáp án MÃ ĐỀ ${code1}</b></th>
          <th style="width: 12%; padding: 4pt;"><b>Câu</b></th>
          <th style="width: 38%; padding: 4pt;"><b>Đáp án MÃ ĐỀ ${code2}</b></th>
        </tr>
        ${answerRows.map(row => `
          <tr>
            <td style="padding: 2.5pt; text-align: center; font-weight: bold;">${row.col1Num}</td>
            <td style="padding: 2.5pt; text-align: center; font-weight: bold; color: #FF0000;">${row.col1Ans}</td>
            <td style="padding: 2.5pt; text-align: center; font-weight: bold;">${row.col2Num}</td>
            <td style="padding: 2.5pt; text-align: center; font-weight: bold; color: #FF0000;">${row.col2Ans}</td>
          </tr>
        `).join('')}
      </table>

      <div style="font-weight: bold; font-size: 12pt; color: #FF0000; margin-top: 8pt; margin-bottom: 4pt;">
        II. PHẦN TỰ LUẬN VIẾT (PART 8: ${hasSpeaking ? '0.8 pt' : '1.5 pts'})
      </div>
      <div style="font-size: 11pt; margin-bottom: 4pt;">
        ${writingRubric.map(r => `<div>${r}</div>`).join('')}
      </div>
      <div style="font-weight: bold; font-style: italic; font-size: 11.5pt; margin-top: 4pt; margin-bottom: 2pt;">
        * Đoạn văn mẫu tham khảo (Sample writing):
      </div>
      <div style="text-align: justify; text-indent: 24pt; font-size: 11.5pt; line-height: 1.2; margin-bottom: 10pt; font-weight: bold; color: #FF0000;">
        ${sampleWriting}
      </div>

      <div style="font-weight: bold; font-size: 12pt; margin-top: 10pt;">
        ${scoreSummary.replace(/\n/g, '<br/>')}
      </div>

    </body>
    </html>
  `;
}
