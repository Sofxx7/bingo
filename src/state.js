/**
 * Bingo — Game State Management
 *
 * Encapsulates the active game session state and helper functions.
 * Does not interact with the DOM.
 */

import { CONFIG } from "./config.js";
import { saveActiveGame, loadActiveGame, clearActiveGame as clearActiveGameStorage } from "./storage.js";

// ─── Internal State ──────────────────────────────────────────
let activeGame = null;

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

export function getGameId() {
  return activeGame ? activeGame.id : null;
}

export function getMode() {
  return activeGame ? activeGame.modeId : CONFIG.defaultMode;
}

export function getStartedAt() {
  return activeGame ? activeGame.startedAt : null;
}

export function getCalledNumbers() {
  return activeGame ? [...activeGame.calledNumbers] : [];
}

export function getLatest() {
  return activeGame ? activeGame.latest : null;
}

export function getCount() {
  return activeGame ? activeGame.calledNumbers.length : 0;
}

export function getWinners() {
  return activeGame ? [...activeGame.winners] : [];
}

export function isCalled(num) {
  return activeGame ? activeGame.calledNumbers.includes(num) : false;
}

export function hasActiveGame() {
  return activeGame !== null;
}

// ─── State Mutations ─────────────────────────────────────────

/**
 * Toggle a number on/off. Returns whether the number is now called.
 * @param {number} num
 * @returns {boolean} true if the number was marked, false if unmarked
 */
export function toggleNumber(num) {
  if (!activeGame) return false;

  if (activeGame.calledNumbers.includes(num)) {
    activeGame.calledNumbers = activeGame.calledNumbers.filter((n) => n !== num);
    activeGame.latest = activeGame.calledNumbers.at(-1) || null;
    persistState();
    return false;
  }

  activeGame.calledNumbers.push(num);
  activeGame.latest = num;
  persistState();
  return true;
}

/**
 * Set the game mode of the active game.
 * @param {string} mode
 */
export function setMode(mode) {
  if (activeGame) {
    activeGame.modeId = mode;
    persistState();
  }
}

/**
 * Start a brand new active game session.
 * @param {string} mode - The chosen game mode
 */
export function startNewGame(mode) {
  activeGame = {
    id: `game-${Date.now()}`,
    modeId: mode || CONFIG.defaultMode,
    startedAt: new Date().toISOString(),
    finishedAt: null,
    calledNumbers: [],
    latest: null,
    winners: [],
  };
  persistState();
}

/**
 * Add a winner to the current active game.
 * @param {string} name - Winner's name
 * @returns {Object} The registered winner object
 */
export function addWinner(name) {
  if (!activeGame) return null;

  const winner = {
    name: name.trim() || `Ganador #${activeGame.winners.length + 1}`,
    registeredAt: new Date().toISOString(),
  };
  activeGame.winners.push(winner);
  persistState();
  return winner;
}

/**
 * Reset numbers and winners of the active game, keeping session ID and mode.
 */
export function resetGame() {
  if (activeGame) {
    activeGame.calledNumbers = [];
    activeGame.latest = null;
    activeGame.winners = [];
    persistState();
  }
}

/**
 * Clear the current active game session completely.
 */
export function clearActiveGame() {
  activeGame = null;
  clearActiveGameStorage();
}

/**
 * Initialize state from localStorage.
 */
export function initState() {
  activeGame = loadActiveGame();
}

// ─── Persistence ─────────────────────────────────────────────

function persistState() {
  if (activeGame) {
    saveActiveGame(activeGame);
  }
}
