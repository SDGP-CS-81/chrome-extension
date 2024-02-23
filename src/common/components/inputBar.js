class InputBar extends HTMLElement {
  addToInputBar(value) {
    const ul = this.querySelector("ul");
    const li = document.createElement("li");

    const inputTag = document.createElement("input-tag");
    inputTag.text = value; // Update the text property directly
    li.appendChild(inputTag);
    ul.appendChild(li);
  }

  generateTemplate() {
    const template = document.createElement("template");
    template.innerHTML = `
      <ul class="flex flex-wrap justify-center gap-2 items-center">
      </ul>
    `;
    return template;
  }

  async connectedCallback() {
    this.appendChild(this.generateTemplate().content.cloneNode(true));
    this.setUpEventListeners();
  }

  setUpEventListeners() {
    const input = document.getElementById("default-input"); // Target the keywords text area
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === ",") {
        event.preventDefault();
        const value = input.value.trim();
        if (value) {
          console.log("Entered " + value);
          this.addToInputBar(value);
          input.value = "";
        }
      }
    });
  }

  disconnectedCallback() {
    this.replaceChildren();
    this.replaceWith(this.cloneNode(true));
  }
}

customElements.define("input-bar", InputBar);
