import { getPreferences, html, setPreferences } from "../../common.js";

const generateTemplate = (toggleID) => {
  const template = document.createElement("template");
  template.innerHTML = html`
    <label
      for="toggle-example"
      class="relative flex cursor-pointer items-center "
    >
      <input type="checkbox" id="${toggleID}" class="peer/toggle sr-only " />
      <div
        class="h-6 w-10 rounded-full bg-grey peer-checked/toggle:bg-primary @[400px]/main:h-7 @[400px]/main:w-12"
      ></div>
      <div
        class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-all duration-300 ease-out peer-checked/toggle:translate-x-[82%] @[400px]/main:h-6 @[400px]/main:w-6"
      ></div>
    </label>
  `;
  return template;
};

class ToggleBtn extends HTMLElement {
  constructor() {
    super();
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

  connectedCallback() {
    this.toggleID = this.getAttribute("toggle-id");
    this.appendChild(generateTemplate(this.toggleID).content.cloneNode(true));

    getPreferences().then((object) => {
      const preferences = object.preferences;
      console.log(preferences);

      this.checked = preferences[this.toggleID];
    });

    this.addEventListener("click", () => {
      this.checked = !this.checked;
    });
  }

  disconnectedCallback() {
    this.replaceChildren();
    this.replaceWith(this.cloneNode(true));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "checked") {
      getPreferences().then(async (object) => {
        const preferences = object.preferences;
        preferences[this.toggleID] = this.checked;
        await setPreferences(preferences);
        this.querySelector("input").checked = this.checked;
        console.log(preferences);
      });
    }
  }
}

customElements.define("toggle-btn", ToggleBtn);
