import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  X, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Trash2, 
  Plus, 
  Search, 
  RefreshCw, 
  Settings, 
  Key, 
  Phone, 
  Building2, 
  UserCheck, 
  Calendar, 
  Check, 
  Lock, 
  Unlock,
  Cloud,
  AlertCircle
} from 'lucide-react';
import { licenseService, LicenseRecord, SupabaseConfig } from '../services/licenseService';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [licenses, setLicenses] = useState<LicenseRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState(false);

  // Modal tạo key mới
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMid, setNewMid] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newSchool, setNewSchool] = useState('');
  const [newPkg, setNewPkg] = useState<'1YEAR' | '2YEAR' | 'LIFETIME'>('LIFETIME');

  // Modal cấu hình Supabase
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [configSuccess, setConfigSuccess] = useState(false);

  // Mật khẩu Admin chính thức: Thaythanh2026@
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === 'Thaythanh2026@') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await licenseService.getLicenses();
      setLicenses(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadData();
      const cfg = licenseService.getSavedConfig();
      setSupabaseUrl(cfg.url);
      setSupabaseKey(cfg.anonKey);
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  // Màn hình Đăng nhập bảo mật
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 sm:p-8 text-white shadow-2xl relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-3 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 mx-auto flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-white">QUẢN TRỊ VIÊN BẢN QUYỀN</h3>
            <p className="text-xs text-slate-400">
              Hệ sinh thái AI Thầy Đinh Văn Thành – Xác thực quyền Admin
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mật khẩu Quản trị (PIN):
              </label>
              <input
                type="password"
                placeholder="Nhập mật khẩu Admin..."
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm font-mono"
                autoFocus
              />
              {pinError && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Mật khẩu không chính xác! Vui lòng kiểm tra lại.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              Mở Bảng Điều Khiển
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Lọc dữ liệu
  const filtered = licenses.filter(item => {
    const matchSearch = 
      item.machine_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.teacher_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone_zalo.includes(searchQuery);
    
    if (filterStatus === 'ALL') return matchSearch;
    return matchSearch && item.status === filterStatus;
  });

  // Thống kê
  const totalCount = licenses.length;
  const pendingCount = licenses.filter(x => x.status === 'PENDING').length;
  const activeCount = licenses.filter(x => x.status === 'ACTIVE').length;
  const revokedCount = licenses.filter(x => x.status === 'REVOKED').length;

  const handleApprove = async (mid: string) => {
    await licenseService.approve(mid);
    await loadData();
  };

  const handleExtend = async (mid: string, pkg: '1YEAR' | 'LIFETIME') => {
    await licenseService.extend(mid, pkg);
    await loadData();
  };

  const handleRevoke = async (mid: string) => {
    if (window.confirm(`Thầy có chắc chắn muốn KHÓA BẢN QUYỀN của máy ${mid} không?`)) {
      await licenseService.revoke(mid);
      await loadData();
    }
  };

  const handleDelete = async (mid: string) => {
    if (window.confirm(`Xóa bản ghi của máy ${mid}?`)) {
      await licenseService.deleteLicense(mid);
      await loadData();
    }
  };

  const handleCreateDirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMid.trim()) return;
    const nowTs = Math.floor(Date.now() / 1000);
    const expTs = newPkg === 'LIFETIME' ? 9999999999 : nowTs + 365 * 86400;

    await licenseService.createDirect({
      machine_id: newMid.trim().toUpperCase(),
      teacher_name: newName.trim() || 'Thầy/Cô',
      phone_zalo: newPhone.trim(),
      school_unit: newSchool.trim(),
      package_type: newPkg,
      status: 'ACTIVE',
      expiry_timestamp: expTs,
      notes: 'Admin tạo trực tiếp'
    });

    setNewMid('');
    setNewName('');
    setNewPhone('');
    setNewSchool('');
    setShowCreateModal(false);
    await loadData();
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    licenseService.saveConfig({ url: supabaseUrl.trim(), anonKey: supabaseKey.trim() });
    setConfigSuccess(true);
    setTimeout(() => {
      setConfigSuccess(false);
      setShowConfigModal(false);
      loadData();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-6xl w-full p-4 sm:p-6 text-white shadow-2xl my-auto max-h-[95vh] flex flex-col">
        {/* TOP HEADER */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  QUẢN TRỊ BẢN QUYỀN CLOUD 24/7
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold">
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Thầy giáo Đinh Văn Thành – Quản lý cấp phép & kích hoạt từ xa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfigModal(true)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Cấu hình Cloud Database"
            >
              <Cloud className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Kết nối Cloud</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 4 STATS CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-xs text-slate-400 font-medium block">Tổng thiết bị</span>
            <span className="text-2xl font-black text-white mt-1 block">{totalCount}</span>
          </div>
          <div className={`p-3.5 rounded-2xl border transition-all ${pendingCount > 0 ? 'bg-amber-500/15 border-amber-500/50 shadow-lg shadow-amber-500/10 animate-pulse' : 'bg-slate-800/80 border-slate-700/60'}`}>
            <span className="text-xs text-amber-400 font-bold block flex items-center gap-1">
              🔔 Chờ duyệt mới
            </span>
            <span className="text-2xl font-black text-amber-400 mt-1 block">{pendingCount}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-xs text-emerald-400 font-medium block">Đang hoạt động (Pro)</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">{activeCount}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
            <span className="text-xs text-rose-400 font-medium block">Bị khóa / Thu hồi</span>
            <span className="text-2xl font-black text-rose-400 mt-1 block">{revokedCount}</span>
          </div>
        </div>

        {/* CONTROLS BAR */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm mã máy, tên giáo viên, số điện thoại..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
              <button
                onClick={() => setFilterStatus('ALL')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${filterStatus === 'ALL' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilterStatus('PENDING')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${filterStatus === 'PENDING' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Chờ duyệt {pendingCount > 0 && `(${pendingCount})`}
              </button>
              <button
                onClick={() => setFilterStatus('ACTIVE')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${filterStatus === 'ACTIVE' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Pro
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              Tạo Key Trực Tiếp
            </button>
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Làm mới"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* CUSTOMER LICENSES TABLE */}
        <div className="flex-1 overflow-y-auto border border-slate-800 rounded-2xl bg-slate-950/50">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              Không tìm thấy thiết bị nào phù hợp.
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-800/90 backdrop-blur-md text-slate-300 font-semibold uppercase tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-3 px-3">Mã Thiết Bị</th>
                  <th className="py-3 px-3">Giáo Viên / Đơn Vị</th>
                  <th className="py-3 px-3">Số Zalo</th>
                  <th className="py-3 px-3">Gói Mua</th>
                  <th className="py-3 px-3">Trạng Thái</th>
                  <th className="py-3 px-3 text-right">Thao Tác Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filtered.map((item) => (
                  <tr key={item.machine_id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
                        {item.machine_id}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-white text-sm">{item.teacher_name || 'Chưa cập nhật'}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-500" />
                        {item.school_unit || 'Cá nhân'}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {item.phone_zalo ? (
                        <a
                          href={`https://zalo.me/${item.phone_zalo.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-400 hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          {item.phone_zalo}
                        </a>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-200">
                        {item.package_type === 'LIFETIME' ? '👑 Trọn Đời' : item.package_type === '2YEAR' ? '2 Năm' : '1 Năm'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {item.status === 'PENDING' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300">
                          <Clock className="w-3 h-3" /> Chờ Duyệt
                        </span>
                      )}
                      {item.status === 'ACTIVE' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" /> Bản Quyền Pro
                        </span>
                      )}
                      {item.status === 'REVOKED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/20 border border-rose-500/40 text-rose-400">
                          <ShieldAlert className="w-3 h-3" /> Đã Khóa
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.status === 'PENDING' ? (
                          <button
                            onClick={() => handleApprove(item.machine_id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Duyệt Ngay
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleExtend(item.machine_id, '1YEAR')}
                              className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px]"
                              title="Gia hạn +1 Năm"
                            >
                              +1 Năm
                            </button>
                            <button
                              onClick={() => handleExtend(item.machine_id, 'LIFETIME')}
                              className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-amber-400 text-[11px]"
                              title="Nâng cấp Vĩnh viễn"
                            >
                              Vĩnh Viễn
                            </button>
                            {item.status === 'ACTIVE' ? (
                              <button
                                onClick={() => handleRevoke(item.machine_id)}
                                className="p-1.5 rounded-md hover:bg-rose-950/40 text-rose-400"
                                title="Khóa máy này"
                              >
                                <Lock className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleApprove(item.machine_id)}
                                className="p-1.5 rounded-md hover:bg-emerald-950/40 text-emerald-400"
                                title="Mở khóa máy này"
                              >
                                <Unlock className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(item.machine_id)}
                          className="p-1.5 rounded-md hover:bg-slate-800 text-slate-500 hover:text-rose-400"
                          title="Xóa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* MODAL TẠO KEY TRỰC TIẾP */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                Cấp Bản Quyền Mới (Tạo Key Online)
              </h3>
              <form onSubmit={handleCreateDirect} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mã Máy Tính (Machine ID) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: MB-E10D-BE85"
                    value={newMid}
                    onChange={(e) => setNewMid(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tên Thầy/Cô</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Thầy Đinh Văn Thành"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Số Zalo</label>
                    <input
                      type="text"
                      placeholder="0915..."
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Gói Kích Hoạt</label>
                    <select
                      value={newPkg}
                      onChange={(e) => setNewPkg(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="LIFETIME">Trọn Đời (Vĩnh Viễn)</option>
                      <option value="1YEAR">1 Năm (365 ngày)</option>
                      <option value="2YEAR">2 Năm</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Trường / Đơn Vị</label>
                  <input
                    type="text"
                    placeholder="Trường THCS..."
                    value={newSchool}
                    onChange={(e) => setNewSchool(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md transition-colors"
                  >
                    Kích Hoạt Pro Ngay
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL CẤU HÌNH SUPABASE */}
        {showConfigModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
              <button 
                onClick={() => setShowConfigModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <Cloud className="w-6 h-6 text-sky-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Kết Nối Cơ Sở Dữ Liệu Cloud Supabase</h3>
                  <p className="text-[11px] text-slate-400">Đồng bộ đám mây quốc tế 24/7 – Không lo tắt máy tính</p>
                </div>
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Supabase Project URL</label>
                  <input
                    type="text"
                    placeholder="https://your-project.supabase.co"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Supabase Anon Public Key</label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-sky-400"
                  />
                </div>

                {configSuccess && (
                  <p className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Đã lưu cấu hình Cloud thành công!
                  </p>
                )}

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold shadow-md transition-colors"
                  >
                    Lưu & Kích Hoạt Cloud 24/7
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Đóng
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
