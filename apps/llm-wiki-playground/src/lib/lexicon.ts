/** Local concept lexicon. The agent files these onto wiki pages; raw notes use other words. */
export const LEXICON: { concept: string; aliases: string[] }[] = [
  { concept: "churn", aliases: ["churn", "churning", "shopping", "walk", "cancel", "leave", "leaving"] },
  { concept: "pricing", aliases: ["pricing", "price", "undercharge", "undercharging", "cheap", "discount", "seat"] },
  { concept: "hiring", aliases: ["hiring", "hire", "candidate", "debrief", "offer", "pass"] },
  { concept: "outage", aliases: ["outage", "tuesday", "pager", "502", "incident", "down"] },
  { concept: "onboarding", aliases: ["onboarding", "onboard", "sso", "kickoff", "harbor"] },
];

const ALIAS_TO_CONCEPT = new Map<string, string>();
for (const entry of LEXICON) {
  for (const alias of entry.aliases) ALIAS_TO_CONCEPT.set(alias, entry.concept);
}

export function conceptForAlias(token: string): string | undefined {
  return ALIAS_TO_CONCEPT.get(token);
}

export function aliasesFor(concept: string): string[] {
  return LEXICON.find((entry) => entry.concept === concept)?.aliases ?? [concept];
}
