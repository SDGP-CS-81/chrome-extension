import { getPreferences, setPreferences } from "../helpers.js";
import ToggleButton from "./toggleBtn.js";

class AudioToggle extends ToggleButton {
  async connectedCallback() {
    await super.connectedCallback();

    const preferences = await getPreferences();
    this.checked = preferences.categories[this.toggleID].audioOnly;

    this.addEventListener("click", () => {
      console.log(`AudioToggle: Toggled, new state: ${!this.checked}`);
      this.checked = !this.checked;
    });
  }

  async attributeChangedCallback(name: string) {
    if (name === "checked") {
      const preferences = await getPreferences();
      preferences.categories[this.toggleID].audioOnly = this.checked;
      await setPreferences(preferences);
      const hiddenInput = this.querySelector("input");
      if (hiddenInput) hiddenInput.checked = this.checked;
    }
  }
}

customElements.define("audio-toggle", AudioToggle);
