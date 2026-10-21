// ================================================================
// officialMidtermExams.ts – Dữ liệu 12 Đề Kiểm Tra Giữa Kì 1 Chuẩn CV 7991/BGDĐT
// Khối 6 (Mã 601 - 606) & Khối 8 (Mã 801 - 806)
// Tác giả: Thầy Đinh Văn Thành – Trường THCS Đồng Yên
// ================================================================

export interface OfficialExamQuestion {
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
  correctLetter: string;
  explanation: string;
  passage?: string;
}

export interface OfficialMidtermExam {
  grade: number;
  examType: 'giua-ky-1';
  typeTitle: string;
  examCode: string;
  durationMinutes: number;
  totalQuestions: number;
  schoolName: string;
  teacherName: string;
  audioUrl: string;
  audioScript: string;
  passageText: string;
  writingRubric: string;
  sampleWritingText: string;
  questions: OfficialExamQuestion[];
}

export const OFFICIAL_MIDTERM_EXAMS_DATA: Record<number, Record<string, OfficialMidtermExam>> = {
  6: {
    '601': {
      grade: 6,
      examType: 'giua-ky-1',
      typeTitle: 'BÀI KIỂM TRA ĐÁNH GIÁ GIỮA HỌC KỲ I',
      examCode: '601',
      durationMinutes: 60,
      schoolName: 'TRƯỜNG THCS ĐỒNG YÊN',
      teacherName: 'Thầy Đinh Văn Thành',
      audioUrl: '/web-tieng-anh/audio/listening_6_gk1.mp3',
      audioScript: `🎧 Transcript bài nghe Part 1 (Hội thoại - 1 Giọng Nữ, 1 Giọng Nam):
Linda (Giọng Nữ):	Hi Peter! Welcome to my new house in the countryside.
Peter (Giọng Nam):	Wow Linda, your house is so beautiful! How many rooms are there?
Linda (Giọng Nữ):	There are six rooms: a living room, a kitchen, three bedrooms, and two bathrooms.
Peter (Giọng Nam):	Which room do you like best?
Linda (Giọng Nữ):	I love my bedroom because it has a big window overlooking our fruit garden.
Peter (Giọng Nam):	Is there a balcony upstairs?
Linda (Giọng Nữ):	Yes! We often sit on the balcony in the evening to drink tea and look at the stars.

🎧 Transcript bài nghe Part 2 (Độc thoại):
My uncle lives in a cozy country house near the river. In front of the house, there is a small pond with colorful fish and a flower garden. Behind the house, there is a vegetable garden where he grows fresh tomatoes and cabbages. The living room is bright with modern furniture, and the kitchen is always warm with delicious home-cooked meals.`,
      writingRubric: `1. Topic sentence: 0.25 pt
2. Supporting sentences: 0.25 pt
3. Range of vocabulary: 0.25 pt
4. Accuracy (Grammar, spelling): 0.25 pt. Total: 1.0 point.`,
      sampleWritingText: `I would like to tell you about my new school, Dong Yen Lower Secondary School. It is located in a quiet village with fresh air. The school has three modern buildings, twenty well-equipped classrooms, a large computer lab, and a green playground. My teachers are dedicated and enthusiastic, while my classmates are friendly and supportive. I always look forward to going to school every morning.`,
      passageText: `My best friend is Minh. We sit next to each other in class 6A. Minh is tall and slim with short black (23) ________ and bright brown eyes. He is very sporty and plays basketball exceptionally (24) ________. In addition, Minh is a kind-hearted boy who always shares his pencils and notebooks with friends. When our classmates don't understand English grammar, he (25) ________ explains the rules to them. At break time, we often (26) ________ jokes and laugh together. Having a loyal friend like Minh makes my school days truly (27) ________.`,
      totalQuestions: 37,
      questions: [
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 1,
                "id": "g6_gk1_601_q1",
                "type": "choice",
                "text": "Where is Linda's new house located?",
                "options": [
                        "In the countryside",
                        "In a crowded city",
                        "On an island"
                ],
                "correct": "In the countryside",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (In the countryside)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 2,
                "id": "g6_gk1_601_q2",
                "type": "choice",
                "text": "How many rooms are there in Linda's house?",
                "options": [
                        "Three rooms",
                        "Six rooms",
                        "Ten rooms"
                ],
                "correct": "Six rooms",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Six rooms)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 3,
                "id": "g6_gk1_601_q3",
                "type": "choice",
                "text": "Which room does Linda like best?",
                "options": [
                        "The kitchen",
                        "Her bedroom",
                        "The bathroom"
                ],
                "correct": "Her bedroom",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Her bedroom)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 4,
                "id": "g6_gk1_601_q4",
                "type": "choice",
                "text": "What can Linda see from her bedroom window?",
                "options": [
                        "A busy street",
                        "A fruit garden",
                        "A factory"
                ],
                "correct": "A fruit garden",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (A fruit garden)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 5,
                "id": "g6_gk1_601_q5",
                "type": "choice",
                "text": "What do Linda and her family do on the balcony in the evening?",
                "options": [
                        "Play computer games",
                        "Sleep outside",
                        "Sit to drink tea and look at stars"
                ],
                "correct": "Sit to drink tea and look at stars",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Sit to drink tea and look at stars)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 6,
                "id": "g6_gk1_601_q6",
                "type": "choice",
                "text": "Linda's uncle lives in a country house near the river.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 7,
                "id": "g6_gk1_601_q7",
                "type": "choice",
                "text": "There is a pond with colorful fish in front of the house.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 8,
                "id": "g6_gk1_601_q8",
                "type": "choice",
                "text": "There are no vegetables grown behind the house.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "False",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (False)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 9,
                "id": "g6_gk1_601_q9",
                "type": "choice",
                "text": "The living room is dark and has no furniture.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "False",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (False)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 10,
                "id": "g6_gk1_601_q10",
                "type": "choice",
                "text": "The country house has a warm and cozy atmosphere.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 11,
                "id": "g6_gk1_601_q11",
                "type": "choice",
                "text": "My father is reading a newspaper while my mother ________ tea.",
                "options": [
                        "drink",
                        "is drinking",
                        "drank",
                        "drinks"
                ],
                "correct": "is drinking",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (is drinking)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 12,
                "id": "g6_gk1_601_q12",
                "type": "choice",
                "text": "Minh is a ________ student. He learns things quickly and gets good marks in Maths.",
                "options": [
                        "clever",
                        "lazy",
                        "boring",
                        "noisy"
                ],
                "correct": "clever",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (clever)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 13,
                "id": "g6_gk1_601_q13",
                "type": "choice",
                "text": "Linh has big brown eyes and long wavy ________.",
                "options": [
                        "hair",
                        "ears",
                        "noses",
                        "cheeks"
                ],
                "correct": "hair",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (hair)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 14,
                "id": "g6_gk1_601_q14",
                "type": "choice",
                "text": "In our school, there is a large ________ with many interesting books and magazines.",
                "options": [
                        "kitchen",
                        "bedroom",
                        "bathroom",
                        "library"
                ],
                "correct": "library",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (library)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 15,
                "id": "g6_gk1_601_q15",
                "type": "choice",
                "text": "There ________ three bedrooms and a living room in our apartment.",
                "options": [
                        "have",
                        "are",
                        "has",
                        "is"
                ],
                "correct": "are",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (are)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 16,
                "id": "g6_gk1_601_q16",
                "type": "choice",
                "text": "The cat is sleeping peacefully ________ the sofa.",
                "options": [
                        "at",
                        "among",
                        "between",
                        "under"
                ],
                "correct": "under",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (under)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 17,
                "id": "g6_gk1_601_q17",
                "type": "choice",
                "text": "Teacher: Welcome to our new school year, class!' - Students: '________'",
                "options": [
                        "Good morning, teacher! We are excited.",
                        "Never mind.",
                        "Not at all.",
                        "Goodbye, see you later."
                ],
                "correct": "Good morning, teacher! We are excited.",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (Good morning, teacher! We are excited.)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 18,
                "id": "g6_gk1_601_q18",
                "type": "choice",
                "text": "They ________ to the English club twice a week.",
                "options": [
                        "go",
                        "are going",
                        "went",
                        "goes"
                ],
                "correct": "go",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (go)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 19,
                "id": "g6_gk1_601_q19",
                "type": "choice",
                "text": "Choose the word CLOSEST in meaning to calm and peaceful'.",
                "options": [
                        "narrow",
                        "quiet",
                        "noisy",
                        "crowded"
                ],
                "correct": "quiet",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (quiet)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 20,
                "id": "g6_gk1_601_q20",
                "type": "choice",
                "text": "Phong: Hello, Minh. What are you doing?' - Minh: '________'",
                "options": [
                        "I am twelve years old.",
                        "I am reading a book in the library.",
                        "It is on Tuesday.",
                        "Yes, I like English."
                ],
                "correct": "I am reading a book in the library.",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (I am reading a book in the library.)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 21,
                "id": "g6_gk1_601_q21",
                "type": "choice",
                "text": "Which word has the underlined part pronounced differently? rubber, teacher, father, prefer",
                "options": [
                        "prefer",
                        "father",
                        "rubber",
                        "teacher"
                ],
                "correct": "prefer",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (prefer)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 22,
                "id": "g6_gk1_601_q22",
                "type": "choice",
                "text": "Look! The teacher ________ into our classroom.",
                "options": [
                        "walk",
                        "walks",
                        "is walking",
                        "walked"
                ],
                "correct": "is walking",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (is walking)",
                "passage": ""
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 23,
                "id": "g6_gk1_601_q23",
                "type": "choice",
                "text": "Choose the best word for blank (23):",
                "options": [
                        "nose",
                        "cheeks",
                        "hair",
                        "mouth"
                ],
                "correct": "hair",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (hair)",
                "passage": "My best friend is Minh. We sit next to each other in class 6A. Minh is tall and slim with short black (23) ________ and bright brown eyes. He is very sporty and plays basketball exceptionally (24) ________. In addition, Minh is a kind-hearted boy who always shares his pencils and notebooks with friends. When our classmates don't understand English grammar, he (25) ________ explains the rules to them. At break time, we often (26) ________ jokes and laugh together. Having a loyal friend like Minh makes my school days truly (27) ________."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 24,
                "id": "g6_gk1_601_q24",
                "type": "choice",
                "text": "Choose the best word for blank (24):",
                "options": [
                        "slowly",
                        "poorly",
                        "badly",
                        "well"
                ],
                "correct": "well",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (well)",
                "passage": "My best friend is Minh. We sit next to each other in class 6A. Minh is tall and slim with short black (23) ________ and bright brown eyes. He is very sporty and plays basketball exceptionally (24) ________. In addition, Minh is a kind-hearted boy who always shares his pencils and notebooks with friends. When our classmates don't understand English grammar, he (25) ________ explains the rules to them. At break time, we often (26) ________ jokes and laugh together. Having a loyal friend like Minh makes my school days truly (27) ________."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 25,
                "id": "g6_gk1_601_q25",
                "type": "choice",
                "text": "Choose the best word for blank (25):",
                "options": [
                        "patiently",
                        "carelessly",
                        "rudely",
                        "angrily"
                ],
                "correct": "patiently",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (patiently)",
                "passage": "My best friend is Minh. We sit next to each other in class 6A. Minh is tall and slim with short black (23) ________ and bright brown eyes. He is very sporty and plays basketball exceptionally (24) ________. In addition, Minh is a kind-hearted boy who always shares his pencils and notebooks with friends. When our classmates don't understand English grammar, he (25) ________ explains the rules to them. At break time, we often (26) ________ jokes and laugh together. Having a loyal friend like Minh makes my school days truly (27) ________."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 26,
                "id": "g6_gk1_601_q26",
                "type": "choice",
                "text": "Choose the best word for blank (26):",
                "options": [
                        "make",
                        "listen",
                        "sing",
                        "tell"
                ],
                "correct": "tell",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (tell)",
                "passage": "My best friend is Minh. We sit next to each other in class 6A. Minh is tall and slim with short black (23) ________ and bright brown eyes. He is very sporty and plays basketball exceptionally (24) ________. In addition, Minh is a kind-hearted boy who always shares his pencils and notebooks with friends. When our classmates don't understand English grammar, he (25) ________ explains the rules to them. At break time, we often (26) ________ jokes and laugh together. Having a loyal friend like Minh makes my school days truly (27) ________."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 27,
                "id": "g6_gk1_601_q27",
                "type": "choice",
                "text": "Choose the best word for blank (27):",
                "options": [
                        "tiring",
                        "boring",
                        "memorable",
                        "difficult"
                ],
                "correct": "memorable",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (memorable)",
                "passage": "My best friend is Minh. We sit next to each other in class 6A. Minh is tall and slim with short black (23) ________ and bright brown eyes. He is very sporty and plays basketball exceptionally (24) ________. In addition, Minh is a kind-hearted boy who always shares his pencils and notebooks with friends. When our classmates don't understand English grammar, he (25) ________ explains the rules to them. At break time, we often (26) ________ jokes and laugh together. Having a loyal friend like Minh makes my school days truly (27) ________."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 28,
                "id": "g6_gk1_601_q28",
                "type": "choice",
                "text": "What is the main topic of the passage?",
                "options": [
                        "English classes in secondary schools",
                        "How to play football in the Mekong Delta",
                        "An Giang Secondary School and its student life",
                        "How to wash clothes in a boarding school"
                ],
                "correct": "An Giang Secondary School and its student life",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (An Giang Secondary School and its student life)",
                "passage": "An Giang Secondary School is a famous boarding school located in the Mekong Delta region. More than five hundred students from nearby villages study and live here during the weekdays. The school has modern facilities, including twenty large classrooms, three computer rooms, and a well-equipped science laboratory. Outside, there is an expansive sports field where students play football, volleyball, and badminton every afternoon. All students wear their dark blue uniforms from Monday to Friday. Living at a boarding school helps students become more independent. They learn how to wash their own clothes, tidy their bedrooms, and manage their daily study time. In the evening, teachers organize study halls to help students with difficult homework exercises. An Giang Secondary School provides a warm, supportive community that prepares students well for the future."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 29,
                "id": "g6_gk1_601_q29",
                "type": "choice",
                "text": "How many computer rooms does the school have?",
                "options": [
                        "Ten",
                        "Three",
                        "Twenty",
                        "Five"
                ],
                "correct": "Three",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Three)",
                "passage": "An Giang Secondary School is a famous boarding school located in the Mekong Delta region. More than five hundred students from nearby villages study and live here during the weekdays. The school has modern facilities, including twenty large classrooms, three computer rooms, and a well-equipped science laboratory. Outside, there is an expansive sports field where students play football, volleyball, and badminton every afternoon. All students wear their dark blue uniforms from Monday to Friday. Living at a boarding school helps students become more independent. They learn how to wash their own clothes, tidy their bedrooms, and manage their daily study time. In the evening, teachers organize study halls to help students with difficult homework exercises. An Giang Secondary School provides a warm, supportive community that prepares students well for the future."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 30,
                "id": "g6_gk1_601_q30",
                "type": "choice",
                "text": "The word expansive' in paragraph 2 is closest in meaning to ________.",
                "options": [
                        "very small",
                        "dark",
                        "large and wide",
                        "crowded and dirty"
                ],
                "correct": "large and wide",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (large and wide)",
                "passage": "An Giang Secondary School is a famous boarding school located in the Mekong Delta region. More than five hundred students from nearby villages study and live here during the weekdays. The school has modern facilities, including twenty large classrooms, three computer rooms, and a well-equipped science laboratory. Outside, there is an expansive sports field where students play football, volleyball, and badminton every afternoon. All students wear their dark blue uniforms from Monday to Friday. Living at a boarding school helps students become more independent. They learn how to wash their own clothes, tidy their bedrooms, and manage their daily study time. In the evening, teachers organize study halls to help students with difficult homework exercises. An Giang Secondary School provides a warm, supportive community that prepares students well for the future."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 31,
                "id": "g6_gk1_601_q31",
                "type": "choice",
                "text": "The word They' in paragraph 3 refers to ________.",
                "options": [
                        "classrooms",
                        "students",
                        "teachers",
                        "villages"
                ],
                "correct": "students",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (students)",
                "passage": "An Giang Secondary School is a famous boarding school located in the Mekong Delta region. More than five hundred students from nearby villages study and live here during the weekdays. The school has modern facilities, including twenty large classrooms, three computer rooms, and a well-equipped science laboratory. Outside, there is an expansive sports field where students play football, volleyball, and badminton every afternoon. All students wear their dark blue uniforms from Monday to Friday. Living at a boarding school helps students become more independent. They learn how to wash their own clothes, tidy their bedrooms, and manage their daily study time. In the evening, teachers organize study halls to help students with difficult homework exercises. An Giang Secondary School provides a warm, supportive community that prepares students well for the future."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 32,
                "id": "g6_gk1_601_q32",
                "type": "choice",
                "text": "Which of the following is NOT true according to the passage?",
                "options": [
                        "Students go home every night after school.",
                        "Students wear dark blue uniforms.",
                        "Living at the school helps students become more independent.",
                        "Students play sports on the field in the afternoon."
                ],
                "correct": "Students go home every night after school.",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (Students go home every night after school.)",
                "passage": "An Giang Secondary School is a famous boarding school located in the Mekong Delta region. More than five hundred students from nearby villages study and live here during the weekdays. The school has modern facilities, including twenty large classrooms, three computer rooms, and a well-equipped science laboratory. Outside, there is an expansive sports field where students play football, volleyball, and badminton every afternoon. All students wear their dark blue uniforms from Monday to Friday. Living at a boarding school helps students become more independent. They learn how to wash their own clothes, tidy their bedrooms, and manage their daily study time. In the evening, teachers organize study halls to help students with difficult homework exercises. An Giang Secondary School provides a warm, supportive community that prepares students well for the future."
        },
        {
                "part": "D",
                "partTitle": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "partInstruction": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "qNumber": 33,
                "id": "g6_gk1_601_q33",
                "type": "choice",
                "text": "I love reading science books in my free time.",
                "options": [
                        "My hobby is reading science books at my free time.",
                        "My hobby are reading science books in my free time.",
                        "My hobby is reading science books in my free time.",
                        "My hobby is reading science books in my time free."
                ],
                "correct": "My hobby is reading science books in my free time.",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (My hobby is reading science books in my free time.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "partInstruction": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "qNumber": 34,
                "id": "g6_gk1_601_q34",
                "type": "choice",
                "text": "Her favourite subject at school is English.",
                "options": [
                        "Likes she English best of all school subjects.",
                        "She likes best English of all school subjects.",
                        "She likes English best of all subjects school.",
                        "She likes English best of all school subjects."
                ],
                "correct": "She likes English best of all school subjects.",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (She likes English best of all school subjects.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "partInstruction": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "qNumber": 35,
                "id": "g6_gk1_601_q35",
                "type": "choice",
                "text": "dinner / family / my / together / cooks / every / evening / .",
                "options": [
                        "Family my cooks dinner together every evening.",
                        "My family cooks dinner together evening every.",
                        "My family cooks dinner together every evening.",
                        "My family dinner cooks together every evening."
                ],
                "correct": "My family cooks dinner together every evening.",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (My family cooks dinner together every evening.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "partInstruction": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "qNumber": 36,
                "id": "g6_gk1_601_q36",
                "type": "choice",
                "text": "often / how / you / do / play / school / sports / after / ?",
                "options": [
                        "How often you do play sports after school?",
                        "How often do you play sports school after?",
                        "Often how do you play sports after school?",
                        "How often do you play sports after school?"
                ],
                "correct": "How often do you play sports after school?",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (How often do you play sports after school?)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 8. Writing (1.0 pt) Write a paragraph (50-60 words) describing your weekend plans with your friends.",
                "partInstruction": "Write a paragraph in English as requested below.",
                "qNumber": 37,
                "id": "g6_gk1_601_essay",
                "type": "essay",
                "text": "You should write about: Where you are going; Who you are going with; What activities you are planning to do; How you feel about the trip.\n------The end------",
                "options": [],
                "correct": "Written paragraph",
                "correctLetter": "",
                "explanation": "Tiêu chuẩn chấm (Rubric):\\n1. Topic sentence: 0.25 pt\n2. Supporting sentences: 0.25 pt\n3. Range of vocabulary: 0.25 pt\n4. Accuracy (Grammar, spelling): 0.25 pt. Total: 1.0 point.\\n\\nBài văn mẫu tham khảo:\\nI would like to tell you about my new school, Dong Yen Lower Secondary School. It is located in a quiet village with fresh air. The school has three modern buildings, twenty well-equipped classrooms, a large computer lab, and a green playground. My teachers are dedicated and enthusiastic, while my classmates are friendly and supportive. I always look forward to going to school every morning.",
                "passage": ""
        }
]
    },
    '602': {
      grade: 6,
      examType: 'giua-ky-1',
      typeTitle: 'BÀI KIỂM TRA ĐÁNH GIÁ GIỮA HỌC KỲ I',
      examCode: '602',
      durationMinutes: 60,
      schoolName: 'TRƯỜNG THCS ĐỒNG YÊN',
      teacherName: 'Thầy Đinh Văn Thành',
      audioUrl: '/web-tieng-anh/audio/listening_6_gk1.mp3',
      audioScript: `🎧 Transcript bài nghe Part 1 (Hội thoại - 1 Giọng Nữ, 1 Giọng Nam):
Linda (Giọng Nữ):	Hi Peter! Welcome to my new house in the countryside.
Peter (Giọng Nam):	Wow Linda, your house is so beautiful! How many rooms are there?
Linda (Giọng Nữ):	There are six rooms: a living room, a kitchen, three bedrooms, and two bathrooms.
Peter (Giọng Nam):	Which room do you like best?
Linda (Giọng Nữ):	I love my bedroom because it has a big window overlooking our fruit garden.
Peter (Giọng Nam):	Is there a balcony upstairs?
Linda (Giọng Nữ):	Yes! We often sit on the balcony in the evening to drink tea and look at the stars.

🎧 Transcript bài nghe Part 2 (Độc thoại):
My uncle lives in a cozy country house near the river. In front of the house, there is a small pond with colorful fish and a flower garden. Behind the house, there is a vegetable garden where he grows fresh tomatoes and cabbages. The living room is bright with modern furniture, and the kitchen is always warm with delicious home-cooked meals.`,
      writingRubric: `1. Topic sentence: 0.25 pt
2. Supporting sentences: 0.25 pt
3. Range of vocabulary: 0.25 pt
4. Accuracy (Grammar, spelling): 0.25 pt. Total: 1.0 point.`,
      sampleWritingText: `I would like to tell you about my new school, Dong Yen Lower Secondary School. It is located in a quiet village with fresh air. The school has three modern buildings, twenty well-equipped classrooms, a large computer lab, and a green playground. My teachers are dedicated and enthusiastic, while my classmates are friendly and supportive. I always look forward to going to school every morning.`,
      passageText: `Phong loves his new secondary school very much. Every morning, he wakes up at six oclock and puts on his clean school (23) ________. He walks to school with his neighbor, Duy. Their school has a large playground with many green (24) ________. In the classroom, students learn various subjects such as English, Maths, and Science. During break time, Phong and his classmates often go to the school (25) ________ to read comic books or play chess. The teachers are very friendly and always (26) ________ students when they face difficult exercises. Phong feels extremely (27) ________ to study in such a wonderful environment.`,
      totalQuestions: 37,
      questions: [
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 1,
                "id": "g6_gk1_602_q1",
                "type": "choice",
                "text": "Where is Linda's new house located?",
                "options": [
                        "In the countryside",
                        "In a crowded city",
                        "On an island"
                ],
                "correct": "In the countryside",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (In the countryside)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 2,
                "id": "g6_gk1_602_q2",
                "type": "choice",
                "text": "How many rooms are there in Linda's house?",
                "options": [
                        "Ten rooms",
                        "Six rooms",
                        "Three rooms"
                ],
                "correct": "Six rooms",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Six rooms)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 3,
                "id": "g6_gk1_602_q3",
                "type": "choice",
                "text": "Which room does Linda like best?",
                "options": [
                        "The bathroom",
                        "Her bedroom",
                        "The kitchen"
                ],
                "correct": "Her bedroom",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Her bedroom)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 4,
                "id": "g6_gk1_602_q4",
                "type": "choice",
                "text": "What can Linda see from her bedroom window?",
                "options": [
                        "A fruit garden",
                        "A busy street",
                        "A factory"
                ],
                "correct": "A fruit garden",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (A fruit garden)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 5,
                "id": "g6_gk1_602_q5",
                "type": "choice",
                "text": "What do Linda and her family do on the balcony in the evening?",
                "options": [
                        "Sleep outside",
                        "Play computer games",
                        "Sit to drink tea and look at stars"
                ],
                "correct": "Sit to drink tea and look at stars",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Sit to drink tea and look at stars)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 6,
                "id": "g6_gk1_602_q6",
                "type": "choice",
                "text": "Linda's uncle lives in a country house near the river.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 7,
                "id": "g6_gk1_602_q7",
                "type": "choice",
                "text": "There is a pond with colorful fish in front of the house.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 8,
                "id": "g6_gk1_602_q8",
                "type": "choice",
                "text": "There are no vegetables grown behind the house.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "False",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (False)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 9,
                "id": "g6_gk1_602_q9",
                "type": "choice",
                "text": "The living room is dark and has no furniture.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "False",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (False)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 10,
                "id": "g6_gk1_602_q10",
                "type": "choice",
                "text": "The country house has a warm and cozy atmosphere.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 11,
                "id": "g6_gk1_602_q11",
                "type": "choice",
                "text": "Listen! The birds ________ happily in the tall trees.",
                "options": [
                        "are singing",
                        "sings",
                        "sang",
                        "sing"
                ],
                "correct": "are singing",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (are singing)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 12,
                "id": "g6_gk1_602_q12",
                "type": "choice",
                "text": "Teacher: Welcome to our new school year, class!' - Students: '________'",
                "options": [
                        "Goodbye, see you later.",
                        "Good morning, teacher! We are excited.",
                        "Not at all.",
                        "Never mind."
                ],
                "correct": "Good morning, teacher! We are excited.",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Good morning, teacher! We are excited.)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 13,
                "id": "g6_gk1_602_q13",
                "type": "choice",
                "text": "The cat is sleeping peacefully ________ the sofa.",
                "options": [
                        "at",
                        "under",
                        "between",
                        "among"
                ],
                "correct": "under",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (under)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 14,
                "id": "g6_gk1_602_q14",
                "type": "choice",
                "text": "Which word has the underlined part pronounced differently? school, book, look, foot",
                "options": [
                        "look",
                        "foot",
                        "school",
                        "book"
                ],
                "correct": "school",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (school)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 15,
                "id": "g6_gk1_602_q15",
                "type": "choice",
                "text": "Anna has big brown eyes and long wavy ________.",
                "options": [
                        "cheeks",
                        "noses",
                        "hair",
                        "ears"
                ],
                "correct": "hair",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (hair)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 16,
                "id": "g6_gk1_602_q16",
                "type": "choice",
                "text": "Lan is very kind. She always ________ her classmates with difficult exercises.",
                "options": [
                        "helps",
                        "is helping",
                        "help",
                        "helping"
                ],
                "correct": "helps",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (helps)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 17,
                "id": "g6_gk1_602_q17",
                "type": "choice",
                "text": "My brother ________ judo twice a week at the sports center.",
                "options": [
                        "makes",
                        "plays",
                        "does",
                        "has"
                ],
                "correct": "does",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (does)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 18,
                "id": "g6_gk1_602_q18",
                "type": "choice",
                "text": "Choose the word OPPOSITE in meaning to hard-working'.",
                "options": [
                        "active",
                        "kind",
                        "lazy",
                        "friendly"
                ],
                "correct": "lazy",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (lazy)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 19,
                "id": "g6_gk1_602_q19",
                "type": "choice",
                "text": "Phong: Hello, Nam. What are you doing?' - Nam: '________'",
                "options": [
                        "I am twelve years old.",
                        "Yes, I like English.",
                        "I am reading a book in the library.",
                        "It is on Tuesday."
                ],
                "correct": "I am reading a book in the library.",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (I am reading a book in the library.)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 20,
                "id": "g6_gk1_602_q20",
                "type": "choice",
                "text": "Phong is a ________ student. He learns things quickly and gets good marks in Maths.",
                "options": [
                        "lazy",
                        "boring",
                        "clever",
                        "noisy"
                ],
                "correct": "clever",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (clever)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 21,
                "id": "g6_gk1_602_q21",
                "type": "choice",
                "text": "There is a large wooden wardrobe ________ the bed and the desk in my bedroom.",
                "options": [
                        "among",
                        "between",
                        "in front",
                        "under"
                ],
                "correct": "between",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (between)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 22,
                "id": "g6_gk1_602_q22",
                "type": "choice",
                "text": "There ________ three bedrooms and a living room in our apartment.",
                "options": [
                        "has",
                        "are",
                        "have",
                        "is"
                ],
                "correct": "are",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (are)",
                "passage": ""
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 23,
                "id": "g6_gk1_602_q23",
                "type": "choice",
                "text": "Choose the best word for blank (23):",
                "options": [
                        "hat",
                        "shoes",
                        "uniform",
                        "glasses"
                ],
                "correct": "uniform",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (uniform)",
                "passage": "Phong loves his new secondary school very much. Every morning, he wakes up at six oclock and puts on his clean school (23) ________. He walks to school with his neighbor, Duy. Their school has a large playground with many green (24) ________. In the classroom, students learn various subjects such as English, Maths, and Science. During break time, Phong and his classmates often go to the school (25) ________ to read comic books or play chess. The teachers are very friendly and always (26) ________ students when they face difficult exercises. Phong feels extremely (27) ________ to study in such a wonderful environment."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 24,
                "id": "g6_gk1_602_q24",
                "type": "choice",
                "text": "Choose the best word for blank (24):",
                "options": [
                        "boats",
                        "trees",
                        "buses",
                        "cars"
                ],
                "correct": "trees",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (trees)",
                "passage": "Phong loves his new secondary school very much. Every morning, he wakes up at six oclock and puts on his clean school (23) ________. He walks to school with his neighbor, Duy. Their school has a large playground with many green (24) ________. In the classroom, students learn various subjects such as English, Maths, and Science. During break time, Phong and his classmates often go to the school (25) ________ to read comic books or play chess. The teachers are very friendly and always (26) ________ students when they face difficult exercises. Phong feels extremely (27) ________ to study in such a wonderful environment."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 25,
                "id": "g6_gk1_602_q25",
                "type": "choice",
                "text": "Choose the best word for blank (25):",
                "options": [
                        "bedroom",
                        "kitchen",
                        "bathroom",
                        "library"
                ],
                "correct": "library",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (library)",
                "passage": "Phong loves his new secondary school very much. Every morning, he wakes up at six oclock and puts on his clean school (23) ________. He walks to school with his neighbor, Duy. Their school has a large playground with many green (24) ________. In the classroom, students learn various subjects such as English, Maths, and Science. During break time, Phong and his classmates often go to the school (25) ________ to read comic books or play chess. The teachers are very friendly and always (26) ________ students when they face difficult exercises. Phong feels extremely (27) ________ to study in such a wonderful environment."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 26,
                "id": "g6_gk1_602_q26",
                "type": "choice",
                "text": "Choose the best word for blank (26):",
                "options": [
                        "ignore",
                        "forget",
                        "help",
                        "shout"
                ],
                "correct": "help",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (help)",
                "passage": "Phong loves his new secondary school very much. Every morning, he wakes up at six oclock and puts on his clean school (23) ________. He walks to school with his neighbor, Duy. Their school has a large playground with many green (24) ________. In the classroom, students learn various subjects such as English, Maths, and Science. During break time, Phong and his classmates often go to the school (25) ________ to read comic books or play chess. The teachers are very friendly and always (26) ________ students when they face difficult exercises. Phong feels extremely (27) ________ to study in such a wonderful environment."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 27,
                "id": "g6_gk1_602_q27",
                "type": "choice",
                "text": "Choose the best word for blank (27):",
                "options": [
                        "happy",
                        "angry",
                        "sad",
                        "bored"
                ],
                "correct": "happy",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (happy)",
                "passage": "Phong loves his new secondary school very much. Every morning, he wakes up at six oclock and puts on his clean school (23) ________. He walks to school with his neighbor, Duy. Their school has a large playground with many green (24) ________. In the classroom, students learn various subjects such as English, Maths, and Science. During break time, Phong and his classmates often go to the school (25) ________ to read comic books or play chess. The teachers are very friendly and always (26) ________ students when they face difficult exercises. Phong feels extremely (27) ________ to study in such a wonderful environment."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 28,
                "id": "g6_gk1_602_q28",
                "type": "choice",
                "text": "The word She' in paragraph 2 refers to ________.",
                "options": [
                        "Lan",
                        "the teacher",
                        "the classmate",
                        "the author"
                ],
                "correct": "Lan",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (Lan)",
                "passage": "Lan has been my closest classmate since our first day in Grade 6. She is an energetic girl with a round face, smiling eyes, and long black hair tied in a neat ponytail. Lan is both intelligent and hard-working. She always finishes all her homework before going to bed and often gets high marks in Maths and Literature. Besides studying, Lan has a great passion for music. She has been playing the violin for three years and is a member of the school orchestra. Every Thursday afternoon, Lan practices diligently in the music room. What I admire most about Lan is her generous and caring personality. Whenever someone in our class feels unwell or sad, Lan is always the first person to offer comfort and help. We often ride our bicycles together to the park at weekends to draw pictures and enjoy the fresh breeze. I feel fortunate to have such a wonderful friend."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 29,
                "id": "g6_gk1_602_q29",
                "type": "choice",
                "text": "What is the best title for this passage?",
                "options": [
                        "Drawing Pictures in the Park",
                        "My Talented and Caring Friend Lan",
                        "A Busy Week at Secondary School",
                        "How to Play the Violin Well"
                ],
                "correct": "My Talented and Caring Friend Lan",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (My Talented and Caring Friend Lan)",
                "passage": "Lan has been my closest classmate since our first day in Grade 6. She is an energetic girl with a round face, smiling eyes, and long black hair tied in a neat ponytail. Lan is both intelligent and hard-working. She always finishes all her homework before going to bed and often gets high marks in Maths and Literature. Besides studying, Lan has a great passion for music. She has been playing the violin for three years and is a member of the school orchestra. Every Thursday afternoon, Lan practices diligently in the music room. What I admire most about Lan is her generous and caring personality. Whenever someone in our class feels unwell or sad, Lan is always the first person to offer comfort and help. We often ride our bicycles together to the park at weekends to draw pictures and enjoy the fresh breeze. I feel fortunate to have such a wonderful friend."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 30,
                "id": "g6_gk1_602_q30",
                "type": "choice",
                "text": "What do the author and Lan often do at weekends?",
                "options": [
                        "Perform in the school orchestra",
                        "Ride bicycles to the park and draw pictures",
                        "Study Maths and Literature at home",
                        "Practice the violin at school"
                ],
                "correct": "Ride bicycles to the park and draw pictures",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Ride bicycles to the park and draw pictures)",
                "passage": "Lan has been my closest classmate since our first day in Grade 6. She is an energetic girl with a round face, smiling eyes, and long black hair tied in a neat ponytail. Lan is both intelligent and hard-working. She always finishes all her homework before going to bed and often gets high marks in Maths and Literature. Besides studying, Lan has a great passion for music. She has been playing the violin for three years and is a member of the school orchestra. Every Thursday afternoon, Lan practices diligently in the music room. What I admire most about Lan is her generous and caring personality. Whenever someone in our class feels unwell or sad, Lan is always the first person to offer comfort and help. We often ride our bicycles together to the park at weekends to draw pictures and enjoy the fresh breeze. I feel fortunate to have such a wonderful friend."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 31,
                "id": "g6_gk1_602_q31",
                "type": "choice",
                "text": "How long has Lan been playing the violin?",
                "options": [
                        "For five months",
                        "For three years",
                        "For one year",
                        "For six years"
                ],
                "correct": "For three years",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (For three years)",
                "passage": "Lan has been my closest classmate since our first day in Grade 6. She is an energetic girl with a round face, smiling eyes, and long black hair tied in a neat ponytail. Lan is both intelligent and hard-working. She always finishes all her homework before going to bed and often gets high marks in Maths and Literature. Besides studying, Lan has a great passion for music. She has been playing the violin for three years and is a member of the school orchestra. Every Thursday afternoon, Lan practices diligently in the music room. What I admire most about Lan is her generous and caring personality. Whenever someone in our class feels unwell or sad, Lan is always the first person to offer comfort and help. We often ride our bicycles together to the park at weekends to draw pictures and enjoy the fresh breeze. I feel fortunate to have such a wonderful friend."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 32,
                "id": "g6_gk1_602_q32",
                "type": "choice",
                "text": "The word diligently' in paragraph 2 is closest in meaning to ________.",
                "options": [
                        "lazily and slowly",
                        "loudly",
                        "hard-workingly and carefully",
                        "angrily"
                ],
                "correct": "hard-workingly and carefully",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (hard-workingly and carefully)",
                "passage": "Lan has been my closest classmate since our first day in Grade 6. She is an energetic girl with a round face, smiling eyes, and long black hair tied in a neat ponytail. Lan is both intelligent and hard-working. She always finishes all her homework before going to bed and often gets high marks in Maths and Literature. Besides studying, Lan has a great passion for music. She has been playing the violin for three years and is a member of the school orchestra. Every Thursday afternoon, Lan practices diligently in the music room. What I admire most about Lan is her generous and caring personality. Whenever someone in our class feels unwell or sad, Lan is always the first person to offer comfort and help. We often ride our bicycles together to the park at weekends to draw pictures and enjoy the fresh breeze. I feel fortunate to have such a wonderful friend."
        },
        {
                "part": "D",
                "partTitle": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "partInstruction": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "qNumber": 33,
                "id": "g6_gk1_602_q33",
                "type": "choice",
                "text": "My house has a small garden in the front.",
                "options": [
                        "There is a small garden in front of my house.",
                        "There is a small garden at front of my house.",
                        "There are a small garden in front of my house.",
                        "There is a small garden in front of house my."
                ],
                "correct": "There is a small garden in front of my house.",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (There is a small garden in front of my house.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "partInstruction": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "qNumber": 34,
                "id": "g6_gk1_602_q34",
                "type": "choice",
                "text": "My brother drives his car to work every morning.",
                "options": [
                        "My brother to goes work by car every morning.",
                        "My brother goes to work by car every morning.",
                        "Brother my goes to work by car every morning.",
                        "My brother goes to work by car morning every."
                ],
                "correct": "My brother goes to work by car every morning.",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (My brother goes to work by car every morning.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "partInstruction": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "qNumber": 35,
                "id": "g6_gk1_602_q35",
                "type": "choice",
                "text": "dinner / family / my / together / cooks / every / evening / .",
                "options": [
                        "My family cooks dinner together every evening.",
                        "Family my cooks dinner together every evening.",
                        "My family cooks dinner together evening every.",
                        "My family dinner cooks together every evening."
                ],
                "correct": "My family cooks dinner together every evening.",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (My family cooks dinner together every evening.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "partInstruction": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "qNumber": 36,
                "id": "g6_gk1_602_q36",
                "type": "choice",
                "text": "listening / to / teacher / are / attentively / the / students / the / .",
                "options": [
                        "The students is listening to the teacher attentively.",
                        "The students are listening to the attentively teacher.",
                        "Students the are listening to the teacher attentively.",
                        "The students are listening to the teacher attentively."
                ],
                "correct": "The students are listening to the teacher attentively.",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (The students are listening to the teacher attentively.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 8. Writing (1.0 pt) Write a paragraph (50-60 words) describing a typical school day.",
                "partInstruction": "Write a paragraph in English as requested below.",
                "qNumber": 37,
                "id": "g6_gk1_602_essay",
                "type": "essay",
                "text": "You should write about: What time you wake up and get ready; How you travel to school; Your favourite lessons in the morning; Activities during recess and after school.\n------The end------",
                "options": [],
                "correct": "Written paragraph",
                "correctLetter": "",
                "explanation": "Tiêu chuẩn chấm (Rubric):\\n1. Topic sentence: 0.25 pt\n2. Supporting sentences: 0.25 pt\n3. Range of vocabulary: 0.25 pt\n4. Accuracy (Grammar, spelling): 0.25 pt. Total: 1.0 point.\\n\\nBài văn mẫu tham khảo:\\nI would like to tell you about my new school, Dong Yen Lower Secondary School. It is located in a quiet village with fresh air. The school has three modern buildings, twenty well-equipped classrooms, a large computer lab, and a green playground. My teachers are dedicated and enthusiastic, while my classmates are friendly and supportive. I always look forward to going to school every morning.",
                "passage": ""
        }
]
    },
    '603': {
      grade: 6,
      examType: 'giua-ky-1',
      typeTitle: 'BÀI KIỂM TRA ĐÁNH GIÁ GIỮA HỌC KỲ I',
      examCode: '603',
      durationMinutes: 60,
      schoolName: 'TRƯỜNG THCS ĐỒNG YÊN',
      teacherName: 'Thầy Đinh Văn Thành',
      audioUrl: '/web-tieng-anh/audio/listening_6_gk1.mp3',
      audioScript: `🎧 Transcript bài nghe Part 1 (Hội thoại - 1 Giọng Nữ, 1 Giọng Nam):
Linda (Giọng Nữ):	Hi Peter! Welcome to my new house in the countryside.
Peter (Giọng Nam):	Wow Linda, your house is so beautiful! How many rooms are there?
Linda (Giọng Nữ):	There are six rooms: a living room, a kitchen, three bedrooms, and two bathrooms.
Peter (Giọng Nam):	Which room do you like best?
Linda (Giọng Nữ):	I love my bedroom because it has a big window overlooking our fruit garden.
Peter (Giọng Nam):	Is there a balcony upstairs?
Linda (Giọng Nữ):	Yes! We often sit on the balcony in the evening to drink tea and look at the stars.

🎧 Transcript bài nghe Part 2 (Độc thoại):
My uncle lives in a cozy country house near the river. In front of the house, there is a small pond with colorful fish and a flower garden. Behind the house, there is a vegetable garden where he grows fresh tomatoes and cabbages. The living room is bright with modern furniture, and the kitchen is always warm with delicious home-cooked meals.`,
      writingRubric: `1. Topic sentence: 0.25 pt
2. Supporting sentences: 0.25 pt
3. Range of vocabulary: 0.25 pt
4. Accuracy (Grammar, spelling): 0.25 pt. Total: 1.0 point.`,
      sampleWritingText: `I would like to tell you about my new school, Dong Yen Lower Secondary School. It is located in a quiet village with fresh air. The school has three modern buildings, twenty well-equipped classrooms, a large computer lab, and a green playground. My teachers are dedicated and enthusiastic, while my classmates are friendly and supportive. I always look forward to going to school every morning.`,
      passageText: `Duy is my closest classmate in grade 6. He is tall and has short black hair with a (23) ________ face. He is very (24) ________ because he always gets good marks in maths and science. Besides studying, Duy is also very (25) ________ and plays basketball every afternoon. He has a great sense of humour and tells (26) ________ stories that make everyone laugh. I am lucky to have such a (27) ________ friend.`,
      totalQuestions: 37,
      questions: [
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 1,
                "id": "g6_gk1_603_q1",
                "type": "choice",
                "text": "Where is Linda's new house located?",
                "options": [
                        "In a crowded city",
                        "In the countryside",
                        "On an island"
                ],
                "correct": "In the countryside",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (In the countryside)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 2,
                "id": "g6_gk1_603_q2",
                "type": "choice",
                "text": "How many rooms are there in Linda's house?",
                "options": [
                        "Six rooms",
                        "Ten rooms",
                        "Three rooms"
                ],
                "correct": "Six rooms",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (Six rooms)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 3,
                "id": "g6_gk1_603_q3",
                "type": "choice",
                "text": "Which room does Linda like best?",
                "options": [
                        "Her bedroom",
                        "The bathroom",
                        "The kitchen"
                ],
                "correct": "Her bedroom",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (Her bedroom)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 4,
                "id": "g6_gk1_603_q4",
                "type": "choice",
                "text": "What can Linda see from her bedroom window?",
                "options": [
                        "A fruit garden",
                        "A factory",
                        "A busy street"
                ],
                "correct": "A fruit garden",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (A fruit garden)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 5,
                "id": "g6_gk1_603_q5",
                "type": "choice",
                "text": "What do Linda and her family do on the balcony in the evening?",
                "options": [
                        "Play computer games",
                        "Sit to drink tea and look at stars",
                        "Sleep outside"
                ],
                "correct": "Sit to drink tea and look at stars",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Sit to drink tea and look at stars)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 6,
                "id": "g6_gk1_603_q6",
                "type": "choice",
                "text": "Linda's uncle lives in a country house near the river.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 7,
                "id": "g6_gk1_603_q7",
                "type": "choice",
                "text": "There is a pond with colorful fish in front of the house.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 8,
                "id": "g6_gk1_603_q8",
                "type": "choice",
                "text": "There are no vegetables grown behind the house.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "False",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (False)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 9,
                "id": "g6_gk1_603_q9",
                "type": "choice",
                "text": "The living room is dark and has no furniture.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "False",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (False)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 10,
                "id": "g6_gk1_603_q10",
                "type": "choice",
                "text": "The country house has a warm and cozy atmosphere.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 11,
                "id": "g6_gk1_603_q11",
                "type": "choice",
                "text": "Hoa has big brown eyes and long wavy ________.",
                "options": [
                        "noses",
                        "ears",
                        "hair",
                        "cheeks"
                ],
                "correct": "hair",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (hair)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 12,
                "id": "g6_gk1_603_q12",
                "type": "choice",
                "text": "Choose the word CLOSEST in meaning to calm and peaceful'.",
                "options": [
                        "quiet",
                        "noisy",
                        "crowded",
                        "narrow"
                ],
                "correct": "quiet",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (quiet)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 13,
                "id": "g6_gk1_603_q13",
                "type": "choice",
                "text": "There ________ three bedrooms and a living room in our apartment.",
                "options": [
                        "are",
                        "is",
                        "have",
                        "has"
                ],
                "correct": "are",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (are)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 14,
                "id": "g6_gk1_603_q14",
                "type": "choice",
                "text": "The cat is sleeping peacefully ________ the sofa.",
                "options": [
                        "among",
                        "between",
                        "under",
                        "at"
                ],
                "correct": "under",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (under)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 15,
                "id": "g6_gk1_603_q15",
                "type": "choice",
                "text": "Binh: Hello, Nam. What are you doing?' - Nam: '________'",
                "options": [
                        "Yes, I like English.",
                        "I am twelve years old.",
                        "It is on Tuesday.",
                        "I am reading a book in the library."
                ],
                "correct": "I am reading a book in the library.",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (I am reading a book in the library.)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 16,
                "id": "g6_gk1_603_q16",
                "type": "choice",
                "text": "Teacher: Welcome to our new school year, class!' - Students: '________'",
                "options": [
                        "Good morning, teacher! We are excited.",
                        "Goodbye, see you later.",
                        "Not at all.",
                        "Never mind."
                ],
                "correct": "Good morning, teacher! We are excited.",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (Good morning, teacher! We are excited.)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 17,
                "id": "g6_gk1_603_q17",
                "type": "choice",
                "text": "Listen! The birds ________ happily in the tall trees.",
                "options": [
                        "sing",
                        "sang",
                        "sings",
                        "are singing"
                ],
                "correct": "are singing",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (are singing)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 18,
                "id": "g6_gk1_603_q18",
                "type": "choice",
                "text": "Which word has the underlined part pronounced differently? house, round, cousin, mouth",
                "options": [
                        "mouth",
                        "cousin",
                        "round",
                        "house"
                ],
                "correct": "cousin",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (cousin)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 19,
                "id": "g6_gk1_603_q19",
                "type": "choice",
                "text": "My father is reading a newspaper while my mother ________ tea.",
                "options": [
                        "drinks",
                        "is drinking",
                        "drink",
                        "drank"
                ],
                "correct": "is drinking",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (is drinking)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 20,
                "id": "g6_gk1_603_q20",
                "type": "choice",
                "text": "Choose the word OPPOSITE in meaning to hard-working'.",
                "options": [
                        "active",
                        "lazy",
                        "kind",
                        "friendly"
                ],
                "correct": "lazy",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (lazy)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 21,
                "id": "g6_gk1_603_q21",
                "type": "choice",
                "text": "There is a large wooden wardrobe ________ the bed and the desk in my bedroom.",
                "options": [
                        "among",
                        "under",
                        "in front",
                        "between"
                ],
                "correct": "between",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (between)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 22,
                "id": "g6_gk1_603_q22",
                "type": "choice",
                "text": "Look! The teacher ________ into our classroom.",
                "options": [
                        "walks",
                        "walk",
                        "walked",
                        "is walking"
                ],
                "correct": "is walking",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (is walking)",
                "passage": ""
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 23,
                "id": "g6_gk1_603_q23",
                "type": "choice",
                "text": "Choose the best word for blank (23):",
                "options": [
                        "straight",
                        "curly",
                        "round",
                        "tall"
                ],
                "correct": "round",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (round)",
                "passage": "Duy is my closest classmate in grade 6. He is tall and has short black hair with a (23) ________ face. He is very (24) ________ because he always gets good marks in maths and science. Besides studying, Duy is also very (25) ________ and plays basketball every afternoon. He has a great sense of humour and tells (26) ________ stories that make everyone laugh. I am lucky to have such a (27) ________ friend."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 24,
                "id": "g6_gk1_603_q24",
                "type": "choice",
                "text": "Choose the best word for blank (24):",
                "options": [
                        "clever",
                        "lazy",
                        "boring",
                        "shy"
                ],
                "correct": "clever",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (clever)",
                "passage": "Duy is my closest classmate in grade 6. He is tall and has short black hair with a (23) ________ face. He is very (24) ________ because he always gets good marks in maths and science. Besides studying, Duy is also very (25) ________ and plays basketball every afternoon. He has a great sense of humour and tells (26) ________ stories that make everyone laugh. I am lucky to have such a (27) ________ friend."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 25,
                "id": "g6_gk1_603_q25",
                "type": "choice",
                "text": "Choose the best word for blank (25):",
                "options": [
                        "rude",
                        "clumsy",
                        "quiet",
                        "sporty"
                ],
                "correct": "sporty",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (sporty)",
                "passage": "Duy is my closest classmate in grade 6. He is tall and has short black hair with a (23) ________ face. He is very (24) ________ because he always gets good marks in maths and science. Besides studying, Duy is also very (25) ________ and plays basketball every afternoon. He has a great sense of humour and tells (26) ________ stories that make everyone laugh. I am lucky to have such a (27) ________ friend."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 26,
                "id": "g6_gk1_603_q26",
                "type": "choice",
                "text": "Choose the best word for blank (26):",
                "options": [
                        "sad",
                        "funny",
                        "scary",
                        "serious"
                ],
                "correct": "funny",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (funny)",
                "passage": "Duy is my closest classmate in grade 6. He is tall and has short black hair with a (23) ________ face. He is very (24) ________ because he always gets good marks in maths and science. Besides studying, Duy is also very (25) ________ and plays basketball every afternoon. He has a great sense of humour and tells (26) ________ stories that make everyone laugh. I am lucky to have such a (27) ________ friend."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 27,
                "id": "g6_gk1_603_q27",
                "type": "choice",
                "text": "Choose the best word for blank (27):",
                "options": [
                        "kind",
                        "cold",
                        "selfish",
                        "nervous"
                ],
                "correct": "kind",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (kind)",
                "passage": "Duy is my closest classmate in grade 6. He is tall and has short black hair with a (23) ________ face. He is very (24) ________ because he always gets good marks in maths and science. Besides studying, Duy is also very (25) ________ and plays basketball every afternoon. He has a great sense of humour and tells (26) ________ stories that make everyone laugh. I am lucky to have such a (27) ________ friend."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 28,
                "id": "g6_gk1_603_q28",
                "type": "choice",
                "text": "According to the text, what do students do every Friday afternoon?",
                "options": [
                        "Water flowerbeds and pick up fallen leaves",
                        "Visit other schools in Da Lat",
                        "Take written exams in the lab",
                        "Plant pine trees in the forest"
                ],
                "correct": "Water flowerbeds and pick up fallen leaves",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (Water flowerbeds and pick up fallen leaves)",
                "passage": "Green Hills School is situated on a gentle slope surrounded by fragrant pine forests in Da Lat. Thanks to the cool highland climate, flowers blossom around the school gardens throughout the four seasons. The school building consists of three floors with spacious classrooms designed to capture plenty of natural sunlight. There is also a modern science lab where Grade 6 students conduct fascinating plant experiments. At the back of the school, students cultivate an organic vegetable garden where they grow cabbages, carrots, and strawberries. Teachers at Green Hills encourage students to care for the environment. Every Friday afternoon, students spend thirty minutes watering flowerbeds and picking up fallen leaves. Learning in such a green and serene environment inspires students to love nature and study with enthusiastic curiosity."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 29,
                "id": "g6_gk1_603_q29",
                "type": "choice",
                "text": "What do students grow in the organic vegetable garden?",
                "options": [
                        "Only pine trees and roses",
                        "Tea and coffee plants",
                        "Cabbages, carrots, and strawberries",
                        "Corn and wheat"
                ],
                "correct": "Cabbages, carrots, and strawberries",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Cabbages, carrots, and strawberries)",
                "passage": "Green Hills School is situated on a gentle slope surrounded by fragrant pine forests in Da Lat. Thanks to the cool highland climate, flowers blossom around the school gardens throughout the four seasons. The school building consists of three floors with spacious classrooms designed to capture plenty of natural sunlight. There is also a modern science lab where Grade 6 students conduct fascinating plant experiments. At the back of the school, students cultivate an organic vegetable garden where they grow cabbages, carrots, and strawberries. Teachers at Green Hills encourage students to care for the environment. Every Friday afternoon, students spend thirty minutes watering flowerbeds and picking up fallen leaves. Learning in such a green and serene environment inspires students to love nature and study with enthusiastic curiosity."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 30,
                "id": "g6_gk1_603_q30",
                "type": "choice",
                "text": "What is the passage mainly about?",
                "options": [
                        "The history of pine forests in Da Lat",
                        "Conducting plant experiments in a laboratory",
                        "Green Hills School in Da Lat and its green environment",
                        "How to grow strawberries in the highlands"
                ],
                "correct": "Green Hills School in Da Lat and its green environment",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Green Hills School in Da Lat and its green environment)",
                "passage": "Green Hills School is situated on a gentle slope surrounded by fragrant pine forests in Da Lat. Thanks to the cool highland climate, flowers blossom around the school gardens throughout the four seasons. The school building consists of three floors with spacious classrooms designed to capture plenty of natural sunlight. There is also a modern science lab where Grade 6 students conduct fascinating plant experiments. At the back of the school, students cultivate an organic vegetable garden where they grow cabbages, carrots, and strawberries. Teachers at Green Hills encourage students to care for the environment. Every Friday afternoon, students spend thirty minutes watering flowerbeds and picking up fallen leaves. Learning in such a green and serene environment inspires students to love nature and study with enthusiastic curiosity."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 31,
                "id": "g6_gk1_603_q31",
                "type": "choice",
                "text": "The word spacious' in paragraph 2 is closest in meaning to ________.",
                "options": [
                        "tiny and dark",
                        "narrow",
                        "crowded and noisy",
                        "large with lots of room"
                ],
                "correct": "large with lots of room",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (large with lots of room)",
                "passage": "Green Hills School is situated on a gentle slope surrounded by fragrant pine forests in Da Lat. Thanks to the cool highland climate, flowers blossom around the school gardens throughout the four seasons. The school building consists of three floors with spacious classrooms designed to capture plenty of natural sunlight. There is also a modern science lab where Grade 6 students conduct fascinating plant experiments. At the back of the school, students cultivate an organic vegetable garden where they grow cabbages, carrots, and strawberries. Teachers at Green Hills encourage students to care for the environment. Every Friday afternoon, students spend thirty minutes watering flowerbeds and picking up fallen leaves. Learning in such a green and serene environment inspires students to love nature and study with enthusiastic curiosity."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 32,
                "id": "g6_gk1_603_q32",
                "type": "choice",
                "text": "The word they' in paragraph 2 refers to ________.",
                "options": [
                        "classrooms",
                        "experiments",
                        "students",
                        "vegetable gardens"
                ],
                "correct": "students",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (students)",
                "passage": "Green Hills School is situated on a gentle slope surrounded by fragrant pine forests in Da Lat. Thanks to the cool highland climate, flowers blossom around the school gardens throughout the four seasons. The school building consists of three floors with spacious classrooms designed to capture plenty of natural sunlight. There is also a modern science lab where Grade 6 students conduct fascinating plant experiments. At the back of the school, students cultivate an organic vegetable garden where they grow cabbages, carrots, and strawberries. Teachers at Green Hills encourage students to care for the environment. Every Friday afternoon, students spend thirty minutes watering flowerbeds and picking up fallen leaves. Learning in such a green and serene environment inspires students to love nature and study with enthusiastic curiosity."
        },
        {
                "part": "D",
                "partTitle": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "partInstruction": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "qNumber": 33,
                "id": "g6_gk1_603_q33",
                "type": "choice",
                "text": "No house in the village is older than Mr. Phong's house.",
                "options": [
                        "Mr. Phong's house are the oldest house in the village.",
                        "Mr. Phong's house is the oldest house in the village.",
                        "Mr. Phong's house is the oldest house at the village.",
                        "Mr. Phong's house is the oldest house in village the."
                ],
                "correct": "Mr. Phong's house is the oldest house in the village.",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Mr. Phong's house is the oldest house in the village.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "partInstruction": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "qNumber": 34,
                "id": "g6_gk1_603_q34",
                "type": "choice",
                "text": "My house has a small garden in the front.",
                "options": [
                        "There is a small garden in front of my house.",
                        "There are a small garden in front of my house.",
                        "There is a small garden in front of house my.",
                        "There is a small garden at front of my house."
                ],
                "correct": "There is a small garden in front of my house.",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (There is a small garden in front of my house.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "partInstruction": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "qNumber": 35,
                "id": "g6_gk1_603_q35",
                "type": "choice",
                "text": "dinner / family / my / together / cooks / every / evening / .",
                "options": [
                        "Family my cooks dinner together every evening.",
                        "My family cooks dinner together every evening.",
                        "My family dinner cooks together every evening.",
                        "My family cooks dinner together evening every."
                ],
                "correct": "My family cooks dinner together every evening.",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (My family cooks dinner together every evening.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "partInstruction": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "qNumber": 36,
                "id": "g6_gk1_603_q36",
                "type": "choice",
                "text": "school / does / your / brother / walk / every / to / morning / ?",
                "options": [
                        "Does your walk brother to school every morning?",
                        "Does your brother walk to school morning every?",
                        "Your does brother walk to school every morning?",
                        "Does your brother walk to school every morning?"
                ],
                "correct": "Does your brother walk to school every morning?",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (Does your brother walk to school every morning?)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 8. Writing (1.0 pt) Write a paragraph (50-60 words) about what makes a good friend.",
                "partInstruction": "Write a paragraph in English as requested below.",
                "qNumber": 37,
                "id": "g6_gk1_603_essay",
                "type": "essay",
                "text": "You should write about: Important qualities of a good friend (honesty, kindness, helpfulness); How friends should support each other in study and life.\n------The end------",
                "options": [],
                "correct": "Written paragraph",
                "correctLetter": "",
                "explanation": "Tiêu chuẩn chấm (Rubric):\\n1. Topic sentence: 0.25 pt\n2. Supporting sentences: 0.25 pt\n3. Range of vocabulary: 0.25 pt\n4. Accuracy (Grammar, spelling): 0.25 pt. Total: 1.0 point.\\n\\nBài văn mẫu tham khảo:\\nI would like to tell you about my new school, Dong Yen Lower Secondary School. It is located in a quiet village with fresh air. The school has three modern buildings, twenty well-equipped classrooms, a large computer lab, and a green playground. My teachers are dedicated and enthusiastic, while my classmates are friendly and supportive. I always look forward to going to school every morning.",
                "passage": ""
        }
]
    },
    '604': {
      grade: 6,
      examType: 'giua-ky-1',
      typeTitle: 'BÀI KIỂM TRA ĐÁNH GIÁ GIỮA HỌC KỲ I',
      examCode: '604',
      durationMinutes: 60,
      schoolName: 'TRƯỜNG THCS ĐỒNG YÊN',
      teacherName: 'Thầy Đinh Văn Thành',
      audioUrl: '/web-tieng-anh/audio/listening_6_gk1.mp3',
      audioScript: `🎧 Transcript bài nghe Part 1 (Hội thoại - 1 Giọng Nữ, 1 Giọng Nam):
Linda (Giọng Nữ):	Hi Peter! Welcome to my new house in the countryside.
Peter (Giọng Nam):	Wow Linda, your house is so beautiful! How many rooms are there?
Linda (Giọng Nữ):	There are six rooms: a living room, a kitchen, three bedrooms, and two bathrooms.
Peter (Giọng Nam):	Which room do you like best?
Linda (Giọng Nữ):	I love my bedroom because it has a big window overlooking our fruit garden.
Peter (Giọng Nam):	Is there a balcony upstairs?
Linda (Giọng Nữ):	Yes! We often sit on the balcony in the evening to drink tea and look at the stars.

🎧 Transcript bài nghe Part 2 (Độc thoại):
My uncle lives in a cozy country house near the river. In front of the house, there is a small pond with colorful fish and a flower garden. Behind the house, there is a vegetable garden where he grows fresh tomatoes and cabbages. The living room is bright with modern furniture, and the kitchen is always warm with delicious home-cooked meals.`,
      writingRubric: `1. Topic sentence: 0.25 pt
2. Supporting sentences: 0.25 pt
3. Range of vocabulary: 0.25 pt
4. Accuracy (Grammar, spelling): 0.25 pt. Total: 1.0 point.`,
      sampleWritingText: `I would like to tell you about my new school, Dong Yen Lower Secondary School. It is located in a quiet village with fresh air. The school has three modern buildings, twenty well-equipped classrooms, a large computer lab, and a green playground. My teachers are dedicated and enthusiastic, while my classmates are friendly and supportive. I always look forward to going to school every morning.`,
      passageText: `After regular classes, students at Quang Trung Secondary School join various interesting (23) ________. Those who like music can join the guitar club where they practice new (24) ________ together. Artistic students prefer the art club to draw landscapes and make paper crafts. For active students, the sports club provides training in football, table tennis, and badminton. Joining these activities helps students (25) ________ new friends and develop important social skills. Everyone feels relaxed and full of (26) ________ after an active afternoon with their school (27) ________.`,
      totalQuestions: 36,
      questions: [
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 1,
                "id": "g6_gk1_604_q1",
                "type": "choice",
                "text": "Where is Linda's new house located?",
                "options": [
                        "In the countryside",
                        "In a crowded city",
                        "On an island"
                ],
                "correct": "In the countryside",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (In the countryside)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 2,
                "id": "g6_gk1_604_q2",
                "type": "choice",
                "text": "How many rooms are there in Linda's house?",
                "options": [
                        "Ten rooms",
                        "Three rooms",
                        "Six rooms"
                ],
                "correct": "Six rooms",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Six rooms)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 3,
                "id": "g6_gk1_604_q3",
                "type": "choice",
                "text": "Which room does Linda like best?",
                "options": [
                        "The kitchen",
                        "Her bedroom",
                        "The bathroom"
                ],
                "correct": "Her bedroom",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Her bedroom)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 4,
                "id": "g6_gk1_604_q4",
                "type": "choice",
                "text": "What can Linda see from her bedroom window?",
                "options": [
                        "A factory",
                        "A fruit garden",
                        "A busy street"
                ],
                "correct": "A fruit garden",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (A fruit garden)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 5,
                "id": "g6_gk1_604_q5",
                "type": "choice",
                "text": "What do Linda and her family do on the balcony in the evening?",
                "options": [
                        "Play computer games",
                        "Sit to drink tea and look at stars",
                        "Sleep outside"
                ],
                "correct": "Sit to drink tea and look at stars",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Sit to drink tea and look at stars)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 6,
                "id": "g6_gk1_604_q6",
                "type": "choice",
                "text": "Linda's uncle lives in a country house near the river.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 7,
                "id": "g6_gk1_604_q7",
                "type": "choice",
                "text": "There is a pond with colorful fish in front of the house.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 8,
                "id": "g6_gk1_604_q8",
                "type": "choice",
                "text": "There are no vegetables grown behind the house.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "False",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (False)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 9,
                "id": "g6_gk1_604_q9",
                "type": "choice",
                "text": "The living room is dark and has no furniture.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "False",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (False)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 10,
                "id": "g6_gk1_604_q10",
                "type": "choice",
                "text": "The country house has a warm and cozy atmosphere.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 11,
                "id": "g6_gk1_604_q11",
                "type": "choice",
                "text": "Do you often do your ________ right after coming home from school?",
                "options": [
                        "football",
                        "judo",
                        "homework",
                        "housework"
                ],
                "correct": "homework",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (homework)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 12,
                "id": "g6_gk1_604_q12",
                "type": "choice",
                "text": "There ________ a study lamp and two notebooks on my desk.",
                "options": [
                        "have",
                        "is",
                        "are",
                        "were"
                ],
                "correct": "is",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (is)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 13,
                "id": "g6_gk1_604_q13",
                "type": "choice",
                "text": "There is a modern air-conditioner ________ the wall above the bed.",
                "options": [
                        "on",
                        "in",
                        "at",
                        "to"
                ],
                "correct": "on",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (on)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 14,
                "id": "g6_gk1_604_q14",
                "type": "choice",
                "text": "Choose the word OPPOSITE in meaning to hard-working'.",
                "options": [
                        "friendly",
                        "kind",
                        "active",
                        "lazy"
                ],
                "correct": "lazy",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (lazy)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 15,
                "id": "g6_gk1_604_q15",
                "type": "choice",
                "text": "Minh is a ________ student. He learns things quickly and gets good marks in Maths.",
                "options": [
                        "boring",
                        "lazy",
                        "clever",
                        "noisy"
                ],
                "correct": "clever",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (clever)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 16,
                "id": "g6_gk1_604_q16",
                "type": "choice",
                "text": "Linda has big brown eyes and long wavy ________.",
                "options": [
                        "noses",
                        "cheeks",
                        "hair",
                        "ears"
                ],
                "correct": "hair",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (hair)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 17,
                "id": "g6_gk1_604_q17",
                "type": "choice",
                "text": "My father ________ dinner in the kitchen at the moment.",
                "options": [
                        "cooked",
                        "cook",
                        "is cooking",
                        "cooks"
                ],
                "correct": "is cooking",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (is cooking)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 18,
                "id": "g6_gk1_604_q18",
                "type": "choice",
                "text": "Which word has the underlined part pronounced differently? rubber, teacher, father, prefer",
                "options": [
                        "father",
                        "prefer",
                        "rubber",
                        "teacher"
                ],
                "correct": "prefer",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (prefer)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 19,
                "id": "g6_gk1_604_q19",
                "type": "choice",
                "text": "Teacher: Welcome to our new school year, class!' - Students: '________'",
                "options": [
                        "Not at all.",
                        "Good morning, teacher! We are excited.",
                        "Never mind.",
                        "Goodbye, see you later."
                ],
                "correct": "Good morning, teacher! We are excited.",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Good morning, teacher! We are excited.)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 20,
                "id": "g6_gk1_604_q20",
                "type": "choice",
                "text": "John: Hello, Mark. What are you doing?' - Mark: '________'",
                "options": [
                        "Yes, I like English.",
                        "It is on Tuesday.",
                        "I am reading a book in the library.",
                        "I am twelve years old."
                ],
                "correct": "I am reading a book in the library.",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (I am reading a book in the library.)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 21,
                "id": "g6_gk1_604_q21",
                "type": "choice",
                "text": "There ________ three bedrooms and a living room in our apartment.",
                "options": [
                        "has",
                        "have",
                        "are",
                        "is"
                ],
                "correct": "are",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (are)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 22,
                "id": "g6_gk1_604_q22",
                "type": "choice",
                "text": "They ________ to the English club twice a week.",
                "options": [
                        "are going",
                        "goes",
                        "go",
                        "went"
                ],
                "correct": "go",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (go)",
                "passage": ""
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 23,
                "id": "g6_gk1_604_q23",
                "type": "choice",
                "text": "Choose the best word for blank (23):",
                "options": [
                        "houses",
                        "clubs",
                        "rooms",
                        "buses"
                ],
                "correct": "clubs",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (clubs)",
                "passage": "After regular classes, students at Quang Trung Secondary School join various interesting (23) ________. Those who like music can join the guitar club where they practice new (24) ________ together. Artistic students prefer the art club to draw landscapes and make paper crafts. For active students, the sports club provides training in football, table tennis, and badminton. Joining these activities helps students (25) ________ new friends and develop important social skills. Everyone feels relaxed and full of (26) ________ after an active afternoon with their school (27) ________."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 24,
                "id": "g6_gk1_604_q24",
                "type": "choice",
                "text": "Choose the best word for blank (24):",
                "options": [
                        "sports",
                        "books",
                        "songs",
                        "games"
                ],
                "correct": "songs",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (songs)",
                "passage": "After regular classes, students at Quang Trung Secondary School join various interesting (23) ________. Those who like music can join the guitar club where they practice new (24) ________ together. Artistic students prefer the art club to draw landscapes and make paper crafts. For active students, the sports club provides training in football, table tennis, and badminton. Joining these activities helps students (25) ________ new friends and develop important social skills. Everyone feels relaxed and full of (26) ________ after an active afternoon with their school (27) ________."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 25,
                "id": "g6_gk1_604_q25",
                "type": "choice",
                "text": "Choose the best word for blank (25):",
                "options": [
                        "do",
                        "make",
                        "buy",
                        "take"
                ],
                "correct": "make",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (make)",
                "passage": "After regular classes, students at Quang Trung Secondary School join various interesting (23) ________. Those who like music can join the guitar club where they practice new (24) ________ together. Artistic students prefer the art club to draw landscapes and make paper crafts. For active students, the sports club provides training in football, table tennis, and badminton. Joining these activities helps students (25) ________ new friends and develop important social skills. Everyone feels relaxed and full of (26) ________ after an active afternoon with their school (27) ________."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 26,
                "id": "g6_gk1_604_q26",
                "type": "choice",
                "text": "Choose the best word for blank (26):",
                "options": [
                        "traffic",
                        "energy",
                        "pollution",
                        "stress"
                ],
                "correct": "energy",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (energy)",
                "passage": "After regular classes, students at Quang Trung Secondary School join various interesting (23) ________. Those who like music can join the guitar club where they practice new (24) ________ together. Artistic students prefer the art club to draw landscapes and make paper crafts. For active students, the sports club provides training in football, table tennis, and badminton. Joining these activities helps students (25) ________ new friends and develop important social skills. Everyone feels relaxed and full of (26) ________ after an active afternoon with their school (27) ________."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 27,
                "id": "g6_gk1_604_q27",
                "type": "choice",
                "text": "Choose the best word for blank (27):",
                "options": [
                        "mates",
                        "drivers",
                        "farmers",
                        "doctors"
                ],
                "correct": "mates",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (mates)",
                "passage": "After regular classes, students at Quang Trung Secondary School join various interesting (23) ________. Those who like music can join the guitar club where they practice new (24) ________ together. Artistic students prefer the art club to draw landscapes and make paper crafts. For active students, the sports club provides training in football, table tennis, and badminton. Joining these activities helps students (25) ________ new friends and develop important social skills. Everyone feels relaxed and full of (26) ________ after an active afternoon with their school (27) ________."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 28,
                "id": "g6_gk1_604_q28",
                "type": "choice",
                "text": "Why is mathematics Minh's favourite subject?",
                "options": [
                        "Because it has no exams",
                        "Because he loves solving challenging geometry puzzles",
                        "Because he can sleep during lessons",
                        "Because the teacher is his uncle"
                ],
                "correct": "Because he loves solving challenging geometry puzzles",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Because he loves solving challenging geometry puzzles)",
                "passage": "Minh has been my closest classmate since our first day in secondary school. He is a tall boy with a round face, bright dark eyes, and a very warm smile. Minh is extremely hard-working and always finishes all homework before going to bed. His favourite subject is mathematics because he loves solving challenging geometry puzzles. Whenever our classmates struggle with difficult exercises, Minh patiently sits down and explains the formulas step by step. He never shows impatience or arrogance toward anyone. In addition to academic excellence, Minh is also an enthusiastic swimmer. Every Saturday morning, we cycle together to the district sports club for swimming practice. Minh dreams of becoming a computer engineer who creates educational games for children. I am truly proud to have such a reliable and kind-hearted friend."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 29,
                "id": "g6_gk1_604_q29",
                "type": "choice",
                "text": "The word 'He' in paragraph 2 refers to ________.",
                "options": [
                        "The math teacher",
                        "Minh",
                        "The coach",
                        "The author"
                ],
                "correct": "Minh",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Minh)",
                "passage": "Minh has been my closest classmate since our first day in secondary school. He is a tall boy with a round face, bright dark eyes, and a very warm smile. Minh is extremely hard-working and always finishes all homework before going to bed. His favourite subject is mathematics because he loves solving challenging geometry puzzles. Whenever our classmates struggle with difficult exercises, Minh patiently sits down and explains the formulas step by step. He never shows impatience or arrogance toward anyone. In addition to academic excellence, Minh is also an enthusiastic swimmer. Every Saturday morning, we cycle together to the district sports club for swimming practice. Minh dreams of becoming a computer engineer who creates educational games for children. I am truly proud to have such a reliable and kind-hearted friend."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 30,
                "id": "g6_gk1_604_q30",
                "type": "choice",
                "text": "Which statement is TRUE about Minh?",
                "options": [
                        "He wants to become a professional swimmer.",
                        "He hates swimming.",
                        "He never does his homework on time.",
                        "He cycles to the sports club with the author on Saturdays."
                ],
                "correct": "He cycles to the sports club with the author on Saturdays.",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (He cycles to the sports club with the author on Saturdays.)",
                "passage": "Minh has been my closest classmate since our first day in secondary school. He is a tall boy with a round face, bright dark eyes, and a very warm smile. Minh is extremely hard-working and always finishes all homework before going to bed. His favourite subject is mathematics because he loves solving challenging geometry puzzles. Whenever our classmates struggle with difficult exercises, Minh patiently sits down and explains the formulas step by step. He never shows impatience or arrogance toward anyone. In addition to academic excellence, Minh is also an enthusiastic swimmer. Every Saturday morning, we cycle together to the district sports club for swimming practice. Minh dreams of becoming a computer engineer who creates educational games for children. I am truly proud to have such a reliable and kind-hearted friend."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 31,
                "id": "g6_gk1_604_q31",
                "type": "choice",
                "text": "The word reliable' in paragraph 3 is closest in meaning to ________.",
                "options": [
                        "slow and weak",
                        "trustworthy and dependable",
                        "careless and noisy",
                        "lazy"
                ],
                "correct": "trustworthy and dependable",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (trustworthy and dependable)",
                "passage": "Minh has been my closest classmate since our first day in secondary school. He is a tall boy with a round face, bright dark eyes, and a very warm smile. Minh is extremely hard-working and always finishes all homework before going to bed. His favourite subject is mathematics because he loves solving challenging geometry puzzles. Whenever our classmates struggle with difficult exercises, Minh patiently sits down and explains the formulas step by step. He never shows impatience or arrogance toward anyone. In addition to academic excellence, Minh is also an enthusiastic swimmer. Every Saturday morning, we cycle together to the district sports club for swimming practice. Minh dreams of becoming a computer engineer who creates educational games for children. I am truly proud to have such a reliable and kind-hearted friend."
        },
        {
                "part": "D",
                "partTitle": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "partInstruction": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "qNumber": 32,
                "id": "g6_gk1_604_q32",
                "type": "choice",
                "text": "Mark walks to school every morning.",
                "options": [
                        "Mark goes to school on foot morning every.",
                        "Mark goes to school on foot every morning.",
                        "Mark goes school to on foot every morning.",
                        "Goes mark to school on foot every morning."
                ],
                "correct": "Mark goes to school on foot every morning.",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Mark goes to school on foot every morning.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "partInstruction": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "qNumber": 33,
                "id": "g6_gk1_604_q33",
                "type": "choice",
                "text": "The cat is between the sofa and the bookshelf.",
                "options": [
                        "The sofa and the bookshelf are on both sides of the cat.",
                        "Sofa the and the bookshelf are on both sides of the cat.",
                        "The sofa and the bookshelf are on both sides of cat the.",
                        "The sofa and the bookshelf is on both sides of the cat."
                ],
                "correct": "The sofa and the bookshelf are on both sides of the cat.",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (The sofa and the bookshelf are on both sides of the cat.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "partInstruction": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "qNumber": 34,
                "id": "g6_gk1_604_q34",
                "type": "choice",
                "text": "dinner / family / my / together / cooks / every / evening / .",
                "options": [
                        "Family my cooks dinner together every evening.",
                        "My family cooks dinner together every evening.",
                        "My family dinner cooks together every evening.",
                        "My family cooks dinner together evening every."
                ],
                "correct": "My family cooks dinner together every evening.",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (My family cooks dinner together every evening.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "partInstruction": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "qNumber": 35,
                "id": "g6_gk1_604_q35",
                "type": "choice",
                "text": "kind / is / and / he / always / his / helps / friends / .",
                "options": [
                        "He is kind and always helps friends his.",
                        "Is he kind and always helps his friends.",
                        "He is kind and always helps his friends.",
                        "He are kind and always helps his friends."
                ],
                "correct": "He is kind and always helps his friends.",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (He is kind and always helps his friends.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 8. Writing (1.0 pt) Write a paragraph (50-60 words) about your favourite school subject.",
                "partInstruction": "Write a paragraph in English as requested below.",
                "qNumber": 36,
                "id": "g6_gk1_604_essay",
                "type": "essay",
                "text": "You should write about: What subject it is; How often you have it; Who your teacher is; Why you find this subject interesting and helpful.\n------The end------",
                "options": [],
                "correct": "Written paragraph",
                "correctLetter": "",
                "explanation": "Tiêu chuẩn chấm (Rubric):\\n1. Topic sentence: 0.25 pt\n2. Supporting sentences: 0.25 pt\n3. Range of vocabulary: 0.25 pt\n4. Accuracy (Grammar, spelling): 0.25 pt. Total: 1.0 point.\\n\\nBài văn mẫu tham khảo:\\nI would like to tell you about my new school, Dong Yen Lower Secondary School. It is located in a quiet village with fresh air. The school has three modern buildings, twenty well-equipped classrooms, a large computer lab, and a green playground. My teachers are dedicated and enthusiastic, while my classmates are friendly and supportive. I always look forward to going to school every morning.",
                "passage": ""
        }
]
    },
    '605': {
      grade: 6,
      examType: 'giua-ky-1',
      typeTitle: 'BÀI KIỂM TRA ĐÁNH GIÁ GIỮA HỌC KỲ I',
      examCode: '605',
      durationMinutes: 60,
      schoolName: 'TRƯỜNG THCS ĐỒNG YÊN',
      teacherName: 'Thầy Đinh Văn Thành',
      audioUrl: '/web-tieng-anh/audio/listening_6_gk1.mp3',
      audioScript: `🎧 Transcript bài nghe Part 1 (Hội thoại - 1 Giọng Nữ, 1 Giọng Nam):
Linda (Giọng Nữ):	Hi Peter! Welcome to my new house in the countryside.
Peter (Giọng Nam):	Wow Linda, your house is so beautiful! How many rooms are there?
Linda (Giọng Nữ):	There are six rooms: a living room, a kitchen, three bedrooms, and two bathrooms.
Peter (Giọng Nam):	Which room do you like best?
Linda (Giọng Nữ):	I love my bedroom because it has a big window overlooking our fruit garden.
Peter (Giọng Nam):	Is there a balcony upstairs?
Linda (Giọng Nữ):	Yes! We often sit on the balcony in the evening to drink tea and look at the stars.

🎧 Transcript bài nghe Part 2 (Độc thoại):
My uncle lives in a cozy country house near the river. In front of the house, there is a small pond with colorful fish and a flower garden. Behind the house, there is a vegetable garden where he grows fresh tomatoes and cabbages. The living room is bright with modern furniture, and the kitchen is always warm with delicious home-cooked meals.`,
      writingRubric: `1. Topic sentence: 0.25 pt
2. Supporting sentences: 0.25 pt
3. Range of vocabulary: 0.25 pt
4. Accuracy (Grammar, spelling): 0.25 pt. Total: 1.0 point.`,
      sampleWritingText: `I would like to tell you about my new school, Dong Yen Lower Secondary School. It is located in a quiet village with fresh air. The school has three modern buildings, twenty well-equipped classrooms, a large computer lab, and a green playground. My teachers are dedicated and enthusiastic, while my classmates are friendly and supportive. I always look forward to going to school every morning.`,
      passageText: `Mai is one of the most active girls in my class. She has long brown (23) ________ and bright, friendly eyes. Mai is very (24) ________ because she likes drawing and writing poems for the school bulletin board. Whenever someone has a problem with English homework, she is always (25) ________ to help them. At weekends, she often joins her friends to (26) ________ cycling around West Lake. Everyone in our class (27) ________ Mai.`,
      totalQuestions: 37,
      questions: [
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 1,
                "id": "g6_gk1_605_q1",
                "type": "choice",
                "text": "Where is Linda's new house located?",
                "options": [
                        "On an island",
                        "In the countryside",
                        "In a crowded city"
                ],
                "correct": "In the countryside",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (In the countryside)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 2,
                "id": "g6_gk1_605_q2",
                "type": "choice",
                "text": "How many rooms are there in Linda's house?",
                "options": [
                        "Ten rooms",
                        "Six rooms",
                        "Three rooms"
                ],
                "correct": "Six rooms",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Six rooms)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 3,
                "id": "g6_gk1_605_q3",
                "type": "choice",
                "text": "Which room does Linda like best?",
                "options": [
                        "Her bedroom",
                        "The kitchen",
                        "The bathroom"
                ],
                "correct": "Her bedroom",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (Her bedroom)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 4,
                "id": "g6_gk1_605_q4",
                "type": "choice",
                "text": "What can Linda see from her bedroom window?",
                "options": [
                        "A fruit garden",
                        "A busy street",
                        "A factory"
                ],
                "correct": "A fruit garden",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (A fruit garden)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 5,
                "id": "g6_gk1_605_q5",
                "type": "choice",
                "text": "What do Linda and her family do on the balcony in the evening?",
                "options": [
                        "Sit to drink tea and look at stars",
                        "Sleep outside",
                        "Play computer games"
                ],
                "correct": "Sit to drink tea and look at stars",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (Sit to drink tea and look at stars)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 6,
                "id": "g6_gk1_605_q6",
                "type": "choice",
                "text": "Linda's uncle lives in a country house near the river.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 7,
                "id": "g6_gk1_605_q7",
                "type": "choice",
                "text": "There is a pond with colorful fish in front of the house.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 8,
                "id": "g6_gk1_605_q8",
                "type": "choice",
                "text": "There are no vegetables grown behind the house.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "False",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (False)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 9,
                "id": "g6_gk1_605_q9",
                "type": "choice",
                "text": "The living room is dark and has no furniture.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "False",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (False)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 10,
                "id": "g6_gk1_605_q10",
                "type": "choice",
                "text": "The country house has a warm and cozy atmosphere.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 11,
                "id": "g6_gk1_605_q11",
                "type": "choice",
                "text": "Which word has the underlined part pronounced differently? watches, classes, apples, boxes",
                "options": [
                        "classes",
                        "apples",
                        "boxes",
                        "watches"
                ],
                "correct": "apples",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (apples)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 12,
                "id": "g6_gk1_605_q12",
                "type": "choice",
                "text": "Mark: Hello, Mark. What are you doing?' - Mark: '________'",
                "options": [
                        "It is on Tuesday.",
                        "I am twelve years old.",
                        "I am reading a book in the library.",
                        "Yes, I like English."
                ],
                "correct": "I am reading a book in the library.",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (I am reading a book in the library.)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 13,
                "id": "g6_gk1_605_q13",
                "type": "choice",
                "text": "The dog is lying ________ the table.",
                "options": [
                        "between",
                        "next",
                        "under",
                        "among"
                ],
                "correct": "under",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (under)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 14,
                "id": "g6_gk1_605_q14",
                "type": "choice",
                "text": "My father ________ dinner in the kitchen at the moment.",
                "options": [
                        "cooked",
                        "is cooking",
                        "cooks",
                        "cook"
                ],
                "correct": "is cooking",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (is cooking)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 15,
                "id": "g6_gk1_605_q15",
                "type": "choice",
                "text": "Phong is a ________ student. He learns things quickly and gets good marks in Maths.",
                "options": [
                        "boring",
                        "lazy",
                        "clever",
                        "noisy"
                ],
                "correct": "clever",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (clever)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 16,
                "id": "g6_gk1_605_q16",
                "type": "choice",
                "text": "The cat is sleeping peacefully ________ the sofa.",
                "options": [
                        "between",
                        "among",
                        "under",
                        "at"
                ],
                "correct": "under",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (under)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 17,
                "id": "g6_gk1_605_q17",
                "type": "choice",
                "text": "Teacher: Welcome to our new school year, class!' - Students: '________'",
                "options": [
                        "Good morning, teacher! We are excited.",
                        "Never mind.",
                        "Not at all.",
                        "Goodbye, see you later."
                ],
                "correct": "Good morning, teacher! We are excited.",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (Good morning, teacher! We are excited.)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 18,
                "id": "g6_gk1_605_q18",
                "type": "choice",
                "text": "There ________ three bedrooms and a living room in our apartment.",
                "options": [
                        "has",
                        "are",
                        "is",
                        "have"
                ],
                "correct": "are",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (are)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 19,
                "id": "g6_gk1_605_q19",
                "type": "choice",
                "text": "In our school, there is a large ________ with many interesting books and magazines.",
                "options": [
                        "bathroom",
                        "kitchen",
                        "bedroom",
                        "library"
                ],
                "correct": "library",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (library)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 20,
                "id": "g6_gk1_605_q20",
                "type": "choice",
                "text": "My uncle's family lives in a cozy ________ house in the quiet countryside.",
                "options": [
                        "apartment",
                        "skyscraper",
                        "town",
                        "country"
                ],
                "correct": "country",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (country)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 21,
                "id": "g6_gk1_605_q21",
                "type": "choice",
                "text": "Listen! The birds ________ happily in the tall trees.",
                "options": [
                        "sing",
                        "sang",
                        "sings",
                        "are singing"
                ],
                "correct": "are singing",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (are singing)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 22,
                "id": "g6_gk1_605_q22",
                "type": "choice",
                "text": "Choose the word OPPOSITE in meaning to hard-working'.",
                "options": [
                        "active",
                        "kind",
                        "lazy",
                        "friendly"
                ],
                "correct": "lazy",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (lazy)",
                "passage": ""
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 23,
                "id": "g6_gk1_605_q23",
                "type": "choice",
                "text": "Choose the best word for blank (23):",
                "options": [
                        "hair",
                        "cheeks",
                        "ears",
                        "teeth"
                ],
                "correct": "hair",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (hair)",
                "passage": "Mai is one of the most active girls in my class. She has long brown (23) ________ and bright, friendly eyes. Mai is very (24) ________ because she likes drawing and writing poems for the school bulletin board. Whenever someone has a problem with English homework, she is always (25) ________ to help them. At weekends, she often joins her friends to (26) ________ cycling around West Lake. Everyone in our class (27) ________ Mai."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 24,
                "id": "g6_gk1_605_q24",
                "type": "choice",
                "text": "Choose the best word for blank (24):",
                "options": [
                        "careless",
                        "impatient",
                        "lazy",
                        "creative"
                ],
                "correct": "creative",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (creative)",
                "passage": "Mai is one of the most active girls in my class. She has long brown (23) ________ and bright, friendly eyes. Mai is very (24) ________ because she likes drawing and writing poems for the school bulletin board. Whenever someone has a problem with English homework, she is always (25) ________ to help them. At weekends, she often joins her friends to (26) ________ cycling around West Lake. Everyone in our class (27) ________ Mai."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 25,
                "id": "g6_gk1_605_q25",
                "type": "choice",
                "text": "Choose the best word for blank (25):",
                "options": [
                        "ready",
                        "scared",
                        "afraid",
                        "tired"
                ],
                "correct": "ready",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (ready)",
                "passage": "Mai is one of the most active girls in my class. She has long brown (23) ________ and bright, friendly eyes. Mai is very (24) ________ because she likes drawing and writing poems for the school bulletin board. Whenever someone has a problem with English homework, she is always (25) ________ to help them. At weekends, she often joins her friends to (26) ________ cycling around West Lake. Everyone in our class (27) ________ Mai."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 26,
                "id": "g6_gk1_605_q26",
                "type": "choice",
                "text": "Choose the best word for blank (26):",
                "options": [
                        "go",
                        "take",
                        "play",
                        "do"
                ],
                "correct": "go",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (go)",
                "passage": "Mai is one of the most active girls in my class. She has long brown (23) ________ and bright, friendly eyes. Mai is very (24) ________ because she likes drawing and writing poems for the school bulletin board. Whenever someone has a problem with English homework, she is always (25) ________ to help them. At weekends, she often joins her friends to (26) ________ cycling around West Lake. Everyone in our class (27) ________ Mai."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 27,
                "id": "g6_gk1_605_q27",
                "type": "choice",
                "text": "Choose the best word for blank (27):",
                "options": [
                        "ignores",
                        "likes",
                        "hates",
                        "forgets"
                ],
                "correct": "likes",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (likes)",
                "passage": "Mai is one of the most active girls in my class. She has long brown (23) ________ and bright, friendly eyes. Mai is very (24) ________ because she likes drawing and writing poems for the school bulletin board. Whenever someone has a problem with English homework, she is always (25) ________ to help them. At weekends, she often joins her friends to (26) ________ cycling around West Lake. Everyone in our class (27) ________ Mai."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 28,
                "id": "g6_gk1_605_q28",
                "type": "choice",
                "text": "How many classrooms does the school have?",
                "options": [
                        "Ten",
                        "Twenty",
                        "Fifty",
                        "Two"
                ],
                "correct": "Twenty",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Twenty)",
                "passage": "An Giang Secondary School is a famous boarding school in the Mekong Delta. More than five hundred students study and live here during weekdays. The school has modern facilities, including twenty large classrooms, two computer labs, and a well-equipped science laboratory. Outside, there is an expansive sports field where students play football and badminton every afternoon. All students wear their dark blue uniforms from Monday to Friday. Living at a boarding school helps students become independent and responsible. They learn how to wash their own clothes, tidy their bedrooms, and manage their daily study schedule. In the evening, teachers organize study sessions to help students with difficult exercises. An Giang Secondary School provides a warm community that prepares students well for the future."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 29,
                "id": "g6_gk1_605_q29",
                "type": "choice",
                "text": "What is the main topic of the passage?",
                "options": [
                        "An Giang Secondary School and its student life",
                        "English classes in secondary school",
                        "How to wash clothes in boarding school",
                        "How to play football in the Mekong Delta"
                ],
                "correct": "An Giang Secondary School and its student life",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (An Giang Secondary School and its student life)",
                "passage": "An Giang Secondary School is a famous boarding school in the Mekong Delta. More than five hundred students study and live here during weekdays. The school has modern facilities, including twenty large classrooms, two computer labs, and a well-equipped science laboratory. Outside, there is an expansive sports field where students play football and badminton every afternoon. All students wear their dark blue uniforms from Monday to Friday. Living at a boarding school helps students become independent and responsible. They learn how to wash their own clothes, tidy their bedrooms, and manage their daily study schedule. In the evening, teachers organize study sessions to help students with difficult exercises. An Giang Secondary School provides a warm community that prepares students well for the future."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 30,
                "id": "g6_gk1_605_q30",
                "type": "choice",
                "text": "Which of the following is NOT true according to the passage?",
                "options": [
                        "Students play sports on the field in the afternoon.",
                        "Living at school helps students become independent.",
                        "Students wear dark blue uniforms.",
                        "Students go home every night after school."
                ],
                "correct": "Students go home every night after school.",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (Students go home every night after school.)",
                "passage": "An Giang Secondary School is a famous boarding school in the Mekong Delta. More than five hundred students study and live here during weekdays. The school has modern facilities, including twenty large classrooms, two computer labs, and a well-equipped science laboratory. Outside, there is an expansive sports field where students play football and badminton every afternoon. All students wear their dark blue uniforms from Monday to Friday. Living at a boarding school helps students become independent and responsible. They learn how to wash their own clothes, tidy their bedrooms, and manage their daily study schedule. In the evening, teachers organize study sessions to help students with difficult exercises. An Giang Secondary School provides a warm community that prepares students well for the future."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 31,
                "id": "g6_gk1_605_q31",
                "type": "choice",
                "text": "The word expansive' in paragraph 2 is closest in meaning to ________.",
                "options": [
                        "crowded and dirty",
                        "large and wide",
                        "very small",
                        "dark"
                ],
                "correct": "large and wide",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (large and wide)",
                "passage": "An Giang Secondary School is a famous boarding school in the Mekong Delta. More than five hundred students study and live here during weekdays. The school has modern facilities, including twenty large classrooms, two computer labs, and a well-equipped science laboratory. Outside, there is an expansive sports field where students play football and badminton every afternoon. All students wear their dark blue uniforms from Monday to Friday. Living at a boarding school helps students become independent and responsible. They learn how to wash their own clothes, tidy their bedrooms, and manage their daily study schedule. In the evening, teachers organize study sessions to help students with difficult exercises. An Giang Secondary School provides a warm community that prepares students well for the future."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 32,
                "id": "g6_gk1_605_q32",
                "type": "choice",
                "text": "The word They' in paragraph 3 refers to ________.",
                "options": [
                        "teachers",
                        "villages",
                        "classrooms",
                        "students"
                ],
                "correct": "students",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (students)",
                "passage": "An Giang Secondary School is a famous boarding school in the Mekong Delta. More than five hundred students study and live here during weekdays. The school has modern facilities, including twenty large classrooms, two computer labs, and a well-equipped science laboratory. Outside, there is an expansive sports field where students play football and badminton every afternoon. All students wear their dark blue uniforms from Monday to Friday. Living at a boarding school helps students become independent and responsible. They learn how to wash their own clothes, tidy their bedrooms, and manage their daily study schedule. In the evening, teachers organize study sessions to help students with difficult exercises. An Giang Secondary School provides a warm community that prepares students well for the future."
        },
        {
                "part": "D",
                "partTitle": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "partInstruction": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "qNumber": 33,
                "id": "g6_gk1_605_q33",
                "type": "choice",
                "text": "There is a large wardrobe in Linh's bedroom.",
                "options": [
                        "Linh's bedroom has a large wardrobe.",
                        "Linh's bedroom has a wardrobe large.",
                        "Bedroom linh's has a large wardrobe.",
                        "Linh's bedroom have a large wardrobe."
                ],
                "correct": "Linh's bedroom has a large wardrobe.",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (Linh's bedroom has a large wardrobe.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "partInstruction": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "qNumber": 34,
                "id": "g6_gk1_605_q34",
                "type": "choice",
                "text": "Mark rides his bicycle to school every morning.",
                "options": [
                        "Mark cycles school to every morning.",
                        "Mark cycles to school morning every.",
                        "Mark cycles to school every morning.",
                        "Cycles mark to school every morning."
                ],
                "correct": "Mark cycles to school every morning.",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Mark cycles to school every morning.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "partInstruction": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "qNumber": 35,
                "id": "g6_gk1_605_q35",
                "type": "choice",
                "text": "dinner / family / my / together / cooks / every / evening / .",
                "options": [
                        "My family cooks dinner together every evening.",
                        "My family dinner cooks together every evening.",
                        "Family my cooks dinner together every evening.",
                        "My family cooks dinner together evening every."
                ],
                "correct": "My family cooks dinner together every evening.",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (My family cooks dinner together every evening.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "partInstruction": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "qNumber": 36,
                "id": "g6_gk1_605_q36",
                "type": "choice",
                "text": "many / how / there / classrooms / are / school / your / in / ?",
                "options": [
                        "How many classrooms are there at your school?",
                        "How many classrooms is there in your school?",
                        "How many classrooms are there in your school?",
                        "How many classrooms are there in school your?"
                ],
                "correct": "How many classrooms are there in your school?",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (How many classrooms are there in your school?)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 8. Writing (1.0 pt) Write a paragraph (50-60 words) describing a creative classmate in your grade.",
                "partInstruction": "Write a paragraph in English as requested below.",
                "qNumber": 37,
                "id": "g6_gk1_605_essay",
                "type": "essay",
                "text": "You should write about: Who the classmate is; His/her creative talents (drawing, singing, writing); How he/she inspires others in class.\n------The end------",
                "options": [],
                "correct": "Written paragraph",
                "correctLetter": "",
                "explanation": "Tiêu chuẩn chấm (Rubric):\\n1. Topic sentence: 0.25 pt\n2. Supporting sentences: 0.25 pt\n3. Range of vocabulary: 0.25 pt\n4. Accuracy (Grammar, spelling): 0.25 pt. Total: 1.0 point.\\n\\nBài văn mẫu tham khảo:\\nI would like to tell you about my new school, Dong Yen Lower Secondary School. It is located in a quiet village with fresh air. The school has three modern buildings, twenty well-equipped classrooms, a large computer lab, and a green playground. My teachers are dedicated and enthusiastic, while my classmates are friendly and supportive. I always look forward to going to school every morning.",
                "passage": ""
        }
]
    },
    '606': {
      grade: 6,
      examType: 'giua-ky-1',
      typeTitle: 'BÀI KIỂM TRA ĐÁNH GIÁ GIỮA HỌC KỲ I',
      examCode: '606',
      durationMinutes: 60,
      schoolName: 'TRƯỜNG THCS ĐỒNG YÊN',
      teacherName: 'Thầy Đinh Văn Thành',
      audioUrl: '/web-tieng-anh/audio/listening_6_gk1.mp3',
      audioScript: `🎧 Transcript bài nghe Part 1 (Hội thoại - 1 Giọng Nữ, 1 Giọng Nam):
Linda (Giọng Nữ):	Hi Peter! Welcome to my new house in the countryside.
Peter (Giọng Nam):	Wow Linda, your house is so beautiful! How many rooms are there?
Linda (Giọng Nữ):	There are six rooms: a living room, a kitchen, three bedrooms, and two bathrooms.
Peter (Giọng Nam):	Which room do you like best?
Linda (Giọng Nữ):	I love my bedroom because it has a big window overlooking our fruit garden.
Peter (Giọng Nam):	Is there a balcony upstairs?
Linda (Giọng Nữ):	Yes! We often sit on the balcony in the evening to drink tea and look at the stars.

🎧 Transcript bài nghe Part 2 (Độc thoại):
My uncle lives in a cozy country house near the river. In front of the house, there is a small pond with colorful fish and a flower garden. Behind the house, there is a vegetable garden where he grows fresh tomatoes and cabbages. The living room is bright with modern furniture, and the kitchen is always warm with delicious home-cooked meals.`,
      writingRubric: `1. Topic sentence: 0.25 pt
2. Supporting sentences: 0.25 pt
3. Range of vocabulary: 0.25 pt
4. Accuracy (Grammar, spelling): 0.25 pt. Total: 1.0 point.`,
      sampleWritingText: `I would like to tell you about my new school, Dong Yen Lower Secondary School. It is located in a quiet village with fresh air. The school has three modern buildings, twenty well-equipped classrooms, a large computer lab, and a green playground. My teachers are dedicated and enthusiastic, while my classmates are friendly and supportive. I always look forward to going to school every morning.`,
      passageText: `I am very excited about my new secondary school. In the morning, I put on my neat school (23) ________ and walk to school with my best friend. Our classroom is on the second floor and has thirty wooden (24) ________. During break time, we often go to the school (25) ________ to read scientific magazines. The teachers are helpful and always (26) ________ us patiently. I feel really (27) ________ to study here.`,
      totalQuestions: 35,
      questions: [
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 1,
                "id": "g6_gk1_606_q1",
                "type": "choice",
                "text": "Where is Linda's new house located?",
                "options": [
                        "In the countryside",
                        "On an island",
                        "In a crowded city"
                ],
                "correct": "In the countryside",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (In the countryside)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 2,
                "id": "g6_gk1_606_q2",
                "type": "choice",
                "text": "How many rooms are there in Linda's house?",
                "options": [
                        "Six rooms",
                        "Ten rooms",
                        "Three rooms"
                ],
                "correct": "Six rooms",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (Six rooms)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 3,
                "id": "g6_gk1_606_q3",
                "type": "choice",
                "text": "Which room does Linda like best?",
                "options": [
                        "The bathroom",
                        "The kitchen",
                        "Her bedroom"
                ],
                "correct": "Her bedroom",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Her bedroom)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 4,
                "id": "g6_gk1_606_q4",
                "type": "choice",
                "text": "What can Linda see from her bedroom window?",
                "options": [
                        "A busy street",
                        "A fruit garden",
                        "A factory"
                ],
                "correct": "A fruit garden",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (A fruit garden)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 5,
                "id": "g6_gk1_606_q5",
                "type": "choice",
                "text": "What do Linda and her family do on the balcony in the evening?",
                "options": [
                        "Play computer games",
                        "Sleep outside",
                        "Sit to drink tea and look at stars"
                ],
                "correct": "Sit to drink tea and look at stars",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Sit to drink tea and look at stars)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 6,
                "id": "g6_gk1_606_q6",
                "type": "choice",
                "text": "Linda's uncle lives in a country house near the river.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 7,
                "id": "g6_gk1_606_q7",
                "type": "choice",
                "text": "There is a pond with colorful fish in front of the house.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 8,
                "id": "g6_gk1_606_q8",
                "type": "choice",
                "text": "There are no vegetables grown behind the house.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "False",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (False)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 9,
                "id": "g6_gk1_606_q9",
                "type": "choice",
                "text": "The living room is dark and has no furniture.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "False",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (False)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 10,
                "id": "g6_gk1_606_q10",
                "type": "choice",
                "text": "The country house has a warm and cozy atmosphere.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 11,
                "id": "g6_gk1_606_q11",
                "type": "choice",
                "text": "John: Hello, John. What are you doing?' - John: '________'",
                "options": [
                        "Yes, I like English.",
                        "It is on Tuesday.",
                        "I am reading a book in the library.",
                        "I am twelve years old."
                ],
                "correct": "I am reading a book in the library.",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (I am reading a book in the library.)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 12,
                "id": "g6_gk1_606_q12",
                "type": "choice",
                "text": "My uncle's family lives in a cozy ________ house in the quiet countryside.",
                "options": [
                        "town",
                        "apartment",
                        "skyscraper",
                        "country"
                ],
                "correct": "country",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (country)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 13,
                "id": "g6_gk1_606_q13",
                "type": "choice",
                "text": "There ________ a sink and a cooker in the modern kitchen.",
                "options": [
                        "am",
                        "are",
                        "is",
                        "be"
                ],
                "correct": "is",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (is)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 14,
                "id": "g6_gk1_606_q14",
                "type": "choice",
                "text": "Look! The teacher ________ into our classroom.",
                "options": [
                        "walked",
                        "walks",
                        "is walking",
                        "walk"
                ],
                "correct": "is walking",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (is walking)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 15,
                "id": "g6_gk1_606_q15",
                "type": "choice",
                "text": "Teacher: Welcome to our new school year, class!' - Students: '________'",
                "options": [
                        "Good morning, teacher! We are excited.",
                        "Not at all.",
                        "Never mind.",
                        "Goodbye, see you later."
                ],
                "correct": "Good morning, teacher! We are excited.",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (Good morning, teacher! We are excited.)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 16,
                "id": "g6_gk1_606_q16",
                "type": "choice",
                "text": "Which word has the underlined part pronounced differently? house, round, cousin, mouth",
                "options": [
                        "cousin",
                        "round",
                        "house",
                        "mouth"
                ],
                "correct": "cousin",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (cousin)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 17,
                "id": "g6_gk1_606_q17",
                "type": "choice",
                "text": "There ________ three bedrooms and a living room in our apartment.",
                "options": [
                        "have",
                        "has",
                        "is",
                        "are"
                ],
                "correct": "are",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (are)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 18,
                "id": "g6_gk1_606_q18",
                "type": "choice",
                "text": "Phong is a ________ student. He learns things quickly and gets good marks in Maths.",
                "options": [
                        "clever",
                        "noisy",
                        "lazy",
                        "boring"
                ],
                "correct": "clever",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (clever)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 19,
                "id": "g6_gk1_606_q19",
                "type": "choice",
                "text": "The cat is sleeping peacefully ________ the sofa.",
                "options": [
                        "among",
                        "at",
                        "under",
                        "between"
                ],
                "correct": "under",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (under)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 20,
                "id": "g6_gk1_606_q20",
                "type": "choice",
                "text": "Choose the word CLOSEST in meaning to calm and peaceful'.",
                "options": [
                        "crowded",
                        "narrow",
                        "noisy",
                        "quiet"
                ],
                "correct": "quiet",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (quiet)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 21,
                "id": "g6_gk1_606_q21",
                "type": "choice",
                "text": "Students must wear their school ________ on Mondays and Fridays.",
                "options": [
                        "uniform",
                        "shoes",
                        "bags",
                        "clothes"
                ],
                "correct": "uniform",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (uniform)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 22,
                "id": "g6_gk1_606_q22",
                "type": "choice",
                "text": "Linda is very kind. She always ________ her classmates with difficult exercises.",
                "options": [
                        "help",
                        "is helping",
                        "helps",
                        "helping"
                ],
                "correct": "helps",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (helps)",
                "passage": ""
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 23,
                "id": "g6_gk1_606_q23",
                "type": "choice",
                "text": "Choose the best word for blank (23):",
                "options": [
                        "coat",
                        "scarf",
                        "boots",
                        "uniform"
                ],
                "correct": "uniform",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (uniform)",
                "passage": "I am very excited about my new secondary school. In the morning, I put on my neat school (23) ________ and walk to school with my best friend. Our classroom is on the second floor and has thirty wooden (24) ________. During break time, we often go to the school (25) ________ to read scientific magazines. The teachers are helpful and always (26) ________ us patiently. I feel really (27) ________ to study here."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 24,
                "id": "g6_gk1_606_q24",
                "type": "choice",
                "text": "Choose the best word for blank (24):",
                "options": [
                        "fridges",
                        "desks",
                        "cookers",
                        "beds"
                ],
                "correct": "desks",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (desks)",
                "passage": "I am very excited about my new secondary school. In the morning, I put on my neat school (23) ________ and walk to school with my best friend. Our classroom is on the second floor and has thirty wooden (24) ________. During break time, we often go to the school (25) ________ to read scientific magazines. The teachers are helpful and always (26) ________ us patiently. I feel really (27) ________ to study here."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 25,
                "id": "g6_gk1_606_q25",
                "type": "choice",
                "text": "Choose the best word for blank (25):",
                "options": [
                        "attic",
                        "kitchen",
                        "library",
                        "bathroom"
                ],
                "correct": "library",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (library)",
                "passage": "I am very excited about my new secondary school. In the morning, I put on my neat school (23) ________ and walk to school with my best friend. Our classroom is on the second floor and has thirty wooden (24) ________. During break time, we often go to the school (25) ________ to read scientific magazines. The teachers are helpful and always (26) ________ us patiently. I feel really (27) ________ to study here."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 26,
                "id": "g6_gk1_606_q26",
                "type": "choice",
                "text": "Choose the best word for blank (26):",
                "options": [
                        "teach",
                        "ignore",
                        "shout",
                        "forget"
                ],
                "correct": "teach",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (teach)",
                "passage": "I am very excited about my new secondary school. In the morning, I put on my neat school (23) ________ and walk to school with my best friend. Our classroom is on the second floor and has thirty wooden (24) ________. During break time, we often go to the school (25) ________ to read scientific magazines. The teachers are helpful and always (26) ________ us patiently. I feel really (27) ________ to study here."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 27,
                "id": "g6_gk1_606_q27",
                "type": "choice",
                "text": "Choose the best word for blank (27):",
                "options": [
                        "bored",
                        "happy",
                        "angry",
                        "sad"
                ],
                "correct": "happy",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (happy)",
                "passage": "I am very excited about my new secondary school. In the morning, I put on my neat school (23) ________ and walk to school with my best friend. Our classroom is on the second floor and has thirty wooden (24) ________. During break time, we often go to the school (25) ________ to read scientific magazines. The teachers are helpful and always (26) ________ us patiently. I feel really (27) ________ to study here."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 28,
                "id": "g6_gk1_606_q28",
                "type": "choice",
                "text": "How long does Huy train every afternoon?",
                "options": [
                        "Three hours",
                        "Five hours",
                        "Thirty minutes",
                        "One hour"
                ],
                "correct": "Three hours",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (Three hours)",
                "passage": "My cousin Huy is thirteen years old and attends a sports academy in Da Nang. He is tall, lean, and possesses remarkable athletic agility. Huy's passion is badminton. He started practicing with his father at the age of seven and showed exceptional hand-eye coordination early on. Currently, he trains for three hours every afternoon under the guidance of professional coaches. Despite his rigorous training schedule, Huy never neglects his schoolwork, frequently scoring top grades in English and physics. Last month, Huy represented our city at the National Junior Badminton Championship and won a silver medal. His modesty and perseverance inspire all of his peers to pursue their passions relentlessly."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 29,
                "id": "g6_gk1_606_q29",
                "type": "choice",
                "text": "What medal did Huy win at the National Junior Championship?",
                "options": [
                        "No medal",
                        "A silver medal",
                        "A bronze medal",
                        "A gold medal"
                ],
                "correct": "A silver medal",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (A silver medal)",
                "passage": "My cousin Huy is thirteen years old and attends a sports academy in Da Nang. He is tall, lean, and possesses remarkable athletic agility. Huy's passion is badminton. He started practicing with his father at the age of seven and showed exceptional hand-eye coordination early on. Currently, he trains for three hours every afternoon under the guidance of professional coaches. Despite his rigorous training schedule, Huy never neglects his schoolwork, frequently scoring top grades in English and physics. Last month, Huy represented our city at the National Junior Badminton Championship and won a silver medal. His modesty and perseverance inspire all of his peers to pursue their passions relentlessly."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 30,
                "id": "g6_gk1_606_q30",
                "type": "choice",
                "text": "The word rigorous' in paragraph 2 is closest in meaning to ________.",
                "options": [
                        "demanding and strict",
                        "boring",
                        "easy and relaxing",
                        "useless"
                ],
                "correct": "demanding and strict",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (demanding and strict)",
                "passage": "My cousin Huy is thirteen years old and attends a sports academy in Da Nang. He is tall, lean, and possesses remarkable athletic agility. Huy's passion is badminton. He started practicing with his father at the age of seven and showed exceptional hand-eye coordination early on. Currently, he trains for three hours every afternoon under the guidance of professional coaches. Despite his rigorous training schedule, Huy never neglects his schoolwork, frequently scoring top grades in English and physics. Last month, Huy represented our city at the National Junior Badminton Championship and won a silver medal. His modesty and perseverance inspire all of his peers to pursue their passions relentlessly."
        },
        {
                "part": "D",
                "partTitle": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "partInstruction": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "qNumber": 31,
                "id": "g6_gk1_606_q31",
                "type": "choice",
                "text": "The lamp is next to the computer on my desk.",
                "options": [
                        "The computer is next to the lamp on my desk.",
                        "The computer is next to the lamp on desk my.",
                        "Computer the is next to the lamp on my desk.",
                        "The computer are next to the lamp on my desk."
                ],
                "correct": "The computer is next to the lamp on my desk.",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (The computer is next to the lamp on my desk.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "partInstruction": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "qNumber": 32,
                "id": "g6_gk1_606_q32",
                "type": "choice",
                "text": "No one in our class is taller than Minh.",
                "options": [
                        "Minh is the tallest student in our class.",
                        "Minh is as tall as other students.",
                        "Everyone in our class is tall.",
                        "Minh is shorter than everyone in our class."
                ],
                "correct": "Minh is the tallest student in our class.",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (Minh is the tallest student in our class.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "partInstruction": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "qNumber": 33,
                "id": "g6_gk1_606_q33",
                "type": "choice",
                "text": "dinner / family / my / together / cooks / every / evening / .",
                "options": [
                        "Family my cooks dinner together every evening.",
                        "My family cooks dinner together every evening.",
                        "My family cooks dinner together evening every.",
                        "My family dinner cooks together every evening."
                ],
                "correct": "My family cooks dinner together every evening.",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (My family cooks dinner together every evening.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "partInstruction": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "qNumber": 34,
                "id": "g6_gk1_606_q34",
                "type": "choice",
                "text": "listening / to / teacher / are / attentively / the / students / the / .",
                "options": [
                        "The students are listening to the teacher attentively.",
                        "The students is listening to the teacher attentively.",
                        "Students the are listening to the teacher attentively.",
                        "The students are listening to the attentively teacher."
                ],
                "correct": "The students are listening to the teacher attentively.",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (The students are listening to the teacher attentively.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 8. Writing (1.0 pt) Write a paragraph (50-60 words) describing your school uniform.",
                "partInstruction": "Write a paragraph in English as requested below.",
                "qNumber": 35,
                "id": "g6_gk1_606_essay",
                "type": "essay",
                "text": "You should write about: Colours and items of your uniform; Days you must wear it; How you feel when wearing it; The benefits of wearing school uniforms.\n------The end------",
                "options": [],
                "correct": "Written paragraph",
                "correctLetter": "",
                "explanation": "Tiêu chuẩn chấm (Rubric):\\n1. Topic sentence: 0.25 pt\n2. Supporting sentences: 0.25 pt\n3. Range of vocabulary: 0.25 pt\n4. Accuracy (Grammar, spelling): 0.25 pt. Total: 1.0 point.\\n\\nBài văn mẫu tham khảo:\\nI would like to tell you about my new school, Dong Yen Lower Secondary School. It is located in a quiet village with fresh air. The school has three modern buildings, twenty well-equipped classrooms, a large computer lab, and a green playground. My teachers are dedicated and enthusiastic, while my classmates are friendly and supportive. I always look forward to going to school every morning.",
                "passage": ""
        }
]
    },
  },
  8: {
    '801': {
      grade: 8,
      examType: 'giua-ky-1',
      typeTitle: 'BÀI KIỂM TRA ĐÁNH GIÁ GIỮA HỌC KỲ I',
      examCode: '801',
      durationMinutes: 60,
      schoolName: 'TRƯỜNG THCS ĐỒNG YÊN',
      teacherName: 'Thầy Đinh Văn Thành',
      audioUrl: '/web-tieng-anh/audio/listening_8_gk1.mp3',
      audioScript: `🎧 Transcript bài nghe Part 1 (Hội thoại - 1 Giọng Nam, 1 Giọng Nữ):
Jason (Giọng Nam):	Hi Hannah! Did you join any school clubs this academic year?
Hannah (Giọng Nữ):	Yes! I joined the Photography Club and the IT Club.
Jason (Giọng Nam):	Photography Club? That sounds fantastic! What do you photograph?
Hannah (Giọng Nữ):	We take pictures of campus life, nature, and historic architecture around town.
Jason (Giọng Nam):	Does joining clubs help you cope with school pressure?
Hannah (Giọng Nữ):	Definitely! It helps me make supportive friends, improve teamwork, and unwind after classes.

🎧 Transcript bài nghe Part 2 (Độc thoại):
Adolescence is an exciting time when teenagers explore new interests and develop social skills. Participating in extracurricular school clubs offers a safe, friendly space to share common passions. When feeling stressed about homework or exams, talking with friends and teachers helps teenagers overcome challenges with confidence.`,
      writingRubric: `1. Topic sentence: 0.25 pt
2. Supporting sentences: 0.25 pt
3. Range of vocabulary: 0.25 pt
4. Accuracy (Grammar, spelling): 0.25 pt. Total: 1.0 point.`,
      sampleWritingText: `Life in the countryside holds a special charm for me because of its profound tranquility and wholesome environment. Firstly, the atmosphere is refreshingly pure and unpolluted, far removed from urban smog and perpetual traffic noise. Rolling green hills, expansive golden rice fields, and meandering rivers offer breathtaking scenery. Secondly, the villagers are remarkably warm-hearted, compassionate, and always ready to assist one another during harvest times. Living close to nature brings me inner serenity and revitalizes my mental well-being.`,
      passageText: `Orienteering is an exhilarating outdoor navigation sport that (23) ________ cross-country trail running with tactical map-reading. Competitors use a magnetic compass and a detailed (24) ________ map to navigate between designated checkpoints scattered through dense forests. Every split-second decision (25) ________ calculating distance, elevation gain, and terrain navigability under physical fatigue. Running through pristine (26) ________ trails while cracking navigational puzzles gives participants an incomparable adrenaline surge. Orienteering (27) ________ athletic agility, spatial intellect, and fearless determination.`,
      totalQuestions: 37,
      questions: [
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 1,
                "id": "g8_gk1_801_q1",
                "type": "choice",
                "text": "Which two clubs did Jason join this year?",
                "options": [
                        "Music Club only",
                        "Cooking Club only",
                        "Photography Club and IT Club"
                ],
                "correct": "Photography Club and IT Club",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Photography Club and IT Club)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 2,
                "id": "g8_gk1_801_q2",
                "type": "choice",
                "text": "What does the Photography Club photograph?",
                "options": [
                        "Cars only",
                        "Campus life, nature, and architecture",
                        "Fast food only"
                ],
                "correct": "Campus life, nature, and architecture",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Campus life, nature, and architecture)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 3,
                "id": "g8_gk1_801_q3",
                "type": "choice",
                "text": "How does joining clubs help Jason?",
                "options": [
                        "Costs too much money",
                        "Makes him feel tired",
                        "Makes friends, improves teamwork, unwinds"
                ],
                "correct": "Makes friends, improves teamwork, unwinds",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Makes friends, improves teamwork, unwinds)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 4,
                "id": "g8_gk1_801_q4",
                "type": "choice",
                "text": "Who does Jason take pictures with?",
                "options": [
                        "Nobody",
                        "Strangers",
                        "Club members"
                ],
                "correct": "Club members",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Club members)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 5,
                "id": "g8_gk1_801_q5",
                "type": "choice",
                "text": "When do club activities help students?",
                "options": [
                        "Never",
                        "During midnight",
                        "After school classes"
                ],
                "correct": "After school classes",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (After school classes)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 6,
                "id": "g8_gk1_801_q6",
                "type": "choice",
                "text": "Adolescence is a time to explore new interests and social skills.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 7,
                "id": "g8_gk1_801_q7",
                "type": "choice",
                "text": "School clubs provide a safe space to share passions.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 8,
                "id": "g8_gk1_801_q8",
                "type": "choice",
                "text": "Teenagers should never talk to teachers when stressed.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "False",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (False)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 9,
                "id": "g8_gk1_801_q9",
                "type": "choice",
                "text": "Extracurricular activities help students overcome challenges.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 10,
                "id": "g8_gk1_801_q10",
                "type": "choice",
                "text": "Photography clubs only allow students to sleep.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "False",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (False)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 11,
                "id": "g8_gk1_801_q11",
                "type": "choice",
                "text": "David was tired after the football match, ________ he still did his homework.",
                "options": [
                        "or",
                        "so",
                        "because",
                        "yet"
                ],
                "correct": "yet",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (yet)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 12,
                "id": "g8_gk1_801_q12",
                "type": "choice",
                "text": "Farmers in our commune ________ rice on vast terraced fields every year.",
                "options": [
                        "cultivate",
                        "cultivated",
                        "will cultivate",
                        "are cultivating"
                ],
                "correct": "cultivate",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (cultivate)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 13,
                "id": "g8_gk1_801_q13",
                "type": "choice",
                "text": "Young teenagers often face peer ________ to fit in with their classmates.",
                "options": [
                        "pressure",
                        "freedom",
                        "leisure",
                        "club"
                ],
                "correct": "pressure",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (pressure)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 14,
                "id": "g8_gk1_801_q14",
                "type": "choice",
                "text": "During harvest time, farmers in my village work very ________ on the fields.",
                "options": [
                        "slow",
                        "hard",
                        "lazy",
                        "hardly"
                ],
                "correct": "hard",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (hard)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 15,
                "id": "g8_gk1_801_q15",
                "type": "choice",
                "text": "Nam loves ________ DIY models out of recycled paper in his leisure hours.",
                "options": [
                        "made",
                        "making",
                        "makes",
                        "make"
                ],
                "correct": "making",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (making)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 16,
                "id": "g8_gk1_801_q16",
                "type": "choice",
                "text": "Teacher: How is life in the countryside different from city life?' - Student: '________'",
                "options": [
                        "Cities have lots of cars.",
                        "Life in the countryside is more peaceful and the air is fresher.",
                        "Villages have rice fields.",
                        "I like living."
                ],
                "correct": "Life in the countryside is more peaceful and the air is fresher.",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Life in the countryside is more peaceful and the air is fresher.)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 17,
                "id": "g8_gk1_801_q17",
                "type": "choice",
                "text": "She did the test ________ than her classmates because she revised carefully.",
                "options": [
                        "well",
                        "good",
                        "better",
                        "more well"
                ],
                "correct": "better",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (better)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 18,
                "id": "g8_gk1_801_q18",
                "type": "choice",
                "text": "They ________ the annual village festival on the 15th of the lunar month.",
                "options": [
                        "have celebrated",
                        "celebrate",
                        "celebrated",
                        "are celebrating"
                ],
                "correct": "celebrated",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (celebrated)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 19,
                "id": "g8_gk1_801_q19",
                "type": "choice",
                "text": "Which word has the underlined part pronounced differently? stress, connect, pressure, peer",
                "options": [
                        "connect",
                        "pressure",
                        "peer",
                        "stress"
                ],
                "correct": "peer",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (peer)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 20,
                "id": "g8_gk1_801_q20",
                "type": "choice",
                "text": "Mother: You shouldn't spend too much time surfing social media.' - Teen: '________'",
                "options": [
                        "Yes, mom. I will balance my study and screen time.",
                        "No, I am not.",
                        "Social media is fun.",
                        "I have a new phone."
                ],
                "correct": "Yes, mom. I will balance my study and screen time.",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (Yes, mom. I will balance my study and screen time.)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 21,
                "id": "g8_gk1_801_q21",
                "type": "choice",
                "text": "Choose the word OPPOSITE in meaning to peaceful': Life in the countryside is very peaceful.'",
                "options": [
                        "noisy and chaotic",
                        "quiet",
                        "calm",
                        "serene"
                ],
                "correct": "noisy and chaotic",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (noisy and chaotic)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 22,
                "id": "g8_gk1_801_q22",
                "type": "choice",
                "text": "Choose the word CLOSEST in meaning to leisure': Teens spend leisure time browsing social networks.'",
                "options": [
                        "free time",
                        "sleep time",
                        "working hours",
                        "study hours"
                ],
                "correct": "free time",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (free time)",
                "passage": ""
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 23,
                "id": "g8_gk1_801_q23",
                "type": "choice",
                "text": "Choose the best word for blank (23):",
                "options": [
                        "peaceful",
                        "combines",
                        "creative",
                        "essential"
                ],
                "correct": "combines",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (combines)",
                "passage": "Orienteering is an exhilarating outdoor navigation sport that (23) ________ cross-country trail running with tactical map-reading. Competitors use a magnetic compass and a detailed (24) ________ map to navigate between designated checkpoints scattered through dense forests. Every split-second decision (25) ________ calculating distance, elevation gain, and terrain navigability under physical fatigue. Running through pristine (26) ________ trails while cracking navigational puzzles gives participants an incomparable adrenaline surge. Orienteering (27) ________ athletic agility, spatial intellect, and fearless determination."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 24,
                "id": "g8_gk1_801_q24",
                "type": "choice",
                "text": "Choose the best word for blank (24):",
                "options": [
                        "peaceful",
                        "creative",
                        "topographic",
                        "essential"
                ],
                "correct": "topographic",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (topographic)",
                "passage": "Orienteering is an exhilarating outdoor navigation sport that (23) ________ cross-country trail running with tactical map-reading. Competitors use a magnetic compass and a detailed (24) ________ map to navigate between designated checkpoints scattered through dense forests. Every split-second decision (25) ________ calculating distance, elevation gain, and terrain navigability under physical fatigue. Running through pristine (26) ________ trails while cracking navigational puzzles gives participants an incomparable adrenaline surge. Orienteering (27) ________ athletic agility, spatial intellect, and fearless determination."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 25,
                "id": "g8_gk1_801_q25",
                "type": "choice",
                "text": "Choose the best word for blank (25):",
                "options": [
                        "peaceful",
                        "essential",
                        "demands",
                        "creative"
                ],
                "correct": "demands",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (demands)",
                "passage": "Orienteering is an exhilarating outdoor navigation sport that (23) ________ cross-country trail running with tactical map-reading. Competitors use a magnetic compass and a detailed (24) ________ map to navigate between designated checkpoints scattered through dense forests. Every split-second decision (25) ________ calculating distance, elevation gain, and terrain navigability under physical fatigue. Running through pristine (26) ________ trails while cracking navigational puzzles gives participants an incomparable adrenaline surge. Orienteering (27) ________ athletic agility, spatial intellect, and fearless determination."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 26,
                "id": "g8_gk1_801_q26",
                "type": "choice",
                "text": "Choose the best word for blank (26):",
                "options": [
                        "woodland",
                        "peaceful",
                        "essential",
                        "creative"
                ],
                "correct": "woodland",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (woodland)",
                "passage": "Orienteering is an exhilarating outdoor navigation sport that (23) ________ cross-country trail running with tactical map-reading. Competitors use a magnetic compass and a detailed (24) ________ map to navigate between designated checkpoints scattered through dense forests. Every split-second decision (25) ________ calculating distance, elevation gain, and terrain navigability under physical fatigue. Running through pristine (26) ________ trails while cracking navigational puzzles gives participants an incomparable adrenaline surge. Orienteering (27) ________ athletic agility, spatial intellect, and fearless determination."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 27,
                "id": "g8_gk1_801_q27",
                "type": "choice",
                "text": "Choose the best word for blank (27):",
                "options": [
                        "peaceful",
                        "essential",
                        "builds",
                        "creative"
                ],
                "correct": "builds",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (builds)",
                "passage": "Orienteering is an exhilarating outdoor navigation sport that (23) ________ cross-country trail running with tactical map-reading. Competitors use a magnetic compass and a detailed (24) ________ map to navigate between designated checkpoints scattered through dense forests. Every split-second decision (25) ________ calculating distance, elevation gain, and terrain navigability under physical fatigue. Running through pristine (26) ________ trails while cracking navigational puzzles gives participants an incomparable adrenaline surge. Orienteering (27) ________ athletic agility, spatial intellect, and fearless determination."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 28,
                "id": "g8_gk1_801_q28",
                "type": "choice",
                "text": "According to the text, which of the following is highlighted?",
                "options": [
                        "Students must study alone without any guidance or support",
                        "Academic examinations are completely eliminated from school",
                        "Hundreds of wooden boats loaded with heaps of pineapples, wa...",
                        "Teenagers should avoid all physical recreation activities"
                ],
                "correct": "Hundreds of wooden boats loaded with heaps of pineapples, wa...",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Hundreds of wooden boats loaded with heaps of pineapples, wa...)",
                "passage": "Cai Rang floating market in Can Tho presents an intoxicating explosion of vibrant sights, sounds, and aromas. Hundreds of wooden boats loaded with heaps of pineapples, watermelons, and mangoes cluster along the river at dawn. Each boat displays its agricultural goods on a tall bamboo pole called a cây bẹo so buyers can see offerings from afar. Breakfast vendors weave skillfully through the flotilla, serving steaming bowls of hu tieu noodles directly across boat gunwales. Experiencing this lively floating commerce provides an unforgettable cultural encounter."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 29,
                "id": "g8_gk1_801_q29",
                "type": "choice",
                "text": "Which of the following is TRUE according to the passage?",
                "options": [
                        "Students should spend 24 hours a day on computer screens without resting.",
                        "Living environments have no impact on adolescent wellbeing.",
                        "Teachers strictly forbid students from developing any creative hobbies.",
                        "Engaging constructively in a day at a traditional floating market brings positive benefits for students."
                ],
                "correct": "Engaging constructively in a day at a traditional floating market brings positive benefits for students.",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (Engaging constructively in a day at a traditional floating market brings positive benefits for students.)",
                "passage": "Cai Rang floating market in Can Tho presents an intoxicating explosion of vibrant sights, sounds, and aromas. Hundreds of wooden boats loaded with heaps of pineapples, watermelons, and mangoes cluster along the river at dawn. Each boat displays its agricultural goods on a tall bamboo pole called a cây bẹo so buyers can see offerings from afar. Breakfast vendors weave skillfully through the flotilla, serving steaming bowls of hu tieu noodles directly across boat gunwales. Experiencing this lively floating commerce provides an unforgettable cultural encounter."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 30,
                "id": "g8_gk1_801_q30",
                "type": "choice",
                "text": "What is the main topic of the passage?",
                "options": [
                        "Industrial manufacturing processes in urban factories",
                        "Commercial shopping centers and modern entertainment complexes",
                        "Technical guide for maintaining automobile and motorbike engines",
                        "A Day at a Traditional Floating Market"
                ],
                "correct": "A Day at a Traditional Floating Market",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (A Day at a Traditional Floating Market)",
                "passage": "Cai Rang floating market in Can Tho presents an intoxicating explosion of vibrant sights, sounds, and aromas. Hundreds of wooden boats loaded with heaps of pineapples, watermelons, and mangoes cluster along the river at dawn. Each boat displays its agricultural goods on a tall bamboo pole called a cây bẹo so buyers can see offerings from afar. Breakfast vendors weave skillfully through the flotilla, serving steaming bowls of hu tieu noodles directly across boat gunwales. Experiencing this lively floating commerce provides an unforgettable cultural encounter."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 31,
                "id": "g8_gk1_801_q31",
                "type": "choice",
                "text": "The word important' in the passage is closest in meaning to ________.",
                "options": [
                        "useless and meaningless",
                        "extremely harmful and bad",
                        "difficult to remember",
                        "having great value and significance"
                ],
                "correct": "having great value and significance",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (having great value and significance)",
                "passage": "Cai Rang floating market in Can Tho presents an intoxicating explosion of vibrant sights, sounds, and aromas. Hundreds of wooden boats loaded with heaps of pineapples, watermelons, and mangoes cluster along the river at dawn. Each boat displays its agricultural goods on a tall bamboo pole called a cây bẹo so buyers can see offerings from afar. Breakfast vendors weave skillfully through the flotilla, serving steaming bowls of hu tieu noodles directly across boat gunwales. Experiencing this lively floating commerce provides an unforgettable cultural encounter."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 32,
                "id": "g8_gk1_801_q32",
                "type": "choice",
                "text": "The word They' or This' in the passage refers to ________.",
                "options": [
                        "the subject or people mentioned previously",
                        "an angry crowd in the market",
                        "unrelated objects outside the school",
                        "distant foreign countries"
                ],
                "correct": "the subject or people mentioned previously",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (the subject or people mentioned previously)",
                "passage": "Cai Rang floating market in Can Tho presents an intoxicating explosion of vibrant sights, sounds, and aromas. Hundreds of wooden boats loaded with heaps of pineapples, watermelons, and mangoes cluster along the river at dawn. Each boat displays its agricultural goods on a tall bamboo pole called a cây bẹo so buyers can see offerings from afar. Breakfast vendors weave skillfully through the flotilla, serving steaming bowls of hu tieu noodles directly across boat gunwales. Experiencing this lively floating commerce provides an unforgettable cultural encounter."
        },
        {
                "part": "D",
                "partTitle": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "partInstruction": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "qNumber": 33,
                "id": "g8_gk1_801_q33",
                "type": "choice",
                "text": "My mother spends an hour meditating every morning.",
                "options": [
                        "It takes mother my an hour to meditate every morning.",
                        "It takes my mother an hour to meditate every morning.",
                        "Takes it my mother an hour to meditate every morning.",
                        "It takes my mother an hour to meditate morning every."
                ],
                "correct": "It takes my mother an hour to meditate every morning.",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (It takes my mother an hour to meditate every morning.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "partInstruction": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "qNumber": 34,
                "id": "g8_gk1_801_q34",
                "type": "choice",
                "text": "She speaks English more fluently than anyone in her class.",
                "options": [
                        "She is the most fluent English speaker at her class.",
                        "She is the most fluent English speaker in class her.",
                        "She is the most fluent English speaker in her class.",
                        "She are the most fluent English speaker in her class."
                ],
                "correct": "She is the most fluent English speaker in her class.",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (She is the most fluent English speaker in her class.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "partInstruction": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "qNumber": 35,
                "id": "g8_gk1_801_q35",
                "type": "choice",
                "text": "balanced / lifestyle / empowers / teenagers / thrive / to / .",
                "options": [
                        "Balanced lifestyle empowers teenagers thrive to.",
                        "Lifestyle balanced empowers teenagers to thrive.",
                        "Balanced lifestyle empowers teenagers to thrive.",
                        "Balanced lifestyle teenagers empowers to thrive."
                ],
                "correct": "Balanced lifestyle empowers teenagers to thrive.",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Balanced lifestyle empowers teenagers to thrive.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "partInstruction": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "qNumber": 36,
                "id": "g8_gk1_801_q36",
                "type": "choice",
                "text": "nomads / travel / across / plateaus / horses / on / .",
                "options": [
                        "Travel nomads across plateaus on horses.",
                        "Nomads travel across plateaus on horses.",
                        "Nomads travel across plateaus horses on.",
                        "Nomads travel plateaus across on horses."
                ],
                "correct": "Nomads travel across plateaus on horses.",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Nomads travel across plateaus on horses.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 8. Writing (1.0 pt) Write a paragraph (80-100 words) describing the outdoor navigation sport of orienteering.",
                "partInstruction": "Write a paragraph in English as requested below.",
                "qNumber": 37,
                "id": "g8_gk1_801_essay",
                "type": "essay",
                "text": "Equipment needed (compass, topographic map); Challenge of navigating forest checkpoints; Mental decisions under physical fatigue; Why it is exciting.\n------The end------",
                "options": [],
                "correct": "Written paragraph",
                "correctLetter": "",
                "explanation": "Tiêu chuẩn chấm (Rubric):\\n1. Topic sentence: 0.25 pt\n2. Supporting sentences: 0.25 pt\n3. Range of vocabulary: 0.25 pt\n4. Accuracy (Grammar, spelling): 0.25 pt. Total: 1.0 point.\\n\\nBài văn mẫu tham khảo:\\nLife in the countryside holds a special charm for me because of its profound tranquility and wholesome environment. Firstly, the atmosphere is refreshingly pure and unpolluted, far removed from urban smog and perpetual traffic noise. Rolling green hills, expansive golden rice fields, and meandering rivers offer breathtaking scenery. Secondly, the villagers are remarkably warm-hearted, compassionate, and always ready to assist one another during harvest times. Living close to nature brings me inner serenity and revitalizes my mental well-being.",
                "passage": ""
        }
]
    },
    '802': {
      grade: 8,
      examType: 'giua-ky-1',
      typeTitle: 'BÀI KIỂM TRA ĐÁNH GIÁ GIỮA HỌC KỲ I',
      examCode: '802',
      durationMinutes: 60,
      schoolName: 'TRƯỜNG THCS ĐỒNG YÊN',
      teacherName: 'Thầy Đinh Văn Thành',
      audioUrl: '/web-tieng-anh/audio/listening_8_gk1.mp3',
      audioScript: `🎧 Transcript bài nghe Part 1 (Hội thoại - 1 Giọng Nam, 1 Giọng Nữ):
Jason (Giọng Nam):	Hi Hannah! Did you join any school clubs this academic year?
Hannah (Giọng Nữ):	Yes! I joined the Photography Club and the IT Club.
Jason (Giọng Nam):	Photography Club? That sounds fantastic! What do you photograph?
Hannah (Giọng Nữ):	We take pictures of campus life, nature, and historic architecture around town.
Jason (Giọng Nam):	Does joining clubs help you cope with school pressure?
Hannah (Giọng Nữ):	Definitely! It helps me make supportive friends, improve teamwork, and unwind after classes.

🎧 Transcript bài nghe Part 2 (Độc thoại):
Adolescence is an exciting time when teenagers explore new interests and develop social skills. Participating in extracurricular school clubs offers a safe, friendly space to share common passions. When feeling stressed about homework or exams, talking with friends and teachers helps teenagers overcome challenges with confidence.`,
      writingRubric: `1. Topic sentence: 0.25 pt
2. Supporting sentences: 0.25 pt
3. Range of vocabulary: 0.25 pt
4. Accuracy (Grammar, spelling): 0.25 pt. Total: 1.0 point.`,
      sampleWritingText: `Life in the countryside holds a special charm for me because of its profound tranquility and wholesome environment. Firstly, the atmosphere is refreshingly pure and unpolluted, far removed from urban smog and perpetual traffic noise. Rolling green hills, expansive golden rice fields, and meandering rivers offer breathtaking scenery. Secondly, the villagers are remarkably warm-hearted, compassionate, and always ready to assist one another during harvest times. Living close to nature brings me inner serenity and revitalizes my mental well-being.`,
      passageText: `Grade 8 history students recently embarked on a local (23) ________ project: recording oral history interviews with village elders. Armed with portable audio recorders and (24) ________ drafted questions, students gathered firsthand recollections of wartime resilience, communal traditions, and changing village landscapes. (25) ________ shared emotional memories with pride, grateful that their stories would be preserved for future (26) ________. Transcribing and archiving these oral accounts brought dry textbook history vibrantly to life. (27) ________ storytelling bridges time and deepens cultural pride.`,
      totalQuestions: 37,
      questions: [
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 1,
                "id": "g8_gk1_802_q1",
                "type": "choice",
                "text": "Which two clubs did Jason join this year?",
                "options": [
                        "Music Club only",
                        "Cooking Club only",
                        "Photography Club and IT Club"
                ],
                "correct": "Photography Club and IT Club",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Photography Club and IT Club)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 2,
                "id": "g8_gk1_802_q2",
                "type": "choice",
                "text": "What does the Photography Club photograph?",
                "options": [
                        "Fast food only",
                        "Cars only",
                        "Campus life, nature, and architecture"
                ],
                "correct": "Campus life, nature, and architecture",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Campus life, nature, and architecture)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 3,
                "id": "g8_gk1_802_q3",
                "type": "choice",
                "text": "How does joining clubs help Jason?",
                "options": [
                        "Costs too much money",
                        "Makes him feel tired",
                        "Makes friends, improves teamwork, unwinds"
                ],
                "correct": "Makes friends, improves teamwork, unwinds",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Makes friends, improves teamwork, unwinds)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 4,
                "id": "g8_gk1_802_q4",
                "type": "choice",
                "text": "Who does Jason take pictures with?",
                "options": [
                        "Nobody",
                        "Strangers",
                        "Club members"
                ],
                "correct": "Club members",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Club members)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 5,
                "id": "g8_gk1_802_q5",
                "type": "choice",
                "text": "When do club activities help students?",
                "options": [
                        "After school classes",
                        "Never",
                        "During midnight"
                ],
                "correct": "After school classes",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (After school classes)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 6,
                "id": "g8_gk1_802_q6",
                "type": "choice",
                "text": "Adolescence is a time to explore new interests and social skills.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 7,
                "id": "g8_gk1_802_q7",
                "type": "choice",
                "text": "School clubs provide a safe space to share passions.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 8,
                "id": "g8_gk1_802_q8",
                "type": "choice",
                "text": "Teenagers should never talk to teachers when stressed.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "False",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (False)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 9,
                "id": "g8_gk1_802_q9",
                "type": "choice",
                "text": "Extracurricular activities help students overcome challenges.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 10,
                "id": "g8_gk1_802_q10",
                "type": "choice",
                "text": "Photography clubs only allow students to sleep.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "False",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (False)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 11,
                "id": "g8_gk1_802_q11",
                "type": "choice",
                "text": "The vast green fields in the countryside look very ________.",
                "options": [
                        "busy",
                        "noisy",
                        "picturesque",
                        "polluted"
                ],
                "correct": "picturesque",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (picturesque)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 12,
                "id": "g8_gk1_802_q12",
                "type": "choice",
                "text": "Which word has the underlined part pronounced differently? stress, connect, pressure, peer",
                "options": [
                        "connect",
                        "peer",
                        "stress",
                        "pressure"
                ],
                "correct": "peer",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (peer)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 13,
                "id": "g8_gk1_802_q13",
                "type": "choice",
                "text": "The word harvest' refers to the time when farmers ________.",
                "options": [
                        "plant small seeds",
                        "plough the muddy land",
                        "buy chemical fertilizers",
                        "gather crops from the fields"
                ],
                "correct": "gather crops from the fields",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (gather crops from the fields)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 14,
                "id": "g8_gk1_802_q14",
                "type": "choice",
                "text": "Children in the countryside enjoy flying kites and herding ________ in the afternoon.",
                "options": [
                        "dogs",
                        "cattle",
                        "tigers",
                        "cats"
                ],
                "correct": "cattle",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (cattle)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 15,
                "id": "g8_gk1_802_q15",
                "type": "choice",
                "text": "Farmers in our commune ________ rice on vast terraced fields every year.",
                "options": [
                        "are cultivating",
                        "will cultivate",
                        "cultivated",
                        "cultivate"
                ],
                "correct": "cultivate",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (cultivate)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 16,
                "id": "g8_gk1_802_q16",
                "type": "choice",
                "text": "They ________ the annual village festival on the 15th of the lunar month.",
                "options": [
                        "are celebrating",
                        "celebrate",
                        "celebrated",
                        "have celebrated"
                ],
                "correct": "celebrated",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (celebrated)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 17,
                "id": "g8_gk1_802_q17",
                "type": "choice",
                "text": "The country air is fresh, ________ the food is naturally clean.",
                "options": [
                        "yet",
                        "or",
                        "but",
                        "and"
                ],
                "correct": "and",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (and)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 18,
                "id": "g8_gk1_802_q18",
                "type": "choice",
                "text": "During harvest time, farmers in my village work very ________ on the fields.",
                "options": [
                        "hardly",
                        "slow",
                        "lazy",
                        "hard"
                ],
                "correct": "hard",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (hard)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 19,
                "id": "g8_gk1_802_q19",
                "type": "choice",
                "text": "Mother: You shouldn't spend too much time surfing social media.' - Teen: '________'",
                "options": [
                        "Social media is fun.",
                        "No, I am not.",
                        "Yes, mom. I will balance my study and screen time.",
                        "I have a new phone."
                ],
                "correct": "Yes, mom. I will balance my study and screen time.",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Yes, mom. I will balance my study and screen time.)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 20,
                "id": "g8_gk1_802_q20",
                "type": "choice",
                "text": "My little brother adores ________ football with his classmates after school.",
                "options": [
                        "played",
                        "to playing",
                        "playing",
                        "play"
                ],
                "correct": "playing",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (playing)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 21,
                "id": "g8_gk1_802_q21",
                "type": "choice",
                "text": "Teacher: How is life in the countryside different from city life?' - Student: '________'",
                "options": [
                        "Cities have lots of cars.",
                        "Villages have rice fields.",
                        "Life in the countryside is more peaceful and the air is fresher.",
                        "I like living."
                ],
                "correct": "Life in the countryside is more peaceful and the air is fresher.",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Life in the countryside is more peaceful and the air is fresher.)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 22,
                "id": "g8_gk1_802_q22",
                "type": "choice",
                "text": "People in rural areas usually live ________ than people in big cities.",
                "options": [
                        "peacefullier",
                        "most peaceful",
                        "peaceful",
                        "more peacefully"
                ],
                "correct": "more peacefully",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (more peacefully)",
                "passage": ""
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 23,
                "id": "g8_gk1_802_q23",
                "type": "choice",
                "text": "Choose the best word for blank (23):",
                "options": [
                        "heritage",
                        "essential",
                        "creative",
                        "peaceful"
                ],
                "correct": "heritage",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (heritage)",
                "passage": "Grade 8 history students recently embarked on a local (23) ________ project: recording oral history interviews with village elders. Armed with portable audio recorders and (24) ________ drafted questions, students gathered firsthand recollections of wartime resilience, communal traditions, and changing village landscapes. (25) ________ shared emotional memories with pride, grateful that their stories would be preserved for future (26) ________. Transcribing and archiving these oral accounts brought dry textbook history vibrantly to life. (27) ________ storytelling bridges time and deepens cultural pride."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 24,
                "id": "g8_gk1_802_q24",
                "type": "choice",
                "text": "Choose the best word for blank (24):",
                "options": [
                        "essential",
                        "thoughtfully",
                        "creative",
                        "peaceful"
                ],
                "correct": "thoughtfully",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (thoughtfully)",
                "passage": "Grade 8 history students recently embarked on a local (23) ________ project: recording oral history interviews with village elders. Armed with portable audio recorders and (24) ________ drafted questions, students gathered firsthand recollections of wartime resilience, communal traditions, and changing village landscapes. (25) ________ shared emotional memories with pride, grateful that their stories would be preserved for future (26) ________. Transcribing and archiving these oral accounts brought dry textbook history vibrantly to life. (27) ________ storytelling bridges time and deepens cultural pride."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 25,
                "id": "g8_gk1_802_q25",
                "type": "choice",
                "text": "Choose the best word for blank (25):",
                "options": [
                        "peaceful",
                        "Elders",
                        "creative",
                        "essential"
                ],
                "correct": "Elders",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Elders)",
                "passage": "Grade 8 history students recently embarked on a local (23) ________ project: recording oral history interviews with village elders. Armed with portable audio recorders and (24) ________ drafted questions, students gathered firsthand recollections of wartime resilience, communal traditions, and changing village landscapes. (25) ________ shared emotional memories with pride, grateful that their stories would be preserved for future (26) ________. Transcribing and archiving these oral accounts brought dry textbook history vibrantly to life. (27) ________ storytelling bridges time and deepens cultural pride."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 26,
                "id": "g8_gk1_802_q26",
                "type": "choice",
                "text": "Choose the best word for blank (26):",
                "options": [
                        "essential",
                        "generations",
                        "peaceful",
                        "creative"
                ],
                "correct": "generations",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (generations)",
                "passage": "Grade 8 history students recently embarked on a local (23) ________ project: recording oral history interviews with village elders. Armed with portable audio recorders and (24) ________ drafted questions, students gathered firsthand recollections of wartime resilience, communal traditions, and changing village landscapes. (25) ________ shared emotional memories with pride, grateful that their stories would be preserved for future (26) ________. Transcribing and archiving these oral accounts brought dry textbook history vibrantly to life. (27) ________ storytelling bridges time and deepens cultural pride."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 27,
                "id": "g8_gk1_802_q27",
                "type": "choice",
                "text": "Choose the best word for blank (27):",
                "options": [
                        "Intergenerational",
                        "essential",
                        "peaceful",
                        "creative"
                ],
                "correct": "Intergenerational",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (Intergenerational)",
                "passage": "Grade 8 history students recently embarked on a local (23) ________ project: recording oral history interviews with village elders. Armed with portable audio recorders and (24) ________ drafted questions, students gathered firsthand recollections of wartime resilience, communal traditions, and changing village landscapes. (25) ________ shared emotional memories with pride, grateful that their stories would be preserved for future (26) ________. Transcribing and archiving these oral accounts brought dry textbook history vibrantly to life. (27) ________ storytelling bridges time and deepens cultural pride."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 28,
                "id": "g8_gk1_802_q28",
                "type": "choice",
                "text": "What is the main topic of the passage?",
                "options": [
                        "Industrial manufacturing processes in urban factories",
                        "The Thrill of Orienteering in the Forest",
                        "Commercial shopping centers and modern entertainment complexes",
                        "Technical guide for maintaining automobile and motorbike engines"
                ],
                "correct": "The Thrill of Orienteering in the Forest",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (The Thrill of Orienteering in the Forest)",
                "passage": "Orienteering is an exhilarating outdoor navigation sport that combines cross-country trail running with tactical map-reading. Competitors use a magnetic compass and a detailed topographic map to navigate between designated checkpoints scattered through dense forests. Every split-second decision demands calculating distance, elevation gain, and terrain navigability under physical fatigue. Running through pristine woodland trails while cracking navigational puzzles gives participants an incomparable adrenaline surge. Orienteering builds athletic agility, spatial intellect, and fearless determination."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 29,
                "id": "g8_gk1_802_q29",
                "type": "choice",
                "text": "Which of the following is TRUE according to the passage?",
                "options": [
                        "Students should spend 24 hours a day on computer screens without resting.",
                        "Engaging constructively in the thrill of orienteering in the forest brings positive benefits for students.",
                        "Teachers strictly forbid students from developing any creative hobbies.",
                        "Living environments have no impact on adolescent wellbeing."
                ],
                "correct": "Engaging constructively in the thrill of orienteering in the forest brings positive benefits for students.",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Engaging constructively in the thrill of orienteering in the forest brings positive benefits for students.)",
                "passage": "Orienteering is an exhilarating outdoor navigation sport that combines cross-country trail running with tactical map-reading. Competitors use a magnetic compass and a detailed topographic map to navigate between designated checkpoints scattered through dense forests. Every split-second decision demands calculating distance, elevation gain, and terrain navigability under physical fatigue. Running through pristine woodland trails while cracking navigational puzzles gives participants an incomparable adrenaline surge. Orienteering builds athletic agility, spatial intellect, and fearless determination."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 30,
                "id": "g8_gk1_802_q30",
                "type": "choice",
                "text": "According to the text, which of the following is highlighted?",
                "options": [
                        "Students must study alone without any guidance or support",
                        "Teenagers should avoid all physical recreation activities",
                        "Competitors use a magnetic compass and a detailed topographi...",
                        "Academic examinations are completely eliminated from school"
                ],
                "correct": "Competitors use a magnetic compass and a detailed topographi...",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Competitors use a magnetic compass and a detailed topographi...)",
                "passage": "Orienteering is an exhilarating outdoor navigation sport that combines cross-country trail running with tactical map-reading. Competitors use a magnetic compass and a detailed topographic map to navigate between designated checkpoints scattered through dense forests. Every split-second decision demands calculating distance, elevation gain, and terrain navigability under physical fatigue. Running through pristine woodland trails while cracking navigational puzzles gives participants an incomparable adrenaline surge. Orienteering builds athletic agility, spatial intellect, and fearless determination."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 31,
                "id": "g8_gk1_802_q31",
                "type": "choice",
                "text": "The word important' in the passage is closest in meaning to ________.",
                "options": [
                        "useless and meaningless",
                        "difficult to remember",
                        "extremely harmful and bad",
                        "having great value and significance"
                ],
                "correct": "having great value and significance",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (having great value and significance)",
                "passage": "Orienteering is an exhilarating outdoor navigation sport that combines cross-country trail running with tactical map-reading. Competitors use a magnetic compass and a detailed topographic map to navigate between designated checkpoints scattered through dense forests. Every split-second decision demands calculating distance, elevation gain, and terrain navigability under physical fatigue. Running through pristine woodland trails while cracking navigational puzzles gives participants an incomparable adrenaline surge. Orienteering builds athletic agility, spatial intellect, and fearless determination."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 32,
                "id": "g8_gk1_802_q32",
                "type": "choice",
                "text": "The word They' or This' in the passage refers to ________.",
                "options": [
                        "distant foreign countries",
                        "unrelated objects outside the school",
                        "the subject or people mentioned previously",
                        "an angry crowd in the market"
                ],
                "correct": "the subject or people mentioned previously",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (the subject or people mentioned previously)",
                "passage": "Orienteering is an exhilarating outdoor navigation sport that combines cross-country trail running with tactical map-reading. Competitors use a magnetic compass and a detailed topographic map to navigate between designated checkpoints scattered through dense forests. Every split-second decision demands calculating distance, elevation gain, and terrain navigability under physical fatigue. Running through pristine woodland trails while cracking navigational puzzles gives participants an incomparable adrenaline surge. Orienteering builds athletic agility, spatial intellect, and fearless determination."
        },
        {
                "part": "D",
                "partTitle": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "partInstruction": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "qNumber": 33,
                "id": "g8_gk1_802_q33",
                "type": "choice",
                "text": "He detests playing violent computer games.",
                "options": [
                        "Dislikes he playing violent computer games immensely.",
                        "He dislikes playing violent computer immensely games.",
                        "He dislikes playing violent computer games immensely.",
                        "He dislikes to play violent computer games immensely."
                ],
                "correct": "He dislikes playing violent computer games immensely.",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (He dislikes playing violent computer games immensely.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "partInstruction": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "qNumber": 34,
                "id": "g8_gk1_802_q34",
                "type": "choice",
                "text": "He felt exhausted, but he continued helping his parents harvest rice.",
                "options": [
                        "Although he felt exhausted, he continued helping his parents harvest rice.",
                        "Despite he felt exhausted, he stopped harvesting.",
                        "Because he felt exhausted, he continued harvesting rice.",
                        "He stopped helping because he was tired."
                ],
                "correct": "Although he felt exhausted, he continued helping his parents harvest rice.",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (Although he felt exhausted, he continued helping his parents harvest rice.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "partInstruction": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "qNumber": 35,
                "id": "g8_gk1_802_q35",
                "type": "choice",
                "text": "nomads / travel / across / plateaus / horses / on / .",
                "options": [
                        "Nomads travel across plateaus horses on.",
                        "Nomads travel plateaus across on horses.",
                        "Travel nomads across plateaus on horses.",
                        "Nomads travel across plateaus on horses."
                ],
                "correct": "Nomads travel across plateaus on horses.",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (Nomads travel across plateaus on horses.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "partInstruction": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "qNumber": 36,
                "id": "g8_gk1_802_q36",
                "type": "choice",
                "text": "balanced / lifestyle / empowers / teenagers / thrive / to / .",
                "options": [
                        "Balanced lifestyle teenagers empowers to thrive.",
                        "Lifestyle balanced empowers teenagers to thrive.",
                        "Balanced lifestyle empowers teenagers to thrive.",
                        "Balanced lifestyle empowers teenagers thrive to."
                ],
                "correct": "Balanced lifestyle empowers teenagers to thrive.",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Balanced lifestyle empowers teenagers to thrive.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 8. Writing (1.0 pt) Write a paragraph (80-100 words) describing the nomadic life on the grasslands.",
                "partInstruction": "Write a paragraph in English as requested below.",
                "qNumber": 37,
                "id": "g8_gk1_802_essay",
                "type": "essay",
                "text": "How nomadic families live in yurts; Daily chores (herding cattle, riding horses); Connection with vast nature; What modern youth can learn from nomads.\n------The end------",
                "options": [],
                "correct": "Written paragraph",
                "correctLetter": "",
                "explanation": "Tiêu chuẩn chấm (Rubric):\\n1. Topic sentence: 0.25 pt\n2. Supporting sentences: 0.25 pt\n3. Range of vocabulary: 0.25 pt\n4. Accuracy (Grammar, spelling): 0.25 pt. Total: 1.0 point.\\n\\nBài văn mẫu tham khảo:\\nLife in the countryside holds a special charm for me because of its profound tranquility and wholesome environment. Firstly, the atmosphere is refreshingly pure and unpolluted, far removed from urban smog and perpetual traffic noise. Rolling green hills, expansive golden rice fields, and meandering rivers offer breathtaking scenery. Secondly, the villagers are remarkably warm-hearted, compassionate, and always ready to assist one another during harvest times. Living close to nature brings me inner serenity and revitalizes my mental well-being.",
                "passage": ""
        }
]
    },
    '803': {
      grade: 8,
      examType: 'giua-ky-1',
      typeTitle: 'BÀI KIỂM TRA ĐÁNH GIÁ GIỮA HỌC KỲ I',
      examCode: '803',
      durationMinutes: 60,
      schoolName: 'TRƯỜNG THCS ĐỒNG YÊN',
      teacherName: 'Thầy Đinh Văn Thành',
      audioUrl: '/web-tieng-anh/audio/listening_8_gk1.mp3',
      audioScript: `🎧 Transcript bài nghe Part 1 (Hội thoại - 1 Giọng Nam, 1 Giọng Nữ):
Jason (Giọng Nam):	Hi Hannah! Did you join any school clubs this academic year?
Hannah (Giọng Nữ):	Yes! I joined the Photography Club and the IT Club.
Jason (Giọng Nam):	Photography Club? That sounds fantastic! What do you photograph?
Hannah (Giọng Nữ):	We take pictures of campus life, nature, and historic architecture around town.
Jason (Giọng Nam):	Does joining clubs help you cope with school pressure?
Hannah (Giọng Nữ):	Definitely! It helps me make supportive friends, improve teamwork, and unwind after classes.

🎧 Transcript bài nghe Part 2 (Độc thoại):
Adolescence is an exciting time when teenagers explore new interests and develop social skills. Participating in extracurricular school clubs offers a safe, friendly space to share common passions. When feeling stressed about homework or exams, talking with friends and teachers helps teenagers overcome challenges with confidence.`,
      writingRubric: `1. Topic sentence: 0.25 pt
2. Supporting sentences: 0.25 pt
3. Range of vocabulary: 0.25 pt
4. Accuracy (Grammar, spelling): 0.25 pt. Total: 1.0 point.`,
      sampleWritingText: `Life in the countryside holds a special charm for me because of its profound tranquility and wholesome environment. Firstly, the atmosphere is refreshingly pure and unpolluted, far removed from urban smog and perpetual traffic noise. Rolling green hills, expansive golden rice fields, and meandering rivers offer breathtaking scenery. Secondly, the villagers are remarkably warm-hearted, compassionate, and always ready to assist one another during harvest times. Living close to nature brings me inner serenity and revitalizes my mental well-being.`,
      passageText: `Quan họ folk singing, recognized by UNESCO as intangible (23) ________ heritage, has been preserved in Bac Ninh for centuries. The singing involves alternating pairs of (24) ________ and female singers performing lyrical, soulful melodies without musical accompaniment. Young apprentices spend years mastering (25) ________ vocal techniques like vibrating, pouring, and vocal curling from elderly village artisans. Participating in youth (26) ________ họ clubs helps teenagers connect with the poetic soul of their ancestors. Preserving folk (27) ________ keeps our national identity vibrant and proud.`,
      totalQuestions: 37,
      questions: [
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 1,
                "id": "g8_gk1_803_q1",
                "type": "choice",
                "text": "Which two clubs did Jason join this year?",
                "options": [
                        "Music Club only",
                        "Photography Club and IT Club",
                        "Cooking Club only"
                ],
                "correct": "Photography Club and IT Club",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Photography Club and IT Club)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 2,
                "id": "g8_gk1_803_q2",
                "type": "choice",
                "text": "What does the Photography Club photograph?",
                "options": [
                        "Campus life, nature, and architecture",
                        "Fast food only",
                        "Cars only"
                ],
                "correct": "Campus life, nature, and architecture",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (Campus life, nature, and architecture)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 3,
                "id": "g8_gk1_803_q3",
                "type": "choice",
                "text": "How does joining clubs help Jason?",
                "options": [
                        "Costs too much money",
                        "Makes him feel tired",
                        "Makes friends, improves teamwork, unwinds"
                ],
                "correct": "Makes friends, improves teamwork, unwinds",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Makes friends, improves teamwork, unwinds)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 4,
                "id": "g8_gk1_803_q4",
                "type": "choice",
                "text": "Who does Jason take pictures with?",
                "options": [
                        "Nobody",
                        "Club members",
                        "Strangers"
                ],
                "correct": "Club members",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Club members)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 5,
                "id": "g8_gk1_803_q5",
                "type": "choice",
                "text": "When do club activities help students?",
                "options": [
                        "During midnight",
                        "Never",
                        "After school classes"
                ],
                "correct": "After school classes",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (After school classes)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 6,
                "id": "g8_gk1_803_q6",
                "type": "choice",
                "text": "Adolescence is a time to explore new interests and social skills.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 7,
                "id": "g8_gk1_803_q7",
                "type": "choice",
                "text": "School clubs provide a safe space to share passions.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 8,
                "id": "g8_gk1_803_q8",
                "type": "choice",
                "text": "Teenagers should never talk to teachers when stressed.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "False",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (False)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 9,
                "id": "g8_gk1_803_q9",
                "type": "choice",
                "text": "Extracurricular activities help students overcome challenges.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 10,
                "id": "g8_gk1_803_q10",
                "type": "choice",
                "text": "Photography clubs only allow students to sleep.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "False",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (False)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 11,
                "id": "g8_gk1_803_q11",
                "type": "choice",
                "text": "The word harvest' refers to the time when farmers ________.",
                "options": [
                        "gather crops from the fields",
                        "plough the muddy land",
                        "buy chemical fertilizers",
                        "plant small seeds"
                ],
                "correct": "gather crops from the fields",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (gather crops from the fields)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 12,
                "id": "g8_gk1_803_q12",
                "type": "choice",
                "text": "Joining school clubs helps students make friends and learn teamwork ________.",
                "options": [
                        "papers",
                        "skills",
                        "books",
                        "desks"
                ],
                "correct": "skills",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (skills)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 13,
                "id": "g8_gk1_803_q13",
                "type": "choice",
                "text": "Jane detests ________ up early on cold winter mornings.",
                "options": [
                        "got",
                        "getting",
                        "gets",
                        "get"
                ],
                "correct": "getting",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (getting)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 14,
                "id": "g8_gk1_803_q14",
                "type": "choice",
                "text": "Farmers in our commune ________ rice on vast terraced fields every year.",
                "options": [
                        "are cultivating",
                        "will cultivate",
                        "cultivated",
                        "cultivate"
                ],
                "correct": "cultivate",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (cultivate)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 15,
                "id": "g8_gk1_803_q15",
                "type": "choice",
                "text": "They ________ the annual village festival on the 15th of the lunar month.",
                "options": [
                        "celebrate",
                        "celebrated",
                        "are celebrating",
                        "have celebrated"
                ],
                "correct": "celebrated",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (celebrated)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 16,
                "id": "g8_gk1_803_q16",
                "type": "choice",
                "text": "She did the test ________ than her classmates because she revised carefully.",
                "options": [
                        "good",
                        "better",
                        "well",
                        "more well"
                ],
                "correct": "better",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (better)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 17,
                "id": "g8_gk1_803_q17",
                "type": "choice",
                "text": "He is keen on doing ________ projects such as making a small bookshelf.",
                "options": [
                        "TV",
                        "SMS",
                        "SOS",
                        "DIY"
                ],
                "correct": "DIY",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (DIY)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 18,
                "id": "g8_gk1_803_q18",
                "type": "choice",
                "text": "Choose the word OPPOSITE in meaning to peaceful': Life in the countryside is very peaceful.'",
                "options": [
                        "quiet",
                        "noisy and chaotic",
                        "serene",
                        "calm"
                ],
                "correct": "noisy and chaotic",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (noisy and chaotic)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 19,
                "id": "g8_gk1_803_q19",
                "type": "choice",
                "text": "Which word has the underlined part pronounced differently? stress, connect, pressure, peer",
                "options": [
                        "peer",
                        "connect",
                        "stress",
                        "pressure"
                ],
                "correct": "peer",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (peer)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 20,
                "id": "g8_gk1_803_q20",
                "type": "choice",
                "text": "Teacher: How is life in the countryside different from city life?' - Student: '________'",
                "options": [
                        "I like living.",
                        "Villages have rice fields.",
                        "Cities have lots of cars.",
                        "Life in the countryside is more peaceful and the air is fresher."
                ],
                "correct": "Life in the countryside is more peaceful and the air is fresher.",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (Life in the countryside is more peaceful and the air is fresher.)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 21,
                "id": "g8_gk1_803_q21",
                "type": "choice",
                "text": "Mother: You shouldn't spend too much time surfing social media.' - Teen: '________'",
                "options": [
                        "No, I am not.",
                        "Yes, mom. I will balance my study and screen time.",
                        "I have a new phone.",
                        "Social media is fun."
                ],
                "correct": "Yes, mom. I will balance my study and screen time.",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Yes, mom. I will balance my study and screen time.)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 22,
                "id": "g8_gk1_803_q22",
                "type": "choice",
                "text": "Farmers dry rice paddy ________ the wide concrete village courtyards.",
                "options": [
                        "under",
                        "in",
                        "at",
                        "on"
                ],
                "correct": "on",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (on)",
                "passage": ""
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 23,
                "id": "g8_gk1_803_q23",
                "type": "choice",
                "text": "Choose the best word for blank (23):",
                "options": [
                        "essential",
                        "cultural",
                        "peaceful",
                        "creative"
                ],
                "correct": "cultural",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (cultural)",
                "passage": "Quan họ folk singing, recognized by UNESCO as intangible (23) ________ heritage, has been preserved in Bac Ninh for centuries. The singing involves alternating pairs of (24) ________ and female singers performing lyrical, soulful melodies without musical accompaniment. Young apprentices spend years mastering (25) ________ vocal techniques like vibrating, pouring, and vocal curling from elderly village artisans. Participating in youth (26) ________ họ clubs helps teenagers connect with the poetic soul of their ancestors. Preserving folk (27) ________ keeps our national identity vibrant and proud."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 24,
                "id": "g8_gk1_803_q24",
                "type": "choice",
                "text": "Choose the best word for blank (24):",
                "options": [
                        "creative",
                        "essential",
                        "male",
                        "peaceful"
                ],
                "correct": "male",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (male)",
                "passage": "Quan họ folk singing, recognized by UNESCO as intangible (23) ________ heritage, has been preserved in Bac Ninh for centuries. The singing involves alternating pairs of (24) ________ and female singers performing lyrical, soulful melodies without musical accompaniment. Young apprentices spend years mastering (25) ________ vocal techniques like vibrating, pouring, and vocal curling from elderly village artisans. Participating in youth (26) ________ họ clubs helps teenagers connect with the poetic soul of their ancestors. Preserving folk (27) ________ keeps our national identity vibrant and proud."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 25,
                "id": "g8_gk1_803_q25",
                "type": "choice",
                "text": "Choose the best word for blank (25):",
                "options": [
                        "intricate",
                        "peaceful",
                        "creative",
                        "essential"
                ],
                "correct": "intricate",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (intricate)",
                "passage": "Quan họ folk singing, recognized by UNESCO as intangible (23) ________ heritage, has been preserved in Bac Ninh for centuries. The singing involves alternating pairs of (24) ________ and female singers performing lyrical, soulful melodies without musical accompaniment. Young apprentices spend years mastering (25) ________ vocal techniques like vibrating, pouring, and vocal curling from elderly village artisans. Participating in youth (26) ________ họ clubs helps teenagers connect with the poetic soul of their ancestors. Preserving folk (27) ________ keeps our national identity vibrant and proud."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 26,
                "id": "g8_gk1_803_q26",
                "type": "choice",
                "text": "Choose the best word for blank (26):",
                "options": [
                        "peaceful",
                        "quan",
                        "creative",
                        "essential"
                ],
                "correct": "quan",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (quan)",
                "passage": "Quan họ folk singing, recognized by UNESCO as intangible (23) ________ heritage, has been preserved in Bac Ninh for centuries. The singing involves alternating pairs of (24) ________ and female singers performing lyrical, soulful melodies without musical accompaniment. Young apprentices spend years mastering (25) ________ vocal techniques like vibrating, pouring, and vocal curling from elderly village artisans. Participating in youth (26) ________ họ clubs helps teenagers connect with the poetic soul of their ancestors. Preserving folk (27) ________ keeps our national identity vibrant and proud."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 27,
                "id": "g8_gk1_803_q27",
                "type": "choice",
                "text": "Choose the best word for blank (27):",
                "options": [
                        "creative",
                        "essential",
                        "music",
                        "peaceful"
                ],
                "correct": "music",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (music)",
                "passage": "Quan họ folk singing, recognized by UNESCO as intangible (23) ________ heritage, has been preserved in Bac Ninh for centuries. The singing involves alternating pairs of (24) ________ and female singers performing lyrical, soulful melodies without musical accompaniment. Young apprentices spend years mastering (25) ________ vocal techniques like vibrating, pouring, and vocal curling from elderly village artisans. Participating in youth (26) ________ họ clubs helps teenagers connect with the poetic soul of their ancestors. Preserving folk (27) ________ keeps our national identity vibrant and proud."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 28,
                "id": "g8_gk1_803_q28",
                "type": "choice",
                "text": "What is the main topic of the passage?",
                "options": [
                        "Commercial shopping centers and modern entertainment complexes",
                        "Technical guide for maintaining automobile and motorbike engines",
                        "Industrial manufacturing processes in urban factories",
                        "Documenting Local History through Oral Interviews"
                ],
                "correct": "Documenting Local History through Oral Interviews",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (Documenting Local History through Oral Interviews)",
                "passage": "Grade 8 history students recently embarked on a local heritage project: recording oral history interviews with village elders. Armed with portable audio recorders and thoughtfully drafted questions, students gathered firsthand recollections of wartime resilience, communal traditions, and changing village landscapes. Elders shared emotional memories with pride, grateful that their stories would be preserved for future generations. Transcribing and archiving these oral accounts brought dry textbook history vibrantly to life. Intergenerational storytelling bridges time and deepens cultural pride."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 29,
                "id": "g8_gk1_803_q29",
                "type": "choice",
                "text": "According to the text, which of the following is highlighted?",
                "options": [
                        "Academic examinations are completely eliminated from school",
                        "Students must study alone without any guidance or support",
                        "Armed with portable audio recorders and thoughtfully drafted...",
                        "Teenagers should avoid all physical recreation activities"
                ],
                "correct": "Armed with portable audio recorders and thoughtfully drafted...",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Armed with portable audio recorders and thoughtfully drafted...)",
                "passage": "Grade 8 history students recently embarked on a local heritage project: recording oral history interviews with village elders. Armed with portable audio recorders and thoughtfully drafted questions, students gathered firsthand recollections of wartime resilience, communal traditions, and changing village landscapes. Elders shared emotional memories with pride, grateful that their stories would be preserved for future generations. Transcribing and archiving these oral accounts brought dry textbook history vibrantly to life. Intergenerational storytelling bridges time and deepens cultural pride."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 30,
                "id": "g8_gk1_803_q30",
                "type": "choice",
                "text": "Which of the following is TRUE according to the passage?",
                "options": [
                        "Engaging constructively in documenting local history through oral interviews brings positive benefits for students.",
                        "Living environments have no impact on adolescent wellbeing.",
                        "Teachers strictly forbid students from developing any creative hobbies.",
                        "Students should spend 24 hours a day on computer screens without resting."
                ],
                "correct": "Engaging constructively in documenting local history through oral interviews brings positive benefits for students.",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (Engaging constructively in documenting local history through oral interviews brings positive benefits for students.)",
                "passage": "Grade 8 history students recently embarked on a local heritage project: recording oral history interviews with village elders. Armed with portable audio recorders and thoughtfully drafted questions, students gathered firsthand recollections of wartime resilience, communal traditions, and changing village landscapes. Elders shared emotional memories with pride, grateful that their stories would be preserved for future generations. Transcribing and archiving these oral accounts brought dry textbook history vibrantly to life. Intergenerational storytelling bridges time and deepens cultural pride."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 31,
                "id": "g8_gk1_803_q31",
                "type": "choice",
                "text": "The word They' or This' in the passage refers to ________.",
                "options": [
                        "an angry crowd in the market",
                        "unrelated objects outside the school",
                        "the subject or people mentioned previously",
                        "distant foreign countries"
                ],
                "correct": "the subject or people mentioned previously",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (the subject or people mentioned previously)",
                "passage": "Grade 8 history students recently embarked on a local heritage project: recording oral history interviews with village elders. Armed with portable audio recorders and thoughtfully drafted questions, students gathered firsthand recollections of wartime resilience, communal traditions, and changing village landscapes. Elders shared emotional memories with pride, grateful that their stories would be preserved for future generations. Transcribing and archiving these oral accounts brought dry textbook history vibrantly to life. Intergenerational storytelling bridges time and deepens cultural pride."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 32,
                "id": "g8_gk1_803_q32",
                "type": "choice",
                "text": "The word important' in the passage is closest in meaning to ________.",
                "options": [
                        "difficult to remember",
                        "useless and meaningless",
                        "having great value and significance",
                        "extremely harmful and bad"
                ],
                "correct": "having great value and significance",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (having great value and significance)",
                "passage": "Grade 8 history students recently embarked on a local heritage project: recording oral history interviews with village elders. Armed with portable audio recorders and thoughtfully drafted questions, students gathered firsthand recollections of wartime resilience, communal traditions, and changing village landscapes. Elders shared emotional memories with pride, grateful that their stories would be preserved for future generations. Transcribing and archiving these oral accounts brought dry textbook history vibrantly to life. Intergenerational storytelling bridges time and deepens cultural pride."
        },
        {
                "part": "D",
                "partTitle": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "partInstruction": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "qNumber": 33,
                "id": "g8_gk1_803_q33",
                "type": "choice",
                "text": "City life is more hurried and stressful than countryside life.",
                "options": [
                        "Countryside life is more peaceful and slower as city life.",
                        "Countryside life are more peaceful and slower than city life.",
                        "Countryside life is as peaceful and slower than city life.",
                        "Countryside life is more peaceful and slower than city life."
                ],
                "correct": "Countryside life is more peaceful and slower than city life.",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (Countryside life is more peaceful and slower than city life.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "partInstruction": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "qNumber": 34,
                "id": "g8_gk1_803_q34",
                "type": "choice",
                "text": "It is fascinating to learn about nomadic lifestyle on the grasslands.",
                "options": [
                        "Learning about nomadic lifestyle on the grasslands is fascinating.",
                        "About learning nomadic lifestyle on the grasslands is fascinating.",
                        "Learning about nomadic lifestyle on the grasslands are fascinating.",
                        "Learning about nomadic lifestyle on the grasslands fascinating is."
                ],
                "correct": "Learning about nomadic lifestyle on the grasslands is fascinating.",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (Learning about nomadic lifestyle on the grasslands is fascinating.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "partInstruction": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "qNumber": 35,
                "id": "g8_gk1_803_q35",
                "type": "choice",
                "text": "hospitable / farmers / are / exceptionally / to / visitors / .",
                "options": [
                        "Farmers is exceptionally hospitable to visitors.",
                        "Farmers are exceptionally hospitable to visitors.",
                        "Are farmers exceptionally hospitable to visitors.",
                        "Farmers are exceptionally hospitable visitors to."
                ],
                "correct": "Farmers are exceptionally hospitable to visitors.",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Farmers are exceptionally hospitable to visitors.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "partInstruction": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "qNumber": 36,
                "id": "g8_gk1_803_q36",
                "type": "choice",
                "text": "balanced / lifestyle / empowers / teenagers / thrive / to / .",
                "options": [
                        "Balanced lifestyle empowers teenagers to thrive.",
                        "Lifestyle balanced empowers teenagers to thrive.",
                        "Balanced lifestyle teenagers empowers to thrive.",
                        "Balanced lifestyle empowers teenagers thrive to."
                ],
                "correct": "Balanced lifestyle empowers teenagers to thrive.",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (Balanced lifestyle empowers teenagers to thrive.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 8. Writing (1.0 pt) Write a paragraph (80-100 words) about one of the following topics: (1) Your favourite leisure activity, (2) Things you like about life in the countryside, or (3) Causes of and solutions to teen stress. You can use these cues:",
                "partInstruction": "Write a paragraph in English as requested below.",
                "qNumber": 37,
                "id": "g8_gk1_803_essay",
                "type": "essay",
                "text": "What is the specific topic you selected? What are the primary causes, details, or characteristics? What solutions or personal reflections do you draw?\n------The end------",
                "options": [],
                "correct": "Written paragraph",
                "correctLetter": "",
                "explanation": "Tiêu chuẩn chấm (Rubric):\\n1. Topic sentence: 0.25 pt\n2. Supporting sentences: 0.25 pt\n3. Range of vocabulary: 0.25 pt\n4. Accuracy (Grammar, spelling): 0.25 pt. Total: 1.0 point.\\n\\nBài văn mẫu tham khảo:\\nLife in the countryside holds a special charm for me because of its profound tranquility and wholesome environment. Firstly, the atmosphere is refreshingly pure and unpolluted, far removed from urban smog and perpetual traffic noise. Rolling green hills, expansive golden rice fields, and meandering rivers offer breathtaking scenery. Secondly, the villagers are remarkably warm-hearted, compassionate, and always ready to assist one another during harvest times. Living close to nature brings me inner serenity and revitalizes my mental well-being.",
                "passage": ""
        }
]
    },
    '804': {
      grade: 8,
      examType: 'giua-ky-1',
      typeTitle: 'BÀI KIỂM TRA ĐÁNH GIÁ GIỮA HỌC KỲ I',
      examCode: '804',
      durationMinutes: 60,
      schoolName: 'TRƯỜNG THCS ĐỒNG YÊN',
      teacherName: 'Thầy Đinh Văn Thành',
      audioUrl: '/web-tieng-anh/audio/listening_8_gk1.mp3',
      audioScript: `🎧 Transcript bài nghe Part 1 (Hội thoại - 1 Giọng Nam, 1 Giọng Nữ):
Jason (Giọng Nam):	Hi Hannah! Did you join any school clubs this academic year?
Hannah (Giọng Nữ):	Yes! I joined the Photography Club and the IT Club.
Jason (Giọng Nam):	Photography Club? That sounds fantastic! What do you photograph?
Hannah (Giọng Nữ):	We take pictures of campus life, nature, and historic architecture around town.
Jason (Giọng Nam):	Does joining clubs help you cope with school pressure?
Hannah (Giọng Nữ):	Definitely! It helps me make supportive friends, improve teamwork, and unwind after classes.

🎧 Transcript bài nghe Part 2 (Độc thoại):
Adolescence is an exciting time when teenagers explore new interests and develop social skills. Participating in extracurricular school clubs offers a safe, friendly space to share common passions. When feeling stressed about homework or exams, talking with friends and teachers helps teenagers overcome challenges with confidence.`,
      writingRubric: `1. Topic sentence: 0.25 pt
2. Supporting sentences: 0.25 pt
3. Range of vocabulary: 0.25 pt
4. Accuracy (Grammar, spelling): 0.25 pt. Total: 1.0 point.`,
      sampleWritingText: `Life in the countryside holds a special charm for me because of its profound tranquility and wholesome environment. Firstly, the atmosphere is refreshingly pure and unpolluted, far removed from urban smog and perpetual traffic noise. Rolling green hills, expansive golden rice fields, and meandering rivers offer breathtaking scenery. Secondly, the villagers are remarkably warm-hearted, compassionate, and always ready to assist one another during harvest times. Living close to nature brings me inner serenity and revitalizes my mental well-being.`,
      passageText: `Harvest time is the busiest yet most joyful season in the Vietnamese countryside. Early in the morning, farmers head out to the fields where ripe golden rice stretches as far as the eye can see. Many communes now use modern combine (23) ________ to cut and thresh rice much faster than in the past. After a hard working day, villagers gather in the communal yard to chat, drink green tea, and enjoy freshly made rice cakes. Children eagerly fly kites on river (24) ________ or play traditional games under the autumn breeze. Village life during harvest is full of laughter, warmth, and mutual (25) ________ among neighbors. For urban visitors, experiencing this simple rural atmosphere brings deep peace and helps them (26) ________ after busy workdays. The hospitality of countryside people always leaves an unforgettable (27) ________ on everyone.`,
      totalQuestions: 37,
      questions: [
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 1,
                "id": "g8_gk1_804_q1",
                "type": "choice",
                "text": "Which two clubs did Jason join this year?",
                "options": [
                        "Cooking Club only",
                        "Music Club only",
                        "Photography Club and IT Club"
                ],
                "correct": "Photography Club and IT Club",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Photography Club and IT Club)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 2,
                "id": "g8_gk1_804_q2",
                "type": "choice",
                "text": "What does the Photography Club photograph?",
                "options": [
                        "Cars only",
                        "Campus life, nature, and architecture",
                        "Fast food only"
                ],
                "correct": "Campus life, nature, and architecture",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Campus life, nature, and architecture)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 3,
                "id": "g8_gk1_804_q3",
                "type": "choice",
                "text": "How does joining clubs help Jason?",
                "options": [
                        "Makes friends, improves teamwork, unwinds",
                        "Costs too much money",
                        "Makes him feel tired"
                ],
                "correct": "Makes friends, improves teamwork, unwinds",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (Makes friends, improves teamwork, unwinds)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 4,
                "id": "g8_gk1_804_q4",
                "type": "choice",
                "text": "Who does Jason take pictures with?",
                "options": [
                        "Nobody",
                        "Club members",
                        "Strangers"
                ],
                "correct": "Club members",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Club members)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 5,
                "id": "g8_gk1_804_q5",
                "type": "choice",
                "text": "When do club activities help students?",
                "options": [
                        "Never",
                        "During midnight",
                        "After school classes"
                ],
                "correct": "After school classes",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (After school classes)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 6,
                "id": "g8_gk1_804_q6",
                "type": "choice",
                "text": "Adolescence is a time to explore new interests and social skills.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 7,
                "id": "g8_gk1_804_q7",
                "type": "choice",
                "text": "School clubs provide a safe space to share passions.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 8,
                "id": "g8_gk1_804_q8",
                "type": "choice",
                "text": "Teenagers should never talk to teachers when stressed.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "False",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (False)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 9,
                "id": "g8_gk1_804_q9",
                "type": "choice",
                "text": "Extracurricular activities help students overcome challenges.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 10,
                "id": "g8_gk1_804_q10",
                "type": "choice",
                "text": "Photography clubs only allow students to sleep.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "False",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (False)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 11,
                "id": "g8_gk1_804_q11",
                "type": "choice",
                "text": "People in rural areas usually live ________ than people in big cities.",
                "options": [
                        "more peacefully",
                        "peacefullier",
                        "most peaceful",
                        "peaceful"
                ],
                "correct": "more peacefully",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (more peacefully)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 12,
                "id": "g8_gk1_804_q12",
                "type": "choice",
                "text": "Many teenagers prefer sending text messages ________ calling directly.",
                "options": [
                        "with",
                        "from",
                        "than",
                        "to"
                ],
                "correct": "to",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (to)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 13,
                "id": "g8_gk1_804_q13",
                "type": "choice",
                "text": "She did the test ________ than her classmates because she revised carefully.",
                "options": [
                        "well",
                        "more well",
                        "better",
                        "good"
                ],
                "correct": "better",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (better)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 14,
                "id": "g8_gk1_804_q14",
                "type": "choice",
                "text": "Joining school clubs helps students make friends and learn teamwork ________.",
                "options": [
                        "books",
                        "desks",
                        "papers",
                        "skills"
                ],
                "correct": "skills",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (skills)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 15,
                "id": "g8_gk1_804_q15",
                "type": "choice",
                "text": "Farmers in our commune ________ rice on vast terraced fields every year.",
                "options": [
                        "cultivated",
                        "will cultivate",
                        "cultivate",
                        "are cultivating"
                ],
                "correct": "cultivate",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (cultivate)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 16,
                "id": "g8_gk1_804_q16",
                "type": "choice",
                "text": "They ________ the annual village festival on the 15th of the lunar month.",
                "options": [
                        "celebrate",
                        "celebrated",
                        "have celebrated",
                        "are celebrating"
                ],
                "correct": "celebrated",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (celebrated)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 17,
                "id": "g8_gk1_804_q17",
                "type": "choice",
                "text": "Choose the word CLOSEST in meaning to leisure': Teens spend leisure time browsing social networks.'",
                "options": [
                        "study hours",
                        "working hours",
                        "sleep time",
                        "free time"
                ],
                "correct": "free time",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (free time)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 18,
                "id": "g8_gk1_804_q18",
                "type": "choice",
                "text": "Mother: You shouldn't spend too much time surfing social media.' - Teen: '________'",
                "options": [
                        "Social media is fun.",
                        "Yes, mom. I will balance my study and screen time.",
                        "I have a new phone.",
                        "No, I am not."
                ],
                "correct": "Yes, mom. I will balance my study and screen time.",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Yes, mom. I will balance my study and screen time.)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 19,
                "id": "g8_gk1_804_q19",
                "type": "choice",
                "text": "The word harvest' refers to the time when farmers ________.",
                "options": [
                        "gather crops from the fields",
                        "buy chemical fertilizers",
                        "plant small seeds",
                        "plough the muddy land"
                ],
                "correct": "gather crops from the fields",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (gather crops from the fields)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 20,
                "id": "g8_gk1_804_q20",
                "type": "choice",
                "text": "Young teenagers often face peer ________ to fit in with their classmates.",
                "options": [
                        "freedom",
                        "club",
                        "leisure",
                        "pressure"
                ],
                "correct": "pressure",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (pressure)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 21,
                "id": "g8_gk1_804_q21",
                "type": "choice",
                "text": "Which word has the underlined part pronounced differently? vast, pasture, fast, harvest",
                "options": [
                        "fast",
                        "pasture",
                        "vast",
                        "harvest"
                ],
                "correct": "pasture",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (pasture)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 22,
                "id": "g8_gk1_804_q22",
                "type": "choice",
                "text": "Teacher: How is life in the countryside different from city life?' - Student: '________'",
                "options": [
                        "I like living.",
                        "Life in the countryside is more peaceful and the air is fresher.",
                        "Cities have lots of cars.",
                        "Villages have rice fields."
                ],
                "correct": "Life in the countryside is more peaceful and the air is fresher.",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Life in the countryside is more peaceful and the air is fresher.)",
                "passage": ""
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 23,
                "id": "g8_gk1_804_q23",
                "type": "choice",
                "text": "Choose the best word for blank (23):",
                "options": [
                        "phones",
                        "computers",
                        "harvesters",
                        "bicycles"
                ],
                "correct": "harvesters",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (harvesters)",
                "passage": "Harvest time is the busiest yet most joyful season in the Vietnamese countryside. Early in the morning, farmers head out to the fields where ripe golden rice stretches as far as the eye can see. Many communes now use modern combine (23) ________ to cut and thresh rice much faster than in the past. After a hard working day, villagers gather in the communal yard to chat, drink green tea, and enjoy freshly made rice cakes. Children eagerly fly kites on river (24) ________ or play traditional games under the autumn breeze. Village life during harvest is full of laughter, warmth, and mutual (25) ________ among neighbors. For urban visitors, experiencing this simple rural atmosphere brings deep peace and helps them (26) ________ after busy workdays. The hospitality of countryside people always leaves an unforgettable (27) ________ on everyone."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 24,
                "id": "g8_gk1_804_q24",
                "type": "choice",
                "text": "Choose the best word for blank (24):",
                "options": [
                        "floors",
                        "walls",
                        "roofs",
                        "dykes"
                ],
                "correct": "dykes",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (dykes)",
                "passage": "Harvest time is the busiest yet most joyful season in the Vietnamese countryside. Early in the morning, farmers head out to the fields where ripe golden rice stretches as far as the eye can see. Many communes now use modern combine (23) ________ to cut and thresh rice much faster than in the past. After a hard working day, villagers gather in the communal yard to chat, drink green tea, and enjoy freshly made rice cakes. Children eagerly fly kites on river (24) ________ or play traditional games under the autumn breeze. Village life during harvest is full of laughter, warmth, and mutual (25) ________ among neighbors. For urban visitors, experiencing this simple rural atmosphere brings deep peace and helps them (26) ________ after busy workdays. The hospitality of countryside people always leaves an unforgettable (27) ________ on everyone."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 25,
                "id": "g8_gk1_804_q25",
                "type": "choice",
                "text": "Choose the best word for blank (25):",
                "options": [
                        "anger",
                        "support",
                        "hatred",
                        "trouble"
                ],
                "correct": "support",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (support)",
                "passage": "Harvest time is the busiest yet most joyful season in the Vietnamese countryside. Early in the morning, farmers head out to the fields where ripe golden rice stretches as far as the eye can see. Many communes now use modern combine (23) ________ to cut and thresh rice much faster than in the past. After a hard working day, villagers gather in the communal yard to chat, drink green tea, and enjoy freshly made rice cakes. Children eagerly fly kites on river (24) ________ or play traditional games under the autumn breeze. Village life during harvest is full of laughter, warmth, and mutual (25) ________ among neighbors. For urban visitors, experiencing this simple rural atmosphere brings deep peace and helps them (26) ________ after busy workdays. The hospitality of countryside people always leaves an unforgettable (27) ________ on everyone."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 26,
                "id": "g8_gk1_804_q26",
                "type": "choice",
                "text": "Choose the best word for blank (26):",
                "options": [
                        "cry",
                        "worry",
                        "hurry",
                        "relax"
                ],
                "correct": "relax",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (relax)",
                "passage": "Harvest time is the busiest yet most joyful season in the Vietnamese countryside. Early in the morning, farmers head out to the fields where ripe golden rice stretches as far as the eye can see. Many communes now use modern combine (23) ________ to cut and thresh rice much faster than in the past. After a hard working day, villagers gather in the communal yard to chat, drink green tea, and enjoy freshly made rice cakes. Children eagerly fly kites on river (24) ________ or play traditional games under the autumn breeze. Village life during harvest is full of laughter, warmth, and mutual (25) ________ among neighbors. For urban visitors, experiencing this simple rural atmosphere brings deep peace and helps them (26) ________ after busy workdays. The hospitality of countryside people always leaves an unforgettable (27) ________ on everyone."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 27,
                "id": "g8_gk1_804_q27",
                "type": "choice",
                "text": "Choose the best word for blank (27):",
                "options": [
                        "accident",
                        "danger",
                        "impression",
                        "mistake"
                ],
                "correct": "impression",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (impression)",
                "passage": "Harvest time is the busiest yet most joyful season in the Vietnamese countryside. Early in the morning, farmers head out to the fields where ripe golden rice stretches as far as the eye can see. Many communes now use modern combine (23) ________ to cut and thresh rice much faster than in the past. After a hard working day, villagers gather in the communal yard to chat, drink green tea, and enjoy freshly made rice cakes. Children eagerly fly kites on river (24) ________ or play traditional games under the autumn breeze. Village life during harvest is full of laughter, warmth, and mutual (25) ________ among neighbors. For urban visitors, experiencing this simple rural atmosphere brings deep peace and helps them (26) ________ after busy workdays. The hospitality of countryside people always leaves an unforgettable (27) ________ on everyone."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 28,
                "id": "g8_gk1_804_q28",
                "type": "choice",
                "text": "What is the main topic of the passage?",
                "options": [
                        "Industrial manufacturing processes in urban factories",
                        "Technical guide for maintaining automobile and motorbike engines",
                        "Preserving Ancient Folk Songs of Bac Ninh",
                        "Commercial shopping centers and modern entertainment complexes"
                ],
                "correct": "Preserving Ancient Folk Songs of Bac Ninh",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Preserving Ancient Folk Songs of Bac Ninh)",
                "passage": "Quan họ folk singing, recognized by UNESCO as intangible cultural heritage, has been preserved in Bac Ninh for centuries. The singing involves alternating pairs of male and female singers performing lyrical, soulful melodies without musical accompaniment. Young apprentices spend years mastering intricate vocal techniques like vibrating, pouring, and vocal curling from elderly village artisans. Participating in youth quan họ clubs helps teenagers connect with the poetic soul of their ancestors. Preserving folk music keeps our national identity vibrant and proud."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 29,
                "id": "g8_gk1_804_q29",
                "type": "choice",
                "text": "Which of the following is TRUE according to the passage?",
                "options": [
                        "Engaging constructively in preserving ancient folk songs of bac ninh brings positive benefits for students.",
                        "Living environments have no impact on adolescent wellbeing.",
                        "Teachers strictly forbid students from developing any creative hobbies.",
                        "Students should spend 24 hours a day on computer screens without resting."
                ],
                "correct": "Engaging constructively in preserving ancient folk songs of bac ninh brings positive benefits for students.",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (Engaging constructively in preserving ancient folk songs of bac ninh brings positive benefits for students.)",
                "passage": "Quan họ folk singing, recognized by UNESCO as intangible cultural heritage, has been preserved in Bac Ninh for centuries. The singing involves alternating pairs of male and female singers performing lyrical, soulful melodies without musical accompaniment. Young apprentices spend years mastering intricate vocal techniques like vibrating, pouring, and vocal curling from elderly village artisans. Participating in youth quan họ clubs helps teenagers connect with the poetic soul of their ancestors. Preserving folk music keeps our national identity vibrant and proud."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 30,
                "id": "g8_gk1_804_q30",
                "type": "choice",
                "text": "According to the text, which of the following is highlighted?",
                "options": [
                        "Academic examinations are completely eliminated from school",
                        "Teenagers should avoid all physical recreation activities",
                        "Students must study alone without any guidance or support",
                        "The singing involves alternating pairs of male and female si..."
                ],
                "correct": "The singing involves alternating pairs of male and female si...",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (The singing involves alternating pairs of male and female si...)",
                "passage": "Quan họ folk singing, recognized by UNESCO as intangible cultural heritage, has been preserved in Bac Ninh for centuries. The singing involves alternating pairs of male and female singers performing lyrical, soulful melodies without musical accompaniment. Young apprentices spend years mastering intricate vocal techniques like vibrating, pouring, and vocal curling from elderly village artisans. Participating in youth quan họ clubs helps teenagers connect with the poetic soul of their ancestors. Preserving folk music keeps our national identity vibrant and proud."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 31,
                "id": "g8_gk1_804_q31",
                "type": "choice",
                "text": "The word They' or This' in the passage refers to ________.",
                "options": [
                        "distant foreign countries",
                        "unrelated objects outside the school",
                        "the subject or people mentioned previously",
                        "an angry crowd in the market"
                ],
                "correct": "the subject or people mentioned previously",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (the subject or people mentioned previously)",
                "passage": "Quan họ folk singing, recognized by UNESCO as intangible cultural heritage, has been preserved in Bac Ninh for centuries. The singing involves alternating pairs of male and female singers performing lyrical, soulful melodies without musical accompaniment. Young apprentices spend years mastering intricate vocal techniques like vibrating, pouring, and vocal curling from elderly village artisans. Participating in youth quan họ clubs helps teenagers connect with the poetic soul of their ancestors. Preserving folk music keeps our national identity vibrant and proud."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 32,
                "id": "g8_gk1_804_q32",
                "type": "choice",
                "text": "The word important' in the passage is closest in meaning to ________.",
                "options": [
                        "difficult to remember",
                        "having great value and significance",
                        "extremely harmful and bad",
                        "useless and meaningless"
                ],
                "correct": "having great value and significance",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (having great value and significance)",
                "passage": "Quan họ folk singing, recognized by UNESCO as intangible cultural heritage, has been preserved in Bac Ninh for centuries. The singing involves alternating pairs of male and female singers performing lyrical, soulful melodies without musical accompaniment. Young apprentices spend years mastering intricate vocal techniques like vibrating, pouring, and vocal curling from elderly village artisans. Participating in youth quan họ clubs helps teenagers connect with the poetic soul of their ancestors. Preserving folk music keeps our national identity vibrant and proud."
        },
        {
                "part": "D",
                "partTitle": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "partInstruction": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "qNumber": 33,
                "id": "g8_gk1_804_q33",
                "type": "choice",
                "text": "City dwellers usually drive more recklessly than rural drivers.",
                "options": [
                        "Rural drivers usually drive more carefully than city dwellers.",
                        "Rural drivers usually drive more carefully as city dwellers.",
                        "City dwellers drive more carefully than rural drivers.",
                        "Rural drivers drive as recklessly as city dwellers."
                ],
                "correct": "Rural drivers usually drive more carefully than city dwellers.",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (Rural drivers usually drive more carefully than city dwellers.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "partInstruction": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "qNumber": 34,
                "id": "g8_gk1_804_q34",
                "type": "choice",
                "text": "Anna detests doing repetitive household chores on weekends.",
                "options": [
                        "Anna enjoys doing repetitive household chores on weekends.",
                        "Anna doesn't like doing repetitive household chores on weekends.",
                        "Anna doesn't like doing repetitive household chores weekends on.",
                        "Anna is keen on doing household chores on weekends."
                ],
                "correct": "Anna doesn't like doing repetitive household chores on weekends.",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Anna doesn't like doing repetitive household chores on weekends.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "partInstruction": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "qNumber": 35,
                "id": "g8_gk1_804_q35",
                "type": "choice",
                "text": "nomads / travel / across / plateaus / horses / on / .",
                "options": [
                        "Nomads travel plateaus across on horses.",
                        "Travel nomads across plateaus on horses.",
                        "Nomads travel across plateaus horses on.",
                        "Nomads travel across plateaus on horses."
                ],
                "correct": "Nomads travel across plateaus on horses.",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (Nomads travel across plateaus on horses.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "partInstruction": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "qNumber": 36,
                "id": "g8_gk1_804_q36",
                "type": "choice",
                "text": "balanced / lifestyle / empowers / teenagers / thrive / to / .",
                "options": [
                        "Lifestyle balanced empowers teenagers to thrive.",
                        "Balanced lifestyle empowers teenagers thrive to.",
                        "Balanced lifestyle teenagers empowers to thrive.",
                        "Balanced lifestyle empowers teenagers to thrive."
                ],
                "correct": "Balanced lifestyle empowers teenagers to thrive.",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (Balanced lifestyle empowers teenagers to thrive.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 8. Writing (1.0 pt) Write a paragraph (80-100 words) about how competitive debate improves critical thinking.",
                "partInstruction": "Write a paragraph in English as requested below.",
                "qNumber": 37,
                "id": "g8_gk1_804_essay",
                "type": "essay",
                "text": "Skills practiced in debating (research, logical reasoning, public speaking); Learning to see multiple perspectives; Respecting opponents; Intellectual growth.\n------The end------",
                "options": [],
                "correct": "Written paragraph",
                "correctLetter": "",
                "explanation": "Tiêu chuẩn chấm (Rubric):\\n1. Topic sentence: 0.25 pt\n2. Supporting sentences: 0.25 pt\n3. Range of vocabulary: 0.25 pt\n4. Accuracy (Grammar, spelling): 0.25 pt. Total: 1.0 point.\\n\\nBài văn mẫu tham khảo:\\nLife in the countryside holds a special charm for me because of its profound tranquility and wholesome environment. Firstly, the atmosphere is refreshingly pure and unpolluted, far removed from urban smog and perpetual traffic noise. Rolling green hills, expansive golden rice fields, and meandering rivers offer breathtaking scenery. Secondly, the villagers are remarkably warm-hearted, compassionate, and always ready to assist one another during harvest times. Living close to nature brings me inner serenity and revitalizes my mental well-being.",
                "passage": ""
        }
]
    },
    '805': {
      grade: 8,
      examType: 'giua-ky-1',
      typeTitle: 'BÀI KIỂM TRA ĐÁNH GIÁ GIỮA HỌC KỲ I',
      examCode: '805',
      durationMinutes: 60,
      schoolName: 'TRƯỜNG THCS ĐỒNG YÊN',
      teacherName: 'Thầy Đinh Văn Thành',
      audioUrl: '/web-tieng-anh/audio/listening_8_gk1.mp3',
      audioScript: `🎧 Transcript bài nghe Part 1 (Hội thoại - 1 Giọng Nam, 1 Giọng Nữ):
Jason (Giọng Nam):	Hi Hannah! Did you join any school clubs this academic year?
Hannah (Giọng Nữ):	Yes! I joined the Photography Club and the IT Club.
Jason (Giọng Nam):	Photography Club? That sounds fantastic! What do you photograph?
Hannah (Giọng Nữ):	We take pictures of campus life, nature, and historic architecture around town.
Jason (Giọng Nam):	Does joining clubs help you cope with school pressure?
Hannah (Giọng Nữ):	Definitely! It helps me make supportive friends, improve teamwork, and unwind after classes.

🎧 Transcript bài nghe Part 2 (Độc thoại):
Adolescence is an exciting time when teenagers explore new interests and develop social skills. Participating in extracurricular school clubs offers a safe, friendly space to share common passions. When feeling stressed about homework or exams, talking with friends and teachers helps teenagers overcome challenges with confidence.`,
      writingRubric: `1. Topic sentence: 0.25 pt
2. Supporting sentences: 0.25 pt
3. Range of vocabulary: 0.25 pt
4. Accuracy (Grammar, spelling): 0.25 pt. Total: 1.0 point.`,
      sampleWritingText: `Life in the countryside holds a special charm for me because of its profound tranquility and wholesome environment. Firstly, the atmosphere is refreshingly pure and unpolluted, far removed from urban smog and perpetual traffic noise. Rolling green hills, expansive golden rice fields, and meandering rivers offer breathtaking scenery. Secondly, the villagers are remarkably warm-hearted, compassionate, and always ready to assist one another during harvest times. Living close to nature brings me inner serenity and revitalizes my mental well-being.`,
      passageText: `Engaging in 'Do-It-Yourself' (DIY) craft projects has become an increasingly popular leisure pursuit among teenagers. Instead of spending endless hours scrolling aimlessly through video feeds, many adolescents prefer making decorative items from recycled wood, fabric scraps, and clay. Building a miniature bookshelf or knitting a wool scarf requires meticulous attention to detail and sharp (23) ________ skills. When teens complete a handmade project, they feel a profound sense of personal (24) ________. Furthermore, DIY hobbies teach patience and promote an eco-friendly mindset by giving discarded materials a new (25) ________. Sharing handcrafted items as thoughtful gifts for friends fosters warm (26) ________ and makes leisure time profoundly (27) ________.`,
      totalQuestions: 37,
      questions: [
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 1,
                "id": "g8_gk1_805_q1",
                "type": "choice",
                "text": "Which two clubs did Jason join this year?",
                "options": [
                        "Music Club only",
                        "Photography Club and IT Club",
                        "Cooking Club only"
                ],
                "correct": "Photography Club and IT Club",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Photography Club and IT Club)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 2,
                "id": "g8_gk1_805_q2",
                "type": "choice",
                "text": "What does the Photography Club photograph?",
                "options": [
                        "Fast food only",
                        "Cars only",
                        "Campus life, nature, and architecture"
                ],
                "correct": "Campus life, nature, and architecture",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Campus life, nature, and architecture)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 3,
                "id": "g8_gk1_805_q3",
                "type": "choice",
                "text": "How does joining clubs help Jason?",
                "options": [
                        "Costs too much money",
                        "Makes friends, improves teamwork, unwinds",
                        "Makes him feel tired"
                ],
                "correct": "Makes friends, improves teamwork, unwinds",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Makes friends, improves teamwork, unwinds)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 4,
                "id": "g8_gk1_805_q4",
                "type": "choice",
                "text": "Who does Jason take pictures with?",
                "options": [
                        "Strangers",
                        "Club members",
                        "Nobody"
                ],
                "correct": "Club members",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Club members)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 5,
                "id": "g8_gk1_805_q5",
                "type": "choice",
                "text": "When do club activities help students?",
                "options": [
                        "After school classes",
                        "Never",
                        "During midnight"
                ],
                "correct": "After school classes",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (After school classes)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 6,
                "id": "g8_gk1_805_q6",
                "type": "choice",
                "text": "Adolescence is a time to explore new interests and social skills.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 7,
                "id": "g8_gk1_805_q7",
                "type": "choice",
                "text": "School clubs provide a safe space to share passions.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 8,
                "id": "g8_gk1_805_q8",
                "type": "choice",
                "text": "Teenagers should never talk to teachers when stressed.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "False",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (False)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 9,
                "id": "g8_gk1_805_q9",
                "type": "choice",
                "text": "Extracurricular activities help students overcome challenges.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 10,
                "id": "g8_gk1_805_q10",
                "type": "choice",
                "text": "Photography clubs only allow students to sleep.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "False",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (False)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 11,
                "id": "g8_gk1_805_q11",
                "type": "choice",
                "text": "Country folk live ________ harmony with nature and wildlife.",
                "options": [
                        "at",
                        "on",
                        "in",
                        "with"
                ],
                "correct": "in",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (in)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 12,
                "id": "g8_gk1_805_q12",
                "type": "choice",
                "text": "Which word has the underlined part pronounced differently? leisure, prefer, bed, tennis",
                "options": [
                        "bed",
                        "tennis",
                        "prefer",
                        "leisure"
                ],
                "correct": "leisure",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (leisure)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 13,
                "id": "g8_gk1_805_q13",
                "type": "choice",
                "text": "Joining school clubs helps students make friends and learn teamwork ________.",
                "options": [
                        "books",
                        "papers",
                        "desks",
                        "skills"
                ],
                "correct": "skills",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (skills)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 14,
                "id": "g8_gk1_805_q14",
                "type": "choice",
                "text": "The vast green fields in the countryside look very ________.",
                "options": [
                        "noisy",
                        "picturesque",
                        "busy",
                        "polluted"
                ],
                "correct": "picturesque",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (picturesque)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 15,
                "id": "g8_gk1_805_q15",
                "type": "choice",
                "text": "Teacher: How is life in the countryside different from city life?' - Student: '________'",
                "options": [
                        "I like living.",
                        "Life in the countryside is more peaceful and the air is fresher.",
                        "Cities have lots of cars.",
                        "Villages have rice fields."
                ],
                "correct": "Life in the countryside is more peaceful and the air is fresher.",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Life in the countryside is more peaceful and the air is fresher.)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 16,
                "id": "g8_gk1_805_q16",
                "type": "choice",
                "text": "People in rural areas usually live ________ than people in big cities.",
                "options": [
                        "more peacefully",
                        "peacefullier",
                        "peaceful",
                        "most peaceful"
                ],
                "correct": "more peacefully",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (more peacefully)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 17,
                "id": "g8_gk1_805_q17",
                "type": "choice",
                "text": "They ________ the annual village festival on the 15th of the lunar month.",
                "options": [
                        "have celebrated",
                        "celebrate",
                        "celebrated",
                        "are celebrating"
                ],
                "correct": "celebrated",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (celebrated)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 18,
                "id": "g8_gk1_805_q18",
                "type": "choice",
                "text": "Choose the word CLOSEST in meaning to leisure': Teens spend leisure time browsing social networks.'",
                "options": [
                        "study hours",
                        "sleep time",
                        "working hours",
                        "free time"
                ],
                "correct": "free time",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (free time)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 19,
                "id": "g8_gk1_805_q19",
                "type": "choice",
                "text": "Linh detests ________ up early on cold winter mornings.",
                "options": [
                        "got",
                        "get",
                        "getting",
                        "gets"
                ],
                "correct": "getting",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (getting)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 20,
                "id": "g8_gk1_805_q20",
                "type": "choice",
                "text": "Mother: You shouldn't spend too much time surfing social media.' - Teen: '________'",
                "options": [
                        "Social media is fun.",
                        "Yes, mom. I will balance my study and screen time.",
                        "I have a new phone.",
                        "No, I am not."
                ],
                "correct": "Yes, mom. I will balance my study and screen time.",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Yes, mom. I will balance my study and screen time.)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 21,
                "id": "g8_gk1_805_q21",
                "type": "choice",
                "text": "Farmers in our commune ________ rice on vast terraced fields every year.",
                "options": [
                        "cultivate",
                        "cultivated",
                        "are cultivating",
                        "will cultivate"
                ],
                "correct": "cultivate",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (cultivate)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 22,
                "id": "g8_gk1_805_q22",
                "type": "choice",
                "text": "Young teenagers often face peer ________ to fit in with their classmates.",
                "options": [
                        "pressure",
                        "freedom",
                        "leisure",
                        "club"
                ],
                "correct": "pressure",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (pressure)",
                "passage": ""
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 23,
                "id": "g8_gk1_805_q23",
                "type": "choice",
                "text": "Choose the best word for blank (23):",
                "options": [
                        "harmful",
                        "practical",
                        "clumsy",
                        "lazy"
                ],
                "correct": "practical",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (practical)",
                "passage": "Engaging in 'Do-It-Yourself' (DIY) craft projects has become an increasingly popular leisure pursuit among teenagers. Instead of spending endless hours scrolling aimlessly through video feeds, many adolescents prefer making decorative items from recycled wood, fabric scraps, and clay. Building a miniature bookshelf or knitting a wool scarf requires meticulous attention to detail and sharp (23) ________ skills. When teens complete a handmade project, they feel a profound sense of personal (24) ________. Furthermore, DIY hobbies teach patience and promote an eco-friendly mindset by giving discarded materials a new (25) ________. Sharing handcrafted items as thoughtful gifts for friends fosters warm (26) ________ and makes leisure time profoundly (27) ________."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 24,
                "id": "g8_gk1_805_q24",
                "type": "choice",
                "text": "Choose the best word for blank (24):",
                "options": [
                        "achievement",
                        "failure",
                        "trouble",
                        "disaster"
                ],
                "correct": "achievement",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (achievement)",
                "passage": "Engaging in 'Do-It-Yourself' (DIY) craft projects has become an increasingly popular leisure pursuit among teenagers. Instead of spending endless hours scrolling aimlessly through video feeds, many adolescents prefer making decorative items from recycled wood, fabric scraps, and clay. Building a miniature bookshelf or knitting a wool scarf requires meticulous attention to detail and sharp (23) ________ skills. When teens complete a handmade project, they feel a profound sense of personal (24) ________. Furthermore, DIY hobbies teach patience and promote an eco-friendly mindset by giving discarded materials a new (25) ________. Sharing handcrafted items as thoughtful gifts for friends fosters warm (26) ________ and makes leisure time profoundly (27) ________."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 25,
                "id": "g8_gk1_805_q25",
                "type": "choice",
                "text": "Choose the best word for blank (25):",
                "options": [
                        "trouble",
                        "life",
                        "danger",
                        "illness"
                ],
                "correct": "life",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (life)",
                "passage": "Engaging in 'Do-It-Yourself' (DIY) craft projects has become an increasingly popular leisure pursuit among teenagers. Instead of spending endless hours scrolling aimlessly through video feeds, many adolescents prefer making decorative items from recycled wood, fabric scraps, and clay. Building a miniature bookshelf or knitting a wool scarf requires meticulous attention to detail and sharp (23) ________ skills. When teens complete a handmade project, they feel a profound sense of personal (24) ________. Furthermore, DIY hobbies teach patience and promote an eco-friendly mindset by giving discarded materials a new (25) ________. Sharing handcrafted items as thoughtful gifts for friends fosters warm (26) ________ and makes leisure time profoundly (27) ________."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 26,
                "id": "g8_gk1_805_q26",
                "type": "choice",
                "text": "Choose the best word for blank (26):",
                "options": [
                        "bonds",
                        "fights",
                        "arguments",
                        "debts"
                ],
                "correct": "bonds",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (bonds)",
                "passage": "Engaging in 'Do-It-Yourself' (DIY) craft projects has become an increasingly popular leisure pursuit among teenagers. Instead of spending endless hours scrolling aimlessly through video feeds, many adolescents prefer making decorative items from recycled wood, fabric scraps, and clay. Building a miniature bookshelf or knitting a wool scarf requires meticulous attention to detail and sharp (23) ________ skills. When teens complete a handmade project, they feel a profound sense of personal (24) ________. Furthermore, DIY hobbies teach patience and promote an eco-friendly mindset by giving discarded materials a new (25) ________. Sharing handcrafted items as thoughtful gifts for friends fosters warm (26) ________ and makes leisure time profoundly (27) ________."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 27,
                "id": "g8_gk1_805_q27",
                "type": "choice",
                "text": "Choose the best word for blank (27):",
                "options": [
                        "boring",
                        "tiring",
                        "useless",
                        "meaningful"
                ],
                "correct": "meaningful",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (meaningful)",
                "passage": "Engaging in 'Do-It-Yourself' (DIY) craft projects has become an increasingly popular leisure pursuit among teenagers. Instead of spending endless hours scrolling aimlessly through video feeds, many adolescents prefer making decorative items from recycled wood, fabric scraps, and clay. Building a miniature bookshelf or knitting a wool scarf requires meticulous attention to detail and sharp (23) ________ skills. When teens complete a handmade project, they feel a profound sense of personal (24) ________. Furthermore, DIY hobbies teach patience and promote an eco-friendly mindset by giving discarded materials a new (25) ________. Sharing handcrafted items as thoughtful gifts for friends fosters warm (26) ________ and makes leisure time profoundly (27) ________."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 28,
                "id": "g8_gk1_805_q28",
                "type": "choice",
                "text": "What is the primary topic of the passage?",
                "options": [
                        "Why drones are dangerous in bad weather",
                        "How water buffaloes till paddy fields in the countryside",
                        "The history of urban supermarket chains",
                        "The modernization and technological innovation in Vietnamese agriculture"
                ],
                "correct": "The modernization and technological innovation in Vietnamese agriculture",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (The modernization and technological innovation in Vietnamese agriculture)",
                "passage": "Agriculture in the Vietnamese countryside is undergoing a transformative modernization driven by digital technology and smart farming machinery. Gone are the days when farmers relied solely on muscle power and water buffaloes to till muddy paddy fields. Today, farmers in the Mekong Delta and Red River Delta utilize unmanned aerial vehicles (drones) equipped with smart sensors to spray organic fertilizers and monitor crop health from the sky. Automated irrigation systems measure soil moisture levels in real-time, delivering the precise amount of water needed without waste. Furthermore, agricultural cooperatives are utilizing smartphone applications to track market commodity prices and connect directly with urban supermarket chains. These technological advancements have dramatically elevated crop yields, lowered production expenses, and reduced heavy manual labor for farmers. Consequently, young educated people are increasingly returning to rural hometowns to launch innovative agricultural start-ups, breathing dynamic new life into pastoral communities."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 29,
                "id": "g8_gk1_805_q29",
                "type": "choice",
                "text": "What do modern farmers use drones for according to paragraph 2?",
                "options": [
                        "To scare away wild birds",
                        "To spray organic fertilizers and monitor crop health",
                        "To transport passengers across rivers",
                        "To film wedding ceremonies in villages"
                ],
                "correct": "To spray organic fertilizers and monitor crop health",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (To spray organic fertilizers and monitor crop health)",
                "passage": "Agriculture in the Vietnamese countryside is undergoing a transformative modernization driven by digital technology and smart farming machinery. Gone are the days when farmers relied solely on muscle power and water buffaloes to till muddy paddy fields. Today, farmers in the Mekong Delta and Red River Delta utilize unmanned aerial vehicles (drones) equipped with smart sensors to spray organic fertilizers and monitor crop health from the sky. Automated irrigation systems measure soil moisture levels in real-time, delivering the precise amount of water needed without waste. Furthermore, agricultural cooperatives are utilizing smartphone applications to track market commodity prices and connect directly with urban supermarket chains. These technological advancements have dramatically elevated crop yields, lowered production expenses, and reduced heavy manual labor for farmers. Consequently, young educated people are increasingly returning to rural hometowns to launch innovative agricultural start-ups, breathing dynamic new life into pastoral communities."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 30,
                "id": "g8_gk1_805_q30",
                "type": "choice",
                "text": "The word These' in paragraph 3 refers to ________.",
                "options": [
                        "water buffaloes",
                        "technological advancements",
                        "paddy fields",
                        "smartphone applications"
                ],
                "correct": "technological advancements",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (technological advancements)",
                "passage": "Agriculture in the Vietnamese countryside is undergoing a transformative modernization driven by digital technology and smart farming machinery. Gone are the days when farmers relied solely on muscle power and water buffaloes to till muddy paddy fields. Today, farmers in the Mekong Delta and Red River Delta utilize unmanned aerial vehicles (drones) equipped with smart sensors to spray organic fertilizers and monitor crop health from the sky. Automated irrigation systems measure soil moisture levels in real-time, delivering the precise amount of water needed without waste. Furthermore, agricultural cooperatives are utilizing smartphone applications to track market commodity prices and connect directly with urban supermarket chains. These technological advancements have dramatically elevated crop yields, lowered production expenses, and reduced heavy manual labor for farmers. Consequently, young educated people are increasingly returning to rural hometowns to launch innovative agricultural start-ups, breathing dynamic new life into pastoral communities."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 31,
                "id": "g8_gk1_805_q31",
                "type": "choice",
                "text": "Why are young educated people returning to rural hometowns?",
                "options": [
                        "Because they dislike living in cities",
                        "To work as drone pilots for the military",
                        "To build factories and concrete roads",
                        "To launch innovative agricultural start-ups"
                ],
                "correct": "To launch innovative agricultural start-ups",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (To launch innovative agricultural start-ups)",
                "passage": "Agriculture in the Vietnamese countryside is undergoing a transformative modernization driven by digital technology and smart farming machinery. Gone are the days when farmers relied solely on muscle power and water buffaloes to till muddy paddy fields. Today, farmers in the Mekong Delta and Red River Delta utilize unmanned aerial vehicles (drones) equipped with smart sensors to spray organic fertilizers and monitor crop health from the sky. Automated irrigation systems measure soil moisture levels in real-time, delivering the precise amount of water needed without waste. Furthermore, agricultural cooperatives are utilizing smartphone applications to track market commodity prices and connect directly with urban supermarket chains. These technological advancements have dramatically elevated crop yields, lowered production expenses, and reduced heavy manual labor for farmers. Consequently, young educated people are increasingly returning to rural hometowns to launch innovative agricultural start-ups, breathing dynamic new life into pastoral communities."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 32,
                "id": "g8_gk1_805_q32",
                "type": "choice",
                "text": "The word elevated' in paragraph 3 is closest in meaning to ________.",
                "options": [
                        "destroyed",
                        "delayed",
                        "increased and raised",
                        "decreased heavily"
                ],
                "correct": "increased and raised",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (increased and raised)",
                "passage": "Agriculture in the Vietnamese countryside is undergoing a transformative modernization driven by digital technology and smart farming machinery. Gone are the days when farmers relied solely on muscle power and water buffaloes to till muddy paddy fields. Today, farmers in the Mekong Delta and Red River Delta utilize unmanned aerial vehicles (drones) equipped with smart sensors to spray organic fertilizers and monitor crop health from the sky. Automated irrigation systems measure soil moisture levels in real-time, delivering the precise amount of water needed without waste. Furthermore, agricultural cooperatives are utilizing smartphone applications to track market commodity prices and connect directly with urban supermarket chains. These technological advancements have dramatically elevated crop yields, lowered production expenses, and reduced heavy manual labor for farmers. Consequently, young educated people are increasingly returning to rural hometowns to launch innovative agricultural start-ups, breathing dynamic new life into pastoral communities."
        },
        {
                "part": "D",
                "partTitle": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "partInstruction": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "qNumber": 33,
                "id": "g8_gk1_805_q33",
                "type": "choice",
                "text": "Jane detests doing repetitive household chores on weekends.",
                "options": [
                        "Jane doesn't like doing repetitive household chores weekends on.",
                        "Jane enjoys doing repetitive household chores on weekends.",
                        "Jane is keen on doing household chores on weekends.",
                        "Jane doesn't like doing repetitive household chores on weekends."
                ],
                "correct": "Jane doesn't like doing repetitive household chores on weekends.",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (Jane doesn't like doing repetitive household chores on weekends.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "partInstruction": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "qNumber": 34,
                "id": "g8_gk1_805_q34",
                "type": "choice",
                "text": "Her presentation was more persuasive than Nam's.",
                "options": [
                        "Nam's presentation was less persuasive hers than.",
                        "Nam's presentation was less persuasive as hers.",
                        "Nam's presentation were less persuasive than hers.",
                        "Nam's presentation was less persuasive than hers."
                ],
                "correct": "Nam's presentation was less persuasive than hers.",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (Nam's presentation was less persuasive than hers.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "partInstruction": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "qNumber": 35,
                "id": "g8_gk1_805_q35",
                "type": "choice",
                "text": "hospitable / farmers / are / exceptionally / to / visitors / .",
                "options": [
                        "Farmers is exceptionally hospitable to visitors.",
                        "Farmers are exceptionally hospitable visitors to.",
                        "Are farmers exceptionally hospitable to visitors.",
                        "Farmers are exceptionally hospitable to visitors."
                ],
                "correct": "Farmers are exceptionally hospitable to visitors.",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (Farmers are exceptionally hospitable to visitors.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "partInstruction": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "qNumber": 36,
                "id": "g8_gk1_805_q36",
                "type": "choice",
                "text": "nomads / travel / across / plateaus / horses / on / .",
                "options": [
                        "Travel nomads across plateaus on horses.",
                        "Nomads travel across plateaus on horses.",
                        "Nomads travel plateaus across on horses.",
                        "Nomads travel across plateaus horses on."
                ],
                "correct": "Nomads travel across plateaus on horses.",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Nomads travel across plateaus on horses.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 8. Writing (1.0 pt) Write a paragraph (80-100 words) describing a DIY project you made from recycled materials.",
                "partInstruction": "Write a paragraph in English as requested below.",
                "qNumber": 37,
                "id": "g8_gk1_805_essay",
                "type": "essay",
                "text": "What item you created (planter, pen holder, lamp); Materials and tools used; Steps in the making process; Why upcycling is good for the environment.\n------The end------",
                "options": [],
                "correct": "Written paragraph",
                "correctLetter": "",
                "explanation": "Tiêu chuẩn chấm (Rubric):\\n1. Topic sentence: 0.25 pt\n2. Supporting sentences: 0.25 pt\n3. Range of vocabulary: 0.25 pt\n4. Accuracy (Grammar, spelling): 0.25 pt. Total: 1.0 point.\\n\\nBài văn mẫu tham khảo:\\nLife in the countryside holds a special charm for me because of its profound tranquility and wholesome environment. Firstly, the atmosphere is refreshingly pure and unpolluted, far removed from urban smog and perpetual traffic noise. Rolling green hills, expansive golden rice fields, and meandering rivers offer breathtaking scenery. Secondly, the villagers are remarkably warm-hearted, compassionate, and always ready to assist one another during harvest times. Living close to nature brings me inner serenity and revitalizes my mental well-being.",
                "passage": ""
        }
]
    },
    '806': {
      grade: 8,
      examType: 'giua-ky-1',
      typeTitle: 'BÀI KIỂM TRA ĐÁNH GIÁ GIỮA HỌC KỲ I',
      examCode: '806',
      durationMinutes: 60,
      schoolName: 'TRƯỜNG THCS ĐỒNG YÊN',
      teacherName: 'Thầy Đinh Văn Thành',
      audioUrl: '/web-tieng-anh/audio/listening_8_gk1.mp3',
      audioScript: `🎧 Transcript bài nghe Part 1 (Hội thoại - 1 Giọng Nam, 1 Giọng Nữ):
Jason (Giọng Nam):	Hi Hannah! Did you join any school clubs this academic year?
Hannah (Giọng Nữ):	Yes! I joined the Photography Club and the IT Club.
Jason (Giọng Nam):	Photography Club? That sounds fantastic! What do you photograph?
Hannah (Giọng Nữ):	We take pictures of campus life, nature, and historic architecture around town.
Jason (Giọng Nam):	Does joining clubs help you cope with school pressure?
Hannah (Giọng Nữ):	Definitely! It helps me make supportive friends, improve teamwork, and unwind after classes.

🎧 Transcript bài nghe Part 2 (Độc thoại):
Adolescence is an exciting time when teenagers explore new interests and develop social skills. Participating in extracurricular school clubs offers a safe, friendly space to share common passions. When feeling stressed about homework or exams, talking with friends and teachers helps teenagers overcome challenges with confidence.`,
      writingRubric: `1. Topic sentence: 0.25 pt
2. Supporting sentences: 0.25 pt
3. Range of vocabulary: 0.25 pt
4. Accuracy (Grammar, spelling): 0.25 pt. Total: 1.0 point.`,
      sampleWritingText: `Life in the countryside holds a special charm for me because of its profound tranquility and wholesome environment. Firstly, the atmosphere is refreshingly pure and unpolluted, far removed from urban smog and perpetual traffic noise. Rolling green hills, expansive golden rice fields, and meandering rivers offer breathtaking scenery. Secondly, the villagers are remarkably warm-hearted, compassionate, and always ready to assist one another during harvest times. Living close to nature brings me inner serenity and revitalizes my mental well-being.`,
      passageText: `Life in the Vietnamese countryside offers an idyllic contrast to the hectic pace of modern megacities. During harvest season, expansive paddy fields transform into a radiant golden carpet under the warm autumn sun. Farmers labor tirelessly from dawn till dusk, yet they are remarkably (23) ________ and hospitable to visitors. Children in rural hamlets often fly kites on river dikes, herd water buffaloes, or swim in crystal-clear irrigation (24) ________. There is virtually no traffic congestion or industrial air (25) ________, making the atmosphere invigorating and crisp. Neighbors treat one another like extended family members, always willing to lend a helping (26) ________ during festivals or village gatherings. For those yearning for quiet tranquility, spending a weekend in the countryside is truly (27) ________ and refreshing.`,
      totalQuestions: 37,
      questions: [
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 1,
                "id": "g8_gk1_806_q1",
                "type": "choice",
                "text": "Which two clubs did Jason join this year?",
                "options": [
                        "Cooking Club only",
                        "Photography Club and IT Club",
                        "Music Club only"
                ],
                "correct": "Photography Club and IT Club",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Photography Club and IT Club)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 2,
                "id": "g8_gk1_806_q2",
                "type": "choice",
                "text": "What does the Photography Club photograph?",
                "options": [
                        "Fast food only",
                        "Cars only",
                        "Campus life, nature, and architecture"
                ],
                "correct": "Campus life, nature, and architecture",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Campus life, nature, and architecture)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 3,
                "id": "g8_gk1_806_q3",
                "type": "choice",
                "text": "How does joining clubs help Jason?",
                "options": [
                        "Costs too much money",
                        "Makes him feel tired",
                        "Makes friends, improves teamwork, unwinds"
                ],
                "correct": "Makes friends, improves teamwork, unwinds",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Makes friends, improves teamwork, unwinds)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 4,
                "id": "g8_gk1_806_q4",
                "type": "choice",
                "text": "Who does Jason take pictures with?",
                "options": [
                        "Nobody",
                        "Club members",
                        "Strangers"
                ],
                "correct": "Club members",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Club members)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "partInstruction": "Part 1. Listen and circle the best answer A, B, or C. (1.25 pts)",
                "qNumber": 5,
                "id": "g8_gk1_806_q5",
                "type": "choice",
                "text": "When do club activities help students?",
                "options": [
                        "Never",
                        "During midnight",
                        "After school classes"
                ],
                "correct": "After school classes",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (After school classes)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 6,
                "id": "g8_gk1_806_q6",
                "type": "choice",
                "text": "Adolescence is a time to explore new interests and social skills.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 7,
                "id": "g8_gk1_806_q7",
                "type": "choice",
                "text": "School clubs provide a safe space to share passions.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 8,
                "id": "g8_gk1_806_q8",
                "type": "choice",
                "text": "Teenagers should never talk to teachers when stressed.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "False",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (False)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 9,
                "id": "g8_gk1_806_q9",
                "type": "choice",
                "text": "Extracurricular activities help students overcome challenges.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "True",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (True)",
                "passage": ""
        },
        {
                "part": "A",
                "partTitle": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "partInstruction": "Part 2. Listen and circle the best answer A or B. (1.25 pts)",
                "qNumber": 10,
                "id": "g8_gk1_806_q10",
                "type": "choice",
                "text": "Photography clubs only allow students to sleep.",
                "options": [
                        "True",
                        "False"
                ],
                "correct": "False",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (False)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 11,
                "id": "g8_gk1_806_q11",
                "type": "choice",
                "text": "Which word has the underlined part pronounced differently? craft, pasture, vast, canal",
                "options": [
                        "vast",
                        "pasture",
                        "craft",
                        "canal"
                ],
                "correct": "canal",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (canal)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 12,
                "id": "g8_gk1_806_q12",
                "type": "choice",
                "text": "Teacher: How is life in the countryside different from city life?' - Student: '________'",
                "options": [
                        "Cities have lots of cars.",
                        "Life in the countryside is more peaceful and the air is fresher.",
                        "Villages have rice fields.",
                        "I like living."
                ],
                "correct": "Life in the countryside is more peaceful and the air is fresher.",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Life in the countryside is more peaceful and the air is fresher.)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 13,
                "id": "g8_gk1_806_q13",
                "type": "choice",
                "text": "He is keen on doing ________ projects such as making a small bookshelf.",
                "options": [
                        "TV",
                        "SOS",
                        "SMS",
                        "DIY"
                ],
                "correct": "DIY",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (DIY)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 14,
                "id": "g8_gk1_806_q14",
                "type": "choice",
                "text": "Ethnic minority groups are proud ________ their traditional embroidered costumes.",
                "options": [
                        "of",
                        "about",
                        "for",
                        "in"
                ],
                "correct": "of",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (of)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 15,
                "id": "g8_gk1_806_q15",
                "type": "choice",
                "text": "Mother: You shouldn't spend too much time surfing social media.' - Teen: '________'",
                "options": [
                        "I have a new phone.",
                        "Social media is fun.",
                        "Yes, mom. I will balance my study and screen time.",
                        "No, I am not."
                ],
                "correct": "Yes, mom. I will balance my study and screen time.",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Yes, mom. I will balance my study and screen time.)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 16,
                "id": "g8_gk1_806_q16",
                "type": "choice",
                "text": "Linh detests ________ up early on cold winter mornings.",
                "options": [
                        "getting",
                        "get",
                        "gets",
                        "got"
                ],
                "correct": "getting",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (getting)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 17,
                "id": "g8_gk1_806_q17",
                "type": "choice",
                "text": "Farmers in our commune ________ rice on vast terraced fields every year.",
                "options": [
                        "cultivate",
                        "will cultivate",
                        "are cultivating",
                        "cultivated"
                ],
                "correct": "cultivate",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (cultivate)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 18,
                "id": "g8_gk1_806_q18",
                "type": "choice",
                "text": "My little brother adores ________ football with his classmates after school.",
                "options": [
                        "played",
                        "to playing",
                        "playing",
                        "play"
                ],
                "correct": "playing",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (playing)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 19,
                "id": "g8_gk1_806_q19",
                "type": "choice",
                "text": "The vast green fields in the countryside look very ________.",
                "options": [
                        "picturesque",
                        "polluted",
                        "noisy",
                        "busy"
                ],
                "correct": "picturesque",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (picturesque)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 20,
                "id": "g8_gk1_806_q20",
                "type": "choice",
                "text": "During harvest time, farmers in my village work very ________ on the fields.",
                "options": [
                        "slow",
                        "lazy",
                        "hardly",
                        "hard"
                ],
                "correct": "hard",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (hard)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 21,
                "id": "g8_gk1_806_q21",
                "type": "choice",
                "text": "They ________ the annual village festival on the 15th of the lunar month.",
                "options": [
                        "celebrated",
                        "are celebrating",
                        "celebrate",
                        "have celebrated"
                ],
                "correct": "celebrated",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (celebrated)",
                "passage": ""
        },
        {
                "part": "B",
                "partTitle": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "partInstruction": "Part 3. Choose A, B, C or D to complete the following sentences. (3.0 pts)",
                "qNumber": 22,
                "id": "g8_gk1_806_q22",
                "type": "choice",
                "text": "Choose the word OPPOSITE in meaning to peaceful': Life in the countryside is very peaceful.'",
                "options": [
                        "quiet",
                        "noisy and chaotic",
                        "calm",
                        "serene"
                ],
                "correct": "noisy and chaotic",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (noisy and chaotic)",
                "passage": ""
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 23,
                "id": "g8_gk1_806_q23",
                "type": "choice",
                "text": "Choose the best word for blank (23):",
                "options": [
                        "friendly",
                        "hostile",
                        "impatient",
                        "rude"
                ],
                "correct": "friendly",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (friendly)",
                "passage": "Life in the Vietnamese countryside offers an idyllic contrast to the hectic pace of modern megacities. During harvest season, expansive paddy fields transform into a radiant golden carpet under the warm autumn sun. Farmers labor tirelessly from dawn till dusk, yet they are remarkably (23) ________ and hospitable to visitors. Children in rural hamlets often fly kites on river dikes, herd water buffaloes, or swim in crystal-clear irrigation (24) ________. There is virtually no traffic congestion or industrial air (25) ________, making the atmosphere invigorating and crisp. Neighbors treat one another like extended family members, always willing to lend a helping (26) ________ during festivals or village gatherings. For those yearning for quiet tranquility, spending a weekend in the countryside is truly (27) ________ and refreshing."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 24,
                "id": "g8_gk1_806_q24",
                "type": "choice",
                "text": "Choose the best word for blank (24):",
                "options": [
                        "roads",
                        "houses",
                        "canals",
                        "towers"
                ],
                "correct": "canals",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (canals)",
                "passage": "Life in the Vietnamese countryside offers an idyllic contrast to the hectic pace of modern megacities. During harvest season, expansive paddy fields transform into a radiant golden carpet under the warm autumn sun. Farmers labor tirelessly from dawn till dusk, yet they are remarkably (23) ________ and hospitable to visitors. Children in rural hamlets often fly kites on river dikes, herd water buffaloes, or swim in crystal-clear irrigation (24) ________. There is virtually no traffic congestion or industrial air (25) ________, making the atmosphere invigorating and crisp. Neighbors treat one another like extended family members, always willing to lend a helping (26) ________ during festivals or village gatherings. For those yearning for quiet tranquility, spending a weekend in the countryside is truly (27) ________ and refreshing."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 25,
                "id": "g8_gk1_806_q25",
                "type": "choice",
                "text": "Choose the best word for blank (25):",
                "options": [
                        "safety",
                        "pollution",
                        "freshness",
                        "silence"
                ],
                "correct": "pollution",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (pollution)",
                "passage": "Life in the Vietnamese countryside offers an idyllic contrast to the hectic pace of modern megacities. During harvest season, expansive paddy fields transform into a radiant golden carpet under the warm autumn sun. Farmers labor tirelessly from dawn till dusk, yet they are remarkably (23) ________ and hospitable to visitors. Children in rural hamlets often fly kites on river dikes, herd water buffaloes, or swim in crystal-clear irrigation (24) ________. There is virtually no traffic congestion or industrial air (25) ________, making the atmosphere invigorating and crisp. Neighbors treat one another like extended family members, always willing to lend a helping (26) ________ during festivals or village gatherings. For those yearning for quiet tranquility, spending a weekend in the countryside is truly (27) ________ and refreshing."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 26,
                "id": "g8_gk1_806_q26",
                "type": "choice",
                "text": "Choose the best word for blank (26):",
                "options": [
                        "hand",
                        "foot",
                        "head",
                        "leg"
                ],
                "correct": "hand",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (hand)",
                "passage": "Life in the Vietnamese countryside offers an idyllic contrast to the hectic pace of modern megacities. During harvest season, expansive paddy fields transform into a radiant golden carpet under the warm autumn sun. Farmers labor tirelessly from dawn till dusk, yet they are remarkably (23) ________ and hospitable to visitors. Children in rural hamlets often fly kites on river dikes, herd water buffaloes, or swim in crystal-clear irrigation (24) ________. There is virtually no traffic congestion or industrial air (25) ________, making the atmosphere invigorating and crisp. Neighbors treat one another like extended family members, always willing to lend a helping (26) ________ during festivals or village gatherings. For those yearning for quiet tranquility, spending a weekend in the countryside is truly (27) ________ and refreshing."
        },
        {
                "part": "C",
                "partTitle": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "partInstruction": "Part 4. Read and choose the best answer A, B, C or D to complete the passage. (1.25 pts)",
                "qNumber": 27,
                "id": "g8_gk1_806_q27",
                "type": "choice",
                "text": "Choose the best word for blank (27):",
                "options": [
                        "dangerous",
                        "exhausting",
                        "relaxing",
                        "boring"
                ],
                "correct": "relaxing",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (relaxing)",
                "passage": "Life in the Vietnamese countryside offers an idyllic contrast to the hectic pace of modern megacities. During harvest season, expansive paddy fields transform into a radiant golden carpet under the warm autumn sun. Farmers labor tirelessly from dawn till dusk, yet they are remarkably (23) ________ and hospitable to visitors. Children in rural hamlets often fly kites on river dikes, herd water buffaloes, or swim in crystal-clear irrigation (24) ________. There is virtually no traffic congestion or industrial air (25) ________, making the atmosphere invigorating and crisp. Neighbors treat one another like extended family members, always willing to lend a helping (26) ________ during festivals or village gatherings. For those yearning for quiet tranquility, spending a weekend in the countryside is truly (27) ________ and refreshing."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 28,
                "id": "g8_gk1_806_q28",
                "type": "choice",
                "text": "What handmade activities are mentioned in paragraph 2?",
                "options": [
                        "Folding origami, knitting, and making photo frames",
                        "Building large concrete houses",
                        "Repairing motorcycles and cars",
                        "Programming complex video games"
                ],
                "correct": "Folding origami, knitting, and making photo frames",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (Folding origami, knitting, and making photo frames)",
                "passage": "Spending leisure time effectively plays an essential role in the physical and mental well-being of secondary students. After demanding school hours, engaging in favorite hobbies allows teenagers to recharge their energy and develop creative talents. Among various pastimes, DIY (Do-It-Yourself) crafts and handmade projects have become increasingly popular among teenagers. Many students enjoy folding origami, knitting wool scarves, or making personalized photo frames from recycled cardboard. Creating things by hand requires patience and focus, which helps young people train their concentration and express their artistic imagination. In addition, giving handmade gifts to family members and friends brings immense joy and strengthens personal bonds. Besides indoor crafts, outdoor activities like cycling, playing badminton, and skateboarding offer fantastic health benefits. They keep teenagers active, improve physical fitness, and prevent them from spending excessive hours staring at smartphone screens. Finding a balanced combination of creative hobbies and sports is the key to a happy teenage life."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 29,
                "id": "g8_gk1_806_q29",
                "type": "choice",
                "text": "What is the main message of the reading passage?",
                "options": [
                        "How to become a professional badminton player",
                        "The benefits of balancing creative crafts and sports in leisure time",
                        "Why teenagers should stop doing hobbies",
                        "The history of smartphone screens in Viet Nam"
                ],
                "correct": "The benefits of balancing creative crafts and sports in leisure time",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (The benefits of balancing creative crafts and sports in leisure time)",
                "passage": "Spending leisure time effectively plays an essential role in the physical and mental well-being of secondary students. After demanding school hours, engaging in favorite hobbies allows teenagers to recharge their energy and develop creative talents. Among various pastimes, DIY (Do-It-Yourself) crafts and handmade projects have become increasingly popular among teenagers. Many students enjoy folding origami, knitting wool scarves, or making personalized photo frames from recycled cardboard. Creating things by hand requires patience and focus, which helps young people train their concentration and express their artistic imagination. In addition, giving handmade gifts to family members and friends brings immense joy and strengthens personal bonds. Besides indoor crafts, outdoor activities like cycling, playing badminton, and skateboarding offer fantastic health benefits. They keep teenagers active, improve physical fitness, and prevent them from spending excessive hours staring at smartphone screens. Finding a balanced combination of creative hobbies and sports is the key to a happy teenage life."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 30,
                "id": "g8_gk1_806_q30",
                "type": "choice",
                "text": "What skills do teenagers develop when making DIY crafts?",
                "options": [
                        "Patience, focus, and artistic imagination",
                        "Playing violent computer games",
                        "Driving trucks and flying planes",
                        "Cooking expensive restaurant meals"
                ],
                "correct": "Patience, focus, and artistic imagination",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (Patience, focus, and artistic imagination)",
                "passage": "Spending leisure time effectively plays an essential role in the physical and mental well-being of secondary students. After demanding school hours, engaging in favorite hobbies allows teenagers to recharge their energy and develop creative talents. Among various pastimes, DIY (Do-It-Yourself) crafts and handmade projects have become increasingly popular among teenagers. Many students enjoy folding origami, knitting wool scarves, or making personalized photo frames from recycled cardboard. Creating things by hand requires patience and focus, which helps young people train their concentration and express their artistic imagination. In addition, giving handmade gifts to family members and friends brings immense joy and strengthens personal bonds. Besides indoor crafts, outdoor activities like cycling, playing badminton, and skateboarding offer fantastic health benefits. They keep teenagers active, improve physical fitness, and prevent them from spending excessive hours staring at smartphone screens. Finding a balanced combination of creative hobbies and sports is the key to a happy teenage life."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 31,
                "id": "g8_gk1_806_q31",
                "type": "choice",
                "text": "Why is spending leisure time effectively important for teenagers?",
                "options": [
                        "It helps them recharge energy and develop creative talents",
                        "It allows them to stay in bed all day long",
                        "It forces them to avoid making friends",
                        "It replaces all their school subjects"
                ],
                "correct": "It helps them recharge energy and develop creative talents",
                "correctLetter": "A",
                "explanation": "Đáp án đúng: A (It helps them recharge energy and develop creative talents)",
                "passage": "Spending leisure time effectively plays an essential role in the physical and mental well-being of secondary students. After demanding school hours, engaging in favorite hobbies allows teenagers to recharge their energy and develop creative talents. Among various pastimes, DIY (Do-It-Yourself) crafts and handmade projects have become increasingly popular among teenagers. Many students enjoy folding origami, knitting wool scarves, or making personalized photo frames from recycled cardboard. Creating things by hand requires patience and focus, which helps young people train their concentration and express their artistic imagination. In addition, giving handmade gifts to family members and friends brings immense joy and strengthens personal bonds. Besides indoor crafts, outdoor activities like cycling, playing badminton, and skateboarding offer fantastic health benefits. They keep teenagers active, improve physical fitness, and prevent them from spending excessive hours staring at smartphone screens. Finding a balanced combination of creative hobbies and sports is the key to a happy teenage life."
        },
        {
                "part": "C",
                "partTitle": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "partInstruction": "Part 5. Read the passage and choose the best answer A, B, C or D for each question. (1.25 pts)",
                "qNumber": 32,
                "id": "g8_gk1_806_q32",
                "type": "choice",
                "text": "How do outdoor activities like cycling and badminton benefit students?",
                "options": [
                        "They cost too much money for families",
                        "They encourage students to play more mobile games",
                        "They keep teenagers active and improve physical fitness",
                        "They make students feel exhausted and unhappy"
                ],
                "correct": "They keep teenagers active and improve physical fitness",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (They keep teenagers active and improve physical fitness)",
                "passage": "Spending leisure time effectively plays an essential role in the physical and mental well-being of secondary students. After demanding school hours, engaging in favorite hobbies allows teenagers to recharge their energy and develop creative talents. Among various pastimes, DIY (Do-It-Yourself) crafts and handmade projects have become increasingly popular among teenagers. Many students enjoy folding origami, knitting wool scarves, or making personalized photo frames from recycled cardboard. Creating things by hand requires patience and focus, which helps young people train their concentration and express their artistic imagination. In addition, giving handmade gifts to family members and friends brings immense joy and strengthens personal bonds. Besides indoor crafts, outdoor activities like cycling, playing badminton, and skateboarding offer fantastic health benefits. They keep teenagers active, improve physical fitness, and prevent them from spending excessive hours staring at smartphone screens. Finding a balanced combination of creative hobbies and sports is the key to a happy teenage life."
        },
        {
                "part": "D",
                "partTitle": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "partInstruction": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "qNumber": 33,
                "id": "g8_gk1_806_q33",
                "type": "choice",
                "text": "How about joining the school environmental society this term?",
                "options": [
                        "Don't why we join the school environmental society this term?",
                        "Why don't we join the school environmental society this term?",
                        "Why don't we join the school environmental society term this?",
                        "Why don't join we the school environmental society this term?"
                ],
                "correct": "Why don't we join the school environmental society this term?",
                "correctLetter": "B",
                "explanation": "Đáp án đúng: B (Why don't we join the school environmental society this term?)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "partInstruction": "Part 6. Sentence Transformation: Choose the correct sentence A, B, C or D that has the closest meaning. (0.5 pt)",
                "qNumber": 34,
                "id": "g8_gk1_806_q34",
                "type": "choice",
                "text": "City dwellers usually drive more recklessly than rural drivers.",
                "options": [
                        "Rural drivers usually drive more carefully as city dwellers.",
                        "Rural drivers drive as recklessly as city dwellers.",
                        "Rural drivers usually drive more carefully than city dwellers.",
                        "City dwellers drive more carefully than rural drivers."
                ],
                "correct": "Rural drivers usually drive more carefully than city dwellers.",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Rural drivers usually drive more carefully than city dwellers.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "partInstruction": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "qNumber": 35,
                "id": "g8_gk1_806_q35",
                "type": "choice",
                "text": "hospitable / farmers / are / exceptionally / to / visitors / .",
                "options": [
                        "Are farmers exceptionally hospitable to visitors.",
                        "Farmers is exceptionally hospitable to visitors.",
                        "Farmers are exceptionally hospitable to visitors.",
                        "Farmers are exceptionally hospitable visitors to."
                ],
                "correct": "Farmers are exceptionally hospitable to visitors.",
                "correctLetter": "C",
                "explanation": "Đáp án đúng: C (Farmers are exceptionally hospitable to visitors.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "partInstruction": "Part 7. Reorder the words/phrases: Choose the correct sentence A, B, C or D. (0.5 pt)",
                "qNumber": 36,
                "id": "g8_gk1_806_q36",
                "type": "choice",
                "text": "balanced / lifestyle / empowers / teenagers / thrive / to / .",
                "options": [
                        "Balanced lifestyle empowers teenagers thrive to.",
                        "Lifestyle balanced empowers teenagers to thrive.",
                        "Balanced lifestyle teenagers empowers to thrive.",
                        "Balanced lifestyle empowers teenagers to thrive."
                ],
                "correct": "Balanced lifestyle empowers teenagers to thrive.",
                "correctLetter": "D",
                "explanation": "Đáp án đúng: D (Balanced lifestyle empowers teenagers to thrive.)",
                "passage": ""
        },
        {
                "part": "D",
                "partTitle": "Part 8. Writing (1.0 pt) Write a paragraph (80-100 words) comparing life in the city with life in the countryside.",
                "partInstruction": "Write a paragraph in English as requested below.",
                "qNumber": 37,
                "id": "g8_gk1_806_essay",
                "type": "essay",
                "text": "Pace of life, environment, and air quality; Relationships between neighbours; Transport and facilities; Which lifestyle you prefer and why.\n------The end------",
                "options": [],
                "correct": "Written paragraph",
                "correctLetter": "",
                "explanation": "Tiêu chuẩn chấm (Rubric):\\n1. Topic sentence: 0.25 pt\n2. Supporting sentences: 0.25 pt\n3. Range of vocabulary: 0.25 pt\n4. Accuracy (Grammar, spelling): 0.25 pt. Total: 1.0 point.\\n\\nBài văn mẫu tham khảo:\\nLife in the countryside holds a special charm for me because of its profound tranquility and wholesome environment. Firstly, the atmosphere is refreshingly pure and unpolluted, far removed from urban smog and perpetual traffic noise. Rolling green hills, expansive golden rice fields, and meandering rivers offer breathtaking scenery. Secondly, the villagers are remarkably warm-hearted, compassionate, and always ready to assist one another during harvest times. Living close to nature brings me inner serenity and revitalizes my mental well-being.",
                "passage": ""
        }
]
    },
  },
};
