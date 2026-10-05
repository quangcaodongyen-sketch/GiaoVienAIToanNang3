export interface AppCard {
  id: string;
  title: string;
  description: string;
  image: string;
  url: string;
  category: string;
  levelBadge?: 'THCS' | 'THPT' | 'CV 5512' | 'TIỆN ÍCH';
  badge?: string;
  active: boolean;
  featured: boolean;
  order: number;
}

export const apps: AppCard[] = [

  // ==================== CÔNG CỤ CHỦ LỰC: NĂNG LỰC SỐ & AI ====================
  {
    id: "tichhop-nls-ai-thcs",
    title: "TÍCH HỢP NĂNG LỰC SỐ & AI (CV 5512)",
    description: "Tự động bổ sung Năng lực số, STEM, AI và Giáo dục hòa nhập vào giáo án chuẩn CV 5512 cho cấp THCS và THPT.",
    image: "/giaoanNLS.png",
    url: "#nls-ai",
    category: "GIÁO ÁN & NLS (5512)",
    levelBadge: "CV 5512",
    badge: "BẢN QUYỀN PRO",
    active: true,
    featured: true,
    order: 1
  },

  // ==================== NHÓM 1: CẤP THCS (CV 7991) ====================
  {
    id: "tao-de-tieng-anh-thcs",
    title: "TẠO ĐỀ TIẾNG ANH THCS (CV 7991)",
    description: "Tạo đề kiểm tra Tiếng Anh 4 kỹ năng THCS kèm ma trận, bản đặc tả, audio script và đáp án chi tiết.",
    image: "/taode_tienganh.png",
    url: "#tao-de-tieng-anh",
    category: "ĐỀ THI CẤP THCS (CV 7991)",
    levelBadge: "THCS",
    badge: "BẢN QUYỀN PRO",
    active: true,
    featured: true,
    order: 2
  },
  {
    id: "tao-de-15p-tienganh",
    title: "TẠO ĐỀ 15 PHÚT TIẾNG ANH THCS",
    description: "Tạo đề kiểm tra 15 phút trắc nghiệm Tiếng Anh theo từng Unit bám sát giáo trình THCS.",
    image: "/taode_15p_tienganh.png",
    url: "#tao-de-15p-tienganh",
    category: "ĐỀ THI CẤP THCS (CV 7991)",
    levelBadge: "THCS",
    badge: "BẢN QUYỀN PRO",
    active: true,
    featured: true,
    order: 3
  },
  {
    id: "tao-de-toan-thcs",
    title: "TẠO ĐỀ TOÁN THCS (CV 7991)",
    description: "Tạo đề kiểm tra Toán THCS kèm ma trận, bản đặc tả và công thức toán học chuẩn.",
    image: "/taode_toan.png",
    url: "#tao-de-toan",
    category: "ĐỀ THI CẤP THCS (CV 7991)",
    levelBadge: "THCS",
    badge: "BẢN QUYỀN PRO",
    active: true,
    featured: false,
    order: 4
  },
  {
    id: "tao-de-van-thcs",
    title: "TẠO ĐỀ NGỮ VĂN THCS (CV 7991)",
    description: "Tạo đề kiểm tra Ngữ văn THCS gồm phần Đọc hiểu ngoài SGK và Viết văn kèm hướng dẫn chấm.",
    image: "/taode_van.png",
    url: "#tao-de-van",
    category: "ĐỀ THI CẤP THCS (CV 7991)",
    levelBadge: "THCS",
    badge: "BẢN QUYỀN PRO",
    active: true,
    featured: false,
    order: 5
  },
  {
    id: "tao-de-khtn-thcs",
    title: "TẠO ĐỀ KHOA HỌC TỰ NHIÊN THCS (CV 7991)",
    description: "Tạo đề kiểm tra Khoa học tự nhiên THCS tích hợp phân môn Vật lí, Hóa học và Sinh học.",
    image: "/taode_khtn.png",
    url: "#tao-de-khtn",
    category: "ĐỀ THI CẤP THCS (CV 7991)",
    levelBadge: "THCS",
    badge: "BẢN QUYỀN PRO",
    active: true,
    featured: false,
    order: 6
  },
  {
    id: "tao-de-sudia-thcs",
    title: "TẠO ĐỀ LỊCH SỬ & ĐỊA LÍ THCS (CV 7991)",
    description: "Tạo đề kiểm tra Lịch sử & Địa lí THCS cân đối kiến thức hai phân môn kèm đáp án chi tiết.",
    image: "/taode_sudia.png",
    url: "#tao-de-sudia",
    category: "ĐỀ THI CẤP THCS (CV 7991)",
    levelBadge: "THCS",
    badge: "BẢN QUYỀN PRO",
    active: true,
    featured: false,
    order: 7
  },
  {
    id: "tao-de-gdcd-thcs",
    title: "TẠO ĐỀ GIÁO DỤC CÔNG DÂN THCS (CV 7991)",
    description: "Tạo đề kiểm tra Giáo dục công dân THCS trắc nghiệm và câu hỏi xử lý tình huống thực tế.",
    image: "/taode_gdcd.png",
    url: "#tao-de-gdcd",
    category: "ĐỀ THI CẤP THCS (CV 7991)",
    levelBadge: "THCS",
    badge: "BẢN QUYỀN PRO",
    active: true,
    featured: false,
    order: 8
  },
  {
    id: "tao-de-tin-thcs",
    title: "TẠO ĐỀ TIN HỌC THCS (CV 7991)",
    description: "Tạo đề kiểm tra Tin học THCS kết hợp lý thuyết và bài tập thực hành máy tính.",
    image: "/taode_tin.png",
    url: "#tao-de-tin",
    category: "ĐỀ THI CẤP THCS (CV 7991)",
    levelBadge: "THCS",
    badge: "BẢN QUYỀN PRO",
    active: true,
    featured: false,
    order: 9
  },
  {
    id: "tao-de-cn-thcs",
    title: "TẠO ĐỀ CÔNG NGHỆ THCS (CV 7991)",
    description: "Tạo đề kiểm tra Công nghệ THCS bám sát chương trình giáo dục phổ thông hiện hành.",
    image: "/taode_cn.png",
    url: "#tao-de-cn",
    category: "ĐỀ THI CẤP THCS (CV 7991)",
    levelBadge: "THCS",
    badge: "BẢN QUYỀN PRO",
    active: true,
    featured: false,
    order: 10
  },
  {
    id: "sinhdebienthe",
    title: "SINH ĐỀ BIẾN THỂ (AI PRO)",
    description: "Phân tích đề gốc để sinh ngay 3 đề biến thể tương đương chống sao chép trong phòng thi.",
    image: "/sinhdebientheVIP.png",
    url: "#sinh-de-bien-the",
    category: "ĐỀ THI CẤP THCS (CV 7991)",
    levelBadge: "THCS",
    badge: "BẢN QUYỀN PRO",
    active: true,
    featured: true,
    order: 11
  },

  // ==================== NHÓM 2: CẤP THPT (ĐỊNH DẠNG MỚI 2025+) ====================
  {
    id: "tao-de-tieng-anh-thpt",
    title: "TẠO ĐỀ TIẾNG ANH THPT (LỚP 10, 11, 12)",
    description: "Tạo đề kiểm tra Tiếng Anh THPT định dạng mới kèm ma trận, bản đặc tả và đáp án chi tiết.",
    image: "/taode_tienganh_thpt.png",
    url: "#tao-de-tieng-anh-thpt",
    category: "ĐỀ THI CẤP THPT (2025+)",
    levelBadge: "THPT",
    badge: "BẢN QUYỀN PRO",
    active: true,
    featured: true,
    order: 12
  },
  {
    id: "tao-de-toan-thpt",
    title: "TẠO ĐỀ TOÁN THPT (LỚP 10, 11, 12)",
    description: "Tạo đề kiểm tra Toán THPT cấu trúc mới gồm 3 phần trắc nghiệm kèm ma trận và đáp án.",
    image: "/taode_toan_thpt.png",
    url: "#tao-de-toan-thpt",
    category: "ĐỀ THI CẤP THPT (2025+)",
    levelBadge: "THPT",
    badge: "BẢN QUYỀN PRO",
    active: true,
    featured: true,
    order: 13
  },
  {
    id: "tao-de-van-thpt",
    title: "TẠO ĐỀ NGỮ VĂN THPT (LỚP 10, 11, 12)",
    description: "Tạo đề kiểm tra Ngữ văn THPT với ngữ liệu ngoài SGK, đọc hiểu và viết văn kèm biểu điểm.",
    image: "/taode_nguvan_thpt.png",
    url: "#tao-de-van-thpt",
    category: "ĐỀ THI CẤP THPT (2025+)",
    levelBadge: "THPT",
    badge: "BẢN QUYỀN PRO",
    active: true,
    featured: false,
    order: 14
  },
  {
    id: "tao-de-vatli-thpt",
    title: "TẠO ĐỀ VẬT LÍ THPT (LỚP 10, 11, 12)",
    description: "Tạo đề kiểm tra Vật lí THPT định dạng mới gồm trắc nghiệm nhiều lựa chọn và đúng/sai.",
    image: "/taode_vatli_thpt.png",
    url: "#tao-de-vatli-thpt",
    category: "ĐỀ THI CẤP THPT (2025+)",
    levelBadge: "THPT",
    badge: "BẢN QUYỀN PRO",
    active: true,
    featured: false,
    order: 15
  },
  {
    id: "tao-de-hoahoc-thpt",
    title: "TẠO ĐỀ HÓA HỌC THPT (LỚP 10, 11, 12)",
    description: "Tạo đề kiểm tra Hóa học THPT cấu trúc mới kèm ma trận, bản đặc tả và bảng đáp án.",
    image: "/taode_hoahoc_thpt.png",
    url: "#tao-de-hoahoc-thpt",
    category: "ĐỀ THI CẤP THPT (2025+)",
    levelBadge: "THPT",
    badge: "BẢN QUYỀN PRO",
    active: true,
    featured: false,
    order: 16
  },
  {
    id: "tao-de-sinhhoc-thpt",
    title: "TẠO ĐỀ SINH HỌC THPT (LỚP 10, 11, 12)",
    description: "Tạo đề kiểm tra Sinh học THPT định dạng mới gồm trắc nghiệm và câu hỏi trả lời ngắn.",
    image: "/taode_sinhhoc_thpt.png",
    url: "#tao-de-sinhhoc-thpt",
    category: "ĐỀ THI CẤP THPT (2025+)",
    levelBadge: "THPT",
    badge: "BẢN QUYỀN PRO",
    active: true,
    featured: false,
    order: 17
  },
  {
    id: "tao-de-tin-thpt",
    title: "TẠO ĐỀ TIN HỌC THPT (LỚP 10, 11, 12)",
    description: "Tạo đề kiểm tra Tin học THPT theo định hướng Khoa học máy tính và Tin học ứng dụng.",
    image: "/taode_tinhoc_thpt.png",
    url: "#tao-de-tin-thpt",
    category: "ĐỀ THI CẤP THPT (2025+)",
    levelBadge: "THPT",
    badge: "BẢN QUYỀN PRO",
    active: true,
    featured: false,
    order: 18
  },
  {
    id: "tao-de-lichsu-thpt",
    title: "TẠO ĐỀ LỊCH SỬ THPT (LỚP 10, 11, 12)",
    description: "Tạo đề kiểm tra Lịch sử THPT định dạng mới với các chủ đề lịch sử Việt Nam và thế giới.",
    image: "/taode_lichsu_thpt.png",
    url: "#tao-de-lichsu-thpt",
    category: "ĐỀ THI CẤP THPT (2025+)",
    levelBadge: "THPT",
    badge: "BẢN QUYỀN PRO",
    active: true,
    featured: false,
    order: 19
  },
  {
    id: "tao-de-diali-thpt",
    title: "TẠO ĐỀ ĐỊA LÍ THPT (LỚP 10, 11, 12)",
    description: "Tạo đề kiểm tra Địa lí THPT định dạng mới kết hợp lý thuyết và kỹ năng sử dụng Atlat.",
    image: "/taode_diali_thpt.png",
    url: "#tao-de-diali-thpt",
    category: "ĐỀ THI CẤP THPT (2025+)",
    levelBadge: "THPT",
    badge: "BẢN QUYỀN PRO",
    active: true,
    featured: false,
    order: 20
  },
  {
    id: "tao-de-gdktpl-thpt",
    title: "TẠO ĐỀ GDKT & PL THPT (LỚP 10, 11, 12)",
    description: "Tạo đề kiểm tra Giáo dục kinh tế & Pháp luật THPT với các tình huống pháp lý thực tiễn.",
    image: "/taode_gdktpl_thpt.png",
    url: "#tao-de-gdktpl-thpt",
    category: "ĐỀ THI CẤP THPT (2025+)",
    levelBadge: "THPT",
    badge: "BẢN QUYỀN PRO",
    active: true,
    featured: false,
    order: 21
  },
  {
    id: "tao-de-cn-thpt",
    title: "TẠO ĐỀ CÔNG NGHỆ THPT (LỚP 10, 11, 12)",
    description: "Tạo đề kiểm tra Công nghệ THPT theo định hướng Công nghiệp và Nông nghiệp.",
    image: "/taode_congnghe_thpt.png",
    url: "#tao-de-cn-thpt",
    category: "ĐỀ THI CẤP THPT (2025+)",
    levelBadge: "THPT",
    badge: "BẢN QUYỀN PRO",
    active: true,
    featured: false,
    order: 22
  },

  // ==================== NHÓM 3: BÀI GIẢNG SỐ & TIỆN ÍCH ====================
  {
    id: "smart-listening-pro",
    title: "TẠO BÀI NGHE MP3 (SMART LISTENING)",
    description: "Chuyển văn bản tiếng Anh thành file nghe MP3 giọng bản ngữ chuẩn kèm chuông hiệu lệnh.",
    image: "/smart_listening_icon.png",
    url: "#smart-listening",
    category: "BÀI GIẢNG & TIỆN ÍCH",
    levelBadge: "TIỆN ÍCH",
    badge: "BẢN QUYỀN PRO",
    active: true,
    featured: true,
    order: 23
  },
  {
    id: "mathstudio-pro",
    title: "ĐINH THÀNH MATHSTUDIO (MATHPIX SANG WORD)",
    description: "Công cụ thử nghiệm nội bộ dành cho Admin. Chuyển đổi Mathpix LaTeX sang Word Equation.",
    image: "/congthucmathtype.jpg",
    url: "#mathstudio",
    category: "BÀI GIẢNG & TIỆN ÍCH",
    levelBadge: "TIỆN ÍCH",
    badge: "NỘI BỘ ADMIN",
    active: true,
    featured: false,
    order: 24
  },
  {
    id: "chuanhoavanbanvip",
    title: "CHUẨN HÓA VĂN BẢN (NĐ 30)",
    description: "Căn lề, chèn Quốc hiệu, khung ký tên chuẩn 100% Nghị định 30/2020 trong Word.",
    image: "/chuanhoavanbanvip.jpg",
    url: "#chuan-hoa-vb",
    category: "BÀI GIẢNG & TIỆN ÍCH",
    levelBadge: "TIỆN ÍCH",
    badge: "MIỄN PHÍ",
    active: true,
    featured: false,
    order: 25
  },
  {
    id: "screen-record-v2",
    title: "QUAY MÀN HÌNH (SCREEN RECORD)",
    description: "Quay màn hình bài giảng Full HD sắc nét, khử tạp âm và hiệu ứng chuột Spotlight.",
    image: "/screenrecord_banner.png",
    url: "#screen-record",
    category: "BÀI GIẢNG & TIỆN ÍCH",
    levelBadge: "TIỆN ÍCH",
    badge: "MIỄN PHÍ",
    active: true,
    featured: false,
    order: 26
  },
  {
    id: "TACH-GOP-PDF",
    title: "TÁCH - GỘP PDF (PDF SUITE)",
    description: "Tách trang, gộp nhiều giáo án PDF tốc độ cao và tự động lọc sạch các trang trắng.",
    image: "/tachgoppdf.jpg",
    url: "#tach-gop-pdf",
    category: "BÀI GIẢNG & TIỆN ÍCH",
    levelBadge: "TIỆN ÍCH",
    badge: "MIỄN PHÍ",
    active: true,
    featured: false,
    order: 27
  },
  {
    id: "dinhthanh-cleaner-pro",
    title: "DỌN RÁC MÁY TÍNH (CLEANER)",
    description: "Dọn sạch rác Zalo, temp phình ổ C và giải phóng RAM, giúp máy tính chạy êm mượt.",
    image: "/cleaner_pro_banner.png",
    url: "#cleaner-pro",
    category: "BÀI GIẢNG & TIỆN ÍCH",
    levelBadge: "TIỆN ÍCH",
    badge: "MIỄN PHÍ",
    active: true,
    featured: false,
    order: 28
  },
  {
    id: "trolyGVCN",
    title: "TRỢ LÝ CHỦ NHIỆM (GVCN)",
    description: "Tự động sinh nhận xét học sinh định kỳ, biên bản họp phụ huynh và quản lý nề nếp lớp học.",
    image: "/trolygvnn.jpg",
    url: "https://tro-ly-gvcn.vercel.app/",
    category: "BÀI GIẢNG & TIỆN ÍCH",
    levelBadge: "TIỆN ÍCH",
    badge: "MIỄN PHÍ",
    active: true,
    featured: false,
    order: 29
  }
];
