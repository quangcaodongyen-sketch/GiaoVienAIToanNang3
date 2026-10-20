// Vercel Serverless Function: Dong bo tai khoan hoc sinh xuyen thiet bi (PC <-> Smartphone)
// Ho tro day du khong luu cache, khong bi tre du lieu
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
      const freshUrl = CLOUD_STORAGE_URL + '?_t=' + Date.now();
      const resp = await fetch(freshUrl, {
        cache: 'no-store',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Vercel Serverless)',
          'Cache-Control': 'no-cache'
        }
      });
      if (!resp.ok) {
        return res.status(resp.status).json({ students: [] });
      }
      const data = await resp.json();
      return res.status(200).json(data);
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const bodyPayload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      const resp = await fetch(CLOUD_STORAGE_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Vercel Serverless)'
        },
        body: bodyPayload
      });
      const result = await resp.json();
      return res.status(200).json({ ok: true, result });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error('Loi sync students API:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
