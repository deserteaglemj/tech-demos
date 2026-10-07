---
title: Transformer Architecture
summary: The neural network architecture behind modern LLMs — stacked attention and feed-forward blocks with no recurrence.
---

The **transformer** is the architecture underneath essentially every modern large language model. Introduced in "Attention Is All You Need" (2017), it replaced recurrent networks with a fully parallelizable design built from stacked blocks of [[attention]] and position-wise feed-forward layers.

## Why it won

Recurrent networks process tokens one at a time, which makes them slow to train and bad at remembering things far back in a sequence. Transformers instead let every token look at every other token directly through [[attention]], so long-range dependencies are just as cheap as short-range ones. This also makes training embarrassingly parallel on GPUs — the real unlock that made scaling up model and data size practical.

## The building blocks

A transformer block has two sub-layers: multi-head [[attention]] and a small MLP, each wrapped with a residual connection and layer normalization. Stack a few dozen of these blocks and you get GPT-scale models. Before any of this happens, raw text has to be converted into tokens via [[tokenization]], and the number of tokens the model can attend to at once is bounded by its [[context-window]].

## Decoder-only vs encoder-decoder

Most current LLMs (GPT-style) use a **decoder-only** transformer: every token can only attend to earlier tokens (causal masking), which is what lets the model be trained simply by predicting the next token. Encoder-decoder variants (like the original translation transformer) also exist but are less common for general-purpose chat models today.
