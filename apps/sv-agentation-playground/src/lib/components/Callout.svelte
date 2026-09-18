<section class="callout">
	<div class="container">
		<div class="callout-card" data-annotate="dev-only-callout">
			<span class="callout-badge">Dev only</span>
			<h3>The toolbar you're seeing is live on this exact page</h3>
			<p>
				<code>&lt;Agentation /&gt;</code> is mounted in <code>src/routes/+layout.svelte</code>
				behind <code>browser &amp;&amp; dev</code>, so it never ships to production. Try annotating
				this card, then press <kbd>c</kbd> to copy the note as Markdown.
			</p>
		</div>
	</div>
</section>

<style>
	.callout {
		padding: 64px 0 88px;
	}

	.callout-card {
		position: relative;
		padding: 32px 30px;
		border-radius: var(--radius-lg);
		background: linear-gradient(160deg, rgba(124, 108, 246, 0.14), rgba(255, 93, 59, 0.08));
		border: 1px solid var(--border);
		max-width: 720px;
	}

	.callout-badge {
		display: inline-block;
		padding: 4px 10px;
		border-radius: 999px;
		background: var(--bg-card);
		border: 1px solid var(--border);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--accent-soft);
		margin-bottom: 16px;
	}

	.callout-card h3 {
		font-size: 1.25rem;
		font-weight: 650;
		margin-bottom: 12px;
		letter-spacing: -0.01em;
	}

	.callout-card p {
		color: var(--text-dim);
		font-size: 0.95rem;
	}

	.callout-card code {
		padding: 1px 6px;
		border-radius: 5px;
		background: var(--bg-card);
		border: 1px solid var(--border-soft);
		font-size: 0.85em;
	}
</style>
