import { getCurrentVideoCategory, getPreferences } from "../common/helpers.js";

// send a message to content script
(async () => {
  chrome.tabs.query(
    {
      currentWindow: true,
      active: true,
      url: "*://*.youtube.com/*",
    },
    (tabs) => {
      const activeTab = tabs[0];

      if (activeTab) {
        chrome.tabs.sendMessage(
          activeTab.id,
          {
            type: "MSG_POPUP_TAB_GET_CHANNEL",
          },
          async (response) => {
            const { channelId, channelName } = response;

            // get current selected category
            const preferences = await getPreferences();

            const channelDropdownContainer = document.querySelector(
              ".channel-dropdown-popup"
            );
            const newChannelEl = document.createElement("category-dropdown");
            // pass current selected category as an attribute
            newChannelEl.setAttribute(
              "channel-category-id",
              preferences.channelPreferences[channelName]
            );
            newChannelEl.setAttribute("channel-name", channelName);
            newChannelEl.setAttribute("channel-id", channelId);
            channelDropdownContainer.appendChild(newChannelEl);
          }
        );
      }
    }
  );

  // on document load, grab the current video category
  // then host its dropdown element into the html document
  const currentVideoCategory = await getCurrentVideoCategory();

  const dropdownContainer = document.querySelector(".dropdown-popup");
  const newCategoryEl = document.createElement("category-el");
  newCategoryEl.setAttribute("category-id", currentVideoCategory);
  dropdownContainer.appendChild(newCategoryEl);
})();
