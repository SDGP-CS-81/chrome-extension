import { html } from "../../common/helpers.js";

const generateTemplate = () => {
  const template = document.createElement("template");
  template.innerHTML = html`
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="h-6 w-6 cursor-pointer fill-white"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
      />
    </svg>
  `;
  return template;
};

class SettingsBtn extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.appendChild(generateTemplate().content.cloneNode(true));

    this.addEventListener("click", this.defaultClickHandler);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.defaultClickHandler);

    this.replaceChild();
    this.replaceWith(this.cloneNode(true));
  }

  defaultClickHandler() {
    chrome.runtime.openOptionsPage();
  }
}

customElements.define("settings-btn", SettingsBtn);
