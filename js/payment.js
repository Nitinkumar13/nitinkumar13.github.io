import { appState } from "./state.js";
import { formatAllocation, formatINR } from "./formatting.js";

const UPI_ID = "7999383756@ybl";
const UPI_PAYEE_NAME = "Nitin Kumar Gour";

export function initializePayment() {
  const modal = document.getElementById("upiModal");
  const closeButton = document.getElementById("upiClose");
  const intentButton = document.getElementById("upiIntentBtn");
  const showUtrButton = document.getElementById("showUtrBtn");
  const utrSection = document.getElementById("utrSection");
  const utrForm = document.getElementById("utrForm");
  const utrSuccess = document.getElementById("utrSuccess");

  const paymentIntro = modal.querySelector(".upi-dialog > .payment-help");
  const paymentSafety = modal.querySelector(".payment-note");
  const paymentSummary = modal.querySelector(".upi-summary");
  const paymentBreakup = modal.querySelector(".payment-breakup-modal");
  const paymentQr = modal.querySelector(".upi-qr-wrap");
  const paymentActions = modal.querySelector(".upi-actions");

  const setSuccessView = (isSuccess) => {
    [
      paymentIntro,
      paymentSafety,
      paymentSummary,
      paymentBreakup,
      paymentQr,
      paymentActions
    ].forEach((element) => {
      element.style.display = isSuccess ? "none" : "";
    });

    utrForm.style.display = isSuccess ? "none" : "grid";
    utrSection.style.display = isSuccess ? "block" : "none";
    utrSuccess.style.display = isSuccess ? "block" : "none";
  };

  const openPayment = (planName, amount) => {
    if (!appState.selectedAnimal) {
      alert("Please choose a cow first.");
      document
        .getElementById("animals")
        .scrollIntoView({ behavior: "smooth" });
      return;
    }

    appState.currentPayment = {
      animalName: appState.selectedAnimal.name,
      animalId: appState.selectedAnimal.id,
      planName,
      amount: Number(amount)
    };

    const payment = appState.currentPayment;

    document.getElementById("upiAnimalName").textContent =
      payment.animalName;

    document.getElementById("upiAnimalId").textContent =
      payment.animalId;

    document.getElementById("upiPlanName").textContent =
      payment.planName;

    document.getElementById("upiAmount").textContent =
      formatINR(payment.amount);

    document.getElementById("upiCareAllocation").textContent =
      formatAllocation(payment.amount, 0.8);

    document.getElementById("upiServiceAllocation").textContent =
      formatAllocation(payment.amount, 0.2);

    document.getElementById("upiBreakupTotal").textContent =
      formatINR(payment.amount);

    /*
     * UPI Intent
     *
     * Amount is intentionally NOT sent here.
     * The UPI app will open with the Go Palak
     * payee details and transaction remark.
     *
     * Customer will enter/confirm the amount manually
     * inside the UPI app.
     */
    const note =
      `Go Palak - ${payment.planName} - ${payment.animalName} (${payment.animalId})`;

    const params = new URLSearchParams({
          pa: UPI_ID,
          pn: UPI_PAYEE_NAME,
          am: payment.amount.toFixed(2),
          cu: "INR"
        });

    intentButton.href = `upi://pay?${params.toString()}`;

    setSuccessView(false);
    utrForm.reset();

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  document.querySelectorAll(".upi-pay-btn").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.plan === "custom") {
        const input = document.getElementById("customAmount");
        const amount = Number(input.value);

        if (
          !Number.isFinite(amount) ||
          amount < 1 ||
          !Number.isInteger(amount)
        ) {
          alert("Please enter a valid whole amount of ₹1 or more.");
          input.focus();
          return;
        }

        openPayment(button.dataset.planName, amount);
        return;
      }

      openPayment(
        button.dataset.planName,
        button.dataset.amount
      );
    });
  });

  const closePayment = () => {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  };

  closeButton.addEventListener("click", closePayment);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closePayment();
    }
  });

  showUtrButton.addEventListener("click", () => {
    utrSection.style.display = "block";

    utrSection.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  });

  utrForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document
      .getElementById("customerName")
      .value
      .trim();

    const mobile = document
      .getElementById("customerMobile")
      .value
      .trim();

    const utr = document
      .getElementById("utrNumber")
      .value
      .trim();

    if (!name || !mobile || !utr) {
      return;
    }

    const payment = appState.currentPayment;

    setSuccessView(true);

    utrSuccess.innerHTML = `
      <div class="payment-success-icon" aria-hidden="true">✓</div>

      <div class="payment-success-title">
        Payment details submitted
      </div>

      <div class="payment-success-text">
        Thank you, ${name.replace(/[<>]/g, "")}! 
        Your payment details have been submitted successfully.
      </div>

      <div class="payment-success-summary">
        <div>
          <span>Animal</span>
          <strong>
            ${payment.animalName} (${payment.animalId})
          </strong>
        </div>

        <div>
          <span>Care plan</span>
          <strong>
            ${payment.planName}
          </strong>
        </div>

        <div>
          <span>Amount</span>
          <strong>
            ${formatINR(payment.amount)}
          </strong>
        </div>

        <div>
          <span>UTR / Transaction ID</span>
          <strong>
            ${utr.replace(/[<>]/g, "")}
          </strong>
        </div>
      </div>

      <div class="payment-success-note">
        Your booking will be confirmed after Go Palak manually
        verifies the payment. Please keep your UPI transaction
        receipt until confirmation.
      </div>
    `;
  });
}