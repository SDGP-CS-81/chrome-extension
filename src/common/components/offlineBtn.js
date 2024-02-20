import { wifiOff, wifiOn } from "../../svg.js";
import { html } from "../helpers.js";
import ToggleBtn from "./toggleBtn.js";

class OfflineBtn extends ToggleBtn {
  generateTemplate() {
    const template = document.createElement("template");
    template.innerHTML = html`
    <div class="border-2 border-solid border-grey-mid rounded-full p-2.5 flex cursor-pointer ">
      <label for="offlineBtn" class="hidden pe-3 text-lg sm:block cursor-pointer">
        Offline Mode
      </label>
      <div
        class="relative flex cursor-pointer items-center stroke-black dark:stroke-white "
      >
        <input type="checkbox" id="offlineMode" class="peer/toggle sr-only " />

        ${wifiOn} ${wifiOff}
      </div>
    </div>
    `;
    return template;
  }
}

customElements.define("offline-btn", OfflineBtn);
