import { appState } from "./state.js";

export function initializeCowSelection() {
  const selectedAnimalBanner = document.getElementById("selectedAnimalBanner");
  const selectedAnimalName = document.getElementById("selectedAnimalName");
  const selectedAnimalId = document.getElementById("selectedAnimalId");
  const selectedAnimalLabels = document.querySelectorAll("[data-selected-animal]");

  document.querySelectorAll(".select-animal").forEach((button) => {
    button.addEventListener("click", () => {
      const animal = {
        name: button.dataset.animalName,
        id: button.dataset.animalId
      };

      appState.selectedAnimal = animal;
      selectedAnimalName.textContent = animal.name;
      selectedAnimalId.textContent = animal.id;
      selectedAnimalBanner.style.display = "block";
      selectedAnimalLabels.forEach((label) => {
        label.textContent = `Selected: ${animal.name} · ${animal.id}`;
      });
    });
  });
}
