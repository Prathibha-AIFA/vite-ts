# Deploying the Host and Remote Vite Apps to Vercel

This guide shows one clear, step-by-step flow to deploy the two-project setup in this repository to Vercel:

- `remote-app` (Module Federation remote that exposes `remoteEntry.js`)
- `host-app` (Module Federation host that loads the remote via `VITE_REMOTE_APP_URL`)

We recommend deploying the remote first, then the host.

---

## Before you begin (local checks)

1. Ensure both apps build locally:

   - Remote:
     ```powershell
     cd remote-app
     npm install
     npm run build
     ```

   - Host:
     ```powershell
     cd ../host-app
     npm install
     npm run build
     ```

2. Run both locally for quick testing (optional but recommended):

   ```powershell
   # terminal A
   cd remote-app
   npm run dev

   # terminal B
   cd host-app
   npm run dev
   ```

   Visit the host (usually http://localhost:5000) and confirm Book Ticket works after logging in.

---

## Environment variables used (keys)

- `VITE_REMOTE_APP_URL` (host-app) — Full URL to the remote's `remoteEntry.js` (example: `https://remote-app.vercel.app/assets/remoteEntry.js`). This must be set in Vercel for the host project.
- `VITE_REMOTE_ORIGIN` (remote-app) — Optional on remote; defaults are provided for local development.
- `VITE_REMOTE_PORT` / `VITE_HOST_PORT` — Local dev ports only; not required on Vercel.

> Note: Vite prefixes environment variables accessible in the browser with `VITE_`. Do not store secrets in these vars.

---

## Deploying the remote-app to Vercel (step-by-step)

1. Push your repo to a Git provider (GitHub/GitLab/Bitbucket).
2. Go to https://vercel.com and sign in.
3. Click "New Project" → Import Git Repository → choose your repository.
4. In the Import settings, set the Root Directory to `remote-app`.
5. Configure build settings (Vercel often detects Vite automatically):
   - Framework: Vite (or Other)
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add any required Environment Variables for the remote project (usually not necessary for a simple remote). Example (if used):
   - `VITE_REMOTE_ORIGIN` → leave blank for default, or set to production origin.
7. Deploy and wait for the production deployment to finish. Copy the generated production URL (e.g. `https://remote-app-xxxxx.vercel.app`).

8. Confirm `remoteEntry.js` is reachable:

   Visit: `https://<your-remote-domain>/assets/remoteEntry.js`

   If you see JS content (not 404), it's good. If not, check the remote build logs.

---

## Configure and deploy the host-app to Vercel

1. In the Vercel dashboard, create a new Project and import the same repo.
2. Set Root Directory to `host-app`.
3. Before deploying, add the required Environment Variable for production:

   - Key: VITE_REMOTE_APP_URL
   - Value: `https://<your-remote-domain>/assets/remoteEntry.js`
   - Target: Production (and Preview if you want preview deployments to use same remote)

   Example value:
   ```text
   https://remote-app-xxxxx.vercel.app/assets/remoteEntry.js
   ```

4. Build settings for host-app:
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. Deploy the host. When the deployment completes, open the host URL and confirm the app loads and the remote microfrontend is fetched (open DevTools → Network → verify `remoteEntry.js` loads). 

---

## Optional: Deploy via Vercel CLI

1. Install and login with the Vercel CLI:

   ```powershell
   npm i -g vercel
   vercel login
   ```

2. Deploy the remote (from the `remote-app` folder):

   ```powershell
   cd remote-app
   vercel --prod
   ```

   Copy the production URL printed by the CLI.

3. Add the `VITE_REMOTE_APP_URL` env to the host project using the CLI (run from host-app folder):

   ```powershell
   cd ../host-app
   vercel env add VITE_REMOTE_APP_URL production
   # paste the https://<remote-domain>/assets/remoteEntry.js value when prompted
   vercel --prod
   ```

---

## Verification checklist (after host deploy)

- Open host production URL.
- Open DevTools → Network and filter `remoteEntry.js` — confirm it returns 200 and not blocked by CORS.
- If `remoteEntry.js` is 404: verify remote's build and asset path; the default path is `/assets/remoteEntry.js`.
- If `remoteEntry.js` is blocked by CORS: ensure remote's `vercel.json` headers are present and deployed (we added `Access-Control-Allow-Origin: *` for `/assets/*`).

---

## Troubleshooting

- 404 for remoteEntry.js
  - Confirm remote-app built correctly and `dist/assets/remoteEntry.js` exists.
  - Confirm remote project's Vercel deployment served the `assets` folder (Vite default behavior).

- CORS errors when fetching remoteEntry
  - Confirm `remote-app/vercel.json` is present and headers were applied by Vercel (check network response headers).
  - As a temporary workaround, set `Access-Control-Allow-Origin: *` on your CDN/host.

- Wrong remote URL in host
  - Confirm `VITE_REMOTE_APP_URL` in the host project's Environment Variables points to the exact `remoteEntry.js` path.

- Browser still loads old remote
  - Clear cache / do a hard reload. Vercel serves immutable assets but sometimes caching headers require a refresh.

---

## Monorepo note (optional)

If you prefer a single Vercel project to host both apps under different routes (for example, `example.com/remote` and `example.com/`), that requires a more advanced setup with `vercel.json` routing and possibly rewriting asset paths. I can add a recommended `vercel.json` for a monorepo setup if you want that.

---

If you'd like, I can now:

- Add a README snippet inside each app's folder (host-app/README.md and remote-app/README.md). 
- Create a root-level `vercel.json` for monorepo routing (maps host -> `/` and remote -> `/remote`).
- Run `npm run build` locally for both apps and report any build errors.

Which next step do you want me to take?
