import { getPreferences, html, setPreferences, setTheme } from "../helpers.js";

const generateTemplate = () => {
  const template = document.createElement("template");
  template.innerHTML = html`
    <div class="relative flex cursor-pointer items-center ">
      <input type="checkbox" id="offlineMode" class="peer/toggle sr-only " />

      <svg
        class="h-7 w-7 peer-checked/toggle:hidden"
        viewBox="0 0 34 34"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          class="fill-secondary-dark"
          d="M12.7498 26.9167C12.7498 28.1067 12.934 29.2683 13.274 30.345C7.834 28.4608 3.72566 23.46 3.30066 17.6092C2.87566 11.39 6.45983 5.58166 12.254 3.14499C13.7557 2.52166 14.5207 2.97499 14.8465 3.30083C15.1582 3.61249 15.5973 4.36333 14.974 5.79416C14.3365 7.26749 14.0248 8.82582 14.0248 10.4408C14.039 13.3308 15.1723 16.0083 17.014 18.0625C14.4215 20.1308 12.7498 23.3325 12.7498 26.9167Z"
        />
        <path
          class="fill-primary-dark"
          d="M30.0475 25.1033C27.2425 28.9142 22.7942 31.1525 18.0483 31.1525C17.8217 31.1525 17.595 31.1383 17.3683 31.1242C15.9517 31.0675 14.5775 30.7983 13.2742 30.345C12.9342 29.2683 12.75 28.1067 12.75 26.9167C12.75 23.3325 14.4217 20.1308 17.0142 18.0625C19.0967 20.4 22.0858 21.9158 25.3867 22.0575C26.2792 22.1 27.1717 22.0292 28.05 21.8733C29.6367 21.59 30.2742 22.185 30.5008 22.5675C30.7417 22.95 30.9967 23.7858 30.0475 25.1033Z"
        />
      </svg>
      <svg
        class="hidden h-7 w-7 fill-white peer-checked/toggle:block"
        viewBox="0 0 34 34"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.9999 26.9167C22.4767 26.9167 26.9166 22.4768 26.9166 17C26.9166 11.5232 22.4767 7.08334 16.9999 7.08334C11.5231 7.08334 7.08325 11.5232 7.08325 17C7.08325 22.4768 11.5231 26.9167 16.9999 26.9167Z"
        />
        <path
          d="M17.0001 32.5267C16.2209 32.5267 15.5834 31.9459 15.5834 31.1667V31.0534C15.5834 30.2742 16.2209 29.6367 17.0001 29.6367C17.7792 29.6367 18.4167 30.2742 18.4167 31.0534C18.4167 31.8325 17.7792 32.5267 17.0001 32.5267ZM27.1151 28.5317C26.7467 28.5317 26.3926 28.39 26.1092 28.1209L25.9251 27.9367C25.3726 27.3842 25.3726 26.4917 25.9251 25.9392C26.4776 25.3867 27.3701 25.3867 27.9226 25.9392L28.1067 26.1234C28.6592 26.6759 28.6592 27.5684 28.1067 28.1209C27.8376 28.39 27.4834 28.5317 27.1151 28.5317ZM6.88508 28.5317C6.51675 28.5317 6.16258 28.39 5.87925 28.1209C5.32675 27.5684 5.32675 26.6759 5.87925 26.1234L6.06341 25.9392C6.61591 25.3867 7.50841 25.3867 8.06091 25.9392C8.61341 26.4917 8.61341 27.3842 8.06091 27.9367L7.87675 28.1209C7.60758 28.39 7.23925 28.5317 6.88508 28.5317ZM31.1667 18.4167H31.0534C30.2742 18.4167 29.6367 17.7792 29.6367 17C29.6367 16.2209 30.2742 15.5834 31.0534 15.5834C31.8326 15.5834 32.5267 16.2209 32.5267 17C32.5267 17.7792 31.9459 18.4167 31.1667 18.4167ZM2.94675 18.4167H2.83341C2.05425 18.4167 1.41675 17.7792 1.41675 17C1.41675 16.2209 2.05425 15.5834 2.83341 15.5834C3.61258 15.5834 4.30675 16.2209 4.30675 17C4.30675 17.7792 3.72591 18.4167 2.94675 18.4167ZM26.9309 8.48585C26.5626 8.48585 26.2084 8.34419 25.9251 8.07502C25.3726 7.52252 25.3726 6.63002 25.9251 6.07752L26.1092 5.89335C26.6617 5.34085 27.5542 5.34085 28.1067 5.89335C28.6592 6.44585 28.6592 7.33835 28.1067 7.89085L27.9226 8.07502C27.6534 8.34419 27.2992 8.48585 26.9309 8.48585ZM7.06925 8.48585C6.70091 8.48585 6.34675 8.34419 6.06341 8.07502L5.87925 7.87669C5.32675 7.32419 5.32675 6.43169 5.87925 5.87919C6.43175 5.32669 7.32425 5.32669 7.87675 5.87919L8.06091 6.06335C8.61341 6.61585 8.61341 7.50835 8.06091 8.06085C7.79175 8.34419 7.42341 8.48585 7.06925 8.48585ZM17.0001 4.30669C16.2209 4.30669 15.5834 3.72585 15.5834 2.94669V2.83335C15.5834 2.05419 16.2209 1.41669 17.0001 1.41669C17.7792 1.41669 18.4167 2.05419 18.4167 2.83335C18.4167 3.61252 17.7792 4.30669 17.0001 4.30669Z"
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
    this.setAttribute("data-element", "custom");
    this.toggleID = "theme";
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
        const hiddenInput = this.querySelector("input");
        if (hiddenInput) hiddenInput.checked = this.checked;

        setTheme(this.checked);
      });
    }
  }
}

customElements.define("theme-btn", ToggleBtn);

// set the mode for the page
setTheme();
