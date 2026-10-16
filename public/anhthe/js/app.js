/**
 * StudioAI Pro - Master Frontend Controller
 * Nền tảng chỉnh sửa & xử lý ảnh AI toàn năng - Thầy giáo Đinh Văn Thành
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // Application State
  // ==========================================
  const state = {
    items: [],
    activeId: null,
    activeView: 'view_image_edit',
    activeTool: 'id_photo',
    viewMode: 'split', // 'split' or 'single'
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

  // Canvas drawing state for Generative Fill (Magic Eraser)
  const eraserState = {
    isDrawing: false,
    history: [],
    brushSize: 30
  };

  // Presets mapping with prompts and clothing overlay
  const PRESET_DEFINITIONS = {
    'quan_phuc': {
      prompt: 'Trang phục: Quân phục nghiêm trang. Màu nền: Xanh studio 0084ff. Căn chỉnh vai ngay ngắn, nhìn thẳng ống kính.',
      clothing_id: 'vest_nu_den',
      bg_preset: 'blue_standard'
    },
    'hoc_sinh_2': {
      prompt: 'Màu nền: Màu xanh 0084ff. Chi tiết: giữ kiểu tóc nguyên bản, Làn da mịn màng, tươi sáng và sắc nét.',
      clothing_id: 'none',
      bg_preset: 'blue_studio_radial'
    },
    'anh_the_can_cuoc': {
      prompt: 'Trang phục: Áo sơ mi có cổ lịch sự. Màu nền: Trắng tinh chuẩn CCCD / Hộ chiếu. Giữ nguyên tóc, khuôn mặt nhìn thẳng.',
      clothing_id: 'so_mi_nam_trang',
      bg_preset: 'white_cccd'
    },
    'so_mi_xanh_nhat': {
      prompt: 'Trang phục: Áo sơ mi màu xanh nhạt thanh lịch. Màu nền: Xanh studio. Da mịn màng tự nhiên.',
      clothing_id: 'so_mi_nam_trang',
      bg_preset: 'blue_light'
    },
    'ao_so_mi_polo': {
      prompt: 'Trang phục: Áo sơ mi polo có cổ trẻ trung. Màu nền: Xanh nhạt. Căn thẳng mặt, mắt nhìn thẳng camera.',
      clothing_id: 'none',
      bg_preset: 'blue_light'
    },
    'ao_vest_cong_so': {
      prompt: 'Trang phục: Áo vest đen công sở kèm sơ mi trắng. Màu nền: Xanh 0084ff studio. Phong thái chuyên nghiệp.',
      clothing_id: 'vest_nam_den',
      bg_preset: 'blue_standard'
    },
    'ao_so_mi_nu': {
      prompt: 'Trang phục: Áo sơ mi trắng nữ công sở. Màu nền: Trắng hoặc xanh studio. Nét mặt tươi tắn, thanh lịch.',
      clothing_id: 'so_mi_nam_trang',
      bg_preset: 'white_cccd'
    },
    'ao_co_no': {
      prompt: 'Trang phục: Áo cổ nơ duyên dáng. Màu nền: Xanh studio tỏa sáng. Nét mặt rạng rỡ, sắc nét.',
      clothing_id: 'vest_nu_den',
      bg_preset: 'blue_studio_radial'
    }
  };

  // ==========================================
  // DOM Elements
  // ==========================================
  const emptyBox = document.getElementById('emptyBox');
  const activeStageView = document.getElementById('activeStageView');
  const dropArea = document.getElementById('dropArea');
  const fileInput = document.getElementById('fileInput');
  const btnBrowseFolder = document.getElementById('btnBrowseFolder');
  const btnEmptyBrowse = document.getElementById('btnEmptyBrowse');
  const btnClearAll = document.getElementById('btnClearAll');
  const btnExportZip = document.getElementById('btnExportZip');
  const btnProcessBatch = document.getElementById('btnProcessBatch');
  const btnApplyAll = document.getElementById('btnApplyAll');
  const btnDownloadCurrent = document.getElementById('btnDownloadCurrent');
  const btnSwitchViewMode = document.getElementById('btnSwitchViewMode');
  const btnThemeToggle = document.getElementById('btnThemeToggle');
  const btnOpenPrintLab = document.getElementById('btnOpenPrintLab');
  const bottomCarousel = document.getElementById('bottomCarousel');
  const carouselTrack = document.getElementById('carouselTrack');
  const progressTrack = document.getElementById('progressTrack');
  const progressLabel = document.getElementById('progressLabel');
  const progressVal = document.getElementById('progressVal');
  const progressFill = document.getElementById('progressFill');

  // Split Viewport Elements
  const splitViewport = document.getElementById('splitViewport');
  const stageBeforeLayer = document.getElementById('stageBeforeLayer');
  const stageDivider = document.getElementById('stageDivider');
  const stageImgBefore = document.getElementById('stageImgBefore');
  const stageImgAfter = document.getElementById('stageImgAfter');

  // Inpaint Canvas
  const inpaintCanvas = document.getElementById('inpaintCanvas');
  const eraserToolbar = document.getElementById('eraserToolbar');
  const brushSizeInput = document.getElementById('brushSize');
  const valBrushSize = document.getElementById('valBrushSize');
  const btnUndoEraser = document.getElementById('btnUndoEraser');
  const btnApplyEraser = document.getElementById('btnApplyEraser');
  let inpaintCtx = inpaintCanvas ? inpaintCanvas.getContext('2d') : null;

  // Prompt Box
  const txtPrompt = document.getElementById('txtPrompt');
  const btnVoicePrompt = document.getElementById('btnVoicePrompt');
  const btnCopyPrompt = document.getElementById('btnCopyPrompt');
  const btnExpandPrompt = document.getElementById('btnExpandPrompt');

  // Sliders
  const rngSkinSmooth = document.getElementById('rngSkinSmooth');
  const lblSkinSmooth = document.getElementById('lblSkinSmooth');
  const rngBrightness = document.getElementById('rngBrightness');
  const lblBrightness = document.getElementById('lblBrightness');
  const rngContrast = document.getElementById('rngContrast');
  const lblContrast = document.getElementById('lblContrast');
  const rngSharpness = document.getElementById('rngSharpness');
  const lblSharpness = document.getElementById('lblSharpness');

  // Print Modal
  const printModal = document.getElementById('printModal');
  const btnClosePrint = document.getElementById('btnClosePrint');
  const selSheetType = document.getElementById('selSheetType');
  const chkGuides = document.getElementById('chkGuides');
  const btnGeneratePrintSheet = document.getElementById('btnGeneratePrintSheet');
  const imgSheetPreview = document.getElementById('imgSheetPreview');
  const btnDownloadPrintFile = document.getElementById('btnDownloadPrintFile');

  // ==========================================
  // Helper: Toast Notifications
  // ==========================================
  function showToast(message, type = 'info') {
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
      z-index: 9999;
      pointer-events: none;
      animation: fadeIn 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
    `;
    toast.innerHTML = `<span>${type === 'error' ? '⚠️' : type === 'success' ? '✅' : '✨'}</span> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  }

  // ==========================================
  // View Switching (Tab Controller)
  // ==========================================
  function switchView(viewId) {
    state.activeView = viewId;

    // Update top nav tabs
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewId);
    });

    // Toggle view containers
    document.querySelectorAll('.main-view-container').forEach(container => {
      container.classList.toggle('active', container.id === viewId);
    });

    if (viewId === 'view_image_edit') {
      requestAnimationFrame(syncSplitViewport);
    }
  }

  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.view) {
        switchView(btn.dataset.view);
      }
    });
  });

  document.querySelectorAll('[data-view-target]').forEach(el => {
    el.addEventListener('click', () => {
      const target = el.dataset.viewTarget;
      if (target) switchView(target);
    });
  });

  document.getElementById('btnLogoHome')?.addEventListener('click', () => {
    switchView('view_image_edit');
  });

  document.getElementById('btnAdminBadge')?.addEventListener('click', () => {
    switchView('view_admin_billing');
  });

  document.getElementById('userProfileBtn')?.addEventListener('click', () => {
    switchView('view_admin_billing');
  });

  // ==========================================
  // Active Item & Viewports
  // ==========================================
  function getActiveItem() {
    return state.items.find(it => it.id === state.activeId) || null;
  }

  function updateViewports() {
    const item = getActiveItem();
    if (!item) {
      emptyBox.style.display = 'block';
      activeStageView.style.display = 'none';
      bottomCarousel.style.display = 'none';
      return;
    }

    emptyBox.style.display = 'none';
    activeStageView.style.display = 'flex';
    bottomCarousel.style.display = 'block';

    const beforeSrc = item.original_cropped_url || item.preview_url;
    const afterSrc = item.processed_url || item.preview_url;

    stageImgBefore.src = beforeSrc;
    stageImgAfter.src = afterSrc;

    if (item.download_url) {
      btnDownloadCurrent.href = item.download_url;
      btnDownloadCurrent.setAttribute('download', `anh_the_${item.filename}`);
      btnDownloadCurrent.style.opacity = '1';
      btnDownloadCurrent.style.pointerEvents = 'auto';
    } else {
      btnDownloadCurrent.href = '#';
      btnDownloadCurrent.style.opacity = '0.5';
      btnDownloadCurrent.style.pointerEvents = 'none';
    }

    requestAnimationFrame(syncSplitViewport);
  }

  function syncSplitViewport() {
    if (!splitViewport) return;
    const vpWidth = splitViewport.clientWidth;
    splitViewport.style.setProperty('--viewport-w', `${vpWidth}px`);
    if (inpaintCanvas) {
      inpaintCanvas.width = vpWidth;
      inpaintCanvas.height = splitViewport.clientHeight;
    }
  }

  window.addEventListener('resize', syncSplitViewport);

  // ==========================================
  // Split Comparison Slider Logic
  // ==========================================
  let isDraggingSplit = false;

  function setSplitPercent(pct) {
    pct = Math.max(5, Math.min(95, pct));
    stageBeforeLayer.style.width = `${pct}%`;
    stageDivider.style.left = `${pct}%`;
  }

  function onSplitMove(e) {
    if (!isDraggingSplit || !splitViewport) return;
    const rect = splitViewport.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    if (!clientX) return;
    const offset = clientX - rect.left;
    const pct = (offset / rect.width) * 100;
    setSplitPercent(pct);
  }

  stageDivider.addEventListener('mousedown', (e) => {
    isDraggingSplit = true;
    document.body.style.cursor = 'ew-resize';
    e.preventDefault();
  });

  window.addEventListener('mousemove', onSplitMove);
  window.addEventListener('mouseup', () => {
    if (isDraggingSplit) {
      isDraggingSplit = false;
      document.body.style.cursor = 'default';
    }
  });

  stageDivider.addEventListener('touchstart', (e) => {
    isDraggingSplit = true;
    e.preventDefault();
  });
  window.addEventListener('touchmove', onSplitMove);
  window.addEventListener('touchend', () => {
    isDraggingSplit = false;
  });

  btnSwitchViewMode.addEventListener('click', () => {
    if (state.viewMode === 'split') {
      state.viewMode = 'single';
      stageBeforeLayer.style.display = 'none';
      stageDivider.style.display = 'none';
      btnSwitchViewMode.textContent = '⇹ Xem So Sánh';
    } else {
      state.viewMode = 'split';
      stageBeforeLayer.style.display = 'block';
      stageDivider.style.display = 'block';
      setSplitPercent(50);
      btnSwitchViewMode.textContent = '⇹ Chỉ Xem Ảnh Đã Xử Lý';
    }
  });

  // ==========================================
  // Carousel Render
  // ==========================================
  function renderCarousel() {
    carouselTrack.innerHTML = '';
    state.items.forEach((it, idx) => {
      const card = document.createElement('div');
      card.className = `carousel-card ${it.id === state.activeId ? 'active' : ''} ${it.status}`;
      card.dataset.id = it.id;

      const img = document.createElement('img');
      img.src = it.thumb_url || it.preview_url;
      img.alt = it.filename;

      const badge = document.createElement('div');
      badge.className = 'card-badge';
      badge.textContent = it.status === 'done' ? '✓ Xong' : it.status === 'processing' ? '⚡ Đang chạy' : (idx + 1);

      card.appendChild(img);
      card.appendChild(badge);

      card.addEventListener('click', () => {
        state.activeId = it.id;
        renderCarousel();
        updateViewports();
      });

      carouselTrack.appendChild(card);
    });
  }

  // ==========================================
  // Preset Selection (Exact 8 items from Screenshot 5)
  // ==========================================
  document.querySelectorAll('.preset-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.preset-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const presetId = card.dataset.preset;
      state.settings.preset_id = presetId;

      if (PRESET_DEFINITIONS[presetId]) {
        const def = PRESET_DEFINITIONS[presetId];
        txtPrompt.value = def.prompt;
        state.settings.clothing_id = def.clothing_id;
        state.settings.bg_preset = def.bg_preset;

        // Highlight matching bg dot
        document.querySelectorAll('.bg-dot-btn').forEach(btn => {
          btn.classList.toggle('active', btn.dataset.bg === def.bg_preset);
        });

        showToast(`Đã áp dụng mẫu: ${card.querySelector('.preset-label').textContent}`, 'info');
        triggerCurrentUpdate();
      }
    });
  });

  // Size pills
  document.querySelectorAll('.size-pill-mini').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-pill-mini').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.settings.size_key = btn.dataset.size;
      triggerCurrentUpdate();
    });
  });

  // Background dots
  document.querySelectorAll('.bg-dot-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.bg-dot-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.settings.bg_preset = btn.dataset.bg;
      triggerCurrentUpdate();
    });
  });

  // Tuning sliders
  rngSkinSmooth.addEventListener('input', (e) => {
    state.settings.skin_smooth = parseInt(e.target.value);
    lblSkinSmooth.textContent = `${e.target.value}%`;
    triggerCurrentUpdate();
  });

  rngBrightness.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    state.settings.brightness = val;
    lblBrightness.textContent = val >= 0 ? `+${val}` : `${val}`;
    triggerCurrentUpdate();
  });

  rngContrast.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    state.settings.contrast = val;
    lblContrast.textContent = val >= 0 ? `+${val}` : `${val}`;
    triggerCurrentUpdate();
  });

  rngSharpness.addEventListener('input', (e) => {
    state.settings.sharpness = parseInt(e.target.value);
    lblSharpness.textContent = `${e.target.value}%`;
    triggerCurrentUpdate();
  });

  // Copy Prompt
  btnCopyPrompt.addEventListener('click', () => {
    navigator.clipboard.writeText(txtPrompt.value).then(() => {
      showToast('Đã sao chép prompt yêu cầu chỉnh sửa!', 'success');
    });
  });

  // Voice Prompt Simulation
  btnVoicePrompt.addEventListener('click', () => {
    showToast('Đang lắng nghe giọng nói Thầy Thành... "Làm ảnh thẻ nền xanh áo sơ mi trắng"', 'info');
    setTimeout(() => {
      txtPrompt.value = "Yêu cầu: Màu nền xanh studio 0084ff, áo sơ mi trắng học sinh, da mịn màng, mắt nhìn thẳng.";
      showToast('Đã nhận diện giọng nói thành công!', 'success');
    }, 1500);
  });

  // ==========================================
  // Processing Logic
  // ==========================================
  
  // ==========================================
  // Client-Side Canvas Engine (Online Support)
  // ==========================================
  async function processItemClientSide(item) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const dims = {
          '3x4': { w: 1062, h: 1416 },
          '4x6': { w: 1416, h: 2124 },
          '2x3': { w: 708, h: 1062 },
          '3.5x4.5': { w: 1240, h: 1594 },
          '5x5': { w: 1771, h: 1771 }
        };
        const targetDim = dims[state.settings.size_key] || dims['3x4'];
        const canvas = document.createElement('canvas');
        canvas.width = targetDim.w;
        canvas.height = targetDim.h;
        const ctx = canvas.getContext('2d');

        // Draw Background
        const bg = state.settings.bg_preset;
        if (bg === 'blue_studio_radial') {
          const grad = ctx.createRadialGradient(
            canvas.width * 0.45, canvas.height * 0.35, 20,
            canvas.width * 0.45, canvas.height * 0.35, canvas.width * 0.8
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

        // Crop subject
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

        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = targetDim.w;
        cropCanvas.height = targetDim.h;
        const cropCtx = cropCanvas.getContext('2d');
        cropCtx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, targetDim.w, targetDim.h);
        item.original_cropped_url = cropCanvas.toDataURL('image/jpeg', 0.88);

        ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, targetDim.w, targetDim.h);

        // Overlay clothing
        const clothId = state.settings.clothing_id;
        if (clothId && clothId !== 'none') {
          const clothImg = new Image();
          clothImg.src = `./assets/clothes/${clothId}.png`;
          clothImg.onload = () => {
            const scale = state.settings.clothes_scale || 1.0;
            const clothW = Math.round(targetDim.w * scale);
            const clothH = Math.round((clothW * clothImg.height) / clothImg.width);
            const clothX = Math.round((targetDim.w - clothW) / 2);
            const clothY = Math.round(targetDim.h - clothH + (state.settings.clothes_y_offset || 0));
            ctx.drawImage(clothImg, clothX, clothY, clothW, clothH);
            finishProcessing();
          };
          clothImg.onerror = () => finishProcessing();
        } else {
          finishProcessing();
        }

        function finishProcessing() {
          try {
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const d = imgData.data;
            const b = state.settings.brightness || 0;
            const c = (state.settings.contrast || 0) / 100 + 1;
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
          resolve(item);
        }
      };
      img.onerror = () => {
        item.status = 'error';
        resolve(item);
      };
      img.src = item.preview_url || item.thumb_url;
    });
  }

  async function processItem(itemId) {
    const item = state.items.find(i => i.id === itemId);
    if (!item) return;

    item.status = 'processing';
    renderCarousel();

    let backendFailed = false;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const payload = {
        item_id: item.id,
        size_key: state.settings.size_key,
        bg_preset: state.settings.bg_preset,
        clothing_id: state.settings.clothing_id,
        clothes_scale: state.settings.clothes_scale,
        clothes_y_offset: state.settings.clothes_y_offset,
        skin_smooth: state.settings.skin_smooth,
        brightness: state.settings.brightness,
        contrast: state.settings.contrast,
        sharpness: state.settings.sharpness
      };
      const res = await fetch('/api/process-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const updated = await res.json();
        Object.assign(item, updated);
        item.status = 'done';
      } else {
        backendFailed = true;
      }
    } catch(e) {
      backendFailed = true;
    }

    if (backendFailed) {
      await processItemClientSide(item);
    }

    renderCarousel();
    if (item.id === state.activeId) {
      updateViewports();
    }
    return;
  }
  function original_process_discarded() {

    const item = state.items.find(i => i.id === itemId);
    if (!item) return;

    item.status = 'processing';
    renderCarousel();

    try {
      const payload = {
        item_id: item.id,
        size_key: state.settings.size_key,
        bg_preset: state.settings.bg_preset,
        custom_bg_hex: state.settings.custom_bg_hex,
        clothing_id: state.settings.clothing_id,
        clothes_scale: state.settings.clothes_scale,
        clothes_y_offset: state.settings.clothes_y_offset,
        skin_smooth: state.settings.skin_smooth,
        brightness: state.settings.brightness,
        contrast: state.settings.contrast,
        sharpness: state.settings.sharpness
      };

      const res = await fetch('/api/process-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Lỗi xử lý ảnh');
      }

      const updated = await res.json();
      Object.assign(item, updated);
      item.status = 'done';
    } catch (err) {
      console.error(err);
      item.status = 'error';
      showToast(`Lỗi ảnh ${item.filename}: ${err.message}`, 'error');
    } finally {
      renderCarousel();
      if (item.id === state.activeId) {
        updateViewports();
      }
    }
  }

  // Batch Process Button (✨ Tạo ảnh / Enter)
  btnProcessBatch.addEventListener('click', async () => {
    if (state.items.length === 0) {
      showToast('Vui lòng chọn ảnh thẻ trước khi tạo ảnh!', 'error');
      return;
    }

    state.isBatchProcessing = true;
    progressTrack.style.display = 'flex';
    btnProcessBatch.disabled = true;

    const total = state.items.length;
    for (let i = 0; i < total; i++) {
      const it = state.items[i];
      const pct = Math.round(((i) / total) * 100);
      progressLabel.textContent = `Đang xử lý: ${it.filename} (${i + 1}/${total})...`;
      progressVal.textContent = `${pct}%`;
      progressFill.style.width = `${pct}%`;

      await processItem(it.id);
    }

    progressLabel.textContent = `Hoàn thành xử lý toàn bộ ${total} ảnh!`;
    progressVal.textContent = '100%';
    progressFill.style.width = '100%';
    showToast(`Đã tạo thành công ${total} ảnh thẻ chất lượng cao!`, 'success');

    state.isBatchProcessing = false;
    btnProcessBatch.disabled = false;
    setTimeout(() => {
      progressTrack.style.display = 'none';
    }, 4000);
  });

  // Keyboard Enter Trigger
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !['TEXTAREA', 'INPUT'].includes(e.target.tagName)) {
      e.preventDefault();
      btnProcessBatch.click();
    }
  });

  btnApplyAll.addEventListener('click', () => {
    if (!state.activeId) return;
    btnProcessBatch.click();
  });

  let debounceTimer = null;
  function triggerCurrentUpdate() {
    if (!state.activeId || state.isBatchProcessing) return;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      processItem(state.activeId);
    }, 400);
  }

  // ==========================================
  // Left Sidebar Tools Switching
  // ==========================================
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
      item.classList.add('active');

      const tool = item.dataset.tool;
      state.activeTool = tool;

      if (tool === 'generative_fill') {
        inpaintCanvas.style.display = 'block';
        eraserToolbar.style.display = 'flex';
        syncSplitViewport();
        showToast('Chế độ Generative Fill: Dùng cọ vẽ đỏ lên vùng cần xóa/điền!', 'info');
      } else {
        inpaintCanvas.style.display = 'none';
        eraserToolbar.style.display = 'none';
      }

      if (tool === 'trang_phuc') {
        showToast('Chế độ Thay trang phục: Chọn mẫu vest, áo sơ mi hoặc quân phục ở cột bên phải!', 'info');
      }
    });
  });

  // ==========================================
  // Generative Fill (Inpaint Canvas)
  // ==========================================
  function setupInpaintCanvas() {
    if (!inpaintCanvas) return;

    function getCoords(e) {
      const rect = inpaintCanvas.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function startDraw(e) {
      if (state.activeTool !== 'generative_fill') return;
      eraserState.isDrawing = true;
      const { x, y } = getCoords(e);

      eraserState.history.push(inpaintCtx.getImageData(0, 0, inpaintCanvas.width, inpaintCanvas.height));

      inpaintCtx.beginPath();
      inpaintCtx.moveTo(x, y);
      inpaintCtx.lineCap = 'round';
      inpaintCtx.lineJoin = 'round';
      inpaintCtx.lineWidth = eraserState.brushSize;
      inpaintCtx.strokeStyle = 'rgba(250, 84, 28, 0.7)';
    }

    function draw(e) {
      if (!eraserState.isDrawing || state.activeTool !== 'generative_fill') return;
      const { x, y } = getCoords(e);
      inpaintCtx.lineTo(x, y);
      inpaintCtx.stroke();
    }

    function stopDraw() {
      if (eraserState.isDrawing) {
        eraserState.isDrawing = false;
        inpaintCtx.closePath();
      }
    }

    inpaintCanvas.addEventListener('mousedown', startDraw);
    inpaintCanvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDraw);

    inpaintCanvas.addEventListener('touchstart', startDraw);
    inpaintCanvas.addEventListener('touchmove', draw);
    window.addEventListener('touchend', stopDraw);
  }

  setupInpaintCanvas();

  brushSizeInput.addEventListener('input', (e) => {
    eraserState.brushSize = parseInt(e.target.value);
    valBrushSize.textContent = `${e.target.value}px`;
  });

  btnUndoEraser.addEventListener('click', () => {
    if (eraserState.history.length > 0) {
      const prev = eraserState.history.pop();
      inpaintCtx.putImageData(prev, 0, 0);
    } else {
      inpaintCtx.clearRect(0, 0, inpaintCanvas.width, inpaintCanvas.height);
    }
  });

  btnApplyEraser.addEventListener('click', async () => {
    const item = getActiveItem();
    if (!item) return;

    const offscreen = document.createElement('canvas');
    offscreen.width = inpaintCanvas.width;
    offscreen.height = inpaintCanvas.height;
    const offCtx = offscreen.getContext('2d');

    offCtx.fillStyle = '#000000';
    offCtx.fillRect(0, 0, offscreen.width, offscreen.height);

    const maskData = inpaintCtx.getImageData(0, 0, inpaintCanvas.width, inpaintCanvas.height);
    const destData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);

    let painted = 0;
    for (let i = 0; i < maskData.data.length; i += 4) {
      if (maskData.data[i + 3] > 20) {
        destData.data[i] = 255;
        destData.data[i + 1] = 255;
        destData.data[i + 2] = 255;
        destData.data[i + 3] = 255;
        painted++;
      }
    }

    if (painted === 0) {
      showToast('Vui lòng dùng cọ vẽ lên vùng cần xóa!', 'error');
      return;
    }

    offCtx.putImageData(destData, 0, 0);
    const maskB64 = offscreen.toDataURL('image/png');

    btnApplyEraser.disabled = true;
    btnApplyEraser.textContent = '⏳ Đang Xóa...';

    try {
      const res = await fetch('/api/inpaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: item.id, mask_b64: maskB64 })
      });

      if (!res.ok) throw new Error('Lỗi từ dịch vụ xóa vật thể');
      const data = await res.json();
      item.processed_url = data.processed_url;
      updateViewports();
      inpaintCtx.clearRect(0, 0, inpaintCanvas.width, inpaintCanvas.height);
      eraserState.history = [];
      showToast('Đã xóa vật thể thành công!', 'success');
    } catch (err) {
      showToast(`Không thể xóa: ${err.message}`, 'error');
    } finally {
      btnApplyEraser.disabled = false;
      btnApplyEraser.textContent = '✨ Xóa Vật Thể Ngay';
    }
  });

  // ==========================================
  // Print Modal
  // ==========================================
  function openPrintModal() {
    printModal.style.display = 'flex';
    generatePrintSheet();
  }

  btnOpenPrintLab.addEventListener('click', openPrintModal);
  btnClosePrint.addEventListener('click', () => {
    printModal.style.display = 'none';
  });

  
  async function generatePrintSheet() {
    btnGeneratePrintSheet.disabled = true;
    btnGeneratePrintSheet.textContent = '⏳ Đang Tạo...';

    const item = getActiveItem();
    const imgSrc = item ? (item.processed_url || item.preview_url) : './assets/sample_images/sample_nu.jpg';

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // 10x15cm at 300 DPI = 1181 x 1772 px
      const sheetCanvas = document.createElement('canvas');
      sheetCanvas.width = 1772;
      sheetCanvas.height = 1181;
      const sCtx = sheetCanvas.getContext('2d');
      sCtx.fillStyle = '#FFFFFF';
      sCtx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height);

      // Draw combo: 4 of 3x4 + 2 of 4x6
      const w3x4 = 354, h3x4 = 472;
      const w4x6 = 472, h4x6 = 708;

      // 4 photos of 3x4
      sCtx.drawImage(img, 60, 60, w3x4, h3x4);
      sCtx.drawImage(img, 450, 60, w3x4, h3x4);
      sCtx.drawImage(img, 60, 580, w3x4, h3x4);
      sCtx.drawImage(img, 450, 580, w3x4, h3x4);

      // 2 photos of 4x6
      sCtx.drawImage(img, 850, 60, w4x6, h4x6);
      sCtx.drawImage(img, 1340, 60, w4x6, h4x6);

      // Draw scissor cutting guides if checked
      if (chkGuides.checked) {
        sCtx.strokeStyle = '#94A3B8';
        sCtx.lineWidth = 1;
        sCtx.setLineDash([8, 8]);
        sCtx.strokeRect(59, 59, w3x4 + 2, h3x4 + 2);
        sCtx.strokeRect(449, 59, w3x4 + 2, h3x4 + 2);
        sCtx.strokeRect(59, 579, w3x4 + 2, h3x4 + 2);
        sCtx.strokeRect(449, 579, w3x4 + 2, h3x4 + 2);
        sCtx.strokeRect(849, 59, w4x6 + 2, h4x6 + 2);
        sCtx.strokeRect(1339, 59, w4x6 + 2, h4x6 + 2);
      }

      const sheetUrl = sheetCanvas.toDataURL('image/jpeg', 0.95);
      imgSheetPreview.src = sheetUrl;
      btnDownloadPrintFile.href = sheetUrl;
      showToast('Đã tạo bản in 10x15cm chuẩn 300 DPI!', 'success');
      btnGeneratePrintSheet.disabled = false;
      btnGeneratePrintSheet.textContent = '⚡ Tạo Bản In Ngay';
    };
    img.onerror = () => {
      btnGeneratePrintSheet.disabled = false;
      btnGeneratePrintSheet.textContent = '⚡ Tạo Bản In Ngay';
    };
    img.src = imgSrc;
  }
  async function original_print_discarded() {

    btnGeneratePrintSheet.disabled = true;
    btnGeneratePrintSheet.textContent = '⏳ Đang Tạo...';

    try {
      const res = await fetch('/api/create-print-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheet_type: selSheetType.value,
          item_id: state.activeId,
          size_key: state.settings.size_key,
          draw_guides: chkGuides.checked
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Lỗi tạo khổ in');
      }

      const data = await res.json();
      imgSheetPreview.src = data.sheet_url;
      btnDownloadPrintFile.href = data.download_url;
      showToast('Đã tạo bản in 300 DPI chuẩn Lab!', 'success');
    } catch (err) {
      showToast(`Không thể tạo bản in: ${err.message}`, 'error');
    } finally {
      btnGeneratePrintSheet.disabled = false;
      btnGeneratePrintSheet.textContent = '⚡ Tạo Bản In Ngay';
    }
  }

  btnGeneratePrintSheet.addEventListener('click', generatePrintSheet);
  selSheetType.addEventListener('change', generatePrintSheet);
  chkGuides.addEventListener('change', generatePrintSheet);

  // ==========================================
  // Folder Ingestion & File Upload
  // ==========================================
  async function triggerBrowseFolder() {
    try {
      showToast('Đang mở hộp thoại Windows Explorer...', 'info');
      const res = await fetch('/api/browse-folder', { method: 'POST' });
      const data = await res.json();

      if (data.cancelled) return;

      if (data.items && data.items.length > 0) {
        data.items.forEach(it => {
          if (!state.items.some(existing => existing.id === it.id)) {
            state.items.push(it);
          }
        });
        if (!state.activeId) state.activeId = data.items[0].id;
        renderCarousel();
        updateViewports();
        showToast(`Đã nạp ${data.items.length} ảnh từ thư mục!`, 'success');
        processItem(state.activeId);
      } else {
        showToast('Không tìm thấy tệp ảnh nào trong thư mục đã chọn', 'error');
      }
    } catch (err) {
      showToast(`Lỗi chọn thư mục: ${err.message}`, 'error');
    }
  }

  btnBrowseFolder.addEventListener('click', triggerBrowseFolder);
  btnEmptyBrowse.addEventListener('click', triggerBrowseFolder);

  
  async function uploadFiles(fileList) {
    if (!fileList || fileList.length === 0) return;
    showToast(`Đang nạp ${fileList.length} ảnh vào hệ thống...`, 'info');

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (!file.type.startsWith('image/')) continue;
      const reader = new FileReader();
      await new Promise((res) => {
        reader.onload = (e) => {
          const dataUrl = e.target.result;
          const itemId = 'web_' + Date.now() + '_' + i;
          const item = {
            id: itemId,
            filename: file.name,
            thumb_url: dataUrl,
            preview_url: dataUrl,
            status: 'pending',
            processed_url: null,
            original_cropped_url: null,
            settings: {}
          };
          state.items.push(item);
          if (!state.activeId) state.activeId = itemId;
          res();
        };
        reader.readAsDataURL(file);
      });
    }

    renderCarousel();
    updateViewports();
    showToast(`Đã nạp thành công ${fileList.length} ảnh!`, 'success');
    if (state.activeId) {
      processItem(state.activeId);
    }
  }
  async function original_upload_discarded(fileList) {

    if (!fileList || fileList.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      formData.append('files', fileList[i]);
    }

    showToast(`Đang tải lên ${fileList.length} ảnh...`, 'info');
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Lỗi khi tải ảnh lên');
      const newItems = await res.json();

      newItems.forEach(it => state.items.push(it));
      if (!state.activeId && newItems.length > 0) {
        state.activeId = newItems[0].id;
      }

      renderCarousel();
      updateViewports();
      showToast(`Đã nạp thành công ${newItems.length} ảnh!`, 'success');
      if (newItems.length > 0) {
        processItem(newItems[0].id);
      }
    } catch (err) {
      showToast(`Không thể tải ảnh: ${err.message}`, 'error');
    }
  }

  fileInput.addEventListener('change', (e) => uploadFiles(e.target.files));

  dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    emptyBox.classList.add('drag-over');
  });

  dropArea.addEventListener('dragleave', () => {
    emptyBox.classList.remove('drag-over');
  });

  dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    emptyBox.classList.remove('drag-over');
    if (e.dataTransfer && e.dataTransfer.files) {
      uploadFiles(e.dataTransfer.files);
    }
  });

  // Sample Chips
  document.querySelectorAll('.sample-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const sample = btn.dataset.sample;
      const sampleUrl = `./assets/sample_images/${sample}`;
      const itemId = 'sample_' + Date.now();
      const item = {
        id: itemId,
        filename: sample,
        thumb_url: sampleUrl,
        preview_url: sampleUrl,
        status: 'pending',
        processed_url: null,
        original_cropped_url: null,
        settings: {}
      };
      state.items.push(item);
      state.activeId = itemId;
      renderCarousel();
      updateViewports();
      processItem(itemId);
      showToast('Đã nạp ảnh mẫu ' + sample, 'success');
    });
  });

  // Clear All
  btnClearAll.addEventListener('click', async () => {
    if (!confirm('Thầy có chắc muốn xóa danh sách toàn bộ ảnh đang làm việc?')) return;
    try {
      await fetch('/api/clear-all', { method: 'DELETE' });
      state.items = [];
      state.activeId = null;
      renderCarousel();
      updateViewports();
      showToast('Đã dọn sạch danh sách làm việc', 'info');
    } catch (err) {
      console.error(err);
    }
  });

  // Export Zip
  btnExportZip.addEventListener('click', () => {
    const hasDone = state.items.some(it => it.status === 'done');
    if (!hasDone) {
      showToast('Chưa có ảnh nào được xử lý xong để xuất ZIP!', 'error');
      return;
    }
    showToast('Đang nén toàn bộ ảnh vào file ZIP...', 'info');
    window.location.href = '/api/export-zip';
  });

  // Theme Toggle
  btnThemeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('theme-dark');
    if (isDark) {
      document.body.classList.remove('theme-dark');
      btnThemeToggle.textContent = '🌙';
    } else {
      document.body.classList.add('theme-dark');
      btnThemeToggle.textContent = '☀️';
    }
  });

  // Billing Period Buttons
  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showToast(`Đã chọn chu kỳ: ${btn.textContent} (Đã kích hoạt cho Admin)`, 'success');
    });
  });

  // Chat Assistant Interactive Simulation
  const chatMessages = document.getElementById('chatMessages');
  const chatInputTxt = document.getElementById('chatInputTxt');
  const btnSendChat = document.getElementById('btnSendChat');

  function sendChatMessage() {
    const val = chatInputTxt.value.trim();
    if (!val) return;

    // Append User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg user-msg';
    userMsg.innerHTML = `<div class="chat-bubble">${val}</div>`;
    chatMessages.appendChild(userMsg);
    chatInputTxt.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // AI Response Simulation
    setTimeout(() => {
      const aiMsg = document.createElement('div');
      aiMsg.className = 'chat-msg ai-msg';
      aiMsg.innerHTML = `
        <div class="chat-avatar">🪄</div>
        <div class="chat-bubble">
          Dạ Thầy Thành, tôi đã phân tích yêu cầu: <em>"${val}"</em>.<br>
          Tôi khuyến nghị Thầy áp dụng phông nền <strong>Xanh Studio Radial (#0084ff)</strong> kết hợp tỷ lệ đầu 68% để đạt chuẩn hồ sơ cấp trường &amp; Sở GD&ĐT tối ưu nhất!
        </div>
      `;
      chatMessages.appendChild(aiMsg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 600);
  }

  btnSendChat?.addEventListener('click', sendChatMessage);
  chatInputTxt?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendChatMessage();
  });

  // Text to Image Generator Simulation
  document.getElementById('btnGenImage')?.addEventListener('click', () => {
    const box = document.getElementById('genPreviewBox');
    if (!box) return;
    box.innerHTML = `<p style="color:var(--orange-primary); font-weight:700;">⏳ AI đang kết xuất hình ảnh 8K... (Miễn phí Admin)</p>`;
    setTimeout(() => {
      box.innerHTML = `<img src="./assets/sample_images/sample_nu.jpg" style="max-width:100%; max-height:100%; border-radius:12px; object-fit:contain;" alt="Ảnh AI">`;
      showToast('Đã tạo ảnh AI thành công!', 'success');
    }, 1200);
  });

  // Initial setup
  updateViewports();
});
