import { getPreferences, html, setPreferences } from "../../common.js";

const generateTemplate = () => {
  const template = document.createElement("template");
  template.innerHTML = html`
    <div
      class="mb-4 flex w-full items-center justify-between rounded-lg bg-secondary_variant p-[18px] @container/main @[400px]/main:p-[22px]"
    >
      <p class="text-[18px]">Audio Only</p>
      <label
        for="toggle-example"
        class="relative flex cursor-pointer items-center "
      >
        <input type="checkbox" id="toggle" class="peer/toggle sr-only " />
        <div
          class="h-6 w-10 rounded-full bg-grey peer-checked/toggle:bg-primary @[400px]/main:h-7 @[400px]/main:w-12"
        ></div>
        <div
          class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-all duration-300 ease-out peer-checked/toggle:translate-x-[82%] @[400px]/main:h-6 @[400px]/main:w-6"
        ></div>
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
