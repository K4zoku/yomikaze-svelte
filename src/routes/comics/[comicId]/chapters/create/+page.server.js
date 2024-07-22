import { error } from '@sveltejs/kit';
import http from '$lib/http.js';
export async function load({ params }) {
	let key = params.key;

	let response = await http.get(`/comics/${key}`);
	console.log(response);
	if (response.status == 404) {
		return {};
	}
	return {
		comic: response.data
	};
}
