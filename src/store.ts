import type Preferences from "$models/Preferences";
import type Profile from "$models/Profile";
import { persistent } from "@furudean/svelte-persistent-store"
import { writable, type Writable } from "svelte/store";

export const token: Writable<string | false> = persistent({
    key: 'token',
    start_value: false,
    storage_type: 'localStorage'
});

export const user: Writable<Profile | false> = persistent({
    key: 'user',
    start_value: false,
    storage_type: 'localStorage',
});

export const isAuthenticated: Writable<boolean> = writable(false);

export const preferences: Writable<Preferences> = persistent({
    start_value: {
      theme: ''
    },
    key: 'preferences',
    storage_type: 'localStorage'
  });