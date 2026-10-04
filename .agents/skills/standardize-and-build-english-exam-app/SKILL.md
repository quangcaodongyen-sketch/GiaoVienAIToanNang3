---
name: standardize-and-build-english-exam-app
description: >-
  Quy trình chuẩn hóa, kiến trúc mã nguồn, thiết kế đề thi, Ma trận 16 cột chuẩn Bộ GD&ĐT, Bản đặc tả 7 cột có dòng Tổng,
  và đóng gói tự động cho phần mềm Tạo Đề Kiểm Tra Tiếng Anh THCS & THPT (Lớp 10, 11, 12 - Global Success) của Thầy giáo Đinh Văn Thành.
---

# BỘ KỸ NĂNG CHUẨN HÓA & PHÁT TRIỂN APP TẠO ĐỀ TIẾNG ANH THCS & THPT

**Tác giả bản quyền**: Thầy giáo Đinh Văn Thành - Hotline / Zalo: `0915.213717`  
**Đơn vị công tác**: Trường THCS Đồng Yên  
**Tài khoản GitHub**: `quangcaodongyen-sketch` | **Repo Web**: `GiaoVienAIToanNang3`

---

## 1. MỤC TIÊU VÀ PHẠM VI ÁP DỤNG
Bộ kỹ năng này ghi nhận toàn bộ giải pháp kỹ thuật, quy chuẩn định dạng sư phạm, cấu trúc Ma trận - Đặc tả và quy trình đóng gói đã được hoàn thiện từ **App Tạo Đề Tiếng Anh THCS**, dùng làm kim chỉ nam để:
1. Duy trì, nâng cấp phần mềm **Tạo Đề Tiếng Anh THCS** (Lớp 6, 7, 8, 9).
2. Xây dựng mới hoặc nâng cấp phần mềm **Tạo Đề Tiếng Anh THPT** (Lớp 10, 11, 12 - SGK Global Success, Friends Global, Bright...) bám sát đúng:
   - **Kiến thức THPT**: Hệ thống Unit, ngữ pháp, ngữ liệu đọc hiểu và từ vựng chuyên biệt cấp THPT.
   - **Ma trận & Bản đặc tả THPT**: Cấu trúc đề định kỳ và định dạng đề thi trắc nghiệm THPT mới từ năm 2025 theo Bộ GD&ĐT.

---

## 2. NGUYÊN TẮC ĐỊNH DẠNG SƯ PHẠM VĂN BẢN ĐỀ THI (.DOCX)

Khi sinh file đề kiểm tra Word (`.docx`), bắt buộc tuân thủ 5 quy tắc định dạng vàng:

### 2.1. Đáp án chữ in thường, màu đỏ `#FF0000`, TUYỆT ĐỐI KHÔNG IN ĐẬM
- **Quy tắc**: Trong đề thi kèm đáp án hoặc phiếu soi đáp án, chữ cái đáp án (`A`, `B`, `C`, `D` hoặc `True`, `False`) và nội dung phương án đúng:
  - Màu chữ: Đỏ chuẩn `#FF0000` (`RGBColor(255, 0, 0)`).
  - Định dạng: **In thường, bold = False**.
  - **Lý do sư phạm**: In đậm sẽ làm lộ câu trả lời khi giáo viên xem lướt hoặc in ấn thử.

### 2.2. Câu hỏi True / False đặt ngay CÙNG 1 DÒNG với đáp án (Tiết kiệm giấy)
- **Trước đây**: Câu hỏi 1 dòng + Table borderless bên dưới -> Chiếm 10 dòng + 5 Table, phình dãn rộng nửa trang giấy.
- **Quy chuẩn mới**: Đặt câu hỏi và 2 lựa chọn `A. True` và `B. False` trên **CÙNG 1 DÒNG** sử dụng Tab Stops của Paragraph:
  ```text
  6. Mi lives in a quiet and peaceful village.                A. True        B. False
  ```
- **Triển khai code Python-docx**:
  ```python
  p = doc.add_paragraph()
  p.paragraph_format.space_before = Pt(1)
  p.paragraph_format.space_after = Pt(1)
  p.paragraph_format.line_spacing = 1.05
  p.paragraph_format.tab_stops.add_tab_stop(Inches(5.2), WD_TAB_ALIGNMENT.LEFT)
  p.paragraph_format.tab_stops.add_tab_stop(Inches(6.2), WD_TAB_ALIGNMENT.LEFT)

  # Run 1: Câu hỏi
  r_q = p.add_run(f"{q_num}. {statement}\t")
  r_q.font.size = Pt(11)

  # Run 2: Lựa chọn A
  r_a = p.add_run("A. True\t")
  r_a.font.size = Pt(11)
  if corr_idx == 0:
      r_a.font.color.rgb = RGBColor(255, 0, 0)
      r_a.bold = False

  # Run 3: Lựa chọn B
  r_b = p.add_run("B. False")
  r_b.font.size = Pt(11)
  if corr_idx == 1:
      r_b.font.color.rgb = RGBColor(255, 0, 0)
      r_b.bold = False
  ```

### 2.3. Loại bỏ toàn bộ Borderless Table trong câu hỏi trắc nghiệm
- **Nguyên nhân dãn dòng rộng**: Thẻ `<w:tbl>` không viền vẫn bị Microsoft Word áp đệm lề bảng (`top/bottom cell margins`) và khoảng cách đoạn văn trước/sau bảng.
- **Giải pháp**: 100% câu hỏi trắc nghiệm Part 1, 3, 4, 5, 6, 7 chuyển sang dùng **Paragraph Tab Stops**:
  - Dòng câu hỏi: `space_after = Pt(0)`.
  - Dòng các phương án: `space_before = Pt(0)`, `space_after = Pt(1.5)`, chia đều Tab Stops (ví dụ 4 cột: Tab tại `Inches(0.0)`, `Inches(1.75)`, `Inches(3.5)`, `Inches(5.25)`).

### 2.4. Tối ưu số lượng Table trong file Word
- Toàn bộ file Word chỉ còn khoảng **7 Table cần thiết**:
  1. Bảng Khung Ma trận đề kiểm tra (Trang 1).
  2. Bảng Bản đặc tả ma trận (Trang 2-3).
  3. Bảng điểm Marks Table (Đầu mỗi mã đề: Mã đề 1, Mã đề 2...).
  4. Bảng đối chiếu đáp án song song (Parallel Answer Keys Table) ở cuối đề.
  5. Bảng Audio Scripts (nếu có).

---

## 3. QUY CHUẨN KHUNG MA TRẬN ĐỀ KIỂM TRA (CHUẨN 16 CỘT BỘ GD&ĐT)

Khung ma trận phải là **Tiếng Việt sư phạm chuẩn mực**, bám sát mẫu tập huấn của Bộ GD&ĐT và file Excel gốc của Thầy Đinh Văn Thành (`Ma trận Đề KT GK  môn TA cấp THCS.xlsx` và `Ma trận Đề KT CK môn TA cấp THCS.xlsx`).

### 3.1. Cấu trúc 16 Cột & Header 3 Tầng:
| Cột 0 | Cột 1 | Cột 2 | Cột 3 - 5 | Cột 6 - 8 | Cột 9 - 11 | Cột 12 - 14 | Cột 15 |
|---|---|---|---|---|---|---|---|
| **TT** | **Chương / chủ đề** | **Nội dung / đơn vị kiến thức** | **TNKQ nhiều lựa chọn** | **TNKQ đúng - sai** | **Tự luận** | **Tổng** | **Tỉ lệ % điểm** |
| (merge) | (merge) | (merge) | Biết \| Hiểu \| VD | Biết \| Hiểu \| VD | Biết \| Hiểu \| VD | Biết \| Hiểu \| VD | (merge) |

- **Chiều rộng cột chuẩn (Auto-fit to window)**:
  `[Inches(0.30), Inches(0.85), Inches(1.45)] + [Inches(0.31)] * 12 + [Inches(0.42)]`

### 3.2. Bắt buộc có 3 Dòng Tổng ở cuối bảng Ma trận:
1. `Tổng số câu`: Thống kê chính xác số lượng câu hỏi Biết, Hiểu, Vận dụng của từng loại hình trắc nghiệm và tự luận.
2. `Tổng số điểm`: Tổng điểm theo từng mức độ (Chuẩn: Biết **4.0đ** - Hiểu **3.0đ** - Vận dụng **3.0đ** = **10.0 điểm**).
3. `Tỉ lệ %`: Tỉ lệ phần trăm tương ứng (**40% Biết - 30% Hiểu - 30% Vận dụng = 100%**).
- Cả 3 dòng tổng được định dạng **in đậm (`bold=True`)**, nền màu xám nhạt `#F4F6F9`.

---

## 4. QUY CHUẨN BẢN ĐẶC TẢ MA TRẬN (CHUẨN 7 CỘT CÓ DÒNG TỔNG)

Bản đặc tả mức độ đánh giá các yêu cầu cần đạt bám sát đúng mẫu file Excel tập huấn của Thầy (`Đặc tả Đề KT GKI TA 8.xlsx` và `Đặc tả Đề KT CUỐI KỲ II TA 8. 2026.xlsx`).

### 4.1. Cấu trúc 7 Cột & Header 2 Tầng:
- Cột 1: `TT` (0.35")
- Cột 2: `Chương/ chủ đề` (0.85")
- Cột 3: `Nội dung/đơn vị kiến thức` (1.35")
- Cột 4: `Yêu cầu cần đạt (Mức độ đánh giá)` (2.65")
- Cột 5: `Số lượng câu hỏi: Nhiều lựa chọn` (0.55")
- Cột 6: `Số lượng câu hỏi: Đúng - Sai` (0.55")
- Cột 7: `Tự luận` (0.55")

### 4.2. QUY TẮC BẮT BUỘC: HÀNG CUỐI CÙNG PHẢI CÓ DÒNG "TỔNG"
- Thầy luôn yêu cầu: **Bản đặc tả phải có dòng "Tổng" ở cuối** để giáo viên và Ban Giám hiệu kiểm tra tổng số lượng câu hỏi của đề thi:
  - **Đề Giữa kỳ (GK)**:
    `("Tổng", "", "", "", "31", "5", "1")` -> Tổng 37 câu/lệnh hỏi.
  - **Đề Cuối kỳ (CK - có Speaking)**:
    `("Tổng", "", "", "", "30", "5", "1 (+ Nói)")`.
- Khi render ra Word: Toàn bộ hàng Tổng được in đậm (`bold=True`), nền `#F4F6F9`, các ô số liệu căn giữa (`WD_ALIGN_PARAGRAPH.CENTER`).

---

## 5. HƯỚNG DẪN ÁP DỤNG RIÊNG CHO TẠO ĐỀ TIẾNG ANH THPT (LỚP 10, 11, 12)

Khi triển khai phần mềm **Tạo Đề Tiếng Anh THPT**, kế thừa toàn bộ engine của THCS nhưng **thay đổi toàn diện nội dung theo chuẩn THPT**:

### 5.1. Kiến thức & Ngữ liệu SGK THPT (Global Success):
- **Lớp 10**:
  - GK1: Unit 1 (Family Life), Unit 2 (Humans and the Environment), Unit 3 (Music).
  - CK1: Unit 1 đến Unit 5 (Inventions).
  - GK2: Unit 6 (Gender Equality), Unit 7 (Viet Nam and International Organisations), Unit 8 (New Ways to Learn).
  - CK2: Unit 6 đến Unit 10 (Ecotourism).
- **Lớp 11**:
  - GK1: Unit 1 (A Long and Healthy Life), Unit 2 (The Generation Gap), Unit 3 (Cities of the Future).
  - CK1: Unit 1 đến Unit 5 (Global Warming).
  - GK2: Unit 6 (Preserving Our Heritage), Unit 7 (Education Options for School-Leavers), Unit 8 (Becoming Independent).
  - CK2: Unit 6 đến Unit 10 (Southeast Asian and the World).
- **Lớp 12**:
  - GK1: Unit 1 (Life Stories we Admire), Unit 2 (A Multicultural World), Unit 3 (Green Living).
  - CK1: Unit 1 đến Unit 5 (The World of Work).
  - GK2: Unit 6 (Artificial Intelligence), Unit 7 (The World of Mass Media), Unit 8 (Lifelong Learning).
  - CK2: Unit 6 đến Unit 10 (Career Paths).

### 5.2. Định dạng đề kiểm tra định kỳ THPT:
- Tùy theo cấu trúc trường THPT lựa chọn:
  - **Cấu trúc truyền thống 4 kỹ năng**: Nghe hiểu (20%) + Đọc hiểu (30%) + Kiến thức ngôn ngữ (30%) + Viết (20%).
  - **Cấu trúc format mới 2025 (Quyết định 764/BGDĐT)**:
    - Phần I: Câu trắc nghiệm nhiều lựa chọn (Đọc hiểu, Từ vựng, Ngữ pháp, Sắp xếp hội thoại/đoạn văn).
    - Phần II: Câu trắc nghiệm Đúng / Sai (Đọc hiểu thông tin chuyên sâu).
    - Phần III: Câu trắc nghiệm trả lời ngắn hoặc Tự luận viết câu/đoạn văn.
- **Độ dài bài nghe và bài đọc THPT**:
  - Bài nghe: 150 - 180 từ (Lớp 10, 11); 180 - 220 từ (Lớp 12).
  - Bài đọc điền khuyết: 150 - 180 từ.
  - Bài đọc hiểu: 200 - 250 từ.

---

## 6. QUY TẮC ĐỘC LẬP BẢN QUYỀN APP THPT (MỤC 5 GEMINI.MD)

- **Mã sản phẩm riêng**: `ENGPT` (Tiếng Anh THPT).
- **Mã máy**: `DVT-ENGPT-[4_KÝ_TỰ]-[4_KÝ_TỰ]` (Ví dụ: `DVT-ENGPT-8A1C-9F2D`).
- **Key bản quyền**: `KEY-ENGPT-[HẠN_DÙNG]-[CHỮ_KÝ_ED25519]`.
- **Payload ký số**: `PRODUCT:ENGPT#{machine_id}#{exp_date}`.
- **Tuyệt đối không dùng chung key**: Key THCS (`ENGCS`) hoặc NLS (`NLS`) không bao giờ được mở khóa App THPT.
- **Báo giá**: Tuyệt đối không hiển thị giá tiền bằng số. Luôn điều hướng Giáo viên liên hệ Zalo Thầy Thành: `0915.213717`.

---

## 7. QUY CHUẨN ĐẶT TÊN THƯ MỤC & ĐÓNG GÓI BÀN GIAO

Để tránh nguy cơ xóa nhầm mã nguồn:
1. **Tên thư mục mã nguồn**: Luôn đặt đúng tên sản phẩm, ví dụ:
   - `Admin_Tool_TaoDe_TiengAnh_THCS` (cho cấp THCS).
   - `Admin_Tool_TaoDe_TiengAnh_THPT` (cho cấp THPT).
   - **Tuyệt đối không để tên cũ `NLS_AI` trong các app Tạo Đề**.
2. **Gom toàn bộ tài liệu**: Đặt thư mục `Mẫu Ma trận, đặc tả` vào bên trong thư mục `Admin_Tool_...` để quản lý tập trung 1 chỗ.
3. **Dọn dẹp trước khi đóng gói**: Xóa toàn bộ `build/`, `dist/`, `__pycache__`, file `.docx` rác để thư mục mã nguồn chỉ khoảng 5 - 10 MB.
4. **Bộ sản phẩm bàn giao ở thư mục gốc**:
   - `Cai_Dat_TaoDe_TiengAnh_THPT.exe` (Bộ cài đặt tự động).
   - `Tao_De_Tieng_Anh_THPT_Pass_123.zip` (Gói nén AES-256 bảo vệ mật khẩu `123`).
5. **Đồng bộ tự động lên Web**:
   - File cấu hình phiên bản: `public/version_exam_eng_thpt.json`.
   - Upload GitHub Release thẻ tương ứng (`v2.0-exam-thpt`).
   - `git push origin main` lên Vercel.
