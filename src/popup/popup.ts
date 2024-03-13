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
          const currentChannelName = response.channelName;
          console.log("Response from content script:", currentChannelName);

          // get current channel name
          const preferences = await getPreferences();
          preferences.currentChannelName = currentChannelName;
          await setPreferences(preferences);

          // const channelDropdownContainer = document.querySelector('.channel-dropdown-popup');
          // const newDropDownElement = document.createElement('category-dropdown');

          // let selectedCategory;
          // if(currentChannelName in preferences.channelPreferences) {
          //   selectedCategory = preferences.channelPreferences[currentChannelName];
          //   console.log("selected category popup", selectedCategory);
          // } else {
          //   selectedCategory = "null";
          // }
          // // const currentSelectedCategory = preferences.currentSelectedCategory;

          // newDropDownElement.setAttribute("channel-category-id", selectedCategory);
          // console.log(newDropDownElement);
          // channelDropdownContainer.appendChild(newDropDownElement)
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
