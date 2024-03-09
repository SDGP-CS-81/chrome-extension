import { getCurrentVideoCategory, getPreferences } from "../common/helpers.js";

// send a message to content script when popup is opened on a youtube tab
(async () => {
  chrome.tabs.query({
    currentWindow: true,
    active: true,
    url: "https://www.youtube.com/*"
  }, function (tabs){
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"url": activeTab.url});
});
})();


// display current selected category when chnaged
(async () => {
  chrome.runtime.onMessage.addListener(async function(message) {
    if (message.from === 'background') {

      const dropdownContainer = document.querySelector(".dropdown-channel-popup");
      const newDropdownEl = document.createElement("category-dropdown");

      const preference = await getPreferences();
      const currentSelectedCategory = preference.currentSelectedCategory;

      newDropdownEl.setAttribute("channel-category-id", currentSelectedCategory);
      console.log(newDropdownEl)
      dropdownContainer.appendChild(newDropdownEl);
    }
});
})();

// on document load, grab the current video category
// then host it's dropdown element into the html document
(async () => {
  const currentVideoCategory = await getCurrentVideoCategory();

  const dropdownContainer = document.querySelector(".dropdown-popup");
  const newCategoryEl = document.createElement("category-el");
  newCategoryEl.setAttribute("category-id", currentVideoCategory);
  dropdownContainer.appendChild(newCategoryEl);
})();
