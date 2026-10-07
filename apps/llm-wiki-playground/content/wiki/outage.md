---
title: Tuesday outage
summary: A 41-minute 502 on signed-in reads. Harbor's kickoff slipped. Their data was not touched.
concepts: outage
sources: ops/tuesday-ledger.md, calls/harbor-onboarding.md
---

Tuesday from 02:10 to 02:51 the API returned 502s on signed-in reads. The ledger blames a config push, not a vendor. Two older tenants filed tickets. Harbor's workspace was empty, so their data was not involved, but the morning kickoff was cancelled and about a day of onboarding was lost.

Chris at [[harbor]] asked twice whether the outage reached the new workspace. It did not. Follow-up sits with platform.
