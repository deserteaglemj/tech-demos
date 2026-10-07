# Do not put customer exports here

Whoop CSVs in this folder would be copied into a production build and could become public.

Keep exports in `apps/opengym-chc-demo/.private/whoop/` for local dev only. That folder is gitignored and is served only by the Vite dev server.

Or import the CSVs from the Whoop screen. The import is stored in this browser (IndexedDB) and is not part of the app download.
