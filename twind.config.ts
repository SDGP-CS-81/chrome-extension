import { defineConfig } from "@twind/core";
import presetTailwind from "@twind/preset-tailwind";
import presetAutoprefix from "@twind/preset-autoprefix";
import presetContainerQueries from "@twind/preset-container-queries";

export default defineConfig({
  presets: [presetAutoprefix(), presetTailwind(), presetContainerQueries()],
  darkMode: ["class", '[data-mode="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: { dark: "#1F8505", light: "#1F8505" },
        secondary: { dark: "#121212", light: "#FBFBFD" },
        grey: { high: "#3B3D3B", mid: "#6F6F76", low: "#AAAAAA" }
      },
      fontFamily: {
        dmsans: ["DMSans"],
        azeretmono: ["AzeretMono"]
      }
    }
  }
});
