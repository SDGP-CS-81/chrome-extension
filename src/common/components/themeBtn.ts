import { moon, sun } from "../../svg.js";
import { PreferenceFeatures } from "../constants.js";
import { getPreferences, html, setPreferences, setTheme } from "../helpers.js";
import ToggleBtn from "./toggleBtn.js";

class ThemeBtn extends ToggleBtn {
  generateTemplate() {
    const template = document.createElement("template");
    template.innerHTML = html`
      <div class="relative flex cursor-pointer items-center">
        <input type="checkbox" id="offlineMode" class="peer/toggle sr-only " />
        ${moon} ${sun}
      </div>
    `;
    return template;
  }

  attributeChangedCallback(name: string) {
    if (name === "checked") {
      getPreferences().then(async (preferences) => {
        preferences.features[this.toggleID as keyof PreferenceFeatures] =
          this.checked;
        await setPreferences(preferences);
        const hiddenInput = this.querySelector("input");
        if (hiddenInput) hiddenInput.checked = this.checked;

        setTheme(this.checked);
      });
    }
  }
}

customElements.define("theme-btn", ThemeBtn);

// set the mode for the page
setTheme(null);
