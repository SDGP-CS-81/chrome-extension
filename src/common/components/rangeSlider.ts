import { getPreferences, html, setPreferences } from "../helpers.js";

class RangeSlider extends HTMLElement {
  rangeId: string;
  value: number;

  generateTemplate() {
    const template = document.createElement("template");
    template.innerHTML = html`
      <div class="flex items-center gap-2">
        <input
          class="w-60"
          type="range"
          min="5"
          max="300"
          step="5"
          value="${this.value.toString()}"
        />
        <p id="value-display" class="w-[4ch] text-end font-azeretmono text-lg">
          ${this.value + "s"}
        </p>
      </div>
    `;
    return template;
  }

  async connectedCallback() {
    this.setAttribute("data-element", "custom");
    this.rangeId = this.getAttribute("range-id");

    const preferences = await getPreferences();
    this.value = preferences.features.audioOnlyBackgroundTimeout;
    this.appendChild(this.generateTemplate().content.cloneNode(true));

    const rangeInput = this.querySelector("input");
    rangeInput.addEventListener("input", this.update.bind(this));
  }

  async update(e: Event) {
    const rangeInput = e.target as HTMLInputElement;
    this.value = parseInt(rangeInput.value);

    const valueDisplay = this.querySelector("#value-display");
    valueDisplay.innerHTML = rangeInput.value + "s";

    const preferences = await getPreferences();
    preferences.features.audioOnlyBackgroundTimeout = this.value;
    setPreferences(preferences);
  }

  disconnectedCallback() {
    this.replaceChildren();
    this.replaceWith(this.cloneNode(true));
  }
}

customElements.define("range-slider", RangeSlider);
