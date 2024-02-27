import { getPreferences } from "../common/helpers.js";

(async () => {
  const audioOnlyHandler = (enable: boolean) => {
    const tabIds = new Map();

    // takes a URL and an array of parameter names
    // remove from the URL's query string
    const removeURLParameters = (url: string, parameters: string[]) => {
      const urlParts = url.split("?");
      if (urlParts.length < 2) return;

      const currentParameters = urlParts[1].split(/[&;]/g);
      const encodedParameters = parameters.map(
        (para) => `${encodeURIComponent(para)}=`
      );
      const filteredParameters = currentParameters.filter(
        (p) => !encodedParameters.some((enc) => p.startsWith(enc))
      );

      return `${urlParts[0]}?${filteredParameters.join("&")}`;
    };

    const processRequest = (
      details: chrome.webRequest.WebRequestBodyDetails
    ) => {
      getPreferences().then((preferences) => {
        if (preferences.features.audioOnly) {
          const { url, tabId } = details;
          // filter out non-audio requests
          if (!url.includes("mime=audio")) return;

          // handle live audio streams
          if (url.includes("live=1")) {
            tabIds.set(tabId, "");
            sendMessage(tabId);
            return;
          }

          // remove specific parameters from audio URLs
          const parametersToBeRemoved = ["range", "rn", "rbuf", "ump"];
          const audioURL = removeURLParameters(url, parametersToBeRemoved);
          if (audioURL && tabIds.get(tabId) !== audioURL) {
            tabIds.set(tabId, audioURL);
            sendMessage(tabId);
          }
        } else {
          // if audioOnly preference is false, remove the tab from tabIds
          tabIds.delete(details.tabId);
        }
      });
    };

    const sendMessage = (tabId: number) => {
      if (tabIds.has(tabId)) {
        chrome.tabs.sendMessage(tabId, {
          url: tabIds.get(tabId),
        });
      }
    };

    if (enable) {
      chrome.tabs.onUpdated.addListener(sendMessage);
      chrome.webRequest.onBeforeRequest.addListener(processRequest, {
        urls: ["<all_urls>"],
      });
    } else {
      chrome.tabs.onUpdated.removeListener(sendMessage);
      chrome.webRequest.onBeforeRequest.removeListener(processRequest);
    }
  };

  audioOnlyHandler(true);
})();
