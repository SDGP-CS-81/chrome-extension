(async () => {
  const src = chrome.runtime.getURL("../common/constants.js");
  var constants = await import(src);

  const setQuality = (quality) => {
    // click the settings button in video player
    const vidSettingsButton = document.querySelectorAll(
      ".ytp-settings-button"
    )[0];
    vidSettingsButton.click();

    // click the "Quality" button in settings menu popup
    const settingsMenuBtns = document.querySelectorAll(".ytp-menuitem-label");
    for (const btn of settingsMenuBtns) {
      if (constants.qualityTitles.includes(btn.innerText)) {
        btn.click();
        break;
      }
    }

    // get the list of available qualities
    const availableQualities = document.querySelectorAll(
      ".ytp-quality-menu .ytp-menuitem-label"
    );
    let hasQualityBeenSet = false;
    for (const qualityElement of availableQualities) {
      // check if quality is in innertext ex: "1080p" in "1080p HD"
      if (qualityElement.innerText.includes(quality)) {
        hasQualityBeenSet = true;
        qualityElement.click();
        break;
      }
    }

    // if quality has not been set, close settings as it is open
    if (!hasQualityBeenSet) return vidSettingsButton.click();

    // if setting is open due to any edge case, close settings if possible asap
    const startTime = new Date().getTime();
    const closeSettingsInterval = setInterval(() => {
      if (vidSettingsButton.ariaExpanded === "true") {
        vidSettingsButton.click();
        clearInterval(closeSettingsInterval);
      }
      if (new Date().getTime() - startTime > 300)
        clearInterval(closeSettingsInterval);
    }, 100);
  };

  // setquality must be called after page has been loaded
  setTimeout(() => {
    setQuality("1080mmp");
  }, 3000);
})();
