ONSS FRONTEND: UPLOAD UX + PALETTE REFRESH
=========================================
This complete client/ folder was based on the previously approved
ONSS_Frontend_Contrast_Logo_Fixed.zip. No server or database files changed.

Changed files:
  src/pages/AddNotePage.jsx
    - Navy and teal header matches the home/dashboard style.
    - Two clear sections: note details and documents.
    - Accessible file selectors with drag-and-drop, file removal and feedback.
    - File formats: PDF, DOC, DOCX; maximum 25MB per file.
    - Existing backend field names unchanged: notesTitle, subject,
      notesDescription, file1, file2, file3, file4.
    - Optional subject suggestions from the existing /api/notes/categories.
    - Live summary of entered fields and attached files.
    - Upload progress, error/success feedback and navigation preserved.
    - No cloud/file storage changes.
  src/components/DashboardLayout.jsx
    - Small colour/accessibility refinements; on upload page top right
      action links to My notes rather than the current page again.
  src/index.css
    - Global brand accent refined from indigo to navy/teal.
    - Dark gradient and contrast fixes preserved.
  tailwind.config.js
    - Updated brand palette to teal; standardised DM Sans body font.

HOW TO TEST LOCALLY
1. Back up the existing C:\Projects\onss\client folder.
2. Replace only client/ with the folder in this ZIP (NOT server/).
3. In Windows CMD run:
     cd C:\Projects\onss\client
     npm install
     npm run build
     npm run dev
4. Open http://localhost:5173/notes/new after signing in.
5. Test file chooser, drag/drop, remove, validation, publication,
   then check Manage Notes for your uploaded entry.
6. Deploy to Vercel only after local production build and flows succeed.

NOTE ON STORAGE
Current Render disk storage is ephemeral. This frontend update cannot
recover old missing files or make backend file storage persistent.

VALIDATION
JSX parser + relative imports checks pass; production build and
live upload/browser tests still require npm dependencies and backend.
