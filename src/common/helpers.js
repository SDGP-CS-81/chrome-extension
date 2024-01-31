import { defaultPreferences, apiURL, currentCategory } from "./constants.js";
import { getYTVideoCategorisation } from "./htmlParsers.js";

export const setPreferences = async (preferences) => {  
  await chrome.storage.local.set({ preferences: preferences });
};

export const getPreferences = async () => {
  const preferences = await chrome.storage.local.get({
    preferences: defaultPreferences,
  });
  return preferences;
};

export const html = (staticText, ...values) => {
  const fullText = staticText.reduce((acc, text, index) => {
    return acc + text + (values[index] ?? "");
  }, "");

  return fullText;
};

export const preprocessText = (text) => {
  // remove all characters that are not alphanumeric
  let preprocessedText = text
    .trim()
    .replace(/[^a-zA-Z0-9]/g, " ")
    .toLowerCase();
  return preprocessedText;
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
  const vidScores = await fetch(`${apiURL}/api/vid/${videoID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));

  return vidScores;
};

export const calcOptimumQuality = async (videoScores) => {
  let optimumQuality = "144p"; // get default quality
  if (!videoScores) return optimumQuality;

  const preferences = await getPreferences();

  // doesnt work because same problem as getting description, may have to do serverside
  // if video has yt categorisation, get quality from preferences
  // const ytVideoCategorisation = getYTVideoCategorisation();
  // if (ytVideoCategorisation)
  //   return (optimumQuality = preferences.categories[ytVideoCategorisation]);

  return optimumQuality;
};

export const getCurrentVideoCategory = async () => {
  const currentVideoCategory = await chrome.storage.local.get({
    currentVideoCategory: currentCategory,
  });
  return currentVideoCategory;
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
