export interface AppCard {
  id: string;
  title: string;
  description: string;
  image: string;
  url: string;
  category: string;
  badge?: string;
  active: boolean;
  featured: boolean;
  order: number;
}

export const apps: AppCard[] = [
  // ==================== NHÓM 1: ĐỀ THI & ĐÁNH GIÁ (CV 7991) ====================
  {
    "id": "tao-de-toan-thcs",
    "title": "TẠO ĐỀ KIỂM TRA MÔN TOÁN HỌC (CV 7991)",
    "description": "Tự động sinh Ma trận, Bản đặc tả và Đề thi in ấn A4 kèm Đáp án chi tiết chuẩn 100% CV 7991/BGDĐT. Công thức toán sắc nét, xuất Word chỉ trong 30 giây.",
    "image": "/taode_toan.png",
    "url": "#tao-de-toan",
    "category": "ĐỀ THI & ĐÁNH GIÁ (CV 7991)",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": true,
    "order": 1
  },
  {
    "id": "tao-de-van-thcs",
    "title": "TẠO ĐỀ KIỂM TRA MÔN NGỮ VĂN (CV 7991)",
    "description": "Thiết kế đề Ngữ văn chuẩn cấu trúc: Đọc hiểu ngữ liệu ngoài SGK (6.0đ) và Viết nghị luận/tự sự (4.0đ). Kèm Ma trận, Bản đặc tả và Hướng dẫn chấm chi tiết.",
    "image": "/taode_van.png",
    "url": "#tao-de-van",
    "category": "ĐỀ THI & ĐÁNH GIÁ (CV 7991)",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": true,
    "order": 2
  },
  {
    "id": "tao-de-tieng-anh-thcs",
    "title": "TẠO ĐỀ KIỂM TRA TIẾNG ANH GLOBAL SUCCESS (CV 7991)",
    "description": "Tạo đề thi tiếng Anh 4 kỹ năng chuẩn khung năng lực Bộ GD&ĐT. Tự động xuất đề thi, Đáp án, Audio Script và tích hợp tạo file nghe MP3.",
    "image": "/taode_tienganh.png",
    "url": "#tao-de-tieng-anh",
    "category": "ĐỀ THI & ĐÁNH GIÁ (CV 7991)",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": true,
    "order": 3
  },
  {
    "id": "tao-de-khtn-thcs",
    "title": "TẠO ĐỀ KHOA HỌC TỰ NHIÊN (CV 7991)",
    "description": "Tích hợp chuẩn tỉ lệ 3 phân môn Lý - Hóa - Sinh theo CTGDPT 2018 (Trắc nghiệm 4.0đ + Tự luận 6.0đ). Xuất trọn bộ Ma trận và Đề thi Word in ấn.",
    "image": "/taode_khtn.png",
    "url": "#tao-de-khtn",
    "category": "ĐỀ THI & ĐÁNH GIÁ (CV 7991)",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": false,
    "order": 4
  },
  {
    "id": "tao-de-sudia-thcs",
    "title": "TẠO ĐỀ LỊCH SỬ VÀ ĐỊA LÍ (CV 7991)",
    "description": "Cân đối chuẩn 50% Lịch sử - 50% Địa lí với câu hỏi trắc nghiệm và tự luận tình huống thực tiễn. Đầy đủ ma trận, bản đặc tả theo CV 7991.",
    "image": "/taode_sudia.png",
    "url": "#tao-de-sudia",
    "category": "ĐỀ THI & ĐÁNH GIÁ (CV 7991)",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": false,
    "order": 5
  },
  {
    "id": "tao-de-tin-thcs",
    "title": "TẠO ĐỀ KIỂM TRA MÔN TIN HỌC (CV 7991)",
    "description": "Sinh đề thi Tin học kết hợp lý thuyết số học và bài tập thực hành thuật toán, lập trình Python, Excel. Xuất file Word chuẩn mực.",
    "image": "/taode_tin.png",
    "url": "#tao-de-tin",
    "category": "ĐỀ THI & ĐÁNH GIÁ (CV 7991)",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": false,
    "order": 6
  },
  {
    "id": "tao-de-gdcd-thcs",
    "title": "TẠO ĐỀ GIÁO DỤC CÔNG DÂN (CV 7991)",
    "description": "Đề thi chuẩn cấu trúc: Nhận biết chuẩn mực đạo đức (4.0đ) và Tình huống pháp luật thực tế (6.0đ). Kèm biểu điểm chi tiết từng ý.",
    "image": "/taode_gdcd.png",
    "url": "#tao-de-gdcd",
    "category": "ĐỀ THI & ĐÁNH GIÁ (CV 7991)",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": false,
    "order": 7
  },
  {
    "id": "tao-de-cn-thcs",
    "title": "TẠO ĐỀ KIỂM TRA MÔN CÔNG NGHỆ (CV 7991)",
    "description": "Tự động ra đề bám sát chương trình: Nông nghiệp, cơ khí chế tạo và thiết kế mạch điện. Đầy đủ ma trận phân loại học sinh.",
    "image": "/taode_cn.png",
    "url": "#tao-de-cn",
    "category": "ĐỀ THI & ĐÁNH GIÁ (CV 7991)",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": false,
    "order": 8
  },
  {
    "id": "sinhdebienthe",
    "title": "SINH 3 ĐỀ BIẾN THỂ VIP (AI PRO)",
    "description": "Phân tích đề gốc để sinh ngay 3 đề biến thể tương đương chống quay cóp trong phòng thi. Giữ nguyên độ khó, xuất Word kèm đáp án tức thì.",
    "image": "/sinhdebientheVIP.png",
    "url": "#sinh-de-bien-the",
    "category": "ĐỀ THI & ĐÁNH GIÁ (CV 7991)",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": true,
    "order": 9
  },

  // ==================== NHÓM 2: GIÁO ÁN & VĂN BẢN (5512 & NĐ 30) ====================
  {
    "id": "chuanhoavanbanvip",
    "title": "CHUẨN HÓA NĐ 30 & SOẠN GIÁO ÁN 5512 (AI WORD)",
    "description": "Căn lề, chèn Quốc hiệu & khung ký tên chuẩn 100% Nghị định 30/2020 trong Word. Tích hợp soạn giáo án 5512 đủ 4 hoạt động bấm 1 phát ăn luôn!",
    "image": "/chuanhoavanbanvip.jpg",
    "url": "#chuan-hoa-vb",
    "category": "GIÁO ÁN & VĂN BẢN (5512 & NĐ 30)",
    "badge": "MIỄN PHÍ",
    "active": true,
    "featured": true,
    "order": 10
  },
  {
    "id": "tichhop-nls-ai-thcs",
    "title": "TÍCH HỢP NLS - AI THCS (ADD-INS V2)",
    "description": "Tự động bổ sung Năng lực số, STEM và ứng dụng AI vào giáo án 12 môn THCS chuẩn CV 5512. Tặng kèm thanh công cụ Ribbon trên Word.",
    "image": "/giaoanNLS.png",
    "url": "#nls-ai",
    "category": "GIÁO ÁN & VĂN BẢN (5512 & NĐ 30)",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": true,
    "order": 11
  },
  {
    "id": "congthutoan",
    "title": "CHUYỂN CÔNG THỨC AI SANG MATHTYPE WORD",
    "description": "Chuyển mã LaTeX từ ChatGPT, Gemini sang MathType Word hiển thị chuẩn đẹp 100%, không lo lệch dòng hay vỡ công thức.",
    "image": "/congthucmathtype.jpg",
    "url": "https://web-to-mathtype-word.vercel.app/",
    "category": "GIÁO ÁN & VĂN BẢN (5512 & NĐ 30)",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": false,
    "order": 12
  },

  // ==================== NHÓM 3: BÀI GIẢNG SỐ & NGOẠI NGỮ ====================
  {
    "id": "smart-listening-pro",
    "title": "SMART LISTENING PRO (LUYỆN NGHE & PHÁT ÂM)",
    "description": "Chuyển bài đọc tiếng Anh thành file nghe MP3 giọng bản ngữ chuẩn quốc tế. Tự động ngắt nghỉ câu và chèn chuông hiệu lệnh làm bài thi.",
    "image": "/smart_listening_icon.png",
    "url": "#smart-listening",
    "category": "BÀI GIẢNG SỐ & NGOẠI NGỮ",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": true,
    "order": 13
  },
  {
    "id": "screen-record-v2",
    "title": "SCREEN RECORD PRO V2 (QUAY MÀN HÌNH BTV)",
    "description": "Quay màn hình bài giảng Full HD sắc nét, khử sạch tạp âm chuẩn phát thanh viên. Tích hợp hiệu ứng chuột Spotlight thu hút học sinh.",
    "image": "/screenrecord_banner.png",
    "url": "#screen-record",
    "category": "BÀI GIẢNG SỐ & NGOẠI NGỮ",
    "badge": "MIỄN PHÍ",
    "active": true,
    "featured": true,
    "order": 14
  },

  // ==================== NHÓM 4: TIỆN ÍCH MÁY TÍNH & CHỦ NHIỆM ====================
  {
    "id": "TACH-GOP-PDF",
    "title": "PDF SUITE PRO (TÁCH - GỘP - LỌC TRANG TRẮNG AI)",
    "description": "Tách trang, gộp nhiều giáo án PDF tốc độ cao và tự động lọc sạch các trang trắng rác khi scan tài liệu. Xuất file PDF thật về máy 1-click.",
    "image": "/tachgoppdf.jpg",
    "url": "#tach-gop-pdf",
    "category": "TIỆN ÍCH MÁY TÍNH & CHỦ NHIỆM",
    "badge": "MIỄN PHÍ",
    "active": true,
    "featured": true,
    "order": 15
  },
  {
    "id": "dinhthanh-cleaner-pro",
    "title": "ĐINH THÀNH CLEANER PRO v4.5 VIP",
    "description": "Dọn sạch rác Zalo, CapCut, temp phình ổ C và giải phóng RAM, giúp máy tính giáo viên chạy êm mượt, không còn giật lag.",
    "image": "/cleaner_pro_banner.png",
    "url": "#cleaner-pro",
    "category": "TIỆN ÍCH MÁY TÍNH & CHỦ NHIỆM",
    "badge": "MIỄN PHÍ",
    "active": true,
    "featured": true,
    "order": 16
  },
  {
    "id": "trolyGVCN",
    "title": "TRỢ LÝ GIÁO VIÊN CHỦ NHIỆM (GVCN)",
    "description": "Tự động sinh nhận xét học sinh định kỳ, soạn biên bản họp phụ huynh và quản lý nề nếp lớp học chuyên nghiệp, tiết kiệm 90% thời gian.",
    "image": "/trolygvnn.jpg",
    "url": "https://tro-ly-gvcn.vercel.app/",
    "category": "TIỆN ÍCH MÁY TÍNH & CHỦ NHIỆM",
    "badge": "MIỄN PHÍ",
    "active": true,
    "featured": false,
    "order": 17
  }
];