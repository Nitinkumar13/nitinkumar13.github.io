import { CAMPAIGNS } from "./campaigns-data.js";

const campaignGrid = document.querySelector("[data-campaign-list]");

if (campaignGrid) {
  CAMPAIGNS.forEach(campaign => {
    const card = document.createElement("article");
    card.className = "campaign-card";

    const image = document.createElement("div");
    image.className = "campaign-card-image campaign-placeholder";

    const imageLabel = document.createElement("span");
    imageLabel.textContent = "Campaign Image";

    const category = document.createElement("span");
    category.className = "campaign-category";
    category.textContent = campaign.category;

    image.append(imageLabel, category);

    const content = document.createElement("div");
    content.className = "campaign-card-content";

    const title = document.createElement("h3");
    title.textContent = campaign.title;

    const description = document.createElement("p");
    description.textContent = campaign.description;

    const meta = document.createElement("div");
    meta.className = "campaign-meta";

    const statusLabel = document.createElement("span");
    statusLabel.textContent = "Campaign Status";

    const status = document.createElement("strong");
    status.textContent = campaign.status;
    meta.append(statusLabel, status);

    const link = document.createElement("a");
    link.className = "btn btn-secondary";
    link.href = campaign.href;
    link.textContent = campaign.linkLabel;

    content.append(title, description, meta, link);
    card.append(image, content);
    campaignGrid.append(card);
  });
}
