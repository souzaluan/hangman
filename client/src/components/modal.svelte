<script lang="ts">
	export let isOpen: boolean;

	let dialog: HTMLDialogElement;

	$: if (dialog && isOpen) dialog.showModal();
	$: if (dialog && !isOpen) dialog.close();
</script>

<dialog bind:this={dialog} on:close={() => (isOpen = false)}>
	<slot />
</dialog>

<style>
	dialog {
		border-radius: 1rem;
		border: none;
		outline: none;
		padding: 1.5rem;
		box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.4);
		top: 50%;
		left: 50%;
		transform: translateX(-50%) translateY(-50%);
		background-color: var(--color-neutral-secondary);
	}
	dialog::backdrop {
		background-color: rgba(0, 0, 0, 0.3);
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
