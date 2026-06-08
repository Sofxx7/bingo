/**
 * Bingo — Game History Management
 *
 * Handles completed games history using segregated localStorage keys.
 */

import { CONFIG } from "./config.js";

/**
 * Game object structure reference for history:
 * {
 *   id: string,
 *   modeId: string,
 *   startedAt: string,        // ISO timestamp
 *   finishedAt: string,       // ISO timestamp
 *   calledNumbers: number[],
 *   latest: number|null,
 *   winners: Array<{name: string, registeredAt: string}>
 * }
 */

/**
 * Get all completed games from localStorage, sorted newest first.
 * @returns {Array}
 */
export function getHistory() {
  if (!CONFIG.enableLocalStorage) return [];
  try {
    const raw = localStorage.getItem(CONFIG.storageKeyHistory);
    if (!raw) return [];
    
    const history = JSON.parse(raw);
    if (!Array.isArray(history)) return [];
    
    return history;
  } catch (e) {
    console.error("Failed to load game history:", e);
    return [];
  }
}

/**
 * Add a completed game to the history list.
 * @param {Object} game
 */
export function addGameToHistory(game) {
  if (!CONFIG.enableLocalStorage) return;
  try {
    const history = getHistory();
    history.unshift(game); // Add to beginning (newest first)
    localStorage.setItem(CONFIG.storageKeyHistory, JSON.stringify(history));
  } catch (e) {
    console.error("Failed to add game to history:", e);
  }
}

/**
 * Clear all game history.
 */
export function clearHistory() {
  if (!CONFIG.enableLocalStorage) return;
  try {
    localStorage.removeItem(CONFIG.storageKeyHistory);
  } catch (e) {
    console.error("Failed to clear game history:", e);
  }
}

/**
 * Group list of games by their finished date string (YYYY-MM-DD).
 * @param {Array} games
 * @returns {Object} Key: date, Value: Array of games
 */
export function groupGamesByDate(games) {
  return games.reduce((groups, game) => {
    const dateSrc = game.finishedAt || game.startedAt || new Date().toISOString();
    const dateKey = dateSrc.split("T")[0];
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(game);
    return groups;
  }, {});
}
