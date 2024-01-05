const template = document.createElement("template");
template.innerHTML = `
    <label for="toggle-example" class="flex items-center cursor-pointer relative mb-4">
        <input type="checkbox" id="toggle" class="sr-only peer/toggle" checked>
        <div class="bg-grey peer-checked/toggle:bg-primary h-7 w-12 rounded-full"></div>
        <div class="absolute left-0.5 peer-checked/toggle:translate-x-[82%] top-0.5 bg-white w-6 h-6 rounded-full transition-all duration-300 ease-out"></div>
    </label>
    `;

class ToggleBtn extends HTMLElement {
  constructor() {
    super();
    // this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.appendChild(template.content.cloneNode(true));
    this.addEventListener("click", () => {
      this.querySelector("input").checked =
        !this.querySelector("input").checked;
    });
  }

  observedAttributes() {
    return ["checked"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "checked") {
    }
  }
}
customElements.define("toggle-btn", ToggleBtn);
