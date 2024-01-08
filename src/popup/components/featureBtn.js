import { html } from "../../common.js";
import { features } from "../../features.js";

const generateTemplate = (toggleID, featureName) => {
  const template = document.createElement("template");
  template.innerHTML = html`
    <div
      class="mb-4 flex w-full items-center justify-between rounded-lg bg-secondary_variant p-[18px] @container/main @[400px]/main:p-[22px]"
    >
      <p class="text-[18px]">${featureName}</p>
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
    this.featureName = features[this.toggleID].featureName;
    this.appendChild(
      generateTemplate(this.toggleID, this.featureName).content.cloneNode(true)
    );
  }

  disconnectedCallback() {
    this.replaceChildren();
    this.replaceWith(this.cloneNode(true));
  }
}

customElements.define("feature-btn", FeatureBtn);
