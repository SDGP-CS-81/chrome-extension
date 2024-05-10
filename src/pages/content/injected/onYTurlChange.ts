import refreshOnUpdate from "virtual:reload-on-update-in-view";
import featurePreferenceStorage from "@root/src/shared/storages/featurePreferenceStorage";
import categoryPreferenceStorage from "@root/src/shared/storages/categoryPreferenceStorage";
import setQuality from "@src/pages/content/injected/setQuality";
import { VideoScores } from "@root/src/shared/constants/constants";
import { calcOptimumQuality } from "./calcOptimumQuality";
import { api } from "@root/src/shared/utils/api";

refreshOnUpdate("pages/content/injected/onYTurlChange");

export async function runOnUrlChange() {
  console.log(`ContentScript/runOnUrlChange: Url change detected`);

  const currentVideoID = location.href.split("v=")[1].split("&")[0];

  const featurePreference = await featurePreferenceStorage.get();
  const categoryPreference = await categoryPreferenceStorage.get();

  if (featurePreference.offlineMode) {
    console.log(`Offline mode is on, video information is not fetched`);
    return;
  }

  console.log(`Fetching video scores for video: ${currentVideoID}`);
  let videoScores: VideoScores;
  try {
    const response = await api.get<VideoScores>(`/video/${currentVideoID}`);
    videoScores = response.data;
  } catch (error) {
    console.log(`Error fetching video scores`);
  }
  const optimumSettings = await calcOptimumQuality(
    videoScores,
    categoryPreference
  );
  const optimumQuality = optimumSettings.optimumQuality;

  const observerConfig = {
    childList: true,
    subtree: true,
    attributes: true
  };

  // perhaps reassign a null varaible "qualityToSet" and check in observer
  new MutationObserver((_, observer) => {
    if (!document.contains(document.querySelector(".ytp-settings-button")))
      return;
    console.log(`YT settings button found`);
    observer.disconnect();

    setTimeout(() => {
      setQuality(optimumQuality);
    }, 100);
  }).observe(document.body, observerConfig);
}
