<script lang="ts">
	import { IconCopy, IconInfoCircle, IconSend2 } from '@tabler/icons-svelte';

	let wayToEnter: 'to-invite' | 'guest' = 'to-invite';
</script>

<section>
	<div class="highlight">
		<h1>Multiplayer Hangman</h1>
		<h2>🤓 guess or die 💀</h2>
	</div>

	<div class="controls-container">
		<div class="segment-control">
			<button data-active={wayToEnter === 'to-invite'} on:click={() => (wayToEnter = 'to-invite')}
				>Convidar</button
			>
			<button data-active={wayToEnter === 'guest'} on:click={() => (wayToEnter = 'guest')}
				>Entrar</button
			>
		</div>

		{#if wayToEnter === 'to-invite'}
			<div class="input-container">
				<div class="input-wrapper">
					<input readonly value="A1BH" />
					<button type="button">
						<IconCopy size="1.75rem" />
					</button>
				</div>

				<div class="input-info">
					<IconInfoCircle size="0.875rem" />
					<span>Copie o código e envie para o seu amigo</span>
				</div>
			</div>
		{/if}

		{#if wayToEnter === 'guest'}
			<div class="input-container">
				<div class="input-wrapper">
					<input placeholder="Código da sala" />
					<button type="button">
						<IconSend2 size="1.75rem" />
					</button>
				</div>

				<div class="input-info">
					<IconInfoCircle size="0.75rem" />
					<span>Insira o código da sala</span>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	section {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 2rem;
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

	.controls-container {
		width: 100%;
		max-width: 28rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.input-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.input-wrapper {
		height: 4rem;
		display: flex;
		align-items: center;
		padding: 0.5rem;
		background-color: var(--color-neutral-secondary);
		border-radius: 0.5rem;
	}

	.input-wrapper > input {
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

	.input-wrapper > input::placeholder {
		font-size: 1.25rem;
		font-weight: 600;
		opacity: 0.25;
	}

	.input-wrapper > button {
		border: none;
		background-color: transparent;
		color: var(--color-neutral-primary);
		padding: 0.5rem;
	}

	.input-wrapper > input:read-only:hover,
	.input-wrapper > button:hover {
		cursor: pointer;
	}

	.input-info {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.875rem;
		color: var(--color-neutral-secondary);
	}

	.segment-control {
		display: flex;
	}

	.segment-control {
		border-radius: 0.5rem;
	}

	.segment-control > button:first-child {
		border-top-left-radius: 0.5rem;
		border-bottom-left-radius: 0.5rem;
	}

	.segment-control > button:last-child {
		border-top-right-radius: 0.5rem;
		border-bottom-right-radius: 0.5rem;
	}

	.segment-control > button {
		flex: 1;
		font-size: 1.5rem;
		font-weight: 600;
		padding: 0.75rem 1rem;
		border: none;
	}
	.segment-control > button:hover {
		cursor: pointer;
		filter: brightness(0.9);
	}
	.segment-control > button[data-active='false'] {
		color: var(--color-neutral-primary);
		background-color: var(--color-neutral-secondary);
	}
	.segment-control > button[data-active='true'] {
		color: var(--color-neutral-secondary);
		background-color: var(--color-neutral-primary);
	}
</style>
