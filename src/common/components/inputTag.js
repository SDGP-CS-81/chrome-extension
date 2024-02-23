class InputTag extends HTMLElement {
  constructor(text) {
    super();
    this.text = this.getAttribute("text") || "Default Text";
  }

  generateTemplate() {
    const template = document.createElement("template");
    template.innerHTML = `
          <p>
            <span class="bg-gray-600 p-2 rounded inline-flex items-center m-1">
              ${this.text}
              <span class="text-red-500 ml-2 close-icon">&#10060;</span>
            </span>
          </p>
        `;
    return template;
  }

  connectedCallback() {
    if (this.hasChildNodes()) {
      this.replaceChild(this.generateTemplate().content.cloneNode(true), this.firstChild);
    } else {
      this.appendChild(this.generateTemplate().content.cloneNode(true));
    }
    this.setUpEventListeners();
  }

  setUpEventListeners() {
    const closeButton = this.querySelector(".close-icon");
    closeButton.style.cursor = "pointer"; // Set mouse pointer instead of cursor
    closeButton.addEventListener("click", () => {
      const inputBox = document.createElement("input");
      inputBox.type = "text";
      inputBox.value = this.text;
      this.parentNode.removeChild(this);
    });
  }

  disconnectedCallback() {
    this.replaceChildren();
    this.replaceWith(this.cloneNode(true));
  }
}

customElements.define("input-tag", InputTag);
