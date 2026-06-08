/**
 * Bingo — Configuration File
 *
 * Edit this file to customize the bingo for your event.
 * All branding, colors, game settings and UI labels are here.
 */

export const CONFIG = {
  // ─── Branding ──────────────────────────────────────────────
  appName: "BINGO",
  organization: "REU UPT",
  subtitle: "Universidad Privada de Tacna",
  kicker: "Renovación Universitaria",
  logoPath: "./assets/logo.jpeg",
  logoAlt: "Logo REU UPT",

  // ─── Game Settings ─────────────────────────────────────────
  totalNumbers: 75,
  columns: [
    { letter: "B", start: 1, end: 15 },
    { letter: "I", start: 16, end: 30 },
    { letter: "N", start: 31, end: 45 },
    { letter: "G", start: 46, end: 60 },
    { letter: "O", start: 61, end: 75 },
  ],
  recentCount: 6,
  defaultMode: "full_card",
  modeReminderDurationMs: 8000, // Duration of fullscreen mode card in milliseconds

  // ─── Theme Colors ──────────────────────────────────────────
  // These are injected as CSS custom properties at runtime.
  // The CSS file uses var(--primary), var(--accent), etc.
  theme: {
    primary: "#00106f",
    primaryLight: "#003f90",
    primaryMid: "#0759b8",
    accent: "#ffb20d",
    accentSoft: "#ffd466",
    background: "#050916",
    panelBg: "rgba(4, 20, 68, 0.88)",
    panelSoft: "rgba(255, 255, 255, 0.08)",
    text: "#f9fbff",
    muted: "#b9c7ea",
    line: "rgba(255, 255, 255, 0.14)",
  },

  // ─── Features ──────────────────────────────────────────────
  enableAnimations: true,
  enableLocalStorage: true,
  storageKeyActiveGame: "bingo-active-game",
  storageKeyHistory: "bingo-game-history",
  storageKeySettings: "bingo-settings",

  // ─── UI Labels (for future i18n) ──────────────────────────
  labels: {
    calledNumber: "Número cantado",
    waitingMessage: "Esperando el primer número",
    recentTitle: "Últimos números",
    boardTitle: "Números salidos",
    resetButton: "Reiniciar",
    resetConfirm:
      "¿Quieres reiniciar la partida y borrar los números marcados?",
    lastBubbleLabel: "ÚLTIMO",
    statusTemplate: "{count} de {total} números",
    bingoLetters: "B-I-N-G-O",
    modeSelectorTitle: "¿Cómo se gana?",
    modeSelectorSubtitle: "Selecciona el modo de juego",
    changeMode: "Cambiar modo",
    currentMode: "Modo actual",

    // Navigation and Action Labels
    homeStartButton: "Nueva Partida",
    homeContinueButton: "Continuar Partida",
    homeHistoryButton: "Historial",
    historyTitle: "Historial de Juegos",
    historyClearButton: "Limpiar Historial",
    historyEmpty: "No hay juegos registrados.",
    winnerModalTitle: "🏆 ¡¡BINGO!!",
    winnerModalSubtitle: "Ganador de esta partida",
    winnerNamePlaceholder: "Nombre del ganador...",
    saveWinnerButton: "Guardar",
    cancelButton: "Cancelar",
    finishGameButton: "Finalizar partida",
    backToMenuButton: "Menú",
    noWinnersLabel: "Sin ganadores",
    lastGameTitle: "Último juego",

    // Confirmation dialogues
    overwriteActiveGameConfirm: "Ya hay una partida en curso. ¿Quieres reemplazarla por una nueva?",
    finishGameHasWinnersConfirm: "¿Quieres finalizar la partida y registrarla en el historial?",
    finishGameNoWinnersConfirm: "Esta partida no tiene ganadores registrados. ¿Deseas finalizarla igual?",
    clearHistoryConfirm: "¿Quieres borrar todo el historial de juegos?",
  },
};
