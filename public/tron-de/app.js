/**
 * TRỘN ĐỀ KIỂM TRA CÁC MÔN PRO - BẢN WEB
 * Trình điều khiển giao diện người dùng (App Controller)
 * Tác giả: Thầy giáo Đinh Văn Thành - Hotline/Zalo: 0915.213717
 */

document.addEventListener('DOMContentLoaded', () => {
  const engine = new DocxShufflerEngine();

  // State
  let currentFile = null;
  let examData = null;
  let customRules = [];
  let manualLockedQuestions = new Set();
  let manualLockedOptions = new Set();
  let generatedResult = null;

  // DOM Elements
  const fileInput = document.getElementById('file-input');
  const uploadZone = document.getElementById('upload-zone');
  const btnBrowse = document.getElementById('btn-browse');
  const fileStatusText = document.getElementById('file-status-text');
  const fileSummaryBox = document.getElementById('file-summary-box');
  const statSubject = document.getElementById('stat-subject');
  const statCounts = document.getElementById('stat-counts');
  const statFidelity = document.getElementById('stat-fidelity');

  const segNumCodes = document.querySelectorAll('#seg-num-codes .seg-btn');
  const segCodeMode = document.querySelectorAll('#seg-code-mode .seg-btn');
  const entryStartCode = document.getElementById('entry-start-code');
  const entryTestCodes = document.getElementById('entry-test-codes');

  const ruleActionSelect = document.getElementById('rule-action-select');
  const ruleStartInput = document.getElementById('rule-start-input');
  const ruleEndInput = document.getElementById('rule-end-input');
  const btnAddRule = document.getElementById('btn-add-rule');
  const btnResetRules = document.getElementById('btn-reset-rules');
  const rulesBadgesContainer = document.getElementById('rules-badges-container');

  const entryAgency = document.getElementById('entry-agency');
  const entrySchool = document.getElementById('entry-school');
  const entryTeacher = document.getElementById('entry-teacher');
  const entrySchoolYear = document.getElementById('entry-school-year');
  const segSchoolLevel = document.querySelectorAll('#seg-school-level .seg-btn');

  const cbStudent = document.getElementById('cb-student');
  const cbTeacher = document.getElementById('cb-teacher');
  const cbSummary = document.getElementById('cb-summary');

  const btnHero = document.getElementById('btn-hero');
  const heroBtnText = document.getElementById('hero-btn-text');

  const questionsList = document.getElementById('questions-list');
  const questionsCountBadge = document.getElementById('questions-count-badge');
  const terminalView = document.getElementById('terminal-view');
  const successCard = document.getElementById('success-card');
  const successDesc = document.getElementById('success-desc');
  const btnDownloadAll = document.getElementById('btn-download-all');

  // Tab Controllers
  setupTabs('.tab-nav .tab-btn', '.tab-content');
  setupTabs('.right-tabs-nav .right-tab-btn', '.panel-view');

  function setupTabs(navSelector, contentSelector) {
    const btns = document.querySelectorAll(navSelector);
    const contents = document.querySelectorAll(contentSelector);

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        btns.forEach(b => b.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const target = document.getElementById(targetId);
        if (target) target.classList.add('active');
      });
    });
  }

  // Logger
  function log(msg) {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    terminalView.textContent += `[${timeStr}] ${msg}\n`;
    terminalView.scrollTop = terminalView.scrollHeight;
  }

  // =========================================================================
  // 1. XỬ LÝ CHỌN FILE & KÉO THẢ
  // =========================================================================
  btnBrowse.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.value = '';
    fileInput.click();
  });

  uploadZone.addEventListener('click', (e) => {
    if (e.target !== fileInput) {
      fileInput.value = '';
      fileInput.click();
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  });

  // Drag and drop in web
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });

  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
  });

  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  });

  async function handleFileSelected(file) {
    if (!file.name.toLowerCase().endsWith('.docx')) {
      alert('Vui lòng chọn tệp Word định dạng .docx!');
      return;
    }

    currentFile = file;
    fileStatusText.textContent = `⏳ Đang đọc và phân tích: ${file.name}...`;
    fileStatusText.style.color = '#38BDF8';
    log(`► Bắt đầu phân tích tệp: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);

    try {
      examData = await engine.loadAndParse(file, file.name);

      fileStatusText.textContent = `✓ Đã nạp thành công: ${file.name}`;
      fileStatusText.style.color = '#34D399';

      // Cập nhật thẻ tóm tắt
      statSubject.textContent = `✓ Môn: ${examData.detectedSubject || 'Tự động'} • Mã đề gốc: ${examData.detectedMaDe || '101'}`;
      statCounts.textContent = `✓ Tổng số câu: ${examData.totalQuestions} câu (${examData.mcqCount} Trắc nghiệm, ${examData.tfCount} Đúng/Sai, ${examData.essayCount} Tự luận)`;
      
      const mathCount = examData.questions.filter(q => q.hasMath).length;
      const imgCount = examData.questions.filter(q => q.hasImage).length;
      const detectedAnsCount = examData.questions.filter(q => q.originalCorrectAnswer).length;
      statFidelity.textContent = `✓ Nhận diện đáp án: ${detectedAnsCount}/${examData.totalQuestions} câu • Bảo toàn 100%: ${mathCount} câu công thức, ${imgCount} câu hình vẽ.`;

      fileSummaryBox.style.display = 'block';
      questionsCountBadge.textContent = `${examData.totalQuestions} Câu hỏi`;

      // Khởi tạo các ô dải câu
      ruleStartInput.value = '1';
      ruleEndInput.value = examData.mcqCount || examData.totalQuestions;
      customRules = [];
      renderRulesBadges();

      // Render danh sách câu hỏi
      renderQuestionsList();

      log(`✓ Đã nạp thành công ${examData.totalQuestions} câu hỏi.`);
      log(`✓ Nhận diện đáp án đúng: ${detectedAnsCount}/${examData.totalQuestions} câu.`);
      log(`✓ Bảo toàn 100% công thức MathType/OMML (${mathCount} câu) và hình vẽ (${imgCount} câu).`);
    } catch (err) {
      console.error(err);
      fileStatusText.textContent = `✗ Lỗi nạp tệp: ${err.message}`;
      fileStatusText.style.color = '#F87171';
      log(`✗ LỖI: ${err.message}`);
      alert(`Không thể đọc tệp đề thi:\n${err.message}`);
    }
  }

  // =========================================================================
  // 2. RENDER DANH SÁCH CÂU HỎI XEM TRƯỚC
  // =========================================================================
  function renderQuestionsList() {
    if (!examData || examData.questions.length === 0) {
      questionsList.innerHTML = `
        <div class="empty-placeholder">
          <div class="icon">📂</div>
          <p><strong>VUI LÒNG BẤM 'CHỌN ĐỀ KIỂM TRA WORD (.DOCX)' Ở BƯỚC 1</strong><br>
          Để tải đề kiểm tra vào hệ thống phân tích & trộn đề tự động<br><br>
          <span style="color:#FDE047; font-size: 0.78rem;">⚠️ Note: Sản phẩm do AI tạo - Hãy kiểm tra trước khi sử dụng !</span></p>
        </div>
      `;
      return;
    }

    questionsList.innerHTML = '';
    examData.questions.forEach((q, idx) => {
      const qNum = idx + 1;
      const card = document.createElement('div');
      card.className = 'question-card';

      const isPosLocked = manualLockedQuestions.has(qNum);
      const isOptLocked = manualLockedOptions.has(qNum);

      let typeBadge = 'MCQ';
      if (q.questionType === 'TF') typeBadge = 'Đúng/Sai';
      if (q.questionType === 'ESSAY') typeBadge = 'Tự luận';

      let optionsHtml = '';
      if (q.options && q.options.length > 0) {
        optionsHtml = `
          <div class="q-options-grid">
            ${q.options.map(opt => `
              <div class="opt-item ${opt.isCorrect ? 'correct' : ''}">
                <strong>${opt.key}.</strong> ${escapeHtml(opt.text.substring(0, 45))}${opt.text.length > 45 ? '...' : ''}
              </div>
            `).join('')}
          </div>
        `;
      }

      card.innerHTML = `
        <div class="q-header">
          <div class="q-badge">
            <span>${q.hasPrefix ? `${q.prefixWord} ${qNum}` : `${qNum}.`}</span>
            <div class="q-tags">
              <span class="tag-pill">${typeBadge}</span>
              ${q.hasMath ? '<span class="tag-pill">∑ Math</span>' : ''}
              ${q.hasImage ? '<span class="tag-pill">🖼️ Hình</span>' : ''}
              ${q.originalCorrectAnswer ? `<span class="tag-pill correct">Đ/Án: ${q.originalCorrectAnswer}</span>` : ''}
            </div>
          </div>
          <div class="q-actions">
            <button class="btn-pill-action ${isOptLocked ? 'locked' : ''}" data-action="toggle-opt" data-q="${qNum}">
              ${isOptLocked ? '🚫 Khóa ĐA' : '🔀 Đảo ĐA'}
            </button>
            <button class="btn-pill-action ${isPosLocked ? 'locked' : ''}" data-action="toggle-pos" data-q="${qNum}">
              ${isPosLocked ? '🔒 Khóa VT' : '🔓 Vị trí'}
            </button>
          </div>
        </div>
        <div class="q-content">${escapeHtml(q.textContent.substring(0, 160))}${q.textContent.length > 160 ? '...' : ''}</div>
        ${optionsHtml}
      `;

      questionsList.appendChild(card);
    });

    // Gắn sự kiện click cho các nút khóa
    questionsList.querySelectorAll('button[data-action="toggle-opt"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const qNum = parseInt(btn.getAttribute('data-q'), 10);
        if (manualLockedOptions.has(qNum)) {
          manualLockedOptions.delete(qNum);
        } else {
          manualLockedOptions.add(qNum);
        }
        renderQuestionsList();
      });
    });

    questionsList.querySelectorAll('button[data-action="toggle-pos"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const qNum = parseInt(btn.getAttribute('data-q'), 10);
        if (manualLockedQuestions.has(qNum)) {
          manualLockedQuestions.delete(qNum);
        } else {
          manualLockedQuestions.add(qNum);
        }
        renderQuestionsList();
      });
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // =========================================================================
  // 3. THIẾT LẬP MÃ ĐỀ & SỐ LƯỢNG MÃ
  // =========================================================================
  segNumCodes.forEach(btn => {
    btn.addEventListener('click', () => {
      segNumCodes.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      generateCodes();
    });
  });

  segCodeMode.forEach(btn => {
    btn.addEventListener('click', () => {
      segCodeMode.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.getAttribute('data-mode');
      if (mode === '101') {
        entryStartCode.disabled = true;
        entryStartCode.value = '101';
      } else {
        entryStartCode.disabled = false;
        entryStartCode.value = '801';
      }
      generateCodes();
    });
  });

  entryStartCode.addEventListener('input', generateCodes);

  function generateCodes() {
    const activeNumBtn = document.querySelector('#seg-num-codes .seg-btn.active');
    const num = parseInt(activeNumBtn ? activeNumBtn.getAttribute('data-val') : '4', 10);
    const startStr = entryStartCode.value.trim() || '101';
    const startNum = parseInt(startStr, 10);

    const codes = [];
    if (!isNaN(startNum)) {
      for (let i = 0; i < num; i++) {
        codes.push(String(startNum + i));
      }
    } else {
      for (let i = 0; i < num; i++) {
        codes.push(`${startStr}_${i + 1}`);
      }
    }
    entryTestCodes.value = codes.join(', ');
  }

  // =========================================================================
  // 4. QUẢN LÝ QUY TẮC ĐẢO DẢI CÂU
  // =========================================================================
  btnAddRule.addEventListener('click', () => {
    if (!examData) {
      alert('Vui lòng nạp đề Word trước khi thêm quy tắc!');
      return;
    }

    const start = parseInt(ruleStartInput.value, 10);
    const end = parseInt(ruleEndInput.value, 10);
    const action = ruleActionSelect.value;

    if (isNaN(start) || isNaN(end) || start < 1 || end < start) {
      alert('Vui lòng nhập khoảng câu hợp lệ (Từ câu X đến câu Y)!');
      return;
    }

    let type = 'shuffle';
    let label = `🎲 Đảo câu (Đảo ĐA) ${start} - ${end}`;
    if (action === 'shuffle_questions_only') {
      type = 'shuffle_questions_only';
      label = `🔁 Đảo câu (Cố định ĐA) ${start} - ${end}`;
    } else if (action === 'shuffle_options_only') {
      type = 'shuffle_options_only';
      label = `🔀 Chỉ đảo ĐA ${start} - ${end}`;
    } else if (action === 'lock') {
      type = 'lock';
      label = `🔒 Khóa cố định ${start} - ${end}`;
    } else if (action === 'lock_options') {
      type = 'lock_options';
      label = `🚫 Khóa ĐA ${start} - ${end}`;
    }

    customRules.push({ type, start, end, label });
    renderRulesBadges();
    log(`+ Thêm quy tắc: ${label}`);
  });

  btnResetRules.addEventListener('click', () => {
    customRules = [];
    manualLockedQuestions.clear();
    manualLockedOptions.clear();
    renderRulesBadges();
    renderQuestionsList();
    log('↺ Đã xóa hết các quy tắc dải câu đảo.');
  });

  function renderRulesBadges() {
    rulesBadgesContainer.innerHTML = '';
    if (customRules.length === 0) {
      rulesBadgesContainer.innerHTML = '<span style="font-size: 0.76rem; color: #94A3B8; font-style: italic;">* Tự do chọn dải câu: Chọn hành động, nhập "Từ... Đến..." và bấm "+ Thêm dải câu". (Nếu không thêm: Mặc định trộn tất cả trắc nghiệm)</span>';
      return;
    }

    customRules.forEach((rule, idx) => {
      const badge = document.createElement('div');
      badge.className = 'rule-badge';
      badge.innerHTML = `
        <span>${rule.label}</span>
        <button class="remove-btn" title="Xóa quy tắc này" data-idx="${idx}">✕</button>
      `;
      rulesBadgesContainer.appendChild(badge);
    });

    rulesBadgesContainer.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        customRules.splice(idx, 1);
        renderRulesBadges();
      });
    });
  }

  // =========================================================================
  // 5. NÚT HERO BẮT ĐẦU TRỘN ĐỀ
  // =========================================================================
  btnHero.addEventListener('click', async () => {
    if (!examData) {
      alert('Vui lòng chọn đề kiểm tra Word (.docx) ở Bước 1 trước khi bắt đầu!');
      return;
    }

    const testCodesRaw = entryTestCodes.value.trim();
    const testCodes = testCodesRaw.split(/[,;\s]+/).filter(c => c.length > 0);
    if (testCodes.length === 0) {
      alert('Vui lòng nhập ít nhất 1 mã đề!');
      return;
    }

    if (!cbStudent.checked && !cbTeacher.checked && !cbSummary.checked) {
      alert('Vui lòng tích chọn ít nhất 1 loại file xuất bản (Đề HS, Đề GV hoặc Bảng tổng hợp)!');
      return;
    }

    // Tự động chuyển sang tab Nhật ký tiến trình để GV thấy trực quan
    const logTabBtn = document.querySelector('.right-tabs-nav .right-tab-btn[data-target="terminal-view"]');
    if (logTabBtn) logTabBtn.click();

    btnHero.disabled = true;
    heroBtnText.textContent = '⏳ ĐANG TRỘN ĐỀ... (XIN ĐỢI)';
    successCard.classList.remove('active');

    log('==================================================');
    log(`⚡ BẮT ĐẦU TRỘN ĐỀ: ${examData.fileName}`);
    log(`► Danh sách ${testCodes.length} mã đề: ${testCodes.join(', ')}`);
    log(`► Tùy chọn đảo đáp án A, B, C, D: BẬT`);
    log(`► Khóa đáp án đặc biệt ('Cả A và B',...): BẬT`);
    log(`► Số quy tắc dải câu áp dụng: ${customRules.length}`);

    // Ghép các câu khóa thủ công vào rules
    const allRules = [...customRules];
    manualLockedQuestions.forEach(qNum => {
      allRules.push({ type: 'lock', start: qNum, end: qNum, label: `Khóa câu ${qNum}` });
    });
    manualLockedOptions.forEach(qNum => {
      allRules.push({ type: 'lock_options', start: qNum, end: qNum, label: `Khóa ĐA câu ${qNum}` });
    });

    const activeLevelBtn = document.querySelector('#seg-school-level .seg-btn.active');
    const schoolLevel = activeLevelBtn ? activeLevelBtn.getAttribute('data-val') : 'THCS';

    const schoolInfo = {
      agency: entryAgency.value.trim(),
      school: entrySchool.value.trim(),
      teacher: entryTeacher.value.trim(),
      schoolYear: entrySchoolYear.value.trim() || '2026 - 2027',
      level: schoolLevel,
      allowSchoolOverride: false // Bảo toàn 100% nguyên vẹn tiêu đề & trường học của đề gốc, không ghi đè
    };

    try {
      generatedResult = await engine.generateShuffledExams({
        testCodes: testCodes,
        rules: allRules,
        shuffleOptions: true,
        pinSpecial: true,
        schoolInfo: schoolInfo,
        exportStudent: cbStudent.checked,
        exportTeacher: cbTeacher.checked,
        exportSummary: cbSummary.checked
      }, (msg) => {
        log(`► ${msg}`);
      });

      log('--------------------------------------------------');
      log(`🎉 TRỘN ĐỀ THÀNH CÔNG! ĐÃ TẠO ${generatedResult.generatedFiles.length} TỆP TIN.`);
      log('⚠️ Note: Sản phẩm do AI tạo - Hãy kiểm tra trước khi sử dụng !');

      successDesc.textContent = `Đã tạo thành công ${generatedResult.generatedFiles.length} file đề thi và bảng đáp án cho ${testCodes.length} mã đề.`;
      successCard.classList.add('active');

      // Tự động tải về file ZIP
      downloadZip();
    } catch (err) {
      console.error(err);
      log(`✗ LỖI TRỘN ĐỀ: ${err.message}`);
      alert(`Đã xảy ra lỗi khi trộn đề:\n${err.message}`);
    } finally {
      btnHero.disabled = false;
      heroBtnText.textContent = '⚡ BẮT ĐẦU TRỘN ĐỀ NGAY ➔';
    }
  });

  // Tải về file ZIP
  btnDownloadAll.addEventListener('click', downloadZip);

  function downloadZip() {
    if (!generatedResult || !generatedResult.zipBlob) return;
    const baseName = (examData ? examData.fileName : 'De_Thi').replace(/\.docx$/i, '').replace(/[\s\-_]+/g, '_');
    const zipName = `TronDe_${baseName}_${new Date().toISOString().slice(0, 10)}.zip`;

    const url = URL.createObjectURL(generatedResult.zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = zipName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    log(`✓ Đã bắt đầu tải về gói: ${zipName}`);
  }
});
