// Serves each page's HTML with server-rendered Open Graph / Twitter Card tags
// built from the saved site_settings (and the post, for post pages).
const fs = require('fs');
const path = require('path');
const FALLBACK_URL = 'https://tugpufzcfnrznowqjtry.supabase.co';
const FALLBACK_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1Z3B1ZnpjZm5yem5vd3FqdHJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxMjA3MjYsImV4cCI6MjEwODY5NjcyNn0.ZnD1aDGMQtWKgyjNapHE2zX63xT3-H_tDvGLTMFmlOo'; // public anon key
const PAGES = ['index', 'about', 'interests', 'writing', 'projects', 'accounts', 'contact', 'post'];
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const clean = s => String(s || '').replace(/[*_`#>]/g, '').replace(/\s+/g, ' ').trim();

async function rest(p) {
  const url = process.env.SUPABASE_URL || FALLBACK_URL, anon = process.env.SUPABASE_ANON_KEY || FALLBACK_ANON;
  if (!anon) return null;
  try {
    const r = await fetch(url + '/rest/v1/' + p, { headers: { apikey: anon, Authorization: 'Bearer ' + anon } });
    return r.ok ? await r.json() : null;
  } catch (_) { return null; }
}

function origin(req, s) {
  if (/^https?:\/\//.test(s.seo_site_url || '')) return s.seo_site_url.replace(/\/+$/, '');
  const host = req.headers['x-forwarded-host'] || req.headers.host || '';
  return (req.headers['x-forwarded-proto'] || 'https') + '://' + host;
}

const isUrl = u => /^https?:\/\//.test(u || '');
const withV = (u, v) => (!v || /[?&]v=/.test(u) || /^https?:\/\/res\.cloudinary\.com/.test(u)) ? u : u + (u.includes('?') ? '&' : '?') + 'v=' + encodeURIComponent(v);

function icons(s) {
  const v = s.photo_v || '';
  const pick = (n) => isUrl(s['favicon_' + n]) ? s['favicon_' + n] : withV('/assets/fav/favicon-' + n + '.png', v);
  return [
    '<link rel="icon" type="image/png" sizes="32x32" href="' + esc(pick(32)) + '">',
    '<link rel="icon" type="image/png" sizes="16x16" href="' + esc(pick(16)) + '">',
    '<link rel="icon" type="image/png" sizes="48x48" href="' + esc(pick(48)) + '">',
    '<link rel="apple-touch-icon" sizes="180x180" href="' + esc(pick(180)) + '">'
  ].join('\n');
}

function build(req, page, s, post) {
  const base = origin(req, s);
  const name = s.seo_site_name || s.name || 'Hamza Muhammad';
  let title = s.seo_title || name;
  let desc = s.seo_description || s.tagline || 'Hamza Muhammad is an educator and lifelong learner exploring faith, education, and technology through writing and projects.';
  let img = /^https?:\/\//.test(s.social_image_url || '') ? s.social_image_url : base + '/assets/social-hero.jpg';
  let canon = base + (page === 'index' ? '/' : '/' + page + '.html');
  let type = 'website';
  if (post) {
    title = clean(post.title) + ' · ' + name;
    desc = clean(post.excerpt) || desc;
    if (/^https?:\/\//.test(post.cover_url || '')) img = post.cover_url;
    canon += '?p=' + encodeURIComponent(post.slug);
    type = 'article';
  } else if (page !== 'index') {
    const label = { about: 'About', interests: 'Interests', writing: 'Blog', projects: 'Projects', accounts: 'Accounts', contact: 'Contact', post: 'Post' }[page];
    title = label + ' · ' + name;
    if (!s.seo_description) desc = {
      about: 'The story, direction, and guiding values of Hamza Muhammad, an educator and lifelong learner.',
      interests: 'Quranic studies, education, technology, and the other subjects Hamza Muhammad is exploring.',
      writing: 'Reflections, notes, and lessons from learning and building, by Hamza Muhammad.',
      projects: 'Academies, products, and websites that Hamza Muhammad is currently building.',
      accounts: 'Where to find Hamza Muhammad online.',
      contact: 'Get in touch with Hamza Muhammad about collaboration, education, or technology.'
    }[page] || desc;
  }
  const w = s.social_image_url && !post ? (s.social_image_w || 1200) : 1200;
  const h = s.social_image_url && !post ? (s.social_image_h || 630) : 630;
  const t = [
    '<title>' + esc(title) + '</title>',
    '<meta name="description" content="' + esc(desc) + '">',
    '<link rel="canonical" href="' + esc(canon) + '">',
    '<meta property="og:type" content="' + type + '">',
    '<meta property="og:site_name" content="' + esc(name) + '">',
    '<meta property="og:title" content="' + esc(title) + '">',
    '<meta property="og:description" content="' + esc(desc) + '">',
    '<meta property="og:url" content="' + esc(canon) + '">',
    '<meta property="og:image" content="' + esc(img) + '">',
    '<meta property="og:image:width" content="' + w + '"><meta property="og:image:height" content="' + h + '">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title" content="' + esc(title) + '">',
    '<meta name="twitter:description" content="' + esc(desc) + '">',
    '<meta name="twitter:image" content="' + esc(img) + '">'
  ];
  if (/^@?\w{1,15}$/.test(s.seo_twitter || '')) t.push('<meta name="twitter:site" content="@' + esc(s.seo_twitter.replace('@', '')) + '">');
  return t.join('\n');
}

module.exports = async (req, res) => {
  const q = req.query || Object.fromEntries(new URL(req.url, 'http://x').searchParams);
  const page = PAGES.includes(q.__page) ? q.__page : 'index';
  let html;
  try {
    html = fs.readFileSync(path.join(process.cwd(), 'templates', page + '.html'), 'utf8');
  } catch (e) { res.statusCode = 500; return res.end('Template missing'); }
  const rows = await rest('site_settings?id=eq.1&select=data');
  const s = (rows && rows[0] && rows[0].data) || {};
  let post = null;
  if (page === 'post' && /^[a-z0-9-]+$/.test(q.p || '')) {
    const r = await rest('posts?select=slug,title,excerpt,cover_url&status=eq.published&slug=eq.' + q.p);
    post = r && r[0] || null;
  }
  let tags = build(req, page, s, post) + '\n' + icons(s);
  if (page === 'index') {
    // Server-render the hero photo so the browser never paints a stale default first.
    const photo = withV(isUrl(s.photo) || /^assets\//.test(s.photo || '') ? s.photo : 'assets/hero-cut.webp', s.photo_v);
    const cut = !(s.photo_cut === false || s.photo_cut === 'false' || s.photo_cut === 0);
    html = html
      .replace(/(<img id="photo" src=")[^"]*(")/, '$1' + esc(photo) + '$2')
      .replace('<div class="stage cut">', '<div class="stage ' + (cut ? 'cut' : 'framed') + '">');
    tags += '\n<link rel="preload" as="image" href="' + esc(photo) + '" fetchpriority="high">';
  }
  html = html
    .replace(/<link\s+rel="(?:shortcut )?icon"[^>]*>/gi, '')
    .replace(/<link\s+rel="apple-touch-icon"[^>]*>/gi, '')
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name="description"[^>]*>/i, '')
    .replace(/<meta\s+(?:property="og:|name="twitter:)[^>]*>/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>/i, '')
    .replace(/(<meta\s+charset="utf-8">)/i, '$1\n' + tags.replace(/\$/g, '$$$$'))
    ;
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // Browsers always revalidate; the CDN keeps a page for at most 30 s, so a new photo/favicon shows almost immediately.
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=30, stale-while-revalidate=60');
  res.end(html);
};
