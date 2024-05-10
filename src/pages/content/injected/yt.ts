import { runOnUrlChange } from "./onYTurlChange";

document.addEventListener("yt-navigate-finish", () => {
  if (location.pathname.includes("/watch")) {
    runOnUrlChange();
  }
});
