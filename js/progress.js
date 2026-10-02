// progress.js
// Animal Welfare NGO Fundraising Progress

const FUNDRAISING_PROGRESS = {
  target: 25000,     // Total fundraising target
  collected: 1000       // Amount collected so far
};

export function initializeProgress() {
  const progressCard = document.querySelector("[data-fundraising-progress]");

  if (!progressCard) return;

  const target = Number(FUNDRAISING_PROGRESS.target) || 0;
  const collected = Math.max(
    0,
    Number(FUNDRAISING_PROGRESS.collected) || 0
  );

  if (target <= 0) return;

  const actualCollected = Math.min(collected, target);

  const percentage = Math.min(
    (actualCollected / target) * 100,
    100
  );

  const progressFill = progressCard.querySelector(
    "[data-progress-fill]"
  );

  const percentageText = progressCard.querySelector(
    "[data-progress-percent]"
  );

  const collectedText = progressCard.querySelector(
    "[data-progress-collected]"
  );

  const targetText = progressCard.querySelector(
    "[data-progress-target]"
  );

  // Progress bar
  if (progressFill) {
    progressFill.style.width = `${percentage}%`;
  }

  // Percentage
  if (percentageText) {
    percentageText.textContent =
      `${percentage % 1 === 0
        ? percentage.toFixed(0)
        : percentage.toFixed(2)}%`;
  }

  // Collected amount
  if (collectedText) {
    collectedText.textContent =
      `₹${actualCollected.toLocaleString("en-IN")}`;
  }

  // Target amount
  if (targetText) {
    targetText.textContent =
      `₹${target.toLocaleString("en-IN")}`;
  }
}