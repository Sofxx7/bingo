/**
 * Bingo — Game Modes (Placeholder for v0.3+)
 *
 * Defines available victory modes and a stub for checking win conditions.
 * Full implementation is planned for future versions.
 */

export const GAME_MODES = {
  FULL_CARD: "full_card",
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical",
  DIAGONAL: "diagonal",
  FOUR_CORNERS: "four_corners",
};

/**
 * Check if a given card has achieved victory under the specified mode.
 * @param {string} mode — One of GAME_MODES values
 * @param {number[]} calledNumbers — Numbers called so far
 * @param {number[][]} card — A bingo card (5x5 matrix)
 * @returns {boolean}
 */
export function checkVictory(mode, calledNumbers, card) {
  // TODO: Implement victory detection in v0.3
  return false;
}

/**
 * Get a human-readable label for a game mode.
 * @param {string} mode
 * @returns {string}
 */
export function getModeLabel(mode) {
  const labels = {
    [GAME_MODES.FULL_CARD]: "Cartón lleno",
    [GAME_MODES.HORIZONTAL]: "Línea horizontal",
    [GAME_MODES.VERTICAL]: "Línea vertical",
    [GAME_MODES.DIAGONAL]: "Diagonal",
    [GAME_MODES.FOUR_CORNERS]: "Cuatro esquinas",
  };
  return labels[mode] || mode;
}
