/**
 * Bingo — UI Updates
 *
 * Functions that update specific DOM regions:
 * callout panel, recent bubbles, counter, and branding.
 */

import { CONFIG } from "./config.js";
import { getLetter, formatNumber } from "./state.js";

// ─── Cached DOM Elements ────────────────────────────────────
let els = {};

/**
 * Cache references to DOM elements used by UI functions.
 * Call once after DOMContentLoaded.
 */
export function initUI() {
  els = {
    calledPanel: document.getElementById("calledPanel"),
    lastNumber: document.getElementById("lastNumber"),
    lastPlain: document.getElementById("lastPlain"),
    count: document.getElementById("count"),
    recentNumbers: document.getElementById("recentNumbers"),
    logo: document.getElementById("logo"),
    kicker: document.getElementById("kicker"),
    appTitle: document.getElementById("appTitle"),
    subtitle: document.getElementById("subtitle"),
    totalDisplay: document.getElementById("totalDisplay"),
    labelCalled: document.getElementById("labelCalled"),
    historyTitle: document.getElementById("historyTitle"),
    boardTitle: document.getElementById("boardTitle"),
    bingoLetters: document.getElementById("bingoLetters"),
    resetButton: document.getElementById("resetButton"),
  };
}

/**
 * Apply branding from CONFIG to the DOM.
 */
export function applyBranding() {
  if (els.logo) {
    els.logo.src = CONFIG.logoPath;
    els.logo.alt = CONFIG.logoAlt;
  }
  if (els.kicker) els.kicker.textContent = CONFIG.kicker;
  if (els.appTitle) els.appTitle.textContent = CONFIG.appName;
  if (els.subtitle) els.subtitle.textContent = CONFIG.subtitle;
  if (els.totalDisplay) els.totalDisplay.textContent = CONFIG.totalNumbers;
  if (els.labelCalled) els.labelCalled.textContent = CONFIG.labels.calledNumber;
  if (els.historyTitle)
    els.historyTitle.textContent = CONFIG.labels.recentTitle;
  if (els.boardTitle) els.boardTitle.textContent = CONFIG.labels.boardTitle;
  if (els.bingoLetters)
    els.bingoLetters.textContent = CONFIG.labels.bingoLetters;
  if (els.resetButton)
    els.resetButton.textContent = CONFIG.labels.resetButton;
}

/**
 * Inject CONFIG.theme colors as CSS custom properties on :root.
 */
export function applyTheme() {
  const root = document.documentElement;
  const map = {
    "--primary": CONFIG.theme.primary,
    "--primary-light": CONFIG.theme.primaryLight,
    "--primary-mid": CONFIG.theme.primaryMid,
    "--accent": CONFIG.theme.accent,
    "--accent-soft": CONFIG.theme.accentSoft,
    "--background": CONFIG.theme.background,
    "--panel-bg": CONFIG.theme.panelBg,
    "--panel-soft": CONFIG.theme.panelSoft,
    "--text": CONFIG.theme.text,
    "--muted": CONFIG.theme.muted,
    "--line": CONFIG.theme.line,
  };

  for (const [prop, value] of Object.entries(map)) {
    root.style.setProperty(prop, value);
  }
}

/**
 * Update the callout panel showing the last called number.
 * @param {number|null} latest
 * @param {number} count
 * @param {boolean} animate — trigger the sweep animation
 */
export function updateCallout(latest, count, animate) {
  if (latest) {
    els.lastNumber.className = "last-number";
    els.lastNumber.textContent = formatNumber(latest);
    els.lastPlain.textContent = CONFIG.labels.statusTemplate
      .replace("{count}", count)
      .replace("{total}", CONFIG.totalNumbers);
  } else {
    els.lastNumber.className = "placeholder";
    els.lastNumber.textContent = "—";
    els.lastPlain.textContent = CONFIG.labels.waitingMessage;
  }

  if (animate && latest && CONFIG.enableAnimations) {
    els.calledPanel.classList.remove("flash");
    void els.calledPanel.offsetWidth; // force reflow
    els.calledPanel.classList.add("flash");
  }
}

/**
 * Update the recent-numbers bubble strip.
 * @param {number[]} calledNumbers
 */
export function updateRecent(calledNumbers) {
  els.recentNumbers.innerHTML = "";
  const recent = calledNumbers.slice(-CONFIG.recentCount).reverse();
  const slots = recent.length
    ? recent
    : Array.from({ length: CONFIG.recentCount }, () => null);

  for (let i = 0; i < slots.length; i++) {
    const num = slots[i];
    const bubble = document.createElement("div");

    if (num) {
      bubble.className = i === 0 ? "bubble current" : "bubble previous";

      if (i === 0) {
        bubble.dataset.label = CONFIG.labels.lastBubbleLabel;
      }

      const content = document.createElement("span");
      content.textContent = String(num);

      const letterEl = document.createElement("small");
      letterEl.textContent = getLetter(num);
      content.append(letterEl);

      bubble.append(content);
    } else {
      bubble.className = "bubble empty";
      bubble.textContent = "—";
    }

    els.recentNumbers.append(bubble);
  }
}

/**
 * Update the called-numbers counter.
 * @param {number} count
 */
export function updateCounter(count) {
  els.count.textContent = count;
}
