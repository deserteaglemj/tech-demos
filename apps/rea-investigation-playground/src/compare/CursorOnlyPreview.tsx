import { useState } from "react";

/**
 * Cursor-only recreation — built from a visual glance at Resend’s marketing
 * page WITHOUT REA Evidence (no aria-labels, no DOM toolbar HTML, no role=switch).
 *
 * Typical agent guess: theme/select controls + a responsive preview, but not the
 * segmented icon switch groups in the editor chrome.
 */
export default function CursorOnlyPreview() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className={`co-root co-${theme}`}>
      <div className="co-toolbar">
        <label>
          Device
          <select
            value={device}
            onChange={(e) => setDevice(e.target.value as "desktop" | "mobile")}
          >
            <option value="desktop">Desktop</option>
            <option value="mobile">Mobile</option>
          </select>
        </label>
        <label>
          Theme
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as "light" | "dark")}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </label>
      </div>
      <div className={`co-frame co-frame-${device}`}>
        <div className="co-mail">
          <div className="co-avatar" />
          <h3>Welcome to ACME, user!</h3>
          <p>Hello Steve — excited to have you onboard.</p>
          <button type="button">Get Started</button>
        </div>
      </div>
    </div>
  );
}
