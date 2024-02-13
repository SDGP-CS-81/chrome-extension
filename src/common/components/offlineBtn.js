import { getPreferences, html, setPreferences } from "../helpers.js";

const generateTemplate = () => {
  const template = document.createElement("template");
  template.innerHTML = html`
    <div class="relative flex cursor-pointer items-center ">
      <input type="checkbox" id="offlineMode" class="peer/toggle sr-only " />
      <svg
        class="h-6 w-6 scale-125 fill-transparent stroke-white peer-checked/toggle:hidden"
        viewBox="0 0 24 24"
        alt="wifi-on"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.7279 13.3866C14.1091 10.7678 9.87561 10.7554 7.27212 13.3589M20.6933 9.44443C15.8921 4.67136 8.10791 4.67136 3.30676 9.44443M13 18C13 18.5523 12.5523 19 12 19C11.4477 19 11 18.5523 11 18C11 17.4477 11.4477 17 12 17C12.5523 17 13 17.4477 13 18Z"
          stroke="inherit"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="inherit"
        />
      </svg>
      <svg
        class="hidden h-6 w-6 scale-125 fill-transparent stroke-white peer-checked/toggle:block"
        viewBox="0 0 24 24"
        alt="wifi-off"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.4361 11.436C9.91587 11.5582 8.43218 12.1989 7.27212 13.3589M20.6933 9.44446C18.0158 6.78263 14.4105 5.60524 10.9123 5.91229M6.94295 6.94292C5.62474 7.53387 4.38985 8.36771 3.30676 9.44446M4.00003 3.99994L18 17.9999M13 17.9999C13 18.5522 12.5523 18.9999 12 18.9999C11.4477 18.9999 11 18.5522 11 17.9999C11 17.4477 11.4477 16.9999 12 16.9999C12.5523 16.9999 13 17.4477 13 17.9999Z"
          stroke="inherit"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="inherit"
        />
      </svg>
    </div>
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
    this.toggleID = "offlineMode";
    this.appendChild(generateTemplate().content.cloneNode(true));

    getPreferences().then((preferences) => {
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
      getPreferences().then(async (preferences) => {
        preferences[this.toggleID] = this.checked;
        await setPreferences(preferences);
        this.querySelector("input").checked = this.checked;
        console.log(preferences);
      });
    }
  }
}

customElements.define("offline-btn", ToggleBtn);
