/**
 * BỘ TIỆN ÍCH SAO CHÉP & CHIA SẺ ĐƯỜNG DẪN TRỰC TIẾP
 * Tác giả Đinh Thành, ĐT: 0915.213717 - Hotline/Zalo: 0915.213717
 * Tên miền thương hiệu chính thức: dekiemtraso.com
 */

export const OFFICIAL_DOMAIN = 'https://dekiemtraso.com';

/**
 * Trả về đường link đầy đủ để chia sẻ cho giáo viên / khách hàng
 * Đảm bảo luôn sử dụng tên miền chính thức dekiemtraso.com khi copy gửi khách
 */
export const getAppShareUrl = (hashOrUrl: string): string => {
  if (!hashOrUrl) return OFFICIAL_DOMAIN;
  
  // Nếu đã là link đầy đủ http/https
  if (hashOrUrl.startsWith('http://') || hashOrUrl.startsWith('https://')) {
    return hashOrUrl;
  }

  // Định dạng hash bắt đầu bằng #
  const cleanHash = hashOrUrl.startsWith('#') ? hashOrUrl : `#${hashOrUrl}`;

  // Kiểm tra origin hiện tại của trình duyệt
  if (typeof window !== 'undefined' && window.location) {
    const origin = window.location.origin;
    // Nếu đang chạy nội bộ (localhost / 127.0.0.1) thì vẫn ưu tiên link dekiemtraso.com để Thầy Thành gửi khách chạy được ngay
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return `${OFFICIAL_DOMAIN}/${cleanHash}`;
    }
    // Nếu đang trên web thật (dekiemtraso.com hoặc vercel app), dùng origin chuẩn
    return `${origin}/${cleanHash}`;
  }

  return `${OFFICIAL_DOMAIN}/${cleanHash}`;
};

/**
 * Cập nhật thanh địa chỉ trình duyệt mà không tải lại trang
 */
export const syncBrowserHash = (hashOrUrl: string): void => {
  if (typeof window === 'undefined' || !window.history) return;
  if (!hashOrUrl) return;

  const cleanHash = hashOrUrl.startsWith('#') ? hashOrUrl : `#${hashOrUrl}`;
  try {
    if (window.location.hash !== cleanHash) {
      window.history.pushState(null, '', cleanHash);
    }
  } catch (err) {
    console.warn('[ShareUtils] Không thể cập nhật hash:', err);
  }
};

/**
 * Sao chép văn bản vào bộ nhớ tạm (Clipboard) với cơ chế fallback tương thích mọi trình duyệt
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!text) return false;

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.warn('[ShareUtils] navigator.clipboard thất bại, chuyển sang fallback execCommand:', err);
  }

  // Fallback dành cho các trình duyệt hoặc context không hỗ trợ trực tiếp navigator.clipboard
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '-9999px';
    textArea.style.opacity = '0';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('[ShareUtils] Fallback sao chép thất bại:', err);
    return false;
  }
};
