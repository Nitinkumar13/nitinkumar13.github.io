import { appState } from "./state.js";
import { formatAllocation, formatINR } from "./formatting.js";

const UPI_ID = "businessgurulearning@ybl";
const UPI_PAYEE_NAME = "Nitin Kumar Gour";

export function initializePayment() {
  const modal = document.getElementById("upiModal");
  const closeButton = document.getElementById("upiClose");
  const intentButton = document.getElementById("upiIntentBtn");
  const showUtrButton = document.getElementById("showUtrBtn");
  const utrSection = document.getElementById("utrSection");
  const utrForm = document.getElementById("utrForm");
  const utrSuccess = document.getElementById("utrSuccess");

  const openPayment = (planName, amount) => {
    if (!appState.selectedAnimal) {
      alert("Please choose a cow first.");
      document.getElementById("animals").scrollIntoView({ behavior: "smooth" });
      return;
    }

    appState.currentPayment = {
      animalName: appState.selectedAnimal.name,
      animalId: appState.selectedAnimal.id,
      planName,
      amount: Number(amount)
    };

    const payment = appState.currentPayment;
    document.getElementById("upiAnimalName").textContent = payment.animalName;
    document.getElementById("upiAnimalId").textContent = payment.animalId;
    document.getElementById("upiPlanName").textContent = payment.planName;
    document.getElementById("upiAmount").textContent = formatINR(payment.amount);
    document.getElementById("upiCareAllocation").textContent = formatAllocation(payment.amount, 0.8);
    document.getElementById("upiServiceAllocation").textContent = formatAllocation(payment.amount, 0.2);
    document.getElementById("upiBreakupTotal").textContent = formatINR(payment.amount);

    const note = `Go Palak - ${payment.planName} - ${payment.animalName} (${payment.animalId})`;
    const params = new URLSearchParams({
      pa: UPI_ID,
      pn: UPI_PAYEE_NAME,
      am: payment.amount.toFixed(2),
      cu: "INR",
      tn: note
    });
    intentButton.href = `upi://pay?${params.toString()}`;

    utrSection.style.display = "none";
    utrSuccess.style.display = "none";
    utrForm.reset();
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  document.querySelectorAll(".upi-pay-btn").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.plan === "custom") {
        const input = document.getElementById("customAmount");
        const amount = Number(input.value);
        if (!Number.isFinite(amount) || amount < 1 || !Number.isInteger(amount)) {
          alert("Please enter a valid whole amount of ₹1 or more.");
          input.focus();
          return;
        }
        openPayment(button.dataset.planName, amount);
        return;
      }
      openPayment(button.dataset.planName, button.dataset.amount);
    });
  });

  const closePayment = () => {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  };

  closeButton.addEventListener("click", closePayment);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closePayment();
  });

  showUtrButton.addEventListener("click", () => {
    utrSection.style.display = "block";
    utrSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  utrForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("customerName").value.trim();
    const mobile = document.getElementById("customerMobile").value.trim();
    const utr = document.getElementById("utrNumber").value.trim();
    if (!name || !mobile || !utr) return;

    const payment = appState.currentPayment;
    const message = [
      "Go Palak Booking Request",
      `Customer: ${name}`,
      `Mobile: ${mobile}`,
      `Animal: ${payment.animalName}`,
      `Go Palak ID: ${payment.animalId}`,
      `Care Plan: ${payment.planName}`,
      `Amount: ${formatINR(payment.amount)}`,
      `Care & Operations (80%): ${formatAllocation(payment.amount, 0.8)}`,
      `Go Palak Platform/Service (20%): ${formatAllocation(payment.amount, 0.2)}`,
      `UPI ID: ${UPI_ID}`,
      `UTR / Transaction ID: ${utr}`,
      "Status: Payment submitted for manual verification"
    ].join("\n");

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    utrSuccess.style.display = "block";
    utrSuccess.innerHTML = "<strong>Booking details prepared.</strong><br>WhatsApp has been opened so you can send the payment details to Go Palak. The booking is confirmed only after payment is manually verified.";
  });
}
