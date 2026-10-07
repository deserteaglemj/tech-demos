import { useCallback, useEffect, useState } from "react";
import { parseWhoop, type WhoopBundle } from "./parse";

const KEY = "chc-whoop-private-v1";

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
    localStorage.setItem(KEY, JSON.stringify(next));
    setBundle(next);
    setStatus("ready");
    setError("");
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [cycles, workouts, journal] = await Promise.all([
          fetchText(FILES.cycles),
          fetchText(FILES.workouts),
          fetchText(FILES.journal),
        ]);
        if (cancelled) return;
        adopt(parseWhoop({ cycles, workouts, journal }));
      } catch {
        if (cancelled) return;
        try {
          const cached = localStorage.getItem(KEY);
          if (cached) {
            setBundle(JSON.parse(cached) as WhoopBundle);
            setStatus("ready");
            return;
          }
        } catch {
          /* empty cache */
        }
        setStatus("missing");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [adopt]);

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
