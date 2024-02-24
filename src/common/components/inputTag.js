class InputTag extends HTMLElement {
  constructor(text) {
    super();
    this.tagCount = 0;
    this.text = this.getAttribute("text") || "Default Text";
  }
  

  generateTemplate() {
    const template = document.createElement("template");
    template.innerHTML = `
          <p>
            <span class="bg-gray-600 p-2 rounded inline-flex items-center m-2">
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
    closeButton.style.cursor = "pointer";
    closeButton.addEventListener("click", () => {
      // Dispatch a custom event from the removed tag
      this.dispatchEvent(new CustomEvent('tag-removed', { bubbles: true }));
      this.remove(); // Remove the tag element
    });
  }


  disconnectedCallback() {
    this.replaceChildren();
    this.replaceWith(this.cloneNode(true));
  }
}

customElements.define("input-tag", InputTag);
