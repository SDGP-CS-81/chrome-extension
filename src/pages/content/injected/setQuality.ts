import refreshOnUpdate from "virtual:reload-on-update-in-view";

refreshOnUpdate("pages/content/injected/setQuality");

function setQuality(quality: string) {
  console.log(
    `ContentScript/setQuality: Attempting to set quality to ${quality}`
  );
  // click the settings button in video player
  const vidSettingsButton: HTMLElement = document.querySelectorAll(
    ".ytp-settings-button"
  )[0] as HTMLElement;
  console.log(`ContentScript/setQuality: Open settings menu`);
  vidSettingsButton.click();

  // if current quality is already the same as quality to be set, return
  if (
    (
      document.querySelector(".ytp-menu-label-secondary") as HTMLElement
    )?.innerText?.includes(quality + "p")
  ) {
    console.log(
      `ContentScript/setQuality: Selected quality and current quality is the same, closing settings, returning`
    );
    vidSettingsButton.click();
    return;
  }

  // click the "Quality" button in settings menu popup
  let qualityButton = null;

  // .ytp-menu-label-secondary is only applied to the quality button
  // if the quality is 'auto' and has the (Auto) string in the label
  // this is good since we won't override the settings if the user manually
  // sets a quality
  qualityButton = document.querySelector(
    ".ytp-menu-label-secondary"
  )?.parentElement;

  console.log(`ContentScript/setQuality: Clicking quality button`);
  qualityButton?.click();

  // TODO Use a find method here
  // get the list of available qualities
  const availableQualities = document.querySelectorAll(
    ".ytp-quality-menu .ytp-menuitem-label"
  ) as NodeListOf<HTMLElement>;

  // TO DO : If quality is not available in video, select the closest,
  // alternate between next up and down

  let isQualitySet = false;
  for (const qualityElement of Array.from(availableQualities)) {
    // check if quality is in innertext ex: "1080p" in "1080p HD"
    if (qualityElement.innerText.includes(quality + "p")) {
      isQualitySet = true;
      qualityElement.click();
      break;
    }
  }

  // Update the original src when the quality changes
  if (isQualitySet) {
    console.log(`ContentScript/setQuality: Quality has been set`);
    // storeOriginalSrcUrl();
  } else {
    console.log(
      `ContentScript/setQuality: Quality has not been set, closing settings`
    );
    vidSettingsButton.click();
  }
}

export default setQuality;
