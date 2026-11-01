// Issues a short-lived signed upload payload for Cloudinary. Admin only.
// Env: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET (server side only).
const crypto = require('crypto');
const FALLBACK_URL = 'https://tugpufzcfnrznowqjtry.supabase.co';
const FALLBACK_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1Z3B1ZnpjZm5yem5vd3FqdHJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxMjA3MjYsImV4cCI6MjEwODY5NjcyNn0.ZnD1aDGMQtWKgyjNapHE2zX63xT3-H_tDvGLTMFmlOo'; // public anon key (same value as public/config.js)

function sb() {
  return { url: process.env.SUPABASE_URL || FALLBACK_URL, anon: process.env.SUPABASE_ANON_KEY || FALLBACK_ANON };
}

async function isAdmin(token) {
  const { url, anon } = sb();
  if (!token || !anon) return false;
  try {
    const r = await fetch(url + '/rest/v1/admins?select=user_id', {
      headers: { apikey: anon, Authorization: 'Bearer ' + token }
    });
    if (!r.ok) return false;
    const rows = await r.json();
    return Array.isArray(rows) && rows.length > 0;
  } catch (_) { return false; }
}

function sign(params, secret) {
  const base = Object.keys(params).sort().map(k => k + '=' + params[k]).join('&');
  return crypto.createHash('sha1').update(base + secret).digest('hex');
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.statusCode = 405; return res.end(JSON.stringify({ error: 'Method not allowed' })); }
  const send = (code, obj) => { res.statusCode = code; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)); };
  const cloud = process.env.CLOUDINARY_CLOUD_NAME, key = process.env.CLOUDINARY_API_KEY, secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret) return send(500, { error: 'Cloudinary is not configured on the server (missing environment variables).' });
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!(await isAdmin(token))) return send(403, { error: 'Admin access required.' });
  const params = {
    allowed_formats: 'jpg,jpeg,png,webp',
    folder: 'portfolio/social',
    invalidate: 'true',
    overwrite: 'false',
    timestamp: Math.floor(Date.now() / 1000)
  };
  send(200, {
    cloud_name: cloud,
    api_key: key,
    upload_url: 'https://res.cloudinary.com/ghibfskd/image/upload/v1793545518/Screenshot_2026-11-01_201318.png/' + cloud + '/image/upload',
    params,
    signature: sign(params, secret)
  });
};
module.exports._sign = sign;
