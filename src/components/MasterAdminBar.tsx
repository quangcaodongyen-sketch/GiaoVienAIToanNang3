import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Sparkles, 
  GraduationCap, 
  LogOut, 
  RotateCw, 
  Users, 
  Layers, 
  Phone, 
  ShieldCheck, 
  Eye, 
  BookOpen, 
  Search, 
  X,
  FileSpreadsheet,
  Lock,
  Unlock
} from 'lucide-react';
import { studentGradebookService, StudentProfile } from '../services/studentGradebookService';
import { systemMaintenanceService } from '../services/systemMaintenanceService';

interface MasterAdminBarProps {
  onNavigateTab: (tab: 'welcome' | 'teachers' | 'students' | 'admin') => void;
  currentTab: 'welcome' | 'teachers' | 'students' | 'admin';
  onAdminLogout: () => void;
}

export const MasterAdminBar: React.FC<MasterAdminBarProps> = ({
  onNavigateTab,
  currentTab,
  onAdminLogout
}) => {
  const [activeStudent, setActiveStudent] = useState<StudentProfile | null>(() => 
    studentGradebookService.getActiveStudent()
  );
  const [showStudentPickerModal, setShowStudentPickerModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>('6A1');
  const [studentSearch, setStudentSearch] = useState('');
  const [allStudents, setAllStudents] = useState<StudentProfile[]>(() => 
    studentGradebookService.getStudents()
  );
  const [isMaintenanceLocked, setIsMaintenanceLocked] = useState<boolean>(() => 
    systemMaintenanceService.isMaintenanceLocked()
  );
  const [isTogglingMaintenance, setIsTogglingMaintenance] = useState(false);

  useEffect(() => {
    const handleMaintChange = (e: any) => {
      setIsMaintenanceLocked(e?.detail?.locked ?? systemMaintenanceService.isMaintenanceLocked());
    };
    window.addEventListener('gvai_maintenance_status_changed', handleMaintChange);
    return () => window.removeEventListener('gvai_maintenance_status_changed', handleMaintChange);
  }, []);

  const handleToggleMaintenance = async () => {
    if (isMaintenanceLocked) {
      if (window.confirm('Thầy có chắc chắn muốn MỞ KHÓA WEBSITE cho tất cả giáo viên toàn quốc ngay bây giờ?')) {
        setIsTogglingMaintenance(true);
        await systemMaintenanceService.setMaintenanceLock(false, 'Mở lại web bởi Thầy Thành từ MasterBar');
        setIsMaintenanceLocked(false);
        setIsTogglingMaintenance(false);
        alert('🎉 ĐÃ MỞ KHÓA WEBSITE THÀNH CÔNG!\n\nTất cả giáo viên trên toàn quốc hiện đã có thể truy cập và sử dụng bình thường.');
      }
    } else {
      if (window.confirm('⚠️ XÁC NHẬN KHÓA WEBSITE ĐỂ NÂNG CẤP:\n\nKhi khóa, tất cả giáo viên khi truy cập website sẽ chỉ xem được thông báo:\n"Web đang nâng cấp, vui lòng ghé thăm sau!"\n\nRiêng Admin có mật khẩu vẫn vào xem và quản lý bình thường.\n\nThầy có chắc chắn muốn KHÓA WEB ngay bây giờ không?')) {
        setIsTogglingMaintenance(true);
        await systemMaintenanceService.setMaintenanceLock(true, 'Nâng cấp và bảo trì hệ thống');
        setIsMaintenanceLocked(true);
        setIsTogglingMaintenance(false);
        alert('🔒 ĐÃ KHÓA WEBSITE THÀNH CÔNG!\n\nWebsite hiện đang ở chế độ nâng cấp. Giáo viên truy cập sẽ nhận được thông báo "Web đang nâng cấp, vui lòng ghé thăm sau!".');
      }
    }
  };

  useEffect(() => {
    const handleActiveChange = (e: any) => {
      setActiveStudent(e?.detail || studentGradebookService.getActiveStudent());
    };
    window.addEventListener('gvai_active_student_changed', handleActiveChange);
    return () => window.removeEventListener('gvai_active_student_changed', handleActiveChange);
  }, []);

  const isTestingStudent = Boolean(currentTab === 'students' && activeStudent);

  // Danh sách các lớp thực tế có học sinh trong trường
  const officialClasses = React.useMemo(() => {
    const classSet = new Set<string>();
    allStudents.forEach(s => {
      if (s.className) classSet.add(s.className.trim());
    });
    if (classSet.size === 0) {
      return ['6A1', '6A2', '6A3', '6A4', '6A5', '8A1', '8A2', '8A3', '8A4', '8A5'];
    }
    return Array.from(classSet).sort((a, b) => a.localeCompare(b, 'vi', { numeric: true }));
  }, [allStudents]);

  const filteredStudents = allStudents.filter(s => {
    const matchClass = s.className === selectedClass;
    if (!matchClass) return false;
    if (!studentSearch.trim()) return true;
    const q = studentSearch.toLowerCase();
    return s.name.toLowerCase().includes(q) || (s.studentCode && s.studentCode.toLowerCase().includes(q));
  });

  const handleSelectStudentToTest = (student: StudentProfile) => {
    studentGradebookService.setActiveStudent(student);
    setShowStudentPickerModal(false);
    onNavigateTab('students');
  };

  const handleExitStudentTest = () => {
    studentGradebookService.setActiveStudent(null);
    onNavigateTab('admin');
  };

  return (
    <>
      {/* ==================== MASTER ADMIN TOP BAR (ĐĨNH ĐẠC - DUY NHẤT - TOÀN WEB) ==================== */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white border-b-2 border-amber-400 shadow-xl px-3 sm:px-6 py-2 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* PHÍA TRÁI: DANH XƯNG ADMIN HOẶC TRẠNG THÁI THỬ NGHIỆM */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {isTestingStudent ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-[11px] shadow-sm animate-pulse">
                  <Eye className="w-3.5 h-3.5 text-slate-950" />
                  <span>ĐANG THỬ NGHIỆM VAI TRÒ HỌC SINH</span>
                </span>
                <span className="font-bold text-white text-xs">
                  👤 {activeStudent?.name} <span className="text-amber-300 font-mono">(Lớp {activeStudent?.className})</span>
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-xs">
                  <Crown className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-amber-300 tracking-wide">
                    QUẢN TRỊ VIÊN TOÀN QUYỀN:
                  </span>
                  <span className="font-bold text-white">Thầy giáo Đinh Văn Thành</span>
                  <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-emerald-300 font-mono text-[11px] border border-emerald-400/30">
                    <Phone className="w-3 h-3" />
                    <span>Zalo/Hotline: 0915.213717</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* PHÍA PHẢI: CÁC NÚT ĐIỀU HƯỚNG KHOA HỌC */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {isTestingStudent ? (
              <>
                <button
                  type="button"
                  onClick={() => onNavigateTab('admin')}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black transition cursor-pointer flex items-center gap-1 shadow-xs"
                  title="Quay lại Trung tâm Quản trị Admin"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>Quay Lại Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowStudentPickerModal(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition cursor-pointer flex items-center gap-1 border border-white/20"
                  title="Đổi sang tài khoản học sinh khác để thử nghiệm"
                >
                  <RotateCw className="w-3.5 h-3.5 text-amber-300" />
                  <span>Đổi HS Khác</span>
                </button>
                <button
                  type="button"
                  onClick={handleToggleMaintenance}
                  disabled={isTogglingMaintenance}
                  className={`px-3 py-1.5 rounded-xl font-black transition cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95 ${
                    isMaintenanceLocked
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 text-slate-950 border-2 border-emerald-300 ring-2 ring-emerald-400/50 animate-pulse'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 border border-amber-300'
                  }`}
                  title={
                    isMaintenanceLocked
                      ? 'Website đang KHÓA NÂNG CẤP. Nhấn để MỞ LẠI cho toàn quốc.'
                      : 'Nhấn để KHÓA WEBSITE TẠM DỪNG NÂNG CẤP (chỉ Admin xem được).'
                  }
                >
                  {isMaintenanceLocked ? (
                    <>
                      <Unlock className="w-3.5 h-3.5 text-slate-950 animate-spin" />
                      <span>🔓 MỞ KHÓA WEB</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-slate-950" />
                      <span>🔒 Khóa Web Nâng Cấp</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleExitStudentTest}
                  className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-200 hover:text-white font-bold transition cursor-pointer flex items-center gap-1 border border-rose-400/30"
                  title="Thoát thử nghiệm học sinh"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Thoát Thử Nghiệm</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onNavigateTab('admin')}
                  className={`px-3 py-1.5 rounded-xl font-black transition cursor-pointer flex items-center gap-1.5 shadow-xs ${
                    currentTab === 'admin'
                      ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                  title="Mở Sổ điểm 390 học sinh và Quản trị toàn hệ thống"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-amber-300" />
                  <span>📋 Sổ Điểm (390 HS)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateTab('teachers')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1 ${
                    currentTab === 'teachers'
                      ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
                  title="Kho ứng dụng và công cụ tạo đề kiểm tra chuẩn Bộ GD&ĐT"
                >
                  <Layers className="w-3.5 h-3.5 text-blue-300" />
                  <span>📝 Kho Đề BGD</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowStudentPickerModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                  title="Đăng nhập thử nghiệm dưới quyền một học sinh bất kỳ để trải nghiệm thực tế"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-300" />
                  <span>🧪 Thử Nghiệm HS</span>
                </button>

                {/* NÚT KHÓA / MỞ KHÓA WEBSITE ĐỂ NÂNG CẤP */}
                <button
                  type="button"
                  onClick={handleToggleMaintenance}
                  disabled={isTogglingMaintenance}
                  className={`px-3 py-1.5 rounded-xl font-black transition cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95 ${
                    isMaintenanceLocked
                      ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 text-slate-950 border-2 border-emerald-300 ring-2 ring-emerald-400/50 animate-pulse'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 border border-amber-300'
                  }`}
                  title={
                    isMaintenanceLocked
                      ? 'Website đang KHÓA NÂNG CẤP. Nhấn để MỞ LẠI cho toàn quốc.'
                      : 'Nhấn để KHÓA WEBSITE TẠM DỪNG NÂNG CẤP (chỉ Admin xem được).'
                  }
                >
                  {isMaintenanceLocked ? (
                    <>
                      <Unlock className="w-3.5 h-3.5 text-slate-950 animate-spin" />
                      <span>🔓 MỞ KHÓA WEB</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-slate-950" />
                      <span>🔒 Khóa Web Để Nâng Cấp</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onAdminLogout}
                  className="p-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-200 hover:text-white transition cursor-pointer border border-rose-400/30"
                  title="Đăng xuất quyền Admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>

        </div>
      </div>

      {/* ==================== MODAL CHỌN HỌC SINH ĐỂ THỬ NGHIỆM TÍNH NĂNG ==================== */}
      {showStudentPickerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col space-y-4">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-lg">
                  🧪
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Chọn Học Sinh Để Thử Nghiệm Tính Năng
                  </h3>
                  <p className="text-xs text-slate-500">
                    Thầy sẽ trải nghiệm giao diện đúng 100% như em học sinh đó nhìn thấy
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowStudentPickerModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bộ chọn Lớp (10 lớp chính thức) */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                Chọn Lớp (Khối 6 & Khối 8):
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {officialClasses.map(cls => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setSelectedClass(cls)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      selectedClass === cls
                        ? 'bg-emerald-600 text-white font-black shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    Lớp {cls}
                  </button>
                ))}
              </div>
            </div>

            {/* Tìm kiếm học sinh */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Tìm học sinh trong Lớp ${selectedClass} (Tên hoặc SBD)...`}
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
            </div>

            {/* Danh sách học sinh trong lớp */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-64">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  Không tìm thấy học sinh nào trong Lớp {selectedClass} phù hợp.
                </div>
              ) : (
                filteredStudents.map(stu => (
                  <button
                    key={stu.id}
                    type="button"
                    onClick={() => handleSelectStudentToTest(stu)}
                    className="w-full p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-300 dark:hover:border-emerald-700 transition flex items-center justify-between gap-2 text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold flex items-center justify-center">
                        {stu.stt || '•'}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                          {stu.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          SBD: {stu.studentCode} • Ngày sinh: {stu.dob || 'Chưa cập nhật'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 group-hover:text-emerald-600 font-bold shrink-0">
                      <span>Vào thử nghiệm</span>
                      <span>→</span>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Footer Modal */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Tổng số: {filteredStudents.length} học sinh</span>
              <button
                type="button"
                onClick={() => setShowStudentPickerModal(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold transition cursor-pointer"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
