<script lang="ts">
	type Feature = { icon: string; title: string; body: string };

	const features: Feature[] = [
		{
			icon: '🎯',
			title: 'Element inspection',
			body: 'Hover to reveal selector paths, component context, and source location for any node on the page.'
		},
		{
			icon: '✍️',
			title: 'Text & group notes',
			body: 'Select a text range or shift-click multiple elements to annotate several targets as one grouped note.'
		},
		{
			icon: '🧾',
			title: 'Structured export',
			body: 'Copy notes as compact, standard, detailed, or forensic Markdown &mdash; tuned for how much context your agent needs.'
		},
		{
			icon: '🧭',
			title: 'Source-aware',
			body: 'Jump straight to the originating file in your editor when workspaceRoot and openSourceOnClick are configured.'
		},
		{
			icon: '🗂️',
			title: 'Per-route sessions',
			body: 'Notes are scoped to the current page automatically, so annotations stay tidy as you move across routes.'
		},
		{
			icon: '🪝',
			title: 'Lifecycle callbacks',
			body: 'Hook onAnnotationAdd, onAnnotationUpdate, and onCopy to sync notes with your own tools or logs.'
		}
	];
</script>

<section class="features">
	<div class="container">
		<div class="section-heading" data-annotate="features-heading">
			<span class="section-tag">Why annotate</span>
			<h2>Everything an agent needs, captured in one click</h2>
		</div>

		<div class="feature-grid" data-annotate="feature-grid">
			{#each features as f (f.title)}
				<article class="feature-card" data-annotate={`feature-${f.title}`}>
					<span class="feature-icon">{f.icon}</span>
					<h3>{f.title}</h3>
					<p>{f.body}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.features {
		padding: 80px 0;
		border-bottom: 1px solid var(--border-soft);
	}

	.section-heading {
		max-width: 620px;
		margin-bottom: 44px;
	}

	.section-tag {
		display: inline-block;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--accent-soft);
		margin-bottom: 14px;
	}

	h2 {
		font-size: clamp(1.6rem, 3vw, 2.15rem);
		font-weight: 700;
		letter-spacing: -0.01em;
	}

	.feature-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 18px;
	}

	@media (max-width: 900px) {
		.feature-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 620px) {
		.feature-grid {
			grid-template-columns: 1fr;
		}
	}

	.feature-card {
		padding: 26px 22px;
		border-radius: var(--radius-md);
		background: var(--bg-card);
		border: 1px solid var(--border);
		transition: border-color 0.15s ease, transform 0.15s ease;
	}

	.feature-card:hover {
		border-color: var(--border);
		transform: translateY(-2px);
	}

	.feature-icon {
		display: inline-flex;
		font-size: 1.4rem;
		margin-bottom: 14px;
	}

	.feature-card h3 {
		font-size: 1.05rem;
		font-weight: 650;
		margin-bottom: 8px;
	}

	.feature-card p {
		font-size: 0.92rem;
		color: var(--text-dim);
	}
</style>
