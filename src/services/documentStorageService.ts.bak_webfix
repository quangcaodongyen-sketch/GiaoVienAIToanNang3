/**
 * Dịch vụ Quản lý Hồ sơ Giáo án, Phụ lục & Lưu trữ Tài Liệu Sư Phạm trên Web
 * Tác giả: Đinh Thành - ĐT: 0915.213717
 * dekiemtraso.com
 */

export interface StorageFolder {
  id: string;
  name: string;
  category: 'giao_an' | 'phu_luc' | 'de_thi' | 'bao_cao' | 'tai_lieu_chung' | 'cai_dat_app';
  createdAt: string;
  updatedAt: string;
  isSystemDefault?: boolean;
}

export interface StorageFileItem {
  id: string;
  folderId: string;
  name: string;
  size: number; // bytes
  fileType: string; // 'exe' | 'zip' | 'dotm' | 'docx' | 'pdf' | 'xlsx' | 'pptx' | 'other'
  mimeType: string;
  uploadedAt: string;
  downloadUrl?: string;
  dataBase64?: string; // Lưu trữ trong IndexedDB
  description?: string;
  uploader?: string;
  isOfficial?: boolean;
}

const STORAGE_KEY_FOLDERS = 'gvai_admin_folders_v1';
const STORAGE_KEY_FILES = 'gvai_admin_files_v1';

// IndexedDB Helper để lưu file dung lượng lớn không bao giờ bị giới hạn 5MB của localStorage
const IDB_NAME = 'gvai_document_db_v1';
const IDB_VERSION = 1;
const IDB_STORE_NAME = 'files_content';

function openIDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    const request = window.indexedDB.open(IDB_NAME, IDB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
        db.createObjectStore(IDB_STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      console.warn('Không thể mở IndexedDB:', request.error);
      resolve(null);
    };
  });
}

async function idbSaveFileContent(id: string, content: string): Promise<boolean> {
  try {
    const db = await openIDB();
    if (!db) return false;
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
      const store = tx.objectStore(IDB_STORE_NAME);
      store.put({ id, content });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (e) {
    console.warn('Lỗi lưu tệp vào IndexedDB:', e);
    return false;
  }
}

async function idbGetFileContent(id: string): Promise<string | null> {
  try {
    const db = await openIDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE_NAME, 'readonly');
      const store = tx.objectStore(IDB_STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result ? req.result.content : null);
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    console.warn('Lỗi đọc tệp từ IndexedDB:', e);
    return null;
  }
}

async function idbDeleteFileContent(id: string): Promise<boolean> {
  try {
    const db = await openIDB();
    if (!db) return false;
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
      const store = tx.objectStore(IDB_STORE_NAME);
      store.delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (e) {
    return false;
  }
}

// Thư mục hệ thống chuyên dụng cho Bộ cài đặt Tất Cả Các App
export const FOLDER_ALL_APPS_ID = 'folder-cai-dat-all-apps';

const FOLDER_ALL_APPS: StorageFolder = {
  id: FOLDER_ALL_APPS_ID,
  name: '📦 Bộ Cài Đặt Các App (All-in-One)',
  category: 'cai_dat_app',
  createdAt: '2026-10-19T08:00:00Z',
  updatedAt: '2026-10-19T08:00:00Z',
  isSystemDefault: true
};

// Các thư mục sư phạm mặc định ban đầu
const DEFAULT_FOLDERS: StorageFolder[] = [
  FOLDER_ALL_APPS,
  {
    id: 'folder-van-ban-bao-cao',
    name: 'Văn bản - Báo cáo',
    category: 'bao_cao',
    createdAt: '2026-10-19T08:00:00Z',
    updatedAt: '2026-10-19T08:00:00Z',
    isSystemDefault: true
  },
  {
    id: 'folder-phu-luc-ppct',
    name: 'Phụ lục - PPCT',
    category: 'phu_luc',
    createdAt: '2026-10-19T08:00:00Z',
    updatedAt: '2026-10-19T08:00:00Z',
    isSystemDefault: true
  },
  {
    id: 'folder-giao-an-5512',
    name: 'Kế hoạch bài dạy (Giáo án CV 5512)',
    category: 'giao_an',
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
  }
];

const GITHUB_RELEASE_BASE = 'https://github.com/quangcaodongyen-sketch/GiaoVienAIToanNang3/releases/download/v3.0-nls';

// DANH MỤC TOÀN BỘ FILE CÀI ĐẶT CÁC APP CHUẨN CỦA THẦY ĐINH THÀNH
export const OFFICIAL_APP_FILES: StorageFileItem[] = [
  // ==================== CẤP THCS (CV 7991) ====================
  {
    id: 'app-tin-thcs-exe',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Cai_Dat_TaoDe_Tin_THCS.exe',
    size: 76328947,
    fileType: 'exe',
    mimeType: 'application/x-msdownload',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Cai_Dat_TaoDe_Tin_THCS.exe`,
    description: 'Bộ cài đặt All-in-One Tạo đề Tin học THCS (Lớp 6, 7, 8, 9 CV 7991) - Tự động tạo Shortcut Desktop & Tích hợp Word Add-in ribbon',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-tin-thcs-zip',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Tao_De_Tin_Hoc_THCS_Pass_123.zip',
    size: 75972666,
    fileType: 'zip',
    mimeType: 'application/zip',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Tao_De_Tin_Hoc_THCS_Pass_123.zip`,
    description: 'File nén trọn bộ Tạo đề Tin học THCS (Pass giải nén: 123) - Tự động phân phối cho GV',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-tin-thcs-dotm',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'TaoDe_TIN_THCS.dotm',
    size: 33647,
    fileType: 'dotm',
    mimeType: 'application/vnd.ms-word.template.macroEnabled.12',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/TaoDe_TIN_THCS.dotm`,
    description: 'Add-in Word Ribbon chuyên dụng Tạo đề Tin học THCS (Tab 💻 TIN HỌC THCS)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-gdcd-thcs-exe',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Cai_Dat_TaoDe_GDCD_THCS.exe',
    size: 74974027,
    fileType: 'exe',
    mimeType: 'application/x-msdownload',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Tao_De_GDCD_THCS.exe`,
    description: 'Bộ cài đặt All-in-One Tạo đề GDCD THCS (Lớp 6, 7, 8, 9 CV 7991) - Tự động tạo Shortcut Desktop & Word Ribbon',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-gdcd-thcs-zip',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Tao_De_GDCD_THCS_Pass_123.zip',
    size: 74617209,
    fileType: 'zip',
    mimeType: 'application/zip',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Tao_De_GDCD_THCS_Pass_123.zip`,
    description: 'File nén trọn bộ Tạo đề GDCD THCS (Pass giải nén: 123)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-toan-thcs-exe',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Cai_Dat_TaoDe_TOAN_THCS.exe',
    size: 81788928,
    fileType: 'exe',
    mimeType: 'application/x-msdownload',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Tao_De_Toan_THCS.exe`,
    description: 'Bộ cài đặt All-in-One Tạo đề Toán THCS (Lớp 6, 7, 8, 9 CV 7991)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-toan-thcs-zip',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Tao_De_Toan_THCS_Pass_123.zip',
    size: 81400000,
    fileType: 'zip',
    mimeType: 'application/zip',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Tao_De_Toan_THCS_Pass_123.zip`,
    description: 'File nén trọn bộ Tạo đề Toán THCS (Pass giải nén: 123)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-van-thcs-exe',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Cai_Dat_TaoDe_VAN_THCS.exe',
    size: 78500000,
    fileType: 'exe',
    mimeType: 'application/x-msdownload',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Tao_De_Van_THCS.exe`,
    description: 'Bộ cài đặt All-in-One Tạo đề Ngữ văn THCS (Lớp 6, 7, 8, 9 CV 7991)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-van-thcs-zip',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Tao_De_Van_THCS_Pass_123.zip',
    size: 78000000,
    fileType: 'zip',
    mimeType: 'application/zip',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Tao_De_Van_THCS_Pass_123.zip`,
    description: 'File nén trọn bộ Tạo đề Ngữ văn THCS (Pass giải nén: 123)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-khtn-thcs-exe',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Cai_Dat_TaoDe_KHTN_THCS.exe',
    size: 79500000,
    fileType: 'exe',
    mimeType: 'application/x-msdownload',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Tao_De_KHTN_THCS.exe`,
    description: 'Bộ cài đặt All-in-One Tạo đề Khoa học tự nhiên THCS (Lớp 6, 7, 8, 9 CV 7991)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-khtn-thcs-zip',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Tao_De_KHTN_THCS_Pass_123.zip',
    size: 79000000,
    fileType: 'zip',
    mimeType: 'application/zip',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Tao_De_KHTN_THCS_Pass_123.zip`,
    description: 'File nén trọn bộ Tạo đề KHTN THCS (Pass giải nén: 123)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-cn-thcs-exe',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Cai_Dat_TaoDe_CN_THCS.exe',
    size: 78000000,
    fileType: 'exe',
    mimeType: 'application/x-msdownload',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Tao_De_Cong_Nghe_THCS.exe`,
    description: 'Bộ cài đặt All-in-One Tạo đề Công nghệ THCS (Lớp 6, 7, 8, 9 CV 7991)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-cn-thcs-zip',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Tao_De_Cong_Nghe_THCS_Pass_123.zip',
    size: 77500000,
    fileType: 'zip',
    mimeType: 'application/zip',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Tao_De_Cong_Nghe_THCS_Pass_123.zip`,
    description: 'File nén trọn bộ Tạo đề Công nghệ THCS (Pass giải nén: 123)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-ls-thcs-exe',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Cai_Dat_TaoDe_LS_THCS.exe',
    size: 95420416,
    fileType: 'exe',
    mimeType: 'application/x-msdownload',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Cai_Dat_TaoDe_LS_THCS.exe`,
    description: 'Bộ cài đặt All-in-One Tạo đề Lịch sử THCS Chuyên Sâu (Lớp 6, 7, 8, 9 CV 7991)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-ls-thcs-zip',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Tao_De_Lich_Su_THCS_Pass_123.zip',
    size: 94800000,
    fileType: 'zip',
    mimeType: 'application/zip',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Tao_De_Lich_Su_THCS_Pass_123.zip`,
    description: 'File nén trọn bộ Tạo đề Lịch sử THCS (Pass giải nén: 123)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-sudia-thcs-exe',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Tao_De_Su_Dia_THCS.exe',
    size: 36700160,
    fileType: 'exe',
    mimeType: 'application/x-msdownload',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Tao_De_Su_Dia_THCS.exe`,
    description: 'Bộ cài đặt Tạo đề Lịch sử & Địa lí THCS (Lớp 6, 7, 8, 9 CV 7991)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-sudia-thcs-zip',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Tao_De_Su_Dia_THCS_Pass_123.zip',
    size: 36200000,
    fileType: 'zip',
    mimeType: 'application/zip',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Tao_De_Su_Dia_THCS_Pass_123.zip`,
    description: 'File nén trọn bộ Tạo đề Lịch sử & Địa lí THCS (Pass giải nén: 123)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-tienganh-thcs-exe',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'TaoDe_TiengAnh_THCS.exe',
    size: 52428800,
    fileType: 'exe',
    mimeType: 'application/x-msdownload',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/TaoDe_TiengAnh_THCS.exe`,
    description: 'Bộ cài đặt Tạo đề Tiếng Anh THCS Global Success (Lớp 6, 7, 8, 9 CV 7991 - Bám sát 100% SGK)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-15p-tienganh-exe',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'TaoDe_15Phut_TiengAnh_THCS.exe',
    size: 47185920,
    fileType: 'exe',
    mimeType: 'application/x-msdownload',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/TaoDe_15Phut_TiengAnh_THCS.exe`,
    description: 'Bộ cài đặt Tạo đề kiểm tra thường xuyên 15 phút Tiếng Anh THCS',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-hub-thcs-exe',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Trung_Tam_Tao_De_THCS.exe',
    size: 99614720,
    fileType: 'exe',
    mimeType: 'application/x-msdownload',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Trung_Tam_Tao_De_THCS.exe`,
    description: 'Trung Tâm Tổng Hợp Tạo Đề 7 Môn THCS (CV 7991 Hub)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-hub-thcs-zip',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Trung_Tam_Tao_De_THCS_Pass_123.zip',
    size: 99000000,
    fileType: 'zip',
    mimeType: 'application/zip',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Trung_Tam_Tao_De_THCS_Pass_123.zip`,
    description: 'File nén Trung Tâm Tạo Đề 7 Môn THCS (Pass giải nén: 123)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },

  // ==================== CẤP THPT (QĐ 764) ====================
  {
    id: 'app-toan-thpt-exe',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Cai_Dat_TaoDe_Toan_THPT.exe',
    size: 118489088,
    fileType: 'exe',
    mimeType: 'application/x-msdownload',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Cai_Dat_TaoDe_Toan_THPT.exe`,
    description: 'Bộ cài đặt All-in-One Tạo đề Toán THPT (Lớp 10, 11, 12 chuẩn QĐ 764/BGDĐT)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-toan-thpt-zip',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Tao_De_Toan_THPT_Pass_123.zip',
    size: 118000000,
    fileType: 'zip',
    mimeType: 'application/zip',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Tao_De_Toan_THPT_Pass_123.zip`,
    description: 'File nén bản quyền Tạo đề Toán THPT (Pass giải nén: 123)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-anh-thpt-exe',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Cai_Dat_TaoDe_TiengAnh_THPT.exe',
    size: 118489088,
    fileType: 'exe',
    mimeType: 'application/x-msdownload',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Cai_Dat_TaoDe_TiengAnh_THPT.exe`,
    description: 'Bộ cài đặt All-in-One Tạo đề Tiếng Anh THPT (Lớp 10, 11, 12 chuẩn QĐ 764/BGDĐT)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-anh-thpt-zip',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Tao_De_Tieng_Anh_THPT_Pass_123.zip',
    size: 118000000,
    fileType: 'zip',
    mimeType: 'application/zip',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Tao_De_Tieng_Anh_THPT_Pass_123.zip`,
    description: 'File nén bản quyền Tạo đề Tiếng Anh THPT (Pass giải nén: 123)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-van-thpt-exe',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Cai_Dat_TaoDe_NguVan_THPT.exe',
    size: 118489088,
    fileType: 'exe',
    mimeType: 'application/x-msdownload',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Cai_Dat_TaoDe_NguVan_THPT.exe`,
    description: 'Bộ cài đặt All-in-One Tạo đề Ngữ văn THPT (Lớp 10, 11, 12 chuẩn QĐ 764/BGDĐT)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-van-thpt-zip',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Tao_De_NguVan_THPT_Pass_123.zip',
    size: 118000000,
    fileType: 'zip',
    mimeType: 'application/zip',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Tao_De_NguVan_THPT_Pass_123.zip`,
    description: 'File nén bản quyền Tạo đề Ngữ văn THPT (Pass giải nén: 123)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-vatli-thpt-exe',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Cai_Dat_TaoDe_VatLi_THPT.exe',
    size: 118489088,
    fileType: 'exe',
    mimeType: 'application/x-msdownload',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Cai_Dat_TaoDe_VatLi_THPT.exe`,
    description: 'Bộ cài đặt All-in-One Tạo đề Vật lí THPT (Lớp 10, 11, 12 chuẩn QĐ 764/BGDĐT)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-hoahoc-thpt-exe',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Cai_Dat_TaoDe_HoaHoc_THPT.exe',
    size: 118489088,
    fileType: 'exe',
    mimeType: 'application/x-msdownload',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Cai_Dat_TaoDe_HoaHoc_THPT.exe`,
    description: 'Bộ cài đặt All-in-One Tạo đề Hóa học THPT (Lớp 10, 11, 12 chuẩn QĐ 764/BGDĐT)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-sinhhoc-thpt-exe',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Cai_Dat_TaoDe_SinhHoc_THPT.exe',
    size: 118489088,
    fileType: 'exe',
    mimeType: 'application/x-msdownload',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Cai_Dat_TaoDe_SinhHoc_THPT.exe`,
    description: 'Bộ cài đặt All-in-One Tạo đề Sinh học THPT (Lớp 10, 11, 12 chuẩn QĐ 764/BGDĐT)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-tinhoc-thpt-exe',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Cai_Dat_TaoDe_TinHoc_THPT.exe',
    size: 118489088,
    fileType: 'exe',
    mimeType: 'application/x-msdownload',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Cai_Dat_TaoDe_TinHoc_THPT.exe`,
    description: 'Bộ cài đặt All-in-One Tạo đề Tin học THPT (Lớp 10, 11, 12 chuẩn QĐ 764/BGDĐT)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-lichsu-thpt-exe',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Cai_Dat_TaoDe_LichSu_THPT.exe',
    size: 118489088,
    fileType: 'exe',
    mimeType: 'application/x-msdownload',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Cai_Dat_TaoDe_LichSu_THPT.exe`,
    description: 'Bộ cài đặt All-in-One Tạo đề Lịch sử THPT (Lớp 10, 11, 12 chuẩn QĐ 764/BGDĐT)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-diali-thpt-exe',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Cai_Dat_TaoDe_DiaLi_THPT.exe',
    size: 118489088,
    fileType: 'exe',
    mimeType: 'application/x-msdownload',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Cai_Dat_TaoDe_DiaLi_THPT.exe`,
    description: 'Bộ cài đặt All-in-One Tạo đề Địa lí THPT (Lớp 10, 11, 12 chuẩn QĐ 764/BGDĐT)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-gdktpl-thpt-exe',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Cai_Dat_TaoDe_GDKTPL_THPT.exe',
    size: 118489088,
    fileType: 'exe',
    mimeType: 'application/x-msdownload',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Cai_Dat_TaoDe_GDKTPL_THPT.exe`,
    description: 'Bộ cài đặt All-in-One Tạo đề GDKT & PL THPT (Lớp 10, 11, 12 chuẩn QĐ 764/BGDĐT)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },
  {
    id: 'app-congnghe-thpt-exe',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Cai_Dat_TaoDe_CongNghe_THPT.exe',
    size: 118489088,
    fileType: 'exe',
    mimeType: 'application/x-msdownload',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Cai_Dat_TaoDe_CongNghe_THPT.exe`,
    description: 'Bộ cài đặt All-in-One Tạo đề Công nghệ THPT (Lớp 10, 11, 12 chuẩn QĐ 764/BGDĐT)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
  },

  // ==================== CÔNG CỤ QUẢN TRỊ BẢN QUYỀN & TIỆN ÍCH ====================
  {
    id: 'tool-tao-key-pro-exe',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Tool_Tao_Key_Ban_Quyen_Tong_Hop.exe',
    size: 47185920,
    fileType: 'exe',
    mimeType: 'application/x-msdownload',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Tool_Tao_Key_Ban_Quyen_Tong_Hop.exe`,
    description: 'Công cụ Tạo Key Bản quyền Pro Tổng hợp (Dành riêng cho Thầy giáo Đinh Thành cấp quyền)',
    uploader: 'Thầy Đinh Thành (Admin)',
    isOfficial: true
  },
  {
    id: 'tool-tichhop-nls-exe',
    folderId: FOLDER_ALL_APPS_ID,
    name: 'Cai_Dat_Tich_Hop_NLS_AI_THCS.exe',
    size: 52428800,
    fileType: 'exe',
    mimeType: 'application/x-msdownload',
    uploadedAt: '2026-10-19T22:25:00Z',
    downloadUrl: `${GITHUB_RELEASE_BASE}/Cai_Dat_Tich_Hop_NLS_AI_THCS.exe`,
    description: 'Công cụ Tự động Tích hợp Năng lực số, STEM & AI vào Kế hoạch bài dạy (Giáo án CV 5512)',
    uploader: 'Thầy Đinh Thành (Tác quyền)',
    isOfficial: true
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
      // 1. NẠP DANH MỤC THƯ MỤC
      const savedFolders = localStorage.getItem(STORAGE_KEY_FOLDERS);
      if (savedFolders) {
        this.folders = JSON.parse(savedFolders);
      } else {
        this.folders = [...DEFAULT_FOLDERS];
      }

      // Đảm bảo thư mục All Apps luôn luôn có mặt ở đầu danh sách
      const hasAllApps = this.folders.some(f => f.id === FOLDER_ALL_APPS_ID);
      if (!hasAllApps) {
        this.folders.unshift(FOLDER_ALL_APPS);
      }

      // Đảm bảo các thư mục hệ thống cơ bản không bị thiếu
      const defaultSysIds = ['folder-van-ban-bao-cao', 'folder-phu-luc-ppct'];
      defaultSysIds.forEach(sysId => {
        if (!this.folders.some(f => f.id === sysId)) {
          const found = DEFAULT_FOLDERS.find(df => df.id === sysId);
          if (found) this.folders.push(found);
        }
      });

      this.saveFolders();

      // 2. NẠP DANH SÁCH TỆP TIN
      const savedFiles = localStorage.getItem(STORAGE_KEY_FILES);
      let userFiles: StorageFileItem[] = [];
      if (savedFiles) {
        try {
          userFiles = JSON.parse(savedFiles);
        } catch (e) {
          userFiles = [];
        }
      }

      // Loại bỏ các file official cũ nếu có để nạp lại bản mới nhất từ OFFICIAL_APP_FILES
      const nonOfficialFiles = userFiles.filter(f => !f.isOfficial && f.folderId !== FOLDER_ALL_APPS_ID);
      
      // Hợp nhất: Tệp chính thức All Apps + Tệp của Thầy upload
      this.files = [...OFFICIAL_APP_FILES, ...nonOfficialFiles];
      this.saveFiles();

    } catch (e) {
      console.warn('Lỗi đọc dữ liệu lưu trữ hồ sơ:', e);
      this.folders = [...DEFAULT_FOLDERS];
      this.files = [...OFFICIAL_APP_FILES];
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
      // Khi lưu metadata vào localStorage, bỏ dataBase64 lớn ra để không bao giờ bị QuotaExceededError (5MB limit)
      const lightweightFiles = this.files.map(f => {
        const copy = { ...f };
        if (copy.dataBase64 && copy.dataBase64.length > 500) {
          copy.dataBase64 = undefined; // Đã lưu an toàn trong IndexedDB
        }
        return copy;
      });
      localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(lightweightFiles));
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

    this.folders.push(newFolder);
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
    if (folderId === FOLDER_ALL_APPS_ID) {
      alert('Đây là thư mục hệ thống chứa bộ cài đặt các ứng dụng, không thể xóa!');
      return false;
    }

    const index = this.folders.findIndex(f => f.id === folderId);
    if (index === -1) return false;

    this.folders.splice(index, 1);
    this.saveFolders();

    // Xóa các file thuộc thư mục này
    const filesToDelete = this.files.filter(file => file.folderId === folderId);
    filesToDelete.forEach(f => idbDeleteFileContent(f.id));

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

  // Tải lên tệp tin mới (hỗ trợ .docx, .doc, .pdf, .pptx, .xlsx, .zip, .exe...)
  public async uploadFile(
    folderId: string,
    file: File,
    description: string = '',
    uploader: string = 'Admin Thầy Thành'
  ): Promise<StorageFileItem> {
    const fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const dataBase64 = await this.readFileAsDataURL(file);
    const ext = file.name.split('.').pop()?.toLowerCase() || 'other';

    // Lưu nội dung đầy đủ vào IndexedDB (dung lượng không giới hạn)
    await idbSaveFileContent(fileId, dataBase64);

    const newFile: StorageFileItem = {
      id: fileId,
      folderId,
      name: file.name,
      size: file.size,
      fileType: ext,
      mimeType: file.type || 'application/octet-stream',
      uploadedAt: new Date().toISOString(),
      downloadUrl: undefined, // Sẽ tải từ IndexedDB
      description: description.trim() || `Tài liệu tải lên ngày ${new Date().toLocaleDateString('vi-VN')}`,
      uploader
    };

    this.files.unshift(newFile);
    this.saveFiles();
    return newFile;
  }

  // Tải file về máy tính của người dùng
  public async downloadFile(file: StorageFileItem) {
    // 1. Link trực tiếp từ Cloud CDN Release
    if (file.downloadUrl && (file.downloadUrl.startsWith('http://') || file.downloadUrl.startsWith('https://'))) {
      const a = document.createElement('a');
      a.href = file.downloadUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // 2. Tệp lưu trong IndexedDB hoặc Local Base64
    let content = file.dataBase64;
    if (!content) {
      content = await idbGetFileContent(file.id);
    }

    if (!content && file.downloadUrl) {
      content = file.downloadUrl;
    }

    if (!content) {
      alert('Không tìm thấy dữ liệu tệp tin để tải về! Tệp có thể đã bị dọn dẹp bộ nhớ đệm.');
      return;
    }

    const a = document.createElement('a');
    a.href = content;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Sao chép link tải của tệp tin (nếu có)
  public copyFileLink(file: StorageFileItem): boolean {
    if (file.downloadUrl && (file.downloadUrl.startsWith('http://') || file.downloadUrl.startsWith('https://'))) {
      navigator.clipboard.writeText(file.downloadUrl);
      return true;
    }
    return false;
  }

  // Xóa tệp tin
  public deleteFile(fileId: string): boolean {
    if (fileId.startsWith('app-') || fileId.startsWith('tool-')) {
      alert('Không thể xóa tệp cài đặt chính thức của hệ thống!');
      return false;
    }

    const index = this.files.findIndex(f => f.id === fileId);
    if (index === -1) return false;

    idbDeleteFileContent(fileId);
    this.files.splice(index, 1);
    this.saveFiles();
    return true;
  }

  // Thống kê dung lượng đã dùng
  public getStorageStats() {
    let totalBytes = 0;
    this.files.forEach(f => {
      // Chỉ tính dung lượng các file do user tải lên, không tính file link Cloud
      if (!f.isOfficial) {
        totalBytes += f.size || 0;
      }
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
      freeCapacityText: '1 GB (Supabase Storage Cloud & IndexedDB)'
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
