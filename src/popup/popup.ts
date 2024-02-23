import { getCurrentVideoCategory, getPreferences } from "../common/helpers.js";

// on document load, grab the current video category
// then host it's dropdown element into the html document
(async () => {
  const currentVideoCategory = await getCurrentVideoCategory();

  const dropdownContainer = document.querySelector(".dropdown-popup");
  const newDropdownEl = document.createElement("dropdown-el");
  newDropdownEl.setAttribute("category-id", currentVideoCategory);
  dropdownContainer.appendChild(newDropdownEl);

  const audioOnlyElement = document.querySelector('#audioOnly');
  console.log('audioOnlyElement', audioOnlyElement)
  const preferences = await getPreferences();

  audioOnlyElement.checked = preferences.audioOnly;
  console.log('outside the event listener', audioOnlyElement.checked);

  audioOnlyElement.addEventListener('change', async function () {
    console.log('in the event listener', audioOnlyElement.checked)
    chrome.storage.local.set({ audioOnly: audioOnlyElement.checked });
  });
})();