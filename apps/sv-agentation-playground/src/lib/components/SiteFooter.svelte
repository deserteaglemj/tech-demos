<footer class="site-footer">
	<div class="container footer-inner">
		<span data-annotate="footer-credit">
			Built with <a href="https://svelte.dev">Svelte</a> +
			<a href="https://www.npmjs.com/package/sv-agentation">sv-agentation</a>
		</span>
		<span class="footer-source">
			Source:
			<a href="https://x.com/Sikandar_Bhide/status/2090106334201225285" rel="noreferrer">
				@Sikandar_Bhide
			</a>
		</span>
	</div>
</footer>

<style>
	.site-footer {
		border-top: 1px solid var(--border-soft);
		padding: 28px 0 48px;
	}

	.footer-inner {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 12px;
		color: var(--text-faint);
		font-size: 0.85rem;
	}

	.footer-inner a {
		color: var(--text-dim);
		text-decoration: underline;
		text-decoration-color: var(--border);
		text-underline-offset: 3px;
	}

	.footer-inner a:hover {
		color: var(--accent-soft);
	}
</style>
