(async () => {
  // import additional scripts
  const helpers = await import(chrome.runtime.getURL("../common/helpers.js"));

  // a variable to track the original video
  // blob url and the audio url
  let originalSrc: string = null;
  let audioSrc: string = null;
  let inBgTimeout: number = null;
  let inBgListenerHandle: number = null;
  let outBgListenerHandler: number = null;
  let categoryAudioOnly: boolean = false;

  const outBgTimeout: number = 5;

  // receive message from popup
  chrome.runtime.onMessage.addListener(function (message) {
    if (message.url.includes("https://www.youtube.com/")) {
      const channelHeader = document.querySelector("#channel-header-container");

      if (channelHeader) {
        const channelId = helpers.getChannelId();

        const channelName = document.querySelector("#text").textContent;
        console.log(channelName);

        // send channel name to background script
        if (channelName) {
          chrome.runtime.sendMessage({
            from: "channel-name",
            channelName: channelName,
          });
        }
      }
    }
  });

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
      const pauseState = videoElement.paused;

      if (url === videoElement.src) return;

      videoElement.pause();
      videoElement.src = url;
      videoElement.load();
      videoElement.currentTime = 0;

      // use a timeout to allow the pause op to complete
      setTimeout(() => {
        videoElement.currentTime = currentTime;
        videoElement.play();

        // use a timeout to allow the play op to complete
        setTimeout(() => {
          if (pauseState) videoElement.pause();
        }, 200);
      }, 200);
    }
  };

  const backgroundModeListener = () => {
    if (document.visibilityState === "hidden") {
      window.clearTimeout(outBgListenerHandler);

      inBgListenerHandle = window.setTimeout(() => {
        setVideoUrl(audioSrc);
      }, inBgTimeout * 1000);
    } else if (document.visibilityState === "visible") {
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
    const preferences = changes["preferences"];

    if (preferences != undefined) {
      const newValues = preferences.newValue["features"];
      const oldValues = preferences.oldValue["features"];

      if (newValues && oldValues) {
        // Update the timeout whenever it's changed
        inBgTimeout = newValues["audioOnlyBackgroundTimeout"];
        const audioOnlyNew = newValues["audioOnly"];
        const audioOnlyOld = oldValues["audioOnly"];

        const backgroundNew = newValues["audioOnlyBackground"];
        const backgroundOld = oldValues["audioOnlyBackground"];

        console.log(
          `audioOnlyOld: ${audioOnlyOld}, audioOnlyNew: ${audioOnlyNew}, bgOld: ${backgroundOld}, bgNew: ${backgroundNew}`
        );

        // If there were no changes to any of the required prefs
        if (audioOnlyNew == audioOnlyOld && backgroundNew == backgroundOld)
          return;

        // audioOnly takes precedence over the background mode listener
        // the same goes for a category marked audioOnly
        if (audioOnlyNew || categoryAudioOnly) {
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

          document.addEventListener("visibilitychange", backgroundModeListener);
        } else if (!backgroundNew) {
          document.removeEventListener(
            "visibilitychange",
            backgroundModeListener
          );

          setVideoUrl(originalSrc);
        } // this condition should run if we disable the features
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
      .then((prefs: { [key: string]: { [key: string]: boolean | number } }) => {
        console.log(prefs);

        const audioOnly = prefs["features"]["audioOnly"];
        const bgTab = prefs["features"]["audioOnlyBackground"];
        inBgTimeout = prefs["features"]["audioOnlyBackgroundTimeout"] as number;

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

  // channel based category
  const createDropdown = () => {
    const channelId = helpers.getChannelId();

    if (channelId) {
      const header = document.getElementById("channel-header-container");

      if (header) {
        const dropdownContainer = document.createElement("div");

        dropdownContainer.innerHTML = `
                <select id="categoryDropdown">
                    <option value="music">Music</option>
                    <option value="podcast">Podcast</option>
                    <option value="gaming">Gaming</option>
                </select>
                <button id="submitButton">Submit</button>
            `;

        header.appendChild(dropdownContainer);

        const submitButton = document.getElementById("submitButton");

        if (submitButton) {
          submitButton.addEventListener("click", () => {
            const selectedCategory = (
              document.getElementById("categoryDropdown") as HTMLSelectElement
            ).value;

            channelId.then((result: string) => {
              helpers.getChannelInfo(result, selectedCategory);
              console.log("Category submitted:", result, "-", selectedCategory);
            });
          });
        }
      }
    }
  };

  // check if the channel header element is available
  function checkForChannelHeader() {
    const channelHeader = document.getElementById("channel-header-container");
    if (channelHeader) {
      createDropdown();
    } else {
      // if not found, try again after a delay
      setTimeout(checkForChannelHeader, 1000); // check again after 1 second
    }
  }

  // start checking for the channel header element
  checkForChannelHeader();

  const runOnUrlChange = async () => {
    const observerConfig = {
      childList: true,
      subtree: true,
      attributes: true,
    };

    const currentVideoID = location.href.split("v=")[1].split("&")[0];
    const videoScores = await helpers.getVideoScores(currentVideoID);
    const qualityToSet = await helpers.calcOptimumQuality(videoScores);

    // try to find a way to avoid doing this again
    // it's already called in the calcOptimumQuality
    // function
    const selectedCategory = await helpers.selectOptimumCategory(videoScores);
    categoryAudioOnly = (await helpers.getPreferences())["categories"][
      selectedCategory
    ]["audioOnly"];

    if (categoryAudioOnly) setVideoUrl(audioSrc);

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

    // TODO Use a find method here
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

    // Update the original src when the quality changes
    if (hasQualityBeenSet) storeOriginalSrcUrl();

    // if quality has not been set, close settings as it is open
    if (!hasQualityBeenSet) return vidSettingsButton.click();
  };

  document.addEventListener("yt-navigate-finish", () => {
    if (location.pathname != "/watch") return;
    chrome.runtime.onMessage.addListener(audioOnlyListener);
    runOnUrlChange();
  });

  document.addEventListener("yt-player-updated", () => {
    storeOriginalSrcUrl();
  });
})();
