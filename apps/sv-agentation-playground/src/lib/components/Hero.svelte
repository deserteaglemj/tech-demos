<script lang="ts">
	const shortcuts: { key: string; label: string }[] = [
		{ key: 'i', label: 'Inspect' },
		{ key: 'c', label: 'Copy' },
		{ key: 'o', label: 'Open' },
		{ key: 'r', label: 'Reset' },
		{ key: 'esc', label: 'Cancel' }
	];
</script>

<section class="hero">
	<div class="container">
		<span class="eyebrow" data-annotate="hero-eyebrow">
			<span class="dot"></span>
			sv-agentation playground
		</span>

		<h1 data-annotate="hero-title">
			Turn UI feedback into <span class="highlight">agent-ready markdown</span>
		</h1>

		<p class="lede" data-annotate="hero-lede">
			Click any element on this page, leave a note, and copy a structured Markdown payload you
			can paste straight into Claude Code, Cursor, or any AI coding agent. No screenshots, no
			ambiguous descriptions &mdash; just precise, source-aware context.
		</p>

		<div class="hero-actions" data-annotate="hero-actions">
			<a class="btn btn-primary" href="https://github.com/SikandarJODD/sv-agentation">
				View sv-agentation on GitHub
			</a>
			<a class="btn btn-ghost" href="https://sv-agentation.com" rel="noreferrer">
				Read the docs
			</a>
		</div>

		<div class="shortcut-strip" data-annotate="shortcut-cheatsheet">
			<span class="shortcut-strip-label">Try it now &mdash;</span>
			{#each shortcuts as s (s.key)}
				<span class="shortcut-chip">
					<kbd>{s.key}</kbd>
					{s.label}
				</span>
			{/each}
		</div>
	</div>
</section>

<style>
	.hero {
		padding: 96px 0 64px;
		border-bottom: 1px solid var(--border-soft);
	}

	.eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 6px 14px;
		border-radius: 999px;
		border: 1px solid var(--border);
		background: var(--bg-elevated);
		color: var(--text-dim);
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.01em;
	}

	.dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 0 4px var(--accent-glow);
	}

	h1 {
		margin-top: 28px;
		font-size: clamp(2.4rem, 5vw, 3.75rem);
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.08;
		max-width: 820px;
	}

	.highlight {
		background: linear-gradient(100deg, var(--accent) 0%, var(--violet) 100%);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}

	.lede {
		margin-top: 24px;
		max-width: 620px;
		font-size: 1.1rem;
		color: var(--text-dim);
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 14px;
		margin-top: 36px;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 12px 22px;
		border-radius: var(--radius-sm);
		font-weight: 600;
		font-size: 0.95rem;
		border: 1px solid transparent;
		transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
	}

	.btn-primary {
		background: linear-gradient(120deg, var(--accent), var(--accent-soft));
		color: #17110d;
		box-shadow: 0 8px 24px -8px var(--accent-glow);
	}

	.btn-primary:hover {
		transform: translateY(-1px);
	}

	.btn-ghost {
		background: var(--bg-elevated);
		border-color: var(--border);
		color: var(--text);
	}

	.btn-ghost:hover {
		border-color: var(--accent-soft);
		color: var(--accent-soft);
	}

	.shortcut-strip {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px;
		margin-top: 48px;
		padding-top: 28px;
		border-top: 1px dashed var(--border);
	}

	.shortcut-strip-label {
		color: var(--text-faint);
		font-size: 0.85rem;
		margin-right: 4px;
	}

	.shortcut-chip {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		padding: 6px 12px 6px 8px;
		border-radius: 999px;
		background: var(--bg-card);
		border: 1px solid var(--border);
		font-size: 0.82rem;
		color: var(--text-dim);
	}
</style>
