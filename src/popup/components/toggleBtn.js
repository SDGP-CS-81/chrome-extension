const template = document.createElement("template");
template.innerHTML = `
    <label for="toggle-example" class="flex items-center cursor-pointer relative mb-4">
        <input type="checkbox" id="toggle" class="sr-only peer/toggle" checked>
        <div class="bg-grey peer-checked/toggle:bg-primary border border-gray-200 h-7 w-12 rounded-full"></div>
        <div class="absolute left-1 peer-checked/toggle:right-1 peer-checked/toggle:left-auto top-1 bg-white w-5 h-5 rounded-full transition"></div>
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
