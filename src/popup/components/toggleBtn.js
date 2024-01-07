import { getPreferences, setPreferences } from "../../common.js";

const generateTemplate = () => {
  const template = document.createElement("template");
  template.innerHTML = `
    <div class="@container/main w-full flex items-center justify-between p-[18px] @[400px]/main:p-[22px] bg-secondary_variant mb-4">
        <label for="toggle-example" class="flex items-center cursor-pointer relative ">
            <input type="checkbox" id="toggle" class="sr-only peer/toggle ">
            <div class="bg-grey peer-checked/toggle:bg-primary rounded-full h-6 w-10 @[400px]/main:h-7 @[400px]/main:w-12"></div>
            <div class="absolute left-0.5 top-0.5 peer-checked/toggle:translate-x-[82%] bg-white w-5 h-5 @[400px]/main:w-6 @[400px]/main:h-6 rounded-full transition-all duration-300 ease-out"></div>
        </label>
    </div>
        `;
  return template;
};

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
    this.appendChild(generateTemplate().content.cloneNode(true));
    this.toggleID = this.getAttribute("toggle-id");

    getPreferences().then((object) => {
      const preferences = object.preferences;
      console.log(preferences);

      this.checked = preferences[this.toggleID];
    });

    this.addEventListener("click", () => {
      this.checked = !this.checked;
    });

    this.style.width = "100%";
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
