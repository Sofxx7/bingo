/**
 * Bingo — Game State Management
 *
 * Encapsulates all mutable game state and provides functions
 * to query and modify it. Does NOT interact with the DOM.
 */

import { CONFIG } from "./config.js";
import { saveState, loadState, clearState } from "./storage.js";

// ─── Internal State ──────────────────────────────────────────
let calledNumbers = [];
let latest = null;

// ─── Helpers ─────────────────────────────────────────────────

/**
 * Get the BINGO column letter for a given number.
 * @param {number} num
 * @returns {string}
 */
export function getLetter(num) {
  const col = CONFIG.columns.find((c) => num >= c.start && num <= c.end);
  return col ? col.letter : "?";
}

/**
 * Format a number with its letter prefix, e.g. "B-7".
 * @param {number} num
 * @returns {string}
 */
export function formatNumber(num) {
  return `${getLetter(num)}-${num}`;
}

// ─── State Accessors ─────────────────────────────────────────

export function getCalledNumbers() {
  return [...calledNumbers];
}

export function getLatest() {
  return latest;
}

export function getCount() {
  return calledNumbers.length;
}

export function isCalled(num) {
  return calledNumbers.includes(num);
}

// ─── State Mutations ─────────────────────────────────────────

/**
 * Toggle a number on/off. Returns whether the number is now called.
 * @param {number} num
 * @returns {boolean} true if the number was marked, false if unmarked
 */
export function toggleNumber(num) {
  if (calledNumbers.includes(num)) {
    calledNumbers = calledNumbers.filter((n) => n !== num);
    latest = calledNumbers.at(-1) || null;
    persistState();
    return false;
  }

  calledNumbers.push(num);
  latest = num;
  persistState();
  return true;
}

/**
 * Reset the game to its initial empty state.
 */
export function resetGame() {
  calledNumbers = [];
  latest = null;
  clearState();
}

/**
 * Initialize state from localStorage (if available).
 */
export function initState() {
  const saved = loadState();
  if (saved) {
    calledNumbers = saved.calledNumbers;
    latest = saved.latest;
  }
}

// ─── Persistence ─────────────────────────────────────────────

function persistState() {
  saveState({ calledNumbers, latest });
}
