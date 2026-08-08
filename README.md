# Fathi Mohamed — Portfolio + Admin CMS

A React + Vite portfolio site for graphic designer Fathi Mohamed Fahim, with a
custom-built admin panel that edits the site's content directly via GitHub —
no database, no separate backend beyond two small serverless functions for
authentication.

- **Live site:** https://fathimohamedfahim.vercel.app
- **Admin panel:** https://fathimohamedfahim.vercel.app/admin
- **Hosting:** Vercel, auto-deploys on push to `main`

## Stack

- React 18 + Vite 5, no router — a single-page site with anchor-scroll
  navigation, plus a second, separate build entry for the admin panel
  (`admin/index.html` / `src/admin-main.jsx`), configured via
  `vite.config.js`'s `rollupOptions.input`.
- Content lives in `src/data/*.json`, re-exported through thin `.js` wrapper
  files. The admin panel edits these JSON files directly.
- Auth: GitHub OAuth (`repo` scope), via two Vercel serverless functions
  (`api/auth.js`, `api/callback.js`) that keep the OAuth client secret
  server-side. The resulting token is used directly from the browser to call
  GitHub's REST Contents API (`src/admin/github.js`) — every save in the
  admin panel is a real commit straight to `main`, no draft/review step.

## Local development

```bash
npm install
npm run dev       # public site + admin panel, both served by one Vite dev server
npm run build      # production build for both entry points
npm run preview    # serve the production build locally
```

The public site needs no environment variables to run locally. The **admin
panel's login flow** does — see below.

## Environment variables (admin panel login)

The admin panel's GitHub OAuth flow needs a GitHub OAuth App and two
environment variables, set in Vercel (Project Settings → Environment
Variables) for production, or in a local `.env` file (already gitignored)
for local testing against `vercel dev`:

```
GITHUB_CLIENT_ID=your_oauth_app_client_id
GITHUB_CLIENT_SECRET=your_oauth_app_client_secret
```

To create the OAuth App: GitHub → Settings → Developer settings → OAuth
Apps → New OAuth App. Set its **Authorization callback URL** to:

```
https://<your-deployed-domain>/api/callback
```

`api/auth.js` builds the redirect URI from the request's own host header, so
this matches automatically across preview and production Vercel deployments
as long as the callback URL registered with GitHub matches the domain
you're actually testing on.

Note the OAuth scope is `repo` (full read/write access to repos the
authorizing GitHub account has access to) — this is a GitHub classic-OAuth-App
limitation, not something specific to this build. The resulting token is
stored in the browser's `localStorage`.

The admin panel currently expects to write to a specific hardcoded repo
(`OWNER`/`REPO` constants at the top of `src/admin/github.js`) — update
those if forking this project for a different repository.

## Project structure

```
src/
  components/       Public site sections (Header, Hero, Projects, ...)
  data/             Editable content as JSON, + .js re-export wrappers
  hooks/            Shared logic (useScrollToSection, useBodyScrollLock)
  styles/           style.css (public site) — same design tokens power admin.css
  admin/
    AdminApp.jsx    Shell: login screen, tabs, toast/confirm modal rendering
    github.js       GitHub Contents API wrapper (read/write JSON, upload images)
    useJsonFile.js  Shared data-loading hook, with a module-level cache so
                     multiple mounted consumers of the same file (e.g. an
                     editor tab and the Dashboard) share one fetch
    sections/       One component per admin tab
    components/     Shared admin UI (FormField, SaveBar, Toast, ConfirmModal)
api/
  auth.js           Redirects to GitHub's OAuth authorize screen
  callback.js       Exchanges the OAuth code for a token, hands it to the
                     admin app via a postMessage popup handshake
```

## Known limitations (by design, for now)

- No draft/review workflow — admin saves commit straight to `main`.
- No automated tests yet.
- OAuth token scope is repo-wide, stored in `localStorage` — acceptable for
  a single-operator personal CMS, worth revisiting before adding more users.
