import { HOME_PAGE_TITLE, SITE_NAME } from "./site-config.js";

const siteInitials = SITE_NAME
  .split(/\s+/)
  .filter(Boolean)
  .map(word => word[0])
  .join("")
  .toUpperCase();

document.querySelectorAll("[data-site-name]").forEach(element => {
  element.textContent = SITE_NAME;
});

document.querySelectorAll("[data-site-initials]").forEach(element => {
  element.textContent = siteInitials;
});

const title = document.querySelector("title[data-page-title]");
if (title) {
  document.title = title.dataset.pageTitle === "home"
    ? `${SITE_NAME} | ${HOME_PAGE_TITLE}`
    : `${title.dataset.pageTitle} | ${SITE_NAME}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const year = document.querySelector("#year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
});
