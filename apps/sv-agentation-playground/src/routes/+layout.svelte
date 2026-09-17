<script lang="ts">
	import { browser, dev } from '$app/environment';
	import { Agentation, type Annotation, type AnnotationPayload } from 'sv-agentation';
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { children } = $props();

	// Set this to the absolute path of this app on your machine to enable
	// "open in editor" links from annotations (see README for details).
	const workspaceRoot: string | null = null;

	function handleAnnotationAdd(annotation: Annotation) {
		console.log('[agentation] annotation added:', annotation.targetLabel ?? annotation.id);
	}

	function handleCopy(markdown: string, payload: AnnotationPayload) {
		console.log(`[agentation] copied ${payload.annotations.length} note(s) as markdown`);
		console.log(markdown);
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

{#if browser && dev}
	<Agentation
		{workspaceRoot}
		openSourceOnClick={Boolean(workspaceRoot)}
		outputMode="standard"
		toolbarPosition="bottom-right"
		onAnnotationAdd={handleAnnotationAdd}
		onCopy={handleCopy}
	/>
{/if}
