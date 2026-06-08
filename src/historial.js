/**
 * Bingo — History View Controller
 *
 * Handles logic for historial.html.
 */

import { CONFIG } from "./config.js";
import { getHistory, clearHistory } from "./history.js";
import { initUI, applyBranding, applyTheme, renderHistory } from "./ui.js";

// Bootstrap UI
applyTheme();
initUI();
applyBranding();

// Render full history list
const historyList = getHistory();
renderHistory(historyList);

// DOM elements
const historyBackBtn = document.getElementById("historyBackBtn");
const historyClearBtn = document.getElementById("historyClearBtn");

// "Volver" button
if (historyBackBtn) {
  historyBackBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

// "Limpiar historial" button
if (historyClearBtn) {
  historyClearBtn.addEventListener("click", () => {
    if (!confirm(CONFIG.labels.clearHistoryConfirm)) return;
    clearHistory();
    renderHistory([]);
  });
}
