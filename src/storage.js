/**
 * Bingo — Local Storage Persistence
 *
 * Handles saving and loading game state from localStorage.
 * Respects CONFIG.enableLocalStorage — when disabled, all operations are no-ops.
 */

import { CONFIG } from "./config.js";

/**
 * Save the current game state to localStorage.
 * @param {{ calledNumbers: number[], latest: number|null }} state
 */
export function saveState(state) {
  if (!CONFIG.enableLocalStorage) return;

  try {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(state));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

/**
 * Load game state from localStorage.
 * Returns null if no valid state is found.
 * @returns {{ calledNumbers: number[], latest: number|null } | null}
 */
export function loadState() {
  if (!CONFIG.enableLocalStorage) return null;

  try {
    const raw = localStorage.getItem(CONFIG.storageKey);
    if (!raw) return null;

    const saved = JSON.parse(raw);
    if (!saved || !Array.isArray(saved.calledNumbers)) return null;

    const maxNumber = CONFIG.totalNumbers;
    const calledNumbers = saved.calledNumbers
      .map(Number)
      .filter((n) => Number.isInteger(n) && n >= 1 && n <= maxNumber);

    const latest =
      Number.isInteger(saved.latest) && calledNumbers.includes(saved.latest)
        ? saved.latest
        : calledNumbers.at(-1) || null;

    return { calledNumbers, latest };
  } catch {
    return null;
  }
}

/**
 * Clear the stored game state.
 */
export function clearState() {
  if (!CONFIG.enableLocalStorage) return;

  try {
    localStorage.removeItem(CONFIG.storageKey);
  } catch {
    // Fail silently
  }
}
