import { getPreferences, setPreferences } from "../../common.js";

const template = document.createElement("template");
template.innerHTML = `
    <label for="toggle-example" class="flex items-center cursor-pointer relative mb-4">
        <input type="checkbox" id="toggle" class="sr-only peer/toggle ">
        <div class="bg-grey peer-checked/toggle:bg-primary h-7 w-12 rounded-full"></div>
        <div class="absolute  left-0.5 peer-checked/toggle:translate-x-[82%] top-0.5 bg-white w-6 h-6 rounded-full transition-all duration-300 ease-out"></div>
    </label>
    `;

class ToggleBtn extends HTMLElement {
  constructor() {
    super();
    // this.attachShadow({ mode: "open" });
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
    this.appendChild(template.content.cloneNode(true));
    this.toggleID = this.getAttribute("toggle-id");

    getPreferences().then((object) => {
      const preferences = object.preferences;
      console.log(preferences);

      this.checked = preferences[this.toggleID];
    });

    this.addEventListener("click", () => {
      this.checked = !this.checked;
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "checked") {
      getPreferences().then(async (object) => {
        const preferences = object.preferences;
        preferences[this.toggleID] = this.checked;
        await setPreferences(preferences);
        this.querySelector("input").checked = this.checked;
      });
    }
  }
}
customElements.define("toggle-btn", ToggleBtn);
