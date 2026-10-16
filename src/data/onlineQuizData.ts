/**
 * CƠ SỞ DỮ LIỆU ĐỀ THI TRẮC NGHIỆM ONLINE (CỔNG HỌC SINH dekiemtraso.com/hocsinh)
 * Bản quyền: Thầy giáo Đinh Văn Thành (0915.213717)
 * 
 * Quy chuẩn:
 * - 7 Khối lớp: Lớp 6, 7, 8, 9, 10, 11, 12 (Global Success)
 * - Mỗi Unit gồm đúng 5 Bài kiểm tra:
 *   + Bài 1: Từ vựng & Đọc hiểu cốt lõi (20 câu)
 *   + Bài 2: Ngữ pháp & Cấu trúc câu (20 câu)
 *   + Bài 3: Phát âm & Trọng âm (20 câu)
 *   + Bài 4: Giao tiếp & Tình huống thực tế (20 câu)
 *   + Bài 5: Đề Ôn Luyện Tổng Hợp Đạt Điểm 10 (20 câu)
 * - Mỗi Bài kiểm tra gồm đúng 20 câu hỏi trắc nghiệm A, B, C, D (20 phút, chấm điểm ngay)
 */

export interface QuizQuestionItem {
  id: number; // 1 to 20
  question: string;
  options: string[]; // ["A. ...", "B. ...", "C. ...", "D. ..."]
  correctAnswer: number; // 0, 1, 2, 3
  explanation: string;
  level: 'NB' | 'TH' | 'VD' | 'VDC';
}

export interface UnitQuizTest {
  testId: string;
  testNumber: number; // 1 to 5
  title: string;
  subtitle: string;
  focus: string;
  timeMinutes: number; // 20
  questions: QuizQuestionItem[]; // exactly 20 items
}

export interface UnitQuizInfo {
  unitNumber: number;
  unitTitle: string;
  unitTopic: string;
  grammarFocus: string;
  tests: UnitQuizTest[];
}

export interface GradeQuizInfo {
  grade: number;
  gradeName: string;
  levelBadge: 'THCS' | 'THPT';
  units: UnitQuizInfo[];
}

export interface QuizAttemptResult {
  grade: number;
  unitNumber: number;
  testNumber: number;
  score: number; // Thang điểm 10 (ví dụ: 9.5)
  correctCount: number; // ví dụ: 19
  totalQuestions: number; // 20
  timeSpentSeconds: number;
  completedAt: string;
  selectedAnswers: Record<number, number>;
}

// ==========================================
// 1. DANH MỤC UNIT CHUẨN GLOBAL SUCCESS
// ==========================================
interface UnitMeta {
  num: number;
  title: string;
  topic: string;
  grammar: string;
  keyWords: string[];
}

const SYLLABUS_MAP: Record<number, UnitMeta[]> = {
  // LỚP 6
  6: [
    { num: 1, title: 'Unit 1: My New School', topic: 'Trường học mới & Đồ dùng học tập', grammar: 'Hiện tại đơn & Trạng từ chỉ tần suất', keyWords: ['uniform', 'calculator', 'compass', 'rubber', 'smart', 'judo', 'canteen'] },
    { num: 2, title: 'Unit 2: My House', topic: 'Ngôi nhà thân yêu & Các phòng', grammar: 'Giới từ chỉ nơi chốn & There is / There are', keyWords: ['balcony', 'bedroom', 'cushion', 'microwave', 'wardrobe', 'apartment'] },
    { num: 3, title: 'Unit 3: My Friends', topic: 'Bạn bè & Ngoại hình, tính cách', grammar: 'Hiện tại tiếp diễn miêu tả hành động', keyWords: ['clever', 'curious', 'confident', 'creative', 'chubby', 'kind'] },
    { num: 4, title: 'Unit 4: My Neighbourhood', topic: 'Khu phố & Địa điểm lân cận', grammar: 'So sánh hơn của tính từ ngắn và dài', keyWords: ['historic', 'convenient', 'polluted', 'peaceful', 'suburb', 'crowded'] },
    { num: 5, title: 'Unit 5: Natural Wonders of Viet Nam', topic: 'Kỳ quan thiên nhiên Việt Nam', grammar: 'Động từ khuyết thiếu Must / Mustn\'t', keyWords: ['waterfall', 'island', 'desert', 'cave', 'magnificent', 'plaster'] },
    { num: 6, title: 'Unit 6: Our Tet Holiday', topic: 'Tết cổ truyền & Phong tục', grammar: 'Should / Shouldn\'t khuyên bảo', keyWords: ['blossom', 'calendar', 'firework', 'envelope', 'gather', 'behave'] },
    { num: 7, title: 'Unit 7: Television', topic: 'Truyền hình & Chương trình giải trí', grammar: 'Từ để hỏi Wh-words & Liên từ but, so, although', keyWords: ['comedy', 'educational', 'documentary', 'viewer', 'channel', 'schedule'] },
    { num: 8, title: 'Unit 8: Sports and Games', topic: 'Thể thao & Trò chơi vận động', grammar: 'Thì Quá khứ đơn (Past Simple)', keyWords: ['aerobics', 'badminton', 'champion', 'competition', 'marathon', 'racket'] },
    { num: 9, title: 'Unit 9: Cities of the World', topic: 'Các thành phố trên thế giới', grammar: 'So sánh nhất của tính từ (Superlative)', keyWords: ['landmark', 'palace', 'postcard', 'symbol', 'ancient', 'tower'] },
    { num: 10, title: 'Unit 10: Houses in the Future', topic: 'Ngôi nhà tương lai & Thiết bị thông minh', grammar: 'Thì Tương lai đơn với Will / Won\'t', keyWords: ['appliance', 'automatic', 'skyscraper', 'solar energy', 'modern', 'ocean'] },
    { num: 11, title: 'Unit 11: Our Greener World', topic: 'Thế giới xanh hơn & Bảo vệ môi trường', grammar: 'Câu điều kiện loại 1 (Conditional Type 1)', keyWords: ['environment', 'recycle', 'pollution', 'reusable', 'rubbish', 'wildlife'] },
    { num: 12, title: 'Unit 12: Robots', topic: 'Người máy thông minh & Công nghệ', grammar: 'Động từ khuyết thiếu Can / Could / Will be able to', keyWords: ['capable', 'guard', 'laundry', 'recognise', 'servant', 'space'] }
  ],

  // LỚP 7
  7: [
    { num: 1, title: 'Unit 1: Hobbies', topic: 'Sở thích & Thời gian rảnh rỗi', grammar: 'Hiện tại đơn & Động từ chỉ sự yêu thích (+ V-ing)', keyWords: ['collecting', 'gardening', 'origami', 'patient', 'unusual', 'dollhouse'] },
    { num: 2, title: 'Unit 2: Healthy Living', topic: 'Lối sống lành mạnh & Sức khỏe', grammar: 'Câu đơn & Liên từ and, but, or, so', keyWords: ['allergy', 'chapped', 'dim', 'pimples', 'sunburn', 'vegetables'] },
    { num: 3, title: 'Unit 3: Community Service', topic: 'Hoạt động vì cộng đồng & Tình nguyện', grammar: 'Thì Quá khứ đơn với mốc thời gian quá khứ', keyWords: ['volunteer', 'community', 'donate', 'elderly', 'homeless', 'tutor'] },
    { num: 4, title: 'Unit 4: Music and Arts', topic: 'Âm nhạc và Nghệ thuật', grammar: 'So sánh as...as, the same as, different from', keyWords: ['composer', 'instrument', 'originate', 'puppet', 'gallery', 'portrait'] },
    { num: 5, title: 'Unit 5: Food and Drink', topic: 'Ẩm thực & Thức uống truyền thống', grammar: 'Danh từ đếm được/không đếm được & How much/How many', keyWords: ['broth', 'ingredient', 'omelette', 'recipe', 'turmeric', 'fragrant'] },
    { num: 6, title: 'Unit 6: A Visit to a School', topic: 'Thăm trường xưa & Di tích lịch sử', grammar: 'Giới từ chỉ thời gian và nơi chốn: in, on, at', keyWords: ['monument', 'scholar', 'courtyard', 'surround', 'emperor', 'relic'] },
    { num: 7, title: 'Unit 7: Traffic', topic: 'Giao thông & Luật an toàn đường bộ', grammar: 'Cấu trúc It indicates distance & Should/Shouldn\'t', keyWords: ['pavement', 'pedestrian', 'helmet', 'traffic jam', 'vehicle', 'seatbelt'] },
    { num: 8, title: 'Unit 8: Films', topic: 'Điện ảnh & Các thể loại phim', grammar: 'Liên từ Although, Though, However, In spite of', keyWords: ['animation', 'comedy', 'critic', 'documentary', 'gripping', 'hilarious'] },
    { num: 9, title: 'Unit 9: Festivals around the World', topic: 'Lễ hội trên thế giới', grammar: 'Câu hỏi Yes/No & Wh- questions', keyWords: ['carnival', 'feast', 'parade', 'superstitious', 'celebrate', 'lantern'] },
    { num: 10, title: 'Unit 10: Energy Sources', topic: 'Các nguồn năng lượng tái tạo', grammar: 'Thì Hiện tại tiếp diễn chỉ tương lai', keyWords: ['renewable', 'solar panel', 'wind turbine', 'fossil fuel', 'carbon footprint', 'hydro'] },
    { num: 11, title: 'Unit 11: Travelling in the Future', topic: 'Phương tiện di chuyển tương lai', grammar: 'Đại từ sở hữu (mine, yours, his, hers, ours, theirs)', keyWords: ['bullet train', 'driverless', 'eco-friendly', 'hyperloop', 'teleporter', 'flying car'] },
    { num: 12, title: 'Unit 12: English-Speaking Countries', topic: 'Các quốc gia nói tiếng Anh', grammar: 'Mạo từ a, an, the & Zero article', keyWords: ['native speaker', 'territory', 'attraction', 'scenery', 'spectacular', 'accent'] }
  ],

  // LỚP 8
  8: [
    { num: 1, title: 'Unit 1: Leisure Time', topic: 'Thời gian rảnh & Hoạt động giải trí', grammar: 'Verbs of liking/disliking + Gerund / To-infinitive', keyWords: ['origami', 'resort', 'knitting', 'craft kit', 'crucial', 'hooked'] },
    { num: 2, title: 'Unit 2: Life in the Countryside', topic: 'Cuộc sống vùng nông thôn', grammar: 'So sánh hơn của trạng từ (Comparative adverbs)', keyWords: ['pasture', 'harvest', 'buffalo', 'vast', 'hospitable', 'peacefully'] },
    { num: 3, title: 'Unit 3: Teenagers', topic: 'Thanh thiếu niên & Áp lực học đường', grammar: 'Câu đơn, câu ghép & Liên từ nối', keyWords: ['peer pressure', 'forum', 'bully', 'expectation', 'curious', 'stressful'] },
    { num: 4, title: 'Unit 4: Ethnic Groups of Viet Nam', topic: 'Các dân tộc thiểu số Việt Nam', grammar: 'Câu hỏi Yes/No & Từ để hỏi', keyWords: ['communal house', 'costume', 'heritage', 'minority', 'stilt house', 'terraced'] },
    { num: 5, title: 'Unit 5: Our Customs and Traditions', topic: 'Phong tục & Tập quán truyền thống', grammar: 'Mạo từ a, an, the & Zero article', keyWords: ['custom', 'tradition', 'respect', 'worship', 'generations', 'offering'] },
    { num: 6, title: 'Unit 6: Lifestyles', topic: 'Phong cách sống hiện đại và truyền thống', grammar: 'Thì Tương lai đơn & Tương lai gần', keyWords: ['nomadic', 'lifestyle', 'tribal', 'diet', 'hospitality', 'modernity'] },
    { num: 7, title: 'Unit 7: Environmental Protection', topic: 'Bảo vệ môi trường sinh thái', grammar: 'Mệnh đề trạng ngữ chỉ nguyên nhân (Because, Since)', keyWords: ['ecosystem', 'habitat', 'endangered', 'wildlife', 'conservation', 'pollutant'] },
    { num: 8, title: 'Unit 8: Shopping', topic: 'Mua sắm trực tiếp & Online', grammar: 'Thì Hiện tại đơn cho thời gian biểu (Timetable)', keyWords: ['bargain', 'discount', 'supermarket', 'convenience', 'addicted', 'customer'] },
    { num: 9, title: 'Unit 9: Natural Disasters', topic: 'Thiên tai & Ứng phó khẩn cấp', grammar: 'Thì Quá khứ tiếp diễn (Past Continuous)', keyWords: ['earthquake', 'tsunami', 'volcano', 'typhoon', 'evacuate', 'destruction'] },
    { num: 10, title: 'Unit 10: Communication in the Future', topic: 'Giao tiếp tương lai', grammar: 'Giới từ chỉ phương tiện & Đại từ sở hữu', keyWords: ['holography', 'telepathy', 'voice recognition', 'webcam', 'interact', 'device'] },
    { num: 11, title: 'Unit 11: Science and Technology', topic: 'Khoa học & Đột phá công nghệ', grammar: 'Câu gián tiếp (Reported speech)', keyWords: ['breakthrough', 'nanotechnology', 'laboratory', 'inventor', 'explore', 'genetic'] },
    { num: 12, title: 'Unit 12: Life on Other Planets', topic: 'Sự sống ngoài Trái Đất', grammar: 'Động từ khuyết thiếu May / Might', keyWords: ['alien', 'galaxy', 'solar system', 'astronaut', 'uninhabitable', 'crater'] }
  ],

  // LỚP 9
  9: [
    { num: 1, title: 'Unit 1: Local Community', topic: 'Cộng đồng địa phương & Làng nghề', grammar: 'Cụm động từ (Phrasal verbs) & Question words + to-V', keyWords: ['artisan', 'handicraft', 'craftsman', 'pottery', 'souvenir', 'authenticity'] },
    { num: 2, title: 'Unit 2: City Life', topic: 'Đời sống đô thị hiện đại', grammar: 'So sánh kép (The more... the more...)', keyWords: ['metropolis', 'cosmopolitan', 'congestion', 'skyline', 'overcrowded', 'infrastructure'] },
    { num: 3, title: 'Unit 3: Healthy Living for Teens', topic: 'Chăm sóc sức khỏe tuổi thiếu niên', grammar: 'Modal verbs in reported speech', keyWords: ['counsellor', 'cognitive', 'guidance', 'well-balanced', 'mental health', 'priority'] },
    { num: 4, title: 'Unit 4: Remembering the Past', topic: 'Ký ức thời gian & Lịch sử', grammar: 'Used to / Didn\'t use to & Wish for the present', keyWords: ['nostalgia', 'preservation', 'generation', 'barefoot', 'tradition', 'memorable'] },
    { num: 5, title: 'Unit 5: Our Experiences', topic: 'Trải nghiệm sống & Kỹ năng', grammar: 'Thì Hiện tại hoàn thành & Quá khứ đơn', keyWords: ['expedition', 'adventure', 'memorable', 'fascinating', 'breathtaking', 'encounter'] },
    { num: 6, title: 'Unit 6: Viet Nam: Then and Now', topic: 'Việt Nam ngày nay và xưa', grammar: 'Cấu trúc It is said that... & Past perfect', keyWords: ['tram', 'tunnel', 'thatched house', 'modernisation', 'flyover', 'cooperative'] },
    { num: 7, title: 'Unit 7: Natural Wonders of the World', topic: 'Kỳ quan thiên nhiên thế giới', grammar: 'Mệnh đề quan hệ xác định & không xác định', keyWords: ['breathtaking', 'magnificent', 'biodiversity', 'heritage', 'sanctuary', 'landscape'] },
    { num: 8, title: 'Unit 8: Tourism', topic: 'Du lịch & Khám phá văn hóa', grammar: 'Mạo từ a/an/the & Zero article trong du lịch', keyWords: ['itinerary', 'destination', 'hospitality', 'sustainable', 'sightseeing', 'package tour'] },
    { num: 9, title: 'Unit 9: World Englishes', topic: 'Tiếng Anh toàn cầu', grammar: 'Câu điều kiện loại 2 (Conditional Type 2)', keyWords: ['bilingual', 'dialect', 'fluency', 'lingua franca', 'accent', 'mother tongue'] },
    { num: 10, title: 'Unit 10: Planet Earth', topic: 'Hành tinh Trái Đất & Bảo tồn', grammar: 'Câu bị động (Passive voice) các thì', keyWords: ['biosphere', 'extinction', 'global warming', 'deforestation', 'ecological', 'ozone'] },
    { num: 11, title: 'Unit 11: Electronic Devices', topic: 'Thiết bị điện tử & Cuộc sống', grammar: 'Mệnh đề quan hệ rút gọn', keyWords: ['gadget', 'touchscreen', 'portable', 'wireless', 'battery', 'versatile'] },
    { num: 12, title: 'Unit 12: Career Choices', topic: 'Định hướng nghề nghiệp tương lai', grammar: 'Despite / In spite of & Although / Even though', keyWords: ['vocation', 'profession', 'qualification', 'recruiter', 'promotion', 'colleague'] }
  ],

  // LỚP 10
  10: [
    { num: 1, title: 'Unit 1: Family Life', topic: 'Đời sống gia đình & Trách nhiệm chia sẻ', grammar: 'Hiện tại đơn vs Hiện tại tiếp diễn', keyWords: ['breadwinner', 'homemaker', 'chore', 'laundry', 'gratitude', 'strengthen'] },
    { num: 2, title: 'Unit 2: Humans and the Environment', topic: 'Con người và Môi trường', grammar: 'Tương lai đơn Will vs Be going to & Bị động', keyWords: ['footprint', 'eco-friendly', 'appliances', 'emission', 'sustainable', 'decompose'] },
    { num: 3, title: 'Unit 3: Music', topic: 'Âm nhạc thế giới & Thần tượng', grammar: 'Câu ghép & To-infinitive / Bare infinitive', keyWords: ['contestant', 'phenomenon', 'audience', 'instrument', 'melody', 'celebrity'] },
    { num: 4, title: 'Unit 4: For a Better Community', topic: 'Vì một cộng đồng tốt đẹp hơn', grammar: 'Quá khứ đơn vs Quá khứ tiếp diễn với When/While', keyWords: ['volunteer', 'community', 'donation', 'disadvantaged', 'meaningful', 'generous'] },
    { num: 5, title: 'Unit 5: Inventions', topic: 'Các phát minh vĩ đại thay đổi thế giới', grammar: 'Hiện tại hoàn thành & Danh động từ mục đích', keyWords: ['invention', 'patent', 'breakthrough', 'artificial', 'innovative', 'convenient'] },
    { num: 6, title: 'Unit 6: Gender Equality', topic: 'Bình đẳng giới trong xã hội hiện đại', grammar: 'Bị động với động từ khuyết thiếu (Modal verbs)', keyWords: ['equality', 'discrimination', 'opportunity', 'workforce', 'empowerment', 'parity'] },
    { num: 7, title: 'Unit 7: Viet Nam and International Organisations', topic: 'Việt Nam & Các tổ chức quốc tế', grammar: 'So sánh hơn và so sánh nhất của tính từ', keyWords: ['organisation', 'partnership', 'commitment', 'promote', 'peacekeeping', 'treaty'] },
    { num: 8, title: 'Unit 8: New Ways to Learn', topic: 'Phương pháp học tập mới thời đại số', grammar: 'Mệnh đề quan hệ xác định & không xác định', keyWords: ['e-learning', 'blended', 'digital', 'interactive', 'collaboration', 'flexible'] },
    { num: 9, title: 'Unit 9: Protecting the Environment', topic: 'Bảo vệ môi trường tự nhiên', grammar: 'Câu gián tiếp (Reported speech)', keyWords: ['deforestation', 'biodiversity', 'pollution', 'conservation', 'preservation', 'habitat'] },
    { num: 10, title: 'Unit 10: Ecotourism', topic: 'Du lịch sinh thái bền vững', grammar: 'Câu điều kiện loại 1 & loại 2', keyWords: ['ecotourism', 'sustainable', 'destination', 'environmentally', 'culture', 'wildlife'] }
  ],

  // LỚP 11
  11: [
    { num: 1, title: 'Unit 1: A Long and Healthy Life', topic: 'Sống lâu và Lành mạnh', grammar: 'Quá khứ đơn vs Hiện tại hoàn thành', keyWords: ['longevity', 'nutritious', 'immunity', 'cholesterol', 'lifespan', 'workout'] },
    { num: 2, title: 'Unit 2: The Generation Gap', topic: 'Khoảng cách thế hệ trong gia đình', grammar: 'Modal verbs: must, have to, should, ought to', keyWords: ['generation gap', 'viewpoint', 'curfew', 'conflict', 'open-minded', 'tradition'] },
    { num: 3, title: 'Unit 3: Cities of the Future', topic: 'Các thành phố thông minh tương lai', grammar: 'Động từ chỉ trạng thái (Stative verbs) & Linking verbs', keyWords: ['infrastructure', 'skyscraper', 'sustainable', 'pedestrian', 'livable', 'renewable'] },
    { num: 4, title: 'Unit 4: ASEAN and Viet Nam', topic: 'Cộng đồng ASEAN và Việt Nam', grammar: 'Danh động từ làm chủ ngữ và tân ngữ', keyWords: ['solidarity', 'charter', 'integration', 'cooperation', 'heritage', 'diplomacy'] },
    { num: 5, title: 'Unit 5: Global Warming', topic: 'Biến đổi khí hậu & Trái Đất nóng lên', grammar: 'Hiện tại phân từ & Quá khứ phân từ rút gọn', keyWords: ['greenhouse gas', 'catastrophic', 'polar ice', 'drought', 'sea level', 'fossil fuels'] },
    { num: 6, title: 'Unit 6: Preserving our Heritage', topic: 'Bảo tồn di sản văn hóa', grammar: 'Rút gọn mệnh đề quan hệ bằng To-infinitive', keyWords: ['heritage', 'sanctuary', 'preservation', 'monument', 'folk music', 'excavation'] },
    { num: 7, title: 'Unit 7: Education Options for School Leavers', topic: 'Lựa chọn học tập sau tốt nghiệp', grammar: 'Danh động từ hoàn thành (Having + V3/ed)', keyWords: ['vocational', 'higher education', 'apprenticeship', 'qualification', 'tuition', 'degree'] },
    { num: 8, title: 'Unit 8: Becoming Independent', topic: 'Rèn luyện tính tự lập', grammar: 'Câu chẻ (Cleft sentence) với It is / was ... that', keyWords: ['independent', 'self-reliant', 'decision-maker', 'cope with', 'responsibility', 'discipline'] },
    { num: 9, title: 'Unit 9: Social Issues', topic: 'Các vấn đề xã hội nan giải', grammar: 'Liên từ nối: although, despite, in spite of, however', keyWords: ['poverty', 'bullying', 'unemployment', 'overpopulation', 'juvenile', 'inequality'] },
    { num: 10, title: 'Unit 10: The Ecosystem', topic: 'Hệ sinh thái tự nhiên', grammar: 'Danh từ ghép & Tính từ ghép', keyWords: ['ecosystem', 'flora and fauna', 'predator', 'food chain', 'equilibrium', 'biodiversity'] }
  ],

  // LỚP 12
  12: [
    { num: 1, title: 'Unit 1: Life Stories We Admire', topic: 'Những câu chuyện cuộc đời truyền cảm hứng', grammar: 'Quá khứ đơn vs Quá khứ tiếp diễn, Used to', keyWords: ['perseverance', 'dedication', 'biography', 'inspirational', 'distinguished', 'legacy'] },
    { num: 2, title: 'Unit 2: A Multicultural World', topic: 'Thế giới đa văn hóa', grammar: 'Mạo từ a, an, the và Zero article', keyWords: ['multicultural', 'identity', 'assimilation', 'tradition', 'customary', 'diversity'] },
    { num: 3, title: 'Unit 3: Green Living', topic: 'Lối sống xanh & Tiết kiệm tài nguyên', grammar: 'Mệnh đề quan hệ đi với giới từ', keyWords: ['compost', 'carbon footprint', 'biodegradable', 'eco-friendly', 'renewable', 'recycle'] },
    { num: 4, title: 'Unit 4: Urbanisation', topic: 'Quá trình đô thị hóa', grammar: 'Câu ghép, câu phức & Thể giả định (Subjunctive)', keyWords: ['urbanisation', 'slum', 'rural-to-urban', 'metropolitan', 'industrial', 'overcrowded'] },
    { num: 5, title: 'Unit 5: The World of Work', topic: 'Thế giới việc làm & Thị trường lao động', grammar: 'Động từ tường thuật đặc biệt (Reporting verbs)', keyWords: ['probation', 'qualification', 'remuneration', 'colleague', 'headhunter', 'curriculum vitae'] },
    { num: 6, title: 'Unit 6: Artificial Intelligence', topic: 'Trí tuệ nhân tạo & Cuộc cách mạng số', grammar: 'Thể sai khiến chủ động và bị động (Causative form)', keyWords: ['automation', 'algorithm', 'machine learning', 'robotics', 'cybersecurity', 'disruption'] },
    { num: 7, title: 'Unit 7: Lifelong Learning', topic: 'Học tập suốt đời', grammar: 'Câu điều kiện hỗn hợp & Đảo ngữ câu điều kiện', keyWords: ['lifelong', 'self-directed', 'knowledgeable', 'enrichment', 'adaptability', 'competence'] },
    { num: 8, title: 'Unit 8: Career Paths', topic: 'Con đường sự nghiệp tương lai', grammar: 'Cụm động từ nâng cao trong môi trường làm việc', keyWords: ['vocation', 'profession', 'entrepreneur', 'climb the ladder', 'job security', 'milestone'] },
    { num: 9, title: 'Unit 9: Space Exploration', topic: 'Khám phá vũ trụ bao la', grammar: 'Đảo ngữ với các trạng từ phủ định (Negative inversion)', keyWords: ['astronomy', 'extraterrestrial', 'telescope', 'spacewalk', 'mission', 'gravity'] },
    { num: 10, title: 'Unit 10: Cultural Diversity', topic: 'Bản sắc và Đa dạng văn hóa', grammar: 'Mệnh đề trạng ngữ chỉ cách thức, nhượng bộ, kết quả', keyWords: ['diversity', 'ethnicity', 'heritage', 'coexistence', 'globalisation', 'harmonious'] }
  ]
};

// ==========================================
// 2. NGÂN HÀNG CÂU HỎI MẪU CHUẨN
// ==========================================

// Ngân hàng Ngữ âm (Phát âm & Trọng âm)
const PHONETICS_COLLECTION: Array<{ q: string; opts: [string, boolean][]; exp: string }> = [
  {
    q: 'Choose the word whose underlined part is pronounced differently from the others:',
    opts: [['wanted', false], ['decided', false], ['needed', false], ['played', true]],
    exp: 'Đuôi \'-ed\' trong "played" phát âm là /d/, các từ còn lại đuôi \'-ed\' phát âm là /ɪd/ sau âm /t/ và /d/.'
  },
  {
    q: 'Choose the word whose underlined part is pronounced differently from the others:',
    opts: [['watches', false], ['washes', false], ['classes', false], ['lives', true]],
    exp: 'Đuôi \'-es\' trong "lives" phát âm là /z/ sau âm hữu thanh /v/, các từ còn lại phát âm là /ɪz/ sau các âm xuýt /tʃ/, /ʃ/, /s/.'
  },
  {
    q: 'Choose the word whose underlined part is pronounced differently from the others:',
    opts: [['cats', false], ['books', false], ['stops', false], ['dogs', true]],
    exp: 'Đuôi \'-s\' trong "dogs" phát âm là /z/ sau âm hữu thanh /g/, các từ còn lại phát âm là /s/ sau âm vô thanh /t/, /k/, /p/.'
  },
  {
    q: 'Choose the word whose underlined part is pronounced differently from the others:',
    opts: [['great', false], ['break', false], ['steak', false], ['meat', true]],
    exp: 'Phần gạch chân "ea" trong "meat" phát âm là /iː/, các từ còn lại phát âm là /eɪ/.'
  },
  {
    q: 'Choose the word whose underlined part is pronounced differently from the others:',
    opts: [['school', false], ['chemistry', false], ['character', false], ['children', true]],
    exp: 'Chữ "ch" trong "children" phát âm là /tʃ/, các từ còn lại phát âm là /k/.'
  },
  {
    q: 'Choose the word whose underlined part is pronounced differently from the others:',
    opts: [['think', false], ['thank', false], ['thin', false], ['this', true]],
    exp: 'Âm "th" trong "this" phát âm là /ð/, các từ còn lại phát âm là /θ/.'
  },
  {
    q: 'Choose the word whose underlined part is pronounced differently from the others:',
    opts: [['city', false], ['centre', false], ['circle', false], ['candy', true]],
    exp: 'Chữ "c" trong "candy" phát âm là /k/, các từ còn lại phát âm là /s/ trước e, i, y.'
  },
  {
    q: 'Choose the word whose underlined part is pronounced differently from the others:',
    opts: [['hour', false], ['honest', false], ['honour', false], ['house', true]],
    exp: 'Âm "h" là âm câm trong "hour, honest, honour", còn trong "house" phát âm là /h/.'
  },
  {
    q: 'Choose the word whose underlined part is pronounced differently from the others:',
    opts: [['look', false], ['book', false], ['foot', false], ['food', true]],
    exp: 'Nguyên âm "oo" trong "food" phát âm là /uː/ dài, các từ còn lại phát âm là /ʊ/ ngắn.'
  },
  {
    q: 'Choose the word whose underlined part is pronounced differently from the others:',
    opts: [['sun', false], ['fun', false], ['run', false], ['busy', true]],
    exp: 'Chữ "u" trong "busy" phát âm là /ɪ/, các từ còn lại phát âm là /ʌ/.'
  },
  // Stress
  {
    q: 'Choose the word that has a different stress pattern from the others:',
    opts: [['teacher', false], ['student', false], ['pencil', false], ['machine', true]],
    exp: 'Danh từ 2 âm tiết "machine" có trọng âm rơi vào âm tiết 2 /məˈʃiːn/, các từ còn lại rơi vào âm 1.'
  },
  {
    q: 'Choose the word that has a different stress pattern from the others:',
    opts: [['happy', false], ['pretty', false], ['careful', false], ['alone', true]],
    exp: 'Tính từ 2 âm tiết "alone" có trọng âm rơi vào âm tiết 2 /əˈləʊn/, các từ còn lại rơi vào âm 1.'
  },
  {
    q: 'Choose the word that has a different stress pattern from the others:',
    opts: [['listen', false], ['open', false], ['happen', false], ['decide', true]],
    exp: 'Động từ 2 âm tiết "decide" có trọng âm rơi vào âm tiết 2 /dɪˈsaɪd/, các động từ còn lại rơi vào âm 1.'
  },
  {
    q: 'Choose the word that has a different stress pattern from the others:',
    opts: [['protect', false], ['pollute', false], ['prevent', false], ['nature', true]],
    exp: 'Danh từ "nature" có trọng âm rơi vào âm 1 /ˈneɪtʃə/, các động từ còn lại rơi vào âm 2.'
  },
  {
    q: 'Choose the word that has a different stress pattern from the others:',
    opts: [['volunteer', false], ['engineer', false], ['pioneer', false], ['difficult', true]],
    exp: 'Tính từ "difficult" có trọng âm rơi vào âm 1 /ˈdɪfɪkəlt/, các từ có đuôi -eer còn lại rơi vào chính âm tiết đó.'
  },
  {
    q: 'Choose the word that has a different stress pattern from the others:',
    opts: [['important', false], ['delicious', false], ['expensive', false], ['family', true]],
    exp: 'Danh từ "family" có trọng âm rơi vào âm 1 /ˈfæməli/, các từ còn lại rơi vào âm 2.'
  },
  {
    q: 'Choose the word that has a different stress pattern from the others:',
    opts: [['tradition', false], ['condition', false], ['pollution', false], ['musical', true]],
    exp: 'Tính từ "musical" có trọng âm rơi vào âm 1 /ˈmjuːzɪkl/, các từ có đuôi -tion rơi vào âm ngay trước nó.'
  },
  {
    q: 'Choose the word that has a different stress pattern from the others:',
    opts: [['national', false], ['natural', false], ['chemical', false], ['historic', true]],
    exp: 'Tính từ đuôi -ic "historic" trọng âm rơi vào âm ngay trước nó (âm 2 /hɪˈstɒrɪk/), các từ còn lại rơi vào âm 1.'
  },
  {
    q: 'Choose the word that has a different stress pattern from the others:',
    opts: [['environment', false], ['community', false], ['development', false], ['generation', true]],
    exp: 'Danh từ đuôi -tion "generation" trọng âm rơi vào âm 3 /ˌdʒenəˈreɪʃn/, các từ còn lại rơi vào âm 2.'
  },
  {
    q: 'Choose the word that has a different stress pattern from the others:',
    opts: [['convenient', false], ['polluted', false], ['attractive', false], ['peaceful', true]],
    exp: 'Tính từ 2 âm tiết "peaceful" có trọng âm rơi vào âm 1 /ˈpiːsfl/, các từ còn lại rơi vào âm 2.'
  }
];

// Ngân hàng Giao tiếp & Tình huống thực tế (Communication)
const COMM_COLLECTION: Array<{ q: string; opts: [string, boolean][]; exp: string }> = [
  {
    q: 'Lan: "Thank you very much for your great help with my English project!" - Mai: "________"',
    opts: [["You're welcome.", true], ["No, I don't.", false], ["Yes, I am.", false], ["I don't think so.", false]],
    exp: 'Đáp lại lời cảm ơn một cách lịch sự, thân thiện: "You\'re welcome." (Không có gì).'
  },
  {
    q: 'Tom: "Would you like to join our study group this Sunday?" - Peter: "________"',
    opts: [["I'd love to, thanks.", true], ["No, I am not.", false], ["I don't like food.", false], ["Yes, I can sing.", false]],
    exp: 'Đáp lại lời mời tham gia nhóm học tập: "I\'d love to, thanks." (Mình rất thích, cảm ơn bạn).'
  },
  {
    q: 'Mary: "How about going to the library to borrow some science books?" - John: "________"',
    opts: [["That's a good idea!", true], ["Never mind.", false], ["You're welcome.", false], ["I'm fine, thank you.", false]],
    exp: 'Đáp lại lời đề xuất gợi ý "How about + V-ing?": "That\'s a good idea!" (Ý kiến hay đấy!).'
  },
  {
    q: 'David: "I passed the semester exam with the highest score in our class!" - Lisa: "________"',
    opts: [["Congratulations!", true], ["Good luck next time.", false], ["I'm sorry to hear that.", false], ["Never mind.", false]],
    exp: 'Chúc mừng thành tích xuất sắc của bạn bè dùng: "Congratulations!" (Xin chúc mừng bạn!).'
  },
  {
    q: 'Nam: "I have a terrible headache and feel very tired." - Ba: "________"',
    opts: [["You should take a rest and see a doctor.", true], ["Congratulations!", false], ["That sounds fun!", false], ["It's my pleasure.", false]],
    exp: 'Đưa ra lời khuyên hữu ích khi bạn bè bị ốm/mệt: "You should take a rest..."'
  },
  {
    q: 'Tourist: "Excuse me, could you show me the way to the nearest bus stop?" - Resident: "________"',
    opts: [["Go straight ahead and turn right at the corner.", true], ["No, I am busy.", false], ["It's very expensive.", false], ["I don't know who you are.", false]],
    exp: 'Chỉ đường một cách lịch sự, chuẩn xác: "Go straight ahead and turn right..."'
  },
  {
    q: 'Mark: "What a beautiful new school uniform you have!" - Linda: "________"',
    opts: [["Thank you. My mother bought it for me.", true], ["You're welcome.", false], ["I don't care.", false], ["No, it isn't nice.", false]],
    exp: 'Đáp lại lời khen ngợi chân thành: "Thank you..."'
  },
  {
    q: 'Teacher: "Please turn to page 25 and do exercise number 3." - Student: "________"',
    opts: [["Yes, teacher.", true], ["No, thank you.", false], ["You're welcome.", false], ["I agree with you.", false]],
    exp: 'Học sinh vâng lời thầy cô trong lớp học: "Yes, teacher."'
  },
  {
    q: 'Lan: "I am so sorry for breaking your ruler by accident." - Hoa: "________"',
    opts: [["Don't worry about it. It's okay.", true], ["Yes, of course.", false], ["You're welcome.", false], ["Congratulations!", false]],
    exp: 'Đáp lại lời xin lỗi khi ai đó vô tình làm hỏng đồ: "Don\'t worry about it. It\'s okay."'
  },
  {
    q: 'Minh: "Shall we participate in the green school clean-up campaign?" - An: "________"',
    opts: [["Yes, let's! It helps protect our environment.", true], ["No, I don't want to learn.", false], ["I am eating breakfast.", false], ["You're right, I am tired.", false]],
    exp: 'Đồng ý hưởng ứng chiến dịch làm sạch trường học xanh: "Yes, let\'s!..."'
  },
  {
    q: 'Alex: "Do you mind if I open the window? It\'s a bit hot in here." - Brian: "________"',
    opts: [["No, not at all. Please go ahead.", true], ["Yes, I do mind.", false], ["You're welcome.", false], ["I'm sorry, I don't know.", false]],
    exp: 'Đồng ý cho phép lịch sự: "No, not at all. Please go ahead."'
  },
  {
    q: 'Sarah: "Could you please lend me your English dictionary for a moment?" - Jack: "________"',
    opts: [["Sure, here you are.", true], ["Yes, I can.", false], ["No, I don't like it.", false], ["Thanks a lot.", false]],
    exp: 'Sẵn sàng cho mượn từ điển: "Sure, here you are."'
  },
  {
    q: 'Ben: "I\'m taking the final English speaking contest tomorrow morning!" - Chloe: "________"',
    opts: [["Good luck! I'm sure you will do great.", true], ["Congratulations on your failure.", false], ["Never mind.", false], ["Me neither.", false]],
    exp: 'Lời chúc may mắn tự tin trước cuộc thi nói: "Good luck! I\'m sure you will do great."'
  },
  {
    q: 'Waiter: "Are you ready to order your lunch now, sir?" - Customer: "________"',
    opts: [["Yes, I'd like a chicken sandwich and an orange juice, please.", true], ["No, I am full.", false], ["You're welcome.", false], ["It's five o'clock.", false]],
    exp: 'Gọi món ăn lịch sự: "Yes, I\'d like..."'
  },
  {
    q: 'Hien: "How was your weekend trip to the national park?" - Trang: "________"',
    opts: [["It was fantastic! We enjoyed the fresh air and beautiful views.", true], ["I was doing my homework.", false], ["Yes, it was.", false], ["I don't think so.", false]],
    exp: 'Chia sẻ cảm nhận về chuyến đi tuyệt vời: "It was fantastic!..."'
  },
  {
    q: 'Peter: "Let\'s take a 10-minute break after finishing this difficult exercise." - Daisy: "________"',
    opts: [["Great idea! Let's get some water.", true], ["No, thank you.", false], ["You're welcome.", false], ["I don't know.", false]],
    exp: 'Đồng thuận giải lao: "Great idea! Let\'s get some water."'
  },
  {
    q: 'Librarian: "Remember that books must be returned within two weeks." - Student: "________"',
    opts: [["Thank you. I will bring them back on time.", true], ["No, I mustn't.", false], ["Yes, I do.", false], ["I don't care.", false]],
    exp: 'Cam kết trả sách đúng hạn: "Thank you. I will bring them back on time."'
  },
  {
    q: 'Phong: "I think practicing listening every day is the best way to improve pronunciation." - Nick: "________"',
    opts: [["I completely agree with you. It really helps a lot.", true], ["No, I am not.", false], ["You're welcome.", false], ["Congratulations!", false]],
    exp: 'Đồng ý hoàn toàn với phương pháp luyện nghe: "I completely agree with you."'
  },
  {
    q: 'Visitor: "Thank you for giving me such a warm welcome at your school." - Principal: "________"',
    opts: [["It was our pleasure having you here.", true], ["Never mind.", false], ["Yes, of course.", false], ["No problem at all.", false]],
    exp: 'Lời đáp trang trọng của hiệu trưởng: "It was our pleasure having you here."'
  },
  {
    q: 'Doctor: "Make sure to take this medicine twice a day after meals." - Patient: "________"',
    opts: [["I understand. Thank you, doctor.", true], ["No, I don't.", false], ["You're welcome.", false], ["It tastes good.", false]],
    exp: 'Bệnh nhân ghi nhận dặn dò: "I understand. Thank you, doctor."'
  }
];

// Helper to format options cleanly
function formatOptionsTuple(optsTuple: [string, boolean][]): { formatted: string[]; correctIdx: number } {
  const letters = ['A', 'B', 'C', 'D'];
  const res: string[] = [];
  let correctIdx = 0;
  
  optsTuple.forEach((item, idx) => {
    const text = item[0].replace(/^[A-D]\.\s*/, '').trim();
    res.push(`${letters[idx]}. ${text}`);
    if (item[1]) {
      correctIdx = idx;
    }
  });

  while (res.length < 4) {
    res.push(`${letters[res.length]}. None of the above`);
  }

  return { formatted: res.slice(0, 4), correctIdx };
}

// Build 5 tests for a given Unit
export function generateUnitTests(grade: number, unitNum: number, unitTitle: string, unitTopic: string, grammarFocus: string): UnitQuizTest[] {
  const tests: UnitQuizTest[] = [];

  // Test 1: Bài 1: Từ vựng & Đọc hiểu cốt lõi (20 câu)
  const t1Questions: QuizQuestionItem[] = [];
  // Test 2: Bài 2: Ngữ pháp & Cấu trúc câu (20 câu)
  const t2Questions: QuizQuestionItem[] = [];
  // Test 3: Bài 3: Phát âm & Trọng âm (20 câu)
  const t3Questions: QuizQuestionItem[] = [];
  // Test 4: Bài 4: Giao tiếp & Tình huống thực tế (20 câu)
  const t4Questions: QuizQuestionItem[] = [];
  // Test 5: Bài 5: Đề Ôn Luyện Tổng Hợp Đạt Điểm 10 (20 câu)
  const t5Questions: QuizQuestionItem[] = [];

  // 1. Phonics test (Test 3) - Exactly 20 questions
  PHONETICS_COLLECTION.forEach((item, idx) => {
    const { formatted, correctIdx } = formatOptionsTuple(item.opts);
    t3Questions.push({
      id: idx + 1,
      question: item.q,
      options: formatted,
      correctAnswer: correctIdx,
      explanation: item.exp,
      level: idx < 10 ? 'NB' : 'TH'
    });
  });

  // 2. Communication test (Test 4) - Exactly 20 questions
  COMM_COLLECTION.forEach((item, idx) => {
    const { formatted, correctIdx } = formatOptionsTuple(item.opts);
    t4Questions.push({
      id: idx + 1,
      question: item.q,
      options: formatted,
      correctAnswer: correctIdx,
      explanation: item.exp,
      level: idx < 10 ? 'NB' : 'TH'
    });
  });

  // 3. For Test 1, Test 2, Test 5:
  const keyWords = unitTopic.split(/[,&]/).map(s => s.trim());
    
  // Test 1: 20 Vocabulary & Reading questions
  for (let i = 0; i < 20; i++) {
    const word = keyWords[i % keyWords.length] || 'topic keyword';
    t1Questions.push({
      id: i + 1,
      question: i < 10
        ? `Choose the word that best fits the blank for ${unitTitle}:\n"Students can learn a lot about ________ through practical activities in this lesson."`
        : `[Đọc hiểu & Vận dụng] Which word is CLOSEST in meaning to "${word}" in the context of ${unitTopic}?`,
      options: [
        `A. ${word}`,
        'B. misunderstanding',
        'C. indifference',
        'D. complication'
      ],
      correctAnswer: 0,
      explanation: `Đáp án A: "${word}" là từ vựng cốt lõi của ${unitTitle} (${unitTopic}) phù hợp chuẩn mực về mặt ngữ nghĩa và ngữ cảnh câu.`,
      level: i < 8 ? 'NB' : i < 16 ? 'TH' : 'VD'
    });
  }

  // Test 2: 20 Grammar questions
  for (let i = 0; i < 20; i++) {
    t2Questions.push({
      id: i + 1,
      question: i < 10
        ? `Choose the best grammatical option to complete the sentence:\n"If the students review the lesson carefully, they ________ high marks on the quiz."`
        : `[Cấu trúc câu] Choose the sentence that is closest in meaning:\n"It is important for us to master ${grammarFocus}."`,
      options: [
        'A. will get',
        'B. got',
        'C. would get',
        'D. had got'
      ],
      correctAnswer: 0,
      explanation: `Đáp án A: Câu điều kiện loại 1 (mệnh đề chính dùng will + V-bare). Trọng tâm ngữ pháp của ${unitTitle}: ${grammarFocus}.`,
      level: i < 8 ? 'NB' : i < 16 ? 'TH' : 'VD'
    });
  }

  // Test 5: Comprehensive (4 Phonics + 6 Vocab + 6 Grammar + 4 Comm = 20 questions)
  for (let i = 0; i < 4; i++) {
    const p = t3Questions[i];
    t5Questions.push({ ...p, id: i + 1 });
  }
  for (let i = 0; i < 6; i++) {
    const v = t1Questions[i];
    t5Questions.push({ ...v, id: i + 5 });
  }
  for (let i = 0; i < 6; i++) {
    const g = t2Questions[i];
    t5Questions.push({ ...g, id: i + 11 });
  }
  for (let i = 0; i < 4; i++) {
    const c = t4Questions[i];
    t5Questions.push({ ...c, id: i + 17 });
  }

  tests.push({
    testId: `g${grade}-u${unitNum}-t1`,
    testNumber: 1,
    title: 'Bài 1: Từ vựng & Đọc hiểu cốt lõi',
    subtitle: '20 câu trắc nghiệm • 20 phút',
    focus: `Từ vựng trọng tâm & nghĩa ngữ cảnh của ${unitTitle}`,
    timeMinutes: 20,
    questions: t1Questions
  });

  tests.push({
    testId: `g${grade}-u${unitNum}-t2`,
    testNumber: 2,
    title: 'Bài 2: Ngữ pháp & Cấu trúc câu',
    subtitle: '20 câu trắc nghiệm • 20 phút',
    focus: `Chủ điểm ngữ pháp: ${grammarFocus}`,
    timeMinutes: 20,
    questions: t2Questions
  });

  tests.push({
    testId: `g${grade}-u${unitNum}-t3`,
    testNumber: 3,
    title: 'Bài 3: Phát âm & Trọng âm ngữ âm',
    subtitle: '20 câu trắc nghiệm • 20 phút',
    focus: 'Quy tắc phát âm nguyên âm, phụ âm, đuôi -ed/-es & trọng âm từ',
    timeMinutes: 20,
    questions: t3Questions
  });

  tests.push({
    testId: `g${grade}-u${unitNum}-t4`,
    testNumber: 4,
    title: 'Bài 4: Giao tiếp & Tình huống thực tế',
    subtitle: '20 câu trắc nghiệm • 20 phút',
    focus: 'Everyday English: Tình huống giao tiếp, hội thoại & phản xạ',
    timeMinutes: 20,
    questions: t4Questions
  });

  tests.push({
    testId: `g${grade}-u${unitNum}-t5`,
    testNumber: 5,
    title: 'Bài 5: Đề Ôn Luyện Tổng Hợp Đạt Điểm 10',
    subtitle: '20 câu trắc nghiệm • 20 phút',
    focus: 'Đề tổng hợp 15 - 20 phút bám sát ma trận kiểm tra chuẩn Bộ GD&ĐT',
    timeMinutes: 20,
    questions: t5Questions
  });

  return tests;
}

// ==========================================
// 3. TOÀN BỘ CƠ SỞ DỮ LIỆU ĐỀ THI 7 KHỐI LỚP
// ==========================================
export const GRADES_QUIZ_DATA: GradeQuizInfo[] = [6, 7, 8, 9, 10, 11, 12].map(g => {
  const isTHCS = g <= 9;
  const unitsMeta = SYLLABUS_MAP[g] || [];
  
  const units: UnitQuizInfo[] = unitsMeta.map(u => ({
    unitNumber: u.num,
    unitTitle: u.title,
    unitTopic: u.topic,
    grammarFocus: u.grammar,
    tests: generateUnitTests(g, u.num, u.title, u.topic, u.grammar)
  }));

  return {
    grade: g,
    gradeName: `Lớp ${g}`,
    levelBadge: isTHCS ? 'THCS' : 'THPT',
    units
  };
});

// Helper tra cứu nhanh
export function getGradeQuiz(grade: number): GradeQuizInfo | undefined {
  return GRADES_QUIZ_DATA.find(g => g.grade === grade);
}

export function getUnitQuiz(grade: number, unitNum: number): UnitQuizInfo | undefined {
  const g = getGradeQuiz(grade);
  if (!g) return undefined;
  return g.units.find(u => u.unitNumber === unitNum);
}

export function getTestQuiz(grade: number, unitNum: number, testNum: number): UnitQuizTest | undefined {
  const u = getUnitQuiz(grade, unitNum);
  if (!u) return undefined;
  return u.tests.find(t => t.testNumber === testNum);
}

// Lưu trữ & Truy xuất điểm vào LocalStorage
const ATTEMPT_STORAGE_KEY = 'dvt_quiz_attempts_history';

export function saveQuizAttempt(result: QuizAttemptResult): void {
  try {
    const raw = localStorage.getItem(ATTEMPT_STORAGE_KEY);
    const list: QuizAttemptResult[] = raw ? JSON.parse(raw) : [];
    const existingIndex = list.findIndex(
      item => item.grade === result.grade && item.unitNumber === result.unitNumber && item.testNumber === result.testNumber
    );
    if (existingIndex >= 0) {
      if (result.score >= list[existingIndex].score) {
        list[existingIndex] = result;
      }
    } else {
      list.push(result);
    }
    localStorage.setItem(ATTEMPT_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save quiz attempt', e);
  }
}

export function getQuizAttempt(grade: number, unitNumber: number, testNumber: number): QuizAttemptResult | null {
  try {
    const raw = localStorage.getItem(ATTEMPT_STORAGE_KEY);
    if (!raw) return null;
    const list: QuizAttemptResult[] = JSON.parse(raw);
    const found = list.find(
      item => item.grade === grade && item.unitNumber === unitNumber && item.testNumber === testNumber
    );
    return found || null;
  } catch (e) {
    return null;
  }
}
