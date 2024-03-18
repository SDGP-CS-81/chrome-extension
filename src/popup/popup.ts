import { getPreferences } from "../common/helpers.js";

// send a message to content script
chrome.tabs.query(
  {
    currentWindow: true,
    active: true,
    url: "*://*.youtube.com/*",
  },
  (tabs) => {
    const activeTab = tabs[0];

    if (activeTab) {
      console.log(
        `Popup: Active YT tab found, requesting channel and category information`
      );

      // message to get channel information
      chrome.tabs.sendMessage(
        activeTab.id,
        {
          type: "MSG_POPUP_TAB_GET_CHANNEL",
        },
        async (response) => {
          if (response) {
            const { channelId, channelName } = response;
            console.log(`Popup: Received channel response from content script`);
            console.log(
              `Popup: channelId: ${channelId}, channelName: ${channelName}`
            );

            if (channelId && channelName) {
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
          }
        }
      );

      // on document load, grab the current video category
      // then host its dropdown element into the html document
      chrome.tabs.sendMessage(
        activeTab.id,
        { type: "MSG_POPUP_TAB_GET_CATEGORY" },
        (response) => {
          if (response) {
            console.log(
              `Popup: Received category response from content script`
            );

            const categoryId = response.categoryId;
            console.log(`Popup: categoryId: ${categoryId}`);

            if (categoryId) {
              const dropdownContainer =
                document.querySelector(".dropdown-popup");
              const newCategoryEl = document.createElement("category-el");
              newCategoryEl.setAttribute("category-id", categoryId);
              dropdownContainer.appendChild(newCategoryEl);
            }
          }
        }
      );
    }
  }
);
