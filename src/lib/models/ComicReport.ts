import type Profile from '$components/profile.svelte';
import type Comic from './Comic';
import type Model from './Model';

export default interface ComicReport extends Model {
  description: string;
  categoryId: string;
  reporterId: string;
  dismissalReason: string;
  reporter: Profile;
  readonly status: string;
  readonly comic: Comic;
}
