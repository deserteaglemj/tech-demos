import { useCallback, useEffect, useState } from "react";
import { loadWhoop, saveWhoop, whoopAutoloadAllowed } from "../lib/vault";
import { parseWhoop, type WhoopBundle } from "./parse";

const FILES = {
  cycles: "/whoop/physiological_cycles.csv",
  workouts: "/whoop/workouts.csv",
  journal: "/whoop/journal_entries.csv",
} as const;

async function fetchText(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(String(response.status));
  return response.text();
}

export function useWhoop() {
  const [bundle, setBundle] = useState<WhoopBundle | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");
  const [error, setError] = useState("");

  const adopt = useCallback((next: WhoopBundle) => {
    void saveWhoop(next);
    setBundle(next);
    setStatus("ready");
    setError("");
  }, []);

  const reload = useCallback(async () => {
    const stored = await loadWhoop();
    if (stored) {
      setBundle(stored);
      setStatus("ready");
      return;
    }
    if (!(await whoopAutoloadAllowed())) {
      setBundle(null);
      setStatus("missing");
      return;
    }
    try {
      const [cycles, workouts, journal] = await Promise.all([
        fetchText(FILES.cycles),
        fetchText(FILES.workouts),
        fetchText(FILES.journal),
      ]);
      adopt(parseWhoop({ cycles, workouts, journal }));
    } catch {
      setBundle(null);
      setStatus("missing");
    }
  }, [adopt]);

  useEffect(() => {
    let cancelled = false;
    reload().catch(() => {
      if (!cancelled) setStatus("missing");
    });
    const onChange = () => {
      void reload();
    };
    window.addEventListener("chc-vault-changed", onChange);
    return () => {
      cancelled = true;
      window.removeEventListener("chc-vault-changed", onChange);
    };
  }, [reload]);

  const importFiles = useCallback(
    async (list: FileList | File[]) => {
      const files = [...list];
      const textOf = async (match: RegExp) => {
        const file = files.find((item) => match.test(item.name.toLowerCase()));
        return file ? file.text() : "";
      };
      const cycles = await textOf(/physio|cycle/);
      const workouts = await textOf(/workout/);
      const journal = await textOf(/journal/);
      if (!cycles || !workouts) {
        setError("Need the physiological cycles CSV and the workouts CSV.");
        return;
      }
      adopt(parseWhoop({ cycles, workouts, journal }));
    },
    [adopt],
  );

  return { bundle, status, error, importFiles };
}
