# tech-demos cloud tester

This public monorepo is a cloud bench: test something before the owner installs it on their computer. Judge efficacy and recommend whether it is worth installing. Never create a new GitHub repository per test.

## Layout

- `playground/<kebab-slug>/`: small tests and written test reports. Reuse the assigned pick's directory.
- `apps/<kebab-slug>/`: existing apps. Keep them; do not delete or rewrite other picks in this pass.
- `.scratch/` or `playground/<slug>/.scratch/`: gitignored, temporary evaluation copies.
- `skills/project-planning/`: an optional planning aid, not a required build step.
- `tracking/seen-bookmarks.json`: proposed, approved or skipped bookmark IDs; do not re-propose them.

## Rules for cloud agents

1. Test the input as itself. Scope the checks to the claimed benefit and define observable pass and fail criteria before running them. Stay within the assigned pick; keep each test single-user and finishable in one sitting.
2. For a normal library or product, a tiny playground is allowed only when running it is necessary to judge it. A full product clone, website or app is not the default. Use the runtime the input actually needs; Bun is optional.
3. For a GitHub repository that is an agent skill, do not build an app. Install or vendor it only in the cloud scratch area, run it against 3 to 5 realistic tasks, record each pass and fail, and judge whether the owner should install it locally. Remove the owned scratch copy if the verdict is skip. This evaluation does not install it on the owner's computer.
4. Require a written `TEST_REPORT.md` in the pick's directory. State the input and tested revision, expected benefit, how it was tested, observed results, what failed, limits and the verdict. Separate untested claims from observed results. The verdict must be exactly one of: **worth installing**, **worth installing with limits**, or **skip**.
5. Do not require `PLAN.md`, a Bun app, a Cloudflare preview, screenshot, video or PR for every run. Use those only when they help verify the actual input or the owner requests them. A written verdict is always required.

Keep the existing cloud model preference: **claude-sonnet-5 (Claude Sonnet 5)**. Do not use Fable 5 unless the owner explicitly asks.

## Product and privacy boundaries

Keep the monorepo public and preserve existing `apps/` folders. New tests must not add another app unless a throwaway UI is necessary to judge the input; mark that UI **temporary** in its README and report.

Use synthetic fixtures. Never put customer health records, names, exports, journal answers, body logs, credentials or private internal data in code, reports, issues, screenshots, videos or PR text. Keep scratch copies out of git.

A preview or local installation is a separate action, not a requirement for the test verdict. Do not publish, spend money or expand access merely to complete an evaluation.
