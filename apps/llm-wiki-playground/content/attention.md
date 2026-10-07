---
title: Attention Mechanism
summary: The mechanism that lets each token weigh and mix information from every other token in the sequence.
---

**Attention** is the core operation inside a [[transformers]] block. For every token, the model computes a *query*, and compares it against the *key* of every other token to get a similarity score; those scores (after softmax) weight a sum over each token's *value*. In plain terms: each token asks "who in this sequence is relevant to me right now?" and blends in their information accordingly.

## Self-attention vs cross-attention

When queries, keys, and values all come from the same sequence, it's called **self-attention** — this is what powers most decoder-only LLMs. **Cross-attention** instead lets one sequence attend to a different one (e.g. a decoder attending to an encoder's output), which shows up in translation and some retrieval-augmented setups.

## Multi-head attention

Rather than computing attention once, transformers run several attention "heads" in parallel, each with its own learned query/key/value projections. One head might specialize in tracking syntax, another in coreference, another in positional patterns. The heads' outputs are concatenated and projected back down.

## Cost grows with sequence length

Attention scores every token against every other token, so naive self-attention costs O(n²) in the sequence length n. This is exactly why the size of the [[context-window]] is such a big engineering and cost lever — doubling context roughly quadruples the attention compute (before optimizations like FlashAttention or sparse/linear attention variants).
