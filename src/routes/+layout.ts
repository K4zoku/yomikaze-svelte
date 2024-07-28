import { preferences } from "~/store";
export const ssr = false;

export function load({ data }) {
    let screenWidth = window.innerWidth;
    const drawerOpened = screenWidth > 1280;
    return {
        preferences,
        drawerOpened,
        ...data,
    };
}