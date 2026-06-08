/**
 * Bingo — Play Board Controller
 *
 * Handles logic for juego.html.
 */

import { CONFIG } from "./config.js";
import {
  initState,
  hasActiveGame,
  getMode,
  getCalledNumbers,
  getLatest,
  getCount,
  getWinners,
  getGameId,
  getStartedAt,
  toggleNumber,
  resetGame,
  addWinner,
  setMode,
  clearActiveGame,
} from "./state.js";
import { renderBoard, updateBoardState } from "./board.js";
import {
  initUI,
  applyBranding,
  applyTheme,
  updateCallout,
  updateRecent,
  updateCounter,
  renderModeIndicator,
  showModeSelector,
  showModeReminder,
  showWinnerModal,
} from "./ui.js";
import { addGameToHistory } from "./history.js";

// Load active game state
initState();

// Security check: Redirect to index.html if no game session is active
if (!hasActiveGame()) {
  window.location.href = "index.html";
} else {
  // Bootstrap UI and layout
  applyTheme();
  initUI();
  applyBranding();

  // Cache elements and render board
  const boardEl = document.getElementById("board");
  const resetBtn = document.getElementById("resetButton");
  const winnerBtn = document.getElementById("winnerBtn");
  const menuBtn = document.getElementById("menuBtn");
  const finalizeBtn = document.getElementById("finalizeBtn");
  const brandLogoButton = document.getElementById("brandLogoButton");

  renderBoard(boardEl);
  renderModeIndicator(getMode(), openModeSelector);
  renderFullState(false);

  // Auto-show fullscreen mode reminder on a completely fresh game start
  if (getCount() === 0 && getWinners().length === 0) {
    showModeReminder(getMode());
  }

  // ─── Event Listeners ─────────────────────────────────────────

  // Number cells board clicks
  boardEl.addEventListener("click", (event) => {
    const btn = event.target.closest(".number");
    if (!btn) return;

    const num = Number(btn.dataset.number);
    const wasMarked = toggleNumber(num);
    renderFullState(wasMarked);
  });

  // "Reiniciar" button (reset current session numbers)
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (!confirm(CONFIG.labels.resetConfirm)) return;
      resetGame();
      renderFullState(false);
    });
  }

  // "¡BINGO!" button (registers winners in active session)
  if (winnerBtn) {
    winnerBtn.addEventListener("click", () => {
      showWinnerModal(
        {
          mode: getMode(),
          calledNumbersCount: getCount(),
          winners: getWinners(),
        },
        (name) => {
          addWinner(name);
        }
      );
    });
  }

  // Click logo to show fullscreen pattern reminder overlay
  if (brandLogoButton) {
    brandLogoButton.addEventListener("click", () => {
      showModeReminder(getMode());
    });
  }

  // "Menú" button: Redirects back without closing/deleting session
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  // "Finalizar" button: Ends the game session and saves to history
  if (finalizeBtn) {
    finalizeBtn.addEventListener("click", () => {
      const winnersCount = getWinners().length;
      let userConfirmed = false;

      if (winnersCount === 0) {
        // Warning confirmation if no winners are registered
        userConfirmed = confirm(CONFIG.labels.finishGameNoWinnersConfirm);
      } else {
        userConfirmed = confirm(CONFIG.labels.finishGameHasWinnersConfirm);
      }

      if (userConfirmed) {
        const gameRecord = {
          id: getGameId() || `game-${Date.now()}`,
          modeId: getMode(),
          startedAt: getStartedAt() || new Date().toISOString(),
          finishedAt: new Date().toISOString(),
          calledNumbers: getCalledNumbers(),
          latest: getLatest(),
          winners: getWinners(),
        };

        // Add to history
        addGameToHistory(gameRecord);

        // Clear active game session state
        clearActiveGame();

        // Redirect back to Home
        window.location.href = "index.html";
      }
    });
  }

  // ─── Mode System ─────────────────────────────────────────────

  /**
   * Open the mode selector overlay inside game.
   */
  function openModeSelector() {
    showModeSelector(getMode(), handleModeSelect);
  }

  /**
   * Handle mode selection from overlay in play.
   * @param {string} modeKey
   */
  function handleModeSelect(modeKey) {
    setMode(modeKey);
    renderModeIndicator(modeKey, openModeSelector);
  }

  // ─── Render Helpers ──────────────────────────────────────────

  /**
   * Synchronize board, callout, recent, and counter UI elements.
   * @param {boolean} animate
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
}
