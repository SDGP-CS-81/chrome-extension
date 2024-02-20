import { moon, sun } from "../../svg.js";
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

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "checked") {
      getPreferences().then(async (preferences) => {
        preferences[this.toggleID] = this.checked;
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
setTheme();
