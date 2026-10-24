# ONSS frontend theme correction

This archive replaces **only the `client` folder**. Backend and MongoDB stay unchanged.

## Fixed

The `.onss-grid` CSS rule in the previous version reset the `background-image`
of `.onss-mesh`, removing the dark banner behind white text. The new `.onss-mesh.onss-grid`
rule composes the dark gradient and grid layers **in the same background-image**, ensuring
readable text on the hero and dashboard. A new ONSS "N" monogram replaces the old book
logo across the interface and favicon.

## Run

```bat
cd C:\Projects\onss\client
npm install
npm run build
npm run dev
```

Test login, dashboard, notes browsing, uploads and downloads before deploying to Vercel.

Note: PDF storage on Render is still temporary. This remains a separate backend issue.
