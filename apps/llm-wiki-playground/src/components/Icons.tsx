import type { ReactNode } from "react";

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function IndexIcon() {
  return (
    <Icon>
      <path d="M9 6.5h11M9 12h11M9 17.5h11" />
      <circle cx="4.5" cy="6.5" r="1" />
      <circle cx="4.5" cy="12" r="1" />
      <circle cx="4.5" cy="17.5" r="1" />
    </Icon>
  );
}

export function GraphIcon() {
  return (
    <Icon>
      <path d="M8.2 7.2l7.6 1.6M7 8.6l3 7.2M16.6 10.6l-4.4 5.6" />
      <circle cx="5.8" cy="6.6" r="2.3" />
      <circle cx="18.2" cy="9.3" r="2.3" />
      <circle cx="11" cy="18.1" r="2.3" />
    </Icon>
  );
}

export function SearchIcon() {
  return (
    <Icon>
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="M15.5 15.5L20 20" />
    </Icon>
  );
}

export function DownloadIcon() {
  return (
    <Icon>
      <path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 20h14" />
    </Icon>
  );
}
