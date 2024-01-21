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

    // get video text info when description updated by yt
    // new MutationObserver((_, observer) => {
    //   if (
    //     document.querySelector(".yt-core-attributed-string--link-inherit-color")
    //   ) {
    //     getVideoTextInfo();
    //     observer.disconnect();
    //   }
    // }).observe(document.body, observerConfig);

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

    // ------uncomment----it works--------------------commented for testing purposes
    // if current quality is already the same as quality to be set, return
    // if (
    //   document
    //     .querySelector(".ytp-menu-label-secondary")
    //     ?.innerText?.includes(quality)
    // )
    //   return vidSettingsButton.click();

    // click the "Quality" button in settings menu popup
    let qualityButton = null;
    // possible to take 3rd index instead of looping to check innertext- but risky
    // const settingsMenuBtns = document.querySelectorAll(".ytp-menuitem-label");
    // for (const btn of settingsMenuBtns) {
    //   if (window.constants.qualityTitles.includes(btn.innerText)) {
    //     qualityButton = btn;
    //     break;
    //   }
    // }

    // this approach is lesscode-- but wont set quality if already set by anything(it relies on () being around quality when auto)
    // which is good
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

    // prob can be removed
    // if setting is open due to any edge case, close settings if possible asap
    // const startTime = new Date().getTime();
    // const closeSettingsInterval = setInterval(() => {
    //   if (vidSettingsButton.ariaExpanded === "true") {
    //     vidSettingsButton.click();
    //     clearInterval(closeSettingsInterval);
    //   }
    //   if (new Date().getTime() - startTime > 300)
    //     clearInterval(closeSettingsInterval);
    // }, 100);
  };

  // const getVideoTextInfo = () => {
  //   const videoTitle = getVideoTitle();
  //   const videoDescription = getVideoDescription();

  //   // get keyword match scores seperately as they may have different levels of importance
  //   // ex: titles are more important than descriptions
  //   const titleScores = window.helpers.getKeywordScores(
  //     videoTitle,
  //     window.constants.categoryKeywords
  //   );
  //   const descriptionScores = window.helpers.getKeywordScores(
  //     videoDescription,
  //     window.constants.categoryKeywords
  //   );
  //   console.log(titleScores);
  //   console.log(descriptionScores);
  // };
})();

// currently vid description is getting previous vid desc
// so it has been disabled
