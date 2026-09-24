import { formatINR } from "./formatting.js";

const COW_PROGRESS = {
  GP001: { target: 5000, collected: 50 },
  GP002: { target: 4000, collected: 0 },
  GP003: { target: 2500, collected: 0 }
};

export function initializeCareProgress() {
  document.querySelectorAll("[data-progress-cow]").forEach((card) => {
    const data = COW_PROGRESS[card.dataset.progressCow];
    if (!data || data.target <= 0) return;

    const collected = Math.max(0, Number(data.collected) || 0);
    const target = Number(data.target);
    const percent = Math.min((collected / target) * 100, 100);
    const fill = card.querySelector("[data-progress-fill]");
    const percentText = card.querySelector("[data-progress-percent]");

    fill.style.width = `${percent}%`;
    percentText.textContent = `${percent % 1 === 0 ? percent.toFixed(0) : percent.toFixed(2)}%`;
    card.querySelector("[data-progress-collected]").textContent = formatINR(collected);
    card.querySelector("[data-progress-target]").textContent = formatINR(target);
  });
}
