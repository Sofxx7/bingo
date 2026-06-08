/**
 * Bingo — Game Modes
 *
 * Defines all victory modes with their visual patterns (5×5 grids),
 * labels, descriptions, and icons.
 *
 * Each pattern is a 5×5 matrix where 1 = required cell, 0 = not required.
 * Rows map to B-I-N-G-O letters, columns to positions within each letter.
 *
 * For modes like "any row" or "any column", the pattern shown is
 * representative — the actual win check would accept any qualifying line.
 */

export const GAME_MODES = {
  FULL_CARD: "full_card",
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical",
  DIAGONAL: "diagonal",
  FOUR_CORNERS: "four_corners",
  ONLY_B: "only_b",
  ONLY_I: "only_i",
  ONLY_N: "only_n",
  ONLY_G: "only_g",
  ONLY_O: "only_o",
  L_SHAPE: "l_shape",
};

/**
 * Complete definition for each game mode.
 * `pattern` is a 5×5 array (rows = B,I,N,G,O).
 * `note` provides extra context shown below the pattern.
 */
export const MODE_DEFINITIONS = {
  [GAME_MODES.FULL_CARD]: {
    label: "Cartón lleno",
    icon: "🏆",
    description: "Llena todas las casillas del cartón",
    note: null,
    pattern: [
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
    ],
  },

  [GAME_MODES.HORIZONTAL]: {
    label: "Línea horizontal",
    icon: "↔️",
    description: "Completa cualquier fila de tu cartón",
    note: "Cualquier fila",
    pattern: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
  },

  [GAME_MODES.VERTICAL]: {
    label: "Línea vertical",
    icon: "↕️",
    description: "Completa cualquier columna de tu cartón",
    note: "Cualquier columna",
    pattern: [
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
    ],
  },

  [GAME_MODES.DIAGONAL]: {
    label: "Diagonal",
    icon: "⤡",
    description: "Completa una diagonal completa",
    note: "Cualquier diagonal",
    pattern: [
      [1, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1],
    ],
  },

  [GAME_MODES.FOUR_CORNERS]: {
    label: "Cuatro esquinas",
    icon: "◇",
    description: "Marca las 4 esquinas del cartón",
    note: null,
    pattern: [
      [1, 0, 0, 0, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 0, 0, 0, 1],
    ],
  },

  [GAME_MODES.ONLY_B]: {
    label: "Solo la B",
    icon: "🅱️",
    description: "Completa toda la columna B (1–15)",
    note: null,
    pattern: [
      [1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
  },

  [GAME_MODES.ONLY_I]: {
    label: "Solo la I",
    icon: "🇮",
    description: "Completa toda la columna I (16–30)",
    note: null,
    pattern: [
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
  },

  [GAME_MODES.ONLY_N]: {
    label: "Solo la N",
    icon: "🇳",
    description: "Completa toda la columna N (31–45)",
    note: null,
    pattern: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ],
  },

  [GAME_MODES.ONLY_G]: {
    label: "Solo la G",
    icon: "🇬",
    description: "Completa toda la columna G (46–60)",
    note: null,
    pattern: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
    ],
  },

  [GAME_MODES.ONLY_O]: {
    label: "Solo la O",
    icon: "🇴",
    description: "Completa toda la columna O (61–75)",
    note: null,
    pattern: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
    ],
  },

  [GAME_MODES.L_SHAPE]: {
    label: "Forma de L",
    icon: "🔲",
    description: "Forma una L en cualquier orientación",
    note: "Cualquier rotación",
    pattern: [
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
    ],
  },
};

/**
 * Ordered list of mode keys for display in the selector.
 */
export const MODE_ORDER = [
  GAME_MODES.FULL_CARD,
  GAME_MODES.HORIZONTAL,
  GAME_MODES.VERTICAL,
  GAME_MODES.DIAGONAL,
  GAME_MODES.FOUR_CORNERS,
  GAME_MODES.ONLY_B,
  GAME_MODES.ONLY_I,
  GAME_MODES.ONLY_N,
  GAME_MODES.ONLY_G,
  GAME_MODES.ONLY_O,
  GAME_MODES.L_SHAPE,
];

/**
 * Get the full definition for a mode.
 * @param {string} mode
 * @returns {object}
 */
export function getModeDefinition(mode) {
  return MODE_DEFINITIONS[mode] || MODE_DEFINITIONS[GAME_MODES.FULL_CARD];
}

/**
 * Get a human-readable label for a game mode.
 * @param {string} mode
 * @returns {string}
 */
export function getModeLabel(mode) {
  const def = getModeDefinition(mode);
  return def.label;
}

/**
 * Check if a mode key is valid.
 * @param {string} mode
 * @returns {boolean}
 */
export function isValidMode(mode) {
  return mode in MODE_DEFINITIONS;
}
