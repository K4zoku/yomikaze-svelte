import type Preferences from "$models/Preferences";
import { persistent } from "@furudean/svelte-persistent-store"
import type { Writable } from "svelte/store";

export const preferences: Writable<Preferences> = persistent({
    start_value: {
      theme: ''
    },
    key: 'preferences',
    storage_type: 'localStorage'
  });