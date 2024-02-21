import { wifiOff, wifiOn } from "../../svg.js";
import { html } from "../helpers.js";
import ToggleBtn from "./toggleBtn.js";

class OfflineBtn extends ToggleBtn {
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
}

customElements.define("offline-btn", OfflineBtn);
