import { appState } from "./state.js";
import { formatAllocation, formatINR } from "./formatting.js";

export function initializePayment() {
  const modal = document.getElementById("upiModal");
  const closeButton = document.getElementById("upiClose");
  const downloadQrButton = document.getElementById("downloadQrBtn");
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

  const qrImage = document.getElementById("goPalakQr");

  /*
   * Show / hide payment and success sections
   */
  const setSuccessView = (isSuccess) => {
    [
      paymentIntro,
      paymentSafety,
      paymentSummary,
      paymentBreakup,
      paymentQr,
      paymentActions
    ].forEach((element) => {
      if (element) {
        element.style.display = isSuccess ? "none" : "";
      }
    });

    utrForm.style.display = isSuccess ? "none" : "grid";
    utrSection.style.display = isSuccess ? "block" : "none";
    utrSuccess.style.display = isSuccess ? "block" : "none";
  };

  /*
   * Open payment modal
   */
  const openPayment = (planName, amount) => {
    if (!appState.selectedAnimal) {
      alert("Please choose a cow first.");

      const animalsSection = document.getElementById("animals");

      if (animalsSection) {
        animalsSection.scrollIntoView({
          behavior: "smooth"
        });
      }

      return;
    }

    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount < 1
    ) {
      alert("Invalid payment amount.");
      return;
    }

    appState.currentPayment = {
      animalName: appState.selectedAnimal.name,
      animalId: appState.selectedAnimal.id,
      planName,
      amount: numericAmount
    };

    const payment = appState.currentPayment;

    /*
     * Payment summary
     */
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
     * QR payment only.
     *
     * IMPORTANT:
     * We intentionally do NOT create a UPI deep link here.
     *
     * Customer will scan the QR using their UPI app.
     */
    setSuccessView(false);

    utrForm.reset();

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  /*
   * Pay Now buttons
   */
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

        openPayment(
          button.dataset.planName,
          amount
        );

        return;
      }

      openPayment(
        button.dataset.planName,
        button.dataset.amount
      );
    });
  });

  /*
   * Download QR
   */
  if (downloadQrButton && qrImage) {
    downloadQrButton.addEventListener("click", async () => {
      try {
        const response = await fetch(qrImage.src);

        if (!response.ok) {
          throw new Error("QR image could not be loaded.");
        }

        const blob = await response.blob();

        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = blobUrl;
        link.download = "Go-Palak-UPI-QR.png";

        document.body.appendChild(link);

        link.click();

        link.remove();

        URL.revokeObjectURL(blobUrl);
      } catch (error) {
        /*
         * Fallback:
         * Open the QR image in a new tab so the customer
         * can save it manually.
         */
        window.open(qrImage.src, "_blank");
      }
    });
  }

  /*
   * Close payment modal
   */
  const closePayment = () => {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  };

  closeButton.addEventListener("click", closePayment);

  /*
   * Close when clicking outside modal
   */
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closePayment();
    }
  });

  /*
   * Customer says payment is completed
   */
  showUtrButton.addEventListener("click", () => {
    utrSection.style.display = "block";

    utrSection.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  });

  /*
   * UTR form submission
   */
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
      alert("Please fill all required payment details.");
      return;
    }

    /*
     * Basic mobile validation
     */
    const cleanMobile = mobile.replace(/\D/g, "");

    if (cleanMobile.length < 10) {
      alert("Please enter a valid mobile number.");
      return;
    }

    const payment = appState.currentPayment;

    setSuccessView(true);

    const safeName = name.replace(/[<>]/g, "");
    const safeUtr = utr.replace(/[<>]/g, "");

    utrSuccess.innerHTML = `
      <div class="payment-success-icon" aria-hidden="true">
        ✓
      </div>

      <div class="payment-success-title">
        Payment details submitted
      </div>

      <div class="payment-success-text">
        Thank you, ${safeName}!
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
            ${safeUtr}
          </strong>
        </div>

      </div>

      <div class="payment-success-note">
        Your booking will be confirmed after Go Palak
        manually verifies the payment.

        Please keep your UPI transaction receipt
        until confirmation.
      </div>
    `;
  });
}