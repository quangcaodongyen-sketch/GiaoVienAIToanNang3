import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Download, 
  Upload, 
  Printer, 
  Sparkles, 
  TrendingUp, 
  Star, 
  Clock, 
  MessageSquare, 
  FileSpreadsheet, 
  X, 
  Check, 
  AlertCircle,
  ChevronDown,
  Layers,
  BarChart3,
  RefreshCw,
  FolderPlus,
  UserPlus
} from 'lucide-react';
import { 
  studentGradebookService, 
  ClassRoom, 
  StudentProfile, 
  StudentSubmission, 
  AcademicRank,
  ClassLeaderboardItem 
} from '../services/studentGradebookService';

export const AdminStudentGradebook: React.FC = () => {
  // Sub-tabs: 'gradebook' (Sổ điểm) | 'classes' (Lớp & HS) | 'leaderboard' (Bảng thi đua & Báo cáo)
  const [subTab, setSubTab] = useState<'gradebook' | 'classes' | 'leaderboard'>('gradebook');

  // Dữ liệu
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('cls-7a1');
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);

  // Bộ lọc sổ điểm
  const [filterGrade, setFilterGrade] = useState<number | 0>(0);
  const [filterClassId, setFilterClassId] = useState<string>('all');
  const [filterTestType, setFilterTestType] = useState<string>('all');
  const [filterRank, setFilterRank] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State
  const [showAddClassModal, setShowAddClassModal] = useState<boolean>(false);
  const [newClassName, setNewClassName] = useState<string>('');
  const [newClassGrade, setNewClassGrade] = useState<number>(7);
  const [newClassTeacher, setNewClassTeacher] = useState<string>('Thầy Đinh Văn Thành');

  const [showAddStudentModal, setShowAddStudentModal] = useState<boolean>(false);
  const [studentFormName, setStudentFormName] = useState<string>('');
  const [studentFormGender, setStudentFormGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [studentFormDob, setStudentFormDob] = useState<string>('');
  const [studentFormPhone, setStudentFormPhone] = useState<string>('');
  const [studentFormNote, setStudentFormNote] = useState<string>('');

  const [showBulkImportModal, setShowBulkImportModal] = useState<boolean>(false);
  const [bulkImportText, setBulkImportText] = useState<string>('');

  const [feedbackModalSub, setFeedbackModalSub] = useState<StudentSubmission | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Nạp dữ liệu
  const refreshData = () => {
    const cls = studentGradebookService.getClasses();
    setClasses(cls);
    if (cls.length > 0 && (!selectedClassId || !cls.some(c => c.id === selectedClassId))) {
      setSelectedClassId(cls[0].id);
    }
    setStudents(studentGradebookService.getStudents());
    setSubmissions(studentGradebookService.getSubmissions());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Lọc bài làm theo điều kiện
  const filteredSubmissions = submissions.filter(sub => {
    if (filterGrade !== 0 && sub.grade !== filterGrade) return false;
    if (filterClassId !== 'all' && sub.classId !== filterClassId) return false;
    if (filterTestType !== 'all' && sub.testType !== filterTestType) return false;
    if (filterRank !== 'all' && sub.rankLevel !== filterRank) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match = sub.studentName.toLowerCase().includes(q) || 
                    sub.studentCode.toLowerCase().includes(q) || 
                    sub.testTitle.toLowerCase().includes(q) ||
                    sub.className.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Học sinh của lớp đang chọn trong tab Quản lý Lớp & HS
  const currentClassStudents = students.filter(s => s.classId === selectedClassId);
  const currentClassObj = classes.find(c => c.id === selectedClassId);

  // Bảng xếp hạng của lớp đang chọn
  const classLeaderboard: ClassLeaderboardItem[] = selectedClassId 
    ? studentGradebookService.getClassLeaderboard(selectedClassId) 
    : [];

  const classStats = selectedClassId 
    ? studentGradebookService.getClassComparisonStats(selectedClassId) 
    : null;

  // Thêm lớp mới
  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    const created = studentGradebookService.addClass({
      name: newClassName.trim().toUpperCase(),
      grade: Number(newClassGrade),
      schoolYear: '2025 - 2026',
      homeroomTeacher: newClassTeacher.trim() || 'Thầy Đinh Văn Thành',
      description: `Lớp ${newClassName.trim().toUpperCase()} - Khối ${newClassGrade}`
    });
    setNewClassName('');
    setShowAddClassModal(false);
    refreshData();
    setSelectedClassId(created.id);
    showToast(`Đã thêm lớp ${created.name} thành công!`);
  };

  // Thêm 1 học sinh
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentFormName.trim() || !selectedClassId || !currentClassObj) return;

    const count = currentClassStudents.length + 1;
    const code = `HS${currentClassObj.name}-${count < 10 ? '0' + count : count}`;

    studentGradebookService.addStudent({
      studentCode: code,
      name: studentFormName.trim(),
      classId: currentClassObj.id,
      className: currentClassObj.name,
      grade: currentClassObj.grade,
      gender: studentFormGender,
      dob: studentFormDob || undefined,
      parentPhone: studentFormPhone || undefined,
      note: studentFormNote || undefined
    });

    setStudentFormName('');
    setStudentFormPhone('');
    setStudentFormNote('');
    setShowAddStudentModal(false);
    refreshData();
    showToast(`Đã thêm học sinh ${studentFormName.trim()} vào lớp ${currentClassObj.name}!`);
  };

  // Nhập nhanh cả lớp từ Excel
  const handleBulkImport = () => {
    if (!bulkImportText.trim() || !selectedClassId) return;
    const res = studentGradebookService.bulkImportStudents(selectedClassId, bulkImportText);
    setShowBulkImportModal(false);
    setBulkImportText('');
    refreshData();
    showToast(`Đã nhập thành công ${res.importedCount} học sinh vào lớp!`);
  };

  // Xóa học sinh
  const handleDeleteStudent = (studentId: string, name: string) => {
    if (window.confirm(`Thầy/Cô có chắc chắn muốn xóa học sinh "${name}" khỏi danh sách?`)) {
      studentGradebookService.deleteStudent(studentId);
      refreshData();
      showToast(`Đã xóa học sinh ${name}!`);
    }
  };

  // Xóa lớp
  const handleDeleteClass = (classId: string, name: string) => {
    if (window.confirm(`CẢNH BÁO: Xóa lớp "${name}" sẽ xóa toàn bộ danh sách học sinh và kết quả bài làm của lớp này. Thầy/Cô có chắc chắn không?`)) {
      studentGradebookService.deleteClass(classId);
      refreshData();
      showToast(`Đã xóa lớp ${name}!`);
    }
  };

  // Lưu lời phê
  const handleSaveFeedback = () => {
    if (!feedbackModalSub) return;
    studentGradebookService.updateTeacherFeedback(feedbackModalSub.id, feedbackText);
    setFeedbackModalSub(null);
    refreshData();
    showToast('Đã lưu lời phê của Thầy/Cô thành công!');
  };

  // Xóa bài làm
  const handleDeleteSubmission = (subId: string, studentName: string) => {
    if (window.confirm(`Thầy/Cô có muốn xóa kết quả bài làm của học sinh "${studentName}" để học sinh làm lại không?`)) {
      studentGradebookService.deleteSubmission(subId);
      refreshData();
      showToast('Đã xóa kết quả bài làm!');
    }
  };

  // Xuất file CSV
  const handleExportCSV = () => {
    const csvContent = studentGradebookService.exportGradebookToCSV(filterClassId);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const targetClass = filterClassId !== 'all' ? classes.find(c => c.id === filterClassId) : null;
    link.setAttribute('download', `So_Diem_Online_${targetClass ? targetClass.name : 'Toan_Truong'}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Đã xuất file Excel Sổ điểm thành công!');
  };

  // In sổ điểm
  const handlePrint = () => {
    window.print();
  };

  // Render badge điểm số & học lực (chuẩn màu sắc sư phạm tươi sáng)
  const renderRankBadge = (rank: AcademicRank) => {
    switch (rank) {
      case 'XUAT_SAC':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-300 shadow-xs">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Xuất sắc
          </span>
        );
      case 'GIOI':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Giỏi
          </span>
        );
      case 'KHA':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-300 shadow-xs">
            Khá
          </span>
        );
      case 'DAT':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            Đạt
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-300">
            Cần cố gắng
          </span>
        );
    }
  };

  // Thống kê toàn trường
  const totalStudentsCount = students.length;
  const totalClassesCount = classes.length;
  const totalSubmissionsCount = submissions.length;
  const globalAvg = submissions.length > 0 
    ? Math.round((submissions.reduce((acc, s) => acc + s.score, 0) / submissions.length) * 10) / 10 
    : 0;
  const highAchieversCount = submissions.filter(s => s.score >= 8.0).length;
  const highAchieversRate = submissions.length > 0 
    ? Math.round((highAchieversCount / submissions.length) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* TOAST THÔNG BÁO */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-white/40 animate-bounce">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-white" />
          <span className="font-bold text-sm text-white">{toastMessage}</span>
        </div>
      )}

      {/* HEADER BANNER QUẢN LÝ HỌC SINH & SỔ ĐIỂM (GAM MÀU XANH SGK & CHỮ TRẮNG NỔI BẬT) */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 border-2 border-blue-500/40 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3.5 py-1 rounded-full text-xs font-black bg-white/20 text-white border border-white/30 flex items-center gap-1.5 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> PHÂN HỆ QUẢN TRỊ ADMIN CHUYÊN SÂU
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-blue-950 shadow-sm">
                THẦY ĐINH VĂN THÀNH - 0915.213717
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5 tracking-tight">
              <GraduationCap className="w-8 h-8 text-amber-300" />
              Quản Lý Học Sinh Theo Lớp & Sổ Điểm Trực Tuyến Toàn Diện
            </h2>
            <p className="text-sm sm:text-base text-blue-100 max-w-2xl font-medium leading-relaxed">
              Theo dõi toàn diện học sinh theo từng lớp, tự động chấm điểm, quản lý sổ điểm online, biểu đồ phổ điểm và bảng thi đua giúp học sinh có mục tiêu học tập rõ ràng.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs sm:text-sm shadow-md flex items-center gap-2 border border-emerald-300 transition-all hover:scale-105 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" /> Xuất Excel Sổ Điểm
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm border border-white/40 shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-white" /> In Sổ Điểm
            </button>
          </div>
        </div>

        {/* THẺ THỐNG KÊ NHANH (NỀN TRẮNG SÁNG, CHỮ RÕ RÀNG) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-5 border-t border-blue-500/40">
          <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-blue-200/50 flex items-center gap-3 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-bold">Tổng Học Sinh</p>
              <p className="text-lg font-black text-blue-950">{totalStudentsCount} <span className="text-xs font-normal text-slate-500">em</span></p>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-blue-200/50 flex items-center gap-3 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-bold">Lớp Học</p>
              <p className="text-lg font-black text-blue-950">{totalClassesCount} <span className="text-xs font-normal text-slate-500">lớp</span></p>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-blue-200/50 flex items-center gap-3 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-bold">Bài Đã Nộp</p>
              <p className="text-lg font-black text-blue-950">{totalSubmissionsCount} <span className="text-xs font-normal text-slate-500">lượt</span></p>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-blue-200/50 flex items-center gap-3 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-amber-600 fill-amber-500" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-bold">Điểm Trung Bình</p>
              <p className="text-lg font-black text-amber-700">{globalAvg} <span className="text-xs font-normal text-slate-500">/ 10</span></p>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-blue-200/50 flex items-center gap-3 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-bold">Tỷ Lệ Giỏi - Xuất Sắc</p>
              <p className="text-lg font-black text-emerald-700">{highAchieversRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* THANH ĐIỀU HƯỚNG 3 SUB-TABS (MÀU SẮC SÁNG TRƯỜNG HỌC) */}
      <div className="flex border-b-2 border-blue-200 gap-2 overflow-x-auto pb-0.5">
        <button
          onClick={() => setSubTab('gradebook')}
          className={`px-5 py-3 font-black text-xs sm:text-sm border-b-4 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            subTab === 'gradebook'
              ? 'border-blue-700 text-blue-800 bg-blue-50/80 rounded-t-2xl shadow-xs'
              : 'border-transparent text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-t-2xl'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-blue-700" /> Sổ Điểm Trực Tuyến ({filteredSubmissions.length})
        </button>
        <button
          onClick={() => setSubTab('classes')}
          className={`px-5 py-3 font-black text-xs sm:text-sm border-b-4 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            subTab === 'classes'
              ? 'border-blue-700 text-blue-800 bg-blue-50/80 rounded-t-2xl shadow-xs'
              : 'border-transparent text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-t-2xl'
          }`}
        >
          <Users className="w-4 h-4 text-blue-700" /> Quản Lý Lớp & Học Sinh ({classes.length} Lớp)
        </button>
        <button
          onClick={() => setSubTab('leaderboard')}
          className={`px-5 py-3 font-black text-xs sm:text-sm border-b-4 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            subTab === 'leaderboard'
              ? 'border-blue-700 text-blue-800 bg-blue-50/80 rounded-t-2xl shadow-xs'
              : 'border-transparent text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-t-2xl'
          }`}
        >
          <Award className="w-4 h-4 text-blue-700" /> Bảng Thi Đua & Báo Cáo Lớp
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: SỔ ĐIỂM TRỰC TUYẾN (GRADEBOOK) - NỀN SÁNG CHUẨN SGK */}
      {/* ========================================================================= */}
      {subTab === 'gradebook' && (
        <div className="space-y-4">
          {/* BỘ LỌC ĐA NĂNG TRÊN NỀN TRẮNG SẠCH SẼ */}
          <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Lọc khối */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                <span>Khối:</span>
                <select
                  value={filterGrade}
                  onChange={(e) => {
                    const g = Number(e.target.value);
                    setFilterGrade(g);
                    setFilterClassId('all');
                  }}
                  className="bg-slate-50 text-blue-950 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Tất cả khối</option>
                  <option value={6}>Khối 6</option>
                  <option value={7}>Khối 7</option>
                  <option value={8}>Khối 8</option>
                  <option value={9}>Khối 9</option>
                  <option value={10}>Khối 10</option>
                  <option value={11}>Khối 11</option>
                  <option value={12}>Khối 12</option>
                </select>
              </div>

              {/* Lọc lớp */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <span>Lớp:</span>
                <select
                  value={filterClassId}
                  onChange={(e) => setFilterClassId(e.target.value)}
                  className="bg-slate-50 text-blue-950 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả lớp</option>
                  {classes
                    .filter(c => filterGrade === 0 || c.grade === filterGrade)
                    .map(c => (
                      <option key={c.id} value={c.id}>Lớp {c.name}</option>
                    ))}
                </select>
              </div>

              {/* Lọc loại bài */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <span>Hình thức:</span>
                <select
                  value={filterTestType}
                  onChange={(e) => setFilterTestType(e.target.value)}
                  className="bg-slate-50 text-blue-950 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả bài</option>
                  <option value="online_quiz">Đề Thi Trắc Nghiệm Online</option>
                  <option value="sgk_exercise">Bài Tập SGK Từng Phần</option>
                </select>
              </div>

              {/* Lọc xếp loại */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <span>Xếp loại:</span>
                <select
                  value={filterRank}
                  onChange={(e) => setFilterRank(e.target.value)}
                  className="bg-slate-50 text-blue-950 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả học lực</option>
                  <option value="XUAT_SAC">Xuất sắc (9 - 10)</option>
                  <option value="GIOI">Giỏi (8 - 8.9)</option>
                  <option value="KHA">Khá (6.5 - 7.9)</option>
                  <option value="DAT">Đạt (5.0 - 6.4)</option>
                  <option value="CAN_CO_GANG">Cần cố gắng (&lt; 5.0)</option>
                </select>
              </div>
            </div>

            {/* Ô tìm kiếm */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm tên, mã HS, bài thi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* BẢNG SỔ ĐIỂM: TIÊU ĐỀ XANH DƯƠNG CHỮ TRẮNG TƯƠNG PHẢN NỔI BẬT */}
          <div className="rounded-2xl border-2 border-blue-200 bg-white overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-800">
                <thead className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 text-white font-black uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-3 w-12 text-center text-white">STT</th>
                    <th className="py-3.5 px-3 text-white">Học Sinh</th>
                    <th className="py-3.5 px-3 text-center text-white">Lớp</th>
                    <th className="py-3.5 px-3 text-white">Bài Kiểm Tra / Bài Tập</th>
                    <th className="py-3.5 px-3 text-center text-white">Số Câu</th>
                    <th className="py-3.5 px-3 text-center text-white">Điểm Số</th>
                    <th className="py-3.5 px-3 text-center text-white">Xếp Loại</th>
                    <th className="py-3.5 px-3 text-center text-white">Ngày Nộp</th>
                    <th className="py-3.5 px-3 text-white">Lời Phê Của Thầy/Cô</th>
                    <th className="py-3.5 px-3 text-center w-24 text-white">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-500 bg-slate-50">
                        <BookOpen className="w-8 h-8 text-blue-300 mx-auto mb-2" />
                        Chưa có bản ghi điểm nào phù hợp với bộ lọc hiện tại.
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((sub, idx) => (
                      <tr key={sub.id} className="hover:bg-blue-50/60 transition-colors">
                        <td className="py-3.5 px-3 text-center text-slate-500 font-mono text-xs font-bold">{idx + 1}</td>
                        <td className="py-3.5 px-3">
                          <p className="font-extrabold text-blue-950 text-sm">{sub.studentName}</p>
                          <span className="text-[11px] font-mono font-bold text-blue-600">{sub.studentCode}</span>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-100 font-black text-xs text-blue-800 border border-blue-200">
                            {sub.className}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <p className="font-bold text-slate-900 line-clamp-1">{sub.testTitle}</p>
                          <span className="text-[11px] text-slate-500 font-medium">{sub.unitTitle}</span>
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono">
                          <span className="text-emerald-700 font-black">{sub.correctCount}</span> / {sub.totalQuestions}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className={`inline-block px-3 py-1 rounded-xl font-black text-sm shadow-xs ${
                            sub.score >= 9.0 ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                            sub.score >= 8.0 ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                            sub.score >= 6.5 ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                            sub.score >= 5.0 ? 'bg-slate-100 text-slate-800 border border-slate-300' :
                            'bg-rose-100 text-rose-900 border border-rose-300'
                          }`}>
                            {sub.score.toFixed(1)}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          {renderRankBadge(sub.rankLevel)}
                        </td>
                        <td className="py-3.5 px-3 text-center text-xs text-slate-500 font-medium whitespace-nowrap">
                          {new Date(sub.submittedAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="py-3.5 px-3 max-w-xs">
                          {sub.teacherFeedback ? (
                            <p className="text-xs text-amber-900 font-semibold italic bg-amber-50 p-2 rounded-xl border border-amber-200 line-clamp-2">
                              "{sub.teacherFeedback}"
                            </p>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Chưa có lời phê</span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setFeedbackModalSub(sub);
                                setFeedbackText(sub.teacherFeedback || '');
                              }}
                              title="Ghi lời phê / nhận xét cho học sinh"
                              className="p-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSubmission(sub.id, sub.studentName)}
                              title="Xóa bài làm (cho phép học sinh làm lại)"
                              className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: QUẢN LÝ LỚP HỌC & HỌC SINH (CLASSES & STUDENTS) */}
      {/* ========================================================================= */}
      {subTab === 'classes' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* CỘT DANH SÁCH LỚP HỌC */}
          <div className="lg:col-span-1 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b-2 border-blue-200">
              <h3 className="text-sm font-black text-blue-950 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-700" /> Danh Sách Lớp ({classes.length})
              </h3>
              <button
                onClick={() => setShowAddClassModal(true)}
                className="px-2.5 py-1 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-white" /> Thêm Lớp
              </button>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {classes.map(cls => {
                const stuCount = students.filter(s => s.classId === cls.id).length;
                const isSelected = cls.id === selectedClassId;
                return (
                  <div
                    key={cls.id}
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`p-3.5 rounded-2xl cursor-pointer border-2 transition-all ${
                      isSelected
                        ? 'bg-blue-700 text-white border-blue-800 shadow-md ring-2 ring-blue-300'
                        : 'bg-white hover:bg-blue-50/70 border-blue-100 text-slate-800 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center ${
                          isSelected ? 'bg-white text-blue-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {cls.grade}
                        </span>
                        <div>
                          <p className={`font-black text-sm ${isSelected ? 'text-white' : 'text-blue-950'}`}>Lớp {cls.name}</p>
                          <p className={`text-[11px] font-medium ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>GVCN: {cls.homeroomTeacher}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-black ${isSelected ? 'text-amber-300' : 'text-blue-700'}`}>{stuCount} HS</span>
                        <p className={`text-[10px] ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>{cls.schoolYear}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CỘT CHI TIẾT HỌC SINH CỦA LỚP ĐƯỢC CHỌN */}
          <div className="lg:col-span-3 space-y-4">
            <div className="p-4 rounded-2xl bg-white border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <div>
                <h3 className="text-base sm:text-lg font-black text-blue-950 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-700" />
                  Danh Sách Học Sinh: Lớp {currentClassObj?.name} (Khối {currentClassObj?.grade})
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  GVCN: {currentClassObj?.homeroomTeacher} | Sĩ số: <span className="font-bold text-blue-700">{currentClassStudents.length} học sinh</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-white" /> Thêm 1 HS
                </button>
                <button
                  onClick={() => setShowBulkImportModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-white" /> Dán Cả Lớp Từ Excel
                </button>
                {currentClassObj && (
                  <button
                    onClick={() => handleDeleteClass(currentClassObj.id, currentClassObj.name)}
                    className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs cursor-pointer"
                    title="Xóa lớp học này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* BẢNG DANH SÁCH HỌC SINH: TIÊU ĐỀ XANH DƯƠNG CHỮ TRẮNG */}
            <div className="rounded-2xl border-2 border-blue-200 bg-white overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-slate-800">
                  <thead className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 text-white font-black uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-3 w-12 text-center text-white">STT</th>
                      <th className="py-3.5 px-3 text-white">Mã HS</th>
                      <th className="py-3.5 px-3 text-white">Họ và Tên</th>
                      <th className="py-3.5 px-3 text-center text-white">Giới Tính</th>
                      <th className="py-3.5 px-3 text-center text-white">Số Bài Làm</th>
                      <th className="py-3.5 px-3 text-center text-white">Điểm TB</th>
                      <th className="py-3.5 px-3 text-white">Ghi Chú Sư Phạm</th>
                      <th className="py-3.5 px-3 text-center w-20 text-white">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentClassStudents.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-500 bg-slate-50">
                          Lớp này chưa có học sinh nào. Thầy/Cô hãy bấm "Thêm 1 HS" hoặc "Dán Cả Lớp Từ Excel" để nạp danh sách.
                        </td>
                      </tr>
                    ) : (
                      currentClassStudents.map((stu, idx) => {
                        const stuSubs = submissions.filter(s => s.studentId === stu.id);
                        const count = stuSubs.length;
                        const avg = count > 0 
                          ? Math.round((stuSubs.reduce((acc, s) => acc + s.score, 0) / count) * 10) / 10 
                          : 0;
                        return (
                          <tr key={stu.id} className="hover:bg-blue-50/60 transition-colors">
                            <td className="py-3.5 px-3 text-center text-slate-500 font-mono text-xs font-bold">{idx + 1}</td>
                            <td className="py-3.5 px-3 font-mono font-bold text-blue-700">{stu.studentCode}</td>
                            <td className="py-3.5 px-3 font-extrabold text-blue-950">{stu.name}</td>
                            <td className="py-3.5 px-3 text-center">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                stu.gender === 'Nữ' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {stu.gender}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-center font-black text-emerald-700">{count}</td>
                            <td className="py-3.5 px-3 text-center font-black text-amber-700">
                              {count > 0 ? avg : '-'}
                            </td>
                            <td className="py-3.5 px-3 text-xs text-slate-600 max-w-xs truncate">
                              {stu.note || stu.parentPhone || 'Bình thường'}
                            </td>
                            <td className="py-3.5 px-3 text-center">
                              <button
                                onClick={() => handleDeleteStudent(stu.id, stu.name)}
                                className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 cursor-pointer"
                                title="Xóa học sinh này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: BẢNG THI ĐUA & BÁO CÁO LỚP (LEADERBOARD & ANALYTICS) */}
      {/* ========================================================================= */}
      {subTab === 'leaderboard' && (
        <div className="space-y-6">
          {/* THANH CHỌN LỚP XEM THI ĐUA */}
          <div className="p-5 rounded-2xl bg-white border border-blue-100 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Award className="w-7 h-7 text-amber-500" />
              <div>
                <h3 className="text-base sm:text-lg font-black text-blue-950">Bảng Xếp Hạng Thi Đua & Đánh Giá Năng Lực Học Sinh</h3>
                <p className="text-xs text-slate-500 font-medium">Theo dõi thứ hạng thi đua, điểm trung bình lớp và mục tiêu phấn đấu học sinh</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Chọn lớp:</span>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="bg-slate-50 text-blue-950 font-bold px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>Lớp {c.name} (Khối {c.grade})</option>
                ))}
              </select>
            </div>
          </div>

          {/* THẺ THỐNG KÊ LỚP TRÊN NỀN TRẮNG SÁCH GIÁO KHOA */}
          {classStats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-sm">
                <p className="text-xs font-bold text-slate-500">Điểm Trung Bình Cả Lớp</p>
                <p className="text-2xl font-black text-amber-600 mt-1">{classStats.classAverageScore} <span className="text-xs font-normal text-slate-400">/ 10</span></p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-sm">
                <p className="text-xs font-bold text-slate-500">Điểm Cao Nhất Lớp</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">{classStats.highestScore} <span className="text-xs font-normal text-slate-400">/ 10</span></p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-sm">
                <p className="text-xs font-bold text-slate-500">Thủ Khoa Lớp (Top 1)</p>
                <p className="text-base font-black text-blue-950 mt-1 line-clamp-1">{classStats.topStudentName}</p>
                <span className="text-xs text-amber-600 font-black">{classStats.topStudentScore} điểm</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-sm">
                <p className="text-xs font-bold text-slate-500">Tỷ Lệ Tham Gia Luyện Đề</p>
                <p className="text-2xl font-black text-blue-700 mt-1">
                  {classStats.totalStudents > 0 ? Math.round((classStats.activeStudents / classStats.totalStudents) * 100) : 0}%
                </p>
              </div>
            </div>
          )}

          {/* BẢNG VINH DANH THI ĐUA: HEADER XANH DƯƠNG CHỮ TRẮNG */}
          <div className="rounded-2xl border-2 border-blue-200 bg-white overflow-hidden shadow-md">
            <div className="p-4 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 text-white flex items-center justify-between">
              <h4 className="font-black text-white text-sm sm:text-base flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
                Bảng Vinh Danh Top Học Sinh Xuất Sắc Lớp {currentClassObj?.name}
              </h4>
              <span className="text-xs text-blue-100 font-bold bg-white/20 px-3 py-1 rounded-full">Sắp xếp theo Điểm Trung Bình</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-800">
                <thead className="bg-blue-50 text-blue-950 font-black uppercase text-[11px] tracking-wider border-b border-blue-100">
                  <tr>
                    <th className="py-3 px-4 w-16 text-center">Hạng</th>
                    <th className="py-3 px-4">Học Sinh</th>
                    <th className="py-3 px-4 text-center">Mã HS</th>
                    <th className="py-3 px-4 text-center">Số Bài Đã Làm</th>
                    <th className="py-3 px-4 text-center">Điểm Cao Nhất</th>
                    <th className="py-3 px-4 text-center">Điểm Trung Bình</th>
                    <th className="py-3 px-4 text-center">Xếp Loại</th>
                    <th className="py-3 px-4">Huy Hiệu Phấn Đấu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classLeaderboard.map((item) => (
                    <tr 
                      key={item.studentId} 
                      className={`transition-colors ${
                        item.rank === 1 ? 'bg-amber-50/70 font-bold' :
                        item.rank === 2 ? 'bg-slate-50 font-semibold' :
                        item.rank === 3 ? 'bg-orange-50/60 font-semibold' :
                        'hover:bg-blue-50/40'
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center font-black">
                        {item.rank === 1 && <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-400 text-blue-950 font-black text-sm shadow-sm">1 👑</span>}
                        {item.rank === 2 && <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-300 text-blue-950 font-black text-sm shadow-sm">2 🥈</span>}
                        {item.rank === 3 && <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-600 text-white font-black text-sm shadow-sm">3 🥉</span>}
                        {item.rank > 3 && <span className="text-slate-500 font-mono font-bold">#{item.rank}</span>}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-extrabold text-blue-950">{item.studentName}</p>
                        {item.recentTestTitle && (
                          <span className="text-[11px] text-slate-500 font-medium">Gần nhất: {item.recentTestTitle} ({item.recentScore}đ)</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-blue-700 font-bold">{item.studentCode}</td>
                      <td className="py-3.5 px-4 text-center font-black text-emerald-700">{item.testsCount} bài</td>
                      <td className="py-3.5 px-4 text-center font-black text-blue-950">
                        {item.highestScore > 0 ? item.highestScore.toFixed(1) : '-'}
                      </td>
                      <td className="py-3.5 px-4 text-center font-black text-amber-700 text-base">
                        {item.averageScore > 0 ? item.averageScore.toFixed(1) : '-'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {renderRankBadge(item.rankLevel)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {item.badges.length > 0 ? (
                            item.badges.map((b, i) => (
                              <span key={i} className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                                {b}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400 italic">Đang phấn đấu</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL THÊM LỚP MỚI (NỀN TRẮNG SÁNG) ==================== */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-blue-300 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <h3 className="font-black text-blue-950 text-base flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-blue-700" /> Thêm Lớp Học Mới
              </h3>
              <button onClick={() => setShowAddClassModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Tên lớp (VD: 6A1, 7A2, 8A1, 9A1, 10A1...):</label>
                <input
                  type="text"
                  required
                  placeholder="Nhập tên lớp..."
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Khối lớp:</label>
                <select
                  value={newClassGrade}
                  onChange={(e) => setNewClassGrade(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={6}>Khối 6 (THCS)</option>
                  <option value={7}>Khối 7 (THCS)</option>
                  <option value={8}>Khối 8 (THCS)</option>
                  <option value={9}>Khối 9 (THCS)</option>
                  <option value={10}>Khối 10 (THPT)</option>
                  <option value={11}>Khối 11 (THPT)</option>
                  <option value={12}>Khối 12 (THPT)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Giáo viên chủ nhiệm:</label>
                <input
                  type="text"
                  value={newClassTeacher}
                  onChange={(e) => setNewClassTeacher(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-700 text-white font-black hover:bg-blue-600 shadow-sm cursor-pointer"
                >
                  Tạo Lớp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL THÊM 1 HỌC SINH (NỀN TRẮNG SÁNG) ==================== */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-blue-300 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <h3 className="font-black text-blue-950 text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-700" /> Thêm Học Sinh Vào Lớp {currentClassObj?.name}
              </h3>
              <button onClick={() => setShowAddStudentModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Họ và tên học sinh:</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nguyễn Văn Nam..."
                  value={studentFormName}
                  onChange={(e) => setStudentFormName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Giới tính:</label>
                  <select
                    value={studentFormGender}
                    onChange={(e) => setStudentFormGender(e.target.value as 'Nam' | 'Nữ')}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Số ĐT phụ huynh (nếu có):</label>
                  <input
                    type="text"
                    placeholder="VD: 0988.xxx..."
                    value={studentFormPhone}
                    onChange={(e) => setStudentFormPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Ghi chú sư phạm:</label>
                <input
                  type="text"
                  placeholder="VD: Chăm chỉ, năng nổ trong giờ học..."
                  value={studentFormNote}
                  onChange={(e) => setStudentFormNote(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-700 text-white font-black hover:bg-blue-600 shadow-sm cursor-pointer"
                >
                  Lưu Học Sinh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL DÁN CẢ LỚP TỪ EXCEL ==================== */}
      {showBulkImportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-blue-300 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <h3 className="font-black text-blue-950 text-base flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-600" /> Nhập Nhanh Danh Sách Lớp {currentClassObj?.name}
              </h3>
              <button onClick={() => setShowBulkImportModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Thầy/Cô chỉ cần copy cột Họ và Tên từ file Excel hoặc Word rồi dán vào ô bên dưới. Hệ thống sẽ tự động tách dòng và tạo mã học sinh tự động:
            </p>

            <textarea
              rows={8}
              placeholder={`Nguyễn Văn An\nTrần Thị Bích\nLê Hoàng Long\nPhạm Quỳnh Chi...`}
              value={bulkImportText}
              onChange={(e) => setBulkImportText(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-300 text-blue-950 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-600 font-bold">
                Số dòng phát hiện: <span className="font-black text-blue-700">{bulkImportText.split('\n').filter(l => l.trim()).length}</span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowBulkImportModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 text-xs cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={handleBulkImport}
                  disabled={!bulkImportText.trim()}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-500 shadow-sm disabled:opacity-50 text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-white" /> Nhập Vào Lớp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL GHI LỜI PHÊ / NHẬN XÉT ==================== */}
      {feedbackModalSub && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-blue-300 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <h3 className="font-black text-blue-950 text-base flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-700" />
                Lời Phê Cho: {feedbackModalSub.studentName}
              </h3>
              <button onClick={() => setFeedbackModalSub(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-blue-50 rounded-2xl text-xs space-y-1 border border-blue-100">
              <p className="text-slate-700 font-medium"><span className="text-slate-500">Bài thi:</span> {feedbackModalSub.testTitle}</p>
              <p className="text-slate-700 font-medium"><span className="text-slate-500">Điểm số:</span> <span className="font-black text-amber-700">{feedbackModalSub.score} điểm</span> ({feedbackModalSub.correctCount}/{feedbackModalSub.totalQuestions} câu)</p>
            </div>

            <div>
              <label className="block text-slate-700 font-bold text-xs mb-1">Lời phê / Nhận xét của Thầy/Cô:</label>
              <textarea
                rows={4}
                placeholder="VD: Em nắm vững từ vựng Unit 1 rất tốt, cần chú ý phát âm đuôi -s/es nhé!"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-300 text-blue-950 font-medium text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setFeedbackModalSub(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 text-xs cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveFeedback}
                className="px-5 py-2 rounded-xl bg-blue-700 text-white font-black hover:bg-blue-600 shadow-sm text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4 text-white" /> Lưu Lời Phê
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
