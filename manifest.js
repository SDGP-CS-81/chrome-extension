import fs from "node:fs";
const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"));

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = {
  manifest_version: 3,
  default_locale: "en",
  /**
   * if you want to support multiple languages, you can use the following reference
   * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization
   */
  name: "ByteSense",
  version: packageJson.version,
  description: "Save data by dynamically adjusting video quality",
  permissions: ["storage", "tabs", "webRequest"],
  // side_panel: {
  //   default_path: 'src/pages/sidepanel/index.html',
  // },
  options_page: "src/pages/options/index.html",
  background: {
    service_worker: "src/pages/background/index.js",
    type: "module"
  },
  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: "bytesense_logo_dark.png"
  },
  icons: {
    16: "bytesense_logo_dark.png",
    32: "bytesense_logo_dark.png",
    48: "bytesense_logo_dark.png",
    128: "bytesense_logo_dark.png"
  },
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*", "<all_urls>"],
      js: ["src/pages/contentInjected/index.js"],
      // KEY for cache invalidation
      css: ["assets/css/contentStyle<KEY>.chunk.css"]
    },
    {
      matches: ["*://*.youtube.com/*"],
      js: ["src/pages/contentUI/index.js"]
    }
  ],
  // devtools_page: 'src/pages/devtools/index.html',
  web_accessible_resources: [
    {
      resources: [
        "assets/js/*.js",
        "assets/css/*.css",
        "bytesense_logo_dark.png",
        "logo.png"
      ],
      // matches: ['*://*/*'],
      matches: ["*://*.youtube.com/*"]
    }
  ],
  host_permissions: ["*://*.youtube.com/*", "*://*.googlevideo.com/*"]
};

export default manifest;
