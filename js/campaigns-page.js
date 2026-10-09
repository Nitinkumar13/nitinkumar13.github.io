import { CAMPAIGNS } from "./campaigns-data.js";


/* =========================================================
   DOM ELEMENTS
========================================================= */

const campaignGrid =
  document.querySelector("[data-campaign-list]");

const moreWrap =
  document.querySelector("[data-campaign-more-wrap]");

const moreButton =
  document.querySelector("[data-campaign-more]");


/* =========================================================
   SETTINGS
========================================================= */

const INITIAL_VISIBLE_CAMPAIGNS = 3;

let showingAllCampaigns = false;


/* =========================================================
   FORMAT CURRENCY
========================================================= */

function formatAmount(amount) {

  if (
    amount === undefined ||
    amount === null ||
    amount === ""
  ) {
    return "₹ 0";
  }

  return `₹ ${Number(amount).toLocaleString("en-IN")}`;
}


/* =========================================================
   CALCULATE PROGRESS
========================================================= */

function calculateProgress(raised, target) {

  const raisedAmount = Number(raised || 0);
  const targetAmount = Number(target || 0);

  if (targetAmount <= 0) {
    return 0;
  }

  const percentage =
    (raisedAmount / targetAmount) * 100;

  return Math.max(
    0,
    Math.min(100, percentage)
  );
}


/* =========================================================
   CREATE CAMPAIGN CARD
========================================================= */

function createCampaignCard(campaign) {

  const card = document.createElement("article");

  card.className = "campaign-card";

  const campaignLink = document.createElement("a");

  campaignLink.className = "campaign-card-link";
  campaignLink.href =
    campaign.href ||
    `campaign.html?id=${encodeURIComponent(campaign.id || "")}`;
  campaignLink.setAttribute(
    "aria-label",
    `View details for ${campaign.title || "campaign"}`
  );

  card.appendChild(campaignLink);


  /* =======================================================
     IMAGE
  ======================================================= */

  const imageWrapper =
    document.createElement("div");

  imageWrapper.className =
    "campaign-card-image";


  if (campaign.image) {

    const image =
      document.createElement("img");

    image.src =
      campaign.image;

    image.alt =
      campaign.imageAlt ||
      campaign.title ||
      "Campaign image";

    image.loading = "lazy";

    imageWrapper.appendChild(image);

  } else {

    imageWrapper.classList.add(
      "campaign-placeholder"
    );

    const imageLabel =
      document.createElement("span");

    imageLabel.textContent =
      "Campaign Image";

    imageWrapper.appendChild(
      imageLabel
    );
  }


  /* =======================================================
     CATEGORY
  ======================================================= */

  if (campaign.category) {

    const category =
      document.createElement("span");

    category.className =
      "campaign-category";

    category.textContent =
      campaign.category;

    imageWrapper.appendChild(
      category
    );
  }


  /* =======================================================
     CONTENT
  ======================================================= */

  const content =
    document.createElement("div");

  content.className =
    "campaign-card-content";


  /* =======================================================
     TITLE
  ======================================================= */

  const title =
    document.createElement("h3");

  title.textContent =
    campaign.title ||
    "Campaign";

  content.appendChild(title);


  /* =======================================================
     DESCRIPTION
  ======================================================= */

  if (campaign.description) {

    const description =
      document.createElement("p");

    description.textContent =
      campaign.description;

    content.appendChild(
      description
    );
  }


  /* =======================================================
     CAMPAIGN STATS
  ======================================================= */

  const stats =
    document.createElement("div");

  stats.className =
    "campaign-stats";


  /* -------------------------------------------------------
     RAISED
  ------------------------------------------------------- */

  const raisedBox =
    document.createElement("div");

  raisedBox.className =
    "campaign-stat";


  const raisedAmount =
    document.createElement("strong");

  raisedAmount.textContent =
    formatAmount(
      campaign.raised
    );


  const raisedLabel =
    document.createElement("span");

  raisedLabel.textContent =
    "Raised";


  raisedBox.append(
    raisedAmount,
    raisedLabel
  );


  /* -------------------------------------------------------
     DONORS
  ------------------------------------------------------- */

  const donorBox =
    document.createElement("div");

  donorBox.className =
    "campaign-stat";


  const donorCount =
    document.createElement("strong");

  donorCount.textContent =
    campaign.donors !== undefined &&
    campaign.donors !== null
      ? Number(
          campaign.donors
        ).toLocaleString("en-IN")
      : "0";


  const donorLabel =
    document.createElement("span");

  donorLabel.textContent =
    "Donors";


  donorBox.append(
    donorCount,
    donorLabel
  );


  stats.append(
    raisedBox,
    donorBox
  );

  content.appendChild(stats);


  /* =======================================================
     PROGRESS BAR
  ======================================================= */

  const progress =
    document.createElement("div");

  progress.className =
    "campaign-progress";


  const progressBar =
    document.createElement("span");


  const progressValue =
    calculateProgress(
      campaign.raised,
      campaign.target
    );


  progressBar.style.width =
    `${progressValue}%`;


  /*
     Accessibility
  */

  progress.setAttribute(
    "role",
    "progressbar"
  );

  progress.setAttribute(
    "aria-valuemin",
    "0"
  );

  progress.setAttribute(
    "aria-valuemax",
    "100"
  );

  progress.setAttribute(
    "aria-valuenow",
    progressValue.toFixed(1)
  );

  progress.setAttribute(
    "aria-label",
    `${progressValue.toFixed(0)}% of campaign target raised`
  );


  progress.appendChild(
    progressBar
  );

  content.appendChild(
    progress
  );


  /* =======================================================
     ACTIONS
  ======================================================= */

  const actions =
    document.createElement("div");

  actions.className =
    "campaign-actions";


  /* =======================================================
     SHARE BUTTON
  ======================================================= */

  const shareButton =
    document.createElement("button");

  shareButton.type =
    "button";

  shareButton.className =
    "campaign-share";

  shareButton.textContent =
    "Share";


  shareButton.addEventListener(
    "click",
    async () => {

      const campaignUrl =
        new URL(
          campaign.href ||
          window.location.href,
          window.location.href
        ).href;


      const shareData = {

        title:
          campaign.title ||
          "Campaign",

        text:
          campaign.description ||
          campaign.title ||
          "Support this campaign.",

        url:
          campaignUrl
      };


      /* -----------------------------------------------
         Native share
      ------------------------------------------------ */

      if (navigator.share) {

        try {

          await navigator.share(
            shareData
          );

        } catch (error) {

          /*
             User cancelled sharing.
             Nothing to do.
          */

        }

        return;
      }


      /* -----------------------------------------------
         Clipboard fallback
      ------------------------------------------------ */

      try {

        await navigator.clipboard.writeText(
          campaignUrl
        );


        shareButton.textContent =
          "Copied!";


        setTimeout(() => {

          shareButton.textContent =
            "Share";

        }, 1800);


      } catch (error) {

        window.prompt(
          "Copy this campaign link:",
          campaignUrl
        );
      }

    }
  );


  /* =======================================================
     DONATE BUTTON
  ======================================================= */

  const donateLink =
    document.createElement("a");

  donateLink.className =
    "campaign-donate";

  donateLink.href =
    campaign.donateHref ||
    campaign.href ||
    "#";

  donateLink.textContent =
    "Donate";


  /* =======================================================
     ADD ACTIONS
  ======================================================= */

  actions.append(
    shareButton,
    donateLink
  );

  content.appendChild(
    actions
  );


  /* =======================================================
     COMPLETE CARD
  ======================================================= */

  card.append(
    imageWrapper,
    content
  );


  return card;
}


/* =========================================================
   UPDATE SEE MORE BUTTON
========================================================= */

function updateMoreButton() {

  if (
    !moreWrap ||
    !moreButton
  ) {
    return;
  }


  /*
     No button if there are
     3 or fewer campaigns.
  */

  if (
    !Array.isArray(CAMPAIGNS) ||
    CAMPAIGNS.length <=
      INITIAL_VISIBLE_CAMPAIGNS
  ) {

    moreWrap.hidden = true;

    return;
  }


  moreWrap.hidden = false;


  if (showingAllCampaigns) {

    moreButton.textContent =
      "Show Less";

    moreButton.setAttribute(
      "aria-expanded",
      "true"
    );

  } else {

    moreButton.textContent =
      "See More Campaigns";

    moreButton.setAttribute(
      "aria-expanded",
      "false"
    );
  }
}


/* =========================================================
   RENDER CAMPAIGNS
========================================================= */

function renderCampaigns() {

  if (!campaignGrid) {
    return;
  }


  /*
     Validate campaign data.
  */

  if (!Array.isArray(CAMPAIGNS)) {

    campaignGrid.innerHTML = `
      <p class="campaign-error">
        Campaigns could not be loaded.
      </p>
    `;

    if (moreWrap) {
      moreWrap.hidden = true;
    }

    return;
  }


  /*
     Clear existing cards.
  */

  campaignGrid.replaceChildren();


  /*
     Determine visible campaigns.
  */

  const sortedCampaigns =
    [...CAMPAIGNS].sort(
      (firstCampaign, secondCampaign) =>
        calculateProgress(
          secondCampaign.raised,
          secondCampaign.target
        ) -
        calculateProgress(
          firstCampaign.raised,
          firstCampaign.target
        )
    );

  const visibleCampaigns =
    showingAllCampaigns
      ? sortedCampaigns
      : sortedCampaigns.slice(
          0,
          INITIAL_VISIBLE_CAMPAIGNS
        );


  /*
     Create campaign cards.
  */

  visibleCampaigns.forEach(
    campaign => {

      const card =
        createCampaignCard(
          campaign
        );

      campaignGrid.appendChild(
        card
      );

    }
  );


  updateMoreButton();
}


/* =========================================================
   SEE MORE / SHOW LESS
========================================================= */

if (moreButton) {

  moreButton.addEventListener(
    "click",
    () => {

      showingAllCampaigns =
        !showingAllCampaigns;


      renderCampaigns();


      /*
         When collapsing the list,
         return to campaign section.
      */

      if (!showingAllCampaigns) {

        const campaignsSection =
          document.querySelector(
            ".campaigns-section"
          );


        if (campaignsSection) {

          campaignsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }

      }

    }
  );
}


/* =========================================================
   INITIALIZE
========================================================= */

renderCampaigns();