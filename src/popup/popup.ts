import { getCurrentVideoCategory, getPreferences } from "../common/helpers.js";

// on document load, grab the current video category
// then host it's dropdown element into the html document
(async () => {
  const currentVideoCategory = await getCurrentVideoCategory();

  const dropdownContainer = document.querySelector(".dropdown-popup");
  const newDropdownEl = document.createElement("dropdown-el");
  newDropdownEl.setAttribute("category-id", currentVideoCategory);
  dropdownContainer.appendChild(newDropdownEl);

  // const preferences = await getPreferences();
  // console.log("get preferences", preferences.audioOnly);

  // chrome.storage.local.get(["audioOnly"]).then((result) => {
  //   console.log("popup: Value is " + result.audioOnly);
  // });
})();