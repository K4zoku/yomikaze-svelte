import {
  getLatestComics,
  getPopularComics,
  getRecentComics,
  getLatestChapter
} from '$utils/comic-utils';
import type Comic from '$models/Comic';
import type Chapter from '$models/Chapter';
interface ComicWithLastestChapter extends Comic {
  chapter: Promise<Chapter>;
}

export const ssr = false;

export async function load() {
  const popular = getPopularComics();
  const latest = getLatestComics().then(async (lastest) => {
    const result: ComicWithLastestChapter[] = [];
    for (const comic of lastest) {
      result.push({ ...comic, chapter: getLatestChapter(comic.id) });
    }
    return result;
  });
  const recent = getRecentComics();
  return {
    popular,
    latest,
    recent
  };
}
