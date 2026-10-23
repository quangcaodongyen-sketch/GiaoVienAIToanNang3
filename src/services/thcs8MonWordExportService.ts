/**
 * THCS 8 Môn Word Export Service
 * Hệ thống sinh đề kiểm tra tham khảo dành cho giáo viên Công văn 7991/BGDĐT & Sách Kết Nối Tri Thức
 * Tác giả Đinh Thành, ĐT: 0915.213717 - Trường THCS (Zalo: 0915.213717)
 */

export interface THCS8MonExamData {
  subjectId: string;
  subjectName: string;
  grade: string;
  termCode: string;
  termTitle: string;
  examCode: string;
  timeMinutes: number;
  schoolYear: string;
  parentAgency: string;
  schoolName: string;
  parts: {
    title: string;
    points: string;
    instruction?: string;
    passage?: string;
    questions: {
      num: string | number;
      content: string;
      options?: string[];
      correctKey?: string;
      points?: string;
    }[];
  }[];
  matrix: {
    headers: string[];
    rows: (string | number)[][];
  };
  specification: {
    headers: string[];
    rows: (string | number)[][];
  };
  answerGuide: {
    mcqAnswers: { q: number; ans: string }[];
    essayGuide: { question: string; step: string; point: string }[];
  };
}

// Hàm chuẩn bị dữ liệu đề thi hoàn chỉnh cho từng môn học
export function getTHCS8MonExamSuite(
  subjectId: string,
  grade: string = '7',
  termCode: string = 'GK1',
  examCode: string = '701'
): THCS8MonExamData {
  const termTitleMap: Record<string, string> = {
    GK1: 'Giữa Học Kỳ I',
    CK1: 'Cuối Học Kỳ I',
    GK2: 'Giữa Học Kỳ II',
    CK2: 'Cuối Học Kỳ II'
  };

  const termTitle = termTitleMap[termCode] || 'Giữa Học Kỳ I';
  const schoolYear = '2026 - 2027';
  const parentAgency = 'PHÒNG GIÁO DỤC VÀ ĐÀO TẠO ....................';
  const schoolName = 'TRƯỜNG THCS ....................';

  switch (subjectId) {
    case 'TOAN':
      return {
        subjectId: 'TOAN',
        subjectName: 'Toán học',
        grade,
        termCode,
        termTitle,
        examCode,
        timeMinutes: 90,
        schoolYear,
        parentAgency,
        schoolName,
        parts: [
          {
            title: 'PHẦN I. TRẮC NGHIỆM KHÁCH QUAN',
            points: '3,0 điểm',
            instruction: 'Khoanh tròn vào chữ cái A, B, C hoặc D đứng trước câu trả lời đúng (Mỗi câu đúng được 0,25 điểm):',
            questions: [
              {
                num: 1,
                content: 'Kết quả của phép tính 15 + 45 : 3² bằng bao nhiêu?',
                options: ['A. 20', 'B. 20 (Đúng)', 'C. 18', 'D. 25'],
                correctKey: 'B'
              },
              {
                num: 2,
                content: 'Trong các hình sau, hình nào có trục đối xứng?',
                options: ['A. Hình bình hành', 'B. Hình thang cân', 'C. Tam giác thường', 'D. Hình chữ nhật lệch'],
                correctKey: 'B'
              },
              {
                num: 3,
                content: 'Số đối của số hữu tỉ -3/5 là:',
                options: ['A. 3/5', 'B. -5/3', 'C. 5/3', 'D. -3/5'],
                correctKey: 'A'
              },
              {
                num: 4,
                content: 'Giá trị của biểu thức (-0,5)³ bằng:',
                options: ['A. -1,25', 'B. -0,125', 'C. 0,125', 'D. 0,25'],
                correctKey: 'B'
              },
              {
                num: 5,
                content: 'Nếu một đường thẳng cắt hai đường thẳng song song thì hai góc so le trong:',
                options: ['A. Kề bù', 'B. Bằng nhau', 'C. Bù nhau', 'D. Phụ nhau'],
                correctKey: 'B'
              },
              {
                num: 6,
                content: 'Cho tam giác ABC có góc A = 60°, góc B = 70°. Số đo của góc C bằng:',
                options: ['A. 50°', 'B. 60°', 'C. 70°', 'D. 80°'],
                correctKey: 'A'
              },
              {
                num: 7,
                content: 'Căn bậc hai số học của số 49 là:',
                options: ['A. 7 và -7', 'B. 7', 'C. -7', 'D. 2401'],
                correctKey: 'B'
              },
              {
                num: 8,
                content: 'Tập hợp các số thực được kí hiệu là:',
                options: ['A. N', 'B. Z', 'C. Q', 'D. R'],
                correctKey: 'D'
              },
              {
                num: 9,
                content: 'Hình lăng trụ đứng tam giác có bao nhiêu mặt bên?',
                options: ['A. 3 mặt', 'B. 4 mặt', 'C. 5 mặt', 'D. 2 mặt'],
                correctKey: 'A'
              },
              {
                num: 10,
                content: 'Thể tích của hình hộp chữ nhật có ba kích thước a, b, c được tính bởi công thức:',
                options: ['A. V = a + b + c', 'B. V = 2(a + b)c', 'C. V = a.b.c', 'D. V = 1/3 a.b.c'],
                correctKey: 'C'
              },
              {
                num: 11,
                content: 'Biểu đồ đoạn thẳng thích hợp dùng để biểu diễn:',
                options: ['A. Tỉ lệ %', 'B. Sự biến đổi của đại lượng theo thời gian', 'C. Số lượng rời rạc', 'D. Phân loại màu sắc'],
                correctKey: 'B'
              },
              {
                num: 12,
                content: 'Kết quả làm tròn số 3,14159 đến chữ số thập phân thứ hai là:',
                options: ['A. 3,14', 'B. 3,15', 'C. 3,1', 'D. 3,142'],
                correctKey: 'A'
              }
            ]
          },
          {
            title: 'PHẦN II. TỰ LUẬN',
            points: '7,0 điểm',
            questions: [
              {
                num: 'Bài 1',
                points: '1,5 điểm',
                content: 'Thực hiện phép tính hợp lí:\n' +
                         'a) A = 37 . 64 + 37 . 36 - 1200\n' +
                         'b) B = 3/4 + (-1/2) : 2/3 - (1/2)²'
              },
              {
                num: 'Bài 2',
                points: '1,5 điểm',
                content: 'Tìm x biết:\n' +
                         'a) 3x - 14 = 2² . 5\n' +
                         'b) |x - 1/2| - 3/4 = 0'
              },
              {
                num: 'Bài 3',
                points: '1,5 điểm',
                content: 'Một mảnh vườn hình chữ nhật có chiều dài 20m, chiều rộng 15m. Người ta dành 25% diện tích vườn để trồng hoa cúc, phần còn lại trồng cây cảnh.\n' +
                         'a) Tính diện tích toàn bộ mảnh vườn.\n' +
                         'b) Tính diện tích trồng cây cảnh.'
              },
              {
                num: 'Bài 4',
                points: '2,0 điểm',
                content: 'Cho tam giác ABC nhọn. Tia phân giác của góc A cắt cạnh BC tại D. Trên cạnh AC lấy điểm E sao cho AE = AB.\n' +
                         'a) Chứng minh: Tam giác ABD = Tam giác AED.\n' +
                         'b) Chứng minh: AD vuông góc với BE.'
              },
              {
                num: 'Bài 5',
                points: '0,5 điểm',
                content: 'Cho biểu thức S = 1/2² + 1/3² + 1/4² + ... + 1/2026². Chứng minh rằng S < 1.'
              }
            ]
          }
        ],
        matrix: {
          headers: ['TT', 'Chủ đề / Đơn vị kiến thức', 'Nhận biết (TN/TL)', 'Thông hiểu (TN/TL)', 'Vận dụng (TN/TL)', 'Vận dụng cao (TL)', 'Tổng số câu', 'Tổng điểm', 'Tỉ lệ %'],
          rows: [
            ['1', 'Số hữu tỉ & Các phép tính', '2 TN', '2 TN + 1 TL', '1 TL', '1 TL', '7 câu', '3,5 điểm', '35%'],
            ['2', 'Số thực & Tỉ lệ thức', '2 TN', '2 TN', '1 TL', '0', '5 câu', '2,0 điểm', '20%'],
            ['3', 'Hình học trực quan & Góc, Đường thẳng', '2 TN', '2 TN + 1 TL', '1 TL', '0', '6 câu', '3,5 điểm', '35%'],
            ['4', 'Một số yếu tố Thống kê & Xác suất', '1 TN', '1 TN', '0', '0', '2 câu', '1,0 điểm', '10%'],
            ['TỔNG', 'Tổng cộng 4 mức độ nhận thức', '7 TN (1,75đ)', '5 TN + 2 TL (3,25đ)', '3 TL (4,5đ)', '1 TL (0,5đ)', '20 câu', '10,0 điểm', '100%']
          ]
        },
        specification: {
          headers: ['TT', 'Nội dung kiến thức', 'Đơn vị kiến thức', 'Yêu cầu cần đạt', 'Số câu hỏi theo mức độ (NB - TH - VD - VDC)'],
          rows: [
            ['1', 'Số hữu tỉ', 'Phép toán số hữu tỉ', 'Nhận biết số hữu tỉ, tính toán cộng trừ nhân chia đúng thứ tự', 'Câu 1, 3 (NB); Câu 4, Bài 1a (TH); Bài 1b, Bài 2 (VD)'],
            ['2', 'Số thực', 'Căn bậc hai số học, làm tròn', 'Nhận biết căn bậc hai số học, làm tròn số đúng quy tắc', 'Câu 7, 8 (NB); Câu 12 (TH); Bài 2b (VD)'],
            ['3', 'Hình học', 'Hình hộp chữ nhật, tam giác bằng nhau', 'Nhận dạng hình hộp, chứng minh hai tam giác bằng nhau', 'Câu 2, 9, 10 (NB); Câu 5, 6 (TH); Bài 4a, 4b (VD)'],
            ['4', 'Nâng cao', 'Bất đẳng thức dãy phân số', 'Vận dụng kỹ năng đánh giá tổng dãy số', 'Bài 5 (VDC)']
          ]
        },
        answerGuide: {
          mcqAnswers: [
            { q: 1, ans: 'B' }, { q: 2, ans: 'B' }, { q: 3, ans: 'A' }, { q: 4, ans: 'B' },
            { q: 5, ans: 'B' }, { q: 6, ans: 'A' }, { q: 7, ans: 'B' }, { q: 8, ans: 'D' },
            { q: 9, ans: 'A' }, { q: 10, ans: 'C' }, { q: 11, ans: 'B' }, { q: 12, ans: 'A' }
          ],
          essayGuide: [
            { question: 'Bài 1a', step: 'A = 37.(64 + 36) - 1200 = 37.100 - 1200 = 3700 - 1200 = 2500', point: '0,75 điểm' },
            { question: 'Bài 1b', step: 'B = 3/4 + (-1/2 . 3/2) - 1/4 = 3/4 - 3/4 - 1/4 = -1/4', point: '0,75 điểm' },
            { question: 'Bài 2a', step: '3x - 14 = 4 . 5 = 20 => 3x = 34 => x = 34/3', point: '0,75 điểm' },
            { question: 'Bài 2b', step: '|x - 1/2| = 3/4 => x - 1/2 = 3/4 hoặc x - 1/2 = -3/4 => x = 5/4 hoặc x = -1/4', point: '0,75 điểm' },
            { question: 'Bài 3a', step: 'Diện tích mảnh vườn: S = 20 . 15 = 300 (m²)', point: '0,75 điểm' },
            { question: 'Bài 3b', step: 'Diện tích trồng cây cảnh: 300 . (100% - 25%) = 300 . 75% = 225 (m²)', point: '0,75 điểm' },
            { question: 'Bài 4a', step: 'Xét tam giác ABD và AED: AB = AE (gt), góc BAD = EAD (phân giác), AD chung => Tam giác ABD = Tam giác AED (c-g-c)', point: '1,25 điểm' },
            { question: 'Bài 4b', step: 'Gọi I là giao của AD và BE. Chứng minh tam giác ABI = AEI => góc AIB = AIE = 90° => AD vuông góc BE', point: '0,75 điểm' },
            { question: 'Bài 5', step: 'Ta có 1/n² < 1/(n-1).n. Khi đó S < 1/1.2 + 1/2.3 + ... = 1 - 1/2026 < 1 (đpcm)', point: '0,50 điểm' }
          ]
        }
      };

    case 'VAN':
      return {
        subjectId: 'VAN',
        subjectName: 'Ngữ văn',
        grade,
        termCode,
        termTitle,
        examCode,
        timeMinutes: 90,
        schoolYear,
        parentAgency,
        schoolName,
        parts: [
          {
            title: 'I. ĐỌC HIỂU',
            points: '6,0 điểm',
            instruction: 'Đọc kĩ đoạn trích sau và trả lời các câu hỏi bên dưới:',
            passage: '“Quê hương là chùm khế ngọt\n' +
                     'Cho con trèo hái mỗi ngày\n' +
                     'Quê hương là đường đi học\n' +
                     'Con về rợp bướm vàng bay\n\n' +
                     'Quê hương là con diều biếc\n' +
                     'Tuổi thơ con thả trên đồng\n' +
                     'Quê hương là con đò nhỏ\n' +
                     'Êm đềm khua nước ven sông...”\n' +
                     '(Trích Quê hương – Đỗ Trung Quân)',
            questions: [
              {
                num: 1,
                content: 'Đoạn trích trên được viết theo thể thơ nào?',
                options: ['A. Thơ tự do', 'B. Thơ lục bát', 'C. Thơ sáu chữ', 'D. Thơ năm chữ'],
                correctKey: 'C'
              },
              {
                num: 2,
                content: 'Biện pháp tu từ nào được sử dụng nổi bật xuyên suốt các khổ thơ trên?',
                options: ['A. Ẩn dụ và đảo ngữ', 'B. So sánh và điệp ngữ', 'C. Hoán dụ và nói quá', 'D. Nhân hóa và nói giảm'],
                correctKey: 'B'
              },
              {
                num: 3,
                content: 'Hình ảnh “chùm khế ngọt”, “con diều biếc”, “con đò nhỏ” gợi nhớ đến điều gì?',
                options: ['A. Sự xa hoa, hiện đại', 'B. Kỉ niệm tuổi thơ bình dị, thân thương', 'C. Nỗi buồn biệt ly', 'D. Sự nhọc nhằn của người nông dân'],
                correctKey: 'B'
              },
              {
                num: 4,
                content: 'Từ “Êm đềm” trong câu thơ “Êm đềm khua nước ven sông” thuộc từ loại nào?',
                options: ['A. Từ đơn', 'B. Từ ghép đẳng lập', 'C. Từ láy tượng hình/tượng thanh', 'D. Đại từ'],
                correctKey: 'C'
              },
              {
                num: 5,
                content: 'Phương thức biểu đạt chính của đoạn trích là gì?',
                options: ['A. Biểu cảm', 'B. Tự sự', 'C. Nghị luận', 'D. Thuyết minh'],
                correctKey: 'A'
              },
              {
                num: 6,
                content: 'Tác giả định nghĩa quê hương bằng những hình ảnh gắn liền với đối tượng nào?',
                options: ['A. Người trưởng thành bôn ba', 'B. Tuổi thơ hồn nhiên của mỗi con người', 'C. Những chuyến đò du lịch', 'D. Cảnh sắc thành thị hoa lệ'],
                correctKey: 'B'
              },
              {
                num: 7,
                content: 'Nêu cảm nhận của em về tình cảm của nhà thơ đối với quê hương qua đoạn trích trên? (Trả lời ngắn 3 - 5 dòng)',
                points: '1,5 điểm'
              },
              {
                num: 8,
                content: 'Từ đoạn trích, em rút ra được bài học và trách nhiệm gì của bản thân đối với quê hương đất nước? (Trả lời ngắn 4 - 6 dòng)',
                points: '1,5 điểm'
              }
            ]
          },
          {
            title: 'II. VIẾT',
            points: '4,0 điểm',
            questions: [
              {
                num: 'Đề bài',
                points: '4,0 điểm',
                content: 'Hãy viết một bài văn biểu cảm (khoảng 400 từ) bày tỏ cảm nghĩ chân thành của em về một người thầy, cô giáo đã để lại ấn tượng sâu sắc, dìu dắt em nên người.'
              }
            ]
          }
        ],
        matrix: {
          headers: ['TT', 'Kĩ năng', 'Nội dung kiến thức', 'Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao', 'Tổng điểm', 'Tỉ lệ %'],
          rows: [
            ['1', 'Đọc hiểu', 'Thơ hiện đại & Tiếng Việt', '3 câu TN (1,5đ)', '3 câu TN (1,5đ)', '2 câu TL (3,0đ)', '0', '6,0 điểm', '60%'],
            ['2', 'Viết', 'Bài văn biểu cảm về con người', '0', '0', 'Lập dàn ý (2,5đ)', 'Sáng tạo, sâu sắc (1,5đ)', '4,0 điểm', '40%'],
            ['TỔNG', 'Tổng cộng Đọc - Viết', '', '1,5 điểm (15%)', '1,5 điểm (15%)', '5,5 điểm (55%)', '1,5 điểm (15%)', '10,0 điểm', '100%']
          ]
        },
        specification: {
          headers: ['TT', 'Kĩ năng', 'Đơn vị kiến thức', 'Yêu cầu cần đạt', 'Số câu hỏi & Điểm'],
          rows: [
            ['1', 'Đọc hiểu', 'Thể loại thơ, BPTT', 'Nhận biết thể thơ 6 chữ, biện pháp so sánh điệp từ, từ láy', 'Câu 1, 2, 3, 4, 5, 6 (3,0 điểm)'],
            ['2', 'Đọc hiểu', 'Ý nghĩa biểu đạt & thông điệp', 'Hiểu tình yêu quê hương và liên hệ trách nhiệm tuổi trẻ', 'Câu 7, 8 (3,0 điểm)'],
            ['3', 'Tạo lập văn bản', 'Văn biểu cảm', 'Biết cách bộc lộ cảm xúc tự nhiên, kết hợp tự sự và miêu tả', 'Phần II (4,0 điểm)']
          ]
        },
        answerGuide: {
          mcqAnswers: [
            { q: 1, ans: 'C' }, { q: 2, ans: 'B' }, { q: 3, ans: 'B' },
            { q: 4, ans: 'C' }, { q: 5, ans: 'A' }, { q: 6, ans: 'B' }
          ],
          essayGuide: [
            { question: 'Câu 7 (1,5đ)', step: 'Nhà thơ dành tình cảm tha thiết, gắn bó, trân trọng những gì bình dị nhất của quê hương; thể hiện nỗi nhớ da diết và lòng biết ơn nguồn cội.', point: '1,50 điểm' },
            { question: 'Câu 8 (1,5đ)', step: 'Bài học: Yêu quý mảnh đất quê nhà; chăm ngoan học giỏi, giữ gìn môi trường văn hóa, đóng góp công sức xây dựng quê hương giàu đẹp.', point: '1,50 điểm' },
            { question: 'Phần II. Mở bài (0,5đ)', step: 'Giới thiệu người thầy/cô giáo và nêu ấn tượng chung sâu đậm nhất.', point: '0,50 điểm' },
            { question: 'Phần II. Thân bài (2,5đ)', step: 'Miêu tả nét nổi bật về giọng nói, nụ cười; kể lại kỷ niệm cảm động được thầy cô động viên; bày tỏ lòng kính trọng, biết ơn.', point: '2,50 điểm' },
            { question: 'Phần II. Kết bài (0,5đ)', step: 'Khẳng định tình cảm bền chặt, lời hứa phấn đấu học tập rèn luyện tốt.', point: '0,50 điểm' },
            { question: 'Phần II. Sáng tạo (0,5đ)', step: 'Hành văn trong sáng, giàu cảm xúc, có hình ảnh so sánh độc đáo.', point: '0,50 điểm' }
          ]
        }
      };

    case 'ENG':
      return {
        subjectId: 'ENG',
        subjectName: 'Tiếng Anh',
        grade,
        termCode,
        termTitle,
        examCode,
        timeMinutes: 60,
        schoolYear,
        parentAgency,
        schoolName,
        parts: [
          {
            title: 'PART 1. LISTENING',
            points: '2.0 points',
            instruction: 'Listen to the recording and choose the correct answer A, B, C or D:',
            questions: [
              {
                num: 1,
                content: 'What time does the green science club meet every Thursday?',
                options: ['A. At 3:00 PM', 'B. At 3:30 PM', 'C. At 4:00 PM', 'D. At 4:30 PM'],
                correctKey: 'B'
              },
              {
                num: 2,
                content: 'Where are the students planning to plant new trees?',
                options: ['A. Behind the school gym', 'B. In the botanical garden', 'C. In the central park', 'D. Around the playground'],
                correctKey: 'A'
              },
              {
                num: 3,
                content: 'How many members joined the voluntary project last week?',
                options: ['A. 15 members', 'B. 35 members', 'C. 25 members', 'D. 50 members'],
                correctKey: 'C'
              },
              {
                num: 4,
                content: 'What should students bring with them to the workshop?',
                options: ['A. Notebooks and pens', 'B. Old plastic bags', 'C. Laptops', 'D. Reusable water bottles'],
                correctKey: 'D'
              }
            ]
          },
          {
            title: 'PART 2. LANGUAGE FOCUS',
            points: '2.0 points',
            instruction: 'Circle the letter A, B, C or D to complete each sentence:',
            questions: [
              {
                num: 5,
                content: 'My brother is very interested in ________ renewable energy projects.',
                options: ['A. develop', 'B. to develop', 'C. developing', 'D. developed'],
                correctKey: 'C'
              },
              {
                num: 6,
                content: 'Choose the word whose underlined part is pronounced differently:',
                options: ['A. watched', 'B. stopped', 'C. decided', 'D. looked'],
                correctKey: 'C'
              },
              {
                num: 7,
                content: 'If you want to stay healthy, you ________ eat more fresh vegetables and drink water.',
                options: ['A. should', 'B. shouldn’t', 'C. might not', 'D. couldn’t'],
                correctKey: 'A'
              },
              {
                num: 8,
                content: 'Hoa Lan is one of the ________ girls in our secondary school.',
                options: ['A. intelligent', 'B. more intelligent', 'C. most intelligent', 'D. as intelligent'],
                correctKey: 'C'
              }
            ]
          },
          {
            title: 'PART 3. READING',
            points: '2.0 points',
            instruction: 'Read the passage and choose the best answer:',
            passage: 'Community service is very popular among secondary school students in Vietnam nowadays. By joining environmental clubs, pupils can collect litter around the neighbourhood, plant trees, and sort recyclable waste. These voluntary activities not only help keep our living environment clean and green, but also teach teenagers vital life skills such as teamwork, empathy, and responsibility.',
            questions: [
              {
                num: 9,
                content: 'What is the main topic of the passage?',
                options: ['A. Playing sports', 'B. Community service for students', 'C. School subjects', 'D. Exam stress'],
                correctKey: 'B'
              },
              {
                num: 10,
                content: 'Which activity is NOT mentioned in the text?',
                options: ['A. Planting trees', 'B. Collecting litter', 'C. Sorting waste', 'D. Selling books'],
                correctKey: 'D'
              },
              {
                num: 11,
                content: 'What life skills can teenagers learn from voluntary work?',
                options: ['A. Teamwork and empathy', 'B. Coding skills', 'C. Driving skills', 'D. Cooking food'],
                correctKey: 'A'
              },
              {
                num: 12,
                content: 'The word "vital" in the text is closest in meaning to:',
                options: ['A. useless', 'B. essential / important', 'C. boring', 'D. easy'],
                correctKey: 'B'
              }
            ]
          },
          {
            title: 'PART 4. WRITING',
            points: '2.0 points',
            instruction: 'Rewrite the following sentences or write a short paragraph:',
            questions: [
              {
                num: 13,
                content: 'I haven’t seen my primary school teacher for two years.\n-> The last time I __________________________________________________',
                points: '0.5 pt'
              },
              {
                num: 14,
                content: 'Because the weather was rainy, we cancelled our camping trip.\n-> Because of _____________________________________________________',
                points: '0.5 pt'
              },
              {
                num: 15,
                content: 'Write a short paragraph (60 - 80 words) about your favourite hobby and why you enjoy it.',
                points: '1.0 pt'
              }
            ]
          },
          {
            title: 'PART 5. SPEAKING TEST (EXAMINER’S SCRIPT)',
            points: '2.0 points',
            instruction: 'Standard 4-column speaking format according to MOET CV 7991:',
            questions: [
              {
                num: 'Phase 1',
                content: 'Introduction & Daily Routine (Warm-up, greetings, personal background)',
                points: '1.0 pt'
              },
              {
                num: 'Phase 2',
                content: 'Topic Presentation & Follow-up questions (Talk about school life / future green community)',
                points: '1.0 pt'
              }
            ]
          }
        ],
        matrix: {
          headers: ['Section', 'Content Area', 'Low (NB)', 'Mid (TH)', 'High (VD)', 'Very High (VDC)', 'Total Questions', 'Points', 'Weight'],
          rows: [
            ['Part 1', 'Listening Comprehension', '2 MCQs', '2 MCQs', '0', '0', '4 questions', '2.0 pts', '20%'],
            ['Part 2', 'Language Focus & Phonetics', '2 MCQs', '2 MCQs', '0', '0', '4 questions', '2.0 pts', '20%'],
            ['Part 3', 'Reading Comprehension', '1 MCQ', '2 MCQs', '1 MCQ', '0', '4 questions', '2.0 pts', '20%'],
            ['Part 4', 'Writing Skills & Sentence transformation', '0', '0', '2 sentences', '1 paragraph', '3 questions', '2.0 pts', '20%'],
            ['Part 5', 'Speaking Interview', 'Phase 1', 'Phase 1', 'Phase 2', 'Phase 2', 'Interview', '2.0 pts', '20%'],
            ['TOTAL', 'Complete Exam Suite', '5 MCQs (1.25p)', '6 MCQs (1.5p)', '3 tasks (2.25p)', 'Speaking (5.0p)', '15 tasks', '10.0 pts', '100%']
          ]
        },
        specification: {
          headers: ['TT', 'Skill', 'Competence', 'Performance Requirement', 'Items & Marks'],
          rows: [
            ['1', 'Listening', 'Global & Specific info', 'Identify numbers, locations, and schedules accurately', 'Q1 - Q4 (2.0 pts)'],
            ['2', 'Language', 'Grammar & Vocabulary', 'Master gerunds, comparisons, modals, and past tense', 'Q5 - Q8 (2.0 pts)'],
            ['3', 'Reading', 'Gist & Contextual vocabulary', 'Comprehend youth community service and social values', 'Q9 - Q12 (2.0 pts)'],
            ['4', 'Writing', 'Sentence transformation & Writing', 'Rewrite with present perfect and write short hobby essay', 'Q13 - Q15 (2.0 pts)'],
            ['5', 'Speaking', 'Spoken interaction & production', 'Fluent speech, good pronunciation, confident presentation', 'Part 5 (2.0 pts)']
          ]
        },
        answerGuide: {
          mcqAnswers: [
            { q: 1, ans: 'B' }, { q: 2, ans: 'A' }, { q: 3, ans: 'C' }, { q: 4, ans: 'D' },
            { q: 5, ans: 'C' }, { q: 6, ans: 'C' }, { q: 7, ans: 'A' }, { q: 8, ans: 'C' },
            { q: 9, ans: 'B' }, { q: 10, ans: 'D' }, { q: 11, ans: 'A' }, { q: 12, ans: 'B' }
          ],
          essayGuide: [
            { question: 'Question 13', step: 'The last time I saw my primary school teacher was two years ago.', point: '0.50 point' },
            { question: 'Question 14', step: 'Because of the rainy weather, we cancelled our camping trip.', point: '0.50 point' },
            { question: 'Question 15', step: 'Cohesive paragraph, correct grammatical structures, rich vocabulary on hobbies.', point: '1.00 point' },
            { question: 'Speaking Test', step: 'Fluent responses, proper intonation, accurate grammar, natural eye contact.', point: '2.00 points' }
          ]
        }
      };

    case 'KHTN':
      return {
        subjectId: 'KHTN',
        subjectName: 'Khoa học tự nhiên',
        grade,
        termCode,
        termTitle,
        examCode,
        timeMinutes: 90,
        schoolYear,
        parentAgency,
        schoolName,
        parts: [
          {
            title: 'PHẦN I. CÂU HỎI TRẮC NGHIỆM KHÁCH QUAN',
            points: '4,0 điểm',
            instruction: 'Khoanh tròn chữ cái đứng trước phương án trả lời đúng (16 câu, mỗi câu 0,25 điểm):',
            questions: [
              { num: 1, content: 'Đơn vị đo khối lượng nguyên tử trong hệ SI là:', options: ['A. gam (g)', 'B. amu', 'C. kilogam (kg)', 'D. miligam (mg)'], correctKey: 'B' },
              { num: 2, content: 'Kí hiệu hóa học của nguyên tố Sodium (Natri) là:', options: ['A. S', 'B. Na', 'C. N', 'D. So'], correctKey: 'B' },
              { num: 3, content: 'Bảng tuần hoàn các nguyên tố hóa học hiện nay được sắp xếp theo chiều tăng dần của:', options: ['A. Khối lượng nguyên tử', 'B. Điện tích hạt nhân', 'C. Bán kính nguyên tử', 'D. Số electron lớp ngoài cùng'], correctKey: 'B' },
              { num: 4, content: 'Chất nào sau đây là hợp chất ion?', options: ['A. Khí oxygen (O₂)', 'B. Nước cất (H₂O)', 'C. Muối ăn (NaCl)', 'D. Khí carbon dioxide (CO₂)'], correctKey: 'C' },
              { num: 5, content: 'Tốc độ chuyển động của một vật cho ta biết:', options: ['A. Quãng đường vật đi được', 'B. Hướng chuyển động của vật', 'C. Mức độ nhanh hay chậm của chuyển động', 'D. Lực tác dụng lên vật'], correctKey: 'C' },
              { num: 6, content: 'Công thức tính tốc độ chuyển động là:', options: ['A. v = s . t', 'B. v = s / t', 'C. v = t / s', 'D. v = s + t'], correctKey: 'B' },
              { num: 7, content: 'Đồ thị quãng đường - thời gian của một vật chuyển động thẳng đều là:', options: ['A. Một đường cong parabol', 'B. Một đường thẳng xiên góc', 'C. Một đường tròn', 'D. Một đường ziczac'], correctKey: 'B' },
              { num: 8, content: 'Âm thanh không thể truyền qua môi trường nào sau đây?', options: ['A. Chất rắn', 'B. Chất lỏng', 'C. Chất khí', 'D. Chân không'], correctKey: 'D' },
              { num: 9, content: 'Quá trình quang hợp ở thực vật diễn ra chủ yếu ở bào quan nào?', options: ['A. Ti thể', 'B. Lục lạp', 'C. Nhân tế bào', 'D. Không bào'], correctKey: 'B' },
              { num: 10, content: 'Sản phẩm của quá trình quang hợp ở cây xanh gồm có:', options: ['A. Nước và khí Carbon dioxide', 'B. Glucose và khí Oxygen', 'C. Khí Nitrogen và Nước', 'D. Tinh bột và khí Hydrogen'], correctKey: 'B' },
              { num: 11, content: 'Hô hấp tế bào là quá trình phân giải chất hữu cơ giải phóng năng lượng dưới dạng:', options: ['A. ATP và nhiệt năng', 'B. Quang năng', 'C. Cơ năng thuần túy', 'D. Hóa năng tích lũy'], correctKey: 'A' },
              { num: 12, content: 'Cơ quan hô hấp chủ yếu của động vật có xương sống trên cạn là:', options: ['A. Mang', 'B. Phổi', 'C. Da', 'D. Ống khí'], correctKey: 'B' },
              { num: 13, content: 'Hiện tượng phản xạ ánh sáng tuân theo định luật:', options: ['A. Góc phản xạ bằng góc tới', 'B. Góc phản xạ lớn hơn góc tới', 'C. Góc phản xạ nhỏ hơn góc tới', 'D. Không phụ thuộc góc tới'], correctKey: 'A' },
              { num: 14, content: 'Từ trường tồn tại xung quanh:', options: ['A. Điện tích đứng yên', 'B. Dây dẫn có dòng điện chạy qua', 'C. Thanh thủy tinh cọ xát', 'D. Vật bằng nhựa'], correctKey: 'B' },
              { num: 15, content: 'Vai trò của nước đối với cơ thể sống là:', options: ['A. Là dung môi hòa tan và vận chuyển các chất', 'B. Cung cấp nguyên tố kim loại nặng', 'C. Tạo ra năng lượng cơ giới', 'D. Thay thế chất đạm'], correctKey: 'A' },
              { num: 16, content: 'Để bảo vệ nguồn nước ngọt sạch, hành động nào sau đây là đúng?', options: ['A. Xả rác thải bừa bãi ven sông', 'B. Tiết kiệm nước và xử lý nước thải trước khi thải ra môi trường', 'C. Dùng phân hóa học quá liều', 'D. Chôn rác pin gần giếng nước'], correctKey: 'B' }
            ]
          },
          {
            title: 'PHẦN II. TỰ LUẬN THỰC TIỄN',
            points: '6,0 điểm',
            questions: [
              {
                num: 'Câu 17',
                points: '2,0 điểm',
                content: 'a) Nêu khái niệm và viết phương trình chữ của quá trình quang hợp ở cây xanh.\n' +
                         'b) Vì sao khi nuôi cá cảnh trong bể kính kín người ta thường thả thêm một số cành rong đuôi chó hoặc lắp máy sục khí nhẹ?'
              },
              {
                num: 'Câu 18',
                points: '2,5 điểm',
                content: 'Một ô tô khởi hành từ trạm lúc 7 giờ sáng và đến điểm đích cách đó 90 km lúc 8 giờ 30 phút cùng ngày.\n' +
                         'a) Tính thời gian chuyển động và tốc độ trung bình của ô tô theo đơn vị km/h và m/s.\n' +
                         'b) Khi xe đang chạy với tốc độ cao, nếu gặp chướng ngại vật người lái xe phanh gấp thì hành khách trên xe sẽ bị ngả về phía nào? Giải thích vì sao.'
              },
              {
                num: 'Câu 19',
                points: '1,5 điểm',
                content: 'Nguyên tử nguyên tố X có tổng số hạt proton, neutron và electron là 40 hạt. Trong đó số hạt mang điện nhiều hơn số hạt không mang điện là 12 hạt.\n' +
                         'a) Xác định số lượng từng loại hạt (p, n, e) của nguyên tử X.\n' +
                         'b) Cho biết tên gọi và kí hiệu hóa học của nguyên tố X.'
              }
            ]
          }
        ],
        matrix: {
          headers: ['Mạch nội dung KHTN', 'Đơn vị kiến thức', 'Nhận biết (TN)', 'Thông hiểu (TN/TL)', 'Vận dụng (TL)', 'Vận dụng cao (TL)', 'Tổng số câu', 'Tổng điểm', 'Tỉ lệ %'],
          rows: [
            ['Chất & Sự biến đổi (Hóa học)', 'Nguyên tử, BTH, Liên kết hóa học', '3 TN', '1 TN + 1 TL', '1 TL', '0', '6 câu', '3,5 điểm', '35%'],
            ['Năng lượng & Biến đổi (Vật lí)', 'Tốc độ, Âm thanh, Ánh sáng, Từ', '3 TN', '2 TN + 1 TL', '1 TL', '0', '7 câu', '3,5 điểm', '35%'],
            ['Vật sống (Sinh học)', 'Quang hợp, Hô hấp, Nước & Đời sống', '2 TN', '2 TN + 1 TL', '0', '0', '5 câu', '3,0 điểm', '30%'],
            ['TỔNG', 'Toàn bộ chương trình KHTN', '8 TN (2,0đ)', '5 TN + 1 TL (3,0đ)', '3 TN + 2 TL (4,0đ)', '1 TL (1,0đ)', '19 câu', '10,0 điểm', '100%']
          ]
        },
        specification: {
          headers: ['TT', 'Mạch kiến thức', 'Yêu cầu cần đạt', 'Hình thức & Mã câu hỏi', 'Điểm'],
          rows: [
            ['1', 'Hóa học', 'Hiểu cấu tạo nguyên tử, tính số hạt p, n, e và lập luận hóa học', 'Câu 1, 2, 3, 4, Câu 19', '3,5 điểm'],
            ['2', 'Vật lí', 'Tính tốc độ v = s/t, giải thích quán tính và hiện tượng âm - từ', 'Câu 5, 6, 7, 8, 13, 14, Câu 18', '3,5 điểm'],
            ['3', 'Sinh học', 'Nắm bản chất quang hợp, hô hấp, ứng dụng nuôi trồng thực tế', 'Câu 9, 10, 11, 12, 15, 16, Câu 17', '3,0 điểm']
          ]
        },
        answerGuide: {
          mcqAnswers: [
            { q: 1, ans: 'B' }, { q: 2, ans: 'B' }, { q: 3, ans: 'B' }, { q: 4, ans: 'C' },
            { q: 5, ans: 'C' }, { q: 6, ans: 'B' }, { q: 7, ans: 'B' }, { q: 8, ans: 'D' },
            { q: 9, ans: 'B' }, { q: 10, ans: 'B' }, { q: 11, ans: 'A' }, { q: 12, ans: 'B' },
            { q: 13, ans: 'A' }, { q: 14, ans: 'B' }, { q: 15, ans: 'A' }, { q: 16, ans: 'B' }
          ],
          essayGuide: [
            { question: 'Câu 17a', step: 'Quang hợp là quá trình lá cây hấp thụ ánh sáng mặt trời để tổng hợp chất hữu cơ. PT: Nước + Carbon dioxide -> Glucose + Oxygen', point: '1,00 điểm' },
            { question: 'Câu 17b', step: 'Rong quang hợp thải khí Oxygen hòa tan vào nước giúp cá hô hấp tốt hơn, tránh ngạt khí.', point: '1,00 điểm' },
            { question: 'Câu 18a', step: 'Thời gian: t = 8h30 - 7h00 = 1,5 giờ. Tốc độ v = s/t = 90 / 1,5 = 60 km/h = 16,67 m/s', point: '1,50 điểm' },
            { question: 'Câu 18b', step: 'Hành khách bị ngả người về phía trước. Giải thích do quán tính: khi xe dừng đột ngột, thân người vẫn theo đà chuyển động về phía trước.', point: '1,00 điểm' },
            { question: 'Câu 19a', step: 'Có 2p + n = 40 và 2p - n = 12 => 4p = 52 => p = e = 13; n = 40 - 26 = 14 hạt.', point: '1,00 điểm' },
            { question: 'Câu 19b', step: 'Nguyên tố có Z = 13 là Nhôm (Aluminium), kí hiệu hóa học: Al.', point: '0,50 điểm' }
          ]
        }
      };

    case 'SUDIA':
      return {
        subjectId: 'SUDIA',
        subjectName: 'Lịch sử và Địa lí',
        grade,
        termCode,
        termTitle,
        examCode,
        timeMinutes: 60,
        schoolYear,
        parentAgency,
        schoolName,
        parts: [
          {
            title: 'PHÂN MÔN LỊCH SỬ',
            points: '5,0 điểm',
            instruction: 'A. Trắc nghiệm (2,0 điểm) & B. Tự luận (3,0 điểm):',
            questions: [
              { num: 1, content: 'Phong trào Văn hóa Phục hưng bùng nổ đầu tiên ở quốc gia nào?', options: ['A. Anh', 'B. Pháp', 'C. I-ta-li-a (Ý)', 'D. Đức'], correctKey: 'C' },
              { num: 2, content: 'Giai cấp mới nào được hình thành trong xã hội phong kiến Tây Âu?', options: ['A. Quý tộc và Nông nô', 'B. Tư sản và Vô sản', 'C. Địa chủ và Nông dân', 'D. Nô lệ và Chủ nô'], correctKey: 'B' },
              { num: 3, content: 'Tác phẩm kịch nổi tiếng "Rô-mê-ô và Giu-li-ét" là của danh nhân văn hóa nào?', options: ['A. Đê-các-tơ', 'B. Sếch-xpia', 'C. Lê-ô-na đơ Vanh-xi', 'D. Mi-ken-lăng-giơ'], correctKey: 'B' },
              { num: 4, content: 'Triều đại phong kiến đầu tiên xác lập quyền độc lập tự chủ lâu dài của dân tộc ta là:', options: ['A. Nhà Ngô', 'B. Nhà Đinh', 'C. Nhà Tiền Lê', 'D. Nhà Lý'], correctKey: 'A' },
              {
                num: 'Câu 5 (Lịch sử)',
                points: '3,0 điểm',
                content: 'Trình bày nguyên nhân, diễn biến chính và ý nghĩa lịch sử sâu sắc của chiến thắng Bạch Đằng năm 938 do Ngô Quyền lãnh đạo.'
              }
            ]
          },
          {
            title: 'PHÂN MÔN ĐỊA LÍ',
            points: '5,0 điểm',
            instruction: 'A. Trắc nghiệm (2,0 điểm) & B. Tự luận (3,0 điểm):',
            questions: [
              { num: 6, content: 'Châu Âu tiếp giáp với đại dương nào ở phía Tây?', options: ['A. Thái Bình Dương', 'B. Đại Tây Dương', 'C. Ấn Độ Dương', 'D. Bắc Băng Dương'], correctKey: 'B' },
              { num: 7, content: 'Đặc điểm địa hình chủ yếu của châu Âu là:', options: ['A. Đồng bằng chiếm 2/3 diện tích', 'B. Núi cao chiếm đa số', 'C. Hoang mạc cát rộng lớn', 'D. Cao nguyên băng giá'], correctKey: 'A' },
              { num: 8, content: 'Khí hậu châu Âu có đặc điểm nổi bật là chịu ảnh hưởng mạnh mẽ của:', options: ['A. Gió mùa châu Á', 'B. Dòng biển nóng Bắc Đại Tây Dương và gió Tây ôn đới', 'C. Gió tín phong xích đạo', 'D. Bão nhiệt đới'], correctKey: 'B' },
              { num: 9, content: 'Cơ cấu dân số châu Âu hiện nay mang đặc điểm nào nổi bật?', options: ['A. Cơ cấu dân số rất trẻ', 'B. Cơ cấu dân số già', 'C. Tỉ lệ sinh tăng vọt', 'D. Tỉ lệ tử vong cao nhất'], correctKey: 'B' },
              {
                num: 'Câu 10 (Địa lí)',
                points: '3,0 điểm',
                content: 'Phân tích các giải pháp bảo vệ môi trường không khí và nguồn nước đang được các quốc gia châu Âu áp dụng thành công hiện nay.'
              }
            ]
          }
        ],
        matrix: {
          headers: ['Phân môn', 'Nội dung kiến thức', 'Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao', 'Tổng điểm', 'Tỉ lệ %'],
          rows: [
            ['Lịch sử (50%)', 'Tây Âu trung đại & Lịch sử Việt Nam', '4 TN (1,0đ)', '4 TN (1,0đ)', '1 TL (2,0đ)', '1 TL (1,0đ)', '5,0 điểm', '50%'],
            ['Địa lí (50%)', 'Tự nhiên & Dân cư Châu Âu', '4 TN (1,0đ)', '4 TN (1,0đ)', '1 TL (2,0đ)', '1 TL (1,0đ)', '5,0 điểm', '50%'],
            ['TỔNG', 'Lịch sử 5.0đ + Địa lí 5.0đ', '2,0 điểm (20%)', '2,0 điểm (20%)', '4,0 điểm (40%)', '2,0 điểm (20%)', '10,0 điểm', '100%']
          ]
        },
        specification: {
          headers: ['TT', 'Phân môn', 'Đơn vị kiến thức', 'Yêu cầu cần đạt', 'Câu hỏi & Điểm'],
          rows: [
            ['1', 'Lịch sử', 'Phong trào Văn hóa Phục hưng', 'Nêu bối cảnh, tác giả, tác phẩm tiêu biểu', 'Câu 1, 2, 3 (1,5 điểm)'],
            ['2', 'Lịch sử', 'Chiến thắng Bạch Đằng 938', 'Phân tích tài nghệ quân sự của Ngô Quyền và ý nghĩa chấm dứt 1000 năm Bắc thuộc', 'Câu 4, Câu 5 (3,5 điểm)'],
            ['3', 'Địa lí', 'Đặc điểm tự nhiên & dân cư châu Âu', 'Nhận biết ranh giới, địa hình, cơ cấu già hóa dân số', 'Câu 6, 7, 8, 9 (2,0 điểm)'],
            ['4', 'Địa lí', 'Bảo vệ môi trường', 'Phân tích năng lượng xanh, kinh tế tuần hoàn ở châu Âu', 'Câu 10 (3,0 điểm)']
          ]
        },
        answerGuide: {
          mcqAnswers: [
            { q: 1, ans: 'C' }, { q: 2, ans: 'B' }, { q: 3, ans: 'B' }, { q: 4, ans: 'A' },
            { q: 6, ans: 'B' }, { q: 7, ans: 'A' }, { q: 8, ans: 'B' }, { q: 9, ans: 'B' }
          ],
          essayGuide: [
            { question: 'Câu 5 Lịch sử (3,0đ)', step: 'Kế sách cắm cọc gỗ vạt nhọn bịt sắt; lợi dụng thủy triều lên nhử địch vào bãi cọc; khi triều rút phản công tiêu diệt quân Nam Hán; Ý nghĩa: chấm dứt vĩnh viễn thời kỳ Bắc thuộc, mở ra kỷ nguyên độc lập.', point: '3,00 điểm' },
            { question: 'Câu 10 Địa lí (3,0đ)', step: 'Giải pháp: Phát triển năng lượng tái tạo (điện gió, mặt trời), đánh thuế carbon, sử dụng xe điện, xử lý nước thải công nghiệp khép kín, bảo tồn rừng tự nhiên.', point: '3,00 điểm' }
          ]
        }
      };

    case 'TIN':
      return {
        subjectId: 'TIN',
        subjectName: 'Tin học',
        grade,
        termCode,
        termTitle,
        examCode,
        timeMinutes: 45,
        schoolYear,
        parentAgency,
        schoolName,
        parts: [
          {
            title: 'PHẦN I. TRẮC NGHIỆM KHÁCH QUAN',
            points: '4,0 điểm',
            instruction: 'Khoanh tròn vào phương án đúng (16 câu, mỗi câu 0,25 điểm):',
            questions: [
              { num: 1, content: 'Thiết bị nào sau đây là thiết bị vào (Input device) của máy tính?', options: ['A. Màn hình', 'B. Bàn phím', 'C. Máy in', 'D. Loa'], correctKey: 'B' },
              { num: 2, content: 'Hệ điều hành phổ biến nhất trên máy tính cá nhân hiện nay là:', options: ['A. Windows', 'B. Microsoft Word', 'C. Google Chrome', 'D. Python'], correctKey: 'A' },
              { num: 3, content: 'Để lưu tệp văn bản trong MS Word, ta sử dụng tổ hợp phím nào?', options: ['A. Ctrl + C', 'B. Ctrl + S', 'C. Ctrl + V', 'D. Ctrl + P'], correctKey: 'B' },
              { num: 4, content: 'Trong bảng tính Excel, địa chỉ của ô nằm ở cột B, dòng 5 là:', options: ['A. 5B', 'B. B5', 'C. $5$B', 'D. B:5'], correctKey: 'B' },
              { num: 5, content: 'Hàm nào trong Excel dùng để tính trung bình cộng của một dãy số?', options: ['A. =SUM()', 'B. =AVERAGE()', 'C. =MAX()', 'D. =COUNT()'], correctKey: 'B' },
              { num: 6, content: 'Địa chỉ tuyệt đối trong bảng tính Excel có đặc điểm là:', options: ['A. Có dấu $ trước tên cột và chỉ số dòng', 'B. Có dấu # bao quanh', 'C. Không thay đổi tên', 'D. Có dấu %'], correctKey: 'A' },
              { num: 7, content: 'Để tạo một bài trình chiếu ấn tượng trong PowerPoint, ta nên:', options: ['A. Viết toàn bộ bài văn dài kín trang', 'B. Dùng từ khóa ngắn gọn, màu sắc hài hòa và hình ảnh minh họa', 'C. Dùng thật nhiều font chữ hoa văn', 'D. Để nền chữ trùng màu nền'], correctKey: 'B' },
              { num: 8, content: 'Mật khẩu nào sau đây là mật khẩu có tính bảo mật mạnh nhất?', options: ['A. 12345678', 'B. Thaydinhthanh2026@', 'C. abcxyz', 'D. password'], correctKey: 'B' },
              { num: 9, content: 'Hành vi nào sau đây vi phạm bản quyền và quy định pháp luật khi dùng Internet?', options: ['A. Trích dẫn tài liệu học tập có ghi rõ nguồn tác giả', 'B. Tải lậu phần mềm bẻ khóa và phát tán kiếm tiền', 'C. Gửi email học tập cho giáo viên', 'D. Tra cứu Wikipedia'], correctKey: 'B' },
              { num: 10, content: 'Trong ngôn ngữ lập trình Python, câu lệnh dùng để in dữ liệu ra màn hình là:', options: ['A. input()', 'B. print()', 'C. echo()', 'D. write()'], correctKey: 'B' },
              { num: 11, content: 'Trong Python, kết quả của phép tính `17 // 3` là:', options: ['A. 5.666', 'B. 5', 'C. 2', 'D. 14'], correctKey: 'B' },
              { num: 12, content: 'Kiểu dữ liệu của biến `x = 3.14` trong Python là:', options: ['A. int', 'B. float', 'C. str', 'D. bool'], correctKey: 'B' },
              { num: 13, content: 'Cấu trúc lặp với số lần biết trước trong Python dùng từ khóa:', options: ['A. if - else', 'B. for - in range()', 'C. while', 'D. switch - case'], correctKey: 'B' },
              { num: 14, content: 'Mạng máy tính kết nối các máy tính trong phạm vi một trường học được gọi là mạng:', options: ['A. LAN (Mạng cục bộ)', 'B. WAN (Mạng diện rộng)', 'C. MAN', 'D. PAN'], correctKey: 'A' },
              { num: 15, content: 'Dịch vụ lưu trữ đám mây của Google có tên là:', options: ['A. Google Drive', 'B. Google Translate', 'C. Google Maps', 'D. Gmail'], correctKey: 'A' },
              { num: 16, content: 'Quy tắc "Không kết bạn với người lạ, không chia sẻ địa chỉ nhà riêng lên mạng xã hội" nhằm mục đích gì?', options: ['A. Tiết kiệm tiền điện', 'B. Bảo vệ an toàn thông tin cá nhân và tránh bị kẻ xấu lợi dụng', 'C. Tăng tốc độ đường truyền', 'D. Tránh hỏng máy vi tính'], correctKey: 'B' }
            ]
          },
          {
            title: 'PHẦN II. TỰ LUẬN',
            points: '6,0 điểm',
            questions: [
              {
                num: 'Bài 1 (Bảng tính)',
                points: '3,0 điểm',
                content: 'Cho bảng tính Excel theo dõi điểm kiểm tra học kỳ của lớp 7A. Nêu công thức cụ thể để:\n' +
                         'a) Tính điểm trung bình môn của học sinh tại ô F3 biết Điểm Toán (C3) hệ số 2, Văn (D3) hệ số 2, Anh (E3) hệ số 1.\n' +
                         'b) Tìm điểm trung bình cao nhất của cả lớp tại ô F40.\n' +
                         'c) Đếm số lượng học sinh có điểm trung bình từ 8.0 trở lên.'
              },
              {
                num: 'Bài 2 (Lập trình Python)',
                points: '3,0 điểm',
                content: 'Viết chương trình Python thực hiện:\n' +
                         'a) Nhập vào từ bàn phím số nguyên dương n (ví dụ số học sinh).\n' +
                         'b) Tính tổng các số tự nhiên chẵn từ 2 đến n và in kết quả ra màn hình.'
              }
            ]
          }
        ],
        matrix: {
          headers: ['Chủ đề môn Tin học', 'Đơn vị kiến thức', 'Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao', 'Tổng điểm', 'Tỉ lệ %'],
          rows: [
            ['Chủ đề A: Máy tính & Xã hội tri thức', 'Phần cứng, hệ điều hành, an toàn mạng', '4 TN (1,0đ)', '2 TN (0,5đ)', '0', '0', '1,5 điểm', '15%'],
            ['Chủ đề E: Ứng dụng tin học', 'Bảng tính Excel & Trình chiếu', '4 TN (1,0đ)', '2 TN (0,5đ)', 'Bài 1a, 1b (2,0đ)', 'Bài 1c (1,0đ)', '4,5 điểm', '45%'],
            ['Chủ đề F: Giải quyết vấn đề với máy tính', 'Ngôn ngữ lập trình Python', '2 TN (0,5đ)', '2 TN (0,5đ)', 'Bài 2a, 2b (2,0đ)', 'Tối ưu code (1,0đ)', '4,0 điểm', '40%'],
            ['TỔNG', 'Toàn bộ chương trình Tin học', '2,5 điểm (25%)', '1,5 điểm (15%)', '4,0 điểm (40%)', '2,0 điểm (20%)', '10,0 điểm', '100%']
          ]
        },
        specification: {
          headers: ['TT', 'Chủ đề', 'Đơn vị kiến thức', 'Yêu cầu cần đạt', 'Câu hỏi & Điểm'],
          rows: [
            ['1', 'Chủ đề A', 'Bảo mật thông tin', 'Hiểu cách đặt mật khẩu mạnh, an toàn Internet', 'Câu 1, 2, 8, 9, 14, 16 (1,5 điểm)'],
            ['2', 'Chủ đề E', 'Bảng tính Excel', 'Vận dụng hàm SUM, AVERAGE, COUNTIF, địa chỉ ô', 'Câu 3, 4, 5, 6, 7, 15, Bài 1 (4,5 điểm)'],
            ['3', 'Chủ đề F', 'Lập trình Python', 'Sử dụng biến, câu lệnh print, input, vòng lặp for/while', 'Câu 10, 11, 12, 13, Bài 2 (4,0 điểm)']
          ]
        },
        answerGuide: {
          mcqAnswers: [
            { q: 1, ans: 'B' }, { q: 2, ans: 'A' }, { q: 3, ans: 'B' }, { q: 4, ans: 'B' },
            { q: 5, ans: 'B' }, { q: 6, ans: 'A' }, { q: 7, ans: 'B' }, { q: 8, ans: 'B' },
            { q: 9, ans: 'B' }, { q: 10, ans: 'B' }, { q: 11, ans: 'B' }, { q: 12, ans: 'B' },
            { q: 13, ans: 'B' }, { q: 14, ans: 'A' }, { q: 15, ans: 'A' }, { q: 16, ans: 'B' }
          ],
          essayGuide: [
            { question: 'Bài 1a', step: 'Công thức: `=(C3*2 + D3*2 + E3) / 5` hoặc `=(SUM(C3:D3)*2 + E3)/5`', point: '1,00 điểm' },
            { question: 'Bài 1b', step: 'Công thức: `=MAX(F3:F39)`', point: '1,00 điểm' },
            { question: 'Bài 1c', step: 'Công thức: `=COUNTIF(F3:F39, ">=8.0")`', point: '1,00 điểm' },
            { question: 'Bài 2', step: 'Mã Python chuẩn:\n```python\nn = int(input("Nhập số n: "))\ntong = 0\nfor i in range(2, n + 1, 2):\n    tong += i\nprint("Tổng các số chẵn là:", tong)\n```', point: '3,00 điểm' }
          ]
        }
      };

    case 'GDCD':
      return {
        subjectId: 'GDCD',
        subjectName: 'Giáo dục công dân',
        grade,
        termCode,
        termTitle,
        examCode,
        timeMinutes: 45,
        schoolYear,
        parentAgency,
        schoolName,
        parts: [
          {
            title: 'PHẦN I. TRẮC NGHIỆM KHÁCH QUAN',
            points: '4,0 điểm',
            instruction: 'Khoanh tròn chữ cái đứng trước phương án trả lời đúng (16 câu, mỗi câu 0,25 điểm):',
            questions: [
              { num: 1, content: 'Truyền thống tốt đẹp nào của dân tộc thể hiện lòng biết ơn sâu sắc đối với người dạy dỗ mình?', options: ['A. Tôn sư trọng đạo', 'B. Uống nước nhớ nguồn', 'C. Lá lành đùm lá rách', 'D. Cần cù bù thông minh'], correctKey: 'A' },
              { num: 2, content: 'Hành vi nào sau đây thể hiện sự tự hào về truyền thống quê hương?', options: ['A. Giới thiệu làng nghề truyền thống cho bạn bè', 'B. Xấu hổ vì quê mình làm nông nghiệp', 'C. Chê bai lễ hội dân gian', 'D. Phá hoại di tích lịch sử'], correctKey: 'A' },
              { num: 3, content: 'Bảo tồn di sản văn hóa là trách nhiệm của:', options: ['A. Chỉ riêng các nhà khảo cổ', 'B. Toàn thể công dân và cộng đồng xã hội', 'C. Chỉ riêng chính quyền địa phương', 'D. Khách du lịch nước ngoài'], correctKey: 'B' },
              { num: 4, content: 'Đức tính cần cù, chăm chỉ trong lao động giúp con người:', options: ['A. Trở nên giàu có tức thì mà không cần học', 'B. Hoàn thiện nhân cách, tạo ra của cải và được mọi người tôn trọng', 'C. Trốn tránh khó khăn', 'D. Bị người khác chê cười'], correctKey: 'B' },
              { num: 5, content: 'Hành động nào dưới đây là biểu hiện của tính trung thực trong học tập?', options: ['A. Nhìn bài của bạn trong giờ kiểm tra', 'B. Nhận lỗi khi chưa làm bài tập và cố gắng sửa chữa', 'C. Giấu điểm kém không cho bố mẹ biết', 'D. Nhờ người khác làm hộ bài thi'], correctKey: 'B' },
              { num: 6, content: 'Yêu thương con người là truyền thống quý báu được thể hiện qua câu tục ngữ nào?', options: ['A. Thương người như thể thương thân', 'B. Ăn quả nhớ kẻ trồng cây', 'C. Có công mài sắt có ngày nên kim', 'D. Đi một ngày đàng học một sàng khôn'], correctKey: 'A' },
              { num: 7, content: 'Hành vi bạo lực học đường bao gồm:', options: ['A. Cùng nhau học nhóm và thảo luận', 'B. Đánh đập, cô lập, đe dọa hoặc tung tin thất thiệt xúc phạm bạn bè', 'C. Giúp đỡ bạn khi gặp bài toán khó', 'D. Tham gia giải bóng đá của trường'], correctKey: 'B' },
              { num: 8, content: 'Khi chứng kiến một vụ bạo lực học đường, em nên làm gì?', options: ['A. Đứng cổ vũ và quay video đăng lên mạng xã hội', 'B. Kịp thời báo cho thầy cô giáo, ban giám hiệu hoặc người lớn có trách nhiệm', 'C. Bỏ đi vì không liên quan đến mình', 'D. Rủ thêm bạn vào đánh hùa'], correctKey: 'B' },
              { num: 9, content: 'Pháp luật có tính chất bắt buộc chung đối với:', options: ['A. Chỉ riêng người lớn tuổi', 'B. Mọi cá nhân và tổ chức trong toàn xã hội', 'C. Chỉ cán bộ công chức', 'D. Những người vi phạm pháp luật'], correctKey: 'B' },
              { num: 10, content: 'Quyền trẻ em bao gồm 4 nhóm quyền cơ bản là:', options: ['A. Quyền sống còn, bảo vệ, phát triển và tham gia', 'B. Quyền tự do tuyệt đối, sở hữu tài sản vô hạn, du lịch và miễn thi cử', 'C. Quyền lao động sớm, lái xe máy và kinh doanh', 'D. Quyền không cần học tập'], correctKey: 'A' },
              { num: 11, content: 'Công dân đủ bao nhiêu tuổi trở lên thì phải chịu trách nhiệm hình sự về mọi tội phạm do mình gây ra?', options: ['A. 14 tuổi', 'B. 16 tuổi', 'C. 18 tuổi', 'D. 21 tuổi'], correctKey: 'B' },
              { num: 12, content: 'Hành vi vượt đèn đỏ khi tham gia giao thông là hành vi vi phạm:', options: ['A. Kỷ luật nhà trường', 'B. Pháp luật hành chính về an toàn giao thông', 'C. Chuẩn mực phong tục', 'D. Đạo đức gia đình'], correctKey: 'B' },
              { num: 13, content: 'Để quản lý cảm xúc tiêu cực như giận dữ, căng thẳng, chúng ta nên:', options: ['A. Đập phá đồ đạc', 'B. Hít thở sâu, bình tĩnh lắng nghe và tìm kiếm sự trợ giúp chân thành', 'C. Mắng chửi người xung quanh', 'D. Trút giận lên mạng xã hội'], correctKey: 'B' },
              { num: 14, content: 'Kỹ năng từ chối trước những cám dỗ tệ nạn xã hội đòi hỏi chúng ta phải:', options: ['A. Kiên quyết nói "Không" và giữ vững lập trường đạo đức', 'B. Thử một lần cho biết', 'C. Đồng ý vì sợ bạn bè tẩy chay', 'D. Im lặng nghe theo'], correctKey: 'A' },
              { num: 15, content: 'Bảo vệ môi trường tự nhiên xung quanh trường học là biểu hiện của:', options: ['A. Lối sống văn minh, có trách nhiệm với cộng đồng', 'B. Việc làm mất thời gian', 'C. Chỉ là nhiệm vụ của lao công', 'D. Việc làm không có ích'], correctKey: 'A' },
              { num: 16, content: 'Tự lập có ý nghĩa gì đối với học sinh THCS?', options: ['A. Giúp em tự tin, chủ động vượt qua khó khăn và vững bước tương lai', 'B. Khiến em bị cô lập', 'C. Giúp em không cần bố mẹ nuôi dưỡng', 'D. Không cần quan tâm tới ai'], correctKey: 'A' }
            ]
          },
          {
            title: 'PHẦN II. TỰ LUẬN XỬ LÝ TÌNH HUỐNG',
            points: '6,0 điểm',
            questions: [
              {
                num: 'Tình huống 1',
                points: '3,0 điểm',
                content: 'Bạn Minh học lớp 7 thường xuyên bị một nhóm học sinh lớp trên đe dọa, đòi tiền tiêu vặt và cấm không được nói với ai nếu không sẽ bị chặn đánh sau giờ học. Minh cảm thấy rất hoảng sợ, việc học tập giảm sút rõ rệt.\n' +
                         'a) Nhóm học sinh lớp trên đã có hành vi vi phạm điều gì?\n' +
                         'b) Nếu là bạn thân của Minh, em sẽ khuyên Minh xử lý tình huống trên như thế nào để đảm bảo an toàn cho bản thân?'
              },
              {
                num: 'Tình huống 2',
                points: '3,0 điểm',
                content: 'Trên mạng xã hội xuất hiện một trào lưu bêu xấu thông tin cá nhân và chụp ảnh dìm hàng các bạn học sinh trong lớp học để câu lượt xem (view).\n' +
                         'a) Hành vi bêu xấu người khác trên mạng xã hội vi phạm quyền cơ bản nào của công dân?\n' +
                         'b) Em hãy đề xuất 3 nguyên tắc vàng để sử dụng mạng xã hội một cách văn minh, an toàn và có đạo đức.'
              }
            ]
          }
        ],
        matrix: {
          headers: ['Mạch nội dung GDCD', 'Đơn vị kiến thức', 'Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao', 'Tổng điểm', 'Tỉ lệ %'],
          rows: [
            ['Giáo dục đạo đức', 'Truyền thống quê hương, Tự lập, Yêu thương', '4 TN (1,0đ)', '2 TN (0,5đ)', '0', '0', '1,5 điểm', '15%'],
            ['Giáo dục kỹ năng sống', 'Quản lý cảm xúc, Phòng chống bạo lực', '2 TN (0,5đ)', '2 TN (0,5đ)', 'TH1 (3,0đ)', '0', '4,0 điểm', '40%'],
            ['Giáo dục pháp luật', 'Quyền trẻ em, Pháp luật & An toàn mạng', '4 TN (1,0đ)', '2 TN (0,5đ)', 'TH2 (2,0đ)', 'TH2 (1,0đ)', '4,5 điểm', '45%'],
            ['TỔNG', 'Toàn diện chương trình GDCD', '2,5 điểm (25%)', '1,5 điểm (15%)', '5,0 điểm (50%)', '1,0 điểm (10%)', '10,0 điểm', '100%']
          ]
        },
        specification: {
          headers: ['TT', 'Chủ đề', 'Đơn vị kiến thức', 'Yêu cầu cần đạt', 'Câu hỏi & Điểm'],
          rows: [
            ['1', 'Đạo đức', 'Giá trị văn hóa & lòng nhân ái', 'Nhận diện hành vi đúng chuẩn mực, tinh thần tôn sư trọng đạo', 'Câu 1 đến Câu 6 (1,5 điểm)'],
            ['2', 'Kỹ năng', 'Phòng chống bạo lực học đường', 'Biết cách tự bảo vệ, tìm kiếm sự trợ giúp đúng quy trình', 'Câu 7, 8, 13, 14, TH1 (4,0 điểm)'],
            ['3', 'Pháp luật', 'Luật trẻ em & Luật an ninh mạng', 'Tôn trọng danh dự nhân phẩm người khác trên không gian số', 'Câu 9, 10, 11, 12, 15, 16, TH2 (4,5 điểm)']
          ]
        },
        answerGuide: {
          mcqAnswers: [
            { q: 1, ans: 'A' }, { q: 2, ans: 'A' }, { q: 3, ans: 'B' }, { q: 4, ans: 'B' },
            { q: 5, ans: 'B' }, { q: 6, ans: 'A' }, { q: 7, ans: 'B' }, { q: 8, ans: 'B' },
            { q: 9, ans: 'B' }, { q: 10, ans: 'A' }, { q: 11, ans: 'B' }, { q: 12, ans: 'B' },
            { q: 13, ans: 'B' }, { q: 14, ans: 'A' }, { q: 15, ans: 'A' }, { q: 16, ans: 'A' }
          ],
          essayGuide: [
            { question: 'Tình huống 1a', step: 'Hành vi vi phạm: Bạo lực học đường, xâm hại thân thể, tinh thần và cưỡng đoạt tài sản của học sinh.', point: '1,50 điểm' },
            { question: 'Tình huống 1b', step: 'Lời khuyên: Không giấu giếm; ngay lập tức chia sẻ với thầy cô giáo chủ nhiệm, ban giám hiệu và bố mẹ; không đi một mình nơi vắng vẻ.', point: '1,50 điểm' },
            { question: 'Tình huống 2a', step: 'Vi phạm quyền bất khả xâm phạm về thân thể, quyền được bảo hộ về danh dự, nhân phẩm và uy tín theo Hiến pháp và Luật An ninh mạng.', point: '1,50 điểm' },
            { question: 'Tình huống 2b', step: '3 nguyên tắc: 1. Suy nghĩ kỹ trước khi đăng tải hình ảnh/bình luận; 2. Tôn trọng quyền riêng tư của người khác; 3. Không lan truyền tin độc hại, sai sự thật.', point: '1,50 điểm' }
          ]
        }
      };

    case 'CN':
      return {
        subjectId: 'CN',
        subjectName: 'Công nghệ',
        grade,
        termCode,
        termTitle,
        examCode,
        timeMinutes: 45,
        schoolYear,
        parentAgency,
        schoolName,
        parts: [
          {
            title: 'PHẦN I. TRẮC NGHIỆM KHÁCH QUAN',
            points: '4,0 điểm',
            instruction: 'Khoanh tròn vào phương án trả lời đúng (16 câu, mỗi câu 0,25 điểm):',
            questions: [
              { num: 1, content: 'Bản vẽ kỹ thuật được coi là:', options: ['A. Ngôn ngữ chung của giới kỹ thuật', 'B. Tác phẩm hội họa thuần túy', 'C. Sách hướng dẫn kinh doanh', 'D. Tạp chí giải trí'], correctKey: 'A' },
              { num: 2, content: 'Hình chiếu đứng của một vật thể có hướng chiếu từ:', options: ['A. Trước tới', 'B. Trên xuống', 'C. Trái sang', 'D. Phải sang'], correctKey: 'A' },
              { num: 3, content: 'Khổ giấy chuẩn A4 trong vẽ kỹ thuật có kích thước là:', options: ['A. 297 x 420 mm', 'B. 210 x 297 mm', 'C. 148 x 210 mm', 'D. 420 x 594 mm'], correctKey: 'B' },
              { num: 4, content: 'Vật liệu cơ khí kim loại màu bao gồm nhóm nào sau đây?', options: ['A. Gang và thép', 'B. Đồng, nhôm và hợp kim của chúng', 'C. Nhựa cao su', 'D. Gỗ và gốm sứ'], correctKey: 'B' },
              { num: 5, content: 'Dụng cụ nào dùng để đo kích thước đường kính trong và ngoài với độ chính xác cao?', options: ['A. Thước cuộn', 'B. Thước cặp (thước kẹp)', 'C. Thước kẻ nhựa', 'D. Thước lá'], correctKey: 'B' },
              { num: 6, content: 'Quy trình đục kim loại an toàn đòi hỏi người thực hiện phải:', options: ['A. Đeo kính bảo hộ và găng tay thích hợp', 'B. Nhìn lơ đãng chỗ khác', 'C. Đứng đối diện người khác', 'D. Dùng búa hỏng cán'], correctKey: 'A' },
              { num: 7, content: 'Cơ cấu truyền động xích thường được ứng dụng ở phương tiện nào?', options: ['A. Xe đạp và xe máy', 'B. Quạt trần', 'C. Máy khoan bàn', 'D. Đồng hồ đeo tay'], correctKey: 'A' },
              { num: 8, content: 'Tỉ số truyền i của bộ truyền động bánh răng được tính bởi công thức:', options: ['A. i = Z1 / Z2', 'B. i = Z2 / Z1', 'C. i = Z1 . Z2', 'D. i = Z1 + Z2'], correctKey: 'A' },
              { num: 9, content: 'Nguồn điện lưới sinh hoạt tại các hộ gia đình Việt Nam hiện nay có điện áp là:', options: ['A. 110V / 60Hz', 'B. 220V / 50Hz', 'C. 380V / 50Hz', 'D. 12V / 50Hz'], correctKey: 'B' },
              { num: 10, content: 'Thiết bị nào có chức năng tự động ngắt mạch điện khi xảy ra sự cố ngắn mạch hoặc quá tải?', options: ['A. Phích cắm', 'B. Aptomat (Aptomat/Cầu chì)', 'C. Đèn báo', 'D. Công tắc'], correctKey: 'B' },
              { num: 11, content: 'Để đảm bảo an toàn điện khi sửa chữa đồ dùng điện trong nhà, nguyên tắc đầu tiên là:', options: ['A. Đeo găng tay ướt', 'B. Ngắt nguồn điện (cầu dao, aptomat tổng)', 'C. Đi chân trần', 'D. Cứ để điện thử'], correctKey: 'B' },
              { num: 12, content: 'Đồ dùng loại điện - nhiệt biến đổi điện năng thành:', options: ['A. Cơ năng', 'B. Nhiệt năng', 'C. Quang năng thuần túy', 'D. Hóa năng'], correctKey: 'B' },
              { num: 13, content: 'Bàn là điện, nồi cơm điện và bình nóng lạnh thuộc nhóm đồ dùng điện nào?', options: ['A. Điện - cơ', 'B. Điện - nhiệt', 'C. Điện - quang', 'D. Điện tử viễn thông'], correctKey: 'B' },
              { num: 14, content: 'Phương pháp gieo trồng cây nông nghiệp công nghệ cao trong dung dịch dinh dưỡng không dùng đất gọi là:', options: ['A. Canh tác truyền thống', 'B. Phương pháp thủy canh', 'C. Thâm canh lúa nước', 'D. Đốt nương làm rẫy'], correctKey: 'B' },
              { num: 15, content: 'Biện pháp phòng trừ sâu bệnh hại cây trồng thân thiện nhất với môi trường là:', options: ['A. Phun thuốc hóa học quá liều', 'B. Biện pháp sinh học (dùng thiên địch)', 'C. Đốt toàn bộ ruộng', 'D. Bón phân đạm đặc'], correctKey: 'B' },
              { num: 16, content: 'Mục đích của việc sử dụng bóng đèn LED thay cho đèn sợi đốt truyền thống là:', options: ['A. Tốn nhiều điện năng hơn', 'B. Tiết kiệm điện năng và tuổi thọ bền lâu hơn', 'C. Tỏa ra nhiệt độ rất cao', 'D. Dễ cháy nổ'], correctKey: 'B' }
            ]
          },
          {
            title: 'PHẦN II. TỰ LUẬN THỰC HÀNH',
            points: '6,0 điểm',
            questions: [
              {
                num: 'Câu 17 (Bản vẽ & Cơ khí)',
                points: '3,0 điểm',
                content: 'a) Nêu vị trí của các hình chiếu (Hình chiếu đứng, Hình chiếu bằng, Hình chiếu cạnh) trên bản vẽ kỹ thuật.\n' +
                         'b) Một bộ truyền động đai có bánh dẫn đường kính D1 = 30 cm quay với tốc độ n1 = 1200 vòng/phút, bánh bị dẫn có đường kính D2 = 15 cm. Tính tỉ số truyền i và tốc độ quay n2 của bánh bị dẫn.'
              },
              {
                num: 'Câu 18 (An toàn điện & Thiết kế)',
                points: '3,0 điểm',
                content: 'Một gia đình sử dụng các đồ dùng điện sau trong 1 ngày:\n' +
                         '- 4 bóng đèn LED 20W, mỗi ngày bật 5 giờ.\n' +
                         '- 2 quạt điện 60W, mỗi ngày bật 6 giờ.\n' +
                         '- 1 nồi cơm điện 700W, mỗi ngày bật 1,5 giờ.\n' +
                         'a) Tính tổng điện năng tiêu thụ của gia đình trong 1 ngày (theo đơn vị Wh và kWh).\n' +
                         'b) Tính tiền điện phải trả trong 30 ngày, biết giá bán điện bình quân là 2.000 đồng/kWh.'
              }
            ]
          }
        ],
        matrix: {
          headers: ['Mạch nội dung Công nghệ', 'Đơn vị kiến thức', 'Nhận biết', 'Thông hiểu', 'Vận dụng', 'Vận dụng cao', 'Tổng điểm', 'Tỉ lệ %'],
          rows: [
            ['Vẽ kỹ thuật & Cơ khí', 'Hình chiếu, vật liệu & truyền động', '4 TN (1,0đ)', '2 TN (0,5đ)', 'Câu 17 (3,0đ)', '0', '4,5 điểm', '45%'],
            ['Kỹ thuật điện & Đồ dùng điện', 'An toàn điện, tính điện năng tiêu thụ', '4 TN (1,0đ)', '2 TN (0,5đ)', 'Câu 18a (2,0đ)', 'Câu 18b (1,0đ)', '4,5 điểm', '45%'],
            ['Nông nghiệp công nghệ cao', 'Trồng trọt & bảo vệ cây trồng', '2 TN (0,5đ)', '2 TN (0,5đ)', '0', '0', '1,0 điểm', '10%'],
            ['TỔNG', 'Toàn bộ chương trình Công nghệ', '2,5 điểm (25%)', '1,5 điểm (15%)', '5,0 điểm (50%)', '1,0 điểm (10%)', '10,0 điểm', '100%']
          ]
        },
        specification: {
          headers: ['TT', 'Chủ đề', 'Đơn vị kiến thức', 'Yêu cầu cần đạt', 'Câu hỏi & Điểm'],
          rows: [
            ['1', 'Vẽ kỹ thuật', 'Quy ước hình chiếu', 'Nắm vững hình chiếu đứng, bằng, cạnh', 'Câu 1, 2, 3, Câu 17a (2,0 điểm)'],
            ['2', 'Cơ khí truyền động', 'Tỉ số truyền động', 'Tính i = D1/D2 = n2/n1 chính xác', 'Câu 4, 5, 6, 7, 8, Câu 17b (2,5 điểm)'],
            ['3', 'An toàn & Điện năng', 'Công thức A = P . t', 'Tính điện năng và chi phí tiền điện gia đình', 'Câu 9 đến 13, Câu 18 (4,5 điểm)'],
            ['4', 'Nông nghiệp sạch', 'Công nghệ cao', 'Nhận biết thủy canh, bảo vệ sinh thái', 'Câu 14, 15, 16 (1,0 điểm)']
          ]
        },
        answerGuide: {
          mcqAnswers: [
            { q: 1, ans: 'A' }, { q: 2, ans: 'A' }, { q: 3, ans: 'B' }, { q: 4, ans: 'B' },
            { q: 5, ans: 'B' }, { q: 6, ans: 'A' }, { q: 7, ans: 'A' }, { q: 8, ans: 'A' },
            { q: 9, ans: 'B' }, { q: 10, ans: 'B' }, { q: 11, ans: 'B' }, { q: 12, ans: 'B' },
            { q: 13, ans: 'B' }, { q: 14, ans: 'B' }, { q: 15, ans: 'B' }, { q: 16, ans: 'B' }
          ],
          essayGuide: [
            { question: 'Câu 17a', step: 'Hình chiếu đứng ở góc trên bên trái; Hình chiếu bằng ở dưới hình chiếu đứng; Hình chiếu cạnh ở bên phải hình chiếu đứng.', point: '1,50 điểm' },
            { question: 'Câu 17b', step: 'Tỉ số truyền: i = D1 / D2 = 30 / 15 = 2. Tốc độ quay bánh bị dẫn: n2 = n1 . i = 1200 . 2 = 2400 (vòng/phút).', point: '1,50 điểm' },
            { question: 'Câu 18a', step: 'Điện năng đèn: 4 x 20W x 5h = 400 Wh.\nĐiện năng quạt: 2 x 60W x 6h = 720 Wh.\nĐiện năng nồi: 1 x 700W x 1,5h = 1050 Wh.\nTổng A = 400 + 720 + 1050 = 2170 Wh = 2,17 kWh.', point: '2,00 điểm' },
            { question: 'Câu 18b', step: 'Điện năng 30 ngày: 2,17 x 30 = 65,1 kWh.\nTiền điện: 65,1 x 2.000 = 130.200 đồng.', point: '1,00 điểm' }
          ]
        }
      };

    case 'LICHSU':
    case 'LS':
      return {
        subjectId: 'LICHSU',
        subjectName: 'Lịch sử',
        grade,
        termCode,
        termTitle,
        examCode,
        timeMinutes: 45,
        schoolYear,
        parentAgency,
        schoolName,
        parts: [
          {
            title: 'PHẦN I. CÂU HỎI TRẮC NGHIỆM NHIỀU LỰA CHỌN',
            points: '3,0 điểm',
            instruction: 'Khoanh tròn vào một chữ cái A, B, C hoặc D đứng trước phương án trả lời đúng (12 câu, mỗi câu 0,25 điểm):',
            questions: [
              {
                num: 1,
                content: 'Phong trào Văn hóa Phục hưng (thế kỉ XIV - XVII) bắt đầu khởi xướng tại quốc gia nào ở Tây Âu?',
                options: ['A. Vương quốc Anh', 'B. Bán đảo I-ta-li-a (Ý)', 'C. Nước Pháp', 'D. Nước Đức'],
                correctKey: 'B'
              },
              {
                num: 2,
                content: 'Tác phẩm văn học nổi tiếng "Hăm-lét", "Rô-mê-ô và Giu-li-ét" là kiệt tác của danh nhân Phục hưng nào?',
                options: ['A. Lô-pha Phơ-răng-xoa', 'B. U-i-li-am Sếch-xpia', 'C. Mi-ken-lăng-giơ', 'D. Lê-ô-na đơ Vanh-xi'],
                correctKey: 'B'
              },
              {
                num: 3,
                content: 'Các cuộc phát kiến địa lí thế kỉ XV - XVI gắn liền với tên tuổi của những nhà thám hiểm nổi tiếng nào?',
                options: ['A. N.Cơ-péc-ních và G.Ga-li-lê', 'B. C.Cô-lôm-bô và Ph.Ma-gien-lăng', 'C. Sếch-xpia và Đan-tê', 'D. T.Mo-rơ và Ra-bơ-le'],
                correctKey: 'B'
              },
              {
                num: 4,
                content: 'Chiến thắng Bạch Đằng năm 938 do Ngô Quyền lãnh đạo đã đánh tan đạo quân xâm lược nào?',
                options: ['A. Quân Tống', 'B. Quân Nam Hán', 'C. Quân Đường', 'D. Quân Nguyên Mông'],
                correctKey: 'B'
              },
              {
                num: 5,
                content: 'Năm 1010, vua Lý Thái Tổ quyết định dời đô từ Hoa Lư về đâu và đổi tên thành gì?',
                options: ['A. Về Cổ Loa, đổi tên thành Đông Đô', 'B. Về Đại La, đổi tên thành Thăng Long', 'C. Về Tây Đô, đổi tên thành Vạn Xuân', 'D. Về Phú Xuân, đổi tên thành Huế'],
                correctKey: 'B'
              },
              {
                num: 6,
                content: 'Tác phẩm được xem là bản Tuyên ngôn Độc lập đầu tiên của dân tộc Việt Nam thời nhà Lý là:',
                options: ['A. Hịch tướng sĩ (Trần Quốc Tuấn)', 'B. Bài thơ thần "Nam quốc sơn hà" (Lý Thường Kiệt)', 'C. Bình Ngô đại cáo (Nguyễn Trãi)', 'D. Tuyên ngôn Độc lập (Chủ tịch Hồ Chí Minh)'],
                correctKey: 'B'
              },
              {
                num: 7,
                content: 'Ba lần chiến thắng oanh liệt quân xâm lược Mông - Nguyên (1258, 1285, 1288) diễn ra dưới triều đại phong kiến nào?',
                options: ['A. Triều Tiền Lê', 'B. Triều Lý', 'C. Triều Trần', 'D. Triều Hậu Lê'],
                correctKey: 'C'
              },
              {
                num: 8,
                content: 'Hội nghị Diên Hồng (1284) do Thượng hoàng Trần Thánh Tông triệu tập thể hiện tinh thần dân chủ và quyết tâm:',
                options: ['A. Cầu hòa giữ yên bờ cõi', 'B. Toàn dân đồng lòng đánh giặc cứu nước ("Nên đánh!")', 'C. Dời kinh đô lánh giặc', 'D. Phân chia ruộng đất cho nhân dân'],
                correctKey: 'B'
              },
              {
                num: 9,
                content: 'Khởi nghĩa Lam Sơn (1418 - 1427) do vị anh hùng dân tộc nào phát động và lãnh đạo giành toàn thắng?',
                options: ['A. Lê Lợi', 'B. Nguyễn Trãi', 'C. Trần Hưng Đạo', 'D. Quang Trung - Nguyễn Huệ'],
                correctKey: 'A'
              },
              {
                num: 10,
                content: 'Chiến thắng Ngọc Hồi - Đống Đa lịch sử vào mùa xuân Kỷ Dậu (1789) do người anh hùng áo vải nào chỉ huy?',
                options: ['A. Nguyễn Huệ (Vua Quang Trung)', 'B. Nguyễn Nhạc', 'C. Nguyễn Lữ', 'D. Ngô Thì Nhậm'],
                correctKey: 'A'
              },
              {
                num: 11,
                content: 'Bộ luật Hồng Đức (Quốc triều hình luật) được ban hành hoàn chỉnh dưới thời trị vì của vị vua nào thời Lê sơ?',
                options: ['A. Vua Lê Thái Tổ', 'B. Vua Lê Thánh Tông', 'C. Vua Lê Nhân Tông', 'D. Vua Lê Thái Tông'],
                correctKey: 'B'
              },
              {
                num: 12,
                content: 'Đặc trưng cơ bản của chế độ phong kiến phương Tây thời kỳ trung đại là:',
                options: ['A. Tình trạng cát cứ phân quyền lãnh địa phong kiến', 'B. Tập quyền chuyên chế tuyệt đối từ đầu', 'C. Nền kinh tế hàng hóa mở rộng', 'D. Xã hội không có giai cấp bóc lột'],
                correctKey: 'A'
              }
            ]
          },
          {
            title: 'PHẦN II. CÂU HỎI TRẮC NGHIỆM ĐÚNG - SAI CÓ ĐOẠN TƯ LIỆU',
            points: '4,0 điểm',
            instruction: 'Thí sinh trả lời từ câu 13 đến câu 16. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng (Đ) hoặc sai (S). (Thang điểm: Đúng 1 ý: 0,1đ; đúng 2 ý: 0,25đ; đúng 3 ý: 0,5đ; đúng 4 ý: 1,0đ):',
            questions: [
              {
                num: 'Câu 13 (1,0 điểm)',
                content: 'Đọc đoạn tư liệu sau:\n“Năm 938, vua Nam Hán sai con trai là Vạn Vương Hoằng Tháo đem quân sang xâm lược nước ta... Ngô Quyền bàn với các tướng rằng: Hoằng Tháo là đứa trẻ dại, đem quân từ xa đến, quân lính mỏi mệt... Nếu ta sai người vạt nhọn cọc lớn, bịt sắt cắm ngầm trước ở cửa biển, khi thuyền giặc theo nước triều lên tiến vào trong hàng cọc, bấy giờ ta sẽ dốc toàn lực đánh quật lại, thế tất giặc phải tan vỡ!”\n(Theo Đại Việt sử ký toàn thư)\n\nNhận định tính Đúng/Sai của các mệnh đề sau:\n' +
                         'a) Đoạn tư liệu phản ánh kế sách đánh giặc độc đáo của Ngô Quyền trong trận Bạch Đằng năm 938.\n' +
                         'b) Hoằng Tháo là một danh tướng lão luyện, dày dạn kinh nghiệm chiến trường phương Nam.\n' +
                         'c) Kế sách lợi dụng thủy triều và cắm cọc gỗ bịt sắt thể hiện nghệ thuật quân sự tài tình, sáng tạo của cha ông ta.\n' +
                         'd) Chiến thắng Bạch Đằng năm 938 đã kết thúc hơn 1000 năm Bắc thuộc, mở ra kỷ nguyên độc lập, tự chủ lâu dài cho dân tộc.',
                options: ['a) Đúng', 'b) Sai', 'c) Đúng', 'd) Đúng'],
                correctKey: 'a-Đ, b-S, c-Đ, d-Đ'
              },
              {
                num: 'Câu 14 (1,0 điểm)',
                content: 'Đọc đoạn tư liệu sau:\n“Mùa xuân năm Kỷ Dậu (1789), vua Quang Trung đại phá quân Thanh, tiến vào Thăng Long vào đúng ngày mùng 5 Tết. Áo bào sạm đen khói súng, người anh hùng áo vải Tây Sơn đã làm nên trang sử chói lọi, đập tan âm mưu xâm lược của 29 vạn quân Mãn Thanh.”\n\nNhận định tính Đúng/Sai của các mệnh đề sau:\n' +
                         'a) Chiến thắng Ngọc Hồi - Đống Đa xuân Kỷ Dậu 1789 do Nguyễn Huệ - Quang Trung trực tiếp lãnh đạo.\n' +
                         'b) Quân Tây Sơn tiến hành hành quân thần tốc, vừa đi vừa tuyển quân và tổ chức duyệt binh.\n' +
                         'c) Cuộc kháng chiến chống quân Thanh kéo dài nhiều năm ròng rã trong thế giằng co.\n' +
                         'd) Chiến thắng này đã bảo vệ vững chắc nền độc lập dân tộc và chủ quyền lãnh thổ của đất nước.',
                options: ['a) Đúng', 'b) Đúng', 'c) Sai', 'd) Đúng'],
                correctKey: 'a-Đ, b-Đ, c-S, d-Đ'
              },
              {
                num: 'Câu 15 (1,0 điểm)',
                content: 'Đọc đoạn tư liệu sau:\n“Nước Nga Xô viết sau chiến tranh phải đối mặt với muôn vàn khó khăn... Tháng 3-1921, Đảng Bôn-sê-vích Nga dưới sự lãnh đạo của V.I. Lê-nin đã quyết định chuyển từ Chính sách cộng sản thời chiến sang Chính sách kinh tế mới (NEP), khôi phục nền kinh tế quốc dân.”\n\nNhận định tính Đúng/Sai của các mệnh đề sau:\n' +
                         'a) Chính sách kinh tế mới (NEP) được thông qua vào tháng 3-1921 do Lê-nin khởi xướng.\n' +
                         'b) Nội dung quan trọng nhất của NEP trong nông nghiệp là thay chế độ trưng thu lương thực thừa bằng thuế lương thực.\n' +
                         'c) NEP chỉ áp dụng trong lĩnh vực nông nghiệp, không liên quan đến thương nghiệp và công nghiệp.\n' +
                         'd) Việc thực hiện NEP đã giúp nước Nga Xô viết nhanh chóng vượt qua khủng hoảng kinh tế - chính trị.',
                options: ['a) Đúng', 'b) Đúng', 'c) Sai', 'd) Đúng'],
                correctKey: 'a-Đ, b-Đ, c-S, d-Đ'
              },
              {
                num: 'Câu 16 (1,0 điểm)',
                content: 'Đọc đoạn tư liệu sau:\n“Ngày 28-1-1941, sau ba mươi năm bôn ba tìm đường cứu nước, người thanh niên yêu nước Nguyễn Ái Quốc đã trở về Tổ quốc qua cột mốc 108 (Cao Bằng)... Tháng 5-1941, Người chủ trì Hội nghị Trung ương 8, hoàn chỉnh chuyển hướng chỉ đạo chiến lược cách mạng, đặt nhiệm vụ giải phóng dân tộc lên hàng đầu.”\n\nNhận định tính Đúng/Sai của các mệnh đề sau:\n' +
                         'a) Nguyễn Ái Quốc trở về Tổ quốc vào đầu năm 1941 sau 30 năm hoạt động ở nước ngoài.\n' +
                         'b) Pác Bó (Cao Bằng) được chọn làm căn cứ địa đầu tiên để xây dựng lực lượng cách mạng.\n' +
                         'c) Hội nghị Trung ương 8 (5-1941) chủ trương đặt nhiệm vụ đấu tranh giai cấp lên trước nhiệm vụ giải phóng dân tộc.\n' +
                         'd) Mặt trận Việt Minh ra đời năm 1941 là biểu tượng của khối đại đoàn kết toàn dân tộc chuẩn bị cho Tổng khởi nghĩa.”',
                options: ['a) Đúng', 'b) Đúng', 'c) Sai', 'd) Đúng'],
                correctKey: 'a-Đ, b-Đ, c-S, d-Đ'
              }
            ]
          },
          {
            title: 'PHẦN III. TỰ LUẬN (3,0 ĐIỂM)',
            points: '3,0 điểm',
            questions: [
              {
                num: 'Câu 17',
                points: '1,0 điểm',
                content: 'Câu 17 (1,0 điểm). Dựa vào kiến thức lịch sử đã học, em hãy thực hiện yêu cầu sau:\nTrình bày nguyên nhân thắng lợi và ý nghĩa lịch sử sâu sắc của Cách mạng tháng Tám năm 1945 đối với dân tộc Việt Nam và phong trào giải phóng dân tộc trên thế giới.'
              },
              {
                num: 'Câu 18',
                points: '2,0 điểm',
                content: 'Câu 18 (2,0 điểm). Từ tiến trình lịch sử dựng nước và giữ nước oanh liệt của dân tộc ta:\na) Em hãy phân tích bài học kinh nghiệm sâu sắc về "lấy dân làm gốc", phát huy sức mạnh khối đại đoàn kết toàn dân tộc trong công cuộc bảo vệ Tổ quốc (1,0 điểm).\nb) Liên hệ trách nhiệm của bản thân thế hệ học sinh THCS hiện nay trong việc học tập, rèn luyện và đóng góp sức trẻ vào sự nghiệp bảo vệ chủ quyền biên giới, biển đảo thiêng liêng của Tổ quốc (1,0 điểm).'
              }
            ]
          }
        ],
        matrix: {
          headers: ['Mạch kiến thức Lịch sử', 'Chủ đề đơn vị kiến thức (PPCT)', 'Phần I: TN 4 LC (NB)', 'Phần II: Đúng - Sai (TH)', 'Phần III: Tự luận (VD)', 'Phần III: Tự luận (VDC)', 'Tổng điểm', 'Tỉ lệ %'],
          rows: [
            ['Lịch sử Thế giới', 'Tây Âu trung đại & Văn hóa Phục hưng', '3 câu (0,75đ)', 'Câu 15 (1,00đ)', '0', '0', '1,75 điểm', '17,5%'],
            ['Lịch sử Việt Nam (Cổ - Trung đại)', 'Bắc thuộc, Bạch Đằng 938, Triều đại Lý - Trần', '5 câu (1,25đ)', 'Câu 13 (1,00đ)', '0', '0', '2,25 điểm', '22,5%'],
            ['Lịch sử Việt Nam (Thời Lê sơ & Tây Sơn)', 'Khởi nghĩa Lam Sơn & Phong trào Tây Sơn', '4 câu (1,00đ)', 'Câu 14 (1,00đ)', '0', '0', '2,00 điểm', '20,0%'],
            ['Lịch sử Việt Nam (Hiện đại) & Thực tiễn', 'Đường lối cứu nước, CMT8 & Bảo vệ chủ quyền', '0', 'Câu 16 (1,00đ)', 'Câu 17 (1,00đ) + Câu 18a (1,00đ)', 'Câu 18b (1,00đ)', '4,00 điểm', '40,0%'],
            ['TỔNG ĐIỂM TOÀN BÀI', 'Chuẩn Công văn 7991/BGDĐT-GDTrH (45 phút)', '3,0 điểm (30%)', '4,0 điểm (40%)', '2,0 điểm (20%)', '1,0 điểm (10%)', '10,0 điểm', '100%']
          ]
        },
        specification: {
          headers: ['TT', 'Mạch kiến thức', 'Đơn vị kiến thức', 'Mức độ & Yêu cầu cần đạt chuẩn CTGDPT 2018', 'Câu hỏi & Phân bố điểm'],
          rows: [
            ['1', 'Lịch sử thế giới', 'Phong trào Văn hóa Phục hưng & Nước Nga Xô viết', 'Nhận biết danh nhân, tác phẩm tiêu biểu; Hiểu và nhận định đúng sai về hoàn cảnh ra đời chính sách kinh tế mới (NEP)', 'Câu 1, 2, 3 (0,75đ) & Câu 15 (1,00đ)'],
            ['2', 'Lịch sử Việt Nam cổ - trung đại', 'Thời kỳ Bắc thuộc, Chiến thắng Bạch Đằng 938 & Thời Lý - Trần', 'Nhận biết các mốc son lịch sử dân tộc; Đọc hiểu tư liệu lịch sử, phân tích kế sách cọc ngầm Bạch Đằng của Ngô Quyền', 'Câu 4, 5, 6, 7, 8 (1,25đ) & Câu 13 (1,00đ)'],
            ['3', 'Lịch sử Việt Nam hậu kỳ trung đại', 'Khởi nghĩa Lam Sơn, Thời Lê sơ & Phong trào Tây Sơn', 'Nhận biết lãnh tụ Lam Sơn, vua Lê Thánh Tông; Đọc hiểu tư liệu chiến thắng Ngọc Hồi - Đống Đa đại phá quân Thanh', 'Câu 9, 10, 11, 12 (1,00đ) & Câu 14 (1,00đ)'],
            ['4', 'Lịch sử Việt Nam hiện đại', 'Nguyễn Ái Quốc trở về Tổ quốc (1941) & Cách mạng tháng Tám (1945)', 'Đọc hiểu tư liệu Pác Bó và Hội nghị TƯ 8; Trình bày nguyên nhân thắng lợi và ý nghĩa lịch sử của Cách mạng tháng Tám', 'Câu 16 (1,00đ) & Câu 17 (1,00đ)'],
            ['5', 'Vận dụng thực tiễn & Trách nhiệm', 'Bài học "lấy dân làm gốc" & Trách nhiệm chủ quyền biển đảo', 'Vận dụng bài học lịch sử về đại đoàn kết toàn dân tộc; Liên hệ trách nhiệm học sinh với chủ quyền thiêng liêng của Tổ quốc', 'Câu 18 (2,00đ gồm 2 ý a, b)']
          ]
        },
        answerGuide: {
          mcqAnswers: [
            { q: 1, ans: 'B' }, { q: 2, ans: 'B' }, { q: 3, ans: 'B' }, { q: 4, ans: 'B' },
            { q: 5, ans: 'B' }, { q: 6, ans: 'B' }, { q: 7, ans: 'C' }, { q: 8, ans: 'B' },
            { q: 9, ans: 'A' }, { q: 10, ans: 'A' }, { q: 11, ans: 'B' }, { q: 12, ans: 'A' }
          ],
          essayGuide: [
            {
              question: 'Câu 13 (Đúng - Sai: Chiến thắng Bạch Đằng năm 938)',
              step: 'Thang điểm tính theo quy chuẩn Bộ GD&ĐT (Đúng 1 ý: 0,1đ; đúng 2 ý: 0,25đ; đúng 3 ý: 0,5đ; đúng 4 ý: 1,0đ):\n- Lệnh hỏi a) Đúng: Phản ánh kế sách độc đáo cắm cọc ngầm ở cửa biển.\n- Lệnh hỏi b) Sai: Hoằng Tháo là tướng trẻ, kiêu ngạo, ít kinh nghiệm thực chiến.\n- Lệnh hỏi c) Đúng: Kế sách cắm cọc bịt sắt kết hợp thủy triều thể hiện đỉnh cao nghệ thuật quân sự.\n- Lệnh hỏi d) Đúng: Chiến thắng lịch sử chấm dứt hơn 1000 năm Bắc thuộc, mở kỷ nguyên độc lập.',
              point: '1,00 điểm'
            },
            {
              question: 'Câu 14 (Đúng - Sai: Đại phá 29 vạn quân Thanh xuân 1789)',
              step: 'Thang điểm tính theo quy chuẩn Bộ GD&ĐT (Đúng 1 ý: 0,1đ; đúng 2 ý: 0,25đ; đúng 3 ý: 0,5đ; đúng 4 ý: 1,0đ):\n- Lệnh hỏi a) Đúng: Vua Quang Trung trực tiếp tổng chỉ huy chiến dịch Ngọc Hồi - Đống Đa.\n- Lệnh hỏi b) Đúng: Nghệ thuật hành quân thần tốc, vừa đi vừa tuyển quân và tổ chức duyệt binh ở Nghệ An.\n- Lệnh hỏi c) Sai: Cuộc kháng chiến diễn ra thần tốc chỉ trong vòng 5 ngày đêm Tết Kỷ Dậu, không kéo dài giằng co.\n- Lệnh hỏi d) Đúng: Đập tan hoàn toàn dã tâm xâm lược của phong kiến Mãn Thanh, bảo vệ toàn vẹn lãnh thổ.',
              point: '1,00 điểm'
            },
            {
              question: 'Câu 15 (Đúng - Sai: Chính sách kinh tế mới NEP của nước Nga)',
              step: 'Thang điểm tính theo quy chuẩn Bộ GD&ĐT (Đúng 1 ý: 0,1đ; đúng 2 ý: 0,25đ; đúng 3 ý: 0,5đ; đúng 4 ý: 1,0đ):\n- Lệnh hỏi a) Đúng: V.I. Lê-nin khởi xướng và được Đảng Bôn-sê-vích thông qua vào tháng 3-1921.\n- Lệnh hỏi b) Đúng: Thay thế chế độ trưng thu lương thực thừa bằng thuế lương thực là nội dung then chốt.\n- Lệnh hỏi c) Sai: NEP thực hiện toàn diện cả trong nông nghiệp, công nghiệp, thương nghiệp và tiền tệ.\n- Lệnh hỏi d) Đúng: Giúp nước Nga Xô viết phục hồi kinh tế và củng cố vững chắc chính quyền xô viết.',
              point: '1,00 điểm'
            },
            {
              question: 'Câu 16 (Đúng - Sai: Lãnh tụ Nguyễn Ái Quốc về nước 1941)',
              step: 'Thang điểm tính theo quy chuẩn Bộ GD&ĐT (Đúng 1 ý: 0,1đ; đúng 2 ý: 0,25đ; đúng 3 ý: 0,5đ; đúng 4 ý: 1,0đ):\n- Lệnh hỏi a) Đúng: Ngày 28-1-1941, Người trở về Tổ quốc sau 30 năm bôn ba tìm đường cứu nước.\n- Lệnh hỏi b) Đúng: Pác Bó (Hà Quảng, Cao Bằng) là căn cứ địa đầu tiên của cách mạng giải phóng dân tộc.\n- Lệnh hỏi c) Sai: Hội nghị TƯ 8 (5-1941) chủ trương đặt nhiệm vụ giải phóng dân tộc lên trên hết, trước hết.\n- Lệnh hỏi d) Đúng: Mặt trận Việt Minh là khối đại đoàn kết toàn dân tộc chuẩn bị cho Tổng khởi nghĩa tháng Tám.',
              point: '1,00 điểm'
            },
            {
              question: 'Câu 17 (Tự luận: Nguyên nhân & Ý nghĩa Cách mạng tháng Tám 1945)',
              step: '1. Nguyên nhân thắng lợi (0,5 điểm):\n- Nguyên nhân chủ quan: Truyền thống yêu nước nồng nàn; Sự lãnh đạo đúng đắn, sáng suốt của Đảng Cộng sản Đông Dương đứng đầu là Chủ tịch Hồ Chí Minh; Quá trình chuẩn bị chu đáo 15 năm (1930 - 1945); Khối liên minh công nông vững chắc.\n- Nguyên nhân khách quan: Thắng lợi vĩ đại của Hồng quân Liên Xô và phe Đồng minh tiêu diệt chủ nghĩa phát xít Nhật.\n2. Ý nghĩa lịch sử (0,5 điểm):\n- Đối với dân tộc: Phá tan xiềng xích thực dân Pháp hơn 80 năm và ách thống trị phát xít Nhật; Lật đổ chế độ phong kiến ngàn năm; Khai sinh nước Việt Nam Dân chủ Cộng hòa; Mở ra kỷ nguyên độc lập tự do.\n- Đối với quốc tế: Cổ vũ mạnh mẽ phong trào giải phóng dân tộc của các nước thuộc địa và phụ thuộc trên thế giới.',
              point: '1,00 điểm'
            },
            {
              question: 'Câu 18 (Tự luận: Bài học "Lấy dân làm gốc" & Trách nhiệm học sinh)',
              step: 'a) Phân tích bài học "lấy dân làm gốc" trong bảo vệ Tổ quốc (1,0 điểm):\n- Trong lịch sử: Trần Hưng Đạo từng căn dặn "Khoan thư sức dân để làm kế sâu rễ bền gốc, đó là thượng sách giữ nước". Nguyễn Trãi đúc kết: "Chở thuyền là dân, lật thuyền cũng là dân". Bác Hồ khẳng định: "Dễ trăm lần không dân cũng chịu, khó vạn lần dân liệu cũng xong".\n- Sức mạnh đại đoàn kết toàn dân tộc là cội nguồn của mọi thắng lợi chống giặc ngoại xâm. Khi ý Đảng hợp lòng dân thì muôn người như một, tạo nên bức tường thành bảo vệ vững chắc non sông.\nb) Liên hệ trách nhiệm bản thân học sinh THCS hiện nay (1,0 điểm):\n- Về học tập và rèn luyện: Chăm chỉ học tập, rèn luyện đạo đức, trau dồi tri thức khoa học và hiểu biết sâu sắc về lịch sử dân tộc (0,35đ).\n- Về ý thức chủ quyền: Luôn ghi nhớ và bảo vệ chủ quyền thiêng liêng đối với hai quần đảo Hoàng Sa và Trường Sa; Tuân thủ pháp luật, không chia sẻ thông tin sai lệch về lịch sử và chủ quyền quốc gia trên mạng xã hội (0,35đ).\n- Về hành động cụ thể: Tích cực tham gia các phong trào đền ơn đáp nghĩa, yêu chuộng hòa bình, sẵn sàng cống hiến sức trẻ xây dựng và bảo vệ Tổ quốc Việt Nam giàu đẹp (0,30đ).',
              point: '2,00 điểm'
            }
          ]
        }
      };

    case 'DIALI':
    case 'DIA':
      return {
        subjectId: 'DIALI',
        subjectName: 'Địa lí',
        grade,
        termCode,
        termTitle,
        examCode,
        timeMinutes: 45,
        schoolYear,
        parentAgency,
        schoolName,
        parts: [
          {
            title: 'PHẦN I. CÂU HỎI TRẮC NGHIỆM NHIỀU LỰA CHỌN',
            points: '3,0 điểm',
            instruction: 'Khoanh tròn vào một chữ cái A, B, C hoặc D đứng trước phương án trả lời đúng (12 câu, mỗi câu 0,25 điểm):',
            questions: [
              {
                num: 1,
                content: 'Dân tộc nào sau đây phân bố chủ yếu ở khu vực Trung du và miền núi Bắc Bộ?',
                options: ['A. Dân tộc Kinh', 'B. Dân tộc H Mông', 'C. Dân tộc Chăm', 'D. Dân tộc Khơ-me'],
                correctKey: 'B'
              },
              {
                num: 2,
                content: 'Tính đến nay, quy mô dân số nước ta đứng thứ mấy trong khu vực Đông Nam Á?',
                options: ['A. Thứ 1', 'B. Thứ 3', 'C. Thứ 5', 'D. Thứ 7'],
                correctKey: 'B'
              },
              {
                num: 3,
                content: 'Vùng có mật độ dân số cao nhất nước ta hiện nay là vùng nào sau đây?',
                options: ['A. Đồng bằng sông Hồng', 'B. Đồng bằng sông Cửu Long', 'C. Duyên hải miền Trung', 'D. Tây Nguyên'],
                correctKey: 'A'
              },
              {
                num: 4,
                content: 'Đặc điểm nổi bật của nguồn lao động nước ta hiện nay là:',
                options: ['A. Dồi dào, cần cù, sáng tạo nhưng thiếu lao động kỹ thuật cao', 'B. Tỉ lệ qua đào tạo đã chiếm tuyệt đại đa số', 'C. Phân bố rất đồng đều giữa các vùng miền', 'D. Tốc độ tăng lao động vượt xa tốc độ tăng dân số'],
                correctKey: 'A'
              },
              {
                num: 5,
                content: 'Cây công nghiệp lâu năm quan trọng hàng đầu ở vùng Tây Nguyên nước ta là:',
                options: ['A. Cây cao su', 'B. Cây cà phê', 'C. Cây hồ tiêu', 'D. Cây chè'],
                correctKey: 'B'
              },
              {
                num: 6,
                content: 'Ngành thủy sản nước ta bao gồm hai lĩnh vực chính là:',
                options: ['A. Khai thác và chế biến', 'B. Đánh bắt và nuôi trồng', 'C. Đánh bắt và xuất khẩu', 'D. Nuôi trồng và dịch vụ'],
                correctKey: 'B'
              },
              {
                num: 7,
                content: 'Khoáng sản nhiên liệu có trữ lượng lớn và vai trò chiến lược ở thềm lục địa phía Nam nước ta là:',
                options: ['A. Than đá', 'B. Dầu mỏ và khí tự nhiên', 'C. Bô-xít', 'D. Quặng sắt'],
                correctKey: 'B'
              },
              {
                num: 8,
                content: 'Đặc điểm nổi bật của khí hậu nhiệt đới ẩm gió mùa ở Việt Nam là:',
                options: ['A. Nhiệt độ cao quanh năm, mưa đều cả năm', 'B. Nhiệt độ trung bình năm cao, phân hóa thành 2 mùa mưa và khô rõ rệt', 'C. Lạnh quanh năm, lượng mưa thấp', 'D. Không chịu ảnh hưởng của các khối khí gió mùa'],
                correctKey: 'B'
              },
              {
                num: 9,
                content: 'Nhóm đất chiếm diện tích lớn nhất trên vùng đồi núi nước ta là:',
                options: ['A. Đất phù sa ngọt', 'B. Đất feralit trên các loại đá', 'C. Đất mùn thô trên núi cao', 'D. Đất cát pha ven biển'],
                correctKey: 'B'
              },
              {
                num: 10,
                content: 'Hai đồng bằng châu thổ lớn nhất cung cấp lương thực chủ yếu cho cả nước là:',
                options: ['A. Đồng bằng sông Hồng và Đồng bằng sông Cửu Long', 'B. Đồng bằng Thanh Hóa và Đồng bằng Nghệ An', 'C. Đồng bằng sông Cửu Long và Đồng bằng Bình - Trị - Thiên', 'D. Đồng bằng sông Mã và Đồng bằng sông Chu'],
                correctKey: 'A'
              },
              {
                num: 11,
                content: 'Căn cứ vào Atlat Địa lí Việt Nam, trung tâm công nghiệp lớn nhất cả nước là:',
                options: ['A. TP. Hồ Chí Minh', 'B. Hà Nội', 'C. Hải Phòng', 'D. Đà Nẵng'],
                correctKey: 'A'
              },
              {
                num: 12,
                content: 'Biển Đông có ý nghĩa chiến lược vô cùng quan trọng đối với nước ta về mặt:',
                options: ['A. Chỉ về mặt phát triển du lịch biển', 'B. Kinh tế, an ninh quốc phòng và giao thương quốc tế', 'C. Thu hút nguồn vốn viện trợ nhân đạo', 'D. Mở rộng địa giới hành chính đất liền'],
                correctKey: 'B'
              }
            ]
          },
          {
            title: 'PHẦN II. CÂU HỎI TRẮC NGHIỆM ĐÚNG - SAI',
            points: '3,0 điểm',
            instruction: 'Thí sinh trả lời từ câu 13 đến câu 15. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng (Đ) hoặc sai (S) (Mỗi ý đúng được 0,25 điểm):',
            questions: [
              {
                num: 'Câu 13 (1,0 điểm)',
                content: 'Cho đoạn thông tin sau:\n“Nước ta có bờ biển dài trên 3.260 km, vùng đặc quyền kinh tế rộng khoảng 1 triệu km². Biển nước ta giàu tài nguyên sinh vật và khoáng sản, nằm trên các tuyến hàng hải quốc tế huyết mạch kết nối Ấn Độ Dương và Thái Bình Dương.”\n\nNhận định tính Đúng/Sai của các mệnh đề sau:\n' +
                         'a) Nước ta có vùng biển rộng lớn với chiều dài bờ biển hơn 3.260 km.\n' +
                         'b) Vùng biển nước ta hoàn toàn nghèo nàn về tài nguyên hải sản và khoáng sản đáy biển.\n' +
                         'c) Vị trí địa lí của biển nước ta có ý nghĩa chiến lược về giao thương hàng hải quốc tế.\n' +
                         'd) Việc bảo vệ vững chắc chủ quyền biển đảo là nhiệm vụ cấp bách của toàn Đảng, toàn quân và toàn dân.',
                options: ['a) Đúng', 'b) Sai', 'c) Đúng', 'd) Đúng'],
                correctKey: 'a-Đ, b-S, c-Đ, d-Đ'
              },
              {
                num: 'Câu 14 (1,0 điểm)',
                content: 'Cho thông tin về tình hình sản xuất lúa gạo nước ta:\n“Việt Nam là một trong những quốc gia xuất khẩu gạo hàng đầu thế giới. Nhờ áp dụng khoa học kỹ thuật, giống lúa mới năng suất cao và chuyển đổi cơ cấu mùa vụ linh hoạt, sản lượng lúa không ngừng tăng, đảm bảo an ninh lương thực quốc gia.”\n\nNhận định tính Đúng/Sai của các mệnh đề sau:\n' +
                         'a) Sản xuất lúa gạo nước ta đã đáp ứng tốt nhu cầu trong nước và có vị thế xuất khẩu hàng đầu thế giới.\n' +
                         'b) Năng suất lúa tăng chủ yếu do mở rộng tối đa diện tích đất canh tác lên vùng núi cao.\n' +
                         'c) Ứng dụng tiến bộ khoa học kỹ thuật và giống lúa mới là nhân tố quyết định nâng cao năng suất và chất lượng lúa.\n' +
                         'd) Đồng bằng sông Cửu Long và Đồng bằng sông Hồng là hai vựa lúa lớn nhất của cả nước.',
                options: ['a) Đúng', 'b) Sai', 'c) Đúng', 'd) Đúng'],
                correctKey: 'a-Đ, b-S, c-Đ, d-Đ'
              },
              {
                num: 'Câu 15 (1,0 điểm)',
                content: 'Cho thông tin về tài nguyên rừng ở nước ta:\n“Rừng nước ta có vai trò cực kỳ quan trọng đối với việc duy trì cân bằng sinh thái, phòng chống thiên tai (lũ quét, xói mòn đất, sạt lở) và cung cấp lâm sản quý giá cho đời sống và công nghiệp chế biến.”\n\nNhận định tính Đúng/Sai của các mệnh đề sau:\n' +
                         'a) Rừng đầu nguồn có vai trò xung yếu trong việc giữ đất, điều tiết nguồn nước và hạn chế lũ lụt.\n' +
                         'b) Nhà nước ta chủ trương khai thác triệt để toàn bộ rừng đặc dụng để phát triển công nghiệp gỗ xuất khẩu.\n' +
                         'c) Độ che phủ rừng nước ta đang từng bước phục hồi nhờ các chính sách giao khoán và trồng rừng tích cực.\n' +
                         'd) Việc bảo vệ và phát triển vốn rừng là giải pháp thích ứng bền vững với biến đổi khí hậu.',
                options: ['a) Đúng', 'b) Sai', 'c) Đúng', 'd) Đúng'],
                correctKey: 'a-Đ, b-S, c-Đ, d-Đ'
              }
            ]
          },
          {
            title: 'PHẦN III. CÂU HỎI TRẮC NGHIỆM TRẢ LỜI NGẮN (ĐIỀN SỐ)',
            points: '1,0 điểm',
            instruction: 'Thí sinh tính toán và ghi đáp án ngắn gọn (số hoặc đơn vị) vào ô trả lời (2 câu, mỗi câu 0,5 điểm):',
            questions: [
              {
                num: 'Câu 16',
                points: '0,5 điểm',
                content: 'Câu 16 (0,5 điểm). Năm 2023, diện tích tự nhiên của nước ta là 331.345 km², dân số trung bình là 100,3 triệu người. Mật độ dân số nước ta năm 2023 là bao nhiêu người/km²? (Làm tròn đến hàng đơn vị).'
              },
              {
                num: 'Câu 17',
                points: '0,5 điểm',
                content: 'Câu 17 (0,5 điểm). Năm 2023, tổng sản lượng lúa cả nước đạt 43,5 triệu tấn, trong đó vụ đông xuân đạt 20,2 triệu tấn. Tỉ trọng sản lượng lúa đông xuân chiếm bao nhiêu phần trăm trong tổng sản lượng lúa cả nước? (Làm tròn đến 1 chữ số thập phân).'
              }
            ]
          },
          {
            title: 'PHẦN IV. TỰ LUẬN (3,0 ĐIỂM)',
            points: '3,0 điểm',
            questions: [
              {
                num: 'Câu 18',
                points: '2,0 điểm',
                content: 'Câu 18 (2,0 điểm). Dựa vào kiến thức địa lí đã học, em hãy:\na) Phân tích các nhân tố tự nhiên (địa hình, đất đai, nguồn nước, khí hậu) ảnh hưởng đến sự phát triển và phân bố ngành nông nghiệp ở nước ta (1,0 điểm).\nb) Giải thích tại sao trong những năm gần đây, nước ta lại đẩy mạnh phát triển nông nghiệp hàng hóa ứng dụng công nghệ cao và nông nghiệp hữu cơ? (1,0 điểm).'
              },
              {
                num: 'Câu 19',
                points: '1,0 điểm',
                content: 'Câu 19 (1,0 điểm). Là học sinh THCS, em hãy đề xuất 03 giải pháp hành động thiết thực của bản thân và gia đình nhằm góp phần bảo vệ tài nguyên môi trường biển đảo hoặc ứng phó với biến đổi khí hậu tại địa phương.'
              }
            ]
          }
        ],
        matrix: {
          headers: ['Mạch kiến thức Địa lí', 'Chủ đề đơn vị kiến thức (PPCT)', 'Phần I: TN 4 LC (NB)', 'Phần II: Đúng - Sai (TH)', 'Phần III: Trả lời ngắn (VD)', 'Phần IV: Tự luận (VD-VDC)', 'Tổng điểm', 'Tỉ lệ %'],
          rows: [
            ['Địa lí Dân cư & Lao động', 'Dân số, dân tộc, phân bố dân cư và việc làm', '4 câu (1,00đ)', '0', 'Câu 16 (0,50đ)', '0', '1,50 điểm', '15,0%'],
            ['Địa lí Các ngành kinh tế', 'Nông nghiệp, lâm nghiệp, thủy sản và công nghiệp', '5 câu (1,25đ)', 'Câu 14, 15 (2,00đ)', 'Câu 17 (0,50đ)', 'Câu 18 (2,00đ)', '5,75 điểm', '57,5%'],
            ['Biển đảo & Vấn đề môi trường', 'Vị trí chiến lược Biển Đông, tài nguyên và BĐKH', '3 câu (0,75đ)', 'Câu 13 (1,00đ)', '0', 'Câu 19 (1,00đ)', '2,75 điểm', '27,5%'],
            ['TỔNG ĐIỂM TOÀN BÀI', 'Chuẩn Công văn 7991/BGDĐT-GDTrH (45 phút)', '3,0 điểm (30%)', '3,0 điểm (30%)', '1,0 điểm (10%)', '3,0 điểm (30%)', '10,0 điểm', '100%']
          ]
        },
        specification: {
          headers: ['TT', 'Mạch kiến thức', 'Đơn vị kiến thức', 'Mức độ & Yêu cầu cần đạt chuẩn CTGDPT 2018', 'Câu hỏi & Phân bố điểm'],
          rows: [
            ['1', 'Địa lí dân cư', 'Dân số và phân bố dân cư', 'Nhận biết đặc điểm phân bố các dân tộc, quy mô dân số; Vận dụng tính mật độ dân số', 'Câu 1, 2, 3, 4 (1,00đ) & Câu 16 (0,50đ)'],
            ['2', 'Địa lí kinh tế', 'Nông nghiệp và thủy sản', 'Nhận biết cây trồng chủ lực, phân tích nhân tố tự nhiên ảnh hưởng nông nghiệp, tính tỉ trọng sản lượng lúa', 'Câu 5, 6, 7 (0,75đ), Câu 14 (1,00đ), Câu 17 (0,50đ), Câu 18 (2,00đ)'],
            ['3', 'Địa lí tự nhiên & Môi trường', 'Khí hậu, đất đai và tài nguyên rừng', 'Nhận biết đất feralit, khí hậu nhiệt đới gió mùa; Đánh giá vai trò của rừng phòng hộ đầu nguồn', 'Câu 8, 9, 10, 11 (1,00đ) & Câu 15 (1,00đ)'],
            ['4', 'Biển đảo Việt Nam', 'Chủ quyền Biển Đông & Bảo vệ tài nguyên', 'Nhận biết vị thế biển; Đọc hiểu tư liệu về biển đảo; Đề xuất giải pháp hành động bảo vệ môi trường biển', 'Câu 12 (0,25đ), Câu 13 (1,00đ) & Câu 19 (1,00đ)']
          ]
        },
        answerGuide: {
          mcqAnswers: [
            { q: 1, ans: 'B' }, { q: 2, ans: 'B' }, { q: 3, ans: 'A' }, { q: 4, ans: 'A' },
            { q: 5, ans: 'B' }, { q: 6, ans: 'B' }, { q: 7, ans: 'B' }, { q: 8, ans: 'B' },
            { q: 9, ans: 'B' }, { q: 10, ans: 'A' }, { q: 11, ans: 'A' }, { q: 12, ans: 'B' }
          ],
          essayGuide: [
            {
              question: 'Câu 13 (Đúng - Sai: Vị thế chiến lược vùng biển Việt Nam)',
              step: 'Thang điểm tính theo chuẩn Bộ GD&ĐT (Đúng mỗi ý 0,25đ):\n- Ý a) Đúng: Đường bờ biển nước ta dài trên 3.260 km, tiếp giáp vùng biển rộng khoảng 1 triệu km².\n- Ý b) Sai: Vùng biển nước ta giàu tài nguyên hải sản (ngư trường lớn) và khoáng sản dầu khí.\n- Ý c) Đúng: Nằm trên tuyến hàng hải huyết mạch Á - Âu, kết nối Ấn Độ Dương và Thái Bình Dương.\n- Ý d) Đúng: Bảo vệ toàn vẹn chủ quyền biển đảo là trách nhiệm thiêng liêng của toàn thể dân tộc.',
              point: '1,00 điểm'
            },
            {
              question: 'Câu 14 (Đúng - Sai: Sản xuất lúa gạo nước ta)',
              step: 'Thang điểm tính theo chuẩn Bộ GD&ĐT (Đúng mỗi ý 0,25đ):\n- Ý a) Đúng: Việt Nam là quốc gia xuất khẩu gạo đứng hàng đầu thế giới.\n- Ý b) Sai: Năng suất tăng do thâm canh, giống lúa mới và khoa học kỹ thuật, không phải mở rộng lên núi cao.\n- Ý c) Đúng: Khoa học công nghệ và bộ giống cải tiến là đòn bẩy nâng cao chất lượng và năng suất.\n- Ý d) Đúng: Đồng bằng sông Cửu Long và Đồng bằng sông Hồng là 2 vựa lúa trọng điểm.',
              point: '1,00 điểm'
            },
            {
              question: 'Câu 15 (Đúng - Sai: Tài nguyên rừng và bảo vệ vốn rừng)',
              step: 'Thang điểm tính theo chuẩn Bộ GD&ĐT (Đúng mỗi ý 0,25đ):\n- Ý a) Đúng: Rừng đầu nguồn điều tiết nước, giữ đất và chống xói mòn lũ quét.\n- Ý b) Sai: Rừng đặc dụng được bảo tồn nghiêm ngặt để giữ nguồn gen và đa dạng sinh học, tuyệt đối không khai thác trắng.\n- Ý c) Đúng: Các chương trình giao đất khoán rừng giúp nâng cao diện tích che phủ.\n- Ý d) Đúng: Trồng rừng và bảo vệ rừng là giải pháp then chốt giảm phát thải và chống biến đổi khí hậu.',
              point: '1,00 điểm'
            },
            {
              question: 'Câu 16 (Trả lời ngắn: Tính mật độ dân số)',
              step: 'Công thức: Mật độ dân số = Dân số / Diện tích\n= 100.300.000 người / 331.345 km² ≈ 303 người/km².\nĐáp án: 303 người/km².',
              point: '0,50 điểm'
            },
            {
              question: 'Câu 17 (Trả lời ngắn: Tính tỉ trọng sản lượng lúa vụ đông xuân)',
              step: 'Công thức: Tỉ trọng = (Sản lượng lúa đông xuân / Tổng sản lượng lúa) * 100%\n= (20,2 / 43,5) * 100% ≈ 46,4%.\nĐáp án: 46,4%.',
              point: '0,50 điểm'
            },
            {
              question: 'Câu 18 (Tự luận: Phân tích nhân tố tự nhiên ảnh hưởng nông nghiệp)',
              step: 'a) Phân tích các nhân tố tự nhiên (1,0 điểm):\n- Địa hình và đất đai: Đồng bằng đất phù sa màu mỡ thuận lợi phát triển lúa nước, hoa màu; Vùng đồi núi đất feralit thích hợp trồng cây công nghiệp lâu năm, cây ăn quả và chăn nuôi gia súc lớn (0,5đ).\n- Khí hậu và nguồn nước: Khí hậu nhiệt đới ẩm gió mùa có mùa đông lạnh ở miền Bắc cho phép trồng cây cận nhiệt và ôn đới, tăng vụ; Mạng lưới sông ngòi dày đặc cung cấp nước tưới dồi dào (0,5đ).\nb) Giải thích đẩy mạnh nông nghiệp công nghệ cao và hữu cơ (1,0 điểm):\n- Nhằm nâng cao giá trị gia tăng, đáp ứng tiêu chuẩn khắt khe của thị trường xuất khẩu và tiêu dùng trong nước (0,5đ).\n- Bảo vệ môi trường sinh thái, duy trì độ phì của đất và thích ứng linh hoạt với biến đổi khí hậu (0,5đ).',
              point: '2,00 điểm'
            },
            {
              question: 'Câu 19 (Tự luận: Giải pháp học sinh bảo vệ môi trường biển đảo)',
              step: '03 giải pháp hành động thiết thực của học sinh (1,0 điểm):\n1. Tích cực tham gia các phong trào làm sạch bờ biển, gom rác thải nhựa, không xả rác bừa bãi ra môi trường nước (0,35đ).\n2. Tiết kiệm năng lượng điện, nước tại trường học và gia đình; Tuyên truyền cho người thân sử dụng túi sinh học thay cho túi nilon khó phân hủy (0,35đ).\n3. Tìm hiểu kiến thức về chủ quyền biển đảo, tuyên truyền bạn bè về lòng tự hào và ý thức bảo vệ tài nguyên môi trường quê hương (0,30đ).',
              point: '1,00 điểm'
            }
          ]
        }
      };

    default:
      return getTHCS8MonExamSuite('TOAN', grade, termCode, examCode);
  }
}

/**
 * Hàm sinh chuỗi HTML Word tham khảo dành cho giáo viên template Bộ GD&ĐT và Công văn 7991/BGDĐT
 */
export function generateTHCS8MonWordHtml(data: THCS8MonExamData, isPro: boolean = false): string {
  const {
    subjectName, grade, termTitle, examCode, timeMinutes, schoolYear, parentAgency, schoolName,
    parts, matrix, specification, answerGuide
  } = data;

  // Render bảng điểm chuẩn Trường THCS (2 dòng kẻ giáo viên phê)
  const renderMarksTable = () => `
    <table style="width: 100%; border-collapse: collapse; margin-top: 4pt; margin-bottom: 8pt; page-break-inside: avoid;">
      <tr>
        <th colspan="2" style="border: 1px solid #000; padding: 3pt; text-align: center; font-size: 11.5pt; width: 25%;"><b>Điểm</b></th>
        <th rowspan="2" style="border: 1px solid #000; padding: 3pt; text-align: center; font-size: 11.5pt; width: 75%;"><b>Lời phê của thầy, cô giáo</b></th>
      </tr>
      <tr>
        <th style="border: 1px solid #000; padding: 2pt; text-align: center; font-size: 11pt; width: 12.5%;"><b>Điểm số</b></th>
        <th style="border: 1px solid #000; padding: 2pt; text-align: center; font-size: 11pt; width: 12.5%;"><b>Điểm chữ</b></th>
      </tr>
      <tr style="height: 46pt;">
        <td style="border: 1px solid #000; padding: 2pt; text-align: center;">&nbsp;</td>
        <td style="border: 1px solid #000; padding: 2pt; text-align: center;">&nbsp;</td>
        <td style="border: 1px solid #000; padding: 4pt 8pt; vertical-align: top; font-size: 10.5pt; line-height: 1.6;">
          ___________________________________________________________<br/>
          ___________________________________________________________
        </td>
      </tr>
    </table>
  `;

  // Render các phần thi
  const renderExamParts = () => {
    let html = '';
    parts.forEach((p) => {
      html += `
        <div style="margin-top: 8pt; margin-bottom: 4pt;">
          <span style="color: #FF0000; font-weight: bold; font-size: 13pt;">${p.title} (${p.points})</span>
        </div>
      `;
      if (p.instruction) {
        html += `<div style="font-style: italic; font-size: 11.5pt; margin-bottom: 4pt;">${p.instruction}</div>`;
      }
      if (p.passage) {
        html += `
          <div style="text-align: justify; margin: 4pt 0 8pt 16pt; padding: 4pt 8pt; border-left: 2px solid #999; font-style: italic; font-size: 12pt; white-space: pre-line;">
            ${p.passage}
          </div>
        `;
      }
      p.questions.forEach((q) => {
        html += `
          <div style="margin-top: 4pt; margin-bottom: 2pt; font-size: 13pt; text-align: justify;">
            <b>${typeof q.num === 'number' ? `Câu ${q.num}:` : `${q.num}${q.points ? ` (${q.points}):` : ':'}`}</b> ${q.content.replace(/\n/g, '<br/>')}
          </div>
        `;
        if (q.options && q.options.length > 0) {
          html += `<table style="width: 100%; border: none; margin-left: 12pt; margin-bottom: 4pt;"><tr>`;
          q.options.forEach((opt) => {
            const isCorrect = q.correctKey && (opt.startsWith(q.correctKey + '.') || opt.includes('(Đúng)'));
            html += `
              <td style="border: none; padding: 2pt 4pt; font-size: 12.5pt; width: 25%;">
                ${isCorrect ? `<b style="color: #FF0000;">${opt}</b>` : opt}
              </td>
            `;
          });
          html += `</tr></table>`;
        }
      });
    });
    return html;
  };

  return `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>De_Kiem_Tra_${subjectName}_Lop_${grade}_${examCode}</title>
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
          size: 210mm 297mm; /* Khổ A4 chuẩn */
          margin: 20mm 20mm 20mm 20mm; /* Lề chuẩn Bộ GD&ĐT 2.0cm */
        }
        body {
          font-family: 'Times New Roman', Times, serif;
          font-size: 13pt;
          line-height: 1.2;
          color: #000000;
        }
        p, div {
          margin-top: 2pt;
          margin-bottom: 2pt;
          line-height: 1.2;
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
          padding: 3.5pt 5pt;
        }
        .bg-head {
          background-color: #F0F4F8;
        }
        .bg-total {
          background-color: #E2E8F0;
        }
      </style>
    </head>
    <body>

      <!-- =================================================================== -->
      <!-- PHẦN 1: ĐỀ KIỂM TRA CHÍNH THỨC                                     -->
      <!-- =================================================================== -->
      <table style="width: 100%; border: none; border-collapse: collapse; margin-bottom: 4pt; page-break-inside: avoid;">
        <tr>
          <td style="width: 33%; text-align: center; vertical-align: top; font-size: 11.5pt; border: none; padding: 0;">
            <b>${parentAgency}</b><br/>
            <b style="text-decoration: underline;">${schoolName}</b>
          </td>
          <td style="width: 67%; text-align: center; vertical-align: top; font-size: 11.5pt; border: none; padding: 0;">
            <b style="font-size: 12.5pt;">BÀI KIỂM TRA ĐÁNH GIÁ ${termTitle.toUpperCase()}</b><br/>
            <b>NĂM HỌC: ${schoolYear}</b><br/>
            <b>Môn: ${subjectName} ${grade}</b><br/>
            <i>Thời gian làm bài: ${timeMinutes} phút (Không kể thời gian phát đề)</i>
          </td>
        </tr>
      </table>

      <!-- Dòng Họ tên học sinh & Mã đề chuẩn -->
      <div style="margin-top: 4pt; margin-bottom: 2pt; font-size: 12.5pt;">
        Họ và tên: __________________________, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Lớp: ${grade}A___ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Mã đề: ${examCode}</b>
      </div>

      ${renderMarksTable()}

      <!-- Nội dung đề thi -->
      ${renderExamParts()}

      <!-- Dòng kết thúc đề -->
      <div style="text-align: center; margin-top: 14pt; margin-bottom: 6pt; font-style: italic; font-size: 11pt;">
        ---------- HẾT ----------<br/>
        <span style="font-size: 10pt;">(Giáo viên coi kiểm tra không giải thích gì thêm. Giữ nguyên định dạng chuẩn Times New Roman 13pt khi in ấn)</span>
      </div>

      <!-- =================================================================== -->
      <!-- PHẦN 2: MA TRẬN ĐỀ KIỂM TRA (CÔNG VĂN 7991/BGDĐT)                  -->
      <!-- =================================================================== -->
      <br clear="all" style="page-break-before: always; mso-break-type: section-break;" />

      <div style="text-align: center; margin-bottom: 8pt;">
        <div style="font-size: 11pt;">${parentAgency} - ${schoolName}</div>
        <div style="font-weight: bold; font-size: 12.5pt; color: #FF0000;">
          MA TRẬN ĐỀ KIỂM TRA ${termTitle.toUpperCase()} - NĂM HỌC ${schoolYear}
        </div>
        <div style="font-weight: bold; font-size: 11.5pt;">
          MÔN: ${subjectName.toUpperCase()} ${grade} - THỜI GIAN LÀM BÀI: ${timeMinutes} PHÚT
        </div>
        <div style="font-style: italic; font-size: 10pt;">
          (Khung ma trận theo Công văn số 7991/BGDĐT-GDTrH của Bộ Giáo dục và Đào tạo)
        </div>
      </div>

      <table class="tbl-border" style="font-size: 8.5pt; text-align: center; margin-bottom: 12pt; page-break-inside: avoid;">
        <tr class="bg-head">
          ${matrix.headers.map(h => `<th style="padding: 3.5pt;"><b>${h}</b></th>`).join('')}
        </tr>
        ${matrix.rows.map(row => {
          const isTotal = String(row[0]).startsWith('TỔNG');
          const cls = isTotal ? 'class="bg-total"' : '';
          return `
            <tr ${cls}>
              ${row.map((val, idx) => `
                <td style="padding: 3pt; text-align: ${idx === 1 ? 'left' : 'center'}; ${isTotal ? 'font-weight: bold;' : ''}">
                  ${val}
                </td>
              `).join('')}
            </tr>
          `;
        }).join('')}
      </table>

      <!-- =================================================================== -->
      <!-- PHẦN 3: BẢN ĐẶC TẢ KỸ THUẬT ĐỀ KIỂM TRA                             -->
      <!-- =================================================================== -->
      <div style="text-align: center; margin-top: 10pt; margin-bottom: 6pt;">
        <div style="font-weight: bold; font-size: 12pt; color: #FF0000;">
          BẢN ĐẶC TẢ KỸ THUẬT ĐỀ KIỂM TRA ${termTitle.toUpperCase()}
        </div>
        <div style="font-weight: bold; font-size: 11pt;">MÔN: ${subjectName.toUpperCase()} - LỚP ${grade}</div>
      </div>

      <table class="tbl-border" style="font-size: 8.5pt; margin-bottom: 12pt; page-break-inside: avoid;">
        <tr class="bg-head">
          ${specification.headers.map(h => `<th style="text-align: center; padding: 3.5pt;"><b>${h}</b></th>`).join('')}
        </tr>
        ${specification.rows.map(row => `
          <tr>
            ${row.map((val, idx) => `
              <td style="padding: 3pt; text-align: ${idx === 0 || idx >= 4 ? 'center' : 'left'};">
                ${String(val).replace(/\n/g, '<br/>')}
              </td>
            `).join('')}
          </tr>
        `).join('')}
      </table>

      <!-- =================================================================== -->
      <!-- PHẦN 4: HƯỚNG DẪN CHẤM & ĐÁP ÁN CHI TIẾT                            -->
      <!-- =================================================================== -->
      <br clear="all" style="page-break-before: always; mso-break-type: section-break;" />

      <div style="text-align: center; margin-bottom: 8pt;">
        <div style="font-weight: bold; font-size: 11.5pt; text-align: left; margin-bottom: 2pt;">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${parentAgency}<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span style="text-decoration: underline;">${schoolName}</span>
        </div>
        <div style="text-align: center; margin-top: 2pt;">
          <div style="font-weight: bold; font-size: 13.5pt; color: #FF0000;">HƯỚNG DẪN CHẤM VÀ ĐÁP ÁN ĐỀ KIỂM TRA ${termTitle.toUpperCase()}</div>
          <div style="font-weight: bold; font-size: 12pt;">MÔN: ${subjectName.toUpperCase()} - LỚP ${grade} | MÃ ĐỀ: ${examCode}</div>
        </div>
        <div style="font-weight: bold; font-size: 12pt;">
          MÔN: ${subjectName.toUpperCase()} - LỚP ${grade} | MÃ ĐỀ: ${examCode}
        </div>
      </div>

      <!-- Bảng đáp án trắc nghiệm -->
      <div style="font-weight: bold; font-size: 12pt; color: #000; margin-top: 6pt; margin-bottom: 3pt;">
        1. ĐÁP ÁN PHẦN TRẮC NGHIỆM ${!isPro ? '<span style="color: #FF0000; font-size: 11pt;">(Bản dùng thử: Hiển thị 1/2 số câu - Nâng cấp Pro để mở khóa 100%)</span>' : ''}:
      </div>
      <table class="tbl-border" style="font-size: 10pt; text-align: center; margin-bottom: 10pt;">
        <tr class="bg-head">
          <th style="width: 15%;">Câu</th>
          ${answerGuide.mcqAnswers.slice(0, 8).map(m => `<th style="padding: 3pt;">${m.q}</th>`).join('')}
        </tr>
        <tr>
          <td style="font-weight: bold; background-color: #F8F9FA;">Đáp án</td>
          ${answerGuide.mcqAnswers.slice(0, 8).map((m, idx) => {
            const isLocked = !isPro && idx >= Math.ceil(answerGuide.mcqAnswers.length / 2);
            return `<td style="font-weight: bold; color: ${isLocked ? '#888888' : '#FF0000'}; font-size: ${isLocked ? '9pt' : '12pt'}; padding: 3pt;">${isLocked ? '🔒 Pro' : m.ans}</td>`;
          }).join('')}
        </tr>
        ${answerGuide.mcqAnswers.length > 8 ? `
          <tr class="bg-head">
            <th style="width: 15%;">Câu</th>
            ${answerGuide.mcqAnswers.slice(8).map(m => `<th style="padding: 3pt;">${m.q}</th>`).join('')}
          </tr>
          <tr>
            <td style="font-weight: bold; background-color: #F8F9FA;">Đáp án</td>
            ${answerGuide.mcqAnswers.slice(8).map((m, idx) => {
              const realIdx = 8 + idx;
              const isLocked = !isPro && realIdx >= Math.ceil(answerGuide.mcqAnswers.length / 2);
              return `<td style="font-weight: bold; color: ${isLocked ? '#888888' : '#FF0000'}; font-size: ${isLocked ? '9pt' : '12pt'}; padding: 3pt;">${isLocked ? '🔒 Pro' : m.ans}</td>`;
            }).join('')}
          </tr>
        ` : ''}
      </table>

      <!-- Hướng dẫn chấm tự luận -->
      <div style="font-weight: bold; font-size: 12pt; color: #000; margin-top: 8pt; margin-bottom: 3pt;">
        2. HƯỚNG DẪN CHẤM VÀ BIỂU ĐIỂM CHI TIẾT PHẦN TỰ LUẬN:
      </div>
      <table class="tbl-border" style="font-size: 10.5pt; margin-bottom: 12pt;">
        <tr class="bg-head">
          <th style="width: 18%; text-align: center; padding: 3.5pt;"><b>Câu / Bài</b></th>
          <th style="width: 67%; text-align: center; padding: 3.5pt;"><b>Nội dung đáp án & Các bước thực hiện</b></th>
          <th style="width: 15%; text-align: center; padding: 3.5pt;"><b>Điểm</b></th>
        </tr>
        ${answerGuide.essayGuide.map((item, idx) => {
          const isLocked = !isPro && idx >= Math.ceil(answerGuide.essayGuide.length / 2);
          return `
            <tr>
              <td style="font-weight: bold; text-align: center; padding: 3pt;">${item.question}</td>
              <td style="padding: 3pt 6pt; text-align: justify; color: ${isLocked ? '#888888' : '#FF0000'}; font-weight: 500; font-style: ${isLocked ? 'italic' : 'normal'};">
                ${isLocked ? '🔒 [KHÓA BẢN QUYỀN PRO] Quý Thầy/Cô vui lòng nâng cấp bản quyền Pro để xem toàn bộ lời giải chi tiết, các bước thực hiện và thang điểm chuẩn (Hotline / Zalo Thầy Thành: 0915.213717).' : item.step.replace(/\n/g, '<br/>')}
              </td>
              <td style="font-weight: bold; text-align: center; padding: 3pt; color: #FF0000;">
                ${isLocked ? '🔒' : item.point}
              </td>
            </tr>
          `;
        }).join('')}
      </table>

      ${!isPro ? `
      <!-- BANNER QUẢNG CÁO NÂNG CẤP BẢN QUYỀN PRO SƯ PHẠM -->
      <table style="width: 100%; border: 2px dashed #E11D48; background-color: #FFF1F2; margin-top: 10pt; margin-bottom: 14pt; padding: 8pt; page-break-inside: avoid;">
        <tr>
          <td style="border: none; text-align: center; padding: 8pt; font-family: 'Times New Roman', serif;">
            <div style="font-size: 13pt; font-weight: bold; color: #BE123C; text-transform: uppercase;">
              ⭐ THÔNG BÁO: ĐÂY LÀ ĐỀ THI TRẢI NGHIỆM DÙNG THỬ (HIỂN THỊ 1/2 ĐÁP ÁN) ⭐
            </div>
            <div style="font-size: 11pt; color: #333333; margin-top: 4pt; line-height: 1.4;">
              Để mở khóa <b>100% toàn bộ đáp án</b>, lời giải chi tiết từng bước, ma trận 16 cột và tạo đề không giới hạn số lượng,<br/>
              kính mời Thầy/Cô liên hệ tác giả để nhận tư vấn và kích hoạt bản quyền Pro ưu đãi sư phạm:
            </div>
            <div style="font-size: 12pt; font-weight: bold; color: #047857; margin-top: 6pt;">
              📞 TÁC GIẢ ĐINH THÀNH - ĐT: 0915.213717 (TRƯỜNG THCS)
            </div>
            <div style="font-size: 10pt; color: #666666; margin-top: 2pt;">
              Website chính thức: <b>https://dekiemtraso.com/</b>
            </div>
          </td>
        </tr>
      </table>
      ` : ''}

      <!-- Chữ ký người biên soạn & bản quyền tác giả -->
      <table style="width: 100%; border: none; margin-top: 14pt; page-break-inside: avoid;">
        <tr>
          <td style="width: 45%; text-align: center; border: none; font-size: 11pt;">
            <b>TỔ TRƯỞNG CHUYÊN MÔN</b><br/>
            <i>(Ký và ghi rõ họ tên)</i><br/><br/><br/><br/>
            ....................................................................
          </td>
          <td style="width: 55%; text-align: center; border: none; font-size: 11pt;">
            <i>.........., ngày ..... tháng ..... năm 2026</i><br/>
            <b>GIÁO VIÊN BIÊN SOẠN & PHẦN MỀM</b><br/>
            <i>(Đã kiểm duyệt tham khảo dành cho giáo viên CV 7991)</i><br/><br/><br/><br/>
            <b>Tác giả Đinh Thành, ĐT: 0915.213717</b><br/>
            <span style="font-size: 9.5pt; color: #444;">Tác giả Đinh Thành, ĐT/Zalo: 0915.213717</span>
          </td>
        </tr>
      </table>

    </body>
    </html>
  `;
}

/**
 * Tải file Word (.doc) trực tiếp về máy tính người dùng
 */
export function downloadTHCS8MonWordDoc(
  subjectId: string,
  grade: string = '7',
  termCode: string = 'GK1',
  examCode: string = '701',
  isPro: boolean = false
): void {
  const data = getTHCS8MonExamSuite(subjectId, grade, termCode, examCode);
  const htmlDoc = generateTHCS8MonWordHtml(data, isPro);
  const blob = new Blob(['\ufeff', htmlDoc], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  
  const subjectSlugMap: Record<string, string> = {
    TOAN: 'Toan',
    VAN: 'Ngu_Van',
    ENG: 'Tieng_Anh',
    KHTN: 'KHTN',
    DIALI: 'Dia_Li',
  SUDIA: 'Lich_Su_Dia_Li',
    TIN: 'Tin_Hoc',
    GDCD: 'GDCD',
    CN: 'Cong_Nghe'
  };
  const slug = subjectSlugMap[subjectId] || subjectId;
  a.download = `De_Kiem_Tra_${slug}_Lop_${grade}_${termCode}_MaDe_${examCode}_CV7991.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
