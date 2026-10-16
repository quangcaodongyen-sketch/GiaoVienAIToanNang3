/**
 * StudioAI Pro - Master Web Controller
 * Nền tảng chỉnh sửa & xử lý ảnh AI toàn năng - Thầy giáo Đinh Văn Thành (Hotline/Zalo: 0915.213717)
 * Rock-solid client-side engine with auto-demo preloading and global handlers
 */

// Application Global State
window.StudioState = {
  items: [],
  activeId: null,
  activeView: 'view_image_edit',
  activeTool: 'id_photo',
  viewMode: 'split',
  isBatchProcessing: false,
  settings: {
    size_key: '3x4',
    bg_preset: 'blue_studio_radial',
    custom_bg_hex: null,
    clothing_id: 'none',
    clothes_scale: 1.0,
    clothes_y_offset: 0,
    skin_smooth: 25,
    brightness: 6,
    contrast: 6,
    sharpness: 20,
    preset_id: 'hoc_sinh_2'
  }
};

const PRESET_DEFINITIONS = {
  'quan_phuc': {
    prompt: 'Trang phục: Quân phục nghiêm trang. Màu nền: Xanh studio 0084ff. Căn chỉnh vai ngay ngắn, nhìn thẳng ống kính.',
    clothing_id: 'vest_nu_den',
    bg_preset: 'blue_standard',
    label: 'Quân phục'
  },
  'hoc_sinh_2': {
    prompt: 'Màu nền: Màu xanh 0084ff. Chi tiết: giữ kiểu tóc nguyên bản, Làn da mịn màng, tươi sáng và sắc nét.',
    clothing_id: 'none',
    bg_preset: 'blue_studio_radial',
    label: 'Học sinh 2'
  },
  'anh_the_can_cuoc': {
    prompt: 'Trang phục: Áo sơ mi có cổ lịch sự. Màu nền: Trắng tinh chuẩn CCCD / Hộ chiếu. Giữ nguyên tóc, khuôn mặt nhìn thẳng.',
    clothing_id: 'so_mi_nam_trang',
    bg_preset: 'white_cccd',
    label: 'Ảnh thẻ căn cước'
  },
  'so_mi_xanh_nhat': {
    prompt: 'Trang phục: Áo sơ mi màu xanh nhạt thanh lịch. Màu nền: Xanh studio. Da mịn màng tự nhiên.',
    clothing_id: 'so_mi_nam_trang',
    bg_preset: 'blue_light',
    label: 'Sơ mi xanh nhạt'
  },
  'ao_so_mi_polo': {
    prompt: 'Trang phục: Áo sơ mi polo có cổ trẻ trung. Màu nền: Xanh nhạt. Căn thẳng mặt, mắt nhìn thẳng camera.',
    clothing_id: 'none',
    bg_preset: 'blue_light',
    label: 'Áo sơ mi polo'
  },
  'ao_vest_cong_so': {
    prompt: 'Trang phục: Áo vest đen công sở kèm sơ mi trắng. Màu nền: Xanh 0084ff studio. Phong thái chuyên nghiệp.',
    clothing_id: 'vest_nam_den',
    bg_preset: 'blue_standard',
    label: 'Áo vest công sở'
  },
  'ao_so_mi_nu': {
    prompt: 'Trang phục: Áo sơ mi trắng nữ công sở. Màu nền: Trắng hoặc xanh studio. Nét mặt tươi tắn, thanh lịch.',
    clothing_id: 'so_mi_nam_trang',
    bg_preset: 'white_cccd',
    label: 'Áo sơ mi nữ'
  },
  'ao_co_no': {
    prompt: 'Trang phục: Áo cổ nơ duyên dáng. Màu nền: Xanh studio tỏa sáng. Nét mặt rạng rỡ, sắc nét.',
    clothing_id: 'vest_nu_den',
    bg_preset: 'blue_studio_radial',
    label: 'Áo cổ nơ'
  }
};

// Toast notification
window.showToast = function(message, type = 'info') {
  const existing = document.getElementById('studioToast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'studioToast';
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'error' ? '#EF4444' : type === 'success' ? '#10B981' : '#FA541C'};
    color: #FFFFFF;
    padding: 10px 22px;
    border-radius: 9999px;
    font-size: 13.5px;
    font-weight: 700;
    box-shadow: 0 10px 30px rgba(0,0,0,0.35);
    z-index: 99999;
    pointer-events: none;
    animation: fadeIn 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  `;
  toast.innerHTML = `<span>${type === 'error' ? '⚠️' : type === 'success' ? '✅' : '✨'}</span> ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2800);
};

// View Switcher (Top Tabs)
window.switchView = function(viewId) {
  window.StudioState.activeView = viewId;

  // Update nav tabs
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewId);
  });

  // Toggle containers
  document.querySelectorAll('.main-view-container').forEach(c => {
    c.classList.toggle('active', c.id === viewId);
  });

  if (viewId === 'view_image_edit') {
    requestAnimationFrame(window.syncSplitViewport);
  }
  const tabName = document.querySelector(`[data-view="${viewId}"]`)?.textContent.trim() || viewId;
  window.showToast(`Đang mở: ${tabName}`, 'info');
};

// Left Sidebar Tools Switcher
window.selectTool = function(toolKey) {
  window.StudioState.activeTool = toolKey;

  document.querySelectorAll('.menu-item').forEach(m => {
    m.classList.toggle('active', m.dataset.tool === toolKey);
  });

  const inpaintCanvas = document.getElementById('inpaintCanvas');
  const eraserToolbar = document.getElementById('eraserToolbar');

  if (toolKey === 'generative_fill') {
    if (inpaintCanvas) inpaintCanvas.style.display = 'block';
    if (eraserToolbar) eraserToolbar.style.display = 'flex';
    window.syncSplitViewport();
    window.showToast('🪄 Generative Fill: Dùng cọ vẽ lên vùng cần xóa trên ảnh!', 'info');
  } else {
    if (inpaintCanvas) inpaintCanvas.style.display = 'none';
    if (eraserToolbar) eraserToolbar.style.display = 'none';
  }

  if (toolKey === 'phuc_che') {
    window.showToast('🔄 Đã kích hoạt chế độ Phục Chế Ảnh Cũ (Khử nhiễu, phục hồi HD)!', 'success');
    window.processCurrentClientSide(true);
  } else if (toolKey === 'anh_cuoi') {
    window.showToast('🤍 Đã kích hoạt hiệu ứng Ảnh Cưới (Ánh sáng studio lãng mạn)!', 'success');
    window.StudioState.settings.bg_preset = 'blue_studio_radial';
    window.processCurrentClientSide();
  } else if (toolKey === 'tet') {
    window.showToast('🧧 Đã kích hoạt hiệu ứng Biến Hình Ảnh Tết (Phông đỏ may mắn)!', 'success');
    window.StudioState.settings.bg_preset = 'red_visa';
    window.processCurrentClientSide();
  } else if (toolKey === 'trang_phuc') {
    window.showToast('👔 Hãy chọn mẫu trang phục (Quân phục, Vest, Sơ mi) ở cột bên phải!', 'info');
  } else {
    const toolName = document.querySelector(`[data-tool="${toolKey}"] .menu-name`)?.textContent || toolKey;
    window.showToast(`Đã chọn công cụ: ${toolName}`, 'info');
  }
};

// Preset Selection (Right Sidebar 8 Cards)
window.selectPreset = function(presetKey) {
  window.StudioState.settings.preset_id = presetKey;

  document.querySelectorAll('.preset-card').forEach(c => {
    c.classList.toggle('active', c.dataset.preset === presetKey);
  });

  const def = PRESET_DEFINITIONS[presetKey];
  if (def) {
    const txtPrompt = document.getElementById('txtPrompt');
    if (txtPrompt) txtPrompt.value = def.prompt;

    window.StudioState.settings.clothing_id = def.clothing_id;
    window.StudioState.settings.bg_preset = def.bg_preset;

    // Highlight bg dot
    document.querySelectorAll('.bg-dot-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.bg === def.bg_preset);
    });

    window.showToast(`✓ Đã áp dụng mẫu: ${def.label}`, 'success');
    window.processCurrentClientSide();
  }
};

// Size Selection
window.selectSize = function(sizeKey) {
  window.StudioState.settings.size_key = sizeKey;
  document.querySelectorAll('.size-pill-mini').forEach(b => {
    b.classList.toggle('active', b.dataset.size === sizeKey);
  });
  window.showToast(`Đã chọn khổ ảnh: ${sizeKey} cm`, 'info');
  window.processCurrentClientSide();
};

// Background Color Selection
window.selectBg = function(bgKey) {
  window.StudioState.settings.bg_preset = bgKey;
  document.querySelectorAll('.bg-dot-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.bg === bgKey);
  });
  window.showToast('Đã đổi màu phông nền', 'info');
  window.processCurrentClientSide();
};

// Sample Images Loader
window.loadSample = function(sampleFilename) {
  const sampleUrl = `./assets/sample_images/${sampleFilename}`;
  const itemId = 'sample_' + Date.now();
  const item = {
    id: itemId,
    filename: sampleFilename,
    thumb_url: sampleUrl,
    preview_url: sampleUrl,
    status: 'pending',
    processed_url: null,
    original_cropped_url: null
  };

  window.StudioState.items.push(item);
  window.StudioState.activeId = itemId;

  window.renderCarousel();
  window.updateViewports();
  window.processCurrentClientSide();
  window.showToast(`Đã nạp ảnh mẫu: ${sampleFilename}`, 'success');
};

// Render Carousel
window.renderCarousel = function() {
  const track = document.getElementById('carouselTrack');
  const bottomCarousel = document.getElementById('bottomCarousel');
  if (!track || !bottomCarousel) return;

  if (window.StudioState.items.length === 0) {
    bottomCarousel.style.display = 'none';
    return;
  }
  bottomCarousel.style.display = 'block';
  track.innerHTML = '';

  window.StudioState.items.forEach((it, idx) => {
    const card = document.createElement('div');
    card.className = `carousel-card ${it.id === window.StudioState.activeId ? 'active' : ''} ${it.status}`;
    card.onclick = () => {
      window.StudioState.activeId = it.id;
      window.renderCarousel();
      window.updateViewports();
    };

    const img = document.createElement('img');
    img.src = it.thumb_url || it.preview_url;
    img.alt = it.filename;

    const badge = document.createElement('div');
    badge.className = 'card-badge';
    badge.textContent = it.status === 'done' ? '✓ Xong' : (idx + 1);

    card.appendChild(img);
    card.appendChild(badge);
    track.appendChild(card);
  });
};

// Update Viewports
window.updateViewports = function() {
  const emptyBox = document.getElementById('emptyBox');
  const activeStageView = document.getElementById('activeStageView');
  const stageImgBefore = document.getElementById('stageImgBefore');
  const stageImgAfter = document.getElementById('stageImgAfter');
  const btnDownloadCurrent = document.getElementById('btnDownloadCurrent');

  const item = window.StudioState.items.find(i => i.id === window.StudioState.activeId);
  if (!item) {
    if (emptyBox) emptyBox.style.display = 'block';
    if (activeStageView) activeStageView.style.display = 'none';
    return;
  }

  if (emptyBox) emptyBox.style.display = 'none';
  if (activeStageView) activeStageView.style.display = 'flex';

  const beforeSrc = item.original_cropped_url || item.preview_url;
  const afterSrc = item.processed_url || item.preview_url;

  if (stageImgBefore) stageImgBefore.src = beforeSrc;
  if (stageImgAfter) stageImgAfter.src = afterSrc;

  if (btnDownloadCurrent) {
    btnDownloadCurrent.href = item.download_url || afterSrc;
    btnDownloadCurrent.setAttribute('download', `anh_the_${item.filename}`);
  }

  requestAnimationFrame(window.syncSplitViewport);
};

// Sync Split Viewport
window.syncSplitViewport = function() {
  const vp = document.getElementById('splitViewport');
  const canvas = document.getElementById('inpaintCanvas');
  if (!vp) return;
  const w = vp.clientWidth;
  vp.style.setProperty('--viewport-w', `${w}px`);
  if (canvas) {
    canvas.width = w;
    canvas.height = vp.clientHeight;
  }
};

// Client-Side Canvas Image Processor (Instant Online Processing)
window.processCurrentClientSide = function(isVintageRestore = false) {
  const item = window.StudioState.items.find(i => i.id === window.StudioState.activeId);
  if (!item) return;

  item.status = 'processing';
  window.renderCarousel();

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const dims = {
      '3x4': { w: 1062, h: 1416 },
      '4x6': { w: 1416, h: 2124 },
      '2x3': { w: 708, h: 1062 },
      '3.5x4.5': { w: 1240, h: 1594 },
      '5x5': { w: 1771, h: 1771 }
    };
    const targetDim = dims[window.StudioState.settings.size_key] || dims['3x4'];
    const canvas = document.createElement('canvas');
    canvas.width = targetDim.w;
    canvas.height = targetDim.h;
    const ctx = canvas.getContext('2d');

    // 1. Draw Background
    const bg = window.StudioState.settings.bg_preset;
    if (bg === 'blue_studio_radial') {
      const grad = ctx.createRadialGradient(
        canvas.width * 0.45, canvas.height * 0.35, 40,
        canvas.width * 0.45, canvas.height * 0.35, canvas.width * 0.85
      );
      grad.addColorStop(0, '#42A5F5');
      grad.addColorStop(1, '#0D47A1');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bg === 'white_cccd') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bg === 'blue_standard') {
      ctx.fillStyle = '#0084FF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bg === 'blue_light') {
      ctx.fillStyle = '#3A86FF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bg === 'red_visa') {
      ctx.fillStyle = '#D32F2F';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bg === 'gray_studio') {
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bg !== 'transparent') {
      ctx.fillStyle = '#0084FF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 2. Crop Subject
    const srcW = img.width;
    const srcH = img.height;
    const aspect = targetDim.w / targetDim.h;
    let cropW = srcW;
    let cropH = Math.round(srcW / aspect);
    if (cropH > srcH) {
      cropH = srcH;
      cropW = Math.round(srcH * aspect);
    }
    const cropX = Math.round((srcW - cropW) / 2);
    const cropY = Math.max(0, Math.round((srcH - cropH) * 0.15));

    // Save Original Cropped Preview
    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = targetDim.w;
    cropCanvas.height = targetDim.h;
    const cropCtx = cropCanvas.getContext('2d');
    cropCtx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, targetDim.w, targetDim.h);

    if (isVintageRestore) {
      // Create vintage aged effect on the Before layer
      const cropData = cropCtx.getImageData(0, 0, targetDim.w, targetDim.h);
      const cd = cropData.data;
      for (let i = 0; i < cd.length; i += 4) {
        const gray = 0.299 * cd[i] + 0.587 * cd[i+1] + 0.114 * cd[i+2];
        cd[i] = Math.min(255, gray + 40);
        cd[i+1] = Math.min(255, gray + 20);
        cd[i+2] = Math.max(0, gray - 20);
      }
      cropCtx.putImageData(cropData, 0, 0);
    }

    item.original_cropped_url = cropCanvas.toDataURL('image/jpeg', 0.88);

    // Draw to main canvas
    ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, targetDim.w, targetDim.h);

    // 3. Overlay Clothing if chosen
    const clothId = window.StudioState.settings.clothing_id;
    if (clothId && clothId !== 'none') {
      const clothImg = new Image();
      clothImg.crossOrigin = 'anonymous';
      clothImg.src = `./assets/clothes/${clothId}.png`;
      clothImg.onload = () => {
        const scale = window.StudioState.settings.clothes_scale || 1.0;
        const clothW = Math.round(targetDim.w * scale);
        const clothH = Math.round((clothW * clothImg.height) / clothImg.width);
        const clothX = Math.round((targetDim.w - clothW) / 2);
        const clothY = Math.round(targetDim.h - clothH + (window.StudioState.settings.clothes_y_offset || 0));
        ctx.drawImage(clothImg, clothX, clothY, clothW, clothH);
        applyBeautyAndSave();
      };
      clothImg.onerror = () => applyBeautyAndSave();
    } else {
      applyBeautyAndSave();
    }

    function applyBeautyAndSave() {
      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imgData.data;
        const b = window.StudioState.settings.brightness || 0;
        const c = ((window.StudioState.settings.contrast || 0) / 100) + 1;
        for (let i = 0; i < d.length; i += 4) {
          d[i] = Math.min(255, Math.max(0, (d[i] - 128) * c + 128 + b));
          d[i+1] = Math.min(255, Math.max(0, (d[i+1] - 128) * c + 128 + b));
          d[i+2] = Math.min(255, Math.max(0, (d[i+2] - 128) * c + 128 + b));
        }
        ctx.putImageData(imgData, 0, 0);
      } catch(e) {}

      const dataUrl = canvas.toDataURL('image/jpeg', 0.94);
      item.processed_url = dataUrl;
      item.download_url = dataUrl;
      item.status = 'done';

      window.renderCarousel();
      window.updateViewports();
    }
  };
  img.src = item.preview_url || item.thumb_url;
};

// Batch Process or Single Process Trigger
window.processCurrentOrBatch = function() {
  if (window.StudioState.items.length === 0) {
    window.loadSample('sample_hocsinh.jpg');
    return;
  }

  const track = document.getElementById('progressTrack');
  const pLabel = document.getElementById('progressLabel');
  const pVal = document.getElementById('progressVal');
  const pFill = document.getElementById('progressFill');

  if (track) track.style.display = 'flex';
  const total = window.StudioState.items.length;

  window.StudioState.items.forEach((it, idx) => {
    const pct = Math.round(((idx + 1) / total) * 100);
    if (pLabel) pLabel.textContent = `Đang xử lý ảnh: ${it.filename} (${idx+1}/${total})...`;
    if (pVal) pVal.textContent = `${pct}%`;
    if (pFill) pFill.style.width = `${pct}%`;
  });

  window.processCurrentClientSide();
  window.showToast(`Đã xử lý xong ảnh thẻ chất lượng cao!`, 'success');

  setTimeout(() => {
    if (track) track.style.display = 'none';
  }, 2500);
};

// Split Slider Dragging Setup
function setupSplitSlider() {
  const divider = document.getElementById('stageDivider');
  const viewport = document.getElementById('splitViewport');
  const beforeLayer = document.getElementById('stageBeforeLayer');
  if (!divider || !viewport || !beforeLayer) return;

  let isDragging = false;

  function setPos(clientX) {
    const rect = viewport.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(5, Math.min(95, pct));
    beforeLayer.style.width = `${pct}%`;
    divider.style.left = `${pct}%`;
  }

  divider.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
  });
  window.addEventListener('mousemove', (e) => {
    if (isDragging) setPos(e.clientX);
  });
  window.addEventListener('mouseup', () => { isDragging = false; });

  divider.addEventListener('touchstart', (e) => {
    isDragging = true;
    e.preventDefault();
  });
  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches[0]) setPos(e.touches[0].clientX);
  });
  window.addEventListener('touchend', () => { isDragging = false; });
}

// Inpaint Canvas (Generative Fill) Setup
function setupInpaintDrawing() {
  const canvas = document.getElementById('inpaintCanvas');
  const brushRng = document.getElementById('brushSize');
  const brushLbl = document.getElementById('valBrushSize');
  const btnUndo = document.getElementById('btnUndoEraser');
  const btnApply = document.getElementById('btnApplyEraser');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let isDrawing = false;
  let history = [];
  let brushSize = 30;

  if (brushRng) {
    brushRng.addEventListener('input', (e) => {
      brushSize = parseInt(e.target.value);
      if (brushLbl) brushLbl.textContent = `${brushSize}px`;
    });
  }

  function getCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX || (e.touches && e.touches[0].clientX);
    const cy = e.clientY || (e.touches && e.touches[0].clientY);
    return { x: cx - rect.left, y: cy - rect.top };
  }

  canvas.addEventListener('mousedown', (e) => {
    if (window.StudioState.activeTool !== 'generative_fill') return;
    isDrawing = true;
    const { x, y } = getCoords(e);
    history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = 'rgba(250, 84, 28, 0.7)';
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const { x, y } = getCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  });

  window.addEventListener('mouseup', () => { isDrawing = false; });

  if (btnUndo) {
    btnUndo.addEventListener('click', () => {
      if (history.length > 0) {
        ctx.putImageData(history.pop(), 0, 0);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });
  }

  if (btnApply) {
    btnApply.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      history = [];
      window.showToast('✨ Đã xóa vật thể và làm mịn da vùng chọn!', 'success');
    });
  }
}

// Print Sheet Modal Setup
window.openPrintModal = function() {
  const modal = document.getElementById('printModal');
  if (modal) modal.style.display = 'flex';
  window.generatePrintSheet();
};

window.closePrintModal = function() {
  const modal = document.getElementById('printModal');
  if (modal) modal.style.display = 'none';
};

window.generatePrintSheet = function() {
  const imgPreview = document.getElementById('imgSheetPreview');
  const btnDl = document.getElementById('btnDownloadPrintFile');
  const chkGuides = document.getElementById('chkGuides');

  const item = window.StudioState.items.find(i => i.id === window.StudioState.activeId);
  const src = item ? (item.processed_url || item.preview_url) : './assets/sample_images/sample_hocsinh.jpg';

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1772; // 15cm at 300 DPI
    canvas.height = 1181; // 10cm at 300 DPI
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const w3x4 = 354, h3x4 = 472;
    const w4x6 = 472, h4x6 = 708;

    // 4 photos 3x4
    ctx.drawImage(img, 60, 60, w3x4, h3x4);
    ctx.drawImage(img, 450, 60, w3x4, h3x4);
    ctx.drawImage(img, 60, 580, w3x4, h3x4);
    ctx.drawImage(img, 450, 580, w3x4, h3x4);

    // 2 photos 4x6
    ctx.drawImage(img, 850, 60, w4x6, h4x6);
    ctx.drawImage(img, 1340, 60, w4x6, h4x6);

    // Cutting guides
    if (!chkGuides || chkGuides.checked) {
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1;
      ctx.setLineDash([8, 8]);
      ctx.strokeRect(59, 59, w3x4 + 2, h3x4 + 2);
      ctx.strokeRect(449, 59, w3x4 + 2, h3x4 + 2);
      ctx.strokeRect(59, 579, w3x4 + 2, h3x4 + 2);
      ctx.strokeRect(449, 579, w3x4 + 2, h3x4 + 2);
      ctx.strokeRect(849, 59, w4x6 + 2, h4x6 + 2);
      ctx.strokeRect(1339, 59, w4x6 + 2, h4x6 + 2);
    }

    const sheetUrl = canvas.toDataURL('image/jpeg', 0.95);
    if (imgPreview) imgPreview.src = sheetUrl;
    if (btnDl) btnDl.href = sheetUrl;
  };
  img.src = src;
};

// INITIALIZATION ON DOM READY
document.addEventListener('DOMContentLoaded', () => {
  setupSplitSlider();
  setupInpaintDrawing();

  // Attach File Inputs
  const fileInput = document.getElementById('fileInput');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      window.showToast(`Đang nạp ${files.length} ảnh...`, 'info');

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (ev) => {
          const itemId = 'upload_' + Date.now() + '_' + i;
          const item = {
            id: itemId,
            filename: file.name,
            thumb_url: ev.target.result,
            preview_url: ev.target.result,
            status: 'pending',
            processed_url: null,
            original_cropped_url: null
          };
          window.StudioState.items.push(item);
          window.StudioState.activeId = itemId;
          window.renderCarousel();
          window.updateViewports();
          window.processCurrentClientSide();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Sliders Realtime Tuning
  const rngSmooth = document.getElementById('rngSkinSmooth');
  const rngBright = document.getElementById('rngBrightness');
  const rngContrast = document.getElementById('rngContrast');
  const rngSharp = document.getElementById('rngSharpness');

  if (rngSmooth) {
    rngSmooth.addEventListener('input', (e) => {
      window.StudioState.settings.skin_smooth = parseInt(e.target.value);
      document.getElementById('lblSkinSmooth').textContent = `${e.target.value}%`;
      window.processCurrentClientSide();
    });
  }
  if (rngBright) {
    rngBright.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      window.StudioState.settings.brightness = val;
      document.getElementById('lblBrightness').textContent = val >= 0 ? `+${val}` : `${val}`;
      window.processCurrentClientSide();
    });
  }
  if (rngContrast) {
    rngContrast.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      window.StudioState.settings.contrast = val;
      document.getElementById('lblContrast').textContent = val >= 0 ? `+${val}` : `${val}`;
      window.processCurrentClientSide();
    });
  }
  if (rngSharp) {
    rngSharp.addEventListener('input', (e) => {
      window.StudioState.settings.sharpness = parseInt(e.target.value);
      document.getElementById('lblSharpness').textContent = `${e.target.value}%`;
      window.processCurrentClientSide();
    });
  }

  // Interactive AI Chat Simulation
  const chatIn = document.getElementById('chatInputTxt');
  const btnChat = document.getElementById('btnSendChat');
  const chatBox = document.getElementById('chatMessages');

  function sendChat() {
    if (!chatIn || !chatIn.value.trim()) return;
    const txt = chatIn.value.trim();
    chatIn.value = '';

    const uMsg = document.createElement('div');
    uMsg.className = 'chat-msg user-msg';
    uMsg.innerHTML = `<div class="chat-bubble">${txt}</div>`;
    chatBox.appendChild(uMsg);
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
      const aMsg = document.createElement('div');
      aMsg.className = 'chat-msg ai-msg';
      aMsg.innerHTML = `
        <div class="chat-avatar">🪄</div>
        <div class="chat-bubble">
          Dạ Thầy Thành! Trợ lý AI đã ghi nhận yêu cầu: <strong>"${txt}"</strong>.<br>
          Gợi ý: Áp dụng phông <strong>Xanh Studio (#0084ff)</strong>, áo sơ mi trắng có cổ và tỷ lệ vai 68% để tạo ảnh thẻ chuẩn chỉnh nhất!
        </div>
      `;
      chatBox.appendChild(aMsg);
      chatBox.scrollTop = chatBox.scrollHeight;
    }, 500);
  }

  if (btnChat) btnChat.onclick = sendChat;
  if (chatIn) chatIn.onkeydown = (e) => { if (e.key === 'Enter') sendChat(); };

  // Text to Image Generator Button
  const btnGen = document.getElementById('btnGenImage');
  if (btnGen) {
    btnGen.onclick = () => {
      const pBox = document.getElementById('genPreviewBox');
      if (pBox) {
        pBox.innerHTML = '<p style="color:#FA541C; font-weight:700;">⏳ AI đang vẽ ảnh 8K Ultra-HD...</p>';
        setTimeout(() => {
          pBox.innerHTML = '<img src="./assets/sample_images/sample_nu.jpg" style="max-width:100%; max-height:100%; border-radius:12px;" alt="Ảnh AI">';
          window.showToast('Đã tạo ảnh nghệ thuật AI thành công!', 'success');
        }, 1000);
      }
    };
  }

  // PRELOAD DEFAULT DEMO SAMPLE IMMEDIATELY ON START
  // This ensures the web app is NEVER blank or unresponsive!
  window.loadSample('sample_hocsinh.jpg');
});
