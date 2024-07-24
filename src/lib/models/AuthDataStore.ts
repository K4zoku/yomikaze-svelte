import type { Writable } from "svelte/store";
import type Profile from "./Profile";

export default interface AuthDataStore {
    token: Writable<string | null>;
    user: Writable<Profile | null>;
    isAuthenticated: Writable<boolean>;
}