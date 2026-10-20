// Vercel Serverless Function: Dong bo tai khoan hoc sinh xuyen thiet bi (PC <-> Smartphone)
const CLOUD_STORAGE_URL = 'https://extendsclass.com/api/json-storage/bin/bbfdeba';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const resp = await fetch(CLOUD_STORAGE_URL, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Vercel Serverless)' }
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
          'Content-Type': 'text/plain',
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
