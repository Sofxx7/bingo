/**
 * Bingo — Local Storage Persistence
 *
 * Handles saving and loading game state and settings from localStorage
 * using segregated storage keys defined in CONFIG.
 */

import { CONFIG } from "./config.js";
import { isValidMode } from "./modes.js";

/**
 * Save the active game session to localStorage.
 * @param {Object} state - The current active game session
 */
export function saveActiveGame(state) {
  if (!CONFIG.enableLocalStorage) return;
  try {
    localStorage.setItem(CONFIG.storageKeyActiveGame, JSON.stringify(state));
  } catch {
    // Fail silently
  }
}

/**
 * Load the active game session from localStorage.
 * Returns null if no active game exists.
 * @returns {Object|null}
 */
export function loadActiveGame() {
  if (!CONFIG.enableLocalStorage) return null;
  try {
    const raw = localStorage.getItem(CONFIG.storageKeyActiveGame);
    if (!raw) return null;

    const saved = JSON.parse(raw);
    if (!saved || !saved.id || !Array.isArray(saved.calledNumbers)) return null;

    return saved;
  } catch {
    return null;
  }
}

/**
 * Clear the active game session from localStorage.
 */
export function clearActiveGame() {
  if (!CONFIG.enableLocalStorage) return;
  try {
    localStorage.removeItem(CONFIG.storageKeyActiveGame);
  } catch {
    // Fail silently
  }
}

/**
 * Save application settings to localStorage.
 * @param {{ currentMode: string }} settings
 */
export function saveSettings(settings) {
  if (!CONFIG.enableLocalStorage) return;
  try {
    localStorage.setItem(CONFIG.storageKeySettings, JSON.stringify(settings));
  } catch {
    // Fail silently
  }
}

/**
 * Load application settings from localStorage.
 * @returns {{ currentMode: string }}
 */
export function loadSettings() {
  const defaultSettings = { currentMode: CONFIG.defaultMode };
  if (!CONFIG.enableLocalStorage) return defaultSettings;

  try {
    const raw = localStorage.getItem(CONFIG.storageKeySettings);
    if (!raw) return defaultSettings;

    const parsed = JSON.parse(raw);
    const currentMode =
      parsed && typeof parsed.currentMode === "string" && isValidMode(parsed.currentMode)
        ? parsed.currentMode
        : CONFIG.defaultMode;

    return { currentMode };
  } catch {
    return defaultSettings;
  }
}
