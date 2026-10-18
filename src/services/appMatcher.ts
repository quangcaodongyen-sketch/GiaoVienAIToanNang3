/**
 * TIỆN ÍCH CHUẨN HÓA VÀ NHẬN DIỆN MÔN HỌC / APP TRONG HỆ SINH THÁI
 * Tác giả: Đinh Thành - 0915.213717
 */

export const removeDiacritics = (str: string): string => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
};

export const isAppMatching = (
  regAppId: string | undefined,
  regAppName: string | undefined,
  targetAppId: string
): boolean => {
  if (!targetAppId || targetAppId === 'ALL') return true;
  const target = removeDiacritics(targetAppId);
  const rId = removeDiacritics(regAppId || '');
  const rName = removeDiacritics(regAppName || '');
  const combined = `${rId} ${rName}`;

  // Master / All Bundle có hiệu lực với tất cả ứng dụng
  if (rId === 'all' || rId === 'full_web' || rId === 'master' || combined.includes('toan bo') || combined.includes('tat ca')) {
    return true;
  }

  // Khớp chính xác ID
  if (rId && rId === target) return true;

  // 1. CÔNG NGHỆ THPT
  if (target.includes('congnghe') && (target.includes('thpt') || target.includes('pt'))) {
    const hasSubj = combined.includes('cong nghe') || combined.includes('congnghe') || combined.includes('tech');
    const hasLevel = combined.includes('thpt') || combined.includes('pt') || combined.includes('10') || combined.includes('11') || combined.includes('12');
    return hasSubj && (hasLevel || !combined.includes('thcs'));
  }

  // 2. VẬT LÍ THPT
  if ((target.includes('vatli') || target.includes('vatly') || target.includes('phy')) && (target.includes('thpt') || target.includes('pt'))) {
    const hasSubj = combined.includes('vat li') || combined.includes('vat ly') || combined.includes('vatli') || combined.includes('vatly') || combined.includes('phy');
    const hasLevel = combined.includes('thpt') || combined.includes('pt') || combined.includes('10') || combined.includes('11') || combined.includes('12');
    return hasSubj && (hasLevel || !combined.includes('thcs'));
  }

  // 3. HÓA HỌC THPT
  if ((target.includes('hoa') || target.includes('chm') || target.includes('chem')) && (target.includes('thpt') || target.includes('pt'))) {
    const hasSubj = combined.includes('hoa hoc') || combined.includes('chm') || combined.includes('chem') || (combined.includes('hoa') && !combined.includes('khoa hoc'));
    const hasLevel = combined.includes('thpt') || combined.includes('pt') || combined.includes('10') || combined.includes('11') || combined.includes('12');
    return hasSubj && (hasLevel || !combined.includes('thcs'));
  }

  // 4. SINH HỌC THPT
  if ((target.includes('sinh') || target.includes('bio')) && (target.includes('thpt') || target.includes('pt'))) {
    const hasSubj = combined.includes('sinh hoc') || combined.includes('sinh') || combined.includes('bio');
    const hasLevel = combined.includes('thpt') || combined.includes('pt') || combined.includes('10') || combined.includes('11') || combined.includes('12');
    return hasSubj && (hasLevel || !combined.includes('thcs'));
  }

  // 5. TIN HỌC THPT
  if ((target.includes('tin') || target.includes('inf')) && (target.includes('thpt') || target.includes('pt'))) {
    const hasSubj = combined.includes('tin hoc') || combined.includes('inf');
    const hasLevel = combined.includes('thpt') || combined.includes('pt') || combined.includes('10') || combined.includes('11') || combined.includes('12');
    return hasSubj && (hasLevel || !combined.includes('thcs'));
  }

  // 6. LỊCH SỬ THPT
  if ((target.includes('lichsu') || target.includes('his')) && (target.includes('thpt') || target.includes('pt'))) {
    const hasSubj = combined.includes('lich su') || combined.includes('lichsu') || combined.includes('his');
    const hasLevel = combined.includes('thpt') || combined.includes('pt') || combined.includes('10') || combined.includes('11') || combined.includes('12');
    return hasSubj && (hasLevel || !combined.includes('thcs'));
  }

  // 7. ĐỊA LÍ THPT
  if ((target.includes('diali') || target.includes('dialy') || target.includes('geo')) && (target.includes('thpt') || target.includes('pt'))) {
    const hasSubj = combined.includes('dia li') || combined.includes('dia ly') || combined.includes('diali') || combined.includes('dialy') || combined.includes('geo');
    const hasLevel = combined.includes('thpt') || combined.includes('pt') || combined.includes('10') || combined.includes('11') || combined.includes('12');
    return hasSubj && (hasLevel || !combined.includes('thcs'));
  }

  // 8. GDKT & PL THPT
  if (target.includes('gdkt') || target.includes('kinhte') || target.includes('phapluat')) {
    return combined.includes('gdkt') || combined.includes('kinh te') || combined.includes('phap luat');
  }

  // 9. NGỮ VĂN THPT
  if ((target.includes('nguvan') || target.includes('van') || target.includes('lit')) && (target.includes('thpt') || target.includes('pt'))) {
    const hasSubj = combined.includes('ngu van') || combined.includes('nguvan') || combined.includes('lit');
    const hasLevel = combined.includes('thpt') || combined.includes('pt') || combined.includes('10') || combined.includes('11') || combined.includes('12');
    return hasSubj && (hasLevel || !combined.includes('thcs'));
  }

  // 10. TOÁN THPT
  if ((target.includes('toan') || target.includes('math')) && (target.includes('thpt') || target.includes('pt')) && !target.includes('mathstudio')) {
    const hasSubj = combined.includes('toan') || combined.includes('math');
    const hasLevel = combined.includes('thpt') || combined.includes('pt') || combined.includes('10') || combined.includes('11') || combined.includes('12');
    const notOther = !combined.includes('mathstudio') && !combined.includes('tieng anh') && !combined.includes('khtn');
    return hasSubj && hasLevel && notOther;
  }

  // 11. TIẾNG ANH THPT
  if ((target.includes('eng') || target.includes('tienganh')) && (target.includes('thpt') || target.includes('pt') || target.includes('engpt'))) {
    const hasSubj = combined.includes('tieng anh') || combined.includes('english') || combined.includes('eng');
    const hasLevel = combined.includes('thpt') || combined.includes('pt') || combined.includes('engpt') || combined.includes('10') || combined.includes('11') || combined.includes('12');
    return hasSubj && hasLevel && !combined.includes('thcs') && !combined.includes('tieu hoc');
  }

  // 12. LỊCH SỬ THCS
  if ((target.includes('lichsu') || target.includes('ls')) && (target.includes('thcs') || target.includes('cs') || target.includes('cn-thcs'))) {
    return (combined.includes('lich su') || combined.includes('lichsu') || combined.includes('taode-cn-thcs') || combined.includes('ls-dvt') || combined.includes('lsthcs')) && !combined.includes('thpt');
  }

  // 13. KHOA HỌC TỰ NHIÊN THCS (KHTN)
  if (target.includes('khtn') || target.includes('khoa hoc tu nhien') || target.includes('tu nhien')) {
    return combined.includes('khtn') || combined.includes('khoa hoc tu nhien') || combined.includes('tu nhien') || combined.includes('tikhtnanh');
  }

  // 14. TIẾNG ANH TIỂU HỌC (Thông tư 27)
  if (target.includes('engpri') || (target.includes('tieng anh') && target.includes('tieu hoc')) || target.includes('tieuhoc_tienganh')) {
    return (combined.includes('tieng anh') || combined.includes('eng')) && (combined.includes('tieu hoc') || combined.includes('thong tu 27') || combined.includes('engpri') || combined.includes('pri'));
  }

  // 15. TIẾNG VIỆT TIỂU HỌC
  if (target.includes('tvth') || target.includes('tiengviet') || (target.includes('tieng viet') && target.includes('tieu hoc'))) {
    return combined.includes('tieng viet') || combined.includes('tvth');
  }

  // 16. TIẾNG ANH THCS
  if (target.includes('eng') || target.includes('tienganh') || target.includes('taode_tienganh_thcs')) {
    const hasSubj = combined.includes('tieng anh') || combined.includes('english') || combined.includes('eng') || combined.includes('taode-tienganh');
    const notOther = !combined.includes('thpt') && !combined.includes('tieu hoc') && !combined.includes('toan') && !combined.includes('nls') && !combined.includes('15p');
    return hasSubj && notOther;
  }

  // 17. TẠO ĐỀ 15 PHÚT TIẾNG ANH
  if (target.includes('15p') || target.includes('15phut') || target.includes('eng15')) {
    return combined.includes('15p') || combined.includes('15 phut') || combined.includes('eng15');
  }

  // 18. TÍCH HỢP NLS-AI (CV 5512)
  if (target.includes('nls') || target.includes('nang luc so') || target.includes('5512')) {
    return (combined.includes('nls') || combined.includes('nang luc so') || combined.includes('5512')) && !combined.includes('tieng anh');
  }

  // 19. MATHSTUDIO
  if (target.includes('mathstudio') || target.includes('mathpix')) {
    return combined.includes('mathstudio') || combined.includes('mathpix') || combined.includes('soan thao toan');
  }

  // 20. TẠO ĐỀ 8 MÔN THCS
  if (target.includes('8mon') || target.includes('thcs_8m') || target.includes('thcs-8mon')) {
    return combined.includes('8 mon') || combined.includes('8mon') || combined.includes('thcs8m');
  }

  // 21. SMART LISTENING PRO (TTS)
  if (target.includes('listening') || target.includes('tts') || target.includes('smart_listening')) {
    return combined.includes('listening') || combined.includes('tts') || combined.includes('bai nghe') || combined.includes('file nghe') || combined.includes('smart-listening') || combined.includes('mb-');
  }

  // 22. BIẾN THỂ ĐỀ THI
  if (target.includes('bienthe') || target.includes('bien the') || target.includes('var')) {
    return combined.includes('bien the') || combined.includes('bienthe');
  }

  // 23. CHUẨN HÓA VĂN BẢN
  if (target.includes('chuanhoa') || target.includes('chuan hoa') || target.includes('chvb')) {
    return combined.includes('chuan hoa') || combined.includes('chuanhoa') || combined.includes('chvb');
  }

  // 24. DỌN RÁC CLEANER PRO
  if (target.includes('cleaner') || target.includes('don rac')) {
    return combined.includes('cleaner') || combined.includes('don rac');
  }

  // 25. PDF SUITE
  if (target.includes('pdf')) {
    return combined.includes('pdf');
  }

  // 26. SCREEN RECORD
  if (target.includes('record') || target.includes('quay man hinh')) {
    return combined.includes('record') || combined.includes('quay man hinh');
  }

  return rId === target || combined.includes(target);
};
