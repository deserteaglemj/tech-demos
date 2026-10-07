import type {
  EmailDraftData,
  GitHubPRData,
  LinkedInPostData,
  TwitterThreadData,
} from "agentcomposerui";

export type ChannelId = "linkedin" | "twitter" | "email" | "github";

export const CHANNELS: { id: ChannelId; label: string; blurb: string }[] = [
  { id: "linkedin", label: "LinkedIn", blurb: "Feed post with hook + CTA" },
  { id: "twitter", label: "X Thread", blurb: "Multi-post thread preview" },
  { id: "email", label: "Email", blurb: "Outreach draft + subject analyzer" },
  { id: "github", label: "GitHub PR", blurb: "Description, checklist, labels" },
];

export const linkedInDraft: LinkedInPostData = {
  hook: "Most agent UIs stop at chat.",
  body: "When the model drafts a LinkedIn post, an email, or a PR description, someone still has to review it.\n\nAgentComposerUI gives you native HITL composer cards — stream → edit → approve — without rebuilding platform previews from scratch.",
  callToAction: "Drop it into your agent loop and ship the review step this week.",
  hashtags: ["AIAgents", "HumanInTheLoop", "React", "DeveloperTools"],
};

export const linkedInRevised: LinkedInPostData = {
  hook: "Chat is not a shipping pipeline.",
  body: "Agents draft. Humans approve. The gap is the review UI.\n\nThis playground streams mock drafts into AgentComposerUI composers so you can feel the approve / reject / revise loop before wiring a real model.",
  callToAction: "Open a channel, run the mock agent, and green-light a draft.",
  hashtags: ["HITL", "GenerativeUI", "AgentTools"],
};

export const twitterDraft: TwitterThreadData = {
  topic: "HITL composers for agents",
  tweets: [
    {
      id: "1",
      text: "Building an agent that posts for you? Cool.\n\nBuilding the review UI so a human can catch the bad drafts? That's the hard part.",
    },
    {
      id: "2",
      text: "AgentComposerUI ships LinkedIn, X thread, email, and GitHub PR composers with streaming + approve/reject baked in.",
    },
    {
      id: "3",
      text: "This playground uses a mock agent — no API key — so you can poke the HITL loop in one sitting.",
    },
  ],
  hashtags: ["buildinpublic", "agents"],
};

export const twitterRevised: TwitterThreadData = {
  topic: "HITL composers for agents",
  tweets: [
    {
      id: "1",
      text: "Revision pass: agents that publish without a review surface are just latency with confidence.",
    },
    {
      id: "2",
      text: "Swap chat bubbles for platform composers. Edit the draft. Approve or send feedback back to the model.",
    },
    {
      id: "3",
      text: "Mock stream in this demo. Real LLM schemas ship with the package when you're ready.",
    },
  ],
  hashtags: ["HITL", "devtools"],
};

export const emailDraft: EmailDraftData = {
  to: "alex@northwind.studio",
  subject: "Quick review: agent-drafted launch note",
  previewText: "Approve or send feedback in one click",
  body: "Hi Alex,\n\nI drafted a short launch note for Thursday's drop. Can you skim the tone and CTA?\n\nIf anything feels off, reject with a note — I'll revise and ping you again.\n\nThanks,\nNova",
  signature: "Nova · Growth Ops · Northwind",
  tokens: {
    first_name: "Alex",
    product: "Northwind Launch",
    date: "Thursday",
  },
};

export const emailRevised: EmailDraftData = {
  to: "alex@northwind.studio",
  subject: "Revised: tighter launch note for Thursday",
  previewText: "Shorter body, clearer ask",
  body: "Hi Alex,\n\nRevised after your feedback — shorter opener, stronger CTA, same Thursday timeline.\n\nApprove if this is ready to schedule.\n\n— Nova",
  signature: "Nova · Growth Ops · Northwind",
  tokens: {
    first_name: "Alex",
    product: "Northwind Launch",
    date: "Thursday",
  },
};

export const githubDraft: GitHubPRData = {
  title: "feat: add HITL composer review step to publish agent",
  sourceBranch: "feat/composer-review",
  targetBranch: "main",
  body: "## Summary\nWires AgentComposerUI into the publish agent so drafts pause for human approval before posting.\n\n## Changes\n- Mock stream → reviewing status bridge\n- Approve publishes; reject returns feedback to the agent loop\n- Activity log for demo visibility\n\n## Test plan\n- [ ] Stream a draft into each channel\n- [ ] Edit fields mid-review\n- [ ] Reject with feedback and confirm revision",
  checklist: [
    { id: "c1", label: "LinkedIn composer wired", completed: true },
    { id: "c2", label: "X thread composer wired", completed: true },
    { id: "c3", label: "Email + GitHub composers wired", completed: false },
    { id: "c4", label: "Screenshot + video for PR", completed: false },
  ],
  reviewers: ["deserteaglemj"],
  labels: ["demo", "agents", "frontend"],
};

export const githubRevised: GitHubPRData = {
  title: "feat: harden HITL revision loop for publish agent",
  sourceBranch: "feat/composer-review",
  targetBranch: "main",
  body: "## Summary\nFollow-up after review feedback: revision payloads are deterministic, activity log records reject reasons, and all four composers share one mock agent control.\n\n## Test plan\n- [x] Reject triggers revised draft\n- [x] Approve marks channel done\n- [ ] Capture validation artifacts",
  checklist: [
    { id: "c1", label: "LinkedIn composer wired", completed: true },
    { id: "c2", label: "X thread composer wired", completed: true },
    { id: "c3", label: "Email + GitHub composers wired", completed: true },
    { id: "c4", label: "Screenshot + video for PR", completed: false },
  ],
  reviewers: ["deserteaglemj"],
  labels: ["demo", "agents", "frontend"],
};

export function seedFor(channel: ChannelId) {
  switch (channel) {
    case "linkedin":
      return linkedInDraft;
    case "twitter":
      return twitterDraft;
    case "email":
      return emailDraft;
    case "github":
      return githubDraft;
  }
}

export function revisedFor(channel: ChannelId) {
  switch (channel) {
    case "linkedin":
      return linkedInRevised;
    case "twitter":
      return twitterRevised;
    case "email":
      return emailRevised;
    case "github":
      return githubRevised;
  }
}
