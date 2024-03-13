import { getCurrentVideoCategory, getPreferences, setPreferences } from "../common/helpers.js";

(async () => {
  // send a message to content script when popup is opened on a youtube tab
  // receive channel name from script
  chrome.tabs.query(
    {
      currentWindow: true,
      active: true,
      url: "*://*.youtube.com/*",
    },
    (tabs) => {
      const activeTab = tabs[0];
      if (activeTab) {
        chrome.tabs.sendMessage(activeTab.id, null, async (response) => {
          console.log("Response from content script:", response.channelName);

          const preferences = await getPreferences();
          preferences.currentChannelName = response.channelName
          await setPreferences(preferences);
          console.log("set preferences", preferences);

          const channelDropdownContainer = document.querySelector('.channel-dropdown-popup');
          const newDropDownElement = document.createElement('category-dropdown');

          const selectedCategory = preferences.channelPreferences[response.channelName]
          // const currentSelectedCategory = preferences.currentSelectedCategory;
          console.log("selected category popup", selectedCategory)

          newDropDownElement.setAttribute(
            "channel-category-id",
            selectedCategory
          );
          console.log(newDropDownElement);
          channelDropdownContainer.appendChild(newDropDownElement)
        });
      }
    }
  );

  // on document load, grab the current video category
  // then host its dropdown element into the html document
  const currentVideoCategory = await getCurrentVideoCategory();

  console.log(currentVideoCategory);

  const dropdownContainer = document.querySelector(".dropdown-popup");
  const newCategoryEl = document.createElement("category-el");
  newCategoryEl.setAttribute("category-id", currentVideoCategory);
  dropdownContainer.appendChild(newCategoryEl);
})();
