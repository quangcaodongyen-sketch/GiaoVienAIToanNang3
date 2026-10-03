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

  // ==================== ƯU TIÊN 1: APP NĂNG LỰC SỐ (FLAGSHIP) ====================
  {
    "id": "tichhop-nls-ai-thcs",
    "title": "TÍCH HỢP NLS - AI (ADD-INS V3)",
    "description": "Tự động bổ sung Năng lực số, STEM, AI và Giáo dục hòa nhập vào giáo án 12 môn chuẩn CV 5512. Tích hợp trực tiếp thanh công cụ Word.",
    "image": "/giaoanNLS.png",
    "url": "#nls-ai",
    "category": "GIÁO ÁN & VĂN BẢN (5512 & NĐ 30)",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": true,
    "order": 1
  },

  // ==================== ƯU TIÊN 2: APP RA ĐỀ TIẾNG ANH GLOBAL SUCCESS ====================
  {
    "id": "tao-de-tieng-anh-thcs",
    "title": "TẠO ĐỀ TIẾNG ANH (CV 7991)",
    "description": "Tạo đề kiểm tra 4 kỹ năng chuẩn Bộ GD&ĐT. Tự động xuất ma trận, bản đặc tả, đề thi, đáp án và audio script.",
    "image": "/taode_tienganh.png",
    "url": "#tao-de-tieng-anh",
    "category": "ĐỀ THI & ĐÁNH GIÁ (CV 7991)",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": true,
    "order": 2
  },

  // ==================== ƯU TIÊN 3: APP TẠO BÀI NGHE MP3 ====================
  {
    "id": "smart-listening-pro",
    "title": "TẠO BÀI NGHE MP3 (SMART LISTENING)",
    "description": "Chuyển văn bản tiếng Anh thành file nghe MP3 giọng bản ngữ chuẩn. Tự động ngắt nghỉ câu và chèn chuông hiệu lệnh.",
    "image": "/smart_listening_icon.png",
    "url": "#smart-listening",
    "category": "BÀI GIẢNG SỐ & NGOẠI NGỮ",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": true,
    "order": 3
  },

  // ==================== MATHSTUDIO PRO: SOẠN TOÁN - MATHPIX WORD ====================
  {
    "id": "mathstudio-pro",
    "title": "MATHSTUDIO PRO (CHUYỂN MATHPIX SANG WORD)",
    "description": "Add-in Word 1-Click tự động chuyển đổi công thức Toán học Mathpix sang MathType và Equation chuẩn Office. Chuyển hàng loạt đề thi chỉ trong 3 giây.",
    "image": "/mathstudio_preview.png",
    "url": "#mathstudio",
    "category": "TOÁN HỌC & KHOA HỌC (MATHPIX)",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": true,
    "order": 4
  },

  // ==================== ƯU TIÊN 4: CÁC APP RA ĐỀ 7 MÔN ====================
  {
    "id": "tao-de-toan-thcs",
    "title": "TẠO ĐỀ TOÁN (CV 7991)",
    "description": "Tự động tạo ma trận, bản đặc tả, đề thi kèm công thức MathType chuẩn CV 7991 và thang điểm chi tiết.",
    "image": "/taode_toan.png",
    "url": "#tao-de-toan",
    "category": "ĐỀ THI & ĐÁNH GIÁ (CV 7991)",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": true,
    "order": 4
  },
  {
    "id": "tao-de-van-thcs",
    "title": "TẠO ĐỀ NGỮ VĂN (CV 7991)",
    "description": "Tự động tạo ma trận, bản đặc tả, đề Đọc hiểu ngoài SGK và Viết văn kèm hướng dẫn chấm chi tiết.",
    "image": "/taode_van.png",
    "url": "#tao-de-van",
    "category": "ĐỀ THI & ĐÁNH GIÁ (CV 7991)",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": false,
    "order": 5
  },
  {
    "id": "tao-de-khtn-thcs",
    "title": "TẠO ĐỀ KHOA HỌC TỰ NHIÊN (CV 7991)",
    "description": "Tự động tạo ma trận, bản đặc tả và đề thi tích hợp Vật lí, Hóa học, Sinh học chuẩn CV 7991.",
    "image": "/taode_khtn.png",
    "url": "#tao-de-khtn",
    "category": "ĐỀ THI & ĐÁNH GIÁ (CV 7991)",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": false,
    "order": 6
  },
  {
    "id": "tao-de-sudia-thcs",
    "title": "TẠO ĐỀ LỊCH SỬ - ĐỊA LÍ (CV 7991)",
    "description": "Tự động tạo ma trận, bản đặc tả và đề thi cân đối 50% Lịch sử - 50% Địa lí kèm đáp án chi tiết.",
    "image": "/taode_sudia.png",
    "url": "#tao-de-sudia",
    "category": "ĐỀ THI & ĐÁNH GIÁ (CV 7991)",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": false,
    "order": 7
  },
  {
    "id": "tao-de-gdcd-thcs",
    "title": "TẠO ĐỀ GIÁO DỤC CÔNG DÂN (CV 7991)",
    "description": "Tự động tạo ma trận, bản đặc tả và đề thi trắc nghiệm cùng câu hỏi tình huống thực tế chuẩn CV 7991.",
    "image": "/taode_gdcd.png",
    "url": "#tao-de-gdcd",
    "category": "ĐỀ THI & ĐÁNH GIÁ (CV 7991)",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": false,
    "order": 8
  },
  {
    "id": "tao-de-tin-thcs",
    "title": "TẠO ĐỀ TIN HỌC (CV 7991)",
    "description": "Tự động tạo ma trận, bản đặc tả và đề thi Tin học kết hợp lý thuyết và bài tập thực hành.",
    "image": "/taode_tin.png",
    "url": "#tao-de-tin",
    "category": "ĐỀ THI & ĐÁNH GIÁ (CV 7991)",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": false,
    "order": 9
  },
  {
    "id": "tao-de-cn-thcs",
    "title": "TẠO ĐỀ CÔNG NGHỆ (CV 7991)",
    "description": "Tự động tạo ma trận, bản đặc tả và đề thi Nông nghiệp, Cơ khí, Mạch điện bám sát chương trình.",
    "image": "/taode_cn.png",
    "url": "#tao-de-cn",
    "category": "ĐỀ THI & ĐÁNH GIÁ (CV 7991)",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": false,
    "order": 10
  },

  // ==================== ƯU TIÊN 5: SINH ĐỀ BIẾN THỂ ====================
  {
    "id": "sinhdebienthe",
    "title": "SINH ĐỀ BIẾN THỂ (AI PRO)",
    "description": "Phân tích đề gốc để sinh ngay 3 đề biến thể tương đương chống quay cóp trong phòng thi.",
    "image": "/sinhdebientheVIP.png",
    "url": "#sinh-de-bien-the",
    "category": "ĐỀ THI & ĐÁNH GIÁ (CV 7991)",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": true,
    "order": 11
  },

  // ==================== NHÓM CUỐI: TIỆN ÍCH & VĂN BẢN ====================
  {
    "id": "chuanhoavanbanvip",
    "title": "CHUẨN HÓA VĂN BẢN (NĐ 30)",
    "description": "Căn lề, chèn Quốc hiệu, khung ký tên chuẩn 100% Nghị định 30/2020 và hỗ trợ soạn giáo án 5512 trong Word.",
    "image": "/chuanhoavanbanvip.jpg",
    "url": "#chuan-hoa-vb",
    "category": "GIÁO ÁN & VĂN BẢN (5512 & NĐ 30)",
    "badge": "MIỄN PHÍ",
    "active": true,
    "featured": false,
    "order": 12
  },
  {
    "id": "mathstudio-pro",
    "title": "ĐINH THÀNH MATHSTUDIO 2026+ (WORD & MATHPIX)",
    "description": "Chuyển đổi Mathpix LaTeX sang Word Equation / MathType, tự động căn chỉnh công thức, chuẩn hóa font Toán, tạo ma trận đề thi và soạn thảo toán học tốc độ cao.",
    "image": "/congthucmathtype.jpg",
    "url": "#mathstudio",
    "category": "GIÁO ÁN & VĂN BẢN (5512 & NĐ 30)",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": true,
    "order": 13
  },
  {
    "id": "screen-record-v2",
    "title": "QUAY MÀN HÌNH (SCREEN RECORD)",
    "description": "Quay màn hình bài giảng Full HD sắc nét, khử tạp âm và tích hợp hiệu ứng chuột Spotlight giảng dạy.",
    "image": "/screenrecord_banner.png",
    "url": "#screen-record",
    "category": "BÀI GIẢNG SỐ & NGOẠI NGỮ",
    "badge": "MIỄN PHÍ",
    "active": true,
    "featured": false,
    "order": 14
  },
  {
    "id": "TACH-GOP-PDF",
    "title": "TÁCH - GỘP PDF (PDF SUITE)",
    "description": "Tách trang, gộp nhiều giáo án PDF tốc độ cao và tự động lọc sạch các trang trắng rác khi scan tài liệu.",
    "image": "/tachgoppdf.jpg",
    "url": "#tach-gop-pdf",
    "category": "TIỆN ÍCH MÁY TÍNH & CHỦ NHIỆM",
    "badge": "MIỄN PHÍ",
    "active": true,
    "featured": false,
    "order": 15
  },
  {
    "id": "dinhthanh-cleaner-pro",
    "title": "DỌN RÁC MÁY TÍNH (CLEANER)",
    "description": "Dọn sạch rác Zalo, temp phình ổ C và giải phóng RAM, giúp máy tính giáo viên chạy êm mượt.",
    "image": "/cleaner_pro_banner.png",
    "url": "#cleaner-pro",
    "category": "TIỆN ÍCH MÁY TÍNH & CHỦ NHIỆM",
    "badge": "MIỄN PHÍ",
    "active": true,
    "featured": false,
    "order": 16
  },
  {
    "id": "trolyGVCN",
    "title": "TRỢ LÝ CHỦ NHIỆM (GVCN)",
    "description": "Tự động sinh nhận xét học sinh định kỳ, biên bản họp phụ huynh và quản lý nề nếp lớp học chuyên nghiệp.",
    "image": "/trolygvnn.jpg",
    "url": "https://tro-ly-gvcn.vercel.app/",
    "category": "TIỆN ÍCH MÁY TÍNH & CHỦ NHIỆM",
    "badge": "MIỄN PHÍ",
    "active": true,
    "featured": false,
    "order": 17
  },
  {
    "id": "tao-de-15p-tienganh",
    "title": "TẠO ĐỀ 15 PHÚT TIẾNG ANH (GLOBAL SUCCESS)",
    "description": "Tự động tạo trọn bộ 2 mã đề 15 phút, phiếu chấm trắc nghiệm 20 câu sạch và bảng đáp án rút gọn cho 48 Units (Lớp 6, 7, 8, 9). [Ứng dụng nội bộ chỉ dành riêng cho Admin Thầy Thành dùng cá nhân, yêu cầu mật khẩu Admin].",
    "image": "/taode_15p_tienganh.png",
    "url": "#tao-de-15p-tienganh",
    "category": "BÀI GIẢNG SỐ & NGOẠI NGỮ",
    "badge": "NỘI BỘ ADMIN",
    "active": true,
    "featured": true,
    "order": 18
  }
];

