import { wifiOff, wifiOn } from "../../svg.js";
import { getPreferences, html, setPreferences } from "../helpers.js";
import ToggleButton from "./toggleBtn.js";

class OfflineToggle extends ToggleButton {
  generateTemplate() {
    const template = document.createElement("template");
    template.innerHTML = html`
      <div
        class="flex cursor-pointer rounded-full border-solid border-grey-mid @[400px]:border-2 @[400px]:p-2.5 "
      >
        <label
          for="offlineBtn"
          class="hidden cursor-pointer pe-3 text-lg sm:block"
        >
          Offline Mode
        </label>
        <div
          class="relative flex cursor-pointer items-center stroke-black dark:stroke-white "
        >
          <input
            type="checkbox"
            id="offlineMode"
            class="peer/toggle sr-only "
          />

          ${wifiOn} ${wifiOff}
        </div>
      </div>
    `;
    return template;
  }

  async connectedCallback() {
    super.connectedCallback();

    const preferences = await getPreferences();
    this.checked =
      preferences.features[this.toggleID as keyof PreferenceFeatures];

    this.addEventListener("click", () => {
      this.checked = !this.checked;
    });
  }

  async attributeChangedCallback(name: string) {
    if (name === "checked") {
      const preferences = await getPreferences();
      preferences.features[this.toggleID as keyof PreferenceFeatures] =
        this.checked;
      await setPreferences(preferences);
      const hiddenInput = this.querySelector("input");
      if (hiddenInput) hiddenInput.checked = this.checked;
    }
  }
}

customElements.define("offline-toggle", OfflineToggle);
