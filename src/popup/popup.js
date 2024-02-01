// localStorage.setItem(
//   "preferences",
//   JSON.stringify({
//     audioOnly: false,
//   })
// );

// chrome.storage.local.set({ preferences: { audioOnly: false } }).then(() => {
//   console.log("Value is set to " + false);
// });

import { getCurrentVideoCategory } from "../common/helpers.js";

getCurrentVideoCategory().then((currentVideoCategory) => {
  const dropdownContainer = document.querySelector(".dropdown-popup");

  // remove existing dropdown-el
  const existingDropdownEl = dropdownContainer.querySelector("dropdown-el");
  if (existingDropdownEl) {
    dropdownContainer.removeChild(existingDropdownEl);
  }

  // create a new dropdown-el
  const newDropdownEl = document.createElement("dropdown-el");
  // console.log(newDropdownEl);
  newDropdownEl.setAttribute("category-id", currentVideoCategory);

  dropdownContainer.appendChild(newDropdownEl);
});
