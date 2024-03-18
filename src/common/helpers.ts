import {
  defaultPreferences,
  apiURL,
  categories,
  Preferences,
  Category,
  qualities,
} from "./constants.js";

export const setPreferences = async (preferences: Preferences) => {
  console.log(`Helpers/setPreferences: Setting preferences`);
  console.log(preferences);
  await chrome.storage.local.set({ preferences: preferences });
};

export const getPreferences = async () => {
  console.log(`Helpers/getPreferences: Retrieving preferences`);
  const preferences: Preferences = (
    await chrome.storage.local.get({
      preferences: defaultPreferences,
    })
  ).preferences;
  console.log(preferences);
  return preferences;
};

export const setCustomCategories = async (
  customCategories: CustomCategories
) => {
  console.log(`Helpers/setCustomCategories: Setting custom categories`);
  console.log(customCategories);
  await chrome.storage.local.set({ customCategories: customCategories });
};

export const getCustomCategories = async () => {
  console.log(`Helpers/getCustomCategories: Retrieving custom categories`);
  const customCategories: CustomCategories = (
    await chrome.storage.local.get({
      customCategories: {},
    })
  ).customCategories;
  console.log(customCategories);
  return customCategories;
};

export type CustomCategories = {
  [key: string]: {
    min: string;
    max: string;
    audioOnly: boolean;
    keywords: string[];
  };
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

  console.log(
    `Helpers/getVideoScores: Preparing to get scores for video: ${videoID}`
  );
  console.log(`Helpers/getVideoScores: Preparing keywords`);
  console.log(categoryKeywords);

  try {
    const response = await fetch(
      `${apiURL}/api/video/${videoID}?categoryKeywords=${encodeURIComponent(
        JSON.stringify(categoryKeywords)
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.json();
  } catch (error) {
    console.error(`Helpers/getVideoScores: Error fetching video scores`);
    console.error(error);
  }
};

export const calcOptimumQuality = async (videoScores: VideoScores) => {
  console.log(`Helpers/calcOptimumQuality: Calculating optimum video quality`);
  const optimumCategoryId = await selectOptimumCategory(videoScores);

  const optimumQuality = await selectOptimumQuality(
    optimumCategoryId,
    videoScores
  );

  return { optimumCategoryId, optimumQuality };
};

const selectOptimumCategory = async (
  videoScores: VideoScores
): Promise<string> => {
  console.log(
    `Helpers/selectOptimumCategory: Running heuristics to get optimum category`
  );

  let confidentCategoryId = "defaultQuality";

  if (!videoScores) {
    console.error(`Helpers/selectOptimumCategory: Video scores not found`);
    console.error(videoScores);

    console.log(`Helpers/selectOptimumCategory: Returning category`);
    console.log(confidentCategoryId);
    return confidentCategoryId;
  }

  const { imageScores, textScores } = videoScores;

  console.log(`Helpers/selectOptimumCategory: Video scores found`);
  console.log(videoScores);

  console.log(`Helpers/selectOptimumCategory: Sorting visual scores`);
  const sortedCategoryScores = Object.entries(imageScores).sort(
    (keyPair1, keyPair2) => keyPair2[1] - keyPair1[1]
  );

  const visualCategory = sortedCategoryScores[0][0];
  console.log(
    `Helpers/selectOptimumCategory: Visual category selected: ${visualCategory}`
  );
  const textScoresKeys = textScores ? Object.keys(textScores) : [];
  console.log(`Helpers/selectOptimumCategory: Categories with keyword scores`);
  console.log(textScoresKeys);

  console.log(`Helpers/selectOptimumCategory: Calculating category confidence`);

  const categoryConfidence: [string, number][] = Object.entries(categories).map(
    ([key, obj]: [key: string, obj: Category]) => {
      let confidenceScore = 0;
      // check if visual category is present in conditions
      if (obj.selectionConditions.backendCategories.includes(visualCategory)) {
        console.log(
          `Helpers/selectOptimumCategory: Visual condition hit, category: ${key}, visual category: ${visualCategory}`
        );
        confidenceScore++;
      }

      if (textScoresKeys.includes(key)) {
        if (textScores[key] >= obj.selectionConditions.textThreshold) {
          console.log(
            `Helpers/selectOptimumCategory: Keyword threshold condition hit, category: ${key}, keyword score: ${textScores[key]}, threshold: ${obj.selectionConditions.textThreshold}`
          );
          // check if keyword occurences meet threshold
          confidenceScore++;
        }

        // quick hack to use the yt categorization
        if (textScores[key] >= 1000) {
          console.log(
            `Helpers/selectOptimumCategory: YT categorization condition hit, category: ${key}`
          );
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

  console.log(
    `Helpers/selectOptimumCategory: Category with highest confidence, category: ${confidentCategory[0]}`
  );

  // ensure that default category is used if no confidence
  if (confidentCategory[1] > 0) {
    console.log(
      `Helpers/selectOptimumCategory: Sufficient confidence detected`
    );
    // optimumQuality = preferences.categories[confidentCategory[0]];
    confidentCategoryId = confidentCategory[0];
  }

  console.log(
    `Helpers/selectOptimumCategory: Optimum category is ${confidentCategoryId}`
  );
  return confidentCategoryId;
};

const selectOptimumQuality = async (
  optimumCategoryId: string,
  videoScores: VideoScores
): Promise<string> => {
  console.log(
    `Helpers/selectOptimumQuality: Running heuristics to get optimum quality`
  );
  const preferences = await getPreferences();
  const minimumQuality = preferences.categories[optimumCategoryId].min;
  const maximumQuality = preferences.categories[optimumCategoryId].max;

  console.log(
    `Helpers/selectOptimumQuality: Checking preferred quality, min: ${minimumQuality}, max: ${maximumQuality}`
  );

  // default quality does not have a min/max, only a single value that is represented by max
  if (optimumCategoryId === "defaultQuality") {
    console.log(
      `Helpers/selectOptimumQuality: Default quality chosen, quality: ${maximumQuality}`
    );
    return maximumQuality;
  }

  if (minimumQuality === maximumQuality) {
    console.log(
      `Helpers/selectOptimumQuality: Min/Max is the same, quality: ${minimumQuality}`
    );
    return minimumQuality;
  }

  const { diffScore } = videoScores.frameScores;
  console.log(
    `Helpers/selectOptimumQuality: Using difference score to determine quality level, diffScore: ${diffScore}`
  );

  const minIndex = qualities.findIndex(
    (quality) => quality === parseInt(minimumQuality)
  );
  const maxIndex = qualities.findIndex(
    (quality) => quality === parseInt(maximumQuality)
  );

  const numLevels = maxIndex - minIndex + 1;
  console.log(`Helpers/selectOptimumQuality: ${numLevels} quality steps found`);
  const closestIndex = numLevels + Math.round(diffScore * numLevels);
  console.log(`Helpers/selectOptimumQuality: Step ${closestIndex} chosen`);
  const chosenQuality = qualities[closestIndex].toString();
  console.log(
    `Helpers/selectOptimumQuality: Quality chosen, quality: ${chosenQuality}`
  );
  return chosenQuality;
};

export const setTheme = async (theme: boolean | null) => {
  // To avoid async call if theme is known already
  const themeToSet =
    theme != null ? theme : (await getPreferences())?.features.theme;

  console.log(`Helpers/setTheme: Theme: ${themeToSet ? "Dark" : "Light"}`);
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

export const postChannelInfo = async (channelId: string, category: string) => {
  try {
    console.log(
      `Helpers/postChannelInfo: Sending channel category to backend, channelId: ${channelId}, category: ${category}`
    );
    const response = await fetch(
      `${apiURL}/api/channel/vote-category/${channelId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ channelId, category }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error(
      `Helpers/postChannelInfo: Error sending channel category info`
    );
    console.error(error);
  }
};

export const getMostVotedCategory = async (channelId: string) => {
  try {
    console.log(
      `Helpers/getMostVotedCategory: Getting channel category, channelId: ${channelId}`
    );
    const response = await fetch(
      `${apiURL}/api/channel/vote-category/${channelId}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log(`Helpers/getMostVotedCategory: Data successfully retrieved`);
    console.log(data);

    return data.mostVotedCategory;
  } catch (error) {
    console.error(
      `Helpers/getMostVotedCategory: Error getting category from backend`
    );
    console.error(error);
    return null;
  }
};
