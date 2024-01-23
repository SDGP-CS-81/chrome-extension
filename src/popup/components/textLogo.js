import { html } from "../../common/helpers.js";

const generateTemplate = (href) => {
  const template = document.createElement("template");
  template.innerHTML = html`
    <a href="${href}" target="_blank" class="flex items-center">
      <img
        src="../../assets/icons/logo.png"
        alt="ByteSense Logo"
        class="mr-[0.5em] w-[1em]"
      />
      <h5 class="font-medium">ByteSense</h5>
    </a>
  `;
  return template;
};

class TextLogo extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.href = this.getAttribute("href");
    this.appendChild(generateTemplate(this.href).content.cloneNode(true));
  }

  disconnectedCallback() {
    this.replaceChild();
    this.replaceWith(this.cloneNode(true));
  }
}

customElements.define("text-logo", TextLogo);
