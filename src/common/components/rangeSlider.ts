import { getPreferences, html, setPreferences } from "../helpers.js";

class RangeSlider extends HTMLElement {
  rangeId: string;
  value: number;

  generateTemplate() {
    const template = document.createElement("template");
    template.innerHTML = html`
      <div class="flex w-full items-center gap-2">
        <p
          id="value-display"
          class="w-10 rounded-md border border-black px-1 text-end font-azeretmono text-base dark:border-white"
        >
          ${this.value + "s"}
        </p>
        <input
          class="custom-slider w-40"
          type="range"
          min="0"
          max="60"
          step="2"
          value="${this.value.toString()}"
        />
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

    console.log(`RangeSlider: Value changed, value: ${this.value}`);

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
