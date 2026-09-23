import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface LicenseRecord {
  id?: number | string;
  machine_id: string;
  teacher_name: string;
  phone_zalo: string;
  school_unit: string;
  package_type: '1YEAR' | '2YEAR' | 'LIFETIME' | 'TRIAL';
  status: 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'REVOKED';
  expiry_timestamp: number;
  activated_at?: string;
  activated_by?: string; // 'Thầy Đinh Văn Thành' hoặc 'Mai Tình'
  last_online_at?: string;
  ip_address?: string;
  notes?: string;
}

const STORAGE_KEY_LICENSES = 'gvai_cloud_licenses_v2';
const STORAGE_KEY_CONFIG = 'gvai_supabase_config_v2';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

// Khởi tạo dữ liệu mẫu ban đầu nếu chưa có
const INITIAL_LICENSES: LicenseRecord[] = [
  {
    id: 1,
    machine_id: 'MB-E10D-BE85',
    teacher_name: 'Cô Nguyễn Thị Mai',
    phone_zalo: '0988.123456',
    school_unit: 'THCS Lê Quý Đôn',
    package_type: 'LIFETIME',
    status: 'ACTIVE',
    expiry_timestamp: 9999999999,
    activated_at: '2026-09-20 10:30:00',
    notes: 'Kích hoạt trọn đời - Đã thanh toán',
    activated_by: 'Thầy Đinh Văn Thành'
  },
  {
    id: 2,
    machine_id: 'MB-8F22-A109',
    teacher_name: 'Thầy Trần Văn Tuấn',
    phone_zalo: '0977.654321',
    school_unit: 'THPT Chu Văn An',
    package_type: '1YEAR',
    status: 'PENDING',
    expiry_timestamp: Math.floor(Date.now() / 1000) + 365 * 86400,
    activated_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    notes: 'Đăng ký online qua Web - Chờ xác nhận bill Zalo'
  }
];

class LicenseService {
  private supabase: SupabaseClient | null = null;

  constructor() {
    this.initSupabaseFromStorage();
  }

  public getSavedConfig(): SupabaseConfig {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }
    return { url: '', anonKey: '' };
  }

  public saveConfig(config: SupabaseConfig): boolean {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
      this.initSupabaseFromStorage();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  private initSupabaseFromStorage() {
    const cfg = this.getSavedConfig();
    if (cfg.url && cfg.anonKey) {
      try {
        this.supabase = createClient(cfg.url, cfg.anonKey);
      } catch (e) {
        console.error('Không thể khởi tạo Supabase:', e);
        this.supabase = null;
      }
    } else {
      this.supabase = null;
    }
  }

  private getLocalLicenses(): LicenseRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_LICENSES);
      if (data) {
        return JSON.parse(data);
      }
      localStorage.setItem(STORAGE_KEY_LICENSES, JSON.stringify(INITIAL_LICENSES));
      return INITIAL_LICENSES;
    } catch (e) {
      return INITIAL_LICENSES;
    }
  }

  private setLocalLicenses(licenses: LicenseRecord[]) {
    try {
      localStorage.setItem(STORAGE_KEY_LICENSES, JSON.stringify(licenses));
    } catch (e) {
      console.error(e);
    }
  }

  // Lấy toàn bộ danh sách bản quyền
  public async getLicenses(): Promise<LicenseRecord[]> {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('licenses')
          .select('*')
          .order('id', { ascending: false });
        if (!error && data) {
          this.setLocalLicenses(data);
          return data;
        }
      } catch (e) {
        console.warn('Lỗi kết nối Supabase, chuyển sang chế độ Local Cache:', e);
      }
    }
    return this.getLocalLicenses();
  }

  // Đăng ký mới từ phía khách hàng (Giáo viên)
  public async register(payload: {
    machine_id: string;
    teacher_name: string;
    phone_zalo: string;
    school_unit: string;
    package_type: '1YEAR' | '2YEAR' | 'LIFETIME';
  }): Promise<{ success: boolean; message: string }> {
    const mid = payload.machine_id.trim().toUpperCase();
    const nowTs = Math.floor(Date.now() / 1000);
    const expTs = payload.package_type === 'LIFETIME' 
      ? 9999999999 
      : nowTs + (payload.package_type === '2YEAR' ? 730 : 365) * 86400;

    const newRecord: LicenseRecord = {
      machine_id: mid,
      teacher_name: payload.teacher_name.trim(),
      phone_zalo: payload.phone_zalo.trim(),
      school_unit: payload.school_unit.trim(),
      package_type: payload.package_type,
      status: 'PENDING',
      expiry_timestamp: expTs,
      activated_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      notes: `Đăng ký Online lúc ${new Date().toLocaleTimeString('vi-VN')} ${new Date().toLocaleDateString('vi-VN')}`
    };

    if (this.supabase) {
      try {
        const { error } = await this.supabase.from('licenses').upsert(newRecord, { onConflict: 'machine_id' });
        if (!error) {
          return { success: true, message: 'Đăng ký thành công! Dữ liệu đã chuyển đến Thầy Thành.' };
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Fallback Local Storage
    const list = this.getLocalLicenses();
    const existingIdx = list.findIndex(item => item.machine_id === mid);
    if (existingIdx >= 0) {
      list[existingIdx] = { ...list[existingIdx], ...newRecord };
    } else {
      newRecord.id = Date.now();
      list.unshift(newRecord);
    }
    this.setLocalLicenses(list);
    return { success: true, message: 'Đã gửi thông tin đăng ký lên hệ thống thành công!' };
  }

  // Admin bấm Duyệt ngay (1-Click)
  public async approve(machine_id: string, activated_by: string = 'Thầy Đinh Văn Thành'): Promise<boolean> {
    const mid = machine_id.trim().toUpperCase();
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (this.supabase) {
      try {
        await this.supabase
          .from('licenses')
          .update({ 
            status: 'ACTIVE', 
            activated_at: now, 
            activated_by: activated_by,
            notes: `Kích hoạt thành công bởi ${activated_by}` 
          })
          .eq('machine_id', mid);
      } catch (e) {
        console.error(e);
      }
    }

    const list = this.getLocalLicenses();
    const idx = list.findIndex(x => x.machine_id === mid);
    if (idx >= 0) {
      list[idx].status = 'ACTIVE';
      list[idx].activated_at = now;
      list[idx].activated_by = activated_by;
      list[idx].notes = `Kích hoạt thành công bởi ${activated_by}`;
      this.setLocalLicenses(list);
      return true;
    }
    return false;
  }

  // Admin Gia hạn
  public async extend(machine_id: string, packageType: '1YEAR' | '2YEAR' | 'LIFETIME', activated_by: string = 'Thầy Đinh Văn Thành'): Promise<boolean> {
    const mid = machine_id.trim().toUpperCase();
    const nowTs = Math.floor(Date.now() / 1000);
    const expTs = packageType === 'LIFETIME' ? 9999999999 : nowTs + (packageType === '2YEAR' ? 730 : 365) * 86400;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const pkgLabel = packageType === '1YEAR' ? '1 Năm (200k)' : packageType === '2YEAR' ? '2 Năm (300k)' : 'Trọn Đời';

    if (this.supabase) {
      try {
        await this.supabase
          .from('licenses')
          .update({ 
            package_type: packageType,
            status: 'ACTIVE', 
            expiry_timestamp: expTs,
            activated_at: now,
            activated_by: activated_by,
            notes: `Gia hạn gói ${pkgLabel} bởi ${activated_by}` 
          })
          .eq('machine_id', mid);
      } catch (e) {
        console.error(e);
      }
    }

    const list = this.getLocalLicenses();
    const idx = list.findIndex(x => x.machine_id === mid);
    if (idx >= 0) {
      list[idx].package_type = packageType;
      list[idx].status = 'ACTIVE';
      list[idx].expiry_timestamp = expTs;
      list[idx].activated_at = now;
      list[idx].activated_by = activated_by;
      list[idx].notes = `Gia hạn gói ${pkgLabel} bởi ${activated_by}`;
      this.setLocalLicenses(list);
      return true;
    }
    return false;
  }

  // Admin Khóa / Thu hồi bản quyền
  public async revoke(machine_id: string): Promise<boolean> {
    const mid = machine_id.trim().toUpperCase();

    if (this.supabase) {
      try {
        await this.supabase
          .from('licenses')
          .update({ status: 'REVOKED', notes: 'Bị khóa bởi Thầy Thành' })
          .eq('machine_id', mid);
      } catch (e) {
        console.error(e);
      }
    }

    const list = this.getLocalLicenses();
    const idx = list.findIndex(x => x.machine_id === mid);
    if (idx >= 0) {
      list[idx].status = 'REVOKED';
      list[idx].notes = 'Bị khóa bởi Thầy Thành';
      this.setLocalLicenses(list);
      return true;
    }
    return false;
  }

  // Xóa bản ghi
  public async deleteLicense(machine_id: string): Promise<boolean> {
    const mid = machine_id.trim().toUpperCase();

    if (this.supabase) {
      try {
        await this.supabase.from('licenses').delete().eq('machine_id', mid);
      } catch (e) {
        console.error(e);
      }
    }

    const list = this.getLocalLicenses();
    const filtered = list.filter(x => x.machine_id !== mid);
    this.setLocalLicenses(filtered);
    return true;
  }

  // Thầy Thành tự tạo bản quyền trực tiếp
  public async createDirect(record: LicenseRecord, activated_by: string = 'Thầy Đinh Văn Thành'): Promise<boolean> {
    record.machine_id = record.machine_id.trim().toUpperCase();
    record.status = 'ACTIVE';
    record.activated_at = new Date().toISOString().replace('T', ' ').substring(0, 19);
    record.activated_by = activated_by;
    if (!record.notes) {
      const pkgLabel = record.package_type === '1YEAR' ? '1 Năm (200.000đ)' : record.package_type === '2YEAR' ? '2 Năm (300.000đ)' : 'Trọn Đời';
      record.notes = `Kích hoạt gói ${pkgLabel} bởi ${activated_by}`;
    }

    if (this.supabase) {
      try {
        await this.supabase.from('licenses').upsert(record, { onConflict: 'machine_id' });
      } catch (e) {
        console.error(e);
      }
    }

    const list = this.getLocalLicenses();
    const idx = list.findIndex(x => x.machine_id === record.machine_id);
    if (idx >= 0) {
      list[idx] = record;
    } else {
      record.id = Date.now();
      list.unshift(record);
    }
    this.setLocalLicenses(list);
    return true;
  }

  // Giáo viên nhập mã máy để kích hoạt Pro trên Web
  public async checkOnlineLicense(machine_id: string): Promise<{
    isValid: boolean;
    record?: LicenseRecord;
    message: string;
  }> {
    const mid = machine_id.trim().toUpperCase();
    if (!mid) {
      return { isValid: false, message: 'Vui lòng nhập mã máy (ví dụ: MB-E10D-BE85).' };
    }

    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('licenses')
          .select('*')
          .eq('machine_id', mid)
          .single();
        if (!error && data) {
          if (data.status === 'ACTIVE') {
            return { 
              isValid: true, 
              record: data, 
              message: `Xác thực thành công! Mở khóa bản quyền Pro gói ${data.package_type === 'LIFETIME' ? 'Trọn Đời' : data.package_type} cho ${data.teacher_name || 'Thầy/Cô'}.` 
            };
          } else if (data.status === 'PENDING') {
            return { isValid: false, record: data, message: 'Mã máy đang trong hàng chờ Thầy Thành duyệt thanh toán.' };
          } else if (data.status === 'REVOKED') {
            return { isValid: false, record: data, message: 'Mã máy này đã bị thu hồi hoặc khóa bản quyền.' };
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Fallback Local Storage
    const list = this.getLocalLicenses();
    const item = list.find(x => x.machine_id === mid);
    if (item) {
      if (item.status === 'ACTIVE') {
        return { 
          isValid: true, 
          record: item, 
          message: `Xác thực thành công! Mở khóa bản quyền Pro gói ${item.package_type === 'LIFETIME' ? 'Trọn Đời' : item.package_type} cho ${item.teacher_name || 'Thầy/Cô'}.` 
        };
      } else if (item.status === 'PENDING') {
        return { isValid: false, record: item, message: 'Mã máy đang trong hàng chờ Thầy Thành duyệt thanh toán.' };
      } else {
        return { isValid: false, record: item, message: 'Mã máy này đã bị khóa hoặc hết hạn.' };
      }
    }

    return { isValid: false, message: 'Không tìm thấy mã máy này trên hệ thống. Thầy/Cô vui lòng gửi đăng ký trước.' };
  }
}

export const licenseService = new LicenseService();
