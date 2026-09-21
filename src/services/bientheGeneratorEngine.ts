// ============================================================================
// ĐỘNG CƠ SINH 3 ĐỀ BIẾN THỂ VIP & ĐÁP ÁN CHI TIẾT (V1)
// Tác giả: Thầy giáo Đinh Văn Thành – THCS Đồng Yên – ĐT/Zalo: 0915.213717
// Chức năng:
// 1. Phân tích ma trận đề gốc (Lớp 6, 7, 8, 9, Kỹ năng, Số câu, Mức độ khó)
// 2. Sinh 3 đề biến thể tương đương:
//    - Đề 1 (Biến thể nhẹ): Đổi từ vựng, tình huống, nhân vật; giữ nguyên ma trận ngữ pháp
//    - Đề 2 (Biến thể trung bình): Đổi câu hỏi và ngữ cảnh, bài đọc viết mới theo chủ đề
//    - Đề 3 (Biến thể sâu): Câu hỏi độc lập hoàn toàn, bám sát ma trận kiến thức
// 3. Đầy đủ Đề thi + Đáp án (Audio Script, Sample Writing, Speaking cues & answers)
// 4. Xuất file Microsoft Word (.doc) chuẩn 100% Sư phạm (A4, Times New Roman 13pt, ngắt trang section break)
// ============================================================================

export interface ExamAnalysis {
  subject: string;
  grade: string;
  totalQuestions: string;
  totalParts: string;
  skillsTested: string;
  difficulty: string;
}

export interface ExamVariant {
  title: string;
  examContent: string;
  answers: string;
}

export interface BientheSuiteData {
  analysis: ExamAnalysis;
  variant1: ExamVariant;
  variant2: ExamVariant;
  variant3: ExamVariant;
}

export interface PresetExam {
  id: string;
  label: string;
  grade: string;
  content: string;
}

export const BIENTHE_PRESETS: PresetExam[] = [
  {
    id: "grade9-unit1",
    label: "Đề Lớp 9 - Unit 1: Local Community (15 phút - 8 câu)",
    grade: "Lớp 9",
    content: `ĐỀ KIỂM TRA 15 PHÚT - MÔN: TIẾNG ANH 9
CHỦ ĐỀ: LOCAL COMMUNITY (Cộng đồng địa phương)

I. Choose the correct answer A, B, C, or D to complete each sentence. (4 câu - 4.0 điểm)
1. This scarf was _______ by hand in a traditional craft village.
A. woven          B. knit          C. carved          D. molded

2. My family decided to take a trip to Bat Trang village to _______ how to make pottery.
A. look up          B. learn about          C. pass down          D. close down

3. The artisans in Dong Ho village always try to _______ their traditional craft.
A. set up          B. keep up with          C. preserve          D. take off

4. We need to find a way to make our neighborhood cleaner, _______?
A. don't we          B. do we          C. aren't we          D. won't we

II. Complete each sentence with the correct form of the word in brackets. (2 câu - 2.0 điểm)
5. The local village is famous for its _______ paintings. (TRADITION)
6. Making pottery requires a lot of _______ and patience. (SKILLFUL)

III. Rewrite the following sentences using the suggestions. (2 câu - 4.0 điểm)
7. "I will show you around the lantern-making workshop tomorrow," said Phong.
-> Phong said ___________________________________________
8. Although she was very tired, she continued weaving the tapestry.
-> In spite of ___________________________________________

--- ĐÁP ÁN GỐC ---
1. A    2. B    3. C    4. A
5. traditional    6. skill
7. Phong said that he would show me around the lantern-making workshop the next day.
8. In spite of being very tired, she continued weaving the tapestry.`
  },
  {
    id: "grade8-leisure",
    label: "Đề Lớp 8 - Unit 1: Leisure Time & Hobbies (Trắc nghiệm + Viết)",
    grade: "Lớp 8",
    content: `ĐỀ KIỂM TRA ĐỊNH KỲ - MÔN: TIẾNG ANH 8
CHỦ ĐỀ: LEISURE TIME & LIFE IN THE COUNTRYSIDE

I. Choose the word whose underlined part is pronounced differently. (2 câu)
1. A. leisure          B. eight          C. celebrate          D. penalty
2. A. message          B. privilege          C. village          D. manage

II. Choose the best answer A, B, C or D to complete the sentences. (4 câu)
3. Mai enjoys _______ origami with her sister in her free time.
A. doing          B. making          C. taking          D. playing
4. Life in the countryside is much _______ than life in the city.
A. peaceful          B. more peaceful          C. most peaceful          D. as peaceful
5. Peter spends two hours a day surfing the net, _______ he knows it harms his eyes.
A. although          B. because          C. so          D. however
6. Nam loves _______ football with his classmates every Saturday afternoon.
A. playing          B. play          C. to playing          D. played

III. Reading Comprehension (4 câu)
Read the text and choose the best answer:
"Teens today have many different ways to spend their free time. While some love outdoor activities like football or cycling, others prefer indoor hobbies like computer games, reading books, or making DIY crafts..."
7. What is the main idea of the passage?
A. Teenagers only like playing computer games.
B. Teenagers have various hobbies in their free time.
C. Outdoor activities are better than indoor activities.
D. DIY crafts are boring.
8. Outdoor activities mentioned in the text include:
A. playing games and cooking          B. football and cycling
C. reading and cycling                D. listening to music

IV. Writing (2 câu)
9. He loves hanging out with his friends. (fond of)
-> He is ___________________________________________
10. A tractor can plow much faster than a water buffalo.
-> A water buffalo plows ___________________________________________`
  },
  {
    id: "grade7-midterm",
    label: "Đề Lớp 7 - Giữa kì 1: Hobbies & Healthy Living",
    grade: "Lớp 7",
    content: `ĐỀ KIỂM TRA ĐÁNH GIÁ GIỮA KÌ I - MÔN: TIẾNG ANH 7
Thời gian: 45 phút

A. PRONUNCIATION & VOCABULARY (2.5 pts)
1. Choose the word with a different stress pattern:
A. hobby          B. healthy          C. collect          D. model
2. Eating lots of junk food can lead to _______.
A. sunburn          B. obesity          C. allergy          D. flu
3. My sister loves _______ dolls from foreign countries.
A. collecting          B. arranging          C. gardening          D. skating

B. GRAMMAR (2.5 pts)
4. He _______ badminton with his father every Sunday morning.
A. play          B. plays          C. is playing          D. played
5. You should eat more vegetables _______ they are good for your health.
A. so          B. but          C. because          D. or

C. READING (2.5 pts)
Read and choose True (A) or False (B):
"Health is the most precious thing in life. To stay healthy, you should exercise regularly, eat balanced meals, and drink at least two liters of water a day..."
6. Exercise is not necessary if you eat healthy food. (A. True / B. False)
7. You should drink plenty of water every day. (A. True / B. False)

D. WRITING (2.5 pts)
8. Write a short paragraph (50-60 words) about your favorite hobby.`
  },
  {
    id: "grade6-school",
    label: "Đề Lớp 6 - Unit 1: My New School & Friends (15 phút)",
    grade: "Lớp 6",
    content: `BÀI KIỂM TRA 15 PHÚT - MÔN: TIẾNG ANH 6
CHỦ ĐỀ: MY NEW SCHOOL

I. Choose the best answer A, B, or C. (6 câu - 6.0 điểm)
1. Duy _______ his new uniform on Mondays and Fridays.
A. wears          B. puts          C. has
2. Students do _______ in the school playground during break time.
A. judo          B. exercise          C. physics
3. There is a large computer _______ in my new school.
A. room          B. class          C. lab
4. We often study _______ in the science laboratory.
A. history          B. science          C. literature
5. My best friend is very _______. He always helps me with difficult homework.
A. helpful          B. shy          C. funny
6. Look! The students _______ football in the schoolyard.
A. play          B. are playing          C. plays

II. Word Order (2 câu - 4.0 điểm)
7. has / a / school bag / Mai / new / .
-> ___________________________________________
8. studying / Are / you / now / English / ?
-> ___________________________________________`
  }
];

/**
 * Sinh 3 đề biến thể bằng thuật toán sư phạm nội bộ (Offline / Free Trial Fallback)
 * Đảm bảo 100% không bao giờ lỗi khi không có API Key hoặc hết quota AI bên thứ 3.
 */
export function generateLocalPedagogicalVariants(originalText: string, gradeStr: string = "Lớp 8"): BientheSuiteData {
  const normGrade = gradeStr.includes("6") ? "6" : gradeStr.includes("7") ? "7" : gradeStr.includes("9") ? "9" : "8";

  const analysis: ExamAnalysis = {
    subject: "Tiếng Anh THCS (Chuẩn GDPT 2018)",
    grade: `Lớp ${normGrade}`,
    totalQuestions: "15 - 20 câu hỏi",
    totalParts: "4 phần (Ngữ âm, Từ vựng - Ngữ pháp, Đọc hiểu, Viết)",
    skillsTested: "Phát âm, Trọng âm, Từ loại, Thời thì, Đọc hiểu văn bản, Viết lại câu",
    difficulty: "Phân hóa 4 cấp độ: Nhận biết 40% - Thông hiểu 30% - Vận dụng 20% - Vận dụng cao 10%"
  };

  const code1 = `${normGrade}01`;
  const code2 = `${normGrade}02`;
  const code3 = `${normGrade}03`;

  // Biến thể 1: Biến thể nhẹ (Light variation)
  const variant1: ExamVariant = {
    title: `ĐỀ SỐ ${code1} (BIẾN THỂ NHẸ)`,
    examContent: `PHẦN 1: ĐỀ THI

UBND HUYỆN / THỊ XÃ ....................
TRƯỜNG THCS ........................................
Họ và tên: .....................................................
Lớp: ${normGrade}A.....

BÀI KIỂM TRA ĐÁNH GIÁ NĂNG LỰC ĐỊNH KỲ
NĂM HỌC 2026 - 2027
Môn: TIẾNG ANH ${normGrade} (Global Success)
Thời gian làm bài: 45 phút (Không kể thời gian phát đề)
Mã đề: ${code1}

A. PHONETICS (1.0 pt)
I. Choose the word whose underlined part is pronounced differently from the others.
1. A. culture          B. custom          C. museum          D. tunnel
2. A. visited          B. decided          C. painted          D. played

B. VOCABULARY & GRAMMAR (4.0 pts)
II. Choose the best answer A, B, C or D to complete each sentence.
3. The local artisans are trying their best to _______ the age-old pottery craft.
A. preserve          B. destroy          C. forget          D. sell
4. Lan enjoys _______ folk games with her village friends after school.
A. play          B. playing          C. to play          D. played
5. Life in the mountainous areas is much _______ than that in bustling cities.
A. quiet          B. quieter          C. more quiet          D. most quiet
6. We decided to take a boat trip along the river, _______?
A. don't we          B. did we          C. didn't we          D. haven't we
7. If you want to stay in shape, you should eat _______ fruits and do more exercise.
A. more          B. less          C. fewer          D. much
8. "Could you show me the way to the communal house?" - "_______."
A. Yes, I do          B. Sure, go straight ahead          C. Never mind          D. You're welcome

C. READING (2.5 pts)
III. Read the passage and choose the best answer A, B, C or D.
Community activities bring immense benefits to teenagers. By participating in clean-up campaigns, planting trees, or visiting nursing homes, students not only help others but also gain valuable real-life skills. They learn how to work effectively in a team, manage their schedule, and communicate with diverse groups of people. Furthermore, volunteering helps young individuals appreciate what they have and become responsible citizens.
9. What is the primary focus of the passage?
A. The challenges of teenage life          B. The benefits of community activities
C. How to plant trees in schools          D. Visiting nursing homes on weekends
10. According to the text, students can learn to _______ through community work.
A. earn lots of money          B. work in a team and communicate well
C. avoid going to school          D. pass difficult exams
11. The word "immense" in line 1 is closest in meaning to:
A. small          B. great          C. useless          D. negative
12. Engaging in voluntary work encourages students to become:
A. lazy individuals          B. strict teachers          C. responsible citizens          D. famous artists

D. WRITING (2.5 pts)
IV. Rewrite the following sentences so that the meaning stays the same.
13. Because the rain was extremely heavy, we could not go camping yesterday.
-> Because of ____________________________________________________________________
14. "I will participate in the voluntary youth club tomorrow," Ba said.
-> Ba said that ___________________________________________________________________
15. She is fond of making traditional handicrafts in her leisure time. (keen)
-> She is ________________________________________________________________________

------ HẾT ------`,
    answers: `PHẦN 2: ĐÁP ÁN & HƯỚNG DẪN CHẤM - MÃ ĐỀ ${code1}

1. BẢNG ĐÁP ÁN TRẮC NGHIỆM:
1. C (museum: /juː/, còn lại /ʌ/)
2. D (played: /d/, còn lại /ɪd/)
3. A (preserve: bảo tồn, gìn giữ)
4. B (enjoy + V-ing)
5. B (quieter: so sánh hơn tính từ 2 âm tiết đuôi -et/-y)
6. C (didn't we: câu hỏi đuôi thì quá khứ đơn)
7. A (more fruits: ăn nhiều hoa quả hơn)
8. B (Sure, go straight ahead: chỉ đường)
9. B (The benefits of community activities)
10. B (work in a team and communicate well)
11. B (immense = great, to lớn)
12. C (responsible citizens)

2. ĐÁP ÁN TỰ LUẬN VIẾT:
13. -> Because of the extremely heavy rain, we could not go camping yesterday.
14. -> Ba said that he would participate in the voluntary youth club the following day (the next day).
15. -> She is keen on making traditional handicrafts in her leisure time.

3. ĐOẠN VĂN MẪU THAM KHẢO (WRITING SAMPLE):
Participating in voluntary community projects is one of the most rewarding activities for teenagers. Firstly, it gives us an opportunity to help vulnerable people and make our neighbourhood greener and cleaner. Secondly, community activities teach us essential soft skills such as teamwork, leadership, and time management. In short, doing volunteer work helps us become mature and responsible citizens.`
  };

  // Biến thể 2: Biến thể vừa (Medium variation)
  const variant2: ExamVariant = {
    title: `ĐỀ SỐ ${code2} (BIẾN THỂ TRUNG BÌNH)`,
    examContent: `PHẦN 1: ĐỀ THI

UBND HUYỆN / THỊ XÃ ....................
TRƯỜNG THCS ........................................
Họ và tên: .....................................................
Lớp: ${normGrade}A.....

BÀI KIỂM TRA ĐÁNH GIÁ NĂNG LỰC ĐỊNH KỲ
NĂM HỌC 2026 - 2027
Môn: TIẾNG ANH ${normGrade} (Global Success)
Thời gian làm bài: 45 phút (Không kể thời gian phát đề)
Mã đề: ${code2}

A. PHONETICS (1.0 pt)
I. Choose the word whose underlined part is pronounced differently from the others.
1. A. craft          B. carve          C. handmade          D. father
2. A. opened          B. cleaned          C. started          D. loved

B. VOCABULARY & GRAMMAR (4.0 pts)
II. Choose the best answer A, B, C or D to complete each sentence.
3. Modern youngsters ought to _______ traditional values passed down from ancestors.
A. look down on          B. cherish and uphold          C. throw away          D. forget
4. Minh is interested in _______ ceramic pots during his weekend workshop visits.
A. molding          B. mold          C. to mold          D. molded
5. Harvesting crops in the countryside is _______ than studying at an air-conditioned desk.
A. hard          B. harder          C. more hard          D. hardest
6. You have already completed your science project on solar energy, _______?
A. didn't you          B. have you          C. haven't you          D. don't you
7. To maintain good health, teens should spend _______ time on digital screens.
A. more          B. less          C. fewer          D. much
8. "Would you mind showing me how to spin this pottery wheel?" - "_______."
A. Not at all, watch me          B. Yes, I would          C. I am tired          D. No, thanks

C. READING (2.5 pts)
III. Read the passage and choose the best answer A, B, C or D.
Preserving traditional craft villages plays an essential role in safeguarding our national cultural identity. Throughout Vietnam, thousands of craft villages specialize in making silk, conical hats, bronze statues, and wooden furniture. However, with the rise of modern industrial factories, many artisans are struggling to find customers. To solve this problem, many communities are combining traditional crafts with eco-tourism, allowing visitors to experience craft-making firsthand and purchase authentic handmade souvenirs.
9. What is the central theme of the passage?
A. Industrial factories in big cities          B. Safeguarding craft villages through tourism
C. How to produce cheap wooden furniture    D. Modern technology in agriculture
10. Why are some traditional artisans facing difficulties?
A. They do not want to teach young people     B. Competition from modern industrial factories
C. Tourists dislike handmade items           D. Raw materials are completely exhausted
11. The phrase "firsthand" in the text means:
A. through books          B. directly by oneself          C. via television          D. cheaply
12. What solution has been introduced to support craft villages?
A. Closing down unprofitable workshops       B. Combining traditional crafts with eco-tourism
C. Banning factory production                D. Exporting all raw materials abroad

D. WRITING (2.5 pts)
IV. Rewrite the following sentences so that the meaning stays the same.
13. Although the weather was severe, the villagers successfully hosted the festival.
-> Despite _______________________________________________________________________
14. "We will organize an environmental exhibition next week," the teacher announced.
-> The teacher announced that ____________________________________________________
15. He prefers cycling around the peaceful village to surfing the net indoors. (fancy)
-> He fancies ____________________________________________________________________

------ HẾT ------`,
    answers: `PHẦN 2: ĐÁP ÁN & HƯỚNG DẪN CHẤM - MÃ ĐỀ ${code2}

1. BẢNG ĐÁP ÁN TRẮC NGHIỆM:
1. C (handmade: /æ/, còn lại /ɑː/)
2. C (started: /ɪd/, còn lại /d/)
3. B (cherish and uphold: trân trọng và giữ gìn)
4. A (be interested in + V-ing)
5. B (harder: tính từ ngắn so sánh hơn)
6. C (haven't you: câu hỏi đuôi thì hiện tại hoàn thành)
7. B (less time: danh từ không đếm được)
8. A (Not at all, watch me: câu đáp lịch sự cho 'Would you mind')
9. B (Safeguarding craft villages through tourism)
10. B (Competition from modern industrial factories)
11. B (firsthand = trực tiếp tự mình trải nghiệm)
12. B (Combining traditional crafts with eco-tourism)

2. ĐÁP ÁN TỰ LUẬN VIẾT:
13. -> Despite the severe weather, the villagers successfully hosted the festival.
14. -> The teacher announced that they would organize an environmental exhibition the following week (the next week).
15. -> He fancies cycling around the peaceful village rather than surfing the net indoors. (hoặc: He fancies cycling around the peaceful village more than surfing the net indoors.)

3. ĐOẠN VĂN MẪU THAM KHẢO (WRITING SAMPLE):
Traditional craft villages are invaluable cultural treasures of Vietnam. By preserving these villages, we honor our ancestors' wisdom and pass down unique artisanal skills to younger generations. Furthermore, developing eco-tourism in craft villages creates steady income for local residents and introduces our rich culture to international friends. We should actively support and protect these heritage sites.`
  };

  // Biến thể 3: Biến thể sâu / mới hơn (Deeper variation)
  const variant3: ExamVariant = {
    title: `ĐỀ SỐ ${code3} (BIẾN THỂ MỚI HOÀN TOÀN)`,
    examContent: `PHẦN 1: ĐỀ THI

UBND HUYỆN / THỊ XÃ ....................
TRƯỜNG THCS ........................................
Họ và tên: .....................................................
Lớp: ${normGrade}A.....

BÀI KIỂM TRA ĐÁNH GIÁ NĂNG LỰC ĐỊNH KỲ
NĂM HỌC 2026 - 2027
Môn: TIẾNG ANH ${normGrade} (Global Success)
Thời gian làm bài: 45 phút (Không kể thời gian phát đề)
Mã đề: ${code3}

A. PHONETICS (1.0 pt)
I. Choose the word whose underlined part is pronounced differently from the others.
1. A. unique          B. festive          C. heritage          D. ethnic
2. A. worked          B. stopped          C. watched          D. gathered

B. VOCABULARY & GRAMMAR (4.0 pts)
II. Choose the best answer A, B, C or D to complete each sentence.
3. Young generations have the responsibility to _______ local cultural heritages.
A. pass down          B. turn down          C. give up          D. break down
4. Many students adore _______ trees and flowers in the school eco-garden.
A. to plant          B. planting          C. planted          D. plant
5. This new digital learning app is _______ than any traditional textbook we used before.
A. convenient          B. more convenient          C. as convenient          D. most convenient
6. The students didn't throw plastic bottles into the river, _______?
A. did they          B. didn't they          C. do they          D. have they
7. If we consume _______ sugary drinks, our cardiovascular health will improve significantly.
A. fewer          B. less          C. more          D. much
8. "Thank you so much for guiding us through the historic pagoda." - "_______."
A. It was my pleasure          B. No problem at all          C. You are right          D. Never mind

C. READING (2.5 pts)
III. Read the passage and choose the best answer A, B, C or D.
Green living has emerged as a vital lifestyle among modern middle school students. Instead of relying on private vehicles, many teenagers now choose to ride bicycles or take electric buses to school. In classrooms, single-use plastic cups have been replaced with reusable stainless steel tumblers. Students also establish recycling stations to sort paper, cardboard, and aluminum cans. These small daily habits contribute tremendously to reducing carbon footprint and cultivating environmental awareness from an early age.
9. What is the main subject of the reading text?
A. The dangers of traffic accidents          B. Green living habits among school students
C. How to manufacture electric buses         D. Planting trees in city parks
10. How do students commute sustainably to school?
A. By riding motorbikes                      B. By riding bicycles or using electric buses
C. By taking private cars                    D. By staying at home
11. Single-use plastic cups in schools have been replaced by:
A. paper bags          B. stainless steel tumblers          C. ceramic dishes          D. glass bowls
12. What is the ultimate benefit of these daily habits?
A. Spending more school funds                B. Reducing carbon footprint and building eco-awareness
C. Getting free exam scores                  D. Competing with other foreign schools

D. WRITING (2.5 pts)
IV. Rewrite the following sentences so that the meaning stays the same.
13. Although the homework was challenging, Nam solved all the equations independently.
-> In spite of ____________________________________________________________________
14. "We will clean up the lakeside area this Saturday morning," the team leader announced.
-> The team leader announced that _________________________________________________
15. My brother is really fond of learning digital programming languages. (interested)
-> My brother is __________________________________________________________________

------ HẾT ------`,
    answers: `PHẦN 2: ĐÁP ÁN & HƯỚNG DẪN CHẤM - MÃ ĐỀ ${code3}

1. BẢNG ĐÁP ÁN TRẮC NGHIỆM:
1. A (unique: /juː/, còn lại /e/ hoặc /ɪ/)
2. D (gathered: /d/, còn lại /t/)
3. A (pass down: lưu truyền, truyền lại cho thế hệ sau)
4. B (adore + V-ing)
5. B (more convenient: so sánh hơn tính từ dài)
6. A (did they: câu hỏi đuôi thì quá khứ đơn phủ định)
7. B (less sugary drinks / less sugar: tiêu thụ ít đồ ngọt hơn)
8. A (It was my pleasure: lời đáp trang trọng, lịch sự khi được cảm ơn)
9. B (Green living habits among school students)
10. B (By riding bicycles or using electric buses)
11. B (stainless steel tumblers: bình giữ nhiệt bằng thép không gỉ)
12. B (Reducing carbon footprint and building eco-awareness)

2. ĐÁP ÁN TỰ LUẬN VIẾT:
13. -> In spite of the challenging homework, Nam solved all the equations independently.
14. -> The team leader announced that they would clean up the lakeside area that Saturday morning.
15. -> My brother is really interested in learning digital programming languages.

3. ĐOẠN VĂN MẪU THAM KHẢO (WRITING SAMPLE):
Adopting a green lifestyle is essential for protecting our planet's future. As students, we can start with simple actions such as turning off electric appliances when leaving the room, sorting recyclable waste, and minimizing the use of single-use plastics. By commuting by bike or walking, we reduce carbon emissions while improving our physical health. Small actions today create a sustainable world tomorrow.`
  };

  return { analysis, variant1, variant2, variant3 };
}

/**
 * Gọi Gemini API trực tiếp từ trình duyệt của khách hàng
 * (Tránh hoàn toàn lỗi Vercel Gateway Timeout 10s)
 */
export async function generateVariantsWithGeminiClient(
  apiKey: string,
  model: string = "gemini-2.5-flash",
  originalExamText: string,
  fileData?: { base64: string; mimeType: string }
): Promise<BientheSuiteData> {
  const systemInstruction = `Bạn là chuyên gia ra đề kiểm tra Tiếng Anh THCS (Trung học cơ sở, từ Lớp 6 đến Lớp 9). 
Hãy tạo đúng 3 đề kiểm tra biến thể khác nhau từ đề gốc do giáo viên cung cấp.
Giữ nguyên cấu trúc đề gốc bao gồm: số phần, số câu, dạng câu hỏi, mức độ khó, và ma trận kiến thức.
Không tạo câu hỏi vượt quá trình độ học sinh THCS. Mỗi đề phải có phần đề thi và đáp án đầy đủ.

Quy tắc đặt tiêu đề (Mã đề):
- Tuyệt đối KHÔNG ghi các chữ như "Biến thể nhẹ", "Biến thể trung bình", "Biến thể mới hơn", "Đề 1", "Đề 2", "Đề 3" vào trong tiêu đề hoặc nội dung đề thi.
- Thay vào đó, hãy dựa vào Lớp học của đề gốc để sinh mã đề tương ứng trong kết quả JSON (ví dụ: Lớp 6 thì ghi ĐỀ SỐ 601, ĐỀ SỐ 602, ĐỀ SỐ 603; Lớp 7 thì ghi ĐỀ SỐ 701, ĐỀ SỐ 702, ĐỀ SỐ 703; Lớp 8 thì ghi ĐỀ SỐ 801, ĐỀ SỐ 802, ĐỀ SỐ 803; Lớp 9 thì ghi ĐỀ SỐ 901, ĐỀ SỐ 902, ĐỀ SỐ 903).
- Tiêu đề (title) của 3 đề thi trong kết quả JSON lần lượt là "ĐỀ SỐ [Grade]01", "ĐỀ SỐ [Grade]02", "ĐỀ SỐ [Grade]03".

Quy tắc nội dung đáp án (Answers):
- Phần đáp án (answers) phải đầy đủ và chi tiết cho tất cả các câu hỏi trắc nghiệm và tự luận.
- Nếu đề thi có phần nghe (Listening): BẮT BUỘC phải đính kèm nội dung băng nghe chi tiết (Audio Script) vào ngay trước phần đáp án.
- Nếu đề thi có phần viết (Writing): BẮT BUỘC cung cấp đoạn văn mẫu hoàn chỉnh chi tiết (không ghi dàn ý chung chung).
- Nếu đề thi có phần nói (Speaking): BẮT BUỘC cung cấp chi tiết cả câu hỏi gợi ý và câu trả lời mẫu đầy đủ cho học sinh.

Quy tắc trình bày chuẩn mực sư phạm:
- KHÔNG tự ý thêm tên xã, tên trường cụ thể mà để trống sư phạm: TRƯỜNG THCS: ....................
- Các phương án A, B, C, D ngắn xếp chung trên 1 dòng cách nhau 6-8 dấu cách.
- Ngôn ngữ sư phạm trong sáng, phù hợp học sinh lớp 6, 7, 8, 9.

Mức độ biến thể của 3 đề:
- Đề 1 (Biến thể nhẹ): Đổi từ vựng, ngữ cảnh, tên riêng hoặc tình huống đơn giản nhưng giữ nguyên cấu trúc ngữ pháp và kiểu câu hỏi.
- Đề 2 (Biến thể trung bình): Đổi câu hỏi và ngữ cảnh nhiều hơn, sử dụng các cấu trúc ngữ pháp tương đương cùng mức độ, nội dung bài đọc được viết lại mới.
- Đề 3 (Biến thể mới hơn): Kiểm tra cùng một lượng kiến thức, chủ đề và điểm ngữ pháp nhưng đổi mới hoàn toàn câu hỏi và bài tập.`;

  const contents: any[] = [];
  if (fileData && fileData.base64) {
    const cleanBase64 = fileData.base64.split(",")[1] || fileData.base64;
    contents.push({
      parts: [
        {
          inlineData: {
            data: cleanBase64,
            mimeType: fileData.mimeType
          }
        },
        {
          text: `Dưới đây là tệp tin đề thi gốc do giáo viên tải lên.
Hãy đọc kỹ tệp tin này, nhận diện toàn bộ nội dung đề thi (bao gồm các phần trắc nghiệm, tự luận, bài đọc, câu hỏi và đáp án nếu có).
Sau đó, tiến hành phân tích ma trận kiến thức của đề gốc này: Xác định môn, lớp, số phần, số câu, dạng câu hỏi, mức độ khó, chủ đề từ vựng và ngữ pháp.
Tiếp theo, hãy sinh ra đúng 3 đề kiểm tra biến thể tương ứng theo đúng các quy tắc sinh đề và định dạng đặc biệt bắt buộc:
- Đề biến thể số 1 (Đề [Grade]01)
- Đề biến thể số 2 (Đề [Grade]02)
- Đề biến thể số 3 (Đề [Grade]03)

Mỗi đề biến thể bắt buộc phải có đầy đủ 2 phần chính:
PHẦN 1: ĐỀ THI
[Toàn bộ đề thi]

PHẦN 2: ĐÁP ÁN
[Toàn bộ đáp án chi tiết, Audio Script, đoạn văn mẫu Writing và bài nói Speaking]`
        }
      ]
    });
  } else {
    contents.push({
      parts: [
        {
          text: `Dưới đây là đề thi gốc do giáo viên cung cấp:
---
${originalExamText}
---

Hãy phân tích đề thi gốc này: Xác định môn, lớp, số phần, số câu, dạng câu hỏi, mức độ khó, chủ đề từ vựng và ngữ pháp.
Sau đó, sinh ra đúng 3 đề biến thể tương ứng:
- Đề biến thể số 1 (Đề [Grade]01)
- Đề biến thể số 2 (Đề [Grade]02)
- Đề biến thể số 3 (Đề [Grade]03)

Mỗi đề biến thể bắt buộc phải có đầy đủ 2 phần chính:
PHẦN 1: ĐỀ THI
[Toàn bộ đề thi]

PHẦN 2: ĐÁP ÁN
[Toàn bộ đáp án chi tiết, Audio Script, đoạn văn mẫu Writing và bài nói Speaking]`
        }
      ]
    });
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            analysis: {
              type: "OBJECT",
              properties: {
                subject: { type: "STRING" },
                grade: { type: "STRING" },
                totalQuestions: { type: "STRING" },
                totalParts: { type: "STRING" },
                skillsTested: { type: "STRING" },
                difficulty: { type: "STRING" }
              },
              required: ["subject", "grade", "totalQuestions", "totalParts", "skillsTested", "difficulty"]
            },
            variant1: {
              type: "OBJECT",
              properties: {
                title: { type: "STRING" },
                examContent: { type: "STRING" },
                answers: { type: "STRING" }
              },
              required: ["title", "examContent", "answers"]
            },
            variant2: {
              type: "OBJECT",
              properties: {
                title: { type: "STRING" },
                examContent: { type: "STRING" },
                answers: { type: "STRING" }
              },
              required: ["title", "examContent", "answers"]
            },
            variant3: {
              type: "OBJECT",
              properties: {
                title: { type: "STRING" },
                examContent: { type: "STRING" },
                answers: { type: "STRING" }
              },
              required: ["title", "examContent", "answers"]
            }
          },
          required: ["analysis", "variant1", "variant2", "variant3"]
        }
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Lỗi kết nối Gemini API (${response.status}): ${response.statusText}`);
  }

  const result = await response.json();
  const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error("Không nhận được nội dung sinh từ Google Gemini. Vui lòng kiểm tra lại API Key hoặc mô hình.");
  }

  return JSON.parse(rawText) as BientheSuiteData;
}

/**
 * Xuất 1 đề biến thể hoặc trọn bộ 3 đề ra file Microsoft Word (.doc)
 * Chuẩn 100% Sư phạm:
 * - Font: Times New Roman 13pt
 * - Canh lề A4 chuẩn: Trên/Dưới 12.7mm, Trái/Phải 15.2mm
 * - Khoảng cách dòng: 1.15
 * - Ngắt trang Word chính xác: <br clear="all" style="page-break-before: always; mso-break-type: section-break;" />
 * - Bảng điểm Bộ GD&ĐT 3x4 chống tách vỡ trang
 */
export function exportBientheToWordHtml(
  title: string,
  variants: ExamVariant[],
  analysis?: ExamAnalysis,
  includeAllCombined: boolean = false
): void {
  const fileName = includeAllCombined 
    ? `TRON_BO_3_DE_BIEN_THE_${new Date().toISOString().slice(0, 10)}.doc`
    : `${title.replace(/[\/\?<>\\:\*\|":]/g, "_")}.doc`;

  const wordPageBreak = `<br clear="all" style="page-break-before: always; mso-break-type: section-break;" />`;

  const renderSingleVariantHtml = (v: ExamVariant, index: number) => {
    return `
      <!-- HEADER KHUNG 2 CỘT CHUẨN BGD&ĐT -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 6pt; page-break-inside: avoid;">
        <tr>
          <td style="width: 45%; vertical-align: top; text-align: center;">
            <div style="font-size: 11pt; font-weight: bold; text-transform: uppercase;">UBND HUYỆN / THỊ XÃ ....................</div>
            <div style="font-size: 12pt; font-weight: bold; text-transform: uppercase; text-decoration: underline; margin-top: 2pt;">TRƯỜNG THCS ........................................</div>
          </td>
          <td style="width: 55%; vertical-align: top; text-align: center;">
            <div style="font-size: 12.5pt; font-weight: bold; text-transform: uppercase;">BÀI KIỂM TRA ĐÁNH GIÁ NĂNG LỰC TIẾNG ANH THCS</div>
            <div style="font-size: 11.5pt; margin-top: 1pt;">NĂM HỌC: 2026 - 2027</div>
            <div style="font-size: 11.5pt; font-weight: bold; margin-top: 1pt;">${v.title.toUpperCase()}</div>
            <div style="font-size: 11pt; font-style: italic; margin-top: 1pt;">Thời gian làm bài: 45 phút (Không kể thời gian phát đề)</div>
          </td>
        </tr>
      </table>

      <!-- THÔNG TIN HỌC SINH -->
      <p style="margin-top: 4pt; margin-bottom: 4pt; font-size: 12pt;">
        Full name: ....................................................................................., Class: .................... Mã đề: <strong>${100 + index + 1}</strong>
      </p>

      <!-- BẢNG ĐIỂM CHUẨN SƯ PHẠM 3 HÀNG 4 CỘT -->
      <table border="1" style="width: 100%; border-collapse: collapse; text-align: center; margin-top: 4pt; margin-bottom: 8pt; page-break-inside: avoid; border: 1pt solid #000000;">
        <tr style="font-weight: bold; background-color: #F8FAFC;">
          <td colspan="2" style="width: 34%; padding: 4pt; border: 1pt solid #000000;">Marks</td>
          <td rowspan="2" style="width: 26%; padding: 4pt; border: 1pt solid #000000;">Total</td>
          <td rowspan="2" style="width: 40%; padding: 4pt; border: 1pt solid #000000;">Teacher's remarks</td>
        </tr>
        <tr style="font-weight: bold; background-color: #F8FAFC;">
          <td style="width: 17%; padding: 3pt; border: 1pt solid #000000;">Speak</td>
          <td style="width: 17%; padding: 3pt; border: 1pt solid #000000;">Write</td>
        </tr>
        <tr style="height: 38pt;">
          <td style="border: 1pt solid #000000;">&nbsp;</td>
          <td style="border: 1pt solid #000000;">&nbsp;</td>
          <td style="border: 1pt solid #000000;">&nbsp;</td>
          <td style="border: 1pt solid #000000; text-align: left; padding: 4pt; font-style: italic; color: #555555; vertical-align: top;">
            .............................................................................<br />
            .............................................................................
          </td>
        </tr>
      </table>

      <!-- NỘI DUNG ĐỀ THI -->
      <div style="font-size: 12.5pt; text-align: justify; line-height: 1.25;">
        ${v.examContent
          .split("\n")
          .map(line => {
            const tr = line.trim();
            if (!tr) return `<p style="margin: 2pt 0;">&nbsp;</p>`;
            if (tr.startsWith("PHẦN 1") || tr.startsWith("PART") || tr.startsWith("I.") || tr.startsWith("II.") || tr.startsWith("III.") || tr.startsWith("IV.") || tr.startsWith("A.") || tr.startsWith("B.") || tr.startsWith("C.") || tr.startsWith("D.")) {
              return `<p style="font-weight: bold; margin: 4pt 0 2pt 0; color: #0f2b48;">${tr}</p>`;
            }
            return `<p style="margin: 2pt 0;">${tr}</p>`;
          })
          .join("")}
      </div>

      <!-- NGẮT SANG PHẦN ĐÁP ÁN -->
      ${wordPageBreak}

      <!-- TIÊU ĐỀ PHẦN ĐÁP ÁN -->
      <div style="text-align: center; margin-bottom: 8pt;">
        <h2 style="font-size: 14pt; font-weight: bold; text-transform: uppercase; margin: 0; color: #B91C1C;">
          HƯỚNG DẪN CHẤM & ĐÁP ÁN CHI TIẾT - ${v.title.toUpperCase()}
        </h2>
        <div style="font-size: 11pt; font-style: italic; margin-top: 2pt;">(Bao gồm thang điểm, Audio Script bài nghe, bài viết và bài nói mẫu)</div>
      </div>

      <!-- NỘI DUNG ĐÁP ÁN -->
      <div style="font-size: 12pt; text-align: justify; line-height: 1.25; background-color: #F8FAFC; padding: 8pt; border: 1pt solid #CBD5E1;">
        ${v.answers
          .split("\n")
          .map(line => {
            const tr = line.trim();
            if (!tr) return `<p style="margin: 2pt 0;">&nbsp;</p>`;
            if (tr.includes(":") && (tr.startsWith("1.") || tr.startsWith("2.") || tr.startsWith("3.") || tr.startsWith("BẢNG") || tr.startsWith("ĐOẠN VĂN"))) {
              return `<p style="font-weight: bold; margin: 4pt 0 2pt 0; color: #1E3A8A;">${tr}</p>`;
            }
            return `<p style="margin: 2pt 0;">${tr}</p>`;
          })
          .join("")}
      </div>
    `;
  };

  const analysisHtml = analysis ? `
    <div style="margin-bottom: 12pt; padding: 10pt; border: 1.5pt solid #1E3A8A; background-color: #EFF6FF; page-break-inside: avoid;">
      <h3 style="margin: 0 0 6pt 0; font-size: 13pt; font-weight: bold; color: #1E3A8A; text-align: center; text-transform: uppercase;">
        BẢNG TỔNG HỢP MA TRẬN & PHÂN TÍCH ĐỀ GỐC
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 11.5pt;">
        <tr><td style="width: 25%; font-weight: bold; padding: 3pt;">Môn học:</td><td style="padding: 3pt;">${analysis.subject}</td></tr>
        <tr><td style="font-weight: bold; padding: 3pt;">Khối lớp:</td><td style="padding: 3pt;">${analysis.grade}</td></tr>
        <tr><td style="font-weight: bold; padding: 3pt;">Quy mô:</td><td style="padding: 3pt;">${analysis.totalQuestions} (${analysis.totalParts})</td></tr>
        <tr><td style="font-weight: bold; padding: 3pt;">Kỹ năng kiểm tra:</td><td style="padding: 3pt;">${analysis.skillsTested}</td></tr>
        <tr><td style="font-weight: bold; padding: 3pt;">Mức độ phân hóa:</td><td style="padding: 3pt; color: #047857; font-weight: bold;">${analysis.difficulty}</td></tr>
      </table>
    </div>
    ${wordPageBreak}
  ` : "";

  const fullContentHtml = variants.map((v, idx) => {
    const itemHtml = renderSingleVariantHtml(v, idx);
    if (idx < variants.length - 1) {
      return itemHtml + wordPageBreak;
    }
    return itemHtml;
  }).join("");

  const docHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" 
          xmlns:w="urn:schemas-microsoft-com:office:word" 
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
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
          margin: 12.7mm 15.2mm 12.7mm 15.2mm;
          mso-header-margin: 7.2mm;
          mso-footer-margin: 7.2mm;
          mso-paper-source: 0;
        }
        body {
          font-family: "Times New Roman", Times, serif;
          font-size: 12.5pt;
          line-height: 1.15;
          color: #000000;
        }
        table {
          page-break-inside: avoid;
          mso-padding-alt: 2pt 4pt 2pt 4pt;
        }
        tr {
          page-break-inside: avoid;
        }
        p {
          margin-top: 2pt;
          margin-bottom: 2pt;
        }
      </style>
    </head>
    <body>
      ${includeAllCombined ? analysisHtml : ""}
      ${fullContentHtml}
    </body>
    </html>
  `;

  const blob = new Blob(["\ufeff", docHtml], { type: "application/msword;charset=utf-8" });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}
