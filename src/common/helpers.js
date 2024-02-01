import {
  defaultPreferences,
  apiURL,
  defaultCurrentVideoCategory,
} from "./constants.js";
import { getYTVideoCategorisation } from "./htmlParsers.js";

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
  return await fetch(`${apiURL}/api/vid/${videoID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
};

export const calcOptimumQuality = async (videoScores) => {
  let optimumQuality = "144p"; // get default quality
  // if (!videoScores) return optimumQuality;

  const preferences = await getPreferences();

  // doesnt work because same problem as getting description, may have to do serverside
  // if video has yt categorisation, get quality from preferences
  // const ytVideoCategorisation = getYTVideoCategorisation();
  // if (ytVideoCategorisation)
  //   return (optimumQuality = preferences.categories[ytVideoCategorisation]);
  //  - -- - - -to delete---for testing purpose
  let videoScore = {
    categoryScores: {
      coding: 2,
      music: 1,
      podcast: 25,
    },
  };

  const sortedCategoryScores = Object.entries(videoScore.categoryScores).sort(
    (keyPair1, keyPair2) => keyPair2[1] - keyPair1[1]
  );
  const videoCategory = sortedCategoryScores[0][0];
  setCurrentVideoCategory(videoCategory);

  // map user facing categories to underlying categories

  const preferredQuality = preferences.categories[videoCategory];
  // take 2nd/3rd and ratings?
  // use detail and similarity score to alter quality

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

// export function replaceSlots(parent) {
//   const slots = {};
//   parent.querySelectorAll("[slot]").forEach((el) => {
//     // convert 'nick-name' into 'nickName' for easy JS access
//     // set the *DOM node* as data property value
//     slots[
//       el.getAttribute("slot").replace(/-(\w)/g, ($0, $1) => $1.toUpperCase())
//     ] = el; // <- this is a DOM node, not a string ;-)
//     el.removeAttribute("slot"); // <- remove attribute to avoid duplicates
//   });
//   parent.querySelectorAll("slot").forEach((slot) => {
//     slot.replaceWith(slots[slot.name]);
//   });
// }
