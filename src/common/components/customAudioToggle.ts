import { getCustomCategories, setCustomCategories } from "../helpers.js";
import AudioToggle from "./audioToggle.js";

class CustomAudioToggle extends AudioToggle {
  async connectedCallback() {
    this.setAttribute("data-element", "custom");
    this.toggleID = this.getAttribute("toggle-id");
    this.appendChild(
      this.generateTemplate(this.toggleID).content.cloneNode(true)
    );

    const customCategories = await getCustomCategories();
    this.checked = customCategories[this.toggleID].audioOnly;

    this.addEventListener("click", () => {
      console.log(`CustomAudioToggle: Toggled, new state: ${!this.checked}`);
      this.checked = !this.checked;
    });
  }

  async attributeChangedCallback(name: string) {
    if (name === "checked") {
      const customCategories = await getCustomCategories();
      customCategories[this.toggleID].audioOnly = this.checked;
      await setCustomCategories(customCategories);
      const hiddenInput = this.querySelector("input");
      if (hiddenInput) hiddenInput.checked = this.checked;
    }
  }
}

customElements.define("custom-audio-toggle", CustomAudioToggle);
