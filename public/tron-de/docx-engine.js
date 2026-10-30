/**
 * TRỘN ĐỀ KIỂM TRA CÁC MÔN PRO - BẢN WEB
 * Engine bóc tách, xáo trộn và đóng gói tệp .docx chuẩn Bộ GD&ĐT
 * Tác giả: Thầy giáo Đinh Văn Thành (0915.213717) - dekiemtraso.com
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jszip'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jszip'));
  } else {
    root.DocxShufflerEngine = factory(root.JSZip);
  }
})(typeof self !== 'undefined' ? self : this, function (JSZip) {
  'use strict';

  // Helper để sinh chuỗi ngẫu nhiên
  function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Lớp Question biểu diễn 1 câu hỏi
  class ExamQuestion {
    constructor(originalIndex, rawParagraphs = [], textContent = '') {
      this.originalIndex = originalIndex;
      this.rawParagraphs = rawParagraphs; // Danh sách các node XML <w:p> hoặc <w:tbl>
      this.textContent = textContent;
      this.questionType = 'MCQ'; // MCQ, TF (Đúng/Sai), ESSAY (Tự luận)
      this.options = []; // [{ key: 'A', text: '...', originalKey: 'A', isCorrect: false }]
      this.originalCorrectAnswer = '';
      this.hasMath = false;
      this.hasImage = false;
    }
  }

  class DocxShuffler {
    constructor() {
      this.zip = null;
      this.docXml = null;
      this.docDom = null;
      this.questions = [];
      this.headerNodes = [];
      this.footerNodes = [];
      this.detectedSubject = 'Đề kiểm tra';
      this.detectedMaDe = '101';
      this.originalFileName = '';
    }

    /**
     * Nạp và phân tích tệp .docx (dưới dạng ArrayBuffer hoặc File)
     */
    async loadAndParse(fileOrBuffer, fileName = 'de_kiem_tra.docx') {
      this.originalFileName = fileName;
      this.zip = await JSZip.loadAsync(fileOrBuffer);
      const docXmlFile = this.zip.file('word/document.xml');
      if (!docXmlFile) {
        throw new Error('Tệp không đúng định dạng Word (.docx): Thiếu word/document.xml');
      }

      this.docXml = await docXmlFile.async('string');
      const parser = new DOMParser();
      this.docDom = parser.parseFromString(this.docXml, 'application/xml');

      const parseError = this.docDom.querySelector('parsererror');
      if (parseError) {
        throw new Error('Lỗi giải mã cấu trúc XML Word: ' + parseError.textContent);
      }

      this._extractStructure();
      return {
        fileName: this.originalFileName,
        totalQuestions: this.questions.length,
        mcqCount: this.questions.filter(q => q.questionType === 'MCQ').length,
        tfCount: this.questions.filter(q => q.questionType === 'TF').length,
        essayCount: this.questions.filter(q => q.questionType === 'ESSAY').length,
        detectedSubject: this.detectedSubject,
        detectedMaDe: this.detectedMaDe,
        questions: this.questions
      };
    }

    /**
     * Bóc tách câu hỏi, công thức, hình ảnh, đáp án từ document.xml
     */
    _extractStructure() {
      const body = this.docDom.querySelector('w\\:body, body');
      if (!body) throw new Error('Không tìm thấy thẻ <w:body> trong file Word');

      const children = Array.from(body.children);
      this.questions = [];
      this.headerNodes = [];
      this.footerNodes = [];

      let firstQuestionFound = false;
      let currentQuestionNodes = [];
      let currentQIndex = 0;

      // Regex nhận diện câu hỏi
      const qRegex = /^(?:Câu|Bài|Question|Cau|câu|bài)\s*(\d+)[\s.:\-–]/i;

      for (let i = 0; i < children.length; i++) {
        const node = children[i];
        const nodeName = node.nodeName;

        // Nếu là phần kết trang cuối cùng (sectPr)
        if (nodeName === 'w:sectPr' || nodeName === 'sectPr') {
          this.footerNodes.push(node);
          continue;
        }

        const text = node.textContent.trim();
        const match = text.match(qRegex);

        if (match) {
          firstQuestionFound = true;
          // Lưu câu hỏi trước đó nếu có
          if (currentQuestionNodes.length > 0) {
            this._finalizeQuestion(currentQIndex, currentQuestionNodes);
            currentQuestionNodes = [];
          }
          currentQIndex = parseInt(match[1], 10) || (this.questions.length + 1);
          currentQuestionNodes.push(node);
        } else {
          if (!firstQuestionFound) {
            this.headerNodes.push(node);
            // Thử nhận diện môn học và mã đề từ tiêu đề
            if (/môn|môn học|mon/i.test(text) && !this.detectedSubject) {
              const subMatch = text.match(/môn[:\s]+([^–\-\n.]+)/i);
              if (subMatch) this.detectedSubject = subMatch[1].trim();
            }
            if (/mã đề|made|ma de/i.test(text)) {
              const codeMatch = text.match(/(?:mã đề|made|ma de)[:\s]*(\d+)/i);
              if (codeMatch) this.detectedMaDe = codeMatch[1].trim();
            }
          } else {
            currentQuestionNodes.push(node);
          }
        }
      }

      // Lưu câu hỏi cuối cùng
      if (currentQuestionNodes.length > 0) {
        this._finalizeQuestion(currentQIndex, currentQuestionNodes);
      }
    }

    _finalizeQuestion(index, nodes) {
      const fullText = nodes.map(n => n.textContent).join('\n');
      const q = new ExamQuestion(index, nodes, fullText);

      // Kiểm tra công thức và hình vẽ
      const xmlStr = nodes.map(n => new XMLSerializer().serializeToString(n)).join(' ');
      q.hasMath = /<m:oMath|<m:oMathPara|<w:object|<oleApp/i.test(xmlStr);
      q.hasImage = /<w:drawing|<v:shape|<v:imagedata/i.test(xmlStr);

      // Phân loại câu hỏi & bóc tách phương án
      this._parseQuestionOptions(q, nodes);
      this.questions.push(q);
    }

    _parseQuestionOptions(q, nodes) {
      // Nhận diện Đúng/Sai: ý a), b), c), d)
      if (/[a-d]\)\s*|\([a-d]\)\s*/i.test(q.textContent) && /Đúng|Sai|đúng|sai/i.test(q.textContent)) {
        q.questionType = 'TF';
      }

      // Nhận diện MCQ tiêu chuẩn A, B, C, D
      const optKeys = ['A', 'B', 'C', 'D'];
      const optRegex = /(?:^|[\s\t])([A-D])[\.\:\)]\s*/g;
      
      let match;
      const combinedText = q.textContent;

      // Tìm vị trí các phương án
      const optPositions = [];
      while ((match = optRegex.exec(combinedText)) !== null) {
        optPositions.push({
          key: match[1].toUpperCase(),
          index: match.index,
          length: match[0].length
        });
      }

      // Kiểm tra đáp án đúng (từ màu đỏ #FF0000 hoặc chữ in đậm)
      let detectedCorrect = '';

      for (const node of nodes) {
        // Tìm các run có chữ đỏ
        const redRuns = node.querySelectorAll('w\\:r, r');
        for (const run of redRuns) {
          const colorEl = run.querySelector('w\\:color, color');
          const isRed = colorEl && (colorEl.getAttribute('w:val') || colorEl.getAttribute('val') || '').toLowerCase().includes('ff0000');
          const isBold = run.querySelector('w\\:b, b') !== null;
          const rText = run.textContent.trim();

          for (const k of optKeys) {
            const pattern = new RegExp(`^${k}[\\.\\:\\)]`);
            if (pattern.test(rText)) {
              if (isRed || isBold) {
                detectedCorrect = k;
              }
            }
          }
        }
      }

      q.originalCorrectAnswer = detectedCorrect;

      // Bóc tách text phương án
      if (optPositions.length >= 2) {
        q.questionType = 'MCQ';
        for (let i = 0; i < optPositions.length; i++) {
          const cur = optPositions[i];
          const next = optPositions[i + 1];
          const start = cur.index + cur.length;
          const end = next ? next.index : combinedText.length;
          const text = combinedText.substring(start, end).trim();

          q.options.push({
            key: cur.key,
            originalKey: cur.key,
            text: text,
            isCorrect: (cur.key === detectedCorrect),
            isSpecial: /cả\s+[ab]|tất cả\s+các|không\s+có\s+đáp án/i.test(text)
          });
        }
      } else if (q.questionType !== 'TF') {
        q.questionType = 'ESSAY';
      }
    }

    /**
     * Tạo các mã đề mới đã được xáo trộn chuẩn Bộ GD&ĐT
     */
    async generateShuffledExams(options = {}, onProgress = null) {
      const {
        testCodes = ['101', '102', '103', '104'],
        rules = [],
        shuffleOptions = true,
        pinSpecial = true,
        schoolInfo = { agency: '', school: '', teacher: '', schoolYear: '2026 - 2027', level: 'THCS' },
        exportStudent = true,
        exportTeacher = true,
        exportSummary = true
      } = options;

      const outputZip = new JSZip();
      const generatedFiles = [];
      const answerMatrix = {};
      const totalQ = this.questions.length;

      // Xác định dải câu cần đảo
      let activeShuffleRanges = [];
      for (const r of rules) {
        if (r.type === 'shuffle' || r.type === 'shuffle_questions_only') {
          activeShuffleRanges.push([Math.max(1, r.start), Math.min(totalQ, r.end)]);
        }
      }
      if (activeShuffleRanges.length === 0) {
        const mcqCount = this.questions.filter(q => q.questionType === 'MCQ').length || totalQ;
        activeShuffleRanges.push([1, mcqCount]);
      }

      // Duyệt qua từng mã đề
      for (let codeIdx = 0; codeIdx < testCodes.length; codeIdx++) {
        const code = testCodes[codeIdx];
        if (onProgress) onProgress(`Đang xáo trộn Mã đề ${code} (${codeIdx + 1}/${testCodes.length})...`);

        // Sao chép danh sách câu hỏi
        let currentExamQuestions = this.questions.map(q => {
          return {
            ...q,
            options: q.options.map(opt => ({ ...opt }))
          };
        });

        // 1. Đảo vị trí câu hỏi theo các khoảng đã chọn
        for (const [startQ, endQ] of activeShuffleRanges) {
          const sIdx = startQ - 1;
          const eIdx = endQ - 1;
          if (sIdx < eIdx && sIdx >= 0 && eIdx < currentExamQuestions.length) {
            const subPart = currentExamQuestions.slice(sIdx, eIdx + 1);
            const shuffledSubPart = shuffleArray(subPart);
            for (let k = 0; k < shuffledSubPart.length; k++) {
              currentExamQuestions[sIdx + k] = shuffledSubPart[k];
            }
          }
        }

        // 2. Đảo phương án A, B, C, D trong từng câu nếu được bật
        answerMatrix[code] = {};

        for (let qIdx = 0; qIdx < currentExamQuestions.length; qIdx++) {
          const q = currentExamQuestions[qIdx];
          const newQNum = qIdx + 1;

          if (shuffleOptions && q.questionType === 'MCQ' && q.options.length === 4) {
            const isOptLocked = rules.some(r => (r.type === 'lock_options' || r.type === 'shuffle_questions_only') && newQNum >= r.start && newQNum <= r.end);

            if (!isOptLocked) {
              if (pinSpecial && q.options.some(o => o.isSpecial)) {
                const normalOpts = q.options.slice(0, 3);
                const specialOpt = q.options[3];
                const shuffledNormals = shuffleArray(normalOpts);
                q.options = [...shuffledNormals, specialOpt];
              } else {
                q.options = shuffleArray(q.options);
              }
            }
          }

          // Gán lại key mới A, B, C, D cho các phương án đã đảo
          const keys = ['A', 'B', 'C', 'D'];
          for (let oi = 0; oi < q.options.length; oi++) {
            q.options[oi].newKey = keys[oi] || q.options[oi].key;
            if (q.options[oi].isCorrect) {
              answerMatrix[code][newQNum] = q.options[oi].newKey;
            }
          }
        }

        // 3. Tạo file Word cho Học sinh & Giáo viên
        if (exportStudent) {
          const studentDocxBlob = await this._buildDocxForCode(code, currentExamQuestions, false, schoolInfo);
          const sFileName = `De_${this._cleanBaseName()}_Ma_${code}.docx`;
          outputZip.file(sFileName, studentDocxBlob);
          generatedFiles.push(sFileName);
        }

        if (exportTeacher) {
          const teacherDocxBlob = await this._buildDocxForCode(code, currentExamQuestions, true, schoolInfo);
          const tFileName = `De_${this._cleanBaseName()}_Ma_${code}_DapAn.docx`;
          outputZip.file(tFileName, teacherDocxBlob);
          generatedFiles.push(tFileName);
        }
      }

      // 4. Tạo file Bảng đáp án tổng hợp (N cột song song)
      if (exportSummary) {
        if (onProgress) onProgress('Đang tạo Bảng đáp án tổng hợp N cột song song chuẩn Bộ...');
        const summaryDocxBlob = await this._buildSummaryDocx(testCodes, answerMatrix, schoolInfo);
        const sumFileName = `Bang_Dap_An_Tong_Hop_${this._cleanBaseName()}.docx`;
        outputZip.file(sumFileName, summaryDocxBlob);
        generatedFiles.push(sumFileName);
      }

      if (onProgress) onProgress('Đang nén toàn bộ tệp kết quả vào gói ZIP...');
      const finalZipBlob = await outputZip.generateAsync({ type: 'blob' });

      return {
        zipBlob: finalZipBlob,
        generatedFiles: generatedFiles,
        testCodes: testCodes,
        answerMatrix: answerMatrix
      };
    }

    _cleanBaseName() {
      return (this.originalFileName || 'De_Thi')
        .replace(/\.docx$/i, '')
        .replace(/[\s\-_]+/g, '_')
        .substring(0, 35);
    }

    /**
     * Dựng tài liệu Word hoàn chỉnh cho 1 mã đề
     */
    async _buildDocxForCode(testCode, examQuestions, isTeacherDoc, schoolInfo) {
      const newZip = new JSZip();
      const files = Object.keys(this.zip.files);
      for (const fileName of files) {
        const fileData = await this.zip.files[fileName].async('uint8array');
        newZip.file(fileName, fileData);
      }

      const newDocDom = this.docDom.cloneNode(true);
      const body = newDocDom.querySelector('w\\:body, body');

      while (body.firstChild) {
        body.removeChild(body.firstChild);
      }

      // 1. Thêm Header nodes
      for (const hNode of this.headerNodes) {
        const clonedHeader = hNode.cloneNode(true);
        this._updateHeaderNode(clonedHeader, testCode, schoolInfo);
        body.appendChild(clonedHeader);
      }

      // 2. Thêm từng câu hỏi
      for (let qIdx = 0; qIdx < examQuestions.length; qIdx++) {
        const q = examQuestions[qIdx];
        const newQNum = qIdx + 1;

        for (const pNode of q.rawParagraphs) {
          const clonedP = pNode.cloneNode(true);
          this._updateQuestionParagraph(clonedP, q, newQNum, isTeacherDoc);
          body.appendChild(clonedP);
        }
      }

      // 3. Thêm Footer nodes
      for (const fNode of this.footerNodes) {
        body.appendChild(fNode.cloneNode(true));
      }

      const serializer = new XMLSerializer();
      const newXmlStr = serializer.serializeToString(newDocDom);
      newZip.file('word/document.xml', newXmlStr);

      return await newZip.generateAsync({ type: 'blob' });
    }

    _updateHeaderNode(node, testCode, schoolInfo) {
      const text = node.textContent;

      if (/mã đề|made|ma de/i.test(text)) {
        this._replaceTextInXml(node, /(?:Mã đề|MÃ ĐỀ|Mã Đề|Ma de|MADE)[:\s]*[0-9A-Z_-]*/gi, `Mã đề: ${testCode}`);
      }

      if (schoolInfo.agency && /UBND|SỞ GD|PHÒNG GD/i.test(text)) {
        this._replaceTextInXml(node, /UBND\s+[^\n/]+|SỞ\s+GD&ĐT\s+[^\n/]+/gi, schoolInfo.agency);
      }
      if (schoolInfo.school && /TRƯỜNG/i.test(text)) {
        this._replaceTextInXml(node, /TRƯỜNG\s+[^\n/]+/gi, schoolInfo.school);
      }
    }

    _updateQuestionParagraph(pNode, q, newQNum, isTeacherDoc) {
      const qRegex = /^(?:Câu|Bài|Question|Cau|câu|bài)\s*(\d+)[\s.:\-–]/i;
      const pText = pNode.textContent.trim();

      if (qRegex.test(pText)) {
        this._replaceTextInXml(pNode, /^(?:Câu|Bài|Question|Cau|câu|bài)\s*\d+([\s.:\-–])/i, `Câu ${newQNum}$1`);
      }

      // Tô màu đỏ cho đáp án đúng nếu là bản Giáo viên
      if (isTeacherDoc && q.options && q.options.length > 0) {
        const runs = pNode.querySelectorAll('w\\:r, r');
        for (const r of runs) {
          const rText = r.textContent;
          for (const opt of q.options) {
            if (opt.isCorrect && new RegExp(`^\\s*${opt.newKey || opt.key}[\\.\\:\\)]`).test(rText)) {
              let rPr = r.querySelector('w\\:rPr, rPr');
              if (!rPr) {
                rPr = pNode.ownerDocument.createElementNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'w:rPr');
                r.insertBefore(rPr, r.firstChild);
              }
              let color = rPr.querySelector('w\\:color, color');
              if (!color) {
                color = pNode.ownerDocument.createElementNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'w:color');
                rPr.appendChild(color);
              }
              color.setAttribute('w:val', 'FF0000');
            }
          }
        }
      }
    }

    _replaceTextInXml(node, regex, replacement) {
      const texts = node.querySelectorAll('w\\:t, t');
      for (const t of texts) {
        if (regex.test(t.textContent)) {
          t.textContent = t.textContent.replace(regex, replacement);
        }
      }
    }

    /**
     * Dựng tệp Bảng đáp án tổng hợp chuẩn thể thức Bộ GD&ĐT
     */
    async _buildSummaryDocx(testCodes, answerMatrix, schoolInfo) {
      const summaryZip = new JSZip();
      const files = Object.keys(this.zip.files);
      for (const fileName of files) {
        const fileData = await this.zip.files[fileName].async('uint8array');
        summaryZip.file(fileName, fileData);
      }

      const sumDom = this.docDom.cloneNode(true);
      const body = sumDom.querySelector('w\\:body, body');
      while (body.firstChild) {
        body.removeChild(body.firstChild);
      }

      const totalQ = this.questions.length;
      let tableXml = `
        <w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
          <w:pPr>
            <w:jc w:val="center"/>
            <w:spacing w:before="120" w:after="120"/>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
              <w:b/>
              <w:sz w:val="30"/>
              <w:color w:val="0F172A"/>
            </w:rPr>
            <w:t>BẢNG ĐÁP ÁN TỔNG HỢP CÁC MÃ ĐỀ</w:t>
          </w:r>
        </w:p>
        <w:p xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
          <w:pPr>
            <w:jc w:val="center"/>
            <w:spacing w:after="240"/>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
              <w:i/>
              <w:sz w:val="24"/>
              <w:color w:val="475569"/>
            </w:rPr>
            <w:t>Môn: ${this.detectedSubject || 'Kiểm tra'} • Năm học: ${schoolInfo.schoolYear || '2026 - 2027'}</w:t>
          </w:r>
        </w:p>
      `;

      tableXml += `
        <w:tbl xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
          <w:tblPr>
            <w:tblW w:w="0" w:type="auto"/>
            <w:jc w:val="center"/>
            <w:tblBorders>
              <w:top w:val="single" w:sz="6" w:space="0" w:color="0F172A"/>
              <w:left w:val="single" w:sz="6" w:space="0" w:color="0F172A"/>
              <w:bottom w:val="single" w:sz="6" w:space="0" w:color="0F172A"/>
              <w:right w:val="single" w:sz="6" w:space="0" w:color="0F172A"/>
              <w:insideH w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
              <w:insideV w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
            </w:tblBorders>
          </w:tblPr>
          <w:tr>
            <w:tc>
              <w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="0F2B4D"/><w:tcMar><w:top w:w="120"/><w:bottom w:w="120"/></w:tcMar></w:tcPr>
              <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman"/><w:b/><w:color w:val="FFFFFF"/><w:sz w:val="24"/></w:rPr><w:t>Câu</w:t></w:r></w:p>
            </w:tc>
      `;

      for (const code of testCodes) {
        tableXml += `
          <w:tc>
            <w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="0F2B4D"/><w:tcMar><w:top w:w="120"/><w:bottom w:w="120"/></w:tcMar></w:tcPr>
            <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman"/><w:b/><w:color w:val="FDE047"/><w:sz w:val="24"/></w:rPr><w:t>Mã ${code}</w:t></w:r></w:p>
          </w:tc>
        `;
      }
      tableXml += `</w:tr>`;

      for (let qNum = 1; qNum <= totalQ; qNum++) {
        const isEven = qNum % 2 === 0;
        const fill = isEven ? 'F8FAFC' : 'FFFFFF';
        tableXml += `
          <w:tr>
            <w:tc>
              <w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="${fill}"/><w:tcMar><w:top w:w="80"/><w:bottom w:w="80"/></w:tcMar></w:tcPr>
              <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman"/><w:b/><w:sz w:val="24"/></w:rPr><w:t>${qNum}</w:t></w:r></w:p>
            </w:tc>
        `;
        for (const code of testCodes) {
          const ans = (answerMatrix[code] && answerMatrix[code][qNum]) || '-';
          tableXml += `
            <w:tc>
              <w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="${fill}"/><w:tcMar><w:top w:w="80"/><w:bottom w:w="80"/></w:tcMar></w:tcPr>
              <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman"/><w:b/><w:color w:val="DC2626"/><w:sz w:val="24"/></w:rPr><w:t>${ans}</w:t></w:r></w:p>
            </w:tc>
          `;
        }
        tableXml += `</w:tr>`;
      }

      tableXml += `</w:tbl>`;

      const parser = new DOMParser();
      const parsedElements = parser.parseFromString(`<root xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">${tableXml}</root>`, 'application/xml');
      const children = Array.from(parsedElements.documentElement.children);
      for (const el of children) {
        body.appendChild(sumDom.importNode(el, true));
      }

      for (const fNode of this.footerNodes) {
        body.appendChild(sumDom.importNode(fNode, true));
      }

      const serializer = new XMLSerializer();
      summaryZip.file('word/document.xml', serializer.serializeToString(sumDom));
      return await summaryZip.generateAsync({ type: 'blob' });
    }
  }

  return DocxShuffler;
});
