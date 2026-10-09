# NGO Website — Phase 1

Static HTML/CSS/JavaScript website designed for GitHub Pages.

## Before publishing
Replace:
- contact information
- social links
- final vision/mission text
- registration details once finalized

Update `SITE_NAME` in `js/site-config.js` to change the organization name,
logo initials, and page titles. `HOME_PAGE_TITLE` controls the homepage title
phrase; on other pages, set `data-page-title` on the `<title>` element to
control the page-specific part.

## Structure
- `index.html` — homepage
- `about.html`
- `campaigns.html`
- `impact.html`
- `transparency.html`
- `get-involved.html`
- `contact.html`
- `css/style.css`
- `js/main.js`
- `js/site-config.js` — shared site-wide values
- `js/campaigns-data.js` — campaign content displayed on the campaigns page
- `js/campaigns-page.js` — renders campaign cards from the campaign data

## Future migration
The information architecture is intentionally compatible with:
HTML/CSS/JS → Django templates → Django + PostgreSQL → optional React/Next.js frontend.
