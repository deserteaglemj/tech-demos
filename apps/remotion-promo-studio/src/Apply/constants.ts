export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// ~22s walkthrough of mstudios.cc/start → free demo.
export const INTRO_DURATION = 75; // 2.5s
export const OPEN_START_DURATION = 60; // 2s
export const FORM_JOURNEY_DURATION = 300; // 10s — 8 section chips
export const SUBMIT_DURATION = 75; // 2.5s
export const OUTCOME_DURATION = 90; // 3s
export const CTA_DURATION = 60; // 2s

export const DEFAULT_DURATION_IN_FRAMES =
  INTRO_DURATION +
  OPEN_START_DURATION +
  FORM_JOURNEY_DURATION +
  SUBMIT_DURATION +
  OUTCOME_DURATION +
  CTA_DURATION;

export const APPLY_SECTIONS = [
  {n: 1, title: 'The Basics', blurb: 'Who you are & how to reach you'},
  {n: 2, title: 'Your Goals', blurb: 'What the site should do'},
  {n: 3, title: 'Your Customers', blurb: 'Who you want to attract'},
  {n: 4, title: 'Look & Vibe', blurb: 'How the site should feel'},
  {n: 5, title: 'Branding & Assets', blurb: 'Logo, colors, photos'},
  {n: 6, title: 'Content & Pages', blurb: 'What lives on the site'},
  {n: 7, title: 'Getting Found', blurb: 'SEO searches & Google'},
  {n: 8, title: 'Logistics', blurb: 'Domain, timeline, anything else'},
] as const;
