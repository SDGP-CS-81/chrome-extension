import { State } from "@src/pages/content/injected/TemporaryState";

export function storeOriginalSrcUrl() {
  console.log(`storeOriginalSrcUrl: Storing video src url`);
  const videoElement = document.querySelector("video");

  if (videoElement.src.includes("blob")) {
    console.log(`Valid blob url found originalSrc: ${videoElement.src}`);

    State.originalSrcUrl = videoElement.src;
  }
}
