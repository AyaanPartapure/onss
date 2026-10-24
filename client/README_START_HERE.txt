ONSS FRONTEND - CONTRAST & BRAND FIX
===================================

This ZIP contains the CLIENT folder only.
Your Render backend, MongoDB Atlas database, and their files have not been modified.

WHAT CHANGED
------------
- Fixed the CSS bug that replaced the dark dashboard/home/library background with a transparent grid.
- Improved readability: white text on a dark navy banner, dark navy text on white cards.
- Replaced the book icon with a new navy/teal N monogram in the navigation, sidebar, footer, login, registration, password reset, and favicon.
- Changed action buttons to a navy-to-teal gradient.
- Refined homepage copy to describe the product features rather than the redesign.
- Kept current routes, API client, upload/download logic, and backend config.

INSTALL ON WINDOWS
------------------
1. BACK UP your old C:\Projects\onss\client folder.
2. Extract this ZIP.
3. Copy its client folder to C:\Projects\onss\client.
4. Open CMD and enter:

   cd C:\Projects\onss\client
   npm install
   npm run build
   npm run dev

5. Open http://localhost:5173 and check the dashboard and login pages.
6. Deploy only if the build completes successfully and the flows work.

QUALITY NOTES
-------------
- Static syntax check: passed for 27 JS/JSX files.
- Local relative import checks: 67 passed.
- CSS parse check: passed.
- Contrast check for main foreground/background combinations: passed (17.32:1, 14.73:1).
- Full Vite build NOT run successfully here because npm package downloads were unavailable.
- Live API functionality NOT re-tested. Please test before deploying.

If the local page retains old colors, stop the dev server and restart npm run dev,
then hard-refresh the browser (Ctrl+Shift+R).
