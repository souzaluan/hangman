<script>
	import { IconCopy, IconInfoCircle } from '@tabler/icons-svelte';
</script>

<section>
	<div class="highlight">
		<h1>Multiplayer Hangman</h1>
		<h2>🤓 guess or die 💀</h2>
	</div>

	<div class="copiable-input-container">
		<div class="copiable-input-wrapper">
			<input readonly value="#ASAS" />
			<button type="button">
				<IconCopy />
			</button>
		</div>

		<div class="copiable-input-info">
			<IconInfoCircle size="0.75rem" />
			<span>Copie o código e envie para o seu amigo</span>
		</div>
	</div>
</section>

<style>
	section {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1.5rem;
	}

	h1 {
		font-size: 2rem;
	}

	h2 {
		font-size: 1.25rem;
	}

	.highlight {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.copiable-input-container {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.copiable-input-wrapper {
		height: 3rem;
		width: 20rem;
		display: flex;
		align-items: center;
		padding: 0.25rem;
		background-color: var(--color-neutral-secondary);
		border-radius: 0.5rem;
	}

	.copiable-input-wrapper > input {
		width: 100%;
		font-size: 1.25rem;
		font-weight: 600;
		padding-left: 0.5rem;
		color: var(--color-neutral-primary);
		border: none;
		border-radius: 0.25rem;
		background-color: transparent;
		outline: none;
	}

	.copiable-input-wrapper > button {
		border: none;
		background-color: transparent;
		color: var(--color-neutral-primary);
		padding-left: 1rem;
		padding-right: 1rem;
	}

	.copiable-input-wrapper > input:hover,
	.copiable-input-wrapper > button:hover {
		cursor: pointer;
	}

	.copiable-input-info {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.75rem;
		color: var(--color-neutral-secondary);
	}
</style>
