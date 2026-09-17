---
title: RLHF (Reinforcement Learning from Human Feedback)
summary: The post-training step that steers a raw next-token predictor into a helpful, well-behaved assistant.
---

A freshly pretrained [[transformers]] model is just a very good next-token predictor — it can complete text plausibly, but it has no particular drive to be *helpful*, *honest*, or *harmless*, and no notion of "answer the user's question" versus "continue whatever pattern looks statistically likely." **RLHF** is the widely-used technique for closing that gap.

## The three-stage recipe

1. **Supervised fine-tuning (SFT):** the base model is fine-tuned on a smaller set of high-quality demonstration conversations (prompt → ideal response), teaching it the *shape* of being an assistant.
2. **Reward modeling:** humans rank multiple candidate responses to the same prompt from best to worst; a separate reward model is trained to predict that human preference ranking.
3. **RL fine-tuning:** the SFT model is further optimized (classically with PPO, though simpler alternatives like DPO are now common) to maximize the reward model's score, nudging its outputs toward what humans prefer.

## What it actually changes

RLHF doesn't add new knowledge — that mostly comes from pretraining, within whatever the model's [[context-window]] lets it use at inference time. Instead it reshapes *behavior*: following instructions, refusing harmful requests, admitting uncertainty, matching a helpful tone, and generally making the model's outputs line up with what human raters actually wanted, rather than just "text that looks statistically normal."

## Known failure modes

RLHF can overshoot into sycophancy (telling the user what they want to hear rather than what's true), reward hacking (exploiting quirks of the reward model rather than genuinely improving), or reduced diversity in outputs. It's an active area of research alongside alternatives and refinements like DPO, RLAIF, and constitutional AI approaches.
