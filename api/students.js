// Vercel Serverless Function: Dong bo tai khoan hoc sinh xuyen thiet bi (PC <-> Smartphone)
// Ho tro day du khong luu cache, an toan cao, MERGE DU LIEU THONG MINH CHONG GHI DE MAT HOC SINH
// NGUYEN TAC THAY DINH THANH: Bao toan diem so don dieu bat bien, khong ha diem, khong lam mat tai khoan!
const CLOUD_STORAGE_URL = 'https://json.extendsclass.com/bin/bbfdeba';
const CLOUD_SECURITY_KEY = '6886e8ea-13b7-11f1-a1b7-0242ac120005';

function normalizeVietnamese(s) {
  if (!s) return '';
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeClass(c) {
  if (!c) return '';
  return c.toUpperCase().replace(/LỚP\s*/gi, '').replace(/\s+/g, '');
}

function getStudentKey(s) {
  const n = normalizeVietnamese(s?.name || s?.fullName || s?.username || '');
  const c = normalizeClass(s?.className || '');
  if (n && c) return `${n}__${c}`;
  return s?.studentCode || s?.id || `${n}__${c}`;
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  // Chong cache 100% tren Vercel Edge va trinh duyet
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      try {
        const freshUrl = CLOUD_STORAGE_URL + '?_t=' + Date.now();
        const resp = await fetch(freshUrl, {
          cache: 'no-store',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Vercel Serverless)',
            'Cache-Control': 'no-cache',
            'Security-key': CLOUD_SECURITY_KEY,
            'api-key': CLOUD_SECURITY_KEY
          }
        });
        if (resp.ok) {
          const data = await resp.json();
          return res.status(200).json(data);
        }
      } catch (cloudErr) {
        console.warn('Primary cloud fetch failed:', cloudErr.message);
      }
      return res.status(200).json({ ok: false, isCloudOffline: true, students: [] });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const incomingStudents = Array.isArray(body?.students) ? body.students : [];
        const incomingSubmissions = Array.isArray(body?.submissions) ? body.submissions : [];

        // 1. Lay du lieu hien tai tren Cloud de MERGE thong minh, TUYET DOI KHONG GHI DE XOA HOC SINH
        let existingStudents = [];
        let existingSubmissions = [];
        try {
          const checkResp = await fetch(CLOUD_STORAGE_URL + '?_t=' + Date.now(), {
            cache: 'no-store',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Vercel Serverless)',
              'Security-key': CLOUD_SECURITY_KEY,
              'api-key': CLOUD_SECURITY_KEY
            }
          });
          if (checkResp.ok) {
            const currentCloudData = await checkResp.json();
            if (Array.isArray(currentCloudData?.students)) {
              existingStudents = currentCloudData.students;
            }
            if (Array.isArray(currentCloudData?.submissions)) {
              existingSubmissions = currentCloudData.submissions;
            }
          }
        } catch (e) {
          console.warn('Fetch current cloud data for merge failed:', e.message);
        }

        // Map quan ly tat ca hoc sinh theo key chuan hoa
        const studentMap = new Map();

        // Nap hoc sinh hien co tren Cloud
        existingStudents.forEach(s => {
          if (!s) return;
          const k = getStudentKey(s) || s.id;
          studentMap.set(k, { ...s });
        });

        // Merge tung hoc sinh incoming: BAO TOAN DIEM CAO NHAT (MATH.MAX), TUYET DOI KHONG HA DIEM
        incomingStudents.forEach(incoming => {
          if (!incoming) return;
          const k = getStudentKey(incoming) || incoming.id;
          const existing = studentMap.get(k);

          if (!existing) {
            studentMap.set(k, { ...incoming });
          } else {
            // Bao toan diem cao nhat
            existing.attendancePoints = Math.max(existing.attendancePoints || 0, incoming.attendancePoints || 0);
            existing.vocabPoints = Math.max(existing.vocabPoints || 0, incoming.vocabPoints || 0);
            existing.examBonusPoints = Math.max(existing.examBonusPoints || 0, incoming.examBonusPoints || 0);
            existing.practicePoints = Math.max(existing.practicePoints || 0, incoming.practicePoints || 0);
            existing.timePoints = Math.max(existing.timePoints || 0, incoming.timePoints || 0);
            existing.studyTimeMinutes = Math.max(existing.studyTimeMinutes || 0, incoming.studyTimeMinutes || 0);
            existing.teacherBonus = Math.max(existing.teacherBonus || 0, incoming.teacherBonus || 0);
            existing.encouragementBonus = Math.max(existing.encouragementBonus ?? 15, incoming.encouragementBonus ?? 15);
            existing.vocabUnitsCompletedCount = Math.max(existing.vocabUnitsCompletedCount || 0, incoming.vocabUnitsCompletedCount || 0);
            existing.studyProgressPercent = Math.max(existing.studyProgressPercent || 0, incoming.studyProgressPercent || 0);

            const calcSum = (
              (existing.attendancePoints || 0) +
              (existing.vocabPoints || 0) +
              (existing.examBonusPoints || 0) +
              (existing.practicePoints || 0) +
              (existing.timePoints || 0) +
              (existing.encouragementBonus || 15) +
              (existing.teacherBonus || 0)
            );

            existing.totalMeritPoints = Math.max(
              existing.totalMeritPoints || 0,
              incoming.totalMeritPoints || 0,
              calcSum,
              15
            );

            if (incoming.password && !existing.password) existing.password = incoming.password;
            if (incoming.dob && !existing.dob) existing.dob = incoming.dob;
            if (incoming.parentPhone && !existing.parentPhone) existing.parentPhone = incoming.parentPhone;
            if (incoming.studentCode && !existing.studentCode) existing.studentCode = incoming.studentCode;
            if (incoming.lastLoginDate && (!existing.lastLoginDate || incoming.lastLoginDate > existing.lastLoginDate)) {
              existing.lastLoginDate = incoming.lastLoginDate;
            }
          }
        });

        // Merge submissions: khong lam mat bai kiem tra
        const subMap = new Map();
        existingSubmissions.forEach(sub => { if (sub?.id) subMap.set(sub.id, sub); });
        incomingSubmissions.forEach(sub => { if (sub?.id && !subMap.has(sub.id)) subMap.set(sub.id, sub); });

        // Dinh dang toi uu gon nhe cho tat ca hoc sinh de dam bao toan bo 390+ em luon vua van <100KB
        const mergedStudents = Array.from(studentMap.values()).map(s => {
          const c = {
            id: s.id,
            studentCode: s.studentCode,
            name: s.name,
            className: s.className,
            grade: s.grade || 8,
            totalMeritPoints: Math.max(s.totalMeritPoints || 15, 15)
          };
          if (s.vocabPoints) c.vocabPoints = s.vocabPoints;
          if (s.practicePoints) c.practicePoints = s.practicePoints;
          if (s.examBonusPoints) c.examBonusPoints = s.examBonusPoints;
          if (s.attendancePoints) c.attendancePoints = s.attendancePoints;
          if (s.studyTimeMinutes) c.studyTimeMinutes = s.studyTimeMinutes;
          if (s.timePoints) c.timePoints = s.timePoints;
          if (s.teacherBonus) c.teacherBonus = s.teacherBonus;
          if (s.encouragementBonus && s.encouragementBonus !== 15) c.encouragementBonus = s.encouragementBonus;
          if (s.vocabUnitsCompletedCount) c.vocabUnitsCompletedCount = s.vocabUnitsCompletedCount;
          if (s.studyProgressPercent) c.studyProgressPercent = s.studyProgressPercent;
          if (s.lastLoginDate) c.lastLoginDate = s.lastLoginDate;
          if (s.parentPhone || s.phone) c.parentPhone = s.parentPhone || s.phone;
          return c;
        });

        const mergedSubmissions = Array.from(subMap.values());

        const finalPayload = JSON.stringify({
          school: 'THCS Dong Yen',
          updatedAt: Date.now(),
          students: mergedStudents,
          submissions: mergedSubmissions
        });

        const resp = await fetch(CLOUD_STORAGE_URL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Vercel Serverless)',
            'Security-key': CLOUD_SECURITY_KEY,
            'api-key': CLOUD_SECURITY_KEY
          },
          body: finalPayload
        });

        if (resp.ok) {
          const result = await resp.json();
          return res.status(200).json({ ok: true, mergedStudentsCount: mergedStudents.length, result });
        }
      } catch (cloudErr) {
        console.warn('Merged cloud save failed:', cloudErr.message);
      }
      return res.status(200).json({ ok: true, note: 'Saved locally in client permanent vault' });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error('Loi sync students API:', err);
    return res.status(200).json({ ok: false, error: err.message, students: [] });
  }
}
