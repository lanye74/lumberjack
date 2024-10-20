import {derived, writable} from "svelte/store";

import {formatPixels} from "$utils/formatters.js";



export const navbarHeight = writable(0);

export const formattedNavbarHeight = derived(navbarHeight, (height) => formatPixels(height));
