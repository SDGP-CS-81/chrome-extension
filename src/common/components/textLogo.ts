import { html } from "../helpers.js";

class TextLogo extends HTMLElement {
  generateTemplate(url: string) {
    const template = document.createElement("template");
    template.innerHTML = html`
      <a href="${url}" target="_blank" title="${url}" class="flex items-center">
        <img
          src="../../assets/icons/logo.png"
          alt="ByteSense Logo"
          class="mr-[0.5em] w-[1.4em]"
        />
        <h5 class="font-medium text-black dark:text-white">ByteSense</h5>
      </a>
    `;
    return template;
  }

  connectedCallback() {
    const url = "https://www.example.com";
    this.appendChild(this.generateTemplate(url).content.cloneNode(true));
  }

  disconnectedCallback() {
    this.replaceChildren();
    this.replaceWith(this.cloneNode(true));
  }
}

customElements.define("text-logo", TextLogo);
