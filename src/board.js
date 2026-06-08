/**
 * Bingo — Board Rendering
 *
 * Builds the BINGO number grid and updates cell states.
 */

import { CONFIG } from "./config.js";
import { formatNumber } from "./state.js";

/**
 * Create the full board grid inside the given container.
 * Generates one row per BINGO letter, each with 15 number buttons.
 * @param {HTMLElement} container
 */
export function renderBoard(container) {
  container.innerHTML = "";

  for (const col of CONFIG.columns) {
    const row = document.createElement("div");
    row.className = "column";

    // Letter label
    const letter = document.createElement("div");
    letter.className = "letter";
    letter.textContent = col.letter;
    row.append(letter);

    // Number buttons
    const numbers = document.createElement("div");
    numbers.className = "numbers";

    for (let n = col.start; n <= col.end; n++) {
      const btn = document.createElement("button");
      btn.className = "number";
      btn.type = "button";
      btn.textContent = n;
      btn.dataset.number = String(n);
      btn.setAttribute("aria-label", formatNumber(n));
      numbers.append(btn);
    }

    row.append(numbers);
    container.append(row);
  }
}

/**
 * Update visual state of all number cells on the board.
 * @param {number[]} calledNumbers
 * @param {number|null} latest
 */
export function updateBoardState(calledNumbers, latest) {
  const buttons = document.querySelectorAll(".number");

  for (const btn of buttons) {
    const num = Number(btn.dataset.number);
    const called = calledNumbers.includes(num);
    btn.classList.toggle("called-number", called);
    btn.classList.toggle("latest", latest === num);
    btn.setAttribute("aria-pressed", String(called));
  }
}
