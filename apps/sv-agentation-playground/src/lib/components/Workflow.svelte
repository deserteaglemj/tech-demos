<script lang="ts">
	type Step = { n: string; title: string; body: string };

	const steps: Step[] = [
		{
			n: '01',
			title: 'Press i to inspect',
			body: 'The floating toolbar activates and hovering any element highlights its bounds and selector path.'
		},
		{
			n: '02',
			title: 'Click, select, or shift-click to annotate',
			body: 'Click one element, drag over text, or shift-click several nodes to build a grouped target, then type a note.'
		},
		{
			n: '03',
			title: 'Press c to copy',
			body: 'All notes on the current page are exported as Markdown ready to paste into your favorite AI coding agent.'
		}
	];
</script>

<section class="workflow">
	<div class="container">
		<div class="section-heading" data-annotate="workflow-heading">
			<span class="section-tag">How it works</span>
			<h2>Three steps from a UI nitpick to a fixed bug</h2>
		</div>

		<div class="steps" data-annotate="workflow-steps">
			{#each steps as s (s.n)}
				<div class="step" data-annotate={`workflow-step-${s.n}`}>
					<span class="step-n">{s.n}</span>
					<div>
						<h3>{s.title}</h3>
						<p>{s.body}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.workflow {
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
		color: var(--violet);
		margin-bottom: 14px;
	}

	h2 {
		font-size: clamp(1.6rem, 3vw, 2.15rem);
		font-weight: 700;
		letter-spacing: -0.01em;
	}

	.steps {
		display: flex;
		flex-direction: column;
		gap: 22px;
	}

	.step {
		display: grid;
		grid-template-columns: 64px 1fr;
		gap: 22px;
		padding: 22px 24px;
		border-radius: var(--radius-md);
		background: var(--bg-elevated);
		border: 1px solid var(--border-soft);
	}

	.step-n {
		font-size: 1.6rem;
		font-weight: 700;
		color: var(--text-faint);
		font-family: 'JetBrains Mono', ui-monospace, monospace;
	}

	.step h3 {
		font-size: 1.05rem;
		font-weight: 650;
		margin-bottom: 6px;
	}

	.step p {
		font-size: 0.92rem;
		color: var(--text-dim);
	}
</style>
