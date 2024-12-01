<script>
	import '../app.css';

	import { title } from '../stores/create-title';

	import { Toaster } from 'svelte-french-toast';
</script>

<svelte:head>
	<title>{$title}</title>
	<meta name="description" content="Multiplayer Hangman Game" />

	<meta property="og:url" content="https://hangman-alpha-gules.vercel.app/" />
	<meta property="og:description" content="Multiplayer Hangman Game" />
	<meta property="og:title" content="Hangman • Let's play" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://ibb.co/bLMZtkz" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="hangman-alpha-gules.vercel.app" />
	<meta property="twitter:url" content="https://hangman-alpha-gules.vercel.app/" />
	<meta property="twitter:title" content="Hangman • Let's play" />
	<meta name="twitter:description" content="Multiplayer Hangman Game" />
	<meta name="twitter:image" content="https://ibb.co/bLMZtkz" />
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
