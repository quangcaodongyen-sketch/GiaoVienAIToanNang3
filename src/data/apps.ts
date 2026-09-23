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
  {
    "id": "smart-listening-pro",
    "title": "SMART LISTENING PRO",
    "description": "Chuyển lời thoại văn bản thành bài nghe tiếng Anh chuẩn bản ngữ. Tự động chèn chuông hiệu lệnh, ngắt nghỉ theo câu và xuất file MP3 chất lượng cao.",
    "image": "/smart_listening_icon.png",
    "url": "#smart-listening",
    "category": "TIẾNG ANH & BÀI NGHE",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": true,
    "order": 1
  },
  {
    "id": "tichhop-nls-ai-thcs",
    "title": "TÍCH HỢP NLS - AI THCS (ADD-INS V2)",
    "description": "Tích hợp Năng lực số (NLS), AI, STEM, ANQP vào giáo án Word chuẩn Công văn 5512 cho 12 môn THCS. Tặng kèm bộ Word Add-in Ribbon và công cụ tự động 1-click.",
    "image": "/giaoanNLS.png",
    "url": "#nls-ai",
    "category": "GIÁO ÁN & CÔNG CỤ SỐ",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": true,
    "order": 2
  },
  {
    "id": "tao-de-tieng-anh-thcs",
    "title": "TẠO ĐỀ KIỂM TRA TIẾNG ANH GLOBAL SUCCESS (CV 7991)",
    "description": "Phần mềm tạo đề kiểm tra Tiếng Anh THCS (Lớp 6, 7, 8, 9) chuẩn Công văn 7991/BGDĐT. Tự động hoán vị đề (601, 602), ma trận đặc tả, đáp án thang điểm và Audio Script bài nghe.",
    "image": "/Taodektcv7991.jpg",
    "url": "#tao-de-tieng-anh",
    "category": "TIẾNG ANH & ĐỀ THI",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": true,
    "order": 3
  },
  {
    "id": "trung-tam-tao-de-thcs-8mon",
    "title": "TẠO ĐỀ KIỂM TRA THCS 8 MÔN (CHUẨN CV 7991)",
    "description": "Hệ thống phần mềm tạo đề định kỳ THCS (Lớp 6, 7, 8, 9) trọn gói 8 môn: Toán, Ngữ văn, Tiếng Anh, KHTN, Lịch sử - Địa lí, Tin học, GDCD, Công nghệ. Tự động sinh Ma trận, Bản đặc tả, đề hoán vị và Đáp án chuẩn Công văn 7991/BGDĐT.",
    "image": "/taodethcs8mon.png",
    "url": "#tao-de-thcs-8mon",
    "category": "ĐỀ KIỂM TRA & ĐÁNH GIÁ",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": true,
    "order": 4
  },
  {
    "id": "sinhdebienthe",
    "title": "SINH 3 ĐỀ BIẾN THỂ VIP (AI PRO)",
    "description": "Tự động phân tích ma trận đề gốc và sinh 3 đề kiểm tra biến thể tương đương (nhẹ, vừa, sâu) kèm đáp án chi tiết, Audio Script và xuất file Word chuẩn 100%.",
    "image": "/sinhdebientheVIP.png",
    "url": "#sinh-de-bien-the",
    "category": "TIẾNG ANH & ĐỀ THI",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": true,
    "order": 5
  },
  {
    "id": "screen-record-v2",
    "title": "SCREEN RECORD PRO V2 (QUAY MÀN HÌNH BTV)",
    "description": "Phần mềm quay màn hình máy tính Full HD/2K 60fps, lọc âm tạp âm chuẩn BTV Đài VTV, hiệu ứng con trỏ chuột Halo Spotlight & sóng click Ripple, ghi âm đa luồng Mic + Hệ thống.",
    "image": "/screenrecord_banner.png",
    "url": "#screen-record",
    "category": "CÔNG CỤ BÀI GIẢNG & VIDEO",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": true,
    "order": 6
  },
  {
    "id": "dinhthanh-cleaner-pro",
    "title": "ĐINH THÀNH CLEANER PRO v4.5 VIP",
    "description": "Phần mềm dọn rác chuyên sâu & Tăng tốc máy tính giáo viên. Dọn sạch 10 khu vực hệ thống, phân tích thủ phạm phình ổ C (Zalo, CapCut, Premiere), giải phóng RAM an toàn 100%.",
    "image": "/cleaner_pro_banner.png",
    "url": "#cleaner-pro",
    "category": "CÔNG CỤ BÀI GIẢNG & TIỆN ÍCH",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": true,
    "order": 7
  },
  {
    "id": "chuanhoavanbanvip",
    "title": "CHUẨN HÓA NĐ 30 & SOẠN GIÁO ÁN 5512 (AI WORD)",
    "description": "Trợ lý AI Word Assistant tích hợp trực tiếp vào Microsoft Word: Chuẩn hóa thể thức Nghị định 30/2020/NĐ-CP (Cơ quan, Quốc hiệu, Ký tên NGUYỄN VĂN A), Soạn Giáo án 5512 tất cả các môn bấm 1 phát ăn luôn, kho ký hiệu cấp 1-2-3 hơn cả MathType, sửa lỗi chính tả và phát triển ý tự động không cần API key.",
    "image": "/chuanhoavanbanvip.jpg",
    "url": "#chuan-hoa-vb",
    "category": "VĂN BẢN & TIỆN ÍCH SỐ",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": true,
    "order": 8
  },
  {
    "id": "TACH-GOP-PDF",
    "title": "PDF SUITE PRO (TÁCH - GỘP - LỌC TRANG TRẮNG AI)",
    "description": "Bộ công cụ xử lý tệp PDF chuyên sâu dành cho giáo viên: Tách dải trang tùy biến, gộp nhiều giáo án/đề thi thành 1 file duy nhất với tốc độ tức thì, tự động quét và loại bỏ toàn bộ trang trắng rác khi scan tài liệu.",
    "image": "/tachgoppdf.jpg",
    "url": "#tach-gop-pdf",
    "category": "VĂN BẢN & TIỆN ÍCH SỐ",
    "badge": "BẢN QUYỀN PRO",
    "active": true,
    "featured": true,
    "order": 9
  },
  {
    "id": "TAODEKTCV7991",
    "title": "TẠO ĐỀ KIỂM TRA THEO CV 7991",
    "description": "Tự động sinh ma trận đặc tả, câu hỏi trắc nghiệm đúng sai, trả lời ngắn chuẩn cấu trúc Công văn 7991 cho tất cả các môn học.",
    "image": "/Taodektcv7991.jpg",
    "url": "https://kiem-tra-cv-7991.vercel.app/",
    "category": "ĐỀ KIỂM TRA",
    "badge": "TRẢI NGHIỆM",
    "active": true,
    "featured": false,
    "order": 10
  },
  {
    "id": "congthutoan",
    "title": "CHUYỂN CÔNG THỨC AI SANG MATHTYPE WORD",
    "description": "Chuyển đổi tức thì công thức LaTeX, AI từ Gemini và ChatGPT sang MathType Word chuẩn xác 100%, không bị vỡ định dạng toán học.",
    "image": "/congthucmathtype.jpg",
    "url": "https://web-to-mathtype-word.vercel.app/",
    "category": "BỘ TRỢ LÝ AI",
    "badge": "MIỄN PHÍ",
    "active": true,
    "featured": false,
    "order": 11
  },
  {
    "id": "trolyGVCN",
    "title": "TRỢ LÝ GIÁO VIÊN CHỦ NHIỆM (GVCN)",
    "description": "Trợ lý AI chuyên biệt cho Giáo viên chủ nhiệm: Tự động hóa nhận xét học sinh định kỳ, biên bản họp phụ huynh và quản lý nề nếp lớp học sư phạm.",
    "image": "/trolygvnn.jpg",
    "url": "https://tro-ly-gvcn.vercel.app/",
    "category": "BỘ TRỢ LÝ AI",
    "badge": "TRẢI NGHIỆM",
    "active": true,
    "featured": false,
    "order": 12
  }
];
