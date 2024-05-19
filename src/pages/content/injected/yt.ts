import { audioModeListener } from "./audioModeListener";
import { runOnUrlChange } from "./onYTurlChange";
import { State } from "@src/pages/content/injected/TemporaryState";

document.addEventListener("yt-navigate-finish", () => {
  State.audioModeListener = audioModeListener;
  chrome.runtime.onMessage.removeListener(State.audioModeListener);

  if (location.pathname.includes("/watch")) {
    runOnUrlChange();

    chrome.runtime.onMessage.addListener(State.audioModeListener);
  }
});
