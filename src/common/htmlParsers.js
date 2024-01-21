// gets the category type at the bottom of description ex: music, gaming
// returns undefined if not found
export const getYTVideoCategorisation = () => {
  const potentialCategories = Array.from(
    document.querySelectorAll(
      "yt-formatted-string#title.ytd-rich-list-header-renderer"
    )
  ).map((el) => el.innerText.toLowerCase());
  const ytCategories = ["music", "gaming", "sports"]; // replace with categoryKeywords.keys
  return potentialCategories.find((category) =>
    ytCategories.includes(category)
  );
};

// limit to first 20 lines?? full description for keyword search
// but for backend transfer limit, to reduce data waste and unnecessary desc info like sponsor and timelines
export const getVideoDescription = () => {
  const descriptionArray = Array.from(
    document.querySelectorAll(".yt-core-attributed-string--link-inherit-color")
  ).map((el) => {
    return window.helpers.preprocessText(el.innerText);
  });
  console.log(descriptionArray);
  return descriptionArray.join("\n");
};

export const getVideoTitle = () => {
  return window.helpers.preprocessText(
    document.querySelector("h1.style-scope.ytd-watch-metadata").innerText
  );
};

export const getChannelID = () => {
  return document
    .querySelector(".yt-simple-endpoint.style-scope.yt-formatted-string")
    .href.split("www.youtube.com/")[1];
};

// will retrive first 3 comments- but user has to go to comments section...so it doesnt work
export const getComments = () => {
  return Array.from(document.querySelectorAll("#content-text"))
    .slice(1, 4)
    .map((el) => window.helpers.preprocessText(el.innerText));
};
