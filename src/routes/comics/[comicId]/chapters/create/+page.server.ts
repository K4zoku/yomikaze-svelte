import { getAndVerifyToken, getUserId } from '$utils/auth-server-utils';
import type { PageServerLoad } from './$types';
import { getComic, normalizeComic } from '$utils/comic-utils.js';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = (async ({ cookies, params }) => {
  const token = await getAndVerifyToken(cookies);
  const comicId = params.comicId;
  const comic = await getComic(params.comicId, token)
    .then(normalizeComic)
    .catch((e) => {
      throw error(e.response.status, e.response.statusText);
    });
  if (!comic) {
    throw error(404, 'Comic not found');
  }
  if (comic.publisher.id !== (await getUserId(token))) {
    throw error(403, 'Forbidden');
  }

  return {
    token,
    comicId,
    comic
  };
}) satisfies PageServerLoad;
