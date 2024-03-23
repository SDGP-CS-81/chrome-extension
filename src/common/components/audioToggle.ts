import { getPreferences, html, setPreferences } from "../helpers.js";
import ToggleButton from "./toggleBtn.js";

class AudioToggle extends ToggleButton {
  generateTemplate(toggleID: string) {
    const template = document.createElement("template");
    template.innerHTML = html`
      <div class="flex items-center pr-6 @md/main:pr-0">
        <p
          class="mr-3 text-nowrap font-dmsans text-sm text-grey-low @md/main:hidden"
        >
          Audio Only
        </p>
        <div class="relative flex cursor-pointer items-center ">
          <input
            type="checkbox"
            id="${toggleID}"
            class="peer/toggle sr-only "
          />
          <div
            class="h-6 w-10 rounded-full bg-grey-mid peer-checked/toggle:bg-primary-dark @md/main:h-7 @md/main:w-12"
          ></div>
          <div
            class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-all duration-300 ease-out peer-checked/toggle:translate-x-[82%] @md/main:h-6 @md/main:w-6"
          ></div>
        </div>
      </div>
    `;
    return template;
  }

  async connectedCallback() {
    await super.connectedCallback();

    const preferences = await getPreferences();

    if (preferences.categories[this.toggleID]) {
      this.checked = preferences.categories[this.toggleID].audioOnly;
    } else {
      this.checked = preferences.customCategories[this.toggleID].audioOnly;
    }

    this.addEventListener("click", () => {
      console.log(`AudioToggle: Toggled, new state: ${!this.checked}`);
      this.checked = !this.checked;
    });
  }

  async attributeChangedCallback(name: string) {
    if (name === "checked") {
      const preferences = await getPreferences();

      if (preferences.categories[this.toggleID]) {
        preferences.categories[this.toggleID].audioOnly = this.checked;
      } else {
        preferences.customCategories[this.toggleID].audioOnly = this.checked;
      }

      await setPreferences(preferences);
      const hiddenInput = this.querySelector("input");
      if (hiddenInput) hiddenInput.checked = this.checked;
    }
  }
}

customElements.define("audio-toggle", AudioToggle);

export default AudioToggle;
