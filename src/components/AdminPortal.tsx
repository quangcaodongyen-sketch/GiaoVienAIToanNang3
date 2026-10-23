import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Folder, 
  FolderPlus, 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Edit3, 
  Search, 
  CheckCircle2, 
  Clock, 
  Key, 
  Lock, 
  Unlock, 
  Copy, 
  Plus, 
  RefreshCw, 
  ShieldCheck, 
  HardDrive, 
  Layers, 
  Phone, 
  X,
  FileCheck,
  Eye,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import { BRAND } from '../config/brand';
import { licenseService, LicenseRecord } from '../services/licenseService';
import { documentStorageService, StorageFolder, StorageFileItem } from '../services/documentStorageService';
import { systemMaintenanceService } from '../services/systemMaintenanceService';
import { generateEd25519Key } from '../services/nlsKeyService';
import { AdminStudentGradebook } from './AdminStudentGradebook';
import { GraduationCap } from 'lucide-react';

interface AdminPortalProps {
  onBackToHome?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToHome }) => {
  // Quản lý Đăng Nhập Admin (Tên: Admin, Mật khẩu chuẩn Thầy Thành: Thaythanh2026@)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('gvai_admin_logged_in') === 'true';
  });
  const [userInput, setUserInput] = useState('Admin');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Tab Chính Trong Admin: 'licenses' | 'documents' | 'system'
  const [adminTab, setAdminTab] = useState<'licenses' | 'documents' | 'students' | 'system'>('students');

  // ==================== STATE QUẢN LÝ TÀI KHOẢN PRO ====================
  const [licenses, setLicenses] = useState<LicenseRecord[]>([]);
  const [searchLicense, setSearchLicense] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING' | 'EXPIRED'>('ALL');
  const [isLoadingLicenses, setIsLoadingLicenses] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal Sinh Key Nhanh
  const [showQuickKeyModal, setShowQuickKeyModal] = useState(false);
  const [quickMachineId, setQuickMachineId] = useState('');
  const [quickTeacherName, setQuickTeacherName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [quickAppCode, setQuickAppCode] = useState('NLS');
  const [generatedKey, setGeneratedKey] = useState('');

  // ==================== STATE QUẢN LÝ HỒ SƠ GIÁO ÁN ====================
  const [folders, setFolders] = useState<StorageFolder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  const [files, setFiles] = useState<StorageFileItem[]>([]);
  const [searchFile, setSearchFile] = useState('');
  const [storageStats, setStorageStats] = useState(documentStorageService.getStorageStats());

  // Modal Thêm Thư Mục Mới
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Modal Đổi Tên Thư Mục
  const [editingFolder, setEditingFolder] = useState<StorageFolder | null>(null);
  const [editFolderName, setEditFolderName] = useState('');

  // State Khóa Web
  const [isMaintenanceLocked, setIsMaintenanceLocked] = useState<boolean>(() => systemMaintenanceService.isMaintenanceLocked());

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Đăng nhập Admin
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (systemMaintenanceService.verifyAdminCredentials(userInput, pinInput) || systemMaintenanceService.verifyAdminPassword(pinInput)) {
      setIsAuthenticated(true);
      sessionStorage.setItem('gvai_admin_logged_in', 'true');
      systemMaintenanceService.saveAdminSession();
      setPinError(false);
      showToast('Đăng nhập Quản trị viên thành công!');
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('gvai_admin_logged_in');
  };

  // Tải danh sách bản quyền
  const reloadLicenses = async () => {
    setIsLoadingLicenses(true);
    try {
      const data = await licenseService.getLicenses();
      setLicenses(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingLicenses(false);
    }
  };

  // Tải danh sách thư mục & file
  const reloadStorageData = () => {
    const fList = documentStorageService.getFolders();
    setFolders(fList);
    const fFiles = documentStorageService.getFiles(selectedFolderId === 'all' ? undefined : selectedFolderId);
    setFiles(fFiles);
    setStorageStats(documentStorageService.getStorageStats());
  };

  useEffect(() => {
    if (isAuthenticated) {
      reloadLicenses();
      reloadStorageData();
    }
  }, [isAuthenticated, selectedFolderId]);

  // Thêm thư mục mới
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      alert('Vui lòng nhập tên thư mục!');
      return;
    }
    documentStorageService.createFolder(newFolderName.trim());
    setNewFolderName('');
    setShowAddFolderModal(false);
    reloadStorageData();
    showToast('Đã thêm thư mục mới thành công!');
  };

  // Đổi tên thư mục
  const handleRenameFolder = () => {
    if (!editingFolder || !editFolderName.trim()) return;
    documentStorageService.renameFolder(editingFolder.id, editFolderName.trim());
    setEditingFolder(null);
    setEditFolderName('');
    reloadStorageData();
    showToast('Đã cập nhật tên thư mục!');
  };

  // Xóa thư mục
  const handleDeleteFolder = (folder: StorageFolder) => {
    if (window.confirm(`Thầy có chắc chắn muốn xóa thư mục "${folder.name}" và toàn bộ tệp bên trong?`)) {
      documentStorageService.deleteFolder(folder.id);
      if (selectedFolderId === folder.id) {
        setSelectedFolderId('all');
      }
      reloadStorageData();
      showToast('Đã xóa thư mục!');
    }
  };

  // Upload file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    const targetFolderId = selectedFolderId === 'all' ? (folders[0]?.id || 'folder-default') : selectedFolderId;

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      await documentStorageService.uploadFile(targetFolderId, file, '', 'Admin Thầy Thành');
    }

    reloadStorageData();
    showToast(`Đã tải lên ${uploadedFiles.length} tệp thành công!`);
    e.target.value = '';
  };

  // Xóa file
  const handleDeleteFile = (file: StorageFileItem) => {
    if (window.confirm(`Thầy có chắc muốn xóa tệp "${file.name}"?`)) {
      documentStorageService.deleteFile(file.id);
      reloadStorageData();
      showToast('Đã xóa tệp tin!');
    }
  };

  // Sinh key nhanh cho khách
  const handleQuickGenKey = async () => {
    if (!quickMachineId.trim()) {
      alert('Vui lòng nhập Mã máy (Hardware Code)!');
      return;
    }
    // Sinh key Ed25519 trọn đời (99 năm)
    const keyData = await generateEd25519Key(quickMachineId.trim(), 99, quickAppCode);
    setGeneratedKey(keyData.key);

    // Lưu vào hệ thống bản quyền
    await licenseService.createDirect({
      machine_id: quickMachineId.trim(),
      teacher_name: quickTeacherName.trim() || 'Giáo viên',
      phone_zalo: quickPhone.trim() || 'Chưa cập nhật',
      school_unit: 'Trường học',
      package_type: 'LIFETIME',
      status: 'ACTIVE',
      expiry_timestamp: Date.now() + 100 * 365 * 24 * 3600 * 1000,
      activated_by: 'Tác giả Đinh Thành'
    });
    reloadLicenses();

    showToast('Đã sinh key bản quyền Pro thành công!');
  };

  // Lọc danh sách bản quyền
  const filteredLicenses = licenses.filter(lic => {
    const matchStatus = statusFilter === 'ALL' || lic.status === statusFilter;
    const matchSearch = searchLicense.trim() === '' ||
      lic.machine_id.toLowerCase().includes(searchLicense.toLowerCase()) ||
      lic.teacher_name.toLowerCase().includes(searchLicense.toLowerCase()) ||
      lic.phone_zalo.includes(searchLicense);
    return matchStatus && matchSearch;
  });

  // Lọc danh sách file
  const filteredFiles = files.filter(f => {
    return searchFile.trim() === '' || f.name.toLowerCase().includes(searchFile.toLowerCase());
  });

  // ==================== MÀN HÌNH ĐĂNG NHẬP ADMIN ====================
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-300">
            <Crown className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-center text-slate-900 dark:text-white mb-1">
            BẢNG QUẢN TRỊ ADMIN
          </h2>
          <p className="text-xs text-slate-500 text-center mb-6">
            Dành riêng cho Tác giả Thầy Đinh Thành ({BRAND.phone})
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tên đăng nhập Admin:
              </label>
              <input
                type="text"
                required
                placeholder="Nhập tên đăng nhập (Admin)..."
                value={userInput}
                onChange={e => {
                  setUserInput(e.target.value);
                  setPinError(false);
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mật khẩu Quản trị:
              </label>
              <input
                type="password"
                required
                placeholder="Nhập mật khẩu..."
                value={pinInput}
                onChange={e => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white ${
                  pinError ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                }`}
              />
              {pinError && (
                <p className="text-xs text-red-500 font-semibold mt-1">
                  Tên đăng nhập hoặc mật khẩu chưa chính xác! Vui lòng thử lại.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-md transition cursor-pointer"
            >
              Đăng Nhập Quản Trị
            </button>

            {onBackToHome && (
              <button
                type="button"
                onClick={onBackToHome}
                className="w-full py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 transition"
              >
                ← Quay lại Kho Ứng Dụng
              </button>
            )}
          </form>
        </div>
      </div>
    );
  }

  // ==================== GIAO DIỆN QUẢN TRỊ ADMIN ====================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* TOAST THÔNG BÁO */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER QUẢN TRỊ TỐI GIẢN */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-300">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>HỆ THỐNG QUẢN TRỊ ADMIN - THẦY ĐINH THÀNH</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                PRO ACTIVE
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Quản lý tài khoản bản quyền Pro & Kho lưu trữ hồ sơ giáo án, phụ lục, báo cáo
            </p>
          </div>
        </div>

        {/* NÚT ĐIỀU HƯỚNG 3 TAB CHÍNH */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setAdminTab('students')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              adminTab === 'students'
                ? 'bg-indigo-600 text-white shadow-xs font-black'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
            <span>1. Sổ Điểm & Quản Lý Học Sinh</span>
          </button>

          <button
            onClick={() => setAdminTab('licenses')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              adminTab === 'licenses'
                ? 'bg-blue-600 text-white shadow-xs font-black'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>1. Quản lý Tài Khoản Pro ({licenses.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('documents')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              adminTab === 'documents'
                ? 'bg-blue-600 text-white shadow-xs font-black'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>2. Kho Giáo Án & Báo Cáo ({files.length} tệp)</span>
          </button>

          <button
            onClick={() => setAdminTab('system')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              adminTab === 'system'
                ? 'bg-blue-600 text-white shadow-xs font-black'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3. Cấu hình Hệ thống</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {/* ==================== MỤC 1: QUẢN LÝ TÀI KHOẢN PRO (DANH SÁCH BẢNG TỐI GIẢN) ==================== */}
      {adminTab === 'licenses' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 space-y-4">
          {/* Thanh Công Cụ & Tìm Kiếm */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm theo Mã máy, Tên giáo viên hoặc SĐT..."
                  value={searchLicense}
                  onChange={e => setSearchLicense(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="ACTIVE">Đã kích hoạt Pro</option>
                <option value="PENDING">Chờ duyệt</option>
                <option value="EXPIRED">Đã hết hạn</option>
              </select>

              <button
                onClick={() => {
                  setQuickMachineId('');
                  setGeneratedKey('');
                  setShowQuickKeyModal(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Cấp Key Nhanh 1-Click</span>
              </button>

              <button
                onClick={reloadLicenses}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-600 transition"
                title="Làm mới danh sách"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingLicenses ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* BẢNG DANH SÁCH TÀI KHOẢN TỐI GIẢN */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3 w-12 text-center">STT</th>
                  <th className="py-2.5 px-3">Mã Máy (Hardware ID)</th>
                  <th className="py-2.5 px-3">Giáo Viên / Trường</th>
                  <th className="py-2.5 px-3">Số ĐT / Zalo</th>
                  <th className="py-2.5 px-3">Gói Bản Quyền</th>
                  <th className="py-2.5 px-3">Trạng Thái</th>
                  <th className="py-2.5 px-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLicenses.length > 0 ? (
                  filteredLicenses.map((lic, idx) => (
                    <tr key={lic.machine_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="py-2.5 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {lic.machine_id}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                        {lic.teacher_name || 'Giáo viên'}
                        {lic.school_unit && <span className="block text-[11px] text-slate-400 font-normal">{lic.school_unit}</span>}
                      </td>
                      <td className="py-2.5 px-3 font-mono">
                        {lic.phone_zalo || '---'}
                      </td>
                      <td className="py-2.5 px-3 font-semibold">
                        {lic.package_type === 'LIFETIME' ? 'VIP Trọn Đời' : lic.package_type}
                      </td>
                      <td className="py-2.5 px-3">
                        {lic.status === 'ACTIVE' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[11px]">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Đã kích hoạt</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                            <Clock className="w-3 h-3" />
                            <span>{lic.status}</span>
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right space-x-1">
                        <button
                          onClick={async () => {
                            const res = await generateEd25519Key(lic.machine_id, 99);
                            navigator.clipboard.writeText(res.key);
                            showToast(`Đã sao chép key cho máy ${lic.machine_id}!`);
                          }}
                          className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold transition"
                          title="Sao chép Key Pro trọn đời"
                        >
                          Copy Key
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm(`Xóa bản quyền của máy ${lic.machine_id}?`)) {
                              await licenseService.deleteLicense(lic.machine_id);
                              reloadLicenses();
                              showToast('Đã xóa bản quyền thành công!');
                            }
                          }}
                          className="p-1 rounded-lg text-red-500 hover:bg-red-50 transition"
                          title="Xóa máy"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Chưa có tài khoản bản quyền nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== MỤC 2: KHO GIÁO ÁN & TÀI LIỆU (CÂY THƯ MỤC WEB) ==================== */}
      {adminTab === 'documents' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* CỘT TRÁI: CÂY THƯ MỤC TỰ THÊM / SỬA / XÓA */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <FolderOpen className="w-4 h-4 text-amber-500" />
                <span>Thư Mục Lưu Trữ</span>
              </h3>
              <button
                onClick={() => setShowAddFolderModal(true)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold shadow-2xs transition cursor-pointer"
                title="Tạo thêm thư mục mới"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm thư mục</span>
              </button>
            </div>

            {/* Danh sách Thư mục */}
            <div className="space-y-1">
              <button
                onClick={() => setSelectedFolderId('all')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                  selectedFolderId === 'all'
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Tất cả tài liệu</span>
                </span>
                <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                  {documentStorageService.getFiles().length}
                </span>
              </button>

              {folders.map(folder => {
                const count = documentStorageService.getFiles(folder.id).length;
                const isSelected = selectedFolderId === folder.id;
                return (
                  <div
                    key={folder.id}
                    className={`group rounded-xl transition flex items-center justify-between px-3 py-2 text-xs font-medium cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => setSelectedFolderId(folder.id)}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">{folder.name}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 rounded font-mono">
                        {count}
                      </span>
                      {/* Nút sửa/xóa thư mục */}
                      {!folder.isSystemDefault && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingFolder(folder);
                              setEditFolderName(folder.name);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-blue-600 transition"
                            title="Chỉnh sửa tên thư mục"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFolder(folder);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 transition"
                            title="Xóa thư mục"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* THANH BÁO DUNG LƯỢNG LƯU TRỮ MIỄN PHÍ */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-500 font-semibold flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Dung lượng đã dùng:</span>
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {storageStats.usedMB} MB / 1,024 MB
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(2, parseFloat(storageStats.percentUsed))}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 text-right">
                Gói miễn phí: {storageStats.freeCapacityText}
              </p>
            </div>
          </div>

          {/* CỘT PHẢI: BẢNG DANH SÁCH FILE TRONG THƯ MỤC */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm tài liệu giáo án..."
                  value={searchFile}
                  onChange={e => setSearchFile(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* NÚT TẢI FILE LÊN THƯ MỤC */}
              <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs transition cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Đưa Tài Liệu Lên Lưu Trữ</span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".docx,.doc,.dotm,.pdf,.xlsx,.pptx,.zip,.txt"
                />
              </label>
            </div>

            {/* BẢNG DANH SÁCH TỆP TIN */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">STT</th>
                    <th className="py-2.5 px-3">Tên Tệp Tin</th>
                    <th className="py-2.5 px-3">Định Dạng</th>
                    <th className="py-2.5 px-3">Dung Lượng</th>
                    <th className="py-2.5 px-3">Ngày Tải</th>
                    <th className="py-2.5 px-3 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredFiles.length > 0 ? (
                    filteredFiles.map((file, idx) => (
                      <tr key={file.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                        <td className="py-2.5 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                            <span className="truncate max-w-xs">{file.name}</span>
                          </div>
                          {file.description && (
                            <span className="block text-[10px] text-slate-400 pl-6">{file.description}</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-bold text-[10px]">
                            {file.fileType}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-300 font-semibold whitespace-nowrap">
                          {file.size >= 1024 * 1024
                            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                            : `${(file.size / 1024).toFixed(1)} KB`}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                          {new Date(file.uploadedAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="py-2.5 px-3 text-right space-x-1 whitespace-nowrap">
                          {file.downloadUrl && (
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(file.downloadUrl || '');
                                alert(`Đã sao chép link tải: ${file.name}

Thầy có thể dán (Ctrl+V) gửi ngay cho giáo viên qua Zalo.`);
                              }}
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition inline-flex items-center cursor-pointer"
                              title="Sao chép link tải trực tiếp gửi cho Giáo viên"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => documentStorageService.downloadFile(file)}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition inline-flex items-center cursor-pointer"
                            title="Tải tệp về máy tính"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          {!file.isOfficial && (
                            <button
                              onClick={() => handleDeleteFile(file)}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition inline-flex items-center cursor-pointer"
                              title="Xóa tệp tin"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Thư mục này hiện chưa có tài liệu nào. Thầy hãy bấm nút "Đưa Tài Liệu Lên Lưu Trữ" ở trên!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MỤC: QUẢN LÝ HỌC SINH & SỔ ĐIỂM ONLINE ==================== */}
      {adminTab === 'students' && (
        <AdminStudentGradebook />
      )}

      {/* ==================== MỤC 3: CẤU HÌNH HỆ THỐNG & BẢO TRÌ ==================== */}
      {adminTab === 'system' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs max-w-2xl space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">
              Khóa / Mở Website Giáo Viên AI
            </h3>
            <p className="text-xs text-slate-500">
              Khi bật khóa, toàn bộ khách truy cập bên ngoài sẽ thấy màn hình thông báo "Website đang tạm bảo trì nâng cấp". Chỉ riêng Admin đăng nhập mới xem được.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isMaintenanceLocked ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                {isMaintenanceLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Trạng thái hiện tại: {isMaintenanceLocked ? 'ĐANG KHÓA BẢO TRÌ' : 'ĐANG MỞ BÌNH THƯỜNG'}
                </p>
                <p className="text-xs text-slate-400">
                  {isMaintenanceLocked ? 'Giáo viên không thể vào web.' : 'Tất cả giáo viên toàn quốc truy cập được.'}
                </p>
              </div>
            </div>

            <button
              onClick={async () => {
                const nextState = !isMaintenanceLocked;
                await systemMaintenanceService.setMaintenanceLock(nextState, 'Thay đổi từ Admin Portal');
                setIsMaintenanceLocked(nextState);
                showToast(nextState ? 'Đã bật Khóa bảo trì web!' : 'Đã mở khóa web cho giáo viên!');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                isMaintenanceLocked
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
            >
              {isMaintenanceLocked ? 'Mở Khóa Web Ngay' : 'Khóa Nâng Cấp Web'}
            </button>
          </div>
        </div>
      )}

      {/* ==================== MODAL TẠO THƯ MỤC MỚI ==================== */}
      {showAddFolderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-blue-600" />
              <span>Thêm Thư Mục Lưu Trữ Mới</span>
            </h3>
            <input
              type="text"
              placeholder="Ví dụ: Giáo án 5512 Học kì 1..."
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowAddFolderModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateFolder}
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs"
              >
                Tạo thư mục
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL ĐỔI TÊN THƯ MỤC ==================== */}
      {editingFolder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-amber-500" />
              <span>Chỉnh Sửa Tên Thư Mục</span>
            </h3>
            <input
              type="text"
              value={editFolderName}
              onChange={e => setEditFolderName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingFolder(null)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                onClick={handleRenameFolder}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-xs"
              >
                Lưu tên mới
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL CẤP KEY NHANH 1-CLICK ==================== */}
      {showQuickKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-600" />
                <span>Cấp Key Bản Quyền Nhanh (Ed25519)</span>
              </h3>
              <button onClick={() => setShowQuickKeyModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Mã máy của giáo viên (Hardware Code)*
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: DVT-ENGCS-A1B2-C3D4"
                  value={quickMachineId}
                  onChange={e => setQuickMachineId(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Tên giáo viên
                  </label>
                  <input
                    type="text"
                    placeholder="Cô Nguyễn Thị Lan"
                    value={quickTeacherName}
                    onChange={e => setQuickTeacherName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Số Zalo
                  </label>
                  <input
                    type="text"
                    placeholder="0912345678"
                    value={quickPhone}
                    onChange={e => setQuickPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleQuickGenKey}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition cursor-pointer"
              >
                Sinh Key Pro Trọn Đời
              </button>

              {generatedKey && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-bold">
                    <span>Key Bản Quyền:</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedKey);
                        showToast('Đã sao chép Key!');
                      }}
                      className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px]"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="font-mono text-xs break-all text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2 rounded-lg border border-emerald-200">
                    {generatedKey}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
