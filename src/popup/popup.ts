import { getCurrentVideoCategory } from "../common/helpers.js";

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
          (response) => {
            const { channelId, channelName } = response;

            const channelDropdownContainer = document.querySelector(
              ".channel-dropdown-popup"
            );
            const newChannelEl = document.createElement("category-dropdown");
            newChannelEl.setAttribute("channel-category-id", "");
            newChannelEl.setAttribute("channel-name", channelName);
            newChannelEl.setAttribute("channel-id", channelId);
            console.log("new channel element", newChannelEl);
            channelDropdownContainer.appendChild(newChannelEl);
          }
        );
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
