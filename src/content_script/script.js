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
    for (const qualityElement of availableQualities) {
      console.log(qualityElement.innerText);
      // check if quality is in innertext ex: "1080p" in "1080p HD"
      if (qualityElement.innerText.includes(quality)) {
        qualityElement.click();
        break;
      }
    }
  };

  // setquality must be called after page has been loaded
  setTimeout(() => {
    setQuality("1080p");
  }, 3000);
})();
