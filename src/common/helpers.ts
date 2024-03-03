import {
  defaultPreferences,
  apiURL,
  categories,
  Preferences,
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
  // simple object to map confidence scores
  const categoryConfidence = Object.fromEntries(
    Object.entries(categories).map(([key, _obj]) => [key, 0])
  );

  const preferences = await getPreferences();
  let optimumQuality = preferences.categories.defaultQuality;
  await setCurrentVideoCategory("defaultQuality");

  if (!videoScores) return optimumQuality;

  const sortedCategoryScores = Object.entries(videoScores.categoryScores).sort(
    (keyPair1, keyPair2) => keyPair2[1] - keyPair1[1]
  );

  const visualCategory = sortedCategoryScores[0][0];
  const { detailScore, diffScore } = videoScores.frameScores;
  const keywordScores = videoScores.keywordScores;
  const keywordScoresKeys = keywordScores ? Object.keys(keywordScores) : [];
  console.log(`keyscorekeys: ${keywordScoresKeys}`);

  Object.entries(categories).forEach(([key, obj]) => {
    // check if visual category is present in conditions
    if (obj.selectionConditions.backendCategories.includes(visualCategory)) {
      console.log(`${key} Visual Hit`);
      categoryConfidence[key]++;
    }

    if (keywordScoresKeys.includes(key)) {
      if (keywordScores[key] >= obj.selectionConditions.keywordThreshold) {
        // check if keyword occurences meet threshold
        console.log(`${key} Keyword Hit`);
        categoryConfidence[key]++;
      }

      // quick hack to use the yt categorization
      if (keywordScores[key] >= 1000) {
        console.log(`${key} YT Categorization Hit`);
        categoryConfidence[key] += 100;
      }
    }

    if (categoryConfidence[key] > 0) {
      // check if analysis scores meet conditions
      if (obj.selectionConditions.analysisScores(detailScore, diffScore)) {
        console.log(`${key} Analysis Hit`);
        categoryConfidence[key]++;
      }
    }
  });

  // select category with highest confidence
  const confidentCategory = Object.entries(categoryConfidence).sort(
    (keyPair1, keyPair2) => keyPair2[1] - keyPair1[1]
  )[0];

  // ensure that default category is used if no confidence
  if (confidentCategory[1] > 0) {
    optimumQuality = preferences.categories[confidentCategory[0]];
    setCurrentVideoCategory(confidentCategory[0]);
  }

  console.log(categoryConfidence);

  return optimumQuality;
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
  categoryScores: { [key: string]: number };
  frameScores: { [key: string]: number };
  keywordScores: { [key: string]: number };
};
