import {
  HOME_PAGE_TITLE,
  SITE_NAME,
  CONTACT
} from "./site-config.js";


// --------------------------------------------------
// Site initials
// --------------------------------------------------

const siteInitials = SITE_NAME
  .split(/\s+/)
  .filter(Boolean)
  .map(word => word[0])
  .join("")
  .toUpperCase();


// --------------------------------------------------
// Site name
// --------------------------------------------------

document.querySelectorAll("[data-site-name]").forEach(element => {
  element.textContent = SITE_NAME;
});


// --------------------------------------------------
// Site initials
// --------------------------------------------------

document.querySelectorAll("[data-site-initials]").forEach(element => {
  element.textContent = siteInitials;
});


// --------------------------------------------------
// Page title
// --------------------------------------------------

const title = document.querySelector("title[data-page-title]");

if (title) {
  document.title = title.dataset.pageTitle === "home"
    ? `${SITE_NAME} | ${HOME_PAGE_TITLE}`
    : `${title.dataset.pageTitle} | ${SITE_NAME}`;
}


// --------------------------------------------------
// Contact information
// --------------------------------------------------

function setContactText(selector, value) {
  document.querySelectorAll(selector).forEach(element => {
    element.textContent = value || "To be announced";
  });
}


function setContactLink(selector, value, prefix = "") {
  document.querySelectorAll(selector).forEach(element => {

    if (value) {
      element.href = `${prefix}${value}`;
      element.textContent = value;
      element.removeAttribute("aria-disabled");
    } else {
      element.removeAttribute("href");
      element.textContent = "To be announced";
      element.setAttribute("aria-disabled", "true");
    }

  });
}


setContactLink(
  '[data-contact="email"]',
  CONTACT.email,
  "mailto:"
);


setContactLink(
  '[data-contact="phone"]',
  CONTACT.phone,
  "tel:"
);


setContactText(
  '[data-contact="address"]',
  CONTACT.address
);


setContactText(
  '[data-contact="working-hours"]',
  CONTACT.workingHours
);


// --------------------------------------------------
// Social media
// --------------------------------------------------

const socialLinks = CONTACT.social || {};

document.querySelectorAll("[data-social]").forEach(link => {

  const platform = link.dataset.social;
  const url = socialLinks[platform];

  if (url) {
    link.href = url;
    link.removeAttribute("hidden");
    link.removeAttribute("aria-disabled");
  } else {
    link.removeAttribute("href");
    link.setAttribute("aria-disabled", "true");
  }
});


// --------------------------------------------------
// Mobile navigation
// --------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");

  if (toggle && nav) {

    toggle.addEventListener("click", () => {

      const isOpen = nav.classList.toggle("open");

      toggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

    });


    nav.querySelectorAll("a").forEach(link => {

      link.addEventListener("click", () => {

        nav.classList.remove("open");

        toggle.setAttribute(
          "aria-expanded",
          "false"
        );

      });

    });

  }


  // ------------------------------------------------
  // Footer year
  // ------------------------------------------------

  const year = document.querySelector("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

});