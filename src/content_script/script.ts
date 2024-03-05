(async () => {
  // import additional scripts
  const helpers = await import(chrome.runtime.getURL("../common/helpers.js"));

  // a variable to track the original video
  // blob url and the audio url
  let originalSrc: string = null;
  let audioSrc: string = null;

  const storeOriginalSrcUrl = () => {
    const videoElement = document.querySelector("video");

    if (videoElement.src.includes("blob")) {
      originalSrc = videoElement.src;
      console.log(`Original Src: ${originalSrc}`);
    }
  };

  const setVideoUrl = (url: string) => {
    console.log(`Video Url: ${url}`);
    if (url) {
      const videoElement = document.querySelector("video");
      const currentTime = videoElement.currentTime;

      videoElement.pause();
      videoElement.src = url;
      videoElement.currentTime = 0;
      videoElement.play();

      videoElement.currentTime = currentTime;
    }
  };

  const backgroundModeListener = () => {
    if (document.visibilityState === "hidden") {
      setVideoUrl(audioSrc);
    } else if (document.visibilityState === "visible") {
      setVideoUrl(originalSrc);
    }
  };

  // respond to settings changes
  const settingsListener = (changes: {
    [key: string]: chrome.storage.StorageChange;
  }) => {
    const preferences = changes["preferences"];

    if (preferences != undefined) {
      const newValues = preferences.newValue["features"];
      const oldValues = preferences.oldValue["features"];

      if (newValues && oldValues) {
        const audioOnlyNew = newValues["audioOnly"];
        const audioOnlyOld = oldValues["audioOnly"];

        const backgroundNew = newValues["lowBackgroundResolution"];
        const backgroundOld = oldValues["lowBackgroundResolution"];

        console.log(
          `audioOnlyOld: ${audioOnlyOld}, audioOnlyNew: ${audioOnlyNew}, bgOld: ${backgroundOld}, bgNew: ${backgroundNew}`
        );

        // If there were no changes to any of the required prefs
        if (audioOnlyNew == audioOnlyOld && backgroundNew == backgroundOld)
          return;

        // audioOnly takes precedence over the background mode listener
        if (audioOnlyNew) {
          // remove the background listener if it exists
          // we will unconditionally remove video streams now
          document.removeEventListener(
            "visibilitychange",
            backgroundModeListener
          );

          setVideoUrl(audioSrc);
        }
        // the second check here is to reenable background tab mode
        // should we disable audioOnly after having it override the
        // background tab mode
        else if (backgroundNew || (!audioOnlyNew && backgroundOld)) {
          document.addEventListener("visibilitychange", backgroundModeListener);
        } else if (!backgroundNew) {
          document.removeEventListener(
            "visibilitychange",
            backgroundModeListener
          );

          setVideoUrl(originalSrc);
        }
        // this condition should run if we disable the features
        else {
          setVideoUrl(originalSrc);
        }
      }
    }
  };

  const audioOnlyListener = (message: { [key: string]: string }) => {
    chrome.runtime.onMessage.removeListener(audioOnlyListener);

    // store the audio url
    audioSrc = message["url"];
    storeOriginalSrcUrl();

    helpers
      .getPreferences()
      .then((prefs: any) => {
        console.log(prefs);

        const audioOnly = prefs["features"]["audioOnly"];
        const bgTab = prefs["features"]["lowBackgroundResolution"];

        if (audioOnly) {
          setVideoUrl(audioSrc);
        } else if (bgTab) {
          document.addEventListener("visibilitychange", backgroundModeListener);
        }
      })
      .finally(() => {
        chrome.storage.local.onChanged.addListener(settingsListener);
      });
  };

  const runOnUrlChange = async () => {
    const observerConfig = {
      childList: true,
      subtree: true,
      attributes: true,
    };

    const currentVideoID = location.href.split("v=")[1].split("&")[0];
    const videoScores = await helpers.getVideoScores(currentVideoID);
    const qualityToSet = await helpers.calcOptimumQuality(videoScores);

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

  const setQuality = (quality: string) => {
    // click the settings button in video player
    const vidSettingsButton: HTMLElement = document.querySelectorAll(
      ".ytp-settings-button"
    )[0] as HTMLElement;
    vidSettingsButton.click();

    // if current quality is already the same as quality to be set, return
    if (
      (
        document.querySelector(".ytp-menu-label-secondary") as HTMLElement
      )?.innerText?.includes(quality + "p")
    )
      return vidSettingsButton.click();

    // click the "Quality" button in settings menu popup
    let qualityButton = null;

    // .ytp-menu-label-secondary is only applied to the quality button
    // if the quality is 'auto' and has the (Auto) string in the label
    // this is good since we won't override the settings if the user manually
    // sets a quality
    qualityButton = document.querySelector(".ytp-menu-label-secondary")
      ?.parentElement;

    qualityButton?.click();

    // get the list of available qualities
    const availableQualities = document.querySelectorAll(
      ".ytp-quality-menu .ytp-menuitem-label"
    ) as NodeListOf<HTMLElement>;
    let hasQualityBeenSet = false;
    for (const qualityElement of Array.from(availableQualities)) {
      // check if quality is in innertext ex: "1080p" in "1080p HD"
      if (qualityElement.innerText.includes(quality + "p")) {
        hasQualityBeenSet = true;
        qualityElement.click();
        break;
      }
    }

    // if quality has not been set, close settings as it is open
    if (!hasQualityBeenSet) return vidSettingsButton.click();
  };

  document.addEventListener("yt-navigate-finish", async () => {
    if (location.pathname != "/watch") return;
    chrome.runtime.onMessage.addListener(audioOnlyListener);
    runOnUrlChange();
  });
})();
