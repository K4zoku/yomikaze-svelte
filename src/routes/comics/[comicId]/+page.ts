import { ComicStatus } from '$models/Comic';
import { getChapters, getComic, normalizeComic } from '$utils/comic-utils.js';
import { LibraryManagement } from '$utils/library-utils.js';
import { getProfile } from '$utils/profile-utils';
import { getTagCategories } from '$utils/tag-utils';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = (async ({ data }) => {
  const comic = await getComic(data.comicId, data.token)
    .then(normalizeComic)
    .catch((e) => {
      throw error(e.response.status, e.response.statusText);
    });
  if (comic.status === ComicStatus.Pending) {
    if (!data.token) {
      throw error(404, 'Not found');
    }
    const user = await getProfile({ token: data.token }).catch(() => null);
    if (!user) {
      throw error(404, 'Not found');
    }
    if (
      comic.publisher.id !== user.id &&
      !user.roles.some((role) => role === 'Administrator' || role === 'Super')
    ) {
      throw error(404, 'Not found');
    }
  }
  const chapters = await getChapters(data.comicId, data.token);
  const tagCategories = await getTagCategories().catch(() => []);
  const resutls = { ...data, comic, chapters, tagCategories };
  if (data.token) {
    const libraryManager = new LibraryManagement(data.token);
    return {
      ...resutls,
      libraryManager
    };
  }
  return {
    ...resutls,
    libraryManager: null
  };
}) satisfies PageLoad;
