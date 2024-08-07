<script>
	import { Toaster } from 'svelte-french-toast';
	import '../app.css';
</script>

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
