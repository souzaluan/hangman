<script lang="ts">
	import { IconInfoCircle, IconSend2 } from '@tabler/icons-svelte';

	export let value: string;
	export let placeholder: string;

	export let onSubmit: (() => void) | undefined = undefined;

	export let info: string;
	export let variant: 'primary' | 'secondary' = 'primary';
</script>

<div class="container">
	<div
		class="wrapper"
		class:primary={variant === 'primary'}
		class:secondary={variant === 'secondary'}
	>
		<input {placeholder} bind:value />
		{#if onSubmit}
			<button type="button" on:click={onSubmit}>
				<IconSend2 size="1.75rem" />
			</button>
		{/if}
	</div>

	<div class="info" class:primary={variant === 'primary'} class:secondary={variant === 'secondary'}>
		<IconInfoCircle size="0.75rem" />
		<span>{info}</span>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.wrapper {
		height: 4rem;
		display: flex;
		align-items: center;
		padding: 0.5rem;
		border-radius: 0.5rem;
	}

	.wrapper.primary {
		background-color: var(--color-neutral-secondary);
	}
	.wrapper.secondary {
		border: 1px solid color-mix(in srgb, var(--color-neutral-primary) 35%, transparent);
	}

	.wrapper > input {
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

	.wrapper > input::placeholder {
		font-size: 1.25rem;
		opacity: 0.25;
		text-transform: none;
	}
	.wrapper.primary > input::placeholder {
		opacity: 0.25;
	}
	.wrapper.secondary > input::placeholder {
		font-weight: 400;
	}

	.wrapper > button {
		border: none;
		background-color: transparent;
		color: var(--color-neutral-primary);
		padding: 0.5rem;
	}

	.wrapper > input:read-only:hover,
	.wrapper > button:hover {
		cursor: pointer;
	}

	.info {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.875rem;
	}
	.info.primary {
		color: var(--color-neutral-secondary);
	}
	.info.secondary {
		color: color-mix(in srgb, var(--color-neutral-primary) 35%, transparent);
	}
</style>
