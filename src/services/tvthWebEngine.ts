// ============================================================================
// ĐỘNG CƠ TẠO ĐỀ TIẾNG VIỆT TIỂU HỌC WEB ENGINE (LỚP 1 - LỚP 5)
// Bám sát 100% Sách Giáo Khoa KẾT NỐI TRI THỨC VỚI CUỘC SỐNG & TT 27/2020/TT-BGDĐT
// Tác giả Đinh Thành, ĐT: 0915.213717
// ============================================================================

export interface TVTHEntry {
  grade: number; // 1, 2, 3, 4, 5
  term: 'GK1' | 'CK1' | 'GK2' | 'CK2';
  termLabel: string;
  readingDoc: {
    title: string;
    author?: string;
    passage: string;
    questions: {
      num: number;
      stem: string;
      options?: string[];
      correctAnswer: string;
      level: string; // 'Mức 1', 'Mức 2', 'Mức 3'
    }[];
  };
  readingOral: {
    passage: string;
    question: string;
  };
  dictationText: {
    title: string;
    passage: string;
  };
  writingTask: {
    topic: string;
    guidelines: string[];
  };
}

export const TVTH_DATA: TVTHEntry[] = [
  // LỚP 1
  {
    grade: 1,
    term: 'GK1',
    termLabel: 'Giữa Học Kỳ 1 (Lớp 1)',
    readingOral: {
      passage: 'Bé Hà đi học. Hà có cặp mới, có bảng con. Hà chăm ngoan, được cô giáo khen.',
      question: 'Bé Hà được cô giáo khen vì điều gì?'
    },
    readingDoc: {
      title: 'EM BÉ CHĂM NGOAN',
      passage: 'Bé Nam rất chăm chỉ. Sáng nào Nam cũng dậy sớm, chải răng, rửa mặt rồi tung tăng đến trường. Ở lớp, Nam chú ý nghe cô giảng bài.',
      questions: [
        {
          num: 1,
          stem: 'Sáng dậy Nam làm những việc gì?',
          options: ['A. Rửa mặt, chải răng rồi đến trường', 'B. Đi chơi với bạn', 'C. Xem ti vi', 'D. Nằm ngủ tiếp'],
          correctAnswer: 'A. Rửa mặt, chải răng rồi đến trường',
          level: 'Mức 1'
        },
        {
          num: 2,
          stem: 'Ở lớp Nam học tập như thế nào?',
          options: ['A. Nói chuyện riêng', 'B. Chú ý nghe cô giảng bài', 'C. Làm việc riêng', 'D. Hay đi muộn'],
          correctAnswer: 'B. Chú ý nghe cô giảng bài',
          level: 'Mức 1'
        },
        {
          num: 3,
          stem: 'Tìm trong bài tiếng có vần "am":',
          correctAnswer: 'Tiếng "Nam", tiếng "chăm".',
          level: 'Mức 2'
        }
      ]
    },
    dictationText: {
      title: 'TẬP VIẾT CHỮ MỚI',
      passage: 'Bé tập viết chữ o, chữ a. Cây cam nhà bé sai trĩu quả.'
    },
    writingTask: {
      topic: 'Tập chép và viết tiếp nét chữ:',
      guidelines: ['Học sinh nhìn mẫu và chép lại đúng nét, đúng cỡ chữ 4 dòng ô li.']
    }
  },
  {
    grade: 1,
    term: 'CK1',
    termLabel: 'Cuối Học Kỳ 1 (Lớp 1)',
    readingOral: {
      passage: 'Gió mùa đông bắc về. Cây cối khẳng khẳng trút lá. Bé quàng khăn ấm đi học.',
      question: 'Khi gió mùa đông bắc về, bé chuẩn bị đi học như thế nào?'
    },
    readingDoc: {
      title: 'GÓC NHỎ CỦA EM',
      passage: 'Góc học tập của Linh rất gọn gàng. Sách vở xếp ngăn nắp trên kệ. Bàn học kê cạnh cửa sổ nhìn ra vườn cây xanh mát.',
      questions: [
        {
          num: 1,
          stem: 'Góc học tập của Linh như thế nào?',
          options: ['A. Rất bừa bãi', 'B. Rất gọn gàng, ngăn nắp', 'C. Nhiều bụi bẩn', 'D. Đầy đồ chơi'],
          correctAnswer: 'B. Rất gọn gàng, ngăn nắp',
          level: 'Mức 1'
        },
        {
          num: 2,
          stem: 'Bàn học của Linh kê ở đâu?',
          options: ['A. Ở trong góc tối', 'B. Cạnh cửa sổ nhìn ra vườn', 'C. Cạnh bếp ăn', 'D. Ở ngoài sân'],
          correctAnswer: 'B. Cạnh cửa sổ nhìn ra vườn',
          level: 'Mức 1'
        },
        {
          num: 3,
          stem: 'Điền vào chỗ trống: "c" hay "k"? ...o co, ...ẻ vạch',
          correctAnswer: 'co co, kẻ vạch (Trước e, ê, i điền k).',
          level: 'Mức 2'
        }
      ]
    },
    dictationText: {
      title: 'MÙA XUÂN ĐẾN',
      passage: 'Mùa xuân đến, hoa đào nở thắm. Bướm vàng tung tăng bay lượn trong vườn.'
    },
    writingTask: {
      topic: 'Viết 1 - 2 câu nói về ngôi nhà hoặc góc học tập của em:',
      guidelines: ['Gợi ý: Ngôi nhà em ở đâu? Em yêu quý góc học tập của mình như thế nào?']
    }
  },

  // LỚP 2
  {
    grade: 2,
    term: 'GK1',
    termLabel: 'Giữa Học Kỳ 1 (Lớp 2)',
    readingOral: {
      passage: 'Ngày khai trường đã đến. Tiếng trống trường vang lên rộn rã: "Tùng! Tùng! Tùng!". Chúng em hân hoan bước vào năm học mới.',
      question: 'Tiếng trống trường khai giảng kêu như thế nào?'
    },
    readingDoc: {
      title: 'TÔI ĐI HỌC (SGK KNTT)',
      passage: 'Mùa thu khai trường đã đến. Đường làng rợp bóng cây xanh. Các bạn nhỏ tung tăng trong bộ đồng phục mới. Ai ai cũng háo hức gặp lại thầy cô và bạn bè sau kỳ nghỉ hè vui tươi.',
      questions: [
        {
          num: 1,
          stem: 'Các bạn nhỏ tung tăng đi học trong bộ trang phục nào?',
          options: ['A. Quần áo ở nhà', 'B. Bộ đồng phục mới', 'C. Trang phục thể thao', 'D. Quần áo đá bóng'],
          correctAnswer: 'B. Bộ đồng phục mới',
          level: 'Mức 1'
        },
        {
          num: 2,
          stem: 'Các bạn nhỏ có cảm xúc gì khi gặp lại thầy cô, bạn bè?',
          options: ['A. Lo lắng', 'B. Háo hức, vui tươi', 'C. Buồn bã', 'D. Sợ hãi'],
          correctAnswer: 'B. Háo hức, vui tươi',
          level: 'Mức 1'
        },
        {
          num: 3,
          stem: 'Từ nào dưới đây là từ chỉ hoạt động?',
          options: ['A. Đồng phục', 'B. Thầy cô', 'C. Đi học', 'D. Bàn ghế'],
          correctAnswer: 'C. Đi học',
          level: 'Mức 2'
        },
        {
          num: 4,
          stem: 'Viết 1 câu giới thiệu về bản thân em:',
          correctAnswer: 'Ví dụ: Em tên là Nguyễn Văn An, học sinh lớp 2A trường Tiểu học.',
          level: 'Mức 3'
        }
      ]
    },
    dictationText: {
      title: 'NGÔI TRƯỜNG THÂN YÊU',
      passage: 'Ngôi trường của em nằm dưới hàng cây xanh mát. Nơi đây có thầy cô bao la tình thương và bạn bè chan hòa niềm vui.'
    },
    writingTask: {
      topic: 'Viết 3 - 4 câu giới thiệu về một người bạn thân ở lớp em.',
      guidelines: ['• Bạn em tên là gì?', '• Bạn có ngoại hình hoặc tính cách gì đáng yêu?', '• Tình cảm của em đối với bạn ra sao?']
    }
  },
  {
    grade: 2,
    term: 'CK1',
    termLabel: 'Cuối Học Kỳ 1 (Lớp 2)',
    readingOral: {
      passage: 'Vườn cây nhà ông nội rợp bóng mát. Những chùm nhãn chín vàng ươm tỏa hương thơm phức.',
      question: 'Vườn cây nhà ông nội có quả gì chín vàng ươm?'
    },
    readingDoc: {
      title: 'BÀ CHÁU (SGK KNTT)',
      passage: 'Đêm đã về khuya. Hai anh em nằm bên bà ấm áp. Bà kể cho hai cháu nghe câu chuyện tích xưa. Giọng bà trầm ấm đưa hai anh em vào giấc ngủ êm đềm với bao mơ ước đẹp đẽ.',
      questions: [
        {
          num: 1,
          stem: 'Giọng kể chuyện của bà như thế nào?',
          options: ['A. Thắt lại', 'B. Trầm ấm, êm đềm', 'C. To tiếng', 'D. Nghiêm khắc'],
          correctAnswer: 'B. Trầm ấm, êm đềm',
          level: 'Mức 1'
        },
        {
          num: 2,
          stem: 'Hai anh em cảm thấy thế nào khi nằm bên bà?',
          options: ['A. Ấm áp và bình yên', 'B. Lạnh lẽo', 'C. Sợ hãi', 'D. Nhút nhát'],
          correctAnswer: 'A. Ấm áp và bình yên',
          level: 'Mức 1'
        },
        {
          num: 3,
          stem: 'Đặt câu hỏi cho bộ phận in đậm: "Hai anh em **rất yêu quý bà**."',
          correctAnswer: 'Hai anh em thế nào?',
          level: 'Mức 2'
        }
      ]
    },
    dictationText: {
      title: 'CÂY DỪA NƯỚC',
      passage: 'Cây dừa xanh tốt rủ tán lá xuôi dòng nước. Những chùm quả dừa đu đưa trong gió biển mát rượi.'
    },
    writingTask: {
      topic: 'Viết 4 - 5 câu tả một đồ dùng học tập mà em yêu thích (bút chì, thước kẻ hoặc hộp bút).',
      guidelines: ['• Đó là đồ dùng gì?', '• Hình dáng, màu sắc ra sao?', '• Em giữ gìn đồ dùng đó như thế nào?']
    }
  },

  // LỚP 3
  {
    grade: 3,
    term: 'GK1',
    termLabel: 'Giữa Học Kỳ 1 (Lớp 3)',
    readingOral: {
      passage: 'Mùa thu về mang theo không khí se lạnh nhẹ nhàng. Những chiếc lá vàng khẽ rơi trên con đường quen thuộc dẫn tới trường.',
      question: 'Mùa thu mang theo không khí như thế nào?'
    },
    readingDoc: {
      title: 'MÙA THU CỦA EM (SGK KNTT)',
      passage: 'Mùa thu của em\nLà vàng hoa cúc\nNhư gom nắng hạ\nTrong màu hương thơm.\n\nMùa thu của em\nLà xanh cốm mới\nMùi rơm nếp thắm\nTrải khắp đồng quê.',
      questions: [
        {
          num: 1,
          stem: 'Mùa thu của bạn nhỏ gắn liền với màu hoa nào?',
          options: ['A. Hoa phượng đỏ', 'B. Hoa cúc vàng', 'C. Hoa sen hồng', 'D. Hoa mai trắng'],
          correctAnswer: 'B. Hoa cúc vàng',
          level: 'Mức 1'
        },
        {
          num: 2,
          stem: 'Hương thơm của mùa thu ở đồng quê gợi nhớ đến điều gì?',
          options: ['A. Hương cốm mới và mùi rơm nếp', 'B. Mùi bánh ngọt', 'C. Hương hoa hồng', 'D. Mùi mưa rào'],
          correctAnswer: 'A. Hương cốm mới và mùi rơm nếp',
          level: 'Mức 1'
        },
        {
          num: 3,
          stem: 'Tìm hình ảnh so sánh trong khổ thơ 1:',
          correctAnswer: 'Hoa cúc vàng được so sánh như "gom nắng hạ".',
          level: 'Mức 2'
        },
        {
          num: 4,
          stem: 'Viết 1 câu có sử dụng phép so sánh tả cảnh mùa thu:',
          correctAnswer: 'Ví dụ: Nắng mùa thu vàng dịu như mคำ tơ tăm.',
          level: 'Mức 3'
        }
      ]
    },
    dictationText: {
      title: 'CÁNH ĐỒNG MÙA GẶT',
      passage: 'Cánh đồng lúa chín trải dài như một tấm thảm sẻ thắm vàng ruộm. Tiếng máy gặt reo vui hối hả khắp các thôn xóm.'
    },
    writingTask: {
      topic: 'Viết đoạn văn từ 5 - 7 câu kể về một việc tốt em đã làm để bảo vệ môi trường.',
      guidelines: ['• Em đã làm việc tốt gì? (Nhặt rác, trồng cây, tiết kiệm nước...)', '• Em làm việc đó cùng với ai và ở đâu?', '• Nêu cảm xúc của em sau khi hoàn thành công việc.']
    }
  },

  // LỚP 4
  {
    grade: 4,
    term: 'GK1',
    termLabel: 'Giữa Học Kỳ 1 (Lớp 4)',
    readingOral: {
      passage: 'Việt Nam đất nước ta ơi! Mơ thung lúa chín thơm tho vang ngàn. Cánh cò bay lả bay la, dải núi mờ xa quyện trong mây trắng.',
      question: 'Cánh cò bay như thế nào trên đất nước ta?'
    },
    readingDoc: {
      title: 'CÁNH ĐỒNG HOA (SGK KNTT LỚP 4)',
      passage: 'Thảo nguyên bao la ngập tràn muôn sắc hoa tươi thắm. Những luống hoa cải vàng rực rỡ dưới ánh nắng ban mai. Càng bước sâu vào lòng thảo nguyên, hương hoa nhẹ nhàng lan tỏa khiến tâm hồn người du khách trở nên thư thái, bình yên đến lạ kỳ.',
      questions: [
        {
          num: 1,
          stem: 'Thảo nguyên ngập tràn màu sắc rực rỡ của loài hoa nào?',
          options: ['A. Hoa cải vàng', 'B. Hoa hướng dương', 'C. Hoa hồng đỏ', 'D. Hoa ly trắng'],
          correctAnswer: 'A. Hoa cải vàng',
          level: 'Mức 1'
        },
        {
          num: 2,
          stem: 'Cảm giác của người du khách khi bước sâu vào cánh đồng hoa là gì?',
          options: ['A. Mệt mỏi', 'B. Thư thái, bình yên đến lạ kỳ', 'C. Căng thẳng', 'D. Chán nản'],
          correctAnswer: 'B. Thư thái, bình yên đến lạ kỳ',
          level: 'Mức 1'
        },
        {
          num: 3,
          stem: 'Xác định danh từ, động từ, tính từ trong câu: "Những luống hoa cải **nở rực rỡ**."',
          correctAnswer: 'Danh từ: luống hoa cải; Động từ: nở; Tính từ: rực rỡ.',
          level: 'Mức 2'
        },
        {
          num: 4,
          stem: 'Viết 1 câu văn mở rộng thành phần trạng ngữ chỉ thời gian hoặc nơi chốn tả quê hương em.',
          correctAnswer: 'Ví dụ: Mỗi buổi sáng sớm, quê hương em lại vang rộn tiếng chim hót chuyền cành.',
          level: 'Mức 3'
        }
      ]
    },
    dictationText: {
      title: 'VÀM CỎ ĐÔNG',
      passage: 'Ở đây Vàm Cỏ Đông, dòng sông xanh biên biếc. Dòng sông quê hương tha thiết, chở nặng phù sa nuôi dưỡng muôn cây.'
    },
    writingTask: {
      topic: 'Viết bài văn ngắn (từ 8 - 10 câu) tả một cây bóng mát (cây bàng, cây phượng hoặc cây xà cừ) ở trường em.',
      guidelines: ['• Tả bao quát cây (chiều cao, tán lá).', '• Tả chi tiết các bộ phận (rễ, thân, lá, hoa hoặc quả).', '• Nêu ý nghĩa của cây đối với tuổi học trò.']
    }
  },

  // LỚP 5
  {
    grade: 5,
    term: 'GK1',
    termLabel: 'Giữa Học Kỳ 1 (Lớp 5)',
    readingOral: {
      passage: 'Trước cổng trời, mây mù bao phủ ngút ngàn. Những dãy núi đá vôi hùng vĩ đứng sừng sững giữa không gian bao la của đất trời Tây Bắc.',
      question: 'Khung cảnh trước cổng trời được miêu tả như thế nào?'
    },
    readingDoc: {
      title: 'MÙA THẢO QUẢ (SGK KNTT LỚP 5)',
      passage: 'Thảo quả trên rừng Đăng Vài đã chín đỏ. Hương thảo quả thơm lừng ngất ngây, lan xa khắp các sườn núi. Gió đưa hương thơm ngọt lịm vào tận các thôn bản. Dưới tầng đáy rừng, thảo quả nổ rộ từng chùm chín chói lọi như những ngọn lửa hồng thắp sáng rừng xanh.',
      questions: [
        {
          num: 1,
          stem: 'Sự xuất hiện của hương thảo quả được miêu tả như thế nào?',
          options: ['A. Nhạt nhẽo', 'B. Thơm lừng ngất ngây, lan xa khắp sườn núi', 'C. Không có mùi', 'D. Mùi nồng khó chịu'],
          correctAnswer: 'B. Thơm lừng ngất ngây, lan xa khắp sườn núi',
          level: 'Mức 1'
        },
        {
          num: 2,
          stem: 'Chùm thảo quả chín đỏ dưới đáy rừng được so sánh với hình ảnh gì?',
          options: ['A. Như những viên ngọc', 'B. Như những ngọn lửa hồng thắp sáng rừng xanh', 'C. Như những đốm mây', 'D. Như mặt trời nhỏ'],
          correctAnswer: 'B. Như những ngọn lửa hồng thắp sáng rừng xanh',
          level: 'Mức 1'
        },
        {
          num: 3,
          stem: 'Tìm các từ đồng nghĩa với từ "rực rỡ" có trong bài:',
          correctAnswer: 'Từ "chói lọi", "đỏ rực".',
          level: 'Mức 2'
        },
        {
          num: 4,
          stem: 'Viết 1 đoạn văn 3-4 câu phản ánh tình cảm của em đối với vẻ đẹp thiên nhiên Việt Nam.',
          correctAnswer: 'Thiên nhiên đất nước Việt Nam vô cùng phong phú và tươi đẹp. Những cánh rừng xanh thắm cùng sông núi hùng vĩ luôn làm em cảm thấy tự hào. Em hứa sẽ nâng cao ý thức giữ gìn và bảo vệ môi trường quê hương.',
          level: 'Mức 3'
        }
      ]
    },
    dictationText: {
      title: 'TIẾNG ĐÀN BA-LA-LAI-CA TRÊN SÔNG ĐÀ',
      passage: 'Trên sông Đà một đêm trăng khuyết. Tiếng đàn Ba-la-lai-ca ngân vang giữa không gian tĩnh mịch của công trình thủy điện ngút ngàn.'
    },
    writingTask: {
      topic: 'Viết bài văn tả cảnh sông nước hoặc cảnh một buổi sáng đẹp trời trên quê hương em.',
      guidelines: ['• Mở bài: Giới thiệu cảnh đẹp quê hương.', '• Thân bài: Tả sự thay đổi của cảnh vật theo thời gian (ánh sáng, làn gió, cây cối, con người).', '• Kết bài: Nêu cảm xúc và tình yêu quê hương sâu sắc.']
    }
  }
];

export function getWebTVTHEntry(grade: number, term: 'GK1' | 'CK1' | 'GK2' | 'CK2'): TVTHEntry {
  const match = TVTH_DATA.find(d => d.grade === grade && d.term === term);
  if (match) return match;
  return TVTH_DATA[0];
}
