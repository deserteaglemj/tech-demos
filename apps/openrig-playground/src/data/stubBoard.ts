export type SeatState = "idle" | "working" | "acked";

export type Seat = {
  id: string;
  session: string;
  role: string;
  runtime: string;
};

export type Edge = {
  from: string;
  to: string;
  kind: string;
};

export const STUB_POD = {
  rig: "stub-demo",
  pod: "dev",
  label: "Development Pair",
  seats: [
    {
      id: "impl",
      session: "dev-impl@stub-demo",
      role: "implementer",
      runtime: "stub",
    },
    {
      id: "qa",
      session: "dev-qa@stub-demo",
      role: "reviewer",
      runtime: "stub",
    },
  ] satisfies Seat[],
  edges: [{ from: "impl", to: "qa", kind: "delegates_to" }] satisfies Edge[],
};

export const DEMO_PROMPT =
  "Hello from install test — acknowledge and idle.";

export const DEMO_REPLY = "acknowledged";
