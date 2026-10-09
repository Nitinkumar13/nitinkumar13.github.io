import { CAMPAIGNS } from "./campaigns-data.js";
import { SITE_NAME } from "./site-config.js";

const detailContainer = document.querySelector("[data-campaign-detail]");
const campaignId = new URLSearchParams(window.location.search).get("id");
const campaign = CAMPAIGNS.find(item => item.id === campaignId);

function formatAmount(amount) {
  const value = Number(amount);

  if (!Number.isFinite(value) || value < 0) {
    return "₹ 0";
  }

  return `₹ ${value.toLocaleString("en-IN")}`;
}

function addTextElement(parent, tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  parent.appendChild(element);
  return element;
}

function renderNotFound() {
  document.title = `Campaign not found | ${SITE_NAME}`;
  detailContainer.replaceChildren();

  const message = document.createElement("section");
  message.className = "campaign-detail-error";
  addTextElement(message, "h1", "campaign-detail-title", "Campaign not found");
  addTextElement(
    message,
    "p",
    "campaign-detail-description",
    "This campaign may have been removed or the link may be incorrect."
  );
  detailContainer.appendChild(message);
}

function renderCampaign(item) {
  const target = Number(item.target) || 0;
  const raised = Number(item.raised) || 0;
  const progress = target > 0
    ? Math.max(0, Math.min(100, (raised / target) * 100))
    : 0;
  const donors = Number(item.donors) || 0;
  const remaining = Math.max(0, target - raised);

  document.title = `${item.title || "Campaign"} | ${SITE_NAME}`;
  detailContainer.replaceChildren();

  const story = document.createElement("section");
  story.className = "campaign-detail-story";

  const imageContainer = document.createElement("div");
  imageContainer.className = "campaign-detail-image";

  if (item.image) {
    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.imageAlt || item.title || "Campaign image";
    imageContainer.appendChild(image);
  } else {
    addTextElement(
      imageContainer,
      "span",
      "campaign-detail-image-label",
      "Campaign"
    );
  }

  story.appendChild(imageContainer);

  if (item.category) {
    addTextElement(
      story,
      "span",
      "campaign-detail-category",
      item.category
    );
  }

  addTextElement(
    story,
    "h1",
    "campaign-detail-title",
    item.title || "Campaign"
  );
  addTextElement(
    story,
    "p",
    "campaign-detail-description",
    item.description || "More information about this campaign will be added soon."
  );

  const fundraising = document.createElement("section");
  fundraising.className = "campaign-detail-fundraising";
  fundraising.setAttribute("aria-labelledby", "campaign-fundraising-heading");
  addTextElement(
    fundraising,
    "h2",
    "",
    "Fundraising progress"
  ).id = "campaign-fundraising-heading";
  addTextElement(
    fundraising,
    "strong",
    "campaign-detail-raised",
    formatAmount(raised)
  );
  addTextElement(
    fundraising,
    "span",
    "campaign-detail-target",
    `raised of ${formatAmount(target)} goal`
  );

  const progressBar = document.createElement("div");
  progressBar.className = "campaign-detail-progress";
  progressBar.setAttribute("role", "progressbar");
  progressBar.setAttribute("aria-valuemin", "0");
  progressBar.setAttribute("aria-valuemax", "100");
  progressBar.setAttribute("aria-valuenow", progress.toFixed(1));
  progressBar.setAttribute(
    "aria-label",
    `${progress.toFixed(0)}% of campaign goal raised`
  );
  const progressFill = document.createElement("span");
  progressFill.style.width = `${progress}%`;
  progressBar.appendChild(progressFill);
  fundraising.appendChild(progressBar);

  addTextElement(
    fundraising,
    "p",
    "campaign-detail-progress-label",
    `${progress.toFixed(0)}% of the goal raised`
  );

  const stats = document.createElement("div");
  stats.className = "campaign-detail-stats";
  const statsValues = [
    [formatAmount(remaining), "Still needed"],
    [donors.toLocaleString("en-IN"), "Supporters"]
  ];

  statsValues.forEach(([value, label]) => {
    const stat = document.createElement("div");
    stat.className = "campaign-detail-stat";
    addTextElement(stat, "strong", "", value);
    addTextElement(stat, "span", "", label);
    stats.appendChild(stat);
  });

  fundraising.appendChild(stats);

  if (item.donateHref) {
    const donateLink = document.createElement("a");
    donateLink.className = "campaign-detail-donate";
    donateLink.href = item.donateHref;
    donateLink.textContent = "Donate to this campaign";
    donateLink.target = "_blank";
    donateLink.rel = "noopener noreferrer";
    fundraising.appendChild(donateLink);
  } else {
    addTextElement(
      fundraising,
      "p",
      "campaign-detail-progress-label",
      "Donation details will be added soon."
    );
  }

  detailContainer.append(story, fundraising);
}

if (detailContainer) {
  if (campaign) {
    renderCampaign(campaign);
  } else {
    renderNotFound();
  }
}
