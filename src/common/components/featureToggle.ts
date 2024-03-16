import { PreferenceFeatures } from "../constants.js";
import { getPreferences, setPreferences } from "../helpers.js";
import ToggleButton from "./toggleBtn.js";

class FeatureToggle extends ToggleButton {
  async connectedCallback() {
    await super.connectedCallback();

    const preferences = await getPreferences();
    this.checked = preferences.features[
      this.toggleID as keyof PreferenceFeatures
    ] as boolean;

    this.addEventListener("click", () => {
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
    }
  }
}

customElements.define("feature-toggle", FeatureToggle);
