import { appState } from "./state.js";
import { formatAllocation, formatINR } from "./formatting.js";

/*
 * Go Palak — Manual UPI Payment Flow
 *
 * Flow:
 * Website
 *   ↓
 * UPI App
 *   ↓
 * Customer completes payment
 *   ↓
 * Customer returns to website
 *   ↓
 * Customer enters UTR / Transaction ID
 *   ↓
 * Go Palak manually verifies payment
 *
 * IMPORTANT:
 * This code does NOT automatically verify a payment.
 */

const UPI_ID = "paytm.s3h90gx@pty";
const UPI_PAYEE_NAME = "Nitin Kumar Gour";

export function initializePayment() {
  const modal = document.getElementById("upiModal");
  const closeButton = document.getElementById("upiClose");
  const intentButton = document.getElementById("upiIntentBtn");
  const showUtrButton = document.getElementById("showUtrBtn");
  const utrSection = document.getElementById("utrSection");
  const utrForm = document.getElementById("utrForm");
  const utrSuccess = document.getElementById("utrSuccess");

  const paymentIntro = modal.querySelector(
    ".upi-dialog > .payment-help"
  );

  const paymentSafety = modal.querySelector(".payment-note");
  const paymentSummary = modal.querySelector(".upi-summary");
  const paymentBreakup = modal.querySelector(
    ".payment-breakup-modal"
  );
  const paymentQr = modal.querySelector(".upi-qr-wrap");
  const paymentActions = modal.querySelector(".upi-actions");

  /*
   * Show/hide the payment and UTR sections.
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
   * Build the UPI payment URL.
   *
   * The customer is sent to their installed UPI app.
   * Amount is already included, so the customer does not
   * need to type the amount manually.
   */
  const buildUpiUrl = (
    amount,
    animalName,
    animalId,
    planName
  ) => {
    const note =
      `Go Palak - ${planName} - ${animalName} (${animalId})`;

    const params = new URLSearchParams({
      pa: UPI_ID,
      pn: UPI_PAYEE_NAME,
      am: Number(amount).toFixed(2),
      cu: "INR"
    });

    return `upi://pay?${params.toString()}`;
  };

  /*
   * Open payment modal.
   */
  const openPayment = (planName, amount) => {
    if (!appState.selectedAnimal) {
      alert("Please choose a cow first.");

      document
        .getElementById("animals")
        .scrollIntoView({
          behavior: "smooth"
        });

      return;
    }

    appState.currentPayment = {
      animalName: appState.selectedAnimal.name,
      animalId: appState.selectedAnimal.id,
      planName,
      amount: Number(amount)
    };

    const payment = appState.currentPayment;

    /*
     * Update payment summary.
     */
    document.getElementById("upiAnimalName").textContent =
      payment.animalName;

    document.getElementById("upiAnimalId").textContent =
      payment.animalId;

    document.getElementById("upiPlanName").textContent =
      payment.planName;

    document.getElementById("upiAmount").textContent =
      formatINR(payment.amount);

    /*
     * Payment allocation.
     */
    document.getElementById("upiCareAllocation").textContent =
      formatAllocation(payment.amount, 0.8);

    document.getElementById("upiServiceAllocation").textContent =
      formatAllocation(payment.amount, 0.2);

    document.getElementById("upiBreakupTotal").textContent =
      formatINR(payment.amount);

    /*
     * Create UPI Intent URL.
     */
    const upiUrl = buildUpiUrl(
      payment.amount,
      payment.animalName,
      payment.animalId,
      payment.planName
    );

    /*
     * Set the UPI link.
     */
    intentButton.href = upiUrl;

    /*
     * Mark payment link as ready.
     */
    intentButton.dataset.paymentReady = "true";

    /*
     * Reset UTR/payment state.
     */
    setSuccessView(false);
    utrForm.reset();

    /*
     * Open modal.
     */
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  /*
   * Pay Now buttons.
   */
  document
    .querySelectorAll(".upi-pay-btn")
    .forEach((button) => {
      button.addEventListener("click", () => {

        /*
         * Custom amount.
         */
        if (button.dataset.plan === "custom") {
          const input =
            document.getElementById("customAmount");

          const amount = Number(input.value);

          if (
            !Number.isFinite(amount) ||
            amount < 1 ||
            !Number.isInteger(amount)
          ) {
            alert(
              "Please enter a valid whole amount of ₹1 or more."
            );

            input.focus();
            return;
          }

          openPayment(
            button.dataset.planName,
            amount
          );

          return;
        }

        /*
         * Normal care-plan payment.
         */
        openPayment(
          button.dataset.planName,
          button.dataset.amount
        );
      });
    });

  /*
   * When customer clicks "Open UPI App to Pay",
   * we do NOT mark the payment as successful.
   *
   * Opening the UPI app is NOT proof that payment succeeded.
   */
  intentButton.addEventListener("click", () => {
    if (!intentButton.dataset.paymentReady) {
      return;
    }

    /*
     * Nothing else is done here.
     *
     * Customer completes payment in their UPI app
     * and then returns to the website.
     */
  });

  /*
   * Close payment modal.
   */
  const closePayment = () => {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  };

  closeButton.addEventListener(
    "click",
    closePayment
  );

  /*
   * Close when clicking outside dialog.
   */
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closePayment();
    }
  });

  /*
   * Customer says:
   * "I have completed the payment."
   *
   * Show UTR form.
   */
  showUtrButton.addEventListener("click", () => {
    utrSection.style.display = "block";

    utrSection.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  });

  /*
   * Submit UTR.
   */
  utrForm.addEventListener(
    "submit",
    (event) => {
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

      /*
       * Required fields.
       */
      if (!name || !mobile || !utr) {
        alert(
          "Please enter your name, mobile number and UTR / Transaction ID."
        );

        return;
      }

      const payment =
        appState.currentPayment;

      /*
       * IMPORTANT:
       *
       * This does NOT verify the payment.
       *
       * It only records that the customer has submitted
       * payment details for manual verification.
       */
      setSuccessView(true);

      /*
       * Basic HTML escaping for user-entered values.
       */
      const safeName =
        name.replace(/[<>]/g, "");

      const safeMobile =
        mobile.replace(/[<>]/g, "");

      const safeUtr =
        utr.replace(/[<>]/g, "");

      /*
       * Show submission confirmation.
       */
      utrSuccess.innerHTML = `
        <div
          class="payment-success-icon"
          aria-hidden="true"
        >
          ✓
        </div>

        <div class="payment-success-title">
          Payment Details Submitted
        </div>

        <div class="payment-success-text">
          Thank you, ${safeName}!
          Your payment details have been submitted
          for manual verification.
        </div>

        <div class="payment-success-summary">

          <div>
            <span>Animal</span>

            <strong>
              ${payment.animalName}
              (${payment.animalId})
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
            <span>Mobile</span>

            <strong>
              ${safeMobile}
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
          Your payment is NOT considered verified yet.
          Go Palak will manually verify the payment
          before confirming the booking.
          Please keep your UPI transaction receipt
          until confirmation.
        </div>
      `;
    }
  );
}