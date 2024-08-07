<script lang="ts">
	import { goto } from '$app/navigation';
	import { IconInfoCircle, IconSend2 } from '@tabler/icons-svelte';
</script>

<section>
	<div class="highlight">
		<h1>Multiplayer Hangman</h1>
		<h2>🤓 guess or die 💀</h2>
	</div>

	<div class="controls-container">
		<div class="input-container">
			<div class="input-wrapper">
				<input placeholder="Room code" />
				<button type="button">
					<IconSend2 size="1.75rem" />
				</button>
			</div>

			<div class="input-info">
				<IconInfoCircle size="0.75rem" />
				<span>Enter room code</span>
			</div>
		</div>

		<span class="conditional-label">
			<span></span>
			or
			<span></span>
		</span>

		<button class="new-room" on:click={() => goto('/room/ASAHB')}>Create room</button>
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
		padding: 2rem;
	}

	h1 {
		text-align: center;
		font-size: 2.25rem;
	}

	h2 {
		font-size: 1.5rem;
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

	.new-room {
		min-height: 4rem;
		max-height: 4rem;
		flex: 1;
		font-size: 1.5rem;
		font-weight: 600;
		border: none;
		border-radius: 0.5rem;
		background-color: var(--color-neutral-primary);
		color: var(--color-neutral-secondary);
	}

	.new-room:hover {
		cursor: pointer;
		filter: brightness(0.9);
	}

	.conditional-label {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 1.125rem;
		color: var(--color-neutral-primary);
	}

	.conditional-label > span {
		flex: 1;
		height: 1px;
		background-color: var(--color-neutral-primary);
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
		height: 100%;
		font-size: 1.25rem;
		font-weight: 600;
		padding-left: 0.5rem;
		color: var(--color-neutral-primary);
		border: none;
		border-radius: 0.25rem;
		background-color: transparent;
		outline: none;
		text-transform: uppercase;
	}

	.input-wrapper > input::placeholder {
		font-size: 1.25rem;
		font-weight: 600;
		opacity: 0.25;
		text-transform: none;
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
</style>
