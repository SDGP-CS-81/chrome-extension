import { getCurrentVideoCategory } from "../common/helpers.js";

(async () => {
  const currentVideoCategory = await getCurrentVideoCategory();

  const dropdownContainer = document.querySelector(".dropdown-popup");
  const newDropdownEl = document.createElement("dropdown-el");
  newDropdownEl.setAttribute("category-id", currentVideoCategory);
  dropdownContainer.appendChild(newDropdownEl);
})();
