<script lang="ts">
	import { IconArrowLeft, IconCopy } from "@tabler/icons-svelte";

	export let onLeftRoom: () => void;
	export let onCopyRoomCode: () => void;
	export let roomCode: string
</script>

<header class="container">
	<button
		type="button"
		class="back"
		title="Left room"
		on:click={onLeftRoom}
	>
		<IconArrowLeft size="2rem" />
	</button>

	<button
		type="button"
		class="copy-room-code"
		title="Copy room code"
		on:click={onCopyRoomCode}
	>
		<IconCopy />
		{roomCode}
	</button>
</header>

<style>
    .container {
		width: 100%;
		height: 6rem;
		padding-left: 2rem;
		padding-right: 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.back {
		height: 2.5rem;
		width: 2.5rem;
		background-color: transparent;
	}
	.back:hover {
		background-color: color-mix(in srgb, var(--color-neutral-primary) 7.5%, transparent);
	}

	.copy-room-code {
		display: flex;
		gap: 4px;
		align-items: center;
		font-size: 1.25rem;
		font-weight: 600;
		padding: 0.5rem 1rem;
		background-color: color-mix(in srgb, var(--color-neutral-secondary) 80%, transparent);
	}
	.copy-room-code:hover {
		filter: brightness(0.95);
	}

	.back,
	.copy-room-code {
		border: none;
		border-radius: 999px;
		color: var(--color-neutral-primary);
	}
	.back:hover,
	.copy-room-code:hover {
		cursor: pointer;
	}
</style>
