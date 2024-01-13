import { defaultPreferences, backendUrl } from "./constants.js";

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
      (longString.match(new RegExp(`\\s${keyword}\\s`, "g")) || []).length
  );
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

export const getVideoScores = async (videoID) => {
  const vidScores = await fetch(`${backendUrl}/api/vid/${videoID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  return vidScores;
};
