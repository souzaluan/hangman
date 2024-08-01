<script lang="ts">
	import { goto } from '$app/navigation';
	import toast from 'svelte-french-toast';
	import { IconArrowLeft, IconCopy, IconHeart, IconHeartFilled } from '@tabler/icons-svelte';

	export let data: { code: string };
	const { code: roomCode } = data;

	const MAX_ATTEMPTS = 5;
	const ALPHABET_LETTERS = Array.from(Array(26)).map((_, index) => String.fromCharCode(index + 65));

	const word = 'SECRET';
	const letters = word.split('');

	let attempts: string[] = [];
	$: wrongAttempts = attempts.filter((attempt) => !letters.includes(attempt)).length;
	$: attemptsStatus = Array.from(
		{ length: MAX_ATTEMPTS },
		(_, index): 'wrong-attempt' | 'initial-state' => {
			return index >= MAX_ATTEMPTS - wrongAttempts ? 'wrong-attempt' : 'initial-state';
		}
	);

	$: verifyCurrentLetterWasTried = (letter: string): boolean => {
		const currentLetterWasTried = attempts.includes(letter);
		return currentLetterWasTried;
	};

	$: verifyLetterIsWrongAttempt = (letter: string): boolean => {
		const isWrongAttempt = attempts.includes(letter) && !letters.includes(letter);
		return isWrongAttempt;
	};

	$: verifyLetterIsRightAttempt = (letter: string): boolean => {
		const isRightAttempt = attempts.includes(letter) && letters.includes(letter);
		return isRightAttempt;
	};

	const copyRoomCode = () => {
		window.navigator.clipboard
			.writeText(roomCode)
			.then(() => {
				toast.success('O código da sala foi copiado!');
			})
			.catch(() => {
				toast.error('Ops! Ocorreu um erro ao copiar o código. Tente novamente');
			});
	};
</script>

<header class="page-header">
	<button type="button" class="back" title="Left room" on:click={() => goto('/')}>
		<IconArrowLeft size="2rem" />
	</button>

	<button type="button" class="copy-room-code" title="Copy room code" on:click={copyRoomCode}>
		<IconCopy />
		{roomCode}
	</button>
</header>

<section>
	<div class="attempts-status">
		{#each attemptsStatus as attemptStatus}
			{#if attemptStatus === 'initial-state'}
				<IconHeartFilled color="var(--color-danger-primary)" size="2rem" />
			{:else}
				<IconHeart color="var(--color-danger-primary)" size="2rem" />
			{/if}
		{/each}
	</div>

	<div class="letters-container">
		{#each letters as letter}
			{#if verifyCurrentLetterWasTried(letter)}
				<p>{letter}</p>
			{:else}
				<p>_</p>
			{/if}
		{/each}
	</div>

	<div class="keyboard-container">
		{#each ALPHABET_LETTERS as alphabetLetter}
			<button
				on:click={() => (attempts = [...attempts, alphabetLetter])}
				class:wrong-attempt={verifyLetterIsWrongAttempt(alphabetLetter)}
				class:right-attempt={verifyLetterIsRightAttempt(alphabetLetter)}
				disabled={verifyLetterIsWrongAttempt(alphabetLetter) ||
					verifyLetterIsRightAttempt(alphabetLetter)}>{alphabetLetter}</button
			>
		{/each}
	</div>
</section>

<style>
	.page-header {
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

	section {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 6rem;
		padding: 2rem;
	}

	.attempts-status {
		display: flex;
		gap: 0.25rem;
		background-color: var(--color-neutral-secondary);
		border-radius: 999px;
		padding: 0.5rem 0.75rem;
		box-shadow: 0px 0px 0.25rem color-mix(in srgb, var(--color-neutral-primary) 40%, transparent);
	}

	.letters-container {
		display: flex;
		gap: 1rem;
	}

	.letters-container > p {
		font-size: 2.5rem;
		font-weight: 600;
		color: var(--color-neutral-primary);
	}

	.keyboard-container {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.5rem;
		width: 100%;
		max-width: 28rem;
	}

	.keyboard-container > button {
		width: 4rem;
		height: 4rem;
		font-size: 1.5rem;
		background-color: var(--color-neutral-secondary);
		box-shadow: 0px 0px 0.25rem color-mix(in srgb, var(--color-neutral-primary) 50%, transparent);
		border: transparent;
		border-radius: 0.5rem;
		color: var(--color-neutral-primary);
	}
	.keyboard-container > button:not(.wrong-attempt, .right-attempt):hover {
		cursor: pointer;
		filter: brightness(0.95);
	}

	.keyboard-container > button.wrong-attempt {
		background-color: var(--color-danger-primary);
		color: var(--color-neutral-secondary);
	}
	.keyboard-container > button.right-attempt {
		background-color: var(--color-brand-secondary);
	}
</style>
