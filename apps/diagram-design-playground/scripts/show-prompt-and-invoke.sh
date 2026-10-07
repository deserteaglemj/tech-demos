#!/usr/bin/env bash
# Visible "give the prompt to the agent" step for demo recordings.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROMPT_FILE="$ROOT/PROMPT.md"
OUT="$ROOT/output/tech-demo-pipeline.html"
MARKER="$ROOT/output/.agent-run-requested"

clear
echo "============================================================"
echo " DIAGRAM DESIGN — giving the prompt to a Cursor agent"
echo "============================================================"
echo
echo "Skill:  $ROOT/.agents/skills/diagram-design/"
echo "Host:   Cursor cloud agent (subagent, claude-sonnet-5)"
echo
echo "-------------------- PROMPT.md (exact text) ----------------"
echo
sed 's/^/  /' "$PROMPT_FILE"
echo
echo "------------------------------------------------------------"
echo
echo "→ Submitting this prompt to the agent now…"
date -u +"  at %Y-%m-%dT%H:%M:%SZ"
echo
# Marker the parent agent / recorder watches; parent launches the Task agent.
mkdir -p "$ROOT/output"
printf '%s\n' "requested_at=$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$MARKER"
echo "  wrote $MARKER"
echo
echo "→ Waiting for agent to rewrite:"
echo "  $OUT"
echo
# Poll until the HTML is newer than the marker (or timeout).
for i in $(seq 1 120); do
  if [[ -f "$OUT" && "$OUT" -nt "$MARKER" ]]; then
    echo
    echo "✓ Agent finished. Output updated:"
    ls -la "$OUT"
    echo
    echo "Open: http://127.0.0.1:5173/output/tech-demo-pipeline.html"
    exit 0
  fi
  printf '  …agent working (%ss)\r' "$i"
  sleep 1
done
echo
echo "✗ Timed out waiting for agent output." >&2
exit 1
