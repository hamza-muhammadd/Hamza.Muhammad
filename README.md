# Hamza Muhammad, portfolio + admin (static site + Supabase)

Architecture: static multi-page HTML (index, about, interests, accounts, contact) on Vercel → Supabase (Postgres + Auth + Storage). Security is enforced by
Row Level Security in the database, so no server code or secret key is exposed in the browser.

## Setup (≈10 min)
1. supabase.com → New project.
2. SQL Editor → paste and run `schema.sql`.
2b. SQL Editor → run `migration_2_posts.sql` (Writing) `migration_3_media.sql` (photo library) and `migration_4_projects.sql` (projects & websites) `migration_5_project_details.sql` (project details sheet) `migration_6_blog.sql` (blog category + photo position) and `migration_7_comments.sql` (blog comments).
3. Authentication → Users → Add user (your email + strong password). Authentication → Providers → Email: disable "Allow new users to sign up".
4. SQL Editor: `insert into admins select id from auth.users where email = 'YOUR_EMAIL';`
5. Project Settings → API: copy Project URL and anon public key into `config.js`.
6. Edit every page’s text, photo and accounts from `/admin.html`.
7. Push this folder to GitHub; Vercel auto-deploys. Open `/admin.html`, sign in, edit, save.

## Domain (hamza-muhammad.online)
Vercel → Project → Settings → Domains → add the domain. Vercel then shows the exact DNS records to add at your registrar. Use those values. HTTPS is issued automatically once DNS resolves.

## Not yet included
Projects, articles, skills, experience CRUD; theme/typography presets; SEO per-page; automated tests; login rate limiting beyond Supabase Auth's built-in limits. Nothing here has been run against a live Supabase project yet.

## Admin login troubleshooting
- Wrong email/password or "Email not confirmed": in Supabase → Authentication → Users, make sure the user is confirmed (or recreate with "Auto Confirm User" ticked).
- After sign-in the page shows "Almost there" with a ready-made SQL line containing your exact user id: run it in the SQL Editor, then press "Check again".
- Blank page / "Fill in config.js": put the Project URL and anon key in `config.js`.


---
## Social Sharing & SEO (Cloudinary), new in this version

**New folder layout (important):**
```
public/      static files served as-is: assets/, admin.html, config.js
templates/   the 8 page templates (index, about, interests, writing, projects, accounts, contact, post)
api/         serverless functions: page.js (adds Open Graph / Twitter tags), cloudinary-sign.js (signed uploads)
vercel.json  routes every page through api/page.js
```
Replace your whole repository with this folder. Delete the old root-level `*.html`, `assets/` and `config.js`, otherwise they will conflict.

**Vercel environment variables** (Project, Settings, Environment Variables, then redeploy):
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET` (server only, never put it in frontend code)

Optional: `SUPABASE_URL`, `SUPABASE_ANON_KEY` (the public values from config.js are used by default).

**Use it:** Admin, then *Social Sharing & SEO*: upload, replace or restore the default image; edit title, description, site name, X handle and site address. Everything is saved in the existing `site_settings` row, so no SQL migration is needed.

**After deploying, check:** open `/` and view source (`og:image` and `twitter:card` present). Upload an image in the admin, refresh the source and confirm the Cloudinary URL. Then paste your link into the Facebook Sharing Debugger (also refreshes WhatsApp and Messenger), LinkedIn Post Inspector, Telegram @WebpageBot and the X card validator.

---
## Hero redesign, favicon sync and caching

- **Hero:** big portrait on the right over a steel circle (the site's existing accent colour), with the "Better every day" glass card under it. Works on desktop, tablet and phone.
- **Photos:** `assets/hero-cut.webp` is your photo with the background removed. In *Admin, Home page, Your photo* you can choose any image. If it has a transparent background it overlaps the circle; any normal photo is shown in a neat circle instead, so the layout can never break. *Edit / crop* now has a "Hero portrait 4:5" frame, and "Transparent" exports a cut-out. *Use default* restores the supplied cut-out.
- **Favicon:** when you save a new hero photo the admin creates 16, 32, 48 and 180 px icons from it (cropped on the face) and stores them in the existing `site` storage bucket, folder `favicons/`. Browser tabs and phone home-screen icons then follow the photo automatically. No new tables or SQL.
- **No stale images:** every upload gets a new file name, every save stores a new version number (`photo_v`), the server writes the hero photo and icons directly into the page HTML (no old-photo flash), pages are never cached by the browser (`max-age=0`) and by the CDN for 30 seconds only. Static files are not cleared on every visit, so speed is unaffected.
