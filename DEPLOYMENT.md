# 🚀 Bolo India — Deployment & Sync Guide

This document explains how to deploy, sync, and run the **BOLO INDIA** voice-first web application across different environments including **Emergent Host**, **Vercel**, and **GitHub**.

---

## 1. Deploying to Emergent (`https://work-in-progress-182.emergent.host`)

> [!IMPORTANT]
> `https://work-in-progress-182.emergent.host` is a Cloudflare-hosted container preview URL created by Emergent. 
> Because it is a web preview container rather than an open Git remote endpoint, standard `git push https://work-in-progress-182.emergent.host` is not accepted directly by the web server.

### Option A: Uploading `bolo-india-production.zip` to Emergent
1. In this repository, we have bundled the complete clean source code into:
   `bolo-india-production.zip`
2. Open your Emergent project session for `work-in-progress-182`.
3. Drag and drop `bolo-india-production.zip` into the Emergent file explorer (or upload it).
4. In the Emergent terminal, run:
   ```bash
   unzip -o bolo-india-production.zip -d .
   npm install
   npm run build
   npm start
   ```
5. Your preview URL `https://work-in-progress-182.emergent.host` will immediately refresh with the full Bolo India voice-first platform!

---

## 2. Pushing to GitHub

To push this codebase to your GitHub account (`arpittak027`):

1. Create a repository on GitHub (e.g. `bolo-india` or update `webdev`):
   Go to [https://github.com/new](https://github.com/new) and create a repository named `bolo-india`.

2. Add your GitHub remote:
   ```bash
   git remote add origin https://github.com/arpittak027/bolo-india.git
   ```

3. Push your main branch:
   ```bash
   git branch -M main
   git push -u origin main
   ```

---

## 3. Instant One-Command Live Deployment (Vercel)

For a free, instant, production HTTPS URL with global edge CDN:

```bash
npx vercel
```

- When prompted, accept default settings.
- In ~30 seconds, Vercel provides a live production URL (e.g., `https://bolo-india.vercel.app`).

---

## 4. Local Development

To run the application locally on your machine:

```bash
# Start Next.js development server
npm run dev

# Or start the production server on port 3000
npm run build
npx next start -p 3000
```

Open `http://localhost:3000` in Google Chrome, Microsoft Edge, or Safari to test Web Speech API recognition in real time.
