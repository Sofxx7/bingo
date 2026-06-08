/**
 * Bingo — Application Entry Point
 *
 * Initializes the theme, branding, board, state, and event listeners.
 */

import { CONFIG } from "./config.js";
import {
  initState,
  toggleNumber,
  resetGame,
  getCalledNumbers,
  getLatest,
  getCount,
} from "./state.js";
import { renderBoard, updateBoardState } from "./board.js";
import {
  initUI,
  applyBranding,
  applyTheme,
  updateCallout,
  updateRecent,
  updateCounter,
} from "./ui.js";

// ─── Bootstrap ───────────────────────────────────────────────

const boardEl = document.getElementById("board");
const resetBtn = document.getElementById("resetButton");

// Apply theme and branding
applyTheme();
initUI();
applyBranding();

// Load saved state and render
initState();
renderBoard(boardEl);
renderFullState(false);

// ─── Event Listeners ─────────────────────────────────────────

boardEl.addEventListener("click", (event) => {
  const btn = event.target.closest(".number");
  if (!btn) return;

  const num = Number(btn.dataset.number);
  const wasMarked = toggleNumber(num);
  renderFullState(wasMarked);
});

resetBtn.addEventListener("click", () => {
  if (!confirm(CONFIG.labels.resetConfirm)) return;
  resetGame();
  renderFullState(false);
});

// ─── Render Helpers ──────────────────────────────────────────

/**
 * Synchronize all UI elements with the current game state.
 * @param {boolean} animate — whether to trigger the callout animation
 */
function renderFullState(animate) {
  const called = getCalledNumbers();
  const latest = getLatest();
  const count = getCount();

  updateBoardState(called, latest);
  updateCallout(latest, count, animate);
  updateRecent(called);
  updateCounter(count);
}
