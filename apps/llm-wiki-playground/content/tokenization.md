---
title: Tokenization
summary: How raw text gets chopped into the discrete integer tokens a transformer actually consumes.
---

Neural networks operate on numbers, not letters — **tokenization** is the step that turns a string of text into a sequence of integers (tokens) drawn from a fixed vocabulary, and back again. A [[transformers]]-based model never sees raw characters; it sees token IDs.

## Byte-Pair Encoding (BPE)

Most modern LLMs use a subword scheme like **Byte-Pair Encoding**: start from individual bytes/characters, then repeatedly merge the most frequent adjacent pair into a new token, until the vocabulary hits a target size (commonly 32k–100k+ tokens). This gives a nice middle ground — common words become single tokens, rare words get split into a handful of familiar pieces, and *any* input (typos, code, emoji) is still representable since you can always fall back to bytes.

## Why token count matters

Everything downstream is measured in tokens, not characters or words: the model's [[context-window]] limit, the cost of an API call, and even generation speed are all denominated in tokens. As a rough rule of thumb for English text, one token is roughly 4 characters or about ¾ of a word — so "tokenization efficiency" (how many tokens a given piece of text costs) directly affects how much you can fit into a prompt.

## Quirks

Tokenizers can behave surprisingly: the same word can tokenize differently depending on a leading space, capitalization, or language. This is part of why LLMs are sometimes bad at character-level tasks like counting letters in a word — the model may never see individual letters at all, only whole-word or subword chunks.
