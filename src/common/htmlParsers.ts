import * as helpers from "./helpers.js";

// gets the category type at the bottom of description ex: music, gaming
// returns undefined if not found
export const getYTVideoCategorisation = () => {
  const potentialCategories = Array.from(
    document.querySelectorAll(
      "yt-formatted-string#title.ytd-rich-list-header-renderer"
    )
  ).map((el: HTMLElement) => el.innerText.toLowerCase());
  const ytCategories = ["music", "gaming", "sports"]; // replace with categoryKeywords.keys
  return potentialCategories.find((category) =>
    ytCategories.includes(category)
  );
};

// limit to first 20 lines?? full description for keyword search
// but for backend transfer limit, to reduce data waste and unnecessary desc info like sponsor and timelines
export const getVideoDescription = () => {
  const description = Array.from(
    document.querySelectorAll(".yt-core-attributed-string--link-inherit-color")
  )
    .map((el: HTMLElement) => el.innerText)
    .join(" ");

  return helpers.preprocessText(description);
};

export const getVideoTitle = () => {
  return helpers.preprocessText(
    (document.querySelector("h1.style-scope.ytd-watch-metadata") as HTMLElement)
      .innerText
  );
};

export const getChannelIDAndNameVideoPage = () => {
  console.log(`HTMLParsers/getChannelIDAndNameVideoPage: Parsing web info`);
  const channelLink = document.querySelector(
    "#upload-info .yt-simple-endpoint.style-scope.yt-formatted-string"
  ) as HTMLAnchorElement;

  const channelId = channelLink.href.split("www.youtube.com/")[1].toLowerCase();
  const channelName = channelLink.textContent;
  console.log(
    `HTMLParsers/getChannelIDAndNameVideoPage: Retrieved, channelId: ${channelId}, channelName: {channelName}`
  );

  return {
    channelId,
    channelName,
  };
};

export const getChannelIDAndNameChannelPage = () => {
  console.log(`HTMLParsers/getChannelIDAndNameChannelPage: Parsing web info`);
  const channelId =
    "@" + document.location.href.split("@")[1].split("/")[0].toLowerCase();
  const channelName = document.querySelector(
    "#channel-header-container #text"
  ).textContent;
  console.log(
    `HTMLParsers/getChannelIDAndNameChannelPage: Retrieved, channelId: ${channelId}, channelName: ${channelName}`
  );

  return {
    channelId,
    channelName,
  };
};

// will retrive first 3 comments- but user has to go to comments section...so it doesnt work
export const getComments = () => {
  return Array.from(document.querySelectorAll("#content-text"))
    .slice(1, 4)
    .map((el: HTMLElement) => helpers.preprocessText(el.innerText));
};
