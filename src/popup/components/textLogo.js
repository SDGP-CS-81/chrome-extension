import { html } from "../../common.js";

const generateTemplate = () => {
  const template = document.createElement("template");
  template.innerHTML = html`
    <a href="https://www.google.com" target="_blank" class="flex items-center">
      <img
        src="../../../assets/icons/logo.png"
        alt="ByteSense Logo"
        class="mr-2 w-[22px]"
      />
      <h5 class="text-lg font-medium">ByteSense</h5>
    </a>
  `;
  return template;
};

class TextLogo extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.appendChild(generateTemplate().content.cloneNode(true));
  }
}

customElements.define("text-logo", TextLogo);
