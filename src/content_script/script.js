(async () => {
  // import additional scripts
  window.constants = await import(
    chrome.runtime.getURL("../common/constants.js")
  );
  window.helpers = await import(chrome.runtime.getURL("../common/helpers.js"));

  document.addEventListener("yt-navigate-finish", () => {
    if (location.pathname != "/watch") return;
    runOnUrlChange();
  });

  const runOnUrlChange = async () => {
    const observerConfig = {
      childList: true,
      subtree: true,
      attributes: true,
    };

    const currentVideoID = location.href.split("v=")[1].split("&")[0];
    const videoScores = await window.helpers.getVideoScores(currentVideoID);
    const qualityToSet = await window.helpers.calcOptimumQuality(videoScores);

    console.log(videoScores);
    // perhaps reassign a null varaible "qualityToSet" and check in observer

    new MutationObserver((_, observer) => {
      if (!document.contains(document.querySelector(".ytp-settings-button")))
        return;
      observer.disconnect();

      setTimeout(() => {
        console.log("setQualityWhenPossible");
        setQuality(qualityToSet);
      }, 100);
    }).observe(document.body, observerConfig);
  };

  const setQuality = (quality) => {
    // click the settings button in video player
    const vidSettingsButton = document.querySelectorAll(
      ".ytp-settings-button"
    )[0];
    vidSettingsButton.click();

    // if current quality is already the same as quality to be set, return
    if (
      document
        .querySelector(".ytp-menu-label-secondary")
        ?.innerText?.includes(quality)
    )
      return vidSettingsButton.click();

    // click the "Quality" button in settings menu popup
    let qualityButton = null;

    // .ytp-menu-label-secondary is only applied to the quality button
    // if the quality is 'auto' and has the (Auto) string in the label
    // this is good since we won't override the settings if the user manually
    // sets a quality
    qualityButton = document.querySelector(
      ".ytp-menu-label-secondary"
    )?.parentElement;

    qualityButton?.click();

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
  };
})();
