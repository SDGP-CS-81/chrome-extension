import { setVideoUrl } from "./setVideoUrl";

const OUT_BG_TIMEOUT = 5;

// cannot tell wt the number returned is referring to, remove or reinstate
export function backgroundModeListener(
  removeVideoTimeoutId: number,
  reinstateVideoTimeoutId: number,
  audioSrcUrl: string,
  originalSrcUrl: string,
  inBgTimeout: number
): number {
  console.log(`backgroundModeListener: Visibility changed`);

  if (document.hidden) {
    console.log(
      `ContentScript/backgroundModeListener: Page is hidden, outBgListenerHandler cleared, inBgListenerHandler created`
    );
    window.clearTimeout(reinstateVideoTimeoutId);

    // inbg
    removeVideoTimeoutId = window.setTimeout(() => {
      setVideoUrl(audioSrcUrl);
    }, inBgTimeout * 1000);
    return removeVideoTimeoutId;
  } else {
    console.log(
      `backgroundModeListener: Page is visible, inBgListenerHandler cleared, outBgListenerHandler created`
    );
    window.clearTimeout(removeVideoTimeoutId);

    // outbg
    reinstateVideoTimeoutId = window.setTimeout(() => {
      setVideoUrl(originalSrcUrl);
    }, OUT_BG_TIMEOUT * 1000);

    return reinstateVideoTimeoutId;
  }
}
