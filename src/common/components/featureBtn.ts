import { html } from "../helpers.js";
import { Feature, features } from "../constants.js";

class FeatureBtn extends HTMLElement {
  toggleID: string;
  feature: Feature;

  generateTemplate() {
    const template = document.createElement("template");
    template.innerHTML = html`
      <div
        class="flex h-14 w-full items-center justify-between rounded-lg border border-grey-low bg-secondary-light px-[18px] @[400px]/features:h-20 @[400px]/features:px-[22px] dark:border-grey-high dark:bg-grey-high"
      >
        <div class="flex flex-col">
          <p class="text-base ">${this.feature.featureName}</p>
          <p
            class="hidden text-sm text-grey-mid @[400px]/main:block dark:text-grey-low"
          >
            ${this.feature.description}
          </p>
        </div>
        <feature-toggle toggle-id="${this.toggleID}"></feature-toggle>
      </div>
    `;
    return template;
  }

  connectedCallback() {
    this.toggleID = this.getAttribute("toggle-id");
    this.feature = features[this.toggleID];
    this.appendChild(this.generateTemplate().content.cloneNode(true));
  }

  disconnectedCallback() {
    this.replaceChildren();
    this.replaceWith(this.cloneNode(true));
  }
}

customElements.define("feature-btn", FeatureBtn);
