
# sampleERP

Minimal README describing the sampleERP frontend, what lives where, and how to run it for local development.

## Summary

`sampleERP` is a React + TypeScript frontend scaffolded with Vite. The app is organized into modular pages and components and uses static JSON files inside `src/data/` to emulate API responses for easier local development and demos.

Key characteristics:
- React + TypeScript (TSX)
- Vite dev server with HMR
- Tailwind CSS for styling
- Static JSON data under `src/data/*` used in place of server APIs
- Role-based layouts and sidebars (role stored in `localStorage.user_role`)

## Quick start

1. Install dependencies:

```powershell
npm install
```

2. Run the dev server:

```powershell
npm run dev
```

3. Open the app at: http://localhost:5173/

## File tree (important files)

Top-level

```
package.json
vite.config.ts
index.html
public/           # static assets and images (favicon, logo)
dev-dist/         # generated service worker and precache files
components.json
src/
```

`src/` (high-level)

```
src/
   main.tsx                # app bootstrap
   App.tsx                 # routing and route declarations
   index.css               # global styles
   assets/                 # images and SVGs
   components/             # shared UI components (Sidebar, NavBar, Logo, GlobalLayout)
   pages/                  # page-level routes (role folders, landing pages, auth)
      AuthPages/
         signin/             # (was signin) now landing pages live under src/pages/landing/
         logout/Logout.tsx   # logout component (may call shared helper)
      landing/
         Home.tsx
         About.tsx
         Contact.tsx
      project-manager-page/  # example feature area (products, projects)
   data/                   # static JSON datasets used instead of APIs
      ceo/
         settings/
            users.json
      project-manager-page/
         product/
            products.json
   utils/
      data-json.tsx         # sidebar definitions, getSidebarForRole(), performLogout()
```

## Important codenotes

- Static JSON approach: many parts of the app import JSON from `src/data/...` to emulate server responses (pagination/search/sort are done client-side where needed).
- Sidebar and role handling: `src/utils/data-json.tsx` exports `getSidebarForRole(role)` which returns the sidebar links for a given role. Pages detect the demo role via `localStorage.user_role`.
- Centralized logout: `performLogout(options?)` was added to `src/utils/data-json.tsx` to clear common auth/demo keys (`user_role`, `showReturnPopup`, tokens) and optionally navigate. Import it as a named export: `import { performLogout } from '@/utils/data-json'` or relative path.

## Developer notes / current TODOs

- There is at least one TSX file that contained stray non-code text which will cause the dev server to throw a parse error. If you see a Vite parse error pointing to `SearchablePaginatedProjectDropdown.tsx`, open and remove stray text at the top of that file.
- Some components still reference an `AuthContext` import path that may not exist in the same relative location; if you get "Failed to resolve import '../AuthContext'" adjust the import path to where the AuthContext file actually lives (for example `@/pages/AuthPages/AuthContext`).
- Many dataset edits are in-memory (profile/settings edits); persistence to disk is not implemented for runtime edits.

## How to contribute

- Edit files under `src/`.
- When adding or modifying static API data, add JSON files under `src/data/<role-or-area>/...` and update components to import them as `@/data/...` or relative imports.

## Contact / Support

This repository is a sample/demo and intended for local development. For questions about the sample or getting it running, open an issue or reach out to the maintainer inside your team.

---

Generated on: Aug 23, 2025
