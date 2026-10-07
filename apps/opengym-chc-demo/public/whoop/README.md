# Local Whoop export

This folder is for a private Whoop CSV export used by the in-app health explorer.

The GitHub repo is public, so `*.csv` here is gitignored and is not pushed.

Expected filenames:

- `physiological_cycles.csv`
- `workouts.csv`
- `journal_entries.csv`
- `sleeps.csv` (optional; sleep fields are already on the physiological export)

You can also import the same files from the Whoop screen in the app. Imported data stays in this browser’s localStorage.
