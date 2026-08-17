import type { QueryKey } from "@tanstack/react-query";
import { fetchServerSnapshot } from "../mockApi";

export const NAV_DEMO_QUERY_KEY: QueryKey = ["nav-demo", "snapshot"];

// Assez court pour périmer en quelques secondes d'exploration manuelle,
// mais pas 0 — sinon la première paire de navigations serait déjà périmée
// et on perdrait le "comportement identique au premier appel" pédagogique.
export const NAV_DEMO_STALE_TIME = 4000;

export function fetchNavDemoSnapshot() {
    return fetchServerSnapshot();
}
