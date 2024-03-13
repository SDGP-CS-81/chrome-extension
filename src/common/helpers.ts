import {
  defaultPreferences,
  apiURL,
  categories,
  Preferences,
  Category,
  qualities,
} from "./constants.js";

export const setPreferences = async (preferences: Preferences) => {
  await chrome.storage.local.set({ preferences: preferences });
};

export const getPreferences = async () => {
  const preferences: Preferences = (
    await chrome.storage.local.get({
      preferences: defaultPreferences,
    })
  ).preferences;
  return preferences;
};

export const setCustomCategories = async (
  customCategories: CustomCategories
) => {
  await chrome.storage.local.set({ customCategories: customCategories });
};

export const getCustomCategories = async () => {
  const customCategories: CustomCategories = (
    await chrome.storage.local.get({
      customCategories: {},
    })
  ).customCategories;
  return customCategories;
};

export type CustomCategories = {
  [key: string]: string[];
};

// doesn't really do anything
// a hack to get prettier-plugin-tailwindcss to work
// it's plugin bug
export const html = (staticText: TemplateStringsArray, ...values: string[]) => {
  return staticText.reduce((acc: string, text: string, index: number) => {
    return acc + text + (values[index] ?? "");
  }, "");
};

export const preprocessText = (text: string) => {
  return text
    .trim()
    .replace(/(?:https?|ftp):\/\/[\n\S]+/g, "") // remove url's
    .replace(/[^a-zA-Z0-9]/g, " ") // replace all non-alphabets with whitespace
    .replace(/\s+/g, " ") // replace all consecutive whitespace with a single whitespace
    .toLowerCase();
};

export const getKeywordScores = (
  textToSearch: string,
  categoryKeywords: { [key: string]: string[] }
) => {
  const keywordScores: { [key: string]: number } = {};

  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    const matchedScores = keywords.map(
      (keyword) =>
        (textToSearch.match(new RegExp(`\\W${keyword}\\W`, "g")) || []).length
    );

    const numKeywordsMatched = matchedScores.filter(
      (matchCount) => matchCount > 0
    ).length;

    keywordScores[category] = numKeywordsMatched;
  });

  return keywordScores;
};

export const getVideoScores = async (videoID: string) => {
  const customCategories = await getCustomCategories();
  const categoryKeywords = Object.fromEntries(
    Object.entries(customCategories).map(([category, obj]) => [category, obj])
  );

  return await fetch(
    `${apiURL}/api/video/${videoID}?categoryKeywords=${encodeURIComponent(
      JSON.stringify(categoryKeywords)
    )}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export const calcOptimumQuality = async (videoScores: VideoScores) => {
  const optimumCategoryId = await selectOptimumCategory(videoScores);
  console.log(optimumCategoryId);

  const optimumQuality = await selectOptimumQuality(
    optimumCategoryId,
    videoScores
  );
  return optimumQuality;
};

export const selectOptimumCategory = async (
  videoScores: VideoScores
): Promise<string> => {
  let confidentCategoryId = "defaultQuality";
  await setCurrentVideoCategory(confidentCategoryId);

  if (!videoScores) return confidentCategoryId;

  const { imageScores, textScores } = videoScores;

  const sortedCategoryScores = Object.entries(imageScores).sort(
    (keyPair1, keyPair2) => keyPair2[1] - keyPair1[1]
  );

  const visualCategory = sortedCategoryScores[0][0];
  const textScoresKeys = textScores ? Object.keys(textScores) : [];
  console.log(`keyscorekeys: ${textScoresKeys}`);

  const categoryConfidence: [string, number][] = Object.entries(categories).map(
    ([key, obj]: [key: string, obj: Category]) => {
      let confidenceScore = 0;
      // check if visual category is present in conditions
      if (obj.selectionConditions.backendCategories.includes(visualCategory)) {
        console.log(`${key} Visual Hit`);
        confidenceScore++;
      }

      if (textScoresKeys.includes(key)) {
        if (textScores[key] >= obj.selectionConditions.textThreshold) {
          // check if keyword occurences meet threshold
          console.log(`${key} Keyword Hit`);
          confidenceScore++;
        }

        // quick hack to use the yt categorization
        if (textScores[key] >= 1000) {
          console.log(`${key} YT Categorization Hit`);
          confidenceScore += 100;
        }
      }
      return [key, confidenceScore];
    }
  );

  // select category with highest confidence
  const confidentCategory = categoryConfidence.sort(
    (keyPair1, keyPair2) => keyPair2[1] - keyPair1[1]
  )[0];

  // ensure that default category is used if no confidence
  if (confidentCategory[1] > 0) {
    // optimumQuality = preferences.categories[confidentCategory[0]];
    confidentCategoryId = confidentCategory[0];
    setCurrentVideoCategory(confidentCategoryId);
  }
  return confidentCategoryId;
};

const selectOptimumQuality = async (
  optimumCategoryId: string,
  videoScores: VideoScores
): Promise<string> => {
  const preferences = await getPreferences();
  const minimumQuality = preferences.categories[optimumCategoryId].min;
  const maximumQuality = preferences.categories[optimumCategoryId].max;

  // default quality does not have a min/max, only a single value that is represented by max
  if (optimumCategoryId === "defaultQuality") return maximumQuality;

  if (minimumQuality === maximumQuality) return minimumQuality;

  const { diffScore } = videoScores.frameScores;

  const minIndex = qualities.find(
    (quality) => quality === parseInt(minimumQuality)
  );
  const maxIndex = qualities.find(
    (quality) => quality === parseInt(maximumQuality)
  );

  const numLevels = maxIndex - minIndex + 1;
  const closestIndex = numLevels + Math.round(diffScore * numLevels);
  return qualities[closestIndex].toString();
};

export const setCurrentVideoCategory = async (currentVideoCategory: string) => {
  await chrome.storage.local.set({
    currentVideoCategory: currentVideoCategory,
  });
};

export const getCurrentVideoCategory = async () => {
  const obj = await chrome.storage.local.get({
    currentVideoCategory: Object.keys(categories).pop(),
  });
  return obj.currentVideoCategory;
};

export const setTheme = async (theme: boolean | null) => {
  // To avoid async call if theme is known already
  const themeToSet =
    theme != null ? theme : (await getPreferences())?.features.theme;
  if (themeToSet) document.documentElement.setAttribute("data-mode", "dark");
  if (!themeToSet) document.documentElement.setAttribute("data-mode", "light");
};

export type VideoScores = {
  imageScores: ImageScores;
  frameScores: FrameScores;
  textScores: TextScores;
};

export type ImageScores = {
  graphics: number;
  lowLight: number;
  nature: number;
  person: number;
  sports: number;
  textHeavy: number;
  news: number;
};
export type FrameScores = { [key: string]: number };
export type TextScores = { [key: string]: number };

export const getChannelId = async () => {
  try {
    // when on channel page
    if(document.location.href.includes("@")) {
      const channelIdElement = document.querySelector(".ytd-channel-name");
  
      return channelIdElement ? channelIdElement.textContent.trim() : null;
      // when on a video
    } else if(document.location.href.includes("watch")) {

      const ytFormatStringElement = document.querySelector("#channel-name");

      if(ytFormatStringElement) {
        const aTagElement = ytFormatStringElement.querySelector("a");

        const hrefValue = aTagElement.getAttribute("href");
        // split and get the last part of the URL
        const parts = hrefValue.split('/');
        const channelId = parts[parts.length - 1];
        console.log("channel id", channelId);

        return channelId;
      }
    }
  } catch (error) {
    console.error('Error retrieving channel id:', error);
    return null;
  }
};

export const postChannelInfo = async (channelId: string, category: string) => {
  try {
    const response = await fetch(`${apiURL}/api/channel/vote-category`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ channelId, category }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Data sent successfully:', data);
    
  } catch (error) {
    console.error('Error sending data to backend:', error);
  }
}