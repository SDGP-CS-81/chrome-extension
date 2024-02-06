import { html } from "../helpers.js";
import { features } from "../constants.js";

const generateTemplate = (toggleID, feature) => {
  const template = document.createElement("template");
  template.innerHTML = html`
    <div
      class="flex  h-14 w-full items-center justify-between rounded-lg bg-secondary_variant px-[18px] @container/main @[400px]/features:h-20 @[400px]/features:px-[22px]"
    >
      <div class="flex flex-col">
        <p class="text-base">${feature.featureName}</p>
        <p class="hidden text-sm text-lightGrey @[400px]/main:block">
          ${feature.description}
        </p>
      </div>
      <toggle-btn toggle-id="${toggleID}"></toggle-btn>
    </div>
  `;
  return template;
};

class FeatureBtn extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.toggleID = this.getAttribute("toggle-id");
    this.feature = features[this.toggleID];
    this.appendChild(
      generateTemplate(this.toggleID, this.feature).content.cloneNode(true)
    );
  }

  disconnectedCallback() {
    this.replaceChildren();
    this.replaceWith(this.cloneNode(true));
  }
}

customElements.define("feature-btn", FeatureBtn);
