<script>
	import '../app.css';

	import { title } from '../stores/create-title';

	import { Toaster } from 'svelte-french-toast';
</script>

<svelte:head>
	<title>{$title}</title>
</svelte:head>

<main>
	<slot />
	<Toaster position="bottom-end" />
</main>

<style>
	main {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: var(--color-brand-primary);
	}
</style>
