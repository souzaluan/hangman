import type { Load } from '@sveltejs/kit';

export const load: Load = ({ params }) => {
	return {
		code: params.slug
	};
};
