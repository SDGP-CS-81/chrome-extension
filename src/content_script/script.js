document.addEventListener("yt-navigate-finish", () => {
  runOnUrlChange();
});

const runOnUrlChange = async () => {
  console.log(location.pathname);
  if (location.pathname != "/watch") return;

  // import additional scripts
  globalThis.constants = await import(
    chrome.runtime.getURL("../common/constants.js")
  );
  globalThis.helpers = await import(
    chrome.runtime.getURL("../common/helpers.js")
  );

  // setQuality when video player is loaded
  const videoElement = document.querySelector("video");
  videoElement.addEventListener("canplay", setQualityWhenPossible);

  // get video text info when description updated by yt
  new MutationObserver((_, observer) => {
    if (
      document.querySelector(".yt-core-attributed-string--link-inherit-color")
    ) {
      getVideoTextInfo();
      observer.disconnect();
    }
  }).observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  });
};

const setQualityWhenPossible = () => {
  // if videoQuality not generated yet recursively set eventlistener
  console.log("setQualityWhenPossible");
  setQuality("144p");
};

const setQuality = (quality) => {
  // click the settings button in video player
  const vidSettingsButton = document.querySelectorAll(
    ".ytp-settings-button"
  )[0];
  vidSettingsButton.click();

  // ------uncomment----it works
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
  //   if (globalThis.constants.qualityTitles.includes(btn.innerText)) {
  //     qualityButton = btn;
  //     break;
  //   }
  // }

  // this approach is lesscode-- but wont set quality if already set(it relies on () being around quality when auto)
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

const getVideoTextInfo = () => {
  const videoTitle = getVideoTitle();
  const videoDescription = getVideoDescription();

  // get keyword match scores differently as they may have different levels of importance
  // ex: titles are more important than descriptions
  const titleScores = globalThis.helpers.getKeywordScores(
    videoTitle,
    globalThis.constants.categoryKeywords
  );
  const descriptionScores = globalThis.helpers.getKeywordScores(
    videoDescription,
    globalThis.constants.categoryKeywords
  );
  console.log(titleScores);
  console.log(descriptionScores);
};

// limit to first 20 lines?? full description for keyword search
// but for backend transfer limit, to reduce data waste and unnecessary desc info like sponsor and timelines
const getVideoDescription = () => {
  const descriptionArray = Array.from(
    document.querySelectorAll(".yt-core-attributed-string--link-inherit-color")
  ).map((el) => {
    return globalThis.helpers.preprocessText(el.innerText);
  });
  return descriptionArray.join("\n");
};

const getVideoTitle = () => {
  return globalThis.helpers.preprocessText(
    document.querySelector("h1.style-scope.ytd-watch-metadata").innerText
  );
};

const getChannelID = () => {
  return document
    .querySelector(".yt-simple-endpoint.style-scope.yt-formatted-string")
    .href.split("www.youtube.com/")[1];
};

// will retrive first 3 comments- but user has to go to comments section...so it doesnt work
const getComments = () => {
  return Array.from(document.querySelectorAll("#content-text"))
    .slice(1, 4)
    .map((el) => globalThis.helpers.preprocessText(el.innerText));
};

// currently doesnt work when on video page and reloaded...it wont change quality for that page
// but it works when navigating to subsequent videos
// may be due to oncanplay listener setting after current video player canplay
