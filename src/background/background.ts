import { getPreferences, setPreferences } from "../common/helpers.js";

chrome.runtime.onMessage.addListener(async function (message) {
  if (message.from === "channel-name") {
    console.log(message);

    // save channel name in Chrome storage
    const preferences = await getPreferences();
    preferences.channelName = message.channelName;
    await setPreferences(preferences);
    chrome.storage.local.set({
      channelName: message.channelName,
    });

    // send channel name and channelId to popup
    chrome.runtime.sendMessage({
      from: "background",
    });
  }
});

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

const processRequest = (details: chrome.webRequest.WebRequestBodyDetails) => {
  const { url, tabId } = details;

  // handle live audio streams
  if (url.includes("live=1")) return;

  // remove specific parameters from audio URLs
  const parametersToBeRemoved = ["range", "rn", "rbuf", "ump"];
  const audioURL = removeURLParameters(url, parametersToBeRemoved);

  if (audioURL) {
    chrome.tabs.sendMessage(tabId, { url: audioURL });
  }
};

chrome.webRequest.onBeforeRequest.addListener(processRequest, {
  urls: ["*://*.googlevideo.com/videoplayback*mime=audio*"],
});
