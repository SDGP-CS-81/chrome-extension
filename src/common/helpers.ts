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

export const getVideoScores = async (videoID: string): Promise<VideoScores> => {
  const preferences = await getPreferences();
  let categoryKeywords;

  if (preferences.customCategories) {
    console.log(`Helpers/getVideoScores: Preparing keywords`);
    console.log(categoryKeywords);

    categoryKeywords = Object.fromEntries(
      Object.entries(preferences.customCategories).map(([category, obj]) => [
        category,
        obj.keywords,
      ])
    );
  }

  console.log(
    `Helpers/getVideoScores: Preparing to get scores for video: ${videoID}`
  );

  try {
    const response = await fetch(
      `${apiURL}/api/video/${videoID}?categoryKeywords=${
        categoryKeywords
          ? encodeURIComponent(JSON.stringify(categoryKeywords))
          : null
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } catch (error) {
    console.log(`Helpers/getVideoScores: Error fetching video scores`);
    console.log(error);
  }
};

export const calcOptimumQuality = async (
  videoScores: VideoScores,
  channelCategoryId: string | null,
  channelId: string | null
) => {
  console.log(`Helpers/calcOptimumQuality: Calculating optimum video quality`);

  let optimumCategoryId: string;

  if (channelId) {
    console.log(
      `Helpers/calcOptimumQuality: Channel ID given, taking channel into consideration`
    );

    if (channelCategoryId) {
      console.log(
        `Helpers/calcOptimumQuality: Channel category given, skipping category heuristics`
      );

      console.log(
        `Helpers/calcOptimumQuality: Channel category is ${channelCategoryId}`
      );

      optimumCategoryId = channelCategoryId;
    } else {
      console.log(
        `Helpers/calcOptimumQuality: Channel category not given, getting from backend`
      );

      let mostVotedCategory = await getMostVotedCategory(channelId);

      if (mostVotedCategory) {
        console.log(
          `Helpers/calcOptimumQuality: Community category is ${mostVotedCategory}`
        );

        mostVotedCategory = mostVotedCategory.toLowerCase();
      } else {
        console.log(
          `Helpers/calcOptimumQuality: Community category is not available`
        );
        mostVotedCategory = null;
      }

      optimumCategoryId = await selectOptimumCategory(
        videoScores,
        mostVotedCategory
      );
    }
  } else {
    console.log(
      `Helpers/calcOptimumQuality: Channel ID not given, not taking channel into consideration`
    );

    optimumCategoryId = await selectOptimumCategory(videoScores, null);
  }

  const optimumQuality = await selectOptimumQuality(
    optimumCategoryId,
    videoScores
  );
  return { optimumCategoryId, optimumQuality };
};

const selectOptimumCategory = async (
  videoScores: VideoScores,
  channelCategoryId: string | null
): Promise<string> => {
  console.log(
    `Helpers/selectOptimumCategory: Running heuristics to get optimum category`
  );

  let confidentCategoryId = "defaultQuality";

  if (!videoScores) {
    console.log(`Helpers/selectOptimumCategory: Video scores not found`);
    console.log(videoScores);

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

  let categoryConfidence: [string, number][] = Object.entries(categories).map(
    ([key, obj]: [key: string, obj: Category]) => {
      let confidenceScore = 0;
      // check if visual category is present in conditions
      if (obj.selectionConditions.backendCategories.includes(visualCategory)) {
        console.log(
          `Helpers/selectOptimumCategory: Visual condition hit, category: ${key}, visual category: ${visualCategory}`
        );
        confidenceScore++;
      }

      if (channelCategoryId === key) {
        console.log(
          `Helpers/selectOptimumCategory: Channel category hit, category: ${key}, channel category: ${channelCategoryId}`
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

  // get the custom only keyword scores
  console.log(
    `Helpers/selectOptimumCategory: Merging custom and built in category keys`
  );
  const builtInKeys = Object.keys(categories);
  const customCategoryScores = Object.entries(textScores).filter(
    ([category]) => !builtInKeys.includes(category)
  );
  categoryConfidence = [...categoryConfidence, ...customCategoryScores];
  console.log(
    `Helpers/selectOptimumCategory: Custom and built in categories have been merged`
  );
  console.log(categoryConfidence);

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
  const mergedCategories = {
    ...preferences.categories,
    ...preferences.customCategories,
  };

  const minimumQuality = mergedCategories[optimumCategoryId].min;
  const maximumQuality = mergedCategories[optimumCategoryId].max;

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
  const closestIndex = minIndex + Math.round(numLevels * diffScore);
  console.log(
    `Helpers/selectOptimumQuality: Step ${Math.round(
      numLevels * diffScore
    )} chosen`
  );
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
    console.log(`Helpers/postChannelInfo: Error sending channel category info`);
    console.log(error);
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
    console.log(
      `Helpers/getMostVotedCategory: Error getting category from backend`
    );
    console.log(error);
    return null;
  }
};
