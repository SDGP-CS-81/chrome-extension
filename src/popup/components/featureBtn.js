import { html } from "../../common.js";
import { features } from "../../features.js";

const generateTemplate = (toggleID, featureName) => {
  const template = document.createElement("template");
  template.innerHTML = html`
    <div
      class="flex h-14 w-full items-center justify-between rounded-lg bg-secondary_variant px-[18px] @container/main @[400px]/main:px-[22px]"
    >
      <p class="text-base">${featureName}</p>
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
