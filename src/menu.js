/**
 * Bingo — Home Menu Controller
 *
 * Handles logic for index.html.
 */

import { CONFIG } from "./config.js";
import { loadActiveGame, saveActiveGame, clearActiveGame, loadSettings, saveSettings } from "./storage.js";
import { getHistory } from "./history.js";
import {
  initUI,
  applyBranding,
  applyTheme,
  renderHome,
  renderHomeMode,
  showModeSelector,
} from "./ui.js";

// Bootstrap UI
applyTheme();
initUI();
applyBranding();

// Load settings and render default mode
const settings = loadSettings();
let defaultMode = settings.currentMode;
renderHomeMode(defaultMode);

// Render active game panel and stats
let activeGame = loadActiveGame();
const history = getHistory();
renderHome(activeGame, history);

// DOM elements for navigation and overlays
const homeStartBtn = document.getElementById("homeStartBtn");
const homeContinueBtn = document.getElementById("homeContinueBtn");
const homeHistoryBtn = document.getElementById("homeHistoryBtn");
const homeChangeModeBtn = document.getElementById("homeChangeModeBtn");

// Confirm Overwrite Modal elements
const confirmOverlay = document.getElementById("confirmOverwriteOverlay");
const confirmContinueBtn = document.getElementById("confirmContinueBtn");
const confirmOverwriteBtn = document.getElementById("confirmOverwriteBtn");
const confirmCancelBtn = document.getElementById("confirmCancelBtn");

// ─── Button Actions ──────────────────────────────────────────

// "Nueva Partida" button
if (homeStartBtn) {
  homeStartBtn.addEventListener("click", () => {
    activeGame = loadActiveGame();
    if (activeGame) {
      // Show overwrite warning modal
      if (confirmOverlay) confirmOverlay.classList.add("visible");
    } else {
      // Start a clean mode selection
      openNewGameModeSelector();
    }
  });
}

// "Continuar Partida" button
if (homeContinueBtn) {
  homeContinueBtn.addEventListener("click", () => {
    window.location.href = "juego.html";
  });
}

// "Historial" button
if (homeHistoryBtn) {
  homeHistoryBtn.addEventListener("click", () => {
    window.location.href = "historial.html";
  });
}

// "Cambiar modo" button on index.html
if (homeChangeModeBtn) {
  homeChangeModeBtn.addEventListener("click", () => {
    const settings = loadSettings();
    showModeSelector(settings.currentMode, (modeKey) => {
      // Update default settings mode
      saveSettings({ currentMode: modeKey });
      renderHomeMode(modeKey);
      
      // If there is an active game, update its modeId too
      const active = loadActiveGame();
      if (active) {
        active.modeId = modeKey;
        saveActiveGame(active);
        renderHome(active, getHistory());
      }
    });
  });
}

// ─── Confirm Overwrite Modal Actions ──────────────────────────

if (confirmContinueBtn) {
  confirmContinueBtn.addEventListener("click", () => {
    if (confirmOverlay) confirmOverlay.classList.remove("visible");
    window.location.href = "juego.html";
  });
}

if (confirmOverwriteBtn) {
  confirmOverwriteBtn.addEventListener("click", () => {
    if (confirmOverlay) confirmOverlay.classList.remove("visible");
    // Clear active session in storage
    clearActiveGame();
    // Open mode selector for new game
    openNewGameModeSelector();
  });
}

if (confirmCancelBtn) {
  confirmCancelBtn.addEventListener("click", () => {
    if (confirmOverlay) confirmOverlay.classList.remove("visible");
  });
}

// Close overwrite confirmation on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && confirmOverlay && confirmOverlay.classList.contains("visible")) {
    confirmOverlay.classList.remove("visible");
  }
});

// ─── Helpers ──────────────────────────────────────────────────

/**
 * Open the mode selector modal to start a new game session.
 */
function openNewGameModeSelector() {
  const settings = loadSettings();
  showModeSelector(settings.currentMode, (modeKey) => {
    // Create new active game state
    const newActiveGame = {
      id: `game-${Date.now()}`,
      modeId: modeKey,
      startedAt: new Date().toISOString(),
      finishedAt: null,
      calledNumbers: [],
      latest: null,
      winners: []
    };
    saveActiveGame(newActiveGame);
    
    // Redirect to play board
    window.location.href = "juego.html";
  });
}
