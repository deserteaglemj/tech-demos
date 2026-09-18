<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Features from '$lib/components/Features.svelte';
	import Workflow from '$lib/components/Workflow.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
</script>

<svelte:head>
	<title>sv-agentation playground</title>
	<meta
		name="description"
		content="A tiny Svelte + Bun landing page for exercising the sv-agentation dev-mode annotation toolbar."
	/>
</svelte:head>

<main>
	<Hero />
	<Features />
	<Workflow />
	<Callout />
</main>

<SiteFooter />
