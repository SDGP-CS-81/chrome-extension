(async () => {
  console.log(`ContentScript: Starting content script`);
  // import additional scripts
  const helpers = await import(chrome.runtime.getURL("../common/helpers.js"));
  const htmlParsers = await import(
    chrome.runtime.getURL("../common/htmlParsers.js")
  );

  // a variable to track the original video
  // blob url and the audio url
  let originalSrc: string = null;
  let audioSrc: string = null;

  // variables to store the timeouts and handlers
  // for the bg tab feature
  let inBgTimeout: number = null;
  let inBgListenerHandle: number = null;
  let outBgListenerHandler: number = null;
  let categoryAudioOnly: boolean = false;

  const outBgTimeout: number = 5;

  // variable to store the channel name and id
  let channelName: string = null;
  let channelId: string = null;
  let channelExtractorHandle: number = null;

  // variables to store category id
  let categoryId: string = null;

  const extractChannelInfo = () => {
    console.log(`ContentScript/extractChannelInfo: Parsing channel info`);
    let channelInfo;

    try {
      if (document.location.href.includes("@")) {
        console.log(`ContentScript/extractChannelInfo: Channel page detected`);
        channelInfo = htmlParsers.getChannelIDAndNameChannelPage();
      } else if (document.location.href.includes("/watch?v=")) {
        console.log(`ContentScript/extractChannelInfo: Video page detected`);
        channelInfo = htmlParsers.getChannelIDAndNameVideoPage();
      }

      channelId = channelInfo["channelId"];
      channelName = channelInfo["channelName"];

      window.clearInterval(channelExtractorHandle);
    } catch (error) {
      console.error(
        `ContentScript/extractChannelInfo: Error detected, trying again`
      );
      console.error(error);
    }
  };

  // receive message from popup
  const popupMessageListener = (
    message: { [key: string]: string },
    sender: chrome.runtime.MessageSender,
    responseCb: (response?: { [key: string]: string }) => void
  ) => {
    console.log(`ContentScript/PopupMessageListener: Message received`);
    console.log(
      `ContentScript/PopupMessageListener: Message type: ${message["type"]}`
    );

    if (message["type"] == "MSG_POPUP_TAB_GET_CHANNEL") {
      if (!(channelName && channelId)) {
        console.log(
          `ContentScript/PopupMessageListener: Channel name and ID not found, extracting`
        );
      }

      console.log(
        `ContentScript/PopupMessageListener: Sending channel response`
      );
      responseCb({ channelId, channelName });
    }

    if (message["type"] == "MSG_POPUP_TAB_GET_CATEGORY") {
      if (!categoryId) {
        console.log(
          `ContentScript/PopupMessageListener: Category not found yet`
        );
      }

      console.log(
        `ContentScript/PopupMessageListener: Sending category response`
      );
      responseCb({ categoryId });
    }
  };

  const storeOriginalSrcUrl = () => {
    console.log(`ContentScript/storeOriginalSrcUrl: Storing video src url`);
    const videoElement = document.querySelector("video");

    if (videoElement.src.includes("blob")) {
      console.log(`ContentScript/storeOriginalSrcUrl: Valid blob url found`);
      console.log(
        `ContentScript/storeOriginalSrcUrl: originalSrc: ${videoElement.src}`
      );
      originalSrc = videoElement.src;
    }
  };

  const setVideoUrl = (url: string) => {
    console.log(`ContentScript/setVideoUrl: Trying to set video url`);
    console.log(`ContentScript/setVideoUrl: Url: ${url}`);
    if (url) {
      const videoElement = document.querySelector("video");
      const currentTime = videoElement.currentTime;
      const pauseState = videoElement.paused;

      if (url === videoElement.src) {
        console.log(`ContentScript/setVideoUrl: Url already set, returning`);
        return;
      }

      console.log(`ContentScript/setVideoUrl: Pause video to set url`);
      videoElement.pause();
      videoElement.src = url;
      videoElement.load();
      videoElement.currentTime = 0;

      // use a timeout to allow the pause op to complete
      setTimeout(() => {
        console.log(
          `ContentScript/setVideoUrl: Continuing video, currentTime = ${currentTime}`
        );
        videoElement.currentTime = currentTime;
        videoElement.play();

        // use a timeout to allow the play op to complete
        setTimeout(() => {
          if (pauseState) {
            console.log(
              `ContentScript/setVideoUrl: Restoring original pause state`
            );
            videoElement.pause();
          }
        }, 200);
      }, 200);
    }
  };

  const backgroundModeListener = () => {
    console.log(`ContentScript/backgroundModeListener: Visibility changed`);
    if (document.visibilityState === "hidden") {
      console.log(
        `ContentScript/backgroundModeListener: Page is hidden, outBgListenerHandler cleared, inBgListenerHandler created`
      );
      window.clearTimeout(outBgListenerHandler);

      inBgListenerHandle = window.setTimeout(() => {
        setVideoUrl(audioSrc);
      }, inBgTimeout * 1000);
    } else if (document.visibilityState === "visible") {
      console.log(
        `ContentScript/backgroundModeListener: Page is visible, inBgListenerHandler cleared, outBgListenerHandler created`
      );
      window.clearTimeout(inBgListenerHandle);

      outBgListenerHandler = window.setTimeout(() => {
        setVideoUrl(originalSrc);
      }, outBgTimeout * 1000);
    }
  };

  // respond to settings changes
  const settingsListener = (changes: {
    [key: string]: chrome.storage.StorageChange;
  }) => {
    console.log(`ContentScript/settingsListener: Settings changed detected`);
    const preferences = changes["preferences"];

    if (preferences != undefined) {
      const newValues = preferences.newValue["features"];
      const oldValues = preferences.oldValue["features"];

      console.log(`ContentScript/settingsListener: New values received`);
      console.log(newValues);
      console.log(`ContentScript/settingsListener: Old values received`);
      console.log(oldValues);

      if (newValues && oldValues) {
        // Update the timeout whenever it's changed
        inBgTimeout = newValues["audioOnlyBackgroundTimeout"];
        const audioOnlyNew = newValues["audioOnly"];
        const audioOnlyOld = oldValues["audioOnly"];

        const backgroundNew = newValues["audioOnlyBackground"];
        const backgroundOld = oldValues["audioOnlyBackground"];

        console.log(
          `ContentScript/settingsListener: aoNew: ${audioOnlyNew}, aoOld: ${audioOnlyOld}, bgNew: ${backgroundNew}, bgOld: ${backgroundOld}`
        );

        // If there were no changes to any of the required prefs
        if (audioOnlyNew == audioOnlyOld && backgroundNew == backgroundOld)
          return;

        // audioOnly takes precedence over the background mode listener
        // the same goes for a category marked audioOnly
        if (audioOnlyNew || categoryAudioOnly) {
          console.log(
            `ContentScript/settingsListener: Removing backgroundModeListener`
          );
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
          // ensure that the play mode is updated
          if (document.visibilityState === "visible") {
            setVideoUrl(originalSrc);
          }

          console.log(
            `ContentScript/settingsListener: Adding backgroundModeListener`
          );
          document.addEventListener("visibilitychange", backgroundModeListener);
        } else if (!backgroundNew) {
          console.log(
            `ContentScript/settingsListener: Removing backgroundModeListener`
          );
          document.removeEventListener(
            "visibilitychange",
            backgroundModeListener
          );

          setVideoUrl(originalSrc);
        } // this condition should run if we disable the features
        else {
          console.log(
            `ContentScript/settingsListener: All audio only features disabled`
          );
          setVideoUrl(originalSrc);
        }
      }
    }
  };

  const audioOnlyListener = (message: { [key: string]: string }) => {
    console.log(`ContentScript/AudioOnlyListener: Message received`);
    console.log(
      `ContentScript/AudioOnlyListener: Message type: ${message["type"]}`
    );
    if (message["type"] == "MSG_BG_TAB_AUDIOURL") {
      console.log(`ContentScript/AudioOnlyListener: Removing listener`);
      chrome.runtime.onMessage.removeListener(audioOnlyListener);

      // store the audio url
      audioSrc = message["url"];
      storeOriginalSrcUrl();

      helpers
        .getPreferences()
        .then(
          (prefs: { [key: string]: { [key: string]: boolean | number } }) => {
            const audioOnly = prefs["features"]["audioOnly"];
            const bgTab = prefs["features"]["audioOnlyBackground"];
            inBgTimeout = prefs["features"][
              "audioOnlyBackgroundTimeout"
            ] as number;

            if (audioOnly) {
              setVideoUrl(audioSrc);
            } else if (bgTab) {
              document.addEventListener(
                "visibilitychange",
                backgroundModeListener
              );
            }
          }
        )
        .finally(() => {
          chrome.storage.local.onChanged.addListener(settingsListener);
        });
    }
  };

  const runOnUrlChange = async () => {
    const observerConfig = {
      childList: true,
      subtree: true,
      attributes: true,
    };

    console.log(`ContentScript/runOnUrlChange: Url change detected`);
    const currentVideoID = location.href.split("v=")[1].split("&")[0];
    const videoScores = await helpers.getVideoScores(currentVideoID);
    const { optimumCategoryId, optimumQuality } =
      await helpers.calcOptimumQuality(videoScores);
    console.log(
      `ContentScript/runOnUrlChange: qualityToSet: ${optimumQuality}`
    );

    categoryId = optimumCategoryId;

    categoryAudioOnly = (await helpers.getPreferences())["categories"][
      optimumCategoryId
    ]["audioOnly"];

    if (categoryAudioOnly) {
      console.log(
        `ContentScript/runOnUrlChange: Category ${optimumCategoryId} is set to audio only`
      );
      storeOriginalSrcUrl();
      setVideoUrl(audioSrc);
      return;
    }

    // perhaps reassign a null varaible "qualityToSet" and check in observer
    new MutationObserver((_, observer) => {
      if (!document.contains(document.querySelector(".ytp-settings-button")))
        return;
      console.log(`ContentScript/runOnUrlChange: YT settings button found`);
      observer.disconnect();

      setTimeout(() => {
        setQuality(optimumQuality);
      }, 100);
    }).observe(document.body, observerConfig);
  };

  const setQuality = (quality: string) => {
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
    qualityButton = document.querySelector(".ytp-menu-label-secondary")
      ?.parentElement;

    console.log(`ContentScript/setQuality: Clicking quality button`);
    qualityButton?.click();

    // TODO Use a find method here
    // get the list of available qualities
    const availableQualities = document.querySelectorAll(
      ".ytp-quality-menu .ytp-menuitem-label"
    ) as NodeListOf<HTMLElement>;

    // this array is usually in descending order
    const parsedQualities = Array.from(availableQualities)
      .map((item) => parseInt(item.innerText))
      .filter((item) => !isNaN(item));

    const parsedToSetQuality = parseInt(quality);
    console.log(`ContentScript/setQuality: Qualities available for video`);
    console.log(parsedQualities);

    // if the chosen quality is not found in the dropdown then select the closest one
    if (!parsedQualities.includes(parsedToSetQuality)) {
      console.log(
        `ContentScript/setQuality: Requested quality not found, using closest quality`
      );

      console.log(`ContentScript/setQuality: Finding greater quality`);
      let intQuality = parsedQualities.findLast(
        (item) => item > parsedToSetQuality
      );

      if (intQuality === undefined) {
        console.log(
          `ContentScript/setQuality: Greater quality not found, finding smaller quality`
        );
        intQuality = parsedQualities.find((item) => item < parsedToSetQuality);
      }

      if (intQuality !== undefined) {
        quality = intQuality.toString();
        console.log(`ContentScript/setQuality: Closest quality is ${quality}`);
      }
    }

    let hasQualityBeenSet = false;
    for (const qualityElement of Array.from(availableQualities)) {
      // check if quality is in innertext ex: "1080p" in "1080p HD"
      if (qualityElement.innerText.includes(quality + "p")) {
        hasQualityBeenSet = true;
        qualityElement.click();
        break;
      }
    }

    // Update the original src when the quality changes
    if (hasQualityBeenSet) {
      console.log(`ContentScript/setQuality: Quality has been set`);
      storeOriginalSrcUrl();
    }

    // if quality has not been set, close settings as it is open
    if (!hasQualityBeenSet) {
      console.log(
        `ContentScript/setQuality: Quality has not been set, closing settings`
      );
      vidSettingsButton.click();
      return;
    }
  };

  document.addEventListener("yt-navigate-finish", () => {
    chrome.runtime.onMessage.removeListener(audioOnlyListener);
    chrome.runtime.onMessage.removeListener(popupMessageListener);
    window.clearInterval(channelExtractorHandle);

    if (location.pathname.includes("/watch")) {
      console.log(
        `ContentScript/NavigationFinishListener: Running watch page listeners`
      );
      channelExtractorHandle = window.setInterval(extractChannelInfo, 500);
      chrome.runtime.onMessage.addListener(popupMessageListener);

      chrome.runtime.onMessage.addListener(audioOnlyListener);
      runOnUrlChange();
    } else if (location.pathname.includes("/@")) {
      console.log(
        `ContentScript/NavigationFinishListener: Running channel page listeners`
      );
      channelExtractorHandle = window.setInterval(extractChannelInfo, 500);
      chrome.runtime.onMessage.addListener(popupMessageListener);
    }
  });

  document.addEventListener("yt-player-updated", () => {
    storeOriginalSrcUrl();
  });
})();
