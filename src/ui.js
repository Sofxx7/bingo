/**
 * Bingo — UI Updates
 *
 * Functions that update specific DOM elements for Home, Game Board, and History views.
 * Supports modales with close buttons and escape key listeners.
 */

import { CONFIG } from "./config.js";
import { getLetter, formatNumber } from "./state.js";
import { MODE_ORDER, getModeDefinition } from "./modes.js";
import { groupGamesByDate } from "./history.js";

// ─── Cached DOM Elements ────────────────────────────────────
let els = {};
let reminderTimeout = null;
let modeSelectorEscHandler = null;
let winnerModalEscHandler = null;
let reminderEscHandler = null;

/**
 * Cache references to DOM elements used by UI functions.
 * Safely handles elements missing from specific HTML pages.
 */
export function initUI() {
  els = {
    // Game Play elements
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
    winnerBtn: document.getElementById("winnerBtn"),
    menuBtn: document.getElementById("menuBtn"),
    finalizeBtn: document.getElementById("finalizeBtn"),
    brandLogoButton: document.getElementById("brandLogoButton"),
    modeIndicator: document.getElementById("modeIndicator"),
    board: document.getElementById("board"),

    // Home / Menu elements
    homeLogo: document.getElementById("homeLogo"),
    homeKicker: document.getElementById("homeKicker"),
    homeAppTitle: document.getElementById("homeAppTitle"),
    homeSubtitle: document.getElementById("homeSubtitle"),
    homeStartBtn: document.getElementById("homeStartBtn"),
    homeHistoryBtn: document.getElementById("homeHistoryBtn"),
    homeLastGameTitle: document.getElementById("homeLastGameTitle"),
    homeSummaryContent: document.getElementById("homeSummaryContent"),
    homeChangeModeBtn: document.getElementById("homeChangeModeBtn"),
    homeCurrentModeLabel: document.getElementById("homeCurrentModeLabel"),
    homeActiveGamePanel: document.getElementById("homeActiveGamePanel"),
    homeActiveGameSummary: document.getElementById("homeActiveGameSummary"),
    homeContinueBtn: document.getElementById("homeContinueBtn"),

    // History elements
    historyMainTitle: document.getElementById("historyMainTitle"),
    historyBackBtn: document.getElementById("historyBackBtn"),
    historyClearBtn: document.getElementById("historyClearBtn"),
    historyScroll: document.getElementById("historyScroll"),

    // Overlays
    modeOverlay: document.getElementById("modeOverlay"),
    modeReminderOverlay: document.getElementById("modeReminderOverlay"),
    winnerModalOverlay: document.getElementById("winnerModalOverlay"),
    winnerNameInput: document.getElementById("winnerNameInput"),
    winnerForm: document.getElementById("winnerForm"),
    cancelWinnerBtn: document.getElementById("cancelWinnerBtn"),
    modalWinnersList: document.getElementById("modalWinnersList"),
  };
}

/**
 * Apply branding and configurations from CONFIG to the current DOM.
 */
export function applyBranding() {
  // Game Play Branding
  if (els.logo) {
    els.logo.src = CONFIG.logoPath;
    els.logo.alt = CONFIG.logoAlt;
  }
  if (els.kicker) els.kicker.textContent = CONFIG.kicker;
  if (els.appTitle) els.appTitle.textContent = CONFIG.appName;
  if (els.subtitle) els.subtitle.textContent = CONFIG.subtitle;
  
  // Home Branding
  if (els.homeLogo) {
    els.homeLogo.src = CONFIG.logoPath;
    els.homeLogo.alt = CONFIG.logoAlt;
  }
  if (els.homeKicker) els.homeKicker.textContent = CONFIG.kicker;
  if (els.homeAppTitle) els.homeAppTitle.textContent = CONFIG.appName;
  if (els.homeSubtitle) els.homeSubtitle.textContent = CONFIG.subtitle;

  // Labels
  if (els.totalDisplay) els.totalDisplay.textContent = CONFIG.totalNumbers;
  if (els.labelCalled) els.labelCalled.textContent = CONFIG.labels.calledNumber;
  if (els.historyTitle) els.historyTitle.textContent = CONFIG.labels.recentTitle;
  if (els.boardTitle) els.boardTitle.textContent = CONFIG.labels.boardTitle;
  if (els.bingoLetters) els.bingoLetters.textContent = CONFIG.labels.bingoLetters;
  if (els.resetButton) els.resetButton.textContent = CONFIG.labels.resetButton;
  
  if (els.winnerBtn) els.winnerBtn.textContent = "🏆 ¡BINGO!";
  if (els.menuBtn) els.menuBtn.textContent = CONFIG.labels.backToMenuButton;
  if (els.finalizeBtn) els.finalizeBtn.textContent = CONFIG.labels.finishGameButton;
  
  if (els.homeStartBtn) {
    els.homeStartBtn.innerHTML = `<span class="home-btn-icon">🎯</span> ${CONFIG.labels.homeStartButton}`;
  }
  if (els.homeContinueBtn) {
    els.homeContinueBtn.innerHTML = `<span class="home-btn-icon">▶</span> ${CONFIG.labels.homeContinueButton}`;
  }
  if (els.homeHistoryBtn) {
    els.homeHistoryBtn.innerHTML = `<span class="home-btn-icon">📋</span> ${CONFIG.labels.homeHistoryButton}`;
  }
  if (els.homeChangeModeBtn) {
    els.homeChangeModeBtn.textContent = CONFIG.labels.changeMode;
  }
  if (els.homeLastGameTitle) els.homeLastGameTitle.textContent = CONFIG.labels.lastGameTitle;
  if (els.historyMainTitle) els.historyMainTitle.textContent = CONFIG.labels.historyTitle;
  if (els.historyClearBtn) els.historyClearBtn.textContent = CONFIG.labels.historyClearButton;
  if (els.historyBackBtn) els.historyBackBtn.textContent = CONFIG.labels.backToMenuButton;
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

// ─── Callout ────────────────────────────────────────────────

/**
 * Update the callout panel showing the last called number.
 * @param {number|null} latest
 * @param {number} count
 * @param {boolean} animate
 */
export function updateCallout(latest, count, animate) {
  if (!els.lastNumber || !els.lastPlain) return;

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

  if (animate && latest && CONFIG.enableAnimations && els.calledPanel) {
    els.calledPanel.classList.remove("flash");
    void els.calledPanel.offsetWidth; // force reflow
    els.calledPanel.classList.add("flash");
  }
}

// ─── Recent Bubbles ─────────────────────────────────────────

/**
 * Update the recent-numbers bubble strip.
 * @param {number[]} calledNumbers
 */
export function updateRecent(calledNumbers) {
  if (!els.recentNumbers) return;
  
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

// ─── Counter ────────────────────────────────────────────────

/**
 * Update the called-numbers counter.
 * @param {number} count
 */
export function updateCounter(count) {
  if (els.count) {
    els.count.textContent = count;
  }
}

// ─── Mini Grid Helper ───────────────────────────────────────

/**
 * Create a 5×5 mini-grid element showing a mode's pattern.
 * @param {number[][]} pattern
 * @param {string} [sizeClass=""]
 * @returns {HTMLElement}
 */
function createMiniGrid(pattern, sizeClass = "") {
  const grid = document.createElement("div");
  grid.className = `mini-grid ${sizeClass}`.trim();

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const cell = document.createElement("div");
      cell.className = pattern[row][col] ? "mini-cell active" : "mini-cell";
      grid.append(cell);
    }
  }

  return grid;
}

// ─── Mode Indicator ─────────────────────────────────────────

/**
 * Render the mode indicator badge.
 * @param {string} mode
 * @param {function} onChangeClick
 */
export function renderModeIndicator(mode, onChangeClick) {
  const container = els.modeIndicator;
  if (!container) return;
  container.innerHTML = "";

  const def = getModeDefinition(mode);

  // Badge wrapper
  const badge = document.createElement("button");
  badge.className = "mode-badge";
  badge.type = "button";
  badge.title = CONFIG.labels.changeMode;
  badge.addEventListener("click", onChangeClick);

  // Icon + label
  const info = document.createElement("div");
  info.className = "mode-badge-info";

  const icon = document.createElement("span");
  icon.className = "mode-badge-icon";
  icon.textContent = def.icon;

  const label = document.createElement("span");
  label.className = "mode-badge-label";
  label.textContent = def.label;

  info.append(icon, label);

  // Note
  if (def.note) {
    const note = document.createElement("span");
    note.className = "mode-badge-note";
    note.textContent = def.note;
    info.append(note);
  }

  // Mini grid
  const grid = createMiniGrid(def.pattern, "mini-grid-sm");

  // Change icon
  const changeIcon = document.createElement("span");
  changeIcon.className = "mode-badge-change";
  changeIcon.textContent = "⚙";

  badge.append(info, grid, changeIcon);
  container.append(badge);
}

// ─── Mode Selector Modal ────────────────────────────────────

/**
 * Show the mode selector overlay.
 * @param {string} currentMode
 * @param {function} onSelect
 * @param {function} [onCancel]
 */
export function showModeSelector(currentMode, onSelect, onCancel) {
  const overlay = els.modeOverlay;
  if (!overlay) return;

  overlay.innerHTML = "";
  overlay.classList.add("visible");

  // Backdrop click to close
  const backdropClickHandler = (e) => {
    if (e.target === overlay) {
      hideModeSelector();
      if (onCancel) onCancel();
    }
  };
  overlay.addEventListener("click", backdropClickHandler);

  // Panel
  const panel = document.createElement("div");
  panel.className = "mode-panel";
  panel.tabIndex = -1;

  // Close button "✕"
  const closeBtn = document.createElement("button");
  closeBtn.className = "mode-panel-close";
  closeBtn.type = "button";
  closeBtn.innerHTML = "✕";
  closeBtn.title = "Cerrar";
  closeBtn.addEventListener("click", () => {
    hideModeSelector();
    if (onCancel) onCancel();
  });
  panel.append(closeBtn);

  // Header
  const header = document.createElement("div");
  header.className = "mode-panel-header";

  const title = document.createElement("h2");
  title.className = "mode-panel-title";
  title.textContent = CONFIG.labels.modeSelectorTitle;

  const subtitle = document.createElement("p");
  subtitle.className = "mode-panel-subtitle";
  subtitle.textContent = CONFIG.labels.modeSelectorSubtitle;

  header.append(title, subtitle);
  panel.append(header);

  // Cards grid
  const grid = document.createElement("div");
  grid.className = "mode-cards";

  for (const modeKey of MODE_ORDER) {
    const def = getModeDefinition(modeKey);
    const card = document.createElement("button");
    card.className = `mode-card${modeKey === currentMode ? " selected" : ""}`;
    card.type = "button";

    const miniGrid = createMiniGrid(def.pattern, "mini-grid-lg");

    const cardInfo = document.createElement("div");
    cardInfo.className = "mode-card-info";

    const cardIcon = document.createElement("span");
    cardIcon.className = "mode-card-icon";
    cardIcon.textContent = def.icon;

    const cardLabel = document.createElement("span");
    cardLabel.className = "mode-card-label";
    cardLabel.textContent = def.label;

    cardInfo.append(cardIcon, cardLabel);

    const desc = document.createElement("div");
    desc.className = "mode-card-desc";
    desc.textContent = def.description;

    if (def.note) {
      const note = document.createElement("div");
      note.className = "mode-card-note";
      note.textContent = def.note;
      desc.append(note);
    }

    card.append(miniGrid, cardInfo, desc);

    card.addEventListener("click", () => {
      onSelect(modeKey);
      hideModeSelector();
    });

    grid.append(card);
  }

  panel.append(grid);
  overlay.append(panel);

  // Keydown Escape handler
  modeSelectorEscHandler = (e) => {
    if (e.key === "Escape") {
      hideModeSelector();
      if (onCancel) onCancel();
    }
  };
  document.addEventListener("keydown", modeSelectorEscHandler);

  requestAnimationFrame(() => panel.focus());
}

/**
 * Hide the mode selector overlay.
 */
export function hideModeSelector() {
  if (els.modeOverlay) {
    els.modeOverlay.classList.remove("visible");
    els.modeOverlay.innerHTML = "";
  }
  if (modeSelectorEscHandler) {
    document.removeEventListener("keydown", modeSelectorEscHandler);
    modeSelectorEscHandler = null;
  }
}

// ─── Home / Menu View ────────────────────────────────────────

/**
 * Update the default game mode displayed on Home menu.
 * @param {string} modeKey
 */
export function renderHomeMode(modeKey) {
  if (els.homeCurrentModeLabel) {
    const def = getModeDefinition(modeKey);
    els.homeCurrentModeLabel.innerHTML = `<span class="home-mode-icon">${def.icon}</span> ${def.label}`;
  }
}

/**
 * Render the active game panel and stats on Home menu.
 * @param {Object|null} activeGame - Current active game session object
 * @param {Array} history - List of past games
 */
export function renderHome(activeGame, history) {
  // 1. Show/hide active game panel
  if (els.homeActiveGamePanel) {
    if (activeGame) {
      els.homeActiveGamePanel.classList.add("visible");
      if (els.homeActiveGameSummary) {
        const def = getModeDefinition(activeGame.modeId);
        els.homeActiveGameSummary.textContent = `${def.icon} ${def.label} · ${activeGame.calledNumbers.length} números cantados`;
      }
    } else {
      els.homeActiveGamePanel.classList.remove("visible");
    }
  }

  // 2. Render summary of the current day
  const container = els.homeSummaryContent;
  if (!container) return;
  container.innerHTML = "";

  // Filter history for games completed today
  const todayStr = new Date().toISOString().split("T")[0];
  const todayGames = history.filter((g) => {
    const dateSrc = g.finishedAt || g.startedAt || new Date().toISOString();
    return dateSrc.split("T")[0] === todayStr;
  });

  if (todayGames.length === 0) {
    const emptyMsg = document.createElement("div");
    emptyMsg.className = "home-empty-history";
    emptyMsg.textContent = CONFIG.labels.historyEmpty;
    container.append(emptyMsg);
    return;
  }

  // Calculate day stats
  const totalWinnersToday = todayGames.reduce((acc, g) => acc + (g.winners ? g.winners.length : 0), 0);

  const statsRow = document.createElement("div");
  statsRow.className = "home-stats-row";
  statsRow.innerHTML = `
    <div class="home-stat-box">
      <span class="stat-value">${todayGames.length}</span>
      <span class="stat-label">Juegos hoy</span>
    </div>
    <div class="home-stat-box">
      <span class="stat-value">${totalWinnersToday}</span>
      <span class="stat-label">Ganadores hoy</span>
    </div>
  `;
  container.append(statsRow);

  // Render last game card
  const lastGame = todayGames[0];
  const modeDef = getModeDefinition(lastGame.modeId);

  const lastGameCard = document.createElement("div");
  lastGameCard.className = "last-game-card";

  const cardHeader = document.createElement("div");
  cardHeader.className = "last-game-header";
  
  const gameTime = new Date(lastGame.finishedAt || lastGame.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  cardHeader.innerHTML = `
    <div class="last-game-mode">
      <span class="last-game-icon">${modeDef.icon}</span>
      <span class="last-game-label">${modeDef.label}</span>
    </div>
    <div class="last-game-time">${gameTime}</div>
  `;

  const cardWinners = document.createElement("div");
  cardWinners.className = "last-game-winners";

  if (lastGame.winners && lastGame.winners.length > 0) {
    lastGame.winners.forEach((w, idx) => {
      const winnerRow = document.createElement("div");
      winnerRow.className = "last-game-winner-row";
      
      const pos = idx + 1;
      let medal = "🥇";
      if (pos === 2) medal = "🥈";
      else if (pos === 3) medal = "🥉";
      else if (pos > 3) medal = "🏅";

      winnerRow.innerHTML = `
        <span class="winner-medal">${medal}</span>
        <span class="winner-name">${w.name}</span>
      `;
      cardWinners.append(winnerRow);
    });
  } else {
    const noWinners = document.createElement("div");
    noWinners.className = "last-game-no-winners";
    noWinners.textContent = CONFIG.labels.noWinnersLabel;
    cardWinners.append(noWinners);
  }

  lastGameCard.append(cardHeader, cardWinners);
  container.append(lastGameCard);
}

// ─── History View ───────────────────────────────────────────

/**
 * Render all historical games grouped by date.
 * @param {Array} history
 */
export function renderHistory(history) {
  const container = els.historyScroll;
  if (!container) return;
  container.innerHTML = "";

  if (!history || history.length === 0) {
    const emptyMsg = document.createElement("div");
    emptyMsg.className = "history-empty";
    emptyMsg.textContent = CONFIG.labels.historyEmpty;
    container.append(emptyMsg);
    return;
  }

  const grouped = groupGamesByDate(history);

  for (const [dateStr, games] of Object.entries(grouped)) {
    const dateObj = new Date(dateStr + "T00:00:00");
    const formattedDate = dateObj.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const dateSec = document.createElement("div");
    dateSec.className = "history-date-section";

    const dateTitle = document.createElement("h2");
    dateTitle.className = "history-date-title";
    dateTitle.textContent = formattedDate;
    dateSec.append(dateTitle);

    const gamesList = document.createElement("div");
    gamesList.className = "history-games-list";

    games.forEach((game, idx) => {
      const modeDef = getModeDefinition(game.modeId);
      const gameCard = document.createElement("div");
      gameCard.className = "history-game-card";

      const timeEnd = game.finishedAt
        ? new Date(game.finishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : "—";
      const timeStart = new Date(game.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const gameInfo = document.createElement("div");
      gameInfo.className = "history-game-info";
      
      const gameNum = games.length - idx;

      gameInfo.innerHTML = `
        <div class="history-game-meta">
          <span class="game-number">Partida #${gameNum}</span>
          <span class="game-time">${timeStart} - ${timeEnd}</span>
        </div>
        <div class="history-game-mode">
          <span class="mode-icon">${modeDef.icon}</span>
          <span class="mode-label">${modeDef.label}</span>
          <span class="mode-numbers-called">${game.calledNumbers.length} cantados</span>
        </div>
      `;

      const gameWinners = document.createElement("div");
      gameWinners.className = "history-game-winners";

      if (game.winners && game.winners.length > 0) {
        game.winners.forEach((w, wIdx) => {
          const winnerEl = document.createElement("div");
          winnerEl.className = "history-winner-row";

          const pos = wIdx + 1;
          let medal = "🥇";
          if (pos === 2) medal = "🥈";
          else if (pos === 3) medal = "🥉";
          else if (pos > 3) medal = "🏅";

          const timeReg = w.registeredAt
            ? new Date(w.registeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : "";

          winnerEl.innerHTML = `
            <span class="winner-medal">${medal}</span>
            <span class="winner-name">${w.name}</span>
            <span class="winner-at">${timeReg}</span>
          `;
          gameWinners.append(winnerEl);
        });
      } else {
        const noWinners = document.createElement("div");
        noWinners.className = "history-winner-none";
        noWinners.textContent = CONFIG.labels.noWinnersLabel;
        gameWinners.append(noWinners);
      }

      gameCard.append(gameInfo, gameWinners);
      gamesList.append(gameCard);
    });

    dateSec.append(gamesList);
    container.append(dateSec);
  }
}

// ─── Mode Reminder Overlay ──────────────────────────────────

/**
 * Show the full-screen mode reminder overlay.
 * Closes automatically after CONFIG.modeReminderDurationMs or on manual close.
 * @param {string} mode
 */
export function showModeReminder(mode) {
  const overlay = els.modeReminderOverlay;
  if (!overlay) return;

  if (reminderTimeout) {
    clearTimeout(reminderTimeout);
    reminderTimeout = null;
  }

  overlay.innerHTML = "";
  overlay.classList.add("visible");

  const def = getModeDefinition(mode);

  const content = document.createElement("div");
  content.className = "mode-reminder-content";

  // Manual close button "✕"
  const closeBtn = document.createElement("button");
  closeBtn.className = "mode-reminder-close";
  closeBtn.type = "button";
  closeBtn.innerHTML = "✕";
  closeBtn.title = "Cerrar";
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    hideModeReminder();
  });
  content.append(closeBtn);

  const title = document.createElement("h2");
  title.className = "mode-reminder-title";
  title.textContent = "¿CÓMO SE GANA?";

  const grid = createMiniGrid(def.pattern, "mini-grid-xl");

  const modeInfo = document.createElement("div");
  modeInfo.className = "mode-reminder-info";

  const modeIcon = document.createElement("span");
  modeIcon.className = "mode-reminder-icon";
  modeIcon.textContent = def.icon;

  const modeLabel = document.createElement("h3");
  modeLabel.className = "mode-reminder-label";
  modeLabel.textContent = def.label;

  modeInfo.append(modeIcon, modeLabel);

  const modeDesc = document.createElement("p");
  modeDesc.className = "mode-reminder-desc";
  modeDesc.textContent = def.description;

  if (def.note) {
    const modeNote = document.createElement("small");
    modeNote.className = "mode-reminder-note";
    modeNote.textContent = def.note;
    modeDesc.append(document.createElement("br"), modeNote);
  }

  const progressBg = document.createElement("div");
  progressBg.className = "mode-reminder-progress-bg";
  
  const progressBar = document.createElement("div");
  progressBar.className = "mode-reminder-progress-bar";
  progressBg.append(progressBar);

  content.append(title, grid, modeInfo, modeDesc, progressBg);
  overlay.append(content);

  const duration = CONFIG.modeReminderDurationMs || 8000;

  // Animation triggers
  requestAnimationFrame(() => {
    progressBar.style.transition = `width ${duration}ms linear`;
    progressBar.style.width = "0%";
  });

  const closeHandler = () => {
    hideModeReminder();
  };

  overlay.addEventListener("click", closeHandler, { once: true });

  reminderEscHandler = (e) => {
    if (e.key === "Escape") {
      hideModeReminder();
    }
  };
  document.addEventListener("keydown", reminderEscHandler);

  reminderTimeout = setTimeout(() => {
    overlay.removeEventListener("click", closeHandler);
    hideModeReminder();
  }, duration);
}

/**
 * Hide the mode reminder overlay.
 */
export function hideModeReminder() {
  if (els.modeReminderOverlay) {
    els.modeReminderOverlay.classList.remove("visible");
    els.modeReminderOverlay.innerHTML = "";
  }
  if (reminderTimeout) {
    clearTimeout(reminderTimeout);
    reminderTimeout = null;
  }
  if (reminderEscHandler) {
    document.removeEventListener("keydown", reminderEscHandler);
    reminderEscHandler = null;
  }
}

// ─── Winner Modal Overlay ───────────────────────────────────

/**
 * Show the winner registration modal.
 * @param {Object} gameState
 * @param {Function} onSave
 */
export function showWinnerModal(gameState, onSave) {
  const overlay = els.winnerModalOverlay;
  if (!overlay) return;

  overlay.classList.add("visible");
  
  const sub = els.winnerModalSubtitle;
  const modeDef = getModeDefinition(gameState.mode);
  if (sub) {
    sub.textContent = `${CONFIG.labels.winnerModalSubtitle} · Modo: ${modeDef.label} · Cantados: ${gameState.calledNumbersCount}/75`;
  }

  const input = els.winnerNameInput;
  if (input) {
    input.value = "";
    requestAnimationFrame(() => input.focus());
  }

  const winnersList = els.modalWinnersList;
  if (winnersList) {
    winnersList.innerHTML = "";
    const currentWinners = gameState.winners || [];
    
    if (currentWinners.length > 0) {
      const listTitle = document.createElement("div");
      listTitle.className = "winners-list-title";
      listTitle.textContent = "─── Ganadores de la partida ───";
      winnersList.append(listTitle);

      currentWinners.forEach((w, idx) => {
        const item = document.createElement("div");
        item.className = "winner-list-item";
        
        const pos = idx + 1;
        let medal = "🥇";
        if (pos === 2) medal = "🥈";
        else if (pos === 3) medal = "🥉";
        else if (pos > 3) medal = "🏅";

        const timeStr = w.registeredAt
          ? new Date(w.registeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : "";

        item.innerHTML = `
          <span class="winner-item-medal">${medal}</span>
          <span class="winner-item-name">${w.name}</span>
          <span class="winner-item-at">${timeStr}</span>
        `;
        winnersList.append(item);
      });
    }
  }

  const form = els.winnerForm;
  
  const submitHandler = (e) => {
    e.preventDefault();
    const name = input.value.trim();
    if (name) {
      onSave(name);
      hideWinnerModal();
    }
  };

  form.onsubmit = submitHandler;

  const cancelBtn = els.cancelWinnerBtn;
  if (cancelBtn) {
    cancelBtn.onclick = (e) => {
      e.preventDefault();
      hideWinnerModal();
    };
  }

  winnerModalEscHandler = (e) => {
    if (e.key === "Escape") {
      hideWinnerModal();
    }
  };
  document.addEventListener("keydown", winnerModalEscHandler);
}

/**
 * Hide the winner registration modal.
 */
export function hideWinnerModal() {
  if (els.winnerModalOverlay) {
    els.winnerModalOverlay.classList.remove("visible");
  }
  if (els.winnerForm) {
    els.winnerForm.onsubmit = null;
  }
  if (winnerModalEscHandler) {
    document.removeEventListener("keydown", winnerModalEscHandler);
    winnerModalEscHandler = null;
  }
}
