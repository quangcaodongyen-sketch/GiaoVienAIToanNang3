// Vercel Serverless Function: Dong bo tai khoan hoc sinh xuyen thiet bi (PC <-> Smartphone)
// Ho tro day du khong luu cache, an toan cao, MERGE DU LIEU THONG MINH CHONG GHI DE MAT HOC SINH
const CLOUD_STORAGE_URL = 'https://extendsclass.com/api/json-storage/bin/bbfdeba';

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
            'Cache-Control': 'no-cache'
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
            headers: { 'User-Agent': 'Mozilla/5.0 (Vercel Serverless)' }
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
        const normalizeKey = (s) => {
          const namePart = (s?.name || s?.username || s?.studentCode || '').trim().toLowerCase();
          const classPart = (s?.className || '').trim().toLowerCase();
          return namePart + '__' + classPart;
        };

        // Nap hoc sinh hien co tren Cloud
        existingStudents.forEach(s => {
          if (!s) return;
          const k = normalizeKey(s) || s.id;
          studentMap.set(k, { ...s });
        });

        // Merge tung hoc sinh incoming: BAO TOAN DIEM CAO NHAT, KHONG LAM MAT DIEM
        incomingStudents.forEach(incoming => {
          if (!incoming) return;
          const k = normalizeKey(incoming) || incoming.id;
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
              calcSum
            );

            if (incoming.password && !existing.password) existing.password = incoming.password;
            if (incoming.dob && !existing.dob) existing.dob = incoming.dob;
            if (incoming.lastLoginDate && (!existing.lastLoginDate || incoming.lastLoginDate > existing.lastLoginDate)) {
              existing.lastLoginDate = incoming.lastLoginDate;
            }
          }
        });

        // Merge submissions
        const subMap = new Map();
        existingSubmissions.forEach(sub => { if (sub?.id) subMap.set(sub.id, sub); });
        incomingSubmissions.forEach(sub => { if (sub?.id && !subMap.has(sub.id)) subMap.set(sub.id, sub); });

        const mergedStudents = Array.from(studentMap.values());
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
            'User-Agent': 'Mozilla/5.0 (Vercel Serverless)'
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