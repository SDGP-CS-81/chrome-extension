import { moon, sun } from "../../svg.js";
import { PreferenceFeatures } from "../constants.js";
import { getPreferences, html, setPreferences, setTheme } from "../helpers.js";
import ToggleButton from "./toggleBtn.js";

class ThemeToggle extends ToggleButton {
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
  async connectedCallback() {
    await super.connectedCallback();

    const preferences = await getPreferences();
    this.checked = preferences.features[
      this.toggleID as keyof PreferenceFeatures
    ] as boolean;

    this.addEventListener("click", () => {
      console.log(
        `ThemeToggle: Theme changed, theme: ${this.checked ? "Dark" : "Light"}`
      );
      this.checked = !this.checked;
    });
  }

  async attributeChangedCallback(name: string) {
    if (name === "checked") {
      const preferences = await getPreferences();
      (preferences.features[
        this.toggleID as keyof PreferenceFeatures
      ] as boolean) = this.checked;
      await setPreferences(preferences);
      const hiddenInput = this.querySelector("input");
      if (hiddenInput) hiddenInput.checked = this.checked;

      setTheme(this.checked);
    }
  }
}

customElements.define("theme-toggle", ThemeToggle);

// set the mode for the page
setTheme(null);
