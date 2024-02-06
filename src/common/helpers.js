import {
  defaultPreferences,
  apiURL,
  defaultCurrentVideoCategory,
  categories,
} from "./constants.js";

export const setPreferences = async (preferences) => {
  await chrome.storage.local.set({ preferences: preferences });
};

export const getPreferences = async () => {
  const obj = await chrome.storage.local.get({
    preferences: defaultPreferences,
  });
  return obj.preferences;
};

export const html = (staticText, ...values) => {
  return staticText.reduce((acc, text, index) => {
    return acc + text + (values[index] ?? "");
  }, "");
};

export const preprocessText = (text) => {
  return text
    .trim()
    .replace(/(?:https?|ftp):\/\/[\n\S]+/g, "") // remove url's
    .replace(/[^a-zA-Z0-9]/g, " ") // replace all non-alphabets with whitespace
    .replace(/\s+/g, " ") // replace all consecutive whitespace with a single whitespace
    .toLowerCase();
};

export const getKeywordScores = (textToSearch, categoryKeywords) => {
  const keywordScores = {};

  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    const matchedScores = keywords.map(
      (keyword) =>
        (textToSearch.match(new RegExp(`\\s${keyword}\\s`, "g")) || []).length
    );
    const numKeywordsMatched = matchedScores.filter(
      (matchCount) => matchCount > 0
    ).length;
    keywordScores[category] = numKeywordsMatched;
  });

  return keywordScores;
};

export const keywordSearch = (videotextInfo, keywords) => {
  return keywords.map(
    (keyword) =>
      (videotextInfo.match(new RegExp(`\\s${keyword}\\s`, "g")) || []).length
  );
};

export const getVideoScores = async (videoID) => {
  const categoryKeywords = Object.fromEntries(
    Object.entries(categories).map(([category, obj]) => [
      category,
      obj.keywords,
    ])
  );
  return await fetch(
    `${apiURL}/api/vid/${videoID}?categoryKeywords=${encodeURIComponent(
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

export const calcOptimumQuality = async (videoScores) => {
  const preferences = await getPreferences();
  let optimumQuality = preferences.categories.defaultQuality;

  if (!videoScores) return optimumQuality;

  const sortedCategoryScores = Object.entries(videoScores.categoryScores).sort(
    (keyPair1, keyPair2) => keyPair2[1] - keyPair1[1]
  );
  const mostLikelyvideoCategory = sortedCategoryScores[0][0];
  setCurrentVideoCategory(mostLikelyvideoCategory);

  // map user facing categories to underlying categories

  const preferredQuality = preferences.categories[mostLikelyvideoCategory];
  // take 2nd/3rd and ratings?

  // use detail and similarity score to alter quality

  // keyword scores
  const sortedKeywordScores = Object.entries(videoScores.keywordScores).sort(
    (keyPair1, keyPair2) => keyPair2[1] - keyPair1[1]
  );

  optimumQuality = preferredQuality;
  return optimumQuality;
};

export const setCurrentVideoCategory = async (currentVideoCategory) => {
  await chrome.storage.local.set({
    currentVideoCategory: currentVideoCategory,
  });
};

export const getCurrentVideoCategory = async () => {
  const obj = await chrome.storage.local.get({
    currentVideoCategory: defaultCurrentVideoCategory,
  });
  return obj.currentVideoCategory;
};
