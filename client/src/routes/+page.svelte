<script lang="ts">
	import { socket } from '$lib/socket';
	import { NotificationType } from '$server/constants';
	import type { NotificationResponse, ProfileResponse, SetupResponse } from '$server/responses';

	import { IconHeart, IconHeartFilled } from '@tabler/icons-svelte';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import Modal from '$components/modal.svelte';
	import Header from '$components/header.svelte';
	import Input from '$components/input.svelte';

	const ALPHABET_LETTERS = Array.from(Array(26)).map((_, index) =>
		String.fromCharCode(index + 65).toUpperCase()
	);

	let roomCode = '';

	let newWord = '';
	let newWordModalIsOpen = false;

	let profile: ProfileResponse | null = null;

	let setup: SetupResponse | null = null;
	$: letters = setup?.room.letters ?? [];
	$: status = setup ? 'playing' : 'joining-or-creating';
	$: maxAttempts = setup?.room.maxAttempts ?? 0;
	$: remainingAttempts = setup?.room.remainingAttempts ?? 0;
	$: wrongGuesses = setup?.room.wrongGuesses ?? [];
	$: correctGuesses = setup?.room.correctGuesses ?? [];
	$: playerChoosesWordIsMe = profile?.id === setup?.room.playerChoosesWord;
	$: hasChosenWord = !!setup?.room.wordLength;

	let isWinnerModalIsOpen = false;
	let isLoserModalIsOpen = false;

	$: guessessStatus = Array.from(
		{ length: maxAttempts },
		(_, index): 'wrong-guess' | 'initial-state' => {
			return index >= maxAttempts - (maxAttempts - remainingAttempts)
				? 'wrong-guess'
				: 'initial-state';
		}
	);

	$: verifyLetterIsWrongGuess = (letter: string): boolean => {
		const isWrongGuess = wrongGuesses.includes(letter);
		return isWrongGuess;
	};

	$: verifyLetterIsCorrectGuess = (letter: string): boolean => {
		const isCorrectGuess = correctGuesses.includes(letter);
		return isCorrectGuess;
	};

	$: verifyLetterIsDisabled = (alphabetLetter: string): boolean => {
		return Boolean(
			verifyLetterIsWrongGuess(alphabetLetter) ||
				verifyLetterIsCorrectGuess(alphabetLetter) ||
				!hasChosenWord ||
				playerChoosesWordIsMe
		);
	};

	const handleCreateRoom = () => {
		socket.emit('create-room', (_setup: SetupResponse) => {
			setup = _setup;
		});
	};
	const handleJoinRoom = () => {
		socket.emit('join-room', roomCode, (error?: string) => {
			if (error) {
				return toast.error(error);
			}
		});
	};
	const handleSetWord = () => {
		if (!newWord.trim()) return toast.error('Digite uma palavra.');
		if (newWord.includes(' ')) return toast.error('Não pode conter espaços.');
		const hasNumberRegex = /\d/;
		if (hasNumberRegex.test(newWord)) return toast.error('A palavra não pode conter números.');

		socket.emit('set-word', { roomCode: setup?.room.id, word: newWord }, (error?: string) => {
			if (error) {
				return toast.error(error);
			}

			newWordModalIsOpen = false;
		});
	};
	const handleTakeGuess = (letter: string) => {
		socket.emit('take-guess', letter, (error?: string) => {
			if (error) {
				return toast.error(error);
			}
		});
	};
	const handlePlayAgain = () => {
		socket.emit('play-again', (error?: string) => {
			if (error) {
				return toast.error(error);
			}
		});
	};

	const handleCopyRoomCode = () => {
		if (!setup?.room.id) return;

		window.navigator.clipboard
			.writeText(setup.room.id)
			.then(() => {
				toast.success('O código da sala foi copiado!');
			})
			.catch(() => {
				toast.error('Ops! Ocorreu um erro ao copiar o código. Tente novamente');
			});
	};

	const handleLeaveRoom = () => {
		socket.emit('leave-room', (error?: string) => {
			if (error) {
				toast.error(error);
			}
		});
	};

	onMount(() => {
		socket.on('choose-word', () => {
			newWord = '';
			newWordModalIsOpen = true;
		});
		socket.on('leave-room', () => {
			profile = null;
			setup = null;
		});
		socket.on('setup', (_setup) => {
			isWinnerModalIsOpen = false;
			isLoserModalIsOpen = false;

			setup = _setup;
		});
		socket.on('profile', (_profile) => {
			profile = _profile;
		});
		socket.on('is-loser', () => {
			isLoserModalIsOpen = true;
		});
		socket.on('is-winner', () => {
			isWinnerModalIsOpen = true;
		});
		socket.on('notification', (notification: NotificationResponse) => {
			const toastTypeByNotificationType: Record<NotificationType, 'success'> = {
				[NotificationType.Success]: 'success'
			};
			const toastType = toastTypeByNotificationType[notification.type];
			toast[toastType](notification.message);
		});
	});
</script>

{#if status === 'joining-or-creating'}
	<section class="join-or-create-section">
		<div class="highlight">
			<h1>Multiplayer Hangman</h1>
			<h2>🤓 guess or die 💀</h2>
		</div>

		<div class="controls-container">
			<Input
				info="Enter room code"
				placeholder="Room code"
				bind:value={roomCode}
				onSubmit={handleJoinRoom}
			/>

			<span class="conditional-label">
				<span></span>
				or
				<span></span>
			</span>

			<button class="new-room" on:click={handleCreateRoom}>Create room</button>
		</div>
	</section>
{/if}

{#if status === 'playing'}
	<Header
		roomCode={setup?.room.id ?? ''}
		onCopyRoomCode={handleCopyRoomCode}
		onLeaveRoom={handleLeaveRoom}
	/>

	<section class="playing-section">
		<div class="guesses-status">
			{#each guessessStatus as guessStatus}
				{#if guessStatus === 'initial-state'}
					<IconHeartFilled color="var(--color-danger-primary)" size="2rem" />
				{:else}
					<IconHeart color="var(--color-danger-primary)" size="2rem" />
				{/if}
			{/each}
		</div>

		<div class="letters-container">
			{#each letters as letter}
				<p>{letter}</p>
			{/each}
		</div>

		<div class="keyboard-container">
			{#each ALPHABET_LETTERS as alphabetLetter}
				<button
					on:click={() => handleTakeGuess(alphabetLetter)}
					class:wrong-guess={verifyLetterIsWrongGuess(alphabetLetter)}
					class:correct-guess={verifyLetterIsCorrectGuess(alphabetLetter)}
					disabled={verifyLetterIsDisabled(alphabetLetter)}>{alphabetLetter}</button
				>
			{/each}
		</div>
	</section>

	<Modal isOpen={newWordModalIsOpen}>
		<div class="new-word-container">
			<h2 class="new-word-title">It's your turn!</h2>

			<Input
				info="Type a word for your opponent"
				placeholder="Type a word"
				variant="secondary"
				bind:value={newWord}
			/>

			<button class="new-word-submit-button" on:click={handleSetWord}>Let's go</button>
		</div>
	</Modal>

	<Modal isOpen={isLoserModalIsOpen}>
		<div class="result-content">
			<h2 class="new-word-title">GAME OVER</h2>

			<div class="result-content-buttons">
				<button class="leave-room-button" on:click={handleLeaveRoom}>Leave</button>
				<button class="play-again-button" on:click={handlePlayAgain}>Play again</button>
			</div>
		</div>
	</Modal>

	<Modal isOpen={isWinnerModalIsOpen}>
		<div class="result-content">
			<h2 class="new-word-title">YOU WIN</h2>

			<div class="result-content-buttons">
				<button class="leave-room-button" on:click={handleLeaveRoom}>Leave</button>
				<button class="play-again-button" on:click={handlePlayAgain}>Play again</button>
			</div>
		</div>
	</Modal>
{/if}

<style>
	.join-or-create-section {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 2rem;
		padding: 2rem;
	}

	.playing-section {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 6rem;
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

	.guesses-status {
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
	.keyboard-container > button:disabled:not(.wrong-guess, .correct-guess) {
		filter: brightness(0.85);
	}
	.keyboard-container > button:not(.wrong-guess, .correct-guess, :disabled):hover {
		cursor: pointer;
		filter: brightness(0.95);
	}

	.keyboard-container > button.wrong-guess {
		background-color: var(--color-danger-primary);
		color: var(--color-neutral-secondary);
	}
	.keyboard-container > button.correct-guess {
		background-color: var(--color-brand-secondary);
	}

	.new-word-container {
		width: 26rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;

		@media screen and (max-width: 540px) {
			width: 20rem;
		}
	}

	.new-word-title {
		font-size: 1.75rem;
		font-weight: 600;
		color: var(--color-neutral-primary);
	}

	.new-word-submit-button {
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
	.new-word-submit-button:hover {
		cursor: pointer;
		filter: brightness(0.9);
	}

	.result-content {
		width: 26rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2.5rem;

		@media screen and (max-width: 540px) {
			width: 20rem;
		}
	}
	.result-content-buttons {
		width: 100%;
		display: flex;
		gap: 1rem;
	}

	.leave-room-button {
		min-height: 4rem;
		max-height: 4rem;
		flex: 1;
		font-size: 1.5rem;
		font-weight: 600;
		border: none;
		border-radius: 0.5rem;
		background-color: var(--color-danger-primary);
		color: var(--color-neutral-secondary);
	}
	.leave-room-button:hover {
		cursor: pointer;
		filter: brightness(0.9);
	}
	.play-again-button {
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
	.play-again-button:hover {
		cursor: pointer;
		filter: brightness(0.9);
	}
</style>
