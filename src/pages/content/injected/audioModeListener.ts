import { State } from "@src/pages/content/injected/TemporaryState";
import { storeOriginalSrcUrl } from "./storeOriginalSrcUrl";
import featurePreferenceStorage from "@root/src/shared/storages/featurePreferenceStorage";
import { setVideoUrl } from "./setVideoUrl";

export const audioModeListener = (message: { [key: string]: string }) => {
  console.log(`AudioOnlyListener: Message received, type: ${message["type"]}`);
  chrome.runtime.onMessage.removeListener(State.audioModeListener);

  if (message["type"] !== "MSG_BG_TAB_AUDIOURL") return;

  // console.log(`AudioOnlyListener: Removing listener`);
  // chrome.runtime.onMessage.removeListener(audioOnlyListener);

  featurePreferenceStorage.get().then((featurePreferences) => {
    if (!featurePreferences.audioMode) return;

    // store the audio url
    State.audioSrcUrl = message["url"];
    console.log(State.audioSrcUrl);
    storeOriginalSrcUrl();
    setVideoUrl(State.audioSrcUrl);
  });
};
