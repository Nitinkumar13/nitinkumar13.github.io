import { initializeNavigation } from "./navigation.js";
import { initializeCarousel } from "./carousel.js";
import { initializeCowSelection } from "./cow-selection.js";
import { initializeCareProgress } from "./care-progress.js";
import { initializePayment } from "./payment.js";

initializeNavigation();
initializeCarousel();
initializeCowSelection();
initializeCareProgress();
initializePayment();
document.getElementById("year").textContent = new Date().getFullYear();
