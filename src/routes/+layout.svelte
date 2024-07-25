<script>
	import '../app.css';
</script>

<main>
	<slot />
</main>

<style>
	main {
		min-height: 100vh;
		display: flex;
		padding: 2rem;
		background-color: var(--color-brand-primary);
	}
</style>
