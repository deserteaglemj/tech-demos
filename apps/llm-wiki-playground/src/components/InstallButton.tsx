import { useSyncExternalStore } from "react";
import { DownloadIcon } from "./Icons";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

// Listen at module load rather than in an effect: the browser can fire
// beforeinstallprompt before React's first commit, and it does not repeat
// the event for listeners added later.
let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

function setDeferredPrompt(next: BeforeInstallPromptEvent | null) {
  deferredPrompt = next;
  listeners.forEach((listener) => listener());
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    setDeferredPrompt(event as BeforeInstallPromptEvent);
  });
  window.addEventListener("appinstalled", () => setDeferredPrompt(null));
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => deferredPrompt;
const getServerSnapshot = () => null;

export function InstallButton() {
  const installEvent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (!installEvent) return null;

  const handleInstall = async () => {
    // A captured event can only prompt once; the browser fires a fresh one if install is offered again.
    setDeferredPrompt(null);
    try {
      await installEvent.prompt();
      await installEvent.userChoice;
    } catch (error) {
      console.warn("Install prompt failed.", error);
    }
  };

  return (
    <button
      type="button"
      className="header-button install-button"
      onClick={handleInstall}
      title="Install LLM Wiki Playground as an app"
    >
      <DownloadIcon />
      <span className="header-button-label">Install</span>
    </button>
  );
}
