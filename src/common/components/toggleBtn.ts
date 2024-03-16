import { html } from "../helpers.js";

class ToggleButton extends HTMLElement {
  toggleID: string;
  generateTemplate(toggleID: string) {
    const template = document.createElement("template");
    template.innerHTML = html`
      <div class="relative flex cursor-pointer items-center ">
        <input type="checkbox" id="${toggleID}" class="peer/toggle sr-only " />
        <div
          class="h-6 w-10 rounded-full bg-grey-mid peer-checked/toggle:bg-primary-dark @[400px]/main:h-7 @[400px]/main:w-12"
        ></div>
        <div
          class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-all duration-300 ease-out peer-checked/toggle:translate-x-[82%] @[400px]/main:h-6 @[400px]/main:w-6"
        ></div>
      </div>
    `;
    return template;
  }

  get checked() {
    return this.hasAttribute("checked");
  }
  set checked(value) {
    this.toggleAttribute("checked", value);
  }

  static get observedAttributes() {
    return ["checked"];
  }

  disconnectedCallback() {
    this.replaceChildren();
    this.replaceWith(this.cloneNode(true));
  }

  async connectedCallback() {
    this.setAttribute("data-element", "custom");
    this.toggleID = this.getAttribute("toggle-id");
    this.appendChild(
      this.generateTemplate(this.toggleID).content.cloneNode(true)
    );
  }
}

customElements.define("toggle-btn", ToggleButton);

export default ToggleButton;
