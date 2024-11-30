import { writable } from 'svelte/store';

function createTitle() {
	const { subscribe, set } = writable('');

	return {
		subscribe,
		set: (value: string) => {
			set(`Hangman • ${value}`);
		},
		clear: () => {
			set('Hangman');
		}
	};
}

export const title = createTitle();
