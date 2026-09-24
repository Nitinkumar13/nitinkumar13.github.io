export function initializeCarousel() {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".carousel-dot");
  let activeAnimal = 0;

  const showAnimal = (index) => {
    activeAnimal = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === activeAnimal);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === activeAnimal);
    });
  };

  document.getElementById("previousAnimal").addEventListener("click", () => showAnimal(activeAnimal - 1));
  document.getElementById("nextAnimal").addEventListener("click", () => showAnimal(activeAnimal + 1));
  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => showAnimal(dotIndex));
  });
  window.setInterval(() => showAnimal(activeAnimal + 1), 4500);
}
