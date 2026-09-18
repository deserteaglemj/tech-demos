---
title: Context Window
summary: The maximum number of tokens a model can attend to at once — its working memory for a single request.
---

The **context window** is the maximum number of tokens a model can process in one forward pass — effectively its working memory. Everything the model can "see" for a given request (system prompt, conversation history, retrieved documents, and the response it's generating) has to fit inside this budget, measured in the tokens produced by [[tokenization]].

## Why it's limited

Every additional token costs compute quadratically under naive [[attention]], since each new token must be compared against every existing one. Early transformer LLMs shipped with windows of a couple thousand tokens; modern frontier models have pushed this to hundreds of thousands or more, thanks to optimized attention kernels, better positional encodings, and architectural tricks — but it is never unlimited, and quality can degrade for information buried in the middle of a very long context ("lost in the middle").

## Context window vs memory

A large context window is not the same thing as long-term memory. Once a conversation exceeds the window, older turns have to be dropped, summarized, or retrieved back in — the model itself doesn't persist anything between separate context windows unless a system explicitly re-feeds relevant history. This is also distinct from what a model learned during training (baked into its weights) versus what's true only *within* the current context.

## Where it matters

Context window size directly shapes the design of any system built on an LLM, including [[transformers]]-based agents and how assistants tuned with [[rlhf]] are prompted: how much retrieved context you can stuff in, how long a conversation can run before truncation, and how much a single API call costs.
