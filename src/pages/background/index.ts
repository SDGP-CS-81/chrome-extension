import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
import "webextension-polyfill";

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");

const removeURLParameters = (url: string, parameters: string[]) => {
  const urlParts = url.split("?");
  if (urlParts.length < 2) return;

  console.log(`BG: Cleaning parameters from url`);

  const currentParameters = urlParts[1].split(/[&;]/g);
  const encodedParameters = parameters.map(
    (para) => `${encodeURIComponent(para)}=`
  );
  const filteredParameters = currentParameters.filter(
    (p) => !encodedParameters.some((enc) => p.startsWith(enc))
  );

  return `${urlParts[0]}?${filteredParameters.join("&")}`;
};
const processRequest = (details: chrome.webRequest.WebRequestBodyDetails) => {
  const { url, tabId } = details;
  console.log(`BG: Processing request, url: ${url}, tabId: ${tabId}`);

  // handle live audio streams
  if (url.includes("live=1")) {
    console.log(`BG: Live video detected, skipping.`);
    return;
  }

  // remove specific parameters from audio URLs
  const parametersToBeRemoved = ["range", "rn", "rbuf", "ump"];
  const audioURL = removeURLParameters(url, parametersToBeRemoved);
  console.log(`BG: Cleaned audio url, url: ${audioURL}`);

  if (audioURL) {
    console.log(`BG: Sending message, tab: ${tabId}, url: ${audioURL}`);
    chrome.tabs.sendMessage(tabId, {
      type: "MSG_BG_TAB_AUDIOURL",
      url: audioURL
    });
  }
};

chrome.webRequest.onBeforeRequest.addListener(processRequest, {
  urls: ["*://*.googlevideo.com/videoplayback*mime=audio*"]
});
