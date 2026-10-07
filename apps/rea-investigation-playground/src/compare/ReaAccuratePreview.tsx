import { useState } from "react";

/**
 * REA-guided recreation — structure taken from live Resend DOM Evidence:
 * paired role=switch controls with aria-label "Email view mode" /
 * "Email appearance mode", each a 2-icon segmented group in the editor header.
 */
export default function ReaAccuratePreview() {
  const [viewMobile, setViewMobile] = useState(false);
  const [appearanceDark, setAppearanceDark] = useState(true);

  return (
    <div
      className={`rea-card ${appearanceDark ? "rea-dark" : "rea-light"} ${viewMobile ? "rea-mobile" : "rea-desktop"}`}
    >
      <header className="rea-header">
        <div className="rea-traffic" aria-hidden="true">
          <i className="r" />
          <i className="y" />
          <i className="g" />
        </div>
        <div className="rea-switches">
          <span
            role="switch"
            tabIndex={0}
            aria-checked={!viewMobile}
            data-checked={!viewMobile ? "" : undefined}
            onClick={() => setViewMobile((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setViewMobile((v) => !v);
              }
            }}
          >
            <span
              aria-label="Email view mode"
              className="rea-seg"
              data-checked={!viewMobile ? "" : undefined}
              data-mode={viewMobile ? "mobile" : "desktop"}
            >
              <div
                className={!viewMobile ? "on" : ""}
                title="Desktop"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewMobile(false);
                }}
              >
                <MonitorIcon />
              </div>
              <div
                className={viewMobile ? "on" : ""}
                title="Mobile"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewMobile(true);
                }}
              >
                <PhoneIcon />
              </div>
            </span>
          </span>

          <span
            role="switch"
            tabIndex={0}
            aria-checked={appearanceDark}
            data-checked={appearanceDark ? "" : undefined}
            onClick={() => setAppearanceDark((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setAppearanceDark((v) => !v);
              }
            }}
          >
            <span
              aria-label="Email appearance mode"
              className="rea-seg"
              data-checked={appearanceDark ? "" : undefined}
              data-mode={appearanceDark ? "dark" : "light"}
            >
              <div
                className={!appearanceDark ? "on" : ""}
                title="Light"
                onClick={(e) => {
                  e.stopPropagation();
                  setAppearanceDark(false);
                }}
              >
                <MoonIcon />
              </div>
              <div
                className={appearanceDark ? "on" : ""}
                title="Dark"
                onClick={(e) => {
                  e.stopPropagation();
                  setAppearanceDark(true);
                }}
              >
                <SunIcon />
              </div>
            </span>
          </span>
        </div>
      </header>

      <div className="rea-body">
        <div className="rea-mail">
          <div className="rea-logo" />
          <h3>
            Welcome to <strong>ACME</strong>, user!
          </h3>
          <p>
            Hello Steve, We&apos;re excited to have you onboard at ACME. We hope
            you enjoy your journey with us!
          </p>
          <button type="button">Get Started</button>
          <p className="rea-sign">
            Cheers,
            <br />
            The ACME Team
          </p>
        </div>
      </div>
    </div>
  );
}

function MonitorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.154 3.004A3 3 0 0 1 21 6v8l-.004.154a3 3 0 0 1-2.842 2.842L18 17h-4.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h.5a1 1 0 1 1 0 2h-4a1 1 0 1 1 0-2h.5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H6a3 3 0 0 1-2.996-2.846L3 14V6a3 3 0 0 1 3-3h12zM6 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.154 2.004A3 3 0 0 1 19 5v14l-.004.154a3 3 0 0 1-2.842 2.842L16 22H8a3 3 0 0 1-2.996-2.846L5 19V5a3 3 0 0 1 2.846-2.996L8 2h8zM8 4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zm4 11a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7.2 5.8v-.3a8 8 0 0 0 5 14.3l-.5 1 .5 1h-.5a10 10 0 0 1-9.4-9.5v-.5A10 10 0 0 1 9 2.3q.7-.2.6.6l-.1.4-.4 2.5v.4a9 9 0 0 0 8.6 8.5h.4q1.5 0 2.9-.4.8 0 .6.6l-.1.4a10 10 0 0 1-9.4 6.5l-.5-1 .5-1a8 8 0 0 0 6.3-3h-.3c-6 0-11-5-11-11" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 18a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1m-5.655-1.754a1 1 0 1 1 1.414 1.414l-1.414 1.414A1 1 0 1 1 4.93 17.66zm9.9 0a1 1 0 0 1 1.413 0l1.414 1.414a1 1 0 1 1-1.414 1.414l-1.414-1.414a1 1 0 0 1 0-1.414M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8m0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-6.995.995a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2zm16 0a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2zM4.93 4.933a1 1 0 0 1 1.414 0l1.414 1.414A1 1 0 1 1 6.345 7.76L4.93 6.347a1 1 0 0 1 0-1.414m12.727 0a1 1 0 1 1 1.414 1.414L17.658 7.76a1 1 0 1 1-1.414-1.414zM12 2a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1" />
    </svg>
  );
}
