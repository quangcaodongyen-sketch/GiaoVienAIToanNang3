/**
 * Dịch vụ Quản lý Hồ sơ Giáo án, Phụ lục & Lưu trữ Tài Liệu Sư Phạm trên Web
 * Tác giả: Đinh Thành - ĐT: 0915.213717
 * dekiemtraso.com
 */

export interface StorageFolder {
  id: string;
  name: string;
  category: 'giao_an' | 'phu_luc' | 'de_thi' | 'bao_cao' | 'tai_lieu_chung';
  createdAt: string;
  updatedAt: string;
  isSystemDefault?: boolean;
}

export interface StorageFileItem {
  id: string;
  folderId: string;
  name: string;
  size: number; // bytes
  fileType: string; // 'docx' | 'pdf' | 'xlsx' | 'pptx' | 'zip' | 'other'
  mimeType: string;
  uploadedAt: string;
  downloadUrl?: string;
  dataBase64?: string; // Lưu trữ nội dung tệp trực tiếp trong Local Cache
  description?: string;
  uploader?: string;
}

const STORAGE_KEY_FOLDERS = 'gvai_admin_folders_v1';
const STORAGE_KEY_FILES = 'gvai_admin_files_v1';

// Các thư mục sư phạm mặc định ban đầu
const DEFAULT_FOLDERS: StorageFolder[] = [
  {
    id: 'folder-giao-an-5512',
    name: 'Kế hoạch bài dạy (Giáo án CV 5512)',
    category: 'giao_an',
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-01T08:00:00Z',
    isSystemDefault: true
  },
  {
    id: 'folder-phu-luc-day-hoc',
    name: 'Phụ lục Kế hoạch dạy học môn học (PL 1, 2, 3)',
    category: 'phu_luc',
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-01T08:00:00Z',
    isSystemDefault: true
  },
  {
    id: 'folder-de-kiem-tra-ma-tran',
    name: 'Bộ Đề kiểm tra, Ma trận & Bản đặc tả',
    category: 'de_thi',
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-01T08:00:00Z',
    isSystemDefault: true
  },
  {
    id: 'folder-bao-cao-skkn',
    name: 'Báo cáo Chuyên môn, Biên bản & SKKN',
    category: 'bao_cao',
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-01T08:00:00Z',
    isSystemDefault: true
  },
  {
    id: 'folder-nang-luc-so-stem',
    name: 'Tài liệu Năng lực số, STEM & Bài giảng Điện tử',
    category: 'tai_lieu_chung',
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-01T08:00:00Z',
    isSystemDefault: true
  }
];

// Một số tệp mẫu sẵn có của Thầy Thành để tra cứu ngay
const DEFAULT_FILES: StorageFileItem[] = [
  {
    id: 'file-demo-1',
    folderId: 'folder-de-kiem-tra-ma-tran',
    name: 'De_Kiem_Tra_Tieng_Anh_6_Global_Success_CV7991.doc',
    size: 6072,
    fileType: 'doc',
    mimeType: 'application/msword',
    uploadedAt: '2026-09-10T10:00:00Z',
    downloadUrl: '/De_Kiem_Tra_Tieng_Anh_6_Global_Success_CV7991.doc',
    description: 'Đề kiểm tra Tiếng Anh 6 chuẩn CV 7991 có Ma trận & Bản đặc tả',
    uploader: 'Thầy Đinh Thành'
  },
  {
    id: 'file-demo-2',
    folderId: 'folder-giao-an-5512',
    name: 'HUONG_DAN_TAO_DE_THCS_8_MON.docx',
    size: 25236,
    fileType: 'docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadedAt: '2026-09-15T14:30:00Z',
    downloadUrl: '/HUONG_DAN_TAO_DE_THCS_8_MON.docx',
    description: 'Tài liệu hướng dẫn tạo đề 8 môn THCS chuẩn CV 7991',
    uploader: 'Thầy Đinh Thành'
  },
  {
    id: 'file-demo-3',
    folderId: 'folder-giao-an-5512',
    name: 'HUONG_DAN_SU_DUNG.docx',
    size: 38677,
    fileType: 'docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadedAt: '2026-09-20T09:15:00Z',
    downloadUrl: '/HUONG_DAN_SU_DUNG.docx',
    description: 'Tài liệu hướng dẫn sử dụng hệ thống phần mềm giáo viên',
    uploader: 'Thầy Đinh Thành'
  }
];

class DocumentStorageService {
  private folders: StorageFolder[] = [];
  private files: StorageFileItem[] = [];

  constructor() {
    this.loadData();
  }

  private loadData() {
    try {
      const savedFolders = localStorage.getItem(STORAGE_KEY_FOLDERS);
      if (savedFolders) {
        this.folders = JSON.parse(savedFolders);
      } else {
        this.folders = [...DEFAULT_FOLDERS];
        this.saveFolders();
      }

      const savedFiles = localStorage.getItem(STORAGE_KEY_FILES);
      if (savedFiles) {
        this.files = JSON.parse(savedFiles);
      } else {
        this.files = [...DEFAULT_FILES];
        this.saveFiles();
      }
    } catch (e) {
      console.warn('Lỗi đọc dữ liệu lưu trữ hồ sơ:', e);
      this.folders = [...DEFAULT_FOLDERS];
      this.files = [...DEFAULT_FILES];
    }
  }

  private saveFolders() {
    try {
      localStorage.setItem(STORAGE_KEY_FOLDERS, JSON.stringify(this.folders));
    } catch (e) {
      console.error('Không thể lưu danh mục thư mục:', e);
    }
  }

  private saveFiles() {
    try {
      localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(this.files));
    } catch (e) {
      console.error('Không thể lưu danh sách tệp tin:', e);
    }
  }

  // Lấy danh sách thư mục
  public getFolders(): StorageFolder[] {
    return [...this.folders];
  }

  // Thêm thư mục mới ngay trên web
  public createFolder(name: string, category: StorageFolder['category'] = 'tai_lieu_chung'): StorageFolder {
    const trimmed = name.trim();
    if (!trimmed) {
      throw new Error('Tên thư mục không được để trống');
    }

    const newFolder: StorageFolder = {
      id: `folder-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: trimmed,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSystemDefault: false
    };

    this.folders.unshift(newFolder);
    this.saveFolders();
    return newFolder;
  }

  // Đổi tên thư mục ngay trên web
  public renameFolder(folderId: string, newName: string): boolean {
    const trimmed = newName.trim();
    if (!trimmed) return false;

    const folder = this.folders.find(f => f.id === folderId);
    if (!folder) return false;

    folder.name = trimmed;
    folder.updatedAt = new Date().toISOString();
    this.saveFolders();
    return true;
  }

  // Xóa thư mục và các tệp trong đó
  public deleteFolder(folderId: string): boolean {
    const index = this.folders.findIndex(f => f.id === folderId);
    if (index === -1) return false;

    // Xóa thư mục
    this.folders.splice(index, 1);
    this.saveFolders();

    // Xóa các file thuộc thư mục này
    this.files = this.files.filter(file => file.folderId !== folderId);
    this.saveFiles();
    return true;
  }

  // Lấy danh sách tệp theo thư mục (hoặc tất cả nếu không truyền folderId)
  public getFiles(folderId?: string): StorageFileItem[] {
    if (!folderId || folderId === 'all') {
      return [...this.files];
    }
    return this.files.filter(f => f.folderId === folderId);
  }

  // Tải lên tệp tin mới (hỗ trợ .docx, .doc, .pdf, .pptx, .xlsx, .zip...)
  public async uploadFile(
    folderId: string,
    file: File,
    description: string = '',
    uploader: string = 'Admin Thầy Thành'
  ): Promise<StorageFileItem> {
    // Đọc file thành base64 để lưu cache và tải về sau
    const dataBase64 = await this.readFileAsDataURL(file);
    const ext = file.name.split('.').pop()?.toLowerCase() || 'other';

    const newFile: StorageFileItem = {
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      folderId,
      name: file.name,
      size: file.size,
      fileType: ext,
      mimeType: file.type || 'application/octet-stream',
      uploadedAt: new Date().toISOString(),
      dataBase64,
      downloadUrl: dataBase64,
      description: description.trim() || `Tài liệu tải lên ngày ${new Date().toLocaleDateString('vi-VN')}`,
      uploader
    };

    this.files.unshift(newFile);
    this.saveFiles();
    return newFile;
  }

  // Tải file về máy tính của người dùng
  public downloadFile(file: StorageFileItem) {
    const url = file.downloadUrl || file.dataBase64;
    if (!url) {
      alert('Không tìm thấy đường dẫn tệp để tải về!');
      return;
    }

    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Xóa tệp tin
  public deleteFile(fileId: string): boolean {
    const index = this.files.findIndex(f => f.id === fileId);
    if (index === -1) return false;

    this.files.splice(index, 1);
    this.saveFiles();
    return true;
  }

  // Thống kê dung lượng đã dùng
  public getStorageStats() {
    let totalBytes = 0;
    this.files.forEach(f => {
      totalBytes += f.size || 0;
    });

    const maxFreeBytes = 1024 * 1024 * 1024; // 1 GB Supabase Free Tier = 1,073,741,824 bytes
    const usedMB = (totalBytes / (1024 * 1024)).toFixed(2);
    const percentUsed = Math.min(100, (totalBytes / maxFreeBytes) * 100).toFixed(2);

    return {
      totalFiles: this.files.length,
      totalFolders: this.folders.length,
      usedBytes: totalBytes,
      usedMB,
      percentUsed,
      freeCapacityText: '1 GB (Supabase Storage Cloud)'
    };
  }

  private readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
}

export const documentStorageService = new DocumentStorageService();
