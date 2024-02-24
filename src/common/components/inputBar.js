class InputBar extends HTMLElement {
  constructor() {
    super();
    this.tagCount = 0;
  }


  addToInputBar(value) {
    const ul = this.querySelector("ul");
    const li = document.createElement("li");
    const inputTag = document.createElement("input-tag");
    inputTag.text = value;
    li.appendChild(inputTag);
    ul.appendChild(li);
  

    this.tagCount++;
  
    if (this.tagCount >= 7) {
      console.log("Maximum number of tags added");
      const input = document.getElementById("default-input");
      input.disabled = true;
      input.placeholder = "Reached the keyword limit"; // Set placeholder text
    }
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
    const input = document.getElementById("default-input"); 
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
  

    this.addEventListener('tag-removed', () => {
      this.tagCount--;
      if (this.tagCount < 7) {
        input.disabled = false; 
        input.placeholder = ""; 
      }
    });
  }
  

  disconnectedCallback() {
    this.replaceChildren();
    this.replaceWith(this.cloneNode(true));
  }
}

customElements.define("input-bar", InputBar);
